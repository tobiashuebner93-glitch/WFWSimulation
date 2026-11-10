import assert from 'node:assert/strict';
import { createV3FinanceState, reconcileV3Finance, recordV3CustomerPerformance, recordV3CustomerPayment, recordV3ScenarioInvoiceFromCustomerEvidence, processV3ScenarioCustomerReceiptsDue, recordV3SupplierInvoiceFromRunEvidence, recordV3SupplierPayment } from './v3-finance-runtime.js';
import { projectV3FinanceLedger } from './v3-finance-ledger-projection.js';
import { createRunSaveEnvelope, restoreRunSaveEnvelope } from './v3/run.js';
import { createV3MarketState, createV3MarketOfferId, V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';
import { createV3ProductState } from './v3-product-lifecycle.js';
import {
  createV3Run, advanceV3RunDay, openV3RunDay, closeV3RunDay, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction,
  planV3RunWorkOrder, completeV3RunWorkOrderOperation, placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment,
  deliverV3RunCustomerWorkOrder, recordV3RunCustomerAcceptanceDecision,
  validateV3RunState
} from './v3-run-orchestrator.js';

function scenarioRun() {
  const runId = 'RUN-T0077-LEDGER';
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
  const commercialTerms = { version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Fertigung einer Metallbaugruppe', quantity: 2, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maß- und Funktionsprüfung bestanden', deliveryDate: '2027-01-08', contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION) };
  run = advanceV3RunDay(run, { date: '2027-01-04', marketWeekTemplates: templates, offers: [{ eventId: submissionEventId, templateId: 'inquiry-1', firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: calc, commercialTerms }] }).state;
  for (const date of ['2027-01-05', '2027-01-06']) run = advanceV3RunDay(run, { date }).state;
  let state = openV3RunDay(run, { date: '2027-01-07' }).state;
  const order = state.customerWorkOrders[0];
  assert.ok(order, 'fixture has a source-bound customer work order');
  const instructionId = `T0077-instruction:${runId}`;
  const instruction = planV3RunEquipmentInstruction(state, { instructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-07', sourceRef: `instruction:${instructionId}` });
  assert.equal(instruction.ok, true, 'D-0183 first-use instruction is planned in the shared run');
  const instructed = completeV3RunEquipmentInstruction(instruction.state, { instructionId });
  assert.equal(instructed.ok, true, 'D-0183 first-use instruction is completed before machine use');
  state = instructed.state;
  const contractSnapshot = {
    contractRef: `contract:${runId}`, inquiryId: order.inquiryId, offerId: order.offerId, decisionId: order.decisionId,
    contractType: V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType, customerPartyId: order.customerPartyId, buyerPartyId: order.customerPartyId, acceptancePartyId: order.customerPartyId,
    authorizedForRef: null, partyAuthorityRef: null,
    performanceCriterionRef: 'performance:1', acceptanceCriterionRef: 'acceptance:1', orderQuantity: 2, orderUnit: 'pieces', storageUnitsPerOrderUnit: 1,
    commercialTermsSnapshot: structuredClone(order.contractTermsSnapshot)
  };
  const operations = [
    { operationId: 'cut', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 3, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } },
    { operationId: 'finish', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 2, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: ['cut'], materials: { steel: 1 } }
  ];
  state = planV3RunWorkOrder(state, { workOrderId: order.workOrderId, contractSnapshot, operations }).state;
  state = completeV3RunWorkOrderOperation(state, { workOrderId: order.workOrderId, operationId: 'cut' }).state;
  state = completeV3RunWorkOrderOperation(state, { workOrderId: order.workOrderId, operationId: 'finish' }).state;
  state = closeV3RunDay(state, { date: '2027-01-07' }).state;
  state = openV3RunDay(state, { date: '2027-01-08' }).state;
  const delivery = { deliveryId: `delivery:${runId}`, sourceRef: `delivery-source:${runId}`, workOrderId: order.workOrderId, deliveryDate: '2027-01-08', recipientPartyId: order.customerPartyId, deliveryCriterionRef: 'performance:1', acceptanceCriterionRef: 'acceptance:1', quantity: 2, unit: 'pieces' };
  state = deliverV3RunCustomerWorkOrder(state, delivery).state;
  state = recordV3RunCustomerAcceptanceDecision(state, {
    decisionId: `decision:${runId}`, sourceRef: `decision-source:${runId}`, workOrderId: order.workOrderId, deliveryId: delivery.deliveryId,
    decisionDate: '2027-01-08', decision: 'accept', actorRole: 'customer', actorPartyId: order.customerPartyId,
    customerRef: order.customerPartyId, authorizedForRef: null, partyAuthorityRef: null, acceptanceCriterionRef: 'acceptance:1'
  }).state;
  assert.equal(validateV3RunState(structuredClone(state)), true);
  return { state, workOrderId: order.workOrderId };
}

const run = scenarioRun();
const zeroEventFinance = createV3FinanceState({ runId: run.state.runId, opening: { date: '2027-01-01', sourceRef: 'D-0180:opening-profile-v3-2027', bankCents: 1_000_000, equityCents: 1_000_000, receivablesCents: 0, receivableSourceRefs: [] } });
const zeroEventProjection = projectV3FinanceLedger(zeroEventFinance, '2027-01-01');
assert.equal(zeroEventProjection.lines.length, 2, 'D-0180 opening produces one balanced opening pair with zero events');
assert.equal(zeroEventProjection.totals.debitCents, 1_000_000);
assert.equal(zeroEventProjection.totals.creditCents, 1_000_000);
assert.equal(zeroEventProjection.reconciledToFinanceState.bankCents, 1_000_000, 'opening bank is represented exactly once');
assert.equal(zeroEventProjection.reconciledToFinanceState.customerReceiptsCents, 0);
assert.equal(zeroEventProjection.reconciledToFinanceState.dispoPrincipalCents, 0);
const zeroEventEnvelope = createRunSaveEnvelope(run.state, zeroEventFinance);
const zeroEventRestored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(zeroEventEnvelope)));
assert.deepEqual(projectV3FinanceLedger(zeroEventRestored.financeState, '2027-01-01'), zeroEventProjection, 'D-0180 zero-event projection reconciles identically after save/restore');
let finance = createV3FinanceState({ runId: run.state.runId, opening: { date: '2027-01-04', sourceRef: 'OPENING-T0077', bankCents: 100000, receivablesCents: 0, receivableSourceRefs: [] } });
const beforeRun = JSON.stringify(run.state);
finance = recordV3ScenarioInvoiceFromCustomerEvidence(finance, { runState: run.state, workOrderId: run.workOrderId });
assert.equal(JSON.stringify(run.state), beforeRun, 'invoice adapter does not mutate the A02 run');
assert.equal(finance.orders[0].amountCents, 90000);
assert.equal(finance.invoices[0].simTaxCents, 17100);
const unpaidBefore = structuredClone(finance);
const beforeCutoff = projectV3FinanceLedger(finance, '2027-01-20');
assert.equal(beforeCutoff.lines.length, 4, 'performance and invoice each produce two balanced lines');
assert.equal(beforeCutoff.reconciledToFinanceState.recognizedRevenueCents, 90000);
assert.equal(beforeCutoff.reconciledToFinanceState.receivablesCents, 107100);
assert.equal(beforeCutoff.reconciledToFinanceState.bankCents, 100000);
assert.equal(beforeCutoff.reconciledToFinanceState.simTaxPayableCents, 17100);
assert.equal(beforeCutoff.accounts.customer_revenue.creditCents, 90000, 'performance is recognized exactly once');
assert.equal(beforeCutoff.accounts.simtax_payable.creditCents, 17100, 'invoice adds only SimTAX');
assert.equal(beforeCutoff.totals.debitCents, beforeCutoff.totals.creditCents);
assert.equal(beforeCutoff.lines.every(line => line.period === line.effectiveDate.slice(0, 7) && line.sourceRef && line.sourceEventId), true);
assert.equal(Object.isFrozen(beforeCutoff), true);
assert.equal(JSON.stringify(finance), JSON.stringify(unpaidBefore), 'projection does not mutate FinanceState');
assert.deepEqual(projectV3FinanceLedger(JSON.parse(JSON.stringify(finance)), '2027-01-20'), beforeCutoff, 'save/restore projection is deterministic');

