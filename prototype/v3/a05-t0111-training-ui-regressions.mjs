import assert from 'node:assert/strict';
import { renderOwnProducts, createRunFromInputs, installRunOperatingResources, createFinanceStateForRun, createRunSaveEnvelope, restoreRunSaveEnvelope } from './run.js';
import { createV3ProductState, completeV3SyntheticSkillCourse } from '../v3-product-lifecycle.js';
import { createDocumentedMarketFixture } from './market.js';

const initial = createV3ProductState({
  runId: 'a05-t0111-training-ui', currentDate: '2027-01-04',
  people: [{ id: 'P1', displayName: 'Testperson', hoursPerDay: 8, skills: ['turning_manual'], skillLevels: { turning_manual: 2 }, qualifications: ['workplace-safety'], trainerQualified: false }],
  equipment: [{ id: 'M1', hoursPerDay: 8, capabilities: ['manual-lathe'] }],
  materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 10, finishedGoodsUsed: 0, commitments: [],
});
const market = createDocumentedMarketFixture().state;
const active = renderOwnProducts(initial, market, true);
assert.match(active, /Weiterbildung · Spielsimulation/);
assert.match(active, /synthetic-skill-course-form/);
assert.match(active, /Aufbaukurs Baugruppenmontage/);
assert.match(active, /Aufbaukurs Messen und Prüfen/);
assert.match(active, /synthetic-course-machine-operation/);
assert.match(active, /Grundkurs Maschinenbedienung/);
assert.match(active, /Testperson/);
assert.match(active, /Präzisionsdrehen Stufe 2/);
assert.match(active, /kein Zertifikat, keine AEVO-\/Befähigungsprüfung und verleihen keinen Maschinenzugang/);
assert.match(active, /keine Kosten oder Arbeitsstunden/);

const courseCard = (html, label) => {
  const heading = html.indexOf(`<h3>${label}</h3>`);
  assert.notEqual(heading, -1, `course card is rendered: ${label}`);
  const start = html.lastIndexOf('<article class="card synthetic-course-card">', heading);
  const end = html.indexOf('</article>', heading);
  assert.ok(start >= 0 && end > heading, `complete course card is rendered: ${label}`);
  return html.slice(start, end + '</article>'.length);
};const inactive = renderOwnProducts(initial, market, false);
assert.doesNotMatch(inactive, /synthetic-skill-course-form/);
assert.match(inactive, /nur an einem geöffneten Simulationstag/);

const trained = completeV3SyntheticSkillCourse(initial, {
  completionId: 'TRAINING|a05-t0111-training-ui|synthetic-course-precision-turning|P1',
  courseId: 'synthetic-course-precision-turning', personId: 'P1',
});
const trainedUi = renderOwnProducts(trained, market, true);
assert.doesNotMatch(trainedUi, /name="courseId" value="synthetic-course-precision-turning"/);
assert.match(trainedUi, /name="courseId" value="synthetic-course-machine-operation"/);
assert.match(trainedUi, /Im aktuellen Lauf abgeschlossen/);
assert.match(trainedUi, /Testperson · Präzisionsdrehen Stufe 2 · 2027-01-04/);
assert.match(trainedUi, /Spielkompetenz/);

const unqualified = createV3ProductState({
  runId: 'a05-t0111-training-ineligible', currentDate: '2027-01-04',
  people: [{ id: 'P2', displayName: 'Ohne Voraussetzung', hoursPerDay: 8, skills: [], skillLevels: {}, qualifications: [], trainerQualified: false }],
  equipment: [], materials: [], finishedGoodsCapacity: 1, finishedGoodsUsed: 0, commitments: [],
});
const blockedUi = renderOwnProducts(unqualified, market, true);
const blockedPrecisionTurningCard = courseCard(blockedUi, 'Aufbaukurs Präzisionsdrehen (synthetisches Spielangebot)');
assert.doesNotMatch(blockedPrecisionTurningCard, /synthetic-skill-course-form/);
assert.match(blockedPrecisionTurningCard, /Voraussetzung: Konventionell drehen Stufe 2/);

