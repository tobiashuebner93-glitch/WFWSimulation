import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { calculateV3OfferEstimate, createV3OfferSnapshot, acceptV3OfferSnapshot } from './v3-financial-calculation.js';
import {
  createV3MarketState, scheduleV3MarketWeek, advanceV3MarketDay, closeV3MarketDay, submitV3MarketOffer, createV3MarketOfferId,
  getV3MarketPlayerView, getV3MonthlyCompetitorReport, validateV3MarketState
} from './v3-market-simulation.js';

// Explicit synthetic scenario fixtures: these values are tests, not empirical market estimates.
const parameters = {
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 },
  customerDecisionDelayCalendarDays: { min: 2, max: 2 },
  minimumMonthlyCompetitorSample: 3
};
const firms = [
  { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: ['turning', 'milling'], segmentFit: { small: 0.75, medium: 0.7, large: 0.6 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning', 'milling'], segmentFit: { small: 0.8, medium: 0.78, large: 0.75 }, offerPriceCentsBySizeClass: { small: 10000, medium: 30000, large: 50000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6, medium: 0.55, large: 0.5 }, offerPriceCentsBySizeClass: { small: 12000, medium: 36000, large: 62000 } },
  { firmId: 'ineligible', role: 'competitor', reputation: 1, capacityUnits: 100, capabilities: ['welding'], segmentFit: { small: 1, medium: 1, large: 1 }, offerPriceCentsBySizeClass: { small: 1, medium: 1, large: 1 } }
];
const segments = [
  { segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } },
  { segmentId: 'medium', decisionWeights: { price: 0.5, reputation: 0.25, segmentFit: 0.25 } },
  { segmentId: 'large', decisionWeights: { price: 0.4, reputation: 0.25, segmentFit: 0.35 } }
];
const profile = (seed = 'seed-a', overrides = {}) => ({ runId: 'market-run-1', scenarioId: 'market-scenario', seed, parameterSetId: 'market-fixture-v1', startDate: '2027-01-04', parameters, segments, firms, ...overrides });
const sizeClasses = ['small', 'medium', 'large'];
const templates = (week, count = 5) => Array.from({ length: count }, (_, i) => {
  const sizeClass = sizeClasses[i % sizeClasses.length];
  const size = { small: { capacity: 2, referencePriceCents: 11000 }, medium: { capacity: 4, referencePriceCents: 33000 }, large: { capacity: 5, referencePriceCents: 55000 } }[sizeClass];
  return { templateId: `${week}-request-${i}`, customerId: `customer-${week}-${i}`, segmentId: sizeClass, sizeClass, requiredCapabilities: ['turning'], requiredCapacity: size.capacity, referencePriceCents: size.referencePriceCents, macroPeriod: '2027-01' };
});
const calculation = (offerId, submittedAt, netPriceCents) => ({ modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId, submittedAt, netPriceCents, costVersion: 'cost-v3-fixture', babVersion: 'bab-v3-fixture', calculation: { netPriceCents, dbICents: 3000, resultAfterDirectCostsCents: 1000, babAllocatedCents: 500 } });
const must = result => { assert.equal(result.ok, true, result.error?.message); return result; };
const schedule = (state, week, items = templates(week)) => must(scheduleV3MarketWeek(state, { weekStart: week, templates: items }));
const stable = value => {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
};
function awardFor({ priceCents, playerPatch = {}, competitorAPatch = {}, seed = 'award-fixture' }) {
  const configuredFirms = firms.map(firm => {
    const patch = firm.firmId === 'player' ? playerPatch : firm.firmId === 'competitor-a' ? competitorAPatch : {};
    return { ...firm, ...patch, segmentFit: { ...firm.segmentFit, ...(patch.segmentFit ?? {}) }, ...(patch.offerPriceCentsBySizeClass ? { offerPriceCentsBySizeClass: { ...firm.offerPriceCentsBySizeClass, ...patch.offerPriceCentsBySizeClass } } : {}) };
  });
  const configuredParameters = { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 } };
  let sample = createV3MarketState(profile(seed, { firms: configuredFirms, parameters: configuredParameters }));
  sample = schedule(sample, '2027-01-04', [templates('award', 1)[0]]).state;
  const received = must(advanceV3MarketDay(sample, '2027-01-04')); sample = received.state;
  const inquiryId = received.result.receivedInquiryIds[0];
  const offerId = 'player-offer-' + seed;
  sample = must(submitV3MarketOffer(sample, {
    eventId: offerId, inquiryId, firmId: 'player', submittedAt: '2027-01-04',
    calculationSnapshot: calculation(createV3MarketOfferId(sample, offerId), '2027-01-04', priceCents)
  })).state;
  sample = must(closeV3MarketDay(sample, '2027-01-04')).state;
  sample = must(advanceV3MarketDay(sample, '2027-01-05')).state;
  sample = must(closeV3MarketDay(sample, '2027-01-05')).state;
  sample = must(advanceV3MarketDay(sample, '2027-01-06')).state;
  return sample.inquiries[0].winnerFirmId;
}

