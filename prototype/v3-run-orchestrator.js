import {
  advanceV3MarketDay, closeV3MarketDay, scheduleV3MarketWeek,
  submitV3MarketOffer, submitV3MarketCounterResponse, getV3MarketPlayerView, validateV3MarketState, V3_MARKET_INVITATION_PRICE_PROFILE_ID,
} from './v3-market-simulation.js';
import { V3_PRODUCT_VERSION, advanceV3ProductDate, validateV3ProductWorkdayAssignments, getV3EquipmentInstructionStatus, planV3EquipmentInstruction, planV3CustomerWorkOrder as planProductWorkOrder, completeV3CustomerWorkOrderOperation as completeProductWorkOrderOperation, shipV3CustomerFinishedGoods, releaseV3CustomerFinishedGoodsReservation, recordV3CustomerFinishedGoodsReturn, recordV3ProductLotCost, submitV3ProductSaleOffer as submitProductSaleOffer, decideV3ProductSaleOffer as decideProductSaleOffer, dispatchV3ProductSale as dispatchProductSale, placeV3InternationalMaterialOrder, receiveV3InternationalMaterialShipment, recordV3EquipmentInstruction, recordV3SpecialEquipmentAuthorization } from './v3-product-lifecycle.js';
import { createV3MacroState, runV3MacroMonth, validateV3MacroState } from './v3-macro-simulation.js';
import { applyV3FormationEvent, validateV3FormationState } from './v3-company-formation.js';
import { createV3LearningRunState, validateV3LearningRunState, getV3RunLearningEvents as getLearningEvents, answerV3RunLearningEvent as answerLearningEvent, projectV3EventCatalog } from './v3-learning-run-adapter.js';
import { buildSyntheticCostPlanChannel, V3_COST_PLAN_FIXTURE_ID } from './v3-cost-plan-scenario-fixture.js';
import { allocateV3ForeignDemandTemplates, buildSyntheticForeignDemandChannel, buildSyntheticFxOfferPlanChannel, buildV3BaseMarketTemplates, getV3RunSegmentTemplates, V3_FOREIGN_DEMAND_FIXTURE_ID, V3_FX_OFFER_PLAN_FIXTURE_ID } from './v3-run-macro-fixture.js';
import { buildV3DestatisImportPriceBenchmark, V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID, validateV3DestatisImportPriceBenchmark } from './v3-destatis-import-price-reference.js';
import { V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';

export const V3_RUN_ORCHESTRATOR_VERSION = 'V3-RUN-2';
let activeV3RunDiagnostics = null;
let activeV3RunDiagnosticPhase = 'outside';
const diagnosticNow = () => globalThis.performance?.now?.() ?? Date.now();
export function startV3RunDiagnostics() {
  activeV3RunDiagnostics = { fullValidations: {}, validatorBlocks: {}, inputSizesByPhase: {} };
  activeV3RunDiagnosticPhase = 'initialization';
}
export function setV3RunDiagnosticPhase(phase) {
  if (activeV3RunDiagnostics && (typeof phase !== 'string' || !phase)) throw new TypeError('diagnostic phase must be a non-empty string');
  activeV3RunDiagnosticPhase = phase;
}
export function finishV3RunDiagnostics() {
  const result = activeV3RunDiagnostics ? clone(activeV3RunDiagnostics) : null;
  activeV3RunDiagnostics = null;
  activeV3RunDiagnosticPhase = 'outside';
  return result;
}
function measureDiagnostic(name, callback) {
  if (!activeV3RunDiagnostics) return callback();
  const started = diagnosticNow();
  try { return callback(); }
  finally {
    const elapsed = diagnosticNow() - started;
    const bucket = activeV3RunDiagnostics.validatorBlocks[name] ??= { calls: 0, totalMs: 0, maxMs: 0 };
    bucket.calls += 1; bucket.totalMs += elapsed; bucket.maxMs = Math.max(bucket.maxMs, elapsed);
  }
}
function recordDiagnosticCount(name, amount) {
  if (!activeV3RunDiagnostics) return;
  activeV3RunDiagnostics.workCounters ??= {};
  activeV3RunDiagnostics.workCounters[name] = (activeV3RunDiagnostics.workCounters[name] ?? 0) + amount;
}
function groupRowsBy(rows, keyOf) {
  const grouped = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    const items = grouped.get(key);
    if (items) items.push(row); else grouped.set(key, [row]);
  }
  return grouped;
}
function recordRunValidation(phase, state) {
  if (!activeV3RunDiagnostics) return;
  const bucket = activeV3RunDiagnostics.fullValidations[phase] ??= { calls: 0, totalMs: 0, maxMs: 0 };
  bucket.calls += 1;
  const sizes = activeV3RunDiagnostics.inputSizesByPhase[phase] ??= { calls: 0, runEvents: 0, marketEvents: 0, marketInquiries: 0, macroPeriods: 0 };
  sizes.calls += 1;
  sizes.runEvents += state.dayEvents?.length ?? 0;
  sizes.marketEvents += state.modules?.market?.events?.length ?? 0;
  sizes.marketInquiries += state.modules?.market?.inquiries?.length ?? 0;
  sizes.macroPeriods += state.modules?.macro?.periods?.length ?? 0;
  return bucket;
}
const clone = value => structuredClone(value);
const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
  && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const shiftDate = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const mondayOf = date => {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return shiftDate(date, -(day === 0 ? 6 : day - 1));
};
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const fail = (code, message) => Object.assign(new TypeError(message), { code });
const okOrThrow = result => { if (!result?.ok) throw fail(result?.error?.code ?? 'module_transition_failed', result?.error?.message ?? 'V3 module transition failed'); return result; };
const eventId = (state, date) => `RUN|${encodeURIComponent(state.runId)}|${date}`;
const isWorkday = date => ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
function validateMacroDemandSnapshotBindings(state) {
  const marketEvents = state.modules.market.events;
  const schedules = marketEvents.filter(event => event.type === 'schedule_week');
  if (!schedules.length) return;
  if (!state.modules.macro) {
    if (schedules.some(event => event.payload?.templates?.some(template => template?.macroDemand))) throw fail('invalid_run_state', 'D-0169 demand trace lacks its authoritative macro module');
    return;
  }
  const scheduleDates = schedules.map(schedule => schedule.payload?.weekStart);
  if (scheduleDates.some(date => typeof date !== 'string') || new Set(scheduleDates).size !== scheduleDates.length) throw fail('invalid_run_state', 'duplicate or missing weekly market schedule date');

  // Index once per validation pass. The prior implementation rescanned run history,
  // macro periods and weekly schedules for every scheduled week on every run validation.
  const macroSnapshotsByPeriod = groupRowsBy(state.modules.macro.periods, row => row.period);
  const schedulesByPeriod = groupRowsBy(schedules, row => row.payload?.weekStart?.slice(0, 7));
  const marketScheduleSourceById = new Map();
  for (const event of marketEvents) {
    if (event.type !== 'schedule_week') continue;
    if (!marketScheduleSourceById.has(event.eventId)) marketScheduleSourceById.set(event.eventId, event);
  }
  const runScheduleEventsByDate = new Map();
  const macroRunEventsByPeriod = new Map();
  for (const event of state.dayEvents) {
    if (event.phase === 'market_schedule') {
      const rows = runScheduleEventsByDate.get(event.occurredAt);
      if (rows) rows.push(event); else runScheduleEventsByDate.set(event.occurredAt, [event]);
    }
    if (event.phase === 'macro_month') {
      const period = event.result?.period;
      const rows = macroRunEventsByPeriod.get(period);
      if (rows) rows.push(event); else macroRunEventsByPeriod.set(period, [event]);
    }
  }
  recordDiagnosticCount('macroDemand.indexedRows', marketEvents.length + state.modules.macro.periods.length + state.dayEvents.length);
  recordDiagnosticCount('macroDemand.scheduleLookups', schedules.length * 4);

  for (const schedule of [...schedules].sort((a, b) => a.payload.weekStart.localeCompare(b.payload.weekStart))) {
    const weekStart = schedule.payload?.weekStart;
    const period = typeof weekStart === 'string' ? weekStart.slice(0, 7) : '';
    const templates = schedule.payload?.templates;
    if (!Array.isArray(templates) || !templates.length || templates.some(template => !template?.macroDemand)) throw fail('invalid_run_state', 'every shared V3 market week requires a D-0169 demand trace');
    const trace = templates[0].macroDemand;
    if (templates.some(template => stable(template.macroDemand) !== stable(trace)) || stable(schedule.result?.macroDemand) !== stable(trace)) throw fail('invalid_run_state', 'weekly D-0169 demand traces disagree across schedule payload and result');
    if (trace.exposure !== 1 || trace.runId !== state.runId || trace.scenarioId !== state.scenarioId) throw fail('invalid_run_state', 'shared V3 D-0169 trace has an unauthorized exposure or run/scenario identity');

    const matchingSnapshots = macroSnapshotsByPeriod.get(period) ?? [];
    if (matchingSnapshots.length !== 1) throw fail('invalid_run_state', 'weekly D-0169 trace requires exactly one authoritative macro-month snapshot');
    const snapshot = matchingSnapshots[0];
    const matchingMarketRunEvents = runScheduleEventsByDate.get(weekStart) ?? [];
    if (matchingMarketRunEvents.length !== 1) throw fail('invalid_run_state', 'weekly market schedule lacks one matching shared-run market event');
    const marketRunEvent = matchingMarketRunEvents[0];
    const marketScheduleId = `${eventId(state, weekStart)}|schedule`;
    const marketSourceId = `VM|${encodeURIComponent(state.modules.market.modelVersion)}|${encodeURIComponent(state.scenarioId)}|${encodeURIComponent(state.runId)}|${encodeURIComponent(state.seed)}|schedule_week|${encodeURIComponent(weekStart)}`;
    const marketSourceEvent = marketScheduleSourceById.get(marketSourceId);
    if (marketRunEvent.eventId !== marketScheduleId || marketRunEvent.sourceRef !== `market-week:${weekStart}` || !marketSourceEvent || stable(marketSourceEvent.payload?.templates) !== stable(templates) || stable(marketRunEvent.result) !== stable(marketSourceEvent.result)) throw fail('invalid_run_state', 'market schedule run event is not bound to its authoritative market-module event');
    const scheduleOpenFingerprint = state.dayOpenFingerprints[weekStart];
    let scheduleOpenPayload;
    try { scheduleOpenPayload = JSON.parse(scheduleOpenFingerprint); } catch { throw fail('invalid_run_state', 'market schedule cannot be recovered from its day-open replay fingerprint'); }
    if (scheduleOpenPayload?.date !== weekStart || stable(scheduleOpenPayload.marketWeekTemplates) !== stable(marketSourceEvent.payload.templates) || stable(scheduleOpenPayload.marketWeekTemplates) !== stable(templates)) throw fail('invalid_run_state', 'market schedule templates or D-0169 trace differ from the authoritative day-open replay input');

    const macroRunEvents = macroRunEventsByPeriod.get(period) ?? [];
    if (macroRunEvents.length !== 1) throw fail('invalid_run_state', 'macro-month snapshot lacks one matching shared-run source event');
    const macroEvent = macroRunEvents[0];
    const openFingerprint = state.dayOpenFingerprints[macroEvent.occurredAt];
    let openPayload;
    try { openPayload = JSON.parse(openFingerprint); } catch { throw fail('invalid_run_state', 'macro-month source cannot be recovered from the day-open replay fingerprint'); }
    const authoritativeInput = openPayload?.macroMonthInput;
    const activityInput = authoritativeInput?.activity;
    if (openPayload?.date !== macroEvent.occurredAt || authoritativeInput?.period !== period || !activityInput || stable(authoritativeInput) !== snapshot.inputFingerprint || macroEvent.result?.sourceSnapshotId !== snapshot.sourceSnapshotId) throw fail('invalid_run_state', 'macro-month snapshot is not bound to its recorded day-open input and source event');
    const expectedGap = 100 * (activityInput.activityIndex / activityInput.trendIndex - 1);
    if (!Number.isFinite(expectedGap) || snapshot.activity.activityGapPct !== expectedGap || snapshot.activity.sourceType !== activityInput.sourceType || snapshot.activity.sourceRef !== activityInput.sourceRef) throw fail('invalid_run_state', 'macro-month activity snapshot disagrees with its recorded source input');
    if (trace.weekStart !== weekStart || trace.activityGapPct !== expectedGap || trace.activitySourceType !== activityInput.sourceType || trace.activitySourceRef !== activityInput.sourceRef) throw fail('invalid_run_state', 'weekly D-0169 trace is not bound to the authoritative macro-month activity source');
    if ((trace.macroSnapshotPeriod != null && trace.macroSnapshotPeriod !== period) || (trace.macroSnapshotId != null && trace.macroSnapshotId !== snapshot.sourceSnapshotId)) throw fail('invalid_run_state', 'weekly D-0169 trace snapshot identity does not match its authoritative macro month');
    const expectedBase = buildV3BaseMarketTemplates(weekStart, state.seed, trace);
    const expectedTemplates = allocateV3ForeignDemandTemplates(expectedBase, {
      runId: state.runId, scenarioId: state.scenarioId, seed: state.seed, period,
      segments: state.modules.market.segments, effectiveMacroEvents: state.modules.macro.events,
      priorWeeks: (schedulesByPeriod.get(period) ?? [])
        .filter(prior => prior.payload?.weekStart < weekStart)
        .map(prior => ({ weekStart: prior.payload.weekStart, templates: prior.payload.templates })),
      fixtureSelected: (state.foreignDemandFixtureId ?? 'NEUTRAL') === V3_FOREIGN_DEMAND_FIXTURE_ID,
      segmentTemplates: getV3RunSegmentTemplates(state.modules.market.segments, period)
    });
    if (stable(expectedTemplates) !== stable(templates)) throw fail('invalid_run_state', 'weekly market templates differ from deterministic D-0169 plus L2 foreign-demand replay');
  }
}
function validateMacroHistoryAgainstDayOpenInputs(state) {
  const storedMacro = state.modules.macro;
  if (!storedMacro?.periods?.length) return;
  const sourceEvents = state.dayEvents.filter(event => event.phase === 'macro_month');
  if (sourceEvents.length !== storedMacro.periods.length) throw fail('invalid_run_state', 'macro snapshots and authoritative day-open source events do not match');
  let replay;
  try {
    replay = createV3MacroState({
      runId: storedMacro.runId, scenarioId: storedMacro.scenarioId, seed: storedMacro.seed,
      profileVersion: storedMacro.profileVersion, sourceSnapshotId: storedMacro.sourceSnapshotId,
      cycleParameters: storedMacro.cycleParameters, mroFutureRule: storedMacro.mroFutureRule ?? undefined,
    });
  } catch (error) { throw fail('invalid_run_state', `macro replay profile is invalid: ${error.message}`); }
  for (const snapshot of storedMacro.periods) {
    const matching = sourceEvents.filter(event => event.result?.period === snapshot.period);
    if (matching.length !== 1) throw fail('invalid_run_state', 'macro period does not have exactly one day-open source event');
    const sourceEvent = matching[0];
    let openPayload;
    try { openPayload = JSON.parse(state.dayOpenFingerprints[sourceEvent.occurredAt]); }
    catch { throw fail('invalid_run_state', `macro policy source cannot be recovered from the day-open fingerprint for ${sourceEvent.occurredAt}`); }
    const authoritativeInput = openPayload?.macroMonthInput;
    if (openPayload?.date !== sourceEvent.occurredAt || authoritativeInput?.period !== snapshot.period || stable(authoritativeInput) !== snapshot.inputFingerprint || sourceEvent.sourceRef !== `macro-period:${snapshot.period}`) throw fail('invalid_run_state', 'macro snapshot is not bound to its authoritative day-open input');
    const channel = authoritativeInput?.externalChannels?.business_input_cost_plan;
    const costPlanFixtureId = state.costPlanFixtureId ?? 'NEUTRAL';
    if (costPlanFixtureId === V3_COST_PLAN_FIXTURE_ID && snapshot.period === '2027-01'
      && stable(channel) !== stable(buildSyntheticCostPlanChannel('2027-01'))) throw fail('invalid_run_state', 'selected synthetic cost-plan profile differs from its authoritative January macro input');
    if (costPlanFixtureId === V3_COST_PLAN_FIXTURE_ID && snapshot.period !== '2027-01'
      && (channel?.testFixtureId === V3_COST_PLAN_FIXTURE_ID || channel?.parameterSetId === V3_COST_PLAN_FIXTURE_ID || channel?.components || channel?.weights)) throw fail('invalid_run_state', 'synthetic cost-plan fixture may only be introduced by the January 2027 macro input');
    const foreignChannel = authoritativeInput?.externalChannels?.foreign_demand;
    const foreignDemandFixtureId = state.foreignDemandFixtureId ?? 'NEUTRAL';
    const runPath = decodeURIComponent(state.runId.split('|')[4] ?? '');
    if (foreignDemandFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID && snapshot.period === '2027-01'
      && stable(foreignChannel) !== stable(buildSyntheticForeignDemandChannel('2027-01', runPath))) throw fail('invalid_run_state', 'selected synthetic foreign-demand profile differs from its authoritative January macro input');
    if ((foreignDemandFixtureId === 'NEUTRAL' || snapshot.period !== '2027-01') && foreignChannel?.testFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID) throw fail('invalid_run_state', 'foreign-demand fixture is unselected or outside its January 2027 source period');
    const importPriceBenchmarkId = state.importPriceBenchmarkId ?? 'NEUTRAL';
    if (!['NEUTRAL', V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID].includes(importPriceBenchmarkId)) throw fail('invalid_run_state', 'unknown Destatis import-price benchmark selection');
    const importPriceReference = authoritativeInput?.destatisImportPriceBenchmark ?? null;
    if (importPriceReference != null) {
      try { validateV3DestatisImportPriceBenchmark(importPriceReference, { period: snapshot.period }); }
      catch (error) { throw fail('invalid_run_state', `Destatis import-price source reference failed validation: ${error.message}`); }
      const expectedReference = importPriceBenchmarkId === V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID
        ? buildV3DestatisImportPriceBenchmark(snapshot.period) : null;
      if (!expectedReference || stable(importPriceReference) !== stable(expectedReference)) throw fail('invalid_run_state', 'Destatis import-price source is unselected, pre-release, future, or differs from its immutable source vintage');
    }
    const fxChannel = authoritativeInput?.externalChannels?.fx_imported_inputs;
    const fxOfferPlanFixtureId = state.fxOfferPlanFixtureId ?? 'NEUTRAL';
    if (!['NEUTRAL', V3_FX_OFFER_PLAN_FIXTURE_ID].includes(fxOfferPlanFixtureId)) throw fail('invalid_run_state', 'unknown FX offer-plan fixture selection');
    if (fxOfferPlanFixtureId === V3_FX_OFFER_PLAN_FIXTURE_ID
      && stable(fxChannel) !== stable(buildSyntheticFxOfferPlanChannel(snapshot.period, runPath))) throw fail('invalid_run_state', 'selected synthetic FX offer-plan source differs from its authoritative macro input');
    if (fxOfferPlanFixtureId === 'NEUTRAL' && fxChannel?.sourceRef?.startsWith('synthetic-fixture:T-0070:')) throw fail('invalid_run_state', 'T-0070 FX offer-plan fixture is present although not selected');
    const replayed = runV3MacroMonth(replay, authoritativeInput);
    if (!replayed.ok || stable(replayed.snapshot) !== stable(snapshot)) throw fail('invalid_run_state', 'macro event history differs from deterministic replay of its authoritative day-open input');
    replay = replayed.state;
  }
  if (stable(replay) !== stable(storedMacro)) throw fail('invalid_run_state', 'macro state event/history copies differ from authoritative day-open replay');
}
function f3DeadlineDate(deliveryDate) {
  let date = deliveryDate; let remaining = 5;
  while (remaining > 0) { date = shiftDate(date, 1); if (isWorkday(date)) remaining -= 1; }
  return date;
}
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
function validContractPartyAuthority(contract, order) {
  if (!contract || contract.customerPartyId !== order.customerPartyId || !nonEmpty(contract.acceptancePartyId)) return false;
  if (contract.acceptancePartyId === order.customerPartyId) return contract.authorizedForRef == null && contract.partyAuthorityRef == null;
  return contract.authorizedForRef === order.customerPartyId && nonEmpty(contract.partyAuthorityRef);
}
function isAuthorizedAcceptanceActor(input, order, contract, playerPartyId) {
  if (!order || !contract || input.actorPartyId === playerPartyId || input.customerRef !== order.customerPartyId) return false;
  if (input.actorRole === 'customer') {
    return input.actorPartyId === order.customerPartyId
      && input.authorizedForRef == null && input.partyAuthorityRef == null;
  }
  return input.actorRole === 'recipient'
    && contract.acceptancePartyId !== order.customerPartyId
    && input.actorPartyId === contract.acceptancePartyId
    && contract.authorizedForRef === order.customerPartyId
    && nonEmpty(contract.partyAuthorityRef)
    && input.authorizedForRef === order.customerPartyId
    && input.partyAuthorityRef === contract.partyAuthorityRef;
}
function expectedProductDate(state) {
  if (state.currentDate < state.startDate) return state.startDate;
  let date = state.currentDate;
  while (date >= state.startDate && !isWorkday(date)) date = shiftDate(date, -1);
  return date < state.startDate ? state.startDate : date;
}

