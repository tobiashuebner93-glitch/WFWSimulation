# A03 – Nutzerentscheidungsvorlage für offene P0-Finanzparameter

**Stand:** 2026-10-25  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Bezug:** MG-000 / SLG-000.2 / T-0008 (A01-Koordination) / T-0009 (A02-Kalenderübernahme, PENDING) / CP-0031 bis CP-0034 / D-0010 / D-0011  
**Status:** Entscheidungsvorlage; keine neue Nutzerregel oder Umsetzung.

Diese Vorlage fasst ausschließlich offene P0-Finanzparameter zusammen. Sie unterscheidet beschlossene Regeln, bisher dokumentierte Vorschläge und Fragen, für die eine Nutzerentscheidung fehlt. Die A03-Empfehlungen erklären die Folgen; sie sind keine Vorauswahl.

## 1. Bereits bestätigte Leitplanken

- **Fälligkeit und Kalender:** D-0011 bestätigt Montag bis Freitag als Arbeitstage, arbeitsfreie Wochenenden, keine Feiertagsberücksichtigung in V1 und Verschiebung eines auf das Wochenende fallenden Termins auf den nächsten Arbeitstag. F3 zählt fünf Arbeitstage ab dem Folgetag der vollständigen Lieferung. D-0011 entscheidet ausdrücklich nicht die Zahlungszielzählung.
- **Zahlungsrichtungen:** Kundeneingang folgt Kundenverhalten und hat kein eigenes Cash-Gate. Eigene Lieferanten-/Gläubigerverbindlichkeiten lösen bei Fälligkeit einen automatischen Vollzahlungsversuch mit eigener Liquiditätsprüfung aus. Bei Fehlschlag: keine Teilzahlung, keine negative Liquidität, keine Cashbewegung, voller OP bleibt offen, Fehlschlag wird dokumentiert und V1-Dunning folgt. (CP-0025/CP-0026/CP-0031.)
- **Darlehen:** Startrestschuld 24.000 €, nominal 5 % p.a., ursprünglich zehn Jahre finanziert. (Eröffnungsbilanzvorgabe und A03-Finanzspezifikation.)
- **SimTAX:** Simulierte Einstellung 19 %; Steuer je Rechnungsposition auf Cent runden und gerundete Positionsbeträge summieren. Keine Aussage zur realen Steuerbehandlung. (CP-0031.)
- **Kostenrechnung:** Ein statischer BAB gehört zu V1; vereinfachte/statische Werte sind grundsätzlich zulässig. (D-0010.) Das entscheidet keine Kostenpools, Sätze, Personalkosten oder laufenden Kostenbeträge.
- **Umfang/Governance:** D-0010 bleibt unverändert. Architektur V0.2 und ADRs bleiben PROPOSED. CP-0020 fehlt im aktuellen Checkout und wird nicht rekonstruiert.

## 2. Zahlungsziele, Fristanker und Fälligkeit

### Dokumentierter Bestand

Vertragliche Zahlungsziele von **14 oder 30 Tagen** sind vorgesehen. In den A03-Unterlagen stehen zwei unterschiedliche Ansätze:

| Ansatz | Formel mit `N ∈ {14, 30}` | Quellenstatus und mögliche Folge |
|---|---|---|
| Rechnungsanker | `Fälligkeit = Rechnungsdatum + N Tage` | Verkürzt in A03-Finanzspezifikation §C/K dokumentiert; nicht als finale Nutzerformel bestätigt. Frist beginnt unabhängig vom tatsächlichen Leistungsdatum. |
| Späterer Zeitpunkt | `Fälligkeit = max(Leistungszeitpunkt, Rechnungsdatum) + N Tage` | Als A03-Vorschlagsformel in der P0-Finanzkonsistenzprüfung dokumentiert; keine Auswahl/Bestätigung belegt. Der Leistungszeitpunkt muss je Richtung präzisiert werden. |

