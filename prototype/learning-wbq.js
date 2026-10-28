export const WBQ_ITEMS = [
  {
    "id": "wbq-vw-001",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-market-demand",
    "scenario": "Ein Maschinenbaubetrieb verzeichnet weniger Anfragen, nachdem ein Großkunde seine Fertigung drosselt.",
    "question": "Wie lässt sich zuerst prüfen, ob der Rückgang den Gesamtmarkt oder nur diesen Kunden betrifft?",
    "options": [
      "Nach einer kurzfristigen Delle sofort Überstunden abbauen, ohne andere Kundensegmente zu prüfen",
      "Auftragseingänge nur mit dem Vormonat vergleichen, obwohl die Nachfrage saisonal schwankt",
      "Anfragen und Aufträge nach Kundengruppen und Zeiträumen vergleichen",
      "Umsatzentwicklung des Großkunden als einzigen Marktindikator heranziehen"
    ],
    "correctOption": "C",
    "explanation": "Ein Vergleich nach Segmenten und Zeiträumen trennt eine allgemeine Nachfrageschwäche von einem kundenspezifischen Rückgang.",
    "companyEffect": "Der Betrieb kann den Vertrieb gezielter ausrichten und vermeidet einen unnötigen Margenverlust durch pauschale Preisnachlässe.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-market-demand",
    "correctAnswer": "Anfragen und Aufträge nach Kundengruppen und Zeiträumen vergleichen"
  },
  {
    "id": "wbq-vw-002",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-price-elasticity",
    "scenario": "Bei einem Standardteil steigt der Preis um 5 Prozent; bei sonst gleichen Bedingungen sinkt die nachgefragte Menge um 12 Prozent.",
    "question": "Wie ist die Preiselastizität der Nachfrage näherungsweise einzuordnen?",
    "options": [
      "Die Elastizität beträgt 0,42 und die Nachfrage ist unelastisch, weil die Preisänderung durch die Mengenänderung geteilt wird",
      "Die Elastizität beträgt im Betrag 2,4; die Nachfrage ist elastisch, wenn die übrigen Einflussgrößen konstant bleiben",
      "Die Nachfrage ist unelastisch, weil eine Preisänderung unter 10 Prozent keine Elastizität auslösen kann",
      "Ohne Kenntnis der Europreise lässt sich keine Elastizität bestimmen, auch wenn prozentuale Preis- und Mengenänderung bekannt sind"
    ],
    "correctOption": "B",
    "explanation": "Die vereinfachte Preiselastizität beträgt -12 % / 5 % = -2,4. Für die Einordnung zählt der Betrag: über 1 bedeutet elastische Nachfrage. Das gilt hier unter der Annahme, dass andere Einflussgrößen gleich bleiben.",
    "companyEffect": "Die deutliche Mengenreaktion warnt vor pauschalen Preiserhöhungen; der Betrieb sollte Deckungsbeitrag und Kundensegmente prüfen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-price-elasticity",
    "correctAnswer": "Die Elastizität beträgt im Betrag 2,4; die Nachfrage ist elastisch, wenn die übrigen Einflussgrößen konstant bleiben"
  },
  {
    "id": "wbq-vw-003",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-market-structure",
    "scenario": "Drei Betriebe in der Region bieten ähnliche CNC-Lohnfertigung an; Kunden können kurzfristig wechseln.",
    "question": "Welcher Umstand begrenzt den Preissetzungsspielraum eines einzelnen Betriebs am stärksten?",
    "options": [
      "Ähnliche Konkurrenzangebote und geringe Wechselhürden",
      "Differenzierung durch Beratung kann die Preissensibilität mindern, beseitigt aber die Konkurrenz nicht",
      "Ein hoher regionaler Marktanteil verleiht nur bei wirksamen Markteintrittsbarrieren Preissetzungsspielraum",
      "Ähnliche Anbieter erzeugen kaum Wettbewerbsdruck, wenn der eigene Betrieb gut ausgelastet ist"
    ],
    "correctOption": "A",
    "explanation": "Austauschbare Angebote und einfache Wechselmöglichkeiten erhöhen den Wettbewerbsdruck.",
    "companyEffect": "Bei Angeboten muss der Betrieb Marktalternativen und die eigene Kostengrenze berücksichtigen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-market-structure",
    "correctAnswer": "Ähnliche Konkurrenzangebote und geringe Wechselhürden"
  },
  {
    "id": "wbq-vw-004",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-opportunity-cost",
    "scenario": "Der Inhaber nutzt eine Maschine für einen internen Prototyp; dadurch kann ein bereits angefragter Kundenauftrag nicht gefertigt werden.",
    "question": "Welche Größe beschreibt die relevante Opportunitätskosten am besten?",
    "options": [
      "Die eingesparten Materialkosten des Prototyps unabhängig von verdrängten Aufträgen ansetzen",
      "Den Umsatz des verdrängten Auftrags statt seines Deckungsbeitrags als entgangenen Nutzen verwenden",
      "Alle Maschinenkosten einschließlich unveränderlicher Fixkosten dem Prototyp zurechnen",
      "Der entgangene Deckungsbeitrag des besten verdrängten Auftrags"
    ],
    "correctOption": "D",
    "explanation": "Opportunitätskosten entsprechen dem Nutzen der besten Alternative, auf die verzichtet wird.",
    "companyEffect": "Der Betrieb kann den Prototypenauftrag mit dem Deckungsbeitrag des verdrängten Kundenauftrags vergleichen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-opportunity-cost",
    "correctAnswer": "Der entgangene Deckungsbeitrag des besten verdrängten Auftrags"
  },
  {
    "id": "wbq-vw-005",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-productivity",
    "scenario": "Die Fertigung stellt statt 80 nun 100 Teile her; gleichzeitig steigen die bezahlten Arbeitsstunden von 40 auf 50.",
    "question": "Wie verändert sich die Arbeitsproduktivität, gemessen als Teile je Arbeitsstunde?",
    "options": [
      "Die Arbeitsproduktivität sinkt, weil die Beschäftigten mehr Stunden arbeiten",
      "Für eine Veränderung müsste zusätzlich die Lohnsumme bekannt sein",
      "Sie bleibt bei 2 Teilen je Stunde",
      "Die Produktivität steigt, weil die Stückzahl zunimmt, auch wenn die Arbeitsstunden gleich stark wachsen"
    ],
    "correctOption": "C",
    "explanation": "Ausbringungsmenge und Arbeitsstunden steigen jeweils um 25 Prozent; das Verhältnis bleibt daher gleich.",
    "companyEffect": "Die höhere Gesamtmenge allein belegt keine Produktivitätssteigerung. Für einen Vergleich braucht der Betrieb sowohl Output als auch Ressourceneinsatz.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-productivity",
    "correctAnswer": "Sie bleibt bei 2 Teilen je Stunde"
  },
  {
    "id": "wbq-vw-006",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-inflation",
    "scenario": "Der Stahlpreis steigt um 8 Prozent; die Verkaufspreise des Betriebs sind für drei Monate vertraglich gebunden.",
    "question": "Welches wirtschaftliche Risiko entsteht kurzfristig am ehesten?",
    "options": [
      "Der Betrieb kann gestiegene Kosten unmittelbar weitergeben, obwohl der Verkaufspreis vertraglich gebunden ist",
      "Die Marge sinkt durch höhere Materialkosten bei unverändertem Verkaufspreis",
      "Die Marge bleibt bei festen Verkaufspreisen unverändert, wenn die Kosten erst später bezahlt werden",
      "Die höhere Materialrechnung wird vollständig durch den gestiegenen Vorratswert ausgeglichen"
    ],
    "correctOption": "B",
    "explanation": "Steigende Beschaffungskosten belasten die Marge, solange die Erlöse nicht angepasst werden können.",
    "companyEffect": "Der Betrieb sollte Materialannahmen in neuen Kalkulationen aktualisieren und den Liquiditätsbedarf beobachten.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-inflation",
    "correctAnswer": "Die Marge sinkt durch höhere Materialkosten bei unverändertem Verkaufspreis"
  },
  {
    "id": "wbq-vw-007",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-interest-rate",
    "scenario": "Ein Betrieb finanziert eine neue Maschine mit einem variabel verzinsten Darlehen.",
    "question": "Welche Folge kann ein Anstieg des Marktzinses unmittelbar haben?",
    "options": [
      "Höhere künftige Zinsaufwendungen und Schuldendienstzahlungen",
      "Eine Leitzinserhöhung verändert jede bestehende Festzinsvereinbarung automatisch",
      "Die variable Rate beeinflusst nur den Tilgungsanteil, nicht den Zinsaufwand",
      "Ein höherer Marktzins senkt den Schuldendienst, wenn die Restschuld sinkt"
    ],
    "correctOption": "A",
    "explanation": "Bei variabler Verzinsung wird der Zinssatz gemäß Darlehensvertrag angepasst.",
    "companyEffect": "Höhere Finanzierungskosten können Ergebnis und verfügbare Liquidität belasten.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-interest-rate",
    "correctAnswer": "Höhere künftige Zinsaufwendungen und Schuldendienstzahlungen"
  },
  {
    "id": "wbq-vw-008",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-exchange-rate",
    "scenario": "Ein deutscher Betrieb bestellt Steuerungen in US-Dollar; der Dollarpreis bleibt gleich, aber der Euro verliert an Wert.",
    "question": "Wie wirkt sich das voraussichtlich auf den Euro-Beschaffungspreis aus?",
    "options": [
      "Der Dollarbetrag sinkt automatisch im selben Verhältnis wie der Euro",
      "Der Lieferant muss den Preis in Euro senken, sobald sich der Wechselkurs ändert",
      "Die Wechselkursänderung betrifft nur die Zahlung nach Lieferung und nicht die Kalkulation",
      "Er steigt, weil für denselben Dollarbetrag mehr Euro benötigt werden"
    ],
    "correctOption": "D",
    "explanation": "Ein schwächerer Euro hat gegenüber dem Dollar eine geringere Kaufkraft.",
    "companyEffect": "Die Beschaffung kann teurer werden; der Betrieb sollte Wechselkurs- und Bestellrisiken in seiner Planung berücksichtigen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-exchange-rate",
    "correctAnswer": "Er steigt, weil für denselben Dollarbetrag mehr Euro benötigt werden"
  },
  {
    "id": "wbq-vw-009",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-business-cycle",
    "scenario": "In mehreren Branchen sinken Auftragseingänge und Kapazitätsauslastung; zugleich steigt die Arbeitslosigkeit.",
    "question": "Welche gesamtwirtschaftliche Entwicklung passt am ehesten zu diesen Indikatoren?",
    "options": [
      "Die Nachfrage steigt über die vorhandene Produktionskapazität",
      "Die Beschäftigung bleibt hoch und die Auslastung steigt",
      "Ein konjunktureller Abschwung",
      "Eine einzelne Branche verzeichnet weniger Aufträge, während andere Indikatoren stabil bleiben"
    ],
    "correctOption": "C",
    "explanation": "Breit sinkende Nachfrage und Auslastung bei steigender Arbeitslosigkeit sprechen für eine Abschwächung der Konjunktur.",
    "companyEffect": "Der Betrieb kann Einkauf, Lagerbestand und Liquiditätsplanung vorsichtiger ausrichten.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-business-cycle",
    "correctAnswer": "Ein konjunktureller Abschwung"
  },
  {
    "id": "wbq-vw-010",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-supply-demand",
    "scenario": "Eine neue Sicherheitsvorschrift schränkt vorübergehend die Verfügbarkeit zertifizierten Rohmaterials ein; die Nachfrage bleibt stabil.",
    "question": "Welche kurzfristige Marktreaktion ist am wahrscheinlichsten?",
    "options": [
      "Die gehandelte Menge muss steigen, weil zertifiziertes Material gefragter wird",
      "Das geringere Angebot erhöht den Preisdruck und kann die gehandelte Menge verringern",
      "Knappes Angebot bei stabiler Nachfrage senkt den Gleichgewichtspreis",
      "Die geringere Verfügbarkeit verlagert die Nachfragekurve nach rechts"
    ],
    "correctOption": "B",
    "explanation": "Ein Rückgang des verfügbaren Angebots verschiebt das Angebot nach links und erzeugt bei sonst gleichen Bedingungen Aufwärtsdruck auf den Preis.",
    "companyEffect": "Längere Beschaffungszeiten oder höhere Preise können Lieferzusagen und Auftragsmargen gefährden.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-supply-demand",
    "correctAnswer": "Das geringere Angebot erhöht den Preisdruck und kann die gehandelte Menge verringern"
  },
  {
    "id": "wbq-vw-011",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-make-or-buy",
    "scenario": "Ein wiederkehrendes Drehteil kann intern gefertigt oder zu einem Festpreis zugekauft werden.",
    "question": "Welche Größen sollte die Make-or-buy-Entscheidung vorrangig vergleichen?",
    "options": [
      "Vermeidbare Eigenfertigungskosten und Kapazitätswert mit Einkaufspreis und Lieferbedingungen",
      "Historische Vollkosten mit Einkaufspreis vergleichen, ohne zu prüfen, welche Kosten künftig entfallen",
      "Den Einkauf wählen, sobald der Stückpreis unter den gesamten Fertigungskosten liegt",
      "Eigenfertigung wählen, sobald die Maschine verfügbar ist, ohne Opportunitätskosten einzubeziehen"
    ],
    "correctOption": "A",
    "explanation": "Die Entscheidung vergleicht zukünftige relevante Kosten und den Wert gebundener Kapazität.",
    "companyEffect": "Die Wahl berücksichtigt, ob Eigenfertigung rentable Maschinenzeit verdrängt und welche Risiken die Lieferbedingungen enthalten.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-make-or-buy",
    "correctAnswer": "Vermeidbare Eigenfertigungskosten und Kapazitätswert mit Einkaufspreis und Lieferbedingungen"
  },
  {
    "id": "wbq-vw-012",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-value-chain",
    "scenario": "Nach einer unklaren Übergabe der Zeichnung zwischen Arbeitsvorbereitung und Fertigung kommt es wiederholt zu Nacharbeit.",
    "question": "Wo sollte die Verbesserung zuerst ansetzen?",
    "options": [
      "Nur die Endkontrolle verschärfen, obwohl Fehler bereits aus der Zeichnungsübergabe entstehen",
      "Mehr Bestände zwischen den Arbeitsschritten anlegen, ohne die Ursache der Nacharbeit zu beheben",
      "Die Fertigungszeit pauschal erhöhen, statt Zeichnungsrevision und Übergabepunkt zu prüfen",
      "Bei der Informationsübergabe, die den nachgelagerten Fehler auslöst"
    ],
    "correctOption": "D",
    "explanation": "Die Wertschöpfungskette hilft, die Aktivität oder Schnittstelle zu finden, die nachgelagerte Kosten verursacht.",
    "companyEffect": "Eine klarere technische Übergabe kann Nacharbeit, Verzögerungen und Reklamationsrisiken senken.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-value-chain",
    "correctAnswer": "Bei der Informationsübergabe, die den nachgelagerten Fehler auslöst"
  },
  {
    "id": "wbq-vw-013",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-stakeholders",
    "scenario": "Die Bank benötigt verlässliche Liquiditätsvorschauen; Beschäftigte wünschen frühzeitig planbare Schichten.",
    "question": "Wie sollte die Geschäftsführung mit diesen unterschiedlichen Interessen umgehen?",
    "options": [
      "Der Bank nur den Jahresabschluss zeigen, ohne künftige Zahlungsströme zu erläutern",
      "Beschäftigten feste Schichten zusagen, bevor Auftrags- und Kapazitätslage geprüft sind",
      "Beide Anliegen erfassen und in eine umsetzbare Planung einbeziehen",
      "Die Schichten ausschließlich nach dem kurzfristigen Produktionsbedarf einteilen"
    ],
    "correctOption": "C",
    "explanation": "Stakeholdermanagement berücksichtigt berechtigte Interessen und gleicht sie mit den betrieblichen Möglichkeiten ab.",
    "companyEffect": "Bessere Vorschauen stärken das Vertrauen der Bank; planbare Schichten können die Personalbindung verbessern.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-stakeholders",
    "correctAnswer": "Beide Anliegen erfassen und in eine umsetzbare Planung einbeziehen"
  },
  {
    "id": "wbq-vw-014",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-company-form",
    "scenario": "Eine Gründerin möchte eine Gesellschaft mit eigener Rechtspersönlichkeit und grundsätzlich auf das Gesellschaftsvermögen begrenzter Haftung.",
    "question": "Welche Rechtsform passt am ehesten zu diesen Zielen?",
    "options": [
      "Eine GbR gründen und annehmen, die persönliche Haftung sei durch die Beteiligungsquote begrenzt",
      "GmbH, unter Beachtung ihrer Gründungs- und Kapitalvorschriften",
      "Eine UG haftungsbeschränkt wählen, ohne Gründungs- und Kapitalanforderungen zu prüfen",
      "Einzelunternehmen wählen und die gewünschte Trennung durch eine interne Buchung herstellen"
    ],
    "correctOption": "B",
    "explanation": "Die GmbH ist eine juristische Person; grundsätzlich haftet für Gesellschaftsverbindlichkeiten das Gesellschaftsvermögen, vorbehaltlich gesetzlicher Ausnahmen.",
    "companyEffect": "Vor der Gründung müssen Kapitalausstattung, Gründungsaufwand, Vertretung und laufende Pflichten geprüft werden.",
    "sourceRef": "LAW-GMBHG-13",
    "sourceKind": "law",
    "tooltipKey": "vw-company-form",
    "correctAnswer": "GmbH, unter Beachtung ihrer Gründungs- und Kapitalvorschriften"
  },
  {
    "id": "wbq-vw-015",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-location",
    "scenario": "Ein Fertigungsbetrieb erwägt einen günstigeren Standort, der weiter von Kunden und Lieferanten entfernt liegt.",
    "question": "Welche Standortanalyse ist am vollständigsten?",
    "options": [
      "Miete, Logistik, Personalzugang, Umzugskosten und Auswirkungen auf den Kundenservice vergleichen",
      "Nur Frachtkosten prüfen und Arbeitskräftezugang sowie Kundenservice ausblenden",
      "Den günstigen Standort wählen, ohne Umzugs- und Anlaufkosten in die Rechnung einzubeziehen",
      "Die Nähe zum Hauptkunden priorisieren und Lieferantenwege grundsätzlich ignorieren"
    ],
    "correctOption": "A",
    "explanation": "Der Standort beeinflusst neben Miete auch Transport, Personalgewinnung, Übergang und Service.",
    "companyEffect": "Niedrigere Miete kann durch Frachtkosten, Verzögerungen oder schwierige Personalgewinnung aufgezehrt werden.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-location",
    "correctAnswer": "Miete, Logistik, Personalzugang, Umzugskosten und Auswirkungen auf den Kundenservice vergleichen"
  },
  {
    "id": "wbq-vw-016",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-investment-appraisal",
    "scenario": "Zwei Maschinen haben unterschiedliche Anschaffungskosten und Nutzungsdauern, liefern aber eine vergleichbare Jahresleistung.",
    "question": "Welche Methode unterstützt einen Vergleich der jährlichen wirtschaftlichen Belastung?",
    "options": [
      "Die Anschaffungsauszahlung durch die Nutzungsdauer teilen, aber Zins und Restwert ignorieren",
      "Die Maschine mit dem niedrigeren Kaufpreis bevorzugen, ohne Folgekosten zu vergleichen",
      "Die jährlichen Kosten anhand unterschiedlicher Auslastungsannahmen vergleichen",
      "Annuitäten- beziehungsweise Jahreskostenvergleich mit einheitlichen Annahmen"
    ],
    "correctOption": "D",
    "explanation": "Ein Jahreskostenvergleich rechnet Investitionskosten auf vergleichbare Zeiträume um.",
    "companyEffect": "Die Geschäftsführung kann beurteilen, welche Maschine die benötigte Leistung zu geringeren jährlichen Gesamtkosten ermöglicht.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-investment-appraisal",
    "correctAnswer": "Annuitäten- beziehungsweise Jahreskostenvergleich mit einheitlichen Annahmen"
  },
  {
    "id": "wbq-vw-017",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-net-present-value",
    "scenario": "Eine Investition weist bei Verwendung des betrieblichen Kalkulationszinses einen positiven Kapitalwert auf.",
    "question": "Was bedeutet das unter den zugrunde gelegten Annahmen?",
    "options": [
      "Der Kapitalwert ersetzt eine Prüfung von Absatzrisiken und Prognoseannahmen",
      "Ein positiver Kapitalwert sichert die kurzfristige Zahlungsfähigkeit des Vorhabens",
      "Die abgezinsten Rückflüsse übersteigen die Anfangsauszahlung beim gewählten Kalkulationszins",
      "Ein positiver Kapitalwert bedeutet, dass jeder einzelne Jahresüberschuss positiv ist"
    ],
    "correctOption": "C",
    "explanation": "Ein positiver Kapitalwert zeigt, dass die abgezinsten Rückflüsse die Investitionsauszahlung beim vorgegebenen Zinssatz übersteigen.",
    "companyEffect": "Das Projekt kann Wert schaffen; die Entscheidung hängt weiterhin von realistischen Prognosen und Risiken ab.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-net-present-value",
    "correctAnswer": "Die abgezinsten Rückflüsse übersteigen die Anfangsauszahlung beim gewählten Kalkulationszins"
  },
  {
    "id": "wbq-vw-018",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-payback",
    "scenario": "Ein Investitionsvergleich nutzt ausschließlich die Amortisationsdauer.",
    "question": "Welche wesentliche Schwäche dieser Methode sollte die Geschäftsführung beachten?",
    "options": [
      "Die Amortisationsdauer als Ersatz für eine Liquiditätsplanung verwenden",
      "Zahlungsströme nach der Amortisation und der Zeitwert des Geldes können unberücksichtigt bleiben",
      "Die kürzeste Amortisation wählen, weil sie automatisch den höchsten Gesamtertrag liefert",
      "Nach der Amortisation entstehende Rückflüsse vollständig in die Rechnung einbeziehen"
    ],
    "correctOption": "B",
    "explanation": "Die einfache Amortisationsrechnung blendet häufig spätere Zahlungsströme und Abzinsung aus.",
    "companyEffect": "Sie eignet sich als Liquiditätsindikator, sollte aber nicht allein über den wirtschaftlichen Wert entscheiden.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-payback",
    "correctAnswer": "Zahlungsströme nach der Amortisation und der Zeitwert des Geldes können unberücksichtigt bleiben"
  },
  {
    "id": "wbq-vw-019",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-risk-diversification",
    "scenario": "70 Prozent des Umsatzes eines Zulieferers stammen von einem einzigen Kunden.",
    "question": "Welche Maßnahme senkt das Kundenkonzentrationsrisiko am unmittelbarsten?",
    "options": [
      "Weitere Kunden und Marktsegmente systematisch entwickeln",
      "Den Großkunden behalten und zusätzlich einen zweiten Kunden mit ähnlichem Geschäftszyklus gewinnen",
      "Kundenumsätze breiter aufteilen, aber Forderungsausfälle und Branchenabhängigkeit nicht prüfen",
      "Weitere Kunden gewinnen, ohne den Deckungsbeitrag oder Zahlungsbedingungen zu vergleichen"
    ],
    "correctOption": "A",
    "explanation": "Eine breitere Kundenbasis mindert die Abhängigkeit von der Nachfrage und Zahlungsmoral eines einzelnen Abnehmers.",
    "companyEffect": "Der Umsatz kann widerstandsfähiger werden; die Kundengewinnung verursacht jedoch Aufwand und bleibt unsicher.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-risk-diversification",
    "correctAnswer": "Weitere Kunden und Marktsegmente systematisch entwickeln"
  },
  {
    "id": "wbq-vw-020",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-scarcity",
    "scenario": "Eine qualifizierte Fachkraft kann entweder einen dringenden Auftrag fertigstellen oder eine Kollegin einarbeiten.",
    "question": "Welcher volkswirtschaftliche Grundgedanke macht diese Auswahl notwendig?",
    "options": [
      "Die Maschine gleichzeitig für zwei inkompatible Aufträge einsetzen",
      "Die Entscheidung vertagen, bis jede denkbare Nutzung gleichzeitig möglich wird",
      "Die Ressource nach Dringlichkeit zuteilen, ohne den Wert der besten Alternative zu betrachten",
      "Knappheit zwingt zur Abwägung konkurrierender Verwendungen"
    ],
    "correctOption": "D",
    "explanation": "Bei knappen Ressourcen können nicht alle Verwendungen gleichzeitig erfüllt werden.",
    "companyEffect": "Die Leitung wägt Liefertermin, Deckungsbeitrag und langfristigen Kompetenzaufbau gegeneinander ab.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-scarcity",
    "correctAnswer": "Knappheit zwingt zur Abwägung konkurrierender Verwendungen"
  },
  {
    "id": "wbq-vw-021",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-marginal-analysis",
    "scenario": "Eine zusätzliche Schicht erzielt 4.000 Euro Mehrerlös und verursacht 3.200 Euro zusätzliche Kosten.",
    "question": "Wie hoch ist der zusätzliche Deckungsbeitrag vor weiteren Effekten?",
    "options": [
      "3.200 Euro, wenn nur die Mehrkosten als Beitrag behandelt werden",
      "1.200 Euro, indem die zusätzlichen Erlöse mit dem Deckungsbeitrag verwechselt werden",
      "800 Euro",
      "840 Euro, indem die Mehrkosten vom Deckungsbeitrag abgezogen werden"
    ],
    "correctOption": "C",
    "explanation": "Der zusätzliche Erlös abzüglich der zusätzlichen Kosten ergibt 800 Euro.",
    "companyEffect": "Die Schicht verbessert das Ergebnis nur, wenn keine übersehenen Engpässe, Qualitäts- oder Liquiditätseffekte den Vorteil aufheben.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-marginal-analysis",
    "correctAnswer": "800 Euro"
  },
  {
    "id": "wbq-vw-022",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-externality",
    "scenario": "Der Lärm einer Produktionsstätte belastet Anwohner; diese Kosten sind nicht im betrieblichen Stückpreis enthalten.",
    "question": "Wie wird diese Belastung volkswirtschaftlich eingeordnet?",
    "options": [
      "Den Lärm nur dann als externe Wirkung ansehen, wenn Anwohner eine Rechnung stellen",
      "Als negative externe Wirkung",
      "Die Lärmkosten als internen Maschinenverschleiß erfassen",
      "Den Nachbarschaftsschaden als Konsumentenrente des Betriebs einstufen"
    ],
    "correctOption": "B",
    "explanation": "Eine negative Externalität ist ein Schaden, der Dritten außerhalb des Geschäfts auferlegt wird.",
    "companyEffect": "Auflagen oder Lärmschutz können Kosten verursachen; frühzeitige Minderung schützt Nachbarschaftsbeziehungen und Betriebserlaubnis.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-externality",
    "correctAnswer": "Als negative externe Wirkung"
  },
  {
    "id": "wbq-vw-023",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-public-goods",
    "scenario": "Ein Branchenverband stellt allen Mitgliedern frei zugängliche Schulungsunterlagen bereit.",
    "question": "Welche Eigenschaft ähnelt diesem Wissen einem öffentlichen Gut?",
    "options": [
      "Nutzung ist schwer ausschließbar und durch weitere Nutzer kaum vermindert",
      "Das Materiallager als öffentliches Gut betrachten, weil mehrere Beschäftigte darauf zugreifen",
      "Schulungsunterlagen als rival ansehen, sobald ein weiterer Betrieb sie liest",
      "Die Bereitstellung als öffentliches Gut einordnen, weil sie von einem Verband stammt, ohne Ausschließbarkeit und Rivalität zu prüfen"
    ],
    "correctOption": "A",
    "explanation": "Nicht-Ausschließbarkeit und Nicht-Rivalität kennzeichnen ein reines öffentliches Gut.",
    "companyEffect": "Gemeinsam nutzbares Wissen kann vielen Betrieben helfen; Finanzierung und Beteiligung müssen dennoch organisiert werden.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-public-goods",
    "correctAnswer": "Nutzung ist schwer ausschließbar und durch weitere Nutzer kaum vermindert"
  },
  {
    "id": "wbq-vw-024",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-competition-policy",
    "scenario": "Zwei Wettbewerber erwägen, sich auf einen gemeinsamen Mindestpreis für CNC-Aufträge zu einigen.",
    "question": "Welches wettbewerbsrechtliche Risiko steht im Vordergrund?",
    "options": [
      "Preise unabhängig festlegen, aber künftige Angebotsdaten regelmäßig untereinander austauschen",
      "Nur eine unverbindliche Preisempfehlung vereinbaren, die tatsächlich als Mindestpreis überwacht wird",
      "Ein gemeinsames Rabattband festlegen und es als interne Kostenkontrolle bezeichnen",
      "Eine Preisabsprache kann den Wettbewerb beschränken"
    ],
    "correctOption": "D",
    "explanation": "Absprachen zwischen Wettbewerbern über Preise können gegen das Kartellrecht verstoßen.",
    "companyEffect": "Der Betrieb muss Preise eigenständig festlegen und sollte bei konkreten Zweifeln rechtlichen Rat einholen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-competition-policy",
    "correctAnswer": "Eine Preisabsprache kann den Wettbewerb beschränken"
  },
  {
    "id": "wbq-vw-025",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-corporate-purpose",
    "scenario": "Eine Kostensenkung verbessert kurzfristig das Ergebnis, führt aber wiederholt zu Qualitätsmängeln und Kundenabwanderung.",
    "question": "Welche Beurteilung passt am besten zu einer langfristig tragfähigen Unternehmensführung?",
    "options": [
      "Die Qualitätskosten erhöhen, ohne den Einfluss auf Wiederholaufträge oder Reklamationen zu messen",
      "Kurzfristige Einsparung als Erfolg bewerten, solange der Quartalsgewinn steigt",
      "Kundenwirkung, Qualität, Kosten und Finanzergebnis gemeinsam bewerten",
      "Ausschuss reduzieren und dabei prüfen, ob Kundenzufriedenheit und Nacharbeitskosten ebenfalls berücksichtigt werden"
    ],
    "correctOption": "C",
    "explanation": "Nachhaltige Leistung hängt von miteinander verbundenen Markt-, Qualitäts-, Betriebs- und Finanzwirkungen ab.",
    "companyEffect": "Eine gezielte Qualitätsinvestition kann Folgeaufträge sichern und Nacharbeit sowie Gewährleistungskosten senken.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-corporate-purpose",
    "correctAnswer": "Kundenwirkung, Qualität, Kosten und Finanzergebnis gemeinsam bewerten"
  },
  {
    "id": "wbq-rw-001",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-balance-sheet",
    "scenario": "Im Abschluss stehen Bankguthaben, Forderungen, Vorräte, Maschinen, Lieferantenverbindlichkeiten und ein Darlehen.",
    "question": "Welche Rechnung zeigt Vermögen sowie Eigen- und Fremdfinanzierung zu einem Stichtag?",
    "options": [
      "Kapitalflussrechnung mit Ein- und Auszahlungen",
      "Liquiditätsstatus für den nächsten Monat",
      "Bilanz",
      "Erfolgsrechnung mit Erlösen und Aufwendungen einer Periode"
    ],
    "correctOption": "C",
    "explanation": "Die Bilanz stellt Vermögen, Eigenkapital und Schulden zu einem bestimmten Zeitpunkt dar.",
    "companyEffect": "Sie hilft, Vermögensstruktur, Finanzierung und kurzfristige Deckung zu beurteilen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-balance-sheet",
    "correctAnswer": "Bilanz"
  },
  {
    "id": "wbq-rw-002",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-income-statement",
    "scenario": "Im Quartal erzielt ein Betrieb 90.000 Euro Umsatzerlöse bei 72.000 Euro Aufwand.",
    "question": "Wie hoch ist das Periodenergebnis vor Steuern und weiteren Positionen?",
    "options": [
      "162.000 Euro Aufwand",
      "18.000 Euro Gewinn",
      "72.000 Euro Verlust",
      "18.000 Euro Verlust"
    ],
    "correctOption": "B",
    "explanation": "Die Differenz aus 90.000 Euro Erlösen und 72.000 Euro Aufwendungen beträgt 18.000 Euro.",
    "companyEffect": "Das Ergebnis misst den wirtschaftlichen Erfolg, sagt aber allein nicht aus, wie viel Geld auf dem Bankkonto liegt.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-income-statement",
    "correctAnswer": "18.000 Euro Gewinn"
  },
  {
    "id": "wbq-rw-003",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cash-vs-profit",
    "scenario": "Ein Betrieb liefert auf 30 Tage Zahlungsziel und weist bereits einen Gewinn aus; der Kunde hat noch nicht bezahlt.",
    "question": "Warum kann trotzdem ein Liquiditätsengpass entstehen?",
    "options": [
      "Gewinn und Zahlungseingang fallen zeitlich auseinander",
      "Der Gewinn wird erst bei Zahlung des Kunden erfasst",
      "Die Forderung erhöht die Liquidität am Verkaufstag",
      "Der Betrieb muss Lieferanten erst bezahlen, wenn der Kunde zahlt"
    ],
    "correctOption": "A",
    "explanation": "Bei einer Lieferung auf Ziel kann der Ertrag vor dem Zahlungseingang erfasst werden; das Geld bleibt zunächst in der Forderung gebunden.",
    "companyEffect": "Für die Liquiditätsplanung müssen erwartete Zahlungstermine zusätzlich zum Periodenergebnis verfolgt werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cash-vs-profit",
    "correctAnswer": "Gewinn und Zahlungseingang fallen zeitlich auseinander"
  },
  {
    "id": "wbq-rw-004",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-depreciation",
    "scenario": "Eine Maschine kostet 50.000 Euro, wird fünf Jahre linear genutzt und hat keinen Restwert.",
    "question": "Wie hoch ist die jährliche lineare Abschreibung?",
    "options": [
      "12.500 Euro bei Anwendung einer Nutzungsdauer von vier Jahren",
      "8.000 Euro bei einem Restwert von 10.000 Euro",
      "10.000 Euro jährlich als Auszahlung an den Maschinenlieferanten",
      "10.000 Euro"
    ],
    "correctOption": "D",
    "explanation": "50.000 Euro Anschaffungskosten geteilt durch fünf Nutzungsjahre ergeben 10.000 Euro jährlich.",
    "companyEffect": "Die Abschreibung verteilt den Werteverzehr auf Perioden; sie ist keine jährliche Auszahlung in gleicher Höhe.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-depreciation",
    "correctAnswer": "10.000 Euro"
  },
  {
    "id": "wbq-rw-005",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-inventory-valuation",
    "scenario": "Zum Jahresende liegt ein Materialposten für 4.000 Euro noch unverbaut im Lager.",
    "question": "Wie wird sein noch nicht verbrauchter Wert grundsätzlich berücksichtigt?",
    "options": [
      "Als Anlagevermögen, weil Material länger als einen Monat lagert",
      "Als Forderung, solange die Lieferantenrechnung offen ist",
      "Als Vorratsvermögen, vorbehaltlich der Bewertungsregeln",
      "Als Aufwand des Jahres, obwohl der Posten noch nicht verbraucht wurde"
    ],
    "correctOption": "C",
    "explanation": "Nicht verbrauchtes Material bleibt grundsätzlich Vermögen; Verbrauch und mögliche Wertminderungen sind nach den geltenden Regeln zu beurteilen.",
    "companyEffect": "Ein korrekter Verbrauchs- und Bestandsabgleich verhindert, dass Periodenkosten oder Vorräte falsch ausgewiesen werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-inventory-valuation",
    "correctAnswer": "Als Vorratsvermögen, vorbehaltlich der Bewertungsregeln"
  },
  {
    "id": "wbq-rw-006",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cost-types",
    "scenario": "Die monatliche Hallenmiete beträgt innerhalb des betrachteten Auslastungsbereichs stets 2.000 Euro.",
    "question": "Wie verhält sich dieser Aufwand gegenüber der Produktionsmenge?",
    "options": [
      "Die Miete wird erst bei Vollauslastung als Aufwand erfasst",
      "Als Fixkosten bleibt der Gesamtbetrag im Bereich konstant",
      "Die Mietkosten steigen proportional mit jeder zusätzlichen Schicht",
      "Die Miete ist je Stück fix und ändert sich nicht mit der Auslastung"
    ],
    "correctOption": "B",
    "explanation": "Fixkosten bleiben im relevanten Beschäftigungsbereich insgesamt konstant; je Stück verändern sie sich mit der Menge.",
    "companyEffect": "Bei Kapazitätsentscheidungen muss der Betrieb Gesamtfixkosten von mengenabhängigen Kosten unterscheiden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cost-types",
    "correctAnswer": "Als Fixkosten bleibt der Gesamtbetrag im Bereich konstant"
  },
  {
    "id": "wbq-rw-007",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-variable-cost",
    "scenario": "Der Stahlverbrauch steigt bei gleichbleibendem Preis und gleichbleibendem Verbrauch je Teil proportional von 100 auf 150 Kilogramm.",
    "question": "Wie entwickelt sich der gesamte Materialaufwand?",
    "options": [
      "Er steigt proportional zur Ausbringungsmenge",
      "Der Materialaufwand sinkt bei gleichbleibendem Stückverbrauch",
      "Der Gesamtaufwand steigt nur, wenn der Materialpreis steigt",
      "Der Materialverbrauch ist fix, weil der Kilopreis unverändert bleibt"
    ],
    "correctOption": "A",
    "explanation": "Bei konstantem Stückverbrauch und Preis wächst der Gesamtaufwand mit der eingesetzten Materialmenge.",
    "companyEffect": "Aus dem Produktionsplan kann der Betrieb den erwarteten Materialbedarf und die zugehörige Mittelbindung ableiten.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-variable-cost",
    "correctAnswer": "Er steigt proportional zur Ausbringungsmenge"
  },
  {
    "id": "wbq-rw-008",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-contribution-margin",
    "scenario": "Ein Auftrag bringt 1.200 Euro Erlös und verursacht 760 Euro variable Kosten.",
    "question": "Wie hoch ist der Deckungsbeitrag vor Fixkosten?",
    "options": [
      "760 Euro als Deckungsbeitrag, weil die variablen Kosten den Erlös ergänzen",
      "1.200 Euro als Deckungsbeitrag vor Abzug der variablen Kosten",
      "440 Euro als Gewinn nach Abzug sämtlicher Fixkosten",
      "440 Euro"
    ],
    "correctOption": "D",
    "explanation": "Erlös abzüglich variabler Kosten ergibt einen Deckungsbeitrag von 440 Euro.",
    "companyEffect": "Der Deckungsbeitrag trägt zur Deckung der Fixkosten und anschließend zum Betriebsergebnis bei.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-contribution-margin",
    "correctAnswer": "440 Euro"
  },
  {
    "id": "wbq-rw-009",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-break-even",
    "scenario": "Monatliche Fixkosten betragen 12.000 Euro; je verkauftem Stück verbleiben 30 Euro Deckungsbeitrag.",
    "question": "Welche Absatzmenge erreicht unter diesen Annahmen die Gewinnschwelle?",
    "options": [
      "40 Stück bei Division durch die Fixkosten in Hunderten",
      "12.000 Stück, weil die Fixkosten je Stück zu addieren sind",
      "400 Stück",
      "300 Stück bei Ansatz des Erlöses statt des Deckungsbeitrags"
    ],
    "correctOption": "C",
    "explanation": "12.000 Euro Fixkosten geteilt durch 30 Euro Deckungsbeitrag ergeben 400 Stück.",
    "companyEffect": "Die Schwelle ist eine Planungsgröße und keine Garantie, dass diese Absatzmenge erreicht wird.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-break-even",
    "correctAnswer": "400 Stück"
  },
  {
    "id": "wbq-rw-010",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-overhead-allocation",
    "scenario": "Ein Betrieb verteilt Maschinenkosten anhand der tatsächlich genutzten Maschinenstunden auf Produkte.",
    "question": "Warum sollte der gewählte Verteilungsschlüssel die Kostenverursachung möglichst gut abbilden?",
    "options": [
      "Maschinenkosten nach Stückzahl verteilen, obwohl Rüst- und Laufzeit stark abweichen",
      "So werden Produktkosten für Kalkulation und Entscheidungen aussagekräftiger",
      "Umsatzanteil als Schlüssel unabhängig von Maschinenstunden verwenden",
      "Gemeinkosten gleichmäßig auf jedes Produkt verteilen"
    ],
    "correctOption": "B",
    "explanation": "Ein ursachengerechter Schlüssel ordnet Gemeinkosten dem Ressourcenverbrauch plausibel zu.",
    "companyEffect": "Verbesserte Kostenzuordnung unterstützt realistischere Angebote und Produktentscheidungen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-overhead-allocation",
    "correctAnswer": "So werden Produktkosten für Kalkulation und Entscheidungen aussagekräftiger"
  },
  {
    "id": "wbq-rw-011",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cost-center",
    "scenario": "Die Kosten der Instandhaltung werden zunächst auf einer eigenen Kostenstelle gesammelt und später verteilt.",
    "question": "Welchen Zweck erfüllt diese Kostenstellenrechnung hauptsächlich?",
    "options": [
      "Kosten und Verantwortungsbereiche transparent erfassen",
      "Kosten der Instandhaltung direkt auf den jeweils größten Auftrag buchen",
      "Die Kostenstelle als eigenständigen Kostenträger mit Kundenumsatz führen",
      "Die Kosten nur nach tatsächlichen Rechnungszahlungen erfassen"
    ],
    "correctOption": "A",
    "explanation": "Kostenstellen bündeln Kosten nach betrieblichen Bereichen und machen Leistungen sowie Verantwortungen nachvollziehbar.",
    "companyEffect": "Die Leitung kann Instandhaltungskosten prüfen und ihre Verteilung auf nutzende Bereiche begründen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cost-center",
    "correctAnswer": "Kosten und Verantwortungsbereiche transparent erfassen"
  },
  {
    "id": "wbq-rw-012",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cost-object",
    "scenario": "Ein Kunde möchte die gesamten Kosten für einen individuell gefertigten Drehteilauftrag kennen.",
    "question": "Was ist in diesem Fall das Kalkulationsobjekt?",
    "options": [
      "Die Kostenstelle Fertigung als Kostenobjekt verwenden",
      "Den eingesetzten Mitarbeiter als einziges Kalkulationsobjekt betrachten",
      "Die gesamte Jahresproduktion statt des konkret nachgefragten Auftrags kalkulieren",
      "Der konkrete Kundenauftrag"
    ],
    "correctOption": "D",
    "explanation": "Ein Kostenobjekt ist die Leistung, der Auftrag oder das Produkt, dessen Kosten ermittelt werden.",
    "companyEffect": "Auftragsbezogene Kostenaufzeichnung ermöglicht spätere Margen- und Angebotsvergleiche.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cost-object",
    "correctAnswer": "Der konkrete Kundenauftrag"
  },
  {
    "id": "wbq-rw-013",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-budget-variance",
    "scenario": "Der tatsächliche Materialaufwand beträgt für die Ist-Ausbringung 1.100 Euro. Der flexible Sollwert wurde bereits auf dieselbe Ist-Ausbringung angepasst und beträgt 1.000 Euro.",
    "question": "Wie hoch ist die Materialaufwandsabweichung gegenüber dem flexiblen Sollwert für den Ist-Output?",
    "options": [
      "1.100 Euro ungünstig, weil der ganze Istaufwand die Abweichung bildet",
      "100 Euro günstig, weil der Istaufwand den Planwert nur gering übersteigt",
      "100 Euro ungünstig",
      "0 Euro, weil ein flexibler Kostenplan jede Abweichung ausgleicht"
    ],
    "correctOption": "C",
    "explanation": "Da der flexible Sollwert bereits für die Ist-Ausbringung gilt, wird der Istaufwand von 1.100 Euro mit 1.000 Euro verglichen. Die Überschreitung von 100 Euro ist ungünstig.",
    "companyEffect": "Die Leitung kann anschließend Preis- und Verbrauchsabweichung untersuchen, ohne die Mehrmenge erneut als Ursache einzurechnen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-budget-variance",
    "correctAnswer": "100 Euro ungünstig"
  },
  {
    "id": "wbq-rw-014",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-flexible-budget",
    "scenario": "Die tatsächliche Produktionsmenge liegt 20 Prozent über Plan; Materialkosten sind mengenabhängig.",
    "question": "Welcher Vergleichsmaßstab ist für die Materialkostenkontrolle am geeignetsten?",
    "options": [
      "Die Mehrproduktion als Kostensenkung ansetzen, auch wenn Materialverbrauch steigt",
      "Ein an die tatsächliche Beschäftigung angepasster flexibler Kostenplan",
      "Den ursprünglichen Plan unverändert mit dem Ist vergleichen und die Mengenabweichung separat ignorieren",
      "Den flexiblen Plan nur für Fixkosten anpassen"
    ],
    "correctOption": "B",
    "explanation": "Der flexible Plan berücksichtigt mengenabhängige Kosten bei der tatsächlichen Ausbringung.",
    "companyEffect": "So wird eine mengenbedingte Mehrbelastung nicht fälschlich als Ineffizienz bewertet.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-flexible-budget",
    "correctAnswer": "Ein an die tatsächliche Beschäftigung angepasster flexibler Kostenplan"
  },
  {
    "id": "wbq-rw-015",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cash-flow",
    "scenario": "Ein profitabler Betrieb kauft eine Maschine bar und zieht gleichzeitig ältere Forderungen ein.",
    "question": "Welcher Bericht zeigt die Mittelzu- und -abflüsse nach Tätigkeitsbereichen?",
    "options": [
      "Kapitalflussrechnung",
      "Die Erfolgsrechnung nach Umsatzerlösen und Aufwendungen",
      "Den BAB zur Aufteilung der Gemeinkosten",
      "Die Bilanz zu Vermögen und Finanzierung am Stichtag"
    ],
    "correctOption": "A",
    "explanation": "Die Kapitalflussrechnung erläutert Zahlungsströme aus laufender Tätigkeit, Investitionen und Finanzierung.",
    "companyEffect": "Sie hilft zu beurteilen, ob Betrieb und Investitionen zahlungsseitig tragfähig finanziert sind.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cash-flow",
    "correctAnswer": "Kapitalflussrechnung"
  },
  {
    "id": "wbq-rw-016",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-working-capital",
    "scenario": "Forderungen wachsen schneller als der Umsatz, während Lieferanten kürzere Zahlungsziele setzen.",
    "question": "Welche kurzfristige Finanzierungswirkung ist zu erwarten?",
    "options": [
      "Der Mehrumsatz gleicht die frühere Auszahlung an Lieferanten zwingend aus",
      "Kurzere Lieferantenziele senken den Finanzierungsbedarf",
      "Mehr Forderungen verbessern die Liquidität, weil sie Vermögen darstellen",
      "Der Bedarf an Betriebskapital steigt"
    ],
    "correctOption": "D",
    "explanation": "Mehr Geld ist in Forderungen gebunden, während Lieferanten früher bezahlt werden müssen.",
    "companyEffect": "Der Betrieb kann Forderungseinzug verbessern oder rechtzeitig Finanzierungsspielraum organisieren.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-working-capital",
    "correctAnswer": "Der Bedarf an Betriebskapital steigt"
  },
  {
    "id": "wbq-rw-017",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-liquidity-ratio",
    "scenario": "Umlaufvermögen beträgt 60.000 Euro, kurzfristige Verbindlichkeiten 30.000 Euro.",
    "question": "Wie hoch ist die Liquidität dritten Grades (Current Ratio) nach dieser vereinfachten Definition?",
    "options": [
      "30.000, weil die Differenz der beiden Bilanzposten maßgeblich ist",
      "2,0 und damit eine sichere Zahlungsfähigkeit unabhängig von Bestandsqualität",
      "2,0",
      "0,5, weil Verbindlichkeiten durch Umlaufvermögen geteilt werden"
    ],
    "correctOption": "C",
    "explanation": "60.000 Euro geteilt durch 30.000 Euro ergeben eine Kennzahl von 2,0.",
    "companyEffect": "Die Kennzahl zeigt eine grobe Deckung kurzfristiger Schulden; Zusammensetzung und Verfügbarkeit der Vermögenswerte bleiben wichtig.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-liquidity-ratio",
    "correctAnswer": "2,0"
  },
  {
    "id": "wbq-rw-018",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-equity-ratio",
    "scenario": "Die Bilanzsumme beträgt 200.000 Euro; das Eigenkapital beläuft sich auf 50.000 Euro.",
    "question": "Wie hoch ist die Eigenkapitalquote?",
    "options": [
      "75 Prozent, weil die Fremdfinanzierung den Rest ausmacht",
      "25 Prozent",
      "4 Prozent, weil Eigenkapital durch Verbindlichkeiten geteilt wird",
      "25 Prozent und damit bedeutet, dass ein Viertel der Bilanzsumme sofort liquide ist"
    ],
    "correctOption": "B",
    "explanation": "50.000 Euro Eigenkapital geteilt durch 200.000 Euro Bilanzsumme ergeben 25 Prozent.",
    "companyEffect": "Die Quote beschreibt den Eigenfinanzierungsanteil, aber nicht die sofort verfügbare Liquidität.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-equity-ratio",
    "correctAnswer": "25 Prozent"
  },
  {
    "id": "wbq-rw-019",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-inventory-turnover",
    "scenario": "Der jährliche Materialverbrauch beträgt 120.000 Euro; der durchschnittliche Lagerbestand ist 20.000 Euro wert.",
    "question": "Wie oft schlägt der Vorratsbestand nach dieser vereinfachten Kennzahl im Jahr um?",
    "options": [
      "Sechsmal",
      "Drei Umschläge, wenn der Bestand nur zur Hälfte durchschnittlich genutzt wird",
      "Sechsmal pro Monat, weil der Jahresverbrauch durch Bestand geteilt wird",
      "20 Prozent, weil Bestand durch Jahresverbrauch gerechnet wird"
    ],
    "correctOption": "A",
    "explanation": "Jahresverbrauch geteilt durch Durchschnittsbestand ergibt einen Lagerumschlag von sechs.",
    "companyEffect": "Die Kennzahl unterstützt die Bestandssteuerung und muss zusammen mit Lieferfähigkeit und Fehlmengenrisiko bewertet werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-inventory-turnover",
    "correctAnswer": "Sechsmal"
  },
  {
    "id": "wbq-rw-020",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-receivables-days",
    "scenario": "Der Jahresumsatz auf Ziel beträgt 365.000 Euro; die durchschnittlichen Forderungen liegen bei 30.000 Euro.",
    "question": "Wie viele Forderungstage ergeben sich näherungsweise bei einer 365-Tage-Rechnung?",
    "options": [
      "30 Tage aus Umsatz geteilt durch Forderungen mal 365 berechnen",
      "Rund 12 Tage, wenn nur ein Monat des Jahresumsatzes einbezogen wird",
      "Rund 30 Tage und damit sind alle Rechnungen spätestens nach 30 Tagen beglichen",
      "30 Tage"
    ],
    "correctOption": "D",
    "explanation": "30.000 geteilt durch 365.000 und multipliziert mit 365 ergibt rund 30 Tage.",
    "companyEffect": "Steigende Forderungstage können auf spätere Zahlungseingänge und eine längere Kapitalbindung hinweisen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-receivables-days",
    "correctAnswer": "30 Tage"
  },
  {
    "id": "wbq-rw-021",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-accruals",
    "scenario": "Der Betrieb verbraucht im Dezember Strom; die Rechnung geht erst im Januar ein.",
    "question": "Welcher Periode ist der Dezemberverbrauch grundsätzlich als Aufwand zuzuordnen?",
    "options": [
      "Dem Zahlungsmonat unabhängig vom Zeitpunkt des Verbrauchs",
      "Dem Dezember nur dann, wenn die Rechnung noch im selben Jahr bezahlt wird",
      "Dem Dezember als Verbrauchsperiode",
      "Dem Januar, weil der Rechnungseingang die Periode bestimmt"
    ],
    "correctOption": "C",
    "explanation": "Bei periodengerechter Abgrenzung wird der Aufwand der Periode des Verbrauchs zugeordnet, vorbehaltlich der anzuwendenden Regeln.",
    "companyEffect": "Ein korrekter Monatsabschluss macht Betriebsergebnisse vergleichbarer.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-accruals",
    "correctAnswer": "Dem Dezember als Verbrauchsperiode"
  },
  {
    "id": "wbq-rw-022",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-provision",
    "scenario": "Zum Abschlussstichtag besteht eine wahrscheinliche Verpflichtung aus einem Rechtsstreit; die Höhe lässt sich angemessen schätzen.",
    "question": "Welche Bilanzierungsfrage muss die Geschäftsführung prüfen?",
    "options": [
      "Den geschätzten Betrag als Aufwand und zusätzlich als Verbindlichkeit doppelt erfassen",
      "Ob die Ansatzkriterien für eine Rückstellung erfüllt sind",
      "Eine Rückstellung für jeden möglichen Rechtsstreit unabhängig von Wahrscheinlichkeit oder Schätzbarkeit",
      "Eine Verbindlichkeit erst nach endgültigem Urteil prüfen"
    ],
    "correctOption": "B",
    "explanation": "Bei einer bestehenden Verpflichtung mit wahrscheinlichem Abfluss und verlässlich schätzbarer Höhe kann eine Rückstellung erforderlich sein.",
    "companyEffect": "Die frühzeitige Abbildung verhindert, dass Ergebnis und Risikolage zu günstig dargestellt werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-provision",
    "correctAnswer": "Ob die Ansatzkriterien für eine Rückstellung erfüllt sind"
  },
  {
    "id": "wbq-rw-023",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-bookkeeping",
    "scenario": "Ein Kaufmann soll Geschäftsvorfälle samt Belegen nachvollziehbar dokumentieren.",
    "question": "Welche Buchführungspraxis unterstützt eine verlässliche und prüfbare Aufzeichnung?",
    "options": [
      "Vollständige, geordnete und beleggestützte Erfassung",
      "Nur die Bilanzsumme und den Kassenbestand am Jahresende aufzeichnen",
      "Belege allein speichern, ohne Geschäftsvorfälle systematisch zu erfassen",
      "Die Buchführung erst nach Aufforderung durch das Finanzamt beginnen"
    ],
    "correctOption": "A",
    "explanation": "HGB § 238 verlangt Bücher, aus denen Geschäftsvorfälle und Unternehmenslage nach den Grundsätzen ordnungsmäßiger Buchführung ersichtlich sind.",
    "companyEffect": "Nachvollziehbare Unterlagen erleichtern Jahresabschluss, Steuerarbeit und interne Kontrollen.",
    "sourceRef": "LAW-HGB-238",
    "sourceKind": "law",
    "tooltipKey": "rw-bookkeeping",
    "correctAnswer": "Vollständige, geordnete und beleggestützte Erfassung"
  },
  {
    "id": "wbq-rw-024",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-investment-calculation",
    "scenario": "Eine Maschine kostet 24.000 Euro und soll jährlich 8.000 Euro an zahlungswirksamen Betriebskosten einsparen.",
    "question": "Wie lang ist die einfache Amortisationsdauer, wenn Abzinsung und weitere Zahlungsströme unberücksichtigt bleiben?",
    "options": [
      "2 Jahre, weil die jährliche Einsparung durch die Investition geteilt wird",
      "3 Jahre, wobei der Zeitwert des Geldes bereits berücksichtigt ist",
      "8 Jahre, weil die Einsparung als Anschaffungskosten gilt",
      "Drei Jahre"
    ],
    "correctOption": "D",
    "explanation": "24.000 Euro Investition geteilt durch 8.000 Euro jährliche Einsparung ergeben drei Jahre.",
    "companyEffect": "Die einfache Amortisation ist ein grober Liquiditätsindikator und blendet Zeitwert sowie spätere Rückflüsse aus.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-investment-calculation",
    "correctAnswer": "Drei Jahre"
  },
  {
    "id": "wbq-rw-025",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-relevant-cost",
    "scenario": "Für einen bereits fertiggestellten Prototyp fielen 2.000 Euro Entwicklungskosten an; dieser Betrag ist nicht mehr rückholbar.",
    "question": "Wie sollten diese bereits entstandenen Kosten in eine neue Annahmeentscheidung einfließen?",
    "options": [
      "Den Prototyp nur dann weiterführen, wenn die früheren Entwicklungskosten zurückverdient werden",
      "Die vergangenen Kosten auf alle künftigen Aufträge als variable Kosten verteilen",
      "Als versunkene Kosten grundsätzlich nicht als künftig veränderbare Entscheidungskosten",
      "Die bereits gezahlten 2.000 Euro als künftig vermeidbare Ausgabe behandeln"
    ],
    "correctOption": "C",
    "explanation": "Versunkene Kosten sind bereits angefallen und ändern sich durch die aktuelle Wahl nicht.",
    "companyEffect": "Die Entscheidung sollte sich auf künftige zusätzliche Erträge und Kosten konzentrieren.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-relevant-cost",
    "correctAnswer": "Als versunkene Kosten grundsätzlich nicht als künftig veränderbare Entscheidungskosten"
  },
  {
    "id": "wbq-rt-001",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-contract-offer",
    "scenario": "Ein Fertigungsbetrieb bietet 20 Halter zu 4.000 Euro an; das Angebot gilt ausdrücklich bis Freitag.",
    "question": "Welche Aussage zu Bindung und Vertragsschluss passt zum befristeten Angebot?",
    "options": [
      "Der Vertrag ist bereits mit Zugang des Angebots geschlossen; eine Annahme dient nur noch als Nachweis",
      "Die Frist bindet nur den Kunden; der Betrieb kann das Angebot bis Freitag frei widerrufen",
      "Der Betrieb ist grundsätzlich bis Freitag an den Antrag gebunden; ein Vertrag entsteht erst bei rechtzeitiger Annahme durch den Kunden",
      "Der Kunde kann auch nach Freitag annehmen, solange der Betrieb die Vorrichtung noch nicht anderweitig verkauft hat"
    ],
    "correctOption": "C",
    "explanation": "Ein befristeter Antrag bindet den Anbieter grundsätzlich bis zum Fristablauf (§ 145, § 148 BGB). Der Vertrag kommt durch rechtzeitige Annahme zustande; eine verspätete Annahme gilt grundsätzlich als neuer Antrag (§ 150 Abs. 1 BGB).",
    "companyEffect": "Eine klare Angebotsfrist schafft Planungssicherheit für Kapazität und Material; verspätete Annahmen sollten als neue Verhandlung behandelt werden.",
    "sourceRef": "LAW-BGB-145;LAW-BGB-148;LAW-BGB-150",
    "sourceKind": "law",
    "tooltipKey": "rt-contract-offer",
    "correctAnswer": "Der Betrieb ist grundsätzlich bis Freitag an den Antrag gebunden; ein Vertrag entsteht erst bei rechtzeitiger Annahme durch den Kunden"
  },
  {
    "id": "wbq-rt-002",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-contract-acceptance",
    "scenario": "Ein Kunde nimmt ein bis Freitag befristetes Angebot am Donnerstag ohne Änderungen an.",
    "question": "Welche Folge hat eine rechtzeitige, inhaltlich übereinstimmende Annahme grundsätzlich?",
    "options": [
      "Der Vertrag kommt erst mit der ersten Zahlung des Kunden zustande",
      "Der Vertrag kommt zustande",
      "Eine Annahme nach Fristablauf bindet den Anbieter stets rückwirkend",
      "Eine inhaltlich passende Antwort ist auch dann rechtzeitig, wenn sie nach Ablauf der Frist zugeht"
    ],
    "correctOption": "B",
    "explanation": "Eine fristgerechte Annahme ohne Änderungen führt grundsätzlich zum Vertragsschluss.",
    "companyEffect": "Der Betrieb sollte Kapazität und Material für die vereinbarten Pflichten einplanen.",
    "sourceRef": "LAW-BGB-147",
    "sourceKind": "law",
    "tooltipKey": "rt-contract-acceptance",
    "correctAnswer": "Der Vertrag kommt zustande"
  },
  {
    "id": "wbq-rt-003",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-counteroffer",
    "scenario": "Auf ein Angebot über 4.000 Euro antwortet der Kunde: „Einverstanden, wenn Sie in der halben Zeit liefern.“",
    "question": "Wie ist diese Antwort nach den Regeln über die Annahme mit Änderungen grundsätzlich einzuordnen?",
    "options": [
      "Als Ablehnung verbunden mit einem neuen Antrag",
      "Die Lieferzeit ist eine Nebenabrede; ihre Änderung lässt die Annahme unberührt",
      "Eine geänderte Annahme gilt als Annahme, wenn der Kunde den Preis akzeptiert",
      "Der ursprüngliche Antrag bleibt verbindlich, bis der Verkäufer der Änderung widerspricht"
    ],
    "correctOption": "A",
    "explanation": "Eine Annahme unter Änderungen gilt grundsätzlich als Ablehnung verbunden mit einem neuen Antrag.",
    "companyEffect": "Der Betrieb muss die geänderte Lieferfrist prüfen und die neuen Bedingungen ausdrücklich annehmen oder ablehnen.",
    "sourceRef": "LAW-BGB-150",
    "sourceKind": "law",
    "tooltipKey": "rt-counteroffer",
    "correctAnswer": "Als Ablehnung verbunden mit einem neuen Antrag"
  },
  {
    "id": "wbq-rt-004",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-purchase-contract",
    "scenario": "Ein Unternehmen verkauft einen gebrauchten Maschinenschraubstock an einen anderen Betrieb.",
    "question": "Welche Hauptpflicht hat der Verkäufer aus dem Kaufvertrag?",
    "options": [
      "Der Käufer muss die Sache übernehmen, aber erst nach einer erfolgreichen Weiterveräußerung zahlen",
      "Der Verkäufer muss neben der Sache immer auch eine Einweisung und spätere Wartung leisten",
      "Mit Übergabe allein geht das Eigentum in jedem Fall über, auch wenn vereinbartes Eigentum vorbehalten bleibt",
      "Die Sache übergeben und das Eigentum wie vereinbart verschaffen"
    ],
    "correctOption": "D",
    "explanation": "Nach BGB § 433 muss der Verkäufer die Sache übergeben und Eigentum verschaffen; der Käufer muss zahlen und abnehmen.",
    "companyEffect": "Artikel, Zustand, Preis und Übergabe sollten nachvollziehbar vereinbart werden.",
    "sourceRef": "LAW-BGB-433",
    "sourceKind": "law",
    "tooltipKey": "rt-purchase-contract",
    "correctAnswer": "Die Sache übergeben und das Eigentum wie vereinbart verschaffen"
  },
  {
    "id": "wbq-rt-005",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-work-contract",
    "scenario": "Ein Betrieb verpflichtet sich, einen nach Kundenzeichnung bestimmten beweglichen Halter herzustellen und an den Kunden zu liefern; der Kunde stellt das Rohmaterial.",
    "question": "Welche Aussage grenzt den Werklieferungsvertrag nach BGB § 650 zutreffend ab?",
    "options": [
      "Es gilt ausschließlich Werkvertragsrecht, weil der Kunde das Material stellt",
      "Es gilt stets nur Kaufrecht nach § 433, ohne Rücksicht auf eine Herstellungspflicht",
      "§ 650 wendet grundsätzlich Kaufrecht auf die Lieferung der herzustellenden beweglichen Sache an; bei einem durch Kundenstoff verursachten Mangel ist zusätzlich § 442 Abs. 1 Satz 1 zu beachten",
      "§ 650 gilt nur, wenn der Unternehmer selbst das Material beschafft"
    ],
    "correctOption": "C",
    "explanation": "§ 650 BGB erfasst Verträge über die Lieferung herzustellender oder zu erzeugender beweglicher Sachen. Die Gestellung des Materials ändert diese Abgrenzung nicht allein; bei einem auf Kundenstoff zurückzuführenden Mangel enthält § 650 eine zusätzliche Regel zu § 442 Abs. 1 Satz 1.",
    "companyEffect": "Die Vertragskalkulation und Mängelbearbeitung sollten Herstellung, Lieferung und Herkunft des Materials getrennt dokumentieren.",
    "sourceRef": "LAW-BGB-650;LAW-BGB-442",
    "sourceKind": "law",
    "tooltipKey": "rt-work-contract",
    "correctAnswer": "§ 650 wendet grundsätzlich Kaufrecht auf die Lieferung der herzustellenden beweglichen Sache an; bei einem durch Kundenstoff verursachten Mangel ist zusätzlich § 442 Abs. 1 Satz 1 zu beachten"
  },
  {
    "id": "wbq-rt-006",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-acceptance",
    "scenario": "Der Besteller prüft ein fertiggestelltes Werk und erklärt, dass es im Wesentlichen der vereinbarten Beschaffenheit entspricht.",
    "question": "Was bedeutet die Abnahme nach BGB § 640 grundsätzlich?",
    "options": [
      "Sie ist eine bloße Empfangsbestätigung und enthält keine Billigung des Werks",
      "Der Besteller billigt das Werk als im Wesentlichen vertragsgemäß; wegen unwesentlicher Mängel darf er die Abnahme nicht verweigern",
      "Sie beseitigt unabhängig von Kenntnis und Vorbehalt sämtliche Mängelrechte",
      "Der Besteller muss erst abnehmen, wenn keinerlei geringfügige Abweichung mehr vorliegt"
    ],
    "correctOption": "B",
    "explanation": "Die Abnahme ist mehr als die tatsächliche Entgegennahme: Der Besteller erklärt grundsätzlich die Billigung des vertragsgemäß hergestellten Werks. § 640 Abs. 1 erlaubt keine Verweigerung allein wegen unwesentlicher Mängel.",
    "companyEffect": "Ein dokumentierter Abnahmestatus klärt den Leistungsabschluss; bei bekannten Mängeln sollte ein Vorbehalt ausdrücklich festgehalten werden.",
    "sourceRef": "LAW-BGB-640",
    "sourceKind": "law",
    "tooltipKey": "rt-acceptance",
    "correctAnswer": "Der Besteller billigt das Werk als im Wesentlichen vertragsgemäß; wegen unwesentlicher Mängel darf er die Abnahme nicht verweigern"
  },
  {
    "id": "wbq-rt-007",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-defect-remedy",
    "scenario": "Ein gekauftes Bauteil weist einen Mangel auf, der bereits bei Übergabe bestand.",
    "question": "Welche erste Prüfung ist für den Käufer sinnvoll?",
    "options": [
      "Vertrag, Mangel, Zeitpunkt und die gesetzlichen Rechte auf Nacherfüllung prüfen",
      "Der Käufer kann bei jedem Mangel sofort den gesamten Kaufpreis mindern, ohne Nacherfüllung zu prüfen",
      "Nacherfüllung bedeutet stets Ersatzlieferung; Reparatur ist ausgeschlossen",
      "Ein Mangel begründet nur dann Rechte, wenn der Verkäufer ihn vorsätzlich verursacht hat"
    ],
    "correctOption": "A",
    "explanation": "Bei einem Sachmangel kommen die gesetzlichen Mängelrechte in Betracht; Art und Ablauf sind am Vertrag und Sachverhalt zu prüfen.",
    "companyEffect": "Technische Dokumentation und zeitnahe Kommunikation unterstützen eine sachgerechte Nacherfüllung.",
    "sourceRef": "LAW-BGB-437;LAW-BGB-439-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-defect-remedy",
    "correctAnswer": "Vertrag, Mangel, Zeitpunkt und die gesetzlichen Rechte auf Nacherfüllung prüfen"
  },
  {
    "id": "wbq-rt-008",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-contract-record",
    "scenario": "Nach einer telefonischen Bestellung streiten Kunde und Werkstatt über die vereinbarte Toleranz.",
    "question": "Welche vorbeugende Maßnahme hätte die Beweislage am stärksten verbessert?",
    "options": [
      "Die Zeichnung nach Fertigungsbeginn bestätigen, ohne Revisionsstand oder Toleranzen zu nennen",
      "Nur die mündlich vereinbarte Toleranz nachträglich in den Auftrag aufnehmen",
      "Eine allgemeine Auftragsbestätigung ohne konkrete Spezifikation als vollständigen Nachweis behandeln",
      "Spezifikation, Preis, Termin und Änderungen schriftlich bestätigen"
    ],
    "correctOption": "D",
    "explanation": "Eine nachvollziehbare Dokumentation erleichtert den Nachweis des vereinbarten Leistungsumfangs.",
    "companyEffect": "Klare Unterlagen verringern Nacharbeit und Streit über Abnahme und Vergütung.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-contract-record",
    "correctAnswer": "Spezifikation, Preis, Termin und Änderungen schriftlich bestätigen"
  },
  {
    "id": "wbq-rt-009",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-consumer-business",
    "scenario": "Ein Betrieb verkauft einen Schraubstock an eine Privatperson zur überwiegend privaten Nutzung.",
    "question": "Warum muss der Betrieb prüfen, ob ein Verbrauchervertrag vorliegt?",
    "options": [
      "Verbraucherstatus allein anhand der Rechtsform des Verkäufers bestimmen",
      "Verbraucherschutz nur bei Zahlung in bar prüfen",
      "Verbraucherschutz kann zusätzliche Informationspflichten und zwingende Rechte begründen",
      "Die Privatperson als Unternehmer behandeln, weil sie eine Rechnung verlangt"
    ],
    "correctOption": "C",
    "explanation": "Bei Verträgen mit Verbrauchern können besondere gesetzliche Schutzregeln gelten; die Einordnung hängt vom Sachverhalt ab.",
    "companyEffect": "Eine korrekte Kundeneinordnung hilft, Bestellablauf, Informationen und Vertragsbedingungen rechtssicher zu gestalten.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-consumer-business",
    "correctAnswer": "Verbraucherschutz kann zusätzliche Informationspflichten und zwingende Rechte begründen"
  },
  {
    "id": "wbq-rt-010",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-limitation",
    "scenario": "Ein Kunde meldet lange nach Lieferung einen angeblichen Mangel.",
    "question": "Was sollte das Unternehmen vor einer Ablehnung des Anspruchs prüfen?",
    "options": [
      "Eine Mängelrüge verlängert automatisch jede Verjährungsfrist um die Dauer der Prüfung",
      "Vertragsart, Zeitpunkte, Verjährung, Mangel und mögliche Hemmungstatbestände",
      "Jeder Mangelanspruch verjährt unabhängig von Vertragsart und Fristbeginn nach einem Jahr",
      "Die Verjährung beginnt in jedem Fall mit dem Datum des Angebots"
    ],
    "correctOption": "B",
    "explanation": "Verjährungsfristen und ihre Wirkung sind abhängig von Vertragsart, Sachverhalt und möglichen Hemmungs- oder Neubeginnstatbeständen.",
    "companyEffect": "Eine dokumentierte Einzelfallprüfung vermeidet unnötige Zahlungen und unberechtigte Zurückweisungen.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-limitation",
    "correctAnswer": "Vertragsart, Zeitpunkte, Verjährung, Mangel und mögliche Hemmungstatbestände"
  },
  {
    "id": "wbq-rt-011",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-liability-form",
    "scenario": "Eine GmbH schließt im eigenen Namen einen Liefervertrag ab.",
    "question": "Welche Aussage beschreibt ihre Rechtspersönlichkeit zutreffend?",
    "options": [
      "Die GmbH kann selbst Trägerin von Rechten und Pflichten sein",
      "Eine GmbH kann Verträge nur durch sämtliche Gesellschafter gemeinsam abschließen",
      "Die GmbH ist eine eigene juristische Person, aber ihr Vermögen gehört den Gesellschaftern anteilig",
      "Eine GmbH darf Rechte halten, aber keine Verbindlichkeiten eingehen"
    ],
    "correctOption": "A",
    "explanation": "GmbHG § 13 bestimmt die GmbH als juristische Person mit eigenen Rechten, Pflichten und Gesellschaftsvermögen.",
    "companyEffect": "Verträge und Vermögensgegenstände sollten der Gesellschaft und nicht irrtümlich einem Gesellschafter zugeordnet werden.",
    "sourceRef": "LAW-GMBHG-13",
    "sourceKind": "law",
    "tooltipKey": "rt-liability-form",
    "correctAnswer": "Die GmbH kann selbst Trägerin von Rechten und Pflichten sein"
  },
  {
    "id": "wbq-rt-012",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-limited-liability",
    "scenario": "Eine GmbH kann eine Lieferantenrechnung nicht begleichen; eine Person hält 60 Prozent der Geschäftsanteile.",
    "question": "Welche Aussage zur Haftung trifft grundsätzlich zu?",
    "options": [
      "Die Gesellschafter haften stets persönlich bis zur Höhe ihrer Einlage für jede offene Rechnung",
      "Die GmbH haftet mit Gesellschaftsvermögen und Gesellschafter immer zusätzlich privat",
      "Mitglieder sind nie persönlich haftbar, auch nicht bei eigener Bürgschaft oder Pflichtverletzung",
      "Für Gesellschaftsschulden haftet grundsätzlich das Gesellschaftsvermögen; persönliche Haftung entsteht nicht allein aus der Beteiligung"
    ],
    "correctOption": "D",
    "explanation": "Nach GmbHG § 13 haftet grundsätzlich die Gesellschaft mit ihrem Vermögen; persönliche Haftung kann sich aus anderen Rechtsgründen ergeben.",
    "companyEffect": "Gesellschafter sollten Beteiligung, persönliche Bürgschaften und sonstige Haftungsgründe getrennt beurteilen.",
    "sourceRef": "LAW-GMBHG-13",
    "sourceKind": "law",
    "tooltipKey": "rt-limited-liability",
    "correctAnswer": "Für Gesellschaftsschulden haftet grundsätzlich das Gesellschaftsvermögen; persönliche Haftung entsteht nicht allein aus der Beteiligung"
  },
  {
    "id": "wbq-rt-013",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-taxable-supply",
    "scenario": "Ein deutscher Betrieb fertigt gegen Entgelt ein Bauteil für einen Kunden.",
    "question": "Welche steuerliche Prüfung ist für die Umsatzsteuer zunächst erforderlich?",
    "options": [
      "Eine innerdeutsche Lieferung ist immer steuerfrei, wenn beide Parteien Unternehmen sind",
      "Eine steuerbare Leistung ist automatisch steuerpflichtig, ohne mögliche Befreiung zu prüfen",
      "Ob ein steuerbarer Umsatz vorliegt und welche Befreiung oder Sonderregelung greift",
      "Jede Zahlung eines Kunden ist steuerbar, unabhängig von Leistung und Leistungsort"
    ],
    "correctOption": "C",
    "explanation": "Ausgangspunkt ist die Prüfung eines steuerbaren Umsatzes im Inland; anschließend sind Befreiungen und Sonderregeln zu berücksichtigen.",
    "companyEffect": "Die richtige Einordnung ermöglicht korrekte Rechnungsstellung und Steuererklärung.",
    "sourceRef": "LAW-USTG-1",
    "sourceKind": "law",
    "tooltipKey": "rt-taxable-supply",
    "correctAnswer": "Ob ein steuerbarer Umsatz vorliegt und welche Befreiung oder Sonderregelung greift"
  },
  {
    "id": "wbq-rt-014",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-vat-rate",
    "scenario": "Ein inländischer steuerpflichtiger Umsatz fällt weder unter einen ermäßigten Satz noch unter eine besondere Regelung.",
    "question": "Welcher Regelsteuersatz gilt grundsätzlich nach UStG § 12 Abs. 1?",
    "options": [
      "Ein Umsatz im Inland ist stets mit 7 Prozent zu versteuern",
      "19 Prozent",
      "19 Prozent gelten auch dann, wenn ein gesetzlich ermäßigter Satz oder eine Befreiung einschlägig ist",
      "Der Regelsteuersatz richtet sich nach dem Sitz des Kunden, nicht nach dem Umsatz"
    ],
    "correctOption": "B",
    "explanation": "UStG § 12 Abs. 1 sieht grundsätzlich 19 Prozent vor; für bestimmte Umsätze gilt ein ermäßigter Satz.",
    "companyEffect": "Die Rechnung muss den für die konkrete Leistung zutreffenden Steuersatz ausweisen.",
    "sourceRef": "LAW-USTG-12",
    "sourceKind": "law",
    "tooltipKey": "rt-vat-rate",
    "correctAnswer": "19 Prozent"
  },
  {
    "id": "wbq-rt-015",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-invoice",
    "scenario": "Ein Unternehmen stellt einem anderen Unternehmen eine Rechnung über eine steuerpflichtige inländische Leistung aus.",
    "question": "Wozu dient die Prüfung der gesetzlich erforderlichen Rechnungsangaben?",
    "options": [
      "Sie sichert die steuerliche und geschäftliche Nachvollziehbarkeit der Rechnung",
      "Die Rechnung muss in jedem Fall die Steuernummer des Kunden enthalten",
      "Eine korrekte Rechnung macht die zugrunde liegende Leistung automatisch steuerpflichtig",
      "Für B2B-Rechnungen sind Pflichtangaben entbehrlich, sobald der Kunde vorsteuerabzugsberechtigt ist"
    ],
    "correctOption": "A",
    "explanation": "UStG § 14 regelt Rechnungsanforderungen; die konkret nötigen Angaben richten sich nach dem Einzelfall.",
    "companyEffect": "Vollständige Rechnungen erleichtern Zahlung, Vorsteuerprüfung und spätere Korrekturen.",
    "sourceRef": "LAW-USTG-14",
    "sourceKind": "law",
    "tooltipKey": "rt-invoice",
    "correctAnswer": "Sie sichert die steuerliche und geschäftliche Nachvollziehbarkeit der Rechnung"
  },
  {
    "id": "wbq-rt-016",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-input-vat",
    "scenario": "Ein umsatzsteuerpflichtiger Betrieb kauft Material für seine steuerpflichtige Produktion und erhält eine ordnungsgemäße Rechnung.",
    "question": "Was muss er für einen Vorsteuerabzug prüfen?",
    "options": [
      "Die Vorsteuer aus jeder betrieblichen Ausgabe ist unabhängig von Leistung und Beleg abzugsfähig",
      "Der Vorsteuerabzug entsteht bereits mit der Bestellung, bevor ein Leistungsbezug vorliegt",
      "Der Bruttobetrag wird als Vorsteuer abgezogen und die Umsatzsteuer zusätzlich als Aufwand erfasst",
      "Ob die gesetzlichen Voraussetzungen im konkreten Fall erfüllt sind"
    ],
    "correctOption": "D",
    "explanation": "Der Vorsteuerabzug setzt die gesetzlichen Bedingungen und geeignete Nachweise voraus.",
    "companyEffect": "Berechtigte Vorsteuer mindert die Zahllast; nicht belegte Abzüge können zu Korrekturen führen.",
    "sourceRef": "LAW-USTG-15",
    "sourceKind": "law",
    "tooltipKey": "rt-input-vat",
    "correctAnswer": "Ob die gesetzlichen Voraussetzungen im konkreten Fall erfüllt sind"
  },
  {
    "id": "wbq-rt-017",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-vat-return",
    "scenario": "Die Finanzabteilung erstellt die Umsatzsteuer-Voranmeldung aus Verkaufs- und Einkaufsbelegen.",
    "question": "Welche Vorgehensweise erhöht die Verlässlichkeit der Meldung?",
    "options": [
      "Die Zahllast ergibt sich aus der Summe aller Eingangsrechnungen",
      "Eine Voranmeldung kann aus dem Bankumsatz erstellt werden, ohne Steuersätze oder Gutschriften abzustimmen",
      "Umsätze, Steuersätze, Vorsteuer und Belege miteinander abstimmen",
      "Die Vorsteuer ist ohne Prüfung jeder Rechnung vollständig abzugsfähig"
    ],
    "correctOption": "C",
    "explanation": "Die Meldung hängt von einer richtigen Zuordnung der Umsätze und belegten Vorsteuerbeträge ab.",
    "companyEffect": "Eine Abstimmung senkt das Risiko von Fehlmeldungen und späteren Berichtigungen.",
    "sourceRef": "LAW-USTG-16-DIRECT;LAW-USTG-18-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-vat-return",
    "correctAnswer": "Umsätze, Steuersätze, Vorsteuer und Belege miteinander abstimmen"
  },
  {
    "id": "wbq-rt-018",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-tax-deadline",
    "scenario": "Die Geschäftsführung plant die Abgabe der betrieblichen Steuererklärungen.",
    "question": "Woraus sollte sie die jeweils geltende Abgabefrist ermitteln?",
    "options": [
      "Eine Fristverlängerung ersetzt die Pflicht, den Erklärungstermin zu dokumentieren",
      "Aus den Vorschriften der Abgabenordnung und wirksamen Fristverlängerungen",
      "Die Frist ist für alle Steuerarten und Veranlagungszeiträume identisch",
      "Eine Beauftragung eines Steuerberaters verlängert jede Frist automatisch und ohne weitere Bedingungen"
    ],
    "correctOption": "B",
    "explanation": "AO § 149 enthält allgemeine Regeln zu Steuererklärungsfristen und sieht bestimmte Verlängerungen vor.",
    "companyEffect": "Ein Fristenkalender verringert Verspätungsrisiken und erleichtert die Arbeitsplanung.",
    "sourceRef": "LAW-AO-149",
    "sourceKind": "law",
    "tooltipKey": "rt-tax-deadline",
    "correctAnswer": "Aus den Vorschriften der Abgabenordnung und wirksamen Fristverlängerungen"
  },
  {
    "id": "wbq-rt-019",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-bookkeeping-duty",
    "scenario": "Die Geschäftsführung möchte nur Bankbewegungen aufbewahren und alle Rechnungen vernichten.",
    "question": "Was ist dabei das zentrale buchführungsrechtliche Problem?",
    "options": [
      "Die Bücher müssen Geschäftsvorfälle und Unternehmenslage nachvollziehbar abbilden",
      "Der Bankkontoauszug ersetzt Bücher und Belege, solange der Saldo stimmt",
      "Eine vollständige Belegsammlung genügt, auch wenn Geschäftsvorfälle nicht systematisch erfasst werden",
      "Dokumentation kann auf Jahresabschlusswerte beschränkt werden, wenn der Betrieb klein ist"
    ],
    "correctOption": "A",
    "explanation": "HGB § 238 verlangt Bücher, die Geschäftsvorfälle und Unternehmenslage nach den Grundsätzen ordnungsmäßiger Buchführung erkennen lassen.",
    "companyEffect": "Unvollständige Aufzeichnungen erschweren Abschluss, Steuererklärungen und interne Kontrollen.",
    "sourceRef": "LAW-HGB-238",
    "sourceKind": "law",
    "tooltipKey": "rt-bookkeeping-duty",
    "correctAnswer": "Die Bücher müssen Geschäftsvorfälle und Unternehmenslage nachvollziehbar abbilden"
  },
  {
    "id": "wbq-rt-020",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-holiday-minimum",
    "scenario": "Eine Vollzeitkraft arbeitet regelmäßig an fünf Tagen pro Woche.",
    "question": "Wie viele Arbeitstage Mindesturlaub ergeben sich grundsätzlich aus BUrlG § 3 bei dieser Fünftagewoche?",
    "options": [
      "24 Werktage entsprechen bei einer Fünftagewoche 24 Arbeitstagen",
      "Der gesetzliche Mindesturlaub wird für eine Fünftagewoche auf 16 Arbeitstage umgerechnet",
      "Der Anspruch hängt ausschließlich von der Zahl der gearbeiteten Wochenstunden ab",
      "20 Arbeitstage"
    ],
    "correctOption": "D",
    "explanation": "Der gesetzliche Mindesturlaub von 24 Werktagen entspricht bei einer Fünftagewoche grundsätzlich 20 Arbeitstagen.",
    "companyEffect": "Die Einsatzplanung muss den Mindesturlaub und zugleich eine ausreichende Besetzung berücksichtigen.",
    "sourceRef": "LAW-BURLG-3",
    "sourceKind": "law",
    "tooltipKey": "rt-holiday-minimum",
    "correctAnswer": "20 Arbeitstage"
  },
  {
    "id": "wbq-rt-021",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-training-duty",
    "scenario": "Ein Betrieb bildet eine Auszubildende in einem anerkannten Ausbildungsberuf aus.",
    "question": "Welche Pflicht ist nach BBiG § 14 zentral?",
    "options": [
      "Ausbildungsinhalte können vollständig durch laufende Produktion ersetzt werden, wenn das Unternehmen klein ist",
      "Eine planmäßige Ausbildung ist nur bei schulischer Unterweisung erforderlich",
      "Die Ausbildung planmäßig auf das Ausbildungsziel auszurichten und geeignete Aufgaben zu übertragen",
      "Auszubildende dürfen für den Ausbildungsbetrieb keine produktiven Aufgaben übernehmen"
    ],
    "correctOption": "C",
    "explanation": "BBiG § 14 verpflichtet den Ausbildenden, berufliche Handlungsfähigkeit planmäßig zu vermitteln und nur dem Ausbildungszweck dienliche Aufgaben zu übertragen.",
    "companyEffect": "Eine strukturierte Ausbildung fördert Qualifikation und unterstützt die Einhaltung betrieblicher Ausbildungspflichten.",
    "sourceRef": "LAW-BBIG-14",
    "sourceKind": "law",
    "tooltipKey": "rt-training-duty",
    "correctAnswer": "Die Ausbildung planmäßig auf das Ausbildungsziel auszurichten und geeignete Aufgaben zu übertragen"
  },
  {
    "id": "wbq-rt-022",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-data-protection",
    "scenario": "Ein Vertriebsmitarbeiter exportiert Kundendaten auf sein privates E-Mail-Konto, um von zu Hause weiterzuarbeiten.",
    "question": "Welche Reaktion ist zunächst angemessen?",
    "options": [
      "Der Schutz personenbezogener Daten endet, sobald der Kunde eine geschäftliche E-Mail-Adresse nutzt",
      "Unkontrollierte Übermittlung stoppen und Zweck, Rechtsgrundlage sowie Schutzmaßnahmen prüfen",
      "Geschäftliche Kontaktdaten dürfen ohne Zweckbindung unbegrenzt privat gespeichert werden",
      "Eine Einwilligung ist für jede betriebliche Datenverarbeitung stets die einzige mögliche Rechtsgrundlage"
    ],
    "correctOption": "B",
    "explanation": "Auch geschäftliche Kontaktdaten können personenbezogene Daten sein; Verarbeitung braucht Rechtsgrundlage, Zweckbindung und angemessene Sicherheit.",
    "companyEffect": "Geregelte Zugriffe senken Datenschutzrisiken und schützen das Vertrauen der Kunden.",
    "sourceRef": "LAW-DSGVO-5-DIRECT;LAW-DSGVO-6-DIRECT;LAW-DSGVO-32-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-data-protection",
    "correctAnswer": "Unkontrollierte Übermittlung stoppen und Zweck, Rechtsgrundlage sowie Schutzmaßnahmen prüfen"
  },
  {
    "id": "wbq-rt-023",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-employment-contract",
    "scenario": "Eine Führungskraft will die vereinbarte Wochenarbeitszeit einer Beschäftigten sofort und ohne Abstimmung erhöhen.",
    "question": "Was sollte die Personalabteilung vor einer Änderung prüfen?",
    "options": [
      "Arbeitsvertrag, anwendbare Tarif- oder Betriebsvereinbarungen und gesetzliche Grenzen",
      "Die Arbeitszeit lässt sich einseitig erhöhen, wenn der Kunde einen dringenden Termin setzt",
      "Eine Vertragsänderung ist wirksam, sobald die Lohnabrechnung die neuen Stunden ausweist",
      "Die wöchentliche Arbeitszeit kann unabhängig von Ruhezeiten und gesetzlichen Grenzen frei vereinbart werden"
    ],
    "correctOption": "A",
    "explanation": "Arbeitsbedingungen ergeben sich aus Vertrag und gegebenenfalls geltenden kollektivrechtlichen sowie gesetzlichen Regeln.",
    "companyEffect": "Eine vorherige Prüfung beugt unwirksamen Änderungen und arbeitsrechtlichen Konflikten vor.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-employment-contract",
    "correctAnswer": "Arbeitsvertrag, anwendbare Tarif- oder Betriebsvereinbarungen und gesetzliche Grenzen"
  },
  {
    "id": "wbq-rt-024",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-commercial-terms",
    "scenario": "Allgemeine Lieferbedingungen des Lieferanten widersprechen einer Preis- und Terminangabe in der Bestellung des Betriebs.",
    "question": "Wie sollte der Einkauf reagieren?",
    "options": [
      "Die nachträglich übersandten Lieferantenbedingungen gelten stets rückwirkend",
      "Die Bestellung geht den Bedingungen immer vor, unabhängig von Kommunikation und Annahme",
      "Bei widersprüchlichen Bedingungen ist automatisch das für den Käufer günstigere Dokument maßgeblich",
      "Widersprüchliche Bedingungen klären und eine eindeutige Vereinbarung herbeiführen"
    ],
    "correctOption": "D",
    "explanation": "Bei kollidierenden Vertragsbedingungen sind Kommunikation, Einbeziehung und anwendbares Recht im konkreten Fall zu prüfen.",
    "companyEffect": "Klärung vor Leistung verhindert Streit über Preis, Gefahrübergang, Liefertermin und Mängelrechte.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-commercial-terms",
    "correctAnswer": "Widersprüchliche Bedingungen klären und eine eindeutige Vereinbarung herbeiführen"
  },
  {
    "id": "wbq-rt-025",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-legal-source",
    "scenario": "In einem Internetforum steht, eine steuerliche Frist sei kürzlich geändert worden.",
    "question": "Wie sollte die Finanzleitung die Aussage verifizieren?",
    "options": [
      "Der Rechtsstand des Vorjahres gilt bis zu einer individuellen Mitteilung des Finanzamts weiter",
      "Ein Suchmaschinentreffer ersetzt den Blick in die geltende amtliche Norm",
      "Den aktuellen amtlichen Gesetzestext und zuständige Behördenhinweise prüfen",
      "Eine Forenaussage ist verbindlich, wenn mehrere Nutzer dieselbe Frist nennen"
    ],
    "correctOption": "C",
    "explanation": "Für den geltenden Normtext sind amtliche Primärquellen maßgeblich; Beiträge in Foren sind keine verbindliche Rechtsquelle.",
    "companyEffect": "Ein dokumentierter Quellenabgleich schützt vor veralteten oder missverstandenen Fristannahmen.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-legal-source",
    "correctAnswer": "Den aktuellen amtlichen Gesetzestext und zuständige Behördenhinweise prüfen"
  },
  {
    "id": "wbq-uf-001",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-planning",
    "scenario": "Ein Fertigungsbetrieb hat zwölf Wochen Auftragsbestand und begrenzte Maschinenstunden.",
    "question": "Womit sollte die operative Arbeitsplanung beginnen?",
    "options": [
      "Alle Maschinenstunden vollständig belegen und Liefertermine erst nach Produktionsstart mitteilen",
      "Aufträge strikt nach Fälligkeit sortieren, ohne Rüstfolgen oder Personalengpässe zu prüfen",
      "Nachfrage, Kapazität, Engpässe und Reihenfolge zu einem realistischen Plan verbinden",
      "Zuerst Aufträge nach Deckungsbeitrag ordnen und verfügbare Mitarbeiterstunden nach der Planung ergänzen"
    ],
    "correctOption": "C",
    "explanation": "Planung bringt Ziele, verfügbare Mittel, zeitliche Abfolge und Beschränkungen zusammen.",
    "companyEffect": "Ein realistischer Plan senkt Verspätungen, unnötige Überstunden und Leerlauf.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-planning",
    "correctAnswer": "Nachfrage, Kapazität, Engpässe und Reihenfolge zu einem realistischen Plan verbinden"
  },
  {
    "id": "wbq-uf-002",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-goals",
    "scenario": "Die Geschäftsführung setzt als Jahresziel: „Die Qualität soll besser werden.“",
    "question": "Welche Ergänzung macht das Ziel für die Führung brauchbarer?",
    "options": [
      "Ein Ziel nur an die Geschäftsleitung geben und die Umsetzung nicht nachhalten",
      "Messbarer Zielwert, Termin, Verantwortlichkeit und Prüfrhythmus",
      "Den Ausschuss nur jährlich messen und das Ziel zunächst ohne Verantwortlichkeit festlegen",
      "Eine relative Verbesserung vereinbaren, aber Ausgangswert und Prüftermin offenlassen"
    ],
    "correctOption": "B",
    "explanation": "Ein Ziel wird steuerbar, wenn Ergebnis, Zeitraum, Verantwortung und Kontrolle festgelegt sind.",
    "companyEffect": "Das Team kann Abweichungen früh erkennen und gezielte Maßnahmen ergreifen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-goals",
    "correctAnswer": "Messbarer Zielwert, Termin, Verantwortlichkeit und Prüfrhythmus"
  },
  {
    "id": "wbq-uf-003",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-delegation",
    "scenario": "Ein Vorarbeiter darf die Auftragsreihenfolge planen, aber keine Konflikte bei konkurrierenden Maschinenbelegungen lösen.",
    "question": "Welcher Mangel besteht bei dieser Delegation?",
    "options": [
      "Aufgabe und Verantwortung sind nicht mit ausreichender Entscheidungsbefugnis verbunden",
      "Aufgabe und Ergebnis festlegen, aber den Entscheidungsspielraum bei Ausnahmen ungeklärt lassen",
      "Die Entscheidungsvollmacht übertragen, ohne Berichtspflicht oder Grenzen zu bestimmen",
      "Die Verantwortung beim Vorarbeiter belassen, aber jede einzelne Reihenfolge selbst freigeben"
    ],
    "correctOption": "A",
    "explanation": "Bei Delegation müssen Aufgabe, Entscheidungsspielraum, Grenzen und Rechenschaftspflicht zusammenpassen.",
    "companyEffect": "Geklärte Befugnisse ermöglichen zügige Engpassentscheidungen, ohne jede Rückfrage an die Geschäftsführung zu geben.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-delegation",
    "correctAnswer": "Aufgabe und Verantwortung sind nicht mit ausreichender Entscheidungsbefugnis verbunden"
  },
  {
    "id": "wbq-uf-004",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-leadership-style",
    "scenario": "Eine neue Beschäftigte kennt die CNC-Rüstabläufe noch nicht und benötigt Anleitung zu sicherheitsrelevanten Arbeitsschritten.",
    "question": "Welche Führungsmaßnahme passt zunächst am besten?",
    "options": [
      "Die Rüstaufgabe nach einer kurzen mündlichen Erklärung ohne praktische Rückmeldung übertragen",
      "Zunächst allein die Produktionsmenge vorgeben und Sicherheitskompetenz später prüfen",
      "Die neue Beschäftigte nur beobachten lassen, ohne Lernziel oder schrittweise Übung festzulegen",
      "Ablauf erklären, vorführen und die sichere Ausführung rückmelden"
    ],
    "correctOption": "D",
    "explanation": "Führung und Aufsicht sollten Kompetenz und Risiko der Aufgabe berücksichtigen; Unerfahrene brauchen Anleitung und Rückmeldung.",
    "companyEffect": "Eine sichere Einarbeitung schützt Beschäftigte, Maschine und Lieferfähigkeit.",
    "sourceRef": "LAW-ARBSCHG-3-DIRECT;LAW-ARBSCHG-5-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "uf-leadership-style",
    "correctAnswer": "Ablauf erklären, vorführen und die sichere Ausführung rückmelden"
  },
  {
    "id": "wbq-uf-005",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-motivation",
    "scenario": "Ein erfahrener Facharbeiter macht Verbesserungsvorschläge, die wiederholt unbeachtet bleiben; sein Engagement sinkt.",
    "question": "Welche Reaktion unterstützt die Motivation am ehesten?",
    "options": [
      "Anerkennung ausschließlich an Stückzahl knüpfen, ohne Qualität oder Teambeitrag zu berücksichtigen",
      "Den Vorschlag der Fachkraft übernehmen, ohne sie an Prüfung oder Umsetzung zu beteiligen",
      "Den Mitarbeiter in die Problemlösung einbeziehen und wirksame Beiträge anerkennen",
      "Verbesserungsvorschläge sammeln, die Umsetzung aber ohne Rückmeldung vertagen"
    ],
    "correctOption": "C",
    "explanation": "Beteiligung, Kompetenzerleben und sinnvolle Anerkennung können die intrinsische Motivation stärken.",
    "companyEffect": "Mehr Beteiligung kann Verbesserungen und Bindung fördern.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-motivation",
    "correctAnswer": "Den Mitarbeiter in die Problemlösung einbeziehen und wirksame Beiträge anerkennen"
  },
  {
    "id": "wbq-uf-006",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-conflict",
    "scenario": "Zwei Zerspanungsfachkräfte streiten darüber, wer eine Rüstverzögerung verursacht hat.",
    "question": "Wie sollte die Führungskraft das Gespräch eröffnen?",
    "options": [
      "Die Rüstverzögerung als individuelles Problem behandeln, obwohl mehrere Schichten betroffen sind",
      "Beide Sichtweisen anhören, Fakten erheben und eine Prozessverbesserung vereinbaren",
      "Den Streit sofort einer Person zuordnen, bevor Ablauf und Messdaten geklärt sind",
      "Beide Sichtweisen aufnehmen, aber keine gemeinsame Vereinbarung für künftige Übergaben treffen"
    ],
    "correctOption": "B",
    "explanation": "Eine sachliche Konfliktklärung trennt Prozessursachen von persönlichen Vorwürfen.",
    "companyEffect": "Eine faire Klärung kann Zusammenarbeit wiederherstellen und Wiederholungen vermeiden.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-conflict",
    "correctAnswer": "Beide Sichtweisen anhören, Fakten erheben und eine Prozessverbesserung vereinbaren"
  },
  {
    "id": "wbq-uf-007",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-communication",
    "scenario": "Eine neue Zeichnungsrevision erreicht die Fertigung erst, nachdem bereits nach altem Stand gearbeitet wurde.",
    "question": "Welche Maßnahme beugt dem erneuten Einsatz veralteter Unterlagen vor?",
    "options": [
      "Gelenkte Revisionsverteilung mit Bestätigung am Einsatzort",
      "Neue Zeichnung verteilen, aber den Rückzug überholter Ausdrucke nicht kontrollieren",
      "Revisionsstände nur im Büro aktualisieren und die Fertigung über eine Sammelmail informieren",
      "Eine Bestätigung einholen, ohne die am Arbeitsplatz verwendete Version zu prüfen"
    ],
    "correctOption": "A",
    "explanation": "Dokumentenlenkung stellt sicher, dass gültige Arbeitsunterlagen verfügbar und überholte Versionen erkennbar sind.",
    "companyEffect": "Weniger Fehlteile und Nacharbeit senken Kosten und schützen zugesagte Termine.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-communication",
    "correctAnswer": "Gelenkte Revisionsverteilung mit Bestätigung am Einsatzort"
  },
  {
    "id": "wbq-uf-008",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-change-management",
    "scenario": "Ein neues Planungssystem wird eingeführt, aber die Fertigungsmitarbeitenden erhalten keine Einweisung.",
    "question": "Warum kann die Einführung trotz technisch funktionierender Software scheitern?",
    "options": [
      "Software bereitstellen und eine schriftliche Anleitung versenden, ohne Anwendung oder Fragen zu begleiten",
      "Einzelne Key-User schulen, obwohl alle Schichten selbstständig arbeiten müssen",
      "Nutzungsquote messen, ohne Fehler und Rückmeldungen der Betroffenen auszuwerten",
      "Die Betroffenen verstehen oder übernehmen den neuen Ablauf möglicherweise nicht"
    ],
    "correctOption": "D",
    "explanation": "Eine Veränderung wird erst wirksam, wenn die Beteiligten sie verstehen, anwenden können und Rückmeldung geben.",
    "companyEffect": "Einweisung und begleitete Nutzung senken Bedienfehler und Widerstand während der Umstellung.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-change-management",
    "correctAnswer": "Die Betroffenen verstehen oder übernehmen den neuen Ablauf möglicherweise nicht"
  },
  {
    "id": "wbq-uf-009",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-decision-making",
    "scenario": "Die Beschaffung soll zwischen zwei Lieferanten entscheiden; Angaben zu Lieferzeiten sind noch unsicher.",
    "question": "Welches Vorgehen bietet eine nachvollziehbare Entscheidungsgrundlage?",
    "options": [
      "Kriterien festlegen, jedoch widersprüchliche Daten ohne Plausibilitätsprüfung übernehmen",
      "Die Entscheidung aufschieben, obwohl ein begrenzter Pilot die offene Lieferzeitfrage klären könnte",
      "Kriterien festlegen, Belege ergänzen, Unsicherheit bewerten und Entscheidung begründen",
      "Den Lieferanten nach Preis und Qualität auswählen, aber Unsicherheit der Lieferzeit nicht bewerten"
    ],
    "correctOption": "C",
    "explanation": "Eine strukturierte Entscheidung macht Kriterien und Unsicherheiten sichtbar, ohne notwendige Entscheidungen endlos aufzuschieben.",
    "companyEffect": "Die Leitung kann den Lieferanten auswählen und erkannte Risiken gezielt überwachen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-decision-making",
    "correctAnswer": "Kriterien festlegen, Belege ergänzen, Unsicherheit bewerten und Entscheidung begründen"
  },
  {
    "id": "wbq-uf-010",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-risk-management",
    "scenario": "Nur eine Fachkraft kennt das Kennwort des Maschinensteuerungssystems.",
    "question": "Welche Maßnahme mindert das Ausfallrisiko, ohne den Zugriff unkontrolliert zu öffnen?",
    "options": [
      "Wiederherstellung dokumentieren, ohne die Maßnahme praktisch zu testen",
      "Geregelten Vertretungszugang und dokumentierte Wiederherstellung einrichten",
      "Ein Kennwort im verschlossenen Büroordner hinterlegen, ohne Zugriff oder Aktualisierung zu regeln",
      "Einer Vertretung Zugang geben, aber Protokollierung und Entzug nach Rollenwechsel auslassen"
    ],
    "correctOption": "B",
    "explanation": "Kritische Zugänge brauchen dokumentierte, kontrollierte Vertretung und Wiederherstellung.",
    "companyEffect": "Berechtigte Vertretungen können bei Abwesenheit den Betrieb fortführen, ohne Sicherheitskontrollen aufzugeben.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-risk-management",
    "correctAnswer": "Geregelten Vertretungszugang und dokumentierte Wiederherstellung einrichten"
  },
  {
    "id": "wbq-uf-011",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-quality",
    "scenario": "Ein wiederkehrender Fertigungsfehler wird erst bei der Endkontrolle entdeckt.",
    "question": "Welche Qualitätsmaßnahme erkennt die Abweichung früher?",
    "options": [
      "Geeignete Prüfungen an kritischen Prozessschritten ergänzen",
      "Endkontrolle beibehalten und Stichproben erhöhen, ohne Prozessschritte mit erhöhtem Risiko zu prüfen",
      "Messungen an jedem Arbeitsschritt einführen, auch wenn sie keinen zusätzlichen Fehler früh erkennen",
      "Prüfgrenzen festlegen, aber Messmittelzustand und Reaktionsplan bei Abweichung offenlassen"
    ],
    "correctOption": "A",
    "explanation": "Prüfungen im Prozess erkennen Abweichungen, bevor zusätzliche Arbeit und Material investiert werden.",
    "companyEffect": "Frühe Erkennung verringert Ausschuss, Nacharbeit und Kundenreklamationen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-quality",
    "correctAnswer": "Geeignete Prüfungen an kritischen Prozessschritten ergänzen"
  },
  {
    "id": "wbq-uf-012",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-continuous-improvement",
    "scenario": "Eine geänderte Werkzeugeinstellung senkt die Fehlerquote; der neue Ablauf wird aber nicht festgehalten.",
    "question": "Was sollte das Team als Nächstes tun?",
    "options": [
      "Änderung als wirksam erklären, sobald eine einzelne Schicht weniger Fehler meldet",
      "Den neuen Ablauf standardisieren, ohne über mehrere Aufträge oder Schichten zu prüfen",
      "Den Versuch fortführen, obwohl Messmethode und Ausgangswert nicht vergleichbar sind",
      "Ergebnis überprüfen und den bewährten Ablauf kontrolliert standardisieren"
    ],
    "correctOption": "D",
    "explanation": "Ein Verbesserungszyklus prüft die Wirkung und hält erfolgreiche Änderungen als Standard fest.",
    "companyEffect": "Einheitliche Anweisungen bewahren den Qualitätsgewinn über alle Schichten.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-continuous-improvement",
    "correctAnswer": "Ergebnis überprüfen und den bewährten Ablauf kontrolliert standardisieren"
  },
  {
    "id": "wbq-uf-013",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-organization",
    "scenario": "Der Vertrieb verspricht Eilaufträge direkt einer Fachkraft, ohne die Fertigungsplanung einzubeziehen.",
    "question": "Welches organisatorische Problem wird sichtbar?",
    "options": [
      "Eilaufträge zentral freigeben, ohne verbindliche Rückmeldung über Materialverfügbarkeit einzuholen",
      "Kundenpriorität allein nach Auftragswert festlegen, auch wenn zugesagte Termine betroffen sind",
      "Unklare Zuständigkeiten und Schnittstellen zwischen Vertrieb und Fertigung",
      "Vertrieb und Fertigung informieren, aber nicht festlegen, wer bei Kapazitätskonflikten entscheidet"
    ],
    "correctOption": "C",
    "explanation": "Bereichsübergreifende Zusagen brauchen eindeutige Rollen und abgestimmte Informationswege.",
    "companyEffect": "Gemeinsame Prüfung von Annahme und Kapazität verhindert unrealistische Termine und Überlastung.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-organization",
    "correctAnswer": "Unklare Zuständigkeiten und Schnittstellen zwischen Vertrieb und Fertigung"
  },
  {
    "id": "wbq-uf-014",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-capacity",
    "scenario": "Zwei Aufträge benötigen zur selben Zeit dieselbe CNC-Maschine.",
    "question": "Nach welchen Kriterien sollte die Fertigung die Reihenfolge bestimmen?",
    "options": [
      "Den Auftrag mit höherem Deckungsbeitrag vorziehen, ohne Lieferfolgen des anderen Auftrags abzuwägen",
      "Nach vereinbarten Prioritäten, Fälligkeit, Rüstbedarf und verfügbarer Kapazität",
      "Die Aufträge nach Fälligkeit ordnen, aber gemeinsame Rüstzeiten und Materialverfügbarkeit auslassen",
      "Die Maschine nach Reihenfolge des Auftragseingangs belegen, auch wenn ein späterer Auftrag weniger Umrüstung benötigt"
    ],
    "correctOption": "B",
    "explanation": "Eine nachvollziehbare Reihenfolge berücksichtigt Zusagen, technische Abhängigkeiten und tatsächlich verfügbare Betriebsmittel.",
    "companyEffect": "Ein dokumentiertes Verfahren macht Zielkonflikte sichtbar und verringert willkürliche Umplanungen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-capacity",
    "correctAnswer": "Nach vereinbarten Prioritäten, Fälligkeit, Rüstbedarf und verfügbarer Kapazität"
  },
  {
    "id": "wbq-uf-015",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-personnel-development",
    "scenario": "Eine Fachkraft möchte sich von der Bedienung zur CNC-Programmierung weiterentwickeln.",
    "question": "Welche Personalentwicklungsmaßnahme passt am besten?",
    "options": [
      "Einen Lernplan mit Unterweisung, Übung und Kompetenzprüfung vereinbaren",
      "Schulung finanzieren, aber keine Zeit für angeleitete Programmierpraxis einplanen",
      "Neue Aufgaben übertragen, bevor Kompetenz und sichere Arbeitsweise geprüft wurden",
      "Entwicklungsziel vereinbaren, aber nach dem Kurs keine Anwendung oder Rückmeldung vorsehen"
    ],
    "correctOption": "A",
    "explanation": "Ein Entwicklungsplan verbindet angestrebte Kompetenzen mit Lerngelegenheiten und überprüfbarer Praxis.",
    "companyEffect": "Interner Kompetenzaufbau erhöht Flexibilität und senkt die Abhängigkeit von einzelnen Programmierfachkräften.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-personnel-development",
    "correctAnswer": "Einen Lernplan mit Unterweisung, Übung und Kompetenzprüfung vereinbaren"
  },
  {
    "id": "wbq-uf-016",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-training-compliance",
    "scenario": "Ein Unternehmen bildet in einem anerkannten Ausbildungsberuf aus.",
    "question": "Welche Vorgehensweise unterstützt die planmäßige Berufsausbildung?",
    "options": [
      "Ausbildungsplan erstellen, aber Praxisaufgaben nicht auf den Ausbildungsstand abstimmen",
      "Produktive Arbeit zulassen, ohne Anleitung und Lernfortschritt zu dokumentieren",
      "Ausbildung vollständig an externe Schule abgeben und betriebliche Lerninhalte auslassen",
      "Einen Ausbildungsplan am Ausbildungsziel ausrichten und geeignete Anleitung sicherstellen"
    ],
    "correctOption": "D",
    "explanation": "BBiG § 14 verlangt, die berufliche Handlungsfähigkeit planmäßig und zielgerichtet zu vermitteln.",
    "companyEffect": "Eine strukturierte Ausbildung baut Fähigkeiten auf und belegt einen geordneten Ausbildungsprozess.",
    "sourceRef": "LAW-BBIG-14",
    "sourceKind": "law",
    "tooltipKey": "uf-training-compliance",
    "correctAnswer": "Einen Ausbildungsplan am Ausbildungsziel ausrichten und geeignete Anleitung sicherstellen"
  },
  {
    "id": "wbq-uf-017",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-performance-feedback",
    "scenario": "Ein Mitarbeiter erhält sechs Monate lang keine Rückmeldung, obwohl er wiederholt Liefertermine verfehlt.",
    "question": "Was macht ein Feedbackgespräch am ehesten wirksam?",
    "options": [
      "Ziele gemeinsam besprechen, jedoch keine nächste Überprüfung vereinbaren",
      "Nur Ergebnisse des letzten Monats rückmelden und wiederkehrende Ursachen nicht betrachten",
      "Zeitnahe konkrete Beobachtungen und gemeinsam vereinbarte nächste Schritte",
      "Konkrete Beobachtungen nennen, aber keine Gelegenheit für Sicht der beschäftigten Person geben"
    ],
    "correctOption": "C",
    "explanation": "Konkretes und zeitnahes Feedback macht Erwartungen und Verbesserungsmöglichkeiten nachvollziehbar.",
    "companyEffect": "Der Mitarbeiter kann gegensteuern, bevor einzelne Versäumnisse zum dauerhaften Prozessproblem werden.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-performance-feedback",
    "correctAnswer": "Zeitnahe konkrete Beobachtungen und gemeinsam vereinbarte nächste Schritte"
  },
  {
    "id": "wbq-uf-018",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-workforce-planning",
    "scenario": "Mehrere Beschäftigte beantragen Urlaub im gleichen Zeitraum, in dem ein wichtiger Auftrag ausgeliefert werden soll.",
    "question": "Wie kann die Kapazitätslücke frühzeitig und fair behandelt werden?",
    "options": [
      "Die Besetzung sichern, indem Urlaubsanträge pauschal bis nach dem Auftrag zurückgestellt werden",
      "Urlaubswünsche rechtzeitig mit Arbeitsbedarf und geltenden Regeln abstimmen",
      "Urlaubswünsche früh erfassen, aber keine Vertretung für kritische Arbeitsplätze planen",
      "Alle Anträge nach Eingangszeit entscheiden, ohne gesetzliche und soziale Kriterien einzubeziehen"
    ],
    "correctOption": "B",
    "explanation": "Personalplanung muss Urlaubsrechte, faire Behandlung und notwendige Betriebsbesetzung miteinander abwägen.",
    "companyEffect": "Frühzeitige Abstimmung ermöglicht Umplanung oder rechtmäßige Ersatzkapazität.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-workforce-planning",
    "correctAnswer": "Urlaubswünsche rechtzeitig mit Arbeitsbedarf und geltenden Regeln abstimmen"
  },
  {
    "id": "wbq-uf-019",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-health-safety",
    "scenario": "Eine Maschinenbedienerin meldet, dass die Schutzvorrichtung locker ist.",
    "question": "Was muss die Führungskraft zuerst veranlassen?",
    "options": [
      "Gefährliche Nutzung unterbrechen, Bereich sichern und fachgerechte Behebung organisieren",
      "Maschine für die laufende Schicht weiterverwenden und die Reparatur für die nächste Wartung vormerken",
      "Schutzvorrichtung provisorisch befestigen lassen, ohne qualifizierte Prüfung vor Wiederanlauf",
      "Gefahr melden und dokumentieren, den Bereich aber nicht gegen weitere Nutzung sichern"
    ],
    "correctOption": "A",
    "explanation": "Eine erkannte Gefahr ist zu sichern; Reparatur und Wiederfreigabe müssen fachgerecht erfolgen.",
    "companyEffect": "Prävention schützt Menschen und verhindert Unfälle sowie ungeplante Produktionsausfälle.",
    "sourceRef": "LAW-ARBSCHG-3-DIRECT;LAW-ARBSCHG-5-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "uf-health-safety",
    "correctAnswer": "Gefährliche Nutzung unterbrechen, Bereich sichern und fachgerechte Behebung organisieren"
  },
  {
    "id": "wbq-uf-020",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-work-council",
    "scenario": "Ein Betrieb mit Betriebsrat plant eine neue Schichtverteilung, die Beschäftigte betrifft.",
    "question": "Was sollte die Geschäftsführung vor Einführung klären?",
    "options": [
      "Schichtplan nach Anhörung des Betriebsrats einführen, ohne zu prüfen, ob Mitbestimmung erforderlich ist",
      "Beteiligung nur nach Veröffentlichung des fertigen Plans einholen",
      "Beschäftigte individuell informieren und die Beteiligungsrechte des Betriebsrats unberücksichtigt lassen",
      "Ob Mitbestimmungs- oder Beteiligungsrechte des Betriebsrats gelten"
    ],
    "correctOption": "D",
    "explanation": "Das Betriebsverfassungsgesetz sieht für bestimmte soziale Angelegenheiten Beteiligungsrechte vor.",
    "companyEffect": "Frühzeitige Beteiligung unterstützt rechtmäßige und praktikable Dienstpläne.",
    "sourceRef": "LAW-BETRVG-87",
    "sourceKind": "law",
    "tooltipKey": "uf-work-council",
    "correctAnswer": "Ob Mitbestimmungs- oder Beteiligungsrechte des Betriebsrats gelten"
  },
  {
    "id": "wbq-uf-021",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-ethics",
    "scenario": "Ein Lieferant bietet einer Beschäftigten ein privates Geschenk an, während sie über die Auftragsvergabe entscheidet.",
    "question": "Welche interne Maßnahme schützt eine faire Beschaffung?",
    "options": [
      "Lieferantenauswahl nach Preis dokumentieren, ohne mögliche persönliche Vorteile zu melden",
      "Geschenk ablehnen, den möglichen Interessenkonflikt aber nicht nach internem Verfahren anzeigen",
      "Das Geschenk offenlegen und die Regeln zu Interessenkonflikten anwenden",
      "Geschenk annehmen und erst bei der Jahresprüfung offenlegen"
    ],
    "correctOption": "C",
    "explanation": "Transparenz und klare Regeln schützen die Unabhängigkeit der Beschaffungsentscheidung.",
    "companyEffect": "Nachvollziehbare Lieferantenauswahl stärkt Preiswürdigkeit, Qualität und Vertrauen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-ethics",
    "correctAnswer": "Das Geschenk offenlegen und die Regeln zu Interessenkonflikten anwenden"
  },
  {
    "id": "wbq-uf-022",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-information-security",
    "scenario": "Auf einem Fertigungsrechner erscheint eine unerwartete Datei mit der Aufforderung, Makros zu aktivieren.",
    "question": "Wie sollte die Beschäftigte vorgehen?",
    "options": [
      "Anhang lokal speichern und erst später prüfen, während das Gerät mit dem Produktionsnetz verbunden bleibt",
      "Sicherheitsvorgaben beachten und Datei vor dem Öffnen verifizieren oder melden",
      "Datei in einer isolierten Umgebung öffnen, ohne die zuständige IT- oder Sicherheitsstelle einzubeziehen",
      "Makros nach Rückfrage beim unbekannten Absender aktivieren"
    ],
    "correctOption": "B",
    "explanation": "Unerwartete Anhänge können Schadsoftware enthalten; Prüfung nach dem Sicherheitsprozess reduziert das Risiko.",
    "companyEffect": "Vorsicht schützt Produktionsverfügbarkeit und Unternehmensdaten.",
    "sourceRef": "LAW-DSGVO-32-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "uf-information-security",
    "correctAnswer": "Sicherheitsvorgaben beachten und Datei vor dem Öffnen verifizieren oder melden"
  },
  {
    "id": "wbq-uf-023",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-project-control",
    "scenario": "Ein Projekt für eine neue Lageraufteilung liegt hinter dem Terminplan und über dem Budget.",
    "question": "Welche Projektkontrolle liefert der Geschäftsführung die beste Grundlage?",
    "options": [
      "Fortschritt und Istkosten mit dem Ausgangsplan vergleichen, Abweichungen erklären und Maßnahmen festlegen",
      "Abweichung vom Budget melden, aber Ursache und Korrekturmaßnahme nicht zuordnen",
      "Projektstatus an Meilensteinen messen, ohne angefallene Kosten und Restaufwand zu prognostizieren",
      "Budget anpassen, um Istkosten zu spiegeln, ohne die ursprüngliche Baseline nachvollziehbar zu halten"
    ],
    "correctOption": "A",
    "explanation": "Der Vergleich mit einer nachvollziehbaren Basislinie macht Abweichungen und Korrekturbedarf sichtbar.",
    "companyEffect": "Frühes Eingreifen kann Kostenanstieg begrenzen und Betriebsunterbrechungen vermeiden.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-project-control",
    "correctAnswer": "Fortschritt und Istkosten mit dem Ausgangsplan vergleichen, Abweichungen erklären und Maßnahmen festlegen"
  },
  {
    "id": "wbq-uf-024",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-succession",
    "scenario": "Nur eine Fachkraft beherrscht die Kalibrierung des wichtigsten Messgeräts.",
    "question": "Welche Maßnahme erhöht die betriebliche Ausfallsicherheit?",
    "options": [
      "Kalibrieranleitung erstellen, aber keine Vertretung auf die Durchführung einweisen",
      "Backup benennen, ohne erforderliche Messmittel und Freigabebefugnis bereitzustellen",
      "Wissen informell weitergeben, ohne Aktualität und Wiederholbarkeit zu prüfen",
      "Eine Vertretung qualifizieren und die Kalibrierungsschritte dokumentieren"
    ],
    "correctOption": "D",
    "explanation": "Wissensweitergabe und Verfahrensdokumentation senken die Abhängigkeit von einer einzelnen Person.",
    "companyEffect": "Der Betrieb kann Qualitätssicherung auch bei Abwesenheit oder Personalwechsel fortsetzen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-succession",
    "correctAnswer": "Eine Vertretung qualifizieren und die Kalibrierungsschritte dokumentieren"
  },
  {
    "id": "wbq-uf-025",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-crisis-communication",
    "scenario": "Ein Maschinenausfall verzögert einen zugesagten Kundenauftrag voraussichtlich um drei Tage.",
    "question": "Wie sollte der Betrieb den Kunden zunächst informieren?",
    "options": [
      "Eine Teillieferung zusagen, bevor geprüft ist, ob sie technisch und vertraglich zulässig ist",
      "Verspätung mitteilen, ohne mögliche Umplanung oder Alternativkapazität zu prüfen",
      "Zeitnah den Sachstand, eine belastbare neue Einschätzung und mögliche Abhilfe mitteilen",
      "Kunden früh informieren, aber zunächst keinen neuen Termin oder nächsten Updatezeitpunkt nennen"
    ],
    "correctOption": "C",
    "explanation": "Eine frühe und sachliche Information gibt dem Kunden Zeit zur Planung und erhält Vertrauen.",
    "companyEffect": "Der Kunde kann Alternativen abstimmen; Teillieferung oder Umplanung kann Folgeschäden begrenzen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-crisis-communication",
    "correctAnswer": "Zeitnah den Sachstand, eine belastbare neue Einschätzung und mögliche Abhilfe mitteilen"
  },
  {
    "id": "wbq-vw-026",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-marginal-utility",
    "scenario": "Ein Kunde kauft eine zweite identische Fräse nur, wenn ihr zusätzlicher Nutzen den Kaufpreis übersteigt.",
    "question": "Wie heißt der Nutzen einer zusätzlich nachgefragten Einheit?",
    "options": [
      "Der zusätzliche Nutzen je weiterer Einheit ohne Abzug ihres Preises",
      "Grenznutzen",
      "Der durchschnittliche Nutzen aller bereits gekauften Fräsen",
      "Der gesamte Nutzen des Maschinenbestands nach Anschaffung der zweiten Fräse"
    ],
    "correctOption": "B",
    "explanation": "Der Grenznutzen bezeichnet den zusätzlichen Nutzen aus einer weiteren Einheit.",
    "companyEffect": "Der Anbieter kann den zusätzlichen Kundenbedarf und nicht nur den Gesamtverbrauch beurteilen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-marginal-utility",
    "correctAnswer": "Grenznutzen"
  },
  {
    "id": "wbq-vw-027",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-consumer-surplus",
    "scenario": "Ein Kunde wäre bereit, bis zu 1.500 Euro für eine Vorrichtung zu zahlen, erhält sie aber für 1.200 Euro.",
    "question": "Wie hoch ist die vereinfachte Konsumentenrente?",
    "options": [
      "300 Euro",
      "2.700 Euro, weil Zahlungsbereitschaft und Kaufpreis addiert werden",
      "1.500 Euro als Überschuss ansetzen, weil dies die maximale Zahlungsbereitschaft ist",
      "1.200 Euro als Rente ansetzen, weil es der tatsächliche Kaufpreis ist"
    ],
    "correctOption": "A",
    "explanation": "Die Konsumentenrente ist die Zahlungsbereitschaft abzüglich des tatsächlich gezahlten Preises.",
    "companyEffect": "Kundenwert kann die Angebotsgestaltung informieren; er bedeutet nicht, dass alle Kunden dieselbe Zahlungsbereitschaft haben.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-consumer-surplus",
    "correctAnswer": "300 Euro"
  },
  {
    "id": "wbq-vw-028",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-producer-surplus",
    "scenario": "Ein Betrieb nimmt einen Auftrag für 900 Euro an; seine Mindestpreisforderung lag bei 700 Euro.",
    "question": "Wie hoch ist der vereinfachte Produzentenüberschuss?",
    "options": [
      "1.600 Euro, weil Verkaufspreis und Mindestpreisforderung addiert werden",
      "900 Euro als Überschuss ansetzen, weil dies der Erlös des Auftrags ist",
      "700 Euro als Überschuss ansetzen, weil dies die Mindestpreisforderung war",
      "200 Euro"
    ],
    "correctOption": "D",
    "explanation": "Der Produzentenüberschuss entspricht hier dem Verkaufspreis abzüglich der Mindestpreisforderung.",
    "companyEffect": "Der Überschuss verdeutlicht einen Handelsvorteil, ist aber nicht mit dem handelsrechtlichen Gewinn gleichzusetzen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-producer-surplus",
    "correctAnswer": "200 Euro"
  },
  {
    "id": "wbq-vw-029",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-price-ceiling",
    "scenario": "Eine gesetzliche Preisobergrenze für einen knappen Werkstoff liegt unter dem Gleichgewichtspreis.",
    "question": "Welche Folge kann entstehen, wenn sich das Angebot kurzfristig nicht erhöht?",
    "options": [
      "Bei knappem Angebot sinkt die Nachfrage sicher im gleichen Umfang wie der Preisdeckel",
      "Die Obergrenze wirkt nur auf die Liefermenge, nicht auf Nachfrage oder Zuteilung",
      "Eine Überschussnachfrage beziehungsweise Knappheit",
      "Eine Preisobergrenze oberhalb des Marktgleichgewichts erzeugt automatisch eine Knappheit"
    ],
    "correctOption": "C",
    "explanation": "Eine bindende Obergrenze unter dem Gleichgewichtspreis kann die Nachfrage über das verfügbare Angebot steigen lassen.",
    "companyEffect": "Der Betrieb muss den knappen Werkstoff transparent und rechtmäßig zuteilen oder Ersatzquellen prüfen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-price-ceiling",
    "correctAnswer": "Eine Überschussnachfrage beziehungsweise Knappheit"
  },
  {
    "id": "wbq-vw-030",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-subsidy",
    "scenario": "Ein Zuschuss senkt die Anschaffungskosten für eine energieeffiziente Maschine.",
    "question": "Wie kann sich der Zuschuss auf die Investitionsentscheidung auswirken?",
    "options": [
      "Den Zuschuss als Ersatz für eine Absatz- und Liquiditätsprüfung behandeln",
      "Er kann ein sonst nicht wirtschaftliches Vorhaben ermöglicht erscheinen lassen",
      "Die Förderung auch nach Bewilligung als sicher ansehen, obwohl Bedingungen noch ungeprüft sind",
      "Die Investition allein wegen des Zuschusses wählen, auch wenn Betriebskosten den Vorteil aufzehren"
    ],
    "correctOption": "B",
    "explanation": "Ein Zuschuss reduziert die private Investitionsbelastung, sofern die Bedingungen erfüllt sind.",
    "companyEffect": "Der Betrieb muss weiterhin Lebenszykluskosten, Nutzen und Förderauflagen prüfen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-subsidy",
    "correctAnswer": "Er kann ein sonst nicht wirtschaftliches Vorhaben ermöglicht erscheinen lassen"
  },
  {
    "id": "wbq-vw-031",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-tax-incidence",
    "scenario": "Eine Steuer wird rechtlich beim Zulieferer erhoben; Kunden können leicht zu anderen Anbietern wechseln, während das Angebot knapp ist.",
    "question": "Wovon hängt ab, wer die wirtschaftliche Steuerlast tatsächlich trägt?",
    "options": [
      "Von der relativen Preiselastizität von Angebot und Nachfrage",
      "Die gesetzliche Abführungspflicht entscheidet allein, wer die Steuer wirtschaftlich trägt",
      "Bei unelastischer Nachfrage trägt immer der Anbieter die gesamte Last",
      "Vertragliche Überwälzung sichert die vollständige Weitergabe unabhängig von Marktreaktionen"
    ],
    "correctOption": "A",
    "explanation": "Die wirtschaftliche Steuerinzidenz hängt davon ab, wie stark Angebot und Nachfrage auf Preisänderungen reagieren.",
    "companyEffect": "Die tatsächliche Lastverteilung kann von der formalen steuerlichen Zahlungspflicht abweichen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-tax-incidence",
    "correctAnswer": "Von der relativen Preiselastizität von Angebot und Nachfrage"
  },
  {
    "id": "wbq-vw-032",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-economies-scale",
    "scenario": "Ein wachsender Betrieb verteilt seine unveränderten Verwaltungskosten auf eine steigende Zahl von Aufträgen.",
    "question": "Welcher Kosteneffekt kann daraus entstehen?",
    "options": [
      "Durch Mengenwachstum sinken Fixkosten je Auftrag selbst dann, wenn der Verwaltungsaufwand stark ansteigt",
      "Die Fixkosten je Auftrag bleiben unverändert, solange die Gesamtmiete gleich ist",
      "Mehr Aufträge senken stets auch die gesamten Fixkosten",
      "Sinkende durchschnittliche Fixkosten je Auftrag"
    ],
    "correctOption": "D",
    "explanation": "Bleiben die gesamten Fixkosten konstant, sinkt ihr Anteil je Einheit mit steigender Menge.",
    "companyEffect": "Wachstum kann Gemeinkosten je Auftrag senken, bis Koordinations- oder Kapazitätskosten zunehmen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-economies-scale",
    "correctAnswer": "Sinkende durchschnittliche Fixkosten je Auftrag"
  },
  {
    "id": "wbq-vw-033",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-diseconomies",
    "scenario": "Nach schnellem Wachstum nehmen Abstimmungsfehler und Ausschuss stärker als die Ausbringungsmenge zu.",
    "question": "Welches Risiko beschreibt diese Entwicklung?",
    "options": [
      "Mehr Ausbringung beweist, dass die Durchschnittskosten weiter fallen",
      "Zusätzliche Hierarchieebenen können die Gesamtkosten reduzieren, unabhängig von Abstimmungsaufwand",
      "Nachteile einer zu großen Betriebsgröße beziehungsweise diseconomies of scale",
      "Koordination wird mit wachsender Betriebsgröße zwangsläufig günstiger"
    ],
    "correctOption": "C",
    "explanation": "Ab einer bestimmten Größe können Koordinationsaufwand und Komplexität die Durchschnittskosten erhöhen.",
    "companyEffect": "Eine Expansion sollte neben Kapazität auch Führungs-, Prozess- und Qualitätsaufwand einplanen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-diseconomies",
    "correctAnswer": "Nachteile einer zu großen Betriebsgröße beziehungsweise diseconomies of scale"
  },
  {
    "id": "wbq-vw-034",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-competition-entry",
    "scenario": "Ein geschütztes Fertigungsverfahren läuft aus; mehrere neue Betriebe beginnen, vergleichbare Produkte anzubieten.",
    "question": "Welche Wettbewerbswirkung ist wahrscheinlich?",
    "options": [
      "Ablaufende Patente verhindern den Markteintritt, sofern Kunden bereits gebunden sind",
      "Neue Anbieter und Ersatzangebote begrenzen die bisherige Preissetzungsmacht",
      "Ein Markteintritt führt zwingend zu sinkenden Kosten des bisherigen Anbieters",
      "Der etablierte Betrieb kann seine Preise erhöhen, weil mehr Anbieter den Markt bekannter machen"
    ],
    "correctOption": "B",
    "explanation": "Niedrigere Markteintrittshürden und neue Alternativen verstärken den Wettbewerb.",
    "companyEffect": "Der Betrieb muss Service, Qualität und Verfahren weiterentwickeln, um Kunden zu halten.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-competition-entry",
    "correctAnswer": "Neue Anbieter und Ersatzangebote begrenzen die bisherige Preissetzungsmacht"
  },
  {
    "id": "wbq-vw-035",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-market-segmentation",
    "scenario": "Hersteller medizinischer Geräte bewerten Rückverfolgbarkeit stärker als den niedrigsten Stückpreis.",
    "question": "Welchen Vorteil bietet die Segmentierung dieser Kundengruppe?",
    "options": [
      "Angebot und Service auf besondere Beschaffungskriterien abstimmen",
      "Kundengruppen nach Branche unterscheiden, obwohl sie dieselben Anforderungen und Auswahlkriterien haben",
      "Eine eigene Leistung für Rückverfolgbarkeit anbieten, ohne zu prüfen, ob der Kundennutzen den Aufwand deckt",
      "Den Preis für alle Kundengruppen gleich halten, auch wenn Servicebedarf und Wertbeitrag verschieden sind"
    ],
    "correctOption": "A",
    "explanation": "Segmentierung unterscheidet Kundengruppen nach Bedarf und Auswahlkriterien.",
    "companyEffect": "Ein gezieltes Angebot kann in Rückverfolgbarkeit investieren, wenn Kunden diesen Zusatznutzen honorieren.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-market-segmentation",
    "correctAnswer": "Angebot und Service auf besondere Beschaffungskriterien abstimmen"
  },
  {
    "id": "wbq-vw-036",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-product-differentiation",
    "scenario": "Ein Zulieferer bietet technische Beratung und schnelle Unterstützung zusätzlich zu den Bauteilen an.",
    "question": "Wie kann diese Differenzierung auf den Wettbewerb wirken?",
    "options": [
      "Technische Beratung als Differenzierung anbieten und ihren Personalaufwand in der Marge berücksichtigen",
      "Service als kostenlos behandeln, obwohl er zusätzliche Arbeitszeit bindet",
      "Kundentreue allein aus dem Zusatzservice ableiten, ohne Wechselverhalten zu beobachten",
      "Sie kann Preisvergleiche weniger unmittelbar machen und Kundenbindung stärken"
    ],
    "correctOption": "D",
    "explanation": "Zusätzlicher Kundennutzen kann die Vergleichbarkeit allein nach Preis verringern.",
    "companyEffect": "Der Betrieb sollte messen, ob Kunden den Service ausreichend schätzen, um dessen Kosten zu tragen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-product-differentiation",
    "correctAnswer": "Sie kann Preisvergleiche weniger unmittelbar machen und Kundenbindung stärken"
  },
  {
    "id": "wbq-vw-037",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-globalization",
    "scenario": "Ein ausländischer Lieferant bietet niedrigere Stückpreise, aber längere Transportzeiten.",
    "question": "Welche Abwägung ist bei der Beschaffung sinnvoll?",
    "options": [
      "Längere Lieferzeit durch höhere Bestände ausgleichen, ohne Kapitalbindung zu berechnen",
      "Den Auslandsanbieter wählen, sobald sein Angebotspreis unter dem Inlandspreis liegt",
      "Einkaufspreis mit Fracht, Lieferzeit, Qualität und Versorgungsrisiko vergleichen",
      "Den Stückpreis vergleichen und Fracht sowie Sicherheitsbestand in einer gesonderten Analyse berücksichtigen"
    ],
    "correctOption": "C",
    "explanation": "Internationale Beschaffung beeinflusst die gesamten Bezugskosten und die Versorgungssicherheit.",
    "companyEffect": "Fracht, Sicherheitsbestände und Verzögerungen können den scheinbaren Preisvorteil aufzehren.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-globalization",
    "correctAnswer": "Einkaufspreis mit Fracht, Lieferzeit, Qualität und Versorgungsrisiko vergleichen"
  },
  {
    "id": "wbq-vw-038",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-sustainable-business",
    "scenario": "Ein Kunde fragt nach Energieverbrauch und Recyclinganteil der gelieferten Teile.",
    "question": "Wie sollte der Betrieb auf die Anfrage reagieren?",
    "options": [
      "Umweltdaten veröffentlichen, ohne Nachweise oder Berechnungsmethode zu dokumentieren",
      "Relevante Umweltdaten messen und Aussagen nachvollziehbar belegen",
      "Energieverbrauch messen, aber Systemgrenzen und Bezugsmenge bei Aussagen offenlassen",
      "Recyclinganteil auf Basis einer einzelnen Charge auf alle Lieferungen übertragen"
    ],
    "correctOption": "B",
    "explanation": "Messbare und belegte Umweltdaten ermöglichen glaubwürdige Kommunikation und vermeiden irreführende Aussagen.",
    "companyEffect": "Verlässliche Angaben können Vertrauen stärken und die Zulassung für Lieferketten unterstützen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-sustainable-business",
    "correctAnswer": "Relevante Umweltdaten messen und Aussagen nachvollziehbar belegen"
  },
  {
    "id": "wbq-vw-039",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-product-life-cycle",
    "scenario": "Der Absatz eines etablierten Produktes stagniert, während Wettbewerber neuere Ausführungen anbieten.",
    "question": "Welche Phase des Produktlebenszyklus könnte vorliegen?",
    "options": [
      "Reifephase oder beginnender Rückgang",
      "Reifephase annehmen, weil Absatz konstant bleibt, obwohl Kundenbindung und Wettbewerbsposition nicht geprüft sind",
      "Produkt auslisten, sobald ein neuer Wettbewerber eintritt",
      "In die Einführung zurückgehen, obwohl das Produkt schon einen stabilen Kundenstamm hat"
    ],
    "correctOption": "A",
    "explanation": "Stagnation und neue Substitute können auf Reife oder beginnenden Rückgang hindeuten.",
    "companyEffect": "Der Betrieb kann Produktpflege, Kostensenkung oder geordneten Auslauf prüfen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-product-life-cycle",
    "correctAnswer": "Reifephase oder beginnender Rückgang"
  },
  {
    "id": "wbq-vw-040",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-fixed-variable",
    "scenario": "Ein Betrieb least eine Maschine zu einem festen Monatsbetrag; der Vertrag läuft weiter, auch wenn die Ausbringung sinkt.",
    "question": "Wie verhält sich die Leasingzahlung kurzfristig zur Produktionsmenge?",
    "options": [
      "Die Rate steigt automatisch mit jedem zusätzlich gefertigten Teil",
      "Feste Leasingkosten fallen nur bei vollständiger Auslastung an",
      "Bei geringer Nutzung kann der Betrieb den Monatsbetrag einseitig neu berechnen",
      "Sie bleibt im Vertragszeitraum überwiegend fix"
    ],
    "correctOption": "D",
    "explanation": "Ein fester monatlicher Leasingbetrag verändert sich im betrachteten Vertrag nicht automatisch mit der Auslastung.",
    "companyEffect": "Bei geringer Nutzung trägt der Betrieb weiterhin die vereinbarte monatliche Liquiditätsbelastung.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-fixed-variable",
    "correctAnswer": "Sie bleibt im Vertragszeitraum überwiegend fix"
  },
  {
    "id": "wbq-vw-041",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-transaction-cost",
    "scenario": "Ein Lieferant ist günstig, verursacht aber hohen Aufwand für Suche, Vertragsabstimmung, Prüfung und Koordination.",
    "question": "Welche Kosten sollte die Beschaffung zusätzlich zum Angebotspreis berücksichtigen?",
    "options": [
      "Einen höheren Kaufpreis immer als geringere Transaktionskosten deuten",
      "Kontrollaufwand ignorieren, wenn der Stückpreis niedriger ist",
      "Such-, Vertrags-, Überwachungs-, Abstimmungs- und Fehlerkosten",
      "Nur Such- und Vertragsaufwand messen und Reklamationskosten des Lieferanten auslassen"
    ],
    "correctOption": "C",
    "explanation": "Transaktionskosten umfassen neben dem Preis auch Aufwand für Anbahnung, Vereinbarung und Kontrolle.",
    "companyEffect": "Ein verlässlicherer Anbieter kann trotz höherem Stückpreis insgesamt weniger Aufwand verursachen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-transaction-cost",
    "correctAnswer": "Such-, Vertrags-, Überwachungs-, Abstimmungs- und Fehlerkosten"
  },
  {
    "id": "wbq-vw-042",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-principal-agent",
    "scenario": "Ein Eigentümer kann nicht unmittelbar beobachten, wie sorgfältig die Geschäftsführung Wartungsarbeiten plant.",
    "question": "Welche Maßnahme kann den Interessenkonflikt zwischen Auftraggeber und Beauftragtem begrenzen?",
    "options": [
      "Wartungszustand messen, aber keine Folgen für nicht erfüllte Ziele vorsehen",
      "Klare Zuständigkeiten, Berichte und angemessene Anreize verbinden",
      "Berichtspflichten einführen, ohne Verantwortlichkeiten und Anreize abzustimmen",
      "Kurzfristige Ausbringungsprämien zahlen und damit Wartungsinteressen dauerhaft angleichen"
    ],
    "correctOption": "B",
    "explanation": "Kontrolle und Anreize können Informationsprobleme zwischen Eigentümer und beauftragter Leitung begrenzen, verursachen aber selbst Aufwand.",
    "companyEffect": "Vorausschauende Wartung kann Verfügbarkeit und Lebenszykluskosten verbessern.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-principal-agent",
    "correctAnswer": "Klare Zuständigkeiten, Berichte und angemessene Anreize verbinden"
  },
  {
    "id": "wbq-vw-043",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-asymmetric-information",
    "scenario": "Der Verkäufer einer gebrauchten Maschine kennt wiederkehrende Störungen, die der Käufer vor Besichtigung nicht erkennen kann.",
    "question": "Welches Informationsproblem liegt vor?",
    "options": [
      "Informationsasymmetrie",
      "Der Käufer kennt mehr über Maschinenzustand als der Verkäufer",
      "Beide Vertragsseiten verfügen vor der Besichtigung über dieselben Informationen",
      "Information ist asymmetrisch, sobald der Verkäufer einen höheren Preis verlangt"
    ],
    "correctOption": "A",
    "explanation": "Eine Partei verfügt über wichtige Informationen, die der anderen Seite fehlen.",
    "companyEffect": "Prüfung, Offenlegung und passende Vertragsregelungen verringern Fehlentscheidungen und Streit.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-asymmetric-information",
    "correctAnswer": "Informationsasymmetrie"
  },
  {
    "id": "wbq-vw-044",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-public-policy",
    "scenario": "Ein Regionalzuschuss verlangt zusätzliche Arbeitsplätze und Nachweise förderfähiger Investitionen.",
    "question": "Was sollte der Betrieb vor Berücksichtigung des Zuschusses prüfen?",
    "options": [
      "Förderfähige Investition vor Bewilligung beauftragen, obwohl der Programmstart noch ungeklärt ist",
      "Mit dem erwarteten Zuschuss die Liquiditätsvorschau verbessern, bevor Auszahlungstermin und Nachweise geklärt sind",
      "Arbeitsplätze schaffen, ohne Mindestdauer und Rückforderungsfolgen zu prüfen",
      "Förderfähigkeit, Belege, Fristen und Rückforderungsbedingungen"
    ],
    "correctOption": "D",
    "explanation": "Öffentliche Fördermittel sind an Bedingungen gebunden, deren Einhaltung und Nachweis geprüft werden müssen.",
    "companyEffect": "Ein Fristen- und Nachweisplan vermindert das Risiko nicht förderfähiger Ausgaben oder einer Rückforderung.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-public-policy",
    "correctAnswer": "Förderfähigkeit, Belege, Fristen und Rückforderungsbedingungen"
  },
  {
    "id": "wbq-vw-045",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-productivity-capital",
    "scenario": "Eine CNC-Erneuerung erzeugt dieselbe Stückzahl bei weniger Maschinenstunden.",
    "question": "Welche Produktivitätskennzahl verbessert sich unmittelbar?",
    "options": [
      "Die eingesparte Maschinenzeit als Produktivitätszuwachs verbuchen, ohne die Ausbringung zu vergleichen",
      "Maschinenstunden durch Personalstunden teilen und die Kennzahl als Ausbringung interpretieren",
      "Ausbringung je Maschinenstunde",
      "Produktivität anhand der Ausbringung je Beschäftigtenstunde bewerten, obwohl nur Maschinenstunden genannt sind"
    ],
    "correctOption": "C",
    "explanation": "Bei gleicher Ausbringung und sinkenden Maschinenstunden steigt die Ausbringung je Stunde.",
    "companyEffect": "Die zusätzliche Zeit kann für weitere Aufträge genutzt oder zur Entlastung eines Engpasses eingesetzt werden.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-productivity-capital",
    "correctAnswer": "Ausbringung je Maschinenstunde"
  },
  {
    "id": "wbq-vw-046",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-capital-labor-substitution",
    "scenario": "Ein Roboter übernimmt repetitive Handhabung; Programmierung und Rüsten bleiben Aufgaben der Fachkräfte.",
    "question": "Wie lässt sich die Veränderung der Produktionsfaktoren am besten beschreiben?",
    "options": [
      "Kapital und Arbeit als stets vollständig gegensätzliche Einsatzfaktoren behandeln",
      "Kapital ersetzt einzelne Arbeitsschritte und ergänzt weiter benötigte Facharbeit",
      "Automatisierung als Ersatz der gesamten Facharbeit einplanen, obwohl Rüsten und Programmierung verbleiben",
      "Roboterleistung ohne Integrations- und Schulungsaufwand ansetzen"
    ],
    "correctOption": "B",
    "explanation": "Automatisierung kann Arbeit bei einzelnen Tätigkeiten ersetzen und in anderen Aufgaben ergänzen.",
    "companyEffect": "Die Investitionsrechnung muss Integration, Qualifizierung und verbleibenden Personalbedarf einbeziehen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-capital-labor-substitution",
    "correctAnswer": "Kapital ersetzt einzelne Arbeitsschritte und ergänzt weiter benötigte Facharbeit"
  },
  {
    "id": "wbq-vw-047",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-network-effects",
    "scenario": "Ein Beschaffungsportal wird für Betriebe wertvoller, wenn mehr Kunden und Lieferanten teilnehmen.",
    "question": "Wie heißt dieser Zusammenhang?",
    "options": [
      "Netzwerkeffekt",
      "Mehr Teilnehmende können den Nutzen erhöhen, aber nur bei ausreichender Qualität und aktiver Nutzung",
      "Netzwerkeffekt bedeutet, dass jeder zusätzliche Nutzer den Preis erhöht",
      "Ein Portal erzielt Netzwerkeffekte schon durch mehr Registrierungen, auch wenn keine Transaktionen stattfinden"
    ],
    "correctOption": "A",
    "explanation": "Ein Netzwerkeffekt liegt vor, wenn der Nutzen eines Angebots mit der Zahl der teilnehmenden Nutzer steigt.",
    "companyEffect": "Mehr Teilnehmende können die Vermittlung verbessern; Zugang und Daten müssen dennoch sorgfältig geregelt werden.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-network-effects",
    "correctAnswer": "Netzwerkeffekt"
  },
  {
    "id": "wbq-vw-048",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-substitute-goods",
    "scenario": "Ein Kunde kann einen Stahlhalter durch eine günstigere Verbundstofflösung ersetzen; deren Preis sinkt.",
    "question": "Wie kann sich das auf die Nachfrage nach dem Stahlhalter auswirken?",
    "options": [
      "Eine günstigere Alternative kann Nachfrage abziehen, wenn Qualität und Wechselkosten vergleichbar bleiben",
      "Der Stahlhalter wird teurer, weil sein Substitut günstiger wird",
      "Substitute beeinflussen nur das Angebot, nicht die Nachfrage nach dem Stahlhalter",
      "Sie kann zurückgehen, weil das Ersatzprodukt attraktiver wird"
    ],
    "correctOption": "D",
    "explanation": "Ein günstigeres Substitut kann die Nachfrage nach dem bisherigen Produkt vermindern.",
    "companyEffect": "Der Betrieb kann Konstruktion, Lebenszyklusnutzen oder Kostenposition des Stahlteils überprüfen.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-substitute-goods",
    "correctAnswer": "Sie kann zurückgehen, weil das Ersatzprodukt attraktiver wird"
  },
  {
    "id": "wbq-vw-049",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-complementary-goods",
    "scenario": "Ein Kunde bewertet eine spanende Fertigung zusammen mit einer passenden Präzisionsprüfung besonders hoch.",
    "question": "In welchem Verhältnis stehen die beiden Leistungen wirtschaftlich?",
    "options": [
      "Präzisionsprüfung ersetzt die spanende Fertigung vollständig",
      "Gemeinsame Nutzung bedeutet, dass jede Leistung denselben Preis haben muss",
      "Sie sind Komplemente",
      "Kunden nutzen beide Leistungen, wenn sie einander ergänzen; der Nutzen kann auch getrennt bestehen"
    ],
    "correctOption": "C",
    "explanation": "Komplementäre Güter oder Leistungen werden gemeinsam genutzt oder gewinnen gemeinsam an Wert.",
    "companyEffect": "Ein abgestimmtes Leistungsbündel kann den Kundennutzen erhöhen, sofern die Abläufe wirtschaftlich durchführbar sind.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-complementary-goods",
    "correctAnswer": "Sie sind Komplemente"
  },
  {
    "id": "wbq-vw-050",
    "areaId": "wbq-volks-und-betriebswirtschaft",
    "competenceId": "vw-economic-indicators",
    "scenario": "Der Einkauf beobachtet sinkende Neuaufträge, bevor die aktuelle Fertigungsauslastung zurückgeht.",
    "question": "Warum können Neuaufträge ein Frühindikator sein?",
    "options": [
      "Sinkende Neuaufträge sind nur dann ein Frühindikator, wenn der Umsatz bereits gesunken ist",
      "Sie geben Hinweise auf die künftige Geschäftstätigkeit, bevor Produktion und Erlöse folgen",
      "Neuaufträge messen bereits realisierte Produktion statt künftiger Aktivität",
      "Auftragseingänge sagen die spätere Auslastung sicher voraus"
    ],
    "correctOption": "B",
    "explanation": "Auftragseingänge gehen der späteren Fertigung und Abrechnung häufig voraus, sind aber keine sichere Prognose.",
    "companyEffect": "Frühe Nachfragesignale können Personal-, Einkaufs- und Kapazitätsentscheidungen verbessern.",
    "sourceRef": "MAP-WBQ-VW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "vw-economic-indicators",
    "correctAnswer": "Sie geben Hinweise auf die künftige Geschäftstätigkeit, bevor Produktion und Erlöse folgen"
  },
  {
    "id": "wbq-rw-026",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cost-center-accounting",
    "scenario": "Die Instandhaltung leistet 60 Stunden für die Fertigung und 20 Stunden für die Verwaltung.",
    "question": "Welcher Anteil der Instandhaltungskosten entfällt bei einer Verteilung nach Stunden auf die Fertigung?",
    "options": [
      "Die Gesamtkosten gleichmäßig auf beide Bereiche verteilen",
      "75 Prozent",
      "75 Prozent der Kosten an die Verwaltung zuweisen, weil dort 20 Stunden anfallen",
      "60 Prozent nach Fertigungsstunden aufteilen und die übrigen Stunden verwerfen"
    ],
    "correctOption": "B",
    "explanation": "Die Fertigung nutzt 60 von insgesamt 80 Stunden, also 75 Prozent.",
    "companyEffect": "Die verursachungsgerechte Zuordnung macht den Verbrauch interner Serviceleistungen sichtbar.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cost-center-accounting",
    "correctAnswer": "75 Prozent"
  },
  {
    "id": "wbq-rw-027",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-direct-cost",
    "scenario": "Ein konkreter Kundenauftrag verbraucht nachweislich Wendeschneidplatten im Wert von 300 Euro.",
    "question": "Wie sind diese Kosten diesem Auftrag gegenüber grundsätzlich einzuordnen?",
    "options": [
      "Als Einzelkosten",
      "Als Gemeinkosten, weil Werkzeuge in mehreren Aufträgen eingesetzt werden können",
      "Als Fixkosten, weil sie in der Kostenrechnung erfasst werden",
      "Als Einzelkosten nur dann, wenn die Schneidplatte vollständig verbraucht ist"
    ],
    "correctOption": "A",
    "explanation": "Dem Auftrag direkt zurechenbare Kosten sind Einzelkosten des betreffenden Kalkulationsobjekts.",
    "companyEffect": "Direkte Kostenerfassung verbessert die Ermittlung des Auftragsbeitrags.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-direct-cost",
    "correctAnswer": "Als Einzelkosten"
  },
  {
    "id": "wbq-rw-028",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-indirect-cost",
    "scenario": "Die Hallenheizung versorgt mehrere Fertigungsaufträge; der Verbrauch lässt sich keinem Auftrag wirtschaftlich einzeln zurechnen.",
    "question": "Wie wird der Heizungsaufwand typischerweise behandelt?",
    "options": [
      "Als Einzelkosten der größten Fertigungsserie zuordnen",
      "Als variable Einzelkosten jedes Auftrags ungeachtet des Verbrauchs erfassen",
      "Als Kostenstelle statt als Kostenart buchen",
      "Als Gemeinkosten, die sachgerecht verteilt werden"
    ],
    "correctOption": "D",
    "explanation": "Gemeinsam genutzte Kosten werden als Gemeinkosten erfasst und über einen passenden Schlüssel zugerechnet.",
    "companyEffect": "Ein geeigneter Schlüssel ermöglicht nachvollziehbare Auftragsvergleiche.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-indirect-cost",
    "correctAnswer": "Als Gemeinkosten, die sachgerecht verteilt werden"
  },
  {
    "id": "wbq-rw-029",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-full-cost",
    "scenario": "Ein Angebot umfasst direktes Material, direkte Fertigungszeit und einen angemessenen Gemeinkostenanteil.",
    "question": "Welche Kalkulationssicht liegt vor?",
    "options": [
      "Vollkosten mit dem Marktpreis gleichsetzen",
      "Vollkosten ausschließlich für kurzfristige Zusatzaufträge verwenden",
      "Vollkostenrechnung",
      "Vollkosten nur aus Einzelkosten bilden und Gemeinkosten unberücksichtigt lassen"
    ],
    "correctOption": "C",
    "explanation": "Die Vollkostenrechnung bezieht neben Einzelkosten auch zugerechnete Gemeinkosten ein.",
    "companyEffect": "Sie unterstützt langfristige Preis- und Produktentscheidungen; Marktakzeptanz muss zusätzlich geprüft werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-full-cost",
    "correctAnswer": "Vollkostenrechnung"
  },
  {
    "id": "wbq-rw-030",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-marginal-costing",
    "scenario": "Ein Betrieb hat freie Maschinenkapazität und prüft einen Zusatzauftrag, der variable Kosten deckt und einen positiven Deckungsbeitrag liefert.",
    "question": "Welche Rechnung ist für diese kurzfristige Annahmeentscheidung besonders relevant?",
    "options": [
      "Den Auftrag trotz freier Kapazität annehmen, ohne Liefer- und Qualitätsrisiken zu prüfen",
      "Zusätzlicher Deckungsbeitrag und tatsächlich vermeidbare Mehrkosten",
      "Den Auftrag ablehnen, weil kein fixer Kostenanteil im Stückpreis enthalten ist",
      "Alle bereits entstandenen Fixkosten dem Zusatzauftrag zurechnen"
    ],
    "correctOption": "B",
    "explanation": "Bei freier Kapazität stehen die zusätzlichen Erlöse den Kosten gegenüber, die sich durch den Auftrag tatsächlich ändern.",
    "companyEffect": "Der Auftrag kann das Ergebnis verbessern, sofern keine strategischen, Qualitäts- oder Vertragsrisiken übersehen werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-marginal-costing",
    "correctAnswer": "Zusätzlicher Deckungsbeitrag und tatsächlich vermeidbare Mehrkosten"
  },
  {
    "id": "wbq-rw-031",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-standard-cost",
    "scenario": "Ein Auftrag benötigt 12 Maschinenstunden, obwohl der hinterlegte Richtwert bei 10 Stunden lag.",
    "question": "Welche Aussage erlaubt die Soll-Ist-Abweichung zunächst?",
    "options": [
      "Sie zeigt eine Abweichung, deren Ursache noch untersucht werden muss",
      "Die Überschreitung belegt automatisch mangelnde Leistung der Fachkraft",
      "Der Standard ist stets richtig und muss nicht überprüft werden",
      "Eine Abweichung ist nur relevant, wenn der Kunde den Auftrag beanstandet"
    ],
    "correctOption": "A",
    "explanation": "Eine Abweichung signalisiert Klärungsbedarf; ihre Ursache kann etwa in Komplexität, Stillstand oder unpassendem Richtwert liegen.",
    "companyEffect": "Die Analyse kann Standards, Arbeitsabläufe oder Qualifizierung gezielt verbessern.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-standard-cost",
    "correctAnswer": "Sie zeigt eine Abweichung, deren Ursache noch untersucht werden muss"
  },
  {
    "id": "wbq-rw-032",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-material-price-variance",
    "scenario": "Der Betrieb kauft 500 Kilogramm Material zu 4,20 Euro je Kilogramm statt zum Richtpreis von 4,00 Euro.",
    "question": "Wie hoch ist die Materialpreisabweichung?",
    "options": [
      "100 Euro günstig, weil der tatsächliche Preis über dem Richtpreis liegt",
      "100 Euro ungünstig je Kilogramm und damit 50.000 Euro insgesamt",
      "50 Euro ungünstig, weil die Preisabweichung auf Materialverbrauch bezogen wird",
      "100 Euro ungünstig"
    ],
    "correctOption": "D",
    "explanation": "500 Kilogramm multipliziert mit 0,20 Euro Preisüberschreitung ergeben 100 Euro ungünstige Abweichung.",
    "companyEffect": "Der Einkauf kann Marktbewegung, Lieferantenkonditionen und Bestellzeitpunkt untersuchen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-material-price-variance",
    "correctAnswer": "100 Euro ungünstig"
  },
  {
    "id": "wbq-rw-033",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-material-usage-variance",
    "scenario": "Ein Auftrag verbraucht 120 Kilogramm Material; der Sollverbrauch beträgt 110 Kilogramm bei 5 Euro Richtpreis.",
    "question": "Wie hoch ist die Verbrauchsabweichung zum Richtpreis?",
    "options": [
      "10 Euro ungünstig, weil nur die Mehrmenge bewertet wird",
      "600 Euro ungünstig, weil der gesamte Materialaufwand die Abweichung bildet",
      "50 Euro ungünstig",
      "50 Euro günstig, weil der tatsächliche Verbrauch über dem Soll liegt"
    ],
    "correctOption": "C",
    "explanation": "Die Mehrmenge von 10 Kilogramm wird mit 5 Euro bewertet und ergibt 50 Euro ungünstige Abweichung.",
    "companyEffect": "Fertigung und Qualität können Ausschuss, Einrichtverluste oder einen veralteten Sollverbrauch prüfen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-material-usage-variance",
    "correctAnswer": "50 Euro ungünstig"
  },
  {
    "id": "wbq-rw-034",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-labor-variance",
    "scenario": "Ein Fertigungsauftrag benötigt 12 Arbeitsstunden statt der geplanten 10; der Verrechnungssatz bleibt bei 30 Euro je Stunde.",
    "question": "Wie hoch ist die Lohnzeitabweichung?",
    "options": [
      "360 Euro ungünstig, weil der Gesamtlohnaufwand die Effizienzabweichung bildet",
      "60 Euro ungünstig",
      "60 Euro günstig, weil mehr geleistete Stunden den Auftrag vollständig abdecken",
      "30 Euro ungünstig, weil nur eine zusätzliche Stunde anzusetzen ist"
    ],
    "correctOption": "B",
    "explanation": "Zwei zusätzliche Stunden zu je 30 Euro ergeben 60 Euro ungünstige Abweichung.",
    "companyEffect": "Die Leitung kann Auftragskomplexität, Stillstände, Einarbeitung und Planungsannahmen untersuchen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-labor-variance",
    "correctAnswer": "60 Euro ungünstig"
  },
  {
    "id": "wbq-rw-035",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-fixed-overhead",
    "scenario": "Die gesamten monatlichen Fertigungsfixkosten bleiben bei 10.000 Euro, obwohl die Ausbringung nur halb so hoch ist wie geplant.",
    "question": "Warum kann der Fixkostenanteil je Stück steigen?",
    "options": [
      "Der unveränderte Gesamtbetrag verteilt sich auf weniger Stück",
      "Der Gesamtbetrag der Fixkosten steigt automatisch mit der Stückkostenkennzahl",
      "Die Fixkosten je Stück sinken, weil weniger produziert wird",
      "Bei halbierter Menge halbiert sich die monatliche Fixkostenrechnung"
    ],
    "correctOption": "A",
    "explanation": "Bei sinkender Menge wird derselbe Fixkostenbetrag auf weniger Einheiten verteilt.",
    "companyEffect": "Die Stückkostensteigerung zeigt geringere Auslastung, aber keinen zusätzlichen Zahlungsmittelabfluss.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-fixed-overhead",
    "correctAnswer": "Der unveränderte Gesamtbetrag verteilt sich auf weniger Stück"
  },
  {
    "id": "wbq-rw-036",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-bab",
    "scenario": "Ein Betriebsabrechnungsbogen verteilt Kosten der Hilfskostenstellen auf die Fertigungskostenstellen.",
    "question": "Welchen Zweck erfüllt der BAB?",
    "options": [
      "Den BAB zur Berechnung der Umsatzsteuerzahllast verwenden",
      "Hilfskostenstellen direkt den Kunden in Rechnung stellen, ohne Kostenstellen zuzuordnen",
      "Gemeinkosten vollständig aus der Kalkulation entfernen",
      "Gemeinkosten geordnet erfassen und auf Kostenstellen beziehungsweise Kostenträger verteilen"
    ],
    "correctOption": "D",
    "explanation": "Der BAB unterstützt eine systematische Verrechnung von Gemeinkosten entlang der betrieblichen Leistungsbeziehungen.",
    "companyEffect": "Nachvollziehbare Verteilung verbessert Kalkulation und Kostenkontrolle.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-bab",
    "correctAnswer": "Gemeinkosten geordnet erfassen und auf Kostenstellen beziehungsweise Kostenträger verteilen"
  },
  {
    "id": "wbq-rw-037",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-depreciation-cash",
    "scenario": "Für eine Maschine wird im Geschäftsjahr eine Abschreibung von 8.000 Euro erfasst; es findet kein Verkauf statt.",
    "question": "Entsteht durch die Abschreibung selbst eine Auszahlung von 8.000 Euro?",
    "options": [
      "Die Abschreibung entspricht im selben Jahr der Tilgungsrate der Maschine",
      "Abschreibung ist nur bei Verkauf der Maschine Aufwand",
      "Nein; sie verteilt Anschaffungskosten als Aufwand auf Perioden",
      "Die Abschreibung ist eine regelmäßige Einzahlung, die den Bankbestand erhöht"
    ],
    "correctOption": "C",
    "explanation": "Abschreibung ist eine nicht zahlungswirksame Aufwandsverteilung; der Geldabfluss entstand grundsätzlich beim Erwerb.",
    "companyEffect": "Finanzplanung muss Investitionszahlungen und Abschreibungsaufwand getrennt betrachten.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-depreciation-cash",
    "correctAnswer": "Nein; sie verteilt Anschaffungskosten als Aufwand auf Perioden"
  },
  {
    "id": "wbq-rw-038",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-accounting-equation",
    "scenario": "Die Aktiva betragen 95.300 Euro und die Verbindlichkeiten insgesamt 31.500 Euro.",
    "question": "Welcher Eigenkapitalbetrag stellt die Bilanzgleichung her?",
    "options": [
      "126.800 Euro, weil Aktiva und Schulden zu addieren sind",
      "63.800 Euro",
      "31.500 Euro, weil Eigenkapital den Verbindlichkeiten entspricht",
      "95.300 Euro, weil Eigenkapital der Bilanzsumme entspricht"
    ],
    "correctOption": "B",
    "explanation": "Eigenkapital ergibt sich hier rechnerisch aus 95.300 Euro Aktiva abzüglich 31.500 Euro Verbindlichkeiten.",
    "companyEffect": "Der Saldo stimmt die Bilanz rechnerisch ab, erklärt aber nicht automatisch die Herkunft jeder Eigenkapitalposition.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-accounting-equation",
    "correctAnswer": "63.800 Euro"
  },
  {
    "id": "wbq-rw-039",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-loan-interest",
    "scenario": "Ein Darlehen über 24.000 Euro wird mit nominal 5 Prozent jährlich verzinst; vereinfachend gilt 5 Prozent geteilt durch 12.",
    "question": "Wie hoch ist ein Monatszins vor Rundung?",
    "options": [
      "100 Euro",
      "1.200 Euro Monatszins bei Anwendung des Jahreszinssatzes",
      "100 Euro Tilgung, weil Zins und Tilgung gleich hoch sind",
      "24 Euro Monatszins, weil der Darlehensbetrag durch 1.000 geteilt wird"
    ],
    "correctOption": "A",
    "explanation": "24.000 Euro multipliziert mit 0,05 und geteilt durch 12 ergeben 100 Euro.",
    "companyEffect": "Zinsaufwand und Tilgung sind getrennte Bestandteile des Schuldendienstes.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-loan-interest",
    "correctAnswer": "100 Euro"
  },
  {
    "id": "wbq-rw-040",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-annuity",
    "scenario": "Ein Annuitätendarlehen wird mit konstanter Monatsrate und unverändertem Zinssatz zurückgezahlt.",
    "question": "Wie verändert sich bei sinkender Restschuld typischerweise die Zusammensetzung der Rate?",
    "options": [
      "Der Zinsanteil bleibt konstant, weil auch die Annuität konstant bleibt",
      "Der Tilgungsanteil sinkt, sobald die Restschuld sinkt",
      "Die Monatsrate steigt automatisch mit jeder Tilgung",
      "Der Zinsanteil sinkt und der Tilgungsanteil steigt"
    ],
    "correctOption": "D",
    "explanation": "Zinsen auf eine sinkende Restschuld werden geringer; bei gleichbleibender Rate erhöht sich dadurch der Tilgungsanteil.",
    "companyEffect": "Ein Tilgungsplan unterstützt die Vorschau von Restschuld, Zinsaufwand und Liquiditätsbedarf.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-annuity",
    "correctAnswer": "Der Zinsanteil sinkt und der Tilgungsanteil steigt"
  },
  {
    "id": "wbq-rw-041",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-vat-balance",
    "scenario": "Für einen Voranmeldungszeitraum betragen die Umsatzsteuer 9.500 Euro und die abzugsfähige Vorsteuer 6.100 Euro.",
    "question": "Wie hoch ist der Saldo vor weiteren Korrekturen?",
    "options": [
      "15.600 Euro Zahllast aus der Addition beider Steuerbeträge",
      "6.100 Euro Zahllast, weil nur Vorsteuer zu zahlen ist",
      "3.400 Euro Zahllast",
      "3.400 Euro Erstattung, weil Vorsteuer größer als Umsatzsteuer ist"
    ],
    "correctOption": "C",
    "explanation": "Umsatzsteuer abzüglich abzugsfähiger Vorsteuer ergibt 3.400 Euro Zahllast.",
    "companyEffect": "Der Betrag muss zusätzlich mit dem tatsächlichen Fälligkeitstermin in der Liquiditätsplanung berücksichtigt werden.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-vat-balance",
    "correctAnswer": "3.400 Euro Zahllast"
  },
  {
    "id": "wbq-rw-042",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-invoice-cutoff",
    "scenario": "Eine Leistung wird am 28. Dezember erbracht; die Rechnung wird am 4. Januar erstellt.",
    "question": "Warum ist zum Jahresabschluss eine Prüfung der Periodenabgrenzung erforderlich?",
    "options": [
      "Der Dezemberumsatz ist steuerfrei, weil die Rechnung im Folgejahr erstellt wird",
      "Leistungszeitpunkt und Rechnungsdatum können für Ergebnis und Steuerzeitraum unterschiedlich relevant sein",
      "Die Leistung gehört immer in den Januar, weil dann die Rechnung ausgestellt wurde",
      "Die Umsatzsteuer entsteht stets am Zahlungstag, unabhängig von der Besteuerungsart"
    ],
    "correctOption": "B",
    "explanation": "Bilanzielle und umsatzsteuerliche Zuordnung richten sich nach den jeweils einschlägigen Regeln und dem konkreten Sachverhalt, nicht allein nach dem Rechnungsdatum.",
    "companyEffect": "Eine Prüfung verhindert falsch ausgewiesene Erlöse, Bestände und Steuerbeträge.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-invoice-cutoff",
    "correctAnswer": "Leistungszeitpunkt und Rechnungsdatum können für Ergebnis und Steuerzeitraum unterschiedlich relevant sein"
  },
  {
    "id": "wbq-rw-043",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cash-budget",
    "scenario": "Für den 15. sind 18.000 Euro Lohnzahlung geplant; ein Kundeneingang von 15.000 Euro wird erst am 20. erwartet.",
    "question": "Was macht ein Liquiditätsplan in dieser Situation sichtbar?",
    "options": [
      "Eine mögliche zeitliche Lücke von 18.000 Euro vor dem späteren Zahlungseingang",
      "Eine Lücke von 3.000 Euro, weil nur die Differenz der Beträge zählt und Anfangsbestand immer null ist",
      "Ein Überschuss von 3.000 Euro, weil der Eingang den Lohnzahlungstermin vorzieht",
      "Kein Liquiditätsproblem, weil der Kundeneingang noch im selben Monat erfolgt"
    ],
    "correctOption": "A",
    "explanation": "Der geplante Abfluss liegt fünf Tage vor dem erwarteten Zufluss; verfügbare Anfangsliquidität ist zusätzlich zu berücksichtigen.",
    "companyEffect": "Die Geschäftsführung kann frühzeitig Finanzierung oder eine zulässige Terminmaßnahme prüfen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cash-budget",
    "correctAnswer": "Eine mögliche zeitliche Lücke von 18.000 Euro vor dem späteren Zahlungseingang"
  },
  {
    "id": "wbq-rw-044",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-variance-controllability",
    "scenario": "Die Stromkosten steigen, weil der Versorger den Tarif erhöht; der Energieverbrauch bleibt konstant.",
    "question": "Wie sollte die Abweichung ausgewertet werden?",
    "options": [
      "Die Tarifänderung vollständig dem Produktionsleiter zurechnen",
      "Energieverbrauch als alleinige Ursache annehmen, obwohl er konstant ist",
      "Die gesamte Kostensteigerung als nicht beeinflussbar aus der Analyse ausschließen",
      "Preisänderung von beeinflussbarem Verbrauch unterscheiden"
    ],
    "correctOption": "D",
    "explanation": "Die Abweichung sollte in externe Preiswirkung und betrieblich beeinflussbare Verbrauchsmenge getrennt werden.",
    "companyEffect": "So kann die Leitung gezielte Effizienzmaßnahmen prüfen und vermeidet ungerechte Leistungsbeurteilungen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-variance-controllability",
    "correctAnswer": "Preisänderung von beeinflussbarem Verbrauch unterscheiden"
  },
  {
    "id": "wbq-rw-045",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-segment-reporting",
    "scenario": "Eine Produktlinie erzielt hohe Umsätze, aber dauerhaft einen negativen Deckungsbeitrag.",
    "question": "Welcher Bericht unterstützt die wirtschaftliche Beurteilung am besten?",
    "options": [
      "Den gesamten Unternehmensfixkostenanteil vollständig der Produktlinie zurechnen, unabhängig von Vermeidbarkeit",
      "Die Linie allein nach Umsatzhöhe weiterführen",
      "Eine Produktsegmentrechnung mit Erlösen, variablen Kosten und sorgfältig behandelten Fixkosten",
      "Die Produktlinie einstellen, sobald ein negativer Deckungsbeitrag ausgewiesen ist"
    ],
    "correctOption": "C",
    "explanation": "Die Segmentrechnung stellt Erlöse und zurechenbare Kosten gegenüber; eine pauschale Fixkostenverteilung kann Entscheidungen verzerren.",
    "companyEffect": "Die Leitung kann Preis, Ablauf oder Fortführung prüfen und dabei strategische Wechselwirkungen berücksichtigen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-segment-reporting",
    "correctAnswer": "Eine Produktsegmentrechnung mit Erlösen, variablen Kosten und sorgfältig behandelten Fixkosten"
  },
  {
    "id": "wbq-rw-046",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-capital-budget",
    "scenario": "Eine Investition kostet heute 20.000 Euro; in einem Jahr werden 22.000 Euro Rückfluss erwartet. Der Kalkulationszins beträgt 5 Prozent.",
    "question": "Wie hoch ist der ungefähre Kapitalwert?",
    "options": [
      "Rund 952 Euro positiv und damit ist die Investition unabhängig von Risiko und Finanzierung sicher",
      "Rund 952 Euro positiv",
      "Rund 1.000 Euro negativ, weil die Auszahlung um 5 Prozent erhöht wird",
      "2.000 Euro positiv, weil die Differenz der Zahlungen nicht abzuzinsen ist"
    ],
    "correctOption": "B",
    "explanation": "22.000 Euro geteilt durch 1,05 abzüglich 20.000 Euro ergeben rund 952 Euro.",
    "companyEffect": "Unter den Annahmen übersteigt der abgezinste Rückfluss die Auszahlung; Risiken und Prognosegüte bleiben zu prüfen.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-capital-budget",
    "correctAnswer": "Rund 952 Euro positiv"
  },
  {
    "id": "wbq-rw-047",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-bad-debt",
    "scenario": "Ein Kunde gerät in erhebliche Zahlungsschwierigkeiten; eine überfällige Forderung ist noch offen.",
    "question": "Was sollte die Finanzabteilung zum Stichtag beurteilen?",
    "options": [
      "Die Einbringlichkeit und einen gegebenenfalls nötigen Wertberichtigungsbedarf",
      "Die Forderung auf null setzen, sobald ein Kunde finanzielle Schwierigkeiten meldet",
      "Den vollen Betrag als Zahlungsmittel erfassen, weil er noch offen ist",
      "Eine Rückstellung auf der Passivseite ansetzen, ohne Werthaltigkeit der Forderung zu prüfen"
    ],
    "correctOption": "A",
    "explanation": "Forderungen müssen nach den anzuwendenden Regeln auf ihre Werthaltigkeit geprüft werden.",
    "companyEffect": "Eine rechtzeitige Einschätzung verhindert überhöhte Vermögens- und Ergebnisdarstellung.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-bad-debt",
    "correctAnswer": "Die Einbringlichkeit und einen gegebenenfalls nötigen Wertberichtigungsbedarf"
  },
  {
    "id": "wbq-rw-048",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-working-capital-cycle",
    "scenario": "Ein Betrieb verkürzt die Fertigungsdurchlaufzeit; Zahlungsziele der Kunden bleiben gleich.",
    "question": "Welcher Abschnitt des Geldumschlags kann dadurch unmittelbar kürzer werden?",
    "options": [
      "Die Forderungslaufzeit sinkt automatisch mit der Fertigungszeit",
      "Das Lieferantenziel wird durch schnellere Produktion automatisch kürzer",
      "Der gesamte Geldumschlag ist verkürzt, unabhängig von Lager und Zahlungskonditionen",
      "Die Kapitalbindung in unfertigen Erzeugnissen"
    ],
    "correctOption": "D",
    "explanation": "Weniger Zeit in der Fertigung kann die Bindung in der unfertigen Produktion senken, sofern andere Prozessstufen den Effekt nicht aufheben.",
    "companyEffect": "Ein kürzerer Produktionszyklus kann Betriebskapital freisetzen und die Lieferzeit verbessern.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-working-capital-cycle",
    "correctAnswer": "Die Kapitalbindung in unfertigen Erzeugnissen"
  },
  {
    "id": "wbq-rw-049",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-cost-volume-profit",
    "scenario": "Der Deckungsbeitrag je Stück beträgt 40 Euro; die Fixkosten liegen bei 16.000 Euro. Geplant sind 500 Stück.",
    "question": "Welches Betriebsergebnis ergibt sich unter diesen Annahmen?",
    "options": [
      "20.000 Euro Gewinn vor Berücksichtigung der Fixkosten",
      "4.000 Euro Gewinn, auch wenn Absatz und Deckungsbeitrag unsicher sind",
      "4.000 Euro Gewinn",
      "4.000 Euro Verlust, weil Fixkosten den Deckungsbeitrag übersteigen"
    ],
    "correctOption": "C",
    "explanation": "500 Stück mal 40 Euro ergeben 20.000 Euro Deckungsbeitrag; nach Abzug der Fixkosten bleiben 4.000 Euro.",
    "companyEffect": "Der Plan zeigt einen positiven Puffer, bleibt aber von Menge und Preis abhängig.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-cost-volume-profit",
    "correctAnswer": "4.000 Euro Gewinn"
  },
  {
    "id": "wbq-rw-050",
    "areaId": "wbq-rechnungswesen",
    "competenceId": "rw-accounting-controls",
    "scenario": "Eine Beschäftigte legt Lieferanten an, prüft Rechnungen und gibt Zahlungen frei.",
    "question": "Welche interne Kontrolle verringert Fehler- und Missbrauchsrisiken am ehesten?",
    "options": [
      "Zahlungen nur nach Bankausführung stichprobenartig prüfen, ohne Belegprüfung",
      "Unvereinbare Aufgaben trennen oder eine unabhängige Gegenprüfung einführen",
      "Eine zusätzliche Freigabe durch dieselbe Beschäftigte einführen",
      "Alle Lieferantenstammdaten für das gesamte Team freigeben"
    ],
    "correctOption": "B",
    "explanation": "Funktionstrennung oder eine wirksame unabhängige Kontrolle reduziert das Risiko nicht erkannter Fehler und unberechtigter Zahlungen.",
    "companyEffect": "Kontrollen schützen Zahlungsmittel und erhöhen die Verlässlichkeit der Buchführung.",
    "sourceRef": "MAP-WBQ-RW",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rw-accounting-controls",
    "correctAnswer": "Unvereinbare Aufgaben trennen oder eine unabhängige Gegenprüfung einführen"
  },
  {
    "id": "wbq-rt-026",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-legal-person",
    "scenario": "Eine GmbH bestellt im eigenen Namen Fertigungsmaterial.",
    "question": "Wer ist grundsätzlich Vertragspartner des Lieferanten?",
    "options": [
      "Die GmbH und ihr Mehrheitsgesellschafter sind für jeden Vertrag dieselbe Person",
      "Die GmbH als eigene juristische Person",
      "Die GmbH ist nur dann Vertragspartner, wenn jeder Gesellschafter separat unterschreibt",
      "Der Geschäftsführer wird automatisch selbst Vertragspartner eines Vertrags im Namen der GmbH"
    ],
    "correctOption": "B",
    "explanation": "Die GmbH kann als juristische Person selbst Rechte und Pflichten eingehen.",
    "companyEffect": "Die korrekte Zuordnung zeigt, wer Zahlung und Leistung schuldet.",
    "sourceRef": "LAW-GMBHG-13",
    "sourceKind": "law",
    "tooltipKey": "rt-legal-person",
    "correctAnswer": "Die GmbH als eigene juristische Person"
  },
  {
    "id": "wbq-rt-027",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-commercial-register",
    "scenario": "Ein Kunde möchte prüfen, welche Personen einen Lieferanten wirksam vertreten dürfen.",
    "question": "Welche öffentliche Informationsquelle ist dafür besonders geeignet?",
    "options": [
      "Der einschlägige Handelsregistereintrag",
      "Eine Handelsregisterauskunft zeigt jede interne Einkaufsgrenze eines Mitarbeiters",
      "Eine Visitenkarte belegt allein die gesetzliche Vertretungsmacht",
      "Ein aktueller Handelsregisterauszug ist für Vertretungsfragen stets entbehrlich, wenn der Ansprechpartner lange bekannt ist"
    ],
    "correctOption": "A",
    "explanation": "Im Handelsregister finden sich gesetzlich vorgesehene Unternehmens- und Vertretungsangaben.",
    "companyEffect": "Die Prüfung der Vertretungsmacht vermindert das Risiko, mit einer unbefugten Person abzuschließen.",
    "sourceRef": "LAW-HGB-10",
    "sourceKind": "law",
    "tooltipKey": "rt-commercial-register",
    "correctAnswer": "Der einschlägige Handelsregistereintrag"
  },
  {
    "id": "wbq-rt-028",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-procurement-authority",
    "scenario": "Ein Fertigungsleiter bestellt ohne erkennbare Einkaufsbefugnis eine teure Maschine.",
    "question": "Was sollte vor Anerkennung der Bestellung geprüft werden?",
    "options": [
      "Jede interne Kompetenzüberschreitung macht den Vertrag mit dem Lieferanten automatisch unwirksam",
      "Eine Person ist gegenüber Dritten stets vertretungsberechtigt, wenn sie intern eine Führungsrolle hat",
      "Eine Vollmacht kann nur schriftlich und notariell erteilt werden",
      "Interne Vollmachten, Delegation und Umstände einer möglichen Vertretungsmacht"
    ],
    "correctOption": "D",
    "explanation": "Interne Zuständigkeit und Außenwirkung einer Erklärung müssen anhand von Vollmacht und konkreten Umständen geprüft werden.",
    "companyEffect": "Freigaberegeln verhindern ungewollte Verpflichtungen, ohne berechtigte Ansprüche des Lieferanten zu übergehen.",
    "sourceRef": "LAW-BGB-164-DIRECT;LAW-BGB-167-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-procurement-authority",
    "correctAnswer": "Interne Vollmachten, Delegation und Umstände einer möglichen Vertretungsmacht"
  },
  {
    "id": "wbq-rt-029",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-standard-terms",
    "scenario": "Der Betrieb übersendet seine Allgemeinen Geschäftsbedingungen erst, nachdem der Kunde das Angebot angenommen hat.",
    "question": "Welche Frage ist für die Einbeziehung der Bedingungen entscheidend?",
    "options": [
      "AGB werden auch ohne Hinweis Vertragsbestandteil, sobald sie auf der Website stehen",
      "AGB sind immer einbezogen, wenn eine Rechnung auf sie verweist",
      "Ob die Bedingungen rechtzeitig und wirksam Vertragsbestandteil geworden sind",
      "Nachträgliche Übersendung reicht grundsätzlich aus, wenn der Kunde die AGB später nicht beanstandet"
    ],
    "correctOption": "C",
    "explanation": "Allgemeine Geschäftsbedingungen müssen nach den anwendbaren Regeln wirksam einbezogen werden; der Zeitpunkt ist relevant.",
    "companyEffect": "Spät übersandte Bedingungen können für den Vertrag ohne Wirkung bleiben.",
    "sourceRef": "LAW-BGB-305",
    "sourceKind": "law",
    "tooltipKey": "rt-standard-terms",
    "correctAnswer": "Ob die Bedingungen rechtzeitig und wirksam Vertragsbestandteil geworden sind"
  },
  {
    "id": "wbq-rt-030",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-form-requirements",
    "scenario": "Zwei Unternehmen schließen eine gewöhnliche Bestellung telefonisch ab; eine besondere Form ist nicht gesetzlich vorgeschrieben.",
    "question": "Welche Aussage zur Vertragsform ist im Grundsatz richtig?",
    "options": [
      "Eine E-Mail kann nie eine wirksame Annahme enthalten",
      "Viele Verträge können formfrei geschlossen werden; gesetzliche oder vereinbarte Formvorschriften bleiben möglich",
      "Eine mündliche Bestellung ist unwirksam, sobald eine Partei sie später bestreitet",
      "Formfreiheit bedeutet, dass es keine gesetzlichen Formausnahmen gibt"
    ],
    "correctOption": "B",
    "explanation": "Im deutschen Zivilrecht gilt grundsätzlich Formfreiheit, soweit keine besondere Form vorgeschrieben oder vereinbart ist.",
    "companyEffect": "Schriftliche Bestätigung bleibt aus Beweis- und Abwicklungsgründen sinnvoll.",
    "sourceRef": "LAW-BGB-125",
    "sourceKind": "law",
    "tooltipKey": "rt-form-requirements",
    "correctAnswer": "Viele Verträge können formfrei geschlossen werden; gesetzliche oder vereinbarte Formvorschriften bleiben möglich"
  },
  {
    "id": "wbq-rt-031",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-commercial-payment",
    "scenario": "Eine Lieferantenrechnung mit festgelegtem Zahlungstermin ist überfällig.",
    "question": "Welche Angaben sind vor einer Prüfung möglicher Verzugsfolgen wichtig?",
    "options": [
      "Fälligkeit, Zugang, Vertragsbedingungen und einschlägige gesetzliche Voraussetzungen",
      "Verzug tritt stets erst nach einer Mahnung ein, auch wenn ein kalendermäßig bestimmter Termin verstrichen ist",
      "Die Fälligkeit ist unerheblich, sobald der Lieferant eine Mahnung sendet",
      "Verzugszinsen sind unabhängig von Schuldnerstatus und Geschäftsvorgang stets gleich hoch"
    ],
    "correctOption": "A",
    "explanation": "Verzug und mögliche Kosten hängen von Fälligkeit, Umständen des Schuldners und den geltenden Vertrags- und Gesetzesregeln ab.",
    "companyEffect": "Eine zuverlässige Fälligkeitskontrolle vermeidet Zusatzkosten und schützt Lieferantenbeziehungen.",
    "sourceRef": "LAW-BGB-286-DIRECT;LAW-BGB-288-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-commercial-payment",
    "correctAnswer": "Fälligkeit, Zugang, Vertragsbedingungen und einschlägige gesetzliche Voraussetzungen"
  },
  {
    "id": "wbq-rt-032",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-retention-title",
    "scenario": "Ein Lieferant vereinbart, dass das Eigentum an gelieferten Rohstoffen bis zur vollständigen Zahlung bei ihm verbleibt.",
    "question": "Was sollte der Käufer bei der Bestands- und Sicherheitenprüfung beachten?",
    "options": [
      "Eigentum geht trotz wirksam vereinbartem Vorbehalt stets bei Anlieferung über",
      "Der Eigentumsvorbehalt bewirkt automatisch, dass der Käufer nie Besitzer wird",
      "Vorbehaltseigentum bleibt auch nach vollständiger Zahlung beim Lieferanten",
      "Den vereinbarten Eigentumsvorbehalt und seinen Umfang"
    ],
    "correctOption": "D",
    "explanation": "Ein Eigentumsvorbehalt kann den Eigentumsübergang bis zur Zahlung hinausschieben; die konkrete Klausel ist entscheidend.",
    "companyEffect": "Bestands- und Finanzierungsunterlagen sollten die Eigentums- und Sicherheitenlage korrekt abbilden.",
    "sourceRef": "LAW-BGB-449",
    "sourceKind": "law",
    "tooltipKey": "rt-retention-title",
    "correctAnswer": "Den vereinbarten Eigentumsvorbehalt und seinen Umfang"
  },
  {
    "id": "wbq-rt-033",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-purchase-warranty",
    "scenario": "Eine gekaufte Maschine kommt mit einem Sachmangel an; die Gewährleistungsfrist läuft noch.",
    "question": "Welcher erste Schritt unterstützt die Durchsetzung möglicher Mängelrechte?",
    "options": [
      "Nacherfüllung ist ausgeschlossen, wenn der Käufer den Mangel dokumentiert",
      "Der Käufer kann ohne Prüfung des Vertrags stets Ersatzlieferung statt Reparatur verlangen",
      "Mangel dokumentieren, Verkäufer informieren und Nacherfüllung prüfen",
      "Der Käufer darf die Maschine sofort entsorgen, sobald ein Mangel festgestellt ist"
    ],
    "correctOption": "C",
    "explanation": "BGB § 439 regelt die Nacherfüllung im Kaufrecht; Anspruch und Ablauf hängen von Vertrag und Sachverhalt ab.",
    "companyEffect": "Eine zeitnahe, belegte Mängelmeldung kann die Reparatur oder Ersatzlieferung beschleunigen.",
    "sourceRef": "LAW-BGB-439-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-purchase-warranty",
    "correctAnswer": "Mangel dokumentieren, Verkäufer informieren und Nacherfüllung prüfen"
  },
  {
    "id": "wbq-rt-034",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-work-defect",
    "scenario": "Ein Kunde beanstandet, dass ein gefertigter Halter die vereinbarte Toleranz überschreitet.",
    "question": "Welche Unterlagen helfen am besten bei der technischen und rechtlichen Prüfung?",
    "options": [
      "Eine Abnahme schließt jede spätere Prüfung der vereinbarten Beschaffenheit aus",
      "Vereinbarte Zeichnung, Revisionsstand, Messprotokoll und Abnahmeunterlagen",
      "Ein Messwert außerhalb der Toleranz beweist ohne Prüfung von Zeichnung und Messverfahren stets einen Werkmangel",
      "Die zuletzt intern verwendete Zeichnung ist maßgeblich, auch wenn sie nie vereinbart wurde"
    ],
    "correctOption": "B",
    "explanation": "Der Mangel ist anhand der vereinbarten Beschaffenheit und der tatsächlich gelieferten Arbeit zu beurteilen.",
    "companyEffect": "Nachvollziehbare Messwerte ermöglichen eine sachliche Korrektur und verhindern unnötige Eskalation.",
    "sourceRef": "LAW-BGB-633-DIRECT;LAW-BGB-634-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-work-defect",
    "correctAnswer": "Vereinbarte Zeichnung, Revisionsstand, Messprotokoll und Abnahmeunterlagen"
  },
  {
    "id": "wbq-rt-035",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-remedy-costs",
    "scenario": "Der Betrieb muss ein eigenes mangelhaftes Werk nachbessern.",
    "question": "Welche Kosten sollte er für die wirtschaftliche Auswertung berücksichtigen?",
    "options": [
      "Arbeitszeit, Material, erneute Prüfung, Transport und relevante Folgewirkungen",
      "Nur Material und Arbeitszeit erfassen und erneute Prüfung oder Transport grundsätzlich auslassen",
      "Jede Reklamation als voller Auftragsverlust verbuchen, unabhängig von Abhilfe und Folgekosten",
      "Nachbesserungskosten dem nächsten Kundenauftrag zuordnen, um dessen Marge zu prüfen"
    ],
    "correctOption": "A",
    "explanation": "Die Nachbesserung kann neben Material und Arbeitszeit weitere sachverhaltsabhängige Kosten verursachen.",
    "companyEffect": "Eine vollständige Erfassung zeigt Fehlerkosten und unterstützt gezielte Prävention.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-remedy-costs",
    "correctAnswer": "Arbeitszeit, Material, erneute Prüfung, Transport und relevante Folgewirkungen"
  },
  {
    "id": "wbq-rt-036",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-vat-tax-point",
    "scenario": "Eine Dienstleistung wird in einem Zeitraum ausgeführt, die Rechnung folgt erst danach.",
    "question": "Was muss die Buchhaltung für die Umsatzsteuer zeitlich prüfen?",
    "options": [
      "Der Rechnungstag bestimmt in jedem Fall den Zeitpunkt der Steuerentstehung",
      "Bei späterer Rechnung entsteht Umsatzsteuer grundsätzlich erst nach Zahlungseingang",
      "Eine Leistung in einem Zeitraum und Abrechnung im nächsten Zeitraum erfordert keine Periodenprüfung",
      "Den maßgeblichen Steuerentstehungszeitpunkt anhand von Leistungsart und Sachverhalt"
    ],
    "correctOption": "D",
    "explanation": "Der Zeitpunkt der Steuerentstehung richtet sich nach dem Umsatzsteuergesetz und den konkreten Umständen, nicht stets allein nach Rechnung oder Zahlung.",
    "companyEffect": "Die korrekte Periodenzuordnung vermeidet verspätete Meldungen und Berichtigungsaufwand.",
    "sourceRef": "LAW-USTG-13",
    "sourceKind": "law",
    "tooltipKey": "rt-vat-tax-point",
    "correctAnswer": "Den maßgeblichen Steuerentstehungszeitpunkt anhand von Leistungsart und Sachverhalt"
  },
  {
    "id": "wbq-rt-037",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-reverse-charge",
    "scenario": "Ein deutscher Betrieb bezieht eine Dienstleistung von einem ausländischen Anbieter.",
    "question": "Welche umsatzsteuerliche Prüfung ist vor der Buchung besonders wichtig?",
    "options": [
      "Reverse Charge gilt bei jedem grenzüberschreitenden Kauf unabhängig von Leistungsart und Ort",
      "Bei Anwendung des Reverse-Charge-Verfahrens entfällt jede Erklärungspflicht des Leistungsempfängers",
      "Leistungsort und mögliche Steuerschuldnerschaft des Leistungsempfängers",
      "Bei ausländischen Lieferanten ist die Umsatzsteuer stets vom Lieferanten im Sitzstaat abzuführen"
    ],
    "correctOption": "C",
    "explanation": "Bei grenzüberschreitenden Leistungen können Leistungsort- und Reverse-Charge-Regeln gelten.",
    "companyEffect": "Eine zutreffende Prüfung kann sowohl die Erklärung der Umsatzsteuer als auch einen Vorsteuerabzug betreffen.",
    "sourceRef": "LAW-USTG-3A-DIRECT;LAW-USTG-13B-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-reverse-charge",
    "correctAnswer": "Leistungsort und mögliche Steuerschuldnerschaft des Leistungsempfängers"
  },
  {
    "id": "wbq-rt-038",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-vat-correction",
    "scenario": "Nachträglich wird der vereinbarte Preis einer steuerpflichtigen Lieferung durch eine Gutschrift herabgesetzt.",
    "question": "Wie sollte die Buchhaltung mit der Preisänderung umgehen?",
    "options": [
      "Der ursprüngliche Beleg ist zu löschen, sobald eine Gutschrift ausgegeben wurde",
      "Sie der ursprünglichen Lieferung zuordnen und die Steuerunterlagen entsprechend berichtigen",
      "Eine Entgeltminderung beeinflusst den ursprünglichen Umsatzsteuerbetrag nicht",
      "Die Gutschrift wird als neue steuerfreie Lieferung behandelt, unabhängig vom Anlass"
    ],
    "correctOption": "B",
    "explanation": "Eine Entgeltminderung kann die umsatzsteuerliche Bemessungsgrundlage verändern und muss belegbar mit dem Ursprungsvorgang verbunden werden.",
    "companyEffect": "Korrekte Gutschriften halten Umsatz und Steuerzahllast nachvollziehbar.",
    "sourceRef": "LAW-USTG-17",
    "sourceKind": "law",
    "tooltipKey": "rt-vat-correction",
    "correctAnswer": "Sie der ursprünglichen Lieferung zuordnen und die Steuerunterlagen entsprechend berichtigen"
  },
  {
    "id": "wbq-rt-039",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-business-record-retention",
    "scenario": "Die Geschäftsführung möchte elektronische Rechnungen nach sechs Monaten löschen.",
    "question": "Was ist vor einer Löschung zu prüfen?",
    "options": [
      "Aufbewahrungsfristen, Format, Lesbarkeit und Zugriffspflichten für die jeweilige Belegart",
      "Elektronische Rechnungen können nach Zahlung stets vernichtet werden",
      "Aufbewahrungsfristen gelten nur für Papierbelege",
      "Ein Backup allein ersetzt jede Anforderung an Lesbarkeit und Verfügbarkeit"
    ],
    "correctOption": "A",
    "explanation": "Handels- und steuerrechtliche Aufbewahrungspflichten unterscheiden sich nach Dokumenttyp und geltendem Recht.",
    "companyEffect": "Ein geeignetes Archiv bewahrt Prüfungsnachweise und Belege für spätere Ansprüche.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-business-record-retention",
    "correctAnswer": "Aufbewahrungsfristen, Format, Lesbarkeit und Zugriffspflichten für die jeweilige Belegart"
  },
  {
    "id": "wbq-rt-040",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-tax-advice",
    "scenario": "Eine grenzüberschreitende Steuerfrage könnte die Kalkulation eines großen Auftrags wesentlich verändern.",
    "question": "Wie sollte die Geschäftsführung vor einer verbindlichen Preiszusage vorgehen?",
    "options": [
      "Eine fachliche Beratung ist entbehrlich, wenn der Auftrag bereits profitabel erscheint",
      "Ein Forenbeitrag genügt als Nachweis, wenn er dieselbe Steuerart behandelt",
      "Die steuerliche Unsicherheit kann ohne Prüfung vollständig in den Verkaufspreis eingerechnet werden",
      "Sachverhalt dokumentieren und qualifizierte Steuerberatung einholen"
    ],
    "correctOption": "D",
    "explanation": "Komplexe steuerliche Folgen hängen vom konkreten Sachverhalt ab und sollten qualifiziert sowie anhand aktueller Regeln geprüft werden.",
    "companyEffect": "Eine frühzeitige Klärung verringert das Risiko einer Fehlkalkulation und unerwarteter Steuerbelastungen.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-tax-advice",
    "correctAnswer": "Sachverhalt dokumentieren und qualifizierte Steuerberatung einholen"
  },
  {
    "id": "wbq-rt-041",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-employment-hours",
    "scenario": "Ein Vorgesetzter plant jede Woche Arbeitszeiten oberhalb der vereinbarten Stunden.",
    "question": "Welche Prüfung sollte die Personalabteilung vornehmen?",
    "options": [
      "Eine Unterschrift der Beschäftigten hebt gesetzliche Arbeitszeitgrenzen auf",
      "Vertraglich vereinbarte Stunden gelten unabhängig von tatsächlicher Schichtlänge und Pausen",
      "Arbeitsvertrag, Arbeitszeitgesetz, Ruhezeiten und anwendbare Vereinbarungen",
      "Eine Wochenplanung kann tägliche Höchstarbeitszeit und Ruhezeit ersetzen"
    ],
    "correctOption": "C",
    "explanation": "Arbeitszeit wird durch gesetzliche Grenzen, Ruhezeiten sowie Arbeits- und Kollektivvereinbarungen bestimmt.",
    "companyEffect": "Rechtmäßige Schichtplanung schützt Gesundheit und reduziert arbeitsrechtliche Risiken.",
    "sourceRef": "LAW-ARBZG-3-DIRECT;LAW-ARBZG-5-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-employment-hours",
    "correctAnswer": "Arbeitsvertrag, Arbeitszeitgesetz, Ruhezeiten und anwendbare Vereinbarungen"
  },
  {
    "id": "wbq-rt-042",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-sick-leave",
    "scenario": "Eine Beschäftigte meldet sich krank und kann ihre geplante Schicht nicht antreten.",
    "question": "Wie sollte der Betrieb zunächst reagieren?",
    "options": [
      "Krankheitsbedingte Abwesenheit ist als Urlaub zu erfassen, sobald Ersatz benötigt wird",
      "Abwesenheit nach Verfahren erfassen, Ersatz planen und Gesundheitsdaten vertraulich behandeln",
      "Eine Krankmeldung erlaubt dem Arbeitgeber, die Diagnose allgemein im Betrieb zu veröffentlichen",
      "Gesundheitsdaten sind für Personalplanung frei zugänglich, sofern sie nicht an Kunden gehen"
    ],
    "correctOption": "B",
    "explanation": "Das Abwesenheitsmanagement muss geltende Beschäftigungsregeln und den Schutz sensibler Gesundheitsdaten beachten.",
    "companyEffect": "Verlässliche Erfassung hält Kapazitätsplanung korrekt und schützt die Privatsphäre.",
    "sourceRef": "LAW-DSGVO-9-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-sick-leave",
    "correctAnswer": "Abwesenheit nach Verfahren erfassen, Ersatz planen und Gesundheitsdaten vertraulich behandeln"
  },
  {
    "id": "wbq-rt-043",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-annual-leave",
    "scenario": "Eine Vollzeitkraft arbeitet an sechs Tagen pro Woche.",
    "question": "Wie hoch ist der gesetzliche Mindesturlaub nach BUrlG § 3 bei dieser Sechstagewoche?",
    "options": [
      "24 Werktage",
      "Bei einer Sechstagewoche gilt ein Mindestanspruch von 20 Werktagen",
      "24 Werktage entsprechen bei jeder Arbeitswoche vier Wochen plus einem zusätzlichen Urlaubstag",
      "Der gesetzliche Anspruch richtet sich nach gearbeiteten Stunden, nicht nach Arbeitstagen"
    ],
    "correctOption": "A",
    "explanation": "BUrlG § 3 legt den Mindesturlaub mit 24 Werktagen auf Basis einer Sechstagewoche fest.",
    "companyEffect": "Für andere Wochenmodelle muss der Anspruch entsprechend der regelmäßigen Arbeitstage betrachtet werden.",
    "sourceRef": "LAW-BURLG-3",
    "sourceKind": "law",
    "tooltipKey": "rt-annual-leave",
    "correctAnswer": "24 Werktage"
  },
  {
    "id": "wbq-rt-044",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-apprentice-supervision",
    "scenario": "Ein Auszubildender soll ohne Einweisung und Aufsicht an einer gefährlichen Maschine arbeiten.",
    "question": "Welcher Pflichtenkonflikt liegt vor?",
    "options": [
      "Auszubildende können aus Zeitdruck ohne Einweisung an einer gefährlichen Maschine eingesetzt werden",
      "Eine Unterweisung ist nur erforderlich, wenn ein Unfall bereits passiert ist",
      "Ausbildungsziel und Arbeitsschutz sind alternative Pflichten; der Betrieb kann eine davon wählen",
      "Ausbildungsziel und Arbeitsschutz verlangen geeignete Anleitung und sichere Aufgaben"
    ],
    "correctOption": "D",
    "explanation": "Ausbildungspflichten nach BBiG und Arbeitsschutzanforderungen gelten nebeneinander; der konkrete Einsatz muss geeignet und sicher sein.",
    "companyEffect": "Qualifizierte Aufsicht schützt Lernende und verhindert gefährliche Produktionsfehler.",
    "sourceRef": "LAW-BBIG-14;LAW-ARBSCHG-3-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-apprentice-supervision",
    "correctAnswer": "Ausbildungsziel und Arbeitsschutz verlangen geeignete Anleitung und sichere Aufgaben"
  },
  {
    "id": "wbq-rt-045",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-consumer-withdrawal",
    "scenario": "Ein Verbraucher bestellt Ware über den Onlineshop des Unternehmens.",
    "question": "Was sollte der Vertrieb vor der Annahme prüfen?",
    "options": [
      "Ein gewerblicher Käufer hat bei Fernabsatz automatisch dieselben Widerrufsrechte wie Verbraucher",
      "Die Widerrufsbelehrung ist nur erforderlich, wenn der Kunde ausdrücklich danach fragt",
      "Ob Informations- und Widerrufspflichten für den Fernabsatz gelten",
      "Jeder Onlinekauf kann ohne Ausnahmen widerrufen werden"
    ],
    "correctOption": "C",
    "explanation": "Fernabsatzverträge mit Verbrauchern können Informations- und Widerrufsrechte auslösen; gesetzliche Ausnahmen sind gesondert zu prüfen.",
    "companyEffect": "Ein regelkonformer Bestellablauf vermeidet Streit, Rückabwicklung und aufsichtsrechtliche Risiken.",
    "sourceRef": "LAW-BGB-312G-DIRECT;LAW-BGB-355-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-consumer-withdrawal",
    "correctAnswer": "Ob Informations- und Widerrufspflichten für den Fernabsatz gelten"
  },
  {
    "id": "wbq-rt-046",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-agency",
    "scenario": "Eine Handelsvertretung verhandelt einen Kundenauftrag im Namen des Betriebs.",
    "question": "Was sollte das Unternehmen zur Reichweite der Zusagen prüfen?",
    "options": [
      "Eine mündliche Erklärung eines Vertreters kann grundsätzlich keine rechtliche Wirkung haben",
      "Die erteilte Vertretungsmacht und interne Vollmachtsgrenzen",
      "Eine Handelsvertretung kann jede Vertragsänderung zusagen, auch außerhalb des erteilten Mandats",
      "Interne Vollmachtsgrenzen sind einem Kunden gegenüber immer unbeachtlich"
    ],
    "correctOption": "B",
    "explanation": "Vertretungsmacht bestimmt, in welchem Umfang Handlungen einer Vertreterin dem Unternehmen zugerechnet werden.",
    "companyEffect": "Klare Vollmachten verhindern ungewollte Preis-, Termin- oder Gewährleistungszusagen.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-agency",
    "correctAnswer": "Die erteilte Vertretungsmacht und interne Vollmachtsgrenzen"
  },
  {
    "id": "wbq-rt-047",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-insolvency-duty",
    "scenario": "Ein Unternehmen kann fällige Schulden dauerhaft nicht bezahlen; eine kurzfristige Erholung ist nicht absehbar.",
    "question": "Was muss die Geschäftsführung vorrangig veranlassen?",
    "options": [
      "Insolvenzreife und gesetzliche Handlungspflichten umgehend fachkundig prüfen lassen",
      "Zahlungsunfähigkeit liegt erst vor, wenn ein Insolvenzgericht ein Verfahren eröffnet",
      "Die Geschäftsleitung kann den Antrag aufschieben, solange noch Vermögenswerte vorhanden sind",
      "Die bloße Überschuldung und die Zahlungsunfähigkeit sind immer dieselbe Voraussetzung"
    ],
    "correctOption": "A",
    "explanation": "Bei möglichen Insolvenzgründen können für die Geschäftsleitung unverzügliche Prüfungs- und Antragspflichten gelten; die Fristen sind gesetzlich geregelt.",
    "companyEffect": "Frühe Beratung kann eine pflichtwidrige Verzögerung und zusätzliche Schäden vermeiden.",
    "sourceRef": "LAW-INSO-15A-DIRECT;LAW-INSO-17-DIRECT",
    "sourceKind": "law",
    "tooltipKey": "rt-insolvency-duty",
    "correctAnswer": "Insolvenzreife und gesetzliche Handlungspflichten umgehend fachkundig prüfen lassen"
  },
  {
    "id": "wbq-rt-048",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-competition-information",
    "scenario": "Ein Wettbewerber schlägt vor, künftige kundenspezifische Angebotspreise auszutauschen.",
    "question": "Wie sollte der Vertriebsleiter reagieren?",
    "options": [
      "Der Austausch von Zukunftspreisen ist zulässig, wenn keine verbindliche Preisbindung vereinbart wird",
      "Wettbewerber dürfen Kundenpreise abstimmen, solange jede Firma ihre Rechnung selbst erstellt",
      "Ein Austausch sensibler Preise ist nur problematisch, wenn Kunden unmittelbar davon erfahren",
      "Den Austausch ablehnen und bei Bedarf kartellrechtlichen Rat einholen"
    ],
    "correctOption": "D",
    "explanation": "Der Austausch wettbewerblich sensibler Zukunftspreise kann eine unzulässige Koordinierung erleichtern.",
    "companyEffect": "Eigenständige Preisentscheidungen schützen den Wettbewerb und das Unternehmen vor erheblichen Sanktionen.",
    "sourceRef": "LAW-GWB-1",
    "sourceKind": "law",
    "tooltipKey": "rt-competition-information",
    "correctAnswer": "Den Austausch ablehnen und bei Bedarf kartellrechtlichen Rat einholen"
  },
  {
    "id": "wbq-rt-049",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-product-liability",
    "scenario": "Ein Bauteilversagen verursacht nach dem Verkauf einen Sachschaden beim Kunden.",
    "question": "Welche Informationen sollte der Betrieb sofort sichern und prüfen?",
    "options": [
      "Technische Rückverfolgbarkeit ist entbehrlich, wenn der Kunde das Produkt bereits genutzt hat",
      "Der Betrieb sollte zuerst Haftung ablehnen und die technische Ursache später untersuchen",
      "Chargen- und Bauteilrückverfolgung, technische Belege, Ursache und einschlägige Haftungspflichten",
      "Jeder Produktschaden begründet verschuldensunabhängige Haftung, auch ohne Fehler und Kausalität"
    ],
    "correctOption": "C",
    "explanation": "Produktsicherheits- und Haftungsfragen hängen von Rückverfolgbarkeit, Schadensursache und konkreten Pflichten ab.",
    "companyEffect": "Schnelle Sicherung ermöglicht Eindämmung, Kundeninformation und gezielte Ursachenbehebung.",
    "sourceRef": "LAW-PRODHAFTG-1",
    "sourceKind": "law",
    "tooltipKey": "rt-product-liability",
    "correctAnswer": "Chargen- und Bauteilrückverfolgung, technische Belege, Ursache und einschlägige Haftungspflichten"
  },
  {
    "id": "wbq-rt-050",
    "areaId": "wbq-recht-und-steuern",
    "competenceId": "rt-legal-change",
    "scenario": "Ein Steuerprozess verwendet eine Tabelle, die auf eine Regel aus dem Vorjahr verweist.",
    "question": "Welche Kontrolle sollte vor der aktuellen Abgabe erfolgen?",
    "options": [
      "Die jährliche Prozessfreigabe ersetzt eine Prüfung des tatsächlich geltenden Rechtsstands",
      "Aktuellen Rechtsstand und amtliche Hinweise für den betreffenden Zeitraum verifizieren",
      "Eine Gesetzesänderung gilt nur für neue Unternehmen, nicht für bestehende Steuerprozesse",
      "Ein amtlicher Hinweis des Vorjahres bleibt für alle späteren Zeiträume maßgeblich"
    ],
    "correctOption": "B",
    "explanation": "Rechts- und Verwaltungsregeln können sich ändern; für den maßgeblichen Zeitraum ist die aktuelle amtliche Grundlage zu prüfen.",
    "companyEffect": "Ein kontrolliertes Update verhindert, dass veraltete Annahmen systematisch in Steuererklärungen eingehen.",
    "sourceRef": "MAP-WBQ-RT",
    "sourceKind": "competency-derivation",
    "tooltipKey": "rt-legal-change",
    "correctAnswer": "Aktuellen Rechtsstand und amtliche Hinweise für den betreffenden Zeitraum verifizieren"
  },
  {
    "id": "wbq-uf-026",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-objectives",
    "scenario": "Ein Team erhält den Auftrag, den Ausschuss „bald“ zu verringern.",
    "question": "Welche Formulierung macht das Ziel messbar und überprüfbar?",
    "options": [
      "Nur die Zahl fehlerhafter Teile berichten, ohne Gesamtproduktion oder Ursachen zu erfassen",
      "Ausschuss von 6 auf 3 Prozent bis Quartalsende senken; Verantwortliche und wöchentliche Prüfung festlegen",
      "Ausschussquote senken, ohne Bezugsmenge und Erfassungsmethode festzulegen",
      "Zielwert setzen, aber Verantwortlichkeit und Reviewtermin auslassen"
    ],
    "correctOption": "B",
    "explanation": "Ausgangswert, Ziel, Frist, Zuständigkeit und Prüftermin machen den Fortschritt nachvollziehbar.",
    "companyEffect": "Das Team kann die Wirkung seiner Prozessänderungen erkennen und rechtzeitig nachsteuern.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-objectives",
    "correctAnswer": "Ausschuss von 6 auf 3 Prozent bis Quartalsende senken; Verantwortliche und wöchentliche Prüfung festlegen"
  },
  {
    "id": "wbq-uf-027",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-organizational-structure",
    "scenario": "Vertrieb und Fertigung gehen jeweils davon aus, die andere Abteilung müsse Liefertermine freigeben.",
    "question": "Was sollte die Geschäftsführung eindeutig regeln?",
    "options": [
      "Entscheidungsbefugnis und Übergabe für verbindliche Lieferzusagen",
      "Entscheidung über Liefertermine dem Vertrieb überlassen, ohne Zugriff auf Fertigungskapazität zu sichern",
      "Fertigung Termine festlegen lassen, ohne Kundenpriorität und Vertragszusagen einzubeziehen",
      "Beide Bereiche abstimmen lassen, aber keine Stelle für den abschließenden Konfliktfall bestimmen"
    ],
    "correctOption": "A",
    "explanation": "Eindeutige Verantwortung verhindert, dass Zuständigkeiten doppelt oder gar nicht wahrgenommen werden.",
    "companyEffect": "Der Kunde erhält realistische Termine und interne Bereiche vermeiden widersprüchliche Versprechen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-organizational-structure",
    "correctAnswer": "Entscheidungsbefugnis und Übergabe für verbindliche Lieferzusagen"
  },
  {
    "id": "wbq-uf-028",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-span-control",
    "scenario": "Eine Vorarbeiterin beaufsichtigt 25 Beschäftigte über drei Schichten.",
    "question": "Was sollte bei der Beurteilung ihrer Führungsspanne berücksichtigt werden?",
    "options": [
      "Die Anzahl direkt unterstellter Beschäftigter betrachten, ohne Schichtverteilung und Aufgabenkomplexität einzubeziehen",
      "Mehrere Schichtleitungen ergänzen, aber deren Zuständigkeiten und Eskalationswege offenlassen",
      "Führungsspanne verkleinern, ohne die zusätzlichen Koordinationskosten zu berücksichtigen",
      "Aufgabenkomplexität, Selbstständigkeit der Mitarbeitenden, räumliche Verteilung und Unterstützung"
    ],
    "correctOption": "D",
    "explanation": "Eine angemessene Führungsspanne hängt unter anderem von Aufgaben, Erfahrung, Standort und verfügbarer Unterstützung ab.",
    "companyEffect": "Eine passende Organisation verbessert Anleitung, Sicherheit und Eskalation von Problemen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-span-control",
    "correctAnswer": "Aufgabenkomplexität, Selbstständigkeit der Mitarbeitenden, räumliche Verteilung und Unterstützung"
  },
  {
    "id": "wbq-uf-029",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-motivation-equity",
    "scenario": "Zwei Beschäftigte mit vergleichbarer Arbeit empfinden ihre Vergütung als deutlich unterschiedlich und ungerecht.",
    "question": "Welcher Motivationstheorie zufolge können solche Fairnesswahrnehmungen das Verhalten beeinflussen?",
    "options": [
      "Gleiches Entgelt als automatisch fair bewerten, ohne Aufgaben und Qualifikation zu vergleichen",
      "Leistungsprämie einführen, ohne zu prüfen, ob die Kennzahl für alle Beschäftigten beeinflussbar ist",
      "Gerechtigkeitstheorie",
      "Vergütungsvergleich allein auf Monatsentgelt stützen und unterschiedliche Schicht- oder Verantwortungsanteile auslassen"
    ],
    "correctOption": "C",
    "explanation": "Die Gerechtigkeitstheorie betrachtet, wie Beschäftigte das Verhältnis von eigenem Einsatz und Ergebnis im Vergleich wahrnehmen.",
    "companyEffect": "Transparente und einheitliche Kriterien können Unzufriedenheit und Abwanderungsrisiken mindern.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-motivation-equity",
    "correctAnswer": "Gerechtigkeitstheorie"
  },
  {
    "id": "wbq-uf-030",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-maslow-needs",
    "scenario": "Ein befristet beschäftigter Mitarbeiter befürchtet, dass sein Arbeitsvertrag im nächsten Monat endet.",
    "question": "Welches Bedürfnis steht in dieser Situation besonders im Vordergrund?",
    "options": [
      "Nur kurzfristige Leistungsziele besprechen, ohne die Frage der Weiterbeschäftigung anzusprechen",
      "Sicherheitsbedürfnis",
      "Vertragsverlängerung versprechen, bevor Auftragslage und Finanzierung geklärt sind",
      "Unsicherheit verschweigen und zugleich mehr Eigeninitiative erwarten"
    ],
    "correctOption": "B",
    "explanation": "Unsicherheit über den Fortbestand der Beschäftigung kann das Bedürfnis nach Sicherheit besonders relevant machen.",
    "companyEffect": "Klare Personalplanung und offene Kommunikation können Vertrauen und Konzentration unterstützen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-maslow-needs",
    "correctAnswer": "Sicherheitsbedürfnis"
  },
  {
    "id": "wbq-uf-031",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-two-factor-theory",
    "scenario": "Beschäftigte beklagen schlechte Beleuchtung und unsichere Werkzeuge; die Geschäftsführung reagiert mit einem Leistungswettbewerb.",
    "question": "Welche Maßnahme sollte vorrangig erfolgen?",
    "options": [
      "Arbeitsbedingungen und Sicherheitsmängel beheben",
      "Prämien ergänzen, während Beleuchtung und sichere Werkzeuge weiter mangelhaft bleiben",
      "Arbeitsplatzmängel beheben, aber Beschäftigte nicht über die Änderungen informieren",
      "Arbeitsbedingungen nur dort verbessern, wo die Fehlzeiten bereits gestiegen sind"
    ],
    "correctOption": "A",
    "explanation": "Nach dem Zwei-Faktoren-Ansatz können mangelhafte Rahmenbedingungen Unzufriedenheit nicht allein durch Anreize ausgleichen.",
    "companyEffect": "Sichere und angemessene Arbeitsbedingungen verringern vermeidbare Unzufriedenheit und Unfallrisiken.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-two-factor-theory",
    "correctAnswer": "Arbeitsbedingungen und Sicherheitsmängel beheben"
  },
  {
    "id": "wbq-uf-032",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-intrinsic-extrinsic",
    "scenario": "Eine Fachkraft entwickelt aus eigenem Interesse einen besseren Ablauf für die Maschinenrüstung.",
    "question": "Welche Art der Motivation liegt vor?",
    "options": [
      "Prämie für jede Verbesserung zahlen, unabhängig von Nutzen oder Qualität",
      "Aufgabenautonomie erhöhen, aber Vorschläge anschließend ohne Rückmeldung verwerfen",
      "Eigeninitiative als selbstverständlich behandeln und keinerlei Anerkennung oder Umsetzung ermöglichen",
      "Intrinsische Motivation"
    ],
    "correctOption": "D",
    "explanation": "Intrinsische Motivation entsteht aus Interesse und Befriedigung an der Tätigkeit selbst.",
    "companyEffect": "Die Führung kann Eigeninitiative erhalten, indem sie Handlungsspielraum gibt und sinnvolle Beiträge anerkennt.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-intrinsic-extrinsic",
    "correctAnswer": "Intrinsische Motivation"
  },
  {
    "id": "wbq-uf-033",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-feedback-loop",
    "scenario": "Ein Verbesserungsversuch verändert die Ausschussquote nicht messbar.",
    "question": "Wie sollte das Team mit dem Ergebnis umgehen?",
    "options": [
      "Messwerte anpassen, bis die erwartete Verbesserung sichtbar wird",
      "Nullwirkung als Beweis ansehen, dass die zugrunde liegende Ursache nicht besteht",
      "Annahme und Daten prüfen und Versuch gezielt anpassen oder beenden",
      "Versuch abbrechen, ohne zu prüfen, ob Messdauer und Stichprobe aussagekräftig waren"
    ],
    "correctOption": "C",
    "explanation": "Auch ein wirkungsloser Versuch liefert Erkenntnisse, wenn Hypothese und Messung geprüft werden.",
    "companyEffect": "Der Betrieb vermeidet, unwirksame Maßnahmen auszurollen, und kann Ressourcen neu einsetzen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-feedback-loop",
    "correctAnswer": "Annahme und Daten prüfen und Versuch gezielt anpassen oder beenden"
  },
  {
    "id": "wbq-uf-034",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-kaizen",
    "scenario": "Ein Team verkürzt in mehreren kleinen Versuchen die Werkzeugwechselzeit.",
    "question": "Welchem Verbesserungsansatz entspricht dieses Vorgehen am ehesten?",
    "options": [
      "Werkzeugwechsel durch größere Lose verkürzen, ohne Auswirkungen auf Durchlaufzeit und Bestand zu prüfen",
      "Kontinuierlicher schrittweiser Verbesserungsprozess",
      "Mehrere Änderungen gleichzeitig einführen, sodass ihr jeweiliger Effekt nicht erkennbar ist",
      "Verbesserungen als einmalige Prozessumstellung planen und die Wirkung nach der Einführung nicht weiter überprüfen"
    ],
    "correctOption": "B",
    "explanation": "Kaizen steht für die fortlaufende Verbesserung durch kleine, überprüfte Schritte im Arbeitsalltag.",
    "companyEffect": "Dauerhafte Zeiteinsparungen erhöhen die verfügbare Maschinenzeit und können Engpässe reduzieren.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-kaizen",
    "correctAnswer": "Kontinuierlicher schrittweiser Verbesserungsprozess"
  },
  {
    "id": "wbq-uf-035",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-lean-waste",
    "scenario": "Ein halbfertiges Bauteil wartet zwei Tage zwischen zwei Fertigungsschritten.",
    "question": "Welche Verschwendungsart ist unmittelbar erkennbar?",
    "options": [
      "Wartezeit und unnötig gebundenes Umlaufvermögen",
      "Zusätzliche Zwischenlager anlegen, um Wartezeit optisch aus dem Fertigungsbereich zu verlagern",
      "Losgrößen erhöhen, um die Zahl der Übergaben zu reduzieren, ohne Durchlaufzeit zu prüfen",
      "Wartezeit nur als Personalproblem ansehen, obwohl der Engpass an der Folgestation liegt"
    ],
    "correctOption": "A",
    "explanation": "Wartezeiten und unnötige Bestände verlängern den Durchlauf und schaffen keinen zusätzlichen Kundennutzen.",
    "companyEffect": "Die Beseitigung von Engpässen kann Lieferzeit verkürzen und Lagerfläche freisetzen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-lean-waste",
    "correctAnswer": "Wartezeit und unnötig gebundenes Umlaufvermögen"
  },
  {
    "id": "wbq-uf-036",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-5s",
    "scenario": "Ein Werkzeug ist häufig nicht auffindbar; dadurch verlängert sich die Rüstzeit.",
    "question": "Welche Maßnahme aus 5S adressiert das Problem direkt?",
    "options": [
      "Werkzeuge zentral lagern, aber Zugriffszeiten und Rückgabe nicht organisieren",
      "Beschriftung einführen, ohne Zuständigkeit für Pflege und Ordnung festzulegen",
      "Werkzeuge vollständig aus dem Arbeitsplatz entfernen und bei Bedarf einzeln anfordern",
      "Feste, gekennzeichnete Werkzeugplätze und eine Rückgaberoutine einführen"
    ],
    "correctOption": "D",
    "explanation": "Ordnung und Standardisierung machen benötigte Werkzeuge sichtbar und schnell erreichbar.",
    "companyEffect": "Weniger Suchzeit verbessert Rüstablauf und Maschinenverfügbarkeit.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-5s",
    "correctAnswer": "Feste, gekennzeichnete Werkzeugplätze und eine Rückgaberoutine einführen"
  },
  {
    "id": "wbq-uf-037",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-standard-work",
    "scenario": "Die verschiedenen Schichten führen denselben Rüstvorgang nach unterschiedlichen, undokumentierten Methoden aus.",
    "question": "Was ist ein sinnvoller erster Schritt zur Vereinheitlichung?",
    "options": [
      "Den Standard unverändert lassen, obwohl Maschine oder Zeichnungsstand geändert wurden",
      "Schichten vergleichen, ohne unterschiedliche Auftragskomplexität und Rüstbedingungen zu berücksichtigen",
      "Bewährten und sicheren Ablauf dokumentieren, schulen und kontrolliert verbessern",
      "Ablauf dokumentieren, aber Abweichungen und Verbesserungsvorschläge der Schichten nicht aufnehmen"
    ],
    "correctOption": "C",
    "explanation": "Ein Standard hält den derzeit besten bekannten Ablauf fest und schafft eine Basis für weitere Verbesserung.",
    "companyEffect": "Einheitliches Vorgehen verringert Qualitätsstreuung zwischen Schichten.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-standard-work",
    "correctAnswer": "Bewährten und sicheren Ablauf dokumentieren, schulen und kontrolliert verbessern"
  },
  {
    "id": "wbq-uf-038",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-root-cause",
    "scenario": "Ein wiederkehrender Qualitätsfehler wird pauschal auf „Unachtsamkeit“ zurückgeführt.",
    "question": "Welche Methode hilft, die eigentliche Prozessursache zu untersuchen?",
    "options": [
      "Die erste Abweichung beheben, ohne zu prüfen, weshalb der Prozess sie zuließ",
      "Wiederholt nach dem Warum fragen und mögliche Ursachen mit Daten prüfen",
      "Mehrfach nach dem Warum fragen, aber Antworten nicht anhand von Prozessdaten überprüfen",
      "Eine Ursache festlegen, bevor betroffene Beschäftigte oder Ablaufbelege gehört wurden"
    ],
    "correctOption": "B",
    "explanation": "Die 5-Warum-Methode sucht hinter dem sichtbaren Fehler nach überprüfbaren Ursachen.",
    "companyEffect": "Eine behobene Prozessursache verhindert Wiederholungen besser als eine bloße Schuldzuweisung.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-root-cause",
    "correctAnswer": "Wiederholt nach dem Warum fragen und mögliche Ursachen mit Daten prüfen"
  },
  {
    "id": "wbq-uf-039",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-fmea",
    "scenario": "Vor Einführung eines neuen Bearbeitungsverfahrens sind mehrere mögliche Fehlerarten mit unterschiedlicher Schwere bekannt.",
    "question": "Welches Verfahren kann vorbeugende Maßnahmen strukturiert priorisieren?",
    "options": [
      "Fehlermöglichkeits- und Einflussanalyse",
      "Alle denkbaren Fehler gleich priorisieren, unabhängig von Schwere und Eintrittswahrscheinlichkeit",
      "Fehlerliste erstellen, aber Verantwortliche und Nachverfolgung offenlassen",
      "Eine FMEA nach Prozessstart durchführen und vorbeugende Maßnahmen nur dokumentieren"
    ],
    "correctOption": "A",
    "explanation": "Eine FMEA erfasst mögliche Fehler, ihre Auswirkungen und bewertet Risiken zur Priorisierung von Maßnahmen.",
    "companyEffect": "Die Fertigung kann kritische Ausfälle vor dem Serienstart entschärfen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-fmea",
    "correctAnswer": "Fehlermöglichkeits- und Einflussanalyse"
  },
  {
    "id": "wbq-uf-040",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-contingency",
    "scenario": "Der einzige Kompressor fällt aus; ein Ersatz steht kurzfristig nicht zur Verfügung.",
    "question": "Welche Vorbereitung verringert vergleichbare Betriebsunterbrechungen?",
    "options": [
      "Ersatzkompressor beschaffen, ohne Anschluss, Inbetriebnahme und Wartung zu testen",
      "Notfallplan schreiben, aber Zuständigkeiten und verfügbare Ersatzteile nicht prüfen",
      "Ausfallzeit durch zusätzlichen Vorrat reduzieren, ohne den Wiederanlauf des Kompressors abzusichern",
      "Kritische Abhängigkeiten erfassen und getestete Ersatz- oder Wiederanlaufwege planen"
    ],
    "correctOption": "D",
    "explanation": "Notfallplanung beschreibt kritische Abhängigkeiten, Wiederherstellungsschritte und Zuständigkeiten.",
    "companyEffect": "Ein erprobter Ersatzplan kann Ausfallzeit und Kundenverzug begrenzen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-contingency",
    "correctAnswer": "Kritische Abhängigkeiten erfassen und getestete Ersatz- oder Wiederanlaufwege planen"
  },
  {
    "id": "wbq-uf-041",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-decision-bias",
    "scenario": "Nach der Auswahl eines Lieferanten berücksichtigt der Einkäufer nur noch Informationen, die diese Entscheidung bestätigen.",
    "question": "Welche Denkverzerrung könnte die Prüfung beeinflussen?",
    "options": [
      "Die ursprüngliche Lieferantenwahl sofort verwerfen, sobald ein einzelner negativer Hinweis auftaucht",
      "Eine zweite Person um Bestätigung bitten, ohne ihr die Gegenargumente vorzulegen",
      "Bestätigungsfehler",
      "Widersprechende Daten ignorieren, aber nicht prüfen, ob sie selbst belastbar sind"
    ],
    "correctOption": "C",
    "explanation": "Beim Bestätigungsfehler werden passende Hinweise bevorzugt und widersprechende Informationen abgewertet.",
    "companyEffect": "Vorab festgelegte Kriterien und eine unabhängige Gegenprüfung machen Lieferantenrisiken sichtbarer.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-decision-bias",
    "correctAnswer": "Bestätigungsfehler"
  },
  {
    "id": "wbq-uf-042",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-meeting-management",
    "scenario": "Die wöchentliche Produktionsbesprechung endet wiederholt ohne Zuständigkeiten oder Folgetermine.",
    "question": "Welche Änderung verbessert die Umsetzung der Beschlüsse?",
    "options": [
      "Aktionen festhalten, aber beim Folgetermin nicht mehr auf offene Punkte zurückkommen",
      "Entscheidungen, Verantwortliche, Fristen und Nachverfolgung protokollieren",
      "Maßnahmen protokollieren, aber keine Verantwortlichen oder Termine nennen",
      "Jede Besprechung verlängern, bis alle Teilnehmenden dieselbe Meinung haben"
    ],
    "correctOption": "B",
    "explanation": "Ein Maßnahmenprotokoll macht aus der Diskussion überprüfbare Aufgaben.",
    "companyEffect": "Offene Punkte bleiben sichtbar und wiederkehrende Hindernisse können gelöst werden.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-meeting-management",
    "correctAnswer": "Entscheidungen, Verantwortliche, Fristen und Nachverfolgung protokollieren"
  },
  {
    "id": "wbq-uf-043",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-knowledge-management",
    "scenario": "Eine Ingenieurin verlässt den Betrieb; nur sie kennt die Einstellungen einer kritischen Anlage.",
    "question": "Was sollte die Führung vor ihrem Austritt möglichst organisieren?",
    "options": [
      "Wichtiges Wissen dokumentieren und eine Vertretung einarbeiten",
      "Wissen dokumentieren, ohne die Anleitung praktisch mit einer Vertretung zu erproben",
      "Fachkraft interviewen, aber Dokumente und Einstellungen nicht aktualisieren",
      "Eine Vertretung benennen, ohne ihr Zugriff auf Arbeitsmittel und technische Daten zu geben"
    ],
    "correctOption": "A",
    "explanation": "Wissenssicherung und Übergabe reduzieren die Abhängigkeit von Einzelpersonen.",
    "companyEffect": "Der Betrieb kann technische Unterstützung fortführen, ohne Wissen teuer neu aufbauen zu müssen.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-knowledge-management",
    "correctAnswer": "Wichtiges Wissen dokumentieren und eine Vertretung einarbeiten"
  },
  {
    "id": "wbq-uf-044",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-diversity-inclusion",
    "scenario": "Einige Beschäftigte können bei der Schichtübergabe nicht auf die gemeinsam genutzte Arbeitsanweisung zugreifen.",
    "question": "Welche Reaktion verbessert Zugänglichkeit und Arbeitsqualität?",
    "options": [
      "Alle Informationen im selben Format bereitstellen, ohne Zugangs- oder Verständnishürden zu prüfen",
      "Anweisungen vereinfachen, aber technische Sicherheitsangaben dabei auslassen",
      "Zugang ermöglichen, ohne sicherzustellen, dass Beschäftigte die aktuelle Version nutzen",
      "Anweisungen zugänglich bereitstellen und Verständnis bei den betroffenen Beschäftigten prüfen"
    ],
    "correctOption": "D",
    "explanation": "Inklusive Kommunikation ermöglicht allen zuständigen Personen, sicher und einheitlich zu arbeiten.",
    "companyEffect": "Verständliche und erreichbare Übergaben senken Fehler und fördern faire Beteiligung.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-diversity-inclusion",
    "correctAnswer": "Anweisungen zugänglich bereitstellen und Verständnis bei den betroffenen Beschäftigten prüfen"
  },
  {
    "id": "wbq-uf-045",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-ethical-leadership",
    "scenario": "Eine Führungskraft stellt fest, dass ein Sicherheitsvorfall in der internen Meldung verharmlost wurde.",
    "question": "Wie sollte sie reagieren?",
    "options": [
      "Bericht ergänzen und Vorgesetzte informieren, aber Ursache und bisherige Datenerfassung nicht unabhängig prüfen",
      "Vorfall umfassend prüfen und korrigieren, die Erkenntnisse jedoch nur intern dokumentieren und den Meldedruck nicht ansprechen",
      "Meldung berichtigen, Vorgang transparent prüfen und Druck zur Falschmeldung abstellen",
      "Bericht berichtigen und Maßnahmen festlegen, die betroffenen Beschäftigten aber nicht über Meldeweg und Erkenntnisse informieren"
    ],
    "correctOption": "C",
    "explanation": "Integrität erfordert korrekte Berichte und einen Umgang, der sachliche Meldungen ermöglicht.",
    "companyEffect": "Verlässliche Sicherheitsdaten unterstützen wirksame Prävention und schützen Beschäftigte.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-ethical-leadership",
    "correctAnswer": "Meldung berichtigen, Vorgang transparent prüfen und Druck zur Falschmeldung abstellen"
  },
  {
    "id": "wbq-uf-046",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-decision-rights",
    "scenario": "Eine Maschinenbedienerin bemerkt eine erhebliche Qualitätsabweichung, weiß aber nicht, ob sie die Arbeit stoppen darf.",
    "question": "Welche Organisationsregel sollte die Geschäftsführung schaffen?",
    "options": [
      "Eskalationsweg festlegen, aber Beschäftigte für jeden guten-faith-Stopp sanktionieren",
      "Klare Befugnis zum sicheren Arbeitsstopp und geregelte Eskalation",
      "Stopprecht definieren, aber ungeklärt lassen, wer Anlage und Auftrag wieder freigibt",
      "Nur Qualitätsabweichungen melden lassen und Sicherheitsgefahren ausklammern"
    ],
    "correctOption": "B",
    "explanation": "Eindeutige Befugnisse ermöglichen schnelles Eindämmen und verantwortungsvolle Eskalation.",
    "companyEffect": "Eine frühe Unterbrechung kann Personen-, Maschinen- oder Kundenschäden vermeiden.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-decision-rights",
    "correctAnswer": "Klare Befugnis zum sicheren Arbeitsstopp und geregelte Eskalation"
  },
  {
    "id": "wbq-uf-047",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-resource-allocation",
    "scenario": "Zwei Verbesserungsprojekte benötigen gleichzeitig dieselben knappen Entwicklungsstunden.",
    "question": "Nach welchen Kriterien sollte die Leitung priorisieren?",
    "options": [
      "Strategischer Nutzen, Risikominderung, Ressourcenbedarf und Terminlage",
      "Projekt mit größtem erwarteten Nutzen priorisieren, ohne Umsetzungsrisiko oder Kapazität zu bewerten",
      "Auftragsdruck als einziges Kriterium verwenden und langfristige Risikominderung ignorieren",
      "Mehrere Vorhaben parallel starten, obwohl dafür die Fachstunden nicht ausreichen"
    ],
    "correctOption": "A",
    "explanation": "Einheitliche Kriterien machen den Einsatz knapper Ressourcen nachvollziehbar und zielbezogen.",
    "companyEffect": "Die verfügbaren Fachstunden fließen in das insgesamt überzeugendere Vorhaben.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-resource-allocation",
    "correctAnswer": "Strategischer Nutzen, Risikominderung, Ressourcenbedarf und Terminlage"
  },
  {
    "id": "wbq-uf-048",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-corporate-culture",
    "scenario": "Beschäftigte melden Beinaheunfälle nicht, weil Vorgesetzte jede Meldung mit Strafe beantworten.",
    "question": "Welche Kulturänderung fördert das Lernen aus solchen Ereignissen?",
    "options": [
      "Meldungen fördern, aber nicht erklären, welche Folgen oder Rückmeldungen Beschäftigte erwarten können",
      "Jeden Fehler sanktionsfrei stellen, auch wenn er vorsätzlich und wiederholt geschieht",
      "Beinaheunfälle sammeln, aber keine Ursachen oder Schutzmaßnahmen nachverfolgen",
      "Gutmütige Meldungen zur Prävention ermutigen und vorsätzliches Fehlverhalten fair behandeln"
    ],
    "correctOption": "D",
    "explanation": "Eine faire Lernkultur fördert das Berichten von Gefahren und hält zugleich angemessene Verantwortlichkeit aufrecht.",
    "companyEffect": "Frühe Warnsignale ermöglichen Prävention vor Verletzung oder Produktionsausfall.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-corporate-culture",
    "correctAnswer": "Gutmütige Meldungen zur Prävention ermutigen und vorsätzliches Fehlverhalten fair behandeln"
  },
  {
    "id": "wbq-uf-049",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-strategic-control",
    "scenario": "Die Strategie zielt auf bessere Termintreue; gesteuert wird jedoch ausschließlich anhand des Jahresumsatzes.",
    "question": "Welche Steuerungsgröße fehlt?",
    "options": [
      "Jahresumsatz nach Produktgruppen aufschlüsseln, ohne Auftragsstatus oder Fälligkeit zu betrachten",
      "Termintreue nur am Jahresende auswerten, wenn Eingriffe kaum noch möglich sind",
      "Eine operative Frühkennzahl mit Bezug zur Termintreue",
      "Auslastung der CNC als Ersatz für Termintreue verwenden, ohne Lieferabweichungen zu messen"
    ],
    "correctOption": "C",
    "explanation": "Zur Strategie passende Kennzahlen zeigen, ob die betrieblichen Maßnahmen das gewünschte Ergebnis voraussichtlich erreichen.",
    "companyEffect": "Termintreue und Planabweichungen lassen sich früher beeinflussen als ein Jahresumsatz nach Abschluss.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-strategic-control",
    "correctAnswer": "Eine operative Frühkennzahl mit Bezug zur Termintreue"
  },
  {
    "id": "wbq-uf-050",
    "areaId": "wbq-unternehmensfuehrung",
    "competenceId": "uf-review-learning",
    "scenario": "Die Quartalsprüfung zeigt, dass die Personalplanung auf einer nicht eingetretenen Nachfrageannahme beruhte.",
    "question": "Was sollte die Führung aus dem Ergebnis ableiten?",
    "options": [
      "Neue Nachfrageannahme übernehmen, aber Personalbedarf und Finanzierbarkeit nicht erneut abstimmen",
      "Annahmen aktualisieren, Lernerfahrung dokumentieren und Personalplan anpassen",
      "Prognose unverändert lassen und Abweichungen als einmalig behandeln, ohne Ursache zu prüfen",
      "Personal reduzieren, ohne Auswirkungen auf Lieferfähigkeit und Schlüsselkompetenzen zu betrachten"
    ],
    "correctOption": "B",
    "explanation": "Regelmäßige Prüfung vergleicht Annahmen mit Ergebnissen und verbessert künftige Entscheidungen.",
    "companyEffect": "Angepasste Personalplanung schützt Liquidität und richtet Kapazität an der realen Nachfrage aus.",
    "sourceRef": "MAP-WBQ-UF",
    "sourceKind": "competency-derivation",
    "tooltipKey": "uf-review-learning",
    "correctAnswer": "Annahmen aktualisieren, Lernerfahrung dokumentieren und Personalplan anpassen"
  }
];

