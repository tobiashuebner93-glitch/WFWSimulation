import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createV3MarketState, createV3MarketOfferId, V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';
import { createV3ManagementContractSnapshot } from './v3-management-order-planner.js';
import {
  createV3Run, openV3RunDay, closeV3RunDay, submitV3RunOffer,
  planV3RunWorkOrder, completeV3RunWorkOrderOperation,
  deliverV3RunCustomerWorkOrder, recordV3RunCustomerAcceptanceDecision,
  submitV3RunProductSaleOffer, recordV3RunProductSaleBuyerDecision,
  dispatchV3RunProductSale, getV3RunCustomerEvidence, validateV3RunState,
  planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction,
  placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment,
} from './v3-run-orchestrator.js';
import {
  createV3ProductState, createV3Product, defineV3ProductSteps, estimateV3Product,
  planV3ProductStep, completeV3ProductStep,
} from './v3-product-lifecycle.js';
import { createFinanceStateForRun, createRunSaveEnvelope, restoreRunSaveEnvelope, issueAcceptedScenarioInvoices, processRunDayCustomerReceipts } from './v3/run.js';
import { reconcileV3Finance } from './v3-finance-runtime.js';
import { assessV3T0074EconomicScenario } from './v3-t0074-economic-viability-scenario.js';
const syntheticCostLines = lines => lines.map(line => ({ ...line, unit: 'EUR', sourceRef: `synthetic:t0069-flow:${line.id}`, roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: line.amountCents }));

// T-0074 positive annual comparison: 60 accepted customer jobs/month at the existing
// 8,000-cent test anchor, plus the same monthly own-product path. This remains a
// synthetic scenario; costs are the D-0187 non-posting overlay, not actual postings.
const START = '2027-01-04'; // Monday; subsequent monthly starts are Mondays too.
const END = '2027-12-31';
const RUN_ID = 'T0074-G3-POSITIVE-ANNUAL-60-ORDERS';
const SEED = 'fixed-positive-annual-60-orders-per-month';
const CUSTOMER_ORDERS_PER_MONTH = 60;
const CUSTOMER_ORDERS_PER_WAVE = 20;
const CUSTOMER_OPERATION_HOURS = 2;
const periods = Array.from({ length: 12 }, (_, index) => `2027-${String(index + 1).padStart(2, '0')}`);
const starts = ['2027-01-04','2027-02-01','2027-03-01','2027-04-05','2027-05-03','2027-06-07','2027-07-05','2027-08-02','2027-09-06','2027-10-04','2027-11-01','2027-12-06'];
const startByPeriod = new Map(periods.map((period, index) => [period, starts[index]]));
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
const marketState = createV3MarketState({ runId: RUN_ID, scenarioId: 'T0074-G3-POSITIVE-ANNUAL', seed: SEED, parameterSetId: 'synthetic-positive-annual-60-per-month-v1', startDate: START, parameters, segments, firms });
const productState = createV3ProductState({ runId: RUN_ID, currentDate: START, people: [{ id: 'worker-1', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'machine-1', hoursPerDay: 8, capabilities: ['turning'] }], materials: [{ id: 'steel', quantity: 100 }], finishedGoodsCapacity: 30, finishedGoodsUsed: 0, commitments: [] });
let run = createV3Run({ runId: RUN_ID, scenarioId: 'T0074-G3-POSITIVE-ANNUAL', seed: SEED, startDate: START, endDate: END, marketState, productState });
let financeState = createFinanceStateForRun(run);
const createdInvoiceIds = [];
const receivedCustomerPaymentIds = [];
const monthlyFinanceChecks = [];
const receivedMaterialShipmentIds = [];

