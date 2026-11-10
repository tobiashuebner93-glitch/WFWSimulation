import assert from 'node:assert/strict';
import {
  allocateV3ForeignDemandTemplates, buildV3BaseMarketTemplates,
  V3_FOREIGN_DEMAND_FIXTURE_ID, V3_MARKET_SEGMENT_TEMPLATE_CATALOG,
} from './v3-run-macro-fixture.js';
import { createRunFromInputs, buildWeeklyTemplates, createRunSaveEnvelope, restoreRunSaveEnvelope, createFinanceStateForRun } from './v3/run.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import { projectV3MacroTradeImpacts } from './v3-macro-trade-impact.js';
import { closeV3RunDay, openV3RunDay } from './v3-run-orchestrator.js';

const segments = Object.keys(V3_MARKET_SEGMENT_TEMPLATE_CATALOG).map(segmentId => ({ segmentId }));
const catalog = Object.fromEntries(Object.entries(V3_MARKET_SEGMENT_TEMPLATE_CATALOG).map(([segmentId, row]) => [segmentId, { segmentId, ...row, macroPeriod: '2027-02' }]));
const mkEvent = ({ effectivePeriod = '2027-02', delta = 5, exposure = 1, ids = ['medium', 'large'], ...overrides } = {}) => ({
  eventKey: 'foreign_demand', testFixtureId: V3_FOREIGN_DEMAND_FIXTURE_ID,
  sourceType: 'synthetic_fixture', sourceRef: 'fixture:export:jan', observedPeriod: '2027-01', effectivePeriod,
  lagPeriods: 1, delta, exportExposureFactor: exposure, exportableSegmentIds: ids,
  effectGroupId: 'group-export', macroEventId: 'macro-export-1', segmentScopeRef: 'fixture-export-scope',
  runId: 'run-1', scenarioId: 'scenario-1', seed: 'seed-1', ...overrides,
});
const baseFor = (n, weekStart = '2027-02-01') => buildV3BaseMarketTemplates(weekStart, 'seed-1', {
  realizedInquiryCount: n, runId: 'run-1', scenarioId: 'scenario-1', weekStart,
});
const options = (templates, event, extra = {}) => ({ runId: 'run-1', scenarioId: 'scenario-1', seed: 'seed-1', period: '2027-02', segments, segmentTemplates: catalog, fixtureSelected: true, effectiveMacroEvents: event ? [event] : [], ...extra });
const counts = rows => Object.fromEntries(rows.reduce((map, row) => map.set(row.segmentId, (map.get(row.segmentId) ?? 0) + 1), new Map()));
const sum = rows => Object.values(counts(rows)).reduce((a, b) => a + b, 0);

const base = baseFor(100);
assert.deepEqual(allocateV3ForeignDemandTemplates(base, { ...options(base, mkEvent()), fixtureSelected: false }), base, 'neutral run is identical');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, options(base, null)), base, 'missing exposure event is neutral');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, options(base, mkEvent({ exposure: 0 }))), base, 'zero exposure is neutral');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, options(base, mkEvent({ exposure: null }))), base, 'null exposure is neutral');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, options(base, mkEvent({ effectivePeriod: '2027-01' }))), base, 'one-month lag is neutral before effective month');
const positive = allocateV3ForeignDemandTemplates(base, options(base, mkEvent()));
assert.equal(sum(positive), 100, 'positive shift keeps exact N');
assert.equal(counts(positive).medium + counts(positive).large, counts(base).medium + counts(base).large + 5, 'positive 5pp allocates five integer slots into exportable segments');
assert.ok(positive.every((row, index) => row.templateId === base[index].templateId && row.customerId === base[index].customerId), 'stable slot identities remain attached');
assert.ok(positive.every(row => row.requiredCapacity === V3_MARKET_SEGMENT_TEMPLATE_CATALOG[row.segmentId].requiredCapacity && row.requiredCapabilities.includes('turning')), 'segment-specific requirements remain canonical');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, options(base, mkEvent())), positive, 'same seed and run produce the same assignment');
const negative = allocateV3ForeignDemandTemplates(base, options(base, mkEvent({ delta: -5 })));
assert.equal(sum(negative), 100);
assert.equal(counts(negative).medium + counts(negative).large, counts(base).medium + counts(base).large - 5, 'negative shift moves five integer slots out of exportable segments');
assert.equal(sum(allocateV3ForeignDemandTemplates(baseFor(0), options(baseFor(0), mkEvent()))), 0, 'N=0 yields no fractional inquiry');
for (const n of [1, 2, 5, 17, 501]) {
  const input = baseFor(n);
  const result = allocateV3ForeignDemandTemplates(input, options(input, mkEvent()));
  assert.equal(result.length, n, `N=${n} remains exact`);
  assert.ok(result.every(row => Number.isInteger(row.requiredCapacity)), `N=${n} keeps integer template requirements`);
}
const multiExport = allocateV3ForeignDemandTemplates(base, options(base, mkEvent({ ids: ['medium', 'large'] })));
assert.ok(counts(multiExport).medium > 0 && counts(multiExport).large > 0, 'multiple exportable segments remain represented');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, options(base, mkEvent({ ids: ['unknown-segment'] }))), base, 'unknown segment is neutral');
assert.deepEqual(allocateV3ForeignDemandTemplates(base, { ...options(base, mkEvent()), effectiveMacroEvents: [mkEvent(), mkEvent({ macroEventId: 'macro-export-2', effectGroupId: 'group-export-2' })] }), base, 'duplicate effective events are neutral and cannot apply twice');
assert.ok(positive.every(row => row.foreignDemand.totalBefore === 100 && row.foreignDemand.totalAfter === 100), 'per-template replay witness records exact unchanged N');

