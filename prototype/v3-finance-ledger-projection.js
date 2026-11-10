// Deterministic, read-only journal projection for the currently authorized
// customer journal, D-0174 supplier AP/bank, and D-0177 overdraft subledger
// events. This is not a posting API, chart of accounts, or complete general ledger.
import { reconcileV3Finance, V3_FINANCE_RUNTIME_VERSION } from './v3-finance-runtime.js';

const SUPPORTED = new Set(['recognized-performance', 'scenario-invoice-issued', 'customer-payment', 'supplier-invoice-ap', 'supplier-payment-executed', 'dispo-principal-draw', 'dispo-principal-repayment']);
const fail = message => { throw new TypeError(`V3 finance ledger projection: ${message}`); };
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function requireId(value, field) {
  if (typeof value !== 'string' || !value.trim()) fail(`${field} must be a non-empty ID`);
  return value;
}
function requireCents(value, field, { positive = false } = {}) {
  if (!Number.isSafeInteger(value) || value < 0 || (positive && value === 0)) fail(`${field} must be ${positive ? 'a positive' : 'a non-negative'} safe integer cent amount`);
  return value;
}
function requireDate(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`${field} must be an ISO calendar date`);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) fail(`${field} must be a real calendar date`);
  return value;
}
function add(left, right, field) {
  const value = left + right;
  if (!Number.isSafeInteger(value) || value < 0) fail(`${field} exceeds safe integer cents`);
  return value;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isRecord(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
function storedSourcePayload(event) {
  const source = { ...event };
  // FinanceRuntime appends these projection/control fields after hashing the
  // original source event. Keep all original fields so coordinated restore
  // mutations remain detectable by the stored canonical payload fingerprint.
  const generatedByType = {
    'recognized-performance': ['financeType', 'acceptanceDate', 'recognitionDate', 'amountCents', 'receivableOutstandingCents', 'invoiceId'],
    'scenario-invoice-issued': ['financeType', 'postingEffect', 'amountCents', 'receivableEffectCents', 'simTaxPayableEffectCents', 'cashEffectCents'],
    'customer-payment': ['financeType', 'cashEffectCents', 'receivableEffectCents'],
    'supplier-invoice-ap': ['financeType', 'postingEffect', 'accountsPayableEffectCents', 'cashEffectCents', 'generalLedgerEffect', 'taxEffect', 'inventoryEffect', 'expenseEffect', 'cogsEffect'],
    'supplier-payment-executed': ['financeType', 'postingEffect', 'accountsPayableEffectCents', 'cashEffectCents', 'generalLedgerEffect', 'taxEffect', 'inventoryEffect', 'expenseEffect', 'cogsEffect', 'dispoDrawEventId'],
    'dispo-principal-draw': ['financeType', 'postingEffect', 'cashEffectCents', 'dispoPrincipalEffectCents'],
    'dispo-principal-repayment': []
  }[event.financeType];
  if (!generatedByType) fail('unsupported stored event type');
  for (const key of generatedByType) delete source[key];
  return source;
}
function cloneFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) cloneFreeze(item);
    Object.freeze(value);
  }
  return value;
}

/**
 * Project the present D-0166 customer subledger into balanced journal-shaped
 * lines without changing or posting to the source FinanceState.
 *
 * `asOfDate` is an inclusive calendar cut-off. Opening AR is aggregate and is
 * retained separately because this FinanceState provides no per-OP opening
 * event from which honest journal lines could be constructed.
 */
