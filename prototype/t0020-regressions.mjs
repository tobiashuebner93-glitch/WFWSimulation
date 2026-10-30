import {createLegacyBusinessTestGame as createInitialGame, createLegacyBusinessTestFinance as createInitialFinance} from './test-fixtures/legacy-business.js';
import {  advanceOneDay, FACILITIES } from './engine.js';
import {
   issueInvoice, migrateFinanceState, processOutstandingCosts,
  recordMaterialPurchase, recordTrainingCost,
} from './finance.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// A qualified plan-to-production-to-following-operation chain can finish on one day.
const work = createInitialGame();
work.date = '2027-01-05';
const machineSite=FACILITIES.filter(f=>f.machineCapacity>0).at(-1);work.facility={...machineSite,tenure:'rent'};work.roomSettings.workshop=machineSite.workshop;work.roomSettings.machineCount=1;
const order = work.orders[0];
work.orders = [order];
order.planningHours = 1;
order.planningDone = 0;
order.operations = [
  { id: 15, name: 'Vorbereitung', resource: 'MA-PROD', skill: 'PREP', totalHours: 1 },
  { id: 20, name: 'CNC', resource: 'MA-CNC', skill: 'CNC', totalHours: 1 },
  { id: 30, name: 'Qualitätsprüfung', resource: 'MA-CNC', skill: 'QUALITY', totalHours: 1 },
];
order.operationIndex = 0;
order.operationDone = 0;
advanceOneDay(work);
const sameDayEvents = work.events.filter(e => e.orderId === order.id && ['PLANUNG', 'ARBEITSGANG_FERTIG', 'GELIEFERT'].includes(e.kind));
assert(order.deliveredAt === '2027-01-05', 'Same-day chain did not finish despite available worker/machine capacity');
assert(sameDayEvents.some(e => e.kind === 'PLANUNG') && sameDayEvents.every(e => e.date === '2027-01-05'), 'Same-day planning/work events lost their effective date');
assert(sameDayEvents.filter(e => e.kind === 'ARBEITSGANG_FERTIG').length === 3, 'Not every dependent operation completed on the same day');

// Supplier input tax is separate, and unused credit rolls forward chronologically.
const taxGame = createInitialGame();
const taxSupplier=taxGame.network.suppliers.find(x=>x.id==='L-01');taxSupplier.relationship=60;taxSupplier.quantityDiscounts=[];taxSupplier.relationshipDiscountRate=0;
const taxFinance = createInitialFinance();
const taxOpeningCash = taxFinance.cash;
recordMaterialPurchase(taxFinance, { steel: 1000 }, '2027-01-04', 'L-01', taxGame);
const invoiceOrder = (id, date) => ({ id, customer: 'K-01', invoiceReadyAt: date, deliveredAt: date });
issueInvoice(taxFinance, invoiceOrder('TAX-JAN', '2027-01-04'), 1000, 14);
const jan = taxFinance.taxPeriods.find(p => p.month === '2027-01');
assert(jan?.outputTax === 190 && jan.inputTax === 309.7 && jan.amount === 0 && jan.creditCarriedForward === 119.7, 'January SimTAX components or credit are incorrect');
assert(taxFinance.cash === taxOpeningCash - 1630 - 309.7, 'Supplier cash payment must include net material cost and separately booked input SimTAX');
taxSupplier.relationship=60;const grossPayableFinance=createInitialFinance();grossPayableFinance.cash=0;recordMaterialPurchase(grossPayableFinance,{steel:1000},'2027-01-04','L-01',taxGame);assert(grossPayableFinance.unpaidItems[0]?.amount===1939.7&&grossPayableFinance.expenses[0]?.amount===1630,'Unpaid supplier entry must retain gross cash payable separately from net expense');
issueInvoice(taxFinance, invoiceOrder('TAX-FEB', '2027-02-05'), 500, 14);
const feb = taxFinance.taxPeriods.find(p => p.month === '2027-02');
assert(feb?.outputTax === 95 && feb.creditBroughtForward === 119.7 && feb.amount === 0 && feb.creditCarriedForward === 24.7, 'SimTAX credit did not carry into February');
const unqualifiedFinance = createInitialFinance();
recordMaterialPurchase(unqualifiedFinance, { steel: 1 }, '2027-01-04', null, taxGame);
assert((unqualifiedFinance.taxPeriods[0]?.inputTax || 0) === 0, 'Unqualified scenario supplier received input tax credit');

// Payable reminders and formal notices are suppressed after full payment.
const paidFinance = createInitialFinance();
paidFinance.cash = 0;
recordTrainingCost(paidFinance, '2027-01-04', 'Regression cost', 100);
const paidItem = paidFinance.unpaidItems[0];
assert(paidItem.reminderDate === '2027-01-14' && paidItem.formalNoticeDate === '2027-01-28', 'Dunning dates are not +10 and then +14 calendar days');
for (let date = '2027-01-04'; date <= '2027-01-19'; date = new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10)) processOutstandingCosts(paidFinance, date);
assert(paidItem.reminderAt === '2027-01-14', 'Payment reminder did not occur on its effective date');
paidFinance.cash = 100;
processOutstandingCosts(paidFinance, paidItem.nextRetryDate);
for (let date = paidItem.paidAt; date && date <= '2027-02-05'; date = new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10)) processOutstandingCosts(paidFinance, date);
assert(paidItem.paidAt && !paidItem.formalNoticeAt && !paidFinance.events.some(e => e.reference === paidItem.id && e.kind === 'FORMELLE_MAHNUNG'), 'Paid payable received a later formal notice');

// The first due-date failure is followed by eight weekly retries, then the game stops.
const failedFinance = createInitialFinance();
failedFinance.cash = 0;
recordTrainingCost(failedFinance, '2027-01-04', 'Unpaid regression cost', 100);
const failedItem = failedFinance.unpaidItems[0];
for (let date = '2027-01-04'; date <= '2027-05-01'; date = new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10)) processOutstandingCosts(failedFinance, date);
assert(failedItem.retryFailures === 8 && failedItem.status === 'NIEDERLAGE' && failedFinance.gameLost, 'Eight weekly retry failures did not end the game');
assert(failedFinance.events.filter(e => e.reference === failedItem.id && e.kind === 'KOSTEN_RETRY_BEZAHLT').length === 0, 'Failed payable was incorrectly marked paid');

// Legacy saves keep their existing tax liability while gaining explicit new fields.
const migrated = migrateFinanceState({ version: 5, cash: 0, invoices: [{ issueDate: '2027-01-03', tax: 19 }], taxPeriods: [{ month: '2027-01', amount: 19 }], unpaidItems: [{ id: 'OLD', date: '2027-01-04', amount: 10 }] });
assert(migrated.version === 6 && migrated.taxPeriods[0].outputTax === 19 && migrated.taxPeriods[0].inputTax === 0 && migrated.unpaidItems[0].retryFailures === 0, 'Legacy finance state migration is not reproducible');

console.log(JSON.stringify({ sameDay: 'passed', inputTaxAndCarry: 'passed', dunningAndPaymentSuppression: 'passed', eightRetries: failedItem.retryFailures, migration: 'passed' }, null, 2));
