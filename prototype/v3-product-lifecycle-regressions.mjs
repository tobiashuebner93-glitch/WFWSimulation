import assert from 'node:assert/strict';
import {
  createV3ProductState as createProductState, createV3Product, defineV3ProductSteps, estimateV3Product,
  planV3ProductStep, completeV3ProductStep, cancelV3ProductStep, advanceV3ProductDate, getV3ProductMarketOpportunities,
  planV3CustomerWorkOrder, completeV3CustomerWorkOrderOperation,
  placeV3InternationalMaterialOrder, receiveV3InternationalMaterialShipment,
  submitV3ProductSaleOffer, decideV3ProductSaleOffer, dispatchV3ProductSale, validateV3ProductWorkdayAssignments,
  estimateV3ProductWithBab, completeV3SyntheticSkillCourse, planV3EquipmentInstruction, recordV3EquipmentInstruction,
} from './v3-product-lifecycle.js';
import { createDocumentedMarketFixture, advanceMarketDate } from './v3/market.js';
import { getV3MarketPlayerView } from './v3-market-simulation.js';
import { EQUIPMENT_CATALOG } from './equipment.js';
import { createV3StartingResources, getV3ProductArchetype, getV3RequirementGaps } from './v3-occupational-competencies.js';

const syntheticCostLine = (line, source = line.id) => ({ ...line, unit: 'EUR', sourceRef: `synthetic:test:${source}`, roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: line.amountCents });
const syntheticCostLines = lines => lines.map(line => syntheticCostLine(line));

// Operational fixtures start with documented initial instruction completed on
// the previous workday, so safety training does not distort capacity controls.
function createV3ProductState(input) {
  const validated = createProductState(input);
  if (!validated.people.length || !validated.equipment.length) return validated;
  let priorDate = new Date(`${validated.currentDate}T12:00:00Z`);
  do { priorDate.setUTCDate(priorDate.getUTCDate() - 1); } while ([0, 6].includes(priorDate.getUTCDay()));
  const trainingDate = priorDate.toISOString().slice(0, 10);
  let state = createProductState({ ...input, currentDate: trainingDate });
  for (const person of state.people) for (const equipment of state.equipment) {
    const instructionId = `fixture-instruction-${person.id}-${equipment.id}`;
    state = planV3EquipmentInstruction(state, { instructionId, personId: person.id, equipmentId: equipment.id, plannedDate: trainingDate, sourceRef: `instruction:${instructionId}` });
    state = recordV3EquipmentInstruction(state, { instructionId });
  }
  return advanceV3ProductDate(state, validated.currentDate);
}

function assertThrowsWithMessage(fn, pattern, message) {
  let error;
  try { fn(); } catch (caught) { error = caught; }
  assert.ok(error instanceof Error, `${message}: expected an error`);
  assert.match(error.message, pattern, message);
  return error;
}

