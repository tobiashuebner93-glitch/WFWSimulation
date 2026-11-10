# V3 – Auftrags- und Produktentwicklung auf Managementebene

**Status:** Fachauftrag operationalisiert; Implementierung nicht begonnen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Ticket:** T-0112
**Goal:** MG-002 / SLG-002.2
**Bezug:** T-0065, T-0066, T-0067, T-0111; V3-06, V3-17, V3-18; D-0161/D-0162

## Nutzerziel

Auftragsvergabe, Auftragsannahme, Planung und Produktentwicklung sollen ohne Programmier- oder Fertigungsplanungswissen spielbar sein. Technische Detaildaten bleiben systemseitig. Der Spieler führt den Betrieb über Ziele, Angebote, Freigaben, Engpässe und Ergebnisse.

## Auftrag und Vertrag

1. Ein Kundenangebot enthält mindestens Leistungsgegenstand, Stückzahl und Einheit, vereinbarte Leistungs-/Qualitäts- und Abnahmekriterien, Preis und Termin. Spieleraktionen verwenden verständliche Auswahl-/Formfelder; IDs, JSON, Personenzuordnung und Operationslisten werden abgeleitet.
2. Ein unverändert angenommenes Angebot schließt im Spiel den Vertrag. Abweichende Kundenannahmen gelten im Szenario als Gegenangebot und benötigen eine erneute Annahme durch den Spieler. Änderungswünsche des Spielers sind vor Annahme als überarbeiteter Angebotsstand an den Kunden zu senden; nach Vertragsschluss bleiben Preis, Menge und Leistungsscope fest. Spätere Änderungen laufen nur über einen separat vereinbarten Nachtrag.
3. Bei Annahme erzeugt das System aus vereinbartem Scope, erforderlichen Fähigkeiten, verfügbarer Ausstattung, Material, Personal, Kapazität und Vorgängerbeziehungen einen ausführbaren Arbeitsplan. Die Oberfläche zeigt eine Managementübersicht mit Fortschritt, voraussichtlichem Termin, Auslastung, Risiken und nötigen Entscheidungen. Technische Zuweisungen sind standardmäßig ausgeblendet; der Spieler kann bei Bedarf die entscheidungsrelevanten Details öffnen, ohne JSON eingeben zu müssen.
4. Liefer-/Abnahmehandlung bleibt der vertraglich zuständigen Empfänger-/Auftraggeberseite zugeordnet. Der Auftragnehmer bestätigt Lieferung/Leistung; er nimmt sein eigenes Werk nicht selbst ab.

## Produktentwicklung

1. Der Spieler beauftragt einen vorhandenen Mitarbeiter oder eine Abteilung mit einer Produktidee.
2. Der Spieler gibt managementtaugliche Zielvorgaben vor: Kundennutzen/Zielsegment, gewünschter Verkaufspreis oder Preisrahmen sowie Qualitätsziel.
3. Das Team erstellt ein Konzept mit verständlicher Beschreibung, Materialbedarf, voraussichtlicher Entwicklungs-/Fertigungsdauer, erreichbarer Qualität, nötigen Fähigkeiten/Ausstattung und Unsicherheiten. Der Spieler kann Ziele anpassen oder das Konzept freigeben/ablehnen.
4. Rezeptur, Prozessfolge, Mengenauflösung und technische Arbeitszuweisung werden durch das System aus Kompetenzen, Betriebsmitteln, Material und Kapazität abgeleitet. Die Darstellung bleibt auf Managementebene und lässt keinen Produktstart zu, wenn eine Pflichtvoraussetzung unerfüllt ist; die Oberfläche zeigt den Engpass und eine nächste Handlung.
5. Änderungen/Verbesserungen an bereits entwickelten Produkten sind Folgeumfang für V7 (Betriebliches Management / kontinuierliche Verbesserung), nicht T-0112/V3-Abschlussumfang.

## Messbares Minimalziel

- Ein Kundenauftrag kann mit verständlicher Angebotsform ohne technische IDs/JSON und mit Leistungsscope, Menge/Einheit, Preis und Termin angeboten werden.
- Unveränderte Annahme erzeugt genau einen Vertragssnapshot. Eine geänderte Annahme erzeugt keinen Vertrag und verlangt neue Zustimmung.
- Ein Spieler-Änderungswunsch vor Annahme erzeugt einen neuen Angebotsstand; nach Annahme werden Preis/Menge/Scope abgewiesen, bis beide Seiten einen Nachtrag annehmen.
- Der operative Arbeitsplan wird systemseitig erzeugt und gegen Ressourcen, Qualifikation, Kapazität und Reihenfolge validiert. UI zeigt einen Managementstatus; keine Pflicht zur manuellen Operationseingabe.
- Ein Produktkonzept lässt sich mit Mitarbeiter/Abteilung, Nutzen/Zielsegment, Zielpreis und Qualitätsziel starten. Ein verständlicher Vorschlag zeigt Material, Dauer, Qualitätsprognose und Engpässe. Technische Felder sind nicht erforderlich.
- Ein unabhängiges Review der BGB-Abgrenzung, Finanz-/Snapshot-Grenze und UI sowie Browserpfade bestehen. Keine Buchungswirkung entsteht allein durch ein Angebot, eine Konzeptfreigabe oder einen Arbeitsplan.

## Rechts- und Finanzabgrenzung

