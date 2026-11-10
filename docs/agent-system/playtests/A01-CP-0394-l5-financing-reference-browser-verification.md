# A01 Browser-Nachprüfung: L5-Finanzierungsreferenz (CP-0394)

- **Ergebnis:** PASS im getesteten Desktoppfad; die Karte ist nach Cache-Build-Identifier im normalen Shared Run sichtbar.
- **URL:** `http://127.0.0.1:8033/prototype/v3/run.html?refresh=cp0393`
- **Browser/Viewport:** ChatGPT IAB, Desktop 1265 × 713 px; frischer Tab.
- **Szenario:** `V3-RUN-SYNTH-01`, Seed `seed-v3-001`, UPSWING, 04.01.2027–29.01.2027.
- **Ablauf:** Lauf starten; Beschäftigte, Maschinen, Material und vorhandene Belegungen jeweils `[]`; Fertigwarenkapazität und Belegung `0`; ersten Tag öffnen; Makrobereich prüfen.
- **Beobachtung:** Finanzierungsreferenz erscheint zwischen Monatssnapshot und Planprojektionen. Ohne MRO-Wert kein Ersatzwert; D-0022-Benchmark +0,50 bis +5,50 pp, Mittel +3,00 pp; individuelle Konditionen `pending`; ausdrücklicher Hinweis, dass dies kein persönlicher Zinssatz/Kreditangebot ist.
- **Unternehmenswirkung:** D-0169 Faktor 1,010, sechs Anfragen; Bank 10.000,00 €, Nettoumsatz/Forderungen/SimTAX je 0,00 €, keine Finanzübergabe.
- **Visuell:** Karte lesbar, kein sichtbarer Überlauf im erfassten Desktopbild.
- **Nicht geprüft:** Mobile/Tablet, Konsole, beobachteter MRO, Mehrmonat/Jahreslauf. A12 war mangels Browser im isolierten Agentenlauf blockiert; diese Prüfung ist daher A01-Ausführung und kein A12-PASS.
- **Review/QA:** A03 CP-0386 und A09 CP-0391 sind eng begrenzte Vorreviews; A09 hat CP-0393 selbst noch nicht unabhängig geprüft.
- **Git:** kein Commit/Push.
