# A08 – Öffentliche Marktdaten für V3/T-0065: Eignungsprüfung

**STATUS:** Quellenreview abgeschlossen; Preisentwicklung teilweise proxyfähig, Angebotspreisniveau und Konkurrenzmittel aus öffentlichen Daten nicht belastbar kalibrierbar
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A08 – RESEARCH
**MASTER GOAL / SECOND-LEVEL GOAL:** MG-002 / SLG-002.2
**TICKET:** T-0065 – V3 Markt, Nachfrage, Wettbewerb und Angebotsentscheidung
**BEZUG:** D-0159–D-0164, insbesondere D-0162; CP-0279 und CP-0280 (ENTWURF)
**REPOSITORY:** C:\Users\Tobia\Documents\GitHub\WFWSimulation; main; HEAD 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c
**Recherche-/Zugriffsdatum:** 2026-10-31

## Ergebnis

Öffentliche Primärdaten können einzelne **Preisbewegungen** und getrennte Kosten-/Nachfrageachsen stützen, aber keine repräsentative Euro-Preisverteilung kleiner privater Werkstatt-/CNC-Aufträge für München/Oberbayern und keine durchschnittlichen Konkurrenzangebote je Auftragsgröße liefern.

Die stärkste gefundene Preisproxyreihe ist der monatliche Destatis-Erzeugerpreisindex gewerblicher Produkte für GP2019 25 62 „Mechanikleistungen, a.n.g.“ einschließlich Untergruppen wie Drehteile aus Metall. Dieser nationale Index kann für passend klassifizierte mechanische Leistungen Preisentwicklung plausibilisieren. Er ist kein Münchner Stundensatz, keine Auftragskalkulation und kein Konkurrenzmittel. Destatis Auftragseingangsindizes sind Nachfrageindikatoren; Metall-Erzeugerpreisindizes sind Material-/Inputkosten; Tarif-/Entgeltstatistiken sind Lohn-/Arbeitskosten. Diese Größen sind getrennt zu halten.

TED veröffentlicht einzelne öffentliche Zuschlagswerte für Metallarbeiten, aber die Fälle sind selektiv und häufig projekt-/bau-/montagebezogen. Sie bilden weder kleine private Lohnfertigungsaufträge noch Konkurrenzangebote ab. IHK-Berichte liefern regionale Geschäftsklima-/Erwartungskontexte, keine Angebotspreise.

**Urteil:** Das aktuelle Marktmodell darf als synthetisches Szenariomodell weitergeführt und muss so gekennzeichnet bleiben. Eine empirische Kalibrierung kleiner Werkstatt-Angebote oder Wettbewerbermittel ist nicht nachgewiesen.

## Preflight und Git-Stand

Erneut gelesen/geprüft: AGENTS.md; Agentenstruktur/Rechte; goals.md; ticket-board.md; collaboration-state.md; decision-log.md; CP-0279 und CP-0280-Entwurf; D-0159–D-0164; T-0065; A02-Marktmodellrahmen, Arbeitsbericht und T-0063/T-0065/T-0066-Integrationsvertrag; A03 T-0065-Finanzreview und T-0067-Vertrag; A05-Marktfixture/UI; A09-T-0065-Runtime-Review; vorheriger A08-Provenienzreview. Änderungen mehrerer Agenten waren vorhanden und wurden erhalten. Branch main, HEAD 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c; kein Commit/Push.

Im aktuellen A05-Demofixture sind explizite synthetische Werte: Wochentagsverteilung 0,20; Einladungsgewichte Kapazität/Ruf/Segment 0,25/0,35/0,40; Mindestscore 0,20; maximal vier Einladungen; Anfragefenster 3–5 Kalendertage; Entscheidung nach 2 Tagen; Mindeststichprobe 2; Angebotsgewichte 0,60/0,20/0,20 und 0,40/0,25/0,35; Referenzpreise 110/550 €; Konkurrenzangebote 100/500 € bzw. 120/620 €. Sie sind Fixture-Eingaben, keine beobachteten Marktdaten, bestätigten Produktkoeffizienten oder Nutzerentscheidungen.

## Quellen- und Eignungsmatrix

