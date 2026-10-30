# T-0062 A03 – unabhängiger Finanz-Fachreview der D-0160-Implementierung

**Status:** Review abgeschlossen; fachliche Code-Konsistenz bestätigt, Git-Provenienz in dieser Umgebung nicht verifizierbar  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0062  
**Prüfgrundlage:** D-0160, D-0120, D-0125, D-0126; `prototype/finance.js`, `prototype/equipment.js`, `prototype/app.js`, `prototype/v2-phase8-finance-regressions.mjs`, `prototype/year-simulation-smoke.mjs`; A02-Bericht `T-0062-A02-phase8-implementation.md`.

## Provenienz und Umfang

Der Review erfolgte auf den lokal sichtbaren Dateien im Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`. Als Ausgangsrevision war im Arbeitsauftrag `194fbaa7069ef59d1c832164a21b06f1cd2102d` angegeben. Die aktuelle HEAD-Revision und Änderungen gegenüber diesem Stand konnte ich nicht unabhängig feststellen: Der Checkout ist in meiner Ausführungsumgebung außerhalb der freigegebenen Workspace-Wurzeln nicht als Git-Worktree zugänglich (`git -C ... rev-parse`: Zugriff verweigert; `git diff --check`: „operation must be run in a work tree“). Deshalb ist dieser Bericht **nicht unabhängig an einen Commit gebunden**. Es wurden keine Produktdateien, CPs oder MCPs geändert.

## Fachbefund

Die beobachtete Phase-8-Verarbeitung stimmt mit dem V2-Vertrag D-0160 überein:

1. `processFinancialDay()` überspringt ein bereits verarbeitetes Datum (`lastFinancialProcessingDate`) und beginnt sonst mit Kundeneingängen; die Funktion zur Kundenzahlung führt gezogene Disposchuld nach D-0126 zuerst zurück.
2. Danach folgen im zentralen Ablauf Maschinenrate, Immobilienrate und – sofern ein Spielzustand übergeben wurde – Anlagenraten. Anlagenkredite werden zuvor deterministisch nach nächster Fälligkeit und Vertrags-ID sortiert.
3. Anschließend werden offene eigene Betriebsposten mit Vollzahlungsversuch in gespeicherter Spielerpriorität verarbeitet. Gleichstände werden deterministisch nach nächstem Fälligkeitstermin und stabiler Posten-ID sortiert.
4. Danach werden SimTAX-Zahlungen versucht. Erst anschließend werden Reminder/Formal-Mahnungen und Statusfortschreibungen für weiterhin offene Posten ausgelöst. Vollständig bezahlte Posten werden dabei übersprungen.
5. Die tägliche Dispozinsabgrenzung läuft zuletzt. Die Monatsbelastung bleibt an der vorhandenen Monatsabschlusslogik.

`app.js::processDay()` ruft die zentrale Finanzverarbeitung genau einmal mit `lastProcessedDate` auf; der Jahres-Smoke verwendet denselben Einstieg. Die Anlagenrate wird nicht mehr außerhalb bzw. vor dem gemeinsamen Phase-8-Ablauf versucht.

Die Zahlungsversuche sind vollständig; es gibt weder Teilzahlung noch negative Kassenliquidität. Es wird kein automatischer Dispo gezogen. Der manuelle Abruf für unterstützte fällige Betriebsposten bleibt exakt auf den Fehlbetrag begrenzt. Die vorhandene Maschinenraten-Option bleibt separat erhalten; Immobilien- und Anlagenraten erhalten dadurch keine neue manuelle Dispooption. Retry-/Verwertungsfolgen der jeweiligen Kreditarten werden durch die Orchestrierung nicht vereinheitlicht.

Die Phasenzuordnung aus D-0160 wird im Code durch `phase: 8` für Rate-, Retry-, SimTAX- und Statusereignisse eingehalten. V1-D-0129 wird nicht zur neuen V2-Regel umgedeutet. Die Finance-Implementierung behauptet keine reale steuerrechtliche Behandlung.

## Tests und Gates

| Gate | Ergebnis | Nachweis |
|---|---|---|
| D-0160 Ereignisreihenfolge, Spielerpriorität und Abgleich | PASS | `node prototype/v2-phase8-finance-regressions.mjs`; 7 Gruppen, erwartete Reihenfolge Kundeneingang → Maschine → Immobilie → Anlage → sonstiger Retry → SimTAX → Reminder |
| Knappe Liquidität: keine Teilzahlung, kein negativer Bestand, kein automatischer Draw | PASS | Gruppe 2 derselben Phase-8-Regression |
| D-0125-Grenze | PASS | Regression bestätigt vorhandenen manuellen Maschinenabruf und keine Erweiterung auf Immobilien-/Anlagenraten |
| Retry-Verhalten und wirksames Datum/Idempotenz | PASS | Phase-8-Regression; Wiederholung für denselben wirksamen Tag wird nicht doppelt gebucht |
| Jahres-Smoke | PASS | `node prototype/year-simulation-smoke.mjs`; erreicht 2028-01-01, 12 Monatsabschlüsse, 0 € offene Kosten, 0 Reconciliation-Fehler, finite Liquidität; Event-Hash `52ea26ea02a5655db7ff83f6d47b49d9622140d3b92934d7417551c61e27434c` |
| Git-Diff-/Commitbindung | OFFEN | Git-Metadatenzugriff in dieser Umgebung nicht verfügbar; A01 muss aktuellen Diff und Revision aus dem Repo-Workspace prüfen |
| Browser-/Gerätetest | nicht ausgeführt | Dieser Auftrag war ein Finanz-Code-Fachreview |

## Ergebnis

Ich fand keinen fachlichen Widerspruch zwischen D-0160/D-0125 und der geprüften Implementierung. Die Reihenfolge, Same-Day-Verarbeitung, Idempotenz, Vollzahlungsregeln und Dispoabgrenzung sind durch den gezielten 7-Gruppen-Test und den aktuellen Jahres-Smoke belegt. Das ist ein **A03-Fachreview-PASS** für die sichtbaren Dateien, keine unabhängige Git-, Gesamt-QA-, Browser-, Release- oder Commitfreigabe. Vor Zusammenführung der Gates muss A01 die Berichtsaussagen an denselben tatsächlichen Commit/Arbeitsbaum binden.
