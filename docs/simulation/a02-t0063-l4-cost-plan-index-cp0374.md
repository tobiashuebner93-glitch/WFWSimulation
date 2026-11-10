# A02-Bericht – T-0063 L4 Kostenplanindizes (CP-0374)

**Status:** L4-Projektor und fokussierte Regressionen PASS; A03-Finanzreview ausstehend
**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L4, Anschluss T-0065/T-0069
**Entscheidungsbasis:** D-0161–D-0169; insbesondere CP-0355 L4-Vertrag
**Vorgänger:** CP-0351, CP-0354, CP-0355, CP-0356. CP-0373 wurde als aktueller A03-Nichtbuchungsreview gelesen, betrifft jedoch L2/FX und ist keine L4-Freigabe.
**Arbeitsbasis:** `a02-code-input-t0063-l0l1`, Stagingpaket ohne `.git`

## Ergebnis

Ein eigener reiner L4-Projektor hängt im V3 Shared Run. Er verwendet eine neue replayfähige Makro-Eingangsspur `business_input_cost_plan`; die Standard-Makrofixture liefert dafür keine Kostenkomponenten und bleibt neutral. Der bestehende CPI/SPI-Warenkorb mit Basis 2020=100 bleibt unverändert und getrennt.

Eine Projektion verlangt eine explizite Komponentenliste mit Material (EUR/kg), Energie (EUR/kWh), Lohn (EUR/h) und Logistik (EUR/shipment oder EUR/t-km). Jede Komponente benötigt positive Basis-/Istplanwerte, Basisperiode 2027-01, Quellperiode, einmonatigen Lag und eine stabile Contribution-ID. Synthetische Eingaben benötigen die explizite Parameter-ID `V3-PLAN-INDEX-SYNTH-EQUAL-1` und Quellenreferenz. Beobachtete Eingaben müssen ihre Quellenreferenz und Vintage oder Snapshot, Beobachtungsperiode sowie gültige Einheit liefern. Unvollständige oder widersprüchliche Komponenten werden als `pending` geführt oder neutral gelassen.

Der BICI wird nur mit vier vollständigen Komponenten berechnet. Mit expliziten Gewichten müssen diese auf 1 summieren. Ausschließlich mit der genannten synthetischen Testparameter-ID darf bei fehlenden Gewichten die gleichgewichtete Testkonvention 25 % pro Komponente verwendet werden; diese ist kein Branchen- oder Produktionsgewicht. Der `WagePlanIndex` ist die separate Lohnkomponentensicht. Der `ProcurementPlanIndex` normalisiert ausschließlich Material- und Logistikanteile auf deren Teilsumme und protokolliert die resultierenden Teilgewichte. Diese Sichten werden nicht zum BICI addiert.

Alle Werte werden mit voller Rechenpräzision gespeichert; `displayAfter` rundet ausschließlich für die Anzeige auf zwei Dezimalstellen. Die Modellberechnung enthält keine Cent-Rundung. CPI-/FX-/Politik-/Tariftreiber werden durch keine neue Pass-through-Formel kombiniert; eine Komponente, die solche nicht aggregierten Treiber deklariert, bleibt `pending`. Die Projektion ändert keine Istkosten, BAB, Lohnläufe, Bestände, Verträge, Finanzen, Buchungen oder Ledgerzustände.

Die Komponenten- und Eventhistorie wird als Bestandteil der autoritativen Makro-Monatssnapshots replayvalidiert. Projektionen nach Restore sind identisch; eine manipulierte Snapshotkopie wird durch Run-Save-/Restore-Validierung abgewiesen.

## Handprüfungen / Regressionen