export const WBQ_AREAS = [
  {
    "id": "wbq-volks-und-betriebswirtschaft",
    "title": "Volks- und Betriebswirtschaft",
    "sourceRef": "MAP-WBQ-VW"
  },
  {
    "id": "wbq-rechnungswesen",
    "title": "Rechnungswesen",
    "sourceRef": "MAP-WBQ-RW"
  },
  {
    "id": "wbq-recht-und-steuern",
    "title": "Recht und Steuern",
    "sourceRef": "MAP-WBQ-RT"
  },
  {
    "id": "wbq-unternehmensfuehrung",
    "title": "Unternehmensführung",
    "sourceRef": "MAP-WBQ-UF"
  }
];

export const WBQ_SOURCES = [
  {
    "id": "MAP-WBQ-VW",
    "title": "A06-abgeleitete Kompetenzlandkarte: Volks- und Betriebswirtschaft",
    "url": "../docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md",
    "accessed": "2026-10-28",
    "kind": "competency-map"
  },
  {
    "id": "MAP-WBQ-RW",
    "title": "A06-abgeleitete Kompetenzlandkarte: Rechnungswesen",
    "url": "../docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md",
    "accessed": "2026-10-28",
    "kind": "competency-map"
  },
  {
    "id": "MAP-WBQ-RT",
    "title": "A06-abgeleitete Kompetenzlandkarte: Recht und Steuern",
    "url": "../docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md",
    "accessed": "2026-10-28",
    "kind": "competency-map"
  },
  {
    "id": "MAP-WBQ-UF",
    "title": "A06-abgeleitete Kompetenzlandkarte: Unternehmensführung",
    "url": "../docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md",
    "accessed": "2026-10-28",
    "kind": "competency-map"
  },
  {
    "id": "LAW-BGB-433",
    "title": "BGB § 433 – Pflichten aus dem Kaufvertrag",
    "url": "https://www.gesetze-im-internet.de/bgb/__433.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-HGB-238",
    "title": "HGB § 238 – Buchführungspflicht",
    "url": "https://www.gesetze-im-internet.de/hgb/__238.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-GMBHG-13",
    "title": "GmbHG § 13 – Rechtsnatur und Haftung der GmbH",
    "url": "https://www.gesetze-im-internet.de/gmbhg/__13.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-AO-149",
    "title": "AO § 149 – Steuererklärungsfristen",
    "url": "https://www.gesetze-im-internet.de/ao_1977/__149.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BURLG-3",
    "title": "BUrlG § 3 – Mindesturlaub",
    "url": "https://www.gesetze-im-internet.de/burlg/__3.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BBIG-14",
    "title": "BBiG § 14 – Pflichten der Ausbildenden",
    "url": "https://www.gesetze-im-internet.de/bbig_2005/__14.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-145",
    "title": "BGB §145 – Bindung an den Antrag",
    "url": "https://www.gesetze-im-internet.de/bgb/__145.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-147",
    "title": "BGB §147 – Annahmefrist",
    "url": "https://www.gesetze-im-internet.de/bgb/__147.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-150",
    "title": "BGB §150 – Verspätete und geänderte Annahme",
    "url": "https://www.gesetze-im-internet.de/bgb/__150.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-640",
    "title": "BGB §640 – Abnahme",
    "url": "https://www.gesetze-im-internet.de/bgb/__640.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-1",
    "title": "UStG §1 – Steuerbare Umsätze",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__1.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-12",
    "title": "UStG §12 – Steuersätze",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__12.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-14",
    "title": "UStG §14 – Rechnungen",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__14.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-15",
    "title": "UStG §15 – Vorsteuerabzug",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__15.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-13",
    "title": "UStG §13 – Entstehung der Steuer",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__13.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-17",
    "title": "UStG §17 – Änderung der Bemessungsgrundlage",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__17.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BETRVG-87",
    "title": "BetrVG §87 – Mitbestimmung",
    "url": "https://www.gesetze-im-internet.de/betrvg/__87.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-GWB-1",
    "title": "GWB §1 – Wettbewerbsbeschränkende Vereinbarungen",
    "url": "https://www.gesetze-im-internet.de/gwb/__1.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-PRODHAFTG-1",
    "title": "ProdHaftG §1 – Haftung für fehlerhafte Produkte",
    "url": "https://www.gesetze-im-internet.de/prodhaftg/__1.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-305",
    "title": "BGB § 305 – Einbeziehung Allgemeiner Geschäftsbedingungen",
    "url": "https://www.gesetze-im-internet.de/bgb/__305.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-HGB-10",
    "title": "HGB § 10 – Registergericht und Bekanntmachung",
    "url": "https://www.gesetze-im-internet.de/hgb/__10.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-449",
    "title": "BGB § 449 – Eigentumsvorbehalt",
    "url": "https://www.gesetze-im-internet.de/bgb/__449.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-125",
    "title": "BGB § 125 – Nichtigkeit wegen Formmangels",
    "url": "https://www.gesetze-im-internet.de/bgb/__125.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-437",
    "title": "BGB § 437 – Rechte des Käufers bei Mängeln",
    "url": "https://www.gesetze-im-internet.de/bgb/__437.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-439-DIRECT",
    "title": "BGB § 439 – Nacherfüllung",
    "url": "https://www.gesetze-im-internet.de/bgb/__439.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-16-DIRECT",
    "title": "UStG § 16 – Steuerberechnung",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__16.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-18-DIRECT",
    "title": "UStG § 18 – Besteuerungsverfahren und Voranmeldung",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__18.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-3A-DIRECT",
    "title": "UStG § 3a – Ort der sonstigen Leistung",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__3a.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-USTG-13B-DIRECT",
    "title": "UStG § 13b – Leistungsempfänger als Steuerschuldner",
    "url": "https://www.gesetze-im-internet.de/ustg_1980/__13b.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-ARBSCHG-3-DIRECT",
    "title": "ArbSchG § 3 – Grundpflichten des Arbeitgebers",
    "url": "https://www.gesetze-im-internet.de/arbschg/__3.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-ARBSCHG-5-DIRECT",
    "title": "ArbSchG § 5 – Beurteilung der Arbeitsbedingungen",
    "url": "https://www.gesetze-im-internet.de/arbschg/__5.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-DSGVO-5-DIRECT",
    "title": "DSGVO Art. 5 – Grundsätze der Verarbeitung",
    "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj#art_5",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-DSGVO-6-DIRECT",
    "title": "DSGVO Art. 6 – Rechtmäßigkeit der Verarbeitung",
    "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj#art_6",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-DSGVO-9-DIRECT",
    "title": "DSGVO Art. 9 – Besondere Kategorien personenbezogener Daten",
    "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj#art_9",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-DSGVO-32-DIRECT",
    "title": "DSGVO Art. 32 – Sicherheit der Verarbeitung",
    "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj#art_32",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-ARBZG-3-DIRECT",
    "title": "ArbZG § 3 – Arbeitszeit der Arbeitnehmer",
    "url": "https://www.gesetze-im-internet.de/arbzg/__3.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-ARBZG-5-DIRECT",
    "title": "ArbZG § 5 – Ruhezeit",
    "url": "https://www.gesetze-im-internet.de/arbzg/__5.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-312G-DIRECT",
    "title": "BGB § 312g – Widerrufsrecht bei Fernabsatzverträgen",
    "url": "https://www.gesetze-im-internet.de/bgb/__312g.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-355-DIRECT",
    "title": "BGB § 355 – Widerrufsrecht bei Verbraucherverträgen",
    "url": "https://www.gesetze-im-internet.de/bgb/__355.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-INSO-15A-DIRECT",
    "title": "InsO § 15a – Antragspflicht bei juristischen Personen",
    "url": "https://www.gesetze-im-internet.de/inso/__15a.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-INSO-17-DIRECT",
    "title": "InsO § 17 – Zahlungsunfähigkeit",
    "url": "https://www.gesetze-im-internet.de/inso/__17.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-633-DIRECT",
    "title": "BGB § 633 – Sach- und Rechtsmangel beim Werkvertrag",
    "url": "https://www.gesetze-im-internet.de/bgb/__633.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-634-DIRECT",
    "title": "BGB § 634 – Rechte des Bestellers bei Mängeln",
    "url": "https://www.gesetze-im-internet.de/bgb/__634.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-164-DIRECT",
    "title": "BGB § 164 – Wirkung der Erklärung des Vertreters",
    "url": "https://www.gesetze-im-internet.de/bgb/__164.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-167-DIRECT",
    "title": "BGB § 167 – Erteilung der Vollmacht",
    "url": "https://www.gesetze-im-internet.de/bgb/__167.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-286-DIRECT",
    "title": "BGB § 286 – Verzug des Schuldners",
    "url": "https://www.gesetze-im-internet.de/bgb/__286.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-288-DIRECT",
    "title": "BGB § 288 – Verzugszinsen und weiterer Verzugsschaden",
    "url": "https://www.gesetze-im-internet.de/bgb/__288.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-650",
    "title": "BGB § 650 – Werklieferungsvertrag",
    "url": "https://www.gesetze-im-internet.de/bgb/__650.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-442",
    "title": "BGB § 442 – Kenntnis des Käufers",
    "url": "https://www.gesetze-im-internet.de/bgb/__442.html",
    "accessed": "2026-10-28",
    "kind": "law"
  },
  {
    "id": "LAW-BGB-148",
    "title": "BGB § 148 – Bestimmung einer Annahmefrist",
    "url": "https://www.gesetze-im-internet.de/bgb/__148.html",
    "accessed": "2026-10-28",
    "kind": "law"
  }
];

export default WBQ_ITEMS;
