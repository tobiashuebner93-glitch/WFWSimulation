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

A02 und A03 haben die ältere MINOR-Scope-Abweichung in ihren Spezifikationen gemäß D-0010 bereinigt. V1-Teilverarbeitung ist ausdrücklich ausgeschlossen; spätere Erweiterbarkeit bleibt als Zukunftshinweis. T-0007 ist abgeschlossen; D-0010 wurde nicht geändert.

A03 hat auf Grundlage von CP-0014 die Entscheidungsgrundlage [P0-Finanzoptionen B–E](../accounting/p0-finanzentscheidungen-v1-optionen.md) erstellt; Nachweis: [CP-0015](checkpoints/CP-0015.md). Die A03-Empfehlungen sind Vorschläge, keine Nutzerentscheidung. D-0010 bleibt unverändert; Architektur V0.2 und ADRs bleiben PROPOSED.

A01 hat die zentrale [P0-Nutzerentscheidungsvorlage](p0-entscheidungs-vorlage-maschinenbau-mvp.md) für A, B, C, D, E, F, G und I erstellt. Empfehlungen sind nicht beschlossen; H bleibt gemäß CP-0014 P1. D-0010 und Architekturstatus bleiben unverändert. Nachweis: [CP-0016](checkpoints/CP-0016.md).

A04 hat die angefragten P0-Regeln read-only gegen das abgeschlossene T-0006-Datenmodell geprüft. Mehrere Grundobjekte sind vorhanden, aber Kalender-/Automationsabläufe, Vollstreckungsfälle, konkrete Steuer-/Rundungsregeln, gleitender Durchschnitt, getrenntes Budget/Liquidität und operative Kapazitätsdaten sind nur teilweise oder nicht abgebildet. T-0006 bleibt abgeschlossen; das Ergebnis ist eine separate Modellabdeckungsprüfung, keine Freigabe zur Schemaänderung. Bericht und Nachweis: [P0-Abdeckungsprüfung](../database/p0-produktstand-datenmodell-abdeckung.md), [CP-0017](checkpoints/CP-0017.md). Die zentrale P0-Vorlage nennt ihre Optionen weiterhin als unentschieden; Nutzerauftrag wurde als Prüfziel, nicht als Änderung von D-0010 oder Entscheidungslog behandelt.

Letzter Checkpoint: [CP-0017](checkpoints/CP-0017.md).

A02 hat den vorgegebenen P0-Produktstand aus Simulationssicht auf Prozesskonsistenz und deterministische Ausführbarkeit geprüft. Befunde und Ergänzungsvorschläge stehen in [P0-Festlegungen – Simulationsprüfung](../simulation/p0-festlegungen-simulationspruefung.md); Nachweis: [CP-0018](checkpoints/CP-0018.md). A02-/A03-Spezifikationen, D-0010, Datenmodell und Architekturstatus wurden nicht geändert. Operative Folgeklärungen bleiben offen; keine Architektur- oder Implementierungsfreigabe.

A03 hat die Finanzkonsistenz des vorgegebenen P0-Produktstands geprüft und in [P0-Finanzkonsistenzprüfung](../accounting/p0-finanzkonsistenzpruefung.md) dokumentiert; die Finanzspezifikation verweist auf die Konkretisierung. Nachweis: [CP-0019](checkpoints/CP-0019.md). Offene Start-/Rundungs-/Retry-/Eskalationsparameter bleiben Folgearbeit; D-0010 und Architekturstatus bleiben unverändert.

Der Nutzer hat die Eröffnungsbilanz zum 01.01.2027 einschließlich CNC-Buchwert, Maschinendarlehen und Eigenkapital als Restposition festgelegt. A03 hat Bilanzabgleich und Darlehensoptionen in der Finanzspezifikation dokumentiert; Nachweis: [CP-0020](checkpoints/CP-0020.md). Tilgungsart und weitere Darlehensparameter bleiben offen.

Letzter Checkpoint: [CP-0020](checkpoints/CP-0020.md).

A02 hat die vom Nutzer bestätigten Tagesphasen-, F3-, Zahlungs- und G3-Regeln in die Simulationsspezifikation übernommen und ein deterministisches Startauftragsprofil mit drei vollständigen Aufträgen sowie Ressourcenstunden ergänzt. Bericht: [A02-P0-Konkretisierung](../simulation/a02-p0-konkretisierung-aenderungsbericht.md); Nachweis: [CP-0021](checkpoints/CP-0021.md). Offene Kalender-/Finanzparameter bleiben markiert. D-0010, A03-Spezifikation, Datenmodell und Architekturstatus bleiben unverändert; keine Implementierungsfreigabe.

