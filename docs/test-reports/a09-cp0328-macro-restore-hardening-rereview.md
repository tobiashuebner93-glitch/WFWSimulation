# A09 – A05 Makro-Restore-Härtung Re-Review

**Status:** NONPASS – neue Umgehung über fehlendes Makromodul
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Tickets:** T-0063 / T-0069
**Vorgänger:** CP-0327 (NONPASS), CP-0328 (A05-Härtung), CP-0329/CP-0330 (parallele V3-Berichte)
**Profil / Entscheidungen:** V3 shared run; `2027-01-04`; D-0157, D-0159, D-0161–D-0168
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; zahlreiche lokale Änderungen und ungetrackte Agentenergebnisse blieben unangetastet.

## Preflight und Scope

Preflight gemäß AGENTS.md durchgeführt: Control Plane, Agentenstruktur und Rechte, Goals, aktive MG-002-Tickets, Collaboration State, Decision Log, Start-/Zielprofil, CP-0327/0328 sowie A05-Bericht, Makrofixture, `prototype/v3/run.js` und betroffene Regressionen geprüft. Keine Produktdatei oder bestehende Änderung verändert.

## Befund

Die CP-0327-Umgehungen sind in der aktuellen Härtung geschlossen:

- Unbekannte `profileVersion` wird bei Speichern, Wiederherstellen und Tagesöffnung abgewiesen.
- Eine `fixture-snapshot:UPSWING`-ID in einem `BOOM`-Run wird an allen drei Einstiegspunkten abgewiesen.
- `buildRunMacroMonthInput` ohne expliziten Pfad wird abgewiesen; kein stiller UPSWING-Default.

**Neue NONPASS-Umgehung:** `validateRunMacroFixture` gibt `null` zurück, wenn `runState.modules.macro` fehlt. `validateV3RunState` erlaubt ebenfalls, dass dieses Modul fehlt. Ein aus `createRunFromInputs` erzeugter V3-Run hat immer ein Makromodul und eine Makroauswahl im `runId`. Entfernt man das Modul aus einem gültigen `BOOM`-Run, akzeptieren `createRunSaveEnvelope`, `restoreRunSaveEnvelope` und anschließend `openNextRunDay` den Zustand. Der Lauf öffnet `2027-01-04` ohne Makromodul bzw. Makromonat. Damit kann eine gespeicherte V3-Makroauswahl durch Entfernen des Moduls still aus dem Lauf verschwinden.

### Reproduktion

```js
let run = createRunFromInputs({ scenarioId: 'A09-MACRO-MISSING', seed: 'same', startDate: '2027-01-04', endDate: '2027-01-31', macroPath: 'BOOM' });
run = installRunOperatingResources(run, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: 0, finishedGoodsUsed: 0 });
delete run.modules.macro;
const save = createRunSaveEnvelope(run, null);
const restored = restoreRunSaveEnvelope(save).runState;
const opened = openNextRunDay(restored).state;
```

Ergebnis: akzeptiert; `runId` endet auf `|BOOM`; `restored.modules.macro` und `opened.modules.macro` sind `null`; der Tag wird geöffnet. Erwartet: fail closed, weil die Makroauswahl des V3-Runs nicht mehr belegt werden kann.

## Prüfungen

- `node --check prototype/v3/run.js` – PASS.
- `node --check prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS; gültige vier Pfade, Monatswechsel und CP-0327-/CP-0328-Mutationsfälle.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- Gezielter `git diff --check` für Run- und Makroregressionsdateien – PASS.
- Zusätzliche direkte Mutation der Makroentfernung – **NONPASS**, siehe Reproduktion.
- Browser-/Gerätetest – nicht ausgeführt.
- Jahres-Order-Harness `prototype/v3-year-order-smoke.mjs` – nicht abgeschlossen; getrennte QA bleibt offen.
- Commit/Push – nicht ausgeführt.

## Empfehlung / Übergabe

A05 sollte die Makrointegrität gegen Run-Identität absichern: Bei einem V3-`runId` mit ausgewähltem Fixturepfad muss ein Makromodul vorhanden sein, dessen Version, Snapshot-ID, Run-/Scenario-/Seed-Identitäten und Pfad konsistent sind. Regressionen sollen das fehlende Modul bei Save, Restore und Tagesöffnung abweisen und gültige BOOM-Save-/Restore-/Monatsfortsetzung weiterhin bestehen lassen. Danach A09-Re-Review. T-0063 und T-0069 bleiben IN_PROGRESS.

**Ausführung:** A09 – aktueller Code und Regressionen geprüft.
**Fachreview:** nicht ausgeführt; keine Makrofachregel bewertet oder geändert.
**Unabhängige QA:** NONPASS, neue Modul-lösch-Umgehung; frühere bekannte Bypässe nun blockiert.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** Branch `main`, HEAD wie oben; umfangreicher Arbeitsbaum erhalten; kein Commit oder Push.
**Offene Punkte:** A05-Korrektur und Re-Review; separater A09-Review des Jahres-Order-Harness.
**Rückfragen an A01:** Keine.
**Blocker:** keine für den Review; Release-/Restore-Gate bleibt bis zur Korrektur nicht bestanden.
**Nächster Schritt:** A01 weist die Modulpräsenz-/Runidentitätskorrektur an A05 zu; danach A09-Re-Review.
