# A02 – Änderungsbericht: bestätigte P0-Regeln und Startaufträge

**Datum:** 26.09.2026 · **Bezug:** MG-000 / SLG-000.2 / D-0010 / CP-0018 / CP-0019 / CP-0020  
**Status:** Fachliche Dokumentationsrevision; keine Implementierungs- oder Architekturfreigabe.

## Änderungen

Die A02-Spezifikation übernimmt die vom Nutzer bestätigte Tagesphasenfolge und präzisiert deren same-day-Ablauf, F3-Abnahme nach fünf Arbeitstagen, rechtzeitige Ablehnung in `ABLEHNUNG_IN_KLÄRUNG`, automatische Vollrechnung nach positiver Abnahme, Umgang mit nicht ausführbarer Vollzahlung und G3-Abschluss nach Zahlung der Kundenforderung. Operative Erfüllung, Rechnung und Zahlung werden als getrennte Zustände beschrieben. Mahnfristen und Priorisierung knapper gleichzeitiger Auszahlungen bleiben bei A03/Nutzer.

Das Startprofil erhält drei vollständig quantifizierte A02-Aufträge samt stabilen Profil-IDs, zugesagten Lieferterminen, vier Arbeitsgängen, Ressourcenstunden und Materialbedarfen. Die Summe des Startbedarfs liegt unter dem festgelegten Eröffnungsbestand. Mitarbeiterkapazitäten von je 40 h/Woche und CNC-Kapazitäten von 40 h/Woche werden als getrennte Pools abgebildet; die vorher angegebene jährliche CNC-Grenze von 1.600 h bleibt zusätzlich erhalten. Materialverbrauch wird bei vollständigem Abschluss von Arbeitsgang 10 als Simulationsereignis gemeldet.

Die Auftragsmengen, Arbeitsstunden und Termine sind konkrete A02-Fixture-Werte, keine neuen allgemeinen Branchen- oder Produktregeln. Kundennamen, technische Zeichnungen, Preise, Konditionen, Arbeitskalender und genaue tägliche Kapazitätsverteilung bleiben offen. Deshalb sind die Startlast und Statusübergänge deterministisch beschrieben, exakte prognostizierte Fertigstellungstage aber erst nach Festlegung des Betriebskalenders berechenbar.

## Governance und Prüfung

- Bestehende A02-Spezifikation fachlich aktualisiert; neuer Kurzbericht und CP-0021 erstellt.
- D-0010, A03-Finanzspezifikation, Datenmodell, Decision Log, Ticketstatus und Architektur/ADRs nicht geändert.
- Keine Produktregel außerhalb der Nutzerbestätigung beschlossen. Insbesondere kein neuer F3-Klärungs-/Nacharbeitsausgang, keine Monatsgrenzenregel, kein Mahnintervall und keine Zahlungsvorrangregel ergänzt.
- Keine Code-, Datenbank-, Supabase-, Schema- oder Dependencyänderung.
- `git diff --check` erfolgreich (Exit 0); Git meldet nur die bekannten LF→CRLF-Hinweise für vorhandene geänderte Markdown-Dateien.

## Noch erforderlich

Vor einer exakt datierbaren Kapazitätssimulation sind Standort/Feiertage, Wochenarbeitstage und Verteilung der 40 Stunden je Woche auf Kalendertage festzulegen. A03 benötigt weiterhin Kundenzahlungsverhalten, Fälligkeit-/Mahnparameter, die konkrete Zuordnung des Startprofils zu finanziellen Belegen sowie Preis-/Kosten-/BAB-Werte. Die `MA-AV`-Planungszeiten und übrigen Startauftragswerte sind in der A02-Spezifikation als A02-Profilparameter gekennzeichnet und können vom Nutzer geändert werden.
