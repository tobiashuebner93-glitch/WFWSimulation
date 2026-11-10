import assert from 'node:assert/strict';
import {
  createFinanceStateForRun, createRunFromInputs, createRunSaveEnvelope,
  getRunProjection, restoreRunSaveEnvelope,
} from './v3/run.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import { closeV3RunDay, createV3Run, openV3RunDay } from './v3-run-orchestrator.js';
import {
  createV3MacroState, runV3MacroMonth, validateV3MacroState,
  V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS, V3_T0071_MRO_SHOCK_FIXTURE_ID,
} from './v3-macro-simulation.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from './v3-price-index.js';

// T-0083 is a test-only use of the existing one-month lag fixture value. It
// does not declare default or calibrated lags for any policy channel.
const POLICY_LAG_TEST_ID = 'T0083-policy-lag-test-only-v1';
const POLICY_SPECS = Object.freeze({
  fiscal: { scope: { publicSegmentRef: 'segment:public' }, delta: 2 },
  growth: { scope: { adoptionRef: 'adoption:investment' }, delta: 2 },
  tariff: { scope: { coveredEmployeeScopeRef: 'employees:future-terms' }, delta: 1 },
  labor_market: { scope: { skillScopeRef: 'skill:machining' }, delta: 5 },
  environmental: { scope: { adoptionRef: 'adoption:efficiency', assetScopeRef: 'asset:machine-1' }, delta: -2 },
  demand_oriented: { scope: { segmentScopeRef: 'segment:domestic' }, delta: 5 },
  supply_oriented: { scope: { adoptionRef: 'adoption:training' }, delta: -2 },
});
const POLICY_CHANNELS = Object.keys(POLICY_SPECS);
const addDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};

function policyMonthInput(period, { effects = false } = {}) {
  const input = buildRunMacroMonthInput({ period, path: 'UPSWING' });
  for (const name of POLICY_CHANNELS) {
    const spec = POLICY_SPECS[name];
    Object.assign(input.policyChannels[name], {
      delta: effects ? spec.delta : 0,
      firmExposureFactor: effects ? 1 : 0,
      ...spec.scope,
      effectGroupId: `${POLICY_LAG_TEST_ID}:${name}`,
      intermediateIndicator: `${POLICY_LAG_TEST_ID}:${name}`,
      observedPeriod: '2027-01',
      effectiveFrom: '2027-01-01',
      lagPeriods: 1,
    });
  }
  return input;
}

function runPolicyScenario({ effects }) {
  const startDate = '2027-01-04', endDate = '2027-03-05';
  const runId = effects ? 'T0083-policy-delayed-effects' : 'T0083-policy-neutral-control';
  let state = createRunFromInputs({ runId, scenarioId: runId, seed: 't0083-fixed-seed', startDate, endDate, macroPath: 'UPSWING' });
  const monthInputs = {
    '2027-01-04': policyMonthInput('2027-01', { effects }),
    '2027-02-01': policyMonthInput('2027-02'),
    '2027-03-01': policyMonthInput('2027-03'),
  };
  const captures = {};
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const openInput = { date, ...(monthInputs[date] ? { macroMonthInput: monthInputs[date] } : {}) };
    const opened = openV3RunDay(state, openInput);
    assert.equal(opened.ok, true, `open ${date}: ${opened.error?.message}`);
    state = opened.state;
    if (['2027-01-04', '2027-02-01', '2027-03-01'].includes(date)) captures[date] = structuredClone(state);
    const closed = closeV3RunDay(state, { date });
    assert.equal(closed.ok, true, `close ${date}: ${closed.error?.message}`);
    state = closed.state;
  }
  return { state, captures, monthInputs };
}

const effected = runPolicyScenario({ effects: true });
const neutral = runPolicyScenario({ effects: false });
const janEffects = getRunProjection(effected.captures['2027-01-04']).macroPolicyImpact;
const febEffects = getRunProjection(effected.captures['2027-02-01']).macroPolicyImpact;
const marEffects = getRunProjection(effected.state).macroPolicyImpact;
const neutralFeb = getRunProjection(neutral.captures['2027-02-01']).macroPolicyImpact;
assert.equal(janEffects.effects.length, 0, 'none of the seven plan channels contributes before its February effective period');
assert.equal(febEffects.effects.length, POLICY_CHANNELS.length, 'each eligible policy channel contributes once on its first effective period');
assert.equal(neutralFeb.effects.length, 0, 'matched neutral exposure produces no policy contribution');

