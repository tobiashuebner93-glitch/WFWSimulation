# A09 finaler T-0065-Stichproben-/Größenklassen-Re-Review

**STATUS:** PASS für A02-Runtime und dauerhafte Regressionen; A05-UI-Abgleich ist separat weiterhin offen
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0065 (gezieltes A02-Abnahmegate)
**GIT-BASIS:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; Working Tree mit parallelen lokalen Änderungen.

## Preflight und Umfang

Fresh preflight: `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280, D-0159–D-0164, aktueller T-0065-Eintrag und A02-Runtime, Fixtures, Regressionen und Bericht sowie A08-Provenienzreview und vorherige A09-Berichte. HEAD/Status geprüft; vorhandene parallele Änderungen erhalten. A05 `prototype/v3/market.js` und DOM-Regression wurden nur lesend geprüft. Diese QA hat keine Produktdatei verändert; nur dieser Bericht wurde neu angelegt. Kein Commit/Push.

## Prüfergebnis

| Gate | Ergebnis | Evidenz |
|---|---|---|
| Dauerhafte Drei-Klassen-/Drei-Segment-Fixtures | **PASS** | A02-Testdaten führen `small`, `medium`, `large` in Segmenten, Firm-Fit, Kapazitäts-/Referenzpreisen, Konkurrenzpreisen und Bedarfsvorlagen. Dauerhafte Assertions belegen alle drei Größen und Segmente. Werte sind als synthetische Fixtures, nicht empirische Marktwerte, gekennzeichnet. |
| Profilmindestwert kleiner als 3 | **PASS** | Profilvalidator verlangt `minimumMonthlyCompetitorSample >= 3`. Permanente Regression bestätigt, dass Konfiguration `2` eine Exception mit Mindestschwellenhinweis erzeugt. |
| Monatsreport bei n=0 | **PASS, leeres Ergebnis** | Unabhängige Probe ohne Konkurrenzgebote für eine Größe gibt für den Monat `[]` zurück; es gibt keine Zeile und keinen Mittelwert zu leaken. |
| Monatsreport bei n=1 und n=2 | **PASS, Mittelwert verborgen** | Unabhängige Proben liefern `meanCompetitorNetPriceCents=null`, `suppressed=true`, bei sichtbarem n=1 bzw. n=2. A02-Permanentregression prüft n=2 ausdrücklich. |
| Monatsreport genau bei n=3 | **PASS** | A02-Permanentregression testet genau drei eindeutige Konkurrenzgebote. Zusatzprobe: n=3, `suppressed=false`, Mittelwert 10.100 Cent; Rechenwert entspricht (10.000 + 10.100 + 10.200)/3. |
| Wiederholte `offerId`-Zeile | **PASS** | A02-Permanentregression dupliziert eine Berichtseingabe und hält n bei 3. Zusatzprobe bestätigt, dass Duplikat weder n noch Mittelwert ändert. |
| Drei Klassen als getrennte Aggregate | **PASS** | Dauerhafte Regression erwartet `large`, `medium`, `small` separat. Zusatzprobe erhielt je Klasse n=3 und Mittel 30.100, 20.100 bzw. 10.100 Cent. |
| Keine rückwärts auflösbaren Identitäten/Einzelpreise im Player-/Report-View | **PASS im geprüften Output** | Zusatzprobe serialisiert beide API-Views. Spielerprojektion enthält keine Konkurrenten-IDs, Konkurrenz-Einzelpreise oder Konkurrenz-Offer-IDs; Monatsreport enthält nur Aggregatfelder ohne `firmId` oder `offerId`. A08 weist zutreffend darauf hin, dass eine Schwelle von drei keine allgemeine Anonymitäts-/Reidentifikationsgarantie ist. |
| Synthetische Provenienz | **PASS für Kennzeichnung, keine Marktkalibrierung** | A02-Fixture-Kommentare und Arbeits-/Rahmenbericht bezeichnen Marktgewichte und Preise als synthetisch; Runtime verlangt explizite synthetische Konkurrenzpreise. A08 bestätigt Claim-Transparenz, aber keine empirische SME-/Werkstatt-Preis-Kalibrierung. Daher kein Realismusclaim abgeleitet. |
| Restore-Historie / Replay | **PASS** | Permanente Regression und erneute unabhängige Probe löschen Wochenplanereignis plus Event-ID-Index bei erhaltenem Wochen-/Inquiry-Zustand. Replay wird mit `invalid_market_state` abgewiesen und mutiert den Caller-Zustand nicht. Gültiges gespeichertes Replay bleibt `duplicate=true` ohne Duplikat. |
| A05-Ausrichtung | **OFFEN, separat** | Beim Preflight blieb A05-Fixture auf `minimumMonthlyCompetitorSample: 2` und `small`/`large` beschränkt; der neue A05-Abgleich war im Checkout noch nicht sichtbar. Der A02-Scope ist PASS, aber A05 muss den Floor 3 und drei Größen/Segmente synchronisieren und seine DOM-Regression erneut bestehen lassen. An A05-Code wurde nicht geschrieben. |

## Tests

- `node --check prototype/v3-market-simulation.js` – **PASS**.
- `node --check prototype/v3-market-simulation-regressions.mjs` – **PASS**.
- `node prototype/v3-market-simulation-regressions.mjs` – **PASS** (`V3 market simulation regressions: PASS`).
- `node prototype/v3-financial-calculation-regressions.mjs` – **PASS** (`V3 financial calculation regressions: PASS`).
- Zusatzproben n=0/1/2/3, Duplikat-Offer, drei Größen, Output-Leakage und Restore-Replay – **PASS**, ohne Dateien zu schreiben.
- `git diff --check` auf A02-Runtime, Regression und Arbeitsbericht – **Exit 0**.
- Browser-/Mobiltest – **nicht ausgeführt**; außerhalb dieses A02-only Reviews.

## Ergebnis an A01

A02s Stichprobenschwelle, Größen-/Segment-Fixtures, Berichtaggregation und Restore-/Replay-Invarianten bestehen den unabhängigen Re-Review. Der frühere A09-Befund, das A02-Permanentfixture decke nur zwei Größen ab, ist damit überholt.

T-0065 insgesamt ist dadurch nicht abgeschlossen: A05s Demo-/DOM-Fixture war bei dieser Bestandsaufnahme noch nicht an Mindeststichprobe 3 und drei Klassen angepasst. A08s empirische Marktpreis-Kalibrierung bleibt als eigenes fachliches Realismus-Gate offen. Keine Nutzerentscheidung erforderlich.
