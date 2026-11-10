import assert from 'node:assert/strict';
import {
  createV3FinanceState,
  recordV3CustomerPerformance,
  recordV3Invoice,
  recordV3CustomerPayment,
  processV3ScenarioCustomerReceiptsDue,
  reconcileV3Finance,
  calculateV3InvoiceTerms,
  recordV3ScenarioInvoiceFromCustomerEvidence,
  recordV3SupplierInvoiceFromRunEvidence,
  recordV3SupplierPayment
} from './v3-finance-runtime.js';
import { createV3MarketState, createV3MarketOfferId, V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';
import { createV3ProductState } from './v3-product-lifecycle.js';
import {
  createV3Run, advanceV3RunDay, openV3RunDay, closeV3RunDay,
  planV3RunWorkOrder, completeV3RunWorkOrderOperation, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction,
  placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment,
  deliverV3RunCustomerWorkOrder, recordV3RunCustomerAcceptanceDecision,
  validateV3RunState
} from './v3-run-orchestrator.js';
import { createRunSaveEnvelope, restoreRunSaveEnvelope } from './v3/run.js';

function sourceState() {
  return createV3FinanceState({
    runId: 'RUN-T0069-FIXTURE',
    opening: { date: '2027-01-04', sourceRef: 'OPENING-FIXTURE', bankCents: 100000, receivablesCents: 0, receivableSourceRefs: [] }
  });
}
function performance(overrides = {}) {
  return {
    eventId: 'PERF-1', eventType: 'customerPerformanceAccepted', runId: 'RUN-T0069-FIXTURE',
    sourceRef: 'A02-PERFORMANCE-1', effectiveDate: '2027-01-08', performanceDate: '2027-01-07',
    orderId: 'ORDER-1', customerRef: 'CUSTOMER-1', contractRef: 'CONTRACT-1',
    contractPartyAuthorityRef: 'CONTRACT-PARTY-1', offerSnapshotRef: 'OFFER-SNAPSHOT-1',
    acceptance: { actorRole: 'customer', actorRef: 'CUSTOMER-1', partyAuthorityRef: 'CONTRACT-PARTY-1', criterionRef: 'ACCEPTANCE-CRITERION-1', date: '2027-01-08' },
    authorization: { owner: 'A03', status: 'authorized', sourceRef: 'A03-AUTH-1' },
    recognizedRevenueCents: 50000, receivableCents: 50000,
    ...overrides
  };
}
function invoice(overrides = {}) {
  return {
    eventId: 'INV-EVENT-1', eventType: 'customerInvoiceIssued', runId: 'RUN-T0069-FIXTURE',
    sourceRef: 'INVOICE-SOURCE-1', effectiveDate: '2027-01-09', invoiceId: 'INV-1',
    invoiceDate: '2027-01-09', dueDate: '2027-01-23', orderId: 'ORDER-1',
    performanceEventId: 'PERF-1', contractRef: 'CONTRACT-1', receivableCents: 50000,
    ...overrides
  };
}
function payment(overrides = {}) {
  return {
    eventId: 'PAY-EVENT-1', eventType: 'customerPaymentReceived', runId: 'RUN-T0069-FIXTURE',
    sourceRef: 'BANK-RECEIPT-1', paymentId: 'PAY-1', paymentDate: '2027-01-20',
    effectiveDate: '2027-01-20', orderId: 'ORDER-1', invoiceId: 'INV-1',
    payerRef: 'CUSTOMER-1', contractRef: 'CONTRACT-1', amountCents: 50000,
    ...overrides
  };
}

assert.throws(() => createV3FinanceState({ runId: 'RUN' }), /opening/);
assert.throws(() => createV3FinanceState({ runId: 'RUN', opening: { date: '2027-01-04', bankCents: 0, receivablesCents: 0, receivableSourceRefs: [] } }), /sourceRef/);

const opening = sourceState();
assert.equal(Object.isFrozen(opening), true);
const invoiceTerms = calculateV3InvoiceTerms({
  dueDateAnchor: '2027-01-04',
  positions: [
    { positionRef: 'LINE-TAXABLE', netCents: 1000, taxable: true },
    { positionRef: 'LINE-EXEMPT', netCents: 1000, taxable: false },
    { positionRef: 'LINE-HALF-CENT', netCents: 50, taxable: true }
  ]
});
assert.deepEqual({
  dueDate: invoiceTerms.dueDate,
  net: invoiceTerms.netTotalCents,
  tax: invoiceTerms.simTaxTotalCents,
  gross: invoiceTerms.grossTotalCents,
  posting: invoiceTerms.postingEffect
}, { dueDate: '2027-01-18', net: 2050, tax: 200, gross: 2250, posting: 'none' });
assert.equal(invoiceTerms.positions[0].simTaxCents, 190);
assert.equal(invoiceTerms.positions[1].simTaxCents, 0);
assert.equal(invoiceTerms.positions[2].simTaxCents, 10, 'tax uses per-position half-up cent rounding');
assert.equal(Object.isFrozen(invoiceTerms), true);
assert.throws(() => calculateV3InvoiceTerms({ dueDateAnchor: '2027-01-04', positions: [{ positionRef: 'LINE', netCents: 1000 }] }), /taxable must be explicit/);
assert.throws(() => calculateV3InvoiceTerms({ dueDateAnchor: '2027-01-04', positions: [] }), /non-empty/);
assert.throws(() => calculateV3InvoiceTerms({ dueDateAnchor: '2027-01-04', positions: [
  { positionRef: 'DUP', netCents: 100, taxable: true }, { positionRef: 'DUP', netCents: 100, taxable: true }
] }), /references must be unique/);
assert.throws(() => calculateV3InvoiceTerms({ dueDateAnchor: '2027-01-04', positions: [{ positionRef: 'LINE', netCents: Number.MAX_SAFE_INTEGER, taxable: true }] }), /safe integer range/);
assert.throws(() => calculateV3InvoiceTerms({ dueDateAnchor: '9999-12-30', positions: [{ positionRef: 'LINE', netCents: 100, taxable: true }] }), /ISO calendar range/);
assert.deepEqual(reconcileV3Finance(opening, '2027-01-31').flows, { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, dispoDrawsCents: 0, dispoRepaymentsCents: 0, simTaxAccruedCents: 0 }, 'invoice calculation is non-posting');
assert.throws(() => recordV3CustomerPerformance(opening, performance({ acceptance: { actorRole: 'contractor', criterionRef: 'C', date: '2027-01-08' } })), /customer or recipient/);
assert.throws(() => recordV3CustomerPerformance(opening, performance({ acceptance: { actorRole: 'recipient', actorRef: 'UNRELATED-RECIPIENT', partyAuthorityRef: 'CONTRACT-PARTY-1', criterionRef: 'C', date: '2027-01-08' } })), /contractual customer or an evidenced representative/);
assert.throws(() => recordV3CustomerPerformance(opening, performance({ authorization: undefined })), /A03 authorization/);
assert.throws(() => recordV3CustomerPerformance(opening, performance({ recognizedRevenueCents: 42000 })), /must be equal explicit amounts/);

const recognized = recordV3CustomerPerformance(opening, performance());
assert.equal(recordV3CustomerPerformance(recognized, performance()), recognized, 'identical performance replay is a no-op');
assert.throws(() => recordV3CustomerPerformance(recognized, performance({ recognizedRevenueCents: 51000, receivableCents: 51000 })), /different payload/);
let view = reconcileV3Finance(recognized, '2027-01-31');
assert.deepEqual(view.flows, { recognizedRevenueCents: 50000, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, dispoDrawsCents: 0, dispoRepaymentsCents: 0, simTaxAccruedCents: 0 });
assert.deepEqual(view.stocks, { bankCents: 100000, receivablesCents: 50000, supplierAccountsPayableCents: 0, simTaxPayableCents: 0, dispoPrincipalCents: 0, dispoLimitCents: 0, dispoAvailableCents: 0, openingDate: '2027-01-04', openingSourceRef: 'OPENING-FIXTURE' });
assert.equal(view.monthlyFlows['2027-01'].recognizedRevenueCents, 50000);
assert.deepEqual(view.monthlyFlows['2027-01'].closingStocks, { date: '2027-01-31', bankCents: 100000, receivablesCents: 50000, supplierAccountsPayableCents: 0, dispoPrincipalCents: 0 });

const invoiced = recordV3Invoice(recognized, invoice());
assert.equal(recordV3Invoice(invoiced, invoice()), invoiced, 'identical invoice replay is a no-op');
assert.deepEqual(reconcileV3Finance(invoiced, '2027-01-31').flows, view.flows, 'invoice evidence does not create second revenue or cash');
assert.throws(() => recordV3Invoice(recognized, invoice({ receivableCents: 51000 })), /match the currently outstanding/);
assert.throws(() => recordV3Invoice(recognized, invoice({ effectiveDate: '2027-01-10' })), /effectiveDate must equal invoiceDate/);
assert.throws(() => recordV3Invoice(recognized, invoice({
  eventId: 'INV-BEFORE-ACCEPTANCE', invoiceId: 'INV-EARLY', sourceRef: 'INVOICE-EARLY',
  effectiveDate: '2027-01-07', invoiceDate: '2027-01-07'
})), /invoice date cannot precede/);
assert.throws(() => recordV3Invoice(recognized, invoice({
  eventId: 'INV-REUSED-SOURCE', invoiceId: 'INV-REUSED', sourceRef: 'A02-PERFORMANCE-1'
})), /sourceRef has already been used/);

assert.throws(() => recordV3CustomerPayment(invoiced, payment({ amountCents: 10000 })), /partial payment requires explicit contract permission/);
const paid = recordV3CustomerPayment(invoiced, payment());
assert.equal(recordV3CustomerPayment(paid, payment()), paid, 'identical payment replay is a no-op');
view = reconcileV3Finance(paid, '2027-01-31');
assert.deepEqual(view.flows, { recognizedRevenueCents: 50000, customerReceiptsCents: 50000, supplierInvoicesCents: 0, supplierPaymentsCents: 0, dispoDrawsCents: 0, dispoRepaymentsCents: 0, simTaxAccruedCents: 0 });
assert.deepEqual(view.stocks, { bankCents: 150000, receivablesCents: 0, supplierAccountsPayableCents: 0, simTaxPayableCents: 0, dispoPrincipalCents: 0, dispoLimitCents: 0, dispoAvailableCents: 0, openingDate: '2027-01-04', openingSourceRef: 'OPENING-FIXTURE' });
assert.deepEqual(view.monthlyFlows['2027-01'].closingStocks, { date: '2027-01-31', bankCents: 150000, receivablesCents: 0, supplierAccountsPayableCents: 0, dispoPrincipalCents: 0 });
assert.throws(() => recordV3CustomerPayment(paid, payment({ eventId: 'PAY-EVENT-DUP', paymentId: 'PAY-DUP' })), /sourceRef has already been used/);
assert.deepEqual(reconcileV3Finance(paid, '2027-02-28').flows, view.flows, 'annual flows do not duplicate a prior month');
assert.deepEqual(reconcileV3Finance(paid, '2027-02-28').monthlyFlows['2027-02'].closingStocks, { date: '2027-02-28', bankCents: 150000, receivablesCents: 0, supplierAccountsPayableCents: 0, dispoPrincipalCents: 0 });
assert.throws(() => recordV3CustomerPayment(invoiced, payment({ amountCents: 51000 })), /exceeds the open receivable/);
const februaryPayment = recordV3CustomerPayment(invoiced, payment({
  eventId: 'PAY-EVENT-FEB', paymentId: 'PAY-FEB', sourceRef: 'BANK-RECEIPT-FEB',
  effectiveDate: '2027-02-04', paymentDate: '2027-02-04'
}));
const twoMonthView = reconcileV3Finance(februaryPayment, '2027-02-28');
assert.deepEqual(twoMonthView.monthlyFlows['2027-01'], {
  recognizedRevenueCents: 50000, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0,
  closingStocks: { date: '2027-01-31', bankCents: 100000, receivablesCents: 50000, supplierAccountsPayableCents: 0, dispoPrincipalCents: 0 }
});
assert.deepEqual(twoMonthView.monthlyFlows['2027-02'], {
  recognizedRevenueCents: 0, customerReceiptsCents: 50000, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0,
  closingStocks: { date: '2027-02-28', bankCents: 150000, receivablesCents: 0, supplierAccountsPayableCents: 0, dispoPrincipalCents: 0 }
});
assert.deepEqual(twoMonthView.yearlyFlows['2027'], { recognizedRevenueCents: 50000, customerReceiptsCents: 50000, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 });
assert.throws(() => reconcileV3Finance(paid, '2027-01-03'), /cannot precede/);
assert.ok(view.limitations.some(text => text.includes('COGS')));

function scenarioRun({ runId = 'RUN-T0069-FIXTURE', decision = 'accept', recipient = false } = {}) {
  const parameters = {
    weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
    invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
    minimumInvitationScore: 0.2, maximumInvitations: 4,
    offerWindowCalendarDays: { min: 3, max: 5 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 },
    minimumMonthlyCompetitorSample: 3
  };
  const segments = [{ segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } }];
  const firms = [
    { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: 0.75 } },
    { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning'], segmentFit: { small: 0.8 }, offerPriceCentsBySizeClass: { small: 1000000 } },
    { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6 }, offerPriceCentsBySizeClass: { small: 1200000 } },
    { firmId: 'competitor-c', role: 'competitor', reputation: 0.6, capacityUnits: 9, capabilities: ['turning'], segmentFit: { small: 0.7 }, offerPriceCentsBySizeClass: { small: 1150000 } }
  ];
  const marketState = createV3MarketState({ runId, scenarioId: 'scenario-1', seed: 'seed-1', parameterSetId: 'market-test-v1', startDate: '2027-01-04', parameters, segments, firms });
  const productState = createV3ProductState({ runId, currentDate: '2027-01-04', people: [{ id: 'worker-1', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'machine-1', hoursPerDay: 8, capabilities: ['turning'] }], materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 2, finishedGoodsUsed: 0, commitments: [] });
  let run = createV3Run({ runId, scenarioId: 'scenario-1', seed: 'seed-1', startDate: '2027-01-04', endDate: '2027-12-31', marketState, productState });
  const template = { templateId: 'inquiry-1', customerId: 'customer-1', segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 2, referencePriceCents: 110000, macroPeriod: '2027-01' };
  const templates = Array.from({ length: 5 }, (_, index) => ({ ...template, templateId: `inquiry-${index + 1}`, customerId: `customer-${index + 1}` }));
  const submissionEventId = 'offer-submission-scenario';
  const offerId = createV3MarketOfferId(run.modules.market, submissionEventId);
  const calc = { modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId, submittedAt: '2027-01-04', netPriceCents: 90000, costVersion: 'cost-fixture-v1', babVersion: 'bab-fixture-v1', calculation: { netPriceCents: 90000, dbICents: 3000 } };
  const terms = { version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Drehteil nach Kundenvorgabe', quantity: 2, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maße gemäß Zeichnung', deliveryDate: '2027-01-12', contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION) };
  run = advanceV3RunDay(run, { date: '2027-01-04', marketWeekTemplates: templates, offers: [{ eventId: submissionEventId, templateId: 'inquiry-1', firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: calc, commercialTerms: terms }] }).state;
  for (const date of ['2027-01-05', '2027-01-06']) run = advanceV3RunDay(run, { date }).state;
  let state = openV3RunDay(run, { date: '2027-01-07' }).state;
  const order = state.customerWorkOrders[0];
  assert.ok(order, 'scenario fixture has an accepted work order');
  const instructionId = `T0077-instruction:${runId}`;
  const instruction = planV3RunEquipmentInstruction(state, { instructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-07', sourceRef: `instruction:${instructionId}` });
  assert.equal(instruction.ok, true, 'D-0183 first-use instruction is planned in the shared run');
  const instructed = completeV3RunEquipmentInstruction(instruction.state, { instructionId });
  assert.equal(instructed.ok, true, 'D-0183 first-use instruction is completed before machine use');
  state = instructed.state;
  const recipientPartyId = recipient ? 'recipient-1' : order.customerPartyId;
  const partyAuthorityRef = recipient ? 'authority:recipient-1-for-customer-1' : null;
  const contractSnapshot = {
    contractRef: `contract:${runId}`, inquiryId: order.inquiryId, offerId: order.offerId, decisionId: order.decisionId,
    contractType: V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType, commercialTermsSnapshot: structuredClone(order.contractTermsSnapshot),
    customerPartyId: order.customerPartyId, buyerPartyId: 'buyer-1', acceptancePartyId: recipientPartyId,
    ...(recipient ? { authorizedForRef: order.customerPartyId, partyAuthorityRef } : {}),
    performanceCriterionRef: 'performance:1', acceptanceCriterionRef: 'acceptance:1', orderQuantity: 2, orderUnit: 'pieces'
  };
  const operations = [{ operationId: 'cut', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 3, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } },
    { operationId: 'finish', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 2, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: ['cut'], materials: { steel: 1 } }];
  state = planV3RunWorkOrder(state, { workOrderId: order.workOrderId, contractSnapshot, operations }).state;
  state = completeV3RunWorkOrderOperation(state, { workOrderId: order.workOrderId, operationId: 'cut' }).state;
  state = completeV3RunWorkOrderOperation(state, { workOrderId: order.workOrderId, operationId: 'finish' }).state;
  state = closeV3RunDay(state, { date: '2027-01-07' }).state;
  state = openV3RunDay(state, { date: '2027-01-08' }).state;
  const delivery = { deliveryId: `delivery:${runId}`, sourceRef: `delivery-source:${runId}`, workOrderId: order.workOrderId, deliveryDate: '2027-01-08', recipientPartyId, deliveryCriterionRef: 'performance:1', acceptanceCriterionRef: 'acceptance:1', quantity: 2, unit: 'pieces' };
  state = deliverV3RunCustomerWorkOrder(state, delivery).state;
  state = recordV3RunCustomerAcceptanceDecision(state, {
    decisionId: `decision:${runId}`, sourceRef: `decision-source:${runId}`, workOrderId: order.workOrderId, deliveryId: delivery.deliveryId,
    decisionDate: '2027-01-08', decision, actorRole: recipient ? 'recipient' : 'customer', actorPartyId: recipientPartyId,
    customerRef: order.customerPartyId, authorizedForRef: recipient ? order.customerPartyId : null, partyAuthorityRef,
    acceptanceCriterionRef: 'acceptance:1'
  }).state;
  assert.equal(validateV3RunState(structuredClone(state)), true, 'scenario fixture is a valid persisted A02 run');
  return { state, workOrderId: order.workOrderId, customerRef: order.customerPartyId, contractRef: contractSnapshot.contractRef };
}

