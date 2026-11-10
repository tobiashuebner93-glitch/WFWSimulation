# A03 – T-0075 Drei-Monats-Kunden-/Produktfluss: Finanzgrenzenreview (CP-0485)

**Befund:** PASS ausschließlich für die Finanz-Nichtbuchungsgrenze dieses Smoke-Slices  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Scope:** A02 Shared-Run-Fixture Januar–März 2027; keine Gesamt-G5-/Jahres- oder G7-Abnahme  
**Branch/HEAD:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; 504 Statuszeilen beim Review; lokale Änderungen erhalten  
**Prüfart:** Read-only Quell-/Berichtreview; keine Tests, kein Status-/Governancewechsel

## Ergebnis

Die drei Monatsläufe halten Kunden- und Produktumsatz als `pending_non_posting`; Eigenprodukt-COGS bleibt `pending_deferred_bab`. Die Fixture prüft ausdrücklich, dass Eigenproduktverkäufe keinen `cogsCents`-Wert erhalten, der Run kein `ledger`- oder `cash`-Feld enthält und die Finanzhandoffs der Kundenaufträge pending bleiben. Die im Angebot/Produktverkauf enthaltenen Centwerte sind Plan-/Angebots-Snapshots, nicht gebuchte Erlöse oder Zahlungsbeträge. Es wird keine BAB-Berechnung, Steuerbuchung oder Geldbewertung des Bestands abgeleitet.

Der Finanzstatus ist sachgerecht von operativen und physischen Ereignissen getrennt:

- **Kundenauftrag:** Angebot und Kundenannahme erzeugen den Arbeitsauftrag; Planung/Fertigstellung, Lieferung und gesonderte Entscheidung des benannten Kunden dokumentieren den operativen Leistungspfad. Die Acceptance-Entscheidung weist `pending_non_posting` aus. `getV3RunCustomerEvidence` liefert `invoiceEvent: null` und `paymentEvent: null` und erklärt, dass die Evidence weder Leistung im Rechnungslegungssinn noch Rechnungsfähigkeit, Betrag/Steuer, Fälligkeit, Zahlung oder Posting bestimmt. Damit wird Kundenabnahme nicht fälschlich als Rechnung oder Zahlung behandelt.
- **Eigenprodukt:** Produktfertigung baut physische Fertigmenge auf. Käuferentscheidung ist getrennt von Kundenauftragsannahme; nur angenommene Verkäufe werden physisch versandt. Die abgelehnte Einheit verbleibt im Fertigbestand. Die Regression bindet Endmenge und Versandbewegungen an den Zustand. Diese Bestandsbewegung hat keine monetäre Bewertung.
- **Planwerte:** `netPriceCents`, direkte Kosten und DB-I aus Kalkulationssnapshots bleiben Angebots-/Planinformationen. `babVersion: pending_deferred_bab` und `cogsStatus: pending_deferred_bab` verhindern eine unbelegte BAB-/COGS-Aussage.

**PASS gilt eng** für: keine falsche Cash-/Erlös-/Ledgerbuchung aus Angebot, Annahme, Kundenabnahme, Käuferentscheidung oder Warenversand; korrekte Abgrenzung der physischen Menge; explizit pending BAB/COGS. Kein FinanceRuntime-/Ledgerabgleich wurde in diesem Slice beansprucht. Der Drei-Monats-Bericht und CP-0485 lassen Jahresstabilität, UI/Browser und formale Gatebindung offen.

## Belege

- `docs/simulation/a02-t0069-monthly-order-product-flow-report.md`: Januar bis März 2027 in einem Shared Run; Kundenumsatz/Produktumsatz pending, Produkt-COGS pending; keine Buchung, kein Cash-/Ledgerfeld, keine BAB-Rechnung.
- `prototype/v3-t0069-monthly-order-product-flow-smoke.mjs`: prüft je Monat Pending-Status für Kundenhandoffs, getrennte Käuferentscheidung und Versand, Mengenendbestand, `cogsStatus`, Abwesenheit von `cogsCents`, `ledger` und `cash`; prüft außerdem JSON-Restore/Replay und Tamper-Rejection.
- `prototype/v3-run-orchestrator.js`: `getV3RunCustomerEvidence` kennzeichnet Finance-Handoff als `pending_non_posting`, liefert keine Invoice-/Paymentevents und bestimmt ausdrücklich keine Rechnungs-/Postingentscheidung. Kundenannahme ist als nichtbuchender Status gespeichert.

Die im A02-Bericht genannten gezielten Smoke-, Orchestrator-, Markt- und Produktregressionen sind dort als PASS protokolliert; A03 hat sie in diesem Auftrag nicht erneut ausgeführt. Keine Aussage über einen Volljahreslauf oder ein vollständiges Rechnungswesen.

## Preflight

Die sieben durch A01 für CP-0485 vorgegebenen SHA-256-Werte von AGENTS, agent-structure, agent-rights-matrix, goals, ticket-board, collaboration-state und decision-log stimmten beim Lesen mit dem tatsächlichen Checkout überein. Branch und HEAD entsprachen der Vorgabe. CP-0485 dokumentiert 497 Statuszeilen vor seinem Checkpoint; beim Review waren es 504, was mit parallel fortgeschriebenen lokalen Änderungen vereinbar ist. Nur dieser neue Bericht wurde durch dieses Review angelegt. Kein Commit/Stage/Push.

**Fazit an A01:** Finance-Boundary PASS für den beschriebenen T-0075-Slice. Kein Erlös, Cash, COGS, BAB oder Ledger wird aus den operativen Mengen-/Entscheidungsereignissen erfunden. Diese enge Bewertung schließt weder T-0075 formal noch T-0069 G5/G7 oder einen Jahresabschluss.
