# A02 – Maschinenbau-MVP: Spezifikation und Bestandsanalyse

**Stand:** 26.09.2026 · **Rolle:** A02 – SIMULATION · **Repository:** WFWSimulation, `main`  
**Arbeitsumfang:** Fachliche Spezifikation; diese Revision übernimmt bestätigte Nutzerregeln und konkretisiert ein A02-Startprofil. Keine Code-, Datenbank- oder Architekturänderung.

## Status und Governance

Vorgeschriebene Governance gelesen: `AGENTS.md`, Agentenstruktur, Goals, Ticket-Board, Collaboration State, Decision Log, Architektur V0.2 und CP-0002. Aktives Master Goal ist MG-000. Aktiv: SLG-000.1 (Control Plane) und SLG-000.2 (Architektur prüfen, nicht freigegeben). Das einzige aktive Ticket ist T-0001 zur Control Plane; ein aktives A02-Ticket zu dieser fachlichen Aufgabe ist nicht eingetragen. Die Governance beschränkt Arbeitskontext auf Tickets aktiver Goals. Diese Analyse wurde auf ausdrücklichen Nutzerauftrag hin erstellt; A01 muss ihre Aufnahme in den aktiven Arbeitskontext bestätigen.

Alle D-0001 bis D-0009 und ADRs bleiben `PROPOSED`; Architektur V0.2 ist nicht freigegeben. Sie ist Kontext, keine Implementierungs- oder Architekturvorgabe. CP-0002 dokumentiert für die Inventur vom 25.09.2026 keine Anwendungslogik, kein Frontend/Backend, keine Datenbank-/Supabase-Integration, keine Tests und keine Dependencies. Die aktuelle GitHub-Wurzelansicht von `main` zeigt weiter nur `.github/workflows`, `docs`, `AGENTS.md` und `README.md`; keine Anwendungskomponenten. Der lokale Arbeitsordner dieses Auftrags ist kein Git-Checkout. Ein offizieller Repository-Checkpoint kann wegen fehlendem lokalen Checkout, read-only GitHub-Zugriff und ausdrücklichem Verbot von Änderungen/Commits nicht angelegt werden.

### Verbindliche P0-Regeln und Konkretisierung (Nutzerbestätigung vom 26.09.2026)

Die folgenden Regeln ersetzen abweichende `OPEN`-Aussagen in dieser älteren Spezifikation. Werte im Startauftragsprofil sind konkrete A02-Szenarioparameter auf Nutzerauftrag, keine neuen allgemeinen Produktregeln. Noch nicht gelieferte Kunden-, Preis-, Kalender- oder Finanzwerte bleiben offen.

**Tagesauflösung:** Zeit wird im Wochenraster mit Monatsabschluss angezeigt/verarbeitet; operative Ereignisse tragen dennoch ein konkretes Simulationsdatum. Zeitvorschub um mehrere Tage löst jeden Zwischentag separat auf. Wochenendtermine werden auf den nächsten Arbeitstag verschoben. Für jeden Tag gilt strikt: (1) Spielerentscheidungen, (2) Wareneingänge/Fremdleistungen, (3) Produktion und Materialverbrauch, (4) Produktionsfertigstellung, (5) Lieferung, (6) Abnahme, (7) Rechnungsstellung, (8) fällige Zahlungen, (9) Tagesabschluss, (10) periodische Kosten, soweit Monatsperiodenende. Abhängige Folgeereignisse dürfen noch am selben Tag in einer späteren Phase stattfinden. Innerhalb einer Phase werden unabhängige operative Ereignisse nach Ereigniszeit, dann stabiler Auftrags-/Beleg-ID verarbeitet. Eine spätere Phase wird nach einem Ereignis nicht rückwirkend erneut geöffnet; das Ereignis liegt in seiner fachlich nächsten späteren Phase. Für gleichzeitig fällige Zahlungen bei knappem Cash muss A03/Nutzer eine Finanzpriorität liefern; A02 legt keine auszahlungsentscheidende Sortierung fest. Periodische Kosten laufen erst nach Tagesabschluss.

**F3-Abnahme:** Nach vollständiger Lieferung beginnt eine Frist von fünf Arbeitstagen; der Liefertag zählt nicht mit. Eine ausdrückliche Abnahme innerhalb der Frist setzt den Abnahmetag. Eine ausdrückliche Ablehnung, die innerhalb der Frist eingeht, verhindert die automatische Abnahme und setzt den Status `ABLEHNUNG_IN_KLÄRUNG`; dieser Status blockiert Abnahme und automatische Rechnungsstellung. Die weitere Fehler-/Klärungsauflösung (z. B. Nacharbeit, Zurückweisung, Storno) ist nicht festgelegt. Ohne rechtzeitige Ablehnung wird am Ende des fünften folgenden Arbeitstags `AcceptanceAutomaticallyGranted` ausgelöst. In Phase 6 wird eine Fristablauf-Automatik erst nach Eingang etwaiger fristgerechter Ablehnung ausgewertet.

