import assert from 'node:assert/strict';
import {
  createV3MacroState, runV3MacroMonth, validateV3MacroState,
  V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS, V3_T0071_MRO_SHOCK_FIXTURE_ID,
} from './v3-macro-simulation.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from './v3-price-index.js';
import { projectV3MroOperatingImpact } from './v3-mro-operating-impact.js';

const SOURCE = 'synthetic-fixture:T-0071:exogenous-mro-direction-pair';
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, message);
const makeState = label => createV3MacroState({
  runId: `T0071-exogenous-${label}`, scenarioId: `T0071-${label}`, seed: 't0071-fixed-seed',
  profileVersion: 'T0071-exogenous-fixture-v1', sourceSnapshotId: `synthetic-snapshot:T0071:${label}`,
  cycleParameters: { lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1, persistencePeriods: 1, parameterSetId: 'T0071-cycle-fixture', sourceRef: SOURCE },
  mroFutureRule: { formulaId: 'T0071-flat-reference-MRO-v1', referenceMroPctPA: 1, coefficient: 0, referenceInflationPct: 0, lagPeriods: 1, parameterSetId: 'T0071-test-only-v1', sourceRef: 'synthetic-fixture:T-0071:neutral-reference', uncertaintyBand: { low: -0.25, base: 0, high: 0.25 } },
});
const quote = {
  creditRequestId: 'T0071-new-financing-request', indicativeSpreadPp: 2, indicativeTermMonths: 36,
  validFrom: '2028-01-01', validUntil: '2028-03-31', mroBasePctPA: 1,
  sourceRef: 'synthetic-fixture:T-0071:indicative-spread-only', parameterSetId: 'T0071-test-only-v1',
};
const makeInput = (period, priorIndexes, componentIndex, direction = null, addQuote = false) => ({
  period, parameterSetId: 'T0071-test-only-v1',
  componentIndexes: Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, componentIndex])),
  priorMonthlySpiIndexes: [...priorIndexes], componentSourceType: 'synthetic_fixture', componentSourceRef: SOURCE,
  activity: { activityIndex: 100, trendIndex: 100, priorActivityIndex: 99.8, sourceType: 'synthetic_fixture', sourceRef: SOURCE },
  externalChannels: Object.fromEntries(V3_EXTERNAL_CHANNELS.map(name => [name, { sourceType: 'synthetic_fixture', sourceRef: `${SOURCE}:${name}`, unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 0, uncertaintyBand: { low: -0.25, base: 0, high: 0.25 }, firmExposure: `synthetic:${name}`, expectedOutcome: 'neutral_test_input' }])),
  policyChannels: Object.fromEntries(V3_POLICY_CHANNELS.map(name => [name, { sourceType: 'synthetic_fixture', sourceRef: `${SOURCE}:${name}`, unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 0, uncertaintyBand: { low: -0.25, base: 0, high: 0.25 }, firmExposure: `synthetic:${name}`, expectedOutcome: 'neutral_test_input', measure: 'fixture', goal: 'T-0071 only', intermediateIndicator: 'not-used-by-this-pair', counterEffect: 'not modeled', effectGroupId: `${SOURCE}:${name}`, accountingClass: 'information_plan' }])),
  ...(direction ? { mroScenarioShock: {
    fixtureId: V3_T0071_MRO_SHOCK_FIXTURE_ID, sourceType: 'synthetic_fixture', sourceRef: SOURCE,
    shockId: 'direction-pair', direction, observedPeriod: period, effectiveFrom: `${period}-01`, lagPeriods: 1,
    baseMroPctPA: 1, deltaPp: direction === 'hike' ? 0.5 : -0.5,
    uncertaintyBand: { low: -0.25, base: 0, high: 0.25 },
    parameterSetId: 'T0071-exogenous-mro-test-v1', effectGroupId: `T0071:${direction}:mro-pair`,
  } } : {}),
  ...(addQuote ? { newCreditRequest: structuredClone(quote) } : {}),
});

function execute(direction) {
  let state = makeState(direction), priorIndexes = [];
  const rows = [], janStateRef = { value: null }, janPrior = { value: null };
  for (let month = 0; month < 16; month += 1) {
    const period = new Date(Date.UTC(2027, month, 1)).toISOString().slice(0, 7);
    const directionShock = period === '2028-01' && direction !== 'neutral' ? direction : null;
    const input = makeInput(period, priorIndexes, 100, directionShock, period === '2028-02');
    const beforeInput = structuredClone(input);
    const result = runV3MacroMonth(state, input);
    assert.equal(result.ok, true, result.error?.message);
    assert.deepEqual(input, beforeInput, 'the monthly transition does not mutate its source input');
    state = result.state; priorIndexes.push(result.snapshot.spi.index); rows.push(result.snapshot);
    assert.ok(Object.values(result.snapshot.financeEffects).every(value => value === false), 'macro snapshots declare every finance effect false');
    if (period === '2028-01') { janStateRef.value = structuredClone(state); janPrior.value = [...priorIndexes]; }
  }
  assert.ok(validateV3MacroState(state));
  return { rows, state, janState: janStateRef.value, janPrior: janPrior.value };
}