Letzter Checkpoint: [CP-0021](checkpoints/CP-0021.md).

A09 bestätigte im Rereview, dass alle drei MAJOR-Befunde aus CP-0011 durch die in CP-0012 beschriebenen Modellbeziehungen geschlossen sind. Die MINOR-Dokumentationsabweichung wurde mit T-0007 in den A02-/A03-Spezifikationen bereinigt; D-0010 und das Datenmodell bleiben maßgeblich. Fachregeln wurden nicht entschieden. Details: [ursprünglicher QA-Review](../qa/maschinenbau-mvp-datenmodell-review.md), [Rereview](../qa/maschinenbau-mvp-datenmodell-rereview-cp-0012.md), [CP-0011](checkpoints/CP-0011.md), [CP-0012](checkpoints/CP-0012.md), [CP-0013](checkpoints/CP-0013.md), [CP-0014](checkpoints/CP-0014.md).

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

Vor einer vollständigen MVP-Implementierung sind die im CP-0014 priorisierten Zeit-, Betrags-, Zahlungs-, Kosten-, Material-, Abnahme-, Abschluss-, Korrektur- und Startprofilregeln zu klären oder als explizite V1-Regeln durch zuständige Fachrollen und Nutzer festzulegen. D-0010 ist maßgeblich; D-0001 bis D-0009 bleiben unverändert. Die Implementierung ist nicht freigegeben.

Der GitHub-Connector ist projektweit READ-ONLY. Remote-Schreibvorgänge dürfen nur über lokalen Git-Workspace und GitHub Desktop erfolgen, sofern sie später erforderlich sind.

## P0-Validierung Maschinenbau-MVP

A09 hat A02-Simulation, A03-Finanzspezifikation und A04-Datenmodell unabhängig gegen den aktuellen P0-Stand geprüft. Der Review weist Widersprüche im A04-Eröffnungstext und zur automatischen Vollzahlung sowie Modelllücken für SimTAX-Herkunft, Kapazitätsgrenzen und Tagesphasen aus. Offene Finanz-/Kalender-/Mahnparameter bleiben offen; es wurden keine Produktentscheidungen oder Architekturfreigaben getroffen. QA-Ergebnis: nicht bestanden für vollständige Datenmodellfreigabe. Bericht: [P0-Validierungstest](../qa/p0-mvp-unabhaengiger-validierungstest.md); Checkpoint: [CP-0022](checkpoints/CP-0022.md).

CP-0020 wird weiterhin referenziert, fehlt jedoch im aktuellen Checkout; A03s aktualisierte Spezifikation und P0-Prüfung enthalten den Bilanzabgleich. A01 sollte den fehlenden Checkpoint-Nachweis abgleichen.

Letzter Checkpoint: [CP-0022](checkpoints/CP-0022.md).

A04 hat den durch CP-0022 beauftragten, eng begrenzten Abgleich der Datenbankspezifikation abgeschlossen. Das veraltete Eröffnungsmodell und die widersprüchliche Zahlungsbeschreibung sind korrigiert; SimTAX, getrennte Mitarbeiter-/Maschinenkapazitäten, Tagesphasen, same-day-Fortschreibung und bestätigter V1-Mahnfluss sind dokumentiert. Offene Fristen, Schwellen, Prioritäten, Kalenderdetails und Steuerparameter bleiben ausdrücklich OFFEN. In den bearbeiteten Bereichen bestehen keine verbleibenden Widersprüche zu A02/A03. CP-0020 fehlt weiterhin im aktuellen Checkout und wurde nicht rekonstruiert. Bericht: [A04-Änderungsbericht](../database/a04-cp-0022-aenderungsbericht.md); Nachweis: [CP-0023](checkpoints/CP-0023.md). Keine Implementierung, Schemaänderung oder Freigabe; D-0010, Ticketboard, A02 und A03 unverändert.

Letzter Checkpoint: [CP-0023](checkpoints/CP-0023.md).

