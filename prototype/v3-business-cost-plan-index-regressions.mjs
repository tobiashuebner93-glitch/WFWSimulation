import assert from 'node:assert/strict';
import {
  createFinanceStateForRun, createRunFromInputs, createRunSaveEnvelope,
  getRunProjection, restoreRunSaveEnvelope, buildWeeklyTemplates,
} from './v3/run.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import { closeV3RunDay, openV3RunDay } from './v3-run-orchestrator.js';
import { V3_BUSINESS_COST_PLAN_TEST_FIXTURE } from './v3-business-cost-plan-index.js';

const ids = ['material', 'energy', 'wage', 'logistics'];
const units = { material: 'EUR/kg', energy: 'EUR/kWh', wage: 'EUR/h', logistics: 'EUR/shipment' };
const weights = { material: 0.25, energy: 0.25, wage: 0.25, logistics: 0.25 };
function costComponent(componentId, period, currentValue = 100) {
  const sourceRef = `fixture:${componentId}:${period}`;
  const contributionId = `${componentId}|${period}|V3-BUSINESS-COST-PLAN-INDEX-1`;
  return {
    componentId, unit: units[componentId], baseValue: 100, currentValue,
    basePeriod: '2027-01', currentPeriod: period, lagPeriods: 1,
    contributionId, sourceType: 'synthetic_fixture', sourceRef,
    parameterSetId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE,
    driverIds: [{
      driverId: `RAW-COMP|${componentId}|${period}|fixture:business-cost-plan:${period}`,
      driverType: 'raw_component', componentId, period,
      eventKey: 'business_input_cost_plan', eventRef: `fixture:business-cost-plan:${period}`,
      scopeRef: `${componentId}:${period}`, effectGroupId: `RAW-COMP|${componentId}|${period}`,
      contributionId,
    }],
  };
}
function input(period, opts = {}) {
  const value = buildRunMacroMonthInput({ period, path: 'UPSWING' });
  const channel = value.externalChannels.business_input_cost_plan;
  Object.assign(channel, {
    testFixtureId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE,
    parameterSetId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE,
    sourceType: 'synthetic_fixture', sourceRef: `fixture:business-cost-plan:${period}`,
    basePeriod: '2027-01', baseIndex: 100, lagPeriods: 1,
    weights: opts.weights === undefined ? weights : opts.weights,
    components: opts.components ?? ids.map(componentId => costComponent(componentId, period, opts.current?.[componentId] ?? 100)),
  });
  if (opts.mutate) opts.mutate(channel);
  return value;
}
function macroGap(source) { return 100 * (source.activity.activityIndex / source.activity.trendIndex - 1); }
function openDay(state, date, macroInput = null) {
  const dayInput = { date };
  if (macroInput) {
    dayInput.macroMonthInput = macroInput;
    dayInput.marketWeekTemplates = buildWeeklyTemplates(date, state.seed, {
      runId: state.runId, scenarioId: state.scenarioId,
      activityGapPct: macroGap(macroInput), activitySourceType: macroInput.activity.sourceType,
      activitySourceRef: macroInput.activity.sourceRef, exposure: 1,
      macroSnapshotId: state.modules.macro.sourceSnapshotId, macroSnapshotPeriod: macroInput.period,
    });
  }
  return openV3RunDay(state, dayInput);
}
function makeRun(scenarioId, januaryInput, februaryInput = null) {
  let state = createRunFromInputs({ scenarioId, seed: 'cost-plan-seed', startDate: '2027-01-04', endDate: '2027-02-05', macroPath: 'UPSWING' });
  let opened = openDay(state, '2027-01-04', januaryInput);
  assert.equal(opened.ok, true, opened.error?.message); state = closeV3RunDay(opened.state).state;
  for (let day = 5; day <= 31; day += 1) {
    const date = `2027-01-${String(day).padStart(2, '0')}`;
    opened = openDay(state, date); assert.equal(opened.ok, true, opened.error?.message); state = closeV3RunDay(opened.state).state;
  }
  opened = openDay(state, '2027-02-01', februaryInput);
  assert.equal(opened.ok, true, opened.error?.message);
  return opened.state;
}

