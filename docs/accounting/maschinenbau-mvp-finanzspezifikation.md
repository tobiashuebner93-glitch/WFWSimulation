# A03 – Finanzielle MVP-Spezifikation Maschinenbau

**Stand:** 2026-09-26  
**Rolle:** A03 – ACCOUNTING_FINANCE  
**Bezug:** MG-000 / SLG-000.2 / T-0005  
**Status:** Fachliche Arbeitsgrundlage; Produkt- und Architekturentscheidungen bleiben offen.

**Aktueller P0-Stand:** Frühere Optionen B1/D1/E1 sind durch die Nutzervorgaben SimTAX B2 (19 % je Position), BAB D3, E3 (gleitender Durchschnitt), 30.000 € Anfangsliquidität innerhalb 50.000 € Rahmen, 14/30-Tage-Ziele, F3, automatische Rechnung, kundenseitige Zahlung nach Kundenverhalten, automatischen Vollzahlungsversuch eigener Verbindlichkeiten bei Fälligkeit und G3 ersetzt. Die fachliche Konkretisierung, Startabstimmung und offenen Parameter stehen in [P0-Finanzkonsistenzprüfung](p0-finanzkonsistenzpruefung.md). Diese Ergänzung ändert D-0010 nicht und gibt weder Architektur noch Umsetzung frei.

**Eröffnungsbilanz-Update:** Die Nutzervorgabe vom 01.01.2027 setzt zusätzlich Maschinenbuchwert 40.000 €, Maschinendarlehen 24.000 € bei nominal 5 % und Eigenkapital als Restposition fest. Die vorherige offene Gegenposition ist damit durch das ausgewiesene Eigenkapital von 63.800 € geschlossen. Darlehens-Tilgungsart bleibt offen. Details: Abschnitt „Eröffnungsbilanz und Maschinendarlehen“ am Ende dieses Dokuments.

## Zweck und Grenzen

Diese Spezifikation ordnet die von A02 beschriebenen Maschinenbau-Prozesse finanziell ein. Accounting ist die fachliche Autorität für Forderungen, Verbindlichkeiten, Kosten, Erlöse, Liquidität und Auftragsergebnis. A02 bleibt autoritativ für operative Ereignisse, Mengen, Prozessreihenfolge und Simulationszeit. Accounting erhält bestätigte Tatsachen und leitet daraus Finanzzustände ab; Simulation führt keine parallelen Finanzsalden.

Der MVP braucht eine konsistente Finanzwahrheit, aber weder Kontenplan noch vollständiges Journal, Steuer-, Lohn-, Anlagen- oder Kostenrechnungssystem. Diese Spezifikation legt keine technische API, Tabellen oder Buchungssätze fest und trifft keine Produktentscheidung für offene Parameter. Architektur V0.2 sowie alle ADRs bleiben PROPOSED; D-0001 bis D-0009 werden nicht verändert. D-0010 ist für den Produktumfang maßgeblich; seine vollständige Auftragsabwicklung ohne Teilfertigung, Teillieferung, Teilrechnung oder Teilzahlung gilt für V1.

## A. Finanzielle MVP-Grundsätze

1. **Vorgang, Leistung, Rechnung und Zahlung sind getrennt.** Angebot und Auftrag sind Plan-/Vertragsinformationen; Lieferung oder Abnahme belegt Leistung; Rechnung begründet im vereinfachten MVP die Kundenforderung und den abrechenbaren Erlös; Zahlung verändert Liquidität und gleicht offene Posten aus.
2. **Liquidität ist kein Gewinn.** Zahlungseingang/-ausgang verändert Zahlungsmittel. Erlös und Kosten bestimmen das Auftragsergebnis unabhängig vom Zahlungszeitpunkt.
3. **Einmalige finanzielle Wahrheit.** Accounting führt autoritativ Forderungen, Verbindlichkeiten, Kosten, Erlöse, Zahlungen und Salden. A02 meldet Ereignisse und operative Ist-Mengen, nicht Buchungen oder Salden.
4. **Schätzung und Ist trennen.** Angebot/Kalkulation liefern erwartete Werte. Auftragsergebnis verwendet erfasste Ist-Kosten und nach der gewählten Erlösregel realisierten Auftragserlös; Planabweichungen bleiben sichtbar.
5. **Nachvollziehbar korrigieren.** Nach Bestätigung erfasste Vorgänge werden nicht still überschrieben. Korrektur/Storno referenziert den ursprünglichen Geschäftsvorfall. Regeln nach Periodenabschluss bleiben OPEN.
6. **Kein unbelegter Rechts-/Steueranspruch.** Beträge können fachlich nur dann „netto“ oder „brutto“ heißen, wenn die Nutzerentscheidung zur Umsatzsteuer vorliegt.

## B. Finanzielle Wirkung im Auftragslebenszyklus

