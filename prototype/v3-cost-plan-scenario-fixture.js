// Explicit V3-only L4 scenario input. Synthetic fixture, not market evidence.
export const V3_COST_PLAN_FIXTURE_ID = 'V3-PLAN-INDEX-SYNTH-EQUAL-1';
export const V3_COST_PLAN_SCENARIO_NEUTRAL = 'NEUTRAL';

const UNITS = Object.freeze({ material: 'EUR/kg', energy: 'EUR/kWh', wage: 'EUR/h', logistics: 'EUR/shipment' });
// Hand-calculated teaching vector: BICI=(100+110+110+120)/4=110;
// procurement=(100+120)/2=110 after material/logistics subweight normalization;
// wage=110. These are synthetic plan inputs, not observed market facts.
const VALUES = Object.freeze({ material: 100, energy: 110, wage: 110, logistics: 120 });

export function buildSyntheticCostPlanChannel(period) {
  if (period !== '2027-01') throw new TypeError('The selected synthetic cost-plan fixture is a January 2027 input only.');
  const sourceRef = 'fixture:business-cost-plan:2027-01';
  const parameterSetId = V3_COST_PLAN_FIXTURE_ID;
  const components = Object.keys(UNITS).map(componentId => {
    const contributionId = `${componentId}|2027-01|V3-BUSINESS-COST-PLAN-INDEX-1`;
    return {
      componentId, unit: UNITS[componentId], baseValue: 100, currentValue: VALUES[componentId],
      basePeriod: '2027-01', currentPeriod: '2027-01', lagPeriods: 1, contributionId,
      sourceType: 'synthetic_fixture', sourceRef: `fixture:${parameterSetId}:${componentId}:2027-01`, parameterSetId,
      driverIds: [{
        driverId: `RAW-COMP|${componentId}|2027-01|${sourceRef}`,
        driverType: 'raw_component', componentId, period: '2027-01', eventKey: 'business_input_cost_plan',
        eventRef: sourceRef, scopeRef: `${componentId}:2027-01`,
        effectGroupId: `RAW-COMP|${componentId}|2027-01`, contributionId,
      }],
    };
  });
  return {
    sourceType: 'synthetic_fixture', sourceRef, testFixtureId: V3_COST_PLAN_FIXTURE_ID, parameterSetId,
    basePeriod: '2027-01', baseIndex: 100, lagPeriods: 1, effectiveFrom: '2027-01-01',
    weights: { material: .25, energy: .25, wage: .25, logistics: .25 }, components,
    unit: 'index', value: 100, uncertaintyBand: { low: -1, base: 0, high: 1 },
    firmExposure: 'synthetic cost-plan components', expectedOutcome: 'synthetic_fixture_only',
  };
}
