# A05-Arbeitsbericht – Makromodul im V3-Run verpflichtend validieren

**Status:** Korrektur und Eigenregression abgeschlossen; A09-Re-Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Tickets:** T-0063 / T-0069  
**Vorgänger:** CP-0327 (A09 NONPASS) und CP-0328 (A05-Korrektur), ENTWURF

## Befund und Korrektur

A09 fand, dass ein gültiger V3-Run-Identifier mit Makropfad ohne `modules.macro` gespeichert, geladen und fortgesetzt werden konnte. Die Validierung verlangt nun das Modul, sobald die Laufkennung den gemeinsamen V3-Runvertrag beansprucht. Modulversion und Snapshot-ID müssen weiterhin zum erlaubten Pfad in der Runkennung passen. Legacy-Runs außerhalb dieses V3-Run-ID-Formats dürfen ein Makromodul weglassen; ein Makromodul ohne passende V3-Identität wird abgewiesen.

Keine fachliche Makro-, Finanz-, Produkt- oder Architekturentscheidung wurde ergänzt; Speicherformat und Schema blieben unverändert.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/v3-run-macro-fixture-regressions.mjs`
- `docs/simulation/a05-t0063-macro-module-presence-arbeitsbericht.md`
- `docs/agent-system/checkpoints/CP-0329.md`

## Prüfungen

- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS; fehlendes Modul für V3-Run-ID an Save/Restore/Tagesöffnung abgewiesen.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- Syntaxprüfungen für Run-Modul und Makrofixture-Regression – PASS.
- `git diff --check` für die Codeänderungen – PASS.
- A05-Eigenregression – PASS; unabhängiger A09-Re-Review angefragt.
- Browser-/Geräteprüfung nicht ausgeführt.
- Kein Commit oder Push; vorhandene Änderungen bleiben erhalten.

## Übergabe

A09 prüft den fehlenden-Modul-Repro an allen drei Grenzen und bestätigt gültige Makropfade sowie die vorherigen CP-0327-Fälle erneut. T-0063 und T-0069 bleiben IN_PROGRESS bis zu den Review- und Integrationsgates.