| Schritt / A02-Ereignis | Finanzielle Wirkung und Zeitpunkt | Forderung / Verbindlichkeit | Liquidität | Kosten / Erlös / Ergebnis | Accounting-Übergabe und A02-Abhängigkeit |
|---|---|---|---|---|---|
| A. Angebot (QuoteCalculated, QuoteIssued) | Kalkulationskosten, Angebotspreis und erwartete Marge als unverbindliche Vorschau; keine realisierte Wirkung beim Erstellen/Senden | Nein / Nein | Nein | Nur Planwerte; kein realer Aufwand/Erlös und kein Ist-Auftragsergebnis | Angebotsversion, Kunde, Positionen, Menge, Preisannahme, Liefer-/Zahlungskonditionen, Kostenschätzungen. A02 liefert kalkulierte operative Annahmen. |
| B. Auftrag (OrderAccepted) | Vertraglicher Auftragswert und erwartete Kosten werden als Verpflichtungs-/Planinformation festgehalten; allein aus Annahme keine Forderung, Verbindlichkeit, Einzahlung oder Auszahlung | Nein / Nein | Nein | Planerlös und Kalkulation bleiben Vorschau | Auftrags-ID, angenommene Angebotsversion, Kunde, Positionen/Menge, Preis, Termin, vereinbarte Konditionen. A02 bestätigt Annahme und gültigen Leistungsumfang. |
| C. Bestellung (PurchaseOrderPlaced) | Bestellwert ist zunächst erwarteter Mittelabfluss/Bestellbindung, kein Ist-Aufwand. Verbindlichkeit erst gemäß gewählter Regel (Empfehlung: bei angenommener Lieferung/Leistung bzw. Lieferantenrechnung) | Nein / grundsätzlich nein; Verpflichtung separat von Verbindlichkeit | Nein | Erwartete Beschaffungskosten; Ergebnis unverändert | Lieferant, Bestellposition, Material/Leistung, Menge, vereinbarter Preis, Liefertermin, Zahlungsziel, Auftragsbezug. A02 meldet bestätigte Bestellung. Zeitpunkt der Verbindlichkeit: OPEN. |
| Wareneingang / Fremdleistung (GoodsReceived, SubcontractedServiceAccepted) | Erhaltener Bestand bzw. nachgewiesene Leistung wird mit tatsächlicher Menge und zuordenbarem Einkaufspreis erfasst. Verbindlichkeit entsteht hier oder bei Lieferantenrechnung gemäß festzulegender MVP-Regel; keine Zahlung ohne tatsächlichen Abfluss | Verbindlichkeit ja, wenn diese Regel ausgelöst wird; sonst bei Rechnung | Nein | Material wird zunächst als Bestand/auftragsgebundener Wert geführt, falls noch nicht verbraucht; Fremdleistung kann bei Annahme auftragsbezogene Ist-Kosten werden. Details OPEN | Empfangs-/Leistungsdatum, Istmenge, Preis, Bestell-/Auftragsreferenz, Abweichung/Annahme. A02 autoritativ für Empfang und Mengenstatus. |
| D. Produktion / Ressourcenverbrauch (MaterialConsumed, WorkProgressed, CapacityConsumed) | Verbrauchs- und Aufwandsmengen werden bei bestätigtem Verbrauch/Leistung erfasst; monetäre Bewertung gemäß vereinbarten Sätzen/Bewertungsmethode | Nein / Nein (außer bereits entstandene Lieferantenverbindlichkeit) | Nein, sofern keine unmittelbare Zahlung modelliert ist | Materialverbrauch, Fremdleistung, Arbeit, Maschine, Energie und direkte sonstige Aufwendungen werden Auftrag zugeordnet. Gemeinkosten ggf. nur bei gewählter einfacher Methode | Auftrags-/Produktionsreferenz, Zeitpunkt/Periode, Ressourcenart, Menge/Stunden, Bewertungsreferenz oder Satz. A02 liefert Istverbrauch; A03 bewertet finanziell. |
| E. Lieferung / Abnahme (OrderDelivered, DeliveryAccepted) | Belegt gelieferte/abgenommene Menge und kann Abrechnungsfähigkeit anzeigen. Alleinige Erlösrealisierung bei Lieferung ist OPEN; empfohlen: Rechnung löst vereinfachten Erlös aus, Leistung bleibt Referenz/Abrechnungsbedingung | Nein / Nein | Nein | Transportkosten bei Leistung/Beleg nach Kostenregel; Erlös-/Ergebniswirkung erst bei gewähltem Erlöszeitpunkt | Liefermenge, Leistungsdatum, Abnahme/Nachweis, Frachtkosten/-beleg, Preisbezug, Restmenge. A02 entscheidet/übermittelt operative Lieferung/Abnahme. |
| F. Kundenrechnung (CustomerInvoiceIssued) | Im MVP empfohlener Auslöser für Forderung in Höhe des offenen Rechnungsbetrags und Erlösbezug für fakturierte Leistung; Rechnung muss auf Lieferung/Leistung/Auftrag referenzieren | Ja / Nein | Nein | Erlös und Auftragsergebnis ändern sich gemäß Rechnungs-/Erlösregel; Kosten erfasster Ist-Aufwand bleiben | Rechnungsreferenz, Kunde, Auftrag, Betrag und Steuerstatus nach Produktregel, Rechnungs- und Leistungsdatum, Zahlungsziel/Fälligkeit, Menge/Leistungsbezug. A02 liefert Rechnungsereignis; A03 berechnet Finanzwirkung. |
| G. Kundenzahlungseingang (CustomerPaymentTriggered / CustomerPaymentReceived) | Kundenverhalten löst Zahlung unabhängig vom Bankbestand des eigenen Unternehmens aus. Tatsächlicher Eingang reduziert die Forderung und erhöht Zahlungsmittel | Forderung sinkt / Nein | Ja, am tatsächlichen Eingangsdatum; keine eigene Cash-Prüfung vor Eingang | Kein neuer Erlös und keine erneute Ergebniswirkung | Kunden-/Rechnungsreferenz, voller Betrag, Trigger/Verspätungsgrund und tatsächliches Datum. A02 meldet Kundenverhalten/Eingang; A03 führt Forderung und Finanzzustand. |
| H. Eigene Zahlung an Lieferant/Gläubiger (SupplierPaymentAttempted / SupplierPaymentMade / SupplierPaymentFailedInsufficientLiquidity) | Automatischer Vollzahlungsversuch am Fälligkeitstag. Erfolg gleicht den Verbindlichkeitsposten aus; Fehlschlag bei unzureichender Liquidität lässt ihn unverändert und führt in den bestätigten V1-Mahn-/Dunning-Fluss | Bei Erfolg Verbindlichkeit sinkt/schließt; bei Fehlschlag unverändert | Nur bei vollständiger erfolgreicher Zahlung; bei Fehlschlag keine Liquiditätsbewegung und kein negativer Bestand | Kein zweiter Aufwand, wenn Kosten zuvor erfasst wurden | Gläubiger-/Rechnungsreferenz, voller Versuchsbetrag, Fälligkeit, Ergebnis; tatsächliches Zahlungsdatum nur bei Erfolg. A02 meldet Versuchsergebnis; A03 führt Verbindlichkeit und Finanzzustand. |
| Laufende allgemeine Kosten | Kosten entstehen nach einfacher Regel am festgelegten Leistungs-/Periodenzeitpunkt; Zahlung gegebenenfalls separat | Verbindlichkeit nur, wenn Rechnung/noch offene Zahlung modelliert wird | Nur beim Zahlungsausgang | Allgemeine Kosten belasten Unternehmensergebnis, ohne willkürliche Verteilung nicht Auftragsergebnis | Kostenart, Betrag, Intervall/Zeitraum, Entstehungs- und Fälligkeitsdatum, Zahlungsstatus. Startprofil/Intervall/Periodenregeln kommen vom Produkt/A02. |
| I. Auftragsabschluss (OrderClosed) | Operativer Abschlussstatus nach von A02/User festgelegter Bedingung. Abschluss selbst erzeugt nicht automatisch Zahlung, Erlös oder Kosten | Nein / Nein | Nein | Markiert Ergebnis als final oder vorläufig entsprechend Regel | Abschlussgrund, Restmengen, Liefer-/Rechnungsstatus und Zeitpunkt. A02 bestimmt operative Abschlussbedingung; A03 liefert finanzielle Vollständigkeit/offene Beträge. |
| J. Auftragsergebnis (OrderResultCalculated) | Finanzielle Auswertung aus autoritativen Auftragserlösen und zugeordneten Ist-Kosten; neu berechenbare Sicht, kein eigener Geschäftsvorfall | Nein / Nein | Nein | Auftragsergebnis = zugeordneter realisierter Auftragserlös − zugeordnete Ist-Auftragskosten | Auftrag, Ergebnisstand/As-of-Zeitpunkt, Erlös-/Kostenpositionen und Status, Plan-Ist-Abweichung. A02 kann Abschluss anstoßen; A03 allein liefert Finanzwerte. |

