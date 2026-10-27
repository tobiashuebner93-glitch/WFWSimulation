# A03 – Finanzielle MVP-Spezifikation Maschinenbau

**Stand:** 2026-09-26  
**Rolle:** A03 – ACCOUNTING_FINANCE  
**Bezug:** MG-000 / SLG-000.2 / T-0005  
**Status:** Fachliche Arbeitsgrundlage; Produkt- und Architekturentscheidungen bleiben offen.

**Aktueller P0-Stand:** Maßgeblich sind die bestätigten Decision-Log-Regeln, darunter E3, SimTAX, Zahlungsziele, Zahlungs-/Mahnfluss, Annuitätendarlehen, D3-Sätze und Kostenparameter. Diese konsolidierte Spezifikation ersetzt widersprechende ältere Vorlagenstände; offene Parameter sind in Abschnitt P benannt. D-0010 bleibt unverändert; Architektur und Umsetzung sind nicht freigegeben.

**Eröffnungsbilanz-Update:** Der zuletzt bestätigte CNC-Buchwert zum 01.01.2027 beträgt 0 € (D-0099), womit der frühere Szenariowert 40.000 € ersetzt ist. Darlehen, Eigenkapital und Eröffnungsbilanz sind in Abschnitt S abgeglichen. Das Darlehen ist als siebenjähriges Annuitätendarlehen mit monatlicher Rate und bestätigter Zinslogik konkretisiert; verbleibende Einzelparameter stehen dort.

## Zweck und Grenzen

Diese Spezifikation ordnet die von A02 beschriebenen Maschinenbau-Prozesse finanziell ein. Accounting ist die fachliche Autorität für Forderungen, Verbindlichkeiten, Kosten, Erlöse, Liquidität und Auftragsergebnis. A02 bleibt autoritativ für operative Ereignisse, Mengen, Prozessreihenfolge und Simulationszeit. Accounting erhält bestätigte Tatsachen und leitet daraus Finanzzustände ab; Simulation führt keine parallelen Finanzsalden.

Der MVP braucht eine konsistente Finanzwahrheit, aber weder Kontenplan noch vollständiges Journal, Steuer-, Lohn-, Anlagen- oder Kostenrechnungssystem. Diese Spezifikation legt keine technische API, Tabellen oder Buchungssätze fest und trifft keine Produktentscheidung für offene Parameter. Architektur V0.2 sowie alle ADRs bleiben PROPOSED; D-0001 bis D-0009 werden nicht verändert. D-0010 ist für den Produktumfang maßgeblich; seine vollständige Auftragsabwicklung ohne Teilfertigung, Teillieferung, Teilrechnung oder Teilzahlung gilt für V1.

## A. Finanzielle MVP-Grundsätze

1. **Vorgang, Leistung, Rechnung und Zahlung sind getrennt.** Angebot und Auftrag sind Plan-/Vertragsinformationen; Lieferung oder Abnahme belegt Leistung; Rechnung begründet im vereinfachten MVP die Kundenforderung und den abrechenbaren Erlös; Zahlung verändert Liquidität und gleicht offene Posten aus.
2. **Liquidität ist kein Gewinn.** Zahlungseingang/-ausgang verändert Zahlungsmittel. Erlös und Kosten bestimmen das Auftragsergebnis unabhängig vom Zahlungszeitpunkt.
3. **Einmalige finanzielle Wahrheit.** Accounting führt autoritativ Forderungen, Verbindlichkeiten, Kosten, Erlöse, Zahlungen und Salden. A02 meldet Ereignisse und operative Ist-Mengen, nicht Buchungen oder Salden.
4. **Schätzung und Ist trennen.** Angebot/Kalkulation liefern erwartete Werte. Auftragsergebnis verwendet erfasste Ist-Kosten und nach der gewählten Erlösregel realisierten Auftragserlös; Planabweichungen bleiben sichtbar.
5. **Nachvollziehbar korrigieren.** Nach Bestätigung erfasste Vorgänge werden nicht still überschrieben. Korrektur/Storno referenziert den ursprünglichen Geschäftsvorfall. V1 enthält ein zwölfmonatiges Geschäftsjahr mit Abschluss zum Kalenderjahresende (D-0117/D-0118). Nichtsteuerliche Korrekturen nach Abschluss werden im Folgejahr gemäß D-0119 erfasst; Fehler in abgegebenen SimTAX-Erklärungen folgen separat D-0115/D-0116.
6. **Kein unbelegter Rechts-/Steueranspruch.** Beträge können fachlich nur dann „netto“ oder „brutto“ heißen, wenn die Nutzerentscheidung zur Umsatzsteuer vorliegt.

## B. Finanzielle Wirkung im Auftragslebenszyklus

