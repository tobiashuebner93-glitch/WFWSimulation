# A09 – CP-0380 Re-Review der Makro-Projektions-UI (CP-0382)

**Ergebnis: NONPASS.** Beide CP-0380-Befunde wurden gezielt behoben und unabhängig bestanden. Ein vom Auftrag verlangter Teil der Zusammenfassung fehlt weiterhin: Die globale Zeile weist nur die Zahl weiterer nicht angezeigter Karten aus, nicht Gesamtzahl, wirksame und pending Einträge insgesamt.

**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goals/Tickets:** MG-002 / T-0063  
**Entscheidungen:** D-0161–D-0169  
**Vorgänger:** CP-0379, CP-0380, CP-0381  
**Prüfbasis:** aktualisierter Snapshot `a05-macro-impact-ui-cp0379`, ohne `.git`; kritische Dateien laut Auftrag bytegleich mit Repository.

## Preflight / unveränderliche Grenzen

AGENTS und QA-Rechte, T-0063-Governance, Ticketboard, Collaboration State, D-0161–D-0169, CP-0379/0380/0381, CP-0380-Bericht sowie aktualisiertes `run.js`, `run.css` und A05-Regression wurden gelesen. CP-0382 und dieser Bericht waren vor Erstellung nicht vorhanden. Im Paket fehlt `.git`; Branch/HEAD/Working Tree wurden nicht unabhängig ermittelt. Kein Code geändert; kein Browser-/Gerätetest.

## Re-Review-Gates

| Gate | Ergebnis | Beleg |
|---|---|---|
| 5.000 gültige offene Sendungen | **PASS** | A05s Regression erzeugt über Shared Run 5.000 echte `openPurchaseOrderEta`-Effekte. Der Renderer erzeugt genau 20 Detailkarten, 12.634 Zeichen HTML (Testausgabe) und keine versteckten Effektkarten. |
| Detaillimit / Kanalrest | **PASS** | `MAX_MACRO_IMPACT_DETAILS = 20`; Ausgabe wählt nur sichtbare Details vor dem HTML-Rendern. Pro Kanal sind Gesamt, wirksam, pending und nicht angezeigter Rest ausgewiesen; globale Restzahl stimmt mit der Summe überein. |
| Beobachteter L4-Planwert | **PASS** | A05-Regression führt einen beobachteten L4-Input durch den echten Shared-Run-Projektor. Sichtbare Karten enthalten `Beobachtete Planprojektion` sowie Source/Period/Vintage. Die Einleitung ist quellenneutral und behauptet nicht mehr, alle Werte seien synthetisch. |
| Synthetic/unknown provenance | **PASS im Codepfad** | `synthetic_fixture` erhält synthetische Kennzeichnung; `observed` beobachtete Kennzeichnung; unbekannter Quellentyp wird explizit als nicht klassifiziert/Quellentyp angegeben. Quelle, Fixture/Modell, Scope, Zeitraum/Lag und „nicht gebucht“ sind pro Karte vorhanden. |
| Aktive / pending / neutral | **PASS** | A05-Regressions decken neutrales Ergebnis vor Snapshot, aktive Projektionskarten und `pending` ohne Null-/Eurointerpretation ab. |
| Hostile HTML / Zahlen | **PASS** | Hostile target/scope/source wird escaped. Unknown/`NaN`/`Infinity`/`undefined` values werden formatiert, ohne Rendererfehler oder unescaped HTML. |
| D-0169 / Run-/Finance-Nichtmutation | **PASS** | A05-Regression misst D-0169-Templategesamtzahl vor/nach und vergleicht Shared Run/Finance JSON vor/nach Projektion und Render. Unverändert. |
| Keine Rendererregeln / MRO | **PASS** | Renderer überträgt ausschließlich Resultatfelder, formatiert Zahl/Datum/Counts und berechnet keine Makroformeln. Text grenzt MRO ausdrücklich von Krediten ab. |
| **Globale Summenangabe** | **NONPASS** | Direkte Renderprobe mit L2 12 Einträgen (9 wirksam, 3 pending), L3/L6 8 (6,2), L4 5 (4,1), insgesamt 25/19/6 bei 20 Karten: Kanalzeilen sind korrekt; globale Zeile lautet nur „Insgesamt 5 weitere Einträge nicht angezeigt; es werden keine ausgeblendeten Effektkarten erzeugt.“ Sie zeigt kein globales `25 gesamt, 19 wirksam, 6 pending, 5 nicht angezeigt`. Das ist explizit im Auftrag verlangte Information. |

### Reproduzierbare globale Summary-Probe

Die an `renderMacroSummary()` übergebene synthetische Projection hatte:

- L2: 12 gesamt, 9 wirksam, 3 pending, 4 nicht angezeigt
- L3/L6: 8 gesamt, 6 wirksam, 2 pending, 1 nicht angezeigt
- L4: 5 gesamt, 4 wirksam, 1 pending, 0 nicht angezeigt
- Global: 25 gesamt, 19 wirksam, 6 pending, 5 nicht angezeigt

Die Ausgabe rendert 20 Karten und korrekte Kanalzeilen, global jedoch nur die 5 nicht angezeigten Einträge. Ursache: `omittedTotal` wird global dargestellt; globale Summen `totalContributions`, `projectedCount` und `pendingCount` werden nicht als Gesamtzeile ausgegeben.

## Regressionen

Alle Befehle liefen im bereitgestellten Snapshot mit Exitcode 0:

- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` — PASS; 5.000 Effekte, 20 Karten, 12.634 Zeichen, observed L4
- `node prototype/v3/a05-t0069-run-ui-regressions.mjs` — PASS
- `node prototype/v3/a05-t0064-ui-regressions.mjs` — PASS
- `node prototype/v3/a05-t0063-macro-regressions.mjs` — PASS
- `node prototype/v3-run-macro-fixture-regressions.mjs` — PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS
- `node prototype/v3-macro-trade-impact-regressions.mjs` — PASS
- `node prototype/v3-macro-policy-impact-regressions.mjs` — PASS
- `node prototype/v3-business-cost-plan-index-regressions.mjs` — PASS
- `node prototype/v3-finance-runtime-regressions.mjs` — PASS

## Erforderliche Korrektur / Restgrenzen

A05 soll für den globalen Summensatz `totalContributions`, Summe aller Kanal-`projectedCount`, Summe aller `pendingCount` und `omittedTotal` ausgeben. Danach ist eine kurze A09-Prüfung dieses Kriteriums ausreichend, bevor A01 A12 zur Browser-/Geräteprüfung beauftragt.

Responsive Verhalten, semantische Struktur und CSS wurden statisch geprüft; keine visuelle Browser-/Keyboard-/Gerätebeobachtung. Kein Gitstatus/Commit/Push, kein Jahres-/Gesamtfreigabeclaim. CP-0380-Befunde 1 und 2 sind im geprüften Snapshot bestanden; nur globale Summenzeile blockiert diesen Review.

## Prüfsnapshot SHA-256

- `prototype/v3/run.js`: `B79F4CC78CFB44D586E3BD1A92FBC2C82D203CF0136CDF35CB3C2AD23451B0B9`
- `prototype/v3/run.css`: `C5C2CCCE9FA742CF4F73878B186699B1781E22E3F47D70CDF9BEF91717F746EF`
- `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs`: `4F0B9468EC945F2C33AB3ECEEB92292CB9E230E383CBA938795EEE942FBA14B8`

Hashes identify files in the supplied snapshot, not a Git commit or complete tree digest.
