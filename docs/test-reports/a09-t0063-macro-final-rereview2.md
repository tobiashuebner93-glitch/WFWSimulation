# A09 finaler unabhängiger Runtime-Re-Review – T-0063 Makro

**STATUS:** PASS – frühere Aktivierungshistorie-Korruption wird kontrolliert abgewiesen
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0063 (isolierte Runtime-Teilabnahme; Gesamtticket bleibt von weiteren Fach-/Integrationsgates abhängig)
**VORGÄNGER:** CP-0279; aktueller Sammelstand CP-0280 (ENTWURF)
**MASSGEBLICHE ENTSCHEIDUNGEN:** D-0100–D-0102, D-0159, D-0161–D-0164
**PRE-FLIGHT:** AGENTS.md, Agentenstruktur/-rechte, Goals MG-002, Ticket Board T-0063 bis T-0069, Collaboration State, Decision Log, CP-0279, CP-0280 (ENTWURF), A02 T-0063 Vertrag/Arbeitsbericht/Runtime, A09 vorherige QA-Berichte und A08 Provenienzreview gelesen. Repository `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, Branchstatus `main...origin/main`. Vorhandene lokale Änderungen mehrerer Agenten einschließlich `prototype/engine.js` blieben erhalten.

## Umfang und Ergebnisgrenze

A09 prüfte A02s letzte Korrektur der Aktivierungs-/Effektivhistorie unabhängig gegen die frühere Reproduktion. Zusätzlich wurden gültige wiederhergestellte und mehrperiodige Zustände, Ereignisidentität/-reihenfolge, Datums-/Provenienzfälle, Nichtmutation, Makro-/SPI-Regressions und Syntax geprüft.

**PASS gilt nur für die isolierte T-0063 Runtime-QA.** Es ist keine empirische Kalibrierung oder Freigabe der Makroparameter, kein A03-Finanzreview, keine A05-UI-Integration, kein Browser-/Gerätetest und keine T-0069-Jahres-/End-to-End-Abnahme.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Frühere gemeinsame Kürzung der Aktivierungshistorie | **PASS** | Das Januar-Ereignis wurde aus `effectiveMacroEvents`, `activatedMacroEventIds` und `state.activatedEventIds` entfernt. `validateV3MacroState` weist diesen Zustand als `invalid_macro_state` ab. `runV3MacroMonth` weist den Februar-Folgelauf vor einer Transition ebenfalls ab und liefert keinen Folgezustand. |
| Keine unsichere Wiederaktivierung | **PASS** | Ein Zustand mit dem beschriebenen Defekt kann nicht fortgesetzt werden; ein fehlerfreier Januar-/Februar-Lauf aktiviert das im Januar bereits verbrauchte Event nicht erneut. |
| Vollständige, geordnete Sollmenge | **PASS** | Pro Snapshot werden fällige Event-IDs mit der erwarteten Reihenfolge gegen beide Aktivierungshistorien verglichen. Einzelne gekürzte Aktivierungs-, Effektiv- oder Scheduled-Historien werden erkannt. |
| Gültige Wiederherstellung / Mehrperiodenlauf | **PASS** | Unveränderter Snapshotzustand validiert als restaurierter Zustand. Ein korrekter Folgemonat läuft; die unveränderliche Quelle bleibt gleich und die kumulierte Geschichte validiert danach weiter. |
| Identität und Envelope | **PASS** | Abweichende Szenario-/Lauf-/Seed-/Modellreferenz sowie Caller-Spoofing der systemverwalteten Eventfelder werden kontrolliert erkannt bzw. überschrieben. |
| Reihenfolge / Replay / Kontiguität | **PASS** | Umgeordnete globale Eventhistorie wird zurückgewiesen; korrektes Replay bleibt idempotent; identische Periode mit anderem Payload und übersprungener Monat werden kontrolliert abgelehnt. |
| Datumsvalidierung | **PASS** | Unmögliches Veröffentlichungsdatum und ungültige Wirksamkeitsperiode werden kontrolliert abgewiesen. Beobachtungsperiode, Veröffentlichungsdatum und `effectiveFrom` bleiben getrennte Begriffe. |
| Beobachtete Provenienz | **PASS auf Runtime-Ebene** | Fehlende Pflichtprovenienz bzw. ungültiges Publikationsdatum wird abgewiesen; valide Metadaten mit optionalem `observedAt` werden akzeptiert. |
| Synthetische Fixtures | **PASS** | Synthetische Eingaben ohne beobachtete Perioden-/Publikations-/Vintage-Metadaten bleiben zulässig und werden nicht als beobachtet ausgegeben. |
| Makro-/SPI-Regression und Syntax | **PASS** | Alle vier unten genannten Node-Befehle bestehen. |
| Eingabe-/Zustands-Nichtmutation | **PASS** | Gültige Monatsverarbeitung ändert den Ursprungszustand nicht. Die Ablehnung des beschädigten Zustands verändert den gelieferten beschädigten Zustand ebenfalls nicht und gibt keinen neuen Zustand zurück. |
| Quellenauthentizität | **Nicht durch Runtime prüfbar** | Vorhandensein von Quellenmetadaten wird validiert; ob ein beliebiger `sourceRef` tatsächlich auf eine bestimmte amtliche Serie zeigt, bleibt Provenienzreview/Quellenbeschaffung vorbehalten. |

## Reproduktion der früheren Blockerprobe

Ausgangspunkt war ein gültiger Januarzustand mit mindestens einem sofort fälligen Makroereignis `ME|...|external|fx_imported_inputs|2027-01`. Die Event-ID wurde aus allen drei Aktivierungsstellen entfernt, während Quelle und geplante Eventhistorie erhalten blieben.

Ergebnis mit der korrigierten Runtime:

```text
validateV3MacroState(corrupt) -> throws code invalid_macro_state
runV3MacroMonth(corrupt, February) -> { ok: false, error.code: invalid_macro_state }
corrupt input state after rejection -> byte-for-byte/deep equal to pre-call state
returned next state -> absent
```

Zur Positivkontrolle wurde derselbe gültige Januarzustand geklont und als wiederhergestellter Zustand validiert. Februar lief erfolgreich; die bereits im Januar aktivierte ID war nicht in der Februar-Aktivierungsliste. Beide Zustände blieben gegenüber den jeweils übergebenen Quellobjekten unverändert.

## A02-Vertragsabgleich

A02 hat die Provenienzsemantik nun im Makrovertrag synchronisiert: `observedAt` ist ein optionaler quellenspezifischer Ereignis-/Messzeitpunkt, nicht Pflichtfeld für Monats-/Quartalsreihen und kein Ersatz für Beobachtungsperiode oder Publikationsdatum. Die frühere Dokumentationsabweichung aus A08s Review ist damit im geprüften Stand behoben. Quellenmetadaten werden weiterhin nur auf Vorhandensein/Format, nicht auf tatsächliche externe Datenauflösung geprüft.

## Ausgeführte Prüfungen

- `node prototype/v3-macro-simulation-regressions.mjs` – PASS; enthält die gemeinsame Kürzung und Folgelauf-Ablehnung sowie gültige Mehrperiodenhistorie.
- `node prototype/v3-price-index-regressions.mjs` – PASS.
- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- Temporäre unabhängige Probe, danach aus Temp-Verzeichnis entfernt: beschädigte Historie, validierter/restaurierter Mehrmonatsverlauf, Mutation/Reihenfolge, fremde Envelope-Identität, ungültige Wirksamkeitsperiode und Veröffentlichungsdatum, beobachtete und synthetische Provenienz – PASS.
- `git diff --check` – Exit 0; nur konfigurierte LF/CRLF-Hinweise für bestehende Änderungen.
- `git status --short --branch` – `main...origin/main` mit bestehenden Änderungen unterschiedlicher Agenten; keine davon verworfen oder inhaltlich geändert. Kein Commit/Push.

## Verbleibende, getrennte Grenzen

Der simulierte MRO-Pfad bleibt ausdrücklich synthetisch und unkalibriert; dieses QA belegt keine Makroprognose. Der vorherige Bericht dokumentiert zusätzlich, dass keine fachlichen Ober-/Untergrenzen für endliche Indexstände, Koeffizienten oder Lagperioden im Vertrag festgelegt sind. Diese Grenzen wurden in diesem eng begrenzten Re-Review nicht neu bewertet und bleiben als Kalibrierungs-/Vertragsarbeit offen, nicht als durch A09 erfundene Produktwerte.

A03-Finanzfachreview und A05-UI-Integration für T-0063 bleiben separat erforderlich. Der End-to-End-Jahres-/Browsergate gehört zu T-0069. Diese Prüfungen sind nicht Bestandteil dieses PASS.

**Ausführung:** A02-Korrektur laut Arbeitsbericht; A09 führte Regressionen und zusätzliche unabhängige Proben aus.
**Fachreview:** A02-Selbstreview plus A08-Provenienzreview dokumentiert; unabhängiges A03-Finanzreview nicht ausgeführt.
**Unabhängige QA:** A09, PASS für den isolierten Runtimeumfang.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** Branch/HEAD/Status geprüft; Fremdänderungen erhalten; `git diff --check` Exit 0 mit LF/CRLF-Hinweisen.
**Commit/Push:** nicht ausgeführt.