const scenarioFixture = scenarioRun();
const scenarioInput = { runState: scenarioFixture.state, workOrderId: scenarioFixture.workOrderId };
let supplierRun = structuredClone(scenarioFixture.state);
const supplierReceiptDate = supplierRun.activeDay.date;
supplierRun = placeV3RunInternationalMaterialOrder(supplierRun, {
  orderId: 'SUPPLIER-ORDER-1', shipmentId: 'SUPPLIER-SHIPMENT-1', materialId: 'steel', quantity: 2,
  supplierId: 'local', sourceRef: 'supplier-order-source-1', fixtureId: 'synthetic:D-0173:supplier-profile-v1',
  baselineEtaDate: supplierReceiptDate, etaDate: supplierReceiptDate, lagDays: 0
}).state;
supplierRun = receiveV3RunInternationalMaterialShipment(supplierRun, 'SUPPLIER-SHIPMENT-1').state;
const supplierSourceInvoice = supplierRun.modules.product.supplierInvoiceEvidence[0];
assert.equal(supplierSourceInvoice.status, 'pending_non_posting', 'A02 source invoice remains evidence-only before the separate D-0174 AP handoff');
const supplierOpening = createV3FinanceState({ runId: supplierRun.runId, opening: { date: '2027-01-01', sourceRef: 'D-0180:opening-profile-v3-2027', bankCents: 1_000_000, equityCents: 1_000_000, receivablesCents: 0, receivableSourceRefs: [] } });
const supplierAP = recordV3SupplierInvoiceFromRunEvidence(supplierOpening, { runState: supplierRun, invoiceId: supplierSourceInvoice.invoiceId });
assert.equal(supplierAP.supplierInvoices[0].amountCents, 392, 'supplier AP uses the cent-exact accepted local supplier invoice amount');
assert.equal(recordV3SupplierInvoiceFromRunEvidence(supplierAP, { runState: supplierRun, invoiceId: supplierSourceInvoice.invoiceId }), supplierAP, 'identical supplier invoice evidence replay is a no-op');
let supplierView = reconcileV3Finance(supplierAP, supplierReceiptDate);
assert.equal(supplierView.stocks.supplierAccountsPayableCents, 392, 'accepted invoice adds AP only');
assert.equal(supplierView.stocks.bankCents, 1_000_000, 'invoice/AP event leaves bank unchanged');
assert.equal(supplierView.flows.supplierInvoicesCents, 392);
const supplierPayment = {
  eventId: `D-0174:SUPPLIER-PAYMENT-EVENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:${supplierReceiptDate}`,
  eventType: 'supplierPaymentExecuted', runId: supplierAP.runId,
  sourceRef: `D-0174:SUPPLIER-PAYMENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:${supplierReceiptDate}`,
  paymentId: `D-0174:SUPPLIER-PAYMENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:${supplierReceiptDate}`,
  invoiceId: supplierSourceInvoice.invoiceId,
  supplierId: supplierSourceInvoice.supplierId, paymentDate: supplierReceiptDate, effectiveDate: supplierReceiptDate,
  amountCents: supplierSourceInvoice.amountCents, currency: 'EUR', bankAccountRef: 'company-bank',
  bankTransactionRef: `D-0174:SUPPLIER-PAYMENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:${supplierReceiptDate}`,
  execution: { status: 'executed', actorRole: 'player', actorRef: 'player' },
  authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0174', sourceRef: 'A03-D-0174-SUPPLIER-PAYMENT' }
};
assert.throws(() => recordV3SupplierPayment(supplierAP, { ...supplierPayment, amountCents: 391 }), /full remaining AP balance/);
const noCashOpening = createV3FinanceState({ runId: supplierRun.runId, opening: { date: '2027-01-01', sourceRef: 'OPENING-NO-CASH', bankCents: 100, receivablesCents: 0, receivableSourceRefs: [] } });
const noCashAP = recordV3SupplierInvoiceFromRunEvidence(noCashOpening, { runState: supplierRun, invoiceId: supplierSourceInvoice.invoiceId });
assert.throws(() => recordV3SupplierPayment(noCashAP, supplierPayment), /insufficient bank balance; an explicit D-0125 manual draw decision is required/);
const paidSupplier = recordV3SupplierPayment(supplierAP, supplierPayment);
assert.equal(recordV3SupplierPayment(paidSupplier, structuredClone(supplierPayment)), paidSupplier, 'identical supplier payment replay is a no-op');
supplierView = reconcileV3Finance(paidSupplier, supplierReceiptDate);
assert.equal(supplierView.stocks.supplierAccountsPayableCents, 0, 'executed payment clears the same AP amount');
assert.equal(supplierView.stocks.bankCents, 999608, 'executed payment reduces bank by the exact AP amount');
assert.equal(supplierView.flows.supplierPaymentsCents, 392);
assert.equal(supplierView.flows.recognizedRevenueCents, 0, 'supplier AP/payment does not create revenue');
assert.equal(supplierView.stocks.receivablesCents, 0, 'supplier AP/payment does not create receivables');
const supplierEnvelope = createRunSaveEnvelope(supplierRun, paidSupplier);
const supplierRestored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(supplierEnvelope)));
assert.deepEqual(reconcileV3Finance(supplierRestored.financeState, supplierReceiptDate).stocks, supplierView.stocks, 'AP and bank survive the existing JSON run save/restore envelope');
const tamperedSupplierEnvelope = structuredClone(supplierEnvelope);
tamperedSupplierEnvelope.financeState.supplierInvoices[0].amountCents += 1;
assert.throws(() => restoreRunSaveEnvelope(tamperedSupplierEnvelope), /Lieferanten-OP stimmt nicht|immutable source event/);
const supplierPaymentTamperCases = [
  ['authorization owner', event => { event.authorization.owner = 'player'; }],
  ['authorization status', event => { event.authorization.status = 'pending'; }],
  ['payment source', event => { event.sourceRef = 'tampered-payment-source'; }],
  ['bank transaction reference', event => { event.bankTransactionRef = 'tampered-bank-transaction'; }],
  ['bank account reference', event => { event.bankAccountRef = 'tampered-bank-account'; }],
  ['execution actor', event => { event.execution.actorRef = 'tampered-actor'; }],
];
for (const [label, mutate] of supplierPaymentTamperCases) {
  const tampered = structuredClone(supplierEnvelope);
  mutate(tampered.financeState.events.find(row => row.financeType === 'supplier-payment-executed'));
  assert.throws(() => restoreRunSaveEnvelope(tampered), /immutable persisted event fingerprint|Lieferantenzahlungsbeleg stimmt nicht/, `${label} tampering fails closed on restore`);
}
const supplierInvoiceTamper = structuredClone(supplierEnvelope);
supplierInvoiceTamper.financeState.events.find(row => row.financeType === 'supplier-invoice-ap').authorization.sourceRef = 'tampered-invoice-authorization';
assert.throws(() => restoreRunSaveEnvelope(supplierInvoiceTamper), /immutable persisted event fingerprint/, 'supplier invoice authorization tampering fails closed on restore');
const canonical = value => Array.isArray(value)
  ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
    : value;
