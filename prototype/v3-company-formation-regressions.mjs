import assert from 'node:assert/strict';
import {
  applyV3FormationEvent,
  createV3FormationState,
  validateV3FormationState,
  V3_COMPANY_MODEL_VERSION,
} from './v3-company-formation.js';

const date = '2026-11-01';
const makeState = () => createV3FormationState({
  scenarioId: 'scenario-a',
  startDate: date,
  founderPersonId: 'person-founder',
  initialEntityId: 'entity-sole',
  initialEntitySourceRef: 'profile:v3-start',
});
let serial = 0;
const event = (type, extra = {}, eventId = `evt-${++serial}`) => ({
  eventId, type, effectiveDate: date, sourceRef: `source:${eventId}`, ...extra,
});
const apply = (state, type, extra = {}) => {
  const result = applyV3FormationEvent(state, event(type, extra));
  assert.equal(result.ok, true, `${type} should succeed: ${JSON.stringify(result.error)}`);
  return result;
};
const advance = state => {
  let nextState = state;
  for (const [fromStage, toStage] of [
    ['idea', 'market_check'],
    ['market_check', 'offer_defined'],
    ['offer_defined', 'resources_and_capital_plan'],
  ]) nextState = apply(nextState, 'ADVANCE_FOUNDING_STAGE', { fromStage, toStage, stageEvidenceRef: `stage:${toStage}` }).state;
  return nextState;
};
const assess = (state, result = 'viable') => {
  const nextState = advance(state);
  return apply(nextState, 'ASSESS_VIABILITY', {
    assessmentId: `assessment-${serial}`,
    result,
    assessmentInputs: Object.fromEntries(['market', 'offer', 'capacity', 'costs', 'financing', 'requirements'].map(key => [key, { status: 'complete', sourceRef: `assessment:${key}` }])),
  });
};
const chooseCompany = state => apply(state, 'SELECT_FORM', {
  legalForm: 'gmbh_co_kg',
  selectionRef: 'decision:form-choice',
  entityIds: { gmbhEntityId: 'entity-gmbh', kgEntityId: 'entity-kg' },
  ownershipRefs: [
    { entityId: 'entity-gmbh', holderId: 'person-founder', shareOrControlBasis: 'explicit-founder-reference', sourceRef: 'owner:gmbh' },
    { entityId: 'entity-kg', holderId: 'person-founder', shareOrControlBasis: 'explicit-founder-reference', sourceRef: 'owner:kg' },
  ],
  partnerRefs: [
    { kgEntityId: 'entity-kg', partnerId: 'entity-gmbh', role: 'komplementaer', sourceRef: 'partner:gmbh' },
    { kgEntityId: 'entity-kg', partnerId: 'person-founder', role: 'kommanditist', sourceRef: 'partner:founder' },
  ],
});
const prepareCompany = state => apply(state, 'PREPARE_FORMATION', { preparationRef: 'formation:documents', entityIds: ['entity-gmbh', 'entity-kg'] });
const fileAndRegister = (state, entityId) => {
  let nextState = apply(state, 'SET_REGISTER_STATUS', { entityId, status: 'filing_pending', registerEvidenceRef: `filing:${entityId}` }).state;
  nextState = apply(nextState, 'SET_REGISTER_STATUS', { entityId, status: 'registered', registerEvidenceRef: `register:${entityId}` }).state;
  return nextState;
};
const readiness = state => apply(state, 'ASSESS_OPERATIONAL_READINESS', {
  readiness: Object.fromEntries(['representatives', 'locationAndResources', 'requirements', 'financialPlan'].map(key => [key, { status: 'passed', sourceRef: `readiness:${key}` }])),
});

assert.equal(V3_COMPANY_MODEL_VERSION, 'v3-company-formation-1');
assert.throws(() => createV3FormationState({ scenarioId: 'x' }), TypeError, 'state creation requires explicit identity and start values');