**Umsatzbegriff:** Der vereinfachte „Auftragserlös“ ist ein Produkt-/MVP-Begriff, keine Aussage über handels- oder steuerrechtliche Umsatzrealisierung. Rechnung als Auslöser ist eine leicht erklärbare Arbeitsregel; endgültige Regel und Teilleistungsbehandlung bleiben Produktentscheidung.

## C. Forderungslogik

- **Entstehung:** MVP-Arbeitsregel: bei Ausstellung/Freigabe einer Kundenrechnung für erbrachte bzw. gemäß Produktregel abrechenbare Leistung. Angebot, Auftragsannahme und Lieferung allein erzeugen nicht automatisch eine Forderung. Ob Lieferung/Abnahme schon Forderung auslöst, ist OPEN.
- **Höhe:** offener Rechnungsbetrag abzüglich zugeordneter Zahlungen und bestätigter Korrekturen. Netto-/Bruttobasis bleibt bis zur Nutzerentscheidung offen.
- **Fälligkeit:** Rechnungsdatum plus vereinbartes Kundenzahlungsziel; konkrete Standardtage und Kalender-/Periodenrundung OPEN. Fälligkeit ändert weder offenen Betrag noch Liquidität.
- **Kundenzahlungseingang:** Der Eingang richtet sich nach dem Zahlungsverhalten des Kunden und nicht nach der Liquidität des eigenen Unternehmens. Eigener Bankbestand ist keine Voraussetzung und kann den Eingang nicht verhindern. Bei tatsächlichem Eingang wird die Forderung um den zugeordneten Betrag reduziert/geschlossen und die Liquidität erhöht. Eingang und Forderungsabbau bleiben getrennt von eigenen Zahlungsverpflichtungen. Das konkrete Kundenverhalten bzw. dessen Zeitparameter bleiben offen, soweit A02 sie nicht vorgibt.
- **Offen/überfällig:** Restbetrag > 0 ist offen; Kundenforderung bleibt bis zum tatsächlichen Eingang offen. Fälligkeit allein verändert weder Forderung noch Liquidität.
- **Korrektur/Ausfall:** Eine Abschreibung/Forderungsausbuchung ist vom Zahlungseingang und Mahn-/Dunning-Fluss getrennt und für V1 nicht festgelegt. Ein fehlender Eingang erzeugt für sich allein weder Aufwand noch Liquiditätsbuchung.
- **Ausfall:** Eine Abschreibung/Forderungsausbuchung ist vom Mahn-/Dunning-Fluss getrennt und für V1 nicht festgelegt. Überfälligkeit oder ein fehlgeschlagener Versuch erzeugen für sich allein weder Aufwand noch Liquiditätsbuchung.
- **Korrektur/Storno:** vor Freigabe Entwurf verwerfen/korrigieren; danach referenzierter Korrektur-/Stornovorgang mit Grund, Datum und Betrag. Behandlung nach Periodenabschluss OPEN.

## D. Verbindlichkeitslogik

- Bestellung allein ist Bestellbindung/erwartete Verpflichtung, nicht zwingend fällige Verbindlichkeit. In Planung/Liquiditätsvorschau separat sichtbar.
- **MVP-Arbeitsregel (empfohlen):** Verbindlichkeit für Material bei akzeptiertem Wareneingang und für Fremdleistung bei bestätigter Leistung; Lieferantenrechnung bestätigt Betrag/Fälligkeit. Entstehung erst bei Rechnung ist alternative OPEN-Regel und muss mit A02-Belegreihenfolge abgestimmt werden.
- **Betrag:** akzeptierte Istmenge × vereinbarter/abgerechneter Preis plus/minus bestätigte Abweichungen; Steuerdarstellung OPEN.
- **Fälligkeit:** Rechnungsdatum plus vereinbartes Lieferantenzahlungsziel; Standardziel und Rechenkalender OPEN.
- **Zahlungsversuch und Zahlung:** Für eigene Lieferanten-/Gläubigerverbindlichkeiten löst Fälligkeit am Fälligkeitstag einen automatischen Vollzahlungsversuch aus. Bei ausreichender eigener Liquidität wird vollständig gezahlt, der offene Posten geschlossen und Liquidität am Zahlungsdatum um den tatsächlich gezahlten Betrag vermindert. Bei unzureichender Liquidität scheitert der Versuch: keine Teilzahlung, keine negative Liquidität und keine Liquiditätsbewegung; der vollständige offene Betrag bleibt bestehen. Teilzahlungen sind in V1 ausgeschlossen.
- **Offen/überfällig und Mahnstatus:** Restbetrag > 0 bleibt offen; ein nach Fälligkeit fehlgeschlagener Versuch wird dokumentiert und führt in den bestätigten V1-Mahn-/Dunning-Fluss. Fälligkeit, Zahlungsversuch, tatsächliche Zahlung, Liquiditätswirkung, offener Posten und Mahnstatus bleiben getrennt. Skonto- und weitere Zahlungsverkehrslogik sind nicht festgelegt.
- Storno/Korrektur referenziert Bestellung, Eingang, Rechnung oder Zahlung und bewahrt Historie; Periodenregel OPEN.

## E. Kostenlogik