const recomputePersistedFingerprint = (financeState, event) => {
  financeState.processed[event.eventId].persistedEventHash = JSON.stringify(canonical(event));
};
const jointlyTamperedSupplierEnvelope = structuredClone(supplierEnvelope);
const jointlyTamperedFinance = jointlyTamperedSupplierEnvelope.financeState;
const jointlyTamperedInvoice = jointlyTamperedFinance.supplierInvoices[0];
const jointlyTamperedInvoiceEvent = jointlyTamperedFinance.events.find(row => row.financeType === 'supplier-invoice-ap');
const jointlyTamperedPayment = jointlyTamperedFinance.events.find(row => row.financeType === 'supplier-payment-executed');
jointlyTamperedInvoice.amountCents = 1000;
jointlyTamperedInvoiceEvent.amountCents = 1000;
jointlyTamperedInvoiceEvent.accountsPayableEffectCents = 1000;
jointlyTamperedPayment.amountCents = 1000;
jointlyTamperedPayment.accountsPayableEffectCents = -1000;
jointlyTamperedPayment.cashEffectCents = -1000;
recomputePersistedFingerprint(jointlyTamperedFinance, jointlyTamperedInvoiceEvent);
recomputePersistedFingerprint(jointlyTamperedFinance, jointlyTamperedPayment);
assert.throws(() => restoreRunSaveEnvelope(jointlyTamperedSupplierEnvelope), /Lieferanten-OP stimmt nicht mit Rechnung, Angebot und Wareneingang/,
  'recomputed local fingerprints cannot override the independently stored A02 supplier invoice evidence');