// Reference-price scoring permits a price-led award without making price the only determinant.
assert.equal(awardFor({ priceCents: 11000 }), 'competitor-a',
  'at the reference price, the stronger incumbent reputation and fit can prevail');
assert.equal(awardFor({ priceCents: 8000, seed: 'award-price-led' }), 'player',
  'a meaningfully lower player offer can overcome the incumbent quality lead');
assert.equal(awardFor({ priceCents: 11000, seed: 'award-quality-led', playerPatch: { reputation: 1, segmentFit: { small: 1 } } }), 'player',
  'improved reputation and segment fit can change the result at the same price');
assert.equal(awardFor({ priceCents: 0, seed: 'award-quality-not-price-alone', competitorAPatch: { reputation: 1, segmentFit: { small: 1 }, offerPriceCentsBySizeClass: { small: 1 } } }), 'competitor-a',
  'even the lowest player price is not sufficient against an almost equal price and materially stronger reputation/fit');

// Identical seed/profile reproduces the same inquiries, invitation ranks and weekday distribution.
let state = createV3MarketState(profile());
const initial = structuredClone(state);
const week1 = schedule(state, '2027-01-04'); state = week1.state;
function restoreWithReferencePrice(value) {
  const restored = structuredClone(week1.state);
  const scheduleEvent = restored.events.find(event => event.type === 'schedule_week');
  scheduleEvent.payload.templates[0].referencePriceCents = value;
  restored.inquiries.find(row => row.inquiryId === scheduleEvent.result.scheduledInquiryIds[0]).referencePriceCents = value;
  restored.scheduledWeeks[scheduleEvent.eventKey] = stable(scheduleEvent.payload.templates);
  return restored;
}
assert.equal(validateV3MarketState(restoreWithReferencePrice(1)), true, 'restored positive safe-integer reference prices remain valid');
assert.equal(validateV3MarketState(restoreWithReferencePrice(Number.MAX_SAFE_INTEGER)), true, 'the largest positive safe-integer reference price remains valid');
for (const invalidReferencePrice of [0, -1, null, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
  assert.throws(() => validateV3MarketState(restoreWithReferencePrice(invalidReferencePrice)), /positive safe integer/i,
    'restore rejects invalid reference price ' + String(invalidReferencePrice));
}
const invalidNormalTemplate = { ...templates('invalid-reference', 1)[0], referencePriceCents: 0 };
const invalidNormalSchedule = scheduleV3MarketWeek(createV3MarketState(profile('normal-zero-reference')), { weekStart: '2027-01-04', templates: [invalidNormalTemplate] });
assert.equal(invalidNormalSchedule.ok, false, 'normal schedule creation continues to reject zero reference prices');
assert.match(invalidNormalSchedule.error.message, /referencePriceCents must be positive integer cents/);
let maxPriceState = createV3MarketState(profile('max-price-run', {
  parameters: { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 } }
}));
const maxPriceTemplate = { ...templates('max-price-run', 1)[0], referencePriceCents: Number.MAX_SAFE_INTEGER };
maxPriceState = schedule(maxPriceState, '2027-01-04', [maxPriceTemplate]).state;
const maxPriceArrival = must(advanceV3MarketDay(maxPriceState, '2027-01-04')); maxPriceState = maxPriceArrival.state;
const maxPriceOfferId = 'max-safe-price-player-offer';
const maxPriceSubmission = must(submitV3MarketOffer(maxPriceState, {
  eventId: maxPriceOfferId, inquiryId: maxPriceArrival.result.receivedInquiryIds[0], firmId: 'player', submittedAt: '2027-01-04',
  calculationSnapshot: calculation(createV3MarketOfferId(maxPriceState, maxPriceOfferId), '2027-01-04', Number.MAX_SAFE_INTEGER)
})); maxPriceState = maxPriceSubmission.state;
assert.equal(maxPriceSubmission.result.status, 'submitted');
assert.equal(maxPriceState.negotiations.length, 0, 'at the representable ceiling, the bounded acceptance/maximum prices remain safe and the ceiling quote is classified without overflowing');
maxPriceState = must(closeV3MarketDay(maxPriceState, '2027-01-04')).state;
maxPriceState = must(advanceV3MarketDay(maxPriceState, '2027-01-05')).state;
maxPriceState = must(closeV3MarketDay(maxPriceState, '2027-01-05')).state;
maxPriceState = must(advanceV3MarketDay(maxPriceState, '2027-01-06')).state;
assert.equal(maxPriceState.inquiries[0].status, 'resolved', 'maximum safe-integer reference/offer values yield a finite decision score and a resolved inquiry');
assert.equal(validateV3MarketState(maxPriceState), true);
let nearMaxState = createV3MarketState(profile('near-max-price-run', { runId: 'near-max-price-run' }));
nearMaxState = schedule(nearMaxState, '2027-01-04', [{ ...templates('near-max-price', 1)[0], referencePriceCents: Number.MAX_SAFE_INTEGER - 100 }]).state;
const nearMaxArrival = must(advanceV3MarketDay(nearMaxState, '2027-01-04')); nearMaxState = nearMaxArrival.state;
const nearMaxOfferId = 'near-max-safe-price-player-offer';
const nearMaxSubmission = must(submitV3MarketOffer(nearMaxState, {
  eventId: nearMaxOfferId, inquiryId: nearMaxArrival.result.receivedInquiryIds[0], firmId: 'player', submittedAt: '2027-01-04',
  calculationSnapshot: calculation(createV3MarketOfferId(nearMaxState, nearMaxOfferId), '2027-01-04', Number.MAX_SAFE_INTEGER - 100)
})); nearMaxState = nearMaxSubmission.state;
assert.equal(nearMaxState.negotiations.length, 0, 'near-safe-integer reference and quote are classified without overflow or unsafe thresholds');
assert.equal(validateV3MarketState(nearMaxState), true);
assert.deepEqual(initial, createV3MarketState(profile()), 'state creation does not mutate or depend on outside state');
assert.deepEqual(state, schedule(createV3MarketState(profile()), '2027-01-04').state);
assert.equal(schedule(state, '2027-01-04').duplicate, true, 'same weekly schedule is idempotent');
const scheduledRestore = structuredClone(state);
const scheduledInquiryCount = scheduledRestore.inquiries.length;
const restoredReplay = schedule(scheduledRestore, '2027-01-04');
assert.equal(restoredReplay.duplicate, true, 'a valid restored schedule replays as the same event');
assert.equal(restoredReplay.state.inquiries.length, scheduledInquiryCount, 'valid schedule replay does not duplicate inquiry IDs');
const corruptedScheduleRestore = structuredClone(state);
corruptedScheduleRestore.events = corruptedScheduleRestore.events.filter(event => event.type !== 'schedule_week');
corruptedScheduleRestore.processedEventIds = corruptedScheduleRestore.processedEventIds.filter(id => !id.includes('|schedule_week|'));
const corruptedBeforeReplay = structuredClone(corruptedScheduleRestore);
assert.throws(() => validateV3MarketState(corruptedScheduleRestore), /scheduled week history and schedule event log disagree/,
  'removing a schedule event and its idempotency index while retaining week/inquiry history is invalid');
