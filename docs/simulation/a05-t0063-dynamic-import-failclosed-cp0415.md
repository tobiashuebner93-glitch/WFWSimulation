# A05-T0063 – Dynamische Imports im Run-Cachegraphen fail-closed behandeln

**Status:** Parserhärtung umgesetzt; geforderte Regressionen PASS; A09-Re-Review offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A05 – FRONTEND
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; angrenzend T-0067/T-0069
**Profil:** V3, Start 2027-01-04, Seed `seed-v3-001`, `UPSWING`, `V3-PLAN-INDEX-SYNTH-EQUAL-1`, mindestens bis 2027-02-01
**Entscheidungen:** D-0162 / D-0163 / D-0169
**Vorgänger:** CP-0414 A09 CONDITIONAL PASS; CP-0413 A05 Graphhash-Fix; CP-0411 Browserabweichung
**Git-Basis:** `main@8b72b7e`; 355 Status-Einträge beim erneuten Präflight; kein Commit/Push.

## Präflight und Scope

AGENTS.md, Agentenstruktur und Rechte, Goals, Ticketboard, Collaboration State, D-0162/D-0163/D-0169, CP-0411 bis CP-0414 sowie A05-Generator und Cache-/Fixturetests wurden erneut gelesen. CP-0411 bis CP-0414 blieben unverändert. T-0063/T-0067/T-0069 bleiben offen. A09 hatte den vorherigen Importgraphfix CONDITIONAL PASS erteilt, weil der Graphparser dynamische `import(...)`-Syntax nicht abwies. Der aktuelle 20-Modul-Graph verwendet keine dynamischen Imports.

## Umsetzung

`prototype/v3/a05-v3-run-module-graph-cache.mjs` blockiert jetzt jeden `import(...)`-Kandidaten im erreichbaren Modulquelltext, bevor der Graph erzeugt wird. Das gilt sowohl für Literalziele (`import('./late.js')`) als auch computed/nonliteral Ziele (`import(variable)`); dadurch kann eine dynamische Kante nicht unversioniert aus dem statisch gebundenen Graphen herausfallen. Die Erkennung lässt Kommentare zwischen `import` und `(` zu. Sie ist absichtlich konservativ: ein entsprechender Text in Kommentar, String oder Template kann den Build ebenfalls stoppen. Das erzeugt höchstens einen sichtbaren falschen Blocker; ein potenziell unversionierter Import wird nicht still akzeptiert.

Die Tests injizieren beide Formen in das Run-Entry-Modul und verlangen eine Ablehnung durch den Generator. Der vorhandene aktuelle statische Graph bleibt zulässig. Der deterministische Graphhash und `run.html` ändern sich durch diese Parserhärtung nicht; Cachequeries, Fixture-ID und Szenariowerte bleiben unverändert. Keine Produkt-/Runtime-/Finance-/Lernregel wurde geändert.

## Prüfungen

- Generator `--write` zweimal hintereinander; SHA-256 von `run.html` davor/danach unverändert – PASS.
- Graph-/Entrycache-Regression: 20 statische Module vollständig gebunden, transitiver Byteschreibtest ändert den Hash, `import('./late.js')` und `import(variable)` werden abgewiesen – PASS.
- Offer-Sensitivity-UI-Regressions – PASS.
- Cost-plan-Fixture-UI-Regressions: `NEUTRAL` bleibt Standard, Fixture- und Datumsregeln bleiben erhalten – PASS.
- A02 CP-0412 Choreografie-Regressions: Setup/Lernen/Tagesrender/Speichern/Wiederherstellen, 01.02.2027 drei Indizes zu 110 – PASS.
- `node --check` für Generator sowie geänderte Cache-/UI-Regressionen – PASS.
- `git diff --check` auf getrackte geänderte UI-/Kollaborationsdatei; gezielte Leerraumprüfung für neue Artefakte – PASS.

## Nachweisrollen und offene Punkte

- **Ausführung:** A05; obige Regressionen PASS.
- **Fachreview:** keine Simulations- oder Finanzregeln geändert; A02-Choreografie weiterhin PASS.
- **Unabhängige QA:** A09-Re-Review dieser Korrektur noch nicht ausgeführt; CP-0414 war CONDITIONAL PASS.
- **Browser-/Gerätetest:** A01s frischer Browserbeleg aus CP-0414 bleibt für den unveränderten Run-HTML-/Graphhash gültig: Fixture im gespeicherten Root-State und BICI/Wage/Procurement=110/110/110. Für die Parser-only-Härtung nicht erneut ausgeführt.
- **Git-Verifikation:** `main@8b72b7e`, keine Commit-/Push-Aktion; bestehende Änderungen erhalten.

Der nächste Schritt ist A09-Re-Review. T-0063/T-0067/T-0069 bleiben `IN_PROGRESS`; kein Release-Claim.