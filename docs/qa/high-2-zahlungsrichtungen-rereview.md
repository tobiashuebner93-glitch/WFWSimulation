# A09 – Finaler Re-Review HIGH-2: Zahlungsrichtungen

**Stand:** 2026-09-26
**Status:** PASS – ursprünglicher HIGH-2-Befund vollständig beseitigt
**Geprüft:** CP-0022, CP-0023, CP-0025, CP-0026, CP-0027 sowie aktuelle A02-, A03- und A04-Spezifikationen

## Ergebnis

Die zuvor beanstandete Vermischung von Kundenzahlungseingängen mit der eigenen Liquiditätsprüfung ist in der geprüften Dokumentenkette beseitigt.

- **Kundenzahlung:** A02/A03 halten fest, dass der tatsächliche Eingang dem Kundenverhalten folgt, ohne Cash-Gate durch das eigene Unternehmen. Der Eingang erhöht Liquidität und reduziert/schließt die Forderung.
- **Eigene Zahlung:** A02/A03/A04 legen für eigene Payables den automatischen Vollzahlungsversuch bei Fälligkeit fest. Bei ausreichender eigener Liquidität folgt vollständige Zahlung und OP-Schließung; bei Fehlbetrag gibt es keine Teilzahlung, keine negative Liquidität und keine Liquiditätsbewegung. Der volle OP bleibt bestehen, der Fehlschlag wird dokumentiert und der bestätigte V1-Mahn-/Dunning-Fluss greift.
- **Datenmodell:** A04 verwendet `payable_payment_attempt` ausschließlich für Payables. Dunning ist ausschließlich an Payable und dessen fehlgeschlagenen eigenen Versuch gekoppelt. Zahlung trägt eine Richtung; Zuordnung muss zur Richtung und zum OP-Typ passen. Versuch, tatsächliche Zahlung, Forderung und Verbindlichkeit sind getrennt.
- **Offen:** Kundenverhaltensparameter, Retry-Regeln/-Zeitpunkte, Priorität konkurrierender eigener Fälligkeiten sowie konkrete Mahnfristen/-schwellen bleiben offen. Die geprüften Änderungen erfinden keine rechtlichen Detailregeln oder zusätzlichen Produktentscheidungen.

Keine widersprüchliche ältere Aussage zum automatischen Vollzahlungsversuch oder zum V1-Mahnfluss wurde in den aktuellen A02-/A03-/A04-Zahlungsabschnitten gefunden. HIGH-2 ist damit vollständig behoben.

Keine Implementierung, Datenbankänderung oder Architekturentscheidung wurde vorgenommen.