| Primärquelle | Was sie misst | Eignung | Nicht ableitbar |
|---|---|---|---|
| Destatis GENESIS 61241-0004, GP2019 25 62 „Mechanikleistungen, a.n.g.“ | Monatlicher nationaler Erzeugerpreisindex; Indexbasis 2021=100; Tabellenzeitraum bis 2026. Untergruppen u.a. Drehteile aus Metall. | Bedingt passend als Preisbewegungsproxy für genau zugeordnete Dreh-/Mechanik-Leistungen. | Kein absoluter Europreis pro Auftrag/Stunde/Los, keine Münchner Regionaldifferenz, kein Wettbewerbermittel und kein Angebotspreis für beliebige Fräs-, Schweiß-, Prototyp- oder Kleinserienfälle. |
| Destatis Qualitätsbericht/Methodik Erzeugerpreise | Preisrepräsentanten, Warenkorb und Berichtstellen mit gezielter Auswahl; nicht jeder Verkaufsfall ist beobachtet. Monatsbeobachtung; Revision bei Basis-/Wägungswechsel. | Erklärt Aussage und Grenzen des Preisindex. | Keine Vollerhebung/Quote-Stichprobe aller Werkstätten und keine veröffentlichte Preisverteilung. |
| Destatis GENESIS 42151-0002 Wertindex und 42151-0004 Volumenindex, Auftragseingang WZ08-25 | Monatliche Branchenaufträge, Deutschland; Wert- und preisbereinigte Volumensicht. | Grober Nachfrage-/Konjunkturimpuls. | Keine individuelle Anfragehäufigkeit, Auftragsquote, Werkstattpreise oder Zuschlagschance. |
| Destatis Metall-/Güterpreisreihen GP24/25 | Metall-/Güterpreisbewegung am Erzeuger, national. | Material-/Inputkostenproxy, wenn Güter und Handelsstufe passen. | Kein Bearbeitungs-, Maschinen- oder Lohnfertigungspreis. |
| Destatis Tarifverdienst/Arbeitskosten und BA-Entgeltstatistik | Tarif- und Beschäftigtenentgelt nach Zeit, teils Wirtschaftszweig/Beruf/Region. | Lohn-/Arbeitskostenkomponente; BA regional zur groben Einordnung. | Kein voll belasteter betrieblicher Stundensatz und kein Kundenpreis. |
| TED Contract Award Notices, z.B. CPV 45262670 Metalworking | Einzelne öffentliche Zuschläge mit Betrag, Ort, Vergabeart und teils Angebotsanzahl; gesetzliche Schwellen-/freiwillige Veröffentlichung. | Einzelfall-Lehrbeispiele, wenn Leistungsumfang, Mengen, Ort, Montage, Netto/Brutto und Zeit vergleichbar gemacht werden. | Keine repräsentative private KMU-Grundgesamtheit; kein Durchschnitt der konkurrierenden Gebote; öffentliche Bau-/Montagepakete oft nicht mit CNC-Lohnfertigung vergleichbar. |
| IHK München/Oberbayern/BIHK-Konjunkturberichte | Geschäftsklima, Erwartungen und Risiken auf regionalem/branchenbezogenem Aggregat. | Qualitative Nachfrage-/Risikoplausibilisierung. | Keine Stück-/Lospreise oder Anbieterwettbewerb. |

## Recherchebelege und Stand (Primärquellen, geprüft am 2026-10-31)