const drawingQualified = createV3ProductState({
  runId: 'a05-t0111-training-paths', currentDate: '2027-01-04',
  people: [{ id: 'P3', displayName: 'Fachkraft Zeichnung', hoursPerDay: 8, skills: ['technical_drawing'], skillLevels: { technical_drawing: 2 }, qualifications: ['workplace-safety'], trainerQualified: false }],
  equipment: [{ id: 'M3', hoursPerDay: 8, capabilities: ['assembly-bench'] }],
  materials: [], finishedGoodsCapacity: 1, finishedGoodsUsed: 0, commitments: [],
});
const pathsUi = renderOwnProducts(drawingQualified, market, true);
assert.match(pathsUi, /synthetic-course-assembly-basics/);
assert.match(pathsUi, /synthetic-course-metrology-basics/);
assert.match(pathsUi, /synthetic-course-welding-basics/);
const assemblyTrained = completeV3SyntheticSkillCourse(drawingQualified, {
  completionId: 'TRAINING|a05-t0111-training-paths|synthetic-course-assembly-basics|P3',
  courseId: 'synthetic-course-assembly-basics', personId: 'P3',
});
assert.equal(assemblyTrained.people[0].skillLevels.mechanical_assembly, 2);
assert.deepEqual(assemblyTrained.people[0].qualifications, drawingQualified.people[0].qualifications);
assert.deepEqual(assemblyTrained.equipment, drawingQualified.equipment);
const pneumaticAfterAssembly = renderOwnProducts(assemblyTrained, market, true);
assert.match(pneumaticAfterAssembly, /synthetic-course-pneumatics-basics/);

// Each recently added course must explain each participant's state accurately.
// These are rendered UI assertions, not an interactive browser smoke.
const newCourses = [
  {
    id: 'synthetic-course-welding-basics',
    label: 'Grundkurs MAG-Fügen (synthetisches Spielangebot)',
    prerequisiteSkill: 'technical_drawing',
    prerequisiteLevel: 1,
    awardSkill: 'welding_migmag',
    awardLevel: 2,
    prerequisiteLabel: 'Technische Zeichnung lesen Stufe 1',
  },
  {
    id: 'synthetic-course-pneumatics-basics',
    label: 'Aufbaukurs Pneumatikmontage (synthetisches Spielangebot)',
    prerequisiteSkill: 'mechanical_assembly',
    prerequisiteLevel: 2,
    awardSkill: 'pneumatics',
    awardLevel: 2,
    prerequisiteLabel: 'Maschinen und Baugruppen montieren Stufe 2',
  },
];

