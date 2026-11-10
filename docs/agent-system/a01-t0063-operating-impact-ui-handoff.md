# A01 – V3 Shared Run: UI-Handoff betriebliche Planwirkung

**Adressat:** A05 – FRONTEND  
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L0/L1, Anschluss T-0069  
**Bezug:** D-0169; CP-0357, CP-0361/0362, CP-0435/0436  
**Status:** vorbereitet, noch nicht ausgeführt oder von A05 übernommen.

## Auftrag

Zeige die bereits vorhandene `projection.operatingImpact`-Projektion im V3 Shared Run als responsiven Wochenabschnitt „Betriebliche Planwirkung“. Ändere ausschließlich Darstellung und UI-Regressionen; Simulations-, Makro- und Finanzregeln bleiben unangetastet.

Pro vorhandener Woche sollen sichtbar sein: Wochenzeitraum, Anfragen, gewonnene Aufträge, davon in der Woche angenommene Aufträge, offene Kundenentscheidungen, geplante Arbeitsstunden, deklarierte Personalkapazität, Plan-Auslastung und Aufträge ohne Arbeitsplan. Fehlen Wochen, zeige einen verständlichen Leerzustand. Stelle Ereignisse chronologisch mit dem jüngsten Zeitraum zuerst dar.

Kennzeichne jede Darstellung als nichtbuchende, synthetische Planprojektion. Die Kapazität ist nur `hoursPerDay × fünf Werktage`; Abwesenheiten und Maschinenengpässe sind nicht berücksichtigt. Trenne „gewonnen“, „angenommen“ und „geplant“. Beschrifte nichts als Istkosten, Ist-Auslastung oder tatsächlich gefertigte Leistung.

## Akzeptanzkriterien

- Kein UI-Update verändert `runState`, `financeState` oder Projektionsergebnisse.
- Neue Wochen erscheinen nach Tagesschluss und bleiben nach Save/Restore gleich.
- Keine erzeugten Wochen: zugänglicher Leerzustand ohne irreführende Nullen.
- Nullkapazität zeigt Auslastung als nicht verfügbar, nicht als `Infinity`/`NaN`.
- Kleine Bildschirme ohne horizontales Scrollen; Tastaturfokus, Überschriften und Status-/Zahlenbezeichnungen sind verständlich.
- Regressionen decken mindestens leere Werte, mehrere Wochen, Nullkapazität, lange Referenzen/Zahlen und Save/Restore ab.
- Keine Änderung an D-0169, A02-Projektion, Finance/Ledger, Bestell-/ETA-Modell, Schema oder Architektur.

**Ergebnis an A01:** Status, geänderte Dateien, gezielte Tests, bekannte Grenzen, Reviewbedarf und neuer ENTWURF-Checkpoint. Kein Commit/Push.