// Stored states must satisfy the complete shape contract before a transition reads nested fields.
{
  const valid = makeState();
  assert.deepEqual(validateV3FormationState(valid), { valid: true, errors: [] }, 'minimal generated V3 state is valid');
  assert.equal(validateV3FormationState(null).valid, false, 'non-object state is rejected');
  const nonObjectTransition = applyV3FormationEvent(null, event('ADVANCE_FOUNDING_STAGE'));
  assert.equal(nonObjectTransition.ok, false);
  assert.equal(nonObjectTransition.error.code, 'invalid_state_shape');

  const missingProject = structuredClone(valid);
  delete missingProject.foundingProject;
  assert.equal(validateV3FormationState(missingProject).valid, false);
  const beforeProject = JSON.stringify(missingProject);
  const projectTransition = applyV3FormationEvent(missingProject, event('ADVANCE_FOUNDING_STAGE', {
    fromStage: 'idea', toStage: 'market_check', stageEvidenceRef: 'stage:market',
  }));
  assert.equal(projectTransition.ok, false);
  assert.equal(projectTransition.error.code, 'invalid_state_shape');
  assert.equal(JSON.stringify(missingProject), beforeProject, 'missing project state is unchanged');

  const missingPersons = structuredClone(valid);
  delete missingPersons.persons;
  assert.equal(validateV3FormationState(missingPersons).valid, false);
  const beforePersons = JSON.stringify(missingPersons);
  const personsTransition = applyV3FormationEvent(missingPersons, event('ADVANCE_FOUNDING_STAGE', {
    fromStage: 'idea', toStage: 'market_check', stageEvidenceRef: 'stage:market',
  }));
  assert.equal(personsTransition.ok, false);
  assert.equal(personsTransition.error.code, 'invalid_state_shape');
  assert.equal(JSON.stringify(missingPersons), beforePersons, 'missing persons state is unchanged');

  for (const wrongPersons of ['not-an-array', {}, [null], [{}]]) {
    const malformed = { ...structuredClone(valid), persons: wrongPersons };
    assert.equal(validateV3FormationState(malformed).valid, false, 'wrong persons shape rejected: ' + JSON.stringify(wrongPersons));
    const before = JSON.stringify(malformed);
    const rejected = applyV3FormationEvent(malformed, event('ADVANCE_FOUNDING_STAGE', {
      fromStage: 'idea', toStage: 'market_check', stageEvidenceRef: 'stage:market',
    }));
    assert.equal(rejected.ok, false);
    assert.equal(rejected.error.code, 'invalid_state_shape');
    assert.equal(JSON.stringify(malformed), before, 'wrong-shape persons state is unchanged');
  }
  const emptyIdentity = structuredClone(valid);
  emptyIdentity.persons = [];
  emptyIdentity.entities = [];
  emptyIdentity.ownerships = [];
  assert.equal(validateV3FormationState(emptyIdentity).valid, false, 'empty identity lists are invalid');
  const beforeEmptyIdentity = JSON.stringify(emptyIdentity);
  const advanceEmpty = applyV3FormationEvent(emptyIdentity, event('ADVANCE_FOUNDING_STAGE', {
    fromStage: 'idea', toStage: 'market_check', stageEvidenceRef: 'stage:market',
  }));
  assert.equal(advanceEmpty.ok, false);
  assert.equal(advanceEmpty.error.code, 'invalid_state_shape');
  assert.equal(JSON.stringify(emptyIdentity), beforeEmptyIdentity, 'empty identity state is not mutated');

  emptyIdentity.foundingProject.stage = 'viability_assessed';
  emptyIdentity.foundingProject.viability = {
    status: 'assessed', assessmentId: 'assessment-fixture', result: 'viable', effectiveDate: date,
    sourceRef: 'assessment:fixture', inputRefs: ['market', 'offer', 'capacity', 'costs', 'financing', 'requirements'],
  };
  const beforeSelection = JSON.stringify(emptyIdentity);
  const invalidSelection = applyV3FormationEvent(emptyIdentity, event('SELECT_FORM', {
    legalForm: 'gmbh_co_kg', selectionRef: 'form:fixture',
    entityIds: { gmbhEntityId: 'entity-gmbh', kgEntityId: 'entity-kg' },
    ownershipRefs: [
      { entityId: 'entity-gmbh', holderId: 'person-founder', shareOrControlBasis: 'explicit', sourceRef: 'owner:gmbh' },
      { entityId: 'entity-kg', holderId: 'person-founder', shareOrControlBasis: 'explicit', sourceRef: 'owner:kg' },
    ],
    partnerRefs: [
      { kgEntityId: 'entity-kg', partnerId: 'entity-gmbh', role: 'komplementaer', sourceRef: 'partner:gmbh' },
      { kgEntityId: 'entity-kg', partnerId: 'person-founder', role: 'kommanditist', sourceRef: 'partner:founder' },
    ],
  }));
  assert.equal(invalidSelection.ok, false);
  assert.equal(invalidSelection.error.code, 'invalid_state_shape', 'selection does not dereference a missing initial entity');
  assert.equal(JSON.stringify(emptyIdentity), beforeSelection, 'rejected selection leaves invalid input unchanged');

  const missingOwnership = structuredClone(valid);
  missingOwnership.ownerships = [];
  assert.equal(validateV3FormationState(missingOwnership).valid, false, 'initial founder-to-entity ownership is required');
  assert.equal(applyV3FormationEvent(missingOwnership, event('ADVANCE_FOUNDING_STAGE', {
    fromStage: 'idea', toStage: 'market_check', stageEvidenceRef: 'stage:market',
  })).error.code, 'invalid_state_shape');

  const founderMismatch = structuredClone(valid);
  founderMismatch.persons.push({ personId: 'person-other', sourceRef: 'profile:other' });
  founderMismatch.foundingProject.founderPersonId = 'person-other';
  assert.equal(validateV3FormationState(founderMismatch).valid, false, 'project founder must match the initial entity founder');

  const founderMissing = structuredClone(valid);
  founderMissing.foundingProject.founderPersonId = 'person-missing';
  assert.equal(validateV3FormationState(founderMissing).valid, false, 'project founder must reference a person');

}

