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

Ziel: Die vom Nutzer beim manuellen Spieltest gemeldeten Bedienungs-, Kapazitäts-, Vertrags-, Personal- und Urlaubsfehler beheben und eine erneut testbare Browser-Version sichern. Dieses Ziel umfasste die V1-Playtestkorrekturen; es war keine Abnahme der weitergehenden Realismus- oder WBQ/HQ-Lernziele.

Abschlussnachweis: T-0022 wurde nach Nutzerbestätigung der fehlerfreien manuellen Browserprüfung abgeschlossen; T-0028 ist mit CP-0198 abgeschlossen. Automatisierte Regressionen und Einjahres-Smoke bestanden. Details: CP-0190 und CP-0199.

Second-Level Goal: SLG-001.1 – V1-Fehlerkorrekturen und Browserbedienbarkeit
Status: COMPLETED (2026-10-27; CP-0199)


---

## Aktives V2-Mastergoal MG-002

- Der A10-Sicherheitsrückstand (PR-Diff-Daten sicher behandeln; keine Shell-/JSON-Interpolation) wird in SLG-002.5 überführt.

### MG-002 – Wirtschaftsfachwirt-Lernsimulation und WBQ/HQ-Vorbereitung entwickeln

Status: IN_PROGRESS (2026-10-28; durch Nutzerauftrag aktiviert; A01 koordiniert)

Ziel: Eine nachvollziehbare Unternehmenssimulation entwickeln, die betriebswirtschaftliche Zusammenhänge auf Wirtschaftsfachwirt-Niveau erfahrbar macht und mit belegten Lerninhalten, Lernkarten und Prüfungssimulation auf WBQ und HQ vorbereitet. Der Unternehmensbereich umfasst ausdrücklich auch Marketing/Vertrieb und Logistik (Beschaffung, Materialfluss, Lagerung und Auslieferung). Marketing-, Logistik- und sonstige Simulationsannahmen, allgemeine Fachregeln und rechtliche Anforderungen müssen unterscheidbar bleiben. Lernwissen erscheint an fachlich passenden Stellen als zugängliche Tooltips; pro offiziellem WBQ-Qualifikationsbereich und HSQ-Handlungsbereich entstehen jeweils 50 eigenständige Multiple-Choice-Lernszenarien mit Begründung und beschriebener Unternehmenswirkung.

**Aktive Second-Level Goals und Reihenfolge:**

1. **SLG-002.1 – IHK-Prüfungsrahmen erheben und Kompetenzlandkarte ableiten und gegenprüfen (COMPLETED; CP-0202):** A08 recherchiert den WBQ-/HQ-Prüfungsrahmen aus den im Internet verfügbaren Quellen der zuständigen IHK und dokumentiert URL, Veröffentlichungs-/Versionsstand und Abrufdatum. A06 leitet daraus die Kompetenzlandkarte ab. A07/A08 gleichen sie mit weiteren einschlägigen Internetquellen ab und detaillieren sie, wobei Quelle, bestätigter IHK-Inhalt, agentenseitige Ableitung, Ergänzung und verbleibender Widerspruch jeweils unterscheidbar bleiben. Weitere Quellen ergänzen oder prüfen die Ableitung; sie überschreiben den IHK-Prüfungsrahmen nicht stillschweigend. Keine Kompetenzlandkarte wird als von der IHK herausgegeben bezeichnet.
2. **SLG-002.2 – Erklärbare Unternehmens- und Finanzsimulation validieren (IN_PROGRESS):** A02/A03 definieren überprüfbare Lern-Szenarien für Auftragswirtschaft, Kostenrechnung, Preisbildung, Kapazität, Personal, Finanzierung, Liquidität und Jahresabschluss-Sichten. Läufe müssen reproduzierbar und ihre Finanzwirkungen aus Ereignissen nachvollziehbar sein. Öffentliche Unternehmensberichte dürfen nur mit dokumentierter Vergleichbarkeit als Plausibilitätsreferenz dienen.
3. **SLG-002.3 – WBQ/HQ-Lernkarten und Wiederholungslogik aufbauen (COMPLETED; CP-0208):** T-0032 liefert 450 quellen-/kompetenzbezogene, fachlich durch A09 geprüfte MC-Lernfälle (50 je WBQ-/HSQ-Bereich), mit Begründung, Fallwirkung, getrenntem lokalem Lernfortschritt und Wiederholungsplanung. Spielvereinfachungen sind als solche ausgewiesen und Antworten mutieren den aktiven Simulations-/Accounting-State nicht.
4. **SLG-002.4 – Prüfungsübungen und spielbezogene Lernrückblicke entwickeln (P1/P2):** A07 erstellt nach belegtem Prüfungsrahmen Übungs- und zeitbegrenzte Prüfungsabläufe mit dokumentierter Bewertungsrubrik, Musterlösung und fachlichem Feedback. A02/A03 liefern Ereignis- und Kennzahlenkontext für Debriefs, die Entscheidungen mit Ergebnis, Kosten, Liquidität und passenden Kompetenzen verbinden.
5. **SLG-002.5 – V2-Daten-, Architektur-, Qualitäts- und Auslieferungsbasis freigeben (P2, parallel vorbereiten):** A04/A11 legen nach fachlichem Scope versionierte Simulationsläufe, Regelstände, Lerninhalte und Lernfortschritt als Anforderungen vor. A09/A10 definieren automatisierte Simulations-, Inhalts-, Browser-/Mobil- und CI-Prüfungen einschließlich des PR-Workflow-Sicherheitsrückstands. Architektur, Schema, Persistenzziel (lokal/offline oder Konto/Cloud) und Datenschutz bleiben bis zu gesonderter Nutzerfreigabe PROPOSED.

**Gemeinsame Abnahmerichtung:** Kompetenzziele sind Quellen und Lernaktivitäten zugeordnet; Simulationsergebnisse sind bei gleicher Szenario-/Regelversion reproduzierbar; Finanzberichte lassen sich auf Geschäftsvorfälle zurückführen; Karten und Prüfungsaufgaben besitzen Versions-/Quellenbeleg und fachlichen Review; Nutzerfortschritt sowie Prüfungsfeedback sind nachvollziehbar; Browser- und Mobilpfade bestehen definierte E2E- und Qualitätsprüfungen. Konkrete Quoten, Marktmodelle, Architektur und verbindlicher Prüfungsumfang werden erst in den jeweiligen Scope-Tickets festgelegt.

**Abhängigkeiten:** SLG-002.1 ist Eingangsvoraussetzung für Lernkarten und Prüfungsinhalte. Unternehmens- und Finanzmodellierung kann parallel beginnen, umfasst Marketing/Vertrieb und Logistik und benötigt Lernzielmapping sowie explizite Realismusgrenzen. Lern-UX folgt den fachlichen Lern-/Prüfungsverträgen. Persistenz, Schema und Architekturentscheidungen benötigen einen freigegebenen Betriebs- und Datenschutzbedarf.

**Nicht mit V1 verwechselt:** MG-001 ist abgeschlossen; die V1-Playtestkorrekturen und der einjährige Browserlauf sind kein Nachweis einer rechtlich vollständigen Buchführung, prognosefähigen Unternehmensplanung oder bestätigten WBQ-/HQ-Prüfungsvorbereitung. Details: [V1-/V2-Zielreview CP-0201](checkpoints/CP-0201.md).
