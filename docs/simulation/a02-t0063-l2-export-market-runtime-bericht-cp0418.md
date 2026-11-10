# A02-Bericht – T-0063 L2: Auslandsnachfrage im Markt-Runtime-Pfad (CP-0418)

**Status:** Implementiert; fokussierte Regressionen PASS; A03-Fachreview und A09-Adversarialreview ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 (L2), Anschluss T-0065/T-0069
**Run-Profil:** Shared Run ab 2027-01-04
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Wochen-Gesamtanfragenfaktor
**Vorgänger:** A08-Design CP-0417; A09 QA CP-0416; A02 CP-0368/CP-0371; A08 Gap-Audit CP-0351
**Arbeitsbasis:** `main@8b72b7e`; bereits vorhandene Arbeitsbaumänderungen blieben erhalten. Kein Commit/Push.

## Ergebnis

Die bisherige nachträgliche Exportmix-Projektion wird im optionalen synthetischen Szenario `V3-L2-EXPORT-SHIFT-5PP-LAG1` in den Shared-Run-Erzeugungspfad eingebunden:

1. `buildWeeklyTemplates()` berechnet zuerst wie bisher mit D-0169 die Wochenzahl `N` und baut die bisherigen Anfrage-Templates.
2. Danach darf der explizit im Lauf ausgewählte L2-Kanal genau diese `N` Slots deterministisch auf bestehende Segmente verteilen.
3. Die Marktengine erhält die finalen Templates über den bestehenden `schedule_week`-Vertrag. IDs und Kundenzuordnung je Slot bleiben stabil; Segment, Größenklasse, Preisreferenz und Kapazitäts-/Fähigkeitsanforderung stammen aus der vorhandenen Segmentvorlage.

Die opt-in-Fixture ist jetzt sowohl im Run-Identifier als auch im Makro-Snapshot gebunden. Sie ist ausschließlich für den Shared Run ab 04.01.2027 und mindestens bis 01.02.2027 zugelassen. Die Januarannahme mit `delta=+5 pp`, Exportexposition `1`, Segmenten `medium` und `large` und Lag `1` wirkt frühestens im Februar. Diese Zahlen sind ausschließlich synthetische Fixturewerte; sie sind keine empirische KMU-/Marktelastizität, Branchenregel oder Prognose. `NEUTRAL` bleibt unverändert.

### Verhalten und Grenzen

- Fehlendes, Null- oder Null-Expositionsergebnis, kein wirksames Ereignis, unbekannte Exportsegment-ID oder doppelte wirksame Ereignisse lassen die Ausgangsvorlagen unverändert.
- Ganzzahlige Largest-Remainder-Verteilung mit seed-/run-/period-/effectGroup-stabilem Tie-Breaking. Es entstehen keine Teilanfragen; Summe und Anzahl bleiben exakt `N`, auch wenn ein Rundungsrest anfällt.
- Explizit exportierbare Segmente in der Fixture: `medium`, `large`. Das ist eine Szenariokonfiguration, keine Aussage über ein echtes Unternehmen.
- Die tatsächlichen Templates und Anfragen tragen eine Replay-Referenz auf Fixture, Lauf, Periode, Lag, Quelle, Effektgruppe, Segment-Scope und Exportexposition. Die bestehende Markt-UI kann Segment und erforderliche Kapazität schon aus der Anfragevorlage anzeigen; A05-UI-Integration ist nicht Bestandteil dieses Arbeitspakets.
- Der Restore-/Statevalidator erzeugt die D-0169-Grundtemplates erneut und berechnet anschließend den L2-Mix aus den replayvalidierten Makroereignissen. Abweichende Vorlagen werden zurückgewiesen. Das Makro-Fixture, der Run-Identifier und das ausgewählte Root-State-Feld müssen zueinander passen.
- Der bisherige `macroTradeImpact`-Projektor meldet bei tatsächlich umverteilten Wochen die Integer-Istverteilung, statt die bereits veränderte Verteilung nochmals als erwartete Verschiebung zu projizieren.
- Keine Änderung am D-0169-Faktor, an Anfragezahl, Preis, Angebot, Zuschlag, Vertrag, Work Order, Umsatz, Finanzzustand, Ledger, Bestand, Beschaffung, FX oder ETA. Keine Schema-/Architekturänderung.

