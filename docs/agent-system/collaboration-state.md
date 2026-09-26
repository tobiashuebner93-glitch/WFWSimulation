# Collaboration State – WFWSimulation

Stand: 2026-09-26

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

A02s Maschinenbau-MVP-Spezifikation und Gap-Analyse sind unter `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md` gesichert; der nachträgliche Nachweis steht in [CP-0007](checkpoints/CP-0007.md). A03 hat T-0005 abgeschlossen; Finanzspezifikation und Abschlussnachweis stehen in `docs/accounting/maschinenbau-mvp-finanzspezifikation.md` und [CP-0008](checkpoints/CP-0008.md). Beide Arbeitsergebnisse und Ticketabschlüsse bleiben unverändert.

Der Nutzer hat verbindliche Produktentscheidungen für den Maschinenbau-MVP gegeben. Sie sind als D-0010 im Decision Log festgehalten. Dieser Eintrag ist eine Produktentscheidung und keine Freigabe der Architektur oder ADRs.

T-0006 wurde nach A04-Nachbesserung im Rereview durch A09 QA BESTANDEN und als COMPLETED dokumentiert. Die drei ursprünglichen MAJOR-Befunde sind geschlossen; siehe [QA-Rereview](../qa/maschinenbau-mvp-datenmodell-rereview-cp-0012.md) und [CP-0013](checkpoints/CP-0013.md).

Das geprüfte T-0006-Modell steht unter `docs/database/maschinenbau-mvp-datenmodell.md`; offene Regeln und Zuständigkeiten sind dort ausgewiesen. Die Implementierung bleibt von späteren fachlichen Entscheidungen und separater Freigabe abhängig.

Letzter Checkpoint: [CP-0013](checkpoints/CP-0013.md).

A09 bestätigte im Rereview, dass alle drei MAJOR-Befunde aus CP-0011 durch die in CP-0012 beschriebenen Modellbeziehungen geschlossen sind. Die ältere Scope-Abweichung in A02/A03 bleibt eine MINOR-Dokumentationsfolgeaktion für A01/A02/A03; D-0010 und das Datenmodell bleiben maßgeblich. Fachregeln wurden nicht entschieden. Details: [ursprünglicher QA-Review](../qa/maschinenbau-mvp-datenmodell-review.md), [Rereview](../qa/maschinenbau-mvp-datenmodell-rereview-cp-0012.md), [CP-0011](checkpoints/CP-0011.md), [CP-0012](checkpoints/CP-0012.md), [CP-0013](checkpoints/CP-0013.md).

## Architektur- und Entscheidungsstatus

SLG-000.2 bleibt ACTIVE / PROPOSED. Architektur V0.2 ist nicht freigegeben; ADR-001 bis ADR-008 bleiben PROPOSED; ADR-004 Mapping bleibt OPEN. D-0001 bis D-0009 bleiben PROPOSED und unverändert. D-0010 dokumentiert verbindliche Nutzerentscheidungen zum Produktumfang des Maschinenbau-MVP; es ist keine Architekturentscheidung. Die im D-0010 nicht festgelegten Regeln zu Zeit, Steuer-/Betragssemantik, Kostenbewertung und Prozessdetails bleiben offen.

## Zuvor gesicherte Arbeit

A11 TECHNICAL_ARCHITECT hat die Repository-Bestandsaufnahme auf `main` read-only durchgeführt. A01 prüfte den Bericht gegen die Governance-Dateien. T-0003 und SLG-000.3 sind abgeschlossen; siehe [CP-0002](checkpoints/CP-0002.md).

T-0002 – Architektur V0.2 als vorgeschlagenen Arbeitsstand sichern – ist abgeschlossen. A11 hat die Architekturdatei und acht ADR-Artefakte erstellt; A09 hat die Artefakte geprüft und QA BESTANDEN gemeldet. Commit/Push auf `main` erfolgte unter Commit `56bea77ae63f273e4c025433ab5c7fbcbb1e8a40`; siehe [CP-0006](checkpoints/CP-0006.md).

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

## Offene Punkte und Blocker

Zeit-/Periodenregeln, Kalkulations- und Gemeinkostenmethode, Betrags-/Steuerdarstellung, genaue Vertrags-/Zahlungsoptionen, Materialbewertung, Korrekturpfade, Abnahme, Auftragsabschluss und weitere Startparameter bleiben fachlich zu spezifizieren. A04 darf diese Punkte im Modell als offen markieren, aber nicht stillschweigend festlegen. D-0010 ist nun als Nutzerentscheidung erfasst; D-0001 bis D-0009 bleiben unverändert.

Der GitHub-Connector ist projektweit READ-ONLY. Remote-Schreibvorgänge dürfen nur über lokalen Git-Workspace und GitHub Desktop erfolgen, sofern sie später erforderlich sind.
