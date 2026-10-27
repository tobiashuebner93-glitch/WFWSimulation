# A02 – Maschinenbau-MVP: Spezifikation und Bestandsanalyse

**Stand:** 26.09.2026 · **Rolle:** A02 – SIMULATION · **Repository:** WFWSimulation, `main`\
**Arbeitsumfang dieser Revision:** Fachliche Spezifikation; diese Revision übernimmt bestätigte Nutzerregeln und konkretisiert ein A02-Startprofil. Keine Code-, Datenbank- oder Architekturänderung.

**V1-Prototyp-Fortschreibung (CP-0178/0179):** Nach dieser Spezifikationsrevision hat der Nutzer ausdrücklich die spielbare V1 mit Abwesenheiten, Feiertagsbehandlung, Markt-/Partnernetzwerk, Aus- und Weiterbildung sowie Raumkapazitäten beauftragt. Diese Erweiterungen sind im lokalen Browser-Prototyp und in [V1-MODELL.md](../../prototype/V1-MODELL.md) dokumentiert. Wo die Erweiterung vom ursprünglichen D-0011-Kernumfang (insbesondere Feiertage unberücksichtigt) abweicht, ist dies als späterer, ausdrücklicher V1-Auftrag kenntlich gemacht und keine stillschweigende Änderung des Decision Logs.

## Status und Governance

Vorgeschriebene Governance gelesen: `AGENTS.md`, Agentenstruktur, Goals, Ticket-Board, Collaboration State, Decision Log, Architektur V0.2 und CP-0002. Aktives Master Goal ist MG-000. Aktiv: SLG-000.1 (Control Plane) und SLG-000.2 (Architektur prüfen, nicht freigegeben). Das einzige aktive Ticket ist T-0001 zur Control Plane; ein aktives A02-Ticket zu dieser fachlichen Aufgabe ist nicht eingetragen. Die Governance beschränkt Arbeitskontext auf Tickets aktiver Goals. Diese Analyse wurde auf ausdrücklichen Nutzerauftrag hin erstellt; A01 muss ihre Aufnahme in den aktiven Arbeitskontext bestätigen.

Alle D-0001 bis D-0009 und ADRs bleiben `PROPOSED`; Architektur V0.2 ist nicht freigegeben. Sie ist Kontext, keine Implementierungs- oder Architekturvorgabe. CP-0002 dokumentiert für die Inventur vom 25.09.2026 keine Anwendungslogik, kein Frontend/Backend, keine Datenbank-/Supabase-Integration, keine Tests und keine Dependencies. Die aktuelle GitHub-Wurzelansicht von `main` zeigt weiter nur `.github/workflows`, `docs`, `AGENTS.md` und `README.md`; keine Anwendungskomponenten. Der lokale Arbeitsordner dieses Auftrags ist kein Git-Checkout. Ein offizieller Repository-Checkpoint kann wegen fehlendem lokalen Checkout, read-only GitHub-Zugriff und ausdrücklichem Verbot von Änderungen/Commits nicht angelegt werden.

### Verbindliche P0-Regeln und Konkretisierung (Nutzerbestätigung vom 26.09.2026)

Die folgenden Regeln ersetzen abweichende `OPEN`-Aussagen in dieser älteren Spezifikation. Werte im Startauftragsprofil sind konkrete A02-Szenarioparameter auf Nutzerauftrag, keine neuen allgemeinen Produktregeln. Noch nicht gelieferte Kunden-, Preis-, Kalender- oder Finanzwerte bleiben offen.

**Tagesauflösung (D-0011):** Zeit wird im Wochenraster mit Monatsabschluss angezeigt/verarbeitet; operative Ereignisse tragen ein konkretes Simulationsdatum. Jeder Zwischentag wird separat aufgelöst. Montag bis Freitag sind Arbeitstage; Beschäftigte und CNC haben je 8 Stunden Tageskapazität (40 Stunden je Woche). Samstag und Sonntag sind arbeitsfrei. Gesetzliche Feiertage werden in V1 nicht berücksichtigt; ein Standort-/Feiertagskalender ist nicht festgelegt. Termine, die auf ein Wochenende fallen, verschieben sich auf den nächsten Arbeitstag. Für jeden Tag gilt die bestätigte Phasenfolge: (1) Spielerentscheidungen, (2) Wareneingänge/Fremdleistungen, (3) Produktion und Materialverbrauch, (4) Produktionsfertigstellung, (5) Lieferung, (6) Abnahme, (7) Rechnungsstellung, (8) fällige Zahlungen, (9) Tagesabschluss, (10) periodische Kosten, soweit Monatsperiodenende. Abhängige Ereignisse dürfen nach Erfüllung ihrer Voraussetzung noch am selben Tag in einer späteren Phase stattfinden. Eine abgeschlossene Phase wird nicht rückwirkend erneut geöffnet. Für unabhängige operative Ereignisse gelten bestehende Ereigniszeit-/Auftragsbezüge; diese Regel legt keine Sortierung für gleichzeitige Finanzereignisse fest. Periodische Kosten laufen nach Tagesabschluss. Ereignisse nach Wochenendverschiebung werden der Periode ihres wirksamen Simulationstags zugeordnet (D-0129).

**V1-Prototyp-Operationalisierung (T-0020):** Der nachfolgend beauftragte Browser-Prototyp erweitert den ursprünglichen D-0011-Kernkalender ausdrücklich: Er verwendet für 2027 konservativ die Vereinigungsmenge der im Prototyp hinterlegten deutschen gesetzlichen Feiertage, ohne einen einzelnen Bundesland-Standort zu behaupten. Diese Erweiterung gehört nur zum spielbaren Prototyp und ändert D-0011 nicht. Feiertage gelten dort als arbeitsfrei für Kapazität, Wochenend-/Feiertagsverschiebung und F3-Arbeitstage. Innerhalb der Produktionsphase kann ein gerade abgeschlossener Arbeitsgang den nächsten abhängigen Arbeitsgang noch am selben Simulationstag freigeben; er wird fortgesetzt, wenn qualifizierte Beschäftigten- und CNC-Restkapazität vorhanden ist. Es gibt keine Rückkehr in eine bereits abgeschlossene Phase. Der Tages- und Finanzzustand bleibt im Engine-/Finance-Modul getrennt.

**F3-Abnahme (D-0011):** Nach vollständiger Lieferung beginnt die Frist am folgenden Kalendertag; der Liefertag zählt nicht. Gezählt werden fünf Arbeitstage Montag bis Freitag, Feiertage bleiben unberücksichtigt. Eine Wochenendfälligkeit wird auf den nächsten Arbeitstag verschoben. Eine ausdrückliche Abnahme innerhalb der Frist setzt den Abnahmetag. Eine fristgerechte ausdrückliche Ablehnung verhindert automatische Abnahme und Rechnungsstellung und setzt `ABLEHNUNG_IN_KLÄRUNG`; die Auflösung bleibt offen. Ohne rechtzeitige Ablehnung wird nach Ablauf des fünften gezählten Arbeitstags `AcceptanceAutomaticallyGranted` in Phase 6 ausgelöst. D-0011 und CP-0033 bestätigen den Kalender und die Zählweise.

**Zahlungsrichtungen (getrennte Abläufe):**

