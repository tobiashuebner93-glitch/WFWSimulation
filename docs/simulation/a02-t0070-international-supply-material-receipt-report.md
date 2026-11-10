# A02 T-0070 — International supply receipt implementation slice

**Status:** implementation slice; T-0070/G3 remains pending A03/A08/A09 review. This advances T-0076 only for physical material quantity receipts.

## Existing path and implementation

No procurement or material receipt API existed. `prototype/v3-macro-trade-impact.js` only projected an international shipment ETA and explicitly left physical receipt and quantity unchanged. The existing product module did contain material quantities, a customer/product work-order material sufficiency check, and consumption on operation completion.

Added an explicit synthetic order and receipt API in `prototype/v3-product-lifecycle.js`, plus shared-run actions in `prototype/v3-run-orchestrator.js`. Orders require a named synthetic fixture, source reference, material, quantity, baseline ETA, actual ETA, and explicit calendar-day lag. Orders do not add available stock. A due receipt adds quantity to the existing `modules.product.materials`; receipt movements and shared-run events are bound and validated. Duplicate orders with changed payloads fail; repeat receipt is idempotent. Save/restore validation reconciles opening quantity, receipts, and completed operation consumption.

The paired regression uses identical material-constrained product operations. With a neutral ETA the operation fails before receipt, then passes after receipt. With an explicit three-day synthetic delay it remains unavailable at the neutral ETA and passes only after the delayed receipt date. This is a game fixture assumption, not an empirical shipping-time estimate or market claim.

## Boundaries and follow-up

The shared-run API is implemented and regression-tested. No browser/UI controls invoke the order or receipt actions yet; A05 is the next integration owner if player-facing controls are required. The isolated product-state test verifies the existing sufficiency gate, while the orchestrator test verifies the in-run event, receipt, replay, and restore binding. Neither is a browser integration test.

The movement is quantity-only and marked non-posting pending a cost source. No supplier price, AP, cash, tax, COGS, inventory value, BAB, or ledger effect is created. T-0077 remains responsible for any later cost/finance mapping. This does not provide T-0076's full material movement journal/month-end reconciliation or broader inventory completion. Existing event history records receipts and operation quantities but not a complete material opening/receipt/consumption/adjustment/closing statement for every period.

The international supply receipt is a second operational external channel alongside delayed foreign-demand templates. The FX offer-plan preview remains informational. T-0070/G3 must remain open until A03, A08, and A09 review this slice; FX source/review and broader offer UI work remain separate.

## Verification

- `node prototype/v3-product-lifecycle-regressions.mjs` — PASS (neutral/delay pair, sufficiency gate, restore, idempotence, non-posting marker).
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS (shared-run order/receipt events, payload conflict, replay, restore validation, event tamper rejection).
- `node prototype/v3-macro-trade-impact-regressions.mjs` — PASS (adjacent external-channel regression).
- `git diff --check` on the four changed implementation/regression paths — PASS.

No annual smoke, stage, commit, or push was performed.
