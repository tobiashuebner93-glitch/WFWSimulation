# A02 – T-0071 exogener EZB/MRO-Schritt und nachgelagerter Planindikator

**Status:** PARTIAL – Replay-/Integritätshärtung implementiert und regression-tested; A09-Re-Review offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0063 G5 / T-0071
**Basis:** CP-0476; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`
**Abgrenzung:** keine Änderungen in A05s `prototype/v3/run.js`; kein FinanceState-/Ledger-/Vertragszugriff, keine Volljahresläufe.

## Umgesetzter Ereignispfad

Der Makromonatsadapter akzeptiert nun optional `mroScenarioShock`. Die Eingabe ist eng an `V3-T0071-EXOGENOUS-MRO-DIRECTION-PAIR-LAG1` gebunden und wird als reproduzierbares MRO-Ereignis im Makroeventlog gespeichert. Bestehende Inputs ohne dieses optionale Feld behalten ihren bisherigen Pfad.

Für die T-0071-Fixture gelten ausschließlich diese Testwerte:

- synthetischer Referenz-MRO: 1,0 % p. a.;
- exogener Anhebungs-/Senkungsschritt: +0,5 / −0,5 Prozentpunkte im Beobachtungsmonat Januar 2028;
- erster Lag vom Schritt zur indikativ ausgegebenen neuen Finanzierungskondition: 1 Monat; im Februar ergeben sich 1,5 / 0,5 % MRO und bei synthetischem Spread von 2 Prozentpunkten 3,5 / 2,5 % indikative Kondition;
- Unsicherheitsband: ±0,25 Prozentpunkte;
- separate nachgelagerte Sensitivität: `investmentPlanIndex = 100 − 1,0 × ΔMRO` in Indexpunkten, auf ±2 Punkte gekappt; ein zusätzlicher Monat Lag nach der MRO-Wirksamkeit; im März ergibt das 99,5 / 100,5.

Alle numerischen Werte, Spread-/Laufzeitangaben, Formel und Lags sind **synthetische, unkalibrierte Testannahmen**. Die neutrale Gegenprobe hält den SPI-Warenkorb in allen drei Richtungen identisch und verändert ausschließlich das explizite MRO-Ereignis. Somit wird der alte Ursachepfad „SPI-Schock → MRO“ für diese T-0071-Paare nicht verwendet. Der Januar-MRO bleibt mangels erforderlicher Vorhistorie `unavailable`; vor Ablauf des ersten Lags wird keine neue Finanzierungskondition ausgegeben.

Der zweite Output ist eine unverbindliche, nichtbuchende **Planindikatorprojektion**. Er ändert keine Investitionsentscheidung, reale Kapazität, Produktion, Kreditaufnahme, bestehende Kreditkondition oder einen Finanz-/Ledgerwert. Der Makroadapter nimmt keinen autoritativen FinanceState entgegen; die Monats-Snapshots halten sämtliche `financeEffects`-Flags auf `false`. D-0022 bleibt Referenz-/Benchmark-Kontext. Es wird weder ein beobachteter EZB-Schritt behauptet noch ein EZB-Zinswert als Szenarioinput verwendet.

## Source-, Replay- und Neutralgrenze

Der Ereignisbeleg enthält Fixture-ID, `synthetic_fixture`-Quelle, Quellreferenz, Beobachtungs- und Wirksamkeitsmonat, `lagPeriods`, Richtungs-/Effektgruppe, Szenarioparametersatz und Unsicherheitsband. Im eng begrenzten Profil `T0071-exogenous-fixture-v1` wird jeder Monatsinput als `canonicalInput` im zugehörigen Snapshot gespeichert. `inputFingerprint` und `processedPeriods` werden gegen diesen Input geprüft; `validateV3MacroState` rekonstruiert den Makrozustand durch Replay sämtlicher kanonischer Inputs. Der normale Folgemonatsübergang führt dieselbe Validierung vor dem Fortsetzen aus. Dadurch werden koordinierte Änderungen an Makroevent und Snapshot erkannt, solange der gespeicherte kanonische Quellinput unverändert bleibt.

Das T-0071-Profil akzeptiert ausschließlich die festgelegte Fixture-ID und maximal einen Schock pro Lauf. Fremde Fixture-IDs, wiederverwendete `shockId`-/`effectGroupId`-Werte und Gruppenkollisionen mit anderen Makrokanälen werden zurückgewiesen. Die Projektion lässt höchstens einen T-0071-Effekt je Zielperiode zu; bei wiederholter Abfrage derselben Periode bleibt derselbe Index stehen, in der Folgeperiode geht die einmalige Planwirkung auf 100 zurück. Keine kumulative Fortschreibung.

Für `neutral` gibt es keinen Exogenereignisbeitrag: MRO bleibt auf der expliziten Testbasis, die indikative Quote bei 3,0 %, und der getrennte Investmentplanindikator bei Index 100. Hike/Cut haben identische SPI-, Aktivitäts- und übrige Kanalinputs. Gleiche Inputs liefern identische Makrosnapshots und Projektionen; Save/Restore zwischen Januar, Februar und März reproduziert identische Werte. Der Projektor ist read-only.

## Testbelege

- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` – PASS: exogener Hike/Cut bei neutralem SPI, einmonatiger Finanzierungs-Lag, ein weiterer Monat zum separaten Planindikator, Neutralfall, Quellen-/Annahmefelder, kanonische Inputfingerprints, koordinierter JSON Event-/Snapshot-Tamper, Fortsetzen manipulierter Restore-Daten gesperrt, fremde Fixture, doppelte Shock-/Effektgruppen, wiederholte/folgende Perioden ohne kumulative Wirkung, Save/Restore und Nichtbuchungsflags.
- `node prototype/v3/a03-t0071-ecb-finance-regressions.mjs` – PASS: bestehender SPI→MRO-Finanzpfad rückwärtskompatibel.
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node --check` für geänderte Makro-/Projektor-/Regressiondateien – PASS.
- A03-Finanzgrenzenreview des exogenen Pfads: PASS im isolierten nichtbuchenden Umfang, siehe `docs/accounting/a03-t0071-exogenous-mro-finance-review-cp0481.md`.
- A08-Quellenreview: qualitative Transmissionsrichtung vorhanden; keine Koeffizienten-/Lagkalibrierung dieses synthetischen Szenarios.
- A09-Review CP-0481: PARTIAL mit den Integritätslücken oben; A09-Re-Review nach dieser Härtung ausstehend. UI-/Browserprüfung: nicht ausgeführt.
- Kein Jahres-Smoke; kein Stage/Commit/Push.

## Dateien und Folgeadressaten

Geändert:

- `prototype/v3-macro-simulation.js` – optionaler, validierter exogener synthetischer MRO-Schock, laggebundener Makroevent und indikative Finanzierungs-Handoff;
- `prototype/v3-mro-operating-impact.js` – reine nachgelagerte Investmentplanindexprojektion;
- `prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` – isolierte Kontrollpaare und Replay-/Nichtmutationsprüfungen;
- `docs/simulation/a02-t0071-ecb-simulation-implementation-report.md` – dieser Befund.

Nächster Adressat: **A09** für unabhängige Replay-, Dedupe-, Tamper-, Lag- und Gegenfall-Re-Review. Der bestehende A03-Finanzgrenzenreview CP-0481 ist PASS. UI-/Browserintegration ist nicht Bestandteil dieses Pakets; falls das Szenario im normalen V3-Run auswählbar/anzeigbar werden soll, benötigt A01 einen separaten disjunkten Integrationsauftrag. Bis zu A09-Re-Review und einer Produktintegrationsentscheidung bleibt T-0071 PARTIAL/NONPASS.