function d0169Week(weekStart, { delta = 5, priorWeeks = [], fixture = V3_FOREIGN_DEMAND_FIXTURE_ID, ids = ['medium', 'large'] } = {}) {
  const event = mkEvent({ delta, ids });
  return buildWeeklyTemplates(weekStart, 'seed-1', {
    runId: 'run-1', scenarioId: 'scenario-1', activityGapPct: 0,
    activitySourceType: 'synthetic_fixture', activitySourceRef: 'fixture:activity', exposure: 1,
    macroSnapshotId: 'snapshot-2027-02', macroSnapshotPeriod: '2027-02', effectiveMacroEvents: [event],
    segments, foreignDemandFixtureId: fixture, priorWeeks,
  });
}
const febWeeks = ['2027-02-01', '2027-02-08', '2027-02-15', '2027-02-22'];
const cumulativeWeeks = [];
for (const weekStart of febWeeks) {
  const templates = d0169Week(weekStart, { priorWeeks: cumulativeWeeks });
  assert.equal(templates.length, 5, `${weekStart}: D-0169 remains N=5`);
  cumulativeWeeks.push({ weekStart, templates });
}
const baseExportByWeek = cumulativeWeeks.map(row => counts(buildV3BaseMarketTemplates(row.weekStart, 'seed-1', row.templates[0].macroDemand)).medium
  + counts(buildV3BaseMarketTemplates(row.weekStart, 'seed-1', row.templates[0].macroDemand)).large);
const actualExportByWeek = cumulativeWeeks.map(row => counts(row.templates).medium + counts(row.templates).large);
assert.deepEqual(baseExportByWeek, [3, 3, 3, 3], 'each N=5 baseline has three exportable templates');
assert.equal(cumulativeWeeks.reduce((sum, row) => sum + row.templates.length, 0), 20, 'four weekly totals remain exactly 20');
assert.deepEqual(actualExportByWeek, [3, 4, 3, 3], 'cumulative integer carry places the +1 slot in week 2');
assert.equal(actualExportByWeek.reduce((a, b) => a + b, 0), Math.round(baseExportByWeek.reduce((a, b) => a + b, 0) + 0.05 * 20), 'four-week +5pp target rounds to 13 of 20');
assert.ok(cumulativeWeeks.every(row => row.templates.every(template => template.foreignDemand.totalAfter === 5)), 'no week receives a fractional or additional inquiry');

