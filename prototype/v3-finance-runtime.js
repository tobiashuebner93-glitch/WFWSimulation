// A03-authoritative, event-sourced finance subledger for the V3 integration.
// It is deliberately fail-closed: this is not a general ledger or tax engine.
import { getV3RunCustomerEvidence, validateV3RunState } from './v3-run-orchestrator.js';

export const V3_FINANCE_RUNTIME_VERSION = 'V3-FINANCE-RUNTIME-2';

function invalid(message) { throw new TypeError(message); }
function record(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function id(value, field) {
  if (typeof value !== 'string' || !value.trim()) invalid(`${field} must be a non-empty stable ID`);
  return value;
}
function cents(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) invalid(`${field} must be a non-negative safe integer number of cents`);
  return value;
}
function date(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) invalid(`${field} must be an ISO date`);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) invalid(`${field} must be a real calendar date`);
  return value;
}
function clone(value) { return structuredClone(value); }
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (record(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
function fingerprint(value) { return JSON.stringify(canonical(value)); }
function getV3CustomerEvidenceFingerprint(evidence) {
  if (!record(evidence)) invalid('A02 evidence must be an object');
  return fingerprint(evidence);
}
function safeAdd(a, b, field) {
  const sum = a + b;
  if (!Number.isSafeInteger(sum) || sum < 0) invalid(`${field} exceeds the safe integer range`);
  return sum;
}
function monthOf(isoDate) { return isoDate.slice(0, 7); }

function openingDispoLimitCents(state) {
  const opening = state.opening;
  if (opening.sourceRef !== 'D-0180:opening-profile-v3-2027' || opening.date !== '2027-01-01'
    || opening.bankCents !== 1_000_000 || opening.equityCents !== 1_000_000 || opening.receivablesCents !== 0) return 0;
  return 100_000;
}

function dispoPrincipalCents(state, asOfDate = '9999-12-31') {
  let principal = 0;
  const events = state.events.filter(event => ['dispo-principal-draw', 'dispo-principal-repayment'].includes(event.financeType) && event.effectiveDate <= asOfDate)
    .slice().sort((left, right) => left.effectiveDate.localeCompare(right.effectiveDate)
      || (left.financeType === right.financeType ? 0 : left.financeType === 'dispo-principal-repayment' ? -1 : 1)
      || String(left.eventId).localeCompare(String(right.eventId)));
  for (const event of events) {
    if (event.financeType === 'dispo-principal-draw') principal = safeAdd(principal, event.amountCents, 'dispo principal');
    else {
      if (event.amountCents > principal) invalid('dispo repayment exceeds previously drawn principal');
      principal -= event.amountCents;
    }
  }
  return principal;
}

function orderedFinanceCashEvents(state, asOfDate) {
  const originalIndex = new Map(state.events.map((event, index) => [event.eventId, index]));
  const phase = event => ['customer-payment', 'dispo-principal-repayment'].includes(event.financeType) ? 0 : 1;
  const receiptId = event => event.financeType === 'customer-payment' ? event.eventId : event.customerPaymentEventId;
  const receiptPhase = event => event.financeType === 'customer-payment' ? 0 : 1;
  return state.events.filter(event => ['customer-payment', 'dispo-principal-repayment', 'dispo-principal-draw', 'supplier-payment-executed'].includes(event.financeType)
    && (event.paymentDate ?? event.effectiveDate) <= asOfDate)
    .slice().sort((left, right) => (left.paymentDate ?? left.effectiveDate).localeCompare(right.paymentDate ?? right.effectiveDate)
      || phase(left) - phase(right)
      || (phase(left) === 0
        ? originalIndex.get(receiptId(left)) - originalIndex.get(receiptId(right)) || receiptPhase(left) - receiptPhase(right)
        : originalIndex.get(left.eventId) - originalIndex.get(right.eventId)));
}

export function getV3DispoPosition(state, asOfDate = '9999-12-31') {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  date(asOfDate, 'asOfDate');
  const limitCents = openingDispoLimitCents(state);
  const principalCents = dispoPrincipalCents(state, asOfDate);
  if (principalCents > limitCents) invalid('dispo principal exceeds the D-0180 opening facility');
  return freeze({ limitCents, principalCents, availableCents: limitCents - principalCents });
}

/**
 * Build a non-posting V3 invoice calculation from explicit line items and an
 * explicit due-date anchor. D-0165 fixes the temporary 19% scenario rate and
 * 14-calendar-day term; existing inclusive anchor counting and weekend shift
 * apply. This does not decide whether/when an invoice may be issued.
 */
export function calculateV3InvoiceTerms({ positions, dueDateAnchor }) {
  date(dueDateAnchor, 'dueDateAnchor');
  if (!Array.isArray(positions) || positions.length === 0) invalid('positions must be a non-empty explicit invoice-position list');
  let netTotalCents = 0;
  let simTaxTotalCents = 0;
  const positionRefs = new Set();
  const calculated = positions.map((position, index) => {
    if (!record(position)) invalid(`positions[${index}] must be an object`);
    const positionRef = id(position.positionRef, `positions[${index}].positionRef`);
    if (positionRefs.has(positionRef)) invalid('invoice position references must be unique');
    positionRefs.add(positionRef);
    const netCents = cents(position.netCents, `positions[${index}].netCents`);
    if (typeof position.taxable !== 'boolean') invalid(`positions[${index}].taxable must be explicit`);
    const taxProduct = netCents * 19;
    if (!Number.isSafeInteger(taxProduct)) invalid(`positions[${index}] tax calculation exceeds the safe integer range`);
    const roundedTaxProduct = taxProduct + 50;
    if (!Number.isSafeInteger(roundedTaxProduct)) invalid(`positions[${index}] rounded tax calculation exceeds the safe integer range`);
    const simTaxCents = position.taxable ? Math.floor(roundedTaxProduct / 100) : 0;
    if (!Number.isSafeInteger(simTaxCents)) invalid(`positions[${index}] tax amount exceeds the safe integer range`);
    netTotalCents = safeAdd(netTotalCents, netCents, 'net invoice total');
    simTaxTotalCents = safeAdd(simTaxTotalCents, simTaxCents, 'SimTAX total');
    return { positionRef, netCents, taxable: position.taxable, rateBasisPoints: position.taxable ? 1900 : 0, simTaxCents, grossCents: safeAdd(netCents, simTaxCents, 'gross invoice position') };
  });

  const anchor = new Date(`${dueDateAnchor}T00:00:00.000Z`);
  anchor.setUTCDate(anchor.getUTCDate() + 13); // anchor is day 1 of the 14-day term
  while (anchor.getUTCDay() === 0 || anchor.getUTCDay() === 6) anchor.setUTCDate(anchor.getUTCDate() + 1);
  if (anchor.getUTCFullYear() > 9999) invalid('dueDate is outside the supported ISO calendar range');
  const dueDate = anchor.toISOString().slice(0, 10);
  return freeze({
    policyVersion: 'D-0165',
    dueDateAnchor,
    contractualTermCalendarDays: 14,
    dueDate,
    positions: calculated,
    netTotalCents,
    simTaxTotalCents,
    grossTotalCents: safeAdd(netTotalCents, simTaxTotalCents, 'gross invoice total'),
    postingEffect: 'none',
    limitations: ['Explicit positions/taxable flags and dueDateAnchor are required.', 'No invoice eligibility, tax status, revenue, receivable, tax liability, payment or cash posting is inferred.', '19% is a V3 scenario rule through V5; legal exemptions, the Kleinunternehmerregelung and other rates require separate handling.']
  });
}

/**
 * Create a subledger from an explicitly sourced opening snapshot. No zero
 * opening balance is assumed. Amounts are cents and are not tax-derived.
 */
export function createV3FinanceState({ runId, opening }) {
  id(runId, 'runId');
  if (!record(opening)) invalid('opening must be an explicitly sourced opening snapshot');
  const openingDate = date(opening.date, 'opening.date');
  const openingSourceRef = id(opening.sourceRef, 'opening.sourceRef');
  const bankCents = cents(opening.bankCents, 'opening.bankCents');
  const equityCents = opening.equityCents === undefined ? null : cents(opening.equityCents, 'opening.equityCents');
  const receivablesCents = cents(opening.receivablesCents, 'opening.receivablesCents');
  if (equityCents !== null && (bankCents !== equityCents || receivablesCents !== 0)) invalid('D-0180 V3 opening requires sourced bank/equity equality and zero opening receivables');
  const sourceRefs = Array.isArray(opening.receivableSourceRefs) ? opening.receivableSourceRefs.map((ref, i) => id(ref, `opening.receivableSourceRefs[${i}]`)) : [];
  if (receivablesCents > 0 && sourceRefs.length === 0) invalid('opening receivables require source references');
  return freeze({
    modelVersion: V3_FINANCE_RUNTIME_VERSION,
    runId,
    opening: { date: openingDate, sourceRef: openingSourceRef, bankCents, ...(equityCents === null ? {} : { equityCents }), receivablesCents, receivableSourceRefs: sourceRefs },
    events: [],
    orders: [],
    invoices: [],
    supplierInvoices: [],
    processed: {},
    status: 'ready'
  });
}

function eventPayload(event, expectedType, state) {
  if (!record(event)) invalid('event must be an object');
  if (event.runId !== state.runId) invalid('event runId does not match finance state');
  if (event.eventType !== expectedType) invalid(`eventType must be ${expectedType}`);
  const eventId = id(event.eventId, 'event.eventId');
  const sourceRef = id(event.sourceRef, 'event.sourceRef');
  const effectiveDate = date(event.effectiveDate, 'event.effectiveDate');
  if (effectiveDate < state.opening.date) invalid('event cannot precede the sourced opening date');
  const payloadHash = fingerprint(event);
  const prior = state.processed[eventId];
  if (prior) {
    if (prior.payloadHash !== payloadHash) invalid('event ID was replayed with a different payload');
    return { replay: true, prior };
  }
  if (sourceRef === state.opening.sourceRef || state.opening.receivableSourceRefs.includes(sourceRef) || state.events.some(row => row.sourceRef === sourceRef)) {
    invalid('sourceRef has already been used by a different finance event');
  }
  return { replay: false, eventId, sourceRef, effectiveDate, payloadHash };
}

function append(state, event, details) {
  const nextEvent = { ...clone(event), ...details };
  const next = clone(state);
  next.events.push(nextEvent);
  if (details.financeType === 'recognized-performance') {
    next.orders.push({
      eventId: event.eventId,
      orderId: details.orderId,
      customerRef: details.customerRef,
      contractRef: details.contractRef,
      offerSnapshotRef: details.offerSnapshotRef,
      performanceDate: details.performanceDate,
      acceptanceDate: details.acceptanceDate,
      recognitionDate: details.recognitionDate,
      amountCents: details.amountCents,
      receivableOutstandingCents: details.receivableOutstandingCents,
      invoiceId: null
    });
  }
  next.processed[event.eventId] = { payloadHash: fingerprint(event), financeRef: `F-${event.eventId}` };
  return freeze(next);
}

/**
 * Recognize an explicitly authorized, completed customer performance.
 * The A03 source payload must provide its finance-approved recognized amount;
 * the helper never derives tax, contract prices, COGS or stock valuation.
 */
export function recordV3CustomerPerformance(state, event) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const checked = eventPayload(event, 'customerPerformanceAccepted', state);
  if (checked.replay) return state;
  const orderId = id(event.orderId, 'event.orderId');
  const customerRef = id(event.customerRef, 'event.customerRef');
  const offerSnapshotRef = id(event.offerSnapshotRef, 'event.offerSnapshotRef');
  const acceptance = event.acceptance;
  if (!record(acceptance) || acceptance.actorRole !== 'customer' && acceptance.actorRole !== 'recipient') invalid('acceptance must be performed by the customer or recipient');
  const authorizedCustomer = acceptance.actorRole === 'customer'
    ? acceptance.actorRef === customerRef
    : acceptance.authorizedForRef === customerRef;
  if (!authorizedCustomer || acceptance.partyAuthorityRef !== event.contractPartyAuthorityRef) invalid('acceptance must be tied to the contractual customer or an evidenced representative acting for that customer');
  id(event.contractPartyAuthorityRef, 'event.contractPartyAuthorityRef');
  const contractRef = id(event.contractRef, 'event.contractRef');
  id(acceptance.criterionRef, 'acceptance.criterionRef');
  date(acceptance.date, 'acceptance.date');
  date(event.performanceDate, 'event.performanceDate');
  if (acceptance.date < event.performanceDate || checked.effectiveDate < acceptance.date) invalid('finance effectiveDate must not precede performance and customer acceptance');
  if (event.authorization?.owner !== 'A03' || event.authorization?.status !== 'authorized') invalid('performance requires an explicit A03 authorization');
  id(event.authorization.sourceRef, 'event.authorization.sourceRef');
  const revenue = cents(event.recognizedRevenueCents, 'event.recognizedRevenueCents');
  const receivable = cents(event.receivableCents, 'event.receivableCents');
  if (revenue === 0 || receivable !== revenue) invalid('recognized revenue and receivable must be equal explicit amounts; tax/multi-line cases remain unsupported');
  if (state.orders.some(row => row.orderId === orderId || row.offerSnapshotRef === offerSnapshotRef) || state.events.some(row => row.financeType === 'recognized-performance' && row.sourceRef === checked.sourceRef)) invalid('order, offer snapshot, or performance source already has a recognized performance event');
  return append(state, event, {
    financeType: 'recognized-performance', orderId, customerRef, contractRef, offerSnapshotRef,
    performanceDate: event.performanceDate, acceptanceDate: acceptance.date,
    recognitionDate: checked.effectiveDate, amountCents: revenue,
    receivableOutstandingCents: receivable, invoiceId: null
  });
}

/** Invoice is a distinct evidence event; it validates the existing receivable and posts no second revenue. */
function recordV3InvoiceInternal(state, event) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const checked = eventPayload(event, 'customerInvoiceIssued', state);
  if (checked.replay) return state;
  const invoiceId = id(event.invoiceId, 'event.invoiceId');
  const orderId = id(event.orderId, 'event.orderId');
  id(event.performanceEventId, 'event.performanceEventId');
  const contractRef = id(event.contractRef, 'event.contractRef');
  const invoiceDate = date(event.invoiceDate, 'event.invoiceDate');
  const dueDate = date(event.dueDate, 'event.dueDate');
  if (invoiceDate !== checked.effectiveDate || dueDate < invoiceDate) invalid('invoice effectiveDate must equal invoiceDate and dueDate cannot precede invoiceDate');
  const amount = cents(event.receivableCents, 'event.receivableCents');
  const order = state.orders.find(row => row.orderId === orderId);
  if (!order || order.eventId !== event.performanceEventId) invalid('invoice must refer to the matching recognized performance event');
  if (invoiceDate < order.performanceDate || invoiceDate < order.acceptanceDate) invalid('invoice date cannot precede the referenced performance and customer acceptance dates');
  if (order.contractRef !== contractRef) invalid('invoice contractRef must match the recognized performance contract');
  const scenarioTaxInvoice = event.policyVersion === 'D-0166';
  let taxCents = 0;
  let grossCents = amount;
  if (scenarioTaxInvoice) {
    if (event.authorization?.owner !== 'A03' || event.authorization?.status !== 'authorized') invalid('scenario invoice requires explicit A03 authorization');
    id(event.authorization.sourceRef, 'event.authorization.sourceRef');
    if (event.authorization.runId !== state.runId || event.authorization.workOrderId !== orderId || event.authorization.offerSnapshotRef !== order.offerSnapshotRef || event.authorization.evidenceFingerprint !== event.evidenceFingerprint) invalid('scenario invoice authorization must bind the run, order, offer snapshot, and evidence fingerprint');
    id(event.evidenceFingerprint, 'event.evidenceFingerprint');
    const netCents = cents(event.netAmountCents, 'event.netAmountCents');
    taxCents = cents(event.simTaxCents, 'event.simTaxCents');
    grossCents = cents(event.grossReceivableCents, 'event.grossReceivableCents');
    if (netCents !== order.amountCents || order.receivableOutstandingCents !== netCents) invalid('scenario invoice net amount must match the recognized contract net R');
    const expected = calculateV3InvoiceTerms({ dueDateAnchor: event.dueDateAnchor, positions: [{ positionRef: event.positionRef, netCents, taxable: true }] });
    if (event.invoiceLabel !== 'Szenario-Rechnung (vereinfacht)') invalid('scenario invoice label is required');
    if (expected.dueDate !== dueDate || expected.simTaxTotalCents !== taxCents || expected.grossTotalCents !== grossCents || grossCents !== netCents + taxCents) invalid('scenario invoice tax, gross amount, or due date does not match D-0165/D-0166');
    const expectedAnchor = invoiceDate > order.performanceDate ? invoiceDate : order.performanceDate;
    if (date(event.dueDateAnchor, 'event.dueDateAnchor') !== expectedAnchor) invalid('scenario dueDateAnchor must be the later of performance and invoice date');
  } else if (order.receivableOutstandingCents !== amount) {
    invalid('invoice amount must match the currently outstanding receivable');
  }
  if (state.invoices.some(row => row.invoiceId === invoiceId || row.orderId === orderId || row.sourceRef === checked.sourceRef)) invalid('invoice ID, source, or order already has an invoice record');
  const next = clone(state);
  const nextOrder = next.orders.find(row => row.orderId === orderId);
  if (scenarioTaxInvoice) {
    nextOrder.receivableOutstandingCents = grossCents;
    nextOrder.simTaxPayableCents = taxCents;
  }
  next.invoices.push({ invoiceId, orderId, contractRef, eventId: checked.eventId, invoiceDate, dueDate, amountCents: grossCents, netAmountCents: scenarioTaxInvoice ? order.amountCents : amount, simTaxCents: taxCents, sourceRef: checked.sourceRef, invoiceLabel: scenarioTaxInvoice ? event.invoiceLabel : null, policyVersion: scenarioTaxInvoice ? 'D-0166' : null });
  next.events.push({ ...clone(event), financeType: scenarioTaxInvoice ? 'scenario-invoice-issued' : 'invoice-evidence-only', postingEffect: scenarioTaxInvoice ? 'net-revenue-unchanged; gross-receivable-and-simtax-payable-recorded' : 'none', amountCents: grossCents, receivableEffectCents: scenarioTaxInvoice ? taxCents : 0, simTaxPayableEffectCents: taxCents, cashEffectCents: 0 });
  next.processed[checked.eventId] = { payloadHash: checked.payloadHash, financeRef: `F-${checked.eventId}` };
  return freeze(next);
}

