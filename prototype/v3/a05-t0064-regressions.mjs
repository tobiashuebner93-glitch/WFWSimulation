import assert from 'node:assert/strict';
import {
  createV3FormationState,
  applyV3FormationEvent,
  validateV3FormationState,
} from '../v3-company-formation.js';

let serial = 0;
const initial = () => createV3FormationState({scenarioId:'a05-test',startDate:'2026-10-31',founderPersonId:'person-founder',initialEntityId:'entity-sole',initialEntitySourceRef:'fixture:initial'});
function send(state,type,fields={}) {
  const eventId=`a05-${++serial}`;
  const result=applyV3FormationEvent(state,{eventId,type,effectiveDate:'2026-10-31',sourceRef:`fixture:${eventId}`,...fields});
  assert.equal(result.ok,true,`${type} rejected: ${result.error?.code||result.error?.message}`);
  return result.state;
}
function blocked(state,type,fields={},expectedCode) {
  const before=JSON.stringify(state); const eventId=`a05-block-${++serial}`;
  const result=applyV3FormationEvent(state,{eventId,type,effectiveDate:'2026-10-31',sourceRef:`fixture:${eventId}`,...fields});
  assert.equal(result.ok,false,`${type} should block`); if(expectedCode) assert.equal(result.error.code,expectedCode);
  assert.equal(JSON.stringify(state),before,'blocked operation mutated state'); return result;
}
function toViability(state) {
  for(const [fromStage,toStage] of [['idea','market_check'],['market_check','offer_defined'],['offer_defined','resources_and_capital_plan']]) state=send(state,'ADVANCE_FOUNDING_STAGE',{fromStage,toStage,stageEvidenceRef:`fixture:${toStage}`});
  return state;
}
function inputs(prefix) { return Object.fromEntries(['market','offer','capacity','costs','financing','requirements'].map(key=>[key,{status:'complete',sourceRef:`fixture:${prefix}:${key}`}])); }