const paid = processV3ScenarioCustomerReceiptsDue(finance, '2027-01-21');
const paidProjection = projectV3FinanceLedger(paid, '2027-01-21');
assert.equal(paidProjection.lines.length, 6);
assert.equal(paidProjection.reconciledToFinanceState.recognizedRevenueCents, 90000);
assert.equal(paidProjection.reconciledToFinanceState.customerReceiptsCents, 107100);
assert.equal(paidProjection.reconciledToFinanceState.receivablesCents, 0);
assert.equal(paidProjection.reconciledToFinanceState.bankCents, 207100);
assert.equal(paidProjection.reconciledToFinanceState.simTaxPayableCents, 17100, 'receipt does not remit SimTAX');
assert.equal(paidProjection.totals.debitCents, paidProjection.totals.creditCents);
assert.deepEqual(projectV3FinanceLedger(JSON.parse(JSON.stringify(paid)), '2027-01-21'), paidProjection, 'paid JSON save/restore is deterministic');
assert.equal(projectV3FinanceLedger(paid, '2027-01-20').lines.length, 4, 'as-of cutoff excludes future customer receipt');

const unknown = structuredClone(finance);
unknown.events.push({ eventId: 'UNSUPPORTED', eventType: 'unknown', financeType: 'supplier-payment', runId: unknown.runId, sourceRef: 'UNKNOWN-SOURCE', effectiveDate: '2027-01-20' });
unknown.processed.UNSUPPORTED = { financeRef: 'F-UNSUPPORTED' };
assert.throws(() => projectV3FinanceLedger(unknown, '2027-01-31'), /unsupported or missing financeType/);
const missingType = structuredClone(finance);
delete missingType.events[0].financeType;
assert.throws(() => projectV3FinanceLedger(missingType, '2027-01-31'), /unsupported or missing financeType/);
const tampered = structuredClone(finance);
tampered.events.find(event => event.financeType === 'recognized-performance').amountCents += 1;
assert.throws(() => projectV3FinanceLedger(tampered, '2027-01-31'), /differs from its recognized order amounts/);