| Kostenart | MVP-Behandlung und Zeitpunkt | Auftragszuordnung |
|---|---|---|
| Material | Tatsächlicher Verbrauch × einfacher Einstandswert; Zugang und Verbrauch getrennt. Unverbrauchte Menge bleibt Bestand/gebundener Wert, soweit Bestand geführt wird. | Direkt zum Auftrag, wenn Verbrauchsereignis darauf referenziert. |
| Fremdleistungen | Bestätigte Leistung × akzeptierter Preis; Kostenentstehung bei Leistungsannahme nach vereinfachter Regel. | Direkt zum Auftrag bei eindeutigem Bezug. |
| Arbeitskosten | A02-Stunden × einfacher interner Kostensatz. Keine Lohnabrechnung. Entstehung bei geleisteter Arbeit/Periodenverarbeitung nach Regel. | Auftrag bei auftragsbezogener Zeitmeldung; sonst allgemein/OPEN. |
| Maschine/Anlage | Maschinenstunden × einfacher Kostensatz, sofern MVP-Kostenbeitrag angezeigt werden soll. Keine Abschreibungs-/Instandhaltungsrechnung. | Direkt nach gemeldeten Auftragsstunden; Rate/Einbeziehung OPEN. |
| Energie | Verbrauchsmenge oder Maschinenstunden × einfacher Satz; nur mit A02-Mengen oder transparentem Näherungswert. | Direkt mit Zuordnungsbasis; pauschale Energie als allgemeine Kosten. |
| Transport | Tatsächliche/vereinbarte Ein- oder Ausgangsfracht bei Beleg/Leistung; keine automatische Doppelzählung im Materialpreis. | Direkt bei eindeutiger Bestell-/Auftragsreferenz. |
| Sonstige direkte Kosten | Begrenzte benannte Position mit Betrag, Zeitpunkt und Referenz. | Direkt nur mit dokumentiertem Auftragsbezug. |
| Gemeinkosten | Optional einfache Pauschale oder ein Zuschlag mit fixer Basis, nicht beides. Methode, Basis, Satz und Zeitpunkt OPEN; bis dahin allgemeine Kosten. | Nur bei ausdrücklich beschlossener einfacher Zuordnungsregel. |
| Allgemeine laufende Kosten | Einfache Unternehmenskosten nach Intervall; keine künstliche Auftragsverteilung. | Allgemein, aus Auftragsergebnis ausgeschlossen solange keine Regel beschlossen ist. |

**Kostenzeitpunkt und Liquidität:** Kosten entstehen nach Leistungs-/Verbrauchsereignis; Zahlung ist separat. Unbezahlte Kosten können Ergebnis/Verbindlichkeit betreffen, ohne Liquidität zu ändern. Vorauszahlungen können Liquidität ändern, bevor Verbrauchskosten entstehen; Vorauszahlungslogik bleibt OPEN/später.

## F. Erlöslogik

- Angebot speichert Preis und erwartetes Ergebnis, erzeugt keinen realisierten Erlös.
- Auftragsannahme speichert vereinbarten Auftragswert und Planerlös, aber weder Forderung noch Zahlung.
- Lieferung/Abnahme liefert Mengen- und Leistungsnachweis. A03 empfiehlt dies als Bedingung zur Rechnung, endgültiger Erlös-/Forderungszeitpunkt bleibt OPEN.
- MVP-Arbeitsregel: Erlös entsteht für abgerechnete Leistung bei freigegebener Kundenrechnung. Noch nicht fakturierte Lieferungen sind operative abrechenbare Leistung, keine Forderung.
- Zahlungseingang ist kein neuer Erlös.
- V1 umfasst vollständige Auftragsabwicklung ohne Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung. Die finanzielle Abbildung von Teilvorgängen ist eine spätere Erweiterung und keine offene V1-Scope-Wahl.
- Preisänderung nach Auftrag bedarf referenzierter Auftrags-/Rechnungsänderung; Befugnis und Zeitpunkt OPEN.

## G. Liquiditätslogik

**Liquidität zum Zeitpunkt t = Anfangsliquidität + tatsächliche Zahlungseingänge bis t − tatsächliche Zahlungsausgänge bis t**

- Eröffnung stammt aus dem vom Produkt festgelegten Unternehmensstartprofil; Stichtag, Betrag und Zahlungsmittelgranularität OPEN. Keine Werte erfinden.
- Kundenzahlungseingänge folgen dem Kundenverhalten und werden unabhängig von eigener Liquidität erfasst; ein tatsächlicher Eingang erhöht die Liquidität und reduziert die Forderung.
- Eigene Lieferanten-/Gläubigerzahlungen werden am Fälligkeitstag vollständig versucht. Nur eine erfolgreiche vollständige Zahlung vermindert Liquidität und offenen Posten; ein Liquiditätsfehlschlag wird ohne Cashbewegung dokumentiert und in den bestätigten V1-Mahn-/Dunning-Fluss überführt.
- Ein-/Auszahlungen genau einmal zum tatsächlichen Simulations-Zahlungsdatum erfassen; fehlgeschlagene Versuche sind keine Zahlungen und erzeugen keine Liquiditätsbewegung.
- Forderungen/Verbindlichkeiten separat vom Zahlungsmittelbestand ausweisen.
- Fälligkeit allein ändert Liquidität und offenen Posten nicht. Der automatische Vollzahlungsversuch am Fälligkeitstag gilt für eigene Lieferanten-/Gläubigerverbindlichkeiten. Bei ausreichender eigener Liquidität wird vollständig gezahlt; bei unzureichender Liquidität bleibt der volle offene Posten bestehen, ohne Teilzahlung, negative Liquidität oder Cashbewegung, und der Versuch führt in den bestätigten V1-Mahn-/Dunning-Fluss. Kundenzahlungseingänge folgen dagegen dem Kundenverhalten und hängen nicht von eigener Liquidität ab. Zahlungspriorität bei konkurrierenden eigenen Fälligkeiten und Retry-Zeitpunkte/-Fristen bleiben OPEN.
- Auftragskosten können vor Zahlung Kosten/Verbindlichkeit erzeugen; Erlös/Forderung kann vor Kundenzahlung entstehen. Ergebnis und Liquidität laufen auseinander.
- Laufende Kosten belasten Liquidität erst beim Zahlungsausgang; Kostenentstehung separat.
- Keine Kreditlinie, Insolvenzautomatik, Finanzierung oder Kontokorrentregel ohne Scope-Entscheidung.
- Invarianten: Zahlung gleicht höchstens den offenen Posten aus, sofern Überzahlung nicht ausdrücklich behandelt wird; jede Liquiditätsänderung ist auf Eröffnung oder Zahlung zurückführbar.

