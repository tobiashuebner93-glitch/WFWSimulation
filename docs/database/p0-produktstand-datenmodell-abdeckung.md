# P0-Produktstand – Abdeckungsprüfung des Datenmodells

**Datum:** 2026-09-26  
**Agent:** A04 DATABASE  
**Bezug:** MG-000 / SLG-000.2 / abgeschlossenes T-0006 / D-0010 / CP-0016  
**Status:** Read-only Modellprüfung; keine Architektur-, Schema- oder Implementierungsfreigabe

## 1. Prüfrahmen

Das bestehende Datenmodell wurde gegen die in der Nutzeranweisung aufgelisteten konkreten P0-Regeln geprüft. „Vollständig“ bedeutet, dass die Modellstruktur die genannte Information/Zustandsbeziehung darstellen kann; es bestätigt nicht die Fachrichtigkeit einer A02-/A03-Regel oder eine Implementierungsfreigabe.

**Governance-Hinweis:** `docs/agent-system/p0-entscheidungs-vorlage-maschinenbau-mvp.md` trägt weiterhin den Status „Optionen und Fachvorschläge zur Auswahl. Keine Option ist beschlossen“. CP-0016 sagt ebenfalls, dass Nutzerentscheidungen offen sind. Die hier aufgelisteten Anforderungen werden daher als Prüfziel dieses Auftrags gewertet; sie sind in der geprüften P0-Vorlage/Decision Log noch nicht als formell beschlossene Auswahl dokumentiert. D-0010 bleibt maßgeblich und unverändert. Abgeschlossene T-0006/T-0007 werden nicht wieder geöffnet.

Prüfgrundlagen: aktuelles Modell `docs/database/maschinenbau-mvp-datenmodell.md`, D-0010, zentrale P0-Vorlage, ursprünglicher QA-Review CP-0011 und bestandener Rereview CP-0013. CP-0013 bestätigt die ursprünglichen drei MAJOR-Modelllücken gegen den damaligen D-0010-Umfang, nicht die nachfolgend geprüften konkreten P0-Regeln.

## 2. Abdeckung je Regel

