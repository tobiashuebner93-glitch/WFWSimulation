# Maschinenbau-MVP – fachliches und technisches Datenmodell

**Stand:** 2026-09-26 · **Rolle:** A04 DATABASE · **Bezug:** MG-000 / SLG-000.2 / T-0006 / D-0010  
**Status:** Datenmodellvorschlag zur Fachprüfung; CP-0022-Abgleich dokumentiert; Architektur V0.2 und ADRs bleiben PROPOSED.

## 1. Zweck und Grenzen

Dieses Dokument konkretisiert ein fachliches und logisches relationales Persistenzmodell für die operative Auftragsabwicklung eines bestehenden Maschinenbauunternehmens. Tabellen sind konzeptionelle persistente Objekte. Es ist weder Implementierungsspezifikation noch Architekturfreigabe. PostgreSQL, Supabase, physische Schemas, APIs, Aggregate-Grenzen und Transaktionsstrategie werden nicht beschlossen.

Das Modell trennt operative Fakten, Finanzdaten und Stammdaten. A02 ist fachlich autoritativ für Prozess, Simulation, Zeit, Mengen und operative Ereignisse. A03 ist autoritativ für Accounting-Regeln, Buchungen, Liquidität, Forderungs-/Verbindlichkeitssalden und Finanzresultate. A04 entscheidet Persistenzstrukturen, Schlüssel, Referenzen und technische Invarianten.

## 2. Leitplanken

- D-0010: bestehendes Startunternehmen, gemieteter Raum, eine Maschine und drei Beschäftigte. Bestätigter Simulationsstart ist 01.01.2027. Bankbestand 30.000 € gehört zu einem Gesamtfinanzierungs-/Budgetrahmen von 50.000 €; 20.000 € ungenutzter Rahmen sind weder Cash noch zusätzliche Passivposition. Eröffnungsbilanz siehe §4.1.
- V1 wickelt Aufträge vollständig ab. Teilproduktion, Teillieferung, Teilrechnung und Teilzahlung sind keine V1-Funktionen. Mengen und Referenzen bleiben für spätere Erweiterung geeignet.
- Beträge werden differenziert je Position und Bedeutung erfasst; ein einzelner Gesamtbetrag reicht nicht.
- Vertrag, Leistung, Rechnung, Forderung/Verbindlichkeit und Zahlung sind unterschiedliche Sachverhalte. Bestellung, Wareneingang und Lieferantenrechnung ebenso.
- Planwerte bleiben von Istkosten, Erlösen, offenen Posten und Liquidität getrennt. Es gibt keine konkurrierende Finanzlogik neben A03.
- Bestätigte/belegte Fakten werden nicht still überschrieben. Korrekturen referenzieren Ursprung oder erstellen eine neue Version.
- Technische IDs sind undurchsichtig; lesbare Dokumentnummern sind separat, je Unternehmen und Belegart eindeutig.

## 3. Fachliches Modell

### 3.1 Bereiche und Verantwortung

| Bereich | Objekte | Verantwortung |
|---|---|---|
| Unternehmen/Stammdaten | Company, Facility, Customer, Supplier, Material, Machine, Employee | Identität und beschreibende Daten; keine Finanzwahrheit. |
| Vertrieb/Vertrag | CustomerRequest, Calculation/Line, Quote/Version, SalesContract/Line, PaymentTerm | Anfrage, Kalkulationsannahmen, Angebotsversion, angenommener Umfang und Zahlungsvereinbarung. |
| Beschaffung/Bestand | PurchaseOrder/Line, Receipt/Line, InventoryMovement | Bestellung, akzeptierter Eingang, mengenmäßiger Bestand; Bewertung A03. |
| Produktion/Lieferung | ProductionRun/Line, ResourceConsumption, Delivery/Line, Acceptance | Operative Durchführung, positionsbezogene Mengen/Zeiten und Leistungsnachweis; Zeit/Phasen A02. |
| Accounting-Übergabe | CustomerInvoice, SupplierInvoice, Receivable, Payable, Payment/Allocation, FinancialFact | Beleg- und Herkunftsreferenzen; Ansatz, Buchungen, Salden und Finanzsichten A03. |
| Kostenrechnung | CostEntry, RevenueEntry, OrderResult, BabVersion/Line | Getrennte Fakten und BAB-Eingaben bzw. A03-Auswertung; kein zweites Ledger. |
| Simulation/Audit | SimulationRun, BusinessEvent, CommandRecord, AuditRecord | Zeit-/Regelkontext und Herkunft. Event Sourcing ist nicht beschlossen. |
| Späteres Lernen/Prüfen | freigegebene Lern-/Prüfungssnapshots | Separater lesender Kontext; kein operatives V1-Objekt. |

### 3.2 Beziehungen und Kardinalitäten

- Company 1:n CustomerRequest; Request 1:n Calculation; Calculation 1:n CalculationLine; Quote 1:n QuoteVersion.
- Customer 1:n Request, Quote und SalesContract. Eine angenommene QuoteVersion gehört zu höchstens einem SalesContract.
- SalesContract 1:n ContractLine, PaymentTerm, PurchaseOrder, ProductionRun, Delivery, CustomerInvoice, CostEntry, RevenueEntry und OrderResult.
- PurchaseOrder 1:n PurchaseOrderLine; jede ReceiptLine verweist auf eine Bestellzeile. Material 1:n InventoryMovement.
- ProductionRun 1:n ProductionRunLine; jede Laufposition referenziert genau eine ContractLine und ihre Menge/Einheit. ResourceConsumption verweist auf eine ProductionRunLine.
- Delivery 1:n DeliveryLine und 0:n Acceptance. CustomerInvoice 1:n InvoiceLine und 0:n Receivable.
- Vertragliche/operative Verpflichtung, entstandener offener Posten, SupplierInvoice und Payment sind getrennte Objekte. Ein Payable kann vor oder ohne SupplierInvoice bestehen; die Invoice kann später zugeordnet werden. Payment kann Vertrag/Zahlungstermin referenzieren, bevor Invoice oder Payable vorliegt; OP-Zuordnung bleibt gesondert.
- PaymentTerm n:m Payment über PaymentTermPayment; Payment kann zusätzlich über PaymentAllocation genau einem Receivable oder Payable zugeordnet werden. Ein Customer Receipt folgt Kundenverhalten und wird nicht durch eigene Liquidität konditioniert; ein automatischer Fälligkeitsversuch ist ausschließlich für eigene Payables vorgesehen. Vertragszuordnung und finanzielle OP-Verrechnung sind somit getrennte Beziehungen.
- ObligationSource 1:n Payable als strukturell mögliche Zuordnung, falls A03 eine Quelle in mehrere offene Posten aufteilt; SupplierInvoice n:m Payable über PayableInvoiceLink zur späteren Zuordnung/Abstimmung. Die fachliche Kardinalität und Betragsabstimmung bleiben A03-Regel.
- Company 1:n BabVersion; BabVersion 1:n BabLine. SimulationRun 1:n BusinessEvent; Ereignisse referenzieren operative/finanzielle Fakten.

