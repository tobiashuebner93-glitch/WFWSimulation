import { getV3RequirementGaps, getV3SkillDefinition, V3_SYNTHETIC_SKILL_COURSES } from './v3-occupational-competencies.js';
import { calculateV3OfferEstimate, calculateV3OfferWithBab } from './v3-financial-calculation.js';
import { getV3MarketPlayerView } from './v3-market-simulation.js';
import { getEmployeeWorkEfficiency } from './engine.js';
import { equipmentEffects } from './equipment.js';
import { createV3ProductCostLayer, consumeV3ProductCostFIFO, validateV3ProductCostingState } from './v3-product-costing.js';

export const V3_PRODUCT_VERSION = 'V3-PRODUCT-3';
export const V3_EQUIPMENT_INSTRUCTION_VERSION = 'D-0183-INSTRUCTION-1';

// D-0173 scenario quotes use only the explicit D-0128 material proxies.
export const V3_SUPPLIER_PRICE_ANCHORS = Object.freeze({
  steel: Object.freeze({ label: 'S235JR-Rundstahl (D-0128-Proxy)', unit: 'kg', unitPriceCents: 163 }),
  aluminium: Object.freeze({ label: 'EN AW-5754 H111 (D-0128-Proxy)', unit: 'kg', unitPriceCents: 920 }),
  aluminum: Object.freeze({ label: 'EN AW-5754 H111 (D-0128-Proxy)', unit: 'kg', unitPriceCents: 920 }),
  screw_m10_10_9: Object.freeze({ label: 'DIN 933 M10×30 10.9 (D-0128-Proxy)', unit: 'pieces', unitPriceCents: 57 }),
});
export const V3_SUPPLIER_SCENARIO_PROFILES = Object.freeze({
  local: Object.freeze({ label: 'Lokaler Händler', multiplierBps: 12000, deliveryDays: 0, freightCents: 0, minimumQuantity: 0, availability: 'begrenzt' }),
  online: Object.freeze({ label: 'Onlinehändler', multiplierBps: 9500, deliveryDays: 5, freightCents: 750, minimumQuantity: 0, availability: 'Bestellung' }),
  wholesale: Object.freeze({ label: 'Großhandel', multiplierBps: 8800, deliveryDays: 8, freightCents: 0, minimumQuantity: 100, availability: 'Mindestmenge 100' }),
});

export function getV3SupplierScenarioQuotes(materialId, quantity = 1) {
  const anchor = V3_SUPPLIER_PRICE_ANCHORS[String(materialId ?? '').toLowerCase()];
  if (!anchor || !Number.isFinite(quantity) || quantity <= 0) return [];
  return Object.entries(V3_SUPPLIER_SCENARIO_PROFILES).map(([supplierId, profile]) => {
    const unitPriceCents = Math.round(anchor.unitPriceCents * profile.multiplierBps / 10000);
    const freightCents = profile.freightCents;
    return Object.freeze({ supplierId, supplierLabel: profile.label, materialId, materialLabel: anchor.label, unit: anchor.unit, quantity, unitPriceCents, materialAmountCents: Math.round(unitPriceCents * quantity), freightCents, totalNetAmountCents: Math.round(unitPriceCents * quantity) + freightCents, deliveryDays: profile.deliveryDays, minimumQuantity: profile.minimumQuantity, availability: profile.availability, priceSourceRef: 'D-0128:simple-scenario-anchor', scenarioDecisionRef: 'D-0173', taxStatus: 'unknown' });
  });
}

