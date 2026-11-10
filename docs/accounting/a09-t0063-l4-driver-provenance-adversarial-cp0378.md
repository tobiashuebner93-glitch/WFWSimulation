# A09 – T-0063 L4 Treiberprovenienz: adversarial Review (CP-0378)

**Ergebnis: PASS im begrenzten L4-Planindex-/Provenienz-/Nichtmutationsumfang.** Kein Branchenquellen- oder Produktgesamtfreigabeanspruch.

**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / T-0063 L4; Anschluss T-0065/T-0066/T-0067/T-0069
**Entscheidungsbasis:** D-0161–D-0169, L4-Vertrag CP-0355
**Vorgänger:** CP-0374/0375/0376/0377
**Snapshot:** `a02-code-input-t0063-l0l1`, aktualisiert; kein `.git`.

## Preflight / Gitgrenze

AGENTS/Governance, Agentenstruktur/Rechte, MG-002-Ziele, Ticketboard, Collaboration State, D-0161–D-0169, L4-Vertrag/CP-0355 und CP-0374/0376, A03 CP-0375/0377 und A02/A03-Berichte wurden gelesen. CP-0378 und dieser Bericht waren vor Erstellung nicht vorhanden. `.git` fehlt; Branch, HEAD, Gitstatus, Diff und Commitbezug sind nicht verifizierbar. Runtime-/Regressioncode wurde nicht geändert. Nur dieser Bericht und CP-0378 wurden im Snapshot angelegt.

## Gate-Ergebnisse

| Prüfbereich | Ergebnis | Beleg / Grenze |
|---|---|---|
| Fehlende/leere/falsche/mehrfache Treiber-IDs | **PASS** | L4-Regression deckt fehlendes Array, leeres Array, falsche primitive Treiberform, doppelte Driver-ID und doppelte Effect-Group ab. `driverIds` muss ein Array mit exakt einem Objekt vom Typ `raw_component` sein. |
| Treiber-, Komponenten-, Monats-, Event-, Scope-, Contribution- und Effect-Group-Bindung | **PASS im strukturellen Vertrag** | Code verlangt Übereinstimmung von driver/component ID, componentId, period/currentPeriod, `eventKey`, Event-Quellenreferenz, Scope, Contribution-ID und deterministischer Effect-Group. Regression enthält falsche Eventreferenz, Scope und Periode sowie doppelte bzw. gekreuzte IDs; Formel-/Beitrags-ID und Quellenbindung wurden zusätzlich im Code gegen CP-0355/0376 geprüft. Abweichungen führen zu keiner Projektion, `pending` oder verworfenem Event. |
| Nicht aggregierte FX-/Policy-/Tarif-/Umwelt-/CPI-Pfade | **PASS für deklarierte Treibermetadaten** | Nur `raw_component` wird akzeptiert. Regression injiziert jeweils FX, Policy, Tarif, Umwelt und CPI als DriverType; alle bleiben pending. Es wird keine Aggregationsregel erfunden und kein Treiber gestapelt. |
| Synthetischer raw-component-Positivpfad | **PASS** | Gültige explizite Testtreiber für Material/Energie/Lohn/Logistik mit eindeutiger Monats-/Quellen-/Contribution-/Scopebindung ergeben die erwarteten Indizes. Die 25-%-Gewichte sind an die benannte Testfixture gebunden und keine Branchengewichte. |
| Numerische Indexformel | **PASS** | Je Komponente: `100 × currentValue / baseValue`; vollständiger BICI: `Σ(weight × componentIndex)`. Regression: Basiswerte 100 ergeben BICI 100; nur Material 110 bei vier Gewichten à 0,25 ergibt BICI 102,5. |
| Wage-/Procurement-Ansichten getrennt | **PASS** | WagePlanIndex = Lohnkomponentenindex; ProcurementPlanIndex normalisiert nur Material und Logistik auf deren Teilgewichte. Beispiel Material 110 ergibt Procurement 105; Lohn 110 ergibt Wage 110 und Procurement 100. Diese Ansichten werden nicht zum BICI addiert. Werte bleiben Planindizes ohne Geldumrechnung. |
| Basis, Gewichte, Einheiten, Lag und Periode | **PASS** | Basisperiode 2027-01, Basisindex 100, erlaubte komponentenspezifische Einheiten, positives numerisches Basis-/Istmaß, einmonatiger Lag und Folgeeffekt im nächsten Monat. Nicht passende Gewichte/Einheiten/Zeiträume bleiben pending. |
| Coordinated history mutation / autoritatives Day-open | **PASS** | Eigene In-Memory-Probe veränderte den Monats-Makroevent und gleichzeitig `scheduledEvents`/`effectiveMacroEvents` bei unverändertem autoritativem `dayOpenFingerprints`-Makroinput. `createRunSaveEnvelope()` wies den mutierten Zustand zurück. Dieselbe abgestimmte Änderung an einem zuvor gültig gespeicherten Envelope wurde durch `restoreRunSaveEnvelope()` zurückgewiesen. Gültiger unveränderter Run blieb BICI 100; Replay war deterministisch. |
| Run-/Finance-/Ledger-Nichtmutation und D-0169 | **PASS im geprüften Scope** | L4-Regressions vergleichen Run- und FinanceState vor/nach der Projektion; beide bleiben gleich. D-0169-Suite bestätigt unveränderte Gesamtanfragen. Der Projektor hat keinen Posting-/Ledger-Schreibpfad; Ledger-/Jahresabstimmung wurde nicht behauptet. |
| Nicht deklarierte bzw. falsch deklarierte Fremdtreiber | **BEGRENZTE ERKENNBARKEIT** | Wenn eine Quelle einen aggregierten oder fremdbeeinflussten Rohwert fälschlich als `raw_component` mit formal konsistenten Metadaten deklariert, kann der Projektor den verborgenen Inhalt nicht aus den Metadaten erkennen. Der PASS gilt daher für syntaktisch/strukturell korrekte deklarierte Inputs, nicht für die Wahrheit der upstream gelieferten Rohdaten. A03 CP-0377 benennt dieselbe Grenze. |