/** Generic evidence-only invoices cannot request the D-0166 posting policy. */
export function recordV3Invoice(state, event) {
  if (event?.policyVersion === 'D-0166') invalid('D-0166 scenario invoices must use validated A02 run evidence');
  return recordV3InvoiceInternal(state, event);
}

function recordV3SupplierInvoiceInternal(state, event) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const checked = eventPayload(event, 'supplierInvoiceAccepted', state);
  if (checked.replay) return state;
  const invoiceId = id(event.invoiceId, 'event.invoiceId');
  const supplierId = id(event.supplierId, 'event.supplierId');
  const orderId = id(event.orderId, 'event.orderId');
  const shipmentId = id(event.shipmentId, 'event.shipmentId');
  const quoteId = id(event.quoteId, 'event.quoteId');
  const priceSnapshotFingerprint = id(event.priceSnapshotFingerprint, 'event.priceSnapshotFingerprint');
  const receiptMovementId = id(event.receiptMovementId, 'event.receiptMovementId');
  const invoiceDate = date(event.invoiceDate, 'event.invoiceDate');
  const dueDate = date(event.dueDate, 'event.dueDate');
  const amount = cents(event.amountCents, 'event.amountCents');
  if (amount === 0 || event.currency !== 'EUR' || event.amountBasis !== 'net_before_tax' || event.taxStatus !== 'unknown' || event.taxAmountCents !== null) invalid('supplier invoice must preserve the explicit EUR net-before-tax amount and unknown tax status');
  if (event.paymentTermCalendarDays !== 14 || event.status !== 'pending_non_posting' || dueDate < invoiceDate || invoiceDate !== checked.effectiveDate) invalid('supplier invoice must match the non-posting D-0173 14-day invoice evidence');
  if (event.authorization?.owner !== 'A03' || event.authorization?.status !== 'authorized' || event.authorization?.decisionRef !== 'D-0174') invalid('supplier AP recognition requires D-0174 A03 authorization');
  id(event.authorization.sourceRef, 'event.authorization.sourceRef');
  if (state.supplierInvoices?.some(row => row.invoiceId === invoiceId || row.sourceRef === checked.sourceRef)) invalid('supplier invoice ID or source is already recorded');
  if (state.invoices.some(row => row.invoiceId === invoiceId)) invalid('supplier invoice ID conflicts with a customer invoice');
  const invoice = {
    invoiceId, supplierId, orderId, shipmentId, quoteId, priceSnapshotFingerprint,
    receiptMovementId, invoiceDate, dueDate, amountCents: amount,
    currency: event.currency, amountBasis: event.amountBasis,
    taxStatus: event.taxStatus, taxAmountCents: null,
    paymentTermCalendarDays: 14, sourceRef: checked.sourceRef,
  };
  const next = clone(state);
  next.supplierInvoices ||= [];
  next.supplierInvoices.push(invoice);
  const persistedEvent = { ...clone(event), financeType: 'supplier-invoice-ap', postingEffect: 'supplier-ap-only', amountCents: amount, accountsPayableEffectCents: amount, cashEffectCents: 0, generalLedgerEffect: 'none', taxEffect: 'none', inventoryEffect: 'none', expenseEffect: 'none', cogsEffect: 'none' };
  next.events.push(persistedEvent);
  next.processed[checked.eventId] = { payloadHash: checked.payloadHash, persistedEventHash: fingerprint(persistedEvent), financeRef: `F-${checked.eventId}` };
  return freeze(next);
}

