# Agentenprofile und Rechte – A01 bis A11

Stand: 2026-10-29
Geltung: MG-002 und Folgeaufgaben; AGENTS.md bleibt höherrangige Control-Plane-Regel.

## Rechtebegriffe

- **READ:** relevante Repo-Unterlagen, Quellen und Zustände einsehen.
- **PROPOSE:** fachliche oder technische Vorschläge dokumentieren; kein stiller Default.
- **VALIDATE:** klar benannte Akzeptanzkriterien prüfen und Befunde belegen.
- **WRITE:** ausschließlich Dateien im ausdrücklich zugewiesenen Ticketumfang ändern.
- **APPROVE:** keine Agentenrolle besitzt Nutzer-, Rechts-, Architektur-, Schema-, Release- oder Produktfreigabe. A01 kann Prozess-/Dokumentationsabschlüsse koordinieren, aber keine Fachfreigaben ersetzen.

Jeder Auftrag nennt Adressat, Goal/Ticket, Umfang, erwartetes Ergebnis, Änderungsgrenzen und Review. Fachagenten richten Status und Rückfragen an A01. A01 bündelt nötige Nutzerfragen; Antworten ohne Rückfragen werden in einen konkret adressierten Folgeauftrag überführt oder als Abschluss dokumentiert. Vor jeder Bearbeitung gilt der Preflight aus AGENTS.md.

## Rollenprofile

### A01 – MASTER_ORCHESTRATOR

- **Verantwortung:** Goals, Tickets, Abhängigkeiten, Checkpoints, Kommunikationsrouting und Cross-Agent-Konfliktkoordination.
- **READ:** Control Plane, betroffene Fachunterlagen, Status/Diff und Checkpointbasis.
- **PROPOSE:** Reihenfolge, Scope, Abnahmekriterien und fachliche Optionen zur zuständigen Rolle/Nutzerentscheidung.
- **VALIDATE:** Vollständigkeit der Übergaben und ob die jeweils benannten Reviews/Tests dokumentiert sind.
- **WRITE:** Governance-Dokumente, Ticket-/Goalstatus, Koordinierungsberichte und Checkpoints innerhalb des Auftrags.
- **Grenze:** keine Ersatz-Fachautorität; keine eigenständige Änderung bestätigter Produktregeln, Finanz-/Ledgerlogik, Architektur oder Schema.

### A02 – SIMULATION

- **Verantwortung:** Ereignisablauf, Kalender, Kapazitäten, Personal-/Auftragsregeln und reproduzierbare Simulationsläufe.
- **READ:** Nutzerentscheidungen, A03-Buchungsregeln und relevante UI-/Modellanforderungen.
- **PROPOSE/VALIDATE:** Simulationsannahmen, Ereignisreihenfolge, Lauf- und Zustandsinvarianten.
- **WRITE:** Simulationsspezifikation sowie Engine/Tests nur bei ausdrücklich implementierendem Ticket.
- **Grenze:** ändert keine Accounting-Policy, Buchungssätze oder Bilanzfreigabe; Abhängigkeiten an A03 übergeben.

### A03 – ACCOUNTING_FINANCE

- **Verantwortung:** Kosten-/Leistungsrechnung, Liquidität, Finanzierung, Bilanz- und Periodenbezug des Simulationsmodells.
- **READ:** Simulationsevents, Nutzerentscheidungen und Datenmodellanforderungen.
- **PROPOSE/VALIDATE:** finanzielle Behandlung und Abstimmung von Wirkungen.
- **WRITE:** Accounting-/Finance-Dokumente und Finanzcode ausschließlich im Ticketumfang.
- **Grenze:** mutiert nicht eigenständig operative Ereignisregeln, reale Finanzkonten oder vollständige Rechts-/Steuerberatung.

### A04 – DATABASE

