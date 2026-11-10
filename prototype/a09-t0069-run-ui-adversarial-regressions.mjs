import assert from 'node:assert/strict';
import { createRunFromInputs, openNextRunDay, submitRunOffer, installRunOperatingResources, getRunProjection } from './v3/run.js';
import { validateV3RunState } from './v3-run-orchestrator.js';

// A UI/API client may tamper with FormData; the current BAB submission contract must fail closed.
let run = createRunFromInputs({ scenarioId: 'A09-UI-ADVERSARIAL', seed: 'a09-01', startDate: '2027-01-04', endDate: '2027-01-08' });
run = installRunOperatingResources(run, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: '0', finishedGoodsUsed: '0' });
run = openNextRunDay(run).state;
const inquiry = getRunProjection(run).playerView.inquiries.find(row => row.status === 'open');
const failures = [];
try {
  submitRunOffer(run, inquiry, {
    netPrice: '100,00', costVersion: 'COST-1', babVersion: 'BAB-1',
    directCostsJson: JSON.stringify([{ id: 'labor', amountEuro: '50,00', variable: 'tampered' }]),
    sourcePoolsJson: JSON.stringify([{ poolId: 'POOL-1', sourceCostCenterId: 'CC-SOURCE', costBasisId: 'BASIS-1', period: '2027-01', poolEuro: '10,00', allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '1' }] }]),
    offerDriversJson: JSON.stringify([{ poolId: 'POOL-1', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }])
  });
  failures.push('submitRunOffer accepted a non-boolean direct-cost classification');
} catch (error) {
  assert.match(error.message, /variable\/fixe Klassifikation/i);
}

// The UI hides initial resources once a day has started; the API helper must enforce the same boundary.
try {
  installRunOperatingResources(run, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: '0', finishedGoodsUsed: '0' });
  failures.push('installRunOperatingResources accepted initial resources after market/day events had begun');
} catch (error) {
  assert.match(error.message, /before|initial|started|Tag|Tages/i);
}

const validInputs = {
  netPrice: '100,00', costVersion: 'COST-1', babVersion: 'BAB-1', directCostsJson: '[]',
  sourcePoolsJson: JSON.stringify([{ poolId: 'POOL-1', sourceCostCenterId: 'CC-SOURCE', costBasisId: 'BASIS-1', period: '2027-01', poolEuro: '10,00', allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '1' }] }]),
  offerDriversJson: JSON.stringify([{ poolId: 'POOL-1', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }])
};
const submitted = submitRunOffer(run, inquiry, validInputs);
run = submitted.state;
const inquiryState = run.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId);
const playerOffer = inquiryState.offers.find(row => row.firmId === 'player');
const submissionEvent = run.modules.market.events.find(event => event.type === 'submit_offer' && event.payload?.eventId === `UI-OFFER|${encodeURIComponent(inquiry.inquiryId)}`);
assert.ok(submissionEvent, 'a submitted offer has one market source event');
assert.equal(submissionEvent.payload.inquiryId, inquiry.inquiryId, 'source event is bound to the submitted inquiry');
assert.equal(submissionEvent.payload.firmId, 'player');
assert.equal(submissionEvent.result.snapshotBinding.costVersion, playerOffer.calculationSnapshot.costVersion);
assert.equal(submissionEvent.result.snapshotBinding.babVersion, playerOffer.calculationSnapshot.babVersion);
assert.equal(submissionEvent.result.snapshotBinding.offerId, playerOffer.offerId);
assert.equal(submissionEvent.result.snapshotBinding.netPriceCents, playerOffer.netPriceCents);
assert.equal(run.dayEvents.filter(event => event.phase === 'player_offer' && event.sourceRef === submissionEvent.payload.eventId).length, 1, 'one offer submission has exactly one shared-run history reference');
assert.equal(run.financeHandoffs.length, 0, 'offer calculation creates no finance handoff or posting');

for (const field of ['costVersion', 'babVersion']) {
  const oneSidedTamper = structuredClone(run);
  oneSidedTamper.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId).offers.find(row => row.firmId === 'player').calculationSnapshot[field] = `${field}-TAMPERED`;
  assert.throws(() => validateV3RunState(oneSidedTamper), /snapshot|binding/i, `one-sided ${field} mutation is rejected`);

  const pairedTamper = structuredClone(run);
  pairedTamper.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId).offers.find(row => row.firmId === 'player').calculationSnapshot[field] = `${field}-TAMPERED`;
  pairedTamper.modules.market.events.find(event => event.type === 'submit_offer' && event.payload?.eventId === submissionEvent.payload.eventId).payload.calculationSnapshot[field] = `${field}-TAMPERED`;
  assert.throws(() => validateV3RunState(pairedTamper), /snapshot|binding/i, `changing offer snapshot and submission payload ${field} together is rejected while the separate binding is unchanged`);
}

const replay = submitRunOffer(run, inquiry, validInputs);
assert.equal(replay.duplicate, true, 'identical submission replay is an idempotent duplicate');
assert.equal(replay.state.modules.market.events.filter(event => event.type === 'submit_offer' && event.payload?.eventId === submissionEvent.payload.eventId).length, 1, 'replay does not duplicate market submission history');
assert.equal(replay.state.dayEvents.filter(event => event.phase === 'player_offer' && event.sourceRef === submissionEvent.payload.eventId).length, 1, 'replay does not duplicate shared-run offer history');
assert.equal(replay.state.financeHandoffs.length, 0, 'replay does not create finance handoffs or posting');

assert.deepEqual(failures, [], failures.join('; '));
console.log('A09 T-0069 UI adversarial regressions: PASS (current BAB API, snapshot binding, replay idempotency, non-posting boundary)');

