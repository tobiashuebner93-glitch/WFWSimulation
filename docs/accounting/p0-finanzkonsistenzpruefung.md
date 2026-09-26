# A03 – P0-Finanzkonsistenzprüfung Maschinenbau-MVP

**Stand:** 2026-09-26  
**Rolle:** A03 – ACCOUNTING_FINANCE  
**Bezug:** MG-000 / SLG-000.2 / CP-0014 / CP-0016 / D-0010  
**Status:** Prüfung des vom Nutzer vorgegebenen P0-Produktstands. Keine neuen Produktentscheidungen, keine Implementierungsfreigabe.

**Nachtrag nach Nutzerentscheidung zur Eröffnungsbilanz:** Der Abschnitt mit dem alten 47.800-€-Rechenstand ist durch die bestätigten Maschinen-/Darlehenswerte und das ausgewiesene Eigenkapital aktualisiert. Maßgeblich ist der unten aktualisierte Eröffnungsabgleich und die Darlehenskonkretisierung in der Finanzspezifikation.

## 1. Ergebnis in Kürze

Der Startzustand ist liquiditätsmäßig eindeutig, bilanziell aber noch nicht vollständig abstimmbar:

- Zahlungsmittel am Start: 30.000 €. Der ungenutzte 20.000-€-Rahmen ist kein Zahlungsmittel.
- Aktiva einschließlich Maschine: 30.000 € Liquidität + 12.800 € Material + 12.500 € Forderungen + 40.000 € Maschine = **95.300 €**.
- Verbindlichkeiten: 7.500 € Lieferanten-OP + 24.000 € Maschinendarlehen = **31.500 €**.
- Eigenkapital als bestätigte Restposition: **63.800 €**. Summe Passiva = 31.500 € + 63.800 € = **95.300 €**; Bilanzdifferenz **0 €**.
- Die Aufteilung 50.000 € Rahmen = 30.000 € Liquidität + 20.000 € Rest-Rahmen ist konsistent, wenn der Rest-Rahmen getrennt von Zahlungsmitteln und Vermögen geführt wird. Material und Forderungen dürfen nicht ein zweites Mal aus dem Rahmen abgezogen werden, ohne ihre Eröffnungsquelle/Gegenposition zu erfassen.

Die Zahlungs-, BAB-, Material- und SimTAX-Regeln sind mit dem Modell grundsätzlich darstellbar. Vor Umsetzung fehlen insbesondere Gegenposition/Stichtag, rechtlicher oder interner Charakter des Rest-Rahmens, Ausfall-/Retry-Regeln, Datumsarithmetik, Mahnfolgen, Rundung und BAB-Periode. A02s Startvorschlag enthält Materialmengen/-werte und Monatsbruttolöhne von 10.400 €; daraus folgen noch keine vollständigen Arbeitgeberkosten, Kostensätze, BAB-Zuordnung oder Kapazitäten. Laufende Kostenbeträge sind nicht aufgeführt.

## 2. Eröffnungszustand: Konsistenz

| Position | Vorgabe | Behandlung |
|---|---:|---|
| Gesamtfinanzierungs-/Budgetrahmen | 50.000 € | Rahmen/Limit; nicht automatisch Cash oder Vermögenswert |
| Anfangsliquidität | 30.000 € | Zahlungsmittelbestand am gemeinsamen Startstichtag |
| Rest-Rahmen | 20.000 € | nicht gezogene Finanzierungskapazität oder interner Budgetrest; genaue Art offen |
| Materialbestand | 12.800 € | Bestand/Eröffnungswert; je Material aufzuteilen |
| Forderungen | 12.500 € | Eröffnungs-OP mit Kunde, Beleg, Restbetrag und Fälligkeit zu erfassen |
| Verbindlichkeiten | 7.500 € | Eröffnungs-OP mit Lieferant, Ursprung, Beleg, Restbetrag und Fälligkeit |

A02s Startvorschlag zerlegt den Materialwert in Stahl (2.000 kg × 3,20 € = 6.400 €), Aluminium (800 kg × 5,50 € = 4.400 €) und Norm-/Zukaufteile (1.000 × 2,00 € = 2.000 €). Summe: 12.800 €. E3 benötigt Bestätigung, dass diese Preise die Eröffnungs-WAP-Basis sind. Monatsbruttolöhne von 10.400 € (124.800 € jährlich) sind benannt, aber weder Arbeitgeber-Gesamtkosten noch BAB-Verteilung oder Personalkostensatz je Rolle sind damit festgelegt.