| Schritt / A02-Ereignis | Finanzielle Wirkung und Zeitpunkt | Forderung / Verbindlichkeit | Liquidität | Kosten / Erlös / Ergebnis | Accounting-Übergabe und A02-Abhängigkeit |
|---|---|---|---|---|---|
| A. Angebot (QuoteCalculated, QuoteIssued) | Kalkulationskosten, Angebotspreis und erwartete Marge als unverbindliche Vorschau; keine realisierte Wirkung beim Erstellen/Senden | Nein / Nein | Nein | Nur Planwerte; kein realer Aufwand/Erlös und kein Ist-Auftragsergebnis | Angebotsversion, Kunde, Positionen, Menge, Preisannahme, Liefer-/Zahlungskonditionen, Kostenschätzungen. A02 liefert kalkulierte operative Annahmen. |
| B. Auftrag (OrderAccepted) | Vertraglicher Auftragswert und erwartete Kosten werden als Verpflichtungs-/Planinformation festgehalten; allein aus Annahme keine Forderung, Verbindlichkeit, Einzahlung oder Auszahlung | Nein / Nein | Nein | Planerlös und Kalkulation bleiben Vorschau | Auftrags-ID, angenommene Angebotsversion, Kunde, Positionen/Menge, Preis, Termin, vereinbarte Konditionen. A02 bestätigt Annahme und gültigen Leistungsumfang. |
| C. Bestellung (PurchaseOrderPlaced) | Bestellwert ist zunächst erwarteter Mittelabfluss/Bestellbindung, kein Ist-Aufwand. Eine Verbindlichkeit entsteht noch nicht allein durch die Bestellung | Nein / grundsätzlich nein; Verpflichtung separat von Verbindlichkeit | Nein | Erwartete Beschaffungskosten; Ergebnis unverändert | Lieferant, Bestellposition, Material/Leistung, Menge, vereinbarter Preis, Liefertermin, Zahlungsziel, Auftragsbezug. A02 meldet bestätigte Bestellung. |
| Wareneingang / Fremdleistung (GoodsReceived, SubcontractedServiceAccepted) | Bei akzeptiertem Wareneingang bzw. bestätigter Fremdleistung wird die Verbindlichkeit erfasst. Die Lieferantenrechnung bestätigt anschließend Betrag und Fälligkeit; keine Zahlung ohne tatsächlichen Abfluss | Verbindlichkeit entsteht beim bestätigten Eingang/der bestätigten Leistung | Nein | Material wird zunächst als Bestand/auftragsgebundener Wert geführt, falls noch nicht verbraucht; Fremdleistung kann bei Annahme auftragsbezogene Ist-Kosten werden. Details OPEN | Empfangs-/Leistungsdatum, Istmenge, Preis, Bestell-/Auftragsreferenz, Abweichung/Annahme. A02 autoritativ für Empfang und Mengenstatus. |
| D. Produktion / Ressourcenverbrauch (MaterialConsumed, WorkProgressed, CapacityConsumed) | Verbrauchs- und Aufwandsmengen werden bei bestätigtem Verbrauch/Leistung erfasst; monetäre Bewertung gemäß vereinbarten Sätzen/Bewertungsmethode | Nein / Nein (außer bereits entstandene Lieferantenverbindlichkeit) | Nein, sofern keine unmittelbare Zahlung modelliert ist | Materialverbrauch, Fremdleistung, Arbeit, Maschine, Energie und direkte sonstige Aufwendungen werden Auftrag zugeordnet. Gemeinkosten ggf. nur bei gewählter einfacher Methode | Auftrags-/Produktionsreferenz, Zeitpunkt/Periode, Ressourcenart, Menge/Stunden, Bewertungsreferenz oder Satz. A02 liefert Istverbrauch; A03 bewertet finanziell. |
| E. Lieferung / Abnahme (OrderDelivered, DeliveryAccepted) | Belegt Leistung und Rechnungsreferenz; Lieferung allein erzeugt keine Forderung oder vereinfachten Auftragserlös (D-0112) | Nein / Nein | Nein | Transportkosten bei Leistung/Beleg nach Kostenregel; Erlöswirkung bei freigegebener Rechnung | Liefermenge, Leistungsdatum, Abnahme/Nachweis, Frachtkosten/-beleg, Preisbezug. A02 übermittelt operative Lieferung/Abnahme. |
| F. Kundenrechnung (CustomerInvoiceIssued) | Ausstellung/Freigabe für erbrachte bzw. abrechenbare Leistung begründet Forderung und vereinfachten Auftragserlös; Rechnung referenziert Leistung/Lieferung (D-0112) | Ja / Nein | Nein | Erlös und Auftragsergebnis ändern sich; Kosten erfasster Ist-Aufwand bleiben | Rechnungsreferenz, Kunde, Auftrag, Positionen, Betrag, Steuerstatus, Rechnungs-/Leistungsdatum, Zahlungsziel/Fälligkeit. A02 liefert Rechnungsereignis; A03 berechnet Finanzwirkung. |
| G. Kundenzahlungseingang (CustomerPaymentTriggered / CustomerPaymentReceived) | Vollständiger Eingang am Fälligkeitstag, sofern kein ausdrücklich festgelegtes Verspätungsereignis; unabhängig vom Bankbestand des eigenen Unternehmens (D-0110) | Forderung sinkt / Nein | Ja am tatsächlichen Eingangsdatum, ohne eigenes Cash-Gate | Kein neuer Erlös und keine erneute Ergebniswirkung | Kunden-/Rechnungsreferenz, voller Betrag, ggf. Verspätungsereignis und Datum. A02 meldet Eingang; A03 führt OP und Cash. |
| H. Eigene Zahlung an Lieferant/Gläubiger (SupplierPaymentAttempted / SupplierPaymentMade / SupplierPaymentFailedInsufficientLiquidity) | Automatischer Vollzahlungsversuch am Fälligkeitstag. Erfolg gleicht den Verbindlichkeitsposten aus; Fehlschlag bei unzureichender Liquidität lässt ihn unverändert und führt in den bestätigten V1-Mahn-/Dunning-Fluss | Bei Erfolg Verbindlichkeit sinkt/schließt; bei Fehlschlag unverändert | Nur bei vollständiger erfolgreicher Zahlung; bei Fehlschlag keine Liquiditätsbewegung und kein negativer Bestand | Kein zweiter Aufwand, wenn Kosten zuvor erfasst wurden | Gläubiger-/Rechnungsreferenz, voller Versuchsbetrag, Fälligkeit, Ergebnis; tatsächliches Zahlungsdatum nur bei Erfolg. A02 meldet Versuchsergebnis; A03 führt Verbindlichkeit und Finanzzustand. |
| Laufende allgemeine Kosten | Kosten entstehen nach einfacher Regel am festgelegten Leistungs-/Periodenzeitpunkt; Zahlung gegebenenfalls separat | Verbindlichkeit nur, wenn Rechnung/noch offene Zahlung modelliert wird | Nur beim Zahlungsausgang | Allgemeine Kosten belasten Unternehmensergebnis, ohne willkürliche Verteilung nicht Auftragsergebnis | Kostenart, Betrag, Intervall/Zeitraum, Entstehungs- und Fälligkeitsdatum, Zahlungsstatus. Startprofil/Intervall/Periodenregeln kommen vom Produkt/A02. |
| I. Auftragsabschluss (OrderClosed) | Operativer Abschlussstatus nach von A02/User festgelegter Bedingung. Abschluss selbst erzeugt nicht automatisch Zahlung, Erlös oder Kosten | Nein / Nein | Nein | Markiert Ergebnis als final oder vorläufig entsprechend Regel | Abschlussgrund, Restmengen, Liefer-/Rechnungsstatus und Zeitpunkt. A02 bestimmt operative Abschlussbedingung; A03 liefert finanzielle Vollständigkeit/offene Beträge. |
| J. Auftragsergebnis (OrderResultCalculated) | Finanzielle Auswertung aus autoritativen Auftragserlösen und zugeordneten Ist-Kosten; neu berechenbare Sicht, kein eigener Geschäftsvorfall | Nein / Nein | Nein | Auftragsergebnis = zugeordneter realisierter Auftragserlös − zugeordnete Ist-Auftragskosten | Auftrag, Ergebnisstand/As-of-Zeitpunkt, Erlös-/Kostenpositionen und Status, Plan-Ist-Abweichung. A02 kann Abschluss anstoßen; A03 allein liefert Finanzwerte. |

**Umsatzbegriff (D-0112):** Der vereinfachte „Auftragserlös“ ist ein Produkt-/MVP-Begriff, keine Aussage über handels- oder steuerrechtliche Umsatzrealisierung. Für V1 löst die Ausstellung/Freigabe der Rechnung für erbrachte bzw. abrechenbare Leistung Forderung und vereinfachten Auftragserlös aus. Die Rechnung referenziert die zugrunde liegende Leistung/Lieferung. Teilleistungsbehandlung bleibt außerhalb des V1-Umfangs.

## C. Forderungslogik

- **Entstehung (D-0112):** bei Ausstellung/Freigabe einer Kundenrechnung für erbrachte bzw. gemäß Produktregel abrechenbare Leistung. Angebot, Auftragsannahme und Lieferung allein erzeugen nicht automatisch eine Forderung. Die Rechnung referenziert die zugrunde liegende Leistung/Lieferung.
- **Höhe:** offener Rechnungsbetrag abzüglich zugeordneter Zahlungen und bestätigter Korrekturen. Netto-/Bruttobasis bleibt bis zur Nutzerentscheidung offen.
- **Fälligkeit:** Kundenforderung: späterer Zeitpunkt aus tatsächlicher Leistung und Rechnungsdatum; reine Lieferung verwendet Lieferdatum (D-0013). Kundenstandard 14 Kalendertage, individuell 30 Kalendertage (D-0018/19). Lieferantenforderung: Rechnungsdatum bei pünktlicher Lieferung (D-0014), Standard 30 Kalendertage (D-0020). Ankertag zählt als Tag 1; zunächst Ankerdatum + (N−1) Kalendertage, Wochenende auf nächsten Arbeitstag verschieben, Feiertage in V1 unberücksichtigt (D-0011, D-0015–17). Fälligkeit ändert weder offenen Betrag noch Liquidität.
- **Kundenzahlungseingang (D-0110):** V1 erfasst am vertraglichen Fälligkeitstag den vollständigen Zahlungseingang, sofern kein ausdrücklich festgelegtes Verspätungsereignis eintritt. Kein eigenes Cash-Gate. Eingang reduziert Forderung und erhöht Liquidität; beide Wirkungen bleiben getrennt von eigenen Zahlungsverpflichtungen.
- **Offen/überfällig:** Restbetrag > 0 ist offen; Kundenforderung bleibt bis zum tatsächlichen Eingang offen. Fälligkeit allein verändert weder Forderung noch Liquidität.
- **Korrektur/Ausfall:** Eine Abschreibung/Forderungsausbuchung ist vom Zahlungseingang und vom nur für eigene Verbindlichkeiten geltenden Dunning-Fluss getrennt und für V1 nicht festgelegt. Ein fehlender Eingang erzeugt für sich allein weder Aufwand noch Liquiditätsbuchung.
- **Korrektur/Storno:** vor Freigabe Entwurf verwerfen/korrigieren; danach referenzierter Korrektur-/Stornovorgang mit Grund, Datum und Betrag. Nichtsteuerliche Fehler, die erst nach dem Abschluss des Kalenderjahrs erkannt werden, werden im Folgejahr im Vorsteuer-Simulationssaldo gutgeschrieben und im Umsatzsteuer-Simulationssaldo neu belastet (D-0119). Für erkannte fehlerhafte SimTAX-Erklärungen gilt separat D-0115/D-0116.