for (const name of POLICY_CHANNELS) {
  const rows = febEffects.effects.filter(effect => effect.channel === name);
  assert.equal(rows.length, 1, `${name} produces exactly one contribution on the effective date`);
  assert.equal(rows[0].observedPeriod, '2027-01', `${name} preserves its observation period`);
  assert.equal(rows[0].effectivePeriod, '2027-02', `${name} applies the existing one-month test lag`);
  assert.equal(rows[0].lagPeriods, 1, `${name} records the lag used by the fixture`);
  assert.equal(rows[0].directFinanceEffect, false, `${name} remains nonposting`);
  assert.equal(rows[0].actualStateChanged, false, `${name} remains a planning indicator`);
  const activated = effected.state.modules.macro.periods
    .flatMap(snapshot => snapshot.effectiveMacroEvents)
    .filter(event => event.channel === 'policy' && event.eventKey === name && event.observedPeriod === '2027-01' && event.effectivePeriod === '2027-02');
  assert.equal(activated.length, 1, `${name} activates exactly once in the macro history`);
}
assert.equal(marEffects.effects.length, POLICY_CHANNELS.length, 'the February effects remain single contributions when the March projection replays history');
assert.deepEqual(marEffects.effects.map(row => row.effectId).sort(), febEffects.effects.map(row => row.effectId).sort(), 'later replay does not add duplicate effect IDs');
for (const snapshot of effected.state.modules.macro.periods) {
  assert.ok(Object.values(snapshot.financeEffects).every(value => value === false), `${snapshot.period} does not mutate accounting state`);
}

const finance = createFinanceStateForRun(effected.state);
const financeBefore = structuredClone(finance);
const runBeforeProjection = structuredClone(effected.state);
const projected = getRunProjection(effected.state, finance).macroPolicyImpact;
assert.deepEqual(effected.state, runBeforeProjection, 'policy projection is read-only over the shared run');
assert.deepEqual(finance, financeBefore, 'policy projection does not mutate finance state');
const envelope = createRunSaveEnvelope(effected.state, finance);
const restored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(envelope)));
assert.deepEqual(getRunProjection(restored.runState, restored.financeState).macroPolicyImpact, projected, 'save/restore preserves each effective contribution exactly once');
assert.deepEqual(restored.financeState, financeBefore, 'save/restore preserves the unchanged finance state');
const duplicateMarchOpen = openV3RunDay(effected.state, { date: '2027-03-01', macroMonthInput: effected.monthInputs['2027-03-01'] });
assert.equal(duplicateMarchOpen.ok, true);
assert.equal(duplicateMarchOpen.duplicate, true, 'same-day replay is idempotent after restore-history processing');
assert.deepEqual(getRunProjection(duplicateMarchOpen.state).macroPolicyImpact, marEffects, 'same-day replay does not double policy effects');

