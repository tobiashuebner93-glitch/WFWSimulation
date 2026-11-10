# A09 Independent QA — T-0070 international material receipt slice (CP-0483)

**STATUS:** PASS for the narrow physical material receipt/consumption slice; no T-0070/G3 or full T-0076 PASS  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**GOALS/TICKETS:** MG-002 / SLG-002.2 / T-0070; T-0069 G6 physical inventory sub-slice  
**BASIS:** CP-0483; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; 492 status entries

## Preflight and reviewed evidence

Alle sieben CP-0483-Control-Digests und die vier vorgegebenen Produkt-/Shared-Run-Dateidigests stimmten. Der angegebene A02-Berichtsinhalt lag unter `docs/simulation/a02-t0070-international-supply-material-receipt-report.md` (SHA-256 `CB6FA5D20677CE5C1A90F2ADE018A1295B3510DA73EDFF6FC0FFC36377D8CF24`), nicht unter dem übergebenen Dateinamen mit `-cp0483`. Branch und HEAD stimmten; parallele Statusänderungen blieben unangetastet.

## Invarianten und Ausführung

Geprüft wurde der physische Mengenpfad. Die Order ist explizit synthetisch, referenziert ein vorhandenes Material und enthält Order-/Shipment-ID, Menge, Quelle, Baseline-ETA, ETA und Lag. Ihre Anlage erhöht den Bestand nicht. Receipt ist erst ab ETA zulässig und fügt am tatsächlichen `currentDate` eine eindeutige, periodisierte, nichtbuchende Bewegungszeile hinzu. Produktvalidatoren leiten den aktuellen Materialbestand aus `openingMaterials + received shipments − completed assignment consumption` her; Shared-Run-Validator bindet Bestellung und Receipt an Run-Event-IDs/-Zeitpunkte und ProductState-Run-ID.

Ausgeführt, ohne Jahreslauf oder Browser:

- `node --check prototype/v3-product-lifecycle.js` — PASS
- `node --check prototype/v3-run-orchestrator.js` — PASS
- `node prototype/v3-product-lifecycle-regressions.mjs` — PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS
- `node prototype/v3-macro-trade-impact-regressions.mjs` — PASS
- zusätzlicher isolierter Runtime-Probe: Anfangsbestand 0 + fälliger Receipt 1 − abgeschlossene Operationsentnahme 1 = Schlussbestand 0; JSON-restaurierter Zustand besteht `validateV3ProductWorkdayAssignments` — PASS

Die ProductState-Regression prüft dasselbe materialgebundene Operationspaar vor/nach Fälligkeit: vor Receipt reicht Material nicht; ein früher Receipt wird abgewiesen. Bei neutraler ETA wird nach Fälligkeit die Operation planbar; beim Dreitageslag bleibt sie an der neutralen ETA blockiert und wird erst nach tatsächlicher verspäteter Ankunft planbar. Das Shared-Run-Testpaar belegt Place-Order-Replay, Payloadkonflikt, Receipt-Event, Bestandszugang von 10 auf 12, Receipt-Idempotenz, JSON-Restore-Validierung und Abweisung eines manipulierten Receipt-Resultats.

Das A02-Demo enthält keine Rechnung oder angenommene Lieferantenkondition. Receipt-Movement trägt `monetaryStatus: nonposting_pending_cost_source`; Menge ist von Wert/Finanzposten getrennt. Es wird keine AP-, Cash-, Steuer-, COGS-, BAB- oder Ledgerwirkung behauptet.

## Abgrenzung

- Die Receipt-Regression ist ein begrenztes synthetisches Kontrollpaar, kein Nachweis empirischer Lieferzeiten oder einer kalibrierten Außenwirtschaftsregel.
- Es existieren Backend-APIs, aber keine UI-Auswahl/-Anzeige oder Browser-/Geräteprüfung dieses Order-/Receiptpfads.
- Dieser Slice stellt keine vollständige Materialbewegungsrechnung für Zugänge, Verbrauch, Korrekturen und Schlussbestand je Monat bereit. Es fehlt weiterhin T-0076s monatlicher Rollforward-/Monatsabschlussnachweis über alle Material- und Fertigwarenbestände, Reservierungen, Quarantäne und Lagerkapazität.
- Mengenprüfung ist keine Bestandsbewertung: Einkaufspreis, AP, Zahlungen, COGS, BAB, Steuer und Ledger bleiben pending, bis Quellen und gesonderte Finanzintegration bestehen.
- Das schließt T-0070/G3 nicht: weitere A03/A08-/UI-/Browserprüfungen, FX-Angebotsintegration und übrige Außenwirtschaftsgates sind separat offen.

**SCHLUSSFOLGERUNG:** Die Order- und Receipt-APIs führen im geprüften physischen Mengenpfad keine vorzeitige Verfügbarkeit herbei; Fälligkeit, Lag, tatsächlicher Materialverbrauch, Eventbindung, Replay/Restore und Nonpostinggrenze sind durch fokussierte Tests und einen zusätzlichen Receipt-Verbrauchs-Probe belegt. **PASS nur für diesen physischen Slice.** Kein Ticket- oder G6-Gesamtabschluss.

**ÄNDERUNGEN:** Nur dieser A09-Bericht; keine Produktdatei, kein Statuswechsel, kein Stage/Commit/Push.
