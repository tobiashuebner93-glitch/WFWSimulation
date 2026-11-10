import assert from 'node:assert/strict';
import {
  V3_MACRO_DEMAND_MODEL_VERSION,
  calculateV3MacroDemand,
  validateV3MacroDemandTrace,
} from './v3-macro-demand-channel.js';
import {
  buildWeeklyTemplates,
  closeRunDay,
  createFinanceStateForRun,
  createRunFromInputs,
  installRunOperatingResources,
  openNextRunDay,
  processRunDayCustomerReceipts,
  renderMacroSummary,
  restoreRunSaveEnvelope,
  createRunSaveEnvelope,
} from './v3/run.js';

const context = { seed: 'D0169-fixed-seed', runId: 'V3|DEMAND-TEST|D0169-fixed-seed|2027-01-04|BOOM', scenarioId: 'DEMAND-TEST' };
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const neutral = calculateV3MacroDemand({ ...context, weekStart: '2027-01-04', activityGapPct: 0 });
const noExposure = calculateV3MacroDemand({ ...context, weekStart: '2027-01-04', activityGapPct: 3, exposure: 0 });
const missingExposure = calculateV3MacroDemand({ ...context, weekStart: '2027-01-04', activityGapPct: 3 });
assert.equal(neutral.demandFactor, 1);
assert.equal(noExposure.demandFactor, 1);
assert.equal(missingExposure.exposure, 0, 'missing exposure is treated as neutral per D-0169');
assert.equal(missingExposure.demandFactor, 1, 'missing exposure cannot silently activate macro effects');
assert.equal(neutral.realizedInquiryCount, 5);
assert.equal(noExposure.realizedInquiryCount, 5);
assert.equal(neutral.modelVersion, V3_MACRO_DEMAND_MODEL_VERSION);
assert.equal(neutral.calibrated, false);
validateV3MacroDemandTrace(neutral, { ...context, weekStart: '2027-01-04' });
assert.throws(() => validateV3MacroDemandTrace({ ...neutral, realizedInquiryCount: 6 }, { ...context, weekStart: '2027-01-04' }), /deterministic D-0169 calculation/);

const zeroExposureTemplates = buildWeeklyTemplates('2027-01-04', context.seed, { ...context, activityGapPct: 3, exposure: 0 });
const neutralTemplates = buildWeeklyTemplates('2027-01-04', context.seed, { ...context, activityGapPct: 0, exposure: 1 });
const inquiryShape = templates => templates.map(({ macroDemand, ...template }) => template);
assert.deepEqual(inquiryShape(zeroExposureTemplates), inquiryShape(neutralTemplates), 'zero exposure preserves the exact baseline inquiry sequence and sizes');
assert.deepEqual(zeroExposureTemplates.map(row => row.referencePriceCents), [11000, 33000, 55000, 11000, 33000]);

function runJanuary(macroPath) {
  let run = createRunFromInputs({ scenarioId: `D0169-${macroPath}`, seed: 'D0169-fixed-seed', startDate: '2027-01-04', endDate: '2027-02-01', macroPath });
  run = installRunOperatingResources(run, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: 0, finishedGoodsUsed: 0 });
  let finance = createFinanceStateForRun(run);
  const openingFinance = structuredClone(finance);
  const weeklyTrace = [];
  while (run.currentDate < run.endDate) {
    const opened = openNextRunDay(run);
    run = opened.state;
    finance = processRunDayCustomerReceipts(finance, opened.result.date).financeState;
    const schedule = run.modules.market.events.find(event => event.type === 'schedule_week' && event.payload.weekStart === opened.result.date);
    if (schedule) {
      weeklyTrace.push({ count: schedule.result.scheduledInquiryIds.length, demand: schedule.result.macroDemand });
      assert.equal(schedule.result.macroDemand.realizedInquiryCount, schedule.result.scheduledInquiryIds.length);
      assert.equal(schedule.result.macroDemand.sourceRef, 'D-0169:synthetic-macro-demand');
      assert.equal(schedule.result.macroDemand.activitySourceType, 'synthetic_fixture');
      assert.match(schedule.result.macroDemand.activitySourceRef, /^fixture:/);
      assert.equal(schedule.result.macroDemand.macroSnapshotPeriod, schedule.payload.weekStart.slice(0, 7));
      assert.equal(schedule.result.macroDemand.macroSnapshotId, run.modules.macro.sourceSnapshotId);
      assert.equal(schedule.result.macroDemand.runId, run.runId);
      assert.equal(schedule.result.macroDemand.scenarioId, run.scenarioId);
    }
    run = closeRunDay(run).state;
  }
  assert.deepEqual(finance, openingFinance, 'macro demand must leave finance state unchanged');
  assert.equal(run.modules.macro.periods.every(snapshot => Object.values(snapshot.financeEffects).every(value => value === false)), true);
  const restored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(createRunSaveEnvelope(run, finance))));
  assert.deepEqual(restored.runState.modules.market.events.filter(event => event.type === 'schedule_week'), run.modules.market.events.filter(event => event.type === 'schedule_week'));
  return { run, finance, weeklyTrace, inquiryCount: weeklyTrace.reduce((sum, row) => sum + row.count, 0) };
}

