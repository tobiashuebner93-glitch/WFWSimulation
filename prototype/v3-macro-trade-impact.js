import { validateV3RunState } from './v3-run-orchestrator.js';
import { buildV3BaseMarketTemplates } from './v3-run-macro-fixture.js';
import { projectV3DestatisImportPriceBenchmark } from './v3-destatis-import-price-reference.js';

export const V3_MACRO_TRADE_IMPACT_VERSION = 'V3-MACRO-TRADE-PLAN-1';
export const V3_MACRO_FX_TEST_FIXTURE = 'V3-L2-FX-25PASS-CAP2';
export const V3_MACRO_EXPORT_TEST_FIXTURE = 'V3-L2-EXPORT-SHIFT-5PP-LAG1';
export const V3_MACRO_ETA_TEST_FIXTURE = 'V3-L2-ETA-DELAY-2-CAP5';

const finite = value => typeof value === 'number' && Number.isFinite(value);
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const validDate = value => nonEmpty(value) && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
  && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const stableHash = text => {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
};
const stableOrder = (ids, seed, salt) => [...ids].sort((a, b) => stableHash(`${seed}|${salt}|${a}`) - stableHash(`${seed}|${salt}|${b}`) || a.localeCompare(b));
const shiftCalendarDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);

function authoritativeEvents(runState, period) {
  const macro = runState.modules.macro;
  return macro.periods.filter(snapshot => snapshot.period <= period)
    .flatMap(snapshot => snapshot.effectiveMacroEvents ?? [])
    .filter(event => event.effectivePeriod <= period && event.channel === 'external');
}
function makeTrace(runState, event, channel, target, inputDelta, before, after, extra = {}) {
  return {
    effectId: `TRADE-PLAN|${event.macroEventId}|${target}|${extra.targetRef ?? ''}`,
    runId: runState.runId, scenarioId: runState.scenarioId, seed: runState.seed,
    modelVersion: V3_MACRO_TRADE_IMPACT_VERSION, parameterSetId: event.parameterSetId ?? null,
    channel, target, sourceType: event.sourceType, sourceRef: event.sourceRef,
    sourceSnapshotId: event.sourceSnapshotId ?? runState.modules.macro.sourceSnapshotId,
    observedPeriod: event.observedPeriod ?? null, effectivePeriod: event.effectivePeriod,
    lagPeriods: event.lagPeriods, effectGroupId: event.effectGroupId ?? event.macroEventId,
    inputDelta, before, after, accountingClass: 'information_plan', directFinanceEffect: false,
    actualStateChanged: false, syntheticTestFixture: true, ...extra,
  };
}