## H. Auftragsergebnis

**Auftragsergebnis = Auftragserlös − zugeordnete auftragsbezogene Ist-Kosten**

Einbezogen: Materialverbrauch, angenommene Fremdleistungen, zugeordnete Arbeitskosten, Maschinen-/Energiekosten nur bei festgelegten MVP-Sätzen, Transport und sonstige direkte Kosten. Gemeinkosten nur nach beschlossener einfacher Methode. Allgemeine Fixkosten bleiben außerhalb des einzelnen Auftragsergebnisses und erscheinen als allgemeine Kosten.

Plan-Kalkulation, Ist-Kosten und realisierter Erlös getrennt halten. Unfakturierte Leistung und offene Kosten können als vorläufig markiert werden. Operativer Auftragsabschluss bedeutet nicht automatisch bezahlt oder finanziell vollständig abgeschlossen. Zahlung ändert Liquidität/offene Posten, nicht erneut das Auftragsergebnis.

## I. Netto, Brutto und Umsatzsteuer

Netto-/Bruttobeträge beeinflussen Angebotspreis, Rechnungsbetrag, Kundenzahlung, Lieferantenzahlung, offene Posten, Kosten, Erlösdarstellung und Auftragsergebnis. In vollständiger Abbildung ist Umsatzsteuer grundsätzlich nicht Erlös/Kosten; ein MVP ohne Umsatzsteuer darf aber keine steuerlich korrekte Netto-/Bruttosicht behaupten.

**OPEN – Nutzerentscheidung erforderlich:** (1) ohne ausgewiesene Umsatzsteuer einen einheitlichen Geldbetrag führen und sichtbar als Vereinfachung kennzeichnen, oder (2) Steuerbetrag sowie Netto-/Brutto-Gesamtbetrag als vereinfachte Größen führen. Keine Steuersätze, Vorsteuerabzüge, Befreiungen oder Rechtsformen annehmen. Betroffen: A02 (Preis-/Zahlungsbeträge), A04 (Betragssemantik), A11 (Begriffe/Schnittstellengrenze), User (Produkt-/Realismusentscheidung). Empfehlung: vor persistenter Modellierung eine verständliche Variante wählen; daraus kein Rechtsrat/Steuermodell ableiten.

Bis dahin bleibt jeder Betrag ein einfacher MVP-Geldbetrag ohne Netto-/Bruttoetikett. Rechnungssumme und tatsächlicher Zahlungsbetrag müssen in der später gewählten Variante konsistent sein.

## J. Materialbewertung

Für den MVP genügt einfache Bewertung: Eingang dokumentiert Menge und Einstandspreis; Verbrauch ordnet Menge und daraus berechneten Materialwert dem Auftrag zu. Bestand ergibt sich aus Anfangsbestand + akzeptierten Zugängen − Verbrauch − bestätigten Korrekturen. Fehlbestand vermeiden, sofern A02 keinen ausdrücklichen Fehlbestandspfad vorgibt.

**OPEN:** Bewertung des Anfangsbestands, Preisabweichungen, Bezugskosten und Rundung. Empfehlung: einfacher gespeicherter Einstandswert pro Zugang. FIFO, LIFO, gleitender Durchschnitt, Niederstwert und vollständige Lagerbuchhaltung sind später, solange MVP-Scope sie nicht fordert. A02 liefert Mengen; A03 bestimmt Wert; A04 benötigt nach Entscheidung die Bewertungssemantik und Referenzen.

## K. Zahlungsziele

Zahlungsziel ist vereinbarte Dauer/Bedingung ab festgelegtem Bezugspunkt und erzeugt ein Fälligkeitsdatum; es ist weder Zahlung noch Liquiditätsereignis. Kundenziel beschreibt den Fälligkeitsbezug der Forderung, deren tatsächlicher Zahlungseingang aber dem Kundenverhalten folgt und nicht von eigener Liquidität abhängt. Für eigene Lieferanten-/Gläubigerverbindlichkeiten löst Fälligkeit am Fälligkeitstag den automatischen Vollzahlungsversuch aus. Tatsächliche Auszahlung und Liquiditätswirkung entstehen nur bei erfolgreicher vollständiger Zahlung; bei Fehlschlag bleibt der volle offene Posten bestehen und der bestätigte V1-Mahn-/Dunning-Fluss greift. Zahlungspriorität konkurrierender eigener Fälligkeiten, Retry-Zeitpunkt/-Fristen sowie konkrete Mahnfristen und Schwellen bleiben OPEN. Details der Fälligkeitsberechnung bleiben offen, soweit sie nicht anderweitig verbindlich festgelegt sind.

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
| OrderDelivered / DeliveryAccepted | Menge, Leistungsdatum, Auftrag/Kunde, Nachweis, Fracht | Abrechnungsreferenz und ggf. Transportkosten | Erlös-/Forderungszeitpunkt OPEN; V1-Abwicklung vollständig, keine Teillieferung |
| CustomerInvoiceIssued | Referenz, Betrag/Positionen, Datum, Leistungs-/Auftragsbezug, Fälligkeit | Forderung und Erlös gemäß Regel | Netto/Brutto/USt. und Auslöser OPEN |
| SupplierInvoiceReceived | Lieferant, Betrag, Bezug auf Bestellung/Eingang/Leistung, Datum/Fälligkeit | Verbindlichkeit bestätigen, Kosten/Bestand zuordnen | Entstehungsregel und Preisabweichung OPEN |
| CustomerPaymentTriggered / CustomerPaymentReceived | Kunden-/Rechnungsreferenz, voller Betrag, Auslösegrund bzw. Verspätungsgrund und tatsächliches Eingangsdatum | Kundenverhalten löst Eingang unabhängig vom eigenen Bankbestand aus; tatsächlicher Eingang erhöht Liquidität und reduziert/schließt Forderung | Konkrete Kundenverhaltens-/Zeitparameter bleiben OPEN |
| SupplierPaymentAttempted / SupplierPaymentMade / SupplierPaymentFailedInsufficientLiquidity | Gläubiger-/OP-Referenz, voller Versuchsbetrag, Fälligkeit und Versuchsergebnis; tatsächliches Zahlungsdatum nur bei Erfolg | Fälligkeit löst eigenen Vollzahlungsversuch aus; Erfolg vermindert Liquidität und OP, Fehlschlag lässt beides unverändert und löst Dunning-Übergang aus | Zahlungspriorität, Retry-Zeitpunkt/-Fristen und konkrete Mahnfristen/-schwellen OPEN; keine Teilzahlung in V1 |
| laufende Kosten / Fälligkeit | Kostenparameter, Intervall, Zeitraum, Fälligkeit/Zahlungsereignis | Allgemeine Kosten und getrennte Zahlung | Zeitraster/Startprofil OPEN |
| OrderClosed / OrderResultCalculated | Abschlussstatus/-grund, operative Restmengen und Leistungsstatus | Finanzvollständigkeit und Auftragsergebnis zurückliefern | A02/User bestimmt Abschlussbedingung; Zahlung muss nicht Abschlussbedingung sein |

