import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment } from '../v3-run-orchestrator.js';
import { renderInternationalMaterialSupplyUi, renderFinanceDisplay, executeSupplierApPayment, createRunFromInputs, installRunOperatingResources, createFinanceStateForRun, openNextRunDay, closeRunDay, handleInternationalMaterialOrderSubmit, handleInternationalMaterialReceiptClick, createRunSaveEnvelope, restoreRunSaveEnvelope } from './run.js';
import { createV3FinanceState, recordV3SupplierInvoiceFromRunEvidence, reconcileV3Finance } from '../v3-finance-runtime.js';
import { createV3ProductState, placeV3InternationalMaterialOrder, advanceV3ProductDate, receiveV3InternationalMaterialShipment, getV3SupplierScenarioQuotes, validateV3ProductWorkdayAssignments } from '../v3-product-lifecycle.js';

let product = createV3ProductState({ runId: 'ui-material-test', currentDate: '2027-01-04', people: [], equipment: [], materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 0, finishedGoodsUsed: 0, commitments: [] });
const order = { orderId: 'order-ui-material', shipmentId: 'shipment-ui-material', materialId: 'steel', quantity: 2, supplierId: 'online', sourceRef: 'synthetic-fixture:D-0173:online:v1', fixtureId: 'synthetic:D-0173:supplier-profile-v1', baselineEtaDate: '2027-01-09', etaDate: '2027-01-09', lagDays: 0 };
assert.deepEqual(getV3SupplierScenarioQuotes('steel', 2).map(row => [row.supplierId, row.totalNetAmountCents]), [['local', 392], ['online', 1060], ['wholesale', 286]]);
assert.equal(getV3SupplierScenarioQuotes('steel', 1).find(row => row.supplierId === 'wholesale').minimumQuantity, 100);
product = placeV3InternationalMaterialOrder(product, order);
const closedDay = renderInternationalMaterialSupplyUi(product, '2027-01-04', false);
assert.match(closedDay, /disabled/);
const beforeDue = renderInternationalMaterialSupplyUi(product, '2027-01-07', true);
assert.match(beforeDue, /Unterwegs · erwartete Ankunft 2027-01-09/);
assert.ok(beforeDue.includes('Onlinehändler · 1,55 €/kg + 7,50 € Versand · 5 Kalendertage'));
assert.match(beforeDue, /D-0128 ist nur der Rechenanker/);
assert.match(beforeDue, /Lieferverzögerungsrisiko ist noch nicht parametrisiert und bleibt deaktiviert/);
assert.match(beforeDue, /Wareneingang ab 2027-01-09/);
assert.match(beforeDue, /international-material-receipt[^>]*disabled/);
assert.match(beforeDue, /Wareneingang aktualisiert den Materialbestand und erzeugt die getrennte Lieferantenrechnungsevidenz/);
assert.match(beforeDue, /Eine Zahlung erfolgt ausschließlich nach manuellem Klick und nur als vollständige Zahlung/);
assert.doesNotMatch(beforeDue, /name="price"|name="unitCost"|name="lagDays"|Baseline-ETA/);
assert.throws(() => receiveV3InternationalMaterialShipment(product, order.shipmentId), /not due before 2027-01-09/);
let dueProduct = product;
while (dueProduct.currentDate < order.etaDate) dueProduct = advanceV3ProductDate(dueProduct);
assert.equal(dueProduct.currentDate, '2027-01-11', 'calendar ETA is received on the next available simulated workday');
const dueHtml = renderInternationalMaterialSupplyUi(dueProduct, dueProduct.currentDate, true);
assert.match(dueHtml, /Wareneingang erfassen/);
assert.doesNotMatch(dueHtml, /Wareneingang ab 2027-01-08/);
const received = receiveV3InternationalMaterialShipment(dueProduct, order.shipmentId);
assert.equal(received.materials.find(row => row.id === 'steel').quantity, 12);
assert.equal(received.materialMovements[0].monetaryStatus, 'nonposting_pending_cost_source');
assert.equal(received.supplierInvoiceEvidence[0].status, 'pending_non_posting');
assert.equal(received.supplierInvoiceEvidence[0].amountCents, 1060, 'online quote includes shipping without a tax assumption');
assert.equal(received.supplierInvoiceEvidence[0].dueDate, '2027-01-25', '14-day invoice term shifts a Sunday due date to Monday');
const tamperedInvoice = structuredClone(received); tamperedInvoice.supplierInvoiceEvidence[0].amountCents += 1;
assert.throws(() => validateV3ProductWorkdayAssignments(tamperedInvoice), /matching non-posting invoice evidence/);
assert.throws(() => placeV3InternationalMaterialOrder(product, { ...order, orderId: 'wholesale-too-small', shipmentId: 'wholesale-too-small', supplierId: 'wholesale', baselineEtaDate: '2027-01-12', etaDate: '2027-01-12', sourceRef: 'synthetic-fixture:D-0173:wholesale:v1' }), /minimum quantity of 100 kg/);
const afterReceipt = renderInternationalMaterialSupplyUi(received, received.currentDate, true);
assert.match(afterReceipt, /<strong>steel<\/strong>: 12 Einheiten verfügbar/);
assert.match(afterReceipt, /Bestand danach 12 Einheiten/);
assert.match(afterReceipt, /Rechnungsevidenz/);
assert.match(afterReceipt, /Onlinehändler · 10,60 € netto/);
assert.match(afterReceipt, /OP-Status im Finanzbereich/);
assert.match(afterReceipt, /Eine Zahlung erfolgt ausschließlich nach manuellem Klick und nur als vollständige Zahlung/);
assert.doesNotMatch(afterReceipt, /Wareneingang erfassen/);

