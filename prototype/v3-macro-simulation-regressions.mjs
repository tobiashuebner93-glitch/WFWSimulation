import assert from 'node:assert/strict';
import {
  createV3MacroState, runV3MacroMonth, validateV3MacroState,
  V3_CYCLE_PHASES, V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS
} from './v3-macro-simulation.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from './v3-price-index.js';

// Every numeric value below is a synthetic regression fixture, not a product default or empirical estimate.
const source = label => ({ sourceType: 'synthetic_fixture', sourceRef: `fixture:${label}`, unit: 'index', value: 100, effectiveFrom: '2027-01-01', lagPeriods: 0, uncertaintyBand: { low: -1, base: 0, high: 1 }, firmExposure: `fixture:${label}`, expectedOutcome: 'directional_only' });
const profile = (overrides = {}) => ({
  runId: 'run-fixture-1', scenarioId: 'scenario-fixture', seed: 'seed-17', profileVersion: 'fixture-v1', sourceSnapshotId: 'fixture-snapshot',
  cycleParameters: { lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1, persistencePeriods: 1, parameterSetId: 'cycle-fixture-v1', sourceRef: 'synthetic-fixture:cycle' },
  ...overrides
});
const input = (period, options = {}) => {
  const { monthIndex = 0, activityIndex = 100, priorActivityIndex = 99, gap, momentum, ...extra } = options;
  const componentIndexes = Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, 100 + monthIndex]));
  const activity = { activityIndex, trendIndex: gap == null ? 100 : activityIndex / (1 + gap / 100), priorActivityIndex, sourceType: 'synthetic_fixture', sourceRef: `fixture:activity:${period}`, observedQuarterly: null };
  if (momentum != null) activity.priorActivityIndex = activityIndex / (1 + momentum / 100);
  return {
    period, parameterSetId: 'inputs-fixture-v1', componentIndexes, priorMonthlySpiIndexes: [], componentSourceType: 'synthetic_fixture', componentSourceRef: `fixture:spi:${period}`,
    activity, externalChannels: Object.fromEntries(V3_EXTERNAL_CHANNELS.map(name => [name, source(name)])),
    policyChannels: Object.fromEntries(V3_POLICY_CHANNELS.map(name => [name, ({ ...source(name), measure: `fixture ${name} measure`, goal: 'test goal', intermediateIndicator: 'fixture indicator', firmExposure: `fixture exposure ${name}`, expectedOutcome: 'directional test only', counterEffect: 'fixture counter-effect', effectGroupId: `group-${name}`, accountingClass: 'information_plan' })])),
    ...extra
  };
};
const run = (state, monthly) => {
  const result = runV3MacroMonth(state, monthly);
  assert.equal(result.ok, true, result.error?.message);
  return result;
};

assert.deepEqual(V3_CYCLE_PHASES, ['upswing', 'boom', 'downturn', 'trough']);
const initial = createV3MacroState(profile());
const before = structuredClone(initial);
const firstInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.5 });
const first = run(initial, firstInput);
assert.equal(first.snapshot.spi.index, 100);
assert.equal(first.snapshot.spi.monthOverMonthInflation, null);
assert.equal(first.snapshot.spi.yearOverYearInflation, null);
assert.equal(first.snapshot.phaseState.phase, 'upswing');
assert.equal(Object.keys(first.snapshot.externalChannels).length, 4);
assert.ok(Object.hasOwn(first.snapshot.externalChannels, 'business_input_cost_plan'));
assert.equal(Object.keys(first.snapshot.policyChannels).length, 8);
assert.equal(first.snapshot.mro.sourceType, 'unavailable');
assert.deepEqual(initial, before, 'source state must remain unchanged');
assert.deepEqual(firstInput.componentIndexes, Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, 100])), 'input must remain unchanged');
assert.ok(first.snapshot.financeEffects && Object.values(first.snapshot.financeEffects).every(value => value === false));
assert.equal(first.snapshot.financingHandoff, null);

