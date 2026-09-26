# WFWSimulation – Technische Zielarchitektur V0.2

STATUS: PROPOSED / NICHT FREIGEGEBEN  
Stand: 2026-09-25  
Bezug: MG-000 / SLG-000.2 / T-0002

## 1. Zweck und Geltungsbereich

Dieses Dokument beschreibt die vorgeschlagene technische Zielarchitektur WFWSimulation V0.2. Es dient als Arbeitsgrundlage für Prüfung und spätere Produktentscheidungen.

Es ist keine Architekturfreigabe. Die beschriebenen Komponenten sind Ziel- und Entwurfsbegriffe. Sie belegen keine vorhandene Implementierung.

## 2. Kennzeichnung

- **FACT:** ausdrücklich in vorhandenen Governance-Dokumenten oder Checkpoints festgehalten.
- **PROPOSED:** Architekturvorschlag zur späteren Prüfung.
- **OPEN:** Entscheidung noch nicht getroffen.
- **UNKNOWN:** in den herangezogenen Unterlagen nicht nachweisbar.

**FACT:** CP-0002 dokumentiert für die damalige Bestandsaufnahme, dass keine Anwendungslogik, kein Frontend/Backend, keine Datenbank-/Supabase-Integration, keine Tests und keine Dependencies vorhanden waren.

**FACT:** CP-0001 hält fest, dass keine Architekturentscheidung freigegeben ist. D-0001 bis D-0009 sind Vorschläge. Diese Dokumentation ändert ihren Status nicht.

## 3. Architekturziele

**PROPOSED:** WFWSimulation soll Unternehmenssimulation, Wirtschaftsfachwirt-IHK-Lernsystem, Prüfungssimulation, erweiterbares Managementspiel und Plattform für spezialisierte AI-Agenten unterstützen.

Die Unternehmenssimulation muss fachlich unter anderem Verträge, Leistungen, Rechnungen, Zahlungen, Kosten, Personal, Finanzierung und periodische Finanzsicht abbilden können. Die fachliche Vollständigkeit für deutsches Rechnungswesen, Steuerrecht oder Lohnabrechnung ist kein durch diesen Entwurf bestätigter Umsetzungsstand.

**PROPOSED:** Der Kern bleibt modular und zunächst zentral deploybar. Bounded Contexts trennen fachliche Verantwortung, ohne vorzeitig verteilte Services vorauszusetzen.

## 4. Systemgrenzen

```text
Spieler / Frontend                 AI-Agenten
       │                               │
       │ Commands / Queries            │ Vorschläge
       └──────────────┬────────────────┘
                      ↓
              Application Layer
          Validierung / Use Cases / Ablauf
                      ↓
     ┌────────────────┼─────────────────────┐
     ↓                ↓                     ↓
 Simulation       Fachkontexte       Learning / Exam
 Zeitablauf        Company, Sales,    konsumieren nur
 und Phasen        Contracts, etc.   freigegebene Daten
     │                │                     ↑
     │ Geschäftsvorfälle                    │ Context
     └───────────────→ Accounting ──────────┘
                        │
                 Journal / Ledger
                        │
          Persistenz / Audit / Snapshots
                        │
                Read Models / API
                        ↓
                    Frontend
```

**PROPOSED:** Die Grafik zeigt fachliche Verantwortungen und Datenrichtungen, keine bereits existierende Laufzeit- oder Deployment-Topologie.

### Verantwortungsgrenzen

- **Application Layer:** nimmt Commands entgegen, prüft Kontext und Berechtigung, orchestriert Use Cases und Periodenläufe.
- **Simulation:** verwaltet Periodenfortschritt, geordnete Phasen und deterministische Auflösung.
- **Accounting:** verarbeitet Geschäftsvorfälle nach Accounting-Regeln und ist die fachliche Autorität für Journal, Ledger und Finanzsichten.
- **Domänenkontexte:** führen jeweils ihre fachlichen Daten und Regeln.
- **Learning und Exam:** konsumieren freigegebene Simulationskontexte und führen eigene Lern- beziehungsweise Prüfungsvorgänge.
- **Persistence:** speichert fachliche Zustände, Events, Buchungen, Savegames und abgeleitete Ansichten gemäß ihrer Verantwortungsgrenzen.
- **Frontend:** zeigt Ansichten und sendet Commands. Es enthält keine autoritative Domain-, Simulations- oder Accounting-Logik. Darstellungs- und UI-Berechnungen sind zulässig, sofern ihre Ergebnisse keine autoritative fachliche Quelle darstellen.
- **AI-Agenten:** lesen freigegebene Informationen und schlagen Commands vor; sie mutieren keinen autoritativen Simulations- oder Accounting-State.

