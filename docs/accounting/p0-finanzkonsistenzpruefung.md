# A03 – P0-Finanzkonsistenzprüfung Maschinenbau-MVP

**Stand:** 2026-10-26
**Rolle:** A03 – ACCOUNTING_FINANCE
**Bezug:** MG-000 / SLG-000.2 / CP-0147 / D-0010 / bestätigte Finanzentscheidungen im Decision Log
**Status:** Abgleich der P0-Finanzregeln mit dem aktuellen Decision Log. Keine neue Produktentscheidung und keine Implementierungsfreigabe.

## 1. Ergebnis

Die frühere Fassung enthielt veraltete Vorschläge zu Fälligkeiten, Zahlungszielen, Mahnlogik, Darlehen, BAB-Sätzen und CNC-Eröffnungsbuchwert. Maßgeblich ist jeweils die jüngste einschlägige bestätigte Entscheidung. Diese Prüfung korrigiert die Sachlage; CP-0147 bleibt unverändert als Validierungsnachweis.

## 2. Eröffnungsbilanz und Liquidität

Zum 01.01.2027 gilt der durch D-0099 aktualisierte CNC-Buchwert von 0 €; er ersetzt den früheren Szenarioansatz von 40.000 €.

| Aktiva | Betrag |
|---|---:|
| Bank | 30.000 € |
| Forderungen | 12.500 € |
| Vorräte gesamt (Einzelaufteilung noch nicht bestätigt) | 12.800 € |
| CNC-Buchwert | 0 € |
| **Summe Aktiva** | **55.300 €** |

| Passiva | Betrag |
|---|---:|
| Lieferantenverbindlichkeiten | 7.500 € |
| Maschinendarlehen | 24.000 € |
| Eigenkapital (Restposition) | 23.800 € |
| **Summe Passiva** | **55.300 €** |

Bilanzdifferenz: 0 €. Eigenkapital = 55.300 € Vermögen − 31.500 € Verbindlichkeiten = 23.800 €. Historische Untergliederung des Eigenkapitals ist nicht festgelegt. Der Gesamtfinanzierungs-/Budgetrahmen von 50.000 € ist separat; davon sind 30.000 € Anfangsliquidität und 20.000 € Rest-Rahmen. Die 20.000 € sind weder Cash noch zusätzliche Passivposition. Eine Ziehung ist nicht automatisch beschlossen.

## 3. Zahlungsziele, Entstehung und Fälligkeit

Die offenen Formeln aus früheren Fassungen sind erledigt:

- **Kundenforderung:** spätere tatsächliche Leistung und Rechnungsdatum als Fristanker; reine Lieferung verwendet das Lieferdatum (D-0013). Abnahme wirkt als Bedingung gemäß der dokumentierten Nutzerregel, wird aber nicht als zusätzlicher Fristanker eingesetzt.
- **Lieferantenverbindlichkeit:** bei pünktlicher Lieferung Rechnungsdatum (D-0014); Materialverbindlichkeit entsteht bei akzeptiertem Wareneingang, Fremdleistung bei bestätigter Leistung; Lieferantenrechnung bestätigt Betrag und Fälligkeit (D-0111).
- **Ziele:** Kundenstandard 14 Kalendertage; individuelle Kundenvereinbarung 30 Kalendertage (D-0018/19). Lieferantenstandard 30 Kalendertage (D-0020). Abweichende Konditionen können explizit vereinbart werden.
- **Rechnung/Anspruch:** Kundenforderung und vereinfachter Auftragserlös entstehen bei Ausstellung/Freigabe der Rechnung für erbrachte bzw. abrechenbare Leistung (D-0112); Vertrag, Lieferung allein und Zahlung sind getrennte Vorgänge.
- **Zählung:** Ankertag ist Tag 1; unverschobene Fälligkeit = Ankerdatum + (N−1) Kalendertage. Wochenendtermin wird auf den nächsten Arbeitstag geschoben; V1 berücksichtigt keine Feiertage (D-0011, D-0015–17). T-0009 betrifft A02s Spezifikationsübernahme, nicht den offenen Status der Nutzerregel.
- **Kundeneingang:** vollständiger Eingang am vertraglichen Fälligkeitstag, außer ausdrücklich festgelegtes Verspätungsereignis (D-0110). Er ist unabhängig vom eigenen Bankbestand und reduziert Forderung/erhöht Liquidität.

Vertrag, Leistung/Empfang, Rechnung, Forderung/Verbindlichkeit, Fälligkeit, Zahlungsversuch und tatsächliche Zahlung bleiben getrennte Sachverhalte. D-0010s V1-Vollständigkeit schließt Teilrechnung und Teilzahlung aus.

## 4. Eigene Zahlungen und Dunning

