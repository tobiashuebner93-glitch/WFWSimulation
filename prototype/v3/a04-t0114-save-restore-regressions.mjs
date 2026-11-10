import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRunSaveEnvelope, restoreRunSaveEnvelope } from './run.js';
import { createV3MarketState } from '../v3-market-simulation.js';
import {
  createV3Run, openV3RunDay, closeV3RunDay, planV3RunEquipmentInstruction,
  completeV3RunEquipmentInstruction, recordV3RunSpecialEquipmentAuthorization,
  getV3RunEquipmentInstructionStatus, validateV3RunState,
} from '../v3-run-orchestrator.js';
import { createV3ProductState } from '../v3-product-lifecycle.js';

const parameters = {
  weekdayWeights: { mon: .2, tue: .2, wed: .2, thu: .2, fri: .2 },
  invitationWeights: { capacity: .25, reputation: .35, segmentFit: .4 },
  minimumInvitationScore: .2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 },
  customerDecisionDelayCalendarDays: { min: 2, max: 2 },
  minimumMonthlyCompetitorSample: 3,
};
const segments = [{ segmentId: 'small', decisionWeights: { price: .6, reputation: .2, segmentFit: .2 } }];
const firms = [
  { firmId: 'player', role: 'player', reputation: .65, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: .75 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: .7, capacityUnits: 15, capabilities: ['turning'], segmentFit: { small: .8 }, offerPriceCentsBySizeClass: { small: 1000000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: .55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: .6 }, offerPriceCentsBySizeClass: { small: 1200000 } },
  { firmId: 'competitor-c', role: 'competitor', reputation: .6, capacityUnits: 10, capabilities: ['turning'], segmentFit: { small: .7 }, offerPriceCentsBySizeClass: { small: 1100000 } },
];
const marketState = createV3MarketState({
  runId: 'a04-t0114-roundtrip', scenarioId: 'a04-scenario', seed: 'a04-seed',
  parameterSetId: 'market-test-v1', startDate: '2027-01-04', parameters, segments, firms,
});
let run = createV3Run({
  runId: 'a04-t0114-roundtrip', scenarioId: 'a04-scenario', seed: 'a04-seed',
  startDate: '2027-01-04', endDate: '2028-12-31', marketState,
  productState: createV3ProductState({
    runId: 'a04-t0114-roundtrip', currentDate: '2027-01-04',
    people: [{ id: 'worker', hoursPerDay: 8, skills: ['turning'] }],
    equipment: [{ id: 'machine', revision: 'safety-1', hazardRequirementRef: 'hazard:press-v1', hoursPerDay: 8, capabilities: ['turning'] }],
    materials: [{ id: 'steel', quantity: 20 }], finishedGoodsCapacity: 10,
    finishedGoodsUsed: 0, commitments: [],
  }),
});
const open = date => { run = openV3RunDay(run, { date }).state; };
const close = date => { run = closeV3RunDay(run, { date }).state; };
const plan = (id, date) => {
  run = planV3RunEquipmentInstruction(run, {
    instructionId: id, personId: 'worker', equipmentId: 'machine', plannedDate: date,
    sourceRef: `instruction:${id}`,
  }).state;
};
const complete = id => { run = completeV3RunEquipmentInstruction(run, { instructionId: id }).state; };
const authorize = (id, requirementRef) => {
  run = recordV3RunSpecialEquipmentAuthorization(run, {
    authorizationId: id, personId: 'worker', equipmentId: 'machine',
    requirementRef, completedAt: run.activeDay.date, sourceRef: `authorization:${id}`,
  }).state;
};
const canonical = value => Array.isArray(value) ? '[' + value.map(canonical).join(',') + ']'
  : value && typeof value === 'object' ? '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}'
  : JSON.stringify(value);
const digest = value => createHash('sha256').update(canonical(value)).digest('hex');

open('2027-01-04');
plan('done-v1', '2027-01-04');
complete('done-v1');
authorize('auth-v1', 'hazard:press-v1');
close('2027-01-04');
open('2027-01-05');
plan('missed-v1', '2027-01-05');
close('2027-01-05');
open('2027-01-06');
plan('planned-v1', '2027-01-06');

const before = createRunSaveEnvelope(run);
const restored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(before))).runState;
assert.deepEqual(restored.modules.product.equipmentInstructionPlans.map(row => row.status), ['completed', 'missed', 'planned']);
assert.equal(restored.modules.product.equipmentInstructions.length, 1);
assert.equal(restored.modules.product.specialEquipmentAuthorizations.length, 1);
assert.equal(digest(before), digest(createRunSaveEnvelope(restored)), 'JSON save/restore preserves canonical full envelope hash');
run = restored;
validateV3RunState(run);

// A safety revision and hazard requirement change preserves historical evidence but closes the current-use gate.
run = structuredClone(run);
run.modules.product.equipment[0].revision = 'safety-2';
run.modules.product.equipment[0].hazardRequirementRef = 'hazard:press-v2';
validateV3RunState(run);
assert.equal(getV3RunEquipmentInstructionStatus(run, { personId: 'worker', equipmentId: 'machine' }).ready, false);
assert.equal(run.modules.product.specialEquipmentAuthorizations[0].authorizationId, 'auth-v1');

plan('initial-v2', '2027-01-06');
assert.equal(run.modules.product.equipmentInstructionPlans.at(-1).instructionType, 'initial');
assert.equal(run.modules.product.equipmentInstructionPlans.at(-1).durationMinutes, 60);
complete('initial-v2');
assert.equal(getV3RunEquipmentInstructionStatus(run, { personId: 'worker', equipmentId: 'machine' }).ready, false, 'instruction alone does not satisfy new hazard authorization');
authorize('auth-v2', 'hazard:press-v2');
assert.equal(getV3RunEquipmentInstructionStatus(run, { personId: 'worker', equipmentId: 'machine' }).ready, true);
const afterRefresh = createRunSaveEnvelope(run);
const finalRestored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(afterRefresh))).runState;
assert.equal(digest(afterRefresh), digest(createRunSaveEnvelope(finalRestored)), 'renewed state also roundtrips with stable hash');
assert.equal(finalRestored.modules.product.specialEquipmentAuthorizations.length, 2);
assert.equal(finalRestored.modules.product.equipmentInstructions.length, 2);
validateV3RunState(finalRestored);

console.log('A04 T-0114 save/restore, historical-evidence and renewal checks passed');

