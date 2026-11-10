import assert from 'node:assert/strict';
import { createV3ProductCostLayer, consumeV3ProductCostFIFO, validateV3ProductCostingState } from './v3-product-costing.js';

const components = amount => ({ materials: amount, directLabor: 100, machine: 50, manufacturingOverhead: 25 });
const sources = prefix => ({ materials: [`${prefix}:mat`], directLabor: [`${prefix}:labor`], machine: [`${prefix}:machine`], manufacturingOverhead: [`${prefix}:bab`] });
const layers = [
  createV3ProductCostLayer({ layerId: 'lot-old', productId: 'sku-a', productionDate: '2027-01-04', quantity: 2, costComponentsCents: components(101), componentSourceRefs: sources('old'), productionSourceRefs: ['assignment-old'], sequence: 1 }),
  createV3ProductCostLayer({ layerId: 'lot-new', productId: 'sku-a', productionDate: '2027-01-05', quantity: 2, costComponentsCents: components(200), componentSourceRefs: sources('new'), productionSourceRefs: ['assignment-new'], sequence: 2 }),
];
const first = consumeV3ProductCostFIFO(layers, { productId: 'sku-a', quantity: 1, dispatchId: 'dispatch-1', date: '2027-01-06' });
assert.equal(first.status, 'valued');
assert.equal(first.movement.allocations[0].layerId, 'lot-old', 'FIFO takes the oldest product lot first');
assert.equal(first.movement.costCents, 138, 'cent rounding is deterministic for a partial lot allocation');
const second = consumeV3ProductCostFIFO(first.layers, { productId: 'sku-a', quantity: 3, dispatchId: 'dispatch-2', date: '2027-01-07' });
assert.equal(second.status, 'valued');
assert.deepEqual(second.movement.allocations.map(row => row.layerId), ['lot-old', 'lot-new'], 'later shipment exhausts the remainder of the oldest lot before the newer lot');
assert.equal(first.movement.costCents + second.movement.costCents, (101 + 100 + 50 + 25) + (200 + 100 + 50 + 25), 'all cost cents are allocated once with no rounding residual');
assert.equal(second.layers.every(row => row.quantityRemaining === 0 && row.remainingCostCents === 0), true);
const stateMovements = [first.movement, second.movement];
assert.equal(validateV3ProductCostingState(second.layers, stateMovements), true, 'FIFO layer and value roll-forward validates');
const pending = consumeV3ProductCostFIFO(second.layers, { productId: 'sku-a', quantity: 1, dispatchId: 'dispatch-pending', date: '2027-01-08' });
assert.equal(pending.status, 'pending');
assert.deepEqual(pending.layers, second.layers, 'missing valued coverage remains pending without mutating layers');
const tampered = structuredClone(second.layers); tampered[0].remainingCostCents += 1;
assert.throws(() => validateV3ProductCostingState(tampered, stateMovements), /ending value does not reconcile/);
assert.throws(() => createV3ProductCostLayer({ layerId: 'bad', productId: 'sku-a', productionDate: '2027-01-04', quantity: 1, costComponentsCents: components(1), componentSourceRefs: { ...sources('x'), machine: [] }, productionSourceRefs: ['assignment-bad'], sequence: 3 }), /machine must contain unique explicit source references/);
console.log('V3 product FIFO costing regressions: PASS');
