import assert from 'node:assert/strict';
import {
  closeRunDay, createFinanceStateForRun, createRunFromInputs, createRunSaveEnvelope,
  getV3RunOperatingImpact, installRunOperatingResources, openNextRunDay,
  restoreRunSaveEnvelope,
} from './v3/run.js';
import { createV3MarketOfferId } from './v3-market-simulation.js';
import { planV3RunWorkOrder, submitV3RunOffer } from './v3-run-orchestrator.js';

const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const people = [{ id: 'worker-1', hoursPerDay: 8, skills: ['turning'] }];
const equipment = [{ id: 'machine-1', hoursPerDay: 8, capabilities: ['turning'] }];
const makeRun = (macroPath = 'UPSWING', commitments = []) => installRunOperatingResources(
  createRunFromInputs({ scenarioId: `IMPACT-${macroPath}-${commitments.length}`, seed: 'fixed-impact-seed', startDate: '2027-01-04', endDate: '2027-01-16', macroPath }),
  { peopleJson: JSON.stringify(people), equipmentJson: JSON.stringify(equipment), materialsJson: '[]', commitmentsJson: JSON.stringify(commitments), finishedGoodsCapacity: 0, finishedGoodsUsed: 0 },
);
const advanceClosedDay = state => closeRunDay(openNextRunDay(state).state).state;

// Initial setup and save/restore must fail closed for weekends; normal weekday plans still count.
for (const weekendDate of ['2027-01-09', '2027-01-10']) {
  assert.throws(() => makeRun('UPSWING', [{ id: `weekend-${weekendDate}`, date: weekendDate, personId: 'worker-1', equipmentId: 'machine-1', hours: 8 }]), /Saturday or Sunday/, `initial commitments reject ${weekendDate}`);
  const corrupt = structuredClone(makeRun('UPSWING'));
  corrupt.modules.product.commitments.push({ id: `restored-weekend-${weekendDate}`, date: weekendDate, personId: 'worker-1', equipmentId: 'machine-1', hours: 8, status: 'planned' });
  const envelope = { saveVersion: 'V3-RUN-SAVE-1', runState: corrupt, financeState: null };
  assert.throws(() => createRunSaveEnvelope(corrupt, null), /Saturday or Sunday/, `save envelope validation rejects ${weekendDate}`);
  assert.throws(() => restoreRunSaveEnvelope(envelope), /Saturday or Sunday/, `restore validation rejects ${weekendDate}`);
}
const weekdayPlan = makeRun('UPSWING', [{ id: 'weekday-commitment', date: '2027-01-08', personId: 'worker-1', equipmentId: 'machine-1', hours: 3 }]);
const weekdayOpened = openNextRunDay(weekdayPlan).state;
assert.equal(getV3RunOperatingImpact(weekdayOpened)[0].after.plannedHours, 3, 'Friday workload counts in the five-day workweek');
assert.equal(getV3RunOperatingImpact(weekdayOpened)[0].after.availableCapacityHours, 40, 'five weekdays remain the weekly personnel capacity basis');

