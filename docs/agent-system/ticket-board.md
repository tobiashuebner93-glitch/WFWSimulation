# Ticket Board – WFWSimulation

## Aktive Tickets

### T-0010 – A02-Spezifikation für erste spielbare Version überarbeiten

Status: PENDING
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION
Priorität: HIGH

Aufgabe:

Die bestehende A02-Spezifikation nach Abschluss der P0-Koordination und Bereitstellung fachlich geprüfter Startwerte erneut prüfen und vor der ersten spielbaren Version sinnvoll ersetzen/überarbeiten. Die bestätigte Warengruppenauswahl gemäß D-0095 integrieren. Norm-/Zukaufteile gemäß D-0096 als nachvollziehbare Artikel statt als einen Durchschnittspreis-Sammelposten abbilden; Schrauben, Muttern und Teile anderer Hersteller sind ausdrücklich Teil der vorgesehenen Gruppe. A02 bestimmt die operative Produkt-/Verbrauchsstruktur, erfindet aber keine Marktpreise und keine A03-Finanzregeln.

Abhängigkeiten:

- T-0008 hat die dafür benötigten Nutzerentscheidungen und Fachübergaben koordiniert.
- T-0011 liefert belegte, als Vorschläge gekennzeichnete Markt-/Referenzdaten.
- A03 bestätigt Startbewertung, Preisbehandlung, Anfangsmengen und accountingrelevante Werte in eigener Fachverantwortung.

Akzeptanzkriterien:

- A02-Spezifikation ist als reproduzierbares Startprofil für eine erste spielbare Version überarbeitet oder durch ein nachvollziehbares Ersatzdokument abgelöst.
- Bestehende bestätigte Simulationsregeln und D-0010-Scope bleiben erhalten.
- Die vom Nutzer bestätigten V1-Warengruppen aus D-0095 werden berücksichtigt; Dienstleistungen/Versorgungsleistungen werden nicht automatisch als Lagerbestand oder Materialverbrauch modelliert.
- Norm-/Zukaufteile sind nicht länger nur ein aggregierter Durchschnittspreis-Sammelposten; Artikeltypen, Einheiten, Mengen und Verbrauchsbezüge sind nachvollziehbar spezifiziert.
- Preise und Anfangswerte stammen aus bestätigten Quellen-/Nutzerwerten; offene A03-Regeln bleiben als offen markiert.
- Änderungsbericht und Checkpoint; `git diff --check`.
- Keine Implementierung, Datenbank-/Supabase-/Schema-/Dependency-/Architekturänderung und keine Architekturfreigabe.

Grundlage: D-0092 bis D-0096, CP-0118 bis CP-0120. Start erst nach den genannten Abhängigkeiten.

---

### T-0011 – Marktdaten und Referenzwerte für ausgewählte V1-Warengruppen recherchieren

Status: PENDING
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A08 RESEARCH
Priorität: HIGH

Aufgabe:

Für die vom Nutzer bestätigten V1-Warengruppen gemäß D-0095 nachvollziehbare aktuelle Markt-/Referenzdaten und realistische Szenariovorschläge recherchieren. Für Norm-/Zukaufteile sind konkrete, repräsentative Artikel wie Schrauben, Muttern und Zukaufteile anderer Hersteller gesondert auszuweisen statt nur eines gemittelten Gruppenpreises. Daten sind mit Quelle, Erhebungs-/Gültigkeitsdatum, Region, Spezifikation, Einheit, Preisbasis und Einschränkungen zu dokumentieren. Die Ergebnisse bleiben Vorschläge bis zur Nutzerbestätigung; A08 entscheidet keine Simulation-, Accounting- oder Produktregel.

Akzeptanzkriterien:

- Quellen und Preis-/Referenzdatum für jede untersuchte Position nachvollziehbar dokumentiert.
- Einzelartikel und Einheiten für Norm-/Zukaufteile werden vorgeschlagen; keine stillschweigende Mittelung der Gruppe.
- Für Dienstleistungen und Versorgungsleistungen werden geeignete Preis-/Einheitenbezüge ausgewiesen und von Lagergütern unterschieden.
- Fehlende, nicht vergleichbare oder nicht belastbare Daten werden als Lücke gekennzeichnet; keine Ersatzwerte erfinden.
- Vorschlagspaket an A01 mit offenen Nutzerentscheidungen; keine Preise als bereits beschlossen darstellen.
- Änderungsbericht und Checkpoint; `git diff --check`.
- Keine Anwendungscode-, Datenbank-/Supabase-/Schema-/Dependency-/Architekturänderung.

Grundlage: D-0093 bis D-0096 und CP-0118 bis CP-0120. Ergebnisse sind Input für T-0010 und für A03s Bewertung unter T-0008.

---

### T-0008 – P0-Fachparameter koordinieren und entscheidungsreif vorbereiten

Status: IN_PROGRESS
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe:

Die in CP-0031 und den Fachunterlagen offenen P0-Parameter geordnet koordinieren. A01 koordiniert ausschließlich; keine Fachentscheidung, Implementierung oder Architekturfreigabe. Die dokumentierten Nutzerentscheidungen D-0013 bis D-0119 und der A03-Abgleich CP-0148 sind übernommen; nur tatsächlich offene Parameter und Fachabstimmungen werden weiterverfolgt. A02 hat D-0011 unter T-0009 übernommen; T-0009 ist mit CP-0150 abgeschlossen. Operative Ereignis-/Periodenabstimmungen mit A03 bleiben als getrennte Arbeit unter T-0008 offen.

Akzeptanzkriterien:

