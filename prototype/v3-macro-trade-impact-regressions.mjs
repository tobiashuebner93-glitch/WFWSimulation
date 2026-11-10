import assert from 'node:assert/strict';
import {
  createFinanceStateForRun, createRunFromInputs, createRunSaveEnvelope,
  getRunProjection, restoreRunSaveEnvelope,
} from './v3/run.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import { buildWeeklyTemplates } from './v3/run.js';
import { closeV3RunDay, openV3RunDay } from './v3-run-orchestrator.js';
import {
  V3_MACRO_EXPORT_TEST_FIXTURE, V3_MACRO_FX_TEST_FIXTURE, V3_MACRO_ETA_TEST_FIXTURE,
} from './v3-macro-trade-impact.js';

function input(period, options = {}) {
  const { exportFixtureId = 'NEUTRAL', ...exportOverrides } = options.export ?? {};
  const value = buildRunMacroMonthInput({ period, path: 'UPSWING', foreignDemandFixtureId: exportFixtureId });
  Object.assign(value.externalChannels.fx_imported_inputs, options.fx ?? {});
  Object.assign(value.externalChannels.foreign_demand, exportOverrides);
  Object.assign(value.externalChannels.international_supply, options.eta ?? {});
  return value;
}
function macroGap(source) { return 100 * (source.activity.activityIndex / source.activity.trendIndex - 1); }
function openDay(runState, date, macroInput = null) {
  const dayInput = { date };
  if (macroInput) {
    dayInput.macroMonthInput = macroInput;
    dayInput.marketWeekTemplates = buildWeeklyTemplates(date, runState.seed, {
      runId: runState.runId, scenarioId: runState.scenarioId,
      activityGapPct: macroGap(macroInput), activitySourceType: macroInput.activity.sourceType,
      activitySourceRef: macroInput.activity.sourceRef, exposure: 1,
      macroSnapshotId: runState.modules.macro.sourceSnapshotId, macroSnapshotPeriod: macroInput.period,
      effectiveMacroEvents: runState.modules.macro.events, segments: runState.modules.market.segments,
      foreignDemandFixtureId: runState.foreignDemandFixtureId,
    });
  }
  return openV3RunDay(runState, dayInput);
}
function makeRun(scenarioId, janInput, febInput = null) {
  const foreignDemandFixtureId = janInput.externalChannels.foreign_demand.testFixtureId ?? 'NEUTRAL';
  let state = createRunFromInputs({ scenarioId, seed: 'l2-fixed-seed', startDate: '2027-01-04', endDate: '2027-02-05', macroPath: 'UPSWING', foreignDemandFixtureId });
  let opened = openDay(state, '2027-01-04', janInput); assert.equal(opened.ok, true, opened.error?.message); state = opened.state;
  const janSnapshot = structuredClone(state);
  state = closeV3RunDay(state).state;
  for (let day = 5; day <= 31; day += 1) {
    const date = `2027-01-${String(day).padStart(2, '0')}`;
    opened = openDay(state, date); assert.equal(opened.ok, true, opened.error?.message); state = closeV3RunDay(opened.state).state;
  }
  if (!febInput) return { janSnapshot, state };
  opened = openDay(state, '2027-02-01', febInput); assert.equal(opened.ok, true, opened.error?.message); state = opened.state;
  return { janSnapshot, state };
}
const openPlan = { planId: 'purchase-plan-7', status: 'open', importCurrency: 'USD', importExposureFactor: 1 };
const fxJan = input('2027-01', { fx: {
  testFixtureId: V3_MACRO_FX_TEST_FIXTURE, fxSeriesRef: 'fixture-series:USD-EUR:v1', baseIndex: 100, effectGroupId: 'fx-test-group',
  baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: 0.9,
  openImportPlans: [openPlan],
} });
const fxFeb = input('2027-02', { fx: {
  testFixtureId: V3_MACRO_FX_TEST_FIXTURE, fxSeriesRef: 'fixture-series:USD-EUR:v1', baseIndex: 100, effectGroupId: 'fx-test-group-feb',
  baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: 0.945,
  openImportPlans: [openPlan, { planId: 'accepted-plan', status: 'accepted', importCurrency: 'USD', importExposureFactor: 1, contractSnapshotRef: 'contract:snapshot-1' }, { planId: 'no-exposure', status: 'open', importCurrency: 'USD', importExposureFactor: 0 }],
} });
const etaFeb = input('2027-02', { eta: {
  testFixtureId: V3_MACRO_ETA_TEST_FIXTURE, effectGroupId: 'eta-test-group',
  openShipments: [{ orderRef: 'purchase-order-9', status: 'open', currentEta: '2027-02-05', delayDays: 2 }, { orderRef: 'already-received', status: 'received', currentEta: '2027-02-05', delayDays: 2 }],
} });
const jan = input('2027-01');
const febNeutral = input('2027-02');
const janMain = input('2027-01', { fx: fxJan.externalChannels.fx_imported_inputs, export: { exportFixtureId: V3_MACRO_EXPORT_TEST_FIXTURE } });
const febMain = input('2027-02', { fx: fxFeb.externalChannels.fx_imported_inputs, eta: etaFeb.externalChannels.international_supply });
const { janSnapshot: janOnly, state } = makeRun('l2-main', janMain, febMain);