- **Kundenzahlung an das Unternehmen / Forderungseingang:** Gemäß D-0110 erfolgt am vertraglichen Fälligkeitstag der vollständige Zahlungseingang, sofern kein ausdrücklich festgelegtes Verspätungsereignis greift. Der Bankbestand des eigenen Unternehmens wird dafür nicht geprüft. Eingang und eigene Auszahlungen liegen in Phase 8; nach D-0120 werden am selben wirksamen Tag zunächst alle fälligen Kundeneingänge gebucht und danach eigene Vollzahlungsversuche in Spielerreihenfolge ausgeführt, jeweils mit dem bestätigten Cash-Gate. Der Eingang reduziert/schließt die Forderung und erhöht Liquidität; er ist keine neue Erlösbuchung.
- **Eigene Lieferanten-/Gläubigerzahlung / Verbindlichkeitenausgang:** Die Fälligkeit löst am Fälligkeitstag einen automatischen Vollzahlungsversuch aus. Der Spieler bestimmt gemäß D-0021 die Reihenfolge seiner fälligen eigenen Rechnungen; diese Wahl bestimmt nicht die Reihenfolge gegenüber Kundeneingängen. Bei ausreichender verfügbarer Liquidität wird der betreffende offene Posten vollständig bezahlt und geschlossen. Bei unzureichender Liquidität kann der Spieler gemäß D-0125 exakt den Fehlbetrag aus dem freien Dispositionskreditrahmen ziehen. Reicht der freie Rahmen nicht aus oder lehnt der Spieler ab, gibt es keine Teilzahlung, keine negative Liquidität und keine Cashbewegung; der volle OP bleibt offen. Es folgen acht wöchentliche Retry-Versuche nach dem ersten Fehlschlag (Niederlage nach dem achten erfolglosen Retry), eine Zahlungserinnerung 10 Kalendertage nach dem ersten Fehlschlag und eine formelle Mahnung weitere 14 Kalendertage später, sofern weiter offen (D-0024–29). Nach der allgemeinen Mahnung gibt es in V1 keine Pfändung/Liquidation. A02 verarbeitet die von A03 autoritativ gelieferten Finanzresultate und mutiert keine Finanzsalden.

Phase 8 verarbeitet vertraglich fällige Kundeneingänge, eigene Vollzahlungsversuche, Retry- und Darlehenszahlungen sowie fällige Mahnereignisse. Der konkrete Ereignistag folgt der vereinbarten Kalenderfrist; fällt ein geplanter Ereignistag auf ein Wochenende, wird er nach D-0011 auf den nächsten Arbeitstag verschoben. Die Intervalle für Zahlungsziele bleiben Kalendertage; Retry-Frequenz bleibt wöchentlich; Mahnfristen betragen 10 und weitere 14 Kalendertage. Feiertage werden nicht berücksichtigt. Die verschobene Ausführung erhält den wirksamen Simulationstag; Rückdatierung findet nicht statt. Eine Verschiebung in einen Folgemonat wird der Periode ihres wirksamen Simulationstags zugeordnet; Rückdatierung auf den ursprünglich geplanten Termin findet nicht statt (D-0129).\n\nFür eigene fällige Rechnungen wählt der Spieler gemäß D-0021 die Reihenfolge; das ist eine Rangfolge innerhalb der eigenen Auszahlungen und keine Priorität gegenüber Kundeneingängen. Der Dispositionskredit ist eine angebotene Option und wird nicht automatisch gezogen. Nach D-0123/24 wird sein Höchstbetrag aus 10 % der Bilanzsumme zum Ende des Vorquartals berechnet und gilt ab dem ersten Tag des Folgequartals. Zum Start am 01.01.2027 beträgt er 4.671,42 € auf Basis der D-0128-Eröffnungsbilanzsumme von 46.714,20 €. Bei unterdecktem Zahlungsvorgang kann der Spieler nach D-0125 manuell exakt den Fehlbetrag ziehen, sofern der freie Rahmen ausreicht; automatischer Draw ist ausgeschlossen. Nach D-0127 wird der Zins täglich auf dem gezogenen Saldo berechnet und am Monatsende einmal als Sammelposten belastet; Die V1-Konvention ist Actual/365 ohne Tagesrundung und mit einmaliger Cent-Rundung der Monatsgesamtsumme; Rückführung erfolgt automatisch nur aus Kundeneingängen gemäß D-0126; der ungezogene Rahmen ist kein Cash. Nach D-0120 werden alle Kundeneingänge zuerst verarbeitet; gemäß D-0126 tilgen sie zunächst eine bestehende Disposchuld bis maximal zur Höhe des Eingangs. Nur ein Rest erhöht die freie Liquidität vor den eigenen Zahlungsversuchen. Bei Finanzereignissen desselben wirksamen Tages gilt als V1-Konvention: Kundeneingänge samt Disporückführung zuerst (D-0120/26), danach die vertragliche Maschinenrate, danach eigene Lieferanten-/sonstige Vollzahlungsversuche in Spielerreihenfolge; nach dem Zahlungsversuch wird der offene Postenstatus aktualisiert und eine an diesem Tag fällige Erinnerung/Mahnung nur ausgelöst, wenn die Forderung weiter offen ist. Darlehensverwertung richtet sich nach drei verschiedenen fälligen, weiterhin unbezahlten Monatsraten gemäß D-0042/43. A03 ist autoritativ für Erfolg, OP- und Liquiditätswirkung; A02 ordnet die Vorgänge in die Tagesphasen ein.

**Auftragszustände:** Operative Erfüllung, Rechnungsstatus und finanzieller Ausgleich sind getrennte Statusdimensionen. Vollständige Produktion, Lieferung und Abnahme erfüllen den Auftrag operativ. Rechnung erstellt heißt abgerechnet, nicht bezahlt. `ABGESCHLOSSEN` gemäß G3 wird erst gesetzt, wenn die vollständige Kundenforderung des Auftrags bezahlt ist; Lieferantenverbindlichkeiten blockieren diesen Kundenauftrag nicht. Überfälligkeit/Mahnung ändert keinen bereits erfüllten Produktions- oder Lieferstatus. Eine Ablehnung führt in Klärung und hält Abnahme/Rechnung an.

**Kapazität (D-0011):** Die drei Beschäftigten haben getrennte Kapazitätspools zu je 8 Stunden pro Arbeitstag Montag bis Freitag (40 Stunden/Woche); die CNC-Maschine hat 8 operative Produktionsstunden je Arbeitstag (40 Stunden/Woche). Samstage, Sonntage und Feiertage in V1 sind keine Kapazitätstage. A02-Startprofilzuordnung: `MA-CNC` bedient Arbeitsgänge 20 und 30; `MA-PROD` bedient 10 und 40; `MA-AV` stellt je Auftrag die unten aufgeführte Planungszeit bereit. Keine Überstunden-, Ausfall- oder Urlaubsmechanik wird ergänzt.

**Periodenende:** Am Monatsletzten werden zuerst die Tagesphasen 1–9 abgeschlossen, danach werden periodische Kosten/BAB-Ereignisse für die Periode ausgelöst. Ein am Wochenende verschobenes Ereignis erhält den nächsten Arbeitstag als wirksames Simulationsdatum und wird nicht auf den ursprünglich geplanten Tag zurückdatiert. Fällt dieser wirksame Tag in einen Folgemonat, wird er diesem Folgemonat zugeordnet; die V1-Kalenderjahresgrenze und Korrekturregeln aus D-0117–19 bleiben davon unberührt.

## A1. Deterministisches Startauftragsprofil (A02-Szenariowerte)

Alle drei Aufträge sind zum Simulationsstart 01.01.2027 im Zustand `BESTÄTIGT`; kein Arbeitsgang ist begonnen oder abgeschlossen. Die für sie nötigen Materialmengen sind im Anfangsbestand vollständig reserviert, aber noch nicht verbraucht. `K-01` bis `K-03` sind profilinterne stabile Kundenreferenzen, keine Behauptung über die noch fehlenden Kundennamen. Mengen sind vollständige Auftragsmengen; keine Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung. Termine sind zugesagte vollständige Liefertermine, nicht garantierte Fertigstellungsergebnisse.

| ID | Profil / Kunde | Auftragsmenge | Vollständiger Liefertermin | Planungszeit MA-AV |
|---|---|---:|---|---:|
| `ORD-START-01` | Großer Serienauftrag / `K-01` | 20 Teile | 29.01.2027 | 5 h |
| `ORD-START-02` | Mittlerer Auftrag / `K-02` | 8 Teile | 22.01.2027 | 3 h |
| `ORD-START-03` | Kleiner technisch anspruchsvoller Auftrag / `K-03` | 2 Teile | 15.01.2027 | 2 h |

Diese Mengen und Termine sind einzeln austauschbare Fixture-Werte für den Startzustand. Vollständige Kundenbezeichnungen, Spezifikation/Zeichnungsrevision, Verkaufspreis, Zahlungsziel, Rechnungs-/Eröffnungsbezug und reale Lieferverbindlichkeit müssen im kanonischen Unternehmensprofil ergänzt werden; sie werden hier nicht erfunden.