// A coordinated JSON-restore mutation previously kept the projection and
// FinanceState totals internally consistent while changing the source fact.
const performanceOnly = recordV3CustomerPerformance(
  createV3FinanceState({ runId: 'RUN-T0077-PAYLOAD-TAMPER', opening: { date: '2027-01-04', sourceRef: 'OPENING-TAMPER', bankCents: 100000, receivablesCents: 0, receivableSourceRefs: [] } }),
  {
    eventId: 'PERF-TAMPER', eventType: 'customerPerformanceAccepted', runId: 'RUN-T0077-PAYLOAD-TAMPER',
    sourceRef: 'SOURCE-PERF-TAMPER', effectiveDate: '2027-01-08', performanceDate: '2027-01-07',
    orderId: 'ORDER-TAMPER', customerRef: 'CUSTOMER-TAMPER', contractRef: 'CONTRACT-TAMPER',
    contractPartyAuthorityRef: 'AUTHORITY-TAMPER', offerSnapshotRef: 'OFFER-TAMPER',
    acceptance: { actorRole: 'customer', actorRef: 'CUSTOMER-TAMPER', partyAuthorityRef: 'AUTHORITY-TAMPER', criterionRef: 'CRITERION-TAMPER', date: '2027-01-08' },
    authorization: { owner: 'A03', status: 'authorized', sourceRef: 'A03-TAMPER' },
    recognizedRevenueCents: 50000, receivableCents: 50000
  }
);
const coordinatedRestoreMutation = JSON.parse(JSON.stringify(performanceOnly));
coordinatedRestoreMutation.events[0].recognizedRevenueCents += 1;
coordinatedRestoreMutation.events[0].receivableCents += 1;
coordinatedRestoreMutation.events[0].amountCents += 1;
coordinatedRestoreMutation.events[0].receivableOutstandingCents += 1;
coordinatedRestoreMutation.orders[0].amountCents += 1;
coordinatedRestoreMutation.orders[0].receivableOutstandingCents += 1;
assert.throws(() => projectV3FinanceLedger(coordinatedRestoreMutation, '2027-01-31'), /payload does not match its stored source fingerprint/);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
function sourcePaymentFromStored(event) {
  const { financeType, cashEffectCents, receivableEffectCents, ...source } = event;
  return source;
}
const partial = recordV3CustomerPayment(finance, {
  eventId: 'PAY-T0077-FIRST', eventType: 'customerPaymentReceived', runId: finance.runId,
  sourceRef: 'PAY-SOURCE-FIRST', paymentId: 'PAYMENT-DUPLICATE', paymentDate: '2027-01-20', effectiveDate: '2027-01-20',
  orderId: finance.orders[0].orderId, invoiceId: finance.invoices[0].invoiceId,
  payerRef: finance.orders[0].customerRef, contractRef: finance.invoices[0].contractRef,
  amountCents: 50000, contract: { partialPaymentsAllowed: true }
});
const secondPaymentSource = {
  eventId: 'PAY-T0077-SECOND', eventType: 'customerPaymentReceived', runId: partial.runId,
  sourceRef: 'PAY-SOURCE-SECOND', paymentId: 'PAYMENT-DUPLICATE', paymentDate: '2027-01-20', effectiveDate: '2027-01-20',
  orderId: partial.orders[0].orderId, invoiceId: partial.invoices[0].invoiceId,
  payerRef: partial.orders[0].customerRef, contractRef: partial.invoices[0].contractRef,
  amountCents: 57100, contract: { partialPaymentsAllowed: true }
};
const duplicatePaymentId = JSON.parse(JSON.stringify(partial));
duplicatePaymentId.events.push({ ...secondPaymentSource, financeType: 'customer-payment', cashEffectCents: 57100, receivableEffectCents: -57100 });
duplicatePaymentId.processed[secondPaymentSource.eventId] = {
  payloadHash: JSON.stringify(canonical(secondPaymentSource)), financeRef: `F-${secondPaymentSource.eventId}`
};
duplicatePaymentId.orders[0].receivableOutstandingCents = 0;
assert.equal(sourcePaymentFromStored(duplicatePaymentId.events.at(-1)).paymentId, 'PAYMENT-DUPLICATE');
assert.throws(() => projectV3FinanceLedger(duplicatePaymentId, '2027-01-31'), /duplicate paymentId PAYMENT-DUPLICATE/);