A03 hat den durch A09-Re-Review HIGH-2 FAIL festgestellten Widerspruch in der Finanzspezifikation behoben: Die Aussagen gegen Mahn-/Inkassologik sowie die offene Darstellung automatischer Zahlung am Fälligkeitstag wurden an die bestätigte automatische Vollzahlungsregel und den bestätigten V1-Mahn-/Dunning-Fluss angepasst. Priorität konkurrierender Zahlungen, Retry-Zeitpunkt/-Fristen und konkrete Mahnfristen/-schwellen bleiben OFFEN. Keine Implementierung, Datenbankänderung, Migration oder Architekturänderung; D-0010 blieb unverändert. Änderungsbericht: [A03-Änderungsbericht CP-0024](../accounting/a03-cp-0024-zahlungsfluss-aenderungsbericht.md); Nachweis: [CP-0024](checkpoints/CP-0024.md).

Letzter Checkpoint: [CP-0024](checkpoints/CP-0024.md).

A02 hat in der Simulationsspezifikation Kundenzahlungseingänge von eigenen Lieferanten-/Gläubigerzahlungen getrennt. Kundeneingänge folgen Kundenverhalten ohne Prüfung eigener Liquidität; eigene Ausgänge versuchen am Fälligkeitstag vollständige Zahlung mit Liquiditätsprüfung, dokumentieren Fehlschlag und übergeben den vollen offenen Posten in den bestätigten V1-Mahnfluss. Retry-, Prioritäts- und Mahnparameter bleiben offen. Bericht: [A02-Zahlungsrichtungen](../simulation/a02-zahlungsrichtungen-aenderungsbericht.md); Nachweis: [CP-0025](checkpoints/CP-0025.md). D-0010, A03, Datenmodell, Architektur/ADRs und Tickets unverändert.

Letzter Checkpoint: [CP-0025](checkpoints/CP-0025.md).

A03 hat die Finanzspezifikation mit CP-0025 synchronisiert und Kundenzahlungseingänge von eigenen Lieferanten-/Gläubigerzahlungen getrennt. Kundeneingänge folgen Kundenverhalten ohne Prüfung eigener Liquidität; eigene fällige Verbindlichkeiten lösen einen Vollzahlungsversuch mit Liquiditätsprüfung und bestätigtem Dunning-Übergang bei Fehlschlag aus. Retry, Zahlungspriorität, konkrete Mahnfristen/-schwellen und darlehensspezifischer Zahlungsplan bleiben offen. Beim Abgleich besteht kein verbleibender Widerspruch zu CP-0025/A02. Keine Implementierung, Datenbankänderung, Migration, Architekturentscheidung oder Änderung von D-0010; Architektur V0.2 und ADRs bleiben PROPOSED. Bericht: [A03-Zahlungsrichtungen](../accounting/a03-cp-0026-zahlungsrichtungen-aenderungsbericht.md); Nachweis: [CP-0026](checkpoints/CP-0026.md).

Letzter Checkpoint: [CP-0026](checkpoints/CP-0026.md).

A04 prüfte die Datenbankspezifikation gegen CP-0025/A02 und CP-0026/A03. Dabei wurde eine Modelllücke gefunden: generischer Zahlungsversuch und Mahnfall ließen sowohl Forderungen als auch Verbindlichkeiten zu, wodurch das Cash-Gate potentiell auf Kundeneingänge angewendet werden konnte. A04 hat die Dokumentation richtungsgetrennt: Kundeneingang ohne eigenes Cash-Gate, `payable_payment_attempt` und Dunning ausschließlich für eigene Verbindlichkeiten; Zahlungszuordnung folgt der Richtung. Kundenverhalten, Retry, Zahlungspriorität, Mahnfristen/-schwellen und Darlehenszahlungsplan bleiben offen. Keine verbleibenden Widersprüche zu CP-0025/CP-0026. Änderungsbericht: [A04-Zahlungsrichtungsabgleich](../database/a04-cp-0025-0026-zahlungsrichtungen-aenderungsbericht.md); Nachweis: [CP-0027](checkpoints/CP-0027.md). Keine Implementierung, Migration, physische Datenbankänderung, Architekturentscheidung oder Produktentscheidung.

Letzter Checkpoint: [CP-0027](checkpoints/CP-0027.md).

A09 hat den finalen gezielten Re-Review des ursprünglichen HIGH-2-Befunds bestanden: Kundeneingänge laufen ohne Cash-Gate nach Kundenverhalten; automatische Vollzahlungsversuche, eigene Liquiditätsprüfung und Dunning sind ausschließlich für Payables modelliert. Versuch, tatsächliche Zahlung und offene Posten bleiben getrennt. Kundenverhalten, Retry, Priorität und konkrete Mahnfristen/-schwellen bleiben offen. Bericht: [Finaler Re-Review HIGH-2](../qa/high-2-zahlungsrichtungen-rereview.md); Nachweis: [CP-0028](checkpoints/CP-0028.md).