**Zahlungsrichtungen (getrennte Abläufe):**

- **Kundenzahlung an das Unternehmen / Forderungseingang:** Kundenseitiges Zahlungsverhalten entscheidet, wann eine fällige Forderung tatsächlich bezahlt bzw. wann der Zahlungseingang ausgelöst wird. Sobald dieser Eingang ausgelöst ist, wird der volle geschuldete V1-Betrag als `CustomerPaymentReceived` erfasst und die Forderung entsprechend reduziert/geschlossen. Vor dem Eingang wird niemals der Bankbestand des eigenen Unternehmens geprüft; eigene Liquidität kann einen Kundenzahlungseingang weder verhindern noch verschieben. Ein Eingang ist eine tatsächliche Liquiditätsmehrung und keine neue Erlösbuchung. Kundenverhalten und etwaige Verspätung bestimmt A03 nach den bestehenden Regeln.
- **Eigene Lieferanten-/Gläubigerzahlung / Verbindlichkeitenausgang:** Am Fälligkeitstag wird automatisch ein vollständiger Zahlungsvorgang versucht (`SupplierPaymentAttempted`). Reicht die eigene verfügbare Liquidität, wird der ganze offene Posten gezahlt (`SupplierPaymentMade`), geschlossen und die Liquidität um den tatsächlichen Betrag vermindert. Reicht sie nicht, wird `SupplierPaymentFailedInsufficientLiquidity` dokumentiert; es gibt weder Teilzahlung noch negative Liquidität oder sonstige Liquiditätsbewegung. Der vollständige offene Posten bleibt offen und geht in den bestätigten V1-Mahn-/Dunning-Fluss (Zahlungserinnerung → Mahnung → Pfändung bzw. Liquidation) über. A02 übergibt Fälligkeit/Versuch und verarbeitet das von A03 autoritativ zurückgegebene Zahlungsergebnis; A02 berechnet oder mutiert keinen Finanzsaldo.

In Phase 8 sind beide Richtungen getrennt zu verarbeiten: Kundeneingänge folgen dem Kundenverhalten, eigene Ausgänge dem Vollzahlungsversuch mit Liquiditätsprüfung. Es werden keine Retry-Zeitpunkte/-regeln, Mahnfristen/-schwellen oder Prioritäten konkurrierender gleichzeitiger Ausgänge ergänzt; diese bleiben A03-/Nutzerparameter. Fälligkeit, Versuch, tatsächliche Zahlung, OP-Status und Liquiditätswirkung sind getrennte Tatsachen.

**Auftragszustände:** Operative Erfüllung, Rechnungsstatus und finanzieller Ausgleich sind getrennte Statusdimensionen. Vollständige Produktion, Lieferung und Abnahme erfüllen den Auftrag operativ. Rechnung erstellt heißt abgerechnet, nicht bezahlt. `ABGESCHLOSSEN` gemäß G3 wird erst gesetzt, wenn die vollständige Kundenforderung des Auftrags bezahlt ist; Lieferantenverbindlichkeiten blockieren diesen Kundenauftrag nicht. Überfälligkeit/Mahnung ändert keinen bereits erfüllten Produktions- oder Lieferstatus. Eine Ablehnung führt in Klärung und hält Abnahme/Rechnung an.

**Kapazität:** Die drei Beschäftigten haben je eine nominelle Kapazität von 40 Arbeitsstunden je Woche; die CNC-Maschine 40 operative Produktionsstunden je Woche. Das sind getrennte Kapazitätspools, keine pauschale Gleichsetzung von Personal- und Maschinenstunden. A02-Startprofilzuordnung: `MA-CNC` bedient Arbeitsgänge 20 und 30; `MA-PROD` bedient 10 und 40; `MA-AV` stellt je Auftrag die unten aufgeführte Planungszeit bereit. Keine Überstunden-, Ausfall- oder Urlaubsmechanik wird ergänzt. Konkrete Verteilung der Wochenkapazität auf einzelne Kalendertage bleibt bis zur Festlegung des Arbeitskalenders offen.

