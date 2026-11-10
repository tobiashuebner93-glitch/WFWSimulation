# A03-Fachre-Review – T-0063 L2 kumulative Monatsrundung (CP-0423)

**Status:** PASS im begrenzten Perioden-, Replay- und Finanz-Nichtbuchungsscope
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 L2; Schnittstellen T-0065/T-0069
**Run-Profil:** V3 Shared Run ab 2027-01-04; Januarquelle, Februarwirkung; `NEUTRAL` ist Standard
**Entscheidungen:** D-0161–D-0169, insbesondere D-0162, D-0165–D-0169
**Vorgänger:** A02 CP-0421; A01 CP-0420; A03 CP-0419; A08 CP-0417
**Arbeitsbasis:** `main@8b72b7e`; lokale gemeinsame Arbeitsänderungen beibehalten, kein Commit/Push.

## Reviewbefund

A03 hat die CP-0421-Änderung im tatsächlichen Code read-only geprüft: `prototype/v3-run-macro-fixture.js`, `prototype/v3/run.js`, `prototype/v3-run-orchestrator.js`, L2-Regressions und die A02-Nachweise. Ergebnis: **PASS** im begrenzten Fachscope.

- **Periodische Aggregation:** Für das wirksame Ereignis werden abgeschlossene frühere Wochenpläne desselben Laufs und Monats chronologisch rekonstruiert. Die kumulierte Sollzahl ergibt sich aus der Summe der Basis-Exporttemplates plus `delta × Exposition × Summe(N)` und wird deterministisch gerundet. Die Wochenallokation ist jeweils die Differenz zum replayten kumulierten Istwert. Ein Monatswechsel setzt den kumulierten Stand zurück. Im getesteten Februarfall mit vier Wochen zu je `N=5` und synthetischem `+5 pp` entstehen 13 Exporttemplates aus 20; die Wochen-Summen bleiben jeweils exakt fünf.
- **D-0169-Mengentreue:** D-0169 erzeugt zuerst die Wochenzahl `N`. Die L2-Allokation ändert Segmentzuordnungen, nicht `N`; es entstehen keine zusätzlichen oder fraktionalen Anfrageobjekte. D-0169 bleibt der alleinige Gesamtmengenfaktor.
- **Replay/Restore:** Vorwochen werden aus gespeicherten Markt-Schedule-Ereignissen abgeleitet, nicht aus einem frei mutierbaren Rundungszähler. Der Validator rekonstruiert die Wochen chronologisch aus D-0169-Trace und Vorlage. Fremde Runs, doppelte/fehlende Wochen und abweichende Schedule-/Quellen-/Fixturedaten werden fail-closed zurückgewiesen. Gleiche Eingaben reproduzieren dieselben Wochenzuweisungen.
- **Finanzgrenze:** Die neue Aggregation/allocation erzeugt keine FinanceState-, Cash-, Ledger-, BAB-, Erlös-, Forderungs-, Steuer-, Rechnungs-, Bestands- oder Beschaffungswirkung. Anfragen bleiben Anfragen; Zuschlag, Vertrag, Work Order oder Leistung werden durch die Verteilung nicht erzeugt. Finanzwirkungen bleiben späteren getrennten, belegten Ereignissen vorbehalten gemäß D-0162 und D-0165–D-0168.

## Reproduzierte Tests

Exit 0 im aktuellen Checkout:

- `node prototype/v3-foreign-demand-market-regressions.mjs` – Monatsrundung positiv/negativ, exakte Wochen-/Monatssummen, neutrale Kontrolle, Monatsreset, Reproduzierbarkeit, Cross-Run- und Manipulationsabwehr, Save/Restore sowie keine Order-/Finance-Mutation.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – PASS, einschließlich L2-Istverteilung und Nichtmutation.
- `node prototype/v3/a05-t0063-foreign-demand-fixture-ui-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS; 20-Modul-Graph und transitiver Hash.

## Abgrenzung und nächste Übergabe

Dies ist kein A09-Adversarialreview, kein Browser-/Gerätebeleg, kein Jahres-Smoke und keine Produkt-, Architektur-, Schema-, Rechts- oder Releasefreigabe. Die `+5 pp` und Lag-1-Werte bleiben ausdrücklich synthetische Szenarioparameter. Keine Nutzerentscheidung ist für diesen engen Review erforderlich.

**Nächster Adressat:** A09 zur adversarialen Re-Prüfung insbesondere koordinierter Änderungen früherer Wochen, kumulativer Rundung, Makroquelle, Fixture- und Restorebindung. Danach A01-Browser-Replay für Januar bis Februar. T-0063/T-0065/T-0069 bleiben `IN_PROGRESS`.