// Exact replay is idempotent; a changed payload under the same ID is rejected, and input state is never mutated.
{
  const state = makeState();
  const before = JSON.stringify(state);
  const e = event('ADVANCE_FOUNDING_STAGE', { fromStage: 'idea', toStage: 'market_check', stageEvidenceRef: 'stage:market' }, 'replay-1');
  const first = applyV3FormationEvent(state, e);
  assert.equal(first.ok, true);
  assert.equal(JSON.stringify(state), before);
  const replay = applyV3FormationEvent(first.state, e);
  assert.equal(replay.ok, true);
  assert.equal(replay.duplicate, true);
  assert.equal(replay.state.events.length, 1);
  const conflict = applyV3FormationEvent(first.state, { ...e, stageEvidenceRef: 'different' });
  assert.equal(conflict.ok, false);
  assert.equal(conflict.error.code, 'event_id_payload_conflict');
  assert.equal(JSON.stringify(first.state), JSON.stringify(replay.state));
}

// Complete, explicitly evidenced viability can pass; missing inputs and a non-viable result cannot start operations.
{
  const state = makeState();
  const progressed = advance(state);
  const incomplete = applyV3FormationEvent(progressed, event('ASSESS_VIABILITY', { assessmentId: 'bad', result: 'viable', assessmentInputs: {} }));
  assert.equal(incomplete.ok, false);
  assert.equal(incomplete.error.code, 'assessment_inputs_incomplete');
}
{
  let state = makeState();
  state = assess(state, 'not_viable').state;
  state = apply(state, 'SELECT_FORM', { legalForm: 'einzelunternehmen', selectionRef: 'form:sole' }).state;
  state = apply(state, 'PREPARE_FORMATION', { preparationRef: 'prepared:sole', entityIds: ['entity-sole'] }).state;
  const blocked = applyV3FormationEvent(state, event('ASSESS_OPERATIONAL_READINESS', { readiness: {} }));
  assert.equal(blocked.ok, false);
  assert.equal(blocked.error.code, 'viability_gate_failed');
}
{
  let state = makeState();
  state = assess(state).state;
  const full = apply(state, 'SELECT_FORM', { legalForm: 'einzelunternehmen', selectionRef: 'form:sole' });
  assert.equal(full.state.foundingProject.selectedForm, 'einzelunternehmen');
  const prepared = apply(full.state, 'PREPARE_FORMATION', { preparationRef: 'prepared:sole', entityIds: ['entity-sole'] });
  const ready = readiness(prepared.state);
  const started = apply(ready.state, 'START_OPERATIONS');
  assert.equal(started.state.entities[0].operatingStatus, 'operating');
}