## Regressionen

Alle Befehle liefen im bereitgestellten Snapshot mit Exitcode 0:

- `node prototype/v3-business-cost-plan-index-regressions.mjs` — PASS
- `node prototype/v3-price-index-regressions.mjs` — PASS (SPI/CPI)
- `node prototype/v3-macro-simulation-regressions.mjs` — PASS
- `node prototype/v3-run-macro-fixture-regressions.mjs` — PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS
- `node prototype/v3-macro-trade-impact-regressions.mjs` — PASS (L2)
- `node prototype/v3-macro-policy-impact-regressions.mjs` — PASS (L3/L6)
- `node prototype/v3-market-simulation-regressions.mjs` — PASS
- `node prototype/v3-macro-demand-channel-regressions.mjs` — PASS (D-0169)
- `node prototype/v3-finance-runtime-regressions.mjs` — PASS

## Grenzen

Keine realen/quellenvalidierten Komponentenpreise, Lohnsätze oder Logistikkosten; keine empirische Gewichtsvalidierung. Keine operative Istkosten-/BAB-/Payroll-/Bestands-/COGS-/Buchungsintegration, UI-/Browser-/Geräte-, Jahres-/Ledger- oder Releaseprüfung. Das ist ein enges technisches L4-Provenienzreview. T-0063 und T-0069 bleiben gemäß Ticketboard außerhalb des geprüften L4-Gates offen. Kein Commit/Push.

## SHA-256 des geprüften Snapshots

- `prototype/v3-business-cost-plan-index.js`: `0C31CD95AAA138D9C45B4985F2A9C3933067422CDDF2B6A880CDAECB5136D5C3`
- `prototype/v3-business-cost-plan-index-regressions.mjs`: `8FE3F511986868E1CA442C202D6A6E5059B5946D4660DE0D2889EF7F7B4CB8B4`
- `prototype/v3-macro-simulation.js`: `6C94FFD4235CA060DB547B52D91AD160B3DF8FCA5A1D431896243C9FFBD4D2A1`
- `prototype/v3-run-orchestrator.js`: `50290C1753DEB54CE924A28264FC84888D0A48222F1F18251CB5CDB2E7955D9C`
- `docs/accounting/a03-t0063-l4-rereview-cp0377.md`: `719233D40C7227DBA8DA5671DA1C9903EBB1EA46116E3F6AD55FCA615A9D8E46`

Hashes identify selected files in the supplied snapshot, not a Git commit or complete tree hash.

**Nächster Schritt:** A01 kann den L4-Treiberprovenienz-/Nichtmutationsreview im begrenzten Scope als PASS integrieren. Der Wahrheitsgehalt ausdrücklich deklarierter upstream-Rohkomponenten bleibt eine Provenienzgrenze.