- P0-Entscheidungsvorlage mit gesicherten Regeln, präzisen offenen Fragen, Fachrollen und Auswirkungen erstellt
- A02-Abgleich CP-0150/CP-0153, A03-Abgleich CP-0148/CP-0154, A04-Abgleich CP-0151 und A02/A03-Bericht CP-0155 korrekt referenziert; keine nicht erfolgte Arbeit behauptet
- Abhängigkeiten zwischen Kalender-/Simulationsregeln und Finanzregeln dokumentiert
- Kundeneingänge ohne eigenes Cash-Gate und eigene Auszahlungen mit eigenem Liquiditäts-Gate getrennt gehalten
- Beschlossene Darlehensart, Restlaufzeit, Monatsrhythmus und Zinslogik gemäß D-0030 bis D-0043 als entschieden behandeln; Rate und erster tatsächlicher Zahlungstermin bleiben offen
- A03-Abgleich CP-0148/CP-0154 integrieren; A02-T-0009/CP-0150 und CP-0153 sowie A04-CP-0151 und A02/A03-CP-0155 korrekt referenzieren.
- A04-Abschlussabgleich CP-0151, A02-Startprofilkorrektur CP-0153, Vorratsabgleich CP-0154 und Ereignisabstimmung CP-0155 integrieren; aktive Steuerungs- und Fachunterlagen gegen Decision Log und CP-0148 bis CP-0155 validieren.
- D-0010 und ADR-Status unverändert; keine Anwendungscode-, Schema-, Datenbank-, Supabase-, Dependency- oder Architekturänderung
- nächster Nutzerentscheidungs-/Fachübergabepunkt dokumentiert

Historische Zwischenstandsnotizen weiter unten dokumentieren jeweils den damaligen Stand. Der aktuelle Stand ist unter „A01-Koordinierungsstand nach CP-0155 und Gesamtvalidierung (CP-0156)“ zusammengefasst.

Ergebnisdokument: [P0-Koordinierung offener Fachparameter](p0-offene-parameter-koordinierung.md); Checkpoint [CP-0032](checkpoints/CP-0032.md).

### Historischer Koordinierungsstand (CP-0149)

A03 hat die Finanzunterlagen gegen den Decision Log abgeglichen; siehe [CP-0148](checkpoints/CP-0148.md) und [Abgleichbericht](../accounting/a03-decision-log-abgleich-bericht.md). T-0009 war zu diesem historischen Stand PENDING; A02 hat die Arbeit später ausgeführt und CP-0150 erstellt. A04s CP-0151 lag ebenfalls noch nicht vor.

### Historischer Koordinierungsstand nach A02-/A04-Abgleich (CP-0152; fortgeschrieben durch CP-0153 bis CP-0155)

A02 hat D-0011 übernommen und T-0009 mit CP-0150 abgeschlossen. A04 hat den Datenmodellabgleich in CP-0151 abgeschlossen; A03s Finanzabgleich ist in CP-0148 dokumentiert. T-0008 bleibt IN_PROGRESS und koordiniert die verbleibenden A02/A03-Ereignis- und Periodenabstimmungen. Die Gesamtvalidierung ist noch nicht bestanden: Die A02-Spezifikation enthält im Startprofil weiterhin 40.000 € CNC-Buchwert (D-0099/CP-0148: 0 €) und 3,20 €/kg Stahl (D-0091: Wert aus bereitgestelltem Vorjahresschluss; 3,20 € nicht bestätigt). A02 muss diese alten Angaben aktualisieren oder klar als historische/unbestätigte Vorschläge kennzeichnen. Kein Sicherungs-Commit/Push bis dahin. Nachweise: [CP-0148](checkpoints/CP-0148.md), [CP-0150](checkpoints/CP-0150.md), [CP-0151](checkpoints/CP-0151.md), [CP-0152](checkpoints/CP-0152.md).

### A01-Koordinierungsstand nach CP-0155 und Gesamtvalidierung (CP-0156)

A02 hat D-0011 unter T-0009 übernommen; T-0009 ist abgeschlossen (CP-0150). Die aktiven Startprofilangaben wurden gemäß D-0091/D-0099 korrigiert (CP-0153). A03 bestätigt den Gesamtvorratswert von 12.800 €, aber keine bestätigten Einzelgruppenwerte; ein Stahlwert wird nicht als Differenz hergeleitet (CP-0154). A04 hat den Datenmodellabgleich abgeschlossen (CP-0151). A02/A03 haben bestätigte Finanz-/Simulationsregeln und verbleibende Ereignis-/Periodenlücken abgeglichen (CP-0155).

T-0008 bleibt IN_PROGRESS; T-0009 ist COMPLETED. Die Dokumentationsvalidierung ist mit CP-0156 bestanden. Offen bleiben die Nutzerfrage zur Verfügbarkeit gleichentägiger Kundeneingänge vor eigenen Zahlungsversuchen bei knappem Cash, technische Ereignis-/Periodendetails, Darlehensrate und erster tatsächlicher Zahlungstermin sowie die Übergabe belegter Vorratswerte. Die Nutzerfrage bleibt bis nach der Sicherung zurückgestellt. Gesamtvalidierung der aktiven Dokumente bestanden; Sicherungs-Checkpoint: CP-0156. Nachweise: CP-0148 bis CP-0156.

Zwischenstand 2026-10-25: A03 hat die Finanzparameter entscheidungsreif aufbereitet; [A03-Entscheidungsvorlage](../accounting/a03-p0-finanzparameter-entscheidungsvorlage.md), [Änderungsbericht](../accounting/a03-p0-finanzparameter-aenderungsbericht.md) und [CP-0035](checkpoints/CP-0035.md). Kein separates A03-Ticket angelegt. A02-Abstimmung zu Fälligkeit/Ereignisbezug bleibt nach T-0009 und Nutzerantworten offen. Koordinationsnachweis: [CP-0037](checkpoints/CP-0037.md).