/**
 * Create a shared, serializable V3 run envelope around already-created module states.
 * It wires only existing module contracts; missing operational/accounting functionality stays pending.
 */
export function createV3Run({ runId, scenarioId, seed, startDate, endDate, marketState, macroState = null, formationState = null, productState = null, costPlanFixtureId = 'NEUTRAL', foreignDemandFixtureId = 'NEUTRAL', importPriceBenchmarkId = 'NEUTRAL', fxOfferPlanFixtureId = 'NEUTRAL', marketInvitationProfileId = 'NEUTRAL' }) {
  if (![runId, scenarioId, String(seed ?? '')].every(value => typeof value === 'string' && value.trim())) throw new TypeError('runId, scenarioId and seed are required');
  if (!isDate(startDate) || !isDate(endDate) || endDate < startDate) throw new TypeError('startDate/endDate must be an ordered valid ISO date range');
  if (!['NEUTRAL', V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID].includes(importPriceBenchmarkId)) throw new TypeError('unknown Destatis import-price benchmark selection');
  if (!['NEUTRAL', V3_FX_OFFER_PLAN_FIXTURE_ID].includes(fxOfferPlanFixtureId)) throw new TypeError('unknown FX offer-plan fixture selection');
  if (!['NEUTRAL', V3_MARKET_INVITATION_PRICE_PROFILE_ID].includes(marketInvitationProfileId)) throw new TypeError('unknown market invitation profile selection');
  if (!marketState) throw new TypeError('marketState is required');
  validateV3MarketState(marketState);
  if (marketState.runId !== runId || marketState.scenarioId !== scenarioId || marketState.seed !== seed || marketState.startDate !== startDate || marketState.currentDate !== shiftDate(startDate, -1)) throw new TypeError('market state identity/date must match the shared run start');
  if (macroState) {
    validateV3MacroState(macroState);
    if (macroState.runId !== runId || macroState.scenarioId !== scenarioId || macroState.seed !== seed) throw new TypeError('macro state identity must match the shared run');
  }
  if (formationState) {
    const validation = validateV3FormationState(formationState);
    if (!validation.valid || formationState.scenarioId !== scenarioId || formationState.startDate !== startDate) throw new TypeError('formation state must be valid and match the shared run scenario/date');
  }
  if (productState && (productState.version !== V3_PRODUCT_VERSION || !Array.isArray(productState.customerAssignments) || !Array.isArray(productState.customerWorkOrderPlans) || productState.runId !== runId || productState.currentDate !== startDate)) throw new TypeError('product state identity/date/version must match the shared run');
  const state = {
    modelVersion: V3_RUN_ORCHESTRATOR_VERSION,
    runId, scenarioId, seed, startDate, endDate, currentDate: shiftDate(startDate, -1), costPlanFixtureId, foreignDemandFixtureId, importPriceBenchmarkId, fxOfferPlanFixtureId, marketInvitationProfileId,
    modules: { market: clone(marketState), macro: macroState ? clone(macroState) : null, formation: formationState ? clone(formationState) : null, product: productState ? clone(productState) : null },
    learning: createV3LearningRunState({ runId, scenarioId, seed: String(seed), startDate, marketState, productState }),
    customerWorkOrders: [],
    financeHandoffs: [],
    dayEvents: [],
    processedDays: {},
    activeDay: null,
    dayOpenFingerprints: {},
    dayInputFingerprints: {},
  };
  validateV3RunState(state);
  return state;
}