const crossMonthPayment = {
  ...supplierPayment,
  eventId: `D-0174:SUPPLIER-PAYMENT-EVENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:2027-02-02`,
  sourceRef: `D-0174:SUPPLIER-PAYMENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:2027-02-02`,
  paymentId: `D-0174:SUPPLIER-PAYMENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:2027-02-02`,
  paymentDate: '2027-02-02',
  effectiveDate: '2027-02-02',
  bankTransactionRef: `D-0174:SUPPLIER-PAYMENT:${encodeURIComponent(supplierAP.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:2027-02-02`,
};
const crossMonthSupplier = recordV3SupplierPayment(supplierAP, crossMonthPayment);
const crossMonthJanuary = reconcileV3Finance(crossMonthSupplier, '2027-01-31');
assert.equal(crossMonthJanuary.monthlyFlows['2027-01'].closingStocks.supplierAccountsPayableCents, 392, 'January close retains the unpaid supplier AP');
assert.equal(crossMonthJanuary.monthlyFlows['2027-01'].closingStocks.bankCents, 1_000_000, 'January close has no February bank outflow');
const crossMonthFebruary = reconcileV3Finance(crossMonthSupplier, '2027-02-28');
assert.equal(crossMonthFebruary.monthlyFlows['2027-02'].closingStocks.supplierAccountsPayableCents, 0, 'February payment clears the January supplier AP');
assert.equal(crossMonthFebruary.monthlyFlows['2027-02'].closingStocks.bankCents, 999608, 'February close reflects the exact supplier payment');
assert.throws(() => recordV3ScenarioInvoiceFromCustomerEvidence(opening, { ...scenarioInput, authorization: { owner: 'A03', status: 'authorized' } }), /caller-supplied evidence or authorization/);
assert.throws(() => recordV3ScenarioInvoiceFromCustomerEvidence(opening, { ...scenarioInput, evidence: {} }), /caller-supplied evidence or authorization/);
const fakeCrossOrderEvidence = { workOrderId: 'ORDER-A', contract: { contractRef: 'CONTRACT-B' }, delivery: { deliveryId: 'DELIVERY-B' }, customerDecision: { decisionId: 'DECISION-B' } };
assert.throws(() => recordV3ScenarioInvoiceFromCustomerEvidence(opening, { ...scenarioInput, evidence: fakeCrossOrderEvidence }), /caller-supplied evidence or authorization/);
const tamperedRunState = structuredClone(scenarioFixture.state);
tamperedRunState.customerWorkOrders[0].offerId = 'OTHER-WORKORDER-OFFER';
assert.throws(() => recordV3ScenarioInvoiceFromCustomerEvidence(opening, { runState: tamperedRunState, workOrderId: scenarioFixture.workOrderId }), { code: 'invalid_run_state' });
const wrongRunOpening = createV3FinanceState({ runId: 'OTHER-RUN', opening: { date: '2027-01-04', sourceRef: 'OPENING-OTHER', bankCents: 100000, receivablesCents: 0, receivableSourceRefs: [] } });
assert.throws(() => recordV3ScenarioInvoiceFromCustomerEvidence(wrongRunOpening, scenarioInput), /runId does not match/);
assert.throws(() => recordV3Invoice(opening, { ...invoice(), policyVersion: 'D-0166', invoiceLabel: 'Szenario-Rechnung (vereinfacht)' }), /must use validated A02 run evidence/);
const rejectedScenario = scenarioRun({ decision: 'reject' });
assert.throws(() => recordV3ScenarioInvoiceFromCustomerEvidence(opening, { runState: rejectedScenario.state, workOrderId: rejectedScenario.workOrderId }), /positive non-posting customer decision/);
const recipientFixture = scenarioRun({ runId: 'RUN-T0069-RECIPIENT', recipient: true });
const recipientOpening = createV3FinanceState({ runId: 'RUN-T0069-RECIPIENT', opening: { date: '2027-01-04', sourceRef: 'OPENING-RECIPIENT', bankCents: 100000, receivablesCents: 0, receivableSourceRefs: [] } });
const recipientInvoiceState = recordV3ScenarioInvoiceFromCustomerEvidence(recipientOpening, { runState: recipientFixture.state, workOrderId: recipientFixture.workOrderId });
assert.equal(recipientInvoiceState.orders[0].receivableOutstandingCents, 107100, 'authorized representative invoice records gross receivable');

