import assert from 'node:assert/strict';
import {
  createRunFromInputs, installRunOperatingResources, openNextRunDay, closeRunDay,
  createRunSaveEnvelope, restoreRunSaveEnvelope, renderMacroSummary,
} from './v3/run.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';

for (const [macroPath, expectedPhase] of [['UPSWING', 'Aufschwung'], ['BOOM', 'Hochkonjunktur'], ['DOWNTURN', 'Abschwung'], ['LOW', 'Tiefphase']]) {
  let run = createRunFromInputs({ scenarioId: `MACRO-${macroPath}`, seed: 'same-seed', startDate: '2027-01-04', endDate: '2027-02-01', macroPath });
  run = installRunOperatingResources(run, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: 0, finishedGoodsUsed: 0 });
  assert.equal(run.modules.macro.periods.length, 0, 'macro period is not processed before the shared run opens');
  while (run.currentDate < '2027-02-01') {
    run = openNextRunDay(run).state;
    if (run.activeDay.date === '2027-01-04') {
      const first = run.modules.macro.periods.at(-1);
      assert.equal(first.period, '2027-01');
      assert.equal(first.phaseState.phase, macroPath === 'LOW' ? 'trough' : macroPath.toLowerCase());
      assert.deepEqual(first.financeEffects, { ledger: false, cash: false, receivables: false, payables: false, inventory: false, payroll: false, existingContracts: false });
    }
    run = closeRunDay(run).state;
  }
  assert.equal(run.modules.macro.periods.length, 2, 'a second monthly macro snapshot appears on February 1');
  assert.equal(run.modules.macro.periods.at(-1).period, '2027-02');
  assert.match(renderMacroSummary(run.modules.macro), new RegExp(expectedPhase));
  assert.match(renderMacroSummary(run.modules.macro, run.modules.market), /Makro → Nachfrage \(D-0169\)/);
  assert.match(renderMacroSummary(run.modules.macro, run.modules.market), /nicht empirisch kalibriert/);
  const restored = restoreRunSaveEnvelope(createRunSaveEnvelope(run, null));
  assert.equal(restored.runState.modules.macro.periods.length, 2, 'macro history persists with the shared run save');
  assert.equal(restored.runState.modules.macro.sourceSnapshotId, `fixture-snapshot:${macroPath}`);
}

let tampered = createRunFromInputs({ scenarioId: 'MACRO-RESTORE-UNKNOWN', seed: 'same-seed', startDate: '2027-01-04', endDate: '2027-01-31', macroPath: 'BOOM' });
tampered = installRunOperatingResources(tampered, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: 0, finishedGoodsUsed: 0 });
tampered.modules.macro.sourceSnapshotId = 'tampered-unknown-path';
const tamperedEnvelope = { saveVersion: 'V3-RUN-SAVE-1', runState: tampered, financeState: null };
assert.throws(() => createRunSaveEnvelope(tampered, null), /Makro-Fixturepfad ist unbekannt oder inkonsistent/, 'save refuses to persist an unknown synthetic macro path');
assert.throws(() => restoreRunSaveEnvelope(tamperedEnvelope), /Makro-Fixturepfad ist unbekannt oder inkonsistent/, 'restore rejects an unknown synthetic macro path instead of accepting a later phase fallback');
assert.throws(() => openNextRunDay(tampered), /Makro-Fixturepfad ist unbekannt oder inkonsistent/, 'day opening rejects an unknown synthetic macro path before selecting a phase');

