import assert from 'node:assert/strict';
import {
  buildWeeklyTemplates, createFinanceStateForRun, createRunFromInputs, getRunProjection, renderMacroSummary,
} from './run.js';
import { buildRunMacroMonthInput } from '../v3-run-macro-fixture.js';
import { closeV3RunDay, openV3RunDay } from '../v3-run-orchestrator.js';
import { V3_MACRO_FX_TEST_FIXTURE, V3_MACRO_EXPORT_TEST_FIXTURE, V3_MACRO_ETA_TEST_FIXTURE } from '../v3-macro-trade-impact.js';
import { V3_BUSINESS_COST_PLAN_TEST_FIXTURE } from '../v3-business-cost-plan-index.js';
import { buildV3DestatisImportPriceBenchmark, projectV3DestatisImportPriceBenchmark, V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID } from '../v3-destatis-import-price-reference.js';
import { readFile } from 'node:fs/promises';

const run = createRunFromInputs({ scenarioId: 'macro-ui-neutral', seed: 'ui-seed', startDate: '2027-01-04', endDate: '2027-01-29' });
const finance = createFinanceStateForRun(run);
const beforeRun = JSON.stringify(run);
const beforeFinance = JSON.stringify(finance);
const neutralProjection = getRunProjection(run, finance);
const neutralHtml = renderMacroSummary(run.modules.macro, run.modules.market, neutralProjection);
assert.match(neutralHtml, /Keine aktive Exposition\/keine Projektionswirkung/);
assert.doesNotMatch(neutralHtml, /Einfuhrpreisindex · historische Referenz/, 'neutral run hides the optional observed reference');
assert.deepEqual(neutralProjection.macroTradeImpact.effects, []);
assert.deepEqual(neutralProjection.macroPolicyImpact.effects, []);
assert.deepEqual(neutralProjection.businessCostPlanIndexes.effects, []);
assert.equal(JSON.stringify(run), beforeRun, 'projection and rendering leave Run byte-identical');
assert.equal(JSON.stringify(finance), beforeFinance, 'projection and rendering leave Finance byte-identical');

