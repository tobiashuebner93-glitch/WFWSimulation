# A05 T-0063 – Statusmeldung im normalen Seitenfluss (CP-0399)

**Status:** Overlay beseitigt; gezielte CSS-/Entry-/UI-Regressionen PASS; A09-Re-Review offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0069 angrenzend  
**Vorgänger:** CP-0398 (A01 Desktop-Browserbefund), CP-0397 (A09 Hash-Review), CP-0396 (A05 Entry-/Hash-Bindung)  
**Profil:** V3 Shared Run, Desktop und schmale Viewports  
**Entscheidungen:** D-0022, D-0163, D-0169

## Änderung

`#live-status` verwendet jetzt bereits im Basisstil `position: static`; damit bleibt die Meldung auf Desktop und Mobilgeräten im normalen Dokumentfluss und liegt nicht über Seiteninhalten. Der mobile Statusstil bleibt ebenfalls statisch. Der vorhandene Leerzustand `.live-status:empty { display: none }` bleibt erhalten, damit ein leerer Status keinen sichtbaren Bereich oder zusätzlichen Abstand erzeugt.

Das HTML behält `role="status"` und `aria-live="polite"`; der Run-Controller setzt die sichtbaren Meldungstexte weiterhin über `status.textContent`. Es wurden keine Lauf-, Finanz- oder Meldungstexte geändert.

Da die CSS-Datei zuvor querylos geladen wurde, ist auch ihr Assetpfad jetzt payloadgebunden. `run.html` referenziert `run.css` mit seinem SHA-256. Die Logo-Selbstnavigation trägt einen Buildtoken aus den `run.js`- und `run.css`-Hashes. Die vorhandene Entry-Regression berechnet jetzt beide Payloadhashes und erzwingt deren Übereinstimmung mit Modul-, Stylesheet- und Logo-URL.

## Geänderte Dateien

- `prototype/v3/run.css`
- `prototype/v3/run.html`
- `prototype/v3/a05-t0063-live-status-flow-regressions.mjs`
- `prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs`
- `docs/simulation/a05-t0063-live-status-flow-cp0399.md`
- `docs/agent-system/checkpoints/CP-0399.md`

Keine Änderungen an Simulation, Finanzzustand, Statusmeldungsinhalt, Save/Restore, Markt, Architektur oder Schema. CP-0397/0398 blieben unverändert.

## Prüfungen und Nachweisrollen

- **Ausführung:** A05; Statuslayout in normalem Fluss, Entry-/Stylesheet-Versionierung und Regressionen.
- **Gezielte Regression:** `node prototype/v3/a05-t0063-live-status-flow-regressions.mjs` PASS: Desktopbasis `static`, keine `sticky`-/`fixed`-Regel an `.live-status`, Leerzustand verborgen, Statusrolle und `aria-live` vorhanden, sichtbare Controllertexte bleiben zugewiesen.
- **Entry-/Cache-Regression:** `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` PASS; SHA-256 aus tatsächlichen `run.js`- und `run.css`-Bytes stimmt mit ihren URLs überein; Logo-Buildtoken stimmt mit beiden Hashes überein.
- **Run-UI-Regression:** `node prototype/a05-t0069-run-ui-regressions.mjs` PASS.
- **Unabhängige QA:** A09-Re-Review nach CP-0398 offen.
- **Browser-/Gerätetest:** CP-0398 dokumentiert den Desktop-Overlaybefund; Browserprüfung nach dieser Korrektur ausstehend. Kein neuer Desktop-/Mobiletest behauptet.
- **Hostinggrenze:** Der zuvor dokumentierte lokale Server kontrolliert keine `Cache-Control`-/`ETag`-Header. Hashversionierte Assets und Logo-Navigation binden den aktuellen Build; dies ist keine Aussage, dass ein bereits gespeichertes altes HTML am unversionierten Direkteinstieg global invalidiert wird.
- **Git:** Branch `main`, HEAD `8b72b7e`; 324 Status-Einträge im vorhandenen Arbeitsbaum. Fremde Änderungen blieben erhalten. Kein Commit/Push.
- **Whitespace:** `git diff --check` PASS; A05-Dateien frei von trailing whitespace. Git meldet die vorhandenen LF/CRLF-Hinweise.

## Übergabe

A01 gibt CP-0399 an A09 zur unabhängigen Prüfung der Desktop-/Mobilstatusregeln, Leerzustandssemantik, Statusregion-Zugänglichkeit und JS/CSS-Hashbindung. Danach folgt ein begrenzter Browser-Retest, der beim Scrollen bestätigt, dass der Meldungstext den Inhalt nicht überlagert. T-0063/T-0069 bleiben IN_PROGRESS.
