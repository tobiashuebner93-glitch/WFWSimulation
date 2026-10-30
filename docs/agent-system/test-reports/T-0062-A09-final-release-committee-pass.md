# T-0062 – A09 finales Release-Committee-Urteil

**STATUS:** RELEASE COMMITTEE **PASS** für den geprüften V2-Releasekandidaten
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA / RELEASE COMMITTEE
**MASTER GOAL:** MG-002
**SECOND-LEVEL GOALS:** SLG-002.2 / SLG-002.4 / SLG-002.5
**TICKET:** T-0062
**Prüfdatum:** 2026-10-30
**Releasecommit:** `d18ec35b86f258306af73410496890c18ecbce64`
**Produktquellcommit:** `7a892102e90fe98716db2c2d59c21fb59489dbf7`
**Vorgänger-CP:** CP-0272

## Urteil und T-0060

**T-0060 Same-Release-Kriterium: PASS.** Der geprüfte Releasecommit `d18ec35…` hat exakt den geprüften Produktquellcommit `7a89210…` als Elterncommit. Er enthält die dazu gebauten HTML-, ZIP- und Manifestartefakte sowie CP-0272 und die zuvor erstellten Gateberichte. Das Manifest bindet die Runtimequellen ausdrücklich an `main@7a892102e90fe98716db2c2d59c21fb59489dbf7` und meldet `workingTreeSourcesIncluded=false`. A01s Regressionen-/Jahressmoke-Retest nennt exakt diesen Quellcommit. A09s unabhängig geprüfte G03/G08-Matrix und ihre Touch-/Keyboard-Browserbelege sind im gesicherten Produktquellstand enthalten; zwischen diesem geprüften UI-/Simulationsstand und `7a89210…` wurde ausschließlich der Paketbuilder zur korrekten Quellenprovenienz angepasst. Der Releasecommit `d18ec35…` ändert danach keine Runtimequellen, sondern sichert Paketartefakte und Nachweise.

A10s `T-0062-A10-final-package-commit-bound.md` wurde vor dem Artefaktcommit erstellt. Seine Aussage, dass die Paketdateien damals noch uncommitted waren, ist ein zutreffender historischer Zwischenstand und kein nachträglicher Blocker. A09 hat nach dem Artefaktcommit HEAD/Elterncommit, sauberen Arbeitsbaum, committed Paketinhalt, Manifestwerte und Hashes direkt kontrolliert. A10s technische Paketprüfung und dieser Commitbaum-Abgleich stimmen überein. Der aktuelle A09-Bericht bindet das Gesamturteil ausdrücklich an `d18ec35…` und den Paketquellstand `7a89210…`.

## Binäre Gate-Matrix

| Gate | Urteil | Bewertete Nachweise |
|---|---|---|
| **G01 Spielkreisläufe** | **PASS** | A09-Zustands-/Ereignismatrix, A02-Regressionen, positiver und negativer Pfad; Abschluss bis Zahlung nachvollziehbar. Berichte/Fixtures liegen im Releasebaum. |
| **G02 Jahressolvabilität** | **PASS** | A01-Retest auf `7a89210…`: 01.01.2027–01.01.2028, 12 Monatsabschlüsse, 2.892,16 € Mindestliquidität, 0 € offene Kosten, keine Abstimmungsdifferenz; stabiler Eventhash `52ea26ea02a5655db7ff83f6d47b49d9622140d3b92934d7417551c61e27434c`. |
| **G03 Tagesplanung** | **PASS** | Touch-Emulation und Tastaturpfade für manuelle Arbeitsgangzuweisung; Mehrfachaktivität, Reihenfolge, Kapazität, Skills, Abwesenheit und Arbeitswoche durch Regressionen geprüft. Kein physischer Touchtest ist Gate-Voraussetzung. |
| **G04 Zeitarbeit** | **PASS** | Buchung bis explizite Rückgabe, Sichtbarkeit in Planung, Monatswechsel/Abrechnung und Rückgabehandler-Fix im Browser bzw. in Regressionen belegt. |
| **G05 Lernkarten-Kontext** | **PASS** | Kontextlink-Inventur über Aufträge, Planung, Finanzen, Markt und Inventar; Rückkehr zu gleichem Datensatz/Fokus und wiederhergestelltem `scrollY=648`; stabile Kontextbezüge und Regression. |
| **G06 Übungen/Fragebank** | **PASS** | 540 Fragen über neun Fächer und drei Niveaus, Validatoren/Nichtmutation sowie Nutzerabnahme D-0159 dokumentiert. Die spätere iterative Fragenpflege ist gemäß D-0159 kein Releaseblocker. |
| **G07 Inventarzugänglichkeit** | **PASS** | 101/101 Ausstattungssymbole mit zugänglichem Namen und Tastaturfokus; sichtbare Namen/Funktionen und sichtbarer Fokus. Kein Icon ist alleinige Informationsquelle. Screenreader wurde nicht separat getestet; das ist kein ausdrücklich genanntes Binärkriterium. |
| **G08 Responsive Navigation** | **PASS** | Neun Bereiche in 390×844, 768×1024 und 1280×800 ohne Root-Überlauf; Touch-/Keyboard-Planungszuweisung, Timeline-Wischen und sieben weitere Kernaktionen je Eingabemodus (14/14). Matrix-JSON und Screenshots sind vorhanden und von A09 unabhängig geprüft. |
| **G09 Speichern/Wiederherstellen** | **PASS** | Exakte Save-Rundreise, native v6-Migration, Wiederherstellung einer gültigen Sicherung und explizite Entscheidung bei beschädigtem Primär- und Sicherungsstand im isolierten Browserlauf belegt. |
| **G10 Offlinepaket/Provenienz** | **PASS** | A10 bestätigte 12/12 committed Quellhashes, zehn eingebettete Module, Offline-CSS/README, konsistente Manifestdaten, ZIP-Integrität und bytegleiche Einträge. A09 verifizierte zusätzlich, dass diese Artefakte unverändert im Releasecommit liegen. |
| **G11 Konflikt-/Quellengüte** | **PASS** | A08-Quellenreview, A11-Integrationsreview, A02/A03-Abgleich und A03s Review der D-0160-Implementierung liegen vor. Frühere offene Reviewerhinweise sind durch die späteren Fach-/Implementierungsreviews und die dokumentierte V2-Konvention eingeordnet. Im Releaseumfang bleibt kein ungelöster blockierender Widerspruch. Architektur V0.2 und ADRs bleiben PROPOSED; dies ist keine Architekturfreigabe. |