function productivityPlan({ competencies = { fach: 70, methoden: 70, sozial: 70, individual: 70 }, motivation = 70, equipmentBonus = {}, condition = 100, standardHours = 4, commitments = [] } = {}) {
  let state = createV3ProductState({
    runId: 'run-productivity-control', currentDate: '2027-01-04',
    people: [{ id: 'worker', hoursPerDay: 8, skills: ['turning'], competencies, motivation }],
    equipment: [{ id: 'lathe', hoursPerDay: 8, capabilities: ['turning'], condition, bonus: equipmentBonus }],
    materials: [], finishedGoodsCapacity: 10, finishedGoodsUsed: 0, commitments,
  });
  state = createV3Product(state, { productId: 'control-product', name: 'Kontrollprodukt', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1 });
  state = defineV3ProductSteps(state, 'control-product', [{ stepId: 'make', kind: 'production', hours: standardHours, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
  state = estimateV3Product(state, 'control-product', { netPriceCents: 10000, directCosts: syntheticCostLines([{ id: 'direct', amountCents: 1000, variable: true }]), costVersion: 'control-cost-v1', babVersion: 'control-bab-v1' });
  return planV3ProductStep(state, { productId: 'control-product', stepId: 'make', date: '2027-01-04', personId: 'worker', equipmentId: 'lathe', outputQuantity: 1 }).assignments[0];
}

const productivityBaseline = productivityPlan();
const skillControl = productivityPlan({ competencies: { fach: 80, methoden: 70, sozial: 70, individual: 70 } });
const motivationControl = productivityPlan({ motivation: 80 });
const productionWorkbench = EQUIPMENT_CATALOG.find(item => item.id === 'workbench-1');
assert.ok(productionWorkbench?.bonus?.production > 0, 'V2 catalog provides the approved production equipment effect');
const equipmentControl = productivityPlan({ equipmentBonus: productionWorkbench.bonus });
assert.ok(skillControl.hours < productivityBaseline.hours, 'holding motivation/equipment constant, D-0141 skill improves V3 planned work duration');
assert.ok(motivationControl.hours < productivityBaseline.hours, 'holding competencies/equipment constant, D-0141 motivation improves V3 planned work duration');
assert.ok(equipmentControl.hours < productivityBaseline.hours, 'holding worker constant, D-0149 production equipment improves V3 planned work duration');
assert.ok(motivationControl.productivityFactor > productivityBaseline.productivityFactor, 'higher motivation produces a higher reported productivity factor');
assert.ok(equipmentControl.productivityFactor > productivityBaseline.productivityFactor, 'suitable productive equipment produces a higher reported productivity factor');
assert.equal(skillControl.standardWorkHours, productivityBaseline.standardWorkHours, 'control pair changes only the selected skill input');
assert.equal(motivationControl.standardWorkHours, productivityBaseline.standardWorkHours, 'control pair changes only motivation');
assert.ok(productivityBaseline.productivityFactor > 0 && productivityBaseline.productivityFactor <= 1.32, 'planner records the bounded V2 formula factor');
assert.throws(() => productivityPlan({ competencies: { fach: 100, methoden: 100, sozial: 100, individual: 100 }, motivation: 100, equipmentBonus: productionWorkbench.bonus, standardHours: 6, commitments: [{ date: '2027-01-04', personId: 'worker', equipmentId: 'lathe', hours: 4, status: 'planned' }] }), /daily capacity exceeded/, 'productivity-adjusted planning still respects worker and machine daily capacity');
assert.ok(productivityPlan({ standardHours: 9.5, competencies: { fach: 100, methoden: 100, sozial: 100, individual: 100 }, motivation: 100, equipmentBonus: productionWorkbench.bonus }).hours <= 8, 'planned duration uses productivity while remaining within daily resource capacity');

function skillOnlyFixture(skills) {
  let value = createV3ProductState({ runId: 'skill-only-pair', currentDate: '2027-01-04', people: [{ id: 'worker', hoursPerDay: 8, skills }], equipment: [{ id: 'qualified-lathe', hoursPerDay: 8, capabilities: ['turning'] }], materials: [], finishedGoodsCapacity: 2, finishedGoodsUsed: 0, commitments: [] });
  value = createV3Product(value, { productId: 'skill-gated-product', name: 'Skill-gated', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1 });
  return defineV3ProductSteps(value, 'skill-gated-product', [{ stepId: 'turn', kind: 'development', hours: 2, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
}
let qualifiedSkillState = skillOnlyFixture(['turning']);
qualifiedSkillState = planV3ProductStep(qualifiedSkillState, { productId: 'skill-gated-product', stepId: 'turn', date: '2027-01-04', personId: 'worker', equipmentId: 'qualified-lathe' });
assert.equal(qualifiedSkillState.assignments[0].status, 'planned', 'the positive skill-only control plans with all other inputs unchanged');
let missingSkillState = skillOnlyFixture([]);
const missingSkillBefore = JSON.stringify(missingSkillState);
assert.throws(() => planV3ProductStep(missingSkillState, { productId: 'skill-gated-product', stepId: 'turn', date: '2027-01-04', personId: 'worker', equipmentId: 'qualified-lathe' }), /lacks skill turning/, 'product operation is blocked by skill alone while equipment is qualified');
assert.equal(JSON.stringify(missingSkillState), missingSkillBefore, 'missing product skill fails without resource or state mutation');

const qualificationStart = createV3StartingResources('zerspanung', 'geselle-fachwirt');
const qualificationEquipmentBefore = structuredClone(qualificationStart.equipment);
let qualificationState = createV3ProductState({ runId: 'run-synthetic-skill-course', currentDate: '2027-01-04', ...qualificationStart });
const precisionBushing = getV3ProductArchetype('precision-bushing');
const requirementGapsBeforeCourse = getV3RequirementGaps(qualificationState.people, qualificationState.equipment, precisionBushing.requirements);
assert.ok(requirementGapsBeforeCourse.missingSkills.includes('precision_turning'), 'catalogued occupational skill is absent before training');
assert.ok(requirementGapsBeforeCourse.missingEquipment.includes('precision-lathe'), 'machine eligibility/equipment requirement remains separate from skill');
assert.throws(() => createV3Product(qualificationState, { productId: 'precision-before-course', name: 'Precision before course', targetSegment: precisionBushing.targetSegment, marketCapabilities: [precisionBushing.marketCapability], unitStorage: precisionBushing.unitStorage, recipe: precisionBushing.recipe, archetypeId: precisionBushing.id, productionRequirements: precisionBushing.requirements }), /precision_turning/, 'existing product requirement gate blocks the missing catalogued skill');
assert.throws(() => completeV3SyntheticSkillCourse(qualificationState, { completionId: 'course-unknown', courseId: 'not-a-course', personId: 'P1' }), /unknown synthetic skill course/);
const noPrerequisiteState = createV3ProductState({ runId: 'run-skill-course-no-prereq', currentDate: '2027-01-04', people: [{ id: 'P2', hoursPerDay: 8, skills: [], skillLevels: {}, qualifications: [], trainerQualified: false }], equipment: [], materials: [], finishedGoodsCapacity: 0, finishedGoodsUsed: 0, commitments: [] });
assert.throws(() => completeV3SyntheticSkillCourse(noPrerequisiteState, { completionId: 'course-no-prereq', courseId: 'synthetic-course-precision-turning', personId: 'P2' }), /prerequisite unmet/);
qualificationState = completeV3SyntheticSkillCourse(qualificationState, { completionId: 'course-precision-turning-P1', courseId: 'synthetic-course-precision-turning', personId: 'P1' });
const qualificationRestored = JSON.parse(JSON.stringify(qualificationState));
assert.equal(validateV3ProductWorkdayAssignments(qualificationRestored), true, 'synthetic training completion restores from saved state and its source event');
const emptyCourseCompletionId = structuredClone(qualificationRestored); emptyCourseCompletionId.syntheticTrainingCompletions[0].completionId = ''; emptyCourseCompletionId.syntheticTrainingCompletions[0].sourceRef = 'synthetic:course-completion:';
assert.throws(() => validateV3ProductWorkdayAssignments(emptyCourseCompletionId), /invalid evidence/, 'restore rejects a completion record with an empty completion ID');
const tamperedOpeningQualification = structuredClone(qualificationRestored); tamperedOpeningQualification.people[0].qualificationTitle = 'Tampered qualification title';
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedOpeningQualification), /credentials differ from opening credentials/, 'restore rejects changes to immutable opening qualification metadata');
assert.deepEqual(completeV3SyntheticSkillCourse(qualificationRestored, { completionId: 'course-precision-turning-P1', courseId: 'synthetic-course-precision-turning', personId: 'P1' }), qualificationRestored, 'same completion ID replays idempotently after restore');
assert.throws(() => completeV3SyntheticSkillCourse(qualificationRestored, { completionId: 'course-precision-turning-P1-duplicate', courseId: 'synthetic-course-precision-turning', personId: 'P1' }), /duplicate synthetic course completion/);
const learnedSkillGaps = getV3RequirementGaps(qualificationRestored.people, qualificationRestored.equipment, precisionBushing.requirements);
assert.ok(!learnedSkillGaps.missingSkills.includes('precision_turning'), 'course updates the existing player skill used by product qualification gates');
assert.ok(learnedSkillGaps.missingEquipment.includes('precision-lathe'), 'skill training does not grant machine ownership or eligibility');
assert.throws(() => createV3Product(qualificationRestored, { productId: 'precision-after-course', name: 'Precision after course', targetSegment: precisionBushing.targetSegment, marketCapabilities: [precisionBushing.marketCapability], unitStorage: precisionBushing.unitStorage, recipe: precisionBushing.recipe, archetypeId: precisionBushing.id, productionRequirements: precisionBushing.requirements }), /precision-lathe/, 'existing product gate recognizes the acquired skill but still blocks missing equipment');
assert.deepEqual(qualificationRestored.people[0].qualifications, qualificationStart.people[0].qualifications, 'training does not rewrite starting credentials or legal qualifications');
assert.equal(qualificationRestored.people[0].trainerQualified, false, 'training does not grant AEVO or trainer authority');
assert.deepEqual(qualificationRestored.equipment, qualificationEquipmentBefore, 'training does not grant equipment');
assert.equal(qualificationRestored.syntheticTrainingCompletions[0].financialEffect, 'none');
assert.equal(qualificationRestored.events.filter(row => row.type === 'synthetic_skill_course_completed').length, 1);
const unknownSkillTarget = structuredClone(qualificationRestored);
unknownSkillTarget.syntheticTrainingCompletions[0].skillId = 'unregistered-credential';
unknownSkillTarget.events.find(row => row.type === 'synthetic_skill_course_completed').skillId = 'unregistered-credential';
assert.throws(() => validateV3ProductWorkdayAssignments(unknownSkillTarget), /unknown targets/);
const forgedTrainerAuthority = structuredClone(qualificationRestored); forgedTrainerAuthority.people[0].trainerQualified = true;
assert.throws(() => validateV3ProductWorkdayAssignments(forgedTrainerAuthority), /credentials differ/);

const machineOperationStart = createV3StartingResources('zerspanung', 'geselle-fachwirt');
let machineOperationState = createV3ProductState({ runId: 'run-synthetic-machine-operation', currentDate: '2027-01-04', ...machineOperationStart });
const machineTurnedPart = getV3ProductArchetype('machine-turned-part');
const machineGapsBefore = getV3RequirementGaps(machineOperationState.people, machineOperationState.equipment, machineTurnedPart.requirements);
assert.ok(machineGapsBefore.missingSkills.includes('machine_operation'), 'machine operation is a separate skill gate before the synthetic course');
assert.ok(machineGapsBefore.missingEquipment.includes('machine-operator-station'), 'a skill course does not provide the machine resource');
const machineOperationEquipmentBefore = structuredClone(machineOperationState.equipment);
machineOperationState = completeV3SyntheticSkillCourse(machineOperationState, { completionId: 'course-machine-operation-P1', courseId: 'synthetic-course-machine-operation', personId: 'P1' });
const machineGapsAfterCourse = getV3RequirementGaps(machineOperationState.people, machineOperationState.equipment, machineTurnedPart.requirements);
assert.ok(!machineGapsAfterCourse.missingSkills.includes('machine_operation'), 'the course satisfies only the matching game-skill gate');
assert.ok(machineGapsAfterCourse.missingEquipment.includes('machine-operator-station'), 'the separate machine gate remains closed after training');
assert.deepEqual(machineOperationState.equipment, machineOperationEquipmentBefore, 'synthetic training does not grant machine ownership or access');
assert.throws(() => createV3Product(machineOperationState, { productId: 'machine-product-before-equipment', name: machineTurnedPart.label, targetSegment: machineTurnedPart.targetSegment, marketCapabilities: [machineTurnedPart.marketCapability], unitStorage: machineTurnedPart.unitStorage, recipe: machineTurnedPart.recipe, archetypeId: machineTurnedPart.id, productionRequirements: machineTurnedPart.requirements }), /machine-operator-station/, 'machine product remains blocked until matching equipment exists');
const machineOperationRestored = JSON.parse(JSON.stringify(machineOperationState));
assert.equal(validateV3ProductWorkdayAssignments(machineOperationRestored), true, 'machine-operation course restores against its catalogued evidence');
assert.deepEqual(completeV3SyntheticSkillCourse(machineOperationRestored, { completionId: 'course-machine-operation-P1', courseId: 'synthetic-course-machine-operation', personId: 'P1' }), machineOperationRestored, 'machine-operation course replay is idempotent after restore');
assert.throws(() => completeV3SyntheticSkillCourse(machineOperationRestored, { completionId: 'course-machine-operation-P1-duplicate', courseId: 'synthetic-course-machine-operation', personId: 'P1' }), /duplicate synthetic course completion/);
const machineEquippedState = { ...machineOperationState, equipment: [...machineOperationState.equipment, { id: 'separately-acquired-machine', hoursPerDay: 8, capabilities: ['machine-operator-station'] }] };
assert.equal(getV3RequirementGaps(machineEquippedState.people, machineEquippedState.equipment, machineTurnedPart.requirements).eligible, true, 'separately present equipment plus acquired game skill satisfies this product profile');
assert.doesNotThrow(() => createV3Product(machineEquippedState, { productId: 'machine-product-after-equipment', name: machineTurnedPart.label, targetSegment: machineTurnedPart.targetSegment, marketCapabilities: [machineTurnedPart.marketCapability], unitStorage: machineTurnedPart.unitStorage, recipe: machineTurnedPart.recipe, archetypeId: machineTurnedPart.id, productionRequirements: machineTurnedPart.requirements }), 'separately available matching equipment completes the existing product gate');

let weldingState = createV3ProductState({ runId: 'run-synthetic-welding', currentDate: '2027-01-04', people: [{ id: 'P-WELD', hoursPerDay: 8, skills: ['technical_drawing'], skillLevels: { technical_drawing: 2 }, qualifications: [], trainerQualified: false }], equipment: [], materials: [], finishedGoodsCapacity: 2, finishedGoodsUsed: 0, commitments: [] });
const weldedBracket = getV3ProductArchetype('welded-bracket');
assert.ok(getV3RequirementGaps(weldingState.people, weldingState.equipment, weldedBracket.requirements).missingSkills.includes('welding_migmag'));
weldingState = completeV3SyntheticSkillCourse(weldingState, { completionId: 'course-welding-P', courseId: 'synthetic-course-welding-basics', personId: 'P-WELD' });
const weldGaps = getV3RequirementGaps(weldingState.people, weldingState.equipment, weldedBracket.requirements);
assert.ok(!weldGaps.missingSkills.includes('welding_migmag'), 'synthetic welding course satisfies only the existing welding game-skill requirement');
assert.ok(weldGaps.missingEquipment.length, 'welding machine requirements remain separate after the course');
const qualifiedWeldment = getV3ProductArchetype('qualified-weldment');
assert.ok(getV3RequirementGaps(weldingState.people, weldingState.equipment, qualifiedWeldment.requirements).missingQualifications.includes('welding-iso-9606'), 'synthetic skill course does not bypass the existing formal welding evidence gate');
const restoredWelding = JSON.parse(JSON.stringify(weldingState));
assert.equal(validateV3ProductWorkdayAssignments(restoredWelding), true, 'welding course completion restores from run-bound event evidence');
assert.deepEqual(completeV3SyntheticSkillCourse(restoredWelding, { completionId: 'course-welding-P', courseId: 'synthetic-course-welding-basics', personId: 'P-WELD' }), restoredWelding, 'welding course replay is idempotent');
assert.throws(() => completeV3SyntheticSkillCourse(restoredWelding, { completionId: 'course-welding-P-duplicate', courseId: 'synthetic-course-welding-basics', personId: 'P-WELD' }), /duplicate synthetic course completion/);

let pneumaticsState = createV3ProductState({ runId: 'run-synthetic-pneumatics', currentDate: '2027-01-04', people: [{ id: 'P-PNEU', hoursPerDay: 8, skills: ['technical_drawing'], skillLevels: { technical_drawing: 2 }, qualifications: [], trainerQualified: false }], equipment: [], materials: [], finishedGoodsCapacity: 2, finishedGoodsUsed: 0, commitments: [] });
const pneumaticManifold = getV3ProductArchetype('pneumatic-manifold');
pneumaticsState = completeV3SyntheticSkillCourse(pneumaticsState, { completionId: 'course-assembly-P', courseId: 'synthetic-course-assembly-basics', personId: 'P-PNEU' });
assert.ok(getV3RequirementGaps(pneumaticsState.people, pneumaticsState.equipment, pneumaticManifold.requirements).missingSkills.includes('pneumatics'), 'the prerequisite course alone does not satisfy the pneumatic game-skill gate');
pneumaticsState = completeV3SyntheticSkillCourse(pneumaticsState, { completionId: 'course-pneumatics-P', courseId: 'synthetic-course-pneumatics-basics', personId: 'P-PNEU' });
const pneumaticGaps = getV3RequirementGaps(pneumaticsState.people, pneumaticsState.equipment, pneumaticManifold.requirements);
assert.deepEqual(pneumaticGaps.missingSkills, [], 'the guided course chain satisfies both existing pneumatic-manifold game-skill requirements');
assert.deepEqual(pneumaticGaps.missingEquipment.sort(), ['assembly-bench', 'pneumatics-kit'].sort(), 'pneumatic and assembly equipment gates remain separate');
const restoredPneumatics = JSON.parse(JSON.stringify(pneumaticsState));
assert.equal(validateV3ProductWorkdayAssignments(restoredPneumatics), true, 'multi-course prerequisite chain restores against its event sequence');
assert.deepEqual(completeV3SyntheticSkillCourse(restoredPneumatics, { completionId: 'course-pneumatics-P', courseId: 'synthetic-course-pneumatics-basics', personId: 'P-PNEU' }), restoredPneumatics, 'pneumatic course replay is idempotent after restore');

function fixture() {
  return createV3ProductState({
    runId: 'run-v3-product', currentDate: '2027-01-04',
    people: [
      { id: 'p1', hoursPerDay: 8, skills: ['turning', 'assembly'] },
      { id: 'p2', hoursPerDay: 8, skills: ['assembly'] },
    ],
    equipment: [
      { id: 'lathe', hoursPerDay: 8, capabilities: ['turning'] },
      { id: 'bench', hoursPerDay: 8, capabilities: ['assembly'] },
    ],
    materials: [{ id: 'steel', quantity: 10 }],
    finishedGoodsCapacity: 5, finishedGoodsUsed: 0,
    commitments: [{ date: '2027-01-05', personId: 'p1', equipmentId: 'lathe', hours: 6, status: 'planned' }],
  });
}

let state = fixture();
assert.throws(() => createV3ProductState({ ...fixture(), currentDate: '2027-02-30' }), /valid ISO date/);
assert.throws(() => createV3ProductState({ ...fixture(), commitments: [
  { date: '2027-01-05', personId: 'p1', equipmentId: 'lathe', hours: 5 },
  { date: '2027-01-05', personId: 'p1', equipmentId: 'lathe', hours: 4 },
] }), /exceed p1 daily capacity/);
const original = state;
state = createV3Product(state, { productId: 'prod-a', name: 'Werkstück A', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }] });
state = createV3Product(state, { productId: 'prod-b', name: 'Werkstück B', targetSegment: 'medium', marketCapabilities: ['turning'], unitStorage: 1 });
assert.equal(state.products.length, 2, 'two products can be managed in parallel');
assert.equal(original.products.length, 0, 'state transitions are immutable');
assert.ok(Object.isFrozen(state.products[0]), 'returned state is deeply frozen');
state = defineV3ProductSteps(state, 'prod-a', [
  { stepId: 'dev', kind: 'development', hours: 3, requiredSkills: ['assembly'], requiredEquipment: ['turning'], predecessors: [] },
  { stepId: 'make', kind: 'production', hours: 2, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: ['dev'] },
  { stepId: 'inspect', kind: 'production', hours: 1, requiredSkills: ['assembly'], requiredEquipment: ['assembly'], predecessors: ['make'] },
]);
state = estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: syntheticCostLines([{ id: 'steel', amountCents: 1800, variable: true }, { id: 'labor', amountCents: 900, variable: false }]), costVersion: 'cost-v1' });
assert.equal(state.products[0].costEstimate.calculation.dbICents, 3200);
assert.equal(state.products[0].costEstimate.calculation.resultAfterBabCents, undefined);
assert.equal(state.products[0].costEstimate.babStatus, 'pending_deferred_bab');
assert.deepEqual(state.products[0].costEstimate.costLineEvidence, [
  { id: 'steel', unit: 'EUR', sourceRef: 'synthetic:test:steel', roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: 1800 },
  { id: 'labor', unit: 'EUR', sourceRef: 'synthetic:test:labor', roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: 900 },
], 'plan cost evidence stores currency unit, synthetic source, explicit no-rounding policy and the exact integer-cent result');
assert.deepEqual(state.events.findLast(row => row.type === 'product_plan_estimated').costEstimateSnapshot, state.products[0].costEstimate, 'plan evidence is bound to the immutable estimate event');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: [{ id: 'missing-source', amountCents: 25, variable: true, unit: 'EUR', roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: 25 }], costVersion: 'missing-source' }), /sourceRef/,
  'a missing cost source fails closed');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: [], costVersion: 'empty-costs' }), /empty costs cannot imply zero cost/,
  'an empty direct-cost list cannot silently create a full-price zero-cost plan');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: syntheticCostLines([{ id: 'zero-cost', amountCents: 0, variable: false }]), costVersion: 'zero-cost' }), /zero-cost products require a separate explicit confirmation flow/,
  'a zero-cent placeholder cannot bypass the explicit zero-cost confirmation boundary');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: [{ id: 'missing-unit', amountCents: 25, variable: true, sourceRef: 'synthetic:test:missing-unit', roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: 25 }], costVersion: 'missing-unit' }), /unit/,
  'a missing currency unit fails closed');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: [{ id: 'missing-rounding', amountCents: 25, variable: true, unit: 'EUR', sourceRef: 'synthetic:test:missing-rounding', roundingResultCents: 25 }], costVersion: 'missing-rounding' }), /roundingPolicy/,
  'a missing rounding policy fails closed');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: [{ ...syntheticCostLine({ id: 'wrong-rounding', amountCents: 25 }), roundingResultCents: 26 }], costVersion: 'wrong-rounding' }), /roundingResultCents must equal/,
  'a contradictory stored rounding result fails closed');