- [GENESIS 61241-0004: Erzeugerpreisindex gewerblicher Produkte, Deutschland, Monate, GP2019](https://genesis.destatis.de/datenbank/online/statistic/61241/table/61241-0004). Metadaten nennen den monatlichen Index; aktuelle Filterung/Export wurde nicht automatisiert, da die Weboberfläche clientseitig JavaScript erfordert.
- [Destatis Qualitätsbericht Erzeugerpreise gewerblicher Produkte](https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Preise/erzeugerpreise.pdf?__blob=publicationFile). Die Stichprobe kombiniert Warenkorb-/Cut-off- und gezielte Auswahl repräsentativer Stellen/Verkaufsfälle. Die vollständige Grundgesamtheit aller Verkäufe ist nicht bekannt.
- [Destatis Monatsveröffentlichung/Erzeugerpreispositionen](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Erzeugerpreisindex-gewerblicher-Produkte/Publikationen/Downloads-Erzeugerpreise/erzeugerpreise-2170200221124.pdf?__blob=publicationFile). Führt GP 25 62 und „Mechanikleistungen, a.n.g.“ sowie dessen Unterteilung auf.
- [Destatis FAQ zum Erzeugerpreisindex gewerblicher Produkte](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Erzeugerpreisindex-gewerblicher-Produkte/FAQ/FAQ-Liste.html). Destatis sagt ausdrücklich, der Index werde nur als deutsches Gesamtergebnis berechnet; es gebe keine Länderindizes.
- [GENESIS 42151-0002 Auftragseingang, Wertindex](https://genesis.destatis.de/datenbank/online/statistic/42151/table/42151-0002) und [GENESIS 42151-0004 Auftragseingang, Volumenindex](https://genesis.destatis.de/datenbank/online/statistic/42151/table/42151-0004). Monatliche Branchenreihen; Wert und preisbereinigtes Volumen sind getrennte Messgrößen.
- [GENESIS 62231-0001 Tarifverdienstindizes nach Wirtschaftszweig](https://genesis.destatis.de/datenbank/online/statistic/62231/table/62231-0001) und [Destatis Tarifindex-Übersicht](https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Tarifverdienste-Tarifbindung/Tabellen/Tarifindex.html). Tarif-/Lohnentwicklung, nicht Werkstattangebotspreise.
- [Bundesagentur für Arbeit: regionale Entgelte](https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Interaktive-Statistiken/Entgelte-regional/Entgelte-regional-Nav.html). Jahreswerte sozialversicherungspflichtiger Beschäftigtenentgelte, nicht Verkaufspreise.
- [TED Dashboard veröffentlichte Verträge](https://ted.europa.eu/en/simap/dashboard-contracts-published). Beschreibt Award-Notice-Grundlage, Veröffentlichungsgrenzen, Datenbereinigung und Einschränkungen.
- [TED Suchhilfe](https://ted.europa.eu/en/help/search-browse). Ermöglicht Filter nach CPV, Ort, Vertragsart und Wert, begründet aber keine Vergleichbarkeit.
- [IHK für München/Oberbayern: regionale Konjunktur München](https://www.ihk-muenchen.de/politik/konjunktur/regionale-konjunktur/region-muenchen/). Regionaler Konjunkturindikator, keine Preisstatistik.
- [BIHK Konjunkturbericht Jahresbeginn 2026](https://www.ihk-muenchen.de/ihk/Konjuntur/KonjunkturberichtJahresbeginn2026.pdf). Befragungs-/Erwartungsindikator, keine Werkstatt-Quotes.
- Ein konkretes [TED-Metallarbeitsbeispiel](https://ted.europa.eu/en/notice/145335-2026/pdf) bezeichnet Schlosserarbeiten mit Treppengeländern und Seilsicherungssystemen. Es illustriert, weshalb CPV „Metalworking“ allein keine Gleichartigkeit mit CNC-Lohnfertigung herstellt.

## Defensibler Kalibrierungsweg ohne Angebotsdaten

Dieser Ablauf ist eine Quellen-/Methodenempfehlung, kein neuer Parameterdefault oder Produktentscheid:

1. **Zielgrößen trennen:** Nachfrageintensität, Material-/Arbeits-/Maschinenkosten, Preisbewegung, synthetisches Euro-Angebotsniveau und Zuschlags-/Einladungslogik sind verschiedene Reihen mit eigener Einheit, Periode, Geografie und Provenienz.
2. **Auftragspreis synthetisch aus Arbeitsumfang bilden:** Für ein spezifiziertes Testteil aus Materialmenge, Rüst-/Bearbeitungs-/Prüfzeit, Maschinenzeit und getrenntem Kostenblock einen transparenten Nettoplanpreis bilden. D-0162/A03 liefert den Kalkulationsrahmen. Der Startbetrag bleibt als Modellannahme gekennzeichnet, nicht „Marktpreis“.
3. **Preisbewegung proxy-basiert und selektiv:** Für Dreh-/Mechanikfälle eine gesonderte Variante mit GP2019 25 62 bzw. passender Untergruppe gegen einen synthetischen Kontrollpfad testen. Keine automatische Übertragung auf alle Prozesse oder den Startwert. Basiswechsel und Serienvergleich dokumentieren.
4. **Inputkosten getrennt indexieren:** Stahl/Aluminium nach passender Güter-/Handelsstufe; Arbeitskosten separat über Tarif-/Arbeitskosten-/BA-Daten; keine Gleichsetzung mit erzielbarem Verkaufspreis.
5. **Nachfrage separat modellieren:** WZ08-25-Auftragseingang (Wert und Volumen getrennt) sowie IHK-Konjunkturumfragen höchstens als nationale/regionale Nachfrageindikatoren. Die Übertragung vom Aggregat zur kleinen Werkstatt bleibt eine dokumentierte Modellannahme.
6. **Wettbewerbsreaktionen synthetisch lassen:** Relative Angebotspositionen und Wirkungsrichtungen in isolierten Paarvergleichen testen. Ohne Quote-Stichprobe keine empirische Zuschlagswahrscheinlichkeit oder „Konkurrenzdurchschnitt“ behaupten. Low/Base/High sind Sensitivitätsfixtures, keine Konfidenzintervalle.
7. **Daten-Gate für spätere empirische Kalibrierung:** Benötigt wird eine erlaubte, vergleichbare Menge von echten Angeboten plus Outcomes: Prozess, Material, Toleranz/Qualität, Losgröße, Rüst-/Bearbeitungszeit, Maschinenklasse, Region, Datum, Lieferfrist, Netto/Brutto, Angebotsstatus, Zuschlag/Absage und Konkurrenz-Stichprobenumfang. Quotes, beauftragte Werte und realisierte Erlöse getrennt halten; A08 prüft Selektionsbias, A02 Modellfit, A03 Kosten-/Preisabgrenzung, A09 zeitlich getrennte Out-of-sample-Prüfung. Bis dahin bleibt die Preis-/Wettbewerbsengine synthetisch.

## Gate-Ergebnisse

| Gate | Ergebnis |
|---|---|
| Amtliche Preisbewegung für passende Teilgruppe | **PASS mit enger Grenze:** GP 25 62 monatlich und national; Bewegungproxy für passende Mechanikfälle, kein Niveau-/Münchenanker. |
| Kleine Werkstatt-Euro-Angebotspreise für München | **NICHT BELEGT:** keine öffentlich zugängliche repräsentative Quote-/Losstichprobe gefunden. |
| Konkurrenzmittel nach Auftragsgröße/Segment | **NICHT BELEGT:** amtliche Indizes und TED liefern dies nicht. |
| Kosten, Nachfrage und Verkaufspreis methodisch getrennt | **PASS.** |
| A02/A03/A09 Kalibrierungs-/Runtimeprüfung | **Nicht ausgeführt in diesem Quellenreview.** |
| T-0065 insgesamt | **IN_PROGRESS:** A09-restore blocker, Integrations-/UI- und Jahresgate sind separate offene Nachweise. |

## Nachweisrollen und Handoff

- **Ausführung:** A08 Research; nur neuer Forschungsbericht.
- **A02-Fachreview:** nicht ausgeführt; A02 kann die Zuordnung konkreter Spielaufträge zu GP-Untergruppen und die synthetische Preisniveau-Methode fachlich vorschlagen.
- **A03-Fachreview:** nicht ausgeführt; A03 soll Inputkosten-/Arbeitskosten-/Preisbewegungsproxy/Nettoplanpreis gemäß D-0162 getrennt bestätigen.
- **Unabhängige QA/A09:** nicht ausgeführt; spätere Indextests, Einheiten- und Provenienztests separat.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** Branch/HEAD und paralleler Status zu Beginn erfasst; keine Fremddateien geändert. Die neue Berichtsdatei wurde mit git diff --no-index --check geprüft. Kein Commit/Push.

**Nächster Schritt an A01:** A02 mit der Prozesszuordnung des GP-25-62-Proxys und der explizit synthetischen Basispreisbildung beauftragen; A03 die getrennte Nutzung als Preisänderungsproxy gegen Kosten- und Angebotswert prüfen lassen. Keine neuen Marktpreise, Koeffizienten oder Konkurrenzmittel aus den öffentlichen Indizes ableiten.

## Nachtrag – A02-Korrektur der Mindeststichprobe (geprüft 2026-10-31)

Nach dem obigen Quellenreview hat A02 die Runtime-/Vertragsformulierung geändert und A09 dazu einen gezielten unabhängigen Re-Review abgelegt. Ich habe frisch die Control-Plane, den T-0065-Stand, die aktualisierten A02-Dateien, die relevanten Markt-/A05-Regressionen und A09-Nachweise erneut gelesen; Branch/HEAD blieb main / 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c, parallele Änderungen blieben erhalten.

**A08-Prüfung der Formulierung: PASS, eng begrenzt.** A02 spezifiziert jetzt mindestens drei eindeutige Konkurrenzangebots-IDs je Größenklasse und Kalendermonat. Unter n=3 wird der Mittelwert unterdrückt; n bleibt sichtbar. Die Texte nennen das ausdrücklich eine konservative, synthetische Spiel-Aggregationskonvention und sagen ausdrücklich, dass sie weder Rechts-, Statistik- noch allgemeine Datenschutz-/Anonymitätsgarantie ist; bekannte Zusatzinformationen können auch ein größeres Aggregat rückrechenbar machen. Das adressiert meinen vorigen Befund angemessen, ohne eine Schutzwirkung von n=3 zu behaupten.

A09s gezielter Runtime-Nachweis docs/test-reports/a09-t0065-market-sample-threshold-review.md bestätigt im isolierten Runtimeumfang: Profile mit Schwelle 2 werden abgewiesen; n=2 wird unterdrückt; exakt n=3 wird veröffentlicht; doppelte offerId erhöht n nicht; die drei Segment-/Größenklassen werden getrennt aggregiert und firmId/offerId fehlen in der Berichtzeile. Das ist ein technischer Mechanik-/Konsistenznachweis, keine empirische Privacy- oder Preisrealitätsvalidierung.

**A05-Integrationsstatus bleibt offen:** A02s Arbeitsbericht sagt, dass prototype/v3/market.js und die DOM-Regression weiterhin die frühere Mindestschwelle 2 und zwei Größen-/Segmentklassen verwenden. Die A05-Demo-Kopie zeigt zudem weiter „anonyme Monatsaggregate“. Der neue A02/A09-Nachweis deckt diese UI-Fixture nicht ab. A02 hat dies als getrennten A05-Handoff ausgewiesen. Daher bleibt das in der Hauptbewertung getrennte UI-/Integrationsgate offen; die Schwellenkorrektur ändert weder die öffentlichen Quellenlage noch die Eignungsgrenze: kein öffentlicher Datensatz für kleine Münchner Werkstattangebote oder Konkurrenzmittel je Auftragsgröße wurde dadurch verfügbar.

Kein Produktcode oder A02/A05-Dokument wurde durch A08 bearbeitet. Nur dieser Quellenbericht erhielt den Nachtrag. Der Whitespacecheck auf docs/research/a08-t0065-public-market-data-suitability.md ist bestanden; Git meldet die konfigurierte LF/CRLF-Konvertierung. Kein Commit/Push.

## A01-Koordinierungsnachtrag (2026-10-31)

Der frühere UI-Handoff mit zwei Größenklassen und Mindeststichprobe 2 war zum Zeitpunkt von A08s Bericht zutreffend, wurde danach aber überholt. A01 hat mangels A05-Checkout-Zugriff die beschränkte A05-Fixture-/Regression-Angleichung übernommen: drei Größenklassen/Segmente und Anzeigeschwelle `n>=3`. A09 hat den aktuellen UI-Pfad unabhängig PASS geprüft. Der fachliche Forschungsbefund bleibt unverändert: öffentliche Quellen stützen keine empirische Münchner Werkstatt-Auftragspreisverteilung; `n>=3` ist keine Rechts-/Datenschutzgarantie. Siehe `docs/simulation/a01-t0065-market-ui-alignment-bericht.md` und `docs/test-reports/a09-t0065-market-ui-final-review.md`.