## Paketidentität – committed in `d18ec35…`

Manifest:

- `sourceRevision`: `main@7a892102e90fe98716db2c2d59c21fb59489dbf7`
- `workingTreeSourcesIncluded`: `false`

| Datei | SHA-256 |
|---|---|
| `prototype/werkstatt-v2-iphone.html` | `ab5586a0ddf182777c70a227b4afee5514eab3de3caa0b11d1e633991cc64935` |
| `prototype/werkstatt-v2-iphone.zip` | `701ef7b3d869ea7993e422d293acd676fa3b9ba2311ed2a97970427bc91a91ea` |
| `prototype/werkstatt-v2-package-manifest.json` | `068bfa4dcfe37b6539890e0e9aa21d66201c832938cdc293fb67212feb8f3036` |
| `prototype/WERKSTATT-V2-IPHONE-README.txt` | `d4438ac5253b65fca2ef9adbc460f23838fbfbb11a0c852d7234e96d1c63c49a` |

Die ZIP enthält genau HTML, README und Manifest; A10 bestätigt Integrität und Bytegleichheit zum Paketkandidaten. HTML/ZIP/Manifest sind Teil des Commit `d18ec35…`; README ist unverändert und sein Hash wurde direkt geprüft.

## Preflight, Prüfungen und Grenzen

- Verbindlichen Preflight ausgeführt: `AGENTS.md`, Agentenstruktur, Rechtekarte, Goals, Ticket-Board, Collaboration State, Decision Log, V2-Zielkarte, CP-0270/0271/0272 und aktuelle T-0062-Reviews gelesen. Aktives Ziel/Ticket: MG-002, SLG-002.2/.4/.5, T-0062; Startprofil 2019-Garage für V2 sowie Jahres-Smoke-Profil 2027 gemäß Gateberichten.
- Releasecommit: `d18ec35b86f258306af73410496890c18ecbce64`; Elterncommit exakt `7a892102e90fe98716db2c2d59c21fb59489dbf7`.
- `git status --short --branch`: `main...origin/main [ahead 3]`; keine Arbeitsbaumänderungen.
- `git diff --check`: PASS, kein Whitespacefehler.
- Artefakt-SHA-256 wurden im sauberen Arbeitsbaum verifiziert; dessen Paketdateien stimmen daher exakt mit dem committed Releasebaum überein.
- A01-Ausführung, Fachreviews, A09-QA und A01-übermittelte Browserbelege sind in ihren jeweiligen Berichten klar getrennt. A09 behauptet keinen neuen iPhone-/iPad-Hardware- oder Safari-Lauf; der zuvor bestätigte Nutzer-Gerätebeleg bleibt maßgeblich.
- Keine Commit-/Push-Aktion in diesem Review. Kein Schema-/Architekturentscheid.

## Abschluss

**A09 Release Committee: PASS für Releasecommit `d18ec35…` mit Produktquellcommit `7a89210…` und den oben aufgeführten Paketartefakten.** Damit sind die T-0060-Gates G01–G11 für diesen Releasekandidaten bestanden und es ist kein blockierender Konflikt offen. Ein Push ist eine getrennte Git-Aktion und wurde nicht ausgeführt.