const rejectedCorruptReplay = scheduleV3MarketWeek(corruptedScheduleRestore, { weekStart: '2027-01-04', templates: templates('2027-01-04') });
assert.equal(rejectedCorruptReplay.ok, false);
assert.equal(rejectedCorruptReplay.error.code, 'invalid_market_state', 'corrupt restored history is rejected in a controlled way');
assert.deepEqual(corruptedScheduleRestore, corruptedBeforeReplay, 'rejected replay does not mutate the corrupt caller state');
assert.equal(new Set(corruptedScheduleRestore.inquiries.map(inquiry => inquiry.inquiryId)).size, scheduledInquiryCount,
  'failed replay leaves exactly one existing inquiry per stable inquiry ID');
assert.equal(state.inquiries[0].invitedFirmIds.includes('ineligible'), false, 'capability fit gates invitation');
for (const week of ['2027-01-11', '2027-01-18', '2027-01-25']) state = schedule(state, week, templates(week)).state;
assert.ok(new Set(state.inquiries.map(item => new Date(`${item.receivedAt}T12:00:00Z`).getUTCDay())).size >= 4, 'fixture arrivals span at least four weekdays');
assert.deepEqual(new Set(state.inquiries.map(item => item.segmentId)), new Set(['small', 'medium', 'large']), 'permanent A02 fixture covers three customer segments');
assert.deepEqual(new Set(state.inquiries.map(item => item.sizeClass)), new Set(['small', 'medium', 'large']), 'permanent A02 fixture covers three order sizes');

// Three reproducible seed runs spread a month of demand across the working week.
for (const seed of ['seed-a', 'seed-b', 'seed-c']) {
  let sample = createV3MarketState(profile(seed));
  for (const week of ['2027-01-04', '2027-01-11', '2027-01-18', '2027-01-25']) sample = schedule(sample, week, templates(week)).state;
  const weekdays = new Set(sample.inquiries.map(item => new Date(`${item.receivedAt}T12:00:00Z`).getUTCDay()));
  assert.ok(weekdays.size >= 4, `${seed} should distribute request arrivals across workdays`);
  assert.ok(sample.inquiries.every(item => new Date(`${item.receivedAt}T12:00:00Z`).getUTCDay() >= 1 && new Date(`${item.receivedAt}T12:00:00Z`).getUTCDay() <= 5));
}