### Norm-/Zukaufteile: artikelbezogenes V1-Startprofil (T-0010)

Die bestätigten Startaufträge verwenden nur den Schraubenartikel aus dem Startbestand. Weitere Artikel sind Stammdaten-/Preisreferenzen und werden nicht als Bestand, Einkaufsauftrag, Verbrauch oder Kosten gebucht, solange kein konkreter V1-Auftrag sie verwendet. D-0128 ist die alleinige bestätigte Preisbasis für Startbestand und drei Start-BOMs; andere Artikelpreise bleiben A08-Recherchevorschläge.

| Artikelcode | Artikel / Typ | Einheit | Anfangsmenge | Verbrauch ORD-START-01 / 02 / 03 | Preisstatus |
|---|---|---:|---:|---:|---|
| SCR-DIN933-M10X30-10.9 | DIN 933 Schraube M10×30, 10.9; Lager-/Normteil | Stück | 60 | 40 / 12 / 4 | 0,57 €/Stück netto; D-0128 |
| NUT-DIN934-M10-8 | DIN 934 Mutter M10, 8; Normteil | Stück | 0 | 0 / 0 / 0 | ca. 0,09 €/Stück netto; Vorschlag T-0011 |
| BEA-6204-2RS | Rillenkugellager 6204-2RS; Fremdhersteller-Zukaufteil | Stück | 0 | 0 / 0 / 0 | 1,90 €/Stück netto; Vorschlag T-0011 |
| CYL-ISO6432-16X100 | Pneumatikzylinder ISO 6432, Ø16 × 100 mm; Fremdhersteller-Zukaufteil | Stück | 0 | 0 / 0 / 0 | 37,50 €/Stück netto; Vorschlag T-0011 |
| SEAL-NBR70-20X2 | O-Ring NBR 70 Shore, 20 × 2 mm; Norm-/Zukaufteil | Stück | 0 | 0 / 0 / 0 | ca. 0,09 €/Stück netto; Vorschlag T-0011 |

D-0095 umfasst zusätzlich Schmierstoffe, Fracht, Strom, Wasser/Abwasser, Energieträger, Kunststoffe, Telekommunikation, Schneidwerkzeuge, Kühlschmierstoffe, Schleifmittel, Verbindungselemente, Hydraulik/Pneumatik, Antriebskomponenten, Lager/Wellen, Dichtungen, Schweißmittel/Gase, Verpackung, Beschichtung, Wartung/Ersatzteile, Reinigungsstoffe, PSA sowie Entsorgung. Diese Gruppen sind je nach Leistung Verbrauchsartikel, Dienstleistung oder laufende Versorgungs-/Gebührenposition; sie werden nicht pauschal als Lagerbestand oder BOM-Verbrauch behandelt. Details und Quellen stehen im A08-Referenzscan (../market-data/a08-t0011-markt-referenzscan-2026-10-27.md). Der aktuelle Startbedarf der drei Aufträge ist durch D-0128 vollständig gedeckt.

### Übriger fester Unternehmensstart

| Bereich | Festgelegter A02-Startwert | Noch nicht daraus ableiten |
|---|---|---|
| Stichtag | 01.01.2027 | lokaler Feiertags-/Betriebskalender |
| Betrieb | bestehendes Maschinenbauunternehmen, gemietete Betriebsfläche | Rechtsform, Miete und Nebenkostenbeträge |
| Finanzierung | 50.000 € Gesamtfinanzierungs-/Budgetrahmen: 30.000 € Anfangsliquidität und 20.000 € verbleibender Rahmen | Verfügbarkeit des Restbetrags als Kredit/Cash; keine automatische Auszahlung |
| Maschine `CNC-01` | gebrauchte CNC-Fräsmaschine, Anschaffung 01.01.2019, ursprüngliche Anschaffungskosten 120.000 €, Eröffnungsbuchwert 0 € gemäß D-0099; höchstens 1.600 operative h/Jahr und 40 operative h/Woche | Wartungs-, Ausfall- oder Stundensatz (A03/weitere Regeln) |
| `MA-CNC` | CNC-Fachkraft, 3.800 € brutto/Monat, 40 h/Woche | Arbeitgeber-Gesamtkosten, Arbeitstage/-stunden je Tag, Urlaub/Ausfall |
| `MA-PROD` | Produktionsmitarbeiter, 3.100 € brutto/Monat, 40 h/Woche | Arbeitgeber-Gesamtkosten, Arbeitstage/-stunden je Tag, Urlaub/Ausfall |
| `MA-AV` | kaufmännisch/Arbeitsvorbereitung, 3.500 € brutto/Monat, 40 h/Woche | Arbeitgeber-Gesamtkosten, administrative Arbeit außerhalb der gelisteten Auftragsplanung |
| Materialmengen und Preisbasis (D-0128) | Stahl 2.000 kg × 1,63 €/kg; Aluminium 100 kg × 9,20 €/kg; 60 Referenzschrauben DIN 933 10.9 M10×30 × 0,57 €/St.; zusammen 4.214,20 € | Datierte Händlerreferenz- und V1-Szenariopreise, keine Einkaufsbelege oder prüfungsfähige HGB-Eröffnungsbewertung; Quellen siehe Preisbasis-Dokument |
| Offene Posten | Forderungen 12.500 €; Lieferantenverbindlichkeiten 7.500 € | Einzelbelege, Parteien, Auftrag, Leistungs-/Rechnungsdatum und Fälligkeit |

Damit bleiben Restbudget und tatsächlicher Zahlungsmittelbestand explizit getrennt. Die drei Startaufträge und ihr Materialbedarf sind zusätzliche operative Anfangswerte; A03 verantwortet Bewertungs-, Steuer-, Eröffnungs- und Liquiditätsbehandlung.

**Accounting-Wertübergabe:** D-0128 setzt für den V1-Szenariostart die Händlerreferenzpreise aus dem [Materialpreis-Basisstand](../market-data/material-price-baseline-2026-10-27.md) an. Der Startwert beträgt 4.214,20 €; die drei Startaufträge sind mit Beständen von 2.000 kg Stahl, 100 kg Aluminium und 60 Normteilen vollständig abdeckbar. Der zuvor bestätigte aggregierte Bilanzwert von 12.800 € und der Vorjahresschluss-Übergabepfad D-0091 werden für diesen Prototypstand ausdrücklich durch die spätere Nutzerentscheidung ersetzt. Dies ist eine V1-Modellvereinfachung; tatsächliche Anschaffungskosten/HGB-Nachweise sind nicht vorhanden.

### Standardarbeitsgänge und Auftragslast

Arbeitsgänge werden pro Auftrag in aufsteigender Reihenfolge abgeschlossen. Aufwände sind volle Arbeitsstunden für den gesamten Auftrag; Arbeit darf zeitlich über mehrere Tage/Wochen fortschreiten, aber es entstehen keine fertigen Teilmengen. Maschinenstunden fallen ausschließlich bei Arbeitsgang 20 an. Der CNC-Mitarbeiter führt 20 und anschließend 30 aus; der Produktionsmitarbeiter führt 10 und 40 aus. Die MA-AV-Planungsstunden sind ein eigener Personalaufwand, nicht Maschinenzeit.

| Nr. | Arbeitsgang | Ressource | ORD-START-01: 20 St. | ORD-START-02: 8 St. | ORD-START-03: 2 St. |
|---:|---|---|---:|---:|---:|
| 10 | Materialbereitstellung | `MA-PROD` | 12 h | 5 h | 4 h |
| 20 | CNC-Fräsen | `MA-CNC` + CNC-Maschine | 60 Personal-h / 60 Maschinen-h | 24 / 24 | 10 / 10 |
| 30 | Qualitätskontrolle | `MA-CNC` | 16 h | 6 h | 6 h |
| 40 | Verpackung/Versand | `MA-PROD` | 10 h | 4 h | 3 h |

