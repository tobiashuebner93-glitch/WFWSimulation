# A02-Bericht – T-0063 L4 Treiberprovenienz-Fix (CP-0376)

**Status:** A03-NONPASS-Fix implementiert; alle geforderten fokussierten Regressionen PASS; Re-Review ausstehend
**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L4
**Entscheidungsbasis:** D-0161–D-0169; CP-0355 L4-Vertrag; CP-0374 L4-Implementierung
**Vorgänger:** A03 CP-0375 NONPASS; A02 CP-0374
**Arbeitsbasis:** `a02-code-input-t0063-l0l1`, Stagingpaket ohne `.git`

## Befund und Änderung

A03 CP-0375 fand, dass `driverIds` für eine Indexkomponente fehlen durfte. Damit konnte der Projektor nicht nachweisen, ob ein Komponentenwert bereits FX-, Politik-, Tarif-, Umwelt- oder CPI-Treiber enthält.

Jede verwendbare Komponente verlangt jetzt genau einen nichtleeren `driverIds`-Eintrag vom Typ `raw_component`. Der Eintrag muss deterministisch an Component-ID, Quellmonat, Event-Key und Event-Quellenreferenz, Scope, Contribution-ID und Effect-Group gebunden sein. Contribution- und Effect-Group-IDs müssen je Komponente/Monat eindeutig sein. Leere/fehlende Arrays, primitive IDs, doppelte/verfälschte IDs, falsche Komponenten-/Perioden-/Event-/Scopebindung sowie Treibertypen FX, Politik, Tarif, Umwelt oder CPI liefern keine Indexwirkung und werden als `pending` ausgegeben. Nicht aggregierte externe Treiber werden weder addiert noch multiplikativ gestapelt; für sie gibt es in diesem L4-Los keine freigegebene Aggregationsregel.

Die saubere synthetische Positivfixture enthält jetzt die vollständigen `raw_component`-Referenzen. Vorhandene Indizes, Gewichte und Formeln ändern sich nicht. Macro-History/Run-Envelope-Replayvalidierung bleibt bestehen; nach Save/Restore werden dieselben Treiberbelege genutzt. Der A03-Repro – fehlende `driverIds` bei ansonsten vollständigen Komponenten – ist als Regression enthalten und bleibt neutral/pending. Eine koordinierte Änderung nur einer gespeicherten effektiven Eventkopie wird beim Save-Envelope weiterhin fail-closed abgewiesen.

## Geänderte Dateien

- `prototype/v3-business-cost-plan-index.js` – Pflichtprüfung und Bindung der Treiberreferenzen sowie Dedupe pro Contribution/Effect-Group.
- `prototype/v3-business-cost-plan-index-regressions.mjs` – vollständige Positivfixture und adversariale Negativfälle für fehlende/leere/falsche/doppelte bzw. nicht passend gebundene Treiberreferenzen und unaggregierte FX-/Policy-/Tarif-/Umwelt-/CPI-Treiber.
- `docs/simulation/a02-t0063-l4-driver-provenance-fix-cp0376.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0376.md` – Checkpointentwurf.

Keine weiteren Dateien, insbesondere kein Run-/Makromodul, keine CPI/SPI-Datei, UI-, Posting-, Schema- oder Architekturdatei, wurden geändert. CP-0374/0375 blieben unverändert.

## Prüfungen

Alle Befehle endeten mit Exitcode 0:

- `node prototype/v3-business-cost-plan-index-regressions.mjs` – A03-Repro ohne `driverIds`, gültige Positivfixture, leere/falsche/duplizierte/inkonsistent gebundene IDs, FX-/Policy-/Tarif-/Umwelt-/CPI-Treiber, Basis-/Lag-/Handwerte, Replay/Restore und Run-/Finance-Nichtmutation.
- `node prototype/v3-price-index-regressions.mjs` – SPI/CPI COICOP12.
- `node prototype/v3-macro-simulation-regressions.mjs` – Makroevent-/Replay.
- `node prototype/v3-run-macro-fixture-regressions.mjs`.
- `node prototype/v3-run-orchestrator-regressions.mjs`.
- `node prototype/v3-run-operating-impact-regressions.mjs`.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – L2.
- `node prototype/v3-macro-policy-impact-regressions.mjs` – L3/L6.
- `node prototype/v3-market-simulation-regressions.mjs`.
- `node prototype/v3-macro-demand-channel-regressions.mjs` – D-0169.
- `node prototype/v3-finance-runtime-regressions.mjs`.
- `node --check prototype/v3-business-cost-plan-index.js` und `node --check prototype/v3-business-cost-plan-index-regressions.mjs`.
- Whitespaceprüfung beider Code- und beider Dokumentationsdateien – PASS, keine nachgestellten Leerzeichen.

SHA-256:

- `prototype/v3-business-cost-plan-index.js`: `0C31CD95AAA138D9C45B4985F2A9C3933067422CDDF2B6A880CDAECB5136D5C3`
- `prototype/v3-business-cost-plan-index-regressions.mjs`: `8FE3F511986868E1CA442C202D6A6E5059B5946D4660DE0D2889EF7F7B4CB8B4`

## Grenzen und Nachweisrollen

- **Ausführung:** A02; nur die L4-Runtime-/Regressionen wurden geändert.
- **Fachreview:** A03 CP-0375 meldete den NONPASS; Fix-Re-Review ausstehend.
- **Unabhängige QA:** A09 CP-0377 nach A03 ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Änderung.
- **Finanzwirkung:** keine; keine Istkosten-, BAB-, Lohn-, Bestand-, Vertrags-, Finanz- oder Ledgermutation.
- **Git:** nicht verfügbar, Stagingpaket ohne `.git`; kein Commit/Push.
- **Release/Jahreslauf:** nicht geprüft oder behauptet.

**Nächster Schritt:** Nach bestandenen finalen Regressionen bittet A01 A03 um read-only Re-Review; danach erfolgt A09s unabhängige QA. T-0063 bleibt offen.