// The four configured phase fixtures are explicit synthetic activity gaps and share the same declared personnel capacity.
const expected = { UPSWING: 1, BOOM: 3, DOWNTURN: -1, LOW: -3 };
const phaseImpacts = {};
for (const [path, gap] of Object.entries(expected)) {
  const before = makeRun(path);
  const finance = createFinanceStateForRun(before);
  const financeBefore = structuredClone(finance);
  const opened = openNextRunDay(before);
  const impact = getV3RunOperatingImpact(opened.state)[0];
  assert.ok(impact, `${path} yields one scheduled weekly impact`);
  assert.ok(Math.abs(impact.activityGapPct - gap) < 1e-9, `${path} uses the explicit synthetic ${gap} pp activity gap`);
  assert.equal(impact.after.inquiryCount, impact.demandTrace.realizedInquiryCount);
  assert.equal(impact.after.availableCapacityHours, 40, 'one worker supplies five declared eight-hour weekdays');
  assert.equal(impact.directFinanceEffect, false);
  assert.equal(impact.sourceType, 'synthetic_scenario_assumption');
  assert.equal(impact.runId, before.runId);
  assert.equal(impact.scenarioId, before.scenarioId);
  assert.equal(impact.period, '2027-01');
  assert.equal(impact.exposure, 1);
  assert.equal(impact.demandTrace.calibrated, false);
  assert.equal(impact.demandTrace.realizedInquiryCount, opened.state.modules.market.events.find(event => event.type === 'schedule_week').result.scheduledInquiryIds.length);
  phaseImpacts[path] = impact;

  const closed = closeRunDay(opened.state).state;
  assert.deepEqual(finance, financeBefore, 'demand/operating projection does not mutate FinanceState');
  const envelope = JSON.parse(JSON.stringify(createRunSaveEnvelope(closed, finance)));
  const restored = restoreRunSaveEnvelope(envelope);
  assert.deepEqual(getV3RunOperatingImpact(restored.runState), getV3RunOperatingImpact(closed), 'save/restore reproduces the same weekly projection');
  assert.deepEqual(restored.financeState, financeBefore, 'finance state survives save/restore unchanged');
}
assert.ok(phaseImpacts.BOOM.after.inquiryCount >= phaseImpacts.DOWNTURN.after.inquiryCount, 'positive macro gap does not reduce inquiries relative to a negative gap');
assert.equal(phaseImpacts.UPSWING.after.availableCapacityHours, phaseImpacts.BOOM.after.availableCapacityHours, 'phase gap does not increase personnel capacity');
assert.equal(phaseImpacts.UPSWING.after.availableCapacityHours, phaseImpacts.DOWNTURN.after.availableCapacityHours, 'phase gap does not reduce personnel capacity');

// Neutral/missing exposure control leaves the D-0169 baseline exactly unchanged.
const baseline = makeRun('BOOM');
const neutralTemplates = (await import('./v3/run.js')).buildWeeklyTemplates('2027-01-04', baseline.seed, {
  runId: baseline.runId, scenarioId: baseline.scenarioId, activityGapPct: 3,
  activitySourceType: 'synthetic_fixture', activitySourceRef: 'fixture:neutral-control', exposure: 0,
});
assert.equal(neutralTemplates.length, 5);
assert.equal(neutralTemplates[0].macroDemand.demandFactor, 1);
assert.equal(neutralTemplates[0].macroDemand.realizedInquiryCount, 5);

// A genuine player award is counted from the market decision, not inferred from an inquiry; absent awards remain zero.
let run = makeRun('BOOM');
let opened = openNextRunDay(run);
run = opened.state;
const inquiry = opened.result.playerInquiries[0];
assert.ok(inquiry, 'fixture provides a player-addressed inquiry');
const offerEventId = 'impact-player-offer-1';
const offerId = createV3MarketOfferId(run.modules.market, offerEventId);
run = submitV3RunOffer(run, {
  eventId: offerEventId, inquiryId: inquiry.inquiryId, firmId: 'player', submittedAt: '2027-01-04',
  calculationSnapshot: { modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId, submittedAt: '2027-01-04', netPriceCents: 5000, costVersion: 'impact-cost-v1', babVersion: 'impact-bab-v1', calculation: { netPriceCents: 5000, dbICents: 1000 } },
}).state;
run = closeRunDay(run).state;
for (const date of ['2027-01-05', '2027-01-06']) run = advanceClosedDay(run);
assert.equal(run.customerWorkOrders.length, 1, 'low synthetic offer wins the selected inquiry under the deterministic fixture');
let impact = getV3RunOperatingImpact(run)[0];
assert.equal(impact.after.wonOrders, 1, 'only an accepted player decision counts as a won order');
assert.equal(impact.after.unresolvedPlanCount, 1, 'an accepted but unplanned order is reported as awaiting a plan');