// Candidate forms stay blocked; only the two user-approved forms can be selected.
{
  let base = makeState();
  base = assess(base).state;
  for (const legalForm of ['ag', 'eg', 'gmbh_co_kgaa']) {
    const blocked = applyV3FormationEvent(base, event('SELECT_FORM', { legalForm, selectionRef: `candidate:${legalForm}` }));
    assert.equal(blocked.ok, false);
    assert.equal(blocked.error.code, 'candidate_not_enabled');
    assert.equal(base.entities.length, 1);
  }
  const selected = chooseCompany(base);
  assert.equal(selected.state.entities.length, 3);
  assert.notEqual(selected.state.entities[1].entityId, selected.state.entities[2].entityId);
  assert.equal(selected.state.ownerships.filter(o => o.entityId === 'entity-gmbh').length, 1);
  assert.equal(selected.state.ownerships.filter(o => o.entityId === 'entity-kg').length, 1);
}

// GmbH register existence is separate; KG pre-registration needs every consent and a cleared §123/161 review.
{
  let state = makeState();
  state = assess(state).state;
  state = chooseCompany(state).state;
  state = prepareCompany(state).state;
  let illegalJump = applyV3FormationEvent(state, event('SET_REGISTER_STATUS', { entityId: 'entity-gmbh', status: 'registered', registerEvidenceRef: 'jump' }));
  assert.equal(illegalJump.ok, false);
  assert.equal(illegalJump.error.code, 'invalid_register_transition');
  state = apply(state, 'SET_REGISTER_STATUS', { entityId: 'entity-gmbh', status: 'filing_pending', registerEvidenceRef: 'gmbh:filing' }).state;
  state = apply(state, 'SET_REGISTER_STATUS', { entityId: 'entity-kg', status: 'filing_pending', registerEvidenceRef: 'kg:filing' }).state;
  const unregisteredGmbh = applyV3FormationEvent(state, event('AUTHORIZE_KG_PREREGISTRATION_ACTIVITY', {
    kgEntityId: 'entity-kg', partnerIds: ['entity-gmbh', 'person-founder'], partnerConsentRefs: ['consent:gmbh', 'consent:founder'], section123Review: { status: 'cleared', sourceRef: 'review:123' },
  }));
  assert.equal(unregisteredGmbh.ok, false);
  assert.equal(unregisteredGmbh.error.code, 'gmbh_partner_not_registered');
  state = apply(state, 'SET_REGISTER_STATUS', { entityId: 'entity-gmbh', status: 'registered', registerEvidenceRef: 'gmbh:registered' }).state;
  const pending123 = applyV3FormationEvent(state, event('AUTHORIZE_KG_PREREGISTRATION_ACTIVITY', {
    kgEntityId: 'entity-kg', partnerIds: ['entity-gmbh', 'person-founder'], partnerConsentRefs: ['consent:gmbh', 'consent:founder'], section123Review: { status: 'needs_review', sourceRef: 'review:123-pending' },
  }));
  assert.equal(pending123.ok, false);
  const noConsent = applyV3FormationEvent(state, event('AUTHORIZE_KG_PREREGISTRATION_ACTIVITY', {
    kgEntityId: 'entity-kg', partnerIds: ['entity-gmbh', 'person-founder'], partnerConsentRefs: ['consent:gmbh'], section123Review: { status: 'cleared', sourceRef: 'review:123' },
  }));
  assert.equal(noConsent.ok, false);
  state = apply(state, 'AUTHORIZE_KG_PREREGISTRATION_ACTIVITY', {
    kgEntityId: 'entity-kg', partnerIds: ['entity-gmbh', 'person-founder'], partnerConsentRefs: ['consent:gmbh', 'consent:founder'], section123Review: { status: 'cleared', sourceRef: 'review:123-cleared' },
  }).state;
  assert.equal(entityStatus(state, 'entity-gmbh').registerStatus, 'registered');
  assert.equal(entityStatus(state, 'entity-kg').registerStatus, 'filing_pending');
  assert.equal(entityStatus(state, 'entity-kg').formationStatus, 'formed_pre_registration');
  const invalidState = validateV3FormationState(state);
  assert.equal(invalidState.valid, true, JSON.stringify(invalidState.errors));
}