| Auftrag | Stahl | Aluminium | Referenzschrauben (V1-Proxy für Norm-/Zukaufteile) |
|---|---:|---:|---:|
| `ORD-START-01` | 120 kg | 60 kg | 40 Stück |
| `ORD-START-02` | 40 kg | 20 kg | 12 Stück |
| `ORD-START-03` | 12 kg | 10 kg | 4 Stück |
| **Gesamtbedarf** | **172 kg** | **90 kg** | **56 Stück** |
| **Eröffnungsbestand** | **2.000 kg** | **100 kg** | **60 Stück** |
| **Rest nach Auftragsreservierung** | **1.828 kg** | **10 kg** | **4 Stück** |

Materialbedarf ist die vollständige Auftragsstückliste für dieses Szenario. Bei Auftragsannahme wird diese Menge reserviert; bei Abschluss von Arbeitsgang 10 wird sie als vollständiger Verbrauch an A03 gemeldet. Reservierung verändert noch nicht den bewerteten Verbrauch. Die Bewertung und der Verbrauchswert folgen A03s E3-Regel. Fehlt Material, blockiert der Auftrag vor Arbeitsgang 10; Teillose sind nicht zulässig.

### Ressourcenprofil und deterministische Reihenfolge

| Profilressource | Kapazität je Woche | Zulässige Startprofil-Arbeitsgänge | Auftragslast gesamt |
|---|---:|---|---:|
| `MA-CNC` – CNC-Fachkraft | 40 h | 20: 94 h; 30: 28 h | 122 h |
| `MA-PROD` – Produktionsmitarbeiter | 40 h | 10: 21 h; 40: 17 h | 38 h |
| `MA-AV` – kaufmännisch/Arbeitsvorbereitung | 40 h | Auftragsplanung (separat, nicht Fertigung) | 10 h |
| `CNC-01` – gebrauchte CNC-Fräsmaschine | 40 operative h | 20: 94 h | 94 h |

Die Gesamtlasten überschreiten die Wochenkapazitäten nicht als Profilfehler, sondern laufen über mehrere Wochen; Maschinenstunden und CNC-Fachkraftstunden werden jeweils eigenständig limitiert. Die CNC bleibt zusätzlich auf höchstens 1.600 operative Maschinenstunden pro Jahr begrenzt (Startprofilwert); 40 h/Woche ist eine Wochenobergrenze, kein Anspruch auf 52 volle Produktionswochen. Ein Auftrag erhält Kapazität nur für seinen aktuell nächsten Arbeitsgang. Default-Dispatch der drei Startaufträge: aufsteigender bestätigter Liefertermin, Gleichstand über stabile Auftrags-ID; Spielerpriorisierung bleibt als ausdrücklich erfasster Command möglich und hat ab ihrem Wirksamkeitsdatum Vorrang. Diese Voreinstellung beschreibt nur den Startprofil-Lauf. Es wird nicht vorausgesetzt, dass Zusagetermin bei Engpass gehalten wird; die Simulation zeigt prognostizierte Verzögerung, während der zugesagte Termin erhalten bleibt.

Damit ist die Auftrags-/Ressourcenlast reproduzierbar, aber die exakten Fertigstellungs-/Lieferdaten bei Kapazitätsverbrauch sind nicht aus Wochenwerten allein ableitbar. Dafür fehlen noch Arbeitskalender und Verteilung der Wochenstunden auf Tage. Termine in der obigen Tabelle sind deshalb profilierte Verpflichtungen, nicht berechnete Zusagen der Engine.


## A. Auftragslebenszyklus

| Prozess | Eingabe und Spielerentscheidung | Ereignis / Zustand | Wirtschaftliche Wirkung | Daten und Folge |
|---|---|---|---|---|
| Kundenanfrage | Kunde, Bauteil/Umfang, Menge, Spezifikation, Termin; bearbeiten/ablehnen | `CustomerRequestReceived`; Anfrage `OFFEN` | Noch keine realisierte Wirkung | Kunden-ID, Spezifikation, Menge, Termin → Kalkulation |
| Kalkulation | Stückliste/Arbeitsgänge, Bedarf, Kapazität, Lieferantenpreise; Annahmen prüfen | `QuoteCalculated`; `KALKULIERT` | Schätzkosten und erwartete Marge, noch keine Buchung | Kostenpositionen und Regelversion → Angebot |
| Angebot | Preis, Umfang, Liefer-/Zahlungskonditionen, Gültigkeit; senden/ändern/zurückziehen | `QuoteIssued`; `ANGEBOTEN` | Erwarteter Erlös/Ergebnis, kein realisierter Umsatz | Angebotsversion, Betrag, Termin → Annahme/Ablehnung/Ablauf |
| Auftrag | Kundenannahme; Machbarkeit und Bestätigung entscheiden | `OrderAccepted`; `BESTÄTIGT` | Erwartete Erlöse/Kosten; Bedarf und ggf. Kapazität reserviert | Kunde, Positionen, Preis, Termin → Beschaffung/Produktion |
| Beschaffung | Materialbedarf, Bestand, Lieferantenpreis/-zeit; Lieferant/Menge/Bestellung wählen | `PurchaseOrderPlaced`; `BESTELLT` | Erwartete Kosten und späterer Abfluss/Verbindlichkeit, A03 legt Zeitpunkt fest | Lieferant, Material, Menge, Preis, Datum, Zahlungsziel → Wareneingang |
| Eingang/Fremdleistung | Bestellung, Liefermenge/Qualität/Leistungsnachweis; annehmen | `GoodsReceived` / `SubcontractedServiceAccepted`; Bestand/Bedarf aktualisiert | Mögliche Verbindlichkeit/Kosten an A03 melden | Menge, Preis, Datum, Referenz → Produktion |
| Produktion | Auftrag, Material, Arbeits-/Maschinenkapazität; starten, fortführen, priorisieren | `ProductionStarted`, `WorkProgressed`, `ProductionCompleted`; `IN_BEARBEITUNG`→`FERTIG` | Ist-Verbrauch von Material/Arbeitszeit/Maschinen/Energie wird Auftrag zugerechnet; Finanzverarbeitung A03 | Arbeitsgänge, Mengen/Stunden, Dauer, Kapazität → Lieferung |
| Lieferung | Vollständige Fertigmenge, Termin, Transportnachweis | `OrderFullyDelivered`; `GELIEFERT/ABNAHME_AUSSTEHEND` | Vollständige Leistung an A03 melden | volle Menge, Lieferdatum, F3-Fristende → Abnahme |
| Abnahme | ausdrückliche Abnahme/Ablehnung oder Fristablauf | `AcceptanceGranted`, `AcceptanceRejected`, `AcceptanceAutomaticallyGranted` | Positive Abnahme macht Rechnung zulässig; Ablehnung hält Rechnung an | Entscheidung/Fristdatum und Beleg → Rechnung oder Klärung |
| Rechnung | positive Abnahme, vollständiger Auftragspreis | automatische einmalige `CustomerInvoiceIssued`; `ABGERECHNET` | A03 verarbeitet Forderung/Erlös | volle Menge, Betrag, Rechnungsdatum, Leistungs-/Abnahmebezug, Ziel |
| Kundenzahlungseingang | Kundenverhalten löst fällige Zahlung aus; eigener Kontostand ohne Einfluss | `CustomerPaymentTriggered` → `CustomerPaymentReceived`; Forderung wird reduziert/geschlossen | Voller Eingang erhöht tatsächliche Liquidität; keine eigene Cash-Prüfung vor Eingang | Kunde, Forderung/Rechnung, voller Betrag, Auslösegrund und tatsächliches Datum |
| Eigene Lieferantenzahlung | Verbindlichkeit erreicht Fälligkeit | `SupplierPaymentAttempted` → `SupplierPaymentMade` oder `SupplierPaymentFailedInsufficientLiquidity`; bei Fehlschlag Übergabe in bestätigten Mahnfluss | Nur erfolgreiche volle Zahlung vermindert Liquidität und schließt OP; Fehlschlag lässt vollen OP und Cash unverändert | Lieferant/Gläubiger, OP/Beleg, voller Versuchsbetrag, Fälligkeit, Versuchsergebnis und tatsächliches Zahlungsdatum nur bei Erfolg |
| Auftragsergebnis | Kalkulation, Istkosten, fakturierter Erlös, offene Posten | operative Erfüllung separat von `ABGESCHLOSSEN` nach G3 | Soll-Ist-Abweichung; A03 liefert autoritative Finanzsicht | Kalkulationsversion, Istkosten, Liefer-/Abnahme-/Rechnungs-/Zahlungsstatus |

