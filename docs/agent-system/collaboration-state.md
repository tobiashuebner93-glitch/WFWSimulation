## T-0062 G08-Kernaktionsmatrix und A05-Fix (CP-0271-Entwurf; 2026-10-30)

A01 prüfte sieben Kernaktionen je Touchereignis und Tastatur (14/14 PASS) in einem isolierten Edge-Profil bei 390×844: Angebotseinreichung; vorzeitige Darlehensablösung; Marketingaktivierung; Nachricht öffnen; Standortauswahl; Baumarkteinkauf als Arbeitsblock; Prüfungsantwort vormerken. Der erste Marketinglauf fand einen echten Integrationsfehler: `activateMarketingCampaign` wurde in app.js nicht importiert. A05 bestätigte und behob den fehlenden Import und ergänzte die Handler-/Engine-Regression. Nach dem Fix sind alle 16 bestehenden Regressionen und der 365-Tage-Smoke PASS; Kennzahlen und Nachweise stehen im A01-Matrixbericht und CP-0271. Diese Änderung enthält keine neue Produktregel. G03/G08 sind materiell PASS auf dem Working Tree. A09-Neubewertung und Bindung von Tests/Paket an denselben Commit bleiben offen; keine Releasefreigabe.
# Collaboration State – WFWSimulation

## T-0062 Quell-/Paketbindung und Review-Retro (CP-0272; 2026-10-30)

Quellcommit `3ce96b2` und Builderfix `7a89210` sichern die geprüften Produktquellen. A01 wiederholte 16 Regressionen und den 365-Tage-Smoke auf dem Quellstand; A09 bestätigt G03/G08 mit 14 Touch-/Keyboardpfaden, A10 G10 mit zwölf passenden Quellenhashes und `workingTreeSourcesIncluded=false`. Die Artefakte sind neu gebaut und unabhängig geprüft. A09 hält das Committee bis zum Artefaktcommit und abschließenden Hash-/Commit-Recheck BLOCKED. Noch kein Push. CP-0272 dokumentiert die commitbezogene Review/Retro und die behobene Builder-Provenienzlücke.

## T-0062 Releasefreigabe (CP-0273; 2026-10-30)

A09 erteilte nach dem Artefaktcommit `d18ec35` Committee PASS; der Parent `7a89210` ist die geprüfte Quellrevision. T-0060 ist erfüllt, G01–G11 sind gebunden, T-0062 ist COMPLETED. Paket und Reports sind im Releasecommit enthalten. Branch `main` liegt drei Commits vor `origin/main`; Push und anschließende Push-Retro stehen aus.

## T-0062 Touch-Gate-Nachweis (CP-0271; 2026-10-30)

A01 führte in einem isolierten Edge-Profil Touchereignisse über Input.dispatchTouchEvent aus. Bei 390×844 wurden alle neun Bereiche per Touch erreicht; ORD-001 wurde durch Antippen der Person und des ersten Arbeitsgangs gespeichert zugewiesen. Bei 768×1024 gelang dieselbe Zuweisung; Wischen verschob die interne Personal-Timeline von scrollLeft=0 auf 193 (850 px Inhalt, 657 px Scrollport). Bei 1280×800 öffnete ein Touch den Inventarbereich. Die drei Viewports hatten keine Dokumentüberbreite. Screenshots und Testpfad stehen in CP-0271 und im A01-Follow-up-Bericht. A09 bestätigt, dass die Kriterien Touch-Emulation akzeptieren; physische Hardware wird nicht ausdrücklich verlangt. Damit sind G03/G08 materiell auf dem Working Tree belegt; die gemeinsame Commitbindung aller Gates und des Pakets bleibt der einzige Releaseblocker. Keine Produktänderung, kein Commit/Push.

## T-0062 Responsive-/Planungs-Nachtest (CP-0270; 2026-10-30)

A01 fand im Wochenplan bei 768×1024 einen Dokumentüberlauf durch den absolut positionierten Screenreader-Datumstext. Die Zelle .timeline-cell ist nun positioniert; eine Regression schützt die Regel. Nach dem Fix wurden alle neun Hauptbereiche bei 390×844, 768×1024 und 1280×800 geprüft; die Dokumentbreite blieb im Viewport. ORD-002 wurde bis zur Planung verfolgt und ein Arbeitsgang per Tastatur manuell zugewiesen. Der mobile 390-px-Klickpfad ist kein Hardware-Touchlauf. Alle 16 Regressionen und der Jahressmoke bestehen. A10 hat den neu gebauten Offlinepaketstand technisch als PASS bestätigt. A09 bewertet G03/G08 teilweise PASS; das Committee bleibt wegen Touchpfaden und fehlender gemeinsamer Commitbindung BLOCKED. Kein Commit/Push. Details: CP-0270 und die T-0062-Berichte.

## T-0062 Blocker-Follow-up (CP-0269; 2026-10-30)

Der A01-Nachtest belegte die zuvor offenen Funktionsnachweise. G04-Rückgabehandler ist korrigiert und regressionsgesichert. G05 ist laut A09 nach Linkinventur und Browserprüfung der Rückkehr zu gleichem Link/Fokus und Scrollposition PASS auf Working Tree. G07 ist laut A09 PASS: 101 Ausstattungssymbole sind benannt/fokussierbar, sichtbare Namen/Funktionen stehen neben den Icons, der Tastaturfokus ist sichtbar. Kein Hardware-Touch- oder Screenreadertest wurde ausgeführt; Screenreader ist kein explizites Gatekriterium. G09-Roundtrip, v6-Migration und Recovery wurden im isolierten Browser nachgewiesen. A10 prüfte das iPhone-Paket technisch.

G01/G02/G04/G05/G06/G07/G09 sind funktional auf dem Working Tree belegt; G10 ist technisch PASS. G03/G08 waren teilweise geprüft: Navigation per Tastatur und Responsive-Matrix lagen vor, aber ein vollständiger manueller Arbeitszuweisungsablauf und Touch-Kernaktionen fehlten. Die gemeinsame Commitbindung und das finale A09-Committee-PASS standen aus. T-0062 blieb IN_PROGRESS; kein Commit oder Push. Details: CP-0269 und die T-0062-Berichte.
## Aktueller Governance-Stand (T-0054; CP-0256; 2026-10-30)

Abgeschlossene CPs und MCPs werden nach Abschluss ihrer Analyse und Nutzerbestätigung eingefroren. Keine nachträgliche redaktionelle Korrektur, Ergänzung, Umordnung oder Löschung; MCP-Entwürfe sind bis zur Bestätigung als Entwurf zu kennzeichnen. Spätere Erkenntnisse gehen in einen neuen CP, neue Gesamtsynthesen in eine neue MCP-ID. Bestehende CP-/MCP-Dateien blieben unangetastet. Details: [CP-0256](checkpoints/CP-0256.md).
## Aktueller Git-Stand (CP-0255; 2026-10-30)

Der validierte Ticketstand ist auf `origin/main` gesichert. Lokaler `main` und Remote-HEAD stimmen auf `f56b40bdeb286da3a67f4b781fb1cee3b9693e0b` überein; Arbeitsbaum sauber. T-0048 abgeschlossen; T-0047, T-0040 und T-0050 bleiben offen. Der Push wurde nicht durch den manuellen Nutzertest blockiert. Keine V2-Releasefreigabe. Details: [CP-0255](checkpoints/CP-0255.md).
## Aktueller Arbeitsstand nach Commit-Recheck (CP-0254; 2026-10-30)

Commit `9cfb50b721b54dd97b1eeeb9706c3fa7e7d42cb8` und Tree `08aa2f8fed57d8855f469019966b3e8b92c5ea51` bestehen den erneuten Jahressmoke und alle 15 Regressionen. T-0048 ist abgeschlossen. T-0047, T-0040 und T-0050 bleiben wegen klar benannter Nacharbeit offen; diese Punkte blockieren den Sicherungs-Push nicht. Der manuelle Nutzertest ist nach Nutzeranweisung kein Push-Blocker; keine V2-Releasefreigabe. Details: [CP-0254](checkpoints/CP-0254.md).

# Aktueller Arbeitsstand nach Ticketprüfung (CP-0253; 2026-10-30)

T-0048 ist nach dem reproduzierbaren 365-Tage-Lauf abgeschlossen. Der Jahres-Smoke endet am 2028-01-01 mit 12 Monatsabschlüssen, 63 Lieferungen, 59 bezahlten Aufträgen, 1.239,16 € Bankbestand, 0 € offenen Betriebskosten und ohne Abstimmungsdifferenz. Der vorherige Insolvenzlauf ist durch die aktuelle Engine-/Harness-Version überholt; Quellen und Kennzahlen stehen in [CP-0253](checkpoints/CP-0253.md).

Die Gesamtregression lief vollständig durch (15 Smoke-/Regression-Skripte plus Syntaxprüfung aller prototype JS/MJS-Dateien). Die 10 Stufe-1-Inventarkäufe, Umzug, Einstellung, nachgelagerter AEVO-/Ausbildungsstart, kontrollierter Krankheitsfall und abgeschlossene Weiterbildung wurden nachgewiesen. Auch die drei Cross-Ticket-Konflikte zu Urlaub bei später Einstellung, Marketingwirkung bei erfolgreicher Marktchance und selektiver Konkurrenzbeteiligung sind gelöst.

T-0047 bleibt für die visuelle A12- und Wiederherstellungsabnahme IN_PROGRESS. T-0040 bleibt für mobile Abnahme und eine präzisere Behandlung von Anschaffungskosten/Vorsteuer IN_PROGRESS. T-0050 bleibt für sortierbare Mehrfachblöcke, längerfristige Teamwirkung und sichere Verdichtung abgeschlossener Aufträge IN_PROGRESS. Kein offener Konflikt verhindert einen Sicherungs-Commit/-Push; der vom Nutzer genannte manuelle Nutzertest ist kein Push-Gate. Das ist keine V2-Releasefreigabe und keine Architektur-/Schemafreigabe.
# Governance-Nacharbeit aus der CP-Retrospektive (T-0051–T-0053; CP-0252)

P-GOV-01 bis P-GOV-08 wurden nach Einzelabfrage jeweils mit Ja bestätigt und in `AGENTS.md`, `agent-structure.md` und `agent-rights-matrix.md` umgesetzt. Details stehen in [CP-0252](checkpoints/CP-0252.md). CP-0251 hält die vorherige, damals noch offene Vorschlagslage fest; sie ist durch diese neuere Entscheidung abgelöst. Bestehende CP-/MCP-Dateien bleiben unverändert. Kein Commit/Push.
## V2-Tagesbelastung Personal (T-0050; CP-0233)