// Final PASS is emitted after the period-boundary integration below.

// Cross-period actual receipt: the inclusive period cutoff excludes the February bank event from January.
const laterPayment = recordV3CustomerPayment(finance, {
  eventId: 'PAY-T0077-FEB', eventType: 'customerPaymentReceived', runId: finance.runId,
  sourceRef: 'PAY-SOURCE-FEB', paymentId: 'PAYMENT-FEB', paymentDate: '2027-02-04', effectiveDate: '2027-02-04',
  orderId: finance.orders[0].orderId, invoiceId: finance.invoices[0].invoiceId,
  payerRef: finance.orders[0].customerRef, contractRef: finance.invoices[0].contractRef,
  amountCents: finance.invoices[0].amountCents
});
const januaryClose = projectV3FinanceLedger(laterPayment, '2027-01-31');
const februaryClose = projectV3FinanceLedger(laterPayment, '2027-02-28');
assert.equal(januaryClose.reconciledToFinanceState.bankCents, 100000, 'February receipt is excluded from January bank close');
assert.equal(januaryClose.reconciledToFinanceState.receivablesCents, 107100, 'January close retains the open gross customer receivable');
assert.equal(februaryClose.reconciledToFinanceState.bankCents, 207100, 'February close includes the linked receipt exactly once');
assert.equal(februaryClose.reconciledToFinanceState.receivablesCents, 0, 'February close clears the customer receivable');
assert.equal(februaryClose.lines.filter(line => line.period === '2027-02').length, 2, 'February receipt journals only in February');
assert.equal(februaryClose.totals.debitCents, februaryClose.totals.creditCents, 'cross-period projection remains balanced');
assert.deepEqual(projectV3FinanceLedger(JSON.parse(JSON.stringify(laterPayment)), '2027-02-28'), februaryClose, 'cross-period restored projection is identical');

