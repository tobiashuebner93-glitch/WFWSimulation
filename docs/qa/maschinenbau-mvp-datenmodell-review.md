# QA-Review – Maschinenbau-MVP-Datenmodell

**Datum:** 2026-09-26  
**Agent:** A09 – QA  
**Bezug:** MG-000 / SLG-000.2 / T-0006 / D-0010  
**Ergebnis:** QA NICHT BESTANDEN – MAJOR-Befunde zur Erweiterbarkeit und einer offenen Finanzvariante

## Prüfauftrag und Maßstab

Geprüft wurden Qualität, Konsistenz, Vollständigkeit und Governance-Konformität des A04-Datenmodellvorschlags. Architektur V0.2 und ADR-001 bis ADR-008 wurden ausschließlich als PROPOSED-Systemgrenzen berücksichtigt, nicht als freigegebene Architektur.

Die fachlichen Zuständigkeiten bleiben: A02 für Simulation, Prozess, Zeit, Mengen und operative Ereignisse; A03 für Accounting, Beträge, Forderungen, Verbindlichkeiten, Kosten, Erlöse, Liquidität und Ergebnis; A04 für Persistenzstruktur und technische Invarianten. D-0010 ist die maßgebliche Nutzerentscheidung für V1 und spätere Erweiterbarkeit.

## Geprüfte Dokumente

- `AGENTS.md`
- `docs/agent-system/agent-structure.md`
- `docs/agent-system/goals.md`
- `docs/agent-system/ticket-board.md`
- `docs/agent-system/collaboration-state.md`
- `docs/agent-system/decision-log.md` einschließlich D-0010
- `docs/agent-system/checkpoints/CP-0001.md` bis `CP-0010.md`
- `docs/database/maschinenbau-mvp-datenmodell.md`
- `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md`
- `docs/accounting/maschinenbau-mvp-finanzspezifikation.md`
- `docs/architecture/architecture-v0.2.md` sowie ADR-001 bis ADR-008 (PROPOSED)

## Befunde

### MAJOR – Verbindlichkeit kann strukturell nicht vor Lieferantenrechnung referenziert werden

**Referenz:** Datenmodell §3.2, §4.4 (`supplier_invoice` / `payable`), §8 „OP-Entstehung“; A03-Finanzspezifikation §D und §P.

Das Modell beschreibt die Entstehung der Verbindlichkeit bei Eingang/Leistung oder Rechnung ausdrücklich als offene A03-Regel. Zugleich verlangt das `payable`-Objekt einen FK auf `SupplierInvoice`; §3.2 beschreibt die Lieferantenrechnung als Erzeuger von Payables. Damit kann die fachlich von A03 empfohlene Möglichkeit „Verbindlichkeit bei akzeptiertem Wareneingang bzw. bestätigter Fremdleistung, Lieferantenrechnung folgt später“ nicht dargestellt werden.

**Auswirkung:** Falls A03/Nutzer den Eingang oder die Leistung als Auslöser wählen, kann das Modell den offenen Posten nicht ohne vorgezogene bzw. künstliche Lieferantenrechnung speichern. Das ist eine technische Lücke im Umgang mit einer ausdrücklich offenen Regel, keine Entscheidung über den richtigen Buchungszeitpunkt.

**Folgeaktion:** A03 soll den Auslöser fachlich festlegen. A04 soll anschließend sicherstellen, dass die gewählte Variante darstellbar ist: bei Eingang/Leistung als Auslöser muss ein offener Posten auf den Ursprungsfakt/Receipt bzw. Service-Acceptance referenzierbar sein, auch wenn noch keine SupplierInvoice existiert. A11 prüft die Schnittstellengrenze.

### MAJOR – Zukünftige Anzahlungen haben keinen expliziten Zuordnungspfad

**Referenz:** Datenmodell §4.2 (`payment_term`), §4.4 (`receivable`, `payable`, `payment`, `payment_allocation`), §7 „Anzahlungen/mehrere Termine“; D-0010.