// Exercise the integrated path: accepted order -> dated goods receipt -> AP snapshot -> explicit full payment.
let appRun = createRunFromInputs({ scenarioId: 'a05-t0077-supplier-ap', seed: 'fixture-seed', startDate: '2027-01-04', endDate: '2027-01-29' });
appRun = installRunOperatingResources(appRun, { people: [], equipment: [], materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 1, finishedGoodsUsed: 0 });
let appFinance = createFinanceStateForRun(appRun);
appRun = openNextRunDay(appRun).state;
let orderStatus = '';
handleInternationalMaterialOrderSubmit({ target: { matches: selector => selector === '.international-material-order-form' }, preventDefault() {} }, {
  run: appRun, setRun: value => { appRun = value; }, setStatus: value => { orderStatus = value; },
  readFormValues: () => ({ materialId: 'steel', quantity: '2', supplierId: 'online' }),
});
assert.match(orderStatus, /keine AP- oder Bankbuchung/);
assert.equal(appFinance.supplierInvoices.length, 0, 'placing an order does not create AP before receipt');
const appShipmentId = appRun.modules.product.materialShipments[0].shipmentId;
while (appRun.activeDay?.date < '2027-01-11') {
  if (appRun.activeDay) appRun = closeRunDay(appRun).state;
  appRun = openNextRunDay(appRun).state;
}
let receiptStatus = '';
let renderCount = 0;
handleInternationalMaterialReceiptClick({ target: { closest: selector => selector === '.international-material-receipt' ? { dataset: { shipment: appShipmentId } } : null } }, {
  run: appRun, setRun: value => { appRun = value; }, financeState: appFinance, setFinanceState: value => { appFinance = value; },
  render: () => { renderCount += 1; }, setStatus: value => { receiptStatus = value; },
});
assert.match(receiptStatus, /offener Lieferantenposten/);
assert.equal(renderCount, 1, 'goods receipt rerenders after the run and finance snapshots update');
assert.equal(appFinance.supplierInvoices.length, 1, 'accepted receipt creates one AP invoice snapshot');
assert.equal(reconcileV3Finance(appFinance, '2027-01-11').stocks.supplierAccountsPayableCents, 1060);
let supplierUi = renderFinanceDisplay(appFinance, appRun).supplierApHtml;
assert.match(supplierUi, /disabled>Rechnung noch nicht fällig/);
while (appRun.activeDay.date < '2027-01-25') {
  appRun = closeRunDay(appRun).state;
  appRun = openNextRunDay(appRun).state;
}
supplierUi = renderFinanceDisplay(appFinance, appRun).supplierApHtml;
assert.match(supplierUi, /supplier-ap-payment/);
assert.doesNotMatch(supplierUi, /disabled/);
assert.doesNotMatch(supplierUi, /COGS|Hauptbuch|Steuerbuchung|Inventarbuchung/);
const lowCashFinance = recordV3SupplierInvoiceFromRunEvidence(createV3FinanceState({
  runId: appRun.runId, opening: { date: '2027-01-01', sourceRef: 'D-0152:opening-profile-2027', bankCents: 100, receivablesCents: 0, receivableSourceRefs: [] },
}), { runState: appRun, invoiceId: appRun.modules.product.supplierInvoiceEvidence[0].invoiceId });
const lowCashUi = renderFinanceDisplay(lowCashFinance, appRun).supplierApHtml;
assert.match(lowCashUi, /Bankguthaben reicht nicht für die Vollzahlung/);
assert.match(lowCashUi, /Vollzahlung nicht möglich: Der freie Disporahmen deckt den Fehlbetrag nicht/);
assert.doesNotMatch(lowCashUi, /class="primary supplier-ap-payment-dispo"/);
assert.throws(() => executeSupplierApPayment(lowCashFinance, appRun, appRun.modules.product.supplierInvoiceEvidence[0].invoiceId), /Bankguthaben reicht nicht/);
const paidFinance = executeSupplierApPayment(appFinance, appRun, appFinance.supplierInvoices[0].invoiceId);
assert.equal(reconcileV3Finance(paidFinance, '2027-01-25').stocks.supplierAccountsPayableCents, 0);
assert.equal(reconcileV3Finance(paidFinance, '2027-01-25').stocks.bankCents, 998940);
supplierUi = renderFinanceDisplay(paidFinance, appRun).supplierApHtml;
assert.match(supplierUi, /Vollständig bezahlt am 2027-01-25/);
assert.doesNotMatch(supplierUi, /supplier-ap-payment/);
const restoredPaidFinance = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(createRunSaveEnvelope(appRun, paidFinance)))).financeState;
assert.deepEqual(restoredPaidFinance.events, paidFinance.events, 'supplier payment survives the normal JSON run save/restore envelope');

