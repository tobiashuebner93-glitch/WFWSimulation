import assert from 'node:assert/strict';
import { calculateV3OfferPlanSensitivity } from './v3-offer-plan-sensitivity.js';

const procurement = {
  effectId: 'PLAN-1|procurementPlanIndex', runId: 'R', scenarioId: 'S', seed: 'seed',
  modelVersion: 'V3-BUSINESS-COST-PLAN-INDEX-1', parameterSetId: 'fixture-1',
  sourceType: 'synthetic_fixture', sourceRef: 'fixture:jan-2027', sourceSnapshotId: 'snapshot-1',
  sourcePeriod: '2027-01', effectivePeriod: '2027-02', basePeriod: '2027-01', lagPeriods: 1,
  target: 'procurementPlanIndex', status: 'projected', before: 100, after: 110,
  accountingClass: 'information_plan', directFinanceEffect: false, actualStateChanged: false,
  componentContributions: [
    { componentId: 'material', unit: 'EUR/kg', baseValue: 100, currentValue: 120, componentIndex: 120, contributionId: 'material-jan', sourceType: 'synthetic_fixture', sourceRef: 'fixture:jan-2027', driverIds: [{ driverId: 'mat-driver', driverType: 'raw_component', componentId: 'material', period: '2027-01', eventRef: 'fixture:jan-2027', contributionId: 'material-jan', effectGroupId: 'mat-group' }] },
    { componentId: 'logistics', unit: 'EUR/shipment', baseValue: 100, currentValue: 100, componentIndex: 100, contributionId: 'logistics-jan', sourceType: 'synthetic_fixture', sourceRef: 'fixture:jan-2027', driverIds: [{ driverId: 'log-driver', driverType: 'raw_component', componentId: 'logistics', period: '2027-01', eventRef: 'fixture:jan-2027', contributionId: 'logistics-jan', effectGroupId: 'log-group' }] },
  ],
  aggregationWeights: { material: 0.5, logistics: 0.5 }, aggregationRuleId: 'V3-L4-RAW-COMPONENT-INDEX-1',
};
const wage = {
  ...procurement, effectId: 'PLAN-1|wagePlanIndex', target: 'wagePlanIndex', after: 90,
  componentContributions: [{ componentId: 'wage', unit: 'EUR/h', baseValue: 100, currentValue: 90, componentIndex: 90, contributionId: 'wage-jan', sourceType: 'synthetic_fixture', sourceRef: 'fixture:jan-2027', driverIds: [{ driverId: 'wage-driver', driverType: 'raw_component', componentId: 'wage', period: '2027-01', eventRef: 'fixture:jan-2027', contributionId: 'wage-jan', effectGroupId: 'wage-group' }] }],
  aggregationWeights: { wage: 1 },
};
const costs = [
  { id: 'm', amountCents: 1001, variable: true, category: 'material', basePeriod: '2027-01' },
  { id: 'l', amountCents: 1001, variable: true, category: 'logistics', basePeriod: '2027-01' },
  { id: 'w', amountCents: 1001, variable: true, category: 'labor', basePeriod: '2027-01' },
  { id: 'o', amountCents: 1001, variable: false, category: 'other', basePeriod: '2027-01' },
];
const untouched = JSON.stringify(costs);
const oldPath = calculateV3OfferPlanSensitivity({ directCosts: costs, mode: 'unadjusted', offerPeriod: '2027-02' });
assert.equal(JSON.stringify(oldPath.directCosts), untouched, 'legacy unadjusted costs remain byte-equivalent');
assert.equal(oldPath.evidence.directFinanceEffect, false);

const selected = calculateV3OfferPlanSensitivity({ directCosts: costs, mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: [procurement, wage] });
assert.equal(selected.status, 'ready');
assert.deepEqual(selected.directCosts.map(row => row.amountCents), [1101, 1101, 901, 1001]);
assert.deepEqual(selected.directCosts.map(row => row.appliedIndexTarget), ['procurementPlanIndex', 'procurementPlanIndex', 'wagePlanIndex', null]);
assert.equal(selected.directCosts[0].baseAmountCents, 1001);
assert.equal(selected.evidence.indexes.length, 2, 'BICI is not applied as an additional index');
assert.equal(JSON.stringify(costs), untouched, 'calculation does not mutate base costs');
assert.equal(selected.evidence.directFinanceEffect, false);

