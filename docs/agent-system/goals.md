# Goals – WFWSimulation

## Abgeschlossene Master Goals

### MG-000 – Agenten-Governance und technische Grundlage etablieren

Status: COMPLETED

Eine belastbare und nachvollziehbare Control Plane für Agenten, Goals, Tickets, Arbeitsstände, Checkpoints und Architekturentscheidungen wurde etabliert. SLG-000.1, SLG-000.2 und SLG-000.3 sind anhand ihrer dokumentierten Ergebnisse abgeschlossen. Die Architekturprüfung gab weder Architektur V0.2 noch eine ADR frei. Nachweise: [CP-0188](checkpoints/MCP-2026103001.md#cp-0188).

### MG-001 – Browser-V1-Playtestfehler beheben

Status: COMPLETED (2026-10-27; CP-0199)

Die vom Nutzer beim manuellen Spieltest gemeldeten Bedienungs-, Kapazitäts-, Vertrags-, Personal- und Urlaubsfehler wurden behoben und eine erneut testbare Browser-Version gesichert. Die V1-Playtestkorrekturen waren keine Abnahme der weitergehenden Realismus- oder WBQ/HQ-Lernziele. T-0022 wurde nach Nutzerbestätigung der manuellen Prüfung abgeschlossen; T-0028 ist mit CP-0198 abgeschlossen. Nachweise: CP-0190 und CP-0199.

## Goal-Regeln

Nur Tickets des aktuellen Master Goals und Second-Level Goals gehören zum aktiven Arbeitskontext. Abgeschlossene Ziele und Tickets bleiben historisch erhalten. Ein Goal darf erst als COMPLETED markiert werden, wenn seine Ergebnisse dauerhaft dokumentiert und geprüft wurden.

---

# V2–V12-Qualitätsziele (MG-002)

Status: IN_PROGRESS
Master Goal: MG-002
Agentenreviews: A01–A12, 2026-10-29
Autoritativer Zielplan: [V2–V12 Zielkarte](v2-v12-goal-map.md)

## Neu gefasstes Gesamtziel

Ein mobil nutzbares, browserbasiertes Wirtschaftsspiel entwickeln, in dem Lernende ein Unternehmen nachvollziehbar führen und Wirtschaftsfachwirt-Kompetenzen auf WBQ-/HQ-Niveau an realen Spielentscheidungen anwenden. Jedes Fach wird als vollständige spielbare Handlungskette in die Unternehmenssimulation integriert; Lernkarten, Tooltips, Übungsfälle und Prüfungsformate vertiefen dieselben Kompetenzen und verweisen wechselseitig auf konkrete Spielkontexte. Regeln, Ereignisse, Kennzahlen und Wirkungen sind nachvollziehbar; Quellen, Recht, fachliche Ableitungen und Szenariovereinfachungen sind getrennt. Kein Anspruch auf Prüfungssiegel, Rechtsberatung oder vollständige Unternehmenssoftware.

V2 definiert das Qualitäts- und Lernkontextfundament. V3–V6 decken die vier WBQ-Fächer ab, V7–V11 je ein HSQ-Handlungsfeld, V12 integrierte Prüfung und Transfer. Fachkarten allein erfüllen kein Fachziel. Vollständige Kriterien und Agentenbeiträge: [v2-v12-goal-map.md](v2-v12-goal-map.md).

## V2-Qualitätsziel und Abnahmestand
**Status: IN_PROGRESS (CP-0272-Entwurf).** Produktquellen sind mit `3ce96b2` und der korrigierte Paketbuilder mit `7a89210` gesichert. Auf `7a89210` bestehen alle 16 Regressionen sowie der 365-Tage-Jahressmoke. A09 bestätigt G03/G08 auf diesem Quellstand; A10 bestätigt G10 einschließlich zwölf Quellenhashes und des Manifestflags `workingTreeSourcesIncluded=false`. Das Offlinepaket ist bytegenau geprüft, aber sein Artefaktcommit und A09s unmittelbares finales Committee-Recheck stehen noch aus. V2 bleibt bis dahin nicht releasefreigegeben. Details: CP-0272 und T-0062-Berichte.
## Status

- SLG-002.1 – IHK-Rahmen/Kompetenzlandkarte: COMPLETED (CP-0202).
- SLG-002.2 – Erklärbare Unternehmens-/Finanzsimulation: IN_PROGRESS; Jahressolvabilität im aktuellen Jahressmoke bestanden (CP-0253), T-0040 ist abgeschlossen; weitere Fach- und Qualitätsabnahmen bleiben offen.
- SLG-002.3 – Lernkarten/Wiederholung: COMPLETED (CP-0224); die Kartenbibliothek ist noch kein vollständiger Fachprozess.
- SLG-002.4 – Prüfungsübungen und spielbezogene Lernrückblicke: P1/P2.
- SLG-002.5 – Daten-, Architektur-, Qualitäts- und Auslieferungsbasis: P2; Architektur, Schema und Persistenz bleiben PROPOSED.

## Release- und Qualitätskriterien

Kein Fachrelease vor Quellen-/Kompetenzprüfung, vollständigem Spielkreislauf, messbarer und rückverfolgbarer Wirkung, plausiblen Übungsaufgaben, Regressionen sowie explorativem mobilem Browserreview. Kein V2-Release-Claim, bis Jahres-Solvabilität und Browser-/Wiederherstellungsgates bestanden sind. V3–V12 sind Zielplanung, keine Behauptung, dass diese Inhalte bereits umgesetzt wurden.