/** Create an AP-only supplier entry from the validated A02 receipt/invoice event. */
export function recordV3SupplierInvoiceFromRunEvidence(state, { runState, invoiceId: requestedInvoiceId }) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  if (!record(runState)) invalid('validated A02 runState is required');
  validateV3RunState(runState);
  if (runState.runId !== state.runId) invalid('A02 runState runId does not match finance state');
  const wanted = id(requestedInvoiceId, 'input.invoiceId');
  const product = runState.modules?.product;
  const sourceInvoice = product?.supplierInvoiceEvidence?.find(row => row.invoiceId === wanted);
  if (!sourceInvoice) invalid('supplier invoice is not present in validated A02 product evidence');
  const shipment = product.materialShipments?.find(row => row.shipmentId === sourceInvoice.shipmentId);
  const movement = product.materialMovements?.find(row => row.movementId === sourceInvoice.receiptMovementId);
  const quote = shipment?.supplierQuoteSnapshot;
  const sourceEvents = runState.dayEvents.filter(row => row.phase === 'supplier_invoice_evidence' && row.sourceRef === sourceInvoice.invoiceId && fingerprint(row.result?.invoice) === fingerprint(sourceInvoice));
  if (!shipment || shipment.status !== 'received' || shipment.receivedAt !== sourceInvoice.invoiceDate || !movement || movement.date !== sourceInvoice.invoiceDate || sourceEvents.length !== 1) invalid('supplier AP requires exactly one validated invoice evidence after accepted goods receipt');
  if (sourceInvoice.supplierId !== shipment.supplierId || sourceInvoice.orderId !== shipment.orderId || sourceInvoice.quoteId !== quote?.quoteId || sourceInvoice.priceSnapshotFingerprint !== JSON.stringify(quote) || sourceInvoice.amountCents !== quote?.totalNetAmountCents || sourceInvoice.currency !== 'EUR') invalid('supplier invoice does not match the accepted supplier quote and receipt snapshot');
  if (sourceInvoice.status !== 'pending_non_posting' || sourceInvoice.taxStatus !== 'unknown' || sourceInvoice.taxAmountCents !== null || sourceInvoice.amountBasis !== 'net_before_tax' || sourceInvoice.paymentTermCalendarDays !== 14) invalid('supplier invoice is outside the D-0173/D-0174 non-posting source contract');
  const eventId = `D-0174:SUPPLIER-INVOICE:${encodeURIComponent(state.runId)}:${encodeURIComponent(sourceInvoice.invoiceId)}`;
  return recordV3SupplierInvoiceInternal(state, {
    eventId, eventType: 'supplierInvoiceAccepted', runId: state.runId,
    sourceRef: sourceInvoice.sourceRef, effectiveDate: sourceInvoice.invoiceDate,
    invoiceId: sourceInvoice.invoiceId, supplierId: sourceInvoice.supplierId,
    orderId: sourceInvoice.orderId, shipmentId: sourceInvoice.shipmentId,
    quoteId: sourceInvoice.quoteId, priceSnapshotFingerprint: sourceInvoice.priceSnapshotFingerprint,
    receiptMovementId: sourceInvoice.receiptMovementId, invoiceDate: sourceInvoice.invoiceDate,
    dueDate: sourceInvoice.dueDate, paymentTermCalendarDays: sourceInvoice.paymentTermCalendarDays,
    amountCents: sourceInvoice.amountCents, currency: sourceInvoice.currency,
    amountBasis: sourceInvoice.amountBasis, taxStatus: sourceInvoice.taxStatus,
    taxAmountCents: sourceInvoice.taxAmountCents, status: sourceInvoice.status,
    authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0174', sourceRef: `D-0174:${state.runId}:${sourceInvoice.invoiceId}` },
  });
}