/** Validate shared-run identity, module clocks and exactly one run-result record per processed date. */
function validateV3RunStateCore(state) {
  if (!state || state.modelVersion !== V3_RUN_ORCHESTRATOR_VERSION || !state.modules || !state.processedDays || !state.dayOpenFingerprints || !state.dayInputFingerprints || !Array.isArray(state.dayEvents) || !Array.isArray(state.customerWorkOrders) || !Array.isArray(state.financeHandoffs)) throw fail('invalid_run_state', 'invalid shared V3 run state shape');
  const firstBy = (rows, keyOf) => {
    const index = new Map();
    for (const row of rows) { const key = keyOf(row); if (!index.has(key)) index.set(key, row); }
    return index;
  };
  const dayEventByPhaseSource = firstBy(state.dayEvents, event => `${event.phase}|${event.sourceRef}`);
  const dayEventById = firstBy(state.dayEvents, event => event.eventId);
  const marketEvents = state.modules.market?.events ?? [];
  const marketEventByTypePayloadId = firstBy(marketEvents, event => `${event.type}|${event.payload?.eventId}|${event.payload?.firmId}`);
  const customerWorkOrderById = firstBy(state.customerWorkOrders, order => order.workOrderId);
  const plans = state.modules.product?.customerWorkOrderPlans ?? [];
  const productPlanByOrderId = firstBy(plans, plan => plan.workOrderId);
  const operationBySource = new Map();
  for (const plan of plans) for (const operation of plan.operations ?? []) operationBySource.set(`${plan.workOrderId}|${operation.operationId}`, { plan, operation });
  const productMovementsById = firstBy(state.modules.product?.finishedGoodsMovements ?? [], movement => movement.movementId);
  const operationEventBySource = firstBy(state.dayEvents.filter(event => event.phase === 'customer_operation_completed'), event => event.sourceRef);
  const marketDecisionEventsByInquiry = new Map();
  for (const event of marketEvents) {
    const decisions = event.type === 'advance_day' ? event.result?.decisions ?? [] : event.type === 'submit_counter_response' && event.result?.inquiryId ? [event.result] : [];
    for (const decision of decisions) {
      if (!decision?.inquiryId) continue;
      const rows = marketDecisionEventsByInquiry.get(decision.inquiryId) ?? [];
      rows.push({ event, decision });
      marketDecisionEventsByInquiry.set(decision.inquiryId, rows);
    }
  }
  if (![state.runId, state.scenarioId, state.seed].every(value => typeof value === 'string' && value.trim()) || !isDate(state.startDate) || !isDate(state.endDate) || state.endDate < state.startDate || !isDate(state.currentDate)) throw fail('invalid_run_state', 'invalid shared V3 run identity/date');
  const costPlanFixtureId = state.costPlanFixtureId ?? 'NEUTRAL';
  if (!['NEUTRAL', V3_COST_PLAN_FIXTURE_ID].includes(costPlanFixtureId)) throw fail('invalid_run_state', 'unknown cost-plan fixture selection');
  const foreignDemandFixtureId = state.foreignDemandFixtureId ?? 'NEUTRAL';
  if (!['NEUTRAL', V3_FOREIGN_DEMAND_FIXTURE_ID].includes(foreignDemandFixtureId)) throw fail('invalid_run_state', 'unknown foreign-demand fixture selection');
  const importPriceBenchmarkId = state.importPriceBenchmarkId ?? 'NEUTRAL';
  if (!['NEUTRAL', V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID].includes(importPriceBenchmarkId)) throw fail('invalid_run_state', 'unknown Destatis import-price benchmark selection');
  const fxOfferPlanFixtureId = state.fxOfferPlanFixtureId ?? 'NEUTRAL';
  if (!['NEUTRAL', V3_FX_OFFER_PLAN_FIXTURE_ID].includes(fxOfferPlanFixtureId)) throw fail('invalid_run_state', 'unknown FX offer-plan fixture selection');
  const marketInvitationProfileId = state.marketInvitationProfileId ?? 'NEUTRAL';
  if (!['NEUTRAL', V3_MARKET_INVITATION_PRICE_PROFILE_ID].includes(marketInvitationProfileId)) throw fail('invalid_run_state', 'unknown market invitation profile selection');
  if (state.runId.startsWith('V3|')) {
    const runParts = state.runId.split('|');
    let encodedSelection = 'NEUTRAL';
    try {
      if (runParts.length === 6) encodedSelection = decodeURIComponent(runParts[5]);
      else if (runParts.length === 7) encodedSelection = decodeURIComponent(runParts[5]);
      else if (runParts.length === 8 || runParts.length === 9 || runParts.length === 10) encodedSelection = decodeURIComponent(runParts[5]);
      else if (runParts.length !== 5) throw new Error('invalid parts');
    } catch { throw fail('invalid_run_state', 'V3 cost-plan fixture selection has a malformed run ID binding'); }
    if (encodedSelection !== costPlanFixtureId) throw fail('invalid_run_state', 'cost-plan fixture selection differs from its immutable run identity');
    let exportSelection = 'NEUTRAL';
    let importPriceSelection = 'NEUTRAL';
    try {
      if (runParts.length >= 7) exportSelection = decodeURIComponent(runParts[6]);
      if (runParts.length >= 8) importPriceSelection = decodeURIComponent(runParts[7]);
    }
    catch { throw fail('invalid_run_state', 'V3 foreign-demand fixture selection has a malformed run ID binding'); }
    if (exportSelection !== foreignDemandFixtureId) throw fail('invalid_run_state', 'foreign-demand fixture selection differs from its immutable run identity');
    if (importPriceSelection !== importPriceBenchmarkId) throw fail('invalid_run_state', 'Destatis benchmark selection differs from its immutable run identity');
    const fxSelection = runParts.length >= 9 ? decodeURIComponent(runParts[8]) : 'NEUTRAL';
    if (fxSelection !== fxOfferPlanFixtureId) throw fail('invalid_run_state', 'FX offer-plan fixture selection differs from its immutable run identity');
    const invitationProfileSelection = runParts.length === 10 ? decodeURIComponent(runParts[9]) : 'NEUTRAL';
    if (invitationProfileSelection !== marketInvitationProfileId) throw fail('invalid_run_state', 'market invitation profile differs from its immutable run identity');
    const usesPriceWeight = state.modules?.market?.parameters?.invitationWeights?.price !== undefined;
    if (usesPriceWeight !== (marketInvitationProfileId === V3_MARKET_INVITATION_PRICE_PROFILE_ID)) throw fail('invalid_run_state', 'market invitation weights do not match the immutable profile');
  }
  measureDiagnostic(`learning@${activeV3RunDiagnosticPhase}`, () => validateV3LearningRunState(state.learning, state));
  const latestDate = Object.keys(state.processedDays).sort().at(-1) ?? shiftDate(state.startDate, -1);
  const activeDate = state.activeDay?.date ?? null;
  if (state.currentDate !== (activeDate ?? latestDate) || state.currentDate < shiftDate(state.startDate, -1) || state.currentDate > state.endDate) throw fail('invalid_run_state', 'shared run date does not match processed day history');
  if (state.activeDay && (!isDate(activeDate) || !state.activeDay.openFingerprint || state.processedDays[activeDate] || state.dayOpenFingerprints[activeDate] !== state.activeDay.openFingerprint)) throw fail('invalid_run_state', 'active day phase is inconsistent with run history');
  measureDiagnostic(`market@${activeV3RunDiagnosticPhase}`, () => validateV3MarketState(state.modules.market));
  if (state.modules.market.runId !== state.runId || state.modules.market.scenarioId !== state.scenarioId || state.modules.market.seed !== state.seed || state.modules.market.currentDate !== state.currentDate || state.modules.market.dayPhase !== (state.activeDay ? 'actions' : 'closed')) throw fail('invalid_run_state', 'market module identity or date is inconsistent with shared run');
  if (state.modules.macro) {
    measureDiagnostic(`macro@${activeV3RunDiagnosticPhase}`, () => validateV3MacroState(state.modules.macro));
    if (state.modules.macro.runId !== state.runId || state.modules.macro.scenarioId !== state.scenarioId || state.modules.macro.seed !== state.seed) throw fail('invalid_run_state', 'macro module identity is inconsistent with shared run');
    measureDiagnostic(`macroHistory@${activeV3RunDiagnosticPhase}`, () => validateMacroHistoryAgainstDayOpenInputs(state));
    const latestMacroPeriod = state.modules.macro.periods.at(-1)?.period;
    if (latestMacroPeriod && latestMacroPeriod > (activeDate ?? state.currentDate).slice(0, 7)) throw fail('invalid_run_state', 'macro snapshot period is ahead of the shared run date');
  }
  measureDiagnostic(`macroDemandBindings@${activeV3RunDiagnosticPhase}`, () => validateMacroDemandSnapshotBindings(state));
  if (state.modules.formation) {
    const formation = measureDiagnostic(`formation@${activeV3RunDiagnosticPhase}`, () => validateV3FormationState(state.modules.formation));
    if (!formation.valid || state.modules.formation.scenarioId !== state.scenarioId || state.modules.formation.startDate !== state.startDate) throw fail('invalid_run_state', 'formation module is inconsistent with shared run');
  }
  if (state.modules.product) {
    try { measureDiagnostic(`product@${activeV3RunDiagnosticPhase}`, () => validateV3ProductWorkdayAssignments(state.modules.product)); }
    catch (error) { throw fail('invalid_run_state', `product calendar state is invalid: ${error.message}`); }
    if (state.modules.product.version !== V3_PRODUCT_VERSION || !Array.isArray(state.modules.product.customerAssignments) || !Array.isArray(state.modules.product.customerWorkOrderPlans) || state.modules.product.runId !== state.runId || state.modules.product.currentDate !== expectedProductDate(state)) throw fail('invalid_run_state', 'product module identity/date/version is inconsistent with shared run');
  }
  const equipmentInstructionEvents = state.dayEvents.filter(event => event.phase === 'equipment_instruction_completed');
  const equipmentInstructionPlanEvents = state.dayEvents.filter(event => event.phase === 'equipment_instruction_planned');
  const specialAuthorizationEvents = state.dayEvents.filter(event => event.phase === 'special_equipment_authorization_completed');
  const instructionPlans = state.modules.product?.equipmentInstructionPlans ?? [];
  const missedInstructionEvents = state.dayEvents.filter(event => event.phase === 'equipment_instruction_missed');
  const missedInstructionPlans = instructionPlans.filter(plan => plan.status === 'missed');
  const instructionRecords = state.modules.product?.equipmentInstructions ?? [];
  const authorizationRecords = state.modules.product?.specialEquipmentAuthorizations ?? [];
  if (equipmentInstructionPlanEvents.length !== instructionPlans.length || equipmentInstructionEvents.length !== instructionRecords.length || specialAuthorizationEvents.length !== authorizationRecords.length || missedInstructionEvents.length !== missedInstructionPlans.length) throw fail('invalid_run_state', 'equipment instruction/authorization records and shared-run events disagree');
  for (const plan of instructionPlans) {
    const event = equipmentInstructionPlanEvents.find(item => item.sourceRef === plan.sourceRef);
    const plannedSnapshot = clone(plan); plannedSnapshot.status = 'planned';
    if (!event || event.occurredAt > plan.plannedDate || event.eventId !== `${eventId(state, event.occurredAt)}|equipment-instruction-planned|${encodeURIComponent(plan.instructionId)}` || stable(event.result?.plan) !== stable(plannedSnapshot) || event.result?.inputFingerprint !== stable({ instructionId: plan.instructionId, personId: plan.personId, equipmentId: plan.equipmentId, plannedDate: plan.plannedDate, sourceRef: plan.sourceRef })) throw fail('invalid_run_state', 'equipment instruction plan lacks a matching shared-run source event');
  }
  for (const plan of missedInstructionPlans) {
    const event = missedInstructionEvents.find(item => item.sourceRef === plan.sourceRef);
    const productEvent = state.modules.product.events.find(item => item.type === 'equipment_instruction_missed' && item.instructionId === plan.instructionId);
    if (!event || !productEvent || event.occurredAt !== productEvent.date || event.eventId !== `${eventId(state, event.occurredAt)}|equipment-instruction-missed|${encodeURIComponent(plan.instructionId)}` || event.result?.plannedDate !== plan.plannedDate || event.result?.reason !== productEvent.reason) throw fail('invalid_run_state', 'missed equipment instruction lacks its shared-run source event');
  }
  for (const record of instructionRecords) {
    const event = equipmentInstructionEvents.find(item => item.sourceRef === record.sourceRef);
    if (!event || event.occurredAt !== record.completedAt || event.eventId !== `${eventId(state, record.completedAt)}|equipment-instruction|${encodeURIComponent(record.instructionId)}` || stable(event.result?.record) !== stable(record)) throw fail('invalid_run_state', 'equipment instruction lacks a matching shared-run source event');
  }
  for (const record of authorizationRecords) {
    const event = specialAuthorizationEvents.find(item => item.sourceRef === record.sourceRef);
    if (!event || event.occurredAt !== record.completedAt || event.eventId !== `${eventId(state, record.completedAt)}|equipment-authorization|${encodeURIComponent(record.authorizationId)}` || stable(event.result?.record) !== stable(record) || event.result?.inputFingerprint !== stable({ authorizationId: record.authorizationId, personId: record.personId, equipmentId: record.equipmentId, requirementRef: record.requirementRef, completedAt: record.completedAt, sourceRef: record.sourceRef })) throw fail('invalid_run_state', 'special equipment authorization lacks a matching shared-run source event');
  }
  const materialShipments = state.modules.product?.materialShipments ?? [];
  const materialOrders = state.dayEvents.filter(event => event.phase === 'international_material_order');
  const materialReceipts = state.dayEvents.filter(event => event.phase === 'international_material_receipt');
  const supplierInvoices = state.dayEvents.filter(event => event.phase === 'supplier_invoice_evidence');
  if (materialOrders.length !== materialShipments.length || materialReceipts.length !== (state.modules.product?.materialMovements ?? []).length || supplierInvoices.length !== (state.modules.product?.supplierInvoiceEvidence ?? []).length) throw fail('invalid_run_state', 'international material shipment and supplier invoice histories disagree');
  for (const shipment of materialShipments) {
    const orderEvent = materialOrders.find(event => event.sourceRef === shipment.orderId);
    const orderSnapshot = clone(shipment); delete orderSnapshot.status; delete orderSnapshot.receivedAt;
    if (!orderEvent || orderEvent.eventId !== `${eventId(state, orderEvent.occurredAt)}|material-order|${encodeURIComponent(shipment.orderId)}` || stable(orderEvent.result?.shipment) !== stable(orderSnapshot)) throw fail('invalid_run_state', 'international material order lacks its matching shared-run event');
    if (shipment.status === 'received') {
      const receipt = materialReceipts.find(event => event.sourceRef === shipment.shipmentId);
      const movement = state.modules.product.materialMovements.find(row => row.shipmentId === shipment.shipmentId);
      if (!receipt || !movement || receipt.eventId !== `${eventId(state, movement.date)}|material-receipt|${encodeURIComponent(shipment.shipmentId)}` || receipt.occurredAt !== movement.date || receipt.result?.movementId !== movement.movementId || receipt.result?.quantityAfter !== movement.quantityAfter) throw fail('invalid_run_state', 'international material receipt lacks its matching shared-run event');
      const invoice = state.modules.product.supplierInvoiceEvidence.find(row => row.shipmentId === shipment.shipmentId);
      const invoiceEvent = supplierInvoices.find(event => event.sourceRef === invoice?.invoiceId);
      if (!invoice || !invoiceEvent || invoiceEvent.eventId !== `${eventId(state, invoice.invoiceDate)}|supplier-invoice|${encodeURIComponent(invoice.invoiceId)}` || stable(invoiceEvent.result?.invoice) !== stable(invoice)) throw fail('invalid_run_state', 'supplier invoice evidence lacks its matching shared-run event');
    } else if (materialReceipts.some(event => event.sourceRef === shipment.shipmentId)) throw fail('invalid_run_state', 'unreceived international shipment has a shared-run receipt event');
  }
  const dayRecords = state.dayEvents.filter(event => event.phase === 'day_result');
  if (dayRecords.length !== Object.keys(state.processedDays).length || dayRecords.some(event => !state.processedDays[event.date] || event.eventId !== `${eventId(state, event.date)}|run-result`)) throw fail('invalid_run_state', 'processed day index and run-result history disagree');
  if (activeDate && !state.dayEvents.some(event => event.eventId === `${eventId(state, activeDate)}|market-open` && event.phase === 'market_decisions_and_inquiries')) throw fail('invalid_run_state', 'active day lacks its market-open event');
  for (const [date, fingerprint] of Object.entries(state.dayOpenFingerprints)) if (!isDate(date) || typeof fingerprint !== 'string' || !fingerprint) throw fail('invalid_run_state', 'day-open replay index contains invalid entries');
  for (const [date, fingerprint] of Object.entries(state.dayInputFingerprints)) if (!isDate(date) || typeof fingerprint !== 'string' || !fingerprint || !state.processedDays[date]) throw fail('invalid_run_state', 'closed-day replay index contains invalid entries');
  const eventIds = state.dayEvents.map(event => event.eventId);
  if (eventIds.some(id => typeof id !== 'string' || !id) || new Set(eventIds).size !== eventIds.length) throw fail('invalid_run_state', 'run event history contains missing or duplicate event IDs');
  const allowedPhases = new Set(['market_schedule', 'macro_month', 'formation', 'product_calendar', 'market_decisions_and_inquiries', 'work_order_created', 'player_offer', 'player_counter_response', 'market_expiry', 'day_result', 'customer_work_order_plan', 'customer_operation_completed', 'customer_delivery', 'customer_acceptance_decision', 'customer_order_cancelled_before_shipment', 'customer_goods_returned', 'product_cost_lot', 'product_sale_offer', 'product_sale_buyer_decision', 'product_sale_dispatch', 'international_material_order', 'international_material_receipt', 'supplier_invoice_evidence', 'equipment_instruction_planned', 'equipment_instruction_completed', 'equipment_instruction_missed', 'special_equipment_authorization_completed']);
  if (state.dayEvents.some(event => !allowedPhases.has(event.phase))) throw fail('invalid_run_state', 'run history contains an unapproved phase, including an unauthorized delivery or finance effect');
  const playerIdForEvents = state.modules.market.firms.find(firm => firm.role === 'player')?.firmId;
  for (const event of state.dayEvents.filter(item => item.phase === 'player_offer')) {
    const source = marketEventByTypePayloadId.get(`submit_offer|${event.sourceRef}|${playerIdForEvents}`);
    if (!source || event.eventId !== `${eventId(state, event.occurredAt)}|offer|${encodeURIComponent(event.sourceRef)}` || stable(source.result) !== stable(event.result)) throw fail('invalid_run_state', 'player offer run event is not backed by its market source event');
  }
  for (const event of state.dayEvents.filter(item => item.phase === 'player_counter_response')) {
    const source = marketEventByTypePayloadId.get(`submit_counter_response|${event.sourceRef}|${playerIdForEvents}`);
    if (!source || event.eventId !== `${eventId(state, event.occurredAt)}|counter-response|${encodeURIComponent(event.sourceRef)}` || stable(source.result) !== stable(event.result)) throw fail('invalid_run_state', 'player counter response run event is not backed by its market source event');
  }
  for (const source of state.modules.market.events.filter(item => item.type === 'submit_offer' && item.payload?.firmId === playerIdForEvents)) {
    const matching = dayEventByPhaseSource.get(`player_offer|${source.payload.eventId}`);
    if (!matching) throw fail('invalid_run_state', 'player market offer is missing from the shared run event history');
  }
  for (const source of state.modules.market.events.filter(item => item.type === 'submit_counter_response' && item.payload?.firmId === playerIdForEvents)) {
    const matching = dayEventByPhaseSource.get(`player_counter_response|${source.payload.eventId}`);
    if (!matching) throw fail('invalid_run_state', 'player counter-response market event is missing from shared-run history');
  }
  const playerId = state.modules.market.firms.find(firm => firm.role === 'player')?.firmId;
  const marketDecisionId = inquiry => `VM|${encodeURIComponent(state.modules.market.modelVersion)}|${encodeURIComponent(state.modules.market.scenarioId)}|${encodeURIComponent(state.modules.market.runId)}|${encodeURIComponent(state.modules.market.seed)}|customer_decision|${encodeURIComponent(inquiry.inquiryId)}`;
  const eligibleDecisions = [];
  for (const inquiry of state.modules.market.inquiries) {
    if (inquiry.status !== 'resolved' || inquiry.winnerFirmId !== playerId) continue;
    const acceptedOffer = inquiry.offers.find(offer => offer.offerId === inquiry.winningOfferId && offer.firmId === playerId && offer.status === 'accepted');
    const decisionId = marketDecisionId(inquiry);
    const sourceEvent = (marketDecisionEventsByInquiry.get(inquiry.inquiryId) ?? []).find(({ event, decision }) => {
      const dayDecision = event.type === 'advance_day'
        && event.occurredAt === inquiry.decidedAt
        && event.payload?.date === inquiry.decidedAt
        && decision.inquiryId === inquiry.inquiryId
        && decision.decisionId === decisionId
        && decision.winnerFirmId === playerId
        && decision.winningOfferId === inquiry.winningOfferId
        && decision.acceptedAt === inquiry.decidedAt
        && decision.decisionEventId === `${event.eventId}|decision|${inquiry.inquiryId}`;
      const immediateCounterAcceptance = event.type === 'submit_counter_response'
        && event.occurredAt === inquiry.decidedAt
        && decision.decisionId === decisionId
        && decision.inquiryId === inquiry.inquiryId
        && decision.winnerFirmId === playerId
        && decision.winningOfferId === inquiry.winningOfferId
        && decision.acceptedAt === inquiry.decidedAt
        && event.result?.decisionEventId === `${event.eventId}|decision|${inquiry.inquiryId}`;
      return dayDecision || immediateCounterAcceptance;
    });
    if (!acceptedOffer || inquiry.decisionId !== decisionId || !sourceEvent) throw fail('invalid_run_state', 'player work-order source is not backed by an accepted offer and its market decision event');
    eligibleDecisions.push(inquiry);
  }
  if (state.customerWorkOrders.length !== eligibleDecisions.length) throw fail('invalid_run_state', 'customer work orders do not match accepted player market decisions');
  const expectedOrders = new Map(eligibleDecisions.map(inquiry => {
    const workOrderId = `WORK|${encodeURIComponent(state.runId)}|${encodeURIComponent(inquiry.decisionId)}`;
    const plan = productPlanByOrderId.get(workOrderId);
    const winningOffer = inquiry.offers.find(offer => offer.offerId === inquiry.winningOfferId);
    return [inquiry.decisionId, { workOrderId, runId: state.runId, inquiryId: inquiry.inquiryId, customerPartyId: inquiry.customerId, decisionId: inquiry.decisionId, offerId: inquiry.winningOfferId, acceptedAt: inquiry.decidedAt, ...(winningOffer?.commercialTerms ? { contractTermsSnapshot: clone(winningOffer.commercialTerms) } : {}), status: plan?.status ?? 'awaiting_operational_plan', financeStatus: plan?.financeStatus ?? 'pending_non_posting' }];
  }));
  for (const order of state.customerWorkOrders) {
    const expected = expectedOrders.get(order.decisionId);
    if (!expected || stable(order) !== stable(expected)) throw fail('invalid_run_state', 'customer work order is unbacked or has an unauthorized status/field');
    const createdEvent = dayEventByPhaseSource.get(`work_order_created|${order.decisionId}`);
    if (!createdEvent || createdEvent.eventId !== `${eventId(state, order.acceptedAt)}|work-order|${encodeURIComponent(order.decisionId)}` || stable(createdEvent.result?.contractTermsSnapshot ?? null) !== stable(expected.contractTermsSnapshot ?? null)) throw fail('invalid_run_state', 'customer work order is missing its accepted-decision run event or terms binding');
  }
  if (!Array.isArray(plans) || new Set(plans.map(plan => plan.workOrderId)).size !== plans.length) throw fail('invalid_run_state', 'customer operation plans contain duplicate work-order references');
  const planEvents = state.dayEvents.filter(event => event.phase === 'customer_work_order_plan');
  if (planEvents.length !== plans.length) throw fail('invalid_run_state', 'customer plan events and T-0066 work-order plans disagree');
  for (const plan of plans) {
    const order = customerWorkOrderById.get(plan.workOrderId);
    const planEvent = dayEventByPhaseSource.get(`customer_work_order_plan|${plan.workOrderId}`);
    if (!order || !planEvent || !plan.contractSnapshot || plan.contractSnapshot.inquiryId !== order.inquiryId || plan.contractSnapshot.offerId !== order.offerId || plan.contractSnapshot.decisionId !== order.decisionId || !validContractPartyAuthority(plan.contractSnapshot, order) || plan.contractSnapshot.contractType !== V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType || stable(plan.contractSnapshot.commercialTermsSnapshot ?? null) !== stable(order.contractTermsSnapshot ?? null) || stable(order.contractTermsSnapshot?.contractClassification ?? null) !== stable(V3_METAL_GOODS_CONTRACT_CLASSIFICATION) || stable(order.contractTermsSnapshot?.acceptanceScenario ?? null) !== stable(V3_D0157_F3_CONDITION)) throw fail('invalid_run_state', 'customer operations plan lacks accepted-order, contract classification, D-0157 F3, customer identity, or party authority provenance');
    const operationsInput = plan.operations.map(({ status, completedAt, ...operation }) => operation);
    const planFingerprint = stable({ workOrderId: plan.workOrderId, contractSnapshot: plan.contractSnapshot, operations: operationsInput });
    if (planEvent.eventId !== `${eventId(state, planEvent.occurredAt)}|customer-plan|${encodeURIComponent(plan.workOrderId)}` || planEvent.result?.planFingerprint !== planFingerprint) throw fail('invalid_run_state', 'customer operations plan does not match its run event payload');
    const allOperationsCompleted = Array.isArray(plan.operations) && plan.operations.length > 0 && plan.operations.every(operation => operation.status === 'completed');
    if (!Array.isArray(plan.operations) || plan.operations.length === 0 || !['in_progress', 'ready_for_delivery', 'cancelled_before_shipment'].includes(plan.status) || !['pending_non_posting', 'performance_pending'].includes(plan.financeStatus) || (plan.status === 'in_progress' && (allOperationsCompleted || plan.financeStatus !== 'pending_non_posting')) || (plan.status !== 'in_progress' && (!allOperationsCompleted || plan.financeStatus !== 'performance_pending'))) throw fail('invalid_run_state', 'customer work order has an unauthorized completion or finance status');
    for (let operationIndex = 0; operationIndex < plan.operations.length; operationIndex++) {
      const operation = plan.operations[operationIndex];
      if (!['planned', 'completed'].includes(operation.status)) throw fail('invalid_run_state', 'customer operation has an unauthorized status');
      for (const predecessorId of operation.predecessors) {
        const predecessor = plan.operations.find(item => item.operationId === predecessorId);
        if (!predecessor || plan.operations.indexOf(predecessor) >= operationIndex || predecessor.date > operation.date || (operation.status === 'completed' && (predecessor.status !== 'completed' || predecessor.completedAt > operation.date))) throw fail('invalid_run_state', 'customer operation predecessor chronology is invalid');
      }
      if (operation.status === 'completed') {
        const event = operationEventBySource.get(`${plan.workOrderId}|${operation.operationId}`);
        if (!event || event.eventId !== `${eventId(state, event.occurredAt)}|customer-operation|${encodeURIComponent(plan.workOrderId)}|${encodeURIComponent(operation.operationId)}` || event.occurredAt !== operation.completedAt) throw fail('invalid_run_state', 'completed customer operation lacks a run event');
      }
    }
    if (['ready_for_delivery', 'cancelled_before_shipment'].includes(plan.status) && plan.operations.some(operation => operation.status !== 'completed')) throw fail('invalid_run_state', 'completed work order status is invalid while operations remain incomplete');
  }
  const cancellationEvents = state.dayEvents.filter(item => item.phase === 'customer_order_cancelled_before_shipment');
  const cancellationIds = new Set(); const cancellationOrders = new Set();
  for (const event of cancellationEvents) {
    const result = event.result; const order = customerWorkOrderById.get(result?.workOrderId); const plan = productPlanByOrderId.get(result?.workOrderId); const contract = plan?.contractSnapshot;
    const input = result && { cancellationId: result.cancellationId, sourceRef: result.sourceRef, workOrderId: result.workOrderId, cancellationDate: result.cancellationDate, actorRole: result.actorRole, actorPartyId: result.actorPartyId, customerRef: result.customerRef, authorizedForRef: result.authorizedForRef, partyAuthorityRef: result.partyAuthorityRef, acceptanceCriterionRef: result.acceptanceCriterionRef };
    const movement = state.modules.product.finishedGoodsMovements.find(row => row.movementId === result?.movementId);
    const valid = order && plan && contract && plan.status === 'cancelled_before_shipment' && order.status === 'cancelled_before_shipment'
      && !state.dayEvents.some(row => row.phase === 'customer_delivery' && row.result?.workOrderId === result.workOrderId)
      && isDate(result.cancellationDate) && result.cancellationDate === event.occurredAt && result.cancellationDate <= (state.activeDay?.date ?? state.currentDate)
      && isAuthorizedAcceptanceActor(result, order, contract, state.modules.market.firms.find(firm => firm.role === 'player')?.firmId)
      && result.acceptanceCriterionRef === contract.acceptanceCriterionRef && result.contractRef === contract.contractRef
      && result.status === 'cancelled_before_shipment_nonposting' && result.financeStatus === 'pending_non_posting'
      && result.movementId === `${state.runId}|customer-cancel|${encodeURIComponent(result.cancellationId)}`
      && movement?.kind === 'customer_reservation_released_before_shipment' && movement.workOrderId === result.workOrderId && movement.date === result.cancellationDate && movement.sourceRef === result.sourceRef
      && result.inputFingerprint === stable(input) && event.eventId === `${eventId(state, result.cancellationDate)}|customer-cancel|${encodeURIComponent(result.cancellationId)}` && event.sourceRef === result.sourceRef;
    if (!valid || Object.keys(result).length !== 15 || cancellationIds.has(result.cancellationId) || cancellationOrders.has(result.workOrderId)) throw fail('invalid_run_state', 'customer pre-shipment cancellation is unbacked, unauthorized, duplicated, or inconsistent with stock reservation');
    cancellationIds.add(result.cancellationId); cancellationOrders.add(result.workOrderId);
  }  for (const event of state.dayEvents.filter(item => item.phase === 'customer_operation_completed')) {
    const match = operationBySource.get(event.sourceRef);
    if (!match || match.operation.status !== 'completed' || match.operation.completedAt !== event.occurredAt || event.eventId !== `${eventId(state, event.occurredAt)}|customer-operation|${encodeURIComponent(match.plan.workOrderId)}|${encodeURIComponent(match.operation.operationId)}`) throw fail('invalid_run_state', 'customer operation event is not backed by a completed T-0066 operation');
  }
  const productSales = state.modules.product?.productSales ?? [];
  const productSaleOfferEvents = state.dayEvents.filter(item => item.phase === 'product_sale_offer');
  const productSaleDecisionEvents = state.dayEvents.filter(item => item.phase === 'product_sale_buyer_decision');
  const productSaleDispatchEvents = state.dayEvents.filter(item => item.phase === 'product_sale_dispatch');
  const productCostLotEvents = state.dayEvents.filter(item => item.phase === 'product_cost_lot');
  if (productCostLotEvents.length !== (state.modules.product?.productCostLayers ?? []).length) throw fail('invalid_run_state', 'product cost layers and shared-run event history disagree');
  for (const layer of state.modules.product?.productCostLayers ?? []) {
    const event = productCostLotEvents.find(item => item.sourceRef === layer.layerId);
    const originalLayerSnapshot = { ...layer, quantityRemaining: layer.quantityOriginal, remainingCostCents: layer.totalCostCents };
    if (!event || JSON.stringify(event.result?.layer) !== JSON.stringify(originalLayerSnapshot) || event.result?.inputFingerprint !== stable(event.result?.input)) throw fail('invalid_run_state', `product cost layer ${layer.layerId} does not match its shared-run source event`);
  }
  if (productSaleOfferEvents.length !== productSales.length || productSaleDecisionEvents.length !== productSales.filter(sale => sale.status !== 'pending').length || productSaleDispatchEvents.length !== productSales.filter(sale => sale.dispatchId).length) throw fail('invalid_run_state', 'product sale module and shared-run event history disagree');
  for (const sale of productSales) {
    const offerEvent = productSaleOfferEvents.find(item => item.sourceRef === sale.saleId);
    const offerInput = { saleId: sale.saleId, productId: sale.productId, sellerPartyId: sale.sellerPartyId, buyerPartyId: sale.buyerPartyId, inquiryId: sale.inquiryId, quantity: sale.quantity, offerDate: sale.offerDate, decisionDate: sale.decisionDate, netPriceCents: sale.netPriceCents, offerSnapshotId: sale.offerSnapshotId, offerSnapshot: sale.offerSnapshot };
    if (!offerEvent || sale.offerDate > (state.activeDay?.date ?? state.currentDate) || offerEvent.eventId !== `${eventId(state, sale.offerDate)}|product-sale-offer|${encodeURIComponent(sale.saleId)}` || offerEvent.occurredAt !== sale.offerDate || offerEvent.result?.inputFingerprint !== stable(offerInput) || stable(offerEvent.result?.offerSnapshot) !== stable(sale.offerSnapshot) || offerEvent.result?.saleId !== sale.saleId || offerEvent.result?.financeStatus !== 'pending_non_posting') throw fail('invalid_run_state', 'product sale offer does not match its shared-run source event');
    if (sale.status !== 'pending') {
      const decisionEvent = productSaleDecisionEvents.find(item => item.sourceRef === sale.saleId);
      const decisionInput = decisionEvent?.result?.input;
      const productDecisionSource = state.modules.product.events.find(event => event.type === 'product_sale_buyer_decision' && event.saleId === sale.saleId);
      if (!decisionEvent || !productDecisionSource || productDecisionSource.buyerPartyId !== decisionInput?.buyerPartyId || productDecisionSource.accepted !== decisionInput?.accepted || productDecisionSource.decisionDate !== decisionInput?.decisionDate || productDecisionSource.decisionRef !== decisionInput?.decisionRef || sale.decisionDate > (state.activeDay?.date ?? state.currentDate) || decisionEvent.eventId !== `${eventId(state, sale.decisionDate)}|product-sale-decision|${encodeURIComponent(sale.saleId)}` || decisionEvent.occurredAt !== sale.decisionDate || decisionInput?.saleId !== sale.saleId || decisionInput?.buyerPartyId !== sale.buyerPartyId || decisionInput?.accepted !== (sale.status === 'accepted') || decisionInput?.decisionDate !== sale.decisionDate || decisionEvent.result?.inputFingerprint !== stable(decisionInput) || decisionEvent.result?.stockStatus !== (sale.status === 'accepted' ? 'reserved_in_finished_goods' : 'retained_in_finished_goods')) throw fail('invalid_run_state', 'product sale buyer decision does not match its shared-run source event');
    }
    if (sale.dispatchId) {
      const dispatchEvent = productSaleDispatchEvents.find(item => item.sourceRef === sale.dispatchId);
      const dispatchInput = dispatchEvent?.result?.input;
      const productDispatchSource = state.modules.product.events.find(event => event.type === 'product_sale_dispatched' && event.saleId === sale.saleId);
      if (!dispatchEvent || !productDispatchSource || productDispatchSource.dispatchId !== sale.dispatchId || productDispatchSource.date !== sale.dispatchDate || productDispatchSource.dispatchSourceRef !== sale.dispatchSourceRef || dispatchEvent.occurredAt !== sale.dispatchDate || dispatchInput?.saleId !== sale.saleId || dispatchInput?.dispatchId !== sale.dispatchId || dispatchInput?.date !== sale.dispatchDate || dispatchInput?.sourceRef !== sale.dispatchSourceRef || dispatchEvent.result?.inputFingerprint !== stable(dispatchInput)) throw fail('invalid_run_state', 'product dispatch does not match its shared-run source event');
    }
  }
  const deliveryEvents = state.dayEvents.filter(item => item.phase === 'customer_delivery');
  const deliveryById = new Map(); const deliveryByOrder = new Map();
  const handoffSourceRefs = new Set(state.dayEvents.filter(item => !['customer_delivery', 'customer_acceptance_decision'].includes(item.phase)).map(item => item.sourceRef));
  for (const event of deliveryEvents) {
    const result = event.result; const order = customerWorkOrderById.get(result?.workOrderId);
    const plan = productPlanByOrderId.get(result?.workOrderId); const contract = plan?.contractSnapshot;
    const input = result && { deliveryId: result.deliveryId, sourceRef: result.sourceRef, workOrderId: result.workOrderId, deliveryDate: result.deliveryDate, recipientPartyId: result.recipientPartyId, deliveryCriterionRef: result.deliveryCriterionRef, acceptanceCriterionRef: result.acceptanceCriterionRef, quantity: result.quantity, unit: result.unit };
    const fingerprint = input && stable(input);
    const valid = order && plan && contract && plan.status === 'ready_for_delivery' && order.status === 'ready_for_delivery'
      && typeof result.deliveryId === 'string' && result.deliveryId.trim() && typeof result.sourceRef === 'string' && result.sourceRef.trim()
      && isDate(result.deliveryDate) && result.deliveryDate === event.occurredAt && result.deliveryDate <= (state.activeDay?.date ?? state.currentDate)
      && result.recipientPartyId === contract.acceptancePartyId
      && result.deliveryCriterionRef === contract.performanceCriterionRef
      && result.acceptanceCriterionRef === contract.acceptanceCriterionRef
      && Number.isFinite(result.quantity) && result.quantity > 0 && result.quantity === contract.orderQuantity
      && result.unit === contract.orderUnit && typeof result.contractRef === 'string' && result.contractRef === contract.contractRef
      && result.inquiryId === order.inquiryId && result.offerId === order.offerId && result.decisionId === order.decisionId
      && result.status === 'delivered_pending_customer_decision' && result.financeStatus === 'pending_non_posting'
      && result.inputFingerprint === fingerprint
      && result.finishedGoodsMovementId === `${state.runId}|customer-shipment|${encodeURIComponent(result.deliveryId)}`
      && (() => { const movement = productMovementsById.get(result.finishedGoodsMovementId); return movement?.workOrderId === result.workOrderId && movement.deliveryId === result.deliveryId && movement.kind === 'customer_goods_shipped' && movement.date === result.deliveryDate && movement.sourceRef === result.sourceRef; })()
      && event.eventId === `${eventId(state, result.deliveryDate)}|customer-delivery|${encodeURIComponent(result.deliveryId)}`
      && event.sourceRef === result.sourceRef
      && plan.operations.every(operation => operation.status === 'completed' && operation.completedAt <= result.deliveryDate);
    if (!valid || Object.keys(result).length !== 17 || deliveryById.has(result.deliveryId) || deliveryByOrder.has(result.workOrderId) || handoffSourceRefs.has(result.sourceRef)) throw fail('invalid_run_state', 'customer delivery handoff is unbacked, duplicated, premature, or inconsistent with its order/contract');
    handoffSourceRefs.add(result.sourceRef);
    deliveryById.set(result.deliveryId, event); deliveryByOrder.set(result.workOrderId, event);
  }
  const decisionEvents = state.dayEvents.filter(item => item.phase === 'customer_acceptance_decision');
  const decisionIds = new Set(); const decisionDeliveryIds = new Set();
  const decisionEventByDeliveryId = firstBy(decisionEvents, event => event.result?.deliveryId);
  for (const event of decisionEvents) {
    const result = event.result; const delivery = deliveryById.get(result?.deliveryId)?.result;
    const order = customerWorkOrderById.get(result?.workOrderId);
    const plan = productPlanByOrderId.get(result?.workOrderId); const contract = plan?.contractSnapshot;
    const input = result && { decisionId: result.decisionId, sourceRef: result.sourceRef, workOrderId: result.workOrderId, deliveryId: result.deliveryId, decisionDate: result.decisionDate, decision: result.decision, actorRole: result.actorRole, actorPartyId: result.actorPartyId, customerRef: result.customerRef, authorizedForRef: result.authorizedForRef, partyAuthorityRef: result.partyAuthorityRef, acceptanceCriterionRef: result.acceptanceCriterionRef };
    const fingerprint = input && stable(input);
    const automaticF3 = typeof result?.decisionId === 'string' && result.decisionId.startsWith('SIM|D-0157|F3|');
    const f3DueDate = delivery && f3DeadlineDate(delivery.deliveryDate);
    const expectedAcceptanceParty = contract?.acceptancePartyId;
    const expectedAutomaticActorRole = expectedAcceptanceParty === order?.customerPartyId ? 'customer' : 'recipient';
    const expectedAutomaticAuthority = expectedAutomaticActorRole === 'customer'
      ? result?.authorizedForRef == null && result?.partyAuthorityRef == null
      : result?.authorizedForRef === order?.customerPartyId && result?.partyAuthorityRef === contract?.partyAuthorityRef;
    const valid = delivery && order && plan && contract && typeof result.decisionId === 'string' && result.decisionId.trim()
      && typeof result.sourceRef === 'string' && result.sourceRef.trim() && isDate(result.decisionDate)
      && result.decisionDate === event.occurredAt && result.decisionDate >= delivery.deliveryDate
      && result.decisionDate <= (state.activeDay?.date ?? state.currentDate)
      && ['accept', 'reject'].includes(result.decision) && ['customer', 'recipient'].includes(result.actorRole)
      && isAuthorizedAcceptanceActor(result, order, contract, state.modules.market.firms.find(firm => firm.role === 'player')?.firmId)
      && result.acceptanceCriterionRef === contract.acceptanceCriterionRef
      && result.workOrderId === delivery.workOrderId && result.contractRef === contract.contractRef
      && result.inquiryId === order.inquiryId && result.offerId === order.offerId && result.marketDecisionId === order.decisionId
      && result.status === (result.decision === 'accept' ? 'accepted_non_posting' : 'rejected_non_posting')
      && result.financeStatus === 'pending_non_posting' && result.inputFingerprint === fingerprint
      && (automaticF3
        ? result.decision === 'accept' && result.decisionDate === f3DueDate
          && result.decisionId === 'SIM|D-0157|F3|' + encodeURIComponent(order.workOrderId)
          && result.sourceRef === 'simulation:D-0157:F3:' + encodeURIComponent(order.workOrderId)
          && result.actorRole === expectedAutomaticActorRole && result.actorPartyId === expectedAcceptanceParty && expectedAutomaticAuthority
        : result.decisionDate <= f3DueDate)
      && event.eventId === `${eventId(state, result.decisionDate)}|customer-acceptance|${encodeURIComponent(result.decisionId)}`
      && event.sourceRef === result.sourceRef;
    if (!valid || Object.keys(result).length !== 19 || decisionIds.has(result.decisionId) || decisionDeliveryIds.has(result.deliveryId) || handoffSourceRefs.has(result.sourceRef)) throw fail('invalid_run_state', 'customer acceptance decision is unbacked, unauthorized, duplicated, or inconsistent with delivery/contract');
    decisionIds.add(result.decisionId); decisionDeliveryIds.add(result.deliveryId); handoffSourceRefs.add(result.sourceRef);
  }
  const returnEvents = state.dayEvents.filter(item => item.phase === 'customer_goods_returned');
  const returnIds = new Set(); const returnSources = new Set();
  for (const event of returnEvents) {
    const result = event.result; const movement = state.modules.product.finishedGoodsMovements.find(row => row.movementId === result?.movementId);
    const delivery = deliveryById.get(result?.deliveryId)?.result;
    const rejection = decisionEvents.find(row => row.result?.deliveryId === result?.deliveryId && row.result?.decision === 'reject')?.result;
    const input = result && { returnId: result.returnId, sourceRef: result.sourceRef, workOrderId: result.workOrderId, deliveryId: result.deliveryId, returnDate: result.returnDate, quantity: result.quantity, unit: result.unit };
    const valid = delivery && rejection && delivery.workOrderId === result.workOrderId && isDate(result.returnDate) && result.returnDate === event.occurredAt && result.returnDate <= (state.activeDay?.date ?? state.currentDate)
      && result.status === 'returned_quarantine_nonposting' && result.financeStatus === 'pending_non_posting'
      && result.movementId === `${state.runId}|customer-return|${encodeURIComponent(result.returnId)}`
      && movement?.kind === 'customer_rejected_goods_returned' && movement.workOrderId === result.workOrderId && movement.deliveryId === result.deliveryId && movement.date === result.returnDate && movement.quantity === result.quantity && movement.unit === result.unit && movement.sourceRef === result.sourceRef
      && result.inputFingerprint === stable(input) && event.eventId === `${eventId(state, result.returnDate)}|customer-return|${encodeURIComponent(result.returnId)}` && event.sourceRef === result.sourceRef;
    if (!valid || Object.keys(result).length !== 11 || returnIds.has(result.returnId) || returnSources.has(result.sourceRef)) throw fail('invalid_run_state', 'customer goods return is unbacked, duplicated, or inconsistent with rejected delivery evidence');
    returnIds.add(result.returnId); returnSources.add(result.sourceRef);
  }  for (const deliveryEvent of state.dayEvents.filter(item => item.phase === 'customer_delivery')) {
    const delivery = deliveryEvent.result;
    const decision = decisionEventByDeliveryId.get(delivery.deliveryId);
    const deadline = f3DeadlineDate(delivery.deliveryDate);
    const deadlineClosed = deadline < state.currentDate || (deadline === state.currentDate && !state.activeDay);
    if (deadlineClosed && !decision) throw fail('invalid_run_state', 'closed run passed F3 customer-decision date without its D-0157 event');
  }
  if (state.financeHandoffs.length !== state.customerWorkOrders.length) throw fail('invalid_run_state', 'finance handoffs do not match customer work orders');
  const expectedHandoffs = new Map(state.customerWorkOrders.map(order => {
    const handoffId = `FIN-HANDOFF|${encodeURIComponent(order.workOrderId)}|performance`;
    return [order.workOrderId, { handoffId, workOrderId: order.workOrderId, sourceEventId: order.decisionId, status: 'pending_non_posting', reason: 'customer acceptance is not performance, delivery, acceptance, invoice, payment, or an authorized A03 posting' }];
  }));
  for (const handoff of state.financeHandoffs) {
    const expected = expectedHandoffs.get(handoff.workOrderId);
    if (!expected || stable(handoff) !== stable(expected)) throw fail('invalid_run_state', 'finance handoff is unbacked or has an unauthorized status/field');
  }
  for (const [date, fingerprint] of Object.entries(state.processedDays)) if (!isDate(date) || typeof fingerprint !== 'string' || !fingerprint) throw fail('invalid_run_state', 'processed day index contains invalid entries');
  return true;
}

