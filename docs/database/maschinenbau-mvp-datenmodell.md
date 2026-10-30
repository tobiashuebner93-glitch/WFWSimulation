# Maschinenbau-MVP – fachliches und technisches Datenmodell

**Stand:** 2026-10-27 · **Rolle:** A04 DATABASE · **Adressat:** A01 – MASTER_ORCHESTRATOR · **Bezug:** MG-000 / SLG-000.2 / T-0006 / T-0020 / D-0011–D-0129 / CP-0148–CP-0186
**Status:** Logischer Datenmodellvorschlag nach dokumentarischem Decision-Log-Abgleich; keine physische Schemafreigabe; Architektur V0.2 und ADRs bleiben PROPOSED.

## Aktueller Neustartprofil-Nachtrag (D-0152 / T-0049 / CP-0230; 2026-10-30)

Bei neu angelegten Spielständen unterscheiden sich die Profile 2019 und 2027 ausschließlich durch ihr Startdatum. Initiale fachliche Daten und Spielregeln sind identisch; der gemeinsame Finanzstand lautet 10.000 € Bank und Eigenkapital sowie keine Forderungen, Verbindlichkeiten, Vorräte, Maschine oder Darlehen. Die nachfolgenden 2027-Bilanzzeilen sind historische Modellstände und gelten nicht als produktive Startdaten. `startDate` ist ein fachlicher Profilwert; dieser Nachtrag genehmigt keine Schemaänderung.

## 1. Zweck und Grenzen

Dieses Dokument konkretisiert ein fachliches und logisches relationales Persistenzmodell für die operative Auftragsabwicklung eines bestehenden Maschinenbauunternehmens. Tabellen sind konzeptionelle persistente Objekte. Es ist weder Implementierungsspezifikation noch Architekturfreigabe. PostgreSQL, Supabase, physische Schemas, APIs, Aggregate-Grenzen und Transaktionsstrategie werden nicht beschlossen.

Das Modell trennt operative Fakten, Finanzdaten und Stammdaten. A02 ist fachlich autoritativ für Prozess, Simulation, Zeit, Mengen und operative Ereignisse. A03 ist autoritativ für Accounting-Regeln, Buchungen, Liquidität, Forderungs-/Verbindlichkeitssalden und Finanzresultate. A04 beschreibt dafür ein logisches Informationsmodell und erforderliche Referenzen; Tabellen, Felder und Übergaben hier sind Modellanforderungen, keine physische Tabellen-, API-, Transaktions- oder Schemafreigabe.

## 2. Leitplanken

- D-0010 und D-0099: bestehendes Startunternehmen, gemieteter Raum, eine CNC-Maschine und drei Beschäftigte. Simulationsstart 01.01.2027. Bankbestand 30.000 € gehört zum separat geführten Finanzierungs-/Budgetrahmen von 50.000 €; 20.000 € ungenutzter Rahmen sind weder Cash noch zusätzliche Passivposition. CNC-Eröffnungsbuchwert 0 €; Eröffnungsbilanz siehe §4.1.
- V1 wickelt Aufträge vollständig ab. Teilproduktion, Teillieferung, Teilrechnung und Teilzahlung sind keine V1-Funktionen. Mengen und Referenzen bleiben für spätere Erweiterung geeignet.
- Beträge werden differenziert je Position und Bedeutung erfasst; ein einzelner Gesamtbetrag reicht nicht.
- Vertrag, Leistung, Rechnung, Forderung/Verbindlichkeit und Zahlung sind unterschiedliche Sachverhalte. Bestellung, Wareneingang und Lieferantenrechnung ebenso.
- Planwerte bleiben von Istkosten, Erlösen, offenen Posten und Liquidität getrennt. Es gibt keine konkurrierende Finanzlogik neben A03.
- Bestätigte/belegte Fakten werden nicht still überschrieben. Korrekturen referenzieren Ursprung oder erstellen eine neue Version.
- Technische IDs und Tabellenbezeichnungen sind konzeptionell; lesbare Dokumentnummern sind separat, je Unternehmen und Belegart eindeutig. Keine physische Schemafreigabe.

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

Die Mehrfachbeziehungen ermöglichen spätere Erweiterung. In V1 blockiert die Geschäftsvalidierung Teilvorgänge und fordert vollständige Mengen. Für vollständige Lieferungen gilt F3: fünf Arbeitstage ab dem Folgetag der Lieferung; Montag bis Freitag sind Arbeitstage. Der V1-Prototyp verwendet mangels Betriebsort die konservative Feiertags-Vereinigungsmenge nach D-0134 für Simulationstagsverschiebungen; D-0011 bleibt die historische Kernregel. Vertragliche und gesetzliche Fristen folgen weiterhin ihrer jeweils anwendbaren Orts- und Sachregel. Eine rechtzeitige Ablehnung blockiert die ausdrücklich als V1-Spielregel definierte automatische Abnahme und Rechnung; sonst erfolgt die automatische Abnahme nach Frist. Die vollständige Kundenrechnung wird nach bestätigter/automatischer Abnahme erstellt. Gemäß G3 wird der Kundenauftrag erst geschlossen, wenn die vollständige Kundenforderung bezahlt ist; Lieferantenverbindlichkeiten blockieren diesen Kundenauftragsabschluss nicht. Der fachliche Ablauf zur Auflösung einer Ablehnung bleibt offen; die allgemeine Ereignisreihenfolge richtet sich nach D-0129.

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
| Mahnfall eigene Verbindlichkeit | `OPEN → REMINDER → FORMAL_NOTICE`; Retry-Zähler separat | Erinnerung zehn Kalendertage nach erstem Fehlversuch, formelle Mahnung 14 Kalendertage später; keine weitere Pfändungs-/Liquidationseskalation in V1 (D-0027–29). A02-Ereignisreihenfolge bleibt abzustimmen. |
| Auftragsergebnis | `PROVISIONAL → FINAL / REVISED` (mit Version) | A03-Sicht; operativer Abschluss finalisiert Finanzresultat nicht automatisch. |

Operativer Auftragsstatus, Beschaffungsstatus, Rechnungsstatus, OP-Status und Zahlungsstatus sind unabhängig. Überfälligkeit wird aus Simulationsdatum und offenem Rest abgeleitet.

### 3.4 Aktuelle V1-Operationalisierung (T-0020)

Diese Ergänzung beschreibt beobachtete Prototyp-Anforderungen auf logischer Ebene und genehmigt keine physischen Felder oder Schemaänderung:

- Eine Produktionsoperation kann im selben Simulationstag ihre abhängige Folgeoperation freigeben, sofern deren Qualifikation und getrennte Mitarbeiter-/Maschinen-Restkapazität reichen. Ereignisse behalten wirksamen Simulationstag, Phase und ursächliche Vorgängerreferenz.
- Phase 8 ordnet am selben wirksamen Tag Kundeneingänge mit anschließender Dispo-Rückführung vor Maschinenrate und eigenen, vom Spieler priorisierten Vollzahlungsversuchen (D-0120/26/29). Erfolgsstatus und verbleibender offener Posten werden vor Mahnereignissen aktualisiert.
- Je SimTAX-Periode sind Ausgangs-SimTAX, qualifizierte Lieferanten-Vorsteuer, vorgetragenes Guthaben, Nettobetrag, Fälligkeit, Zahlung/Fehlversuch und Kreditvortrag unterscheidbar. Der V1-Filter erfasst derzeit Materialbelege an erkannte Netzwerk-Lieferanten; diese Modellabbildung ist keine Prüfung der vollständigen gesetzlichen Rechnungs- und Abzugsvoraussetzungen (D-0113/14).
- Ein allgemeiner Dunning-Fall gehört ausschließlich zu einem eigenen offenen Verbindlichkeitsposten. Der Erstfehlschlag, acht wöchentliche Retry-Versuche danach, Zähler, +10-Kalendertage-Erinnerung und +14-Kalendertage-Mahnung sowie erledigte/unterdrückte Folgemahnung sind als getrennte logische Ereignis-/Statusanforderungen abbildbar. Maschinenkredit bleibt ein eigener Ausfallpfad. SimTAX-Retry-Status in der Implementierung ist eine separate V1-Spielkonvention.
- Lokale Spielstands-Recovery muss den letzten gültigen Snapshot vom beschädigten Original unterscheiden und vor Nutzerwahl nichts darüber hinweg speichern. Die Nutzeraktion `Wiederherstellen` oder `Neues Spiel starten` ist nachvollziehbar; konkreter lokaler Speichermechanismus wird durch diese logische Modellergänzung nicht festgelegt.