// Process a month sequentially; arrival day creates hidden competitor offers, player's price snapshot freezes.
for (let day = 0; day < 28; day += 1) {
  const date = new Date(Date.parse('2027-01-04T12:00:00Z') + day * 86400000).toISOString().slice(0, 10);
  const advanced = must(advanceV3MarketDay(state, date));
  state = advanced.state;
  for (const inquiryId of advanced.result.receivedInquiryIds) {
    const view = getV3MarketPlayerView(state);
    const inquiry = view.inquiries.find(row => row.inquiryId === inquiryId);
    if (!inquiry) continue;
    const sourceInquiry = state.inquiries.find(row => row.inquiryId === inquiryId);
    const priorOfferCount = sourceInquiry.offers.length;
    const submissionEventId = `player-offer-${inquiryId}`;
    const snapshot = calculation(createV3MarketOfferId(state, submissionEventId), date, 9000);
    const beforeSubmit = structuredClone(snapshot);
    const submitted = must(submitV3MarketOffer(state, { eventId: submissionEventId, inquiryId, firmId: 'player', submittedAt: date, calculationSnapshot: snapshot }));
    state = submitted.state;
    snapshot.netPriceCents = 1;
    assert.equal(sourceInquiry.offers.length, priorOfferCount, 'offer transition does not mutate prior state');
    assert.equal(state.inquiries.find(row => row.inquiryId === inquiryId).offers.find(offer => offer.firmId === 'player').calculationSnapshot.netPriceCents, beforeSubmit.netPriceCents, 'offer snapshot is copied/frozen');
    const replay = submitV3MarketOffer(state, { eventId: submissionEventId, inquiryId, firmId: 'player', submittedAt: date, calculationSnapshot: beforeSubmit });
    assert.equal(replay.ok, true); assert.equal(replay.duplicate, true, 'offer submission replay is idempotent after later state transitions');
    const conflictingSnapshot = structuredClone(beforeSubmit); conflictingSnapshot.netPriceCents += 1; conflictingSnapshot.calculation.netPriceCents += 1;
    assert.equal(submitV3MarketOffer(state, { eventId: submissionEventId, inquiryId, firmId: 'player', submittedAt: date, calculationSnapshot: conflictingSnapshot }).error.code, 'market_event_payload_conflict');
    assert.equal(getV3MarketPlayerView(state).inquiries.find(row => row.inquiryId === inquiryId).ownOffer.calculationSnapshot.netPriceCents, 9000);
  }
  const closed = must(closeV3MarketDay(state, date)); state = closed.state;
  const replayAdvance = advanceV3MarketDay(state, date);
  assert.equal(replayAdvance.ok, true); assert.equal(replayAdvance.duplicate, true, 'day advancement replays idempotently after end-of-day');
  assert.deepEqual(replayAdvance.state, state);
  assert.equal(closeV3MarketDay(state, date).duplicate, true, 'end-of-day expiry replays idempotently');
}
assert.equal(validateV3MarketState(state), true);
assert.ok(state.inquiries.some(item => item.status === 'resolved'));
const firstAccepted = state.inquiries.flatMap(item => item.offers).find(offer => offer.firmId === 'player' && offer.status === 'accepted');
assert.ok(firstAccepted, 'competitive price and fit can win an award');
assert.equal(firstAccepted.calculationSnapshot.netPriceCents, 9000, 'acceptance does not alter submitted plan price');
assert.ok(firstAccepted.calculationSnapshot.costVersion && firstAccepted.calculationSnapshot.babVersion, 'D-0162 source snapshots remain attached');
assert.ok(state.inquiries.filter(item => item.status === 'resolved').every(item => item.decisionId && item.decidedAt), 'customer decisions carry stable decision IDs and dates');