// System-owned event envelope fields cannot be spoofed by source records.
const spoofedInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.5 });
Object.assign(spoofedInput.externalChannels.fx_imported_inputs, { macroEventId: 'spoofed', period: '1999-01', channel: 'forged', scenarioId: 'other-scenario', modelVersion: 'fake-version', runId: 'other-run', seed: 'other-seed', effectivePeriod: '1999-01', activatedEventIds: ['spoofed'], activatedMacroEventIds: ['spoofed'] });
const protectedEventResult = run(createV3MacroState(profile()), spoofedInput);
const protectedEvent = protectedEventResult.snapshot.scheduledEvents.find(e => e.eventKey === 'fx_imported_inputs');
assert.match(protectedEvent.macroEventId, /^ME\\|/);
assert.equal(protectedEvent.period, '2027-01');
assert.equal(protectedEvent.channel, 'external');
assert.equal(protectedEvent.scenarioId, 'scenario-fixture');
assert.equal(protectedEvent.modelVersion, 'V3-MACRO-SIM-1');
assert.equal(protectedEvent.runId, 'run-fixture-1');
assert.equal(protectedEvent.seed, 'seed-17');
assert.equal(protectedEvent.effectivePeriod, '2027-01');
assert.ok(protectedEventResult.snapshot.activatedMacroEventIds.includes(protectedEvent.macroEventId));
assert.ok(protectedEventResult.snapshot.effectiveMacroEvents.some(e => e.macroEventId === protectedEvent.macroEventId));
assert.ok(!protectedEventResult.state.activatedEventIds.includes('spoofed'));
assert.ok(!protectedEventResult.snapshot.activatedMacroEventIds.includes('spoofed'));
assert.equal(protectedEvent.effectiveFrom, '2027-01-01', 'effectiveFrom is a complete ISO calendar date');
const invalidEffectiveFrom = input('2027-01');
invalidEffectiveFrom.externalChannels.fx_imported_inputs.effectiveFrom = '2027-02-31';
assert.equal(runV3MacroMonth(createV3MacroState(profile()), invalidEffectiveFrom).ok, false, 'impossible ISO effectiveFrom day is rejected');
const nextMonthEffectiveFrom = input('2027-01');
nextMonthEffectiveFrom.externalChannels.fx_imported_inputs.effectiveFrom = '2027-02-01';
const nextMonthScheduled = run(createV3MacroState(profile()), nextMonthEffectiveFrom);
assert.equal(nextMonthScheduled.snapshot.scheduledEvents.find(event => event.eventKey === 'fx_imported_inputs').effectivePeriod, '2027-02', 'valid full date respects the month boundary');
// Lagged external effects remain scheduled until their explicit effective period.
let lagInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.5 });
lagInput.externalChannels.fx_imported_inputs.lagPeriods = 2;
let lagState = run(createV3MacroState(profile()), lagInput).state;
assert.equal(lagState.periods[0].scheduledEvents.find(e => e.channel === 'external' && e.sourceRef === 'fixture:fx_imported_inputs').effectivePeriod, '2027-03');
let lagFeb = run(lagState, input('2027-02', { activityIndex: 100, gap: 0, momentum: 0.5 })); lagState = lagFeb.state;
assert.equal(lagFeb.snapshot.effectiveMacroEvents.some(e => e.sourceRef === 'fixture:fx_imported_inputs' && e.period === '2027-01'), false);
const lagMar = run(lagState, input('2027-03', { activityIndex: 100, gap: 0, momentum: 0.5 }));
assert.equal(lagMar.snapshot.effectiveMacroEvents.some(e => e.sourceRef === 'fixture:fx_imported_inputs' && e.period === '2027-01'), true);

// Policy aliases for the same target/effect group are recorded, but only one is eligible to contribute.
const dedupeInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.5 });
dedupeInput.policyChannels.supply_oriented.effectGroupId = 'shared-policy-fixture';
dedupeInput.policyChannels.growth.effectGroupId = 'shared-policy-fixture';
dedupeInput.policyChannels.supply_oriented.intermediateIndicator = 'same-indicator';
dedupeInput.policyChannels.growth.intermediateIndicator = 'same-indicator';
const dedupe = run(createV3MacroState(profile()), dedupeInput);
const grouped = dedupe.snapshot.scheduledEvents.filter(e => e.channel === 'policy' && e.effectGroupId === 'shared-policy-fixture');
assert.equal(grouped.filter(e => e.effectEligible).length, 1);
assert.equal(grouped.filter(e => e.suppressedAsDuplicate).length, 1);
const replay = runV3MacroMonth(first.state, firstInput);
assert.equal(replay.ok, true); assert.equal(replay.duplicate, true);
assert.deepEqual(replay.snapshot, first.snapshot);
assert.equal(runV3MacroMonth(first.state, input('2027-01', { activityIndex: 101, gap: 0, momentum: 0.5 })).error.code, 'period_payload_conflict');
assert.equal(runV3MacroMonth(first.state, input('2027-03')).error.code, 'non_sequential_period');
assert.equal(validateV3MacroState(first.state), true);

