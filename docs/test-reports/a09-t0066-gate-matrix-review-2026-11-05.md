# A09 – T-0066 adversarial Gate-Matrixreview

**Status:** PARTIAL / T-0066 nicht abschließbar. G1–G7, G9 und G10 bestehen im geprüften automatisierten/rollenbezogenen Umfang; **G8 ist NONPASS** wegen fehlender Einheiten-, Quellen- und Rundungsprovenienz je Direktkostenzeile.
**Adressat:** A01 – MASTER_ORCHESTRATOR. Nächster technischer Owner: A02 für G8-Provenienz, mit A03-Fachreview.
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0066
**Prüfdatum:** 2026-11-05
**Prüfumfang:** Read-only Prüfung der aktuellen zehn Gates, des A02 Shared-Run-Berichts, der Produkt-/Run-/Costing-Regressions, des A03-Finanzreviews und der A05 headless UI Regression. Kein Browser-/Gerätetest, keine Jahresintegration oder Commit-/Pushprüfung.

## Aktuelle Kriterienklarstellung

Die überarbeitete A01-Zielfassung trennt T-0066 von T-0067: Gate 7 verlangt positive und negative DB-I-Planfälle ohne BAB-Abhängigkeit; eine ausdrücklich separat angezeigte T-0067-Plan-BAB-Rechnung ist zulässig, aber kein Ist-Ergebnis und kein vollständiger Gewinn. Gate 8 verlangt Direktkosten-/Verkaufssnapshots ohne BAB-Abhängigkeit. Produktverkäufe müssen `babStatus: pending_deferred_bab` und `babCalculation: null` behalten. Der Mixed-Run-Test enthält einen expliziten T-0067-Plan-BAB-Befund; die tatsächlichen Produktverkaufssnapshots bleiben BAB-frei und COGS bleibt pending. Dieser Punkt ist kein NONPASS.

## Ausgeführte Tests

Alle vier Befehle bestanden mit Exit 0:

- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS, einschließlich adversarial Mixed Run mit Kundenauftrag, zwei Eigenprodukten, gemeinsamem Personal/Maschine/Material/Fertigwarenlager, Buyer-Entscheidung, Versand, Restore und pending BAB/COGS.
- `node prototype/v3-product-lifecycle-regressions.mjs` — PASS.
- `node prototype/v3-product-costing-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0066-product-ui-regressions.mjs` — PASS (headless UI-Vertrag, Snapshot, Bestand/Reservierung, Versand und Plan-/Istanzeige).

## Binäre Gates G1–G10

| Gate | Ergebnis | Evidenz und Grenze |
|---:|---|---|
| G1 | **PASS** | Mixed Run führt `mixed-positive` und `mixed-negative` jeweils über Produktidee/-definition, Kostenplan, Planung/Produktion, Käuferangebot, ausdrückliche Käuferannahme und Versand. Die Verkaufssnapshots enthalten einmal DB I > 0 und einmal DB I < 0. |
| G2 | **PASS** | Skill-Positiv-/Negativpaar ändert nur die Qualifikation; die fehlende Fähigkeit blockiert ohne Mutation. Maschinenfähigkeit wird zusätzlich geprüft. |
| G3 | **PASS** | Motivation-only-Paar hält Kompetenzen/Ausstattung konstant und weist höheren Produktivitätsfaktor sowie geringere Planstunden nach. Abschluss speichert `simulated_actual`-Minuten mit demselben Assignment, Datum und Periode. |
| G4 | **PASS** | Ausstattungspaar weist positiven Produktivitätseffekt nach; fehlende bzw. nicht passende Pflichtausstattung wird fail-closed geprüft. |
| G5 | **PASS** | Mixed Run teilt Mitarbeiter, Maschine, Stahl und Fertigwarenlager zwischen Kundenauftrag und zwei Produkten. Die Überbuchung wird ohne Mutation abgewiesen. Zusätzliche separate Assertions prüfen Person-, Maschinen-, Material- und Lagerüberlauf jeweils mit Ressource/Datum und ohne Mutation; positive Einplanung ist vorhanden. |
| G6 | **PASS** | Mehrstufige Prozessfolge und Arbeitsdatum werden geprüft; Save/Restore erhält IDs, Abhängigkeiten und Snapshotbindungen; Replay ist idempotent; veränderte Duplikate sowie manipulierte Bewegungs-/Quellenbezüge scheitern fail-closed. |
| G7 | **PASS** | Direkte positive und negative DB-I-Fälle werden in angenommenen Produktverkaufssnapshots bewahrt. Sale-Snapshots behaupten kein Ergebnis nach BAB; T-0067-Plan-BAB bleibt eine getrennte Planansicht. |
| G8 | **NONPASS** | Produktkalkulation und Verkaufssnapshot bewahren Produkt/Angebot, Version, Periode, Nettoangebot, Modellversion, Direktkosten-ID, Centbetrag und Variabilitätsflag. `calculateV3OfferEstimate` normalisiert Kostenzeilen jedoch auf `{id, amountCents, variable}`. Einheit, individueller Quellbeleg und dokumentierte Rundungsprovenienz je Direktkostenzeile fehlen. Ein späterer Planwechsel überschreibt den Snapshot nicht, aber der gespeicherte Snapshot ist nicht ausreichend reproduzierbar nach Gate 8. |
| G9 | **PASS im geprüften Codeumfang** | Bewegungsbelege führen physisch, reserviert, quarantänisiert, verfügbar und Kapazitätsdelta getrennt. `storageConversion` bindet `storageUnitsPerOrderUnit`, `stockBaseUnitsPerOrderUnit`, Einheiten, Quellrefs und deren Quotient; der Snapshot erhält sie nach JSON-Restore. Prüfungen decken Reservation-vs-Physical, Lagerkapazität, Verkauf/Versand, Quarantäne, Roll-forward und Manipulation ab. Kein Ist-Kostenwert wird daraus abgeleitet. |
| G10 | **PASS im geprüften Code-/Rollenumfang** | FIFO-Mengenabgang stimmt mit angenommenem und versandtem Bestand überein; Versand bleibt bei `cogsStatus: pending_deferred_bab` möglich. A03 bestätigt die begrenzte Finanz-/Bewertungsgrenze; A09 hat die Integritäts- und Regressionspfade geprüft; A05 headless UI suite besteht. Das ersetzt keinen sichtbaren A01-Browser-Smoke. |

