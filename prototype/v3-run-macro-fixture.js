import {
  createV3MacroState, V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS,
} from './v3-macro-simulation.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from './v3-price-index.js';
import { validateV3MacroDemandTrace } from './v3-macro-demand-channel.js';
import { buildSyntheticCostPlanChannel, V3_COST_PLAN_FIXTURE_ID } from './v3-cost-plan-scenario-fixture.js';
import { buildV3DestatisImportPriceBenchmark, V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID } from './v3-destatis-import-price-reference.js';

export const V3_FOREIGN_DEMAND_FIXTURE_ID = 'V3-L2-EXPORT-SHIFT-5PP-LAG1';
export const V3_FX_OFFER_PLAN_FIXTURE_ID = 'V3-T0070-FX-OFFER-SENSITIVITY-5PCT-LAG1';
export const V3_FX_OFFER_PLAN_ID = 'T0070-IMPORT-PLAN-1';
const V3_MACRO_FX_TEST_FIXTURE_ID = 'V3-L2-FX-25PASS-CAP2';
const ECB_REFERENCE_CONTEXT = Object.freeze({
  sourceSeriesId: 'EXR.D.USD.EUR.SP00.A', quoteUnit: 'USD_per_EUR',
  sourceUrl: 'https://data.ecb.europa.eu/data/datasets/EXR/EXR.D.USD.EUR.SP00.A',
  role: 'context_only_not_used_as_transaction_quote_or_cost',
});

// Transparent V3 UI fixture only. It is not an observed or calibrated economy model.
export const V3_RUN_MACRO_FIXTURE_VERSION = 'V3-RUN-MACRO-SYNTH-1';
export const V3_RUN_MACRO_PATHS = Object.freeze({
  UPSWING: Object.freeze({ gap: 1, momentum: 0.5, label: 'Aufschwung' }),
  BOOM: Object.freeze({ gap: 3, momentum: 0.5, label: 'Hochkonjunktur' }),
  DOWNTURN: Object.freeze({ gap: -1, momentum: -0.5, label: 'Abschwung' }),
  LOW: Object.freeze({ gap: -3, momentum: -0.5, label: 'Tiefphase' }),
});

const CYCLE_PARAMETERS = Object.freeze({
  lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1,
  persistencePeriods: 1, parameterSetId: 'cycle-fixture-v1', sourceRef: 'synthetic-fixture:cycle',
});

export function buildSyntheticForeignDemandChannel(period, path) {
  if (!V3_RUN_MACRO_PATHS[path] || period !== '2027-01') throw new TypeError('Auslandsnachfrage-Fixture ist nur für Januar 2027 definiert.');
  return {
    sourceType: 'synthetic_fixture', sourceRef: `fixture:${path}:${period}:foreign_demand`,
    unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 1,
    uncertaintyBand: { low: -1, base: 0, high: 1 }, firmExposure: 'fixture:foreign_demand',
    expectedOutcome: 'directional_only_test_input', observedPeriod: period,
    testFixtureId: V3_FOREIGN_DEMAND_FIXTURE_ID, effectGroupId: `fixture-group:${V3_FOREIGN_DEMAND_FIXTURE_ID}:${period}`,
    delta: 5, exportExposureFactor: 1, exportableSegmentIds: ['medium', 'large'],
    segmentScopeRef: 'fixture-exportable-segments:medium-large',
  };
}

export function buildSyntheticFxOfferPlanChannel(period, path) {
  if (!V3_RUN_MACRO_PATHS[path] || period < '2027-01') throw new TypeError('FX-Angebotsplan-Fixture benötigt den V3-Szenariopfad ab Januar 2027.');
  const quotePerUSD = period === '2027-01' ? 0.9 : 0.945;
  return {
    sourceType: 'synthetic_fixture', sourceRef: `synthetic-fixture:T-0070:${path}:${period}:USD-EUR`,
    unit: 'EUR_per_USD', value: quotePerUSD, effectiveFrom: `${period}-01`, lagPeriods: 1,
    uncertaintyBand: { low: -1, base: 0, high: 1 }, firmExposure: 'explicit-open-offer-import-plan',
    expectedOutcome: 'hypothetical_plan_sensitivity_only', observedPeriod: period,
    testFixtureId: V3_MACRO_FX_TEST_FIXTURE_ID, fxSeriesRef: 'synthetic-fixture:T-0070:USD-EUR:v1',
    baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD,
    baseIndex: 100, effectGroupId: `fixture-group:T-0070:${period}`,
    ecbReferenceContext: structuredClone(ECB_REFERENCE_CONTEXT),
    openImportPlans: [{ planId: V3_FX_OFFER_PLAN_ID, status: 'open', importCurrency: 'USD', importExposureFactor: 1 }],
  };
}

