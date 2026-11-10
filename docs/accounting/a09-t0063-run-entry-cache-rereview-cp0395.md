# A09 T-0063 – Run-Entry Cache-/Build-Bindung Re-Review (CP-0395)

**Status:** NONPASS nur für Cache-/Build-Bindung; übrige automatisierte Run-/Makroprüfungen PASS  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0069 angrenzend offen  
**Vorgänger:** CP-0394 (A01 Desktop-Run), CP-0393 (A05 versionierter Entry), CP-0392 (A12 fehlende Karte), CP-0391 (A09 Finanzreferenz-Re-Review)  
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169  
**Checkout:** `main`, HEAD `8b72b7e`; 317 Status-Einträge zu Beginn der Prüfung.

## Preflight und Prüfumfang

Vollständiger AGENTS.md-Preflight durchgeführt: Agentenstruktur/Rechte, MG-002-Ziele, T-0063/T-0069, Collaboration State, Decision Log, CP-0392/0393/0394, A12-Rollenprofil, A05-Bericht, lokale Änderungen und offene Gates wurden gelesen/geprüft. CP-0392–0394 blieben unverändert. Keine Produktdatei und kein bestehendes Checkpointdokument wurde geändert.

Adversarial geprüft wurden HTML-Entry, versioniertes `run.js`, reale Regressiondatei/-assertions, URL-Auflösung der Markenverknüpfung, lokaler HTTP-Cacheheader, sowie automatisierte Runstart-, Makro-, Finanzreferenz-, Save/Restore- und UI-Invarianten. Es wurde keine Browser-/Geräteprüfung durch A09 behauptet.

## Befund

### Bestanden: aktueller Entry funktioniert bei aktualisiertem HTML

`prototype/v3/run.html` hat genau einen ES-Modul-Einstieg mit `./run.js?v=v3-t0063-cp0393`. Der Token entspricht CP-0393 und liegt korrekt am Modul-URL. Der normale lokale HTTP-Aufruf ohne `refresh`-Query lieferte HTTP 200; das Modul unter der aufgelösten versionierten URL lieferte ebenfalls HTTP 200 und enthielt `renderMacroFinancingReference`. Der A01-Nachweis CP-0394 bestätigt zudem den sichtbaren Ersttag im frischen Browserkontext mit `?refresh=cp0393`.

### NONPASS: Cache-Token ist nicht an den Modul-Payload gebunden

Die tatsächliche Datei heißt **`prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs`**; die vorher vermutete `a05-t0063-run-entry-cache-regressions.mjs` existiert nicht. Die gefundene Regression liest nur `run.html`, zählt einen Moduleintrag und vergleicht dessen `src` mit der fest codierten Zeichenfolge `./run.js?v=v3-t0063-cp0393`. Sie prüft weder den Inhalt/Hash von `run.js` noch, dass eine geänderte Moduldatei einen neuen Cache-Token erhält. Wird `run.js` künftig geändert und der Kommentar/Token nicht manuell angehoben, besteht die Regression unverändert.

Der Token wirkt außerdem nur für das Top-Level-`run.js`; dessen ES-Modulimporte (darunter `../v3-financing-reference.js`) bleiben unversionierte URLs. Der Token bindet daher nicht den gesamten geladenen Modulgraphen an denselben Buildstand. A05s HTTP-200-/Payload-Sichtprüfung ist ein einmaliger Berichtsnachweis, keine automatisierte Regression.

### NONPASS: normales HTML-Refresh-/Logo-Verhalten ist nicht cache-sicher nachgewiesen

Die Markenverknüpfung lautet `./run.html`. Auf der CP-0394-Adresse `run.html?refresh=cp0393` löst sie zu `run.html` ohne Query auf; das wurde mit URL-Auflösung reproduziert. Das ist nach Laden der aktuellen HTML-Datei grundsätzlich erwartbar, weil deren Script-URL den Modul-Token trägt. Es erzwingt aber selbst keine Aktualisierung eines zuvor zwischengespeicherten HTML-Dokuments.

Der lokale HTTP-Server lieferte für HTML/Modul `Last-Modified`, aber weder `Cache-Control` noch `ETag`. CP-0394 verwendete eine neue `refresh`-URL und belegt daher nicht, wie ein bereits benutzter Browser über den normalen querylosen Einstieg oder die Logo-Verknüpfung mit einer alten HTML-Kopie umgeht. Ein altes HTML-Dokument kann weiterhin den früher unversionierten Modulpfad referenzieren. Diese Revalidierungs-/Navigationsfrage bleibt offen.

## Regressionen und Prüfausgaben

Alle folgenden Befehle bestanden:

- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS (prüft nur die statische HTML-URL-Zeichenfolge; nicht payloadgebunden).
- `node prototype/v3/a09-t0063-financing-reference-adversarial-review.mjs` – PASS.
- `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-macro-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- `node prototype/a09-t0069-run-ui-adversarial-regressions.mjs` – PASS.

`git diff --check` lieferte Exit 1 wegen vorhandener trailing-whitespace-Zeilen in bereits geänderten `docs/agent-system/ticket-board.md` und `docs/agent-system/collaboration-state.md`; A09 hat diese Dateien nicht verändert oder bereinigt. Andere Git-Warnungen betreffen die konfigurierte LF/CRLF-Konvertierung. Kein Commit/Push.

## Nachweisrollen und Übergabe

- **Ausführung:** A09, read-only Review und bestehende Regressionen.
- **Fachreview:** A03 CP-0386 bleibt auf die Finanz-Nichtbuchungsgrenze begrenzt.
- **Unabhängige QA:** dieses Ergebnis; NONPASS ausschließlich für Cache-/Build-Bindung und stale-HTML-Navigation.
- **Browser-/Gerätetest:** A01 CP-0394 ist ein begrenzter frischer Desktop-IAB-Ersttagstest; A09 hat keinen Browser-/Mobiltest ausgeführt. Normaler queryloser Refresh/Logo-Pfad wurde nicht im Browser geprüft.
- **Git-Verifikation:** HEAD `8b72b7e`; Statusbestand 317 Einträge zu Beginn; Änderungen erhalten. Es wurden keine bestehenden CPs verändert.

**Folgeauftrag an A01:** A05 soll die Cache-/Build-Bindung robust machen und automatisiert prüfen, dass ein geänderter Run-Modul-Payload einen neuen Asset-Identifier erhält (oder einen Hash-/Manifestmechanismus verwenden). A05 soll außerdem die stale-HTML-/Logo-Navigation für den normalen Einstieg absichern oder die verpflichtenden Cache-Header im tatsächlich ausgelieferten Build festlegen. Danach sind Entry-Regression, queryloser HTTP-/Browserreload und Logo-Rücksprung erneut unabhängig zu prüfen. Keine Nutzerentscheidung erforderlich.
