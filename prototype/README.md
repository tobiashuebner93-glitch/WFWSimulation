# Werkstatt V1 – browserfähige Jahres-Simulation

## Starten

Im Repository-Root: `python -m http.server 8001` und dann [http://localhost:8001/prototype/](http://localhost:8001/prototype/) öffnen. Alternativ `python -m http.server 8001 --directory <Repository-Pfad>`. ES-Module laufen über HTTP; es gibt keine externen Laufzeitabhängigkeiten. Der Spielstand bleibt lokal im Browser gespeichert.

## Spielumfang

- Tages- und Wochenfortschritt sowie ein schneller Jahreslauf
- zwei neue Kundenaufträge pro Monat (mit transparenter Szenariopreisannahme), Arbeitsgänge, Lieferung, Abnahme, automatische Rechnung und Zahlung
- Arbeitsplanung für drei Beschäftigte mit Qualifikationen, Tageszuweisung und maximal acht Stunden
- Netzwerk aus drei Konkurrenten, fünf Lieferanten und fünf Kunden mit dynamischen Zuschlägen, Verbindungswerten, Lieferverzug und Kundenzahlungsmoral
- Weiterbildungskurse mit Kosten, Qualifikations-/Produktivitätsgewinn und temporär gebundener Arbeitszeit; duale Metalltechnik-Ausbildung mit Berufsschule, Betreuung und zweijährigem Fortschritt
- Krankheit, geplante 20 Urlaubstage und Moraleffekt auf Produktivität
- Zeitarbeitsbuchung für einen konkreten Auftrag und Tag, bis zu acht Stunden
- Lager-, Büro-, Personal- und Werkstattfläche mit aktiven Kapazitätsgrenzen; Monatsmiete
- volkswirtschaftliche Szenariowerte für Nachfrage, Inflation und Leitzins
- monatliche Lohn-, Miet-, Energie-, Wartungs- und Zeitarbeitskosten; SimTAX-Fälligkeit; Maschinenrate und Dispozins
- manuelle Dispoziehung nur für den exakten Fehlbetrag, automatische Rückführung zuerst aus Kundeneingängen und tägliche Zinsberechnung mit monatlichem Sammelposten
- responsive Touch-Navigation für Mobilgeräte

Die Anwendung ist ein Lern-/Spielszenario und keine Personal-, Steuer-, Rechts-, Arbeitsschutz- oder Bilanzsoftware. Alle nicht übergebenen Preis- und Mietwerte sind im [V1-Modellblatt](V1-MODELL.md) ausgewiesen. Sie sind änderbare Spielannahmen, keine Marktdaten oder Nutzerentscheidungen. Der Spielstand bleibt lokal im Browser gespeichert.

## Jahres-Smoke-Test

`node year-simulation-smoke.mjs` simuliert 365 Tage und prüft Marktchancen, Lieferantenverzug, Lieferung, Kundenzahlung, Monatsabschluss, Krankheit, Urlaub, Zeitarbeit, Weiterbildung, Ausbildung, Kapazität und Feiertage.

`node t0020-regressions.mjs` prüft zusätzlich Same-Day-Arbeitsgangsketten, qualifizierte Vorsteuer und Guthabenübertrag, Dunning-Fristen samt Zahlungsvorrang sowie die Migration älterer Finanzspielstände.
