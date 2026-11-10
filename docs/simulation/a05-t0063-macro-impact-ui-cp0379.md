# A05-Arbeitsbericht – T-0063 Makro-Projektionsanzeige (CP-0379)

**Status:** UI-Integration und gezielte Regressionen PASS im beauftragten Darstellungsumfang; Review und Browserprüfung ausstehend
**Datum:** 2026-11-01
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A05 – FRONTEND
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, Anschluss T-0065/T-0066/T-0067/T-0069
**Start-/Zielprofil:** V3 Shared Run; UI-Standard 04.01.2027–29.01.2027; Integration der Projektionsresultate aus L2, L3/L6 und L4
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragefaktor
**Vorgänger:** CP-0378 (A09 L4 Provenienz-/Nichtmutationsreview), ergänzend CP-0367–CP-0377
**Arbeitsbasis:** bereitgestelltes Paket `a05-macro-impact-ui-cp0379`, ohne Git-Metadaten

## Ergebnis

Die bestehende Run-Makroübersicht zeigt nun die vom Shared Run gelieferten `macroTradeImpact`-, `macroPolicyImpact`- und `businessCostPlanIndexes`-Ergebnisse. Der Renderer leitet keine Projektionswerte ab. Erkennbar sind L2 FX-Planindex, erwartete Segmentverteilung und erwartete ETA sowie die nichtmonetären L3/L6-Indikatoren und die getrennten L4-Ansichten Business Cost Index, WagePlanIndex und ProcurementPlanIndex. Status, wirksamer Monat, Lag, Scope, Quelle und Fixture/Modell werden mit ausgegeben. Unvollständige Ergebnisse stehen als `pending`; neutrale Standardläufe zeigen „Keine aktive Exposition/keine Projektionswirkung“ auch vor dem ersten Monatssnapshot.

Die Anzeige grenzt Planwerte von Eurobeträgen, Istkosten, BAB, gebuchter Wirkung und Kredit ab. Sie erklärt explizit, dass eine L2-Segmentverschiebung die D-0169-Gesamtanfragenzahl unverändert lässt. Eingehende variierende Inhalte werden im HTML escaped. Die Projektionen sind semantisch als Abschnitt und einzelne Karten markiert; CSS nutzt ein umbruchfähiges 2-Spaltenraster, das bei schmalen Viewports auf eine Spalte wechselt.

Die neue A05-Regression prüft einen neutralen Shared Run und einen aktiven Shared Run mit expliziten L2/L3/L6/L4-Fixtures. Sie belegt getrennte L4-Indizes, Herkunft, Zeitraum/Lag, pending, ETA als erwarteten Termin, die D-0169-Invariante, hostile HTML sowie bytegleiche Run-/Finance-Zustände vor und nach Projektion und Rendern. Es wurden keine Modell-/Runtime-Projektoren, Finanzzustände oder Spielregeln verändert.

## Geänderte Dateien

- `prototype/v3/run.js` – reine Projektionsergebnisse in die Makroübersicht rendern.
- `prototype/v3/run.css` – responsive Makro-Projektionskarten.
- `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – neutrale, aktive Fixture-, Escaping-, Nichtmutations- und D-0169-Regression.
- `docs/simulation/a05-t0063-macro-impact-ui-cp0379.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0379.md` – CP-Entwurf.

Alle Änderungen liegen ausschließlich im zugewiesenen Paket. Keine Datei unter `sources/` oder Repositorydatei außerhalb des Pakets wurde geändert.

## Prüfungen

Mit Exitcode 0 bestanden:

- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – echte Shared-Run-Projektionen L2/L3/L6/L4, neutraler Standardlauf, Herkunft, Lag, pending, Escaping, D-0169 und Run-/Finance-Nichtmutation.
- `node prototype/v3/a05-t0069-run-ui-regressions.mjs` – A05 Run UI.
- `node prototype/v3/a05-t0064-ui-regressions.mjs` – statischer Run-UI-Vertrag und responsive Einstiegspunkte.
- `node prototype/v3/a05-t0063-macro-regressions.mjs` – A05 Makrodashboard.
- `node prototype/v3-run-macro-fixture-regressions.mjs`.
- `node prototype/v3-run-operating-impact-regressions.mjs`.
- `node prototype/v3-run-orchestrator-regressions.mjs`.
- `node prototype/v3-macro-trade-impact-regressions.mjs`.
- `node prototype/v3-macro-policy-impact-regressions.mjs`.
- `node prototype/v3-business-cost-plan-index-regressions.mjs`.
- `node prototype/v3-finance-runtime-regressions.mjs`.
- `node --check` für `prototype/v3/run.js` und `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs`.
- Whitespace-Scan der drei geänderten Code-/CSS-/Testdateien.

## Nachweisrollen und Grenzen

- **Ausführung:** A05; alle aufgeführten Regressionen und Syntax-/Whitespaceprüfungen PASS.
- **Fachreview:** nicht ausgeführt; Fachverträge aus CP-0368/CP-0374 sowie Reviews CP-0369/CP-0373/CP-0377 berücksichtigt.
- **Unabhängige QA:** nicht ausgeführt; A09 adversarial UI review steht aus.
- **Browser-/Gerätetest:** nicht ausgeführt; liegt danach bei A12.
- **Git-Verifikation:** nicht verfügbar; das Paket besitzt kein `.git`. Kein Commit/Push.
- **Jahres-/Release-/Gesamtfreigabe:** nicht geprüft oder behauptet; T-0063/T-0069 bleiben IN_PROGRESS.
- **MRO:** weiterhin unverbindlicher Indikator bzw. Quote; die Anzeige verleiht keinen Kreditstatus.

**Nächster Schritt:** A01 übernimmt Bericht und Paketänderungen; danach A09 adversarial UI review und anschließend A12 Browser-/Geräte-Playtest.
