# A08 – T-0065 Marktmodell: Provenienz- und Kalibrierungsreview

**STATUS:** Teilreview abgeschlossen; Provenienz-Transparenz PASS, empirische Kalibrierung und Schutz kleiner Preisstichproben NONPASS/offen  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A08 – RESEARCH  
**MASTER GOAL / SECOND-LEVEL GOAL:** MG-002 / SLG-002.2  
**TICKET:** T-0065 (Quellen-/Provenienzreview, kein Gesamtabschluss)  
**VORGÄNGER:** CP-0279; CP-0280 bleibt ENTWURF  
**MASSGEBLICHE ENTSCHEIDUNGEN:** D-0159–D-0164; für Marktvertrag insbesondere D-0162, für Umfang D-0159  
**REPOSITORY:** `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; `main`; HEAD `8b72b7e35fd7bbd8d967655d0d97e0a01b93266c`  
**DATUM:** 2026-10-31

## Auftrag und Grenzen

Geprüft wurden die Marktmodell-Parameter, Markt-/Konkurrenz- und Preisrealismus-Aussagen sowie Provenienz in A02 T-0065-Arbeitsrahmen und -Arbeitsbericht, `prototype/v3-market-simulation.js`, `prototype/v3/market.js` und A05-Marktansicht/-Regressionen, A03s T-0065-Finanzreview, A03s T-0067-Vertrag und der gemeinsame A02-Integrationsvertrag. Der Review bewertet Quellenstatus und Belegbarkeit, nicht die fachliche Freigabe der Marktregeln. Er ändert keine Produktregeln, Parameter, Runtime, UI, Datenmodell oder Finanzlogik und ist keine Rechts-, Produkt- oder Releasefreigabe.

## Preflight und Arbeitsbaum

Gelesen/geprüft: `AGENTS.md`, Agentenstruktur und Rechtekarte, `goals.md`, `ticket-board.md`, `collaboration-state.md`, `decision-log.md`, CP-0279, CP-0280-Entwurf, MG-002/V3, T-0065 sowie D-0159–D-0164. Für fachliche Abgrenzung: A02 T-0065-Arbeitsrahmen/-bericht und Integrationsvertrag, A03 T-0065-Finanzreview und T-0067-Kalkulations-/BAB-Vertrag, Runtime und A05-Markttestfixture. Die wesentlichen aktuellen Agentenänderungen lagen bereits lokal im gemeinsamen Working Tree. Sie wurden nicht verändert oder verworfen.

Branch/HEAD: `main`, `8b72b7e35fd7bbd8d967655d0d97e0a01b93266c`. Vor Review bestanden umfangreiche Änderungen und neue Dateien aus mehreren parallelen Aufgaben. Kein Commit oder Push ausgeführt.

## Gate-Ergebnisse

| Gate | Ergebnis | Evidenz und Grenze |
|---|---|---|
| Claim-/Provenienztransparenz | **PASS** | A02-Arbeitsrahmen sagt ausdrücklich „keine Marktprognose“ und erklärt synthetische Werte als Spielmodell. A02-Runtime verlangt Wettbewerberpreise und sämtliche Verhaltenparameter als explizite Profilinputs statt versteckter Konstanten. A05 kennzeichnet die Demo-Fixtures als synthetisch; UI meldet ein synthetisches Szenario. Es werden in diesen geprüften T-0065-Artefakten keine beobachteten Konkurrenzpreise oder empirisch geschätzten Zuschlagswahrscheinlichkeiten behauptet. |
| Nutzerentscheidung vs. Modellvertrag vs. synthetische Annahme | **PASS mit Abgrenzung** | D-0162 bindet V3-Nettopreis, Kosten-/BAB-Snapshot, Fixierung und Periodisierung. D-0159 grenzt den angenommenen Lernfragenkatalog/V2-Scope ab; es liefert keine Marktkoeffizienten. A02 bezeichnet Kriterien und Ablauffolge teils als Arbeitsvertrag/Fixture. Kein hier geprüftes Gewichts-, Preis- oder Wahrscheinlichkeitsprofil ist als Nutzerentscheidung belegt. Die konkreten Demo-Werte sind synthetische Testdaten, keine bestätigten Startwerte. |
| Öffentliche Quellenstütze der Preis-/Wettbewerbswerte | **NONPASS für empirische Kalibrierung; offen für V3-Realismus** | Für Referenzpreise, Konkurrenzpreise, Preisempfindlichkeit, Reputation-/Kapazitätsgewichte, Einladungs-Cutoff, Nachfragehäufigkeit oder Zuschlagsformel ist in den geprüften T-0065-Dateien keine direkte Marktquelle und kein beobachteter Datensatz hinterlegt. A02 selbst benennt die Kalibrierung als offen. A03s PASS beurteilt D-0162-Finanzschnittstelle und bestätigt ausdrücklich keine empirische Kalibrierung. Daher sind Code-Regressionen kein Beleg für deutsche Marktpreisrealität oder quantitativ realistische Zuschlagschancen. |
| Zahlen-/Parameterherkunft | **PASS als Fixture-Kennzeichnung; NONPASS als reale Kalibrierung** | `prototype/v3/market.js` enthält explizite, reproduzierbare Testwerte: Werktagsgewichte je 0,20; Einladungsgewichte Kapazität 0,25/Ruf 0,35/Segment-Fit 0,40; Mindestscore 0,20; max. 4 Einladungen; Anfragefenster 3–5 Kalendertage; Entscheidungsverzug 2 Kalendertage; Mindeststichprobe 2; Angebotsgewichte small 0,60/0,20/0,20 und large 0,40/0,25/0,35. Demo-Referenzpreise 110/550 €; synthetische Konkurrentengebote 100/500 € und 120/620 € für klein/groß. Diese werden im Fixture korrekt als Test-/Szenariowerte behandelt. Keine externe Quelle oder beobachtete Stichprobe belegt sie als Marktpreise, Verteilungen oder Produktdefault. Der A02-Integrationsvertrag nennt MARKET LOW/BASE/HIGH im Verhältnis 0,90/1,00/1,10 ausdrücklich Vergleichsinputs ohne Zuschlagswahrscheinlichkeit. |
| Segmentabdeckung im Demo | **NONPASS für Segment-Abnahmekriterium; kein Provenienzfehler** | Die geprüfte A05-Demo-Fixture enthält nur `small` und `large`, während A02s Rahmen für V3-03 mindestens drei Kundensegmente fordert. Die Fixture ist ein begrenzter UI-/Runtime-Test und kein Nachweis, dass der V3-Marktvertrag drei Segmente tatsächlich kalibriert oder abdeckt. Der dritte Konkurrenzdatensatz `ineligible` wird bei der Beispielanfrage wegen nicht passender `welding`-Fähigkeit ausgeschlossen; die beobachtete Zweiergruppe ist also in dieser Fixture erwartbar. |
| Konkurrenzmittel / Stichprobenschutz | **NONPASS als allgemeine Anonymitäts-/Privatsphärengarantie** | Runtime unterdrückt den Mittelwert nur, wenn `sampleCount < minimumMonthlyCompetitorSample`. Das Demo-Profil setzt den Mindestwert auf **2** und zeigt die Stichprobenzahl. Zwei Beobachtungen ergeben zusammen mit dem Mittelwert ihre exakte Summe; ist ein Wert anderweitig bekannt/erschließbar, ist der zweite rekonstruierbar. Bei wenigen wiederkehrenden simulierten Firmen und statischen, bekannten Fixture-Angeboten ist Re-Identifikation trivial. A09s frühere Regression verwendete separat Mindestwert 3 bei zwei Angeboten und prüfte Unterdrückung; das beweist den Codepfad, keine statistische Anonymität. Da es derzeit fiktive Daten sind, besteht kein reales personenbezogenes Datenleck; die UI-/Vertragsaussage, Einzelgebote seien nicht rückrechenbar, ist für geringe Gruppen jedoch stärker als die nachgewiesene Regel. |
| A03-Finanzschnittstelle | **PASS innerhalb enger Rolle** | A03 prüfte Netto-Cent, SimTAX-Abgrenzung, Snapshot-Freeze, Periodenzuordnung und fehlende Buchungswirkung. Sein Review markiert Marktparameter als explizite synthetische Inputs, belegt aber weder Branchenpreise noch Konkurrenzmodell-Kalibrierung. Kein Konflikt mit D-0162 gefunden. |
| A02/A03 gemeinsamer Makro-/Marktvertrag | **PASS als Herkunfts-/Annahmenvertrag; Integration offen** | Der Integrationsvertrag verlangt für Inputs Quelle/Annahme, Einheit, Beobachtungsperiode, Veröffentlichungsdatum, Wirksamkeitsdatum und Versionskennung. Für Markt-Testwerte gilt ausdrücklich synthetischer Szenariostatus. Die tatsächliche quantitative Kopplung Makro → Nachfrage/Markt bleibt laut A02 offen. |

## Geprüfte Quellen und Aussagegrenzen

Die Suche nach amtlichen Primärquellen ergab geeignete Aktivitätsindikatoren, aber keine Beobachtung individueller Preise für kleine CNC-/Lohnfertigungsangebote:

- Destatis beschreibt den monatlichen Auftragseingangsindex für das Verarbeitende Gewerbe als nominalen Wertindex bzw. preisbereinigten Volumenindex und als Frühindikator: [Erläuterungen zum Auftragseingangsindex](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Industrie-Verarbeitendes-Gewerbe/Methoden/Erlaeuterungen/auftragseingangsindex.html).
- Die amtliche GENESIS-Tabelle 42151-0002 führt monatliche Wertindizes des Auftragseingangs nach Absatzrichtung und Wirtschaftszweig: [GENESIS 42151-0002](https://genesis.destatis.de/datenbank/online/statistic/421%2A/table/42151-0002).
- GENESIS-Tabelle 42151-0004 enthält Auftragseingangs-Volumenindizes: [GENESIS 42151-0004](https://genesis.destatis.de/datenbank/online/statistic/42151/table/42151-0004).

Diese Quellen können Nachfrage-/Konjunkturpfade auf aggregiertem Branchenlevel plausibilisieren; sie messen **keine** Angebotspreise einzelner Werkstätten, kundenspezifische Preisempfindlichkeit, Auftragsgrößen-Mittelwerte für Kleinaufträge oder Zuschlagswahrscheinlichkeiten. Sie dürfen daher höchstens als Makro-/Nachfrageinput dienen, nicht als Marktpreis-Kalibrierung. Die Destatis-Seite war beim Öffnen serverseitig nicht abrufbar; GENESIS-Tabellenansichten verlangten JavaScript. Titel, Indikatorart und Tabellenreferenz wurden durch offizielle Suchtreffer verifiziert, Rohzeitreihen wurden in diesem Teilreview nicht extrahiert oder berechnet.

## Begrenzte Empfehlung für ein späteres Kalibrierungsgate

Vor einer Aussage „marktrealistisch kalibriert“ sollte A01 ein separates A02/A08-Paket veranlassen:

1. **Claim-Scope vorab festlegen:** getrennte Ziele für (a) Makro-Nachfrageindex, (b) Preisniveau bzw. Preisveränderung und (c) betriebliche Angebots-/Zuschlagsverhaltensparameter. Nicht einen aggregierten Auftragseingangsindex als Ersatz für Angebotspreise verwenden.
2. **Beobachtbare Reihen wählen:** Destatis 42151-0002/0004 nur für Branchenaktivität/Nachfrage; für Preise ist zu prüfen, ob ein methodisch passender amtlicher Erzeugerpreis-/Dienstleistungspreisindex die konkrete Metallbearbeitungsleistung abdeckt. Fehlt eine ausreichend granulare öffentliche Reihe, das als Datenlücke dokumentieren. Konkurrenzpreis-Kalibrierung bräuchte transparent erhobene, anonymisierte Angebots-/Auftragsdaten mit Zeitraum, Region, Leistungsumfang und Netto/Brutto-Abgrenzung oder bleibt explizit synthetisch.
3. **Vergleichbarkeit belegen:** Wirtschaftszweig/Leistungsumfang, Region, Unternehmensgröße, Zeitraum, Indexbasis, saison-/preisbereinigter Status, Einheiten und Veröffentlichungs-/Revisionsstand festhalten. Aggregatindizes nur als Richtung/Skalierung verwenden, nicht direkt in Euro-Angebotspreise umdeuten.
4. **Schätzungen von Produktentscheidungen trennen:** Rohdaten und geschätzte Parameter mit Unsicherheitsband, Versions-ID und Seed/Backtest dokumentieren. A02/A08 schlagen vor; A01/Nutzer entscheidet sichtbare Produktannahmen. A09 prüft Sensitivität und Reproduzierbarkeit. Bis dahin keine unmarkierten Realismusclaims.
5. **Preisstichprobenregel neu prüfen:** Die aktuelle Mindestzahl 2 nicht als Privacy-Schutz ausweisen. Für eine spätere reale/konkurrenzähnliche Preisbasis ist eine Mindestzellgröße zu begründen und gegen Differenz-/Wiederholungsangriffe zu testen; bei nur wenigen Beobachtungen Mittelwert unterdrücken oder auf gröbere Periode/Größenklasse aggregieren. Bei rein synthetischen Gegnern genügt zunächst eine klare Kennzeichnung als Spielmodell; das ist keine reale Datenschutzgarantie.

Dies ist ein Prüf-/Handoff-Vorschlag, keine neue Default-Regel und kein Nutzerentscheid.

## Gesamturteil und Nachweisrollen

**A08 Provenienztransparenz: PASS.** Die geprüfte Runtime/Demo behauptet ihre synthetischen Preise und Koeffizienten nicht als beobachtete Marktdaten.  
**A08 empirische Markt-/Preis-Kalibrierung: NICHT BESTANDEN / NICHT GELIEFERT.** Das ist derzeit im A02-Rahmen als offen ausgewiesen und verhindert eine Behauptung belastbarer Marktpreisrealität.  
**A08 Stichproben-/Anonymitätsclaim: NICHT BESTANDEN für Mindestwert 2.** Unterdrückungslogik ist implementiert, aber die konkrete Schwelle liefert keine hinreichend belegte Nicht-Rückrechenbarkeit.  
**A08 V3-Marktgate insgesamt: NICHT FREIGEGEBEN.** Die A09-Runtime-Historie-Duplikatbeanstandung aus `docs/test-reports/a09-t0065-market-runtime-review.md` ist unabhängig davon ein bestehender NONPASS; dieser Quellenreview behebt sie nicht. A05-UI-/Gesamtintegration und V3-Jahresgate bleiben ebenfalls separate offene Arbeiten.

| Nachweisrolle | Ergebnis |
|---|---|
| Ausführung | A08, read-only Quellen-/Parameterreview; dieser Bericht neu |
| Fachreview A02 | A02-Arbeitsrahmen vorhanden; keine neue A02-Bestätigung in dieser Prüfung |
| Finanzreview A03 | vorhandener A03-T-0065-Finanzreview PASS in begrenztem Finanzumfang |
| Unabhängige QA A09 | vorhandener Runtime-Review NONPASS wegen Restorehistorie; Stichproben-Regressionsbeleg keine Datenschutzbewertung |
| Browser-/Gerätetest | nicht ausgeführt |
| Git-Verifikation | Branch/HEAD/Status zu Beginn geprüft; eigene Berichtsdatei ist neu. Keine Commit-/Push-Aktion. `git diff --check` für diesen neu erstellten Bericht nach dem Schreiben ausgeführt. |

**Nächster Schritt an A01:** Den Marktpreis-Realismus bis zu einer belastbaren Daten-/Kalibrierungsgrundlage als synthetisches Szenariomodell führen. Mit A02/A05 klären, ob der Mindestwert 2 lediglich eine Fixture-Konfiguration oder ein sichtbarer Produktparameter ist; falls Letzteres, neuen Vorschlag samt Rückrechentest vor Produktfreigabe vorlegen. Den A09-History-Blocker und die getrennten UI-/Integrationsgates über ihre jeweiligen Agenten abarbeiten lassen.