const halfUp = calculateV3OfferPlanSensitivity({
  directCosts: [{ id: 'half', amountCents: 1, variable: true, category: 'material', basePeriod: '2027-01' }],
  mode: 'apply_l4_plan_indices', offerPeriod: '2027-02',
  effects: [{ ...procurement, after: 150, componentContributions: procurement.componentContributions.map(row => row.componentId === 'material' ? { ...row, currentValue: 200, componentIndex: 200 } : row) }],
});
assert.equal(halfUp.directCosts[0].amountCents, 2, 'half-cent rounds up per line');

const pending = calculateV3OfferPlanSensitivity({
  directCosts: [costs[0]], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: [],
});
assert.equal(pending.status, 'pending', 'missing selected index is not silently treated as 100 or unadjusted');
assert.equal(pending.directCosts, null);
assert.throws(() => calculateV3OfferPlanSensitivity({ directCosts: [{ ...costs[0], amountCents: -1 }], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: [procurement] }), /nonnegative safe integer/);
assert.throws(() => calculateV3OfferPlanSensitivity({ directCosts: [{ ...costs[0], amountCents: Number.MAX_SAFE_INTEGER + 1 }], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: [procurement] }), /nonnegative safe integer/);
assert.throws(() => calculateV3OfferPlanSensitivity({ directCosts: [{ ...costs[0], category: 'mixed' }], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: [procurement] }), /category/);
assert.throws(() => calculateV3OfferPlanSensitivity({ directCosts: [{ ...costs[0], basePeriod: '2027-02' }], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: [procurement] }), /basePeriod/);
assert.throws(() => calculateV3OfferPlanSensitivity({ directCosts: costs, mode: 'automatic', offerPeriod: '2027-02' }), /mode/);

const ambiguous = calculateV3OfferPlanSensitivity({
  directCosts: [costs[0]], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02',
  effects: [procurement, { ...procurement, effectId: 'PLAN-2|procurementPlanIndex' }],
});
assert.equal(ambiguous.status, 'pending', 'competing index evidence fails closed');
const badProvenance = calculateV3OfferPlanSensitivity({
  directCosts: [costs[0]], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02',
  effects: [{ ...procurement, sourceRef: '' }],
});
assert.equal(badProvenance.status, 'pending', 'missing provenance fails closed');
const incompleteComponents = calculateV3OfferPlanSensitivity({
  directCosts: [costs[0]], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02',
  effects: [{ ...procurement, componentContributions: [procurement.componentContributions[0]] }],
});
assert.equal(incompleteComponents.status, 'pending', 'the exported calculation API rejects an incomplete procurement component set');
const incompleteDrivers = calculateV3OfferPlanSensitivity({
  directCosts: [costs[0]], mode: 'apply_l4_plan_indices', offerPeriod: '2027-02',
  effects: [{ ...procurement, componentContributions: procurement.componentContributions.map(row => ({ ...row, driverIds: [] })) }],
});
assert.equal(incompleteDrivers.status, 'pending', 'the exported calculation API rejects missing raw component drivers');

// The selected snapshot is plain serializable evidence; a later replacement of
// the source index cannot mutate it or recompute the already used cost lines.
const submittedSnapshot = JSON.parse(JSON.stringify({ netPriceCents: 5000, planSensitivity: selected }));
const laterEffects = [{ ...procurement, after: 500 }, { ...wage, after: 500 }];
calculateV3OfferPlanSensitivity({ directCosts: costs, mode: 'apply_l4_plan_indices', offerPeriod: '2027-02', effects: laterEffects });
assert.equal(submittedSnapshot.planSensitivity.directCosts[0].amountCents, 1101);
assert.equal(submittedSnapshot.netPriceCents, 5000, 'R remains unchanged');

console.log('V3 offer plan sensitivity regressions: PASS');