assert.throws(() => estimateV3Product(state, 'prod-a', { netPriceCents: 5000, directCosts: [{ ...syntheticCostLine({ id: 'fractional-cent', amountCents: 25.5 }), roundingResultCents: 26 }], costVersion: 'fractional-cent' }), /integer cents/,
  'fractional-cent input is rejected instead of rounded by A02');
const planRestore = JSON.parse(JSON.stringify(state));
assert.equal(validateV3ProductWorkdayAssignments(planRestore), true, 'JSON restore retains the plan source and integer-cent rounding evidence');
const planSourceTamper = structuredClone(planRestore);
planSourceTamper.products[0].costEstimate.costLineEvidence[0].sourceRef = 'synthetic:tampered-source';
assert.throws(() => validateV3ProductWorkdayAssignments(planSourceTamper), /immutable estimate event/, 'restore rejects plan source-reference mutation without matching event change');
assert.equal(state.events.some(row => /ledger|cash|sale/i.test(row.type)), false, 'plan estimate has no ledger/cash/sale event');
const babProduct = estimateV3ProductWithBab(state, 'prod-b', { period: '2027-01', offerDate: '2027-01-04', netPriceCents: 10000, directCosts: syntheticCostLines([{ id: 'material', amountCents: 2000, variable: true }]), sourcePools: [{ poolId: 'POOL-1', sourceCostCenterId: 'CC-ADMIN', costBasisId: 'BASIS-1', period: '2027-01', poolCents: 10001, allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }] }], offerDrivers: [{ poolId: 'POOL-1', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '2', unitLabel: 'h' }], costVersion: 'cost-v2', babVersion: 'bab-v2' });
assert.equal(babProduct.products.find(row => row.productId === 'prod-b').costEstimate.calculation.babAllocatedCents, 2000, 'product BAB comes from the shared explicit pool calculation');
assert.equal(babProduct.products.find(row => row.productId === 'prod-b').costEstimate.babCalculation.babSnapshot.sourcePools[0].reconciliationDifferenceCents, 0, 'product BAB reconciles source pool to recipients exactly');
assert.equal(state.products.find(row => row.productId === 'prod-b').costEstimate, null, 'product estimate remains an immutable snapshot');