## 5. Bounded Contexts und Domainstruktur

**PROPOSED:** Die vorgeschlagene fachliche Gliederung:

```text
application/
  commands, queries, use cases, orchestration

contexts/
  company/
  customers-and-sales/
  contracts-and-operations/
  personnel/
  market/
  simulation/
  accounting/
  learning/
  exam/

industry-modules/
  facility-service/
  retail/
  manufacturing/
  it-service/
  energy/

platform/
  api/
  persistence/
  audit/
  ai/
  frontend/
```

Die Gliederung beschreibt logische Grenzen. Sie legt weder Programmiersprachen noch physische Services fest.

### Kontextverantwortungen

| Kontext | Vorgeschlagene Verantwortung |
|---|---|
| Company | Unternehmen, Standort- und Organisationsdaten sowie Verbindungen zu Rechtsform-/Eigentümerinformationen |
| Customers and Sales | Kunden, Segmente, Angebote und Verkaufsanbahnung |
| Contracts and Operations | Verträge, Aufträge, Leistungsplanung und Leistungserbringung |
| Personnel | Mitarbeiter, Beschäftigungsbedingungen, Arbeitszeit, Abwesenheit und Kapazität |
| Market | Region, Nachfrage, Segmente, Wettbewerber, Preisumfeld und Marktallokation |
| Simulation | Simulationsperiode, Phasenreihenfolge, Regel-/Seed-Kontext und Periodenabschluss-Orchestrierung |
| Accounting | Geschäftsvorfälle, Accounting-Regeln, Journal, Ledger und Finanzsichten |
| Learning | Lernziele, Themen, Lernfortschritt und Lerngelegenheiten aus freigegebenem Simulationskontext |
| Exam | Prüfungsfälle, Versuche, Bewertungsrubriken und Ergebnisse |
| Industry Modules | branchenspezifische Leistungs-, Kapazitäts-, Produktions-, Bestands- und Marktregeln |
| Application | Commands, Validierung, Use Cases, Abhängigkeitsorchestrierung und Transaktionsgrenzen |
| Persistence / Audit | dauerhafte Speicherung, Ereignisbezüge, Snapshots, Auditdaten und Read Models |
| API / Frontend | externe Ein-/Ausgabe, Nutzeransichten und Command-Übermittlung |
| AI | begrenzte Agentenwerkzeuge, Kontextbereitstellung und Vorschlagsausgabe |

### Domainobjekte

**PROPOSED:** Die folgenden Begriffe gehören nach fachlicher Prüfung in die genannten Kontexte. Nicht jeder Begriff ist eine eigenständige Entity.

- Company, LegalEntity, Founder, Owner, Shareholder: Company / Ownership
- Customer, CustomerSegment: Customers and Sales / Market
- Supplier, Subcontractor: Procurement / Operations; MVP-Zuordnung **OPEN**
- Employee, EmploymentContract: Personnel
- Service, Product: Catalog / Industry Module
- Order, Contract: Sales / Contracts and Operations
- Invoice, Payment, Receivable, Payable: Billing / Accounting
- Asset, Liability, Equity, Loan, Expense, Revenue, Tax: Accounting / Finance
- Decision, SimulationPeriod, GameState: Simulation / Application / Persistence
- Event: jeweiliger fachlicher Kontext; nicht als unspezifische Sammel-Entity
- Risk, Market, Competitor, Location: abhängig von der konkreten fachlichen Funktion

**PROPOSED:** Geldbetrag, Währung, Zeitraum, Zahlungsziel, Kapazität, Kontenreferenz und Vertragskonditionen eignen sich als Value Objects. Konkrete Aggregate-Grenzen bleiben **OPEN** und sind anhand fachlicher Regeln zu bestätigen.

## 6. Abhängigkeiten und verbotene Richtungen

**PROPOSED:**

