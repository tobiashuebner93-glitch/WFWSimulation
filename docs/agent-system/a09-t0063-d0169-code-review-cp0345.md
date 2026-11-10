# A09 – D-0169-Nachfragekanal: unabhängiger Code- und Regression-Review

**Ergebnis: NONPASS**
**Status:** ENTWURF – read-only Review auf bereitgestellter Working-Tree-Dateikopie; keine Änderung an Produktcode
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0069
**Entscheidung:** D-0169; Bezug CP-0338–CP-0344, besonders CP-0343/0344
**Prüfumfang:** D-0169-Laufzeit, Trace-/Restoregates und die vier ausdrücklich angeforderten Regressionen

## Ergebnis und Befunde

Die vier angeordneten Regressionen bestehen. Der D-0169-Codepfad erfüllt im normalen `openNextRunDay`-Pfad die 1:1-Übertragung samt ±10-%-Cap, die Basis von fünf Anfragen, deterministische floor-plus-Restziehung mit Szenario-Matched-Draws, Sichtbarkeit als synthetische/un-kalibrierte V3-Spielannahme, unveränderte Referenzpreise/Vertrags-/Kapazitätswerte sowie die Reihenfolge Monats-Snapshot vor Marktwochenplanung. Der Makro-/Marktpfad mutiert selbst keine FinanceState- oder Buchungsdaten.

Der Gate-Status ist dennoch **NONPASS**. Drei D-0169-Invarianten sind am API-/Restore-Rand nicht fail-closed:

1. **Fehlendes Exposure wird als volle Exposition behandelt.** In `prototype/v3-macro-demand-channel.js:24` hat `exposure` den Default `1`. Bei ausgelassenem Exposure und `activityGapPct !== 0` entsteht somit ein Nachfragefaktor ungleich 1. D-0169 sagt, fehlende Markt-Exposition müsse neutral (Faktor 1) bleiben; `null` wird stattdessen als ungültig zurückgewiesen. Die Regression prüft `exposure: 0`, aber weder ausgelassenes noch null Exposure. Erforderlicher Fix: fehlende/null Exposure explizit auf neutral 0 setzen oder den Kanal neutralisieren; die bestätigte 0..1-Semantik nicht durch einen stillen Full-Exposure-Default umgehen. Regression für ausgelassenes und `null` Exposure hinzufügen.

2. **Eine ganze Woche kann ohne Nachfrage-Trace angelegt und wiederhergestellt werden.** `prototype/v3-market-simulation.js:103–109` validiert den Trace nur innerhalb `if (demandTraces.length)`. Sind bei einer geplanten Woche alle `macroDemand`-Felder entfernt/nie vorhanden, wird die Prüfung übersprungen. `scheduleV3MarketWeek` bzw. `openV3RunDay` (`prototype/v3-run-orchestrator.js:320–324`) akzeptieren daher ungetracete Templates; Create-/State-/Save-/Restore-Validierung verlangt nicht für jede gemeinsame V3-Woche eine Trace-Provenienz. Das widerspricht dem D-0169-Gate „jede Woche“ und kann durch einen gültig geformten, tracefreien Zeitplan die Rechenprüfung umgehen. Erforderlicher Fix: den Trace für den D-0169-gebundenen gemeinsamen V3-Pfad verpflichtend verlangen und Zahl, Woche, Source-/Modell-/Entscheidungskennung beim Anlegen und bei jeder State-/Save-/Restore-Validierung fail-closed prüfen. Generische, bewusst makrofreie Markt-Fixtures nur über einen ausdrücklich anderen/versionierten Pfad zulassen.

**Zusätzliche Provenienzschwäche:** Die Trace-Struktur enthält keine `runId` oder `scenarioId` (`prototype/v3-macro-demand-channel.js:48–67`). `validateV3MacroDemandTrace` verlangt beide als Kontextargument, verwendet sie aber in der erwarteten Trace-Berechnung nicht (`:71–77`). Der Draw-Key lässt sie absichtlich weg und ist für Szenario-Matched-Pairs seed-/wochengebunden, was korrekt ist; Identität kann trotzdem separat als Trace-Metadatum gespeichert und validiert werden, ohne den Draw-Key zu verändern. Der Event-/Inquiry-Key bindet den restlichen Marktstate an den Lauf, doch der Nachfrage-Trace selbst weist die im D-0169 verlangte Szenario-Provenienz nicht aus. Bitte bei der Korrektur mit aufnehmen.

## Kriterienprüfung