export function validateV3RunState(state) {
  if (!activeV3RunDiagnostics) return validateV3RunStateCore(state);
  const phase = activeV3RunDiagnosticPhase;
  const started = diagnosticNow();
  const bucket = recordRunValidation(phase, state);
  try { return validateV3RunStateCore(state); }
  finally {
    const elapsed = diagnosticNow() - started;
    bucket.totalMs += elapsed;
    bucket.maxMs = Math.max(bucket.maxMs, elapsed);
  }
}

function normalizeRunDate(state, input) {
  const date = input.date ?? shiftDate(state.currentDate, 1);
  if (!isDate(date) || date > state.endDate) throw fail('invalid_run_date', 'date must be a valid calendar date within the run range');
  return date;
}
function runOfferForDay(state, suppliedOffer, date) {
  const matches = suppliedOffer.inquiryId ? [] : state.modules.market.inquiries.filter(inquiry => inquiry.templateId === suppliedOffer.templateId && inquiry.receivedAt <= date && inquiry.status === 'open');
  if (!suppliedOffer.inquiryId && matches.length !== 1) throw fail('offer_inquiry_reference_ambiguous', 'offer must reference one open inquiryId or one unique open templateId');
  const offer = suppliedOffer.inquiryId ? suppliedOffer : { ...suppliedOffer, inquiryId: matches[0].inquiryId };
  if (offer.submittedAt !== date) throw fail('offer_date_mismatch', 'offer submittedAt must match the active run date');
  return offer;
}