- Application darf mehrere Kontexte orchestrieren; es soll keine Accounting-Regeln duplizieren.
- Simulation darf Fachkontexte in definierter Reihenfolge aufrufen; sie ist keine zweite Finanzwahrheit.
- Fachkontexte liefern bestätigte Geschäftsvorfälle an Accounting; sie schreiben keine Ledger-Salden.
- Accounting darf fachlich definierte Buchungsanforderungen annehmen und eigene Regeln anwenden; es darf nicht von Frontend- oder AI-Implementierungen abhängig sein.
- Industry Modules erweitern definierte Core-Schnittstellen; der Core hängt nicht von einem konkreten Branchenmodul ab.
- Learning und Exam lesen nur freigegebene, minimierte Simulation Contexts. Es gibt keine direkte Rückmutation in Simulation oder Accounting.
- Frontend und AI greifen nicht direkt auf interne Domänenobjekte, Tabellen oder Ledger-Schreibwege zu.

**Verbotene Abhängigkeitsrichtungen (PROPOSED):**

```text
Frontend ─X→ direkte Ledger-/Domain-State-Mutation
AI ─X→ direkte Mutation von Simulation oder Accounting
Learning ─X→ automatische Mutation der Simulation
Exam ─X→ automatische Mutation der Simulation
Industry Module ─X→ Umgehung der Accounting-Regeln
Simulation ─X→ eigene, konkurrierende Finanzsalden
Accounting ─X→ UI- oder Agentenlogik
```

## 7. Commands und Events

**PROPOSED:** Commands beschreiben Absichten. Sie können validiert und angenommen oder abgelehnt werden. Domain Events beschreiben bestätigte fachliche Tatsachen.

```text
Command
  → Berechtigungs- und Fachvalidierung
  → fachliche Zustandsänderung
  → Domain Event
  → Folgeprozesse
  → ggf. Business Transaction
  → Accounting Rules
  → Journal Entry
```

Beispiel:

```text
HireEmployee
  → Periode offen und Eingaben gültig?
  → EmployeeHired
  → Personalbestand und Kapazität aktualisieren
  → Personalgeschäftsvorfälle an Accounting übergeben
```

**PROPOSED:** Commands tragen eine eindeutige ID und erwartete Version zur Wiederholungserkennung und Konfliktprüfung. Events referenzieren Ursache, Kontext, Zeitpunkt und relevante Regel-/Schema-Version. Details des konkreten Schemas bleiben **OPEN**.

## 8. Simulation und Monatsablauf

**PROPOSED:** Die Application Layer stößt Zeitfortschreibung und Periodenorchestrierung an; Accounting bleibt für Verbuchung und Finanzsichten autoritativ. Das Wochenraster ist Anzeige- und Fortschreibungsraster, kein unteilbarer Simulationsschritt. Bei einem Sprung über mehrere Tage verarbeitet die Simulation jeden dazwischenliegenden Kalendertag einzeln. Jedes operative Ereignis erhält seinen tatsächlichen Simulations-Kalendertag; ein Wochen- oder Monatswert ersetzt dieses Ereignisdatum nicht.

Innerhalb jedes Kalendertags gilt die bestätigte A02-Tagesreihenfolge: (1) Spielerentscheidungen, (2) Wareneingänge/Fremdleistungen, (3) Produktion und Materialverbrauch, (4) Produktionsfertigstellung, (5) Lieferung, (6) Abnahme, (7) Rechnungsstellung, (8) fällige Zahlungen, (9) Tagesabschluss. Abhängige Folgeereignisse dürfen am selben Tag in einer späteren Phase stattfinden; eine bereits abgeschlossene frühere Phase wird nicht erneut geöffnet. Diese Tagesauflösung und Reihenfolge sind der operative Ablauf; die nachfolgenden Schritte beschreiben die übergeordnete Periodenorchestrierung.

Vorgeschlagene Phasen:

1. Periodenlauf mit Spielstand-, Regel-, Modul- und Seed-Version öffnen.
2. Spieler-Commands annehmen, validieren und in eine stabile Reihenfolge bringen.
3. Verträge, Aufträge und periodische Verpflichtungen bestimmen.
4. Nachfrage, Wettbewerb und Marktallokation gemäß versionierten Regeln auflösen.
5. Kapazität, Leistungserbringung, Abnahme und operative Ereignisse verarbeiten.
6. Rechnungsfähige Leistungen und Forderungen/Verbindlichkeiten erzeugen.
7. Zahlungen und Finanzierungsereignisse nach bekannten Bedingungen verarbeiten.
8. Personal-, Betriebs-, Investitions- und sonstige Geschäftsvorfälle erzeugen.
9. Steuern und Periodenabgrenzungen nur gemäß ausdrücklich festgelegter Regeln berücksichtigen.
10. Geschäftsvorfälle an Accounting übergeben und Buchungen prüfen.
11. Abschlussinvarianten und Finanzsichten berechnen.
12. Periodenereignisse, Ergebnis und Snapshot speichern und den Abschluss kennzeichnen.

