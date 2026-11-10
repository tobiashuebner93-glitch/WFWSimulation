# A01-Arbeitsplan – Ausarbeitung und Integration der V3-Haupttickets

**Status:** Arbeitsstand / Phase 1 – Ticket-Ausarbeitung  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.3 / SLG-002.4 / SLG-002.5  
**Tickets:** T-0063 bis T-0069  
**Basis:** D-0159, D-0161–D-0164; CP-0277–CP-0279 (Entwürfe); HEAD = `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, `main` = `origin/main` zu Beginn.

## Verbindliche Produktentscheidungen und Grenzen

- V2 bleibt abgenommen und unverändert; Tagesblockierende Lernereignisse bleiben außerhalb V3 (D-0159).
- Rechtsstand gilt zum Prüf-/Releasezeitpunkt, unabhängig vom Simulationsjahr (D-0161).
- V3-Rechenvertrag folgt D-0162; keiner der V3-Kalkulationswerte erzeugt allein eine Buchung.
- Der inflationsorientierte MRO-Zukunftspfad gilt für V3, wenn reale EZB-Daten fehlen; keine automatische Änderung bestehender Verträge (D-0163).
- GmbH & Co. KG ist in V3 spielbar. AG, eG und GmbH & Co. KGaA bleiben Kandidaten mit ausdrücklicher Auswahlentscheidung vor V3-Release (D-0163/D-0164).
- V3 umfasst mindestens gemeinsamen Einkauf/Arbeitsgemeinschaft als Kooperation sowie Anteilserwerb/Unternehmenskauf als Konzentration; gesetzliche Verschmelzungen sind Folgearbeit.
- Keine Schema-/Architekturfreigabe, keine Erweiterung außerhalb dokumentierter Nutzerentscheidungen. Alle Fachberichte und Rückfragen an A01.

## Phase 1 – Ticket-Ausarbeitung

| Ticket | Auszuarbeitendes Ergebnis | Federführung / Mitwirkung | Abschluss der Phase 1 |
|---|---|---|---|
| T-0063 Makro, Konjunktur, Außenwirtschaft, Wirtschaftspolitik | Quellen-/Variablenkatalog; Einheit/Frequenz/Stand; Phasenmaschine; Warenkorb/Rundung; acht Politikfelder; FX/Export/Lieferstörung; MRO; reproduzierbare Fixtures. Jeder Kanal benötigt einen tatsächlich spielbaren Firmenpfad, nicht nur eine angezeigte Projektion. | A08 Quellen, A02 Simulation, A03 Finanz, A06 Lernkontext; A09 unabhängige QA | Pro Kanal: Quelle/Vintage oder synthetische Parameter-ID, Exposure, Zielvariable/Spielhandlung, Einheit, Periode/Lag, Null-/Wirkungsfall, Replay/Restore, Dedupe und A03/A09-Grenze; Wirkung verändert eine echte Firmenvariable oder Option. Keine Buchung ohne Beleg/Freigabe. |
| T-0064 Gründung/Rechtsformen/Zusammenschlüsse | Gründungszustände und Voraussetzungen; quellengeprüfte Formen/Kombinationen; GmbH & Co. KG als bestätigter V3-Fall; Kandidatenstatus AG/eG/GmbH & Co. KGaA; Kooperations-/Konzentrationsfälle; Statuswechsel mit Rechtsträger-, Vertrags-, Vermögens- und Haftungsgrenzen. | A08 Rechtsmatrix, A02 Status-/Prozessmodell, A05 Oberfläche; A09 unabhängiges Quellenreview | Aktuelle Primärquellen je behaupteter Rechtsfolge; bestätigte Fälle von noch nicht entschiedenen Kandidaten getrennt; konkrete Vor-Release-Entscheidung sichtbar. |
| T-0065 Markt/Nachfrage/Wettbewerb/Angebote | Segmente, zufällige aber reproduzierbare Anfragen, Konkurrenzprofile, Angebotsfristen, Kundenentscheidungsverzug, Gewinnerlogik, Berichtsanonymisierung und Interaktionen mit Makroparametern und D-0162. Parameterliste samt Testwerten; keine nach Annahme änderbaren Preise. | A02, A03, A05; A08 bei Quellenbedarf | Seed-/Paarvergleichsplan mit Ursache-Wirkung, Angebotsstatus und unveränderlichem Vertragspreis; wirtschaftliche und Liquiditätswirkung klar getrennt. |
| T-0067 Kalkulation/BAB/Kennzahlen | A03-Vertrag D-0162 in Simulation und Anzeige überführen: Nettoplanpreis, DB I, direkte Einzelkosten, BAB-Restcent, Angebotssnapshot, Plan/Ist und Monats-/Stichtagsperioden. | A03, A02, A04 logisch, A05 UI, A09 Rechenreview | Grenz- und Reconciliationvektoren für positiv/centnah/negativ, Restcent-Tie-break, Snapshot-Freeze und Kalendermonat sind vollständig. A04 darf nur logisches Modell vorschlagen. |
| T-0066 Produktivität/Kapazität/eigene Produkte | Produktzustände, Material/Personal/Maschine/Lager-Konkurrenz, Entwicklungs- und Produktionsblöcke, Kalkulationsübergabe, Vermarktung/Absatz, Kosten-/Bestandszeitpunkte und Engpassanzeigen. | A02, A03, A05; A09 | Mindestens zwei Produkte kontrolliert parallel, erfolgreich und unwirtschaftlich; kein Doppelverbrauch und Finanzwirkung nur über vereinbarte Ereignisse. |
| T-0068 Lernen/Fragen/Ereignisse | Kompetenz zu konkreten V3-Spielzuständen, Inhaltsumfang und Lieferplan für Fragen/Ereignisse; Quellen, Schlüssel, Erklärungen, Unternehmenswirkungen und Nichtmutation; D-0159 respektieren. | A06, A07, A08, A05, A09 | 100 % der abgegrenzten V3-Kompetenzen verknüpft; reguläre Grund-/Aufbau-/Transferfragen und MC-Ereignisse nach Goal Map vollständig prüfbar; Tagesblockade bleibt out of scope. |
| T-0069 V3-Integration/Jahresgate/QA | Versionsgebundene End-to-End-Szenarien, Seeds, Profil-, Finanz-/Ledgerabgleich, Fehlerklassifikation, Mobile-Browserpfade und Release-Evidenz. | A09 unabhängig, A02/A03 Fachbelege, A12 Browser | Nur Ergebnisse aus stabilisierten T-0063–0068-Verträgen; reproduzierbare positive und wirtschaftlich scheiternde Verläufe; keine nicht abgestimmten Buchungen oder stillen Ausnahmen. |

## Ticketabhängigkeiten und Ausführungsreihenfolge

1. **Parallel ausarbeiten:** T-0063 (A08/A02/A03), T-0064 (A08/A02) und T-0067 (A03, bereits durch D-0162 entschieden). T-0065 darf seine Parameterliste vorbereiten, aber die Makro-/Kostenwerte erst nach T-0063/T-0067 fixieren.
2. **Erste Integration:** A02/A03 stellen einen gemeinsamen Ereignis-/Finanzvertrag für Makro-, Markt- und Produktwirkungen her; A01 protokolliert und markiert Parameterstatus. T-0064 erhält den Rechtsträger-/Statusfluss.
3. **Produkt- und UI-Integration:** T-0065/T-0067 vor T-0066; A05 integriert erst gegen abgestimmte Fachfelder. T-0068 bindet stabile Spielkontexte ein.
4. **Jahresgate:** T-0069 startet nach den fachlichen Vertragsergebnissen von T-0063 bis T-0068; A09 prüft unabhängig, A12 dokumentiert Browserzustände.

## T-0063 – operative Mindestgates nach CP-0447-Review

A08s Quellen-/Kanalmatrix ist von A03 mit den untenstehenden Finanz- und Rechtsgrenzen als integrierbar bewertet. A09 bestätigt Regressionen der Projektionen, bewertet die tatsächliche Unternehmenswirkung aber überwiegend PARTIAL/NONPASS. Für das T-0063-Minimalziel zählen daher zwei getrennte Nachweise. **T-0063 besteht erst, wenn beide Gates für jeden einzelnen unten aufgeführten Kanal PASS sind.** Jede ausstehende A03-Freigabe (einschließlich MRO-Berechnungsmethode) oder nicht erfüllte operative Wirkung bedeutet für den betroffenen Kanal NONPASS; es gibt keine Ausnahme durch bloße Projektion oder Dokumentation:

1. **Projektionsgate:** Quelle oder klar markierter synthetischer Parameter, Einheit, Beobachtungs-/Veröffentlichungsstand, Exposure, `effectiveFrom`, Periode/Lag, Modellversion, Null-/Wirkungsfall, vor/nach-Wert und Save/Restore sind testbar.
2. **Unternehmensgate:** Eine echte V3-Spielvariable oder Spielerhandlung ändert sich reproduzierbar. Eine Indikatoranzeige, ein Opportunity-Index oder eine unverknüpfte Fixture allein ist nur PARTIAL.

| Kanal | Mindestwirkung im Spiel | Mindesttest / Abgrenzung |
|---|---|---|
| Vier Konjunkturlagen | Bei gleichem Seed ändert sich die tatsächliche Menge/Mischung der Wochenanfragen im Inbox/Markt; vier Zustände sind im Zeitverlauf erreichbar. | Neutral/fehlender Input bleibt Basis; positive/negative Phasenfälle ändern Anfrageerzeugung innerhalb D-0169-Gesamtkappung. Lag/Übergang und Replay je Zustand prüfen. |
| FX / Import | Bei exponierter, offener Angebotskalkulation verändert sich nur die zugehörige importierte Material-/Logistik-Planposition. | Nicht als Transaktionskurs oder bestätigter Lieferantenpreis bezeichnen; kein Einkauf, Istkosten- oder Cashposten ohne echten Beleg. Null-Exposure und Preisrichtung testen. |
| Exportnachfrage | Der Exportexposure-Anteil verändert die tatsächliche Anfrage-/Kundenmix-Erzeugung, nicht nur eine Exportchanceanzeige. | D-0169-Gesamtanfragen bleiben dedupliziert; kein garantierter Zuschlag oder Umsatz. Null-/Exportfixture, Lag und Segmentbindung testen. |
| Lieferstörung / Import-ETA | Ein reales offenes Materialbestellereignis zeigt eine veränderte ETA und beeinflusst die Materialverfügbarkeit/Planbarkeit dieses Vorgangs. | Keine freie Fixture ohne Bestell-ID. Wareneingang, Bestand, Rechnung, Bewertung und Cash nur bei belegtem Folgeereignis. |
| Inflation / Kostenindizes | Die ausdrücklich gewählte Sensitivität verändert die Planrechnung eines noch offenen Angebots oder Produktplans. | Plan bleibt von Vertrag/Ist getrennt; Basismonat, Indexeinheit, Gewichte, Rundung, Snapshot-Freeze und fehlende Quelle testen. Keine automatische Lohn-, Miet- oder Kostenbuchung. |
| Geldpolitik / EZB-MRO (ein gemeinsamer Referenzpfad) | Bei expliziter Spieleranfrage verändert der MRO-Stand eine unverbindliche neue Finanzierungsquote, soweit A03 die Berechnungsmethode und Begriffe freigegeben hat. | Kein bestehender Vertrag, Dispo, Cash oder Ledger wird verändert. Ohne Spread-/Laufzeit-/Rundungsfreigabe bleibt die Quote `pending` und das Unternehmensgate offen. Keine Doppelmodellierung von MRO und Geldpolitik. |
| Finanzpolitik | Eine wirksame, exponierte Maßnahme erzeugt eine reale passende öffentliche Ausschreibung/Anfrage im Markt; der Spieler kann ein Angebot abgeben. | `publicTenderOpportunityIndex` allein ist PARTIAL. Kein Zuschuss, Steuertransfer oder Cash ohne belegten Vertrag/Anspruch/Zahlungsereignis. Null-Exposure und Geltungszeitraum testen. |
| Wachstumspolitik | Ein sichtbares, vom Spieler angenommenes Qualifizierungs-/Investitions-/Innovationsereignis kann die künftige geplante Kapazität oder Produktivität beeinflussen. | Langfristige Wirkung getrennt von kurzfristiger Angebotsorientierung halten; kein Kapazitäts-/Anlagen-/Abschreibungs-/Förderposten ohne Folgebeleg. |
| Tarifpolitik | Für noch nicht vertraglich gebundene Personal-/Angebotspläne ändert ein wirksamer Tarifplanindex die geplante Lohnbasis betroffener Rollen. | Keine Rückwirkung auf unterschriebene Verträge, Istlohn, Payroll oder Auszahlung. Branchenzuordnung, Lag und Doppelzählung mit Inflation testen. |
| Arbeitsmarktpolitik | Die Kandidaten-/Skillverfügbarkeit verändert einen echten Kandidatenpool oder die vom Spieler sichtbare Besetzungs-/Warteoption. | Keine automatische Einstellung, Qualifikation oder Payroll. Ohne passende Branche/Region neutral; Seed-/Skill-/Lag-/Restorefälle testen. |
| Umweltpolitik | Aktueller Rechtsstand erzeugt für tatsächlich betroffene Tätigkeit/Anlage eine sichtbare Pflicht/Prüfaktion oder ein belegtes Ressourcenwirkungsmodell; eine freiwillige Effizienzannahme bleibt explizit synthetisch. | Vor Implementierung aktuelle Primärquelle, Geltungsbereich und Wirksamkeit nach D-0161 prüfen. Keine automatische Abgabe/Förderung/Kostenbuchung. |
| Nachfrageorientierte Politik | Eine exponierte Maßnahme ändert die tatsächliche Nachfrage-/Anfrageverteilung im Inbox/Markt. | Nicht nur einen gesonderten Nachfrageindex erhöhen; D-0169-Mengenschutz und Vermeidung doppelter Nachfrageimpulse testen. |
| Angebotsorientierte Politik | Ein separater, akzeptierter betrieblicher Schritt verändert geplante Ressourcen-/Produktivitätsanforderung einer künftigen Operation. | Gegen Wachstumspolitik eindeutig abgrenzen: längerfristiges Potenzial versus konkreter Angebots-/Produktionsschritt. Keine Doppelzählung und keine Istkostenwirkung ohne Beleg. |

**Gemeinsame Regeln:** Nullfälle gelten bei fehlender Quelle, fehlender Veröffentlichung, fehlendem Exposure, falscher Region/Branche oder unwirksamem Datum. Wirksamkeitsfälle ändern nur die gebundene Zielgröße; gleiche Seeds/Inputs reproduzieren dieselben Resultate. Pro Kanal wird der Lag einzeln getestet. Geldpolitik/MRO werden nicht doppelt gezählt; Wachstum/Supply sowie Fiscal/Demand benötigen getrennte Effekt-IDs und explizite Zielvariablen. Makroaggregate und synthetische Testexposures belegen keine individuelle Firmenelastizität.

**Finanz-/Rechtsgrenze:** Plan-/Quote-/Szenariowerte sind keine Vertrags- oder Istwerte. Keine automatische Forderung, Umsatzrealisierung, Kosten, COGS, Steuer, Kreditverbindlichkeit, Auszahlung oder Ledgerbewegung. A03 prüft vor jeder Finanz-/Vertragswirkung den konkreten Ereignisvertrag. A08 prüft amtliche Quelle, Vintage und bei Umweltrecht den aktuellen Geltungsbereich; A09 prüft Kanalvollständigkeit, Dedupe, Lag, Replay/Restore und Regressionen.
## Phase 2 – Konfliktreview vor Integration

Nach Einreichung der Ausarbeitungen erstellt A01 eine Konfliktmatrix mit Quelle/Entscheidung, betroffenen Dateien/Tickets, Schweregrad, verantwortlicher Fachrolle und Lösung. Prüfpunkte sind insbesondere:

- Zeitbasis, Beobachtungs-/Wirksamkeitsdatum, Periodenende, Wochenendregel und Makro-/Operativperioden;
- Plan-/Ist-, Nettopreis-/Steuersicht, DB-I-Klassifikation, Rundung, BAB-Reconciliation und Doppelzählung;
- Bestand, Lieferung, Material-/Kapazitätsbindung und Finanzereignisse;
- unveränderlicher Angebotspreis und Snapshot bei Annahme;
- Rechtsstand, Rechtsformtyp vs. Kombination, Kandidatenstatus und konkrete Szenariogrenzen;
- Lernwirkung vs. mutierender Spielzustand, Beleg/Quelle und V2-Abnahmegrenzen.

A02/A03/A04/A05/A06/A07/A08/A09/A11 reviewen nur die ihnen zugewiesenen Fachgrenzen. A01 integriert Befunde; Konflikte mit gesetzten Entscheidungen werden durch diese Entscheidungen gelöst. Neue Produktentscheidungen werden separat gebündelt; technische/fachliche Annahmen bleiben als Vorschläge sichtbar, bis zuständige Fachrollen sie liefern. Es wird nicht integriert, solange ein entscheidender Konflikt ungelöst ist.

## Phase 3 – Integration und Phase 4 – Review danach

Erst nach Phase 2 werden die abgestimmten Spezifikationen und Implementierungsaufträge zusammengeführt. Nach Integration folgt ein zweiter, unabhängiger Abgleich gegen dieselbe Konfliktmatrix und D-0159/D-0161–D-0164: Ticket-/Goal-Abdeckung, Versionsschutz, Quelltraceability, UI-/Engine-/Finance-Schnittstellen, Tests, Mehrperioden-/Jahreslauf und Mobile-Pfade. A09-Ergebnisse bleiben klar von A01-Selbstreview unterschieden. Änderungen oder Restkonflikte werden mit Verantwortlichem und Nachweis dokumentiert; T-0069 bleibt offen, bis seine messbaren Releasegates bestanden sind.

## Status

Status je Arbeitspaket (2026-10-31):

- **T-0063:** Fachverträge A02/A03 dokumentiert; reine SPI-Funktion und zielbezogene Regression geliefert. A08-Quellenreview und A09-Code-/Regressionreview sind PASS. Makro-Szenarien, SPI-Anzeige/Engine-Kopplung, externe Übertragungskanäle und Jahresläufe sind nicht integriert.
- **T-0064:** A08s Quellen-/Rechtsformmatrixreview ist PASS. A02 lieferte zusätzlich einen logischen Rechtsträger-/Gründungsstatusvertrag; unabhängiger A08-Review dieses neuen Vertrags, A05-UI-Abgleich und A09-Grenzfallreview sind offen.
- **T-0065/T-0066/T-0067:** Fach- und Finanzverträge liegen auf Dokumentebene vor; UI-/Engine-Integration, die noch zugeordneten Reviews und T-0069-Szenarien bleiben offen.
- **T-0068:** A06 lieferte V3-01–21-Mapping, 60 Vw-Regelfragen (20 je Stufe) und 50 Vw-Ereignisfragen. Nach einem nicht bestandenen A07-Zweitreview wurden EVT-026, Lösungsverteilung, Distraktoren, Vw/RW-Abgrenzung und D-0147-Kopf/Wirkungen nachgearbeitet; A07-Drittreview, A08-Quellen-/Mapping-Re-review, A09-QA und A02/A03/A05-Zustandsabgleich laufen.
- **Steuerung:** A09 korrigierte Status-/Handoff-Befunde im vorherigen Review; die aktuelle Bestätigung der neuen Ergebnisse wird über die gezielten Reviews gesichert. CP-0280 ist weiterhin ENTWURF und bündelt die laufenden Nachweise.

Die bisherigen T-0063-Ergebnisse sind auf Dokumentebene integriert; die isolierte SPI-Hilfsfunktion ist implementiert, aber weder in V1/V2 noch in den V3-Spielablauf eingebunden. T-0064/T-0068 sind neue, noch nicht integrierte Lieferungen. Es wurde keine Schema-/Architekturfreigabe erteilt. Test-Fixtures bleiben synthetisch und sind keine empirische Kalibrierung. Alle Tickets T-0063 bis T-0069 bleiben IN_PROGRESS; kein Commit/Push.

## Statusfortschreibung CP-0323 (2026-10-31)

T-0064/T-0068 bleiben abgeschlossen; T-0063/T-0065/T-0066/T-0067/T-0069 bleiben in Bearbeitung. A01 hat die Markt-Restore-Grenzen im vorhandenen A02-Code samt Regressionen erneut ausgeführt; ein unabhängiges A09-Re-Review nach CP-0322 steht aus. Für T-0069 ist der gemeinsame Browserpfad von Angebot bis D-0168-Zahlung am 27.01.2027 bei 390×844 bestätigt. Handoffanzeige bleibt eine reine Projektion; die Runstate-Handoffkopie bleibt nichtbuchend. Die langen UI-Referenzen werden kompakt angezeigt und bleiben im Tooltip verfügbar. Vollständige Auftragsjahres-, Ledger-, Lager-/COGS-, Lieferanten-/Auszahlungsabstimmung und unabhängige Gesamt-QA bleiben offen. Details und exakte Zahlen: CP-0323.

## Statusfortschreibung CP-0324 – T-0063 Shared-Run-Makrofixture

Die zuvor separat vorhandene Makroengine ist jetzt im gemeinsamen V3-Run sichtbar: vier explizit synthetische Konjunkturpfade, Monats-Snapshots, SPI-/Aktivitätsanzeige und gespeicherte Makrohistorie. Das UI weist klar aus, dass es sich um unkalibrierte Testannahmen ohne Wirkung auf Angebote, Verträge, Ressourcen oder Finanzen handelt. Diese Abgrenzung wahrt den A03-Finanzvertrag und erfindet keine Wirkungskonstanten. T-0063 bleibt offen für empirische Kalibrierung und echte, evidenzbasierte operative Wirkungskanäle.