Die Mehrfachbeziehungen ermöglichen spätere Erweiterung. In V1 blockiert die Geschäftsvalidierung Teilvorgänge und fordert vollständige Mengen. Für vollständige Lieferungen gilt F3: Nach Lieferung läuft eine Frist von fünf Arbeitstagen, wobei der Liefertag nicht zählt. Eine ausdrückliche Abnahme setzt den Abnahmetag. Eine innerhalb der Frist eingehende ausdrückliche Ablehnung verhindert die automatische Abnahme und führt in `ABLEHNUNG_IN_KLÄRUNG`; sie blockiert bis zur Klärung die automatische Abnahme und Rechnungsstellung. Liegt keine fristgerechte Ablehnung vor, erfolgt die automatische Abnahme am Ende des fünften folgenden Arbeitstags. Nach bestätigter ausdrücklicher oder automatischer Abnahme wird die vollständige Kundenrechnung automatisch erstellt. Gemäß G3 wird der Kundenauftrag erst geschlossen, wenn die vollständige Kundenforderung bezahlt ist; Lieferantenverbindlichkeiten blockieren diesen Kundenauftragsabschluss nicht. Der weitere fachliche Ablauf zur Auflösung einer Ablehnung bleibt offen.

### 3.3 Prozess- und Statusmodelle

| Objekt/Dimension | Statusvorschlag | Hinweise |
|---|---|---|
| Anfrage | `OPEN → QUALIFIED / DECLINED / EXPIRED / CONVERTED` | Keine Finanzwirkung. |
| Kalkulation | `DRAFT → CALCULATED → SUPERSEDED` | Versionierte Planwerte, keine Kostenbuchung. |
| Angebot | `DRAFT → ISSUED → ACCEPTED / REJECTED / EXPIRED / WITHDRAWN / SUPERSEDED` | Neue Version statt Überschreiben; Annahme referenziert exakte Version. |
| Operativer Auftrag | `CONFIRMED → BLOCKED / IN_PROGRESS → PRODUCTION_COMPLETE → DELIVERED → ACCEPTED → INVOICED → CLOSED`; alternativ `CANCELLED` | A02 bestimmt Übergänge. Automatische Rechnung nach positiver/automatischer Abnahme; G3 schließt erst nach vollständiger Kundenzahlung. |
| Beschaffung | `DRAFT → PLACED → FULFILLED / CANCELLED`; Verzögerung als Ereignis/Flag | Eingang bleibt eigenes Objekt. |
| Eingang | `RECORDED → ACCEPTED / REJECTED / REVERSED` | Mengenereignis A02, Finanzwirkung A03. |
| Produktion | `PLANNED → READY → IN_PROGRESS → COMPLETED / BLOCKED / CANCELLED` | V1 keine Teilfertigung; BLOCKED ist rücknehmbar. |
| Lieferung/Abnahme | Delivery `PREPARED → DISPATCHED → DELIVERED`; Acceptance `PENDING → ACCEPTED / REJECTED` | F3: fünf Arbeitstage nach Lieferung (Liefertag zählt nicht); fristgerechte Ablehnung verhindert automatische Abnahme und Rechnung, sonst automatische Abnahme nach Frist. |
| Rechnung | `DRAFT → ISSUED` (Kunde) / `RECEIVED` (Lieferant) → `VOIDED / CORRECTED` | Belegstatus getrennt von Zahlung. |
| Forderung/Verbindlichkeit | `OPEN → PARTIALLY_SETTLED → SETTLED`; `OVERDUE` abgeleitet | Teilzahlung in V1 nicht erreichbar; A03 berechnet Rest und Fälligkeit. |
| Eigener Verbindlichkeits-Zahlungsversuch | `PENDING → SUCCEEDED / FAILED` | Nur für fälliges Payable: automatischer Vollzahlungsversuch mit Prüfung eigener Liquidität; bei Fehlschlag keine Teilzahlung/Bewegung, voller OP bleibt offen. |
| Zahlungseingang / Zahlungsausgang | `RECORDED → CONFIRMED / REVERSED` | Erfolgreicher Zahlungseingang folgt Kundenverhalten ohne Cash-Gate, erhöht Liquidität und reduziert/schließt Receivable. Zahlungsausgang ist tatsächliche volle Erfüllung eines Payables nach erfolgreichem Versuch. |
| Mahnfall eigene Verbindlichkeit | `OPEN → REMINDER / DUNNING → ESCALATED → SEIZURE / LIQUIDATION` | V1-Eskalationspfad nach fehlgeschlagenem Payable-Versuch; gilt nicht für Kundeneingänge. Fristen, Schwellen und Rechtsfolgen nicht festgelegt. |
| Auftragsergebnis | `PROVISIONAL → FINAL / REVISED` (mit Version) | A03-Sicht; operativer Abschluss finalisiert Finanzresultat nicht automatisch. |

Operativer Auftragsstatus, Beschaffungsstatus, Rechnungsstatus, OP-Status und Zahlungsstatus sind unabhängig. Überfälligkeit wird aus Simulationsdatum und offenem Rest abgeleitet.

## 4. Technisches Modell: logische Tabellen

Konzeptionelle Typen: `UUID`/opaque ID, `TEXT`, `ENUM` oder Referenztabelle, `BOOLEAN`, `INTEGER`, `DECIMAL(p,s)`, `DATE`, `TIMESTAMP WITH TIME ZONE`. Geldbeträge verwenden Dezimalwerte, keine binären Fließkommazahlen. Mengen-/Stundenpräzision, Währung und Steuersemantik bleiben offen. Jedes Objekt erhält PK, nötige FKs, Erstellungszeit und Herkunftsreferenz; nur Entwürfe erhalten überschreibbares `updated_at`.

### 4.1 Stammdaten und Startunternehmen

