# A09 – L3/L6 Provenienzfix Re-Review (CP-0367)

**Status:** PASS im expliziten CP-0366-Re-Review-Scope
**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063 L3/L6, T-0069
**Entscheidungen:** D-0161–D-0169, insbesondere D-0169 (Gesamtanfrageninvarianz)
**Profil:** V3 Shared Run ab 04.01.2027; aktualisiertes A01-Paket `a02-code-input-t0063-l0l1`, ohne `.git`
**Vorgänger:** CP-0363 A02-Implementierung, CP-0364 A03-Finanzreview, CP-0365 A09-NONPASS, CP-0366 A02-Fix

## Preflight / Snapshot

AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket-Board, Collaboration State, Decision Log/D-0169, CP-0363–0366, A02-Bericht/CP-0366 sowie betroffene Macro-, Run-, Impact- und Regressionmodule gelesen. CP-0367 war vor Erstellung nicht vorhanden. `.git` fehlt; Gitstatus, Branch, HEAD und Diff sind nicht verfügbar. Keine Code-/Teständerung; neu erstellt wurden nur dieser Bericht und CP-0367.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Positiver valider Scope/Exposure | **PASS** | Shared-Run-Day-open mit fiscal delta `2`, numeric exposure `1` und `publicSegmentRef: 'segment:public'` liefert den erwarteten gekappten Planbeitrag `+2`; unveränderter gültiger Wert `+2` in Regression. |
| Neutraler Fehlwertfall | **PASS** | Fehlende Exposure, `0`, nichtnumerischer String und fehlende Scope-Referenz erzeugen keine Policy-Wirkung. Aktive Standardfixture hat null Policy-Effekte. |
| Falscher Scope-Typ | **PASS** | `publicSegmentRef: 42` wird in der Policy-Projektionsregression verworfen. Die Scope-Referenzvalidierung verlangt einen nichtleeren String. |
| Koordinierte Historyänderung mit unverändertem Day-open-Input | **PASS** | Adversarial-Repro änderte delta/newValue/exposure/scope/effectGroup/indicator konsistent in `macro.events`, `scheduledEvents`, `effectiveMacroEvents` und `snapshot.policyChannels`, ließ aber den Day-open-Fingerprint/autoritativen `macroMonthInput` unverändert. `createRunSaveEnvelope()` und `restoreRunSaveEnvelope()` warfen beide den erwarteten Fehler zur Abweichung vom autoritativen Day-open-Input/deterministischen Replay. |
| Replay-Bindung an `macroMonthInput` und `macro_month` | **PASS** | `validateMacroHistoryAgainstDayOpenInputs()` rekonstruiert MacroState aus Profil und den gespeicherten autoritativen Tagesinputs; jeder Replay-Snapshot und der Gesamtstate werden strukturell mit der gespeicherten History verglichen. Gleiche Eingaben bleiben idempotent. |
| Quelle/Periode/Lag/Identität | **PASS im Replayumfang** | Abweichungen von Event-/Snapshotkopien gegenüber erneutem Makromonatslauf aus `macroMonthInput` werden abgelehnt; positive Scope-/Exposure-Wirkung wird erst ab effektiver Periode projiziert. Makro-, Run- und Szenarioidentitäten sind durch Run-Validator gebunden. |
| D-0169-Invarianz | **PASS** | Die Policy-Projektion bleibt ein nichtmutierendes Run-Projection-Feld; Demand-Trace und tatsächliche Inquiry-Vorlagenzahl werden nicht geändert. Nachfrageorientierte Wirkung benennt nur Segmentchancen und den invariant bleibenden Gesamttrace. |
| Finance-/Ledger-Nichtmutation | **PASS im Projektionsumfang** | `getRunProjection()` hinterlässt Run und FinanceState bytegleich; Tests prüfen FinanceRuntime und Makro-/Demand-Nichtmutation. Es wird weder Ledger noch Cash-/Payroll-/Vertrags-/Kapazitäts-Istzustand geschrieben. Keine volle Jahres-/Ledgerreconciliation. |
| MRO-Ausschluss / spielbare Wirkung | **PASS als Scopegrenze** | Policy-Projektor verarbeitet nur Policy-Events. Standardfixture bleibt neutral und darf nicht als aktive Unternehmenswirkung ausgegeben werden. UI-/Browserverhalten nicht geprüft. |