const selectedRun = createRunFromInputs({ scenarioId: 'destatis-reference-ui', seed: 'ui-seed', startDate: '2027-01-04', endDate: '2027-01-29', importPriceBenchmarkId: V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID });
const sourceReference = buildV3DestatisImportPriceBenchmark('2027-01');
const projectedReference = projectV3DestatisImportPriceBenchmark(sourceReference, {
  asOfDate: '2027-01-04', runId: selectedRun.runId, scenarioId: selectedRun.scenarioId,
  seed: selectedRun.seed, macroSnapshotId: 'macro-snapshot-ui-fixture',
});
assert.equal(projectV3DestatisImportPriceBenchmark(sourceReference, {
  asOfDate: '2026-10-29', runId: selectedRun.runId, scenarioId: selectedRun.scenarioId,
  seed: selectedRun.seed, macroSnapshotId: 'macro-snapshot-before-release',
}), null, 'runtime projection omits the reference before its associated release evidence');
const referenceProjection = structuredClone(neutralProjection);
referenceProjection.macroTradeImpact.references = [projectedReference];
const referenceHtml = renderMacroSummary(selectedRun.modules.macro, selectedRun.modules.market, referenceProjection);
for (const text of ['Einfuhrpreisindex · historische Referenz', '2026-09', '2021=100', 'Euro-Länder', '125,7', 'Nicht-Euro-Länder', '120,1', 'Insgesamt', '122,2', '2026-10-30', 'kein Zeitstempel vor', '2026-11-01', 'historischer, statischer Beobachtungsstand', 'Keine automatische Kosten-', 'GENESIS 61411-0010']) {
  assert.ok(referenceHtml.includes(text), `selected reference UI shows ${text}`);
}
assert.match(referenceHtml, /href="https:\/\/genesis\.destatis\.de\//);
assert.match(referenceHtml, /href="https:\/\/www\.destatis\.de\//);
assert.doesNotMatch(referenceHtml, /125,7\s*€/);
assert.deepEqual(referenceProjection.macroTradeImpact.effects, [], 'observed reference stays separate from the effects list');
assert.doesNotMatch(renderMacroSummary(selectedRun.modules.macro, selectedRun.modules.market, { ...referenceProjection, macroTradeImpact: { ...referenceProjection.macroTradeImpact, references: [] } }), /Einfuhrpreisindex · historische Referenz/, 'pre-release/absent projection displays no values');
const hostileReference = structuredClone(projectedReference);
hostileReference.revisionStatus = '<img src=x onerror=alert(1)>';
hostileReference.sourceRef = 'javascript:alert(1)';
const benchmarkHostileHtml = renderMacroSummary(selectedRun.modules.macro, selectedRun.modules.market, { ...referenceProjection, macroTradeImpact: { ...referenceProjection.macroTradeImpact, references: [hostileReference] } });
assert.match(benchmarkHostileHtml, /&lt;img src=x onerror=alert\(1\)&gt;/);
assert.doesNotMatch(benchmarkHostileHtml, /href="javascript:/);
const runPage = await readFile(new URL('./run.html', import.meta.url), 'utf8');
const runCss = await readFile(new URL('./run.css', import.meta.url), 'utf8');
assert.match(runPage, /name="importPriceBenchmarkId"/);
assert.match(runPage, /name="importPriceBenchmarkId" aria-describedby="import-price-reference-help"/);
assert.match(runPage, /id="import-price-reference-help" aria-live="polite"/);
assert.match(runCss, /\.macro-reference-values\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(runCss, /@media\(max-width:700px\)\{\.macro-reference-values\{grid-template-columns:1fr\}/);

// CP-0382 aggregate-count repro: L2 12/9/3, L3/L6 8/6/2, L4 5/4/1.
const aggregateProjection = structuredClone(neutralProjection);
const mixedEffects = (prefix, total, effective) => Array.from({ length: total }, (_, index) => ({
  target: `${prefix}-${index + 1}`, before: 100, after: index < effective ? 101 : null,
  ...(index < effective ? {} : { status: 'pending' }), effectivePeriod: '2027-02', lagPeriods: 1,
  sourceType: 'synthetic_fixture', sourceRef: `fixture:${prefix}:${index + 1}`, parameterSetId: 'AGGREGATE-COUNT-TEST',
}));
aggregateProjection.macroTradeImpact.effects = mixedEffects('l2', 12, 9);
aggregateProjection.macroPolicyImpact.effects = mixedEffects('policy', 8, 6);
aggregateProjection.businessCostPlanIndexes.effects = mixedEffects('index', 5, 4);
const aggregateHtml = renderMacroSummary(run.modules.macro, run.modules.market, aggregateProjection);
assert.match(aggregateHtml, /25 gesamt \/ 19 wirksam \/ 6 pending \/ 5 nicht angezeigt/);
assert.match(aggregateHtml, /12 Einträge gesamt: 9 wirksam, 3 pending/);
assert.match(aggregateHtml, /8 Einträge gesamt: 6 wirksam, 2 pending/);
assert.match(aggregateHtml, /5 Einträge gesamt: 4 wirksam, 1 pending/);
assert.equal((aggregateHtml.match(/class="card macro-impact-card"/g) ?? []).length, 20);

const explicitProjection = structuredClone(neutralProjection);
explicitProjection.macroTradeImpact.effects.push({
  target: 'openImportProcurementPlanIndex', before: 100, after: 101.25, appliedDeltaPct: 1.25,
  effectivePeriod: '2027-02', lagPeriods: 0, targetRef: 'plan:synthetic-1',
  sourceType: 'synthetic_fixture', sourceRef: 'fixture:fx:synthetic-1', assumptionId: 'FX-PLAN-TEST',
});
explicitProjection.macroTradeImpact.effects.push({
  target: 'projectedD0169SegmentDistribution', before: 5, after: 5, appliedShiftPp: 2,
  totalInquiriesBefore: 5, totalInquiriesAfter: 5, effectivePeriod: '2027-02', lagPeriods: 1,
  segmentScopeRef: 'scope:export', sourceType: 'synthetic_fixture', sourceRef: 'fixture:export:synthetic-1',
  assumptionId: 'EXPORT-PLAN-TEST',
});
explicitProjection.macroTradeImpact.effects.push({
  target: 'openPurchaseOrderEta', before: '2027-02-05', after: '2027-02-07', delayDays: 2,
  effectivePeriod: '2027-02', lagPeriods: 0, orderRef: 'purchase-order:synthetic-1',
  sourceType: 'synthetic_fixture', sourceRef: 'fixture:eta:synthetic-1', assumptionId: 'ETA-PLAN-TEST',
});
explicitProjection.macroPolicyImpact.effects.push({
  target: 'candidateAvailabilityIndex', before: 100, after: 102, unit: '%', scopeRef: 'skill:synthetic',
  effectivePeriod: '2027-02', lagPeriods: 0, sourceType: 'synthetic_fixture', sourceRef: 'fixture:policy:synthetic-1',
  parameterSetId: 'POLICY-PLAN-TEST',
});
explicitProjection.businessCostPlanIndexes.effects.push(...[
  ['businessInputCostPlanIndex', 104], ['wagePlanIndex', 103], ['procurementPlanIndex', 105],
].map(([target, after]) => ({ target, status: 'projected', before: 100, after, displayAfter: after,
  effectivePeriod: '2027-02', lagPeriods: 1, sourceType: 'synthetic_fixture', sourceRef: 'fixture:l4:synthetic-1',
  parameterSetId: 'L4-PLAN-TEST' })));
explicitProjection.businessCostPlanIndexes.effects.push({
  target: 'wagePlanIndex', status: 'pending', before: 100, after: null, effectivePeriod: '2027-02', lagPeriods: 1,
  sourceType: 'synthetic_fixture', sourceRef: 'fixture:l4:incomplete', parameterSetId: 'L4-PENDING-TEST',
});
const activeHtml = renderMacroSummary(run.modules.macro, run.modules.market, explicitProjection);
for (const text of ['FX · offener Importbeschaffungs-Planindex', 'Außenwirtschaft · erwartete Anfrageverteilung',
  'Internationale Versorgung · erwarteter Liefertermin', 'Arbeitsmarktpolitik · Verfügbarkeitsindikator', 'Business Cost Index (Plan)',
  'WagePlanIndex', 'ProcurementPlanIndex', 'Synthetische Planprojektion', '2027-02', 'fixture:l4:synthetic-1']) {
  assert.ok(activeHtml.includes(text), `active projection displays ${text}`);
}
assert.match(activeHtml, /pending/);
assert.match(activeHtml, /nicht die Gesamtzahl der Anfragen/);
assert.doesNotMatch(activeHtml, /105,00\s*€/);

const observedProjection = structuredClone(neutralProjection);
observedProjection.businessCostPlanIndexes.effects.push({
  target: 'businessInputCostPlanIndex', status: 'projected', before: 100, after: 102.5,
  sourceType: 'observed', sourceRef: 'source:official-cost-series', sourceSnapshotId: 'snapshot:cost-series:2027-01',
  sourcePeriod: '2027-01', effectivePeriod: '2027-02', lagPeriods: 1, parameterSetId: null,
});
const observedHtml = renderMacroSummary(run.modules.macro, run.modules.market, observedProjection);
assert.match(observedHtml, /Beobachtete Planprojektion/);
assert.match(observedHtml, /Quelle observed: source:official-cost-series/);
assert.doesNotMatch(observedHtml, /Synthetische Planprojektion/);
assert.doesNotMatch(observedHtml, /nichtbuchende synthetische Indikatoren/);

const hostileProjection = structuredClone(neutralProjection);
hostileProjection.macroPolicyImpact.effects.push({
  target: '<img src=x onerror=alert(1)>', before: 100, after: 101, unit: '%',
  scopeRef: '<script>alert(1)</script>', effectivePeriod: '2027-02', sourceType: 'synthetic_fixture',
  sourceRef: '<svg onload=alert(1)>', parameterSetId: 'hostile-test',
});
const hostileHtml = renderMacroSummary(run.modules.macro, run.modules.market, hostileProjection);
assert.ok(hostileHtml.includes('&lt;img src=x onerror=alert(1)&gt;'));
assert.ok(hostileHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
assert.ok(hostileHtml.includes('&lt;svg onload=alert(1)&gt;'));
assert.doesNotMatch(hostileHtml, /<img src=x|<script>alert|<svg onload/);
assert.equal(JSON.stringify(run), beforeRun, 'rendering remains non-mutating after active synthetic projection display');
assert.equal(JSON.stringify(finance), beforeFinance, 'rendering preserves Finance state');

// Exercise the real Shared Run projectors with explicit L2, L3/L6 and L4 fixtures.
const realRunStart = createRunFromInputs({ scenarioId: 'macro-ui-active', seed: 'ui-fixture-seed', startDate: '2027-01-04', endDate: '2027-02-05', foreignDemandFixtureId: V3_MACRO_EXPORT_TEST_FIXTURE });
const fixturePlan = { planId: 'ui-plan', status: 'open', importCurrency: 'USD', importExposureFactor: 1 };
const jan = buildRunMacroMonthInput({ period: '2027-01', path: 'UPSWING', foreignDemandFixtureId: V3_MACRO_EXPORT_TEST_FIXTURE });
Object.assign(jan.externalChannels.fx_imported_inputs, { testFixtureId: V3_MACRO_FX_TEST_FIXTURE, fxSeriesRef: 'fixture-series:ui', baseIndex: 100, effectGroupId: 'ui-fx-jan', baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: 0.9, openImportPlans: [fixturePlan] });
Object.assign(jan.externalChannels.business_input_cost_plan, {
  testFixtureId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE, parameterSetId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE,
  sourceType: 'synthetic_fixture', sourceRef: 'fixture:ui-costs:2027-01', basePeriod: '2027-01', baseIndex: 100, lagPeriods: 1,
  weights: { material: 0.25, energy: 0.25, wage: 0.25, logistics: 0.25 },
  components: ['material', 'energy', 'wage', 'logistics'].map(componentId => ({
    componentId, unit: { material: 'EUR/kg', energy: 'EUR/kWh', wage: 'EUR/h', logistics: 'EUR/shipment' }[componentId],
    baseValue: 100, currentValue: componentId === 'material' ? 110 : 100, basePeriod: '2027-01', currentPeriod: '2027-01', lagPeriods: 1,
    contributionId: `${componentId}|2027-01|V3-BUSINESS-COST-PLAN-INDEX-1`, sourceType: 'synthetic_fixture', sourceRef: 'fixture:ui-costs:2027-01', parameterSetId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE,
    driverIds: [{ driverId: `RAW-COMP|${componentId}|2027-01|fixture:ui-costs:2027-01`, driverType: 'raw_component', componentId, period: '2027-01', eventKey: 'business_input_cost_plan', eventRef: 'fixture:ui-costs:2027-01', scopeRef: `${componentId}:2027-01`, effectGroupId: `RAW-COMP|${componentId}|2027-01`, contributionId: `${componentId}|2027-01|V3-BUSINESS-COST-PLAN-INDEX-1` }],
  })),
});
const feb = buildRunMacroMonthInput({ period: '2027-02', path: 'UPSWING' });
Object.assign(feb.externalChannels.fx_imported_inputs, { testFixtureId: V3_MACRO_FX_TEST_FIXTURE, fxSeriesRef: 'fixture-series:ui', baseIndex: 100, effectGroupId: 'ui-fx-feb', baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: 0.945, openImportPlans: [fixturePlan] });
Object.assign(feb.externalChannels.international_supply, {
  testFixtureId: V3_MACRO_ETA_TEST_FIXTURE, effectGroupId: 'ui-eta',
  openShipments: Array.from({ length: 5000 }, (_, index) => ({
    orderRef: `ui-shipment-${index + 1}`, status: 'open', currentEta: '2027-02-05', delayDays: 2,
  })),
});
Object.assign(feb.policyChannels.fiscal, { delta: 2, firmExposureFactor: 1, publicSegmentRef: 'segment:public-ui', effectGroupId: 'ui-policy', intermediateIndicator: 'synthetic-tender-opportunity', lagPeriods: 0 });
let activeRun = realRunStart;
const openFixtureDay = (date, macroInput = null) => {
  const dayInput = { date };
  if (macroInput) {
    const activityGapPct = 100 * (macroInput.activity.activityIndex / macroInput.activity.trendIndex - 1);
    dayInput.macroMonthInput = macroInput;
    dayInput.marketWeekTemplates = buildWeeklyTemplates(date, activeRun.seed, {
      runId: activeRun.runId, scenarioId: activeRun.scenarioId, activityGapPct,
      activitySourceType: macroInput.activity.sourceType, activitySourceRef: macroInput.activity.sourceRef, exposure: 1,
      macroSnapshotId: activeRun.modules.macro.sourceSnapshotId, macroSnapshotPeriod: macroInput.period,
      effectiveMacroEvents: activeRun.modules.macro.events,
      segments: activeRun.modules.market.segments,
      foreignDemandFixtureId: activeRun.foreignDemandFixtureId,
    });
  }
  const opened = openV3RunDay(activeRun, dayInput);
  assert.equal(opened.ok, true, opened.error?.message);
  activeRun = closeV3RunDay(opened.state).state;
};
openFixtureDay('2027-01-04', jan);
for (let day = 5; day <= 31; day += 1) openFixtureDay(`2027-01-${String(day).padStart(2, '0')}`);
openFixtureDay('2027-02-01', feb);
const activeRunBeforeProjection = JSON.stringify(activeRun);
const d0169InquiryCount = activeRun.modules.market.events.filter(event => event.type === 'schedule_week')
  .reduce((count, event) => count + (event.payload.templates?.length ?? 0), 0);
const actualProjection = getRunProjection(activeRun);
const actualHtml = renderMacroSummary(activeRun.modules.macro, activeRun.modules.market, actualProjection);
assert.match(actualHtml, /Woche 2027-02-01/);
assert.match(actualHtml, /Marktanfragen/);
assert.match(actualHtml, /Gewonnene Aufträge/);
assert.match(actualHtml, /Deklarierte Personalkapazität/);
assert.match(actualHtml, /Kapazität basiert nur auf erklärten Personalstunden/);
assert.match(actualHtml, /Abwesenheiten und Maschinenengpässe sind nicht enthalten/);
assert.match(actualHtml, /nicht gebucht/);
assert.doesNotMatch(actualHtml, /Ist-Auslastung|realisierte Produktion[^.]*\b[1-9]/);
assert.ok(actualProjection.macroTradeImpact.effects.length >= 3, 'actual Shared Run L2 FX/export/ETA fixtures project');
assert.ok(actualProjection.macroPolicyImpact.effects.length >= 1, 'actual Shared Run L3/L6 fixture projects');
assert.equal(actualProjection.macroTradeImpact.effects.filter(effect => effect.target === 'openPurchaseOrderEta').length, 5000,
  'CP-0380 valid 5,000-open-shipment repro produces 5,000 ETA effects');
assert.deepEqual(actualProjection.businessCostPlanIndexes.effects.map(effect => effect.target), ['businessInputCostPlanIndex', 'wagePlanIndex', 'procurementPlanIndex']);
assert.ok(actualProjection.macroTradeImpact.effects.filter(effect => effect.target === 'actualD0169SegmentDistribution')
  .every(effect => effect.totalInquiriesBefore === effect.totalInquiriesAfter), 'L2 segment projection preserves D-0169 total inquiries');
const actualL2Mix = actualProjection.macroTradeImpact.effects.find(effect => effect.target === 'actualD0169SegmentDistribution');
assert.ok(actualL2Mix, 'selected export fixture exposes the actual L2 segment allocation');
assert.equal(Object.values(actualL2Mix.baseSegmentCounts).reduce((sum, count) => sum + count, 0), actualL2Mix.totalInquiriesBefore);
assert.equal(Object.values(actualL2Mix.actualSegmentCounts).reduce((sum, count) => sum + count, 0), actualL2Mix.totalInquiriesAfter);
assert.ok(actualHtml.includes('Basis → tatsächlicher Segmentmix'), 'UI compares D-0169 baseline and actual integer allocation');
assert.ok(actualHtml.includes('angeforderte Kapazität je Segment'), 'UI exposes capacity requirements derived from actual templates');
for (const text of ['1,25', '2027-02-07', 'Finanzpolitik', 'Business Cost Index (Plan)', 'WagePlanIndex', 'ProcurementPlanIndex', 'fixture:ui-costs:2027-01']) {
  assert.ok(actualHtml.includes(text), `actual Shared Run projection renders ${text}`);
}
const actualCardCount = (actualHtml.match(/class="card macro-impact-card"/g) ?? []).length;
assert.ok(actualCardCount <= 20, `CP-0380 5,000-effect repro renders at most 20 detail cards (got ${actualCardCount})`);
assert.ok(actualHtml.length < 50000, `bounded 5,000-effect HTML remains compact (got ${actualHtml.length} chars)`);
assert.ok(actualHtml.includes('5.002 Einträge gesamt'));
const allProjectionEntries = actualProjection.macroTradeImpact.effects.length
  + actualProjection.macroPolicyImpact.effects.length
  + actualProjection.businessCostPlanIndexes.effects.length
  + (actualProjection.macroTradeImpact.pending?.length ?? 0)
  + (actualProjection.macroPolicyImpact.pending?.length ?? 0)
  + (actualProjection.businessCostPlanIndexes.pending?.length ?? 0);
const omittedEntryCount = new Intl.NumberFormat('de-DE').format(allProjectionEntries - actualCardCount);
assert.ok(actualHtml.includes(`${omittedEntryCount} weitere Einträge nicht angezeigt`), 'summary states the number of omitted entries');
assert.equal(JSON.stringify(activeRun), activeRunBeforeProjection, 'active Shared Run stays byte-identical through projection and rendering');
assert.equal(activeRun.modules.market.events.filter(event => event.type === 'schedule_week')
  .reduce((count, event) => count + (event.payload.templates?.length ?? 0), 0), d0169InquiryCount, 'D-0169 inquiry count is unchanged by projection and render');

// Exercise the L4 projector's valid observed-source branch and card provenance label.
let observedRun = createRunFromInputs({ scenarioId: 'macro-ui-observed', seed: 'observed-ui-seed', startDate: '2027-01-04', endDate: '2027-02-05' });
const observedJan = buildRunMacroMonthInput({ period: '2027-01', path: 'UPSWING' });
const observedSource = 'source:observed-business-cost-series';
const observedVintage = 'vintage:2027-01';
Object.assign(observedJan.externalChannels.business_input_cost_plan, {
  sourceType: 'observed', sourceRef: observedSource, observedPeriod: '2027-01', publishedAt: '2027-01-02', dataVintage: observedVintage,
  sourceSnapshotId: 'snapshot:observed-business-cost:2027-01', basePeriod: '2027-01', baseIndex: 100, lagPeriods: 1,
  weights: { material: 0.25, energy: 0.25, wage: 0.25, logistics: 0.25 },
  components: ['material', 'energy', 'wage', 'logistics'].map(componentId => ({
    componentId, unit: { material: 'EUR/kg', energy: 'EUR/kWh', wage: 'EUR/h', logistics: 'EUR/shipment' }[componentId],
    baseValue: 100, currentValue: componentId === 'material' ? 110 : 100, basePeriod: '2027-01', currentPeriod: '2027-01', lagPeriods: 1,
    contributionId: `${componentId}|2027-01|V3-BUSINESS-COST-PLAN-INDEX-1`, sourceType: 'observed', sourceRef: observedSource,
    dataVintage: observedVintage, observedPeriod: '2027-01',
    driverIds: [{ driverId: `RAW-COMP|${componentId}|2027-01|${observedSource}`, driverType: 'raw_component', componentId, period: '2027-01', eventKey: 'business_input_cost_plan', eventRef: observedSource, scopeRef: `${componentId}:2027-01`, effectGroupId: `RAW-COMP|${componentId}|2027-01`, contributionId: `${componentId}|2027-01|V3-BUSINESS-COST-PLAN-INDEX-1` }],
  })),
});
delete observedJan.externalChannels.business_input_cost_plan.testFixtureId;
delete observedJan.externalChannels.business_input_cost_plan.parameterSetId;
const openObservedDay = (date, macroInput = null) => {
  const dayInput = { date };
  if (macroInput) {
    const activityGapPct = 100 * (macroInput.activity.activityIndex / macroInput.activity.trendIndex - 1);
    dayInput.macroMonthInput = macroInput;
    dayInput.marketWeekTemplates = buildWeeklyTemplates(date, observedRun.seed, {
      runId: observedRun.runId, scenarioId: observedRun.scenarioId, activityGapPct,
      activitySourceType: macroInput.activity.sourceType, activitySourceRef: macroInput.activity.sourceRef, exposure: 1,
      macroSnapshotId: observedRun.modules.macro.sourceSnapshotId, macroSnapshotPeriod: macroInput.period,
    });
  }
  const opened = openV3RunDay(observedRun, dayInput);
  assert.equal(opened.ok, true, opened.error?.message);
  observedRun = closeV3RunDay(opened.state).state;
};
openObservedDay('2027-01-04', observedJan);
for (let day = 5; day <= 31; day += 1) openObservedDay(`2027-01-${String(day).padStart(2, '0')}`);
openObservedDay('2027-02-01', buildRunMacroMonthInput({ period: '2027-02', path: 'UPSWING' }));
const observedRunProjection = getRunProjection(observedRun);
assert.deepEqual(observedRunProjection.businessCostPlanIndexes.effects.map(effect => effect.sourceType), ['observed', 'observed', 'observed']);
assert.equal(observedRunProjection.businessCostPlanIndexes.effects[0].componentContributions[0].dataVintage, observedVintage);
const observedRunHtml = renderMacroSummary(observedRun.modules.macro, observedRun.modules.market, observedRunProjection);
assert.match(observedRunHtml, /Beobachtete Planprojektion/);
assert.match(observedRunHtml, /Quelle observed: source:observed-business-cost-series/);
assert.doesNotMatch(observedRunHtml, /Synthetische Planprojektion/);
console.log(`A05 T-0063 macro impact UI regressions: PASS (5,000 ETA effects; ${actualCardCount} detail cards; ${actualHtml.length} HTML characters; observed L4 provenance)`);

