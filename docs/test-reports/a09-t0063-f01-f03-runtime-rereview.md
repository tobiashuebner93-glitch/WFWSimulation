# A09 unabhängiger Runtime-Re-Review – T-0063 F-01 bis F-03

**STATUS:** PASS für die isolierten Runtime-Korrekturen F-01/F-02/F-03 und Aktivierungshistorie; keine V3-Gesamtfreigabe
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**GOAL:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0063 (Runtime-Teilgate)
**BASIS:** A02 Arbeitsbericht und Simulationsvertrag; A03 Finanzreview; vorherige A09 Runtime-QA

## Preflight und Umfang

Frisch gelesen: `AGENTS.md`, Agentenstruktur und Rechte-Matrix, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279 und CP-0280 (ENTWURF), D-0161/D-0163, T-0063 sowie A02/A03-Verträge und Berichte. Repository: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, vorbestehender Arbeitsbaum mit parallelen Änderungen. Alle fremden Änderungen blieben erhalten. A09 prüft Runtime-Verhalten und Regressionen, nicht Rechtslage, empirische Kalibrierung oder Produktfreigabe.

## Gate-Ergebnisse

| Gate | Ergebnis | Nachweis |
|---|---|---|
| F-01: Beobachtungs-Provenienz und As-of | **PASS** | Gemeinsamer Validator verlangt bei `sourceType=observed` eine gültige Beobachtungsperiode, `publishedAt`, Einheit, `sourceRef` und Vintage oder Snapshot-ID. `publishedAt` nach Monatsende des Inputs wird abgewiesen. Regressionen akzeptieren eine gültige Januar-Beobachtung mit Publikation 15.01.2027 und weisen fehlendes Veröffentlichungsdatum sowie Publikation 15.02.2027 für den Januar-As-of ab. SPI-Komponenten benötigen zusätzlich dieselbe Periode, Basis `2020=100` und passende Warenkorbversion. Quartalsbeobachtung und beobachteter MRO laufen durch denselben Provenienzpfad. |
| F-02: Quote-Gültigkeitsfenster | **PASS** | `validFrom`/`validUntil` müssen echte ISO-Kalendertage und geordnet sein. Regressionen prüfen: zukünftiges Fenster → kein Handoff; gültiges Fenster → `indicative`; vor dem Monatsende abgelaufen → `expired`; unmögliches Datum 30.02.2028 und umgekehrtes Fenster → kontrollierter Fehler. Handoff hat `contractId=null`, `createsLedgerEffect=false`; Finanz-Cash-/Vertragswirkungen sind `false`. |
| F-03: vollständiges Wirksamkeitsdatum | **PASS** | `effectiveFrom` verlangt `YYYY-MM-DD` und wird auf ein tatsächlich mögliches Datum validiert. Regression: `2027-02-31` wird abgewiesen; `2027-02-01` im Januarinput wird als Wirksamkeitsperiode 2027-02 geplant. Lag-Regression prüft Januar-Event mit Lag 2: Januar/Februar nicht wirksam, März wirksam. |
| Frühere Aktivierungshistorie | **PASS** | Regression entfernt eine fällige Januar-ID konsistent aus `effectiveMacroEvents`, `activatedMacroEventIds` und `state.activatedEventIds`; Zustandsvalidierung weist sie mit unvollständiger Historie zurück, Februartransition endet mit `invalid_macro_state`. Vollständiger Februarzustand bleibt gültig und spielt die Januar-ID nicht erneut. |
| Eingabe-/Quellzustands-Nichtmutation | **PASS** | Hauptregression vergleicht Ursprungszustand und Eingabe vor/nach erfolgreichem Lauf deep-equal. Der pure Übergang gibt einen neuen Zustand zurück. Beschädigte Historie wird vor Folgetransition kontrolliert zurückgewiesen. |

## Prüfungen ausgeführt

- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS (`V3 macro simulation regressions: PASS`).
- `node prototype/v3-price-index-regressions.mjs` – PASS (`V3 SPI COICOP12 regressions: PASS`).
- `git diff --check` – Exit 0; ausschließlich konfigurierte LF/CRLF-Hinweise.
- `git status --short --branch` – `main...origin/main`; parallele lokale Änderungen vorhanden. Keine davon bearbeitet, verworfen oder committet.

## Grenzen

Keine Browser-/Mobilprüfung, keine End-to-End-Integration mit dem V2-Unternehmen, keine Jahresprüfung (T-0069), keine amtliche Quellenauflösung und keine Makroparameterkalibrierung. Provenienzvalidator bestätigt Metadatenformat und As-of-Grenze, nicht die Wahrheit oder Herkunft eines `sourceRef`. A03-Finanzreview bleibt separates Fachreview. Daher gilt PASS ausschließlich für diese isolierten Runtime-/Regression-Gates und nicht für den Abschluss von T-0063 oder V3.

**Commit/Push:** nicht ausgeführt.
