import assert from 'node:assert/strict';
import { createRunFromInputs, getRunProjection } from './run.js';
import { projectV3FinancingReference } from '../v3-financing-reference.js';

const run = createRunFromInputs({
  scenarioId: 'mro-reference-test', seed: 'mro-seed',
  startDate: '2027-01-04', endDate: '2027-01-29',
});
const beforeRun = JSON.stringify(run);
const projection = getRunProjection(run).macroFinancingReference;
assert.equal(projection.status, 'pending', 'no MRO observation is silently invented when the run has none');
assert.equal(projection.referenceRate, null);
assert.deepEqual(projection.marginBenchmark, {
  decisionId: 'D-0022', unit: 'percentage_points', low: 0.5, mean: 3, high: 5.5,
  status: 'approved_reference_only',
});
assert.equal(projection.individualTerms.status, 'pending');
assert.equal(projection.individualTerms.spreadPp, null);
assert.equal(projection.individualTerms.ratePctPA, null);
assert.ok(Object.values(projection.effects).every(value => value === false));
assert.equal(JSON.stringify(run), beforeRun, 'the read-model projection must not mutate the run');

const observed = projectV3FinancingReference({
  runId: 'run-1', scenarioId: 'scenario-1',
  periods: [{
    period: '2027-01', runId: 'run-1', scenarioId: 'scenario-1', sourceSnapshotId: 'ecb-vintage-1',
    mro: {
      valuePctPA: 3.15, sourceType: 'observed', sourceRef: 'ECB MRO source fixture',
      observedPeriod: '2027-01', effectiveFrom: '2027-01-15', publishedAt: '2027-01-15',
      dataVintage: '2027-01-15', sourceSnapshotId: 'ecb-vintage-1', lagPeriods: 0,
    },
  }],
});
assert.equal(observed.status, 'reference_available');
assert.equal(observed.referenceRate.valuePctPA, 3.15);
assert.equal(observed.referenceRate.sourceType, 'observed');
assert.equal(observed.referenceRate.sourceRef, 'ECB MRO source fixture');
assert.equal(observed.referenceRate.dataVintage, '2027-01-15');
assert.equal(observed.period, '2027-01');
assert.equal(observed.individualTerms.ratePctPA, null, 'observed MRO plus mean benchmark is never presented as a personal rate');
assert.ok(Object.values(observed.effects).every(value => value === false));

const unavailable = projectV3FinancingReference({ runId: 'run-2', scenarioId: 'scenario-2', periods: [] });
assert.equal(unavailable.status, 'pending');
assert.equal(unavailable.referenceRate, null);

console.log('A02 T-0063 MRO financing reference regressions PASS');
