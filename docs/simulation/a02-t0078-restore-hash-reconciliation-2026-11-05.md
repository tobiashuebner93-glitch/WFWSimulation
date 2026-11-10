# A02 – T-0078 midyear restore hash reconciliation

**Status:** Restore defect fixed; current-source DOWNTURN and LOW baseline/recovery pairs match in memory. Independent A09 confirmation and an approved baseline-artifact refresh remain pending; T-0078 remains OPEN.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Tickets:** MG-002 / SLG-002.5 / T-0078 / T-0069 G8
**Date:** 2026-11-05
**Runtime:** Node.js v24.22.1; branch `main`; HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; seed `T-0078-recovery-seed-1`; profiles DOWNTURN and LOW; dates 2027-01-04–2027-12-31; checkpoint 2027-06-30.

## Root cause and correction

A02's T-0065 price-weight change emitted `priceScore: undefined` as an own property in each legacy invitation-score row. The stable state hash included that property, while `JSON.stringify` omitted it from the save envelope. A09's diff confirmed that this was the entire midyear run-state difference (48 paths for LOW); the finance-state assertion was not the failing assertion. Thus the initial failure was a JSON round-trip integrity defect introduced by the A02 change, not a profile-specific finance mutation.

The market engine now omits `priceScore` entirely when a legacy profile has no price invitation weight; it emits a numeric field only for opted-in profiles. Targeted market and orchestrator regression suites pass after the correction.

## Current-source in-memory pair results

The pairs were run by importing the harness function directly, so neither baseline-mode execution nor recovery-mode execution wrote to `prototype/v3-t0078-recovery-baselines.json`.

| Profile | Seed | Baseline hash / ms | Recovery hash / ms | Days / macro months / events | Midyear run + finance restore | Negative envelopes |
|---|---|---|---|---|---|---|
| DOWNTURN | `T-0078-recovery-seed-1` | `bca994ee4ca9647129e3b22faea9cc2c119f5995b25911ae9b73ec02cbb99a4c` / 227,515.576 | same / 229,886.099 | 362 / 12 / 1,415 | PASS | all 6 PASS |
| LOW | `T-0078-recovery-seed-1` | `124a145459de2556393c811db6138c1df8cc87c1d43df3e1ab774f9bb86191f9` / 288,277.830 | same / 257,143.201 | 362 / 12 / 1,415 | PASS | all 6 PASS |

The six envelope failures remain fail-closed: unsupported save version, duplicate run event ID, negative material balance, cross-run finance state, duplicate scenario invoice ID, and duplicate payment event ID.

## Provenance and limits

Current source SHA-256:

- `prototype/v3-market-simulation.js`: `1597234BAE7CBD773F12C69802B88763B7A3B4702B70932E919093CC8DEFDAC2`
- `prototype/v3-market-simulation-regressions.mjs`: `79C28815574DF14120B994BEC206628D4763DE78C1E33E09DB358D976373C704`
- `prototype/v3-t0078-recovery-smoke.mjs`: `211F57EF216942C42C970B83E408FC3435013D6AF5F708A9A959FA84DA188DE5`
- `prototype/v3/run.js`: `02A3D78CEB35260613C005901B6389884CECCD06057D493DD0CCE00061CF1764`
- `prototype/v3-run-orchestrator.js`: `811516881188841006822F6D2FB48B407AD7E406DF8383A1178AB31A51AE61B0`
- Existing baseline JSON: `prototype/v3-t0078-recovery-baselines.json` SHA-256 `76EDD1F1F4DC13DAFD9BA755C2A97FBBF5C3E75DE4C34F98F2F349F66239D135` (unchanged).

The saved DOWNTURN/LOW baseline entries (`af73…` / `fd66…`) predate the source correction and are stale; they were not changed pending A01 approval and A09 independent confirmation. The current in-memory pairs establish reproducibility for this source fingerprint, not yet the status of the persisted baseline artifact. BOOM/UPSWING were not rerun in this reconciliation. No engine, finance, schema, or product-state behavior changed other than omission of the undefined optional field. No commit or push.

**Roles:** A02 execution and source correction; A09 trace received and independent rerun/review pending; A03 review not requested; browser/device test not applicable; Git commit verification not performed.

**Next:** A09 independently confirms current-source hash/pair behavior. A01 decides whether to refresh the persisted baseline JSON with the new provenance. T-0078 stays open until both gates are accepted.

## A01/A09-Nachtrag – 2026-11-05: persistierte Baselines und unabhängige Schlussprüfung

A01 hat nach der unabhängigen A09-Bestätigung die Baselines für DOWNTURN und LOW im gespeicherten JSON aktualisiert. Der neue Datei-SHA-256 ist `A5B41F20E5596B19D8DA421AC9B99E68DF62E3060123C5D4EBDFB519A6A68438`. Die dort gespeicherten Profileinträge stimmen mit den im Bericht belegten aktuellen In-Memory-Paaren überein: DOWNTURN `bca994ee4ca9647129e3b22faea9cc2c119f5995b25911ae9b73ec02cbb99a4c`; LOW `124a145459de2556393c811db6138c1df8cc87c1d43df3e1ab774f9bb86191f9`.

**A01/A09-Abschlussbefund:** Unabhängige A09-Prüfung PASS für den korrigierten DOWNTURN-/LOW-Recovery-Pfad. Für beide Profile bestehen Baseline/Recovery mit gleichem Endhash, der Midyear-JSON-Roundtrip von Run- und Finanzzustand sowie alle sechs fail-closed Envelope-Negativfälle. Damit sind die zuvor beschriebenen `priceScore: undefined`-Abweichung und die daraus folgende Baseline-Veraltung mit neuer Provenienz abgeglichen. Der oben stehende historische Befund beschreibt den damaligen Stand; dieser Nachtrag aktualisiert ihn nicht rückwirkend.

**Status:** T-0078 / T-0069 G8 kann nach A01-Gesamtabgleich auf PASS gesetzt werden. A09-Berichtspfad/Commitbindung ist durch diesen Hinweis allein nicht belegt; A01 muss den unabhängigen Reviewbeleg im Steuerungsregister referenzieren. Keine CP/MCP wurde geändert.