Der Prototyp verwendet für Arbeitstage zusätzlich einen konservativen Feiertagskalender der hinterlegten deutschen Feiertage; er behauptet keinen bestimmten Bundesland-Standort und ändert die historische D-0011-Regel nicht.

## 4. Technisches Modell: logische Tabellen
**Abdeckungslücken aus T-0023 – fachliche Anforderungen, keine Schemafreigabe:** Der laufende V1-Prototyp benötigt fachliche Zustände für (1) Facility-Objekt und Umzugsereignis mit Gebäudezugehörigkeit von Lager-, Büro-, Personal- und Werkstattflächen, Maschinenplätzen, Miet-/Kaufart sowie angesetzten Miet-/Kaufwerten; Flächen ändern sich nur beim Wechsel zu einem anderen Objekt, (2) tägliche Abwesenheit und verfügbare Personalkapazität einschließlich geplanter/tatsächlicher Urlaubstage, Krankheit und Weiterbildung, (3) Zeitarbeitsbuchungen nach Datum, Auftrag, Qualifikation, Stunden, Satz und Arbeitsplatzkapazität, (4) Ausbildungsverhältnis, qualifizierte Betreuungsperson und Weiterbildungs-/AEVO-Abschluss. Immobilienkauf/-verkauf ist als Finance-eigenes Zahlungs-/Vermögensereignis mit Datum und Referenz zu führen; die Oberfläche darf Finanzsalden nicht direkt mutieren. Das sind logische V1-Anforderungen an den Prototyp und spätere Modellabdeckung; sie legen keine Tabellen oder Migration fest und erteilen keine Datenbank- oder Architekturfreigabe.

Konzeptionelle Typen: `UUID`/opaque ID, `TEXT`, `ENUM` oder Referenztabelle, `BOOLEAN`, `INTEGER`, `DECIMAL(p,s)`, `DATE`, `TIMESTAMP WITH TIME ZONE`. Geldbeträge verwenden Dezimalwerte, keine binären Fließkommazahlen. Mengen-/Stundenpräzision und konkrete Währungs-/Betragsfelder bleiben zu konkretisieren; bestätigte SimTAX-Regeln stehen in §4.4. Die Objekte sind logische Anforderungen, keine festgelegten physischen Typen oder Spalten.

### 4.1 Stammdaten und Startunternehmen

| Tabelle | PK / wichtige Felder | Constraints / Regeln |
|---|---|---|
| `company` | `company_id`; `name`, `profile_code` | Profilcode eindeutig, wenn verwendet; bei Historie archivieren. |
| `facility` | `facility_id`; FK `company_id`; Objektart, Nutzung, Flächen nach Lager/Büro/Personal/Werkstatt, Maschinenplätze, Miet-/Kaufart, Miet-/Kaufwert, Gültigkeitszeitraum | Startobjekt gemietet; Standort- und Flächenwechsel nur durch Umzug in anderes Objekt; Kauf/Verkauf als Finance-Transaktion. Nur fachliche Anforderungen, keine Schemafreigabe. |
| `customer`, `supplier` | jeweiliger PK; FK `company_id`; Name, Referenzcode, Kontakt, `active` | Referenzcode optional je Firma eindeutig; historisch genutzte Parteien nicht löschen. |
| `material` | `material_id`; FK `company_id`; `code`, `name`, `unit_code`, Spezifikation | Materialcode je Firma eindeutig; Einheit referenziert. |
| `machine` | `machine_id`; FK `company_id`, optional `facility_id`; Code, Typ, Anschaffungsdatum/-kosten, Buchwert, Gültigkeit | Code je Firma eindeutig; CNC-01 hat 40 Betriebsstunden/Woche und 1.600 Betriebsstunden/Jahr. Bestehende CNC: Anschaffung 01.01.2019, Basispreis 120.000 €, Eröffnungsbuchwert 0 € nach siebenjähriger linearer AfA gemäß D-0085–99; kalkulatorischer BAB-Wert getrennt. |
| `employee` | `employee_id`; FK `company_id`; Rollenkennung, Qualifikationen, Wochenkapazität, monatlicher Bruttolohn, Gültigkeit | MA-CNC 3.800 €, MA-PROD 3.100 €, MA-AV 3.500 € brutto/Monat; Summe 10.400 € (D-0065/66). Je 40 Arbeitsstunden/Woche; Arbeitsgang-Zuordnung: MA-PROD 10/40, MA-CNC 20/30, MA-AV Planung. Arbeitgeberkosten 21 % gemäß D-0068; keine Lohnartenaufteilung unterstellt. |
| `resource_capacity` | `capacity_id`; Ressourcentyp, Ressourcen-ID, Periode, Kapazitätswert, Einheit, Regelversion | Getrennte Kapazitätsdatensätze je Mitarbeiter und Maschine; Wochen-/Jahresgrenzen gemäß bestätigtem A02-Profil. Tagesverteilung bleibt offen. |
| `unit_of_measure` | `unit_code`; Bezeichnung, Dimension | Inkompatible Maße nicht verrechnen. |
| `opening_balance` | `opening_balance_id`; FK `company_id`; `balance_type`, Betrag, Währung, Stichtag, Quelle | Stichtag 01.01.2027. Eröffnungspositionen sind die untenstehenden Bilanzpositionen; Bilanzsumme ausgeglichen. |
| `opening_balance_line` | `opening_balance_line_id`; FK `opening_balance_id`; `accounting_category`, Betrag, Währung, Gegenpartei-/Asset-Referenz falls bekannt | D-0128: Bank 30.000 €, Forderungen 12.500 €, Vorräte 4.214,20 €, CNC-Buchwert 0 €, Lieferantenverbindlichkeiten 7.500 €, Maschinendarlehen 24.000 €, Eigenkapital-Restposition 15.214,20 €. Bilanzsumme Aktiva/Passiva je 46.714,20 €. Einzelbelege/Parteien der aggregierten OP bleiben offen. |
| `funding_envelope` | `funding_envelope_id`; FK `company_id`; Gesamtgrenze, beanspruchter Bankbestand, ungenutzter Rahmen, Stichtag | Gesamt 50.000 € = 30.000 € Bankbestand + 20.000 € ungenutzter Rahmen. Ungenutzter Rahmen ist weder Cash noch zusätzliche Passivposition; keine automatische Ziehung unterstellt. |

Startprofil: eine Firma, ein gemieteter Facility-Datensatz, eine Maschine und drei Mitarbeiter. Weitere Werte werden nicht erfunden.

Eröffnungsbilanz am 01.01.2027 gemäß D-0128: Aktiva = Bank 30.000 € + Forderungen 12.500 € + Vorräte 4.214,20 € + CNC-Buchwert 0 € = **46.714,20 €**. Passiva und Eigenkapital = Lieferantenverbindlichkeiten 7.500 € + Maschinendarlehen 24.000 € + Eigenkapital 15.214,20 € = **46.714,20 €**. Der separate 20.000-€-Rest des Finanzierungs-/Budgetrahmens ist außerhalb der Bilanz und nicht liquide.

### 4.2 Vertrieb, Kalkulation, Angebot, Vertrag