// Player projection exposes neither competitor identities nor their individual prices.
const playerView = getV3MarketPlayerView(state);
assert.ok(playerView.inquiries.length > 0);
assert.equal(JSON.stringify(playerView).includes('competitor-a'), false);
assert.equal(JSON.stringify(playerView).includes('10000'), false);
const report = getV3MonthlyCompetitorReport(state, '2027-01');
assert.deepEqual(report.map(row => row.sizeClass), ['large', 'medium', 'small'], 'monthly report contains all three size classes');
assert.ok(report.every(row => row.sampleCount >= 3 && Number.isSafeInteger(row.meanCompetitorNetPriceCents) && !('firmId' in row) && !('offerId' in row)));
let thin = createV3MarketState(profile('thin-sample', { parameters: { ...parameters, minimumMonthlyCompetitorSample: 3, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 } } }));
thin = schedule(thin, '2027-01-04', [templates('thin')[0]]).state;
thin = must(advanceV3MarketDay(thin, '2027-01-04')).state;
const thinReport = getV3MonthlyCompetitorReport(thin, '2027-01');
assert.equal(thinReport[0].sampleCount, 2); assert.equal(thinReport[0].meanCompetitorNetPriceCents, null); assert.equal(thinReport[0].suppressed, true, 'n=2 is below the required three-submission floor');
let atFloor = createV3MarketState(profile('at-floor', { parameters: { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 } } }));
const floorTemplates = [
  { ...templates('floor')[0], templateId: 'floor-two-bids', customerId: 'floor-customer-a', requiredCapacity: 2 },
  { ...templates('floor')[0], templateId: 'floor-one-bid', customerId: 'floor-customer-b', requiredCapacity: 10 }
];
atFloor = schedule(atFloor, '2027-01-04', floorTemplates).state;
for (const date of ['2027-01-04', '2027-01-05', '2027-01-06', '2027-01-07', '2027-01-08']) {
  atFloor = must(advanceV3MarketDay(atFloor, date)).state;
  atFloor = must(closeV3MarketDay(atFloor, date)).state;
}
const atFloorReport = getV3MonthlyCompetitorReport(atFloor, '2027-01');
assert.equal(atFloorReport.length, 1);
assert.equal(atFloorReport[0].sampleCount, 3, 'floor fixture contains exactly three distinct competitor submissions');
assert.equal(atFloorReport[0].suppressed, false, 'mean is shown at the three-submission floor');
assert.ok(Number.isSafeInteger(atFloorReport[0].meanCompetitorNetPriceCents));
const duplicateSample = structuredClone(atFloor);
duplicateSample.monthlyCompetitorOffers['2027-01'].push(structuredClone(duplicateSample.monthlyCompetitorOffers['2027-01'][0]));
assert.equal(getV3MonthlyCompetitorReport(duplicateSample, '2027-01')[0].sampleCount, 3,
  'a repeated offer ID cannot increase the sample count across the publication threshold');
assert.throws(() => createV3MarketState(profile('below-floor', { parameters: { ...parameters, minimumMonthlyCompetitorSample: 2 } })), /at least 3 independent competitor submissions/,
  'profiles cannot lower the coordinated minimum monthly sample floor');

// Same-day customer decision is processed before end-of-day expiry; unanswered offers expire.
let tie = createV3MarketState(profile('tie-seed', { parameters: { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, offerWindowCalendarDays: { min: 2, max: 2 } } }));
tie = schedule(tie, '2027-01-04', [templates('tie')[0]]).state;
const firstDay = must(advanceV3MarketDay(tie, '2027-01-04')); tie = firstDay.state;
const tieInquiryId = firstDay.result.receivedInquiryIds[0];
const tieOffer = must(submitV3MarketOffer(tie, { eventId: 'tie-player-offer', inquiryId: tieInquiryId, firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: calculation(createV3MarketOfferId(tie, 'tie-player-offer'), '2027-01-04', 9000) })); tie = tieOffer.state;
tie = must(closeV3MarketDay(tie, '2027-01-04')).state;
const day2 = must(advanceV3MarketDay(tie, '2027-01-05')); tie = must(closeV3MarketDay(day2.state, '2027-01-05')).state;
const day3 = must(advanceV3MarketDay(tie, '2027-01-06')); tie = day3.state;
assert.ok(day3.result.decisions.length === 1, 'customer decision occurs on the expiry date before expiry');
assert.ok(day3.result.decisions[0].decisionId);
assert.equal(tie.inquiries[0].status, 'resolved');
tie = must(closeV3MarketDay(tie, '2027-01-06')).state;
let noFit = createV3MarketState(profile('no-fit', { parameters: { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, offerWindowCalendarDays: { min: 2, max: 2 }, minimumInvitationScore: 1 } }));
noFit = schedule(noFit, '2027-01-04', [templates('no-fit')[0]]).state;
noFit = must(advanceV3MarketDay(noFit, '2027-01-04')).state;
noFit = must(closeV3MarketDay(noFit, '2027-01-04')).state;
noFit = must(advanceV3MarketDay(noFit, '2027-01-05')).state;
noFit = must(closeV3MarketDay(noFit, '2027-01-05')).state;
const expiryStart = must(advanceV3MarketDay(noFit, '2027-01-06'));
const expiry = must(closeV3MarketDay(expiryStart.state, '2027-01-06'));
assert.equal(expiry.state.inquiries[0].status, 'expired', 'open unanswered inquiry expires at end of its expiry date');

// Invalid or tampered frozen snapshots and malformed source data fail closed.
const tampered = structuredClone(state);
const frozenOffer = tampered.inquiries.flatMap(item => item.offers).find(offer => offer.firmId === 'player');
frozenOffer.calculationSnapshot.netPriceCents += 1;
assert.throws(() => validateV3MarketState(tampered), /immutable submission event/);
const forgedSnapshot = calculation('forged-offer-id', state.currentDate, 1000);
const invalidSnapshotInput = { eventId: 'bad-snapshot-event', inquiryId: 'missing', firmId: 'player', submittedAt: state.currentDate, calculationSnapshot: forgedSnapshot };
assert.equal(submitV3MarketOffer(state, invalidSnapshotInput).ok, false, 'offer requires an A03 snapshot linked to its stable offer ID');
assert.throws(() => createV3MarketState(profile('bad-weights', { parameters: { ...parameters, weekdayWeights: { ...parameters.weekdayWeights, mon: 2 } } })), /sum to 1/);