**Minimale Kette:** Anfrage → Kalkulation → Angebot → Annahme/Auftrag → Bedarf/Beschaffung → Eingang → Arbeitsgänge 10–40 → vollständige Lieferung → ausdrückliche/F3-automatische Abnahme → automatische Vollrechnung → Fälligkeit/Zahlung oder Mahnprozess → Ergebnis. Ablehnung innerhalb der F3-Frist führt in `ABLEHNUNG_IN_KLÄRUNG`; genaue Behebung ist offen. Angebot bindet noch keine Produktion; Bestellung, Eingang, Leistung, Rechnung und Zahlung sind getrennte Vorgänge.

## B. Spielerentscheidungen

**Zwingend:** Anfrage bearbeiten/ablehnen; Kalkulationsannahmen prüfen; Preis und Liefer-/Zahlungskonditionen festlegen; Angebot senden/verwerfen; Auftrag nach Machbarkeitsprüfung bestätigen; Lieferant/Menge und Bestellung auswählen; Auftrag bei verfügbarer Ressource starten/fortsetzen; bei Engpass warten/priorisieren; Fertigstellung/Lieferung freigeben; Rechnung auslösen; Soll-Ist-Ergebnis ansehen.

**Optional im MVP:** Auswahl zwischen Lieferanten nach Preis und Termin (wenn mehrere existieren); einfacher Sicherheitsaufschlag; Auftragspriorität; begrenzte Reaktion auf überfällige Zahlung. Die V1-Auftragsabwicklung erfolgt vollständig; Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind ausgeschlossen. Überstunden/Zusatzkapazität erst nach Scope-/A03-Abstimmung.

**Später:** Unternehmensgründung, komplexe Personal-/Schichtplanung, Investitionsfinanzierung, strategische Beschaffung, Lieferkettenmanagement, Scheduling-Optimierung, Qualitätsmanagement, Steuern/komplexe Buchhaltung, weitere Branchen/Rechtsformen, IHK-Lernen.

## C–E. Events, Zustände, Zeit und Unternehmen

**Events:** `CustomerRequestReceived`, `RequestDeclined/Expired`, `QuoteCalculated`, `QuoteIssued/Revised/Accepted/Rejected/Expired/Withdrawn`, `OrderAccepted/Cancelled`, `MaterialRequirementIdentified`, `CapacityShortageDetected`, `PurchaseOrderPlaced`, `SupplierDeliveryDelayed`, `GoodsReceived/Rejected`, `SubcontractedServiceAccepted`, `ProductionScheduled/Started/Blocked/Completed`, `WorkProgressed`, `MaterialConsumed`, `CapacityConsumed`, `OrderDelivered`, `DeliveryAccepted`, `CustomerInvoiceIssued`, `SupplierInvoiceReceived`, `CustomerPaymentTriggered`, `CustomerPaymentReceived`, `SupplierPaymentAttempted`, `SupplierPaymentMade`, `SupplierPaymentFailedInsufficientLiquidity`, `PaymentOverdue`, `PaymentReminderIssued`, `DunningNoticeIssued`, `SeizureOrLiquidationTriggered`, `OrderResultCalculated`, `OrderClosed`. Die differenzierten Ereignisnamen beschreiben fachliche Tatsachen, keine Schemafreigabe. Events sind keine Buchungen und mutieren keinen A02-seitigen Ledger.

**P0-konkrete Produktions-/Abnahmeevents:** Je Auftrag `OperationStarted/Completed` mit Arbeitsgang-ID 10/20/30/40; Material wird bei vollständigem Abschluss von Arbeitsgang 10 ausgegeben; `OrderFullyProduced` folgt erst nach Arbeitsgang 40. Vollständige Lieferung löst `OrderFullyDelivered` und `AcceptanceDeadlineSet(delivery_date + 5 workdays)` aus. Rechtzeitige Ablehnung erzeugt `AcceptanceRejected` und `ABLEHNUNG_IN_KLÄRUNG`; sonst erzeugt Fristablauf `AcceptanceAutomaticallyGranted`. Explizite Annahme erzeugt `AcceptanceGranted`. Beide positiven Abnahmeereignisse machen den Auftrag in der anschließenden Tagesphase rechnungsfähig; `CustomerInvoiceIssued` wird automatisch genau einmal mit voller Auftragsmenge ausgelöst. Ein bestätigter Abnahmezustand ist nicht selbst die Rechnung oder Forderungsbuchung.

**Auftragszustände:** `ANGEFRAGT → KALKULIERT → ANGEBOTEN → BESTÄTIGT → IN_BEARBEITUNG → FERTIG → GELIEFERT → ABNAHME_AUSSTEHEND → ABGENOMMEN → ABGERECHNET → ABGESCHLOSSEN`. Alternativ: Anfrage `ABGELEHNT/ABGELAUFEN`; Angebot `ABGELEHNT/ABGELAUFEN/ZURÜCKGEZOGEN`; Arbeitsauftrag `BLOCKIERT_MATERIAL/BLOCKIERT_KAPAZITÄT`; nach rechtzeitiger Kundenablehnung `ABLEHNUNG_IN_KLÄRUNG`. Diese lineare Anzeige ist eine Projektion; maßgeblich sind getrennte Produktions-, Liefer-/Abnahme-, Rechnungs- und Zahlungszustände. G3 setzt `ABGESCHLOSSEN` erst bei vollständiger Zahlung der Kundenforderung. Lieferantenverbindlichkeiten blockieren nicht.

Begleitende Zustände mindestens: Produktionsauftrag `OFFEN/ARBEITSGANG_10/ARBEITSGANG_20/ARBEITSGANG_30/ARBEITSGANG_40/FERTIG/BLOCKIERT`; Abnahme `FRIST_LÄUFT/ABGENOMMEN/AUTOMATISCH_ABGENOMMEN/ABLEHNUNG_IN_KLÄRUNG`; Rechnung `NICHT_RECHNUNGSFÄHIG/RECHNUNGSFÄHIG/GESTELLT`; Kundenforderung `OFFEN/FÄLLIG/ZAHLUNG_AUSGELÖST/BEZAHLT/ÜBERFÄLLIG`; eigene Verbindlichkeit `OFFEN/FÄLLIG/VOLLZAHLUNG_VERSUCHT/ZAHLUNG_AUSGEFÜHRT/ZAHLUNG_FEHLGESCHLAGEN/IM_MAHNPROZESS`. Ein fehlgeschlagener Auszahlungsversuch ändert weder den vollen OP-Betrag noch die Liquidität; ein Kundenzahlungseingang setzt keine Prüfung eigener Liquidität voraus. Bestellung bleibt separat. Teilstatus für Mengen, Lieferung, Rechnung oder Zahlung gehören nicht zum MVP. Diese Statusworte beschreiben fachliche Unterscheidungen, keine Schemafreigabe.

**Unternehmenszustände:** verfügbare/reservierte/belegte Maschinen- und Arbeitskapazität; Materialbestand (Anfang + Eingänge − Verbrauch); Auftragsbestand und Fälligkeiten; offene Beschaffungen; Finanzstatus (Liquidität, Vermögen, Forderungen, Verbindlichkeiten, Kosten/Erlöse) ausschließlich aus A03. Warnzustände „arbeitsfähig/eingeschränkt/zahlungsgefährdet“ sind denkbar, aber Schwellen/Folgen `OPEN`; keine Insolvenz-/Kreditautomatik definieren.