| Tabelle | PK / wichtige Felder | Constraints / Beziehungen |
|---|---|---|
| `customer_request` | `request_id`; FK `company_id`, `customer_id`; `request_no`, Simulationszeit, Spezifikation, Menge/Einheit, Wunschtermin, Status, `invited_competitor_ids` bzw. logische Beteiligungszuordnung | Requestnummer je Firma eindeutig; Menge > 0. Eingeladene Unternehmen werden je Anfrage festgehalten; dies ist eine logische Anforderung, kein physisches Schema. |
| `calculation` | `calculation_id`; FK `request_id`; Versionsnummer, Status, Regelversion, Zeitpunkt, Annahmen | Unique (`request_id`,`version_no`); publizierte Version unveränderlich. |
| `calculation_line` | `calculation_line_id`; FK `calculation_id`; Kategorie, Beschreibung, Menge/Einheit, Satz, Betrag, Bezugsbasis, Annahmenflag | Dezimalbeträge; Planwert, nicht `cost_entry`. |
| `quote` / `quote_version` | IDs; FK Request/Customer/Calculation und Anbieter; `quote_no`, Version, Eingangs-/Antwortdatum, Gültigkeit, Währung, Status, Preisbasis, `terms_snapshot`, Ruf-/Preis-/Lieferzeit-Snapshot | Nummer je Firma eindeutig; Version je Quote eindeutig; ausgegebener Stand immutable. Gleichzeitige V1-Konkurrenzangebote erhalten das Anfrage-/Eingangsdatum gemäß A01-Konvention. |
| `quote_line` | `quote_line_id`; FK QuoteVersion; Beschreibung, Menge, Einheit, Einzel-/Zeilenbetrag | Zeilenweise Preise; ausgegebene Zeile nicht überschreiben. |
| `quote_award_result` (logische Anforderung) | FK Request; Gewinneranbieter/QuoteVersion, Entscheidungszeitpunkt, Vergleichs-Snapshot, Ergebnisgrund | Pro Anfrage höchstens ein Zuschlag; verlorene Spielerangebote bleiben als abgegebene Quotes erhalten und werden nicht als angenommener Vertrag oder vereinbarter Preis gespeichert. Reproduzierbarkeit der V1-Auswahl; keine physische Tabelle oder Schemafreigabe festgelegt. |
| `sales_contract` | `contract_id`; FK Firma/Kunde und angenommene QuoteVersion; Nummer, Status, Bestätigung, Liefertermin, Währung, Konditionssnapshot, Version | Vertragsnummer je Firma eindeutig; exakte Angebotsversion referenzieren. |
| `contract_line` | `contract_line_id`; FK Contract; Zeilennummer, Beschreibung, Menge/Einheit, vereinbarter Einzel-/Zeilenbetrag, Spezifikation | Unique Vertrag+Zeilennummer; Menge positiv. |
| `payment_term` | `payment_term_id`; FK Contract; Richtung, Sequenz, Trigger, Triggerreferenz, Fristanker, Tageszahl, Zählweise, Fälligkeitsdatum, Vereinbarungsquelle | Unique Vertrag+Richtung+Sequenz. V1: Kunde 14 Kalendertage standardmäßig, individuell 30; Lieferant 30 standardmäßig. Ankertag ist Tag 1; Wochenendtermin auf nächsten Arbeitstag. Der ursprüngliche D-0011-Kernkalender berücksichtigt Feiertage nicht; der spätere V1-Arbeitskalender nutzt die prototypische Vereinigungsmenge gemäß D-0134. Vertragliche und gesetzliche Fristen folgen ihrer jeweiligen Regel; SimTAX-Fälligkeiten folgen D-0097. Kundenanker: späteres Datum aus Rechnung/Leistung, bei Lieferung als alleiniger Leistungstag Lieferdatum. Lieferantenanker bei pünktlicher Lieferung Rechnungsdatum; Rechnung bestätigt Betrag/Fälligkeit. Abweichende explizite Konditionen bleiben referenzierbar. |
| `payment_term_payment` | PK `term_payment_id`; FK `payment_term_id`, `payment_id`; `applied_amount`, `recorded_at` | Verknüpft Zahlung und vereinbarten Vertragstermin; mehrere Zahlungen pro Termin und Termine pro Vertrag möglich. Vertragliche Zuordnung allein bestimmt weder Anzahlungsklassifikation noch Bilanz-/Steuerwirkung. |

Vertragskonditionen werden als unveränderlicher Snapshot aufbewahrt. Der strukturierte Zahlungstermin entscheidet keine Anzahlungslogik.

### 4.3 Beschaffung, Bestand, Produktion, Lieferung

| Tabelle | PK / wichtige Felder | Constraints / Beziehungen |
|---|---|---|
| `purchase_order` | `purchase_order_id`; FK Firma, Supplier, optional Contract; Nummer, Status, Bestell-/Erwartungsdatum, Währung, Konditionssnapshot | Nummer je Firma eindeutig; Bestellung ist nicht automatisch Verbindlichkeit/Zahlung. |
| `purchase_order_line` | `purchase_order_line_id`; FK PO, optional Material/ContractLine; Zeilennummer, Menge/Einheit, Einzel-/Zeilenbetrag, Serviceflag | Unique PO+Zeile; Menge positiv. |
| `receipt` / `receipt_line` | IDs; FK PO und PO-Line; Belegnummer, Erfassungszeit, Status, angenommene Menge/Einheit/Preis, Quell-Event | Receipt-Nummer je Firma eindeutig; V1 verlangt volle Annahme gemäß späterer Regel. |
| `service_acceptance` | `service_acceptance_id`; FK `purchase_order_line_id`; `status`, `accepted_at`, Leistungsreferenz, Nachweis, `source_event_id` | Separater Lieferanten-Fremdleistungsnachweis; nicht mit Kundenabnahme (`acceptance`) verwechseln. Finanzwirkung A03. |
| `inventory_movement` | `movement_id`; FK Firma/Material, optional ReceiptLine/Contract/ProductionRun; Bewegungsart, Mengenänderung, Einheit, Wirksamkeitszeit, Bewertungs-/WAP-Bezug, Source-Event, Umkehrreferenz | Append-only; Korrektur referenziert Original. E3 gleitender Durchschnitt ist bestätigt; Eingangs-/Verbrauchsbewegungen müssen Bewertungswert und resultierenden WAP/Bestandswert nachvollziehbar halten. Stahl-Anfangsmenge 2.000 kg; Eröffnungswert aus bereitgestelltem Vorjahresschluss statt A02-Schätzwert. Vorjahresschluss-Erzeugung/-Übergabe und Preisbestandteile bleiben offen (D-0090–93). |
| `production_run` | `production_run_id`; FK Contract; Laufnummer, Status, Start/Ende, Regelversion, Quell-Event | Unique Vertrag+Laufnummer; Lauf ist Container für positionsbezogene Mengen. |
| `production_run_line` | `production_run_line_id`; FK `production_run_id`, FK `contract_line_id`; `planned_quantity`, `completed_quantity`, `unit_code`, `status` | Verknüpft Lauf und konkrete Vertragsposition. Mehrere Läufe können später dieselbe Position teilweise fertigen. V1-Validierung verlangt Gesamtmenge und deaktiviert Teilfertigung. |
| `resource_consumption` | `consumption_id`; FK `production_run_line_id`, optional Material/Machine/Employee; Ressourcentyp, Menge/Einheit, Zeitpunkt/Periode, Kostensatzreferenz, Source-Event, Umkehrreferenz | Verbrauch eindeutig positionsbezogen; Ressource passend zum Typ; Istverbrauch getrennt von Kalkulation. |
| `delivery` / `delivery_line` | IDs; FK Contract und ContractLine; Nummer, Status, vorbereitet/versandt/geliefert, Trägerreferenz, Menge/Einheit, Source-Event | Nummer je Firma eindeutig; V1 verlangt Gesamtlieferung. Spätere Mehrfachbelege möglich. |
| `acceptance` | `acceptance_id`; FK Delivery; Status, Zeitpunkt, Nachweis, Notizen, Fristende, Ablehnungsereignis | F3-Frist/Status gemäß Regelversion; fünf Arbeitstage ohne fristgerechte Ablehnung lösen die ausdrücklich als V1-Spielregel gekennzeichnete automatische Abnahme aus. |

