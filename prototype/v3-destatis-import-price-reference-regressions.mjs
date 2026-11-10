import assert from 'node:assert/strict';
import {
  buildV3DestatisImportPriceBenchmark, projectV3DestatisImportPriceBenchmark,
  validateV3DestatisImportPriceBenchmark, V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID,
} from './v3-destatis-import-price-reference.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import { createRunFromInputs, openNextRunDay, installRunOperatingResources, createRunSaveEnvelope, restoreRunSaveEnvelope, createFinanceStateForRun } from './v3/run.js';
import { projectV3MacroTradeImpacts } from './v3-macro-trade-impact.js';
import { closeV3RunDay, openV3RunDay } from './v3-run-orchestrator.js';

const reference = buildV3DestatisImportPriceBenchmark('2027-01');
assert.ok(reference, 'selected fixture includes the available observed snapshot');
assert.equal(reference.benchmarkId, V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID);
assert.deepEqual(Object.fromEntries(Object.entries(reference.groupValues).map(([key, value]) => [key, value.value])), {
  euroCountries: 125.7, nonEuroCountries: 120.1, total: 122.2,
});
assert.equal(reference.observedPeriod, '2026-09');
assert.equal(reference.unit, 'index_points');
assert.equal(reference.indexBase, '2021=100');
assert.equal(reference.sourceReleaseDate, '2026-10-30');
assert.equal(reference.publicationEvidenceType, 'associated_destatis_press_release_date');
assert.equal(reference.genesisCellTimestampAvailable, false, 'the release date is not misrepresented as a GENESIS cell timestamp');
assert.equal(reference.retrievedAt, '2026-11-01');
assert.equal(reference.revisionStatus, 'not_reported_by_snapshot');
assert.equal(reference.referenceOnly, true);
assert.equal(reference.directFinanceEffect, false);
assert.equal('importExposureFactor' in reference, false, 'group identity is not an import exposure');
assert.equal('delta' in reference, false, 'the reference does not define an economic effect size');
assert.equal(buildV3DestatisImportPriceBenchmark('2026-10'), null, 'no October snapshot exists before the release window');
assert.equal(buildRunMacroMonthInput({ period: '2026-10', path: 'UPSWING', importPriceBenchmarkId: V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID }).destatisImportPriceBenchmark, undefined, 'no source row is placed into a pre-release macro input');
assert.throws(() => buildRunMacroMonthInput({ period: '2027-01', path: 'UPSWING', importPriceBenchmarkId: 'UNKNOWN' }), /unbekannt/i);
validateV3DestatisImportPriceBenchmark(reference, { period: '2027-01' });

const projectionIdentity = { runId: 'run-observed-ref', scenarioId: 'scenario-observed-ref', seed: 'stable', macroSnapshotId: 'macro-snapshot-2027-01' };
assert.equal(projectV3DestatisImportPriceBenchmark(reference, { ...projectionIdentity, asOfDate: '2026-10-29' }), null, 'reference stays hidden before publication');
const atRelease = projectV3DestatisImportPriceBenchmark(reference, { ...projectionIdentity, asOfDate: '2026-10-30' });
assert.equal(atRelease.status, 'available_reference_only', 'associated release date gates reference availability');
assert.equal(atRelease.groupSelectionMode, 'display_filter_only');
assert.equal(atRelease.genesisCellTimestampAvailable, false);
assert.deepEqual(atRelease.groupValues, reference.groupValues);
assert.equal('importExposureFactor' in atRelease, false);
assert.equal('after' in atRelease, false, 'reference has no calculated before/after index effect');
assert.throws(() => projectV3DestatisImportPriceBenchmark({ ...reference, groupValues: { ...reference.groupValues, total: { ...reference.groupValues.total, value: 999 } } }, { ...projectionIdentity, asOfDate: '2026-11-01' }), /unknown|future|malformed|vintage/i, 'unknown or altered observed values fail closed');

const baseRun = {
  scenarioId: 'destatis-reference-regression', seed: 'fixed-seed', startDate: '2027-01-04', endDate: '2027-02-05',
  importPriceBenchmarkId: V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID,
};
let run = createRunFromInputs(baseRun);
assert.ok(run.runId.endsWith(`|${V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID}`), 'run identity binds the optional reference selection');
assert.ok(run.modules.macro.sourceSnapshotId.endsWith(`:import-price-reference:${V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID}`));
let uiPathRun = installRunOperatingResources(createRunFromInputs({ ...baseRun, scenarioId: 'destatis-open-next-day' }), {
  peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: 0, finishedGoodsUsed: 0,
});
uiPathRun = openNextRunDay(uiPathRun).state;
assert.equal(JSON.parse(uiPathRun.dayOpenFingerprints['2027-01-04']).macroMonthInput.destatisImportPriceBenchmark.benchmarkId, V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID, 'standard Run opening path binds the selected reference into the macro snapshot input');

