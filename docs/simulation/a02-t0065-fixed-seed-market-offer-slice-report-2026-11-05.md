# A02 – T-0065 fixed-seed market/offer slice

**Status:** Implemented bounded A02 engine/test slice; T-0065 remains open pending A05 profile/UI adoption, A03 alignment of specific test vectors where needed, and independent A09 review.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal:** MG-002 / SLG-002.2
**Ticket:** T-0065 (market offer gates; related finance alignment T-0067)
**Date:** 2026-11-05

## Preflight and boundaries

Reverified branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, and supplied control-plane hashes. The checkout already contained extensive local edits and untracked files; none were discarded. CP-0500 and MCP-2026110401 were not edited. Scope was limited to the A02 market engine, its regression file, and this report. No UI, schema, ledger, finance mutation, commit, or push.

## Work and evidence

- The market engine already ranked invitations by explicit synthetic reputation, capacity, and segment fit; hid individual competitor prices; supported 3–5 calendar-day inquiry windows; used a frozen A03 snapshot for submitted offers; and evaluated submitted prices alongside reputation and segment fit for customer award.
- Added an optional explicit `price` weight to the invitation profile. In profiles that opt in, invitation rank uses capacity, reputation, segment fit, and a price score. Competitor price comes only from their explicit synthetic size-class price. The player has no quote at invitation time, so the test profile uses the customer reference price as a neutral estimate. Legacy three-weight profiles remain accepted and unchanged.
- Added a controlled price-pair regression: fixed all inputs except competitor B's synthetic small-order price; near-reference pricing made B eligible, while the higher price removed B at the configured invitation threshold. The fixture uses weights `capacity=.2, reputation=.2, segmentFit=.2, price=.4` and is not an empirical calibration. Existing capability/capacity eligibility checks still apply.
- Added deterministic same-seed checks that competitor response delays lie between 1 and 3 calendar days and inquiries remain open between 3 and 5 days.
- Added accepted offer cases at +4,000 cents and −2,000 cents DB-I. Each is calculated through the A03 calculator, copied into a frozen offer snapshot, accepted by the market path, and checked for unchanged price, signed DB-I, and full snapshot equality. No posting or finance state mutation occurs.

## Verification

- `node --check prototype/v3-market-simulation.js` — PASS.
- `node --check prototype/v3-market-simulation-regressions.mjs` — PASS.
- `node prototype/v3-market-simulation-regressions.mjs` — PASS.
- `node prototype/v3-financial-calculation-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0065-market-ui-regressions.mjs` — PASS (legacy profile compatibility only; not UI price-weight adoption).
- Targeted `git diff --check` for the two A02 code files — PASS.

## Limits and handoff

The shared run/UI fixture still uses the legacy three-weight invitation profile; this bounded A02 change does not opt the product UI into price-weighted invitation ranking. A05 must decide/implement profile/UI consumption in its separately authorized scope. Invitation price weights and fixture coefficients are synthetic model inputs, not market evidence. The customer-award formula already considers the submitted net price. No broad market calibration, customer behavior calibration, browser test, or yearly replay was performed. A09 independent review remains outstanding.

**Next addressed agent:** A05 – adopt or explicitly defer the optional price invitation weight in the shared UI/run profile and verify displayed eligibility without exposing individual competitor bids. Then A09 independently reviews determinism, invitation-pair behavior, response/expiry timing, and DB-I snapshot binding. A01 retains ticket status control.

**Roles:** Author/execution A02; A03 finance review for these new test cases not separately requested/performed; independent QA A09 not performed; browser/device test not performed; Git/commit verification not performed.