let s=initial();
blocked(s,'ADVANCE_FOUNDING_STAGE',{fromStage:'idea',toStage:'operating',stageEvidenceRef:'bad'},'invalid_stage_transition');
s=toViability(s);
blocked(s,'ASSESS_VIABILITY',{assessmentId:'broken',result:'viable',assessmentInputs:{market:{status:'complete',sourceRef:'only-one'}}},'assessment_inputs_incomplete');
s=send(s,'ASSESS_VIABILITY',{assessmentId:'viable-case',result:'viable',assessmentInputs:inputs('viable')});
blocked(s,'SELECT_FORM',{legalForm:'ag',selectionRef:'fixture:candidate'},'candidate_not_enabled');
s=send(s,'SELECT_FORM',{legalForm:'gmbh_co_kg',selectionRef:'fixture:selection',entityIds:{gmbhEntityId:'entity-gmbh',kgEntityId:'entity-kg'},ownershipRefs:[{entityId:'entity-gmbh',holderId:'person-founder',shareOrControlBasis:'founder ownership reference',sourceRef:'fixture:owner-gmbh'},{entityId:'entity-kg',holderId:'person-founder',shareOrControlBasis:'founder ownership reference',sourceRef:'fixture:owner-kg'}],partnerRefs:[{kgEntityId:'entity-kg',partnerId:'entity-gmbh',role:'komplementaer',sourceRef:'fixture:partner-gmbh'},{kgEntityId:'entity-kg',partnerId:'person-founder',role:'kommanditist',sourceRef:'fixture:partner-founder'}]});
assert.deepEqual(s.entities.filter(e=>['gmbh','kg'].includes(e.entityType)).map(e=>e.entityId),['entity-gmbh','entity-kg']); assert.deepEqual(s.entities.find(e=>e.entityType==='kg').partners.map(p=>p.role),['komplementaer','kommanditist']);
blocked(s,'PREPARE_FORMATION',{preparationRef:'fixture:prepare-wrong',entityIds:['entity-sole']},'formation_entity_scope_mismatch');
s=send(s,'PREPARE_FORMATION',{preparationRef:'fixture:prepare',entityIds:['entity-gmbh','entity-kg']});
s=send(s,'SET_REGISTER_STATUS',{entityId:'entity-gmbh',status:'filing_pending',registerEvidenceRef:'fixture:gmbh-filing'});
s=send(s,'SET_REGISTER_STATUS',{entityId:'entity-gmbh',status:'registered',registerEvidenceRef:'fixture:gmbh-registered'});
blocked(s,'AUTHORIZE_KG_PREREGISTRATION_ACTIVITY',{kgEntityId:'entity-kg',partnerIds:['entity-gmbh','person-founder'],partnerConsentRefs:['one-ref'],section123Review:{status:'cleared',sourceRef:'fixture:hgb'}},'all_partner_consents_required');
s=send(s,'AUTHORIZE_KG_PREREGISTRATION_ACTIVITY',{kgEntityId:'entity-kg',partnerIds:['entity-gmbh','person-founder'],partnerConsentRefs:['fixture:consent-gmbh','fixture:consent-founder'],section123Review:{status:'cleared',sourceRef:'fixture:hgb-review'}});
const readiness=Object.fromEntries(['representatives','locationAndResources','requirements','financialPlan'].map(key=>[key,{status:'passed',sourceRef:`fixture:ready:${key}`}]));
s=send(s,'ASSESS_OPERATIONAL_READINESS',{readiness});
s=send(s,'START_OPERATIONS');
assert.equal(s.foundingProject.stage,'operating');
let c=send(s,'OPEN_COOPERATION',{cooperationId:'cooperation-1',cooperationType:'joint_procurement',participantEntityIds:['entity-sole','entity-kg'],purposeRef:'fixture:purpose',termsRef:'fixture:terms'});
c=send(c,'ASSESS_COOPERATION',{cooperationId:'cooperation-1',legalFormReview:{status:'cleared',sourceRef:'fixture:legal-coop'},competitionReview:{status:'not_applicable',sourceRef:'fixture:competition-coop'}});
c=send(c,'CLOSE_COOPERATION',{cooperationId:'cooperation-1',closureRef:'fixture:close-coop'});
assert.equal(c.financeHandoffs.at(-1).ledgerMutation,false); assert.equal(c.financeHandoffs.at(-1).cashMutation,false);
let d=send(c,'OPEN_SHARE_DEAL',{dealId:'share-1',buyerEntityId:'entity-sole',targetEntityId:'entity-kg',termsRef:'fixture:share-terms',ownershipChangeRefs:[{fromHolderId:'person-founder',toHolderId:'entity-gmbh',shareOrControlBasis:'documented transfer',endsPriorRelationship:true,sourceRef:'fixture:share-change'}]});
d=send(d,'REVIEW_DEAL',{dealId:'share-1',legalReview:{status:'cleared',sourceRef:'fixture:share-legal'},competitionReview:{status:'not_applicable',sourceRef:'fixture:share-comp'}});
d=send(d,'CLOSE_DEAL',{dealId:'share-1',closureRef:'fixture:share-close'});
assert.equal(d.deals.find(x=>x.dealId==='share-1').targetEntityId,'entity-kg','share deal must preserve target entity identity');
assert.equal(d.financeHandoffs.at(-1).status,'no_financial_effect_until_explicit_A03_event');
let a=send(d,'OPEN_ASSET_DEAL',{dealId:'asset-1',buyerEntityId:'entity-sole',targetEntityId:'entity-kg',termsRef:'fixture:asset-terms',assetTransferRefs:[{assetId:'asset-1',sourceRef:'fixture:asset'}]});
a=send(a,'REVIEW_DEAL',{dealId:'asset-1',legalReview:{status:'cleared',sourceRef:'fixture:asset-legal'},competitionReview:{status:'not_applicable',sourceRef:'fixture:asset-comp'},businessTransferReview:{status:'needs_review',sourceRef:'fixture:613a'},section25Review:{status:'needs_review',sourceRef:'fixture:25'},employeeTransferReviews:[]});
assert.equal(a.deals.find(x=>x.dealId==='asset-1').status,'review_pending','§613a and §25 open checks must remain pending');
assert.equal(validateV3FormationState(a).valid,true);
console.log('PASS: founding gates, incomplete evidence, candidate lock, GmbH/KG identity separation, registration, KG consent/review, readiness, cooperation, share deal, asset/legal-review pending, idempotent no-booking handoffs, and state integrity.');

