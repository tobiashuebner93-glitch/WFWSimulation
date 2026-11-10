# A01 Browser-Retest CP-0398 – SHA-256-Run-Entry und Finanzierungsreferenz

- **Ergebnis:** PASS für den geladenen Desktop-Ersttagspfad nach CP-0396; separates UI-Follow-up für die klebende Statusmeldung.
- **URL:** `http://127.0.0.1:8033/prototype/v3/run.html?v=sha256-8607f80df23e9cf7c77c9980080f8cb813459e449dad30e5c50d443ca85ddd8e`
- **Viewport:** ChatGPT IAB, Desktop; keine feste Pixelmessung dokumentiert.
- **Szenario:** `V3-RUN-SYNTH-01`, `seed-v3-001`, UPSWING, 2027-01-04 bis 2027-01-29.
- **Ablauf:** frischer Tab; Lauf starten; leere Beschäftigten-/Maschinen-/Material-/Belegungsarrays sowie Fertigwarenkapazität 0 und Belegung 0 ausdrücklich übergeben; ersten Simulationstag öffnen.
- **Makro/UI:** 2027-01 UPSWING, Spielpreisindex 100,00; Aktivitätslücke 1,00 %, D-0169-Faktor 1,010, sechs Anfragen.
- **L5-Karte:** nach dem ersten Tag sichtbar; MRO unavailable ohne Ersatz; D-0022-Benchmark +0,50 bis +5,50 pp, Mittel +3,00 pp; persönliche Konditionen pending; keine Kredit- oder Finanzwirkung.
- **Finanzstand:** Bank 10.000,00 €, Nettoumsatz/Forderungen/SimTAX 0,00 €.
- **Zusatzbefund:** `#live-status` bleibt sticky am Viewportboden und überlagert beim Scrollen einen Teil des unteren Inhalts/Finanzkartenhinweises. A05-Follow-up: keinen Inhalt überdecken, Statussemantik erhalten.
- **QA:** A09 CP-0397 bestätigt die SHA-256-Bindung von run.js und URL, falscher Hash wird im Mutationstest abgewiesen; relevante Suites PASS.
- **Nicht geprüft:** Mobil/Tablet, Browserkonsole, aktive MRO-Quelle, mehrtägiger/Jahrespfad.
- **Kein Commit/Push.**