export function projectV3FinanceLedger(state, asOfDate) {
  if (!isRecord(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) fail('state is not a V3 finance state');
  const asOf = requireDate(asOfDate, 'asOfDate');
  const opening = state.opening;
  if (!isRecord(opening)) fail('explicit opening balances are required');
  requireDate(opening.date, 'opening.date');
  if (asOf < opening.date) fail('asOfDate cannot precede opening date');
  const openingBank = requireCents(opening.bankCents, 'opening.bankCents');
  const openingEquity = opening.equityCents === undefined || opening.equityCents === null ? null : requireCents(opening.equityCents, 'opening.equityCents');
  const openingAr = requireCents(opening.receivablesCents, 'opening.receivablesCents');
  if (openingEquity !== null && (openingBank !== openingEquity || openingAr !== 0)) fail('D-0180 opening bank/equity must match and opening receivables must be zero');
  requireId(opening.sourceRef, 'opening.sourceRef');
  if (!Array.isArray(state.events) || !Array.isArray(state.orders) || !Array.isArray(state.invoices) || !isRecord(state.processed)) fail('event, order, invoice, and processed collections are required');

  const eventsById = new Map();
  const sourceRefs = new Set();
  const paymentIds = new Set();
  for (const [index, event] of state.events.entries()) {
    if (!isRecord(event)) fail(`events[${index}] must be an object`);
    if (!SUPPORTED.has(event.financeType)) fail(`unsupported or missing financeType at events[${index}]`);
    const eventId = requireId(event.eventId, `events[${index}].eventId`);
    const sourceRef = requireId(event.sourceRef, `events[${index}].sourceRef`);
    if (event.runId !== state.runId) fail(`event ${eventId} runId does not match state`);
    const effectiveDate = requireDate(event.effectiveDate, `event ${eventId}.effectiveDate`);
    if (effectiveDate < opening.date) fail(`event ${eventId} precedes opening date`);
    if (eventsById.has(eventId) || sourceRefs.has(sourceRef)) fail(`duplicate event ID or sourceRef at ${eventId}`);
    eventsById.set(eventId, event);
    sourceRefs.add(sourceRef);
    const processed = state.processed[eventId];
    if (!isRecord(processed) || processed.financeRef !== `F-${eventId}`) fail(`event ${eventId} lacks its processed finance reference`);
    const sourcePayload = storedSourcePayload(event);
    if (event.financeType === 'supplier-payment-executed' && event.dispoDrawEventId) {
      const drawEvent = state.events.find(row => row.eventId === event.dispoDrawEventId && row.financeType === 'dispo-principal-draw');
      if (!drawEvent) fail(`supplier payment ${eventId} references a missing D-0125 draw event`);
      sourcePayload.dispoDrawEvent = storedSourcePayload(drawEvent);
    }
    const expectedPayload = JSON.stringify(canonical(sourcePayload));
    if (typeof processed.payloadHash !== 'string' || processed.payloadHash !== expectedPayload) fail(`event ${eventId} payload does not match its stored source fingerprint`);
  }

  const orders = new Map();
  for (const [index, order] of state.orders.entries()) {
    if (!isRecord(order)) fail(`orders[${index}] must be an object`);
    const orderId = requireId(order.orderId, `orders[${index}].orderId`);
    if (orders.has(orderId)) fail(`duplicate order ${orderId}`);
    orders.set(orderId, order);
  }
  const invoices = new Map();
  for (const [index, invoice] of state.invoices.entries()) {
    if (!isRecord(invoice)) fail(`invoices[${index}] must be an object`);
    const invoiceId = requireId(invoice.invoiceId, `invoices[${index}].invoiceId`);
    if (invoices.has(invoiceId)) fail(`duplicate invoice ${invoiceId}`);
    if (invoice.policyVersion !== 'D-0166') fail(`invoice ${invoiceId} is outside the authorized D-0166 projection`);
    invoices.set(invoiceId, invoice);
  }

  const seenOrderIds = new Set();
  const seenInvoiceIds = new Set();
  const lines = [];
  const eventLines = new Map();
  const lineFor = (event, side, account, debitCents, creditCents) => ({
    lineId: `${state.runId}:${event.eventId}:${side}`,
    sourceEventId: event.eventId,
    sourceRef: event.sourceRef,
    effectiveDate: event.effectiveDate,
    period: event.effectiveDate.slice(0, 7),
    account,
    debitCents,
    creditCents
  });
  const addBalancedEvent = (event, debitAccount, creditAccount, amount, kind) => {
    if (amount <= 0) fail(`event ${event.eventId} has no positive ${kind} amount`);
    const eventRows = [
      lineFor(event, 'D', debitAccount, amount, 0),
      lineFor(event, 'C', creditAccount, 0, amount)
    ];
    const debit = eventRows.reduce((sum, row) => add(sum, row.debitCents, 'event debits'), 0);
    const credit = eventRows.reduce((sum, row) => add(sum, row.creditCents, 'event credits'), 0);
    if (debit !== credit) fail(`event ${event.eventId} is not balanced`);
    eventLines.set(event.eventId, eventRows);
    if (event.effectiveDate <= asOf) lines.push(...eventRows);
  };

  if (openingEquity !== null && opening.date <= asOf) {
    const openingEvent = { eventId: `OPENING:${state.runId}`, sourceRef: opening.sourceRef, effectiveDate: opening.date };
    const openingLines = [
      lineFor(openingEvent, 'D', 'bank', openingBank, 0),
      lineFor(openingEvent, 'C', 'owner_equity', 0, openingEquity),
    ];
    lines.push(...openingLines);
    eventLines.set(openingEvent.eventId, openingLines);
  }

  for (const event of state.events) {
    const type = event.financeType;
    if (type === 'recognized-performance') {
      const order = orders.get(event.orderId);
      const amount = requireCents(event.amountCents, `performance ${event.eventId}.amountCents`, { positive: true });
      if (!order || order.eventId !== event.eventId || order.orderId !== event.orderId) fail(`performance ${event.eventId} lacks its matching order`);
      if (seenOrderIds.has(order.orderId)) fail(`order ${order.orderId} has duplicate recognized performance`);
      if (event.authorization?.owner !== 'A03' || event.authorization?.status !== 'authorized') fail(`performance ${event.eventId} lacks A03 authorization`);
      requireId(event.authorization.sourceRef, `performance ${event.eventId}.authorization.sourceRef`);
      if (order.amountCents !== amount || order.receivableOutstandingCents < 0 || order.recognitionDate !== event.effectiveDate || event.receivableCents !== amount || event.recognizedRevenueCents !== amount || event.performanceDate !== order.performanceDate || event.acceptanceDate !== order.acceptanceDate || event.recognitionDate !== order.recognitionDate || event.receivableOutstandingCents !== amount || event.invoiceId !== null) fail(`performance ${event.eventId} differs from its recognized order amounts/dates`);
      seenOrderIds.add(order.orderId);
      addBalancedEvent(event, 'trade_receivables', 'customer_revenue', amount, 'net performance');
    } else if (type === 'scenario-invoice-issued') {
      const invoice = invoices.get(event.invoiceId);
      const order = orders.get(event.orderId);
      if (!invoice || !order || invoice.eventId !== event.eventId || invoice.orderId !== event.orderId || event.policyVersion !== 'D-0166') fail(`invoice event ${event.eventId} lacks its matching D-0166 invoice/order`);
      if (seenInvoiceIds.has(invoice.invoiceId)) fail(`invoice ${invoice.invoiceId} has duplicate invoice events`);
      if (event.authorization?.owner !== 'A03' || event.authorization?.status !== 'authorized' || event.authorization?.runId !== state.runId || event.authorization?.workOrderId !== event.orderId) fail(`invoice ${event.eventId} lacks bound A03 authorization`);
      requireId(event.authorization.sourceRef, `invoice ${event.eventId}.authorization.sourceRef`);
      const net = requireCents(event.netAmountCents, `invoice ${event.eventId}.netAmountCents`, { positive: true });
      const tax = requireCents(event.simTaxCents, `invoice ${event.eventId}.simTaxCents`);
      const gross = requireCents(event.grossReceivableCents, `invoice ${event.eventId}.grossReceivableCents`, { positive: true });
      requireDate(event.invoiceDate, `invoice ${event.eventId}.invoiceDate`);
      if (event.effectiveDate !== event.invoiceDate || invoice.invoiceDate !== event.invoiceDate || invoice.sourceRef !== event.sourceRef || invoice.policyVersion !== 'D-0166' || invoice.netAmountCents !== net || invoice.simTaxCents !== tax || invoice.amountCents !== gross || gross !== add(net, tax, 'invoice gross')) fail(`invoice ${event.eventId} differs from its persisted D-0166 totals/date/source`);
      if (order.amountCents !== net || order.simTaxPayableCents !== tax || order.receivableOutstandingCents < 0 || event.receivableEffectCents !== tax || event.simTaxPayableEffectCents !== tax || event.cashEffectCents !== 0 || event.amountCents !== gross) fail(`invoice ${event.eventId} must add only the D-0166 tax component`);
      seenInvoiceIds.add(invoice.invoiceId);
      if (tax > 0) addBalancedEvent(event, 'trade_receivables', 'simtax_payable', tax, 'D-0166 SimTAX');
      else eventLines.set(event.eventId, []);
    } else if (type === 'customer-payment') {
      const invoice = invoices.get(event.invoiceId);
      const order = orders.get(event.orderId);
      const amount = requireCents(event.amountCents, `payment ${event.eventId}.amountCents`, { positive: true });
      if (!invoice || !order || invoice.orderId !== event.orderId || invoice.policyVersion !== 'D-0166' || event.contractRef !== invoice.contractRef || event.payerRef !== order.customerRef) fail(`payment ${event.eventId} lacks its matching D-0166 customer/order/invoice`);
      requireId(event.paymentId, `payment ${event.eventId}.paymentId`);
      if (paymentIds.has(event.paymentId)) fail(`duplicate paymentId ${event.paymentId}`);
      paymentIds.add(event.paymentId);
      requireDate(event.paymentDate, `payment ${event.eventId}.paymentDate`);
      if (event.paymentDate !== event.effectiveDate || event.cashEffectCents !== amount || event.receivableEffectCents !== -amount || event.paymentDate < invoice.invoiceDate || amount > invoice.amountCents) fail(`payment ${event.eventId} has inconsistent amount/effective date/effects`);
      addBalancedEvent(event, 'bank', 'trade_receivables', amount, 'customer receipt');
    } else if (type === 'supplier-invoice-ap' || type === 'supplier-payment-executed') {
      // D-0174 authorizes an isolated AP/bank subledger only. Preserve source
      // validation through FinanceRuntime, but do not invent a GL counterline.
      eventLines.set(event.eventId, []);
    } else if (type === 'dispo-principal-draw' || type === 'dispo-principal-repayment') {
      // D-0177 changes bank and the Dispo control subledger. No GL counterline
      // is created here; the draw/repayment remain sourced runtime events.
      eventLines.set(event.eventId, []);
    }
  }
  for (const orderId of orders.keys()) if (!seenOrderIds.has(orderId)) fail(`order ${orderId} has no supported recognized-performance event`);
  for (const invoiceId of invoices.keys()) if (!seenInvoiceIds.has(invoiceId)) fail(`invoice ${invoiceId} has no supported D-0166 event`);

  lines.sort((left, right) => left.effectiveDate.localeCompare(right.effectiveDate) || left.sourceEventId.localeCompare(right.sourceEventId) || left.lineId.localeCompare(right.lineId));
  const totals = { debitCents: 0, creditCents: 0 };
  const accounts = {};
  for (const line of lines) {
    totals.debitCents = add(totals.debitCents, line.debitCents, 'total debits');
    totals.creditCents = add(totals.creditCents, line.creditCents, 'total credits');
    const account = accounts[line.account] ||= { debitCents: 0, creditCents: 0 };
    account.debitCents = add(account.debitCents, line.debitCents, `${line.account} debits`);
    account.creditCents = add(account.creditCents, line.creditCents, `${line.account} credits`);
  }
  if (totals.debitCents !== totals.creditCents) fail('projected journal does not balance');

  const view = reconcileV3Finance(state, asOf);
  const accountValue = name => accounts[name] || { debitCents: 0, creditCents: 0 };
  const ar = accountValue('trade_receivables');
  const bank = accountValue('bank');
  const tax = accountValue('simtax_payable');
  const revenue = accountValue('customer_revenue');
  const openingBankLineCents = openingEquity !== null && opening.date <= asOf ? openingBank : 0;
  const customerReceiptsCents = bank.debitCents - bank.creditCents - openingBankLineCents;
  const customerJournalBankCents = add(openingBank, customerReceiptsCents, 'projected customer-journal bank');
  const projected = {
    bankCents: customerJournalBankCents + view.flows.dispoDrawsCents - view.flows.dispoRepaymentsCents - view.flows.supplierPaymentsCents,
    receivablesCents: add(openingAr, ar.debitCents, 'projected receivables') - ar.creditCents,
    simTaxPayableCents: tax.creditCents - tax.debitCents,
    recognizedRevenueCents: revenue.creditCents - revenue.debitCents,
    customerReceiptsCents,
    dispoDrawsCents: view.flows.dispoDrawsCents,
    dispoRepaymentsCents: view.flows.dispoRepaymentsCents,
    simTaxAccruedCents: tax.creditCents - tax.debitCents,
    dispoPrincipalCents: view.stocks.dispoPrincipalCents,
    dispoLimitCents: view.stocks.dispoLimitCents,
    dispoAvailableCents: view.stocks.dispoAvailableCents
  };
  if (projected.bankCents < 0 || projected.receivablesCents < 0 || projected.simTaxPayableCents < 0) fail('projected balance is negative');
  for (const key of Object.keys(projected)) {
    const controlKey = key === 'bankCents' || key === 'receivablesCents' || key === 'simTaxPayableCents' ? key : key;
    const controlValue = ['bankCents', 'receivablesCents', 'simTaxPayableCents', 'dispoPrincipalCents', 'dispoLimitCents', 'dispoAvailableCents'].includes(controlKey)
      ? view.stocks[controlKey]
      : view.flows[controlKey];
    if (projected[key] !== controlValue) fail(`${key} does not reconcile to FinanceState (${projected[key]} != ${controlValue})`);
  }
  const supplierPeriodEntries = Object.entries(view.monthlyFlows).sort(([left], [right]) => left.localeCompare(right));
  const supplierSubledger = {
    openingAccountsPayableCents: 0,
    openingSourceRef: state.opening.sourceRef,
    supplierInvoicesCents: view.flows.supplierInvoicesCents,
    supplierPaymentsCents: view.flows.supplierPaymentsCents,
    closingAccountsPayableCents: view.stocks.supplierAccountsPayableCents,
    closingBankCents: view.stocks.bankCents,
    monthly: Object.fromEntries(supplierPeriodEntries.map(([period, flow]) => [period, {
      supplierInvoicesCents: flow.supplierInvoicesCents || 0,
      supplierPaymentsCents: flow.supplierPaymentsCents || 0,
      closingAccountsPayableCents: flow.closingStocks.supplierAccountsPayableCents,
      closingBankCents: flow.closingStocks.bankCents,
    }]))
  };
  if (supplierSubledger.openingAccountsPayableCents + supplierSubledger.supplierInvoicesCents - supplierSubledger.supplierPaymentsCents !== supplierSubledger.closingAccountsPayableCents) fail('supplier AP annual subledger does not roll forward');
  for (let index = 0; index < supplierPeriodEntries.length; index += 1) {
    const [period] = supplierPeriodEntries[index];
    const row = supplierSubledger.monthly[period];
    const prior = index > 0 ? supplierSubledger.monthly[supplierPeriodEntries[index - 1][0]] : null;
    const openingAp = prior?.closingAccountsPayableCents ?? supplierSubledger.openingAccountsPayableCents;
    if (openingAp + row.supplierInvoicesCents - row.supplierPaymentsCents !== row.closingAccountsPayableCents) fail(`supplier AP does not roll forward for ${period}: ${openingAp} + ${row.supplierInvoicesCents} - ${row.supplierPaymentsCents} != ${row.closingAccountsPayableCents}`);
  }
  return cloneFreeze({
    projectionVersion: 'V3-FINANCE-LEDGER-PROJECTION-2',
    runId: state.runId,
    asOfDate: asOf,
    postingEffect: 'none',
    openingBalances: { date: opening.date, sourceRef: opening.sourceRef, bankCents: openingBank, equityCents: openingEquity, openingEquityStatus: openingEquity === null ? 'pending_unclassified' : 'sourced', receivablesCents: openingAr, receivableSourceRefs: [...(opening.receivableSourceRefs || [])] },
    lines,
    totals,
    accounts,
    customerJournalBankCents,
    reconciledToFinanceState: projected,
    subledgerReconciliation: {
      supplierAccountsPayable: supplierSubledger,
      limitations: ['Supplier AP/payment is reconciled as an isolated D-0174 subledger and bank control only; it creates no GL journal lines or inferred expense, tax, inventory, or COGS entries.']
    },
    limitations: [
      'Read-only projection; it never posts or mutates FinanceState.',
      'Customer performance, D-0166 invoices, customer receipts, and the separate D-0174 supplier AP/bank subledger are supported.',
      openingEquity === null ? 'Opening equity counterline is unclassified and produces no journal entry.' : 'D-0180 opening bank/equity is represented by a balanced read-only opening journal pair; it does not mutate FinanceState.',
      'Opening AR remains aggregate because no per-receivable opening journal evidence exists.',
      'Dispo draw and repayment reconcile only to the D-0177 subledger and bank control; no GL counterlines or interest are inferred.',
      'No payroll, statutory tax remittance, COGS, inventory valuation, or complete general-ledger treatment is inferred.'
    ]
  });
}