## D. Verbindlichkeitslogik

- Bestellung allein ist Bestellbindung/erwartete Verpflichtung, nicht zwingend fällige Verbindlichkeit. In Planung/Liquiditätsvorschau separat sichtbar.
- **V1-Regel (D-0111):** Verbindlichkeit für Material bei akzeptiertem Wareneingang und für Fremdleistung bei bestätigter Leistung; die Lieferantenrechnung bestätigt anschließend Betrag und Fälligkeit.
- **Betrag:** akzeptierte Istmenge × vereinbarter/abgerechneter Preis plus/minus bestätigte Abweichungen; Steuerdarstellung OPEN.
- **Fälligkeit:** Lieferantenstandard ist 30 Kalendertage ab Rechnungsdatum bei pünktlicher Lieferung; abweichende Vertrags-/Ereigniskonditionen bleiben möglich (D-0014, D-0020). Der Ankertag zählt als Tag 1; Formel und Wochenendverschiebung folgen D-0011, D-0016/17. Die vereinbarte Kondition wird durch die Lieferantenrechnung bestätigt.
- **Zahlungsversuch und Zahlung:** Für eigene Lieferanten-/Gläubigerverbindlichkeiten löst Fälligkeit am Fälligkeitstag einen automatischen Vollzahlungsversuch aus. Bei ausreichender eigener Liquidität wird vollständig gezahlt, der offene Posten geschlossen und Liquidität am Zahlungsdatum um den tatsächlich gezahlten Betrag vermindert. Bei unzureichender Liquidität scheitert der Versuch: keine Teilzahlung, keine negative Liquidität und keine Liquiditätsbewegung; der vollständige offene Betrag bleibt bestehen. Teilzahlungen sind in V1 ausgeschlossen.
- **Offen/überfällig und Mahnstatus:** Restbetrag > 0 bleibt offen; fehlgeschlagene Versuche werden dokumentiert. Retry erfolgt wöchentlich; nach dem ersten Fehlversuch folgen acht wöchentliche Retry-Versuche, nach dem achten Retry-Fehlschlag ist das Spiel verloren (D-0024–26). Zahlungserinnerung erfolgt 10 Kalendertage nach erstem Fehlversuch; formelle Mahnung 14 Kalendertage nach Erinnerung, sofern noch offen (D-0027/28). Nach der formellen Mahnung keine Pfändungs-/Liquidationseskalation in V1 (D-0029). Fälligkeit, Versuch, tatsächliche Zahlung, Liquidität, OP und Mahnstatus bleiben getrennt. Gebühren/Zinsen aus dem Dunning-Fluss sind nicht festgelegt.
- Storno/Korrektur referenziert Bestellung, Eingang, Rechnung oder Zahlung und bewahrt Historie; Periodenregel OPEN.

## E. Kostenlogik

| Kostenart | MVP-Behandlung und Zeitpunkt | Auftragszuordnung |
|---|---|---|
| Material | Tatsächlicher Verbrauch × gleitender Durchschnittspreis (E3); Zugang und Verbrauch getrennt. Unverbrauchte Menge bleibt Bestand. | Direkt zum Auftrag, wenn Verbrauchsereignis darauf referenziert. |
| Fremdleistungen | Bestätigte Leistung × akzeptierter Preis; Kostenentstehung bei Leistungsannahme nach vereinfachter Regel. | Direkt zum Auftrag bei eindeutigem Bezug. |
| Arbeitskosten | Bestätigte Monatsbruttolöhne 10.400 € plus 21 % Arbeitgeberkosten (D-0065–68); Stunden-/Kostensatz pro Auftrag hängt von den noch zu liefernden Arbeitsstunden ab. Keine Lohnabrechnung. | CNC/PROD inkl. Arbeitgeberkosten sind Fertigungslöhne/FGK-Basis; MA-AV inkl. Nebenkosten ist Vw/Vt-GK-Pool (D-0066/69/70). |
| Maschine/Anlage | CNC-Kalkulatorische BAB-Kosten werden als FGK anhand des inflationsangepassten Wiederbeschaffungswerts verteilt: `(120.000 € × 1,02^16) / 192`, Monatsbetrag auf volle Euro aufgerundet (D-0071–76). Davon getrennt ist die bilanzielle Buchabschreibung; CNC-Eröffnungsbuchwert 0 € (D-0099). | CNC-Maschinenkosten nach bestätigter BAB-Zuordnung; Stunden-/Periodenbezug folgt A02. |
| Energie | Verbrauchsmenge oder Maschinenstunden × einfacher Satz; nur mit A02-Mengen oder transparentem Näherungswert. | Direkt mit Zuordnungsbasis; pauschale Energie als allgemeine Kosten. |
| Transport | Tatsächliche/vereinbarte Ein- oder Ausgangsfracht bei Beleg/Leistung; keine automatische Doppelzählung im Materialpreis. | Direkt bei eindeutiger Bestell-/Auftragsreferenz. |
| Sonstige direkte Kosten | Begrenzte benannte Position mit Betrag, Zeitpunkt und Referenz. | Direkt nur mit dokumentiertem Auftragsbezug. |
| Gemeinkosten | BAB-Zuschläge bestätigt: MGK 15 % der MEK, FGK 100 % der Fertigungslöhne, Vw/Vt-GK 10 % der Herstellkosten (D-0062–64). | Zuordnung nach bestätigtem statischem BAB; keine Doppelzählung der Einzelkosten. |
| Allgemeine laufende Kosten | Einfache Unternehmenskosten nach Intervall; keine künstliche Auftragsverteilung. | Allgemein, aus Auftragsergebnis ausgeschlossen solange keine Regel beschlossen ist. |

**Kostenzeitpunkt und Liquidität:** Kosten entstehen nach Leistungs-/Verbrauchsereignis; Zahlung ist separat. Unbezahlte Kosten können Ergebnis/Verbindlichkeit betreffen, ohne Liquidität zu ändern. Vorauszahlungen können Liquidität ändern, bevor Verbrauchskosten entstehen; Vorauszahlungslogik bleibt OPEN/später.

**D3-Status:** Der statische BAB gehört zu V1. Bestätigte Sätze (D-0062–64): MGK 15 % der MEK; FGK 100 % der Fertigungslöhne; Vw/Vt-GK 10 % der Herstellkosten. Bestätigte Personalparameter (D-0065–70): Bruttolöhne 10.400 €/Monat; Fertigungslöhne CNC 3.800 € + PROD 3.100 € = 6.900 €/Monat; MA-AV 3.500 €/Monat nicht Fertigungslohn. Arbeitgeberkosten 21 % = 2.184 €/Monat, Gesamt 12.584 €/Monat; CNC/PROD-Arbeitgeberkosten gehören zur FGK-Basis (6.900 × 1,21 = 8.349 €/Monat); MA-AV-Gesamtkosten 4.235 €/Monat gehören in den Vw/Vt-GK-Pool. Die CNC-kalkulatorischen Kosten gehören ebenfalls in FGK nach D-0071–76. Noch offen sind keine dieser bestätigten Sätze, sondern weitere Kostenstellenzuordnungen, Perioden-/Buchungsdetails und nicht festgelegte sonstige Betriebskosten.

