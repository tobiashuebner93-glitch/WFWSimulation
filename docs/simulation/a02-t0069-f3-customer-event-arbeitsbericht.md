# A02 – D-0157 F3 customer event in V3 run

**Status:** Implemented within the scoped simulation rule  
**Addressed to:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goal:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Profile/decisions:** V3 run, start 2027-01-04; D-0011, D-0157, D-0161; CP-0312 and CP-0313 (draft).

## Preflight and rule scope

Reviewed root AGENTS.md, agent structure and rights matrix, MG-002 goals, ticket board, collaboration state, Decision Log, T-0069 run choreography, finance handoff/blocker and runtime reports, legal register and A08 T-0069 source review, CP-0312, and current repository status. CP-0313 was identified as a draft created by A01. Existing local work was preserved.

D-0157 keeps the five-working-day F3 period and requires its automatic consequence to be logged as a customer-side simulation event. The simulation specification says the delivery day is excluded and counting starts on the next day. The legal register requires displaying this as a game event; it is not a universal BGB acceptance rule or legal fiction. The T-0069 choreography’s earlier statement that there is no automatic F3 rule conflicts with these later approved records and should be reconciled by A01 in a new governance update; no governance file or checkpoint was edited by A02.

## Implementation

At close of the fifth following Monday-to-Friday workday, the run now emits a deterministic accepted customer-side event if the delivery has no earlier customer/recipient decision. Saturday and Sunday do not count; the D-0011 core V3 calendar does not apply public-holiday exclusions. If an explicit customer rejection/acceptance is already recorded, it suppresses the F3 event. For a distinct contractual recipient, the automatic event uses that named recipient and the contract-bound authority references. The event is identified as a D-0157 F3 scenario event and appears with that label in the run event history.

A customer acceptance or rejection recorded through the existing customer-side event API on or before the deadline suppresses the automatic acceptance; the fifth workday remains open for that customer event until day close. The V3 shared-run calendar helper counts Monday through Friday and excludes weekends; this implementation follows that current run calendar and does not apply a holiday list. The event does not mutate the work plan, inventory, cash, ledger or finance handoff. Finance remains pending/non-posting; no invoice or payment is inferred. There is no seller-side accept/reject button or manual F3 trigger. The runtime still does not authenticate external authority cryptographically; it validates structural linkage in the local simulation state.

## Files and verification

- prototype/v3-run-orchestrator.js
- prototype/v3/run.js
- prototype/v3-run-orchestrator-regressions.mjs
- This report: docs/simulation/a02-t0069-f3-customer-event-arbeitsbericht.md

PASS:
- node --check prototype/v3-run-orchestrator.js
- node --check prototype/v3/run.js
- node prototype/v3-run-orchestrator-regressions.mjs
- node prototype/a05-t0069-run-ui-regressions.mjs
- git diff --check for the changed tracked scope (no whitespace errors reported)

The new five-day regression covers the excluded delivery date, weekend exclusion, no decision before day five or before phase 6, customer actor attribution, event replay, seller-role rejection, and non-posting finance/inventory. Existing UI regression confirms there is no seller acceptance/rejection control and passed with the added event-history label.

## Reviews and remaining work

- A02 implementation/self-review: PASS for the simulation scope.
- A03 review: not run for this change; no Finance semantics or API changed.
- Independent A09 review: not run; A01 should assign the focused re-review.
- Browser/device test: not run after this change.
- Git: existing local modifications preserved; no commit or push.

T-0069 remains open for independent QA, live browser/year reconciliation, finance integration gaps, and reconciliation of the contradictory T-0069 choreography text. No new user decision was required for the scoped D-0157 simulation event.

## A02-Folgehärtung nach CP-0314

Die T-0069-Choreografie wurde mit D-0157 und der implementierten Phase-6-F3-Spielregel abgeglichen. Sie beschreibt jetzt das Ereignis nach fünf folgenden Arbeitstagen, die vorrangige explizite Kundenentscheidung bis zum Tagesabschluss, die kunden-/empfängerseitige Zuschreibung und die Nichtbuchungsgrenze. Die Darstellung behauptet keine allgemeine Rechtsfolge.

Zusätzliche Regressionen prüfen JSON-Export/Restore der automatischen Kundenentscheidung und F3 mit vertraglich bevollmächtigtem Alternativempfänger. Eine falsche Authority-Referenz wird abgewiesen; fehlende Authority bleibt bereits durch die vorhandene Plan-/Decision-Prüfung gesperrt. Die Produktlogik wurde nicht geändert.
