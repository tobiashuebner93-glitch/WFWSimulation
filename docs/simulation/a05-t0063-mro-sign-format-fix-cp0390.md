# A05 T-0063 – MRO-Level ohne Pluszeichen (CP-0390)

**Status:** A09-NONPASS korrigiert; gezielte Regressionen PASS; unabhängiger Re-Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Vorgänger:** CP-0389 (A09 NONPASS), CP-0388 (A05 UI), CP-0387 (A02 Projektion)  
**Profil:** V3 Shared Run, Spieljahr 2027  
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169

## Befund und Korrektur

A09 reproduzierte in `renderMacroSummary` die Ausgabe eines positiven absoluten MRO-Werts als `+3,15 % p. a.`. Der A05-Renderer verwendet nun getrennte Formatierung: MRO-Level erhalten kein positives Präfix; Referenzaufschläge behalten ihr Pluszeichen. Negative Werte behalten ihr Minuszeichen.

Es wurden keine Simulations-, Finanz-, Save/Restore- oder Vertragsregeln geändert. D-0022-Benchmark, individuelle Konditionen `pending`, Provenienz-Escaping und Finanz-/Run-Nichtmutation bleiben erhalten.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs`
- `docs/simulation/a05-t0063-mro-sign-format-fix-cp0390.md`
- `docs/agent-system/checkpoints/CP-0390.md`

## Verifikation und Nachweisrollen

- **Ausführung:** A05, eng begrenzter UI-Formatfix.
- **Gezielte Regression:** `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` PASS. Deckt MRO 3,15 %, 0,00 % und −0,50 % ab; benchmark +0,50 bis +5,50 PP und +3,00 PP bleiben mit Pluszeichen; Pending, Escaping und Run-Nichtmutation bleiben bestanden.
- **Bestehende Regressionen:** `node prototype/v3-run-macro-fixture-regressions.mjs` PASS; `node prototype/v3/a05-t0063-macro-regressions.mjs` PASS.
- **Fachreview:** A03 CP-0386 deckt die Finanzgrenze ab, nicht diesen Formatfix.
- **Unabhängige QA:** A09-Re-Review ausstehend; A09 CP-0389 bleibt als initialer Befund unverändert.
- **Browser-/Gerätetest:** nicht ausgeführt; A12-Prüfung nach A09-Re-Review vorgesehen.
- **Git:** Branch `main`, HEAD `8b72b7e`; 309 Status-Einträge im vorhandenen umfangreichen Arbeitsbaum. Fremde Änderungen erhalten. Kein Commit oder Push.
- **Whitespace:** `git diff --check` PASS; nur bestehende LF/CRLF-Hinweise.

## Übergabe

A01 übergibt CP-0390 an A09 zum unabhängigen Re-Review der MRO-Level-, Benchmark-, Null-/Negativ-, Pending-, Escaping- und Nichtmutationsdarstellung. Nach PASS folgt A12 mit Browserprüfung. T-0063/T-0069 bleiben IN_PROGRESS.