Bei eigener Fälligkeit erfolgt ein automatischer Vollzahlungsversuch. Bei ausreichendem Cash: vollständige Zahlung, voller OP-Abbau und Liquiditätsabfluss. Bei unzureichendem Cash: keine Teilzahlung, kein negativer Bestand, kein Cash-Abfluss, voller OP bleibt offen, Fehlschlag wird dokumentiert.

Die aktuelle V1-Folge ist:

- Spieler wählt bei konkurrierenden fälligen eigenen Rechnungen, welche zuerst bezahlt werden (D-0021).
- Fehlgeschlagene Zahlungen werden eine Woche später erneut versucht; auf den ersten Fehlversuch folgen acht wöchentliche Retry-Versuche. Nach dem achten fehlgeschlagenen Retry gilt das Spiel als verloren (D-0024–26).
- Zahlungserinnerung: zehn Kalendertage nach dem ersten Fehlversuch (D-0027).
- Formelle Mahnung: vierzehn Kalendertage nach der Erinnerung, wenn weiterhin unbezahlt (D-0028).
- Nach formeller Mahnung keine Pfändungs-/Liquidationseskalation in V1 (D-0029); keine Gebühren oder sonstigen Rechts-/Finanzfolgen daraus ableiten.
- Dispositionskredit ist eine angebotene Option. Sein Satz beträgt 8 % über dem individuell vereinbarten Unternehmenszinssatz (D-0023); automatische Ziehung, Limit, Verfügbarkeit und Rückzahlung bleiben offen.

Retry- und Mahnzeitachsen sind getrennte Simulationsereignisse. Ihr Verhältnis bei gleichzeitigem Eintritt, genaue Tagesphase und Auswahl-/Tie-Break-Mechanik sind mit A02 noch operativ abzustimmen; daraus folgt keine neue Fristentscheidung.

## 5. Maschinendarlehen

Bestätigt sind: Startschuld 24.000 €, nominal 5 % p.a. fest, sieben Jahre Restlaufzeit, gleichbleibende monatliche Annuitäten, Fälligkeit am letzten Geschäftstag des Monats, deutsche 30E/360-Methode auf laufender Restschuld, Stichtag am Tag vor der nächsten Rate, monatliche kaufmännische Cent-Rundung und Ausgleich des Rundungsrests in der Schlussrate; Zins wird mit der Rate gezahlt (D-0030–41).

Zinsaufwand belastet Ergebnis; Tilgung reduziert Hauptschuld und Cash, ist kein Aufwand; der Zahlungsabfluss ist die gesamte Rate. Bei Ausbleiben der Rate tritt sofort Verzug ein, wöchentlicher Retry. Bei drei insgesamt nicht gezahlten Raten wird die CNC zum aktuellen Marktwert liquidiert; Erlös tilgt Darlehen, Überschuss fließt aufs Geschäftskonto; bei Defizit erlischt Restschuld (D-0042/43). Diese Spezialregel bleibt von D-0029 getrennt.

Offen bleiben konkrete Annuitäten-/Anfangsrate und erster tatsächlicher Zahlungstermin. A02 muss Ereignisfolge und die Zählung der drei nicht gezahlten Raten deterministisch abbilden. Die fünf Prozent allein wären nicht ausreichend; die genannten D-0034–41-Regeln ergänzen die Berechnung.

## 6. SimTAX

Bestätigt: 19 %; Bemessungsbasis ist bestätigter Positionswert vor SimTAX; Berechnung je Rechnungsposition auf deren Gesamtwert, kaufmännische Rundung auf Cent, anschließend Summe der gerundeten Positionssteuer (D-0053–55). Korrekturen kehren den ursprünglich gerundeten Steuerbetrag referenziert um (D-0057). Externe Kundenrechnungen und qualifizierte Lieferantenrechnungen sind getrennt geregelt; Lieferanten-Vorsteuer unterliegt D-0113 und V1 bildet keine Sonderfälle, Ausschlüsse oder anteilige Abzüge ab (D-0114). Vorsteuer- und Umsatzsteuer-Simulationssaldo werden verrechnet (D-0058).

Der SimTAX-Zeitraum folgt der bestätigten UStG-Referenz (D-0059); monatliche Abgabe-/Fälligkeit gemäß D-0097. Das ist keine Behauptung realer Steuerkonformität. Fehlererkennung abgegebener Erklärungen bleibt ereignisgesteuert und die konkreten Erkennungsereignisse sind offen (D-0115/16). Nichtsteuerliche Fehler nach Jahresabschluss werden nach D-0119 im Folgejahr erfasst und ändern die geschlossene Vorperiode nicht; CP-0147 dokumentiert diese Entscheidung.

## 7. D3-BAB, Personal und Maschinenkosten

