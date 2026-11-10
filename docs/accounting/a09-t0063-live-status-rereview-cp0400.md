# A09 – unabhängiger Re-Review CP-0399

**Status:** Begrenztes statisches/Regression-PASS; Browser- und HTTP-Nachweis nicht ausgeführt
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0069 angrenzend
**Basis:** CP-0397–CP-0399, insbesondere A05-Fix CP-0399; D-0022, D-0163, D-0169

## Ergebnis

Der A05-Fix erfüllt die geprüften statischen UI-Kriterien. `#live-status` hat in der Basisregel `position: static`; die Mobilregel bleibt ebenfalls statisch. In sämtlichen `.live-status`-Regeln wurde keine `fixed`- oder `sticky`-Positionierung gefunden. Der Leerzustand wird durch `.live-status:empty { display:none }` ausgeblendet. Das HTML enthält weiterhin `role="status"` und `aria-live="polite"`; im Controller sind weiter `status.textContent`-Zuweisungen für Statusmeldungen vorhanden.

Die vorhandene Entry-Regression bindet die tatsächlichen Bytes von `run.js` und `run.css` mit SHA-256 an ihre jeweiligen Query-Tokens. Die Logo-Selbstnavigation enthält denselben Buildtoken aus beiden Hashes. Unabhängig berechnete Werte:

- `run.js`: `8607f80df23e9cf7c77c9980080f8cb813459e449dad30e5c50d443ca85ddd8e`
- `run.css`: `d7b850446e038f60e3ff872a104aaa356f0260fd17ded14ea2616604968ad493`

Alle referenzierten Token stimmten damit überein. Ein isolierter Mutationstest änderte ausschließlich im temporären Kopierverzeichnis den Stylesheet-Token auf 64 Nullen. Die Entry-Regression endete mit Exit 1 und der erwarteten Assertion `stylesheet token is the SHA-256 of the exact run.css payload`. Das Repository wurde dabei nicht verändert.

## Prüfumfang und Ergebnisse

- `node prototype/v3/a05-t0063-live-status-flow-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` — PASS; JS-/CSS-Hashwerte ausgegeben und bestätigt.
- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS.
- Mutationstest im temporären Verzeichnis — erwartete Ablehnung eines falschen CSS-Tokens, Exit 1.
- Manuelle Prüfung von `run.html`, allen `run.css`-Regeln für `.live-status` und `run.js`-Statuszuweisungen — PASS.
- Relevante Quelldateien — keine Zeilen mit trailing whitespace.

## Grenzen und offene Nachweise

Kein Browser- oder Mobilgerätetest wurde durch A09 durchgeführt; A01 soll den CP-0399-Browserretest separat dokumentieren. Ein HTTP-Status-/Ressourcenauflösungstest war in dieser Umgebung wegen Socket-Zugriffsverweigerung auf `127.0.0.1:8033` nicht möglich. Daher wird kein HTTP-200- oder Browser-PASS behauptet.

Der Payload-Hash bindet die Top-Level-Dateien `run.js` und `run.css`, nicht deren transitive Imports. Er invalidiert außerdem keine bereits gespeicherte HTML-Datei am unversionierten Direkteinstieg und belegt keine Cache-Control-/ETag-Policy des Hostings. Diese Einschränkungen sind keine Abweichung vom CP-0399-Umfang, bleiben aber separate Hosting-/Importgraphgates.

## Git-/Whitespace-Status

`git rev-parse --show-toplevel` liefert `C:/Users/Tobia/Documents/GitHub/WFWSimulation`; Git-Kommandos `git status --short` und `git diff --check` scheitern in dieser Laufumgebung jedoch mit `fatal: this operation must be run in a work tree`. Deshalb konnte weder der vollständige Arbeitsbaumstatus noch `git diff --check` durch Git verlässlich festgestellt werden. Direkte Prüfung der sechs betroffenen Quell-/Regressiondateien fand keine Zeilen mit trailing whitespace. Es wurden keine bestehenden Änderungen verworfen oder bereinigt.

Keine Produktdatei, kein Ticketboard und kein Collaboration State geändert. Kein Commit oder Push.