Nutzerentscheidung D-0013: Für Kundenforderungen gilt der spätere Zeitpunkt aus Rechnung und tatsächlicher Leistung als Fristanker; bei Leistung ausschließlich durch Lieferung gilt das Lieferdatum. Lieferanten-Fristanker und Zähltage sind davon nicht entschieden. Nutzerfragen werden einzeln gestellt. Nachweis: [CP-0038](checkpoints/CP-0038.md).

Nutzerentscheidung D-0014: Für V1-Lieferantenverbindlichkeiten gilt bei pünktlicher Lieferung das Rechnungsdatum als Fristanker; spätere Vertragsausgestaltungen dürfen gemäß jeweiliger Vereinbarung einen anderen Anker, etwa Wareneingang, nutzen. Zähltage und 14-/30-Tage-Wahl bleiben offen. Nachweis: [CP-0039](checkpoints/CP-0039.md).

Nutzerentscheidung D-0015: Zahlungsziele für Kundenforderungen zählen in V1 Kalendertage; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Ankertagszählung sowie die Zählweise für Lieferantenverbindlichkeiten bleiben offen. Nachweis: [CP-0040](checkpoints/CP-0040.md).

Nutzerentscheidung D-0016: Zahlungsziele für Lieferantenverbindlichkeiten zählen in V1 ebenfalls Kalendertage; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Die Ankertagszählung bleibt offen. Nachweis: [CP-0041](checkpoints/CP-0041.md).

Nutzerentscheidung D-0017: Bei Kundenforderungen und Lieferantenverbindlichkeiten zählt der jeweilige Ankertag als Tag 1; damit gilt vor Wochenendverschiebung Ankerdatum + (N−1) Kalendertage. Nachweis: [CP-0042](checkpoints/CP-0042.md).

Nutzerentscheidung D-0018: Für Kundenforderungen gilt in V1 gemäß AGB ein Zahlungsziel von 14 Kalendertagen. Einzelvereinbarungen sind möglich und können bei kundenspezifischen Sonderwünschen eine höhere Marge ermöglichen; konkrete abweichende Frist und Margenformel bleiben offen. Nachweis: [CP-0043](checkpoints/CP-0043.md). Die nächste Rückfrage klärt, ob 30 Kalendertage die vorgesehene konkrete V1-Alternative für Einzelvereinbarungen sind.

Nutzerentscheidung D-0019: Die konkrete V1-Alternative bei individueller Kundenvereinbarung beträgt 30 Kalendertage; die Margenformel bleibt offen. Nachweis: [CP-0044](checkpoints/CP-0044.md).

Nutzerentscheidung D-0020: Für Lieferantenverbindlichkeiten gelten standardmäßig 30 Kalendertage; Abweichungen sind in Ereignissen oder Dauerverträgen möglich. Konkrete Sonderkonditionen bleiben offen. Nachweis: [CP-0045](checkpoints/CP-0045.md).

Nutzerentscheidung D-0021: Der Spieler wählt, welche fälligen eigenen Rechnungen zuerst bezahlt werden; die Nutzung eines Dispositionskredits wird als weitere Option angeboten, mit einem Zinssatz 8 Basispunkte über dem durchschnittlichen Zinssatz. Bezugsgröße des Durchschnittszinses sowie Kreditregeln, Maximalverschuldung und Insolvenz sind offen und separat zu prüfen. Nachweis: [CP-0046](checkpoints/CP-0046.md).

Nutzerentscheidung D-0022/D-0023: Der Bankzinssatz wird zu Spielbeginn und jährlich individuell auf Basis EZB-Zinssatz plus Unternehmensaufschlag anhand Eigenkapitalquote, Bilanzsumme und Zahlungsmoral vereinbart. Mittelwert: EZB +3 Prozentpunkte; Spanne: +0,5 bis +5,5 Prozentpunkte. Der Dispositionskreditzins liegt 8 % über diesem individuell vereinbarten Zinssatz. EZB-Referenzsatz und Bewertungsformel bleiben offen; Kreditregeln/Maximalverschuldung/Insolvenz sind separat zu prüfen. Nachweis: [CP-0047](checkpoints/CP-0047.md).

Nutzerentscheidung D-0024: Nach fehlgeschlagenem Zahlversuch einer eigenen Verbindlichkeit erfolgt der nächste Versuch nach einer Woche. Anzahl/Ende und genauer Bezugspunkt der Wochenfrist bleiben offen. Nachweis: [CP-0048](checkpoints/CP-0048.md).

Nutzerentscheidung D-0025: Nach achtmaligem Scheitern gilt das Spiel als verloren. Noch offen ist, ob der erste fehlgeschlagene Fälligkeitsversuch bereits mitzählt. Nachweis: [CP-0049](checkpoints/CP-0049.md).

Nutzerklarstellung D-0026: Gemeint sind acht Wiederholungsversuche nach dem ersten fehlgeschlagenen Fälligkeitsversuch. Nach dem achten fehlgeschlagenen Retry ist das Spiel verloren. Nachweis: [CP-0050](checkpoints/CP-0050.md).

Nutzerentscheidung D-0027: Die erste Zahlungserinnerung wird zehn Kalendertage nach dem ersten fehlgeschlagenen Zahlversuch ausgelöst. Weitere Mahnstufen bleiben offen. Nachweis: [CP-0051](checkpoints/CP-0051.md).

Nutzerentscheidung D-0028: Die formelle Mahnung wird 14 Kalendertage nach der Zahlungserinnerung ausgelöst. Dies ist eine V1-Spielregel, keine gesetzlich vorgeschriebene Frist nach § 286 BGB. Nachweis: [CP-0052](checkpoints/CP-0052.md).

