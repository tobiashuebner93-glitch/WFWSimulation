import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRunFromInputs } from './run.js';

const html = await readFile(new URL('./run.html', import.meta.url), 'utf8');
const js = await readFile(new URL('./run.js', import.meta.url), 'utf8');
assert.match(html, /name="costPlanFixtureId"/, 'start form exposes cost-plan fixture selector');
assert.match(html, /value="NEUTRAL" selected/, 'neutral remains the selected default');
assert.match(html, /value="V3-PLAN-INDEX-SYNTH-EQUAL-1"/, 'the named educational fixture is selectable');
assert.match(html, /synthetisches Lernmaterial, keine beobachtete Marktinformation|Die optionale Kostenplan-Fixture ist synthetisches Lernmaterial, keine beobachtete Marktinformation/);
assert.match(html, /Basis Januar 2027; ein Monat Verzögerung, wirksam ab Februar 2027/);
assert.match(html, /Die Datumsfelder werden nicht automatisch geändert/);
assert.match(js, /startDateInput\.min = selected \? '2027-01-01' : ''/);
assert.match(js, /startDateInput\.max = selected \? '2027-01-31' : ''/);
assert.match(js, /endDateInput\.min = selected \? '2027-02-01' : ''/);
assert.match(js, /setCustomValidity\(selected &&/);
assert.match(js, /costPlanFixtureId = 'NEUTRAL'/, 'runtime form integration keeps the neutral default');
assert.match(js, /createRunFromInputs\(Object\.fromEntries\(new FormData\(startForm\)\)\)/, 'selected fixture ID reaches the existing run API');

const base = { scenarioId: 'FIXTURE-UI-TEST', seed: 'fixture-ui-seed', macroPath: 'UPSWING' };
assert.equal(createRunFromInputs({ ...base, startDate: '2027-01-04', endDate: '2027-01-29', costPlanFixtureId: 'NEUTRAL' }).costPlanFixtureId, 'NEUTRAL');
assert.equal(createRunFromInputs({ ...base, startDate: '2027-01-04', endDate: '2027-02-01', costPlanFixtureId: 'V3-PLAN-INDEX-SYNTH-EQUAL-1' }).costPlanFixtureId, 'V3-PLAN-INDEX-SYNTH-EQUAL-1');
assert.throws(() => createRunFromInputs({ ...base, startDate: '2026-12-31', endDate: '2027-02-01', costPlanFixtureId: 'V3-PLAN-INDEX-SYNTH-EQUAL-1' }), /Januar 2027/);
assert.throws(() => createRunFromInputs({ ...base, startDate: '2027-01-04', endDate: '2027-01-31', costPlanFixtureId: 'V3-PLAN-INDEX-SYNTH-EQUAL-1' }), /mindestens bis Februar/);
assert.equal(createRunFromInputs({ ...base, startDate: '2026-12-31', endDate: '2027-01-31', costPlanFixtureId: 'NEUTRAL' }).costPlanFixtureId, 'NEUTRAL', 'neutral mode keeps flexible date ranges');
console.log('A05 T-0063 cost-plan fixture start UI regressions PASS (neutral default, synthetic provenance, Jan-Feb lag, date validation, no auto-shift)');