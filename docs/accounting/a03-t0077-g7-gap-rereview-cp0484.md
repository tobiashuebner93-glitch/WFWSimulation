# A03 – T-0077/G7 Gap- und Mindestziel-Re-Review (CP-0484)

**Status:** PARTIAL / OPEN – Phase-1-Kundenprojektion belegt; integrierter G7-Jahresabgleich nicht belegt  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Basis:** CP-0484, MG-002 / SLG-002.2 / T-0069 G7 / T-0077  
**Repository:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende lokale Änderungen unangetastet  
**Prüfgrenze:** Read-only Fachreview, keine Tests und keine Produkt-/Governanceentscheidung

## Befund

T-0077 Phase 1 ist für den eng begrenzten Kundenpfad ausreichend belegt: A03s Projektion und A09s Re-Review dokumentieren PASS für deterministische, schreibgeschützte Journalzeilen aus autorisierten Leistungs-, D-0166-Rechnungs- und D-0168-Zahlungsereignissen, mit Soll=Haben, FinanceState-Abgleich, Save/Restore, Cutoff und Tamper-/Duplikatprüfungen. Das ist **kein** gebuchtes Hauptbuch und kein Jahresabschluss. CP-0484 selbst führt T-0077 weiterhin als offen und belegt den neuen Materialreceipt-Slice ausdrücklich als mengenbasiert ohne Finanzwirkung.

### Teilgates anhand der vorhandenen Belege

- **PASS, eng begrenzt:** Performance erzeugt einmal Nettoerlös/AR; die D-0166-Rechnung ergänzt ausschließlich SimTAX und Brutto-AR, ohne zweiten Erlös; Zahlung reduziert AR und erhöht Bank/Cash. A03- und A09-Berichte nennen Cent-genaue Eventbalance, Reconciliation und Restore/Tamper-Abdeckung.
- **PASS, eng begrenzt:** Quelle/Run-/Eventbezug, stabile Projektionszeilen, inklusive `asOfDate`-Grenze und Periode `YYYY-MM` aus dem wirksamen Ereignisdatum. Der Projekter mutiert nicht und besitzt keine Posting-API. Opening-AR ist nur aggregiert und wird ohne Einzel-OP-Evidence nicht journalisiert.
- **Nicht bestanden/nicht belegt als G7:** A02-Integration der Finanzprojektion in den Shared Run; vollständige Monats-/Jahresabstimmung; externe Zahlungen, Steuerabführung, Kontenplan und gesamtes Hauptbuch. A09s PASS bezieht sich ausdrücklich nur auf Phase 1.
- **T-0076-Bezug:** CP-0484 bestätigt physischen Materialeingang und mengenbasierten Verbrauch, zugleich aber ausdrücklich keinen Wert-, COGS-, AP- oder Ledger-Effekt. Diese Evidenz kann keine Finanzbuchung ersetzen.

## Integrierte Flüsse und Lücken

| Bereich | Tatsächlich belegt | Noch fehlend für G7 |
|---|---|---|
| Erlös/AR | Belegte Kundenleistung, genau eine Nettoerlös-/AR-Basis; D-0166-Steuer-/Brutto-AR-Ergänzung | allgemeine Faktura, OP-Einzelalterung/Eröffnungs-OP, Gutschriften und Storno |
| Kundenzahlung/Bank | D-0168-Zahlungseingang senkt AR und erhöht Bank; Opening-Bank und aggregiertes Opening-AR | Bankauszug-/Gebührenabgleich, weitere Bankbewegungen und eigene Zahlungen |
| Tax | SimTAX-Abgrenzung und Tax-AR/Payable ausschließlich für D-0166 | Steuerzahlung/Remittance, Steuerkonto-Roll-forward und Abschlussabgleich |
| Supplier/AP | kein AP-Ereignis oder Supplier-Zahlungspfad | belegte Lieferantenrechnung, AP-OP, tatsächlicher Bankabgang, Zuordnung und Replaykontrolle |
| Payroll | keine Payroll-Quelle oder Auszahlung | Lohn-/Abgabenereignisse und Zahlung; keine Beträge dürfen synthetisch ergänzt werden |
| Kredit/Dispo | keine Schuld-/Facility-/Zinsquelle; MRO-Indikatoren sind keine Finanzverträge | autorisierte Kredit-/Dispoaufnahme, Tilgung, Zins, Limit und Bankabstimmung |
| Bestand/WIP/COGS | physische Mengenereignisse; T-0076 Receipt bleibt `nonposting_pending_cost_source` | Geldbewertung von Material/WIP/Fertigware, freigegebener Istkostensatz/BAB und COGS; fehlende Beträge bleiben `pending` |
| Ledger/Periode | read-only Kundenjournalprojektion mit drei Eventarten und Monatslabel | freigegebener Konten-/Journalvertrag, Eröffnungsjournal, vollständige Kontenabstimmung sowie nachvollziehbarer Monats- und Jahresabschluss |
| A02-Bindung | A02-Run liefert Kunden-Evidence und nichtbuchenden Finance-Handoff; A03-Projektion liest FinanceState getrennt | kein belegter A02-Adapter, der Projektions-/Finanzereignisse als integrierte Finanzverarbeitung verantwortet; A02-Integrationsreview fehlt |

## Kontrollgleichungen und Perioden

Für die derzeit vorhandenen Kundenereignisse gelten je Stichtag `t`:

```text
AR_Closing(t) = AR_Opening + recognized_net_performance(<=t)
                + D0166_SimTAX_invoice_component(<=t)
                - customer_receipts(<=t)

Bank_Closing(t) = Bank_Opening + customer_receipts(<=t)

SimTAX_Payable_Closing(t) = SimTAX_Opening + D0166_SimTAX_accrual(<=t)

recognized_revenue(t) = recognized_net_performance(<=t)  # Rechnung bucht keinen zweiten Erlös
```