- Vier Basiswerte 100 mit 25-%-Gewichten ergeben BICI 100, Wage 100 und Procurement 100.
- Material 110 bei den übrigen Werten 100 ergibt BICI 102,5 und Procurement 105; Wage bleibt 100.
- Lohn 110 ergibt BICI 102,5 und Wage 110; Procurement bleibt 100.
- Logistik 120 ergibt BICI 105 und Procurement 110.
- Material 110,123 ergibt intern BICI 102,53075 und nur für Anzeige 102,53.
- Januar-Input wird wegen Lag 1 erst im Februar wirksam.
- Fehlender Standardinput erzeugt keine Effekte; fehlende Komponente, falsche Einheit/Periode/Lag/Quelle, doppelte Contribution-ID, ungültige Gewichtssumme und nicht aggregierter FX-Treiber werden `pending`/neutral.
- Save/Restore reproduziert dieselbe Projektion; eine veränderte effektive Makroeventkopie wird beim Save abgewiesen.
- Run und FinanceState bleiben unverändert.

## Geänderte Dateien

- `prototype/v3-business-cost-plan-index.js` – versionierter, nichtbuchender L4-Projektor.
- `prototype/v3-business-cost-plan-index-regressions.mjs` – deterministische synthetische Fixtures, Handberechnungen, Negativfälle, Replay/Restore und Nichtmutationsprüfungen.
- `prototype/v3-macro-simulation.js` – explizite externe Makrospur für `business_input_cost_plan`.
- `prototype/v3-macro-simulation-regressions.mjs` – neue neutrale Makrokanalform abgesichert.
- `prototype/v3/run.js` – Projektion im Shared-Run-Report verfügbar gemacht; keine UI.
- `docs/simulation/a02-t0063-l4-cost-plan-index-cp0374.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0374.md` – Checkpointentwurf.

CP-0354, CP-0355, CP-0356 und CP-0373 blieben unverändert.

## Prüfungen

Alle folgenden Befehle endeten mit Exitcode 0:

- `node prototype/v3-price-index-regressions.mjs` – SPI/COICOP12 unverändert PASS.
- `node prototype/v3-business-cost-plan-index-regressions.mjs` – L4 Berechnungen, Lag, Validierung, Replay/Restore und Nichtmutation PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – Makrokanal- und Eventreplay PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-run-operating-impact-regressions.mjs`
- `node prototype/v3-macro-trade-impact-regressions.mjs` – L2/FX/Export/ETA unverändert PASS.
- `node prototype/v3-macro-policy-impact-regressions.mjs` – L3/L6 PASS.
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-macro-demand-channel-regressions.mjs` – D-0169 PASS.
- `node prototype/v3-finance-runtime-regressions.mjs` – Finance-Runtime PASS.
- `node --check` für alle fünf geänderten Runtime-/Regressionmodule – PASS.
- Whitespaceprüfung aller geänderten Dateien – PASS.

SHA-256 der geänderten Runtime-/Regressionmodule:

- `prototype/v3-business-cost-plan-index.js`: `93268A27DE20699DBC761B11D6D40434FAF3087B41B17D11646E0DD27BCE2A16`
- `prototype/v3-business-cost-plan-index-regressions.mjs`: `B3F207695D3C9B64E8B2771B24D4C914F2DBBDDB60EB939D44DE65D28668808E`
- `prototype/v3-macro-simulation.js`: `6C94FFD4235CA060DB547B52D91AD160B3DF8FCA5A1D431896243C9FFBD4D2A1`
- `prototype/v3-macro-simulation-regressions.mjs`: `46BA4BCD66DB89545F4830E06B633E061D5C3F6426F3183C9C0F850235BE54E1`
- `prototype/v3/run.js`: `78806A61A82206B9BE55FD760D135CB6008117EF95A61CD03753A0845003E9E6`

## Nachweisrollen und Grenzen

- **Ausführung:** A02; fokussierte L4- und Cross-Regressionen PASS.
- **Fachreview:** A03 Finance Review zu CP-0374 ausstehend.
- **Unabhängige QA:** A09 adversarial review nach A03 ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Änderung.
- **Jahres-/Releaseprüfung:** nicht ausgeführt oder behauptet.
- **Git-Verifikation:** nicht verfügbar, Stagingpaket ohne `.git`; kein Commit/Push.
- **Schema/Architektur:** unverändert.

**Nächster Schritt:** A01 beauftragt A03 mit read-only Finance-/Nichtbuchungsreview, danach A09 mit unabhängigem Adversarialreview. T-0063 bleibt offen.