function dateShiftForTest(date, days) { return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10); }

// Fixed-seed response delay range and frozen positive/negative DB-I offers.
const timingParams = { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, customerDecisionDelayCalendarDays: { min: 1, max: 3 } };
function timingState(seed) {
  let sample = createV3MarketState(profile(seed, { parameters: timingParams }));
  sample = schedule(sample, '2027-01-04', [templates('timing')[0]]).state;
  return must(advanceV3MarketDay(sample, '2027-01-04')).state;
}
const timingA = timingState('delay-range-seed');
const timingB = timingState('delay-range-seed');
assert.deepEqual(timingA, timingB, 'response-delay fixture replays identically for the same seed');
for (const offer of timingA.inquiries[0].offers) {
  const delay = Date.parse(offer.decisionAt + 'T12:00:00Z') - Date.parse(offer.submittedAt + 'T12:00:00Z');
  assert.ok(delay >= 86400000 && delay <= 3 * 86400000, 'each competitor response is delayed 1–3 calendar days');
}
for (const inquiry of timingA.inquiries) {
  const openDays = (Date.parse(inquiry.expiresAt + 'T12:00:00Z') - Date.parse(inquiry.receivedAt + 'T12:00:00Z')) / 86400000;
  assert.ok(openDays >= 3 && openDays <= 5, 'each inquiry remains open 3–5 calendar days');
}

function acceptedOfferWithDbI(dbICents) {
  const responseParams = { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 } };
  const highCompetitorPrices = firms.map(firm => firm.role === 'competitor'
    ? { ...firm, offerPriceCentsBySizeClass: { small: 25000, medium: 50000, large: 75000 } } : firm);
  let sample = createV3MarketState(profile('dbi-' + dbICents, { parameters: responseParams, firms: highCompetitorPrices }));
  sample = schedule(sample, '2027-01-04', [templates('dbi')[0]]).state;
  sample = must(advanceV3MarketDay(sample, '2027-01-04')).state;
  const inquiryId = sample.inquiries[0].inquiryId;
  const eventId = 'dbi-player-offer-' + dbICents;
  const netPriceCents = 10000;
  const calculation = calculateV3OfferEstimate({ netPriceCents, directCosts: [{ id: 'variable-input', amountCents: netPriceCents - dbICents, variable: true }] });
  const snapshot = createV3OfferSnapshot({ offerId: createV3MarketOfferId(sample, eventId), submittedAt: '2027-01-04', netPriceCents, costVersion: 'SYNTHETIC-COST-FIXTURE-1', babVersion: 'SYNTHETIC-BAB-FIXTURE-1', calculation });
  sample = must(submitV3MarketOffer(sample, { eventId, inquiryId, firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: snapshot })).state;
  sample = must(closeV3MarketDay(sample, '2027-01-04')).state;
  for (const date of ['2027-01-05', '2027-01-06']) {
    const opened = must(advanceV3MarketDay(sample, date)); sample = must(closeV3MarketDay(opened.state, date)).state;
  }
  const ownOffer = sample.inquiries[0].offers.find(offer => offer.firmId === 'player');
  assert.equal(sample.inquiries[0].winnerFirmId, 'player', 'fixed synthetic case awards the player offer for snapshot review');
  assert.equal(ownOffer.calculationSnapshot.calculation.dbICents, dbICents, 'signed DB-I remains in the submitted snapshot');
  assert.equal(ownOffer.calculationSnapshot.calculation.dbICentNear, Math.abs(dbICents) <= 1, 'cent-near flag is preserved in the accepted snapshot');
  assert.equal(ownOffer.netPriceCents, netPriceCents, 'the accepted market price equals the frozen snapshot price');
  const accepted = acceptV3OfferSnapshot(ownOffer.calculationSnapshot, sample.inquiries[0].decidedAt);
  assert.equal(accepted.contractPriceCents, netPriceCents, 'acceptance preserves price for positive and negative DB-I cases');
  assert.deepEqual(accepted.snapshot, snapshot, 'acceptance preserves the full offer snapshot unchanged');
  const attemptedPostAwardPriceChange = structuredClone(sample);
  const awardedOffer = attemptedPostAwardPriceChange.inquiries[0].offers.find(offer => offer.offerId === ownOffer.offerId);
  awardedOffer.netPriceCents += 1;
  assert.throws(() => validateV3MarketState(attemptedPostAwardPriceChange), /immutable submission event/, 'post-award price change attempt fails closed');
  return { dbICents: ownOffer.calculationSnapshot.calculation.dbICents, offerId: ownOffer.offerId, acceptedAt: accepted.acceptedAt };
}
assert.deepEqual(acceptedOfferWithDbI(4000).dbICents, 4000, 'positive DB-I case is tied to an accepted frozen offer');
assert.deepEqual(acceptedOfferWithDbI(-2000).dbICents, -2000, 'negative DB-I case is tied to an accepted frozen offer');
for (const dbICents of [1, 0, -1]) {
  const result = acceptedOfferWithDbI(dbICents);
  assert.equal(result.dbICents, dbICents, 'cent-near DB-I remains signed in the accepted offer');
}
// Invitation ranking can explicitly combine reputation, price and capacity (synthetic fixture only).
const priceSensitiveParameters = { ...parameters, invitationWeights: { capacity: 0.2, reputation: 0.2, segmentFit: 0.2, price: 0.4 }, minimumInvitationScore: 0.77, maximumInvitations: 4, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 } };
function priceSensitiveInvitations(competitorBPrice) {
  const priceFirms = firms.map(firm => firm.firmId === 'competitor-b'
    ? { ...firm, offerPriceCentsBySizeClass: { ...firm.offerPriceCentsBySizeClass, small: competitorBPrice } }
    : firm.firmId === 'competitor-a' ? { ...firm, offerPriceCentsBySizeClass: { ...firm.offerPriceCentsBySizeClass, small: 30000 } } : firm);
  let sample = createV3MarketState(profile('invitation-price-fixture', { parameters: priceSensitiveParameters, firms: priceFirms }));
  sample = schedule(sample, '2027-01-04', [templates('invitation-price')[0]]).state;
  return sample.inquiries[0].invitedFirmIds;
}
assert.deepEqual(priceSensitiveInvitations(11000), ['player', 'competitor-b'], 'near-reference competitor price lifts invitation eligibility despite lower reputation/capacity');
assert.deepEqual(priceSensitiveInvitations(50000), ['player'], 'same competitor loses invitation when only its synthetic price worsens');