## Reproduktion / Testausführung

Gezielte Regressionen, alle Exit 0:

- `node prototype/v3-macro-policy-impact-regressions.mjs` – PASS
- `node prototype/v3-run-operating-impact-regressions.mjs` – PASS
- `node prototype/v3-macro-demand-channel-regressions.mjs` – PASS
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS
- `node prototype/v3-market-simulation-regressions.mjs` – PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS

Zusätzliche In-Memory-Repros bestätigten: positiver gültiger Scope und Exposure wirkt; fehlende/Null-/nichtnumerische Exposure sowie Scope neutral; koordinierte Mutation wird bei Save-Envelope und Restore abgewiesen. Die Mutation der Probe blieb lokal im Arbeitsspeicher.

## Ergebnis und Grenzen

**PASS nur für die explizit beauftragten CP-0366-Gates.** CP-0365s Scope-Typ- und koordinierte-History-Repros sind behoben. L3/L6 bleibt eine synthetische, nichtempirische und nichtbuchende Projektion; die aktive Standardfixture ist neutral. Kein Gesamt-PASS für T-0063/T-0069, keine UI-, Jahres-, Geräte- oder Releasefreigabe.

- **Fachreview:** A03 CP-0364 ist ein früherer Finanzgrenzenreview; CP-0366-Codeänderung nicht erneut von A03 geprüft.
- **Unabhängige QA:** A09, dieses Dokument, PASS im benannten Scope.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** nicht verfügbar (`.git` fehlt).
- **Commit/Push:** nicht ausgeführt.

## Exakte ausgewählte Snapshot-Hashes (SHA-256)

| Datei | Hash |
|---|---|
| `prototype/v3-macro-policy-impact.js` | `84B6A509C0BD3D0EA1A0913749FB290E6011B2808A4305CBC552F10309C95CE8` |
| `prototype/v3-run-orchestrator.js` | `50290C1753DEB54CE924A28264FC84888D0A48222F1F18251CB5CDB2E7955D9C` |
| `prototype/v3/run.js` | `562218D96985EA1DCDF5BEAD88F06E07C6A231CDA952D4D53C3354CDFD6E1CDE` |
| `prototype/v3-macro-policy-impact-regressions.mjs` | `BDB4C8571217B7EB1B0E6E3DD7E43E6494956D4699182382B33647439B88C807` |
| `prototype/v3-macro-demand-channel-regressions.mjs` | `B7BE1659B9F424B689E1DE230DB9821D4F302E5955E802767192845A744DFFC1` |
| `prototype/v3-run-orchestrator-regressions.mjs` | `0A3046121476707CFD5D0AC97FA4DCEFBC01A54762A20FD2405C2E5BB945BA0E` |
| `docs/agent-system/checkpoints/CP-0366.md` | `813410DF26574D8B91A3A949A434F5A44EEBF607631222A521672DE8CECE4F67` |
| `docs/simulation/a02-t0063-l3-l6-provenance-fix-cp0366.md` | `F995B6CA6DC6010A38F7D5CAB5DE09C42DE8378A5F27A5CC4BEC8AB922EF81E0` |

Hashes identify selected content in the supplied snapshot, not a full-tree or Git commit hash.

**Nächster Schritt:** A01 kann den A09-PASS für den CP-0366-Provenienz-/Scopefix übernehmen. T-0063 und T-0069 bleiben wegen weiterer Makro-, Finanz-, Integrations-, Jahres- und UI-Gates offen.