Für die zweite Formel ist offen, ob der Leistungsanker bei Kundenforderungen die vollständige Lieferung, tatsächliche Leistung oder wirksame Abnahme meint; bei Lieferantenverbindlichkeiten ist zu bestimmen, ob maßgeblich Wareneingang, bestätigte Fremdleistung oder ein anderer bestätigter Erfüllungszeitpunkt ist. Rechnungsdatum bzw. Rechnungseingang muss je Seite eindeutig definiert sein.

### Nutzerfragen und Optionen

1. **Welcher Fristanker gilt je Vertragsrichtung?** Rechnungsdatum; Leistungs-/Lieferungs-/Empfangsdatum; oder der jeweils spätere Zeitpunkt aus Rechnung und maßgeblichem Leistungsereignis. Das kann für Kunden- und Lieferantenseite separat festgelegt werden.
2. **Zählt `N` Kalender- oder Arbeitstage?** Beide Auslegungen sind plausible Produktregeln, aber keine ist durch D-0011 entschieden. Bei Kalenderzählung werden Wochenendtage mitgezählt; bei Arbeitstagszählung zählen nach der Ankertagsregel nur Montag bis Freitag.
3. **Wird der Ankertag mitgezählt oder beginnt Tag 1 am Folgetag?** Das ist in den Finanzunterlagen nicht abschließend festgelegt.
4. **Wie wird ein berechneter Wochenendtermin behandelt?** D-0011 bestätigt bereits: auf den nächsten Arbeitstag verschieben. In V1 werden Feiertage nicht zusätzlich berücksichtigt.
5. **Welches Ziel wird je Vertrag gewählt?** 14 oder 30 Tage sind als Varianten dokumentiert; Standardwert oder automatische Auswahl ist nicht bestätigt.

### Auswirkungen und Zuständigkeiten

- **Accounting (A03):** Nutzerentscheidung zum Fristanker/Zähltag in eine finanzielle Due-Date-Formel überführen; Fälligkeit von Rechnung, offenem Posten, Versuch und tatsächlicher Zahlung getrennt führen.
- **Simulation (A02):** vollständige Liefer-/Leistungs-/Empfangsereignisse, Rechnungseingang/-ausstellung, Simulationsdatum, Tagesphasen und den durch D-0011 bestätigten Kalender bereitstellen. A02 muss den bestätigten Arbeitskalender noch durch T-0009 in seine Spezifikation übernehmen; T-0009 ist PENDING.
- **Abstimmung:** Erst nach A02-Übernahme von D-0011 kann A03 bestätigen, wie der ausgewählte Fristanker und berechnete Fälligkeit in Tagesphase und Ereignisdatum umgesetzt werden. T-0009 entscheidet die 14-/30-Tage-Zählung nicht.
- **Datenmodell (A04):** nach Nutzer- und Fachentscheidung prüfen, ob Kondition, ursprüngliches Zieldatum und wirksames (wochenendverschobenes) Fälligkeitsdatum getrennt darstellbar sein müssen. Keine Schemaänderung ist hiermit beauftragt.

## 3. Eigene Auszahlungen und Mahnfluss

### Bestätigte Trennung

Kundenforderungen/-eingänge sind ein eigener Fluss: Zahlung nach Kundenverhalten, ohne Prüfung des eigenen Bankbestands. Das Liquiditäts-Gate gilt ausschließlich für eigene Zahlungsverpflichtungen. Eine Kundenzahlung darf nicht durch fehlende eigene Liquidität verzögert oder verhindert werden.

