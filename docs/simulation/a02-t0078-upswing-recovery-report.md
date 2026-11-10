# A02 T-0078: UPSWING annual recovery evidence

**Status:** PARTIAL — one profile passes the annual baseline and intermediate recovery gate; T-0078 remains open for BOOM, DOWNTURN and LOW.

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Goal:** MG-000 / SLG-000.2  
**Ticket:** T-0078 / T-0069 G8  
**Revision:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c` (`main`); local uncommitted tree.  
**Scope:** T-0078 recovery harness and one narrow fail-closed restore-envelope guard; no business-rule, schema, or ticket-status changes.

## Evidence

| Profile / run | Dates | Seed | Wall time | End hash | Result |
| --- | --- | --- | ---: | --- | --- |
| UPSWING uninterrupted baseline | 2027-01-04–2027-12-31 | `T-0078-recovery-seed-1` | 246,913.755 ms | `bdb8c1b38eb9ea3ffeb20fc3a94954a731766f9ae384e0960ebc20dd5dc00c4b` | PASS |
| UPSWING restore at 2027-06-30 and continue | 2027-01-04–2027-12-31 | `T-0078-recovery-seed-1` | 255,408.325 ms | `bdb8c1b38eb9ea3ffeb20fc3a94954a731766f9ae384e0960ebc20dd5dc00c4b` | PASS; equals baseline |

Both runs cover 362 calendar dates, 12 macro periods, 1,415 run events, one completed work order, one scenario invoice and one receipt. The midyear save envelope preserves complete run and finance state hashes before continuation. The harness also checks final envelope round-trip and replay idempotence for accepted invoice and receipt input.

The recovery envelope rejects six negative cases: unsupported save version, duplicate run event ID, negative material quantity, cross-run finance state, duplicate invoice ID and duplicate payment event ID. Each rejected candidate remains byte-for-byte unchanged; the original valid envelope also remains unchanged. Valid envelope restoration succeeds.

## Narrow guard

The recovery test exposed that the existing restore path accepted a duplicated invoice row. `prototype/v3/run.js` now rejects repeated nonempty invoice IDs before reconciliation or cloning. It does not deduplicate or repair the save. This guard changes envelope integrity validation only; it does not change invoice, payment, tax, or simulation behavior.

## Test commands

- `node --check prototype/v3/run.js` — PASS
- `node --check prototype/v3-t0078-recovery-smoke.mjs` — PASS
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=UPSWING --mode=baseline` — PASS, within 360 s
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=UPSWING --mode=recovery` — PASS, within 360 s; `SAME-END-HASH` emitted
- `git diff --check -- prototype/v3/run.js prototype/v3-t0078-recovery-smoke.mjs prototype/v3-t0078-recovery-baselines.json` — PASS

Baseline fixture JSON: `prototype/v3-t0078-recovery-baselines.json`, SHA-256 `DD85588B77C372B1A103CC425507CBA5C6BB22B5BD28CB0A85E89AD42978EC3B`.

## Gates and limits

- UPSWING annual uninterrupted baseline and midyear restore/continue: **PASS**.
- BOOM, DOWNTURN, LOW baseline + restore/continue: **OPEN / not run**.
- Negative-envelope fail-closed and valid-envelope recovery for UPSWING: **PASS**.
- A09 independent recovery review: **not run**.
- Browser/device check: **not run**.
- Commit/push verification: **not run**.

The runtime leaves practical headroom within the 360-second per-run cap for the other profiles, but their completion is unproven. T-0078 must remain open until each required profile has a matching uninterrupted end hash and restore/continue end hash and A09 independently reviews the evidence.