/** Execute a full supplier settlement; D-0174 forbids automatic, partial or unfunded payments. */
export function recordV3SupplierPayment(state, event) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const checked = eventPayload(event, 'supplierPaymentExecuted', state);
  if (checked.replay) return state;
  const paymentId = id(event.paymentId, 'event.paymentId');
  const invoiceId = id(event.invoiceId, 'event.invoiceId');
  const supplierId = id(event.supplierId, 'event.supplierId');
  const paymentDate = date(event.paymentDate, 'event.paymentDate');
  const amount = cents(event.amountCents, 'event.amountCents');
  const bankAccountRef = id(event.bankAccountRef, 'event.bankAccountRef');
  id(event.bankTransactionRef, 'event.bankTransactionRef');
  if (paymentDate !== checked.effectiveDate || event.currency !== 'EUR' || amount === 0) invalid('supplier payment must have an explicit EUR amount and effective payment date');
  if (event.execution?.status !== 'executed' || !['player', 'manager'].includes(event.execution?.actorRole)) invalid('supplier payment requires an explicitly executed player/manager action');
  id(event.execution.actorRef, 'event.execution.actorRef');
  if (event.authorization?.owner !== 'A03' || event.authorization?.status !== 'authorized' || event.authorization?.decisionRef !== 'D-0174') invalid('supplier payment requires D-0174 A03 authorization');
  id(event.authorization.sourceRef, 'event.authorization.sourceRef');
  const invoice = state.supplierInvoices?.find(row => row.invoiceId === invoiceId);
  if (!invoice || invoice.supplierId !== supplierId || invoice.currency !== event.currency) invalid('payment must reference an existing supplier AP invoice for the same supplier and currency');
  if (paymentDate < invoice.invoiceDate) invalid('supplier payment cannot precede its invoice');
  const priorPayments = state.events.filter(row => row.financeType === 'supplier-payment-executed' && row.invoiceId === invoiceId);
  if (priorPayments.some(row => row.paymentId === paymentId || row.sourceRef === checked.sourceRef)) invalid('supplier payment ID or source has already been recorded');
  const paidAmount = priorPayments.reduce((sum, row) => safeAdd(sum, row.amountCents, 'supplier payments by invoice'), 0);
  const outstanding = invoice.amountCents - paidAmount;
  if (outstanding <= 0 || amount !== outstanding) invalid('supplier payment must settle the full remaining AP balance; partial payment is not permitted');
  const availableBankCents = reconcileV3Finance(state, paymentDate).stocks.bankCents;
  const shortfallCents = Math.max(0, amount - availableBankCents);
  let drawPayload = null;
  let drawChecked = null;
  let persistedDraw = null;
  if (shortfallCents > 0) {
    drawPayload = event.dispoDrawEvent;
    if (!record(drawPayload)) invalid('insufficient bank balance; an explicit D-0125 manual draw decision is required');
    drawChecked = eventPayload(drawPayload, 'dispoPrincipalDrawn', state);
    if (drawChecked.replay) invalid('D-0125 draw event already exists without its matching supplier payment');
    const drawDate = date(drawPayload.drawDate, 'dispo draw.drawDate');
    if (drawDate !== paymentDate || drawChecked.effectiveDate !== paymentDate || drawPayload.invoiceId !== invoiceId
      || drawPayload.paymentEventId !== checked.eventId || drawPayload.intendedPaymentCents !== amount
      || drawPayload.amountCents !== shortfallCents || drawPayload.currency !== 'EUR') invalid('D-0125 draw must equal the exact full supplier-payment shortfall and reference this invoice/payment');
    if (drawPayload.execution?.status !== 'executed' || drawPayload.execution?.actorRole !== 'player') invalid('D-0125 draw requires an explicit player action');
    id(drawPayload.execution.actorRef, 'dispo draw.execution.actorRef');
    if (drawPayload.authorization?.owner !== 'A03' || drawPayload.authorization?.status !== 'authorized' || drawPayload.authorization?.decisionRef !== 'D-0125') invalid('D-0125 draw authorization is required');
    id(drawPayload.authorization.sourceRef, 'dispo draw.authorization.sourceRef');
    if (paymentDate < invoice.dueDate) invalid('D-0125 draw may only cover a due supplier invoice');
    const freeFacilityCents = getV3DispoPosition(state, paymentDate).availableCents;
    if (shortfallCents > freeFacilityCents) invalid('D-0125 draw exceeds the free validated D-0180 facility');
    persistedDraw = { ...clone(drawPayload), financeType: 'dispo-principal-draw', postingEffect: 'bank-and-dispo-principal-only', cashEffectCents: shortfallCents, dispoPrincipalEffectCents: shortfallCents };
  } else if (event.dispoDrawEvent !== undefined && event.dispoDrawEvent !== null) {
    invalid('D-0125 draw is not permitted when available bank cash already covers the payment');
  }
  const next = clone(state);
  if (persistedDraw) {
    next.events.push(persistedDraw);
    next.processed[drawChecked.eventId] = { payloadHash: drawChecked.payloadHash, persistedEventHash: fingerprint(persistedDraw), financeRef: `F-${drawChecked.eventId}` };
  }
  const { dispoDrawEvent: _drawEvent, ...paymentPayload } = clone(event);
  const persistedEvent = { ...paymentPayload, ...(persistedDraw ? { dispoDrawEventId: persistedDraw.eventId } : {}), financeType: 'supplier-payment-executed', postingEffect: 'supplier-ap-and-bank-only', amountCents: amount, accountsPayableEffectCents: -amount, cashEffectCents: -amount, generalLedgerEffect: 'none', taxEffect: 'none', inventoryEffect: 'none', expenseEffect: 'none', cogsEffect: 'none', bankAccountRef };
  next.events.push(persistedEvent);
  next.processed[checked.eventId] = { payloadHash: checked.payloadHash, persistedEventHash: fingerprint(persistedEvent), financeRef: `F-${checked.eventId}` };
  return freeze(next);
}

