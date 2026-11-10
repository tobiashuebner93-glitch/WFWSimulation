# A09 – L3/L6 Makro-Politikprojektion: adversarial review (CP-0365)

**Status:** NONPASS – koordinierte Makro-History-Manipulation ändert eine akzeptierte Wirkung
**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063 L3/L6, T-0069
**Entscheidungen:** D-0161–D-0169; insbesondere D-0169 (Gesamtanfrageninvarianz)
**Profil:** V3 Shared Run ab 04.01.2027; bereitgestellter Snapshot `a02-code-input-t0063-l0l1`, ohne `.git`
**Vorgänger:** CP-0351–CP-0363; L0/L1-Reviews CP-0361/0362; A02 L3/L6-Implementierung CP-0363

## Preflight und Snapshotbasis

AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket-Board, Collaboration State, Decision Log, CP-0351–0363, A02-Unternehmenswirkungsvertrag, CP-0363-Implementierungsbericht sowie Makro-/Run-/Finance-Schnittstellen gelesen. CP-0365 war vor Erstellung nicht vorhanden. CP-0364 war in der bereitgestellten Checkpoint-Kopie nicht vorhanden. `.git` fehlt; Gitstatus, Branch, HEAD und Diff sind nicht verfügbar. Nur dieser A09-Bericht und CP-0365 wurden neu erstellt; Runtime/Testdateien blieben unverändert.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Exposure fehlt / 0 / nicht numerisch | **PASS** | Fehlende, `0`, String-`"1"` und `NaN`-Exposure erzeugen keine Wirkung. |
| Fehlende Scope-Referenz | **PASS** | Fehlendes `publicSegmentRef` erzeugt keine Wirkung. |
| Ungültiger Scope-Typ | **NONPASS** | `publicSegmentRef: 42` wird als gültige Scope-Referenz angenommen; die Projektion liefert ein aktives Fiscal-Ergebnis mit `scopeRef: 42` und Beitrag `+1`. Scope-/Adoptionsreferenzen müssen als nichtleere stabile Strings validiert werden. |
| Quelle, Periode, Lag, Identität | **NONPASS** | Interne Felder und Snapshotkopien werden verglichen, aber die gespeicherte Wirkungsquelle wird nicht gegen die im Shared-Run-Day-open-Fingerprint hinterlegte ursprüngliche Policy-Eingabe neu abgeleitet. Siehe koordinierter Repro unten: Änderungen an `delta`, Exposure und Scope werden in allen Makro-History-Kopien akzeptiert, obwohl der Day-open-Input unverändert bleibt. Damit ist auch die Verlässlichkeit damit koordinierter Lag-/Source-/Periodwerte nicht ausreichend abgesichert. |
| effectGroup-Deduplizierung | **PASS im normalen Eventpfad** | Makro-Regressions bestehen; Duplikatkennung wird bei Ereigniserzeugung gesetzt. Die Projektion dedupliziert zusätzlich nach Effektgruppe und Zielgröße. Wegen des NONPASS zur koordinierten History kann die Provenienz-/Eligibility-Kette aber nicht als manipulationssicher bewertet werden. |
| Replay / Save / Restore | **NONPASS** | Normales Replay/Restore ist deterministisch. Ein konsistent über `macro.events`, `scheduledEvents`, `effectiveMacroEvents` und Snapshot-`policyChannels` veränderter Policy-Beitrag wird dennoch als gültige History wiederhergestellt und in `getRunProjection()` ausgegeben. |
| D-0169-Gesamtanfrageninvarianz | **PASS im Projektionstestumfang** | Nachfrageorientierte Policy-Wirkung ist ein Segmentanteilsindex; Code erzeugt keine neuen Marktanfragen. Die koordinierte Manipulation ändert nur die projizierte Policy-Ausgabe und lässt den D-0169-Trace unverändert. |
| FinanceState / Payroll / operative Kapazität / Vertrag | **PASS für Nichtmutation** | Policy-Projektion ist pure, enthält keinen FinanceState als Eingabe und gibt `actualStateChanged:false`/`directFinanceEffect:false` aus. Shared-Run-Projektion ließ Run- und FinanceState bytegleich. Die aktuelle Fixture hat keine aktive Policy-Exposition, daher wurden weder echte Lohn-/Kapazitäts-/Vertragswerte noch Zahlung oder Buchung verändert. Das ist kein vollständiger Jahres- oder Ledgerabgleich. |
| MRO-Ausschluss | **PASS** | Projektor selektiert ausschließlich `channel === 'policy'`; MRO-/Finanzierungsofferten werden nicht in `macroPolicyImpact` umgesetzt. |
| Aktive Fixture / Spielbarkeit | **PASS als neutraler Stand** | Shared-Run-Projektion zeigt `effects=[]`; die aktive Makrofixture liefert keine numerische Exposure und keine jeweiligen operativen Scope-Referenzen. Sie ist korrekt als neutrale Planprojektion einzuordnen, nicht als implementierte/spielbare Unternehmenswirkung. Es gibt in diesem Los keine UI-Anzeige, die eine aktive Wirkung behauptet. |