Für eigene Lieferanten-/Gläubigerverbindlichkeiten gilt der automatische Vollzahlungsversuch bei Fälligkeit. Bei Erfolg wird der volle Betrag gezahlt und der OP ausgeglichen. Bei unzureichender Liquidität findet weder Teilzahlung noch negativer Cashbestand noch Liquiditätsbewegung statt; der volle OP bleibt bestehen, der Fehlschlag wird dokumentiert und führt in den bestätigten V1-Dunning-Fluss. A03 bestimmt OP- und Cashwirkung; A02 führt Simulationstag, Ereignisfolge und Folgeereignisse aus. Eine Dunning-Stufe selbst ist kein Zahlungsvorgang und erzeugt ohne bestätigte Finanzregel weder Gebühr noch Zins noch Cash-/Assetbewegung.

Der Produktbestand nennt Zahlungserinnerung → Mahnung → Pfändung bzw. Liquidation als benannten Ablauf. Er enthält keine bestätigten Fristen, Schwellen, Auswahlkriterien oder Wirkungsdetails. Daher wird hier weder Pfändung noch Liquidation als automatische rechtliche oder finanzielle Folge ausgestaltet.

### Offene Nutzerfragen und Optionen

| Entscheidung | Option 1 | Option 2 | Option 3 | Finanz-/Simulationsfolge |
|---|---|---|---|---|
| Priorität gleichzeitig fälliger eigener Verbindlichkeiten bei knappem Cash | älteste Fälligkeit zuerst | Nutzer legt eine feste Gläubiger-/Verbindlichkeitsrangfolge fest | Reihenfolge pro Simulationstag durch Nutzer/Spieler festlegen | Bestimmt, welche vollständigen OPs bezahlt werden, bevor der Cashbestand für weitere Versuche nicht reicht. A02 braucht deterministische Tie-Breaks; A03 prüft jede volle Zahlung. Keine Reihenfolge ist belegt. |
| Wiederholungsversuch nach Liquiditätsfehlschlag | kein automatischer Retry (nur separat ausgelöste spätere Aktion) | erneut bei nächstem passenden Ereignis, z. B. nach tatsächlichem Kundeneingang | Retry nach festem Abstand/Termin; Abstand und Anzahl werden erst vom Nutzer bestimmt | Verändert Cashverlauf, OP-Alter und Mahnstatus. A02 terminiert Versuche; A03 berechnet Verfügbarkeit/OP-Ausgleich. Es werden hier keine Retry-Werte vorgegeben. |
| Mahnfristen/-schwellen | feste, vom Nutzer gewählte Simulationsintervalle | Stufenwechsel nach Nutzer-bestimmten Ereignissen/Schwellen | Dunning-Status ohne automatischen Zeit-/Schwellenwechsel, bis Nutzerentscheidung | Ändert Zeitpunkt und Status von Erinnerung/Mahnung, nicht automatisch Cash/Ergebnis. A02 braucht Auslöser/Datum; A03 führt Dunning- und OP-Sicht. |
| Eskalationsausgänge | Pfändung/Liquidation nur als narrative/statusbezogene Endpunkte | konkrete Simulationsfolgen nach ausdrücklich gewählten Bedingungen | Eskalationsausgänge für V1 nicht aktiviert, bis Nutzer sie konkretisiert | Kriterien, betroffene Assets/OPs, Reihenfolge und finanzielle Wirkung bleiben offen; keine Rechtslogik wird angenommen. |

**Noch erforderliche Festlegungen:** Prioritätsregel samt Gleichstand; Retry-Auslöser, Abstand, Anzahl/Ende und Verhalten bei weiterem Fehlschlag; Mahnfristen, Schwellen und Statusübergänge; ob/wie benannte Pfändungs-/Liquidationsausgänge im Spiel wirken. Keine dieser Optionen ist vorausgewählt.

## 4. Maschinendarlehen

### Bestätigte Werte und offene Grenzen

Zum 01.01.2027: Restschuld **24.000 €**, nominal **5 % p.a.**, ursprüngliche Finanzierung über **10 Jahre**. Der nominale Zinssatz reicht allein nicht für einen eindeutigen Tilgungs- und Zahlungsplan. Die ursprüngliche Laufzeit belegt keine verbleibende Laufzeit, Schlussfälligkeit oder Rate.

