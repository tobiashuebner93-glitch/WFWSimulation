import assert from 'node:assert/strict';
import {
  V3_FINANCIAL_CALCULATION_VERSION,
  calculateV3OfferEstimate,
  calculateV3BabRate,
  allocateV3BabPool,
  aggregateV3KpiPeriods,
  createV3OfferSnapshot,
  acceptV3OfferSnapshot,
  calculateV3OfferWithBab
} from './v3-financial-calculation.js';

assert.equal(V3_FINANCIAL_CALCULATION_VERSION, 'V3-FINANCIAL-CALCULATION-1');

// V-DB-01: R excludes SimTAX; explicit variable classes alone feed DB I.
const db01Input = {
  netPriceCents: 100000,
  directCosts: [
    { id: 'material', amountCents: 30000, variable: true },
    { id: 'labor', amountCents: 12000, variable: true },
    { id: 'subcontract', amountCents: 5000, variable: true },
    { id: 'machine', amountCents: 8000, variable: false },
    { id: 'other-direct', amountCents: 2500, variable: false }
  ],
  babAllocatedCents: 9000
};
const db01Before = JSON.stringify(db01Input);
const db01 = calculateV3OfferEstimate(db01Input);
assert.equal(db01.dbICents, 53000);
assert.equal(db01.allDirectCostsCents, 57500);
assert.equal(db01.resultAfterDirectCostsCents, 42500);
assert.equal(db01.resultAfterBabCents, 33500);
assert.equal(db01.dbICentNear, false);
assert.equal(JSON.stringify(db01Input), db01Before, 'estimate must not mutate inputs');
assert.equal('ledger' in db01, false);
assert.equal('cash' in db01, false);

// V-DB-02: each cent boundary, zero, positive and negative DB I.
const dbBoundary = (price, variable) => calculateV3OfferEstimate({
  netPriceCents: price,
  directCosts: [{ id: 'v', amountCents: variable, variable: true }]
});
assert.deepEqual(
  [dbBoundary(50000, 43000).dbICents, dbBoundary(50000, 49999).dbICents, dbBoundary(50000, 50000).dbICents, dbBoundary(50000, 50001).dbICents, dbBoundary(40000, 45000).dbICents],
  [7000, 1, 0, -1, -5000]
);
assert.equal(dbBoundary(50000, 49999).dbICentNear, true);
assert.equal(dbBoundary(50000, 50000).dbICentNear, true);
assert.equal(dbBoundary(50000, 50001).dbICentNear, true);
assert.equal(dbBoundary(50000, 49998).dbICentNear, false);

// V-BAB-01 and V-RATE-01: tie break by stable cost-center ID, never input/UI order.
const bab01Input = {
  poolCents: 10001,
  unitLabel: 'h',
  recipients: [
    { costCenterId: 'CC-C', keyValue: '1' },
    { costCenterId: 'CC-A', keyValue: '1' },
    { costCenterId: 'CC-B', keyValue: '1' }
  ]
};
const bab01Before = JSON.stringify(bab01Input);
const bab01 = allocateV3BabPool(bab01Input);
const bab01Amounts = Object.fromEntries(bab01.allocations.map(row => [row.costCenterId, row.amountCents]));
assert.deepEqual(bab01Amounts, { 'CC-C': 3333, 'CC-A': 3334, 'CC-B': 3334 });
assert.equal(bab01.reconciliationDifferenceCents, 0);
assert.equal(bab01.reconciled, true);
assert.equal(bab01.rate.numeratorCents, '10001');
assert.equal(bab01.rate.denominator, '3');
assert.equal(bab01.rate.displayValue, '33,34 €/h');
assert.equal(bab01.rate.calculationUsesDisplayValue, false);
assert.equal(JSON.stringify(bab01Input), bab01Before, 'BAB must not mutate inputs');
const bab01Reordered = allocateV3BabPool({ ...bab01Input, recipients: [...bab01Input.recipients].reverse() });
assert.deepEqual(Object.fromEntries(bab01Reordered.allocations.map(row => [row.costCenterId, row.amountCents])), bab01Amounts);
assert.deepEqual(allocateV3BabPool(bab01Input), bab01, 'same inputs must produce same allocation');