| Tabelle | PK / wichtige Felder | Constraints / Regeln |
|---|---|---|
| `company` | `company_id`; `name`, `profile_code` | Profilcode eindeutig, wenn verwendet; bei Historie archivieren. |
| `facility` | `facility_id`; FK `company_id`; `facility_type`, `tenure_type`, Gültigkeitszeitraum | Startobjekt `RENTED`; Kosten/Konditionen nach A03-Regel. |
| `customer`, `supplier` | jeweiliger PK; FK `company_id`; Name, Referenzcode, Kontakt, `active` | Referenzcode optional je Firma eindeutig; historisch genutzte Parteien nicht löschen. |
| `material` | `material_id`; FK `company_id`; `code`, `name`, `unit_code`, Spezifikation | Materialcode je Firma eindeutig; Einheit referenziert. |
| `machine` | `machine_id`; FK `company_id`, optional `facility_id`; Code, Typ, Gültigkeit | Code je Firma eindeutig; CNC-01 hat 40 Betriebsstunden/Woche und 1.600 Betriebsstunden/Jahr, separat von Personalkapazität. |
| `employee` | `employee_id`; FK `company_id`; Rollenkennung, Qualifikationen, Gültigkeit | MA-CNC, MA-PROD, MA-AV: je 40 Arbeitsstunden/Woche. Arbeitsgang-Zuordnung: MA-PROD 10/40, MA-CNC 20/30, MA-AV Planung. |
| `resource_capacity` | `capacity_id`; Ressourcentyp, Ressourcen-ID, Periode, Kapazitätswert, Einheit, Regelversion | Getrennte Kapazitätsdatensätze je Mitarbeiter und Maschine; Wochen-/Jahresgrenzen gemäß bestätigtem A02-Profil. Tagesverteilung bleibt offen. |
| `unit_of_measure` | `unit_code`; Bezeichnung, Dimension | Inkompatible Maße nicht verrechnen. |
| `opening_balance` | `opening_balance_id`; FK `company_id`; `balance_type`, Betrag, Währung, Stichtag, Quelle | Stichtag 01.01.2027. Eröffnungspositionen sind die untenstehenden Bilanzpositionen; Bilanzsumme ausgeglichen. |
| `opening_balance_line` | `opening_balance_line_id`; FK `opening_balance_id`; `accounting_category`, Betrag, Währung, Gegenpartei-/Asset-Referenz falls bekannt | Bank 30.000 €, Forderungen 12.500 €, Vorräte 12.800 €, Maschine (Buchwert) 40.000 €, Lieferantenverbindlichkeiten 7.500 €, Maschinendarlehen 24.000 €, Eigenkapital 63.800 €. Einzelbelege/Parteien der aggregierten OP bleiben offen. |
| `funding_envelope` | `funding_envelope_id`; FK `company_id`; Gesamtgrenze, beanspruchter Bankbestand, ungenutzter Rahmen, Stichtag | Gesamt 50.000 € = 30.000 € Bankbestand + 20.000 € ungenutzter Rahmen. Ungenutzter Rahmen ist weder Cash noch zusätzliche Passivposition; keine automatische Ziehung unterstellt. |

Startprofil: eine Firma, ein gemieteter Facility-Datensatz, eine Maschine und drei Mitarbeiter. Weitere Werte werden nicht erfunden.

Eröffnungsbilanz am 01.01.2027: Aktiva = Bank 30.000 € + Forderungen 12.500 € + Vorräte 12.800 € + Maschine (Buchwert) 40.000 € = **95.300 €**. Passiva und Eigenkapital = Lieferantenverbindlichkeiten 7.500 € + Maschinendarlehen 24.000 € + Eigenkapital 63.800 € = **95.300 €**. Der separate 20.000-€-Rest des Finanzierungs-/Budgetrahmens ist außerhalb der Bilanz und nicht liquide.

### 4.2 Vertrieb, Kalkulation, Angebot, Vertrag

| Tabelle | PK / wichtige Felder | Constraints / Beziehungen |
|---|---|---|
| `customer_request` | `request_id`; FK `company_id`, `customer_id`; `request_no`, Simulationszeit, Spezifikation, Menge/Einheit, Wunschtermin, Status | Requestnummer je Firma eindeutig; Menge > 0. |
| `calculation` | `calculation_id`; FK `request_id`; Versionsnummer, Status, Regelversion, Zeitpunkt, Annahmen | Unique (`request_id`,`version_no`); publizierte Version unveränderlich. |
| `calculation_line` | `calculation_line_id`; FK `calculation_id`; Kategorie, Beschreibung, Menge/Einheit, Satz, Betrag, Bezugsbasis, Annahmenflag | Dezimalbeträge; Planwert, nicht `cost_entry`. |
| `quote` / `quote_version` | IDs; FK Request/Customer/Calculation; `quote_no`, Version, Gültigkeit, Währung, Status, Preisbasis, `terms_snapshot` | Nummer je Firma eindeutig; Version je Quote eindeutig; ausgegebener Stand immutable. |
| `quote_line` | `quote_line_id`; FK QuoteVersion; Beschreibung, Menge, Einheit, Einzel-/Zeilenbetrag | Zeilenweise Preise; ausgegebene Zeile nicht überschreiben. |
| `sales_contract` | `contract_id`; FK Firma/Kunde und angenommene QuoteVersion; Nummer, Status, Bestätigung, Liefertermin, Währung, Konditionssnapshot, Version | Vertragsnummer je Firma eindeutig; exakte Angebotsversion referenzieren. |
| `contract_line` | `contract_line_id`; FK Contract; Zeilennummer, Beschreibung, Menge/Einheit, vereinbarter Einzel-/Zeilenbetrag, Spezifikation | Unique Vertrag+Zeilennummer; Menge positiv. |
| `payment_term` | `payment_term_id`; FK Contract; Richtung, Sequenz, Trigger, Triggerreferenz, Fälligkeitsregel, Anteil/Betrag, Bemessungsbasis | Unique Vertrag+Richtung+Sequenz. Ermöglicht spätere Anzahlungen/Mehrtermine; Regeln/V1-Varianten offen. |
| `payment_term_payment` | PK `term_payment_id`; FK `payment_term_id`, `payment_id`; `applied_amount`, `recorded_at` | Verknüpft Zahlung und vereinbarten Vertragstermin; mehrere Zahlungen pro Termin und Termine pro Vertrag möglich. Vertragliche Zuordnung allein bestimmt weder Anzahlungsklassifikation noch Bilanz-/Steuerwirkung. |

Vertragskonditionen werden als unveränderlicher Snapshot aufbewahrt. Der strukturierte Zahlungstermin entscheidet keine Anzahlungslogik.

### 4.3 Beschaffung, Bestand, Produktion, Lieferung

