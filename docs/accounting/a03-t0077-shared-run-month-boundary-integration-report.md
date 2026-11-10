# A03 – T-0077 gemeinsamer Run-/Finanz-Monatsgrenzen-Test

**Status:** PASS für den ergänzten Kundenfluss-Integrationsslice; T-0077/G7 bleibt PARTIAL / OPEN
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Ticket:** T-0077 / T-0069 G7
**Preflight:** A01 meldete HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, 544 Status-Einträge und unveränderte sieben Governance-Hashes gemäß Übergabe.
**Scope:** Additive Regressionserweiterung; keine FinanceRuntime-, Run-, Schema-, Rechts-, Steuer-, Kredit- oder Produktregeländerung. Kein Commit/Push.

## Änderung

Erweitert wurde ausschließlich `prototype/v3-finance-ledger-projection-regressions.mjs`. Die vorhandene read-only Projektion `prototype/v3-finance-ledger-projection.js` blieb unverändert. Neue Regression führt den bereits belegten A02-Auftragspfad und seine D-0166-Rechnung in einem gemeinsamen Run bis zum 31.01.2027, sichert und restauriert Run- und Finance-State über die vorhandene `createRunSaveEnvelope`/`restoreRunSaveEnvelope`-API und projiziert den Januarabschluss. Anschließend läuft derselbe Run bis 28.02.2027; ein explizites, quellgebundenes Kundenzahlungsereignis aus der bestehenden `recordV3CustomerPayment`-API wird am 04.02. verarbeitet, dedupliziert, gemeinsam gesichert/restauriert und zum Februarabschluss projiziert.

Verwendet werden der bestehende Testauftrag und die bereits im Finance-Testfixture verwendeten Centwerte: Nettoerlös `90.000`, SimTAX `17.100`, Bruttoforderung/Zahlung `107.100`; Anfangsbank `100.000`. Das Februar-Zahlungsdatum ist eine explizite Testereignis-Eingabe der vorhandenen API, keine neue automatische Zahlungsregel. Es werden keine Supplier-, Payroll-, Steuerabführungs-, Kredit-/Dispo- oder sonstigen Auszahlungsereignisse erzeugt.

## Abgleich

- **Januar 31.01.2027 nach Save/Restore:** Bank `100.000`; Bruttoforderung `107.100`; Nettoerlös `90.000` genau einmal; SimTAX-Verbindlichkeit `17.100`; Soll = Haben. Keine Februar-Zeile erscheint im Januarabschluss.
- **Februar 28.02.2027 nach Save/Restore:** Bank `207.100`; offene Kundenforderung `0`; Kundeneingang `107.100` genau einmal; Nettoerlös bleibt `90.000`; SimTAX-Verbindlichkeit bleibt `17.100` (Zahlung führt sie nicht ab); Februarreceipt hat genau zwei Journalzeilen; Soll = Haben.
- Exakter Replay derselben Payment-Quelle ist No-op. Reprojektion ist deterministisch und mutiert den wiederhergestellten Finance-State nicht.
- Die bestehende separate Cutoff-Assertion bestätigt, dass eine am 04.02. gebuchte Zahlung im Januar-Stichtag nicht in Bank/AR eingeht.

Das ist ein gemeinsamer Run-/Finance-Test über zwei Monatsenden, kein 12-Monats-Finanzjahresabgleich und keine Persistenzintegration mit Browser-UI-Interaktion.

## Prüfungen

- `node --check prototype/v3-finance-ledger-projection-regressions.mjs` — PASS.
- `node prototype/v3-finance-ledger-projection-regressions.mjs` — PASS (`V3 finance ledger projection and shared-run month-boundary integration: PASS (customer-only scope).`).
- `node prototype/v3-finance-runtime-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `prototype/v3-finance-ledger-projection.js` unverändert; Projektionslogik selbst wird durch die Erweiterung nicht geändert.

## Weiter offene Finanzflüsse / API-Blocker

Der Gap-Bericht bleibt gültig. Es existieren keine belegten V3 Supplier-Invoice-/AP-Source-Events und keine Supplier-Payment-/Bankabgang-API. Ebenso fehlen Payroll-/Lohnzahlungs-, Steuerabführungs-, Bankgebühr-, Kredit-/Dispo-, sonstige eigene Zahlungs- sowie monetäre Bestands-/WIP-/Fertigwaren-/COGS-Events. Ohne diese Quellereignisse und freigegebene Gegenkontierung kann A03 keinen eigenen Zahlungsfluss oder vollständigen Soll/Haben-Jahresabgleich implementieren, ohne Beträge, Belege oder Regeln zu erfinden.

T-0077/G7 bleibt daher offen. Der kleinste nächste konkrete Schritt ist ein A02-Source-Contract/Implementierungsticket für eine tatsächlich belegte Supplier-Rechnung und Bankzahlung mit stabilen Refs, Beträgen, Datum/Währung und AP-Zuordnung; A03 ergänzt danach erst die freigegebene Kreditoren-/Bankjournalprojektion, A09 prüft sie unabhängig.