const originalRun = JSON.stringify(scenarioFixture.state);
const scenarioInvoiceState = recordV3ScenarioInvoiceFromCustomerEvidence(opening, scenarioInput);
assert.equal(JSON.stringify(scenarioFixture.state), originalRun, 'finance adapter does not mutate the A02 run state');
assert.equal(recordV3ScenarioInvoiceFromCustomerEvidence(scenarioInvoiceState, scenarioInput), scenarioInvoiceState, 'scenario invoice replay is idempotent');
assert.equal(scenarioInvoiceState.invoices[0].invoiceLabel, 'Szenario-Rechnung (vereinfacht)');
assert.equal(scenarioInvoiceState.orders[0].performanceDate, '2027-01-07', 'D-0167 uses last completed operation, not delivery');
assert.equal(scenarioInvoiceState.invoices[0].netAmountCents, 90000);
assert.equal(scenarioInvoiceState.invoices[0].simTaxCents, 17100);
assert.equal(scenarioInvoiceState.invoices[0].amountCents, 107100, 'invoice receivable is gross');
assert.equal(scenarioInvoiceState.invoices[0].invoiceDate, '2027-01-08');
assert.equal(scenarioInvoiceState.invoices[0].dueDate, '2027-01-21', '14 days use the later performance/invoice date anchor');
const scenarioView = reconcileV3Finance(scenarioInvoiceState, '2027-01-21');
assert.deepEqual(scenarioView.flows, { recognizedRevenueCents: 90000, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, dispoDrawsCents: 0, dispoRepaymentsCents: 0, simTaxAccruedCents: 17100 });
assert.deepEqual(scenarioView.stocks, { bankCents: 100000, receivablesCents: 107100, supplierAccountsPayableCents: 0, simTaxPayableCents: 17100, dispoPrincipalCents: 0, dispoLimitCents: 0, dispoAvailableCents: 0, openingDate: '2027-01-04', openingSourceRef: 'OPENING-FIXTURE' });
const beforeDue = processV3ScenarioCustomerReceiptsDue(scenarioInvoiceState, '2027-01-20');
assert.equal(beforeDue, scenarioInvoiceState, 'scenario receipt is not posted before the exact due date');
const dueReceipt = processV3ScenarioCustomerReceiptsDue(scenarioInvoiceState, '2027-01-21');
assert.equal(dueReceipt.events.filter(event => event.financeType === 'customer-payment').length, 1, 'exact due date creates one receipt');
const duePaymentEvent = dueReceipt.events.find(event => event.financeType === 'customer-payment');
assert.equal(duePaymentEvent.effectiveDate, scenarioInvoiceState.invoices[0].dueDate, 'receipt effective date equals stored due date');
assert.equal(duePaymentEvent.amountCents, scenarioInvoiceState.invoices[0].amountCents, 'receipt is the full gross invoice amount');
assert.match(duePaymentEvent.eventId, /D-0168:RUN-T0069-FIXTURE:/, 'receipt event ID is stable and references D-0168/run/invoice');
assert.match(duePaymentEvent.sourceRef, /D-0168:RUN-T0069-FIXTURE:/, 'receipt sourceRef is stable and references D-0168/run/invoice');
assert.equal(processV3ScenarioCustomerReceiptsDue(dueReceipt, '2027-01-21'), dueReceipt, 'reprocessing the same due date is a no-op');
assert.equal(processV3ScenarioCustomerReceiptsDue(scenarioInvoiceState, '2027-01-22'), scenarioInvoiceState, 'missed due date is not caught up later');
const dueReceiptView = reconcileV3Finance(dueReceipt, '2027-01-21');
assert.deepEqual(dueReceiptView.flows, { recognizedRevenueCents: 90000, customerReceiptsCents: 107100, supplierInvoicesCents: 0, supplierPaymentsCents: 0, dispoDrawsCents: 0, dispoRepaymentsCents: 0, simTaxAccruedCents: 17100 }, 'receipt adds cash without recognizing revenue twice');
assert.deepEqual(dueReceiptView.stocks, { bankCents: 207100, receivablesCents: 0, supplierAccountsPayableCents: 0, simTaxPayableCents: 17100, dispoPrincipalCents: 0, dispoLimitCents: 0, dispoAvailableCents: 0, openingDate: '2027-01-04', openingSourceRef: 'OPENING-FIXTURE' }, 'gross AR clears, bank rises, SimTAX remains payable');
const nonScenarioDueState = structuredClone(scenarioInvoiceState);
nonScenarioDueState.invoices[0].policyVersion = null;
assert.equal(processV3ScenarioCustomerReceiptsDue(nonScenarioDueState, '2027-01-21'), nonScenarioDueState, 'non-D-0166 invoice versions are not auto-paid');
for (const [dueDate, beforeDate] of [['2027-01-25', '2027-01-24'], ['2027-02-01', '2027-01-31']]) {
  const boundaryState = structuredClone(scenarioInvoiceState);
  boundaryState.invoices[0].dueDate = dueDate;
  assert.equal(processV3ScenarioCustomerReceiptsDue(boundaryState, beforeDate), boundaryState, `no receipt before shifted due date ${dueDate}`);
  const boundaryPaid = processV3ScenarioCustomerReceiptsDue(boundaryState, dueDate);
  assert.equal(boundaryPaid.events.filter(event => event.financeType === 'customer-payment').length, 1, `weekend/month-boundary due date ${dueDate} is processed only on that date`);
}
const scenarioPaid = recordV3CustomerPayment(scenarioInvoiceState, {
  eventId: 'PAY-SCENARIO-1', eventType: 'customerPaymentReceived', runId: scenarioFixture.state.runId,
  sourceRef: 'BANK-SCENARIO-1', paymentId: 'PAY-ID-SCENARIO-1', paymentDate: '2027-02-01', effectiveDate: '2027-02-01',
  orderId: scenarioFixture.workOrderId, invoiceId: scenarioInvoiceState.invoices[0].invoiceId,
  payerRef: scenarioFixture.customerRef, contractRef: scenarioFixture.contractRef, amountCents: 107100
});
const scenarioPaidView = reconcileV3Finance(scenarioPaid, '2027-02-01');
assert.equal(scenarioPaidView.flows.customerReceiptsCents, 107100, 'cash only changes with explicit sourced payment');
assert.equal(scenarioPaidView.stocks.receivablesCents, 0, 'gross receivable is cleared by gross receipt');
assert.equal(scenarioPaidView.stocks.simTaxPayableCents, 17100, 'tax remittance is not inferred from customer receipt');
assert.throws(() => recordV3CustomerPayment(scenarioInvoiceState, {
  eventId: 'PAY-UNSOURCED', eventType: 'customerPaymentReceived', runId: scenarioFixture.state.runId,
  sourceRef: '', paymentId: 'PAY-ID-UNSOURCED', paymentDate: '2027-02-01', effectiveDate: '2027-02-01',
  orderId: scenarioFixture.workOrderId, invoiceId: scenarioInvoiceState.invoices[0].invoiceId,
  payerRef: scenarioFixture.customerRef, contractRef: scenarioFixture.contractRef, amountCents: 107100
}), /sourceRef/);
assert.ok(scenarioView.monthlyFlows['2027-01'].simTaxAccruedCents === 17100);
assert.ok(scenarioView.yearlyFlows['2027'].simTaxAccruedCents === 17100);
const yearBoundaryTerms = calculateV3InvoiceTerms({ dueDateAnchor: '2027-12-20', positions: [{ positionRef: 'YEAR-BOUNDARY', netCents: 100, taxable: true }] });
assert.equal(yearBoundaryTerms.dueDate, '2028-01-03');

console.log('V3 finance runtime regressions passed (validated synthetic A02 run fixtures).');