| Tabelle | PK / wichtige Felder | Constraints / Beziehungen |
|---|---|---|
| `purchase_order` | `purchase_order_id`; FK Firma, Supplier, optional Contract; Nummer, Status, Bestell-/Erwartungsdatum, Währung, Konditionssnapshot | Nummer je Firma eindeutig; Bestellung ist nicht automatisch Verbindlichkeit/Zahlung. |
| `purchase_order_line` | `purchase_order_line_id`; FK PO, optional Material/ContractLine; Zeilennummer, Menge/Einheit, Einzel-/Zeilenbetrag, Serviceflag | Unique PO+Zeile; Menge positiv. |
| `receipt` / `receipt_line` | IDs; FK PO und PO-Line; Belegnummer, Erfassungszeit, Status, angenommene Menge/Einheit/Preis, Quell-Event | Receipt-Nummer je Firma eindeutig; V1 verlangt volle Annahme gemäß späterer Regel. |
| `service_acceptance` | `service_acceptance_id`; FK `purchase_order_line_id`; `status`, `accepted_at`, Leistungsreferenz, Nachweis, `source_event_id` | Separater Lieferanten-Fremdleistungsnachweis; nicht mit Kundenabnahme (`acceptance`) verwechseln. Finanzwirkung A03. |
| `inventory_movement` | `movement_id`; FK Firma/Material, optional ReceiptLine/Contract/ProductionRun; Bewegungsart, Mengenänderung, Einheit, Wirksamkeitszeit, Bewertungsreferenz, Source-Event, Umkehrreferenz | Append-only; Korrektur referenziert Original. Wertansatz A03, Bestandsregel A02. |
| `production_run` | `production_run_id`; FK Contract; Laufnummer, Status, Start/Ende, Regelversion, Quell-Event | Unique Vertrag+Laufnummer; Lauf ist Container für positionsbezogene Mengen. |
| `production_run_line` | `production_run_line_id`; FK `production_run_id`, FK `contract_line_id`; `planned_quantity`, `completed_quantity`, `unit_code`, `status` | Verknüpft Lauf und konkrete Vertragsposition. Mehrere Läufe können später dieselbe Position teilweise fertigen. V1-Validierung verlangt Gesamtmenge und deaktiviert Teilfertigung. |
| `resource_consumption` | `consumption_id`; FK `production_run_line_id`, optional Material/Machine/Employee; Ressourcentyp, Menge/Einheit, Zeitpunkt/Periode, Kostensatzreferenz, Source-Event, Umkehrreferenz | Verbrauch eindeutig positionsbezogen; Ressource passend zum Typ; Istverbrauch getrennt von Kalkulation. |
| `delivery` / `delivery_line` | IDs; FK Contract und ContractLine; Nummer, Status, vorbereitet/versandt/geliefert, Trägerreferenz, Menge/Einheit, Source-Event | Nummer je Firma eindeutig; V1 verlangt Gesamtlieferung. Spätere Mehrfachbelege möglich. |
| `acceptance` | `acceptance_id`; FK Delivery; Status, Zeitpunkt, Nachweis, Notizen, Fristende, Ablehnungsereignis | F3-Frist/Auto-Abnahme entsprechend Statusmodell; automatische Abnahme nach fünf Arbeitstagen ohne fristgerechte Ablehnung. |

### 4.4 Rechnungen und Finanzobjekte

| Tabelle | PK / wichtige Felder | Constraints / Eigentümerschaft |
|---|---|---|
| `customer_invoice` | `customer_invoice_id`; FK Firma/Contract, optional Delivery; Nummer, Status, Ausstellungs-/Leistungs-/Fälligkeitsdatum, Währung, Betragstyp, Zwischensumme, Steuerbetrag, Gesamtbetrag, Korrektur- und Eventreferenz | Nummer je Firma eindeutig. SimTAX-Simulationseinstellung: 19 %; keine rechtliche Steuerlogik. Je Position auf Cent runden, danach Zeilensteuerbeträge summieren. |
| `customer_invoice_line` | `invoice_line_id`; FK Invoice, optional ContractLine/DeliveryLine; Beschreibung, Menge/Einheit, Einzelpreis, Netto-, Steuersatz-, Steuer-, Bruttobetrag, Steuerkennung, Rundungsregelversion | SimTAX: 19 % pro Rechnungsposition; Positionssteuer auf Cent gerundet, Rechnungssumme ist Summe gerundeter Positionen. Steuergrundlage und Halbcent-Konvention OFFEN, nicht durch A04 ergänzt. |
| `supplier_invoice` / `supplier_invoice_line` | IDs; FK Supplier, optional PO/Receipt; Nummer, Datum/Fälligkeit, Status und differenzierte Linienbeträge | Rechnung referenziert Eingang/Bestellung und kann später einer Verpflichtung zugeordnet werden; ist keine notwendige Vorbedingung für Payable. |
| `obligation_source` | `obligation_source_id`; FK Firma/Supplier, optional Contract/PO; `source_type` (`CONTRACTUAL_COMMITMENT`, `ACCEPTED_RECEIPT`, `ACCEPTED_SERVICE`, `OTHER`), optional FK ReceiptLine oder `service_acceptance_id`, `occurred_at`, `source_event_id`, Beschreibung | Hält vertraglichen/operativen Ursprung unabhängig von Invoice und Payable. Erzeugt selbst keine Verbindlichkeit/Buchung. Source-Type, genau eine Ursprungsreferenz und deren Partei müssen zusammenpassen. |
| `receivable` | `receivable_id`; FK Firma, Kunde, CustomerInvoice, optional Contract; Ursprung, Ansatz-/Fälligkeit, Währung, Hauptbetrag, Status, Korrekturreferenz | Ansatz, Restbetrag und Saldo A03; keine zweite Finanzwahrheit. |
| `payable` | `payable_id`; FK Firma/Supplier und `obligation_source_id`; optionale Fälligkeit/Währung; Betrag, Ansatzzeit, Status, Korrekturreferenz | SupplierInvoice-FK nicht zwingend. A03 bestimmt, ob und wann der Ursprungsfakt eine Verbindlichkeit wird und welcher Betrag/Fälligkeit gelten. |
| `payable_invoice_link` | PK `payable_invoice_link_id`; FK Payable, SupplierInvoice, optional SupplierInvoiceLine; abgestimmter Betrag, Zuordnungsstatus | Verknüpft Rechnung nachträglich mit einer oder mehreren Verbindlichkeiten; Dokumentbeziehung, keine Buchungsregel. |
| `payable_payment_attempt` | `payment_attempt_id`; FK `payable_id` (nur eigene Verbindlichkeit), optional FK erfolgreicher `payment_id`; angeforderter Gesamtbetrag, Ergebnis `SUCCEEDED/FAILED`, Zeitpunkt, Grundcode, Source-Event | Fälligkeit löst automatischen Vollzahlungsversuch aus. Nur bei ausreichender eigener Liquidität wird der volle Betrag gezahlt; andernfalls keine Teilzahlung, voller Payable bleibt offen, Versuch FAILED, keine Payment-/Cashbewegung und keine negative Liquidität. Dieses Objekt wird nie für Kundeneingänge verwendet. |
| `dunning_case` / `dunning_event` | IDs; FK `payable_id` und `payable_payment_attempt_id`; Stufe, Ereigniszeit, Ergebnis, Source-Event | Ausschließlich eigene Verbindlichkeit: fehlgeschlagener Fälligkeitsversuch → Mahnung/Dunning → weitere Eskalation → gegebenenfalls Pfändung/Seizure oder Liquidation. Keine Fristen, Schwellenwerte, Gebühren oder Rechtswirkungen vorgegeben. |
| `payment` | `payment_id`; FK Firma, `direction` (`CUSTOMER_RECEIPT` / `OWN_PAYMENT`), genau eine Kunden-/Lieferantenpartei; optionale FK `contract_id`; Nummer, Status, Zahlungszeit, Währung, Betrag, externe Referenz, Umkehrreferenz, Source-Event | Speichert ausschließlich tatsächlich erfolgte Zahlung. Kundeneingang entsteht gemäß Kundenverhalten ohne Prüfung eigener Liquidität; erhöht Liquidität und wird dem Receivable zugeordnet. Eigener Ausgang wird nach erfolgreichem Payable-Vollzahlungsversuch gespeichert und mindert Liquidität. Richtung und Parteiart müssen zusammenpassen. |
| `payment_allocation` | `allocation_id`; FK Payment und genau einer Receivable/Payable; zugeordneter Betrag | CHECK genau ein Ziel; Zieltyp muss zur Zahlungsrichtung passen (Kundeneingang→Receivable, eigener Ausgang→Payable). V1 verlangt volle Zahlung; spätere m:n-Zuordnung möglich. |
| `financial_fact` | `financial_fact_id`; FK Firma, optional Contract; Source-Event, Faktart, Wirksamkeits-/Ansatzzeit, Periode, Betrag/Währung, Kategorie, Partei-/Belegreferenz, Umkehrreferenz, Regelversion | Unveränderliche Übergabefakten, falls nicht A03-eigen persistiert. Keine Buchung/Saldoformel; Eigentümerschaft A03/A11 zu klären. |

