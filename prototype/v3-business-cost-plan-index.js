import { validateV3RunState } from './v3-run-orchestrator.js';
import { V3_COST_PLAN_FIXTURE_ID } from './v3-cost-plan-scenario-fixture.js';

export const V3_BUSINESS_COST_PLAN_INDEX_VERSION = 'V3-BUSINESS-COST-PLAN-INDEX-1';
export const V3_BUSINESS_COST_PLAN_TEST_FIXTURE = V3_COST_PLAN_FIXTURE_ID;

const COMPONENTS = Object.freeze({
  material: new Set(['EUR/kg']),
  energy: new Set(['EUR/kWh']),
  wage: new Set(['EUR/h']),
  logistics: new Set(['EUR/shipment', 'EUR/t-km']),
});
const REQUIRED = Object.keys(COMPONENTS);
const finitePositive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const nextMonth = period => {
  const [year, month] = period.split('-').map(Number);
  return month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, '0')}`;
};
const roundDisplay = value => Math.round(value * 100) / 100;

function validComponent(row, sourceEvent) {
  if (!row || !REQUIRED.includes(row.componentId) || !COMPONENTS[row.componentId].has(row.unit)
    || !finitePositive(row.baseValue) || !finitePositive(row.currentValue)
    || row.basePeriod !== '2027-01' || row.currentPeriod !== sourceEvent.period
    || row.contributionId !== `${row.componentId}|${row.currentPeriod}|${V3_BUSINESS_COST_PLAN_INDEX_VERSION}` || row.lagPeriods !== 1
    || !Array.isArray(row.driverIds) || row.driverIds.length !== 1) return false;
  const driver = row.driverIds[0];
  if (!driver || driver.driverType !== 'raw_component' || driver.componentId !== row.componentId
    || driver.period !== row.currentPeriod || driver.eventKey !== 'business_input_cost_plan'
    || driver.eventRef !== sourceEvent.sourceRef || driver.scopeRef !== `${row.componentId}:${row.currentPeriod}`
    || driver.contributionId !== row.contributionId
    || driver.driverId !== `RAW-COMP|${row.componentId}|${row.currentPeriod}|${sourceEvent.sourceRef}`
    || driver.effectGroupId !== `RAW-COMP|${row.componentId}|${row.currentPeriod}`) return false;
  if (row.sourceType === 'synthetic_fixture') {
    return row.parameterSetId === V3_BUSINESS_COST_PLAN_TEST_FIXTURE
      && nonEmpty(row.sourceRef);
  }
  return row.sourceType === 'observed' && nonEmpty(row.sourceRef)
    && (nonEmpty(row.dataVintage) || nonEmpty(row.sourceSnapshotId)) && nonEmpty(row.observedPeriod);
}

function componentIndexes(event) {
  const validEventSource = event.sourceType === 'synthetic_fixture'
    ? event.testFixtureId === V3_BUSINESS_COST_PLAN_TEST_FIXTURE && event.parameterSetId === V3_BUSINESS_COST_PLAN_TEST_FIXTURE && nonEmpty(event.sourceRef)
    : event.sourceType === 'observed' && nonEmpty(event.sourceRef) && (nonEmpty(event.dataVintage) || nonEmpty(event.sourceSnapshotId)) && nonEmpty(event.observedPeriod);
  if (!validEventSource || event.basePeriod !== '2027-01' || event.baseIndex !== 100 || event.lagPeriods !== 1
    || event.effectivePeriod !== nextMonth(event.period) || !Array.isArray(event.components)) return null;
  const byId = new Map();
  const contributionIds = new Set();
  const driverIds = new Set();
  const effectGroups = new Set();
  for (const row of event.components) {
    if (!validComponent(row, event) || byId.has(row.componentId) || contributionIds.has(row.contributionId)) return null;
    const driver = row.driverIds[0];
    if (driverIds.has(driver.driverId) || effectGroups.has(driver.effectGroupId)) return null;
    byId.set(row.componentId, row);
    contributionIds.add(row.contributionId);
    driverIds.add(driver.driverId);
    effectGroups.add(driver.effectGroupId);
  }
  const weightsProvided = event.weights != null;
  let weights;
  if (weightsProvided) {
    if (!event.weights || typeof event.weights !== 'object' || Array.isArray(event.weights)
      || Object.keys(event.weights).length !== REQUIRED.length
      || REQUIRED.some(id => typeof event.weights[id] !== 'number' || !Number.isFinite(event.weights[id]) || event.weights[id] < 0)
      || Math.abs(REQUIRED.reduce((sum, id) => sum + event.weights[id], 0) - 1) > 1e-10) return null;
    weights = event.weights;
  } else {
    if (event.testFixtureId !== V3_BUSINESS_COST_PLAN_TEST_FIXTURE || event.parameterSetId !== V3_BUSINESS_COST_PLAN_TEST_FIXTURE) return null;
    weights = Object.fromEntries(REQUIRED.map(id => [id, 0.25]));
  }
  return { byId, weights, complete: REQUIRED.every(id => byId.has(id)) };
}

function makeEffect(runState, event, target, before, after, componentRows, status = 'projected', aggregationWeights = {}) {
  return {
    effectId: `PLAN-INDEX|${event.macroEventId}|${target}`,
    runId: runState.runId, scenarioId: runState.scenarioId, seed: runState.seed,
    modelVersion: V3_BUSINESS_COST_PLAN_INDEX_VERSION, parameterSetId: event.parameterSetId ?? event.testFixtureId ?? null,
    sourceType: event.sourceType, sourceRef: event.sourceRef, sourceSnapshotId: event.sourceSnapshotId ?? runState.modules.macro.sourceSnapshotId,
    sourcePeriod: event.period, effectivePeriod: event.effectivePeriod, basePeriod: '2027-01', lagPeriods: 1,
    target, status, before, after, displayAfter: Number.isFinite(after) ? roundDisplay(after) : null,
    componentContributions: componentRows.map(row => ({
      componentId: row.componentId, unit: row.unit, baseValue: row.baseValue, currentValue: row.currentValue,
      componentIndex: 100 * row.currentValue / row.baseValue, contributionId: row.contributionId,
      weight: aggregationWeights[row.componentId] ?? null,
      driverIds: row.driverIds.map(driver => ({ ...driver })),
      sourceType: row.sourceType, sourceRef: row.sourceRef, dataVintage: row.dataVintage ?? null,
    })),
    aggregationWeights: { ...aggregationWeights },
    aggregationRuleId: 'V3-L4-RAW-COMPONENT-INDEX-1',
    accountingClass: 'information_plan', directFinanceEffect: false, actualStateChanged: false,
    invariant: 'planning indexes only; no SPI/CPI substitution, BAB, actual costs, wages, procurement, stock, contract, finance or ledger mutation',
  };
}

/** Pure plan-only L4 indexes from replay-validated explicit macro event history. */
export function projectV3BusinessCostPlanIndexes(runState, throughPeriod = null) {
  validateV3RunState(runState);
  const snapshots = runState.modules.macro?.periods;
  if (!Array.isArray(snapshots)) throw new TypeError('shared run must contain authoritative macro history');
  const period = throughPeriod ?? snapshots.at(-1)?.period ?? null;
  if (!period) return { modelVersion: V3_BUSINESS_COST_PLAN_INDEX_VERSION, period: null, effects: [], directFinanceEffect: false };
  if (!snapshots.some(snapshot => snapshot.period === period)) throw new TypeError('business cost index period must exist in macro history');
  const events = snapshots.flatMap(snapshot => snapshot.effectiveMacroEvents ?? [])
    .filter(event => event.channel === 'external' && event.eventKey === 'business_input_cost_plan'
      && event.effectivePeriod === period && event.period < period
      && event.runId === runState.runId && event.scenarioId === runState.scenarioId);
  if (events.length === 0) return { modelVersion: V3_BUSINESS_COST_PLAN_INDEX_VERSION, runId: runState.runId, scenarioId: runState.scenarioId, period, effects: [], directFinanceEffect: false };
  if (events.length !== 1) return { modelVersion: V3_BUSINESS_COST_PLAN_INDEX_VERSION, runId: runState.runId, scenarioId: runState.scenarioId, period, effects: [], directFinanceEffect: false, pending: ['multiple competing cost-plan source events'] };
  const event = events[0];
  const parsed = componentIndexes(event);
  if (!parsed) return { modelVersion: V3_BUSINESS_COST_PLAN_INDEX_VERSION, runId: runState.runId, scenarioId: runState.scenarioId, period, effects: [], directFinanceEffect: false, pending: ['missing or inconsistent component, unit, period, lag, weight, source, or contribution identifier'] };
  const { byId, weights, complete } = parsed;
  const result = [];
  if (complete) {
    const components = REQUIRED.map(id => byId.get(id));
    const value = components.reduce((sum, row) => sum + weights[row.componentId] * (100 * row.currentValue / row.baseValue), 0);
    result.push(makeEffect(runState, event, 'businessInputCostPlanIndex', 100, value, components, 'projected', weights));
  } else {
    result.push(makeEffect(runState, event, 'businessInputCostPlanIndex', 100, null, [...byId.values()], 'pending'));
  }
  const wage = byId.get('wage');
  if (wage) result.push(makeEffect(runState, event, 'wagePlanIndex', 100, 100 * wage.currentValue / wage.baseValue, [wage], 'projected', { wage: 1 }));
  else result.push(makeEffect(runState, event, 'wagePlanIndex', 100, null, [], 'pending'));
  const material = byId.get('material');
  const logistics = byId.get('logistics');
  if (material && logistics) {
    const subtotalWeight = weights.material + weights.logistics;
    if (subtotalWeight > 0) {
      const procurement = (weights.material * (100 * material.currentValue / material.baseValue)
        + weights.logistics * (100 * logistics.currentValue / logistics.baseValue)) / subtotalWeight;
      result.push(makeEffect(runState, event, 'procurementPlanIndex', 100, procurement, [material, logistics], 'projected', {
        material: weights.material / subtotalWeight, logistics: weights.logistics / subtotalWeight,
      }));
    } else result.push(makeEffect(runState, event, 'procurementPlanIndex', 100, null, [material, logistics], 'pending'));
  } else result.push(makeEffect(runState, event, 'procurementPlanIndex', 100, null, [material, logistics].filter(Boolean), 'pending'));
  return { modelVersion: V3_BUSINESS_COST_PLAN_INDEX_VERSION, runId: runState.runId, scenarioId: runState.scenarioId, period, basePeriod: '2027-01', baseIndex: 100, effects: result, directFinanceEffect: false };
}
