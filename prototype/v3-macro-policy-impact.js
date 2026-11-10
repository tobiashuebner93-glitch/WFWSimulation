import { validateV3MacroState } from './v3-macro-simulation.js';
import { validateV3RunState } from './v3-run-orchestrator.js';

export const V3_MACRO_POLICY_IMPACT_VERSION = 'V3-MACRO-POLICY-PLAN-1';
export const V3_MACRO_POLICY_IMPACT_PARAMETERS = 'V3-MACRO-POLICY-SYNTHETIC-CAPS-1';

const CHANNELS = Object.freeze({
  fiscal: { target: 'publicTenderOpportunityIndex', unit: '%', cap: 2, scope: 'publicSegmentRef' },
  growth: { target: 'longRunPotentialCapacityIndex', unit: '%', cap: 2, scope: 'adoptionRef', positiveOnly: true },
  tariff: { target: 'futureWagePlanIndex', unit: '%', cap: 2, scope: 'coveredEmployeeScopeRef' },
  labor_market: { target: 'candidateAvailabilityIndex', unit: '%', cap: 5, scope: 'skillScopeRef' },
  environmental: { target: 'processResourceIntensityIndex', unit: '%', cap: 2, scope: 'adoptionRef', requiresAsset: true },
  demand_oriented: { target: 'segmentInquiryShareShift', unit: 'percentage_points', cap: 5, scope: 'segmentScopeRef' },
  supply_oriented: { target: 'unitResourceRequirementIndex', unit: '%', cap: 2, scope: 'adoptionRef', negativeOnly: true },
});

const finite = value => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const REFERENCE_KEYS = Object.freeze([
  'publicSegmentRef', 'segmentScopeRef', 'segmentId', 'adoptionRef', 'assetScopeRef',
  'coveredEmployeeScopeRef', 'skillScopeRef', 'scopeId', 'scopeRef', 'eventId',
]);
const assertOptionalReference = (event, key) => {
  const value = event[key];
  if (value != null && (typeof value !== 'string' || !value.trim())) throw new TypeError(`macro policy ${key} must be a non-empty string`);
};

/**
 * Pure projection from the validated macro event history. It describes only
 * scenario planning indicators; it never mutates the run or finance state.
 * Numeric exposure and operational scope are opt-in inputs. Missing either
 * leaves that event neutral.
 */
export function projectV3MacroPolicyImpacts(runState, throughPeriod = null) {
  validateV3RunState(runState);
  const macroState = runState?.modules?.macro;
  if (!macroState) throw new TypeError('shared run must contain an authoritative macro module');
  validateV3MacroState(macroState);
  const lastPeriod = macroState.periods.at(-1)?.period ?? null;
  const period = throughPeriod ?? lastPeriod;
  if (!period) return { modelVersion: V3_MACRO_POLICY_IMPACT_VERSION, parameterSetId: V3_MACRO_POLICY_IMPACT_PARAMETERS, runId: macroState.runId, scenarioId: macroState.scenarioId, period: null, effects: [], targets: {}, directFinanceEffect: false };
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period) || !macroState.periods.some(row => row.period === period)) throw new TypeError('projection period must exist in the macro snapshot history');

  const events = new Map();
  for (const snapshot of macroState.periods) {
    if (snapshot.period > period) continue;
    for (const event of snapshot.effectiveMacroEvents ?? []) {
      if (event.channel === 'policy' && event.effectivePeriod <= period && CHANNELS[event.eventKey]) {
        for (const key of REFERENCE_KEYS) assertOptionalReference(event, key);
        for (const key of ['macroEventId', 'eventKey', 'runId', 'scenarioId', 'seed', 'modelVersion', 'sourceType', 'sourceRef']) {
          if (typeof event[key] !== 'string' || !event[key].trim()) throw new TypeError(`macro policy ${key} must be a non-empty string`);
        }
        for (const key of ['sourceSnapshotId', 'targetExposure', 'firmExposure', 'effectGroupId', 'intermediateIndicator', 'parameterSetId', 'unit']) assertOptionalReference(event, key);
        events.set(event.macroEventId, event);
      }
    }
  }

  const effects = [];
  const seenGroups = new Set();
  const targetTotals = {};
  for (const event of [...events.values()].sort((a, b) => a.effectivePeriod.localeCompare(b.effectivePeriod) || a.macroEventId.localeCompare(b.macroEventId))) {
    const rule = CHANNELS[event.eventKey];
    const scopeRef = event[rule.scope];
    const exposure = event.firmExposureFactor;
    if (event.effectEligible === false || !event.effectGroupId || !scopeRef || !finite(exposure) || exposure <= 0 || !finite(event.delta)) continue;
    if (rule.requiresAsset && !event.assetScopeRef) continue;
    const groupKey = `${event.effectGroupId}|${rule.target}`;
    if (seenGroups.has(groupKey)) continue;
    seenGroups.add(groupKey);
    let contribution = event.delta * exposure;
    if (rule.positiveOnly) contribution = Math.max(0, contribution);
    if (rule.negativeOnly) contribution = Math.min(0, contribution);
    contribution = clamp(contribution, -rule.cap, rule.cap);
    const before = targetTotals[rule.target] ?? (rule.target === 'segmentInquiryShareShift' ? 0 : 100);
    const after = before + contribution;
    targetTotals[rule.target] = after;
    effects.push({
      effectId: `POLICY-IMPACT|${event.macroEventId}|${rule.target}`,
      runId: macroState.runId, scenarioId: macroState.scenarioId,
      modelVersion: V3_MACRO_POLICY_IMPACT_VERSION, parameterSetId: V3_MACRO_POLICY_IMPACT_PARAMETERS,
      channel: event.eventKey, sourceType: event.sourceType, sourceRef: event.sourceRef,
      sourceSnapshotId: event.sourceSnapshotId ?? macroState.sourceSnapshotId,
      observedPeriod: event.observedPeriod ?? null, effectivePeriod: event.effectivePeriod,
      lagPeriods: event.lagPeriods, target: rule.target, scopeRef, effectGroupId: event.effectGroupId,
      unit: rule.unit, exposureFactor: exposure, inputDelta: event.delta,
      before, after, contribution, accountingClass: 'information_plan', directFinanceEffect: false,
      actualStateChanged: false,
      invariant: rule.target === 'segmentInquiryShareShift'
        ? 'D-0169 total inquiries unchanged; segment opportunity share only'
        : 'plan/opportunity/resource indicator only; no actual capacity, contract, cost, or ledger mutation',
    });
  }
  return {
    modelVersion: V3_MACRO_POLICY_IMPACT_VERSION, parameterSetId: V3_MACRO_POLICY_IMPACT_PARAMETERS,
    runId: macroState.runId, scenarioId: macroState.scenarioId, period,
    effects, targets: targetTotals, directFinanceEffect: false,
  };
}