Der 20.000-€-Rest darf nur dann als Finanzierungskapazität gelten, wenn Herkunft, Verfügbarkeit und Ziehungsereignis feststehen. Ist es bloß ein internes Ausgabenlimit, ist es kein bilanzwirksamer Finanzierungsposten. Falls es eine zugesagte Kreditlinie ist, ist die ungezogene Linie ebenfalls nicht Cash; eine Ziehung ist ein eigener Vorgang mit Zeitpunkt und Betrag. Automatische Zahlung berechtigt nicht automatisch zur Ziehung.

Diese Bilanz gleicht rechnerisch aus. Die Herkunft des Eigenkapitals ist die vom Nutzer bestätigte Eröffnungs-Restposition: 95.300 € Vermögen minus 31.500 € Verbindlichkeiten. Eine historische Untergliederung in Einlagen, Ergebnisvorträge oder andere Eigenkapitalbestandteile ist nicht vorgegeben. Der CNC-Buchwert von 40.000 € und das zugehörige Darlehen von 24.000 € sind nun als getrennte Eröffnungspositionen erfasst. Gemieteter Raum bleibt ohne zusätzlichen Vermögenswertansatz.

**Liquiditätsrechnung am Start:** 30.000 €. Forderungseingänge erhöhen Cash erst am tatsächlichen Zahlungstag. Material und Forderungen sind Vermögen, keine Liquidität. Verbindlichkeiten reduzieren Cash erst mit tatsächlicher Zahlung. Der 20.000-€-Rahmen beeinflusst Cash erst nach bestätigter Ziehung.

## 3. Vertrag, Forderung/Verbindlichkeit, Rechnung, Fälligkeit, Zahlung

Die festgelegte Fälligkeit wird fachlich so lesbar: maßgeblicher Zeitpunkt ist der spätere aus vollständiger Lieferung/Leistung und Rechnungsdatum; danach beginnt das vereinbarte Zahlungsziel. Vorschlagsformel: **Fälligkeit = max(Leistungszeitpunkt, Rechnungsdatum) + 14 oder 30 Tage**. Die „14 oder 30 Tage“ werden hier als Kalendertage verstanden; genaue Tageszählung und Kalenderregeln bleiben offen.

1. Vertrag fixiert vollständige Menge, Preis, Kund-/Lieferanten-Zahlungsziel und Trigger. Vertrag allein bewegt keine Liquidität.
2. Vollständige Leistung/Lieferung und F3-Abnahme sind A02-Tatsachen. F3-Automatik braucht Fristbeginn, Fristdauer, wirksames Ablaufdatum und Ablehnungsevent.
3. Automatische Rechnung erfolgt genau einmal für die vollständige V1-Menge nach erfülltem F3-/Rechnungsfähigkeitskriterium. Rechnung ist ein eigener Beleg.
4. Kundenforderung entsteht bei vollständiger Rechnung für abrechenbare erbrachte Leistung. Sie ist nicht Vertrag, Lieferung, Rechnungsfähigkeit oder Zahlung.
5. Verbindlichkeit entsteht gemäß Vertragsvereinbarung. A03 schlägt als praktikablen Ansatz vollständigen akzeptierten Wareneingang bzw. bestätigte Fremdleistung vor; Lieferantenrechnung kann Betrag und Zahlungsziel später belegen/abgleichen. Nutzertext lässt den genauen Trigger weiterhin konkretisierungsbedürftig.
6. Zahlung ist nur bei tatsächlichem vollständigem Transfer eine Liquiditätsbewegung und gleicht den jeweiligen vollen OP aus. Fälligkeit allein bewegt kein Geld.
7. Vorauszahlungen sind ab Rechnungsstellung zulässig. Produktstand legt nicht fest, ob dies V1 nur auf Kunden-, nur Lieferantenseite oder beidseitig gilt. Keine Zahlung vor Rechnungsstellung annehmen, bis Richtung und Auslöser bestätigt sind. V1 bleibt ohne Teilzahlung.

