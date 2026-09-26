# A03-Änderungsbericht CP-0026: Zahlungsrichtungen

Datum: 2026-09-26  
Agent: A03 – ACCOUNTING_FINANCE  
Bezug: MG-000 / SLG-000.2 / CP-0025 / A09-Befund zur Finanzspezifikation

## Änderung

Die Finanzspezifikation wurde mit CP-0025 synchronisiert und trennt Kundenzahlungseingänge von eigenen Zahlungsverpflichtungen.

- Kundenforderungen: Ein Zahlungseingang folgt dem Kundenverhalten und wird nicht durch den Bankbestand des eigenen Unternehmens verhindert. Der tatsächliche Eingang erhöht Liquidität und reduziert/schließt die Forderung.
- Eigene Lieferanten-/Gläubigerverbindlichkeiten: Fälligkeit löst einen automatischen Vollzahlungsversuch aus. Nur bei ausreichender eigener Liquidität wird vollständig gezahlt. Bei Fehlschlag gibt es keine Teilzahlung, negative Liquidität oder Cashbewegung; der volle OP bleibt bestehen, der Fehlschlag wird dokumentiert und der bestätigte V1-Mahn-/Dunning-Fluss greift.
- Zahlungsereignisse und Übergabedaten sind richtungsgetrennt. Die Liquiditätsregeln und offenen Entscheidungen benennen diese Unterscheidung ausdrücklich.

Retry-Zeitpunkt/-Regeln, Priorität konkurrierender eigener Fälligkeiten, konkrete Mahnfristen/-schwellen und der Darlehenszahlungsplan bleiben offen. Die konkrete zeitliche Ausprägung des Kundenverhaltens bleibt offen, soweit A02 sie nicht vorgibt. Keine weiteren Regeln wurden ergänzt.

Die A02-Spezifikation in CP-0025 weist dieselbe Richtungsabgrenzung aus. Beim Abgleich wurde kein verbleibender Widerspruch festgestellt.

## Umfang und Prüfung

Geändert werden nur A03-Finanzspezifikation, dieser Änderungsbericht, CP-0026 und der zugehörige Eintrag im Collaboration-State. Keine Implementierung, Datenbankänderung, Migration, Architekturentscheidung oder Änderung von D-0010. Architektur V0.2 und ADRs bleiben PROPOSED.

`git diff --check` und `git status` werden nach den Dokumentänderungen ausgeführt.
