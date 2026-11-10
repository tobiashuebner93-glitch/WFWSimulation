import assert from 'node:assert/strict';
import processLearning from '../docs/learning/t-0068-v3-prozesslernobjekt.json' with { type: 'json' };
import { renderProcessLearning } from './v3/market.js';

assert.equal(processLearning.objectId, 'V3-LO-0068-ORDER-CYCLE-01');
assert.equal(processLearning.directCompetency.goalId, 'V3-06');
assert.equal(processLearning.endingBranches.length, 2);

const declined = processLearning.endingBranches.find(branch => branch.branchId === 'declined_offer');
const expired = processLearning.endingBranches.find(branch => branch.branchId === 'expired_inquiry');
assert.ok(declined && expired, 'declined and expired paths are separately defined');
for (const branch of [declined, expired]) {
  assert.equal(branch.terminal, true);
  assert.deepEqual(branch.nextSteps, []);
  assert.equal(branch.companyStateMutation, false);
  assert.equal(branch.financialMutation, false);
  assert.ok(branch.terminalFeedback.length > 0);
}
assert.deepEqual(declined.when, { inquiryStatus: 'resolved', outcome: 'not_won' });
assert.deepEqual(expired.when, { inquiryStatus: 'expired' });
assert.equal(processLearning.stateSafety.mayWriteCompanyState, false);
assert.equal(processLearning.stateSafety.mayWriteCashOrLedger, false);

function matchingEndingBranches(inquiry) {
  return processLearning.endingBranches.filter(branch =>
    Object.entries(branch.when).every(([field, expected]) => {
      if (field === 'inquiryStatus') return inquiry.status === expected;
      if (field === 'outcome') return inquiry.outcome === expected;
      return false;
    }),
  );
}

const samples = [
  {
    label: 'declined',
    inquiry: { inquiryId: 'INQ-D', status: 'resolved', outcome: 'not_won', expiresAt: '2027-01-08', sizeClass: 'small', requiredCapabilities: [], ownOffer: { offerId: 'OFF-D', status: 'declined' } },
    expectedBranch: 'declined_offer',
  },
  {
    label: 'expired',
    inquiry: { inquiryId: 'INQ-E', status: 'expired', outcome: 'expired', expiresAt: '2027-01-08', sizeClass: 'small', requiredCapabilities: [], ownOffer: { offerId: 'OFF-E', status: 'expired' } },
    expectedBranch: 'expired_inquiry',
  },
];

for (const sample of samples) {
  const safeView = { currentDate: '2027-01-08', inquiries: [sample.inquiry] };
  const before = structuredClone(safeView);
  const matched = matchingEndingBranches(safeView.inquiries[0]);
  assert.equal(matched.length, 1, `${sample.label} matches exactly one terminal path`);
  assert.equal(matched[0].branchId, sample.expectedBranch);
  const html = renderProcessLearning(safeView, processLearning);
  assert.match(html, /Nur lesend/);
  assert.match(html, /Welche Angaben müssen vor einer Angebotsentscheidung geprüft werden/);
  assert.deepEqual(safeView, before, `${sample.label} branch evaluation and render do not mutate the company view`);
}

const acceptedSample = { status: 'resolved', outcome: 'won' };
assert.equal(matchingEndingBranches(acceptedSample).length, 0, 'accepted path is not misclassified as a terminal ending');
assert.ok(processLearning.branches.some(branch => branch.branchId === 'accepted_offer'));

console.log('V3 process-learning ending-branch regressions: PASS');
