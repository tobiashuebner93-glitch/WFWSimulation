import assert from 'node:assert/strict';
import { createV3MacroState, runV3MacroMonth, validateV3MacroState, V3_CYCLE_PHASES, V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS } from '../v3-macro-simulation.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from '../v3-price-index.js';

// T-0071-only test assumptions; not an ECB estimate, product default, bank quote, or calibrated transmission.
const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-9, label);
const synthetic = {
  sourceRef: 'synthetic-fixture:T-0071:SPI-to-MRO-direction-pair',
  rule: { formulaId: 'T0071-synthetic-affine-SPI-yoy-to-MRO-v1', referenceMroPctPA: 1, coefficient: 0.5, referenceInflationPct: 0, lagPeriods: 1, parameterSetId: 'T0071-test-only-v1', sourceRef: 'synthetic-fixture:T-0071:SPI-to-MRO-direction-pair', uncertaintyBand: { low: -0.25, base: 0, high: 0.25 } },
  quote: { creditRequestId: 'T0071-indicative-request', indicativeSpreadPp: 2, indicativeTermMonths: 36, validFrom: '2028-01-01', validUntil: '2028-02-29', mroBasePctPA: 1, sourceRef: 'synthetic-fixture:T-0071:indicative-quote-terms', parameterSetId: 'T0071-test-only-v1' },
};
const profile = direction => ({
  runId: `T0071-${direction}`, scenarioId: 'T0071-direction-pair', seed: 'T0071-fixed-seed', profileVersion: 'T0071-fixture-v1', sourceSnapshotId: 'T0071-synthetic-snapshot',
  cycleParameters: { lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1, persistencePeriods: 1, parameterSetId: 'T0071-cycle-test-only', sourceRef: synthetic.sourceRef },
  mroFutureRule: structuredClone(synthetic.rule),
});
const makeInput = (period, priorMonthlySpiIndexes, componentIndex, quote = false) => ({
  period, parameterSetId: 'T0071-test-only-v1',
  componentIndexes: Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, componentIndex])),
  priorMonthlySpiIndexes: [...priorMonthlySpiIndexes], componentSourceType: 'synthetic_fixture', componentSourceRef: synthetic.sourceRef,
  activity: { activityIndex: 100, trendIndex: 100, priorActivityIndex: 99.8, sourceType: 'synthetic_fixture', sourceRef: synthetic.sourceRef, observedQuarterly: null },
  externalChannels: Object.fromEntries(V3_EXTERNAL_CHANNELS.map(name => [name, { sourceType: 'synthetic_fixture', sourceRef: synthetic.sourceRef, unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 0, uncertaintyBand: { low: -0.25, base: 0, high: 0.25 }, firmExposure: `test:${name}`, expectedOutcome: 'directional_only' }])),
  policyChannels: Object.fromEntries(V3_POLICY_CHANNELS.map(name => [name, { sourceType: 'synthetic_fixture', sourceRef: synthetic.sourceRef, unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 0, uncertaintyBand: { low: -0.25, base: 0, high: 0.25 }, firmExposure: `test:${name}`, expectedOutcome: 'directional_only', measure: 'fixture', goal: 'T-0071', intermediateIndicator: 'none', counterEffect: 'not modeled', effectGroupId: `T0071-${name}`, accountingClass: 'information_plan' }])),
  ...(quote ? { newCreditRequest: structuredClone(synthetic.quote) } : {}),
});
const runDirection = sign => {
  let state = createV3MacroState(profile(sign > 0 ? 'hike' : 'cut'));
  const priorIndexes = [];
  const rows = [];
  for (let month = 0; month < 14; month += 1) {
    const date = new Date(Date.UTC(2027, month, 1));
    const period = date.toISOString().slice(0, 7);
    // Stable neutral base through Dec 2027; one-month SPI level shock in Jan 2028.
    const componentIndex = period === '2028-01' ? 100 + sign : 100;
    const monthInput = makeInput(period, priorIndexes, componentIndex, period === '2028-01' || period === '2028-02');
    const inputBefore = JSON.stringify(monthInput);
    const result = runV3MacroMonth(state, monthInput);
    assert.equal(result.ok, true, result.error?.message);
    assert.equal(JSON.stringify(monthInput), inputBefore, 'monthly fixture input must remain unchanged');
    state = result.state;
    priorIndexes.push(result.snapshot.spi.index);
    rows.push(result.snapshot);
    assert.ok(Object.values(result.snapshot.financeEffects).every(value => value === false), 'every macro month must report zero finance effects');
  }
  assert.ok(validateV3MacroState(state));
  const jan = rows[12], feb = rows[13];
  assert.equal(jan.period, '2028-01'); assert.equal(feb.period, '2028-02');
  assert.equal(feb.mro.lagPeriods, 1);
  assert.equal(jan.mro.sourceType, 'unavailable', 'Jan MRO waits for the prior SPI year-over-year history required by lag=1');
  assert.equal(jan.financingHandoff, null, 'no indicative rate is fabricated while lag history is unavailable');
  assert.equal(feb.mro.assumptionStatus, 'synthetic_uncalibrated');
  assert.equal(feb.mro.referencePeriod, '2028-01');
  near(jan.spi.yearOverYearInflation, sign, 'separate SPI year-over-year macro indicator moves in the shock month');
  near(feb.mro.valuePctPA, 1 + 0.5 * sign, 'lagged synthetic MRO');
  assert.equal(feb.financingHandoff.status, 'indicative');
  near(feb.financingHandoff.indicativeRatePctPA, 3 + 0.5 * sign, 'indicative quote rate');
  assert.equal(feb.financingHandoff.contractId, null);
  assert.equal(feb.financingHandoff.contractVersion, null);
  assert.equal(feb.financingHandoff.createsFinancialEvent, false);
  assert.equal(feb.financingHandoff.createsLedgerEffect, false);
  assert.equal(feb.financeEffects.cash, false);
  assert.equal(feb.financeEffects.existingContracts, false);
  return { rows, state };
};
const hike = runDirection(1), cut = runDirection(-1);
assert.ok(hike.rows[12].spi.index > hike.rows[11].spi.index, 'hike case has a higher synthetic SPI indicator');
assert.ok(cut.rows[12].spi.index < cut.rows[11].spi.index, 'cut case has a lower synthetic SPI indicator');
assert.ok(hike.rows[13].mro.valuePctPA > cut.rows[13].mro.valuePctPA, 'upward SPI path yields a higher lagged MRO than the downward path');
assert.ok(cut.rows[13].mro.valuePctPA < hike.rows[13].mro.valuePctPA, 'downward SPI path yields a lower lagged MRO than the upward path');
assert.ok(hike.rows[13].financingHandoff.indicativeRatePctPA > cut.rows[13].financingHandoff.indicativeRatePctPA);
assert.ok(cut.rows[13].financingHandoff.indicativeRatePctPA < hike.rows[13].financingHandoff.indicativeRatePctPA);
// Neutral path: identical base period inputs keep MRO and the indicative quote at their reference values.
let neutralState = createV3MacroState(profile('neutral')), neutralPrior = [], neutralRows = [];
for (let month = 0; month < 14; month += 1) {
  const period = new Date(Date.UTC(2027, month, 1)).toISOString().slice(0, 7);
  const monthly = makeInput(period, neutralPrior, 100, period === '2028-01' || period === '2028-02');
  const result = runV3MacroMonth(neutralState, monthly); assert.equal(result.ok, true, result.error?.message);
  neutralState = result.state; neutralPrior.push(result.snapshot.spi.index); neutralRows.push(result.snapshot);
}
assert.ok(Math.abs(neutralRows[13].spi.yearOverYearInflation) < 1e-9);
assert.ok(Math.abs(neutralRows[13].mro.valuePctPA - 1) < 1e-9);
assert.ok(Math.abs(neutralRows[13].financingHandoff.indicativeRatePctPA - 3) < 1e-9);
// Exact JSON save/restore at Jan 2028: continue both branches and compare with the uninterrupted evidence.
for (const sign of [1, -1]) {
  let state = createV3MacroState(profile(sign > 0 ? 'hike' : 'cut')), priorIndexes = [], janState;
  for (let month = 0; month <= 12; month += 1) {
    const period = new Date(Date.UTC(2027, month, 1)).toISOString().slice(0, 7);
    const idx = period === '2028-01' ? 100 + sign : 100;
    const result = runV3MacroMonth(state, makeInput(period, priorIndexes, idx, period === '2028-01'));
    assert.equal(result.ok, true, result.error?.message); state = result.state; priorIndexes.push(result.snapshot.spi.index);
  }
  const restored = JSON.parse(JSON.stringify(state)); assert.ok(validateV3MacroState(restored));
  const feb = runV3MacroMonth(restored, makeInput('2028-02', priorIndexes, 100, true)); assert.equal(feb.ok, true, feb.error?.message);
  const uninterrupted = sign > 0 ? hike.rows[13] : cut.rows[13];
  assert.deepEqual(feb.snapshot, uninterrupted, 'restored February snapshot exactly matches uninterrupted replay');
}
console.log('A03 T-0071 ECB/MRO directional, lag, neutral, quote and save/restore regressions PASS');