### 4.4 Rechnungen und Finanzobjekte

| Tabelle | PK / wichtige Felder | Constraints / Eigentümerschaft |
|---|---|---|
| `customer_invoice` | `customer_invoice_id`; FK Firma/Contract, optional Delivery; Nummer, Status, Ausstellungs-/Leistungs-/Fälligkeitsdatum, Währung, Betragstyp, Zwischensumme, SimTAX-Ausgang, Gesamtbetrag, Korrektur- und Eventreferenz | Nummer je Firma eindeutig. V1-Forderung und vereinfachter Auftragserlös entstehen bei Rechnungsausstellung/-freigabe für erbrachte/abrechenbare Leistung (D-0112). SimTAX gilt bei externer Rechnungsstellung mit 19 % und Regeln aus D-0053–59/D-0097; reine Simulation. |
| `customer_invoice_line` | `invoice_line_id`; FK Invoice, optional ContractLine/DeliveryLine; Beschreibung, Menge/Einheit, bestätigter Positionswert vor SimTAX, SimTAX-Satz/-Betrag, gerundeter Betrag, Umkehrreferenz | 19 % vom bestätigten Positionswert vor SimTAX je Positionsgesamtbetrag; kaufmännisch auf Cent pro Position runden und summieren. Halbcent-Regel bestätigt; Korrektur kehrt ursprünglichen gerundeten Betrag referenziert um. |
| `supplier_invoice` / `supplier_invoice_line` | IDs; FK Supplier, optional PO/Receipt; Nummer, Datum/Fälligkeit, Status, differenzierte Linienbeträge und qualifizierte SimTAX-Vorsteuerinformation | Bestätigt Betrag/Fälligkeit einer aus akzeptiertem Materialeingang bzw. bestätigter Fremdleistung entstandenen Verbindlichkeit. Vorsteuer nur für D-0113-qualifizierte Rechnungen; D-0114-Sonderfälle/anteilige Abzüge in V1 ausgeschlossen. |
| `obligation_source` | `obligation_source_id`; FK Firma/Supplier, optional Contract/PO; `source_type`, optionale ReceiptLine-/`service_acceptance_id`, `occurred_at`, `source_event_id`, Beschreibung | V1-Verbindlichkeit entsteht bei akzeptiertem Materialwareneingang bzw. bestätigter Fremdleistung (D-0111). Lieferantenrechnung bestätigt Betrag/Fälligkeit. Quelle bleibt getrennt von Invoice, Payable und Zahlung; genaue A02-Ereignisreihenfolge ist offene Schnittstellenfrage. |
| `receivable` | `receivable_id`; FK Firma, Kunde, CustomerInvoice, optional Contract; Ursprung, Ansatz-/Fälligkeit, Währung, Hauptbetrag, Status, Korrekturreferenz | Ansatz, Restbetrag und Saldo A03; keine zweite Finanzwahrheit. |
| `payable` | `payable_id`; FK Firma/Supplier und `obligation_source_id`; optionale Fälligkeit/Währung; Betrag, Ansatzzeit, Status, Korrekturreferenz | SupplierInvoice-FK nicht zwingend. A03 bestimmt, ob und wann der Ursprungsfakt eine Verbindlichkeit wird und welcher Betrag/Fälligkeit gelten. |
| `payable_invoice_link` | PK `payable_invoice_link_id`; FK Payable, SupplierInvoice, optional SupplierInvoiceLine; abgestimmter Betrag, Zuordnungsstatus | Verknüpft Rechnung nachträglich mit einer oder mehreren Verbindlichkeiten; Dokumentbeziehung, keine Buchungsregel. |
| `payable_payment_attempt` | `payment_attempt_id`; FK `payable_id` (nur eigene Verbindlichkeit), optional FK erfolgreicher `payment_id`; angeforderter Gesamtbetrag, Ergebnis `SUCCEEDED/FAILED`, Zeitpunkt, Grundcode, Source-Event | Fälligkeit löst automatischen Vollzahlungsversuch aus. Nur bei ausreichender eigener Liquidität wird der volle Betrag gezahlt; andernfalls keine Teilzahlung, voller Payable bleibt offen, Versuch FAILED, keine Payment-/Cashbewegung und keine negative Liquidität. Dieses Objekt wird nie für Kundeneingänge verwendet. |
| `dunning_case` / `dunning_event` | IDs; FK `payable_id` und `payable_payment_attempt_id`; Stufe, Ereigniszeit, Ergebnis, Source-Event | Ausschließlich eigene Verbindlichkeit. Nach Erstfehlversuch wöchentliche Retries, acht Retry-Fehlschläge bis Spielverlust; Erinnerung +10 Kalendertage, formelle Mahnung weitere +14 Tage. Keine weitere Pfändung/Liquidation in V1. Verhältnis/Reihenfolge gleichzeitiger A02-Ereignisse bleibt offen (D-0021, D-0024–29). |
| `payment` | `payment_id`; FK Firma, `direction` (`CUSTOMER_RECEIPT` / `OWN_PAYMENT`), genau eine Kunden-/Lieferantenpartei; optionale FK `contract_id`; Nummer, Status, Zahlungszeit, Währung, Betrag, externe Referenz, Umkehrreferenz, Source-Event | Speichert ausschließlich tatsächlich erfolgte Zahlung. V1-Kundeneingang fällt auf Fälligkeit, sofern kein explizites Verspätungsereignis eintritt; unabhängig von eigener Liquidität. Eigener Ausgang wird nach erfolgreichem Payable-Vollzahlungsversuch gespeichert. Richtung und Parteiart müssen zusammenpassen. |
| `payment_allocation` | `allocation_id`; FK Payment und genau einer Receivable/Payable; zugeordneter Betrag | CHECK genau ein Ziel; Zieltyp muss zur Zahlungsrichtung passen (Kundeneingang→Receivable, eigener Ausgang→Payable). V1 verlangt volle Zahlung; spätere m:n-Zuordnung möglich. |
| `financial_fact` | `financial_fact_id`; FK Firma, optional Contract; Source-Event, Faktart, Wirksamkeits-/Ansatzzeit, Periode, Betrag/Währung, Kategorie, Partei-/Belegreferenz, Umkehrreferenz, Regelversion | Unveränderliche Übergabefakten, falls nicht A03-eigen persistiert. Keine Buchung/Saldoformel; Eigentümerschaft A03/A11 zu klären. |
| `simtax_entry` | ID, Quelle (Kundenrechnung/qualifizierte Lieferantenrechnung), Richtung (Ausgangsteuer/Vorsteuer), Positionswert, Steuersatz, gerundeter Steuerbetrag, Umkehrreferenz, Simulationsperiode | Unterstützt getrennte SimTAX-Ausgangssteuer/Vorsteuer-Salden, Nettierung, referenzierte Korrektur. Nur V1-qualifizierte Rechnungen; keine rechtliche Steuerabrechnung. |
| `simtax_period` / `simtax_return` | IDs, Kalendermonat, Vorjahres-Szenariowert, SimTAX-Saldo, Abgabe-/Fälligkeit, Status, Regelversion | Monatlicher Voranmeldungszeitraum; maßgeblicher Vorjahresbetrag 49.400 €; Abgabe/Zahlung am 10. nach Monatsende, Verschiebung bei Samstag/Sonntag/Feiertag auf nächsten Werktag, keine Dauerfristverlängerung (D-0061, D-0059, D-0097). Fehlererkennungsereignisse bleiben offen. |
| `accounting_period` / `period_close` | Geschäftsjahr, Periodenstart/-ende, Status/Abschlusszeitpunkt, Folgejahr-Korrekturbezug | V1-Geschäftsjahr umfasst zwölf Monate und endet am Kalenderjahresende. Nichtsteuerliche Korrektur nach Abschluss wird im Folgejahr erfasst, ohne die Vorjahresperiode zu ändern; Erklärungsberichtigung gemäß D-0115/16 separat (D-0117–19). |
| `machine_loan` / `loan_event` | Darlehens-ID, Maschinenreferenz, Anfangshauptschuld, Zinssatz/Bindung, Laufzeit, Frequenz/Fälligkeit, Zinsregel, getrennte Zins-/Tilgungsanteile, Zahlungsversuch/-status, Verzug-/Retry-/Verwertungsereignisse | Bestätigt: 24.000 €, fest 5 % p.a., sieben Jahre, gleichbleibende monatliche Annuität von 339,21 €; erster tatsächlicher Zahlungstermin 29.01.2027, danach letzter Geschäftstag des Monats. Die V1-Rate folgt 5 % / 12; die bestätigte Darlehenslogik verwendet 30E/360 auf laufender Restschuld mit Stichtag am Tag vor der Rate, monatliche Cent-Rundung und Zinszahlung mit der Rate. Bei drei insgesamt nicht gezahlten Raten erfolgt Verwertung nach D-0042/43. Ereignisreihenfolge und Periodenzuordnung richten sich nach D-0129. |
| `overdraft_facility` / `credit_event` | Firma, Kreditlimit, Zinssatzreferenz, in Anspruch genommener Betrag, Ziehungs-/Rückzahlungsereignisse | Dispositionskredit ist eine optionale Spielerentscheidung; Zinssatz 8 % über dem individuellen Unternehmenszinssatz. Der Höchstbetrag beträgt 10 % der Bilanzsumme zum Ende des Vorquartals und gilt ab dem ersten Tag des Folgequartals; zum Simulationsstart dient die Eröffnungsbilanz als Basis (D-0123/24, D-0128). Eine Ziehung erfolgt manuell zur Deckung eines konkreten Fehlbetrags bis zum verfügbaren Limit; Kundeneingänge führen die Disposchuld zuerst zurück. Zinsen werden täglich auf den gezogenen Saldo berechnet und am Monatsende als Sammelposten belastet. Der 20.000-€-Rest des Startbudgets ist kein Dispolimit (D-0123–27). |
| `interest_rate_agreement` | Firma, Jahr, EZB-MRO-Referenz/Stichtag, Fremdkapitalquote, Formelversion, vereinbarter Unternehmenszinssatz | Jährliche Vereinbarung auf Basis des MRO am 1. Januar plus FKQ-Aufschlag (D-0100–09); FKQ = Fremdkapital/Bilanzsumme. Bestätigte stückweise Exponentialformel und Eckwerte gelten bis 100 %. Simulation zukünftiger MRO-Werte orientiert sich an Inflation; konkrete MRO-/Inflationsüberführung für künftige Jahre bleibt V2/offen. Verhalten der FKQ-Kurve über 100 % bleibt offen. |
| `depreciation_policy` / `asset_depreciation_event` | Anlage, Anschaffungsdaten/-basis, gewählte Methode, Jahres-/Periodenbezug, AfA-Betrag, Regelversion | Bestehende Startanlagen: AfA des laufenden Jahres am ersten Arbeitstag des zweiten Quartals. Für Neuanschaffungen wird die Methode zu Spielbeginn gewählt und später für künftige Anschaffungen im Menü angepasst; lineare/degressive AfA und GWG-Verfahren nach D-0077–88. Dies bleibt getrennt von der CNC-Wiederbeschaffungs-BAB-Kostenbasis. |

