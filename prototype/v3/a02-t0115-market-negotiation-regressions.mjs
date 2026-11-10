import assert from 'node:assert/strict';
import {
  createV3MarketState, scheduleV3MarketWeek, advanceV3MarketDay, closeV3MarketDay,
  submitV3MarketOffer, submitV3MarketCounterResponse, createV3MarketOfferId,
  getV3MarketPlayerView, V3_FINANCIAL_SNAPSHOT_VERSION, validateV3MarketState,
} from '../v3-market-simulation.js';
import {
  createV3Run, openV3RunDay, submitV3RunOffer,
  submitV3RunCounterResponse, validateV3RunState,
} from '../v3-run-orchestrator.js';

const parameters = {
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 },
  customerDecisionDelayCalendarDays: { min: 1, max: 3 },
  minimumMonthlyCompetitorSample: 3,
};
const segments = [{ segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } }];
const firms = [
  { firmId: 'player', role: 'player', reputation: 0.9, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: 0.9 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning'], segmentFit: { small: 0.8 }, offerPriceCentsBySizeClass: { small: 1000000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6 }, offerPriceCentsBySizeClass: { small: 1200000 } },
  { firmId: 'competitor-c', role: 'competitor', reputation: 0.6, capacityUnits: 9, capabilities: ['turning'], segmentFit: { small: 0.7 }, offerPriceCentsBySizeClass: { small: 1150000 } },
];
const template = { templateId: 'inquiry-template', customerId: 'customer-1', segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 2, referencePriceCents: 10000, macroPeriod: '2027-01' };
const shift = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const makeMarket = (runId, seed = 'seed-1') => {
  const initial = createV3MarketState({ runId, scenarioId: 't0115-scenario', seed, parameterSetId: 'market-test-v1', startDate: '2027-01-04', parameters, segments, firms });
  const scheduled = scheduleV3MarketWeek(initial, { weekStart: '2027-01-04', templates: [{ ...template, templateId: `template-${runId}` }] });
  assert.equal(scheduled.ok, true);
  let market = scheduled.state;
  for (let day = 0; day < 5 && market.inquiries[0]?.status !== 'open'; day += 1) {
    if (market.dayPhase === 'actions') market = closeV3MarketDay(market, market.currentDate).state;
    const date = shift(market.currentDate, 1);
    market = advanceV3MarketDay(market, date).state;
  }
  return market;
};
const offerInput = (state, { eventId, priceCents, submittedAt = state.currentDate, commercialTerms = null }) => ({
  eventId, inquiryId: state.inquiries[0].inquiryId, firmId: 'player', submittedAt,
  calculationSnapshot: {
    modelVersion: V3_FINANCIAL_SNAPSHOT_VERSION,
    offerId: createV3MarketOfferId(state, eventId), submittedAt, netPriceCents: priceCents,
    costVersion: 'cost-v1', babVersion: 'bab-v1', calculation: { netPriceCents: priceCents },
  }, commercialTerms,
});
const advanceToNegotiationFinal = (market, negotiationId) => {
  for (let day = 0; day < 10; day += 1) {
    const date = shift(market.currentDate, 1);
    market = closeV3MarketDay(market, market.currentDate).state;
    market = advanceV3MarketDay(market, date).state;
    const negotiation = market.negotiations.find(row => row.negotiationId === negotiationId);
    if (!['countered', 'response_submitted'].includes(negotiation.status)) break;
  }
  return market;
};

// A/M limits use integer cents and the current segment weight.
let market = makeMarket('counter-accept');
const inquiry = market.inquiries[0];
const initial = submitV3MarketOffer(market, offerInput(market, { eventId: 'player-initial', priceCents: 10800 }));
assert.equal(initial.ok, true, JSON.stringify(initial.error));
market = initial.state;
const negotiation = market.negotiations[0];
assert.equal(negotiation.referencePriceCents, 10000);
assert.equal(negotiation.segmentPriceWeight, 0.6);
assert.equal(negotiation.acceptancePriceCents, 10400);
assert.equal(negotiation.maximumPriceCents, 11000);
assert.equal(negotiation.counterPriceCents, 10400);
assert.equal(negotiation.responseDueAt, shift(inquiry.receivedAt, 3));
assert.equal(market.inquiries[0].offers.find(row => row.offerId === negotiation.originalOfferId).calculationSnapshot.netPriceCents, 10800, 'original offer snapshot is immutable');
assert.equal(initial.result.counterPriceCents, 10400);
const playerView = getV3MarketPlayerView(market);
assert.equal(playerView.inquiries[0].negotiation.counterPriceCents, 10400);
for (const hiddenField of ['maximumPriceCents', 'acceptancePriceCents', 'referencePriceCents', 'segmentPriceWeight', 'initialPlayerPriceCents', 'playerFirmId', 'originalOfferId']) {
  assert.equal(Object.hasOwn(playerView.inquiries[0].negotiation, hiddenField), false, `player projection omits internal field ${hiddenField}`);
}
assert.equal(JSON.stringify(playerView).includes('competitor-a'), false);
assert.equal(JSON.stringify(playerView).includes('1000000'), false, 'player projection does not reveal competitor bid prices');

// Exact acceptance of A closes immediately; a lower P2 is a new offer and stays delayed.
const responseInput = offerInput(market, { eventId: 'player-response-accept', priceCents: 10400 });
responseInput.negotiationId = negotiation.negotiationId;
const response = submitV3MarketCounterResponse(market, responseInput);
assert.equal(response.ok, true);
market = response.state;
const negotiationId = negotiation.negotiationId;
const responseOfferId = market.negotiations[0].responseOfferId;
assert.equal(market.negotiations[0].status, 'accepted');
assert.equal(response.result.status, 'accepted');
assert.equal(response.result.contractCreated, true);
assert.equal(response.result.financialEffect, 'none');
assert.notEqual(responseOfferId, market.negotiations[0].originalOfferId);
assert.equal(market.inquiries[0].offers.find(row => row.offerId === negotiation.originalOfferId).status, 'superseded');
assert.equal(market.inquiries[0].offers.find(row => row.offerId === responseOfferId).calculationSnapshot.netPriceCents, 10400);
assert.equal(market.negotiations[0].decisionAt, responseInput.submittedAt);
assert.equal(market.inquiries[0].decidedAt, responseInput.submittedAt);
assert.equal(market.inquiries[0].winningOfferId, responseOfferId);
assert.equal(market.inquiries[0].winnerFirmId, 'player');
assert.equal(market.inquiries[0].offers.find(row => row.offerId === responseOfferId).status, 'accepted');
assert.equal(submitV3MarketCounterResponse(market, responseInput).duplicate, true, 'same event replay stays idempotent');
validateV3MarketState(market);

let lower = makeMarket('counter-response-lower');
lower = submitV3MarketOffer(lower, offerInput(lower, { eventId: 'lower-initial', priceCents: 10800 })).state;
const lowerNegotiationId = lower.negotiations[0].negotiationId;
const lowerInput = offerInput(lower, { eventId: 'lower-response', priceCents: 10399 }); lowerInput.negotiationId = lowerNegotiationId;
const lowerResult = submitV3MarketCounterResponse(lower, lowerInput);
assert.equal(lowerResult.ok, true);
assert.equal(lowerResult.result.status, 'submitted');
assert.equal(lowerResult.result.contractCreated, undefined);
assert.equal(lowerResult.state.negotiations[0].status, 'response_submitted');
assert.equal(lowerResult.state.inquiries[0].status, 'open');
assert.equal(lowerResult.result.financialEffect, 'none');
assert.equal(lowerResult.state.negotiations[0].decisionAt >= shift(lowerInput.submittedAt, 1) && lowerResult.state.negotiations[0].decisionAt <= shift(lowerInput.submittedAt, 3), true);
lower = advanceToNegotiationFinal(lowerResult.state, lowerNegotiationId);
assert.equal(lower.negotiations[0].status, 'accepted');
assert.equal(lower.inquiries[0].winningOfferId, lower.negotiations[0].responseOfferId);
assert.equal(lower.inquiries[0].decidedAt > lowerInput.submittedAt, true);
validateV3MarketState(lower);

// A response above A is rejected immediately and never creates a player contract.
let reject = makeMarket('counter-reject');
const rejectInitial = submitV3MarketOffer(reject, offerInput(reject, { eventId: 'reject-initial', priceCents: 10800 }));
reject = rejectInitial.state;
const rejectNegotiationId = reject.negotiations[0].negotiationId;
const rejectResponseInput = offerInput(reject, { eventId: 'reject-response', priceCents: 10401 });
rejectResponseInput.negotiationId = rejectNegotiationId;
const rejectResult = submitV3MarketCounterResponse(reject, rejectResponseInput);
assert.equal(rejectResult.ok, true);
assert.equal(rejectResult.result.status, 'rejected');
assert.equal(rejectResult.result.contractCreated, false);
assert.equal(rejectResult.result.financialEffect, 'none');
reject = rejectResult.state;
assert.equal(reject.negotiations[0].status, 'rejected');
assert.equal(reject.negotiations[0].decidedAt, rejectResponseInput.submittedAt);
assert.equal(reject.inquiries[0].winnerFirmId === 'player', false);
validateV3MarketState(reject);

// Ordinary offers at/below A retain the existing decision path without a counter.
let ordinary = makeMarket('ordinary-at-ceiling');
const ordinaryResult = submitV3MarketOffer(ordinary, offerInput(ordinary, { eventId: 'ordinary-a', priceCents: 10400 }));
assert.equal(ordinaryResult.ok, true);
assert.equal(ordinaryResult.state.negotiations.length, 0);
assert.equal(ordinaryResult.result.negotiationId, undefined);

// Above M is rejected without a counter; a pending response expires after three calendar days without creating a contract.
let high = makeMarket('above-max');
const highResult = submitV3MarketOffer(high, offerInput(high, { eventId: 'player-too-high', priceCents: 11001 }));
assert.equal(highResult.ok, true);
high = highResult.state;
assert.equal(high.negotiations[0].status, 'rejected_above_max');
assert.equal(high.negotiations[0].counterPriceCents, null);
assert.equal(high.inquiries[0].offers.find(row => row.offerId === high.negotiations[0].originalOfferId).status, 'declined');
assert.equal(highResult.result.counterPriceCents, null);
assert.equal(submitV3MarketOffer(high, offerInput(high, { eventId: 'player-second-shot', priceCents: 10400 })).error.code, 'negotiation_round_already_used');

let expired = makeMarket('counter-expire');
const pending = submitV3MarketOffer(expired, offerInput(expired, { eventId: 'player-no-response', priceCents: 10800 }));
expired = pending.state;
expired = advanceToNegotiationFinal(expired, expired.negotiations[0].negotiationId);
assert.equal(expired.negotiations[0].status, 'expired');
assert.equal(expired.inquiries[0].winnerFirmId === 'player', false);
assert.equal(expired.negotiations[0].responseOfferId, null);

// One revision only; scope changes and late responses cannot create offers.
let changedScope = makeMarket('scope-change');
const terms = { version: 'V3-COMMERCIAL-TERMS-2', scope: 'Drehteil nach Zeichnung, Sichtprüfung und Maßprotokoll', quantity: 1, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maße gemäß Zeichnung und dokumentierte Sichtprüfung', deliveryDate: '2027-01-20', contractClassification: { id: 'V3-WERKLIEFERUNG-METALL-B2B-1', contractType: 'werklieferung-movable-metal-goods-purchase-law', legalReference: 'BGB § 650 Abs. 1', scenarioScope: 'manufacture-and-delivery-of-movable-metal-goods', partyScope: 'B2B-simulation' }, acceptanceScenario: { id: 'D-0157-F3', responseWindowWorkdays: 5, countFrom: 'workday-after-complete-delivery', decisionParty: 'customer-or-authorized-recipient', timeoutOutcome: 'automatic-customer-side-simulation-acceptance', simulationOnly: true } };
const scopedInitial = submitV3MarketOffer(changedScope, offerInput(changedScope, { eventId: 'scoped-initial', priceCents: 10800, commercialTerms: terms }));
changedScope = scopedInitial.state;
const changed = structuredClone(terms); changed.quantity = 2;
const changedResponseInput = offerInput(changedScope, { eventId: 'changed-scope-response', priceCents: 10400, commercialTerms: changed });
changedResponseInput.negotiationId = changedScope.negotiations[0].negotiationId;
assert.equal(submitV3MarketCounterResponse(changedScope, changedResponseInput).error.code, 'counteroffer_scope_changed');
let late = changedScope;
late = advanceToNegotiationFinal(late, late.negotiations[0].negotiationId);
assert.equal(late.negotiations[0].status, 'expired');
const lateInput = offerInput(late, { eventId: 'late-response', priceCents: 10400, submittedAt: late.currentDate, commercialTerms: terms });
lateInput.negotiationId = late.negotiations[0].negotiationId;
assert.notEqual(submitV3MarketCounterResponse(late, lateInput).ok, true);

// Shared-run response replay creates the accepted contract work order on the same event, without finance posting.
const runId = 't0115-run-shared';
const runMarket = createV3MarketState({ runId, scenarioId: 't0115-run-scenario', seed: 't0115-run-seed', parameterSetId: 'market-test-v1', startDate: '2027-01-04', parameters, segments, firms });
const templates = Array.from({ length: 5 }, (_, index) => ({ ...template, templateId: `run-inquiry-${index + 1}`, customerId: `run-customer-${index + 1}` }));
let run = createV3Run({ runId, scenarioId: 't0115-run-scenario', seed: 't0115-run-seed', startDate: '2027-01-04', endDate: '2027-12-31', marketState: runMarket });
run = openV3RunDay(run, { date: '2027-01-04', marketWeekTemplates: templates }).state;
const runInquiry = run.modules.market.inquiries.find(row => row.status === 'open' && row.invitedFirmIds.includes('player'));
assert.ok(runInquiry, 'shared run must expose an open player inquiry for the test');
const runOffer = offerInput(run.modules.market, { eventId: 'run-initial', priceCents: 10800 });
runOffer.inquiryId = runInquiry.inquiryId;
const runSubmitted = submitV3RunOffer(run, runOffer);
assert.equal(runSubmitted.ok, true);
run = runSubmitted.state;
assert.equal(run.customerWorkOrders.length, 0);
assert.equal(run.financeHandoffs.length, 0);
const runNegotiation = run.modules.market.negotiations.find(row => row.inquiryId === runInquiry.inquiryId);
const runResponse = offerInput(run.modules.market, { eventId: 'run-counter-response', priceCents: runNegotiation.acceptancePriceCents });
runResponse.negotiationId = runNegotiation.negotiationId;
const runResponseResult = submitV3RunCounterResponse(run, runResponse);
assert.equal(runResponseResult.ok, true);
run = runResponseResult.state;
assert.equal(run.customerWorkOrders.length, 1, 'exact counter acceptance creates the contract work order on the response event');
assert.equal(run.customerWorkOrders[0].acceptedAt, run.activeDay.date);
assert.equal(run.financeHandoffs.length, 1, 'contract creates only the existing non-posting finance handoff');
assert.equal(run.financeHandoffs[0].status, 'pending_non_posting');
assert.equal(run.dayEvents.some(event => event.phase === 'work_order_created' && event.occurredAt === run.activeDay.date), true);
validateV3RunState(run);
const runReplay = submitV3RunCounterResponse(run, runResponse);
assert.equal(runReplay.ok, true);
assert.equal(runReplay.duplicate, true, 'shared-run replay does not create a second contract, event or finance handoff');
assert.equal(runReplay.state.customerWorkOrders.length, 1);
assert.equal(runReplay.state.financeHandoffs.length, 1);
assert.equal(run.customerWorkOrders.length, 1, 'only customer acceptance creates the work order');
assert.equal(run.financeHandoffs.length, 1);
assert.equal(run.financeHandoffs[0].status, 'pending_non_posting');
assert.equal(run.modules.market.negotiations.find(row => row.negotiationId === runNegotiation.negotiationId).status, 'accepted');

// Module versioning fails closed on legacy V3-MARKET-1 saves.
const legacy = structuredClone(market); legacy.modelVersion = 'V3-MARKET-1';
assert.throws(() => getV3MarketPlayerView(legacy), /V3 market state shape is invalid/);

console.log('A02 T-0115 market negotiation regression checks passed');
