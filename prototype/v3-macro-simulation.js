import { calculateV3SpiPeriod, V3_SPI_COICOP12_VERSION } from './v3-price-index.js';

export const V3_MACRO_SIMULATION_VERSION = 'V3-MACRO-SIM-1';
export const V3_CYCLE_PHASES = Object.freeze(['upswing', 'boom', 'downturn', 'trough']);
export const V3_EXTERNAL_CHANNELS = Object.freeze(['fx_imported_inputs', 'foreign_demand', 'international_supply', 'business_input_cost_plan']);
export const V3_POLICY_CHANNELS = Object.freeze(['monetary', 'fiscal', 'growth', 'tariff', 'labor_market', 'environmental', 'demand_oriented', 'supply_oriented']);
export const V3_T0071_MRO_SHOCK_FIXTURE_ID = 'V3-T0071-EXOGENOUS-MRO-DIRECTION-PAIR-LAG1';
const T0071_MRO_SHOCK_EVENT_KEY = 't0071_exogenous_mro_shock';
const T0071_REPLAY_SKIP = Symbol('internal T-0071 canonical replay guard');
const PHASE_NEXT = Object.freeze({ upswing: 'boom', boom: 'downturn', downturn: 'trough', trough: 'upswing' });
const clone = value => structuredClone(value);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const monthNumber = period => {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(period ?? '');
  if (!match) throw new TypeError('period must use YYYY-MM');
  return Number(match[1]) * 12 + Number(match[2]) - 1;
};
const nextPeriod = period => {
  const n = monthNumber(period) + 1;
  return `${Math.floor(n / 12).toString().padStart(4, '0')}-${String(n % 12 + 1).padStart(2, '0')}`;
};
const validIsoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const monthEndDate = period => {
  const month = monthNumber(period);
  const year = Math.floor(month / 12);
  const monthIndex = month % 12;
  return new Date(Date.UTC(year, monthIndex + 1, 0)).toISOString().slice(0, 10);
};
const eventId = (state, kind, key, period) => [
  'ME', state.modelVersion, state.scenarioId, state.runId, state.seed, kind, key, period
].map(value => encodeURIComponent(String(value))).join('|');
const finite = (value, label) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
};
const requiredString = (value, label) => {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${label} is required`);
};
const validPublicationDate = validIsoDate;
const validObservedPeriod = value => typeof value === 'string' && (/^\d{4}-(0[1-9]|1[0-2])$/.test(value) || /^\d{4}-Q[1-4]$/.test(value) || /^\d{4}$/.test(value));
const assertObservedProvenance = (record, label, asOfPeriod) => {
  requiredString(record.sourceRef, `${label}.sourceRef`);
  requiredString(record.unit, `${label}.unit`);
  if (!validObservedPeriod(record.observedPeriod)) throw new TypeError(`${label}.observedPeriod is required for observed data`);
  if (!validPublicationDate(record.publishedAt)) throw new TypeError(`${label}.publishedAt must be a valid publication date for observed data`);
  if (asOfPeriod && record.publishedAt > monthEndDate(asOfPeriod)) throw new TypeError(`${label}.publishedAt is after the ${asOfPeriod} as-of date`);
  if (!(typeof record.dataVintage === 'string' && record.dataVintage.trim()) && !(typeof record.sourceSnapshotId === 'string' && record.sourceSnapshotId.trim())) throw new TypeError(`${label}.dataVintage or sourceSnapshotId is required for observed data`);
};
const assertSource = (record, label, asOfPeriod) => {
  if (!record || typeof record !== 'object') throw new TypeError(`${label} is required`);
  requiredString(record.sourceType, `${label}.sourceType`);
  requiredString(record.sourceRef, `${label}.sourceRef`);
  requiredString(record.unit, `${label}.unit`);
  finite(record.value, `${label}.value`);
  if (!validIsoDate(record.effectiveFrom)) throw new TypeError(`${label}.effectiveFrom must be a valid ISO calendar date`);
  finite(record.lagPeriods, `${label}.lagPeriods`);
  if (!Number.isInteger(record.lagPeriods) || record.lagPeriods < 0) throw new TypeError(`${label}.lagPeriods must be a nonnegative integer`);
  if (record.sourceType === 'observed') assertObservedProvenance(record, label, asOfPeriod);
  if (!record.uncertaintyBand || !['low', 'base', 'high'].every(k => Number.isFinite(record.uncertaintyBand[k]))) {
    throw new TypeError(`${label}.uncertaintyBand must contain finite low/base/high values`);
  }
};
const validateCycle = cycle => {
  if (!cycle || typeof cycle !== 'object') throw new TypeError('profile.cycleParameters is required');
  for (const key of ['lowGapPct', 'highGapPct', 'positiveMomentumPct', 'negativeMomentumPct']) finite(cycle[key], `cycleParameters.${key}`);
  if (cycle.lowGapPct >= cycle.highGapPct) throw new TypeError('cycle lowGapPct must be below highGapPct');
  if (cycle.negativeMomentumPct >= cycle.positiveMomentumPct) throw new TypeError('cycle negative momentum must be below positive momentum');
  if (!Number.isInteger(cycle.persistencePeriods) || cycle.persistencePeriods < 1) throw new TypeError('cycleParameters.persistencePeriods must be a positive integer');
  requiredString(cycle.parameterSetId, 'cycleParameters.parameterSetId');
  requiredString(cycle.sourceRef, 'cycleParameters.sourceRef');
};

/** Create an isolated, serializable V3 macro state. Every numerical policy is supplied by the caller. */
export function createV3MacroState(profile) {
  if (!profile || typeof profile !== 'object') throw new TypeError('scenario profile is required');
  for (const key of ['runId', 'scenarioId', 'seed', 'profileVersion', 'sourceSnapshotId']) requiredString(String(profile[key] ?? ''), `profile.${key}`);
  validateCycle(profile.cycleParameters);
  if (profile.mroFutureRule) validateMroRule(profile.mroFutureRule);
  return {
    modelVersion: V3_MACRO_SIMULATION_VERSION,
    spiVersion: V3_SPI_COICOP12_VERSION,
    runId: String(profile.runId), scenarioId: String(profile.scenarioId), seed: String(profile.seed),
    profileVersion: String(profile.profileVersion), sourceSnapshotId: String(profile.sourceSnapshotId),
    cycleParameters: clone(profile.cycleParameters),
    mroFutureRule: profile.mroFutureRule ? clone(profile.mroFutureRule) : null,
    phaseState: { phase: null, candidate: null, candidatePeriods: 0 },
    periods: [], events: [], processedPeriods: {}, activatedEventIds: []
  };
}

function validateMroRule(rule) {
  requiredString(rule.formulaId, 'mroFutureRule.formulaId');
  requiredString(rule.parameterSetId, 'mroFutureRule.parameterSetId');
  requiredString(rule.sourceRef, 'mroFutureRule.sourceRef');
  for (const key of ['referenceMroPctPA', 'coefficient', 'referenceInflationPct']) finite(rule[key], `mroFutureRule.${key}`);
  if (!Number.isInteger(rule.lagPeriods) || rule.lagPeriods < 0) throw new TypeError('mroFutureRule.lagPeriods must be a nonnegative integer');
  if (!rule.uncertaintyBand || !['low', 'base', 'high'].every(k => Number.isFinite(rule.uncertaintyBand[k]))) throw new TypeError('mroFutureRule.uncertaintyBand must contain finite low/base/high values');
}

export function validateV3MacroState(state, internalToken = null) {
  const skipT0071Replay = internalToken === T0071_REPLAY_SKIP;
  const invalid = message => Object.assign(new TypeError(message), { code: 'invalid_macro_state' });
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw invalid('invalid V3 macro state shape');
  for (const key of ['modelVersion', 'spiVersion', 'runId', 'scenarioId', 'seed', 'profileVersion', 'sourceSnapshotId']) {
    if (typeof state[key] !== 'string' || state[key].trim() === '') throw invalid(`macro state identity ${key} is required`);
  }
  if (state.modelVersion !== V3_MACRO_SIMULATION_VERSION || state.spiVersion !== V3_SPI_COICOP12_VERSION) throw invalid('unsupported macro state version');
  if (!Array.isArray(state.periods) || !Array.isArray(state.events) || !Array.isArray(state.activatedEventIds) || !state.phaseState || typeof state.phaseState !== 'object' || !state.processedPeriods || typeof state.processedPeriods !== 'object' || Array.isArray(state.processedPeriods)) throw invalid('invalid V3 macro state collections');
  try { validateCycle(state.cycleParameters); if (state.mroFutureRule) validateMroRule(state.mroFutureRule); }
  catch (error) { throw invalid(`invalid macro state parameters: ${error.message}`); }
  if (state.phaseState.phase !== null && !V3_CYCLE_PHASES.includes(state.phaseState.phase)) throw invalid('unknown macro phase');
  if (state.phaseState.candidate !== null && !V3_CYCLE_PHASES.includes(state.phaseState.candidate)) throw invalid('unknown macro phase candidate');
  if (!Number.isInteger(state.phaseState.candidatePeriods) || state.phaseState.candidatePeriods < 0) throw invalid('invalid macro phase persistence count');
  const periodKeys = Object.keys(state.processedPeriods);
  if (state.periods.length !== periodKeys.length) throw invalid('macro periods and processed-period index disagree');
  const eventById = new Map();
  const t0071ShockIds = new Set();
  const t0071EffectGroups = new Set();
  for (const event of state.events) {
    if (!event || typeof event !== 'object' || typeof event.macroEventId !== 'string' || !event.macroEventId || typeof event.eventKey !== 'string' || !event.eventKey || !['cycle_phase', 'external', 'policy', 'mro'].includes(event.channel)) throw invalid('macro event identity is missing');
    if (event.scenarioId !== state.scenarioId || event.runId !== state.runId || event.seed !== state.seed || event.modelVersion !== state.modelVersion) throw invalid('macro event envelope identity mismatch');
    try { monthNumber(event.period); if (!validIsoDate(event.effectiveFrom)) throw new TypeError(); if (event.effectivePeriod) monthNumber(event.effectivePeriod); }
    catch { throw invalid('macro event period is invalid'); }
    if (event.macroEventId !== eventId(state, event.channel, event.eventKey, event.period)) throw invalid('macro event ID does not match its protected envelope');
    if (eventById.has(event.macroEventId)) throw invalid('duplicate macro event ID in history');
    if (event.eventKey === T0071_MRO_SHOCK_EVENT_KEY) {
      if (state.profileVersion !== 'T0071-exogenous-fixture-v1') throw invalid('T-0071 exogenous MRO events require the canonical replay fixture profile');
      if (event.fixtureId !== V3_T0071_MRO_SHOCK_FIXTURE_ID || event.sourceType !== 'synthetic_fixture'
        || event.sourceRef !== 'synthetic-fixture:T-0071:exogenous-mro-direction-pair'
        || typeof event.shockId !== 'string' || !event.shockId.trim() || typeof event.effectGroupId !== 'string' || !event.effectGroupId.trim()
        || !['hike', 'cut'].includes(event.direction) || event.lagPeriods !== 1
        || event.observedPeriod !== event.period || event.effectiveFrom !== `${event.period}-01`
        || event.baseMroPctPA !== 1 || event.deltaPp !== (event.direction === 'hike' ? 0.5 : -0.5)
        || stable(event.uncertaintyBand) !== stable({ low: -0.25, base: 0, high: 0.25 })) throw invalid('T-0071 exogenous MRO event differs from its canonical synthetic fixture');
      if (t0071ShockIds.has(event.shockId) || t0071EffectGroups.has(event.effectGroupId) || t0071ShockIds.size > 0) throw invalid('duplicate T-0071 shock or effect-group identity');
      t0071ShockIds.add(event.shockId); t0071EffectGroups.add(event.effectGroupId);
    }
    eventById.set(event.macroEventId, event);
  }
  const flattenedEvents = [];
  const snapshotActivationIds = [];
  const activatedBeforeSnapshot = new Set();
  for (let i = 0; i < state.periods.length; i += 1) {
    const snap = state.periods[i];
    if (!snap || typeof snap !== 'object' || typeof snap.period !== 'string' || typeof snap.inputFingerprint !== 'string' || !snap.inputFingerprint || !Array.isArray(snap.scheduledEvents) || !Array.isArray(snap.activatedMacroEventIds) || !Array.isArray(snap.effectiveMacroEvents)) throw invalid('macro snapshot shape/history is incomplete');
    try { monthNumber(snap.period); if (i && snap.period !== nextPeriod(state.periods[i - 1].period)) throw invalid('macro state periods must be contiguous'); }
    catch (error) { if (error.code === 'invalid_macro_state') throw error; throw invalid('macro snapshot period is invalid'); }
    if (snap.modelVersion !== state.modelVersion || snap.spiVersion !== state.spiVersion || snap.sourceSnapshotId !== state.sourceSnapshotId || snap.scenarioId !== state.scenarioId || snap.runId !== state.runId || snap.profileVersion !== state.profileVersion || snap.seed !== state.seed) throw invalid('macro snapshot identity mismatch');
    if (state.processedPeriods[snap.period] !== snap.inputFingerprint) throw invalid('macro period fingerprint mismatch');
    if (state.profileVersion === 'T0071-exogenous-fixture-v1') {
      if (!snap.canonicalInput || stable(snap.canonicalInput) !== snap.inputFingerprint || snap.canonicalInput.period !== snap.period) throw invalid('T-0071 canonical monthly input does not match its stored source fingerprint');
    } else if (snap.canonicalInput != null) throw invalid('canonical T-0071 inputs are not permitted in other profiles');
    if (snap.scheduledEvents.some(event => event?.period !== snap.period)) throw invalid('scheduled event period does not match its snapshot');
    flattenedEvents.push(...snap.scheduledEvents);
    const dueEvents = state.events.filter(event => event.period <= snap.period && event.effectivePeriod && event.effectivePeriod <= snap.period && !activatedBeforeSnapshot.has(event.macroEventId));
    const expectedIds = dueEvents.map(event => event.macroEventId);
    if (stable(snap.activatedMacroEventIds) !== stable(expectedIds)) throw invalid('snapshot activation history is incomplete or out of order');
    if (stable(snap.effectiveMacroEvents.map(event => event?.macroEventId)) !== stable(expectedIds)) throw invalid('snapshot effective-event history is incomplete or out of order');
    for (const id of snap.activatedMacroEventIds) {
      const event = eventById.get(id);
      if (!event || !event.effectivePeriod || event.effectivePeriod > snap.period) throw invalid('snapshot activation references absent or not-yet-effective event');
      snapshotActivationIds.push(id);
      activatedBeforeSnapshot.add(id);
    }
    for (const event of snap.effectiveMacroEvents) {
      const stored = eventById.get(event?.macroEventId);
      if (!stored || stable(stored) !== stable(event)) throw invalid('snapshot effective-event history mismatch');
    }
  }
  if (stable(periodKeys.sort()) !== stable(state.periods.map(snap => snap.period).sort())) throw invalid('processed-period keys do not match snapshot history');
  if (flattenedEvents.length !== state.events.length || flattenedEvents.some((event, i) => stable(event) !== stable(state.events[i]))) throw invalid('macro event history does not match period snapshots');
  if (new Set(state.activatedEventIds).size !== state.activatedEventIds.length || stable([...state.activatedEventIds].sort()) !== stable([...new Set(snapshotActivationIds)].sort())) throw invalid('activated-event history does not match snapshots');
  if (state.periods.length && stable(state.phaseState) !== stable({ phase: state.periods.at(-1).phaseState.phase, candidate: state.periods.at(-1).phaseState.candidate, candidatePeriods: state.periods.at(-1).phaseState.candidatePeriods })) throw invalid('current phase state does not match last snapshot');
  if (!skipT0071Replay && state.profileVersion === 'T0071-exogenous-fixture-v1') {
    const replay = createV3MacroState({
      runId: state.runId, scenarioId: state.scenarioId, seed: state.seed,
      profileVersion: state.profileVersion, sourceSnapshotId: state.sourceSnapshotId,
      cycleParameters: state.cycleParameters, mroFutureRule: state.mroFutureRule,
    });
    for (const snap of state.periods) {
      const transition = runV3MacroMonth(replay, snap.canonicalInput, T0071_REPLAY_SKIP);
      if (!transition.ok || stable(transition.snapshot) !== stable(snap)) throw invalid('T-0071 macro event/snapshot history differs from replay of its canonical monthly inputs');
      Object.assign(replay, transition.state);
    }
    if (stable(replay) !== stable(state)) throw invalid('T-0071 macro state differs from complete canonical-input replay');
  }
  return true;
}
function phaseCandidate(input, previousPhase, cycle) {
  const gap = input.activityGapPct;
  const momentum = input.activityMomentumPct;
  if (gap <= cycle.lowGapPct) return 'trough';
  if (gap >= cycle.highGapPct) return 'boom';
  if (momentum >= cycle.positiveMomentumPct) return 'upswing';
  if (momentum <= cycle.negativeMomentumPct) return 'downturn';
  return previousPhase;
}
function updatePhase(state, input) {
  const prior = state.phaseState;
  if (input.activityGapPct == null || input.activityMomentumPct == null) return { ...prior, reason: 'missing_activity_indicator', changed: false };
  finite(input.activityGapPct, 'activityGapPct'); finite(input.activityMomentumPct, 'activityMomentumPct');
  const candidate = phaseCandidate(input, prior.phase, state.cycleParameters);
  if (!candidate) return { ...prior, reason: 'no_phase_candidate', changed: false };
  const count = candidate === prior.candidate ? prior.candidatePeriods + 1 : 1;
  if (prior.phase === null || candidate === prior.phase) return { phase: candidate, candidate, candidatePeriods: count, reason: 'initial_or_maintained', changed: prior.phase !== candidate };
  if (candidate !== PHASE_NEXT[prior.phase]) {
    const shock = input.shockTransition;
    if (!shock || shock.from !== prior.phase || shock.to !== candidate || !shock.sourceRef) return { phase: prior.phase, candidate, candidatePeriods: count, reason: 'non_adjacent_transition_requires_explicit_shock', changed: false };
    return { phase: candidate, candidate, candidatePeriods: 0, reason: 'explicit_scenario_shock', changed: true };
  }
  if (count < state.cycleParameters.persistencePeriods) return { phase: prior.phase, candidate, candidatePeriods: count, reason: 'hysteresis_pending', changed: false };
  return { phase: candidate, candidate, candidatePeriods: 0, reason: 'hysteresis_satisfied', changed: true };
}
function effectivePeriod(period, lagPeriods, effectiveFrom = period) {
  if (!validIsoDate(effectiveFrom)) throw new TypeError('effectiveFrom must be a valid ISO calendar date');
  const effectiveMonth = effectiveFrom.slice(0, 7);
  const start = monthNumber(effectiveMonth) > monthNumber(period) ? effectiveMonth : period;
  let result = start;
  for (let i = 0; i < lagPeriods; i += 1) result = nextPeriod(result);
  return result;
}
function addEvent(state, events, kind, key, period, record) {
  const id = eventId(state, kind, key, period);
  // Caller/source records are untrusted for envelope identity; protected fields are always written last.
  const payload = { ...clone(record), macroEventId: id, eventKey: String(key), scenarioId: state.scenarioId, runId: state.runId, seed: state.seed, modelVersion: state.modelVersion, channel: kind, period };
  const existing = state.events.find(e => e.macroEventId === id);
  if (existing && stable(existing) !== stable(payload)) throw Object.assign(new Error('same macroEventId has a different payload'), { code: 'macro_event_payload_conflict' });
  events.push(payload);
  return payload;
}
function validateInput(input) {
  if (!input || typeof input !== 'object') throw new TypeError('monthly input is required');
  monthNumber(input.period);
  requiredString(input.parameterSetId, 'input.parameterSetId');
  if (input.newCreditRequest) {
    const request = input.newCreditRequest;
    for (const key of ['creditRequestId', 'sourceRef', 'parameterSetId']) requiredString(request[key], `newCreditRequest.${key}`);
    for (const key of ['indicativeSpreadPp', 'indicativeTermMonths', 'mroBasePctPA']) finite(request[key], `newCreditRequest.${key}`);
    if (!Number.isInteger(request.indicativeTermMonths) || request.indicativeTermMonths <= 0) throw new TypeError('newCreditRequest.indicativeTermMonths must be a positive integer');
    if (!validIsoDate(request.validFrom) || !validIsoDate(request.validUntil)) throw new TypeError('newCreditRequest validity dates must be valid ISO calendar dates');
    if (request.validFrom > request.validUntil) throw new TypeError('newCreditRequest.validFrom must not be after validUntil');
  }
  if (!input.componentIndexes || typeof input.componentIndexes !== 'object') throw new TypeError('componentIndexes are required');
  requiredString(input.componentSourceType, 'componentSourceType'); requiredString(input.componentSourceRef, 'componentSourceRef');
  if (input.componentSourceType === 'observed') {
    assertObservedProvenance({ sourceRef: input.componentSourceRef, unit: input.componentUnit, observedPeriod: input.componentObservedPeriod, publishedAt: input.componentPublishedAt, dataVintage: input.componentDataVintage, sourceSnapshotId: input.componentSourceSnapshotId }, 'SPI components', input.period);
    if (input.componentObservedPeriod !== input.period) throw new TypeError('observed SPI component period must match the macro period');
    if (input.componentBase !== '2020=100' || input.componentBasketVersion !== V3_SPI_COICOP12_VERSION) throw new TypeError('observed SPI components require matching base and basket version');
  }
  if (!input.priorMonthlySpiIndexes || !Array.isArray(input.priorMonthlySpiIndexes)) throw new TypeError('priorMonthlySpiIndexes array is required');
  if (!input.activity || typeof input.activity !== 'object') throw new TypeError('activity inputs are required');
  for (const key of ['activityIndex', 'trendIndex']) { finite(input.activity[key], `activity.${key}`); if (input.activity[key] <= 0) throw new TypeError(`activity.${key} must be positive`); }
  requiredString(input.activity.sourceType, 'activity.sourceType'); requiredString(input.activity.sourceRef, 'activity.sourceRef');
  if (input.activity.priorActivityIndex != null) { finite(input.activity.priorActivityIndex, 'activity.priorActivityIndex'); if (input.activity.priorActivityIndex <= 0) throw new TypeError('activity.priorActivityIndex must be positive'); }
  if (input.activity.sourceType === 'observed') assertObservedProvenance(input.activity, 'activity', input.period);
  if (input.activity.observedQuarterly?.sourceType === 'observed') {
    const q = input.activity.observedQuarterly;
    assertObservedProvenance(q, 'activity.observedQuarterly', input.period);
  }
  if (input.observedMro) {
    if (!validIsoDate(input.observedMro.effectiveFrom)) throw new TypeError('observedMro.effectiveFrom must be a valid ISO calendar date');
    assertObservedProvenance(input.observedMro, 'observedMro', input.period);
  }
  if (input.mroScenarioShock) {
    const shock = input.mroScenarioShock;
    if (shock.fixtureId !== V3_T0071_MRO_SHOCK_FIXTURE_ID || shock.sourceType !== 'synthetic_fixture') throw new TypeError('mroScenarioShock must use the explicit T-0071 synthetic fixture');
    for (const key of ['shockId', 'sourceRef', 'parameterSetId', 'effectGroupId']) requiredString(shock[key], `mroScenarioShock.${key}`);
    if (shock.sourceRef !== 'synthetic-fixture:T-0071:exogenous-mro-direction-pair') throw new TypeError('mroScenarioShock sourceRef is not the approved test-fixture reference');
    if (!['hike', 'cut'].includes(shock.direction)) throw new TypeError('mroScenarioShock.direction must be hike or cut');
    if (shock.lagPeriods !== 1 || shock.observedPeriod !== input.period || shock.effectiveFrom !== `${input.period}-01`) throw new TypeError('T-0071 synthetic shock requires observed period, month-start effective date, and lag=1');
    if (shock.baseMroPctPA !== 1 || shock.deltaPp !== (shock.direction === 'hike' ? 0.5 : -0.5)) throw new TypeError('T-0071 fixture uses only a ±0.5 pp movement from its 1.0% p.a. reference');
    if (!shock.uncertaintyBand || stable(shock.uncertaintyBand) !== stable({ low: -0.25, base: 0, high: 0.25 })) throw new TypeError('T-0071 fixture uncertainty band must be ±0.25 pp around the scenario value');
  }
  if (!input.externalChannels || !input.policyChannels) throw new TypeError('all external and policy channels are required');
  for (const name of V3_EXTERNAL_CHANNELS) {
    const record = input.externalChannels[name]; assertSource(record, `externalChannels.${name}`, input.period);
    requiredString(record.firmExposure, `externalChannels.${name}.firmExposure`);
    requiredString(record.expectedOutcome, `externalChannels.${name}.expectedOutcome`);
  }
  for (const name of V3_POLICY_CHANNELS) {
    const record = input.policyChannels[name]; assertSource(record, `policyChannels.${name}`, input.period);
    for (const key of ['measure', 'goal', 'intermediateIndicator', 'firmExposure', 'expectedOutcome', 'counterEffect', 'effectGroupId', 'accountingClass']) requiredString(record[key], `policyChannels.${name}.${key}`);
    if (record.accountingClass !== 'information_plan') throw new TypeError(`${name}.accountingClass must be information_plan`);
  }
}
function deriveMro(state, input, spi, period, priorSnapshots) {
  if (input.observedMro && monthNumber(input.observedMro.effectiveFrom.slice(0, 7)) <= monthNumber(period)) {
    const mro = input.observedMro;
    finite(mro.valuePctPA, 'observedMro.valuePctPA'); requiredString(mro.sourceRef, 'observedMro.sourceRef'); requiredString(mro.effectiveFrom, 'observedMro.effectiveFrom');
    assertObservedProvenance(mro, 'observedMro', period);
    return { valuePctPA: mro.valuePctPA, sourceType: 'observed', sourceRef: mro.sourceRef, observedPeriod: mro.observedPeriod, observedAt: mro.observedAt ?? null, publishedAt: mro.publishedAt, dataVintage: mro.dataVintage ?? null, sourceSnapshotId: mro.sourceSnapshotId ?? null, unit: mro.unit, effectiveFrom: mro.effectiveFrom, formulaId: null, lagPeriods: 0 };
  }
  const dueT0071Shock = [...state.events].reverse().find(event => event.eventKey === T0071_MRO_SHOCK_EVENT_KEY && event.effectivePeriod <= period);
  if (dueT0071Shock) return {
    valuePctPA: dueT0071Shock.baseMroPctPA + dueT0071Shock.deltaPp,
    referenceMroPctPA: dueT0071Shock.baseMroPctPA,
    sourceType: 'synthetic_scenario', sourceRef: dueT0071Shock.sourceRef,
    referencePeriod: dueT0071Shock.observedPeriod, effectiveFrom: dueT0071Shock.effectiveFrom,
    formulaId: 'T0071-exogenous-MRO-step-v1', parameterSetId: dueT0071Shock.parameterSetId,
    lagPeriods: dueT0071Shock.lagPeriods, uncertaintyBand: clone(dueT0071Shock.uncertaintyBand),
    assumptionStatus: 'synthetic_uncalibrated', direction: dueT0071Shock.direction,
    shockId: dueT0071Shock.shockId, effectGroupId: dueT0071Shock.effectGroupId,
  };
  const rule = state.mroFutureRule;
  if (!rule || spi.yearOverYearInflation == null) return { valuePctPA: null, sourceType: 'unavailable', reason: rule ? 'yoy_history_unavailable' : 'no_scenario_rule', formulaId: null };
  const lagged = rule.lagPeriods > 0 ? priorSnapshots.at(-rule.lagPeriods) : null;
  const inflation = rule.lagPeriods === 0 ? spi.yearOverYearInflation : lagged?.spi?.yearOverYearInflation;
  if (inflation == null) return { valuePctPA: null, sourceType: 'unavailable', reason: 'mro_lag_history_unavailable', formulaId: rule.formulaId };
  // Explicit scenario formula, not an observed or calibrated EZB rule.
  const valuePctPA = rule.referenceMroPctPA + rule.coefficient * (inflation - rule.referenceInflationPct);
  return { valuePctPA, referenceMroPctPA: rule.referenceMroPctPA, sourceType: 'synthetic_scenario', sourceRef: rule.sourceRef, referencePeriod: rule.lagPeriods ? lagged.period : period, inflationInputPct: inflation, formulaId: rule.formulaId, parameterSetId: rule.parameterSetId, lagPeriods: rule.lagPeriods, uncertaintyBand: clone(rule.uncertaintyBand), assumptionStatus: 'synthetic_uncalibrated' };
}
function makeFinancingHandoff(state, input, mro) {
  const request = input.newCreditRequest;
  if (!request || mro.valuePctPA == null) return null;
  for (const key of ['creditRequestId', 'indicativeSpreadPp', 'indicativeTermMonths', 'mroBasePctPA', 'validFrom', 'validUntil', 'sourceRef', 'parameterSetId']) {
    if (key === 'indicativeSpreadPp' || key === 'indicativeTermMonths' || key === 'mroBasePctPA') finite(request[key], `newCreditRequest.${key}`);
    else requiredString(request[key], `newCreditRequest.${key}`);
  }
  const uncertaintyBand = mro.uncertaintyBand ?? request.uncertaintyBand;
  if (!uncertaintyBand || !['low', 'base', 'high'].every(k => Number.isFinite(uncertaintyBand[k]))) throw new TypeError('newCreditRequest uncertaintyBand is required when MRO uncertainty is unavailable');
  const asOfDate = monthEndDate(input.period);
  if (request.validFrom > asOfDate) return null;
  const status = request.validUntil < asOfDate ? 'expired' : 'indicative';
  const id = `FQ|${encodeURIComponent(state.modelVersion)}|${encodeURIComponent(state.scenarioId)}|${encodeURIComponent(state.runId)}|${encodeURIComponent(state.seed)}|${encodeURIComponent(request.creditRequestId)}|${input.period}`;
  return { creditRequestId: request.creditRequestId, financingQuoteId: id, referencePeriod: input.period, asOfDate, mroScenarioValuePctPA: mro.valuePctPA, mroDeltaPp: mro.valuePctPA - request.mroBasePctPA, indicativeSpreadPp: request.indicativeSpreadPp, indicativeRatePctPA: mro.valuePctPA + request.indicativeSpreadPp, indicativeTermMonths: request.indicativeTermMonths, validFrom: request.validFrom, validUntil: request.validUntil, sourceType: mro.sourceType, sourceRef: request.sourceRef, scenarioId: state.scenarioId, parameterSetId: request.parameterSetId, lagPeriods: mro.lagPeriods ?? 0, uncertaintyBand: clone(uncertaintyBand), status, contractId: null, contractVersion: null, createsFinancialEvent: false, createsLedgerEffect: false };
}

/** Pure one-month transition. Returns a new state; never mutates company, finance, HR or contract state. */
export function runV3MacroMonth(state, input, internalToken = null) {
  try {
    validateV3MacroState(state, internalToken === T0071_REPLAY_SKIP ? T0071_REPLAY_SKIP : null); validateInput(input);
    if (state.periods.length) {
      const last = state.periods.at(-1);
      if (input.period === last.period) {
        const fingerprint = stable(input);
        if (fingerprint === last.inputFingerprint) return { ok: true, duplicate: true, state: clone(state), snapshot: clone(last) };
        return { ok: false, error: { code: 'period_payload_conflict', message: 'period already processed with different input' } };
      }
      if (input.period !== nextPeriod(last.period)) return { ok: false, error: { code: 'non_sequential_period', message: `expected ${nextPeriod(last.period)}` } };
    }
    if (input.mroScenarioShock) {
      if (state.profileVersion !== 'T0071-exogenous-fixture-v1') throw Object.assign(new TypeError('T-0071 exogenous shocks require the canonical replay fixture profile'), { code: 'foreign_mro_fixture' });
      const priorShocks = state.events.filter(event => event.eventKey === T0071_MRO_SHOCK_EVENT_KEY);
      if (priorShocks.some(event => event.shockId === input.mroScenarioShock.shockId)) throw Object.assign(new TypeError('duplicate T-0071 shockId'), { code: 'duplicate_mro_shock' });
      if ([...Object.values(input.policyChannels ?? {}), ...Object.values(input.externalChannels ?? {})]
        .some(record => record?.effectGroupId === input.mroScenarioShock.effectGroupId)) throw Object.assign(new TypeError('T-0071 effectGroupId collides with another macro channel'), { code: 'duplicate_mro_effect_group' });
      if (priorShocks.some(event => event.effectGroupId === input.mroScenarioShock.effectGroupId)
        || state.events.some(event => event.effectGroupId === input.mroScenarioShock.effectGroupId)) throw Object.assign(new TypeError('duplicate T-0071 effectGroupId'), { code: 'duplicate_mro_effect_group' });
      if (priorShocks.length) throw Object.assign(new TypeError('the T-0071 direction-pair fixture accepts one exogenous shock per run'), { code: 'duplicate_mro_shock' });
    }
    const spi = calculateV3SpiPeriod(input.componentIndexes, input.priorMonthlySpiIndexes);
    const activityGapPct = 100 * (input.activity.activityIndex / input.activity.trendIndex - 1);
    const activityMomentumPct = input.activity.priorActivityIndex == null ? null : 100 * (input.activity.activityIndex / input.activity.priorActivityIndex - 1);
    const phase = updatePhase(state, { activityGapPct, activityMomentumPct, shockTransition: input.shockTransition });
    const events = [];
    if (input.mroScenarioShock) {
      const shock = input.mroScenarioShock;
      addEvent(state, events, 'mro', T0071_MRO_SHOCK_EVENT_KEY, input.period, {
        ...clone(shock), baseValue: shock.baseMroPctPA, newValue: shock.baseMroPctPA + shock.deltaPp,
        delta: shock.deltaPp, unit: '% p.a.', effectivePeriod: effectivePeriod(input.period, shock.lagPeriods, shock.effectiveFrom),
        targetExposure: 'new_financing_conditions_only', expectedDirection: shock.direction,
        accountingClass: 'information_plan', assumptionStatus: 'synthetic_uncalibrated',
        createsFinancialEvent: false, createsLedgerEffect: false,
      });
    }
    const sourceBase = { sourceType: input.activity.sourceType, sourceRef: input.activity.sourceRef, observedPeriod: input.activity.observedPeriod ?? null, observedAt: input.activity.observedAt ?? null, publishedAt: input.activity.publishedAt ?? null, dataVintage: input.activity.dataVintage ?? null, sourceSnapshotId: input.activity.sourceSnapshotId ?? null, effectiveFrom: `${input.period}-01`, lagPeriods: 0, unit: 'index', uncertaintyBand: input.activity.uncertaintyBand ?? null, targetExposure: 'aggregate_activity', expectedDirection: 'scenario_classification', assumptionStatus: input.activity.sourceType === 'observed' ? 'source_observation' : 'scenario_input' };
    if (phase.changed || phase.phase) addEvent(state, events, 'cycle_phase', phase.phase ?? 'unclassified', input.period, { ...sourceBase, baseValue: state.phaseState.phase, newValue: phase.phase, transitionReason: phase.reason, activityGapPct, activityMomentumPct, parameterSetId: state.cycleParameters.parameterSetId });
    for (const name of V3_EXTERNAL_CHANNELS) {
      const rec = input.externalChannels[name];
      addEvent(state, events, 'external', name, input.period, { ...clone(rec), effectiveFrom: rec.effectiveFrom, effectivePeriod: effectivePeriod(input.period, rec.lagPeriods, rec.effectiveFrom), observedPeriod: rec.observedPeriod ?? null, observedAt: rec.observedAt ?? null, publishedAt: rec.publishedAt ?? null, baseValue: rec.baseValue ?? null, newValue: rec.newValue ?? rec.value, delta: rec.delta ?? null, uncertaintyLow: rec.uncertaintyBand.low, uncertaintyBase: rec.uncertaintyBand.base, uncertaintyHigh: rec.uncertaintyBand.high, targetExposure: rec.firmExposure ?? name, expectedDirection: rec.expectedOutcome ?? 'scenario_input', assumptionStatus: rec.sourceType === 'observed' ? 'source_observation' : 'scenario_assumption' });
    }
    const policyEffectGroups = new Set();
    for (const name of V3_POLICY_CHANNELS) {
      const rec = input.policyChannels[name];
      const effectKey = `${rec.effectGroupId}|${rec.intermediateIndicator}`;
      const effectEligible = !policyEffectGroups.has(effectKey);
      policyEffectGroups.add(effectKey);
      addEvent(state, events, 'policy', name, input.period, { ...clone(rec), effectivePeriod: effectivePeriod(input.period, rec.lagPeriods, rec.effectiveFrom), observedPeriod: rec.observedPeriod ?? null, observedAt: rec.observedAt ?? null, publishedAt: rec.publishedAt ?? null, baseValue: rec.baseValue ?? null, newValue: rec.newValue ?? rec.value, delta: rec.delta ?? null, uncertaintyLow: rec.uncertaintyBand.low, uncertaintyBase: rec.uncertaintyBand.base, uncertaintyHigh: rec.uncertaintyBand.high, targetExposure: rec.firmExposure, expectedDirection: rec.expectedOutcome, assumptionStatus: rec.sourceType === 'observed' ? 'source_observation' : 'scenario_assumption', accountingClass: 'information_plan', effectEligible, suppressedAsDuplicate: !effectEligible });
    }
    const priorSnapshots = state.periods;
    const mro = deriveMro(state, input, spi, input.period, priorSnapshots);
    if (mro.valuePctPA != null) addEvent(state, events, 'mro', mro.sourceType, input.period, { ...clone(mro), effectiveFrom: mro.effectiveFrom ?? `${input.period}-01`, effectivePeriod: mro.sourceType === 'synthetic_scenario' ? input.period : effectivePeriod(input.period, 0, mro.effectiveFrom), observedPeriod: mro.referencePeriod ?? mro.observedPeriod ?? null, observedAt: mro.observedAt ?? null, publishedAt: mro.publishedAt ?? null, dataVintage: mro.dataVintage ?? null, sourceSnapshotId: mro.sourceSnapshotId ?? null, baseValue: mro.referenceMroPctPA ?? null, newValue: mro.valuePctPA, delta: mro.referenceMroPctPA == null ? null : mro.valuePctPA - mro.referenceMroPctPA, unit: '% p.a.', targetExposure: 'new_financing_conditions_only', expectedDirection: 'indicative_only', accountingClass: 'information_plan', assumptionStatus: mro.sourceType === 'observed' ? 'source_observation' : 'synthetic_uncalibrated' });
    const financingHandoff = makeFinancingHandoff(state, input, mro);
    const [year, month] = input.period.split('-').map(Number);
    const currentDate = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
    const dueEvents = [...state.events, ...events].filter(event => event.effectivePeriod && event.effectivePeriod <= input.period && !state.activatedEventIds.includes(event.macroEventId));
    const fingerprint = stable(input);
    const snapshot = {
      period: input.period, currentDate, inputFingerprint: fingerprint,
      ...(state.profileVersion === 'T0071-exogenous-fixture-v1' ? { canonicalInput: clone(input) } : {}),
      modelVersion: state.modelVersion, spiVersion: state.spiVersion, parameterSetId: input.parameterSetId,
      sourceSnapshotId: state.sourceSnapshotId, scenarioId: state.scenarioId, runId: state.runId, profileVersion: state.profileVersion, seed: state.seed,
      spi: { ...spi, sourceType: input.componentSourceType, sourceRef: input.componentSourceRef, observedPeriod: input.componentObservedPeriod ?? null, publishedAt: input.componentPublishedAt ?? null, dataVintage: input.componentDataVintage ?? null, sourceSnapshotId: input.componentSourceSnapshotId ?? null, observedAt: input.componentObservedAt ?? null, unit: input.componentUnit ?? 'index', base: '2020=100', basketVersion: state.spiVersion },
      activity: { activityIndex: input.activity.activityIndex, trendIndex: input.activity.trendIndex, activityGapPct, activityMomentumPct, observedPeriod: input.activity.observedPeriod ?? null, observedAt: input.activity.observedAt ?? null, publishedAt: input.activity.publishedAt ?? null, dataVintage: input.activity.dataVintage ?? null, sourceSnapshotId: input.activity.sourceSnapshotId ?? null, unit: input.activity.unit ?? 'index', observedQuarterly: clone(input.activity.observedQuarterly ?? null), sourceType: input.activity.sourceType, sourceRef: input.activity.sourceRef },
      phaseState: clone(phase), externalChannels: clone(input.externalChannels), policyChannels: clone(input.policyChannels),
      mro: clone(mro), financingHandoff, scheduledEvents: clone(events), effectiveMacroEvents: clone(dueEvents), activatedMacroEventIds: dueEvents.map(e => e.macroEventId),
      financeEffects: { ledger: false, cash: false, receivables: false, payables: false, inventory: false, payroll: false, existingContracts: false }
    };
    const next = clone(state);
    next.phaseState = { phase: phase.phase, candidate: phase.candidate, candidatePeriods: phase.candidatePeriods };
    next.periods.push(snapshot); next.events.push(...events); next.processedPeriods[input.period] = fingerprint;
    next.activatedEventIds.push(...snapshot.activatedMacroEventIds);
    return { ok: true, duplicate: false, state: next, snapshot: clone(snapshot) };
  } catch (error) {
    return { ok: false, error: { code: error.code ?? 'invalid_macro_input', message: error.message } };
  }
}