const mondayIndexInMonth = date => Math.floor((Number(date.slice(8, 10)) - 1) / 7);
const isMonday = date => new Date(`${date}T12:00:00Z`).getUTCDay() === 1;
const templatesFor = (period, date) => {
  const waveIndex = mondayIndexInMonth(date);
  const templates = waveIndex < 3
    ? Array.from({ length: CUSTOMER_ORDERS_PER_WAVE }, (_, index) => {
      const sequence = waveIndex * CUSTOMER_ORDERS_PER_WAVE + index + 1;
      return { templateId: `customer-order-${period}-${String(sequence).padStart(2, '0')}`, customerId: `customer-${period}-${String(sequence).padStart(2, '0')}`, segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 1, referencePriceCents: 12000, macroPeriod: period };
    })
    : [];
  if (date === startByPeriod.get(period)) templates.push(
    { templateId: `product-buyer-${period}`, customerId: `buyer-${period}`, segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 1, referencePriceCents: 12000, macroPeriod: period },
    { templateId: `expire-${period}`, customerId: `expiry-${period}`, segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['laser'], requiredCapacity: 1, referencePriceCents: 12000, macroPeriod: period },
  );
  return templates;
};
const submittedOffers = new Map();
const productOffers = new Map();
const completedCustomerOrders = new Map();
let blocker = null;
let resourceConflictChecked = false;
let midyearRestored = false;
let midyearRestoreHash = null;
const decisionDateFor = (inquiry, submittedAt = inquiry.receivedAt) => nextWorkday(addDays(submittedAt, 2));
const productAcceptance = Object.fromEntries(periods.map((period, index) => [period, index % 2 === 0]));
const productIdFor = period => `standard-part-${period}`;