## Geänderte Dateien

- `prototype/v3-run-macro-fixture.js` – Fixtureidentität, bestehender Templatekatalog, deterministische Integerallokation/Basis-Template-Replay, synthetische Januar-Fixture und Makro-Snapshotbindung. Die Helpers liegen in einem bereits bestehenden Modul des A05-Graphen.
- `prototype/v3/run.js` – opt-in Run-ID/Fixture, D-0169-vor-L2 Template-Choreografie.
- `prototype/v3-run-orchestrator.js` – Fixture-/Run-ID-Prüfung, autoritative Makroinputprüfung und Restore-Replay der Marktverteilung.
- `prototype/v3-macro-trade-impact.js` – Ausweis der tatsächlichen Integerverteilung ohne doppelte Projektion.
- `prototype/v3-macro-trade-impact-regressions.mjs` – Umstellung des vorhandenen Exportfalls auf explizite Lauf-Fixture.
- `prototype/v3-foreign-demand-market-regressions.mjs` – fokussierte Runtime-, Invarianten- und Restoretests.
- `docs/simulation/a02-t0063-l2-export-market-runtime-bericht-cp0418.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0418.md` – Checkpointentwurf.
- `docs/agent-system/collaboration-state.md` – Review-/Übergabestatus.

## Prüfungen

Mit Exitcode 0 liefen Syntaxprüfungen für alle fünf geänderten Runtime-Module sowie:

- `node prototype/v3-foreign-demand-market-regressions.mjs` – PASS: Neutral/fehlend/Null/Null-Exposition, wirksamer und vorzeitiger Lag, positive und negative Verschiebung, `N=0/1/2/5/17/100/501`, exakte Summe und Ganzzahligkeit, Mehrfach-Exportsegmente, unknown segment, duplicate event/effect, stabile Seeds, 01.01–02.02 Shared-Run-Replay, Januar vor Lag neutral, Save/Restore, Tamper-Abweisung, keine Aufträge/Zuschläge oder Financeänderung.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – PASS: FX-/ETA-Nachbarpfade sowie tatsächlicher Exportmix und Nichtmutation.
- `node prototype/v3-macro-demand-channel-regressions.mjs` – PASS: bestehender D-0169-52-Wochen- und Restorevertrag unverändert.
- `node prototype/v3-market-simulation-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.

`git diff --check` über die geänderten Laufzeit-/Testdateien war sauber. Es wurde kein vollständiger Jahreslauf und kein Browser-/Gerätetest dieses neuen Opt-in-Szenarios durchgeführt.

## Review-Grenzen / nächster Schritt

A03 soll bestätigen, dass Segmentmix und Kapazitätsbedarf reine Markt-/Planungsdaten bleiben und weder Vertrags-/Erfolgs- noch Finanzbuchungswirkung auslösen. Danach prüft A09 adversarial Run-Bindung, unbekannte/duplizierte Events, Rundung, koordinierte Save-/Restore-Manipulation, Summenerhalt und Finance-/Auftragsnichtmutation. A05 kann nach beiden Reviews die tatsächliche Segment-/Kapazitätsänderung sichtbar kennzeichnen. T-0063/T-0065/T-0069 bleiben `IN_PROGRESS`; diese Implementierung allein ist kein V3-Abschluss oder Release-Nachweis.

Die geänderten Modulbytes sind im aktuellen `prototype/v3/run.html`-Graphhash noch nicht neu gebunden. A05 muss nach A03/A09 den existierenden statischen Modulgraphen neu generieren und seine Cache-/Entryregressionen laufen lassen; bis dahin ist dies kein Browser-/UI-Nachweis.
