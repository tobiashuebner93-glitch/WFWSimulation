# A09 – T-0063 Makro-Projektionsanzeige: adversarial UI-Review (CP-0380)

**Ergebnis: NONPASS.** Zwei konkrete UI-Befunde verhindern den begrenzten Makro-UI-Abschluss: unbeschränkte Kartenerzeugung bei gültigem Shared-Run-Input und eine pauschale „synthetisch“-Kennzeichnung trotz beobachteter L4-Quellen. Der funktionale FX-/Policy-/L4-Projektionsinhalt besteht seine begrenzten Gates.

**Datum:** 2026-11-01
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / T-0063, Anschluss T-0065/T-0066/T-0067/T-0069
**Entscheidungen:** D-0161–D-0169
**Vorgänger:** CP-0378/0379; L2/L3-L6/L4-Fachverträge und Reviews CP-0355, CP-0368/0369/0372/0373, CP-0374/0375/0376/0377/0378
**Snapshot:** `a05-macro-impact-ui-cp0379`, laut Auftrag zentrale UI-/Test-/Governance-Dateien bytegleich zum Repository. Paket ohne `.git`.

## Preflight und Grenzen

AGENTS, Agentenstruktur/Rechte, MG-002-Ziele, Ticketboard, Collaboration State, D-0161–D-0169, CP-0378/0379 und A05-Bericht sowie L2/L3-L6/L4-Verträge und Fach-/QA-Reviews wurden gelesen. CP-0380 und Bericht waren vor Erstellung nicht vorhanden. Der Repositoryvergleich beruht auf dem A01-Hinweis für die kritischen Dateien; Gitstatus/Branch/HEAD/Diff wurden in diesem Paket ohne `.git` nicht selbst verifiziert. Keine Codeänderung. Browser/Device wurden nicht ausgeführt.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Quelle der Projektionen / Rendererberechnung | **PASS** | `renderMacroSummary()` erhält Projektion als Argument; `getRunProjection()` bündelt die drei tatsächlichen Projektoren. Der Renderer leitet keine Makro-/Finanzformeln ab; Formatierung ist reine Anzeige. Neutrale Standardläufe zeigen vor dem ersten Snapshot „Keine aktive Exposition/keine Projektionswirkung“. |
| Plan-/Pending-/Provenienzkennzeichnung | **PASS mit Befund unten** | Einzelkarten zeigen Status, Periode, Lag, Scope, Quelle und Fixture/Modell; `pending` wird nicht als Null/Euro ausgegeben. L2/L3/L4-Karten bezeichnen erwartete Werte als Plan-/Projektionswerte. Pauschaltext sagt dennoch fälschlich, alle Indikatoren seien synthetisch; siehe NONPASS 2. |
| L4-Ansichten | **PASS** | Business Cost Index, WagePlanIndex und ProcurementPlanIndex werden als drei separate Ziele gerendert. Kein Rendererpfad addiert sie oder rechnet sie in Geld um. Die Oberfläche schließt Eurobetrag, Istkosten, BAB und Buchungswirkung ausdrücklich aus. |
| D-0169 / Nichtbuchung / MRO | **PASS** | UI und Tests weisen darauf hin, dass Segmentverschiebung die Gesamtanfragenzahl nicht ändert. Die neue Darstellung mutiert weder Run-/Finance-State noch Anfragen. MRO bleibt ausdrücklich unverbindlicher Indikator/Quote; kein Kreditstatus wird behauptet. |
| Escaping hostile Felder | **PASS** | A05-Test prüft Target, Scope, Quelle; zusätzlicher In-Memory-Test setzte hostile Werte für Ziel, Periode, Lag, Quelle, Fixture, ETA-Text und L2/L3/L4-Werte ein. HTML-Kontextausgabe blieb escaped; kein aktives Element erschien. `NaN`, `Infinity` und `undefined` in angezeigten Zahlen stürzten den Renderer nicht ab. |
| Große verschachtelte Contribution-Arrays | **PASS** | 20.000 Elemente in `componentContributions` wurden nicht in HTML ausgegeben; der Renderer traversiert diese Eigenschaft nicht. |
| **NONPASS 1 – unbeschränkte Effektzahl / Renderumfang** | **NONPASS** | Der Renderer rendert jedes Element aus `result.effects` ohne Mengenlimit, Paging oder Zusammenfassung. Repro über echte Projektionskette: Shared Run, Februarinput mit 5.000 gültigen offenen `international_supply.openShipments`, `getRunProjection()` erzeugte 5.000 ETA-Effekte; `renderMacroSummary()` lieferte **2.485.234 Zeichen (~2,4 MiB)** und 5.000 Karten. Dies ist keine Browser-Crashbehauptung; es belegt aber unbeschränkte, große DOM-Eingabe aus einem syntaktisch zulässigen Run. Projektion auf eine begrenzte Anzahl mit zugänglicher Restzusammenfassung oder gleichwertige Begrenzung vor Übergabe erforderlich. |
| **NONPASS 2 – synthetische Quellenbehauptung** | **NONPASS** | Abschnittseinleitung lautet stets „Nur nichtbuchende synthetische Indikatoren und erwartete Termine.“ Der L4-Projektor akzeptiert jedoch auch `sourceType: observed` mit `sourceRef` und Vintage/Snapshot/Beobachtungsperiode. In diesem gültigen Quellenpfad etikettiert die Karte korrekt allgemein als „Planwert“, aber die Einleitung behauptet weiter fälschlich, der ganze Inhalt sei synthetisch. Repro: `businessCostPlanIndexes.effects[0].sourceType='observed'` mit gültigen beobachteten Quellenfeldern; beim Render bleibt die pauschale „synthetische Indikatoren“-Aussage stehen. Einleitung muss quellenneutral werden oder bedingt nach tatsächlichen Kartenquellen unterscheiden. |
| Responsive CSS / Semantik / Tastatur | **PASS im statischen Code-/Testumfang, Browser offen** | Makrobereich ist `section` mit `aria-labelledby`, Karten sind `article`, Unterüberschriften `h4`. Grid fällt bis 700 px auf eine Spalte; `min-width:0`, `overflow-wrap:anywhere` und Wortumbruch begrenzen horizontale Intrinsicbreite. Die UI enthält in diesem Abschnitt keine interaktiven Elemente. Kein echter Viewport-/Keyboard-/Browser-Test durchgeführt. |

