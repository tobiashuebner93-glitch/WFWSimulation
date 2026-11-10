# A02-Arbeitsbericht – T-0063 Simulationsmodell-Teilphase

**Status:** Simulationsvertrag erstellt; T-0063 bleibt IN_PROGRESS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0063
**Vorgänger:** CP-0275 (ENTWURF)
**Git-Basis:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; vorher vorhandene lokale Änderungen fremder Agenten erhalten.

## Preflight bestätigt

- AGENTS.md, Agentenstruktur und A02-Rechte, Goals, aktives Ticket Board, Collaboration State und CP-0275 (ENTWURF) geprüft.
- D-0100 bis D-0102, D-0159, D-0160 und nachträglich D-0163 geprüft. D-0163 bestätigt den inflationsorientierten MRO-Zukunftspfad auch für V3, wenn reale EZB-Daten fehlen; konkrete Formel, Lag und Unsicherheit bleiben zu kalibrierende Szenarioparameter. D-0160 ist nur V2. D-0159 schließt Pflicht-Lernereignisse aus diesem V2-Gate aus.
- A08-Quellen-/Modellgrundlage sowie die A03-Finanzübergabe aus dem Working Tree geprüft.
- T-0065-A02-Marktvertrag und T-0067-A03-Kalkulationsvertrag geprüft; keine neuen Preis-/Kosten-/Rundungsparameter daraus übernommen.
- `git status --short`, HEAD und `origin/main` geprüft; HEAD blieb `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, vorbestehende Änderungen waren vorhanden.

## Arbeitsergebnis

Der [A02-Simulationsvertrag](a02-t0063-v3-makro-simulationsvertrag.md) beschreibt:

- Monats-Snapshot/Periodenvertrag und logische, reproduzierbare Ereignisattribute ohne Schemafreigabe.
- vier phasenbasierte Zustände und benachbarte Übergänge mit Hystereseparametern; Schwellen, Koeffizienten und Persistenzwerte ausdrücklich als zu kalibrierende Parameter, nicht als belegte Fakten.
- versionierten Spielpreisindex `V3-SPI-COICOP12-v1` mit den zwölf belegten Destatis-VPI-Gewichten Basis 2020, Normierung auf 1,00000, Basis, Formel, Rundung und drei handprüfbaren Komponenten-Fixtures. Preisverläufe/Fixturedaten können synthetisch sein und werden nicht als amtliche VPI-/HVPI-Werte ausgegeben.
- drei Außenwirtschaftskanäle, zwei MRO-Szenarien und acht Politikkanäle mit messbaren Zwischenindikatoren, Verzögerungsfeldern, Unsicherheit und Unternehmensmesspunkten.
- reproduzierbare 12-Monats-Tests mit Quellen-/Seed-/Versionstrennung und A03-Invarianten ohne direkte Ledgermutation.
- gemeinsamer Ablauf-, Zustands-, Schnittstellen- und Test-Fixture-Vertrag mit T-0065/T-0066 im [A02-Integrationsvertrag](a02-v3-t0063-t0065-t0066-integrationsvertrag.md); D-0163 bestätigt den V3-Scope des MRO-Zukunftspfads.

## Konfliktreview

- A03-Finanzgrenzen eingehalten: reine Makro-/Indexmeldung ändert keine Salden oder bestehenden Verträge. Zinswirkung nur bei ausdrücklich definierter Vertragsterms- und Resetregel.
- A08s Quellenbefund nicht überdehnt: numerische Phasenschwellen, Effektkoeffizienten, MRO-Formel und Lags werden nicht als empirisch gesichert ausgegeben.
- D-0163 löst die frühere Scopefrage: der inflationsorientierte MRO-Zukunftspfad gilt auch für V3, wenn reale EZB-Daten fehlen. Weder historische Ersatzwerte noch ein konkreter numerischer Algorithmus werden dadurch bestätigt.
- Keine Kollision mit D-0159; D-0160 nicht auf V3 verallgemeinert.
- V2 bleibt unverändert; keine Code-, Schema-, Architektur- oder Buchungsänderung.

## Dateien

- `docs/simulation/a02-t0063-v3-makro-simulationsvertrag.md` – A02-Ereignis-/Modellvorschlag.
- `docs/simulation/a02-t0063-arbeitsbericht.md` – dieser Bericht.
- `docs/agent-system/ticket-board.md` – T-0063-Status präzisiert.
- `docs/agent-system/collaboration-state.md` – gemeinsame Phasen-/Abhängigkeitslage aktualisiert.

## Nachweisrollen

- **Ausführung:** A02; dokumentarischer Simulations-/Ereignisvertrag.
- **Fachreview:** A02-eigene Konsistenzprüfung gegen A08 und A03 durchgeführt. A03s konkrete Review-Anmerkung zur ID-/Idempotenztrennung wurde eingearbeitet; ein breiter gemeinsamer Fachreview bleibt offen.
- **Unabhängige QA:** A09 noch ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-/Produktänderung.
- **Automatisierte Tests:** nicht ausgeführt; nur Dokumentation und Modellvertrag.
- **Git-Verifikation:** `git diff --check` nach Änderung erfolgreich, mit bestehenden LF/CRLF-Hinweisen; lokale fremde Änderungen erhalten; kein Commit/Push.

## Offene Übergaben an A01

1. A08 prüft die datierten offiziellen Gewichts- und Komponentenquellen (Wägungsschema 2020 und GENESIS 61111-0006) sowie die korrekte Trennung beobachteter Reihen und synthetischer Spielpfade.
2. A01 koordiniert eine spätere Kalibrierungsmethode/Freigabestelle für Phasenschwellen, Wirkungseingaben, Unsicherheitsbänder/Lags und MRO-Szenarioparameter. Die Zahlen in den Integrations-Fixtures sind Testwerte, keine Produktparameter.
3. A03 bestätigt vor Implementierung die Finanzgrenze einer angenommenen neuen MRO-abgeleiteten Finanzierungskondition sowie Ereignis-/Perioden-/Duplikatregeln; A09 prüft anschließend die numerischen Vertrags-Fixtures und Reproduzierbarkeit.

Diese Punkte werden an A01 adressiert; keine direkte Rückfrage an den Nutzer wurde gesendet. Kein Commit oder Push.

## D-0163-Folgeabgleich

D-0163 bestätigt, dass der inflationsorientierte MRO-Zukunftspfad aus D-0102 auch in V3 gilt, wenn für den Zeitraum keine realen EZB-Daten vorliegen. Der Eingangsindikator ist die aus dem VPI-gewichtet aufgebauten Spielpreisindex berechnete `Inflation_y/y`; für synthetische Zukunftspfadwerte ist sie modellabgeleitet und weder Erwartungsreihe noch beobachteter nationaler VPI. Überführungsformel, Lag und Unsicherheitsband bleiben versionierte Szenarioparameter. Numerische MRO-Fixtures stehen nur im A02-Integrationsvertrag und sind keine Produktdefaults. Es wurden keine historischen MRO-Werte ergänzt. Die Festzins-/Altvertragsinvariante sowie V1/V2 und D-0160 bleiben unverändert. Keine Code-, Schema-, Architektur- oder Finanzregeländerung.

## A03-Reviewkorrektur

Auf A03s konkrete Review-Anmerkung wurde `macroEventId` eindeutig als Herkunfts-/Replay-ID der einmaligen Simulationswirkung abgegrenzt von einem späteren autorisierten `financialEventId`. Ein Makroereignis darf niemals direkt buchen. Ein freigegebenes Beschaffungs-, Vergütungs- oder Kreditreset-Finanzereignis benötigt eigene Idempotenz, A03-Vertragsreferenz und autorisierten Änderungs-/Buchungsgrund; eine Provenienzkorrelation zum Makroereignis ersetzt diese Regeln nicht. Die konkrete Buchungs-Duplikatregel bleibt unverändert A03 vorbehalten. Keine weitere Produktregel wurde ergänzt.

## Isolierte SPI-Implementierung

Die V3-SPI-Rechnung steht als separat importierbares, reines Modul in `prototype/v3-price-index.js`. `calculateV3SpiCOICOP12` akzeptiert zwölf positive COICOP-Komponentenindexstände und gibt den gewichteten, ungerundeten Index zurück. `calculateV3SpiPeriod` berechnet daraus m/m- und y/y-Inflation aus einer chronologischen Historie; ohne Vormonat oder ohne zwölf Monate Rückblick ist die jeweilige Rate `null`. Eingaben werden validiert, nicht verändert, und das Modul greift weder auf Engine-Spielzustand noch auf Finanzdaten zu.

Gezielte Regressionen stehen in `prototype/v3-price-index-regressions.mjs`. Sie prüfen Gewichts-Summe 1000‰/1,0, Basisindex 100, die drei dokumentierten Einzelkomponenten-Fixtures, Preisstabilität, m/m-/y/y-Auswahl, fehlende Historie, Eingabevalidierung und Nichtmutation. Der Katalog ist weiterhin nur als pure V3-Funktion verfügbar; ein V3-Profil/Lauf, UI, Speicherung und Anbindung an Makro-/MRO-Wirkungen sind nicht Teil dieses Auftrags.

Die Finanzgrenze des künftigen MRO-/Kreditangebots wird erst vor einer späteren Makro-/Finanzierungsintegration durch A03 bestätigt; sie ist keine Abhängigkeit der isolierten SPI-Berechnung.

## Isolierte T-0063-Makro-Runtime – Phase 1

**Status:** A02-Implementierung geliefert; unabhängige A09-Codeprüfung und Integration bleiben offen. Kein Gesamtabschluss von T-0063.

### Frischer Preflight und Änderungsgrenze

Vor der Implementierung wurden erneut `AGENTS.md`, Agentenstruktur und Rechte, MG-002/SLG-002.2/SLG-002.5 und V3-Zielkarte, T-0063 bis T-0069, Collaboration State, CP-0280 (ENTWURF), Decision Log D-0100 bis D-0102 und D-0159 bis D-0164, A08-Quellenbericht sowie A02-/A03-Makro-, Integrations- und Finanzverträge gelesen. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; bereits vorhandene Änderungen von A01/A03/A05/A06/A08/A09 und `prototype/engine.js` blieben unangetastet. Keine Governance-/Ticket-, Schema-, UI-, Ledger-, V1- oder V2-Datei wurde geändert.

### Runtime-Vertrag

Neu ist `prototype/v3-macro-simulation.js`, ein importierbares, deterministisches ES-Modul. Die API lautet:

- `createV3MacroState(profile)` verlangt explizite Lauf-, Szenario-, Seed-, Profil-, Quellen- und Parameter-IDs sowie Cycle-Schwellen, Persistenz, MRO-Formelparameter, Lag und Unsicherheit. Es gibt keine eingebauten Zahlen-Defaults.
- `runV3MacroMonth(state, input)` verarbeitet genau einen fortlaufenden Kalendermonat und gibt einen neuen serialisierbaren Zustand plus Makro-Snapshot zurück. Eingaben und alter Zustand werden nicht mutiert. Gleiches Replay gibt `duplicate: true`; abweichende Wiederholung desselben Monats und Periodensprünge werden kontrolliert abgelehnt.
- `validateV3MacroState(state)` prüft Grundform, lückenlose Monatsperioden und Fingerprint-Konsistenz.
- Die Phasen `upswing`, `boom`, `downturn`, `trough` werden aus expliziten Aktivitätslücke-/Momentumgrenzen klassifiziert. Phasenpersistenz und nur benachbarte Übergänge folgen dem Szenarioprofil; nicht benachbarte Übergänge benötigen ein explizites, quellbelegtes Schockobjekt. Fehlende Indikatoren erfinden keine Phase.
- Der Snapshot berechnet SPI sowie m/m- und y/y-Raten über `prototype/v3-price-index.js`; fehlende Historie bleibt `null`. Beobachtete Quartalswerte werden separat von synthetischer Monatsaktivität geführt.
- Alle drei Außenwirtschafts- und acht Politikkanäle werden mit Quelle, Einheit, Wirksamkeitsmonat, Lag, Unsicherheit und Exposition als getrennte Makroereignisse geführt. Wirksam werdende Beiträge erscheinen im Snapshot als Daten-Handoff; sie verändern keine Betriebsressource. Doppelte Politikbeiträge mit derselben `effectGroupId` und demselben Zwischenindikator bleiben protokolliert, aber nur der erste ist beitragsfähig.
- Die MRO-Zukunftsformel wird nur mit explizitem Szenarioparametersatz und verfügbarer y/y-Spielinflation gerechnet. Sie ist als `synthetic_uncalibrated` markiert; vorhandene MRO-Quelle hat Vorrang. Fehlender y/y-/Lag-Verlauf bleibt `unavailable`. Ein neues Kreditgesuch kann nur mit expliziter Spread-, Laufzeit-, Gültigkeits- und Vergleichs-MRO-Eingabe eine deterministische indikative Quote erhalten (`FQ|…`); `mroDeltaPp` und Zins werden separat berechnet. Die Quote erzeugt weder Vertrag noch Finanzereignis, Ledger, Cash oder Wirkung auf bestehende Verträge.

Die Runtime berechnet ausdrücklich keine Markt-/Unternehmenswirkung, Phasenwirkung auf Aufträge, VPI-Quellenbeschaffung, empirische Koeffizienten oder finanziellen Buchungen. Diese Übergaben warten auf A05/A03/A08 und Integration. Niedrige/zentral/hohe Koeffizienten sind Profilwerte, keine behaupteten Tatsachen. Keine historischen MRO-Werte wurden ergänzt.

### Regressionen und Nachweisrollen

Neu ist `prototype/v3-macro-simulation-regressions.mjs`. Synthetische Testfixtures decken ab: Basisindex und fehlende Preisindexhistorie; vier unterscheidbare Phasen und Hysterese; deterministisches Same-input-Replay, Payload-Konflikt und Monatskontiguität; verzögerte Außenkanalaktivierung; Doppelzählungsschutz für gemeinsame Politikgruppen; verfügbare/nicht verfügbare y/y-Historie; synthetische MRO-Erhöhungs- und Senkungspfade mit expliziter Regel; Quote-/Deltaberechnung ohne Ledger-/Cash-/Altvertragswirkung; getrennte beobachtete Quartals-/MRO-Eingaben; fehlerhafte Profile/Inputs und Nichtmutation.

Ausführung: A02. **Fachreview:** Selbstreview gegen A02-Makrovertrag, D-0163 und A03-Finanzübergabe durchgeführt; unabhängiger A03/A08-Review nicht erneut ausgeführt. **Unabhängige QA:** nicht ausgeführt; für A09-Re-Review bereit. **Browser-/Gerätetest:** nicht ausgeführt, kein UI. **Git-Verifikation:** neue Dateien geprüft und Fremdänderungen erhalten; kein Commit/Push.

## A09-T-0063-Rework – Ereignisidentität, Zustandsintegrität und Quellenprovenienz

**Bezug:** A09-Befund `docs/test-reports/a09-t0063-macro-runtime-qa.md`; A08-Klärung `docs/research/a08-t0063-observation-provenance-review.md`; D-0100–D-0102, D-0159, D-0161–D-0164. **Status:** A02-Korrektur geliefert; unabhängiger A09-Re-Review ausstehend.

### Korrekturen

- `addEvent` schreibt die erzeugte Makro-ID, `eventKey`, Lauf-/Szenario-/Seed-/Modellkennung, Kanal und Simulationsperiode nach den Quelldaten. Caller-Felder mit denselben Namen können dadurch weder Identität noch Periode/Phase überschreiben. `effectivePeriod` wird für externe und Politikbeiträge weiterhin ausschließlich aus dem validierten Eingabefeld plus Lag berechnet.
- `validateV3MacroState` prüft nun die vollständige Laufidentität und Version, Parametertypen, Phasenstatus, Monatsfolge, Perioden-Fingerprints und deren Schlüssel. Sie vergleicht außerdem Ereignis-IDs/-Envelope und Ereignisfolge mit den Snapshot-Historien, Snapshot-Periodenzuordnung, Aktivierungslisten und aktuellem Phasenstatus. Fehlende Historie, Identität oder Inkonsistenzen führen zu `invalid_macro_state`; `runV3MacroMonth` stoppt vor Transitionen kontrolliert. Es gibt keine stille Rekonstruktion.
- Beobachtete Größen erfordern jetzt `sourceRef`, Einheit, gültige fachliche Beobachtungsperiode, gültiges Publikationsdatum und einen Datenstand (`dataVintage` oder Quell-Snapshot-ID). Für beobachtete SPI-Komponenten sind diese Metadaten gemeinsam auf den COICOP-Datensatz anwendbar, müssen aber ausdrücklich denselben Berichtsmonat, Basis `2020=100` und Basketversion `V3-SPI-COICOP12-v1` belegen. Beobachtete Aktivität, Quartalswerte, externe Beobachtungen und MRO-Werte werden ebenso validiert.
- A08 bestätigte: `observedAt` ist für Monats-/Quartalsstatistik kein allgemeines Pflichtfeld und ersetzt weder Beobachtungsperiode noch Publikationsdatum. Es bleibt ein optionales Zeitfeld; Makroereignisse enthalten es als `null`, wenn die Quelle keinen Messzeitpunkt ausweist. Synthetische Fixtures dürfen Beobachtungs-/Publikations-/Vintagefelder leer lassen; sie behalten expliziten Szenario-/Fixture-Quellverweis, Einheit, Modellkontext und Simulationsperiode. Der A02-Vertrag und Decision Log wurden in dieser gezielten Korrektur nicht geändert.

### Regressionen / Prüfstatus

Die Makroregression enthält jetzt Caller-Spoofing-Proben für `macroEventId`, `period`, `channel`, `scenarioId`, `modelVersion`, `runId`, `seed` und `effectivePeriod`; erzeugte ID/Periode und Snapshot-Aktivierung müssen systemseitig konsistent bleiben. Weitere Fälle entfernen `events` oder `runId`, beschädigen Aktivierungshistorie und prüfen, dass ein valider wiederhergestellter Zustand akzeptiert wird. Quellenfälle zeigen: synthetische Fixturedaten funktionieren ohne Publikationsmetadaten; beobachtete Aktivitäts-/SPI-/Quartals-/MRO-Daten brauchen Datenstand, Beobachtungsperiode und Publikationsdatum; `observedAt` bleibt optional.

- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-price-index-regressions.mjs` – PASS.
- `git diff --check` und whitespace-Prüfung der neuen/ungetrackten Dateien – PASS.