Für max() fehlt die Definition von Leistungszeitpunkt: Versand, bestätigte Lieferung, erbrachte Fremdleistung oder wirksame F3-Abnahme. Kundenziel und Lieferantenziel sind je Vertrag/Seite 14 oder 30 Tage; Standardwert und Spielerwahl fehlen. Muss A02 bei selben Simulationsdatum Abnahme, Rechnung und Zahlung innerhalb eines Tages weiterverarbeiten dürfen? Dies ist ein Reihenfolgeparameter.

Die Bedingung „bei ausreichender Liquidität“ ist sinnvoll für die **eigene Auszahlung** an Lieferanten. Ein Kundenzahlungseingang hängt nicht von der Liquidität des simulierten Unternehmens ab; er folgt dem Kundenverhalten und dem vereinbarten Termin. Falls V1 Kundenzahlung am Fälligkeitstag garantiert, ist das eine separate Kundenverhaltensregel, keine Kassenprüfung des eigenen Unternehmens. A02-Bericht markiert diese Trennung ebenfalls als Konkretisierungsbedarf.

## 4. Automatische Zahlung bei unzureichender Liquidität

Sicher aus dem Produktstand folgt: Am Fälligkeitstag wird nur eine **volle** Zahlung versucht, wenn genügend verfügbare Liquidität vorhanden ist. Bei unzureichender Liquidität: kein Teilbetrag, kein Zahlungsevent, keine Liquiditätsbewegung, OP bleibt offen und überfällig.

**A03-Fachregelvorschlag:** Zahlungsversuch prüft verfügbaren Cash gegen den vollen fälligen Betrag. Fehlbetrag erzeugt ein nachvollziehbares „nicht ausgeführt – unzureichende Liquidität“-Ereignis. Keine negative Kasse und keine automatische Kreditziehung, solange nicht gesondert beschlossen.

Vor Implementierung fehlen Produktregeln für:

- Wiederholversuch nach späterem Zahlungseingang (sofort, nächster Tag/Periode oder manueller Auftrag);
- Priorität, wenn mehrere Zahlungen fällig sind, aber Cash nur für einige reicht;
- Ereignisreihenfolge, falls Kundeneingang und Lieferantenauszahlung am selben Tag anfallen;
- ob 20.000 € Rest-Rahmen automatisch gezogen werden dürfen;
- ob eine gescheiterte Zahlung unmittelbar Zahlungserinnerung/Mahnung startet.

Das sind Simulationsregeln für A02, mit Finanzzustand/OP-Prüfung durch A03; A04 braucht Ergebnis, Zeitpunkt und Grund jedes Versuchs. Keine Teilzahlung als Fallback.

## 5. Mahnung, Pfändung, Liquidation

Der Produktstand nennt Zahlungserinnerung → Mahnung → Pfändung bzw. Liquidation, definiert aber weder Fristen noch Beträge und Wirkungen. A03 kann Forderung, Verbindlichkeit, Fälligkeit, Überfälligkeit und offenen Betrag abbilden. Daraus folgt keine rechtliche Automatik oder verbindliche Rechtsbehauptung.

Für eine MVP-Mechanik fehlen: Karenz-/Stufenfristen; Stufenereignisse und Rücksetzung nach Zahlung; Gebühren/Zinsen oder deren Ausschluss; Bedingungen für Pfändungs-/Liquidationsereignis; welche Forderungen, Assets oder Zahlungsmittel betroffen sind; Priorisierung konkurrierender Gläubiger; Verteilung eines Restvermögens und endgültiger Simulationsstatus. Rechtliche Realitätsnähe würde separate Fachprüfung erfordern.

**A03 empfiehlt für den Finanzkern:** Überfälligkeit und Erinnerungs-/Mahnstufe zunächst getrennt als Status/Ereignis führen; keine Gebühr/Zinsen oder Cash-/Assetwirkung ohne bestätigte Regeln. Pfändung/Liquidation nicht allein aus einem überfälligen OP automatisch auslösen. Dies ist ein Umsetzungshinweis, keine Änderung der benannten Produktfolge; der Nutzer muss Schwellen und Konsequenzen konkretisieren.

## 6. E3 – gleitender Durchschnittspreis