const makeUntouchedRun = (scenarioId, macroPath = 'BOOM') => installRunOperatingResources(
  createRunFromInputs({ scenarioId, seed: 'same-seed', startDate: '2027-01-04', endDate: '2027-01-31', macroPath }),
  { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: 0, finishedGoodsUsed: 0 },
);
const unsupportedVersion = makeUntouchedRun('MACRO-RESTORE-UNKNOWN-VERSION');
unsupportedVersion.modules.macro.profileVersion = 'unsupported-but-nonempty';
const unsupportedEnvelope = { saveVersion: 'V3-RUN-SAVE-1', runState: unsupportedVersion, financeState: null };
assert.throws(() => createRunSaveEnvelope(unsupportedVersion, null), /Makro-Fixtureversion.*unbekannt oder inkonsistent/, 'save rejects unsupported macro fixture versions');
assert.throws(() => restoreRunSaveEnvelope(unsupportedEnvelope), /Makro-Fixtureversion.*unbekannt oder inkonsistent/, 'restore rejects unsupported macro fixture versions');
assert.throws(() => openNextRunDay(unsupportedVersion), /Makro-Fixtureversion.*unbekannt oder inkonsistent/, 'day opening rejects unsupported macro fixture versions');

const unsupportedMarketVersion = makeUntouchedRun('MACRO-RESTORE-UNKNOWN-MARKET-VERSION');
unsupportedMarketVersion.modules.market.parameterSetId = 'unsupported-market-demand-model';
const unsupportedMarketEnvelope = { saveVersion: 'V3-RUN-SAVE-1', runState: unsupportedMarketVersion, financeState: null };
assert.throws(() => createRunSaveEnvelope(unsupportedMarketVersion, null), /Markt-\/Makro-Übertragungsmodellversion.*unbekannt oder inkonsistent/, 'save rejects an unsupported macro-demand model version');
assert.throws(() => restoreRunSaveEnvelope(unsupportedMarketEnvelope), /Markt-\/Makro-Übertragungsmodellversion.*unbekannt oder inkonsistent/, 'restore rejects an unsupported macro-demand model version');
assert.throws(() => openNextRunDay(unsupportedMarketVersion), /Markt-\/Makro-Übertragungsmodellversion.*unbekannt oder inkonsistent/, 'day opening rejects an unsupported macro-demand model version');

const mismatchedRun = makeUntouchedRun('MACRO-RESTORE-MISMATCH');
mismatchedRun.modules.macro.sourceSnapshotId = 'fixture-snapshot:UPSWING';
const mismatchedEnvelope = { saveVersion: 'V3-RUN-SAVE-1', runState: mismatchedRun, financeState: null };
assert.throws(() => createRunSaveEnvelope(mismatchedRun, null), /Makro-Fixturepfad ist unbekannt oder inkonsistent/, 'save binds the snapshot path to the path encoded in the run identity');
assert.throws(() => restoreRunSaveEnvelope(mismatchedEnvelope), /Makro-Fixturepfad ist unbekannt oder inkonsistent/, 'restore rejects a known but mismatched path');
assert.throws(() => openNextRunDay(mismatchedRun), /Makro-Fixturepfad ist unbekannt oder inkonsistent/, 'day opening rejects a known but mismatched path');
assert.throws(() => buildRunMacroMonthInput({ period: '2027-01' }), /Unbekannter synthetischer Konjunkturpfad/, 'month input builder has no silent UPSWING default');

const missingMacroRun = makeUntouchedRun('MACRO-RESTORE-MISSING-MODULE');
delete missingMacroRun.modules.macro;
const missingMacroEnvelope = { saveVersion: 'V3-RUN-SAVE-1', runState: missingMacroRun, financeState: null };
assert.throws(() => createRunSaveEnvelope(missingMacroRun, null), /V3-Lauf fehlt das erforderliche Makro-Fixturemodul/, 'save rejects a shared V3 run without its required macro module');
assert.throws(() => restoreRunSaveEnvelope(missingMacroEnvelope), /V3-Lauf fehlt das erforderliche Makro-Fixturemodul/, 'restore rejects a shared V3 run without its required macro module');
assert.throws(() => openNextRunDay(missingMacroRun), /V3-Lauf fehlt das erforderliche Makro-Fixturemodul/, 'day opening rejects a shared V3 run without its required macro module');

console.log('V3 shared-run synthetic macro fixture regressions: PASS');