for (let date = START; date <= END; date = nextDay(date)) {
  const period = date.slice(0, 7);
  const openInput = { date };
  if (isMonday(date) && mondayIndexInMonth(date) < 3) openInput.marketWeekTemplates = templatesFor(period, date);
  const opened = openV3RunDay(run, openInput);
  assert.equal(opened.ok, true, `open ${date}`);
  run = opened.state;
  const receiptRun = processRunDayCustomerReceipts(financeState, date);
  financeState = receiptRun.financeState;
  receivedCustomerPaymentIds.push(...receiptRun.receipts.map(event => event.eventId));
  const dueMaterialShipments = run.modules.product.materialShipments.filter(shipment => shipment.status === 'in_transit' && shipment.etaDate === date);
  for (const shipment of dueMaterialShipments) {
    const receipt = receiveV3RunInternationalMaterialShipment(run, shipment.shipmentId);
    assert.equal(receipt.ok, true, `${shipment.shipmentId} is received on its contractual ETA`);
    run = receipt.state;
    receivedMaterialShipmentIds.push(shipment.shipmentId);
  }
  if (date === START) {
    const instructionId = 'T0075-initial-instruction-worker-1-machine-1';
    const instruction = planV3RunEquipmentInstruction(run, {
      instructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: date,
      sourceRef: `instruction:${instructionId}`,
    });
    assert.equal(instruction.ok, true, 'D-0183 first-use instruction is planned in the shared run');
    const completedInstruction = completeV3RunEquipmentInstruction(instruction.state, { instructionId });
    assert.equal(completedInstruction.ok, true, 'D-0183 first-use instruction is completed before machine use');
    run = completedInstruction.state;
    const steelOrder = placeV3RunInternationalMaterialOrder(run, {
      orderId: 'T0074-POSITIVE-WHOLESALE-STEEL-632', shipmentId: 'T0074-POSITIVE-STEEL-SHIPMENT-632',
      materialId: 'steel', quantity: 632, supplierId: 'wholesale', sourceRef: 'synthetic:D-0173:T0074-positive-steel-632',
      fixtureId: 'synthetic:D-0173:supplier-profile-v1', baselineEtaDate: addDays(date, 8), etaDate: addDays(date, 8), lagDays: 0,
    });
    assert.equal(steelOrder.ok, true, 'bulk material restock uses the existing wholesale profile and eight-day lead time');
    run = steelOrder.state;
  }
  assert.equal(run.modules.market.runId, run.runId);
  assert.equal(run.modules.product.runId, run.runId);

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
    if (inquiry.customerId.startsWith(`customer-${period}-`) && !submittedOffers.has(inquiry.inquiryId)) {
      const eventId = `customer-offer-${inquiry.customerId}`;
      const netPriceCents = 8000;
      const offer = { eventId, inquiryId: inquiry.inquiryId, firmId: 'player', submittedAt: date, commercialTerms: { version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Fertigung eines Präzisionsdrehteils nach Kundenvorgabe', quantity: 1, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maße gemäß vereinbarter Zeichnung und Sichtprüfung', deliveryDate: addDays(date, 14), contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION) }, calculationSnapshot: { modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId: createV3MarketOfferId(run.modules.market, eventId), submittedAt: date, netPriceCents, costVersion: `direct-cost-${period}`, babVersion: 'pending_deferred_bab', calculation: { netPriceCents, dbICents: 2000 } } };
      const submitted = submitV3RunOffer(run, offer);
      assert.equal(submitted.ok, true);
      run = submitted.state;
      submittedOffers.set(inquiry.inquiryId, { offer, period, inquiryId: inquiry.inquiryId, customerId: inquiry.customerId, decisionDate: decisionDateFor(inquiry, date) });

      if (period === '2027-01' && !blocker) {
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

  // One employee and one machine can each execute four two-hour customer jobs
  // per workday. The January conflict fixture intentionally removes one day.
  const readyOrders = run.customerWorkOrders
    .filter(order => order.status === 'awaiting_operational_plan' && !completedCustomerOrders.has(order.workOrderId))
    .sort((a, b) => a.workOrderId.localeCompare(b.workOrderId));
  const isWorkday = ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
  if (readyOrders.length && isWorkday && blocker && date === blocker.date && !resourceConflictChecked) {
    const order = readyOrders[0];
    const contractSnapshot = createV3ManagementContractSnapshot(order);
    run.modules.product = completeV3ProductStep(run.modules.product, blocker.assignmentId);
    const before = structuredClone(run);
    const operationId = `customer-op-${hash(order.workOrderId).slice(0, 16)}`;
    assert.throws(() => planV3RunWorkOrder(run, { workOrderId: order.workOrderId, contractSnapshot, operations: [{ operationId, date, personId: 'worker-1', equipmentId: 'machine-1', hours: CUSTOMER_OPERATION_HOURS, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } }] }), /daily capacity exceeded/, 'shared employee/machine overload is rejected without partial work order mutation');
    assert.deepEqual(run, before, 'failed capacity conflict preserves the shared run and order status');
    resourceConflictChecked = true;
  } else if (readyOrders.length && isWorkday) {
    for (const order of readyOrders.slice(0, 4)) {
      const contractSnapshot = createV3ManagementContractSnapshot(order);
      const suffix = hash(order.workOrderId).slice(0, 16);
      const operationId = `customer-op-${suffix}`;
      const operations = [{ operationId, date, personId: 'worker-1', equipmentId: 'machine-1', hours: CUSTOMER_OPERATION_HOURS, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } }];
      run = planV3RunWorkOrder(run, { workOrderId: order.workOrderId, contractSnapshot, operations }).state;
      run = completeV3RunWorkOrderOperation(run, { workOrderId: order.workOrderId, operationId }).state;
      const deliveryId = `delivery-${suffix}`;
      run = deliverV3RunCustomerWorkOrder(run, { deliveryId, sourceRef: `delivery-source-${suffix}`, workOrderId: order.workOrderId, deliveryDate: date, recipientPartyId: order.customerPartyId, deliveryCriterionRef: contractSnapshot.performanceCriterionRef, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef, quantity: 1, unit: 'pieces' }).state;
      run = recordV3RunCustomerAcceptanceDecision(run, { decisionId: `customer-acceptance-${suffix}`, sourceRef: `customer-acceptance-source-${suffix}`, workOrderId: order.workOrderId, deliveryId, decisionDate: date, decision: 'accept', actorRole: 'customer', actorPartyId: order.customerPartyId, customerRef: order.customerPartyId, authorizedForRef: null, partyAuthorityRef: null, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef }).state;
      const evidence = getV3RunCustomerEvidence(run, order.workOrderId);
      assert.equal(evidence.evidenceStatus, 'customer_decision_recorded');
      assert.equal(evidence.customerDecision.decision, 'accept');
      assert.equal(evidence.financeStatus, 'pending_non_posting');
      const cohortPeriod = order.customerPartyId.slice('customer-'.length, 'customer-'.length + 7);
      assert.match(cohortPeriod, /^2027-(0[1-9]|1[0-2])$/);
      completedCustomerOrders.set(order.workOrderId, { period: cohortPeriod, deliveredPeriod: date.slice(0, 7), order, evidence });
    }
  }

  const closed = closeV3RunDay(run, { date });
  assert.equal(closed.ok, true, `close ${date}`);
  run = closed.state;
  const invoiceRun = issueAcceptedScenarioInvoices(run, financeState);
  financeState = invoiceRun.financeState;
  createdInvoiceIds.push(...invoiceRun.invoiceIds);
  if (nextDay(date).slice(0, 7) !== period) {
    const monthOrders = [...completedCustomerOrders.values()].filter(row => row.period === period);
    const monthProductOffers = [...productOffers.entries()].filter(([key]) => key === period).map(([, row]) => row);
    assert.equal(monthOrders.length, CUSTOMER_ORDERS_PER_MONTH, `${period} has sixty accepted, delivered customer orders`);
    assert.equal(monthProductOffers.length, 1, `${period} has one own-product buyer decision`);
    assert.equal(monthProductOffers[0].decision?.accepted, productAcceptance[period], `sale=${JSON.stringify(run.modules.product.productSales)} offer=${JSON.stringify(monthProductOffers[0])}`);
    assert.equal(monthProductOffers[0].dispatched, productAcceptance[period]);
    assert.equal(run.modules.product.finishedGoodsUsed >= 0, true);
    assert.equal(run.financeHandoffs.filter(handoff => monthOrders.some(row => row.order.workOrderId === handoff.workOrderId)).every(handoff => handoff.status === 'pending_non_posting'), true);
    const monthFinance = reconcileV3Finance(financeState, date);
    const sourceRevenue = financeState.orders.filter(order => order.recognitionDate.slice(0, 7) === period).reduce((sum, order) => sum + order.amountCents, 0);
    const sourceReceipts = financeState.events.filter(event => event.financeType === 'customer-payment' && event.paymentDate.slice(0, 7) === period).reduce((sum, event) => sum + event.amountCents, 0);
    const sourceSimTax = financeState.invoices.filter(invoice => invoice.invoiceDate.slice(0, 7) === period).reduce((sum, invoice) => sum + invoice.simTaxCents, 0);
    assert.equal(sourceRevenue, CUSTOMER_ORDERS_PER_MONTH * 8000, `${period} net sales come from sixty accepted customer orders at 8,000 cents each`);
    assert.equal(monthFinance.monthlyFlows[period]?.recognizedRevenueCents ?? 0, sourceRevenue, `${period} finance revenue reconciles to stored performance source events`);
    assert.equal(monthFinance.monthlyFlows[period]?.customerReceiptsCents ?? 0, sourceReceipts, `${period} finance receipts reconcile to stored payment source events`);
    assert.equal(monthFinance.monthlyFlows[period]?.simTaxAccruedCents ?? 0, sourceSimTax, `${period} SimTAX reconciles to stored D-0166 invoice positions`);
    assert.equal(monthFinance.monthlyFlows[period]?.supplierInvoicesCents ?? 0, 0, `${period} had no supplier invoice source event`);
    assert.equal(monthFinance.monthlyFlows[period]?.supplierPaymentsCents ?? 0, 0, `${period} had no supplier payment source event`);
    monthlyFinanceChecks.push({ period, revenueCents: sourceRevenue, receiptsCents: sourceReceipts, simTaxCents: sourceSimTax, closingBankCents: monthFinance.monthlyFlows[period].closingStocks.bankCents, closingReceivablesCents: monthFinance.monthlyFlows[period].closingStocks.receivablesCents });
    console.error(`[T-0074 positive annual] ${period} reconciled: revenue=${sourceRevenue}c; orders=${monthOrders.length}`);
    // This test harness retains the complete shared run for replay validation.
    // Reclaim temporary state clones between month checkpoints when Node is
    // started with --expose-gc; this does not change the simulated state.
    globalThis.gc?.();
  }
  if (date === '2027-06-30') {
    const beforeRestoreHash = hash(run);
    const beforeFinanceRestoreHash = hash(financeState);
    const saveEnvelope = createRunSaveEnvelope(run, financeState);
    const restored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(saveEnvelope)));
    assert.equal(validateV3RunState(restored.runState), true, 'midyear shared-run JSON save validates');
    assert.equal(hash(restored.financeState), beforeFinanceRestoreHash, 'midyear FinanceState save/restore preserves the exact event state');
    run = structuredClone(restored.runState);
    financeState = structuredClone(restored.financeState);
    midyearRestoreHash = hash(run);
    assert.equal(midyearRestoreHash, beforeRestoreHash, 'midyear restore preserves exact shared state');
    midyearRestored = true;
  }
}

