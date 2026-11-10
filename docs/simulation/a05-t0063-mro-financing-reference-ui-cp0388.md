# A05 T-0063 – UI für die MRO-Finanzierungsreferenz (CP-0388)

**Status:** Umsetzung abgeschlossen; gezielte Regressionen PASS; unabhängiger Review und Browserprüfung offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Vorgänger:** CP-0387 (A02 Read-Model-Projektion), CP-0386 (A03 L5-Finanzreview), CP-0385 (A12 Browserprüfung)  
**Profil:** V3 Shared Run, 2027; Anzeige im Bereich „Volkswirtschaft · Monatsstand“  
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169

## Änderung

Die Makroübersicht rendert jetzt die aus `getRunProjection` gelieferte `macroFinancingReference`. Vorhandene MRO-Werte werden mit Quellentyp, Quelle, Referenzperiode, Wirksamkeitsdatum und gegebenenfalls Datenstand angezeigt. Ohne MRO-Wert erscheint „derzeit nicht verfügbar“; es wird kein Ersatzwert eingesetzt.

Der Korridor aus D-0022 (+0,50 bis +5,50 Prozentpunkte; Mittelwert +3,00) ist als Referenzaufschlag ausgewiesen. Die Darstellung benennt ihn ausdrücklich als nicht personalisierten Benchmark und zeigt „Individuelle Konditionen: offen (pending)“. Es werden keine individuellen Zinssätze, Raten, Laufzeiten oder Kreditangebote behauptet. Ein kurzer Hinweis hält fest, dass Anzeige und Referenz keine Finanzwirkung erzeugen und bestehende Kredite/Dispo unverändert bleiben.

Die Renderfunktion führt keine Simulations- oder Finanzmutation aus. Dynamische Quellenmetadaten werden escaped. Die Ergänzung nutzt den vorhandenen responsiven Makrobereich; die Karte kann auf schmalen Viewports umbrechen.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/v3/run.css`
- `prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs`
- `docs/simulation/a05-t0063-mro-financing-reference-ui-cp0388.md`
- `docs/agent-system/checkpoints/CP-0388.md`

Keine Änderungen an Finance-, Ledger-, Auftrags-, Nachfrage-, Datenbank- oder Schema-Logik. D-0169 bleibt unverändert.

## Prüfungen und Nachweisrollen

- **Ausführung:** A05; Renderer gegen die vorhandene Shared-Run-Projektion integriert.
- **Fachreview:** A03 CP-0386 (Dokumenten-/Finanzgrenze PASS, vor der UI-Änderung); kein A03-Review dieser UI-Änderung.
- **Unabhängige QA:** A09 noch nicht ausgeführt.
- **Regressionen:** `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` PASS; `node prototype/v3-run-macro-fixture-regressions.mjs` PASS; `node prototype/v3/a05-t0063-macro-regressions.mjs` PASS.
- **Browser-/Gerätetest:** für diese Änderung nicht ausgeführt. A12 CP-0385 ist ein früherer Desktop-Playtest des neutralen Startpfads und deckt diese neue Karte nicht ab.
- **Git:** Branch `main`, HEAD `8b72b7e`; beim Abschluss 305 Status-Einträge im bereits umfangreich geänderten Arbeitsbaum. Alle Änderungen anderer Arbeitspakete erhalten. Kein Commit oder Push.
- **Whitespace:** `git diff --check` PASS; nur bestehende LF/CRLF-Hinweise.

## Übergabe

A01 kann A09 mit einem gezielten UI-/Read-Model-Review beauftragen: Prüfpunkte sind Quelle/Zeitraum/Provenienz, Null-/Pending-Semantik, Benchmark nicht als persönlicher Satz, Escaping, responsive Darstellung sowie bytegleiche Finanz-/Run-/D-0169-Zustände. Danach sollte A12 die Karte mindestens im Desktop- und schmalen Viewport prüfen. T-0063 und T-0069 bleiben IN_PROGRESS.
