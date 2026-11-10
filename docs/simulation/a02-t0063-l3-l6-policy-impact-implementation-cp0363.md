# A02-Bericht – T-0063 L3/L6 Politik-/Ressourcenwirkung (CP-0363)

**Status:** Umsetzung abgeschlossen; A03-Fachreview und A09-Adversarialreview ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063, Anschluss T-0065/T-0069
**Profil:** gemeinsamer V3-Run; keine Änderung an V1/V2
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragefaktor
**Vorgänger:** CP-0351–CP-0362, insbesondere L0/L1-Reviews CP-0361/0362 und A03-Dokumentreview CP-0354/0356

## Ergebnis und Umfang

Im V3-Run gibt es nun eine pure, aus der validierten Makroereignishistorie reproduzierbare Projektion für sieben nichtmonetäre Politikkanäle: `fiscal`, `growth`, `tariff`, `labor_market`, `environmental`, `demand_oriented` und `supply_oriented`. `getRunProjection()` liefert das Feld `macroPolicyImpact`; es gibt keine neue UI-Darstellung.

Die Auswertung greift nur auf gespeicherte Makroereignisse mit wirksamer Periode zu. Fehlende numerische `firmExposureFactor`, fehlende Scope-/Adoptionsreferenz oder fehlendes numerisches `delta` bewirken Neutralität. Wiederholte Beiträge mit gleicher `effectGroupId` und Zielgröße werden unterdrückt; bereits als Duplikat markierte Ereignisse bleiben ausgeschlossen. Das Ergebnis trägt Run-/Scenario-Identität, Modell- und Parametersatzversion, Quelle/Vintage soweit gespeichert, beobachtete und wirksame Periode, Lag, Scope, Einheit, `before`/`after`, `accountingClass: information_plan`, `directFinanceEffect: false` und `actualStateChanged: false`.

| Kanal | Ausschließliche Projektionsgröße | synthetische Begrenzung / Scope-Gate |
|---|---|---|
| Fiskalpolitik | Index passender öffentlicher Ausschreibungschancen | ±2 % je Ereignis; öffentliche Segmentreferenz erforderlich |
| Wachstumspolitik | langfristiger Kapazitätspotenzialindex | bis +2 %; nur mit Adoptionsreferenz; keine reale Kapazität |
| Tarifpolitik | künftiger Lohnplanindex | ±2 % je Ereignis; Scope künftiger/erfasster Beschäftigter erforderlich |
| Arbeitsmarktpolitik | Kandidatenverfügbarkeitsindex | ±5 % je Ereignis; Skillreferenz erforderlich |
| Umweltpolitik | Prozessressourcenintensitätsindex | ±2 % je Ereignis; Adoptions- und Anlagenreferenz erforderlich |
| Nachfrageorientierte Politik | Segmentanteilsverschiebung | ±5 Prozentpunkte; D-0169-Gesamtzahl bleibt unverändert |
| Angebotsorientierte Politik | Ressourcenbedarf je Einheit | bis −2 %; nur mit Adoptionsreferenz |

Dies sind offengelegte synthetische Szenariobegrenzungen nach dem A02-Wirkungsvertrag, keine empirischen Koeffizienten, Branchenwerte oder Rechtsfolgen. Wachstumspotenzial bleibt von realer Kapazität getrennt; Tarif bleibt von bestehenden Verträgen und Istlohn getrennt; Arbeitsmarkt bleibt von tatsächlicher Einstellung/Qualifizierung getrennt; Umwelt- und Angebotskanal ändern weder Istressourcen noch Produktivitäts-/Kostenbuchungen. Nachfragepolitik verschiebt nur eine geplante Segmentchance und verändert weder D-0169-Anfragenzahl noch Auftrag, Umsatz oder Zahlung.

MRO/Geldpolitik, FX, Inflation/Business-Cost-Index und Lieferkettenpfade sind nicht Teil dieser Implementierung. Diese Projektion stapelt keine Beiträge mit CPI-/FX-/Tarifkomponenten; die isolierte L3/L6-Schnittstelle erzeugt keine BAB-, Preis-, Bestands-, Kosten-, Rechnungs-, Cash- oder Ledgerwirkung. Es erfolgen keine Steuer-/Förderbuchung, automatische Einstellung, Lohn-/Vertragsänderung oder tatsächliche Kapazitäts-, Material-, Energie- oder Inventarmutation. Makroereignisse und Projektionen bleiben nichtbuchend.

