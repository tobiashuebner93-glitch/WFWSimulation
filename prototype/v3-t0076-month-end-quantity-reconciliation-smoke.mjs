import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createRunSaveEnvelope, restoreRunSaveEnvelope } from './v3/run.js';
import { createV3MarketState, createV3MarketOfferId, V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';
import {
  createV3Run, openV3RunDay, closeV3RunDay, submitV3RunOffer,
  planV3RunWorkOrder, completeV3RunWorkOrderOperation,
  deliverV3RunCustomerWorkOrder, recordV3RunCustomerAcceptanceDecision,
  submitV3RunProductSaleOffer, recordV3RunProductSaleBuyerDecision,
  dispatchV3RunProductSale, getV3RunCustomerEvidence, validateV3RunState,
  placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment, recordV3RunCustomerGoodsReturn,
} from './v3-run-orchestrator.js';
import {
  createV3ProductState, createV3Product, defineV3ProductSteps, estimateV3Product,
  planV3ProductStep, completeV3ProductStep, recordV3CustomerFinishedGoodsReturn,
} from './v3-product-lifecycle.js';
import { createV3ManagementContractSnapshot } from './v3-management-order-planner.js';
const syntheticCostLines = lines => lines.map(line => ({ ...line, unit: 'EUR', sourceRef: `synthetic:t0076-reconcile:${line.id}`, roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: line.amountCents }));

// Additive T-0076 G6 slice. Twelve monthly quantity snapshots extend the existing shared flow using
// one shared run, market inquiry list, product inventory/resource pool and event log.
const START = '2027-01-04'; // Monday; subsequent monthly starts are Mondays too.
const END = '2027-12-31';
const RUN_ID = 'T0076-G6-ANNUAL-QUANTITY-1';
const SEED = 'fixed-annual-quantity-reconciliation';
const periods = Array.from({ length: 12 }, (_, index) => `2027-${String(index + 1).padStart(2, '0')}`);
const monthEnd = period => new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5)), 0)).toISOString().slice(0, 10);
const firstMonday = period => { let date = `${period}-01`; while (new Date(`${date}T12:00:00Z`).getUTCDay() !== 1) date = new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10); return date; };
const startByPeriod = new Map(periods.map(period => [period, firstMonday(period)]));
const addDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const nextDay = date => addDays(date, 1);
const nextWorkday = date => { let value = date; while ([0, 6].includes(new Date(`${value}T12:00:00Z`).getUTCDay())) value = nextDay(value); return value; };
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const hash = value => createHash('sha256').update(stable(value)).digest('hex');
const parameters = {
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 5, max: 5 },
  customerDecisionDelayCalendarDays: { min: 2, max: 2 },
  minimumMonthlyCompetitorSample: 3,
};
const segments = [{ segmentId: 'small', decisionWeights: { price: 0.7, reputation: 0.15, segmentFit: 0.15 } }];
const firms = [
  { firmId: 'player', role: 'player', reputation: 0.8, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: 0.9 } },
  ...['a', 'b', 'c'].map(suffix => ({ firmId: `competitor-${suffix}`, role: 'competitor', reputation: 0.5, capacityUnits: 10, capabilities: ['turning'], segmentFit: { small: 0.5 }, offerPriceCentsBySizeClass: { small: 15000 } })),
];
const marketState = createV3MarketState({ runId: RUN_ID, scenarioId: 'T0069-G5-MONTHLY', seed: SEED, parameterSetId: 'synthetic-monthly-flow-v1', startDate: START, parameters, segments, firms });
const productState = createV3ProductState({ runId: RUN_ID, currentDate: START, people: [{ id: 'worker-1', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'machine-1', hoursPerDay: 8, capabilities: ['turning'] }], materials: [{ id: 'steel', quantity: 100 }], finishedGoodsCapacity: 30, finishedGoodsUsed: 0, commitments: [] });
let run = createV3Run({ runId: RUN_ID, scenarioId: 'T0069-G5-MONTHLY', seed: SEED, startDate: START, endDate: END, marketState, productState });

const templatesFor = period => [
  { templateId: `customer-order-${period}`, customerId: `customer-${period}`, segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 1, referencePriceCents: 12000, macroPeriod: period },
  { templateId: `product-buyer-${period}`, customerId: `buyer-${period}`, segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 1, referencePriceCents: 12000, macroPeriod: period },
  { templateId: `expire-${period}`, customerId: `expiry-${period}`, segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['laser'], requiredCapacity: 1, referencePriceCents: 12000, macroPeriod: period },
];
const submittedOffers = new Map();
const productOffers = new Map();
const completedCustomerOrders = new Map();
let blocker = null;
let resourceConflictChecked = false;
let scheduledReturn = null;
let receiptRecorded = false;
let capacityReturnChecked = false;
const monthSnapshots = [];
const decisionDateFor = (inquiry, submittedAt = inquiry.receivedAt) => nextWorkday(addDays(submittedAt, 2));
const productAcceptance = Object.fromEntries(periods.map((period, index) => [period, index % 3 !== 1]));
const productIdFor = period => `standard-part-${period}`;

