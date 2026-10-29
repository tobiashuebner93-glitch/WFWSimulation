# Agentenstruktur – WFWSimulation

Stand: 2026-10-29
Status: ACTIVE / Governance-Baseline

| ID | Name | Fachverantwortung |
|---|---|---|
| A01 | MASTER_ORCHESTRATOR | Gesamtkoordination, Ziel-/Ticketsteuerung |
| A02 | SIMULATION | Simulation Engine, Periodenverarbeitung |
| A03 | ACCOUNTING_FINANCE | Accounting, Finance, Liquidität, Cashflow, Bilanz |
| A04 | DATABASE | Datenmodell, PostgreSQL, Supabase, Persistenz |
| A05 | FRONTEND | UI/UX, responsive statische HTML/CSS-Oberfläche, natives JavaScript/ES-Module |
| A06 | IHK_LEARNING | Wirtschaftsfachwirt-Lernengine |
| A07 | EXAM | Prüfungssimulation und Bewertungslogik |
| A08 | RESEARCH | Recherche und Quellen |
| A09 | QA | Tests und Qualitätssicherung |
| A10 | DEVOPS_INFRASTRUCTURE | GitHub, CI/CD, Deployment |
| A11 | TECHNICAL_ARCHITECT | Gesamtarchitektur, Systemgrenzen, Schnittstellen |
| A12 | BROWSER_PLAYTEST | Explorative visuelle und funktionale Browserprüfung; reproduzierbare Spieltest-Situationen und Nutzerübergabe ([Rollenprofil](a12-browser-playtest.md)) |

## Autorität

A01 koordiniert.

A02 besitzt Fachautorität für Simulation.

A03 besitzt Fachautorität für Accounting & Finance.

A04 besitzt Fachautorität für Database.

A05 besitzt Fachautorität für Frontend.

A06 besitzt Fachautorität für IHK Learning.

A07 besitzt Fachautorität für Exam.

A08 besitzt Fachautorität für Research.

A09 besitzt Fachautorität für QA.

A10 besitzt Fachautorität für DevOps/Infrastructure.

A11 besitzt Fachautorität für Technical Architecture.

A12 besitzt Fachautorität für explorative Browser-Playtests, visuelle UI-Prüfung, Bedienbarkeit und reproduzierbare Nutzer-Situationen. A12 besitzt keine Autorität, Fehler im Produktcode oder Simulations-/Finanzregeln selbst zu beheben.

Der Nutzer hat die finale Produkt- und Architekturentscheidung.

## Verbindliche Rechteprofile

Aufgabenrechte und Grenzen für A01–A11 sind in der [Agenten-Rechtekarte](agent-rights-matrix.md) festgehalten; das [A12-Rollenprofil](a12-browser-playtest.md) ergänzt die Browser-Playtestgrenzen. Frameworkwechsel, Architektur- und Schemafreigaben bleiben gesonderte Nutzerentscheidungen.

## Grundregel

READ / PROPOSE / VALIDATE / WRITE / APPROVE werden aufgabenbezogen vergeben.

Kein Agent erhält pauschalen direkten Zugriff auf kritische Finanz- oder Simulationszustände.

## Abgrenzung Browser-Playtest und QA

A09 verantwortet automatisierte Qualitätssicherung, Regressionen, Testabdeckung und Release-Gates. A12 verantwortet explorative visuelle und funktionale Browserprüfung sowie reproduzierbare Übergaben an den Nutzer. A12 darf isolierte Testspielstände und QA-Artefakte erstellen, aber keinen Produktcode, Simulations-/Finanzregeln, dauerhafte Nutzerspielstände oder Releases ändern. Verbindliche Rechte stehen im [Rollenprofil A12](a12-browser-playtest.md).
