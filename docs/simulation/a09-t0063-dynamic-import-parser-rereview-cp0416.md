# A09 Re-Review – A05 fail-closed Dynamic-Import-Parser (CP-0416)

**Status:** PASS für den beauftragten Generator-/Cache-Scope
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0067/T-0069 angrenzend
**Profil:** V3, 2027-01-04 bis mindestens 2027-02-01, Seed `seed-v3-001`, `UPSWING`, Fixture `V3-PLAN-INDEX-SYNTH-EQUAL-1`
**Entscheidungen:** D-0162, D-0163, D-0169
**Vorgänger:** CP-0411 bis CP-0415; alle unverändert
**Git-Basis:** `main@8b72b7e`; fremde Änderungen erhalten; kein Commit/Push.

## Preflight und Prüfumfang

Der aktuelle AGENTS.md-Preflight wurde vollständig gelesen und angewandt: Agentenstruktur/Rechtematrix, Goals, aktives Ticket-Board, Collaboration State, Decision Log und CP-0411–0415 sowie A05-Bericht, Parser, `run.html` und fokussierte Regressionen. Es wurden keine Produktdateien geändert.

## Dynamic-Import-Parser-Re-Review

Unabhängig wurden die folgenden Quelltexte mit `sourceOverride` in den Run-Entry injiziert. Der Generator hat alle mit der Fehlermeldung `Dynamic import` abgewiesen:

- `import('./late.js')`
- Zeilenumbruch/Whitespace zwischen `import` und `(`
- `import /* comment */ ('./late.js')`
- `import // comment` gefolgt von Zeilenumbruch und `(`
- `import(variable)`

Die konservative Grenze ist nachvollziehbar und dokumentiert: derselbe Token in einem Kommentar oder String wird ebenfalls gestoppt. A09 bestätigte dies mit Proben `// import('./not-real.js')` und `const note = "import('./not-real.js')";`. Das ist ein möglicher sichtbarer Fehlblocker, führt aber nicht dazu, dass dynamische Importkanten still unversioniert ausgeliefert werden. Der aktuelle statische Run-Graph (20 Module) wird nicht fälschlich blockiert.

## Regressions- und Determinismusprüfung

Erneut ausgeführt, alle PASS:

- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs`
- `node prototype/v3/a05-t0063-offer-sensitivity-ui-regressions.mjs`
- `node prototype/v3/a05-t0063-cost-plan-fixture-ui-regressions.mjs`
- `node prototype/v3/a02-t0063-browser-run-learning-choreography-regressions.mjs`
- `node --check` für Graphgenerator, betroffene A05-Regressions und A02-Choreografie.
- `git diff --check` für den gesamten getrackten Arbeitsbaum meldet vorhandene Whitespacefehler in älteren Collaboration-State-Ergänzungen sowie LF/CRLF-Hinweise. Der neue CP-0416-Abschnitt und die beiden neuen QA-Artefakte haben keine nachgestellten Leerzeichen.

Der Generator produziert aktuell bytegleich `run.html`; Hashes: Run-Graph `sha256-77d9d84cbabe5960e0977f18b6f11e74b18c66a3b5e211b3ce76330874eab5ae`, `run.js` `1513949b156b55798955ccc9e2f439947e961f27385eee450f31f061c0f4dcd8`, CSS `d7b850446e038f60e3ff872a104aaa356f0260fd17ded14ea2616604968ad493`. Diese entsprechen CP-0413/0415; der Parserfix hat Cache-URLs, `run.html`-Output und Laufzeit nicht verändert. Finanz-/Fixturelogik blieb außerhalb der Änderungen. Der A02-Test bestätigt weiterhin die Januar-zu-Februar-Choreografie und drei Indizes zu 110.

## Getrennte Nachweisrollen

- **Ausführung:** A05-Parserfix aus CP-0415.
- **Fachreview:** Nicht erforderlich; keine Simulations-, Lern-, Finanz- oder Buchungsregeländerung.
- **Unabhängige QA:** PASS für Literal-, Whitespace-/Kommentar-, computed-Importablehnung, false-positive-Grenze, statischen Graph, Regressionen und Generatoroutput.
- **Browser-/Gerätetest:** nicht erneut ausgeführt; CP-0414-Browserbeleg bleibt unverändert gültig, weil Rungraph und Entry-Assets identisch sind.
- **Git-Verifikation:** nur scoped Status/Diff-Check, kein Commit/Push.

T-0063/T-0067/T-0069 bleiben `IN_PROGRESS`; dies ist kein Jahres-, Mobil-/Tablet- oder Releasegate. Nächster Schritt: A01 übernimmt den PASS und arbeitet die übrigen aktiven Tickets weiter.