Nutzerentscheidung D-0029: Nach der formellen Mahnung erfolgt in V1 keine weitere Eskalation bis Pfändung oder Liquidation; solche Ereignisse sind für spätere Versionen vorgesehen. Nachweis: [CP-0053](checkpoints/CP-0053.md).

Nutzerentscheidung D-0030: Das Maschinendarlehen ist ein gleichbleibendes Annuitätendarlehen. Restlaufzeit, Rate, Zahlungstermine, Tilgungsbeginn und Zinsberechnung bleiben offen. Nachweis: [CP-0054](checkpoints/CP-0054.md).

Nutzerentscheidung D-0031: Zum Simulationsstart am 01.01.2027 beträgt die Restlaufzeit des Annuitätendarlehens sieben Jahre. Ratenfrequenz und konkrete Zahlungstermine bleiben offen. Nachweis: [CP-0055](checkpoints/CP-0055.md).

Nutzerentscheidung D-0032: Die Annuität wird monatlich gezahlt. Erste Rate, monatlicher Zahlungstag und Annuitätenhöhe bleiben offen. Nachweis: [CP-0056](checkpoints/CP-0056.md).

Nutzerentscheidung D-0033: Die Monatsrate ist am letzten Geschäftstag des Monats fällig. Gemäß D-0011 ist für Januar 2027 der erste Termin Freitag, 29.01.2027; Feiertage bleiben unberücksichtigt. Annuitätenhöhe und Zinsberechnung bleiben offen. Nachweis: [CP-0057](checkpoints/CP-0057.md).

Nutzerentscheidung D-0034: Der Darlehenszins wird nach 30/360 zeitanteilig berechnet. Konkrete Monatsend-Variante und Bezugsbasis innerhalb der Zinsperiode bleiben offen. Nachweis: [CP-0058](checkpoints/CP-0058.md).

Nutzerentscheidung D-0035: Es gilt die deutsche Zinsmethode 30E/360; damit ist die konkrete Monatsend-Variante festgelegt. Die Zinsbezugsbasis innerhalb der Periode bleibt offen. Nachweis: [CP-0059](checkpoints/CP-0059.md).

Nutzerentscheidung D-0036: Verzinst wird das Restschuldsaldo. Die Rundungsregel für monatliche Zinsbeträge bleibt offen. Nachweis: [CP-0060](checkpoints/CP-0060.md).

Nutzerentscheidung D-0037: Monatliche Darlehenszinsen werden kaufmännisch auf Cent gerundet. Nachweis: [CP-0061](checkpoints/CP-0061.md).

Nutzerentscheidung D-0038: Ein aus der kaufmännischen Cent-Rundung verbleibender Darlehensrest wird in der letzten Rate bezahlt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0062](checkpoints/CP-0062.md).

Nutzerentscheidung D-0039: Der nominale Darlehenszinssatz von 5 % p.a. gilt während der siebenjährigen Restlaufzeit fest. Nachweis: [CP-0063](checkpoints/CP-0063.md).

Nutzerentscheidung D-0040: Darlehenszinsen werden zusammen mit der monatlichen Annuitätenrate gezahlt. Der Stichtag für das maßgebliche Restschuldsaldo bleibt offen. Nachweis: [CP-0064](checkpoints/CP-0064.md).

Nutzerentscheidung D-0041: Für die Zinsperiode gilt der Kalendertag vor der nächsten Rate als Stichtag des maßgeblichen Restschuldsaldos. Nachweis: [CP-0065](checkpoints/CP-0065.md).

Nutzerentscheidung D-0042: Nichtzahlung einer Maschinenrate führt sofort zu Verzug und wöchentlichen Wiederholungsversuchen. Bei insgesamt drei nicht gezahlten Raten wird die Maschine gepfändet und zum aktuellen Marktwert liquidiert; Erlös tilgt das Darlehen, Überschuss wird dem Geschäftskonto gutgeschrieben. Folgen eines Erlösdefizits bleiben offen. Nachweis: [CP-0066](checkpoints/CP-0066.md).

Nutzerentscheidung D-0043: Eine nach der Maschinenverwertung verbleibende Restschuld erlischt, da die Maschine als Pfand für den Kredit akzeptiert wurde. Nachweis: [CP-0067](checkpoints/CP-0067.md).

Nutzerentscheidung D-0044: V1 soll relevante Ressourcen und Produkte in einem Hintergrund-Wirtschaftssystem tracken. Marktpreise werden als statische Zahlen mit linearer jährlicher Preissteigerung von 2 % modelliert; Maschinen und andere Güter verlieren gemäß fester Nutzungsdauer anteilig an Wert. Maschinenmarktwert bei Verwertung: jährlich um 2 % angepasster Neupreis abzüglich des Wertverlusts aus laufender Nutzung. Konkrete Formel, Basispreise und Nutzungsdauern bleiben offen. Nachweis: [CP-0068](checkpoints/CP-0068.md).

Nutzerentscheidung D-0045: Die geplante Gesamtnutzungsdauer der vorhandenen, bei Simulationsstart acht Jahre alten CNC-Fräsmaschine beträgt 16 Jahre. Damit verbleiben rechnerisch acht Jahre. Der Eröffnungsbuchwert von 40.000 € bleibt unberührt; genaue Marktwert- und Abschreibungsberechnung bleibt offen. Nachweis: [CP-0069](checkpoints/CP-0069.md).

Nutzerentscheidung D-0046: Der ursprüngliche Anschaffungswert von 120.000 € gilt als statischer V1-Basispreis der CNC für die lineare jährliche Preissteigerung von 2 %. Die konkrete Verrechnung mit dem Wertverlust nach Nutzungsdauer bleibt offen. Nachweis: [CP-0070](checkpoints/CP-0070.md).