Am Monatsende werden zunächst die Tagesphasen 1–9 des letzten Kalendertags vollständig abgeschlossen. Danach werden periodische Kosten/BAB-Ereignisse ausgelöst und der Monats-/Periodenabschluss mit Ergebnis und Snapshot gekennzeichnet. Verschobene Ereignisse behalten ihr tatsächliches Wirksamkeitsdatum; die Zuordnung eines auf den Folgemonat verschobenen Ereignisses zur Periodenauswertung bleibt fachlich offen. Der Periodenabschluss schreibt Ereignisse nicht rückwirkend um.

**OPEN:** Markt-/Ereigniszeitpunkte außerhalb der bestätigten Tagesreihenfolge, weitere Abschlussregeln und die Behandlung später Korrekturen.

## 9. Simulation und Accounting

**PROPOSED:** Simulation und Accounting sind getrennte fachliche Verantwortungsbereiche.

```text
Simulation Event
  → Business Transaction
  → Accounting Rule
  → Journal / Buchungen
  → Financial Statements
  → Cash- und Liquiditätssichten
```

Accounting unterscheidet mindestens:

- Einzahlung / Auszahlung als Zahlungsmittelbewegung
- Einnahme / Ausgabe als Veränderung des Geldvermögens
- Ertrag / Aufwand als periodenbezogene Erfolgsgrößen
- Gewinn, Cashflow, Liquidität und Eigenkapital als unterschiedliche Sichten

**PROPOSED:** Geschäftsvorfall, Buchungsdatum, Leistungsdatum, Rechnungsdatum, Fälligkeitsdatum und Zahlungsdatum bleiben unterscheidbar. Vertrag, Leistung, Rechnung und Zahlung sind getrennte Vorgänge.

Journalbuchungen sollen nachvollziehbar und nach Erfassung unveränderlich sein. Korrekturen erfolgen über referenzierte Korrekturvorgänge statt stiller Überschreibung. Konkreter Kontenplan, Rechtsform-, Steuer- und Lohnregeln sind **OPEN**.

## 10. Persistenz, Snapshots und Audit

**PROPOSED:** Persistenz unterscheidet logisch zwischen:

- Domain State und Referenzdaten
- Simulation State und Periodenläufen
- Accounting Journal / Ledger
- Commands, Domain Events und Auditbezügen
- Savegame-Snapshots
- Learning Progress
- Exam Results
- erneuerbaren Read Models

Bestätigte Journalbuchungen und Auditereignisse sollen append-only behandelt werden. Entwürfe und Read Models können aktualisierbar beziehungsweise rekonstruierbar sein.

**PROPOSED:** Für den MVP wird ein append-only Event-/Audit-Log mit versionierten Snapshots als Arbeitsansatz betrachtet. Vollständiges Event Sourcing ist nicht beschlossen.

**OPEN:** Die konkrete Datenbank- und Persistenztechnologie ist in den geprüften Governance- und Checkpoint-Artefakten nicht festgelegt. CP-0002 dokumentiert, dass im damaligen Repository-Stand keine Datenbank-/Supabase-Integration vorhanden war. Tabellen, Transaktionen, Authentifizierung, Aufbewahrung und Datenbankgrenzen bleiben offen.

## 11. Determinismus und Replay

**PROPOSED:** Ein reproduzierbarer Simulationslauf benötigt mindestens:

- Ausgangs-Snapshot
- geordnete und gespeicherte Commands
- RNG Seed
- Simulationsregel-Version
- Accounting-Regel-Version
- Industry-Module-Versionen
- Eventhistorie und deterministische Phasenreihenfolge

Gleiche Inputs und gleiche Versionen sollen dieselben fachlichen Ergebnisse erzeugen. Systemzeit, ungespeicherte Randomness, AI-Antworten oder nicht festgelegte Sortierreihenfolgen dürfen keine impliziten Simulationsinputs sein.

**OPEN:** Wie lange historische Regeln ausführbar bleiben und ob alte Saves nur lesbar oder vollständig fortsetzbar sein müssen.

## 12. AI-Agenten und Autorität

