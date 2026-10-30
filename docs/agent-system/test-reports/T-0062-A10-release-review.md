# T-0062-A10-Review – Offlinepaket und Release-Provenienz

**STATUS:** A10-Prüfung abgeschlossen; technische Paketprüfung PASS, formales Gate OFFEN  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A10 – DEVOPS_INFRASTRUCTURE  
**MASTER GOAL / SECOND-LEVEL GOAL:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0062 / V2-G10  
**Vorgängerbeleg:** CP-0265; Koordinierungsfortschreibung CP-0266 (Entwurf)  
**Prüfrevision:** Branch `main`, HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`; vorhandener Dirty Working Tree, Änderungen anderer Rollen erhalten. Der Paketinhalt bezieht sich explizit auf Arbeitsbaumquellen.

## Preflight und Umfang

Gelesen wurden `AGENTS.md`, `agent-structure.md`, `agent-rights-matrix.md`, `goals.md`, `ticket-board.md`, `collaboration-state.md` und `decision-log.md`. Geprüft wurden der Paketbuilder, die Paket-HTML, ZIP, README und das Manifest. Der reproduzierbare Neubau schrieb ausschließlich in einen temporären Ausgabeordner; der bestehende Prototyp-Paketbestand wurde nicht überschrieben. Keine Produktdatei wurde geändert. Kein Commit, Push, Deployment oder Architektur-/Schemaentscheid.

## Befunde

- `node prototype/build-iphone-package.mjs --output-dir <temp>` erzeugte dieselben SHA-256-Werte wie die bestehenden Dateien:
  - HTML `werkstatt-v2-iphone.html`: `0dd34a0b7be3becf8a1ee33c737a01c495fde18bde8675e9f2555c712a1cc8ae`
  - ZIP `werkstatt-v2-iphone.zip`: `93a6ff00cf5dac0738bc1e8b2ca6e70a8066b7c05795f11fadbac200358bc27b`
  - Manifest: `830908f0201ad79e7d2c6e19a8ce629475b64ecd7bf3096dfa885feb29f3050d`
  - README: `d4438ac5253b65fca2ef9adbc460f23838fbfbb11a0c852d7234e96d1c63c49a`
- Alle 12 im Manifest deklarierten Quelldateien (`index.html`, Styles und 10 Runtime-Module) stimmen bytegenau mit den angegebenen SHA-256-Werten überein.
- Das ZIP enthält exakt drei erwartete Einträge: HTML, README und Manifest. Jeder Eintrag entspricht der gleichnamigen Arbeitsbaumdatei bytegenau.
- Manifest nennt `sourceRevision: main@194fbaa7069ef59d1c832164a21b06f1cd2102d` und `workingTreeSourcesIncluded: true`. Damit wird kenntlich gemacht, dass der Paketbuild lokale Quelländerungen enthält; die Quellhashes identifizieren den tatsächlich eingebetteten Inhalt. Das ist nachvollziehbar, aber kein sauberer commitgebundener Releasebeleg.
- README nennt Safari iOS/iPadOS 16.4+, erklärt, dass die Dateien-App-Vorschau die Interaktion nicht zuverlässig ausführt, beschreibt Speichern/Laden und den Transfer des identischen Pakets zwischen Geräten und weist auf mögliche Verluste durch Löschen von Safari-Daten hin. Die Einschränkungen sind sichtbar.
- Der Paketinhalt und die Begleitdokumente behaupten keine Architektur- oder Schemafreigabe. Ein Geräte-/Browserlauf wurde von A10 nicht vorgenommen; der Nutzer-Gerätebeleg ist nur als vorhandene Nutzerbestätigung aus CP-0265 referenziert.

## Gateentscheidung

**V2-G10 technische Arbeitsbaumprüfung: PASS.** Der Paketbuilder ist reproduzierbar, Manifest und ZIP-Inhalt sind konsistent und die Quellen sind gehasht.

**V2-G10 formale Release-/Commitbindung: OFFEN.** Working Tree ist geändert und der Build ist nicht an einen geprüften gemeinsamen Release-Commit gebunden. A10 hat weder Commit noch Push ausgeführt oder freigegeben. Nach einem späteren gemeinsamen Commit müssen Build, Hashvergleich und Berichte für exakt diesen Commit erneut erzeugt/gebunden werden. Die separate Nutzerbestätigung des Gerätebelegs aus CP-0265 bleibt bestehen; A10 hat kein Gerät selbst getestet.

## Prüfkommandos

- `node prototype/build-iphone-package.mjs --output-dir <temp>`
- PowerShell `Get-FileHash -Algorithm SHA256` für vorhandene und neu gebaute HTML, ZIP, Manifest und README
- Hashvergleich der 12 manifestierten Quellfiles
- ZIP-Entry-Inventur und Vergleich jedes Eintrags gegen die Arbeitsbaumdatei über `System.IO.Compression.ZipFile`
- `git diff --check` (Exit 0; Git meldete nur LF/CRLF-Konvertierungshinweise)

**FACHREVIEW:** A10 DevOps/Provenienzprüfung ausgeführt; Finanz-/Simulationsfachreview nicht Aufgabe dieses Berichts.  
**UNABHÄNGIGE QA:** A09 separat zuständig; eigener Bericht wird unabhängig geführt.  
**BROWSER-/GERÄTETEST:** Von A10 nicht ausgeführt; vorhandener Nutzerbeleg wird nicht als A10-Test dargestellt.  
**GIT-VERIFIKATION:** HEAD/Branch/Dirty Tree geprüft; kein Commit-/Pushvorgang.

## Nächster Schritt

A01 kann die technischen G10-Hashbelege übernehmen. V2-G10 bleibt bis zur erneuten Build-/Hashprüfung auf einem gemeinsamen sauberen Commit formal OFFEN.