Nutzerentscheidung D-0047: Der inflationsangepasste CNC-Neupreis beträgt `120.000 € × 1,02^(aktuelles Jahr − Startjahr)`. Die Abwertung aufgrund bisheriger Nutzung bleibt offen. Nachweis: [CP-0071](checkpoints/CP-0071.md).

Nutzerentscheidung D-0048: Zum Simulationsstart wird wegen acht bereits genutzter Jahre bei 16 Jahren Gesamtnutzungsdauer ein Nutzungswertverlust von 50 % angesetzt; der Marktwertansatz beträgt damit 50 % des inflationsangepassten Neupreises. Die Fortschreibung nach Simulationsstart bleibt offen. Nachweis: [CP-0072](checkpoints/CP-0072.md).

Nutzerentscheidung D-0049: Der Restwertfaktor lautet `(maximale Nutzungsdauer − genutzte Dauer) / maximale Nutzungsdauer` und wird mit dem Anschaffungswert multipliziert. Offen: welcher Anschaffungswert als Multiplikator gilt und ob eine Untergrenze bei Überschreiten der maximalen Nutzungsdauer gilt. Nachweis: [CP-0073](checkpoints/CP-0073.md).

Nutzerentscheidung D-0050: Der Restwertfaktor wird immer auf Grundlage des Anschaffungspreises angewendet. Offen bleibt, ob und wie die jährliche Preisfortschreibung zusätzlich in den Verwertungsmarktwert einfließt. Nachweis: [CP-0074](checkpoints/CP-0074.md).

Nutzerentscheidung D-0051: Der CNC-Restwert berechnet sich ausschließlich aus dem ursprünglichen Anschaffungspreis von 120.000 € mal Restwertfaktor; die jährliche Preisfortschreibung fließt nicht ein. Untergrenze bei Überschreiten der maximalen Nutzungsdauer bleibt offen. Nachweis: [CP-0075](checkpoints/CP-0075.md).

Nutzerentscheidung D-0052: Der Restwert wird bei 0 € begrenzt; ein negativer rechnerischer Wert bei Erreichen/Überschreiten der maximalen Nutzungsdauer wird auf 0 € gesetzt. Nachweis: [CP-0076](checkpoints/CP-0076.md).

Nutzerentscheidung D-0053: SimTAX-Bemessungsbasis je Rechnungsposition ist der bestätigte Positionswert vor SimTAX. Rundungsdetails bei exakt halbem Cent und Anwendungsbereich bleiben offen. Nachweis: [CP-0077](checkpoints/CP-0077.md).

Nutzerentscheidung D-0054: SimTAX-Beträge werden bei exakt halben Centbeträgen kaufmännisch gerundet, weiterhin je Rechnungsposition und danach summiert. Nachweis: [CP-0078](checkpoints/CP-0078.md).

Nutzerentscheidung D-0055: SimTAX wird je Rechnungsposition auf den Positionsgesamtbetrag angewendet und kaufmännisch gerundet; keine Berechnung je einzelner Einheit. Nachweis: [CP-0079](checkpoints/CP-0079.md).

Nutzerentscheidung D-0056: SimTAX gilt bei jeder externen Rechnungsstellung. Steuerzahlungen und innerbetriebliche Ausgleiche sind ausgenommen; eingehende externe Rechnungen werden dadurch nicht automatisch klassifiziert. Nachweis: [CP-0080](checkpoints/CP-0080.md).

Nutzerentscheidung D-0057: Bei Rechnungskorrekturen wird der ursprüngliche gerundete SimTAX-Betrag referenziert umgekehrt und die Korrektur separat ausgewiesen. Nachweis: [CP-0081](checkpoints/CP-0081.md).

Nutzerentscheidung D-0058: SimTAX erhält eine getrennte Rechnungskomponente und eigene Simulationssaldo-Sicht zum Gegenrechnen von Vorsteuer/Umsatzsteuer; Zahlung gemäß Grundsätzen von UStG und AO. Abrechnungszeitraum und Zahlungsmechanik bleiben offen. Nachweis: [CP-0082](checkpoints/CP-0082.md).

Nutzerentscheidung D-0059: Der SimTAX-Abrechnungszeitraum richtet sich nach dem UStG; konkrete Eingangsparameter zur Periodenbestimmung und Zahlungsmechanik sind noch offen. Nachweis: [CP-0083](checkpoints/CP-0083.md).

Nutzerszenariowert D-0060: Für 2026 wird fiktiv ein Umsatz von 5.000 € pro Woche angenommen. Dieser Wert wird nicht zur Ableitung des für die Periodenwahl maßgeblichen Steuerbetrags verwendet. Nachweis: [CP-0084](checkpoints/CP-0084.md).

Nutzerszenariowert D-0061: Für 2026 wird ein fiktiver maßgeblicher Umsatzsteuerbetrag von 49.400 € als Vorjahresparameter für die SimTAX-Periodenbestimmung gemäß UStG angesetzt; der Betrag wird nicht aus D-0060 abgeleitet. Die konkrete Zahlungsmechanik bleibt offen. Nachweis: [CP-0085](checkpoints/CP-0085.md).

Nutzerentscheidung D-0062: Der MGK-Zuschlag im V1-BAB beträgt 15 % der MEK; übernommen aus dem A03-Arbeitsvorschlag. Weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0086](checkpoints/CP-0086.md).

Nutzerentscheidung D-0063: Der FGK-Zuschlag im V1-BAB beträgt 100 % der Fertigungslöhne; übernommen aus dem A03-Arbeitsvorschlag. Weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0087](checkpoints/CP-0087.md).

