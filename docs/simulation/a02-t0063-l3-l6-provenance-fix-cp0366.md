# A02-Bericht – L3/L6 Quellenbindung und Scope-Typen (CP-0366)

**Status:** A09 NONPASS-Punkte behoben; gezielte Prüfungen PASS; A09-Re-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063 L3/L6, T-0069
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt der einzige Gesamtanfragefaktor
**Vorgänger:** CP-0363 (unverändert), A03 CP-0364, A09 CP-0365

## Befunde und Korrekturen

Der A09-Repro aus CP-0365 zeigte, dass eine koordinierte Mutation aller Policy-Verlaufskopien bei unverändertem Day-open-Input durch die bisherigen internen Historievergleiche nicht erkannt wurde. Außerdem akzeptierte die Projektion einen numerischen `publicSegmentRef`.

`validateV3RunState()` rekonstruiert nun die Makromonatshistorie deterministisch aus den je `macro_month`-Ereignis zugeordneten Day-open-Fingerprints. Der gespeicherte Input wird erneut durch `runV3MacroMonth()` verarbeitet; Snapshots, Eventlisten, Aktivierungen und Makrostate müssen exakt mit diesem Replay übereinstimmen. Dadurch werden `createRunSaveEnvelope()` und `restoreRunSaveEnvelope()` bei koordinierter Mutation der `macro.events`, `scheduledEvents`, `effectiveMacroEvents` und `snapshot.policyChannels` fail-closed abgewiesen, solange der autoritative Day-open-Input unverändert bleibt.

Der Policy-Projektor validiert vor einer Wirkung die gemeinsamen Identitätsfelder und alle bekannten Referenzen (u. a. `publicSegmentRef`, `segmentScopeRef`, `segmentId`, `adoptionRef`, `assetScopeRef`, Skill-/Mitarbeiter-Scope sowie Ereignis-/Run-/Szenario-IDs) als nichtleere Strings. Ein numerischer Scope wird mit Typfehler abgewiesen. Fehlende oder leere optionale Exposure-/Scope-Daten bleiben neutral. Die Projektion akzeptiert nur Shared-Run-Zustände, deren Makrohistorie gegen die Day-open-Inputs replayvalidiert wurde.

Es gibt keine neue Wirtschaftskausalität, automatische Aktivierung oder Änderung an Finanz-, Personal-, Vertrags-, Istkosten-, Kapazitäts- oder Ledgerzuständen. Vorhandene L3/L6-Planindikatoren und Begrenzungen bleiben unverändert; D-0169-Gesamtanfragen werden nicht verändert.

## Änderungen

- `prototype/v3-run-orchestrator.js` – autoritative Makrohistorie deterministisch aus Shared-Run-Day-open-Inputs replayprüfen.
- `prototype/v3-macro-policy-impact.js` – Shared-Run als Eingabe verlangen; Replayvalidierung und strikte Typprüfung der Referenzen.
- `prototype/v3/run.js` – Policy-Projektion an den vollständigen Shared Run binden.
- `prototype/v3-macro-policy-impact-regressions.mjs` – A09s koordinierte Fiscal-Mutation, Envelope-Erstellung/Restore, Scope-Typmutation und gültige positive Exposition dauerhaft regressionsprüfen.
- `prototype/v3-run-orchestrator-regressions.mjs` – Makromonat nur noch über den autoritativen Shared-Day-open-Pfad in den Run integrieren.
- `prototype/v3-macro-demand-channel-regressions.mjs` – erwartete Fail-closed-Meldung der erweiterten Replayvalidierung abgleichen.
- `docs/simulation/a02-t0063-l3-l6-provenance-fix-cp0366.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0366.md` – Checkpoint-Entwurf.

## Regressionen

Alle Befehle liefen im Stagingpaket mit Exitcode 0:

- Syntax: `node --check prototype/v3/run.js`, `node --check prototype/v3-macro-policy-impact.js`, `node --check prototype/v3-run-orchestrator.js`.
- Makro-Policy: `node prototype/v3-macro-policy-impact-regressions.mjs` – sieben Kanäle, Richtung, Neutralfall/fehlende Werte, Scope-Typmutation, Lag, Dedupe, Replay, gültige Wirkung, Finanz-Nichtmutation sowie A09-Koordinationsrepro; `createRunSaveEnvelope` und `restoreRunSaveEnvelope` lehnen die Mutation ab.
- L0/L1: `node prototype/v3-run-operating-impact-regressions.mjs`.
- Makro/D-0169: `node prototype/v3-macro-demand-channel-regressions.mjs`; `node prototype/v3-macro-simulation-regressions.mjs`.
- Shared-Run/Markt/Finance: `node prototype/v3-run-orchestrator-regressions.mjs`; `node prototype/v3-market-simulation-regressions.mjs`; `node prototype/v3-finance-runtime-regressions.mjs`.
- Syntaxcheck zusätzlich für beide geänderten Regressionen und alle geänderten Laufzeitdateien: PASS.
- Whitespaceprüfung aller sechs geänderten Code-/Regressiondateien: PASS.

Ausgewählte SHA-256:

- `prototype/v3-run-orchestrator.js`: `50290C1753DEB54CE924A28264FC84888D0A48222F1F18251CB5CDB2E7955D9C`
- `prototype/v3-macro-policy-impact.js`: `84B6A509C0BD3D0EA1A0913749FB290E6011B2808A4305CBC552F10309C95CE8`
- `prototype/v3-macro-policy-impact-regressions.mjs`: `BDB4C8571217B7EB1B0E6E3DD7E43E6494956D4699182382B33647439B88C807`

## Prüfrollen und Grenzen

- **Ausführung:** A02, Änderungen und gezielte Regressionen PASS.
- **Fachreview:** A03 CP-0364 deckt den bisherigen L3/L6-Nichtbuchungspfad ab; neuer Codefix nicht erneut fachlich geprüft.
- **Unabhängige QA:** A09 CP-0365 meldete die nun behobenen NONPASS-Punkte; A09-Re-Review ist ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; UI blieb unverändert.
- **Jahres-/Multipfadlauf:** nicht ausgeführt; Regressionen zielten auf konkrete Integritätslücken.
- **Git-Verifikation:** nicht verfügbar; Stagingpaket ohne `.git`. Kein Commit/Push.
- **Schema/Architektur:** keine Änderung/Freigabe.

**Nächster Schritt:** A09 führt unabhängig den CP-0365-Repro erneut aus. T-0063/T-0069 bleiben offen bis zur unabhängigen QA und weiterer V3-Integration.