// Isolated synthetic award pairs: only the named profile dimension changes.
function isolatedAwardWinner({ playerPatch = {}, competitorAPatch = {}, sizeClass = 'small', priceCents = 11000, seed }) {
  const configuredFirms = firms.map(firm => {
    const patch = firm.firmId === 'player' ? playerPatch : firm.firmId === 'competitor-a' ? competitorAPatch : {};
    return { ...firm, ...patch, segmentFit: { ...firm.segmentFit, ...(patch.segmentFit ?? {}) } };
  });
  const configuredParameters = { ...parameters, weekdayWeights: { mon: 1, tue: 0, wed: 0, thu: 0, fri: 0 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 } };
  let sample = createV3MarketState(profile(seed, { firms: configuredFirms, parameters: configuredParameters }));
  sample = schedule(sample, '2027-01-04', [templates(seed, 1).map(row => ({ ...row, segmentId: sizeClass, sizeClass, requiredCapacity: sizeClass === 'medium' ? 4 : row.requiredCapacity }))[0]]).state;
  sample = must(advanceV3MarketDay(sample, '2027-01-04')).state;
  const inquiryId = sample.inquiries[0].inquiryId;
  const eventId = `isolated-${seed}`;
  if (sample.inquiries[0].invitedFirmIds.includes('player')) sample = must(submitV3MarketOffer(sample, { eventId, inquiryId, firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: calculation(createV3MarketOfferId(sample, eventId), '2027-01-04', priceCents) })).state;
  sample = must(closeV3MarketDay(sample, '2027-01-04')).state;
  for (const date of ['2027-01-05', '2027-01-06']) sample = must(closeV3MarketDay(must(advanceV3MarketDay(sample, date)).state, date)).state;
  return { winnerFirmId: sample.inquiries[0].winnerFirmId, playerInvited: sample.inquiries[0].invitedFirmIds.includes('player') };
}
assert.equal(isolatedAwardWinner({ priceCents: 8000, seed: 'iso-price-pair' }).winnerFirmId, 'player');
assert.equal(isolatedAwardWinner({ priceCents: 11000, seed: 'iso-price-pair' }).winnerFirmId, 'competitor-a');
assert.equal(isolatedAwardWinner({ priceCents: 11000, playerPatch: { reputation: 1 }, seed: 'iso-reputation-pair' }).winnerFirmId, 'player');
assert.equal(isolatedAwardWinner({ priceCents: 11000, playerPatch: { reputation: 0.65 }, seed: 'iso-reputation-pair' }).winnerFirmId, 'competitor-a');
assert.equal(isolatedAwardWinner({ priceCents: 11000, playerPatch: { segmentFit: { small: 1 } }, seed: 'iso-fit-pair' }).winnerFirmId, 'player');
assert.equal(isolatedAwardWinner({ priceCents: 11000, playerPatch: { segmentFit: { small: 0.75 } }, seed: 'iso-fit-pair' }).winnerFirmId, 'competitor-a');
assert.equal(isolatedAwardWinner({ priceCents: 11000, sizeClass: 'medium', playerPatch: { capacityUnits: 12 }, seed: 'iso-capacity-pair' }).playerInvited, true);
assert.equal(isolatedAwardWinner({ priceCents: 11000, sizeClass: 'medium', playerPatch: { capacityUnits: 3 }, seed: 'iso-capacity-pair' }).playerInvited, false);