**Nachweisrollen:** Ausführung A02; Fachreview A02 gegen A08-Klärung und T-0063-Vertrag; unabhängige QA A09-Re-Review ausstehend; Browser-/Geräte- und Gesamtjahrestest nicht ausgeführt; kein Commit/Push.

## A09-Final-Re-Review: Aktivierungshistorie und Provenienzsemantik

**Status:** A02-Korrektur umgesetzt; unabhängiges A09-Re-Review ausstehend.

A09 zeigte, dass ein fälliges Ereignis gleichzeitig aus `effectiveMacroEvents`, `activatedMacroEventIds` und `state.activatedEventIds` entfernt werden konnte, ohne dass die bisherigen gegenseitigen Referenzprüfungen dies erkannten. `validateV3MacroState` vergleicht jetzt für jeden Snapshot die vollständige, geordnete Sollmenge aller bis dahin geplanten und fälligen Ereignisse mit beiden Snapshot-Historien. Eine Aktivierung wird für Folgemonate als bereits verbraucht geführt und kann nicht erneut erscheinen. Der Vertrag definiert keine Cancel-/Reject-Ausnahme; die Runtime erfindet keine.

Die Vertragsfelder sind mit A08 synchronisiert: `effectiveFrom` ist Simulationswirksamkeit, `observedPeriod` der Berichtszeitraum, `publishedAt` der Veröffentlichungszeitpunkt des Datenstands. `observedAt` bleibt ein optionaler quellenspezifischer Ereignis-/Messzeitpunkt, nicht das generelle Pflichtfeld einer Monats-/Quartalsstatistik.