assert.throws(() => planV3ProductStep(state, { productId: 'prod-a', stepId: 'make', date: '2027-01-05', personId: 'p1', equipmentId: 'lathe', outputQuantity: 2, materialQuantities: { steel: 2 } }), /predecessor dev must be scheduled first/);
assert.throws(() => planV3ProductStep(state, { productId: 'prod-a', stepId: 'dev', date: '2027-01-05', personId: 'p1', equipmentId: 'lathe' }), /daily capacity exceeded/);
const equipmentMismatchBefore = JSON.stringify(state);
assert.throws(() => planV3ProductStep(state, { productId: 'prod-a', stepId: 'dev', date: '2027-01-05', personId: 'p2', equipmentId: 'bench' }), /lacks capability turning/);
assert.equal(JSON.stringify(state), equipmentMismatchBefore, 'incompatible required equipment fails without mutation');
assert.throws(() => planV3ProductStep(state, { productId: 'prod-a', stepId: 'dev', date: '2027-01-09', personId: 'p1', equipmentId: 'lathe' }), /Monday through Friday/);
state = planV3ProductStep(state, { productId: 'prod-a', stepId: 'dev', date: '2027-01-06', personId: 'p1', equipmentId: 'lathe' });
assert.throws(() => planV3ProductStep(state, { productId: 'prod-a', stepId: 'make', date: '2027-01-05', personId: 'p1', equipmentId: 'lathe', outputQuantity: 2, materialQuantities: { steel: 2 } }), /cannot be scheduled before predecessor/);
const makePlanned = planV3ProductStep(state, { productId: 'prod-a', stepId: 'make', date: '2027-01-06', personId: 'p1', equipmentId: 'lathe', outputQuantity: 2, materialQuantities: { steel: 2 } });
assert.equal(makePlanned.assignments.at(-1).timeEvidence, undefined, 'planned work carries no actual-time evidence');
state = planV3ProductStep(makePlanned, { productId: 'prod-a', stepId: 'inspect', date: '2027-01-07', personId: 'p2', equipmentId: 'bench' });
assert.throws(() => completeV3ProductStep(state, makePlanned.assignments.at(-1).assignmentId), /scheduled for 2027-01-06/);
assert.throws(() => planV3ProductStep(state, { productId: 'prod-a', stepId: 'inspect', date: '2027-01-08', personId: 'p2', equipmentId: 'bench' }), /already assigned/);
state = advanceV3ProductDate(advanceV3ProductDate(state));
assert.equal(state.currentDate, '2027-01-06');
assert.throws(() => completeV3ProductStep(state, makePlanned.assignments.at(-1).assignmentId), /predecessor dev is not complete/);
state = completeV3ProductStep(state, state.assignments.find(row => row.stepId === 'dev').assignmentId);
const completedMakeId = state.assignments.find(row => row.stepId === 'make').assignmentId;
state = completeV3ProductStep(state, completedMakeId);
assert.equal(completeV3ProductStep(state, completedMakeId), state, 'exact completed product-step replay is an immutable no-op');
assert.equal(state.products[0].outputQuantity, 0, 'intermediate production is not released as finished goods');
assert.equal(state.finishedGoodsUsed, 0, 'no finished-goods storage is occupied before final process step');
assert.equal(state.products[0].stage, 'in_production');
assert.throws(() => getV3ProductMarketOpportunities(state, createDocumentedMarketFixture().state, 'prod-a'), /no finished goods/);
state = advanceV3ProductDate(state);
assert.equal(state.currentDate, '2027-01-07');
state = completeV3ProductStep(state, state.assignments.find(row => row.stepId === 'inspect').assignmentId);
assert.equal(state.materials[0].quantity, 8, 'material is consumed once at completed production step');
assert.equal(state.finishedGoodsUsed, 2, 'finished goods occupy provided storage capacity');
assert.equal(state.products[0].stage, 'finished_goods');
const makeEvidence = state.events.find(event => event.type === 'product_step_completed' && event.stepId === 'make');
assert.equal(makeEvidence.period, '2027-01', 'completed work evidence carries its calendar period');
assert.equal(makeEvidence.quantityEvidence.value, 2, 'produced output has an actual quantity evidence value');
assert.equal(makeEvidence.quantityEvidence.unit, 'piece');
assert.equal(makeEvidence.timeEvidence.status, 'simulated_actual', 'completed block records modeled simulation duration');
assert.equal(makeEvidence.timeEvidence.minutes, state.assignments.find(row => row.stepId === 'make').hours * 60, 'time evidence records minutes consumed by the completed assignment block');
assert.equal(makeEvidence.timeEvidence.unit, 'minutes');
assert.equal(makeEvidence.timeEvidence.sourceRef, state.assignments.find(row => row.stepId === 'make').assignmentId);
assert.equal(makeEvidence.timeEvidence.workDate, '2027-01-06');
assert.equal(makeEvidence.timeEvidence.period, '2027-01');
assert.equal(makeEvidence.timeEvidence.basis, 'completed_simulation_work_block');
assert.equal(makeEvidence.timeEvidence.label, 'Modellierte Spieldauer; nicht extern gemessene Istzeit');
assert.equal(state.assignments.find(row => row.stepId === 'make').costEvidence.status, 'pending', 'time evidence does not infer cost evidence');
assert.equal(makeEvidence.costEvidence.status, 'pending', 'cost remains pending without an approved rate source');
const forgedPendingEvidence = structuredClone(state);
forgedPendingEvidence.events.find(event => event.workEvidenceId === makeEvidence.workEvidenceId).period = '2026-12';
assert.throws(() => validateV3ProductWorkdayAssignments(forgedPendingEvidence), /inconsistent work evidence/, 'restored time/cost pending evidence is bound to its completed assignment date');
const forgedTimeEvidence = structuredClone(state);
forgedTimeEvidence.assignments.find(row => row.assignmentId === makeEvidence.assignmentId).timeEvidence.minutes += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(forgedTimeEvidence), /inconsistent work evidence/, 'restore rejects mismatched simulated minutes');
assert.equal('ledger' in state, false, 'recording modeled work duration creates no ledger or cost posting');
let saleState = submitV3ProductSaleOffer(state, { saleId: 'sale-a-1', productId: 'prod-a', sellerPartyId: 'player-firm', buyerPartyId: 'buyer-1', inquiryId: 'inquiry-product-a', quantity: 1, offerDate: '2027-01-07', decisionDate: '2027-01-08', netPriceCents: 2500, offerSnapshotId: 'plan-snapshot-a' });
assert.equal(saleState.products[0].outputQuantity, 2, 'an offer alone does not remove finished goods');
assert.equal(saleState.productSales[0].offerSnapshot.offerPriceCents, 2500, 'the submitted price and product plan are captured in the offer snapshot');
assert.equal(saleState.productSales[0].offerSnapshot.calculation.netPriceCents, 2500, 'the submitted price is recalculated into the offer snapshot');
assert.equal(saleState.productSales[0].offerSnapshot.calculation.dbICents, 700, 'DB I uses the actual submitted offer price');
assert.equal(saleState.productSales[0].offerSnapshot.calculation.resultAfterBabCents, undefined, 'V3 freezes DB I/direct costs without an inferred BAB result');
assert.equal(saleState.productSales[0].offerSnapshot.babStatus, 'pending_deferred_bab');
assert.deepEqual(saleState.productSales[0].offerSnapshot.costLineEvidence, state.products[0].costEstimate.costLineEvidence, 'immutable sale snapshot carries every plan source and rounding field');
const saleCostEvidenceTamper = structuredClone(saleState);
saleCostEvidenceTamper.productSales[0].offerSnapshot.costLineEvidence[0].roundingResultCents += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(saleCostEvidenceTamper), /immutable offer event/, 'sale snapshot evidence cannot be altered after submission');
const coordinatedSnapshotTamper = structuredClone(saleState);
coordinatedSnapshotTamper.productSales[0].offerSnapshot.calculation.dbICents += 1;
coordinatedSnapshotTamper.events.find(event => event.type === 'product_sale_offer_submitted').offerSnapshot.calculation.dbICents += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(coordinatedSnapshotTamper), /no matching immutable offer event/, 'even a coordinated source and offer mutation cannot falsify the price-derived calculation');
const changedPlanAfterOffer = estimateV3Product(saleState, 'prod-a', { netPriceCents: 99000, directCosts: syntheticCostLines([{ id: 'steel', amountCents: 1800, variable: true }, { id: 'labor', amountCents: 900, variable: false }]), costVersion: 'cost-v2' });
assert.equal(validateV3ProductWorkdayAssignments(changedPlanAfterOffer), true, 'later plan edits do not rewrite the prior sale snapshot');
assert.equal(submitV3ProductSaleOffer(changedPlanAfterOffer, { saleId: 'sale-a-1', productId: 'prod-a', sellerPartyId: 'player-firm', buyerPartyId: 'buyer-1', inquiryId: 'inquiry-product-a', quantity: 1, offerDate: '2027-01-07', decisionDate: '2027-01-08', netPriceCents: 2500, offerSnapshotId: 'plan-snapshot-a' }), changedPlanAfterOffer, 'exact offer replay preserves its original snapshot after a later plan edit');
const tamperedSaleSnapshot = structuredClone(saleState); tamperedSaleSnapshot.productSales[0].offerSnapshot.offerPriceCents = 1;
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedSaleSnapshot), /no matching immutable offer event/);
assert.throws(() => decideV3ProductSaleOffer(saleState, { saleId: 'sale-a-1', buyerPartyId: 'player-firm', decisionDate: '2027-01-08', accepted: true, decisionRef: 'wrong-actor' }), /only the named buyer/);
assert.throws(() => decideV3ProductSaleOffer(saleState, { saleId: 'sale-a-1', buyerPartyId: 'buyer-1', decisionDate: '2027-01-07', accepted: true, decisionRef: 'too-early' }), /not due until/);
assert.throws(() => decideV3ProductSaleOffer(saleState, { saleId: 'sale-a-1', buyerPartyId: 'buyer-1', decisionDate: '2027-01-08', accepted: true, decisionRef: 'future' }), /before the simulation reaches/);
saleState = advanceV3ProductDate(saleState);
saleState = decideV3ProductSaleOffer(saleState, { saleId: 'sale-a-1', buyerPartyId: 'buyer-1', decisionDate: '2027-01-08', accepted: true, decisionRef: 'buyer-decision-a1' });
assert.equal(saleState.products[0].outputQuantity, 1, 'only buyer acceptance removes the sold quantity');
assert.equal(saleState.finishedGoodsUsed, 2, 'buyer acceptance reserves quantity without physical stock release');
saleState = dispatchV3ProductSale(saleState, { saleId: 'sale-a-1', dispatchId: 'dispatch-a-1', date: '2027-01-08', sourceRef: 'dispatch-source-a1' });
assert.equal(saleState.finishedGoodsUsed, 1, 'explicit dispatch releases the physical stock capacity');
assert.equal(dispatchV3ProductSale(saleState, { saleId: 'sale-a-1', dispatchId: 'dispatch-a-1', date: '2027-01-08', sourceRef: 'dispatch-source-a1' }), saleState, 'dispatch replay is idempotent');
const saleRestored = JSON.parse(JSON.stringify(saleState));
assert.equal(validateV3ProductWorkdayAssignments(saleRestored), true, 'JSON persistence restore validates multi-step dependency and completed work state');
const tamperedDispatchCogs = structuredClone(saleRestored);
const tamperedDispatchCogsEvent = tamperedDispatchCogs.events.find(row => row.type === 'product_sale_dispatched' && row.saleId === 'sale-a-1');
tamperedDispatchCogsEvent.cogsStatus = 'valued_nonposting'; tamperedDispatchCogsEvent.cogsCents = 123;
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedDispatchCogs), /dispatch event\/status/, 'restore rejects a dispatch event that invents a COGS amount or status');
const tamperedDispatchQuantity = structuredClone(saleRestored);
tamperedDispatchQuantity.events.find(row => row.type === 'product_sale_dispatched' && row.saleId === 'sale-a-1').quantity += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedDispatchQuantity), /dispatch event\/status/, 'restore binds dispatch event quantity to the accepted sale and stock movement');
assert.deepEqual(saleRestored.products.map(product => [product.productId, product.steps.map(step => [step.stepId, step.predecessors])]), saleState.products.map(product => [product.productId, product.steps.map(step => [step.stepId, step.predecessors])]), 'restore preserves product step dependency identities');
assert.deepEqual(saleRestored.assignments.map(row => [row.assignmentId, row.productId, row.stepId, row.date, row.completedAt]), saleState.assignments.map(row => [row.assignmentId, row.productId, row.stepId, row.date, row.completedAt]), 'restore preserves assignment identity and work dates');
assert.deepEqual(saleRestored.productSales.map(sale => [sale.offerSnapshot.snapshotId, sale.offerSnapshot.period, sale.offerSnapshot.costVersion, sale.offerSnapshot.babVersion]), saleState.productSales.map(sale => [sale.offerSnapshot.snapshotId, sale.offerSnapshot.period, sale.offerSnapshot.costVersion, sale.offerSnapshot.babVersion]), 'restore preserves offer snapshot period and version bindings');
assert.deepEqual(saleRestored.productSales.map(sale => sale.offerSnapshot.storageConversion), saleState.productSales.map(sale => sale.offerSnapshot.storageConversion), 'restore preserves explicit storage conversion, units, and source references');
assert.equal(saleState.productSales[0].revenueStatus, 'pending_non_posting');
assert.equal(saleState.productSales[0].cogsStatus, 'pending_deferred_bab');
assert.deepEqual(decideV3ProductSaleOffer(saleState, { saleId: 'sale-a-1', buyerPartyId: 'buyer-1', decisionDate: '2027-01-08', accepted: true, decisionRef: 'buyer-decision-a1' }), saleState, 'exact buyer decision replay is idempotent');
assert.throws(() => decideV3ProductSaleOffer(saleState, { saleId: 'sale-a-1', buyerPartyId: 'buyer-1', decisionDate: '2027-01-08', accepted: false, decisionRef: 'changed-decision' }), /replay payload conflict/);
const tamperedSale = structuredClone(saleState); tamperedSale.products[0].outputQuantity += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedSale), /accepted sales exceed produced quantity/);
const tamperedOffer = structuredClone(saleState); tamperedOffer.productSales[0].netPriceCents += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedOffer), /no matching immutable offer event/);
let rejectedSale = submitV3ProductSaleOffer(saleState, { saleId: 'sale-a-2', productId: 'prod-a', sellerPartyId: 'player-firm', buyerPartyId: 'buyer-2', inquiryId: 'inquiry-product-a2', quantity: 1, offerDate: '2027-01-08', decisionDate: '2027-01-09', netPriceCents: 2000, offerSnapshotId: 'plan-snapshot-a' });
rejectedSale = advanceV3ProductDate(rejectedSale);
rejectedSale = decideV3ProductSaleOffer(rejectedSale, { saleId: 'sale-a-2', buyerPartyId: 'buyer-2', decisionDate: '2027-01-09', accepted: false, decisionRef: 'buyer-decision-a2' });
assert.equal(rejectedSale.products[0].outputQuantity, 1, 'rejection keeps finished goods on hand');

