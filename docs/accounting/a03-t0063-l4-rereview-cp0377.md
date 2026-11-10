# A03 Finance-Re-Review – L4 raw-component-Provenienzfix (CP-0377)

**Status:** PASS im abgegrenzten L4-Provenienz- und Nichtbuchungsscope; keine Finanz-/Jahres-/UI-/Releasefreigabe
**Datum:** 31.10.2026
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L4, Anschluss T-0065/T-0066/T-0067/T-0069
**Entscheidungsbasis:** D-0161–D-0169; L4 Finance-Vertrag CP-0355
**Vorgänger:** CP-0374 (L4-Projektor), CP-0375 (A03-NONPASS wegen optionalem `driverIds`), CP-0376 (A02-Fix)
**Arbeitsbasis:** `a02-code-input-t0063-l0l1`; Stagingpaket ohne `.git`

## Gates

| Gate | Ergebnis | Befund |
|---|---|---|
| CP-0375-Repro: fehlendes `driverIds` | **PASS** | Jede indexwirksame Komponente muss genau einen Driver-Beleg führen. Fehlender oder leerer Array, falsche Driverform und unpassende Referenz liefern keine Indexwirkung; Projektion meldet `pending`. Der frühere A03-Repro ist als Regression aufgenommen. |
| Driverbindung/Integrität | **PASS** | Driver-Typ `raw_component`, Komponente, Quellmonat, Event-Key/-Referenz, Scope, Contribution-ID, Driver-ID und Effect-Group werden strukturell geprüft. Doppelte Driver-ID/Effect-Group sowie falsche/inkonsistente Werte führen zu `pending`. Es wird genau ein Treiber je Komponentenbeitrag akzeptiert. |
| Unaggregierte FX/Policy/Tarif/Umwelt/CPI-Treiber | **PASS im expliziten Metadatenumfang** | Als Driver-Typ deklarierte FX-, Policy-, Tarif-, Umwelt- und CPI-Beiträge werden abgewiesen und `pending` gehalten. Der Fix akzeptiert nur `raw_component`. Er erkennt keine außerhalb dieser Driver-Metadaten verborgene Übernahme in den Rohwert; die Datenquelle muss den Rohkomponentenstatus korrekt deklarieren. |
| Berechenbare synthetische Positivfixture | **PASS** | Die gültige `raw_component`-Fixture mit expliziten Komponenten-/Monatsbelegen erzeugt erwartete BICI-, Wage- und Procurement-Planindizes. 25-%-Gewichte bleiben an die explizite synthetische Parameter-ID gebunden, keine Branchen-/Produktionsgewichte. |
| Indizes, Plan-/Ist und Rundung | **PASS** | BICI, WagePlanIndex und ProcurementPlanIndex bleiben separate Planansichten; Anzeige-Rundung ist von voller interner Präzision getrennt. Kein Anzeige-/Indexwert wird in einen Geldbetrag umgerechnet oder an eine Finanzperiode gebucht. CPI/SPI bleibt separat. |
| Run-/Finanz-/Ledger-Nichtmutation | **PASS** | RunState und FinanceState werden vor/nach der Projektion verglichen und bleiben gleich. Keine Änderung an Istkosten, BAB, Payroll/Lohn, Inventar/Bestand, Lieferantenvertrag, COGS, Rechnung, Verbindlichkeit, Cash oder Ledger. Direkte Finanzwirkung: **0,00 €**. |
| D-0169, Replay/Restore | **PASS** | D-0169 bleibt unverändert. Gleiche Eingabe-/Runbasis ergibt denselben L4-Ausgabestand über Save/Restore. Eine manipulierte Eventhistorie wird beim Save-Envelope abgewiesen. |

## Reproduzierbare Prüfungen

Alle folgenden Befehle liefen im Snapshot mit Exitcode 0:

- `node prototype/v3-business-cost-plan-index-regressions.mjs` — L4-Formeln, valide raw-component-Fixture, fehlende/leere/falsche/duplizierte/inkonsistente Driverrefs, unaggregierte Fremdtreiber, Pending-Verhalten, Displaypräzision, Nichtmutation und Replay/Restore.
- `node prototype/v3-finance-runtime-regressions.mjs` — Finance Runtime.
- `node prototype/v3-price-index-regressions.mjs` — CPI/SPI.
- `node prototype/v3-macro-simulation-regressions.mjs` — Makrohistorie/Replay.
- `node prototype/v3-run-orchestrator-regressions.mjs` — Run-/Save-/Restorepfad.
- `node prototype/v3-macro-demand-channel-regressions.mjs` — D-0169-Invarianz und Finance-Nichtmutation.

## Grenzen und Nachweisrollen

- PASS gilt ausschließlich für den expliziten Provenienz-/Planindex-/Nichtbuchungsscope. Er bestätigt weder, dass eine reale Quelle wirtschaftlich vollständig ist, noch dass tatsächliche Lohn-/Materialkosten ermittelt sind.
- Keine operative Finanz-/Kosten-/Bewertungs-/Postingfreigabe; keine BAB-/COGS-/Jahres- oder Ledgerabstimmung. Kein UI-/Browser-/Gerätetest oder Releasegate.
- **Ausführung/Fachreview:** A03, read-only.
- **Unabhängige QA:** nicht ausgeführt; A09 bleibt separat erforderlich.
- **Git:** `git status --short` nicht verfügbar (`fatal: not a git repository`); kein Commit/Push.
- **Änderungen:** nur dieser Bericht und CP-0377-Entwurf im Paket; keine Runtimeänderung.

**Nächster Schritt:** A01 beauftragt A09 mit dem unabhängigen Adversarialreview des CP-0376-Fixes; L4s operative Verbindung und Jahresintegration bleiben offen.
