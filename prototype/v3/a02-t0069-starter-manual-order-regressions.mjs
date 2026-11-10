import assert from 'node:assert/strict';
import { createV3MarketState, createV3MarketOfferId, getV3MarketPlayerView, V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from '../v3-market-simulation.js';
import { createV3Run, openV3RunDay, closeV3RunDay, submitV3RunOffer, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction, planV3RunWorkOrder, validateV3RunState } from '../v3-run-orchestrator.js';
import { createV3ProductState } from '../v3-product-lifecycle.js';
import { createV3StartingResources, getV3OperationalMarketCapabilities } from '../v3-occupational-competencies.js';
import { calculateV3MacroDemand } from '../v3-macro-demand-channel.js';
import { V3_MARKET_SEGMENT_TEMPLATE_CATALOG } from '../v3-run-macro-fixture.js';
import { createV3OfferSnapshot } from '../v3-financial-calculation.js';
import { buildV3ManagementOrderPlan, createV3ManagementContractSnapshot } from '../v3-management-order-planner.js';
import { createRunFromInputs, installRunOperatingResources, openNextRunDay } from './run.js';

const START = '2027-01-04';
const runId = 'T0069-STARTER-MANUAL-RUN';
const scenarioId = 'T0069-STARTER-MANUAL';
const seed = 'starter-manual-regression-v1';
const segments = [
  { segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } },
  { segmentId: 'medium', decisionWeights: { price: 0.5, reputation: 0.25, segmentFit: 0.25 } },
  { segmentId: 'large', decisionWeights: { price: 0.4, reputation: 0.25, segmentFit: 0.35 } },
];
const parameters = {
  weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 }, minimumMonthlyCompetitorSample: 3,
};

const resources = createV3StartingResources('metallbauer', 'geselle-fachwirt');
const startCapabilities = getV3OperationalMarketCapabilities(resources.people, resources.equipment);
assert.deepEqual(startCapabilities, ['manual-fabrication'], 'default Metallbauer starter resources unlock only their existing manual bench profile');
assert.deepEqual(V3_MARKET_SEGMENT_TEMPLATE_CATALOG.small.requiredCapabilities, ['manual-fabrication']);
assert.deepEqual(V3_MARKET_SEGMENT_TEMPLATE_CATALOG.medium.requiredCapabilities, ['turning']);
assert.deepEqual(V3_MARKET_SEGMENT_TEMPLATE_CATALOG.large.requiredCapabilities, ['turning']);

const firms = [
  { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: startCapabilities, segmentFit: { small: 0.75, medium: 0.7, large: 0.6 } },
  { firmId: 'synthetic-competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning', 'milling'], segmentFit: { small: 0.8, medium: 0.78, large: 0.75 }, offerPriceCentsBySizeClass: { small: 10000, medium: 30000, large: 50000 } },
  { firmId: 'synthetic-competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6, medium: 0.55, large: 0.5 }, offerPriceCentsBySizeClass: { small: 12000, medium: 36000, large: 62000 } },
  { firmId: 'synthetic-competitor-c', role: 'competitor', reputation: 0.62, capacityUnits: 10, capabilities: ['turning'], segmentFit: { small: 0.68, medium: 0.63, large: 0.56 }, offerPriceCentsBySizeClass: { small: 11500, medium: 34500, large: 58500 } },
];
const uiRun = createRunFromInputs({ scenarioId, seed, startDate: START, endDate: '2027-12-31' });
let run = installRunOperatingResources(uiRun, resources);
let smallInquiry = null;
for (let day = 0; day < 10 && !smallInquiry; day += 1) {
  run = openNextRunDay(run).state;
  smallInquiry = getV3MarketPlayerView(run.modules.market).inquiries.find(row => row.inquiryId && row.segmentId === 'small');
  if (!smallInquiry) run = closeV3RunDay(run, { date: run.activeDay.date }).state;
}
assert.ok(smallInquiry, 'the default manual starter receives a small inquiry during the first ten simulation days');
assert.deepEqual(smallInquiry.requiredCapabilities, ['manual-fabrication']);
const starterInquiryRecord = run.modules.market.inquiries.find(row => row.inquiryId === smallInquiry.inquiryId);
assert.deepEqual(starterInquiryRecord.invitedFirmIds, ['player'], 'only the manual-capable starter is invited; competitors keep their existing non-manual capabilities');
assert.deepEqual(starterInquiryRecord.offers, [], 'no competitor offer exists for this capability-exclusive starter inquiry');

