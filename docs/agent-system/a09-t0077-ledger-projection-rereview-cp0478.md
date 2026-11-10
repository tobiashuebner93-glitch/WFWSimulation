# A09 Re-Review – T-0077 Phase-1 Kundenjournalprojektion (CP-0478)

**STATUS:** PASS für den Phase-1-Kandidaten (read-only Kundenjournalprojektion); kein T-0077/G7-Abschluss  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**GOAL/TICKET:** MG-002 / SLG-002.5 / T-0077 (T-0069 G7)  
**BASIS:** CP-0478; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**PREFLIGHT:** Alle sieben CP-0478-Control-Plane-Digests und die drei zugewiesenen Datei-SHA-256 stimmen. Branch/HEAD unverändert. Vorbestehender Checkout stark verändert; keine davon geändert.

## Vorherige Befunde erneut geprüft

1. **Payloadbindung nach JSON-Restore:** geschlossen. Für jede unterstützte Ereignisart rekonstruiert `storedSourcePayload()` den ursprünglichen FinanceRuntime-Input, indem nur die vom Writer ergänzten Felder entfernt werden. Der kanonische JSON-Fingerprint muss `processed[eventId].payloadHash` entsprechen; der `financeRef` wird zusätzlich geprüft. Die Regression mutiert nach JSON-Restore gemeinsam Performance-Netto-/AR-/Betragsfelder und die zugehörigen Orderbeträge/-AR. Der alte koordinierte Angriff scheitert jetzt am stale Source-Fingerprint.
2. **Payment-ID-Duplikat:** geschlossen. Die Projektion führt ein `paymentIds`-Set und weist eine doppelte ID fail-closed ab. Die neue Regression verwendet zwei getrennte, sonst konsistent abgerechnete Zahlungsevents mit gleicher `paymentId`; erwarteter Fehler wird ausgelöst.
3. **Read-only-/Reconciliationgrenze:** bestätigt. Die Eingabe bleibt unverändert; die Ausgabe ist tief eingefroren. Die Journalzeilen sind je Event ausgeglichen und die Kontensummen werden gegen `reconcileV3Finance(state, asOfDate)` abgestimmt. Eröffnungs-AR bleibt ausdrücklich aggregiert außerhalb der Zeilen; es werden keine nicht belegten Einzelposten erzeugt.

## Geprüfte Beträge und Zeitsemantik

Für das bestehende Fixture am 20.01.2027: Nettoerlös 90.000 ct, Brutto-AR 107.100 ct, Bank 100.000 ct, SimTAX 17.100 ct. Nach Zahlungseingang am 21.01.: Erlös bleibt 90.000 ct, AR wird 0 ct, Bank 207.100 ct, SimTAX bleibt 17.100 ct. Soll/Haben stimmt centgenau; Rechnung erzeugt keinen zweiten Erlös und Kundenzahlung führt keine SimTAX ab.

Die Stichtagsgrenze ist inklusiv: die Zahlung vom 21.01. fehlt am 20.01. und erscheint am 21.01. Zeilen erhalten Eventdatum und daraus `YYYY-MM`-Periode; Sortierung ist stabil nach Datum, Source-Event-ID und Zeilen-ID. Event-ID-/SourceRef-Duplikate, unbekannte/fehlende Typen, falsche Run-Zuordnung, fehlende Process-Referenzen, ungültige Daten/Beträge, D-0166-Inkonsistenzen, ungebundene Autorisierung und überhöhte Zahlungen werden fail-closed behandelt. JSON-Clone/Restore ergibt dieselbe Projektion.

## Ausgeführte Prüfungen

Alle fokussierten Prüfungen bestanden:

- `node --check prototype/v3-finance-ledger-projection.js`
- `node --check prototype/v3-finance-ledger-projection-regressions.mjs`
- `node prototype/v3-finance-ledger-projection-regressions.mjs` – einschließlich koordinierter Restore-Tamper- und Duplicate-`paymentId`-Regression.
- `node prototype/v3-finance-runtime-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`

Keine Codeänderung durch A09, kein vollständiger Jahreslauf und keine Ticket-/Statusänderung.

## Abgrenzung

PASS gilt nur für diese read-only Phase-1-Kundenprojektion. **T-0077/G7 bleibt offen**: Phase 1 umfasst keine Supplier-AP/-Zahlungen, Payroll, Steuerabführung, Bankauszüge/-gebühren, Kredit/Dispo, COGS, Bestandsbewertung, Gutschriften/Stornos, Fremdwährungen, freigegebenen Kontenplan oder vollständige Monats-/Jahresabschlüsse. A02-Integrations-/Source-Review ist nicht Teil dieser A09-Re-Review und bleibt erforderlich. Der Projekter ist keine Posting-API und bestätigt keine vollständige Ledger-/Bilanzabstimmung.

**FACHREVIEW:** A03 Phase-1-Kandidat gelesen; A02-Integration nicht ausgeführt.  
**UNABHÄNGIGE QA:** PASS für T-0077 Phase 1 nach den oben gelisteten Prüfungen.  
**GIT:** read-only; bestehende parallele Änderungen erhalten. Kein Stage/Commit/Push.
