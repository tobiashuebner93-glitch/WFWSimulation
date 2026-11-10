# A03 – T-0077 Phase 1: read-only Kundenjournalprojektion

**Status:** PHASE-1-FIX-KANDIDAT; A09-Re-Review ausstehend. T-0077/G7 bleibt PARTIAL/OPEN.  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Branch/HEAD:** `main` / `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; kein Commit/Stage/Push.  
**Scope:** neue Projektion, fokussierte Regression und dieser Bericht. Keine Änderung an FinanceRuntime, Run-Adapter oder sonstigen Bestandsdateien.

## Ergebnis

Ergänzt wurde `prototype/v3-finance-ledger-projection.js`: ein deterministischer, read-only Journalprojekter für die bereits gespeicherten und durch die FinanceRuntime validierten D-0166 Kundenereignisse. Die Projektion verwendet ausschließlich die vorhandenen Werte aus `FinanceState` und bildet je D-0166-Pfad folgende balancierte Zeilen ab:

| Finance-Ereignis | Soll | Haben | Betrag |
|---|---|---|---:|
| `recognized-performance` | `trade_receivables` | `customer_revenue` | explizites Netto-R aus Performance |
| `scenario-invoice-issued` (D-0166) | `trade_receivables` | `simtax_payable` | explizite SimTAX-Komponente |
| `customer-payment` | `bank` | `trade_receivables` | explizit gespeicherter Zahlungseingang |

Die Rechnungszeile bucht keinen zweiten Erlös. Der Zahlungseingang reduziert keine SimTAX-Verbindlichkeit. Die Accountnamen sind Projektionslabels, kein genehmigter Kontenplan oder Posting-Vertrag. Jede erzeugte Zeile enthält stabile ID aus Run/Event/Seite, SourceRef, Event-ID, effektives Datum, `YYYY-MM`-Periode und Soll-/Haben-Cents. Zeilen sind nach Datum, Source-Event-ID und Zeilen-ID stabil sortiert.

Unbekannte oder fehlende `financeType`-Werte, nicht unterstützte Rechnungsarten, fehlende Process-Refs, inkonsistente D-0166-Beträge/-Referenzen, fehlende A03-Autorisierung und Abweichungen zur bestehenden Finance-Reconciliation brechen fail-closed ab. `asOfDate` ist inklusiv. Die Funktion verändert die Eingabe nicht und liefert ein tief eingefrorenes Ergebnis. Es gibt keine Posting-/Save-API.

Die Eröffnungsbank und aggregierte Eröffnungs-AR werden separat ausgewiesen. Für Eröffnungs-AR existieren im aktuellen State nur aggregierter Betrag und SourceRefs, keine belegten Einzel-OP-Events; deshalb werden dafür keine Journalzeilen erfunden. Die Projektion gleicht Bank, AR, SimTAX payable, Umsatzerlös, Zahlungseingänge und SimTAX accrual exakt gegen `reconcileV3Finance(state, asOfDate)` ab.

## Belege / Regression

Neue Regression: `prototype/v3-finance-ledger-projection-regressions.mjs`. Sie erzeugt einen validierten synthetischen A02-Run und lässt die vorhandene `recordV3ScenarioInvoiceFromCustomerEvidence`-Route eine D-0166-Rechnung erzeugen; der echte D-0168-Fälligkeitstag erzeugt danach die Zahlung. Die fixturegebundenen Modellwerte sind ausschließlich vorhandene D-0165/D-0166/D-0168-Szenariowerte, keine neue Finanzannahme.

Im Januar-Fixture vor Zahlung (Stand 20.01.2027) ergab die Kontrolle: Nettoerlös 90.000 Cent, Brutto-AR 107.100 Cent, Bank 100.000 Cent, SimTAX 17.100 Cent. Nach dem D-0168-Eingang am 21.01.2027: Erlös weiter 90.000 Cent, Kundenzahlung 107.100 Cent, AR 0 Cent, Bank 207.100 Cent und SimTAX payable weiter 17.100 Cent. In beiden Zuständen stimmen Soll und Haben centgenau; Save/Restore, as-of-Ausschluss, No-Mutation und unbekannter/fehlender Typ sowie Event-Tampering werden geprüft.

Ausgeführt, alle PASS:

- `node --check prototype/v3-finance-ledger-projection.js`
- `node --check prototype/v3-finance-ledger-projection-regressions.mjs`
- `node prototype/v3-finance-ledger-projection-regressions.mjs`
- `node prototype/v3-finance-runtime-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `git diff --check -- prototype/v3-finance-ledger-projection.js prototype/v3-finance-ledger-projection-regressions.mjs docs/accounting/a03-t0077-ledger-projection-phase1-report.md`