/** Record the D-0166 invoice only from a freshly derived, validated A02 run. */
export function recordV3ScenarioInvoiceFromCustomerEvidence(state, input) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  if (!record(input) || !record(input.runState)) invalid('validated A02 runState is required');
  if (Object.hasOwn(input, 'evidence') || Object.hasOwn(input, 'authorization')) invalid('caller-supplied evidence or authorization is not accepted');
  validateV3RunState(input.runState);
  if (input.runState.runId !== state.runId) invalid('A02 runState runId does not match finance state');
  const workOrderId = id(input.workOrderId, 'input.workOrderId');
  const evidence = getV3RunCustomerEvidence(input.runState, workOrderId);
  if (evidence.evidenceVersion !== 'V3-CUSTOMER-EVIDENCE-1' || evidence.runId !== state.runId) invalid('A02 customer evidence version/runId does not match finance state');
  if (evidence.evidenceStatus !== 'customer_decision_recorded' || evidence.financeStatus !== 'pending_non_posting' || evidence.postingEffect !== 'none') invalid('scenario invoice requires pending non-posting customer evidence');
  const orderRefs = evidence.orderRefs;
  const contract = evidence.contract;
  const delivery = evidence.delivery;
  const decision = evidence.customerDecision;
  if (!record(orderRefs) || !record(contract) || !record(delivery) || !record(decision)) invalid('complete order, contract, delivery, and customer-decision evidence is required');
  if (evidence.workOrderId !== workOrderId) invalid('A02 evidence workOrderId does not match requested work order');
  const inquiryId = id(orderRefs.inquiryId, 'evidence.orderRefs.inquiryId');
  const offerId = id(orderRefs.offerId, 'evidence.orderRefs.offerId');
  id(orderRefs.marketDecisionId, 'evidence.orderRefs.marketDecisionId');
  id(orderRefs.workOrderEventId, 'evidence.orderRefs.workOrderEventId');
  date(orderRefs.acceptedAt, 'evidence.orderRefs.acceptedAt');
  const contractRef = id(contract.contractRef, 'evidence.contract.contractRef');
  const customerRef = id(orderRefs.customerPartyId, 'evidence.orderRefs.customerPartyId');
  id(contract.acceptancePartyId, 'evidence.contract.acceptancePartyId');
  id(contract.planEventId, 'evidence.contract.planEventId');
  const offer = orderRefs.acceptedNetR;
  if (!record(offer) || offer.currency !== 'EUR' || offer.offerSnapshotRef !== offerId || !offer.submissionEventId) invalid('accepted net R must be bound to the immutable EUR offer snapshot');
  const netCents = cents(offer.amountCents, 'evidence.orderRefs.acceptedNetR.amountCents');
  const evidenceFingerprint = getV3CustomerEvidenceFingerprint(evidence);
  if (netCents === 0) invalid('accepted net R must be greater than zero');
  if (contract.customerPartyId !== customerRef || !contract.acceptanceCriterionRef || !Number.isFinite(contract.quantity) || contract.quantity <= 0 || typeof contract.unit !== 'string' || !contract.unit.trim()) invalid('contract customer, quantity, unit, and acceptance criterion must match the accepted market order');
  id(delivery.eventId, 'evidence.delivery.eventId');
  id(delivery.sourceRef, 'evidence.delivery.sourceRef');
  id(delivery.deliveryId, 'evidence.delivery.deliveryId');
  date(delivery.deliveryDate, 'evidence.delivery.deliveryDate');
  if (delivery.recipientPartyId !== contract.acceptancePartyId) invalid('source-bound delivery evidence must identify the contract-bound recipient');
  if (delivery.quantity !== contract.quantity || delivery.unit !== contract.unit) invalid('delivery quantity and unit must match the evidenced contract');
  if (!Array.isArray(evidence.operations) || evidence.operations.length === 0) invalid('completed operation evidence is required before invoicing');
  for (const [index, operation] of evidence.operations.entries()) {
    if (!record(operation) || operation.status !== 'completed') invalid(`operations[${index}] must be completed`);
    id(operation.completionEventId, `operations[${index}].completionEventId`);
    id(operation.completionSourceRef, `operations[${index}].completionSourceRef`);
    const completedDate = date(operation.completionDate, `operations[${index}].completionDate`);
    if (completedDate > delivery.deliveryDate) invalid('all operations must complete no later than delivery');
  }
  if (decision.decision !== 'accept' || decision.status !== 'accepted_non_posting') invalid('a positive non-posting customer decision is required; rejection cannot be invoiced');
  id(decision.eventId, 'evidence.customerDecision.eventId');
  id(decision.sourceRef, 'evidence.customerDecision.sourceRef');
  id(decision.decisionId, 'evidence.customerDecision.decisionId');
  const decisionDate = date(decision.decisionDate, 'evidence.customerDecision.decisionDate');
  if (decisionDate < delivery.deliveryDate) invalid('customer decision cannot precede delivery');
  if (decision.acceptanceCriterionRef !== contract.acceptanceCriterionRef || decision.customerRef !== customerRef) invalid('customer decision must match contract acceptance criterion and customer');
  if (decision.actorRole === 'customer') {
    if (decision.actorPartyId !== customerRef) invalid('customer decision actor must match the contractual customer');
  } else if (decision.actorRole === 'recipient') {
    if (decision.actorPartyId !== contract.acceptancePartyId || decision.authorizedForRef !== customerRef || decision.partyAuthorityRef !== contract.partyAuthorityRef) invalid('recipient decision must carry the contract-bound customer authority');
  } else invalid('scenario invoice requires customer or authorized recipient decision');

  const a03Source = `D-0166:${state.runId}:${workOrderId}:${evidenceFingerprint}`;
  const performanceEventId = `PERF:${state.runId}:${workOrderId}`;
  const invoiceId = `SCENARIO-INVOICE:${state.runId}:${workOrderId}`;
  const performanceDate = evidence.operations.reduce((latest, operation) => {
    const completedDate = date(operation.completionDate, 'operation.completionDate');
    return completedDate > latest ? completedDate : latest;
  }, '0000-01-01');
  if (performanceDate === '0000-01-01' || performanceDate > delivery.deliveryDate) invalid('D-0167 requires the last contract-required completed operation date no later than delivery');
  const invoiceDate = decisionDate;
  const dueDateAnchor = performanceDate > invoiceDate ? performanceDate : invoiceDate;
  const invoiceTerms = calculateV3InvoiceTerms({ dueDateAnchor, positions: [{ positionRef: offerId, netCents, taxable: true }] });
  const evidenceRefs = {
    workOrderId, inquiryId, offerId, contractRef,
    acceptedAt: orderRefs.acceptedAt,
    marketDecisionId: orderRefs.marketDecisionId,
    offerSubmissionEventId: offer.submissionEventId,
    deliveryEventId: delivery.eventId,
    deliverySourceRef: delivery.sourceRef,
    customerDecisionEventId: decision.eventId,
    customerDecisionSourceRef: decision.sourceRef,
    operationCompletionEventIds: evidence.operations.map(operation => operation.completionEventId)
  };
  const authorization = {
    owner: 'A03', status: 'authorized',
    sourceRef: `D-0166:${state.runId}:${workOrderId}:${evidenceFingerprint}`,
    runId: state.runId, workOrderId, offerSnapshotRef: offer.offerSnapshotRef, evidenceFingerprint
  };
  const performanceEvent = {
    eventId: performanceEventId, eventType: 'customerPerformanceAccepted', runId: state.runId,
    sourceRef: `${a03Source}:performance`, effectiveDate: invoiceDate, performanceDate,
    orderId: workOrderId, customerRef, contractRef,
    contractPartyAuthorityRef: contract.partyAuthorityRef ?? `customer:${customerRef}`,
    offerSnapshotRef: offer.offerSnapshotRef,
    acceptance: {
      actorRole: decision.actorRole, actorRef: decision.actorPartyId,
      authorizedForRef: decision.authorizedForRef,
      partyAuthorityRef: decision.partyAuthorityRef ?? `customer:${customerRef}`,
      criterionRef: decision.acceptanceCriterionRef, date: decisionDate
    },
    authorization, recognizedRevenueCents: netCents, receivableCents: netCents, evidenceRefs,
    evidenceFingerprint
  };
  const withPerformance = recordV3CustomerPerformance(state, performanceEvent);
  return recordV3InvoiceInternal(withPerformance, {
    eventId: `INV:${state.runId}:${workOrderId}`, eventType: 'customerInvoiceIssued', runId: state.runId,
    sourceRef: `${a03Source}:invoice`, effectiveDate: invoiceDate,
    invoiceId, invoiceDate, dueDate: invoiceTerms.dueDate, dueDateAnchor,
    orderId: workOrderId, performanceEventId, contractRef,
    receivableCents: invoiceTerms.grossTotalCents, netAmountCents: netCents,
    simTaxCents: invoiceTerms.simTaxTotalCents, grossReceivableCents: invoiceTerms.grossTotalCents,
    positionRef: offerId, invoiceLabel: 'Szenario-Rechnung (vereinfacht)', policyVersion: 'D-0166',
    authorization, evidenceRefs, evidenceFingerprint
  });
}

function appendCustomerReceiptDispoRepayment(state, paymentEvent) {
  const principalCents = dispoPrincipalCents(state, paymentEvent.paymentDate);
  const amountCents = Math.min(paymentEvent.amountCents, principalCents);
  if (amountCents === 0) return state;
  const eventId = `D-0126:DISPO-REPAY:${encodeURIComponent(paymentEvent.eventId)}`;
  const repayment = {
    eventId, eventType: 'customerReceiptAppliedToDispo', runId: state.runId,
    sourceRef: `D-0126:${paymentEvent.sourceRef}:principal-repayment`,
    effectiveDate: paymentEvent.paymentDate, repaymentDate: paymentEvent.paymentDate,
    customerPaymentEventId: paymentEvent.eventId, amountCents,
    financeType: 'dispo-principal-repayment', postingEffect: 'bank-and-dispo-principal-only',
    cashEffectCents: -amountCents, dispoPrincipalEffectCents: -amountCents,
    authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0126', sourceRef: 'D-0126:customer-receipt-priority' },
  };
  if (state.processed[eventId]) invalid('customer receipt already has its D-0126 repayment event');
  const next = clone(state);
  next.events.push(repayment);
  next.processed[eventId] = { payloadHash: fingerprint(repayment), persistedEventHash: fingerprint(repayment), financeRef: `F-${eventId}` };
  return freeze(next);
}