## F. Erlöslogik

- Angebot speichert Preis und erwartetes Ergebnis, erzeugt keinen realisierten Erlös.
- Auftragsannahme speichert vereinbarten Auftragswert und Planerlös, aber weder Forderung noch Zahlung.
- Lieferung/Abnahme liefert Mengen- und Leistungsnachweis; die freigegebene Rechnung für erbrachte/abrechenbare Leistung begründet Forderung und vereinfachten Auftragserlös (D-0112).
- MVP-Arbeitsregel: Erlös entsteht für abgerechnete Leistung bei freigegebener Kundenrechnung. Noch nicht fakturierte Lieferungen sind operative abrechenbare Leistung, keine Forderung.
- Zahlungseingang ist kein neuer Erlös.
- V1 umfasst vollständige Auftragsabwicklung ohne Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung. Die finanzielle Abbildung von Teilvorgängen ist eine spätere Erweiterung und keine offene V1-Scope-Wahl.
- Preisänderung nach Auftrag bedarf referenzierter Auftrags-/Rechnungsänderung; Befugnis und Zeitpunkt OPEN.

## G. Liquiditätslogik

**Liquidität zum Zeitpunkt t = Anfangsliquidität + tatsächliche Zahlungseingänge bis t − tatsächliche Zahlungsausgänge bis t**

- Eröffnungsliquidität beträgt 30.000 € zum 01.01.2027; der 50.000-€-Rahmen ist getrennt und die 20.000 € Rest-Rahmen sind kein Cash.
- Kundenzahlungseingänge folgen dem Kundenverhalten und werden unabhängig von eigener Liquidität erfasst; ein tatsächlicher Eingang erhöht die Liquidität und reduziert die Forderung.
- Eigene Lieferanten-/Gläubigerzahlungen werden am Fälligkeitstag vollständig versucht. Nur eine erfolgreiche vollständige Zahlung vermindert Liquidität und offenen Posten; ein Liquiditätsfehlschlag wird ohne Cashbewegung dokumentiert und in den bestätigten V1-Mahn-/Dunning-Fluss überführt.
- Bei konkurrierenden fälligen Rechnungen wählt der Spieler die Zahlungsreihenfolge. Ein Dispositionskredit wird als Option angeboten, jedoch nicht automatisch gezogen; Dispozins ist 8 % über individuell vereinbartem Unternehmenszinssatz (D-0021/23). Der Unternehmenszinssatz nutzt EZB-MRO zum 1. Januar plus die bestätigte Fremdkapitalquote-Aufschlagskurve gemäß D-0022/D-0100–09. Limit, automatische Nutzung, Draw und Rückzahlung des Dispokredits bleiben offen.
- Ein-/Auszahlungen genau einmal zum tatsächlichen Simulations-Zahlungsdatum erfassen; fehlgeschlagene Versuche sind keine Zahlungen und erzeugen keine Liquiditätsbewegung.
- Forderungen/Verbindlichkeiten separat vom Zahlungsmittelbestand ausweisen.
- Fälligkeit allein ändert Liquidität und offenen Posten nicht. Kundeneingang erfolgt V1 am vertraglichen Fälligkeitstag ohne Cash-Gate; ausdrückliches Verzögerungsereignis ist Ausnahme (D-0110). Eigene Zahlungen folgen dem Vollzahlungsversuch sowie Prioritäts-/Retry-/Dunning-Regeln aus D-0021–29; beide Ströme bleiben getrennt.
- Auftragskosten können vor Zahlung Kosten/Verbindlichkeit erzeugen; Erlös/Forderung kann vor Kundenzahlung entstehen. Ergebnis und Liquidität laufen auseinander.
- Laufende Kosten belasten Liquidität erst beim Zahlungsausgang; Kostenentstehung separat.
- Keine Kreditlinie, Insolvenzautomatik, Finanzierung oder Kontokorrentregel ohne Scope-Entscheidung.
- Invarianten: Zahlung gleicht höchstens den offenen Posten aus, sofern Überzahlung nicht ausdrücklich behandelt wird; jede Liquiditätsänderung ist auf Eröffnung oder Zahlung zurückführbar.

## H. Auftragsergebnis

**Auftragsergebnis = Auftragserlös − zugeordnete auftragsbezogene Ist-Kosten**

Einbezogen: Materialverbrauch, angenommene Fremdleistungen, zugeordnete Arbeitskosten, Maschinen-/Energiekosten nur bei festgelegten MVP-Sätzen, Transport und sonstige direkte Kosten. Gemeinkosten nur nach beschlossener einfacher Methode. Allgemeine Fixkosten bleiben außerhalb des einzelnen Auftragsergebnisses und erscheinen als allgemeine Kosten.

Plan-Kalkulation, Ist-Kosten und realisierter Erlös getrennt halten. Unfakturierte Leistung und offene Kosten können als vorläufig markiert werden. Operativer Auftragsabschluss bedeutet nicht automatisch bezahlt oder finanziell vollständig abgeschlossen. Zahlung ändert Liquidität/offene Posten, nicht erneut das Auftragsergebnis.

## I. Netto, Brutto und SimTAX

Netto-/Bruttobeträge beeinflussen Angebotspreis, Rechnungsbetrag, Kundenzahlung, Lieferantenzahlung, offene Posten, Kosten, Erlösdarstellung und Auftragsergebnis. Für V1 ist SimTAX als simulierte Einstellung von 19 % bestätigt; je Rechnungsposition wird der Steuerbetrag auf Cent gerundet, anschließend werden die gerundeten Positionsbeträge summiert. Das ist keine Aussage über reale Steuerregeln.

**V1-Vorsteuerregel (D-0113/D-0114):** SimTAX wird auch auf eingehenden externen Lieferantenrechnungen als Vorsteuer-Simulationssaldo berücksichtigt, sofern die zugrunde liegende Lieferung/Leistung für das Unternehmen durch einen anderen Unternehmer ausgeführt wurde, eine ordnungsgemäße Rechnung vorliegt und die Steuer nach der V1-Abbildung abzugsfähig ist. Der Vorsteuer-Simulationssaldo wird mit dem Umsatzsteuer-Simulationssaldo verrechnet. Vorsteuer-Sonderfälle, Ausschlüsse und anteilige Abzüge werden in V1 nicht simuliert. Diese Scope-Grenze behauptet nicht, dass solche Einschränkungen im realen UStG fehlen. SimTAX ist keine echte Steuerabrechnung.

**Regeln und verbleibende Offenheit:** SimTAX-Basis, Positionsgesamtwert, kaufmännische Cent-Rundung und referenzierte Korrektur sind durch D-0053–57 festgelegt. Kunden- und Lieferantenrechnungen folgen D-0056 und D-0113/14; SimTAX-Salden werden gemäß D-0058 verrechnet, Zeitraum/Fälligkeit folgen D-0059/D-0097. Offen sind konkrete Ereignisse zur Erkennung fehlerhafter abgegebener Erklärungen (D-0115/16). Nichtsteuerliche Korrektur nach Abschluss folgt D-0119. SimTAX bleibt Spielwert, keine echte Steuerabrechnung.

Bis dahin bleibt jeder Betrag ein einfacher MVP-Geldbetrag ohne Netto-/Bruttoetikett. Rechnungssumme und tatsächlicher Zahlungsbetrag müssen in der später gewählten Variante konsistent sein.

## J. Materialbewertung

Für den MVP genügt einfache Bewertung: Eingang dokumentiert Menge und Einstandspreis; Verbrauch ordnet Menge und daraus berechneten Materialwert dem Auftrag zu. Bestand ergibt sich aus Anfangsbestand + akzeptierten Zugängen − Verbrauch − bestätigten Korrekturen. Fehlbestand vermeiden, sofern A02 keinen ausdrücklichen Fehlbestandspfad vorgibt.