const hike = execute('hike'), cut = execute('cut'), neutral = execute('neutral');
const janHike = hike.rows[12], febHike = hike.rows[13], marHike = hike.rows[14];
const janCut = cut.rows[12], febCut = cut.rows[13], marCut = cut.rows[14];
const febNeutral = neutral.rows[13], marNeutral = neutral.rows[14];
const hikeEvent = janHike.scheduledEvents.find(event => event.eventKey === 't0071_exogenous_mro_shock');
const cutEvent = janCut.scheduledEvents.find(event => event.eventKey === 't0071_exogenous_mro_shock');
assert.ok(hikeEvent && cutEvent, 'exogenous hike and cut are persisted as separate MRO source events');
near(janHike.spi.yearOverYearInflation, 0, 'SPI stays neutral in the MRO hike pair; only the exogenous policy-rate event differs');
near(janCut.spi.yearOverYearInflation, 0, 'SPI stays neutral in the MRO cut pair; only the exogenous policy-rate event differs');
assert.equal(hikeEvent.sourceType, 'synthetic_fixture');
assert.equal(hikeEvent.observedPeriod, '2028-01');
assert.equal(hikeEvent.effectivePeriod, '2028-02');
assert.equal(hikeEvent.lagPeriods, 1);
assert.equal(janHike.mro.valuePctPA, null, 'the January exogenous event does not act before its lag; missing base history stays unavailable');
assert.equal(janHike.financingHandoff, null, 'no financing quote is fabricated before the one-month shock lag');
near(febHike.mro.valuePctPA, 1.5, 'exogenous hike moves the MRO reference after one month');
near(febCut.mro.valuePctPA, 0.5, 'exogenous cut moves the MRO reference after one month');
near(febHike.financingHandoff.indicativeRatePctPA, 3.5, 'hike changes only the indicative new-financing rate');
near(febCut.financingHandoff.indicativeRatePctPA, 2.5, 'cut changes only the indicative new-financing rate');
assert.equal(febHike.financingHandoff.contractId, null);
assert.equal(febHike.financingHandoff.createsFinancialEvent, false);
assert.equal(febHike.financingHandoff.createsLedgerEffect, false);
assert.equal(febHike.financeEffects.existingContracts, false, 'fixed/existing contracts remain outside the pathway');

const hikeImpact = projectV3MroOperatingImpact(hike.state, '2028-03');
const cutImpact = projectV3MroOperatingImpact(cut.state, '2028-03');
const neutralImpact = projectV3MroOperatingImpact(neutral.state, '2028-03');
const stateBeforeProjection = structuredClone(hike.state);
const repeatedHikeImpact = projectV3MroOperatingImpact(hike.state, '2028-03');
near(hikeImpact.investmentPlanIndex, 99.5, 'hike direction reduces the separate synthetic investment plan index after its additional lag');
near(cutImpact.investmentPlanIndex, 100.5, 'cut direction increases the separate synthetic investment plan index after its additional lag');
near(neutralImpact.investmentPlanIndex, 100, 'neutral control retains the baseline plan index');
assert.equal(hikeImpact.effects[0].observedPeriod, '2028-01');
assert.equal(hikeImpact.effects[0].mroEffectivePeriod, '2028-02');
assert.equal(hikeImpact.effects[0].effectivePeriod, '2028-03');
assert.equal(hikeImpact.effects[0].totalLagPeriods, 2);
assert.equal(hikeImpact.effects[0].assumptionStatus, 'synthetic_uncalibrated');
assert.equal(hikeImpact.effects[0].directFinanceEffect, false);
assert.equal(hikeImpact.effects[0].actualStateChanged, false);
assert.equal(neutralImpact.effects.length, 0);
assert.deepEqual(repeatedHikeImpact, hikeImpact, 'reopening/reprojecting the same period does not accumulate the plan index');
assert.deepEqual(hike.state, stateBeforeProjection, 'read-only projection leaves state unchanged');
const aprilImpact = projectV3MroOperatingImpact(hike.state, '2028-04');
near(aprilImpact.investmentPlanIndex, 100, 'the one-period effect returns to baseline and never carries cumulatively');
assert.equal(aprilImpact.effects.length, 0);

const foreignFixtureInput = makeInput('2027-01', [], 100, 'hike', false);
foreignFixtureInput.mroScenarioShock.fixtureId = 'V3-T0071-FOREIGN-FIXTURE';
assert.equal(runV3MacroMonth(makeState('foreign-fixture'), foreignFixtureInput).ok, false, 'foreign fixture is rejected');