Nutzerentscheidung D-0064: Der Vw/Vt-GK-Zuschlag im V1-BAB beträgt 10 % der Herstellkosten; übernommen aus dem A03-Arbeitsvorschlag. Weitere Zuordnungen und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0088](checkpoints/CP-0088.md).

Nutzerentscheidung D-0065: Die monatliche Bruttolohnsumme des Personals im V1-Startprofil beträgt insgesamt 10.400 €. Rollenaufteilung, Arbeitgebergesamtkosten und FGK-Bemessungsbasis bleiben offen. Nachweis: [CP-0089](checkpoints/CP-0089.md).

Nutzerentscheidung D-0066: Fertigungslöhne für den 100-%-FGK-Zuschlag sind MA-CNC (3.800 €) plus MA-PROD (3.100 €), zusammen 6.900 € monatlich; MA-AV zählt nicht dazu. Arbeitgebergesamtkosten bleiben offen. Nachweis: [CP-0090](checkpoints/CP-0090.md).

Nutzerentscheidung D-0067: Arbeitgebergesamtkosten werden zusätzlich zu den Bruttolöhnen im V1-Personalaufwand berücksichtigt; Betrag und Berechnungsregel bleiben offen. Nachweis: [CP-0091](checkpoints/CP-0091.md).

Nutzerentscheidung D-0068: Arbeitgebergesamtkosten werden mit 21 % der monatlichen Bruttolohnsumme von 10.400 € angesetzt (2.184 € zusätzlich; 12.584 € Personalaufwand insgesamt pro Monat). Nachweis: [CP-0092](checkpoints/CP-0092.md).

Nutzerentscheidung D-0069: Die Arbeitgeberkosten von 21 % auf MA-CNC/MA-PROD zählen zur FGK-Basis; diese beträgt 8.349 € monatlich und ergibt bei 100 % Zuschlag 8.349 € FGK. MA-AV bleibt ausgeschlossen. Nachweis: [CP-0093](checkpoints/CP-0093.md).

Nutzerentscheidung D-0070: MA-AV-Personalaufwand von 4.235 € pro Monat inklusive 21 % Arbeitgeberkosten gehört in den Vw/Vt-GK-Pool und wird nicht separat daneben angesetzt; der 10-%-Zuschlag auf HK bleibt bestehen. Nachweis: [CP-0094](checkpoints/CP-0094.md).

Nutzerentscheidung D-0071: CNC-Abschreibung wird in V1 als FGK im BAB berücksichtigt. Abschreibungsbasis, Methode, Zeitraum und Betrag sind noch offen; die Restwert-/Verwertungsregel ist dafür kein automatischer Ersatz. Nachweis: [CP-0095](checkpoints/CP-0095.md).

Nutzerentscheidung D-0072: Die CNC-BAB-Kalkulation soll Wiederbeschaffungskosten einschließlich 2-%-Inflation im maßgeblichen Betrachtungszeitraum berücksichtigen; Zeitraum und Umlegung bleiben offen. Nachweis: [CP-0096](checkpoints/CP-0096.md).

Nutzerentscheidung D-0073: Für den Inflationszeitraum wird die gesamte CNC-Nutzungsdauer von 16 Jahren angesetzt; die acht verbleibenden Jahre sind nicht maßgeblich. Preisbezugsformel: 120.000 € × 1,02^16. Umlegung auf BAB-Periodenkosten und konkrete Buchabschreibung bleiben offen. Nachweis: [CP-0097](checkpoints/CP-0097.md).

Nutzerentscheidung D-0074: Der inflationsangepasste CNC-Wiederbeschaffungswert wird gleichmäßig auf einen Monat der 16-jährigen Gesamtnutzungsdauer verteilt (192 Monate). Monatlicher BAB-Bezugsbetrag: `(120.000 € × 1,02^16) / 192`. Rundung des Monatsbetrags und vollständige Buchabschreibungsbehandlung bleiben offen. Nachweis: [CP-0098](checkpoints/CP-0098.md).

Nutzerentscheidung D-0075: Der monatliche CNC-BAB-Bezugsbetrag wird für die Kalkulation immer aufgerundet. Rundungsgenauigkeit/Einheit und vollständige Buchabschreibungsbehandlung bleiben offen. Nachweis: [CP-0099](checkpoints/CP-0099.md).

Nutzerentscheidung D-0076: Der monatliche CNC-BAB-Bezugsbetrag wird stets auf den nächsten vollen Euro aufgerundet. Bilanzielle Buchabschreibungsbehandlung bleibt davon getrennt offen. Nachweis: [CP-0100](checkpoints/CP-0100.md).

Nutzerentscheidung D-0077: V1 führt zusätzlich zur kalkulatorischen BAB-Kostenbasis eine separate bilanzielle Buchabschreibung der CNC. Methode, Berechnungsbasis, Beginn, Restlaufzeit, Restwert und Betrag sind offen. Nachweis: [CP-0101](checkpoints/CP-0101.md).

Nutzerentscheidung D-0078: Laufende Anschaffungen werden linear nach der AfA-Tabelle des Bundesfinanzministeriums abgeschrieben; die Abschreibungsmethode für Neuanschaffungen wird einmal jährlich festgelegt. AfA-Tabellenposition/Nutzungsdauer der bestehenden CNC und konkrete Abschreibungsparameter bleiben offen. Nachweis: [CP-0102](checkpoints/CP-0102.md).

Nutzerentscheidung D-0079: Die jährliche Festlegung der Abschreibungsmethode für Neuanschaffungen ist eine Spielerentscheidung. Welche Methoden auswählbar sind, bleibt offen. Nachweis: [CP-0103](checkpoints/CP-0103.md).