// Restored state validation rejects missing identity and event history before processing.
const noEvents = structuredClone(first.state); noEvents.events = [];
assert.throws(() => validateV3MacroState(noEvents), /event|activation/);
assert.equal(runV3MacroMonth(noEvents, input('2027-02')).error.code, 'invalid_macro_state');
const noRunId = structuredClone(first.state); delete noRunId.runId;
assert.throws(() => validateV3MacroState(noRunId), /identity runId/);
assert.equal(runV3MacroMonth(noRunId, input('2027-02')).error.code, 'invalid_macro_state');
const invalidActivation = structuredClone(first.state); invalidActivation.activatedEventIds = [];
assert.throws(() => validateV3MacroState(invalidActivation), /activated-event history/);
assert.equal(validateV3MacroState(first.state), true, 'valid restored state remains accepted');
// A due event cannot be removed consistently from every activation history and reactivated later.
const truncatedActivation = structuredClone(first.state);
const januaryEventId = truncatedActivation.periods[0].activatedMacroEventIds[0];
assert.ok(januaryEventId, 'fixture creates at least one January event that is due immediately');
truncatedActivation.periods[0].activatedMacroEventIds = truncatedActivation.periods[0].activatedMacroEventIds.filter(id => id !== januaryEventId);
truncatedActivation.periods[0].effectiveMacroEvents = truncatedActivation.periods[0].effectiveMacroEvents.filter(event => event.macroEventId !== januaryEventId);
truncatedActivation.activatedEventIds = truncatedActivation.activatedEventIds.filter(id => id !== januaryEventId);
assert.throws(() => validateV3MacroState(truncatedActivation), /activation history is incomplete/);
assert.equal(runV3MacroMonth(truncatedActivation, input('2027-02')).error.code, 'invalid_macro_state');
let onceActivated = first.state;
const februaryAfterActivation = run(onceActivated, input('2027-02', { activityIndex: 100, gap: 0, momentum: 0.5 }));
onceActivated = februaryAfterActivation.state;
assert.equal(februaryAfterActivation.snapshot.activatedMacroEventIds.includes(januaryEventId), false, 'previously activated January event is not replayed in February');
assert.equal(validateV3MacroState(onceActivated), true, 'complete multi-month activation history remains valid');
// Four phases and the adjacent cycle transitions are distinguishable under explicit fixture thresholds.
let cycle = createV3MacroState(profile());
const transitions = [
  ['2027-01', { gap: 0, momentum: 0.5 }, 'upswing'],
  ['2027-02', { gap: 3, momentum: 0.5 }, 'boom'],
  ['2027-03', { gap: 0, momentum: -0.5 }, 'downturn'],
  ['2027-04', { gap: -3, momentum: -0.5 }, 'trough'],
  ['2027-05', { gap: 0, momentum: 0.5 }, 'upswing']
];
for (const [period, params, expected] of transitions) cycle = run(cycle, input(period, { activityIndex: 100, ...params })).state;
assert.deepEqual(cycle.periods.map(p => p.phaseState.phase), transitions.map(t => t[2]));

// Hysteresis: one candidate month is insufficient when profile requires two.
let hysteresis = createV3MacroState(profile({ cycleParameters: { ...profile().cycleParameters, persistencePeriods: 2 } }));
hysteresis = run(hysteresis, input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.5 })).state;
const pending = run(hysteresis, input('2027-02', { activityIndex: 100, gap: 3, momentum: 0.5 }));
assert.equal(pending.snapshot.phaseState.phase, 'upswing'); assert.equal(pending.snapshot.phaseState.reason, 'hysteresis_pending');
const confirmed = run(pending.state, input('2027-03', { activityIndex: 100, gap: 3, momentum: 0.5 }));
assert.equal(confirmed.snapshot.phaseState.phase, 'boom');