Die Arbeitsbelastung ist auf 8 h = 100 % normiert. Automatische Planung stoppt bei 8 h pro Person. Eine ausdrückliche manuelle Tageszuweisung durch Spieler/Führungskraft erlaubt bis 10 h (125 %) für Beschäftigte und Zeitarbeit bzw. bis 12 h (150 %) beim Inhaber. Jede Inhaberstunde über 10 h senkt Motivation um 1,5 Prozentpunkte und wird protokolliert. Maschinenkapazität bleibt 8 operative Stunden pro Tag. Zusätzlich funktionieren nun Postfachdetail/Anfragezielnavigation, verlorene Angebotsfilter, negative-DB-Warnung mit Bestätigung sowie getrennte Bank-/Dispo-KPIs. T-0050 bleibt für die übrigen angenommenen Testempfehlungen offen (Mehrfachblöcke/DnD, Markt und Marketing, langfristige Auslastungswirkung, BAB, Archivverdichtung). Keine Schemaänderung oder Commit/Push. Details: [CP-0233](checkpoints/MCP-2026103001.md#cp-0233) und [CP-0234](checkpoints/MCP-2026103001.md#cp-0234).

## Aktueller Profilstand 2019/2027 (T-0049; CP-0230)

Die beiden frischen Spielprofile sind auf denselben Betriebs- und Finanzstand vereinheitlicht. Ausschließlich das Startdatum unterscheidet sich: 01.01.2019 bzw. 01.01.2027. Beide starten in derselben gemieteten Garage mit 10.000 € Bankbestand, leerem Lager, ohne Aufträge, Forderungen, Verbindlichkeiten, Maschinen oder Darlehen und mit dem Inhaber als einziger Arbeitskraft. `profile-equivalence-regressions.mjs` vergleicht die vollständigen Zustände nach Normalisierung des Jahres. Historische Regressionen verwenden `prototype/test-fixtures/legacy-business.js`; dieses Fixture wird nicht vom Produktstart verwendet. Fachspezifikationen und D-0152 weisen auf die historischen 2027-Werte hin. T-0049 abgeschlossen. Der Jahres-Smoke bleibt unabhängig davon FAIL; siehe T-0048/CP-0229. Kein Commit/Push.

## Aktueller Jahreslaufstand (T-0048; CP-0230)

Der deterministische Jahres-Smoke kauft am Simulationsstart 01.01.2027 alle zehn Stufe-1-Inventarartikel für 3.680 €, verlegt den Betrieb nach Milbertshofen und stellt bei erreichter Schwelle eine Fertigungskraft ein. AEVO beginnt erst nach dem Umzugsereignis; die Auszubildendenaufnahme folgt am 19.01. Die Angebotsbearbeitung läuft bereits während der Weiterbildung, deshalb verfielen die beiden Anfragen aus dem vorherigen Vorbereitungsblock nicht mehr. Der Runner erreicht 01.01.2028 und generiert 45 Angebote mit 19 Zuschlägen, bleibt aber FAIL: kein Auftrag wird geliefert/geschlossen, offene Kosten 193.191,14 €, Endbestand 0 €. Das bleibt ein unabhängiger V2-Jahresfreigabeblocker. Einzelheiten: CP-0231 und `prototype/year-simulation-log-2027.md`. Für den Nutzer-Test ist der isolierte Browserstart `http://localhost:8000/?manualTest=annual-2027&fresh=1` aktiv; Browseransicht am 01.01.2027 mit 10.000 € Bankguthaben, leerem Lager und ohne Aufträge/Darlehen bestätigt. Ergebnisse des manuellen Nutzertests stehen noch aus und werden in `prototype/manual-year-smoke-test-log.md` erfasst.

## Cross-Agent-Auditstand (CP-0197)

## Aktueller Sicherungsstand MG-002 (T-0046; CP-0226)

Das eigenständige iPhone-Paket und der reproduzierbare Builder sind unter prototype/ gesichert; die Personalplanung unterstützt zusätzlich Tipp-Auswahl auf Touchgeräten. Der Nutzer hat die Oberfläche visuell freigegeben. Ein Geräte-/Offline-Test auf dem iPhone steht aus. Die aktuelle Prüfung bestand in 11 von 12 Läufen; der Jahreslauf erreicht 2028-01-01, scheitert jedoch mit gameLost=true und 119.638,87 € offenen Kosten. T-0040 bleibt IN_PROGRESS. Commit/Push sichern den Zwischenstand und stellen keine V2-Releasefreigabe dar. Details: CP-0226.

A02/A09/A11 bestätigen drei konkrete V1-Inkonsistenzen: Konkurrenzantworten liegen laut Datum in der Zukunft, werden aber sofort gezeigt und gewertet; gelieferte Aufträge belasten weiter den Anfrage-Kapazitätsabzug; verlorene Angebote können als vereinbarter Preis dargestellt werden. A03 bestätigt die Finanzlogik ohne Spezifikationskonflikt, weist aber erhebliche Unterdeckung bei nur einem gewonnenen Auftrag aus. A04 meldet eine nicht blockierende logische Datenmodelllücke für persistente Konkurrenzangebots-Snapshots. A05 fand im statischen UI-Review keinen Ablaufkonflikt, hat den „Vereinbarter Auftragspreis“-Zweig eines verlorenen Angebots jedoch nicht identifiziert; A02/A09-Befund wird durch den aktuellen Code bestätigt. A06/A07 fanden keinen Rollenkonflikt; A08 bewertet Konkurrenzwerte als synthetisch korrekt gekennzeichnet, empfiehlt aber D-0136 als historischen Monatsstand kenntlich zu machen; A10 sieht keine Infrastrukturänderung. Keine Architektur-/Schemafreigabe, kein Commit/Push. Folgeauftrag T-0028 PENDING; CP-0197.

## Aktueller Stand MG-001 / T-0027 (CP-0196)

Die Marktanfragen laufen jetzt wöchentlich statt zweimal monatlich; ausgewertet wird am ersten Arbeitstag der Woche. Die Einladungs- und Zuschlagsregeln aus D-0136 bleiben bestehen, mit der Kundenbindungs-Kalibrierung D-0138. Die Einladung wird bei hoher offener Auftragslast gedämpft. Im Jahreslauf kamen 25 Angebote herein, 22 wurden mit Standardpreisen gewonnen; der Cashbestand blieb positiv und unbezahlte Kosten gab es nicht. T-0027 ist mit CP-0196 abgeschlossen. T-0022 bleibt wegen übriger Standort-/Browserpunkte IN_PROGRESS. Kein Commit oder Push.

## Aktueller Stand MG-001 / T-0026 (CP-0195)

Kundenanfragen werden selektiv verteilt. Ruf, das aus abgegebenen Preisen fortgeschriebene Preisprofil und Kapazitätsbelastung bestimmen, ob der Betrieb eingeladen wird. Für offene Angebote werden ein bis zwei der drei fiktiven Wettbewerber mit Preis, Reputation und modellierter Lieferzeit angezeigt. Der Zuschlag wird beim Einreichen anhand von Preis und Ruf deterministisch ermittelt. D-0136 kennzeichnet Formel, Quote-Spanne und Werte als synthetische V1-Spielannahmen. T-0026 ist mit CP-0195 abgeschlossen. T-0022 bleibt wegen ausstehender Standort-/Browserpunkte IN_PROGRESS. Kein Commit oder Push.

## Aktueller Stand MG-001 / T-0025 (CP-0194)\n\nA01 hat die Zeitarbeitsverhandlung als Fachrollen A02/A03/A05/A09 umgesetzt. Vor der ersten Buchung wird einer von drei Agenturverträgen ausgewählt: 0 €/Monat + 55 €/h, 120 €/Monat + 43 €/h oder 300 €/Monat + 31 €/h. Der Grundpreis wird einmal pro genutztem Monat, der Stundenpreis je gebuchter Stunde berechnet. Nach Annahme sind Konditionen fix und in Buchungen gespeichert. Alte Spielstände behalten ihre 45-€/h-Regel. T-0025 ist mit CP-0194 abgeschlossen; T-0022 bleibt wegen der noch offenen übrigen Standort-/Browserpunkte IN_PROGRESS. Kein Commit oder Push.\n\n## Aktueller Stand MG-001 / T-0024 (CP-0193)

A04s logisches Datenmodell wurde gegen D-0120 bis D-0129 und D-0134 synchronisiert. Die zuvor veralteten Offenmarkierungen zu Annuität/Rate, erster Darlehenstermin, Dispolimit und -bedienung, Ereignisreihenfolge und Periodenzuordnung sowie die Feiertagsaussage bei F3 sind berichtigt. Es wurden keine Schema- oder Architekturänderungen vorgenommen. T-0024 ist mit CP-0193 abgeschlossen; T-0022 bleibt IN_PROGRESS. Das A10-Risiko des PR-Workflows ist in goals.md als nicht aktives V2-Ziel erfasst.

# Collaboration State – WFWSimulation
## Aktueller Jahreslaufstand (T-0048; CP-0228)

Der Legacy-Jahres-Smoke führt jetzt deterministisch einen Mietumzug nach Sendling, den Kauf `office-pc-1` und eine Fertigungseinstellung aus, sofern die im Runner definierten Auftrags-, Arbeitsplatz- und Liquiditätsschwellen erfüllt sind. Die Policy verwendet bestehende Umzugs-, Ausstattungs-, Personal- und Finanzierungs-APIs und ändert keine autonomen Spielregeln. Im geprüften Lauf wurden alle drei Aktionen am 19.01.2027 bzw. 23.01.2027 protokolliert. Der Jahreslauf endet am 01.01.2028, bleibt aber FAIL: 17 statt mindestens 20 generierte Aufträge, keine Zeitarbeitsstunden, keine Ausbildungspraxistage sowie 160.431,24 € offene Kosten; übrige Jahresgates sind teils erfüllt. Diese Änderungen lösen die Solvabilitäts-/Abnahmelücke nicht. Details: CP-0228. Keine Commit-/Push-Aktion.

## Aktueller V2-Stand (T-0045; CP-0225)

T-0045 ist mit CP-0225 abgeschlossen: Industrie-Werkbank/Spannmittel erfüllt die passende Spannmittelanforderung; Mitarbeiter können qualifikationsgeprüft einzelne geordnete Arbeitsgänge per Drag-and-drop planen. Baumarkteinkäufe, Online-Warenannahmen und Ergebnisversand verbrauchen zugewiesene Arbeitszeit. Anbieter-Mindestmengen, Mengen-/Beziehungsrabatte, Lieferzuverlässigkeit und Versandkosten sind in der Bestelllogik ausgewiesen/wirksam. Das Dashboard zeigt die drei neuesten Nachrichten mit Lesestatus; laufende Kredite werden nur bei positiver Restschuld angezeigt und können im Szenario vorzeitig abgelöst werden. V2-Auftragsreferenzwerte und -Lieferzielhorizonte wurden reduziert. Gezielte Regressionen und alle bestehenden Prüfungen außer dem Legacy-Jahressolvabilitäts-Smoke bestanden. Der 365-Tage-Lauf erreicht 2028-01-01, scheitert aber am End-Gate mit `gameLost=true` und 119.638,87 € offenen Kosten; der Fehler besteht auch ohne die neue Same-Day-Auftragsfreigabe. Der lokale HTTP-Server liefert die Änderungen. Eine interaktive visuelle Browserabnahme ist noch nicht erfolgt. T-0040 bleibt für unabhängigen Fachreview/Mobile-Abnahme IN_PROGRESS. Kein Commit/Push.

Stand: 2026-10-29

## Historischer A01–A12-Agenten-Auditstand (CP-0220/0221; fortgeschrieben in CP-0224)

Der nachstehende Text friert den damaligen Zwischenstand CP-0220/0221 ein: seitdem wurden A09s vollständige 450er-Zuordnung implementiert und Regressionen ergänzt; die 90 korrigierten Ergänzungen warten weiterhin auf unabhängige Inhaltsnachprüfung. Der aktuelle Status steht im Abschnitt SLG-002.3 weiter unten und in CP-0224.

## MG-002 / SLG-002.5 – Browser-Playtest-Rolle A12 (T-0042; CP-0219)

A12 – BROWSER_PLAYTEST ist als explorative Browser-Testrolle in [agent-structure.md](agent-structure.md) aufgenommen und in [a12-browser-playtest.md](a12-browser-playtest.md) definiert. Der Auftrag umfasst visuelle und funktionale Prüfung im Browser sowie reproduzierbare Szenario-Spielstände/Startpunkte, Screenshots und einen konkreten Nutzer-Handoff. A09 behält automatisierte Testabdeckung, Regressionen und Release-Gates. A12 darf nur isolierte Testzustände und QA-Artefakte bearbeiten; Produktcode, autoritativer Simulations-/Finanzzustand, dauerhafte Nutzerspielstände und Releases sind ausgeschlossen. Definitions-Ticket T-0042 ist mit CP-0219 abgeschlossen. Es wurde noch kein A12-Playtest ausgeführt und kein Testfixture-System implementiert.

## Governance-Rechtekarte A01–A11 (T-0044; CP-0222)

Die Rechtekarte [agent-rights-matrix.md](agent-rights-matrix.md) dokumentiert je Rolle Verantwortung, READ/PROPOSE/VALIDATE/WRITE-Rechte und Sperrgrenzen. `AGENTS.md` nimmt sie in den Pflicht-Preflight auf. A05s Stackangabe entspricht dem aktuellen statischen HTML/CSS-/ES-Module-Prototyp; A10s mit T-0033/CP-0216 abgeschlossener Workflow-Sicherheitsfix ist nicht länger als Rückstand geführt. Kein Agent erhält Produkt-, Rechts-, Architektur-, Schema-, Release- oder Nutzerfreigabe. T-0044 ist mit CP-0222 abgeschlossen.

## MG-002 / SLG-002.3 – Lernfragenstufen und abwechslungsreiche Wiederholung (CP-0221)

T-0041 und SLG-002.3 sind COMPLETED (CP-0224). A09s redaktionelle Einzelstufung der 450 Kernfälle ist als explizite Liste umgesetzt; Laufzeit und Regression sichern 20/15/15 je Fach im Kernbestand und 20/20/20 einschließlich Ergänzungen. A09 prüfte alle 90 nachgearbeiteten Ergänzungen vollständig und erteilte PASS. 13 Validatoren/Regressionen einschließlich Jahreslauf bestehen. Die Einstufung ist redaktionell, nicht psychometrisch oder IHK-kalibriert. A12s isolierter Browsercheck bleibt der dokumentierte begrenzte UI-Nachweis. Details stehen im [A09-Reviewnachweis](../learning/a06-a07-a08-a09-review-90-ergaenzungsfragen.md#unabhaengiger-a09-review-2026-10-29) und CP-0224.

## MG-002 / SLG-002.2 – Inventar- und Arbeitsplatzausbau (CP-0217)

T-0040 wurde durch A01 begonnen. Der Prototyp hat jetzt einen eigenständigen, datengetriebenen Ausstattungskatalog mit zehn Kategorien und je zehn Varianten für Büro/Beschaffung/Marketing, Werkstatt sowie Lager/Versand. Arbeitsmittel können gekauft werden; nur Spezialwerkzeuge haben im Katalog eine zusätzliche Monatsmiete. Ein Kauf bei unzureichender Liquidität fragt einen 12-Monats-Ratenkauf an und prüft, ob Fehlbetrag sowie bestehende Schulden in den freien quartalsweisen Finanzierungsrahmen passen.

Zustand/Verschleiß, Buchwert/AfA, Mietkosten, Ratenzinsen, GWG-Aufwand und Lagerregal-Kapazität sind in getrennten Spielzuständen vorgesehen. Ausstattung wirkt auf Produktionsgeschwindigkeit, Beschaffungs-Vorlauf, Einladung/Zuschlag und Büro-/BAB-Kennwerte. Die Standortkarte nutzt die bestehenden zehn Miet- und zehn Kaufstandorte. Fachlicher Cross-Review, vollständige Funktions-/Jahresregression und Mobile-Abnahme stehen noch aus; daher bleibt T-0040 IN_PROGRESS. Keine Schema- oder Architekturfreigabe.

## V1-Zielreview und V2-Zielvorschlag (CP-0201)

Alle Rollen A01–A11 haben den gepushten V1-Stand geprüft. MG-000/001 sind gemäß den formalen Zielen abgeschlossen; die V1-Abnahme belegt jedoch weder eine realistisch kalibrierte Unternehmenswirtschaft noch WBQ/HQ-Lernwirksamkeit. Beschäftigtenweiterbildung ist vorhanden, aber kein Wirtschaftsfachwirt-Curriculum, Lernkartensystem oder Prüfungssimulator. Die Simulation bleibt ein transparent begrenztes Szenariomodell. MG-002 mit SLG-002.1–002.5 wurde als PROPOSED in `goals.md` aufgenommen: zuerst erhebt A08 den Prüfungsrahmen aus Internetquellen der zuständigen IHK; A06 leitet daraus die Kompetenzlandkarte ab; A07/A08 gleichen diese mit weiteren Internetquellen ab und detaillieren sie. Danach folgen erklärbare Simulation, Lernkarten und Prüfungsübungen/Debriefs sowie eine nachgelagerte Daten-/Architektur-/QA-Basis. Quellenstand und agentenseitige Ableitung sind getrennt zu dokumentieren. Keine Implementierung, kein Ticket für unbestätigte V2-Arbeit, keine Schema-/Architekturfreigabe. Details: [CP-0201](checkpoints/MCP-2026103001.md#cp-0201).

## Abschluss MG-001 / SLG-001.1 (CP-0199)

T-0022 ist abgeschlossen. Der Nutzer hat die manuellen Browserprüfungen für Speichern/Laden, dauerhaft erreichbare Navigation bei hoher Zoomstufe, Standortwechsel, Preissperre nach Angebotsannahme und Mobilansicht durchgeführt und keine Fehler gefunden. Die automatisierten Playtest- und Finanzregressionen, der Marktregressionstest, der Einjahres-Smoke sowie `git diff --check` waren bereits bestanden. Zusammen mit T-0028/CP-0198 sind damit keine offenen Tickets unter MG-001 / SLG-001.1 verblieben. MG-001 und SLG-001.1 sind in goals.md als COMPLETED gekennzeichnet. Kein Commit oder Push. Details: [CP-0199](checkpoints/MCP-2026103001.md#cp-0199).

## Aktueller Cross-Agent-Befund (CP-0198)

T-0028 ist abgeschlossen. Gleichzeitige Konkurrenzangebote tragen den Anfrage-/Eingangstag; gelieferte Aufträge geben Produktionskapazität frei; verlorene Preise werden nicht als Vertragswert oder Zahlungsziel geführt. Der Qualitätswert ist in der UI als Ruf-Proxy gekennzeichnet. Das logische Datenmodell enthält Anfragebeteiligung, unveränderlichen Quote-Snapshot und Zuschlagsergebnis als Anforderungen, ohne Schema- oder Architekturfreigabe. Der Ein-Auftrag-Stresslauf ist wiederholbar: 1 von 25 Angeboten gewonnen, Jahresendcash 306,08 €, offene Kosten 116.978 €, acht Retry-Fehlschläge, `gameLost=true`, Maschinenverwertung ausgelöst. Dies dokumentiert ein wirtschaftliches Risiko des Szenarios; es wurde keine neue Finanzregel festgelegt. Regressionen bestanden; kein Commit/Push. Details: [CP-0198](checkpoints/MCP-2026103001.md#cp-0198).

## Aktueller Sicherungs-Commit (CP-0189)

Der in CP-0188 abgeglichene Repository-Stand wurde lokal auf `main` gesichert: Commit `43981f2e435385b8d49dc51ad8518e454bd45c7b` (`chore: secure validated project state with CP-0188`). Der Commit enthält 66 geprüfte Dateien unter `docs/` und `prototype/`, einschließlich der T-0015–T-0020-Nachweise, des Prototyps und CP-0188. Regressionen, Jahres-Smoke-Test, Linkprüfung und `git diff --cached --check` bestanden. Unmittelbar nach dem Commit war der Arbeitsbaum sauber; `main` lag einen Commit vor `origin/main`. Kein Push. Details: [CP-0189](checkpoints/MCP-2026103001.md#cp-0189).

Die nächste lokale Fortschreibung hält den Commit-Abgleich selbst fest. Sie ist dokumentarisch und ändert keine Produktentscheidung, Architekturfreigabe oder Schema.

## Aktueller Goal- und Ticketabgleich (CP-0188)

MG-000 ist abgeschlossen, nachdem die dokumentierten Ergebnisse der Second-Level-Goals bewertet wurden: SLG-000.1 (Agent Control Plane), SLG-000.2 (Architektur V0.2 prüfen) und SLG-000.3 (Repository-Bestand aufnehmen) sind abgeschlossen. Belege und Kriterien stehen in [CP-0188](checkpoints/MCP-2026103001.md#cp-0188).

T-0001 ist mit CP-0182 abgeschlossen. T-0002 ist mit CP-0006 als Architekturvorschlag abgeschlossen; CP-0029 dokumentiert die Architekturgegenprüfung. T-0020 ist mit CP-0187 abgeschlossen. Die Prüfung des Architekturentwurfs gilt als erfüllt, ist jedoch keine Architekturfreigabe: Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED. Die dokumentierten Kopplungen und die noch ausstehende interaktive Recovery-Ansichtsprüfung gelten als nicht blockierende Folgearbeit, siehe CP-0187.

T-0021 – Goal- und Ticketstatus gegen Checkpoints abgleichen – wurde durch A01 ausgeführt und mit CP-0188 abgeschlossen. Es sind keine aktiven Tickets unter MG-000 offen. Die zuletzt gesicherte Arbeit ist der Status-/Goal-Abgleich CP-0188; die letzte fachliche Umsetzung/Validierung ist T-0020 mit CP-0187. Die lokalen Änderungen und ungetrackten Dateien des Arbeitsbaums wurden erhalten; dieser Abgleich erzeugt keinen Commit oder Push.

## Historischer Auftragsstand (T-0020; vor Abschluss CP-0187)

Zum damaligen Zwischenstand war T-0020 IN_PROGRESS und bearbeitete die fachlichen/QA-Lücken des CP-0185-Reviews. T-0015–T-0019 galten noch nicht als vollständig fachlich validiert. Der Abschluss ist in CP-0187 dokumentiert. A01 führte A02/A03/A04/A05/A08/A09-Arbeit selbst aus. Scope waren Same-Day-Abhängigkeiten, Vorsteuer-SimTAX, Dunning, Wiederherstellung beschädigter lokaler Spielstände und konsistente Spezifikationen/Tests. Keine Architektur- oder Schemafreigabe. Die dort erwähnten Arbeitsbaumänderungen sind der damalige Stand.

## Historischer Abschlussstatus (CP-0185; durch CP-0187 aktualisiert)

T-0015 bis T-0019 sind lokal umgesetzt und als COMPLETED dokumentiert; T-0008 bleibt entsprechend dem früheren Stand bereits abgeschlossen. CP-0185 enthält A01-Ausführung der A02/A03/A05/A08/A09-Arbeit, Änderungsliste, Testlauf und Grenzen. Die fünf Tickets decken Zahlungsereignisse, Angebotswirtschaft, Preis-Szenarien, Monatsabschluss und Auftragspriorisierung/Abnahme ab. Keine neue Nutzerentscheidung, Schemaänderung, Architekturfreigabe, Commit oder Push. Browseransicht wurde wegen blockierter UI-Automation nicht visuell bestätigt.

## Historischer Abschlussstand (CP-0182)

T-0001, T-0008, T-0010 und T-0011 sind mit CP-0182 abgeschlossen. T-0008 schließt die P0-Koordination für die spielbare V1 mit ausdrücklich bezeichneten deterministischen Modellkonventionen ab; verbleibende historische Beleg-/V2-Fragen blockieren den Prototyp nicht. T-0010 ergänzt das A02-Startprofil und artikelbezogene Norm-/Zukaufteile; T-0011 übergibt den datierten A08-Referenzscan. T-0001 ist anhand der vorhandenen Governance-Artefakte abgenommen. Keine Schema-, Architektur- oder Produktfreigabe über D-0128/D-0129 hinaus.

## Historischer Folgeauftragstand (CP-0183)

T-0015 ist als PENDING angelegt: A02-Implementierung der Zahlungsereignisreihenfolge aus D-0120/D-0126/D-0129, A03-Fachreview, A05-UI-Review und A09-QA. A01 koordiniert und führt die Rollenarbeit gemäß dem früheren Nutzerauftrag selbst aus. Der aktuelle Prototyp verarbeitet Kosten-Retries, Zins, SimTAX und Maschinenrate in einer Reihenfolge, die nicht vollständig D-0129 entspricht; außerdem muss die Spielerreihenfolge eigener Zahlungen im UI wirksam sein. Keine Codeänderung wurde im Rahmen der Ticketerstellung vorgenommen.

## Historischer Kontext bis CP-0182 (durch CP-0187/CP-0188 überholt)

### V1-Anfangsbestand und aktuelle Materialpreis-Basis (D-0128 / CP-0181)

Der Nutzer hat die drei Startaufträge als Bedarfsbasis festgelegt: 2.000 kg Stahl bleiben gemäß D-0090; Aluminium wird auf 100 kg und Normteile auf 60 Stück gesetzt. Festgehaltene Händlerreferenzpreise vom 27.10.2026 ergeben einen Startwert von 4.214,20 €. Damit werden für den V1-Szenarioprototyp der frühere Gesamtvorratswert von 12.800 € und die Vorjahresschlussannahme für den Eröffnungswert ersetzt. Aktiva/Passiva betragen 46.714,20 €, Eigenkapitalrest 15.214,20 € und Dispo-Startlimit 4.671,42 €. Preise, Bestände und Quellen stehen im [Materialpreis-Basisstand](../market-data/material-price-baseline-2026-10-27.md).

Die Listenpreise sind Simulations-Proxies, keine tatsächlichen Einkaufsbelege. § 253 HGB wird im Modell nicht als erfüllt behauptet. Die Entscheidung ist in [D-0128](decision-log.md#d-0128--v1-anfangsbestand-und-marktbezogene-materialpreis-basis) und [CP-0181](checkpoints/MCP-2026103001.md#cp-0181) dokumentiert.

### Historischer A01-Rollenreview des V1-Prototyps (CP-0180; für Vorräte durch CP-0181 ersetzt)

Am 27.10.2026 hat A01 den aktuellen Commit-Kandidaten anhand der Fachzuständigkeiten A01–A11 geprüft. Die Überprüfung ergibt: A03-Dispozinsfehler D-0023 korrigiert (relativ ×1,08 statt +8 Prozentpunkte); A02-Partnerabhängigkeitsauswahl auf normalisierte Gewichte korrigiert; V1-Feiertagsausbau ausdrücklich von D-0011-Kernumfang abgegrenzt. A05-Browseransichten und A09-Jahreslauf sind geprüft. A04/Schema, A10/Deployment und A11/Architektur wurden nicht erweitert oder freigegeben.

Eine fachübergreifende Eingangsdatenlücke bleibt offen: die belegten Vorratskomponenten aus dem Vorjahresschluss fehlen. Die D-0042/43-Darlehens-Retry-/Verwertungsfolge wurde mit A02/A03/A05/A09-Rollenlogik umgesetzt und getestet. Der Prototyp ist als begrenzter Szenariolauf reviewbar; die Vorratsbewertung muss vor einer vollständigen Finanzsimulation ergänzt werden. Einzelheiten und geänderte Dateien: [CP-0180](checkpoints/MCP-2026103001.md#cp-0180), [P0-Abgleich](p0-offene-parameter-koordinierung.md).

Master Goal:
MG-000

Second-Level Goals:

- SLG-000.1 ACTIVE
- SLG-000.2 ACTIVE / PROPOSED

Ticketstatus zum historischen Abschlussstand CP-0182:

- T-0009 – COMPLETED (CP-0150).
- T-0011 – COMPLETED (CP-0182; A08-Referenzscan abgelegt).
- T-0010 – COMPLETED (CP-0182; A02-Spezifikation und Änderungsbericht abgelegt).
- T-0008 – COMPLETED (CP-0182; V1-Koordination einschließlich D-0129 konsolidiert).
- T-0001 – COMPLETED (CP-0182).

Damals war CP-0182 der neueste A01-Checkpoint. T-0001, T-0008, T-0010 und T-0011 waren abgeschlossen. D-0120 bis D-0129 waren in den aktiven Fachunterlagen konsolidiert. Der Dispozins im Prototyp folgte D-0023 als 8 % relativer Aufschlag auf den individuellen FKQ-Unternehmenszins; D-0127 wurde nach D-0129 mit Actual/365 und Monatsend-Rundung als ausgewiesene V1-Annahme konkretisiert. Die V1 verwendete normalisierte Partnerabhängigkeiten. D-0042/43 waren mit Wochenretry, Dispoabruf und Verwertung nach drei offenen Monatsraten umgesetzt und gestresst. D-0128 legte den V1-Szenariostartwert fest; historische Einkaufsbelege blieben ausdrücklich außerhalb der Prototypbilanz. Details stehen in [CP-0180](checkpoints/MCP-2026103001.md#cp-0180), [CP-0179](checkpoints/MCP-2026103001.md#cp-0179) und [V1-Modellblatt](../../prototype/V1-MODELL.md). Der spätere Stand ist CP-0187/CP-0188.

### Historische Fortschreibung – Nutzerentscheidungen D-0120 bis D-0127 (CP-0160 bis CP-0177)

D-0120 legt für gleiche wirksame Simulationstage fest: zuerst sämtliche fälligen Kundeneingänge, danach eigene Vollzahlungsversuche in Spielerreihenfolge mit Liquiditätsprüfung. D-0121/22 legen Darlehenstermin und Rate fest: erste Rate 29.01.2027, weitere am letzten Arbeitstag des Monats; 83 Raten zu je 339,21 € und Schlussrate 339,57 €, bis Dezember 2033. Der Periodenfaktor ist `5 % / 12` je Rate ohne kurzen Eröffnungszeitraum. A03 hat den Tilgungsplan berechnet, A02 hat die Parameter in die Spezifikation übernommen. D-0123/24 setzen den Dispositionskredit auf 10 % der Bilanzsumme am Vorquartalsende, wirksam ab Quartalsbeginn; die Startgrenze aus 55.300 € beträgt 5.530 €. D-0125 erlaubt dem Spieler eine manuelle Ziehung exakt des Fehlbetrags, soweit der freie Rahmen reicht; A02 und A03 haben die Regel dokumentiert. Kundeneingänge führen bestehende Disposchuld automatisch zuerst zurück (D-0126). D-0127 legt tägliche Zinsberechnung auf den gezogenen Saldo und einmalige Monatsendbelastung als Sammelposten fest. Der Prototyp konkretisiert D-0127 nach CP-0178 mit Actual/365 und einmaliger Cent-Rundung am Monatsende. T-0008 bleibt wegen weiterer fachlicher Punkte IN_PROGRESS.

## Historische Entscheidungs- und Checkpointnotizen

Die folgenden datierten Notizen dokumentieren jeweils den damaligen Wissensstand. Für den aktuellen Stand sind der CP-0180-Rollenreview und die aktuelle P0-Koordinierung maßgeblich; Abschnitte CP-0148 bis CP-0156 sind historische Zwischenstände.

Nutzerentscheidung D-0037: Monatliche Darlehenszinsen werden kaufmännisch auf Cent gerundet. Nachweis: [CP-0061](checkpoints/MCP-2026103001.md#cp-0061).

Nutzerentscheidung D-0038: Ein aus der kaufmännischen Cent-Rundung verbleibender Darlehensrest wird in der letzten Rate bezahlt. Nachweis: [CP-0062](checkpoints/MCP-2026103001.md#cp-0062).

Nutzerentscheidung D-0039: Der nominale Darlehenszinssatz von 5 % p.a. gilt während der siebenjährigen Restlaufzeit fest. Nachweis: [CP-0063](checkpoints/MCP-2026103001.md#cp-0063).

Nutzerentscheidung D-0040: Darlehenszinsen werden zusammen mit der monatlichen Annuitätenrate gezahlt. Nachweis: [CP-0064](checkpoints/MCP-2026103001.md#cp-0064).

Nutzerentscheidung D-0041: Für die Zinsperiode gilt der Kalendertag vor der nächsten Rate als Stichtag des maßgeblichen Restschuldsaldos. Nachweis: [CP-0065](checkpoints/MCP-2026103001.md#cp-0065).

Nutzerentscheidung D-0042: Eine am Fälligkeitstag nicht gezahlte Maschinenrate ist sofort im Verzug; die Bedienung wird wöchentlich erneut versucht. Bei insgesamt drei nicht gezahlten Raten wird die Maschine gepfändet, zum aktuellen Marktwert liquidiert und der Erlös zur Darlehenstilgung verwendet; ein Überschuss geht auf das Geschäftskonto. Was bei einem Erlösdefizit geschieht, bleibt offen. Diese Regel betrifft nur das Maschinendarlehen und ändert D-0029 nicht. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0066](checkpoints/MCP-2026103001.md#cp-0066).

Nutzerentscheidung D-0043: Eine nach der Maschinenverwertung verbleibende Restschuld erlischt, da die Maschine als Pfand für den Kredit akzeptiert wurde. Damit ist das Erlösdefizit aus D-0042 geklärt. Nächste Einzelfrage: wie der zum Verwertungszeitpunkt aktuelle Marktwert ermittelt wird. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0067](checkpoints/MCP-2026103001.md#cp-0067).

Nutzerentscheidung D-0044: V1 umfasst ein Hintergrund-Wirtschaftssystem, das relevante Ressourcen und Produkte nachverfolgt. Rohstoffpreise beruhen grundsätzlich auf geeigneten Quellen, werden in V1 aber als statische Zahlen mit linearer jährlicher Preissteigerung von 2 % geführt. Produkte werden linear 2 % je Jahr teurer; Maschinen und andere Güter verlieren gemäß fester Nutzungsdauer anteilig an Wert. Der Maschinenmarktwert bei Verwertung basiert auf einem jährlich um 2 % angepassten Neupreis abzüglich des Wertverlusts aus bisheriger Nutzung. Konkrete Formel, Basispreise und Nutzungsdauern bleiben offen; keine Live-Marktdatenintegration. Nächste Einzelfrage: feste Gesamtnutzungsdauer der vorhandenen CNC-Maschine. Nachweis: [CP-0068](checkpoints/MCP-2026103001.md#cp-0068).

Nutzerentscheidung D-0045: Die geplante Gesamtnutzungsdauer der vorhandenen, bei Spielstart acht Jahre alten CNC-Fräsmaschine beträgt 16 Jahre; daraus verbleiben rechnerisch acht Jahre. Der Eröffnungsbuchwert von 40.000 € bleibt unberührt; die genaue Marktwert-/Abschreibungsberechnung ist offen. Nachweis: [CP-0069](checkpoints/MCP-2026103001.md#cp-0069).

Nutzerentscheidungen D-0046 bis D-0052: Der ursprüngliche CNC-Anschaffungspreis beträgt 120.000 €; Restwert = Anschaffungspreis × `max(0, (16 − genutzte Dauer) / 16)`. Die jährliche Neupreisfortschreibung gemäß D-0047 fließt nicht in diesen Restwert ein. Bei acht genutzten Jahren ergibt sich zum Simulationsstart ein Faktor von 0,5. Bilanzbuchwert 40.000 € bleibt getrennt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0076](checkpoints/MCP-2026103001.md#cp-0076).

Nutzerentscheidung D-0053: SimTAX-Bemessungsbasis je Rechnungsposition ist der bestätigte Positionswert vor SimTAX. 19 % und positionsweise Rundung mit anschließender Summierung bleiben bestehen. Nächste Einzelfrage: Regel für exakt halbe Centbeträge. Nachweis: [CP-0077](checkpoints/MCP-2026103001.md#cp-0077).

Nutzerentscheidung D-0054: SimTAX wird bei exakt halben Centbeträgen kaufmännisch gerundet; die Rundung bleibt je Rechnungsposition, danach werden die gerundeten Beträge summiert. Nächste Einzelfrage: Bemessung auf den erweiterten Positionsbetrag oder einzelne Einheiten. Nachweis: [CP-0078](checkpoints/MCP-2026103001.md#cp-0078).

Nutzerentscheidung D-0055: SimTAX wird je Rechnungsposition auf den Positionsgesamtbetrag angewendet und kaufmännisch gerundet; Einzelmengen werden nicht separat besteuert/gerundet. Nächste Einzelfrage: Geltungsbereich von SimTAX (z. B. Kundenrechnungen, Lieferantenrechnungen, Kategorien). Nachweis: [CP-0079](checkpoints/MCP-2026103001.md#cp-0079).

Nutzerentscheidung D-0056: SimTAX wird bei jeder externen Rechnungsstellung verwendet; bei Steuerzahlungen und innerbetrieblichen Ausgleichen wird keine Steuer berechnet. Daraus wird keine Behandlung eingehender externer Rechnungen abgeleitet. Nächste Einzelfrage: Behandlung von Rechnungskorrekturen. Nachweis: [CP-0080](checkpoints/MCP-2026103001.md#cp-0080).

Nutzerentscheidung D-0057: Bei Rechnungskorrekturen wird der ursprüngliche gerundete SimTAX-Betrag referenziert umgekehrt und die Korrektur separat ausgewiesen. Nächste Einzelfrage: SimTAX als getrennte Rechnungskomponente mit eigener Simulationssaldo-Sicht oder bloßer Rechnungsausweis bei bis auf weiteres offener Verrechnung. Nachweis: [CP-0081](checkpoints/MCP-2026103001.md#cp-0081).

Nutzerentscheidung D-0058: SimTAX ist eine getrennte Rechnungskomponente mit eigener Simulationssaldo-Sicht zur Gegenrechnung von Vorsteuer und Umsatzsteuer. Die Zahlung richtet sich nach den Grundsätzen von UStG und AO; Abrechnungszeitraum und konkrete Zahlungsmechanik sind offen. Nachweis: [CP-0082](checkpoints/MCP-2026103001.md#cp-0082).

Nutzerentscheidung D-0059: Der Abrechnungszeitraum des SimTAX-Saldos richtet sich nach dem UStG; A01 legt keinen festen Zeitraum fest. Der relevante Vorjahresparameter und konkrete Zahlungstermine/-ablauf sind noch offen. Nachweis: [CP-0083](checkpoints/MCP-2026103001.md#cp-0083).

Nutzerentscheidung D-0060: Für 2026 wird fiktiv ein Umsatz von 5.000 € je Woche angenommen. Dieser Umsatzwert wird nicht zur Ableitung des Vorjahressteuerbetrags verwendet. Nachweis: [CP-0084](checkpoints/MCP-2026103001.md#cp-0084).

Nutzerentscheidung D-0061: Für das Kalenderjahr 2026 wird ein fiktiver maßgeblicher Umsatzsteuerbetrag von 49.400 € als Vorjahresparameter für den SimTAX-Abrechnungszeitraum gemäß UStG angesetzt. Der Betrag ist ein vorgegebener Szenariowert und wird nicht aus D-0060 abgeleitet. Die konkrete Zahlungsmechanik bleibt offen. Nachweis: [CP-0085](checkpoints/MCP-2026103001.md#cp-0085).

Nutzerentscheidung D-0062: Im V1-BAB beträgt der MGK-Zuschlag 15 % der MEK. Der Satz stammt aus dem A03-Arbeitsvorschlag und wurde vom Nutzer übernommen; weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0086](checkpoints/MCP-2026103001.md#cp-0086).

Nutzerentscheidung D-0063: Im V1-BAB beträgt der FGK-Zuschlag 100 % der Fertigungslöhne. Der Satz stammt aus dem A03-Arbeitsvorschlag und wurde vom Nutzer übernommen; weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0087](checkpoints/MCP-2026103001.md#cp-0087).

Nutzerentscheidung D-0064: Im V1-BAB beträgt der Vw/Vt-GK-Zuschlag 10 % der Herstellkosten. Der Satz stammt aus dem A03-Arbeitsvorschlag und wurde vom Nutzer übernommen; weitere Zuordnungen und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0088](checkpoints/MCP-2026103001.md#cp-0088).

Nutzerentscheidung D-0065: Die monatliche Bruttolohnsumme im V1-Startprofil beträgt insgesamt 10.400 €. Rollenaufteilung, Arbeitgebergesamtkosten und Definition der Fertigungslöhne als FGK-Basis bleiben offen. Nachweis: [CP-0089](checkpoints/MCP-2026103001.md#cp-0089).

Nutzerentscheidung D-0066: Als Fertigungslöhne für den 100-%-FGK-Zuschlag gelten MA-CNC (3.800 €) und MA-PROD (3.100 €), zusammen 6.900 € Bruttolohn pro Monat; MA-AV ist ausgeschlossen. Arbeitgebergesamtkosten bleiben offen. Nachweis: [CP-0090](checkpoints/MCP-2026103001.md#cp-0090).

Nutzerentscheidung D-0067: Arbeitgebergesamtkosten sollen im V1-Personalaufwand zusätzlich zu den Bruttolöhnen berücksichtigt werden. Betrag und Berechnungsregel bleiben offen. Nachweis: [CP-0091](checkpoints/MCP-2026103001.md#cp-0091).

Nutzerentscheidung D-0068: Arbeitgebergesamtkosten betragen zusätzlich 21 % der monatlichen Bruttolohnsumme von 10.400 €, rechnerisch 2.184 € monatlich; der Personalaufwand einschließlich Bruttolöhnen beträgt damit 12.584 € monatlich. Nachweis: [CP-0092](checkpoints/MCP-2026103001.md#cp-0092).

Nutzerentscheidung D-0069: Die 21 % Arbeitgeberkosten für MA-CNC/MA-PROD werden in die FGK-Basis einbezogen. Die Basis beträgt damit 8.349 € monatlich; bei 100 % FGK-Zuschlag ergibt sich derselbe monatliche FGK-Betrag. Arbeitgeberkosten von MA-AV sind ausgenommen. Nachweis: [CP-0093](checkpoints/MCP-2026103001.md#cp-0093).

Nutzerentscheidung D-0070: Der MA-AV-Personalaufwand (3.500 € Bruttolohn plus 21 % Arbeitgeberkosten = 4.235 € monatlich) gehört in den Vw/Vt-GK-Pool und wird nicht als separate zusätzliche Kostenposition neben diesem Pool angesetzt. Der 10-%-Zuschlag auf HK bleibt bestehen. Nachweis: [CP-0094](checkpoints/MCP-2026103001.md#cp-0094).

Nutzerentscheidung D-0071: Die CNC-Abschreibung wird als Fertigungsgemeinkosten im V1-BAB berücksichtigt; Abschreibungsbasis, Methode, Zeitraum und Betrag bleiben offen. Die Restwert-/Verwertungsregel bestimmt diese Abschreibung nicht automatisch. Nachweis: [CP-0095](checkpoints/MCP-2026103001.md#cp-0095).

Nutzerentscheidung D-0072: Für die BAB-Kalkulation der CNC sollen Wiederbeschaffungskosten einschließlich der 2-%-Inflation im maßgeblichen Betrachtungszeitraum berücksichtigt werden. Der Betrachtungszeitraum und die Umlegung auf Periodenkosten bleiben offen. Nachweis: [CP-0096](checkpoints/MCP-2026103001.md#cp-0096).

Letzter Checkpoint: [CP-0096](checkpoints/MCP-2026103001.md#cp-0096).

Nutzerentscheidung D-0036: Zinsbasis ist das Restschuldsaldo des Maschinendarlehens. Rundung der periodischen Zinsbeträge bleibt offen; nächste Frage betrifft die Cent-Rundung. Nachweis: [CP-0060](checkpoints/MCP-2026103001.md#cp-0060).

Nutzerentscheidung D-0035 konkretisiert D-0034 auf die deutsche Zinsmethode 30E/360. Die Zinsbezugsbasis innerhalb der Monatsperiode bleibt offen; nächste Frage betrifft den verwendeten Restschuldsaldo. Nachweis: [CP-0059](checkpoints/MCP-2026103001.md#cp-0059).

Nutzerentscheidung D-0034: Der Darlehenszins wird nach 30/360 berechnet. Die konkrete Monatsend-Variante bleibt offen. Nächste Frage: genaue 30/360-Konvention. Nachweis: [CP-0058](checkpoints/MCP-2026103001.md#cp-0058).

Nutzerentscheidung D-0033: Monatsraten des Maschinendarlehens sind am letzten Geschäftstag fällig. Für Januar 2027 ergibt sich nach D-0011 der 29.01.2027. Zinsberechnung und Rate bleiben offen. Nachweis: [CP-0057](checkpoints/MCP-2026103001.md#cp-0057).

Nutzerentscheidung D-0032: Das Annuitätendarlehen wird monatlich bedient. Datum der ersten Rate und konkreter monatlicher Zahlungstag bleiben offen. Nächste Frage: erste Rate im Simulationszeitraum. Nachweis: [CP-0056](checkpoints/MCP-2026103001.md#cp-0056).

Nutzerentscheidung D-0031: Das Maschinendarlehen hat zum Simulationsstart am 01.01.2027 sieben Jahre Restlaufzeit. Ratenfrequenz und konkrete Zahlungstermine bleiben offen. Nächste Frage: Zahlungsrhythmus. Nachweis: [CP-0055](checkpoints/MCP-2026103001.md#cp-0055).

Nutzerentscheidung D-0030: Das Maschinendarlehen ist ein gleichbleibendes Annuitätendarlehen; Restlaufzeit, Rate und Zahlungsplanparameter bleiben offen. Nächste Frage: Restlaufzeit am Simulationsstart. Nachweis: [CP-0054](checkpoints/MCP-2026103001.md#cp-0054).

Aktueller Mahnfluss: Erste Zahlungserinnerung zehn Kalendertage nach erstem fehlgeschlagenem Zahlversuch (D-0027), formelle Mahnung 14 Kalendertage danach (D-0028); danach keine Eskalation bis Pfändung/Liquidation in V1. Diese Ereignisse sind späteren Versionen vorbehalten (D-0029). Nachweis: [CP-0053](checkpoints/MCP-2026103001.md#cp-0053).

Aktueller Dunning-Stand: Erste Zahlungserinnerung zehn Kalendertage nach erstem fehlgeschlagenem Zahlversuch (D-0027); formelle Mahnung 14 Kalendertage danach (D-0028). Der BGB-Abgleich ergab keinen gesetzlich vorgeschriebenen 14-Tage-Abstand; dies bleibt eine Spielregel. Weitere Eskalationsfristen und Wirkungen sind offen. Nachweis: [CP-0052](checkpoints/MCP-2026103001.md#cp-0052).

Aktueller Dunning-Stand: Die erste Zahlungserinnerung erfolgt zehn Kalendertage nach dem ersten fehlgeschlagenen Zahlversuch (D-0027). Weitere Mahnfristen und Schwellen bleiben offen. Nachweis: [CP-0051](checkpoints/MCP-2026103001.md#cp-0051).

Aktueller Retry-Stand: D-0024 legt eine Woche Abstand fest; D-0025/D-0026 legen fest, dass nach acht fehlgeschlagenen Wiederholungsversuchen nach dem ersten Fehlversuch das Spiel verloren ist. Der erste Fälligkeitsfehlversuch zählt nicht zu den acht Retries. Nachweis: [CP-0050](checkpoints/MCP-2026103001.md#cp-0050).

Aktueller T-0008-Stand: Der Nutzer hat den Niederlagenstatus nach acht fehlgeschlagenen Zahlversuchen festgelegt (D-0025). Ob der erste fehlgeschlagene Fälligkeitsversuch mitzählt, wird noch einzeln geklärt. D-0024 legt wöchentliche Retries fest; Kredit-/Maximalverschuldungs-/Insolvenzregeln bleiben separat zu prüfen. Nachweis: [CP-0049](checkpoints/MCP-2026103001.md#cp-0049).

Aktueller T-0008-Stand: jährlicher individueller Unternehmenszinssatz und Dispozins gemäß D-0022/D-0023 dokumentiert; D-0023 ersetzt die ursprüngliche 8-Basispunkte-Angabe in D-0021 durch 8 % über dem individuell vereinbarten Zinssatz. D-0024 legt wöchentliche Wiederholungsversuche nach fehlgeschlagener eigener Zahlung fest. EZB-Referenzsatz, Bewertungsformel, Anzahl/Ende der Retries sowie Kredit-/Maximalverschuldungs-/Insolvenzregeln bleiben offen. Nachweis: [CP-0047](checkpoints/MCP-2026103001.md#cp-0047), [CP-0048](checkpoints/MCP-2026103001.md#cp-0048).

Abgeschlossene Second-Level Goals und Tickets bleiben historisch dokumentiert und sind nicht Teil des aktiven Kontexts.

## Letzte gesicherte Arbeit

Nutzerentscheidung D-0022/D-0023: Der individuelle Bankzinssatz wird zu Spielbeginn und jährlich auf Basis EZB-Zinssatz plus Unternehmensaufschlag vereinbart; Mittelwert +3 Prozentpunkte, Spanne +0,5 bis +5,5 Prozentpunkte. Der Dispositionskreditzins liegt 8 % über dem individuell vereinbarten Unternehmenszinssatz. EZB-Referenzsatz und Bewertungsformel bleiben offen; Kredit-, Maximalverschuldungs- und Insolvenzregeln sind separat zu prüfen. Nachweis: [CP-0047](checkpoints/MCP-2026103001.md#cp-0047).

Am 2026-10-25 hat der Nutzer D-0018 bestätigt: Kundenforderungen haben in V1 gemäß AGB ein Zahlungsziel von 14 Kalendertagen; individuelle Vereinbarungen sind möglich und können bei Sonderwünschen höhere Margen ermöglichen. Der konkrete abweichende Zeitraum und die Margenformel bleiben offen. T-0008 bleibt IN_PROGRESS; die nächste Einzelfrage klärt den konkreten Zeitraum für Einzelvereinbarungen. Nachweis: [CP-0043](checkpoints/MCP-2026103001.md#cp-0043).

Der Nutzer hat anschließend D-0019 bestätigt: 30 Kalendertage sind die konkrete V1-Alternative bei individueller Kundenvereinbarung. Eine Margenformel ist nicht festgelegt. Die nächste Einzelfrage betrifft das Zahlungsziel für Lieferantenverbindlichkeiten. Nachweis: [CP-0044](checkpoints/MCP-2026103001.md#cp-0044).

Der Nutzer hat D-0020 bestätigt: Für Lieferantenverbindlichkeiten gelten standardmäßig 30 Kalendertage; Abweichungen sind in Ereignissen oder Dauerverträgen möglich. Konkrete Sonderkonditionen bleiben offen. Die nächste Einzelfrage betrifft die Priorität gleichzeitig fälliger eigener Verbindlichkeiten. Nachweis: [CP-0045](checkpoints/MCP-2026103001.md#cp-0045).

Der Nutzer hat D-0021 festgelegt: Der Spieler wählt, welche fälligen eigenen Rechnungen zuerst bezahlt werden; die Nutzung eines Dispositionskredits wird als zusätzliche Option angeboten. Dessen Zinssatz liegt 8 Basispunkte über dem durchschnittlichen Zinssatz. Bezugsgröße dieses Durchschnitts sowie Kreditregeln, Maximalverschuldung und Insolvenz bleiben offen und separat zu prüfen. Nachweis: [CP-0046](checkpoints/MCP-2026103001.md#cp-0046). Die nächste Einzelfrage klärt die Bezugsgröße des Durchschnittszinssatzes.

A02s Maschinenbau-MVP-Spezifikation und Gap-Analyse sind unter `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md` gesichert; der nachträgliche Nachweis steht in [CP-0007](checkpoints/MCP-2026103001.md#cp-0007). A03 hat T-0005 abgeschlossen; Finanzspezifikation und Abschlussnachweis stehen in `docs/accounting/maschinenbau-mvp-finanzspezifikation.md` und [CP-0008](checkpoints/MCP-2026103001.md#cp-0008). Beide Arbeitsergebnisse und Ticketabschlüsse bleiben unverändert.

Der Nutzer hat verbindliche Produktentscheidungen für den Maschinenbau-MVP gegeben. Sie sind als D-0010 im Decision Log festgehalten. Dieser Eintrag ist eine Produktentscheidung und keine Freigabe der Architektur oder ADRs.

T-0006 wurde nach A04-Nachbesserung im Rereview durch A09 QA BESTANDEN und als COMPLETED dokumentiert. Die drei ursprünglichen MAJOR-Befunde sind geschlossen; siehe [QA-Rereview](../qa/maschinenbau-mvp-datenmodell-rereview-cp-0012.md) und [CP-0013](checkpoints/MCP-2026103001.md#cp-0013).

Das geprüfte T-0006-Modell steht unter `docs/database/maschinenbau-mvp-datenmodell.md`; offene Regeln und Zuständigkeiten sind dort ausgewiesen. Die Implementierung bleibt von späteren fachlichen Entscheidungen und separater Freigabe abhängig.

A02 und A03 haben die ältere MINOR-Scope-Abweichung in ihren Spezifikationen gemäß D-0010 bereinigt. V1-Teilverarbeitung ist ausdrücklich ausgeschlossen; spätere Erweiterbarkeit bleibt als Zukunftshinweis. T-0007 ist abgeschlossen; D-0010 wurde nicht geändert.

A03 hat auf Grundlage von CP-0014 die Entscheidungsgrundlage [P0-Finanzoptionen B–E](../accounting/p0-finanzentscheidungen-v1-optionen.md) erstellt; Nachweis: [CP-0015](checkpoints/MCP-2026103001.md#cp-0015). Die A03-Empfehlungen sind Vorschläge, keine Nutzerentscheidung. D-0010 bleibt unverändert; Architektur V0.2 und ADRs bleiben PROPOSED.

A01 hat die zentrale [P0-Nutzerentscheidungsvorlage](p0-entscheidungs-vorlage-maschinenbau-mvp.md) für A, B, C, D, E, F, G und I erstellt. Empfehlungen sind nicht beschlossen; H bleibt gemäß CP-0014 P1. D-0010 und Architekturstatus bleiben unverändert. Nachweis: [CP-0016](checkpoints/MCP-2026103001.md#cp-0016).

A04 hat die angefragten P0-Regeln read-only gegen das abgeschlossene T-0006-Datenmodell geprüft. Mehrere Grundobjekte sind vorhanden, aber Kalender-/Automationsabläufe, Vollstreckungsfälle, konkrete Steuer-/Rundungsregeln, gleitender Durchschnitt, getrenntes Budget/Liquidität und operative Kapazitätsdaten sind nur teilweise oder nicht abgebildet. T-0006 bleibt abgeschlossen; das Ergebnis ist eine separate Modellabdeckungsprüfung, keine Freigabe zur Schemaänderung. Bericht und Nachweis: [P0-Abdeckungsprüfung](../database/p0-produktstand-datenmodell-abdeckung.md); CP-0017 (Checkpoint-Datei im Checkout nicht vorhanden). Die zentrale P0-Vorlage nennt ihre Optionen weiterhin als unentschieden; Nutzerauftrag wurde als Prüfziel, nicht als Änderung von D-0010 oder Entscheidungslog behandelt.

Letzter Checkpoint: CP-0017 (Checkpoint-Datei im Checkout nicht vorhanden).

A02 hat den vorgegebenen P0-Produktstand aus Simulationssicht auf Prozesskonsistenz und deterministische Ausführbarkeit geprüft. Befunde und Ergänzungsvorschläge stehen in [P0-Festlegungen – Simulationsprüfung](../simulation/p0-festlegungen-simulationspruefung.md); Nachweis: [CP-0018](checkpoints/MCP-2026103001.md#cp-0018). A02-/A03-Spezifikationen, D-0010, Datenmodell und Architekturstatus wurden nicht geändert. Operative Folgeklärungen bleiben offen; keine Architektur- oder Implementierungsfreigabe.

A03 hat die Finanzkonsistenz des vorgegebenen P0-Produktstands geprüft und in [P0-Finanzkonsistenzprüfung](../accounting/p0-finanzkonsistenzpruefung.md) dokumentiert; die Finanzspezifikation verweist auf die Konkretisierung. Nachweis: [CP-0019](checkpoints/MCP-2026103001.md#cp-0019). Offene Start-/Rundungs-/Retry-/Eskalationsparameter bleiben Folgearbeit; D-0010 und Architekturstatus bleiben unverändert.

Der Nutzer hat die Eröffnungsbilanz zum 01.01.2027 einschließlich CNC-Buchwert, Maschinendarlehen und Eigenkapital als Restposition festgelegt. A03 hat Bilanzabgleich und Darlehensoptionen in der Finanzspezifikation dokumentiert; CP-0020 wird als historischer Nachweis genannt, seine Checkpoint-Datei ist im Checkout nicht vorhanden und wurde nicht rekonstruiert. Tilgungsart und weitere Darlehensparameter bleiben offen.

Letzter Checkpoint: CP-0020 (Checkpoint-Datei im Checkout nicht vorhanden; nicht rekonstruiert).

A02 hat die vom Nutzer bestätigten Tagesphasen-, F3-, Zahlungs- und G3-Regeln in die Simulationsspezifikation übernommen und ein deterministisches Startauftragsprofil mit drei vollständigen Aufträgen sowie Ressourcenstunden ergänzt. Bericht: [A02-P0-Konkretisierung](../simulation/a02-p0-konkretisierung-aenderungsbericht.md); Nachweis: [CP-0021](checkpoints/MCP-2026103001.md#cp-0021). Offene Kalender-/Finanzparameter bleiben markiert. D-0010, A03-Spezifikation, Datenmodell und Architekturstatus bleiben unverändert; keine Implementierungsfreigabe.

Letzter Checkpoint: [CP-0021](checkpoints/MCP-2026103001.md#cp-0021).

A09 bestätigte im Rereview, dass alle drei MAJOR-Befunde aus CP-0011 durch die in CP-0012 beschriebenen Modellbeziehungen geschlossen sind. Die MINOR-Dokumentationsabweichung wurde mit T-0007 in den A02-/A03-Spezifikationen bereinigt; D-0010 und das Datenmodell bleiben maßgeblich. Fachregeln wurden nicht entschieden. Details: [ursprünglicher QA-Review](../qa/maschinenbau-mvp-datenmodell-review.md), [Rereview](../qa/maschinenbau-mvp-datenmodell-rereview-cp-0012.md), [CP-0011](checkpoints/MCP-2026103001.md#cp-0011), [CP-0012](checkpoints/MCP-2026103001.md#cp-0012), [CP-0013](checkpoints/MCP-2026103001.md#cp-0013), [CP-0014](checkpoints/MCP-2026103001.md#cp-0014).

## Architektur- und Entscheidungsstatus

SLG-000.2 bleibt ACTIVE / PROPOSED. Architektur V0.2 ist nicht freigegeben; ADR-001 bis ADR-008 bleiben PROPOSED; ADR-004 Mapping bleibt OPEN. D-0001 bis D-0009 bleiben PROPOSED und unverändert. D-0010 dokumentiert verbindliche Nutzerentscheidungen zum Produktumfang des Maschinenbau-MVP; es ist keine Architekturentscheidung. Die im D-0010 nicht festgelegten Regeln zu Zeit, Steuer-/Betragssemantik, Kostenbewertung und Prozessdetails bleiben offen.

## Zuvor gesicherte Arbeit

A11 TECHNICAL_ARCHITECT hat die Repository-Bestandsaufnahme auf `main` read-only durchgeführt. A01 prüfte den Bericht gegen die Governance-Dateien. T-0003 und SLG-000.3 sind abgeschlossen; siehe [CP-0002](checkpoints/MCP-2026103001.md#cp-0002).

T-0002 – Architektur V0.2 als vorgeschlagenen Arbeitsstand sichern – ist abgeschlossen. A11 hat die Architekturdatei und acht ADR-Artefakte erstellt; A09 hat die Artefakte geprüft und QA BESTANDEN gemeldet. Commit/Push auf `main` erfolgte unter Commit `56bea77ae63f273e4c025433ab5c7fbcbb1e8a40`; siehe [CP-0006](checkpoints/MCP-2026103001.md#cp-0006).

## Gesicherte Architekturhypothesen

- modularer zentraler Kern
- Application Layer für Commands
- Accounting als fachliche Autorität
- Simulation als fachliche Autorität für Zeit und Perioden
- AI ohne direkte autoritative State-Mutation
- Learning und Exam getrennt
- versionierte Industry Modules
- append-only Event/Audit-Log plus Snapshots für MVP
- deterministische Replay-Fähigkeit
- OpenTycoonOS zunächst nur Referenz

Diese Punkte bleiben Vorschläge und sind keine Architekturfreigabe.

## Dokumentationsregel

Maximal 3 eigenständige Arbeiten ohne Checkpoint.

Kritische Erkenntnisse, Entscheidungen und Blocker sofort dokumentieren.

## Offene Punkte und Blocker

Vor einer vollständigen MVP-Implementierung sind die im CP-0014 priorisierten Zeit-, Betrags-, Zahlungs-, Kosten-, Material-, Abnahme-, Abschluss-, Korrektur- und Startprofilregeln zu klären oder als explizite V1-Regeln durch zuständige Fachrollen und Nutzer festzulegen. D-0010 ist maßgeblich; D-0001 bis D-0009 bleiben unverändert. Die Implementierung ist nicht freigegeben.

Der GitHub-Connector ist projektweit READ-ONLY. Remote-Schreibvorgänge dürfen nur über lokalen Git-Workspace und GitHub Desktop erfolgen, sofern sie später erforderlich sind.

## P0-Validierung Maschinenbau-MVP

A09 hat A02-Simulation, A03-Finanzspezifikation und A04-Datenmodell unabhängig gegen den aktuellen P0-Stand geprüft. Der Review weist Widersprüche im A04-Eröffnungstext und zur automatischen Vollzahlung sowie Modelllücken für SimTAX-Herkunft, Kapazitätsgrenzen und Tagesphasen aus. Offene Finanz-/Kalender-/Mahnparameter bleiben offen; es wurden keine Produktentscheidungen oder Architekturfreigaben getroffen. QA-Ergebnis: nicht bestanden für vollständige Datenmodellfreigabe. Bericht: [P0-Validierungstest](../qa/p0-mvp-unabhaengiger-validierungstest.md); Checkpoint: [CP-0022](checkpoints/MCP-2026103001.md#cp-0022).

CP-0020 wird weiterhin referenziert, fehlt jedoch im aktuellen Checkout; A03s aktualisierte Spezifikation und P0-Prüfung enthalten den Bilanzabgleich. A01 sollte den fehlenden Checkpoint-Nachweis abgleichen.

Letzter Checkpoint: [CP-0022](checkpoints/MCP-2026103001.md#cp-0022).

A04 hat den durch CP-0022 beauftragten, eng begrenzten Abgleich der Datenbankspezifikation abgeschlossen. Das veraltete Eröffnungsmodell und die widersprüchliche Zahlungsbeschreibung sind korrigiert; SimTAX, getrennte Mitarbeiter-/Maschinenkapazitäten, Tagesphasen, same-day-Fortschreibung und bestätigter V1-Mahnfluss sind dokumentiert. Offene Fristen, Schwellen, Prioritäten, Kalenderdetails und Steuerparameter bleiben ausdrücklich OFFEN. In den bearbeiteten Bereichen bestehen keine verbleibenden Widersprüche zu A02/A03. CP-0020 fehlt weiterhin im aktuellen Checkout und wurde nicht rekonstruiert. Bericht: [A04-Änderungsbericht](../database/a04-cp-0022-aenderungsbericht.md); Nachweis: [CP-0023](checkpoints/MCP-2026103001.md#cp-0023). Keine Implementierung, Schemaänderung oder Freigabe; D-0010, Ticketboard, A02 und A03 unverändert.

Letzter Checkpoint: [CP-0023](checkpoints/MCP-2026103001.md#cp-0023).

A03 hat den durch A09-Re-Review HIGH-2 FAIL festgestellten Widerspruch in der Finanzspezifikation behoben: Die Aussagen gegen Mahn-/Inkassologik sowie die offene Darstellung automatischer Zahlung am Fälligkeitstag wurden an die bestätigte automatische Vollzahlungsregel und den bestätigten V1-Mahn-/Dunning-Fluss angepasst. Priorität konkurrierender Zahlungen, Retry-Zeitpunkt/-Fristen und konkrete Mahnfristen/-schwellen bleiben OFFEN. Keine Implementierung, Datenbankänderung, Migration oder Architekturänderung; D-0010 blieb unverändert. Änderungsbericht: [A03-Änderungsbericht CP-0024](../accounting/a03-cp-0024-zahlungsfluss-aenderungsbericht.md); Nachweis: [CP-0024](checkpoints/MCP-2026103001.md#cp-0024).

Letzter Checkpoint: [CP-0024](checkpoints/MCP-2026103001.md#cp-0024).

A02 hat in der Simulationsspezifikation Kundenzahlungseingänge von eigenen Lieferanten-/Gläubigerzahlungen getrennt. Kundeneingänge folgen Kundenverhalten ohne Prüfung eigener Liquidität; eigene Ausgänge versuchen am Fälligkeitstag vollständige Zahlung mit Liquiditätsprüfung, dokumentieren Fehlschlag und übergeben den vollen offenen Posten in den bestätigten V1-Mahnfluss. Retry-, Prioritäts- und Mahnparameter bleiben offen. Bericht: [A02-Zahlungsrichtungen](../simulation/a02-zahlungsrichtungen-aenderungsbericht.md); Nachweis: [CP-0025](checkpoints/MCP-2026103001.md#cp-0025). D-0010, A03, Datenmodell, Architektur/ADRs und Tickets unverändert.

Letzter Checkpoint: [CP-0025](checkpoints/MCP-2026103001.md#cp-0025).

A03 hat die Finanzspezifikation mit CP-0025 synchronisiert und Kundenzahlungseingänge von eigenen Lieferanten-/Gläubigerzahlungen getrennt. Kundeneingänge folgen Kundenverhalten ohne Prüfung eigener Liquidität; eigene fällige Verbindlichkeiten lösen einen Vollzahlungsversuch mit Liquiditätsprüfung und bestätigtem Dunning-Übergang bei Fehlschlag aus. Retry, Zahlungspriorität, konkrete Mahnfristen/-schwellen und darlehensspezifischer Zahlungsplan bleiben offen. Beim Abgleich besteht kein verbleibender Widerspruch zu CP-0025/A02. Keine Implementierung, Datenbankänderung, Migration, Architekturentscheidung oder Änderung von D-0010; Architektur V0.2 und ADRs bleiben PROPOSED. Bericht: [A03-Zahlungsrichtungen](../accounting/a03-cp-0026-zahlungsrichtungen-aenderungsbericht.md); Nachweis: [CP-0026](checkpoints/MCP-2026103001.md#cp-0026).

Letzter Checkpoint: [CP-0026](checkpoints/MCP-2026103001.md#cp-0026).

A04 prüfte die Datenbankspezifikation gegen CP-0025/A02 und CP-0026/A03. Dabei wurde eine Modelllücke gefunden: generischer Zahlungsversuch und Mahnfall ließen sowohl Forderungen als auch Verbindlichkeiten zu, wodurch das Cash-Gate potentiell auf Kundeneingänge angewendet werden konnte. A04 hat die Dokumentation richtungsgetrennt: Kundeneingang ohne eigenes Cash-Gate, `payable_payment_attempt` und Dunning ausschließlich für eigene Verbindlichkeiten; Zahlungszuordnung folgt der Richtung. Kundenverhalten, Retry, Zahlungspriorität, Mahnfristen/-schwellen und Darlehenszahlungsplan bleiben offen. Keine verbleibenden Widersprüche zu CP-0025/CP-0026. Änderungsbericht: [A04-Zahlungsrichtungsabgleich](../database/a04-cp-0025-0026-zahlungsrichtungen-aenderungsbericht.md); Nachweis: [CP-0027](checkpoints/MCP-2026103001.md#cp-0027). Keine Implementierung, Migration, physische Datenbankänderung, Architekturentscheidung oder Produktentscheidung.

Letzter Checkpoint: [CP-0027](checkpoints/MCP-2026103001.md#cp-0027).

A09 hat den finalen gezielten Re-Review des ursprünglichen HIGH-2-Befunds bestanden: Kundeneingänge laufen ohne Cash-Gate nach Kundenverhalten; automatische Vollzahlungsversuche, eigene Liquiditätsprüfung und Dunning sind ausschließlich für Payables modelliert. Versuch, tatsächliche Zahlung und offene Posten bleiben getrennt. Kundenverhalten, Retry, Priorität und konkrete Mahnfristen/-schwellen bleiben offen. Bericht: [Finaler Re-Review HIGH-2](../qa/high-2-zahlungsrichtungen-rereview.md); Nachweis: [CP-0028](checkpoints/MCP-2026103001.md#cp-0028).

Letzter Checkpoint: [CP-0028](checkpoints/MCP-2026103001.md#cp-0028).

## P0-Architektur-Gegenprüfung

A11 hat den validierten P0-Fachstand aus A02, A03 und A04 gegen Architektur V0.2/ADRs geprüft. Ergebnis: ohne grundlegenden Architekturbruch überführbar; keine CRITICAL-/HIGH-Befunde. Zahlungsrichtungen, Zahlungsversuch/Zahlung, A02/A03-Autorität und A04-Persistenzmodell sind in den geprüften Artefakten klar getrennt. Zeit-, SimTAX-, BAB-, Startbilanz-, Darlehens- und Kapazitätsregeln passen in die vorgeschlagenen Grenzen; offene Parameter erzwingen derzeit keine Architekturentscheidung. Dokumentarische MEDIUM-Punkte: V0.2 §8 sollte den Monatslauf gegenüber täglicher Auflösung im Wochenraster präzisieren; A04 §3.2 sollte seine pauschal offenen Abschluss-/Abnahmeregeln an F3/G3 und §3.3 angleichen. CP-0020 fehlt im Checkout und wurde nicht rekonstruiert. Bericht: [P0-Architektur-Gegenprüfung](../architecture/p0-architecture-review-cp-0029.md); Checkpoint: [CP-0029](checkpoints/MCP-2026103001.md#cp-0029). Keine ADR-/D-ID-Freigabe, Implementierung oder Änderung der Fachspezifikationen.

Letzter Checkpoint: [CP-0029](checkpoints/MCP-2026103001.md#cp-0029).

## CP-0029-MEDIUM-Dokumentationskorrekturen

A11 hat die beiden in CP-0029 festgestellten MEDIUM-Punkte ausschließlich dokumentarisch behoben. Architektur V0.2 §8 trennt Wochenraster, tageweise Auflösung, Ereignis-Kalendertage und Monats-/Periodenabschluss; die bestätigte Tagesreihenfolge und Same-Day-Fortschreibung bleiben unverändert. A04 §3.2 nennt nun F3 (fünf Arbeitstage nach vollständiger Lieferung, Liefertag zählt nicht; Ablehnung führt in `ABLEHNUNG_IN_KLÄRUNG` und verhindert automatische Abnahme), automatische Rechnung nach bestätigter Abnahme sowie G3 (Abschluss erst nach vollständigem Kundenzahlungseingang; Lieferantenverbindlichkeiten blockieren nicht). CP-0020 fehlt weiterhin im Checkout; es wurde nicht rekonstruiert. D-0010 blieb unverändert, ADR-001 bis ADR-008 bleiben PROPOSED. Änderungsbericht: [A11-Änderungsbericht CP-0029](../architecture/a11-cp-0029-medium-korrekturen-aenderungsbericht.md); Checkpoint: [CP-0030](checkpoints/MCP-2026103001.md#cp-0030). Keine Implementierung oder Datenbankänderung.

Letzter Checkpoint: [CP-0030](checkpoints/MCP-2026103001.md#cp-0030).

## Gesamtstand des validierten P0-Fachstands

Der konsolidierte und referenzierbare Stand aus CP-0021 bis CP-0030 ist in [CP-0031](checkpoints/MCP-2026103001.md#cp-0031) zusammengeführt. Er umfasst Simulationsstart 01.01.2027, Wochenraster mit tageweiser Auflösung, F3/G3, SimTAX 19 % mit Positionsrundung, gleitenden Durchschnitt, ausgeglichene Eröffnungsbilanz 95.300 €, getrennten 50.000-€-Rahmen, getrennte Zahlungsrichtungen und V1-Mahnfluss. A04 hat Zahlungsrichtungen, Verbindlichkeit, Zahlungsversuch und tatsächliche Zahlung getrennt; A11s MEDIUM-Korrekturen sind laut CP-0030 abgeschlossen. P0 ist fachlich/strukturell validiert; dies erteilt keine Implementierungs- oder Architekturfreigabe. ADR-001 bis ADR-008 bleiben PROPOSED. Offene Parameter sind in CP-0031 aufgelistet.

**Provenienz:** CP-0020 fehlt weiterhin im Checkout. Er wurde nicht rekonstruiert und nicht durch Annahmen ersetzt. Der aktuelle P0-Inhalt ist über die vorhandenen CP-0021 bis CP-0030 und die verlinkten aktuellen Spezifikationen nachvollziehbar; die historische Nachweislücke von CP-0020 bleibt bestehen.

Letzter Checkpoint: [CP-0031](checkpoints/MCP-2026103001.md#cp-0031).

## P0-Parameterkoordination (T-0008)

A01 hat die in CP-0031 und den aktuellen A02-/A03-/A04-Unterlagen offenen P0-Parameter in [P0-Koordinierung offener Fachparameter](p0-offene-parameter-koordinierung.md) zusammengeführt. T-0008 ist ein aktives Koordinationsticket unter MG-000 / SLG-000.2. A02 (Simulation) und A03 (Accounting/Finance) bleiben fachlich autoritativ; vorgeschlagene Folgeaufträge an sie sind noch nicht begonnen und nicht als abgeschlossene Arbeit zu verstehen. A04 wird erst nach bestätigten Fachregeln und separatem Auftrag für eine Modellfolgenprüfung benötigt.

Die Entscheidungsvorlage hält gesicherte Regeln und offene Nutzer-/Fachfragen getrennt. Insbesondere bleiben Tilgungsart, Restlaufzeit, Rate, Zahlungstermine und Zinsbehandlung des Darlehens offen; es wurden weder Optionen gewählt noch Defaultwerte ergänzt. Kundenzahlungseingänge ohne eigenes Cash-Gate und eigene Auszahlungen mit Liquiditätsprüfung bleiben getrennte Zahlungsrichtungen. D-0010 und der Status von Architektur V0.2 / ADR-001 bis ADR-008 wurden nicht geändert; keine Produkt- oder Architekturentscheidung wurde getroffen.

**Nächster Übergabepunkt:** Die Kalenderentscheidung ist in D-0011 festgehalten. A02 soll sie in die Simulationsspezifikation übernehmen; A02/A03 stimmen die verbleibenden 14-/30-Tage-Fälligkeitsregeln ab. Weitere offene Nutzerentscheidungen werden im Rahmen von T-0008 eingeholt. Siehe [CP-0032](checkpoints/MCP-2026103001.md#cp-0032) und [CP-0033](checkpoints/MCP-2026103001.md#cp-0033). CP-0020 fehlt weiterhin und wurde nicht rekonstruiert.


**Nutzerentscheidung 2026-10-25 (D-0011):** Der V1-Arbeitskalender ist bestätigt: Montag bis Freitag Arbeitstage, je Beschäftigtem 8 Stunden pro Arbeitstag zur Auflösung der 40-h-Woche, CNC 8 operative Stunden pro Arbeitstag zur Auflösung von 40 h/Woche, Wochenenden arbeitsfrei, Feiertage in V1 unberücksichtigt. Wochenendtermine werden auf den nächsten Arbeitstag verschoben; F3 zählt fünf Arbeitstage ab dem Folgetag der vollständigen Lieferung. A02 muss die Regel noch in der Simulationsspezifikation übernehmen. Die Fristanker und Zählung für 14-/30-Tage-Zahlungsziele bleiben offen. Nachweis: [CP-0033](checkpoints/MCP-2026103001.md#cp-0033).

Letzter Checkpoint: [CP-0033](checkpoints/MCP-2026103001.md#cp-0033).

## A02-Folgeauftrag zum V1-Arbeitskalender (T-0009)

Nach der Nutzerentscheidung D-0011 ist T-0009 als separates A02-Fachticket unter MG-000 / SLG-000.2 angelegt. A02 soll den bestätigten Arbeitskalender in die Simulationsspezifikation übernehmen und überholte offene Aussagen zu Tageskapazität und Feiertagen bereinigen. T-0009 ist PENDING; es wird keine bereits begonnene oder abgeschlossene A02-Arbeit behauptet.

Der Fristanker und die Tageszählung vertraglicher 14-/30-Tage-Zahlungsziele bleiben ausdrücklich außerhalb der Entscheidung D-0011 und müssen mit A03 abgestimmt werden. T-0008 bleibt als separates A01-Koordinationsticket aktiv. Übergabenachweis: [CP-0034](checkpoints/MCP-2026103001.md#cp-0034).


## Kommunikationsrouting (D-0012)

Ab CP-0035 gilt verbindlich: Agentenantworten und Rückfragen gehen an A01. A01 bündelt erforderliche Nutzerfragen. Antworten ohne weiteren Nutzerklärungsbedarf werden von A01 in den nächsten nötigen Auftrag mit benanntem Adressaten überführt; wenn kein weiterer Schritt nötig ist, dokumentiert A01 den Abschluss. Abhängige Folgeaufträge warten auf erforderliche Nutzerantworten. Grundlage: Nutzerauftrag vom 2026-10-25 und [D-0012](decision-log.md#d-0012--verbindliches-kommunikationsrouting).

Letzter Checkpoint: [CP-0036](checkpoints/MCP-2026103001.md#cp-0036).



## A03-Finanzparameter für T-0008

A03 hat im Koordinierungskontext T-0008 eine Entscheidungsvorlage einschließlich Änderungsbericht erstellt; ein separates A03-Ticket wurde nicht angelegt. Die [A03-Entscheidungsvorlage](../accounting/a03-p0-finanzparameter-entscheidungsvorlage.md) bündelt Fristanker/Zählung, eigene Auszahlungspriorität, Retry/Dunning, Darlehensplan, SimTAX und BAB-/Kostenparameter. Die Arbeit ist durch [CP-0035](checkpoints/MCP-2026103001.md#cp-0035) nachgewiesen.

Als bestätigt dokumentiert sind D-0011, Darlehensrestschuld 24.000 €, nominal 5 % p.a. bei ursprünglich zehn Jahren Finanzierung, SimTAX 19 % mit Cent-Rundung je Position und Summierung sowie der statische BAB-Umfang in V1. Die konkreten Darlehensplanparameter, Fälligkeitsformel, Auszahlungspriorität, Retry-/Mahnparameter, SimTAX-Basis und konkrete BAB-/Kostenwerte bleiben offen. Frühere BAB-Sätze 15 % / 100 % / 10 % sind unbestätigte Vorschläge.

A01 bündelt die offenen Nutzerfragen unter T-0008. Die abhängige A02/A03-Abstimmung zu Fristanker, Zähltagen und Ereignis-/Phasenbezug wird bis zur A02-Übernahme von D-0011 unter T-0009 und erforderlichen Nutzerantworten zurückgestellt. Kundeneingänge ohne eigenes Cash-Gate und eigene Auszahlungen mit Liquiditätsprüfung bleiben getrennte Flüsse. Keine Regel wurde durch A01 beschlossen; D-0010/D-0011, Architektur und ADR-Status bleiben unverändert. Siehe [CP-0037](checkpoints/MCP-2026103001.md#cp-0037).

Letzter Checkpoint: [CP-0037](checkpoints/MCP-2026103001.md#cp-0037).

## Nutzerentscheidung zu Kundenforderungen (D-0013)

Der Nutzer hat festgelegt, dass für Kundenforderungen der spätere Zeitpunkt aus Rechnungsdatum und tatsächlichem Leistungsereignis den Fristanker bildet. Wenn die Leistung nur aus Lieferung besteht, ist das Lieferdatum maßgeblich. Die Nutzerantwort zur Abnahme als Bedingung des Wirksamwerdens und deren Berücksichtigung nur bei Geltendmachung eines rechtlichen Anspruchs (Ereignis/Lernkarte) ist wörtlich in D-0013 festgehalten; sie wird nicht auf Lieferantenforderungen übertragen. Fristanker/Zähltage für Lieferantenverbindlichkeiten sowie 14-/30-Tage-Auswahl bleiben offen.

T-0008 bleibt IN_PROGRESS. A02-Übernahme von D-0011 unter T-0009 und anschließende A02/A03-Abstimmung sind weiterhin erforderlich. Nachweis: [CP-0038](checkpoints/MCP-2026103001.md#cp-0038).

Letzter Checkpoint: [CP-0038](checkpoints/MCP-2026103001.md#cp-0038).

## Nutzerentscheidung zu Lieferantenverbindlichkeiten (D-0014)

Für V1 ist bei pünktlicher Lieferung das Rechnungsdatum der Fristanker. Für spätere Vertragsausgestaltungen kann je Vereinbarung ein anderer Anker gelten, darunter Wareneingang. Offen bleiben Zahlungsziel 14/30 Tage, Kalender-/Arbeitstagszählung und Ankertagszählung. Nachweis: [CP-0039](checkpoints/MCP-2026103001.md#cp-0039).

T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING bis A02 die beauftragte Übernahme von D-0011 beginnt. Die A02/A03-Abstimmung zur Fälligkeits-/Ereignisumsetzung wird entsprechend der Abhängigkeit zurückgestellt.

Letzter Checkpoint: [CP-0039](checkpoints/MCP-2026103001.md#cp-0039).

## Zähltage für Kundenforderungen (D-0015)

Der Nutzer hat festgelegt, dass die vereinbarten 14-/30-Tage-Ziele für Kundenforderungen in V1 Kalendertage zählen. Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Die Ankertagszählung bleibt offen; D-0015 gilt nicht für Lieferantenverbindlichkeiten. Nachweis: [CP-0040](checkpoints/MCP-2026103001.md#cp-0040).

Letzter Checkpoint: [CP-0040](checkpoints/MCP-2026103001.md#cp-0040).

## Zähltage für Lieferantenverbindlichkeiten (D-0016)

Der Nutzer hat festgelegt, dass die vereinbarten 14-/30-Tage-Ziele für Lieferantenverbindlichkeiten in V1 Kalendertage zählen. Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Die Ankertagszählung bleibt offen. Nachweis: [CP-0041](checkpoints/MCP-2026103001.md#cp-0041).

Letzter Checkpoint: [CP-0041](checkpoints/MCP-2026103001.md#cp-0041).

## Ankertagzählung für Zahlungsziele (D-0017)

Der Nutzer hat festgelegt, dass bei Kundenforderungen und Lieferantenverbindlichkeiten der Ankertag als Tag 1 zählt. Zusammen mit der Kalenderzählung D-0015/D-0016 ergibt sich vor Wochenendverschiebung das Ankerdatum plus (N−1) Kalendertage. Wochenendverschiebung erfolgt gemäß D-0011. Nachweis: [CP-0042](checkpoints/MCP-2026103001.md#cp-0042).

Letzter Checkpoint: [CP-0042](checkpoints/MCP-2026103001.md#cp-0042).

A03 hat im T-0008-Koordinierungskontext eine Entscheidungsvorlage für offene P0-Finanzparameter erstellt; dies ist keine Ticketvergabe für einen separaten A03-Auftrag. Die Vorlage behandelt 14-/30-Tage-Fristanker und Zählung, eigene Auszahlungspriorität/Retry/Dunning, Darlehen, SimTAX sowie D3-BAB-/Kosteninputs. D-0011 ist bestätigt, aber A02s Übernahme unter T-0009 bleibt PENDING; konkrete Zahlungszielzählung und Ereignisbezug sind bis zur Nutzerentscheidung und A02-Abstimmung offen. Frühere D3-Satzwerte wurden als unbestätigte Arbeitsvorschläge gekennzeichnet. Keine Werte oder Defaults neu entschieden. D-0010 und Architektur-/ADR-Status unverändert. Bericht: [A03-P0-Finanzparameter](../accounting/a03-p0-finanzparameter-aenderungsbericht.md); Nachweis: [CP-0035](checkpoints/MCP-2026103001.md#cp-0035).

Letzter Checkpoint: [CP-0036](checkpoints/MCP-2026103001.md#cp-0036).
## Aktueller Entscheidungsstand: CNC-Wiederbeschaffungsbasis im BAB (D-0073)

Für den Inflationszeitraum des CNC-Wiederbeschaffungswerts im BAB soll die gesamte CNC-Nutzungsdauer angesetzt werden. D-0045 legt diese auf 16 Jahre fest; die acht verbleibenden Nutzungsjahre sind nicht der maßgebliche Inflationszeitraum. Die Preisbezugsformel lautet 120.000 € × 1,02^16 gemäß D-0046/D-0047. Die Umlegung auf BAB-Periodenkosten und die konkrete Buchabschreibung bleiben offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0097](checkpoints/MCP-2026103001.md#cp-0097).

Letzter Checkpoint: [CP-0097](checkpoints/MCP-2026103001.md#cp-0097).
## Aktueller Entscheidungsstand: monatliche CNC-Wiederbeschaffungsbasis im BAB (D-0074)

Der inflationsangepasste CNC-Wiederbeschaffungswert wird anteilig auf einen Monat der 16-jährigen Gesamtnutzungsdauer verteilt, also auf 192 Monate. Der monatliche BAB-Bezugsbetrag lautet `(120.000 € × 1,02^16) / 192`. Die Rundungsregel für den Monatsbetrag und die vollständige Buchabschreibungsbehandlung bleiben offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0098](checkpoints/MCP-2026103001.md#cp-0098).

Letzter Checkpoint: [CP-0098](checkpoints/MCP-2026103001.md#cp-0098).
## Aktueller Entscheidungsstand: Aufrunden des monatlichen CNC-BAB-Bezugsbetrags (D-0075)

Der monatliche CNC-BAB-Bezugsbetrag gemäß D-0074 wird für die Kalkulation immer aufgerundet. Die Rundungsgenauigkeit bzw. Einheit ist noch offen; ebenso die vollständige Buchabschreibungsbehandlung. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0099](checkpoints/MCP-2026103001.md#cp-0099).

Letzter Checkpoint: [CP-0099](checkpoints/MCP-2026103001.md#cp-0099).
## Aktueller Entscheidungsstand: volle-Euro-Aufrundung des CNC-BAB-Betrags (D-0076)

Der monatliche CNC-BAB-Bezugsbetrag aus D-0074 wird gemäß D-0075 stets auf den nächsten vollen Euro aufgerundet. Die bilanzielle Buchabschreibungsbehandlung bleibt davon getrennt offen. A03 soll die bestätigte kalkulatorische BAB-Regel in die Finanzspezifikation übernehmen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0100](checkpoints/MCP-2026103001.md#cp-0100).

Letzter Checkpoint: [CP-0100](checkpoints/MCP-2026103001.md#cp-0100).
## Aktueller Entscheidungsstand: separate bilanzielle CNC-Buchabschreibung (D-0077)

V1 führt zusätzlich zur kalkulatorischen BAB-Kostenbasis eine separate bilanzielle Buchabschreibung der CNC. Methode, Abschreibungsbasis, Beginn, Restlaufzeit, Restwert und Periodenbetrag bleiben offen. Der Eröffnungsbuchwert von 40.000 € bleibt unverändert, bis eine Fortschreibungsregel geklärt ist. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0101](checkpoints/MCP-2026103001.md#cp-0101).

Letzter Checkpoint: [CP-0101](checkpoints/MCP-2026103001.md#cp-0101).
## Aktueller Entscheidungsstand: bilanzielle Abschreibung laufender und neuer Anschaffungen (D-0078)

Für laufende Anschaffungen gilt die lineare Abschreibung nach der AfA-Tabelle des Bundesfinanzministeriums. Die Abschreibungsmethode für Neuanschaffungen wird einmal jährlich festgelegt. Für die vorhandene CNC bleiben AfA-Tabellenposition, Nutzungsdauer, Abschreibungsbasis, Beginn und Periodenbetrag offen. Die Bilanzabschreibung ist von der kalkulatorischen BAB-Kostenbasis getrennt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0102](checkpoints/MCP-2026103001.md#cp-0102).

Letzter Checkpoint: [CP-0102](checkpoints/MCP-2026103001.md#cp-0102).
## Aktueller Entscheidungsstand: jährliche Spielerwahl für Neuanschaffungen (D-0079)

Die jährliche Festlegung der Abschreibungsmethode für Neuanschaffungen ist eine Spielerentscheidung. Die auswählbaren Methoden bleiben offen. Für laufende Anschaffungen gilt weiterhin die lineare AfA-Tabellenmethode gemäß D-0078. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0103](checkpoints/MCP-2026103001.md#cp-0103).

Letzter Checkpoint: [CP-0103](checkpoints/MCP-2026103001.md#cp-0103).
## Aktueller Entscheidungsstand: Abschreibungsmethoden für Neuanschaffungen (D-0080)

Die Nutzerkorrektur ersetzt die jährliche Abfrage: Sie erfolgt zu Spielbeginn; danach kann die Methode im Menü für zukünftige Neuanschaffungen geändert werden. Verfügbare Methoden sollen linear, degressiv, GWG-Sofortabzug und GWG-Sammelposten sein. Für laufende Anschaffungen gilt weiterhin lineare AfA nach BMF-Tabelle. Offen sind die Auswahlregel im GwG-Überschneidungsbereich über 250 € bis 800 € und die zeitliche Verfügbarkeit der degressiven AfA in späteren Spieljahren. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0104](checkpoints/MCP-2026103001.md#cp-0104).

Letzter Checkpoint: [CP-0104](checkpoints/MCP-2026103001.md#cp-0104).
## Aktueller Entscheidungsstand: GWG-Auswahl je Wirtschaftsjahr (D-0081)

Für den Überschneidungsbereich über 250 € bis einschließlich 800 € wird einheitlich je Wirtschaftsjahr zwischen Sofortabzug und Sammelposten gewählt; die Wahl unterscheidet sich nicht je einzelner Anschaffung innerhalb desselben Jahrs. Die Methode bleibt nach D-0080 im Menü für künftige Anschaffungen änderbar; ab wann die Änderung wirksam wird, bleibt offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0105](checkpoints/MCP-2026103001.md#cp-0105).

Letzter Checkpoint: [CP-0105](checkpoints/MCP-2026103001.md#cp-0105).
## Aktueller Entscheidungsstand: Wirksamkeit einer GWG-Menüänderung (D-0082)

Eine im Menü geänderte GWG-Methode wird ab dem nächsten Wirtschaftsjahr wirksam. Zusammen mit D-0081 bleibt die GWG-Auswahl innerhalb jedes Wirtschaftsjahrs einheitlich. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0106](checkpoints/MCP-2026103001.md#cp-0106).

Letzter Checkpoint: [CP-0106](checkpoints/MCP-2026103001.md#cp-0106).
## Aktueller Entscheidungsstand: degressive AfA als spätere Spielregel (D-0083)

Die degressive AfA soll auch nach dem derzeit dokumentierten gesetzlichen Zeitraum als vereinfachte Spielregel angeboten werden. Dies ist keine Aussage zur steuerrechtlichen Zulässigkeit außerhalb dieses Zeitraums. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0107](checkpoints/MCP-2026103001.md#cp-0107).

Letzter Checkpoint: [CP-0107](checkpoints/MCP-2026103001.md#cp-0107).
## Aktueller Entscheidungsstand: Berechnungssatz der degressiven AfA (D-0084)

Der degressive Satz ist der niedrigere Wert aus 30 % und dem Dreifachen des linearen AfA-Satzes für das Wirtschaftsgut; er wird auf den jeweiligen Restbuchwert angewendet. Nach D-0083 wird diese Begrenzung auch nach dem dokumentierten gesetzlichen Zeitraum als Spielregel fortgeführt, ohne Aussage zur steuerrechtlichen Zulässigkeit. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0108](checkpoints/MCP-2026103001.md#cp-0108).

Letzter Checkpoint: [CP-0108](checkpoints/MCP-2026103001.md#cp-0108).
## Aktueller Entscheidungsstand: CNC-Buchabschreibung nach BMF-AfA-Tabelle (D-0085)

Für die separate lineare bilanzielle Buchabschreibung der bestehenden CNC ist die einschlägige Nutzungsdauer gemäß BMF-AfA-Tabelle maßgeblich; D-0045s 16-jährige betriebliche Gesamtnutzungsdauer ersetzt diese nicht automatisch. Tabellenposition, Restnutzungsdauer und Berechnungsbasis bleiben offen und brauchen fachlichen Abgleich. BAB-Kostenbasis bleibt getrennt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0109](checkpoints/MCP-2026103001.md#cp-0109).

Letzter Checkpoint: [CP-0109](checkpoints/MCP-2026103001.md#cp-0109).
## Aktueller Entscheidungsstand: Bemessungsbasis der CNC-Buchabschreibung (D-0086)

Die Bemessungsbasis der weiteren CNC-Buchabschreibung sind die ursprünglichen Anschaffungskosten von 120.000 € abzüglich bereits erfolgter AfA. Der Eröffnungsbuchwert von 40.000 € bleibt als Buchstand zum Simulationsstart bestehen. Konkreter bisheriger AfA-Verlauf und Restnutzungsdauer nach der BMF-Tabelle sind fachlich abzugleichen; es wird keine AfA-Historie abgeleitet. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0110](checkpoints/MCP-2026103001.md#cp-0110).

Letzter Checkpoint: [CP-0110](checkpoints/MCP-2026103001.md#cp-0110).
## Aktueller Entscheidungsstand: Abschreibungstermin im Startbestand (D-0087)

Für alle bei Spielstart bereits im Unternehmen befindlichen AfA-Gegenstände ist der erste Arbeitstag des zweiten Quartals Abschreibungstermin. Bei Neuanschaffungen richtet sich der Abschreibungszeitpunkt nach den jeweils geltenden gesetzlichen Regelungen. Der konkrete AfA-Tabelleneintrag und Periodenbeträge bleiben fachlich zu bestimmen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0111](checkpoints/MCP-2026103001.md#cp-0111).

Letzter Checkpoint: [CP-0111](checkpoints/MCP-2026103001.md#cp-0111).
## Aktueller Entscheidungsstand: Zuordnung der AfA im Startbestand (D-0088)

Der jährliche Abschreibungstermin am ersten Arbeitstag des zweiten Quartals erfasst die AfA des laufenden Wirtschaftsjahrs für die AfA-Gegenstände im Startbestand. Der Betrag für die CNC und der historische AfA-Verlauf bleiben gemäß BMF-AfA-Tabelle fachlich abzugleichen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0112](checkpoints/MCP-2026103001.md#cp-0112).

Letzter Checkpoint: [CP-0112](checkpoints/MCP-2026103001.md#cp-0112).
## Offener Abgleich: CNC-Anschaffungsmonat und bisherige Altersregel

Der Nutzer nennt April 2019 als Anschaffungsmonat der bestehenden CNC. Bezogen auf den Simulationsstart 01.01.2027 sind knapp acht Jahre (sieben volle Jahre; der genaue Tag im April ist nicht angegeben) verstrichen; D-0045/D-0048 verwenden acht Jahre und einen Nutzungswertverlust von 50 %. D-0045/D-0048 bleiben unverändert, bis der Nutzer die zeitliche Auslegung klärt. Die Angabe April 2019 ist noch nicht als neue D-ID im Decision Log geführt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0113](checkpoints/MCP-2026103001.md#cp-0113).

Letzter Checkpoint: [CP-0113](checkpoints/MCP-2026103001.md#cp-0113).
## Auflösung des CNC-Altersabgleichs (D-0089)

Der Nutzer hat den CNC-Anschaffungszeitpunkt auf 01.01.2019 angepasst. Zum Simulationsstart 01.01.2027 beträgt die Nutzungszeit genau acht Jahre; D-0045 und D-0048 bleiben unverändert und konsistent. CP-0113s Aussage „sieben Jahre und neun Monate“ war aus der bloßen Monatsangabe April 2019 nicht hinreichend ableitbar und wird durch diese Festlegung überholt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0089](decision-log.md#d-0089--cnc-anschaffungsdatum-auf-01012019-angepasst), [CP-0114](checkpoints/MCP-2026103001.md#cp-0114).

Letzter Checkpoint: [CP-0114](checkpoints/MCP-2026103001.md#cp-0114).

## Nutzerentscheidung: Stahl-Anfangsmenge (D-0090)

Für das V1-Startprofil am 01.01.2027 wurde eine Anfangsmenge von 2.000 kg Stahl bestätigt. Damit ist nur die Menge festgelegt; der Eröffnungswert bzw. die E3-Start-WAP-Basis von 6.400 € / 3,20 € je kg bleibt separat offen, ebenso Preisbasis, Bezugskosten/SimTAX und Rundungsregeln. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0090](decision-log.md#d-0090--stahl-anfangsmenge-im-v1-startprofil), [CP-0115](checkpoints/MCP-2026103001.md#cp-0115).

Letzter Checkpoint: [CP-0115](checkpoints/MCP-2026103001.md#cp-0115).

## Nutzerentscheidungen: Stahl-Eröffnungswert und Produktumfang (D-0091/D-0092)

Für die bestätigten 2.000 kg Stahl wird der Eröffnungswert aus dem Schlusswert des Vorjahres übernommen, der im Wirtschaftssimulationstool berechnet wird. Der A02-Vorschlag von 6.400 € / 3,20 € je kg ist nicht als Wert bestätigt. Erzeugung/Übergabe des Vorjahresschlusses und Bewertungsbestandteile einschließlich Bezugskosten/SimTAX bleiben offen. Für V1 wird nur eine zur Simulationserprobung erforderliche Produktauswahl vorgesehen; eine spätere Erweiterung auf weitere Branchen soll möglich sein. Konkrete Produktliste und Auswahlkriterium bleiben offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0091](decision-log.md#d-0091--stahl-eroeffnungswert-aus-vorjahresschluss), [D-0092](decision-log.md#d-0092--begrenzter-v1-produktumfang-mit-spaeterer-branchenerweiterung), [CP-0116](checkpoints/MCP-2026103001.md#cp-0116).

Letzter Checkpoint: [CP-0116](checkpoints/MCP-2026103001.md#cp-0116).

## Nutzerentscheidung: bereitgestellter Vorjahresschluss (D-0093)

Der Vorjahresschluss wird nicht durch eine vorgeschaltete Simulation im Spiel erzeugt, sondern als Startwert bereitgestellt. Ein geeigneter Agent soll realistische Werte recherchieren oder aus aktuellen Marktdaten ableiten; die gewählten Werte werden anschließend festgeschrieben. Konkrete Datenquelle, Bezugsstichtag, Erhebungsumfang und V1-Testproduktliste bleiben offen. A08 RESEARCH ist eine passende Rolle für die Quellen-/Marktdatenermittlung; die Fachzuordnung und konkrete Beauftragung sind noch nicht erfolgt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0093](decision-log.md#d-0093--vorjahresschluss-als-bereitgestellter-startwert), [CP-0117](checkpoints/MCP-2026103001.md#cp-0117).

Letzter Checkpoint: [CP-0117](checkpoints/MCP-2026103001.md#cp-0117).

## Nutzerentscheidung: A02-Auswahl als V1-Basis (D-0094)

Die bestehende A02-Auswahl aus Stahl, Aluminium und Norm-/Zukaufteilen wird als V1-Basis übernommen. Weitere Warengruppen sollen geprüft und vom Nutzer anhand einer nummerierten Vorschlagsliste ausgewählt werden. Ausdrücklich vom Nutzer genannt: Schmierstoffe, Transportleistung, Strom, Wasser, Energieträger, Kunststoffe und Telekommunikation. Die übrigen vorgeschlagenen Kategorien sind noch nicht freigegeben. Preise, Mengen und Bewertungsregeln bleiben offen. Markt-/Quellenrecherche durch A08 RESEARCH ist erst nach Festlegung des Auswahlumfangs konkret abzugrenzen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0094](decision-log.md#d-0094--a02-materialauswahl-als-v1-basis), [CP-0118](checkpoints/MCP-2026103001.md#cp-0118).

Letzter Checkpoint: [CP-0118](checkpoints/MCP-2026103001.md#cp-0118).

## Nutzerentscheidung: V1-Warengruppen (D-0095)

Bestätigt sind die A02-Basisgruppen Stahl, Aluminium und Norm-/Zukaufteile sowie alle Kandidaten 4–25 der Liste in CP-0118. Die aktuellen A02-Unterlagen schlüsseln Norm-/Zukaufteile (1.000 Stück Startbestand, 56 Stück Bedarf für die drei Aufträge) nicht in Einzelteile auf. Mögliche zusätzliche Bestandteile dieser Sammelgruppe werden separat zur Auswahl gestellt. Mengen, Werte, Datenquellen und Accounting-/Lagerbehandlung bleiben offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0095](decision-log.md#d-0095--auswahl-der-v1-warengruppen), [CP-0119](checkpoints/MCP-2026103001.md#cp-0119).

Letzter Checkpoint: [CP-0119](checkpoints/MCP-2026103001.md#cp-0119).

## Nutzerentscheidung: Artikelbezug der Norm-/Zukaufteile (D-0096)

Norm-/Zukaufteile sollen unter anderem Schrauben, Muttern und Teile anderer Hersteller enthalten. Ein einzelner Sammelposten mit Durchschnittspreis ist für die erste spielbare Version nicht ausreichend. A02 soll die bestehende Spezifikation vor der ersten spielbaren Version erneut prüfen und sinnvoll überarbeiten. Artikelkatalog, Artikelmengen und Preise bleiben offen. Folgeaufträge: T-0011 an A08 für belegte Markt-/Referenzwerte als Vorschläge; T-0010 an A02 zur späteren Überarbeitung nach T-0008, T-0011 und A03-Fachprüfung. Beide PENDING. Nachweis: [D-0096](decision-log.md#d-0096--norm-zukaufteile-einzeln-statt-als-durchschnittspreis-sammelposten), [CP-0120](checkpoints/MCP-2026103001.md#cp-0120).

Letzter Checkpoint: [CP-0120](checkpoints/MCP-2026103001.md#cp-0120).

## Nutzerbestätigung: SimTAX-Abrechnungszeitraum und Fälligkeit (D-0097)

Für den V1-SimTAX-Saldo gilt bei 49.400 € fiktiver Vorjahressteuer monatliche Voranmeldung; Vorauszahlung/Voranmeldung sind grundsätzlich am 10. Tag nach Monatsende fällig, mit gesetzlicher Verschiebung bei Samstag, Sonntag oder Feiertag. Eine Dauerfristverlängerung wird nicht unterstellt. Dies ist eine Simulation nach dem Rechtsstand 2026-10-26, keine echte Steuerabrechnung. Nachweis: [D-0097](decision-log.md#d-0097--simtax-voranmeldungszeitraum-und-faelligkeit-nach-gesetzlicher-regel), [CP-0121](checkpoints/MCP-2026103001.md#cp-0121).

Letzter Checkpoint: [CP-0121](checkpoints/MCP-2026103001.md#cp-0121).

## Nutzerentscheidung: BMF-AfA-Tabelle Maschinenbau für bestehende CNC (D-0098)

Für die CNC wird die BMF-Tabelle Maschinenbau (sieben Jahre für CNC-/NC-Fräsmaschinen) als Referenz verwendet. Damit ist weder die AfA-Historie noch der Eröffnungsbuchwert neu bestimmt. Der Abgleich mit Anschaffungsdatum 01.01.2019 und bestätigtem Eröffnungsbuchwert 40.000 € bleibt offen; BAB-Kalkulationskosten bleiben getrennt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0098](decision-log.md#d-0098--bmf-afa-branchentabelle-fuer-die-bestehende-cnc), [CP-0122](checkpoints/MCP-2026103001.md#cp-0122).

Letzter Checkpoint: [CP-0122](checkpoints/MCP-2026103001.md#cp-0122).

## Nutzerentscheidung: CNC-Eröffnungsbuchwert aus siebenjähriger AfA (D-0099)

Der CNC-Eröffnungsbuchwert zum 01.01.2027 wird aus 120.000 € Anschaffungskosten und sieben Jahren linearer AfA abgeleitet. Bei Anschaffung am 01.01.2019 ergibt sich 0 €; der zuvor dokumentierte Szenariowert 40.000 € ist für diese Maschine ersetzt. Die kalkulatorische BAB-Wiederbeschaffungsbasis und Marktwertregel bleiben getrennt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0099](decision-log.md#d-0099--eroeffnungsbuchwert-der-cnc-aus-sieben-jahres-afa-abgeleitet), [CP-0123](checkpoints/MCP-2026103001.md#cp-0123).

Letzter Checkpoint: [CP-0123](checkpoints/MCP-2026103001.md#cp-0123).

## Nutzerentscheidung: Hauptrefinanzierungssatz als EZB-Referenz (D-0100)

Für den individuellen Unternehmenszinssatz gilt als EZB-Basis der Hauptrefinanzierungssatz (MRO). Aufschlagsmittelwert +3 Prozentpunkte und Spanne +0,5 bis +5,5 Prozentpunkte bleiben gemäß D-0022; die Dispozinsregel aus D-0023 bleibt unverändert. Noch offen: Zeitpunkt des jährlich verwendeten MRO-Werts sowie Bewertungsformel für den individuellen Aufschlag. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0100](decision-log.md#d-0100--hauptrefinanzierungssatz-als-ezb-basis-fuer-unternehmenszinsen), [CP-0124](checkpoints/MCP-2026103001.md#cp-0124).

Letzter Checkpoint: [CP-0124](checkpoints/MCP-2026103001.md#cp-0124).

## Nutzerentscheidung: MRO-Stichtag und Zukunftswerte (D-0101)

Für die jährliche Zinsvereinbarung gilt der MRO am 1. Januar des jeweiligen Spieljahrs. Wenn das Spiel die verfügbaren realen EZB-Werte überholt, wird der Satz simuliert; der Simulationspfad ist offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0101](decision-log.md#d-0101--mro-stichtag-am-1-januar-des-spieljahrs), [CP-0125](checkpoints/MCP-2026103001.md#cp-0125).

Letzter Checkpoint: [CP-0125](checkpoints/MCP-2026103001.md#cp-0125).

## Nutzerentscheidung: Künftiger MRO an Inflationsrate orientiert (D-0102)

Wenn reale EZB-Daten enden, soll sich der simulierte MRO an der Inflationsrate orientieren. Inflationspfad und genaue Überführungsregel sind V2-Arbeit; keine Werte/Formel für V1 ergänzt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0102](decision-log.md#d-0102--kuenftiger-mro-pfad-orientiert-sich-an-inflationsrate), [CP-0126](checkpoints/MCP-2026103001.md#cp-0126).

Letzter Checkpoint: [CP-0126](checkpoints/MCP-2026103001.md#cp-0126).

## Nutzerentscheidung: Fremdkapitalquote als V1-Zinsfaktor (D-0103)

Bei FK-Quote unter 15 % gilt der untere Aufschlag (+0,5 Prozentpunkte); bei 90 % gilt das obere Ende (+5,5 Prozentpunkte). Weitere Faktoren werden in V2 erarbeitet. Zuordnung zwischen den Grenzen und Verwendung des D-0022-Mittelwerts +3 Prozentpunkte bleiben offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0103](decision-log.md#d-0103--fremdkapitalquote-als-v1-faktor-des-individuellen-zinsaufschlags), [CP-0127](checkpoints/MCP-2026103001.md#cp-0127).

Letzter Checkpoint: [CP-0127](checkpoints/MCP-2026103001.md#cp-0127).

## Nutzerentscheidung: Exponentielle Zinszuordnung aus Fremdkapitalquote (D-0104)

Der individuelle Aufschlag soll exponentiell mit der Fremdkapitalquote steigen: unter 15 % = +0,5 Prozentpunkte, bei 40 % = +3, bei 90 % = +5,5. Weitere Faktoren bleiben V2. Konkrete Exponentialfunktion/Kurvenform ist offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0104](decision-log.md#d-0104--exponentielle-fremdkapitalquote-zinszuordnung-mit-40-anker), [CP-0128](checkpoints/MCP-2026103001.md#cp-0128).

Letzter Checkpoint: [CP-0128](checkpoints/MCP-2026103001.md#cp-0128).

## Nutzerbestätigung: beschränkt-abflachende Exponentialkurve (D-0105)

Der Nutzer bestätigt die beschränkt-abflachende Exponentialkurvenart für den V1-Zinsaufschlag. Anker gemäß D-0103/D-0104: unter 15 % FKQ = +0,5 Prozentpunkte, 40 % = +3, 90 % = +5,5. Die konkrete Formel und Verhalten über 90 % bleiben offen; weitere Faktoren in V2. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0105](decision-log.md#d-0105--beschraenkt-abflachende-exponentialkurve-fuer-zinsaufschlag-bestaetigt), [CP-0129](checkpoints/MCP-2026103001.md#cp-0129).

Letzter Checkpoint: [CP-0129](checkpoints/MCP-2026103001.md#cp-0129).

## Nutzerbestätigung: Definition der Fremdkapitalquote (D-0106)

Für die Zinsberechnung gilt Fremdkapitalquote = Fremdkapital / Gesamtkapital × 100, Gesamtkapital = Bilanzsumme. Dies ist die gängige betriebswirtschaftliche Kennzahlendefinition. Die konkrete Exponentialformel bleibt zur Bestätigung offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0106](decision-log.md#d-0106--fremdkapitalquote-als-fremdkapital-zu-gesamtkapital), [CP-0130](checkpoints/MCP-2026103001.md#cp-0130).

Letzter Checkpoint: [CP-0130](checkpoints/MCP-2026103001.md#cp-0130).

## Nutzerentscheidung: V1-Exponentialformel für individuellen Zinsaufschlag (D-0107)

Für Fremdkapitalquote q in Prozent, φ=(1+√5)/2 und k=ln(φ)/25 gilt bei 15≤q≤90: `Z(q)=0,5+5×(1−exp(−k×(q−15)))/(1−exp(−75k))` Prozentpunkte; unter 15 % gilt +0,5. Die Formel trifft +3 bei 40 % und +5,5 bei 90 %. Quote über 90 % bleibt offen; Bilanzsumme und Zahlungsmoral sind V2-Arbeit. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0107](decision-log.md#d-0107--normierte-exponentialformel-fuer-v1-zinsaufschlag), [CP-0131](checkpoints/MCP-2026103001.md#cp-0131).

Letzter Checkpoint: [CP-0131](checkpoints/MCP-2026103001.md#cp-0131).

## Klärungspunkt: Zinsziel bei 100 % Fremdkapitalquote (CP-0132)

Der Nutzer hat vorgegeben, dass der Zinssatz bei Neuverschuldung zwischen 90 % und 100 % FKQ bis zum Disponiveau steigt. D-0023 definiert den Dispozins als 8 % über dem individuell vereinbarten Unternehmenszinssatz. Die genaue Bezugsgröße des Dispoziels bei 100 % FKQ und die Übergangsfunktion sind noch nicht geklärt; keine Berechnung wird angenommen. T-0008 bleibt IN_PROGRESS. Nachweis: [CP-0132](checkpoints/MCP-2026103001.md#cp-0132).

Letzter Checkpoint: [CP-0132](checkpoints/MCP-2026103001.md#cp-0132).

## Klärungspunkt: Verhältnis von 100-%-FKQ-Zielzins zu Dispozins (CP-0133)

Der Nutzer präzisiert den Zielzins bei 100 % FKQ als EZB-Referenzsatz +8 Prozentpunkte. Dies unterscheidet sich von D-0023, wonach der Dispozins 8 % über dem individuell vereinbarten Unternehmenszinssatz liegt. Noch ist offen, ob die neue Angabe D-0023 ersetzen oder nur den 100-%-FKQ-Zielwert festlegen soll. D-0023 bleibt bis zur Klärung unverändert. T-0008 bleibt IN_PROGRESS. Nachweis: [CP-0133](checkpoints/MCP-2026103001.md#cp-0133).

Letzter Checkpoint: [CP-0133](checkpoints/MCP-2026103001.md#cp-0133).

## Nutzerentscheidung: 100-%-FKQ-Zielzins getrennt vom Dispozins (D-0108)

Bei 100 % FKQ beträgt der Zielzins der FKQ-Kurve MRO +8 Prozentpunkte. D-0023 bleibt separat bestehen: Dispozins = 8 % über dem individuell vereinbarten Unternehmenszinssatz. Bei 90 % gilt weiter MRO +5,5 Prozentpunkte; Übergang 90–100 % bleibt offen. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0108](decision-log.md#d-0108--separater-100-fkq-zielzins-d-0023-bleibt-unveraendert), [CP-0134](checkpoints/MCP-2026103001.md#cp-0134).

Letzter Checkpoint: [CP-0134](checkpoints/MCP-2026103001.md#cp-0134).

## Formelprüfung: FKQ-Zinskurve bis 100 % (CP-0135)

D-0107 unverändert über 90 % hinaus ausgewertet ergibt bei q=100 rund +5,7705 Prozentpunkte statt D-0108s Ziel +8. Eine mögliche stückweise normierte Exponentialkurve ist in [CP-0135](checkpoints/MCP-2026103001.md#cp-0135) dokumentiert; sie erhält den Verlauf bis 90 % und erfüllt 90→+5,5 sowie 100→+8 mit demselben k, hat aber einen Steigungsknick bei 90 %. Dies ist ein unbestätigter Vorschlag, keine Regel. T-0008 bleibt IN_PROGRESS.

Letzter Checkpoint: [CP-0135](checkpoints/MCP-2026103001.md#cp-0135).

## Nutzerentscheidung: FKQ-Exponentialkurve bis 100 % (D-0109)

Die in CP-0135 vorgeschlagene Erweiterung ist bestätigt; der Steigungsknick bei 90 % ist akzeptiert. Die stückweise Exponentialformel liefert +3 Prozentpunkte bei 40 %, +5,5 bei 90 %, +8 bei 100 %, auf den MRO-Satz addiert. D-0023 bleibt separat für den Dispozins; weitere Faktoren in V2. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0109](decision-log.md#d-0109--stueckweise-exponentialkurve-bis-100-fremdkapitalquote), [CP-0136](checkpoints/MCP-2026103001.md#cp-0136).

Letzter Checkpoint: [CP-0136](checkpoints/MCP-2026103001.md#cp-0136).

## Rechtsprüfung: tatsächliches Kunden-Zahlungsverhalten (CP-0137)

§§ 271 und 286 BGB regeln Fälligkeit/Verzug, aber weder tatsächliches Kunden-Zahlungsverhalten noch eine allgemeine Verspätungswahrscheinlichkeit für die Simulation. Keine allgemeine betriebswirtschaftliche Produktregel gefunden; V1-Ableitung des Zahlungseingangs aus Fälligkeit bleibt Nutzerfrage. Keine neue D-ID. T-0008 IN_PROGRESS. Nachweis: [CP-0137](checkpoints/MCP-2026103001.md#cp-0137).

Letzter Checkpoint: [CP-0137](checkpoints/MCP-2026103001.md#cp-0137).

## Nutzerentscheidung: V1-Kundenzahlung am Fälligkeitstag (D-0110)

Der tatsächliche vollständige Kunden-Zahlungseingang erfolgt V1 am vertraglichen Fälligkeitstag, außer ein ausdrücklich festgelegtes Verspätungsereignis greift. Kein eigenes Cash-Gate; spätere Ereignisse können Verhalten ändern. §§ 271/286 BGB bestimmen keine Zahlungseingangsverteilung. T-0008 IN_PROGRESS; T-0009 PENDING. Nachweis: [D-0110](decision-log.md#d-0110--kunden-zahlungseingang-zum-vertraglichen-faelligkeitstag), [CP-0138](checkpoints/MCP-2026103001.md#cp-0138).

Letzter Checkpoint: [CP-0138](checkpoints/MCP-2026103001.md#cp-0138).

## Nutzerentscheidung: Verbindlichkeitserfassung bei Leistungseingang (D-0111)

Für V1 entsteht eine Lieferantenverbindlichkeit bei akzeptiertem Wareneingang bzw. bestätigter Fremdleistung; die Rechnung bestätigt danach Betrag und Fälligkeit. Die A03-Finanzspezifikation wurde entsprechend aktualisiert. Die Regel legt keine allgemeine Rechtsauslegung für abweichende Vertrags-/Leistungsfälle fest. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0111](decision-log.md#d-0111--entstehung-eigener-lieferantenverbindlichkeiten-bei-leistungseingang), [CP-0139](checkpoints/MCP-2026103001.md#cp-0139).

Rechtsgrundlagen zur Abgrenzung: [§ 433 BGB](https://www.gesetze-im-internet.de/bgb/__433.html), [§ 246 HGB](https://www.gesetze-im-internet.de/hgb/__246.html). Diese Normen bestimmen keine universelle Simulationsregel für den Buchungszeitpunkt.

Letzter Checkpoint: [CP-0139](checkpoints/MCP-2026103001.md#cp-0139).

## Nutzerentscheidung: Kundenforderung und Auftragserlös bei Rechnung (D-0112)

Der Nutzer bestätigt die A03-Arbeitsregel: In V1 entstehen Kundenforderung und vereinfachter Auftragserlös bei Ausstellung/Freigabe der Rechnung für erbrachte bzw. abrechenbare Leistung; die Rechnung referenziert die zugrunde liegende Leistung/Lieferung. Dies ist eine Produktregel, keine allgemeine handels- oder steuerrechtliche Umsatzrealisierung. Die A03-Finanzspezifikation wurde angepasst. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0112](decision-log.md#d-0112--kundenforderung-und-vereinfachter-auftragserloes-bei-rechnung), [CP-0140](checkpoints/MCP-2026103001.md#cp-0140).

Rechtsquellen zur Abgrenzung: [§ 252 HGB](https://www.gesetze-im-internet.de/hgb/__252.html), [§ 433 BGB](https://www.gesetze-im-internet.de/bgb/__433.html), [§ 641 BGB](https://www.gesetze-im-internet.de/bgb/__641.html).

Letzter Checkpoint: [CP-0140](checkpoints/MCP-2026103001.md#cp-0140).

## Nutzerentscheidung: SimTAX-Vorsteuer nur bei bestätigten Voraussetzungen (D-0113)

SimTAX wird V1 auch auf eingehenden externen Lieferantenrechnungen als Vorsteuer-Simulationssaldo berücksichtigt, sofern die Lieferung/Leistung für das Unternehmen durch einen anderen Unternehmer ausgeführt wurde, eine ordnungsgemäße Rechnung vorliegt und die Steuer nach der V1-Abbildung abzugsfähig ist. Vorsteuer- und Umsatzsteuer-Simulationssaldo werden verrechnet. Sonderfallgruppen und Ausschlüsse sind nicht vollständig modelliert. Rechtsgrundlage zur Abgrenzung: [§ 15 UStG](https://www.gesetze-im-internet.de/ustg_1980/__15.html). T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0113](decision-log.md#d-0113--simtax-vorsteuer-auf-qualifizierte-lieferantenrechnungen), [CP-0141](checkpoints/MCP-2026103001.md#cp-0141).

Letzter Checkpoint: [CP-0141](checkpoints/MCP-2026103001.md#cp-0141).

## Nutzerentscheidung: Vorsteuer-Ausnahmen außerhalb V1 (D-0114)

V1 bildet weder Vorsteuer-Sonderfälle noch Ausschlüsse oder anteilige Abzüge ab. D-0113s Voraussetzungen bilden den vereinfachten Simulationsfilter; besondere reale Einschränkungen nach § 15 UStG werden dadurch nicht bestritten. Die Accounting-Spezifikation wurde aktualisiert. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [D-0114](decision-log.md#d-0114--keine-vorsteuer-ausnahmen-oder-anteiligen-abzuege-in-v1), [CP-0142](checkpoints/MCP-2026103001.md#cp-0142).

Letzter Checkpoint: [CP-0142](checkpoints/MCP-2026103001.md#cp-0142).

## Nutzerentscheidung: SimTAX-Berichtigung gemäß § 153 AO (D-0115)

Die Simulation muss die Voraussetzungen aus § 153 AO abbilden: Wird nachträglich eine unrichtige/unvollständige abgegebene Erklärung erkannt, durch die eine Steuerverkürzung möglich ist oder eingetreten ist, sind Anzeige und erforderliche Berichtigung unverzüglich vorzusehen. Eine feste Tagesfrist wird nicht erfunden. Das beantwortet nicht die allgemeine interne Periodenschließung; der Auslöser der Fehlererkennung im Spiel bleibt offen. Nachweis: [D-0115](decision-log.md#d-0115--simtax-erklaerungsberichtigung-nach-153-ao), [CP-0143](checkpoints/MCP-2026103001.md#cp-0143).

Quelle: [§ 153 AO](https://www.gesetze-im-internet.de/ao_1977/__153.html).

Letzter Checkpoint: [CP-0143](checkpoints/MCP-2026103001.md#cp-0143).

## Nutzerentscheidung: Fehlererkennung in SimTAX-Erklärungen nur durch Ereignisse (D-0116)

Fehler bereits abgegebener SimTAX-Erklärungen werden in V1 ausschließlich durch Ereignisse erkannt. Wird dadurch ein relevanter Fehler erkannt, gilt D-0115 mit Anzeige und erforderlicher Berichtigung unverzüglich. Konkrete Ereignisse und Fehler bleiben noch zu spezifizieren. Nachweis: [D-0116](decision-log.md#d-0116--erkennung-fehlerhafter-simtax-erklaerungen-nur-durch-ereignisse), [CP-0144](checkpoints/MCP-2026103001.md#cp-0144).

Letzter Checkpoint: [CP-0144](checkpoints/MCP-2026103001.md#cp-0144).

## Nutzerentscheidung: Allgemeiner Buchungsperiodenabschluss in V1 (D-0117)

V1 enthält einen allgemeinen Buchungsperiodenabschluss. Das Intervall wurde durch D-0118 auf zwölf Monate zum Kalenderjahresende festgelegt; die Folgejahresbehandlung nichtsteuerlicher Fehler ist D-0119. Fehler abgegebener SimTAX-Erklärungen folgen separat D-0115/D-0116. Nachweis: [D-0117](decision-log.md#d-0117--allgemeiner-buchungsperiodenabschluss-in-v1), [CP-0145](checkpoints/MCP-2026103001.md#cp-0145).

Rechtsrahmen für nachvollziehbare Buchungen: [§ 146 AO](https://www.gesetze-im-internet.de/ao_1977/__146.html).

Letzter Checkpoint: [CP-0145](checkpoints/MCP-2026103001.md#cp-0145).

## Nutzerentscheidung: Geschäftsjahr V1 zwölf Monate bis Kalenderjahresende (D-0118)

V1 verwendet ein zwölfmonatiges Geschäftsjahr mit Abschluss zum Kalenderjahresende. Ein alternatives Wirtschaftsjahr wird nur in V2 geprüft. Die Wahl des Kalenderjahres ist die Produktregel; das HGB begrenzt die Geschäftsjahresdauer auf zwölf Monate und sieht Jahresabschluss-/Inventarzeitpunkte vor, schreibt aber nicht für alle Unternehmen zwingend das Kalenderjahr vor. Nachweis: [D-0118](decision-log.md#d-0118--zwoelfmonatiges-v1-geschaeftsjahr-mit-kalenderjahresende), [CP-0146](checkpoints/MCP-2026103001.md#cp-0146).

Quellen: [§ 240 HGB](https://www.gesetze-im-internet.de/hgb/__240.html), [§ 242 HGB](https://www.gesetze-im-internet.de/hgb/__242.html).

Letzter Checkpoint: [CP-0146](checkpoints/MCP-2026103001.md#cp-0146).

## Nutzerentscheidung: Nichtsteuerliche Korrektur nach Jahresabschluss im Folgejahr (D-0119)

Wird ein nichtsteuerlicher Buchungsfehler erst nach Jahresabschluss erkannt, wird er in V1 im neuen Steuerjahr gebucht: Vorsteuer-Simulationssaldo gutschreiben und Umsatzsteuer-Simulationssaldo neu belasten. Diese Korrektur ändert die abgeschlossene Vorjahresperiode nicht und wird in V2 neu bewertet. Erkannte Fehler bereits abgegebener SimTAX-Erklärungen bleiben davon getrennt und sind nach D-0115/D-0116 bzw. § 153 AO unverzüglich zu berichtigen. Nachweis: [D-0119](decision-log.md#d-0119--nichtsteuerliche-korrekturen-nach-abschluss-im-folgejahr), [CP-0147](checkpoints/MCP-2026103001.md#cp-0147).

Letzter Checkpoint: [CP-0147](checkpoints/MCP-2026103001.md#cp-0147).

## Historische Koordinierungs- und Checkpointnotizen (CP-0148 bis CP-0154)

Die folgenden Abschnitte sind chronologische Zwischenstände. Spätere Korrekturen und der aktuelle Status stehen in den jeweils neueren Abschnitten; maßgeblich ist der letzte A01-Stand.

## A03-Abgleich mit bestätigten Finanzentscheidungen (CP-0148)

A03 hat die Finanzspezifikation und P0-Finanzkonsistenzprüfung gegen D-0013 bis D-0119 abgeglichen. Aktualisiert wurden Zahlungsziele/-anker, Kunden- und Lieferantenfluss, Retry-/Dunning, Darlehen D-0030–43, SimTAX, D3-BAB/Personal/CNC-Kosten, E3-Stahl-Eröffnungswert sowie CNC-Buchwert D-0099. Eröffnungsbilanz zum 01.01.2027: 55.300 € Aktiva/Passiva, Eigenkapital-Rest 23.800 €. CP-0147 unverändert. Kein Code/Schema/DB/Architektur, Commit oder Push. Übergabebericht: [A03-Abgleichbericht](../accounting/a03-decision-log-abgleich-bericht.md); Checkpoint [CP-0148](checkpoints/MCP-2026103001.md#cp-0148). T-0008 IN_PROGRESS, T-0009 PENDING.

Letzter Checkpoint: [CP-0148](checkpoints/MCP-2026103001.md#cp-0148).

## A01-Koordinierungsabgleich nach CP-0148 (CP-0149)

A01 übernimmt A03s Abgleich aus CP-0148. Dokumentierte Nutzerentscheidungen D-0013 bis D-0119 gelten als entschieden und werden nicht weiter als offene Nutzerfragen geführt. Beim Maschinendarlehen bleiben konkrete Rate und erster tatsächlicher Zahlungstermin offen. Weitere aktuell ausgewiesene Fachlücken sind Dispositionskredit-Limit/Verfügbarkeit/Draw/Rückzahlung, A02-Ereigniszeitpunkte und Reihenfolge, Vorjahresschluss-Erzeugung und Stahlwertübergabe sowie nicht festgelegte laufende Kosten und weitere Kostenstellenzuordnungen.

T-0008 bleibt IN_PROGRESS. T-0009 bleibt PENDING, bis A02 die Arbeit tatsächlich beginnt; danach sind verbleibende Ereignis-/Periodenabstimmungen zwischen A02 und A03 zu dokumentieren. Im aktuellen Checkout liegt kein A02-Abschlussbericht zur Übernahme von D-0011 unter T-0009 und kein A04-Abschlussabgleich gegen CP-0148 vor. Die Gesamtvalidierung der aktiven Steuerungs- und Fachunterlagen ist daher noch nicht abgeschlossen; kein Sicherungs-Commit/Push. Nachweise: [CP-0148](checkpoints/MCP-2026103001.md#cp-0148), [CP-0149](checkpoints/MCP-2026103001.md#cp-0149).

Letzter Checkpoint: [CP-0149](checkpoints/MCP-2026103001.md#cp-0149).

## A02-Übernahme D-0011 und Finanzereignisabgleich (CP-0150)

A02 hat unter T-0009 D-0011 in die Simulationsspezifikation übernommen und Tageskapazität/F3-Zählung aktualisiert. Bestätigte A03-Regeln zu Kunden- und eigenen Zahlungen, Retry/Dunning und dem getrennten Maschinenkreditfluss sind eingearbeitet. Offen bleibt die konkrete Phasenverarbeitung gleichzeitiger Finanzereignisse, Spielerwahl/Dispositionskredit, Retry-/Mahn-/Darlehensereignisse, Wochenendverschiebungen und Periodenzuordnung. D-0033 ergibt den 29.01.2027 als Januarfälligkeit; A03/CP-0149 führt den ersten tatsächlichen Zahlungstermin als offen. Bericht: [A02 T-0009 Änderungsbericht](../simulation/a02-t0009-d0011-aenderungsbericht.md); Checkpoint [CP-0150](checkpoints/MCP-2026103001.md#cp-0150). Übergabe an A01 zur Abnahme und Zuweisung der A02/A03-Abstimmung.

Letzter Checkpoint: [CP-0150](checkpoints/MCP-2026103001.md#cp-0150).

## A04-Datenmodellabgleich gegen bestätigten Finanz- und Simulationsstand (CP-0151)

A04 hat die Datenmodellspezifikation dokumentarisch gegen D-0011 bis D-0119, CP-0148, den aktuellen A03-Finanzstand sowie A02s CP-0150 abgeglichen. Die alte Bilanzangabe 95.300 € mit CNC-Buchwert 40.000 € und Eigenkapital 63.800 € ist als überholt gekennzeichnet. Aktuell gelten Aktiva/Passiva je 55.300 €, CNC-Buchwert 0 € und Eigenkapital-Restposition 23.800 €. Der Finanzierungs-/Budgetrahmen 50.000 € bleibt vom Bankbestand 30.000 € und ungezogenen Rest 20.000 € getrennt.

Bestätigte Regeln zu Kalender/Fristen, Zahlungszielen, Zahlungseingängen/-ausgängen, Retry/Dunning, Darlehensgrundlogik, SimTAX, BAB, Materialbewertung und AfA wurden aus den offenen Markierungen entfernt. Arbeitskalender/Vertragsfristen ignorieren Feiertage; SimTAX-Fälligkeiten folgen separat D-0097. CP-0150s offene A02/A03-Ereignisabstimmung wurde ergänzt, einschließlich Gleichzeitigkeit/knappem Cash, Spielerwahl/Dispositionskredit, Phasen, Retry-/Mahn-/Darlehensereignissen, Wochenendverschiebung und Periodenzuordnung. D-0033 setzt 29.01.2027 als Januarfälligkeit; erster tatsächlicher Darlehenstermin und Rate bleiben offen.

Weitere echte offene Punkte: Dispositionskredit-Limit und Ziehungs-/Rückzahlungsregeln, Kundenverhaltensparameter, künftige MRO-/Inflationsüberführung, Kosten-/Kostenstellen-/Periodendetails, Vorjahresschlussübergabe und SimTAX-Fehlererkennungsereignisse. Logische Modellfelder und Übergaben sind keine physische Schemafreigabe. CP-0020 liegt weiterhin nicht als Datei im Checkout vor und wurde nicht rekonstruiert.

Bericht: [A04-Abgleichbericht](../database/a04-cp-0148-decision-log-abgleich-bericht.md); Checkpoint: [CP-0151](checkpoints/MCP-2026103001.md#cp-0151). Keine Implementierung, Migration, Datenbankänderung, Architekturfreigabe, Commit oder Push. Vorhandene Änderungen anderer Agenten blieben bestehen.

Letzter Checkpoint: [CP-0151](checkpoints/MCP-2026103001.md#cp-0151).

## A01-Übernahme A02-/A04-Abgleichen (CP-0152)

A02 hat D-0011 in die Simulationsspezifikation übernommen und T-0009 mit CP-0150 abgeschlossen. A04 hat den Datenmodellabgleich gegen Decision Log, CP-0148 und CP-0150 in CP-0151 abgeschlossen. T-0008 bleibt IN_PROGRESS; die noch offenen A02/A03-Ereignis- und Periodenabstimmungen bleiben Koordinierungsarbeit. T-0009 ist abgeschlossen.

Die Gesamtvalidierung ist noch nicht bestanden: In der A02-Spezifikation sind im Startprofil weiterhin ein CNC-Buchwert von 40.000 € (D-0099/CP-0148: 0 €) und 3,20 €/kg Stahl ausgewiesen (D-0091: Wert aus bereitgestelltem Vorjahresschluss; 3,20 € nicht bestätigt). A02 muss diese überholten/unbestätigten Werte fachlich bereinigen oder klar als historische Vorschläge kennzeichnen; A01 verändert den A02-Fachstand nicht. Danach ist erneut gegen Decision Log und CP-0148 bis CP-0151 zu validieren. Bis dahin kein Sicherungs-Commit/Push. Offene Punkte bleiben gemäß [P0-Koordinierung](p0-offene-parameter-koordinierung.md); Nachweise: [CP-0150](checkpoints/MCP-2026103001.md#cp-0150), [CP-0151](checkpoints/MCP-2026103001.md#cp-0151), [CP-0152](checkpoints/MCP-2026103001.md#cp-0152).

Letzter Checkpoint: [CP-0152](checkpoints/MCP-2026103001.md#cp-0152).

## A02-Startprofilabgleich D-0091/D-0099 (CP-0153)

A02 hat im aktiven Startprofil den CNC-Buchwert auf 0 € gemäß D-0099 korrigiert und 3,20 €/kg Stahl entfernt. A02 führt Stahl mit 2.000 kg und übergibt den Eröffnungswert aus dem bereitgestellten Vorjahresschluss gemäß D-0091/93; keine Bewertungsmethode oder fehlende Geldsumme wurde festgelegt. A03 weist insgesamt 12.800 € Vorräte aus CP-0148 aus; die wertmäßige Aufteilung muss A03/A01 noch mit D-0091 und der Vorjahresschluss-Übergabe abstimmen. Bericht: [A02 Startprofilbericht](../simulation/a02-startprofil-d0091-d0099-aenderungsbericht.md); Checkpoint [CP-0153](checkpoints/MCP-2026103001.md#cp-0153).

Letzter fachlicher Checkpoint: [CP-0155](checkpoints/MCP-2026103001.md#cp-0155).
## A01-Koordinierungsstand nach A02/A03-Ereignis- und Periodenabgleich (CP-0155)

Die bestätigten Finanz-/Simulationsregeln sind in [gemeinsamem A02/A03-Abgleichbericht](../simulation/a02-a03-ereignis-perioden-abgleich.md) konsolidiert. A02 hat Phase 8 und wirksame Wochenendverschiebung in der Spezifikation präzisiert; A03-Spezifikation bedarf keiner Änderung. Über A01 an den Nutzer zu richten ist die outcome-kritische Frage, ob ein gleichentägiger Kundeneingang vor den vom Spieler priorisierten eigenen Vollzahlungsversuchen bei knappem Cash verfügbar ist. Noch offen bleiben außerdem Intraday-Reihenfolge zeitgleicher Retry-/Mahnereignisse, Monatsperiodenzuordnung wirksam verschobener Ereignisse, Darlehens-Verwertungszählung, erster tatsächlicher Darlehenstermin/Rate sowie der Vorjahresschluss und die Einzelgruppenwerte der Vorräte. CP-0154s bedingte Nutzerfrage zur 12.800-€-Gesamtsumme bleibt zurückgestellt, bis belegte Einzelwerte tatsächlich abweichen.

Checkpoint: [CP-0155](checkpoints/MCP-2026103001.md#cp-0155).

Letzter fachlicher Checkpoint: [CP-0155](checkpoints/MCP-2026103001.md#cp-0155).


## A01-Gesamtvalidierung und Sicherungsstand (CP-0156)

Die aktive Dokumentationsvalidierung gegen AGENTS.md, Agentenstruktur, Goals, Ticket Board, Decision Log und P0-Fachunterlagen ist bestanden. CP-0155 ist in der Koordinierung übernommen; T-0009 bleibt abgeschlossen, T-0008 IN_PROGRESS. Die historischen Koordinierungsnotizen sind ausdrücklich als Verlauf markiert. Die outcome-kritische Frage zur Reihenfolge gleichentägiger Kundeneingänge und eigener Zahlungen bleibt bis nach der Sicherung zurückgestellt. Keine Implementierung, Schema- oder Architekturänderung.

Checkpoint: [CP-0156](checkpoints/MCP-2026103001.md#cp-0156).

Letzter Checkpoint: [CP-0156](checkpoints/MCP-2026103001.md#cp-0156).
## A01 – Browser-V1-Prototyp (CP-0157)

Der Nutzer hat nach dem bestätigten Push A01 beauftragt, die A02-/A03-/A05-/A09-Agentenarbeit zunächst selbst auszuführen und eine erste spielbare, mobiloptimierte V1 möglichst schnell zu erstellen. Neuer Koordinierungsauftrag: T-0012 (IN_PROGRESS); T-0008 bleibt wegen noch offener Parameter aktiv, T-0010 bleibt separate Spezifikationsarbeit. Keine Architekturfreigabe.

Der Prototyp unter `prototype/` umfasst Simulationskern, Finance-Reducer, mobile Oberfläche und lokale Speicherung. Bestätigte Startwerte und Regeln werden genutzt; Auftragsnettopreise sind explizite Szenariowerte. Kosten, unbekannte Vorratsbewertungen, individuelle Start-OP-Fälligkeiten und nicht bestätigte Darlehenswerte werden nicht erfunden. CP-0157 dokumentiert Umfang und Vorbehalte.

Syntax- und HTTP-Auslieferungsprüfung sind erfolgreich. Die angeforderte echte Browser-/Mobilprüfung ist noch offen: verfügbare CUA-Umgebung listete keinen steuerbaren Browser, und Edge-Zugriff wurde wegen unbekannter aktueller URL sicherheitshalber gestoppt. Nächster Schritt ist eine tatsächliche Browserprüfung, dann A09-End-to-End-Review. Vor Nutzerfragen zum Zahlungsereignis recherchiert A01 gemäß Auftrag Gesetz, Branchenregeln und Forenberichte; Nutzerentscheidung bleibt abschließend.

Checkpoint: [CP-0157](checkpoints/MCP-2026103001.md#cp-0157).

### CP-0157-Fortschreibung – A09-QA

Der lokale Simulations-/Finanz-Ende-zu-Ende-Lauf sowie ein separater DOM-Stummel-UI-Eventfluss sind erfolgreich. Der zuletzt ausgeführte UI-Fluss bestätigt Szenariopreiseingabe, automatische Rechnungserstellung, Zahlung und Auftragsabschluss; localStorage wurde befüllt. Das ist keine echte Browser-/Mobilprüfung. CUA bietet hier weiterhin keine steuerbare Browserinstanz; T-0012 bleibt deshalb IN_PROGRESS. Keine offenen Nutzerentscheidungen wurden getroffen oder gestellt.

## Historischer A08-Recherche-/Frageübergang – ersetzt durch D-0120

A08-Recherche zur offenen CP-0155-Frage ist unter [a08-same-day-zahlungsreihenfolge-recherche.md](a08-same-day-zahlungsreihenfolge-recherche.md) abgelegt. BGB §§ 675s, 675t und 675n sowie das EPC-SCT-Regelwerk definieren Ausführungsfristen, Verfügbarkeit nach tatsächlichem Zahlungseingang und Geschäftstage/Annahmeschluss, aber keine allgemeine Reihenfolge taggleicher unabhängiger Eingänge und Ausgänge auf dem Firmenkonto. Bundesbankangaben und anekdotische Forumsberichte belegen unterschiedliche Cut-offs/Buchungsabläufe. Keine Quelle rechtfertigt eine universelle Priorität.

Damals war die Entscheidung noch offen. Der Nutzer bestätigte später „Kundeneingänge zuerst“, dokumentiert als D-0120; die Recherchevorlage wurde in T-0020 als abgeschlossen markiert. Maßgeblich sind D-0120 und der T-0020-Stand in CP-0187.

## A01 – Monatsabschluss im Browser-V1-Prototyp (CP-0158)

A02/A03/A05 haben den Monatsabschluss samt Finanzbericht in `prototype/` umgesetzt. Pro Monat werden Rechnungen nach Rechnungsdatum, Kundeneingänge nach Zahlungsdatum, Cash am Monatsanfang/-ende sowie Lieferung und Auftragsabschluss summarisch gezeigt. Fehlende BAB-, Kosten- und Vorratswerte sowie Margen bleiben ausgeklammert. Syntax-, Direktsummen- und HTTP-Prüfungen bestanden. Ein echter Browser-/Mobilcheck ist noch nicht erfolgt: CUA beendete Edge-Zugriff wegen nicht sicher bestimmbarer aktueller Browser-URL; `open_in_codex` meldete nur queued. T-0012 bleibt IN_PROGRESS. Checkpoint: [CP-0158](checkpoints/MCP-2026103001.md#cp-0158).

## A01 – Browser-/Mobil-QA und T-0012-Abschluss (CP-0159)

Der echte In-App-Browserlauf bei 390×844 prüfte Startwerte, Mobile-Nav, Wochenlauf, Lieferung/Abnahme, Rechnung (1.000 € netto/190 € SimTAX), Zahlung am 21.01., G3-Auftragsabschluss, Januarabschluss und Speicherung über Reload. Die vorher nicht reagierende Bottom-Nav wurde behoben. Das Browserfenster ist sauber auf den Start 01.01.2027 zurückgesetzt und als Deliverable offen. T-0012 ist COMPLETED; T-0008 bleibt IN_PROGRESS mit fachlich offenen Nutzerentscheidungen. Details: [CP-0159](checkpoints/MCP-2026103001.md#cp-0159). Kein Commit/Push.

## Wirtschaftssystem-Audit (CP-0184, 2026-10-27)

A01 hat den Ticketbestand, den Prototyp und den 365-Tage-Smoke geprüft. Im aktiven Goal ist T-0015 das einzige offene Ticket aus dem bisherigen Board. Das Audit ist in [V1-Wirtschaftssystem-Audit](audit-wirtschaftssystem-v1-2026-10-27.md) dokumentiert. T-0015 bleibt erste Implementierungspriorität. Neu angelegt: T-0016 Angebots-/Preisverhandlung und Auftragswirtschaft, T-0017 Markt-/Materialpreispfade, T-0018 Monatsabschluss-/Finanz-Reconciliation, T-0019 Auftragspriorisierung/Abnahme. Alle stehen PENDING; keine Umsetzung oder Abnahme wird vorweggenommen.

Der 365-Tage-Smoke läuft bis 01.01.2028. Er zeigt 23 Chancen, 12 Lieferungen und 9 geschlossene Aufträge; die drei Startaufträge sind geliefert/abgerechnet, aber nicht geschlossen. Das ist keine Profitabilitäts- oder vollständige Zahlungskontrolle. Destatis-PPI und HERMLE-Konzernberichte dienen als Größenordnungs-/Marktindikatoren, nicht als Kleinbetriebszielwerte oder konkrete Beschaffungspreise. Kein Commit/Push. Vorhandene lokale Änderungen blieben erhalten.

## T-0020-Abschluss – V1-Finanz- und Auftragsablauf (CP-0187)

T-0020 ist abgeschlossen. A02 korrigierte die Same-Day-Fortsetzung und die V1-Kalenderdarstellung; A03 dokumentierte Vorsteuer-/SimTAX-Kreditübertrag und Dunning; A04 synchronisierte das logische Datenmodell; A05 prüfte Recovery- und mobile Finance-Anzeigen; A08 markierte die durch D-0120 geschlossene Recherchefrage; A09 führte gezielte Regressionen und den 365-Tage-Lauf aus; A10 prüfte Start-/Testanleitung; A11 dokumentierte den Modulzyklus als technische Schuld. Ergebnisse stehen im [A01-Abschlussbericht](a01-t0020-abschlussbericht.md), [A09-QA-Bericht](a09-t0020-qa-bericht.md), [A11-Kopplungsreview](../architecture/a11-t0020-prototype-kopplungsreview.md) und [CP-0187](checkpoints/MCP-2026103001.md#cp-0187).

Tests bestanden: gezielte Regressionen für Same-Day-Arbeitsgänge, SimTAX-Ausgang/Vorsteuer samt Guthabenübertrag, Dunning/Retry, Zahlung vor Mahnung und Finanzmigration; Jahreslauf bis 01.01.2028 mit 12 Abschlüssen, drei geschlossenen Startaufträgen und ohne Cash-Reconciliation-Fehler. `git diff --check` bestanden (nur LF/CRLF-Hinweise). Branch `main` auf `62dbc71`; vorhandene lokale Änderungen und ungetrackte Dateien blieben erhalten. Kein Commit/Push. Manuelle Browser-/Recovery-Bedienung wurde nicht ausgeführt; Schema-/Architekturfreigabe bleibt aus.

## A01 – Manuelle Playtestfehlerkorrektur (CP-0190)

Nach dem vom Nutzer bestätigten Push führte A01 die Playtestfehler über die Fachrollen A02/A03/A05/A09/A11 selbst aus. Neues Ziel MG-001 / SLG-001.1 und Ticket T-0022 sind aktiv. Behoben: expliziter JSON-Speichern-/Laden-Export zusätzlich zum lokalen Autosave; feste Bereichsnavigation an jeder Fensterbreite/Zoomstufe; Jahressimulation aus der Spieloberfläche entfernt (Jahres-Smoke-Test bleibt als Agentenwerkzeug); Disporahmen wird als Bankfazilität mit gezogenem Betrag und Limit beschriftet; Zeitarbeit und Ausbilderanwärter berücksichtigen Raumkapazität, Erkrankte werden vor der Personalbegrenzung herausgefiltert; bestätigter Preis/Zahlungsziel werden read-only und dienen als Rechnungsquelle; Raumänderung erfolgt nur über Umzug; Ausbildung setzt AEVO-Weiterbildung und Platzkapazität voraus; Urlaubsplanung wird erst am Urlaubstag als Verbrauch gezählt.

Die V1-Rechtsmodellierung ordnet kundenspezifische bewegliche CNC-Fertigungsaufträge als Werklieferung gemäß § 650 BGB ein. Die automatische Fünf-Arbeitstage-Abnahme bleibt ausdrücklich eine Spielkonvention ohne pauschale Aussage zur gesetzlichen Abnahme. Immobilienpreise und Flächen sind Szenarioannahmen. Kaufimmobilien werden vereinfacht ohne Abschreibung/Nebenkosten zum Szenariobuchwert fortgeführt.

Prüfungen unter Node v24.22.1: neue `playtest-fixes-regressions.mjs`, `t0020-regressions.mjs` und `year-simulation-smoke.mjs` bestanden. Der Jahreslauf endete am 01.01.2028, erzeugte 23 Marktchancen / 10 Angebote, schloss alle drei Startaufträge, buchte eine Zeitarbeitskraft und meldete keine Reconciliation-Fehler. `git diff --check` ohne Whitespacefehler; LF/CRLF-Hinweise bleiben. Interaktive Browserprüfung nach diesen Änderungen wurde nicht ausgeführt. Kein Commit/Push; Arbeitsbaum enthält lokale Korrekturen. Details: [CP-0190](checkpoints/MCP-2026103001.md#cp-0190).

Letzter Checkpoint: [CP-0190](checkpoints/MCP-2026103001.md#cp-0190).

## Cross-Agent-Konfliktaudit (CP-0191)

A01 ließ alle Fachrollen read-only prüfen; Ergebnisse und konkrete Fundstellen sind in [CP-0191](checkpoints/MCP-2026103001.md#cp-0191) dokumentiert. Es wurden weder Produktdateien noch bestehende Änderungen angepasst. T-0022 bleibt IN_PROGRESS wegen fehlender interaktiver Browserprüfung. Das Audit fand einen reproduzierbaren Zeitarbeitsindexfehler, veraltete A02-/Frontend-Dokumentation, eine Finanzzustandsmutation in der UI und logische Datenmodell-Lücken. A04s Befunde erfordern keine Schemafreigabe. Feiertagsbehandlung bedarf zusätzlich einer eindeutigen Auflösung zwischen D-0011 und späterem V1-Modelltext.

Zum Auditzeitpunkt CP-0191 war [T-0023](ticket-board.md) als PENDING angelegt und an A02, A03, A04, A05 und A09 adressiert. Der Abschluss ist mit CP-0192 dokumentiert. Keine Nutzerentscheidung oder Rückfrage war erforderlich. Kein Commit/Push.

Letzter Audit-Checkpoint: [CP-0191](checkpoints/MCP-2026103001.md#cp-0191).

## T-0023-Abschluss – Cross-Agent-Konflikte und Lücken (CP-0192)

A01 führte die im Auftrag adressierten Rollen selbst aus. T-0023 ist COMPLETED; T-0022 bleibt IN_PROGRESS, da dessen vollständiger interaktiver Browser-Playtest weiterhin aussteht.

- **A02 Simulation:** Der temporäre Mitarbeiterfilter nutzt nun die für den aktuellen Tag gefilterte und kapazitätsbegrenzte Einsatzliste. A02-Spezifikation und Kapazitätsabschnitt wurden gegen Urlaub, Krankheit, Weiterbildung und Feiertagskalender aktualisiert. D-0011 bleibt historischer Kern; D-0134 erklärt die spätere konservative V1-Kalenderkonvention ausdrücklich als Spielregel.
- **A03 Accounting/Finance:** Kauf/Verkauf eines Standorts wird über `recordFacilityRelocation` im Finance-Modul gebucht. Cash, Cashbewegungen und Immobilien-Szenariowert werden gemeinsam aktualisiert; die UI mutiert keine Finanzsalden direkt. Der Immobilienwert ist separat sichtbar. A03 dokumentiert die vereinfachte Szenariobuchung und die Grenze zum nicht dynamischen vollständigen Abschluss.
- **A04 Database:** Logische Anforderungen zu Facility-/Flächenbindung, Umzug, Abwesenheit, täglicher Zeitarbeit und Ausbildung/Ausbilderqualifikation ergänzt. Keine Schemaänderung und keine Architekturfreigabe.
- **A05 Frontend:** V1-Modellblatt korrigiert zu Urlaubverbrauch, Miet-/Flächenänderung nur durch Standortwechsel, Weiterbildung/Ausbildung und AEVO-Spielvoraussetzung; automatische Abnahme in UI und Dokumentation klar als Spielregel bezeichnet.
- **A09 QA:** Neue Mehrtages-Mehrfachbuchungsregression zeigt zwei Zeitarbeitseinsätze an getrennten Tagen mit zwei tatsächlichen Arbeitseinträgen und Lieferung am Folgetag. Property-buy/sell/insufficient-cash Tests und statische Prüfung der UI-Finance-Grenze ergänzt.

D-0134 verwendet für den Prototyp die Vereinigungsmenge hinterlegter gesetzlicher Länderfeiertage als konservative einheitliche Spielkalenderbasis für Simulationstagverschiebungen. Dies ersetzt keine standortbezogene Prüfung. Rechtsquellen: ArbZG § 9, BGB § 193 und AO § 108 (Links in Decision Log und CP-0192).

Verifikation: `playtest-fixes-regressions.mjs`, `t0020-regressions.mjs`, `year-simulation-smoke.mjs`, `node --check` und `git diff --check` bestanden. Jahreslauf bis 01.01.2028, drei Startaufträge geschlossen, 12 Monatsabschlüsse, keine Reconciliation-Fehler. Die sichtbare lokale Browseransicht auf `localhost:8001` zeigte Speichern/Laden und die Bereiche Aufträge, Planung, Finanzen, Netzwerk und Lernen; eine interaktive Klickprüfung der gesamten Umzugs-/Mobile-Flows wurde nicht ausgeführt. Diese verbleibt unter T-0022.

Offene Grenzen: keine vollständige dynamische HGB-Bilanz (nur Immobilien-Szenariowert separat); keine Abschreibung, Marktwert-/Transaktionskosten oder Standortkalenderermittlung für ein konkretes Bundesland; interaktive Browser-QA bleibt T-0022. Keine Schema-/Architekturfreigabe, kein Commit/Push. Bestehende lokale Änderungen aus CP-0190/0191 blieben erhalten.

Letzter Checkpoint: [CP-0192](checkpoints/MCP-2026103001.md#cp-0192).

## MG-002 – Aktiver A01-Koordinierungsstand (2026-10-28)

MG-002 wurde durch den Nutzerauftrag aktiviert. Der Umfang enthält ausdrücklich Marketing/Vertrieb sowie Logistik und 450 originäre Multiple-Choice-Lernszenarien: je 50 pro vier WBQ-Qualifikationsbereichen und fünf HSQ-Handlungsbereichen. Fachwissen soll als mobil und per Tastatur nutzbarer Tooltip im Spiel erscheinen. Änderungen werden pro Ticket durch eine unabhängige Fachrolle geprüft; festgestellte Konflikte werden vor Ticketabschluss abgearbeitet. Es erfolgt keine ungeprüfte Architektur- oder Schemafreigabe.

A08 hat den offiziellen Prüfungsrahmen gelesen: § 3 WFachwPrV nennt vier WBQ- und fünf HSQ-Bereiche; Logistik und Marketing/Vertrieb sind enthalten. Der DIHK-Rahmenplan ist kostenpflichtig; nicht eingesehene Inhalte werden nicht als Quelle behauptet. IHK-Prüfungsraster sind ergänzende Orientierung, wenn sie abweichend gliedern oder unverbindliche Richtwerte aufführen. Beleg-/Ableitungsdetails und Review sind Gegenstand T-0030.

T-0029 ist nach Umsetzung und unabhängigem Review abgeschlossen: Der Wochenknopf endet am nächsten strikt zukünftigen Montag und verarbeitet diesen Zieltag nicht.

Aktive Ticketfolge: T-0029 Wochenknopf (COMPLETED nach A11/A09-Review); T-0030 Kompetenzlandkarte (COMPLETED nach A07/A08-Review); T-0031 Marketing/Logistik und Tooltips (COMPLETED nach A11/A09-Review); T-0032 450 MC-Lernszenarien (IN_PROGRESS, A06 WBQ / A07 HSQ); T-0033 Integrationsreview und Release (PENDING). Je Ticket folgen fachliche Arbeit, unabhängiger Review, Konfliktbereinigung, gezielte Regressionen und dokumentierter Abschluss. Vor diesem Arbeitslauf vorhandene Änderungen an `goals.md`, `collaboration-state.md` und CP-0201 bleiben erhalten.
A11/A09 prüften die MG-002-Aktivierung unabhängig. Sie bestätigten die Prüfungsbereiche und Ticketabhängigkeiten, fanden jedoch drei Dokumentationslücken. A01 passte die Goal-Überschrift an MG-002 IN_PROGRESS an, verlangt nun in T-0031 je einen Marketing-/Vertriebs- und Logistikzyklus und präzisiert T-0032 auf absichtliche, begrenzte Szenarioeffekte. Unbeabsichtigte Buchungs-/Ledgermutationen sind ausgeschlossen. Details: CP-0202.

T-0029 wurde am 2026-10-28 umgesetzt und unabhängig von A11/A09 geprüft. Montag-, Mittwoch-, Freitag-, Samstag-, Sonntag- sowie Feiertagsstarts enden am nächsten strikt zukünftigen Montag; der Zielmontag wird nicht verarbeitet. Wochenregression, Playtest-Regression und Jahres-Smoke bestehen. Browser-E2E verbleibt in T-0033. Details: CP-0202.

T-0030 ist nach A06-Lieferung, A07-Fachreview und A08-Quellenreview abgeschlossen. T-0031 wurde unabhängig davon an A02/A03/A05 gestartet: zuerst vorhandene Mechaniken prüfen, dann Marketing/Vertrieb und Logistik getrennt mit sichtbaren Wirkungen vervollständigen und passende Tooltips ergänzen.

T-0032 ist gestartet: A06 erstellt 200 originäre Items für die vier WBQ-Bereiche, A07 erstellt 250 originäre Items für die fünf HSQ-Bereiche. A01s D-0139 trennt die erklärten Unternehmensfolgen der Lernfälle vom produktiven Spielstand und Ledger.

T-0032 ist als parallele Inhaltsproduktion durch A06 (200 WBQ-Items) und A07 (250 HSQ-Items) beauftragt. Beide verwenden gleiche Feldnamen, Antwortschlüssel A–D und getrennte Dateien. A05-Lernmodusintegration erfolgt erst nach Abschluss/Review von T-0031, um gleichzeitige App-UI-Edits zu vermeiden.

T-0031 ist nach unabhängiger A11/A09-Prüfung abgeschlossen. Marketing-Ausgaben laufen über Finance und sind im Monatsabschluss/Cashabgleich; bevorzugte Lieferanten gelten nur für neue Fehlbestandsbestellungen. Der Reviewer empfiehlt zusätzlich einen Testfall bei unzureichender Liquidität, der für T-0033 vorgemerkt ist.

T-0032 Zwischenreview: A09 hat die überarbeitete HSQ-Lieferung (250 Fälle, exakt 50 je Bereich, deutsch, eindeutige Inhaltsfelder, Lösungsschlüssel A–D ausgewogen) unabhängig geprüft. Die ursprünglichen Sprach- und Templateblocker sind behoben. Noch offen sind direkte Einzelparagraphenlinks, validatorgestützte Zuordnung zu den konkreten Kompetenzlandkarten-IDs und eine fallweise Überarbeitung weiterer unplausibler Distraktoren. A07 arbeitet diese drei Punkte ab; A06 übernimmt dieselben Prüfkriterien in WBQ. Bis zum erneuten unabhängigen Review bleibt T-0032 IN_PROGRESS und die UI-Integration ausstehend.

T-0032 Integration update: A01 added a separate learning quiz UI and local-only progress store; the targeted regression verifies feedback, all 450 loaded items, nine areas, spaced-review dates, filtering, and no mutation of game or Finance objects. Browser inspection found and fixed WBQ area labels (`title` fallback). The same audit found duplicate option rotation in WBQ, which misaligned some correct keys and is now assigned to A06 for a single deterministic shuffle plus correctness validation and removal of dead English source data. A09 re-review of the revised HSQ set is active. Ticket remains open until both reviewed data sets pass and app integration review completes.

A09-HSQ-Nachreview 2 bestätigt 250/50, Deutsch, eindeutige Inhalte, korrekte Antwortschlüssel, direkte Rechtsquellen und Nichtmutation des Spiels, lehnt aber noch ab: HSQ-Kompetenz-IDs existieren nur in Modul-internen Buckets statt in der externen Kompetenzlandkarte; darüber hinaus sind noch offenkundige, unplausible Distraktoren in mehreren der fünf Bereiche vorhanden. A07 ergänzt die Map und führt eine weitere fallweise Inhaltsrevision durch. Keine UI-Integration oder Ticketabschlussfreigabe für den HSQ-Satz bis zum erneuten A09-Review.

A06 hat den WBQ-Schlüsselversatz behoben: englische Altzeilen und doppelte Postprocessingblöcke sind entfernt; die Antwortrotation erfolgt nur einmal, und `correctAnswer` wird im Validator mit der finalen Option abgeglichen. A01 reproduzierte den WBQ-Validator (200, 50/Bereich, Deutsch, map-/source-valid, A48/B48/C52/D52). A09 prüft Inhalt und Korrektheit jetzt unabhängig.

A09 WBQ-Nachreview 1 bestätigt 200/50, korrekte Schlüssel, externe IDs, direkte Quellen, deutsche statische Items und keine Spielmutation. Distraktorplausibilität ist in allen vier Bereichen weiterhin unzureichend; der feste Wortfilter erkennt sie nicht. A06 revidiert alle Bereiche und ergänzt eine menschlich prüfbare Qualitätscheckliste. T-0032 bleibt offen.

## 2026-10-28 – A01-Fortsetzung T-0032 (CP-0203)

Der Preflight wurde erneut ausgeführt. Der aktuelle HSQ-Validator sieht inzwischen 25 externe `wfprv5-*`-Kompetenz-IDs; er besteht für Umfang, je 50 je Bereich, Quellen, Antwortschlüssel, Referenzen und seine heuristischen Sprach-/Distraktorflags. Das ist keine fachliche Freigabe. Der WBQ-Validator besteht strukturell (200/50, Quellen/Kompetenzen, finale Antworttexte und Schlüsselverteilung), während A09 die Distraktoren weiterhin nicht plausibel genug findet. A06 hat VW und Rechnungswesen überarbeitet; die übrigen 100 Items in Recht/Steuern und Unternehmensführung sind noch in Arbeit. A07 soll die HSQ-Fälle weiter fallweise verbessern und die Zuordnung zur Map validieren. Beide wurden angewiesen, ausschließlich den Repository-Checkout und nicht `sources/` zu verwenden.

Die Lern-UI-Regression besteht: 450 Items, neun Bereiche, Antwortfeedback, Lernfortschritt/Wiederholungen, Filter und unveränderter aktiver Spiel-/Finanzzustand. A09-Neureview beider finalen Sätze, vollständige T-0033-Regression/Mobil-/Browserprüfung und Jahres-Smoke sind offen; bis dahin keine Commit-/Push-Freigabe. Siehe CP-0203.

Nachtrag T-0033-Baseline: A01 führte Playtest-Fixes, T-0020, Markt-Konkurrenz, Solvenz-Stressfall, Marketing/Logistik, Wochenadvance und Jahressmoke erneut aus; alle Prozesse endeten mit Exit 0. Der Jahressmoke erreichte 2028-01-01 mit 52 Marktchancen, 25 generierten und ausgelieferten Aufträgen, 22 Zuschlägen/Abschlüssen, zwölf Monaten, endlicher Liquidität und null Abstimmungsfehlern. Der separate Ein-Auftrag-Stresstest löste wie vorgesehen Zahlungsausfall und Kreditverwertung aus. Diese Tests schließen den unabhängigen A09-Inhaltsreview, Browser-/Mobilprüfung und T-0033 nicht ab.

A06 hat die verbliebenen 100 WBQ-Fälle zu Recht/Steuern und Unternehmensführung überarbeitet; alle 200 WBQ-Fälle sind nun in der manuellen Prüfliste erfasst. Syntax- und WBQ-Validator bestehen (50/Bereich; A48/B52/C52/D48). A09 erhielt den Auftrag, nach dem vollständigen HSQ-Review auch sämtliche WBQ-Fälle inhaltlich unabhängig zu prüfen. T-0032 bleibt IN_PROGRESS bis zum Review und zur Konfliktbereinigung.

A09 lieferte vorläufige Inhaltsbefunde mit konkreten IDs, konnte aber nur den Projektspiegel ohne `.git` verifizieren. Die wichtigsten Konflikte sind mögliche zweite richtige Antworten/fehlende Annahmen in HSQ BM-027, IFRWC-027/-039, Logistik-007/-010/-015/-018 und WBQ VW-002/RW-013; zusätzlich sind WBQ RT-005/006 rechtlich präziser zu formulieren und mehrere Distraktoren in Marketing/Führung bzw. Recht/Unternehmensführung noch zu offensichtlich. A01 prüft die Fälle im lokalen Repository; A06/A07 korrigieren die jeweiligen Fachdaten. A09 soll danach alle 450 aktuellen Items erneut im Checkout reviewen. T-0032 bleibt offen; siehe CP-0204.

A09 hat die überarbeiteten Inhalte jetzt direkt im tatsächlichen Checkout geprüft. Vorbefunde WBQ VW-002, RW-013 und RT-005/006 sind bereinigt. Neue/festgestellte Restbefunde: doppelte richtige WBQ-Antworten in VW-027/028, HSQ-Mehrdeutigkeiten BM-027, IFRWC-027 und Logistik-007/-010/-015/-018, sowie zu offensichtliche Distraktoren in HSQ Marketing/Führung und WBQ UF-034/045 sowie RT-001. Der WBQ-Validator findet außerdem einen verwaisten Quellenkatalogeintrag `LAW-BGB-631-DIRECT`. A06/A07 korrigieren die Liste aus CP-0205; A09 prüft danach die betroffenen Items und finalisiert die Bereichsfreigabe. T-0032 bleibt IN_PROGRESS.

A06/A07 haben diese Restbefunde bearbeitet; CP-0206 enthält den geänderten Itemumfang. A01 hat nach den Änderungen beide Inhaltsvalidatoren und die Lern-UI-Regression erneut ausgeführt. Sie bestehen, `LAW-BGB-631-DIRECT` ist im aktiven Quellkatalog nicht mehr vorhanden. A09 soll im Checkout mit frischem Preflight den vollständigen aktuellen Satz aus 450 Items und neun Bereichen abschließend lesen. Erst bei seiner Freigabe kann T-0032 geschlossen und T-0033 finalisiert werden.

Der A09-Abschlussreview hatte acht Bereiche PASS gegeben; danach wurde `hsq-logistik-018` verengt und im gezielten Re-Review ebenfalls PASS erteilt. A09 bestätigt damit alle 450 Items und neun Bereiche. WBQ-Checkliste umfasst 200 Freigaben, HSQ-Nacharbeit ist mit konkreten Vorher/Nachher-Items dokumentiert. CP-0208 schließt T-0032 ab und startet T-0033. Offen bleiben die dort vorgesehenen Integrations-/Release-Reviews und Browser-/Mobilprüfung.


## T-0033 – Abschlussprüfung vor Sicherung (CP-0209)

A09 hat alle 450 WBQ-/HSQ-Fälle freigegeben; A04 hat die Daten-/Persistenzgrenze und A11 die Architektur-/Integrationsgrenze bestätigt. A10 hat den PR-Review-Workflow gegen Shell-/Expression-Injection gehärtet und 5/5 Sicherheitstests bestanden; der Workflow selbst wurde nicht ausgeführt. A01 hat die vollständige Simulations-, Lern-, UI- und Jahresregressionsmatrix erneut ausgeführt; alle Läufe bestanden. Die Browser-/Mobilprüfung bei 390×844 zeigte keine horizontale Überbreite, sichtbare Navigation und bedienbare Lernhinweise. git diff --check ist sauber (nur LF/CRLF-Hinweise).

Es liegen keine blockierenden fachlichen oder technischen Konflikte für T-0033 vor. MG-002 und SLG-002.2 bleiben IN_PROGRESS; spätere Prüfungsübungen unter SLG-002.4 bleiben Roadmap-Arbeit. T-0033 bleibt bis zum klar benannten Commit und dem Push über GitHub Desktop IN_PROGRESS. CP-0209 dokumentiert die Gate-Prüfung. Architektur V0.2, ADR-001 bis ADR-008 und jede Schemafreigabe bleiben PROPOSED/nicht erteilt.


## T-0033 abgeschlossen und gepusht (CP-0210)

Der 32-Dateien-Releasecommit 424927125ba882b33726c47de7b68347a9dbe4d9 (feat: add Wirtschaftsfachwirt V2 learning simulation) wurde über GitHub Desktop nach origin/main gepusht. Git bestätigt HEAD = origin/main und sauberen Arbeitsbaum. T-0033 ist COMPLETED. CP-0209 enthält Reviews und Testläufe; CP-0210 enthält Commit-/Pushnachweis. MG-002 und SLG-002.2 bleiben IN_PROGRESS, SLG-002.4 bleibt Roadmap-Arbeit. Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED/nicht freigegeben.

## T-0034 – A01-Implementierung (CP-0211)

T-0034 setzt die Playtestpunkte für Zeitarbeit, Personalentwicklung und Tageslernfragen um. D-0141 beschreibt die Entscheidung und schränkt D-0139 für die aktive Tagesfrage ein; die bisherige Erklärungs-/Bibliothekslogik bleibt erhalten. Agenturbuchungen verwenden feste fiktive Pools, Kopfzahl und 1/5/20 Arbeitstage, gehen in die Tagesplanung und bleiben auftragsungebunden. Persönliche Kompetenz-/Entwicklungspotenziale und Zusatzqualifikationen beeinflussen die Arbeitsleistung; fünf Tagesantworten sind die Obergrenze und werden nur über die Simulationsengine mit kleinen Ruf-/Kompetenz-/Motivationswirkungen angewendet. Die vollständige Regression, Contentvalidatoren, Jahres-Smoke und Browserprüfung bestanden; T-0034 ist COMPLETED. Keine Schema-/Architekturfreigabe. Änderungen bleiben lokal; kein Commit/Push. Siehe [CP-0211](checkpoints/MCP-2026103001.md#cp-0211).

## T-0035 – V2-Neustartprofil, Markt, BAB und Standorte (CP-0212)

T-0035 ist COMPLETED. Der neue Spielstand verwendet 2019 als Einzelunternehmer im Kleingewerbe-Szenario, mit 10.000 € Liquidität, leerem Materiallager, Werkbank/Handwerkzeug und gemieteter Garage. Zehn Miet- und zehn Kaufobjekte, Maschinenmiete, Mindestabnahmen, Baumarkt-Notbeschaffung, Nachfrage nach Standort/Ruf, monatliche Marktberichte und eine dynamische BAB-Auswertung sind umgesetzt. Der Disporahmen wird bei verfügbarer Liquidität gezeigt, nicht als Bilanz- oder Vermögensposition. Die wöchentlichen Marktchancen wurden auf drei je Woche erhöht; Tests enthalten absichtlich unwirtschaftliche Angebote und Endjahr-Deckungsbeitragsbeispiele. Der Jahressmoke endete am 01.01.2020 mit 62 Kundenanfragen, 57 Abschlüssen, zwölf Marktberichten, zwölf BAB-Abschlüssen und 40.974,29 € verfügbarem Szenariobankguthaben nach modellierten Privatentnahmen und einer wettbewerbsfähigen Preisstrategie. UI geprüft auf isoliertem Port 8011: Dashboard, Arbeitsplanung, Standorte und Postfach. GmbH-/UG-Wechsel, Miet-/Kaufpreise, Nachfrage, Personal-/Flächenwerte und Grundschuldablauf sind Szenariomodelle; UG-Rücklage, Steuern, Notar- und Registerverfahren sind nicht vollständig implementiert. D-0142 und [V2-Spezifikation](../simulation/v2-neustartprofil-und-betriebsstandorte.md) dokumentieren Regeln und Grenzen. Keine Schema-/Architekturfreigabe, kein Commit/Push. Siehe [CP-0212](checkpoints/MCP-2026103001.md#cp-0212).
## T-0036 – V2-Anfragefluss und Inventar (2026-10-28; CP-0213)

A01 hat T-0036 implementiert und abgeschlossen. Drei über die Arbeitstage rotierende Anfragetage je V2-Woche ersetzen den festen Eingangstag. Offene Kundenanfragen verfallen nach 3–5 Kalendertagen; eingereichte Angebote warten je Kundenprofil 1–3 Kalendertage auf den modellierten Ausgang. Aktive V1-/Legacy-Angebote bleiben unmittelbar. Die Auftragkarte markiert fehlende Fertigungs- und CNC-Maschinenqualifikationen rot; die Datumsanzeige wird bei einer Arbeitslast oberhalb der einsatzfähigen Tageskapazität gelb. Der Baumarkt ist auswählbarer Materiallieferant sowie tageweiser Werkzeugverleiher; Mietkosten laufen als Betriebskosten und die Rückgabe ist terminiert. Ein eigener Inventarreiter fasst Materialien, Arbeitsmittel, Maschinen, Computerbestand und Ausleihen zusammen.

`v2-orderflow-inventory-regressions.mjs`, `v2-reset-profile-regressions.mjs`, `market-competition-regressions.mjs`, die übrigen vorhandenen Regressionen und der 2027-Jahressmoke liefen erfolgreich; Node-Syntaxchecks und `git diff --check` bestanden. Die 2019-Jahresregression ergibt nun 67 Anfragen, 63 Abschlüsse und 70.746,78 € Endliquidität in ihrem Szenario; diese Werte sind keine Ertragsprognose. Keine unabhängige Agentenprüfung, keine manuelle Browserabnahme und kein Commit/Push in diesem Lauf. Bestehende lokale Änderungen vor T-0036 wurden beibehalten. Siehe CP-0213.
## T-0037 – Bedarfsgebundene Werkzeugmiete und Maschinenanforderungen (2026-10-28; CP-0214)

A01 hat den Baumarktverleih auf auftragsrelevante Spezialwerkzeuge eingegrenzt. Die Oberfläche erklärt jetzt klar: eine Buchung = ein Gerät, der Zahlenwert = Anzahl der Arbeitstage. Nur offene angenommene Aufträge mit passendem `requiredToolId` bieten eine Miete an; Engine-Arbeit wartet bei fehlendem Mietgerät für den erforderlichen Arbeitsgang. Mietmaschinen deklarieren Fachskills und Maschinenberechtigungen; beide werden in der Inventaransicht angezeigt. Logo-Klick navigiert zur Übersicht.

Neue / aktualisierte Prüfung: `v2-orderflow-inventory-regressions.mjs` deckt auch die Sperre ohne passenden Auftrag ab; der 2019-Jahreslauf wurde um die vom Spieler getroffene Mietentscheidung ergänzt und besteht mit 67 Anfragen, 63 Abschlüssen, 12 BAB-/Monatsberichten und 68.790,78 € Endliquidität im getesteten Strategieszenario. Der 2027-Legacy-Jahressmoke und übrige Regressionen bestehen. Keine unabhängige Agenten- oder manuelle Browserabnahme, kein Commit/Push. Siehe CP-0214.
## T-0038 – Lager- und Beschaffungsfluss (2026-10-28; CP-0215)

A01 hat Lagerbelegung, Lieferantenkanäle und Versandfertigware umgesetzt. Rohmaterial und nicht versandte Fertigware teilen sich die Lagerfläche; eine Lieferung wartet, wenn sie die Kapazität überschreiten würde. Baumarkt-Kleinmengen werden sofort aus begrenztem Bestand gebucht; größere oder nicht verfügbare Mengen laufen unter Mindestmenge, mehrtägigem Arbeitszeit-Vorlauf, Versandkosten und reproduzierbarem Verzögerungsrisiko über Onlinelieferanten. Im Inventar sind Materialgruppen, Fertigware und Lieferungen unterwegs separat sichtbar. V2-Fertigware bleibt bis zur Aktion „Auftrag aus Lager versenden“ im Lager; Legacy-Versand bleibt automatisch.

Die gezielte Lager-/Beschaffungsregression, der 2019-Jahreslauf mit Versandentscheidungen, Legacy-Logistiktests und der 2027-Jahressmoke bestehen. Endliquidität des Jahreslaufs ist ein reproduzierbares Szenarioresultat, keine Prognose. Keine manuelle Browserabnahme, keine unabhängige Agentenprüfung, kein Commit/Push. Siehe CP-0215.

## T-0039 – Cross-Agent-Audit, Konfliktbereinigung und Release Committee (CP-0216)

HEAD `006fc2f` und `origin/main` waren zu Beginn gleichauf. Der unveröffentlichte Arbeitsstand umfasste T-0034 bis T-0038. A10 prüfte die Simulations-, Finance- und Datenmodellgrenzen (A02–A04-Fachgebiete), A11 prüfte Frontend-, Lern-, Prüfungs- und Quellenbereiche (A05–A08-Fachgebiete), A09 führte den Release-Committee-/QA-Gate aus und A10/A11 prüften DevOps-/Architekturgrenzen. A01 hat gemeldete Konflikte korrigiert und die Regressionen wiederholt.

Behoben: Tagesfragen nutzen ein eigenes Deck und getrennte Spielwirkung; die 450 WBQ-/HSQ-Übungsfälle bleiben nichtmutierend. Preisfortschreibung ist für V2-2019 (ab 2020) und Legacy-V1-2027 (ab 2028) getrennt. Lieferantencash enthält Nettoaufwand plus SimTAX, während Aufwand netto und Vorsteuer separat geführt werden. Das quartalsweise Dispolimit berücksichtigt Rohmaterial und direkt-materialbezogene noch nicht ausgelieferte Aufträge in der vereinfachten Aktivbasis. Standortverkauf wird bei offener, am Standort gesicherter Darlehensschuld bis zur Tilgung blockiert. Gekaufte Standorte mit 0 € Miete erhalten in der Angebotsfallback-Kalkulation keine fiktive Miete. D-0146 bis D-0148 dokumentieren Konventionen und Grenzen.

Unabhängige Reviews: A11 bestätigte die Trennung des Tagesfragen-/Prüfungsmodus (PASS); A10 bestätigte Preisindizes, Nullmiete, Bruttozahlung/Vorsteuer, Dispolimit und Grundschuldumzug (PASS); A09 gab nach Wiederholung der Gates das Release Committee PASS. Die Mobile-Prüfung bei 390×844 zeigte keine horizontale Dokumentüberbreite (375 CSS-Pixel), horizontale Bottom-Navigation mit Zugriff auf später angeordnete Bereiche und erfolgreichen Aufruf von „Inventar“. Der temporäre Viewport wurde zurückgesetzt.

Validierung: alle 13 Prototype-MJS-Regressionen/Validatoren, 21 Syntaxprüfungen, 5/5 GitHub-Workflow-Sicherheitstests und `git diff --check` bestanden. Die 11 ungetrackten Dateien wurden separat auf trailing whitespace geprüft; keine Beanstandungen. V1-Jahressmoke bis 01.01.2028 und V2-Jahreslauf bis 01.01.2020 bestehen. Kein Schema-/Architekturentscheid; ADRs bleiben unverändert `PROPOSED`.

T-0039 ist fachlich abgeschlossen. Der vollständige Sicherungsstand ist zum GitHub-Desktop-Commit/Push freigegeben. Vor dem Sicherungsschritt waren keine Dateien gestaged und keine Änderungen committet. Siehe CP-0216.

## T-0039 Sicherung (CP-0216)

Die 29 geprüften Dateien wurden als `c15cd31ca74d113b01919c77776ad1ab54649bec` (`chore: secure audited simulation snapshot (CP-0216)`) committet und über GitHub Desktop nach `origin/main` gepusht. HEAD und `origin/main` waren danach gleich; der Arbeitsbaum war sauber. T-0039 ist abgeschlossen. Keine Schema-/Architekturfreigabe; ADR-001 bis ADR-008 bleiben `PROPOSED`.

## Aktueller Ziel- und Arbeitsstand (T-0047; CP-0227)

MG-002 wurde neu als integriertes browser- und mobilfähiges Wirtschaftslernspiel formuliert. [v2-v12-goal-map.md](v2-v12-goal-map.md) legt V2-Qualitätsziele und Beiträge aller Rollen A01–A12 fest; V3–V6 definieren die WBQ-Fächer Volks-/BWL, Rechnungswesen, Recht/Steuern und Unternehmensführung; V7–V11 je ein HSQ-Handlungsfeld; V12 integriert Prüfung und Falltransfer. Jedes Fachziel verlangt einen vollständigen spielbaren Prozess, nicht nur Lernkarten. Der vorgeschlagene GameContext-Vertrag bleibt PROPOSED und ist keine Architektur- oder Schemafreigabe.

A01 hat die fehlende Mitarbeiter-Zeitleistenrenderfunktion integriert, Tagesauswahlen pro Person ergänzt und veralteten, nach der Migration ungenutzten `data-plan`-Handler entfernt. Inline-SVG-Inventarsymbole und zugängliche Tooltip-Namen/Fähigkeiten sowie Hin-/Rücksprung aus Spielkontext zu Lernkarte sind enthalten. Die neue Ziel-/UI-Regression und bestehende gezielte V2-Regressionen bestehen; das iPhone-Paket wurde neu gebaut und umfasst `planning-ui.js`. A01–A12 haben den Zielentwurf nach Fachgruppen geprüft; Einzelbefunde und Restpunkte stehen in [CP-0227](checkpoints/MCP-2026103001.md#cp-0227).

T-0047 bleibt IN_PROGRESS bis A12-Sichtprüfung und V2-Jahressolvabilität. Der bekannte Jahreslauf endet mit `gameLost=true` und 119.638,87 € offenen Kosten; das ist ein V2-Releaseblocker. Es gibt kein reales iOS-Safari-Ergebnis. Keine Architektur-/Schemafreigabe, kein Commit/Push.

## Ticketabschluss T-0050, T-0047 und T-0040 (CP-0257-Entwurf; 2026-10-30)

A01 hat die drei zuletzt offenen MG-002-Tickets nach der dokumentierten Reihenfolge umgesetzt. T-0050 besitzt jetzt pro Mitarbeiter eine stabile Tagesblock-Reihenfolge; nach einer abgeschlossenen Fertigungsstufe kann die nächste zugewiesene Stufe oder Arbeitsaufgabe am selben Tag beginnen. Nicht zugewiesene Folgestufen bleiben gesperrt. Die Zeitleiste stellt geplante Reihenfolge und geschätzte Stundenlast dar. Produktive Stunden geben kleine, bis zum individuellen Maximalpotenzial gedeckelte Kompetenzzuwächse; Motivation bleibt leistungswirksam und wird leicht angepasst. Auftragsdetails werden nach 365 Tagen verdichtet; Finanzfelder bleiben erhalten.

Für T-0047 erfolgte eine responsive Browserprüfung bei 390×844: 375 CSS-Pixel Dokumentbreite ohne horizontalen Überlauf, neun sichtbare Navigationsbereiche, fünf Werktage und keine Wochenendspalten. Lieferantenauswahl und Formular passen in die mobile Kartenbreite. Die Recovery-Prüfung stellte einen zuvor gesicherten Spieltag nach dem Voranschreiten wieder her. Der Offline-iPhone-Build wurde erneuert; ein reales iOS-Safari-Gerät wurde nicht geprüft.

T-0040 führt Katalogpreise als Nettobasis, weist 19 % SimTAX separat aus, belastet Cash/Ratenkauf mit Brutto und hält Netto-Buchwert/GWG-Basis getrennt von der monatlichen Vorsteuer-Komponente. Die Inventar-/Vorsteuerregression und der Jahres-Smoke bestehen. Das bleibt eine Simulationsvereinfachung, keine vollständige steuerliche Behandlung.

Validierung: die 15 Regressionen/Smokes aus CP-0253 bestanden erneut; dazu Syntaxprüfungen und `git diff --check` (nur Git-Zeilenendenhinweise). Der Jahressmoke erreicht 2028-01-01 mit 59 bezahlten Abschlüssen, 1.759,26 € Bankbestand, 0 € unbezahlten Kosten und ohne Reconciliation-Fehler. Browsermessung: innerWidth 390, Dokumentbreite 375, 9/9 Nav-Buttons sichtbar, Lieferantenfeld 311,6 px breit innerhalb der Karte.

Arbeitsstand basiert auf `a1ae2bfac0948db5cb46763331f342efe3527d08`, Branch `main` gleichauf mit `origin/main`. Das gesamte lokale Änderungsset wurde erhalten. Kein Commit und kein Push. Keine Schema-/Architekturfreigabe. Die CP-0257-Datei ist als Entwurf zu behandeln, bis eine Reviewanalyse abgeschlossen und vom Nutzer bestätigt wurde; bereits bestätigte CPs/MCPs wurden nicht geändert.
## Review und Retro zu T-0050/T-0047/T-0040 (CP-0257 Entwurf; 2026-10-30)

A01-Rollenprüfung: PASS mit Restgrenzen. Die Umsetzung ist mit den drei Ticketakzeptanzen vereinbar; kein blockierender Implementierungskonflikt gefunden. 15 vorhandene Regressionen/Smokes liefen mit Exitcode 0; der deterministische Jahressmoke bestand. Responsive Browsermessung 390×844 und ZIP-Neubau wurden dokumentiert. Kein unabhängiger Agentenreview und kein realer iOS-Gerätetest in diesem Durchlauf. SimTAX/AfA bleibt Szenariomodellierung, keine Rechts-/Steuerfreigabe; MG-002 und V2 bleiben IN_PROGRESS.

Retro: A01 hat die fachlichen Rollen intern geprüft. Für künftige Paketübergaben sollten Simulation/Finance, UI, QA und Build getrennte Prüfschritte mit kleinem Übergabeartefakt haben. Der Bereich „Aktive Tickets“ im Ticket-Board enthält historisch abgeschlossene Tickets; separate Bereinigung empfohlen, nicht blockierend. CP-0257 bleibt Entwurf bis zur Analysebestätigung; CP-0256 sowie bestätigte CPs/MCPs wurden nicht verändert. Kein Commit/Push.

## CP-0257 bestätigt; Ticket-Board bereinigt (CP-0258 Entwurf; 2026-10-30)

Der Nutzer bestätigte CP-0257 am 2026-10-30 als abgeschlossene Analyse. CP-0257 gilt damit als eingefroren und wurde nicht nachträglich geändert; sein gespeicherter Entwurfsstatus bleibt als damaliger Dateistand erhalten. Diese Bestätigung ist für Folgearbeit über CP-0258 dokumentiert.

Auf ausdrückliche Nutzerbestätigung wurden 14 als COMPLETED markierte Ticketblöcke aus „Aktive Tickets“ nach „Abgeschlossene Tickets“ verschoben, ohne ihre Inhalte zu ändern oder zu löschen. Es verbleiben keine aktuell offenen Einträge unter der aktiven Überschrift. MG-002/V2 ist weiterhin IN_PROGRESS. `git diff --check` bestanden (nur LF/CRLF-Hinweise); kein Commit/Push. CP-0258 ist Entwurf.

## Reviewfrequenz gemäß Nutzerregel D-0155 (CP-0259 Entwurf; 2026-10-30)

Ab jetzt werden gebündelte Review, Retro und Analyse nur nach jedem 250. CP durchgeführt (CP-0250, CP-0500, CP-0750 usw.), zusätzlich jeweils nach erfolgreichem Commit und Push. Eine Analyseabfrage erfolgt nicht nach jedem einzelnen CP/Arbeitsauftrag. Dies ersetzt die ältere Routineformulierung in MCP-2026103001; historische CP/MCP-Dateien wurden nicht editiert. Die Anweisung wurde in AGENTS.md, Agentenstruktur und Rechtekarte übernommen; D-0155 wurde ergänzt. CP-0257 bleibt bestätigt und eingefroren. CP-0258 bleibt ein nicht analysierter Entwurf. Keine Review wurde für CP-0259 gestartet, da dies kein 250er-Meilenstein und kein Commit-/Push-Lauf ist.

## Pre-Commit Cross-Agent-Review (T-0056/CP-0260 Entwurf; 2026-10-30)

A02–A12 haben die Änderungen jeweils in ihrem Rollenbereich geprüft; A01 integrierte die Befunde. A02 fand Queue-Rollbackfehler, der mit Regression behoben wurde. A03 fand die Inkonsistenz zwischen D-0149 und der V2-Inventar-Vorsteuerlogik; D-0156 löst sie begrenzt für V2-Kataloganlagen. A10 fand fehlendes SHA-256-Manifest und iPad-Anleitung; Builder/ZIP/README wurden aktualisiert. Zielreviews: A02 PASS, A03 PASS, A04 PASS, A05 PASS, A06 PASS, A07 PASS, A08 PASS mit Verifikationsgrenze, A09 PASS, A10 PASS, A11 PASS, A12 keine echten Geräte geprüft. Die 15 Regressionen liefen erneut erfolgreich. Der Paketmanifest-Test bestätigte die Prüfsummen und Manifest-ZIP-Mitgliedschaft. Keine Schema-/Architekturfreigabe; kein Commit/Push bislang.
