# A02 – T-0077 / T-0069 G7: Procurement-Finance-Handoff

**Status:** NONPASS – operative procurement can evidence order and physical receipt, but no supplier invoice/AP or actual payment/bank-outflow source pair exists.

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goal/Tickets:** MG-002 / SLG-002.2 / T-0077 / T-0069 G7  
**Preflight:** 2026-11-05; `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Seven supplied Control-Plane digests matched. Existing worktree changes preserved.

## Befund

The operative shared-run procurement path exposes `placeV3RunInternationalMaterialOrder` and `receiveV3RunInternationalMaterialShipment` in `prototype/v3-run-orchestrator.js`. The order event binds an `orderId`, shipment/material/quantity, source and ETA; the receipt event binds shipment/order/material/quantity and actual receipt date. The run validator checks order/shipment/receipt identities and quantity movement, and the calls are idempotent against duplicate source references.

These are physical/non-posting events. They do not carry a supplier invoice identifier, payable amount, currency, due date, open-item reference, executed-payment identifier, payment date, or bank-account evidence. `prototype/v3-finance-runtime.js` has no supplier AP or supplier-payment event handler. The existing A03 gap assessments likewise state that an inventory receipt cannot establish an invoice amount or bank payment.

Therefore there is no honest smallest reproducible invoice/payment source-event pair in the current engine. No amounts, dates, supplier obligations, or cash movements are inferred here.

## Minimal A02 → A03 handoff

A02 can provide the operational provenance only after an order has a supplier and an accepted, explicit price/contract snapshot:

1. **Purchase/order source:** stable order and supplier IDs; accepted quote/contract ref; line/material IDs and quantities; unit price/line total as supplied by that snapshot; currency; order date; contractual payment terms; immutable payload fingerprint.
2. **Receipt source:** stable receipt/shipment ID; referenced order and line IDs; received quantities; actual receipt date; source event ID; dedupe key. The current physical receipt already covers most of this but lacks financial source data.
3. **Supplier invoice source (A03-owned financial event):** invoice ID, supplier ID, purchase/receipt refs, invoice date, due date, explicit amount/currency/tax status as evidenced by the invoice, and stable AP open-item/source reference. Do not derive an invoice from physical receipt alone.
4. **Executed payment source (A03-owned financial event):** payment ID, invoice/AP reference, actual payment date and amount/currency, payer account/bank reference, and stable source ID. A scheduled or simulated payment requires an explicit authorized scenario rule; it is not produced by the current A02 receipt path.

The above is a handoff contract proposal for the next A01 assignment, not a schema or posting authorization. A03 must define/approve finance treatment and A09 independently review. A02 should implement only an explicitly assigned operational source event; no ledger or bank mutation is authorized by this report.

## Verification and limits

- Source inspection: `v3-run-orchestrator.js` procurement order/receipt functions and run-state validation; `v3-finance-runtime.js`; A03 T-0077 gap assessment and cross-period report.
- No regression or year run executed; no source code changed.
- No supplier invoice, amount, currency, payment, bank-outflow, or accounting event pair is evidenced.
- T-0077/G7 remains open; this does not close any T-0069 annual reconciliation criterion.

**Autor:** A02 – SIMULATION (source inspection and handoff definition)  
**Mitwirkende:** keine  
**Fachreview:** nicht ausgeführt (A03 erforderlich)  
**Unabhängige QA:** nicht ausgeführt (A09 erforderlich)  
**Browser-/Gerätetest:** nicht ausgeführt  
**Git-Verifikation:** Preflight ja; keine Änderungen nach Statusprüfung verifiziert  
**Nächster Adressat:** A01 zur Zuweisung der A03-Finanzschnittstelle; danach A02 nur für konkret beauftragte operative Belege.
