# A04-Abgleichbericht – Datenmodell gegen bestätigte Entscheidungen

Datum: 2026-10-27  
Agent: A04 – DATABASE  
Adressat: A01 – MASTER_ORCHESTRATOR  
Bezug: MG-000 / SLG-000.2 / D-0011–D-0119 / CP-0148–CP-0150

## Ergebnis

Die A04-Spezifikation wurde dokumentarisch mit dem Decision Log, CP-0148, dem aktuellen A03-Finanzstand und dem durch CP-0150 bestätigten A02-Stand abgeglichen. Eine veraltete, im historischen CP-0022-Abschnitt noch als „behoben“ ausgewiesene Bilanz wurde berichtigt: maßgeblich sind Aktiva und Passiva von je 55.300 €, CNC-Buchwert 0 € und Eigenkapital-Restposition 23.800 €. Der getrennte Gesamtfinanzierungs-/Budgetrahmen von 50.000 € besteht aus 30.000 € Bankbestand und 20.000 € ungenutztem Rahmen; dieser Rest ist weder Cash noch zusätzliche Passivposition.

Bestätigte Regeln zu Kalender und Vertragsfristen, Zahlungszielen/Ankern, Kunden- und Lieferantenzahlungen, Retry/Dunning, Darlehensgrundlogik, SimTAX, BAB, Materialbewertung und AfA sind im aktuellen Offenregister nicht als unentschieden zurückgestuft. Feiertagsbehandlung ist differenziert: D-0011-Arbeitskalender und Vertragsziele ignorieren Feiertage; SimTAX-Fälligkeit folgt D-0097 einschließlich Verschiebung an gesetzlichen Feiertagen.

CP-0150 wurde als neuester A02-Abgleich aufgenommen. A02/A03 müssen weiterhin Gleichzeitigkeit von Finanzereignissen bei knappem Cash, Spielerwahl/Dispositionskredit, Phasenbindung und Interaktion von Retry-, Mahn- und Darlehensereignissen, Wochenendverschiebungen sowie Periodenzuordnung abstimmen. D-0033 setzt den Januarfälligkeitstag auf den 29.01.2027; der erste tatsächliche Zahlungstermin bleibt laut A03 offen und ist mit A02 abzugleichen.

## Verbleibende echte Lücken

- Annuitätenhöhe und erster tatsächlicher Darlehenszahlungstermin; Abgleich mit der bestätigten Januarfälligkeit 29.01.2027.
- Dispositionskredit-Limit, Verfügbarkeit sowie Ziehungs- und Rückzahlungsregeln.
- Kundenverhaltensparameter und konkrete Verspätungsereignisse.
- A02/A03-Ereignisreihenfolge, Gleichzeitigkeit, Phasenbindung und Periodenzuordnung wie oben beschrieben.
- Künftige MRO-/Inflationsüberführung und Verhalten der FKQ-Kurve über 100 %.
- Nicht festgelegte laufende Kosten, Kostenstellen- und Periodendetails.
- Vorjahresschluss-Erzeugung/-Übergabe und Preisbestandteile für Eröffnungsbestände.
- Konkrete SimTAX-Fehlererkennungsereignisse.

Alle Felder, logischen Objekte und Übergaben der Spezifikation bleiben Modellanforderungen. Sie erteilen keine physische Schema-, Migrations-, API-, Implementierungs- oder Architekturfreigabe. CP-0020 ist in diesem Checkout nicht als Repository-Datei nachgewiesen; es wurde nicht rekonstruiert.

## Grenzen und Prüfung

Nur `docs/database/maschinenbau-mvp-datenmodell.md` wurde fachlich aktualisiert. A02/A03-Spezifikationen, Decision Log, D-0010, Ticketstatus und Datenbank wurden nicht geändert. Keine Implementierung, Migration, Schemaänderung, Architekturentscheidung, Commit oder Push. Vorhandene Änderungen anderer Agenten blieben bestehen.

`git diff --check` und `git status --short` wurden nach Abschluss ausgeführt; Details sind im Checkpoint CP-0151 dokumentiert.
