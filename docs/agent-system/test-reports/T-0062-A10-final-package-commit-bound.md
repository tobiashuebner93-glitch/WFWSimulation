# T-0062 – A10 G10 Abschlussprüfung, commitgebunden

**Adressat:** A01 – MASTER_ORCHESTRATOR
**Prüfer:** A10 – BROWSER_GAME_TESTER
**Datum:** 2026-10-30
**Prüfart:** unabhängige, read-only Paket- und Provenienzprüfung; kein Commit/Push

## Ergebnis

**G10 Paket-/Quellbindung: PASS.** Das aktuelle Offlinepaket wurde aus dem ausgecheckten Quellcommit `7a892102e90fe98716db2c2d59c21fb59489dbf7` gebaut. `HEAD` stimmt mit der Manifestrevision `main@7a892102e90fe98716db2c2d59c21fb59489dbf7` überein; `workingTreeSourcesIncluded` ist `false`. Alle 12 manifestierten Quell-Dateien haben den erwarteten Manifest-SHA-256 und stimmen nach LF/CRLF-Normalisierung bytegenau mit den committed Git-Blobs von `HEAD` überein.

HTML, README, Manifest und ZIP sind konsistent. ZIP-Integrität ist fehlerfrei; es enthält genau HTML, README und Manifest. Die drei ZIP-Einträge stimmen bytegenau mit ihren aktuellen Einzeldateien überein. Das Manifest hasht HTML und README, aber absichtlich nicht sich selbst oder das ZIP; deshalb gibt es keinen ZIP-Selbsthash im Manifest. Der ZIP-SHA-256 ist unten separat festgehalten.

## Prüfnachweise

- `HEAD`: `7a892102e90fe98716db2c2d59c21fb59489dbf7`; Manifestrevision stimmt exakt.
- `workingTreeSourcesIncluded`: `false`.
- Manifestierte Quellen: 12/12 Hash und committed Blob-Inhalt bestätigt (nach Zeilenenden-Normalisierung).
- Eingebettete lokale Runtime-Module: 10 (`app.js`, `economics.js`, `engine.js`, `equipment.js`, `finance.js`, `learning-hsq.js`, `learning-supplemental.js`, `learning-ui.js`, `learning-wbq.js`, `planning-ui.js`).
- CSS: im einzelnen HTML vollständig im `<style>`-Block eingebettet; Inhalt nach Whitespace-Trim identisch mit `styles.css`. Kein externer Stylesheet-Link und keine Cache-Query-Abhängigkeit im HTML.
- ZIP `testzip()`: PASS; exakt 3 erwartete Einträge; alle drei extrahierten Inhalte bytegleich mit den aktuellen Dateien.
- README: beschreibt Entpacken und Öffnen der HTML-Datei in Safari auf iOS/iPadOS 16.4+, Spielstand sichern/laden und die Offline-Eigenschaft. Es weist reale Geräteprüfung als separat aus.

## Aktuelle SHA-256-Prüfsummen

| Datei | SHA-256 |
|---|---|
| `prototype/werkstatt-v2-iphone.html` | `ab5586a0ddf182777c70a227b4afee5514eab3de3caa0b11d1e633991cc64935` |
| `prototype/werkstatt-v2-iphone.zip` | `701ef7b3d869ea7993e422d293acd676fa3b9ba2311ed2a97970427bc91a91ea` |
| `prototype/werkstatt-v2-package-manifest.json` | `068bfa4dcfe37b6539890e0e9aa21d66201c832938cdc293fb67212feb8f3036` |
| `prototype/WERKSTATT-V2-IPHONE-README.txt` | `d4438ac5253b65fca2ef9adbc460f23838fbfbb11a0c852d7234e96d1c63c49a` |

## Commit- und Releasegrenze

Die **Quellbindung** ist PASS und ohne Working-Tree-Quellen reproduzierbar zugeordnet. Das ist kein Nachweis, dass die generierten Artefakte selbst bereits committet oder gepusht sind. Zum Prüfzeitpunkt zeigt Git `main...origin/main [ahead 2]` und drei geänderte getrackte Paketdateien: HTML, ZIP und Manifest. Ein Artefakt-Commit bleibt daher separat offen. Nach diesem Bericht ist zusätzlich dessen neue Reportdatei zu berücksichtigen. A10 hat weder Produkt-/Paketdateien noch CP/MCP geändert und keinen Commit/Push ausgeführt.

Diese Prüfung bestätigt Hash-, Inhalts- und Paketkonsistenz. Sie bestätigt keine neue interaktive Browser-/Geräteabnahme; die README benennt diese Grenze zutreffend.