## Geänderte Dateien

- `prototype/v3-macro-policy-impact.js` – versionierte, pure Projektionsfunktion und Kanalkontrakte.
- `prototype/v3/run.js` – Einbindung von `macroPolicyImpact` in die bestehende Shared-Run-Projektion; keine UI-Änderung.
- `prototype/v3-macro-policy-impact-regressions.mjs` – Regressionen für sieben Kanäle.
- `docs/simulation/a02-t0063-l3-l6-policy-impact-implementation-cp0363.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0363.md` – Checkpoint-Entwurf.

## Tests und Artefaktnachweis

Im Stagingpaket liefen mit Exitcode 0:

- `node --check prototype/v3/run.js`
- `node --check prototype/v3-macro-policy-impact.js`
- `node prototype/v3-macro-policy-impact-regressions.mjs` – sieben Kanäle, Neutralität bei fehlender/Null-Exposition und fehlendem Scope, Richtungspaare, synthetische Kappung, Verzögerung, Deduplizierung, Replay/Restore, Shared-Run-Projektion und Finanzzustands-Nichtmutation.
- `node prototype/v3-run-operating-impact-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-run-macro-fixture-regressions.mjs`
- `node prototype/v3-macro-demand-channel-regressions.mjs`
- `node prototype/v3-finance-runtime-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`

Whitespaceprüfung der drei geänderten Runtime-/Regressionsdateien: PASS, keine Zeilen mit nachgestellten Leerzeichen/Tabs. SHA-256:

- `prototype/v3/run.js`: `D7042D08ADD980C71471BB78F9B558063B427170FA158791B1D76D39F8D6E809`
- `prototype/v3-macro-policy-impact.js`: `4BA1A222DDA68BB4E2E28A7B22653F20ECFCE0518BE28D670610274C7A47B418`
- `prototype/v3-macro-policy-impact-regressions.mjs`: `C0D078A0F9C0916B0316401ACDA4BB3EDB28852DF9E0B511526552C64925C392`

## Reviews, QA und Grenze

- **Ausgeführt von:** A02; Code- und Regressionstests im bereitgestellten Stagingpaket.
- **Fachreview:** A03 noch nicht ausgeführt; angefordert.
- **Unabhängige QA:** A09 noch nicht ausgeführt; nach A03-Review angefordert.
- **Browser-/Gerätetest:** nicht ausgeführt; UI blieb unverändert.
- **Jahres-/Multipfadlauf:** nicht ausgeführt; die gezielten Modell-/Run-/Finanzregressionen decken diesen begrenzten Ableitungspfad ab.
- **Git:** Stagingpaket ohne `.git`; Git-Status, Diff, Commit und Push nicht verfügbar und nicht ausgeführt. Keine Änderung außerhalb des Stagingpakets.
- **Schema/Architektur:** keine Änderung oder Freigabe.

**Grenze:** Die vorhandene Run-Makrofixture setzt derzeit keine numerischen `firmExposureFactor`- oder Scope-/Adoptionsreferenzen für diese Kanäle; ihr Ergebnis bleibt daher neutral. Aktive Wirkungen benötigen diese expliziten, versionierten Szenarioinputs. Eine nächste Übergabe muss diese Inputbelegung pro Kanal vorsehen, wenn Wirkungen im Produktlauf sichtbar werden sollen. Die Regressionen belegen die Projektion mit expliziten synthetischen Inputs, nicht deren aktuelle Befüllung durch das V3-Produktprofil.

**Nächster Schritt:** A03 read-only Fachreview der Finanz-/Planungsgrenze; anschließend A09 adversariale Prüfung von Exposure, Scope, Duplikaten, zeitlicher Aktivierung und unverändertem Gesamtanfrage-/Finanzzustand. T-0063 bleibt IN_PROGRESS bis zu den vereinbarten Folgegates.