Zusätzlich zum Erststand bindet die Projektion jetzt jedes serialisierte Event an `processed[eventId].payloadHash`. Die FinanceRuntime-Fingerprints werden als kanonisch sortiertes JSON gespeichert; vor dem Vergleich entfernt die Projektion ausschließlich die vom FinanceRuntime-Append hinzugefügten Felder je unterstütztem Eventtyp. Alle übrigen gespeicherten Source-Felder bleiben fingerprint-gebunden. Die Regression serialisiert und restauriert einen Performance-State, mutiert koordiniert Event-Netto-/AR-/Betragsfelder und die zugehörigen Orderbeträge/AR; die Projektion weist den stale Source-Fingerprint fail-closed ab. Eine zweite Regression baut einen FinanceState mit zwei getrennten Zahlungsevents aber derselben `paymentId` und konsistentem Event-Payload-Fingerprint; die Projektion weist die doppelte ID ab.

Der vorherige unabhängige A09-Bericht (`docs/agent-system/a09-t0077-ledger-projection-independent-review-cp0477.md`) war für diese zwei Punkte **NONPASS**. Die genannten Fix-Regressionen bestehen nun; dies ersetzt keinen A09-Re-Review. Kein Jahreslauf. A02-Integrationsreview bleibt offen. Phase 1 ist nur ein Kandidat zur erneuten unabhängigen Prüfung; keine übergeordnete Gatebewertung wird geändert.

## Preflight

Gelesen wurden CP-0478 sowie die sieben Control-Plane-Dateien. Branch und HEAD entsprechen dem erwarteten Ausgangspunkt. Alle sieben Kontrollhashes stimmen mit dem CP-0478-Preflight überein:

| Quelle | CP-0478 erwartet | Aktuell |
|---|---|---|
| `AGENTS.md` | `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556` | gleich |
| `agent-structure.md` | `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3EE` | gleich |
| `agent-rights-matrix.md` | `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE` | gleich |
| `goals.md` | `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D` | gleich |
| `ticket-board.md` | `5A5EEB188DC3E2092AF01E5FC13F11439BA241F985BA4479982CCA8084C68FD4` | gleich |
| `collaboration-state.md` | `3687A0DD8E05206E8D3C06FB80603794DB809BF6B95677EAA89E39588B67D7AA` | gleich |
| `decision-log.md` | `1EA4649C21FCC505BD4A9931CB7B9C16656A0A9F2BB88DF07E3460ADAACEB` | `1EA4649C21FCC505BD4A9931CB7B9C16656A0A9F2BB88DF07E3460ADAACEB` |

CP-0478 reports 467 status entries at its checkpoint; this follow-up preflight observed 581 status entries while parallel local work continued. Branch/HEAD stayed `main` / `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. The previously created three T-0077 paths are the only files changed by these T-0077 packages; this follow-up edited only the projection module, its regression, and this report. All pre-existing worktree changes remain untouched.

## Grenzen und G7-Restumfang

Dies ist ein Kunden-Teilpfad, kein vollständiges Hauptbuch und kein T-0077-PASS. Die Projektion deckt keine eigenen Supplier-/AP-Rechnungen oder -Zahlungen, Payroll, Steuerabführung, Bankauszüge/-gebühren, Kredit/Dispo, COGS, Bestandsbewertung, Gutschriften/Stornos, fremde Währungen, genehmigten Kontenplan oder vollständige Monats-/Jahresabschlüsse ab. Diese fehlenden Quell-Events und fachlichen Freigaben sind nicht durch Nullwerte oder künstliche Gegenbuchungen ersetzt.

Die aktuelle Zahlungsautorität wird indirekt durch die persistierte Payment-Event-Validierung, den D-0166 Invoice-/Order-Bezug und `processed[eventId].financeRef` gebunden; der bestehende Payment-Eventtyp enthält keine separate A03-Authorization-Substruktur. Die Projektion erfindet dafür keine nachträgliche Autorisierung. Ein expliziter FinanceEvent-zu-Journal-/Kontenvertrag und A02/A09-Prüfung sind weitere Abhängigkeiten.

**Nächste Abhängigkeiten:** A01 beauftragt A02 mit Integration-/Source-Review und A09 mit unabhängiger adversarialer Prüfung (inklusive Tampering, Cutoff und gemischter Eventreihenfolge). Danach kann A01 entscheiden, ob der Slice in einen freigegebenen Journalvertrag überführt wird. AP/Bank, Payroll, Tax remittance, Credit/overdraft und COGS/stock valuation bleiben separate Evidenz- und Autorisierungspakete.