Die Governance definiert A01–A11. Die fachliche Zuständigkeit laut `agent-structure.md`:

| Agent | Fachbereich |
|---|---|
| A01 | Gesamtkoordination und Goals/Tickets |
| A02 | Simulation und Periodenverarbeitung |
| A03 | Accounting, Finance, Liquidität, Cashflow und Bilanz |
| A04 | Datenmodell, PostgreSQL, Supabase und Persistenz |
| A05 | UI/UX, Next.js, React und PWA |
| A06 | Wirtschaftsfachwirt-Lernengine |
| A07 | Prüfungssimulation und Bewertungslogik |
| A08 | Recherche und Quellen |
| A09 | Tests und Qualitätssicherung |
| A10 | GitHub, CI/CD und Deployment |
| A11 | Gesamtarchitektur, Systemgrenzen und Schnittstellen |

**PROPOSED:** READ / PROPOSE / VALIDATE / WRITE / APPROVE werden pro Aufgabe vergeben. Keine Rolle verleiht pauschalen Schreibzugriff auf kritische Finanz- oder Simulationsdaten.

- Simulation Engine berechnet Simulationsresultate.
- Accounting Engine erzeugt Buchungen und Finanzsichten.
- Accounting-/Finance-Agent darf analysieren und vorschlagen, nicht Ledger-Regeln umgehen.
- AI-Agenten dürfen Commands vorschlagen; die Application-/Domain-Schicht validiert sie.
- Database-Agent kann Datenmodell- oder Migrationsänderungen vorschlagen; Freigabe erfolgt durch zuständige Menschen/Fachrollen.
- Nutzer trifft finale Produkt- und Geschäftsentscheidungen.

## 13. Frontend und Backend

**PROPOSED:** Das Frontend zeigt Read Models und sendet Commands über API/Application Layer. Autoritative Domain-, Simulations- und Accounting-Logik liegt außerhalb des Frontends. Autoritative Validierung und Zustandsänderung erfolgen über Application- und Domain-Schicht.

Das Frontend darf Darstellungs- und UI-Berechnungen ausführen, sofern deren Ergebnisse keine autoritative fachliche Quelle darstellen und keine autoritativen Zustandsänderungen ersetzen.

```text
Frontend
  → API / Application Commands
  → Domain Contexts / Simulation / Accounting
  → Persistence
  → Read Models
  → Frontend
```

**OPEN:** Die konkrete Frontend-Technologie und das Frontend-Framework sind in den geprüften Governance- und Checkpoint-Artefakten nicht verbindlich festgelegt. CP-0002 dokumentiert, dass im damaligen Repository-Stand kein Frontend oder Backend vorhanden war. API-Stil, Authentifizierung, Hosting und Offline-Synchronisierung sind ebenfalls **OPEN**.

## 14. Industry Modules

**PROPOSED:** Ein allgemeiner Business-Simulationskern wird von branchenspezifischen Regeln getrennt.

- Core: generische Unternehmen, Perioden, Verträge, Kunden, Aufträge, Kapazitätsabstraktion, Geschäftsvorfälle, Accounting-Schnittstellen und Audit.
- Industry Module: branchenspezifische Leistungseinheiten, Kapazitätsmodelle, Liefer-/Produktionsabläufe, Bestände, Qualität und Kostenregeln.

**PROPOSED / ILLUSTRATIVE:** Facility Service, Retail, Manufacturing, IT-Service und Energie sind unverbindliche Beispiele aus der bisherigen Architekturarbeit. Sie sind keine bestätigte Branchenliste und legen keine Startbranche fest.

**OPEN:** Startbranche, Modulvertrag, Konfigurationsschema und Versionierungsdetails.

## 15. Learning und Exam

**PROPOSED:** Learning und Exam sind getrennte Bounded Contexts und lesen freigegebene Simulation Contexts.

```text
Simulation → minimierter Learning Context
Simulation → Prüfungsfall-Kontext → Exam Attempt → Assessment
```

Learning verwaltet Lernziele und Fortschritt. Exam verwaltet Prüfungsfälle, Versuche und Bewertungsrubriken. Beide verändern Simulation oder Accounting nicht direkt. Eine Rückwirkung wäre nur über einen ausdrücklichen Spieler-Command möglich.

**OPEN:** IHK-Rahmenplan, Quellen, Prüfungsformate, Rubriken und Qualitätsfreigabe.

## 16. MVP-Grenzen