// A viable company may reach readiness only with registered GmbH + registered/pre-registered KG and explicit checks.
{
  let state = makeState();
  state = assess(state).state;
  state = chooseCompany(state).state;
  state = prepareCompany(state).state;
  state = fileAndRegister(state, 'entity-gmbh');
  state = fileAndRegister(state, 'entity-kg');
  const result = readiness(state);
  assert.equal(result.state.foundingProject.stage, 'operating_ready');
  const started = apply(result.state, 'START_OPERATIONS');
  assert.equal(started.state.entities.filter(e => ['gmbh', 'kg'].includes(e.entityType)).every(e => e.operatingStatus === 'operating'), true);
}

// Cooperation review is explicit; joint purchasing emits a non-booking finance handoff only.
{
  let state = makeState();
  state = assess(state).state;
  state = chooseCompany(state).state;
  state = apply(state, 'OPEN_COOPERATION', { cooperationId: 'coop-1', cooperationType: 'joint_procurement', participantEntityIds: ['entity-sole', 'entity-gmbh'], purposeRef: 'purpose:joint', termsRef: 'terms:joint' }).state;
  const needsReview = applyV3FormationEvent(state, event('ASSESS_COOPERATION', {
    cooperationId: 'coop-1', legalFormReview: { status: 'needs_review', sourceRef: 'legal:pending' }, competitionReview: { status: 'cleared', sourceRef: 'competition:clear' },
  }));
  assert.equal(needsReview.ok, false);
  state = apply(state, 'ASSESS_COOPERATION', {
    cooperationId: 'coop-1', legalFormReview: { status: 'cleared', sourceRef: 'legal:clear' }, competitionReview: { status: 'cleared', sourceRef: 'competition:clear' },
  }).state;
  const closed = apply(state, 'CLOSE_COOPERATION', { cooperationId: 'coop-1', closureRef: 'close:coop' });
  assert.equal(closed.financeHandoffs[0].status, 'no_financial_effect_until_explicit_A03_event');
  assert.equal(closed.state.financeHandoffs[0].ledgerMutation, false);
  assert.equal(closed.state.financeHandoffs[0].financialEventRef, null);
}