Pro Material und Bewertungsbereich (Lager/Standort noch offen):

- Eröffnungswert und Eröffnungsmenge bilden den Start-WAP.
- Nach akzeptiertem Zugang mit Menge q und bewertbarem Preis p: neuer WAP = (alter Bestandswert + q × p) / (alte Menge + q).
- Verbrauch c wird zum aktuell gültigen WAP bewertet und als auftragsbezogene Materialeinzelkosten angesetzt; Bestandsmenge und -wert sinken entsprechend. Ein Verbrauch allein ändert den Durchschnitt nicht.
- Nullbestand, Fehlbestand oder negative Menge muss A02 verhindern, solange kein expliziter Pfad beschlossen ist.
- Ereignisreihenfolge und wirksame Zeit müssen reproduzierbar sein. Rückdatierter Eingang/Korrektur erfordert Umkehr und Neuberechnung oder eigene Korrekturregel.

A02s Startvorschlag liefert Mengen und Einzelwerte je Material: Stahl 2.000 kg / 6.400 €, Aluminium 800 kg / 4.400 €, Norm-/Zukaufteile 1.000 Einheiten / 2.000 €. Daraus folgen rechnerisch Startpreise von 3,20 €/kg, 5,50 €/kg und 2,00 €/Einheit, falls diese Werte als maßgebliche Eröffnungs-WAP-Basis bestätigt sind. Offen bleiben Preisbasis einschließlich Bezugskosten/SimTAX, WAP-Präzision, Rundung des Verbrauchs-/Bestandswerts, Rundungszeitpunkt, Lagerortaggregation sowie Rücksendungs-/Korrekturregel. WAP sollte intern mit ausreichender Dezimalpräzision laufen; welche Präzision, muss festgelegt werden.

## 7. D3 – BAB und Auftragsergebnis

Die angegebenen Werte definieren drei statische Gemeinkostenpools/Kostenstellen:

| Kostenstelle/-pool | Rechenbasis |
|---|---|
| Materialgemeinkosten (MGK) | 15 % × Materialeinzelkosten (MEK) |
| Fertigungsgemeinkosten (FGK) | 100 % × Fertigungslöhne |
| Verwaltung/Vertrieb (Vw/Vt-GK) | 10 % × Herstellkosten (HK) |

Vorgeschlagene Berechnungsfolge ohne Zirkel:

- MEK = Materialverbrauch × gleitender Durchschnittspreis.
- MGK = 0,15 × MEK.
- Fertigungslöhne = auftragsbezogene Fertigungsstunden × bestätigter Kostensatz.
- FGK = 1,00 × Fertigungslöhne.
- HK = MEK + MGK + Fertigungslöhne + FGK + bestätigte sonstige direkte Fertigungskosten.
- Vw/Vt-GK = 0,10 × HK.
- Auftragsergebnis = Auftragserlös − HK − Vw/Vt-GK − separat ausgewiesene bestätigte direkte Auftragskosten außerhalb HK.

Das ist ein statischer BAB, keine dynamische Vollkostenrechnung. MGK/FGK/VwVt-GK getrennt von verursachenden Einzelkosten ausweisen und nicht doppelt ansetzen. Die angegebenen Prozentsätze sind Nutzerwerte, aber die Kostenstellen-/Basenzuordnung muss als Regelversion festgehalten werden.

Noch offen: Personalkostensatz und welche Personalanteile „Fertigungslöhne“ sind; ob Maschinen-/Energiekosten Teil sonstiger Fertigungskosten oder der FGK sind; ob Transport direkt und außerhalb HK hinzukommt; ob 10 % auf HK vor oder nach einer dieser direkten Positionen gerechnet werden; Zuordnung Miete; Rundung je BAB-Zeile oder nur am Ende; BAB-Periode/Gültigkeit. Der Verweis auf Personal und laufende Kosten „gemäß aktuellem Startvorschlag“ ist im aktuellen Repository nicht mit Beträgen/Sätzen belegt. D3 ist somit strukturell konsistent, aber ohne diese Werte noch nicht vollständig berechenbar.

## 8. SimTAX B2

Vorgegebene Kernregel je Rechnungsposition:

