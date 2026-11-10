import { validateV3MacroState, V3_T0071_MRO_SHOCK_FIXTURE_ID } from './v3-macro-simulation.js';

export const V3_T0071_MRO_OPERATING_IMPACT_VERSION = 'V3-T0071-MRO-OPERATING-PLAN-1';
const SHOCK_EVENT_KEY = 't0071_exogenous_mro_shock';
const DOWNSTREAM_LAG_PERIODS = 1;
const INDEX_POINTS_PER_MRO_PP = 1;
const MAX_ABSOLUTE_INDEX_SHIFT = 2;
const monthIndex = period => Number(period.slice(0, 4)) * 12 + Number(period.slice(5, 7)) - 1;
const periodAt = index => `${Math.floor(index / 12).toString().padStart(4, '0')}-${String(index % 12 + 1).padStart(2, '0')}`;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

/**
 * Read-only downstream operating-plan indicator for the T-0071 synthetic MRO
 * event. The extra one-month lag is a directional test assumption, not an ECB
 * estimate. It does not change production, investment, finance, or contracts.
 */
export function projectV3MroOperatingImpact(macroState, period) {
  validateV3MacroState(macroState);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period ?? '') || !macroState.periods.some(row => row.period === period)) throw new TypeError('period must identify an existing macro snapshot');
  const effects = [];
  const seen = new Set();
  for (const event of macroState.events) {
    if (event.eventKey !== SHOCK_EVENT_KEY || event.fixtureId !== V3_T0071_MRO_SHOCK_FIXTURE_ID) continue;
    const effectivePeriod = periodAt(monthIndex(event.effectivePeriod) + DOWNSTREAM_LAG_PERIODS);
    if (effectivePeriod !== period) continue;
    if (event.channel !== 'mro' || event.sourceType !== 'synthetic_fixture' || event.sourceRef !== 'synthetic-fixture:T-0071:exogenous-mro-direction-pair'
      || event.runId !== macroState.runId || event.scenarioId !== macroState.scenarioId || event.lagPeriods !== 1
      || !event.effectGroupId || !['hike', 'cut'].includes(event.direction)
      || !Number.isFinite(event.deltaPp) || event.deltaPp !== (event.direction === 'hike' ? 0.5 : -0.5)) continue;
    const key = `${event.effectGroupId}|investmentPlanIndex|${period}`;
    if (seen.has(key)) throw new TypeError('duplicate T-0071 downstream MRO contribution');
    seen.add(key);
    const rawShift = -event.deltaPp * INDEX_POINTS_PER_MRO_PP;
    const appliedShift = clamp(rawShift, -MAX_ABSOLUTE_INDEX_SHIFT, MAX_ABSOLUTE_INDEX_SHIFT);
    effects.push({
      effectId: `T0071-OPERATING|${event.macroEventId}|investmentPlanIndex|${period}`,
      runId: macroState.runId, scenarioId: macroState.scenarioId, seed: macroState.seed,
      modelVersion: V3_T0071_MRO_OPERATING_IMPACT_VERSION,
      fixtureId: V3_T0071_MRO_SHOCK_FIXTURE_ID,
      channel: 'mro', target: 'investmentPlanIndex', unit: 'index_points',
      sourceType: event.sourceType, sourceRef: event.sourceRef,
      sourceEventId: event.macroEventId, sourceEffectGroupId: event.effectGroupId,
      observedPeriod: event.observedPeriod, mroEffectivePeriod: event.effectivePeriod,
      effectivePeriod, mroLagPeriods: event.lagPeriods, downstreamLagPeriods: DOWNSTREAM_LAG_PERIODS,
      totalLagPeriods: event.lagPeriods + DOWNSTREAM_LAG_PERIODS,
      mroDeltaPp: event.deltaPp, direction: event.direction,
      before: 100, after: 100 + appliedShift, appliedShift,
      parameterSetId: 'T0071-synthetic-operating-sensitivity-v1',
      coefficientIndexPointsPerMroPp: INDEX_POINTS_PER_MRO_PP,
      capIndexPoints: MAX_ABSOLUTE_INDEX_SHIFT,
      targetExposure: 'synthetic-new-investment-plan-sensitivity',
      assumptionStatus: 'synthetic_uncalibrated', accountingClass: 'information_plan',
      directFinanceEffect: false, actualStateChanged: false,
      invariant: 'plan indicator only; no investment decision, production, credit contract, finance state, cash, inventory, or ledger mutation',
    });
  }
  if (effects.length > 1) throw new TypeError('T-0071 fixture permits one investment-plan effect per period');
  const index = effects.length ? effects[0].after : 100;
  return {
    modelVersion: V3_T0071_MRO_OPERATING_IMPACT_VERSION,
    runId: macroState.runId, scenarioId: macroState.scenarioId, period,
    investmentPlanIndex: index, effects,
    directFinanceEffect: false, actualStateChanged: false,
    assumption: {
      status: 'synthetic_uncalibrated', downstreamLagPeriods: DOWNSTREAM_LAG_PERIODS,
      coefficientIndexPointsPerMroPp: INDEX_POINTS_PER_MRO_PP, capIndexPoints: MAX_ABSOLUTE_INDEX_SHIFT,
      sourceRef: 'synthetic-fixture:T-0071:qualitative-rate-to-investment-plan-direction',
    },
  };
}
