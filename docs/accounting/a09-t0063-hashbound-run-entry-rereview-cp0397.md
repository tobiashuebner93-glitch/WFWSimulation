# A09 T-0063 – SHA-256-gebundener Run-Entry Re-Review (CP-0397)

**Status:** PASS im begrenzten Entry-/Payload-Bindungsumfang; Hosting-/Importgraphgrenzen bleiben außerhalb dieses Nachweises  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0069 angrenzend offen  
**Vorgänger:** CP-0396 (A05 SHA-256-Fix), CP-0395 (A09 NONPASS), CP-0394, CP-0393  
**Entscheidungen:** D-0022, D-0163, D-0169  
**Checkout:** `main`, HEAD `8b72b7e`; 321 Status-Einträge im Preflight.

## Ergebnis

A09 berechnete SHA-256 aus den tatsächlichen lokalen `run.js`-Bytes: `8607f80df23e9cf7c77c998008f0c8b813459e449dad30e5c50d443ca85ddd8e`. Der Script-Token `sha256-8607f80df23e9cf7c77c998008f0c8b813459e449dad30e5c50d443ca85ddd8e` stimmt exakt überein. Die Logo-URL verwendet denselben Token auf `run.html`; sowohl HTML- als auch aufgelöste Modul-URL liefern lokal HTTP 200.

Die Entry-Regression liest rohe `run.js`-Bytes und prüft Modulpfad, SHA-256-Query und Logo-Token. Ein Mutationstest in einer isolierten temporären Kopie ersetzte den Token durch einen falschen Nullhash; der Test schlug erwartungsgemäß mit der Assertion „URL token is the SHA-256 of the exact run.js payload“ fehl. Repositorydateien wurden durch den Mutationstest nicht verändert.

Damit ist der CP-0395-Befund zur fehlenden Token-Payload-Kopplung für das Top-Level-Run-Modul behoben. Der Logo-Rücksprung ist nun queryversioniert. PASS gilt nicht als vollständiger Hostingcache- oder Modulgraphnachweis.

## Verbleibende Grenzen

- Der lokale Python-Server liefert `Last-Modified`, aber keine `Cache-Control`- oder `ETag`-Header. Der Hash kann deshalb keine vor der Änderung gespeicherte HTML-Kopie am direkten, unversionierten Einstieg invalidieren. Das tatsächliche Server-/CDN-Caching bleibt Hostingverantwortung.
- Der Hash umfasst ausschließlich `run.js`, nicht dessen transitive statische ES-Modulimporte. Diese Grenze ist im A05-Bericht und diesem QA-Nachweis ausdrücklich offengelegt.
- A09 hat keinen Browser-/Gerätecheck ausgeführt. CP-0394 liegt vor dem CP-0396-Hashwechsel. Kein aktueller Browser-, Mobil-, Release- oder Jahres-PASS.

## Unabhängige Prüfungen

- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS; SHA-256, Script-Pfad, Logo-Pfad und Tokenbindung.
- Mutationstest der Regression mit absichtlich falschem Token – korrekt abgewiesen.
- Lokaler HTTP-Probe: queryversionierte `run.html` und `run.js` jeweils HTTP 200; gehashte Modulantwort stimmt mit lokalem Payload überein; Logo-HREF trägt identischen Token.
- `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-macro-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- `node prototype/a09-t0069-run-ui-adversarial-regressions.mjs` – PASS.
- `node prototype/v3/a09-t0063-financing-reference-adversarial-review.mjs` – PASS; darunter Save/Restore-Projektion, Run-/Finance-Nichtmutation und Makro-/Finanzanzeige.
- `git diff --check` – Exit 1 wegen vorhandener trailing-whitespace-Zeilen in geändertem `docs/agent-system/collaboration-state.md`; A09 änderte dieses Dokument nicht. Zusätzlich meldet Git konfigurierte LF/CRLF-Hinweise.

## Nachweisrollen

- **Ausführung:** A05 CP-0396, Entry-/Regressionänderung.
- **Finanzfachreview:** A03 CP-0386, enger Nichtbuchungsscope; keine neue Finanzregel.
- **Unabhängige QA:** A09, dieser Re-Review; PASS nur für den Hash-/URL-Vertrag und die genannten automatisierten Eigenschaften.
- **Browser-/Gerätetest:** nicht ausgeführt. A01 CP-0394 war vor dem neuen Hash-Token. Browser-/Mobilretest bleibt A01/A12 überlassen.
- **Git:** HEAD `8b72b7e`; lokale Änderungen erhalten. A09 änderte keine Produktdatei, keine bestehenden CPs sowie weder `ticket-board.md` noch `collaboration-state.md`; kein Commit/Push.

**Folgeschritt an A01:** A12/A01 kann den queryversionierten Hash-Entry im Browser erneut öffnen. Vor einem Release sind zusätzlich die reale Hostingcache-Policy und bei Bedarf die transitive Modulgraphversionierung zu prüfen. T-0063 und T-0069 bleiben IN_PROGRESS.
