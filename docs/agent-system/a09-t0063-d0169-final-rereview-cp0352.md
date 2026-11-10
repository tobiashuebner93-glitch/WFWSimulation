# A09 – D-0169 adversarial Re-Review nach CP-0350

**Ergebnis: PASS (begrenzter D-0169-Runtime-/Restore-Scope)**
**Status:** ENTWURF – unabhängige QA auf A01-Snapshot nach CP-0350
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0069
**Entscheidung:** D-0169
**Vorgänger:** CP-0345–CP-0351; insbesondere CP-0349 (Vor-Fix NONPASS), CP-0350 (A02-Fix), CP-0348 (A03), CP-0351 (A08)

## Kurzurteil

Der D-0169-Trace-/Save-/Restore-Gate ist im geprüften gemeinsamen makrogestützten V3-Pfad **PASS**. Der CP-0349 Exposure-0-Angriff wird abgewiesen, sowohl wenn das `market_schedule`-Run-Event unverändert bleibt als auch wenn sein Ergebnis passend mitgeändert wird. Separat werden Run-Event-only-Abweichungen und Wochenvorlagen, die vom gespeicherten Day-open-Fingerprint abweichen, beim Save und Restore abgewiesen.

Die neue Validierung bindet Nachfrage-Trace, Wochenvorlagen, Market-Modul-Schedule-Event, `market_schedule`-Run-Event und Wochen-Day-open-Input aneinander. Gap/Quelle werden gegen den autoritativen Makro-Monatssnapshot und dessen aufgezeichneten Day-open-Makroinput geprüft. Der Trace enthält und validiert `runId` und `scenarioId`; im gemeinsamen V3-Szenariopfad ist Exposure genau 1. Fehlende Exposition bleibt außerhalb dieses Pfads neutral (0). Makrofreie generische Fixtures bleiben kompatibel.

Dieses PASS gilt für den D-0169-Runtime-/Provenienzscope. Es schließt weder T-0063 insgesamt noch die übrigen Integrations-/Jahresgates in T-0065/T-0069 ab. A08 CP-0351 dokumentiert größere, noch offene Makro-Unternehmenswirkungspfade.

## Gatebefunde

| Gate | Ergebnis | Befund |
|---|---|---|
| Formel `100 + activityGapPct`, Faktor 1:1, ±10-%-Cap, Basis 5 | PASS | Implementierung und 52-Wochen-Richtungsvergleich stimmen mit D-0169 überein. |
| Floor-plus-seedstabile Restziehung / Matched Pairs | PASS | Draw-Key nutzt Modellversion, Seed und Woche, nicht Szenario-ID; feste Richtungsläufe: BOOM 274, neutral 260, LOW 256. |
| Fehlendes Exposure | PASS | Demand-Funktion defaultet fehlende Exposition auf 0; Faktor bleibt 1. Der gemeinsame Makro-Run verlangt explizit `exposure === 1`. |
| Pflichttrace, Anzahl- und Wochenabgleich | PASS | Gemeinsame makrogestützte V3-Wochen erfordern einheitlichen D-0169-Trace; Trace-Anfragezahl muss Templatezahl entsprechen. Tracefreier Save/Restore wird abgewiesen. |
| Trace Gap/Quelle/Snapshot | PASS | Gap/Quelle folgen dem Aktivitätspaar des autoritativen Monatssnapshots; Snapshotperiode/-ID werden mit der Woche verglichen, sofern im Trace enthalten. Der Monatssnapshot wird auf Input-Fingerprint und `macro_month`-Run-Event zurückgeführt. |
| Vorlage ↔ Day-open-Fingerprint | PASS | Marktvorlagen inklusive Trace müssen exakt dem `marketWeekTemplates`-Payload im gespeicherten Wochen-Day-open-Fingerprint entsprechen. |
| Market-Modul-Event ↔ Run-Event | PASS | Eindeutige Event-ID, erwartete Quelle, unveränderte Vorlagen und übereinstimmendes Ergebnis werden geprüft. |
| Exposure=1 und Run-/Szenarioidentität | PASS | Gemeinsamer Makro-V3-State weist andere Exposure bzw. Trace-`runId`/`scenarioId` zurück. Demand-Trace speichert diese IDs explizit. |
| Save/Restore und koordinierte Mutation | PASS | Die zwei CP-0349-Angriffsvarianten sowie unabhängige Run-Event- und Fingerprintabweichungen scheitern bei Save und Restore. |
| Finance-Nichtmutation | PASS, begrenzter Scope | Makro-Demand selbst verändert FinanceState nicht; die angeordnete D-0169-Regression bestätigt strukturelle Gleichheit. Keine Ledger-/Jahresfreigabe. |
| V1/V2-Grenze | Eingeschränkt PASS | V3-Nachfrage-/Marktmodule importieren keine Legacy-/V1-/V2-Module. Da kein `.git`/Baseline-Diff vorliegt, ist die vollständige Dateiunberührtheit im Checkout nicht verifizierbar. |
| Synthetische UI-Kennzeichnung / Snapshotreihenfolge | PASS | UI bezeichnet die Annahme sichtbar als synthetisch/nicht kalibriert; Monats-Snapshot wird im Run vor der Marktwochenplanung erzeugt. |