- **Verantwortung:** Datenanforderungen, logische Modelle, Datenintegrität, Persistenzoptionen und Migrationserfordernisse.
- **READ:** freigegebene fachliche Regeln und Betriebs-/Datenschutzanforderungen.
- **PROPOSE/VALIDATE:** logisches Schema, Versionierung, Migration und Datenqualitätskontrollen.
- **WRITE:** Datenmodell-Dokumente; Schema, Migration oder Persistenzcode nur mit separater Nutzerfreigabe und konkretem Implementierungsticket.
- **Grenze:** Vorschlag ist keine Architektur-, Datenschutz- oder Schemafreigabe.

### A05 – FRONTEND

- **Verantwortung:** Bedienabläufe, Darstellung, Barrierearmut, responsive Browseroberfläche und Frontend-Integration.
- **READ:** freigegebene UX-Anforderungen und von A02/A03/A06 bereitgestellte Fachverträge.
- **PROPOSE/VALIDATE:** Interaktions- und Darstellungsvarianten gegen Usabilitykriterien.
- **WRITE:** HTML, CSS, Browser-ES-Module und zugehörige UI-Tests, sofern das Ticket es erlaubt. Aktuelle Anwendung: statische HTML/CSS-Oberfläche mit nativen JavaScript-ES-Modulen; Frameworkwechsel ist nur Vorschlag.
- **Grenze:** legt keine fachlichen Simulations-, Finanz-, Lern- oder Rechtsregeln fest.

### A06 – IHK_LEARNING

- **Verantwortung:** Kompetenzlandkarte, didaktische Lernziele, Lernkarten, Erklärungen und fachlicher Schwierigkeitsmix.
- **READ:** offizieller Prüfungsrahmen, Quellenregister und Rechtstexte mit Stand.
- **PROPOSE/VALIDATE:** Kompetenzmapping und didaktische Konstruktion; Abweichungen zum Prüfungsrahmen markieren.
- **WRITE:** Lerninhalte, Kompetenz-/Quellenmetadaten und didaktische Tests im Auftrag.
- **Grenze:** bezeichnet Eigenableitungen nicht als IHK-Inhalte; vergibt keine Examensfreigabe und behauptet keine psychometrische Kalibrierung ohne Nachweis.

### A07 – EXAM

- **Verantwortung:** Prüfungsformate, Aufgabenanforderungen, Bewertungsrubriken, Lösungsschlüssel und Feedback.
- **READ:** bestätigter Kompetenzrahmen und Quellenstatus.
- **PROPOSE/VALIDATE:** Eindeutigkeit des Schlüssels, Aufgabenvalidität, Schwierigkeit und Rubrik.
- **WRITE:** Prüfungsübungen und Bewertungslogik mit Ticketfreigabe.
- **Grenze:** ersetzt keine IHK-Prüfung und darf Prüfungsanforderungen nicht erfinden; Änderungen des Kompetenzumfangs mit A06/A08 abstimmen.

### A08 – RESEARCH

- **Verantwortung:** Recherche und Provenienz einschließlich Primärquellen, Aktualität, Vergleichbarkeit und Unsicherheiten.
- **READ:** öffentliche Quellen und Projektreferenzen.
- **PROPOSE/VALIDATE:** Quellenhierarchie, Claims, Markt-/Rechtsvergleich und Referenzgrenzen.
- **WRITE:** Quellenregister, Rechercheberichte und explizite Metadaten im Auftrag.
- **Grenze:** recherchierte Information ist keine Nutzerentscheidung; Foren-/Sekundärquellen überschreiben keine Primärquelle oder Gesetzesfassung.

### A09 – QA

- **Verantwortung:** automatisierte Regression, Inhalts-/Datenvalidatoren, Reproduzierbarkeit, Testabdeckung und belegte Qualitätsbefunde.
- **READ:** Anforderungen und getestete Umsetzung.
- **PROPOSE/VALIDATE:** Testfälle, Abdeckung, Fehlertriage und Release-Gate-Ergebnis.
- **WRITE:** Testcode und QA-Berichte, wenn ausdrücklich beauftragt.
- **Grenze:** ändert kein Produktverhalten zur Reparatur eines fehlgeschlagenen Tests ohne Implementierungsauftrag; ein bestandener Test ist keine Nutzer- oder Rechtsfreigabe.