**Periodenende:** Am Monatsletzten werden zuerst alle Tagesphasen 1–9 abgeschlossen, danach werden periodische Kosten/BAB-Ereignisse für die Periode ausgelöst. Ein auf den nächsten Arbeitstag verschobenes Ereignis erhält sein wirksames Datum als Simulationsereignisdatum; ob es zusätzlich in die Ursprungs- oder Folgemonatsauswertung gehört, ist mit A03 noch festzulegen. Periodenabschluss schreibt keine Ereignisse rückwirkend um.

## A1. Deterministisches Startauftragsprofil (A02-Szenariowerte)

Alle drei Aufträge sind zum Simulationsstart 01.01.2027 im Zustand `BESTÄTIGT`; kein Arbeitsgang ist begonnen oder abgeschlossen. Die für sie nötigen Materialmengen sind im Anfangsbestand vollständig reserviert, aber noch nicht verbraucht. `K-01` bis `K-03` sind profilinterne stabile Kundenreferenzen, keine Behauptung über die noch fehlenden Kundennamen. Mengen sind vollständige Auftragsmengen; keine Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung. Termine sind zugesagte vollständige Liefertermine, nicht garantierte Fertigstellungsergebnisse.

| ID | Profil / Kunde | Auftragsmenge | Vollständiger Liefertermin | Planungszeit MA-AV |
|---|---|---:|---|---:|
| `ORD-START-01` | Großer Serienauftrag / `K-01` | 20 Teile | 29.01.2027 | 5 h |
| `ORD-START-02` | Mittlerer Auftrag / `K-02` | 8 Teile | 22.01.2027 | 3 h |
| `ORD-START-03` | Kleiner technisch anspruchsvoller Auftrag / `K-03` | 2 Teile | 15.01.2027 | 2 h |

Diese Mengen und Termine sind einzeln austauschbare Fixture-Werte für den Startzustand. Vollständige Kundenbezeichnungen, Spezifikation/Zeichnungsrevision, Verkaufspreis, Zahlungsziel, Rechnungs-/Eröffnungsbezug und reale Lieferverbindlichkeit müssen im kanonischen Unternehmensprofil ergänzt werden; sie werden hier nicht erfunden.

### Übriger fester Unternehmensstart

| Bereich | Festgelegter A02-Startwert | Noch nicht daraus ableiten |
|---|---|---|
| Stichtag | 01.01.2027 | lokaler Feiertags-/Betriebskalender |
| Betrieb | bestehendes Maschinenbauunternehmen, gemietete Betriebsfläche | Rechtsform, Miete und Nebenkostenbeträge |
| Finanzierung | 50.000 € Gesamtfinanzierungs-/Budgetrahmen: 30.000 € Anfangsliquidität und 20.000 € verbleibender Rahmen | Verfügbarkeit des Restbetrags als Kredit/Cash; keine automatische Auszahlung |
| Maschine `CNC-01` | gebrauchte CNC-Fräsmaschine, 8 Jahre, ursprünglicher Anschaffungswert 120.000 €, Buchwert 40.000 €, höchstens 1.600 operative h/Jahr und 40 operative h/Woche | Abschreibungs-, Wartungs-, Ausfall- oder Stundensatz (A03/weitere Regeln) |
| `MA-CNC` | CNC-Fachkraft, 3.800 € brutto/Monat, 40 h/Woche | Arbeitgeber-Gesamtkosten, Arbeitstage/-stunden je Tag, Urlaub/Ausfall |
| `MA-PROD` | Produktionsmitarbeiter, 3.100 € brutto/Monat, 40 h/Woche | Arbeitgeber-Gesamtkosten, Arbeitstage/-stunden je Tag, Urlaub/Ausfall |
| `MA-AV` | kaufmännisch/Arbeitsvorbereitung, 3.500 € brutto/Monat, 40 h/Woche | Arbeitgeber-Gesamtkosten, administrative Arbeit außerhalb der gelisteten Auftragsplanung |
| Material | Stahl 2.000 kg à 3,20 €; Aluminium 800 kg à 5,50 €; Norm-/Zukaufteile 1.000 St. à 2,00 € | E3-Bewertungs-/Steuerbasis wird durch A03 festgelegt |
| Offene Posten | Forderungen 12.500 €; Lieferantenverbindlichkeiten 7.500 € | Einzelbelege, Parteien, Auftrag, Leistungs-/Rechnungsdatum und Fälligkeit |

