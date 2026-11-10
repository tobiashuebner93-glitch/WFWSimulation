# A09 – T-0069 QA-Vorbereitung

**Status:** Vorbereitungsphase; integrierte QA nicht begonnen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Vorgänger:** CP-0275 (ENTWURF)  
**Preflight:** AGENTS.md, Agentenstruktur und Rechte, Goals, Ticket Board, Collaboration State, Decision Log, V3-Zielkarte, bestehende QA-/Jahres-Smoke- und Browsernachweise sowie Gitstatus gelesen. D-0159 beachtet.  
**Git-Basis:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, identisch mit `origin/main` vor den lokalen V3-Arbeiten.

## Zweck und Grenze

Diese Matrix operationalisiert die spätere unabhängige T-0069-Abnahme. Sie ist kein Produktregelwerk, keine Releasefreigabe und kein Beleg, dass V3 bereits integriert oder getestet wurde. Es werden keine Seeds, Profilwerte, Makroparameter oder Erfolgsschwellen erfunden. Diese kommen aus den abgeschlossenen Fachlieferungen T-0063 bis T-0068. V2-Abnahme und D-0159 werden nicht wieder geöffnet; Tagesblockierende Lernereignisse sind kein V3-Gate.

## Nachweisformat je Lauf

Vor Ausführung sind Produktrevision/Arbeitsbaum, Startprofil und Startzustand, Simulationsstart/-ende, Makro-Szenario, Seed bzw. dokumentierter Zufallsquellenstatus, Eingaben/Spielerentscheidungen und aktive Ticket-/Modellversion zu sichern. Der Laufbericht hält pro Ereignis Datum/Phase, Aktion, Vorher-/Nachher-Werte und Wirkungsgrund fest. Für Finanzen gehören Kassen-/Bank-/Dispozustand, offene Posten, Ergebnis-/Kostenwerte, Journal-/Ledgerauszug und Reconciliation dazu. Am Ende: Ergebnisstatus samt fachlichem Grund, technische Ausnahmen, Bestandsvalidierung, Finanzdifferenz und deterministischer Ereignis-/Endzustandshash, sofern das System diese Werte unterstützt. Nicht vorhandene Instrumentierung ist als fehlender Nachweis zu melden und nicht durch eine QA-Annahme zu ersetzen.

## Tracebare Gate-Matrix