assert.equal(run.currentDate, END);
assert.equal(validateV3RunState(JSON.parse(JSON.stringify(run))), true, 'year-end JSON restore validates');
const annualFinance = reconcileV3Finance(financeState, END);
const economicScenario = assessV3T0074EconomicScenario(monthlyFinanceChecks.map(row => ({ period: row.period, netRevenueCents: row.revenueCents })));
const sourceRevenueCents = financeState.orders.reduce((sum, order) => sum + order.amountCents, 0);
const sourceReceiptsCents = financeState.events.filter(event => event.financeType === 'customer-payment').reduce((sum, event) => sum + event.amountCents, 0);
const sourceSimTaxCents = financeState.invoices.reduce((sum, invoice) => sum + invoice.simTaxCents, 0);
assert.equal(sourceRevenueCents, 5_760_000, 'twelve months of sixty €80 customer orders produce €57,600 sourced net revenue');
assert.equal(economicScenario.annual.variableOperatingCostCents, 2_016_000, 'D-0187 variable scenario cost is 35% of the annual sourced net revenue');
assert.equal(economicScenario.annual.fixedOperatingCostCents, 1_440_000, 'D-0187 fixed scenario costs cover twelve months');
assert.equal(economicScenario.annual.operatingResultCents, 2_304_000, 'positive scenario operating result is €23,040');
assert.equal(economicScenario.annual.ownerDrawCents, 2_160_000, 'private drawings remain separately classified for twelve months');
assert.equal(economicScenario.annual.scenarioSurplusAfterOwnerDrawCents, 144_000, 'scenario surplus after drawings is €1,440');
  assert.equal(createdInvoiceIds.length, CUSTOMER_ORDERS_PER_MONTH * 12, 'each source-bound customer acceptance produced exactly one D-0166 scenario invoice');
  assert.equal(new Set(createdInvoiceIds).size, CUSTOMER_ORDERS_PER_MONTH * 12, 'scenario invoice IDs are unique');
  assert.ok(receivedCustomerPaymentIds.length > 0 && receivedCustomerPaymentIds.length < createdInvoiceIds.length, 'due customer receipts are processed while late-December receivables remain open at year-end');