function snapshotMonth(run, period, previous) {
  const throughDate = monthEnd(period);
  assert.equal(run.currentDate, throughDate, `${period} snapshot is taken after calendar month-end close`);
  const product = run.modules.product;
  const periodStart = `${period}-01`;
  const openingById = new Map(previous ? previous.materials.map(row => [row.id, row.close]) : product.openingMaterials.map(row => [row.id, row.quantity]));
  const inTransitShipments = product.materialShipments.filter(row => row.status === 'in_transit').map(row => ({ orderId: row.orderId, shipmentId: row.shipmentId, materialId: row.materialId, quantity: row.quantity, etaDate: row.etaDate, sourceRef: row.sourceRef }));
  const materialIds = new Set([...openingById.keys(), ...product.materials.map(row => row.id)]);
  const materials = [...materialIds].sort().map(id => {
    const opening = openingById.get(id) ?? 0;
    const receipts = product.materialMovements.filter(row => row.materialId === id && row.date >= periodStart && row.date <= throughDate);
    const receiptQuantity = receipts.reduce((sum, row) => sum + row.quantity, 0);
    const transitQuantity = inTransitShipments.filter(row => row.materialId === id).reduce((sum, row) => sum + row.quantity, 0);
    const completed = [...product.assignments, ...product.customerAssignments]
      .filter(row => row.status === 'completed' && row.completedAt >= periodStart && row.completedAt <= throughDate);
    const consumption = completed.reduce((sum, row) => sum + (row.materials?.[id] ?? 0), 0);
    const close = product.materials.find(row => row.id === id)?.quantity ?? 0;
    const plannedReservation = product.assignments.filter(row => row.status === 'planned')
      .reduce((sum, row) => sum + (row.materials?.[id] ?? 0), 0)
      + product.customerWorkOrderPlans.flatMap(plan => plan.operations)
        .filter(row => row.status === 'planned').reduce((sum, row) => sum + (row.materials?.[id] ?? 0), 0);
    assert.equal(opening + receiptQuantity - consumption, close, `${id} quantity roll-forward in ${period}`);
    if (transitQuantity > 0) assert.notEqual(opening + receiptQuantity + transitQuantity - consumption, close, `${id} transit quantity is excluded from physical close in ${period}`);
    assert.ok(close >= 0 && plannedReservation >= 0 && close >= plannedReservation, `${id} close and reservation remain nonnegative in ${period}`);
    assert.equal(receipts.every(row => row.period === row.date.slice(0, 7) && row.sourceRef), true, `${id} receipts have dated period/source evidence`);
    return { id, unit: 'units', opening, receipts: receiptQuantity, inTransitQuantity: transitQuantity, completedConsumption: consumption, explicitAdjustments: 0, close, plannedReservation, available: close - plannedReservation, receiptMovementIds: receipts.map(row => ({ movementId: row.movementId, sourceRef: row.sourceRef, date: row.date, period: row.period, quantity: row.quantity, quantityBefore: row.quantityBefore, quantityAfter: row.quantityAfter })) };
  });

  const lotState = new Map(Object.entries(previous?.lots ?? {}).map(([key, value]) => [key, structuredClone(value)]));
  const productMovements = product.finishedGoodsMovements.filter(row => row.date >= periodStart && row.date <= throughDate);
  for (const movement of productMovements) {
    assert.equal(movement.period, movement.date.slice(0, 7), `movement ${movement.movementId} has calendar period`);
    assert.ok(movement.movementId && movement.sourceRef, `movement ${movement.movementId} has stable source identity`);
    const key = `${movement.productId ?? ''}|${movement.workOrderId ?? ''}|${movement.lotId ?? ''}`;
    const prior = lotState.get(key) ?? { unit: movement.unit, physical: 0, reserved: 0, quarantined: 0 };
    assert.deepEqual([movement.physicalQuantityBefore, movement.reservedQuantityBefore, movement.quarantinedQuantityBefore], [prior.physical, prior.reserved, prior.quarantined], `movement ${movement.movementId} starts at the prior lot state`);
    let physicalDelta = 0; let reservedDelta = 0; let quarantinedDelta = 0;
    if (['product_output_stocked', 'customer_output_stocked_reserved', 'customer_rejected_goods_returned'].includes(movement.kind)) physicalDelta = movement.quantity;
    if (['product_goods_shipped', 'customer_goods_shipped'].includes(movement.kind)) physicalDelta = -movement.quantity;
    if (['product_goods_reserved', 'customer_output_stocked_reserved'].includes(movement.kind)) reservedDelta = movement.quantity;
    if (['product_goods_shipped', 'customer_goods_shipped', 'customer_reservation_released_before_shipment'].includes(movement.kind)) reservedDelta = -movement.quantity;
    if (movement.kind === 'customer_rejected_goods_returned') quarantinedDelta = movement.quantity;
    const next = { unit: movement.unit, physical: prior.physical + physicalDelta, reserved: prior.reserved + reservedDelta, quarantined: prior.quarantined + quarantinedDelta };
    assert.deepEqual([movement.physicalQuantityAfter, movement.reservedQuantityAfter, movement.quarantinedQuantityAfter], [next.physical, next.reserved, next.quarantined], `movement ${movement.movementId} carries correct physical/status quantities`);
    assert.equal(movement.availableQuantityAfter, next.physical - next.reserved - next.quarantined, `movement ${movement.movementId} carries correct available quantity`);
    assert.ok(next.physical >= 0 && next.reserved >= 0 && next.quarantined >= 0 && next.reserved + next.quarantined <= next.physical, `movement ${movement.movementId} stays within lot quantities`);
    lotState.set(key, next);
  }
  const capacity = product.finishedGoodsCapacity;
  const capacityOpening = previous?.finishedGoods.capacityClose ?? product.openingFinishedGoodsUsed;
  let capacityExpected = capacityOpening;
  for (const movement of productMovements) {
    assert.equal(movement.stockBefore, capacityExpected, `movement ${movement.movementId} starts from prior occupied capacity`);
    assert.equal(movement.availableCapacityBefore, capacity - capacityExpected, `movement ${movement.movementId} has correct free capacity before`);
    capacityExpected += movement.deltaCapacityUnits;
    assert.equal(movement.stockAfter, capacityExpected, `movement ${movement.movementId} ends at correct occupied capacity`);
    assert.equal(movement.availableCapacityAfter, capacity - capacityExpected, `movement ${movement.movementId} has correct free capacity after`);
  }
  const capacityClose = product.finishedGoodsUsed;
  assert.equal(capacityOpening + productMovements.reduce((sum, row) => sum + row.deltaCapacityUnits, 0), capacityClose, `${period} capacity roll-forward`);
  assert.equal(capacityExpected, capacityClose, `${period} movement sequence reconciles to occupied finished-goods capacity`);
  assert.ok(capacityClose >= 0 && capacityClose <= capacity, `${period} occupied capacity remains within bounds`);
  const plannedOutputCapacity = product.assignments.filter(row => row.status === 'planned')
    .reduce((sum, row) => sum + row.outputQuantity * product.products.find(item => item.productId === row.productId).storageConversion.capacityUnitsPerBaseUnit, 0);
  assert.ok(capacity - capacityClose - plannedOutputCapacity >= 0, `${period} physical and planned output capacity fit`);
  return {
    period, throughDate, inTransitShipments, materials, lots: Object.fromEntries([...lotState].sort(([a], [b]) => a.localeCompare(b))),
    finishedGoods: { capacityOpening, capacityClose, capacity, occupiedCapacity: capacityClose, freePhysicalCapacity: capacity - capacityClose, plannedOutputCapacity, freeAfterPlans: capacity - capacityClose - plannedOutputCapacity },
    finishedGoodsMovements: productMovements.map(row => ({ movementId: row.movementId, kind: row.kind, sourceRef: row.sourceRef, date: row.date, period: row.period, productId: row.productId, workOrderId: row.workOrderId, lotId: row.lotId, quantity: row.quantity, unit: row.unit, physicalQuantityBefore: row.physicalQuantityBefore, physicalQuantityAfter: row.physicalQuantityAfter, reservedQuantityBefore: row.reservedQuantityBefore, reservedQuantityAfter: row.reservedQuantityAfter, quarantinedQuantityBefore: row.quarantinedQuantityBefore, quarantinedQuantityAfter: row.quarantinedQuantityAfter, availableQuantityAfter: row.availableQuantityAfter, deltaCapacityUnits: row.deltaCapacityUnits, stockBefore: row.stockBefore, stockAfter: row.stockAfter, availableCapacityBefore: row.availableCapacityBefore, availableCapacityAfter: row.availableCapacityAfter })),
  };
}

