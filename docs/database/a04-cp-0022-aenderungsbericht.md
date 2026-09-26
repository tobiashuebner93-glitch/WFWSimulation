# A04 – Änderungsbericht zum CP-0022-Abgleich

**Datum:** 2026-09-26  
**Bezug:** MG-000 / SLG-000.2 / T-0006 (abgeschlossen) / CP-0022  
**Ergebnis:** Dokumentarische Korrektur der Datenbankspezifikation; keine Umsetzung oder Schemafreigabe.

## Behobene HIGH-Befunde

1. Eröffnungsmodell auf den Stand 01.01.2027 gebracht: Aktiva 95.300 € und Passiva/Eigenkapital 95.300 €. Enthalten sind Bank 30.000 €, Forderungen 12.500 €, Vorräte 12.800 €, Maschine (Buchwert) 40.000 €, Lieferantenverbindlichkeiten 7.500 €, Maschinendarlehen 24.000 € und Eigenkapital 63.800 €. Der 50.000-€-Finanzierungs-/Budgetrahmen wird separat als 30.000 € Bank plus 20.000 € ungenutzter Rahmen geführt. Die 20.000 € sind weder Cash noch zusätzliche Passivposition.
2. Zahlungsbeschreibung auf automatischen Vollzahlungsversuch bei Fälligkeit berichtigt. Bei ausreichender Liquidität folgt vollständige Zahlung. Andernfalls gibt es keine Teilzahlung, der volle OP bleibt bestehen, der Versuch wird als fehlgeschlagen dokumentiert und Liquidität wird nicht negativ. Mahn-/Eskalationspfad ist als eigener Sachverhalt beschrieben.

## Behobene QA-Dokumentationslücken

- SimTAX: 19 % je Position, Simulationsparameter ohne rechtliche Steuerlogik, je Position auf Cent runden und anschließend summieren.
- Kapazitäten: Mitarbeiterstunden und CNC-Betriebsstunden getrennt; bestätigte A02-Wochen-/Jahresgrenzen und Qualifikationszuordnung aufgenommen.
- Simulation: fester Start, Wochenraster mit konkreten Kalendertagen, flexible Fortschreibung, Wochenendverschiebung sowie deterministische Tagesphasen und same-day-Folgephasen persistierbar beschrieben.
- V1-Mahnfluss: fehlgeschlagener Fälligkeitsversuch → Mahnung/Dunning → weitere Eskalation → gegebenenfalls Pfändung/Seizure oder Liquidation. Keine Fristen oder Schwellenwerte ergänzt.
- Zustands- und Faktentrennung für Auftrag, Rechnung, Forderung/Verbindlichkeit, Zahlungsversuch, tatsächliche Zahlung und operative Ereignisse präzisiert.

## Offen und Abgleich mit A02/A03

Keine verbleibenden Widersprüche zu den geprüften A02-/A03-Regeln in den bearbeiteten Bereichen. Offen bleiben unter anderem Zahlungspriorität bei Konkurrenz, Retry- und Mahnzeitpunkte/-schwellen, Tageskapazitätsverteilung, Kalenderdetails, Fälligkeitstagszählung, SimTAX-Bemessungsbasis/Halbcent-Konvention und individuelle Eröffnungs-OP-Belege. Diese Werte wurden nicht erfunden.

CP-0020 fehlt als Datei im aktuellen Checkout. Der Checkpoint wurde nicht rekonstruiert; die aktuelle A03-Finanzspezifikation, A03-P0-Prüfung und Nutzervorgabe enthalten den verwendeten Bilanzstand. Die fehlende CP-0020-Provenienz bleibt ein Repository-Nachweisproblem.

Geändert wurden ausschließlich A04-Spezifikation, dieser Änderungsbericht, CP-0023 und der Collaboration State. D-0010, A02/A03-Fachspezifikationen, Ticketboard und Implementierung wurden nicht geändert. Keine Migration, Datenbank-/Supabase-Änderung oder Commit-/Push-Aktion.
