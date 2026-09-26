# A02 – Maschinenbau-MVP: Spezifikation und Bestandsanalyse

**Stand:** 26.09.2026 · **Rolle:** A02 – SIMULATION · **Repository:** WFWSimulation, `main`  
**Arbeitsumfang:** Read-only Analyse und fachliche Spezifikation. Keine Code-, Datenbank- oder Architekturänderung.

## Status und Governance

Vorgeschriebene Governance gelesen: `AGENTS.md`, Agentenstruktur, Goals, Ticket-Board, Collaboration State, Decision Log, Architektur V0.2 und CP-0002. Aktives Master Goal ist MG-000. Aktiv: SLG-000.1 (Control Plane) und SLG-000.2 (Architektur prüfen, nicht freigegeben). Das einzige aktive Ticket ist T-0001 zur Control Plane; ein aktives A02-Ticket zu dieser fachlichen Aufgabe ist nicht eingetragen. Die Governance beschränkt Arbeitskontext auf Tickets aktiver Goals. Diese Analyse wurde auf ausdrücklichen Nutzerauftrag hin erstellt; A01 muss ihre Aufnahme in den aktiven Arbeitskontext bestätigen.

Alle D-0001 bis D-0009 und ADRs bleiben `PROPOSED`; Architektur V0.2 ist nicht freigegeben. Sie ist Kontext, keine Implementierungs- oder Architekturvorgabe. CP-0002 dokumentiert für die Inventur vom 25.09.2026 keine Anwendungslogik, kein Frontend/Backend, keine Datenbank-/Supabase-Integration, keine Tests und keine Dependencies. Die aktuelle GitHub-Wurzelansicht von `main` zeigt weiter nur `.github/workflows`, `docs`, `AGENTS.md` und `README.md`; keine Anwendungskomponenten. Der lokale Arbeitsordner dieses Auftrags ist kein Git-Checkout. Ein offizieller Repository-Checkpoint kann wegen fehlendem lokalen Checkout, read-only GitHub-Zugriff und ausdrücklichem Verbot von Änderungen/Commits nicht angelegt werden.

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
| Lieferung | Fertigmenge, Termin, Transport, Abnahme; freigeben | `OrderDelivered` / `DeliveryAccepted`; `GELIEFERT` | Leistungsnachweis, Transportkosten/abrechenbarer Stand melden | Menge, Datum, Fracht, Abnahme → Rechnung |
| Rechnung | Leistungsnachweis, Preis, Rechnungsdatum/Zahlungsziel; erstellen/freigeben | `CustomerInvoiceIssued`; `ABGERECHNET` | Forderungs-/Erlöswirkung nach A03 | Betrag, Datum, Fälligkeit, Leistungsbezug → Zahlung/offener Posten |
| Zahlung | offener Betrag, Fälligkeit; im MVP höchstens Zahlungsvorgang auslösen | `CustomerPaymentReceived` / `SupplierPaymentMade`; Status aktualisiert | Ein-/Auszahlung und Liquiditätswirkung, A03 verbucht | Betrag, Gegenpartei, Rechnungsbezug, Datum → Ergebnis |
| Auftragsergebnis | Kalkulation, Istkosten, fakturierter Erlös, offene Positionen; Ergebnis auswerten | `OrderResultCalculated`, `OrderClosed`; Abschlussregel `OPEN` | Soll-Ist-Abweichung; A03 liefert autoritative Finanzsicht | Kalkulationsversion, Istkosten, Liefer-/Rechnungs-/Zahlungsstatus → nächster Auftrag |

**Minimale Kette:** Anfrage → Kalkulation → Angebot → Annahme/Auftrag → Bedarf/Beschaffung → Eingang → einfache Produktion → Lieferung/Abnahme → Rechnung → Zahlung/offener Posten → Ergebnis → nächster Auftrag. Ablehnung/Ablauf, Lieferverzug und Kapazitätsengpass sind minimale Alternativpfade. Angebot bindet noch keine Produktion; Bestellung, Eingang, Leistung, Rechnung und Zahlung sind getrennte Vorgänge.

## B. Spielerentscheidungen