**Zeit und Phasen:** D-0011/CP-0033 bestimmen den Wochenkalender, Wochenendverschiebungen und F3; Tagesphasenfolge und Same-Day-Abhängigkeiten stehen oben. Finanzereignisse werden Phase 8 zugeordnet. Kundeneingang am Fälligkeitstag erfolgt ohne eigenes Cash-Gate (D-0110); eigene Forderungen werden gemäß Spielerwahl der Reihenfolge voll versucht (D-0021–29). D-0120 legt Kundeneingänge vor eigenen Zahlungsversuchen bei knapper Liquidität fest. Offen bleiben die intratägliche Reihenfolge zusammenfallender Retry-/Erinnerungs-/Mahnereignisse und die Periodenzuordnung eines wirksam in den Folgemonat verschobenen Ereignisses. Für den V1-Prototyp werden nicht bezahlte Maschinenraten wöchentlich voll wiederholt; bei drei gleichzeitig offenen Monatsraten erfolgt die Verwertung nach D-0042/43 und D-0048–52. Darlehensfälligkeit: jeweils letzter Arbeitstag des Monats, für Januar 2027 der 29.01.2027 (D-0033); D-0121/22 bestimmen den ersten Termin auf den 29.01.2027 und die Rate auf 339,21 €; nach 83 Raten folgt im Dezember 2033 die Schlussrate von 339,57 €.\n\nVerschobene Ereignisse verwenden den nächsten Arbeitstag als wirksamen Simulationstag. Der Monat dieses wirksamen Tags ist klar; offen bleibt, ob Auswertungs-/Buchungszuordnung bei Monatsgrenzen daran oder am ursprünglich geplanten Datum hängt. Feiertage werden in V1 nicht berücksichtigt. Seed ist nur erforderlich, falls später Zufallsereignisse beschlossen werden.

## F. Auftragskalkulation

Nur Schätzung für Verkaufsentscheidung, keine Vollkostenrechnung. Kalkulation versioniert Mengen und Annahmen.

`K_direct = Material + Fremdleistungen + Arbeitsleistung + Maschinen/Anlagen + Energie + Transport + sonstige direkt auftragsbezogene Kosten`

- Material: benötigte Menge × geplanter Einstandspreis; Material aus Bestand erhält kalkulatorischen Verbrauchswert (Bewertung A03).
- Fremdleistung: geplante Menge/Leistung × Einkaufspreis.
- Arbeit: geschätzte Stunden × einfacher interner Kostensatz; keine Lohnabrechnung.
- Maschine: Maschinenstunden × einfacher Satz; keine Einzelabschreibung/Wartungsrechnung.
- Energie: geschätzte Menge oder Maschinenstunden × Satz.
- Transport: Ein- und Ausgangsfracht als direkte Auftragskosten.
- Sonstige: begrenzte manuelle Position mit Beschreibung/Betrag.

Einfacher Gemeinkostenzuschlag ist optional: pauschaler Betrag **oder** Prozentsatz einer Bemessungsbasis. Methode und Satz `OPEN` (A03/User). Keine Kostenstellen-/Verteilungsschlüssel.

`Kalkulatorisches Auftragsergebnis = Netto-Verkaufspreis − direkte Kosten − angesetzte Gemeinkosten`. Preis setzt der Spieler. Netto/Brutto- und Umsatzsteuerbehandlung `OPEN` bei A03; bis dahin nicht als steuerlich korrekt ausgeben. Istkosten beruhen auf tatsächlichem Ressourcenverbrauch; `Abweichung = Istkosten − kalkulierte Kosten`. Kalkulatorische Marge und realisierte A03-Finanzsicht getrennt anzeigen.

## G. Beschaffung und H. Produktion

**Beschaffung:** (1) Nettobedarf = Auftragsbedarf minus frei verfügbarer Bestand und rechtzeitig eintreffende Bestellungen. (2) Minimal mindestens ein Lieferant; wenn mehrere vorhanden, Preis/Lieferzeit vergleichen. (3) Spieler bestätigt Material, Menge, Preis, Liefertermin, Zahlungsziel; `PurchaseOrderPlaced` erzeugt offene Bestellung. Ob Bestellung bereits eine Verbindlichkeit oder erst Eingang/Rechnung auslöst, entscheidet A03. (4) Wareneingang/Fremdleistung aktualisiert Material bzw. Erfüllungsstatus; Istmenge/Preis/Datum/Beleg an A03. (5) Fälligkeit/Zahlung an A03 melden; A03 definiert Buchung und Liquidität. (6) Verspätung blockiert/verschiebt betroffene Produktion und Liefertermin. Ersatzbeschaffung, Reklamations-, Vertragsstrafen- und Lieferkettenmanagementregeln sind nicht MVP bzw. `OPEN`.

**Produktion:** Für den aktuellen Startstand gelten die vier Standardarbeitsgänge und auftragsbezogenen Vollmengen/-stunden aus dem Startprofil oben. Arbeitsgangreihenfolge ist strikt 10→20→30→40. In einem aktiven Arbeitsgang wird an jedem Kalendertag verfügbare Stundenkapazität verbraucht; der Arbeitsgang wird erst nach Erreichen seiner vollen Stundenlast abgeschlossen, Reststunden laufen in Folgetage/-wochen weiter. Es gibt keine freigegebene Teilmenge und keinen Versand vor Abschluss von 40. Arbeitsgang 10 reserviert Bedarf; bei seinem vollständigen Abschluss meldet A02 die volle Materialausgabe/den Verbrauch. Ressourcenmangel blockiert den nächsten Arbeitsgang und wird transparent angezeigt. A02-Auftragsdaten enthalten geplante Mengen/Stunden und tatsächliche Wirksamkeitsdaten; A03 bewertet Aufwand und Kosten. Kein Losgrößen-/Schichtoptimierer, Ausschuss, Nacharbeit oder Wartungsmodell.

## I. Finanzielle Übergabepunkte an A03

| Simulationsereignis | A02-Wirkung | A03 mindestens übergeben |
|---|---|---|
| Auftrag bestätigt | erwarteter Erlös/Kosten, keine A02-Buchung | Kunde, Betrag, Leistung, Termine, Konditionen |
| Bestellung erteilt | erwarteter Abfluss/Zusage | Lieferant, Positionen, Menge, Preis, Datum, Ziel, Liefertermin |
| Wareneingang/Fremdleistung | Bestand/Leistung tatsächlich eingegangen | Istmenge, Preis, Datum, Beleg-/Bestellreferenz |
| Ressourcenverbrauch | Auftrag verbraucht Material-/Arbeits-/Maschinen-/Energieaufwand | Typ, Menge/Stunden, Satz/Bewertungsreferenz, Auftrag, Zeitraum |
| Lieferung/Abnahme | Leistung erfüllt, Rechnung kann folgen | Kunde, Auftrag, Menge, Leistungsdatum, Preisbezug, Fracht, Nachweis |
| Kunden-/Lieferantenrechnung | offene Forderung/Verbindlichkeit aus Simulation gemeldet | Betrag, Gegenpartei, Beleg-/Leistungsdatum, Fälligkeit, Referenz |
| Kundenzahlungseingang | durch Kundenverhalten ausgelöste volle Zahlung reduziert/schließt Forderung; eigene Liquidität wird nicht geprüft | Kunde, OP/Rechnung, voller Betrag, Trigger/Verspätungsgrund, tatsächliches Datum |
| Eigener Zahlungsversuch | volle Zahlung wird am Fälligkeitstag versucht; Erfolg oder Liquiditätsfehlschlag wird gemeldet | Gläubiger, OP/Rechnung, voller Versuchsbetrag, Fälligkeit, Erfolg/Fehlschlag; Zahlungsdatum nur bei Erfolg |
| laufende Kosten | wiederkehrende Kosten-/Zahlungsinformation | Art, Betrag, Intervall, Fälligkeit, Zeitraum |
| Auftragsergebnis | Soll-Ist-Bericht, keine zweite Finanzwahrheit | Referenzen auf Geschäftsvorfälle; A03 liefert autoritative Finanzsicht zurück |

A03 entscheidet Kategorien, Kontierung/Buchungen, Steuer-/USt.-Regeln, Forderungs-/Verbindlichkeitsentstehung, Materialbewertung, Cashflow und Finanz-Read-Models. A02 bestimmt nur Ereignis, Wirkung und Übergabedaten.