const boomA = runJanuary('BOOM');
const boomB = runJanuary('BOOM');
const low = runJanuary('LOW');
const baseline = runJanuary('UPSWING');
assert.deepEqual(boomA.weeklyTrace, boomB.weeklyTrace, 'same seed and model must replay identical weekly inquiries');
// Use valid Monday dates across the 2027 calendar rather than interpolating months.
const mondayDates = [];
for (let date = new Date('2027-01-04T12:00:00Z'); date.getUTCFullYear() === 2027; date.setUTCDate(date.getUTCDate() + 7)) mondayDates.push(date.toISOString().slice(0, 10));
const countsForGap = gap => mondayDates.map(weekStart => buildWeeklyTemplates(weekStart, 'D0169-direction-seed', { ...context, weekStart, activityGapPct: gap, exposure: 1 }).length);
const yearlyBoomCounts = countsForGap(3);
const yearlyNeutralCounts = countsForGap(0);
const yearlyLowCounts = countsForGap(-3);
assert.ok(yearlyBoomCounts.reduce((sum, count) => sum + count, 0) > yearlyNeutralCounts.reduce((sum, count) => sum + count, 0), 'positive synthetic activity gap increases inquiry volume over the neutral control');
assert.ok(yearlyLowCounts.reduce((sum, count) => sum + count, 0) < yearlyNeutralCounts.reduce((sum, count) => sum + count, 0), 'negative synthetic activity gap reduces inquiry volume under the same seed');
assert.equal(boomA.weeklyTrace[0].demand.demandFactor, 1.03);
assert.equal(low.weeklyTrace[0].demand.demandFactor, 0.97);
assert.match(renderMacroSummary(boomA.run.modules.macro, boomA.run.modules.market), /D-0169/);
assert.match(renderMacroSummary(boomA.run.modules.macro, boomA.run.modules.market), /synthetische, seed-stabile V3-Spielannahme/i);

const tampered = structuredClone(boomA.run);
tampered.modules.market.events.find(event => event.type === 'schedule_week').payload.templates[0].macroDemand.demandFactor = 2;
assert.throws(() => createRunSaveEnvelope(tampered, boomA.finance), /Ungültiger V3-Lauf|scheduled week|macro-demand trace/i, 'tampered demand provenance must fail closed before save');

const coordinatedRestore = structuredClone(baseline.run);
const coordinatedSchedule = coordinatedRestore.modules.market.events.find(event => event.type === 'schedule_week');
const coordinatedSnapshot = coordinatedRestore.modules.macro.periods.find(snapshot => snapshot.period === coordinatedSchedule.payload.weekStart.slice(0, 7));
const alteredGap = 0.001;
coordinatedSnapshot.activity.activityIndex = coordinatedSnapshot.activity.trendIndex * (1 + alteredGap / 100);
coordinatedSnapshot.activity.activityGapPct = alteredGap;
coordinatedSnapshot.activity.sourceType = 'synthetic_fixture_mutated';
coordinatedSnapshot.activity.sourceRef = 'fixture:coordinated-restore-mutation';
const coordinatedTrace = calculateV3MacroDemand({
  activityGapPct: alteredGap, activitySourceType: coordinatedSnapshot.activity.sourceType,
  activitySourceRef: coordinatedSnapshot.activity.sourceRef, exposure: 1,
  macroSnapshotId: coordinatedSnapshot.sourceSnapshotId, macroSnapshotPeriod: coordinatedSnapshot.period,
  seed: coordinatedRestore.seed, runId: coordinatedRestore.runId, scenarioId: coordinatedRestore.scenarioId,
  weekStart: coordinatedSchedule.payload.weekStart,
});
assert.equal(coordinatedTrace.realizedInquiryCount, coordinatedSchedule.payload.templates.length, 'coordinated mutation keeps the original inquiry count');
coordinatedSchedule.payload.templates.forEach(template => { template.macroDemand = structuredClone(coordinatedTrace); });
coordinatedSchedule.result.macroDemand = structuredClone(coordinatedTrace);
coordinatedRestore.modules.market.scheduledWeeks[coordinatedSchedule.payload.weekStart] = stable(coordinatedSchedule.payload.templates);
coordinatedRestore.dayEvents.find(event => event.phase === 'market_schedule' && event.occurredAt === coordinatedSchedule.payload.weekStart).result = structuredClone(coordinatedSchedule.result);
assert.throws(
  () => restoreRunSaveEnvelope(JSON.parse(JSON.stringify({ saveVersion: 'V3-RUN-SAVE-1', runState: coordinatedRestore, financeState: baseline.finance }))),
  /macro event history|macro-month snapshot|authoritative macro-month|recorded source input|day-open replay input/i,
  'restore rejects a coordinated macro snapshot/source/gap plus trace/template mutation against the recorded month input',
);