Nutzerkorrektur D-0080: Die Methodenabfrage erfolgt einmal zu Spielbeginn. Danach kann der Spieler die Methode in einem Menü für zukünftige Neuanschaffungen ändern. Angeboten werden lineare AfA, degressive AfA sowie GWG-Sofortabzug und GWG-Sammelposten unter Berücksichtigung der Grenzen. Die Auswahlregel im GWG-Überschneidungsbereich und die zeitliche Zulässigkeit der degressiven AfA bleiben offen. Nachweis: [CP-0104](checkpoints/CP-0104.md).

Nutzerentscheidung D-0081: Für GWG im Überschneidungsbereich über 250 € bis einschließlich 800 € wird einheitlich je Wirtschaftsjahr zwischen Sofortabzug und Sammelposten entschieden; keine unterschiedliche Wahl je Anschaffung innerhalb desselben Jahres. Nachweis: [CP-0105](checkpoints/CP-0105.md).

Nutzerentscheidung D-0082: Eine im Menü geänderte GWG-Methode wird ab dem nächsten Wirtschaftsjahr wirksam. Nachweis: [CP-0106](checkpoints/CP-0106.md).

Nutzerentscheidung D-0083: Die degressive AfA bleibt auch nach dem derzeit dokumentierten gesetzlichen Zeitraum als vereinfachte Spielregel im Spiel verfügbar. Daraus wird keine steuerrechtliche Zulässigkeit für diesen Zeitraum abgeleitet. Nachweis: [CP-0107](checkpoints/CP-0107.md).

Nutzerentscheidung D-0084: Der degressive AfA-Satz ist der niedrigere Wert aus 30 % und dem Dreifachen des linearen AfA-Satzes; angewendet wird er auf den jeweiligen Restbuchwert. Für spätere Spieljahre gilt dies gemäß D-0083 als vereinfachte Spielregel. Nachweis: [CP-0108](checkpoints/CP-0108.md).

Nutzerentscheidung D-0085: Für die separate lineare bilanzielle Buchabschreibung der bestehenden CNC ist die einschlägige Nutzungsdauer laut BMF-AfA-Tabelle maßgeblich; konkrete Tabellenposition und Restdauer bleiben offen. Nachweis: [CP-0109](checkpoints/CP-0109.md).

Nutzerentscheidung D-0086: Die Bemessungsbasis der CNC-Buchabschreibung sind die ursprünglichen Anschaffungskosten von 120.000 € abzüglich bereits erfolgter AfA; der Eröffnungsbuchwert bleibt 40.000 €. AfA-Verlauf und Restdauer sind fachlich abzugleichen. Nachweis: [CP-0110](checkpoints/CP-0110.md).

Nutzerentscheidung D-0087: Für AfA-Gegenstände im Startbestand ist der Abschreibungstermin der erste Arbeitstag des zweiten Quartals; Neuanschaffungen folgen den jeweils geltenden gesetzlichen Vorgaben. Nachweis: [CP-0111](checkpoints/CP-0111.md).

Nutzerentscheidung D-0088: Am Termin im ersten Arbeitstag des zweiten Quartals wird für die AfA-Gegenstände des Startbestands die AfA des laufenden Wirtschaftsjahrs erfasst. Nachweis: [CP-0112](checkpoints/CP-0112.md).

