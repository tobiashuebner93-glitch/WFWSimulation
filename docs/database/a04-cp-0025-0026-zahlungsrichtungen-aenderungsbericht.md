# A04 – Änderungsbericht zum Zahlungsrichtungsabgleich

**Datum:** 2026-09-26  
**Bezug:** MG-000 / SLG-000.2 / CP-0025 / CP-0026 / CP-0023  
**Ergebnis:** FAIL-Befund geschlossen durch dokumentarische Modellpräzisierung; keine Schemafreigabe.

## Befund

Die vorherige generische `payment_attempt`-Zuordnung erlaubte sowohl Receivable als auch Payable, obwohl ein eigener Liquiditätscheck ausschließlich eigene Verbindlichkeiten betrifft. Auch der Mahnfall ließ Receivable oder Payable zu. Dadurch konnten Kundeneingänge irrtümlich denselben Erfolgs-/Fehlschlagsbedingungen wie eigene Zahlungsausgänge unterliegen.

## Änderung

- Kundeneingänge sind als tatsächliche Zahlung mit Richtung `CUSTOMER_RECEIPT` an Kunde/Receivable abgebildet. Sie folgen Kundenverhalten ohne Prüfung eigener Liquidität; der Eingang erhöht Liquidität und reduziert/schließt die Forderung.
- Der automatische Versuch ist als `payable_payment_attempt` ausschließlich an eine eigene Verbindlichkeit gebunden. Nur hier prüft ein Vollzahlungsversuch die eigene Liquidität. Bei Fehlschlag bleibt der vollständige Payable offen; es entstehen weder Teilzahlung noch Zahlung oder Liquiditätsbewegung.
- `dunning_case`/`dunning_event` referenzieren ausschließlich Payable und dessen fehlgeschlagenen Versuch.
- `payment_allocation` muss richtungskonsistent sein: `CUSTOMER_RECEIPT`→Receivable; `OWN_PAYMENT`→Payable. Forderungen und Verbindlichkeiten bleiben unabhängig.

## Offene Punkte und Abgleich

Kundenverhaltensparameter, Retry-Regeln, Zahlungspriorität, konkrete Mahnfristen/-schwellen und Darlehenszahlungsplan bleiben OFFEN. Keine dieser Regeln wurde ergänzt oder erschlossen. Das Modell ist in der geänderten Dokumentation mit CP-0025/A02 und CP-0026/A03 widerspruchsfrei.

Geändert wurden ausschließlich die A04-Datenbankspezifikation, dieser Bericht, CP-0027 und Collaboration State. Keine Implementierung, Migration, physische Datenbankänderung, Architekturentscheidung oder Änderung von D-0010/Ticketboard. Keine Commit-/Push-Aktion.