**PROPOSED:** MVP-Ziel ist ein nachvollziehbarer Unternehmensverlauf mit:

- Unternehmensgründung und Startkapital
- mindestens einer wählbaren Branche
- Kunden, Angeboten, Verträgen, Aufträgen und Leistungen
- Rechnungen, Forderungen, Zahlungszielen und Zahlungen
- Kosten und einfacher Finanzierung
- getrennten Finanzsichten für Liquidität, Gewinn, Cashflow und Eigenkapital
- Entscheidungen, Monatsabschluss, Savegame und Historie

Learning und Exam müssen architektonisch vorbereitet, aber nicht vollständig umgesetzt sein. Personal-, Steuer-, Markt- und Branchenlogik können zunächst vereinfachte, ausdrücklich ausgewiesene Regeln haben.

**OPEN:** Startbranche, Rechtsform, Steuer-/Lohnumfang, MVP-Grenzen und gewünschte fachliche Realitätsnähe.

## 17. Risiken und Annahmen

### Risiken

- Unvollständige Buchungs- oder Steuerregeln könnten als fachlich korrekt missverstanden werden.
- Doppelte Finanzlogik außerhalb Accounting könnte widersprüchliche Salden erzeugen.
- Nicht versionierte Simulationsregeln oder Randomness verhindern Replay.
- Direkte AI-/Frontend-Schreibpfade könnten Validierung und Audit umgehen.
- Zu viele Branchen- und Rechtsformfälle könnten MVP-Komplexität erhöhen.
- Nicht definierte Savegame-Versionierung kann historische Zustände unlesbar machen.

### Annahmen

- **ASSUMPTION:** Zunächst ist ein zentral deploybarer modularer Kern ausreichend.
- **ASSUMPTION:** Ein append-only Event-/Audit-Log mit Snapshots genügt als MVP-Arbeitsansatz.
- **ASSUMPTION:** Vereinfachte Finanz-/Personalregeln könnten für einen frühen MVP genutzt werden, sofern ihre Grenzen sichtbar bleiben.

Diese Annahmen sind nicht freigegeben und können durch spätere Befunde geändert werden.

## 18. Offene Architekturfragen

- Welche Rechtsform und Startbranche gelten zuerst?
- Welche Steuer-, Umsatzsteuer-, Entnahme- und Lohnregeln sind im MVP nötig?
- Wo liegt die verbindliche Grenze zwischen Core und Industry Module?
- Wie werden Periodenabschluss und Korrekturen nach Abschluss behandelt?
- Welche Markt-, Nachfrage- und Wettbewerbsmechaniken werden benötigt?
- Welche Savegame-Versionen müssen langfristig fortsetzbar sein?
- Welche Daten dürfen Learning und Exam erhalten?
- Welche API-, Authentifizierungs- und Persistenzmodelle gelten?
- Welche Änderungen benötigen Nutzer- oder Fachfreigabe?
- Wie wird Multiplayer später berücksichtigt?

## 19. ADR-/D-ID-Mapping – Vorschlag / offen

D-IDs werden nicht geändert oder umnummeriert. Dieses Mapping schlägt lediglich fachliche Querverweise vor.

| ADR | Thema | Bestehender Decision Log Bezug |
|---|---|---|
| ADR-001 | Eigene Domain-/Accounting-Logik | D-0004 (Accounting); Ergänzung um eigene Domainlogik als ADR-Thema |
| ADR-002 | AI ohne direkte Mutation autoritativen Zustands | D-0005 |
| ADR-003 | Trennung Simulation und Accounting | D-0006 |
| ADR-004 | Frontend ohne autoritative Geschäftslogik | keine passende bestehende D-ID; Zuordnung **OPEN** |
| ADR-005 | OpenTycoonOS als Referenz | D-0003 |
| ADR-006 | Deterministische Simulation | D-0009 |
| ADR-007 | Industry Modules | D-0007 |
| ADR-008 | Trennung Learning und Exam | D-0008 |

D-0001 und D-0002 bleiben Governance-Einträge und werden keiner Architektur-ADR zugeordnet. Das Mapping ist **PROPOSED / OPEN**, nicht freigegeben.

## 20. Status

Dieser Architekturentwurf ist eine vorgeschlagene Arbeitsgrundlage für T-0002. Keine Architekturentscheidung und keine ADR ist freigegeben.

Alle ADRs haben den Status `PROPOSED`.