| Nutzerentscheidung | Dokumentierte Möglichkeiten / erforderliche Auswahl | Wirkung und benötigte Eingabe |
|---|---|---|
| Tilgungsart | L1 gleichbleibende Annuität; L2 gleichbleibende Haupttilgung; L3 endfällige Haupttilgung (im A03-Finanzdokument beschrieben, keine Option gewählt) | Bestimmt Rate bzw. zeitliche Verteilung von Hauptschuld und Zins; L1 braucht Rate/Restlaufzeit, L2 Tilgungsbetrag/Restlaufzeit, L3 Endtermin und Zinszahlungen. |
| Restlaufzeit/Endfälligkeit und Tilgungsbeginn | Nutzer gibt Restdauer, erste Fälligkeit und Schlussrate/Endtermin an | Legt Anzahl/Datum der Zins- und Tilgungsperioden und Höhe der Restschuld am Ende fest. |
| Ratenhöhe/-rhythmus und Zahlungstermine | feste Annuität; konstante Haupttilgung plus periodische Zinsen; Zinsen periodisch und Hauptbetrag am Endtermin; genaue Terminfolge wählen | A02 braucht Simulationstermine/Perioden; A03 berechnet Zins, Tilgung und Cashabfluss getrennt. Keine Rate oder Monatsperiode wird angenommen. |
| Zinsberechnung | z. B. einfacher Jahreszins zeitanteilig nach Monatszwölfteln oder nach tatsächlichen Tagen mit vom Nutzer festgelegter Tagesbasis; Zins auf Anfangs- oder festgelegtem Periodensaldo | Bestimmt Aufwand und Zinsverbindlichkeit. 5 % nominal definiert weder Tageszählung noch Kapitalisierung, Zinsperiode, festen/variablen Satz noch Zahlungsdatum. |
| Zinszahlung/Kapitalisierung | Zins parallel zur Tilgungsrate zahlen; separat zu Terminen zahlen; als offene Zinsverbindlichkeit führen. Kapitalisierung ausdrücklich ja/nein. | Aufwand entsteht getrennt vom Cashabfluss und Hauptsaldo; nicht gezahlte Zinsen bleiben bis eigener Entscheidung vom Hauptbetrag getrennt. |
| Rundung/Schlussrate | Rundungsstufe und Centkonvention pro Periode; Schlussrate als Ausgleich oder gesondert definierter Betrag | Beeinflusst periodische Zinsbeträge, Schlussrest und Liquidität; keine Rundungsregel ist belegt. |
| Fehlzahlung | kein Teilbetrag/kein negativer Cash; Nutzer wählt, ob Rate offen bleibt, später erneut versucht wird und ob eine darlehensbezogene Mahnstufe gilt | Darlehensverhalten ist nicht automatisch durch Lieferanten-OP-Regeln entschieden. Retry, Fristen, Gebühren und Folgen offen; A02 terminiert nur nach Wahl. |

**Finanzielle Trennung:** Zinsaufwand belastet Ergebnis; Tilgung reduziert Darlehenshauptschuld und Liquidität, ist aber kein zweiter Aufwand; Zinszahlung reduziert Liquidität und gleicht erfassten Zins aus. Die 5 % nominal p.a. allein legen keine dieser zeitlichen Einzelheiten fest. Keine Tilgungsart oder Default wird empfohlen oder ausgewählt.

## 5. SimTAX