Letzter Checkpoint: [CP-0028](checkpoints/CP-0028.md).

## P0-Architektur-Gegenprüfung

A11 hat den validierten P0-Fachstand aus A02, A03 und A04 gegen Architektur V0.2/ADRs geprüft. Ergebnis: ohne grundlegenden Architekturbruch überführbar; keine CRITICAL-/HIGH-Befunde. Zahlungsrichtungen, Zahlungsversuch/Zahlung, A02/A03-Autorität und A04-Persistenzmodell sind in den geprüften Artefakten klar getrennt. Zeit-, SimTAX-, BAB-, Startbilanz-, Darlehens- und Kapazitätsregeln passen in die vorgeschlagenen Grenzen; offene Parameter erzwingen derzeit keine Architekturentscheidung. Dokumentarische MEDIUM-Punkte: V0.2 §8 sollte den Monatslauf gegenüber täglicher Auflösung im Wochenraster präzisieren; A04 §3.2 sollte seine pauschal offenen Abschluss-/Abnahmeregeln an F3/G3 und §3.3 angleichen. CP-0020 fehlt im Checkout und wurde nicht rekonstruiert. Bericht: [P0-Architektur-Gegenprüfung](../architecture/p0-architecture-review-cp-0029.md); Checkpoint: [CP-0029](checkpoints/CP-0029.md). Keine ADR-/D-ID-Freigabe, Implementierung oder Änderung der Fachspezifikationen.

Letzter Checkpoint: [CP-0029](checkpoints/CP-0029.md).

## CP-0029-MEDIUM-Dokumentationskorrekturen

A11 hat die beiden in CP-0029 festgestellten MEDIUM-Punkte ausschließlich dokumentarisch behoben. Architektur V0.2 §8 trennt Wochenraster, tageweise Auflösung, Ereignis-Kalendertage und Monats-/Periodenabschluss; die bestätigte Tagesreihenfolge und Same-Day-Fortschreibung bleiben unverändert. A04 §3.2 nennt nun F3 (fünf Arbeitstage nach vollständiger Lieferung, Liefertag zählt nicht; Ablehnung führt in `ABLEHNUNG_IN_KLÄRUNG` und verhindert automatische Abnahme), automatische Rechnung nach bestätigter Abnahme sowie G3 (Abschluss erst nach vollständigem Kundenzahlungseingang; Lieferantenverbindlichkeiten blockieren nicht). CP-0020 fehlt weiterhin im Checkout; es wurde nicht rekonstruiert. D-0010 blieb unverändert, ADR-001 bis ADR-008 bleiben PROPOSED. Änderungsbericht: [A11-Änderungsbericht CP-0029](../architecture/a11-cp-0029-medium-korrekturen-aenderungsbericht.md); Checkpoint: [CP-0030](checkpoints/CP-0030.md). Keine Implementierung oder Datenbankänderung.

Letzter Checkpoint: [CP-0030](checkpoints/CP-0030.md).

## Gesamtstand des validierten P0-Fachstands

Der konsolidierte und referenzierbare Stand aus CP-0021 bis CP-0030 ist in [CP-0031](checkpoints/CP-0031.md) zusammengeführt. Er umfasst Simulationsstart 01.01.2027, Wochenraster mit tageweiser Auflösung, F3/G3, SimTAX 19 % mit Positionsrundung, gleitenden Durchschnitt, ausgeglichene Eröffnungsbilanz 95.300 €, getrennten 50.000-€-Rahmen, getrennte Zahlungsrichtungen und V1-Mahnfluss. A04 hat Zahlungsrichtungen, Verbindlichkeit, Zahlungsversuch und tatsächliche Zahlung getrennt; A11s MEDIUM-Korrekturen sind laut CP-0030 abgeschlossen. P0 ist fachlich/strukturell validiert; dies erteilt keine Implementierungs- oder Architekturfreigabe. ADR-001 bis ADR-008 bleiben PROPOSED. Offene Parameter sind in CP-0031 aufgelistet.

**Provenienz:** CP-0020 fehlt weiterhin im Checkout. Er wurde nicht rekonstruiert und nicht durch Annahmen ersetzt. Der aktuelle P0-Inhalt ist über die vorhandenen CP-0021 bis CP-0030 und die verlinkten aktuellen Spezifikationen nachvollziehbar; die historische Nachweislücke von CP-0020 bleibt bestehen.

Letzter Checkpoint: [CP-0031](checkpoints/CP-0031.md).