Der statische BAB gehört zu V1. Bestätigte Zuschläge (D-0062–64): MGK 15 % der MEK, FGK 100 % der Fertigungslöhne, Vw/Vt-GK 10 % der Herstellkosten.

Bestätigte Personalwerte (D-0065–70): Bruttolöhne 10.400 €/Monat; CNC 3.800 € und PROD 3.100 € Fertigungslöhne (6.900 €); MA-AV 3.500 € gehört nicht zu Fertigungslöhnen. Arbeitgeberkosten betragen 21 % (2.184 €), gesamter Personalaufwand 12.584 €/Monat. CNC/PROD-Arbeitgeberkosten sind Teil der FGK-Basis: 8.349 €/Monat; MA-AV-Gesamtkosten 4.235 €/Monat gehören zum Vw/Vt-GK-Pool.

Kalkulatorische CNC-Kosten gehören zu FGK; monatliche Basis ist `(120.000 € × 1,02^16) / 192`, auf volle Euro aufgerundet (D-0071–76). Separat davon: Buchabschreibung und Eröffnungsbuchwert 0 € (D-0077–99). Die Einzelwerte sind bestätigte Sätze, keine offenen Nutzeroptionen.

Weiterhin nicht belegt sind konkrete übrige laufende Kosten, die genaue Perioden-/Ereigniszuordnung weiterer Kostenstellen, Betriebsstunden-/Zuordnungsdaten und nicht festgelegte BAB-Ausführungsdetails. Sie dürfen nicht aus fehlenden Angaben abgeleitet werden.

## 8. Materialbewertung

E3 gleitender Durchschnitt ist bestätigt. 12.800 € sind der bestätigte Gesamtwert der Vorräte, während die bestätigte Einzelmenge Stahl 2.000 kg beträgt (D-0090); dessen Wert ist gemäß D-0091 aus dem bereitgestellten Vorjahresschluss zu übernehmen. 6.400 € und 3,20 €/kg sind keine bestätigten Stahlwerte. Die bisherigen A02-Profilwerte für Aluminium (800 kg / 4.400 €) und Norm-/Zukaufteile (1.000 Einheiten / 2.000 €) sind nicht als Eröffnungswerte bestätigt; D-0094–96 bestätigen Gruppen/Scope, keine Einzelmengen oder Bewertungen. Damit ist die Bilanzsumme als Aggregat rechnerisch konsistent, aber ihre Vorratsaufteilung mangels bestätigter Komponentenwerte noch nicht nachgerechnet. Erforderlich ist die bereitgestellte Eröffnungsbewertung je Vorratsgruppe einschließlich Stahl-Vorjahresschlusswert. Der Abgleich lautet dann: Gesamtwert = Stahl-Vorjahresschluss + Werte der übrigen Vorräte. Kein Stahlwert wird als Restbetrag abgeleitet. Falls belegte Einzelwerte nicht 12.800 € ergeben, muss A01 die Klärung der Vorrats-Gesamtsumme mit dem Nutzer herbeiführen.

## 9. A02/A04 Schnittstellen und verbleibende Punkte

A02 muss mindestens liefern: wirksame Leistungs-/Liefer-/Rechnungsdaten für Fristanker; Simulationstag, Kalender und Ereignisreihenfolge; vollständige Kundeneingänge bzw. explizite Verspätungsereignisse; fällige eigene OP und Zahlungsversuche samt Resultat; separate wöchentliche Retry-/Erinnerungs-/Mahnungsevents; Darlehensraten, Zinsperioden und Fehlzahlungs-/Verwertungsereignisse; Materialmengen und Vorjahresschlusswert; Arbeitsstunden und Ressourcen-/Kostenstellenbezüge. A03 bleibt autoritativ für OP, Zins-/Kosten-/Erlöswirkungen und Liquidität.

A04 muss diese Trennung abbilden können, ohne Accounting-Doppelwahrheit zu schaffen: Vertrag/Kondition, Leistung/Wareneingang, Rechnung, offene Position, Fälligkeit, Zahlungsversuch, Zahlung, Mahnstatus, Darlehenshauptschuld, Zinsaufwand, Bestand/WAP, BAB-Basis und Kostenereignisse bleiben unterscheidbar. Keine Schemaänderung oder Architekturfreigabe folgt daraus.

Noch offen bleiben insbesondere Darlehensrate und erster Termin, Dispositionskredit-Limit/Draw/Rückzahlung, A02-Ereignisreihenfolge, konkrete Vorjahresschluss-Übergabe für Stahl, sowie einzelne Kosten- und Zuordnungsdaten, die der Decision Log nicht festlegt. Keine neue Produkt-, Rechts- oder Steuerregel wird hieraus abgeleitet.