Der Spielvertrag folgt als vereinfachtes Modell dem Angebot und der unveränderten Annahme. [BGB § 145](https://www.gesetze-im-internet.de/bgb/__145.html) regelt die Bindung an einen Antrag; [§ 150 Abs. 2](https://www.gesetze-im-internet.de/bgb/__150.html) behandelt eine Annahme mit Änderungen als Ablehnung verbunden mit neuem Antrag. Die Art des Fertigungsvertrags wird nicht pauschal festgelegt: Kaufvertrag ([§ 433](https://www.gesetze-im-internet.de/bgb/__433.html)), Werkvertrag ([§ 631](https://www.gesetze-im-internet.de/bgb/__631.html)) und Werklieferungsvertrag ([§ 650](https://www.gesetze-im-internet.de/bgb/__650.html)) unterscheiden sich nach Gegenstand und vereinbarter Leistung. Der passende Vertragstyp und konkrete Rechtsfolgen sind vor V3-Release durch A08 anhand des aktuellen Rechtsstands nach D-0161 zu prüfen. Diese Kurzfassung ist kein Rechtsrat.

Das Angebot ist ein Vertrags-/Planstand und erzeugt für sich keine Rechnungs-, Cash-, Steuer- oder Ledgerbuchung. Finanzielle Behandlung und Periodisierung bleiben bei A03 nach D-0162. Die technischen Planfelder sind interne Betriebsdaten; ein späterer persistenter Datenschema-Umbau ist nicht Teil dieses Tickets.

## Rollen und Übergaben

- A02: abgeleiteter Auftragsplan und Konzept-/Kapazitätsmodell.
- A03: Preis-/Scope-/Snapshot-/Finanzgrenzen und Produktplan-Kalkulationsgrenze.
- A05: geführte Angebots-, Managementübersicht- und Konzept-UI.
- A08: aktuelle BGB-Quellen und Vertragstypabgrenzung.
- A09: unabhängige Gate-/Nichtmutations-/Manipulationsprüfung.
- A01: Integration, Ticketführung und CP; keine Fachfreigabe anstelle der genannten Rollen.

Alle Berichte und Rückfragen gehen an A01. Kein Schema-, Architektur-, produktives Finanz- oder Release-PASS folgt aus der Aufgabenbeschreibung.


## Laufzeitfortschritt (CP-0507, 2026-11-06)

Der integrierte Angebotsfluss bindet nun Leistungsumfang, Menge/Einheit, Qualitätsziel, Abnahmekriterium und Termin als separat validierte kommerzielle Bedingungen an Marktangebot und Quelle. Die Bedingungen sind vom Finanzsnapshot getrennt und werden bei einem Spielerzuschlag unverändert in den Kundenauftrag übernommen. Ein Auftragsplan muss Menge, Einheit und Bedingungen spiegeln; Änderungen werden abgewiesen. Legacy-Angebote ohne diesen Snapshot bleiben für alte Szenarien lesbar.

Das Formular verlangt keine technischen JSON-/ID-Felder für die Angebotsabgabe. Im angenommenen Auftragsfluss wird der Vertragsbezug teilweise vorausgefüllt. Neue Managementaufträge erhalten einen systemgenerierten Ressourcenplan ohne JSON-Eingabe. Ein älterer Auftrag ohne gespeicherten Angebotsscope wird als nicht planbar erklärt und verlangt keine technischen Felder; Kompatibilität alter Spielstände ist derzeit kein Ziel. Angebotsrevision/Gegenangebot, Teamprognose für Produktkonzepte und unabhängige Fach-/Browserreviews bleiben offen. Die Vertragsart bleibt bis zum A08-Review ausdrücklich nicht klassifiziert. T-0112 bleibt offen.

## Laufzeitfortschritt (CP-0508, 2026-11-06)

Der angenommene Managementauftrag kann jetzt ohne technische JSON-Eingabe geplant werden. Der deterministische Planer übersetzt Kundenanforderungen über vorhandene Berufsarchetypen in Skills, Maschinen und Materialbedarf, reserviert modellierte Arbeitsstunden auf Arbeitstagen, bildet Arbeitsschritte als Vorgängerkette ab und prüft den Liefertermin. Die bestehende Run-Planvalidierung bleibt das finale Gate. Fehlen Qualifikation, Betriebsmittel, Material, Lagerplatz oder Zeit, wird kein Teilplan angelegt und der Engpass angezeigt.

Der Plan beruht auf expliziten V3-Annahmen: ein Anfrage-Kapazitätspunkt entspricht einer modellierten Arbeitsstunde; die erste passende Archetyp-Rezeptur wird je vereinbarter Einheit angewandt; je Auftragseinheit wird eine Lagerkapazitätseinheit angesetzt. Diese sind synthetische Prototypwerte und müssen vor dem Release fachlich reviewed/kalibriert werden. Der Auftragsplan ist damit noch kein gemessener Zeit-, Material- oder Qualitätsforecast. Gegenangebote, neue Angebotsversionen vor Kundenentscheidung, Teamprognose zu Dauer/Qualität sowie unabhängige A03/A05/A08/A09-Reviews bleiben offen. Ein sichtbarer lokaler Browserpfad mit angenommener Anfrage und automatischem Arbeitsplan ist inzwischen durchlaufen; er umfasst noch keine vollständige Produkt-/Qualitätsprognose.