// The bank card includes an actually drawn overdraft in its signed balance.
let overdraftRun = createRunFromInputs({ scenarioId: 'a05-overdraft-bank-display', seed: 'bank-display', startDate: '2027-01-04', endDate: '2027-01-29' });
overdraftRun = installRunOperatingResources(overdraftRun, { people: [], equipment: [], materials: [{ id: 'steel', quantity: 0 }], finishedGoodsCapacity: 1, finishedGoodsUsed: 0 });
let overdraftFinance = createFinanceStateForRun(overdraftRun);
overdraftRun = openNextRunDay(overdraftRun).state;
const unusedBankHtml = renderFinanceDisplay(overdraftFinance, overdraftRun).summaryHtml;
assert.match(unusedBankHtml, /class="bank-balance">10\.000,00/);
assert.match(unusedBankHtml, /<small[^>]*>Disporahmen: 1\.000,00[^<]*nicht in Anspruch genommen<\/small>/);
assert.doesNotMatch(unusedBankHtml, /bank-balance is-negative/);
overdraftRun = placeV3RunInternationalMaterialOrder(overdraftRun, { orderId: 'ui-overdraft-order', shipmentId: 'ui-overdraft-shipment', materialId: 'steel', quantity: 5612, supplierId: 'local', sourceRef: 'synthetic:ui-overdraft-order', fixtureId: 'synthetic:D-0173:supplier-profile-v1', baselineEtaDate: '2027-01-04', etaDate: '2027-01-04', lagDays: 0 }).state;
overdraftRun = receiveV3RunInternationalMaterialShipment(overdraftRun, 'ui-overdraft-shipment').state;
const overdraftInvoice = overdraftRun.modules.product.supplierInvoiceEvidence[0];
overdraftFinance = recordV3SupplierInvoiceFromRunEvidence(overdraftFinance, { runState: overdraftRun, invoiceId: overdraftInvoice.invoiceId });
while (overdraftRun.activeDay.date < overdraftInvoice.dueDate) {
  overdraftRun = closeRunDay(overdraftRun).state;
  overdraftRun = openNextRunDay(overdraftRun).state;
}
overdraftFinance = executeSupplierApPayment(overdraftFinance, overdraftRun, overdraftInvoice.invoiceId, { drawFromDispo: true });
const beforeRender = JSON.stringify(overdraftFinance);
const drawnBankHtml = renderFinanceDisplay(overdraftFinance, overdraftRun).summaryHtml;
assert.match(drawnBankHtml, /class="bank-balance is-negative">[−-]999,52/);
assert.match(drawnBankHtml, /<small[^>]*>Disporahmen: 1\.000,00[^<]*genutzt 999,52[^<]*noch verfügbar 0,48/);
assert.doesNotMatch(drawnBankHtml, /nicht gezogen|nicht in Anspruch genommen/);
assert.equal(JSON.stringify(overdraftFinance), beforeRender, 'signed bank rendering cannot mutate the finance subledger');
const runCss = await readFile(new URL('./run.css', import.meta.url), 'utf8');
assert.match(runCss, /\.finance-summary \.bank-balance\.is-negative\{color:var\(--red\)\}/);
console.log('A05 T-0070 material order/receipt UI regressions: PASS');