const noTeamState = createV3ProductState({
  runId: 'a05-t0111-no-team', currentDate: '2027-01-04', people: [],
  equipment: [], materials: [], finishedGoodsCapacity: 0, finishedGoodsUsed: 0, commitments: [],
});
const noTeamUi = renderOwnProducts(noTeamState, market, true);
for (const course of newCourses) {
  const noTeamCard = courseCard(noTeamUi, course.label);
  assert.doesNotMatch(noTeamCard, /synthetic-skill-course-form/);
  assert.match(noTeamCard, /Derzeit ist kein Teammitglied im Betrieb\./);
}
const skillState = (runId, skills, skillLevels = {}) => createV3ProductState({
  runId, currentDate: '2027-01-04',
  people: [{ id: 'PX', displayName: 'Kurs-Testperson', hoursPerDay: 8, skills, skillLevels, qualifications: [], trainerQualified: false }],
  equipment: [], materials: [], finishedGoodsCapacity: 1, finishedGoodsUsed: 0, commitments: [],
});
for (const course of newCourses) {
  const availableState = skillState(`a05-${course.id}-available`, [], { [course.prerequisiteSkill]: course.prerequisiteLevel });
  const availableCard = courseCard(renderOwnProducts(availableState, market, true), course.label);
  assert.match(availableCard, new RegExp(`name="courseId" value="${course.id}"`));
  assert.match(availableCard, /Kurs-Testperson/);

  const missingState = skillState(`a05-${course.id}-missing`, []);
  const missingCard = courseCard(renderOwnProducts(missingState, market, true), course.label);
  assert.doesNotMatch(missingCard, /synthetic-skill-course-form/);
  assert.match(missingCard, /Kurs-Testperson: Voraussetzung fehlt/);
  assert.ok(missingCard.includes(course.prerequisiteLabel), `${course.id} names its actual missing prerequisite`);

  const sufficientState = skillState(`a05-${course.id}-sufficient`, [], {
    [course.prerequisiteSkill]: course.prerequisiteLevel,
    [course.awardSkill]: course.awardLevel,
  });
  const sufficientCard = courseCard(renderOwnProducts(sufficientState, market, true), course.label);
  assert.doesNotMatch(sufficientCard, /synthetic-skill-course-form/);
  assert.match(sufficientCard, /Kurs-Testperson: Fähigkeit bereits auf der erforderlichen Stufe/);

  const completedState = completeV3SyntheticSkillCourse(availableState, {
    completionId: `TRAINING|a05-${course.id}-completed|${course.id}|PX`,
    courseId: course.id, personId: 'PX',
  });
  const completedCard = courseCard(renderOwnProducts(completedState, market, true), course.label);
  assert.doesNotMatch(completedCard, /synthetic-skill-course-form/);
  assert.match(completedCard, /Kurs-Testperson: Kurs bereits abgeschlossen/);
  assert.match(completedCard, /Im aktuellen Lauf abgeschlossen/);
}
// Outer Run + Finance save/restore E2E: use the existing neutral 2027 run fixture,
// with no additional finance values or postings introduced by synthetic training.
// One representative course is sufficient here because every catalog entry uses the same
// completion API; course-specific UI states are covered separately in the loop above, and
// A02's module-level suite covers the full 29-course catalog.
let envelopeRun = createRunFromInputs({
  scenarioId: 'A05-T0111-COURSE-ENVELOPE', seed: 'a05-course-save-1',
  startDate: '2027-01-04', endDate: '2027-01-29', macroPath: 'UPSWING',
});
envelopeRun = installRunOperatingResources(envelopeRun, {
  people: [{ id: 'PE1', displayName: 'Envelope Testperson', hoursPerDay: 8,
    skills: ['technical_drawing'], skillLevels: { technical_drawing: 1 },
    qualifications: ['workplace-safety'], trainerQualified: false }],
  equipment: [{ id: 'EQ1', hoursPerDay: 8, capabilities: ['manual-lathe'] }],
  materials: [], commitments: [], finishedGoodsCapacity: 0, finishedGoodsUsed: 0,
});
const envelopeFinance = createFinanceStateForRun(envelopeRun);
assert.ok(envelopeFinance, 'the documented default run profile supplies its established finance state');
const equipmentBeforeCourse = structuredClone(envelopeRun.modules.product.equipment);
const qualificationsBeforeCourse = structuredClone(envelopeRun.modules.product.people[0].qualifications);
const trainerStatusBeforeCourse = envelopeRun.modules.product.people[0].trainerQualified;
const financeStateBeforeCourse = JSON.parse(JSON.stringify(envelopeFinance));
const trainedEnvelopeRun = structuredClone(envelopeRun);
trainedEnvelopeRun.modules.product = completeV3SyntheticSkillCourse(trainedEnvelopeRun.modules.product, {
  completionId: 'TRAINING|a05-course-envelope|synthetic-course-welding-basics|PE1',
  courseId: 'synthetic-course-welding-basics', personId: 'PE1',
});
const outerEnvelope = createRunSaveEnvelope(trainedEnvelopeRun, envelopeFinance);
const restoredOuterEnvelope = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(outerEnvelope)));
const restoredProduct = restoredOuterEnvelope.runState.modules.product;
assert.equal(restoredProduct.people.find(person => person.id === 'PE1')?.skillLevels?.welding_migmag, 2);
assert.equal(restoredProduct.syntheticTrainingCompletions.filter(row => row.completionId === 'TRAINING|a05-course-envelope|synthetic-course-welding-basics|PE1').length, 1);
const restoredCourseEvents = restoredProduct.events.filter(event => event.type === 'synthetic_skill_course_completed');
assert.equal(restoredCourseEvents.length, 1);
assert.equal(restoredCourseEvents[0].courseId, 'synthetic-course-welding-basics');
assert.equal(restoredCourseEvents[0].credentialEffect, 'none');
assert.equal(restoredCourseEvents[0].financialEffect, 'none');
assert.deepEqual(restoredProduct.equipment, equipmentBeforeCourse);
assert.deepEqual(restoredProduct.people.find(person => person.id === 'PE1')?.qualifications, qualificationsBeforeCourse);
assert.equal(restoredProduct.people.find(person => person.id === 'PE1')?.trainerQualified, trainerStatusBeforeCourse);
assert.deepEqual(restoredOuterEnvelope.financeState, financeStateBeforeCourse, 'the complete finance state is unchanged across course completion and outer JSON restore');
assert.equal(restoredOuterEnvelope.financeWarning, null);
console.log('A05 T-0111 synthetic training UI regression: PASS');
