import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRunFromInputs, installRunOperatingResources, openNextRunDay, createFinanceStateForRun, createRunSaveEnvelope, restoreRunSaveEnvelope } from './run.js';
import { getV3MarketPlayerView } from '../v3-market-simulation.js';
import { evaluateInquiryPractice, renderInquiryPractice } from './inquiry-practice.js';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
let run = createRunFromInputs({ scenarioId: 't0109-practice-regression', seed: 't0109-seed', startDate: '2027-01-04', endDate: '2027-01-29' });
const financeState = createFinanceStateForRun(run);
run = installRunOperatingResources(run, {
  peopleJson: '[{"id":"P1","hoursPerDay":8,"skills":["turning"]}]',
  equipmentJson: '[{"id":"M1","hoursPerDay":8,"capabilities":["turning"]}]',
  materialsJson: '[{"id":"steel","quantity":10}]',
  commitmentsJson: '[]', finishedGoodsCapacity: '10', finishedGoodsUsed: '0',
});
run = openNextRunDay(run).state;
const before = structuredClone(run);
const beforeHash = hash(run);
const beforeFinance = structuredClone(financeState);
const inquiry = getV3MarketPlayerView(run.modules.market).inquiries.find(row => row.status === 'open' && !row.ownOffer);
assert.ok(inquiry, 'fixture produces a live open inquiry without an offer');

const practice = renderInquiryPractice(inquiry, run.activeDay.date);
assert.match(practice, /Üben: Anfrage prüfen/);
assert.match(practice, /Welche Prüfung ist vor einer Angebotsentscheidung/);
assert.match(practice, /turning/);
assert.match(practice, /garantierter Umsatz/);
assert.match(practice, /ändert weder Anfrage noch Unternehmenslauf/);

const correct = evaluateInquiryPractice(inquiry, run.activeDay.date, 'A');
const wrong = evaluateInquiryPractice(inquiry, run.activeDay.date, 'C');
assert.equal(correct.correct, true);
assert.equal(wrong.correct, false);
assert.match(correct.feedback, /noch kein Auftrag/);
assert.match(wrong.feedback, /benötigten Fähigkeiten.*Kapazität/);
assert.equal(correct.inquiryId, inquiry.inquiryId);
assert.equal(correct.sourceRevision, JSON.stringify({ inquiryId: inquiry.inquiryId, status: inquiry.status, currentDate: run.activeDay.date, expiresAt: inquiry.expiresAt, sizeClass: inquiry.sizeClass, segmentId: inquiry.segmentId, requiredCapabilities: inquiry.requiredCapabilities, requiredCapacity: inquiry.requiredCapacity }));

const progress = { ...wrong, attemptCount: 1 };
assert.match(renderInquiryPractice(inquiry, run.activeDay.date, progress), /Noch nicht richtig/);
assert.match(renderInquiryPractice(inquiry, run.activeDay.date, progress), /Zurück zur Anfrage/);
const missing = renderInquiryPractice({ ...inquiry, requiredCapabilities: null }, run.activeDay.date);
assert.match(missing, /geforderte Fähigkeiten/);
assert.match(missing, /data-inquiry-practice-answer="A"[^>]*disabled/);
assert.throws(() => evaluateInquiryPractice({ ...inquiry, segmentId: null }, run.activeDay.date, 'A'), /Kontextdaten/);
assert.throws(() => evaluateInquiryPractice({ ...inquiry, status: 'expired' }, run.activeDay.date, 'A'), /offene Anfrage/);
assert.throws(() => evaluateInquiryPractice(inquiry, '2027-01-31', 'A'), /Angebotsfrist ist abgelaufen/);
assert.equal(renderInquiryPractice({ ...inquiry, status: 'resolved' }, run.activeDay.date), '', 'resolved inquiry has no exercise entry');

assert.deepEqual(run, before, 'answer evaluation and progress do not mutate operational run state');
assert.equal(hash(run), beforeHash, 'run state hash remains identical after right and wrong answers');
assert.deepEqual(financeState, beforeFinance, 'finance state remains unchanged');
const envelope = createRunSaveEnvelope(run, financeState);
const serialized = JSON.stringify(envelope);
assert.doesNotMatch(serialized, /inquiry-practice|attemptCount|sourceRevision/, 'learning progress is outside the company save envelope');
const restored = restoreRunSaveEnvelope(JSON.parse(serialized));
assert.equal(hash(restored.runState), beforeHash, 'save/restore preserves the company-state hash');
assert.deepEqual(restored.financeState, beforeFinance, 'save/restore preserves finance state independently');
assert.match(renderInquiryPractice(inquiry, run.activeDay.date, progress), /Noch nicht richtig/, 'separate learning progress can be reloaded independently after company restore');

console.log('PASS: T-0109 inquiry practice, feedback, eligibility, state/finance invariance and save/restore separation');
