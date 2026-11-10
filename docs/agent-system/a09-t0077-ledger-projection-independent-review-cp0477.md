# A09 Unabhängige QA – T-0077 Finance-Ledgerprojektion Phase 1 (CP-0477)

**STATUS:** NONPASS für den Phase-1-Slice wegen nicht fail-closed abgesicherter mutierter Restore-/FinanceState-Payloads  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**GOAL/TICKET:** MG-002 / SLG-002.5 / T-0077 (T-0069 G7), Phase 1 read-only Kundenjournalprojektion  
**BASIS:** CP-0477; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**PREFLIGHT:** CP-0477-Control-Plane-Hashes und alle drei zugewiesenen Datei-SHA-256 geprüft; alle stimmen. Branch/HEAD stimmen. Vorhandener Status: 577 Zeilen; keine davon geändert.

## Befund

Die Projektion bildet die drei vorgesehenen D-0166-Kundenereignisse als ausgeglichene Soll-/Haben-Zeilen ab: Performance (Nettoerlös/AR), Rechnung (nur SimTAX/AR, kein zweiter Erlös), Kundenzahlung (Bank/AR). `asOfDate` ist inklusiv; Datum und `YYYY-MM` kommen aus dem Ereignisdatum. Zeilen werden stabil nach Datum, Source-Event-ID und Zeilen-ID sortiert. Eröffnungsbank und aggregierte Eröffnungs-AR bleiben separat. Die Ausgabe ist tief eingefroren; es gibt keine Posting-API. Die Regressionen belegen centgenaue Soll-/Haben-Gleichheit und Abgleich der projizierten Bank-, AR-, SimTAX- und Erlöswerte mit `reconcileV3Finance` in den zwei Fixture-Stichtagen.

**NONPASS-Grund:** In `prototype/v3-finance-ledger-projection.js:69–70` prüft die Projektion für jedes Event nur, dass `processed[eventId].financeRef === F-${eventId}` vorhanden ist. Der dort gespeicherte `processed[eventId].payloadHash` wird nicht gegen die Eventquelle validiert. Die verwendete `reconcileV3Finance` prüft nur FinanceState-Modellversion/Datum und berechnet Salden aus den übergebenen State-Arrays; sie validiert den gespeicherten Payload-Fingerprint nicht. Die Projektion enthält auch keine eigene vollständige FinanceState-/Restore-Validierung.

Damit prüft der vorhandene Tamper-Test nur eine isolierte Betragsänderung (`recognized-performance.amountCents += 1`), die an den korrespondierenden Order-Beträgen scheitert. Eine koordinierte Mutation eines JSON-restaurierten Performance-Events **und** der dazugehörigen `orders`-Beträge/Receivable-Felder kann diese Quervergleiche und die Reconciliation konsistent mitverändern; der stale Payload-Hash bleibt unbemerkt, weil er ignoriert wird. Dadurch kann der Projekter ein anderes, aus dem unveränderten Quellereignis nicht autorisiertes Journal ausgeben, statt fail-closed abzubrechen. Dieser koordinierte Angriff wurde nicht zusätzlich ausgeführt; der Befund folgt aus der geprüften Validierungskette und ist durch eine gezielte Tamper-Regression zu schließen.

Zusätzlicher enger Integritätspunkt: `paymentId` wird pro Zahlung als nichtleere ID verlangt (`...js:149`), aber die Projektion führt kein Set zur Eindeutigkeitsprüfung. Die FinanceRuntime verhindert doppelte `paymentId` beim Schreiben (`prototype/v3-finance-runtime.js:391`); bei rohen/restaurierten States verlässt sich die Projektion darauf, ohne die vollständige Writer-Validierung aufzurufen. Das sollte durch State-/Payloadvalidierung mit abgedeckt werden.

## Geprüfte Invarianten und Tests

Alle fokussierten Befehle bestanden:

- `node --check prototype/v3-finance-ledger-projection.js`
- `node --check prototype/v3-finance-ledger-projection-regressions.mjs`
- `node prototype/v3-finance-ledger-projection-regressions.mjs`
- `node prototype/v3-finance-runtime-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`

Die bestehende Projektion-Regression prüft unter anderem Nichtmutation, tief eingefrorene Ausgabe, Event-ID/SourceRef-Mindeststruktur, unsupported/fehlenden Typ, isoliertes Event-Betrags-Tampering, Cutoff (Zahlung 21.01. aus Sicht 20.01. ausgeschlossen), JSON-clone-Wiederholung und identische Reconciliation. Vor Zahlung am 20.01.2027: Erlös 90.000 ct, Brutto-AR 107.100 ct, Bank 100.000 ct, SimTAX 17.100 ct. Nach Eingang am 21.01.: Erlös weiter 90.000 ct, AR 0 ct, Bank 207.100 ct, SimTAX weiter 17.100 ct. Regressionen stimmen für diese Fälle.

Event- und SourceRef-Duplikate, falsche Run-Zuordnung, fehlende `processed`-FinanceRef, ungültige Daten, fehlende A03-Performance-/Invoice-Autorisierung, D-0166-Abweichungen, volle Bezahlung über Rechnungshöhe und Überläufe werden im Code fail-closed geprüft. Projektion selbst mutiert den A02-Run nicht; Regression bestätigt die Run-JSON-Unverändertheit beim Rechnungspfad. FinanceRuntime-Replay ist separat geprüft; die Projektion rechnet jedoch keine Restore-Autorisierung/Payloadintegrität nach.

## Scope / verbleibende Gates

NONPASS bezieht sich ausschließlich auf **Phase 1**: die read-only Projektion kann bei manipuliertem/restauriertem FinanceState nicht ausreichend belegen, dass die projizierten Events weiterhin den gespeicherten, autorisierten Eingaben entsprechen. A03/A02-Integration, Browserprüfung und Jahreslauf wurden nicht ausgeführt.

T-0077/G7 bleibt insgesamt offen. Diese Phase deckt keine Supplier-AP/-Zahlungen, Payroll, Steuerabführung, Bankauszüge/-gebühren, Kredit/Dispo, COGS, Bestandsbewertung, Gutschriften/Stornos, Fremdwährung, freigegebenen Kontenplan oder vollständige Monats-/Jahresbilanz ab. A02-Integrationsreview ist ebenfalls noch offen.

**NÄCHSTER SCHRITT:** A03 soll die Projektion an validierte/restored FinanceState-Eventpayloads binden oder eine vollständige Read-only State-Validierung vorschalten; ergänzend koordinierte Event-/Order-Tampering- und doppelte Payment-ID-Regressionen. Danach A09-Re-Review. Keine Codeänderungen, kein Jahreslauf, kein Stage/Commit/Push durch A09.