**E3 (bestätigt):** gleitender Durchschnittspreis. Der bestätigte Vorrats-Gesamtwert zum 01.01.2027 beträgt 12.800 €; bestätigte Einzelmenge ist Stahl 2.000 kg (D-0090). Nach D-0091 wird der Stahl-Eröffnungswert aus dem bereitgestellten Vorjahresschluss übernommen. Weder 6.400 € noch 3,20 €/kg sind bestätigte Stahlwerte.

Die bisherigen A02-Profilangaben Aluminium 800 kg / 4.400 € und Norm-/Zukaufteile 1.000 Einheiten / 2.000 € (implizit 5,50 €/kg bzw. 2 €/Einheit) sind unbestätigte Profilwerte; sie sind keine bestätigten Eröffnungsbestände oder Einzelbewertungen. D-0094–96 bestätigen Warengruppen/Scope, aber keine zugehörigen Anfangsmengen oder Geldwerte. Somit sind die 12.800 € als Gesamtposition rechnerisch noch nicht gegen Komponenten abstimmbar. Vereinbarkeit mit D-0091 erfordert eine belegte Aufteilung `12.800 € = Stahlwert aus Vorjahresschluss + bestätigter Wert der übrigen Vorräte`. A03 zieht keinen Stahlwert als Restgröße ab. Es fehlt die bereitgestellte Vorjahresschluss-/Eröffnungsbewertung je Vorratsgruppe; falls die belegte Summe von 12.800 € abweicht, ist A01 eine Nutzerentscheidung darüber vorzulegen, welcher bestätigte Eröffnungswert Vorrang hat.

## K. Zahlungsziele

Zahlungszielregeln und Fristanker sind gemäß C/D und D-0013–20 entschieden. Kunden: spätere tatsächliche Leistung und Rechnungsdatum, 14 Tage Standard oder 30 Tage individuelle Vereinbarung. Lieferanten: Rechnungsdatum bei pünktlicher Lieferung, 30 Tage Standard. Ankertag zählt als Tag 1; N Kalendertage ergeben Ankerdatum + (N−1), Wochenendverschiebung zum nächsten Arbeitstag. Feiertage werden V1 nicht berücksichtigt.

D-0011 ergänzt die Finanzregel um den Arbeitstagskalender: Montag bis Freitag, Wochenenden arbeitsfrei, Feiertage in V1 nicht berücksichtigt, Wochenendtermine auf nächsten Arbeitstag verschoben. Die Zahlungsziele zählen Kalendertage und der Ankertag ist Tag 1. T-0009 ist durch A02 mit CP-0150 abgeschlossen; dies ändert nicht die bestätigte Finanzformel.

Fälligkeit ist ein Datum/Finanzstatus, kein Zahlungsereignis. Kundeneingang erfolgt am Fälligkeitstag vollständig, außer ausdrücklich festgelegtes Verzögerungsereignis; ohne eigenes Cash-Gate (D-0110). Eigene Zahlungen: Spieler wählt Reihenfolge fälliger Rechnungen; Dispositionskredit wird als weitere Option angeboten, aber automatische Nutzung, Limit und Draw/repayment bleiben offen (D-0021/23). Fehlversuch: Vollzahlungs-Retry wöchentlich, acht Wiederholungsversuche, Erinnerung nach 10 Kalendertagen, formelle Mahnung weitere 14 Kalendertage; nach Mahnung keine Pfändung/Liquidation in V1 (D-0024–29). A02 muss Tages-/Ereignisreihenfolge und Kalenderablauf übernehmen; Abstimmung der Ausführung bleibt offen, nicht die bestätigten Regeln.

## L. Korrekturen

- **Falsche Rechnung:** Entwurf vor Freigabe korrigieren; nach Freigabe referenzierter Storno-/Korrekturvorgang und neue Rechnung. Keine Überschreibung, die Forderung/Zahlungshistorie verschleiert.
- **Stornierung:** vor Leistung/Auftragseffekt operativ zurückziehen; entstandene Forderung, Verbindlichkeit oder Zahlung durch referenzierte Finanzkorrektur ausgleichen. Folgen bei verbrauchtem Material/erbrachter Leistung OPEN.
- **Preis-/Mengenänderung:** Auftragsänderung mit Zeitpunkt und alter/neuer Referenz; bereits fakturierte Menge nur über Korrekturbeleg. Zulässigkeit nach Auftrag/Leistung OPEN.
- **Auftragskorrektur:** A02 meldet operative Korrektur und betroffene Positionen/Mengen; A03 prüft Kosten-/Erlös-/Forderungsfolgen. Historie erhalten.
- **Zahlungskorrektur:** Fehlzuordnung/-betrag durch referenzierte Gegen-/Korrekturbewegung korrigieren. Ausgeführte Zahlung nicht als nicht geschehen löschen. Gebühren/Rücklastschrift später, sofern nicht gefordert.
- **Periodenabschluss:** Rückdatieren, aktuelle Periode korrigieren oder Lauf neu rechnen ist OPEN für User/A02/A11. Keine stillschweigende Änderung abgeschlossener Finanzhistorie.

## M. Finanzielle Read Models

MVP muss autoritativ aus Accounting abfragbar machen:

- Liquiditätsbestand zum aktuellen Simulationszeitpunkt mit nachvollziehbaren Zahlungsein-/ausgängen;
- Einnahmen-/Ausgabenbewegungen sowie Kosten/Erlöse getrennt von Zahlungen;
- offene/überfällige Forderungen je Kunde/Rechnung mit Betrag, Fälligkeit und Restbetrag;
- offene/überfällige Verbindlichkeiten je Lieferant/Rechnung mit Betrag, Fälligkeit und Restbetrag;
- je Auftrag: erwarteter Auftragswert, fakturierter/realisierter Erlös, Ist-Kosten nach Kategorien, ggf. offene abrechenbare Leistung, Plan-Ist-Abweichung, vorläufiges/finales Ergebnis und offene Posten;
- allgemeine laufende Kosten getrennt von Auftragskosten;
- Geldbetrags-/Steuerstatus, Zeitbezug und unvollständige Zuordnungen sichtbar, sobald Betragsvariante gewählt ist.

Dies sind fachliche Sichten, keine UI-Vorgabe oder Schema. Gewinn, Liquidität, Forderungs- und Verbindlichkeitsbestand nicht vermischen.

## N. Übergabe A02 → A03

