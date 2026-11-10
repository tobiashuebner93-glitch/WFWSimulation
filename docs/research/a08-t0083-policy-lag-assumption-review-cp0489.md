# A08 – T-0083 policy-lag assumptions and provenance review

**Status:** PASS within the source/assumption review scope  
**Addressed to:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Ticket:** T-0083 / T-0063 G8  
**Basis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; A02 report SHA-256 `7603E11860C80651C019BFACE699D56DCAB52062D48B4F28A83D44FE58CBB0A3`

## Review result

The eight policy channels are explicitly distinguished in the regression from observed facts, legal requirements, and product defaults. Seven non-monetary channels (`fiscal`, `growth`, `tariff`, `labor_market`, `environmental`, `demand_oriented`, `supply_oriented`) receive synthetic inputs from a named test fixture. Each carries a test `sourceRef`/fixture identity, scenario/run identity, fixed seed, `observedPeriod`, `effectiveFrom`, and `parameterSetId`/test identifier. The monetary channel reuses the separately identified synthetic T-0071 MRO fixture. The fixture records channel, effect-group ID, period, and lag in the projected event.

The one-month lag is expressly a **regression-only synthetic setting** (`T0083-policy-lag-test-only-v1`, and for monetary policy the existing T-0071 test fixture). It is not a calibrated empirical result, general economic fact, legal rule, or new V3 product default. This interpretation is consistent with the project’s existing macro source foundation: transmission effects have variable and uncertain delays, while numerical scenario lags and business effects require labeled assumptions. The test does not claim that real measures produce an effect after exactly one month.

The code checks no contribution before the effective month, one contribution in the effective month, and no duplicate effect after replay/restore. It also asserts that these planning indicators do not mutate the finance state or post directly to the ledger. I found no claim in the test/report that the scenario deltas are observed market outcomes or statutory effects.

## Boundary and caveat

This PASS covers source/assumption labeling and the regression’s limited attribution claims. The test assigns separate effect groups to each of the seven synthetic channels. It does **not** establish that real fiscal, demand, labor, environmental, growth, or tariff measures are economically independent. A single real-world measure that affects multiple channels must use a shared measure identity/effect-group or equivalent attribution rule so its contribution is not double-counted. This suite does not test cross-channel interaction or deduplication for such a shared measure. No lag value or product behavior is proposed by this review.

## Preflight and scope

The supplied HEAD matched. Six supplied governance hashes matched. The decision-log hash returned by `Get-FileHash` in this review differed from the supplied digest, and `git status --short` could not run in this agent environment (`fatal: this operation must be run in a work tree`); I therefore cannot independently confirm the supplied status count of 535. No repository content was changed by the review except this report. No extra internet source was needed: the project source foundation already documents the distinction between institutional evidence and scenario assumptions and the uncertainty of transmission lags.

This is not the separate A09 technical QA and does not close T-0083 or T-0063 G8. No code, simulation defaults, ticket state, or decision-log entry was changed. No commit or push.