function projectFxPlanning(runState, events, period) {
  const fxEvents = events.filter(event => event.eventKey === 'fx_imported_inputs');
  const baselineEvent = fxEvents.find(event => event.period === '2027-01' && event.effectivePeriod <= period);
  const validFxSource = event => event
    && event.sourceType === 'synthetic_fixture'
    && nonEmpty(event.sourceRef)
    && event.testFixtureId === V3_MACRO_FX_TEST_FIXTURE
    && nonEmpty(event.fxSeriesRef)
    && event.runId === runState.runId
    && event.scenarioId === runState.scenarioId
    && event.baseCurrency === 'USD'
    && event.quoteCurrency === 'EUR'
    && event.quoteUnit === 'EUR_per_USD'
    && finite(event.quotePerUSD) && event.quotePerUSD > 0;
  if (!validFxSource(baselineEvent) || baselineEvent.baseIndex !== 100) return [];
  const baselineRate = baselineEvent.quotePerUSD;
  const result = [];
  for (const event of fxEvents.filter(item => item.effectivePeriod === period)) {
    if (!validFxSource(event) || event.testFixtureId !== baselineEvent.testFixtureId
      || event.fxSeriesRef !== baselineEvent.fxSeriesRef
      || !Array.isArray(event.openImportPlans) || !nonEmpty(event.effectGroupId)) continue;
    const fxChangePct = 100 * (event.quotePerUSD / baselineRate - 1);
    const seen = new Set();
    for (const plan of event.openImportPlans) {
      if (!plan || plan.status !== 'open' || plan.importCurrency !== 'USD' || !nonEmpty(plan.planId)
        || !finite(plan.importExposureFactor) || plan.importExposureFactor <= 0
        || plan.acceptedAt != null || plan.acceptedOfferRef != null || plan.contractSnapshotRef != null || seen.has(plan.planId)) continue;
      const basePlan = (baselineEvent.openImportPlans ?? []).find(candidate => candidate?.planId === plan.planId);
      if (!basePlan || basePlan.status !== 'open' || basePlan.importCurrency !== 'USD'
        || !finite(basePlan.importExposureFactor) || basePlan.importExposureFactor !== plan.importExposureFactor
        || basePlan.acceptedAt != null || basePlan.acceptedOfferRef != null || basePlan.contractSnapshotRef != null) continue;
      seen.add(plan.planId);
      const passThroughPct = clamp(fxChangePct * 0.25 * Math.min(1, plan.importExposureFactor), -2, 2);
      result.push(makeTrace(runState, event, 'fx_imported_inputs', 'openImportProcurementPlanIndex', fxChangePct, 100, 100 + passThroughPct, {
        targetRef: plan.planId, planId: plan.planId, planStatus: 'open_unaccepted',
        importExposureFactor: Math.min(1, plan.importExposureFactor),
        baseCurrency: 'USD', quoteCurrency: 'EUR', quoteUnit: 'EUR_per_USD', quotePerUSD: event.quotePerUSD,
        basePeriod: '2027-01', baseQuotePerUSD: baselineRate, baseQuoteUnit: baselineEvent.quoteUnit,
        baseIndex: baselineEvent.baseIndex, fxSeriesRef: baselineEvent.fxSeriesRef,
        passThroughRate: 0.25, monthlyCapPct: 2, appliedDeltaPct: passThroughPct,
        unit: 'plan_index', assumptionId: V3_MACRO_FX_TEST_FIXTURE,
        invariant: 'open planning only; accepted supplier price snapshot, invoice, BAB, COGS, and inventory value unchanged',
      }));
    }
  }
  return result;
}

