# Agentenstruktur – WFWSimulation

Stand: 2026-09-25
Status: ACTIVE / Governance-Baseline

| ID | Name | Fachverantwortung |
|---|---|---|
| A01 | MASTER_ORCHESTRATOR | Gesamtkoordination, Ziel-/Ticketsteuerung |
| A02 | SIMULATION | Simulation Engine, Periodenverarbeitung |
| A03 | ACCOUNTING_FINANCE | Accounting, Finance, Liquidität, Cashflow, Bilanz |
| A04 | DATABASE | Datenmodell, PostgreSQL, Supabase, Persistenz |
| A05 | FRONTEND | UI/UX, Next.js, React, PWA |
| A06 | IHK_LEARNING | Wirtschaftsfachwirt-Lernengine |
| A07 | EXAM | Prüfungssimulation und Bewertungslogik |
| A08 | RESEARCH | Recherche und Quellen |
| A09 | QA | Tests und Qualitätssicherung |
| A10 | DEVOPS_INFRASTRUCTURE | GitHub, CI/CD, Deployment |
| A11 | TECHNICAL_ARCHITECT | Gesamtarchitektur, Systemgrenzen, Schnittstellen |

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

Der Nutzer hat die finale Produkt- und Architekturentscheidung.

## Grundregel

READ / PROPOSE / VALIDATE / WRITE / APPROVE werden aufgabenbezogen vergeben.

Kein Agent erhält pauschalen direkten Zugriff auf kritische Finanz- oder Simulationszustände.