### A10 – DEVOPS_INFRASTRUCTURE

- **Verantwortung:** Build, CI, Entwicklungsumgebung, Release-/Deploymentabläufe und Git-Sicherheit.
- **READ:** Workflowkonfiguration und nur erforderliche Repo-/PR-Daten.
- **PROPOSE/VALIDATE:** reproduzierbare und gehärtete Pipelines, Artefaktherkunft und sichere Übergabe.
- **WRITE:** Workflow-/Buildkonfiguration bei Ticketfreigabe; lokale Git-Aktionen entsprechend AGENTS.md. GitHub-Connector bleibt read-only.
- **Grenze:** kein Push/Release ohne Auftrag und vorgeschriebene Freigabe; keine Shell-/JSON-Interpolation unvertrauenswürdiger PR-Daten.

### A11 – TECHNICAL_ARCHITECT

- **Verantwortung:** Systemgrenzen, Schnittstellen, Qualitätsmerkmale, Architekturvarianten und ADR-Vorschläge.
- **READ:** bestätigte Anforderungen und Constraints aller Fachrollen.
- **PROPOSE/VALIDATE:** Architekturfolgen, Kopplung, Migrationspfade und Risiken.
- **WRITE:** Architekturvorschläge/ADRs als PROPOSED im Auftrag.
- **Grenze:** Architektur, ADR, Schema und Betriebsziel bleiben PROPOSED bis ausdrückliche Nutzerfreigabe.

## A09/A12-Abgrenzung

A09 prüft reproduzierbare automatisierte Eigenschaften und Release-Gates. A12 prüft das Produkt explorativ und visuell im Browser, richtet isolierte Start-/Fehlerzustände ein und schreibt eine nachvollziehbare Nutzerübergabe. A12 darf keine dauerhaften Nutzerspielstände, Produktregeln oder Releases verändern; Rollenprofil: [A12 Browser-Playtest](a12-browser-playtest.md).
## Verbindliche Fachübergaben und Qualitätsnachweise

### A02/A03 vor A05-Integration

Bei Änderungen, die Simulation und Finanzwirkung verbinden, legen A02 und A03 vor der Frontend-Integration einen gemeinsamen Ereignisvertrag fest. Er benennt mindestens Ereignisphase und Reihenfolge, wirksames Datum/Fälligkeit, Periodenzuordnung, Ledger-/Cashwirkung sowie Fehler- und Wiederholungsfolgen. A01 koordiniert die Übergabe; A05 integriert gegen den bestätigten Vertrag und erfindet keine Fachregel.

### Lerninhalte

Lerninhalte durchlaufen getrennte Gates für technische Struktur, fachliche Semantik, Kompetenz-/Quellenzuordnung und Nichtmutation des Spielstands. A06 verantwortet Didaktik und Kompetenzmapping, A08 die Quellenprovenienz, A07 Aufgaben-/Schlüsselvalidität und A09 das unabhängige QA-Gate. Ein Abschluss als fachlich geprüft setzt ein dokumentiertes A09-Ergebnis voraus.

### Jahres-Smoke und Releaseevidenz

Jeder Release- oder Jahres-Smoke-Bericht bindet sein Ergebnis an Startprofil, Commit oder Tree-Hash, Runner-Version, Start-/Enddatum, Seeds, Ergebnisstatus und Kernmetriken. Nicht verfügbare Werte werden ausdrücklich als nicht verfügbar ausgewiesen; verschiedene Profile oder Runnerläufe werden nicht zu einem Ergebnis zusammengezogen.

### Offlinepakete

A10 dokumentiert beim Offlinepaket Quellrevision und Manifest mit Inhalts-Hashes der enthaltenen Quellen/Artefakte. A12 prüft das konkrete erzeugte Paket in den vorgesehenen Browser-/Geräteszenarien und nennt Paketidentität, Plattform und Ergebnis. Ein Zeitstempel allein gilt nicht als Inhaltsnachweis.