const neutral = makeRun('cost-neutral', buildRunMacroMonthInput({ period: '2027-01', path: 'UPSWING' }), buildRunMacroMonthInput({ period: '2027-02', path: 'UPSWING' }));
assert.deepEqual(getRunProjection(neutral).businessCostPlanIndexes.effects, [], 'standard macro fixture stays neutral');

function evaluate(scenarioId, opts) {
  const state = makeRun(scenarioId, input('2027-01', opts), buildRunMacroMonthInput({ period: '2027-02', path: 'UPSWING' }));
  const finance = createFinanceStateForRun(state);
  const stateBefore = structuredClone(state); const financeBefore = structuredClone(finance);
  const projection = getRunProjection(state, finance).businessCostPlanIndexes;
  assert.deepEqual(state, stateBefore, 'plan-index projection never mutates shared run state');
  assert.deepEqual(finance, financeBefore, 'plan-index projection never mutates finance state');
  return { state, finance, projection };
}
const base = evaluate('cost-base', {});
const byTarget = Object.fromEntries(base.projection.effects.map(effect => [effect.target, effect]));
assert.equal(base.projection.effects.length, 3);
assert.equal(byTarget.businessInputCostPlanIndex.after, 100, 'all component base values produce index 100');
assert.equal(byTarget.wagePlanIndex.after, 100);
assert.equal(byTarget.procurementPlanIndex.after, 100);
assert.equal(base.projection.period, '2027-02', 'January component observations apply only after the one-month lag');

const materialRun = evaluate('cost-material-110', { current: { material: 110 } });
const material = materialRun.projection.effects;
const materialByTarget = Object.fromEntries(material.map(effect => [effect.target, effect]));
assert.equal(materialByTarget.businessInputCostPlanIndex.after, 102.5, 'single component 110 at 25% yields BICI 102.5');
assert.equal(materialByTarget.procurementPlanIndex.after, 105, 'procurement view renormalizes material/logistics weights');
assert.equal(materialByTarget.wagePlanIndex.after, 100);
assert.equal(materialByTarget.businessInputCostPlanIndex.displayAfter, 102.5, 'two-decimal formatting is presentation-only');
assert.deepEqual(materialByTarget.businessInputCostPlanIndex.aggregationWeights, weights);
assert.deepEqual(materialByTarget.procurementPlanIndex.aggregationWeights, { material: 0.5, logistics: 0.5 });
const precision = evaluate('cost-display-precision', { current: { material: 110.123 } }).projection.effects;
const precisionBici = precision.find(effect => effect.target === 'businessInputCostPlanIndex');
assert.equal(precisionBici.after, 102.53075, 'full precision remains in the model value');
assert.equal(precisionBici.displayAfter, 102.53, 'two decimals are display-only');

const wage = evaluate('cost-wage-110', { current: { wage: 110 } }).projection.effects;
const wageByTarget = Object.fromEntries(wage.map(effect => [effect.target, effect]));
assert.equal(wageByTarget.businessInputCostPlanIndex.after, 102.5);
assert.equal(wageByTarget.wagePlanIndex.after, 110, 'wage view is independent');
assert.equal(wageByTarget.procurementPlanIndex.after, 100);
const logistics = evaluate('cost-logistics-120', { current: { logistics: 120 } }).projection.effects;
assert.equal(logistics.find(effect => effect.target === 'businessInputCostPlanIndex').after, 105);
assert.equal(logistics.find(effect => effect.target === 'procurementPlanIndex').after, 110);

const combinedPriorVector = evaluate('cost-combined-material-110-energy-100-wage-100-logistics-120', {
  current: { material: 110, energy: 100, wage: 100, logistics: 120 },
}).projection.effects;
const combinedByTarget = Object.fromEntries(combinedPriorVector.map(effect => [effect.target, effect.after]));
assert.equal(combinedByTarget.businessInputCostPlanIndex, 107.5,
  'combined prior vector BICI = (110 + 100 + 100 + 120) / 4 = 107.5');