**Zwingend:** Anfrage bearbeiten/ablehnen; Kalkulationsannahmen prüfen; Preis und Liefer-/Zahlungskonditionen festlegen; Angebot senden/verwerfen; Auftrag nach Machbarkeitsprüfung bestätigen; Lieferant/Menge und Bestellung auswählen; Auftrag bei verfügbarer Ressource starten/fortsetzen; bei Engpass warten/priorisieren; Fertigstellung/Lieferung freigeben; Rechnung auslösen; Soll-Ist-Ergebnis ansehen.

**Optional im MVP:** Auswahl zwischen Lieferanten nach Preis und Termin (wenn mehrere existieren); einfacher Sicherheitsaufschlag; Auftragspriorität; Teillieferung; begrenzte Reaktion auf überfällige Zahlung. Überstunden/Zusatzkapazität erst nach Scope-/A03-Abstimmung.

**Später:** Unternehmensgründung, komplexe Personal-/Schichtplanung, Investitionsfinanzierung, strategische Beschaffung, Lieferkettenmanagement, Scheduling-Optimierung, Qualitätsmanagement, Steuern/komplexe Buchhaltung, weitere Branchen/Rechtsformen, IHK-Lernen.

## C–E. Events, Zustände, Zeit und Unternehmen

**Events:** `CustomerRequestReceived`, `RequestDeclined/Expired`, `QuoteCalculated`, `QuoteIssued/Revised/Accepted/Rejected/Expired/Withdrawn`, `OrderAccepted/Cancelled`, `MaterialRequirementIdentified`, `CapacityShortageDetected`, `PurchaseOrderPlaced`, `SupplierDeliveryDelayed`, `GoodsReceived/Rejected`, `SubcontractedServiceAccepted`, `ProductionScheduled/Started/Blocked/Completed`, `WorkProgressed`, `MaterialConsumed`, `CapacityConsumed`, `OrderDelivered`, `DeliveryAccepted`, `CustomerInvoiceIssued`, `SupplierInvoiceReceived`, `CustomerPaymentReceived`, `SupplierPaymentMade`, `PaymentOverdue`, `OrderResultCalculated`, `OrderClosed`. `SimulationPeriodOpened/Closed` und `DueDateReached` nur bei bestätigtem periodischem Zeitlauf. Events sind Tatsachen, keine Buchung und mutieren keinen A02-seitigen Ledger.

**Auftragszustände:** `ANGEFRAGT → KALKULIERT → ANGEBOTEN → BESTÄTIGT → IN_BEARBEITUNG → FERTIG → GELIEFERT → ABGERECHNET → ABGESCHLOSSEN`. Alternativ: Anfrage `ABGELEHNT/ABGELAUFEN`; Angebot `ABGELEHNT/ABGELAUFEN/ZURÜCKGEZOGEN`; `BLOCKIERT` bei Material-/Kapazitätsmangel (Rückkehr zum vorherigen Zustand nach Behebung). Teilzustände für Lieferung/Rechnung nur bei bestätigtem Bedarf. Zahlung ist getrennt vom operativen Auftragsstatus; ob Zahlung Auftragsschluss voraussetzt, `OPEN`.

Begleitende Zustände: Anfrage `OFFEN/KALKULIERT/ANGEBOTEN/ERLEDIGT`; Angebot `ENTWURF/ANGEBOTEN/ANGENOMMEN/ABGELEHNT/ABGELAUFEN`; Bestellung `BEDARF/BESTELLT/TEILWEISE_ERHALTEN/ERHALTEN/VERSPÄTET/STORNIERT`; Rechnung `OFFEN/TEILBEZAHLT/BEZAHLT/ÜBERFÄLLIG`. Verbindliche Statusbegriffe und Datenmodell sind A04.

**Unternehmenszustände:** verfügbare/reservierte/belegte Maschinen- und Arbeitskapazität; Materialbestand (Anfang + Eingänge − Verbrauch); Auftragsbestand und Fälligkeiten; offene Beschaffungen; Finanzstatus (Liquidität, Vermögen, Forderungen, Verbindlichkeiten, Kosten/Erlöse) ausschließlich aus A03. Warnzustände „arbeitsfähig/eingeschränkt/zahlungsgefährdet“ sind denkbar, aber Schwellen/Folgen `OPEN`; keine Insolvenz-/Kreditautomatik definieren.

