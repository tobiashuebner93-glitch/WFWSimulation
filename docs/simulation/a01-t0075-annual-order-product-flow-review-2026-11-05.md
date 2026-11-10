# A01 – T-0075 annual customer-order/product flow smoke

**Date:** 2026-11-05  
**Scope:** T-0075 / T-0069 G5, synthetic shared-run engine flow only.

## Result

`node prototype/v3-t0075-annual-order-product-flow-smoke.mjs` completed **PASS** for 2027-01-04 through 2027-12-31. One shared run processed all 12 monthly periods. Every month produced one customer inquiry/order, operational plan, completed operation, delivery and customer-side acceptance decision. The same run produced one own-product buyer decision per month; six accepted products were dispatched and six rejected offers remained in finished goods.

The fixture exercised a shared worker/machine capacity conflict and verified rejection without partial state mutation. At 2027-06-30, the run was JSON-saved, validated, restored and resumed with an identical state hash (`0c552ef9f1dd418d850789fc1247b91e7db223683d20cebd4f874666191a3c1a`). Year-end JSON validation, duplicate-event idempotency, tamper rejection and deterministic state hash also passed (`9cf22a5dd33b9025f83a215ca645bc898b5ea4591814cc298b91b507b4316c7f`). The annual test file SHA-256 is `2FEA2D86830EDA1FC38DFEEB8B7ACE3D47E04EE7A6EBED6C8C231750B1372579`; the tested market, lifecycle and orchestrator source hashes are `1597234BAE7CBD773F12C69802B88763B7A3B4702B70932E919093CC8DEFDAC2`, `CDCF71837FAA927970D25194DCDFA69D3D62FC0DC4146275E0533915D104DA9E` and `811516881188841006822F6D2FB48B407AD7E406DF8383A1178AB31A51AE61B0` respectively.

## Limits and gate status

This is an explicit synthetic, non-posting engine fixture. Customer and product finance handoffs remain `pending_non_posting`; BAB, actual COGS, tax, cash, AP/AR settlement and ledger are not calculated or claimed. It therefore does not replace T-0077's missing supplier invoice/payment source events, T-0067's BAB/finance gates, or T-0069's annual reconciliation.

A01 records the executable T-0075 G5 slice as passing on the current checkout. Independent A09 review and integration into the broader annual gate remain pending; no parent ticket is closed on this result alone. Browser-visible UI smoke was not part of this run.


## Additional focused regression pass (2026-11-05)

After the annual run, the current checkout passed `v3-market-simulation-regressions.mjs`, `v3-product-lifecycle-regressions.mjs`, `v3-product-costing-regressions.mjs`, `v3-run-orchestrator-regressions.mjs`, `v3/a05-t0066-product-ui-regressions.mjs` and `v3/a05-t0067-regressions.mjs`. One initial invocation used an incorrect T-0067 filename and returned MODULE_NOT_FOUND; the actual located file was then run and passed. This is not an implementation failure.


## T-0065 UI price-freeze assertion (2026-11-05)

A01 extended `prototype/v3/a05-t0065-market-ui-regressions.mjs` to isolate the accepted inquiry card and assert it retains the fixed contract price while containing no offer form, `netPrice` input or submit control. `node prototype/v3/a05-t0065-market-ui-regressions.mjs` passed; scoped `git diff --check` passed. This headless renderer/DOM-fixture assertion closes the local UI evidence gap for that behavior, subject to A09 re-review. It is not a visible browser test and does not close T-0065.