D-0010 verlangt, spätere Vorschüsse/Anzahlungen und Nachzahlungen zu ermöglichen. `payment_term` kann Vertragsbedingungen speichern, aber `payment` enthält keine Referenz auf Vertrag oder Zahlungsbedingung. Eine `payment_allocation` muss laut Modell genau einem Receivable oder Payable zugeordnet sein; beide offenen Posten verlangen eine Invoice-Referenz. Eine Zahlung, die vor einer Rechnung als Anzahlung anfällt, hat damit keinen modellierten Weg, um sie dem Vertrag bzw. konkreten Zahlungstermin zuzuordnen und später auszugleichen.

**Auswirkung:** Die genannte Erweiterbarkeit auf Vorschüsse/Anzahlungen ist nicht vollständig durch die ausgewiesenen Beziehungen abgesichert. Mehrere Zahlungen nach vorhandener Rechnung sind dagegen durch Payment und mehrere Allocations grundsätzlich abbildbar.

**Folgeaktion:** A04 soll einen späteren Referenz-/Zuordnungspfad von Payment zu Vertrag/Zahlungstermin bzw. einen geeigneten nicht fakturabezogenen Anzahlungsposten ausweisen. A03 und der Nutzer entscheiden Semantik, Trigger und Verrechnung; dieser Review legt sie nicht fest.

### MAJOR – Teilproduktion ist nicht bis zur Vertragsposition nachvollziehbar

**Referenz:** Datenmodell §4.3 (`production_run`, `resource_consumption`), §7 „Teilproduktion“.

Der Erweiterungspfad nennt mehrere ProductionRuns und mengenbezogenen Verbrauch je Vertragszeile. Im Tabellenmodell referenziert `production_run` jedoch nur den Contract und hält eine geplante/fertige Menge ohne ContractLine-Zuordnung. `resource_consumption` referenziert den ProductionRun, aber keine ContractLine. Bei mehrzeiligen Aufträgen lässt sich daher nicht bestimmen, für welche Position ein Lauf bzw. dessen Verbrauch gilt.

**Auswirkung:** Teilproduktion lässt sich nicht konsistent positionsweise fortsetzen oder gegen Sollmengen prüfen, obwohl sie als spätere Erweiterung ausgewiesen ist. Die V1-Grenze ohne Teilfertigung ist davon nicht betroffen.

**Folgeaktion:** A04/A02 sollen für die spätere Erweiterung die fachliche Granularität (Run je Auftragsposition oder Run-Position-Beziehung) und Mengen-/Verbrauchsreferenzen festlegen. Keine Granularität wird hier vorgegeben.

### MINOR – A02/A03-Spezifikationen enthalten überholte bzw. abweichende Teilvorgangsangaben

**Referenz:** A02-Spezifikation §B („Optional im MVP“: Teillieferung); A03-Finanzspezifikation §P (Teilvorgänge weiterhin OPEN und „Teillieferung laut A02 optional“) sowie §P D-0010 („nicht vorhanden“); D-0010 und CP-0009.

D-0010 legt fest, dass Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung nicht zu V1 gehören, aber später möglich bleiben. Das Datenmodell folgt D-0010 korrekt. Die älteren A02-/A03-Texte widersprechen dieser V1-Grenze bzw. behandeln D-0010 als nicht verfügbar.

**Auswirkung:** Die fachlichen Quellen bieten für Folgearbeiten keine einheitliche Scope-Aussage. Das ist ein Spezifikations-/Governance-Widerspruch, kein Fehler der im Datenmodell gewählten V1-Grenze.

**Folgeaktion:** A01 sollte A02 und A03 um eine fachliche Nachführung der Scope-Aussagen bitten; D-0010 bleibt dabei unverändert und autoritativ.

## PASS – geprüfte Bereiche ohne relevanten Modellbefund