Regression ergänzt die konkrete A09-Probe (gemeinsame Kürzung und kontrollierte Zurückweisung vor Folgelauf) sowie einen gültigen Mehrmonatsverlauf ohne Wiederaktivierung.

- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-price-index-regressions.mjs` – PASS.
- `git diff --check` auf den A02-Dateien – PASS; die zwei bearbeiteten Markdown-Dateien wurden zugleich von vorhandenen Zeilenend-Leerzeichen bereinigt.

**Nachweisrollen:** Ausführung A02; Fachreview A02 anhand A08-Provenienzreview und A02-Vertrag; unabhängige QA A09-Re-Review ausstehend; Browser-/Geräte- und integrierter Jahrestest nicht ausgeführt; Git-Änderungen lokal, kein Commit/Push.

## A03-Folgekorrektur T-0063 – As-of, Quote-Fenster und ISO-Daten

**Preflight:** `AGENTS.md`, Agentenstruktur/-rechte, MG-002-Ziele, aktive Tickets, Collaboration State, Decision Log, CP-0279/CP-0280 (Entwurf), D-0161–D-0164, A02-Makrovertrag/-Runtime und A03-Finalreview geprüft. Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`. Breite parallele Änderungen anderer Agenten vorgefunden und erhalten.

### Befunde und Korrekturen