| Frage | Mögliche Produktoptionen | Auswirkung |
|---|---|---|
| Bemessungsbasis je Rechnungsposition | bestätigten Positionswert vor SimTAX als Basis verwenden; oder eine separate explizite Basis je Position übergeben. Wenn Positionseingabe bereits einen SimTAX-Anteil enthält, muss der Nutzer die mechanische Ableitung aus dem Gesamtbetrag festlegen. | Verändert SimTAX-Betrag und Rechnungsbetrag; A02 liefert Positionswerte/Einheiten, A03 berechnet Betrag, A04 muss Basis und Ergebnis unterscheidbar führen. |
| Rundung bei exakt halbem Cent | kaufmännisches Runden der positiven Beträge; zur geraden Centzahl runden; eigene explizite Rundungsvorschrift | Nur exakte Halbcentfälle ändern sich; es handelt sich um eine Simulationskonvention, nicht um eine Behauptung über geltendes Steuerrecht. |
| Positionseinheit | Steuer auf erweiterten Positionsbetrag (Menge × Einzelpreis) oder auf einzelne Einheiten und danach Positionssumme | Kann Rundungsdifferenzen erzeugen; die bestätigte Regel „je Position, dann summieren“ bleibt erhalten, aber die Positionsebene muss feststehen. |
| Geltungsbereich | Kundenrechnungen; Lieferantenrechnungen; oder getrennte, benannte Kategorien | Bestimmt, welche Rechnungskomponenten SimTAX tragen; keine Kosten-/Materialkategorie ist vorgegeben. |
| Korrekturen | negative Korrekturposition nach derselben Positionsregel neu berechnen; oder den ursprünglichen gerundeten Steuerbetrag referenziert umkehren und Korrektur separat ausweisen | Beeinflusst Historie und Rundungsabstimmung; Korrekturpfad und Steuerwirkung bleiben offen. |
| Simulationsausweis/Verrechnung | SimTAX als getrennte Rechnungskomponente mit eigener Simulationssaldo-Sicht führen; oder nur Positionsbetrag auf Rechnung ausweisen und Verrechnung bis zu Nutzerregel offen halten | Wirkt auf Rechnungssumme, OP und spätere Simulationsverrechnung. Keine Abführung/Saldierung wird unterstellt. |

## 6. D3-BAB und laufende Kosten

Der statische BAB als V1-Umfang ist bestätigt. Er ist ohne Nutzerbestätigung von Kostenstellen/Pools, Treibern, Sätzen und Perioden noch nicht berechenbar.

| Benötigter Wert/Zuordnung | Bestand/Quelle | Zuständige Rolle und zu entscheidende Frage |
|---|---|---|
| Kostenstellen/Pools und BAB-Periodengültigkeit | D-0010 bestätigt BAB V1, nicht konkrete Struktur oder Periode | Nutzer legt Tiefe/Struktur fest; A03 ordnet Finanzkategorien/Periode zu; A02 liefert Ereignis-/Periodenzeit. |
| Verteilungsschlüssel und Prozentsätze je Pool | Frühere A03-P0-Arbeitsunterlage listet 15 % MGK auf MEK, 100 % FGK auf Fertigungslöhne und 10 % Vw/Vt-GK auf HK als Vorschlag. Diese Werte sind in CP-0031 und D-0010 nicht als beschlossen belegt. | Nutzer bestätigt, ändert oder verwirft Vorschlagswerte; A03 definiert anschließend Basis/Formel. Keine Sätze gelten derzeit als Regel. |
| Materialeinzelkosten/Basis für MGK | E3 gleitender Durchschnitt ist bestätigt; Bezugskosten-/SimTAX-Basis und betriebliche Zuordnung bleiben offen | A02 liefert Menge/Verbrauch und Zeit; A03 bestätigt WAP-Basis und MEK. |
| Fertigungslöhne und Personalnebenkosten | A02s Startvorschlag nennt 10.400 € Monatsbruttolohnsumme, aber CP-0031 kennzeichnet weitere Finanzparameter unvollständig; Aufteilung je Person/Rolle, produktive Stunden und Arbeitgeberkosten nicht verbindlich aufgeschlüsselt | Nutzer bestätigt Startwerte/Umfang; A02 liefert zugeordnete Stunden/Rollen; A03 bildet Kostensatz und BAB-Basis. |
| Maschinen-/CNC-Kosten | D-0011 liefert 8 operative Stunden je Arbeitstag für CNC; Anschaffungsbuchwert 40.000 € allein ergibt keinen Stundensatz. Abschreibung, Instandhaltung und Rate fehlen. | Nutzer/A03 bestimmen, ob/welche Kosten in V1 einfließen; A02 liefert Maschinenstunden. |
| Energie, Transport und sonstige direkte Fertigungskosten | Keine vollständige Mengen-/Preis-/Betragsliste ist in CP-0031 bis CP-0034 belegt | Nutzer liefert Preis-/Betragswerte; A02 liefert Verbrauch/Belege; A03 entscheidet direkte Kosten- und HK-Zuordnung. |
| Laufende Kosten (z. B. Miete, Energie, Versicherung) | A03-P0-Prüfung nennt Kategorien, stellt aber fest, dass keine vollständigen Beträge/Sätze im Repository belegt sind | Nutzer bestätigt Betrag, Beginn, Intervall, Ansatzzeitraum, Fälligkeit/Zahlungsdatum und Kostenstelle; A03 ordnet Aufwand/Verbindlichkeit/Cash, A02 terminiert Ereignisse. |
| Rundung/Gültigkeit und Auftragsergebnis | Keine allgemeine BAB-Zeilenrundung, Regelversion, Zuordnung des Vw/Vt-Aufschlags oder Ergebnisformel mit konkretisierten Inputs bestätigt | A03 erstellt nach Entscheidung reproduzierbare Formel; Nutzer bestätigt Produktdarstellung; A04 kann später Modellbedarf prüfen. |