## J. Eröffnungszustand (Parameter, keine Werte erfinden)

- Unternehmen/Standort, Startzeitpunkt, Maschinenbau-Modul, Rechtsform (offen), Ausgangszeitpunkt.
- Liquidität je Zahlungsmittel, Vermögen, Forderungen, Verbindlichkeiten, ggf. Finanzierung/Eigenkapital mit Fälligkeiten (Finanzwahrheit A03).
- Maschinen/Anlagen: Typ, Kapazität je Zeitraum, Nutzbarkeit und einfacher Kostensatz.
- Material: Material-/Stücklistenbezug, Menge/frei verfügbar, ggf. Mindestbestand; Bewertung A03.
- Mitarbeiterkapazität je Qualifikation/Arbeitsgang und einfacher Satz, keine komplexen Beschäftigungsregeln.
- Laufende Kosten: Art, Betrag, Intervall, Fälligkeit/Zahlungsbedingung.
- Kunden mit minimalen Auftragsmerkmalen und Zahlungskonditionen; Lieferanten mit Material, Preis, Lieferzeit, Ziel.
- Offene Aufträge mit Status, Kunde, Termin, Bedarf/Kapazität und erledigten Prozessschritten.
- Offene Forderungen/Verbindlichkeiten mit Partei, Betrag, Bezug, Datum, Fälligkeit und Restbetrag.
- Simulationsregeln/Kostensätze/Zeitintervall; konkrete Werte bleiben User-/A03-Entscheidung.

## K. Tatsächliche Toolanalyse / L–R. Gap

Das Repository wurde auf `main` read-only geprüft. README hat nur Projekttitel/-untertitel. CP-0002 verzeichnet keine App-Logik, Frontend/Backend, Datenbank, Tests oder Dependencies. Der aktuelle sichtbare Wurzelbaum enthält weiterhin keine Simulationsquellcode-Ordner. Die Architektur V0.2 beschreibt fachliche Domänen, Commands/Events und Monatsablauf als Vorschlag und sagt ausdrücklich, dass diese Entwürfe keine Implementierung belegen. Daher ist keine Implementierung/Abhängigkeit über Quellcode/Tests nachvollziehbar.

Nur zulässige Bewertungen:

| Bestand | MVP-Anforderung | Bewertung | Begründung |
|---|---|---|---|
| Governance-/Architekturdokumente | Simulationsengine | NEU ENTWICKELN | kein Simulationscode nachweisbar; Entwurf nicht freigegeben |
| Zeit-/Periodenverarbeitung | Zeit, Liefer-/Arbeits-/Zahlungsfristen | NEU ENTWICKELN | keine Engine; Monatslauf nur Vorschlag |
| Company-/Startzustand | bestehendes Unternehmen | NEU ENTWICKELN | kein Company-/Savegame-Modell nachweisbar |
| Kunden, Anfrage, Angebot, Auftrag | Verkaufs-/Auftragslebenszyklus | NEU ENTWICKELN | keine Sales-/Auftragslogik nachweisbar |
| Lieferanten, Einkauf, Bestand | Beschaffung bis Wareneingang | NEU ENTWICKELN | keine Beschaffungs-/Bestandskomponente; Architektur ordnet Supplier sogar als OPEN ein |
| Manufacturing | einfache Maschinenbauproduktion | NEU ENTWICKELN | kein Branchen-/Produktionsmodul nachweisbar |
| Lieferung, Rechnung, Zahlung | Abschlussprozess | NEU ENTWICKELN | keine Produktlogik nachweisbar; A03-Schnittstelle offen |
| Finanz-/Kostenlogik | einfache Kosten, Erlöse, Liquidität | NICHT A02-WIEDERVERWENDBAR; A03-FACHLICH DEFINIEREN | keine Implementierung; A03 ist Finanzautorität |
| Persistenz/Savegame | Eröffnungs-/Simulationszustand | NEU ENTWICKELN | CP-0002 bestätigt fehlende DB-/Supabase-Integration; A04/A11/User-Abstimmung |
| API/Frontend/Tests/Dependencies | Bedienung und Prüfbarkeit | NEU ENTWICKELN | CP-0002 bestätigt fehlende Produktkomponenten |
| V0.2/ADRs | Orientierung für Grenzen | UNKLAR / WEITERE PRÜFUNG | sämtlich `PROPOSED`, nicht als Architekturfreigabe behandeln |
| Gründung, weitere Branchen, komplexes Personal/Steuern/Accounting, IHK | nicht im MVP | NICHT MVP / SPÄTER | explizite Nutzervorgabe |

**Wiederverwendbarkeit:** Dokumentation kann als inhaltliche Referenz dienen, nicht als Code. Keine wiederverwendbare Engine, Modelle, Events, Zustands-, Auftrags-, Kunden-, Einkaufs-, Produktions-, Rechnungs-/Zahlungs-, Finanz-, Persistenz-, Test- oder Schnittstellenkomponente gefunden. Es gibt folglich keine existierenden A02-Komponenten, die konkret angepasst werden könnten. Alles Operative wäre nach Freigabe neu zu entwickeln; Modulgrenzen und Schnittstellen entscheidet A11/A04. Dies ist fachlicher Bedarf, keine Architekturfreigabe.

**MVP-Abweichungen:** (1) V0.2 nennt Unternehmensgründung/Startkapital, Nutzer schließt Gründung aus und verlangt ein Bestandsunternehmen. (2) V0.2 lässt Branche offen und nennt Beispiele, Nutzer legt Maschinenbau als einzige Startbranche fest. (3) Vorschläge zu wählbaren Branchen, einfacher Finanzierung und Finanzsicht sind keine Erweiterung des MVP; Nutzer verlangt operative Auftragskalkulation, Beschaffung, Verkauf, Rechnung, einfache Produktion sowie einfache Kosten/Erlös/Liquidität. (4) Learning/Exam sind ausdrücklich später. (5) aktives Ticketboard enthält kein A02-Ticket. (6) Ein anderes „bestehendes Simulationstool“ ist im verlinkten Repository nicht auffindbar; falls ein anderes Tool gemeint ist, dessen konkrete Adresse/Checkout ist `OPEN`.

## R. Verbleibende fachliche Parameter und Abhängigkeiten

**Durch Nutzer festgelegt und in diesem Dokument übernommen:** Wochenraster/Monatsabschluss, konkrete Tagesphasenfolge, Same-day-Abhängigkeiten, F3 mit fünf Arbeitstagen und Ablehnungs-/Klärungsstatus, automatische Vollrechnung nach positiver Abnahme, keine Teilproduktion/-lieferung/-rechnung/-zahlung, keine Teilzahlung bei fehlender Liquidität, G3-Abschluss nach vollständigem Kundenzahlungseingang, Startdatum 01.01.2027, drei aktive Startaufträge, Arbeitsgänge 10/20/30/40, je Beschäftigten 40 h/Woche und CNC 40 operative h/Woche (mit Startwertgrenze 1.600 h/Jahr).

**A02-Startprofilwerte zur Nutzerprüfung:** Mengen, auftragsspezifische Ressourcenstunden und zugesagte Voll-Liefertermine in der obenstehenden Tabelle sind das auftragsbezogene deterministische Szenario. IDs `ORD-START-*` und `K-*` sind stabile Profilreferenzen; sie ersetzen keine noch fehlenden offiziellen Kunden-/Artikelstammdaten.

**Noch offene Werte/Regeln, kein stillschweigender Default:**