**Zeit:** minimal braucht Simulation einen monotonen Zeitbezug für Lieferzeit, Arbeitsdauer, Zahlungstermin und laufende Kosten. Arbeitsvorschlag: Spieler erfasst Entscheidungen zum aktuellen Stand; Zeitvorschub löst fällige Eingänge, verfügbare Produktionszeit, Fertigstellung/Lieferung, Forderungs-/Verbindlichkeitsfälligkeiten und Periodenkosten aus; Ergebnis/Engpässe werden angezeigt. Monatliche Perioden sind in V0.2 lediglich `PROPOSED`. `OPEN`: Tag/Woche/Monat, Pause/Schrittweite, Phasenreihenfolge, Ereignis-Sortierung, Interaktion mit Commands, nachträgliche Korrekturen und Zufall. Für MVP feste nachvollziehbare Regeln; Zufall nur versioniert/seedbar und mit A11 abgestimmt.

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

**Produktion:** Grober deterministischer Auftragsschritt mit Materialmenge, Arbeitsstunden, Maschinenstunden und Dauer. Start bei ausreichendem Material und Grundkapazität; Verbrauch wird Auftrag/Zeitraum zugeordnet. Fehlende Kapazität führt zu Verzögerung/Blockade mit sichtbarer Spielerentscheidung. Mindestaufwand erfüllt → `ProductionCompleted` → Lieferung. Keine Losgrößenoptimierung, komplexen Routen, Schichtplanung, Ausschuss-/Nacharbeits- oder Echtzeitsteuerung; Qualitätsmodell nur nach späterer MVP-Entscheidung.

## I. Finanzielle Übergabepunkte an A03

| Simulationsereignis | A02-Wirkung | A03 mindestens übergeben |
|---|---|---|
| Auftrag bestätigt | erwarteter Erlös/Kosten, keine A02-Buchung | Kunde, Betrag, Leistung, Termine, Konditionen |
| Bestellung erteilt | erwarteter Abfluss/Zusage | Lieferant, Positionen, Menge, Preis, Datum, Ziel, Liefertermin |
| Wareneingang/Fremdleistung | Bestand/Leistung tatsächlich eingegangen | Istmenge, Preis, Datum, Beleg-/Bestellreferenz |
| Ressourcenverbrauch | Auftrag verbraucht Material-/Arbeits-/Maschinen-/Energieaufwand | Typ, Menge/Stunden, Satz/Bewertungsreferenz, Auftrag, Zeitraum |
| Lieferung/Abnahme | Leistung erfüllt, Rechnung kann folgen | Kunde, Auftrag, Menge, Leistungsdatum, Preisbezug, Fracht, Nachweis |
| Kunden-/Lieferantenrechnung | offene Forderung/Verbindlichkeit aus Simulation gemeldet | Betrag, Gegenpartei, Beleg-/Leistungsdatum, Fälligkeit, Referenz |
| Zahlungseingang/-ausgang | Mittelbewegung/offene Position verändert | Betrag, Partei, Belegreferenz, tatsächliches Datum |
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
- Offene Aufträge mit Status, Kunde, Termin, Restbedarf/Restkapazität und erledigten Teilschritten.
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

## R. Offene fachliche Entscheidungen

- `OPEN`: Zeitschritt und Periodenabschluss; Monatslauf ist nicht freigegeben.
- `OPEN`: Produkt-/Auftragstiefe Maschinenbau (Einzelteil vs. kleine Serie), Stücklisten-/Arbeitsganggranularität.
- `OPEN`: Angebotsgültigkeit, Kundennachfrage, Annahme-/Ablehnungs-/Lieferzuverlässigkeitsregeln.
- `OPEN`: Kostensätze, genau eine einfache Gemeinkostenmethode, Sicherheitszuschlag und Sichtbarkeit von Unsicherheit.
- `OPEN` → A03: netto/brutto/USt., Finanzwirkung von Bestellung/Eingang/Rechnung/Zahlung, Materialbewertung, Forderungs-/Verbindlichkeits- und Liquiditätsausweis.
- `OPEN`: automatische Zahlung bei Fälligkeit oder Spielersteuerung; ob Zahlung operative Schließung voraussetzt (Empfehlung: Leistungsschluss und Zahlung getrennt verfolgen).
- `OPEN`: Teilmengen/-Lieferung/-Rechnung, Ausschuss/Nacharbeit, Reklamation, Storno/Korrektur nach Abschluss.
- `OPEN`: konkretes Anfangsprofil (keine Werte erfinden), aggregierte vs. einzelne Maschinen-/Mitarbeiterkapazität, Insolvenz-/Kreditfolgen, Vertragsstrafen.
- `OPEN`: Aufnahme dieser fachlichen Arbeit als aktives Goal/Ticket durch A01/User.

