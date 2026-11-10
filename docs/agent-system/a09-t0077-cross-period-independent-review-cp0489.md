# A09 – T-0077 unabhängiger Monatsgrenzen-Review (CP-0489)

**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Ergebnis:** **PASS ausschließlich für den Januar/Februar-Kundenreceipt-Cutoff-Vektor.** Kein PASS für T-0077 vollständig oder T-0069 G7.

## Preflight und Artefakte

Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, Status 521. Alle sieben von A01 angegebenen Governance-Hashes stimmen mit dem Checkout überein. Gelesen wurden A03s Bericht, die Ledger-Projektion und deren fokussierte Regression.

- A03-Bericht SHA-256: `30DE34E66D2238B63015F60F903251757A6EE1939A6AF703A95B7AFC9CDBCD7E`
- Regression SHA-256: `818380072B2EF9C4E792040A8AF081BC872DED269445B45C9F85476FE0ACFE77`
- Projektion SHA-256: `489F48652B6CB89F865C0887ACC653DC41BE8B25367AD8DFD5CCCFDE5ED769B6`

## Befund zum Monatsgrenzenvektor

Die Regression erzeugt eine an Januarinvoice und Run gebundene tatsächliche Kundenzahlung mit Zahlungstag 2027-02-04. Beim inklusiven Stichtag 2027-01-31 bleibt die AR bei 107.100 Cent, die Bank bei 100.000 Cent; die Februarzahlung ist noch nicht in der Januarprojektion enthalten. Beim 2027-02-28-Abschluss steigt die Bank einmalig auf 207.100 Cent und AR sinkt auf null. Die zwei Receipt-Journallinien erscheinen im Februar. Soll und Haben sind gleich. JSON-Serialisierung/Restore ergibt für den Februarabschluss eine identische vollständige Projektion.

Die Ledgerprojektion ist laut API read-only und gleicht die Bestände/Flüsse gegen FinanceState ab. Die fokussierte Gesamtsuite prüft außerdem bereits gespeicherte Payload-Fingerprint-Abweichung und doppelte `paymentId`; der neue Monatsvektor selbst testet Restore-Gleichheit, aber keinen separaten erwarteten Endhash und keine gezielte Dedupe-Manipulation dieses Februarereignisses. Deshalb beschränkt sich PASS auf Cutoff, AR/Bank, Journale, Balance und Restore-Gleichheit des Vektors.

## Ausführung und Grenzen

`node --check prototype/v3-finance-ledger-projection.js` – PASS.
`node prototype/v3-finance-ledger-projection-regressions.mjs` – PASS (`D-0166/D-0168, read-only`). Keine weiteren Annual-/Browserläufe.

Das ist weiterhin nur eine Kunden-Receipt-Projektion. A03 dokumentiert fehlende Lieferanten/AP- und eigene Zahlungs-, Payroll-, Steuerabführungs-, Finanzierungs-/Dispo-, Bestand/COGS-Quellen sowie eine integrierte Jahresreconciliation. Diese Abnahme schließt weder T-0077 noch G7; keine Ticket-/Governance-/Produktänderung vorgenommen.