Steuerbeträge folgen im SimTAX-P0 der oben dokumentierten 19-%-Einstellung mit Rundung je Position auf Cent und anschließender Summierung; dies beansprucht keine rechtliche Steuersemantik. Finanzobjekttabellen sind ein Informationsmodell: A03/A11 prüfen, welche davon A03-eigen, Schnittstellenobjekt oder Projektion sind.

### 4.5 Kosten, Erlös, Auftragsergebnis und BAB

| Objekt | PK / Kernfelder | Grenze |
|---|---|---|
| `cost_entry` | ID, Firma, optional Contract/ProductionRun/PO; Kategorie, Menge/Einheit, Satz/Betrag, Entstehungszeit/Periode, Source-Event, Umkehrreferenz | Kostenansatz und Bewertung A03; Planwerte separat. |
| `revenue_entry` | ID, Firma, Contract, optional Invoice; Kategorie, Betrag, Ansatzzeit/Periode, Source-Event, Umkehrreferenz | Erlösansatz A03; Angebot/Zahlung ist nicht automatisch Erlös. |
| `order_result` | ID, Contract, Version, Bezugszeit, Status, Planerlös, Ist-Erlös, direkte Istkosten, Gemeinkostenanteil, Ergebnis, Regelversion | Versionierte A03-Projektion, nicht unabhängig durch A02/A04 berechnet. |
| `liquidity_movement` | ID, Firma, optional Payment/OpeningBalance; Richtung, Betrag/Währung, Wirksamkeitszeit, Herkunft | A03-Sicht; jede Bewegung auf Startfakt oder bestätigte Zahlung zurückführbar. Kein Bestandscounter als Konkurrenz. |
| `bab_version` | ID, Firma, Version, Gültigkeit, Status, Methode, Regelversion | Versionierte V1-Eingabe, statisch/vereinfacht erlaubt. |
| `bab_line` | ID, BabVersion, Zeile, Kostenstelle/-art, Betrag/Satz, Verteilungsbasis, Zielkategorie, Periode | Konkrete Stellen, Schlüssel und Raten durch A03/Nutzer zu entscheiden; später dynamische Treiber möglich. |

### 4.6 Simulation und Audit

| Tabelle | Kernfelder | Regel |
|---|---|---|
| `simulation_run` | ID, Firma, Simulationsuhr, Startdatum, Regel-/Modulversion, Seedreferenz, Status | Fester Start 01.01.2027; Wochenraster mit Ereignissen auf konkreten Kalendertagen, flexible Zeitfortschreibung; Wochenendtermine auf nächsten Arbeitstag. |
| `simulation_phase_rule` | Regelversion, Phasennummer, Phasencode, Gültigkeitsbereich | Deterministische Tagesphasen: Spielerentscheidungen → Wareneingang/externe Leistung → Produktion/Materialverbrauch → Produktionsabschluss → Lieferung → Abnahme → Rechnung → fällige Zahlungen → Tagesabschluss → periodische Kosten. Same-day-Abhängigkeiten dürfen in späteren Phasen desselben Tages weiterlaufen; frühere Phasen werden nicht erneut geöffnet. |
| `business_event` | Event-ID, Run, Ereignisart, Aggregattyp/-ID, Simulations-/Erfassungszeit, Kalendertag, Phasencode, Sequenz, Schema-Version, Causation/Correlation, Payloadreferenz | Herkunft und deterministische Reihenfolge einschließlich Phase/Tag; konkreter Datumstempel trotz Wochenraster. |
| `command_record` | Command-ID, Run, Typ, Einreicher, erwartete Version, Idempotenzschlüssel, Ergebnis, Eventreferenz | Command ist Absicht, kein bestätigtes Faktum. |
| `audit_record` | ID, Entität, Aktion, Actor, Erfassungszeit, Grund, Vorher/Nachher-Referenz, Korrelation | Append-only soweit möglich; Aufbewahrung/Zugriff offen. |

Vollständiges Event Sourcing ist nicht beschlossen. Snapshots, Replay und Retention benötigen A11-Prüfung.

## 5. Integrität, Änderungen und Löschung

