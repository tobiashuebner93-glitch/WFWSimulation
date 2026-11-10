# A03 Finance-Re-Review – T-0063 L4 Kostenplanindizes (CP-0375)

**Status:** NONPASS für vollständige L4-Deduplizierungs-/Eingabeklarheit; PASS für getestete mathematische und Nichtbuchungsgrenzen
**Datum:** 31.10.2026
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L4, Anschluss T-0065/T-0066/T-0067/T-0069
**Entscheidungsbasis:** D-0161–D-0169; L4-Vertrag CP-0355; A03 CP-0354/0356
**Vorgänger:** CP-0374 (A02 L4-Implementierung); CP-0373 (A03 L2-Finanzreview)
**Snapshot:** `a02-code-input-t0063-l0l1`; kein `.git`

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| BICI-Formel, Basis, Units und Gewichtung | **PASS** | Vier Komponenten Material (EUR/kg), Energie (EUR/kWh), Lohn (EUR/h), Logistik (EUR/shipment oder EUR/t-km) werden jeweils auf 2027-01=100 normalisiert. BICI ist die gewichtete Summe der vier Komponentindizes; explizite Gewichte müssen nichtnegativ sein und zu 1 summieren. Fehlen Gewichte, sind 25 % nur mit der festgelegten synthetischen Fixture-/Parameter-ID zulässig. |
| Periodik, Lag und Quellenbindung | **PASS** | Effektive Periode muss genau auf den Folgemonat des Makroereignisses fallen; Event- und Komponenten-Lag müssen 1 Monat sein. Basis-/Ist-Perioden, Quelle/Quelle-Vintage oder explizite synthetische Parameter-ID, Beitrag-IDs und Basiswerte werden validiert. Fehlende oder widersprüchliche Komponenten ergeben kein erfundenes Ersatzmaß. |
| CPI/SPI vs. BICI/Wage/Procurement | **PASS** | L4-Projektion ist ein separater Run-Projektor; CPI/SPI (2020=100, COICOP-12) bleibt eigene Preisindexlogik. L4 ersetzt oder verändert keine SPI-Komponenten. SPI-Regression bestanden. |
| Wage-/Procurement-Sichten und Doppelzählung | **PASS mit Begrenzung** | WagePlanIndex ist eine separate Ein-Komponentenansicht. ProcurementPlanIndex gewichtet und normalisiert nur Material und Logistik auf ihre Teilgewichte. Keine der Ansichten wird im Projektor erneut in den BICI addiert oder zu Geldbeträgen umgerechnet. |
| Treiberüberlappung FX/Politik/Tarif | **NONPASS – Eingabeprovenienz nicht vollständig fail-closed** | Explizit nichtleere `driverIds` werden abgewiesen und der Test bestätigt `pending`; mehrere gleichzeitige Business-Cost-Plan-Events führen ebenfalls zu `pending`. `driverIds` ist in `validComponent` jedoch optional. Fehlt das Feld, kann der Projektor nicht unterscheiden, ob ein beobachteter Komponentenwert bereits FX-/Politik-/Tarifbeiträge enthält. Deshalb belegt der Code nicht für alle Eingaben, dass unaggregierte Treiber stets `pending` bleiben. Es wird zwar nichts addiert oder gebucht; der L4-Provenienz-/Deduplizierungsgate bleibt trotzdem offen. |
| Rundung | **PASS** | Der interne `after`-Index nutzt volle Präzision. `displayAfter` ist separat auf zwei Dezimalstellen formatiert und wird nicht in FinanceState oder eine Geld-/BAB-Funktion übergeben. Regression bestätigt 102.53075 intern und 102.53 nur als Anzeige. Keine Centrundung oder Währungsumrechnung erfolgt. |
| Unvollständige/widersprüchliche Eingaben | **PASS im getesteten Scope** | Unvollständiges BICI ist `pending`; falsche Units/Perioden/Lags, Beitragduplikate, nicht passende Gewichte, fehlende Provenienz und explizite unaggregierte Treiber erzeugen keine Projektion. Teilansichten bleiben nur für ihre eigenen belegten Komponenten verfügbar. |
| Run-/Finanz-/Ledger-Nichtmutation | **PASS** | L4 wird aus replayvalidierter Makrohistorie projiziert und ändert weder Istkosten, BAB, Payroll/Lohnvertrag, Bestand, Beschaffungsvertrag, COGS, Rechnungen, Verbindlichkeiten, Cash, Zins oder Ledger. Direkte Finanzwirkung **0,00 €**. Run- und FinanceState-Vergleich im Regressionstest blieb unverändert. |
| Save/Restore und D-0169 | **PASS** | L4-Projektion wird nach Save/Restore identisch rekonstruiert; manipulierte Makroeventkopie wird beim Envelope-Erstellen abgewiesen. D-0169-Regression bestand; L4 wird nicht mit dem Nachfragekanal verrechnet und ändert dessen Gesamtzahl nicht. |
| Operative/Wirtschafts-/Releaseintegration | **NICHT GEPRÜFT / KEINE FREIGABE** | Keine operative Kostenkalkulation, BAB-/Jahresabstimmung, UI-/Browser-/Geräteprüfung oder Releasebewertung durchgeführt. Die synthetischen Gleichgewichte sind nur Testwerte, keine Branchengewichte. |