const januaryImpact = getRunProjection(janOnly).macroTradeImpact;
assert.equal(januaryImpact.effects.some(effect => effect.channel === 'foreign_demand'), false, 'export channel with one-month lag is neutral before February');
const marketBefore = structuredClone(state.modules.market);
const finance = createFinanceStateForRun(state);
const financeBefore = structuredClone(finance);
const runBefore = structuredClone(state);
const projection = getRunProjection(state, finance).macroTradeImpact;
const fxEffect = projection.effects.find(effect => effect.target === 'openImportProcurementPlanIndex');
assert.ok(Math.abs(fxEffect.after - 101.25) < 1e-10, '5% synthetic FX change passes through 25% to an open USD plan');
assert.ok(Math.abs(fxEffect.appliedDeltaPct - 1.25) < 1e-10);
assert.equal(fxEffect.sourceType, 'synthetic_fixture');
assert.equal(fxEffect.basePeriod, '2027-01');
assert.equal(fxEffect.baseIndex, 100);
assert.equal(fxEffect.baseQuoteUnit, 'EUR_per_USD');
assert.equal(fxEffect.fxSeriesRef, 'fixture-series:USD-EUR:v1');
assert.equal(fxEffect.directFinanceEffect, false);
assert.equal(projection.effects.filter(effect => effect.target === 'openImportProcurementPlanIndex').length, 1, 'accepted contracts and zero-exposure plans do not reprice');
const exportEffect = projection.effects.find(effect => effect.target === 'actualD0169SegmentDistribution');
assert.ok(exportEffect, 'lagged foreign demand changes the actual integer export-segment allocation');
assert.equal(exportEffect.totalInquiriesAfter, exportEffect.totalInquiriesBefore);
assert.equal(exportEffect.totalInquiriesAfter, 5);
assert.equal(exportEffect.unit, 'inquiry_templates');
assert.equal(exportEffect.lagPeriods, 1);
assert.equal(exportEffect.effectivePeriod, '2027-02');
assert.equal(exportEffect.directFinanceEffect, false);
assert.equal(exportEffect.invariant.includes('unchanged D-0169 total'), true);
const etaEffect = projection.effects.find(effect => effect.target === 'openPurchaseOrderEta');
assert.equal(etaEffect.before, '2027-02-05');
assert.equal(etaEffect.after, '2027-02-07');
assert.equal(etaEffect.directFinanceEffect, false);
assert.equal(projection.effects.length, 3, 'only the explicit open FX plan, lagged export projection, and referenced open shipment produce effects');
assert.deepEqual(state.modules.market, marketBefore, 'trade projection does not mutate actual inquiries or market state');
assert.deepEqual(finance, financeBefore, 'trade projection does not mutate finance state');
assert.deepEqual(state, runBefore, 'trade projection does not mutate the shared run or accepted contract snapshots');

