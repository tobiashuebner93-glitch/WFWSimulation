/** Non-posting FIFO valuation adapter for explicitly sourced V3 finished-goods cost evidence. */
export const V3_PRODUCT_COSTING_METHOD = 'FIFO';

function fail(message) { throw new TypeError(message); }
function requireId(value, label) { if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`); return value; }
function requireCents(value, label) { if (!Number.isSafeInteger(value) || value < 0) fail(`${label} must be non-negative integer cents`); return value; }
function requireQuantity(value, label) { if (!Number.isSafeInteger(value) || value <= 0) fail(`${label} must be a positive integer`); return value; }
function requireDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '') || new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) !== value) fail(`${label} must be a valid ISO date`);
  return value;
}
const clone = value => structuredClone(value);
const COMPONENTS = ['materials', 'directLabor', 'machine', 'manufacturingOverhead'];

export function createV3ProductCostLayer({ layerId, productId, productionDate, quantity, costComponentsCents, componentSourceRefs, productionSourceRefs, sequence }) {
  requireId(layerId, 'layerId'); requireId(productId, 'productId'); requireDate(productionDate, 'productionDate'); requireQuantity(quantity, 'quantity');
  if (!Number.isSafeInteger(sequence) || sequence < 1) fail('sequence must be a positive integer');
  if (!costComponentsCents || !componentSourceRefs || !Array.isArray(productionSourceRefs) || !productionSourceRefs.length) fail('complete component amounts and source references are required');
  if (Object.keys(costComponentsCents).length !== COMPONENTS.length || COMPONENTS.some(key => !Object.hasOwn(costComponentsCents, key))) fail('costComponentsCents must contain exactly the four A03 production-cost components');
  const components = {};
  for (const key of COMPONENTS) {
    components[key] = requireCents(costComponentsCents[key], `costComponentsCents.${key}`);
    const refs = componentSourceRefs[key];
    if (!Array.isArray(refs) || !refs.length || refs.some(ref => typeof ref !== 'string' || !ref.trim()) || new Set(refs).size !== refs.length) fail(`componentSourceRefs.${key} must contain unique explicit source references`);
  }
  const sources = [...productionSourceRefs];
  if (sources.some(ref => typeof ref !== 'string' || !ref.trim()) || new Set(sources).size !== sources.length) fail('productionSourceRefs must contain unique explicit assignment references');
  const totalCostCents = Object.values(components).reduce((sum, value) => sum + value, 0);
  if (!Number.isSafeInteger(totalCostCents) || totalCostCents <= 0) fail('total production cost must be positive safe integer cents');
  return {
    layerId, productId, sequence, productionDate, period: productionDate.slice(0, 7), method: V3_PRODUCT_COSTING_METHOD,
    quantityOriginal: quantity, quantityRemaining: quantity, totalCostCents, remainingCostCents: totalCostCents,
    costComponentsCents: components, componentSourceRefs: clone(componentSourceRefs), productionSourceRefs: sources,
    valuationStatus: 'valued_nonposting',
  };
}

function roundedRatioCents(cents, quantity, remainingQuantity) {
  const numerator = BigInt(cents) * BigInt(quantity);
  const denominator = BigInt(remainingQuantity);
  return Number((numerator + denominator / 2n) / denominator);
}

/** Allocate a shipment against oldest valued production layers; an incomplete valuation stays pending and does not alter layers. */
export function consumeV3ProductCostFIFO(layers, { productId, quantity, dispatchId, date }) {
  requireId(productId, 'productId'); requireId(dispatchId, 'dispatchId'); requireDate(date, 'date'); requireQuantity(quantity, 'quantity');
  if (!Array.isArray(layers)) fail('layers must be an array');
  const nextLayers = clone(layers);
  const eligible = nextLayers.filter(layer => layer.productId === productId && layer.quantityRemaining > 0)
    .sort((a, b) => a.productionDate.localeCompare(b.productionDate) || a.sequence - b.sequence || a.layerId.localeCompare(b.layerId));
  const available = eligible.reduce((sum, layer) => sum + layer.quantityRemaining, 0);
  if (available < quantity) return { status: 'pending', reason: 'FIFO cost layers do not cover the shipped quantity', layers: clone(layers), movement: null };
  let remaining = quantity; let totalCostCents = 0;
  const allocations = [];
  for (const layer of eligible) {
    if (!remaining) break;
    const take = Math.min(remaining, layer.quantityRemaining);
    const allocatedCostCents = take === layer.quantityRemaining ? layer.remainingCostCents : roundedRatioCents(layer.remainingCostCents, take, layer.quantityRemaining);
    allocations.push({ layerId: layer.layerId, productId, productionDate: layer.productionDate, quantity: take, costCents: allocatedCostCents, quantityBefore: layer.quantityRemaining, quantityAfter: layer.quantityRemaining - take, costBeforeCents: layer.remainingCostCents, costAfterCents: layer.remainingCostCents - allocatedCostCents });
    layer.quantityRemaining -= take;
    layer.remainingCostCents -= allocatedCostCents;
    remaining -= take;
    totalCostCents += allocatedCostCents;
  }
  const movement = { movementId: `COGS|${dispatchId}`, dispatchId, productId, date, period: date.slice(0, 7), method: V3_PRODUCT_COSTING_METHOD, quantity, costCents: totalCostCents, allocations, status: 'valued_nonposting' };
  return { status: 'valued', layers: nextLayers, movement };
}

export function validateV3ProductCostingState(layers, movements) {
  if (!Array.isArray(layers) || !Array.isArray(movements)) fail('product cost layers and movements must be arrays');
  const ids = new Set(); const originals = new Map();
  for (const [index, layer] of layers.entries()) {
    if (!layer || ids.has(layer.layerId) || layer.sequence !== index + 1 || layer.method !== V3_PRODUCT_COSTING_METHOD || layer.period !== layer.productionDate?.slice(0, 7) || !Number.isSafeInteger(layer.quantityOriginal) || layer.quantityOriginal <= 0 || !Number.isSafeInteger(layer.quantityRemaining) || layer.quantityRemaining < 0 || layer.quantityRemaining > layer.quantityOriginal || !Number.isSafeInteger(layer.totalCostCents) || layer.totalCostCents <= 0 || !Number.isSafeInteger(layer.remainingCostCents) || layer.remainingCostCents < 0 || layer.remainingCostCents > layer.totalCostCents || layer.valuationStatus !== 'valued_nonposting') fail(`productCostLayers[${index}] is invalid`);
    ids.add(layer.layerId);
    const componentTotal = Object.values(layer.costComponentsCents ?? {}).reduce((sum, value) => sum + value, 0);
    if (componentTotal !== layer.totalCostCents) fail(`product cost layer ${layer.layerId} component amounts do not reconcile`);
    for (const key of COMPONENTS) if (!Array.isArray(layer.componentSourceRefs?.[key]) || !layer.componentSourceRefs[key].length) fail(`product cost layer ${layer.layerId} lacks ${key} sources`);
    if (!Array.isArray(layer.productionSourceRefs) || !layer.productionSourceRefs.length) fail(`product cost layer ${layer.layerId} lacks production sources`);
    originals.set(layer.layerId, { quantity: layer.quantityOriginal, costCents: layer.totalCostCents });
  }
  const movementIds = new Set();
  for (const [index, movement] of movements.entries()) {
    if (!movement || movementIds.has(movement.movementId) || movement.status !== 'valued_nonposting' || movement.method !== V3_PRODUCT_COSTING_METHOD || movement.period !== movement.date?.slice(0, 7) || !Number.isSafeInteger(movement.quantity) || movement.quantity <= 0 || !Number.isSafeInteger(movement.costCents) || movement.costCents < 0 || !Array.isArray(movement.allocations) || !movement.allocations.length) fail(`productCostMovements[${index}] is invalid`);
    movementIds.add(movement.movementId);
    if (movement.costCents !== movement.allocations.reduce((sum, row) => sum + row.costCents, 0) || movement.quantity !== movement.allocations.reduce((sum, row) => sum + row.quantity, 0)) fail(`product cost movement ${movement.movementId} allocations do not reconcile`);
  }
  let fifoLayers = layers.map(layer => ({ ...clone(layer), quantityRemaining: layer.quantityOriginal, remainingCostCents: layer.totalCostCents }));
  for (const movement of movements) {
    const expected = consumeV3ProductCostFIFO(fifoLayers, { productId: movement.productId, quantity: movement.quantity, dispatchId: movement.dispatchId, date: movement.date });
    if (expected.status !== 'valued' || expected.movement.costCents !== movement.costCents || JSON.stringify(expected.movement.allocations) !== JSON.stringify(movement.allocations)) fail(`product cost movement ${movement.movementId} does not follow FIFO order`);
    fifoLayers = expected.layers;
  }
  const rolled = new Map([...originals].map(([layerId, values]) => [layerId, { ...values }]));
  for (const movement of movements) for (const allocation of movement.allocations) {
    const state = rolled.get(allocation.layerId);
    if (!state || allocation.productId !== layers.find(layer => layer.layerId === allocation.layerId)?.productId || allocation.quantityBefore !== state.quantity || allocation.costBeforeCents !== state.costCents || allocation.quantityAfter !== state.quantity - allocation.quantity || allocation.costAfterCents !== state.costCents - allocation.costCents || allocation.quantity <= 0 || allocation.costCents < 0) fail(`product cost movement ${movement.movementId} fails FIFO layer roll-forward`);
    state.quantity = allocation.quantityAfter; state.costCents = allocation.costAfterCents;
  }
  for (const layer of layers) {
    const state = rolled.get(layer.layerId);
    if (state.quantity !== layer.quantityRemaining || state.costCents !== layer.remainingCostCents) fail(`product cost layer ${layer.layerId} ending value does not reconcile`);
  }
  return true;
}