assert.equal(new Set(receivedCustomerPaymentIds).size, receivedCustomerPaymentIds.length, 'customer receipt event IDs are unique');
assert.equal(annualFinance.flows.recognizedRevenueCents, sourceRevenueCents, 'annual revenue equals the sum of sourced performance events');
assert.equal(economicScenario.annual.netRevenueCents, sourceRevenueCents, 'synthetic G3 scenario consumes exactly the reconciled net-revenue source and no other finance amounts');
assert.equal(economicScenario.periods.length, 12, 'synthetic G3 scenario reports all twelve months');
assert.equal(annualFinance.flows.customerReceiptsCents, sourceReceiptsCents, 'annual receipts equal the sum of sourced customer-payment events');
assert.equal(annualFinance.flows.simTaxAccruedCents, sourceSimTaxCents, 'annual SimTAX equals the sum of D-0166 invoice tax components');
assert.equal(annualFinance.stocks.bankCents, financeState.opening.bankCents + sourceReceiptsCents, 'closing bank reconciles from sourced opening plus customer receipts; no other cash event occurred');
  const expectedClosingReceivablesCents = sourceRevenueCents + sourceSimTaxCents - sourceReceiptsCents;
  assert.equal(annualFinance.stocks.receivablesCents, expectedClosingReceivablesCents, 'year-end gross receivables reconcile from recognized net revenue plus invoiced SimTAX less sourced receipts');