A02 übergibt Tatsachen mit stabiler Ereignisreferenz, Auftrag/Gegenpartei/Belegbezug, Beträgen oder Mengen, Zeitbezug und Korrekturbezug. Das ist fachlicher Informationsbedarf, keine API-/Schemafestlegung. A03 gibt Finanzstatus/Ergebnis zurück; A02 leitet keine autoritativen Salden aus Planwerten ab.

## O. Fachliche Datenanforderungen A03 → A04

A04 benötigt nach Produktentscheidungen fachlich ausdrückbare Informationen für: Eröffnungsliquidität mit Stichtag; Geldbetrag/Währung und Netto-/Brutto-/Steuersemantik; Forderung/Verbindlichkeit mit Ursprung, Gegenpartei, Auftrag/Rechnung, Betrag, Fälligkeit, Restbetrag und Status; Kosten-/Erlöspositionen mit Entstehungs-/Leistungsdatum, Zuordnung, Kategorie und Korrekturbezug; Zahlung mit Datum, Betrag und Zuordnung; Materialzugang/-verbrauch mit Menge, Preis/Bewertungsreferenz, Bestand und Auftrag; Kalkulationsversion getrennt von Istpositionen; daraus ableitbare Liquidität, offene Posten und Auftragsergebnis. Diese Liste definiert weder Entitäten, Tabellen, Aggregate, Buchungssätze noch Persistenzmuster.

## P. Offene Entscheidungen

| Frage | Vorschlag/Status | Betroffene Rollen | User-Entscheidung? |
|---|---|---|---|
| Netto/Brutto/USt. | OPEN; keine Steuerregeln annehmen; Geldsemantik festlegen | User, A02, A04, A11 | Ja, vor belastbarer Rechnungs-/Betragssemantik |
| Kundenzahlung und eigene Zahlungsverpflichtung | Kundeneingang folgt Kundenverhalten, ohne Cash-Prüfung beim eigenen Unternehmen; automatische Vollzahlung am Fälligkeitstag gilt für eigene Lieferanten-/Gläubigerverbindlichkeiten | A02/A03 | Nein für die Richtungsabgrenzung |
| Konkretes Kunden-Zahlungsverhalten | Trigger/Verspätungsparameter und zeitliche Ausprägung des Kundenverhaltens, soweit nicht bereits durch A02 festgelegt | User/A02/A03 | Ja, falls dafür weitere Produktparameter erforderlich sind |
| Offene Zahlungsparameter | Zahlungspriorität konkurrierender eigener Fälligkeiten, Retry-Zeitpunkt/-Regeln, konkrete Mahnfristen/-schwellen sowie noch offene Fälligkeitsdetails | User/A02/A03 | Ja, soweit für Umsetzung/Produkt erforderlich |
| Materialbewertung/Anfangsbestand | OPEN; einfache Einstandspreise als MVP-Arbeitsmodell | User/A03/A04; A02 Mengen | Ja für Eröffnungsprofil/Bewertung |
| Kostenabgrenzung und Kostenraten | OPEN; direkte Kosten zwingend, Gemeinkosten optional/einfach | User/A02/A03 | Ja für Umfang und Sätze |
| Kostenzeitpunkt | OPEN für Verbrauch, Arbeit, Fixkosten, Vorauszahlung | A02/A03/User | Ja, soweit konkrete Regel/Startwerte gewählt werden |
| Erlösrealisierung/Forderungsentstehung | Empfehlung: Rechnung nach abrechenbarer Leistung | User/A02/A03/A11 | Ja für MVP-Regel; A02 für Leistung/Abnahmeereignis |
| Verbindlichkeitsentstehung | OPEN; Empfehlung: akzeptierter Eingang/Leistung; Rechnung bestätigt Betrag/Fälligkeit | User/A02/A03 | Ja für Produktprozess; A02 liefert Triggerfolge |
| Vollständige Auftragsabwicklung ohne Teilproduktion/-lieferung/-rechnung/-zahlung | für V1 durch D-0010 entschieden; Teilvorgänge sind spätere Erweiterung | A02 für operative Abläufe; A03 für finanzielle Interpretation; A04 für Modellabbildung | Nein für V1-Scope; konkrete Regeln für spätere Erweiterung später |
| Abschluss bei unbezahlter Rechnung | Empfehlung: operativer Abschluss und Zahlung getrennt | User/A02/A03 | Ja für Produktabschluss |
| Korrektur nach Periodenabschluss | OPEN; keine Rückdatierungsregel erfunden | User/A02/A11/A03 | Ja, falls Periodenabschluss im MVP ist |
| Startdaten des bestehenden Betriebs | OPEN; Werte und Stichtag fehlen | User/A02/A03/A04 | Ja, konkrete Profilwerte erforderlich |
| Fehlgeschlagener eigener Fälligkeitsversuch / Dunning | V1-Mahn-/Dunning-Fluss nach fehlgeschlagenem Vollzahlungsversuch eigener Verbindlichkeiten bestätigt; Zahlungspriorität, Retry-Zeitpunkt/-Fristen, Mahnfristen/-schwellen und konkrete Eskalationsparameter OPEN. Abschreibung bleibt separat/unfestgelegt | User/A02/A03/A04 | Nur für weiterhin offene Parameter |

## Q. Abhängigkeiten zu A02, A04 und A11