// D-0174 supplier AP remains a separate control subledger: its source-linked
// invoice/payment reconciles to bank and period closes without GL counterlines.
let supplierRun = structuredClone(run.state);
const supplierInvoiceDate = supplierRun.activeDay.date;
supplierRun = placeV3RunInternationalMaterialOrder(supplierRun, {
  orderId: 'PROJECTION-SUPPLIER-ORDER', shipmentId: 'PROJECTION-SUPPLIER-SHIPMENT', materialId: 'steel', quantity: 2,
  supplierId: 'local', sourceRef: 'projection-supplier-order-source', fixtureId: 'synthetic:D-0173:supplier-profile-v1',
  baselineEtaDate: supplierInvoiceDate, etaDate: supplierInvoiceDate, lagDays: 0
}).state;
supplierRun = receiveV3RunInternationalMaterialShipment(supplierRun, 'PROJECTION-SUPPLIER-SHIPMENT').state;
const supplierSourceInvoice = supplierRun.modules.product.supplierInvoiceEvidence[0];
let supplierFinance = createV3FinanceState({ runId: supplierRun.runId, opening: { date: '2027-01-01', sourceRef: 'D-0152:opening-profile-2027', bankCents: 100000, receivablesCents: 0, receivableSourceRefs: [] } });
supplierFinance = recordV3SupplierInvoiceFromRunEvidence(supplierFinance, { runState: supplierRun, invoiceId: supplierSourceInvoice.invoiceId });
const supplierInvoiceProjection = projectV3FinanceLedger(supplierFinance, '2027-01-31');
assert.equal(supplierInvoiceProjection.subledgerReconciliation.supplierAccountsPayable.closingAccountsPayableCents, supplierSourceInvoice.amountCents);
assert.equal(supplierInvoiceProjection.subledgerReconciliation.supplierAccountsPayable.monthly['2027-01'].supplierInvoicesCents, supplierSourceInvoice.amountCents);
assert.equal(supplierInvoiceProjection.reconciledToFinanceState.bankCents, 100000, 'supplier invoice/AP evidence does not change bank');
assert.equal(supplierInvoiceProjection.lines.length, 0, 'D-0174 supplier AP evidence does not synthesize general-ledger lines');
const paymentDate = '2027-02-02';
const supplierIdentity = `${encodeURIComponent(supplierRun.runId)}:${encodeURIComponent(supplierSourceInvoice.invoiceId)}:${paymentDate}`;
supplierFinance = recordV3SupplierPayment(supplierFinance, {
  eventId: `D-0174:SUPPLIER-PAYMENT-EVENT:${supplierIdentity}`, eventType: 'supplierPaymentExecuted', runId: supplierRun.runId,
  sourceRef: `D-0174:SUPPLIER-PAYMENT:${supplierIdentity}`, paymentId: `D-0174:SUPPLIER-PAYMENT:${supplierIdentity}`,
  invoiceId: supplierSourceInvoice.invoiceId, supplierId: supplierSourceInvoice.supplierId,
  paymentDate, effectiveDate: paymentDate, amountCents: supplierSourceInvoice.amountCents, currency: 'EUR',
  bankAccountRef: 'company-bank', bankTransactionRef: `D-0174:SUPPLIER-PAYMENT:${supplierIdentity}`,
  execution: { status: 'executed', actorRole: 'player', actorRef: 'player' },
  authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0174', sourceRef: 'A03-D-0174-SUPPLIER-PAYMENT' },
});
const supplierJanuaryClose = projectV3FinanceLedger(supplierFinance, '2027-01-31');
const supplierFebruaryClose = projectV3FinanceLedger(supplierFinance, '2027-02-28');
assert.equal(supplierJanuaryClose.subledgerReconciliation.supplierAccountsPayable.monthly['2027-01'].closingAccountsPayableCents, supplierSourceInvoice.amountCents, 'January retains the AP due to a February payment');
assert.equal(supplierJanuaryClose.subledgerReconciliation.supplierAccountsPayable.monthly['2027-01'].closingBankCents, 100000, 'January bank excludes the February payment');
assert.equal(supplierFebruaryClose.subledgerReconciliation.supplierAccountsPayable.closingAccountsPayableCents, 0, 'February payment clears the same AP subledger balance');
assert.equal(supplierFebruaryClose.subledgerReconciliation.supplierAccountsPayable.monthly['2027-02'].supplierPaymentsCents, supplierSourceInvoice.amountCents);
assert.equal(supplierFebruaryClose.reconciledToFinanceState.bankCents, 100000 - supplierSourceInvoice.amountCents, 'February bank reflects the full executed payment');
assert.equal(supplierFebruaryClose.lines.length, 0, 'AP-only supplier transactions remain outside the GL-shaped customer projection');
assert.deepEqual(projectV3FinanceLedger(JSON.parse(JSON.stringify(supplierFinance)), '2027-02-28'), supplierFebruaryClose, 'AP subledger projection survives JSON save/restore unchanged');