- **V1-Prozessabdeckung:** Anfrage, Kalkulation, Angebotsversion und Verkaufsentscheidung, Auftrag/Vertrag, Bestellung, Wareneingang/Fremdleistung, Produktion, Lieferung/Abnahme, Kunden-/Lieferantenrechnung, offene Posten, Zahlung, Abschluss und Auftragsergebnis sind als getrennte Objekte oder Statusdimensionen vertreten. Kunden-/Lieferantenrechnungen und Zahlungsereignisse sind von Leistung und Lieferung getrennt.
- **Finanzabgrenzung:** Planwerte sind von Istkosten, Erlösen, offenen Posten und Liquidität getrennt. Bestellung ist nicht automatisch Verbindlichkeit/Zahlung; Fälligkeit ist keine Zahlung; Zahlung ist keine erneute Erlös-/Kostenwirkung. A03 bleibt autoritativ für Finanzansatz, Buchungen, Salden, Liquidität und Auftragsergebnis.
- **Betragsdifferenzierung:** Positionen sowie Zwischen-, Steuer- und Gesamtbeträge sind vorgesehen. Netto-/Bruttosemantik und Steuerwerte bleiben ausdrücklich offen.
- **BAB und Kosten:** V1-BAB ist als versionierte Eingabe mit statischer/vereinfachter Verteilung vertreten. Kostenmethode, BAB-Schlüssel und dynamische Treiber sind A03/Nutzerentscheidungen.
- **Startprofil:** bestehendes Unternehmen, gemietete Facility, eine Maschine, drei Mitarbeiter und 50.000 € Startbudget sind modelliert. Einordnung/Stichtag und weitere Werte bleiben offen.
- **Status/Integrität:** operative Auftrags-, Beschaffungs-, Rechnungs-, OP- und Zahlungsstatus sind getrennt; Schlüssel, wichtige Unique-Regeln, Mengen-/Betragsprüfungen, Historisierung und referenzierte Korrekturen sind nachvollziehbar beschrieben.
- **Weitere Erweiterungen:** Teillieferung/-rechnung, Teilzahlung mit Zuordnung mehrerer offener Posten, Mahnung/Inkasso und dynamischer BAB haben benannte Erweiterungspfade. Die Semantik bleibt offen, wo A02/A03/Nutzer entscheiden müssen.
- **Governance:** A04 hat keine offene fachliche Accounting-Regel als beschlossen ausgegeben. D-0010 wurde nicht verändert; Architektur und ADRs bleiben PROPOSED. Keine Simulations-, Accounting- oder Datenbankautorität wird vermischt.

## Offene fachliche Regeln – kein Modellfehler allein

Die folgenden Punkte sind in A02/A03/D-0010 als offen ausgewiesen und werden hier nicht entschieden: Zeit-/Periodenregeln; Netto/Brutto/Steuern; Zahlungsvarianten und Zahlungsauslösung; Kostenmethode und BAB-Verteilung; Materialbewertung; Abnahme; operative und finanzielle Auftragsabschlussbedingungen; Korrekturen, insbesondere nach Periodenabschluss; Stichtag, Startbudget-Klassifikation und weitere Startparameter.

Der offene Charakter dieser Regeln ist governance-konform. Die drei MAJOR-Befunde oben beziehen sich jeweils auf fehlende strukturelle Unterstützung für ausdrücklich gewünschte Regelvarianten oder spätere Erweiterbarkeit, nicht darauf, dass eine offene Regel selbst falsch wäre.

## Repository- und Abschlussbefund

Es wurden keine Anwendungscode-, Migrations-, Supabase- oder Dependencydateien geändert. Der Review verändert keine D-ID und genehmigt weder Architektur noch Datenbankimplementierung. Ein Checkpoint ist wegen wesentlicher QA-Befunde und der Checkpoint-Regel erforderlich.

**Gesamturteil:** Datenmodell als konzeptioneller V1-Vorschlag weitgehend konsistent; QA **NICHT BESTANDEN**, bis die drei MAJOR-Erweiterungs-/Modelllücken fachlich geklärt und im Datenmodell abgebildet oder ausdrücklich aus dem Erweiterungsumfang herausgenommen sind. Die A02/A03-Scope-Abweichung ist separat durch A01 nachzuführen.

## Geänderte Dateien dieses QA-Schritts

- `docs/qa/maschinenbau-mvp-datenmodell-review.md` (dieser Review)
- `docs/agent-system/checkpoints/CP-0011.md` (Checkpoint)
- `docs/agent-system/collaboration-state.md` (Checkpoint-Verweis und QA-Arbeitsstand)