1. Bemessungsbetrag der Position bestimmen (naheliegend: Menge × vereinbarter Einzelpreis; verbindlich zu bestätigen).
2. SimTAX der Position = Bemessungsbetrag × 19 %, auf Cent runden.
3. Steuerbetrag der Rechnung = Summe der bereits je Position gerundeten Steuerbeträge.
4. Rechnungssumme = Summe Positionsbeträge + Summe gerundete SimTAX-Beträge.

Damit wird nicht erst auf der Gesamtrechnung gerundet. Es fehlen noch Rundungsmodus für exakt halbe Cent, Behandlung negativer Korrekturpositionen und Bestätigung, dass „je Position“ den erweiterten Zeilenbetrag und nicht jede einzelne Einheit meint.

19 % ist SimTAX-Produktparameter, keine Aussage zur realen Rechtslage. Noch festzulegen: gilt B2 für Kunden- und Lieferantenrechnungen; welche Kosten-/Materialkategorien tragen SimTAX; wird der SimTAX-Betrag als separate simulierte Steuerposition geführt; wie werden Kunden-/Lieferantensteuerkomponenten verrechnet oder abgeführt. Bis dahin Gesamtzahlung inklusive ausgewiesener Position konsistent halten und Steueranteile getrennt vom Auftragserlös und den Kosten zeigen. Keine Saldierung oder Abführung erfinden.

## 9. F3, automatische Rechnung und G3

F3 erfordert A02-Ereignisse für Voll-Lieferung, Fristbeginn, Fristdauer/-ende, rechtzeitige Ablehnung oder automatische Abnahme mit wirksamem Zeitpunkt. Automatische Abnahme macht Leistung abrechnungsfähig, erzeugt aber weder Rechnung noch Forderung/Zahlung.

Automatische Rechnung ist genau ein vollständiger Rechnungsbeleg für die ganze Auftragsmenge. A02 muss Rechnungsdatum, Leistungs-/Abnahmereferenz, volle Menge und Preisversion bereitstellen. A03 verarbeitet das Ereignis idempotent und erzeugt Forderung/Erlös; Rechnungsstellung ist von Zahlungsziel und Zahlung getrennt.

G3 bedeutet Auftrag erst nach vollständiger Zahlung abgeschlossen. A02 braucht von A03 den Status aller vollständigen Kundenforderungen dieses Auftrags. Noch offen: ob zusätzlich Lieferantenverbindlichkeiten bezahlt sein müssen. Bei späterer Korrektur/Rückerstattung nach G3 fehlt eine Regel zur Wiederöffnung/Revisionsversion.

## 10. Ereignisübergaben von A02 an A03

Jede Übergabe braucht mindestens stabile Ereignis-ID/-art/-version, Simulations-Wirksamkeitszeit plus Erfassungszeit, Sequenz/Abhängigkeit, Vertrag/Auftrag/Position, Partei, volle Menge/Einheit, Geldbetrag/Währung, Belegquelle und Korrektur-/Umkehrbezug. A02 meldet operative Fakten; A03 allein leitet Salden, WAP, OP, Liquidität und Ergebnis ab.