Damit bleiben Restbudget und tatsächlicher Zahlungsmittelbestand explizit getrennt. Die drei Startaufträge und ihr Materialbedarf sind zusätzliche operative Anfangswerte; A03 verantwortet Bewertungs-, Steuer-, Eröffnungs- und Liquiditätsbehandlung.

### Standardarbeitsgänge und Auftragslast

Arbeitsgänge werden pro Auftrag in aufsteigender Reihenfolge abgeschlossen. Aufwände sind volle Arbeitsstunden für den gesamten Auftrag; Arbeit darf zeitlich über mehrere Tage/Wochen fortschreiten, aber es entstehen keine fertigen Teilmengen. Maschinenstunden fallen ausschließlich bei Arbeitsgang 20 an. Der CNC-Mitarbeiter führt 20 und anschließend 30 aus; der Produktionsmitarbeiter führt 10 und 40 aus. Die MA-AV-Planungsstunden sind ein eigener Personalaufwand, nicht Maschinenzeit.

| Nr. | Arbeitsgang | Ressource | ORD-START-01: 20 St. | ORD-START-02: 8 St. | ORD-START-03: 2 St. |
|---:|---|---|---:|---:|---:|
| 10 | Materialbereitstellung | `MA-PROD` | 12 h | 5 h | 4 h |
| 20 | CNC-Fräsen | `MA-CNC` + CNC-Maschine | 60 Personal-h / 60 Maschinen-h | 24 / 24 | 10 / 10 |
| 30 | Qualitätskontrolle | `MA-CNC` | 16 h | 6 h | 6 h |
| 40 | Verpackung/Versand | `MA-PROD` | 10 h | 4 h | 3 h |

| Auftrag | Stahl | Aluminium | Norm-/Zukaufteile |
|---|---:|---:|---:|
| `ORD-START-01` | 120 kg | 60 kg | 40 Stück |
| `ORD-START-02` | 40 kg | 20 kg | 12 Stück |
| `ORD-START-03` | 12 kg | 10 kg | 4 Stück |
| **Gesamtbedarf** | **172 kg** | **90 kg** | **56 Stück** |
| **Eröffnungsbestand** | **2.000 kg** | **800 kg** | **1.000 Stück** |
| **Rest nach Auftragsreservierung** | **1.828 kg** | **710 kg** | **944 Stück** |

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

**Zeit und Phasen:** Das bestätigte Wochenraster/Monatsabschluss- und Tagesphasenmodell steht im Abschnitt „Verbindliche P0-Regeln“. Zeitvorschub verarbeitet alle Zwischentage. Im Wochenraster werden Wochen-/Monatswerte aggregiert; Ereignisse bleiben tagesgenau. Wochenendverschiebungen, Same-day-Abhängigkeiten und die Reihenfolge von Phase 1–10 sind dort verbindlich. Noch offen sind Feiertagskalender/Standort, tägliche Stundenverteilung, Monatszuordnung eines auf den Folgemonat verschobenen Ereignisses, Ausführungspriorität konkurrierender fälliger Zahlungen sowie die kundenseitige Zahlungsregel. Seed ist nur erforderlich, wenn nach späterer Produktentscheidung Zufallsereignisse eingeführt werden.

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

- Arbeitskalender: Standort, Wochenarbeitstage, Feiertage und Verteilung der 40 Wochenstunden auf einzelne Tage; dieser Kalender bestimmt F3-Fristen, Kapazitätsauflösung und tatsächliche Arbeitstagsverschiebungen.
- Monatsgrenzen: Auswertungszuordnung eines auf Folgemonat verschobenen Ereignisses; Periodenkosten-Zeitpunkt/BAB-Auswertung liegt bei A03.
- Fälligkeit: Kalenderarithmetik/Weekend adjustment, Auswahl 14/30 je Vertrag, konkretes Kundenzahlungsverhalten; konkurrierende eigene Fälligkeiten bei nur teilweise ausreichender Liquidität, Retry-Zeitpunkt und Mahnintervalle (A03/Nutzer). Die Zahlungsrichtungen und Liquiditätswirkung sind oben getrennt festgelegt.
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

## Quellen

- [AGENTS.md](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/AGENTS.md)
- [Agentenstruktur](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/agent-structure.md) · [Goals](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/goals.md) · [Ticket-Board](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/ticket-board.md)
- [Collaboration State](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/collaboration-state.md) · [Decision Log](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/decision-log.md)
- [Architektur V0.2 – PROPOSED](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/architecture/architecture-v0.2.md) · [Checkpoint CP-0002](https://github.com/tobiashuebner93-glitch/WFWSimulation/blob/main/docs/agent-system/checkpoints/CP-0002.md)
