# T-0062 – A10 unabhängige G10-Prüfung nach A05-Rebuild

**Status:** Technischer G10-PASS auf Working Tree; Commitbindung offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A10 – DEVOPS_INFRASTRUCTURE
**Goal/Ticket:** MG-002 / SLG-002.2, SLG-002.4, SLG-002.5 / T-0062
**Prüfbasis:** `main@194fbaab7069ef59d1c832164a21b06f1cd2102d`, Arbeitsbaum geändert; CP-0271 (ENTWURF), aktuelle A05-Änderungen und danach neu gebautes Offlinepaket.

## Preflight

Gelesen: `AGENTS.md`, `agent-structure.md`, `agent-rights-matrix.md`, `goals.md`, `ticket-board.md`, `collaboration-state.md`, `decision-log.md`, `v2-v12-goal-map.md` und `CP-0271.md`. Maßgeblich sind MG-002 und T-0062. T-0062 ist IN_PROGRESS; Gateberichte müssen für dieselbe Quellrevision belegt sein. Architektur-/Schemafreigaben sind nicht Gegenstand dieser Paketprüfung. Relevante spätere Entscheidungen im gelesenen Decision Log: D-0157 bis D-0160; D-0160 begrenzt die V2-Finanzreihenfolge und 19-%-SimTAX. CP-0271 dokumentiert Touch-/Keyboard- und Responsive-Befunde, bleibt Entwurf. Git-Status: `main...origin/main`, 23 geänderte getrackte sowie vorhandene ungetrackte CP-/Testdateien; nichts wurde angetastet.

## Prüfumfang und Ergebnis

- Alle 12 im Manifest genannten Quell-SHA-256 stimmen mit den aktuellen Working-Tree-Dateien überein.
- Manifest-Hashwerte für HTML und README stimmen mit den gelieferten Dateien überein.
- ZIP ist lesbar und `testzip()` meldet keinen beschädigten Eintrag. Es enthält genau `werkstatt-v2-iphone.html`, `WERKSTATT-V2-IPHONE-README.txt` und `werkstatt-v2-package-manifest.json`.
- Die HTML-, README- und Manifest-Einträge im ZIP sind bytegleich mit den aktuellen Dateien.
- Alle 10 erwarteten lokalen Runtime-Module sind in `wfwsim-sources` eingebettet.
- Vollständige aktuelle `styles.css` ist als eingebettetes `<style>` enthalten; kein externer Stylesheet-Link verbleibt.
- README enthält iPhone/iPad-Safari-Mindestversion, Öffnungshinweise, Offlinebetrieb, Speichern/Laden und Grenzen.

**Technischer G10-Status: PASS für dieses Working-Tree-Artefakt.**

## Aktuelle Prüfsummen

| Datei | SHA-256 |
|---|---|
| `werkstatt-v2-iphone.html` | `ab5586a0ddf182777c70a227b4afee5514eab3de3caa0b11d1e633991cc64935` |
| `werkstatt-v2-iphone.zip` | `ecc983fb0e85eedff4b33db9daaf9f734546107b224310aba7d5972aa65cf97f` |
| `werkstatt-v2-package-manifest.json` | `0b8804ac547d528035c8d7db5d000a121905d475a0bec7c987afa6823f9f17e2` |
| `WERKSTATT-V2-IPHONE-README.txt` | `d4438ac5253b65fca2ef9adbc460f23838fbfbb11a0c852d7234e96d1c63c49a` |

Das Manifest nennt `sourceRevision: main@194fbaab7069ef59d1c832164a21b06f1cd2102d` und `workingTreeSourcesIncluded: true`. Das ist korrekt als Working-Tree-Provenienz, aber es bindet die geänderten Quellen nicht ausschließlich an den genannten Commit. **Commitgebundener G10-/Release-Nachweis bleibt daher offen.** Der Nutzer-Gerätebeleg existiert separat; A10 hat keine erneute physische iPhone-/iPad- oder Safari-Prüfung vorgenommen.

## Commit-/Buildsequenz ohne falsche Provenienz

1. Die geprüften Quell-, Governance- und Testdateien nach erfolgreicher Gesamtfreigabe in einen klaren Sicherungs-/Release-Quellcommit aufnehmen.
2. Den Offlinebuilder anschließend auf genau diesem Commit ausführen und kontrollieren, dass die Hashes der Paketquellen mit diesem Commit übereinstimmen.
3. Das erzeugte HTML/ZIP/Manifest entweder als Releaseartefakt diesem Quellcommit zuordnen oder in einem separaten Artefakt-Commit sichern. Das Manifest bleibt auf den Quellcommit aus Schritt 1 bezogen; es darf nicht behaupten, die Paketdateien selbst seien bereits Bestandteil dieses Quellcommits.
4. A09 bindet seine abschließende Committee-Prüfung und alle Gateberichte explizit an denselben Quellcommit und die dort gehashte Paketidentität. Bei weiteren Produktänderungen muss Build und Committee-Recheck wiederholt werden.

Kein Produktcode, Buildscript, CP/MCP oder Paket wurde durch dieses Review geändert. Kein Commit oder Push.