function capacityFixture({ materials = [], capacity = 20 } = {}) {
  let value = createV3ProductState({ runId: 'separate-capacity-controls', currentDate: '2027-01-04', people: [{ id: 'person-a', hoursPerDay: 8, skills: ['turning'] }, { id: 'person-b', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'machine-a', hoursPerDay: 8, capabilities: ['turning'] }, { id: 'machine-b', hoursPerDay: 8, capabilities: ['turning'] }], materials, finishedGoodsCapacity: capacity, finishedGoodsUsed: 0, commitments: [] });
  for (const productId of ['capacity-a', 'capacity-b']) {
    value = createV3Product(value, { productId, name: productId, targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1 });
    value = defineV3ProductSteps(value, productId, [{ stepId: 'work', kind: 'development', hours: 5, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
  }
  return value;
}
let personCapacity = capacityFixture();
personCapacity = planV3ProductStep(personCapacity, { productId: 'capacity-a', stepId: 'work', date: '2027-01-04', personId: 'person-a', equipmentId: 'machine-a' });
const personCapacityBefore = JSON.stringify(personCapacity);
assertThrowsWithMessage(() => planV3ProductStep(personCapacity, { productId: 'capacity-b', stepId: 'work', date: '2027-01-04', personId: 'person-a', equipmentId: 'machine-b' }), /person person-a daily capacity exceeded on 2027-01-04/, 'person overbooking is isolated and reports its effective date');
assert.equal(JSON.stringify(personCapacity), personCapacityBefore, 'person overbooking rejection does not mutate state');
let machineCapacity = capacityFixture();
machineCapacity = planV3ProductStep(machineCapacity, { productId: 'capacity-a', stepId: 'work', date: '2027-01-04', personId: 'person-a', equipmentId: 'machine-a' });
const machineCapacityBefore = JSON.stringify(machineCapacity);
assertThrowsWithMessage(() => planV3ProductStep(machineCapacity, { productId: 'capacity-b', stepId: 'work', date: '2027-01-04', personId: 'person-b', equipmentId: 'machine-a' }), /equipment machine-a daily capacity exceeded on 2027-01-04/, 'machine overbooking is isolated and reports its effective date');
assert.equal(JSON.stringify(machineCapacity), machineCapacityBefore, 'machine overbooking rejection does not mutate state');
let materialCapacity = capacityFixture({ materials: [{ id: 'steel', quantity: 1 }] });
materialCapacity = createV3Product(materialCapacity, { productId: 'material-short', name: 'Material short', targetSegment: 'small', marketCapabilities: [], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 2 }] });
materialCapacity = defineV3ProductSteps(materialCapacity, 'material-short', [{ stepId: 'make', kind: 'production', hours: 1, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
materialCapacity = estimateV3Product(materialCapacity, 'material-short', { netPriceCents: 500, directCosts: syntheticCostLines([{ id: 'capacity-cost-fixture', amountCents: 1, variable: false }]), babAllocatedCents: 0, costVersion: 'material-cost', babVersion: 'material-bab' });
const materialCapacityBefore = JSON.stringify(materialCapacity);
assertThrowsWithMessage(() => planV3ProductStep(materialCapacity, { productId: 'material-short', stepId: 'make', date: '2027-01-04', personId: 'person-a', equipmentId: 'machine-a', outputQuantity: 1, materialQuantities: { steel: 2 } }), /insufficient material: steel on 2027-01-04/, 'material shortage is separate and reports its effective production date');
assert.equal(JSON.stringify(materialCapacity), materialCapacityBefore, 'material shortage rejection does not mutate state');
let warehouseCapacity = capacityFixture({ capacity: 1 });
warehouseCapacity = createV3Product(warehouseCapacity, { productId: 'warehouse-overflow', name: 'Warehouse overflow', targetSegment: 'small', marketCapabilities: [], unitStorage: 1 });
warehouseCapacity = defineV3ProductSteps(warehouseCapacity, 'warehouse-overflow', [{ stepId: 'make', kind: 'production', hours: 1, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
warehouseCapacity = estimateV3Product(warehouseCapacity, 'warehouse-overflow', { netPriceCents: 500, directCosts: syntheticCostLines([{ id: 'warehouse-cost-fixture', amountCents: 1, variable: false }]), babAllocatedCents: 0, costVersion: 'warehouse-cost', babVersion: 'warehouse-bab' });
const warehouseCapacityBefore = JSON.stringify(warehouseCapacity);
assertThrowsWithMessage(() => planV3ProductStep(warehouseCapacity, { productId: 'warehouse-overflow', stepId: 'make', date: '2027-01-04', personId: 'person-a', equipmentId: 'machine-a', outputQuantity: 2 }), /finished-goods storage capacity exceeded on 2027-01-04/, 'finished-goods overflow is fail-closed and reports its effective date');
assert.equal(JSON.stringify(warehouseCapacity), warehouseCapacityBefore, 'finished-goods overflow rejection does not mutate state');

let dual = createV3ProductState({ runId: 'dual-product-run', currentDate: '2027-01-04', people: [{ id: 'worker-a', hoursPerDay: 8, skills: ['turning'] }, { id: 'worker-b', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'lathe-a', hoursPerDay: 8, capabilities: ['turning'] }, { id: 'lathe-b', hoursPerDay: 8, capabilities: ['turning'] }], materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 5, finishedGoodsUsed: 0, commitments: [] });
for (const productId of ['dual-a', 'dual-b']) {
  dual = createV3Product(dual, { productId, name: productId, targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }] });
  dual = defineV3ProductSteps(dual, productId, [{ stepId: 'make', kind: 'production', hours: 2, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
  dual = estimateV3ProductWithBab(dual, productId, { period: '2027-01', offerDate: '2027-01-04', netPriceCents: productId === 'dual-a' ? 10000 : 1000, directCosts: syntheticCostLines([{ id: 'material', amountCents: 2000, variable: true }]), sourcePools: [{ poolId: `POOL-${productId}`, sourceCostCenterId: 'CC-ADMIN', costBasisId: `BASIS-${productId}`, period: '2027-01', poolCents: 1000, allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }] }], offerDrivers: [{ poolId: `POOL-${productId}`, costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '2', unitLabel: 'h' }], costVersion: `COST-${productId}`, babVersion: `BAB-${productId}` });
}
const dualPositivePlan = dual.products.find(row => row.productId === 'dual-a').costEstimate.calculation;
const dualNegativePlan = dual.products.find(row => row.productId === 'dual-b').costEstimate.calculation;
assert.ok(dualPositivePlan.dbICents > 0 && dualPositivePlan.resultAfterBabCents > 0, 'positive product plan has positive DB I and positive result after BAB');
assert.ok(dualNegativePlan.dbICents < 0 && dualNegativePlan.resultAfterBabCents < 0, 'uneconomic product plan has negative DB I and negative result after BAB');
dual = planV3ProductStep(dual, { productId: 'dual-a', stepId: 'make', date: '2027-01-05', personId: 'worker-a', equipmentId: 'lathe-a', outputQuantity: 2, materialQuantities: { steel: 2 } });
dual = planV3ProductStep(dual, { productId: 'dual-b', stepId: 'make', date: '2027-01-05', personId: 'worker-b', equipmentId: 'lathe-b', outputQuantity: 2, materialQuantities: { steel: 2 } });
const dualContract = { contractRef: 'dual-contract', inquiryId: 'dual-inquiry', offerId: 'dual-offer', decisionId: 'dual-decision', contractType: 'customer-contract', customerPartyId: 'dual-customer', buyerPartyId: 'dual-buyer', acceptancePartyId: 'dual-acceptor', performanceCriterionRef: 'dual-performance', acceptanceCriterionRef: 'dual-acceptance', orderQuantity: 1, orderUnit: 'pieces' };
assert.throws(() => planV3CustomerWorkOrder(dual, { workOrderId: 'competing-order', contractSnapshot: dualContract, operations: [{ operationId: 'competing-op', date: '2027-01-05', personId: 'worker-a', equipmentId: 'lathe-a', hours: 7, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: {} }] }), /daily capacity exceeded/, 'own product work and accepted customer work cannot overbook shared employee capacity');
dual = advanceV3ProductDate(dual);
for (const productId of ['dual-a', 'dual-b']) dual = completeV3ProductStep(dual, dual.assignments.find(row => row.productId === productId).assignmentId);
assert.deepEqual(dual.products.map(row => row.outputQuantity), [2, 2], 'both products complete production and add finished goods');
dual = submitV3ProductSaleOffer(dual, { saleId: 'dual-sale-a', productId: 'dual-a', sellerPartyId: 'player', buyerPartyId: 'buyer-a', inquiryId: 'inquiry-a', quantity: 1, offerDate: '2027-01-05', decisionDate: '2027-01-06', netPriceCents: 10000, offerSnapshotId: 'dual-a-plan' });
dual = submitV3ProductSaleOffer(dual, { saleId: 'dual-sale-b', productId: 'dual-b', sellerPartyId: 'player', buyerPartyId: 'buyer-b', inquiryId: 'inquiry-b', quantity: 1, offerDate: '2027-01-05', decisionDate: '2027-01-06', netPriceCents: 1000, offerSnapshotId: 'dual-b-plan' });
dual = advanceV3ProductDate(dual);
dual = decideV3ProductSaleOffer(dual, { saleId: 'dual-sale-a', buyerPartyId: 'buyer-a', decisionDate: '2027-01-06', accepted: true, decisionRef: 'buyer-a-accepts' });
dual = decideV3ProductSaleOffer(dual, { saleId: 'dual-sale-b', buyerPartyId: 'buyer-b', decisionDate: '2027-01-06', accepted: true, decisionRef: 'buyer-b-accepts' });
assert.deepEqual(dual.products.map(row => row.outputQuantity), [1, 1], 'both named buyers accept one product each');
assert.equal(dual.finishedGoodsUsed, 4, 'accepted sale remains physically in finished-goods stock until dispatch');
assert.equal(dual.finishedGoodsMovements.filter(row => row.kind === 'product_goods_reserved').length, 2, 'each accepted own-product sale has a dated reservation movement separate from physical stock');
assert.equal(dual.finishedGoodsMovements.at(-1).reservedAfter, 2, 'SKU/lot reservation roll-forward includes both accepted product quantities');
assert.deepEqual(dual.finishedGoodsMovements.filter(row => row.kind === 'product_goods_reserved').map(row => [row.physicalQuantityBefore, row.physicalQuantityAfter, row.reservedQuantityBefore, row.reservedQuantityAfter, row.quarantinedQuantityAfter, row.availableQuantityAfter]), [[2, 2, 0, 1, 0, 1], [2, 2, 0, 1, 0, 1]], 'lot quantities distinguish physical, reserved, quarantined and available stock');
dual = dispatchV3ProductSale(dual, { saleId: 'dual-sale-a', dispatchId: 'dual-dispatch-a', date: '2027-01-06', sourceRef: 'dual-dispatch-source-a' });
assert.equal(dual.finishedGoodsUsed, 3, 'two-product warehouse reconciles after first explicit dispatch');
assert.equal(dual.finishedGoodsMovements.at(-1).reservedAfter, 1, 'first shipment releases only its own reserved lot quantity');
dual = dispatchV3ProductSale(dual, { saleId: 'dual-sale-b', dispatchId: 'dual-dispatch-b', date: '2027-01-06', sourceRef: 'dual-dispatch-source-b' });
assert.equal(dual.finishedGoodsUsed, 2, 'second explicit dispatch reconciles the physical stock');
assert.equal(dual.finishedGoodsMovements.at(-1).reservedAfter, 0, 'all accepted own-product reservations clear after shipment');
assert.ok(dual.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').every(row => row.physicalQuantityAfter === 1 && row.reservedQuantityAfter === 0 && row.quarantinedQuantityAfter === 0 && row.availableQuantityAfter === 1), 'each shipped SKU lot reconciles physical/reserved/quarantined/available quantities');
assert.equal(dual.productSales.every(sale => sale.status === 'accepted' && sale.dispatchId), true, 'both distinct products complete accepted-and-shipped lifecycle');
const dualRestored = JSON.parse(JSON.stringify(dual));
assert.equal(validateV3ProductWorkdayAssignments(dualRestored), true, 'JSON save/restore round-trip validates product IDs, assignments, lots, and snapshots');
assert.deepEqual(dualRestored.products.map(product => [product.productId, product.steps.map(step => step.stepId)]), dual.products.map(product => [product.productId, product.steps.map(step => step.stepId)]), 'save/restore preserves product and dependency identities');
assert.deepEqual(dualRestored.productSales.map(sale => [sale.saleId, sale.offerSnapshot.period, sale.offerSnapshot.costVersion, sale.offerSnapshot.babVersion]), dual.productSales.map(sale => [sale.saleId, sale.offerSnapshot.period, sale.offerSnapshot.costVersion, sale.offerSnapshot.babVersion]), 'save/restore preserves offer snapshots and period/version bindings');

let sharedProduct = createV3ProductState({ runId: 'same-product-offer-run', currentDate: '2027-01-04', people: [{ id: 'worker', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'lathe', hoursPerDay: 8, capabilities: ['turning'] }], materials: [], finishedGoodsCapacity: 5, finishedGoodsUsed: 0, commitments: [] });
sharedProduct = createV3Product(sharedProduct, { productId: 'same-product', name: 'Same product', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1 });
sharedProduct = defineV3ProductSteps(sharedProduct, 'same-product', [{ stepId: 'make-four', kind: 'production', hours: 2, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
sharedProduct = estimateV3Product(sharedProduct, 'same-product', { netPriceCents: 10000, directCosts: syntheticCostLines([{ id: 'shared-cost-fixture', amountCents: 1, variable: false }]), babAllocatedCents: 0, costVersion: 'same-cost-v1', babVersion: 'same-bab-v1' });
sharedProduct = planV3ProductStep(sharedProduct, { productId: 'same-product', stepId: 'make-four', date: '2027-01-04', personId: 'worker', equipmentId: 'lathe', outputQuantity: 4 });
sharedProduct = completeV3ProductStep(sharedProduct, sharedProduct.assignments[0].assignmentId);
assert.equal(sharedProduct.products[0].outputQuantity, 4, 'single product has four available finished units');
for (const [index, buyerPartyId] of ['buyer-one', 'buyer-two'].entries()) sharedProduct = submitV3ProductSaleOffer(sharedProduct, { saleId: `same-sale-${index}`, productId: 'same-product', sellerPartyId: 'player', buyerPartyId, inquiryId: `same-inquiry-${index}`, quantity: 2, offerDate: '2027-01-04', decisionDate: '2027-01-05', netPriceCents: 5000, offerSnapshotId: `same-plan-${index}` });
assert.equal(sharedProduct.productSales.filter(sale => sale.status === 'pending').reduce((sum, sale) => sum + sale.quantity, 0), 4, 'two open offers reserve all four units exactly once');
sharedProduct = advanceV3ProductDate(sharedProduct);
sharedProduct = decideV3ProductSaleOffer(sharedProduct, { saleId: 'same-sale-0', buyerPartyId: 'buyer-one', decisionDate: '2027-01-05', accepted: true, decisionRef: 'same-decision-0' });
const beforeExcessAcceptance = structuredClone(sharedProduct);
assert.throws(() => decideV3ProductSaleOffer({ ...sharedProduct, products: sharedProduct.products.map(product => ({ ...product, outputQuantity: 1 })) }, { saleId: 'same-sale-1', buyerPartyId: 'buyer-two', decisionDate: '2027-01-05', accepted: true, decisionRef: 'same-decision-overdraw' }), /exceeds available unreserved/ , 'accepted quantity cannot exceed remaining unreserved quantity');
sharedProduct = decideV3ProductSaleOffer(sharedProduct, { saleId: 'same-sale-1', buyerPartyId: 'buyer-two', decisionDate: '2027-01-05', accepted: true, decisionRef: 'same-decision-1' });
assert.equal(sharedProduct.products[0].outputQuantity, 0, 'both accepted offers reserve each unit only once');
assert.equal(sharedProduct.finishedGoodsUsed, 4, 'accepted quantities remain physically stored before dispatch');
assert.equal(sharedProduct.productSales.filter(sale => sale.status === 'accepted').reduce((sum, sale) => sum + sale.quantity, 0), 4, 'accepted reservation quantity reconciles to four units');
sharedProduct = dispatchV3ProductSale(sharedProduct, { saleId: 'same-sale-0', dispatchId: 'same-dispatch-0', date: '2027-01-05', sourceRef: 'same-dispatch-source-0' });
assert.equal(sharedProduct.finishedGoodsUsed, 2, 'first explicit dispatch removes only its two units');
sharedProduct = dispatchV3ProductSale(sharedProduct, { saleId: 'same-sale-1', dispatchId: 'same-dispatch-1', date: '2027-01-05', sourceRef: 'same-dispatch-source-1' });
assert.equal(sharedProduct.finishedGoodsUsed, 0, 'second explicit dispatch clears the remaining two units');
assert.equal(validateV3ProductWorkdayAssignments(sharedProduct), true, 'same-product acceptance and dispatch remain save/restore valid');

let cancelled = createV3Product(state, { productId: 'prod-d', name: 'Werkstück D', targetSegment: 'small', marketCapabilities: [], unitStorage: 1 });
cancelled = defineV3ProductSteps(cancelled, 'prod-d', [{ stepId: 'dev-d', kind: 'development', hours: 2, requiredSkills: ['assembly'], requiredEquipment: ['assembly'], predecessors: [] }]);
cancelled = planV3ProductStep(cancelled, { productId: 'prod-d', stepId: 'dev-d', date: '2027-01-07', personId: 'p2', equipmentId: 'bench' });
const cancelledId = cancelled.assignments.at(-1).assignmentId;
assert.equal(cancelled.assignments.at(-1).timeEvidence, undefined, 'incomplete planned work has no time evidence');
cancelled = cancelV3ProductStep(cancelled, cancelledId);
assert.equal(cancelled.assignments.at(-1).timeEvidence, undefined, 'cancelled work has no time evidence');
cancelled = planV3ProductStep(cancelled, { productId: 'prod-d', stepId: 'dev-d', date: '2027-01-07', personId: 'p2', equipmentId: 'bench' });
const replannedId = cancelled.assignments.at(-1).assignmentId;
assert.notEqual(replannedId, cancelledId, 'cancel/replan gets a unique assignment ID');
cancelled = completeV3ProductStep(cancelled, replannedId);
assert.equal(cancelled.assignments.at(-1).status, 'completed', 'cancel/replan completion resolves the active assignment');

let overflow = state;
overflow = createV3Product(overflow, { productId: 'prod-c', name: 'Werkstück C', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1 });
overflow = defineV3ProductSteps(overflow, 'prod-c', [{ stepId: 'make-c', kind: 'production', hours: 1, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
overflow = estimateV3Product(overflow, 'prod-c', { netPriceCents: 5000, directCosts: syntheticCostLines([{ id: 'overflow-cost-fixture', amountCents: 1, variable: false }]), babAllocatedCents: 0, costVersion: 'cost-v1', babVersion: 'bab-v1' });
assert.throws(() => planV3ProductStep(overflow, { productId: 'prod-c', stepId: 'make-c', date: '2027-01-08', personId: 'p1', equipmentId: 'lathe', outputQuantity: 4 }), /storage capacity exceeded/);

const market = createDocumentedMarketFixture();
let view = getV3MarketPlayerView(market.state);
for (let tries = 0; tries < 8 && !view.inquiries.some(row => row.status === 'open'); tries += 1) {
  advanceMarketDate(market); view = getV3MarketPlayerView(market.state);
}
const matching = view.inquiries.find(row => row.status === 'open' && row.requiredCapacity <= state.products[0].outputQuantity && row.requiredCapabilities.every(skill => state.products[0].marketCapabilities.includes(skill)));
assert.ok(matching, 'market fixture supplies a player-safe opportunity matching the product');
const marketProductState = { ...state, products: state.products.map(row => row.productId === 'prod-a' ? { ...row, targetSegment: matching.segmentId } : row) };
const opportunities = getV3ProductMarketOpportunities(marketProductState, market.state, 'prod-a');
assert.ok(opportunities.some(row => row.inquiryId === matching.inquiryId));
assert.equal(JSON.stringify(opportunities).includes('firmId'), false, 'market handoff uses the player-safe API projection');
assert.throws(() => getV3ProductMarketOpportunities(state, market.state, 'prod-b'), /no finished goods/);

// Explicit customer work plans share T-0066 capacity and material reservations without becoming own products.
let customerState = fixture();
const customerContract = { contractRef: 'contract-1', inquiryId: 'inquiry-1', offerId: 'offer-1', decisionId: 'decision-1', contractType: 'customer-contract', customerPartyId: 'customer-1', buyerPartyId: 'buyer-1', acceptancePartyId: 'acceptance-party-1', performanceCriterionRef: 'performance-clause-1', acceptanceCriterionRef: 'acceptance-clause-1', orderQuantity: 2, orderUnit: 'pieces' };
const customerOperations = [{ operationId: 'customer-op-1', date: '2027-01-05', personId: 'p2', equipmentId: 'bench', hours: 4, requiredSkills: ['assembly'], requiredEquipmentCapabilities: ['assembly'], predecessors: [], materials: { steel: 2 } }];
assert.throws(() => planV3CustomerWorkOrder(customerState, { workOrderId: 'work-1', contractSnapshot: customerContract, operations: [{ operationId: 'incomplete' }] }), /non-empty string/);
assert.throws(() => planV3CustomerWorkOrder(customerState, { workOrderId: 'work-skill', contractSnapshot: customerContract, operations: [{ ...customerOperations[0], operationId: 'skill-check', requiredSkills: ['milling'] }] }), /lacks skill milling/);
assert.throws(() => planV3CustomerWorkOrder(customerState, { workOrderId: 'work-material', contractSnapshot: customerContract, operations: [{ ...customerOperations[0], operationId: 'material-check', materials: { steel: 11 } }] }), /insufficient material: steel/);
assert.throws(() => planV3CustomerWorkOrder(customerState, { workOrderId: 'work-chronology', contractSnapshot: customerContract, operations: [
  { ...customerOperations[0], operationId: 'prep', date: '2027-01-08', materials: {} },
  { ...customerOperations[0], operationId: 'finish', date: '2027-01-07', predecessors: ['prep'], materials: {} },
] }), /cannot be scheduled before predecessor prep/, 'a predecessor may not be scheduled after its dependent operation');
customerState = planV3CustomerWorkOrder(customerState, { workOrderId: 'work-1', contractSnapshot: customerContract, operations: customerOperations });
assert.equal(customerState.customerWorkOrderPlans[0].status, 'in_progress');
assert.throws(() => planV3CustomerWorkOrder(customerState, { workOrderId: 'work-2', contractSnapshot: customerContract, operations: [{ ...customerOperations[0], operationId: 'customer-op-2', hours: 5, materials: {} }] }), /daily capacity exceeded/, 'customer plans cannot overbook a person');
let reservedProduct = createV3Product(customerState, { productId: 'prod-reserved', name: 'Reserved capacity', targetSegment: 'small', marketCapabilities: [], unitStorage: 1 });
reservedProduct = defineV3ProductSteps(reservedProduct, 'prod-reserved', [{ stepId: 'reserved-step', kind: 'development', hours: 5, requiredSkills: ['assembly'], requiredEquipment: ['assembly'], predecessors: [] }]);
assert.throws(() => planV3ProductStep(reservedProduct, { productId: 'prod-reserved', stepId: 'reserved-step', date: '2027-01-05', personId: 'p2', equipmentId: 'bench' }), /daily capacity exceeded/, 'T-0066 own-product scheduling sees customer-order reservations');
customerState = advanceV3ProductDate(customerState);
customerState = completeV3CustomerWorkOrderOperation(customerState, { workOrderId: 'work-1', operationId: 'customer-op-1' });
assert.equal(customerState.materials[0].quantity, 8, 'customer operation consumes explicit material once when completed');
assert.deepEqual(completeV3CustomerWorkOrderOperation(customerState, { workOrderId: 'work-1', operationId: 'customer-op-1' }), customerState, 'repeat completion does not consume material twice');

function supplyFixture(runId, supplierId, etaDate) {
  let supply = createV3ProductState({ runId, currentDate: '2027-01-04', people: [{ id: 'worker', hoursPerDay: 8, skills: ['assembly'] }], equipment: [], materials: [{ id: 'steel', quantity: 0 }], finishedGoodsCapacity: 2, finishedGoodsUsed: 0, commitments: [] });
  supply = createV3Product(supply, { productId: 'supply-gated', name: 'Supply gated', targetSegment: 'small', marketCapabilities: [], unitStorage: 1 });
  supply = defineV3ProductSteps(supply, 'supply-gated', [{ stepId: 'assemble', kind: 'development', hours: 1, requiredSkills: ['assembly'], requiredEquipment: [], predecessors: [] }]);
  return placeV3InternationalMaterialOrder(supply, { orderId: `order-${runId}`, shipmentId: `shipment-${runId}`, materialId: 'steel', quantity: 1, supplierId, sourceRef: `fixture:D-0173:${runId}`, fixtureId: 'synthetic:D-0173:supplier-profile-v1', baselineEtaDate: etaDate, etaDate, lagDays: 0 });
}
const neutralSupply = supplyFixture('supply-neutral', 'local', '2027-01-04');
const delayedSupply = supplyFixture('supply-delayed', 'online', '2027-01-09');
const scheduleSupplyOperation = (supply, date = '2027-01-08') => planV3ProductStep(supply, { productId: 'supply-gated', stepId: 'assemble', date, personId: 'worker', outputQuantity: 0, materialQuantities: { steel: 1 } });
assert.throws(() => scheduleSupplyOperation(neutralSupply), /insufficient material: steel/, 'material sufficiency check blocks operation before international receipt');
assert.equal(neutralSupply.materialShipments[0].etaDate, '2027-01-04', 'local supplier offer is available on the order day');
let neutralReceived = receiveV3InternationalMaterialShipment(neutralSupply, 'shipment-supply-neutral');
assert.equal(neutralReceived.materials[0].quantity, 1, 'neutral ETA adds physical quantity to existing material state');
assert.equal(scheduleSupplyOperation(neutralReceived).assignments[0].materials.steel, 1, 'the same product operation becomes schedulable after receipt');
let delayed = advanceV3ProductDate(delayedSupply);
assert.throws(() => receiveV3InternationalMaterialShipment(delayed, 'shipment-supply-delayed'), /not due/, 'online supplier remains unavailable before the five-calendar-day ETA');
assert.throws(() => scheduleSupplyOperation(delayed), /insufficient material: steel/, 'delayed material leaves the same constrained operation blocked');
for (let i = 0; i < 4; i += 1) delayed = advanceV3ProductDate(delayed);
delayed = receiveV3InternationalMaterialShipment(delayed, 'shipment-supply-delayed');
assert.equal(delayed.currentDate, '2027-01-11');
assert.equal(scheduleSupplyOperation(delayed, delayed.currentDate).assignments[0].materials.steel, 1, 'same operation succeeds after online-profile receipt');
const restoredSupply = JSON.parse(JSON.stringify(delayed));
validateV3ProductWorkdayAssignments(restoredSupply);
assert.deepEqual(receiveV3InternationalMaterialShipment(restoredSupply, 'shipment-supply-delayed'), restoredSupply, 'save/restore followed by repeated receipt is idempotent');
assert.equal(restoredSupply.materialMovements.length, 1, 'replay cannot double-count physical receipt');
assert.equal(restoredSupply.materialMovements[0].monetaryStatus, 'nonposting_pending_cost_source', 'receipt has no assumed vendor cost or posting');
assert.equal(restoredSupply.supplierInvoiceEvidence[0].status, 'pending_non_posting');
assert.equal(restoredSupply.supplierInvoiceEvidence[0].amountCents, 905, 'online invoice evidence includes the supplier quote plus shipping');
console.log('V3 product lifecycle regressions: PASS');