assert.equal(annualFinance.stocks.simTaxPayableCents, sourceSimTaxCents, 'closing SimTAX payable reconciles to the unpaid scenario tax components');
assert.equal(annualFinance.flows.supplierInvoicesCents, 0, 'no supplier invoice source event was present in this annual path');
assert.equal(annualFinance.flows.supplierPaymentsCents, 0, 'no supplier payment source event was present in this annual path');
assert.equal(annualFinance.flows.dispoDrawsCents, 0, 'no approved draw event occurred in this annual path');
assert.equal(annualFinance.flows.dispoRepaymentsCents, 0, 'no approved repayment event occurred in this annual path');
assert.equal(annualFinance.monthlyFlows['2027-12']?.closingStocks.bankCents, annualFinance.stocks.bankCents, 'December close matches year-end bank position');
assert.equal(annualFinance.monthlyFlows['2027-12']?.closingStocks.receivablesCents, annualFinance.stocks.receivablesCents, 'December close matches year-end receivables');
assert.equal(monthlyFinanceChecks.length, 12, 'all twelve monthly finance periods were reconciled');
  assert.deepEqual(financeState.events.map(event => event.financeType).sort(), Array(receivedCustomerPaymentIds.length).fill('customer-payment').concat(Array(CUSTOMER_ORDERS_PER_MONTH * 12).fill('recognized-performance'), Array(CUSTOMER_ORDERS_PER_MONTH * 12).fill('scenario-invoice-issued')).sort(), 'FinanceState contains only sourced customer-performance, D-0166 invoices, and D-0168 receipts');
assert.equal(resourceConflictChecked, true, 'competing worker/machine capacity was exercised');
  assert.equal(completedCustomerOrders.size, CUSTOMER_ORDERS_PER_MONTH * 12, 'each month completed sixty market-derived customer orders');
assert.equal(productOffers.size, 12, 'each month completed an own-product buyer decision');
assert.deepEqual([...productOffers.values()].map(row => row.decision.accepted), periods.map(period => productAcceptance[period]));
  assert.equal(run.dayEvents.filter(event => event.phase === 'customer_acceptance_decision' && event.result.decision === 'accept').length, CUSTOMER_ORDERS_PER_MONTH * 12);
assert.equal(run.dayEvents.filter(event => event.phase === 'product_sale_buyer_decision').length, 12);
const acceptedProductCount = periods.filter(period => productAcceptance[period]).length;
const rejectedProductCount = periods.length - acceptedProductCount;
assert.equal(run.dayEvents.filter(event => event.phase === 'product_sale_dispatch').length, acceptedProductCount);
  assert.equal(run.modules.product.finishedGoodsUsed, rejectedProductCount, 'accepted dispatches remove units while declined units remain in finished goods');
