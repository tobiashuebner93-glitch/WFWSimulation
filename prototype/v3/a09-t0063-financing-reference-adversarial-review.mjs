import assert from 'node:assert/strict';
import {
  createFinanceStateForRun,
  createRunFromInputs,
  createRunSaveEnvelope,
  getRunProjection,
  renderMacroSummary,
  restoreRunSaveEnvelope,
} from './run.js';

const run = createRunFromInputs({
  scenarioId: 'a09-l5-review',
  seed: 'review-seed',
  startDate: '2027-01-04',
  endDate: '2027-01-29',
});
const finance = createFinanceStateForRun(run);
const beforeRun = JSON.stringify(run);
const beforeFinance = JSON.stringify(finance);
const projection = getRunProjection(run, finance);
const reference = projection.macroFinancingReference;

assert.equal(reference.status, 'pending');
assert.equal(reference.referenceRate, null);
assert.equal(reference.individualTerms.status, 'pending');
assert.equal(reference.individualTerms.ratePctPA, null);
assert.ok(Object.values(reference.effects).every(value => value === false));

const html = renderMacroSummary(run.modules.macro, run.modules.market, projection);
assert.match(html, /MRO-Referenz: derzeit nicht verfügbar/);
assert.match(html, /kein Kreditangebot/);
assert.equal(JSON.stringify(run), beforeRun, 'projection and rendering do not mutate the run');
assert.equal(JSON.stringify(finance), beforeFinance, 'projection and rendering do not mutate finance');

const restored = restoreRunSaveEnvelope(createRunSaveEnvelope(run, finance));
assert.deepEqual(
  getRunProjection(restored.runState, restored.financeState).macroFinancingReference,
  reference,
  'the derived financing reference replays identically after Save/Restore',
);

const hostile = structuredClone(projection);
hostile.macroFinancingReference.referenceRate = {
  valuePctPA: 3.15,
  sourceType: 'observed',
  sourceRef: '<img src=x onerror=alert(1)>',
  observedPeriod: '2027-01',
  effectiveFrom: '2027-01-15',
};
const safeHtml = renderMacroSummary(run.modules.macro, run.modules.market, hostile);
assert.ok(safeHtml.includes('&lt;img src=x onerror=alert(1)&gt;'));
assert.ok(!safeHtml.includes('<img src=x onerror=alert(1)>'));
assert.match(safeHtml, /kein persönlicher Zinssatz/);
assert.match(safeHtml, /Individuelle Konditionen: offen/);

const mismatched = structuredClone(run);
mismatched.modules.macro.runId = 'V3|foreign|run';
assert.throws(() => getRunProjection(mismatched), /macro|runId|identity/i);

console.log('A09 L5 shared-run financing reference adversarial regressions: PASS');