Die Einträge zu SimTAX, Geschäftsjahresabschluss, Darlehen und Dispositionskredit sind logische Informations-/Übergabeanforderungen. Ob diese Informationen A03-eigen, Schnittstellenobjekt oder Projektion sind, klären A03/A11; dies genehmigt keine physischen Tabellen oder Schnittstellen.

### 4.5 Kosten, Erlös, Auftragsergebnis und BAB

| Objekt | PK / Kernfelder | Grenze |
|---|---|---|
| `cost_entry` | ID, Firma, optional Contract/ProductionRun/PO; Kategorie, Menge/Einheit, Satz/Betrag, Entstehungszeit/Periode, Source-Event, Umkehrreferenz | Kostenansatz und Bewertung A03; Planwerte separat. |
| `revenue_entry` | ID, Firma, Contract, optional Invoice; Kategorie, Betrag, Ansatzzeit/Periode, Source-Event, Umkehrreferenz | Erlösansatz A03; Angebot/Zahlung ist nicht automatisch Erlös. |
| `order_result` | ID, Contract, Version, Bezugszeit, Status, Planerlös, Ist-Erlös, direkte Istkosten, Gemeinkostenanteil, Ergebnis, Regelversion | Versionierte A03-Projektion, nicht unabhängig durch A02/A04 berechnet. |
| `liquidity_movement` | ID, Firma, optional Payment/OpeningBalance; Richtung, Betrag/Währung, Wirksamkeitszeit, Herkunft | A03-Sicht; jede Bewegung auf Startfakt oder bestätigte Zahlung zurückführbar. Kein Bestandscounter als Konkurrenz. |
| `bab_version` | ID, Firma, Version, Gültigkeit, Status, Methode, Regelversion | Versionierte V1-Eingabe, statisch/vereinfacht erlaubt. |
| `bab_line` | ID, BabVersion, Zeile, Kostenstelle/-art, Betrag/Satz, Verteilungsbasis, Zielkategorie, Periode | Bestätigt: MGK 15 % MEK; FGK 100 % Fertigungslöhne; Vw/Vt-GK 10 % Herstellkosten. CNC+PROD-Fertigungslöhne 6.900 €/Monat plus 21 % Arbeitgeberkosten = 8.349 € FGK-Basis; MA-AV 4.235 €/Monat im Vw/Vt-Pool; Payroll gesamt 12.584 €/Monat. CNC-kalkulatorische Monatsbasis `(120.000 € × 1,02^16) / 192`, auf volle Euro aufgerundet; bilanzielle Abschreibung getrennt (D-0062–76). Weitere laufende Kosten, Zuordnungen und Ausführungs-/Periodendetails bleiben offen. |

### 4.6 Simulation und Audit

| Tabelle | Kernfelder | Regel |
|---|---|---|
| `simulation_run` | ID, Firma, Simulationsuhr, Startdatum, Regel-/Modulversion, Seedreferenz, Status | Fester Start 01.01.2027. V1-Arbeitskalender: Montag–Freitag, je 8 h/Tag für Beschäftigte und CNC; Wochenenden arbeitsfrei. Der Arbeitskalender nutzt prototypisch die Feiertags-Vereinigungsmenge nach D-0134; D-0011 bleibt die historische Kernregel. Wochenraster mit konkreten Kalendertagen und flexibler Fortschreibung; Wochenendtermine auf nächsten Arbeitstag (D-0011). |
| `simulation_phase_rule` | Regelversion, Phasennummer, Phasencode, Gültigkeitsbereich | Deterministische Tagesphasen: Spielerentscheidungen → Wareneingang/externe Leistung → Produktion/Materialverbrauch → Produktionsabschluss → Lieferung → Abnahme → Rechnung → fällige Zahlungen → Tagesabschluss → periodische Kosten. Same-day-Abhängigkeiten dürfen in späteren Phasen desselben Tages weiterlaufen; frühere Phasen werden nicht erneut geöffnet. |
| `business_event` | Event-ID, Run, Ereignisart, Aggregattyp/-ID, Simulations-/Erfassungszeit, Kalendertag, Phasencode, Sequenz, Schema-Version, Causation/Correlation, Payloadreferenz | Herkunft und deterministische Reihenfolge einschließlich Phase/Tag; konkreter Datumstempel trotz Wochenraster. Reihenfolge/Interaktion gleichzeitiger Zahlungs-, Retry-, Dunning-, Darlehens-, SimTAX- und Periodenereignisse bleibt mit A02 abzustimmen. |
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
- Erfassungszeit (`recorded_at`) und Simulations-/Wirksamkeitszeit (`occurred_at_sim`, `effective_at`, `recognized_at`) sind getrennt. Kalender sowie Geschäftsjahres-/SimTAX-Periodik folgen D-0011/D-0097/D-0118; Zeitzone und fachübergreifende Ereignisreihenfolge bleiben Schnittstellendetails.
- A02→A03-Übergaben tragen stabile Quell-Event-ID und fachliche Referenzen; wiederholte Zustellung darf keine Dublette erzeugen. A03 bestätigt die Verarbeitung unabhängig vom Operationsstatus.