// D-0177 bank/dispo control events: an evidenced supplier invoice exceeds the
// D-0180 opening cash by a sourced amount within the existing facility; the
// later customer receipt repays principal first. No GL counterlines are added.
let dispoRun = structuredClone(supplierRun);
dispoRun = placeV3RunInternationalMaterialOrder(dispoRun, {
  orderId: 'PROJECTION-DISPO-SUPPLIER-ORDER', shipmentId: 'PROJECTION-DISPO-SUPPLIER-SHIPMENT', materialId: 'steel', quantity: 5612,
  supplierId: 'local', sourceRef: 'projection-dispo-supplier-order-source', fixtureId: 'synthetic:D-0173:supplier-profile-v1',
  baselineEtaDate: supplierInvoiceDate, etaDate: supplierInvoiceDate, lagDays: 0
}).state;
dispoRun = receiveV3RunInternationalMaterialShipment(dispoRun, 'PROJECTION-DISPO-SUPPLIER-SHIPMENT').state;
const dispoSourceInvoice = dispoRun.modules.product.supplierInvoiceEvidence.find(row => row.orderId === 'PROJECTION-DISPO-SUPPLIER-ORDER');
let dispoFinance = createV3FinanceState({ runId: dispoRun.runId, opening: { date: '2027-01-01', sourceRef: 'D-0180:opening-profile-v3-2027', bankCents: 1_000_000, equityCents: 1_000_000, receivablesCents: 0, receivableSourceRefs: [] } });
dispoFinance = recordV3SupplierInvoiceFromRunEvidence(dispoFinance, { runState: dispoRun, invoiceId: dispoSourceInvoice.invoiceId });
assert.equal(dispoSourceInvoice.amountCents, 1_099_952, 'synthetic supplier source creates a cent-exact payment that fits within opening Dispo');
const dispoPaymentIdentity = `${encodeURIComponent(dispoRun.runId)}:${encodeURIComponent(dispoSourceInvoice.invoiceId)}:${dispoSourceInvoice.dueDate}`;
const dispoPaymentEventId = `D-0174:SUPPLIER-PAYMENT-EVENT:${dispoPaymentIdentity}`;
const dispoPaymentSourceRef = `D-0174:SUPPLIER-PAYMENT:${dispoPaymentIdentity}`;
dispoFinance = recordV3SupplierPayment(dispoFinance, {
  eventId: dispoPaymentEventId, eventType: 'supplierPaymentExecuted', runId: dispoRun.runId,
  sourceRef: dispoPaymentSourceRef, paymentId: dispoPaymentSourceRef, invoiceId: dispoSourceInvoice.invoiceId,
  supplierId: dispoSourceInvoice.supplierId, paymentDate: dispoSourceInvoice.dueDate, effectiveDate: dispoSourceInvoice.dueDate,
  amountCents: dispoSourceInvoice.amountCents, currency: 'EUR', bankAccountRef: 'company-bank', bankTransactionRef: dispoPaymentSourceRef,
  execution: { status: 'executed', actorRole: 'player', actorRef: 'player' },
  authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0174', sourceRef: 'A03-D-0174-SUPPLIER-PAYMENT' },
  dispoDrawEvent: {
    eventId: `D-0125:DISPO-DRAW-EVENT:${dispoPaymentIdentity}`, eventType: 'dispoPrincipalDrawn', runId: dispoRun.runId,
    sourceRef: `D-0125:DISPO-DRAW:${dispoPaymentIdentity}`, effectiveDate: dispoSourceInvoice.dueDate, drawDate: dispoSourceInvoice.dueDate,
    invoiceId: dispoSourceInvoice.invoiceId, paymentEventId: dispoPaymentEventId, intendedPaymentCents: dispoSourceInvoice.amountCents,
    amountCents: 99_952, currency: 'EUR', execution: { status: 'executed', actorRole: 'player', actorRef: 'player' },
    authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0125', sourceRef: 'A03-D-0125-MANUAL-DRAW' }
  }
});
const afterDraw = reconcileV3Finance(dispoFinance, dispoSourceInvoice.dueDate);
assert.equal(afterDraw.stocks.bankCents, 0, 'explicit D-0125 draw and supplier payment settle bank to zero');
assert.equal(afterDraw.stocks.dispoPrincipalCents, 99_952, 'D-0125 draw records only the exact bank shortfall');
assert.equal(afterDraw.flows.dispoDrawsCents, 99_952);
dispoFinance = recordV3ScenarioInvoiceFromCustomerEvidence(dispoFinance, { runState: run.state, workOrderId: run.workOrderId });
const dispoInvoice = dispoFinance.invoices[0];
const dispoOrder = dispoFinance.orders.find(row => row.orderId === dispoInvoice.orderId);
dispoFinance = recordV3CustomerPayment(dispoFinance, {
  eventId: 'PAY-T0077-DISPO-REPAY', eventType: 'customerPaymentReceived', runId: dispoFinance.runId,
  sourceRef: 'PAY-SOURCE-T0077-DISPO-REPAY', paymentId: 'PAYMENT-T0077-DISPO-REPAY',
  paymentDate: '2027-02-01', effectiveDate: '2027-02-01', orderId: dispoOrder.orderId, invoiceId: dispoInvoice.invoiceId,
  payerRef: dispoOrder.customerRef, contractRef: dispoInvoice.contractRef, amountCents: dispoInvoice.amountCents
});
const dispoProjection = projectV3FinanceLedger(dispoFinance, '2027-02-01');
assert.equal(dispoProjection.reconciledToFinanceState.dispoDrawsCents, 99_952);
assert.equal(dispoProjection.reconciledToFinanceState.dispoRepaymentsCents, 99_952);
assert.equal(dispoProjection.reconciledToFinanceState.dispoPrincipalCents, 0, 'D-0126 customer receipt clears the outstanding D-0177 principal');
assert.equal(dispoProjection.reconciledToFinanceState.bankCents, 7_148, 'opening + receipt + draw − AP payment − automatic principal repayment reconciles');
assert.equal(dispoProjection.reconciledToFinanceState.receivablesCents, 0);
assert.equal(dispoProjection.totals.debitCents, dispoProjection.totals.creditCents, 'D-0180, customer performance, tax, and receipt journal remain balanced');
assert.deepEqual(projectV3FinanceLedger(JSON.parse(JSON.stringify(dispoFinance)), '2027-02-01'), dispoProjection, 'customer/AP/Dispo source events preserve reconciliation through JSON restore');
assert.equal(dispoProjection.lines.length, 8, 'D-0177 and D-0174 subledger events add no unauthorized GL counterlines');