- **A02:** Prozessereignisse/-reihenfolge, Simulationszeit und Perioden, Abnahme, Ressourcenverbrauch, Zahlungsauslösung, vollständige Auftragsabwicklung und Korrekturablauf festlegen. A03 spezifiziert die finanzielle Interpretation.
- **A04:** kann später Persistenz ableiten; vorher Geld-/Steuersemantik, Eröffnungssalden, Ereigniszeitpunkte und Korrekturregeln entscheiden oder ausdrücklich als offene Annahmen behandeln. Teilvorgänge sind keine V1-Anforderung.
- **A11:** Systemgrenzen, Übergabeverantwortung, Zeit-/Periodenorchestrierung und Korrekturen prüfen. Diese Spezifikation gibt keine Architektur frei.
- **User:** finale Produktentscheidungen zu Realismus, Betragssemantik, Startzustand sowie Kosten-/Zahlungsregeln treffen. Der V1-Ausschluss von Teilvorgängen ist bereits durch D-0010 entschieden.

## R. Abschluss und nächster Schritt

**A03 innerhalb der Fachautorität festgelegt:** Liquidität und Ergebnis trennen; Plan, Vertrag, Leistung, Rechnung und Zahlung trennen; minimale Finanzbegriffe und Formeln; A02 führt keine eigene Finanzwahrheit; Mindestinformationen für Read Models und Übergaben.

**Offen:** Produkt-/Zeitregeln, insbesondere USt.-/Betragssemantik, konkrete Ausprägung des Kundenzahlungsverhaltens und noch offene Details der Fälligkeitsberechnung, Priorität konkurrierender eigener Fälligkeiten, Retry-Fristen, konkrete Mahnfristen/-schwellen, Auslöser von Forderung/Verbindlichkeit/Erlös, Materialbewertung, Kostenraten, Periodenabschluss/Korrekturen und Startdaten. Kundeneingänge hängen nicht von eigener Liquidität ab; der automatische Vollzahlungsversuch mit bestätigtem V1-Mahn-/Dunning-Fluss bei Fehlschlag gilt für eigene Verbindlichkeiten. Teilproduktion, Teillieferung, Teilrechnung und Teilzahlung sind für V1 ausgeschlossen und bleiben mögliche spätere Erweiterungen.

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
| Vorräte | 12.800 € |
| Gebrauchte CNC-Maschine, Buchwert | 40.000 € |
| **Summe Aktiva** | **95.300 €** |

| Passiva | Betrag |
|---|---:|
| Lieferantenverbindlichkeiten | 7.500 € |
| Maschinendarlehen | 24.000 € |
| Eigenkapital (Restposition laut Nutzerentscheidung) | 63.800 € |
| **Summe Passiva** | **95.300 €** |

**Rechenprüfung:** 30.000 + 12.500 + 12.800 + 40.000 = 95.300 €. 7.500 + 24.000 + 63.800 = 95.300 €. Bilanzdifferenz = 0 €. Vorheriger Rechenstand ohne Maschinenansatz und Darlehen hatte 55.300 € Aktiva und 7.500 € Verbindlichkeiten; die nun benannte Maschine (+40.000 €) und Darlehensschuld (+24.000 €) ändern die rechnerische Restposition um netto +16.000 € von 47.800 € auf 63.800 €.

Die Herkunft des ausgewiesenen Eigenkapitals ist fachlich: **Eigenkapital = Eröffnungsvermögen 95.300 € minus Eröffnungsverbindlichkeiten 31.500 € = 63.800 €**. Seine Zusammensetzung ist der verbleibende Nettoanteil an den genannten Eröffnungswerten, nicht zusätzlich verfügbares Geld. Der Nutzer hat den Rest als Eigenkapital ausgewiesen. Nicht vorgegeben ist eine historische Aufteilung z. B. in ursprüngliche Einlage, einbehaltene Ergebnisse oder andere Eigenkapitalunterkonten; solche Unterteilungen werden nicht erfunden.

Der 50.000-€-Gesamtfinanzierungs-/Budgetrahmen bleibt separat: 30.000 € davon sind als Bankbestand angegeben; 20.000 € ungenutzter Rahmen sind weder Cash noch zusätzliche Passivposition. Die 24.000 € Maschinendarlehen sind bereits separat in der Eröffnungsbilanz enthalten. Die historischen Darlehensauszahlungen werden am Simulationsstart nicht erneut als Einnahme erfasst.

### Einfache deterministische Darlehenslogik

**Bekannte Startfakten:** Maschinendarlehen mit offenem Nominal-/Restbetrag 24.000 € am 01.01.2027; nominaler Jahreszinssatz 5 %; ursprünglich über 10 Jahre finanziert. Der Startsaldo ist eine Verbindlichkeit. Die Maschine ist ein Vermögenswert mit separat festgelegtem Buchwert von 40.000 €. Darlehenssaldo und Maschinenbuchwert sind nicht miteinander zu verrechnen.

- **Zinsaufwand** ist die periodische Finanzierungskostenwirkung und wird auf den zu Periodenbeginn bzw. gemäß einer noch festzulegenden Stichtagsregel offenen Darlehenssaldo berechnet. Er reduziert Ergebnis/Eigenkapital, nicht den Darlehenshauptbetrag.
- **Tilgung** reduziert den offenen Darlehenshauptbetrag und Bankliquidität; sie ist kein erneuter Aufwand.
- **Zinszahlung** reduziert Bankliquidität und gleicht zuvor oder gleichzeitig erfassten Zinsaufwand aus; sie tilgt den Hauptbetrag nicht.
- **Fällige Rate** kann Zinsanteil und Tilgungsanteil enthalten; das Darlehen wird nur um den Tilgungsanteil reduziert. Bei unzureichender Liquidität ist eine Rate nicht teilweise zu zahlen, solange V1-Teilzahlung ausgeschlossen ist; Umgang mit überfälligem Darlehen/Retry bleibt Nutzervorgabe.
- Die ursprüngliche 10-Jahres-Laufzeit bestimmt nicht automatisch Restlaufzeit, ursprüngliches Abschlussdatum, bisherige Tilgungen, Rate oder Endfälligkeit. Da 24.000 € bereits der Startsaldo sind, werden keine vor dem 01.01.2027 liegenden Zinsen oder Zahlungen erneut gebucht.