## 6. V1-Invarianten und Schnittstellen

V1-Validierungsregeln:

1. Angebot erzeugt keine Forderung oder realisierten Erlös und bindet keine Produktion.
2. Auftrag referenziert die angenommene Angebotsversion oder eine dokumentierte Abweichung.
3. Operative Vollständigkeit verlangt vollständige Menge, Lieferung und Abnahme; G3 schließt den Kundenauftrag erst nach vollständiger Zahlung der Kundenforderung. Lieferantenverbindlichkeiten blockieren diesen Abschluss nicht.
4. V1-Commands bieten keine Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung an, auch wenn Tabellen später mehrere Vorgänge erlauben.
5. Rechnungssummen bleiben differenziert; SimTAX folgt den bestätigten D-0053–59/D-0097/D-0113–14-Regeln. Daraus wird keine rechtliche Steuerlogik abgeleitet.
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
| Mahnung/Inkasso | V1 bei eigenen Verbindlichkeiten: wöchentliche Retries, Zahlungserinnerung, formelle Mahnung; Spielverlust nach achtem fehlgeschlagenem Retry; keine Pfändung/Liquidation nach formeller Mahnung | Fristen/Stufen gemäß D-0024–29 bestätigt. A02-Ereignisreihenfolge bleibt offen; keine Dunning-Übertragung auf Kundeneingänge. |
| Dynamische Kostenrechnung | versionierte BAB-Treiber, Kostenstellen, Kostenarten | A03/Nutzer bestimmen Methode; V1 statisch/vereinfacht. |
| IHK-Lernen/-Prüfen | getrennter Kontext, minimierte versionierte Snapshots | Keine operative Lern-/Prüfungslogik. |

## 8. Offene Regeln und Entscheidungszuordnung

| Thema | Verbindlich | A04 modelliert | Fachentscheidung / Zuständigkeit |
|---|---|---|---|
| V1-Vollständigkeit | keine Teilvorgänge | Mengen-/Mehrbelegreferenzen; V1-Validierung getrennt | A02 bestätigt genaue Invarianten. |
| Startunternehmen | Start 01.01.2027; Aktiva/Passiva je 46.714,20 €; CNC-Buchwert 0 €; Eigenkapital 15.214,20 €; Rahmen 50.000 € = Cash 30.000 € + ungezogener Rest 20.000 € | Bilanzzeilen und Rahmen getrennt; keine Ziehung aus Rest abgeleitet | Einzelbeleg-/Gegenpartei-Aufschlüsselung der aggregierten Forderungen/Verbindlichkeiten offen. |
| Arbeitskalender/Fristen | Mo–Fr, 8 h je Beschäftigtem/CNC; D-0011-Kern: Wochenendverschiebung; V1-Arbeitskalender-Erweiterung D-0134; vertragliche Fristen nach konkreter Regel; Kundenanker späteres Datum Rechnung/Leistung (nur Lieferung: Lieferdatum), Lieferantenanker Rechnung bei pünktlicher Lieferung; Kunden 14/30, Lieferanten 30 Kalendertage; Ankertag Tag 1 | `simulation_run`, `payment_term` mit Richtung/Anker/Zähltagen/Fälligkeit; berechneter Fälligkeitstag | Produktregeln D-0011, D-0013–20 entschieden. SimTAX-Fälligkeiten verschieben sich separat gemäß D-0097 auch bei gesetzlichen Feiertagen. CP-0150 dokumentiert den damaligen Abstimmungsstand; die späteren V1-Entscheidungen D-0120 und D-0129 regeln Zahlungsreihenfolge und Periodenzuordnung. Offene Kalender- oder Fristzählregeln sind hieraus nicht abzuleiten. |
| Kunden-/Lieferantenzahlungen | V1-Kundeneingang am Fälligkeitstag, außer explizites Verspätungsereignis, ohne Cash-Gate; eigene Payables mit Vollzahlungsversuch, Spielerpriorität, wöchentlichen Retries (acht Fehlversuche), Erinnerung +10 und formelle Mahnung weitere +14 Tage, danach keine Pfändung/Liquidation in V1 | getrennte Receipt-/Payable-Zahlungsereignisse, Zahlungsversuche, tatsächliche Zahlungen und Dunning; Richtungskonsistenz zur OP-Zuordnung | Regelkern D-0021–29 und D-0110 entschieden. Kundenverhaltensparameter und konkrete Verspätungsereignisse bleiben offen. Für Gleichzeitigkeit gilt D-0120 und D-0129: Kundeneingänge zuerst, danach Maschinenrate und eigene Zahlungen in Spielerreihenfolge; manuelle Dispoziehung deckt nur einen konkreten Fehlbetrag. Retry-, Mahn- und Darlehensereignisse sowie wirksames Datum und Periodenzuordnung folgen D-0129. |
| OP-Entstehung | Kundenforderung/Auftragserlös bei ausgestellter/freigegebener Rechnung für erbrachte/abrechenbare Leistung; Material-Payable bei akzeptiertem Wareneingang, Fremdleistungs-Payable bei bestätigter Leistung; Lieferantenrechnung bestätigt Betrag/Fälligkeit | Ursprung, Rechnungs-/Leistungsreferenz, Ansatz, Fälligkeit und OP getrennt | Fachliche Trigger D-0111/12 und allgemeine Ereignisreihenfolge D-0129 entschieden; konkrete Übergabe/Referenzierung bleibt offen. |
| Darlehen | 24.000 € Hauptschuld, fest 5 % p.a., 7 Jahre, monatliche Annuität am letzten Geschäftstag, 30E/360 und bestätigte Rundungs-/Retry-/Verwertungslogik | Darlehenshauptschuld, Zins, Tilgung, Zahlungsereignis und besonderer Ausfallpfad getrennt | Grundlogik D-0030–43; erster tatsächlicher Zahlungstermin und Annuität gemäß D-0121/22 beschlossen. Die Tagesreihenfolge, Zahlungsversuche und Periodenzuordnung folgen D-0129. |
| Unternehmenszinssatz / FKQ | Jährlich MRO am 1. Januar plus bestätigte FKQ-Aufschlagskurve; FKQ = Fremdkapital/Bilanzsumme; Dispozins 8 % über individuellem Unternehmenszins | `interest_rate_agreement` mit Referenzdatum, Eingangskennzahlen und Formelversion | D-0100–09, D-0023 und D-0123–27 entschieden. Künftige MRO-/Inflationsüberführung und FKQ-Verhalten über 100 % bleiben offene V2-Themen. |
| SimTAX / Periodenabschluss | 19 %, Basis bestätigter Positionswert vor SimTAX, volle Positionssumme, kaufmännisch Cent je Position; qualifizierte Lieferanten-Vorsteuer, Verrechnung, Monatszeitraum/Fälligkeit, Korrekturbezug; Geschäftsjahr Kalenderjahr und Folgejahrkorrektur nichtsteuerlicher Fehler | Rechnungskomponenten, `simtax_entry`, `simtax_period/return`, `accounting_period/period_close`, Umkehr-/Folgejahrreferenzen als logische Anforderungen | Kernregeln D-0053–59, D-0097, D-0113–19 entschieden. Konkrete Ereignisse, die Erklärungsfehler erkennen, offen; keine Rechtslogik außerhalb der bestätigten Simulationsregeln. |
| Teilproduktion je Position | V1 vollständig, spätere Teilvorgänge möglich | ProductionRunLine und positionsbezogene Verbrauchsreferenz | A02 bestätigt operative Granularität, Mengen- und Verbrauchsregeln; V1 bleibt ohne Teilfertigung. |
| BAB/Personal/CNC-Kosten | Sätze 15 % MGK/MEK, 100 % FGK/Fertigungslöhne, 10 % Vw/Vt/HK; Payroll und Arbeitgeberkosten sowie CNC-Wiederbeschaffungsbasis gemäß D-0065–76 | Versionierte BAB-Linien und Bemessungsbasen | Sätze und bestätigte Basiswerte entschieden; konkrete übrige Kosten, laufende Kostenstellenzuordnung und nicht festgelegte Perioden-/Ausführungsdetails offen. |
| Bilanzielle AfA | Bestehende CNC: linear, BMF-Referenzdauer sieben Jahre, Anschaffung 01.01.2019, Startbuchwert 0 €; AfA vorhandener Startanlagen am ersten Arbeitstag des zweiten Quartals. Neuanschaffungsmethoden und Auswahlmechanik gemäß D-0077–89 | Anlage, AfA-Policy und Periodenereignis logisch referenzierbar; vom kalkulatorischen BAB-Wert getrennt | Bestätigte Grundregeln und Auswahlmenü dokumentiert. Konkrete AfA-Werte für künftige Anschaffungen hängen von deren Anschaffungsdaten/-werten und einschlägigen Parametern ab; nichts wird vorab angesetzt. |
| Materialbewertung | E3 gleitender Durchschnitt; Startmengen 2.000 kg Stahl, 100 kg Aluminium und 60 Referenzschrauben; Startwert insgesamt 4.214,20 € gemäß D-0128 | Bewegungen mit Bewertungsreferenz; Startpreis ist ein V1-Szenariowert, keine historische Einstandsbewertung | Vorjahresschluss-/HGB-Herkunft ist für diesen Prototyp ausdrücklich ersetzt; E3-Fortschreibung gilt für nachfolgende Zugänge/Verbräuche. |
| Korrektur/Periodenabschluss | zwölfmonatiges Kalendergeschäftsjahr; nichtsteuerliche Korrektur nach Abschluss im Folgejahr, Vorperiode unverändert; SimTAX-Erklärungsberichtigung separat | Versions-/Umkehrreferenzen, Periodenabschluss- und Folgejahrbezug logisch darstellbar | D-0115–19 entschieden; konkrete A02-Ereignisabfolge und Ereignisse zur Erkennung fehlerhafter SimTAX-Erklärungen offen. |
| Speichertechnik | keine freigegebene Technologie | Logisch relationales Modell | A11/Nutzer: Technologie, Transaktion, Snapshot, Retention; PostgreSQL/Supabase nicht beschlossen. |
| Kalkulations-/Kostenmethode | differenzierte Plan-/Istwerte | Versionierte Positionsmodelle | A03/Nutzer: Satz, Gemeinkostenverteilung und Finalitätsregeln. |

