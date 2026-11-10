# A03-Finanzreview T-0063 – finale Makro-Runtime

**STATUS:** NONPASS für Perioden-/Vertragsdatenvalidierung; Finanz-Nichtmutation PASS  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A03 – ACCOUNTING_FINANCE  
**MASTER GOAL / SECOND-LEVEL GOAL:** MG-002 / SLG-002.2 / SLG-002.5  
**TICKET:** T-0063 (Reviewbeitrag für T-0063/T-0069-Finanzgate)  
**BEZUG:** D-0100–D-0102, D-0127/D-0129, D-0161–D-0164; CP-0279 und CP-0280 (ENTWURF)

## Preflight und Revisionsprovenienz

Gelesen wurden `AGENTS.md`, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279 und CP-0280 sowie A02s Makrovertrag/Arbeitsbericht, A03s Makro-Finanzübergabe, der A02-Integrationsvertrag und A09s finaler Makro-Re-Review. Für die finanzielle Sicht maßgeblich sind insbesondere D-0161 bis D-0164: aktuelle Rechtslage unabhängig vom Simulationsjahr; V3-Kalkulations-/Periodengrenzen; MRO-Zukunftspfad bei fehlenden realen EZB-Werten ohne Reset bestehender Verträge; und abgegrenzter Rechtformumfang. Keine davon autorisiert Makroindikator-bedingte Buchungen.

