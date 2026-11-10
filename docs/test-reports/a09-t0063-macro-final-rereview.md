# A09 unabhängiger Runtime-Re-Review – T-0063 Makro

**STATUS:** NICHT BESTANDEN – gekürzte Aktivierungshistorie wird akzeptiert und löst Reaktivierung aus
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0063
**PRE-FLIGHT:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0063, D-0100–D-0102, D-0159, D-0161–D-0164, ursprünglicher A09-Bericht, A02-Reworkbericht, A08-Provenienzreview und Runtime-/Integrationsverträge gelesen. Checkout: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; Branch `main`; HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; `main...origin/main`. Vorhandene Änderungen mehrerer Agenten einschließlich `prototype/engine.js` blieben unverändert.

## Umfang und Grenze

Unabhängiger Re-Review der Makro-Runtime und ihrer Regressionen nach A02s Korrekturen für geschützte Event-Metadaten, Stateintegrität und A08-Provenienz. Zusätzlich SPI-Funktion/-Regression und der Vertragstext wurden geprüft. Keine Produktdatei geändert. Dies ist keine empirische Kalibrierung, kein A03-Finanzfachreview, keine A05-UI-Integration und keine Browser-/Jahresabnahme.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Makro-/SPI-Regressions und Syntax | **PASS** | Beide Regressionen und beide Syntaxchecks bestanden. |
| Caller-Spoofing / Event-Envelope | **PASS** | Die frühere Probe mit gefälschter `macroEventId`, `period`, `channel`, `scenarioId`, `modelVersion`, `runId`, `seed`, `effectivePeriod` und Aktivierungsfeldern wird jetzt durch geschützte Envelope-Werte abgefangen; A02-Regression deckt die Fälle ab. |
| Deterministische Monatsverarbeitung / Replay | **PASS** | Gleiches Monats-Payload bleibt idempotent; geändertes Payload und nicht sequenzielle Periode werden kontrolliert abgewiesen. |
| Eingabe-/Vorzustands-Nichtmutation | **PASS** | Vorhandene Regressionen bestehen; Makroverarbeitung gibt einen neuen Zustand zurück. |
| Vier Phasen / Hysterese | **PASS** | Vier Zustände, benachbarte Übergänge, Persistenz und expliziter Schock sind durch Fixtures abgedeckt. |
| SPI / m/m / y/y / fehlende Historie | **PASS** | SPI-Regression besteht; fehlende Vergleichsmonate bleiben `null`. |
| Außenwirtschafts-/Politikkanäle / MRO-Lag | **PASS mit Begrenzung** | 3 Außenwirtschafts- und 8 Politikkanäle sowie einperiodiger MRO-Lag und Zukunftspfad sind durch synthetische Fixtures getrennt geprüft. Keine empirische Parametrierung wird belegt. |
| MRO-Finanzgrenze | **PASS mit Begrenzung** | Indikative Quote enthält keinen Vertrag, kein Finanzereignis, keine Buchung/Cashwirkung und keinen Reset bestehender Verträge. A03-Fachreview bleibt separat offen. |
| Pflichtidentität, Standardkorruption und einfache Kürzungen | **PASS** | Fehlende Lauf-ID/Ereignisse, abweichende Fingerprints, gekürzte Perioden, gekürzte Snapshot-Scheduled-Events und beschädigte Envelope-ID werden erkannt. |
| Vollständigkeit der Aktivierungs-/Effektivhistorie | **NICHT BESTANDEN** | Werden ein fälliges Event aus `effectiveMacroEvents` und seine ID aus Snapshot- sowie Gesamt-Aktivierungsliste gemeinsam entfernt, akzeptiert `validateV3MacroState` den Zustand. Der nächste Monatslauf aktiviert dasselbe alte Event erneut. Siehe reproduzierbarer Grenzfall unten. |
| Beobachtete Daten-Provenienz | **PASS auf Runtime-Ebene** | Aktivität, SPI-Komponenten, Quartalswerte und beobachteter MRO benötigen die Provenienzfelder gemäß A08; fehlender Vintage bzw. ungültiges Publikationsdatum wird abgewiesen. `observedAt` ist optional. |
| Synthetische Testdaten | **PASS** | Synthetische Fixtures ohne Beobachtungsperiode, Publikationsdatum oder Vintage laufen weiterhin; sie werden als synthetisch ausgewiesen. |
| Quellenauthentizität | **Nicht durch Runtime prüfbar** | Code prüft, dass `sourceRef` nichtleer ist und Metadaten vorhanden sind, kann aber nicht verifizieren, dass beliebiger Quelltext eine echte/exakte offizielle Serie bezeichnet. A08 weist diese Grenze ausdrücklich aus. |
| Numerische Grenzen | **WARNUNG / Spezifikation offen** | Fehlende, falsche, negative oder nichtendliche Werte werden in den vorhandenen Prüfungen kontrolliert abgewiesen. Ein synthetischer positiver Aktivitätsindex `1e308` mit Trend `100` wurde jedoch akzeptiert. Es gibt im Vertrag keine fachlich festgelegten Ober-/Untergrenzen für Indexstände, Koeffizienten oder Lagperioden; A09 erfindet daher keine. A02/A01 sollten vor Integration festlegen, welche Szenario-Grenzen gelten sollen. |
| A02-Vertrag vs. optionale Provenienz | **DOKUMENTATIONSABWEICHUNG** | A08 bestätigt die Runtimeanforderungen, stellt aber fest, dass der Makrovertrag `observedAt` weiter als Mindestfeld jedes Events aufführt, während Runtime und Reworkbericht es für Monats-/Quartalsstatistik optional behandeln. Das ist kein Runtimefehler; Vertragstext ist vor Abschluss zu synchronisieren. |
| Browser-/Jahresintegration | **Nicht ausgeführt** | Nicht Teil des isolierten Runtime-Re-Reviews; A05/A12 und T-0069 bleiben getrennte Gates. |