/** Record actual customer cash receipt; partial settlement needs an explicit contract permission. */
export function recordV3CustomerPayment(state, event) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const checked = eventPayload(event, 'customerPaymentReceived', state);
  if (checked.replay) return state;
  const paymentId = id(event.paymentId, 'event.paymentId');
  const orderId = id(event.orderId, 'event.orderId');
  const invoiceId = id(event.invoiceId, 'event.invoiceId');
  id(event.payerRef, 'event.payerRef');
  const paidDate = date(event.paymentDate, 'event.paymentDate');
  if (paidDate !== checked.effectiveDate) invalid('paymentDate must equal the actual payment effectiveDate');
  const amount = cents(event.amountCents, 'event.amountCents');
  if (amount === 0) invalid('payment amount must be greater than zero');
  const invoice = state.invoices.find(row => row.invoiceId === invoiceId && row.orderId === orderId);
  const order = state.orders.find(row => row.orderId === orderId);
  if (!invoice || !order || invoice.eventId === event.eventId) invalid('payment must reference the separate invoice and recognized receivable');
  if (event.payerRef !== order.customerRef || event.contractRef !== invoice.contractRef) invalid('payer and contract references must match the recognized customer receivable');
  if (paidDate < invoice.invoiceDate) invalid('payment cannot precede its invoice');
  if (state.events.some(row => row.financeType === 'customer-payment' && (row.paymentId === paymentId || row.sourceRef === checked.sourceRef))) invalid('payment ID or source has already been recorded');
  if (amount > order.receivableOutstandingCents) invalid('payment exceeds the open receivable');
  if (event.contract?.partialPaymentsAllowed !== true && amount !== order.receivableOutstandingCents) invalid('partial payment requires explicit contract permission; otherwise only full settlement is supported');
  const next = clone(state);
  const nextOrder = next.orders.find(row => row.orderId === orderId);
  nextOrder.receivableOutstandingCents -= amount;
  const paymentEvent = { ...clone(event), financeType: 'customer-payment', amountCents: amount, cashEffectCents: amount, receivableEffectCents: -amount };
  next.events.push(paymentEvent);
  next.processed[checked.eventId] = { payloadHash: checked.payloadHash, persistedEventHash: fingerprint(paymentEvent), financeRef: `F-${checked.eventId}` };
  return appendCustomerReceiptDispoRepayment(freeze(next), paymentEvent);}

/**
 * Process only D-0166 scenario invoices whose stored due date is exactly the
 * supplied operational date. The deterministic event references are derived
 * from the run and invoice, so replay is idempotent. This is a V3 base-case
 * assumption, not a general payment scheduler: missed dates are never caught
 * up, and non-scenario invoices are left untouched.
 */
export function processV3ScenarioCustomerReceiptsDue(state, currentDate) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const operationalDate = date(currentDate, 'currentDate');
  if (operationalDate < state.opening.date) invalid('currentDate cannot precede the sourced opening date');

  const dueInvoices = state.invoices
    .filter(invoice => invoice.policyVersion === 'D-0166' && invoice.dueDate === operationalDate)
    .slice()
    .sort((left, right) => left.invoiceId.localeCompare(right.invoiceId));
  let next = state;
  for (const invoice of dueInvoices) {
    const order = next.orders.find(row => row.orderId === invoice.orderId);
    if (!order) invalid('due scenario invoice must reference a recognized customer receivable');
    if (order.receivableOutstandingCents === 0) continue;
    if (order.receivableOutstandingCents !== invoice.amountCents) invalid('D-0168 supports only full settlement of the gross scenario invoice');
    const stableRef = `D-0168:${next.runId}:${invoice.invoiceId}:${invoice.dueDate}`;
    next = recordV3CustomerPayment(next, {
      eventId: `PAY:${stableRef}`,
      eventType: 'customerPaymentReceived',
      runId: next.runId,
      sourceRef: `SOURCE:${stableRef}`,
      paymentId: `PAYMENT:${stableRef}`,
      paymentDate: invoice.dueDate,
      effectiveDate: invoice.dueDate,
      orderId: invoice.orderId,
      invoiceId: invoice.invoiceId,
      payerRef: order.customerRef,
      contractRef: invoice.contractRef,
      amountCents: invoice.amountCents
    });
  }
  return next;
}