export function createRunMacroFixture({ runId, scenarioId, seed, path = 'UPSWING', costPlanFixtureId = 'NEUTRAL', foreignDemandFixtureId = 'NEUTRAL', importPriceBenchmarkId = 'NEUTRAL', fxOfferPlanFixtureId = 'NEUTRAL' }) {
  if (!V3_RUN_MACRO_PATHS[path]) throw new TypeError('Unbekannter synthetischer Konjunkturpfad.');
  if (!['NEUTRAL', V3_COST_PLAN_FIXTURE_ID].includes(costPlanFixtureId)) throw new TypeError('Unbekanntes Kostenplan-Fixture.');
  if (!['NEUTRAL', V3_FOREIGN_DEMAND_FIXTURE_ID].includes(foreignDemandFixtureId)) throw new TypeError('Unbekanntes Auslandsnachfrage-Fixture.');
  if (!['NEUTRAL', V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID].includes(importPriceBenchmarkId)) throw new TypeError('Unbekannte Destatis-Einfuhrpreisreferenz.');
  if (!['NEUTRAL', V3_FX_OFFER_PLAN_FIXTURE_ID].includes(fxOfferPlanFixtureId)) throw new TypeError('Unbekanntes FX-Angebotsplan-Fixture.');
  return createV3MacroState({
    runId, scenarioId, seed,
    profileVersion: V3_RUN_MACRO_FIXTURE_VERSION,
    sourceSnapshotId: `fixture-snapshot:${path}${costPlanFixtureId === 'NEUTRAL' ? '' : `:cost-plan:${costPlanFixtureId}`}${foreignDemandFixtureId === 'NEUTRAL' ? '' : `:foreign-demand:${foreignDemandFixtureId}`}${importPriceBenchmarkId === 'NEUTRAL' ? '' : `:import-price-reference:${importPriceBenchmarkId}`}${fxOfferPlanFixtureId === 'NEUTRAL' ? '' : `:fx-offer-plan:${fxOfferPlanFixtureId}`}`,
    cycleParameters: structuredClone(CYCLE_PARAMETERS),
  });
}

export function buildRunMacroMonthInput({ period, path, priorMonthlySpiIndexes = [], costPlanFixtureId = 'NEUTRAL', foreignDemandFixtureId = 'NEUTRAL', importPriceBenchmarkId = 'NEUTRAL', fxOfferPlanFixtureId = 'NEUTRAL' }) {
  const scenario = V3_RUN_MACRO_PATHS[path];
  if (!scenario) throw new TypeError('Unbekannter synthetischer Konjunkturpfad.');
  if (!['NEUTRAL', V3_FOREIGN_DEMAND_FIXTURE_ID].includes(foreignDemandFixtureId)) throw new TypeError('Unbekanntes Auslandsnachfrage-Fixture.');
  if (!['NEUTRAL', V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID].includes(importPriceBenchmarkId)) throw new TypeError('Unbekannte Destatis-Einfuhrpreisreferenz.');
  if (!['NEUTRAL', V3_FX_OFFER_PLAN_FIXTURE_ID].includes(fxOfferPlanFixtureId)) throw new TypeError('Unbekanntes FX-Angebotsplan-Fixture.');
  const source = name => ({
    sourceType: 'synthetic_fixture', sourceRef: `fixture:${path}:${period}:${name}`,
    unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 0,
    uncertaintyBand: { low: -1, base: 0, high: 1 }, firmExposure: `fixture:${name}`,
    expectedOutcome: 'directional_only_test_input',
  });
  const activityIndex = 100;
  const importPriceBenchmark = importPriceBenchmarkId === V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID
    ? buildV3DestatisImportPriceBenchmark(period) : null;
  return {
    period, parameterSetId: V3_RUN_MACRO_FIXTURE_VERSION,
    componentIndexes: Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, 100])),
    priorMonthlySpiIndexes,
    ...(importPriceBenchmark ? { destatisImportPriceBenchmark: importPriceBenchmark } : {}),
    componentSourceType: 'synthetic_fixture', componentSourceRef: `fixture:${path}:${period}:spi`,
    activity: {
      activityIndex,
      trendIndex: activityIndex / (1 + scenario.gap / 100),
      priorActivityIndex: activityIndex / (1 + scenario.momentum / 100),
      sourceType: 'synthetic_fixture', sourceRef: `fixture:${path}:${period}:activity`,
    },
    externalChannels: Object.fromEntries(V3_EXTERNAL_CHANNELS.map(name => [name,
      name === 'foreign_demand' && foreignDemandFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID && period === '2027-01'
        ? buildSyntheticForeignDemandChannel(period, path)
        : name === 'business_input_cost_plan' && costPlanFixtureId === V3_COST_PLAN_FIXTURE_ID && period === '2027-01'
        ? buildSyntheticCostPlanChannel(period)
        : name === 'fx_imported_inputs' && fxOfferPlanFixtureId === V3_FX_OFFER_PLAN_FIXTURE_ID
        ? buildSyntheticFxOfferPlanChannel(period, path) : source(name)])),
    policyChannels: Object.fromEntries(V3_POLICY_CHANNELS.map(name => [name, ({
      ...source(name), measure: `fixture ${name}`, goal: 'test only', intermediateIndicator: `fixture-indicator-${name}`,
      expectedOutcome: 'directional test only', counterEffect: 'test-only counter-effect',
      effectGroupId: `fixture-group-${name}`, accountingClass: 'information_plan',
    })])),
  };
}