## Blocker: reproduzierbare Reaktivierung nach abgeschnittener Historie

Eine gültige Januar-Runtime wurde erzeugt. Danach wurden in der gespeicherten Januar-Historie dieselbe Event-ID aus `periods[0].effectiveMacroEvents`, `periods[0].activatedMacroEventIds` und `state.activatedEventIds` entfernt; `state.events` und `scheduledEvents` blieben intakt. `validateV3MacroState(state)` akzeptierte den Zustand. Bei Verarbeitung von Februar erschien die bereits im Januar wirksam gewordene Event-ID erneut in `snapshot.activatedMacroEventIds`.

Probe-Ausgabe:

```text
valid: true
truncate effective+activation histories consistently: true
{"tamperedStateAccepted":true,"missingEventReactivated":true,
 "eventId":"ME|V3-MACRO-SIM-1|qa-s2|qa-r2|1|external|fx_imported_inputs|2027-01"}
```

Dies ist ein echter Re-Review-Blocker für Integrität und Einmaligkeit des wiederhergestellten Zustands: eine teilweise beschädigte Aktivierungshistorie wird still fortgesetzt und kann denselben Makrobeitrag erneut aktivieren. Die Validatorprüfung muss die Vollständigkeit der fälligen Eventmenge pro Snapshot gegen gespeicherte Events, `effectivePeriod`, frühere Aktivierungen und aktuelle Aktivierungslisten absichern, nicht nur prüfen, ob die noch vorhandenen Referenzen gültig sind. Regression muss genau diese gemeinsame Kürzung erkennen und `runV3MacroMonth` muss vor jeder Folgetransition kontrolliert `invalid_macro_state` liefern.

## Weitere gezielte Reproduktionen

- Frühere fehlende `runId`- und leere `events`-Reproduktionen: durch A02-Fix erkannt; Folgelauf gibt `invalid_macro_state`.
- `periods.pop()`, Entfernung des Perioden-Fingerprints, Entfernung eines `scheduledEvent` und Mutation einer Event-Periode: jeweils vom Statevalidator zurückgewiesen.
- Observed-Aktivität ohne `publishedAt` bzw. mit unmöglichem Datum `2027-02-31`: kontrolliert abgewiesen.
- Beobachtete Aktivität mit Serie/Quelle, Einheit, Berichtsperiode, Veröffentlichungsdatum und Vintage: akzeptiert; `observedAt` darf null sein.
- SPI-Regressions belegen beobachtete Komponenten mit Datensatz-/Basket-Metadaten und synthetische Komponenten ohne beobachtete Zeitfelder.
- Extremwertprobe `activityIndex=1e308`, `trendIndex=100`: Lauf wurde als gültig akzeptiert. Ohne fachliche Wertebereiche ist dies als offene Modellgrenze dokumentiert, nicht als erfundener Zahlenfehler.

## Ausgeführte Prüfungen

- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-price-index-regressions.mjs` – PASS.
- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- Temporäre A09-Proben (im Temp-Verzeichnis erstellt und entfernt): einfache gekürzte Historien, konsistente Kürzung der Aktivierungsreferenzen, Folgeaktivierung, falscher Eventzeitraum, Extremwert und ungültiges Publikationsdatum.
- `git status --short --branch` – `main...origin/main`, breite vorbestehende Änderungen verschiedener Agenten; nichts davon wurde verworfen. Kein Commit/Push.

## Übergabe

A02 erhält von A01 den eng begrenzten Reparaturauftrag für Vollständigkeit der Aktivierungshistorie samt Regression und kontrollierter Ablehnung. Danach ist ein erneuter unabhängiger A09-Test notwendig. A02/A01 sollten außerdem den Vertrag zu `observedAt` mit A08s Review synchronisieren; dies ist ein Dokumentintegrationspunkt, kein Runtimebefund. Numerische Obergrenzen sind nicht bestätigt; A01 klärt, ob sie jetzt in den Simulationsvertrag aufgenommen werden sollen oder für ein späteres Kalibrierungsticket offen bleiben.

A03-Finanzreview, A05-Integration und T-0069 End-to-End-/Jahresszenarien bleiben offen und werden durch diesen Bericht nicht ersetzt.

**Ausführung:** A02 hat Runtime und Regressionen geliefert; A09 führte unabhängige Regressionen/Grenzfallproben aus.
**Fachreview:** A02-Selbstreview und A08-Provenienzreview vorhanden; A03-Finanzfachreview nicht ausgeführt.
**Unabhängige QA:** A09; NICHT BESTANDEN wegen Aktivierungshistorie.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** Branch/HEAD/Status geprüft; nur Bericht neu geschrieben, Produktcode und Fremdänderungen unverändert. `git diff --check` auf den Bericht nach Erstellung auszuführen.
**Commit/Push:** nicht ausgeführt.
