// Isolated deterministic V3 market state. No V1/V2, UI, ledger, or finance imports.
import { validateV3MacroDemandTrace } from './v3-macro-demand-channel.js';
export const V3_MARKET_VERSION = 'V3-MARKET-2';
export const V3_MARKET_INVITATION_PRICE_PROFILE_ID = 'V3-T0065-PRICE-WEIGHTED-INVITATIONS-1';
export const V3_FINANCIAL_SNAPSHOT_VERSION = 'V3-FINANCIAL-CALCULATION-1';
export const V3_COMMERCIAL_TERMS_VERSION = 'V3-COMMERCIAL-TERMS-2';
export const V3_METAL_GOODS_CONTRACT_CLASSIFICATION = Object.freeze({
  id: 'V3-WERKLIEFERUNG-METALL-B2B-1',
  contractType: 'werklieferung-movable-metal-goods-purchase-law',
  legalReference: 'BGB § 650 Abs. 1',
  scenarioScope: 'manufacture-and-delivery-of-movable-metal-goods',
  partyScope: 'B2B-simulation',
});
export const V3_D0157_F3_CONDITION = Object.freeze({
  id: 'D-0157-F3',
  responseWindowWorkdays: 5,
  countFrom: 'workday-after-complete-delivery',
  decisionParty: 'customer-or-authorized-recipient',
  timeoutOutcome: 'automatic-customer-side-simulation-acceptance',
  simulationOnly: true,
});
const WEEKDAYS = Object.freeze(['mon', 'tue', 'wed', 'thu', 'fri']);
const clone = value => structuredClone(value);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const snapshotBinding = (snapshot, commercialTerms = null) => ({
  modelVersion: snapshot.modelVersion,
  offerId: snapshot.offerId,
  submittedAt: snapshot.submittedAt,
  netPriceCents: snapshot.netPriceCents,
  costVersion: snapshot.costVersion,
  babVersion: snapshot.babVersion,
  // Preserve an exact canonical replay witness for the complete immutable
  // calculation, including optional planSensitivity provenance. This is an
  // integrity binding across the event/offer mirrors, not an auth signature.
  calculationReplayWitness: stable(snapshot),
  ...(commercialTerms !== null ? { commercialTermsReplayWitness: stable(commercialTerms) } : {}),
});
function validateCommercialTerms(terms, submittedAt) {
  if (!terms || typeof terms !== 'object' || Array.isArray(terms)) throw fail('invalid_commercial_terms', 'commercial terms must be an object');
  const expectedKeys = ['version', 'scope', 'quantity', 'unit', 'qualityTarget', 'acceptanceCriteria', 'deliveryDate', 'contractClassification', 'acceptanceScenario'];
  if (Object.keys(terms).sort().join(',') !== expectedKeys.sort().join(',')) throw fail('invalid_commercial_terms', 'commercial terms have missing or unsupported fields');
  if (terms.version !== V3_COMMERCIAL_TERMS_VERSION) throw fail('invalid_commercial_terms', 'commercial terms version is unsupported');
  if (stable(terms.contractClassification) !== stable(V3_METAL_GOODS_CONTRACT_CLASSIFICATION)) throw fail('invalid_commercial_terms', 'V3 offers must bind the fixed B2B movable-metal-goods Werklieferung classification');
  if (stable(terms.acceptanceScenario) !== stable(V3_D0157_F3_CONDITION)) throw fail('invalid_commercial_terms', 'V3 offers must bind the fixed D-0157 F3 customer-side simulation condition');
  for (const [key, min, max] of [['scope', 8, 500], ['acceptanceCriteria', 8, 500]]) {
    if (typeof terms[key] !== 'string' || terms[key].trim().length < min || terms[key].trim().length > max) throw fail('invalid_commercial_terms', `${key} must contain ${min}–${max} characters`);
  }
  if (!Number.isFinite(terms.quantity) || terms.quantity <= 0 || terms.quantity > 1_000_000) throw fail('invalid_commercial_terms', 'quantity must be positive and at most 1,000,000');
  if (!['pieces', 'sets', 'lots'].includes(terms.unit)) throw fail('invalid_commercial_terms', 'unit must be pieces, sets or lots');
  if (!['basic', 'standard', 'premium'].includes(terms.qualityTarget)) throw fail('invalid_commercial_terms', 'qualityTarget is invalid');
  if (!dateValid(terms.deliveryDate) || terms.deliveryDate < submittedAt) throw fail('invalid_commercial_terms', 'deliveryDate must be a valid date on or after offer submission');
  return terms;
}
function validatePlanSensitivitySnapshot(snapshot) {
  const sensitivity = snapshot?.calculation?.planSensitivity;
  if (sensitivity === undefined) return; // older V3 saves remain readable
  if (!sensitivity || typeof sensitivity !== 'object' || Array.isArray(sensitivity)
    || sensitivity.modelVersion !== 'V3-OFFER-PLAN-SENSITIVITY-1'
    || !['unadjusted', 'apply_l4_plan_indices'].includes(sensitivity.mode)
    || sensitivity.offerPeriod !== snapshot.submittedAt?.slice(0, 7)
    || sensitivity.directFinanceEffect !== false || sensitivity.actualStateChanged !== false
    || !Array.isArray(sensitivity.baseDirectCosts) || !Array.isArray(sensitivity.usedDirectCosts)
    || !Array.isArray(sensitivity.indexes)) throw fail('invalid_market_state', 'offer plan-sensitivity snapshot shape or scope is invalid');
  if (sensitivity.mode === 'unadjusted') {
    if (sensitivity.indexes.length !== 0 || stable(sensitivity.baseDirectCosts) !== stable(sensitivity.usedDirectCosts.map(row => ({ id: row.id, amountCents: row.amountCents, variable: row.variable, category: row.category, basePeriod: row.basePeriod })))) {
      throw fail('invalid_market_state', 'unadjusted offer plan-sensitivity snapshot changes its base costs or carries indexes');
    }
    return;
  }
  if (sensitivity.basePeriod !== '2027-01' || sensitivity.indexes.some(row => !['procurementPlanIndex', 'wagePlanIndex'].includes(row?.target)
    || !Number.isFinite(row.index) || row.index <= 0 || !row.evidence || row.evidence.target !== row.target
    || row.evidence.after !== row.index || row.evidence.before !== 100 || row.evidence.basePeriod !== '2027-01'
    || row.evidence.effectivePeriod !== sensitivity.offerPeriod || row.evidence.status !== 'projected'
    || row.evidence.accountingClass !== 'information_plan' || row.evidence.directFinanceEffect !== false
    || row.evidence.actualStateChanged !== false || !row.evidence.modelVersion
    || !row.evidence.sourceRef || !row.evidence.sourceSnapshotId && !row.evidence.parameterSetId
    || !Array.isArray(row.evidence.componentContributions))) throw fail('invalid_market_state', 'offer plan-sensitivity index evidence is incomplete');
  const targets = sensitivity.indexes.map(row => row.target);
  if (new Set(targets).size !== targets.length) throw fail('invalid_market_state', 'offer plan-sensitivity contains duplicate index targets');
  const procurement = sensitivity.indexes.find(row => row.target === 'procurementPlanIndex');
  const wage = sensitivity.indexes.find(row => row.target === 'wagePlanIndex');
  const baseLineIds = sensitivity.baseDirectCosts.map(row => row?.id);
  if (baseLineIds.some(id => typeof id !== 'string' || !id.trim()) || new Set(baseLineIds).size !== baseLineIds.length) throw fail('invalid_market_state', 'offer plan-sensitivity cost line IDs are missing or duplicated');
  const roundedIndexedCents = (cents, index) => {
    const match = /^(0|[1-9]\d*)(?:\.(\d+))?$/.exec(String(index));
    if (!match) return NaN;
    const scale = 10n ** BigInt((match[2] ?? '').length);
    const numerator = BigInt(cents) * BigInt(match[1] + (match[2] ?? ''));
    const denominator = scale * 100n;
    const result = (numerator * 2n + denominator) / (denominator * 2n);
    return result <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(result) : NaN;
  };
  for (const item of sensitivity.indexes) {
    const rows = item.evidence.componentContributions;
    const ids = rows.map(row => row.componentId).sort();
    if (item.target === 'procurementPlanIndex') {
      if (stable(ids) !== stable(['logistics', 'material']) || !item.evidence.aggregationWeights
        || Object.keys(item.evidence.aggregationWeights).sort().join(',') !== 'logistics,material'
        || Math.abs(item.evidence.aggregationWeights.material + item.evidence.aggregationWeights.logistics - 1) > 1e-10
        || item.evidence.aggregationRuleId !== 'V3-L4-RAW-COMPONENT-INDEX-1') throw fail('invalid_market_state', 'procurement index does not bind material/logistics units, weights, and aggregation rule');
      const expected = rows.reduce((sum, row) => sum + item.evidence.aggregationWeights[row.componentId] * row.componentIndex, 0);
      if (Math.abs(expected - item.index) > 1e-9) throw fail('invalid_market_state', 'procurement index does not match its component indices and weights');
    } else if (stable(ids) !== stable(['wage']) || item.evidence.aggregationWeights?.wage !== 1
      || Math.abs(rows[0]?.componentIndex - item.index) > 1e-9) throw fail('invalid_market_state', 'wage index does not match its wage component');
    for (const row of rows) {
      const expectedUnit = row.componentId === 'material' ? ['EUR/kg']
        : row.componentId === 'logistics' ? ['EUR/shipment', 'EUR/t-km']
          : row.componentId === 'wage' ? ['EUR/h'] : [];
      if (!expectedUnit.includes(row.unit) || !Number.isFinite(row.componentIndex) || row.componentIndex <= 0
        || !row.sourceRef || !['observed', 'synthetic_fixture'].includes(row.sourceType)
        || !Array.isArray(row.driverIds) || row.driverIds.length !== 1
        || row.driverIds[0]?.driverType !== 'raw_component' || row.driverIds[0]?.componentId !== row.componentId
        || row.driverIds[0]?.period !== item.evidence.sourcePeriod
        || row.driverIds[0]?.eventRef !== row.sourceRef && row.driverIds[0]?.eventRef !== item.evidence.sourceRef
        || !row.contributionId || row.driverIds[0]?.contributionId !== row.contributionId) throw fail('invalid_market_state', 'offer plan-sensitivity component source, unit, or driver provenance is invalid');
    }
  }
  const expectedUsed = sensitivity.baseDirectCosts.map((base, index) => {
    const used = sensitivity.usedDirectCosts[index];
    if (!base || typeof base.id !== 'string' || !base.id.trim() || typeof base.variable !== 'boolean'
      || !['material', 'logistics', 'labor', 'other'].includes(base.category)
      || !used || used.id !== base.id || used.variable !== base.variable || used.category !== base.category
      || used.basePeriod !== base.basePeriod || used.baseAmountCents !== base.amountCents
      || !Number.isSafeInteger(base.amountCents) || base.amountCents < 0 || base.basePeriod !== '2027-01') throw fail('invalid_market_state', 'offer plan-sensitivity base and used cost lines are inconsistent');
    const target = base.category === 'labor' ? 'wagePlanIndex'
      : ['material', 'logistics'].includes(base.category) ? 'procurementPlanIndex' : null;
    const indexValue = target === 'wagePlanIndex' ? wage?.index : target === 'procurementPlanIndex' ? procurement?.index : null;
    if (target && !Number.isFinite(indexValue)) throw fail('invalid_market_state', 'offer plan-sensitivity selected index is missing for a classified line');
    if (used.appliedIndexTarget !== target || used.appliedIndex !== indexValue) throw fail('invalid_market_state', 'offer plan-sensitivity line index assignment is inconsistent');
    const expectedAmount = target ? roundedIndexedCents(base.amountCents, indexValue) : base.amountCents;
    if (used.amountCents !== expectedAmount) throw fail('invalid_market_state', 'offer plan-sensitivity line amount does not match the recorded index');
    return { id: base.id, amountCents: used.amountCents, variable: base.variable };
  });
  if (sensitivity.usedDirectCosts.length !== sensitivity.baseDirectCosts.length
    || stable(expectedUsed) !== stable(snapshot.calculation.directCosts.map(({ id, amountCents, variable }) => ({ id, amountCents, variable })))
    || snapshot.calculation.netPriceCents !== snapshot.netPriceCents) throw fail('invalid_market_state', 'offer calculation does not match the frozen plan-sensitivity snapshot or R');
}
const fail = (code, message) => Object.assign(new Error(message), { code });
const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${label} is required`);
};
const finite = (value, label) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
};
const dateValid = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const dateShift = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const dateCmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const monthOf = date => date.slice(0, 7);
const mondayOf = date => {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return dateShift(date, -(day === 0 ? 6 : day - 1));
};
const weekdayIndex = date => (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
const hash32 = text => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
const unit = text => hash32(text) / 4294967296;
const boundedInt = (min, max, key) => min + Math.floor(unit(key) * (max - min + 1));
const clamp01 = value => Math.max(0, Math.min(1, value));
const sumToOne = (weights, label) => {
  if (!weights || typeof weights !== 'object') throw new TypeError(`${label} is required`);
  const values = Object.values(weights);
  if (!values.length || values.some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0) || Math.abs(values.reduce((a, b) => a + b, 0) - 1) > 1e-9) throw new TypeError(`${label} must be nonnegative and sum to 1`);
};
function validateParameters(parameters) {
  if (!parameters || typeof parameters !== 'object') throw new TypeError('market parameters are required');
  if (!parameters.weekdayWeights || WEEKDAYS.some(day => !Number.isFinite(parameters.weekdayWeights[day]) || parameters.weekdayWeights[day] < 0) || Math.abs(WEEKDAYS.reduce((sum, day) => sum + parameters.weekdayWeights[day], 0) - 1) > 1e-9) throw new TypeError('weekdayWeights must provide mon-fri and sum to 1');
  sumToOne(parameters.invitationWeights, 'invitationWeights');
  const invitationWeightKeys = Object.keys(parameters.invitationWeights).sort();
  const legacyInvitationWeightKeys = ['capacity', 'reputation', 'segmentFit'].sort();
  const priceInvitationWeightKeys = ['capacity', 'price', 'reputation', 'segmentFit'].sort();
  if (stable(invitationWeightKeys) !== stable(legacyInvitationWeightKeys) && stable(invitationWeightKeys) !== stable(priceInvitationWeightKeys)) throw new TypeError('invitationWeights keys must be capacity, reputation, segmentFit, optionally including price');
  if (!Number.isFinite(parameters.minimumInvitationScore) || parameters.minimumInvitationScore < 0 || parameters.minimumInvitationScore > 1) throw new TypeError('minimumInvitationScore must be between 0 and 1');
  if (!Number.isInteger(parameters.maximumInvitations) || parameters.maximumInvitations < 1) throw new TypeError('maximumInvitations must be a positive integer');
  for (const key of ['offerWindowCalendarDays', 'customerDecisionDelayCalendarDays']) {
    const range = parameters[key];
    if (!range || !Number.isInteger(range.min) || !Number.isInteger(range.max) || range.min < 1 || range.max < range.min) throw new TypeError(`${key} must be an explicit positive integer range`);
  }
  if (!Number.isInteger(parameters.minimumMonthlyCompetitorSample) || parameters.minimumMonthlyCompetitorSample < 3) throw new TypeError('minimumMonthlyCompetitorSample must be at least 3 independent competitor submissions');
}
function validateFirm(firm, segmentIds) {
  requiredString(firm.firmId, 'firm.firmId');
  if (!['player', 'competitor'].includes(firm.role)) throw new TypeError('firm.role must be player or competitor');
  if (!Number.isFinite(firm.reputation) || firm.reputation < 0 || firm.reputation > 1) throw new TypeError('firm.reputation must be between 0 and 1');
  if (!Number.isFinite(firm.capacityUnits) || firm.capacityUnits < 0) throw new TypeError('firm.capacityUnits must be nonnegative');
  if (!Array.isArray(firm.capabilities) || new Set(firm.capabilities).size !== firm.capabilities.length || firm.capabilities.some(value => typeof value !== 'string' || !value)) throw new TypeError('firm.capabilities must be unique strings');
  if (!firm.segmentFit || segmentIds.some(id => !Number.isFinite(firm.segmentFit[id]) || firm.segmentFit[id] < 0 || firm.segmentFit[id] > 1)) throw new TypeError('firm.segmentFit must provide a 0..1 fit for every segment');
  if (firm.role === 'competitor') {
    if (!firm.offerPriceCentsBySizeClass || typeof firm.offerPriceCentsBySizeClass !== 'object') throw new TypeError('competitors require explicit synthetic offerPriceCentsBySizeClass');
    for (const cents of Object.values(firm.offerPriceCentsBySizeClass)) if (!Number.isSafeInteger(cents) || cents < 0) throw new TypeError('competitor synthetic offer prices must be nonnegative integer cents');
  }
}
function validateState(state) {
  if (!state || state.modelVersion !== V3_MARKET_VERSION || !dateValid(state.startDate) || !dateValid(state.currentDate) || !['closed', 'actions'].includes(state.dayPhase) || !Array.isArray(state.firms) || !Array.isArray(state.segments) || !Array.isArray(state.inquiries) || !Array.isArray(state.negotiations) || !Array.isArray(state.events) || !Array.isArray(state.processedEventIds) || !state.scheduledWeeks || !state.parameters) throw fail('invalid_market_state', 'V3 market state shape is invalid');
  requiredString(state.runId, 'state.runId'); requiredString(state.scenarioId, 'state.scenarioId'); requiredString(state.seed, 'state.seed'); requiredString(state.parameterSetId, 'state.parameterSetId');
  validateParameters(state.parameters);
  if (state.firms.filter(f => f.role === 'player').length !== 1 || state.firms.filter(f => f.role === 'competitor').length < 3 || new Set(state.firms.map(f => f.firmId)).size !== state.firms.length) throw fail('invalid_market_state', 'market state must have one player, at least three competitors, and unique firm IDs');
  const segmentIds = state.segments.map(s => s.segmentId);
  if (!segmentIds.length || new Set(segmentIds).size !== segmentIds.length) throw fail('invalid_market_state', 'market segments must be nonempty and unique');
  for (const firm of state.firms) validateFirm(firm, segmentIds);
  for (const segment of state.segments) {
    requiredString(segment.segmentId, 'segment.segmentId');
    sumToOne(segment.decisionWeights, `segment ${segment.segmentId} decisionWeights`);
    if (stable(Object.keys(segment.decisionWeights).sort()) !== stable(['price', 'reputation', 'segmentFit'].sort())) throw fail('invalid_market_state', 'decisionWeights keys must be price, reputation, segmentFit');
  }
  if (state.processedEventIds.some(id => typeof id !== 'string' || !id) || new Set(state.processedEventIds).size !== state.processedEventIds.length) throw fail('invalid_market_state', 'processed event IDs are invalid');
  if (state.events.length !== state.processedEventIds.length || state.events.some((event, index) => event.eventId !== state.processedEventIds[index])) throw fail('invalid_market_state', 'market event log and idempotency index disagree');
  const eventById = new Map(state.events.map(event => [event.eventId, event]));
  const inquiryById = new Map();
  const inquiryCountsById = new Map();
  for (const inquiry of state.inquiries) {
    inquiryCountsById.set(inquiry.inquiryId, (inquiryCountsById.get(inquiry.inquiryId) ?? 0) + 1);
    if (!inquiryById.has(inquiry.inquiryId)) inquiryById.set(inquiry.inquiryId, inquiry);
  }
  const negotiationsByInquiry = new Map();
  for (const negotiation of state.negotiations) {
    const rows = negotiationsByInquiry.get(negotiation.inquiryId) ?? [];
    rows.push(negotiation);
    negotiationsByInquiry.set(negotiation.inquiryId, rows);
  }
  const negotiationEvents = new Map();
  for (const event of state.events) {
    if (!event.negotiationId) continue;
    const key = `${event.type}|${event.negotiationId}`;
    const rows = negotiationEvents.get(key) ?? [];
    rows.push(event);
    negotiationEvents.set(key, rows);
  }
  if (typeof state.scheduledWeeks !== 'object' || Array.isArray(state.scheduledWeeks)) throw fail('invalid_market_state', 'scheduled week history is invalid');
  const scheduleEvents = state.events.filter(event => event.type === 'schedule_week');
  const scheduledWeekKeys = Object.keys(state.scheduledWeeks);
  if (scheduleEvents.length !== scheduledWeekKeys.length) throw fail('invalid_market_state', 'scheduled week history and schedule event log disagree');
  const expectedInquiryIds = new Set();
  for (const weekStart of scheduledWeekKeys) {
    const templatesJson = state.scheduledWeeks[weekStart];
    const weekEventId = eventId(state, 'schedule_week', weekStart);
    const scheduleEvent = eventById.get(weekEventId);
    if (!dateValid(weekStart) || mondayOf(weekStart) !== weekStart || typeof templatesJson !== 'string' || !scheduleEvent || scheduleEvent.type !== 'schedule_week' || scheduleEvent.eventKey !== weekStart || scheduleEvent.payload?.weekStart !== weekStart || stable(scheduleEvent.payload?.templates) !== templatesJson) {
      throw fail('invalid_market_state', 'scheduled week is missing its matching schedule event or template payload');
    }
    const templates = scheduleEvent.payload.templates;
    if (!Array.isArray(templates) || !templates.length || !Array.isArray(scheduleEvent.result?.scheduledInquiryIds)) throw fail('invalid_market_state', 'scheduled week event payload or result is invalid');
    const demandTraces = templates.map(template => template?.macroDemand).filter(Boolean);
    if (demandTraces.length) {
      if (demandTraces.length !== templates.length || demandTraces.some(trace => stable(trace) !== stable(demandTraces[0]))) throw fail('invalid_market_state', 'weekly macro-demand trace is missing or inconsistent');
      try { validateV3MacroDemandTrace(demandTraces[0], { seed: state.seed, runId: state.runId, scenarioId: state.scenarioId, weekStart }); }
      catch { throw fail('invalid_market_state', 'weekly macro-demand trace is invalid or not replayable'); }
      if (demandTraces[0].realizedInquiryCount !== templates.length) throw fail('invalid_market_state', 'weekly macro-demand result does not match inquiry templates');
    }
    const expectedForWeek = templates.map((template, index) => `INQ|${state.modelVersion}|${encodeURIComponent(state.scenarioId)}|${encodeURIComponent(state.runId)}|${encodeURIComponent(state.seed)}|${weekStart}|${encodeURIComponent(template.templateId)}|${index}`);
    if (new Set(expectedForWeek).size !== expectedForWeek.length || stable(scheduleEvent.result.scheduledInquiryIds) !== stable(expectedForWeek)) throw fail('invalid_market_state', 'scheduled inquiry identities do not match the recorded templates');
    for (let index = 0; index < templates.length; index += 1) {
      const template = templates[index];
      if (!template || typeof template !== 'object' || !Number.isSafeInteger(template.referencePriceCents) || template.referencePriceCents <= 0) {
        throw fail('invalid_market_state', 'scheduled inquiry reference price must be a positive safe integer number of cents');
      }
      const inquiryId = expectedForWeek[index];
      if (expectedInquiryIds.has(inquiryId)) throw fail('invalid_market_state', 'scheduled inquiry identity is duplicated');
      expectedInquiryIds.add(inquiryId);
      const inquiry = inquiryById.get(inquiryId);
      if (inquiryCountsById.get(inquiryId) !== 1 || !inquiry || !Number.isSafeInteger(inquiry.referencePriceCents) || inquiry.referencePriceCents <= 0 || inquiry.templateId !== template.templateId || inquiry.customerId !== template.customerId || inquiry.sizeClass !== template.sizeClass || inquiry.segmentId !== template.segmentId || inquiry.referencePriceCents !== template.referencePriceCents || inquiry.macroPeriod !== template.macroPeriod || inquiry.requiredCapacity !== template.requiredCapacity || stable(inquiry.requiredCapabilities) !== stable(template.requiredCapabilities) || inquiry.receivedAt < weekStart || inquiry.receivedAt > dateShift(weekStart, 4) || weekdayIndex(inquiry.receivedAt) > 4) {
        throw fail('invalid_market_state', 'scheduled inquiry is missing, duplicated, or inconsistent with its template');
      }
    }
  }
  if (state.inquiries.length !== expectedInquiryIds.size || state.inquiries.some(inquiry => !expectedInquiryIds.has(inquiry.inquiryId)) || new Set(state.inquiries.map(inquiry => inquiry.inquiryId)).size !== state.inquiries.length) throw fail('invalid_market_state', 'inquiry history does not match the scheduled week history');
  const playerFirmId = state.firms.find(firm => firm.role === 'player').firmId;
  for (const inquiry of state.inquiries) {
    if (!['scheduled', 'open', 'resolved', 'expired'].includes(inquiry.status) || !dateValid(inquiry.receivedAt) || !dateValid(inquiry.expiresAt) || inquiry.expiresAt < inquiry.receivedAt) throw fail('invalid_market_state', 'inquiry lifecycle data is invalid');
    const inquiryNegotiations = negotiationsByInquiry.get(inquiry.inquiryId) ?? [];
    const unresolvedNegotiation = inquiryNegotiations.some(row => ['countered', 'response_submitted'].includes(row.status));
    if (inquiry.status === 'open' && inquiry.expiresAt < state.currentDate && !unresolvedNegotiation) throw fail('invalid_market_state', 'open inquiry remains past expiry without an active counter negotiation');
    if (inquiry.status === 'resolved' && (!inquiry.decisionId || !dateValid(inquiry.decidedAt) || !inquiry.winnerFirmId || !inquiry.winningOfferId)) throw fail('invalid_market_state', 'resolved inquiry decision identity is incomplete');
    if (inquiry.status === 'expired' && !inquiry.expirationEventId) throw fail('invalid_market_state', 'expired inquiry lacks its expiration event ID');
    for (const offer of inquiry.offers) {
      if (!['submitted', 'accepted', 'declined', 'expired', 'superseded'].includes(offer.status) || !dateValid(offer.submittedAt) || !dateValid(offer.decisionAt) || !Number.isSafeInteger(offer.netPriceCents) || offer.netPriceCents < 0) throw fail('invalid_market_state', 'offer lifecycle data is invalid');
      if (offer.status === 'superseded' && offer.firmId !== playerFirmId) throw fail('invalid_market_state', 'only player offer revisions may supersede an earlier offer');
      if (offer.commercialTerms !== undefined) validateCommercialTerms(offer.commercialTerms, offer.submittedAt);
      if (offer.firmId === playerFirmId) {
        const source = eventById.get(offer.submittedEventId);
        const expectedBinding = snapshotBinding(offer.calculationSnapshot, offer.commercialTerms ?? null);
        validatePlanSensitivitySnapshot(offer.calculationSnapshot);
        if (!source || !['submit_offer', 'submit_counter_response'].includes(source.type) || source.payload.inquiryId !== inquiry.inquiryId || source.payload.firmId !== offer.firmId || stable(source.payload.calculationSnapshot) !== stable(offer.calculationSnapshot) || stable(source.payload.commercialTerms ?? null) !== stable(offer.commercialTerms ?? null) || stable(source.result?.snapshotBinding) !== stable(expectedBinding) || offer.netPriceCents !== offer.calculationSnapshot.netPriceCents) throw fail('invalid_market_state', 'submitted offer snapshot does not match its immutable submission event binding');
      }
    }
    const activeFirmOffers = new Set();
    for (const offer of inquiry.offers.filter(row => row.status === 'submitted')) {
      if (activeFirmOffers.has(offer.firmId)) throw fail('invalid_market_state', 'a firm may have only one active offer for an inquiry');
      activeFirmOffers.add(offer.firmId);
    }
  }
  const negotiationIds = new Set();
  for (const negotiation of state.negotiations) {
    const inquiry = inquiryById.get(negotiation.inquiryId);
    const original = inquiry?.offers.find(row => row.offerId === negotiation.originalOfferId && row.firmId === playerFirmId);
    const source = original && eventById.get(original.submittedEventId);
    const limits = inquiry ? negotiationLimits(state, inquiry) : null;
    if (!negotiation || !inquiry || !original || !source || source.type !== 'submit_offer' || source.eventId !== original.submittedEventId || negotiation.negotiationId !== eventId(state, 'customer_negotiation', negotiation.originalOfferId) || negotiationIds.has(negotiation.negotiationId) || negotiation.playerFirmId !== playerFirmId || negotiation.referencePriceCents !== limits.referencePriceCents || negotiation.segmentPriceWeight !== limits.segmentPriceWeight || negotiation.acceptancePriceCents !== limits.acceptanceCents || negotiation.maximumPriceCents !== limits.maximumCents || negotiation.initialPlayerPriceCents !== original.netPriceCents || !['countered', 'response_submitted', 'accepted', 'rejected', 'expired', 'rejected_above_max'].includes(negotiation.status)) throw fail('invalid_market_state', 'customer negotiation record is invalid or not bound to its original offer and thresholds');
    negotiationIds.add(negotiation.negotiationId);
    const issuedEvent = negotiationEvents.get(`${negotiation.status === 'rejected_above_max' ? 'customer_offer_rejected_above_max' : 'customer_counteroffer_issued'}|${negotiation.negotiationId}`)?.[0];
    if (!issuedEvent || issuedEvent.payload?.originalOfferId !== negotiation.originalOfferId || issuedEvent.payload?.acceptancePriceCents !== negotiation.acceptancePriceCents || issuedEvent.payload?.maximumPriceCents !== negotiation.maximumPriceCents) throw fail('invalid_market_state', 'customer negotiation lacks its separate immutable issue/rejection event');
    if (negotiation.status === 'countered' || negotiation.status === 'expired') {
      if (!(original.netPriceCents > negotiation.acceptancePriceCents && original.netPriceCents <= negotiation.maximumPriceCents) || negotiation.counterPriceCents !== negotiation.acceptancePriceCents || !dateValid(negotiation.counteredAt) || negotiation.responseDueAt !== dateShift(negotiation.counteredAt, 3) || negotiation.responseOfferId != null || negotiation.responseSubmittedAt != null || negotiation.decisionAt != null) throw fail('invalid_market_state', 'counteroffer window or thresholds are invalid');
      if (negotiation.status === 'countered' && original.status !== 'submitted') throw fail('invalid_market_state', 'open counteroffer must retain its original offer pending player response');
      if (negotiation.status === 'expired' && (original.status !== 'declined' || state.currentDate <= negotiation.responseDueAt)) throw fail('invalid_market_state', 'expired counteroffer is not past its response window');
      if (negotiation.status === 'expired' && !(negotiationEvents.get(`customer_counteroffer_expired|${negotiation.negotiationId}`) ?? []).some(event => event.payload?.responseDueAt === negotiation.responseDueAt)) throw fail('invalid_market_state', 'expired counteroffer lacks its immutable expiry event');
    } else if (negotiation.status === 'rejected_above_max') {
      if (original.netPriceCents <= negotiation.maximumPriceCents || negotiation.counterPriceCents != null || negotiation.responseDueAt != null || negotiation.responseOfferId != null || original.status !== 'declined') throw fail('invalid_market_state', 'above-maximum quote rejection is inconsistent');
    } else {
      const response = inquiry.offers.find(row => row.offerId === negotiation.responseOfferId && row.firmId === playerFirmId);
      const responseSource = response && eventById.get(response.submittedEventId);
      const responseEvent = negotiationEvents.get(`player_counter_response_submitted|${negotiation.negotiationId}`)?.[0];
      if (!(original.netPriceCents > negotiation.acceptancePriceCents && original.netPriceCents <= negotiation.maximumPriceCents) || original.status !== 'superseded' || !response || !responseSource || responseSource.type !== 'submit_counter_response' || responseSource.payload?.negotiationId !== negotiation.negotiationId || response.submittedAt !== negotiation.responseSubmittedAt || response.decisionAt !== negotiation.decisionAt || response.submittedAt > negotiation.responseDueAt || response.commercialTerms !== undefined && stable(response.commercialTerms) !== stable(original.commercialTerms ?? null) || !responseEvent || responseEvent.payload?.responseOfferId !== response.offerId || responseEvent.result?.offerId !== response.offerId) throw fail('invalid_market_state', 'counter-response offer is missing, late, or changes the offered scope');
      if (negotiation.status === 'response_submitted' && (response.status !== 'submitted' || response.netPriceCents >= negotiation.acceptancePriceCents || !dateValid(negotiation.decisionAt) || negotiation.decisionAt < dateShift(negotiation.responseSubmittedAt, 1) || negotiation.decisionAt > dateShift(negotiation.responseSubmittedAt, 3))) throw fail('invalid_market_state', 'pending counter-response decision timing or below-counter price is invalid');
      if (negotiation.status === 'accepted' && (response.status !== 'accepted' || response.netPriceCents > negotiation.acceptancePriceCents || inquiry.status !== 'resolved' || inquiry.winningOfferId !== response.offerId || !(response.netPriceCents === negotiation.acceptancePriceCents ? negotiation.decidedAt === negotiation.responseSubmittedAt : negotiation.decidedAt > negotiation.responseSubmittedAt && negotiation.decidedAt === negotiation.decisionAt))) throw fail('invalid_market_state', 'accepted counter-response does not match the exact or delayed-below customer counterprice decision');
      if (negotiation.status === 'rejected' && response.status !== 'declined') throw fail('invalid_market_state', 'rejected counter-response offer is not declined');
      if (['accepted', 'rejected'].includes(negotiation.status) && (!dateValid(negotiation.decidedAt) || negotiation.decidedAt !== negotiation.decisionAt || !(negotiationEvents.get(`customer_counter_response_decided|${negotiation.negotiationId}`) ?? []).some(event => event.payload?.responseOfferId === response.offerId && event.payload?.decisionAt === negotiation.decidedAt))) throw fail('invalid_market_state', 'final counter-response decision lacks its immutable event/date');
    }
  }
  for (const inquiry of state.inquiries) {
    const playerOffers = inquiry.offers.filter(offer => offer.firmId === playerFirmId);
    if (playerOffers.some(offer => offer.netPriceCents > negotiationLimits(state, inquiry).acceptanceCents)
      && playerOffers.some(offer => offer.netPriceCents <= negotiationLimits(state, inquiry).maximumCents)
      && !negotiationsByInquiry.has(inquiry.inquiryId)) throw fail('invalid_market_state', 'counter-range player offer has no negotiation record');
    if ((negotiationsByInquiry.get(inquiry.inquiryId) ?? []).length > 1) throw fail('invalid_market_state', 'an inquiry may have only one customer counteroffer round');
  }
  return true;
}
function eventId(state, type, key) { return `VM|${state.modelVersion}|${encodeURIComponent(state.scenarioId)}|${encodeURIComponent(state.runId)}|${encodeURIComponent(state.seed)}|${type}|${encodeURIComponent(key)}`; }
export function createV3MarketOfferId(state, submissionEventId) {
  validateState(state); requiredString(submissionEventId, 'submissionEventId');
  return `OFF|${encodeURIComponent(state.scenarioId)}|${encodeURIComponent(state.runId)}|${encodeURIComponent(submissionEventId)}`;
}
function addEvent(state, event) { state.events.push(event); state.processedEventIds.push(event.eventId); }
function transaction(state, eventKey, payload, change) {
  validateState(state);
  const id = eventId(state, payload.type, eventKey);
  const existing = state.events.find(event => event.eventId === id);
  if (existing) {
    if (stable(existing.payload) !== stable(payload)) throw fail('market_event_payload_conflict', 'event ID already exists with different payload');
    return { ok: true, duplicate: true, state: clone(state), result: clone(existing.result) };
  }
  const next = clone(state);
  const result = change(next, id);
  if (result?.ok === false) return result;
  addEvent(next, { eventId: id, type: payload.type, eventKey, occurredAt: payload.occurredAt, payload: clone(payload), result: clone(result ?? null) });
  validateState(next);
  return { ok: true, duplicate: false, state: next, result: clone(result ?? null) };
}
function chooseWeekday(state, weekStart, index, count, earliestDate) {
  const candidates = WEEKDAYS.map((day, weekday) => ({ date: dateShift(weekStart, weekday), weight: state.parameters.weekdayWeights[day] })).filter(item => item.date >= earliestDate);
  const weights = candidates.map(item => item.weight);
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new TypeError('no weighted workday remains in the scheduled week');
  const offset = unit(`${state.seed}|${state.scenarioId}|${weekStart}|weekday-offset`);
  const target = ((offset + index) * total / count) % total;
  let acc = 0;
  const selected = weights.findIndex(weight => { acc += weight; return target < acc; });
  return candidates[Math.max(0, selected)].date;
}
function rankEligibleFirms(state, template) {
  const weights = state.parameters.invitationWeights;
  return state.firms.filter(firm => firm.capacityUnits >= template.requiredCapacity && template.requiredCapabilities.every(cap => firm.capabilities.includes(cap)))
    .map(firm => {
      const capacity = template.requiredCapacity === 0 ? 1 : firm.capacityUnits / (firm.capacityUnits + template.requiredCapacity);
      const segmentFit = firm.segmentFit[template.segmentId];
      // Optional explicit price term for V3 market profiles. The player has no price before submitting an offer, so the published inquiry reference price is its neutral invitation estimate; competitors use only their explicit synthetic size-class price.
      const competitorPrice = firm.role === 'competitor' ? firm.offerPriceCentsBySizeClass[template.sizeClass] : template.referencePriceCents;
      const price = Number.isSafeInteger(competitorPrice) && competitorPrice >= 0
        ? clamp01((2 * template.referencePriceCents) / (template.referencePriceCents + competitorPrice)) : 0;
      const score = weights.reputation * firm.reputation + weights.capacity * capacity + weights.segmentFit * segmentFit + (weights.price ?? 0) * price;
      return weights.price === undefined ? { firmId: firm.firmId, score } : { firmId: firm.firmId, score, priceScore: price };
    })
    .filter(row => row.score >= state.parameters.minimumInvitationScore)
    .sort((a, b) => b.score - a.score || a.firmId.localeCompare(b.firmId))
    .slice(0, state.parameters.maximumInvitations);
}
/** Create serializable market state. All behavioral coefficients and prices are explicit scenario inputs. */
export function createV3MarketState(profile) {
  if (!profile || typeof profile !== 'object') throw new TypeError('market scenario profile is required');
  for (const key of ['runId', 'scenarioId', 'seed', 'parameterSetId']) requiredString(profile[key], `profile.${key}`);
  if (!dateValid(profile.startDate)) throw new TypeError('profile.startDate must be a valid ISO date');
  validateParameters(profile.parameters);
  const segmentIds = (profile.segments ?? []).map(s => s.segmentId);
  if (!Array.isArray(profile.firms)) throw new TypeError('profile.firms are required');
  for (const firm of profile.firms) validateFirm(firm, segmentIds);
  const state = {
    modelVersion: V3_MARKET_VERSION, runId: profile.runId, scenarioId: profile.scenarioId, seed: String(profile.seed), parameterSetId: profile.parameterSetId,
    startDate: profile.startDate, currentDate: dateShift(profile.startDate, -1), dayPhase: 'closed', parameters: clone(profile.parameters),
    segments: clone(profile.segments), firms: clone(profile.firms), inquiries: [], negotiations: [], events: [], processedEventIds: [], scheduledWeeks: {},
    monthlyCompetitorOffers: {}
  };
  validateState(state);
  return state;
}

/** Schedule one workweek of synthetic inquiries. Template values and all prices/weights are explicit inputs. */
export function scheduleV3MarketWeek(state, { weekStart, templates }) {
  try {
    validateState(state);
    if (!dateValid(weekStart) || mondayOf(weekStart) !== weekStart) throw new TypeError('weekStart must be a Monday ISO date');
    const earliestDate = state.currentDate >= state.startDate ? dateShift(state.currentDate, 1) : state.startDate;
    if (state.dayPhase !== 'closed' || dateShift(weekStart, 4) < earliestDate || weekStart < mondayOf(state.startDate)) throw fail('market_week_in_past', 'cannot schedule an elapsed or active market week');
    if (!Array.isArray(templates) || !templates.length) throw new TypeError('at least one explicit demand template is required');
    const weekKey = weekStart;
    const payload = { type: 'schedule_week', occurredAt: weekStart, weekStart, templates };
    return transaction(state, weekKey, payload, (next, id) => {
      const newInquiryIds = templates.map((template, index) => `INQ|${next.modelVersion}|${encodeURIComponent(next.scenarioId)}|${encodeURIComponent(next.runId)}|${encodeURIComponent(next.seed)}|${weekStart}|${encodeURIComponent(template.templateId)}|${index}`);
      const existingInquiryIds = new Set(next.inquiries.map(inquiry => inquiry.inquiryId));
      if (newInquiryIds.some(inquiryId => existingInquiryIds.has(inquiryId)) || new Set(newInquiryIds).size !== newInquiryIds.length) throw fail('duplicate_market_inquiry_id', 'weekly schedule would create an inquiry identity that already exists');
      for (let i = 0; i < templates.length; i += 1) {
        const template = templates[i];
        requiredString(template.templateId, 'template.templateId'); requiredString(template.customerId, 'template.customerId');
        requiredString(template.segmentId, 'template.segmentId'); requiredString(template.sizeClass, 'template.sizeClass'); requiredString(template.macroPeriod, 'template.macroPeriod');
        if (!next.segments.some(segment => segment.segmentId === template.segmentId)) throw new TypeError(`unknown segment ${template.segmentId}`);
        if (!Array.isArray(template.requiredCapabilities) || template.requiredCapabilities.some(value => typeof value !== 'string' || !value)) throw new TypeError('requiredCapabilities must be strings');
        if (!Number.isFinite(template.requiredCapacity) || template.requiredCapacity < 0) throw new TypeError('requiredCapacity must be nonnegative');
        if (!Number.isSafeInteger(template.referencePriceCents) || template.referencePriceCents <= 0) throw new TypeError('referencePriceCents must be positive integer cents');
        const receivedAt = chooseWeekday(next, weekStart, i, templates.length, earliestDate);
        const openDays = boundedInt(next.parameters.offerWindowCalendarDays.min, next.parameters.offerWindowCalendarDays.max, `${next.seed}|${weekStart}|offer-window|${i}`);
        const inquiryId = `INQ|${next.modelVersion}|${encodeURIComponent(next.scenarioId)}|${encodeURIComponent(next.runId)}|${encodeURIComponent(next.seed)}|${weekStart}|${encodeURIComponent(template.templateId)}|${i}`;
        const invited = rankEligibleFirms(next, template);
        const inquiry = { inquiryId, templateId: template.templateId, customerId: template.customerId, receivedAt, expiresAt: dateShift(receivedAt, openDays), sizeClass: template.sizeClass, segmentId: template.segmentId, requiredCapabilities: clone(template.requiredCapabilities), requiredCapacity: template.requiredCapacity, referencePriceCents: template.referencePriceCents, macroPeriod: template.macroPeriod, invitedFirmIds: invited.map(row => row.firmId), invitationScores: invited, status: 'scheduled', offers: [], decisionAtByOfferId: {}, decisionId: null, decidedAt: null, expirationEventId: null, winnerFirmId: null, winningOfferId: null };
        next.inquiries.push(inquiry);
      }
      next.scheduledWeeks[weekStart] = stable(templates);
      const result = { scheduledInquiryIds: next.inquiries.filter(item => item.receivedAt >= weekStart && item.receivedAt <= dateShift(weekStart, 4)).map(item => item.inquiryId), macroDemand: templates[0]?.macroDemand ? clone(templates[0].macroDemand) : null };
      return result;
    });
  } catch (error) { return { ok: false, error: { code: error.code ?? 'invalid_market_input', message: error.message } }; }
}

function scoreOffer(state, inquiry, offer) {
  const firm = state.firms.find(row => row.firmId === offer.firmId);
  const segment = state.segments.find(row => row.segmentId === inquiry.segmentId);
  const fit = firm.segmentFit[inquiry.segmentId];
  const weights = segment.decisionWeights;
  // Score independently against the customer's explicit reference price.
  // This makes a sufficiently competitive player offer capable of overcoming
  // a stronger incumbent reputation/fit while keeping both quality criteria
  // meaningful; min/max normalization across bidders could make that impossible.
  const priceScore = (2 * inquiry.referencePriceCents) / (inquiry.referencePriceCents + offer.netPriceCents);
  return { score: weights.price * priceScore + weights.reputation * firm.reputation + weights.segmentFit * fit, priceScore, reputation: firm.reputation, segmentFit: fit };
}
function negotiationLimits(state, inquiry) {
  const segment = state.segments.find(row => row.segmentId === inquiry.segmentId);
  const weight = segment?.decisionWeights?.price;
  if (!Number.isFinite(weight) || weight < 0 || weight > 1) throw fail('invalid_negotiation_weight', 'D-0184 requires the segment price weight in [0,1]');
  const representableMaximum = Number.MAX_SAFE_INTEGER;
  const acceptanceCents = Math.min(representableMaximum, Math.round(inquiry.referencePriceCents * (1 + (1 - weight) * 0.10)));
  const maximumCents = Math.min(representableMaximum, Math.round(inquiry.referencePriceCents * (1 + (1 - weight) * 0.25)));
  if (!Number.isSafeInteger(acceptanceCents) || !Number.isSafeInteger(maximumCents) || acceptanceCents < inquiry.referencePriceCents || maximumCents < acceptanceCents) throw fail('invalid_negotiation_limits', 'negotiation thresholds must stay ordered within representable safe-integer cents');
  return { referencePriceCents: inquiry.referencePriceCents, segmentPriceWeight: weight, acceptanceCents, maximumCents };
}
function appendNegotiationEvent(state, { type, negotiation, occurredAt, eventKey, payload, result }) {
  const id = eventId(state, type, eventKey);
  if (state.events.some(event => event.eventId === id)) throw fail('duplicate_negotiation_event', `duplicate negotiation event ${id}`);
  addEvent(state, { eventId: id, type, eventKey, occurredAt, payload: clone(payload), result: clone(result), negotiationId: negotiation.negotiationId });
  return id;
}
function resolveInquiry(next, inquiry, date, id) {
  const activeOffers = inquiry.offers.filter(offer => offer.status === 'submitted' && offer.submittedAt <= date);
  if (!activeOffers.length || activeOffers.some(offer => offer.decisionAt > date)) return null;
  const eligibleOffers = activeOffers
    .map(offer => ({ offer, evaluation: scoreOffer(next, inquiry, offer) }))
    .sort((a, b) => b.evaluation.score - a.evaluation.score || a.offer.firmId.localeCompare(b.offer.firmId) || a.offer.offerId.localeCompare(b.offer.offerId));
  if (!eligibleOffers.length) return null;
  const winner = eligibleOffers[0];
  for (const { offer } of eligibleOffers) offer.status = offer.offerId === winner.offer.offerId ? 'accepted' : 'declined';
  const decisionId = eventId(next, 'customer_decision', inquiry.inquiryId);
  inquiry.status = 'resolved'; inquiry.decisionId = decisionId; inquiry.decidedAt = date; inquiry.winnerFirmId = winner.offer.firmId; inquiry.winningOfferId = winner.offer.offerId;
  for (const offer of inquiry.offers) if (offer.status === 'submitted') offer.status = 'declined';
  return { inquiryId: inquiry.inquiryId, decisionId, winnerFirmId: inquiry.winnerFirmId, winningOfferId: inquiry.winningOfferId, acceptedAt: date, decisionEventId: id };
}

/** Process a single calendar date: due customer decisions, same-day expiry, then newly received inquiries. */
export function advanceV3MarketDay(state, date) {
  try {
    validateState(state);
    if (!dateValid(date)) throw new TypeError('date must be a valid ISO date');
    const payload = { type: 'advance_day', occurredAt: date, date };
    return transaction(state, date, payload, (next, id) => {
      const expected = dateShift(next.currentDate, 1);
      if (date !== expected) throw fail('non_sequential_market_date', `expected ${expected}`);
      if (next.dayPhase !== 'closed') throw fail('market_day_not_closed', 'close the previous market day before advancing');
      const decisions = [];
      for (const inquiry of next.inquiries) {
        if (inquiry.status !== 'open') continue;
        const negotiation = next.negotiations.find(row => row.inquiryId === inquiry.inquiryId && ['countered', 'response_submitted'].includes(row.status));
        if (negotiation?.status === 'countered' && date > negotiation.responseDueAt) {
          negotiation.status = 'expired'; negotiation.decidedAt = date;
          const original = inquiry.offers.find(row => row.offerId === negotiation.originalOfferId); original.status = 'declined';
          appendNegotiationEvent(next, { type: 'customer_counteroffer_expired', negotiation, occurredAt: date, eventKey: `${negotiation.negotiationId}|expired`, payload: { negotiationId: negotiation.negotiationId, inquiryId: inquiry.inquiryId, responseDueAt: negotiation.responseDueAt }, result: { status: 'expired', decision: 'no_response', contractCreated: false, financialEffect: 'none' } });
          decisions.push({ inquiryId: inquiry.inquiryId, negotiationId: negotiation.negotiationId, decision: 'counter_expired', acceptedAt: null });
        } else if (negotiation?.status === 'response_submitted' && negotiation.decisionAt <= date) {
          const response = inquiry.offers.find(row => row.offerId === negotiation.responseOfferId);
          const accepted = response.netPriceCents <= negotiation.acceptancePriceCents;
          negotiation.status = accepted ? 'accepted' : 'rejected'; negotiation.decidedAt = date;
          response.status = accepted ? 'accepted' : 'declined';
          let decision = { inquiryId: inquiry.inquiryId, negotiationId: negotiation.negotiationId, decision: accepted ? 'accept_counter_response' : 'reject_counter_response', responseOfferId: response.offerId, acceptedAt: date, contractCreated: false };
          if (accepted) {
            for (const offer of inquiry.offers) if (offer.offerId !== response.offerId && offer.status === 'submitted') offer.status = 'declined';
            const decisionId = eventId(next, 'customer_decision', inquiry.inquiryId);
            inquiry.status = 'resolved'; inquiry.decisionId = decisionId; inquiry.decidedAt = date; inquiry.winnerFirmId = negotiation.playerFirmId; inquiry.winningOfferId = response.offerId;
            decision = { ...decision, decisionId, winnerFirmId: negotiation.playerFirmId, winningOfferId: response.offerId, decisionEventId: `${id}|decision|${inquiry.inquiryId}`, contractCreated: true };
          }
          appendNegotiationEvent(next, { type: 'customer_counter_response_decided', negotiation, occurredAt: date, eventKey: `${negotiation.negotiationId}|decision`, payload: { negotiationId: negotiation.negotiationId, responseOfferId: response.offerId, decisionAt: date }, result: { ...decision, financialEffect: 'none' } });
          decisions.push(decision);
        }
        if (inquiry.status !== 'open') continue;
        const stillPendingNegotiation = next.negotiations.some(row => row.inquiryId === inquiry.inquiryId && ['countered', 'response_submitted'].includes(row.status));
        if (stillPendingNegotiation) continue;
        const due = inquiry.offers.some(offer => offer.status === 'submitted' && offer.decisionAt <= date && offer.submittedAt <= date);
        if (due) decisions.push(resolveInquiry(next, inquiry, date, `${id}|decision|${inquiry.inquiryId}`));
      }
      const receivedInquiryIds = [];
      for (const inquiry of next.inquiries) {
        if (inquiry.status === 'scheduled' && inquiry.receivedAt <= date) {
          inquiry.status = 'open'; receivedInquiryIds.push(inquiry.inquiryId);
          for (const firmId of inquiry.invitedFirmIds) {
            const firm = next.firms.find(row => row.firmId === firmId);
            if (firm.role !== 'competitor') continue;
            const cents = firm.offerPriceCentsBySizeClass[inquiry.sizeClass];
            if (!Number.isSafeInteger(cents)) continue;
            const competitorOfferId = `C-OFF|${inquiry.inquiryId}|${firm.firmId}`;
            const decisionDelay = boundedInt(next.parameters.customerDecisionDelayCalendarDays.min, next.parameters.customerDecisionDelayCalendarDays.max, `${next.seed}|${inquiry.inquiryId}|decision-delay|${firm.firmId}`);
            const offer = { offerId: competitorOfferId, firmId: firm.firmId, submittedAt: date, decisionAt: dateShift(date, decisionDelay), status: 'submitted', netPriceCents: cents, calculationSnapshot: { snapshotId: `SYNTHETIC-COMP|${next.parameterSetId}|${inquiry.sizeClass}`, netPriceCents: cents, simTaxIncluded: false, snapshotType: 'synthetic_competitor_offer' } };
            inquiry.offers.push(offer); inquiry.decisionAtByOfferId[competitorOfferId] = offer.decisionAt;
            const month = monthOf(date);
            (next.monthlyCompetitorOffers[month] ??= []).push({ inquiryId: inquiry.inquiryId, sizeClass: inquiry.sizeClass, firmId: firm.firmId, netPlanPriceCents: cents, submittedAt: date, offerId: competitorOfferId });
          }
        }
      }
      next.currentDate = date; next.dayPhase = 'actions';
      return { decisions, receivedInquiryIds };
    });
  } catch (error) { return { ok: false, error: { code: error.code ?? 'invalid_market_input', message: error.message } }; }
}

/** End-of-day phase: expiry runs after player actions and after the decision phase for this date. */
export function closeV3MarketDay(state, date) {
  try {
    validateState(state);
    if (!dateValid(date)) throw new TypeError('date must be a valid ISO date');
    const payload = { type: 'close_day', occurredAt: date, date };
    return transaction(state, date, payload, (next, id) => {
      if (next.dayPhase !== 'actions' || next.currentDate !== date) throw fail('market_day_not_open', 'market day is not in its action phase');
      const expiredInquiryIds = [];
      for (const inquiry of next.inquiries) {
        const hasPendingCounter = next.negotiations.some(row => row.inquiryId === inquiry.inquiryId && ['countered', 'response_submitted'].includes(row.status));
        if (inquiry.status === 'open' && inquiry.expiresAt <= date && !hasPendingCounter) {
          inquiry.status = 'expired'; inquiry.expirationEventId = eventId(next, 'inquiry_expired', inquiry.inquiryId); expiredInquiryIds.push(inquiry.inquiryId);
          for (const offer of inquiry.offers) if (offer.status === 'submitted') offer.status = 'expired';
        }
      }
      next.dayPhase = 'closed';
      return { expiredInquiryIds };
    });
  } catch (error) { return { ok: false, error: { code: error.code ?? 'invalid_market_input', message: error.message } }; }
}

/** Submit the player or a test competitor offer. A03's calculation snapshot is copied and never recalculated here. */
export function submitV3MarketOffer(state, { eventId: suppliedEventId, inquiryId, firmId, submittedAt, calculationSnapshot, commercialTerms = null }) {
  try {
    validateState(state);
    for (const [key, value] of Object.entries({ suppliedEventId, inquiryId, firmId })) requiredString(value, key);
    if (!dateValid(submittedAt)) throw new TypeError('submittedAt must be a valid ISO date');
    if (!calculationSnapshot || typeof calculationSnapshot !== 'object') throw new TypeError('D-0162 calculationSnapshot is required');
    requiredString(calculationSnapshot.modelVersion, 'calculationSnapshot.modelVersion');
    if (calculationSnapshot.modelVersion !== V3_FINANCIAL_SNAPSHOT_VERSION) throw new TypeError('calculationSnapshot must use the A03 V3 financial snapshot contract');
    for (const key of ['offerId', 'submittedAt', 'costVersion', 'babVersion']) requiredString(calculationSnapshot[key], `calculationSnapshot.${key}`);
    if (!dateValid(calculationSnapshot.submittedAt)) throw new TypeError('calculationSnapshot.submittedAt must be a valid ISO date');
    if (!Number.isSafeInteger(calculationSnapshot.netPriceCents) || calculationSnapshot.netPriceCents < 0) throw new TypeError('netPriceCents must be a nonnegative integer');
    if (!calculationSnapshot.calculation || typeof calculationSnapshot.calculation !== 'object' || Array.isArray(calculationSnapshot.calculation)) throw new TypeError('calculationSnapshot.calculation is required');
    if (calculationSnapshot.calculation.netPriceCents !== undefined && calculationSnapshot.calculation.netPriceCents !== calculationSnapshot.netPriceCents) throw new TypeError('snapshot price must equal calculation.netPriceCents');
    if (calculationSnapshot.submittedAt !== submittedAt) throw new TypeError('snapshot submittedAt must equal offer submittedAt');
    if (calculationSnapshot.offerId !== createV3MarketOfferId(state, suppliedEventId)) throw new TypeError('snapshot offerId must match the stable V3 market offer ID');
    if (commercialTerms !== null) validateCommercialTerms(commercialTerms, submittedAt);
    const payload = { type: 'submit_offer', occurredAt: submittedAt, eventId: suppliedEventId, inquiryId, firmId, calculationSnapshot, ...(commercialTerms !== null ? { commercialTerms } : {}) };
    return transaction(state, suppliedEventId, payload, (next, id) => {
      const target = next.inquiries.find(row => row.inquiryId === inquiryId);
      if (!target) throw fail('unknown_market_inquiry', 'inquiry does not exist');
      if (next.dayPhase !== 'actions' || target.status !== 'open' || submittedAt !== next.currentDate || submittedAt > target.expiresAt) throw fail('market_inquiry_not_open', 'inquiry is not open for offers on this date');
      if (!target.invitedFirmIds.includes(firmId)) throw fail('firm_not_invited', 'firm was not invited to this inquiry');
      if (!next.firms.some(row => row.firmId === firmId)) throw fail('unknown_market_firm', 'firm does not exist');
      const playerFirmId = next.firms.find(row => row.role === 'player').firmId;
      if (firmId === playerFirmId && next.negotiations.some(row => row.inquiryId === inquiryId)) throw fail('negotiation_round_already_used', 'this inquiry already used its single customer negotiation round');
      const supersededOfferIds = firmId === next.firms.find(row => row.role === 'player').firmId
        ? target.offers.filter(row => row.firmId === firmId && row.status === 'submitted').map(row => row.offerId)
        : [];
      for (const prior of target.offers) if (supersededOfferIds.includes(prior.offerId)) prior.status = 'superseded';
      const offerId = createV3MarketOfferId(next, suppliedEventId);
      const decisionDelay = boundedInt(next.parameters.customerDecisionDelayCalendarDays.min, next.parameters.customerDecisionDelayCalendarDays.max, `${next.seed}|${inquiryId}|decision-delay|${firmId}|${suppliedEventId}`);
      const offer = { offerId, firmId, submittedAt, decisionAt: dateShift(submittedAt, decisionDelay), status: 'submitted', netPriceCents: calculationSnapshot.netPriceCents, calculationSnapshot: clone(calculationSnapshot), ...(commercialTerms !== null ? { commercialTerms: clone(commercialTerms) } : {}), submittedEventId: id };
      target.offers.push(offer); target.decisionAtByOfferId[offerId] = offer.decisionAt;
      let negotiation = null;
      if (firmId === playerFirmId) {
        const limits = negotiationLimits(next, target);
        if (offer.netPriceCents > limits.acceptanceCents) {
          const negotiationId = eventId(next, 'customer_negotiation', offerId);
          if (offer.netPriceCents > limits.maximumCents) {
            offer.status = 'declined';
            negotiation = { negotiationId, inquiryId, playerFirmId, originalOfferId: offerId, referencePriceCents: limits.referencePriceCents, segmentPriceWeight: limits.segmentPriceWeight, acceptancePriceCents: limits.acceptanceCents, maximumPriceCents: limits.maximumCents, initialPlayerPriceCents: offer.netPriceCents, counterPriceCents: null, counteredAt: null, responseDueAt: null, responseOfferId: null, responseSubmittedAt: null, decisionAt: null, decidedAt: submittedAt, status: 'rejected_above_max' };
            next.negotiations.push(negotiation);
            appendNegotiationEvent(next, { type: 'customer_offer_rejected_above_max', negotiation, occurredAt: submittedAt, eventKey: negotiationId, payload: { negotiationId, inquiryId, originalOfferId: offerId, acceptancePriceCents: limits.acceptanceCents, maximumPriceCents: limits.maximumCents, initialPlayerPriceCents: offer.netPriceCents }, result: { status: negotiation.status, decision: 'rejected', contractCreated: false, financialEffect: 'none' } });
          } else {
            negotiation = { negotiationId, inquiryId, playerFirmId, originalOfferId: offerId, referencePriceCents: limits.referencePriceCents, segmentPriceWeight: limits.segmentPriceWeight, acceptancePriceCents: limits.acceptanceCents, maximumPriceCents: limits.maximumCents, initialPlayerPriceCents: offer.netPriceCents, counterPriceCents: limits.acceptanceCents, counteredAt: submittedAt, responseDueAt: dateShift(submittedAt, 3), responseOfferId: null, responseSubmittedAt: null, decisionAt: null, decidedAt: null, status: 'countered' };
            next.negotiations.push(negotiation);
            appendNegotiationEvent(next, { type: 'customer_counteroffer_issued', negotiation, occurredAt: submittedAt, eventKey: negotiationId, payload: { negotiationId, inquiryId, originalOfferId: offerId, acceptancePriceCents: limits.acceptanceCents, maximumPriceCents: limits.maximumCents, counterPriceCents: limits.acceptanceCents, responseDueAt: negotiation.responseDueAt }, result: { status: negotiation.status, counterPriceCents: negotiation.counterPriceCents, responseDueAt: negotiation.responseDueAt, contractCreated: false, financialEffect: 'none' } });
          }
        }
      }
      return { offerId, inquiryId, firmId, decisionAt: offer.decisionAt, status: offer.status, supersededOfferIds, frozenSnapshotId: calculationSnapshot.offerId, netPlanPriceCents: calculationSnapshot.netPriceCents, snapshotBinding: snapshotBinding(calculationSnapshot, commercialTerms), ...(negotiation ? { negotiationId: negotiation.negotiationId, negotiationStatus: negotiation.status, counterPriceCents: negotiation.counterPriceCents, responseDueAt: negotiation.responseDueAt } : {}) };
    });
  } catch (error) { return { ok: false, error: { code: error.code ?? 'invalid_market_input', message: error.message } }; }
}

/** Submit the one player revision responding to a customer counteroffer. */
export function submitV3MarketCounterResponse(state, { eventId: suppliedEventId, negotiationId, submittedAt, calculationSnapshot, commercialTerms = null }) {
  try {
    validateState(state);
    requiredString(suppliedEventId, 'eventId'); requiredString(negotiationId, 'negotiationId');
    if (!dateValid(submittedAt)) throw new TypeError('submittedAt must be a valid ISO date');
    if (!calculationSnapshot || typeof calculationSnapshot !== 'object') throw new TypeError('D-0162 calculationSnapshot is required');
    requiredString(calculationSnapshot.modelVersion, 'calculationSnapshot.modelVersion');
    if (calculationSnapshot.modelVersion !== V3_FINANCIAL_SNAPSHOT_VERSION) throw new TypeError('calculationSnapshot must use the A03 V3 financial snapshot contract');
    for (const key of ['offerId', 'submittedAt', 'costVersion', 'babVersion']) requiredString(calculationSnapshot[key], `calculationSnapshot.${key}`);
    if (!dateValid(calculationSnapshot.submittedAt) || !Number.isSafeInteger(calculationSnapshot.netPriceCents) || calculationSnapshot.netPriceCents < 0 || !calculationSnapshot.calculation || typeof calculationSnapshot.calculation !== 'object' || Array.isArray(calculationSnapshot.calculation)) throw new TypeError('counter response calculation snapshot is invalid');
    if (calculationSnapshot.calculation.netPriceCents !== undefined && calculationSnapshot.calculation.netPriceCents !== calculationSnapshot.netPriceCents) throw new TypeError('snapshot price must equal calculation.netPriceCents');
    if (calculationSnapshot.submittedAt !== submittedAt || calculationSnapshot.offerId !== createV3MarketOfferId(state, suppliedEventId)) throw new TypeError('counter response snapshot date or stable offer ID does not match its event');
    if (commercialTerms !== null) validateCommercialTerms(commercialTerms, submittedAt);
    const playerFirmId = state.firms.find(row => row.role === 'player').firmId;
    const negotiationSource = state.negotiations.find(row => row.negotiationId === negotiationId);
    const payload = { type: 'submit_counter_response', occurredAt: submittedAt, eventId: suppliedEventId, inquiryId: negotiationSource?.inquiryId ?? null, firmId: playerFirmId, negotiationId, calculationSnapshot, ...(commercialTerms !== null ? { commercialTerms } : {}) };
    return transaction(state, suppliedEventId, payload, (next, id) => {
      const negotiation = next.negotiations.find(row => row.negotiationId === negotiationId);
      if (!negotiation || negotiation.status !== 'countered') throw fail('counteroffer_not_open', 'counteroffer is not open for a player response');
      const inquiry = next.inquiries.find(row => row.inquiryId === negotiation.inquiryId);
      const playerFirmId = next.firms.find(row => row.role === 'player').firmId;
      const original = inquiry?.offers.find(row => row.offerId === negotiation.originalOfferId);
      if (next.dayPhase !== 'actions' || submittedAt !== next.currentDate || submittedAt > negotiation.responseDueAt) throw fail('counteroffer_response_expired', 'player counter response must be submitted during an open market day by the 3-calendar-day deadline');
      if (!inquiry || inquiry.status !== 'open' || !original || original.firmId !== playerFirmId) throw fail('counteroffer_source_invalid', 'counteroffer is not bound to an open inquiry and the player original offer');
      if (stable(commercialTerms ?? null) !== stable(original.commercialTerms ?? null)) throw fail('counteroffer_scope_changed', 'counter response must preserve the original scope and commercial terms');
      if (inquiry.offers.some(row => row.firmId === playerFirmId && row.status === 'submitted' && row.offerId !== original.offerId)) throw fail('counteroffer_active_offer_conflict', 'another player offer is active for this inquiry');
      const offerId = createV3MarketOfferId(next, suppliedEventId);
      const immediateDecision = calculationSnapshot.netPriceCents >= negotiation.acceptancePriceCents;
      const decisionAt = immediateDecision ? submittedAt : dateShift(submittedAt, boundedInt(1, 3, `${next.seed}|${negotiation.negotiationId}|counter-decision-delay|${suppliedEventId}`));
      original.status = 'superseded';
      const accepted = calculationSnapshot.netPriceCents === negotiation.acceptancePriceCents;
      const responseStatus = immediateDecision ? (accepted ? 'accepted' : 'declined') : 'submitted';
      const response = { offerId, firmId: playerFirmId, submittedAt, decisionAt, status: responseStatus, netPriceCents: calculationSnapshot.netPriceCents, calculationSnapshot: clone(calculationSnapshot), ...(commercialTerms !== null ? { commercialTerms: clone(commercialTerms) } : {}), submittedEventId: id };
      inquiry.offers.push(response); inquiry.decisionAtByOfferId[offerId] = decisionAt;
      negotiation.status = accepted ? 'accepted' : immediateDecision ? 'rejected' : 'response_submitted'; negotiation.responseOfferId = offerId; negotiation.responseSubmittedAt = submittedAt; negotiation.decisionAt = decisionAt;
      const result = { offerId, inquiryId: inquiry.inquiryId, negotiationId, firmId: playerFirmId, submittedAt, decisionAt, status: accepted ? 'accepted' : immediateDecision ? 'rejected' : 'submitted', counterPriceCents: negotiation.counterPriceCents, frozenSnapshotId: calculationSnapshot.offerId, netPlanPriceCents: calculationSnapshot.netPriceCents, snapshotBinding: snapshotBinding(calculationSnapshot, commercialTerms), financialEffect: 'none' };
      appendNegotiationEvent(next, { type: 'player_counter_response_submitted', negotiation, occurredAt: submittedAt, eventKey: negotiation.negotiationId, payload: { negotiationId, responseOfferId: offerId, submittedAt, netPriceCents: response.netPriceCents, scopeBinding: stable(commercialTerms ?? null) }, result });
      if (immediateDecision) {
        negotiation.decidedAt = submittedAt;
        let decision = { inquiryId: inquiry.inquiryId, negotiationId, decision: accepted ? 'accept_counter_response' : 'reject_counter_response', responseOfferId: response.offerId, acceptedAt: accepted ? submittedAt : null, contractCreated: false };
        if (accepted) {
          for (const offer of inquiry.offers) if (offer.offerId !== response.offerId && offer.status === 'submitted') offer.status = 'declined';
          const decisionId = eventId(next, 'customer_decision', inquiry.inquiryId);
          inquiry.status = 'resolved'; inquiry.decisionId = decisionId; inquiry.decidedAt = submittedAt; inquiry.winnerFirmId = negotiation.playerFirmId; inquiry.winningOfferId = response.offerId;
          decision = { ...decision, decisionId, winnerFirmId: negotiation.playerFirmId, winningOfferId: response.offerId, decisionEventId: `${id}|decision|${inquiry.inquiryId}`, contractCreated: true };
        }
        appendNegotiationEvent(next, { type: 'customer_counter_response_decided', negotiation, occurredAt: submittedAt, eventKey: `${negotiation.negotiationId}|decision`, payload: { negotiationId, responseOfferId: response.offerId, decisionAt: submittedAt }, result: { ...decision, financialEffect: 'none' } });
        Object.assign(result, decision);
      }
      return result;
    });
  } catch (error) { return { ok: false, error: { code: error.code ?? 'invalid_market_input', message: error.message } }; }
}

/** Player-safe projection: competitor bid prices and identities are never exposed. */
export function getV3MarketPlayerView(state) {
  validateState(state);
  const playerId = state.firms.find(firm => firm.role === 'player').firmId;
  return {
    currentDate: state.currentDate,
    inquiries: state.inquiries.filter(inquiry => inquiry.invitedFirmIds.includes(playerId) && inquiry.status !== 'scheduled').map(inquiry => {
      const ownOffers = inquiry.offers.filter(offer => offer.firmId === playerId);
      const ownOffer = ownOffers.at(-1) ?? null;
      const negotiation = state.negotiations.find(row => row.inquiryId === inquiry.inquiryId && row.playerFirmId === playerId) ?? null;
      return {
        inquiryId: inquiry.inquiryId, customerId: inquiry.customerId, receivedAt: inquiry.receivedAt, currentDate: state.currentDate, expiresAt: inquiry.expiresAt, sizeClass: inquiry.sizeClass, segmentId: inquiry.segmentId,
        requiredCapabilities: clone(inquiry.requiredCapabilities), requiredCapacity: inquiry.requiredCapacity, status: inquiry.status,
        ownOffer: clone(ownOffer), ownOfferRevision: ownOffers.length,
        // Only expose fields needed for the counteroffer interaction. Internal
        // reference/threshold data stays in the authoritative market state.
        negotiation: negotiation ? {
          negotiationId: negotiation.negotiationId,
          status: negotiation.status,
          counterPriceCents: negotiation.counterPriceCents,
          counteredAt: negotiation.counteredAt,
          responseDueAt: negotiation.responseDueAt,
          responseOfferId: negotiation.responseOfferId,
          responseSubmittedAt: negotiation.responseSubmittedAt,
          decisionAt: negotiation.decisionAt,
          decidedAt: negotiation.decidedAt
        } : null,
        ownOfferHistory: clone(ownOffers.map((offer, index) => ({ revision: index + 1, offerId: offer.offerId, submittedAt: offer.submittedAt, decisionAt: offer.decisionAt, status: offer.status, netPriceCents: offer.netPriceCents, commercialTerms: offer.commercialTerms ?? null }))),
        decisionDate: ownOffer?.decisionAt ?? null,
        outcome: inquiry.status === 'resolved' ? (inquiry.winnerFirmId === playerId ? 'won' : 'not_won') : inquiry.status
      };
    })
  };
}

/** Anonymized monthly competitor net-price means with a minimum sample threshold. */
export function getV3MonthlyCompetitorReport(state, period) {
  validateState(state);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period ?? '')) throw new TypeError('period must use YYYY-MM');
  const rows = state.monthlyCompetitorOffers[period] ?? [];
  const bySize = new Map();
  for (const row of rows) {
    const group = bySize.get(row.sizeClass) ?? [];
    if (!group.some(sample => sample.offerId === row.offerId)) group.push({ offerId: row.offerId, netPlanPriceCents: row.netPlanPriceCents });
    bySize.set(row.sizeClass, group);
  }
  return [...bySize.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([sizeClass, cents]) => ({
    period, sizeClass, sampleCount: cents.length,
    meanCompetitorNetPriceCents: cents.length >= state.parameters.minimumMonthlyCompetitorSample ? Math.round(cents.reduce((sum, sample) => sum + sample.netPlanPriceCents, 0) / cents.length) : null,
    suppressed: cents.length < state.parameters.minimumMonthlyCompetitorSample
  }));
}

export function validateV3MarketState(state) { validateState(state); return true; }
