import assert from 'node:assert/strict';
import { createRunFromInputs, installRunOperatingResources, openNextRunDay, closeRunDay, submitRunOffer, planRunOrder, completeRunOrderStep, submitRunDelivery, getRunProjection, renderWorkOrderCard } from './v3/run.js';
import { validateV3RunState, recordV3RunCustomerAcceptanceDecision } from './v3-run-orchestrator.js';

let run = createRunFromInputs({ scenarioId: 'A09-AUTH-REVIEW', seed: 'ui-reg-01', startDate: '2027-01-04', endDate: '2027-01-08' });
run = installRunOperatingResources(run, { peopleJson: JSON.stringify([{ id:'P1', hoursPerDay:8, skills:['turning'] }]), equipmentJson: JSON.stringify([{ id:'M1', hoursPerDay:8, capabilities:['turning'] }]), materialsJson: JSON.stringify([{ id:'steel', quantity:10 }]), commitmentsJson:'[]', finishedGoodsCapacity:'0', finishedGoodsUsed:'0' });
run = openNextRunDay(run).state;
const inquiry = getRunProjection(run).playerView.inquiries.find(row => row.status === 'open');
const offer = submitRunOffer(run, inquiry, { netPrice:'10,00', costVersion:'COST-UI-1', babVersion:'BAB-UI-1', directCostsJson:JSON.stringify([{id:'material-1',amountEuro:'2,00',variable:true}]), sourcePoolsJson:JSON.stringify([{poolId:'POOL-UI-1',sourceCostCenterId:'CC-SOURCE',costBasisId:'COST-BASIS-1',period:'2027-01',poolEuro:'100,01',allocationMode:'keys',unitLabel:'h',recipients:[{costCenterId:'CC-PROD',keyValue:'10'}]}]), offerDriversJson:JSON.stringify([{poolId:'POOL-UI-1',costCenterId:'CC-PROD',period:'2027-01',basisKind:'driver',quantity:'2',unitLabel:'h'}]) });
run = offer.state;
run = closeRunDay(run).state;
run = openNextRunDay(run).state;
run = closeRunDay(run).state;
run = openNextRunDay(run).state;
const order = run.customerWorkOrders.find(row => row.inquiryId === inquiry.inquiryId);
assert.ok(order, 'market accepted offer produces a source-bound work order');
const operationsJson = JSON.stringify([{operationId:'cut',date:run.activeDay.date,personId:'P1',equipmentId:'M1',hours:2,requiredSkills:['turning'],requiredEquipmentCapabilities:['turning'],predecessors:[],materials:{steel:1}}]);
const standard = {contractRef:'CON-1',contractType:'Werkvertrag',customerPartyId:order.customerPartyId,buyerPartyId:'BUYER-1',acceptancePartyId:order.customerPartyId,performanceCriterionRef:'PERF-1',acceptanceCriterionRef:'ACC-1',orderUnit:'Stück',orderQuantity:1};
const alt = {...standard,acceptancePartyId:'<recipient>&1',authorizedForRef:order.customerPartyId,partyAuthorityRef:'AUTH-CUST-1'};
assert.throws(() => planRunOrder(run, order, {contractFields:{...alt,authorizedForRef:null,partyAuthorityRef:null},operationsJson}), /contract snapshot must bind/i);
assert.throws(() => planRunOrder(run, order, {contractFields:{...alt,authorizedForRef:'OTHER-CUSTOMER'},operationsJson}), /contract snapshot must bind/i);
const planned = planRunOrder(run, order, {contractFields:alt,operationsJson});
assert.equal(planned.state.modules.product.customerWorkOrderPlans[0].contractSnapshot.authorizedForRef, order.customerPartyId);
assert.equal(validateV3RunState(structuredClone(planned.state)), true);
for (const mutate of [
  s => { s.modules.product.customerWorkOrderPlans[0].contractSnapshot.authorizedForRef='OTHER'; },
  s => { s.modules.product.customerWorkOrderPlans[0].contractSnapshot.partyAuthorityRef=''; },
  s => { s.modules.product.customerWorkOrderPlans[0].contractSnapshot.acceptancePartyId=order.customerPartyId; },
  s => { s.modules.product.customerWorkOrderPlans[0].contractSnapshot.customerPartyId='OTHER'; },
]) { const tampered=structuredClone(planned.state); mutate(tampered); assert.throws(()=>validateV3RunState(tampered), {code:'invalid_run_state'}); }
assert.throws(() => planRunOrder(planned.state, order, {contractFields:{...alt,partyAuthorityRef:'AUTH-CUST-2'},operationsJson}), /different operational plan|invalid_run_state/);
let ready=completeRunOrderStep(planned.state,order.workOrderId,'cut').state;
const beforeHandoffs=structuredClone(ready.financeHandoffs); const beforeInventory=structuredClone(ready.modules.product.materials);
const card=renderWorkOrderCard(order,getRunProjection(ready),true);
assert.match(card,/&lt;recipient&gt;&amp;1/); assert.doesNotMatch(card,/<recipient>&1/);
assert.doesNotMatch(card,/<button[^>]*>(?:[^<]*(?:Annahme|Abnahme|Zurückweisung|akzeptieren|ablehnen))/i);
const delivered=submitRunDelivery(ready,order.workOrderId,{deliveryId:'D-A09',sourceRef:'SRC-A09'});
assert.equal(delivered.result.recipientPartyId,'<recipient>&1');
assert.deepEqual(delivered.state.financeHandoffs,beforeHandoffs); assert.deepEqual(delivered.state.modules.product.materials,beforeInventory);
assert.equal(submitRunDelivery(delivered.state,order.workOrderId,{deliveryId:'D-A09',sourceRef:'SRC-A09'}).duplicate,true);
assert.throws(()=>recordV3RunCustomerAcceptanceDecision(delivered.state,{decisionId:'SELLER-TRY',sourceRef:'SELLER-TRY-SRC',workOrderId:order.workOrderId,deliveryId:'D-A09',decisionDate:delivered.state.activeDay.date,decision:'accept',actorRole:'contractor',actorPartyId:'player',customerRef:order.customerPartyId,authorizedForRef:order.customerPartyId,partyAuthorityRef:'AUTH-CUST-1',acceptanceCriterionRef:'ACC-1'}));
console.log('A09 T-0069 authorized recipient adversarial review: PASS');