for (let date = START; date <= END; date = nextDay(date)) {
  const period = date.slice(0, 7);
  const openInput = { date };
  if (startByPeriod.has(period) && date === startByPeriod.get(period)) openInput.marketWeekTemplates = templatesFor(period);
  const opened = openV3RunDay(run, openInput);
  assert.equal(opened.ok, true, `open ${date}`);
  run = opened.state;
  assert.equal(run.modules.market.runId, run.runId);
  assert.equal(run.modules.product.runId, run.runId);

  if (date === START) {
    run = placeV3RunInternationalMaterialOrder(run, {
      orderId: 'T0076-MAT-ORDER-1', shipmentId: 'T0076-MAT-SHIPMENT-1', materialId: 'steel', quantity: 5,
      supplierId: 'local', sourceRef: 'fixture:D-0173:t0076:steel-order', fixtureId: 'synthetic:D-0173:supplier-profile-v1',
      baselineEtaDate: '2027-01-04', etaDate: '2027-01-04', lagDays: 0,
    }).state;
  }
  if (date === '2027-01-06') {
    const received = receiveV3RunInternationalMaterialShipment(run, 'T0076-MAT-SHIPMENT-1');
    run = received.state;
    const receiptReplay = receiveV3RunInternationalMaterialShipment(run, 'T0076-MAT-SHIPMENT-1');
    assert.equal(receiptReplay.duplicate, true, 'material receipt replay is idempotent');
    assert.deepEqual(receiptReplay.state, run, 'material receipt replay does not duplicate movement or quantity');
    receiptRecorded = true;
  }
  if (date === '2027-12-30') {
    run = placeV3RunInternationalMaterialOrder(run, {
      orderId: 'T0076-MAT-ORDER-TRANSIT', shipmentId: 'T0076-MAT-SHIPMENT-TRANSIT', materialId: 'steel', quantity: 4,
      supplierId: 'online', sourceRef: 'fixture:D-0173:t0076:steel-transit-order', fixtureId: 'synthetic:D-0173:supplier-profile-v1',
      baselineEtaDate: '2028-01-04', etaDate: '2028-01-04', lagDays: 0,
    }).state;
  }
  if (scheduledReturn && date === scheduledReturn.returnDate) {
    const input = { returnId: 'T0076-CUSTOMER-RETURN-1', sourceRef: 'fixture:t0076:customer-return', workOrderId: scheduledReturn.workOrderId, deliveryId: scheduledReturn.deliveryId, returnDate: date, quantity: 1, unit: 'pieces' };
    const returnInputState = run;
    const beforeReturn = structuredClone(run);
    const overflowProduct = structuredClone(run.modules.product);
    overflowProduct.finishedGoodsCapacity = overflowProduct.finishedGoodsUsed;
    const beforeOverflow = structuredClone(overflowProduct);
    assert.throws(() => recordV3CustomerFinishedGoodsReturn(overflowProduct, { returnId: input.returnId, workOrderId: input.workOrderId, deliveryId: input.deliveryId, date: input.returnDate, sourceRef: input.sourceRef, quantity: input.quantity, unit: input.unit }), /storage capacity exceeded/);
    assert.deepEqual(overflowProduct, beforeOverflow, 'return capacity failure makes no partial product, movement or event mutation');
    capacityReturnChecked = true;
    const returned = recordV3RunCustomerGoodsReturn(run, input);
    assert.equal(returned.ok, true);
    assert.deepEqual(returnInputState, beforeReturn, 'successful return leaves the prior immutable input unchanged');
    run = returned.state;
    const replay = recordV3RunCustomerGoodsReturn(run, structuredClone(input));
    assert.equal(replay.duplicate, true, 'customer return replay is idempotent');
    assert.deepEqual(replay.state, run, 'customer return replay does not duplicate movement or quantity');
    const changedPayload = { ...input, quantity: 2 };
    const beforeRejectedReturn = structuredClone(run);
    assert.throws(() => recordV3RunCustomerGoodsReturn(run, changedPayload), /different payload|payload conflict|remaining quantity/);
    assert.deepEqual(run, beforeRejectedReturn, 'rejected return payload leaves current state unchanged');
    assert.equal(run.modules.product.customerFinishedGoods.find(row => row.workOrderId === input.workOrderId).status, 'returned_quarantine');
    scheduledReturn = null;
  }

  if (startByPeriod.get(period) === date) {
    const productId = productIdFor(period);
    run.modules.product = createV3Product(run.modules.product, { productId, name: `Standardteil ${period}`, targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }] });
    run.modules.product = defineV3ProductSteps(run.modules.product, productId, [{ stepId: 'make', kind: 'production', hours: 1, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
    run.modules.product = estimateV3Product(run.modules.product, productId, { netPriceCents: 12000, directCosts: syntheticCostLines([{ id: `steel-plan-${period}`, amountCents: 2000, variable: true }]), costVersion: `direct-cost-${period}` });
    run.modules.product = planV3ProductStep(run.modules.product, { productId, stepId: 'make', date, personId: 'worker-1', equipmentId: 'machine-1', outputQuantity: 1, materialQuantities: { steel: 1 } });
    const assignment = run.modules.product.assignments.find(row => row.productId === productId && row.stepId === 'make');
    run.modules.product = completeV3ProductStep(run.modules.product, assignment.assignmentId);
    assert.equal(run.modules.product.products.find(row => row.productId === productId).outputQuantity, 1);
  }

  const inquiriesOpened = opened.result.playerInquiries.filter(inquiry => inquiry.status === 'open');
  for (const inquiry of inquiriesOpened) {
    if (inquiry.customerId === `customer-${period}` && !submittedOffers.has(period)) {
      const eventId = `customer-offer-${period}`;
      const netPriceCents = 8000;
      const offer = { eventId, inquiryId: inquiry.inquiryId, firmId: 'player', submittedAt: date, commercialTerms: { version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Fertigung eines Standardteils nach Kundenvorgabe', quantity: 1, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maßhaltigkeit gemäß vereinbarter Zeichnung und Sichtprüfung', deliveryDate: addDays(date, 5), contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION) }, calculationSnapshot: { modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId: createV3MarketOfferId(run.modules.market, eventId), submittedAt: date, netPriceCents, costVersion: `direct-cost-${period}`, babVersion: 'pending_deferred_bab', calculation: { netPriceCents, dbICents: 2000 } } };
      const submitted = submitV3RunOffer(run, offer);
      assert.equal(submitted.ok, true);
      run = submitted.state;
      submittedOffers.set(period, { offer, inquiryId: inquiry.inquiryId, decisionDate: decisionDateFor(inquiry, date) });

      if (period === '2027-01') {
        // A 7-hour own-product assignment deliberately competes with the new
        // accepted customer work order on the same employee and machine.
        const dueWorkday = nextWorkday(decisionDateFor(inquiry));
        let p = createV3Product(run.modules.product, { productId: 'capacity-blocker', name: 'Ressourcenfixture', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }] });
        p = defineV3ProductSteps(p, 'capacity-blocker', [{ stepId: 'block', kind: 'production', hours: 7, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
        p = estimateV3Product(p, 'capacity-blocker', { netPriceCents: 1000, directCosts: syntheticCostLines([{ id: 'steel-fixture', amountCents: 100, variable: true }]), costVersion: 'fixture-direct-cost' });
        p = planV3ProductStep(p, { productId: 'capacity-blocker', stepId: 'block', date: dueWorkday, personId: 'worker-1', equipmentId: 'machine-1', outputQuantity: 0 });
        blocker = { date: dueWorkday, assignmentId: p.assignments.find(row => row.productId === 'capacity-blocker').assignmentId };
        run.modules.product = p;
      }
    }

    if (inquiry.customerId === `buyer-${period}` && !productOffers.has(period)) {
      const product = run.modules.product.products.find(row => row.productId === productIdFor(period));
      assert.ok(product.outputQuantity >= 1, `${period} own product is in finished goods before offer`);
      const sale = { saleId: `product-sale-${period}`, productId: product.productId, sellerPartyId: 'player', buyerPartyId: inquiry.customerId, inquiryId: inquiry.inquiryId, quantity: 1, offerDate: date, decisionDate: decisionDateFor(inquiry, date), netPriceCents: 9000, offerSnapshotId: `direct-cost-${period}|${period}|no-bab` };
      const submitted = submitV3RunProductSaleOffer(run, sale);
      assert.equal(submitted.ok, true);
      run = submitted.state;
      productOffers.set(period, { sale, inquiryId: inquiry.inquiryId });
    }
  }

  // A product buyer decision is independent from customer-order acceptance;
  // both remain non-posting and are persisted in this same shared run.
  const pendingSale = productOffers.get(period);
  if (pendingSale && pendingSale.sale.decisionDate === date) {
    const accepted = productAcceptance[period];
    const decision = { saleId: pendingSale.sale.saleId, buyerPartyId: pendingSale.sale.buyerPartyId, decisionDate: date, accepted, decisionRef: `buyer-decision-${period}` };
    const decided = recordV3RunProductSaleBuyerDecision(run, decision);
    assert.equal(decided.ok, true);
    run = decided.state;
    pendingSale.decision = decision;
    pendingSale.dispatched = false;
    if (accepted) {
      const dispatched = dispatchV3RunProductSale(run, { saleId: pendingSale.sale.saleId, dispatchId: `dispatch-${period}`, date, sourceRef: `dispatch-source-${period}` });
      assert.equal(dispatched.ok, true);
      run = dispatched.state;
      pendingSale.dispatched = true;
    }
  }

  // The market's accepted player offer creates exactly one operational work
  // order. It is planned/produced/delivered and decided by the named customer.
  const order = run.customerWorkOrders.find(row => row.status === 'awaiting_operational_plan' && !completedCustomerOrders.has(row.workOrderId));
  if (order && new Date(`${date}T12:00:00Z`).getUTCDay() % 6 !== 0) {
    const contractSnapshot = createV3ManagementContractSnapshot(order);
    if (blocker && date === blocker.date && !resourceConflictChecked) {
      run.modules.product = completeV3ProductStep(run.modules.product, blocker.assignmentId);
      const before = structuredClone(run);
      assert.throws(() => planV3RunWorkOrder(run, { workOrderId: order.workOrderId, contractSnapshot, operations: [{ operationId: `customer-op-${period}`, date, personId: 'worker-1', equipmentId: 'machine-1', hours: 2, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } }] }), /daily capacity exceeded/, 'shared employee/machine overload is rejected without partial work order mutation');
      assert.deepEqual(run, before, 'failed capacity conflict preserves the shared run and order status');
      resourceConflictChecked = true;
    } else {
      const operations = [{ operationId: `customer-op-${period}`, date, personId: 'worker-1', equipmentId: 'machine-1', hours: 2, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } }];
      run = planV3RunWorkOrder(run, { workOrderId: order.workOrderId, contractSnapshot, operations }).state;
      run = completeV3RunWorkOrderOperation(run, { workOrderId: order.workOrderId, operationId: operations[0].operationId }).state;
      const afterCompletion = structuredClone(run);
      const completedReplay = completeV3RunWorkOrderOperation(run, { workOrderId: order.workOrderId, operationId: operations[0].operationId });
      assert.equal(completedReplay.duplicate, true, 'completed operation replay is idempotent');
      assert.deepEqual(completedReplay.state, afterCompletion, 'operation replay does not consume material or create duplicate output');
      const deliveryId = `delivery-${period}`;
      run = deliverV3RunCustomerWorkOrder(run, { deliveryId, sourceRef: `delivery-source-${period}`, workOrderId: order.workOrderId, deliveryDate: date, recipientPartyId: order.customerPartyId, deliveryCriterionRef: contractSnapshot.performanceCriterionRef, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef, quantity: 1, unit: 'pieces' }).state;
      run = recordV3RunCustomerAcceptanceDecision(run, { decisionId: `customer-acceptance-${period}`, sourceRef: `customer-acceptance-source-${period}`, workOrderId: order.workOrderId, deliveryId, decisionDate: date, decision: period === '2027-01' ? 'reject' : 'accept', actorRole: 'customer', actorPartyId: order.customerPartyId, customerRef: order.customerPartyId, authorizedForRef: null, partyAuthorityRef: null, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef }).state;
      const evidence = getV3RunCustomerEvidence(run, order.workOrderId);
      assert.equal(evidence.evidenceStatus, 'customer_decision_recorded');
      const expectedCustomerDecision = period === '2027-01' ? 'reject' : 'accept';
      assert.equal(evidence.customerDecision.decision, expectedCustomerDecision);
      assert.equal(evidence.financeStatus, 'pending_non_posting');
      completedCustomerOrders.set(order.workOrderId, { period: date.slice(0, 7), order, evidence });
      if (period === '2027-01') scheduledReturn = { workOrderId: order.workOrderId, deliveryId, returnDate: nextDay(date) };
    }
  }

  if (date === END) {
    let reservationProduct = createV3Product(run.modules.product, { productId: 'year-end-reservation', name: 'Jahresend-Reservierung', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }] });
    reservationProduct = defineV3ProductSteps(reservationProduct, 'year-end-reservation', [{ stepId: 'reserve-material', kind: 'production', hours: 1, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
    reservationProduct = estimateV3Product(reservationProduct, 'year-end-reservation', { netPriceCents: 10000, directCosts: syntheticCostLines([{ id: 'year-end-direct-cost', amountCents: 1000, variable: true }]), costVersion: 'year-end-reservation-cost' });
    reservationProduct = planV3ProductStep(reservationProduct, { productId: 'year-end-reservation', stepId: 'reserve-material', date, personId: 'worker-1', equipmentId: 'machine-1', outputQuantity: 1, materialQuantities: { steel: 1 } });
    run.modules.product = reservationProduct;
  }

  const closed = closeV3RunDay(run, { date });
  assert.equal(closed.ok, true, `close ${date}`);
  run = closed.state;
  if (date === monthEnd(period)) {
    const monthOrders = [...completedCustomerOrders.values()].filter(row => row.period === period);
    const monthProductOffers = [...productOffers.entries()].filter(([key]) => key === period).map(([, row]) => row);
    assert.equal(monthOrders.length, 1, `${period} has one delivered customer work order`);
    assert.equal(monthProductOffers.length, 1, `${period} has one own-product buyer decision`);
    assert.equal(monthProductOffers[0].decision?.accepted, productAcceptance[period]);
    assert.equal(monthProductOffers[0].dispatched, productAcceptance[period]);
    assert.equal(run.financeHandoffs.filter(handoff => monthOrders.some(row => row.order.workOrderId === handoff.workOrderId)).every(handoff => handoff.status === 'pending_non_posting'), true);
    const snapshot = snapshotMonth(run, period, monthSnapshots.at(-1));
    const envelope = createRunSaveEnvelope(run, null);
    const restored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(envelope))).runState;
    assert.equal(hash(restored), hash(run), `${period} save/restore preserves complete shared state`);
    snapshot.stateHash = hash(run);
    snapshot.eventHash = hash(run.dayEvents);
    snapshot.restoreHash = hash(restored);
    monthSnapshots.push(snapshot);
  }
}

