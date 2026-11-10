# A05-Arbeitsbericht – Makro-Fixture-Restore fail-closed

**Status:** Korrektur und Eigenregression abgeschlossen; unabhängiger A09-Re-Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Tickets:** T-0063 / T-0069  
**Profil / Entscheidungen:** V3 shared run, synthetisches Makrofixture; Start 2027-01-04; D-0157, D-0159, D-0161–D-0168  
**Vorgänger:** CP-0325 (ENTWURF)

## Preflight und Befund

Gelesen wurden AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log und CP-0325 sowie die betroffenen Run-/Makrodateien und Regressionen. Gitbasis: `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Der umfangreiche vorhandene lokale Arbeitsstand blieb unangetastet.

A09 reproduzierte einen stillen Fallback: Wenn ein BOOM-Run vor dem ersten Simulationstag `modules.macro.sourceSnapshotId='tampered-unknown-path'` enthielt, akzeptierten Save/Restore den Zustand und der nächste Tagesstart verwendete still UPSWING. Das konnte den ausgewählten Szenariopfad ohne sichtbaren Fehler verändern.

## Korrektur

- Run-Save, Restore und Tagesöffnung prüfen bei der bekannten synthetischen V3-Makrofixture-Version, ob `sourceSnapshotId` exakt einem der vier unterstützten Fixture-IDs entspricht.
- Ein unbekannter oder inkonsistenter Pfad wird mit einer klaren Validierungsfehlermeldung zurückgewiesen.
- Die bisherige implizite UPSWING-Ersatzannahme ist entfernt. Gültige Pfade und reguläre Monatswechsel bleiben unverändert.
- Die Regression deckt den A09-Reproducer auf allen drei Einstiegspunkten ab: Save, Restore und Tagesöffnung.
- Keine Änderung an Makroparametern, Phasenregeln, Produkt-/Finanzwirkungen, Speicherformat, Architektur oder Schema.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/v3-run-macro-fixture-regressions.mjs`
- `docs/simulation/a05-t0063-macro-restore-fail-closed-arbeitsbericht.md`
- `docs/agent-system/checkpoints/CP-0326.md`

## Prüfungen und Nachweisrollen

- `node prototype/v3-run-macro-fixture-regressions.mjs` — PASS; gültige vier Pfade und Monatswechsel sowie unbekannter Pfad bei Save/Restore/Tagesöffnung.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS.
- `node --check prototype/v3/run.js` — PASS.
- `node --check prototype/v3-run-macro-fixture-regressions.mjs` — PASS.
- `git diff --check` für getrackte Dateien im Scope — PASS; die Implementierung/Regression liegen derzeit in ungetrackten V3-Dateien des bestehenden Arbeitsbaums.
- **Ausführung/Eigenregression:** A05 — PASS.
- **Fachreview:** nicht erforderlich; keine Makrofachregel geändert.
- **Unabhängige QA A09:** Re-Review angefordert, Ergebnis ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; dies ist eine Restore-/Validierungskorrektur.
- **Git:** Branch/HEAD/Status geprüft; keine fremden Änderungen verworfen, kein Staging, Commit oder Push.

## Status und Übergabe

Der konkrete CP-0325-Fund ist auf Regressionsebene behoben. T-0063 bleibt IN_PROGRESS wegen fehlender empirisch kalibrierter Makro-zu-Unternehmen-Übertragung und weiterer Integration. T-0069 bleibt IN_PROGRESS; dieses Fixes allein schließt keine Jahres-, Betriebs-/Ledger- oder Gesamt-QA-Gates. A09 soll die drei fail-closed Prüfpfade unabhängig nachprüfen und auch gültige Save/Restore-Pfade bestätigen.