- PKs stabil, Geschäftsschlüssel separat und pro Firma/Belegart unique. FK-Beziehungen verhindern verwaiste Belege.
- Historisch verwendete Daten werden nicht per Kaskade gelöscht. Kaskade allenfalls bei unveröffentlichten Entwürfen.
- Zeilen-Constraints sichern positive Mengen, Dezimalbeträge, Versionsnummer > 0, eindeutige Zeilennummern, genau eine Gegenpartei und genau ein Zahlungsziel. Zulässige Vorzeichen bestätigt A03.
- Summen, keine Überlieferung, Vollzahlung, Statusfolge und Bestand sind transaktionale Fachvalidierungen, keine simplen Zeilen-Constraints.
- Ausgegebene Angebote, bestätigte Verträge, Eingänge, Lieferungen, Rechnungen, bestätigte Zahlungen, Kosten-/Erlösfakten und Auditdaten werden nicht still gelöscht/überschrieben. Korrekturen referenzieren Ursprung und Grund.
- `updated_at` ersetzt keine Historie. Angebot, Kalkulation, Vertrag, BAB und Auftragsergebnis sind versioniert.
- Erfassungszeit (`recorded_at`) und Simulations-/Wirksamkeitszeit (`occurred_at_sim`, `effective_at`, `recognized_at`) sind getrennt; Zeitzone, Kalender und Perioden bleiben offen.
- A02→A03-Übergaben tragen stabile Quell-Event-ID und fachliche Referenzen; wiederholte Zustellung darf keine Dublette erzeugen. A03 bestätigt die Verarbeitung unabhängig vom Operationsstatus.

## 6. V1-Invarianten und Schnittstellen

V1-Validierungsregeln:

1. Angebot erzeugt keine Forderung oder realisierten Erlös und bindet keine Produktion.
2. Auftrag referenziert die angenommene Angebotsversion oder eine dokumentierte Abweichung.
3. Operative Vollständigkeit verlangt vollständige bestätigte Gesamtmenge und Lieferung; Abnahme-/Abschlussregel bleibt A02/Nutzerentscheidung.
4. V1-Commands bieten keine Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung an, auch wenn Tabellen später mehrere Vorgänge erlauben.
5. Rechnungssummen bleiben differenziert, ohne Steuersemantik vorwegzunehmen.
6. Bestellung, Eingang, Rechnung, Kostenansatz, offener Posten und Zahlung sind getrennte Tatsachen.
7. Zahlungsrichtungen sind getrennt: Kundeneingänge folgen Kundenverhalten ohne Prüfung eigener Liquidität; tatsächlicher Eingang erhöht Liquidität und reduziert/schließt die Forderung. Nur eigene Payables lösen bei Fälligkeit einen automatischen Vollzahlungsversuch aus. Bei unzureichender Liquidität bleibt der volle OP offen, es gibt keine Teilzahlung/Bewegung/negative Liquidität, der Fehlschlag wird dokumentiert und führt in den V1-Dunning-Fluss.
8. Planwerte bleiben getrennt; Istkosten, Erlös, OP, Liquidität und Ergebnis stammen aus A03.
9. Jede Übergabe ist idempotent und bis Ereignis, Auftrag, Partei und Beleg rückverfolgbar.

| Richtung | Übergabe / Ansicht | Grenze |
|---|---|---|
| A02 → Persistenz | Bestätigtes Ereignis mit stabiler ID, Auftrag/Ressource, Mengen/Zeiten, Simulationszeit, Regelversion, Statusgrund | A02 setzt operative Fakten, keine Finanzsalden. |
| Persistenz → A03 | Zahlungskondition; Eingang/Fremdleistung; Materialverbrauch/Arbeits-/Maschinenzeit; Lieferung/Abnahme; Rechnung; Partei, Auftrag, Periode, Korrekturbezug | A03 entscheidet Ansatz, Bewertung, OP, Buchung, Zahlung und Finanzsichten. Übergabe idempotent. |
| A03 → Persistenz/A02 | Verarbeitungsreferenz und autoritative Rechnungs-/OP-/Kosten-/Erlös-/Liquiditäts-/Ergebnisprojektionen bzw. Accounting-IDs | A02/A04 berechnen keine konkurrierenden Finanzsalden. Ablage mit A03/A11 abstimmen. |
| Persistenz/Application → A05 | Auftrags-Read-Model mit Statusdimensionen, Angebotsversion, Mengen-/Lieferfortschritt, Rechnungs-/OP-Status, A03-Sicht und Bezugszeit, Blocker | Frontend liest freigegebene Sichten und sendet Commands über Application Layer; kein direkter Ledger-Schreibzugriff. |
| Simulation → spätere A06/A07 | Minimierter, freigegebener, versionierter Lern-/Prüfungskontext | Lesend; kein Lern-/Prüfungsschema in V1. |

Informationsverträge sind keine API- oder Deploymentfestlegung. A11 prüft die Systemgrenzen.

## 7. Spätere Erweiterungen (nicht V1)

| Erweiterung | Vorgesehener Pfad | Im MVP deaktiviert/offen |
|---|---|---|
| Teilproduktion | `production_run_line` bindet jeden Lauf an `contract_line` mit eigener Plan-/Fertigmenge und Einheit; Ressourcenverbrauch referenziert die Laufposition | A02 entscheidet Los-/Zeitregeln. V1 verlangt vollständige Positionsmengen und aktiviert keine Teilproduktion. |
| Teillieferung/-rechnung | mehrere Delivery-/Invoice-Belege mit Zeilenreferenzen | V1 verlangt Gesamtlieferung/-abrechnung. |
| Anzahlungen/mehrere Termine | sequenzierte PaymentTerms und mehrere OPs/Zahlungen | V1-Varianten/Trigger Nutzer, A02, A03. |
| Teilzahlung | PaymentAllocation zu mehreren OPs; Restbetrag A03 | In V1 keine Teilzahlung; Überzahlung/Rückzahlung offen. |
| Mahnung/Inkasso | Nur eigene Verbindlichkeiten: fehlgeschlagener Fälligkeitsversuch → Mahnung/Dunning → weitere Eskalation → gegebenenfalls Pfändung/Seizure oder Liquidation | Keine Schwellenwerte, Fristen, Gebühren oder Rechtsfolgen festgelegt. Kundeneingänge unterliegen diesem Cash-Gate/Dunning-Pfad nicht. |
| Dynamische Kostenrechnung | versionierte BAB-Treiber, Kostenstellen, Kostenarten | A03/Nutzer bestimmen Methode; V1 statisch/vereinfacht. |
| IHK-Lernen/-Prüfen | getrennter Kontext, minimierte versionierte Snapshots | Keine operative Lern-/Prüfungslogik. |

## 8. Offene Regeln und Entscheidungszuordnung

