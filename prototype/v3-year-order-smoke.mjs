import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  createRunFromInputs, installRunOperatingResources, openNextRunDay, closeRunDay,
  getRunProjection, submitRunOffer, planRunOrder, completeRunOrderStep,
  submitRunDelivery, createFinanceStateForRun, issueAcceptedScenarioInvoices,
  processRunDayCustomerReceipts, createRunSaveEnvelope, restoreRunSaveEnvelope,
} from './v3/run.js';
import { recordV3RunCustomerAcceptanceDecision } from './v3-run-orchestrator.js';

// Additive integration fixture; uses the established T-0069 A05 order scenario.
// This does not alter the four-path baseline in v3-year-smoke.mjs.
const START = '2027-01-04';
const END = '2027-12-31';
const SEED = 'T-0069-order-year-seed-1';
const nextDate = date => new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const hash = value => createHash('sha256').update(stable(value)).digest('hex');
const requireOk = result => { assert.equal(result.ok, true, result.error?.message); return result; };

export function runV3YearOrderSmoke() {
  let run = createRunFromInputs({ scenarioId: 'T-0069-ORDER-YEAR', seed: SEED, startDate: START, endDate: END });
  run = installRunOperatingResources(run, {
    peopleJson: JSON.stringify([{ id: 'P1', hoursPerDay: 8, skills: ['turning'] }]),
    equipmentJson: JSON.stringify([{ id: 'M1', hoursPerDay: 8, capabilities: ['turning'] }]),
    materialsJson: JSON.stringify([{ id: 'steel', quantity: 10 }]),
    commitmentsJson: '[]', finishedGoodsCapacity: '1', finishedGoodsUsed: '0',
  });
  let finance = createFinanceStateForRun(run);
  assert.ok(finance, 'the established 2027 start profile has its documented scenario finance state');

  let date = START;
  let offerSubmitted = false;
  let orderCompleted = false;
  let issuedInvoiceId = null;
  let receiptEventId = null;
  const dailyLog = [];
  const macroPeriods = [];
  while (date <= END) {
    const opened = openNextRunDay(run);
    run = opened.state;
    assert.equal(opened.result.date, date);
    const priorReceiptIds = new Set(finance.events.filter(event => event.financeType === 'customer-payment').map(event => event.eventId));
    finance = processRunDayCustomerReceipts(finance, date).financeState;
    const newReceipt = finance.events.find(event => event.financeType === 'customer-payment' && !priorReceiptIds.has(event.eventId));
    if (newReceipt) {
      const paidInvoice = finance.invoices.find(invoice => invoice.invoiceId === newReceipt.invoiceId);
      assert.equal(paidInvoice?.dueDate, date, 'the due customer receipt is processed on the stored invoice due date');
      assert.equal(receiptEventId, null, 'this fixture contains one invoice/receipt only');
      receiptEventId = newReceipt.eventId;
    }

    if (!offerSubmitted) {
      const inquiry = getRunProjection(run).playerView.inquiries.find(row => row.status === 'open');
      assert.ok(inquiry, 'the first run day contains an open inquiry');
      const offered = submitRunOffer(run, inquiry, {
        netPrice: '10,00', costVersion: 'COST-UI-1', babVersion: 'BAB-UI-1',
        directCostsJson: JSON.stringify([{ id: 'material-1', amountEuro: '2,00', variable: true }]),
        sourcePoolsJson: JSON.stringify([{
          poolId: 'POOL-UI-1', sourceCostCenterId: 'CC-SOURCE', costBasisId: 'COST-BASIS-1',
          period: '2027-01', poolEuro: '100,01', allocationMode: 'keys', unitLabel: 'h',
          recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }],
        }]),
        offerDriversJson: JSON.stringify([{ poolId: 'POOL-UI-1', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '2', unitLabel: 'h' }]),
      });
      run = offered.state;
      assert.equal(offered.calculation.resultAfterBabCents, -1200, 'the already-established fixture intentionally demonstrates a negative result after BAB');
      offerSubmitted = true;
    }

    const macro = run.modules.macro.periods.at(-1);
    if (macro && macroPeriods.at(-1) !== macro.period) macroPeriods.push(macro.period);

    if (!orderCompleted) {
      const order = run.customerWorkOrders.find(row => row.inquiryId && row.status === 'awaiting_operational_plan');
      if (order) {
        assert.equal(date, '2027-01-06', 'the existing two-day customer decision delay is preserved');
        const contractFields = {
          contractRef: 'CON-T0069-YEAR-1', contractType: 'Kaufvertrag',
          customerPartyId: order.customerPartyId, buyerPartyId: 'BUYER-T0069-YEAR-1',
          acceptancePartyId: order.customerPartyId,
          performanceCriterionRef: 'PERF-T0069-YEAR-1', acceptanceCriterionRef: 'ACC-T0069-YEAR-1',
          orderUnit: 'Stück', orderQuantity: 1, storageUnitsPerOrderUnit: 1,
        };
        run = planRunOrder(run, order, {
          contractFields,
          operationsJson: JSON.stringify([{
            operationId: 'cut', date, personId: 'P1', equipmentId: 'M1', hours: 2,
            requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'],
            predecessors: [], materials: { steel: 1 },
          }]),
        }).state;
        run = completeRunOrderStep(run, order.workOrderId, 'cut').state;
        const delivery = submitRunDelivery(run, order.workOrderId, { deliveryId: 'DELIVERY-T0069-YEAR-1', sourceRef: 'fixture:delivery:T0069-YEAR-1' });
        run = delivery.state;
        const decision = recordV3RunCustomerAcceptanceDecision(run, {
          decisionId: 'DECISION-T0069-YEAR-1', sourceRef: 'fixture:customer-acceptance:T0069-YEAR-1',
          workOrderId: order.workOrderId, deliveryId: 'DELIVERY-T0069-YEAR-1', decisionDate: date,
          decision: 'accept', actorRole: 'customer', actorPartyId: order.customerPartyId,
          customerRef: order.customerPartyId, authorizedForRef: null, partyAuthorityRef: null,
          acceptanceCriterionRef: contractFields.acceptanceCriterionRef,
        });
        run = decision.state;
        assert.equal(decision.result.status, 'accepted_non_posting');
        assert.equal(run.financeHandoffs.find(row => row.workOrderId === order.workOrderId).status, 'pending_non_posting');
        orderCompleted = true;
      }
    }

    run = closeRunDay(run).state;
    const invoiceResult = issueAcceptedScenarioInvoices(run, finance);
    finance = invoiceResult.financeState;
    if (invoiceResult.invoiceIds.length) {
      assert.equal(invoiceResult.invoiceIds.length, 1);
      issuedInvoiceId = invoiceResult.invoiceIds[0];
    }
    dailyLog.push({ date, events: run.dayEvents.filter(event => event.occurredAt === date).length });
    date = nextDate(date);
  }

  assert.equal(date, '2028-01-01');
  assert.equal(dailyLog.length, 362);
  assert.equal(macroPeriods.length, 12);
  assert.equal(orderCompleted, true, 'one accepted order completed production, delivery, and customer acceptance');
  assert.ok(issuedInvoiceId, 'the accepted order generated one D-0166 scenario invoice');
  assert.ok(receiptEventId, 'the invoice was paid on its stored due date during the annual run');
  assert.equal(finance.invoices.filter(row => row.invoiceId === issuedInvoiceId).length, 1);
  assert.equal(finance.events.filter(row => row.financeType === 'customer-payment' && row.invoiceId === issuedInvoiceId).length, 1);
  assert.equal(run.customerWorkOrders.length, 1, 'the fixture deliberately controls one customer order; subsequent market requests continue to be generated but are not offered');
  assert.equal(run.modules.product.materials.find(row => row.id === 'steel').quantity, 9);
  assert.equal(run.modules.product.customerAssignments.length, 1);
  assert.equal(run.modules.product.currentDate, END);
  const serialized = JSON.stringify(createRunSaveEnvelope(run, finance));
  const restored = restoreRunSaveEnvelope(JSON.parse(serialized));
  assert.equal(hash(restored.runState), hash(run), 'save/restore preserves the complete shared run state');
  assert.equal(hash(restored.financeState), hash(finance), 'save/restore preserves the complete finance state');
  assert.deepEqual(restored.runState.modules.macro.periods.map(period => period.period), macroPeriods, 'save/restore preserves all 12 monthly macro snapshots');
  assert.deepEqual(restored.financeState.invoices, finance.invoices, 'save/restore preserves invoice references and due dates');
  assert.deepEqual(restored.financeState.events.filter(event => event.financeType === 'customer-payment'), finance.events.filter(event => event.financeType === 'customer-payment'), 'save/restore preserves the unique D-0168 payment event');
  assert.equal(restored.financeState.invoices.find(invoice => invoice.invoiceId === issuedInvoiceId)?.dueDate, '2027-01-19');
  assert.equal(restored.financeState.events.filter(event => event.financeType === 'customer-payment' && event.invoiceId === issuedInvoiceId).length, 1);

  return {
    fixture: 'T-0069 accepted-order annual integration smoke',
    scenarioId: run.scenarioId, seed: SEED, startDate: START, endDate: END,
    runnerVersion: run.modelVersion, days: dailyLog.length, macroPeriods,
    orders: run.customerWorkOrders.length, offerResultAfterBabCents: -1200,
    operationalStatus: run.customerWorkOrders[0].status,
    invoiceId: issuedInvoiceId, receiptEventId,
    financeBoundary: 'D-0166 scenario invoice and D-0168 customer receipt only; no full journal/ledger, supplier cash, COGS, or stock valuation reconciliation',
    stateHash: hash({ run, finance }), restoreStateHash: hash({ run: restored.runState, finance: restored.financeState }),
  };
}

const report = runV3YearOrderSmoke();
console.log(JSON.stringify(report, null, 2));
console.log('PASS: one documented V3 order traversed offer, work, delivery, customer acceptance, scenario invoice, due-date payment, and the 12-month shared-run calendar. No full-company financial result is claimed.');
