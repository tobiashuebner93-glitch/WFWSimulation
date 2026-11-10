/*
 * Isolated V3 company-formation and transaction state machine.
 * Pure JSON in / pure JSON out. No V1/V2 engine or finance/HR state mutation.
 */

export const V3_COMPANY_MODEL_VERSION = 'v3-company-formation-1';

const FOUNDING_STAGES = [
  'idea',
  'market_check',
  'offer_defined',
  'resources_and_capital_plan',
  'viability_assessed',
  'form_selected',
  'formation_prepared',
  'operating_ready',
];
const ENABLED_FORMS = new Set(['einzelunternehmen', 'gmbh_co_kg']);
const CANDIDATE_FORMS = new Set(['ag', 'eg', 'gmbh_co_kgaa']);
const ENTITY_REGISTER_STATUSES = new Set(['preparation', 'filing_pending', 'registered', 'rejected_or_returned']);

const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function failure(state, code, message) {
  return { ok: false, duplicate: false, error: { code, message }, state: clone(state) };
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasEvidence(record, status = 'passed') {
  return record && record.status === status && nonEmpty(record.sourceRef);
}

function entityById(state, entityId) {
  return state.entities.find(entity => entity.entityId === entityId);
}

function hasHolder(state, holderId) {
  return state.persons.some(person => person.personId === holderId) || state.entities.some(entity => entity.entityId === holderId);
}

function dealById(state, dealId) {
  return state.deals.find(deal => deal.dealId === dealId);
}

function cooperationById(state, cooperationId) {
  return state.cooperations.find(item => item.cooperationId === cooperationId);
}

function financeHandoff(event, type, details) {
  return {
    handoffId: `finance:${event.eventId}`,
    sourceEventId: event.eventId,
    sourceType: type,
    effectiveDate: event.effectiveDate,
    status: 'no_financial_effect_until_explicit_A03_event',
    requiredForA03Evaluation: ['named payer/payee or parties', 'contract/evidence reference', 'explicit amount or driver and currency', 'event and applicable financial dates', 'explicit authorization under the A03 contract'],
    details: clone(details),
    financialEventRef: null,
    ledgerMutation: false,
    cashMutation: false,
  };
}

function addEvent(state, event) {
  const canonicalPayload = stable(event);
  state.processedEvents[event.eventId] = canonicalPayload;
  state.events.push(clone(event));
}

function validateEventEnvelope(state, event) {
  if (!state || state.modelVersion !== V3_COMPANY_MODEL_VERSION) return 'unsupported_model_version';
  if (!event || !nonEmpty(event.eventId) || !nonEmpty(event.type) || !validDate(event.effectiveDate) || !nonEmpty(event.sourceRef)) return 'invalid_event_envelope';
  return null;
}

export function createV3FormationState({ scenarioId, startDate, founderPersonId, initialEntityId, initialEntitySourceRef }) {
  if (![scenarioId, founderPersonId, initialEntityId, initialEntitySourceRef].every(nonEmpty) || !validDate(startDate)) {
    throw new TypeError('scenarioId, startDate, founderPersonId, initialEntityId und initialEntitySourceRef müssen explizit gültig sein.');
  }
  return {
    modelVersion: V3_COMPANY_MODEL_VERSION,
    scenarioId,
    startDate,
    foundingProject: {
      projectId: `FOUND-${scenarioId}`,
      founderPersonId,
      stage: 'idea',
      selectedForm: null,
      viability: { status: 'assessment_incomplete', assessmentId: null, result: null },
      formationStatus: 'in_progress',
    },
    persons: [{ personId: founderPersonId, sourceRef: initialEntitySourceRef }],
    entities: [{
      entityId: initialEntityId,
      entityType: 'einzelunternehmen',
      legalForm: 'einzelunternehmen',
      founderPersonId,
      formationStatus: 'existing_at_scenario_start',
      registerStatus: 'not_applicable',
      operatingStatus: 'operating',
      effectiveFrom: startDate,
      sourceRef: initialEntitySourceRef,
    }],
    ownerships: [{ holderId: founderPersonId, entityId: initialEntityId, shareOrControlBasis: 'sole_proprietor', effectiveFrom: startDate, effectiveTo: null, sourceEventId: initialEntitySourceRef }],
    cooperations: [],
    deals: [],
    financeHandoffs: [],
    events: [],
    processedEvents: {},
  };
}

/**
 * Apply one versioned V3 event without mutating the input state.
 * Result: {ok,state,duplicate,error?,emitted?,financeHandoffs?}.
 */
export function applyV3FormationEvent(inputState, inputEvent) {
  if (inputState === null || typeof inputState !== 'object' || Array.isArray(inputState)) return failure(inputState, 'invalid_state_shape', 'Der V3-Zustand muss ein JSON-Objekt sein.');
  const envelopeError = validateEventEnvelope(inputState, inputEvent);
  if (envelopeError) return failure(inputState, envelopeError, 'Ungültige oder nicht unterstützte V3-Ereignishülle.');
  const stateValidation = validateV3FormationState(inputState);
  if (!stateValidation.valid) return failure(inputState, 'invalid_state_shape', 'Der V3-Zustand ist unvollständig oder strukturell ungültig: ' + stateValidation.errors.join(', ') + '.');
  let eventJson;
  let payload;
  try {
    eventJson = JSON.stringify(inputEvent);
    if (typeof eventJson !== 'string') return failure(inputState, 'unserializable_event', 'Das Ereignis ist nicht als JSON serialisierbar.');
    payload = stable(JSON.parse(eventJson));
  } catch { return failure(inputState, 'unserializable_event', 'Das Ereignis ist nicht als JSON serialisierbar.'); }

  const prior = inputState.processedEvents[inputEvent.eventId];
  if (prior !== undefined) {
    if (prior !== payload) return failure(inputState, 'event_id_payload_conflict', 'Dieselbe eventId wurde bereits mit einem anderen Payload verarbeitet.');
    return { ok: true, duplicate: true, state: clone(inputState), emitted: null, financeHandoffs: [] };
  }

  const state = clone(inputState);
  const event = JSON.parse(eventJson);
  const block = (code, message) => failure(inputState, code, message);
  const project = state.foundingProject;
  const sources = [];

  switch (event.type) {
    case 'ADVANCE_FOUNDING_STAGE': {
      const currentIndex = FOUNDING_STAGES.indexOf(project.stage);
      if (currentIndex < 0 || event.fromStage !== project.stage || FOUNDING_STAGES[currentIndex + 1] !== event.toStage || ['viability_assessed', 'form_selected', 'formation_prepared', 'operating_ready'].includes(event.toStage)) {
        return block('invalid_stage_transition', 'Gründungsabschnitt ist nicht der zulässige nächste Abschnitt.');
      }
      if (!nonEmpty(event.stageEvidenceRef)) return block('missing_stage_evidence', 'Für den Abschnitt fehlt ein expliziter Nachweisbezug.');
      project.stage = event.toStage;
      sources.push(event.stageEvidenceRef);
      break;
    }
    case 'ASSESS_VIABILITY': {
      if (project.stage !== 'resources_and_capital_plan') return block('assessment_out_of_order', 'Tragfähigkeitsbewertung ist erst nach dem Ressourcen-/Kapitalplan zulässig.');
      const required = ['market', 'offer', 'capacity', 'costs', 'financing', 'requirements'];
      if (!required.every(key => hasEvidence(event.assessmentInputs?.[key], 'complete'))) return block('assessment_inputs_incomplete', 'Alle sechs Bewertungsbereiche benötigen vollständige, referenzierte Eingaben.');
      if (!['viable', 'not_viable'].includes(event.result) || !nonEmpty(event.assessmentId)) return block('invalid_assessment_result', 'Bewertungsergebnis oder assessmentId fehlt.');
      project.viability = { status: 'assessed', assessmentId: event.assessmentId, result: event.result, effectiveDate: event.effectiveDate, sourceRef: event.sourceRef, inputRefs: required.map(key => event.assessmentInputs[key].sourceRef) };
      project.stage = 'viability_assessed';
      sources.push(...project.viability.inputRefs);
      break;
    }
    case 'SELECT_FORM': {
      if (project.stage !== 'viability_assessed' || project.viability.status !== 'assessed') return block('form_selection_out_of_order', 'Rechtsformwahl benötigt eine vollständige Tragfähigkeitsbewertung.');
      if (CANDIDATE_FORMS.has(event.legalForm)) return block('candidate_not_enabled', 'Diese Rechtsform ist Kandidat und ohne ausdrückliche Vor-Release-Entscheidung nicht freigeschaltet.');
      if (!ENABLED_FORMS.has(event.legalForm)) return block('unsupported_legal_form', 'Diese Rechtsform liegt außerhalb des bestätigten V3-Umfangs.');
      if (!nonEmpty(event.selectionRef)) return block('missing_selection_evidence', 'Die Rechtsformwahl benötigt einen expliziten Nachweisbezug.');
      if (event.legalForm === 'einzelunternehmen') {
        project.selectedForm = event.legalForm;
      } else {
        const ids = event.entityIds || {};
        if (![ids.gmbhEntityId, ids.kgEntityId].every(nonEmpty) || ids.gmbhEntityId === ids.kgEntityId || ids.gmbhEntityId === state.entities[0].entityId || ids.kgEntityId === state.entities[0].entityId || ids.gmbhEntityId === ids.kgEntityId) return block('invalid_entity_ids', 'GmbH & Co. KG benötigt zwei getrennte, neue und explizite entityIds.');
        if (!Array.isArray(event.ownershipRefs) || !['gmbhEntityId', 'kgEntityId'].every(key => event.ownershipRefs.some(ref => ref?.entityId === ids[key] && hasHolder(state, ref.holderId) && nonEmpty(ref.shareOrControlBasis) && nonEmpty(ref.sourceRef)))) return block('initial_ownership_refs_required', 'Für beide neuen Rechtsträger ist mindestens eine explizite Inhaber-/Beteiligungsreferenz erforderlich.');
        if (event.ownershipRefs.some(ref => !ref || ![ids.gmbhEntityId, ids.kgEntityId].includes(ref.entityId)) || !Array.isArray(event.partnerRefs) || event.partnerRefs.some(ref => !ref || ref.kgEntityId !== ids.kgEntityId || !nonEmpty(ref.partnerId) || !['komplementaer', 'kommanditist'].includes(ref.role) || !nonEmpty(ref.sourceRef)) || new Set((event.partnerRefs || []).map(ref => ref.partnerId)).size !== (event.partnerRefs || []).length || !event.partnerRefs.some(ref => ref.partnerId === ids.gmbhEntityId && ref.role === 'komplementaer') || !event.partnerRefs.some(ref => ref.role === 'kommanditist') || event.partnerRefs.some(ref => ref.role === 'komplementaer' && ref.partnerId !== ids.gmbhEntityId) || event.partnerRefs.some(ref => ref.role === 'kommanditist' && (ref.partnerId === ids.gmbhEntityId || !hasHolder(state, ref.partnerId)))) return block('kg_partner_roles_required', 'GmbH & Co. KG benötigt explizite KG-Partnerrollen mit der GmbH als Komplementärin und mindestens einem getrennten Kommanditisten.');
        if (state.entities.some(e => e.entityId === ids.gmbhEntityId || e.entityId === ids.kgEntityId)) return block('entity_id_collision', 'Eine entityId ist bereits vergeben.');
        state.entities.push({ entityId: ids.gmbhEntityId, entityType: 'gmbh', legalForm: 'gmbh', founderPersonId: project.founderPersonId, formationStatus: 'preparation', registerStatus: 'not_started', operatingStatus: 'blocked', effectiveFrom: event.effectiveDate, sourceRef: event.selectionRef });
        state.entities.push({ entityId: ids.kgEntityId, entityType: 'kg', legalForm: 'gmbh_co_kg', founderPersonId: project.founderPersonId, gmbhEntityId: ids.gmbhEntityId, partners: clone(event.partnerRefs.filter(ref => ref.kgEntityId === ids.kgEntityId)), formationStatus: 'preparation', registerStatus: 'not_started', operatingStatus: 'blocked', effectiveFrom: event.effectiveDate, sourceRef: event.selectionRef });
        for (const ref of event.ownershipRefs) state.ownerships.push({ holderId: ref.holderId, entityId: ref.entityId, shareOrControlBasis: ref.shareOrControlBasis, effectiveFrom: event.effectiveDate, effectiveTo: null, sourceEventId: event.eventId, sourceRef: ref.sourceRef });
        project.selectedForm = event.legalForm;
      }
      project.stage = 'form_selected';
      sources.push(event.selectionRef);
      if (event.ownershipRefs) sources.push(...event.ownershipRefs.map(ref => ref.sourceRef));
      if (event.partnerRefs) sources.push(...event.partnerRefs.map(ref => ref.sourceRef));
      break;
    }
    case 'PREPARE_FORMATION': {
      if (project.stage !== 'form_selected') return block('formation_preparation_out_of_order', 'Unterlagenvorbereitung setzt eine freigeschaltete Formauswahl voraus.');
      if (!nonEmpty(event.preparationRef) || !Array.isArray(event.entityIds) || !event.entityIds.length || event.entityIds.some(id => !entityById(state, id))) return block('invalid_preparation_inputs', 'Vorbereitungsnachweis und gültige Rechtsträgerreferenzen sind erforderlich.');
      const expectedIds = project.selectedForm === 'gmbh_co_kg' ? state.entities.filter(e => ['gmbh', 'kg'].includes(e.entityType)).map(e => e.entityId) : [state.entities[0].entityId];
      if (event.entityIds.length !== expectedIds.length || expectedIds.some(id => !event.entityIds.includes(id)) || new Set(event.entityIds).size !== event.entityIds.length) return block('formation_entity_scope_mismatch', 'Vorbereitung muss genau die Rechtsträger des gewählten Gründungsfalls referenzieren.');
      for (const entityId of event.entityIds) {
        const entity = entityById(state, entityId);
        if (entity.entityType !== 'einzelunternehmen') {
          entity.formationStatus = 'preparation';
          entity.registerStatus = 'preparation';
        }
      }
      project.stage = 'formation_prepared';
      project.formationStatus = 'prepared';
      sources.push(event.preparationRef);
      break;
    }
    case 'SET_REGISTER_STATUS': {
      const entity = entityById(state, event.entityId);
      if (!entity || entity.entityType === 'einzelunternehmen' || !ENTITY_REGISTER_STATUSES.has(event.status) || !nonEmpty(event.registerEvidenceRef)) return block('invalid_register_update', 'Formstatus benötigt einen nicht-individuellen Rechtsträger, gültigen Status und Registerbeleg.');
      const allowed = { preparation: ['filing_pending', 'rejected_or_returned'], filing_pending: ['registered', 'rejected_or_returned'], rejected_or_returned: ['preparation'], registered: [] };
      if (!(allowed[entity.registerStatus] || []).includes(event.status)) return block('invalid_register_transition', 'Registerstatus kann nur durch einen zulässigen, belegten Folgeschritt geändert werden.');
      entity.registerStatus = event.status;
      entity.registerEvidenceRef = event.registerEvidenceRef;
      entity.registerEffectiveDate = event.effectiveDate;
      entity.formationStatus = event.status === 'registered' ? 'registered' : event.status;
      sources.push(event.registerEvidenceRef);
      break;
    }
    case 'AUTHORIZE_KG_PREREGISTRATION_ACTIVITY': {
      const kg = entityById(state, event.kgEntityId);
      const partnerIds = event.partnerIds;
      const consentRefs = event.partnerConsentRefs;
      if (!kg || kg.entityType !== 'kg' || kg.registerStatus === 'registered') return block('invalid_kg_preregistration_target', 'Vorregisterpfad gilt nur für eine noch nicht eingetragene KG.');
      const expectedPartnerIds = (kg?.partners || []).map(partner => partner.partnerId);
      if (!Array.isArray(partnerIds) || partnerIds.length < 2 || partnerIds.some(id => !hasHolder(state, id)) || expectedPartnerIds.length !== partnerIds.length || expectedPartnerIds.some((id, index) => id !== partnerIds[index]) || !Array.isArray(consentRefs) || consentRefs.length !== partnerIds.length || consentRefs.some(ref => !nonEmpty(ref))) return block('all_partner_consents_required', 'Zustimmung aller im KG-Vertrag referenzierten Gesellschafter muss einzeln in identischer Reihenfolge nachgewiesen sein.');
      if (!hasEvidence(event.section123Review, 'cleared')) return block('section123_review_required', 'Die Prüfung zu § 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB und dessen Ausnahme muss als geklärt belegt sein.');
      if (kg.gmbhEntityId && (!partnerIds.includes(kg.gmbhEntityId) || entityById(state, kg.gmbhEntityId)?.registerStatus !== 'registered')) return block('gmbh_partner_not_registered', 'Bei GmbH & Co. KG muss die GmbH als Komplementärin separat eingetragen und als Partner referenziert sein.');
      kg.formationStatus = 'formed_pre_registration';
      kg.preregistrationActivity = { effectiveDate: event.effectiveDate, partnerIds: [...partnerIds], partnerConsentRefs: [...consentRefs], section123Review: clone(event.section123Review), sourceRef: event.sourceRef };
      sources.push(...consentRefs, event.section123Review.sourceRef);
      break;
    }
    case 'ASSESS_OPERATIONAL_READINESS': {
      if (project.stage !== 'formation_prepared' || project.viability.result !== 'viable') return block('viability_gate_failed', 'Betriebsbereitschaft benötigt vorbereitete Gründungsunterlagen und eine vollständige positive Tragfähigkeitsbewertung.');
      const required = ['representatives', 'locationAndResources', 'requirements', 'financialPlan'];
      if (!required.every(key => hasEvidence(event.readiness?.[key], 'passed'))) return block('readiness_evidence_incomplete', 'Alle vier Betriebsbereitschaftsprüfungen benötigen bestandene, referenzierte Nachweise.');
      if (project.selectedForm === 'gmbh_co_kg') {
        const gmbh = state.entities.find(e => e.entityType === 'gmbh');
        const kg = state.entities.find(e => e.entityType === 'kg');
        if (!gmbh || gmbh.registerStatus !== 'registered' || !kg || !(kg.registerStatus === 'registered' || kg.formationStatus === 'formed_pre_registration')) return block('entity_formation_gate_failed', 'GmbH und KG benötigen getrennte, belegte Formstatus; GmbH-Eintragung bleibt zwingend.');
      }
      project.readiness = { status: 'passed', effectiveDate: event.effectiveDate, sourceRef: event.sourceRef, inputRefs: required.map(key => event.readiness[key].sourceRef) };
      project.stage = 'operating_ready';
      for (const entity of state.entities) if (entity.legalForm === project.selectedForm || (project.selectedForm === 'gmbh_co_kg' && ['gmbh', 'kg'].includes(entity.entityType))) entity.operatingStatus = 'ready';
      sources.push(...project.readiness.inputRefs);
      break;
    }
    case 'START_OPERATIONS': {
      if (project.stage !== 'operating_ready' || project.viability.result !== 'viable' || project.readiness?.status !== 'passed') return block('operations_not_ready', 'Betriebsaufnahme setzt bestandene Tragfähigkeits- und Bereitschaftsprüfungen voraus.');
      project.stage = 'operating';
      project.formationStatus = 'operating';
      for (const entity of state.entities) if (entity.operatingStatus === 'ready') entity.operatingStatus = 'operating';
      break;
    }
    case 'OPEN_COOPERATION': {
      if (!nonEmpty(event.cooperationId) || cooperationById(state, event.cooperationId) || !['joint_procurement', 'arbeitsgemeinschaft'].includes(event.cooperationType) || !Array.isArray(event.participantEntityIds) || event.participantEntityIds.length < 2 || event.participantEntityIds.some(id => !entityById(state, id)) || !nonEmpty(event.purposeRef) || !nonEmpty(event.termsRef)) return block('invalid_cooperation', 'Kooperation benötigt eindeutige ID, unterstützten Typ, mindestens zwei Rechtsträger und Zweck-/Vertragsreferenzen.');
      state.cooperations.push({ cooperationId: event.cooperationId, cooperationType: event.cooperationType, participantEntityIds: [...event.participantEntityIds], purposeRef: event.purposeRef, termsRef: event.termsRef, status: 'proposed', legalFormReview: { status: 'pending', sourceRef: null }, competitionReview: { status: 'pending', sourceRef: null }, effectiveDate: event.effectiveDate });
      sources.push(event.purposeRef, event.termsRef);
      break;
    }
    case 'ASSESS_COOPERATION': {
      const item = cooperationById(state, event.cooperationId);
      if (!item || item.status !== 'proposed' || !hasEvidence(event.legalFormReview, ['cleared', 'not_applicable'].includes(event.legalFormReview?.status) ? event.legalFormReview.status : 'cleared') || !hasEvidence(event.competitionReview, ['cleared', 'not_applicable'].includes(event.competitionReview?.status) ? event.competitionReview.status : 'cleared')) return block('cooperation_reviews_incomplete', 'Rechtsform- und Wettbewerbsprüfung benötigen explizite, referenzierte Ergebnisse.');
      if (!['cleared', 'not_applicable'].includes(event.legalFormReview.status) || !['cleared', 'not_applicable'].includes(event.competitionReview.status)) return block('cooperation_not_cleared', 'Offene oder negative Prüfungen erlauben keine Freigabe der Kooperation.');
      item.legalFormReview = clone(event.legalFormReview);
      item.competitionReview = clone(event.competitionReview);
      item.status = 'assessed';
      sources.push(event.legalFormReview.sourceRef, event.competitionReview.sourceRef);
      break;
    }
    case 'CLOSE_COOPERATION': {
      const item = cooperationById(state, event.cooperationId);
      if (!item || item.status !== 'assessed' || !nonEmpty(event.closureRef)) return block('cooperation_not_ready_to_close', 'Nur eine geprüfte Kooperation kann mit Abschlussbeleg geschlossen werden.');
      item.status = 'closed';
      item.closedAt = event.effectiveDate;
      const handoff = item.cooperationType === 'joint_procurement' ? financeHandoff(event, 'joint_procurement', { cooperationId: item.cooperationId, participantEntityIds: item.participantEntityIds, termsRef: item.termsRef, financialEffect: 'no_effect_without_specific_order_delivery_or_payment_event' }) : null;
      if (handoff) state.financeHandoffs.push(handoff);
      sources.push(event.closureRef);
      if (handoff) state._newFinanceHandoffs = [handoff];
      break;
    }
    case 'OPEN_SHARE_DEAL':
    case 'OPEN_ASSET_DEAL': {
      const isShare = event.type === 'OPEN_SHARE_DEAL';
      const dealType = isShare ? 'share_deal' : 'asset_business_deal';
      if (!nonEmpty(event.dealId) || dealById(state, event.dealId) || !entityById(state, event.buyerEntityId) || !entityById(state, event.targetEntityId) || event.buyerEntityId === event.targetEntityId || !nonEmpty(event.termsRef)) return block('invalid_deal_parties_or_terms', 'Transaktion benötigt eindeutige ID, verschiedene vorhandene Rechtsträger und explizite Vertragsreferenz.');
      if (isShare && (!Array.isArray(event.ownershipChangeRefs) || !event.ownershipChangeRefs.length || event.ownershipChangeRefs.some(change => !hasHolder(state, change.fromHolderId) || !hasHolder(state, change.toHolderId) || !state.ownerships.some(owner => owner.entityId === event.targetEntityId && owner.holderId === change.fromHolderId && owner.effectiveTo === null) || !nonEmpty(change.shareOrControlBasis) || typeof change.endsPriorRelationship !== 'boolean' || !nonEmpty(change.sourceRef)))) return block('ownership_changes_required', 'Anteilserwerb benötigt bestehende Inhaberreferenz, bisherigen/neuen Inhaber, explizite Angabe zum Ende der Vorbeziehung, Beteiligungs-/Kontrollgrundlage und Nachweis.');
      if (!isShare && (!Array.isArray(event.assetTransferRefs) || !event.assetTransferRefs.length)) return block('asset_scope_required', 'Asset-/Betriebskauf benötigt eine explizite Übertragungsliste.');
      state.deals.push({ dealId: event.dealId, dealType, buyerEntityId: event.buyerEntityId, targetEntityId: event.targetEntityId, termsRef: event.termsRef, status: 'proposed', competitionReview: { status: 'pending', sourceRef: null }, legalReview: { status: 'pending', sourceRef: null }, ownershipChangeRefs: isShare ? clone(event.ownershipChangeRefs) : [], assetTransferRefs: isShare ? [] : clone(event.assetTransferRefs), businessTransferReview: isShare ? { status: 'not_applicable', sourceRef: event.sourceRef } : { status: 'pending', sourceRef: null }, section25Review: isShare ? { status: 'not_applicable', sourceRef: event.sourceRef } : { status: 'pending', sourceRef: null }, employeeTransferReviews: [], effectiveDate: event.effectiveDate });
      sources.push(event.termsRef, ...(isShare ? event.ownershipChangeRefs : event.assetTransferRefs));
      break;
    }
    case 'REVIEW_DEAL': {
      const deal = dealById(state, event.dealId);
      if (!deal || !['proposed', 'review_pending'].includes(deal.status)) return block('deal_not_reviewable', 'Transaktion ist nicht offen oder wurde bereits geschlossen.');
      if (!hasEvidence(event.legalReview, event.legalReview?.status) || !['cleared', 'needs_review', 'not_applicable'].includes(event.legalReview.status) || !hasEvidence(event.competitionReview, event.competitionReview?.status) || !['cleared', 'needs_review', 'not_applicable'].includes(event.competitionReview.status)) return block('deal_reviews_invalid', 'Rechts- und Wettbewerbsreview benötigen gültigen Status und Quellenbezug.');
      if (deal.dealType === 'asset_business_deal') {
        if (!hasEvidence(event.businessTransferReview, event.businessTransferReview?.status) || !['applies', 'not_applicable', 'needs_review'].includes(event.businessTransferReview.status) || !hasEvidence(event.section25Review, event.section25Review?.status) || !['applies', 'not_applicable', 'needs_review'].includes(event.section25Review.status)) return block('transfer_reviews_invalid', '§ 613a- und § 25-Prüfungen benötigen explizite Status-/Quellenbezüge.');
        if (event.businessTransferReview.status === 'applies' && (!Array.isArray(event.employeeTransferReviews) || event.employeeTransferReviews.some(r => !nonEmpty(r.employeeRef) || !['transfers', 'objects', 'needs_review'].includes(r.outcome) || !['complete', 'pending'].includes(r.informationStatus) || !['not_received', 'pending_window', 'received', 'window_elapsed', 'not_applicable'].includes(r.objectionStatus) || !nonEmpty(r.sourceRef)))) return block('employee_transfer_review_incomplete', 'Bei § 613a-Anwendung müssen betroffene Beschäftigte, Information, Widerspruchsstatus und Ergebnis referenziert werden; eine leere Liste ist als geprüfter Beschäftigtenbestand zulässig.');
        if (event.businessTransferReview.status === 'applies' && (!event.section613a2Review || !hasEvidence(event.section613a2Review, event.section613a2Review?.status) || !['assessed', 'not_applicable'].includes(event.section613a2Review.status) || !Array.isArray(event.section613a2Review.claims) || event.section613a2Review.claims.some(claim => !nonEmpty(claim.obligationRef) || claim.priorEmployerEntityId !== deal.targetEntityId || claim.newEmployerEntityId !== deal.buyerEntityId || !validDate(claim.incurredAt) || !validDate(claim.dueAt) || !validDate(claim.measurementPeriodStart) || !validDate(claim.measurementPeriodEnd) || !['unknown', 'documented'].includes(claim.amountStatus) || (claim.amountStatus === 'documented' && !nonEmpty(claim.amountRef)) || !nonEmpty(claim.sourceRef)))) return block('section613a2_review_incomplete', '§ 613a Abs. 2 benötigt eine abgeschlossene Quellenprüfung und gegebenenfalls Parteien-, Anspruchs-, Entstehungs-, Fälligkeits-, Bemessungszeitraum- und Betragsreferenzen.');
        if (event.businessTransferReview.status !== 'applies' && event.section613a2Review && (!hasEvidence(event.section613a2Review, 'not_applicable') || !Array.isArray(event.section613a2Review.claims) || event.section613a2Review.claims.length)) return block('section613a2_status_conflict', '§ 613a Abs. 2 darf nur bei passendem § 613a-Review bewertet oder als nicht anwendbar belegt werden.');
        if (event.section25Review.status === 'applies' && (!['firm_continuation', 'special_obligation'].includes(event.section25Review.basis) || !Array.isArray(event.section25Review.obligationRefs) || !event.section25Review.obligationRefs.length || event.section25Review.obligationRefs.some(ref => !nonEmpty(ref.obligationRef) || !nonEmpty(ref.sourceRef)) || (event.section25Review.basis === 'firm_continuation' && (!nonEmpty(event.section25Review.priorFirmRef) || !nonEmpty(event.section25Review.continuedFirmRef))) || (event.section25Review.basis === 'special_obligation' && !nonEmpty(event.section25Review.specialObligationRef)))) return block('section25_review_incomplete', '§ 25 HGB benötigt den belegten Firmenfortführungs- oder besonderen Verpflichtungsgrund und konkrete Anspruchsreferenzen.');
        if (event.section25Review.status === 'not_applicable' && event.section25Review.basis !== 'not_applicable') return block('section25_status_conflict', 'Ein nicht anwendbarer § 25 HGB-Fall benötigt den passenden Prüfstatus.');
        deal.businessTransferReview = clone(event.businessTransferReview);
        deal.section613a2Review = clone(event.section613a2Review || { status: 'not_applicable', sourceRef: event.businessTransferReview.sourceRef, claims: [] });
        deal.section25Review = clone(event.section25Review);
        deal.employeeTransferReviews = clone(event.employeeTransferReviews || []);
      }
      deal.legalReview = clone(event.legalReview);
      deal.competitionReview = clone(event.competitionReview);
      deal.status = [deal.legalReview.status, deal.competitionReview.status, deal.businessTransferReview.status, deal.section25Review.status].some(status => ['needs_review', 'pending'].includes(status)) || deal.employeeTransferReviews.some(r => r.outcome === 'needs_review' || r.informationStatus !== 'complete') ? 'review_pending' : 'assessed';
      sources.push(event.legalReview.sourceRef, event.competitionReview.sourceRef, ...(event.businessTransferReview ? [event.businessTransferReview.sourceRef] : []), ...(event.section25Review ? [event.section25Review.sourceRef] : []), ...deal.employeeTransferReviews.map(r => r.sourceRef));
      break;
    }
    case 'CLOSE_DEAL': {
      const deal = dealById(state, event.dealId);
      if (!deal || deal.status !== 'assessed' || !nonEmpty(event.closureRef)) return block('deal_reviews_pending', 'Transaktion kann erst nach vollständigem, positivem Review geschlossen werden.');
      if (![deal.legalReview.status, deal.competitionReview.status].every(status => ['cleared', 'not_applicable'].includes(status))) return block('deal_review_not_cleared', 'Rechts- und Wettbewerbsstatus sind nicht freigegeben.');
      if (deal.dealType === 'asset_business_deal') {
        if (![deal.businessTransferReview.status, deal.section25Review.status].every(status => ['applies', 'not_applicable'].includes(status))) return block('transfer_law_review_pending', '§ 613a-/§ 25-Fallprüfung ist noch nicht abgeschlossen.');
        if (deal.employeeTransferReviews.some(r => r.outcome === 'needs_review' || r.informationStatus !== 'complete')) return block('employee_transfer_review_pending', 'Arbeitnehmerinformation oder Ergebnisprüfung ist noch offen.');
      }
      deal.status = 'closed';
      deal.closedAt = event.effectiveDate;
      deal.closureRef = event.closureRef;
      if (deal.dealType === 'share_deal') {
        for (const change of deal.ownershipChangeRefs) {
          const prior = state.ownerships.find(item => item.entityId === deal.targetEntityId && item.holderId === change.fromHolderId && item.effectiveTo === null);
          if (prior && change.endsPriorRelationship) prior.effectiveTo = event.effectiveDate;
          state.ownerships.push({ holderId: change.toHolderId, entityId: deal.targetEntityId, shareOrControlBasis: change.shareOrControlBasis, effectiveFrom: event.effectiveDate, effectiveTo: null, sourceEventId: event.eventId, sourceRef: change.sourceRef });
        }
      }
      const handoff = financeHandoff(event, deal.dealType, { dealId: deal.dealId, buyerEntityId: deal.buyerEntityId, targetEntityId: deal.targetEntityId, termsRef: deal.termsRef, assetTransferRefs: deal.assetTransferRefs, ownershipChangeRefs: deal.ownershipChangeRefs, employeeTransferReviews: deal.employeeTransferReviews, businessTransferReview: deal.businessTransferReview, section613a2Review: deal.section613a2Review, section25Review: deal.section25Review, financialEffect: 'no_effect_without_explicit_terms_amount_and_authorized_financial_event' });
      state.financeHandoffs.push(handoff);
      sources.push(event.closureRef);
      state._newFinanceHandoffs = [handoff];
      break;
    }
    default:
      return block('unknown_event_type', `Nicht unterstützter T-0064-Ereignistyp: ${event.type}`);
  }

  addEvent(state, event);
  const emitted = state.events[state.events.length - 1];
  const financeHandoffs = state._newFinanceHandoffs || [];
  delete state._newFinanceHandoffs;
  return { ok: true, duplicate: false, state, emitted, financeHandoffs: clone(financeHandoffs), sourceRefs: [...new Set(sources.filter(nonEmpty))] };
}

export function validateV3FormationState(state) {
  const errors = [];
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

  if (!record(state)) return { valid: false, errors: ['invalid_state_shape'] };
  try {
    if (typeof JSON.stringify(state) !== 'string') return { valid: false, errors: ['invalid_state_shape'] };
  } catch {
    return { valid: false, errors: ['invalid_state_shape'] };
  }
  if (state.modelVersion !== V3_COMPANY_MODEL_VERSION) errors.push('unsupported_model_version');

  const requiredArrays = ['persons', 'entities', 'ownerships', 'cooperations', 'deals', 'financeHandoffs', 'events'];
  for (const key of requiredArrays) if (!Array.isArray(state[key])) errors.push('invalid_' + key + '_shape');
  if (!record(state.processedEvents)) errors.push('invalid_processedEvents_shape');
  if (!nonEmpty(state.scenarioId) || !validDate(state.startDate)) errors.push('invalid_scenario_metadata');
  if (errors.length) return { valid: false, errors };

  const project = state.foundingProject;
  if (!record(project)) {
    errors.push('missing_or_invalid_foundingProject');
  } else {
    if (!nonEmpty(project.projectId) || !nonEmpty(project.founderPersonId) || !(FOUNDING_STAGES.includes(project.stage) || project.stage === 'operating') || !['in_progress', 'prepared', 'operating'].includes(project.formationStatus)) errors.push('invalid_foundingProject_fields');
    if (!record(project.viability) || !['assessment_incomplete', 'assessed'].includes(project.viability.status)) {
      errors.push('invalid_foundingProject_viability');
    } else if (
      (project.viability.status === 'assessment_incomplete' && (project.viability.assessmentId !== null || project.viability.result !== null)) ||
      (project.viability.status === 'assessed' && (!nonEmpty(project.viability.assessmentId) || !['viable', 'not_viable'].includes(project.viability.result) || !validDate(project.viability.effectiveDate) || !nonEmpty(project.viability.sourceRef) || !Array.isArray(project.viability.inputRefs) || project.viability.inputRefs.length !== 6 || project.viability.inputRefs.some(ref => !nonEmpty(ref))))
    ) errors.push('invalid_foundingProject_viability_fields');
  }

  const personsValid = state.persons.length > 0 &&
    state.persons.every(person => record(person) && nonEmpty(person.personId) && nonEmpty(person.sourceRef)) &&
    new Set(state.persons.filter(record).map(person => person.personId).filter(nonEmpty)).size === state.persons.length;
  if (!personsValid) errors.push('invalid_persons_shape');

  const entitiesValid = state.entities.length > 0 &&
    state.entities.every(entity => record(entity) &&
      nonEmpty(entity.entityId) && nonEmpty(entity.entityType) && nonEmpty(entity.legalForm) &&
      nonEmpty(entity.founderPersonId) && nonEmpty(entity.formationStatus) &&
      nonEmpty(entity.registerStatus) && nonEmpty(entity.operatingStatus) &&
      validDate(entity.effectiveFrom) && nonEmpty(entity.sourceRef));
  if (!entitiesValid) errors.push('invalid_entities_shape');
  const entityIds = state.entities.filter(record).map(entity => entity.entityId);
  if (entityIds.some(id => !nonEmpty(id)) || new Set(entityIds).size !== entityIds.length) errors.push('duplicate_or_missing_entity_id');

  if (errors.length) return { valid: false, errors };

  const founder = state.persons.find(person => person.personId === project.founderPersonId);
  if (!founder) errors.push('founding_person_missing');

  const initialEntities = state.entities.filter(entity => entity.entityType === 'einzelunternehmen' && entity.legalForm === 'einzelunternehmen');
  if (initialEntities.length !== 1) {
    errors.push(initialEntities.length === 0 ? 'initial_entity_missing' : 'initial_entity_ambiguous');
  } else {
    const initialEntity = initialEntities[0];
    if (initialEntity.founderPersonId !== project.founderPersonId) errors.push('founding_person_reference_mismatch');
    if (!state.ownerships.some(item => record(item) &&
      item.holderId === project.founderPersonId &&
      item.entityId === initialEntity.entityId &&
      item.shareOrControlBasis === 'sole_proprietor' &&
      item.sourceEventId === initialEntity.sourceRef)) errors.push('initial_ownership_missing');
  }
  if (state.entities.some(entity => !state.persons.some(person => person.personId === entity.founderPersonId))) errors.push('entity_founder_missing');

  const ownershipRowsValid = state.ownerships.every(item => record(item) &&
    nonEmpty(item.holderId) && nonEmpty(item.entityId) && nonEmpty(item.shareOrControlBasis) &&
    validDate(item.effectiveFrom) && (item.effectiveTo === null || validDate(item.effectiveTo)) &&
    nonEmpty(item.sourceEventId));
  if (!ownershipRowsValid || state.ownerships.some(item => !entityById(state, item.entityId) || !hasHolder(state, item.holderId))) errors.push('invalid_ownership_reference');

  if (state.entities.some(entity => entity.entityType === 'kg' &&
    (!nonEmpty(entity.gmbhEntityId) || !entityById(state, entity.gmbhEntityId) || entity.gmbhEntityId === entity.entityId))) errors.push('invalid_kg_gmbh_reference');

  for (const event of state.events) {
    if (!record(event) || !nonEmpty(event.eventId) || !nonEmpty(event.type) || !validDate(event.effectiveDate) || !nonEmpty(event.sourceRef)) {
      errors.push('invalid_event_history_shape');
      continue;
    }
    if (state.processedEvents[event.eventId] !== stable(event)) errors.push('event_payload_mismatch:' + event.eventId);
  }

  for (const handoff of state.financeHandoffs) {
    if (!record(handoff) || handoff.ledgerMutation !== false || handoff.cashMutation !== false || handoff.financialEventRef !== null) errors.push('finance_boundary_violation:' + (handoff && handoff.handoffId ? handoff.handoffId : 'unknown'));
  }
  if (!state.cooperations.every(item => record(item) && nonEmpty(item.cooperationId) && nonEmpty(item.cooperationType) && nonEmpty(item.status))) errors.push('invalid_cooperations_shape');
  if (!state.deals.every(item => record(item) && nonEmpty(item.dealId) && nonEmpty(item.dealType) && nonEmpty(item.status))) errors.push('invalid_deals_shape');

  return { valid: errors.length === 0, errors };
}
