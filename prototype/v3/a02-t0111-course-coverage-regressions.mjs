import assert from 'node:assert/strict';
import {
  getV3SkillDefinition,
  V3_GAME_QUALIFICATIONS,
  V3_METAL_OCCUPATIONS,
  V3_SYNTHETIC_SKILL_COURSES,
} from '../v3-occupational-competencies.js';
import { createV3ProductState, completeV3SyntheticSkillCourse } from '../v3-product-lifecycle.js';
import { renderOwnProducts } from './run.js';
import { createDocumentedMarketFixture } from './market.js';

const requiredFamilies = [...new Set(V3_METAL_OCCUPATIONS.flatMap(row => row.skills.map(item => item.id)))].sort();
const coursesBySkill = new Map();
for (const course of V3_SYNTHETIC_SKILL_COURSES) {
  assert.equal(course.sourceType, 'synthetic_training_option');
  assert.equal(course.credentialEffect, 'none');
  assert.equal(course.financialEffect, 'none');
  assert.equal(course.awards.kind, 'game_skill');
  assert.ok(getV3SkillDefinition(course.awards.skillId), `${course.id} awards a catalogued skill`);
  assert.ok(!coursesBySkill.has(course.awards.skillId), `one synthetic path per skill target: ${course.awards.skillId}`);
  coursesBySkill.set(course.awards.skillId, course);
  for (const prerequisite of course.prerequisites) {
    assert.ok(getV3SkillDefinition(prerequisite.skillId), `${course.id} prerequisite is in the occupational catalog`);
  }
}
for (const skillId of requiredFamilies) assert.ok(coursesBySkill.has(skillId), `course exists for ${skillId}`);

// Validate the skill progression graph is acyclic and every course is reachable
// from the one declared no-prerequisite foundation course.
const visiting = new Set();
const visited = new Set();
function visit(skillId) {
  if (visiting.has(skillId)) throw new Error(`synthetic course cycle at ${skillId}`);
  if (visited.has(skillId)) return;
  visiting.add(skillId);
  const course = coursesBySkill.get(skillId);
  for (const prerequisite of course?.prerequisites ?? []) {
    if (coursesBySkill.has(prerequisite.skillId)) visit(prerequisite.skillId);
  }
  visiting.delete(skillId);
  visited.add(skillId);
}
for (const skillId of coursesBySkill.keys()) visit(skillId);
const reachable = new Set();
let changed = true;
while (changed) {
  changed = false;
  for (const course of V3_SYNTHETIC_SKILL_COURSES) {
    if (course.prerequisites.every(row => reachable.has(row.skillId)) && !reachable.has(course.awards.skillId)) {
      reachable.add(course.awards.skillId);
      changed = true;
    }
  }
}
assert.equal(reachable.size, V3_SYNTHETIC_SKILL_COURSES.length, 'all synthetic course outcomes are reachable from the foundation');

assert.deepEqual([...coursesBySkill.keys()].sort(), requiredFamilies, 'every occupational skill has exactly one synthetic course path');
assert.ok(V3_GAME_QUALIFICATIONS.some(row => row.id === 'welding-iso-9606'));

let state = createV3ProductState({
  runId: 'a02-t0111-course-coverage', currentDate: '2027-01-04',
  people: [{ id: 'P1', displayName: 'Lernpfad-Test', hoursPerDay: 8, skills: [], skillLevels: {}, qualifications: [], trainerQualified: false }],
  equipment: [], materials: [], finishedGoodsCapacity: 1, finishedGoodsUsed: 0, commitments: [],
});
const originalQualifications = structuredClone(state.people[0].qualifications);
const originalEquipment = structuredClone(state.equipment);
const pending = new Set(V3_SYNTHETIC_SKILL_COURSES.map(row => row.id));
let completionSequence = 0;
while (pending.size) {
  const course = V3_SYNTHETIC_SKILL_COURSES.find(row => pending.has(row.id)
    && row.prerequisites.every(requirement => Number(state.people[0].skillLevels?.[requirement.skillId] ?? 0) >= requirement.minimumLevel));
  assert.ok(course, `a remaining course becomes available (pending: ${[...pending].join(', ')})`);
  state = completeV3SyntheticSkillCourse(state, {
    completionId: `TRAINING|${++completionSequence}|${course.id}|P1`, courseId: course.id, personId: 'P1',
  });
  pending.delete(course.id);
}
for (const skillId of requiredFamilies) assert.equal(state.people[0].skillLevels[skillId], 2, `${skillId} reaches the occupational profile level`);
assert.deepEqual(state.people[0].qualifications, originalQualifications, 'course progression does not grant formal qualifications');
assert.deepEqual(state.equipment, originalEquipment, 'course progression does not grant equipment or access');

const rootCourse = coursesBySkill.get('technical_drawing');
assert.equal(rootCourse.prerequisites.length, 0, 'technical drawing is an explicitly named foundation course');
const uiState = createV3ProductState({
  runId: 'a02-t0111-foundation-ui', currentDate: '2027-01-04',
  people: [{ id: 'P2', displayName: 'Grundkurs-Test', hoursPerDay: 8, skills: [], skillLevels: {}, qualifications: [], trainerQualified: false }],
  equipment: [], materials: [], finishedGoodsCapacity: 1, finishedGoodsUsed: 0, commitments: [],
});
const ui = renderOwnProducts(uiState, createDocumentedMarketFixture().state, true);
assert.match(ui, /Grundkurs Technische Zeichnungen lesen/);
assert.match(ui, /keine Vorkenntnisse im Spielmodell \(Grundkurs\)/);
assert.match(ui, /Grundkurs-Test/);
console.log('A02 T-0111 synthetic course coverage and reachability: PASS');
