# A11 – T-0020 Prototyp-Kopplungsreview

Datum: 2026-10-27\
Adressat: A01 – MASTER_ORCHESTRATOR\
Agent: A11 – TECHNICAL_ARCHITECT\
Bezug: MG-000 / SLG-000.2 / T-0020 / CP-0186

## Befund

Der Browser-Prototyp erfüllt die T-0020-Simulations- und Finanzanforderungen als lokal gekoppelter ESM-Prototyp. Daraus folgt keine Freigabe der Zielarchitektur V0.2 oder einer ADR.

Der aktuelle Modulgraph enthält eine zyklische Abhängigkeit: `engine.js` importiert den Wirtschaftsindex-Aktualisierer aus `economics.js`, während `economics.js` Materialpreise und Bestandswerte aus `engine.js` importiert. `finance.js` importiert Kalender-/Bestandsdaten aus `engine.js` und Materialpreise aus `economics.js`; `app.js` orchestriert beide Regelmodule direkt. Damit sind operative Tagesauflösung, Szenarioökonomie, Accounting-Funktionen und Darstellung zur Laufzeit enger gekoppelt als in den PROPOSED-Grenzen von V0.2.

Das erzeugt bei Änderungen ein Regressionsrisiko für Initialisierung/Reihenfolge, Importzyklen und fachliche Zuständigkeiten. Die bestehenden Regressionen, der Jahres-Smoke und die Modul-Syntaxprüfung sind derzeit die Schutzmaßnahmen. Es ist keine akute Laufzeitstörung aus den abgeschlossenen Testläufen hervorgegangen.

## Empfehlung für spätere Architekturarbeit

Als separate, freizugebende Architekturaufgabe sollten gemeinsame Preis-/Kalenderkonstanten in ein neutrales Regel-/Datenmodul überführt und Modulgrenzen zwischen Engine, Economy, Finance und UI geprüft werden. Die Tagesorchestrierung sollte fachliche Ergebnisse zwischen Simulation und Finance über explizite Ereignis-/Command-Daten übergeben. Das ist eine Empfehlung für spätere Arbeit, keine Änderung dieses Tickets.

## Grenze dieser Prüfung

T-0020 führt keine Modulaufteilung, Dependency- oder Schemaänderung durch. Architektur V0.2 und ADR-001 bis ADR-008 bleiben `PROPOSED / NICHT FREIGEGEBEN`; die technische Schuld ist für die Koordinierung dokumentiert.