/** Open one shared day through decisions and inquiries, leaving the market in its player-action phase. */
export function openV3RunDay(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = new Set(['date', 'marketWeekTemplates', 'macroMonthInput', 'formationEvents']);
  if (Object.keys(input).some(key => !allowed.has(key))) throw fail('invalid_run_day_open_input', 'day-open accepts date, marketWeekTemplates, macroMonthInput and formationEvents only');
  const date = normalizeRunDate(inputState, input);
  const payload = { ...input, date };
  const fingerprint = stable(payload);
  if (inputState.activeDay) {
    if (inputState.activeDay.date !== date || inputState.activeDay.openFingerprint !== fingerprint) throw fail('run_day_payload_conflict', `another day or open payload is already active`);
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(inputState.dayEvents.find(event => event.eventId === `${eventId(inputState, date)}|market-open`)?.result) };
  }
  if (inputState.processedDays[date]) {
    if (inputState.dayOpenFingerprints[date] !== fingerprint) throw fail('run_day_payload_conflict', `date ${date} was already opened with different input`);
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(inputState.dayEvents.find(event => event.eventId === `${eventId(inputState, date)}|run-result`)?.result) };
  }
  if (date !== shiftDate(inputState.currentDate, 1)) throw fail('invalid_run_date', 'date must be the next calendar date within the run range');

  const state = clone(inputState);
  const newEvents = [];
  let market = state.modules.market;
  // Publish the current month's macro snapshot before generating market opportunities.
  if (state.modules.macro && input.macroMonthInput) {
    const expectedPeriod = date.slice(0, 7);
    if (!(date === state.startDate || date.slice(8) === '01') || input.macroMonthInput.period !== expectedPeriod) throw fail('macro_period_date_mismatch', 'macroMonthInput must be supplied on the first run date of its matching calendar month');
    const advanced = okOrThrow(runV3MacroMonth(state.modules.macro, input.macroMonthInput)); state.modules.macro = advanced.state;
    newEvents.push({ eventId: `${eventId(state, date)}|macro|${expectedPeriod}`, phase: 'macro_month', occurredAt: date, sourceRef: `macro-period:${expectedPeriod}`, result: { period: expectedPeriod, sourceSnapshotId: advanced.snapshot?.sourceSnapshotId ?? state.modules.macro.sourceSnapshotId } });
  }
  if (input.marketWeekTemplates !== undefined) {
    if (new Date(`${date}T12:00:00Z`).getUTCDay() !== 1) throw fail('market_week_not_monday', 'marketWeekTemplates may only be scheduled on Monday');
    const scheduled = scheduleV3MarketWeek(market, { weekStart: date, templates: input.marketWeekTemplates });
    const scheduleResult = okOrThrow(scheduled); market = scheduled.state; state.modules.market = market;
    newEvents.push({ eventId: `${eventId(state, date)}|schedule`, phase: 'market_schedule', occurredAt: date, sourceRef: `market-week:${date}`, result: scheduleResult.result });
  }
  if (state.modules.formation && Array.isArray(input.formationEvents)) {
    for (const formationEvent of input.formationEvents) {
      if (formationEvent.effectiveDate !== date) throw fail('formation_event_date_mismatch', 'formation event effectiveDate must match run date');
      const applied = applyV3FormationEvent(state.modules.formation, formationEvent);
      if (!applied.ok) throw fail(applied.error.code, applied.error.message);
      state.modules.formation = applied.state;
      if (!applied.duplicate) newEvents.push({ eventId: formationEvent.eventId, phase: 'formation', occurredAt: date, sourceRef: formationEvent.sourceRef, result: { emitted: applied.emitted, financeHandoffs: applied.financeHandoffs } });
    }
  } else if (input.formationEvents?.length) throw fail('formation_module_missing', 'formation events were supplied without formationState');
  if (state.modules.product && isWorkday(date) && date > state.modules.product.currentDate) {
    const before = state.modules.product.currentDate; state.modules.product = advanceV3ProductDate(state.modules.product);
    if (state.modules.product.currentDate !== date) throw fail('product_calendar_diverged', `product module advanced from ${before} to ${state.modules.product.currentDate}, not ${date}`);
    newEvents.push({ eventId: `${eventId(state, date)}|product-calendar`, phase: 'product_calendar', occurredAt: date, sourceRef: `product-calendar:${date}`, result: { currentDate: date } });
    for (const missed of state.modules.product.events.filter(event => event.type === 'equipment_instruction_missed' && event.date === date)) {
      newEvents.push({ eventId: `${eventId(state, date)}|equipment-instruction-missed|${encodeURIComponent(missed.instructionId)}`, phase: 'equipment_instruction_missed', occurredAt: date, sourceRef: missed.sourceRef, result: { instructionId: missed.instructionId, plannedDate: missed.plannedDate, reason: missed.reason } });
    }
  }
  const advanced = okOrThrow(advanceV3MarketDay(market, date)); state.modules.market = advanced.state;
  newEvents.push({ eventId: `${eventId(state, date)}|market-open`, phase: 'market_decisions_and_inquiries', occurredAt: date, sourceRef: `market-day:${date}`, result: advanced.result });
  state.currentDate = date;
  state.activeDay = { date, openFingerprint: fingerprint };
  state.dayOpenFingerprints[date] = fingerprint;

  // A genuine player win is linked once at the decision phase, before player offers for this day.
  const playerId = state.modules.market.firms.find(firm => firm.role === 'player')?.firmId;
  for (const inquiry of state.modules.market.inquiries) {
    if (inquiry.decidedAt !== date || inquiry.winnerFirmId !== playerId || state.customerWorkOrders.some(order => order.decisionId === inquiry.decisionId)) continue;
    const workOrderId = `WORK|${encodeURIComponent(state.runId)}|${encodeURIComponent(inquiry.decisionId)}`;
    const winningOffer = inquiry.offers.find(offer => offer.offerId === inquiry.winningOfferId);
    state.customerWorkOrders.push({ workOrderId, runId: state.runId, inquiryId: inquiry.inquiryId, customerPartyId: inquiry.customerId, decisionId: inquiry.decisionId, offerId: inquiry.winningOfferId, acceptedAt: inquiry.decidedAt, ...(winningOffer?.commercialTerms ? { contractTermsSnapshot: clone(winningOffer.commercialTerms) } : {}), status: 'awaiting_operational_plan', financeStatus: 'pending_non_posting' });
    state.financeHandoffs.push({ handoffId: `FIN-HANDOFF|${encodeURIComponent(workOrderId)}|performance`, workOrderId, sourceEventId: inquiry.decisionId, status: 'pending_non_posting', reason: 'customer acceptance is not performance, delivery, acceptance, invoice, payment, or an authorized A03 posting' });
    newEvents.push({ eventId: `${eventId(state, date)}|work-order|${encodeURIComponent(inquiry.decisionId)}`, phase: 'work_order_created', occurredAt: date, sourceRef: inquiry.decisionId, result: { workOrderId, customerPartyId: inquiry.customerId, ...(winningOffer?.commercialTerms ? { contractTermsSnapshot: clone(winningOffer.commercialTerms) } : {}) } });
  }
  state.dayEvents.push(...newEvents);
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: { date, eventOrder: newEvents.map(event => event.phase), receivedInquiryIds: advanced.result.receivedInquiryIds, decisions: advanced.result.decisions, playerInquiries: getV3MarketPlayerView(state.modules.market).inquiries } };
}

/** Submit one explicit player offer while a shared run day is open. */
export function submitV3RunOffer(inputState, suppliedOffer) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before submitting an offer');
  if (!suppliedOffer || typeof suppliedOffer !== 'object' || Array.isArray(suppliedOffer)) throw fail('invalid_offer', 'offer input is required');
  const date = inputState.activeDay.date; const offer = runOfferForDay(inputState, suppliedOffer, date);
  const playerId = inputState.modules.market.firms.find(firm => firm.role === 'player')?.firmId;
  if (offer.firmId !== playerId) throw fail('player_offer_required', 'the shared-run offer action accepts only the player firm');
  const priorEventId = `${eventId(inputState, date)}|offer|${encodeURIComponent(offer.eventId)}`;
  const priorRunEvent = inputState.dayEvents.find(event => event.eventId === priorEventId);
  const submitted = okOrThrow(submitV3MarketOffer(inputState.modules.market, offer));
  if (submitted.duplicate) {
    if (!priorRunEvent) throw fail('run_offer_history_mismatch', 'market has the offer but shared run history lacks its source event');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(priorRunEvent.result) };
  }
  if (priorRunEvent) throw fail('run_offer_history_mismatch', 'shared run already contains this offer event without a matching market replay');
  const state = clone(inputState); state.modules.market = submitted.state;
  state.dayEvents.push({ eventId: priorEventId, phase: 'player_offer', occurredAt: date, sourceRef: offer.eventId, result: submitted.result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: submitted.result };
}