Abgleich abgeschlossen: Der Nutzer hat den CNC-Anschaffungszeitpunkt auf 01.01.2019 festgelegt. Damit beträgt die Nutzungszeit am Simulationsstart 01.01.2027 genau acht Jahre; D-0045/D-0048 bleiben konsistent. Nachweis: [D-0089](decision-log.md#d-0089--cnc-anschaffungsdatum-auf-01012019-angepasst), [CP-0114](checkpoints/CP-0114.md).

Zwischenstand 2026-10-25: Der Nutzer hat den V1-Arbeitskalender gemäß D-0011 bestätigt. A02-Übernahme in die Simulationsspezifikation und Abstimmung der offenen 14-/30-Tage-Fälligkeit mit A03 stehen noch aus; T-0008 bleibt IN_PROGRESS. Nachweis: [CP-0033](checkpoints/CP-0033.md).

---

### T-0001 – Agent Control Plane implementieren

Status: IN_PROGRESS
Master Goal: MG-000
Second-Level Goal: SLG-000.1
Owner: A10 DEVOPS_INFRASTRUCTURE
Priorität: HIGH

Aufgabe:

AGENTS.md und die strukturierte Agenten-Control-Plane mit Agentenstruktur, Goals, Tickets, Collaboration State, Decision Log, Preflight und Checkpoint-Regeln etablieren.

Akzeptanzkriterien:

- Preflight verbindlich dokumentiert
- A01–A11 definiert
- aktuelle Goals definiert
- Ticketfilter definiert
- abgeschlossene Second-Level Goals aus aktivem Kontext ausgeschlossen
- Checkpoint-Regel dokumentiert
- Kommunikationsformat dokumentiert
- keine Anwendungscodeänderung
- keine Supabaseänderung
- keine Dependencyänderung

---

## Abgeschlossene Tickets

### T-0009 – D-0011-Arbeitskalender in A02-Spezifikation übernehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION
Abschlussnachweis: A02-Änderungsbericht und [CP-0150](checkpoints/CP-0150.md).

A02 hat D-0011 in die Simulationsspezifikation übernommen: Montag bis Freitag mit 8 Stunden Tageskapazität für Beschäftigte und CNC, Wochenenden arbeitsfrei, Feiertage in V1 unberücksichtigt, Wochenendtermine am nächsten Arbeitstag und F3 mit fünf Arbeitstagen ab Folgetag nach vollständiger Lieferung. Der aktuelle A02/A03-Ereignis- und Periodenabgleich bleibt als Koordinierungsarbeit unter T-0008 offen; er ändert die bestätigten Vertragsfristregeln D-0013 bis D-0020 nicht. Keine Implementierungs-, Schema- oder Architekturfreigabe.

---

### T-0006 – Maschinenbau-MVP: fachliches und technisches Datenmodell konkretisieren

Status: COMPLETED – A09 QA BESTANDEN (CP-0013)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A04 DATABASE
Priorität: HIGH

Aufgabe und Mindestumfang gemäß D-0010, A02-Simulationsspezifikation und A03-Finanzspezifikation: fachliches/logisches Datenmodell mit vollständiger operativer V1-Abwicklung, differenzierten Finanzbeträgen, statischem/vereinfachtem BAB, festgelegtem Startprofil, offenen Fachentscheidungen und Erweiterungspfaden.

Abschlussnachweis: [Datenmodell](../database/maschinenbau-mvp-datenmodell.md), [CP-0010](checkpoints/CP-0010.md), QA-Erstreview [CP-0011](checkpoints/CP-0011.md), A04-Nachbesserung [CP-0012](checkpoints/CP-0012.md), bestandenes QA-Rereview [CP-0013](checkpoints/CP-0013.md) und finale P0-Gesamtsicherung [CP-0031](checkpoints/CP-0031.md). Die dokumentarische MINOR-Abweichung wurde durch T-0007 bereinigt. Offene Fachparameter bleiben ausdrücklich offen; QA und P0-Validierung sind keine Implementierungs- oder Architekturfreigabe.

---

### T-0005 – Maschinenbau-MVP: Accounting-Wirkungen spezifizieren

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A03 ACCOUNTING_FINANCE
Priorität: HIGH

Aufgabe:

Auf Grundlage der A02-Spezifikation die finanziellen Wirkungen und minimalen Accounting-Übergaben für den Maschinenbau-MVP fachlich spezifizieren. T-0005 ist Analyse-/Spezifikationsarbeit, keine Implementierung.

Akzeptanzkriterien:

- finanzielle Wirkungen für Angebot/Auftrag, Beschaffung/Eingang, Ressourcenverbrauch, Lieferung, Rechnungen, Zahlungen, laufende Kosten und Auftragsergebnis beschrieben
- Zeitpunkt/Bedingungen von Forderungen, Verbindlichkeiten, Umsatz, Kosten und Liquiditätswirkung benannt oder als offen markiert
- MVP-relevante Netto-/Brutto-/Umsatzsteuer-, Materialbewertungs- und Fälligkeitsfragen ausgewiesen, ohne unbelegte Rechts-/Steuerannahmen
- minimale Übergaben von Simulation an Accounting und autoritative Finanzsichten beschrieben
- offene Nutzerentscheidungen und Abhängigkeiten zu A02/A11 kenntlich gemacht
- keine Buchungen, Anwendungscode-, Schema-, Supabase- oder Dependencyänderung
- keine Architekturfreigabe und keine Änderung an D-IDs/ADR-Status

Abschlussnachweis: fachliche Spezifikation [maschinenbau-mvp-finanzspezifikation.md](../accounting/maschinenbau-mvp-finanzspezifikation.md) und Checkpoint [CP-0008](checkpoints/CP-0008.md). Offene Nutzerentscheidungen blockieren die Spezifikation nicht, aber verbindliche Detailregeln und Datenmodellableitung.

---

### T-0002 – Architektur V0.2 als Arbeitsgrundlage sichern

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

A11-Architekturentwurf dauerhaft als vorgeschlagenen Arbeitsstand sichern.

Akzeptanzkriterien:

- Kernarchitektur dokumentiert
- 8 ADR-Entwürfe dokumentiert
- offene Architekturentscheidungen erhalten
- nichts als freigegeben dargestellt
- OpenTycoonOS bleibt zunächst Referenz

Abschlussgrund: Neun Architekturartefakte erstellt, A09-QA bestanden und Commit/Push auf `main` erfolgreich. Abschlussnachweis: Checkpoint [CP-0006](checkpoints/CP-0006.md).

---

### T-0003 – Repository-Bestand read-only aufnehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.3
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

Tatsächlichen Repository-Zustand gegen den Architekturentwurf prüfen.

Abschlussnachweis: [Checkpoint CP-0002](checkpoints/CP-0002.md).

---

### T-0004 – Maschinenbau-MVP: A02-Spezifikation und Gap-Analyse aufnehmen

Status: COMPLETED (nachträglich dokumentiert)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION

Aufgabe:

Die read-only fachliche Spezifikation und Gap-Analyse des Maschinenbau-MVP erstellen. Während der A02-Arbeit war dafür kein aktives Ticket eingetragen; dieses Ticket dokumentiert die bereits abgeschlossene Arbeit rückblickend und weist sie dem aktiven SLG-000.2 zu.

Abschlussgrund: A02-Arbeitsergebnis durch A01 geprüft und unverändert im Repository gesichert. Keine Code-, Datenbank-, Dependency- oder Architekturänderung. Abschlussnachweis: [Checkpoint CP-0007](checkpoints/CP-0007.md) und [A02-Bericht](../simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md).

---

### T-0007 – D-0010-Scope in A02-/A03-Spezifikationen angleichen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION / A03 ACCOUNTING_FINANCE

Aufgabe:

Die dokumentarische MINOR-Abweichung aus CP-0013 in den Fachspezifikationen von A02 und A03 bereinigen. D-0010 bleibt maßgeblich und unverändert; Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind aus V1 ausgeschlossen. Keine Erweiterung des MVP und keine neuen Fachregeln.

Abschlussgrund: A02 und A03 haben ihre jeweiligen Scope-Texte an D-0010 angeglichen. Konkrete Zahlungs-/Finanzregeln bleiben offen. Nachweis: [CP-0014](checkpoints/CP-0014.md).
