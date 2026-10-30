# V2-Inventar und Arbeitsplatzausstattung

Stand: 2026-10-28 · T-0040 / CP-0217 · MG-002 / SLG-002.2

## Funktionsumfang

Der Inventarbereich führt Rohmaterial und Fertigware als Lagerbestand sowie Ausstattung/Anlagegüter als einzelne Gegenstände. Im Startprofil kommt die Grundwerkbank mit Baumarkt-Handwerkzeug dazu. Zusätzliche Varianten werden im Inventar gekauft. Werkstätten bleiben über die bestehende München-Umlandkarte auswählbar; zehn Mietobjekte und zehn Kaufobjekte sind bereits im Standortbestand hinterlegt.

Die Katalogstruktur umfasst zehn Varianten in jeder dieser Arbeitsplatzkategorien:

| Arbeitsplatzbereich | Ausstattungskategorien |
| --- | --- |
| Büro / Beschaffung / Vertrieb | PC & Beschaffung; Schreibtisch & Büro; Marketing & Kundenkontakt |
| Werkstatt | Werkbank & Spannmittel; Handwerkzeug; Spezialwerkzeug; PSA & Arbeitsschutz |
| Lager / Versand | Lagerregale & Behälter; Lager- und Fördertechnik; Verpackungs- und Versandplatz |

Die Varianten erhalten abgestufte Szenariopreise, begrenzte Ausstattungsboni und Zustand. Werkbank/Handwerkzeug/PSA beeinflussen Fertigungsleistung; Marketing- und Büroausstattung beeinflusst die modellierte Einladungschance; Angebotsausstattung beeinflusst den Zuschlagswert. Regale erhöhen abhängig von ihrem Zustand die nutzbare Lagerkapazität. Beschaffungs-, Rechnungs- und Büroeffizienz werden im dynamischen BAB als unterstützende Kennwerte ausgewiesen. Das sind illustrative Spielwirkungen, keine gemessenen Unternehmenskennzahlen.

Nur Spezialwerkzeugvarianten besitzen einen Mietpfad. Dies ist getrennt vom Baumarkt-Tagesverleih für auftragsgebundene Werkzeuge. Ausstattungskäufe können bei unzureichendem Cash einen 12-monatigen Ratenkauf zu 8 % p. a. anbieten. Das sind produktseitige Szenariowerte. Die Finanzierung wird abgelehnt, wenn der Fehlbetrag den freien, aus der bestehenden 10-%-Finanzierungsgrenze abgeleiteten Kreditrahmen übersteigt. Der Rahmen rechnet vorhandene Dispo-, Immobilien- und Ausstattungsschulden an. Es gibt keine automatische Rahmenüberschreitung.

## Zustand, Verbrauch und Buchwert

Physischer Zustand sinkt an simulierten Arbeitstagen. Er steuert die wirksame Ausstattung und kann auf null fallen; das setzt den Gegenstand im Modell außer Betrieb. Buchwert läuft separat und kann null erreichen, obwohl ein Gegenstand physisch noch verwendbar ist. Materialbestände und Fertigware unterliegen dem Materialfluss/Versand und werden verbraucht; sie werden nicht als AfA-Anlagevermögen behandelt. Gemietete Gegenstände werden im Spiel nicht als eigenes Anlagevermögen abgeschrieben.

Für selbst angeschaffte, im Katalog als selbständig nutzbar gekennzeichnete Einheiten bis einschließlich 800 € wählt die V2-Szenariologik Sofortaufwand als GWG-Vereinfachung; höherpreisige oder nicht selbständig nutzbare Gegenstände laufen linear über eine angenommene Nutzungsdauer. EStG § 6 Abs. 2 verlangt selbständige Nutzbarkeit und prüft die Anschaffungskosten abzüglich enthaltener Vorsteuer. Der Gerätekauf behandelt die Katalogpreise im Szenario als netto, zeigt 19 % SimTAX separat, belastet das Bankkonto mit dem Bruttobetrag und bucht den Nettowert als Anlage-/GWG-Basis; die SimTAX-Vorsteuer wird im SimTAX-Monatsposten geführt (D-0156). Der €800-Test ist damit eine didaktische Modellrechnung, keine steuerliche Berechnung. Die BMF-AfA-Tabelle AV nennt beispielsweise drei Jahre für PC-Arbeitsplätze und 14 Jahre für Werkstatteinrichtungen; andere Katalogklassen sind Schätz-/Zuordnungswerte nach ähnlichen Gegenständen. Im Anschaffungsjahr wird nach vollen verbleibenden Monaten gerechnet. Die Ausführung ist noch keine steuerliche Einzelbehandlung: selbständige Nutzbarkeit, Nettoanschaffungskosten/Vorsteuer, Sammelpostenwahl, persönliche Gewinnermittlungsart, betriebliche Verhältnisse, Nutzungsanteile und abweichende Nutzungsdauer werden nicht vollständig modelliert. Der gesetzlich mögliche Sammelposten von 250 bis einschließlich 1.000 € ist derzeit nicht umgesetzt.

Materialpreise, Ausstattungspreise, Verschleißraten, Wirkungsstärken, Finanzierungskosten und etliche Nutzungsdauern sind ausdrücklich Spielwerte. Kein Preis wird als aktuelles Marktangebot ausgegeben. Der AfA-Auszug dient als Lernreferenz und nicht als Steuerberatung oder prüfungsfähige Buchführung.

## Quellen

- [EStG § 7 – lineare Absetzung nach betriebsgewöhnlicher Nutzungsdauer und zeitanteiliger Absetzung im Anschaffungsjahr](https://www.gesetze-im-internet.de/estg/__7.html)
- [EStG § 6 Abs. 2 – Sofortabzug bestimmter selbständig nutzbarer beweglicher Wirtschaftsgüter bis 800 €](https://www.gesetze-im-internet.de/estg/__6.html)
- [EStG § 6 Abs. 2a – Sammelposten für Wirtschaftsgüter zwischen 250 € und 1.000 €](https://www.gesetze-im-internet.de/estg/__6.html)
- [BMF – AfA-Tabellen und deren Zweck als Hilfsmittel zur Schätzung der Nutzungsdauer](https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerverwaltungu-Steuerrecht/Betriebspruefung/AfA_Tabellen/afa_tabellen.html?7de29e68_page=2&cd6c62dc_page=8)
- [BMF – AfA-Tabelle AV (u. a. PC-Arbeitsplätze 3 Jahre, Werkstatteinrichtungen 14 Jahre)](https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Weitere_Steuerthemen/Betriebspruefung/AfA-Tabellen/Ergaenzende-AfA-Tabellen/AfA-Tabelle_AV.pdf)