| Gate | V3-Ziel / Fachlieferung | Vorbedingungen und Eingaben | Prüfung / Passbedingung | Beleg |
|---|---|---|---|---|
| G0 Provenienz und Reproduzierbarkeit | T-0063–68; CP-0275 | Integrierte Revision; freigegebenes Profil; feste Seeds aus Fachverträgen | Derselbe Stand, dasselbe Profil, dieselbe Eingabe und derselbe Seed erzeugen reproduzierbare Ereignisfolge und Endwerte. Fehlt eine Zufallsquelle, muss das explizit nachgewiesen werden. | Run-Metadaten, Konfiguration, Ereignis-/Endhash, Wiederholungslaufvergleich |
| G1 Vier Konjunkturlagen | V3-02 / T-0063 | Je ein durch A08/A02 belegtes Aufschwung-, Boom-, Abschwung- und Tiefstandszenario mit dokumentierten Eingangsreihen und Übergängen | Jede Lage ist erreichbar und mindestens zwölf Simulationsmonate ausführbar; Nachfrage und mindestens ein Kosten-/Kapazitätsindikator zeigen die fachlich vereinbarte Wirkung. Keine von QA erfundenen Schwellen/ Kausalitäten. | Vier Szenarioakten, Monats-/Phasenprotokolle, Übergangsnachweise und Wirkungswerte |
| G2 Markt und Angebotskreislauf | V3-03–08 / T-0065 | Feste Kunden-/Wettbewerbsparameter; kontrollierte Unternehmenspassung, Reputation, Kapazität und Angebotseingaben | Anfrageeingang, Angebot, zeitversetzte Annahme/Ablehnung/Ablauf, Preis-Freeze, Konkurrenzverdeckung und Marktbericht folgen T-0065. Paarvergleiche belegen die vereinbarte Wirkungsrichtung; keine Duplikate. | Seed-Matrix, Zustandsassertions, Angebots-/Auftrags-IDs, Berichtsauswertung ohne Einzelgebote |
| G3 Gründung/Rechtsformpfad | V3-19–21 / T-0064 | Nur quellengeprüfte angebotene Formen/Kombinationen und freigegebene Szenarien | Gründung und Auswahl durchlaufen belegte Voraussetzungen, Haftung, Geschäftsführung/Vertretung und Folgen; unzulässige Zustände werden nicht als gültig angeboten. | Quellen-/Regelreferenz, gültiger und ungültiger Pfad, Zustandsprotokoll |
| G4 Kalkulation, BAB und Ziele | V3-07, 10, 17 / T-0067 | Freigegebene Kosten-/Preis-/Steuersemantik, Einheiten, Periode, Rundung und BAB-Verteilungsregeln | Positive, knappe, neutrale und negative Fälle rechnen nach dem Vertrag; BAB verteilt Kosten ohne Erzeugung/Doppelzählung und stimmt auf null Differenz ab. Kennzahlen stimmen mit ihrem benannten Zeitraum und Ledger-/Simulationsstand überein. | Rechenvektoren, eingegebene Annahmen, Kostenstellen-/BAB-Abgleich, Kennzahlenquelle und Reconciliation |
| G5 Produktivität und Produktlebenszyklus | V3-09, 18 / T-0066 | T-0065 Nachfragevertrag und T-0067 Kalkulation; Produkt-/Skill-/Kapazitätseingaben | Mindestens zwei Produktpfade durch Idee, Entwicklung, Herstellung, Bestand, Preis/Vermarktung und Absatz; Engpass und unwirtschaftlicher Fall nachvollziehbar. Einzelvariablenvergleiche belegen Skill/Motivation/Ausstattungswirkung; keine Kapazitäts- oder Qualifikationsumgehung. | Produktzustände, Ressourcen-/Zeit-/Kostenprotokoll, Vergleichsläufe, Bestands- und Absatzbeleg |
| G6 Lernzuordnung/Nichtmutation | V3-01, 11 / T-0068; D-0159 | Finaler Kompetenz-/Quellenplan und freigegebener V3-Lernbestand | Vollständigkeitsreferenzen zu Kompetenz, Spielkontext, Lernobjekt und Quelle prüfen. Neutraler Übungsmodus ändert Unternehmens-/Finanzzustand nicht. Pflichtantworten vor Tagesfortschritt sind ausgeschlossen. | Inventur/Referenzintegritätsbericht, Vorher-/Nachher-Statevergleich, D-0159-Gate |
| G7 Tragfähiger Jahresverlauf | V3-12 | Eine der freigegebenen Szenariokonfigurationen, feste Eingaben/Seed und mindestens zwölf Simulationsmonate | Tragfähigkeit anhand der im Fachvertrag definierten Werte erklären; keine technische Ausnahme, unzulässige Bestände, doppelte Buchung oder Reconciliationabweichung. Kein selbst erfundener Solvenzgrenzwert. | Vollständiges Jahres-Smokeprotokoll, tägliche/monatliche Finanzwerte, Ereignis- und Reconciliationbeleg |
| G8 Wirtschaftlich scheiternder Jahresverlauf | V3-12 | Konfiguration, die laut freigegebenem Modell wirtschaftliches Scheitern auslösen kann | Scheitern ist durch Ereignisse/Entscheidungen und Zustandsänderungen erklärbar; es entsteht kein technischer Ausnahmefehler, unzulässiger Bestand oder Buchungs-/Abstimmungsfehler. Fachlich definierter Verlust-/Insolvenzstatus wird belegt, wenn das Modell ihn vorsieht. | Failure-Timeline, auslösende Fachbedingungen, Status-/Finanzbericht, technische Fehlerfreiheit |
| G9 Mobile Browserpfade | V3-12 / A12 Handoff | Integrierte Anwendung; identische Szenarien/Fixture; Viewports 390×844 und 768×1024 | A12 führt zentrale V3-Pfade explorativ aus: Gründung/Markt, Angebot, Kalkulation/BAB, Planung/Produkt, Monats-/Lernbericht. Keine horizontale Seitenüberbreite; Kernaktionen bedienbar. A09 bewertet nur belegte QA-Asserts, A12 liefert visuelle Beobachtung. | A12-Bericht, Viewport-Screenshots, reproduzierbare Fixture/Startzustand und Fehlerliste |
| G10 Regression/Releaseentscheidung | gesamte V3; V2-Schutz | Änderungsumfang und Vergleichsbaseline dokumentiert | Nur ausdrücklich betroffene V3-Invarianten regressionsprüfen; keine pauschale V2-Bestätigung ohne commitgebundenen Nachweis. Blockierende Fehler führen zu FAIL/OPEN, nicht zu stiller Ausnahme. | Regressionsergebnisse mit Revision, Differenzliste, Triage und getrennte Ausführungs-/Review-/Browsernachweise |

