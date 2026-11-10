# A02-Bericht – T-0063 L2: kumulativer Monats-Rundungsausgleich

**Status:** Implementierung und fokussierte Regression abgeschlossen; A03-Fachreview, A09-Re-Review und A01-Browserprüfung ausstehend  
**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 L2; Anschlüsse T-0065 und T-0069  
**Profil:** V3 Shared Run ab 2027-01-04; T-0063-Runprofil  
**Maßgebliche Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Faktor für die Gesamtzahl wöchentlicher Anfragen  
**Vorgänger:** CP-0417 bis CP-0420; CP-0411–0416 bleiben unverändert

## Ergebnis

Der vorhandene kumulative Allocator wurde end-to-end angebunden. `openNextRunDay()` liefert die im selben Run bereits gespeicherten Wochenpläne des gleichen Monats an `buildWeeklyTemplates()`. Beim Wiederherstellen validiert der Orchestrator alle Wochenpläne chronologisch und rekonstruiert denselben Vormonatsverlauf allein aus den gespeicherten D-0169-Traces und den tatsächlichen Templates. Gespeicherte Rundungszähler werden nicht als Quelle verwendet. Fehlende, duplizierte, nicht replaybare oder aus einem anderen Run stammende Vorwochen führen fail-closed zur Zurückweisung.

Für jede Woche bleibt die durch D-0169 bestimmte Anfragezahl exakt unverändert. Die kumulative ganzzahlige Zielzahl exportfähiger Templates wird aus `round(sum(Basis-Exporttemplates) + delta × Exposition × sum(N))` bestimmt; der aktuelle Wochenanteil ist die Differenz zum replayten bisherigen Iststand. Bei vier Februarwochen mit jeweils `N=5`, Basismix `small=2, medium=2, large=1` und synthetischem `+5pp` entstehen daher je Woche fünf Templates und im Monat exakt 13 Exporttemplates von 20. Der kumulative Nachtrag fügt keine Nachfrage oder Anfrageobjekte hinzu.

Die bestehende `allocateWeek()`-Referenz auf eine nicht definierte Variable `templates` wurde behoben; sie verwendet jetzt konsistent ihr Argument `baseTemplates`. A09 hatte diesen Fehler vor der Korrektur als NONPASS reproduziert. Eine unabhängige Re-Prüfung nach der Korrektur ist noch nicht erfolgt.

## Grenzen

Die Fixture `V3-L2-EXPORT-SHIFT-5PP-LAG1` bleibt unverändert und ausdrücklich synthetisch. Es entsteht keine KMU-Elastizitäts- oder Marktprognosebehauptung. Der Schritt mutiert weder Anfragegesamtzahl, IDs, Angebote, Zuschläge, Verträge, Work Orders, Preise, Umsatz, FinanceState, Ledger, Lager noch Beschaffung. Es wurden keine FX-/ETA-Bestellobjekte, Schemaänderungen oder Architekturfreigaben hinzugefügt. Bestehende A01-UI-Dateien wurden nicht verändert; der erzeugte Run-Graph wurde nach den Runtimeänderungen neu gebunden.

## Geänderte Dateien

- `prototype/v3-run-macro-fixture.js` – Behebung der `baseTemplates`-Referenz; vorherige Wochen und deren replayvalidierte D-0169-Grundverteilung werden in die monatliche Integerallokation einbezogen.
- `prototype/v3/run.js` – `buildWeeklyTemplates()` akzeptiert `priorWeeks`; `openNextRunDay()` leitet diese ausschließlich aus früheren Wochenplänen dieses Runs und Monats ab.
- `prototype/v3-run-orchestrator.js` – chronologische deterministische Restoreprüfung mit gleichmonatigen Vorwochen; doppelte oder fehlende Schedule-Wochen werden zurückgewiesen.
- `prototype/v3-foreign-demand-market-regressions.mjs` – Rundungs-, Run-/Monatsgrenzen-, Save/Restore-, Tamper- und Nichtbuchungstests.
- `prototype/v3/run.html` – durch den bestehenden A05-Generator aktualisierte Importgraph- und Cache-Hashes.
- `docs/simulation/a02-t0063-l2-kumulative-rundung-bericht-cp0421.md` und `docs/agent-system/checkpoints/CP-0421.md`.
- `docs/agent-system/collaboration-state.md` – Ergebnis und nächste Reviews ergänzt.

## Prüfungen

- `node prototype/v3-foreign-demand-market-regressions.mjs` – PASS: neutraler Run, Lag, positive/negative kumulative Verschiebung, exakte `N=5`-Wochensummen und `13/20` Monatsziel, `N=0/1/2/5/17/100/501`, deterministisches Replay, anderer gültiger Exportsegmentumfang, Monatsreset, Cross-Run-Rejection, unbekanntes/dupliziertes Ereignis, Save/Restore sowie Schedule-/Makroquellen-/Fixture-Manipulation und Nichtmutation von Orders/Finance.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-foreign-demand-fixture-ui-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS; Generatoroutput entspricht `run.html`, vollständiger statischer Run-Graph mit 20 Modulen.
- `git diff --check` – Exit 0; Git zeigt nur bereits bekannte LF/CRLF-Konvertierungshinweise.

Kein Browser-/Gerätetest, A03-Fachreview, A09-Re-Review, Commit oder Push wurde ausgeführt.

## Folgeauftrag

A01 soll A03 um einen erneuten Nichtbuchungs-/Periodenreview bitten, A09 um eine adversariale Re-Prüfung der vorigen Wochen, kumulativen Rundung und koordinierten Restore-Manipulation. Nach beiden Reviews soll A01 den Browserlauf Januar→Februar wiederholen und die sichtbare Monatswirkung prüfen. T-0063, T-0065 und T-0069 bleiben `IN_PROGRESS`.