**Deterministische Periodenfolge nach Nutzerwahl:** (1) am Periodenbeginn Hauptsaldo und offene, noch nicht gezahlte Zinsen übernehmen; (2) Zinsaufwand für die Periode auf den vereinbarten Saldo und Zeitraum berechnen; (3) zum bestätigten Termin Zins- und Tilgungsanteil der Rate bestimmen; (4) bei ausreichendem Cash die vollständige Rate zahlen, Cash um Gesamtbetrag mindern, Hauptsaldo nur um Tilgung senken und offenen Zinsausgleich reduzieren; (5) bei unzureichendem Cash kein Teilbetrag und keine Cashbewegung ausführen, Zinsaufwand bleibt Aufwand und nicht gezahlte Zinsen werden als offene Zinsverbindlichkeit weitergeführt. Ob nicht gezahlte Zinsen später kapitalisiert werden, muss ausdrücklich entschieden werden; bis dahin nicht auf den Hauptsaldo aufschlagen. Ereignisse tragen Periode, Stichtag, Regelversion und eindeutige Sequenz.

**Vereinfachter Zinsansatz zur Entscheidung:** Bei unverändertem Hauptbetrag 24.000 € und nominal 5 % beträgt einfacher Jahreszins 1.200 €. Eine lineare Monatsabgrenzung entspräche 100 € je Zwölftel-Jahr, sofern keine Tilgung im Monat erfolgt und keine Zinseszinsen/zusätzlichen Gebühren angesetzt werden. Das ist eine Rechenillustration, keine beschlossene Perioden- oder Zahlungsregel.

### Tilgungsoptionen (keine Option beschlossen)

| Option | Mechanik | Zins-/Tilgungs-/Liquiditätswirkung | Vorteile und Nachteile |
|---|---|---|---|
| **L1 – Gleichbleibende Annuität** | Feste Gesamtperiodenrate; Zinsanteil sinkt und Tilgungsanteil steigt mit sinkendem Hauptbetrag. | Zinsaufwand auf periodischen Restbetrag; Zahlung belastet Cash um Rate; Hauptschuld sinkt um Tilgungsanteil. Benötigt Restlaufzeit und Periodenzins. | Gut planbarer Cashabfluss; benötigt mehr Vertragsparameter und Rundungs-/Schlussratenregel. |
| **L2 – Gleichbleibende Tilgung** | In jeder Periode gleicher Hauptbetrag; Zinsen kommen zusätzlich auf den Restbetrag. | Anfangsraten höher, danach sinkend; Gesamtzahlung = feste Tilgung + Periodenzins. | Transparente Schuldenreduktion und sinkender Zins; Cashbelastung anfangs höher. |
| **L3 – Endfällige Tilgung / Bullet** | Während der Laufzeit Zinszahlungen, Hauptbetrag bleibt bis zu einem bestätigten Endtermin bestehen. | Periodischer Cashabfluss ist zunächst Zins; am Endtermin zusätzlich volle Hauptschuld. | Niedrigere laufende Auszahlung; großer Endbetrag und Endtermin/Risiko müssen explizit simuliert werden. |

Der Nutzer muss Tilgungsart (L1/L2/L3), verbleibende Laufzeit bzw. Endfälligkeit und Zahlungsintervall wählen. A03 setzt keine Tilgungsart und keine Rate fest. Auch Zinszahlung gleichzeitig mit Tilgung oder separat ist offen.

### Reicht „nominal 5 % p.a.“ aus?

**Nein, nicht für einen eindeutigen Zahlungsplan.** Es gibt den Jahres-Nominalzinssatz an, bestimmt allein aber nicht:

- Berechnungsbasis: 24.000 € offener Hauptbetrag oder anderer Vertragsbetrag;
- Zinsperiode, Zinsabgrenzung und Zinszahlungstermin;
- Zinstagekonvention (z. B. tatsächliche Tage/Jahr oder vereinfachte Monatszwölftel);
- Zinseszins/Kapitalisierung oder ausschließlich einfache Zinsabgrenzung;
- festen oder variablen Zinssatz und ob 5 % für die ganze Restlaufzeit gelten;
- Restlaufzeit, Ratenzahl, Tilgungsstart, Endfälligkeit, Gebühren oder Sondertilgung;
- Rundungsstufe und Behandlung einer abweichenden Schlussrate.

Bei 5 % nominal geteilt auf zwölf Monatsperioden beträgt der Periodensatz 5 % / 12. Werden diese Monatszinsen kapitalisiert, ergäbe das rechnerisch eine andere effektive Jahreswirkung als einfache 5-%-Jahresabgrenzung. Welche Interpretation gelten soll, ist offen; keine effektive Jahresrate wird unterstellt.

### Noch notwendige Nutzerentscheidungen

1. Tilgungsart L1/L2/L3; tatsächliche Restlaufzeit bzw. Fälligkeit der Schlussrate und Start der ersten Rate.
2. Zinsperiodik und Berechnung: Monatszwölftel oder Tagesbasis; falls Tagesbasis, Tageszählungsregel.
3. Zinszahlungstermine und ob Zinsen monatlich gezahlt, mit Raten gezahlt oder bis später nur als offene Verpflichtung erfasst werden.
4. Bestätigung, ob 5 % während der Simulation fest bleiben; Gebühren, Sondertilgung und Zinseszins ausdrücklich ja/nein.
5. Für das Maschinendarlehen bleiben Zahlungsplan, Fälligkeit und Behandlung einer nicht zahlbaren Rate offen; die bestätigte OP-Vollzahlungsregel entscheidet diese darlehensspezifischen Parameter nicht.
6. Rundung je Zinsperiode sowie Schlussratenbehandlung.

### A02/A04 Übergabe für Darlehen

A02 muss Simulationsdatum, Monats-/Zahlungsperioden, deterministische Fälligkeitsphase und ausreichende Cash-Prüfung zum Fälligkeitszeitpunkt liefern; Darlehenszahlungen dürfen nicht aus Wandzeit oder unsortierter Ereignisreihenfolge entstehen.

A04 benötigt fachlich die Eröffnungsposition 24.000 € mit Stichtag und Quelle, Verknüpfung zur Maschine, Zinssatz und Regelversion, gewählte Tilgungsart/Restlaufzeit/Periodik, getrennte periodische Zinsaufwands- und Haupttilgungsbeträge, Fälligkeits-/Zahlungsstatus sowie tatsächliche Zahlung mit Datum und Referenz. A03 bleibt fachlich autoritativ für Hauptsaldo, Zinsaufwand, Zinsverbindlichkeit und Liquiditätswirkung. Dies sind Datenanforderungen, keine Schemafreigabe.