## S. Abhängigkeiten und T. Nächster Schritt

- **A01:** Arbeitsauftrag/Ergebnis in aktive Goals/Tickets einordnen und priorisieren.
- **A03:** Eventwirkung und Übergabedaten in Finanzregeln überführen; autoritative Liquiditäts-, Kosten-, Forderungs- und Verbindlichkeitsansicht definieren.
- **A04:** erst nach fachlicher/architektonischer Klärung Datenmodell für Anfangszustand, Aufträge, Ressourcen, Bestand, offene Vorgänge und Events bestimmen.
- **A05:** später Bedienbedarf für Kalkulation, Auftrag, Beschaffung, Engpässe, Produktion und Ergebnis berücksichtigen; keine UI-Layoutentscheidung hier.
- **A11:** Grenzen Simulation/Sales/Operations/Manufacturing/Accounting, Periodenorchestrierung und Event-Schnittstellen klären; V0.2 bleibt unfreigegeben.
- **A09:** nach Freigabe Zustandsübergänge, Ressourcengrenzen, Fristen und Soll-Ist-Regeln prüfen.
- **User:** Zeitraster, Produkttiefe, Kalkulationsvereinfachung, Zahlungsverhalten, Teil-/Störungsfälle und Anfangsprofil entscheiden.

**Empfohlener nächster Agentenschritt:** A01 ordnet die Spezifikation governance-konform ein; danach A03/A11 ausschließlich zu Finanzübergabe und fachlichen Systemgrenzen konsultieren. Danach offene Punkte priorisieren. Keine Implementierung.

## Abschlussverantwortung

- **A02 fachlich spezifiziert:** Auftragslebenszyklus, minimal nötige Prozesskette, Spielerentscheidungen, fachliche Events/Zustände, Zeit-/Unternehmensparameter, grobe Kalkulations- und Beschaffungs-/Produktionslogik innerhalb der MVP-Grenze.
- **A03 erhält:** finanzielle Klassifikation/Buchung, Steuer-/USt.-Regeln, Bewertung, Forderungen/Verbindlichkeiten, Liquidität und autoritative Finanzsicht.
- **A04 erhält:** Bedarf an dauerhaftem Anfangs-, Auftrags-, Ressourcen-, Bestands- und Ereigniszustand; kein Schema vorweggenommen.
- **A05 erhält:** Informations- und Bedienbedarf der operativen Schritte; kein Layout vorgegeben.
- **A11 klärt:** technische/fachliche Grenzen und Orchestrierung; keine Freigabe durch A02.
- **User entscheidet:** verbleibende Produktfragen, Realismus und finale Produkt-/Architekturentscheidungen.
- **Checkpoint erforderlich:** Ja, wegen wesentlicher Erkenntnis (keine vorhandene Simulation im Repository) und MVP-Abweichungen zu V0.2. Ein formeller Repo-Checkpoint konnte nicht geschrieben werden. Dieser Bericht ist ein reviewbares Arbeitsartefakt, kein formeller Repo-Checkpoint.

## Quellen

- [AGENTS.md](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/AGENTS.md)
- [Agentenstruktur](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/agent-structure.md) · [Goals](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/goals.md) · [Ticket-Board](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/ticket-board.md)
- [Collaboration State](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/collaboration-state.md) · [Decision Log](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/decision-log.md)
- [Architektur V0.2 – PROPOSED](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/architecture/architecture-v0.2.md) · [Checkpoint CP-0002](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/checkpoints/CP-0002.md)
