import assert from 'node:assert/strict';
import { createRunFromInputs, openNextRunDay, submitRunOffer, closeRunDay, installRunOperatingResources, planRunOrder, completeRunOrderStep, submitRunDelivery, getRunProjection, renderWorkOrderList } from './v3/run.js';

let run = createRunFromInputs({ scenarioId: 'A09-ORDER-RENDER', seed: 'ui-reg-01', startDate: '2027-01-04', endDate: '2027-01-08' });
run = installRunOperatingResources(run, {
  peopleJson: JSON.stringify([{ id: 'P1', hoursPerDay: 8, skills: ['turning'] }]),
  equipmentJson: JSON.stringify([{ id: 'M1', hoursPerDay: 8, capabilities: ['turning'] }]),
  materialsJson: JSON.stringify([{ id: 'steel', quantity: 10 }]),
  commitmentsJson: '[]', finishedGoodsCapacity: '10', finishedGoodsUsed: '0'
});
run = openNextRunDay(run).state;
const inquiry = getRunProjection(run).playerView.inquiries.find(row => row.status === 'open');
assert.ok(inquiry);
run = submitRunOffer(run, inquiry, {
  netPrice: '10,00', costVersion: 'COST-A09', babVersion: 'BAB-A09',
  directCostsJson: JSON.stringify([{ id: 'material-1', amountEuro: '2,00', variable: true }]),
  sourcePoolsJson: JSON.stringify([{ poolId: 'POOL-A09', sourceCostCenterId: 'CC-SOURCE', costBasisId: 'BASIS-A09', period: '2027-01', poolEuro: '100,01', allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }] }]),
  offerDriversJson: JSON.stringify([{ poolId: 'POOL-A09', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '2', unitLabel: 'h' }])
}).state;
run = closeRunDay(run).state;
run = openNextRunDay(run).state;
run = closeRunDay(run).state;
run = openNextRunDay(run).state;
const order = run.customerWorkOrders.find(row => row.inquiryId === inquiry.inquiryId);
assert.ok(order, 'synthetic offer must create an accepted order');
let html = renderWorkOrderList(getRunProjection(run), true);
assert.match(html, /<h3>Auftrag /, 'accepted order renders through the shared list path');
assert.match(html, /name="authorizedForRef"/);
assert.match(html, /name="partyAuthorityRef"/);
assert.doesNotMatch(html, /<button[^>]*>(?:[^<]*(?:Annahme|Abnahme|Zurückweisung|akzeptieren|ablehnen))/i, 'seller has no customer-decision action');

const ops = [{ operationId: 'cut', date: run.activeDay.date, personId: 'P1', equipmentId: 'M1', hours: 2, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } }];
run = planRunOrder(run, order, { contractFields: {
  contractRef: 'A09-CONTRACT', contractType: 'Werkvertrag',
  customerPartyId: order.customerPartyId, buyerPartyId: 'BUYER-01', acceptancePartyId: 'RECIPIENT-01',
  authorizedForRef: order.customerPartyId, partyAuthorityRef: 'A09-AUTHORITY',
  performanceCriterionRef: 'A09-PERFORMANCE', acceptanceCriterionRef: 'A09-ACCEPTANCE',
  orderQuantity: 1, orderUnit: 'Stück'
}, operationsJson: JSON.stringify(ops) }).state;
html = renderWorkOrderList(getRunProjection(run), true);
assert.match(html, /Schritt cut/);
assert.doesNotMatch(html, /Arbeitsplanung erfassen/, 'a planned order cannot be planned twice');
run = completeRunOrderStep(run, order.workOrderId, 'cut').state;
html = renderWorkOrderList(getRunProjection(run), true);
assert.match(html, /Empfängerpartei/);
assert.match(html, /RECIPIENT-01/);
assert.match(html, /Lieferung am geöffneten Simulationstag/);
assert.doesNotMatch(html, /<button[^>]*>(?:[^<]*(?:Annahme|Abnahme|Zurückweisung|akzeptieren|ablehnen))/i);
run = submitRunDelivery(run, order.workOrderId, { deliveryId: 'A09-DELIVERY', sourceRef: 'A09-SOURCE' }).state;
html = renderWorkOrderList(getRunProjection(run), true);
assert.match(html, /Geliefert · Kundenentscheidung ausstehend/);
assert.match(html, /RECIPIENT-01/);
assert.doesNotMatch(html, /<button[^>]*>(?:[^<]*(?:Annahme|Abnahme|Zurückweisung|akzeptieren|ablehnen))/i);
console.log('A09 T-0069 order renderer state-coverage: PASS');