// Direction, caps and neutrality for explicit L2 test fixtures.
const fxNegativeFeb = input('2027-02', { fx: { testFixtureId: V3_MACRO_FX_TEST_FIXTURE, fxSeriesRef: 'fixture-series:USD-EUR:v1', baseIndex: 100, effectGroupId: 'fx-neg', baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: 0.855, openImportPlans: [openPlan] } });
const negativeRun = makeRun('l2-fx-negative', fxJan, fxNegativeFeb).state;
assert.ok(Math.abs(getRunProjection(negativeRun).macroTradeImpact.effects.find(effect => effect.target === 'openImportProcurementPlanIndex').after - 98.75) < 1e-10);
const fxCapFeb = input('2027-02', { fx: { testFixtureId: V3_MACRO_FX_TEST_FIXTURE, fxSeriesRef: 'fixture-series:USD-EUR:v1', baseIndex: 100, effectGroupId: 'fx-cap', baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: 1.08, openImportPlans: [openPlan] } });
const cappedRun = makeRun('l2-fx-cap', fxJan, fxCapFeb).state;
assert.equal(getRunProjection(cappedRun).macroTradeImpact.effects.find(effect => effect.target === 'openImportProcurementPlanIndex').appliedDeltaPct, 2);
const etaCapFeb = input('2027-02', { eta: { testFixtureId: V3_MACRO_ETA_TEST_FIXTURE, effectGroupId: 'eta-cap', openShipments: [{ orderRef: 'shipment-cap', status: 'open', currentEta: '2027-02-05', delayDays: 9 }] } });
const etaCapRun = makeRun('l2-eta-cap', jan, etaCapFeb).state;
assert.equal(getRunProjection(etaCapRun).macroTradeImpact.effects.find(effect => effect.target === 'openPurchaseOrderEta').delayDays, 5);
const noPlans = makeRun('l2-neutral', jan, febNeutral).state;
assert.deepEqual(getRunProjection(noPlans).macroTradeImpact.effects, [], 'standard/missing-data fixture is neutral');
const noRateInput = input('2027-02', { fx: { testFixtureId: V3_MACRO_FX_TEST_FIXTURE, effectGroupId: 'no-rate', baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', openImportPlans: [openPlan] } });
assert.equal(getRunProjection(makeRun('l2-no-rate', fxJan, noRateInput).state).macroTradeImpact.effects.some(effect => effect.target === 'openImportProcurementPlanIndex'), false, 'missing FX rate is neutral');

// A malformed January basis invalidates the whole series, including a well-formed February event.
const malformedFxJan = input('2027-01', { fx: {
  effectGroupId: 'bad-fx-base', sourceType: 'synthetic_fixture', sourceRef: 'fixture:bad-usdeur-base',
  baseIndex: 100, baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'USD_per_EUR', quotePerUSD: 0.9,
  openImportPlans: [openPlan],
} });
const malformedFxRun = makeRun('l2-fx-bad-basis', malformedFxJan, fxFeb).state;
assert.equal(getRunProjection(malformedFxRun).macroTradeImpact.effects.some(effect => effect.target === 'openImportProcurementPlanIndex'), false,
  'wrong-unit/missing-fixture January basis leaves the later valid-looking quote neutral');
const malformedFxEnvelope = createRunSaveEnvelope(malformedFxRun, createFinanceStateForRun(malformedFxRun));
const malformedFxRestored = restoreRunSaveEnvelope(malformedFxEnvelope);
assert.equal(getRunProjection(malformedFxRestored.runState, malformedFxRestored.financeState).macroTradeImpact.effects.some(effect => effect.target === 'openImportProcurementPlanIndex'), false,
  'save/restore cannot revive a series with an invalid January basis');

// D-0169 query total and plan effects are stable across save/restore and same-seed replay.
const restored = restoreRunSaveEnvelope(createRunSaveEnvelope(state, finance));
assert.deepEqual(getRunProjection(restored.runState, restored.financeState).macroTradeImpact, projection);
assert.equal(state.modules.market.inquiries.length, marketBefore.inquiries.length, 'the export projection never creates inquiries');
console.log('V3 macro trade impact regression: PASS (FX open-plan index, fixed accepted snapshot, export lag/count invariant, shipment ETA only, caps/directions, neutral defaults, save/restore, finance/market non-mutation)');