const negativeWeeks = [];
for (const weekStart of febWeeks) negativeWeeks.push({ weekStart, templates: d0169Week(weekStart, { delta: -5, priorWeeks: negativeWeeks }) });
const negativeExportCount = negativeWeeks.reduce((sum, row) => sum + counts(row.templates).medium + counts(row.templates).large, 0);
assert.equal(negativeExportCount, Math.round(12 - 0.05 * 20), 'negative shift rounds cumulatively to 11 export templates');
const replayedWeeks = [];
for (const weekStart of febWeeks) replayedWeeks.push({ weekStart, templates: d0169Week(weekStart, { priorWeeks: replayedWeeks }) });
assert.deepEqual(replayedWeeks, cumulativeWeeks, 'same seed, run, and inputs reproduce every cumulative weekly schedule');
const changedRunPrior = structuredClone(cumulativeWeeks[0]);
changedRunPrior.templates[0].macroDemand.runId = 'other-run';
assert.throws(() => d0169Week('2027-02-08', { priorWeeks: [changedRunPrior] }), /prior|replay|D-0169/i, 'prior schedule from another run fails closed');
assert.deepEqual(d0169Week('2027-03-01', { priorWeeks: cumulativeWeeks }), d0169Week('2027-03-01', { priorWeeks: [] }), 'month change resets prior cumulative allocation');
assert.deepEqual(d0169Week('2027-02-08', { priorWeeks: [], fixture: 'NEUTRAL' }), buildV3BaseMarketTemplates('2027-02-08', 'seed-1', d0169Week('2027-02-08', { priorWeeks: [], fixture: 'NEUTRAL' })[0].macroDemand), 'neutral fixture retains the D-0169 base mix');
const largeOnlyWeeks = [];
for (const weekStart of febWeeks) largeOnlyWeeks.push({ weekStart, templates: d0169Week(weekStart, { ids: ['large'], priorWeeks: largeOnlyWeeks }) });
assert.equal(largeOnlyWeeks.reduce((sum, row) => sum + counts(row.templates).large, 0), Math.round(4 + 0.05 * 20), 'monthly carry also works for a different valid exportable-segment set');

