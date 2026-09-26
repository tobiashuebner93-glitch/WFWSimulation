# Ticket Board – WFWSimulation

## Aktive Tickets

### T-0001 – Agent Control Plane implementieren

Status: IN_PROGRESS
Master Goal: MG-000
Second-Level Goal: SLG-000.1
Owner: A10 DEVOPS_INFRASTRUCTURE
Priorität: HIGH

Aufgabe:

AGENTS.md und die strukturierte Agenten-Control-Plane mit Agentenstruktur, Goals, Tickets, Collaboration State, Decision Log, Preflight und Checkpoint-Regeln etablieren.

Akzeptanzkriterien:

- Preflight verbindlich dokumentiert
- A01–A11 definiert
- aktuelle Goals definiert
- Ticketfilter definiert
- abgeschlossene Second-Level Goals aus aktivem Kontext ausgeschlossen
- Checkpoint-Regel dokumentiert
- Kommunikationsformat dokumentiert
- keine Anwendungscodeänderung
- keine Supabaseänderung
- keine Dependencyänderung

---

## Abgeschlossene Tickets

### T-0006 – Maschinenbau-MVP: fachliches und technisches Datenmodell konkretisieren

Status: COMPLETED – A09 QA BESTANDEN (CP-0013)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A04 DATABASE
Priorität: HIGH

Aufgabe und Mindestumfang gemäß D-0010, A02-Simulationsspezifikation und A03-Finanzspezifikation: fachliches/logisches Datenmodell mit vollständiger operativer V1-Abwicklung, differenzierten Finanzbeträgen, statischem/vereinfachtem BAB, festgelegtem Startprofil, offenen Fachentscheidungen und Erweiterungspfaden.

Abschlussnachweis: [Datenmodell](../database/maschinenbau-mvp-datenmodell.md), [CP-0010](checkpoints/CP-0010.md), QA-Erstreview [CP-0011](checkpoints/CP-0011.md), A04-Nachbesserung [CP-0012](checkpoints/CP-0012.md), bestandenes QA-Rereview [CP-0013](checkpoints/CP-0013.md) und finale P0-Gesamtsicherung [CP-0031](checkpoints/CP-0031.md). Die dokumentarische MINOR-Abweichung wurde durch T-0007 bereinigt. Offene Fachparameter bleiben ausdrücklich offen; QA und P0-Validierung sind keine Implementierungs- oder Architekturfreigabe.

---

### T-0005 – Maschinenbau-MVP: Accounting-Wirkungen spezifizieren

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A03 ACCOUNTING_FINANCE
Priorität: HIGH

Aufgabe:

Auf Grundlage der A02-Spezifikation die finanziellen Wirkungen und minimalen Accounting-Übergaben für den Maschinenbau-MVP fachlich spezifizieren. T-0005 ist Analyse-/Spezifikationsarbeit, keine Implementierung.

Akzeptanzkriterien:

- finanzielle Wirkungen für Angebot/Auftrag, Beschaffung/Eingang, Ressourcenverbrauch, Lieferung, Rechnungen, Zahlungen, laufende Kosten und Auftragsergebnis beschrieben
- Zeitpunkt/Bedingungen von Forderungen, Verbindlichkeiten, Umsatz, Kosten und Liquiditätswirkung benannt oder als offen markiert
- MVP-relevante Netto-/Brutto-/Umsatzsteuer-, Materialbewertungs- und Fälligkeitsfragen ausgewiesen, ohne unbelegte Rechts-/Steuerannahmen
- minimale Übergaben von Simulation an Accounting und autoritative Finanzsichten beschrieben
- offene Nutzerentscheidungen und Abhängigkeiten zu A02/A11 kenntlich gemacht
- keine Buchungen, Anwendungscode-, Schema-, Supabase- oder Dependencyänderung
- keine Architekturfreigabe und keine Änderung an D-IDs/ADR-Status

Abschlussnachweis: fachliche Spezifikation [maschinenbau-mvp-finanzspezifikation.md](../accounting/maschinenbau-mvp-finanzspezifikation.md) und Checkpoint [CP-0008](checkpoints/CP-0008.md). Offene Nutzerentscheidungen blockieren die Spezifikation nicht, aber verbindliche Detailregeln und Datenmodellableitung.

---

### T-0002 – Architektur V0.2 als Arbeitsgrundlage sichern

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

A11-Architekturentwurf dauerhaft als vorgeschlagenen Arbeitsstand sichern.

Akzeptanzkriterien:

- Kernarchitektur dokumentiert
- 8 ADR-Entwürfe dokumentiert
- offene Architekturentscheidungen erhalten
- nichts als freigegeben dargestellt
- OpenTycoonOS bleibt zunächst Referenz

Abschlussgrund: Neun Architekturartefakte erstellt, A09-QA bestanden und Commit/Push auf `main` erfolgreich. Abschlussnachweis: Checkpoint [CP-0006](checkpoints/CP-0006.md).

---

### T-0003 – Repository-Bestand read-only aufnehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.3
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

Tatsächlichen Repository-Zustand gegen den Architekturentwurf prüfen.

Abschlussnachweis: [Checkpoint CP-0002](checkpoints/CP-0002.md).

---

### T-0004 – Maschinenbau-MVP: A02-Spezifikation und Gap-Analyse aufnehmen

Status: COMPLETED (nachträglich dokumentiert)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION

Aufgabe:

Die read-only fachliche Spezifikation und Gap-Analyse des Maschinenbau-MVP erstellen. Während der A02-Arbeit war dafür kein aktives Ticket eingetragen; dieses Ticket dokumentiert die bereits abgeschlossene Arbeit rückblickend und weist sie dem aktiven SLG-000.2 zu.

Abschlussgrund: A02-Arbeitsergebnis durch A01 geprüft und unverändert im Repository gesichert. Keine Code-, Datenbank-, Dependency- oder Architekturänderung. Abschlussnachweis: [Checkpoint CP-0007](checkpoints/CP-0007.md) und [A02-Bericht](../simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md).

---

### T-0007 – D-0010-Scope in A02-/A03-Spezifikationen angleichen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION / A03 ACCOUNTING_FINANCE

Aufgabe:

Die dokumentarische MINOR-Abweichung aus CP-0013 in den Fachspezifikationen von A02 und A03 bereinigen. D-0010 bleibt maßgeblich und unverändert; Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind aus V1 ausgeschlossen. Keine Erweiterung des MVP und keine neuen Fachregeln.

Abschlussgrund: A02 und A03 haben ihre jeweiligen Scope-Texte an D-0010 angeglichen. Konkrete Zahlungs-/Finanzregeln bleiben offen. Nachweis: [CP-0014](checkpoints/CP-0014.md).