function addV3SupplierPaymentDays(invoiceDate, calendarDays) {
  const date = new Date(`${invoiceDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + calendarDays - 1); // invoice date is day 1 per D-0165
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function fail(message) { throw new TypeError(message); }
function id(value, name) { if (typeof value !== 'string' || !value.trim()) fail(`${name} must be a non-empty string`); return value; }
function number(value, name, { min = 0, integer = false } = {}) {
  if (!Number.isFinite(value) || value < min || (integer && !Number.isSafeInteger(value))) fail(`${name} is invalid`);
  return value;
}
function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
function isWorkday(date) { const day = new Date(`${date}T00:00:00.000Z`).getUTCDay(); return day !== 0 && day !== 6; }
function nextWorkday(date) {
  const next = new Date(`${date}T00:00:00.000Z`);
  do { next.setUTCDate(next.getUTCDate() + 1); } while (!isWorkday(next.toISOString().slice(0, 10)));
  return next.toISOString().slice(0, 10);
}
function clone(value) { return structuredClone(value); }
function groupBy(rows, keyOf) {
  const grouped = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    const bucket = grouped.get(key);
    if (bucket) bucket.push(row); else grouped.set(key, [row]);
  }
  return grouped;
}
function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep(child);
    Object.freeze(value);
  }
  return value;
}
function immutable(state) { return freezeDeep(state); }
function keysForDate(state, date) { return [...state.commitments, ...state.assignments, ...(state.customerAssignments ?? [])].filter(row => row.date === date && row.status !== 'cancelled'); }
function usedHours(rows, key, value) { return rows.reduce((sum, row) => sum + (row[key] === value ? row.hours : 0), 0); }
function reservedMaterial(state, materialId) {
  return [...state.assignments, ...(state.customerAssignments ?? [])].filter(row => row.status === 'planned').reduce((sum, row) => sum + (row.materials[materialId] ?? 0), 0);
}
function findProduct(state, productId) { const product = state.products.find(row => row.productId === productId); if (!product) fail(`unknown product: ${productId}`); return product; }
function findStep(product, stepId) { const step = product.steps.find(row => row.stepId === stepId); if (!step) fail(`unknown step: ${stepId}`); return step; }
function credentialSnapshot(person) { return { personId: person.id, skills: clone(person.skills ?? []), skillLevels: clone(person.skillLevels ?? {}), qualifications: clone(person.qualifications ?? []), trainerQualified: Boolean(person.trainerQualified), qualificationTitle: person.qualificationTitle ?? null, qualificationPath: person.qualificationPath ?? null, qualificationLevel: person.qualificationLevel ?? null }; }
function personSkillLevel(person, skillId) { return Number(person.skillLevels?.[skillId] ?? (person.skills?.includes(skillId) ? 2 : 0)); }
function syntheticCourse(courseId) { return V3_SYNTHETIC_SKILL_COURSES.find(row => row.id === courseId) ?? null; }
function equipmentSafetyRevision(equipment) { return String(equipment.safetyRevision ?? equipment.revision ?? 'opening'); }
function equipmentHazardRequirementRef(equipment) { return equipment.hazardRequirementRef ?? equipment.specialAuthorizationRequired ?? null; }
function addCalendarYear(date) {
  const [year, month, day] = date.split('-').map(Number);
  const targetYear = year + 1;
  const lastDay = new Date(Date.UTC(targetYear, month, 0)).getUTCDate();
  return `${targetYear}-${String(month).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`;
}
function equipmentInstructionIsCurrent(state, personId, equipment, onDate, revision = equipmentSafetyRevision(equipment), hazardRef = equipmentHazardRequirementRef(equipment)) {
  const record = (state.equipmentInstructions ?? []).filter(row => row.personId === personId && row.equipmentId === equipment.id && row.equipmentRevision === revision && row.hazardRequirementRef === hazardRef && row.completedAt <= onDate).at(-1);
  if (!record || record.nextDueDate <= onDate) return false;
  if (!hazardRef) return true;
  return (state.specialEquipmentAuthorizations ?? []).some(row => row.personId === personId && row.equipmentId === equipment.id && row.equipmentRevision === revision && row.requirementRef === hazardRef && row.completedAt <= onDate);
}
function requireEquipmentInstruction(state, personId, equipment, onDate) {
  if (!equipmentInstructionIsCurrent(state, personId, equipment, onDate)) {
    const hazardRef = equipmentHazardRequirementRef(equipment);
    const reason = (hazardRef && !(state.specialEquipmentAuthorizations ?? []).some(row => row.personId === personId && row.equipmentId === equipment.id && row.equipmentRevision === equipmentSafetyRevision(equipment) && row.requirementRef === hazardRef))
      ? 'special equipment authorization is required'
      : 'current equipment instruction is required';
    fail(`${reason} for person ${personId} and equipment ${equipment.id}`);
  }
}
function validateEquipmentInstructionEvidence(state) {
  const plans = state.equipmentInstructionPlans ?? [];
  const instructions = state.equipmentInstructions ?? [];
  const authorizations = state.specialEquipmentAuthorizations ?? [];
  if (!Array.isArray(plans) || !Array.isArray(instructions) || !Array.isArray(authorizations)) fail('equipment instruction records must be arrays');
  const equipmentById = new Map(state.equipment.map(item => [item.id, item]));
  const peopleById = new Map(state.people.map(item => [item.id, item]));
  const planById = new Map(plans.map(item => [item.instructionId, item]));
  const instructionsById = groupBy(instructions, item => item.instructionId);
  const instructionEventsByKey = groupBy(state.events.filter(event => ['equipment_instruction_planned', 'equipment_instruction_missed', 'equipment_instruction_completed', 'special_equipment_authorization_completed'].includes(event.type)), event => `${event.type}|${event.instructionId ?? event.authorizationId}`);
  const commitmentsByInstruction = groupBy((state.commitments ?? []).filter(block => block.kind === 'equipment_instruction'), block => block.instructionId);
  const instructionEventCount = new Map();
  for (const event of state.events) instructionEventCount.set(event.type, (instructionEventCount.get(event.type) ?? 0) + 1);
  const seenPlans = new Set(); const seenInstructions = new Set(); const seenAuthorizations = new Set();
  for (const row of plans) {
    const equipment = equipmentById.get(row.equipmentId);
    const person = peopleById.get(row.personId);
    const expectedEventId = `${state.runId}|equipment-instruction-planned|${encodeURIComponent(row.instructionId)}`;
    if (!row || !person || !equipment || !row.instructionId || seenPlans.has(row.instructionId) || !isIsoDate(row.plannedDate) || !isWorkday(row.plannedDate) || (row.status === 'planned' && row.plannedDate < state.currentDate) || (row.status === 'missed' && row.plannedDate >= state.currentDate) || !row.equipmentRevision || row.version !== V3_EQUIPMENT_INSTRUCTION_VERSION || row.sourceRef !== `instruction:${row.instructionId}` || row.durationMinutes !== (row.instructionType === 'initial' ? 60 : 30) || !['initial', 'refresher'].includes(row.instructionType) || !['planned', 'completed', 'missed'].includes(row.status) || row.hazardRequirementRef !== (row.hazardRequirementRef ?? null)) fail('equipment instruction plan is invalid');
    seenPlans.add(row.instructionId);
    const events = instructionEventsByKey.get(`equipment_instruction_planned|${row.instructionId}`) ?? [];
    if (events.length !== 1 || events[0].eventId !== expectedEventId || events[0].sourceRef !== row.sourceRef || events[0].personId !== row.personId || events[0].equipmentId !== row.equipmentId || events[0].equipmentRevision !== row.equipmentRevision || events[0].hazardRequirementRef !== row.hazardRequirementRef || events[0].plannedDate !== row.plannedDate || events[0].durationMinutes !== row.durationMinutes || events[0].financialEffect !== 'none') fail('equipment instruction plan event is missing or inconsistent');
    const blocks = commitmentsByInstruction.get(row.instructionId) ?? [];
    const expectedBlockStatus = row.status === 'missed' ? 'cancelled' : row.status;
    if (blocks.length !== 1 || blocks[0].id !== `instruction-block:${row.instructionId}` || blocks[0].date !== row.plannedDate || blocks[0].personId !== row.personId || blocks[0].equipmentId !== row.equipmentId || blocks[0].hours !== row.durationMinutes / 60 || blocks[0].status !== expectedBlockStatus) fail('equipment instruction planned work-time block is missing or inconsistent');
    const completed = instructionsById.get(row.instructionId) ?? [];
    if ((row.status === 'completed') !== (completed.length === 1)) fail('equipment instruction plan and completion state disagree');
    const misses = instructionEventsByKey.get(`equipment_instruction_missed|${row.instructionId}`) ?? [];
    if ((row.status === 'missed') !== (misses.length === 1) || (misses.length === 1 && (misses[0].sourceRef !== row.sourceRef || misses[0].plannedDate !== row.plannedDate || misses[0].date <= row.plannedDate))) fail('equipment instruction missed-plan evidence is missing or inconsistent');
  }
  for (const row of instructions) {
    const equipment = equipmentById.get(row.equipmentId);
    const person = peopleById.get(row.personId);
    const plan = planById.get(row.instructionId);
    const expectedEventId = `${state.runId}|equipment-instruction|${encodeURIComponent(row.instructionId)}`;
    if (!row || !person || !equipment || !plan || plan.status !== 'completed' || !row.instructionId || seenInstructions.has(row.instructionId) || !isIsoDate(row.completedAt) || row.completedAt > state.currentDate || row.completedAt !== plan.plannedDate || row.period !== row.completedAt.slice(0, 7) || row.equipmentRevision !== plan.equipmentRevision || row.hazardRequirementRef !== plan.hazardRequirementRef || row.instructionType !== plan.instructionType || !row.equipmentRevision || row.version !== V3_EQUIPMENT_INSTRUCTION_VERSION || row.sourceRef !== `instruction:${row.instructionId}` || row.durationMinutes !== (row.instructionType === 'initial' ? 60 : 30) || !['initial', 'refresher'].includes(row.instructionType) || row.nextDueDate !== addCalendarYear(row.completedAt) || row.hazardRequirementRef !== (row.hazardRequirementRef ?? null)) fail('equipment instruction evidence is invalid');
    seenInstructions.add(row.instructionId);
    const events = instructionEventsByKey.get(`equipment_instruction_completed|${row.instructionId}`) ?? [];
    if (events.length !== 1 || events[0].eventId !== expectedEventId || events[0].sourceRef !== row.sourceRef || events[0].personId !== row.personId || events[0].equipmentId !== row.equipmentId || events[0].equipmentRevision !== row.equipmentRevision || events[0].hazardRequirementRef !== row.hazardRequirementRef || events[0].completedAt !== row.completedAt || events[0].durationMinutes !== row.durationMinutes || events[0].nextDueDate !== row.nextDueDate || events[0].financialEffect !== 'none' || events[0].credentialEffect !== 'none') fail('equipment instruction event evidence is missing or inconsistent');
  }
  for (const row of authorizations) {
    const equipment = equipmentById.get(row.equipmentId);
    const person = peopleById.get(row.personId);
    const expectedEventId = `${state.runId}|equipment-authorization|${encodeURIComponent(row.authorizationId)}`;
    if (!row || !person || !equipment || typeof row.requirementRef !== 'string' || !row.requirementRef.trim() || !row.authorizationId || seenAuthorizations.has(row.authorizationId) || typeof row.equipmentRevision !== 'string' || !row.equipmentRevision.trim() || !isIsoDate(row.completedAt) || row.completedAt > state.currentDate || row.period !== row.completedAt.slice(0, 7) || row.sourceRef !== `authorization:${row.authorizationId}`) fail('special equipment authorization evidence is invalid or does not match its historical equipment revision and hazard requirement');
    seenAuthorizations.add(row.authorizationId);
    const events = instructionEventsByKey.get(`special_equipment_authorization_completed|${row.authorizationId}`) ?? [];
    if (events.length !== 1 || events[0].eventId !== expectedEventId || events[0].sourceRef !== row.sourceRef || events[0].personId !== row.personId || events[0].equipmentId !== row.equipmentId || events[0].equipmentRevision !== row.equipmentRevision || events[0].requirementRef !== row.requirementRef || events[0].completedAt !== row.completedAt || events[0].financialEffect !== 'none') fail('special equipment authorization event is missing or inconsistent');
  }
  if ((instructionEventCount.get('equipment_instruction_planned') ?? 0) !== plans.length || (instructionEventCount.get('equipment_instruction_completed') ?? 0) !== instructions.length || (instructionEventCount.get('special_equipment_authorization_completed') ?? 0) !== authorizations.length) fail('orphan equipment instruction or authorization event');
}
function customerStorageUnits(plan) {
  const quantity = number(plan.contractSnapshot.orderQuantity, `customer order ${plan.workOrderId} quantity`, { min: Number.MIN_VALUE });
  const unit = id(plan.contractSnapshot.orderUnit, `customer order ${plan.workOrderId} unit`);
  const storagePerUnit = plan.contractSnapshot.storageUnitsPerOrderUnit ?? (unit === 'pieces' ? 1 : null);
  number(storagePerUnit, `customer order ${plan.workOrderId} storageUnitsPerOrderUnit`, { min: Number.MIN_VALUE });
  return quantity * storagePerUnit;
}
function customerOccupiedStorage(state) {
  return (state.customerFinishedGoods ?? []).reduce((sum, stock) => sum + (stock.status === 'shipped' ? stock.returnedStorageUnits : stock.status === 'returned_quarantine' ? stock.returnedStorageUnits : stock.status === 'reserved' || stock.status === 'available' ? stock.storageUnits : 0), 0);
}
function customerReservedStorage(state) {
  const customerReservations = (state.customerFinishedGoods ?? []).filter(row => row.status === 'reserved').reduce((sum, row) => sum + row.storageUnits, 0);
  const productReservations = (state.productSales ?? []).filter(row => row.status === 'accepted' && !row.dispatchId).reduce((sum, sale) => {
    const product = state.products.find(row => row.productId === sale.productId);
    return sum + (product ? sale.quantity * product.storageConversion.capacityUnitsPerBaseUnit : 0);
  }, 0);
  return customerReservations + productReservations;
}
function appendCustomerFinishedGoodsMovement(next, stock, { movementId, kind, date, sourceRef, quantity, unit, storageDelta, reservedBefore, reservedAfter, deliveryId = null, costEvidence = null }) {
  id(movementId, 'movementId'); id(sourceRef, 'sourceRef');
  if (!isIsoDate(date)) fail('finished-goods movement date must be a valid ISO date');
  const before = next.finishedGoodsUsed; const after = before + storageDelta;
  if (after < 0) fail('finished-goods movement would make stock negative');
  if (after > next.finishedGoodsCapacity) fail('finished-goods storage capacity exceeded');
  const prior = next.finishedGoodsMovements.find(row => row.movementId === movementId);
  const lotMoves = next.finishedGoodsMovements.filter(row => row.productId === (stock.productId ?? null) && row.workOrderId === (stock.workOrderId ?? null) && row.lotId === (stock.lotId ?? null));
  const lastLotMove = lotMoves.at(-1);
  const physicalQuantityBefore = lastLotMove?.physicalQuantityAfter ?? 0;
  const reservedQuantityBefore = lastLotMove?.reservedQuantityAfter ?? 0;
  const quarantinedQuantityBefore = lastLotMove?.quarantinedQuantityAfter ?? 0;
  let physicalDelta = 0; let reservedQuantityDelta = 0; let quarantinedQuantityDelta = 0;
  if (kind === 'product_output_stocked' || kind === 'customer_output_stocked_reserved' || kind === 'customer_rejected_goods_returned') physicalDelta = quantity;
  if (kind === 'product_goods_shipped' || kind === 'customer_goods_shipped') physicalDelta = -quantity;
  if (kind === 'product_goods_reserved' || kind === 'customer_output_stocked_reserved') reservedQuantityDelta = quantity;
  if (kind === 'product_goods_shipped' || kind === 'customer_goods_shipped' || kind === 'customer_reservation_released_before_shipment') reservedQuantityDelta = -quantity;
  if (kind === 'customer_rejected_goods_returned') quarantinedQuantityDelta = quantity;
  const physicalQuantityAfter = physicalQuantityBefore + physicalDelta;
  const reservedQuantityAfter = reservedQuantityBefore + reservedQuantityDelta;
  const quarantinedQuantityAfter = quarantinedQuantityBefore + quarantinedQuantityDelta;
  if (physicalQuantityAfter < 0 || reservedQuantityAfter < 0 || quarantinedQuantityAfter < 0 || reservedQuantityAfter + quarantinedQuantityAfter > physicalQuantityAfter) fail('finished-goods lot quantity would become negative or double-count reserved/quarantined stock');
  const movement = { movementSequence: next.finishedGoodsMovements.length + 1, movementId, runId: next.runId, productId: stock.productId ?? null, workOrderId: stock.workOrderId ?? null, contractRef: stock.contractRef ?? null, lotId: stock.lotId ?? null, deliveryId, kind, status: 'recorded', sourceRef, date, period: date.slice(0, 7), location: 'finished_goods', quantity, unit, physicalQuantityBefore, physicalQuantityAfter, reservedQuantityBefore, reservedQuantityAfter, quarantinedQuantityBefore, quarantinedQuantityAfter, availableQuantityAfter: physicalQuantityAfter - reservedQuantityAfter - quarantinedQuantityAfter, capacityUnits: Math.abs(storageDelta), deltaCapacityUnits: storageDelta, stockBefore: before, stockAfter: after, reservedBefore, reservedAfter, availableCapacityBefore: next.finishedGoodsCapacity - before, availableCapacityAfter: next.finishedGoodsCapacity - after, timeEvidence: { status: 'pending', reason: 'No measured operation-duration source is available' }, costEvidence: costEvidence ?? { status: 'pending', reason: 'No approved actual operation-cost rate is available' } };
  if (prior) {
    if (JSON.stringify(prior) !== JSON.stringify(movement)) fail('finished-goods movement ID replay payload conflict');
    return prior;
  }
  next.finishedGoodsUsed = after;
  next.finishedGoodsMovements.push(movement);
  next.events.push({ type: 'finished_goods_movement', movement: clone(movement), date, period: movement.period, sourceRef });
  return movement;
}
/** V2-approved D-0141/D-0149 factors translated to planned labor hours. This is capacity planning, not actual-time evidence. */
function plannedProductivity(state, person) {
  const workerFactor = getEmployeeWorkEfficiency(person);
  const equipmentFactor = equipmentEffects({ assets: state.equipment, equipmentLeases: [] }).production;
  return Math.min(1.32, workerFactor * (1 + equipmentFactor));
}

/** Create an isolated, deterministic V3 product run. Capacity and storage are caller-supplied; no defaults are invented. */
export function createV3ProductState({ runId, currentDate, people, equipment, materials, finishedGoodsCapacity, finishedGoodsUsed, commitments }) {
  id(runId, 'runId');
  if (!isIsoDate(currentDate)) fail('currentDate must be a valid ISO date');
  if (!Array.isArray(people) || !Array.isArray(equipment) || !Array.isArray(materials)) fail('people, equipment and materials must be arrays');
  number(finishedGoodsCapacity, 'finishedGoodsCapacity'); number(finishedGoodsUsed, 'finishedGoodsUsed');
  if (finishedGoodsUsed > finishedGoodsCapacity) fail('finishedGoodsUsed exceeds finishedGoodsCapacity');
  if (!Array.isArray(commitments)) fail('commitments must include existing order/work allocations');
  const mapUnique = (rows, name, validate) => {
    const seen = new Set();
    return rows.map((row, i) => {
      const copy = clone(row); id(copy.id, `${name}[${i}].id`);
      if (seen.has(copy.id)) fail(`duplicate ${name} ID: ${copy.id}`); seen.add(copy.id); validate(copy, i); return copy;
    });
  };
  const normalizedCommitments = commitments.map((row, index) => {
    const copy = clone(row); id(copy.date, `commitments[${index}].date`); id(copy.personId, `commitments[${index}].personId`); number(copy.hours, `commitments[${index}].hours`, { min: Number.MIN_VALUE });
    if (copy.equipmentId != null) id(copy.equipmentId, `commitments[${index}].equipmentId`);
    if (!isIsoDate(copy.date) || !people.some(person => person.id === copy.personId) || (copy.equipmentId != null && !equipment.some(item => item.id === copy.equipmentId))) fail(`commitments[${index}] references an invalid date/resource`);
    if (!isWorkday(copy.date)) fail(`commitments[${index}].date falls on Saturday or Sunday; weekends are not schedulable`);
    return { ...copy, status: copy.status ?? 'planned' };
  });
  for (const date of new Set(normalizedCommitments.map(row => row.date))) {
    const rows = normalizedCommitments.filter(row => row.date === date && row.status !== 'cancelled');
    for (const person of people) if (usedHours(rows, 'personId', person.id) > person.hoursPerDay) fail(`existing commitments exceed ${person.id} daily capacity on ${date}`);
    for (const item of equipment) if (usedHours(rows, 'equipmentId', item.id) > item.hoursPerDay) fail(`existing commitments exceed ${item.id} daily capacity on ${date}`);
  }
  const normalizedPeople = mapUnique(people, 'people', row => { number(row.hoursPerDay, `people.${row.id}.hoursPerDay`); if (!Array.isArray(row.skills)) fail(`people.${row.id}.skills must be an array`); });
  return immutable({ version: V3_PRODUCT_VERSION, runId, currentDate,
    people: normalizedPeople, openingCredentials: normalizedPeople.map(credentialSnapshot), syntheticTrainingCompletions: [],
    equipment: mapUnique(equipment, 'equipment', row => { number(row.hoursPerDay, `equipment.${row.id}.hoursPerDay`); if (!Array.isArray(row.capabilities)) fail(`equipment.${row.id}.capabilities must be an array`); if (row.specialAuthorizationRequired != null) id(row.specialAuthorizationRequired, `equipment.${row.id}.specialAuthorizationRequired`); }),
    equipmentInstructionPlans: [], equipmentInstructions: [], specialEquipmentAuthorizations: [],
    materials: mapUnique(materials, 'materials', row => number(row.quantity, `materials.${row.id}.quantity`)),
    openingMaterials: mapUnique(materials, 'openingMaterials', row => number(row.quantity, `openingMaterials.${row.id}.quantity`)),
    materialShipments: [], materialMovements: [], supplierInvoiceEvidence: [],
    finishedGoodsCapacity, finishedGoodsUsed, openingFinishedGoodsUsed: finishedGoodsUsed, commitments: normalizedCommitments, products: [], assignments: [], customerAssignments: [], customerWorkOrderPlans: [], customerFinishedGoods: [], finishedGoodsMovements: [], productCostLayers: [], productCostMovements: [], productSales: [], nextAssignmentSequence: 1,
    events: [{ type: 'product_run_created', runId, date: currentDate }] });
}

/** Plan D-0183 instruction time. Durations are game work-plan assumptions, not legal minimums. */
export function planV3EquipmentInstruction(state, input) {
  validateV3ProductWorkdayAssignments(state);
  const allowed = ['instructionId', 'personId', 'equipmentId', 'plannedDate', 'sourceRef'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) fail('equipment instruction plan requires explicit identity, person, equipment, date and source');
  for (const key of allowed) id(input[key], key);
  if (!isIsoDate(input.plannedDate) || input.plannedDate < state.currentDate || !isWorkday(input.plannedDate)) fail('equipment instruction date must be a workday on/after the current simulation date');
  const prior = (state.equipmentInstructionPlans ?? []).find(row => row.instructionId === input.instructionId);
  if (prior) {
    if (prior.personId !== input.personId || prior.equipmentId !== input.equipmentId || prior.plannedDate !== input.plannedDate || prior.sourceRef !== input.sourceRef) fail('equipment instruction ID replay payload conflict');
    return immutable(state);
  }
  const person = state.people.find(row => row.id === input.personId); const equipment = state.equipment.find(row => row.id === input.equipmentId);
  if (!person || !equipment) fail('equipment instruction references an unknown person or work equipment');
  const equipmentRevision = equipmentSafetyRevision(equipment); const hazardRequirementRef = equipmentHazardRequirementRef(equipment);
  const instructionType = (state.equipmentInstructions ?? []).some(row => row.personId === person.id && row.equipmentId === equipment.id && row.equipmentRevision === equipmentRevision && row.hazardRequirementRef === hazardRequirementRef) ? 'refresher' : 'initial';
  if (input.sourceRef !== `instruction:${input.instructionId}`) fail('equipment instruction sourceRef must match its stable instruction ID');
  const row = { instructionId: input.instructionId, runId: state.runId, personId: person.id, equipmentId: equipment.id, equipmentRevision, hazardRequirementRef, instructionType, plannedDate: input.plannedDate, durationMinutes: instructionType === 'initial' ? 60 : 30, status: 'planned', version: V3_EQUIPMENT_INSTRUCTION_VERSION, sourceRef: input.sourceRef };
  const durationHours = row.durationMinutes / 60;
  const dayRows = keysForDate(state, input.plannedDate);
  if (usedHours(dayRows, 'personId', person.id) + durationHours > person.hoursPerDay) fail('instruction exceeds daily person capacity');
  if (usedHours(dayRows, 'equipmentId', equipment.id) + durationHours > equipment.hoursPerDay) fail('instruction exceeds daily equipment capacity');
  const next = clone(state); next.equipmentInstructionPlans ??= []; next.equipmentInstructionPlans.push(row);
  next.commitments.push({ id: `instruction-block:${row.instructionId}`, kind: 'equipment_instruction', instructionId: row.instructionId, date: row.plannedDate, personId: row.personId, equipmentId: row.equipmentId, hours: durationHours, status: 'planned' });
  next.events.push({ type: 'equipment_instruction_planned', eventId: `${state.runId}|equipment-instruction-planned|${encodeURIComponent(row.instructionId)}`, instructionId: row.instructionId, sourceRef: row.sourceRef, personId: row.personId, equipmentId: row.equipmentId, equipmentRevision: row.equipmentRevision, hazardRequirementRef: row.hazardRequirementRef, plannedDate: row.plannedDate, durationMinutes: row.durationMinutes, version: row.version, financialEffect: 'none' });
  validateEquipmentInstructionEvidence(next);
  return immutable(next);
}

/** Complete a preplanned instruction only on its scheduled simulation day; the employee/equipment block is already capacity-bound. */
export function recordV3EquipmentInstruction(state, { instructionId }) {
  validateV3ProductWorkdayAssignments(state);
  id(instructionId, 'instructionId');
  const plan = (state.equipmentInstructionPlans ?? []).find(row => row.instructionId === instructionId);
  if (!plan) fail('equipment instruction must be planned before completion');
  const prior = (state.equipmentInstructions ?? []).find(row => row.instructionId === instructionId);
  if (prior) return immutable(state);
  if (state.currentDate !== plan.plannedDate) fail('equipment instruction can only be completed on its planned simulation date');
  const row = { instructionId: plan.instructionId, runId: state.runId, personId: plan.personId, equipmentId: plan.equipmentId, equipmentRevision: plan.equipmentRevision, hazardRequirementRef: plan.hazardRequirementRef, instructionType: plan.instructionType, completedAt: state.currentDate, period: state.currentDate.slice(0, 7), durationMinutes: plan.durationMinutes, nextDueDate: addCalendarYear(state.currentDate), version: plan.version, sourceRef: plan.sourceRef };
  const next = clone(state); const savedPlan = next.equipmentInstructionPlans.find(item => item.instructionId === instructionId); savedPlan.status = 'completed';
  next.equipmentInstructions ??= []; next.equipmentInstructions.push(row);
  const block = next.commitments.find(item => item.id === `instruction-block:${instructionId}`); block.status = 'completed';
  next.events.push({ type: 'equipment_instruction_completed', eventId: `${state.runId}|equipment-instruction|${encodeURIComponent(row.instructionId)}`, instructionId: row.instructionId, sourceRef: row.sourceRef, personId: row.personId, equipmentId: row.equipmentId, equipmentRevision: row.equipmentRevision, hazardRequirementRef: row.hazardRequirementRef, completedAt: row.completedAt, period: row.period, durationMinutes: row.durationMinutes, nextDueDate: row.nextDueDate, version: row.version, credentialEffect: 'none', financialEffect: 'none' });
  validateEquipmentInstructionEvidence(next);
  return immutable(next);
}

/** Record a separate, scenario-specific assignment only when equipment declares an explicit hazard requirement. */
export function recordV3SpecialEquipmentAuthorization(state, input) {
  validateV3ProductWorkdayAssignments(state);
  const allowed = ['authorizationId', 'personId', 'equipmentId', 'requirementRef', 'completedAt', 'sourceRef'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) fail('special equipment authorization requires explicit identity and source fields');
  for (const key of allowed) id(input[key], key);
  if (!isIsoDate(input.completedAt) || input.completedAt !== state.currentDate) fail('special equipment authorization date must match the current simulation date');
  const prior = (state.specialEquipmentAuthorizations ?? []).find(row => row.authorizationId === input.authorizationId);
  if (prior) {
    if (prior.personId !== input.personId || prior.equipmentId !== input.equipmentId || prior.requirementRef !== input.requirementRef || prior.completedAt !== input.completedAt || prior.sourceRef !== input.sourceRef) fail('special equipment authorization ID replay payload conflict');
    return immutable(state);
  }
  const person = state.people.find(row => row.id === input.personId); const equipment = state.equipment.find(row => row.id === input.equipmentId);
  if (!person || !equipment || !equipmentHazardRequirementRef(equipment) || input.requirementRef !== equipmentHazardRequirementRef(equipment)) fail('special equipment authorization is permitted only for an explicit matching hazard requirement');
  if (input.sourceRef !== `authorization:${input.authorizationId}`) fail('special equipment authorization sourceRef must match its stable ID');
  const equipmentRevision = equipmentSafetyRevision(equipment);
  const row = { authorizationId: input.authorizationId, runId: state.runId, personId: person.id, equipmentId: equipment.id, equipmentRevision, requirementRef: input.requirementRef, completedAt: input.completedAt, period: input.completedAt.slice(0, 7), sourceRef: input.sourceRef };
  const next = clone(state); next.specialEquipmentAuthorizations ??= []; next.specialEquipmentAuthorizations.push(row);
  next.events.push({ type: 'special_equipment_authorization_completed', eventId: `${state.runId}|equipment-authorization|${encodeURIComponent(row.authorizationId)}`, authorizationId: row.authorizationId, sourceRef: row.sourceRef, personId: row.personId, equipmentId: row.equipmentId, equipmentRevision: row.equipmentRevision, requirementRef: row.requirementRef, completedAt: row.completedAt, period: row.period, financialEffect: 'none' });
  validateEquipmentInstructionEvidence(next);
  return immutable(next);
}

/** Reject weekend work in both newly created and restored product assignments. */
function validateSyntheticTrainingState(state) {
  const completions = state.syntheticTrainingCompletions ?? [];
  if (!Array.isArray(completions)) fail('syntheticTrainingCompletions must be an array');
  if (state.openingCredentials == null) {
    if (completions.length) fail('synthetic training completions require an opening credential snapshot');
    return true;
  }
  if (!Array.isArray(state.openingCredentials)) fail('openingCredentials must be an array');
  const personById = new Map(state.people.map(row => [row.id, row]));
  const trainingEventsByCompletion = groupBy(state.events.filter(event => event.type === 'synthetic_skill_course_completed'), event => event.completionId);
  const trainingEvents = [...trainingEventsByCompletion.values()].flat();
  const openingByPerson = new Map();
  for (const row of state.openingCredentials) {
    if (!row || typeof row.personId !== 'string' || openingByPerson.has(row.personId) || !Array.isArray(row.skills) || !row.skillLevels || typeof row.skillLevels !== 'object' || !Array.isArray(row.qualifications)) fail('opening credential snapshot is invalid');
    openingByPerson.set(row.personId, clone(row));
  }
  if (openingByPerson.size !== state.people.length || state.people.some(person => !openingByPerson.has(person.id))) fail('opening credentials do not cover the current person roster');
  const expectedByPerson = new Map([...openingByPerson].map(([personId, row]) => [personId, clone(row)]));
  const completionIds = new Set(); const coursePersonKeys = new Set(); const expectedEventIds = new Set();
  const ordered = [...completions].sort((a, b) => a.sequence - b.sequence);
  for (let index = 0; index < ordered.length; index++) {
    const row = ordered[index]; const course = syntheticCourse(row?.courseId); const skill = getV3SkillDefinition(row?.skillId);
    if (!row || typeof row.completionId !== 'string' || !row.completionId.trim() || !course || !skill || row.sequence !== index + 1 || !Number.isSafeInteger(row.sequence) || completionIds.has(row.completionId) || !isIsoDate(row.completedAt) || row.completedAt > state.currentDate || row.period !== row.completedAt.slice(0, 7) || row.sourceRef !== `synthetic:course-completion:${row.completionId}` || row.sourceType !== 'synthetic_training_option' || row.credentialEffect !== 'none' || row.financialEffect !== 'none') fail(`synthetic training completion ${index} has unknown targets or invalid evidence`);
    const target = course.awards;
    if (target.kind !== 'game_skill' || row.skillId !== target.skillId || row.awardedLevel !== target.level || row.courseVersion !== course.courseVersion) fail(`synthetic training completion ${index} does not match its catalogued skill award`);
    const person = expectedByPerson.get(row.personId); const opening = openingByPerson.get(row.personId);
    if (!person || !opening) fail(`synthetic training completion ${index} references an unknown person`);
    const coursePersonKey = `${row.personId}|${row.courseId}`;
    if (coursePersonKeys.has(coursePersonKey)) fail(`duplicate synthetic course completion for ${row.personId}`);
    coursePersonKeys.add(coursePersonKey); completionIds.add(row.completionId);
    const eventId = `${state.runId}|synthetic-training|${encodeURIComponent(row.completionId)}`;
    if (expectedEventIds.has(eventId)) fail('duplicate synthetic training event ID');
    expectedEventIds.add(eventId);
    const existingLevel = personSkillLevel(person, row.skillId);
    if (existingLevel >= row.awardedLevel || row.priorSkillLevel !== existingLevel) fail(`synthetic training completion ${index} has an unmet prerequisite or inconsistent prior skill level`);
    for (const prerequisite of course.prerequisites) if (personSkillLevel(person, prerequisite.skillId) < prerequisite.minimumLevel) fail(`synthetic training completion ${index} has unmet prerequisite ${prerequisite.skillId}`);
    person.skillLevels ??= {};
    person.skillLevels[row.skillId] = row.awardedLevel;
    if (!person.skills.includes(row.skillId)) person.skills.push(row.skillId);
    const events = trainingEventsByCompletion.get(row.completionId) ?? [];
    if (events.length !== 1 || events[0].eventId !== eventId || events[0].sourceRef !== row.sourceRef || events[0].courseId !== row.courseId || events[0].personId !== row.personId || events[0].skillId !== row.skillId || events[0].awardedLevel !== row.awardedLevel || events[0].date !== row.completedAt || events[0].period !== row.period || events[0].credentialEffect !== 'none' || events[0].financialEffect !== 'none') fail(`synthetic training completion ${index} has no unique matching event evidence`);
  }
  for (const [personId, opening] of openingByPerson) {
    const current = personById.get(personId); const expected = expectedByPerson.get(personId);
    if (!current || JSON.stringify(current.skills) !== JSON.stringify(expected.skills) || JSON.stringify(current.skillLevels ?? {}) !== JSON.stringify(expected.skillLevels ?? {}) || JSON.stringify(current.qualifications ?? []) !== JSON.stringify(opening.qualifications) || Boolean(current.trainerQualified) !== opening.trainerQualified || (current.qualificationTitle ?? null) !== opening.qualificationTitle || (current.qualificationPath ?? null) !== opening.qualificationPath || (current.qualificationLevel ?? null) !== opening.qualificationLevel) fail(`person ${personId} credentials differ from opening credentials plus verified synthetic training`);
  }
  if (trainingEvents.length !== completions.length || trainingEvents.some(event => !expectedEventIds.has(event.eventId))) fail('orphan or duplicate synthetic training event');
  return true;
}

export function validateV3ProductWorkdayAssignments(state) {
  if (!state || state.version !== V3_PRODUCT_VERSION) fail('unsupported product state version');
  validateSyntheticTrainingState(state);
  validateEquipmentInstructionEvidence(state);
  const eventIndex = new Map();
  const eventKeyFields = ['productId', 'workEvidenceId', 'saleId', 'shipmentId', 'invoiceId', 'sourceRef'];
  const finishedGoodsEventByMovementId = new Map();
  for (const event of state.events) for (const field of eventKeyFields) {
    const value = event[field];
    if (value == null) continue;
    const key = `${event.type}|${field}|${value}`;
    const rows = eventIndex.get(key);
    if (rows) rows.push(event); else eventIndex.set(key, [event]);
  }
  for (const event of state.events) if (event.type === 'finished_goods_movement' && event.movement?.movementId) finishedGoodsEventByMovementId.set(event.movement.movementId, event);
  const eventsFor = (type, field, value) => eventIndex.get(`${type}|${field}|${value}`) ?? [];
  const firstEventFor = (type, field, value) => eventsFor(type, field, value)[0];
  const productsById = new Map((state.products ?? []).map(row => [row.productId, row]));
  const assignmentsById = new Map((state.assignments ?? []).map(row => [row.assignmentId, row]));
  const assignmentsByProduct = groupBy(state.assignments ?? [], row => row.productId);
  const salesById = new Map((state.productSales ?? []).map(row => [row.saleId, row]));
  const customerFinishedGoodByWorkOrder = new Map((state.customerFinishedGoods ?? []).map(row => [row.workOrderId, row]));
  const customerPlanByWorkOrder = new Map((state.customerWorkOrderPlans ?? []).map(row => [row.workOrderId, row]));
  const stockedCustomerWorkOrders = new Set((state.finishedGoodsMovements ?? []).filter(row => row.kind === 'customer_output_stocked_reserved').map(row => row.workOrderId));
  const returnedCustomerQuantities = new Map();
  for (const movement of state.finishedGoodsMovements ?? []) {
    if (movement.kind !== 'customer_rejected_goods_returned') continue;
    const totals = returnedCustomerQuantities.get(movement.workOrderId) ?? { quantity: 0, storageUnits: 0 };
    totals.quantity += movement.quantity;
    totals.storageUnits += movement.deltaCapacityUnits;
    returnedCustomerQuantities.set(movement.workOrderId, totals);
  }
  for (const [index, product] of (state.products ?? []).entries()) {
    const ideaEvents = eventsFor('product_idea_created', 'productId', product.productId);
    const ideaEvent = ideaEvents.at(-1);
    if (product.managementBrief && (!ideaEvent || ideaEvent.date > state.currentDate || JSON.stringify(ideaEvent.managementBrief) !== JSON.stringify(product.managementBrief))) fail(`products[${index}] management brief does not match its source event`);
    const conversion = product?.storageConversion;
    if (!conversion || !Number.isFinite(conversion.storageUnitsPerOrderUnit) || conversion.storageUnitsPerOrderUnit <= 0 || conversion.orderUnit !== 'pieces' || !Number.isFinite(conversion.stockBaseUnitsPerOrderUnit) || conversion.stockBaseUnitsPerOrderUnit <= 0 || conversion.stockBaseUnit !== 'pieces' || conversion.capacityUnitsPerBaseUnit !== conversion.storageUnitsPerOrderUnit / conversion.stockBaseUnitsPerOrderUnit || product.unitStorage !== conversion.storageUnitsPerOrderUnit || conversion.sources?.storageUnitsPerOrderUnit !== `product_creation_input:${product.productId}:unitStorage` || conversion.sources?.stockBaseUnitsPerOrderUnit !== 'v3-product-contract:one-piece-per-piece') fail(`products[${index}] has an invalid or unproven storage-unit conversion`);
    if (product.costEstimate) {
      validateProductCostLineEvidence(product.costEstimate.calculation, product.costEstimate.costLineEvidence, `products[${index}] plan`);
      const planEvent = eventsFor('product_plan_estimated', 'productId', product.productId).at(-1);
      if (!planEvent || JSON.stringify(planEvent.costEstimateSnapshot) !== JSON.stringify(product.costEstimate)) fail(`products[${index}] plan cost snapshot has no matching immutable estimate event`);
    }
  }
  for (const collectionName of ['commitments', 'assignments', 'customerAssignments']) {
    const rows = state[collectionName];
    if (!Array.isArray(rows)) fail(`${collectionName} must be an array`);
    for (const [index, row] of rows.entries()) {
      if (!row || !isIsoDate(row.date)) fail(`${collectionName}[${index}].date must be a valid calendar date`);
      if (!isWorkday(row.date)) fail(`${collectionName}[${index}].date falls on Saturday or Sunday; weekends are not schedulable`);
      if (collectionName !== 'commitments' && row.equipmentId != null) {
        const equipment = state.equipment.find(item => item.id === row.equipmentId);
        if (!equipment || !row.equipmentSafetyRevision || row.hazardRequirementRef !== (row.hazardRequirementRef ?? null) || !equipmentInstructionIsCurrent(state, row.personId, equipment, row.date, row.equipmentSafetyRevision, row.hazardRequirementRef)) fail(`${collectionName}[${index}] uses equipment without a current person/revision-bound instruction or required authorization`);
      }
    }
  }
  for (const [planIndex, plan] of (state.customerWorkOrderPlans ?? []).entries()) {
    if (!Array.isArray(plan.operations)) fail(`customerWorkOrderPlans[${planIndex}].operations must be an array`);
    for (const [operationIndex, operation] of plan.operations.entries()) {
      if (!operation || !isIsoDate(operation.date)) fail(`customerWorkOrderPlans[${planIndex}].operations[${operationIndex}].date must be a valid calendar date`);
      if (!isWorkday(operation.date)) fail(`customerWorkOrderPlans[${planIndex}].operations[${operationIndex}].date falls on Saturday or Sunday; weekends are not schedulable`);
      if (operation.equipmentId != null && !operation.equipmentSafetyRevision) fail(`customerWorkOrderPlans[${planIndex}].operations[${operationIndex}] lacks its equipment safety revision`);
    }
  }
  if (state.openingMaterials != null || state.materialShipments != null || state.materialMovements != null) {
    if (!Array.isArray(state.openingMaterials) || !Array.isArray(state.materialShipments) || !Array.isArray(state.materialMovements)) fail('material shipment and opening-balance evidence must be arrays');
    const shipmentIds = new Set(); const orderIds = new Set(); const movementByShipment = new Map();
    for (const movement of state.materialMovements) {
      if (!movement || !movement.shipmentId || movementByShipment.has(movement.shipmentId) || movement.movementId !== `${state.runId}|material-receipt|${encodeURIComponent(movement.shipmentId)}` || !isIsoDate(movement.date) || movement.period !== movement.date.slice(0, 7) || !Number.isFinite(movement.quantity) || movement.quantity <= 0 || movement.unit !== 'units' || movement.monetaryStatus !== 'nonposting_pending_cost_source') fail('material receipt movement is invalid or duplicated');
      movementByShipment.set(movement.shipmentId, movement);
    }
    const expectedMaterials = new Map(state.openingMaterials.map(row => [row.id, row.quantity]));
    const invoiceIds = new Set(); const invoicesByShipment = new Map();
    if (!Array.isArray(state.supplierInvoiceEvidence ?? [])) fail('supplierInvoiceEvidence must be an array');
    for (const invoice of state.supplierInvoiceEvidence ?? []) {
      if (!invoice || !invoice.invoiceId || invoiceIds.has(invoice.invoiceId) || !isIsoDate(invoice.invoiceDate) || !isIsoDate(invoice.dueDate) || invoice.paymentTermCalendarDays !== 14 || invoice.dueDate !== addV3SupplierPaymentDays(invoice.invoiceDate, 14) || invoice.status !== 'pending_non_posting' || invoice.currency !== 'EUR' || invoice.amountBasis !== 'net_before_tax' || invoice.taxStatus !== 'unknown' || invoice.taxAmountCents !== null || !Number.isSafeInteger(invoice.amountCents) || invoice.amountCents < 0 || invoice.period !== invoice.invoiceDate.slice(0, 7)) fail('supplier invoice evidence is invalid or duplicated');
      invoiceIds.add(invoice.invoiceId); invoicesByShipment.set(invoice.shipmentId, invoice);
    }
    for (const shipment of state.materialShipments) {
      if (!shipment || !shipment.orderId || !shipment.shipmentId || shipmentIds.has(shipment.shipmentId) || orderIds.has(shipment.orderId) || !expectedMaterials.has(shipment.materialId) || !Number.isFinite(shipment.quantity) || shipment.quantity <= 0 || !shipment.fixtureId?.startsWith('synthetic:') || !isIsoDate(shipment.baselineEtaDate) || !isIsoDate(shipment.etaDate) || shipment.etaDate < shipment.baselineEtaDate || !Number.isSafeInteger(shipment.lagDays) || Date.parse(`${shipment.etaDate}T00:00:00Z`) - Date.parse(`${shipment.baselineEtaDate}T00:00:00Z`) !== shipment.lagDays * 86400000) fail('international material shipment is invalid or duplicated');
      shipmentIds.add(shipment.shipmentId); orderIds.add(shipment.orderId);
      const placed = eventsFor('international_material_order_placed', 'shipmentId', shipment.shipmentId);
      if (placed.length !== 1 || placed[0].orderId !== shipment.orderId || placed[0].materialId !== shipment.materialId || placed[0].quantity !== shipment.quantity || placed[0].supplierId !== shipment.supplierId || placed[0].sourceRef !== shipment.sourceRef || placed[0].fixtureId !== shipment.fixtureId || placed[0].baselineEtaDate !== shipment.baselineEtaDate || placed[0].etaDate !== shipment.etaDate || placed[0].lagDays !== shipment.lagDays || placed[0].orderedAt !== shipment.orderedAt || JSON.stringify(placed[0].supplierQuoteSnapshot) !== JSON.stringify(shipment.supplierQuoteSnapshot)) fail('international material shipment lacks its matching source order event');
      const quote = shipment.supplierQuoteSnapshot; const expectedQuote = getV3SupplierScenarioQuotes(shipment.materialId, shipment.quantity).find(row => row.supplierId === shipment.supplierId);
      if (!quote || !expectedQuote || quote.quoteId !== `D-0173|${encodeURIComponent(shipment.orderId)}|quote` || quote.snapshotVersion !== 'D-0173-SUPPLIER-QUOTE-1' || quote.acceptedAt !== shipment.orderedAt || Object.entries(expectedQuote).some(([key, value]) => quote[key] !== value)) fail('material order lacks a matching immutable D-0173 supplier quote snapshot');
      const movement = movementByShipment.get(shipment.shipmentId);
      if (shipment.status === 'received') {
        if (!isIsoDate(shipment.receivedAt) || !movement || movement.orderId !== shipment.orderId || movement.materialId !== shipment.materialId || movement.quantity !== shipment.quantity || movement.date !== shipment.receivedAt || movement.sourceRef !== shipment.sourceRef || movement.fixtureId !== shipment.fixtureId || movement.lagDays !== shipment.lagDays) fail('received international material shipment lacks matching receipt movement');
        const invoice = invoicesByShipment.get(shipment.shipmentId);
        const invoiceEvent = eventsFor('supplier_invoice_evidence_created', 'invoiceId', invoice?.invoiceId);
        if (!invoice || invoiceEvent.length !== 1 || JSON.stringify(invoiceEvent[0]) !== JSON.stringify({ type: 'supplier_invoice_evidence_created', ...invoice }) || invoice.orderId !== shipment.orderId || invoice.invoiceId !== `${state.runId}|supplier-invoice|${encodeURIComponent(shipment.orderId)}` || invoice.supplierId !== quote.supplierId || invoice.quoteId !== quote.quoteId || invoice.priceSnapshotFingerprint !== JSON.stringify(quote) || invoice.materialId !== shipment.materialId || invoice.quantity !== shipment.quantity || invoice.unit !== quote.unit || invoice.invoiceDate !== shipment.receivedAt || invoice.amountCents !== quote.totalNetAmountCents || invoice.receiptMovementId !== movement.movementId || placed.length !== 1) fail('received shipment lacks matching non-posting invoice evidence');
        expectedMaterials.set(shipment.materialId, expectedMaterials.get(shipment.materialId) + shipment.quantity);
      } else if (shipment.status !== 'in_transit' || shipment.receivedAt !== null || movement || invoicesByShipment.has(shipment.shipmentId)) fail('unreceived international material shipment has receipt/invoice evidence');
    }
    if (movementByShipment.size !== state.materialShipments.filter(row => row.status === 'received').length) fail('orphan material receipt movement');
    if (invoicesByShipment.size !== state.materialShipments.filter(row => row.status === 'received').length) fail('orphan supplier invoice evidence');
    for (const assignment of [...state.assignments, ...state.customerAssignments]) if (assignment.status === 'completed') for (const [materialId, quantity] of Object.entries(assignment.materials ?? {})) {
      if (!expectedMaterials.has(materialId)) fail(`completed operation consumes unknown opening material ${materialId}`);
      expectedMaterials.set(materialId, expectedMaterials.get(materialId) - quantity);
    }
    for (const material of state.materials) if (expectedMaterials.get(material.id) !== material.quantity || material.quantity < 0) fail(`material quantity does not reconcile to opening stock, receipts and completed operation consumption: ${material.id}`);
  }
  for (const assignment of state.assignments) {
    if (assignment.status !== 'completed') {
      if (assignment.timeEvidence != null) fail(`assignments.${assignment.assignmentId} has time evidence without completed work`);
      continue;
    }
    if (!assignment.workEvidenceId) fail(`assignments.${assignment.assignmentId} lacks completed work evidence ID`);
    const evidence = firstEventFor('product_step_completed', 'workEvidenceId', assignment.workEvidenceId);
    const time = assignment.timeEvidence;
    if (!evidence || evidence.assignmentId !== assignment.assignmentId || evidence.date !== assignment.completedAt || evidence.period !== assignment.completedAt.slice(0, 7) || evidence.sourceRef !== assignment.assignmentId || !time || time.status !== 'simulated_actual' || !Number.isFinite(time.minutes) || time.minutes <= 0 || time.minutes !== assignment.hours * 60 || time.unit !== 'minutes' || time.sourceRef !== assignment.assignmentId || time.workDate !== assignment.completedAt || time.period !== assignment.completedAt.slice(0, 7) || time.basis !== 'completed_simulation_work_block' || time.label !== 'Modellierte Spieldauer; nicht extern gemessene Istzeit' || JSON.stringify(evidence.timeEvidence) !== JSON.stringify(time) || assignment.costEvidence?.status !== 'pending' || JSON.stringify(evidence.costEvidence) !== JSON.stringify(assignment.costEvidence)) fail(`assignments.${assignment.assignmentId} has inconsistent work evidence`);
    if (assignment.outputQuantity > 0 && (evidence.quantityEvidence?.value !== assignment.outputQuantity || evidence.quantityEvidence?.unit !== 'piece' || evidence.quantityEvidence?.sourceRef !== assignment.assignmentId)) fail(`assignments.${assignment.assignmentId} has inconsistent output evidence`);
  }
  const productSales = state.productSales ?? [];
  if (!Array.isArray(productSales)) fail('productSales must be an array');
  const saleIds = new Set();
  for (const [index, sale] of productSales.entries()) {
    if (!sale || !sale.saleId || saleIds.has(sale.saleId)) fail(`productSales[${index}] has a missing or duplicate sale ID`);
    saleIds.add(sale.saleId);
    const product = productsById.get(sale.productId);
    if (!product || !Number.isSafeInteger(sale.quantity) || sale.quantity < 1 || !Number.isSafeInteger(sale.netPriceCents) || sale.netPriceCents < 1 || !isIsoDate(sale.offerDate) || !isIsoDate(sale.decisionDate) || sale.decisionDate < sale.offerDate || !['pending', 'accepted', 'rejected'].includes(sale.status) || !sale.inquiryId || !sale.offerSnapshotId) fail(`productSales[${index}] is invalid`);
    if (sale.buyerPartyId === sale.sellerPartyId || !sale.buyerPartyId || !sale.sellerPartyId) fail(`productSales[${index}] must identify distinct seller and buyer parties`);
    if (sale.status === 'accepted' && (!sale.acceptedAt || sale.acceptedAt !== sale.decisionDate)) fail(`productSales[${index}] accepted quantity is inconsistent`);
    if (sale.dispatchId) {
      const dispatchEvents = eventsFor('product_sale_dispatched', 'saleId', sale.saleId);
      const dispatchMovements = state.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped' && row.sourceRef === sale.saleId && row.deliveryId === sale.dispatchId);
      const dispatchEvent = dispatchEvents[0]; const dispatchMovement = dispatchMovements[0];
      if (!sale.dispatchDate || !sale.dispatchSourceRef || dispatchEvents.length !== 1 || dispatchMovements.length !== 1 || !dispatchEvent || !dispatchMovement || dispatchEvent.dispatchId !== sale.dispatchId || dispatchEvent.dispatchSourceRef !== sale.dispatchSourceRef || dispatchEvent.quantity !== sale.quantity || dispatchEvent.date !== sale.dispatchDate || dispatchEvent.period !== sale.dispatchDate.slice(0, 7) || dispatchEvent.cogsStatus !== 'pending_deferred_bab' || dispatchEvent.cogsCents !== null || dispatchMovement.quantity !== sale.quantity || dispatchMovement.date !== sale.dispatchDate || dispatchMovement.period !== sale.dispatchDate.slice(0, 7) || dispatchMovement.sourceRef !== sale.saleId || dispatchMovement.costEvidence?.status !== 'pending_deferred_bab') fail(`productSales[${index}] dispatch event/status is not backed by the pending-COGS quantity movement`);
    }
    if (sale.cogsStatus !== 'pending_deferred_bab' || Object.hasOwn(sale, 'cogsCents')) fail(`productSales[${index}] must keep full COGS deferred until the later BAB/cost-basis version`);
    const offerEvent = firstEventFor('product_sale_offer_submitted', 'saleId', sale.saleId);
    if (!sale.offerSnapshot || sale.offerSnapshot.babStatus !== 'pending_deferred_bab' || sale.offerSnapshot.babCalculation !== null || sale.offerSnapshot.snapshotId !== sale.offerSnapshotId || sale.offerSnapshot.productId !== sale.productId || JSON.stringify(sale.offerSnapshot.storageConversion) !== JSON.stringify(product?.storageConversion) || sale.offerSnapshot.offerPriceCents !== sale.netPriceCents || JSON.stringify(sale.offerSnapshot.calculation) !== JSON.stringify(calculateV3ProductDirectEstimate({ netPriceCents: sale.netPriceCents, directCosts: sale.offerSnapshot.calculation?.directCosts })) || !offerEvent || offerEvent.productId !== sale.productId || offerEvent.sellerPartyId !== sale.sellerPartyId || offerEvent.buyerPartyId !== sale.buyerPartyId || offerEvent.inquiryId !== sale.inquiryId || offerEvent.quantity !== sale.quantity || offerEvent.offerDate !== sale.offerDate || offerEvent.decisionDate !== sale.decisionDate || offerEvent.netPriceCents !== sale.netPriceCents || offerEvent.offerSnapshotId !== sale.offerSnapshotId || JSON.stringify(offerEvent.offerSnapshot) !== JSON.stringify(sale.offerSnapshot)) fail(`productSales[${index}] has no matching immutable offer event`);
    validateProductCostLineEvidence(sale.offerSnapshot.calculation, sale.offerSnapshot.costLineEvidence, `productSales[${index}] offer`);
    if (sale.status !== 'pending') {
      const decisionEvent = firstEventFor('product_sale_buyer_decision', 'saleId', sale.saleId);
      if (!decisionEvent || decisionEvent.accepted !== (sale.status === 'accepted') || decisionEvent.decisionDate !== sale.decisionDate || decisionEvent.buyerPartyId !== sale.buyerPartyId) fail(`productSales[${index}] has no matching buyer decision event`);
    }
  }
  const acceptedByProduct = new Map();
  for (const sale of productSales) if (sale.status === 'accepted') acceptedByProduct.set(sale.productId, (acceptedByProduct.get(sale.productId) ?? 0) + sale.quantity);
  const pendingByProduct = new Map();
  for (const sale of productSales) if (sale.status === 'pending') pendingByProduct.set(sale.productId, (pendingByProduct.get(sale.productId) ?? 0) + sale.quantity);
  for (const product of state.products) {
    const produced = state.assignments.filter(row => row.productId === product.productId && row.status === 'completed' && findStep(product, row.stepId).kind === 'production').reduce((sum, row) => sum + row.outputQuantity, 0);
    if (produced !== product.outputQuantity + (acceptedByProduct.get(product.productId) ?? 0)) fail(`accepted sales exceed produced quantity or product stock does not reconcile for ${product.productId}`);
    if ((pendingByProduct.get(product.productId) ?? 0) > product.outputQuantity) fail(`pending product offers reserve more than available finished goods for ${product.productId}`);
  }
  if (!Array.isArray(state.customerFinishedGoods) || !Array.isArray(state.finishedGoodsMovements)) fail('customer finished-goods evidence must be arrays');
  const movementIds = new Set(); const lotRollForward = new Map(); let rollForwardStock = state.openingFinishedGoodsUsed; let rollForwardReserved = 0;
  if (!Number.isFinite(rollForwardStock) || rollForwardStock < 0 || rollForwardStock > state.finishedGoodsCapacity) fail('opening finished-goods stock is invalid');
  for (const [index, movement] of state.finishedGoodsMovements.entries()) {
    if (!movement || !movement.movementId || movementIds.has(movement.movementId) || movement.movementSequence !== index + 1 || movement.runId !== state.runId || !isIsoDate(movement.date) || movement.period !== movement.date.slice(0, 7) || !movement.sourceRef || !Number.isFinite(movement.quantity) || movement.quantity <= 0 || !Number.isFinite(movement.physicalQuantityBefore) || !Number.isFinite(movement.physicalQuantityAfter) || !Number.isFinite(movement.reservedQuantityBefore) || !Number.isFinite(movement.reservedQuantityAfter) || !Number.isFinite(movement.quarantinedQuantityBefore) || !Number.isFinite(movement.quarantinedQuantityAfter) || !Number.isFinite(movement.availableQuantityAfter) || !Number.isFinite(movement.capacityUnits) || movement.capacityUnits < 0 || !Number.isFinite(movement.deltaCapacityUnits) || !Number.isFinite(movement.stockBefore) || !Number.isFinite(movement.stockAfter) || !Number.isFinite(movement.reservedBefore) || !Number.isFinite(movement.reservedAfter)) fail(`finishedGoodsMovements[${index}] is invalid or duplicated`);
    movementIds.add(movement.movementId);
    const event = finishedGoodsEventByMovementId.get(movement.movementId);
    if (!event || JSON.stringify(event.movement) !== JSON.stringify(movement) || event.date !== movement.date || event.period !== movement.period || event.sourceRef !== movement.sourceRef) fail(`finished-goods movement ${movement.movementId} has no matching source event`);
    if (movement.stockBefore !== rollForwardStock || movement.stockAfter !== movement.stockBefore + movement.deltaCapacityUnits || movement.capacityUnits !== Math.abs(movement.deltaCapacityUnits) || movement.stockAfter < 0 || movement.stockAfter > state.finishedGoodsCapacity || movement.availableCapacityBefore !== state.finishedGoodsCapacity - movement.stockBefore || movement.availableCapacityAfter !== state.finishedGoodsCapacity - movement.stockAfter || movement.reservedBefore !== rollForwardReserved) fail(`finished-goods movement ${movement.movementId} fails stock roll-forward`);
    if (movement.kind === 'product_output_stocked') {
      const assignmentCandidate = assignmentsById.get(movement.sourceRef);
      const assignment = assignmentCandidate?.status === 'completed' ? assignmentCandidate : null;
      const product = productsById.get(movement.productId);
      const productAssignments = assignmentsByProduct.get(product?.productId) ?? [];
      const completedSteps = new Set(productAssignments.filter(row => row.status === 'completed').map(row => row.stepId));
      const allStepsComplete = product && product.steps.every(step => completedSteps.has(step.stepId));
      const producedQuantity = productAssignments.filter(row => row.status === 'completed').reduce((sum, row) => sum + row.outputQuantity, 0);
      if (!assignment || !product || assignment.productId !== product.productId || !allStepsComplete || assignment.completedAt !== movement.date || movement.quantity !== producedQuantity || movement.unit !== 'pieces' || movement.deltaCapacityUnits !== movement.quantity * product.storageConversion.capacityUnitsPerBaseUnit || movement.movementId !== `${state.runId}|product-output|${encodeURIComponent(assignment.assignmentId)}`) fail(`finished-goods movement ${movement.movementId} is not backed by completed product output`);
    } else if (movement.kind === 'product_goods_reserved') {
      const saleCandidate = salesById.get(movement.sourceRef);
      const sale = saleCandidate?.status === 'accepted' ? saleCandidate : null;
      const product = sale && productsById.get(sale.productId);
      const decisionEvent = eventsFor('product_sale_buyer_decision', 'saleId', sale?.saleId).find(row => row.accepted === true);
      const reservedUnits = sale && product ? sale.quantity * product.storageConversion.capacityUnitsPerBaseUnit : 0;
      if (!sale || !product || !decisionEvent || movement.productId !== product.productId || movement.lotId !== `LOT|PRODUCT|${encodeURIComponent(product.productId)}` || movement.quantity !== sale.quantity || movement.unit !== 'pieces' || movement.deltaCapacityUnits !== 0 || movement.date !== sale.acceptedAt || movement.reservedAfter !== movement.reservedBefore + reservedUnits || movement.movementId !== `${state.runId}|product-reservation|${encodeURIComponent(sale.saleId)}`) fail(`finished-goods movement ${movement.movementId} is not backed by product reservation`);
      rollForwardReserved += reservedUnits;
    } else if (movement.kind === 'product_goods_shipped') {
      const saleCandidate = salesById.get(movement.sourceRef);
      const sale = saleCandidate?.status === 'accepted' && saleCandidate.dispatchId === movement.deliveryId ? saleCandidate : null;
      const product = sale && productsById.get(sale.productId);
      const dispatchEvent = eventsFor('product_sale_dispatched', 'saleId', sale?.saleId).find(row => row.dispatchId === sale?.dispatchId);
      const reservedUnits = sale && product ? sale.quantity * product.storageConversion.capacityUnitsPerBaseUnit : 0;
      if (!sale || !product || !dispatchEvent || dispatchEvent.dispatchSourceRef !== sale.dispatchSourceRef || dispatchEvent.quantity !== sale.quantity || dispatchEvent.date !== sale.dispatchDate || dispatchEvent.period !== sale.dispatchDate?.slice(0, 7) || dispatchEvent.cogsStatus !== 'pending_deferred_bab' || dispatchEvent.cogsCents !== null || movement.sourceRef !== sale.saleId || movement.productId !== product.productId || movement.lotId !== `LOT|PRODUCT|${encodeURIComponent(product.productId)}` || movement.quantity !== sale.quantity || movement.unit !== 'pieces' || movement.deltaCapacityUnits !== -(movement.quantity * product.storageConversion.capacityUnitsPerBaseUnit) || movement.date !== sale.dispatchDate || movement.period !== sale.dispatchDate?.slice(0, 7) || movement.costEvidence?.status !== 'pending_deferred_bab' || movement.movementId !== `${state.runId}|product-dispatch|${encodeURIComponent(sale.dispatchId)}` || movement.reservedBefore < reservedUnits) fail(`finished-goods movement ${movement.movementId} is not backed by product dispatch`);
      rollForwardReserved -= reservedUnits;
    } else if (movement.kind === 'customer_output_stocked_reserved' || movement.kind === 'customer_goods_shipped' || movement.kind === 'customer_reservation_released_before_shipment' || movement.kind === 'customer_rejected_goods_returned') {
      const stock = customerFinishedGoodByWorkOrder.get(movement.workOrderId);
      const plan = customerPlanByWorkOrder.get(movement.workOrderId);
      if (!stock || !plan || movement.contractRef !== stock.contractRef || movement.lotId !== stock.lotId || movement.unit !== stock.unit) fail(`finished-goods movement ${movement.movementId} has no matching customer lot/contract source`);
      if (movement.kind === 'customer_output_stocked_reserved' && (movement.sourceRef !== stock.workOrderId || movement.quantity !== stock.quantity || movement.deltaCapacityUnits !== stock.storageUnits || movement.movementId !== `${state.runId}|customer-stock|${encodeURIComponent(stock.workOrderId)}` || !['reserved', 'available', 'shipped', 'returned_quarantine'].includes(stock.status))) fail(`finished-goods movement ${movement.movementId} is not backed by customer work-order output`);
      if (movement.kind === 'customer_goods_shipped' && (stock.status === 'reserved' || movement.deliveryId !== stock.deliveryId || movement.quantity !== stock.quantity || movement.deltaCapacityUnits !== -stock.storageUnits || movement.movementId !== `${state.runId}|customer-shipment|${encodeURIComponent(stock.deliveryId)}`)) fail(`finished-goods movement ${movement.movementId} is not backed by customer shipment`);
      if (movement.kind === 'customer_reservation_released_before_shipment' && (movement.quantity !== stock.quantity || movement.deltaCapacityUnits !== 0 || movement.reservedAfter !== movement.reservedBefore - stock.storageUnits || !state.events.some(row => row.type === 'customer_order_cancelled_before_shipment' && row.sourceRef === movement.sourceRef && row.workOrderId === stock.workOrderId && row.date === movement.date && movement.movementId === `${state.runId}|customer-cancel|${encodeURIComponent(row.cancellationId)}`) || plan.status !== 'cancelled_before_shipment')) fail(`finished-goods movement ${movement.movementId} is not backed by pre-shipment cancellation`);
      if (movement.kind === 'customer_rejected_goods_returned' && (movement.deliveryId !== stock.deliveryId || movement.deltaCapacityUnits !== stock.storageUnits * movement.quantity / stock.quantity || !state.events.some(row => row.type === 'customer_goods_return_source' && row.sourceRef === movement.sourceRef && row.workOrderId === stock.workOrderId && row.deliveryId === stock.deliveryId && row.quantity === movement.quantity && row.date === movement.date))) fail(`finished-goods movement ${movement.movementId} is not backed by a return source event`);
      if (movement.kind === 'customer_output_stocked_reserved') rollForwardReserved += stock.storageUnits;
      if (movement.kind === 'customer_goods_shipped' || movement.kind === 'customer_reservation_released_before_shipment') rollForwardReserved -= stock.storageUnits;
    } else fail(`finished-goods movement ${movement.movementId} has an unsupported kind`);
    const lotKey = `${movement.productId ?? ''}|${movement.workOrderId ?? ''}|${movement.lotId ?? ''}`;
    const lotBefore = lotRollForward.get(lotKey) ?? { unit: movement.unit, physical: 0, reserved: 0, quarantined: 0 };
    if (lotBefore.unit !== movement.unit || movement.physicalQuantityBefore !== lotBefore.physical || movement.reservedQuantityBefore !== lotBefore.reserved || movement.quarantinedQuantityBefore !== lotBefore.quarantined) fail(`finished-goods movement ${movement.movementId} has inconsistent lot opening quantities`);
    let expectedPhysicalDelta = 0; let expectedReservedDelta = 0; let expectedQuarantineDelta = 0;
    if (movement.kind === 'product_output_stocked' || movement.kind === 'customer_output_stocked_reserved' || movement.kind === 'customer_rejected_goods_returned') expectedPhysicalDelta = movement.quantity;
    if (movement.kind === 'product_goods_shipped' || movement.kind === 'customer_goods_shipped') expectedPhysicalDelta = -movement.quantity;
    if (movement.kind === 'product_goods_reserved' || movement.kind === 'customer_output_stocked_reserved') expectedReservedDelta = movement.quantity;
    if (movement.kind === 'product_goods_shipped' || movement.kind === 'customer_goods_shipped' || movement.kind === 'customer_reservation_released_before_shipment') expectedReservedDelta = -movement.quantity;
    if (movement.kind === 'customer_rejected_goods_returned') expectedQuarantineDelta = movement.quantity;
    const expectedPhysical = lotBefore.physical + expectedPhysicalDelta;
    const expectedReserved = lotBefore.reserved + expectedReservedDelta;
    const expectedQuarantine = lotBefore.quarantined + expectedQuarantineDelta;
    if (movement.physicalQuantityAfter !== expectedPhysical || movement.reservedQuantityAfter !== expectedReserved || movement.quarantinedQuantityAfter !== expectedQuarantine || movement.availableQuantityAfter !== expectedPhysical - expectedReserved - expectedQuarantine || expectedPhysical < 0 || expectedReserved < 0 || expectedQuarantine < 0 || expectedReserved + expectedQuarantine > expectedPhysical) fail(`finished-goods movement ${movement.movementId} fails lot physical/reserved/quarantine roll-forward`);
    lotRollForward.set(lotKey, { unit: movement.unit, physical: expectedPhysical, reserved: expectedReserved, quarantined: expectedQuarantine });
    if (movement.reservedAfter !== rollForwardReserved) fail(`finished-goods movement ${movement.movementId} fails reservation roll-forward`);
    if (rollForwardReserved < 0 || rollForwardReserved > movement.stockAfter) fail(`finished-goods movement ${movement.movementId} has negative or over-reserved physical stock`);
    rollForwardStock = movement.stockAfter;
  }
  const goodsIds = new Set();
  for (const [index, stock] of state.customerFinishedGoods.entries()) {
    if (!stock || goodsIds.has(stock.workOrderId) || !['reserved', 'available', 'shipped', 'returned_quarantine'].includes(stock.status) || !isIsoDate(stock.readyDate) || !Number.isFinite(stock.quantity) || stock.quantity <= 0 || !Number.isFinite(stock.storageUnits) || stock.storageUnits <= 0 || stock.returnedQuantity < 0 || stock.returnedStorageUnits < 0 || stock.returnedQuantity > stock.quantity) fail(`customerFinishedGoods[${index}] is invalid or duplicated`);
    goodsIds.add(stock.workOrderId);
    if (customerPlanByWorkOrder.get(stock.workOrderId)?.status === 'in_progress' || !customerPlanByWorkOrder.has(stock.workOrderId)) fail(`customer finished goods ${stock.workOrderId} is not backed by a completed work-order plan`);
    if (!stockedCustomerWorkOrders.has(stock.workOrderId)) fail(`customer finished goods ${stock.workOrderId} lacks a stock receipt movement`);
  }
  for (const stock of state.customerFinishedGoods) {
    const returned = returnedCustomerQuantities.get(stock.workOrderId) ?? { quantity: 0, storageUnits: 0 };
    if (returned.quantity !== stock.returnedQuantity || returned.storageUnits !== stock.returnedStorageUnits) fail(`customer finished goods ${stock.workOrderId} return movements do not reconcile`);
  }
  if (rollForwardStock !== state.finishedGoodsUsed || rollForwardReserved !== customerReservedStorage(state)) fail('finished-goods quantity does not reconcile from opening stock through movements');
  validateV3ProductCostingState(state.productCostLayers ?? [], state.productCostMovements ?? []);
  for (const [index, layer] of (state.productCostLayers ?? []).entries()) {
    const product = state.products.find(row => row.productId === layer.productId);
    const valuationEvent = state.events.find(row => row.type === 'product_cost_layer_recorded' && row.layer?.layerId === layer.layerId);
    const productionAssignments = (layer.productionSourceRefs ?? []).map(ref => state.assignments.find(row => row.assignmentId === ref && row.status === 'completed' && row.productId === layer.productId && row.outputQuantity > 0));
    const sourceOutput = state.finishedGoodsMovements.filter(row => row.kind === 'product_output_stocked' && row.productId === layer.productId && layer.productionSourceRefs.includes(row.sourceRef));
    const originalLayerSnapshot = { ...layer, quantityRemaining: layer.quantityOriginal, remainingCostCents: layer.totalCostCents };
    if (!product || !valuationEvent || JSON.stringify(valuationEvent.layer) !== JSON.stringify(originalLayerSnapshot) || productionAssignments.some(row => !row) || productionAssignments.reduce((sum, row) => sum + row.outputQuantity, 0) !== layer.quantityOriginal || sourceOutput.reduce((sum, row) => sum + row.quantity, 0) !== layer.quantityOriginal || sourceOutput.some(row => row.date !== layer.productionDate)) fail(`productCostLayers[${index}] is not bound to a completed product output and source event`);
    const sourcePlanEvents = state.events.filter(row => row.type === 'product_plan_estimated' && row.productId === layer.productId && row.babCalculationSnapshot && row.babCalculationRef);
    const sourceBound = sourcePlanEvents.some(row => {
      try {
        const expectedSources = getV3ProductCostSourceRefs(state, layer.productId, layer.productionSourceRefs, row.babCalculationSnapshot, row.babCalculationRef);
        return ['materials', 'directLabor', 'machine', 'manufacturingOverhead'].every(component => JSON.stringify([...(layer.componentSourceRefs?.[component] ?? [])].sort()) === JSON.stringify(expectedSources[component]));
      } catch { return false; }
    });
    if (!sourceBound) fail(`productCostLayers[${index}] component source references do not match completed run evidence and a saved BAB source-pool snapshot`);
  }
  for (const product of state.products) {
    const received = state.finishedGoodsMovements.filter(row => row.productId === product.productId && row.kind === 'product_output_stocked').reduce((sum, row) => sum + row.quantity, 0);
    const shipped = state.finishedGoodsMovements.filter(row => row.productId === product.productId && row.kind === 'product_goods_shipped').reduce((sum, row) => sum + row.quantity, 0);
    const valuedRemaining = (state.productCostLayers ?? []).filter(row => row.productId === product.productId).reduce((sum, row) => sum + row.quantityRemaining, 0);
    if (valuedRemaining > received - shipped) fail(`product ${product.productId} valued FIFO stock exceeds physical finished goods`);
  }
  for (const movement of state.productCostMovements ?? []) {
    const sale = (state.productSales ?? []).find(row => row.saleId === movement.saleId);
    const dispatch = state.finishedGoodsMovements.find(row => row.kind === 'product_goods_shipped' && row.deliveryId === movement.dispatchId);
    const illustrative = movement.valuationKind === 'illustrative_fifo';
    const event = state.events.find(row => row.type === (illustrative ? 'product_illustrative_fifo_allocation_recorded' : 'product_cost_movement_recorded') && row.movement?.movementId === movement.movementId);
    const reconciles = illustrative
      ? sale?.cogsStatus === 'pending_deferred_bab' && !Object.hasOwn(sale ?? {}, 'cogsCents') && dispatch?.costEvidence?.status === 'pending_deferred_bab' && dispatch.costEvidence.illustrativeAllocation?.costMovementId === movement.movementId
      : sale?.cogsStatus === 'valued_nonposting' && sale.cogsCents === movement.costCents && dispatch?.costEvidence?.amountCents === movement.costCents && dispatch.costEvidence?.costMovementId === movement.movementId;
    if (!sale || !dispatch || !event || JSON.stringify(event.movement) !== JSON.stringify(movement) || sale.dispatchId !== movement.dispatchId || !reconciles) fail(`product cost movement ${movement.movementId} is not reconciled to dispatch evidence`);
  }
  for (const sale of state.productSales ?? []) if (sale.dispatchId && sale.cogsStatus === 'valued_nonposting' && !(state.productCostMovements ?? []).some(row => row.saleId === sale.saleId && row.dispatchId === sale.dispatchId)) fail(`product sale ${sale.saleId} claims valued COGS without a matching cost movement`);
  return true;
}

/** Read-only A05 projection for the person/equipment/date work-planning gate. */
export function getV3EquipmentInstructionStatus(state, { personId, equipmentId, onDate }) {
  validateV3ProductWorkdayAssignments(state);
  if (!isIsoDate(onDate)) fail('onDate must be a valid ISO date');
  const person = state.people.find(row => row.id === personId); const equipment = state.equipment.find(row => row.id === equipmentId);
  if (!person || !equipment) fail('instruction projection requires a known person and equipment');
  const revision = equipmentSafetyRevision(equipment); const hazardRequirementRef = equipmentHazardRequirementRef(equipment);
  const record = (state.equipmentInstructions ?? []).filter(row => row.personId === personId && row.equipmentId === equipmentId && row.equipmentRevision === revision && row.hazardRequirementRef === hazardRequirementRef && row.completedAt <= onDate).at(-1) ?? null;
  const authorization = hazardRequirementRef ? (state.specialEquipmentAuthorizations ?? []).find(row => row.personId === personId && row.equipmentId === equipmentId && row.equipmentRevision === revision && row.requirementRef === hazardRequirementRef && row.completedAt <= onDate) ?? null : null;
  const instructionCurrent = Boolean(record && record.nextDueDate > onDate);
  const authorizationCurrent = !hazardRequirementRef || Boolean(authorization);
  return clone({ personId, equipmentId, equipmentRevision: revision, hazardRequirementRef, onDate, instructionRequired: true, instructionCurrent, authorizationRequired: Boolean(hazardRequirementRef), authorizationCurrent, ready: instructionCurrent && authorizationCurrent, lastInstructionId: record?.instructionId ?? null, lastInstructionDate: record?.completedAt ?? null, nextDueDate: record?.nextDueDate ?? null, durationMinutesForNextInstruction: record ? 30 : 60, authorizationId: authorization?.authorizationId ?? null });
}

/** Return the exact run evidence references eligible for a non-posting FIFO cost layer. */
export function getV3ProductCostSourceRefs(state, productId, productionSourceRefs, babCalculationSnapshot = null, babCalculationRef = null) {
  const product = findProduct(state, productId);
  if (!Array.isArray(productionSourceRefs) || !productionSourceRefs.length) fail('productionSourceRefs must identify completed output assignments');
  const assignments = productionSourceRefs.map(ref => state.assignments.find(row => row.assignmentId === ref && row.productId === productId && row.status === 'completed' && row.outputQuantity > 0));
  if (assignments.some(row => !row || row.timeEvidence?.status !== 'simulated_actual')) fail('cost sources require completed output assignments with time evidence');
  const materials = [...new Set(assignments.flatMap(row => Object.entries(row.materials ?? {}).filter(([, quantity]) => quantity > 0).map(([materialId]) => `material-consumption:${row.assignmentId}:${materialId}`)))].sort();
  const directLabor = [...new Set(assignments.map(row => `work-time:${row.workEvidenceId}`))].sort();
  const machine = [...new Set(assignments.filter(row => row.equipmentId).map(row => `machine-use:${row.assignmentId}:${row.equipmentId}`))].sort();
  const babSnapshot = babCalculationSnapshot ?? product.costEstimate?.babCalculation;
  const babRef = babCalculationRef ?? `BAB|${product.costEstimate?.babVersion}|${product.costEstimate?.period}|${productId}`;
  const pools = babSnapshot?.babSnapshot?.sourcePools ?? [];
  const manufacturingOverhead = [...new Set(pools
    .filter(pool => pool.period === babSnapshot?.babPeriod)
    .map(pool => `${babRef}|${pool.poolId}|${pool.sourceCostCenterId}|${pool.costBasisId}`))].sort();
  for (const [component, refs] of Object.entries({ materials, directLabor, machine, manufacturingOverhead })) {
    if (!refs.length) fail(`no eligible run source evidence exists for ${component}`);
  }
  return { materials, directLabor, machine, manufacturingOverhead };
}

/** Record a source-bound, non-posting production cost layer before the related output is sold. */
export function recordV3ProductLotCost(state, input) {
  const product = findProduct(state, input?.productId);
  const existingLayer = (state.productCostLayers ?? []).find(row => row.layerId === input?.layerId);
  if (existingLayer) {
    const replay = createV3ProductCostLayer({ ...input, quantity: existingLayer.quantityOriginal, sequence: existingLayer.sequence });
    if (JSON.stringify(existingLayer) !== JSON.stringify(replay)) fail('cost layer ID replay payload conflict');
    return immutable(state);
  }
  const productionAssignments = state.assignments.filter(row => row.productId === product.productId && row.status === 'completed' && row.outputQuantity > 0).sort((a, b) => a.completedAt.localeCompare(b.completedAt) || a.assignmentId.localeCompare(b.assignmentId));
  const alreadyCosted = new Set((state.productCostLayers ?? []).filter(row => row.productId === product.productId).flatMap(row => row.productionSourceRefs));
  const uncostedAssignments = productionAssignments.filter(row => !alreadyCosted.has(row.assignmentId));
  const expectedSources = uncostedAssignments.map(row => row.assignmentId);
  const suppliedSources = [...(input?.productionSourceRefs ?? [])].sort();
  if (!expectedSources.length || JSON.stringify([...expectedSources].sort()) !== JSON.stringify(suppliedSources)) fail('cost layer must cover the exact unvalued completed production assignments');
  const quantity = expectedSources.reduce((sum, ref) => sum + state.assignments.find(row => row.assignmentId === ref).outputQuantity, 0);
  if (!Number.isSafeInteger(product.outputQuantity) || product.outputQuantity < quantity) fail('unvalued cost layer quantity exceeds available finished goods');
  const layer = createV3ProductCostLayer({ ...input, quantity, sequence: (state.productCostLayers ?? []).length + 1 });
  if (layer.productId !== product.productId || layer.productionDate > state.currentDate || layer.productionSourceRefs.length !== expectedSources.length) fail('cost layer product/date/output source does not match current production');
  if ((state.productCostLayers ?? []).some(row => row.layerId === layer.layerId)) {
    const prior = state.productCostLayers.find(row => row.layerId === layer.layerId);
    if (JSON.stringify(prior) !== JSON.stringify(layer)) fail('cost layer ID replay payload conflict');
    return immutable(state);
  }
  const next = clone(state); next.productCostLayers ??= []; next.productCostMovements ??= [];
  next.productCostLayers.push(layer);
  next.events.push({ type: 'product_cost_layer_recorded', sourceRef: layer.layerId, date: layer.productionDate, period: layer.period, layer: clone(layer), postingStatus: 'nonposting' });
  validateV3ProductWorkdayAssignments(next);
  return immutable(next);
}

export function createV3Product(state, { productId, name, targetSegment, marketCapabilities, unitStorage, recipe = [], archetypeId = null, productionRequirements = null, managementBrief = null }) {
  id(productId, 'productId'); id(name, 'name'); number(unitStorage, 'unitStorage', { min: Number.MIN_VALUE });
  if (!Array.isArray(marketCapabilities)) fail('marketCapabilities must be an explicit array');
  if (productionRequirements) { const gaps = getV3RequirementGaps(state.people, state.equipment, productionRequirements); if (!gaps.eligible) fail('Produktanforderungen fehlen: ' + [...gaps.missingSkills, ...gaps.missingEquipment, ...gaps.missingQualifications].join(', ')); }
  if (managementBrief !== null) {
    if (!managementBrief || typeof managementBrief !== 'object' || Array.isArray(managementBrief)) fail('managementBrief must be an object');
    id(managementBrief.assignedPersonId, 'managementBrief.assignedPersonId');
    if (!state.people.some(person => person.id === managementBrief.assignedPersonId)) fail('management brief must assign an existing employee');
    id(managementBrief.customerBenefit, 'managementBrief.customerBenefit');
    if (managementBrief.customerBenefit.trim().length < 8 || managementBrief.customerBenefit.length > 300) fail('customer benefit must contain 8–300 characters');
    number(managementBrief.targetPriceCents, 'managementBrief.targetPriceCents', { min: 1, integer: true });
    if (!['basic', 'standard', 'premium'].includes(managementBrief.qualityTarget)) fail('managementBrief.qualityTarget must be basic, standard or premium');
    if (!['small', 'medium', 'large'].includes(managementBrief.targetSegment)) fail('managementBrief.targetSegment is invalid');
  }
  if (state.products.some(row => row.productId === productId)) fail(`duplicate product ID: ${productId}`);
  const normalizedRecipe = recipe.map((line, i) => { id(line.materialId, `recipe[${i}].materialId`); number(line.quantityPerUnit, `recipe[${i}].quantityPerUnit`); return clone(line); });
  const storageConversion = { storageUnitsPerOrderUnit: unitStorage, orderUnit: 'pieces', stockBaseUnitsPerOrderUnit: 1, stockBaseUnit: 'pieces', capacityUnitsPerBaseUnit: unitStorage, sources: { storageUnitsPerOrderUnit: `product_creation_input:${productId}:unitStorage`, stockBaseUnitsPerOrderUnit: 'v3-product-contract:one-piece-per-piece' } };
  const next = clone(state); next.products.push({ productId, name, targetSegment: managementBrief?.targetSegment ?? targetSegment, marketCapabilities: clone(marketCapabilities), unitStorage, storageConversion, recipe: normalizedRecipe, ...(archetypeId ? { archetypeId } : {}), ...(productionRequirements ? { productionRequirements: clone(productionRequirements) } : {}), ...(managementBrief ? { managementBrief: clone(managementBrief) } : {}), steps: [], outputQuantity: 0, pendingOutputQuantity: 0, stage: 'idea', costEstimate: null });
  next.events.push({ type: 'product_idea_created', productId, date: state.currentDate, ...(managementBrief ? { managementBrief: clone(managementBrief) } : {}) }); return immutable(next);
}

export function defineV3ProductSteps(state, productId, steps) {
  const product = findProduct(state, productId); if (!['idea', 'development'].includes(product.stage)) fail('steps can only be defined before production');
  if (!Array.isArray(steps) || !steps.length) fail('at least one step is required');
  const seen = new Set(); const normalized = steps.map((row, i) => {
    const step = clone(row); id(step.stepId, `steps[${i}].stepId`);
    if (seen.has(step.stepId)) fail(`duplicate step ID: ${step.stepId}`); seen.add(step.stepId);
    if (!['development', 'production'].includes(step.kind)) fail(`steps[${i}].kind must be development or production`);
    number(step.hours, `steps[${i}].hours`, { min: Number.MIN_VALUE });
    step.predecessors ??= []; step.requiredSkills ??= []; step.requiredEquipment ??= [];
    for (const predecessor of step.predecessors) if (predecessor === step.stepId) fail('a step cannot depend on itself');
    return step;
  });
  for (const step of normalized) for (const predecessor of step.predecessors) if (!seen.has(predecessor)) fail(`unknown predecessor ${predecessor}`);
  // Reject cycles by requiring each predecessor to appear earlier in the stable input sequence.
  const prior = new Set(); for (const step of normalized) { for (const predecessor of step.predecessors) if (!prior.has(predecessor)) fail(`predecessor ${predecessor} must be ordered before ${step.stepId}`); prior.add(step.stepId); }
  const next = clone(state); const target = findProduct(next, productId); target.steps = normalized; target.stage = normalized.some(step => step.kind === 'development') ? 'development' : 'production_definition';
  next.events.push({ type: 'product_steps_defined', productId, date: state.currentDate }); return immutable(next);
}

/** Complete one catalogued, explicitly synthetic game-skill course for an existing person. No certificate, license, equipment, time or financial posting is created. */
export function completeV3SyntheticSkillCourse(state, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).sort().join(',') !== 'completionId,courseId,personId') fail('synthetic skill course completion requires exactly completionId, courseId and personId');
  id(input.completionId, 'completionId'); id(input.courseId, 'courseId'); id(input.personId, 'personId');
  const course = syntheticCourse(input.courseId); if (!course) fail(`unknown synthetic skill course: ${input.courseId}`);
  const person = state.people.find(row => row.id === input.personId); if (!person) fail(`unknown person: ${input.personId}`);
  const sourceRef = `synthetic:course-completion:${input.completionId}`;
  const priorById = (state.syntheticTrainingCompletions ?? []).find(row => row.completionId === input.completionId);
  if (priorById) {
    if (priorById.courseId !== input.courseId || priorById.personId !== input.personId || priorById.sourceRef !== sourceRef) fail('synthetic training completion ID replay payload conflict');
    validateV3ProductWorkdayAssignments(state);
    return immutable(state);
  }
  if ((state.syntheticTrainingCompletions ?? []).some(row => row.personId === input.personId && row.courseId === input.courseId)) fail(`duplicate synthetic course completion for ${input.personId}`);
  const skill = getV3SkillDefinition(course.awards.skillId); if (!skill) fail(`unknown catalogued skill target: ${course.awards.skillId}`);
  for (const prerequisite of course.prerequisites) {
    if (!getV3SkillDefinition(prerequisite.skillId) || personSkillLevel(person, prerequisite.skillId) < prerequisite.minimumLevel) fail(`synthetic course prerequisite unmet: ${prerequisite.skillId} level ${prerequisite.minimumLevel}`);
  }
  const priorSkillLevel = personSkillLevel(person, course.awards.skillId);
  if (priorSkillLevel >= course.awards.level) fail(`person ${person.id} already has ${skill.label} at the target level`);
  const next = clone(state); next.openingCredentials ??= next.people.map(credentialSnapshot); next.syntheticTrainingCompletions ??= [];
  const nextPerson = next.people.find(row => row.id === input.personId); nextPerson.skillLevels ??= {};
  nextPerson.skillLevels[course.awards.skillId] = course.awards.level;
  if (!nextPerson.skills.includes(course.awards.skillId)) nextPerson.skills.push(course.awards.skillId);
  const completion = {
    sequence: next.syntheticTrainingCompletions.length + 1,
    completionId: input.completionId, courseId: course.id, courseVersion: course.courseVersion,
    personId: person.id, skillId: course.awards.skillId, priorSkillLevel, awardedLevel: course.awards.level,
    completedAt: state.currentDate, period: state.currentDate.slice(0, 7), sourceRef,
    sourceType: course.sourceType, credentialEffect: 'none', financialEffect: 'none',
  };
  next.syntheticTrainingCompletions.push(completion);
  next.events.push({ type: 'synthetic_skill_course_completed', eventId: `${state.runId}|synthetic-training|${encodeURIComponent(input.completionId)}`, completionId: input.completionId, courseId: course.id, personId: person.id, skillId: course.awards.skillId, awardedLevel: course.awards.level, sourceRef, date: completion.completedAt, period: completion.period, credentialEffect: 'none', financialEffect: 'none' });
  validateV3ProductWorkdayAssignments(next);
  return immutable(next);
}

/** Advance one workday at a time; weekends are skipped and never become work dates. */
export function advanceV3ProductDate(state) {
  const next = clone(state); next.currentDate = nextWorkday(state.currentDate);
  for (const plan of next.equipmentInstructionPlans ?? []) {
    if (plan.status !== 'planned' || plan.plannedDate >= next.currentDate) continue;
    plan.status = 'missed';
    const block = next.commitments.find(row => row.id === `instruction-block:${plan.instructionId}`);
    if (block) block.status = 'cancelled';
    next.events.push({ type: 'equipment_instruction_missed', instructionId: plan.instructionId, sourceRef: plan.sourceRef, date: next.currentDate, plannedDate: plan.plannedDate, reason: 'scheduled simulation workday passed without completion' });
  }
  next.events.push({ type: 'product_calendar_advanced', date: next.currentDate }); return immutable(next);
}

/** Record an explicitly synthetic international material order. It reserves no stock and has no monetary effect. */
export function placeV3InternationalMaterialOrder(state, input) {
  const allowed = ['orderId', 'shipmentId', 'materialId', 'quantity', 'supplierId', 'sourceRef', 'fixtureId', 'baselineEtaDate', 'etaDate', 'lagDays'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) fail('international material order requires exactly the explicit synthetic order, quantity and ETA fields');
  for (const key of ['orderId', 'shipmentId', 'materialId', 'supplierId', 'sourceRef', 'fixtureId']) id(input[key], key);
  number(input.quantity, 'quantity', { min: Number.MIN_VALUE }); number(input.lagDays, 'lagDays', { integer: true });
  if (!input.fixtureId.startsWith('synthetic:') || !isIsoDate(input.baselineEtaDate) || !isIsoDate(input.etaDate) || !state.materials.some(row => row.id === input.materialId)) fail('international material order must bind a synthetic fixture, known material and valid ETA dates');
  const quote = getV3SupplierScenarioQuotes(input.materialId, input.quantity).find(row => row.supplierId === input.supplierId);
  const profile = V3_SUPPLIER_SCENARIO_PROFILES[input.supplierId];
  if (!quote || !profile) fail('supplier quote requires a material with an explicit D-0128 scenario anchor');
  if (input.quantity < profile.minimumQuantity) fail(`${profile.label} requires a minimum quantity of ${profile.minimumQuantity} ${quote.unit}`);
  if (input.lagDays !== 0 || input.etaDate !== input.baselineEtaDate || input.fixtureId !== 'synthetic:D-0173:supplier-profile-v1') fail('D-0173 supplier orders use fixed profile lead times; unsupported delay fixtures are rejected');
  if (Math.floor((Date.parse(`${input.baselineEtaDate}T00:00:00Z`) - Date.parse(`${state.currentDate}T00:00:00Z`)) / 86400000) !== profile.deliveryDays) fail(`${profile.label} delivery date must match its D-0173 lead time`);
  const baseline = Date.parse(`${input.baselineEtaDate}T00:00:00Z`); const eta = Date.parse(`${input.etaDate}T00:00:00Z`);
  if (eta - baseline !== input.lagDays * 86400000 || eta < baseline) fail('shipment ETA must equal baseline ETA plus the explicit nonnegative synthetic lag');
  if (state.materialShipments?.some(row => row.orderId === input.orderId || row.shipmentId === input.shipmentId)) fail('duplicate material order or shipment ID');
  const shipment = { ...clone(input), orderedAt: state.currentDate, supplierQuoteSnapshot: { ...quote, acceptedAt: state.currentDate, quoteId: `D-0173|${encodeURIComponent(input.orderId)}|quote`, snapshotVersion: 'D-0173-SUPPLIER-QUOTE-1' }, status: 'in_transit', receivedAt: null };
  const next = clone(state); next.materialShipments ??= []; next.materialMovements ??= [];
  next.materialShipments.push(shipment);
  next.events.push({ type: 'international_material_order_placed', orderId: input.orderId, shipmentId: input.shipmentId, materialId: input.materialId, quantity: input.quantity, supplierId: input.supplierId, sourceRef: input.sourceRef, fixtureId: input.fixtureId, baselineEtaDate: input.baselineEtaDate, etaDate: input.etaDate, lagDays: input.lagDays, orderedAt: shipment.orderedAt, supplierQuoteSnapshot: clone(shipment.supplierQuoteSnapshot) });
  validateV3ProductWorkdayAssignments(next);
  return immutable(next);
}

/** Receive one due shipment into the existing physical material balance. Replays are idempotent. */
export function receiveV3InternationalMaterialShipment(state, shipmentId) {
  id(shipmentId, 'shipmentId'); const current = (state.materialShipments ?? []).find(row => row.shipmentId === shipmentId);
  if (!current) fail(`unknown international material shipment: ${shipmentId}`);
  if (current.status === 'received') return immutable(state);
  if (state.currentDate < current.etaDate) fail(`international material shipment is not due before ${current.etaDate}`);
  const next = clone(state); const shipment = next.materialShipments.find(row => row.shipmentId === shipmentId);
  const material = next.materials.find(row => row.id === shipment.materialId); const before = material.quantity; material.quantity += shipment.quantity;
  shipment.status = 'received'; shipment.receivedAt = state.currentDate;
  const movement = { movementId: `${state.runId}|material-receipt|${encodeURIComponent(shipmentId)}`, shipmentId, orderId: shipment.orderId, materialId: shipment.materialId, quantity: shipment.quantity, unit: 'units', date: state.currentDate, period: state.currentDate.slice(0, 7), sourceRef: shipment.sourceRef, fixtureId: shipment.fixtureId, lagDays: shipment.lagDays, quantityBefore: before, quantityAfter: material.quantity, monetaryStatus: 'nonposting_pending_cost_source' };
  next.materialMovements ??= []; next.materialMovements.push(movement);
  next.events.push({ type: 'international_material_shipment_received', ...clone(movement) });
  const quote = shipment.supplierQuoteSnapshot;
  if (!quote || !Array.isArray(next.supplierInvoiceEvidence)) fail('accepted supplier quote is required before invoice evidence can be created');
  const invoiceDate = state.currentDate;
  const invoice = { invoiceId: `${state.runId}|supplier-invoice|${encodeURIComponent(shipment.orderId)}`, orderId: shipment.orderId, shipmentId, supplierId: quote.supplierId, quoteId: quote.quoteId, priceSnapshotFingerprint: JSON.stringify(quote), materialId: shipment.materialId, quantity: shipment.quantity, unit: quote.unit, invoiceDate, paymentTermCalendarDays: 14, dueDate: addV3SupplierPaymentDays(invoiceDate, 14), amountCents: quote.totalNetAmountCents, currency: 'EUR', amountBasis: 'net_before_tax', taxStatus: 'unknown', taxAmountCents: null, status: 'pending_non_posting', sourceRef: `${shipment.sourceRef}:invoice`, receiptMovementId: movement.movementId, period: invoiceDate.slice(0, 7) };
  if (next.supplierInvoiceEvidence.some(row => row.invoiceId === invoice.invoiceId)) fail('supplier invoice evidence already exists for this order');
  next.supplierInvoiceEvidence.push(invoice);
  next.events.push({ type: 'supplier_invoice_evidence_created', ...clone(invoice) });
  validateV3ProductWorkdayAssignments(next);
  return immutable(next);
}

function calculateV3ProductDirectEstimate({ netPriceCents, directCosts }) {
  const full = calculateV3OfferEstimate({ netPriceCents, directCosts, babAllocatedCents: 0 });
  const { babAllocatedCents, resultAfterBabCents, ...directOnly } = full;
  return directOnly;
}

const PRODUCT_COST_ROUNDING_POLICY = 'already_integer_cents_no_rounding';
function captureProductCostLineEvidence(directCosts) {
  if (!Array.isArray(directCosts)) fail('directCosts must be an array');
  if (directCosts.length === 0) fail('at least one explicitly sourced direct cost line is required; empty costs cannot imply zero cost');
  const ids = new Set(); const refs = new Set();
  return directCosts.map((line, index) => {
    if (!line || typeof line !== 'object') fail(`directCosts[${index}] must be an object`);
    id(line.unit, `directCosts[${index}].unit`);
    if (line.unit !== 'EUR') fail(`directCosts[${index}].unit must be EUR for integer-cent plan amounts`);
    id(line.sourceRef, `directCosts[${index}].sourceRef`);
    if (line.roundingPolicy !== PRODUCT_COST_ROUNDING_POLICY) fail(`directCosts[${index}].roundingPolicy must be ${PRODUCT_COST_ROUNDING_POLICY}`);
    if (!Number.isSafeInteger(line.amountCents) || line.amountCents <= 0) fail(`directCosts[${index}].amountCents must be positive integer cents; zero-cost products require a separate explicit confirmation flow`);
    if (!Number.isSafeInteger(line.roundingResultCents) || line.roundingResultCents !== line.amountCents) fail(`directCosts[${index}].roundingResultCents must equal the supplied integer-cent amount`);
    const lineId = id(line.id, `directCosts[${index}].id`);
    if (ids.has(lineId)) fail(`directCosts contains duplicate ID: ${lineId}`);
    if (refs.has(line.sourceRef)) fail(`directCosts contains duplicate sourceRef: ${line.sourceRef}`);
    ids.add(lineId); refs.add(line.sourceRef);
    return { id: lineId, unit: line.unit, sourceRef: line.sourceRef, roundingPolicy: line.roundingPolicy, roundingResultCents: line.roundingResultCents };
  });
}
function validateProductCostLineEvidence(calculation, evidence, label) {
  if (!calculation || !Array.isArray(calculation.directCosts) || !Array.isArray(evidence) || evidence.length !== calculation.directCosts.length) fail(`${label} cost-line evidence is missing or incomplete`);
  const ids = new Set(); const refs = new Set();
  for (let index = 0; index < evidence.length; index += 1) {
    const row = evidence[index]; const cost = calculation.directCosts[index];
    if (!row || row.id !== cost.id || ids.has(row.id) || typeof row.sourceRef !== 'string' || !row.sourceRef.trim() || refs.has(row.sourceRef) || row.unit !== 'EUR' || row.roundingPolicy !== PRODUCT_COST_ROUNDING_POLICY || row.roundingResultCents !== cost.amountCents) fail(`${label} cost-line evidence is contradictory or duplicated`);
    ids.add(row.id); refs.add(row.sourceRef);
  }
  return true;
}

/** V3 product planning records DB I/direct-cost plan values; BAB remains a later-version gate. */
export function estimateV3Product(state, productId, { netPriceCents, directCosts, costVersion, babAllocatedCents, babVersion }) {
  id(costVersion, 'costVersion');
  const costLineEvidence = captureProductCostLineEvidence(directCosts);
  const hasExplicitBab = babVersion != null || babAllocatedCents != null;
  if (hasExplicitBab) id(babVersion, 'babVersion');
  const calculation = hasExplicitBab
    ? calculateV3OfferEstimate({ netPriceCents, directCosts, babAllocatedCents: babAllocatedCents ?? 0 })
    : calculateV3ProductDirectEstimate({ netPriceCents, directCosts });
  const next = clone(state); const product = findProduct(next, productId);
  product.costEstimate = { modelVersion: calculation.modelVersion, netPriceCents: calculation.netPriceCents, period: state.currentDate.slice(0, 7), costVersion, ...(hasExplicitBab ? { babVersion } : { babStatus: 'pending_deferred_bab' }), calculation: clone(calculation), costLineEvidence: clone(costLineEvidence), estimatedAt: state.currentDate, source: 'plan_only' };
  product.stage = 'calculated'; next.events.push({ type: 'product_plan_estimated', productId, date: state.currentDate, modelVersion: calculation.modelVersion, costEstimateSnapshot: clone(product.costEstimate) }); return immutable(next);
}

/** Product unit planning uses the same explicit, cent-reconciled BAB contract as customer offers. */
export function estimateV3ProductWithBab(state, productId, { period, offerDate, netPriceCents, directCosts, sourcePools, offerDrivers, costVersion, babVersion }) {
  id(costVersion, 'costVersion'); id(babVersion, 'babVersion');
  const babCalculation = calculateV3OfferWithBab({ period, offerDate, netPriceCents, directCosts, sourcePools, offerDrivers });
  const estimated = estimateV3Product(state, productId, { netPriceCents, directCosts, babAllocatedCents: babCalculation.babAllocatedCents, costVersion, babVersion });
  const next = clone(estimated); const product = findProduct(next, productId);
  product.costEstimate.babCalculation = clone(babCalculation);
  product.costEstimate.period = period;
  product.costEstimate.offerDate = offerDate;
  next.events[next.events.length - 1].babCalculationRef = `BAB|${babVersion}|${period}|${productId}`;
  next.events[next.events.length - 1].babCalculationSnapshot = clone(babCalculation);
  next.events[next.events.length - 1].costEstimateSnapshot = clone(product.costEstimate);
  return immutable(next);
}

export function planV3ProductStep(state, { productId, stepId, date, personId, equipmentId, outputQuantity = 0, materialQuantities = {} }) {
  if (!isIsoDate(date) || Date.parse(`${date}T00:00:00Z`) < Date.parse(`${state.currentDate}T00:00:00Z`)) fail('date must be a valid date on/after currentDate');
  if (!isWorkday(date)) fail('product work may only be planned on Monday through Friday');
  const product = findProduct(state, productId); const step = findStep(product, stepId);
  if (state.assignments.some(row => row.productId === productId && row.stepId === stepId && row.status !== 'cancelled')) fail(`step ${stepId} is already assigned`);
  for (const predecessor of step.predecessors) {
    const prior = state.assignments.find(row => row.productId === productId && row.stepId === predecessor && row.status !== 'cancelled');
    if (!prior) fail(`predecessor ${predecessor} must be scheduled first`);
    if (prior.date > date) fail(`step ${stepId} cannot be scheduled before predecessor ${predecessor}`);
    if (prior.status === 'completed' && prior.completedAt > date) fail(`step ${stepId} cannot be scheduled before predecessor ${predecessor} was completed`);
  }
  const person = state.people.find(row => row.id === personId); if (!person) fail(`unknown person: ${personId}`);
  const machine = equipmentId == null ? null : state.equipment.find(row => row.id === equipmentId); if (equipmentId != null && !machine) fail(`unknown equipment: ${equipmentId}`);
  if (machine) requireEquipmentInstruction(state, personId, machine, date);
  for (const skill of step.requiredSkills) if (!person.skills.includes(skill)) fail(`person ${personId} lacks skill ${skill}`);
  if (step.requiredEquipment.length && !machine) fail(`step ${stepId} requires equipment`);
  for (const capability of step.requiredEquipment) if (!machine.capabilities.includes(capability)) fail(`equipment ${equipmentId} lacks capability ${capability}`);
  const productivityFactor = plannedProductivity(state, person);
  const plannedHours = step.hours / productivityFactor;
  const dayRows = keysForDate(state, date);
  if (usedHours(dayRows, 'personId', personId) + plannedHours > person.hoursPerDay) fail(`person ${personId} daily capacity exceeded on ${date}`);
  if (machine && usedHours(dayRows, 'equipmentId', equipmentId) + plannedHours > machine.hoursPerDay) fail(`equipment ${equipmentId} daily capacity exceeded on ${date}`);
  number(outputQuantity, 'outputQuantity', { integer: true });
  if (step.kind !== 'production' && outputQuantity !== 0) fail('only production steps may declare output');
  if (step.kind === 'production' && !product.costEstimate) fail('production requires an A03 cost estimate');
  const normalizedMaterials = {};
  for (const [materialId, rawQuantity] of Object.entries(materialQuantities)) {
    number(rawQuantity, `materialQuantities.${materialId}`, { min: Number.MIN_VALUE });
    const material = state.materials.find(row => row.id === materialId); if (!material) fail(`unknown material: ${materialId}`);
    if (material.quantity - reservedMaterial(state, materialId) < rawQuantity) fail(`insufficient material: ${materialId} on ${date}`);
    normalizedMaterials[materialId] = rawQuantity;
  }
  if (step.kind === 'production' && outputQuantity > 0) {
    for (const line of product.recipe) {
      const required = line.quantityPerUnit * outputQuantity;
      if ((normalizedMaterials[line.materialId] ?? 0) < required) fail(`production material plan is below recipe requirement: ${line.materialId}`);
    }
  }
  if (step.kind === 'production' && outputQuantity > 0) {
    const plannedOutput = state.assignments.filter(row => row.status === 'planned').reduce((sum, row) => sum + row.outputQuantity * findProduct(state, row.productId).storageConversion.capacityUnitsPerBaseUnit, 0);
    const workInProcessOutput = state.products.reduce((sum, row) => sum + row.pendingOutputQuantity * row.storageConversion.capacityUnitsPerBaseUnit, 0);
    const reservedSpace = plannedOutput + workInProcessOutput;
    if (outputQuantity * product.storageConversion.capacityUnitsPerBaseUnit + reservedSpace > state.finishedGoodsCapacity - state.finishedGoodsUsed) fail(`finished-goods storage capacity exceeded on ${date}`);
    if (product.steps.some(other => other.stepId !== stepId && state.assignments.some(row => row.productId === productId && row.stepId === other.stepId && row.outputQuantity > 0 && row.status !== 'cancelled'))) fail('finished goods output already assigned for this product');
  }
  const next = clone(state); const sequence = next.nextAssignmentSequence++;
  next.assignments.push({ assignmentId: `${state.runId}:assignment:${sequence}`, productId, stepId, date, personId, equipmentId, ...(machine ? { equipmentSafetyRevision: equipmentSafetyRevision(machine), hazardRequirementRef: equipmentHazardRequirementRef(machine) } : {}), standardWorkHours: step.hours, productivityFactor, hours: plannedHours, materials: normalizedMaterials, outputQuantity, status: 'planned' });
  if (step.kind === 'production') findProduct(next, productId).stage = 'in_production';
  next.events.push({ type: 'product_step_planned', productId, stepId, date, personId, equipmentId, standardWorkHours: step.hours, plannedHours, productivityFactor, planOnly: true }); return immutable(next);
}

export function completeV3ProductStep(state, assignmentId) {
  const next = clone(state); const assignment = next.assignments.find(row => row.assignmentId === assignmentId); if (!assignment) fail(`unknown assignment: ${assignmentId}`);
  if (assignment.status === 'completed') return immutable(state);
  if (assignment.status !== 'planned') fail(`assignment is ${assignment.status}`);
  if (state.currentDate < assignment.date) fail(`assignment is scheduled for ${assignment.date} and cannot be completed on ${state.currentDate}`);
  const product = findProduct(next, assignment.productId); const step = findStep(product, assignment.stepId);
  for (const predecessor of step.predecessors) {
    const prior = next.assignments.find(row => row.productId === product.productId && row.stepId === predecessor && row.status !== 'cancelled');
    if (!prior || prior.status !== 'completed') fail(`predecessor ${predecessor} is not complete`);
    if (prior.completedAt > assignment.date) fail(`predecessor ${predecessor} completed after ${step.stepId} was scheduled`);
    if (prior.date > assignment.date) fail(`predecessor ${predecessor} is scheduled after ${step.stepId}`);
  }
  for (const [materialId, quantity] of Object.entries(assignment.materials)) {
    const material = next.materials.find(row => row.id === materialId); if (material.quantity < quantity) fail(`material changed before completion: ${materialId}`); material.quantity -= quantity;
  }
  if (step.kind === 'production') {
    product.pendingOutputQuantity += assignment.outputQuantity;
  }
  assignment.status = 'completed'; assignment.completedAt = state.currentDate; assignment.workEvidenceId = state.runId + ':product-work:' + assignment.assignmentId;
  assignment.timeEvidence = { status: 'simulated_actual', minutes: assignment.hours * 60, unit: 'minutes', sourceRef: assignment.assignmentId, workDate: state.currentDate, period: state.currentDate.slice(0, 7), basis: 'completed_simulation_work_block', label: 'Modellierte Spieldauer; nicht extern gemessene Istzeit' };
  assignment.costEvidence = { status: 'pending', reason: 'No approved actual operation-cost rate is available for this operation.' };
  const allStepsComplete = product.steps.every(item => next.assignments.some(row => row.productId === product.productId && row.stepId === item.stepId && row.status === 'completed'));
  if (allStepsComplete && product.pendingOutputQuantity > 0) {
    const storage = product.pendingOutputQuantity * product.storageConversion.capacityUnitsPerBaseUnit;
    if (storage > next.finishedGoodsCapacity - next.finishedGoodsUsed) fail('finished-goods storage capacity exceeded');
    const outputQuantity = product.pendingOutputQuantity; product.outputQuantity += outputQuantity; product.pendingOutputQuantity = 0; product.stage = 'finished_goods';
    appendCustomerFinishedGoodsMovement(next, { productId: product.productId, lotId: `LOT|PRODUCT|${encodeURIComponent(product.productId)}` }, { movementId: `${next.runId}|product-output|${encodeURIComponent(assignment.assignmentId)}`, kind: 'product_output_stocked', date: state.currentDate, sourceRef: assignment.assignmentId, quantity: outputQuantity, unit: 'pieces', storageDelta: storage, reservedBefore: customerReservedStorage(next), reservedAfter: customerReservedStorage(next) });
  } else if (allStepsComplete) product.stage = 'production_complete';
  next.events.push({
    type: 'product_step_completed', workEvidenceId: assignment.workEvidenceId, assignmentId: assignment.assignmentId,
    sourceRef: assignment.assignmentId, productId: product.productId, stepId: step.stepId,
    date: state.currentDate, period: state.currentDate.slice(0, 7),
    quantityEvidence: assignment.outputQuantity > 0 ? { value: assignment.outputQuantity, unit: 'piece', sourceRef: assignment.assignmentId } : null,
    timeEvidence: clone(assignment.timeEvidence),
    costEvidence: clone(assignment.costEvidence),
  }); return immutable(next);
}

export function cancelV3ProductStep(state, assignmentId) {
  const next = clone(state); const assignment = next.assignments.find(row => row.assignmentId === assignmentId); if (!assignment) fail(`unknown assignment: ${assignmentId}`);
  if (assignment.status !== 'planned') fail(`assignment is ${assignment.status}`);
  assignment.status = 'cancelled'; next.events.push({ type: 'product_step_cancelled', productId: assignment.productId, stepId: assignment.stepId, date: assignment.date }); return immutable(next);
}

const CUSTOMER_CONTRACT_FIELDS = ['contractRef', 'inquiryId', 'offerId', 'decisionId', 'contractType', 'customerPartyId', 'buyerPartyId', 'acceptancePartyId', 'performanceCriterionRef', 'acceptanceCriterionRef', 'orderUnit'];

/** Plan explicit customer-work-order steps against the same daily people/equipment/material limits as T-0066 products. */
export function planV3CustomerWorkOrder(state, { workOrderId, contractSnapshot, operations }) {
  id(workOrderId, 'workOrderId');
  if (!contractSnapshot || typeof contractSnapshot !== 'object' || Array.isArray(contractSnapshot)) fail('contractSnapshot must be an explicit object');
  for (const field of CUSTOMER_CONTRACT_FIELDS) id(contractSnapshot[field], `contractSnapshot.${field}`);
  number(contractSnapshot.orderQuantity, 'contractSnapshot.orderQuantity', { min: Number.MIN_VALUE });
  if (!Array.isArray(operations) || operations.length === 0) fail('at least one explicit operation is required');
  if (state.customerWorkOrderPlans.some(plan => plan.workOrderId === workOrderId)) fail(`work order ${workOrderId} already has an operational plan`);
  const seen = new Set(); const normalized = [];
  for (let index = 0; index < operations.length; index++) {
    const input = clone(operations[index]);
    id(input.operationId, `operations[${index}].operationId`); id(input.date, `operations[${index}].date`); id(input.personId, `operations[${index}].personId`);
    if (!isIsoDate(input.date) || input.date < state.currentDate || !isWorkday(input.date)) fail(`operations[${index}].date must be a workday on/after currentDate`);
    if (seen.has(input.operationId)) fail(`duplicate operation ID: ${input.operationId}`); seen.add(input.operationId);
    number(input.hours, `operations[${index}].hours`, { min: Number.MIN_VALUE });
    if (!Array.isArray(input.requiredSkills) || !Array.isArray(input.requiredEquipmentCapabilities) || !Array.isArray(input.predecessors) || !input.materials || typeof input.materials !== 'object' || Array.isArray(input.materials) || !Object.hasOwn(input, 'equipmentId')) fail(`operations[${index}] must explicitly provide skills, equipment, capabilities, materials and predecessors`);
    for (const priorId of input.predecessors) {
      const prior = normalized.find(row => row.operationId === priorId);
      if (!prior) fail(`predecessor ${priorId} must be declared earlier in the plan`);
      if (prior.date > input.date) fail(`operation ${input.operationId} cannot be scheduled before predecessor ${priorId}`);
    }
    const person = state.people.find(row => row.id === input.personId); if (!person) fail(`unknown person: ${input.personId}`);
    for (const skill of input.requiredSkills) if (!person.skills.includes(skill)) fail(`person ${input.personId} lacks skill ${skill}`);
    const machine = input.equipmentId == null ? null : state.equipment.find(row => row.id === input.equipmentId);
    if (input.equipmentId != null && !machine) fail(`unknown equipment: ${input.equipmentId}`);
    if (machine) requireEquipmentInstruction(state, input.personId, machine, input.date);
    if (input.requiredEquipmentCapabilities.length && !machine) fail(`operation ${input.operationId} requires equipment`);
    for (const capability of input.requiredEquipmentCapabilities) if (!machine.capabilities.includes(capability)) fail(`equipment ${input.equipmentId} lacks capability ${capability}`);
    const materials = {};
    for (const [materialId, quantity] of Object.entries(input.materials)) {
      number(quantity, `operations[${index}].materials.${materialId}`, { min: Number.MIN_VALUE });
      if (!state.materials.some(row => row.id === materialId)) fail(`unknown material: ${materialId}`);
      if (state.materials.find(row => row.id === materialId).quantity - reservedMaterial(state, materialId) - normalized.reduce((sum, row) => sum + (row.materials[materialId] ?? 0), 0) < quantity) fail(`insufficient material: ${materialId}`);
      materials[materialId] = quantity;
    }
    const row = { assignmentId: `${workOrderId}|${input.operationId}`, workOrderId, operationId: input.operationId, date: input.date, personId: input.personId, equipmentId: input.equipmentId, ...(machine ? { equipmentSafetyRevision: equipmentSafetyRevision(machine), hazardRequirementRef: equipmentHazardRequirementRef(machine) } : {}), hours: input.hours, requiredSkills: clone(input.requiredSkills), requiredEquipmentCapabilities: clone(input.requiredEquipmentCapabilities), predecessors: clone(input.predecessors), materials, status: 'planned' };
    const dayRows = [...keysForDate(state, input.date), ...normalized.filter(item => item.date === input.date)];
    if (usedHours(dayRows, 'personId', input.personId) + row.hours > person.hoursPerDay) fail(`person ${input.personId} daily capacity exceeded`);
    if (machine && usedHours(dayRows, 'equipmentId', input.equipmentId) + row.hours > machine.hoursPerDay) fail(`equipment ${input.equipmentId} daily capacity exceeded`);
    normalized.push(row);
  }
  const next = clone(state);
  next.customerWorkOrderPlans.push({ workOrderId, contractSnapshot: clone(contractSnapshot), status: 'in_progress', financeStatus: 'pending_non_posting', operations: normalized.map(row => ({ operationId: row.operationId, date: row.date, personId: row.personId, equipmentId: row.equipmentId, ...(row.equipmentId != null ? { equipmentSafetyRevision: row.equipmentSafetyRevision, hazardRequirementRef: row.hazardRequirementRef } : {}), hours: row.hours, requiredSkills: row.requiredSkills, requiredEquipmentCapabilities: row.requiredEquipmentCapabilities, predecessors: row.predecessors, materials: row.materials, status: row.status, completedAt: null })) });
  next.customerAssignments.push(...normalized);
  next.events.push({ type: 'customer_work_order_plan_created', workOrderId, date: state.currentDate });
  return immutable(next);
}

/** Complete only a planned customer operation on/after its scheduled day; material quantity is consumed once. */
export function completeV3CustomerWorkOrderOperation(state, { workOrderId, operationId }) {
  const next = clone(state); const plan = next.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId); if (!plan) fail(`unknown customer work order: ${workOrderId}`);
  const operation = plan.operations.find(row => row.operationId === operationId); if (!operation) fail(`unknown customer operation: ${operationId}`);
  if (operation.status === 'completed') return immutable(state);
  if (operation.status !== 'planned') fail(`customer operation is ${operation.status}`);
  if (state.currentDate < operation.date) fail(`customer operation is scheduled for ${operation.date} and cannot be completed on ${state.currentDate}`);
  for (const predecessorId of operation.predecessors) {
    const predecessor = plan.operations.find(row => row.operationId === predecessorId);
    if (!predecessor || predecessor.status !== 'completed' || predecessor.completedAt > operation.date) fail(`predecessor ${predecessorId} is not complete before ${operationId}`);
  }
  for (const [materialId, quantity] of Object.entries(operation.materials)) {
    const material = next.materials.find(row => row.id === materialId); if (material.quantity < quantity) fail(`material changed before completion: ${materialId}`); material.quantity -= quantity;
  }
  operation.status = 'completed'; operation.completedAt = state.currentDate;
  const assignment = next.customerAssignments.find(row => row.workOrderId === workOrderId && row.operationId === operationId); assignment.status = 'completed'; assignment.completedAt = state.currentDate;
  if (plan.operations.every(row => row.status === 'completed')) {
    const storageUnits = customerStorageUnits(plan);
    const stock = { workOrderId, contractRef: plan.contractSnapshot.contractRef, lotId: `LOT|${encodeURIComponent(workOrderId)}`, quantity: plan.contractSnapshot.orderQuantity, unit: plan.contractSnapshot.orderUnit, storageUnits, returnedQuantity: 0, returnedStorageUnits: 0, status: 'reserved', readyDate: state.currentDate, deliveryId: null, shippedDate: null };
    const prior = next.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
    if (prior) fail(`customer finished-goods lot already exists for ${workOrderId}`);
    const occupiedBefore = next.finishedGoodsUsed;
    if (occupiedBefore + storageUnits > next.finishedGoodsCapacity) fail('finished-goods storage capacity exceeded');
    next.customerFinishedGoods.push(stock);
    const reservedAfterStock = customerReservedStorage(next);
    appendCustomerFinishedGoodsMovement(next, stock, { movementId: `${next.runId}|customer-stock|${encodeURIComponent(workOrderId)}`, kind: 'customer_output_stocked_reserved', date: state.currentDate, sourceRef: workOrderId, quantity: stock.quantity, unit: stock.unit, storageDelta: storageUnits, reservedBefore: reservedAfterStock - storageUnits, reservedAfter: reservedAfterStock });
    plan.status = 'ready_for_delivery'; plan.financeStatus = 'performance_pending';
  }
  next.events.push({ type: 'customer_work_order_operation_completed', workOrderId, operationId, date: state.currentDate });
  return immutable(next);
}

/** Return only T-0065 player-safe inquiries, never competitor offers or identities. */
export function shipV3CustomerFinishedGoods(state, { deliveryId, workOrderId, date, sourceRef }) {
  id(deliveryId, 'deliveryId'); id(workOrderId, 'workOrderId'); id(sourceRef, 'sourceRef');
  if (!isIsoDate(date) || date !== state.currentDate) fail('customer shipment date must equal currentDate');
  const movementId = `${state.runId}|customer-shipment|${encodeURIComponent(deliveryId)}`;
  const prior = state.finishedGoodsMovements.find(row => row.movementId === movementId);
  if (prior) {
    if (prior.workOrderId !== workOrderId || prior.date !== date || prior.sourceRef !== sourceRef) fail('customer shipment replay payload conflict');
    return immutable(state);
  }
  const stock = state.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
  if (!stock || stock.status !== 'reserved') fail('customer finished goods must be reserved and ready before shipment');
  const next = clone(state); const target = next.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
  const reservedBefore = customerReservedStorage(next); target.status = 'shipped'; target.deliveryId = deliveryId; target.shippedDate = date;
  appendCustomerFinishedGoodsMovement(next, target, { movementId, kind: 'customer_goods_shipped', date, sourceRef, deliveryId, quantity: target.quantity, unit: target.unit, storageDelta: -target.storageUnits, reservedBefore, reservedAfter: customerReservedStorage(next) });
  return immutable(next);
}

export function releaseV3CustomerFinishedGoodsReservation(state, { cancellationId, workOrderId, date, sourceRef }) {
  id(cancellationId, 'cancellationId'); id(workOrderId, 'workOrderId'); id(sourceRef, 'sourceRef');
  if (!isIsoDate(date) || date !== state.currentDate) fail('reservation release date must equal currentDate');
  const movementId = `${state.runId}|customer-cancel|${encodeURIComponent(cancellationId)}`;
  const prior = state.finishedGoodsMovements.find(row => row.movementId === movementId);
  if (prior) {
    if (prior.workOrderId !== workOrderId || prior.date !== date || prior.sourceRef !== sourceRef) fail('reservation release replay payload conflict');
    return immutable(state);
  }
  const stock = state.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
  if (!stock || stock.status !== 'reserved') fail('only reserved customer finished goods can be released before shipment');
  const next = clone(state); const target = next.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
  const plan = next.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId);
  if (!plan || plan.status !== 'ready_for_delivery') fail('customer reservation release requires a ready work order');
  plan.status = 'cancelled_before_shipment';
  const reservedBefore = customerReservedStorage(next); target.status = 'available';
  appendCustomerFinishedGoodsMovement(next, target, { movementId, kind: 'customer_reservation_released_before_shipment', date, sourceRef, quantity: target.quantity, unit: target.unit, storageDelta: 0, reservedBefore, reservedAfter: customerReservedStorage(next) });
  next.events.push({ type: 'customer_order_cancelled_before_shipment', cancellationId, sourceRef, workOrderId, date, period: date.slice(0, 7) });
  return immutable(next);
}

export function recordV3CustomerFinishedGoodsReturn(state, { returnId, workOrderId, deliveryId, date, sourceRef, quantity, unit }) {
  id(returnId, 'returnId'); id(workOrderId, 'workOrderId'); id(deliveryId, 'deliveryId'); id(sourceRef, 'sourceRef');
  if (!isIsoDate(date) || date !== state.currentDate) fail('customer return date must equal currentDate');
  number(quantity, 'return quantity', { min: Number.MIN_VALUE }); id(unit, 'return unit');
  const movementId = `${state.runId}|customer-return|${encodeURIComponent(returnId)}`;
  const prior = state.finishedGoodsMovements.find(row => row.movementId === movementId);
  if (prior) {
    if (prior.workOrderId !== workOrderId || prior.deliveryId !== deliveryId || prior.date !== date || prior.sourceRef !== sourceRef || prior.quantity !== quantity || prior.unit !== unit) fail('customer return replay payload conflict');
    return immutable(state);
  }
  const stock = state.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
  if (!stock || stock.status !== 'shipped' || stock.deliveryId !== deliveryId || stock.unit !== unit || quantity > stock.quantity - stock.returnedQuantity) fail('customer return must match shipped goods and remaining quantity');
  const capacityUnits = stock.storageUnits * quantity / stock.quantity;
  if (state.finishedGoodsUsed + capacityUnits > state.finishedGoodsCapacity) fail('finished-goods storage capacity exceeded for returned goods');
  const next = clone(state); const target = next.customerFinishedGoods.find(row => row.workOrderId === workOrderId);
  const reservedBefore = customerReservedStorage(next); target.returnedQuantity += quantity; target.returnedStorageUnits += capacityUnits;
  if (target.returnedQuantity === target.quantity) target.status = 'returned_quarantine';
  appendCustomerFinishedGoodsMovement(next, target, { movementId, kind: 'customer_rejected_goods_returned', date, sourceRef, deliveryId, quantity, unit, storageDelta: capacityUnits, reservedBefore, reservedAfter: customerReservedStorage(next) });
  next.events.push({ type: 'customer_goods_return_source', returnId, sourceRef, workOrderId, deliveryId, quantity, unit, date, period: date.slice(0, 7) });
  return immutable(next);
}
export function getV3ProductMarketOpportunities(productState, marketState, productId) {
  const product = findProduct(productState, productId);
  if (product.stage !== 'finished_goods' || product.outputQuantity < 1) fail('product has no finished goods available');
  return getV3MarketPlayerView(marketState).inquiries.filter(row => row.status === 'open' && row.segmentId === product.targetSegment && row.requiredCapacity <= product.outputQuantity && row.requiredCapabilities.every(capability => product.marketCapabilities.includes(capability)))
    .map(row => ({ inquiryId: row.inquiryId, customerId: row.customerId, expiresAt: row.expiresAt, segmentId: row.segmentId, requiredCapacity: row.requiredCapacity, requiredCapabilities: clone(row.requiredCapabilities), availableProductQuantity: product.outputQuantity }));
}

/** Seller submits a non-posting offer to an explicitly identified market customer. */
export function submitV3ProductSaleOffer(state, { saleId, productId, sellerPartyId, buyerPartyId, inquiryId, quantity, offerDate, decisionDate, netPriceCents, offerSnapshotId }) {
  id(saleId, 'saleId'); id(sellerPartyId, 'sellerPartyId'); id(buyerPartyId, 'buyerPartyId'); id(inquiryId, 'inquiryId'); id(offerSnapshotId, 'offerSnapshotId');
  if (sellerPartyId === buyerPartyId) fail('seller and buyer must be different parties');
  if (!isIsoDate(offerDate) || !isIsoDate(decisionDate) || decisionDate < offerDate) fail('offer/decision dates are invalid');
  if (offerDate !== state.currentDate) fail('product offer date must equal the current simulation date');
  number(quantity, 'quantity', { min: 1, integer: true }); number(netPriceCents, 'netPriceCents', { min: 1, integer: true });
  const existing = (state.productSales ?? []).find(row => row.saleId === saleId);
  if (existing) {
    const same = existing.productId === productId && existing.sellerPartyId === sellerPartyId && existing.buyerPartyId === buyerPartyId && existing.inquiryId === inquiryId && existing.quantity === quantity && existing.offerDate === offerDate && existing.decisionDate === decisionDate && existing.netPriceCents === netPriceCents && existing.offerSnapshotId === offerSnapshotId;
    if (!same) fail('product sale ID already exists with different offer payload');
    return immutable(state);
  }
  const product = findProduct(state, productId);
  if (product.stage !== 'finished_goods' || quantity > product.outputQuantity) fail('offer quantity must be available finished goods');
  if (!product.costEstimate?.calculation) fail('product offer requires a saved plan-cost snapshot');
  const offerSnapshot = {
    snapshotId: offerSnapshotId,
    productId,
    period: product.costEstimate.period ?? null,
    estimatedAt: product.costEstimate.estimatedAt,
    costVersion: product.costEstimate.costVersion,
    storageConversion: clone(product.storageConversion),
    plannedNetPriceCents: product.costEstimate.netPriceCents,
    offerPriceCents: netPriceCents,
    babStatus: 'pending_deferred_bab',
    calculation: calculateV3ProductDirectEstimate({ netPriceCents, directCosts: product.costEstimate.calculation.directCosts }),
    costLineEvidence: clone(product.costEstimate.costLineEvidence),
    babCalculation: null,
  };
  const pendingQuantity = (state.productSales ?? []).filter(row => row.productId === productId && row.status === 'pending').reduce((sum, row) => sum + row.quantity, 0);
  if (pendingQuantity + quantity > product.outputQuantity) fail('pending offers reserve more finished goods than available');
  const next = clone(state);
  next.productSales ??= [];
  next.productSales.push({ saleId, productId, sellerPartyId, buyerPartyId, inquiryId, quantity, offerDate, decisionDate, netPriceCents, offerSnapshotId, offerSnapshot: clone(offerSnapshot), status: 'pending', acceptedAt: null, financeStatus: 'pending_non_posting', revenueStatus: 'pending_non_posting', cogsStatus: 'pending_deferred_bab' });
  next.events.push({ type: 'product_sale_offer_submitted', saleId, productId, sellerPartyId, buyerPartyId, inquiryId, quantity, offerDate, decisionDate, netPriceCents, offerSnapshotId, offerSnapshot: clone(offerSnapshot) });
  return immutable(next);
}

/** Only an explicit buyer decision accepts/rejects an offer; acceptance reserves quantity, and dispatch later removes physical goods. */
export function decideV3ProductSaleOffer(state, { saleId, buyerPartyId, decisionDate, accepted, decisionRef }) {
  id(saleId, 'saleId'); id(buyerPartyId, 'buyerPartyId'); id(decisionRef, 'decisionRef');
  if (typeof accepted !== 'boolean' || !isIsoDate(decisionDate)) fail('buyer decision must include boolean accepted and a valid date');
  const sale = (state.productSales ?? []).find(row => row.saleId === saleId); if (!sale) fail(`unknown product sale offer: ${saleId}`);
  if (sale.buyerPartyId !== buyerPartyId) fail('only the named buyer may decide this offer');
  if (decisionDate < sale.decisionDate) fail(`buyer decision is not due until ${sale.decisionDate}`);
  if (decisionDate > state.currentDate) fail('buyer decision cannot be recorded before the simulation reaches that date');
  const decisionType = accepted ? 'accepted' : 'rejected';
  const prior = state.events.find(event => event.type === 'product_sale_buyer_decision' && event.saleId === saleId);
  if (prior) {
    if (prior.accepted !== accepted || prior.buyerPartyId !== buyerPartyId || prior.decisionDate !== decisionDate || prior.decisionRef !== decisionRef) fail('buyer decision replay payload conflict');
    return immutable(state);
  }
  if (sale.status !== 'pending') fail(`product sale offer is already ${sale.status}`);
  const next = clone(state); next.productSales ??= []; const target = next.productSales.find(row => row.saleId === saleId); const product = findProduct(next, target.productId);
  if (accepted) {
    if (target.quantity > product.outputQuantity) fail('accepted sale exceeds available unreserved finished goods');
    product.outputQuantity -= target.quantity;
    if (next.finishedGoodsUsed < 0) fail('finished-goods inventory reconciliation would become negative');
    target.acceptedAt = decisionDate;
    target.quantityReservedAfterDecision = product.outputQuantity;
    target.status = decisionType;
  } else target.status = decisionType;
  next.events.push({ type: 'product_sale_buyer_decision', saleId, buyerPartyId, decisionDate, accepted, decisionRef, revenueStatus: 'pending_non_posting', cogsStatus: 'pending_deferred_bab' });
  if (accepted) {
    const product = findProduct(next, target.productId);
    const reservedBefore = customerReservedStorage(state);
    const reservedAfter = customerReservedStorage(next);
    appendCustomerFinishedGoodsMovement(next, { productId: product.productId, lotId: `LOT|PRODUCT|${encodeURIComponent(product.productId)}` }, { movementId: `${state.runId}|product-reservation|${encodeURIComponent(target.saleId)}`, kind: 'product_goods_reserved', date: decisionDate, sourceRef: target.saleId, quantity: target.quantity, unit: 'pieces', storageDelta: 0, reservedBefore, reservedAfter });
  }
  validateV3ProductWorkdayAssignments(next);
  return immutable(next);
}

/** Physical stock leaves only on an explicit dispatch after buyer acceptance. */
export function dispatchV3ProductSale(state, { saleId, dispatchId, date, sourceRef }) {
  id(saleId, 'saleId'); id(dispatchId, 'dispatchId'); id(sourceRef, 'sourceRef');
  if (!isIsoDate(date) || date !== state.currentDate) fail('product dispatch date must equal currentDate');
  const sale = (state.productSales ?? []).find(row => row.saleId === saleId);
  if (!sale || sale.status !== 'accepted') fail('only an accepted product sale can be dispatched');
  const movementId = `${state.runId}|product-dispatch|${encodeURIComponent(dispatchId)}`;
  const prior = state.finishedGoodsMovements.find(row => row.movementId === movementId);
  if (prior) {
    if (prior.sourceRef !== saleId || prior.date !== date || prior.deliveryId !== dispatchId) fail('product dispatch replay payload conflict');
    return immutable(state);
  }
  if (sale.dispatchId) fail('product sale is already dispatched');
  const next = clone(state); const target = next.productSales.find(row => row.saleId === saleId); const product = findProduct(next, target.productId);
  next.productCostLayers ??= []; next.productCostMovements ??= [];
  // Legacy/manual source layers can support an illustrative FIFO quantity allocation, but
  // they are not approved actual costs and never become this V3 sale's COGS.
  const costing = consumeV3ProductCostFIFO(next.productCostLayers, { productId: product.productId, quantity: target.quantity, dispatchId, date });
  let costEvidence = { status: 'pending_deferred_bab', reason: 'Full finished-goods valuation and COGS are deferred until a later version provides the BAB and complete cost-source basis; physical dispatch is not blocked.' };
  if (costing.status === 'valued') {
    const costMovement = { ...costing.movement, saleId, valuationKind: 'illustrative_fifo' };
    next.productCostLayers = costing.layers;
    next.productCostMovements.push(costMovement);
    next.events.push({ type: 'product_illustrative_fifo_allocation_recorded', sourceRef: costMovement.movementId, date, period: costMovement.period, movement: clone(costMovement), postingStatus: 'nonposting' });
    costEvidence = { ...costEvidence, illustrativeAllocation: { status: 'illustrative_nonposting', method: costMovement.method, costMovementId: costMovement.movementId, amountCents: costMovement.costCents, period: costMovement.period, label: 'Manuelle FIFO-Testannahme; kein Ist-COGS' } };
  }
  target.cogsStatus = 'pending_deferred_bab';
  delete target.cogsCents;
  const reservedBefore = customerReservedStorage(next);
  target.dispatchId = dispatchId; target.dispatchDate = date; target.dispatchSourceRef = sourceRef;
  const reservedAfter = customerReservedStorage(next);
  appendCustomerFinishedGoodsMovement(next, { productId: product.productId, lotId: `LOT|PRODUCT|${encodeURIComponent(product.productId)}` }, { movementId, kind: 'product_goods_shipped', date, sourceRef: saleId, quantity: target.quantity, unit: 'pieces', storageDelta: -(target.quantity * product.storageConversion.capacityUnitsPerBaseUnit), reservedBefore, reservedAfter, deliveryId: dispatchId, costEvidence });
  next.events.push({ type: 'product_sale_dispatched', saleId, dispatchId, dispatchSourceRef: sourceRef, quantity: target.quantity, date, period: date.slice(0, 7), cogsStatus: target.cogsStatus, cogsCents: target.cogsCents ?? null });
  validateV3ProductWorkdayAssignments(next);
  return immutable(next);
}