function inputFor(date, state) {
  const input = { date };
  if (date === '2027-01-04' || date.endsWith('-01')) input.macroMonthInput = buildRunMacroMonthInput({ period: date.slice(0, 7), path: 'UPSWING', foreignDemandFixtureId: V3_FOREIGN_DEMAND_FIXTURE_ID });
  if (new Date(`${date}T12:00:00Z`).getUTCDay() === 1) {
    const macro = input.macroMonthInput;
    const activity = macro?.activity ?? state.modules.macro.periods.at(-1)?.activity;
    const gap = activity ? 100 * (activity.activityIndex / activity.trendIndex - 1) : 0;
    input.marketWeekTemplates = buildWeeklyTemplates(date, state.seed, {
      runId: state.runId, scenarioId: state.scenarioId, activityGapPct: gap,
      activitySourceType: activity?.sourceType ?? 'synthetic_scenario_assumption', activitySourceRef: activity?.sourceRef ?? 'neutral',
      exposure: 1, macroSnapshotId: state.modules.macro.sourceSnapshotId, macroSnapshotPeriod: date.slice(0, 7),
      effectiveMacroEvents: state.modules.macro.events, segments: state.modules.market.segments,
      foreignDemandFixtureId: state.foreignDemandFixtureId,
      priorWeeks: state.modules.market.events
        .filter(event => event.type === 'schedule_week' && event.payload?.weekStart < date && event.payload?.weekStart?.slice(0, 7) === date.slice(0, 7))
        .map(event => ({ weekStart: event.payload.weekStart, templates: event.payload.templates })),
    });
  }
  return input;
}
let run = createRunFromInputs({ scenarioId: 'export-runtime-test', seed: 'stable', startDate: '2027-01-04', endDate: '2027-03-05', foreignDemandFixtureId: V3_FOREIGN_DEMAND_FIXTURE_ID });
for (let date = '2027-01-04'; date <= '2027-03-02';) {
  const opened = openV3RunDay(run, inputFor(date, run));
  assert.equal(opened.ok, true, opened.error?.message);
  run = closeV3RunDay(opened.state).state;
  date = new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
}
const febSchedules = run.modules.market.events.filter(event => event.type === 'schedule_week' && event.payload.weekStart.startsWith('2027-02')).sort((a, b) => a.payload.weekStart.localeCompare(b.payload.weekStart));
assert.equal(febSchedules.length, 4, 'the shared run records all four February market weeks');
assert.ok(febSchedules.every(event => event.payload.templates.length === 5), 'each February schedule preserves exact D-0169 N=5');
const febSchedule = febSchedules.at(-1);
const febBaseExport = febSchedules.reduce((sum, event) => {
  const baseWeek = buildV3BaseMarketTemplates(event.payload.weekStart, run.seed, event.payload.templates[0].macroDemand);
  return sum + counts(baseWeek).medium + counts(baseWeek).large;
}, 0);
const febActualExport = febSchedules.reduce((sum, event) => sum + counts(event.payload.templates).medium + counts(event.payload.templates).large, 0);
assert.equal(febSchedules.reduce((sum, event) => sum + event.payload.templates.length, 0), 20, 'February D-0169 total remains exactly 20');
assert.equal(febActualExport, Math.round(febBaseExport + 0.05 * 20), 'shared run applies cumulative +5pp rounding to the month');
assert.equal(febActualExport, 13, 'N=5 for four weeks yields 13 exportable templates from 20');
assert.ok(run.modules.market.events.filter(event => event.type === 'schedule_week' && event.payload.weekStart.startsWith('2027-01')).every(event => event.payload.templates.every(template => !template.foreignDemand)), 'January remains neutral before the one-month lag');
assert.ok(febSchedule.payload.templates.every(template => template.foreignDemand?.effectivePeriod === '2027-02'), 'January fixture becomes actual market mix in February only');
assert.equal(febSchedule.payload.templates.length, febSchedule.result.macroDemand.realizedInquiryCount, 'runtime schedule count is solely D-0169 N');
const marchSchedule = run.modules.market.events.find(event => event.type === 'schedule_week' && event.payload.weekStart === '2027-03-01');
assert.ok(marchSchedule && marchSchedule.payload.templates.every(template => !template.foreignDemand), 'month boundary resets cumulative history and January fixture has no March effect');
assert.equal(run.customerWorkOrders.length, 0, 'segment allocation does not award orders');
const finance = createFinanceStateForRun(run);
const financeBefore = structuredClone(finance);
const febEffects = projectV3MacroTradeImpacts(run, '2027-02').effects.filter(effect => effect.target === 'actualD0169SegmentDistribution');
assert.equal(febEffects.length, 4, 'projection reports each scheduled February week');
assert.equal(febEffects.reduce((sum, effect) => sum + effect.actualSegmentCounts.medium + effect.actualSegmentCounts.large, 0), 13, 'projection reports actual cumulative allocation without applying a second shift');
assert.deepEqual(finance, financeBefore, 'mix allocation leaves the finance ledger unchanged');
const envelope = createRunSaveEnvelope(run, finance);
const restored = restoreRunSaveEnvelope(envelope);
assert.deepEqual(restored.runState.modules.market.events.filter(event => event.type === 'schedule_week' && event.payload.weekStart.startsWith('2027-02')).map(event => event.payload.templates), febSchedules.map(event => event.payload.templates), 'save/restore replays every cumulative weekly allocation');
assert.deepEqual(restored.financeState, finance, 'save/restore leaves the finance state unchanged');
const tampered = structuredClone(envelope);
const tamperedSchedule = tampered.runState.modules.market.events.find(event => event.type === 'schedule_week' && event.payload.weekStart === '2027-02-01');
tamperedSchedule.payload.templates[0].segmentId = 'small';
assert.throws(() => restoreRunSaveEnvelope(tampered), /template|allocation|inquiry/i, 'tampered market allocation fails closed on restore');
const tamperedPriorCopies = structuredClone(envelope);
const priorSchedule = tamperedPriorCopies.runState.modules.market.events.find(event => event.type === 'schedule_week' && event.payload.weekStart === '2027-02-01');
priorSchedule.payload.templates[0].segmentId = 'small';
assert.throws(() => restoreRunSaveEnvelope(tamperedPriorCopies), /template|allocation|inquiry/i, 'tampered earlier schedule is rejected during cumulative replay');
const tamperedSource = structuredClone(envelope);
const janOpen = JSON.parse(tamperedSource.runState.dayOpenFingerprints['2027-01-04']);
janOpen.macroMonthInput.externalChannels.foreign_demand.delta = 4;
tamperedSource.runState.dayOpenFingerprints['2027-01-04'] = JSON.stringify(janOpen);
assert.throws(() => restoreRunSaveEnvelope(tamperedSource), /macro|fixture|source|input/i, 'tampered authoritative macro source is rejected');
const tamperedFixture = structuredClone(envelope);
tamperedFixture.runState.foreignDemandFixtureId = 'NEUTRAL';
assert.throws(() => restoreRunSaveEnvelope(tamperedFixture), /fixture|run|snapshot/i, 'fixture selection cannot be changed independently of run identity');
console.log('V3 foreign-demand market runtime regression: PASS (neutrality, lag, +/- cumulative integer shift, N=0/1/2/5/17/100/501, deterministic monthly replay, export scopes, duplicate/unknown fail-closed, month reset, cross-run rejection, save/restore, source/schedule/fixture tampering, no award/finance mutation)');