| A03-Befund | Ergebnis | Umsetzung |
|---|---|---|
| F-01: beobachteter Wert erst nach dem Snapshotmonat publiziert | **PASS** | Beobachtete Aktivitäts-, SPI-Komponenten-, Quartals-, Kanal- und MRO-Werte werden gegen den letzten Kalendertag des As-of-Monats geprüft. Verspätete Werte werden kontrolliert abgewiesen. |
| F-02: indikative Kreditquote ohne Datums-/Fensterprüfung | **PASS** | `validFrom`/`validUntil` müssen gültige ISO-Kalendertage und chronologisch geordnet sein. Vor Beginn wird kein Handoff ausgegeben, innerhalb des Fensters ist es `indicative`, nach Ablauf `expired`; maßgeblich ist der Monatsschluss-As-of. Kein Vertrag/Buchungs-/Cash-Effekt. |
| F-03: `effectiveFrom` nur bis Monatsebene geprüft | **PASS** | Vollständige ISO-Kalendertage werden in Eingaben und gespeicherten Ereignissen verlangt und validiert; Lag-/Monatsübergang nutzt anschließend die geprüfte Monatskomponente. |

Die bisherige Vertragsangabe, die `YYYY-MM` für `effectiveFrom` erlaubte, ist auf vollständiges ISO-Datum korrigiert. Keine Finanzpolitik, Quote-Statusfamilie, Kreditregel oder Buchungswirkung wurde neu eingeführt.

### Geänderte Dateien und Prüfungen

- `prototype/v3-macro-simulation.js`
- `prototype/v3-macro-simulation-regressions.mjs`
- `docs/simulation/a02-t0063-v3-makro-simulationsvertrag.md`
- `docs/simulation/a02-t0063-arbeitsbericht.md`
- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-price-index-regressions.mjs` – PASS.
- `git diff --check` und gezielter Whitespace-Scan dieser vier Dateien – PASS.

**Nachweisrollen:** Ausführung A02; A02-Selbstreview gegen A03-F-01..F-03 und geltenden Vertrag; unabhängiger A09-Re-Review sowie erneutes A03-Fachreview an A01 übergeben; Browser-/Geräte- und integrierter Jahrestest nicht ausgeführt. Kein Commit/Push.