const traceFreeRestore = structuredClone(baseline.run);
const traceFreeSchedule = traceFreeRestore.modules.market.events.find(event => event.type === 'schedule_week');
traceFreeSchedule.payload.templates.forEach(template => { delete template.macroDemand; });
traceFreeSchedule.result.macroDemand = null;
traceFreeRestore.modules.market.scheduledWeeks[traceFreeSchedule.payload.weekStart] = stable(traceFreeSchedule.payload.templates);
assert.throws(
  () => restoreRunSaveEnvelope(JSON.parse(JSON.stringify({ saveVersion: 'V3-RUN-SAVE-1', runState: traceFreeRestore, financeState: baseline.finance }))),
  /requires a D-0169 demand trace/i,
  'restore rejects a shared V3 demand week whose trace was removed',
);

const exposureZeroRestore = structuredClone(baseline.run);
const exposureZeroSchedule = exposureZeroRestore.modules.market.events.find(event => event.type === 'schedule_week');
const originalTrace = exposureZeroSchedule.result.macroDemand;
const exposureZeroTrace = calculateV3MacroDemand({
  activityGapPct: originalTrace.activityGapPct, activitySourceType: originalTrace.activitySourceType,
  activitySourceRef: originalTrace.activitySourceRef, exposure: 0,
  macroSnapshotId: originalTrace.macroSnapshotId, macroSnapshotPeriod: originalTrace.macroSnapshotPeriod,
  seed: exposureZeroRestore.seed, runId: exposureZeroRestore.runId, scenarioId: exposureZeroRestore.scenarioId,
  weekStart: exposureZeroSchedule.payload.weekStart,
});
assert.equal(exposureZeroTrace.realizedInquiryCount, exposureZeroSchedule.payload.templates.length, 'A09 exposure-zero tamper preserves the fixture count of five');
exposureZeroSchedule.payload.templates.forEach(template => { template.macroDemand = structuredClone(exposureZeroTrace); });
exposureZeroSchedule.result.macroDemand = structuredClone(exposureZeroTrace);
exposureZeroRestore.modules.market.scheduledWeeks[exposureZeroSchedule.payload.weekStart] = stable(exposureZeroSchedule.payload.templates);
assert.throws(
  () => createRunSaveEnvelope(exposureZeroRestore, baseline.finance),
  /market schedule run event|exposure|day-open replay input/i,
  'the A09 coordinated exposure-zero mutation is rejected even when templates, schedule result, and scheduledWeeks agree',
);
const exposureZeroRunEvent = exposureZeroRestore.dayEvents.find(event => event.phase === 'market_schedule' && event.occurredAt === exposureZeroSchedule.payload.weekStart);
exposureZeroRunEvent.result = structuredClone(exposureZeroSchedule.result);
assert.throws(
  () => createRunSaveEnvelope(exposureZeroRestore, baseline.finance),
  /unauthorized exposure/i,
  'the shared-run scenario rejects exposure zero even if its market_schedule run event is also rewritten',
);
for (const [identity, invalidValue] of [['runId', 'V3|other-run'], ['scenarioId', 'OTHER-SCENARIO']]) {
  assert.throws(
    () => validateV3MacroDemandTrace({ ...originalTrace, [identity]: invalidValue }, { seed: baseline.run.seed, runId: baseline.run.runId, scenarioId: baseline.run.scenarioId, weekStart: exposureZeroSchedule.payload.weekStart }),
    /deterministic D-0169 calculation/i,
    `trace ${identity} is validated against its shared run`,
  );
}

console.log(`V3 D-0169 macro demand channel: PASS (52-week direction BOOM ${yearlyBoomCounts.reduce((sum, count) => sum + count, 0)}, neutral ${yearlyNeutralCounts.reduce((sum, count) => sum + count, 0)}, LOW ${yearlyLowCounts.reduce((sum, count) => sum + count, 0)}; source-bound coordinated restore, trace-presence, neutral-exposure, replay, and finance checks PASS)`);