assert.equal(run.currentDate, END);
assert.equal(validateV3RunState(JSON.parse(JSON.stringify(run))), true, 'annual JSON state validates');
assert.equal(resourceConflictChecked, true, 'competing worker/machine capacity was exercised');
assert.equal(receiptRecorded, true, 'a source-bound international material receipt is included');
assert.equal(capacityReturnChecked, true, 'return capacity overflow was rejected without mutation');
assert.equal(scheduledReturn, null, 'the rejected customer lot was physically returned after the rejection');
assert.equal(monthSnapshots.length, 12, 'all twelve calendar month-end snapshots were captured');
assert.deepEqual(monthSnapshots.map(row => row.throughDate), periods.map(monthEnd), 'month-end dates stay on calendar month-end, including weekends');
assert.equal(completedCustomerOrders.size, periods.length, 'each month completed one market-derived customer work order');
assert.equal(productOffers.size, periods.length, 'each month completed an own-product buyer decision');
assert.deepEqual([...productOffers.values()].map(row => row.decision.accepted), periods.map(period => productAcceptance[period]));
assert.equal(run.dayEvents.filter(event => event.phase === 'customer_acceptance_decision').length, periods.length);
assert.equal(run.dayEvents.filter(event => event.phase === 'customer_acceptance_decision' && event.result.decision === 'reject').length, 1, 'one customer delivery is rejected before the separate return event');
assert.equal(run.dayEvents.filter(event => event.phase === 'customer_goods_returned').length, 1, 'the customer return is separately source-bound');
assert.equal(run.modules.product.finishedGoodsMovements.filter(row => row.kind === 'customer_rejected_goods_returned').length, 1);
assert.equal(run.modules.product.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').length, Object.values(productAcceptance).filter(Boolean).length);
assert.equal(monthSnapshots.at(-1).inTransitShipments.length, 1, 'year-end fixture includes one shipment still in transit');
assert.equal(monthSnapshots.at(-1).materials.find(row => row.id === 'steel').inTransitQuantity, 4, 'in-transit quantity is shown separately');
assert.equal(monthSnapshots.at(-1).materials.find(row => row.id === 'steel').plannedReservation, 1, 'year-end open production plan reserves one material unit without consuming it');
assert.equal(monthSnapshots.at(-1).materials.find(row => row.id === 'steel').available, monthSnapshots.at(-1).materials.find(row => row.id === 'steel').close - 1);
assert.equal(run.modules.product.finishedGoodsUsed, monthSnapshots.at(-1).finishedGoods.occupiedCapacity);
assert.equal(run.modules.product.finishedGoodsCapacity - run.modules.product.finishedGoodsUsed, monthSnapshots.at(-1).finishedGoods.freePhysicalCapacity);
assert.equal(run.modules.market.inquiries.filter(inquiry => inquiry.customerId.startsWith('expiry-')).every(inquiry => inquiry.status === 'expired'), true, 'ineligible monthly inquiry windows expire deterministically');
assert.equal(run.modules.market.inquiries.filter(inquiry => inquiry.customerId.startsWith('ignored-')).every(inquiry => inquiry.status === 'resolved' && inquiry.winnerFirmId !== 'player'), true, 'unsubmitted player proposals are lost to a competitor');
assert.equal(run.modules.product.productSales.every(sale => sale.financeStatus === 'pending_non_posting' && sale.revenueStatus === 'pending_non_posting' && sale.cogsStatus === 'pending_deferred_bab' && !Object.hasOwn(sale, 'cogsCents')), true, 'no BAB, revenue, COGS, tax, cash or ledger is inferred');
assert.equal('ledger' in run, false);
assert.equal('cash' in run, false);

// Replay/restore must keep a single event and a single physical movement.
const firstSale = productOffers.get('2027-01');
assert.equal(recordV3RunProductSaleBuyerDecision(run, structuredClone(firstSale.decision)).duplicate, true);
assert.equal(closeV3RunDay(run, { date: END }).duplicate, true);
assert.equal(validateV3RunState(run), true);
assert.equal(run.modules.product.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').length, Object.values(productAcceptance).filter(Boolean).length);
const restoredHash = hash(JSON.parse(JSON.stringify(run)));
assert.equal(restoredHash, hash(run), 'JSON restore preserves the complete annual shared state');

const beforeNegativeTests = structuredClone(run);
const duplicateMovement = structuredClone(run);
duplicateMovement.modules.product.finishedGoodsMovements.push(structuredClone(duplicateMovement.modules.product.finishedGoodsMovements[0]));
assert.throws(() => validateV3RunState(duplicateMovement), { code: 'invalid_run_state' }, 'duplicate movement identity is rejected');
const duplicateReceiptMovement = structuredClone(run);
duplicateReceiptMovement.modules.product.materialMovements.push(structuredClone(duplicateReceiptMovement.modules.product.materialMovements[0]));
assert.throws(() => validateV3RunState(duplicateReceiptMovement), { code: 'invalid_run_state' }, 'duplicate receipt movement/source identity is rejected');
const missingReceiptSource = structuredClone(run);
missingReceiptSource.dayEvents = missingReceiptSource.dayEvents.filter(event => event.phase !== 'international_material_receipt');
assert.throws(() => validateV3RunState(missingReceiptSource), { code: 'invalid_run_state' }, 'a receipt movement without its shared-run source event is rejected');
const negativeStock = structuredClone(run);
negativeStock.modules.product.materials.find(row => row.id === 'steel').quantity = -1;
assert.throws(() => validateV3RunState(negativeStock), { code: 'invalid_run_state' }, 'negative material quantity is rejected');
const manipulatedMovement = structuredClone(run);
manipulatedMovement.modules.product.finishedGoodsMovements[0].physicalQuantityBefore += 1;
assert.throws(() => validateV3RunState(manipulatedMovement), { code: 'invalid_run_state' }, 'manipulated movement before/after quantities are rejected');
const overReservedQuarantine = structuredClone(run);
const quarantineMovement = overReservedQuarantine.modules.product.finishedGoodsMovements.find(row => row.kind === 'customer_rejected_goods_returned');
assert.ok(quarantineMovement);
quarantineMovement.quarantinedQuantityAfter = quarantineMovement.physicalQuantityAfter + 1;
assert.throws(() => validateV3RunState(overReservedQuarantine), { code: 'invalid_run_state' }, 'quarantine/reserved quantities may not exceed physical lot quantity');
assert.deepEqual(run, beforeNegativeTests, 'all negative validator inputs leave the accepted annual state unchanged');
const tamperedCustomerDecision = structuredClone(run);
const firstDecisionEvent = tamperedCustomerDecision.dayEvents.find(event => event.phase === 'customer_acceptance_decision');
firstDecisionEvent.result.decision = firstDecisionEvent.result.decision === 'accept' ? 'reject' : 'accept';
assert.throws(() => validateV3RunState(tamperedCustomerDecision), { code: 'invalid_run_state' }, 'customer acceptance event tampering is rejected');
const tamperedProductSnapshot = structuredClone(run);
tamperedProductSnapshot.modules.product.productSales[0].offerSnapshot.offerPriceCents += 1;
assert.throws(() => validateV3RunState(tamperedProductSnapshot), { code: 'invalid_run_state' }, 'product offer snapshot tampering is rejected');
const tamperedFinishedGoods = structuredClone(run);
tamperedFinishedGoods.modules.product.finishedGoodsUsed += 1;
assert.throws(() => validateV3RunState(tamperedFinishedGoods), { code: 'invalid_run_state' }, 'finished-goods stock tampering is rejected');

const snapshotArtifact = { fixtureId: 'T0076-G6-ANNUAL-QUANTITY-1', runId: RUN_ID, seed: SEED, startDate: START, endDate: END, status: 'PASS', snapshots: monthSnapshots };
writeFileSync(new URL('./v3-t0076-month-end-snapshots.json', import.meta.url), `${JSON.stringify(snapshotArtifact, null, 2)}\n`, 'utf8');
const monthSummary = monthSnapshots.map(snapshot => ({
  period: snapshot.period, throughDate: snapshot.throughDate,
  materials: snapshot.materials.map(({ id, opening, receipts, inTransitQuantity, completedConsumption, close, plannedReservation, available }) => ({ id, opening, receipts, inTransitQuantity, completedConsumption, close, plannedReservation, available })),
  finishedGoods: snapshot.finishedGoods, lotCount: Object.keys(snapshot.lots).length,
  quarantinedUnits: Object.values(snapshot.lots).reduce((sum, row) => sum + row.quarantined, 0),
  stateHash: snapshot.stateHash, eventHash: snapshot.eventHash, restoreHash: snapshot.restoreHash,
}));
console.log(JSON.stringify({
  status: 'PASS', periodCount: periods.length, startDate: START, endDate: END,
  customerOrders: completedCustomerOrders.size,
  orderStatuses: [...completedCustomerOrders.values()].map(row => row.evidence.customerDecision.status),
  ownProductBuyerDecisions: [...productOffers.values()].map(row => row.decision.accepted ? 'accepted' : 'rejected'),
  ownProductDispatches: run.modules.product.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').length,
  resourceConflict: resourceConflictChecked,
  pendingFinance: true, bab: 'deferred / no BAB calculation',
  replayRestoreTampering: 'PASS', stateSha256: restoredHash, monthSnapshots: monthSummary, snapshotArtifact: 'prototype/v3-t0076-month-end-snapshots.json',
}, null, 2));