// Deterministic, non-posting L2 allocation of an unchanged D-0169 inquiry total.
export const V3_MARKET_SEGMENT_TEMPLATE_CATALOG = Object.freeze({
  small: Object.freeze({ sizeClass: 'small', requiredCapacity: 2, referencePriceCents: 11000, requiredCapabilities: Object.freeze(['manual-fabrication']) }),
  medium: Object.freeze({ sizeClass: 'medium', requiredCapacity: 4, referencePriceCents: 33000, requiredCapabilities: Object.freeze(['turning']) }),
  large: Object.freeze({ sizeClass: 'large', requiredCapacity: 5, referencePriceCents: 55000, requiredCapabilities: Object.freeze(['turning']) }),
});
export function getV3RunSegmentTemplates(segments, period) {
  return Object.fromEntries(segments.map(segment => [segment.segmentId, {
    segmentId: segment.segmentId,
    ...(V3_MARKET_SEGMENT_TEMPLATE_CATALOG[segment.segmentId] ?? { sizeClass: segment.segmentId, requiredCapabilities: ['turning'], requiredCapacity: 2, referencePriceCents: 11000 }),
    macroPeriod: period,
  }]));
}
const clone = value => structuredClone(value);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const stableHash = value => { let h = 2166136261; for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const validEvent = (event, { runId, scenarioId, seed, period, segmentIds }) => event
  && event.eventKey === 'foreign_demand' && event.testFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID
  && event.sourceType === 'synthetic_fixture' && nonEmpty(event.sourceRef)
  && event.effectivePeriod === period && event.observedPeriod < period && event.lagPeriods === 1
  && event.runId === runId && event.scenarioId === scenarioId && String(event.seed) === String(seed)
  && nonEmpty(event.macroEventId) && nonEmpty(event.effectGroupId) && nonEmpty(event.segmentScopeRef)
  && Number.isFinite(event.delta) && Math.abs(event.delta) <= 5
  && Number.isFinite(event.exportExposureFactor) && event.exportExposureFactor > 0 && event.exportExposureFactor <= 1
  && Array.isArray(event.exportableSegmentIds) && event.exportableSegmentIds.length > 0
  && new Set(event.exportableSegmentIds).size === event.exportableSegmentIds.length
  && event.exportableSegmentIds.every(id => nonEmpty(id) && segmentIds.has(id));

function apportion(total, weights, seed, salt) {
  const ids = Object.keys(weights).sort();
  if (!ids.length || total <= 0) return Object.fromEntries(ids.map(id => [id, 0]));
  const sum = ids.reduce((n, id) => n + weights[id], 0);
  if (!(sum > 0)) return Object.fromEntries(ids.map(id => [id, 0]));
  const exact = Object.fromEntries(ids.map(id => [id, total * weights[id] / sum]));
  const counts = Object.fromEntries(ids.map(id => [id, Math.floor(exact[id])]));
  let remaining = total - Object.values(counts).reduce((a, b) => a + b, 0);
  const priority = [...ids].sort((a, b) => (exact[b] - Math.floor(exact[b])) - (exact[a] - Math.floor(exact[a]))
    || stableHash(`${seed}|${salt}|${a}`) - stableHash(`${seed}|${salt}|${b}`) || a.localeCompare(b));
  for (let i = 0; i < remaining; i += 1) counts[priority[i % priority.length]] += 1;
  return counts;
}

function countSegments(templates) {
  const result = {};
  for (const template of templates) result[template.segmentId] = (result[template.segmentId] ?? 0) + 1;
  return result;
}
const roundedCount = value => Math.max(0, Math.floor(value + 0.5));

function allocateWeek(baseTemplates, { event, exportTarget, runId, scenarioId, seed, period, segmentIds, segmentTemplates,
  monthlyWeeksSeen, monthlyInquiryCount, monthlyBaseExportCount, monthlyTargetExportCount }) {
  const total = baseTemplates.length;
  if (exportTarget < 0 || exportTarget > total) throw new TypeError('cumulative foreign-demand allocation exceeds the weekly D-0169 total');
  const beforeCounts = countSegments(baseTemplates);
  const exportIds = event.exportableSegmentIds;
  const domesticIds = [...segmentIds].filter(id => !exportIds.includes(id));
  if (!domesticIds.length || exportIds.some(id => !segmentTemplates[id])) throw new TypeError('foreign-demand segment scope is not allocatable');
  const exportWeights = Object.fromEntries(exportIds.map(id => [id, beforeCounts[id] || 0]));
  const domesticWeights = Object.fromEntries(domesticIds.map(id => [id, beforeCounts[id] || 0]));
  const groupWeights = counts => Object.values(counts).some(Boolean) ? counts : Object.fromEntries(Object.keys(counts).map(id => [id, 1]));
  const exportCounts = apportion(exportTarget, groupWeights(exportWeights), seed, `${period}|${event.effectGroupId}|export`);
  const domesticCounts = apportion(total - exportTarget, groupWeights(domesticWeights), seed, `${period}|${event.effectGroupId}|domestic`);
  const finalCounts = { ...domesticCounts, ...exportCounts };
  if (Object.values(finalCounts).reduce((sum, count) => sum + count, 0) !== total) throw new TypeError('foreign demand allocation did not preserve D-0169 total');
  const slotOrder = [...segmentIds].sort((a, b) => stableHash(`${seed}|${period}|${event.effectGroupId}|${a}`) - stableHash(`${seed}|${period}|${event.effectGroupId}|${b}`) || a.localeCompare(b));
  const assignment = slotOrder.flatMap(id => Array(finalCounts[id] ?? 0).fill(id));
  const prototypes = Object.fromEntries([...segmentIds].map(id => [id, segmentTemplates[id]
    ?? baseTemplates.find(row => row.segmentId === id) ?? null]));
  if (assignment.length !== total || assignment.some(id => !prototypes[id])) return clone(baseTemplates);
  const result = baseTemplates.map((base, index) => {
    const segmentId = assignment[index];
    const prototype = prototypes[segmentId];
    return { ...clone(prototype), templateId: base.templateId, customerId: base.customerId,
      macroDemand: clone(base.macroDemand), foreignDemand: {
        fixtureId: V3_FOREIGN_DEMAND_FIXTURE_ID, runId, scenarioId, seed: String(seed), period,
        observedPeriod: event.observedPeriod, effectivePeriod: event.effectivePeriod, lagPeriods: 1,
        sourceRef: event.sourceRef, macroEventId: event.macroEventId, effectGroupId: event.effectGroupId,
        segmentScopeRef: event.segmentScopeRef, exportableSegmentIds: [...exportIds],
        exportExposureFactor: event.exportExposureFactor, delta: event.delta,
        totalBefore: total, totalAfter: total, segmentId,
        monthlyWeeksSeen, monthlyInquiryCount, monthlyBaseExportCount, monthlyTargetExportCount,
        monthlyActualExportCount: monthlyTargetExportCount, weeklyExportTargetCount: exportTarget,
        weeklyExportActualCount: exportTarget,
      } };
  });
  return result;
}

/** Allocate this week after replaying prior same-month schedules from their canonical D-0169 traces. */
export function allocateV3ForeignDemandTemplates(templates, {
  runId, scenarioId, seed, period, segments, effectiveMacroEvents = [], priorWeeks = [], segmentTemplates = {}, fixtureSelected = false,
} = {}) {
  if (!Array.isArray(templates)) throw new TypeError('weekly templates are required');
  if (!fixtureSelected || templates.length === 0) return clone(templates);
  const segmentIds = new Set((segments ?? []).map(row => row?.segmentId).filter(nonEmpty));
  const events = effectiveMacroEvents.filter(event => event?.eventKey === 'foreign_demand'
    && event?.testFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID && event?.effectivePeriod === period);
  if (events.length !== 1 || !validEvent(events[0], { runId, scenarioId, seed, period, segmentIds })) return clone(templates);
  const event = events[0];
  if (!Array.isArray(templates[0]?.macroDemand) && (!templates[0]?.macroDemand || typeof templates[0].macroDemand !== 'object')) throw new TypeError('current week lacks its D-0169 trace');
  const currentWeekStart = templates[0]?.macroDemand?.weekStart;
  if (typeof currentWeekStart !== 'string' || currentWeekStart.slice(0, 7) !== period) throw new TypeError('current D-0169 trace does not identify its market week');
  const currentBaseCounts = countSegments(templates);
  const currentExportBase = event.exportableSegmentIds.reduce((sum, id) => sum + (currentBaseCounts[id] ?? 0), 0);
  const earlier = priorWeeks.filter(row => row?.weekStart?.slice(0, 7) === period && row.weekStart < currentWeekStart)
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  if (new Set(earlier.map(row => row.weekStart)).size !== earlier.length) throw new TypeError('duplicate prior market week in cumulative foreign-demand replay');
  let cumulativeN = 0;
  let cumulativeBaseExport = 0;
  let cumulativeActualExport = 0;
  let weeksSeen = 0;
  for (const row of earlier) {
    if (!row || typeof row.weekStart !== 'string' || !Array.isArray(row.templates) || row.templates.length === 0) throw new TypeError('prior same-month market schedule is incomplete');
    const trace = row.templates[0]?.macroDemand;
    if (!trace || row.templates.some(template => stable(template.macroDemand) !== stable(trace))) throw new TypeError('prior market week has inconsistent D-0169 traces');
    try { validateV3MacroDemandTrace(trace, { seed: String(seed), runId, scenarioId, weekStart: row.weekStart }); }
    catch { throw new TypeError('prior D-0169 trace failed replay validation'); }
    if (trace.realizedInquiryCount !== row.templates.length) throw new TypeError('prior schedule count differs from its replayed D-0169 result');
    const base = buildV3BaseMarketTemplates(row.weekStart, seed, trace);
    const baseCounts = countSegments(base);
    const baseExport = event.exportableSegmentIds.reduce((sum, id) => sum + (baseCounts[id] ?? 0), 0);
    cumulativeN += base.length;
    cumulativeBaseExport += baseExport;
    weeksSeen += 1;
    const targetCumulative = Math.min(cumulativeN, roundedCount(cumulativeBaseExport + cumulativeN * event.delta * event.exportExposureFactor / 100));
    const weeklyTarget = targetCumulative - cumulativeActualExport;
    const expectedPrior = allocateWeek(base, { event, exportTarget: weeklyTarget, runId, scenarioId, seed, period, segmentIds,
      segmentTemplates, monthlyWeeksSeen: weeksSeen, monthlyInquiryCount: cumulativeN,
      monthlyBaseExportCount: cumulativeBaseExport, monthlyTargetExportCount: targetCumulative });
    if (stable(expectedPrior) !== stable(row.templates)) throw new TypeError('prior same-month schedule differs from cumulative foreign-demand replay');
    cumulativeActualExport += weeklyTarget;
  }
  cumulativeN += templates.length;
  cumulativeBaseExport += currentExportBase;
  weeksSeen += 1;
  const targetCumulative = Math.min(cumulativeN, roundedCount(cumulativeBaseExport + cumulativeN * event.delta * event.exportExposureFactor / 100));
  const weeklyTarget = targetCumulative - cumulativeActualExport;
  return allocateWeek(templates, { event, exportTarget: weeklyTarget, runId, scenarioId, seed, period, segmentIds,
    segmentTemplates, monthlyWeeksSeen: weeksSeen, monthlyInquiryCount: cumulativeN,
    monthlyBaseExportCount: cumulativeBaseExport, monthlyTargetExportCount: targetCumulative });
}

export function buildV3BaseMarketTemplates(weekStart, seed, demandTrace) {
  const sizes = ['small', 'medium', 'large', 'small', 'medium'];
  return Array.from({ length: demandTrace.realizedInquiryCount }, (_, index) => {
    const sizeClass = sizes[index % sizes.length];
    const definition = V3_MARKET_SEGMENT_TEMPLATE_CATALOG[sizeClass];
    return { templateId: `run-${seed}-${weekStart}-request-${index + 1}`, customerId: `synthetic-customer-${weekStart}-${index + 1}`,
      segmentId: sizeClass, sizeClass, requiredCapabilities: [...definition.requiredCapabilities], requiredCapacity: definition.requiredCapacity,
      referencePriceCents: definition.referencePriceCents, macroPeriod: weekStart.slice(0, 7), macroDemand: clone(demandTrace) };
  });
}