Nur die in der letzten Spalte genannten Restpunkte sind derzeit offen. Die als Felder, Tabellen oder Übergaben beschriebenen Elemente sind Anforderungen des logischen Informationsmodells; sie genehmigen weder konkrete Datenbankobjekte noch APIs oder Architektur. Abstrakt belassene Details werden nicht von A04 ergänzt.

## 9. Quellen

- `docs/agent-system/decision-log.md` (D-0010–D-0119) und [CP-0148](../agent-system/checkpoints/MCP-2026103001.md#cp-0148); historische CP-0009-Grundlage.
- `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md` (A02: Prozess, Ereignisse, Status, Zeit/Mengen, Übergaben).
- `docs/accounting/maschinenbau-mvp-finanzspezifikation.md` (A03: Finanzbegriffe, Forderungen/Verbindlichkeiten, Liquidität, Kosten/Erlös, Ergebnis, BAB und offene Regeln).
- `docs/accounting/p0-finanzkonsistenzpruefung.md` und `docs/accounting/a03-decision-log-abgleich-bericht.md` (konsolidierter A03-Abgleich und verbleibende Finanzschnittstellen).
- `docs/architecture/architecture-v0.2.md` und `docs/architecture/adr/ADR-001.md` bis `ADR-008.md` (vorgeschlagene Systemgrenzen; PROPOSED, keine Persistenztechnologie beschlossen).
- `AGENTS.md`, Agentenstruktur, Goals, Ticket-Board und Collaboration State.

## 10. Historischer QA-Abgleich zu CP-0011/CP-0013

Dieser Abschnitt dokumentiert den damaligen Reviewstand. Die Scope-Hinweise wurden danach mit T-0007 in A02/A03 bereinigt; die damalige Aufforderung an A01, A02/A03 um Angleichung zu bitten, ist kein aktueller offener Auftrag.

Die drei MAJOR-Befunde aus [CP-0011](../agent-system/checkpoints/MCP-2026103001.md#cp-0011) sind strukturell adressiert:

1. **Verbindlichkeit vor Lieferantenrechnung:** `obligation_source` hält Ursprungstatsachen getrennt von `payable`; Payable benötigt keine SupplierInvoice. `payable_invoice_link` kann eine später eingehende Rechnung zuordnen. Das Modell setzt keinen Entstehungszeitpunkt fest.
2. **Anzahlungen:** `payment` kann Contract und PaymentTerm referenzieren; `payment_term_payment` verbindet Zahlung(en) mit vereinbarten Terminen auch ohne Invoice oder OP. Klassifikation, Bilanz- und Steuerwirkung bleiben offen.
3. **Teilproduktion je Auftragsposition:** `production_run_line` verknüpft Lauf und konkrete ContractLine mit Plan-/Fertigmenge und Einheit; `resource_consumption` referenziert die Laufposition. V1 verlangt weiterhin vollständige Mengen und aktiviert keine Teilproduktion.

Die damals festgestellte MINOR-Scope-Abweichung betraf ältere A02-/A03-Texte und wurde mit T-0007 an D-0010 angeglichen. Die historischen QA-Feststellungen ändern den aktuellen Regelstand in Abschnitt 8 nicht.

Historische Offenpunkte aus CP-0011/CP-0013 sind gemäß aktuellem Decision Log nicht pauschal weiter offen. Der aktuelle Status steht in Abschnitt 8; Verbindlichkeitsauslöser, Fristen, Materialbewertungsmethode und Periodenregeln sind entschieden, während dort benannte Schnittstellendetails offenbleiben.

A09 prüfte seinerzeit die drei Strukturpunkte; dieser historische Folgehinweis ist erledigt und kein aktueller Auftrag.

## 11. CP-0022 P0-Modellabgleich

**Historischer Stand:** Die folgenden CP-0022/CP-0023-Angaben bildeten den damaligen Regelstand ab. Insbesondere die dort genannte Bilanzsumme von 95.300 € mit CNC-Wert 40.000 € wurde durch D-0099/CP-0148 ersetzt. Auch damalige offene Angaben zu Kalenderzählung, Dunning und Darlehen sind durch die späteren Decision-Log-Einträge teilweise entschieden. Aktuell maßgeblich sind §4.1 und Abschnitt 8 dieses Dokuments.

Die von CP-0022 festgestellten Modellwidersprüche und Dokumentationslücken sind in dieser Spezifikation adressiert. T-0006 bleibt abgeschlossen; dies ist eine dokumentarische Modellspezifikationskorrektur und keine Implementierungs- oder Schemafreigabe.

**Historischer QA-Befund CP-0022 (durch D-0099 und für den V1-Start zuletzt D-0128 ersetzt):** (1) Die zwischenzeitliche Korrektur auf 95.300 € mit CNC 40.000 € und Eigenkapital 63.800 € war durch D-0099 überholt. Für den damaligen QA-Schnappschuss galt: Aktiva 55.300 € (Bank 30.000 €, Forderungen 12.500 €, Vorräte 12.800 €, CNC-Buchwert 0 €); Passiva/Eigenkapital 55.300 € (Lieferantenverbindlichkeiten 7.500 €, Maschinendarlehen 24.000 €, Eigenkapital-Restposition 23.800 €). Separat davon: 50.000 € Gesamtfinanzierungs-/Budgetrahmen = 30.000 € Bankbestand + 20.000 € ungenutzter Rahmen; der Rest ist weder Cash noch zusätzliche Passivposition. (2) Fälligkeit führt zum automatischen Vollzahlungsversuch; nur ausreichende Liquidität ermöglicht vollständige Zahlung. Sonst keine Teilzahlung, vollständiger OP bleibt bestehen, der nicht ausgeführte Versuch wird als fehlgeschlagen dokumentiert und Liquidität wird nicht negativ.

**Dokumentationslücken behoben:** SimTAX (19 %, Simulationseinstellung, keine Rechtslogik, je Position Cent-Rundung, danach Summierung); getrennte Mitarbeiter- und CNC-Kapazitäten und bestätigte A02-Werte; konkrete Tagesphasen, Kalendertage, Wochenendverschiebung und same-day-Folgephasen; bestätigter Mahnfluss bis zu möglicher Pfändung oder Liquidation ohne erfundene Fristen/Schwellen. Operative Ereignisse, Zahlungsversuche, Rechnungen, Forderungen/Verbindlichkeiten, tatsächliche Zahlungen und Auftragsstatus bleiben getrennt.

Die dort aufgeführten offenen Angaben waren der damalige Stand. Sie sind kein aktuelles Offenregister; die heutigen bestätigten und offenen Regeln stehen in Abschnitt 8 und im Decision-Log-Abgleich unten. CP-0020 fehlt als Datei im Checkout und wurde weiterhin nicht rekonstruiert.

Der Abgleich zeigt für die hier bearbeiteten Regeln keine verbleibenden Widersprüche zu den aktuellen A02-/A03-Spezifikationen. Die ausdrücklich offenen Parameter bleiben als offene Punkte bestehen.

## 12. Historischer CP-0025/CP-0026-Abgleich der Zahlungsrichtungen

Dieser Abschnitt hält den damaligen Richtungsabgleich fest. Nachfolgende Entscheidungen, insbesondere D-0024–29, haben die damaligen Aussagen zu Retry/Dunning konkretisiert und den allgemeinen Pfändungs-/Liquidationspfad für V1 ausgeschlossen. Der aktuelle Stand steht in Abschnitt 8 und im folgenden Decision-Log-Abgleich.

Der Abgleich ergab eine Modelllücke: Die frühere generische `payment_attempt`-Zuordnung erlaubte Receivable oder Payable, obwohl der Liquiditätscheck und Dunning nur für eigene Verbindlichkeiten gelten. Die Zuordnung des generischen Mahnfalls auf Receivable oder Payable konnte ebenfalls fälschlich den Eindruck erwecken, Kundeneingänge würden durch die eigene Liquidität bedingt. Die konzeptionellen Objekte sind daher in diesem Dokument nach Zahlungsrichtung präzisiert; dies ist keine physische Schemaänderung.

- **Kundeneingang:** `payment` mit Richtung `CUSTOMER_RECEIPT`, verknüpft mit Kunde und Receivable. Auslösung folgt Kundenverhalten ohne Cash-Gate; der tatsächliche Eingang erhöht Liquidität und reduziert/schließt die Forderung.
- **Eigene Zahlung:** `payable_payment_attempt` ist nur an Payable gebunden. Fälligkeit löst den automatischen Vollzahlungsversuch aus. Erfolg erfordert ausreichende eigene Liquidität und erzeugt die tatsächliche Zahlung; Fehlschlag hinterlässt den vollständigen offenen Payable ohne Zahlung oder Liquiditätsbewegung.
- **Mahnfluss:** `dunning_case`/`dunning_event` sind nur an Payable und dessen fehlgeschlagenen Zahlungsversuch gebunden.
- `payment_allocation` muss zur Richtung passen: Kundeneingang→Receivable; eigene Zahlung→Payable. Forderung und Verbindlichkeit bleiben unabhängig geführte OP-Objekte.

Der damalige Offenstand wurde durch spätere Entscheidungen teilweise geschlossen. Nur die in Abschnitt 8 weiterhin ausdrücklich genannten Parameter bleiben offen.

## 13. Abgleich mit aktuellen Entscheidungen und CP-0148–CP-0193

Der aktuelle Stand ersetzt überholte Offenmarkierungen in den älteren QA-Schnappschüssen. Bestätigt sind: V1-Arbeitskalender/F3-Spielregel einschließlich Feiertagskonvention D-0134; Fristanker, 14-/30-Tage-Ziele, Kalendertage, Ankertagzählung und Wochenendverschiebung (D-0013–20); Kundeneingänge am Fälligkeitstag ohne Cash-Gate sowie Zahlungsereignisreihenfolge (D-0110–12, D-0120, D-0129); Spielerpriorität, wöchentliche Retries, acht Retry-Fehlschläge, +10-Tage-Erinnerung, +14-Tage-Mahnung und keine Pfändung/Liquidation nach formeller Mahnung in V1 (D-0021–29); Darlehensgrundlogik, Rate und erster Zahlungstermin (D-0030–43, D-0121/22); Dispo-Höchstbetrag, manuelle Ziehung, Kundeneingangs-Rückführung und täglicher Zins mit Monatsbelastung (D-0123–27); SimTAX einschließlich Bemessung, kaufmännischer Positionsrundung, Vorsteuerfilter, Periodik und Folgejahrkorrektur (D-0053–59, D-0097, D-0113–19); D3-BAB-, Payroll-/CNC-Kalkulations- und AfA-Regeln (D-0062–89); E3 und Materialpreis-Basiswert 4.214,20 € für den V1-Start (D-0090–93, D-0128); Unternehmenszins-/FKQ-Referenz und Kurve (D-0100–09); CNC-Eröffnungsbuchwert 0 € (D-0099). Die V1-Eröffnungsbilanzsumme von 46.714,20 € und der daraus folgende initiale Dispo-Höchstbetrag von 4.671,42 € berücksichtigen D-0128. Einzelwerte und Modellanforderungen sind in den Abschnitten 4 und 8 aufgeführt.

**Weiterhin offen:** Kundenverhaltensparameter und konkrete Verspätungsereignisse; künftige MRO-/Inflationsüberführung und FKQ-Verhalten über 100 % (V2); konkrete übrige Kosten und nicht festgelegte Kostenstellen-/Periodenzuordnungen; konkrete Ereignisse zur SimTAX-Fehlererkennung. Darlehensrate und erster tatsächlicher Zahlungstermin, Dispo-Limit/-Regeln sowie A02/A03-Ereignisreihenfolge und Periodenzuordnung sind durch D-0120–D-0129 entschieden und keine offenen Punkte mehr.

Alle im Datenmodell genannten Tabellen, Statuswerte, Attribute und Übergaben sind logische Anforderungen bzw. Vorschläge. Keine davon genehmigt ein physisches Schema, eine Migration, API, Architektur oder Implementierung. A02-/A03-Autorität über operative bzw. finanzielle Regeln bleibt unberührt.

## 14. Abschlussstatus und offene Fachregeln

Der Modellierungsvorschlag bleibt vorbehaltlich Prüfung durch A02 (Zeit, Mengen, Status, Prozessabschluss), A03 (Beträge, Eigentümerschaft Finanzobjekte, BAB, Material-/Kostenbewertung) und A11 (Systemgrenzen und Persistenz/Audit). Er gibt weder Architektur noch ADRs frei. Offene Fachregeln aus Abschnitt 8 benötigen zuständige Klärung vor Implementierung.

Es wurden keine Anwendungscodeänderungen, Datenbankmigrationen, Supabase-Änderungen, Implementierungen oder Dependencyänderungen vorgenommen. A02/A03-Unterlagen, Decision Log, D-0010 und Ticketstatus wurden nicht verändert.
