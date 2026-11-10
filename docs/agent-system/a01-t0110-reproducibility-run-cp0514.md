# A01 – T-0110 reproducibility run report (CP-0514)

**Status:** gezielte Regressionen erneut ausgeführt und bestanden; Browser-T-0109 weiter ohne UI-PASS.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.4 / SLG-002.5; T-0065/66/67/69, T-0109/0110
**Checkout:** `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; main / `fdc4960d4bf92fb13f6802e8d0738eb3d9110097`; 2026-11-07.

## Exakte Befehle und heutige Ausgaben

Alle Befehle liefen aus der Repositorywurzel:

| Befehl | Exit | Tatsächliche Ausgabe |
|---|---:|---|
| `node prototype/v3/a05-t0065-market-ui-regressions.mjs` | 0 | `A05 T-0065 market UI regressions: PASS` |
| `node prototype/v3/a05-t0066-product-ui-regressions.mjs` | 0 | `A05 T-0066 product UI regressions: PASS (offer snapshot, reserved stock, explicit product dispatch, plan/actual labels)` |
| `node prototype/v3/a05-t0067-regressions.mjs` | 0 | `A05 T-0067 finance UI contract/regressions: PASS` |
| `node prototype/v3/a05-v3-run-module-graph-cache.mjs` | 0 | no stdout; exit 0 |
| `node prototype/v3/a07-t0109-inquiry-practice-regressions.mjs` | 0 | `PASS: T-0109 inquiry practice, feedback, eligibility, state/finance invariance and save/restore separation` |
| `node --check prototype/v3/run.js` | 0 | no stdout; exit 0 |
| `node prototype/v3-t0075-annual-order-product-flow-smoke.mjs` | 0 | JSON-Zusammenfassung direkt darunter; A03/A09-Review PASS für G5/Finanzgrenze |
| `node prototype/v3-finance-ledger-projection-regressions.mjs` | 0 | `V3 finance ledger projection and shared-run month-boundary integration: PASS (customer-only scope).` |
| `git diff --check` | 0 | no whitespace error; only LF→CRLF notices |

## T-0075 Jahreslauf – tatsächliche Ausgabewerte

```text
status: PASS
periodCount: 12 (2027-01 bis 2027-12)
startDate: 2027-01-04
endDate: 2027-12-31
customerOrders: 12 (alle accepted_non_posting)
ownProductBuyerDecisions: 6 accepted, 6 rejected
ownProductDispatches: 6
resourceConflict: true
midyearRestore.passed: true
midyearRestore.sha256: 0c552e9f1dd418d850789fc1247b91e7db223683d20cebd4f874666191a3c1a
pendingFinance: true
bab: deferred / no BAB calculation
replayRestoreTampering: PASS
stateSha256: 9cf22a5dd33b9025f83a215ca645bc898b5ea4591814cc298b91b507b4316c7f
```
## Source hashes at the rerun

- market UI regression `C296A37EB1CE1116004F75ABE93438C0606DD4EF01E242D86C3429E9F7DC5269`
- product UI regression `FF7803220C2ABC0F8EAAD3960ECE8F9A97878589627D5E1A1B86A9FE8B87BC6B`
- BAB UI regression `4F76E3721E6036DFF434E2FB479848CAC6F927002C5870D33BF4011916628271`
- cachegraph generator `ECD1A707B072EE1827236F9C14E8AE76FAD612EE2977AA4D395B1BFC972BAD0E`
- T-0109 regression `E124F7DA562C8F716C6CB22BCAC162CC8E9EE539706D442CD369FA9A8FB43ACA`
- annual harness `2FEA2D86830EDA1FC38DFEEB8B7ACE3D47E04EE7A6EBED6C8C231750B1372579`
- ledger projection regression `B55D0AA3CA0CCA0C2AE7E83DA7CC7E36B4CC6BFB9E550D90FE79B28F38587C96`
- `prototype/v3/run.js` `1E13164BD294671BD4206DF30233FA9B080375D274EB7C7883F9CA94B892AE5E`

SHA verification: `Get-FileHash -Algorithm SHA256 <path>`.

## Limits

These are automated/engine/UI-DOM regressions, not a live T-0109 browser interaction. A05 found the run.js handlers and localStorage key consistent; actual click/save/reload/re-render remains unproved because browser automation refused to act while the current Edge URL could not be securely determined. The T-0077 projection is customer-only and is not a full annual ledger reconciliation. No device test, commit, push, posting approval or release check is implied.