| A02-Ereignis / Zeitpunkt | A02 liefert | A03 interpretiert / erzeugt | Abhängigkeit / offen |
|---|---|---|---|
| QuoteCalculated / QuoteIssued | Version, Kunde, Menge/Leistung, Preis, Kalkulationspositionen/-annahmen, Termine, Konditionen | Planerlös, Plankosten, erwartete Marge | Preis-/Netto-Brutto-Bedeutung OPEN; kein Ledger-Effekt |
| OrderAccepted | Auftrags-ID, angenommene Version, Kunde, Umfang/Menge, Preis, Liefer-/Zahlungskonditionen | Planwerte/vertraglicher Bezugswert | Keine Forderung; A02 verantwortet Leistungsregeln |
| PurchaseOrderPlaced | Bestellung, Lieferant, Position, Menge, Preis, Lieferdatum, Zahlungsziel, Auftrag | Bestellbindung/Vorschau, noch keine Zahlung | Verbindlichkeitstrigger OPEN |
| GoodsReceived / SubcontractedServiceAccepted | Datum, akzeptierte Menge/Leistung, Preis, Bestellung/Auftrag | Bestandzugang bzw. Leistung, Verbindlichkeit/Kosten nach Regel | Belegreihenfolge/Abweichung mit A02 klären |
| MaterialConsumed / WorkProgressed / CapacityConsumed | Auftrag, Ressourcenart, Istmenge/-stunden, Zeitpunkt/Periode, ggf. Satz-/Ressourcenreferenz | Bewertete Ist-Kosten und Zuordnung | A02-Messgranularität, A03-Raten/Bewertung |
| OrderDelivered / DeliveryAccepted | Menge, Leistungsdatum, Auftrag/Kunde, Nachweis, Fracht | Abrechnungsreferenz und ggf. Transportkosten | D-0112: abrechenbare Leistung wird durch freigegebene Rechnung finanziell erfasst; keine Teillieferung |
| CustomerInvoiceIssued | Referenz, Betrag/Positionen, Datum, Leistungs-/Auftragsbezug, Fälligkeit | Forderung und vereinfachter Auftragserlös bei erbrachter/abrechenbarer Leistung (D-0112) | Betrags-/SimTAX-Regeln gemäß § I |
| SupplierInvoiceReceived | Lieferant, Betrag, Bezug auf Bestellung/Eingang/Leistung, Datum/Fälligkeit | Bei Bestandsposten Verbindlichkeit abgleichen; Kosten/Bestand zuordnen | D-0111: Entstehung bei Eingang/Leistung, Rechnung bestätigt Betrag/Fälligkeit |
| CustomerPaymentTriggered / CustomerPaymentReceived | Kunden-/Rechnungsreferenz, voller Betrag, Auslösegrund bzw. Verspätungsgrund und tatsächliches Eingangsdatum | Kundenverhalten löst Eingang unabhängig vom eigenen Bankbestand aus; tatsächlicher Eingang erhöht Liquidität und reduziert/schließt Forderung | Konkrete Kundenverhaltens-/Zeitparameter bleiben OPEN |
| SupplierPaymentAttempted / SupplierPaymentMade / SupplierPaymentFailedInsufficientLiquidity | Gläubiger-/OP-Referenz, voller Betrag, Fälligkeit, Versuchsergebnis; Zahlungspriorität und Retry-/Dunning-Stufenereignisse | Erfolg vermindert Liquidität und OP; Fehlschlag lässt beide unverändert und löst den bestätigten Fluss D-0021–29 aus | A02 bildet Zeitpunkte/Ereignisreihenfolge ab; keine Teilzahlung in V1 |
| laufende Kosten / Fälligkeit | Kostenparameter, Intervall, Zeitraum, Fälligkeit/Zahlungsereignis | Allgemeine Kosten und getrennte Zahlung | Zeitraster/Startprofil OPEN |
| OrderClosed / OrderResultCalculated | Abschlussstatus/-grund, operative Restmengen und Leistungsstatus | Finanzvollständigkeit und Auftragsergebnis zurückliefern | A02/User bestimmt Abschlussbedingung; Zahlung muss nicht Abschlussbedingung sein |

A02 übergibt Tatsachen mit stabiler Ereignisreferenz, Auftrag/Gegenpartei/Belegbezug, Beträgen oder Mengen, Zeitbezug und Korrekturbezug. Das ist fachlicher Informationsbedarf, keine API-/Schemafestlegung. A03 gibt Finanzstatus/Ergebnis zurück; A02 leitet keine autoritativen Salden aus Planwerten ab.

## O. Fachliche Datenanforderungen A03 → A04

A04 benötigt nach Produktentscheidungen fachlich ausdrückbare Informationen für: Eröffnungsliquidität mit Stichtag; Geldbetrag/Währung und Netto-/Brutto-/Steuersemantik; Forderung/Verbindlichkeit mit Ursprung, Gegenpartei, Auftrag/Rechnung, Betrag, Fälligkeit, Restbetrag und Status; Kosten-/Erlöspositionen mit Entstehungs-/Leistungsdatum, Zuordnung, Kategorie und Korrekturbezug; Zahlung mit Datum, Betrag und Zuordnung; Materialzugang/-verbrauch mit Menge, Preis/Bewertungsreferenz, Bestand und Auftrag; Kalkulationsversion getrennt von Istpositionen; daraus ableitbare Liquidität, offene Posten und Auftragsergebnis. Diese Liste definiert weder Entitäten, Tabellen, Aggregate, Buchungssätze noch Persistenzmuster.

## P. Offene Entscheidungen

| Frage | Vorschlag/Status | Betroffene Rollen | User-Entscheidung? |
|---|---|---|---|
| Netto/Brutto/USt. | OPEN; keine Steuerregeln annehmen; Geldsemantik festlegen | User, A02, A04, A11 | Ja, vor belastbarer Rechnungs-/Betragssemantik |
| 14-/30-Tage-Fristanker und Formel | Kunden: späterer Leistungs-/Rechnungszeitpunkt; Lieferanten: Rechnungsdatum bei pünktlicher Lieferung; Zielwerte gemäß D-0018–20 | A02/A03 | Entschieden; A02-Ereignisabbildung abstimmen |
| Tageszählung und wirksame Fälligkeit | Zahlungsziele zählen Kalendertage, Ankertag Tag 1, Wochenende auf nächsten Arbeitstag, Feiertage unberücksichtigt; T-0009 A02-Übernahme COMPLETED (CP-0150) | A02/A03 | Nutzerregel entschieden; Ereignisumsetzung abstimmen |
| Kundenzahlung und eigene Zahlungsverpflichtung | Kundeneingang folgt Kundenverhalten, ohne Cash-Prüfung beim Unternehmen; automatischer Vollzahlungsversuch bei eigener Verbindlichkeit | A02/A03 | Nein für die Richtungsabgrenzung |
| Kundenverhaltensparameter | V1-Eingang am Fälligkeitstag; ausdrückliches Verspätungsereignis ist Ausnahme; A02 event details | A02/A03 | Kernregel entschieden; spätere Profile offen |
| Eigene Auszahlungen und Dunning | Spielerwahl der Zahlungsreihenfolge; wöchentliche Retries, 8 Retry-Fehlschläge, Erinnerung nach 10 Kalendertagen, Mahnung weitere 14 Kalendertage; keine Pfändung/Liquidation nach Mahnung in V1 | A02/A03 | Kernregeln entschieden; operative Ereignisdetails offen |
| SimTAX-Details | 19 %, Positionswert vor SimTAX, Positionssumme, kaufmännische Cent-Rundung, referenzierte Korrektur; Lieferanten-Vorsteuer nach D-0113/14 | A02/A03/A04 | Kernregeln entschieden; Erkennungsereignisse für Erklärungsfehler offen |
| Darlehenszahlungsplan | 24.000 €, 5 % nominal p.a.; 7 Jahre Annuität, monatlich letzter Geschäftstag, 30E/360, Monatszins centgerundet, Zins mit Rate; D-0042/43 Fehlzahlungsverlauf | A02/A03 | Regelkern entschieden; konkrete Rate und erster Zahlungstermin offen |
| D3-BAB- und Betriebskostenwerte | Statischer BAB; bestätigte Sätze MGK 15 %, FGK 100 %, Vw/Vt 10 %; Payroll-/Zuordnungswerte siehe E | A02/A03 | Sätze entschieden; nicht belegte sonstige Kosten und Ausführungsdetails offen |
| Materialbewertung/Anfangsbestand | E3 gleitender Durchschnitt; Stahl 2.000 kg mit Eröffnungswert aus Vorjahresschluss (D-0090/91) | A02/A03/A04 | Bewertungsmethode/Menge entschieden; Vorjahresschluss-Übergabe offen |
| Kostenabgrenzung und Kostenraten | OPEN; direkte Kosten zwingend, Gemeinkosten optional/einfach | User/A02/A03 | Ja für Umfang und Sätze |
| Kostenzeitpunkt | OPEN für Verbrauch, Arbeit, Fixkosten, Vorauszahlung | A02/A03/User | Ja, soweit konkrete Regel/Startwerte gewählt werden |
| Erlösrealisierung/Forderungsentstehung | V1 bestätigt: Rechnung nach erbrachter/abrechenbarer Leistung löst Forderung und vereinfachten Auftragserlös aus (D-0112) | Nutzerentscheidung; A02/A03 für Leistungsereignis und Finanzumsetzung | Produktregel entschieden; Rechnungs- und Leistungsreferenz bleibt erforderlich |
| Verbindlichkeitsentstehung | V1 bestätigt: bei akzeptiertem Wareneingang bzw. bestätigter Fremdleistung; Rechnung bestätigt Betrag/Fälligkeit (D-0111) | Nutzerentscheidung; A02/A03 für Triggerfolge und finanzielle Umsetzung | Triggerproduktregel entschieden; konkrete Ereignisfolge bleibt A02-Abhängigkeit |
| Vollständige Auftragsabwicklung ohne Teilproduktion/-lieferung/-rechnung/-zahlung | für V1 durch D-0010 entschieden; Teilvorgänge sind spätere Erweiterung | A02 für operative Abläufe; A03 für finanzielle Interpretation; A04 für Modellabbildung | Nein für V1-Scope; konkrete Regeln für spätere Erweiterung später |
| Abschluss bei unbezahlter Rechnung | Empfehlung: operativer Abschluss und Zahlung getrennt | User/A02/A03 | Ja für Produktabschluss |
| Allgemeiner Buchungsperiodenabschluss | V1: Geschäftsjahr dauert zwölf Monate und endet mit Kalenderjahresende (D-0117/D-0118); alternatives Wirtschaftsjahr nur mögliche V2-Prüfung | Nutzerentscheidung; A02/A03 für Umsetzungsdetails | V1-Intervall entschieden |
| Nichtsteuerliche Korrektur nach Periodenabschluss | Folgejahr: Vorsteuer-Simulationssaldo gutgeschrieben und Umsatzsteuer-Simulationssaldo neu belastet (D-0119); in V2 neu bewerten | Nutzerentscheidung; A03 für Finanzabbildung | V1-Regel entschieden; Anwendung bei konkreten Fehlerfällen im Fachauftrag abzugleichen |
| Startdaten des bestehenden Betriebs | OPEN; Werte und Stichtag fehlen | User/A02/A03/A04 | Ja, konkrete Profilwerte erforderlich |
| Fehlgeschlagener eigener Fälligkeitsversuch / Dunning | Vollzahlungsversuch, Spielerpriorität, wöchentliche Retries/acht Retry-Fehlschläge, Erinnerung +10 Kalendertage, Mahnung +14 Kalendertage, keine weitere V1-Pfändung/Liquidation gemäß D-0021–29 | A02/A03/A04 | Regeln entschieden; Ereignisabfolge abstimmen |