function inputFor(date, state, includeReference = true) {
  const input = { date };
  if (date === '2027-01-04' || date.endsWith('-01')) input.macroMonthInput = buildRunMacroMonthInput({
    period: date.slice(0, 7), path: 'UPSWING', importPriceBenchmarkId: includeReference ? state.importPriceBenchmarkId : 'NEUTRAL',
  });
  return input;
}
for (let date = '2027-01-04'; date <= '2027-02-02';) {
  const opened = openV3RunDay(run, inputFor(date, run));
  assert.equal(opened.ok, true, opened.error?.message);
  run = closeV3RunDay(opened.state).state;
  date = new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
}
const beforeProjection = structuredClone(run);
const finance = createFinanceStateForRun(run);
const financeBefore = structuredClone(finance);
const projected = projectV3MacroTradeImpacts(run, '2027-01');
assert.equal(projected.references.length, 1, 'macro projection returns one reference from the bound monthly input');
assert.deepEqual(projected.effects, [], 'read-only reference is not included in macro effects');
const projectedReference = projected.references[0];
assert.equal(projectedReference.runId, run.runId);
assert.equal(projectedReference.scenarioId, run.scenarioId);
assert.equal(projectedReference.seed, run.seed);
assert.equal(projectedReference.asOfDate, '2027-01-04');
assert.equal(projectedReference.macroSnapshotId, run.modules.macro.periods[0].sourceSnapshotId);
assert.equal(projectedReference.groupSelectionMode, 'display_filter_only');
assert.equal('importExposureFactor' in projectedReference, false);
assert.equal('delta' in projectedReference, false);
assert.equal('appliedDeltaPct' in projectedReference, false);
assert.deepEqual(JSON.parse(run.dayOpenFingerprints['2027-01-04']).macroMonthInput.destatisImportPriceBenchmark, reference, 'January source snapshot remains intact after February advances');
assert.equal(JSON.parse(run.dayOpenFingerprints['2027-02-01']).macroMonthInput.destatisImportPriceBenchmark.sourceSnapshotId, reference.sourceSnapshotId, 'later month uses the same fixed source vintage');
assert.deepEqual(run, beforeProjection, 'projection does not mutate shared run state');
assert.deepEqual(finance, financeBefore, 'projection does not mutate FinanceState');

const envelope = createRunSaveEnvelope(run, finance);
const restored = restoreRunSaveEnvelope(envelope);
assert.deepEqual(projectV3MacroTradeImpacts(restored.runState, '2027-01').references, projected.references, 'save/restore reproduces the exact reference vintage and identity');
assert.deepEqual(restored.financeState, financeBefore);

const tamperedReference = structuredClone(envelope);
const tamperedInput = JSON.parse(tamperedReference.runState.dayOpenFingerprints['2027-01-04']);
tamperedInput.macroMonthInput.destatisImportPriceBenchmark.groupValues.total.value = 999;
tamperedReference.runState.dayOpenFingerprints['2027-01-04'] = JSON.stringify(tamperedInput);
assert.throws(() => restoreRunSaveEnvelope(tamperedReference), /macro snapshot|input|source|Destatis/i, 'tampered source snapshot fails restore');

const coordinatedTamper = structuredClone(envelope);
const coordinatedInput = JSON.parse(coordinatedTamper.runState.dayOpenFingerprints['2027-01-04']);
coordinatedInput.macroMonthInput.destatisImportPriceBenchmark.groupValues.total.value = 999;
coordinatedTamper.runState.dayOpenFingerprints['2027-01-04'] = JSON.stringify(coordinatedInput);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
coordinatedTamper.runState.modules.macro.periods[0].inputFingerprint = stable(coordinatedInput.macroMonthInput);
assert.throws(() => restoreRunSaveEnvelope(coordinatedTamper), /Destatis|immutable|vintage|source|fingerprint/i, 'coordinated input/fingerprint tampering cannot replace the bound official vintage');

const tamperedSelection = structuredClone(envelope);
tamperedSelection.runState.importPriceBenchmarkId = 'NEUTRAL';
assert.throws(() => restoreRunSaveEnvelope(tamperedSelection), /Destatis|reference|Laufkennung|snapshot/i, 'source selection cannot be detached from run identity');
const duplicateSource = structuredClone(envelope);
const duplicateInput = JSON.parse(duplicateSource.runState.dayOpenFingerprints['2027-01-04']);
duplicateInput.macroMonthInput.destatisImportPriceBenchmark = [reference, reference];
duplicateSource.runState.dayOpenFingerprints['2027-01-04'] = JSON.stringify(duplicateInput);
assert.throws(() => restoreRunSaveEnvelope(duplicateSource), /Destatis|source|fingerprint|bound/i, 'duplicate source rows fail closed');

let neutral = createRunFromInputs({ ...baseRun, scenarioId: 'destatis-reference-neutral', importPriceBenchmarkId: 'NEUTRAL' });
const neutralDay = openV3RunDay(neutral, inputFor('2027-01-04', neutral));
assert.equal(neutralDay.ok, true, neutralDay.error?.message);
neutral = closeV3RunDay(neutralDay.state).state;
assert.deepEqual(projectV3MacroTradeImpacts(neutral, '2027-01').references, [], 'default run remains neutral without the explicit source selection');

let missing = createRunFromInputs({ ...baseRun, scenarioId: 'destatis-reference-missing' });
const missingDay = openV3RunDay(missing, inputFor('2027-01-04', missing, false));
assert.equal(missingDay.ok, true, missingDay.error?.message);
missing = closeV3RunDay(missingDay.state).state;
assert.deepEqual(projectV3MacroTradeImpacts(missing, '2027-01').references, [], 'missing source snapshot produces no reference');
assert.doesNotThrow(() => restoreRunSaveEnvelope(createRunSaveEnvelope(missing)));

console.log('V3 Destatis import-price reference regressions: PASS (source vintage/provenance, release as-of, groups as filter only, optional neutral/missing inputs, run binding, replay/restore, coordinated tamper rejection, no effects or finance mutation)');