## Reproduktion

Im Snapshot `a02-code-input-t0063-l0l1` ausgeführt; alle Befehle mit Exitcode 0:

- `node prototype/v3-business-cost-plan-index-regressions.mjs` — L4-Formeln, gewichtete Handwerte, Lag, Neutral-/Pendingfälle, Präzision, Nichtmutation und Restore.
- `node prototype/v3-finance-runtime-regressions.mjs` — Finance Runtime.
- `node prototype/v3-price-index-regressions.mjs` — CPI/SPI COICOP-12.
- `node prototype/v3-macro-simulation-regressions.mjs` — Makroevent-/Replayregression.
- `node prototype/v3-run-orchestrator-regressions.mjs` — Run-/Envelope-/Restorepfad.
- `node prototype/v3-macro-demand-channel-regressions.mjs` — D-0169-Gesamtkanal und Finanz-Nichtmutation.

## Reviewgrenze und nächster Schritt

Der einzige festgestellte NONPASS betrifft die fehlende explizite Treiberliste, wenn `driverIds` gar nicht vorhanden ist. Bis die Beleglage geklärt ist, bleibt der Fach-PASS für das strengere CP-0355-Deduplizierungskriterium aus. Minimale A02-Fixübergabe: fehlendes `driverIds` für jede Komponente als `pending` behandeln oder die Provenienz des Komponentenwerts auf eine gleichwertig verbindliche Weise fail-closed nachweisen; leere Liste muss explizit „keine eingebetteten Treiber“ bedeuten. Keine Regel/Default oder Codeänderung durch A03.

Keine Istkosten-/BAB-/Lohn-/Vertrags-/Bestands-/COGS-/Finanz-/Postingfreigabe, kein Jahres-/Ledgerabgleich und keine UI-/Releasefreigabe. Kein Browser-/Gerätetest. A09 unabhängiges adversariales Review bleibt separat erforderlich.

## Nachweisrollen und Git

- **Ausführung/Fachreview:** A03, read-only.
- **Unabhängige QA:** nicht durch A03 ausgeführt; A09 folgt separat.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** `git status --short` nicht verfügbar (`fatal: not a git repository`); kein Commit/Push.
- **Änderungen:** nur dieser Bericht und CP-0375-Entwurf in diesem Paket; Produktcode unverändert.

**Nächster Schritt:** A01 übergibt den präzisen `driverIds`-Fail-closed-Befund an A02 zur Nachbesserung. Danach A03/A09 gezielt rereviewen.
