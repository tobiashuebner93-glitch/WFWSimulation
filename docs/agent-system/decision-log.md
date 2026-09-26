# Decision Log – WFWSimulation

## D-0001 – Agent Control Plane

Status: PROPOSED

Die Agentenstruktur, Goals, Tickets, Worklogs und Checkpoints werden zentral im Repository dokumentiert.

Jeder Agent einschließlich A01 muss den Preflight durchführen.

---

## D-0002 – Checkpoint-Regel

Status: PROPOSED

Nach maximal drei eigenständigen Agentenarbeiten ist ein dauerhafter Checkpoint verpflichtend.

Bei kritischen Ereignissen erfolgt der Checkpoint sofort.

---

## D-0003 – OpenTycoonOS

Status: PROPOSED

OpenTycoonOS wird zunächst nur als Referenz betrachtet.

Keine Kernabhängigkeit.

---

## D-0004 – Accounting

Status: PROPOSED

Accounting ist die fachliche Autorität für Journal, Ledger und finanzielle Auswertungen.

---

## D-0005 – AI State Mutation

Status: PROPOSED

AI darf lesen, analysieren und Commands vorschlagen.

AI darf kritischen autoritativen State nicht direkt verändern.

---

## D-0006 – Simulation / Accounting

Status: PROPOSED

Simulation und Accounting werden als getrennte fachliche Verantwortungsbereiche behandelt.

---

## D-0007 – Industry Modules

Status: PROPOSED

Branchenlogik wird vom allgemeinen Business-Simulationskern getrennt.

---

## D-0008 – Learning / Exam

Status: PROPOSED

Learning und Exam werden als getrennte Domänen geführt.

---

## D-0009 – Determinismus

Status: PROPOSED

Simulationen sollen durch Seed, Commands, Regelversionen und Modulversionen reproduzierbar sein.

---

## D-0010 – Verbindliche Produktentscheidungen Maschinenbau-MVP

Status: APPROVED (Nutzerentscheidung; keine Architekturfreigabe)
Quelle: Nutzerauftrag vom 2026-09-26, nach A11-Konsolidierung
Bezug: MG-000 / SLG-000.2

Für die erste Fassung des operativen Maschinenbau-MVP gilt:

- Auftragsabwicklung erfolgt vollständig. Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind nicht Teil von V1; spätere Erweiterung bleibt vorgesehen.
- Ein Betriebsabrechnungsbogen (BAB) gehört zu V1. Statische Werte und vereinfachte Kostenverteilung sind zulässig. Spätere Versionen können Kosten genauer berechnen und Kosten, Gewinn, Provision sowie weitere unternehmenssteuerungs- und IHK-relevante Größen ergänzen.
- Rechnungen und Buchhaltung stellen Beträge differenziert dar; ein einziger Gesamtbetrag genügt nicht.
- Forderungen und Verbindlichkeiten entstehen gemäß vertraglicher Vereinbarung. Kaufverträge können mehrere Zahlungsoptionen unterstützen. Zahlungsziele, Vorschüsse und Nachzahlungen sind langfristig vorgesehen; V1 darf die für den MVP erforderlichen Vertragsvarianten begrenzen, muss Erweiterbarkeit ermöglichen.
- Das Startunternehmen hat gemieteten Raum, eine Maschine, drei Mitarbeiter und 50.000 Euro Startbudget. Weitere notwendige Startparameter bestimmen A02 und A03 fachlich.
- Das langfristige Ziel umfasst prüfungsrelevante Bereiche für Wirtschaftsfachwirt IHK und später Betriebswirt IHK. IHK-Lernmodule und Prüfungssimulation gehören nicht zum operativen Maschinenbau-MVP, sollen architektonisch später integrierbar bleiben.
- A04 darf das fachliche und technische Datenmodell einschließlich Entitäten, Beziehungen, Status, Feldern, Constraints und Persistenzmodell konkretisieren. Dabei müssen die fachlichen Vorgaben von A02 (Simulation), A03 (Accounting/Finance) und A11 (Architektur/Systemgrenzen) berücksichtigt werden. Offene Produktentscheidungen dürfen nicht stillschweigend verändert werden.

Diese Nutzerentscheidung legt Produktumfang und fachliche Leitplanken fest. Sie genehmigt weder Architektur V0.2 noch ADR-001 bis ADR-008 und entscheidet keine weiterhin offenen Finanz-, Steuer-, Zeit- oder Prozessdetails.
