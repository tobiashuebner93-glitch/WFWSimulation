import assert from 'node:assert/strict';
import { createV3MarketState } from '../v3-market-simulation.js';
import {
  createV3Run, openV3RunDay, closeV3RunDay, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction,
  recordV3RunSpecialEquipmentAuthorization, getV3RunEquipmentInstructionStatus,
  validateV3RunState,
} from '../v3-run-orchestrator.js';
import {
  createV3ProductState, planV3CustomerWorkOrder, advanceV3ProductDate,
  getV3EquipmentInstructionStatus, planV3EquipmentInstruction, recordV3EquipmentInstruction,
  recordV3SpecialEquipmentAuthorization,
} from '../v3-product-lifecycle.js';

const parameters = {
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 },
  customerDecisionDelayCalendarDays: { min: 2, max: 2 },
  minimumMonthlyCompetitorSample: 3,
};
const segments = [{ segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } }];
const firms = [
  { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: 0.75 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning'], segmentFit: { small: 0.8 }, offerPriceCentsBySizeClass: { small: 1000000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6 }, offerPriceCentsBySizeClass: { small: 1200000 } },
  { firmId: 'competitor-c', role: 'competitor', reputation: 0.6, capacityUnits: 9, capabilities: ['turning'], segmentFit: { small: 0.7 }, offerPriceCentsBySizeClass: { small: 1150000 } },
];
const makeProduct = ({ hazardRequirementRef = null, equipmentRevision = 'rev-1' } = {}) => createV3ProductState({
  runId: 't0114-run', currentDate: '2027-01-04',
  people: [{ id: 'worker-1', hoursPerDay: 8, skills: ['turning'] }],
  equipment: [{ id: 'machine-1', revision: equipmentRevision, ...(hazardRequirementRef ? { hazardRequirementRef } : {}), hoursPerDay: 8, capabilities: ['turning'] }],
  materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 10,
  finishedGoodsUsed: 0, commitments: [],
});
const makeRun = productState => {
  const marketState = createV3MarketState({ runId: 't0114-run', scenarioId: 't0114-scenario', seed: 't0114-seed', parameterSetId: 'market-test-v1', startDate: '2027-01-04', parameters, segments, firms });
  return createV3Run({ runId: 't0114-run', scenarioId: 't0114-scenario', seed: 't0114-seed', startDate: '2027-01-04', endDate: '2028-12-31', marketState, productState });
};
const operation = {
  operationId: 'turn', date: '2027-01-04', personId: 'worker-1', equipmentId: 'machine-1',
  hours: 1, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'],
  predecessors: [], materials: {},
};
const contractSnapshot = {
  contractRef: 'contract-1', inquiryId: 'inquiry-1', offerId: 'offer-1', decisionId: 'decision-1',
  contractType: 'manufacturing', customerPartyId: 'customer-1', buyerPartyId: 'customer-1',
  acceptancePartyId: 'customer-1', performanceCriterionRef: 'performance-1',
  acceptanceCriterionRef: 'acceptance-1', orderUnit: 'pieces', orderQuantity: 1,
};

// Initial use is blocked until instruction evidence exists.
let product = makeProduct();
assert.throws(() => planV3CustomerWorkOrder(product, { workOrderId: 'work-1', contractSnapshot, operations: [operation] }), /current equipment instruction is required/);

// Shared-run recording is deterministic, time-bound, and read-only projected.
let run = makeRun(product);
run = openV3RunDay(run, { date: '2027-01-04' }).state;
const input = { instructionId: 'instruction-1', personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-04', sourceRef: 'instruction:instruction-1' };
const planned = planV3RunEquipmentInstruction(run, input);
assert.equal(planned.ok, true);
assert.equal(planned.result.plan.durationMinutes, 60);
assert.equal(planned.state.modules.product.commitments.at(-1).hours, 1);
assert.equal(planned.state.modules.product.commitments.at(-1).status, 'planned');
assert.equal(getV3RunEquipmentInstructionStatus(planned.state, { personId: 'worker-1', equipmentId: 'machine-1' }).ready, false, 'a planned but incomplete block does not open the machine gate');
assert.equal(planV3RunEquipmentInstruction(planned.state, input).duplicate, true);
assert.throws(() => planV3RunEquipmentInstruction(planned.state, { ...input, personId: 'other-worker' }), { code: 'instruction_payload_conflict' });
assert.throws(() => completeV3RunEquipmentInstruction(run, { instructionId: 'instruction-1' }), /plan the instruction work block before completion/);
const first = completeV3RunEquipmentInstruction(planned.state, { instructionId: 'instruction-1' });
assert.equal(first.ok, true);
assert.equal(first.result.record.durationMinutes, 60);
assert.equal(first.state.modules.product.commitments.at(-1).status, 'completed');
assert.equal(getV3RunEquipmentInstructionStatus(first.state, { personId: 'worker-1', equipmentId: 'machine-1' }).ready, true);
assert.equal(completeV3RunEquipmentInstruction(first.state, { instructionId: 'instruction-1' }).duplicate, true);
validateV3RunState(first.state);

// Product assignments capture revision; an equipment revision change invalidates readiness.
const updatedRevision = structuredClone(first.state.modules.product);
updatedRevision.equipment[0].revision = 'rev-2';
assert.equal(getV3EquipmentInstructionStatus(updatedRevision, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2027-01-04' }).ready, false);
assert.throws(() => planV3CustomerWorkOrder(updatedRevision, { workOrderId: 'work-2', contractSnapshot, operations: [operation] }), /current equipment instruction is required/);

// A declared hazard requirement adds a separate authorization gate; no requirement means none.
product = makeProduct({ hazardRequirementRef: 'hazard:press-brake' });
product = planV3EquipmentInstruction(product, input);
product = recordV3EquipmentInstruction(product, { instructionId: input.instructionId });
assert.throws(() => planV3CustomerWorkOrder(product, { workOrderId: 'work-3', contractSnapshot, operations: [operation] }), /special equipment authorization is required/);
const authorization = { authorizationId: 'auth-1', personId: 'worker-1', equipmentId: 'machine-1', requirementRef: 'hazard:press-brake', completedAt: '2027-01-04', sourceRef: 'authorization:auth-1' };
product = recordV3SpecialEquipmentAuthorization(product, authorization);
assert.equal(getV3EquipmentInstructionStatus(product, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2027-01-04' }).ready, true);
assert.throws(() => recordV3SpecialEquipmentAuthorization(makeProduct(), { ...authorization, completedAt: '2027-01-04' }), /only for an explicit matching hazard requirement/);

// The annual due date requires a refresher before use and reserves 30 minutes.
let annual = makeProduct();
annual = planV3EquipmentInstruction(annual, input);
annual = recordV3EquipmentInstruction(annual, { instructionId: input.instructionId });
while (annual.currentDate < '2028-01-04') annual = advanceV3ProductDate(annual);
assert.equal(getV3EquipmentInstructionStatus(annual, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2028-01-04' }).ready, false, 'instruction expires on its due date before use');
const refresherInput = { instructionId: 'instruction-2', personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2028-01-04', sourceRef: 'instruction:instruction-2' };
annual = planV3EquipmentInstruction(annual, refresherInput);
assert.equal(annual.equipmentInstructionPlans.at(-1).instructionType, 'refresher');
assert.equal(annual.equipmentInstructionPlans.at(-1).durationMinutes, 30);
annual = recordV3EquipmentInstruction(annual, { instructionId: 'instruction-2' });
assert.equal(getV3EquipmentInstructionStatus(annual, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2028-01-04' }).ready, true);
while (annual.currentDate < '2028-01-05') annual = advanceV3ProductDate(annual);
assert.equal(getV3EquipmentInstructionStatus(annual, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2028-01-05' }).ready, true);
while (annual.currentDate < '2029-01-04') annual = advanceV3ProductDate(annual);
assert.equal(getV3EquipmentInstructionStatus(annual, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2029-01-04' }).ready, false);

// Restore-style validation rejects tampered, orphaned, or duplicate evidence.
const tampered = structuredClone(first.state);
tampered.modules.product.equipmentInstructions[0].durationMinutes = 30;
assert.throws(() => validateV3RunState(tampered), /product calendar state is invalid/);
const orphan = structuredClone(first.state);
orphan.dayEvents = orphan.dayEvents.filter(event => event.phase !== 'equipment_instruction_planned');
assert.throws(() => validateV3RunState(orphan), /records and shared-run events disagree/);
const duplicate = structuredClone(first.state);
duplicate.modules.product.equipmentInstructions.push(structuredClone(duplicate.modules.product.equipmentInstructions[0]));
assert.throws(() => validateV3RunState(duplicate), /duplicate event|invalid|missing or inconsistent/);
validateV3RunState(planned.state);

let authBound = makeProduct({ hazardRequirementRef: 'hazard:press-brake' });
authBound = planV3EquipmentInstruction(authBound, { ...input, sourceRef: input.sourceRef });
authBound = recordV3EquipmentInstruction(authBound, { instructionId: input.instructionId });
authBound = recordV3SpecialEquipmentAuthorization(authBound, authorization);
authBound = structuredClone(authBound);
authBound.equipment[0].revision = 'rev-2';
authBound.equipment[0].hazardRequirementRef = 'hazard:press-brake-v2';
assert.equal(getV3EquipmentInstructionStatus(authBound, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2027-01-04' }).ready, false, 'historical evidence remains readable but cannot authorize a new revision/hazard');
const revisedPlan = { instructionId: 'instruction-rev-2', personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-04', sourceRef: 'instruction:instruction-rev-2' };
authBound = planV3EquipmentInstruction(authBound, revisedPlan);
assert.equal(authBound.equipmentInstructionPlans.at(-1).instructionType, 'initial', 'a safety-revision change requires initial instruction duration');
assert.equal(authBound.equipmentInstructionPlans.at(-1).durationMinutes, 60);
authBound = recordV3EquipmentInstruction(authBound, { instructionId: revisedPlan.instructionId });
authBound = recordV3SpecialEquipmentAuthorization(authBound, { authorizationId: 'auth-2', personId: 'worker-1', equipmentId: 'machine-1', requirementRef: 'hazard:press-brake-v2', completedAt: '2027-01-04', sourceRef: 'authorization:auth-2' });
assert.equal(getV3EquipmentInstructionStatus(authBound, { personId: 'worker-1', equipmentId: 'machine-1', onDate: '2027-01-04' }).ready, true);

// A missed scheduled day releases the capacity block and records an auditable miss instead of soft-locking the run.
let missedRun = makeRun(makeProduct());
missedRun = openV3RunDay(missedRun, { date: '2027-01-04' }).state;
missedRun = planV3RunEquipmentInstruction(missedRun, { ...input, instructionId: 'missed-1', sourceRef: 'instruction:missed-1' }).state;
missedRun = closeV3RunDay(missedRun, { date: '2027-01-04' }).state;
missedRun = openV3RunDay(missedRun, { date: '2027-01-05' }).state;
assert.equal(missedRun.modules.product.equipmentInstructionPlans[0].status, 'missed');
assert.equal(missedRun.modules.product.commitments.at(-1).status, 'cancelled');
assert.equal(missedRun.dayEvents.some(event => event.phase === 'equipment_instruction_missed'), true);
assert.equal(getV3RunEquipmentInstructionStatus(missedRun, { personId: 'worker-1', equipmentId: 'machine-1' }).ready, false);

console.log('A02 T-0114 equipment instruction regression checks passed');