## Regressionen

Alle Befehle liefen im Snapshot mit Exitcode 0:

- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` — PASS
- `node prototype/v3/a05-t0069-run-ui-regressions.mjs` — PASS
- `node prototype/v3/a05-t0064-ui-regressions.mjs` — PASS
- `node prototype/v3/a05-t0063-macro-regressions.mjs` — PASS
- `node prototype/v3-run-macro-fixture-regressions.mjs` — PASS
- `node prototype/v3-run-operating-impact-regressions.mjs` — PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS
- `node prototype/v3-macro-trade-impact-regressions.mjs` — PASS
- `node prototype/v3-macro-policy-impact-regressions.mjs` — PASS
- `node prototype/v3-business-cost-plan-index-regressions.mjs` — PASS
- `node prototype/v3-finance-runtime-regressions.mjs` — PASS

Die zwei NONPASS-Befunde ergeben sich aus separaten A09-In-Memory-Proben und Codepfadprüfung; die A05-Suiten testen sie noch nicht.

## Abhilfe / Scope

A05 sollte Effektkarten mengenmäßig begrenzen bzw. zusammenfassen, ohne den Shared-Run-Projektor oder D-0169-Invariante zu ändern. Außerdem die Überschrift/Einleitung quellenneutral formulieren oder für alle sichtbaren Effekte den Quellenstatus wahrheitsgetreu aggregieren. Danach A09-Re-Review; A12-Browser-/Geräteprüfung erst nach bestandenem Re-Review.

Keine Markt-/Finanz-/Regeländerung, keine Browser-/Geräte-, Commit-/Push- oder Jahres-/Gesamtfreigabe. `.git` fehlt; kein Gitstatus/Diff/Commit/Push verifiziert.

## Ausgewählte SHA-256

- `prototype/v3/run.js`: `001B88C443D6EDF38D9A831B511FF1D4540C41460B328159405AC8EB79899842`
- `prototype/v3/run.css`: `50F01D52855CCEC9AE2A79950911C28490A619388733894BB85D11336AB05F3A`
- `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs`: `5B608B0DADB60BC1F267B6BD28116F2395FC37F417D06B564C023B58CF0C2DA2`

Hashes identifizieren ausgewählte Paketdateien, keinen Git-Commit oder vollständigen Tree.
