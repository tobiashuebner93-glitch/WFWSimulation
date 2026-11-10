# A01-Entscheidungsübersicht – T-0067 V3 Kalkulation und BAB

**Status:** Alle sechs Entscheidungspunkte vom Nutzer bestätigt; verbindlich dokumentiert in D-0162  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A01 – MASTER_ORCHESTRATOR  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2, SLG-002.5  
**Ticket:** T-0067  
**Entscheidungsdatum:** 2026-10-31

Der Nutzer bestätigte die sechs gebündelten Vorschläge mit „1. ja 2. ja 3. ja 4. ja 5. ja 6. ja“. D-0162 ist der maßgebliche Beschluss. Der vollständige Regeltext steht im [Decision Log](decision-log.md#d-0162--v3-kalkulationsbasis-bab-rundung-und-kennzahlenperiode).

| Nr. | Bestätigte Regel | Umsetzungs-/Reviewverantwortung | Status |
|---|---|---|---|
| 1 | V3-`R` ist Nettoplanpreis ohne SimTAX-Komponente; V2-D-0160 wird nicht erweitert. | A02/A03; A05 UI-Vertrag | Bestätigt; Integration offen |
| 2 | DB I zieht nur variable Einzelkosten ab. Direkte Arbeit/Maschinen separat; zusätzlich Ergebnis nach direkten Einzelkosten. | A03, Schnittstelle A02/A05 | Bestätigt; Integration offen |
| 3 | BAB intern präzise; Restcent nach größter ungerundeter Restfraktion, Gleichstand stabile Kostenstellen-ID aufsteigend. | A03; unabhängige Rechenprüfung A09 | Bestätigt; Testreview offen |
| 4 | Kosten-/BAB-Snapshot bei Angebotseinreichung. Entwürfe dürfen neu berechnet werden; nach Annahme Preis und Snapshot unveränderlich; Ist-Abweichungen separat. Keine Schemafreigabe. | A02/A03 Vertrag, A04 Modellvorschlag ohne Freigabe, A05 Anzeige | Bestätigt; Integrationshandoff offen |
| 5 | Gesamt-DB-I von −0,01 € bis +0,01 € einschließlich gilt als centnah; exakter Wert und Vorzeichen bleiben sichtbar. | A03/A09 | Bestätigt; Grenztests offen |
| 6 | Operative Kennzahlen pro Kalendermonat; Jahreswerte aus zwölf Kalendermonaten; Cash/OP zusätzlich als Stichtag; Makroperioden getrennt. | A02/A03/A05 | Bestätigt; Integrationshandoff offen |

## Nächste Übergaben

- **A03:** D-0162 in den T-0067-Rechenvertrag/Testvektoren übernehmen; keine Buchungs-, Architektur- oder Schemaänderung.
- **A02:** T-0065/T-0066-Preis-, Kosten- und Periodenschnittstellen mit D-0162 abgleichen.
- **A04:** Snapshot-Anforderung als logischen Datenmodellvorschlag beschreiben; keine Schemafreigabe oder Migration.
- **A05:** erst nach stabilen Fachverträgen die getrennten Werte, Zeiträume und Snapshot-/Ist-Abweichungssichten gestalten.
- **A09:** unabhängig Rechenfälle, Rundungsrest, centnahe Grenzwerte und Perioden prüfen.

A01 bündelt alle Rückfragen an den Nutzer. Agentenergebnisse und neue Rückfragen sind an A01 zu adressieren. Diese Entscheidungsübersicht selbst enthält keine offene Nutzerentscheidung mehr. T-0067 bleibt bis Fachintegration und unabhängiger Prüfung IN_PROGRESS.