assert.equal(run.modules.product.products.reduce((sum, product) => sum + product.outputQuantity, 0), rejectedProductCount, 'ending product quantity matches declined monthly offers');
assert.equal(midyearRestored, true, 'annual shared flow resumes after a validated midyear JSON restore');
assert.equal(run.modules.market.inquiries.filter(inquiry => inquiry.customerId.startsWith('expiry-')).every(inquiry => inquiry.status === 'expired'), true, 'ineligible monthly inquiry windows expire deterministically');
assert.equal(run.modules.market.inquiries.filter(inquiry => inquiry.customerId.startsWith('ignored-')).every(inquiry => inquiry.status === 'resolved' && inquiry.winnerFirmId !== 'player'), true, 'unsubmitted player proposals are lost to a competitor');
assert.equal(run.modules.product.productSales.every(sale => sale.financeStatus === 'pending_non_posting' && sale.revenueStatus === 'pending_non_posting' && sale.cogsStatus === 'pending_deferred_bab' && !Object.hasOwn(sale, 'cogsCents')), true, 'own-product sales remain non-posting and COGS remains pending under D-0178');
assert.equal(receivedMaterialShipmentIds.length, 1, 'one explicit bulk-steel receipt feeds the operational fixture');
const positiveShipment = run.modules.product.materialShipments.find(row => row.shipmentId === 'T0074-POSITIVE-STEEL-SHIPMENT-632');
assert.equal(positiveShipment?.status, 'received', 'wholesale steel shipment arrives on the sourced synthetic ETA');
assert.equal(positiveShipment?.quantity, 632, 'the one-time synthetic replenishment covers the 720 job units and twelve product units above the 100-unit fixture stock');
assert.equal(run.modules.product.supplierInvoiceEvidence.filter(row => row.shipmentId === positiveShipment.shipmentId).length, 1, 'shipment invoice evidence remains in the product module only');
assert.equal(financeState.supplierInvoices.length, 0, 'bulk supplier invoice evidence does not silently enter the finance subledger');
assert.equal('ledger' in run, false);
assert.equal('cash' in run, false);

// Replay/restore must keep a single event and a single physical movement.
const firstSale = productOffers.get('2027-01');
assert.equal(recordV3RunProductSaleBuyerDecision(run, structuredClone(firstSale.decision)).duplicate, true);
assert.equal(closeV3RunDay(run, { date: END }).duplicate, true);
assert.equal(validateV3RunState(run), true);
  assert.equal(run.modules.product.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').length, acceptedProductCount);
const restoredHash = hash(JSON.parse(JSON.stringify(run)));
assert.equal(restoredHash, hash(run), 'JSON restore preserves the complete twelve-month shared state');

const tamperedCustomerDecision = structuredClone(run);
tamperedCustomerDecision.dayEvents.find(event => event.phase === 'customer_acceptance_decision').result.decision = 'reject';
assert.throws(() => validateV3RunState(tamperedCustomerDecision), { code: 'invalid_run_state' }, 'customer acceptance event tampering is rejected');
const tamperedProductSnapshot = structuredClone(run);
tamperedProductSnapshot.modules.product.productSales[0].offerSnapshot.offerPriceCents += 1;
assert.throws(() => validateV3RunState(tamperedProductSnapshot), { code: 'invalid_run_state' }, 'product offer snapshot tampering is rejected');
const tamperedFinishedGoods = structuredClone(run);
tamperedFinishedGoods.modules.product.finishedGoodsUsed += 1;
assert.throws(() => validateV3RunState(tamperedFinishedGoods), { code: 'invalid_run_state' }, 'finished-goods stock tampering is rejected');

console.log(JSON.stringify({
  status: 'PASS', periodCount: periods.length, periods, startDate: START, endDate: END,
  customerOrders: completedCustomerOrders.size,
  orderStatuses: [...completedCustomerOrders.values()].map(row => row.evidence.customerDecision.status),
  ownProductBuyerDecisions: [...productOffers.values()].map(row => row.decision.accepted ? 'accepted' : 'rejected'),
  ownProductDispatches: run.modules.product.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').length,
  resourceConflict: resourceConflictChecked,
  midyearRestore: { passed: midyearRestored, sha256: midyearRestoreHash },
  financeStatus: 'partial customer subledger reconciled; supplier invoice evidence non-posting; other flows pending',
  pendingFinance: true,
  financeScope: 'D-0166 customer scenario invoices and D-0168 receipts only; one D-0173 supplier invoice evidence remains pending/non-posting; no supplier AP/payment, GL, payroll, statutory tax, COGS/BAB or dispo event in source path',
  financialInvoices: createdInvoiceIds.length,
  financialReceipts: receivedCustomerPaymentIds.length,
  annualFinance: annualFinance.flows,
  annualClosingStocks: annualFinance.stocks,
  economicScenario,
  monthlyFinanceChecks,
  bab: 'deferred / no BAB calculation',
  replayRestoreTampering: 'PASS', stateSha256: restoredHash,
}, null, 2));