- Arbeitskalender: durch D-0011 und CP-0033 entschieden (Montag–Freitag, 8 Stunden/Tag je Beschäftigtem und CNC, Wochenende arbeitsfrei, Feiertage unberücksichtigt, Wochenendtermine nächster Arbeitstag; F3 fünf Arbeitstage ab Folgetag nach vollständiger Lieferung).
- Monatsgrenzen: Wochenendverschiebungen erhalten den nächsten Arbeitstag als wirksames Simulationsdatum. Die Zuordnung eines so in den Folgemonat verschobenen Ereignisses zu einer Buchungs-/Auswertungsperiode bleibt zwischen A02/A03 offen; Periodenkosten/BAB bleiben A03-Fachverantwortung.
- Zahlungsereignisse: Fälligkeiten und Finanzfolgen folgen D-0013–29, D-0030–43; alle fälligen Finanzereignisse werden im A02-Tagesmodell Phase 8 zugeordnet. D-0120 legt fest: zuerst Kundeneingänge des wirksamen Tages; danach eigene fällige Rechnungen in Spielerreihenfolge mit Liquiditätsprüfung. D-0126 führt Kundeneingänge vor den eigenen Zahlungsversuchen zuerst zur automatischen Rückführung einer bestehenden Disposchuld (maximal bis zum Eingangsbetrag); nur ein Rest erhöht freie Liquidität. D-0123/24 legen den Dispo-Höchstbetrag auf 10 % der Bilanzsumme zum Ende des Vorquartals fest, wirksam ab dem ersten Tag des Folgequartals; der Startwert nach D-0128 beträgt 4.671,42 €. D-0125 erlaubt manuelle Ziehung exakt des Zahlungsfehlbetrags bis zum verfügbaren Rahmen; automatischer Draw und Teilzahlung sind ausgeschlossen. Nach D-0127 wird der Zins täglich auf Basis des jeweils gezogenen Saldos berechnet und am Monatsende einmalig als Sammelposten belastet. Offen bleiben Tageszählbasis, Rundungszeitpunkt, Reihenfolge der Monatsendbuchung und Rückführung aus anderen Eingangstypen. D-0129 bestimmt als V1-Konvention die Reihenfolge zeitgleicher Finanzereignisse, das Zählen dreier unterschiedlicher offener Monatsraten für die Darlehensverwertung sowie die Zuordnung verschobener Vorgänge zur Periode ihres wirksamen Simulationstags. Wochenendtermine werden nach D-0011 auf den nächsten Arbeitstag verschoben.
- F3-Ablehnung: inhaltliche Auflösung von `ABLEHNUNG_IN_KLÄRUNG`, einschließlich Nacharbeit, Rücknahme/Storno oder Eskalation; kein Folgepfad ist hier entschieden.
- Unternehmensprofil: vollständige Kunden-/Lieferantenstammdaten und vorhandene Startvorschläge; Auftragszeichnungen/Revisionen und Produktmaße jenseits der aggregierten Stücklistenmengen; Vertragsbeträge und Zahlungskonditionen.
- Finanzen/BAB: Verkaufspreise, offene Belegdaten und Fälligkeiten, laufende Grundkosten, Lieferantenpreise/-lieferzeiten für künftige Beschaffung, Arbeit-/Maschinenkostensätze sowie konkrete BAB-Zuordnungen; A03-Fachautorität.
- Der 20.000-€-Restfinanzierungs-/Budgetrahmen bleibt separat von Cash; Abrufbarkeit und Gegenposition nicht festgelegt. Rechtsform, Eigenkapital/Gegenposition und Eröffnungsabgleich sind nicht von A02 abzuleiten.
- Abwesenheit, Maschinenstörung, Wartung, Ausschuss/Nacharbeit und Zufallsereignisse sind kein Bestandteil des konkretisierten Startlaufs. Eine spätere Zufallseinführung braucht eine separate Nutzerentscheidung und Replay-/Seed-Regeln.

Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung bleiben in V1 ausgeschlossen (D-0010). Korrekturen nach Monatsabschluss und weitergehende Insolvenz-/Vollstreckungsfolgen bleiben gesonderte Facharbeit. Keine Architektur- oder Implementierungsfreigabe folgt aus dieser Spezifikation.

## S. Abhängigkeiten und T. Nächster Schritt

- **A01:** Arbeitsauftrag/Ergebnis in aktive Goals/Tickets einordnen und priorisieren.
- **A03:** Eventwirkung und Übergabedaten in Finanzregeln überführen; autoritative Liquiditäts-, Kosten-, Forderungs- und Verbindlichkeitsansicht definieren.
- **A04:** erst nach fachlicher/architektonischer Klärung Datenmodell für Anfangszustand, Aufträge, Ressourcen, Bestand, offene Vorgänge und Events bestimmen.
- **A05:** später Bedienbedarf für Kalkulation, Auftrag, Beschaffung, Engpässe, Produktion und Ergebnis berücksichtigen; keine UI-Layoutentscheidung hier.
- **A11:** Grenzen Simulation/Sales/Operations/Manufacturing/Accounting, Periodenorchestrierung und Event-Schnittstellen klären; V0.2 bleibt unfreigegeben.
- **A09:** nach Freigabe Zustandsübergänge, Ressourcengrenzen, Fristen und Soll-Ist-Regeln prüfen.
- **User:** Zeitraster, Produkttiefe, Kalkulationsvereinfachung, Zahlungsverhalten, Störungsfälle und Anfangsprofil entscheiden.

**Empfohlener nächster Agentenschritt:** A01 ordnet die Spezifikation governance-konform ein; danach A03/A11 ausschließlich zu Finanzübergabe und fachlichen Systemgrenzen konsultieren. Danach offene Punkte priorisieren. Keine Implementierung.

## Abschlussverantwortung

- **A02 fachlich spezifiziert:** Auftragslebenszyklus, minimal nötige Prozesskette, Spielerentscheidungen, fachliche Events/Zustände, Zeit-/Unternehmensparameter, grobe Kalkulations- und Beschaffungs-/Produktionslogik innerhalb der MVP-Grenze.
- **A03 erhält:** finanzielle Klassifikation/Buchung, Steuer-/USt.-Regeln, Bewertung, Forderungen/Verbindlichkeiten, Liquidität und autoritative Finanzsicht.
- **A04 erhält:** Bedarf an dauerhaftem Anfangs-, Auftrags-, Ressourcen-, Bestands- und Ereigniszustand; kein Schema vorweggenommen.
- **A05 erhält:** Informations- und Bedienbedarf der operativen Schritte; kein Layout vorgegeben.
- **A11 klärt:** technische/fachliche Grenzen und Orchestrierung; keine Freigabe durch A02.
- **User entscheidet:** verbleibende Produktfragen, Realismus und finale Produkt-/Architekturentscheidungen.
- **Checkpoint erforderlich:** Ja, wegen wesentlicher Erkenntnis (keine vorhandene Simulation im Repository) und MVP-Abweichungen zu V0.2. Ein formeller Repo-Checkpoint konnte nicht geschrieben werden. Dieser Bericht ist ein reviewbares Arbeitsartefakt, kein formeller Repo-Checkpoint.

### Historischer A02/A03-Abstimmungsstand nach CP-0148 (später teilweise entschieden)

Dieser Abschnitt dokumentiert den damaligen Stand nach CP-0148. Der gemeinsame Abgleich CP-0155 und D-0120 haben die Reihenfolge gleichentägiger Kundeneingänge und eigener Zahlungen entschieden; A02 hat sie übernommen. D-0121 legt die erste tatsächliche Darlehensrate auf den 29.01.2027. Weiterhin offen sind insbesondere die Reihenfolge zusammenfallender Retry-/Erinnerungs-/Mahnereignisse, die operative Zählung der drei nicht gezahlten Darlehensraten und die Periodenzuordnung eines wirksam in den Folgemonat verschobenen Ereignisses. D-0122 bestimmt die konstante Annuität auf 339,21 € nach 5 % / 12; der A03-Berechnungsabgleich [a03-annuitaeten-berechnungsabgleich.md](../accounting/a03-annuitaeten-berechnungsabgleich.md) dokumentiert die Schlussrate.

## Quellen

- [AGENTS.md](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/AGENTS.md)
- [Agentenstruktur](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/agent-structure.md) · [Goals](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/goals.md) · [Ticket-Board](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/ticket-board.md)
- [Collaboration State](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/collaboration-state.md) · [Decision Log](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/decision-log.md)
- [Architektur V0.2 – PROPOSED](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/architecture/architecture-v0.2.md) · [Checkpoint CP-0002](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/checkpoints/CP-0002.md)