/** Return explicit Kalendermonat flows and end-of-day stock views from the stored event facts. */
export function reconcileV3Finance(state, asOfDate) {
  if (!record(state) || state.modelVersion !== V3_FINANCE_RUNTIME_VERSION) invalid('state is not a V3 finance state');
  const asOf = date(asOfDate, 'asOfDate');
  if (asOf < state.opening.date) invalid('asOfDate cannot precede the sourced opening date');
  const supplierInvoices = state.supplierInvoices ?? [];
  if (!Array.isArray(supplierInvoices)) invalid('supplierInvoices must be an array');
  const supplierInvoiceIds = new Set();
  const assertPersistedSupplierEvent = event => {
    const processed = state.processed?.[event.eventId];
    if (!processed || typeof processed.payloadHash !== 'string' || processed.persistedEventHash !== fingerprint(event)) invalid('supplier finance event does not match its immutable persisted event fingerprint');
  };
  for (const invoice of supplierInvoices) {
    if (!record(invoice) || !id(invoice.invoiceId, 'supplier invoice.invoiceId') || supplierInvoiceIds.has(invoice.invoiceId)) invalid('supplier invoice records must be unique objects');
    supplierInvoiceIds.add(invoice.invoiceId);
    cents(invoice.amountCents, 'supplier invoice.amountCents');
    date(invoice.invoiceDate, 'supplier invoice.invoiceDate');
    date(invoice.dueDate, 'supplier invoice.dueDate');
    id(invoice.sourceRef, 'supplier invoice.sourceRef');
    id(invoice.supplierId, 'supplier invoice.supplierId');
    id(invoice.orderId, 'supplier invoice.orderId');
    id(invoice.shipmentId, 'supplier invoice.shipmentId');
    if (invoice.currency !== 'EUR' || invoice.amountBasis !== 'net_before_tax' || invoice.taxStatus !== 'unknown' || invoice.taxAmountCents !== null || invoice.paymentTermCalendarDays !== 14) invalid('supplier AP invoice amount/tax/term snapshot is inconsistent with D-0173');
    const sourceEvent = state.events.find(row => row.financeType === 'supplier-invoice-ap' && row.invoiceId === invoice.invoiceId);
    if (sourceEvent) assertPersistedSupplierEvent(sourceEvent);
    if (!sourceEvent || sourceEvent.eventId !== `D-0174:SUPPLIER-INVOICE:${encodeURIComponent(state.runId)}:${encodeURIComponent(invoice.invoiceId)}` || sourceEvent.amountCents !== invoice.amountCents || sourceEvent.sourceRef !== invoice.sourceRef || sourceEvent.supplierId !== invoice.supplierId || sourceEvent.orderId !== invoice.orderId || sourceEvent.shipmentId !== invoice.shipmentId || sourceEvent.quoteId !== invoice.quoteId || sourceEvent.priceSnapshotFingerprint !== invoice.priceSnapshotFingerprint || sourceEvent.receiptMovementId !== invoice.receiptMovementId || sourceEvent.invoiceDate !== invoice.invoiceDate || sourceEvent.dueDate !== invoice.dueDate || sourceEvent.accountsPayableEffectCents !== invoice.amountCents || sourceEvent.cashEffectCents !== 0 || sourceEvent.authorization?.decisionRef !== 'D-0174') invalid('supplier AP invoice record lacks its matching immutable source event');
  }
  if (state.events.filter(row => row.financeType === 'supplier-invoice-ap').length !== supplierInvoices.length) invalid('supplier AP invoice history contains an orphan event or missing invoice record');
  const paidSupplierInvoiceIds = new Set();
  for (const payment of state.events.filter(row => row.financeType === 'supplier-payment-executed')) {
    assertPersistedSupplierEvent(payment);
    const invoice = supplierInvoices.find(row => row.invoiceId === payment.invoiceId);
    if (!invoice || paidSupplierInvoiceIds.has(payment.invoiceId) || payment.supplierId !== invoice.supplierId || payment.currency !== invoice.currency || payment.paymentDate !== payment.effectiveDate || payment.paymentDate < invoice.invoiceDate || payment.amountCents !== invoice.amountCents || payment.accountsPayableEffectCents !== -payment.amountCents || payment.cashEffectCents !== -payment.amountCents || payment.authorization?.decisionRef !== 'D-0174' || payment.execution?.status !== 'executed' || !['player', 'manager'].includes(payment.execution.actorRole) || !state.processed?.[payment.eventId]) invalid('supplier payment does not settle one matching AP invoice under D-0174');
    paidSupplierInvoiceIds.add(payment.invoiceId);
  }
  const monthlyFlows = {};
  let revenueCents = 0;
  let cashReceiptsCents = 0;
  let supplierInvoicesCents = 0;
  let supplierPaymentsCents = 0;
  let dispoDrawsCents = 0;
  let dispoRepaymentsCents = 0;
  let dispoPrincipal = 0;
  let simTaxAccruedCents = 0;
  let simTaxPayableCents = 0;
  let receivables = state.opening.receivablesCents;
  let accountsPayable = 0;
  let bank = state.opening.bankCents;
  const repaymentsByCustomerPayment = new Map();
  const customerPaymentEventIds = new Set(state.events.filter(event => event.financeType === 'customer-payment').map(event => event.eventId));
  const customerPayments = state.events.filter(event => event.financeType === 'customer-payment');
  if (new Set(customerPayments.map(event => event.eventId)).size !== customerPayments.length
    || new Set(customerPayments.map(event => event.paymentId)).size !== customerPayments.length
    || new Set(customerPayments.map(event => event.sourceRef)).size !== customerPayments.length) invalid('customer receipt event IDs, payment IDs, and source references must be unique');
  for (const payment of customerPayments) {
    const processed = state.processed?.[payment.eventId];
    if (!processed || typeof processed.payloadHash !== 'string' || processed.persistedEventHash !== fingerprint(payment)) invalid('customer receipt does not match its immutable persisted event fingerprint');
  }
  for (const repayment of state.events.filter(event => event.financeType === 'dispo-principal-repayment')) {
    if (repayment.effectiveDate <= asOf && !customerPaymentEventIds.has(repayment.customerPaymentEventId)) invalid('D-0126 repayment is orphaned from a customer receipt');
    const rows = repaymentsByCustomerPayment.get(repayment.customerPaymentEventId) ?? [];
    rows.push(repayment);
    repaymentsByCustomerPayment.set(repayment.customerPaymentEventId, rows);
  }
  for (const order of state.orders) {
    if (order.recognitionDate <= asOf) {
      const month = monthOf(order.recognitionDate);
      monthlyFlows[month] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
      monthlyFlows[month].recognizedRevenueCents = safeAdd(monthlyFlows[month].recognizedRevenueCents, order.amountCents, 'monthly revenue');
      revenueCents = safeAdd(revenueCents, order.amountCents, 'recognized revenue');
    }
  }
  const cashEvents = orderedFinanceCashEvents(state, asOf);
  for (const event of cashEvents) {
    if (event.financeType === 'customer-payment' && event.paymentDate <= asOf) {
      const expectedRepaymentCents = Math.min(event.amountCents, dispoPrincipal);
      const relatedRepayments = repaymentsByCustomerPayment.get(event.eventId) ?? [];
      if ((expectedRepaymentCents > 0 && relatedRepayments.length !== 1) || (expectedRepaymentCents === 0 && relatedRepayments.length !== 0)) invalid('D-0126 requires exactly one repayment event iff this customer receipt encounters outstanding dispo principal');
      if (expectedRepaymentCents > 0) {
        const repayment = relatedRepayments[0];
        const processed = state.processed?.[repayment.eventId];
        const expectedId = `D-0126:DISPO-REPAY:${encodeURIComponent(event.eventId)}`;
        const expectedSourceRef = `D-0126:${event.sourceRef}:principal-repayment`;
        if (repayment.eventId !== expectedId || repayment.eventType !== 'customerReceiptAppliedToDispo' || repayment.runId !== state.runId
          || repayment.sourceRef !== expectedSourceRef || repayment.effectiveDate !== event.paymentDate || repayment.repaymentDate !== event.paymentDate
          || repayment.customerPaymentEventId !== event.eventId || repayment.amountCents !== expectedRepaymentCents
          || repayment.cashEffectCents !== -expectedRepaymentCents || repayment.dispoPrincipalEffectCents !== -expectedRepaymentCents
          || repayment.authorization?.owner !== 'A03' || repayment.authorization?.status !== 'authorized' || repayment.authorization?.decisionRef !== 'D-0126'
          || !processed || processed.payloadHash !== fingerprint(repayment) || processed.persistedEventHash !== fingerprint(repayment)) invalid('D-0126 repayment identity, amount, authorization, or persisted fingerprint is invalid');
      }
      const month = monthOf(event.paymentDate);
      monthlyFlows[month] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
      monthlyFlows[month].customerReceiptsCents = safeAdd(monthlyFlows[month].customerReceiptsCents, event.amountCents, 'monthly receipts');
      cashReceiptsCents = safeAdd(cashReceiptsCents, event.amountCents, 'cash receipts');
      bank = safeAdd(bank, event.amountCents, 'bank');
    } else if (event.financeType === 'dispo-principal-repayment' && event.effectiveDate <= asOf) {
      const payment = state.events.find(row => row.eventId === event.customerPaymentEventId && row.financeType === 'customer-payment');
      const priorPrincipal = dispoPrincipal;
      if (!payment || event.repaymentDate !== event.effectiveDate || payment.paymentDate !== event.effectiveDate
        || event.amountCents !== Math.min(payment.amountCents, priorPrincipal) || event.amountCents <= 0
        || event.cashEffectCents !== -event.amountCents || event.dispoPrincipalEffectCents !== -event.amountCents
        || event.authorization?.decisionRef !== 'D-0126') invalid('D-0126 repayment does not match its customer receipt and outstanding principal');
      if (event.amountCents > bank) invalid('D-0126 repayment exceeds bank cash');
      dispoPrincipal -= event.amountCents;
      dispoRepaymentsCents = safeAdd(dispoRepaymentsCents, event.amountCents, 'dispo repayments');
      bank -= event.amountCents;
    } else if (event.financeType === 'dispo-principal-draw' && event.effectiveDate <= asOf) {
      const invoice = supplierInvoices.find(row => row.invoiceId === event.invoiceId);
      const payment = state.events.find(row => row.eventId === event.paymentEventId && row.financeType === 'supplier-payment-executed' && row.invoiceId === event.invoiceId);
      const priorPayments = state.events.filter(row => row.financeType === 'supplier-payment-executed' && row.invoiceId === event.invoiceId && row.paymentDate < event.drawDate);
      const shortfall = event.intendedPaymentCents - bank;
      if (!invoice || !payment || event.drawDate !== event.effectiveDate || event.intendedPaymentCents !== invoice.amountCents
        || payment.amountCents !== invoice.amountCents || payment.dispoDrawEventId !== event.eventId
        || priorPayments.length || event.amountCents !== shortfall || event.amountCents <= 0
        || event.cashEffectCents !== event.amountCents || event.dispoPrincipalEffectCents !== event.amountCents
        || event.authorization?.decisionRef !== 'D-0125' || event.execution?.status !== 'executed' || event.execution?.actorRole !== 'player') invalid('D-0125 draw is not an explicit exact shortfall for the linked supplier payment');
      if (dispoPrincipal + event.amountCents > openingDispoLimitCents(state)) invalid('D-0125 draws exceed the evidenced free opening facility');
      const processed = state.processed?.[event.eventId];
      if (!processed || processed.persistedEventHash !== fingerprint(event)) invalid('D-0125 draw event fingerprint is missing or inconsistent');
      dispoPrincipal = safeAdd(dispoPrincipal, event.amountCents, 'dispo principal');
      dispoDrawsCents = safeAdd(dispoDrawsCents, event.amountCents, 'dispo draws');
      bank = safeAdd(bank, event.amountCents, 'bank');
    } else if (event.financeType === 'supplier-payment-executed' && event.paymentDate <= asOf) {
      const month = monthOf(event.paymentDate);
      monthlyFlows[month] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
      monthlyFlows[month].supplierPaymentsCents = safeAdd(monthlyFlows[month].supplierPaymentsCents, event.amountCents, 'monthly supplier payments');
      supplierPaymentsCents = safeAdd(supplierPaymentsCents, event.amountCents, 'supplier payments');
      if (event.amountCents > bank) invalid('supplier payment history exceeds available bank balance');
      bank -= event.amountCents;
    }
  }
  for (const invoice of supplierInvoices) {
    if (invoice.invoiceDate > asOf) continue;
    const month = monthOf(invoice.invoiceDate);
    monthlyFlows[month] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
    monthlyFlows[month].supplierInvoicesCents = safeAdd(monthlyFlows[month].supplierInvoicesCents, invoice.amountCents, 'monthly supplier AP invoices');
    supplierInvoicesCents = safeAdd(supplierInvoicesCents, invoice.amountCents, 'supplier AP invoices');
    accountsPayable = safeAdd(accountsPayable, invoice.amountCents, 'supplier accounts payable');
  }
  for (const event of state.events) {
    if (event.financeType !== 'supplier-payment-executed' || event.paymentDate > asOf) continue;
    if (event.amountCents > accountsPayable) invalid('supplier payment history exceeds AP control balance');
    accountsPayable -= event.amountCents;
  }
  for (const invoice of state.invoices) {
    if (invoice.policyVersion !== 'D-0166' || invoice.invoiceDate > asOf) continue;
    const month = monthOf(invoice.invoiceDate);
    monthlyFlows[month] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
    monthlyFlows[month].simTaxAccruedCents = safeAdd(monthlyFlows[month].simTaxAccruedCents, invoice.simTaxCents, 'monthly SimTAX accrual');
    simTaxAccruedCents = safeAdd(simTaxAccruedCents, invoice.simTaxCents, 'SimTAX accrual');
    simTaxPayableCents = safeAdd(simTaxPayableCents, invoice.simTaxCents, 'SimTAX payable');
  }
  const recognizedReceivables = state.orders.filter(order => order.recognitionDate <= asOf).reduce((sum, order) => safeAdd(sum, order.amountCents, 'receivables'), 0);
  const invoicedTaxReceivables = state.invoices.filter(invoice => invoice.policyVersion === 'D-0166' && invoice.invoiceDate <= asOf).reduce((sum, invoice) => safeAdd(sum, invoice.simTaxCents, 'tax included in gross receivables'), 0);
  const paidByOrder = new Map();
  for (const event of state.events) {
    if (event.financeType === 'customer-payment' && event.paymentDate <= asOf) paidByOrder.set(event.orderId, safeAdd(paidByOrder.get(event.orderId) || 0, event.amountCents, 'payments by order'));
  }
  receivables = safeAdd(safeAdd(receivables, recognizedReceivables, 'receivables'), invoicedTaxReceivables, 'gross receivables');
  for (const paid of paidByOrder.values()) {
    if (paid > receivables) invalid('payment history exceeds the receivable control balance');
    receivables -= paid;
  }
  const closingStocks = [];
  const firstMonth = `${state.opening.date.slice(0, 7)}-01`;
  const endMonth = `${asOf.slice(0, 7)}-01`;
  for (let cursor = new Date(`${firstMonth}T00:00:00.000Z`); cursor <= new Date(`${endMonth}T00:00:00.000Z`); cursor.setUTCMonth(cursor.getUTCMonth() + 1)) {
    const monthStart = cursor.toISOString().slice(0, 10);
    const nextMonth = new Date(`${monthStart}T00:00:00.000Z`);
    nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
    const monthEndDate = new Date(nextMonth.valueOf() - 86400000).toISOString().slice(0, 10);
    const snapshotDate = monthEndDate > asOf ? asOf : monthEndDate;
    let snapshotBank = state.opening.bankCents;
    let snapshotReceivables = state.opening.receivablesCents;
    let snapshotAccountsPayable = 0;
    for (const order of state.orders) if (order.recognitionDate <= snapshotDate) snapshotReceivables = safeAdd(snapshotReceivables, order.amountCents, 'snapshot receivables');
    for (const invoice of state.invoices) if (invoice.policyVersion === 'D-0166' && invoice.invoiceDate <= snapshotDate) snapshotReceivables = safeAdd(snapshotReceivables, invoice.simTaxCents, 'snapshot tax in gross receivables');
    for (const invoice of supplierInvoices) if (invoice.invoiceDate <= snapshotDate) snapshotAccountsPayable = safeAdd(snapshotAccountsPayable, invoice.amountCents, 'snapshot supplier AP');
    const snapshotCashEvents = orderedFinanceCashEvents(state, snapshotDate);
    for (const event of snapshotCashEvents) {
      if (event.financeType === 'customer-payment' && event.paymentDate <= snapshotDate) {
        snapshotBank = safeAdd(snapshotBank, event.amountCents, 'snapshot bank');
        if (state.orders.some(order => order.orderId === event.orderId && order.recognitionDate <= snapshotDate)) snapshotReceivables -= event.amountCents;
      } else if (event.financeType === 'dispo-principal-draw' && event.effectiveDate <= snapshotDate) {
        snapshotBank = safeAdd(snapshotBank, event.amountCents, 'snapshot bank');
      } else if (event.financeType === 'dispo-principal-repayment' && event.effectiveDate <= snapshotDate) {
        if (event.amountCents > snapshotBank) invalid('snapshot dispo repayment exceeds bank cash');
        snapshotBank -= event.amountCents;
      } else if (event.financeType === 'supplier-payment-executed' && event.paymentDate <= snapshotDate) {
        if (event.amountCents > snapshotBank || event.amountCents > snapshotAccountsPayable) invalid('snapshot supplier payment exceeds bank or AP balance');
        snapshotBank -= event.amountCents;
        snapshotAccountsPayable -= event.amountCents;
      }
    }
    if (snapshotReceivables < 0) invalid('snapshot receivables cannot be negative');
    const month = monthStart.slice(0, 7);
    monthlyFlows[month] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
    const snapshot = { date: snapshotDate, bankCents: snapshotBank, receivablesCents: snapshotReceivables, supplierAccountsPayableCents: snapshotAccountsPayable, dispoPrincipalCents: dispoPrincipalCents(state, snapshotDate) };
    closingStocks.push(snapshot);
    monthlyFlows[month].closingStocks = snapshot;
  }
  const yearlyFlows = {};
  for (const [month, flow] of Object.entries(monthlyFlows)) {
    const year = month.slice(0, 4);
    yearlyFlows[year] ||= { recognizedRevenueCents: 0, customerReceiptsCents: 0, supplierInvoicesCents: 0, supplierPaymentsCents: 0, simTaxAccruedCents: 0 };
    yearlyFlows[year].recognizedRevenueCents = safeAdd(yearlyFlows[year].recognizedRevenueCents, flow.recognizedRevenueCents, 'yearly revenue');
    yearlyFlows[year].customerReceiptsCents = safeAdd(yearlyFlows[year].customerReceiptsCents, flow.customerReceiptsCents, 'yearly receipts');
    yearlyFlows[year].supplierInvoicesCents = safeAdd(yearlyFlows[year].supplierInvoicesCents, flow.supplierInvoicesCents || 0, 'yearly supplier AP invoices');
    yearlyFlows[year].supplierPaymentsCents = safeAdd(yearlyFlows[year].supplierPaymentsCents, flow.supplierPaymentsCents || 0, 'yearly supplier payments');
    yearlyFlows[year].simTaxAccruedCents = safeAdd(yearlyFlows[year].simTaxAccruedCents, flow.simTaxAccruedCents || 0, 'yearly SimTAX accrual');
  }
  return freeze({
    modelVersion: V3_FINANCE_RUNTIME_VERSION,
    runId: state.runId,
    asOfDate: asOf,
    flows: { recognizedRevenueCents: revenueCents, customerReceiptsCents: cashReceiptsCents, supplierInvoicesCents, supplierPaymentsCents, dispoDrawsCents, dispoRepaymentsCents, simTaxAccruedCents },
    stocks: { bankCents: bank, receivablesCents: receivables, supplierAccountsPayableCents: accountsPayable, simTaxPayableCents, dispoPrincipalCents: dispoPrincipal, dispoLimitCents: openingDispoLimitCents(state), dispoAvailableCents: openingDispoLimitCents(state) - dispoPrincipal, openingDate: state.opening.date, openingSourceRef: state.opening.sourceRef },
    monthlyFlows,
    yearlyFlows,
    closingStocks,
    limitations: ['Supplier AP invoices and full executed payments follow D-0174 only; supplier invoice amounts preserve the source net_before_tax basis and unknown tax status. No GL, tax, material inventory valuation, expense, COGS, credit, overdraft, or general-ledger balancing is inferred. Monthly closing stocks require an explicit dated checkpoint and are not derived from monthly flows.']
  });
}