## NONPASS-Folge und Zuständigkeit

**A02 ist nächster Owner für G8.** Je Direktkostenzeile sind Einheit, Quellen-ID/Belegreferenz und ausgewiesene Rundungsregel/-ergebnis in Plan- und Verkaufssnapshot zu speichern. Die Änderung muss bestehende Angebots-/Verkaufssnapshots unveränderlich lassen und darf BAB-/COGS-Status oder Finanzbuchungen nicht vorziehen. **A03 reviewt** die Direktkosten-/Rundungssemantik. Danach **A05** aktualisiert und prüft die Anzeige; **A09** prüft G8 unabhängig erneut. Erst danach bleibt der von A01 auszuführende sichtbare Browser-Smoke als Release-/Ticketnachweis.

T-0066 bleibt offen. A09 hat keine Produkt-/Zieldatei, A01 Gatekriterien, bestehende Reports oder CP/MCP geändert. Keine Browserprüfung, kein Commit/Push.

## Geprüfte Artefakte und SHA-256

| Artefakt | SHA-256 |
|---|---|
| `prototype/v3-run-orchestrator-regressions.mjs` | `83E6ED7B1CCAA7B8B7F4AF64A1A62239C0E30136C1CB99A3FDC18638CE4C9D22` |
| `prototype/v3-product-lifecycle-regressions.mjs` | `6CC106A7E5B9B0E21B073D048034EC1EF635612B88C2E5C41D114F1F2DB2486A` |
| `prototype/v3-product-costing-regressions.mjs` | `D6DCDE8F409AF622FB810CE12AC3BAEA0C25C6292055D75FD5384DEE27DB0155` |
| `prototype/v3/a05-t0066-product-ui-regressions.mjs` | `B863B9624C4ECDA0331F7F8C1850C0D876DF1AE9D0FE82D3ABAA60E1261AAAD2` |
| `prototype/v3-product-lifecycle.js` | `E32080ADAE817B48DC1D0ECCE9DFD00F79C0B005B70FC860D69FF8474270CE39` |
| `prototype/v3-financial-calculation.js` | `6070203DDA53A5CEF7A90ADFD6211394A3A8D89EC3B861DAA1568C1C719C7281` |
| `docs/agent-system/a01-t0066-t0067-mindestziele.md` | `E20F4B496B2166B3BC103A9E3F60B1615BCC9A3DCE06B2FC365828F2B2A50FF9` |
| `docs/simulation/a02-t0066-mixed-run-minimal-slice-report-2026-11-05.md` | `E093DD6DE0D8BEA5C692C021D0BE453469CE4DBA90E98130F615D242698BB171` |
| `docs/accounting/a03-t0066-finance-review.md` | `BD8EEE07E4321F42CA102707213F72256CA46A559A223DEB21B1B91A93D166E7` |