function projectExportDistribution(runState, events, period) {
  const result = [];
  const schedules = runState.modules.market.events.filter(event => event.type === 'schedule_week' && event.payload?.weekStart?.slice(0, 7) === period);
  const marketSegments = new Set((runState.modules.market.segments ?? []).map(segment => segment.segmentId));
  const foreignEvents = events.filter(event => event.eventKey === 'foreign_demand' && event.effectivePeriod <= period
    && event.testFixtureId === V3_MACRO_EXPORT_TEST_FIXTURE && event.lagPeriods === 1
    && finite(event.delta) && finite(event.exportExposureFactor) && event.exportExposureFactor > 0
    && Array.isArray(event.exportableSegmentIds) && event.exportableSegmentIds.length > 0 && nonEmpty(event.effectGroupId));
  for (const schedule of schedules) {
    const templates = schedule.payload.templates;
    const trace = templates[0]?.macroDemand;
    const total = templates.length;
    if (!Number.isInteger(total) || total <= 0 || !trace || trace.runId !== runState.runId || trace.scenarioId !== runState.scenarioId) continue;
    const actualMix = templates.map(template => template.foreignDemand).filter(Boolean);
    if (actualMix.length) {
      const mixIdentity = row => ({ ...row, segmentId: null });
      if (actualMix.length !== total || actualMix.some(row => JSON.stringify(mixIdentity(row)) !== JSON.stringify(mixIdentity(actualMix[0])))) continue;
      const actualSegmentCounts = {};
      const baseSegmentCounts = {};
      const requiredCapacityBySegment = {};
      const baseTemplates = buildV3BaseMarketTemplates(schedule.payload.weekStart, runState.seed, trace);
      for (const template of baseTemplates) baseSegmentCounts[template.segmentId] = (baseSegmentCounts[template.segmentId] ?? 0) + 1;
      for (const template of templates) {
        actualSegmentCounts[template.segmentId] = (actualSegmentCounts[template.segmentId] ?? 0) + 1;
        requiredCapacityBySegment[template.segmentId] = (requiredCapacityBySegment[template.segmentId] ?? 0) + template.requiredCapacity;
      }
      const event = foreignEvents.find(item => item.macroEventId === actualMix[0].macroEventId);
      if (event) result.push(makeTrace(runState, event, 'foreign_demand', 'actualD0169SegmentDistribution', event.delta, total, total, {
        targetRef: schedule.payload.weekStart, weekStart: schedule.payload.weekStart,
        fixtureId: actualMix[0].fixtureId, observedPeriod: actualMix[0].observedPeriod,
        exportableSegmentIds: actualMix[0].exportableSegmentIds, segmentScopeRef: actualMix[0].segmentScopeRef,
        exportExposureFactor: actualMix[0].exportExposureFactor,
        baseSegmentCounts, actualSegmentCounts, requiredCapacityBySegment, totalInquiriesBefore: total, totalInquiriesAfter: total,
        appliedShiftPp: actualMix[0].delta * actualMix[0].exportExposureFactor,
        unit: 'inquiry_templates', assumptionId: V3_MACRO_EXPORT_TEST_FIXTURE,
        invariant: 'actual deterministic segment allocation of the unchanged D-0169 total; no extra demand or financial effect',
      }));
      continue;
    }
    const actualCounts = {};
    for (const template of templates) actualCounts[template.segmentId] = (actualCounts[template.segmentId] ?? 0) + 1;
    const allSegments = Object.keys(actualCounts);
    const seenGroups = new Set();
    for (const event of foreignEvents) {
      const exportable = stableOrder([...new Set(event.exportableSegmentIds)].filter(id => nonEmpty(id) && marketSegments.has(id)), runState.seed, schedule.payload.weekStart);
      if (!exportable.length || !nonEmpty(event.segmentScopeRef)) continue;
      const contributionKey = `${event.effectGroupId}|${event.segmentScopeRef}|${schedule.payload.weekStart}`;
      if (seenGroups.has(contributionKey)) continue;
      seenGroups.add(contributionKey);
      const nonExport = stableOrder(allSegments.filter(id => !exportable.includes(id)), runState.seed, `${schedule.payload.weekStart}|domestic`);
      if (!nonExport.length) continue;
      const baseExportShare = allSegments.filter(id => exportable.includes(id)).reduce((sum, id) => sum + actualCounts[id], 0) / total;
      const shiftPp = clamp(event.delta * Math.min(1, event.exportExposureFactor), -5, 5);
      const afterExportShare = clamp(baseExportShare + shiftPp / 100, 0, 1);
      const shares = {};
      const exportBaseTotal = baseExportShare;
      const nonExportBaseTotal = 1 - baseExportShare;
      const allocate = (ids, groupShare, baseGroupShare) => {
        if (!ids.length || groupShare <= 0) return;
        for (const id of ids) {
          const baseWithin = baseGroupShare > 0 ? (actualCounts[id] ?? 0) / total / baseGroupShare : 1 / ids.length;
          shares[id] = groupShare * baseWithin;
        }
      };
      allocate(exportable, afterExportShare, exportBaseTotal);
      allocate(nonExport, 1 - afterExportShare, nonExportBaseTotal);
      const finalId = [...exportable, ...nonExport].find(id => shares[id] != null);
      if (!finalId) continue;
      const sum = Object.values(shares).reduce((a, b) => a + b, 0);
      shares[finalId] += 1 - sum;
      const beforeCounts = Object.fromEntries(allSegments.map(id => [id, (actualCounts[id] / total) * total]));
      const afterExpectedCounts = Object.fromEntries(Object.entries(shares).map(([id, share]) => [id, share * total]));
      result.push(makeTrace(runState, event, 'foreign_demand', 'projectedD0169SegmentDistribution', shiftPp, total, total, {
        targetRef: schedule.payload.weekStart, weekStart: schedule.payload.weekStart,
        exportableSegmentIds: exportable, segmentScopeRef: event.segmentScopeRef,
        exportExposureFactor: Math.min(1, event.exportExposureFactor),
        beforeSegmentCounts: beforeCounts, afterExpectedSegmentCounts: afterExpectedCounts, totalInquiriesBefore: total,
        totalInquiriesAfter: Object.values(afterExpectedCounts).reduce((a, b) => a + b, 0),
        baseExportShare, afterExportShare, appliedShiftPp: afterExportShare * 100 - baseExportShare * 100,
        unit: 'expected_inquiry_equivalents', assumptionId: V3_MACRO_EXPORT_TEST_FIXTURE,
        invariant: 'expected segment allocation only; existing D-0169 inquiry objects, count, awards, and revenue unchanged',
      }));
    }
  }
  return result;
}