**A03-Position zum früheren 15 % / 100 % / 10 %-Vorschlag:** Die Werte bleiben mögliche Gesprächsoptionen aus einer früheren Arbeitsunterlage. Mangels Bestätigung durch D-0010/CP-0031 werden sie nicht als Nutzerwerte behandelt, nicht in die aktuelle Finanzspezifikation als geltende Sätze übernommen und nicht zur Kostenberechnung verwendet.

## 7. Übergabe und Reihenfolge

1. A01 führt diese offenen Fragen im T-0008-Koordinationskontext zusammen und legt dem Nutzer die nötigen Produktfragen vor. Die hier dokumentierte A03-Vorlage ist keine neue Ticketvergabe; eine Ticketnummer für einen separaten A03-Fachauftrag vergibt A01.
2. A02 arbeitet T-0009 (PENDING) ab und übernimmt D-0011 in die Simulationsspezifikation. A02 entscheidet dabei ausdrücklich weder Zahlungszielanker noch Kalender-/Arbeitstagszählung.
3. Nach A02-Übernahme und Nutzerentscheidung zu Fristanker/Zähltagen stimmt A03 die endgültige Due-Date-Formel, Ereignisdatum und Periodenwirkung mit A02 ab.
4. Erst nach fachlichen Entscheidungen wird A04 bei Bedarf um eine separate Datenmodell-Folgenprüfung gebeten. Diese Vorlage erteilt keinen solchen Auftrag.

## Quellen und belegte Grenzen

- D-0010 und D-0011; CP-0031, CP-0032, CP-0033, CP-0034.
- A03-Finanzspezifikation, insbesondere §§ C–K, P und Abschnitt „Maschinendarlehen“.
- A03-P0-Finanzkonsistenzprüfung, insbesondere Fristformelvorschlag, Darlehensoptionen, SimTAX und D3-Arbeitsvorschlag.
- A02-Maschinenbau-Simulationsspezifikation und A04-Datenbankspezifikation, einschließlich CP-0025/CP-0026-Zahlungsrichtungen.

Keine Rechts-/Steuerlogik, keine Mahnfrist, kein Darlehensdefault und kein Kostenwert wird mit dieser Vorlage festgelegt. D-0010 und Architektur-/ADR-Status bleiben unverändert.