| A02-Ereignis | Notwendige zusätzliche Informationen | A03-Finanzwirkung |
|---|---|---|
| Opening-State geladen | Stichtag; 30.000 € Cash; 20.000 € Rest-Rahmen als getrenntes Limit; je Material Menge/Wert; OP-IDs, Partei, Ursprung, Betrag, Rechnung, Leistungs-/Fälligkeitsdatum; 50.000 € Rahmenreferenz | Liquidität 30.000 €; Materialwert/Start-WAP; eröffnete Forderungen/Verbindlichkeiten, keine doppelte Rahmenverbuchung |
| Vertrag bestätigt | Vollmenge, Preisbasis, Kund-/Lieferantenseite, 14/30-Tage-Bedingung, Trigger, Zielbezug, SimTAX-Kontext/Version | Kondition speichern; kein Zahlungsevent allein durch Vertrag |
| Vollständiger Wareneingang/Fremdleistung akzeptiert | volle bestellte/akzeptierte Menge, Einheit, Preis, Zeitpunkt, SupplierInvoice falls vorhanden, PO-/Auftragsbezug, Steuerposition | Payable-Trigger gemäß bestätigter Regel; Zugang aktualisiert WAP |
| Materialverbrauch | Material-ID, Menge/Einheit, Vertrag-/Laufposition, Zeit/Sequenz, Bewertungsregelversion | Bestand und MEK zum gültigen WAP |
| Arbeits-/Maschinen-/Energieverbrauch | Ressource, Stunden/Menge, Auftrag, Zeitpunkt, Kosten-/Satzreferenz, direkte/Gemeinkostenklasse | Istkosten und D3-BAB-Bezugsgrößen |
| Vollständige Lieferung/Leistung | Gesamtmenge, Delivery-ID, Versand-/Leistungs-/Abnahmedatum, F3-Friststart/-ende, Nachweis, Transportkosten | Leistungs-/Abrechnungsreferenz, ggf. direkte Kosten |
| F3-Ablehnung oder Fristablauf | Delivery-Bezug, Ereigniszeit, Ablehnungsgrund/-zeitpunkt oder Fristablauf, Regelversion | Abrechnungsfähigkeit blockieren oder automatische Abnahme mit Zeitpunkt erfassen |
| Automatische Kundenrechnung | genau ein Beleg, Positionen/Menge/Preis, Datum, Leistungs-/Acceptance-Bezug, SimTAX-Basis/19-%-Version, je Position gerundete Steuer, Gesamtbetrag, 14/30 Tage | Forderung/Erlös; DueAt aus bestätigter Regel |
| Lieferantenrechnung | Beleg, Supplier, PO/Receipt/Service-Bezug, Betrag/Steuer je Position, Datum/Ziel, Abweichung, Payable-Ursprung | Payable abgleichen; nicht doppelt erzeugen |
| Fälligkeit und Zahlungsversuch | Datum, voller Betrag, Cash vor Zahlung, Ereignissequenz/Priorität, Ausführungsresultat/Fehlbetrag | Bei genügend Cash volle Zahlung und Liquiditätsbewegung; sonst kein Payment und OP offen |
| Erinnerung/Mahnung/Eskalation | OP, Stufe, Frist, Ursache, Regelversion; gesonderter Betrag/Asset-Folge nur bei bestätigter Regel | Status/Ereignis; keine unbestätigte Gebühr, Steuer-, Cash- oder Pfändungswirkung |
| Auftragsschluss G3 | Vertrag, alle Kunden-Receivables, Zahlungsreferenzen, Restbetrag null, Zeitpunkt | A03 meldet finanziell vollständig bezahlt; keine erneute Ergebniswirkung |

## 11. A04-Fachanforderungen und vorhandene Modellstellen

Das Modell enthält bereits konzeptionelle Stellen für OpeningBalance, differenzierte InvoiceLines, PaymentTerm/PaymentTermPayment, ObligationSource/Payable/SupplierInvoice, InventoryMovement, ResourceConsumption, CostEntry, OrderResult, BabVersion/BabLine und LiquidityMovement. Das reicht als Strukturvorschlag, entscheidet aber keine Semantik und ist keine Persistenzfreigabe.

A04 soll diese Stellen gegen bestätigte Regeln konkret abgleichen:

- 30.000 € Anfangsliquidität, 20.000 € ungezogener Rest-Rahmen und 50.000 € Gesamtrahmen getrennt;
- Startmaterial laut A02-Vorschlag mit IDs/Einheiten verknüpfen und bestätigen, ob 3,20 €/kg Stahl, 5,50 €/kg Aluminium und 2,00 €/Einheit Norm-/Zukaufteile die E3-Start-WAP-Basis sind;
- 12.500 €/7.500 € OP mit Eröffnungsquelle, Partei, Ursprungsbeleg, Vollrest, Ziel/Fälligkeit und ggf. Auftrag;
- ein vollständiger V1-Term je Richtung bei Erweiterbarkeit für spätere Mehrtermine/Anzahlungen;
- F3-Frist, automatische Rechnung, DueAt und Zahlungsversuch als getrennte Fakten;
- je Position SimTAX-Satz/-Version, Basis, gerundete Steuer und Summe;
- E3-Bewegungsfolge/WAP sowie D3-Kostenstelle, Kostenbasis, Rate, Periode und Ergebnis;
- A03-Alleinautorität für OP-/Cash-/WAP-/SimTAX-/Kosten-/Erlössalden und Auftragsergebnis.