// Shared-run integration across January/February month ends. Use the existing
// accepted A02 order, D-0166 invoice and explicit customer-payment API; do not
// synthesize supplier, payroll, tax-remittance, or other outflow events.
let integratedRun = closeV3RunDay(run.state, { date: '2027-01-08' }).state;
let integratedFinance = createV3FinanceState({ runId: run.state.runId, opening: { date: '2027-01-01', sourceRef: 'D-0180:opening-profile-v3-2027', bankCents: 1_000_000, equityCents: 1_000_000, receivablesCents: 0, receivableSourceRefs: [] } });
integratedFinance = recordV3ScenarioInvoiceFromCustomerEvidence(integratedFinance, { runState: run.state, workOrderId: run.workOrderId });
function nextCalendarDate(value) {
  return new Date(Date.parse(`${value}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
}
function advanceIntegratedRunThrough(targetDate) {
  while (integratedRun.currentDate < targetDate) {
    const date = nextCalendarDate(integratedRun.currentDate);
    const opened = openV3RunDay(integratedRun, { date });
    assert.equal(opened.ok, true, `integrated shared run opens ${date}`);
    const closed = closeV3RunDay(opened.state, { date });
    assert.equal(closed.ok, true, `integrated shared run closes ${date}`);
    integratedRun = closed.state;
  }
}
advanceIntegratedRunThrough('2027-01-31');
const januaryEnvelope = createRunSaveEnvelope(integratedRun, integratedFinance);
const januaryRestored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(januaryEnvelope)));
assert.equal(januaryRestored.runState.currentDate, '2027-01-31');
const januaryIntegratedProjection = projectV3FinanceLedger(januaryRestored.financeState, '2027-01-31');
assert.equal(januaryIntegratedProjection.reconciledToFinanceState.bankCents, 1_000_000, 'shared January close has the D-0180 opening bank only');
assert.equal(januaryIntegratedProjection.reconciledToFinanceState.receivablesCents, 107100, 'shared January close retains gross AR');
assert.equal(januaryIntegratedProjection.reconciledToFinanceState.recognizedRevenueCents, 90000, 'shared January close recognizes the accepted order once');
assert.equal(januaryIntegratedProjection.reconciledToFinanceState.simTaxPayableCents, 17100, 'shared January close retains the unpaid SimTAX accrual');
assert.equal(januaryIntegratedProjection.lines.every(line => line.period === '2027-01'), true);
assert.equal(januaryIntegratedProjection.totals.debitCents, januaryIntegratedProjection.totals.creditCents);

advanceIntegratedRunThrough('2027-02-03');
const februaryPaymentSource = {
  eventId: 'PAY-T0077-INTEGRATED-FEB', eventType: 'customerPaymentReceived', runId: integratedFinance.runId,
  sourceRef: 'PAY-SOURCE-T0077-INTEGRATED-FEB', paymentId: 'PAYMENT-T0077-INTEGRATED-FEB',
  paymentDate: '2027-02-04', effectiveDate: '2027-02-04',
  orderId: integratedFinance.orders[0].orderId, invoiceId: integratedFinance.invoices[0].invoiceId,
  payerRef: integratedFinance.orders[0].customerRef, contractRef: integratedFinance.invoices[0].contractRef,
  amountCents: integratedFinance.invoices[0].amountCents
};
const openedPaymentDay = openV3RunDay(integratedRun, { date: '2027-02-04' });
assert.equal(openedPaymentDay.ok, true);
integratedRun = openedPaymentDay.state;
integratedFinance = recordV3CustomerPayment(integratedFinance, februaryPaymentSource);
const duplicateIntegratedPayment = recordV3CustomerPayment(integratedFinance, februaryPaymentSource);
assert.deepEqual(duplicateIntegratedPayment, integratedFinance, 'replaying the same payment source does not create a second receipt');
integratedRun = closeV3RunDay(integratedRun, { date: '2027-02-04' }).state;
advanceIntegratedRunThrough('2027-02-28');
const februaryEnvelope = createRunSaveEnvelope(integratedRun, integratedFinance);
const februaryRestored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(februaryEnvelope)));
assert.equal(februaryRestored.runState.currentDate, '2027-02-28');
const februaryIntegratedProjection = projectV3FinanceLedger(februaryRestored.financeState, '2027-02-28');
assert.equal(februaryIntegratedProjection.reconciledToFinanceState.bankCents, 1_107_100, 'shared February close includes the explicit gross receipt once');
assert.equal(februaryIntegratedProjection.reconciledToFinanceState.receivablesCents, 0, 'shared February close clears the linked gross AR');
assert.equal(februaryIntegratedProjection.reconciledToFinanceState.customerReceiptsCents, 107100);
assert.equal(februaryIntegratedProjection.reconciledToFinanceState.recognizedRevenueCents, 90000, 'receipt does not duplicate recognized revenue');
assert.equal(februaryIntegratedProjection.reconciledToFinanceState.simTaxPayableCents, 17100, 'receipt does not remit SimTAX');
assert.equal(februaryIntegratedProjection.lines.filter(line => line.period === '2027-02').length, 2, 'the February payment journals only in February');
assert.equal(februaryIntegratedProjection.totals.debitCents, februaryIntegratedProjection.totals.creditCents);
assert.deepEqual(projectV3FinanceLedger(februaryRestored.financeState, '2027-02-28'), februaryIntegratedProjection, 'integrated save/restore projection is deterministic and non-mutating');
assert.equal(JSON.stringify(februaryRestored.financeState), JSON.stringify(februaryEnvelope.financeState), 'integrated projection leaves restored finance state unchanged');
assert.deepEqual(januaryIntegratedProjection, projectV3FinanceLedger(januaryRestored.financeState, '2027-01-31'), 'integrated January re-projection is unchanged');
console.log('V3 finance ledger projection and shared-run month-boundary integration: PASS (customer + isolated D-0174 AP/bank scope; no full GL claim).');