// Share deal changes explicit ownership references; asset/business deal keeps §613a/§25 reviews separate and pending until assessed.
{
  let state = makeState();
  state = assess(state).state;
  state = chooseCompany(state).state;
  state = apply(state, 'OPEN_SHARE_DEAL', {
    dealId: 'share-1', buyerEntityId: 'entity-sole', targetEntityId: 'entity-kg', termsRef: 'terms:share',
    ownershipChangeRefs: [{ fromHolderId: 'person-founder', toHolderId: 'entity-sole', shareOrControlBasis: 'explicit-share-transfer-ref', endsPriorRelationship: true, sourceRef: 'ownership:transfer' }],
  }).state;
  state = apply(state, 'REVIEW_DEAL', { dealId: 'share-1', legalReview: { status: 'cleared', sourceRef: 'legal:share' }, competitionReview: { status: 'cleared', sourceRef: 'competition:share' } }).state;
  const shareClose = apply(state, 'CLOSE_DEAL', { dealId: 'share-1', closureRef: 'close:share' });
  assert.equal(shareClose.state.entities.find(e => e.entityId === 'entity-kg').entityId, 'entity-kg');
  assert.equal(shareClose.state.ownerships.some(o => o.entityId === 'entity-kg' && o.holderId === 'entity-sole'), true);
  assert.equal(shareClose.financeHandoffs[0].cashMutation, false);

  let assetState = makeState();
  assetState = assess(assetState).state;
  assetState = chooseCompany(assetState).state;
  assetState = apply(assetState, 'OPEN_ASSET_DEAL', { dealId: 'asset-1', buyerEntityId: 'entity-sole', targetEntityId: 'entity-kg', termsRef: 'terms:asset', assetTransferRefs: ['asset:machine-1'] }).state;
  const pending = applyV3FormationEvent(assetState, event('CLOSE_DEAL', { dealId: 'asset-1', closureRef: 'close:too-early' }));
  assert.equal(pending.ok, false);
  assert.equal(pending.error.code, 'deal_reviews_pending');
  assetState = apply(assetState, 'REVIEW_DEAL', {
    dealId: 'asset-1', legalReview: { status: 'needs_review', sourceRef: 'legal:pending' }, competitionReview: { status: 'cleared', sourceRef: 'competition:asset' },
    businessTransferReview: { status: 'applies', sourceRef: 'review:613a' },
    section613a2Review: { status: 'assessed', sourceRef: 'review:613a2', claims: [{ obligationRef: 'claim:wage-1', priorEmployerEntityId: 'entity-kg', newEmployerEntityId: 'entity-sole', incurredAt: '2026-10-31', dueAt: '2026-11-15', measurementPeriodStart: '2026-10-01', measurementPeriodEnd: '2026-10-31', amountStatus: 'unknown', sourceRef: 'claim:source' }] },
    section25Review: { status: 'needs_review', sourceRef: 'review:25-pending' }, employeeTransferReviews: [{ employeeRef: 'worker:1', outcome: 'needs_review', informationStatus: 'pending', objectionStatus: 'pending_window', sourceRef: 'employee:pending' }],
  }).state;
  const stillPending = applyV3FormationEvent(assetState, event('CLOSE_DEAL', { dealId: 'asset-1', closureRef: 'close:pending' }));
  assert.equal(stillPending.ok, false);
  assetState = apply(assetState, 'REVIEW_DEAL', {
    dealId: 'asset-1', legalReview: { status: 'cleared', sourceRef: 'legal:asset' }, competitionReview: { status: 'cleared', sourceRef: 'competition:asset' },
    businessTransferReview: { status: 'applies', sourceRef: 'review:613a-cleared' },
    section613a2Review: { status: 'assessed', sourceRef: 'review:613a2', claims: [{ obligationRef: 'claim:wage-1', priorEmployerEntityId: 'entity-kg', newEmployerEntityId: 'entity-sole', incurredAt: '2026-10-31', dueAt: '2026-11-15', measurementPeriodStart: '2026-10-01', measurementPeriodEnd: '2026-10-31', amountStatus: 'unknown', sourceRef: 'claim:source' }] },
    section25Review: { status: 'applies', basis: 'firm_continuation', priorFirmRef: 'firm:old', continuedFirmRef: 'firm:continued', obligationRefs: [{ obligationRef: 'legacy-liability:1', sourceRef: 'legacy:source' }], sourceRef: 'review:25-applies' }, employeeTransferReviews: [{ employeeRef: 'worker:1', outcome: 'transfers', informationStatus: 'complete', objectionStatus: 'pending_window', sourceRef: 'employee:reviewed' }],
  }).state;
  const beforeClose = JSON.stringify(assetState);
  const assetClose = apply(assetState, 'CLOSE_DEAL', { dealId: 'asset-1', closureRef: 'close:asset' });
  assert.equal(JSON.stringify(assetState), beforeClose, 'closing an asset deal never mutates HR, assets, debts or finance input state');
  assert.equal(assetClose.state.deals.find(d => d.dealId === 'asset-1').status, 'closed');
  assert.equal(assetClose.state.financeHandoffs[0].ledgerMutation, false);
  assert.equal(assetClose.state.financeHandoffs[0].cashMutation, false);
  assert.equal(assetClose.state.financeHandoffs[0].details.employeeTransferReviews[0].outcome, 'transfers');
  assert.equal(assetClose.state.financeHandoffs[0].details.section613a2Review.claims[0].obligationRef, 'claim:wage-1');
  assert.equal(assetClose.state.financeHandoffs[0].details.section25Review.basis, 'firm_continuation');
}

function entityStatus(state, id) { return state.entities.find(entity => entity.entityId === id); }

console.log('V3 company-formation regressions passed');