| P0-Regel | Abdeckung | Befund |
|---|---|---|
| Fester Simulationsstart 01.01.2027 | **Teilweise** | `simulation_run.simulation_clock` und Zeitversionen existieren, aber kein festes Startdatum oder kanonisches Startprofil mit Stichtag. Im Modell wird Startdatum als offen geführt. |
| Wochenraster mit Ereignissen an konkreten Kalendertagen | **Teilweise** | Ereignisse haben Simulationszeit, Sequenz und Periode; Wochenvorschub, konkrete Ereignisdatumsbeibehaltung und Wochenstichtag sind nicht als Zeitmodellregel beschrieben. |
| Wochenendtermine auf nächsten Arbeitstag verschieben | **Fehlt** | Kein Geschäftskalender, Arbeitstagsfunktion oder explizites `adjusted_due_at`/Original-Fälligkeitspaar. |
| Flexible Zeitfortschreibung | **Teilweise** | Command- und Simulationslaufobjekte sind vorhanden, aber zulässige Vorschubschritte, Stopppunkte und Verarbeitung bereits vergangener Tage fehlen. |
| Same-day dependencies | **Teilweise** | `sequence_no`, `causation_id` und `correlation_id` tragen Herkunft/Reihenfolge, aber keine deklarierte Phasenpriorität/Abhängigkeitskante oder Regel, wann spätere Tagesphasen erneut ausgeführt werden. |
| Kunden-/Lieferantenziele 14/30 Tage | **Teilweise** | `payment_term.due_rule` und Trigger sind abstrakt vorgesehen; feste 14-/30-Tagewerte, Richtungsspezifika und Startvorgabe fehlen. |
| Fälligkeit nach späterem Ereignis | **Teilweise** | Triggerreferenz und Fälligkeitsregel bieten ein Modellierungsmuster; Bezug zu einem erst später eintretenden Ereignis und daraus berechnetes Fälligkeitsdatum sind nicht konkret spezifiziert. |
| Vorauszahlungen ab Rechnungsstellung | **Teilweise** | Zahlungstermin und Zahlung können verbunden werden; kein expliziter Invoice-issued-Trigger/Zahlungstermin-Zustand und keine Regel für sofortige Zahlung nach Rechnungsstellung. Finanzklassifikation bleibt bei A03. |
| Automatische Zahlungen bei ausreichender Liquidität | **Fehlt** | Payment-/OP-/Liquiditätsobjekte existieren, aber kein Zahlungsmandat/Automatikmodus, Liquiditätsprüfung, Zahlungsversuch/-ergebnis, Retry oder ausreichende-Mittel-Invariante. |
| Zahlungserinnerung und Mahnung | **Fehlt** | Mahnung/Inkasso ist nur als spätere Erweiterung genannt; keine Fristen, Stufen, Zustell-/Reaktionsereignisse oder Forderungszuordnung. |
| Pfändung | **Fehlt** | Kein Vollstreckungsfall/-ereignis oder Bezug zu offener Forderung, Simulationszeit und Liquiditäts-/Vermögenswirkung. Fach-/Rechtsregeln sind zudem nicht definiert. |
| Liquidation | **Fehlt** | Kein Unternehmensauflösungs-/Liquidationsprozess oder Statusübergang. Schwellen, Reihenfolge und Finanzfolgen nicht modelliert. |
| F3-Abnahmefrist und automatische Abnahme | **Teilweise** | `acceptance` hat Status/Zeit/Nachweis; Frist, automatische Annahme bei Fristablauf und entsprechendes Event/Zustandsresultat fehlen. |
| Automatische Rechnungsstellung | **Teilweise** | Rechnung und Rechnungsstatus sind vorhanden; `INVOICEABLE`-Zustand, automatischer Erstellungs-Command, Auslöser und Verknüpfung zum F3-Abnahmeereignis fehlen. |
| G3: Auftrag erst nach vollständiger Zahlung schließen | **Teilweise** | Offene Posten, Zahlungszuordnung und operativer Auftragsstatus sind separat vorhanden. G3-Schließbedingung, aggregierter Finanzstatus je Auftrag und Sperre bis alle relevanten Kunden-/Lieferantenposten beglichen sind, fehlen. |
| SimTAX 19 % mit definierter Rundung | **Teilweise** | Steuer-/Netto-/Bruttofelder und Steuerkennung sind angelegt; Steuersatz 19 %, Berechnungsbasis, Rundungsmodus/-stufe und Regelversion fehlen. „SimTAX“ als explizit vereinfachte Simulation ist nicht abgebildet. |
| D3-BAB mit mehreren Kostenstellen | **Teilweise** | `bab_line` trägt `cost_center_code`, Kostenart, Basis, Rate, Ziel und Version; aber keine normalisierte Kostenstellen-Entität, Verteilungsmatrix/Reihenfolge oder explizite Mehrstelleninvariante. D3-Werte und Schlüssel fehlen. |
| Gleitender Durchschnittspreis | **Teilweise** | Materialbewegung und Bewertungsreferenz bestehen; keine ausgewiesene Bewertungsmethode, Durchschnittskostenfortschreibung je Zugang, Bestandswertprojektion/-historie, Eröffnungsbewertung und Rundungsregel. |
| 50.000 € Budgetrahmen getrennt von 30.000 € Anfangsliquidität | **Teilweise** | `opening_balance` könnte getrennte typisierte Beträge speichern, aber das Modell behandelt Budget als offene Klassifikationsfrage und hat kein eigenes Budgetrahmenobjekt. 30.000 € ist kein vorhandener Startwert. Budget ist nicht automatisch Geldbestand. |
| Materialbestand | **Teilweise** | `material` und append-only `inventory_movement` ermöglichen mengenmäßige Bestandsableitung. Anfangsbestandszeilen, Lagerort/-status und explizite Mengenprojektion/-invarianten fehlen. |
| Forderungen | **Vollständig (strukturell)** | `receivable`, Rechnungsbezug, Fälligkeit/Status und Zahlungsausgleich sind vorhanden. Die konkrete Auslösung/Frist bleibt A03-/P0-Regel. |
| Verbindlichkeiten | **Vollständig (strukturell)** | `obligation_source`, invoice-unabhängiges `payable`, spätere `payable_invoice_link` und Payment sind getrennt. Zeitpunkt/Ansatz und P0-Fälligkeit bleiben A03-Regel. |
| Mitarbeiter | **Teilweise** | `employee` und Ressourcennutzung existieren; Qualifikationen/Skills und verfügbare Kapazität/Arbeitszeitmodell fehlen. |
| Maschine und Maschinenkapazität | **Teilweise** | Maschinenstammsatz und Nutzung sind vorgesehen; Kapazitätskalender, Stunden/Schicht, Status/Verfügbarkeit und Engpass-/Reservierungsbezug fehlen. |
| Kunden und Lieferanten | **Vollständig (Grundstammdaten)** | Beide Stammdatenobjekte und Referenzen auf Verträge/Belege sind vorhanden. Zahlungsbedingungen am Vertrag sind darstellbar; konkrete 14/30-Tage-Regeln fehlen separat. |

## 3. Zustands- und Persistenzprüfung

