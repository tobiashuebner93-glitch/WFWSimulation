# A05 T-0063 – Payloadgebundener V3-Run-Entry (CP-0396)

**Status:** SHA-256-Bindung und Navigation aktualisiert; relevante Regressionen PASS; A09-Re-Review offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Vorgänger:** CP-0395 (A09 NONPASS), CP-0394 (A01 begrenzter Browser-PASS), CP-0393 (A05 Query-Cache-Fix)  
**Profil:** V3 Shared Run, `prototype/v3/run.html` / `run.js`  
**Entscheidungen:** D-0022, D-0163, D-0169

## Änderung

Der Modul-URL-Token ist jetzt der SHA-256 des tatsächlichen `prototype/v3/run.js`-Payloads: `sha256-8607f80df23e9cf7c77c9980080f8cb813459e449dad30e5c50d443ca85ddd8e`. Der Logo-Rücksprung verwendet denselben Build-Token in der `run.html`-URL.

Die Entry-Regression liest die Bytes der tatsächlichen `run.js`, berechnet SHA-256 mit Node `crypto` und erzwingt die Übereinstimmung sowohl für den Modul-URL-Token als auch den Logo-URL-Token. Eine spätere Änderung an `run.js` ohne aktualisierte HTML-Token lässt den Test fehlschlagen. Der Logo-Link navigiert vom aktuellen Dokument zu einer versionierten Seiten-URL und vermeidet für diesen Rücksprung die querylose HTML-URL.

## Hostinggrenze

Das Repository enthält keine statische Hosting-Konfiguration für HTTP-Cacheheader. Der verwendete lokale Python `SimpleHTTP/0.6`-Server liefert `Last-Modified`, aber weder `Cache-Control` noch `ETag`. Daher kann die Änderung keinen bereits zwischengespeicherten HTML-Inhalt am unversionierten direkten Einstieg global invalidieren. Sie bindet das gelieferte Modul bei aktueller HTML-Datei deterministisch an dessen Payload und versioniert die Logo-Selbstnavigation. Eine alte HTML-Kopie, die vor dieser Änderung gespeichert wurde, kann weiterhin alte Links enthalten; deren Revalidierung muss die reale Hostingebene steuern.

Der Hash bindet nur das Run-Entry-Modul, nicht automatisch seinen gesamten statischen ES-Modul-Importgraphen. Importierte Module bleiben über ihre vorhandenen URLs geladen. Es wird keine Aussage über vollständige Build-/Graphintegrität getroffen.

## Geänderte Dateien

- `prototype/v3/run.html`
- `prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs`
- `docs/simulation/a05-t0063-hashbound-run-entry-cp0396.md`
- `docs/agent-system/checkpoints/CP-0396.md`

Keine Änderung an Run-Controller, Finanz-/Ledgerlogik, Save/Restore-Semantik, Makroprojektion, Nachfragekanal, CSS, Schema oder Architektur. Bestehende CPs, einschließlich CP-0392–CP-0395, blieben unverändert.

## Prüfungen und Nachweisrollen

- **Ausführung:** A05; HTML-Entry, Logo-URL und payloadgebundene Regression aktualisiert.
- **Tests PASS:** `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs`; `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs`; `node prototype/v3/a05-t0063-macro-regressions.mjs`; `node prototype/v3-run-macro-fixture-regressions.mjs`; `node prototype/v3-run-orchestrator-regressions.mjs`; `node prototype/v3-finance-runtime-regressions.mjs`; `node prototype/a05-t0069-run-ui-regressions.mjs`; `node prototype/a09-t0069-run-ui-adversarial-regressions.mjs`.
- **HTTP:** versionierte HTML- und Modul-URL liefern lokal HTTP 200; die HTML-Antwort enthält beide URLs mit dem aktuellen Payload-Hash; die Modulantwort enthält den Renderer.
- **Cacheheader:** direkte HEAD-Prüfung bestätigt `Last-Modified`; `Cache-Control` und `ETag` fehlen im lokalen Server.
- **Fachreview:** A03 CP-0386 ist die frühere begrenzte Nichtbuchungsprüfung; kein neues Finanzreview.
- **Unabhängige QA:** A09-Re-Review dieses Fixes ausstehend.
- **Browser-/Gerätetest:** A01 CP-0394 bestätigte die Karte vor dieser Hashänderung. Re-Test nach aktuellem URL-Token ausstehend; Mobile-/Tablet-/Konsole ebenfalls offen.
- **Git:** Branch `main`, HEAD `8b72b7e`; 319 Status-Einträge bei Abschluss, bestehende Änderungen erhalten. Kein Commit/Push.
- **Whitespace:** die beiden A05-Dateien sind whitespace-frei. Globales `git diff --check` meldet weiterhin trailing whitespace in vorhandenen Änderungen von `docs/agent-system/collaboration-state.md`; dieses Dokument blieb gemäß Auftrag unangetastet. Git meldet zusätzlich LF/CRLF-Konvertierungshinweise.

## Übergabe

A01 übergibt an A09 zum unabhängigen Re-Review der Hash-/URL-Bindung, Logo-Rücksprung und statischen Cachegrenze. A12 kann anschließend den aktuellen Hash-URL-Pfad im Browser erneut prüfen. T-0063/T-0069 bleiben IN_PROGRESS; kein Release-/Finanz-/Jahresgate.
