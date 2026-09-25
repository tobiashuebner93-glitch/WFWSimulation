# Collaboration State – WFWSimulation

Stand: 2026-09-25

## Aktiver Kontext

Master Goal:
MG-000

Second-Level Goals:

- SLG-000.1 ACTIVE
- SLG-000.2 ACTIVE / PROPOSED

Aktive Tickets:

- T-0001

Abgeschlossene Second-Level Goals und Tickets bleiben historisch dokumentiert und sind nicht Teil des aktiven Kontexts.

## Letzte gesicherte Arbeit

T-0002 – Architektur V0.2 als vorgeschlagenen Arbeitsstand sichern – ist abgeschlossen. A11 hat die Architekturdatei und acht ADR-Artefakte erstellt; A09 hat die Artefakte geprüft und QA BESTANDEN gemeldet. CP-0005 dokumentiert die QA und den Stand vor Übernahme. Commit/Push auf `main` wurde unter Commit `56bea77ae63f273e4c025433ab5c7fbcbb1e8a40` erfolgreich abgeschlossen.

Letzter Checkpoint: [CP-0006](checkpoints/CP-0006.md).

SLG-000.2 bleibt ACTIVE / PROPOSED. Die Architektur ist nicht freigegeben; alle ADRs bleiben PROPOSED. ADR-004 Mapping bleibt OPEN. D-0001 und D-0002 sind Governance-Einträge.

## Zuvor gesicherte Arbeit

A11 TECHNICAL_ARCHITECT hat die Repository-Bestandsaufnahme auf `main` read-only durchgeführt. A01 prüfte den Bericht gegen die Governance-Dateien. T-0003 und SLG-000.3 sind abgeschlossen; siehe [CP-0002](checkpoints/CP-0002.md).

## Gesicherte Architekturhypothesen

- modularer zentraler Kern
- Application Layer für Commands
- Accounting als fachliche Autorität
- Simulation als fachliche Autorität für Zeit und Perioden
- AI ohne direkte autoritative State-Mutation
- Learning und Exam getrennt
- versionierte Industry Modules
- append-only Event/Audit-Log plus Snapshots für MVP
- deterministische Replay-Fähigkeit
- OpenTycoonOS zunächst nur Referenz

Diese Punkte bleiben Vorschläge und sind keine Architekturfreigabe.

## Dokumentationsregel

Maximal 3 eigenständige Arbeiten ohne Checkpoint.

Kritische Erkenntnisse, Entscheidungen und Blocker sofort dokumentieren.

## Offene Entscheidungen und Blocker

D-0001 bis D-0009 bleiben PROPOSED; Nutzerfreigabe und offene Architekturfragen stehen weiterhin aus. Das Ticket T-0002 ist abgeschlossen; die verbleibende Arbeit zur weiteren Bearbeitung von SLG-000.2 ist noch zu bestimmen.

Der GitHub-Connector ist projektweit READ-ONLY. Lokale Governance-Arbeit wurde über den lokalen Git-Workspace durchgeführt; Remote-Übernahmen erfolgen über den vorgesehenen GitHub-Desktop-Prozess.