for (const [duplicateKind, expectedCode] of [['shock', 'duplicate_mro_shock'], ['effect-group', 'duplicate_mro_effect_group']]) {
  const duplicateInput = makeInput('2028-02', hike.janPrior, 100, 'hike', true);
  if (duplicateKind === 'effect-group') duplicateInput.mroScenarioShock.shockId = 'different-shock-id';
  assert.equal(runV3MacroMonth(hike.janState, duplicateInput).error?.code, expectedCode, `${duplicateKind} identity is rejected across periods`);
}

const coordinatedTamper = JSON.parse(JSON.stringify(hike.state));
const tamperedEventId = hikeEvent.macroEventId;
const alterT0071Event = event => event?.macroEventId === tamperedEventId ? { ...event, parameterSetId: 'T0071-coordinated-tamper' } : event;
coordinatedTamper.events = coordinatedTamper.events.map(alterT0071Event);
for (const snapshot of coordinatedTamper.periods) {
  snapshot.scheduledEvents = snapshot.scheduledEvents.map(alterT0071Event);
  snapshot.effectiveMacroEvents = snapshot.effectiveMacroEvents.map(alterT0071Event);
  if (snapshot.period === '2028-02' && snapshot.mro?.shockId === 'direction-pair') snapshot.mro.parameterSetId = 'T0071-coordinated-tamper';
}
assert.throws(() => validateV3MacroState(coordinatedTamper), /canonical monthly inputs|differs from replay/, 'coordinated JSON event + snapshot mutation fails canonical-source replay');
assert.equal(runV3MacroMonth(coordinatedTamper, makeInput('2028-05', hike.state.periods.map(row => row.spi.index), 100)).error?.code, 'invalid_macro_state', 'a tampered restored history cannot be advanced');
const sourceFingerprintTamper = JSON.parse(JSON.stringify(hike.state));
sourceFingerprintTamper.periods[0].canonicalInput.activity.activityIndex += 1;
assert.throws(() => validateV3MacroState(sourceFingerprintTamper), /source fingerprint/, 'stored canonical input is bound to its period fingerprint');

for (const [direction, run] of [['hike', hike], ['cut', cut]]) {
  const janInput = makeInput('2028-01', run.janPrior.slice(0, -1), 100, direction, false);
  // Same-period replay with identical inputs is idempotent; a changed shock payload is rejected.
  const replay = runV3MacroMonth(run.janState, janInput);
  assert.equal(replay.ok, true, replay.error?.message);
  assert.equal(replay.duplicate, true);
  const changed = structuredClone(janInput);
  changed.mroScenarioShock.direction = direction === 'hike' ? 'cut' : 'hike';
  changed.mroScenarioShock.deltaPp = direction === 'hike' ? -0.5 : 0.5;
  assert.equal(runV3MacroMonth(run.janState, changed).error?.code, 'period_payload_conflict');

  const restoredJan = JSON.parse(JSON.stringify(run.janState));
  assert.ok(validateV3MacroState(restoredJan));
  const febInput = makeInput('2028-02', run.janPrior, 100, null, true);
  const feb = runV3MacroMonth(restoredJan, febInput);
  assert.equal(feb.ok, true, feb.error?.message);
  const marInput = makeInput('2028-03', [...run.janPrior, feb.snapshot.spi.index], 100);
  const mar = runV3MacroMonth(feb.state, marInput);
  assert.equal(mar.ok, true, mar.error?.message);
  assert.deepEqual(mar.snapshot, direction === 'hike' ? marHike : marCut, 'JSON restore/replay reproduces MRO quote and lagged operating indicator inputs');
  const repeatedMarch = runV3MacroMonth(mar.state, marInput);
  assert.equal(repeatedMarch.ok, true, repeatedMarch.error?.message);
  assert.equal(repeatedMarch.duplicate, true, 'reopening the same macro month is idempotent');
  assert.deepEqual(repeatedMarch.state, mar.state, 'same-period replay does not write or double-apply the plan effect');
  const restoredProjection = projectV3MroOperatingImpact(JSON.parse(JSON.stringify(mar.state)), '2028-03');
  assert.deepEqual(restoredProjection, direction === 'hike' ? hikeImpact : cutImpact);
  assert.deepEqual(projectV3MroOperatingImpact(JSON.parse(JSON.stringify(mar.state)), '2028-03'), restoredProjection, 'repeated restored projection is idempotent');
}
console.log('A02 T-0071 exogenous MRO pairs, canonical input replay/tamper rejection, foreign/duplicate IDs, one-shot no-cumulative effect, save/restore and nonposting regressions PASS');
