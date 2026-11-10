# A09 – CP-0382 Makro-UI Re-Review (CP-0384)

**Ergebnis: PASS für beide CP-0382-Repro-Gates und die fokussierten UI-Invarianten.** A12 kann nach A01-Übergabe die Browser-/Geräteprüfung übernehmen.

**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goal/Ticket:** MG-002 / T-0063  
**Vorgänger:** CP-0379 bis CP-0383, insbesondere CP-0380/0382  
**Prüfbasis:** Snapshot `a05-macro-impact-ui-cp0379`; laut Auftrag zentrale Dateien bytegleich zum Repo. Paket ohne `.git`.

## Preflight / Nachweisgrenze

Agentenregeln/Rechte, Governance, D-0161–D-0169, CP-0380–0383, CP-0380-Bericht, A05-Fixbericht und aktualisierte UI-/Regressiondateien wurden gelesen. CP-0384 und Bericht waren vor Erstellung nicht vorhanden. Git/Branch/HEAD/Diff nicht selbst verifizierbar. Keine Codeänderung. Browser, Jahreslauf, Gerät, Commit und Push nicht ausgeführt.

## Prüfergebnis

| Gate | Ergebnis | Beleg |
|---|---|---|
| CP-0382 globale Summenzeile | **PASS** | Multi-Channel-Probe zeigt global `25 gesamt / 19 wirksam / 6 pending / 5 nicht angezeigt`. Kanalwerte bleiben L2 `12/9/3/4 ausgelassen`, L3/L6 `8/6/2/1 ausgelassen`, L4 `5/4/1/0 ausgelassen`. Genau 20 Detailkarten gerendert. |
| 5.000 offene ETA-Effekte | **PASS** | Fokussierte Regression durchläuft Shared Run: 5.000 ETA-Effekte, 20 Karten, 12.604 Zeichen HTML. Keine vollständigen/ausgeblendeten Effektlisten im Markup; nur ausgewählte Detailkarten plus aggregierte Kanal-/Globalkennzahlen. |
| Observed L4-Provenienz | **PASS** | Gültiger beobachteter L4-Input läuft durch `getRunProjection()`. Karte ist mit „Beobachtete Planprojektion“ sowie observed Quelle/Vintage gekennzeichnet; Einleitung behauptet nicht mehr, dass alle Ergebnisse synthetisch seien. |
| D-0169 / Run-/Finance-Nichtmutation | **PASS** | Regression vergleicht Run-/Finance-JSON vor und nach Projektion/Render; beides bleibt bytegleich. Geplante Segmentverschiebungen wahren die Gesamtanfragezahl. |
| Keine neue Berechnung/Finanzsemantik | **PASS** | Renderer liest Projektorergebnisse, beschränkt Detailkarten, aggregiert ausschließlich Status-/Anzahlen und formatiert Ausgabe. L4-Indizes bleiben getrennt. FX bleibt Planindex, ETA erwarteter Termin; MRO ist weiterhin ausdrücklich keine Kreditvergabe. |

### Ausgeführte Prüfung

- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` — **PASS**, Exit 0: 5.000 ETA-Effekte, 20 Karten, 12.604 Zeichen, beobachteter L4-Pfad, Multi-Channel-Summen, Escaping, D-0169 und Run-/Finance-Bytegleichheit.

Keine verdeckte Voll-Liste wird durch den Renderer erzeugt; dies wurde am Auswahl-/Renderpfad geprüft. Kein Browser- oder Geräteverhalten daraus abgeleitet.

## Hashes des geprüften Codes

- `prototype/v3/run.js`: `B79F4CC78CFB44D586E3BD1A92FBC2C82D203CF0136CDF35CB3C2AD23451B0B9`
- `prototype/v3/run.css`: `C5C2CCCE9FA742CF4F73878B186699B1781E22E3F47D70CDF9BEF91717F746EF`
- `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs`: `4F0B9468EC945F2C33AB3ECEEB92292CB9E230E383CBA938795EEE942FBA14B8`

Hashes benennen ausgewählte Dateien des bereitgestellten Snapshots, keinen Commit oder vollständigen Tree.

**Nächster Schritt:** A01 kann A12 zur explorativen Browser-/Geräteprüfung übergeben. Das ist keine Release-, Gesamtjahres- oder Gitfreigabe; solche Prüfungen sind hier nicht umfasst.