function projectDeliveryEta(runState, events, period) {
  const result = [];
  for (const event of events) {
    if (event.eventKey !== 'international_supply' || event.effectivePeriod !== period
      || event.testFixtureId !== V3_MACRO_ETA_TEST_FIXTURE || !nonEmpty(event.effectGroupId)
      || !Array.isArray(event.openShipments)) continue;
    const seen = new Set();
    for (const shipment of event.openShipments) {
      if (!shipment || !nonEmpty(shipment.orderRef) || shipment.status !== 'open'
        || !validDate(shipment.currentEta) || !Number.isInteger(shipment.delayDays) || shipment.delayDays <= 0
        || seen.has(shipment.orderRef)) continue;
      seen.add(shipment.orderRef);
      const days = Math.trunc(clamp(shipment.delayDays, 0, 5));
      if (!days) continue;
      result.push(makeTrace(runState, event, 'international_supply', 'openPurchaseOrderEta', days, shipment.currentEta, shiftCalendarDays(shipment.currentEta, days), {
        targetRef: shipment.orderRef, orderRef: shipment.orderRef, orderStatus: 'open',
        delayDays: days, maximumDelayDays: 5, unit: 'calendar_days', assumptionId: V3_MACRO_ETA_TEST_FIXTURE,
        invariant: 'ETA projection only; physical receipt, quantity, supplier contract, invoice, value and COGS unchanged',
      }));
    }
  }
  return result;
}

function projectImportPriceReference(runState, period) {
  const snapshots = runState.modules.macro.periods.filter(snapshot => snapshot.period === period);
  if (snapshots.length !== 1) return [];
  const sourceEvents = runState.dayEvents.filter(event => event.phase === 'macro_month' && event.result?.period === period);
  if (sourceEvents.length !== 1) return [];
  const sourceEvent = sourceEvents[0];
  let openPayload;
  try { openPayload = JSON.parse(runState.dayOpenFingerprints[sourceEvent.occurredAt]); }
  catch { throw new TypeError('Destatis import-price reference cannot be recovered from the authoritative macro input'); }
  const reference = openPayload?.macroMonthInput?.destatisImportPriceBenchmark ?? null;
  if (!reference) return [];
  const projected = projectV3DestatisImportPriceBenchmark(reference, {
    asOfDate: sourceEvent.occurredAt, runId: runState.runId, scenarioId: runState.scenarioId,
    seed: runState.seed, macroSnapshotId: snapshots[0].sourceSnapshotId,
  });
  return projected ? [projected] : [];
}

/** Project explicitly supplied, replay-bound L2 planning fixtures; never mutate run or finance state. */
export function projectV3MacroTradeImpacts(runState, throughPeriod = null) {
  validateV3RunState(runState);
  if (!runState.modules.macro) throw new TypeError('shared run must contain an authoritative macro module');
  const period = throughPeriod ?? runState.modules.macro.periods.at(-1)?.period ?? null;
  if (!period) return { modelVersion: V3_MACRO_TRADE_IMPACT_VERSION, runId: runState.runId, scenarioId: runState.scenarioId, period: null, effects: [], references: [], directFinanceEffect: false };
  if (!runState.modules.macro.periods.some(snapshot => snapshot.period === period)) throw new TypeError('trade impact period must exist in the macro history');
  const events = authoritativeEvents(runState, period);
  const effects = [
    ...projectFxPlanning(runState, events, period),
    ...projectExportDistribution(runState, events, period),
    ...projectDeliveryEta(runState, events, period),
  ];
  const references = projectImportPriceReference(runState, period);
  const unique = new Set();
  for (const effect of effects) {
    const key = `${effect.effectGroupId}|${effect.target}|${effect.targetRef ?? ''}|${effect.effectivePeriod}`;
    if (unique.has(key)) throw new TypeError('duplicate L2 macro trade contribution');
    unique.add(key);
  }
  if (new Set(references.map(row => row.sourceSnapshotId)).size !== references.length) throw new TypeError('duplicate Destatis import-price reference source snapshot');
  return { modelVersion: V3_MACRO_TRADE_IMPACT_VERSION, runId: runState.runId, scenarioId: runState.scenarioId, period, effects, references, directFinanceEffect: false };
}