## Adversariale CP-0349-Wiederholungen

**Exposure 0, Run-Event unverändert:** Erster BOOM-Wochenplan hat fünf Anfragen. Ein neu berechneter Trace mit identischen Gap-/Quellen-/Snapshot-/Run-/Szenariowerten und `exposure: 0` erzeugt weiterhin fünf. Nach Ersetzen des Trace in allen Templates und im Schedule-Ergebnis sowie Update von `scheduledWeeks` wurden sowohl `createRunSaveEnvelope` als auch `restoreRunSaveEnvelope` abgewiesen.

**Exposure 0, Run-Event synchron geändert:** Derselbe Angriff, zusätzlich mit angepasstem `market_schedule`-Run-Event-Ergebnis. Save und Restore wurden ebenfalls abgewiesen; der gemeinsame V3-State meldete unzulässige Exposure.

Zusätzliche isolierende Checks:

- Bei unverändertem `exposure: 1` führt eine Änderung nur am `market_schedule`-Run-Event zur Abweisung „not bound to its authoritative market-module event“ bei Save und Restore.
- Bei unverändertem Schedule-Trace und Run-Event, aber manipuliertem Template `customerId` (entsprechend mitgeänderte Marktanfrage und `scheduledWeeks`), werden Save und Restore wegen Abweichung zum Day-open-Fingerprint abgewiesen.
- Der dauerhafte D-0169-Test koordiniert eine geänderte Makro-/Gap-/Quellen-/Tracekette bei unverändertem Makro-Day-open-Fingerprint und erwartet Restore-Ablehnung.
- Entfernen des gesamten Trace aus einer geplanten gemeinsamen V3-Woche wird beim Restore abgewiesen.
- Trace-`runId` und `scenarioId`-Mutationen werden vom deterministischen Tracevalidator zurückgewiesen.

Die Checks verändern keine Dateien und sind keine kryptografische Signatur oder Schutzgarantie gegen ein vollständig neu konstruiertes lokales Save samt sämtlichen korrespondierenden Eingaben und Nachweisen.

## Regressionen

Alle vier angeordneten Suites wurden im Snapshot mit Exit 0 ausgeführt:

- `node prototype/v3-macro-demand-channel-regressions.mjs` – **PASS**; einschließlich beider Exposure-0-Varianten, `runId`/`scenarioId`, fehlendem Trace, Quellen-/Snapshotbindung, Replay und Finance-Nichtmutation.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – **PASS**.
- `node prototype/v3-market-simulation-regressions.mjs` – **PASS**.
- `node prototype/v3-run-orchestrator-regressions.mjs` – **PASS**; makrofreie generische Fixturepfade bleiben gültig.

Kein Jahressmoke ausgeführt; für den angeforderten Re-Review-Scope nicht erforderlich. Keine weiteren Tests.

## Preflight, Snapshot und Grenzen

AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket Board, Collaboration State, Decision Log/D-0161–D-0169, CP-0345–CP-0351, A02-CP-0350/Arbeitsbericht, A03-CP-0348, A08-CP-0351 und die aktuellen Makro-/Market-/Run-/Orchestrator-/Regressiondateien wurden gelesen. Der Snapshot enthält die benötigten Reviewdateien und hat kein `.git`-Verzeichnis.

- **Git:** nicht verfügbar. Branch, HEAD, vollständiger Working-Tree-Status, Baseline-Diff und `git diff --check` nicht verifizierbar.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Produktdateien geändert:** nein. Report und CP-0352 wurden im staged Tree angelegt.
- **Commit/Push:** nicht ausgeführt.

## Übergabe

A01 kann den D-0169-Provenienz-/Restore-Teil von T-0063 in diesem begrenzten Reviewumfang als PASS dokumentieren. T-0063 bleibt wegen der in CP-0351 genannten offenen Unternehmenswirkungspfade insgesamt offen. T-0065 und T-0069 haben weitere Integrations- und Jahresgates; kein Release-, Finanz-, Buchungs- oder Gesamtjahres-PASS wird erteilt.