/** Submit the player's one D-0184 price revision against the open customer counteroffer. */
export function submitV3RunCounterResponse(inputState, suppliedResponse) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before responding to a customer counteroffer');
  if (!suppliedResponse || typeof suppliedResponse !== 'object' || Array.isArray(suppliedResponse)) throw fail('invalid_counter_response', 'counter response input is required');
  const response = { ...suppliedResponse, submittedAt: inputState.activeDay.date };
  const sourceRef = response.eventId; const priorEventId = `${eventId(inputState, inputState.activeDay.date)}|counter-response|${encodeURIComponent(sourceRef ?? '')}`;
  const prior = inputState.dayEvents.find(event => event.eventId === priorEventId);
  const submitted = okOrThrow(submitV3MarketCounterResponse(inputState.modules.market, response));
  if (submitted.duplicate) {
    if (!prior) throw fail('run_counter_response_history_mismatch', 'market already contains this counter response but shared-run history lacks it');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (prior) throw fail('run_counter_response_history_mismatch', 'shared run already contains this counter response without a matching market replay');
  const state = clone(inputState); state.modules.market = submitted.state;
  state.dayEvents.push({ eventId: priorEventId, phase: 'player_counter_response', occurredAt: inputState.activeDay.date, sourceRef, result: submitted.result });
  if (submitted.result.contractCreated === true) {
    const inquiry = state.modules.market.inquiries.find(row => row.inquiryId === submitted.result.inquiryId);
    if (!inquiry || inquiry.status !== 'resolved' || inquiry.winnerFirmId !== state.modules.market.firms.find(firm => firm.role === 'player')?.firmId || inquiry.decidedAt !== inputState.activeDay.date) throw fail('run_counter_response_contract_mismatch', 'immediate counter acceptance is not backed by the resolved market inquiry');
    if (state.customerWorkOrders.some(order => order.decisionId === inquiry.decisionId)) throw fail('run_counter_response_contract_duplicate', 'accepted counter response already has a work order');
    const workOrderId = `WORK|${encodeURIComponent(state.runId)}|${encodeURIComponent(inquiry.decisionId)}`;
    const winningOffer = inquiry.offers.find(offer => offer.offerId === inquiry.winningOfferId);
    state.customerWorkOrders.push({ workOrderId, runId: state.runId, inquiryId: inquiry.inquiryId, customerPartyId: inquiry.customerId, decisionId: inquiry.decisionId, offerId: inquiry.winningOfferId, acceptedAt: inquiry.decidedAt, ...(winningOffer?.commercialTerms ? { contractTermsSnapshot: clone(winningOffer.commercialTerms) } : {}), status: 'awaiting_operational_plan', financeStatus: 'pending_non_posting' });
    state.financeHandoffs.push({ handoffId: `FIN-HANDOFF|${encodeURIComponent(workOrderId)}|performance`, workOrderId, sourceEventId: inquiry.decisionId, status: 'pending_non_posting', reason: 'customer acceptance is not performance, delivery, acceptance, invoice, payment, or an authorized A03 posting' });
    state.dayEvents.push({ eventId: `${eventId(state, inputState.activeDay.date)}|work-order|${encodeURIComponent(inquiry.decisionId)}`, phase: 'work_order_created', occurredAt: inputState.activeDay.date, sourceRef: inquiry.decisionId, result: { workOrderId, customerPartyId: inquiry.customerId, ...(winningOffer?.commercialTerms ? { contractTermsSnapshot: clone(winningOffer.commercialTerms) } : {}) } });
  }
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: submitted.result };
}

/** Submit an explicit T-0066-compatible plan for a market-provenance-backed customer work order. */
export function planV3RunWorkOrder(inputState, { workOrderId, contractSnapshot, operations }) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before planning customer work');
  const order = inputState.customerWorkOrders.find(row => row.workOrderId === workOrderId);
  if (!order) throw fail('unknown_customer_work_order', 'work order must come from a validated accepted player offer');
  if (!inputState.modules.product) throw fail('product_module_missing', 'explicit T-0066 people, equipment and material capacities are required');
  if (!contractSnapshot || contractSnapshot.inquiryId !== order.inquiryId || contractSnapshot.offerId !== order.offerId || contractSnapshot.decisionId !== order.decisionId || !validContractPartyAuthority(contractSnapshot, order) || stable(contractSnapshot.commercialTermsSnapshot ?? null) !== stable(order.contractTermsSnapshot ?? null) || (order.contractTermsSnapshot && (contractSnapshot.orderQuantity !== order.contractTermsSnapshot.quantity || contractSnapshot.orderUnit !== order.contractTermsSnapshot.unit || contractSnapshot.contractType !== V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType || stable(order.contractTermsSnapshot.contractClassification) !== stable(V3_METAL_GOODS_CONTRACT_CLASSIFICATION) || stable(order.contractTermsSnapshot.acceptanceScenario) !== stable(V3_D0157_F3_CONDITION)))) throw fail('contract_source_mismatch', 'plan contract must bind accepted B2B metal-goods contract type, D-0157 F3 scenario, offer, terms and authoritative customer');
  if (order.contractTermsSnapshot && Array.isArray(operations) && operations.some(operation => typeof operation?.date === 'string' && operation.date > order.contractTermsSnapshot.deliveryDate)) throw fail('contract_delivery_deadline_exceeded', 'every planned operation must finish on or before the accepted delivery date');
  const inputFingerprint = stable({ workOrderId, contractSnapshot, operations });
  const prior = inputState.dayEvents.find(event => event.phase === 'customer_work_order_plan' && event.sourceRef === workOrderId);
  if (prior) {
    if (prior.result?.inputFingerprint !== inputFingerprint) throw fail('run_plan_payload_conflict', 'work order already has a different operational plan');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (order.status !== 'awaiting_operational_plan') throw fail('work_order_plan_not_allowed', `work order is ${order.status}`);
  const state = clone(inputState); state.modules.product = planProductWorkOrder(state.modules.product, { workOrderId, contractSnapshot, operations });
  const plannedOrder = state.customerWorkOrders.find(row => row.workOrderId === workOrderId); plannedOrder.status = 'in_progress';
  const plannedPlan = state.modules.product.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId);
  const canonicalOperations = plannedPlan.operations.map(({ status, completedAt, ...operation }) => operation);
  const planFingerprint = stable({ workOrderId, contractSnapshot: plannedPlan.contractSnapshot, operations: canonicalOperations });
  const result = { workOrderId, status: 'in_progress', operationCount: operations.length, financeStatus: 'pending_non_posting', inputFingerprint, planFingerprint };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|customer-plan|${encodeURIComponent(workOrderId)}`, phase: 'customer_work_order_plan', occurredAt: state.activeDay.date, sourceRef: workOrderId, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Record explicit completion of one planned operation; the final step only becomes ready for delivery. */
export function completeV3RunWorkOrderOperation(inputState, { workOrderId, operationId }) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before completing customer work');
  const order = inputState.customerWorkOrders.find(row => row.workOrderId === workOrderId);
  if (!order || !inputState.modules.product) throw fail('unknown_customer_work_order', 'work order or T-0066 product state is unavailable');
  const plan = inputState.modules.product.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId);
  const operation = plan?.operations.find(row => row.operationId === operationId);
  if (!operation) throw fail('unknown_customer_operation', 'operation must be part of an explicit work-order plan');
  const completionEvent = inputState.dayEvents.find(event => event.phase === 'customer_operation_completed' && event.sourceRef === `${workOrderId}|${operationId}`);
  if (operation.status === 'completed') {
    if (!completionEvent) throw fail('run_operation_history_mismatch', 'completed operation lacks its shared-run source event');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(completionEvent.result) };
  }
  if (operation.date > inputState.activeDay.date) throw fail('operation_not_due', `operation is scheduled for ${operation.date}`);
  const state = clone(inputState);
  state.modules.product = completeProductWorkOrderOperation(state.modules.product, { workOrderId, operationId });
  const updatedPlan = state.modules.product.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId);
  const updatedOrder = state.customerWorkOrders.find(row => row.workOrderId === workOrderId);
  updatedOrder.status = updatedPlan.status;
  updatedOrder.financeStatus = updatedPlan.financeStatus;
  const result = { workOrderId, operationId, status: operation.status === 'completed' ? 'completed' : 'completed', completedAt: state.activeDay.date, workOrderStatus: updatedOrder.status, financeStatus: updatedOrder.financeStatus };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|customer-operation|${encodeURIComponent(workOrderId)}|${encodeURIComponent(operationId)}`, phase: 'customer_operation_completed', occurredAt: state.activeDay.date, sourceRef: `${workOrderId}|${operationId}`, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Plan the D-0183 instruction block; the gate stays closed until its separate completion event. */
