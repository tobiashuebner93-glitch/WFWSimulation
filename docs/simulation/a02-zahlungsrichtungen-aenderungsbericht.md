# A02 – Änderungsbericht: Trennung der Zahlungsrichtungen

**Datum:** 26.09.2026 · **Bezug:** MG-000 / SLG-000.2 / CP-0024 / bestätigter V1-Zahlungsfluss  
**Status:** Fachliche Präzisierung der A02-Spezifikation; keine neue Zahlungsregel.

## Änderung

Die A02-Spezifikation unterscheidet jetzt durchgehend zwischen Zahlungseingängen aus Kundenforderungen und Zahlungsausgängen für eigene Lieferanten-/Gläubigerverbindlichkeiten.

- Beim Kundeneingang bestimmt das bestehende Kunden-Zahlungsverhalten den Auslöser. Der volle V1-Zahlungseingang reduziert/schließt die Forderung und erhöht die Liquidität. Der eigene Bankbestand wird vor dem Eingang nicht geprüft.
- Bei eigenen Verbindlichkeiten löst die Fälligkeit einen automatischen Vollzahlungsversuch aus. Bei ausreichender Liquidität wird vollständig gezahlt; sonst wird der Fehlschlag dokumentiert, es gibt keine Teilzahlung, keine negative Liquidität und keine Cashbewegung. Der vollständige offene Posten bleibt bestehen und geht in den bestätigten V1-Mahn-/Dunning-Fluss über.
- A02 benennt die getrennten Ereignisse und übergibt den Zahlungsversuch bzw. dessen Ergebnis an A03. A02 erzeugt keine Finanzsalden.

Keine Retry-Regel, Zahlungspriorität, Mahnfrist, Schwelle oder sonstiger Mahnparameter wurde ergänzt. Die Spezifikation beschreibt keine zusätzliche Datenbank-/Architekturstruktur.

## Governance und Prüfung

- Aktualisiert: A02-Simulationsspezifikation; neu: dieser Änderungsbericht und CP-0025; Collaboration State verweist auf den neuen Nachweis.
- D-0010, A03-Finanzspezifikation, Datenmodell, Architektur/ADRs und Ticketstatus blieben unverändert.
- Keine Implementierung, Datenbank-/Supabase-/Schemaänderung oder Architekturentscheidung.
- `git diff --check` wurde nach Abschluss ausgeführt; Ergebnis im CP-0025.