// The monetary category uses the separately approved T-0071 MRO fixture.
// Reuse its one-month lag and values; do not infer a policy default or a firm posting.
const T0071_SOURCE = 'synthetic-fixture:T-0071:exogenous-mro-direction-pair';
const makeMonetaryState = label => createV3MacroState({
  runId: `T0083-monetary-${label}`, scenarioId: `T0083-monetary-${label}`, seed: 't0071-fixed-seed',
  profileVersion: 'T0071-exogenous-fixture-v1', sourceSnapshotId: `T0083:T0071:${label}`,
  cycleParameters: { lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1, persistencePeriods: 1, parameterSetId: 'T0071-cycle-fixture', sourceRef: T0071_SOURCE },
  mroFutureRule: { formulaId: 'T0071-flat-reference-MRO-v1', referenceMroPctPA: 1, coefficient: 0, referenceInflationPct: 0, lagPeriods: 1, parameterSetId: 'T0071-test-only-v1', sourceRef: 'synthetic-fixture:T-0071:neutral-reference', uncertaintyBand: { low: -0.25, base: 0, high: 0.25 } },
});
function monetaryInput(period, priorMonthlySpiIndexes, direction = null) {
  const input = buildRunMacroMonthInput({ period, path: 'UPSWING', priorMonthlySpiIndexes });
  input.parameterSetId = 'T0071-test-only-v1';
  Object.assign(input.policyChannels.monetary, {
    sourceRef: T0071_SOURCE, observedPeriod: period, effectiveFrom: `${period}-01`, lagPeriods: 1,
  });
  if (direction) input.mroScenarioShock = {
    fixtureId: V3_T0071_MRO_SHOCK_FIXTURE_ID, sourceType: 'synthetic_fixture', sourceRef: T0071_SOURCE,
    shockId: 'direction-pair', direction, observedPeriod: period, effectiveFrom: `${period}-01`, lagPeriods: 1,
    baseMroPctPA: 1, deltaPp: direction === 'hike' ? 0.5 : -0.5,
    uncertaintyBand: { low: -0.25, base: 0, high: 0.25 },
    parameterSetId: 'T0071-exogenous-mro-test-v1', effectGroupId: `T0071:${direction}:mro-pair`,
  };
  return input;
}
function runMonetary(direction) {
  let state = makeMonetaryState(direction ?? 'neutral'), prior = [], jan = null, feb = null;
  for (let month = 0; month < 14; month += 1) {
    const period = new Date(Date.UTC(2027, month, 1)).toISOString().slice(0, 7);
    const shock = period === '2028-01' && direction ? direction : null;
    const input = monetaryInput(period, prior, shock);
    const result = runV3MacroMonth(state, input);
    assert.equal(result.ok, true, result.error?.message);
    state = result.state;
    prior.push(result.snapshot.spi.index);
    if (period === '2028-01') jan = result.snapshot;
    if (period === '2028-02') feb = result.snapshot;
    assert.ok(Object.values(result.snapshot.financeEffects).every(value => value === false), `${period} monetary policy has no direct finance mutation`);
  }
  assert.ok(validateV3MacroState(state));
  return { state, jan, feb };
}
const monetaryHike = runMonetary('hike');
const monetaryNeutral = runMonetary(null);
assert.equal(monetaryHike.jan.scheduledEvents.filter(event => event.eventKey === 't0071_exogenous_mro_shock').length, 1);
assert.equal(monetaryHike.jan.effectiveMacroEvents.filter(event => event.eventKey === 't0071_exogenous_mro_shock').length, 0, 'monetary shock contributes nothing before its effective month');
assert.equal(monetaryHike.jan.scheduledEvents.find(event => event.channel === 'policy' && event.eventKey === 'monetary').effectivePeriod, '2028-02');
assert.equal(monetaryHike.feb.effectiveMacroEvents.filter(event => event.eventKey === 't0071_exogenous_mro_shock').length, 1, 'exactly one T-0071 monetary shock activates in February');
assert.equal(monetaryHike.jan.mro.valuePctPA, monetaryNeutral.jan.mro.valuePctPA, 'January MRO is unchanged before the shock takes effect');
assert.equal(monetaryHike.feb.mro.valuePctPA, monetaryNeutral.feb.mro.valuePctPA + 0.5, 'the existing T-0071 hike changes the MRO indicator once after one month');
// Rebuild from the same run identity and inputs so the February comparison is exact.
let restoredHistory = makeMonetaryState('hike'), restoredPrior = [];
for (let month = 0; month <= 12; month += 1) {
  const period = new Date(Date.UTC(2027, month, 1)).toISOString().slice(0, 7);
  const input = monetaryInput(period, restoredPrior, period === '2028-01' ? 'hike' : null);
  const result = runV3MacroMonth(restoredHistory, input);
  assert.equal(result.ok, true, result.error?.message);
  restoredHistory = result.state; restoredPrior.push(result.snapshot.spi.index);
}
const janCount = restoredHistory.events.filter(event => event.eventKey === 't0071_exogenous_mro_shock').length;
assert.equal(janCount, 1, 'the saved January history contains one monetary shock');
const januaryCanonicalInput = restoredHistory.periods.at(-1).canonicalInput;
const duplicateJan = runV3MacroMonth(restoredHistory, januaryCanonicalInput);
assert.equal(duplicateJan.ok, true, duplicateJan.error?.message);
assert.equal(duplicateJan.duplicate, true, 'same January input replays as an idempotent no-op');
assert.equal(duplicateJan.state.events.filter(event => event.eventKey === 't0071_exogenous_mro_shock').length, 1, 'same-period replay does not duplicate the monetary effect');
const restoredMonetary = JSON.parse(JSON.stringify(restoredHistory));
assert.ok(validateV3MacroState(restoredMonetary), 'T-0071 Save/Restore history validates');
const nextInput = monetaryInput('2028-02', restoredPrior);
const restoredFeb = runV3MacroMonth(restoredMonetary, nextInput);
assert.equal(restoredFeb.ok, true, restoredFeb.error?.message);
assert.deepEqual(restoredFeb.snapshot, monetaryHike.feb, 'restored continuation reproduces the single monetary effect');
assert.equal(restoredFeb.state.events.filter(event => event.eventKey === 't0071_exogenous_mro_shock').length, 1);

console.log('T-0083 policy-lag regression: PASS (seven delayed plan channels, monetary T-0071 MRO, neutral controls, month activation, replay/restore dedupe, finance non-mutation)');