// A full year plus one month makes y/y available; all periods are deterministic and contiguous.
let yearly = createV3MacroState(profile({ mroFutureRule: { formulaId: 'affine_spi_yoy_fixture', referenceMroPctPA: 1, coefficient: 0.5, referenceInflationPct: 2, lagPeriods: 1, parameterSetId: 'mro-fixture-v1', sourceRef: 'synthetic-fixture:mro-rule', uncertaintyBand: { low: -0.5, base: 0, high: 0.5 } } }));
let priorIndexes = [];
for (let n = 1; n <= 13; n += 1) {
  const date = new Date(Date.UTC(2027, n - 1, 1));
  const period = date.toISOString().slice(0, 7);
  const current = input(period, { monthIndex: n - 1, activityIndex: 100, gap: 0, momentum: 0.2 });
  current.priorMonthlySpiIndexes = [...priorIndexes];
  const result = run(yearly, current);
  yearly = result.state; priorIndexes.push(result.snapshot.spi.index);
}
assert.equal(yearly.periods[11].spi.yearOverYearInflation, null);
assert.ok(Number.isFinite(yearly.periods[12].spi.yearOverYearInflation));
assert.equal(yearly.periods[12].mro.sourceType, 'unavailable', 'one-period lag requires prior y/y history');
const month14 = input('2028-02', { monthIndex: 13, activityIndex: 100, gap: 0, momentum: 0.2 });
month14.priorMonthlySpiIndexes = [...priorIndexes];
month14.newCreditRequest = { creditRequestId: 'credit-request-fixture', indicativeSpreadPp: 2, indicativeTermMonths: 36, validFrom: '2028-02-01', validUntil: '2028-02-29', mroBasePctPA: 1, sourceRef: 'synthetic-fixture:credit-terms', parameterSetId: 'quote-fixture-v1' };
const mroQuote = run(yearly, month14);
assert.equal(mroQuote.snapshot.mro.sourceType, 'synthetic_scenario');
assert.equal(mroQuote.snapshot.financingHandoff.status, 'indicative');
assert.equal(mroQuote.snapshot.financingHandoff.mroDeltaPp, mroQuote.snapshot.mro.valuePctPA - 1);
assert.equal(mroQuote.snapshot.financingHandoff.contractId, null);
assert.equal(mroQuote.snapshot.financingHandoff.createsLedgerEffect, false);
assert.equal(mroQuote.snapshot.financeEffects.cash, false);
assert.equal(mroQuote.snapshot.financeEffects.existingContracts, false);
assert.equal(mroQuote.snapshot.financingHandoff.indicativeRatePctPA, mroQuote.snapshot.mro.valuePctPA + 2);
assert.ok(mroQuote.snapshot.activatedMacroEventIds.length >= 1);
assert.equal(mroQuote.snapshot.financingHandoff.asOfDate, '2028-02-29');
const beforeQuoteWindow = input('2028-02', { monthIndex: 13, activityIndex: 100, gap: 0, momentum: 0.2 });
beforeQuoteWindow.priorMonthlySpiIndexes = [...priorIndexes];
beforeQuoteWindow.newCreditRequest = { ...month14.newCreditRequest, validFrom: '2028-03-01', validUntil: '2028-03-31' };
assert.equal(run(yearly, beforeQuoteWindow).snapshot.financingHandoff, null, 'future quote window is not exposed before validFrom');
const expiredQuoteInput = input('2028-02', { monthIndex: 13, activityIndex: 100, gap: 0, momentum: 0.2 });
expiredQuoteInput.priorMonthlySpiIndexes = [...priorIndexes];
expiredQuoteInput.newCreditRequest = { ...month14.newCreditRequest, validUntil: '2028-02-15' };
assert.equal(run(yearly, expiredQuoteInput).snapshot.financingHandoff.status, 'expired', 'quote is expired when its validity ended before the month-end as-of date');
const malformedQuote = input('2028-02', { monthIndex: 13, activityIndex: 100, gap: 0, momentum: 0.2 });
malformedQuote.priorMonthlySpiIndexes = [...priorIndexes];
malformedQuote.newCreditRequest = { ...month14.newCreditRequest, validFrom: '2028-02-30' };
assert.equal(runV3MacroMonth(yearly, malformedQuote).ok, false, 'invalid quote date is rejected');
const reversedQuote = input('2028-02', { monthIndex: 13, activityIndex: 100, gap: 0, momentum: 0.2 });
reversedQuote.priorMonthlySpiIndexes = [...priorIndexes];
reversedQuote.newCreditRequest = { ...month14.newCreditRequest, validFrom: '2028-03-01', validUntil: '2028-02-29' };
assert.equal(runV3MacroMonth(yearly, reversedQuote).ok, false, 'reversed quote validity window is rejected');