## Q. Abhängigkeiten zu A02, A04 und A11

- **A02:** Prozessereignisse/-reihenfolge, Simulationszeit und Perioden, Abnahme, Ressourcenverbrauch, Zahlungsauslösung, vollständige Auftragsabwicklung und Korrekturablauf festlegen. A03 spezifiziert die finanzielle Interpretation.
- **A04:** kann später Persistenz ableiten; vorher Geld-/Steuersemantik, Eröffnungssalden, Ereigniszeitpunkte und Korrekturregeln entscheiden oder ausdrücklich als offene Annahmen behandeln. Teilvorgänge sind keine V1-Anforderung.
- **A11:** Systemgrenzen, Übergabeverantwortung, Zeit-/Periodenorchestrierung und Korrekturen prüfen. Diese Spezifikation gibt keine Architektur frei.
- **User:** finale Produktentscheidungen zu Realismus, Betragssemantik, Startzustand sowie Kosten-/Zahlungsregeln treffen. Der V1-Ausschluss von Teilvorgängen ist bereits durch D-0010 entschieden.

## R. Abschluss und nächster Schritt

**A03 innerhalb der Fachautorität festgelegt:** Liquidität und Ergebnis trennen; Plan, Vertrag, Leistung, Rechnung und Zahlung trennen; minimale Finanzbegriffe und Formeln; A02 führt keine eigene Finanzwahrheit; Mindestinformationen für Read Models und Übergaben.

**Offen:** Nicht festgelegte Betrags-/Steuerdetails, operative Ereignisreihenfolge, Darlehensrate/erster Zahlungstermin, Kosten-/Zuordnungsdaten und konkrete Vorjahresschluss-Übergabe für Stahl. Zahlungsziele, Kunden-/Lieferantentrigger, grundlegender Retry-/Mahnfluss, Annuitäten- und SimTAX-Kern, BAB-Sätze sowie E3-Bewertung sind gemäß referenzierten D-Entscheidungen festgelegt. Teilvorgänge sind für V1 ausgeschlossen.

**User muss entscheiden:** die in Abschnitt P mit „Ja“ markierten Produktfragen, soweit sie für den ersten MVP benötigt werden. Keine Steuer-/Rechtsregel wird vorausgesetzt.

**An A02 zurück:** Ereigniszeitpunkte und Belegreihenfolge bei Beschaffung/Eingang/Lieferantenrechnung; Leistungs-/Abnahmeereignis und Rechnungsfähigkeit; Zeitraster, Zahlungsauflösung und operative Abschlussbedingung für vollständige V1-Auftragsabwicklung; Istmengen/-stunden und Zeitbezug. Teilvorgänge sind keine offene V1-Scope-Frage.

**A04 benötigt anschließend:** Betragssemantik, Stichtag/Eröffnungswerte, Trigger/Referenzen für offene Posten, getrennte Leistungs-/Rechnungs-/Zahlungsdaten, Kosten-/Erlöspositionen, Materialmengen/-werte und versionierte Kalkulation. Vor Klärung nur als explizit offene Annahmen behandeln.

**Checkpoint:** erforderlich und mit CP-0008 dokumentiert, weil Finanzsemantik und Folgeabhängigkeiten wesentliche fachliche Erkenntnisse festhalten.

**T-0005:** fachlich abgeschlossen als Spezifikationsarbeit. Offene Fragen blockieren nicht diese Spezifikation, wohl aber endgültige Produktregel-/Datenmodellfreigabe. Kein Code, Schema, Supabase, Dependency, Architekturstatus oder D-ID geändert.

**Nächster Schritt:** A01 nimmt Bericht/CP in den Arbeitsstand auf; A02 beantwortet die zurückgegebenen Prozess-/Zeitpunkte; der User priorisiert benötigte offene Entscheidungen. Danach kann A04 Datenmodell ableiten und A11 Schnittstellengrenzen prüfen.

## S. Eröffnungsbilanz und Maschinendarlehen (Nutzerentscheidung 01.01.2027)

### Eröffnungsbilanz

| Aktiva | Betrag |
|---|---:|
| Bank | 30.000 € |
| Forderungen | 12.500 € |
| Vorräte gesamt (Einzelaufteilung noch nicht bestätigt) | 12.800 € |
| Gebrauchte CNC-Maschine, Buchwert (D-0099) | 0 € |
| **Summe Aktiva** | **55.300 €** |

| Passiva | Betrag |
|---|---:|
| Lieferantenverbindlichkeiten | 7.500 € |
| Maschinendarlehen | 24.000 € |
| Eigenkapital (Restposition laut Nutzerentscheidung) | 23.800 € |
| **Summe Passiva** | **55.300 €** |

**Rechenprüfung:** 30.000 + 12.500 + 12.800 + 0 = 55.300 €. 7.500 + 24.000 + 23.800 = 55.300 €. Bilanzdifferenz = 0 €. D-0099 ersetzt den früheren Szenario-Buchwert von 40.000 € durch 0 €; entsprechend sinkt die Eigenkapital-Restposition von 63.800 € auf 23.800 €.