## Szenariokatalog (Platzhalter bis T-0063)

| Szenario-ID | Makrolage/Abfolge | Laufdauer | Geplanter Zweck | Seed/Profil |
|---|---|---:|---|---|
| V3-YEAR-01 | Aufschwung gemäß T-0063 | mindestens 12 Simulationsmonate | Bestandteil der Vier-Phasen-Abdeckung; Wirkungs-/Übergangsnachweis | aus T-0063 offen |
| V3-YEAR-02 | Boom/Hochkonjunktur gemäß T-0063 | mindestens 12 Simulationsmonate | Bestandteil der Vier-Phasen-Abdeckung; Wirkungs-/Übergangsnachweis | aus T-0063 offen |
| V3-YEAR-03 | Abschwung gemäß T-0063 | mindestens 12 Simulationsmonate | Bestandteil der Vier-Phasen-Abdeckung; Wirkungs-/Übergangsnachweis | aus T-0063 offen |
| V3-YEAR-04 | Tiefstand gemäß T-0063 | mindestens 12 Simulationsmonate | Bestandteil der Vier-Phasen-Abdeckung; Wirkungs-/Übergangsnachweis | aus T-0063 offen |
| V3-YEAR-05 | Fachlich festgelegte tragfähige Entscheidungslinie | mindestens 12 Simulationsmonate | positive wirtschaftliche Erklärung; kann einen der vier Läufe ergänzen, wenn Kriterien und Verlauf vollständig passen | T-0063/69 offen |
| V3-YEAR-06 | Fachlich festgelegte wirtschaftlich scheiternde Entscheidungslinie | mindestens 12 Simulationsmonate | erklärbares Scheitern ohne technische/ledgerseitige Inkonsistenz; kann einen der vier Läufe ergänzen, wenn Kriterien und Verlauf vollständig passen | T-0063/69 offen |

Die Szenarien 05/06 dürfen nicht automatisch als zusätzliche Modelle oder Seeds behandelt werden: A02/A03 sollen nach Vorliegen der Makroverträge bestimmen, ob tragfähiger und scheiternder Verlauf innerhalb der vier Pflichtläufe reproduzierbar abgedeckt werden oder eigenständige Läufe brauchen. Damit entsteht keine unnötige fünfte/sechste Makroannahme.

## Abhängigkeiten und fehlende Eingänge

- **T-0063:** datierte Quellen, vier Makroregime, Übergangs-/Wirkungsregeln, Szenarioreihen und feste Seeds/Profilbasis.
- **T-0064:** konkrete, quellengeprüfte Gründungs-/Rechtsformpfade und gültige/ungültige Zustände.
- **T-0065:** deterministische Kunden-/Wettbewerbs-/Angebotsregeln, Fristen und Berichtsfelder.
- **T-0066:** Produkt-/Produktivitäts-/Kapazitätsablauf, Erfolgs- und unwirtschaftliche Fälle.
- **T-0067:** Preis-/Steuersemantik, Kostenklassifikation, Rundung, BAB-Zeitpunkt und Kennzahlenperiode.
- **T-0068:** finale Kompetenz-/Lernobjektreferenzen, neutraler Lernmodus und A07-Inhaltsvalidierung.
- **A12:** mobile Fixtures und explorativer Browserbericht, sobald integrierte V3-Pfade verfügbar sind.

## Vorhandene Referenzartefakte (keine V3-PASS-Behauptung)

Repository-V2-Beispiele: `prototype/year-simulation-smoke.mjs`, `prototype/year-simulation-log-2027.md`, `prototype/manual-year-smoke-test-log.md`; gebundene V2-Gates in `docs/agent-system/test-reports/T-0062-A09-final-release-committee-pass.md` und verwandten T-0062-Berichten. Diese dienen nur als Struktur-/Harnessreferenz. Sie belegen keinen V3-Lauf und dürfen ohne Profil-/Versionsnachweis nicht als T-0069-Ergebnis übernommen werden.

## Prüfstatus

Preflight und QA-Matrix-Vorbereitung: abgeschlossen. Integrierte V3-Jahressmokes, unabhängige Fachreviews, Browser-/Gerätetest und Releaseentscheidung: **nicht ausgeführt**. Kein Test wurde durch diese Vorbereitungsphase ausgelöst; kein Code geändert.