export function planV3RunEquipmentInstruction(inputState, input) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before planning equipment instruction');
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for equipment instruction');
  const fingerprint = stable(input); const prior = inputState.dayEvents.find(event => event.phase === 'equipment_instruction_planned' && event.sourceRef === input?.sourceRef);
  if (prior) {
    if (prior.result?.inputFingerprint !== fingerprint) throw fail('instruction_payload_conflict', 'equipment instruction plan ID already exists with different evidence');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  const state = clone(inputState); state.modules.product = planV3EquipmentInstruction(state.modules.product, input);
  const plan = state.modules.product.equipmentInstructionPlans.find(row => row.instructionId === input.instructionId);
  const result = { plan: clone(plan), inputFingerprint: fingerprint };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|equipment-instruction-planned|${encodeURIComponent(input.instructionId)}`, phase: 'equipment_instruction_planned', occurredAt: state.activeDay.date, sourceRef: input.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Complete a planned D-0183 block on its scheduled simulation day; no duration is synthesized at completion. */
export function completeV3RunEquipmentInstruction(inputState, { instructionId }) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before completing equipment instruction');
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for equipment instruction');
  const plan = inputState.modules.product.equipmentInstructionPlans.find(row => row.instructionId === instructionId);
  if (!plan) throw fail('equipment_instruction_plan_missing', 'plan the instruction work block before completion');
  if (plan.plannedDate !== inputState.activeDay.date) throw fail('instruction_date_mismatch', 'instruction must be completed on its planned simulation date');
  const prior = inputState.dayEvents.find(event => event.phase === 'equipment_instruction_completed' && event.sourceRef === plan.sourceRef);
  if (prior) return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  const state = clone(inputState); state.modules.product = recordV3EquipmentInstruction(state.modules.product, { instructionId });
  const record = state.modules.product.equipmentInstructions.find(row => row.instructionId === instructionId);
  const result = { record: clone(record) };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|equipment-instruction|${encodeURIComponent(instructionId)}`, phase: 'equipment_instruction_completed', occurredAt: state.activeDay.date, sourceRef: plan.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Record a separate D-0183 assignment only for an explicit equipment hazard requirement. */
export function recordV3RunSpecialEquipmentAuthorization(inputState, input) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before recording special equipment authorization');
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for special equipment authorization');
  if (input?.completedAt !== inputState.activeDay.date) throw fail('authorization_date_mismatch', 'authorization must be recorded on the active simulation date');
  const fingerprint = stable(input); const prior = inputState.dayEvents.find(event => event.phase === 'special_equipment_authorization_completed' && event.sourceRef === input?.sourceRef);
  if (prior) {
    if (prior.result?.inputFingerprint !== fingerprint) throw fail('authorization_payload_conflict', 'special equipment authorization ID already exists with different evidence');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  const state = clone(inputState); state.modules.product = recordV3SpecialEquipmentAuthorization(state.modules.product, input);
  const record = state.modules.product.specialEquipmentAuthorizations.find(row => row.authorizationId === input.authorizationId);
  const result = { record: clone(record), inputFingerprint: fingerprint };
  state.dayEvents.push({ eventId: `${eventId(state, input.completedAt)}|equipment-authorization|${encodeURIComponent(input.authorizationId)}`, phase: 'special_equipment_authorization_completed', occurredAt: input.completedAt, sourceRef: input.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Read-only shared-run projection for the active date's person/equipment instruction gate. */
export function getV3RunEquipmentInstructionStatus(inputState, { personId, equipmentId, onDate = inputState?.activeDay?.date ?? inputState?.currentDate } = {}) {
  validateV3RunState(inputState);
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for equipment instruction status');
  if (onDate !== (inputState.activeDay?.date ?? inputState.currentDate)) throw fail('instruction_projection_date_mismatch', 'instruction status must use the active simulation date');
  return getV3EquipmentInstructionStatus(inputState.modules.product, { personId, equipmentId, onDate });
}

/** Place one explicit synthetic international material order during an open shared-run day. */
export function placeV3RunInternationalMaterialOrder(inputState, input) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before placing a material order');
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for material orders');
  const inputFingerprint = stable(input); const prior = inputState.dayEvents.find(event => event.phase === 'international_material_order' && event.sourceRef === input?.orderId);
  if (prior) {
    if (prior.result?.inputFingerprint !== inputFingerprint) throw fail('material_order_payload_conflict', 'material order already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  const state = clone(inputState); state.modules.product = placeV3InternationalMaterialOrder(state.modules.product, input);
  const shipment = state.modules.product.materialShipments.find(row => row.orderId === input.orderId);
  const shipmentSnapshot = clone(shipment); delete shipmentSnapshot.status; delete shipmentSnapshot.receivedAt;
  const result = { inputFingerprint, shipment: shipmentSnapshot };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|material-order|${encodeURIComponent(input.orderId)}`, phase: 'international_material_order', occurredAt: state.activeDay.date, sourceRef: input.orderId, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Record an explicit due shipment receipt in both product quantity state and shared-run history. */
export function receiveV3RunInternationalMaterialShipment(inputState, shipmentId) {
  validateV3RunState(inputState);
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before receiving a material shipment');
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for material receipts');
  const prior = inputState.dayEvents.find(event => event.phase === 'international_material_receipt' && event.sourceRef === shipmentId);
  if (prior) return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  const state = clone(inputState); state.modules.product = receiveV3InternationalMaterialShipment(state.modules.product, shipmentId);
  const movement = state.modules.product.materialMovements.find(row => row.shipmentId === shipmentId);
  const result = { movementId: movement.movementId, orderId: movement.orderId, shipmentId, materialId: movement.materialId, quantity: movement.quantity, date: movement.date, quantityBefore: movement.quantityBefore, quantityAfter: movement.quantityAfter, monetaryStatus: movement.monetaryStatus };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|material-receipt|${encodeURIComponent(shipmentId)}`, phase: 'international_material_receipt', occurredAt: state.activeDay.date, sourceRef: shipmentId, result });
  const invoice = state.modules.product.supplierInvoiceEvidence.find(row => row.shipmentId === shipmentId);
  state.dayEvents.push({ eventId: `${eventId(state, invoice.invoiceDate)}|supplier-invoice|${encodeURIComponent(invoice.invoiceId)}`, phase: 'supplier_invoice_evidence', occurredAt: invoice.invoiceDate, sourceRef: invoice.invoiceId, result: { invoice: clone(invoice) } });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result };
}

/** Record a non-posting source-bound FIFO cost certificate for completed own-product output. */
export function recordV3RunProductCostLayer(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['layerId', 'productId', 'productionDate', 'costComponentsCents', 'componentSourceRefs', 'productionSourceRefs'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_product_cost_layer_input', 'product cost layer requires explicit layer, product, production date, cost components and source references');
  if (!inputState.activeDay) throw fail('run_day_not_open', 'open the shared run day before recording product cost evidence');
  if (!inputState.modules.product) throw fail('product_module_missing', 'product state is required for cost valuation');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'product_cost_lot' && event.sourceRef === normalized.layerId);
  if (prior) {
    if (prior.result?.inputFingerprint !== inputFingerprint) throw fail('run_product_cost_layer_payload_conflict', 'cost layer ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (normalized.productionDate > inputState.activeDay.date) throw fail('product_cost_layer_not_due', 'cost evidence cannot predate completed production');
  const state = clone(inputState);
  state.modules.product = recordV3ProductLotCost(state.modules.product, normalized);
  const layer = state.modules.product.productCostLayers.find(row => row.layerId === normalized.layerId);
  const result = { layer: clone(layer), input: normalized, inputFingerprint, status: 'valued_nonposting', financeStatus: 'pending_nonposting' };
  state.dayEvents.push({ eventId: `${eventId(state, state.activeDay.date)}|product-cost-layer|${encodeURIComponent(normalized.layerId)}`, phase: 'product_cost_lot', occurredAt: state.activeDay.date, sourceRef: normalized.layerId, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}

/** Persist a non-posting own-product offer in both the product module and shared-run event log. */
export function submitV3RunProductSaleOffer(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['saleId', 'productId', 'sellerPartyId', 'buyerPartyId', 'inquiryId', 'quantity', 'offerDate', 'decisionDate', 'netPriceCents', 'offerSnapshotId'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_product_sale_offer_input', 'product sale offer requires exactly the explicit seller, buyer, inquiry, product, quantity, price, dates and cost snapshot fields');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'product_sale_offer' && event.sourceRef === normalized.saleId);
  if (prior) {
    if (prior.result?.inputFingerprint !== stable({ ...normalized, offerSnapshot: prior.result.offerSnapshot })) throw fail('run_product_sale_offer_payload_conflict', 'product sale offer ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.offerDate !== inputState.activeDay.date) throw fail('run_day_not_open', 'product offer must be submitted on the currently open simulation date');
  const playerId = inputState.modules.market.firms.find(firm => firm.role === 'player')?.firmId;
  const inquiry = inputState.modules.market.inquiries.find(row => row.inquiryId === normalized.inquiryId && row.status === 'open');
  if (!playerId || normalized.sellerPartyId !== playerId || !inquiry || inquiry.customerId !== normalized.buyerPartyId) throw fail('product_sale_market_party_mismatch', 'seller must be the player and buyer must be the named customer on an open market inquiry');
  const product = inputState.modules.product?.products.find(row => row.productId === normalized.productId);
  if (!product || inquiry.segmentId !== product.targetSegment || inquiry.requiredCapacity !== normalized.quantity || inquiry.requiredCapacity > (product.outputQuantity ?? 0) || !inquiry.requiredCapabilities.every(capability => product.marketCapabilities.includes(capability))) throw fail('product_sale_market_fit_mismatch', 'product, quantity and capabilities must exactly match the open buyer inquiry');
  const result = { saleId: normalized.saleId, productId: normalized.productId, sellerPartyId: normalized.sellerPartyId, buyerPartyId: normalized.buyerPartyId, inquiryId: normalized.inquiryId, quantity: normalized.quantity, offerDate: normalized.offerDate, decisionDate: normalized.decisionDate, netPriceCents: normalized.netPriceCents, offerSnapshotId: normalized.offerSnapshotId, offerSnapshot: clone(product.costEstimate), status: 'pending', financeStatus: 'pending_non_posting', inputFingerprint: stable({ ...normalized, offerSnapshot: product.costEstimate }) };
  const state = clone(inputState);
  state.modules.product = submitProductSaleOffer(state.modules.product, normalized);
  const sale = state.modules.product.productSales.find(row => row.saleId === normalized.saleId);
  result.offerSnapshot = clone(sale.offerSnapshot);
  result.inputFingerprint = stable({ ...normalized, offerSnapshot: sale.offerSnapshot });
  state.dayEvents.push({ eventId: `${eventId(state, normalized.offerDate)}|product-sale-offer|${encodeURIComponent(normalized.saleId)}`, phase: 'product_sale_offer', occurredAt: normalized.offerDate, sourceRef: normalized.saleId, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}

/** Only the sale's named buyer may decide during the matching open shared-run day. */
export function recordV3RunProductSaleBuyerDecision(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['saleId', 'buyerPartyId', 'decisionDate', 'accepted', 'decisionRef'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_product_sale_decision_input', 'buyer decision requires exactly sale, buyer, date, result and source fields');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'product_sale_buyer_decision' && event.sourceRef === normalized.saleId);
  if (prior) {
    if (prior.result?.inputFingerprint !== inputFingerprint) throw fail('run_product_sale_decision_payload_conflict', 'product sale decision ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.decisionDate !== inputState.activeDay.date) throw fail('run_day_not_open', 'product buyer decision must be recorded on the currently open simulation date');
  const sale = inputState.modules.product?.productSales?.find(row => row.saleId === normalized.saleId);
  if (!sale || sale.buyerPartyId !== normalized.buyerPartyId) throw fail('product_sale_buyer_authority_mismatch', 'only the named recipient/buyer may decide the product offer');
  const decisionResult = { input: normalized, inputFingerprint, stockStatus: normalized.accepted === true ? 'reserved_in_finished_goods' : 'retained_in_finished_goods', financeStatus: 'pending_non_posting', revenueStatus: 'pending_non_posting', cogsStatus: 'pending_deferred_bab' };
  const state = clone(inputState);
  state.modules.product = decideProductSaleOffer(state.modules.product, normalized);
  state.dayEvents.push({ eventId: `${eventId(state, normalized.decisionDate)}|product-sale-decision|${encodeURIComponent(normalized.saleId)}`, phase: 'product_sale_buyer_decision', occurredAt: normalized.decisionDate, sourceRef: normalized.saleId, result: decisionResult });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(decisionResult) };
}

/** Explicit physical product dispatch. Buyer offer acceptance only reserves quantity. */
export function dispatchV3RunProductSale(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['saleId', 'dispatchId', 'date', 'sourceRef'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_product_dispatch_input', 'dispatch requires exactly sale, dispatch, date and source references');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  for (const key of allowed) if (typeof normalized[key] !== 'string' || !normalized[key].trim()) throw fail('invalid_product_dispatch_input', `${key} must be explicit`);
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'product_sale_dispatch' && event.result?.dispatchId === normalized.dispatchId);
  if (prior) {
    if (prior.result?.inputFingerprint !== inputFingerprint) throw fail('run_product_dispatch_payload_conflict', 'dispatch ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.date !== inputState.activeDay.date) throw fail('run_day_not_open', 'product dispatch must be recorded on the currently open simulation date');
  if (inputState.dayEvents.some(event => event.sourceRef === normalized.sourceRef)) throw fail('run_product_dispatch_source_conflict', 'dispatch source reference is already used');
  const sale = inputState.modules.product?.productSales?.find(row => row.saleId === normalized.saleId);
  if (!sale || sale.status !== 'accepted') throw fail('product_dispatch_requires_accepted_sale', 'only an accepted offer can be dispatched');
  const result = { ...normalized, input: normalized, inputFingerprint, movementId: `${inputState.runId}|product-dispatch|${encodeURIComponent(normalized.dispatchId)}`, status: 'dispatched_nonposting', financeStatus: 'pending_non_posting' };
  const state = clone(inputState);
  state.modules.product = dispatchProductSale(state.modules.product, normalized);
  state.dayEvents.push({ eventId: `${eventId(state, normalized.date)}|product-sale-dispatch|${encodeURIComponent(normalized.dispatchId)}`, phase: 'product_sale_dispatch', occurredAt: normalized.date, sourceRef: normalized.dispatchId, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}

/** Customer/recipient may explicitly cancel completed work before shipment; physical goods remain in the warehouse, but reservation is released. */
export function cancelV3RunCustomerWorkOrderBeforeShipment(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['cancellationId', 'sourceRef', 'workOrderId', 'cancellationDate', 'actorRole', 'actorPartyId', 'customerRef', 'authorizedForRef', 'partyAuthorityRef', 'acceptanceCriterionRef'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_customer_cancellation_input', 'cancellation requires explicit customer/recipient, work-order, date, source and authority fields');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  for (const key of ['cancellationId', 'sourceRef', 'workOrderId', 'cancellationDate', 'actorRole', 'actorPartyId', 'customerRef', 'acceptanceCriterionRef']) if (typeof normalized[key] !== 'string' || !normalized[key].trim()) throw fail('invalid_customer_cancellation_input', `${key} must be explicit`);
  if (!isDate(normalized.cancellationDate) || !['customer', 'recipient'].includes(normalized.actorRole)) throw fail('invalid_customer_cancellation_input', 'cancellation date and authorized customer/recipient role are required');
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'customer_order_cancelled_before_shipment' && event.result?.cancellationId === normalized.cancellationId);
  if (prior) {
    if (prior.result.inputFingerprint !== inputFingerprint) throw fail('run_customer_cancellation_payload_conflict', 'cancellation ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.cancellationDate !== inputState.activeDay.date) throw fail('run_day_not_open', 'cancellation must be recorded on the currently open simulation date');
  if (inputState.dayEvents.some(event => event.sourceRef === normalized.sourceRef)) throw fail('run_customer_cancellation_source_conflict', 'cancellation source reference is already used');
  const order = inputState.customerWorkOrders.find(row => row.workOrderId === normalized.workOrderId);
  const plan = inputState.modules.product?.customerWorkOrderPlans.find(row => row.workOrderId === normalized.workOrderId);
  const contract = plan?.contractSnapshot;
  if (!order || !plan || plan.status !== 'ready_for_delivery' || inputState.dayEvents.some(event => event.phase === 'customer_delivery' && event.result?.workOrderId === normalized.workOrderId)) throw fail('customer_cancellation_not_allowed', 'only a ready, not-yet-shipped work order can release its finished-goods reservation');
  if (!isAuthorizedAcceptanceActor(normalized, order, contract, inputState.modules.market.firms.find(firm => firm.role === 'player')?.firmId) || normalized.acceptanceCriterionRef !== contract.acceptanceCriterionRef) throw fail('customer_cancellation_authority_mismatch', 'cancellation must be submitted by the contract customer or authorized recipient');
  const movementId = `${inputState.runId}|customer-cancel|${encodeURIComponent(normalized.cancellationId)}`;
  const result = { ...normalized, contractRef: contract.contractRef, status: 'cancelled_before_shipment_nonposting', movementId, financeStatus: 'pending_non_posting', inputFingerprint };
  const state = clone(inputState);
  state.modules.product = releaseV3CustomerFinishedGoodsReservation(state.modules.product, { cancellationId: normalized.cancellationId, workOrderId: normalized.workOrderId, date: normalized.cancellationDate, sourceRef: normalized.sourceRef });
  state.customerWorkOrders.find(row => row.workOrderId === normalized.workOrderId).status = 'cancelled_before_shipment';
  state.dayEvents.push({ eventId: `${eventId(state, normalized.cancellationDate)}|customer-cancel|${encodeURIComponent(normalized.cancellationId)}`, phase: 'customer_order_cancelled_before_shipment', occurredAt: normalized.cancellationDate, sourceRef: normalized.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}
/** Record an explicit, non-posting delivery after the T-0066 work-order plan is complete. */
export function deliverV3RunCustomerWorkOrder(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['deliveryId', 'sourceRef', 'workOrderId', 'deliveryDate', 'recipientPartyId', 'deliveryCriterionRef', 'acceptanceCriterionRef', 'quantity', 'unit'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_delivery_input', 'delivery requires exactly the explicit work-order, source, recipient, date, criterion, quantity and unit fields');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  for (const key of ['deliveryId', 'sourceRef', 'workOrderId', 'deliveryDate', 'recipientPartyId', 'deliveryCriterionRef', 'acceptanceCriterionRef', 'unit']) {
    if (typeof normalized[key] !== 'string' || !normalized[key].trim()) throw fail('invalid_delivery_input', `${key} must be an explicit non-empty string`);
  }
  if (!isDate(normalized.deliveryDate) || !Number.isFinite(normalized.quantity) || normalized.quantity <= 0) throw fail('invalid_delivery_input', 'deliveryDate and positive quantity must be explicit');
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'customer_delivery' && event.result?.deliveryId === normalized.deliveryId);
  if (prior) {
    if (prior.result.inputFingerprint !== inputFingerprint) throw fail('run_delivery_payload_conflict', 'delivery ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.deliveryDate !== inputState.activeDay.date) throw fail('run_day_not_open', 'delivery must be recorded on the currently open simulation date');
  const order = inputState.customerWorkOrders.find(row => row.workOrderId === normalized.workOrderId);
  const plan = inputState.modules.product?.customerWorkOrderPlans.find(row => row.workOrderId === normalized.workOrderId);
  const contract = plan?.contractSnapshot;
  if (!order || !plan || plan.status !== 'ready_for_delivery' || order.status !== 'ready_for_delivery') throw fail('work_order_not_ready_for_delivery', 'all planned T-0066 operations must be completed before delivery');
  if (normalized.recipientPartyId !== contract.acceptancePartyId || normalized.deliveryCriterionRef !== contract.performanceCriterionRef
      || normalized.acceptanceCriterionRef !== contract.acceptanceCriterionRef || normalized.quantity !== contract.orderQuantity || normalized.unit !== contract.orderUnit) {
    throw fail('delivery_contract_mismatch', 'delivery recipient, criteria, quantity and unit must match the explicit accepted-order contract');
  }
  if (inputState.dayEvents.some(event => event.phase === 'customer_delivery' && event.result?.workOrderId === normalized.workOrderId)) throw fail('work_order_already_delivered', 'this work order already has a delivery event');
  if (inputState.dayEvents.some(event => event.sourceRef === normalized.sourceRef)) throw fail('run_delivery_source_conflict', 'delivery source reference is already used');
  const result = {
    ...normalized,
    contractRef: contract.contractRef, inquiryId: order.inquiryId, offerId: order.offerId, decisionId: order.decisionId,
    status: 'delivered_pending_customer_decision', financeStatus: 'pending_non_posting', inputFingerprint,
    finishedGoodsMovementId: `${inputState.runId}|customer-shipment|${encodeURIComponent(normalized.deliveryId)}`,
  };
  const state = clone(inputState);
  state.modules.product = shipV3CustomerFinishedGoods(state.modules.product, { deliveryId: normalized.deliveryId, workOrderId: normalized.workOrderId, date: normalized.deliveryDate, sourceRef: normalized.sourceRef });
  state.dayEvents.push({ eventId: `${eventId(state, normalized.deliveryDate)}|customer-delivery|${encodeURIComponent(normalized.deliveryId)}`, phase: 'customer_delivery', occurredAt: normalized.deliveryDate, sourceRef: normalized.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}

/** Record the explicit acceptance or rejection decision of the contract's named customer/recipient. */
export function recordV3RunCustomerAcceptanceDecision(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['decisionId', 'sourceRef', 'workOrderId', 'deliveryId', 'decisionDate', 'decision', 'actorRole', 'actorPartyId', 'customerRef', 'authorizedForRef', 'partyAuthorityRef', 'acceptanceCriterionRef'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_customer_decision_input', 'customer decision requires explicit source, order, delivery, actor, customer, authority, date, decision and criterion fields');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  for (const key of ['decisionId', 'sourceRef', 'workOrderId', 'deliveryId', 'decisionDate', 'actorRole', 'actorPartyId', 'customerRef', 'acceptanceCriterionRef']) {
    if (typeof normalized[key] !== 'string' || !normalized[key].trim()) throw fail('invalid_customer_decision_input', `${key} must be an explicit non-empty string`);
  }
  if (!isDate(normalized.decisionDate) || !['accept', 'reject'].includes(normalized.decision) || !['customer', 'recipient'].includes(normalized.actorRole)) throw fail('invalid_customer_decision_input', 'decision date/action and customer or recipient authority must be explicit');
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'customer_acceptance_decision' && event.result?.decisionId === normalized.decisionId);
  if (prior) {
    if (prior.result.inputFingerprint !== inputFingerprint) throw fail('run_customer_decision_payload_conflict', 'customer decision ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.decisionDate !== inputState.activeDay.date) throw fail('run_day_not_open', 'customer decision must be recorded on the currently open simulation date');
  if (inputState.dayEvents.some(event => event.phase === 'customer_acceptance_decision' && event.result?.deliveryId === normalized.deliveryId)) throw fail('delivery_already_decided', 'this delivery already has a customer decision');
  if (inputState.dayEvents.some(event => event.sourceRef === normalized.sourceRef)) throw fail('run_customer_decision_source_conflict', 'customer decision source reference is already used');
  const deliveryEvent = inputState.dayEvents.find(event => event.phase === 'customer_delivery' && event.result?.deliveryId === normalized.deliveryId);
  const delivery = deliveryEvent?.result;
  const order = inputState.customerWorkOrders.find(row => row.workOrderId === normalized.workOrderId);
  const plan = inputState.modules.product?.customerWorkOrderPlans.find(row => row.workOrderId === normalized.workOrderId);
  const contract = plan?.contractSnapshot;
  if (!delivery || !order || !plan || delivery.workOrderId !== normalized.workOrderId) throw fail('customer_decision_delivery_mismatch', 'customer decision must reference an existing delivery for this work order');
  if (normalized.decisionDate < delivery.deliveryDate) throw fail('customer_decision_before_delivery', 'customer decision cannot precede delivery');
  if (!isAuthorizedAcceptanceActor(normalized, order, contract, inputState.modules.market.firms.find(firm => firm.role === 'player')?.firmId) || normalized.acceptanceCriterionRef !== contract.acceptanceCriterionRef) throw fail('customer_decision_authority_mismatch', 'customer identity must match the accepted market inquiry; a distinct recipient needs contract-bound authority evidence and the seller cannot decide');
  const result = {
    ...normalized,
    contractRef: contract.contractRef, inquiryId: order.inquiryId, offerId: order.offerId, marketDecisionId: order.decisionId,
    status: normalized.decision === 'accept' ? 'accepted_non_posting' : 'rejected_non_posting',
    financeStatus: 'pending_non_posting', inputFingerprint,
  };
  const state = clone(inputState);
  state.dayEvents.push({ eventId: `${eventId(state, normalized.decisionDate)}|customer-acceptance|${encodeURIComponent(normalized.decisionId)}`, phase: 'customer_acceptance_decision', occurredAt: normalized.decisionDate, sourceRef: normalized.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}

/** Record physical return evidence after the named customer/recipient rejected a shipped order. No monetary effect is created. */
export function recordV3RunCustomerGoodsReturn(inputState, input = {}) {
  validateV3RunState(inputState);
  const allowed = ['returnId', 'sourceRef', 'workOrderId', 'deliveryId', 'returnDate', 'quantity', 'unit'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== allowed.length || Object.keys(input).some(key => !allowed.includes(key))) throw fail('invalid_customer_return_input', 'return requires explicit return, delivery, work-order, date, source, quantity and unit fields');
  const normalized = Object.fromEntries(allowed.map(key => [key, input[key]]));
  for (const key of ['returnId', 'sourceRef', 'workOrderId', 'deliveryId', 'returnDate', 'unit']) if (typeof normalized[key] !== 'string' || !normalized[key].trim()) throw fail('invalid_customer_return_input', `${key} must be explicit`);
  if (!isDate(normalized.returnDate) || !Number.isFinite(normalized.quantity) || normalized.quantity <= 0) throw fail('invalid_customer_return_input', 'return date and positive quantity are required');
  const inputFingerprint = stable(normalized);
  const prior = inputState.dayEvents.find(event => event.phase === 'customer_goods_returned' && event.result?.returnId === normalized.returnId);
  if (prior) {
    if (prior.result.inputFingerprint !== inputFingerprint) throw fail('run_customer_return_payload_conflict', 'return ID already exists with a different payload');
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(prior.result) };
  }
  if (!inputState.activeDay || normalized.returnDate !== inputState.activeDay.date) throw fail('run_day_not_open', 'return must be recorded on the currently open simulation date');
  if (inputState.dayEvents.some(event => event.sourceRef === normalized.sourceRef)) throw fail('run_customer_return_source_conflict', 'return source reference is already used');
  const delivery = inputState.dayEvents.find(event => event.phase === 'customer_delivery' && event.result?.deliveryId === normalized.deliveryId)?.result;
  const rejection = inputState.dayEvents.find(event => event.phase === 'customer_acceptance_decision' && event.result?.deliveryId === normalized.deliveryId && event.result?.decision === 'reject')?.result;
  if (!delivery || !rejection || delivery.workOrderId !== normalized.workOrderId) throw fail('customer_return_requires_rejected_shipment', 'a physical return requires a matching shipped delivery and customer rejection');
  if (normalized.returnDate <= rejection.decisionDate) throw fail('customer_return_not_after_rejection', 'physical return must be evidenced after the rejection date');
  const movementId = `${inputState.runId}|customer-return|${encodeURIComponent(normalized.returnId)}`;
  const result = { ...normalized, status: 'returned_quarantine_nonposting', movementId, financeStatus: 'pending_non_posting', inputFingerprint };
  const state = clone(inputState);
  state.modules.product = recordV3CustomerFinishedGoodsReturn(state.modules.product, { returnId: normalized.returnId, workOrderId: normalized.workOrderId, deliveryId: normalized.deliveryId, date: normalized.returnDate, sourceRef: normalized.sourceRef, quantity: normalized.quantity, unit: normalized.unit });
  state.dayEvents.push({ eventId: `${eventId(state, normalized.returnDate)}|customer-return|${encodeURIComponent(normalized.returnId)}`, phase: 'customer_goods_returned', occurredAt: normalized.returnDate, sourceRef: normalized.sourceRef, result });
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: clone(result) };
}
/**
 * Read-only projection of already persisted customer-operation, delivery and acceptance facts.
 * It is evidence for later A03 review, not an accounting performance-date or invoice decision.
 */
export function getV3RunCustomerEvidence(inputState, workOrderId) {
  validateV3RunState(inputState);
  if (typeof workOrderId !== 'string' || !workOrderId.trim()) throw fail('invalid_work_order_reference', 'workOrderId must be explicit');
  const order = inputState.customerWorkOrders.find(row => row.workOrderId === workOrderId);
  if (!order) throw fail('unknown_customer_work_order', 'work order does not exist in this validated run');
  const plan = inputState.modules.product?.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId) ?? null;
  const planEvent = inputState.dayEvents.find(event => event.phase === 'customer_work_order_plan' && event.sourceRef === workOrderId) ?? null;
  const inquiry = inputState.modules.market.inquiries.find(row => row.inquiryId === order.inquiryId);
  const acceptedOffer = inquiry?.offers.find(row => row.offerId === order.offerId && row.firmId === inputState.modules.market.firms.find(firm => firm.role === 'player')?.firmId && row.status === 'accepted');
  if (!acceptedOffer || acceptedOffer.calculationSnapshot?.offerId !== order.offerId || acceptedOffer.calculationSnapshot?.netPriceCents !== acceptedOffer.netPriceCents) throw fail('accepted_offer_snapshot_missing', 'customer evidence requires the validated accepted net-R offer snapshot');
  const sourceOrderEvent = inputState.dayEvents.find(event => event.phase === 'work_order_created' && event.result?.workOrderId === workOrderId) ?? null;
  const operations = (plan?.operations ?? []).map(operation => {
    const event = inputState.dayEvents.find(item => item.phase === 'customer_operation_completed'
      && item.sourceRef === `${workOrderId}|${operation.operationId}`) ?? null;
    return {
      operationId: operation.operationId,
      plannedDate: operation.date,
      completionDate: event?.occurredAt ?? null,
      completionEventId: event?.eventId ?? null,
      completionSourceRef: event?.sourceRef ?? null,
      status: event ? 'completed' : operation.status,
      personId: operation.personId,
      equipmentId: operation.equipmentId,
      hours: operation.hours,
      materialsConsumed: event ? clone(operation.materials) : null,
    };
  });
  const deliveryEvent = inputState.dayEvents.find(event => event.phase === 'customer_delivery' && event.result?.workOrderId === workOrderId) ?? null;
  const decisionEvent = deliveryEvent
    ? inputState.dayEvents.find(event => event.phase === 'customer_acceptance_decision' && event.result?.deliveryId === deliveryEvent.result.deliveryId) ?? null
    : null;
  const allOperationsComplete = operations.length > 0 && operations.every(row => row.status === 'completed');
  const evidenceStatus = decisionEvent ? 'customer_decision_recorded'
    : deliveryEvent ? 'delivery_recorded_waiting_for_customer'
      : allOperationsComplete ? 'operations_complete_waiting_for_delivery'
        : plan ? 'operations_in_progress'
          : 'work_order_created_waiting_for_plan';
  return clone({
    evidenceVersion: 'V3-CUSTOMER-EVIDENCE-1',
    runId: inputState.runId,
    workOrderId,
    evidenceStatus,
    financeStatus: 'pending_non_posting',
    postingEffect: 'none',
    orderRefs: {
      inquiryId: order.inquiryId, offerId: order.offerId, marketDecisionId: order.decisionId,
      acceptedNetR: { amountCents: acceptedOffer.netPriceCents, currency: 'EUR', offerSnapshotRef: acceptedOffer.calculationSnapshot.offerId, submissionEventId: acceptedOffer.submittedEventId },
      customerPartyId: order.customerPartyId, acceptedAt: order.acceptedAt,
      workOrderEventId: sourceOrderEvent?.eventId ?? null,
    },
    contract: plan?.contractSnapshot ? {
      contractRef: plan.contractSnapshot.contractRef,
      contractType: plan.contractSnapshot.contractType,
      customerPartyId: plan.contractSnapshot.customerPartyId,
      buyerPartyId: plan.contractSnapshot.buyerPartyId,
      acceptancePartyId: plan.contractSnapshot.acceptancePartyId,
      authorizedForRef: plan.contractSnapshot.authorizedForRef ?? null,
      partyAuthorityRef: plan.contractSnapshot.partyAuthorityRef ?? null,
      performanceCriterionRef: plan.contractSnapshot.performanceCriterionRef,
      acceptanceCriterionRef: plan.contractSnapshot.acceptanceCriterionRef,
      quantity: plan.contractSnapshot.orderQuantity,
      unit: plan.contractSnapshot.orderUnit,
      planEventId: planEvent?.eventId ?? null,
    } : null,
    operations,
    delivery: deliveryEvent ? {
      eventId: deliveryEvent.eventId, sourceRef: deliveryEvent.sourceRef,
      deliveryId: deliveryEvent.result.deliveryId, deliveryDate: deliveryEvent.result.deliveryDate,
      recipientPartyId: deliveryEvent.result.recipientPartyId,
      deliveryCriterionRef: deliveryEvent.result.deliveryCriterionRef,
      acceptanceCriterionRef: deliveryEvent.result.acceptanceCriterionRef,
      quantity: deliveryEvent.result.quantity, unit: deliveryEvent.result.unit,
      status: deliveryEvent.result.status,
    } : null,
    customerDecision: decisionEvent ? {
      eventId: decisionEvent.eventId, sourceRef: decisionEvent.sourceRef,
      decisionId: decisionEvent.result.decisionId, decisionDate: decisionEvent.result.decisionDate,
      decision: decisionEvent.result.decision, actorRole: decisionEvent.result.actorRole,
      actorPartyId: decisionEvent.result.actorPartyId, customerRef: decisionEvent.result.customerRef,
      authorizedForRef: decisionEvent.result.authorizedForRef ?? null,
      partyAuthorityRef: decisionEvent.result.partyAuthorityRef ?? null,
      acceptanceCriterionRef: decisionEvent.result.acceptanceCriterionRef,
      status: decisionEvent.result.status,
    } : null,
    invoiceEvent: null,
    paymentEvent: null,
    limitations: [
      'This projection reports only existing run facts; it does not determine legal/accounting performance, invoice eligibility, an invoice amount, tax status, due-date anchor, payment, COGS, or posting.',
      'The accepted offer is referenced by offerId only. D-0162 R remains the immutable net offer snapshot and is not promoted to an invoice position by this projection.',
      'A03 must keep the finance handoff pending/non-posting until separately authorized invoice/payment source events and accounting treatment exist.',
    ],
  });
}
/** Close an open shared day after player actions; market expiry is always last. */
export function closeV3RunDay(inputState, input = {}) {
  validateV3RunState(inputState);
  const date = input.date ?? inputState.activeDay?.date;
  if (!isDate(date)) throw fail('invalid_run_date', 'date must be a valid ISO date');
  if (!inputState.activeDay) {
    if (inputState.processedDays[date]) return { ok: true, duplicate: true, state: clone(inputState), result: clone(inputState.dayEvents.find(event => event.eventId === `${eventId(inputState, date)}|run-result`)?.result) };
    throw fail('run_day_not_open', 'the shared run day is not open');
  }
  if (date !== inputState.activeDay.date) throw fail('run_day_date_mismatch', 'only the currently open date can be closed');
  let state = clone(inputState);
  for (const deliveryEvent of state.dayEvents.filter(item => item.phase === 'customer_delivery' && f3DeadlineDate(item.result.deliveryDate) === date)) {
    const delivery = deliveryEvent.result;
    if (state.dayEvents.some(item => item.phase === 'customer_acceptance_decision' && item.result?.deliveryId === delivery.deliveryId)) continue;
    const order = state.customerWorkOrders.find(item => item.workOrderId === delivery.workOrderId);
    const plan = state.modules.product?.customerWorkOrderPlans.find(item => item.workOrderId === delivery.workOrderId);
    const contract = plan?.contractSnapshot;
    if (!order || !contract) throw fail('f3_customer_decision_source_missing', 'F3 customer decision requires delivered order and contract snapshot');
    const recipientActs = contract.acceptancePartyId !== order.customerPartyId;
    const decisionId = 'SIM|D-0157|F3|' + encodeURIComponent(order.workOrderId);
    const sourceRef = 'simulation:D-0157:F3:' + encodeURIComponent(order.workOrderId);
    const recorded = recordV3RunCustomerAcceptanceDecision(state, {
      decisionId, sourceRef, workOrderId: order.workOrderId, deliveryId: delivery.deliveryId,
      decisionDate: date, decision: 'accept', actorRole: recipientActs ? 'recipient' : 'customer',
      actorPartyId: contract.acceptancePartyId, customerRef: order.customerPartyId,
      authorizedForRef: recipientActs ? order.customerPartyId : null,
      partyAuthorityRef: recipientActs ? contract.partyAuthorityRef : null,
      acceptanceCriterionRef: contract.acceptanceCriterionRef,
    });
    state = recorded.state;
  }
  const closed = okOrThrow(closeV3MarketDay(state.modules.market, date)); state.modules.market = closed.state;
  const closeEvent = { eventId: `${eventId(state, date)}|market-close`, phase: 'market_expiry', occurredAt: date, sourceRef: `market-day:${date}`, result: closed.result };
  state.dayEvents.push(closeEvent);
  state.activeDay = null;
  const dayEvents = state.dayEvents.filter(event => event.occurredAt === date && event.phase !== 'day_result');
  const dayResult = {
    date, eventOrder: dayEvents.map(event => event.phase),
    receivedInquiryIds: state.dayEvents.find(event => event.eventId === `${eventId(state, date)}|market-open`)?.result?.receivedInquiryIds ?? [],
    decisions: state.dayEvents.find(event => event.eventId === `${eventId(state, date)}|market-open`)?.result?.decisions ?? [],
    expiredInquiryIds: closed.result.expiredInquiryIds,
    playerInquiries: getV3MarketPlayerView(state.modules.market).inquiries,
    createdWorkOrderIds: state.customerWorkOrders.filter(order => order.acceptedAt === date).map(order => order.workOrderId),
    financeHandoffsPending: state.financeHandoffs.filter(handoff => handoff.status === 'pending_non_posting').length,
  };
  state.dayEvents.push({ eventId: `${eventId(state, date)}|run-result`, phase: 'day_result', date, result: dayResult });
  const fingerprint = stable({ openFingerprint: state.dayOpenFingerprints[date], offers: dayEvents.filter(event => event.phase === 'player_offer').map(event => event.sourceRef) });
  state.processedDays[date] = fingerprint; state.dayInputFingerprints[date] = fingerprint;
  validateV3RunState(state);
  return { ok: true, duplicate: false, state, result: dayResult };
}

/** Backward-compatible single-call wrapper over open → offers → close. */
export function advanceV3RunDay(inputState, input = {}) {
  validateV3RunState(inputState);
  const date = normalizeRunDate(inputState, input); const payload = { ...input, date }; const fingerprint = stable(payload);
  if (inputState.processedDays[date]) {
    if (inputState.dayInputFingerprints[date] !== fingerprint) throw fail('run_day_payload_conflict', `date ${date} was already processed with different input`);
    return { ok: true, duplicate: true, state: clone(inputState), result: clone(inputState.dayEvents.find(event => event.eventId === `${eventId(inputState, date)}|run-result`)?.result) };
  }
  if (inputState.activeDay) throw fail('run_day_already_open', 'use submitV3RunOffer and closeV3RunDay for the open day');
  const { offers = [], date: ignoredDate, ...openInput } = input;
  if (!Array.isArray(offers)) throw fail('invalid_offers', 'offers must be an array');
  let state = openV3RunDay(inputState, { ...openInput, date });
  for (const offer of offers) state = submitV3RunOffer(state.state, offer);
  const closed = closeV3RunDay(state.state, { date });
  const resultState = closed.state;
  resultState.processedDays[date] = fingerprint; resultState.dayInputFingerprints[date] = fingerprint;
  validateV3RunState(resultState);
  return { ok: true, duplicate: false, state: resultState, result: closed.result };
}

/** Project the immutable EVT catalog and queue without blocking or advancing the shared simulation day. */
export function getV3RunLearningCatalog() { return projectV3EventCatalog(); }
export function getV3RunLearningEvents(inputState, input = {}) {
  validateV3RunState(inputState);
  const result = getLearningEvents(inputState, input);
  validateV3RunState(result.state);
  return result;
}
export function answerV3RunLearningEvent(inputState, input = {}) {
  validateV3RunState(inputState);
  const result = answerLearningEvent(inputState, input);
  if (result.ok) validateV3RunState(result.state);
  return result;
}