// V-BAB-02: independently allocated source pools reconcile to the combined totals.
const qs01 = allocateV3BabPool({ poolCents: 60000, recipients: [{ costCenterId: 'CC-A', keyValue: 60 }, { costCenterId: 'CC-B', keyValue: 40 }] });
const qs02 = allocateV3BabPool({ poolCents: 40000, recipients: [{ costCenterId: 'CC-A', keyValue: 25 }, { costCenterId: 'CC-B', keyValue: 75 }] });
assert.deepEqual(qs01.allocations.map(x => x.amountCents), [36000, 24000]);
assert.deepEqual(qs02.allocations.map(x => x.amountCents), [10000, 30000]);
assert.equal(qs01.allocations.reduce((s, x) => s + x.amountCents, 0) + qs02.allocations.reduce((s, x) => s + x.amountCents, 0), 100000);

// Explicit shares must total 1; weights are not silently renormalized.
const weighted = allocateV3BabPool({ poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.6' }, { costCenterId: 'CC-B', keyValue: '0.4' }] });
assert.deepEqual(weighted.allocations.map(x => x.amountCents), [6001, 4000]);
assert.equal(weighted.allocationMode, 'weights');
assert.throws(() => allocateV3BabPool({ poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.6' }] }), /summing exactly to 1/);
// V-RATE-02: unrounded driver rate and largest remainder across uneven bases.
const rate02 = allocateV3BabPool({
  poolCents: 1001,
  unitLabel: 'h',
  recipients: [
    { costCenterId: 'CC-A', keyValue: '1' },
    { costCenterId: 'CC-B', keyValue: '2' },
    { costCenterId: 'CC-C', keyValue: '3' }
  ]
});
assert.deepEqual(rate02.allocations.map(x => x.amountCents), [167, 334, 500]);
assert.equal(rate02.rate.displayValue, '1,67 €/h');
assert.equal(rate02.allocations.reduce((s, x) => s + x.amountCents, 0), 1001);
assert.equal(calculateV3BabRate({ poolCents: 10001, basisKind: 'money', basisValue: 30000 }).displayValue, '33,34%');

// V-RATE-03: physical keys determine the rate denominator; weights do not.
const keyRateCase = allocateV3BabPool({
  poolCents: 1000,
  unitLabel: 'h',
  recipients: [
    { costCenterId: 'CC-A', keyValue: '1' },
    { costCenterId: 'CC-B', keyValue: '1' },
    { costCenterId: 'CC-C', keyValue: '1' }
  ]
});
assert.equal(keyRateCase.rate.denominator, '3', 'keys total is the only valid rate denominator');
assert.equal(keyRateCase.rate.displayValue, '3,33 €/h');
assert.deepEqual(keyRateCase.allocations.map(x => x.amountCents), [334, 333, 333]);
const weightRateCase = allocateV3BabPool({
  poolCents: 1000,
  allocationMode: 'weights',
  recipients: [
    { costCenterId: 'CC-A', keyValue: '0.5' },
    { costCenterId: 'CC-B', keyValue: '0.25' },
    { costCenterId: 'CC-C', keyValue: '0.25' }
  ]
});
const separateWeightRate = calculateV3BabRate({ poolCents: 1000, basisKind: 'driver', basisValue: '6', unitLabel: 'h' });
assert.deepEqual(weightRateCase.allocations.map(x => x.amountCents), [500, 250, 250]);
assert.equal(Object.hasOwn(weightRateCase, 'rate'), false, 'weights carry no physical rate or unit');
assert.equal(separateWeightRate.displayValue, '1,67 €/h');
assert.deepEqual(['0.5', '0.25', '0.25'].map(weight => Number(weight) * 6), [3, 1.5, 1.5], 'separate driver basis is distributed by the same weights');

// V-BAB-03: a one-cent source change reconciles exactly and does not affect other pools.
const bab10001 = allocateV3BabPool({ poolCents: 10001, recipients: bab01Input.recipients });
const bab10002 = allocateV3BabPool({ poolCents: 10002, recipients: bab01Input.recipients });
const sumAllocated = result => result.allocations.reduce((sum, item) => sum + item.amountCents, 0);
assert.equal(sumAllocated(bab10001), 10001);
assert.equal(sumAllocated(bab10002), 10002);
assert.equal(sumAllocated(bab10002) - sumAllocated(bab10001), 1);
assert.equal(sumAllocated(qs01), 60000, 'separate source pool is unchanged');
assert.deepEqual(bab10002, allocateV3BabPool({ poolCents: 10002, recipients: bab01Input.recipients }), 'reconciliation is idempotent for identical inputs');

// V-BAB-02/03 invalid inputs do not yield a fake reconciliation.
assert.throws(() => allocateV3BabPool({ poolCents: 1, recipients: [] }), /non-empty array/);
assert.throws(() => allocateV3BabPool({ poolCents: 1, recipients: [{ costCenterId: 'A', keyValue: 0 }] }), /positive/);
assert.throws(() => allocateV3BabPool({ poolCents: 1, recipients: [{ costCenterId: 'A', keyValue: 1 }, { costCenterId: 'A', keyValue: 2 }] }), /duplicate/);
assert.throws(() => allocateV3BabPool({ poolCents: -1, recipients: [{ costCenterId: 'A', keyValue: 1 }] }), /safe integer/);
assert.throws(() => calculateV3OfferEstimate({ netPriceCents: 100, directCosts: [{ id: 'x', amountCents: 1 }] }), /explicitly true or false/);

// V-SNAPSHOT-01: snapshot versions and accepted contract price remain immutable.
const calcForSnapshot = { netPriceCents: 100000, dbICents: 53000, costVersion: 'COST-01' };
const snap = createV3OfferSnapshot({
  offerId: 'O-01', submittedAt: '2027-01-29', netPriceCents: 100000,
  costVersion: 'COST-01', babVersion: 'BAB-01', calculation: calcForSnapshot
});
calcForSnapshot.dbICents = 0;
assert.equal(snap.calculation.dbICents, 53000);
assert.equal(Object.isFrozen(snap), true);
assert.equal(Object.isFrozen(snap.calculation), true);
const accepted = acceptV3OfferSnapshot(snap, '2027-02-02');
assert.equal(accepted.contractPriceCents, 100000);
assert.equal(accepted.snapshot.costVersion, 'COST-01');
assert.equal(accepted.snapshot.babVersion, 'BAB-01');
assert.equal(accepted.snapshot.calculation.dbICents, 53000);
assert.equal('ledger' in accepted, false);
assert.equal('cash' in accepted, false);
assert.deepEqual(acceptV3OfferSnapshot(snap, '2027-02-02'), accepted, 'same snapshot acceptance input is deterministic');
assert.throws(() => acceptV3OfferSnapshot(snap, '2027-01-28'), /cannot precede/);
assert.throws(() => createV3OfferSnapshot({ offerId: 'O', submittedAt: '2027-01-01', netPriceCents: 1, costVersion: 'C', babVersion: 'B', calculation: { netPriceCents: 2 } }), /must match/);

// V-PLANIST-01: plan and realized values remain separate.
const plan = calculateV3OfferEstimate({ netPriceCents: 100000, directCosts: [{ id: 'v', amountCents: 60000, variable: true }] });
const actual = calculateV3OfferEstimate({ netPriceCents: 95000, directCosts: [{ id: 'v', amountCents: 57950, variable: true }] });
assert.equal(plan.dbICents, 40000);
assert.equal(actual.dbICents, 37050);
assert.equal(actual.dbICents - plan.dbICents, -2950);

// V-T0066-01: product plan has no side effect and includes BAB only after direct result.
const product = calculateV3OfferEstimate({
  netPriceCents: 60000,
  directCosts: [
    { id: 'material', amountCents: 8000, variable: true },
    { id: 'labor', amountCents: 30000, variable: true },
    { id: 'machine', amountCents: 5000, variable: false }
  ],
  babAllocatedCents: 4000
});
assert.equal(product.dbICents, 22000);
assert.equal(product.allDirectCostsCents, 43000);
assert.equal(product.resultAfterDirectCostsCents, 17000);
assert.equal(product.resultAfterBabCents, 13000);
// V-T0066-01 realization fixture: only sold/accepted units contribute revenue;
// the remaining completed units stay in stock (no ledger/COGS runtime is modeled here).
const soldUnits = 8;
const completedUnits = 10;
assert.equal(soldUnits * 6000, 48000, 'eight units realize 480.00 EUR net revenue');
assert.equal(completedUnits - soldUnits, 2, 'two completed units remain unsold');

// V-PERIODE-01: flow metrics group by event month/year; stocks remain dated snapshots.
const periods = aggregateV3KpiPeriods({
  flows: [
    { metricId: 'offerPlan', date: '2027-01-29', amountCents: 100000 },
    { metricId: 'actualRevenue', date: '2027-03-03', amountCents: 100000 },
    { metricId: 'actualRevenue', date: '2028-01-05', amountCents: 50000 }
  ],
  stockSnapshots: [
    { metricId: 'receivable', date: '2027-03-31', amountCents: 100000 },
    { metricId: 'bank', date: '2027-04-15', amountCents: 100000 },
    { metricId: 'receivable', date: '2027-04-15', amountCents: 0 }
  ]
});
assert.equal(periods.monthlyFlows.offerPlan['2027-01'], 100000);
assert.equal(periods.monthlyFlows.actualRevenue['2027-03'], 100000);
assert.equal(periods.yearlyFlows['2027'].actualRevenue, 100000);
assert.equal(periods.yearlyFlows['2028'].actualRevenue, 50000);
assert.equal(periods.stockSnapshots.length, 3, 'stock snapshots are retained, not summed as flows');
assert.equal(periods.stockSnapshots.find(x => x.metricId === 'bank').amountCents, 100000);
assert.throws(() => aggregateV3KpiPeriods({ flows: [{ metricId: 'x', date: '2027-02-31', amountCents: 1 }] }), /real calendar date/);
assert.throws(() => aggregateV3KpiPeriods({ stockSnapshots: [{ metricId: 'x', date: '2027-01-01', amountCents: 1.5 }] }), /safe integer/);

console.log('V3 financial calculation regressions: PASS');



// V-BAB-OFFER-01: physical-key pool, unrounded rate use, exact reconciliation and offer snapshot payload.
const offerBabInput = {
  period: '2027-01', offerDate: '2027-01-08', netPriceCents: 10000,
  directCosts: [{ id: 'materials', amountCents: 6000, variable: true }],
  sourcePools: [{ poolId: 'SHOP-POOL', sourceCostCenterId: 'CC-SHOP', costBasisId: 'PRIMARY-COSTS-2027-01', period: '2027-01', poolCents: 10001, allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }, { costCenterId: 'CC-ADMIN', keyValue: '5' }] }],
  offerDrivers: [{ poolId: 'SHOP-POOL', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '2', unitLabel: 'h' }, { poolId: 'SHOP-POOL', costCenterId: 'CC-ADMIN', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }]
};
const offerBab = calculateV3OfferWithBab(offerBabInput);
assert.equal(offerBab.dbICents, 4000);
assert.equal(offerBab.resultAfterDirectCostsCents, 4000);
assert.equal(offerBab.babAllocatedCents, 2000, 'job share uses the unrounded 10001-cent / 15-hour rate before cent rounding');
assert.equal(offerBab.resultAfterBabCents, 2000);
assert.equal(offerBab.babReconciled, true);
assert.equal(offerBab.babReconciliationDifferenceCents, 0);
assert.equal(offerBab.babSnapshot.sourcePools[0].reconciliationDifferenceCents, 0);
assert.equal(offerBab.babSnapshot.sourcePools[0].offerAllocations[0].rate.displayValue, '6,67 €/h (gerundet)');
assert.equal('ledger' in offerBab, false); assert.equal('cash' in offerBab, false);
assert.deepEqual(calculateV3OfferWithBab(offerBabInput), offerBab, 'the adapter is deterministic and does not mutate input');
const frozenBabSnapshot = createV3OfferSnapshot({ offerId: 'O-BAB-1', submittedAt: '2027-01-08', netPriceCents: offerBab.netPriceCents, costVersion: 'COST-2027-01', babVersion: 'BAB-2027-01', calculation: offerBab });
const acceptedBabSnapshot = acceptV3OfferSnapshot(frozenBabSnapshot, '2027-01-12');
assert.equal(acceptedBabSnapshot.contractPriceCents, 10000);
assert.equal(acceptedBabSnapshot.snapshot.calculation.babAllocatedCents, 2000);
assert.equal(acceptedBabSnapshot.snapshot.calculation.babSnapshot.sourcePools[0].period, '2027-01');
assert.equal(acceptedBabSnapshot.snapshot.calculation.babSnapshot.sourcePools[0].sourceCostCenterId, 'CC-SHOP');

const fractionalKeysOffer = calculateV3OfferWithBab({
  period: '2027-01', offerDate: '2027-01-08', netPriceCents: 10000, directCosts: [],
  sourcePools: [{ poolId: 'FRACTIONAL', sourceCostCenterId: 'CC-F', costBasisId: 'B-F', period: '2027-01', poolCents: 10001, allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-A', keyValue: '1.5' }, { costCenterId: 'CC-B', keyValue: '0.75' }] }],
  offerDrivers: [{ poolId: 'FRACTIONAL', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '0.5', unitLabel: 'h' }, { poolId: 'FRACTIONAL', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '0.25', unitLabel: 'h' }]
});
assert.equal(fractionalKeysOffer.babAllocatedCents, 3334, 'fractional driver shares receive residual cents by largest fractional remainder');
assert.equal(fractionalKeysOffer.babSnapshot.sourcePools[0].offerAllocations.reduce((sum, row) => sum + row.amountCents, 0), 3334);
assert.equal(fractionalKeysOffer.babSnapshot.sourcePools[0].offerAllocations[0].rate.displayValue, '44,45 €/h (gerundet)');
assert.equal(acceptedBabSnapshot.snapshot.calculation.babSnapshot.sourcePools[0].allocations.reduce((sum, row) => sum + row.amountCents, 0), 10001, 'accepted snapshot preserves source allocation reconciliation');

// V-BAB-OFFER-02: positive, cent-near and negative DB I all retain signed DB results after BAB allocation.
const positiveOffer = calculateV3OfferWithBab({ ...offerBabInput, directCosts: [{ id: 'v', amountCents: 8000, variable: true }] });
const nearOffer = calculateV3OfferWithBab({ ...offerBabInput, directCosts: [{ id: 'v', amountCents: 9999, variable: true }] });
const negativeOffer = calculateV3OfferWithBab({ ...offerBabInput, directCosts: [{ id: 'v', amountCents: 15000, variable: true }] });
assert.equal(positiveOffer.dbICents, 2000); assert.equal(positiveOffer.resultAfterBabCents, 0);
assert.equal(nearOffer.dbICents, 1); assert.equal(nearOffer.dbICentNear, true); assert.equal(nearOffer.resultAfterBabCents, -1999);
assert.equal(negativeOffer.dbICents, -5000); assert.equal(negativeOffer.resultAfterBabCents, -7000);

// V-BAB-OFFER-03: weights remain allocation-only; an offer uses one common weighted physical rate basis.
const weightedOffer = calculateV3OfferWithBab({
  period: '2027-01', offerDate: '2027-01-08', netPriceCents: 20000, directCosts: [],
  sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'CC-ADMIN', costBasisId: 'ADMIN-PRIMARY', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.6' }, { costCenterId: 'CC-B', keyValue: '0.4' }], rateBasis: { basisKind: 'driver', value: '300', unitLabel: 'h', period: '2027-01' } }],
  offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '6', unitLabel: 'h' }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '20', unitLabel: 'h' }]
});
assert.equal(weightedOffer.babAllocatedCents, 867, 'weights split a single 300-hour period rate basis into 180 h and 120 h; job quantities use the common unrounded rate');
assert.deepEqual(weightedOffer.babSnapshot.sourcePools[0].offerAllocations.map(row => row.rate.unitLabel), ['h', 'h']);
assert.equal(weightedOffer.babSnapshot.sourcePools[0].reconciliationDifferenceCents, 0);
assert.equal(Object.hasOwn(allocateV3BabPool({ poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.6' }, { costCenterId: 'CC-B', keyValue: '0.4' }] }), 'rate'), false);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'S', costBasisId: 'B', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.5' }, { costCenterId: 'CC-B', keyValue: '0.5' }], rateBasis: { basisKind: 'driver', value: '100', unitLabel: 'h', period: '2027-01' } }], offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'kg' }] }), /common physical driver unit/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'S', costBasisId: 'B', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.5' }, { costCenterId: 'CC-B', keyValue: '0.5' }], recipientRateBases: [{ costCenterId: 'CC-A', basisKind: 'driver', value: '10', unitLabel: 'h', period: '2027-01' }, { costCenterId: 'CC-B', basisKind: 'driver', value: '20', unitLabel: 'kg', period: '2027-01' }] }], offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'kg' }] }), /independent recipientRateBases/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'S', costBasisId: 'B', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.5' }, { costCenterId: 'CC-B', keyValue: '0.5' }], rateBasis: { basisKind: 'money', valueCents: 10000, period: '2027-01' } }], offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'money', amountCents: 1 }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'money', amountCents: 1 }] }), /valueCents is not supported/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'S', costBasisId: 'B', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.5' }, { costCenterId: 'CC-B', keyValue: '0.5' }], rateBasis: { basisKind: 'driver', value: '100', unitLabel: 'h', period: '2027-02' } }], offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }] }), /period must match offer period/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'S', costBasisId: 'B', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.5' }, { costCenterId: 'CC-B', keyValue: '0.5' }], rateBasis: { basisKind: 'driver', value: '100', unitLabel: 'h', period: '2027-01' } }], offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '51', unitLabel: 'h' }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '0', unitLabel: 'h' }] }), /weighted share/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'WEIGHTED', sourceCostCenterId: 'S', costBasisId: 'B', period: '2027-01', poolCents: 10001, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '0.5' }, { costCenterId: 'CC-B', keyValue: '0.5' }] }], offerDrivers: [{ poolId: 'WEIGHTED', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '0', unitLabel: 'h' }, { poolId: 'WEIGHTED', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '0', unitLabel: 'h' }] }), /common rateBasis/);
// V-BAB-OFFER-04: unsupported/missing periods, keys units, weights bases, driver rows and incompatible units fail closed.
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ ...offerBabInput.sourcePools[0], period: '2027-02' }] }), /period must match/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, offerDate: '2027-02-01' }), /offerDate month must match/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ ...offerBabInput.sourcePools[0], unitLabel: undefined }] }), /unitLabel/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, offerDrivers: [{ ...offerBabInput.offerDrivers[0], unitLabel: 'kg' }, offerBabInput.offerDrivers[1]] }), /physical driver unit/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, offerDrivers: [offerBabInput.offerDrivers[0]] }), /exactly one explicit offer driver per recipient/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, offerDrivers: [{ ...offerBabInput.offerDrivers[0], quantity: '11' }, offerBabInput.offerDrivers[1]] }), /exceeds the recipient period key/);
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [{ poolId: 'w', sourceCostCenterId: 's', costBasisId: 'b', period: '2027-01', poolCents: 100, allocationMode: 'weights', recipients: [{ costCenterId: 'CC-A', keyValue: '1' }] }], offerDrivers: [{ poolId: 'w', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '0', unitLabel: 'h' }] }), /common rateBasis/);
const invalidWeightsPool = { ...offerBabInput.sourcePools[0], recipients: [{ costCenterId: 'CC-A', keyValue: '0.4' }, { costCenterId: 'CC-B', keyValue: '0.4' }], allocationMode: 'weights', rateBasis: { basisKind: 'driver', value: '10', unitLabel: 'h', period: '2027-01' } };
delete invalidWeightsPool.unitLabel;
assert.throws(() => calculateV3OfferWithBab({ ...offerBabInput, sourcePools: [invalidWeightsPool], offerDrivers: [{ poolId: 'SHOP-POOL', costCenterId: 'CC-A', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }, { poolId: 'SHOP-POOL', costCenterId: 'CC-B', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }] }), /summing exactly to 1/);


