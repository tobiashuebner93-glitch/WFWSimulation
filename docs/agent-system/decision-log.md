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