| Prüfkriterium | Ergebnis | Beleg / Grenze |
|---|---|---|
| 1:1-Formel und ±10-%-Cap | PASS | `demandIndex=100+activityGapPct`, geteilt durch 100, auf 0.90–1.10 begrenzt; danach Exposure-Interpolation (`v3-macro-demand-channel.js:36–41`). |
| Basis 5, Null-/Neutralkontrolle | NONPASS | Basis 5 und Gap 0 sind korrekt. Exposure 0 besteht. Ausgelassenes Exposure wird nicht neutralisiert; `null` wird abgewiesen (Befund 1). |
| Floor-plus-Bernoulli, seed-stabil; Matched Pair | PASS | `floor(expected)`, Restvergleich mit deterministischem Hash; `drawKey` beinhaltet Modellversion, Seed, Woche, nicht Scenario (`:42–46`). Regression 52 Wochen: BOOM 274, neutral 260, LOW 256. |
| Geplante Anfragezahl = Trace | PASS für Trace-tragende Wochen; NONPASS vollständig | Market-Validator vergleicht `realizedInquiryCount` mit Templatezahl, aber nur, wenn mindestens ein Trace vorhanden ist (`v3-market-simulation.js:103–109`). Tracefreie Wochen umgehen dies (Befund 2). |
| Vollständige Wochenprovenienz, Create/Save/Restore fail-closed | NONPASS | Trace-Replay greift, wenn Trace existiert. Tracefreie Wochen, fehlendes Exposure und eine nicht gegen den Makro-Monatssnapshot geprüfte gap/source-Provenienz umgehen den Gate; run/scenario werden nicht tracegebunden. |
| Versions-/Manipulationsgrenzen | PASS mit Restlücke | Modellversion/DecisionRef/SourceRef/`calibrated:false` werden geprüft; vorhandener Trace wird deterministisch nachgerechnet. Fixtureversion `V3-RUN-UI-SYNTH-2` wird im Save/Restore validiert. Ungetraceter Wochenplan wird nicht geblockt. |
| V1/V2-Grenze | EINGESCHRÄNKT PASS | Nachfrage-/Marktmodule importieren keine Legacy-/V1-/V2- oder Finance-State-Module; A02-Arbeitsbericht nennt nur V3-Dateien. Dateidiff zur Basis konnte mit Snapshotkopie nicht unabhängig geprüft werden, daher keine Aussage, dass der Checkout V1/V2-Dateien unverändert enthält. |
| Synthetische Kennzeichnung | PASS | UI-Karte bezeichnet D-0169 als „synthetische, seed-stabile V3-Spielannahme“ und „nicht empirisch kalibriert“ (`prototype/v3/run.js:432–435`). |
| Keine Preis-/Vertrags-/Kapazitäts-/Finance-Mutation | PASS im D-0169-Pfad | `buildWeeklyTemplates` wählt Größen/Referenzpreise unverändert zyklisch; Makrotrace wird nur in Anfrage-Templates aufgenommen. Markt-/Makromodule sind getrennt vom FinanceState; D-0169-Regressions vergleichen FinanceState strukturell vor/nach Lauf. Dies ist kein allgemeiner Finance- oder Posting-PASS. |
| Abgleich der Makroquelle je Wochen-Trace gegen autoritativen Monatssnapshot | NONPASS | Trace-Replay nutzt die im Trace selbst gespeicherte Gap-/Quellenangabe; kein Abgleich zwischen Makroperiode und Wochen-Trace (`v3-macro-demand-channel.js:71–77`; `v3-run-orchestrator.js:98–123`). |
| Monats-Snapshot vor Makro-Marktereignis | PASS | `openV3RunDay` verarbeitet zuerst `macroMonthInput` und fügt `macro_month` hinzu, danach plant es `market_schedule` (`v3-run-orchestrator.js:313–324`). |

## Ausgeführte Regressionen

Alle vier angeordneten Kommandos wurden aus dem bereitgestellten Snapshot-Root mit Node ausgeführt; jedes beendete sich erfolgreich:

- `node prototype/v3-macro-demand-channel-regressions.mjs` – **PASS**; 52-Wochen-Richtung BOOM 274 / neutral 260 / LOW 256; integrierte Januar-/Restore-/Financechecks PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – **PASS**.
- `node prototype/v3-market-simulation-regressions.mjs` – **PASS**.
- `node prototype/v3-run-orchestrator-regressions.mjs` – **PASS**.

Die Suiten decken die drei oben genannten Randfälle nicht ab. Die bestandenen Tests ändern das NONPASS-Gate nicht.

## Herkunft, vollständige Vorprüfung und Gitgrenzen

Die von A01 bereitgestellte Kopie enthält AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log mit D-0161–D-0169, CP-0338–CP-0344, A02 Makrovertrag/-bericht, A03 Finance-Handoff-Matrix/Evidenzvertrag/Nachtrag sowie die angeforderten V3-Laufzeit- und Testdateien. CP-0345 war vor Erstellung frei. Keine für diesen Code-Review benötigte angeforderte Datei fehlte.

Dies war **keine direkte Git-Checkout-Prüfung**. Die Kopie enthält kein `.git`-Verzeichnis; tatsächlicher Branch, HEAD, vollständiger Working-Tree-Status, Vergleich zur Basis, `git diff --check` und V1/V2-Dateidiff waren nicht verfügbar. Die Ergebnisse gelten ausschließlich für den von A01 bereitgestellten Dateisnapshot auf CP-0343/CP-0344-Stand, vor CP-0346/CP-0347 und vor dem danach angekündigten A02-Snapshot-Bindungsupdate. Keine Commit-/Push-, Browser- oder Geräteprüfung wurde durchgeführt.

## Übergabe an A01

D-0169-Codegate **nicht bestanden**. A02 sollte fehlendes Exposure neutralisieren, Tracepflicht pro D-0169-Woche erzwingen, den Trace gegen den autoritativen Makro-Monatssnapshot validieren und Run-/Szenariometadaten binden sowie gezielte Negativregressionen ergänzen. Danach unabhängiges A09-Re-Review und A03-Nichtbuchungsreview erneut koordinieren. T-0063 bleibt im D-0169-Teil offen; T-0065/T-0069 bleiben ohnehin wegen ihrer übrigen Integrations-/Jahresgates offen.