// Formula fixtures cover a synthetic increase and decrease around the explicit reference path.
const macroRule = { formulaId: 'affine_spi_yoy_fixture', referenceMroPctPA: 1, coefficient: 0.5, referenceInflationPct: 2, lagPeriods: 0, parameterSetId: 'mro-fixture-v1', sourceRef: 'synthetic-fixture:mro-rule', uncertaintyBand: { low: -0.5, base: 0, high: 0.5 } };
for (const [level, expected] of [[101, 0.5], [103, 1.5]]) {
  const pathInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.2 });
  pathInput.componentIndexes = Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, level]));
  pathInput.priorMonthlySpiIndexes = Array(12).fill(100);
  const path = run(createV3MacroState(profile({ mroFutureRule: macroRule })), pathInput);
  assert.ok(Math.abs(path.snapshot.mro.valuePctPA - expected) < 1e-10);
  assert.equal(path.snapshot.mro.assumptionStatus, 'synthetic_uncalibrated');
}
// Observed quarterly values remain separate; observed MRO provenance is preserved.
let observed = createV3MacroState(profile());
const observedInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.2, observedMro: { valuePctPA: 2.25, sourceRef: 'official-fixture:mro', effectiveFrom: '2027-01-15', observedPeriod: '2027-01', publishedAt: '2027-01-15', dataVintage: 'fixture-final', unit: '% p.a.' } });
observedInput.activity.observedQuarterly = { period: '2026-Q4', observedPeriod: '2026-Q4', value: 99.5, unit: 'index', sourceType: 'observed', sourceRef: 'official-fixture:gdp', publishedAt: '2027-01-15', dataVintage: 'fixture-preliminary' };
const observedResult = run(observed, observedInput);
assert.equal(observedResult.snapshot.mro.sourceType, 'observed');
assert.equal(observedResult.snapshot.activity.observedQuarterly.sourceType, 'observed');
assert.equal(observedResult.snapshot.activity.sourceType, 'synthetic_fixture');
assert.equal(observedResult.snapshot.activity.observedAt, null, 'observedAt is optional for period-based statistics');

// Observed activity and SPI inputs require publication-period and vintage provenance; synthetic inputs do not.
const observedActivityInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.2 });
Object.assign(observedActivityInput.activity, { sourceType: 'observed', sourceRef: 'official-fixture:activity', observedPeriod: '2027-01', publishedAt: '2027-01-15', dataVintage: 'preliminary', unit: 'index' });
assert.equal(run(createV3MacroState(profile()), observedActivityInput).ok, true);
const observedActivityMissing = structuredClone(observedActivityInput); delete observedActivityMissing.activity.publishedAt;
assert.equal(runV3MacroMonth(createV3MacroState(profile()), observedActivityMissing).ok, false);
const futurePublishedActivity = structuredClone(observedActivityInput); futurePublishedActivity.activity.publishedAt = '2027-02-15';
assert.equal(runV3MacroMonth(createV3MacroState(profile()), futurePublishedActivity).ok, false, 'data published after the January as-of date is rejected');
const observedSpiInput = input('2027-01', { activityIndex: 100, gap: 0, momentum: 0.2 });
Object.assign(observedSpiInput, { componentSourceType: 'observed', componentSourceRef: 'Destatis:61111-0006', componentObservedPeriod: '2027-01', componentPublishedAt: '2027-01-15', componentDataVintage: 'final-2027-01-15', componentUnit: 'index', componentBase: '2020=100', componentBasketVersion: 'V3-SPI-COICOP12-v1' });
assert.equal(run(createV3MacroState(profile()), observedSpiInput).ok, true);
const observedSpiMissing = structuredClone(observedSpiInput); delete observedSpiMissing.componentDataVintage;
assert.equal(runV3MacroMonth(createV3MacroState(profile()), observedSpiMissing).ok, false);
const futurePublishedSpi = structuredClone(observedSpiInput); futurePublishedSpi.componentPublishedAt = '2027-02-15';
assert.equal(runV3MacroMonth(createV3MacroState(profile()), futurePublishedSpi).ok, false, 'SPI data published after the January as-of date is rejected');
// Invalid and incomplete inputs fail as controlled results; no caller state is modified.
const invalid = input('2027-01'); delete invalid.policyChannels.tariff;
assert.equal(runV3MacroMonth(createV3MacroState(profile()), invalid).ok, false);
assert.throws(() => createV3MacroState({ ...profile(), cycleParameters: undefined }), /cycleParameters/);
assert.throws(() => createV3MacroState(profile({ mroFutureRule: { formulaId: 'x' } })), /mroFutureRule/);
console.log('V3 macro simulation regressions: PASS');











