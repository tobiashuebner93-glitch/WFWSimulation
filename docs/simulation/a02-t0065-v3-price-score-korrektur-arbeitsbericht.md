# A02-Arbeitsbericht – T-0065 V3-Referenzpreiswertung

**Status:** Korrektur und Regression abgeschlossen; unabhängiges A09-Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2  
**Tickets:** T-0065 / T-0069  
**Vorgänger:** CP-0321 (ENTWURF)  
**Profil:** V3 gemeinsamer Run, operativer Start 2027-01-04  
**Maßgebliche Entscheidungen:** D-0159, D-0162, D-0165–D-0168; V2 bleibt abgenommen und unverändert.

## Preflight

Gelesen wurden AGENTS.md, Agentenstruktur und Rechte, Goals, Ticket Board (nur MG-002/aktive SLG), Collaboration State, Decision Log, CP-0321, T-0065-Marktmodell, V3-Marktsimulation und bestehende Regressionen. Der Checkout ist main @ 8b72b7e35fd7bbd8d967655d0a97e0a01b93266 mit umfangreichen lokalen Arbeiten. Die beiden Marktdateien waren bereits untracked; sie wurden nicht verworfen oder durch historische Dateien ersetzt. Keine Schema-, Architektur-, Accounting-, UI- oder V1/V2-Datei wurde geändert.

## Befund

Der bisherige Zuschlag normalisierte den Preis relativ zum Minimum und Maximum der gerade eingereichten Angebote. War der Spieler das günstigste Angebot, erhielten Spieler und günstigster Wettbewerber beide priceScore = 1. In den bestätigten Run-Fixtures hat Wettbewerber A gleichzeitig höhere Reputation und höheren Segment-Fit als der Spieler. Bei small ist der Qualitätsvorsprung 0,02 Gesamtpunkte; medium 0,0325; large 0,065. Damit konnte der Spieler auch mit dem günstigsten Angebot nicht gewinnen. Niedrigere Angebote wurden außerdem durch den Maximalwert von 1 nicht zusätzlich differenziert.

Alle Einladungen bleiben kapazitäts-/fähigkeitsgebunden. Der Fehler lag in der Zuschlagswertung, nicht in der Einladung. Die Anforderung, dass Preis und Ruf die Kundenwahl beeinflussen, war mit den Fixturewerten nicht ausreichend spielbar umgesetzt.

## Änderung

Die Preiswertung orientiert sich nun direkt am expliziten Anfrage-Referenzpreis:

priceScore = 2 × referencePrice / (referencePrice + netOfferPrice)

Der Preisanteil bleibt mit den vorhandenen segmentbezogenen decisionWeights gewichtet. Reputation und Segment-Fit bleiben separate Kriterien. Der Score ist glatt, reproduzierbar und liegt bei zulässigen nichtnegativen Preisen zwischen 0 und 2; er hängt nicht davon ab, welche anderen Gebote zufällig mit eingereicht wurden. Es wurden keine Gewichte, Preise, Seedwerte, Einladungsschwellen oder Fixtureprofile geändert. Die Formel ist eine V3-Spielmodellkonvention, keine empirische Preiselastizität oder Branchenkalibrierung.

Beispiele im small-Fixture (Referenz 110 €; Segmentgewichte Preis 0,60 / Ruf 0,20 / Fit 0,20):

- Spielerpreis 110 €, Qualität wie bisher: Wettbewerber A gewinnt. Der höhere Ruf und Fit bleibt entscheidungsrelevant.
- Spielerpreis 80 €, gleiche Spielerqualität: Spieler gewinnt, weil die deutliche Preisdifferenz den kleineren Qualitätsvorsprung überwiegt.
- Spielerpreis 110 €, Spieler-Ruf und Fit jeweils 1,0: Spieler gewinnt trotz des höheren Wettbewerber-A-Angebots. Qualitätsfaktoren bleiben wirksam.
- Spielerpreis 0,00 € gegen einen auf Reputation/Fit 1,0 gesetzten Wettbewerber-A mit 0,01 €: Wettbewerber A gewinnt. Ein Preis allein ist damit nicht immer ausschlaggebend.

## Geänderte Dateien

- prototype/v3-market-simulation.js
- prototype/v3-market-simulation-regressions.mjs
- docs/simulation/a02-t0065-v3-price-score-korrektur-arbeitsbericht.md

## Tests und Reviews

- node --check prototype/v3-market-simulation.js — PASS.
- node --check prototype/v3-market-simulation-regressions.mjs — PASS.
- node prototype/v3-market-simulation-regressions.mjs — PASS; Referenzpreis-/Preis-led-/Qualitäts-led-Fälle, Qualitätsvorsprung bei nahezu gleichem Extrempreis, Wochenfluss, Replays und Snapshots.
- node prototype/v3-run-orchestrator-regressions.mjs — PASS.
- node prototype/a05-t0069-run-ui-regressions.mjs — PASS.
- A02-Eigenreview — PASS im Marktmodellumfang.
- Unabhängiges A09-Review — ausstehend; an A01 zur Beauftragung übergeben.
- Browser-/Geräte-Smoke nach der Änderung — nicht ausgeführt; A01 soll die drei zuvor abgelehnten UI-Angebote mit aktuellem Code erneut spielen.
- Gezieltes git diff --check für Marktcode, Regression und Bericht — Exit 0.
- Git-Status/Diff für die Marktdateien wurde beim Preflight geprüft; sie waren im bestehenden Arbeitsbaum untracked. Keine Änderung verworfen. Kein Commit oder Push.

## Ergebnis und offene Punkte

Die Regression belegt mindestens einen Zuschlag mit ausreichendem Preisvorteil; sie belegt keine empirische Kalibrierung oder dass die Spielökonomie schon wirtschaftlich ausgewogen ist. T-0065 bleibt IN_PROGRESS bis A09 Review, kontrollierter Browser-Retest sowie T-0063/T-0067- und Gesamtjahresintegration. T-0069 bleibt IN_PROGRESS. Ein möglicher Folgeauftrag an A09: adversarial review der neuen Scorebandbreite, Grenzpreise, Gewichte, Determinismus und V3-Run-Auswirkung. A01 führt danach den bisherigen Browser-Smoke fort.

Keine Rückfrage an A01/Nutzer erforderlich. Keine neue Produktentscheidung oder externe Rechtsbehauptung.
