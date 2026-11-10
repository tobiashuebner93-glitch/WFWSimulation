// Explicitly synthetic V3-only demand transmission. No finance or legacy imports.
export const V3_MACRO_DEMAND_MODEL_VERSION = 'V3-MACRO-DEMAND-D0169-1';
export const V3_MACRO_DEMAND_SOURCE_REF = 'D-0169:synthetic-macro-demand';
export const V3_MACRO_DEMAND_BASE_WEEKLY_INQUIRIES = 5;
export const V3_MACRO_DEMAND_CAP = Object.freeze({ min: 0.9, max: 1.1 });

const fail = message => Object.assign(new TypeError(message), { code: 'invalid_macro_demand' });
const finite = (value, label) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw fail(`${label} must be finite`);
};
const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw fail(`${label} is required`);
};
const hash32 = text => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function calculateV3MacroDemand({ activityGapPct, activitySourceType = 'synthetic_fixture', activitySourceRef = 'synthetic-fixture:activity-gap', exposure = 0, macroSnapshotId, macroSnapshotPeriod, seed, runId, scenarioId, weekStart }) {
  requiredString(seed, 'seed');
  requiredString(runId, 'runId');
  requiredString(scenarioId, 'scenarioId');
  if (typeof weekStart !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) throw fail('weekStart must be an ISO calendar date');
  finite(exposure, 'exposure');
  if (exposure < 0 || exposure > 1) throw fail('exposure must be between 0 and 1');
  requiredString(activitySourceType, 'activitySourceType');
  requiredString(activitySourceRef, 'activitySourceRef');
  const activeGap = activityGapPct == null ? 0 : activityGapPct;
  finite(activeGap, 'activityGapPct');

  const demandIndex = 100 + activeGap;
  const unexposedFactor = clamp(demandIndex / 100, V3_MACRO_DEMAND_CAP.min, V3_MACRO_DEMAND_CAP.max);
  const demandFactor = 1 + (unexposedFactor - 1) * exposure;
  const expectedInquiryCount = V3_MACRO_DEMAND_BASE_WEEKLY_INQUIRIES * demandFactor;
  const wholeInquiries = Math.floor(expectedInquiryCount);
  const fractionalRemainder = expectedInquiryCount - wholeInquiries;
  // Matched random draw keys keep scenario pairs comparable; only their
  // explicit demand factor differs when the macro gap changes.
  const drawKey = `${V3_MACRO_DEMAND_MODEL_VERSION}|${seed}|${weekStart}|weekly-count`;
  const fractionalDraw = hash32(drawKey) / 4294967296;
  const realizedInquiryCount = wholeInquiries + (fractionalDraw < fractionalRemainder ? 1 : 0);

  return {
    modelVersion: V3_MACRO_DEMAND_MODEL_VERSION,
    decisionRef: 'D-0169',
    sourceType: 'synthetic_scenario_assumption',
    sourceRef: V3_MACRO_DEMAND_SOURCE_REF,
    weekStart,
    activityGapPct: activeGap,
    activitySourceType,
    activitySourceRef,
    runId,
    scenarioId,
    ...(macroSnapshotId == null ? {} : { macroSnapshotId }),
    ...(macroSnapshotPeriod == null ? {} : { macroSnapshotPeriod }),
    demandIndex,
    exposure,
    demandFactor,
    appliedCap: { ...V3_MACRO_DEMAND_CAP },
    baseWeeklyInquiryCount: V3_MACRO_DEMAND_BASE_WEEKLY_INQUIRIES,
    expectedInquiryCount,
    fractionalRemainder,
    fractionalDraw,
    realizedInquiryCount,
    drawKey,
    calibrated: false,
  };
}

export function validateV3MacroDemandTrace(trace, { seed, runId, scenarioId, weekStart } = {}) {
  try {
    for (const [key, value] of Object.entries({ seed, runId, scenarioId })) requiredString(value, key);
    if (!trace || typeof trace !== 'object' || Array.isArray(trace)) throw fail('trace is required');
    if (trace.modelVersion !== V3_MACRO_DEMAND_MODEL_VERSION || trace.decisionRef !== 'D-0169' || trace.sourceType !== 'synthetic_scenario_assumption' || trace.sourceRef !== V3_MACRO_DEMAND_SOURCE_REF || trace.calibrated !== false) throw fail('unsupported or mislabelled macro-demand trace');
    const expected = calculateV3MacroDemand({ activityGapPct: trace.activityGapPct, activitySourceType: trace.activitySourceType, activitySourceRef: trace.activitySourceRef, exposure: trace.exposure, macroSnapshotId: trace.macroSnapshotId, macroSnapshotPeriod: trace.macroSnapshotPeriod, seed, runId, scenarioId, weekStart });
    if (JSON.stringify(trace) !== JSON.stringify(expected)) throw fail('macro-demand trace does not match its deterministic D-0169 calculation');
    return true;
  } catch (error) {
    throw Object.assign(new TypeError(error.message), { code: 'invalid_macro_demand' });
  }
}