## Reproduzierbarer NONPASS

Baseline Shared Run im Januar 2027: Fiscal-Wirkung neutral, `effects=[]`. Im kopierten Run wurden die Fiscal-Ereignisfelder `delta=10`, `newValue=10`, `firmExposureFactor=1`, `publicSegmentRef='segment:public'`, neue `effectGroupId` und `intermediateIndicator` gesetzt. Die Änderung wurde konsistent gespiegelt in:

- `modules.macro.events`
- Snapshot `scheduledEvents`
- Snapshot `effectiveMacroEvents`
- Snapshot `policyChannels.fiscal`

`inputFingerprint`, `processedPeriods` und der autoritative Run-Day-open-Makroinput blieben unverändert. Trotzdem liefen `validateV3RunState()`/`getRunProjection()` erfolgreich; die Projektion gab `contribution=2` (synthetische Kappung), `exposure=1`, `scopeRef='segment:public'` aus. Ergebnis der Reproduktion: **„ACCEPT coordinated shared-run event mutation“**. Damit kann ein gespeicherter Makroevent ohne Änderung des aufgezeichneten Day-open-Inputs eine sichtbare Wirkung vortäuschen.

Minimaler Fixvorschlag an A02: Shared-Run-Validierung muss den vollständigen Makro-Monatsinput an den Day-open-Fingerprint binden und Policy-Events/eligibility/effect groups/lag/effectivePeriod deterministisch aus genau diesem Input revalidieren. Interne Übereinstimmung mehrerer editierbarer Historykopien allein reicht nicht. Scope-Schlüssel je Kanal zusätzlich als nichtleere String-Referenzen validieren. Danach A09-Re-Review mit koordiniertem Mutationsfixture.

## Tests

Alle mit Exit 0:

- `node prototype/v3-macro-policy-impact-regressions.mjs` – PASS
- `node prototype/v3-run-operating-impact-regressions.mjs` – PASS
- `node prototype/v3-macro-demand-channel-regressions.mjs` – PASS
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS
- `node prototype/v3-market-simulation-regressions.mjs` – PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS

Zusätzliche In-Memory-Adversarialproben: Exposurezustände und fehlende Scope-Referenz neutral; numerischer Scope `42` fälschlich wirksam; koordinierte Historymutation angenommen. Keine Runtime-Datei oder gespeicherter Produktzustand verändert.

## Snapshot-Hashes (SHA-256, ausgewählte Dateien)

- `prototype/v3-macro-policy-impact.js`: `4BA1A222DDA68BB4E2E28A7B22653F20ECFCE0518BE28D670610274C7A47B418`
- `prototype/v3-macro-policy-impact-regressions.mjs`: `C0D078A0F9C0916B0316401ACDA4BB3EDB28852DF9E0B511526552C64925C392`
- `prototype/v3/run.js`: `D7042D08ADD980C71471BB78F9B558063B427170FA158791B1D76D39F8D6E809`
- `prototype/v3-macro-simulation.js`: `864487D28B65D651F2061D1CEC8E06D94F9ACA926847F046CE57AF92A235D91D`
- `prototype/v3-run-macro-fixture.js`: `DB34F777A1D8F0A2A028EBBDD028530AD6FB23E542759A2ED13CEEEB4EA28CB2`
- `prototype/v3-macro-simulation-regressions.mjs`: `A40D39C761C830C65C9F778F722A1113636AC820A065A695BF3C01CDEEE1015B`
- `docs/agent-system/checkpoints/CP-0363.md`: `B5D1991F95654C827AB7243E5A4CDFB14B6B07E1B2ABDF5F27B042DDC8324118`

Hashes identify selected files in the supplied copy, not a full-tree or Git commit hash.

## Nachweisrollen und Grenzen

- **Ausführung:** A09 adversarial, read-only bis auf diesen Bericht/Checkpoint.
- **Fachreview:** kein A03-Code-Review für L3/L6 im Snapshot enthalten; CP-0363 führt es als ausstehend.
- **Unabhängige QA:** dieses Dokument, Ergebnis NONPASS.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** nicht verfügbar, Snapshot enthält kein `.git`.
- **Commit/Push:** nicht ausgeführt.

**Nächster Schritt:** A02 behebt die Provenienzbindung/Scopevalidierung; A03 fachreviewt die korrigierte Projektion und Finanzgrenzen; A09 führt anschließend Re-Review aus. T-0063/T-0069 bleiben IN_PROGRESS.