| Thema | Verbindlich | A04 modelliert | Fachentscheidung / Zuständigkeit |
|---|---|---|---|
| V1-Vollständigkeit | keine Teilvorgänge | Mengen-/Mehrbelegreferenzen; V1-Validierung getrennt | A02 bestätigt genaue Invarianten. |
| Startunternehmen | Start 01.01.2027; Eröffnungsbilanz 95.300 €; Finanzierung-/Budgetrahmen 50.000 €, davon Cash 30.000 € und ungenutzter Rahmen 20.000 € | Eröffnungsbilanzpositionen und Rahmen getrennt gespeichert | Einzelbeleg-/Gegenpartei-Aufschlüsselung der aggregierten Forderungen/Verbindlichkeiten offen. CP-0020 fehlt im Checkout; kein Checkpoint-Inhalt rekonstruiert. |
| Zeit/Periode | Wochenraster, konkrete Kalendertage, flexible Fortschreibung, Wochenendverschiebung, festgelegte Tagesphasen | `simulation_run`, `simulation_phase_rule`, `business_event` | Tageskapazitätsverteilung, Kalenderdetails und Fälligkeitstagszählung bleiben offen. |
| Netto/Brutto/Steuer | SimTAX 19 % je Position, Cent-Rundung je Position, danach Summierung; Simulationssetting | Steuer-/Rundungsregel versioniert an Rechnungszeile/-beleg | Steuerbasis, Halbcent-Konvention, Steuerumfang/-abführung offen; keine rechtliche Logik. |
| Zahlungsrichtungen | Kundeneingang nach Kundenverhalten ohne Cash-Gate; eigener Payable-Ausgang mit automatischem Vollzahlungsversuch am Fälligkeitstag | `payment.direction`, `payable_payment_attempt`, Receipt-Zuordnung, Payable-/Receivable und Dunning getrennt | Kundenverhaltensparameter, Retry-Regeln, Zahlungspriorität, Mahnfristen/-schwellen offen. Darlehenszahlungsplan separat offen. |
| OP-Entstehung | Vertrag und Zahlung getrennt; Fälligkeit ist keine Zahlung | Quelle, Ansatzzeit, Rechnung/Vertrag referenzierbar | A02/A03: Ansatztrigger und Ereignisfolge; Nutzer bei Produktregel. |
| Verbindlichkeit ohne Rechnung | Entstehungszeitpunkt nicht festgelegt | `obligation_source` getrennt von `payable`; Invoice optional und nachträglich zuordenbar | A03 bestimmt, ob/wann daraus ein OP entsteht; A11 prüft Übergabegrenze. |
| Anzahlung | spätere Anzahlungen/Mehrtermine grundsätzlich möglich | `payment_term_payment` verbindet Vertragstermin und Zahlung auch vor Invoice/OP | A03/Nutzer: Klassifikation, Bilanz-/Steuerbehandlung und spätere Verrechnung. |
| Teilproduktion je Position | V1 vollständig, spätere Teilvorgänge möglich | ProductionRunLine und positionsbezogene Verbrauchsreferenz | A02 bestätigt operative Granularität, Mengen- und Verbrauchsregeln; V1 bleibt ohne Teilfertigung. |
| Kosten/BAB | BAB V1, statisch/vereinfacht zulässig | Versionierte BAB-Eingaben, direkte/allgemeine Kosten getrennt | A03: Kategorien, Stellen, Treiber, Verteilung, Zeit/Sätze; Nutzer: Tiefe. |
| Materialbewertung | Eingang/Verbrauch separat | Bewertungsreferenz/Preis je Zugang | A02: Mengen; A03: Anfangsbewertung, Bezugskosten, Rundung/Methode. |
| Abnahme/Auftragsabschluss | getrennte Statusdimensionen | Acceptance-Objekt, Ergebnisversion | A02/Nutzer: Abnahme, Abschluss bei offenen Rechnungen/Restleistung; A03: Finanzfinalität. |
| Korrektur/Periodenabschluss | Historie nachvollziehbar | Versionen, Umkehrreferenzen | A02/A03/A11/Nutzer: Rückdatierung, Neuaufrollung, Storno-/Periodenregeln. |
| Speichertechnik | keine freigegebene Technologie | Logisch relationales Modell | A11/Nutzer: Technologie, Transaktion, Snapshot, Retention; PostgreSQL/Supabase nicht beschlossen. |
| Kalkulations-/Kostenmethode | differenzierte Plan-/Istwerte | Versionierte Positionsmodelle | A03/Nutzer: Satz, Gemeinkostenverteilung und Finalitätsregeln. |

Keine offene Regel wird durch das Modell genehmigt. Abstrakt oder optional belassene Felder müssen vor Implementierung mit zuständiger Fachrolle konkretisiert werden.

## 9. Quellen

- `docs/agent-system/decision-log.md` (D-0010) und `docs/agent-system/checkpoints/CP-0009.md`.
- `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md` (A02: Prozess, Ereignisse, Status, Zeit/Mengen, Übergaben).
- `docs/accounting/maschinenbau-mvp-finanzspezifikation.md` (A03: Finanzbegriffe, Forderungen/Verbindlichkeiten, Liquidität, Kosten/Erlös, Ergebnis, BAB und offene Regeln).
- `docs/architecture/architecture-v0.2.md` und `docs/architecture/adr/ADR-001.md` bis `ADR-008.md` (vorgeschlagene Systemgrenzen; PROPOSED, keine Persistenztechnologie beschlossen).
- `AGENTS.md`, Agentenstruktur, Goals, Ticket-Board und Collaboration State.

## 10. QA-Nachbesserung zu CP-0011

Die drei MAJOR-Befunde aus [CP-0011](../agent-system/checkpoints/CP-0011.md) sind strukturell adressiert:

1. **Verbindlichkeit vor Lieferantenrechnung:** `obligation_source` hält Ursprungstatsachen getrennt von `payable`; Payable benötigt keine SupplierInvoice. `payable_invoice_link` kann eine später eingehende Rechnung zuordnen. Das Modell setzt keinen Entstehungszeitpunkt fest.
2. **Anzahlungen:** `payment` kann Contract und PaymentTerm referenzieren; `payment_term_payment` verbindet Zahlung(en) mit vereinbarten Terminen auch ohne Invoice oder OP. Klassifikation, Bilanz- und Steuerwirkung bleiben offen.
3. **Teilproduktion je Auftragsposition:** `production_run_line` verknüpft Lauf und konkrete ContractLine mit Plan-/Fertigmenge und Einheit; `resource_consumption` referenziert die Laufposition. V1 verlangt weiterhin vollständige Mengen und aktiviert keine Teilproduktion.

Die MINOR-Abweichung in älteren A02-/A03-Texten ist dokumentarisch: A02 §B nennt Teillieferung als optional im MVP; A03 §P behandelt Teilvorgänge als offen und referenziert diese Angabe. Das kollidiert textlich mit D-0010, während das Datenmodell D-0010 folgt. A04 ändert die Fachspezifikationen nicht. Folgeaktion für A01: A02/A03 um Angleichung der Scope-Texte an D-0010 bitten.

