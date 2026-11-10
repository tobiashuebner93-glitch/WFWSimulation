# A05 T-0063 – Cache-Version für den Shared-Run-Einstieg (CP-0393)

**Status:** Cache-busting-Fix integriert; Entry-/Makroregressionen PASS; A12-Browserretest offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Vorgänger:** CP-0392 (A12 Browser-NONPASS), CP-0391 (A09 Re-Review), CP-0390 (A05 Vorzeichenfix)  
**Profil:** V3 Shared Run, 2027, `prototype/v3/run.html`  
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169

## Befund und Änderung

A01 bestätigte A12s Browserbefund im frischen IAB-Tab: Die normale Run-Seite lud den Makromonat und die Planprojektionen, aber nicht die Finanzierungsreferenz. Der Controller-Aufruf übergab `getRunProjection(run)` bereits korrekt an `renderMacroSummary`; der isolierte Renderer-Test war bestanden.

Der HTML-Einstieg lud das ES-Modul bisher unversioniert als `./run.js`. Ein Query-Parameter an `run.html` ändert die relative Modul-URL nicht. Deshalb lädt der Browser nun `./run.js?v=v3-t0063-cp0393`. Die eindeutige Entry-URL umgeht eine im Browser bereits zwischengespeicherte ältere Version des Run-Moduls. Ein HTML-Kommentar hält fest, den Identifier bei künftigen Änderungen am V3-Run-Einstieg fortzuschreiben. CSS wurde nicht versioniert, weil diese Änderung keine Stylesheetdatei ändert.

Die Änderung betrifft nur das Asset-Binding; keine Finanzierungs-, Projektions-, Controller-, Simulations-, Nachfrage- oder Datenbankregeln wurden geändert. D-0022-Benchmark, Pending-Status und Finanz-/D-0169-Nichtmutation bleiben in den bestehenden Rendering-/Projektionsregressionen geprüft.

## Geänderte Dateien

- `prototype/v3/run.html`
- `prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs`
- `docs/simulation/a05-t0063-run-entry-cache-fix-cp0393.md`
- `docs/agent-system/checkpoints/CP-0393.md`

## Prüfungen und Nachweisrollen

- **Ausführung:** A05; Modul-Entry-URL versioniert und automatisiert abgesichert.
- **Regressionen:** `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` PASS; `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` PASS; `node prototype/v3-run-macro-fixture-regressions.mjs` PASS; `node prototype/v3/a05-t0063-macro-regressions.mjs` PASS.
- **Live-HTTP-Verifikation:** `run.html?refresh=cp0390` lieferte HTTP 200 und verwies auf `run.js?v=v3-t0063-cp0393`; genau diese Modul-URL lieferte HTTP 200 und den aktuellen Rendercode.
- **Fachreview:** A03 CP-0386 deckt nur die finanzielle Nichtbuchungsgrenze ab; kein erneutes Fachreview dieses Cache-Bindings.
- **Unabhängige QA:** A09 Re-Review nach A12-NONPASS ausstehend.
- **Browser-/Gerätetest:** A01 hat den Ausgangsfehler im echten Browser bestätigt; nach dem Fix ist der Browserretest noch offen. CP-0392 bleibt unverändert.
- **Git:** Branch `main`, HEAD `8b72b7e`; 314 Status-Einträge im bereits umfangreichen Arbeitsbaum. Fremde Änderungen erhalten. Kein Commit oder Push.
- **Whitespace:** `git diff --check` PASS; nur bestehende LF/CRLF-Konvertierungshinweise.

## Übergabe

A01 beauftragt A12 mit demselben normalen Shared-Run-Pfad nach Reload und prüft, ob die Karte mit MRO-unavailable, D-0022-Benchmark und `pending` jetzt erscheint. Danach A09 prüft Entry-Buildbindung und die Runtime-/Finanzinvarianten unabhängig. T-0063/T-0069 bleiben IN_PROGRESS.
