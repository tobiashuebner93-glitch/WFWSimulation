# A02-Änderungsbericht – T-0009 / D-0011

Datum: 2026-10-27  
Agent: A02 – SIMULATION  
Bezug: MG-000 / SLG-000.2 / T-0009 / CP-0033 / CP-0148 / CP-0149

D-0011 ist in der A02-Spezifikation übernommen: Montag bis Freitag Arbeitstage, 8 Stunden pro Arbeitstag für Beschäftigte und CNC, Wochenende arbeitsfrei, Feiertage in V1 unberücksichtigt, Wochenendtermine am nächsten Arbeitstag; F3 zählt fünf Arbeitstage ab dem Tag nach vollständiger Lieferung. Tagesphasenfolge und Same-Day-Abhängigkeiten bleiben bestehen; überholte offene Kalender-/Kapazitätsaussagen sind bereinigt.

Finanzereignisse berücksichtigen A03: Kundenzahlung vollständig am Fälligkeitstag ohne eigenes Liquiditäts-Gate (D-0110); eigener Vollzahlungsversuch, wöchentliche Retries, acht Retry-Fehlschläge, Zahlungserinnerung nach 10 Kalendertagen, formelle Mahnung weitere 14 Tage später und keine allgemeine Pfändung/Liquidation in V1 (D-0024–29). Maschinenkredit D-0042/43 bleibt getrennt.

Offen zur A02/A03-Abstimmung: gleichzeitige Kundeneingänge und eigene Zahlungen bei knapper Liquidität; Zusammenspiel automatischer Fälligkeit mit Spielerwahl/Dispositionskredit; konkrete Phasenbindung gleichzeitiger Zahlungen, Retry-/Mahn- und Darlehensereignisse; Dunning-Wochenendverschiebung; Periodenzuordnung verschobener Ereignisse. D-0033 nennt den 29.01.2027 als letzten Arbeitstag im Januar; CP-0149/A03 führt den ersten tatsächlichen Darlehenstermin als offen. Abweichung ist zu klären. Keine Tie-Break-Regel oder Finanzparameter wurden ergänzt.

Dateien: A02-Spezifikation, dieser Bericht, CP-0150, Collaboration State. Keine Änderung an Decision Log, Ticket Board, A03-Unterlagen, Code, Schema, Datenbank, Supabase oder Architektur. Kein Commit/Push.

Prüfungen: globales `git diff --check` meldet eine bestehende Leerzeichenzeile in `docs/database/maschinenbau-mvp-datenmodell.md` aus A04s lokaler Änderung; A02-spezifischer Check ist sauber. `git status --short --branch` geprüft.