// Planning attaches workload to its actual workweek and computes utilization against declared weekly personnel capacity.
opened = openNextRunDay(run); run = opened.state;
const order = run.customerWorkOrders[0];
const contractSnapshot = { contractRef: 'impact-contract-1', inquiryId: order.inquiryId, offerId: order.offerId, decisionId: order.decisionId, contractType: 'fixture', customerPartyId: order.customerPartyId, buyerPartyId: 'buyer-1', acceptancePartyId: order.customerPartyId, performanceCriterionRef: 'performance-1', acceptanceCriterionRef: 'acceptance-1', orderQuantity: 1, orderUnit: 'piece' };
run = planV3RunWorkOrder(run, { workOrderId: order.workOrderId, contractSnapshot, operations: [{ operationId: 'turn-1', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 4, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: {} }] }).state;
impact = getV3RunOperatingImpact(run)[0];
assert.equal(impact.after.plannedHours, 4);
assert.equal(impact.after.availableCapacityHours, 40);
assert.equal(impact.after.utilization, 0.1);
assert.equal(impact.after.wonOrders, 1);
assert.equal(impact.directFinanceEffect, false);

// A separate run with a full declared weekly commitment surfaces 100% utilization and rejects over-capacity planning.
const fullCommitments = ['2027-01-04', '2027-01-05', '2027-01-06', '2027-01-07', '2027-01-08'].map((date, index) => ({ id: `cap-${index}`, date, personId: 'worker-1', equipmentId: 'machine-1', hours: 8, status: 'planned' }));
let constrained = makeRun('UPSWING', fullCommitments);
opened = openNextRunDay(constrained); constrained = opened.state;
const constrainedInquiry = opened.result.playerInquiries[0];
const constrainedOfferEventId = 'impact-constrained-offer-1';
const constrainedOfferId = createV3MarketOfferId(constrained.modules.market, constrainedOfferEventId);
constrained = submitV3RunOffer(constrained, {
  eventId: constrainedOfferEventId, inquiryId: constrainedInquiry.inquiryId, firmId: 'player', submittedAt: '2027-01-04',
  calculationSnapshot: { modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId: constrainedOfferId, submittedAt: '2027-01-04', netPriceCents: 5000, costVersion: 'impact-cost-v1', babVersion: 'impact-bab-v1', calculation: { netPriceCents: 5000, dbICents: 1000 } },
}).state;
constrained = closeRunDay(constrained).state;
for (const date of ['2027-01-05', '2027-01-06']) constrained = advanceClosedDay(constrained);
opened = openNextRunDay(constrained); constrained = opened.state;
const constrainedOrder = constrained.customerWorkOrders[0];
assert.ok(constrainedOrder, 'capacity fixture also obtains an accepted order for the planning gate');
const constrainedContract = { ...contractSnapshot, contractRef: 'impact-contract-full', inquiryId: constrainedOrder.inquiryId, offerId: constrainedOrder.offerId, decisionId: constrainedOrder.decisionId, customerPartyId: constrainedOrder.customerPartyId, acceptancePartyId: constrainedOrder.customerPartyId };
const fullImpact = getV3RunOperatingImpact(constrained)[0];
assert.equal(fullImpact.after.plannedHours, 40);
assert.equal(fullImpact.after.availableCapacityHours, 40);
assert.equal(fullImpact.after.utilization, 1);
assert.throws(() => planV3RunWorkOrder(constrained, { workOrderId: constrainedOrder.workOrderId, contractSnapshot: constrainedContract, operations: [{ operationId: 'over-capacity', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 1, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: {} }] }), /daily capacity exceeded/, 'an extra operation beyond existing daily commitments is rejected');
assert.equal(getV3RunOperatingImpact(constrained)[0].after.utilization, 1, 'rejected work does not inflate projected load');

// No submitted player offer means no player win even when inquiries exist and competitors decide them.
let noAward = makeRun('DOWNTURN');
noAward = advanceClosedDay(noAward);
noAward = advanceClosedDay(noAward);
noAward = advanceClosedDay(noAward);
assert.equal(getV3RunOperatingImpact(noAward)[0].after.inquiryCount > 0, true);
assert.equal(getV3RunOperatingImpact(noAward)[0].after.wonOrders, 0);

console.log('V3 L0/L1 operating impact projection: PASS (four synthetic gaps, neutral control, awards/no-awards, workload/capacity/utilization, save/restore, FinanceState non-mutation)');
