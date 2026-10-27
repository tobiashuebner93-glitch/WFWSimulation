# A02-Änderungsbericht T-0010 – V1-Startprofil

Datum: 2026-10-27\
Adressat: A01 – MASTER_ORCHESTRATOR\
Agent: A02 SIMULATION (durch A01 ausgeführt)\
Bezug: MG-000 / SLG-000.2 / T-0010 / D-0090–D-0096 / D-0128 / CP-0182

## Änderungen

Die A02-Spezifikation enthält jetzt ein reproduzierbares artikelbezogenes Startprofil für Norm- und Zukaufteile. Die bestätigte Schraube DIN 933 10.9 M10×30 ist mit 60 Stück Anfangsbestand und Verbrauch 40/12/4 Stück für ORD-START-01/02/03 spezifiziert. Mutter DIN 934 M10, Lager 6204-2RS, Pneumatikzylinder ISO 6432 16×100 und O-Ring NBR 20×2 sind als getrennte Referenzartikel mit Einheit und Preisvorschlag dokumentiert; sie haben keine Anfangsmenge und keinen Verbrauch in den drei Startaufträgen.

Die 22 zusätzlichen Gruppen aus D-0095 sind berücksichtigt und nach Lager-/Betriebsmittel, Versorgungsleistung, Dienstleistung und Gebührenposition abgegrenzt. Sie werden nicht automatisch als Lagerbestand oder Stücklistenverbrauch gebucht. Nur die drei D-0128-Startpreise und -mengen sind für den Startbestand verbindlich; übrige A08-Preise sind Vorschläge.

## Grenzen

Keine Änderung an Anwendungscode, Datenbankschema, Abhängigkeiten oder Architektur. D-0010-Scope bleibt bestehen. Keine Marktpreise oder A03-Bewertungsregeln erfunden.

## Nachweis

- Spezifikation: maschinenbau-mvp-spezifikation-und-gap-analyse.md
- Recherchebasis: ../market-data/a08-t0011-markt-referenzscan-2026-10-27.md
- Checkpoint: ../agent-system/checkpoints/CP-0182.md
- git diff --check: bestanden; nur konfigurierte Zeilenendenhinweise.