const instructionId = 'T0069-STARTER-BENCH-INSTRUCTION';
run = planV3RunEquipmentInstruction(run, { instructionId, personId: 'P1', equipmentId: 'STARTER-KIT', plannedDate: START, sourceRef: `instruction:${instructionId}` }).state;
run = completeV3RunEquipmentInstruction(run, { instructionId }).state;

const offerEventId = 'T0069-STARTER-MANUAL-OFFER';
const offerId = createV3MarketOfferId(run.modules.market, offerEventId);
const priceCents = V3_MARKET_SEGMENT_TEMPLATE_CATALOG.small.referencePriceCents;
assert.equal(priceCents, 11000, 'the existing small-segment price anchor is exactly €110.00 net');
const calculationSnapshot = createV3OfferSnapshot({
  offerId, submittedAt: START, netPriceCents: priceCents, costVersion: 'existing-v3-cost-profile', babVersion: 'existing-v3-bab-profile',
  calculation: { netPriceCents: priceCents, dbICents: 0 },
});
const commercialTerms = {
  version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Manuelle Fertigung eines Montagewinkels', quantity: 2, unit: 'pieces',
  qualityTarget: 'standard', acceptanceCriteria: 'Vereinbarte Maße und Sichtprüfung', deliveryDate: '2027-01-08',
  contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION),
};
run = submitV3RunOffer(run, { eventId: offerEventId, inquiryId: smallInquiry.inquiryId, firmId: 'player', submittedAt: START, calculationSnapshot, commercialTerms }).state;
run = closeV3RunDay(run, { date: START }).state;
run = openV3RunDay(run, { date: '2027-01-05' }).state;
run = closeV3RunDay(run, { date: '2027-01-05' }).state;
run = openV3RunDay(run, { date: '2027-01-06' }).state;
const acceptedOrder = run.customerWorkOrders.find(row => row.inquiryId === smallInquiry.inquiryId);
assert.ok(acceptedOrder, 'the existing customer decision path accepts the sole qualified small offer');
assert.equal(acceptedOrder.status, 'awaiting_operational_plan');
assert.equal(acceptedOrder.offerId, offerId);
assert.deepEqual(acceptedOrder.contractTermsSnapshot, commercialTerms, 'the accepted contract preserves the submitted scope, quantity, quality, acceptance condition and delivery date');
const acceptedInquiryRecord = run.modules.market.inquiries.find(row => row.inquiryId === smallInquiry.inquiryId);
const acceptedOffer = acceptedInquiryRecord.offers.find(row => row.offerId === acceptedOrder.offerId);
assert.equal(acceptedOffer.netPriceCents, 11000, 'accepted net price is the exact submitted €110.00 anchor');
assert.deepEqual(acceptedOffer.commercialTerms, commercialTerms);
assert.deepEqual(acceptedInquiryRecord.offers.map(row => row.firmId), ['player'], 'the accepted order has no competitor offer because existing competitors lack manual-fabrication capability');

const generated = buildV3ManagementOrderPlan(run, acceptedOrder);
assert.ok(generated.operations.length > 0);
assert.ok(generated.operations.every(row => row.personId === 'P1' && row.equipmentId === 'STARTER-KIT'));
assert.ok(generated.operations.every(row => row.requiredSkills.includes('manual_fabrication') && row.requiredEquipmentCapabilities.includes('bench-tools')));
const planned = planV3RunWorkOrder(run, {
  workOrderId: acceptedOrder.workOrderId,
  contractSnapshot: createV3ManagementContractSnapshot(acceptedOrder),
  operations: generated.operations,
});
run = planned.state;
assert.equal(planned.result.status, 'in_progress');
assert.equal(run.customerWorkOrders.find(row => row.workOrderId === acceptedOrder.workOrderId).status, 'in_progress');
assert.equal(validateV3RunState(run), true, 'accepted starter-compatible order and generated plan pass shared-run validation');

console.log('PASS T-0069 starter manual inquiry -> offer -> customer acceptance -> management plan/validator; existing price, turning requests and competitor profiles unchanged.');