Read-only Git-Prüfung: HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`. Der Arbeitsbaum war bereits umfangreich geändert: getrackte Änderungen u. a. in Governance, Finanz-/Simulationsspezifikation und `prototype/engine.js`; viele ungetrackte T-0063–T-0068-Berichte, CP-0274–0280-Entwürfe und V3-Dateien. Dieser Bericht ließ alle vorgefundenen Änderungen unberührt. Keine Commit-/Push-Aktion.

## Geprüfte Finanzgrenzen

`runV3MacroMonth()` ist eine reine, isolierte Monatsfunktion. Sie validiert Input und Makrozustand, erstellt einen geklonten Folgezustand und gibt eine indikative Finanzierungsübergabe zurück. Sie importiert oder mutiert weder A03-Finanzzustand noch Cash, Forderungen, Verbindlichkeiten, Ledger, Materialbestände, Personal, bestehende Kreditverträge oder V1-/V2-Spielstände. Der Snapshot setzt alle Merkmale in `financeEffects` auf `false`; die Quote setzt `contractId` und `contractVersion` auf `null` sowie `createsFinancialEvent`/`createsLedgerEffect` auf `false`. Ein Makroevent ist damit keine Buchungsquelle.

MRO kann nur aus einem vorliegenden, laut `effectiveFrom` wirksamen beobachteten MRO-Pfad oder aus einer expliziten synthetischen Zukunftsregel mit verfügbarer SPI-Jahresinflation hervorgehen. Die synthetische Ausgabe ist als `synthetic_scenario`/`synthetic_uncalibrated` markiert und führt Formel, Lag, Quellenreferenz, Parameterkennung und Unsicherheitsband mit. Ohne beobachteten oder synthetischen Wert bleibt MRO `unavailable`; es gibt dann keine Finanzierungsquote. D-0163-konform wird kein bestehender Vertrag automatisch zurückgesetzt. Das bestätigt die Finanz-Nichtmutationsgrenze, nicht die empirische Kalibrierung des Szenariopfads.

Makrosnapshots sind fortlaufend und strikt nach Kalendermonat; Duplikate desselben Monats mit identischer Eingabe liefern denselben Snapshot ohne zweiten Zustandsfortschritt. Lags werden in Kalendermonaten aktiviert. D-0162s operative Finanzkennzahlen-/Stichtagsperioden werden nicht durch diesen Makrovertrag umdefiniert; der Makro-Snapshot selbst bucht nichts zum Monatsende.

## Befunde

### F-01 – Beobachtungsdaten werden vor ihrer Veröffentlichung in frühere Monats-Snapshots übernommen (NONPASS)

`validateInput()` prüft bei beobachteten SPI-/Aktivitätswerten, ob Beobachtungsperiode, Veröffentlichungsdatum und Datenstand vorhanden und formal gültig sind. Es prüft nicht, ob `publishedAt` am Snapshotstichtag bereits erreicht ist. Die Regression setzt ausdrücklich einen beobachteten Aktivitätswert für `2027-01` mit `publishedAt: 2027-02-15` in den Januar-Input und erwartet Annahme (`prototype/v3-macro-simulation-regressions.mjs`, Zeilen 186–191). Der Januar-Snapshot hat `currentDate` 2027-01-31 (`v3-macro-simulation.js`, Zeilen 290–302); damit wird im Januar bereits ein erst im Februar veröffentlichter Stand verwendet.

Das widerspricht A02s Periodenvertrag, wonach ein verspätet publizierter Beobachtungswert erst ab Publikations-/Wirksamkeitsdatum übernommen und nicht rückwirkend als Monatsereignis verwendet wird (`a02-t0063-v3-makro-simulationsvertrag.md`, Zeilen 32–35). Dieselbe Verfügbarkeitsprüfung ist für beobachtete SPI-Komponenten und den MRO-Pfad erforderlich, weil der synthetische MRO auf der SPI-Jahresinflation aufbauen kann. Rein finanziell entsteht weiterhin keine Buchung; der Makro-/MRO-Handoff kann aber einen für den damaligen Simulationsmonat noch nicht verfügbaren Stand enthalten. A02 muss den As-of-/Aktivierungszeitpunkt gegen den Snapshotstichtag prüfen und eine Regression für verspätete Veröffentlichung ergänzen. A03 trifft dazu keine Quellen- oder Simulationsregel.

### F-02 – Angebotsgültigkeit der indikativen Kreditkondition wird nicht ausgewertet (NONPASS)

`makeFinancingHandoff()` verlangt `validFrom` und `validUntil` nur als nichtleere Strings und kopiert sie in die Ausgabe (`v3-macro-simulation.js`, Zeilen 240–251). Es validiert weder Datumsformat/Reihenfolge noch, ob die Snapshot-/Anfrageperiode in das Gültigkeitsfenster fällt. Die Ausgabe hat stets `status: 'indicative'`; ein Ablaufpfad für den im Integrationsvertrag vorgesehenen Status `expired` ist in der Funktion nicht erkennbar. Deshalb kann auch eine außerhalb ihres Fensters liegende bzw. rückwärts datierte Quote weiter als indikativ erscheinen. Das erzeugt keinen Finanzwert oder Vertrag, ist aber ein nicht verlässlicher Finanzierungs-/Vertragsdaten-Handoff. A02 sollte Datums-/Fenstersemantik mit dem Integrationsvertrag synchronisieren und Grenzfälle für vor, innerhalb und nach der Gültigkeit testen.

### F-03 – ISO-Wirksamkeitsdaten werden nur bis zur Monatsebene geprüft (NONPASS)

Der Vertrag erlaubt `effectiveFrom` entweder als `YYYY-MM` oder als valides ISO-Datum `YYYY-MM-DD`. Der Runtime-Pfad `effectivePeriod()` schneidet `effectiveFrom` auf die ersten sieben Zeichen und prüft nur `YYYY-MM` (`v3-macro-simulation.js`, Zeilen 175–180). `assertSource()` verlangt bei externen/Policy-Inputs lediglich einen nichtleeren String; beim beobachteten MRO wird ebenfalls nur dessen Monatspräfix gegen den Snapshotmonat verglichen (`v3-macro-simulation.js`, Zeilen 41–49 und 224–229). Ein unmöglicher Tag wie `2027-02-31` kann damit als `2027-02` wirksam werden, obwohl der Vertrag ein valides ISO-Datum fordert. Der bisherige A09-Datums-PASS deckt laut Report eine ungültige Wirksamkeitsperiode ab, belegt aber nicht die ungültige Tageskomponente. A02 sollte die erlaubte Syntax vollständig validieren und Tests für gültiges `YYYY-MM-DD`, ungültigen Monat/Tag und Monatsübergang ergänzen.

## Testnachweise

| Gate | Ergebnis | Beleg |
|---|---|---|
| Makro-/SPI-Replay, Quellen- und State-Nichtmutation | PASS | `node prototype/v3-macro-simulation-regressions.mjs` → `V3 macro simulation regressions: PASS`; umfasst identischen Replay, Monatskontiguität, Beobachtungs-/synthetische Provenienz, MRO-Formelpfade, Nichtmutation und `financeEffects=false`. |
| SPI-Berechnung und Gewichte | PASS | `node prototype/v3-price-index-regressions.mjs` → `V3 SPI COICOP12 regressions: PASS`. |
| Keine Finanzwirkung/Altvertragsmutation durch Quote | PASS (isolierter Runtime-Vertrag) | Makromodul hat keine Finance-/App-Integration; im Snapshot bleiben Cash, Ledger, bestehende Verträge etc. als Finanzwirkung `false`; Quote ohne Vertrags-ID und Finanzereignis. |
| Beobachtungs-As-of zum Simulationsmonat | NONPASS | Bestehende Regression akzeptiert Januar-Input mit Veröffentlichung 15. Februar, siehe F-01. |
| Kreditangebot gültig/abgelaufen | NONPASS | Der Quote-Pfad validiert/gated `validFrom`/`validUntil` nicht, siehe F-02. |
| Vollständige ISO-Wirksamkeitsdaten | NONPASS | Runtime schneidet ISO-Tage auf `YYYY-MM` ab; kein Test für ungültigen Kalendertag, siehe F-03. |
| V3-UI-/Unternehmensintegration oder Jahres-Gate | OFFEN / nicht ausgeführt | `app.js` und `prototype/v3/` importieren `v3-macro-simulation.js` nicht; A09 finaler Re-Review begrenzt PASS auf isolierte Runtime. Kein integrierter V3-Jahres-/Browser-Test in diesem Auftrag. |
| Git-Diff / Commitbindung | nicht ausgeführt in meinem Review | HEAD/Status read-only dokumentiert; `git diff --check` für den gesamten parallelen Arbeitsbaum nicht Bestandteil dieser Finanz-Fachprüfung. |

## Ergebnis und Übergabe

**A03-Finanzwirkung: PASS. T-0063-Finanz-/Perioden-Handoff insgesamt: NONPASS**, bis die As-of-Verfügbarkeit beobachteter Werte, Kreditquote-Gültigkeit und vollständige ISO-Wirksamkeitsdaten korrigiert und unabhängig regressionsgeprüft sind. Kein Finanzbuchungs-/Ledgerkonflikt wurde gefunden; die drei Befunde betreffen die zeitliche Gültigkeit der an Makro/Finanzierung übergebenen Daten. D-0161 bis D-0164 werden nicht erweitert oder geändert. Keine neue Nutzerentscheidung ist aus diesem Review abzuleiten.

**Ausführung:** A03 read-only Finanzreview.  
**Fachreview:** A03 abgeschlossen; drei konkrete Runtime-Gaps oben.  
**Unabhängige QA:** A09s isolierter Makro-Re-Review gelesen; er ersetzt nicht die hier neu festgestellten As-of-/Quote-/ISO-Tagesfälle.  
**Browser-/Gerätetest:** nicht ausgeführt.  
**Git-Verifikation:** HEAD und Status abgefragt; Diff-/Whitespace-Check nicht ausgeführt.  
**Commit/Push:** nicht ausgeführt.  
**Nächster Schritt:** A01 beauftragt A02 mit F-01 bis F-03, danach A09 mit gezieltem unabhängigen Re-Review. A03 kann nach Lieferung den Finanz-Handoff erneut fachlich prüfen.