Weiterhin offen: einzelne Fachparameter gemäß Abschnitt 8, darunter Zeitpunkt/Ansatz einer Verbindlichkeit, Anzahlungsklassifikation und -behandlung, Kostenmethode, Materialbewertung und Korrekturpfade. Die bestätigten P0-Zeit-, Steuer-, Zahlungs-, Abnahme- und Abschlussregeln sind im nachfolgenden CP-0022-Abgleich ergänzt.

A09 soll erneut die drei Strukturpunkte, die Trennung von Ursprungsfakt/Payable/Invoice/PaymentTerm/Payment/OP sowie die unveränderte V1-Grenze ohne Teilproduktion prüfen.

## 11. CP-0022 P0-Modellabgleich

Die von CP-0022 festgestellten Modellwidersprüche und Dokumentationslücken sind in dieser Spezifikation adressiert. T-0006 bleibt abgeschlossen; dies ist eine dokumentarische Modellspezifikationskorrektur und keine Implementierungs- oder Schemafreigabe.

**HIGH-Befunde behoben:** (1) Der veraltete Text zur 50.000-€-Eröffnung ist durch den Bilanzstand zum 01.01.2027 ersetzt: Aktiva 95.300 € (Bank 30.000 €, Forderungen 12.500 €, Vorräte 12.800 €, Maschine 40.000 €); Passiva/Eigenkapital 95.300 € (Lieferantenverbindlichkeiten 7.500 €, Maschinendarlehen 24.000 €, Eigenkapital 63.800 €). Der separate Rahmen besteht aus 30.000 € Bankbestand und 20.000 € ungenutztem Rest; dieser Rest ist weder Cash noch zusätzliche Passivposition. (2) Fälligkeit führt nun zu automatischem Vollzahlungsversuch; Erfolg nur bei ausreichender Liquidität. Bei Fehlschlag keine Teilzahlung, voller Betrag bleibt offen, Versuch wird als fehlgeschlagen dokumentiert und Liquidität wird nicht negativ.

**Dokumentationslücken behoben:** SimTAX (19 %, Simulationseinstellung, keine Rechtslogik, je Position Cent-Rundung, danach Summierung); getrennte Mitarbeiter- und CNC-Kapazitäten und bestätigte A02-Werte; konkrete Tagesphasen, Kalendertage, Wochenendverschiebung und same-day-Folgephasen; bestätigter Mahnfluss bis zu möglicher Pfändung oder Liquidation ohne erfundene Fristen/Schwellen. Operative Ereignisse, Zahlungsversuche, Rechnungen, Forderungen/Verbindlichkeiten, tatsächliche Zahlungen und Auftragsstatus bleiben getrennt.

**Offen:** individuelle OP-Belege/Gegenparteien am Start, Kundenverhaltensparameter, Retry-Regeln, Zahlungspriorität bei konkurrierenden Fälligkeiten, konkrete Mahnfristen/-schwellen, Darlehenszahlungsplan, Tageskapazitätsverteilung, Arbeitskalender-Details, Fälligkeitstagszählung, SimTAX-Bemessungsbasis/Halbcent-Konvention sowie weitere in Abschnitt 8 aufgeführte Fachparameter. CP-0020 ist im aktuellen Checkout nicht vorhanden; die aktualisierten A03-Finanzspezifikation und P0-Prüfung sowie die Nutzervorgabe enthalten die Werte, aber A04 behauptet keinen Nachweis aus dem fehlenden Checkpoint.

Der Abgleich zeigt für die hier bearbeiteten Regeln keine verbleibenden Widersprüche zu den aktuellen A02-/A03-Spezifikationen. Die ausdrücklich offenen Parameter bleiben als offene Punkte bestehen.

## 12. CP-0025/CP-0026-Prüfung der Zahlungsrichtungen

Der Abgleich ergab eine Modelllücke: Die frühere generische `payment_attempt`-Zuordnung erlaubte Receivable oder Payable, obwohl der Liquiditätscheck und Dunning nur für eigene Verbindlichkeiten gelten. Die Zuordnung des generischen Mahnfalls auf Receivable oder Payable konnte ebenfalls fälschlich den Eindruck erwecken, Kundeneingänge würden durch die eigene Liquidität bedingt. Die konzeptionellen Objekte sind daher in diesem Dokument nach Zahlungsrichtung präzisiert; dies ist keine physische Schemaänderung.

- **Kundeneingang:** `payment` mit Richtung `CUSTOMER_RECEIPT`, verknüpft mit Kunde und Receivable. Auslösung folgt Kundenverhalten ohne Cash-Gate; der tatsächliche Eingang erhöht Liquidität und reduziert/schließt die Forderung.
- **Eigene Zahlung:** `payable_payment_attempt` ist nur an Payable gebunden. Fälligkeit löst den automatischen Vollzahlungsversuch aus. Erfolg erfordert ausreichende eigene Liquidität und erzeugt die tatsächliche Zahlung; Fehlschlag hinterlässt den vollständigen offenen Payable ohne Zahlung oder Liquiditätsbewegung.
- **Mahnfluss:** `dunning_case`/`dunning_event` sind nur an Payable und dessen fehlgeschlagenen Zahlungsversuch gebunden.
- `payment_allocation` muss zur Richtung passen: Kundeneingang→Receivable; eigene Zahlung→Payable. Forderung und Verbindlichkeit bleiben unabhängig geführte OP-Objekte.

Die folgenden Produktparameter bleiben **OFFEN** und werden durch das Modell nicht festgelegt: Kundenverhaltensparameter, Retry-Regeln, Zahlungspriorität, konkrete Mahnfristen/-schwellen sowie Darlehenszahlungsplan. Es wurden keine Widersprüche zu CP-0025/A02 oder CP-0026/A03 festgestellt.

## 13. Abschlussstatus und offene Fachregeln

Der Modellierungsvorschlag bleibt vorbehaltlich Prüfung durch A02 (Zeit, Mengen, Status, Prozessabschluss), A03 (Beträge, Eigentümerschaft Finanzobjekte, BAB, Material-/Kostenbewertung) und A11 (Systemgrenzen und Persistenz/Audit). Er gibt weder Architektur noch ADRs frei. Offene Fachregeln aus Abschnitt 8 benötigen zuständige Klärung vor Implementierung.

Es wurden keine Anwendungscodeänderungen, Datenbankmigrationen, Supabase-Änderungen, Implementierungen oder Dependencyänderungen vorgenommen. A02/A03-Unterlagen, D-0010 und Ticketstatus wurden nicht verändert.