// Three 20-workday same-seed traces assert daily arrival, decisions/expiry, and immutable accepted prices.
function twentyWorkdayTrace(seed) {
  const traceParams = { ...parameters, customerDecisionDelayCalendarDays: { min: 1, max: 3 }, offerWindowCalendarDays: { min: 3, max: 5 } };
  const traceFirms = firms.map(firm => firm.role === 'competitor' ? { ...firm, offerPriceCentsBySizeClass: {} } : firm);
  let sample = createV3MarketState(profile(seed, { parameters: traceParams, firms: traceFirms }));
  const daily = [];
  let workdayIndex = 0;
  let receivedCount = 0;
  for (let calendarOffset = 0; calendarOffset < 31; calendarOffset += 1) {
    const date = dateShiftForTest('2027-01-04', calendarOffset);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const isWorkday = weekday >= 1 && weekday <= 5;
    if (isWorkday && weekday === 1 && workdayIndex < 20) sample = schedule(sample, date, templates(`${seed}-${date}`, 5)).state;
    const opened = must(advanceV3MarketDay(sample, date)); sample = opened.state;
    for (const inquiryId of opened.result.receivedInquiryIds) {
      receivedCount += 1;
      if (receivedCount % 3 === 0) continue; // synthetic unanswered inquiry to exercise expiry
      const inquiry = sample.inquiries.find(row => row.inquiryId === inquiryId);
      const eventId = `trace-${seed}-${workdayIndex}-${inquiryId}`;
      sample = must(submitV3MarketOffer(sample, { eventId, inquiryId, firmId: 'player', submittedAt: date, calculationSnapshot: calculation(createV3MarketOfferId(sample, eventId), date, inquiry.referencePriceCents) })).state;
    }
    const decided = opened.result.decisions.map(row => row.inquiryId);
    sample = must(closeV3MarketDay(sample, date)).state;
    const newlyExpired = sample.inquiries.filter(row => row.status === 'expired' && row.expiresAt === date).map(row => row.inquiryId);
    daily.push({ date, isWorkday, received: opened.result.receivedInquiryIds, decided, expired: newlyExpired });
    if (isWorkday && workdayIndex < 20) workdayIndex += 1;
  }
  const accepted = sample.inquiries.flatMap(inquiry => inquiry.offers.filter(offer => offer.status === 'accepted').map(offer => ({ inquiryId: inquiry.inquiryId, offerId: offer.offerId, price: offer.netPriceCents, contractPrice: inquiry.offers.find(item => item.offerId === inquiry.winningOfferId)?.calculationSnapshot.netPriceCents })));
  assert.equal(daily.filter(row => row.isWorkday && row.date <= '2027-01-29').length, 20, 'trace has exactly 20 workday assertions');
  assert.equal(daily.filter(row => row.received.length > 0).length, 20, 'fixture distributes inquiries across all 20 workdays');
  assert.ok(daily.some(row => row.decided.length > 0), 'trace records customer decision events');
  assert.ok(daily.some(row => row.expired.length > 0), 'trace records inquiry expiry events');
  for (const row of daily) for (const id of row.decided) assert.equal(sample.inquiries.find(item => item.inquiryId === id).status, 'resolved');
  for (const row of daily) for (const id of row.expired) assert.equal(sample.inquiries.find(item => item.inquiryId === id).status, 'expired');
  for (const row of accepted) assert.equal(row.price, row.contractPrice, 'accepted offer price remains immutable through the resulting contract snapshot');
  return { daily, accepted, inquiries: sample.inquiries.map(row => ({ inquiryId: row.inquiryId, status: row.status, receivedAt: row.receivedAt, expiresAt: row.expiresAt, decidedAt: row.decidedAt, winnerFirmId: row.winnerFirmId })), events: sample.events.map(row => ({ eventId: row.eventId, type: row.type, occurredAt: row.occurredAt })) };
}
for (const seed of ['T0065-trace-alpha', 'T0065-trace-beta', 'T0065-trace-gamma']) {
  const first = stable(twentyWorkdayTrace(seed));
  const repeated = stable(twentyWorkdayTrace(seed));
  assert.equal(first, repeated, `${seed} replays identically for 20 workdays and response/expiry tail`);
  console.log(`T0065 ${seed} trace sha256=${createHash('sha256').update(first).digest('hex')}`);
}

console.log('V3 market simulation regressions: PASS');
