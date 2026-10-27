# Goals – WFWSimulation

## Aktuelles Master Goal

### MG-000 – Agenten-Governance und technische Grundlage etablieren

Status: COMPLETED
Priorität: HIGH

Ziel:

Eine belastbare und nachvollziehbare Control Plane für Agenten, Goals, Tickets, Arbeitsstände, Checkpoints und Architekturentscheidungen etablieren.

Abschlussnachweis: SLG-000.1, SLG-000.2 und SLG-000.3 sind anhand ihrer dokumentierten Ergebnisse abgeschlossen. Die Architekturprüfung ist abgeschlossen, ohne Architektur V0.2 oder eine ADR freizugeben. Konsolidierung und Belege: [CP-0188](checkpoints/CP-0188.md).

---

## Aktuelles Second-Level Goal

### SLG-000.1 – Agent Control Plane implementieren

Status: COMPLETED
Master Goal: MG-000

Ziel:

Verbindliche Agentenstruktur, Preflight, Goal-/Ticket-Filterung und Arbeitsstands-Dokumentation im Repository verankern.

Abschlussnachweis: T-0001 wurde anhand der Control-Plane-Kriterien geprüft und in [CP-0182](checkpoints/CP-0182.md) abgeschlossen; die dauerhaften Governance-Artefakte sind dokumentiert. Goal-Abgleich: [CP-0188](checkpoints/CP-0188.md).

---

### SLG-000.2 – Technische Architektur V0.2 prüfen

Status: COMPLETED / ARCHITEKTURVORSCHLAG WEITERHIN PROPOSED
Master Goal: MG-000

Grundlage:

A11 hat einen technischen Architekturentwurf V0.2 erstellt.

Der Entwurf ist nicht freigegeben.

Alle ADRs sind PROPOSED.

Abschlussnachweis: T-0002 sichert den Architekturentwurf als Vorschlag (CP-0006); die fachliche Gegenprüfung ist in [CP-0029](checkpoints/CP-0029.md) dokumentiert, und der aktuelle Kopplungsreview steht in [CP-0187](checkpoints/CP-0187.md). Das Prüfziel ist erfüllt; Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED und nicht freigegeben. Nicht blockierende technische Schulden und UI-Verifikationspunkte sind in CP-0187 benannt. Gesamtbewertung: [CP-0188](checkpoints/CP-0188.md).

---

### SLG-000.3 – Repository-Bestand aufnehmen

Status: COMPLETED
Master Goal: MG-000

Abschlussnachweis: Checkpoint [CP-0002](checkpoints/CP-0002.md).

## Goal-Regeln

Nur Tickets des aktuellen Master Goals und aktuellen Second-Level Goals gehören zum aktiven Arbeitskontext.

Tickets abgeschlossener Second-Level Goals bleiben historisch erhalten, werden aber nicht mehr aktiv berücksichtigt.

Ein Goal darf erst als COMPLETED markiert werden, wenn seine Ergebnisse dauerhaft dokumentiert und geprüft wurden.

---

## Aktuelles Master Goal

### MG-001 – Browser-V1-Playtestfehler beheben

Status: COMPLETED (2026-10-27; CP-0199)
Priorität: HIGH

Ziel: Die vom Nutzer beim manuellen Spieltest gemeldeten Bedienungs-, Kapazitäts-, Vertrags-, Personal- und Urlaubsfehler beheben und eine erneut testbare Browser-Version sichern.

Abschlussnachweis: T-0022 wurde nach Nutzerbestätigung der fehlerfreien manuellen Browserprüfung abgeschlossen; T-0028 ist mit CP-0198 abgeschlossen. Automatisierte Regressionen und Einjahres-Smoke bestanden. Details: CP-0190 und CP-0199.

Second-Level Goal: SLG-001.1 – V1-Fehlerkorrekturen und Browserbedienbarkeit
Status: COMPLETED (2026-10-27; CP-0199)


---

## V2-Zielrückstand (nicht aktiv)

- **A10 – PR-Workflow gegen Injection absichern:** PR-Diff-Daten dürfen nicht als Shell-Ausdruck oder unsicher zusammengesetzter JSON-String in Workflow-Befehle interpoliert werden. Umsetzung und Verifikation erfolgen im Rahmen der V2-Infrastrukturarbeit; dieses Ziel ist kein aktives V1-Ticket.