Das Modell trennt fachlich sauber die Hauptkategorien **operative Ereignisse**, **Vertrag/Auftragsposition**, **Lieferanten-/Kundenrechnung**, **Forderung**, **Verbindlichkeit**, **Zahlung** und **operativen Auftragsstatus**. Die Ereignis-ID/Sequenz und Auditfelder ermöglichen grundsätzlich Herkunftsnachverfolgung. Damit ist die P0-Zustandsmaschine aber noch nicht vollständig spezifiziert:

- Statuswerte bilden allgemeine Übergänge ab, aber es fehlen die konkreten P0-Ereignisse und Trigger für „Fälligkeit verschoben“, „automatische Zahlung versucht/ausgeführt/wegen Liquidität ausgesetzt“, „Abnahmefrist abgelaufen“, „Rechnung automatisch erstellt“, Mahnstufe, Vollstreckung/Liquidation und G3-Finanzabschluss.
- Bei G3 muss der operative Auftragsschluss als abgeleiteter/validierter Übergang mit A03-Rückmeldung über alle für den Auftrag maßgeblichen offenen Posten modelliert werden. Es darf keinen zweiten Finanzsaldo im Operationskontext geben.
- Für flexible Kalenderverarbeitung müssen Originaltermin, angepasster Arbeitstag, Ereignisdatum und deterministische Ereignisreihenfolge getrennt bleiben.
- Die P0-Vorgaben erfordern Startprofil-/Regelversionsdaten, soweit sie den Lauf reproduzierbar machen; derzeit ist `simulation_run` zu allgemein und ein kanonischer Opening Snapshot fehlt.

## 4. Konkrete Modelllücken und priorisierte Änderungen (Vorschlag)

Keine dieser Änderungen wurde vorgenommen. Vor Schemaänderung sind zuständige Fachregeln zu bestätigen.

### P0 – Zeit, Trigger und Zustandsautomatik

1. **Simulationskalender/Run-Start:** Startdatum, Wochenvorschub, Kalender-/Arbeitstagsregel, Original- und verschobene Fälligkeit, Monatsperiode und Zeit-/Regelversion als Run-/Kalenderkonfiguration oder versioniertes Startprofil abbilden.
2. **Ereignisauflösung:** feste Phase/Priorität, Abhängigkeiten, Sequenz und same-day-Reprocessing-Regel versioniert speichern oder eindeutig durch A02-Regeln bestimmen; Event loggt das tatsächlich wirksame Datum.
3. **Zahlungsplan/-automation:** Terms konkret mit Triggerart und Triggerbezug (Rechnungsstellung, anderer benannter Vorgang), Zielabstand, Original-/angepasster Fälligkeit, Automatikmodus und Zahlungsversuchstatus verbinden. Liquiditätsprüfung/-ausführung bleibt A03/Application-Verhalten, nicht DB-Trigger.
4. **Abnahme/Rechnung:** Acceptance erhält Frist-/Deadline-Regelversion und Ergebnis `ACCEPTED`, `REJECTED` oder fachlich bestätigtes `DEEMED_ACCEPTED`; Rechnungsfähigkeit und Auto-Invoice-Policy/Ereignis bleiben getrennt von Rechnung und Forderung.
5. **G3-Abschluss:** Auftragsergebnis/Operations-Status erhält einen Finanzvollständigkeits-Input bzw. expliziten A03-Read-Model-Status und eine Abschlussbedingung; keine eigenständige Berechnung des Restbetrags außerhalb Accounting.

### P0 – Accounting und Zahlungsfolgen

6. **Beträge/SimTAX:** Steuerkonfiguration mit Kennung/Bezeichnung, 19-%-Satz, Gültigkeits-/Regelversion, Berechnungsbasis, Rundungsmodus und Rundungsstufe ergänzen, sobald A03/Nutzer Semantik bestätigt haben. Unmissverständlich als Simulation labeln.
7. **Vorauszahlung/offener Posten:** Zahlungstermin mit konkretem Rechnungsauslöser verbinden; A03 definiert, ob vor Leistung/Rechnung eine Forderung oder ein sonstiger Finanzposten entsteht und wie Vorauszahlung später ausgeglichen wird. Zahlung selbst bleibt eigenes Faktum.
8. **Mahn-/Vollstreckung-/Liquidationsfälle:** separat versionierte Case-/Event-Objekte mit Forderungsbezug, Frist, Status und Folgen erst nach A02/A03/Nutzer-Fachregeln; Pfändung/Liquidation nicht als generisches Mahnstatusfeld modellieren.
9. **Budget vs. Cash:** getrennte Felder/Objekte für einen Budget-/Finanzierungsrahmen von 50.000 € und bestätigte Opening-Liquidität von 30.000 €; keine Buchung des Differenzbetrags unterstellen. A03 legt finanzielle Klassifikation/Gegenposition fest.
10. **Materialbewertung:** versionierte Methode `MOVING_AVERAGE`, Preis/Wert pro Zugang, aktualisierter gleitender Wert nach Zugang, Verbrauchsbewertung, Bestandssaldo und Rundungsregel nachvollziehbar referenzieren. A03 bestimmt Formel/Finanzwirkung; A02 Mengen-/Eventreihenfolge.
11. **D3-BAB:** Kostenstelle als Referenzobjekt, mehrere Stellen je BAB-Version, BAB-Zeilen/Verteilungsschlüssel, Basis und Reihenfolge/Gültigkeit aufnehmen; A03 bestätigt Kategorien/Basen/Raten und keine Doppelzählung.

