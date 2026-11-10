# A09 – T-0063 L2 kumulative Exportmix-Rundung: adversariales Re-Review

**Status:** PASS im engen Runtime-/Replay-/UI-Regressionumfang; keine T-0063-/V3-Gesamtfreigabe  
**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 L2; Anschlüsse T-0065/T-0069  
**Profil:** V3 Shared Run, Start 2027-01-04, Ende bis 2027-03-02; UPSWING; Seed `seed-v3-001`; Opt-in `V3-L2-EXPORT-SHIFT-5PP-LAG1`; `NEUTRAL` bleibt Standard  
**Maßgebliche Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Wochen-Gesamtanfragenfaktor  
**Vorgänger:** CP-0421; CP-0417–0420 als unveränderte Basis  
**Gitstatus:** nicht verfügbar; `git status --short` und `git diff --check` scheitern in diesem Checkout mit `fatal: this operation must be run in a work tree`. Kein Commit/Push.

## Preflight und Scope

Vor der Prüfung wurden `AGENTS.md`, Agentenstruktur und Rechte-Matrix, Goals, aktives Ticket-Board, Collaboration State, Decision Log mit D-0161–D-0169, CP-0417–CP-0421 sowie A08-Design, A02-Runtimebericht CP-0418, A03-Review CP-0419, A01-Rundungsbericht CP-0420, A02-Nachtrag CP-0421 und die aktuellen Runtime-, UI- und Testdateien gelesen. Die frühere A09-NONPASS-Referenz `templates` in `allocateWeek()` ist im aktuellen Stand durch `baseTemplates` ersetzt. CP-0417–0421 wurden nicht geändert.

Die Prüfung ist read-only. Es wurden keine Runtime-/Produktdateien und keine Finanz-, Vertrags-, Markt- oder Unternehmensdaten verändert.

## Ergebnis

**PASS im begrenzten T-0063 L2-Scope.** Der gemeinsame Run erzeugt D-0169-`N` zuerst und verteilt dieselben Slots kumulativ über die Wochen desselben Monats. Bei `N=5` je Februarwoche und `+5 pp` ergeben die vier Februarwochen exakt 20 Anfragen und 13 exportfähige Segmentzuordnungen. Die wöchentlichen Exportzahlen sind deterministisch `3, 4, 3, 3`; die Einzelwochenlänge bleibt jeweils 5. Template-/Kundenidentitäten bleiben an den Slots gebunden und die Segmentvorlagen tragen ihre vorhandenen Kapazitäts- und Fähigkeitsmetadaten.

Die Januarquelle wirkt erst im Februar. März setzt die Monatsaggregation zurück. Save/Restore liefert dieselben Februarzuordnungen und denselben Finanzzustand. Gegenproben mit abgestimmter Mutation der Vorwochen-/Aktuell-Templates in `modules.market.events`, `scheduledWeeks` und dem jeweiligen `dayOpenFingerprint` wurden beim Restore verworfen. Eine Mutation des autoritativen Januar-Makroinputs wurde ebenfalls verworfen. Cross-Run-Vorwochen werden abgewiesen.

Der geprüfte Pfad erzeugt keine zusätzlichen Anfrage-Slots, Kundenaufträge, Zuschläge, Verträge, Work Orders, Bestände, Beschaffungen oder Finance-Ereignisse. Die Finanzprojektion blieb unverändert. Die UI-Regressions belegen die Fixture als explizites Opt-in, synthetische Kennzeichnung, Monats-Lag und Anzeige des Istmixes; Browser-/Gerätetest war nicht Teil dieses Re-Reviews.

## Ausgeführte Prüfungen

Exit 0:

- `node prototype/v3-foreign-demand-market-regressions.mjs` – PASS; Neutralität, fehlende/Null-Exposition, Lag, D-0169-N, `N=0/1/2/5/17/100/501`, vier Wochen `N=5`, kumulierter positiver/negativer Rundungsausgleich, Segment-/Kapazitätsmetadaten, Unknown-/Duplicate-Fälle, Cross-Run, Monatsreset, Save/Restore, Tamper und Nichtbuchung.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – PASS; tatsächlicher Segmentmix wird berichtet, nicht ein zweites Mal umverteilt.
- `node prototype/v3/a05-t0063-foreign-demand-fixture-ui-regressions.mjs` – PASS; Neutral-Default, Opt-in, Labels, Datumsgrenzen, Run-/Savebindung.
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS; 20 statische Module und transitiver Graphhash.
- `node --check` für `v3-run-macro-fixture.js`, `v3/run.js` und `v3-run-orchestrator.js` – PASS.
- Zusätzlicher read-only Shared-Run-Replay Jan–März mit Seed `seed-v3-001`: 4 × N=5 im Februar, tatsächlicher Exportmix 13/20, Märzneutralität, Save/Restore, koordinierte Vorwochen-/Aktuell-Schedule-Tamper und Makroquellen-Tamper – PASS.
- Modulgraphgenerator zweimal ausgeführt: Ausgabe bytegleich und identisch mit vorhandenem `prototype/v3/run.html`; 20 Module. Graphtoken `sha256-e52de4af02731cb0a53bf89f0eb8f69e66f551bb2f907898b3ffa09f2bea3062`, `run.js` SHA-256 `bc9c32eb7b1ce74823a535ba8dadd4334709939a780f3590e4aa083f69856438`, CSS SHA-256 `d7b850446e038f60e3ff872a104aaa356f0260fd17ded14ea2616604968ad493`.

## Grenzen und Übergabe

- Git-Status/Diffcheck waren wegen des Fehlers `fatal: this operation must be run in a work tree` nicht verifizierbar. Das ist kein bestätigter sauberer Arbeitsbaum.
- Kein Browser-/Gerätetest, Jahreslauf oder V3-Release-Gate ausgeführt.
- A03-Fachreview gilt gemäß CP-0419 für seine dokumentierte Nichtbuchungs-/Periodengrenze; dieses QA-Review ersetzt kein neues A03-Fachreview, falls der kumulative Fix dessen Scope erweitert.
- Kein T-0063-, T-0065-, T-0069- oder V3-Gesamtabschluss.

**Nächster Adressat:** A01 soll den A09-PASS im engen Runtime-Scope koordinieren und die offenen A03-/Browser-/Git-Gates getrennt halten.

### Nachtrag: direkte UI-Projektionsprobe

Eine zusätzliche read-only Shared-Run-Probe über `projectV3MacroTradeImpacts()` und `renderMacroSummary()` prüfte das gerenderte HTML mit dem tatsächlich berechneten Februar-Mix. Das HTML enthält „Basis → tatsächlicher Segmentmix“, die tatsächlichen Segmentzahlen und `Wochenanfragen 5 (unverändert)`. Ergebnis: PASS. Damit ist die UI-Aussage an die wirkliche Runtimeprojektion gebunden, nicht nur an statische Markuptexte.
