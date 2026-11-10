# A03-Re-Review – Wochenend-Fix L0/L1 und Finanzgrenze

**Status:** PASS im angeforderten Code-/Finanzgrenzenscope
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Datum:** 31.10.2026
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063 L0/L1, T-0069
**Entscheidungen:** D-0011 (V1-Kernkalender als Prüfreferenz); D-0169 (einziger synthetischer Gesamtanfragekanal)
**Vorgänger:** CP-0357–CP-0360, insbesondere A03 CP-0358 und A02-Fix CP-0360

## Preflight und Basis

Erneut gelesen wurden `AGENTS.md`, Agentenstruktur und Rechtekarte, Goals, Ticket-Board, Collaboration State, Decision Log mit D-0011/D-0169, CP-0357–CP-0360, A02-Fixbericht und A03-Evidenzvertrag. CP-0361 und dieser Bericht waren vor dem Review nicht vorhanden. Die vier angeforderten Repositorydateien wurden read-only geprüft. Branch/HEAD: `main`-Arbeitsbasis `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; `git status --short` schlägt mit `fatal: this operation must be run in a work tree` fehl, daher ist der globale Working-Tree-Status nicht bestätigt.

## Reviewbefund

**PASS für die angeforderten Invarianten.**

- `createV3ProductState` lehnt initiale Commitmentdaten an Samstag/Sonntag ab. Die Ablehnung erfolgt ohne Verschieben oder Umdeuten des Datums.
- `validateV3ProductWorkdayAssignments` prüft gespeicherte Commitments, Produktzuweisungen, Kundenauftragszuweisungen und Operationsdaten. `validateV3RunState` ruft diese Prüfung auf. Dadurch lehnen sowohl Save-Envelope-Erstellung als auch Restore einen manipulierten gespeicherten Samstag-/Sonntagseintrag ab.
- Eine Freitagsbelegung am 08.01.2027 bleibt Freitag und wird mit drei Stunden in der normalen Woche 04.–10.01. einbezogen. Der Kapazitätsnenner bleibt 40 deklarierte Stunden (`8 h/Tag × 5 Werktage`). Die Projektion überspringt Wochenendstunden; kein Termin wird auf einen anderen Tag verschoben.
- Die Betriebswirkung bleibt eine abgeleitete `information_plan`-Projektion mit `directFinanceEffect: false`. Sie schreibt weder FinanceState noch Cash, Kosten, Istkosten oder Vertragssnapshots. Planstunden bleiben von `actual_evidence` getrennt; fehlender Istkostensatz wird nicht aus dem Plan abgeleitet.
- Gewonnene Aufträge kommen aus validierten angenommenen Spielerentscheidungen. Der Nachfragepfad liest den bestehenden D-0169-Wochentrace und führt keine zusätzliche Phasenmultiplikation ein. Nachfrageänderungen erzeugen keine direkte Finanzwirkung.
- Save/Restore reproduziert Betriebsprojektion und Finanzzustand in den gezielten Regressionen. Finance-Reconciliation wird beim Envelope/Restore geprüft; die Regressionen bestätigen, dass FinanceState im geprüften Pfad unverändert bleibt.

Der Validator wendet dieselbe V3-Arbeitstagsprüfung an; er führt keine Wochenendverschiebung aus. D-0011s V1-Feiertagsregel wird nicht erweitert oder umgedeutet; dieses Review prüft ausschließlich Samstag/Sonntag und die ausdrücklich deklarierte Fünf-Werktage-Kapazitätsbasis.

## Reproduzierte Prüfungen

| Befehl | Exitcode | Ergebnis |
|---|---:|---|
| `node prototype/v3-run-operating-impact-regressions.mjs` | 0 | PASS: Samstag/Sonntag abgewiesen bei Initialisierung, Save-Envelope und Restore; Freitag 3 h in 40-h-Woche; Finance-Nichtmutation, Auftragsannahmen, D-0169 und Replay bestehen. |
| `node prototype/v3-product-lifecycle-regressions.mjs` | 0 | PASS |
| `node prototype/v3-finance-runtime-regressions.mjs` | 0 | PASS |
| `node prototype/v3-macro-demand-channel-regressions.mjs` | 0 | PASS: 52 Wochen, Nachfrage-Richtung, Quellbindung, Restore, Replay und Finanzchecks. |

## Dateiidentifikation

SHA-256 der geprüften Änderungen/Nachweise:

| Datei | SHA-256 |
|---|---|
| `prototype/v3-product-lifecycle.js` | `E33EB0E87B8F032A25F4C81E56CB179A20D7FC884D33D6E356FAFDFE9AEA4BD5` |
| `prototype/v3-run-orchestrator.js` | `5609F794EC897FF711ED1EEBF962BDA4592F0D1C9BD807A0385B2DE6D1DC8056` |
| `prototype/v3/run.js` | `4A140F64BB141DE9A7E3080104A9460F1FDC4CC56C8029FBCB0931F3D582B070` |
| `prototype/v3-run-operating-impact-regressions.mjs` | `696CC73156FB4453A9D6DB2939FF03493029AAD9920FC9150B59800E26399286` |
| `prototype/v3-product-lifecycle-regressions.mjs` | `E332BD2BCE778D2616CFF46FE43BB30D6E7E1839E0DF0AF524F238B822998689` |
| `prototype/v3-finance-runtime-regressions.mjs` | `710813A1BF0AA5FC913DE14A4C1296AEFA96D8A88D752CB90F7BE29E6993FEBD` |
| `prototype/v3-macro-demand-channel-regressions.mjs` | `D4B1480A0D226B9C353770E205088E8BCCA980BD44B92803A7FA3C5FA7C5A18D` |
| `docs/agent-system/checkpoints/CP-0360.md` | `95BABAFE3B3ED9C842555386CFD43B30B42D032778D8450937EEC02A3D5F04FA` |
| `docs/simulation/a02-t0063-l1-weekend-commitment-fix-cp0360.md` | `9D21C31638DFC6EE2CE480ED9716235B9F769EEFBC5A0F787804E8ADA4E2706B` |

## Grenzen

- **Fachreview:** A03, PASS ausschließlich für die genannten Kalender-/Finanz-Nichtmutationsinvarianten.
- **Unabhängige QA:** nicht ausgeführt; A09-Re-Review ist getrennt.
- **Browser-/Gerätetest:** nicht ausgeführt; UI unverändert.
- **Git:** Root und HEAD lesbar, Status/Diff nicht verfügbar, weil Git diesen Checkout in der Sitzung nicht als Worktree erkennt.
- **Finanzfreigabe:** keine Buchungs-, Kosten-, Bewertungs-, Kredit-, Steuer- oder Ledgerfreigabe.
- **Commit/Push:** nicht ausgeführt.

**Nächster Schritt:** A01 nimmt den engen A03-PASS entgegen und koordiniert den unabhängigen A09-Re-Review des Wochenend-Init-/Envelope-/Restore-Fixes. CP-0358 und CP-0360 bleiben unverändert.