## 12. Fehlende Parameter

### Eröffnung und Betrieb

- gemeinsamer Startstichtag und Simulationskalender;
- Art und Ziehung/Rückzahlung des 20.000-€-Rest-Rahmens;
- CNC-Darlehen: Tilgungsart, Restlaufzeit, Fälligkeit, Zinsperiodik/-berechnung und Zahlungstermine; die 24.000 € Restschuld und 5 % nominal p.a. sind nun vorgegeben;
- Maschine: außer dem Buchwert von 40.000 € noch Anschaffungs-/Nutzungsbeginn, Restnutzungsdauer, Abschreibungsregel und Einbeziehung der Abschreibung in D3-BAB/Kosten;
- Material-IDs, Anfangsmengen/Einheiten laut A02-Vorschlag (Stahl 2.000 kg, Aluminium 800 kg, Norm-/Zukaufteile 1.000 Einheiten), Bestätigung der Einzelwerte (6.400 €/4.400 €/2.000 €) als E3-Start-WAP und SimTAX-/Bezugskostenbasis;
- je Anfangs-OP: Partei, Ursprungsbeleg, Rechnung, Auftrag, Leistungsdatum, Rechnungsdatum, 14/30 Tage, Fälligkeit und vollständiger Restbetrag;
- Personal: Monatsbruttolohnsumme 10.400 € laut A02-Startvorschlag; weiterhin fehlen Aufteilung je Person/Rolle, produktive Stunden, Fälligkeit/Zahlung, BAB-Zuordnung und ob zusätzliche Personalnebenkosten V1-relevant sind;
- laufende Kosten: Miete, Energie, Versicherung etc. mit Betrag, Ansatzzeitraum, Fälligkeit, Zahlungsdatum und Kostenstellenzuordnung. Konkrete Beträge sind in den gelesenen Dateien nicht enthalten.

### Regeln und Berechnungen

- Zielauswahl 14/30 Tage pro Kund-/Lieferantenseite, Standard, max()-Leistungsdatum, Zählweise, Wochenenden/Feiertage und Same-day-Reihenfolge;
- fehlende Liquidität: Wiederholversuch, Frequenz, Priorität, Ereignisreihenfolge und Rahmenziehung;
- Erinnerung/Mahnung: Fristen, Gebühren/Zinsen oder keine, Eskalationsfolge, Pfändungs-/Liquidationskriterien und Folgen;
- SimTAX-Geltung auf Kunden-/Lieferantenpositionen/Kategorien, Basis, halber Cent, negative Korrekturen und spätere Steuerkonten-/Abführungslogik;
- E3: Bewertung von Zugang, Transport-/Bezugskosten, WAP-Präzision und Rundung, Standortgrenze, Rücksendung/Korrektur;
- D3: Bestätigung der Kostenstellen, Fertigungslohn-Basis, Maschinen-/Energiekosten, Transport, Miete, Gültigkeit/Periode und BAB-Rundung;
- G3: ob Lieferantenverbindlichkeiten ebenfalls Abschluss blockieren; Wiederöffnung bei Rückerstattung/Korrektur.

## 13. Finanzspezifikation – Konkretisierung zum aktuellen Stand

Die frühere P0-Optionsdatei empfahl B1/D1/E1 als noch offene Varianten. Die nun vorgegebenen Werte ersetzen diese Vorschläge: SimTAX B2 19 %, D3 mit drei Pools und angegebenen Sätzen, E3 gleitender Durchschnitt sowie 30.000 € Anfangsliquidität/20.000 € Rest-Rahmen. Ebenso sind F3, automatische Vollrechnung/-zahlung bei ausreichendem Cash und G3 die aktuelle Produktvorgabe. D-0010 wird dadurch nicht editiert. Die separate P0-Optionsdatei bleibt als historischer Vorschlag erhalten.

Der obige E3-, D3-, SimTAX-, Opening-State-, OP-, Zahlungs- und Eventabschnitt konkretisiert die Finanzspezifikation. Offen gebliebene Werte sind keine stillschweigend getroffenen Entscheidungen. Architektur V0.2/ADRs bleiben PROPOSED. Keine Buchungssätze, Rechts-/Steuerbehauptung oder Implementierung wurden eingeführt.
