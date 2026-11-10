# A02 – T-0066 Shared-Run-Minimalslice (2026-11-05)

**Status:** Reproducible two-product/customer-order regression exists and passes; no duplicate implementation added. T-0066 remains open pending A01 gate reconciliation and required UI/browser/final review evidence.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0066
**Preflight:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; control hashes matched the current preflight except ticket-board and collaboration-state had advanced since the earlier T-0065 digest. Current T-0066 criteria were reread from `docs/agent-system/a01-t0066-t0067-mindestziele.md`. Existing working-tree changes were preserved.

## Existing mixed-run evidence

The requested slice is already in `prototype/v3-run-orchestrator-regressions.mjs`, in the block beginning `Adversarial mixed Shared Run` (approximately lines 237–315). It starts from a fixed shared run with an accepted customer work order, adds two distinct own products (`mixed-positive`, `mixed-negative`), and uses the same person, machine, steel pool and finished-goods capacity.

Assertions cover:

- a customer operation that would overbook the shared employee/machine is rejected with no partial mutation;
- the positive and negative product cases retain opposite DB-I signs in their plan and frozen sale snapshots;
- customer operations and both product jobs consume one shared material pool and occupy one shared warehouse;
- both buyers accept the separate product offers, then dispatch removes only the products while customer goods remain stored;
- sale/dispatch leaves finance handoffs unchanged, COGS explicitly pending where BAB basis is deferred, and no ledger/posting surface is created;
- JSON-shaped restore validates the complete mixed state and retains product IDs, assignments, sale snapshots and deferred BAB status.

## Verification performed

- `node --check prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS (`V3 run orchestrator regressions: PASS`).
- `node --check prototype/v3-product-lifecycle.js` — PASS.
- `node prototype/v3-product-lifecycle-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0066-product-ui-regressions.mjs` — PASS.
- Scoped `git diff --check` on the mixed-run/product lifecycle paths — PASS.

No T-0066 code was changed in this follow-up; this confirms an existing regression after the T-0065 JSON-serialization correction. No annual run, browser session, commit or push was performed.

## Minimal gates and remaining work

The mixed fixture directly supports G1, G5, G7 and parts of G8–G10. The separate lifecycle suite covers qualification, motivation, equipment, process order, capacity controls and restore/replay. The current criteria require these automated and independent reviews plus A05/A01 UI/browser evidence; the passing headless UI regression is not a visual browser test.

A documentation reconciliation is still needed: the latest coordination summary says T-0066 has open binary gates but does not enumerate them, while CP-0473 records A03 PASS for G7/G8/G10 and A09 PASS for G7–G10. A01 should compare those reviews with the current goal sheet and record a current 0/1 matrix before closing anything.

Potential product-scope mismatch for A01/A03 to decide: the shared-run regression's planning fixture calls `estimateV3ProductWithBab` and asserts positive/negative `resultAfterBabCents`, while the current T-0066 G7 wording is limited to DB I before BAB and the user's later scope defers full BAB/COGS. The actual product-sale snapshots in that same test correctly keep BAB/COGS deferred and do not create financial postings. This report does not change the test or infer a new rule.

**Next addressed owner:** A01 to reconcile binary gate statuses and decide whether the illustrative planning-BAB assertions are in scope; then A01/A05 run the visible browser path for two products plus customer order/dispatch. A03/A09 re-review only if the reconciliation identifies changed or unreviewed evidence.

**Roles:** A02 source/test inspection and execution; A03 review not performed in this slice; A09 fresh review not performed in this slice (existing review references above); A05 headless UI regression PASS; A01 visual browser test not performed; Git commit verification not performed.