### P0 – Stammdaten und Kapazität

12. **EmployeeQualification** und Qualifikations-/Gültigkeitsbezüge sowie Arbeitskapazitäts-/Verfügbarkeitsprofil ergänzen.
13. Maschinenkapazitäts-/Verfügbarkeitsprofil mit Stunden/Kalender/Gültigkeit sowie erforderlichen Zuständen/Reservierungen vorsehen.
14. Opening inventory quantities und Bestandsorte/-zustände ergänzen, wenn der P0-Startbestand dies benötigt; Stammdaten allein enthalten keine Mengen.

P0-Definitionen und tabellennamen sind Vorschläge für spätere Datenmodellkonkretisierung. Persistenzstruktur, genaue Statusnamen und Benutzungsfälle A02/A03/A11/Produkt abgleichen, bevor sie in T-0006 oder einer Implementierung landen.

## 5. Fachliche Auswirkungen und Verantwortlichkeiten

| Rolle | Erforderliche Konkretisierung |
|---|---|
| A02 | Start 01.01.2027, Wochenraster und konkrete Ereignistage; flexibler Vorschub; Wochenendverschiebung/Kalender; Same-day-Phasen und Abhängigkeiten; Abnahmefrist F3; Ereignis, das automatische Rechnungsstellung auslöst; Kapazitäts-/Qualifikationsmodell; Material-/Maschinenmengen und zeitliche Reihenfolge; Mahnung/Vollstreckung/Liquidation als Simulationsereignis und G3 operativer Übergang. |
| A03 | 14/30-Tage-Ziele, Startpunkt nach späterem Ereignis, Vorauszahlungsklassifikation/-ausgleich, automatische Zahlung mit ausreichender Liquidität/Verhalten bei Mangel; SimTAX 19 % und genaue Rundung; D3-Kostenstellen, Basen, Sätze, Gültigkeit; gleitender Durchschnitt; 50.000 € Finanzierungs-/Budgetrahmen vs. 30.000 € Liquidität; Forderungs-/Verbindlichkeits- und G3-Ausgleichssicht. |
| A11 | Prüfen, wo Kalender, Regelversion, Command-Orchestrierung, automatische Zahlungen und Finanzstatus-Read-Model systemisch liegen; keine Architekturfreigabe vorwegnehmen. |
| A01/Nutzer | Die konkrete Auswahl aus P0-Vorlage/D-IDs bestätigen oder in Decision Log nachtragen lassen. Die Vorlage sagt derzeit, dass Optionen noch nicht beschlossen sind. Zusätzlich Definition/Produktgrenzen für Pfändung und Liquidation festlegen. |
| A04 | Nach bestätigten A02/A03-Regeln Modellbeziehungen/-felder konkretisieren; keine Accounting-Buchungs-, Simulations- oder Rechtsregeln selbst definieren. |

## 6. Datenbankänderungsvorschlag

**Vorschlag: spätere konzeptionelle Modellaktualisierung erforderlich; jetzt keine Änderung ausgeführt.** Die bestehenden Objekte reichen für Stammdaten, Aufträge, Rechnungen, Forderungen/Verbindlichkeiten, einfache Zahlungen, Ereigniszeit und BAB-Grunddaten. Sie reichen nicht für die vollständige Kombination aus konkretem Kalenderverhalten, Automationsfällen, F3/G3-Regeln, SimTAX-Konfiguration, D3-Mehrkostenstellen, gleitendem Durchschnitt, getrenntem Budget/Liquidität und Kapazitäts-/Qualifikationsdaten.

Vor konkreter DB-Schemaarbeit müssen P0-Auswahlen und fachliche Regeln durch den Nutzer/A02/A03 bestätigt und A11-Systemgrenzen geprüft werden. Keine Migration, Supabase-Änderung oder Schemafreigabe folgt aus dieser Abdeckungsprüfung.