assert.equal(combinedByTarget.procurementPlanIndex, 115,
  'combined prior vector procurement = (110 + 120) / 2 = 115 after 0.5/0.5 normalization');
assert.equal(combinedByTarget.wagePlanIndex, 100,
  'combined prior vector Wage index follows its unchanged wage component at 100');

const missing = evaluate('cost-missing', { components: ids.filter(id => id !== 'energy').map(componentId => costComponent(componentId, '2027-01')) });
assert.equal(missing.projection.effects.find(effect => effect.target === 'businessInputCostPlanIndex').status, 'pending');
assert.equal(missing.projection.effects.find(effect => effect.target === 'wagePlanIndex').after, 100);
assert.equal(missing.projection.effects.find(effect => effect.target === 'procurementPlanIndex').after, 100);

const invalidCases = [
  ['mixed unit', { mutate: channel => { channel.components[0].unit = 'USD/kg'; } }],
  ['wrong period', { mutate: channel => { channel.components[0].currentPeriod = '2027-02'; } }],
  ['wrong lag', { mutate: channel => { channel.components[0].lagPeriods = 0; } }],
  ['duplicate contribution', { mutate: channel => { channel.components[1].contributionId = channel.components[0].contributionId; } }],
  ['bad weight sum', { weights: { material: 0.4, energy: 0.2, wage: 0.2, logistics: 0.1 } }],
  ['missing provenance', { mutate: channel => { channel.components[0].sourceRef = ''; } }],
  ['missing driver array', { mutate: channel => { delete channel.components[0].driverIds; } }],
  ['empty driver array', { mutate: channel => { channel.components[0].driverIds = []; } }],
  ['wrong driver type', { mutate: channel => { channel.components[0].driverIds = ['fx']; } }],
  ['wrong driver event', { mutate: channel => { channel.components[0].driverIds[0].eventRef = 'other-event'; } }],
  ['wrong driver scope', { mutate: channel => { channel.components[0].driverIds[0].scopeRef = 'energy:2027-01'; } }],
  ['wrong driver period', { mutate: channel => { channel.components[0].driverIds[0].period = '2027-02'; } }],
  ['duplicate driver id', { mutate: channel => { channel.components[1].driverIds[0].driverId = channel.components[0].driverIds[0].driverId; } }],
  ['duplicate effect group', { mutate: channel => { channel.components[1].driverIds[0].effectGroupId = channel.components[0].driverIds[0].effectGroupId; } }],
  ...['fx', 'policy', 'tariff', 'environmental', 'cpi'].map(type => [
    `unaggregated ${type} driver`, { mutate: channel => { channel.components[0].driverIds[0].driverType = type; } },
  ]),
];
for (const [label, opts] of invalidCases) {
  const outcome = evaluate(`cost-invalid-${label.replaceAll(' ', '-')}`, opts).projection;
  assert.deepEqual(outcome.effects, [], `${label} must not produce an index`);
  assert.ok(outcome.pending?.length, `${label} is reported pending`);
}

const restored = restoreRunSaveEnvelope(createRunSaveEnvelope(materialRun.state, materialRun.finance));
assert.deepEqual(getRunProjection(restored.runState, restored.financeState).businessCostPlanIndexes, materialRun.projection,
  'macro replay and save/restore reproduce the same L4 index projection');
const tampered = structuredClone(materialRun.state);
const febSnapshot = tampered.modules.macro.periods.find(snapshot => snapshot.period === '2027-02');
const indexedEvent = febSnapshot.effectiveMacroEvents.find(event => event.eventKey === 'business_input_cost_plan');
indexedEvent.components[0].currentValue += 1;
assert.throws(() => createRunSaveEnvelope(tampered, materialRun.finance), /macro|event|fingerprint|replay/i,
  'coordinated event-history edits cannot be saved as a replay-valid cost-index projection');
console.log('V3 business cost plan index regressions: PASS (neutral default, basis 100, hand-calculated BICI/Wage/Procurement, one-month lag, pending invalid inputs, replay/restore, finance/run non-mutation)');
