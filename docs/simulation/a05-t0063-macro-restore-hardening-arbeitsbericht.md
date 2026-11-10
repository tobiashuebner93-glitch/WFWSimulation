# A05-Arbeitsbericht – Makro-Fixture-Restore härten

**Status:** Korrektur und Eigenregression abgeschlossen; A09-Re-Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Tickets:** T-0063 / T-0069  
**Vorgänger:** CP-0326 und A09-Review CP-0327 (beide ENTWURF)

## Befund und Korrektur

A09 reproduzierte zwei verbleibende Umgehungen: unbekannte `profileVersion` mit beliebiger `sourceSnapshotId` und bekannte UPSWING-Quelle bei einem BOOM-Lauf. Die Prüfung bindet jetzt die Fixtureversion, die Snapshot-ID und den im Run-Identifier codierten Pfad. Unbekannte oder abweichende Werte werden bei Save, Restore und Tagesöffnung abgewiesen. Der Monatsinput-Builder besitzt keinen impliziten UPSWING-Default mehr.

Es wurden keine Makroparameter, Phasenregeln, Finanzwirkungen, Speicherformat- oder Architekturregeln neu festgelegt. Reguläre V3-Runs verwenden weiterhin die vier bereits definierten synthetischen Fixturepfade.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/v3-run-macro-fixture.js`
- `prototype/v3-run-macro-fixture-regressions.mjs`
- `docs/simulation/a05-t0063-macro-restore-hardening-arbeitsbericht.md`
- `docs/agent-system/checkpoints/CP-0328.md`

## Prüfungen

- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS; vier gültige Pfade, Monatswechsel, unbekannte Fixtureversion und abweichende bekannte Pfade jeweils an Save/Restore/Tagesöffnung zurückgewiesen.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- Syntaxprüfungen für alle drei geänderten JavaScript-Dateien – PASS.
- `git diff --check` für die drei V3-Dateien – PASS.
- A05-Eigenregression – PASS; unabhängiger A09-Re-Review angefragt.
- Browser-/Geräteprüfung nicht ausgeführt.
- Kein Commit oder Push; bestehende lokale Änderungen erhalten.

## Übergabe

A09 soll beide adversarialen Repros erneut gegen Save, Restore und Tagesöffnung prüfen sowie gültigen BOOM-Save-/Restore-/Februar-Fortsetzungspfad bestätigen. T-0063 und T-0069 bleiben IN_PROGRESS, bis Review und die übrigen fachlichen Integrationsgates erfüllt sind.
