import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRunFromInputs, createRunSaveEnvelope, restoreRunSaveEnvelope } from './run.js';

const baseUrl = new URL('./', import.meta.url);
const [html, js] = await Promise.all([
  readFile(new URL('run.html', baseUrl), 'utf8'),
  readFile(new URL('run.js', baseUrl), 'utf8'),
]);

assert.match(html, /name="foreignDemandFixtureId"/, 'start form exposes the L2 export-mix fixture');
assert.match(html, /value="NEUTRAL" selected>Neutral · keine Nachfrageverschiebung/, 'neutral remains the default');
assert.match(html, /value="V3-L2-EXPORT-SHIFT-5PP-LAG1"/, 'the named synthetic scenario is selectable');
assert.match(html, /foreign-demand-fixture-help/, 'synthetic provenance and constraints are explained');
assert.match(html, /Gesamtzahl der Anfragen bleibt unverändert/, 'UI states that weekly total demand is preserved');
assert.match(html, /keine zusätzlichen Aufträge oder Finanzwirkungen/, 'UI does not imply an automatic award or finance effect');
assert.match(js, /foreignDemandSelect\.setCustomValidity/);
assert.match(js, /Start 04\.01\.2027 und Ende mindestens 01\.02\.2027 erforderlich/);
assert.match(js, /createRunFromInputs\(Object\.fromEntries\(new FormData\(startForm\)\)\)/, 'selected fixture reaches the run API');

const base = { scenarioId: 'A05-L2-UI', seed: 'seed-l2-ui', macroPath: 'UPSWING' };
const neutral = createRunFromInputs({ ...base, startDate: '2027-01-04', endDate: '2027-01-29' });
assert.equal(neutral.foreignDemandFixtureId, 'NEUTRAL');
const selected = createRunFromInputs({
  ...base, startDate: '2027-01-04', endDate: '2027-02-05',
  foreignDemandFixtureId: 'V3-L2-EXPORT-SHIFT-5PP-LAG1',
});
assert.equal(selected.foreignDemandFixtureId, 'V3-L2-EXPORT-SHIFT-5PP-LAG1');
assert.ok(selected.runId.endsWith('|V3-L2-EXPORT-SHIFT-5PP-LAG1'), 'Run-ID binds the explicit selection');
assert.throws(() => createRunFromInputs({
  ...base, startDate: '2027-01-05', endDate: '2027-02-05',
  foreignDemandFixtureId: 'V3-L2-EXPORT-SHIFT-5PP-LAG1',
}), /Shared Run ab 2027-01-04/);
assert.throws(() => createRunFromInputs({
  ...base, startDate: '2027-01-04', endDate: '2027-01-31',
  foreignDemandFixtureId: 'V3-L2-EXPORT-SHIFT-5PP-LAG1',
}), /mindestens 2027-02-01/);

const save = createRunSaveEnvelope(selected, null);
assert.equal(restoreRunSaveEnvelope(save).runState.foreignDemandFixtureId, selected.foreignDemandFixtureId);
const tampered = structuredClone(save);
tampered.runState.foreignDemandFixtureId = 'NEUTRAL';
assert.throws(() => restoreRunSaveEnvelope(tampered), /passt nicht zur Laufkennung/);

console.log('A05 T-0063 L2 fixture UI regressions PASS (neutral default, explicit opt-in, synthetic labeling, date validation, run/save binding, tamper rejection)');