Diese Gleichungen sind auf den aktuell modellierten Fluss begrenzt. Für vollständige G7-Abnahme müssen mindestens zusätzlich gelten:

```text
AP_Closing(t) = AP_Opening + supplier_invoices(<=t) - supplier_payments(<=t)
Bank_Closing(t) = Bank_Opening + customer_receipts(<=t) - own_bank_payments(<=t)
                  + documented_financing_draws(<=t) - documented_repayments(<=t)
Tax_Closing(t) = Tax_Opening + tax_accruals(<=t) - tax_remittances(<=t)
Inventory/WIP/FG_Closing(t) = Opening + valued_receipts/production - valued_consumption/COGS
```

Jede einzelne Journalquelle muss zusätzlich `ΣSoll = ΣHaben` erfüllen; Nebenbuch-Salden müssen mit den jeweiligen Kontrollkonten übereinstimmen. Keine dieser Gleichungen erlaubt fehlende Werte als Null oder als erfundene Gegenbuchung anzunehmen. Für Periode `YYYY-MM` ist die Zuordnung nach dem belegten effektiven Leistungs-, Rechnungs- oder Zahlungs-/Remittance-Datum vorzunehmen; Stichtagsbestand ist der kumulierte Roll-forward bis Monatsende. Aktuell ist die A03-Kundenprojektion nur eine Monatszuordnung, kein nachgewiesener kompletter Periodenabschluss.

## Kleinstes sicheres Implementierungsziel

Kein Einzelslice kann die vorhandenen fehlenden Zahlungsarten und Bewertungsgrundlagen in einen G7-PASS umdeuten. Als nächster vertikaler Schritt ist der schon im Gap-Assessment vorgeschlagene **belegte Supplier-AP-/Bankzahlungsfluss** am kleinsten und überprüfbar:

1. A02 liefert unveränderliche Evidence für eine konkrete Lieferantenrechnung und die dazugehörige tatsächliche Zahlung: eindeutige Invoice-/Payment-ID, Run-/Supplier-/Order-Ref, SourceRef, Währung, Beleg- und effektive Daten, Betrag sowie OP-Zuordnung. Keine FinanceState-Saldenmutation aus dem Operationsereignis.
2. A03 verarbeitet diese Quellen fail-closed als AP- und Bank-Subledgerbewegungen; Dedupe, Replay/Restore und Monatsgrenze sind abgedeckt. Ohne freigegebene Gegenkontierung bleiben Aufwand, Materialwert, Tax und COGS `pending_non_posting`; weder BAB noch Kostenannahme wird eingeführt.
3. A02 muss die Source-/Run-Bindung reviewen; A03 muss Semantik und Kontrollen dokumentieren; A09 muss die Reconciliation unabhängig adversarial testen. Das ist ein Teilziel und weiterhin kein G7-PASS.

Zur G7-Abnahme sind danach dokumentierte Flüsse für Supplier/AP und eigene Zahlungen, Payroll, Steuerabführung, Bank/Dispo/Kredit sowie bewertete Bestands-/COGS-Bewegungen oder eine ausdrücklich zulässige `pending`-Abgrenzung erforderlich, plus autorisierter Journal-/Kontenvertrag und vollständiger Perioden-/Jahresabgleich. A01 sollte für jedes fehlende Ereignis einen belegten Source-Owner und Freigabepfad beauftragen, nicht Buchungssätze aus der Datenlücke ableiten.

## Belege und sichere Abnahmeprüfungen

Gelesene Nachweise: `docs/agent-system/checkpoints/CP-0484.md`, `docs/agent-system/a01-t0063-t0069-subticket-progress-cp0484.md`, `docs/accounting/a03-t0077-ledger-projection-phase1-report.md`, `docs/agent-system/a09-t0077-ledger-projection-rereview-cp0478.md`, `docs/accounting/a03-t0077-finance-reconciliation-gap-assessment.md`, `docs/accounting/a03-t0069-v3-finance-handoff-matrix.md`, `prototype/v3-finance-ledger-projection.js`, `prototype/v3-finance-runtime.js` sowie T-0077-Zeile in `docs/agent-system/a01-t0063-t0069-offene-gates-und-untertickets-cp0476.md`.

Für den nächsten AP-/Bank-Slice sind fokussiert erforderlich: `node --check` der geänderten Module; Projektions-, FinanceRuntime- und RunOrchestrator-Regressions; pro Event Soll=Haben, AP-/Bank-Roll-forward und Cutoff über Monatswechsel; Save/Restore identischer Hash; Replay idempotent; manipulierte Payloads, doppelte IDs, falsche Supplier-/Order-/OP-/Währungszuordnung, Zahlung vor Rechnung und Überzahlung fail-closed ohne Teilmutation. A02-Integrationsreview und A09 unabhängige Reviewberichte sind nötig. Für G7-Abnahme kommen Monats- und Jahresvektoren hinzu, die alle vorgesehenen Flüsse einschließlich Eröffnungs-/Schlussbeständen und Konto-Nebenbuchabgleich belegen. Diese Tests wurden in diesem read-only Auftrag nicht erneut ausgeführt.

**Fazit an A01:** Phase-1-Kundenprojektion PASS; Gesamt-T-0077/G7 bleibt PARTIAL/OPEN. CP-0484 fügt physische Mengen-, keine Finanzintegration hinzu. Kein Betrag ohne Laufquelle oder Buchungs-/Produktannahme wurde ergänzt. Keine Ticket-, Status- oder Governanceänderung vorgenommen.
