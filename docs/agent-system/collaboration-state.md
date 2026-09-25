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
- T-0002

Abgeschlossene Second-Level Goals und Tickets bleiben historisch dokumentiert und sind nicht Teil des aktiven Kontexts.

## Letzte gesicherte Arbeit

A11 TECHNICAL_ARCHITECT hat die Repository-Bestandsaufnahme auf `main` read-only durchgeführt und den tatsächlichen Bestand gegen den Architekturentwurf abgeglichen. A01 hat den Bericht gegen die Governance-Dateien geprüft. T-0003 und SLG-000.3 sind fachlich abgeschlossen.

Letzter Checkpoint: [CP-0002](checkpoints/CP-0002.md).

A11 bestätigt keine Datei-, Commit-, Dependency- oder Supabase-Änderungen. Der lokale Arbeitsbaum von A11 wurde nicht geprüft.

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

Architekturstatus bleibt PROPOSED. D-0001 bis D-0009 bleiben PROPOSED; Nutzerfreigabe und offene Architekturentscheidungen stehen weiterhin aus.

Der frühere GitHub-Connector-403 ist kein aktueller Blocker für die lokale Governance-Arbeit. Ein lokaler Arbeitsbaum von A11 wurde nicht geprüft.