Die Herkunft des ausgewiesenen Eigenkapitals ist fachlich: **Eigenkapital = Eröffnungsvermögen 55.300 € minus Eröffnungsverbindlichkeiten 31.500 € = 23.800 €**. Es ist die bilanzielle Restposition, nicht zusätzlich verfügbares Geld. Eine historische Aufteilung in Einlagen, einbehaltene Ergebnisse oder andere Eigenkapitalunterkonten ist nicht vorgegeben.

Der 50.000-€-Gesamtfinanzierungs-/Budgetrahmen bleibt separat: 30.000 € davon sind als Bankbestand angegeben; 20.000 € ungenutzter Rahmen sind weder Cash noch zusätzliche Passivposition. Die 24.000 € Maschinendarlehen sind bereits separat in der Eröffnungsbilanz enthalten. Die historischen Darlehensauszahlungen werden am Simulationsstart nicht erneut als Einnahme erfasst.

### Bestätigte deterministische Darlehenslogik

**Startwerte:** Hauptschuld 24.000 € zum 01.01.2027; Zinssatz nominal 5 % p.a., fest während der Restlaufzeit; ursprünglich zehnjährige Finanzierung. Die bestätigte Restlaufzeit beträgt sieben Jahre; gleichbleibende monatliche Annuitäten (D-0030–33, D-0039). Darlehensschuld bleibt getrennt vom CNC-Buchwert 0 € (D-0099).

Die Rate ist am letzten Geschäftstag jedes Monats fällig. Zinsen werden nach deutscher 30E/360-Methode auf die laufende Restschuld berechnet; maßgeblicher Saldo ist der am Kalendertag vor der nächsten Rate offene Saldo. Monatliche Zinsen werden kaufmännisch auf Cent gerundet; Rundungsrest wird in der Schlussrate ausgeglichen. Zinsen werden mit der Monatsrate gezahlt (D-0034–41). Tilgungs- und Zinsanteil sind getrennt: Zins ist Aufwand; Tilgung reduziert Hauptschuld und Liquidität, ohne zweiten Aufwand; Zahlung mindert Liquidität um die volle Rate.

Bei ausbleibender Rate tritt unmittelbar Verzug ein; wöchentliche erneute Zahlungsversuche. Sind insgesamt drei Raten nicht gezahlt, wird die Maschine gepfändet und zum dann aktuellen Marktwert liquidiert; Erlös tilgt Darlehen, Überschuss geht aufs Geschäftskonto. Bei Erlösdefizit erlischt die Restschuld (D-0042/43). Diese darlehensspezifische Regel gilt zusätzlich zur allgemeinen Lieferanten-Dunning-Regel und ersetzt diese nicht.

**Noch offen:** genauer erster Zahlungstermin trotz monatlicher Terminregel (D-0032/33), konkrete Annuitätenhöhe/Anfangsrate und Schlussrate, sowie detaillierte Ereignisdefinition bei „drei nicht gezahlten Raten“ und maschinenbezogene Verwertungsausführung, sofern nicht durch A02-Ereignisse weiter konkretisiert. Keine Werte oder Defaults ergänzen. Der 5-%-Nominalzins ist nun für die deterministische Verzinsung hinreichend ergänzt durch Methode, Periodik, Stichtag und Rundung; er allein wäre dafür nicht ausreichend gewesen.

<!-- Historische Alternativen aus der früheren Entscheidungsvorlage; durch D-0030 bis D-0043 nicht mehr offene V1-Optionen. -->
### Historische Tilgungsoptionen (durch Nutzerentscheidung ersetzt)

| Option | Mechanik | Zins-/Tilgungs-/Liquiditätswirkung | Vorteile und Nachteile |
|---|---|---|---|
| **L1 – Gleichbleibende Annuität** | Feste Gesamtperiodenrate; Zinsanteil sinkt und Tilgungsanteil steigt mit sinkendem Hauptbetrag. | Zinsaufwand auf periodischen Restbetrag; Zahlung belastet Cash um Rate; Hauptschuld sinkt um Tilgungsanteil. Benötigt Restlaufzeit und Periodenzins. | Gut planbarer Cashabfluss; benötigt mehr Vertragsparameter und Rundungs-/Schlussratenregel. |
| **L2 – Gleichbleibende Tilgung** | In jeder Periode gleicher Hauptbetrag; Zinsen kommen zusätzlich auf den Restbetrag. | Anfangsraten höher, danach sinkend; Gesamtzahlung = feste Tilgung + Periodenzins. | Transparente Schuldenreduktion und sinkender Zins; Cashbelastung anfangs höher. |
| **L3 – Endfällige Tilgung / Bullet** | Während der Laufzeit Zinszahlungen, Hauptbetrag bleibt bis zu einem bestätigten Endtermin bestehen. | Periodischer Cashabfluss ist zunächst Zins; am Endtermin zusätzlich volle Hauptschuld. | Niedrigere laufende Auszahlung; großer Endbetrag und Endtermin/Risiko müssen explizit simuliert werden. |

Die Alternativen L1/L2/L3 waren frühere Vorschläge und sind keine offenen Nutzerentscheidungen mehr. D-0030 legt Annuitätendarlehen und D-0031 bis D-0041 die Restlaufzeit, Periodik und Zinsmethodik fest.

### Zinsdefinition

Der Nominalzins von 5 % p.a. allein würde keinen eindeutigen Zahlungsplan bestimmen. D-0034 bis D-0041 ergänzen die maßgebliche Zinsmethode, Restschuld, Periodik, Stichtag, Rundung und Zahlung mit der Rate; der Darlehenszins ist damit für V1 konkretisiert.

- Siehe D-0034–41: laufende Restschuld, 30E/360, monatliche Periodik, Zinsstichtag am Tag vor Rate, kaufmännische Cent-Rundung, Rundungsrest in Schlussrate und Zinszahlung mit Annuität.
- Gesonderte Gebühren, Sondertilgung oder Kapitalisierung sind nicht als V1-Regel beschlossen.

Keine monatliche Kapitalisierung oder zusätzliche effektive Jahresrate wird unterstellt; die periodische Berechnung folgt der bestätigten 30E/360-Regel und Annuität.

### Noch notwendige Nutzerentscheidungen

1. Konkrete Annuitäten-/Anfangsrate und Schlussrate; erster tatsächlicher Zahlungstermin.
2. Keine weitere Entscheidung zur Zinsperiodik, Tageszählung, Laufzeit, Zinsbindung oder Rundung erforderlich; D-0031–41 gelten.
3. Keine weitere Entscheidung zur Zinsmethode oder Zinszahlung neben D-0034 bis D-0041 erforderlich.
4. Gebühren, Sondertilgung und Kapitalisierung sind nicht festgelegt; nicht unterstellen.
5. Die Behandlung fehlgeschlagener Darlehensraten folgt D-0042/43; A02 muss Ereignistakte und die Schwelle „drei nicht gezahlte Raten“ operativ eindeutig abbilden.
6. Keine offene Rundungsentscheidung; D-0037/38 gelten.

### A02/A04 Übergabe für Darlehen

A02 muss Simulationsdatum, Monats-/Zahlungsperioden, deterministische Fälligkeitsphase und ausreichende Cash-Prüfung zum Fälligkeitszeitpunkt liefern; Darlehenszahlungen dürfen nicht aus Wandzeit oder unsortierter Ereignisreihenfolge entstehen.

A04 benötigt fachlich die Eröffnungsposition 24.000 € mit Stichtag und Quelle, Maschinenreferenz, Zinssatz und bestätigte Annuitäten-/Restlaufzeit-/Periodikregeln, getrennte Zinsaufwands- und Tilgungsbeträge, Fälligkeits-/Zahlungsstatus sowie tatsächliche Zahlung mit Datum und Referenz. A03 bleibt fachlich autoritativ für Hauptsaldo, Zinsaufwand und Liquiditätswirkung. Dies sind Datenanforderungen, keine Schemafreigabe.
