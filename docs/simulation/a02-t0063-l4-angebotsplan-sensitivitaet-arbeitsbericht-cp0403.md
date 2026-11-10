# A02 – T-0063 L4-Angebotsplan-Sensitivität (CP-0403)

**Status:** Implementiert; fokussierte Regressionen bestanden; A03-Re-Review und A09-Adversarialreview ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0067 angrenzend
**Profil:** gemeinsamer V3-Run ab 04.01.2027; bestehende V1-/V2-Pfade unverändert
**Vorgänger:** CP-0402 (A03 bedingtes Finance-PASS); CP-0401 (A01 Browsernachweis)
**Entscheidungen:** D-0162, D-0163, D-0169
**Git-Basis:** `main@8b72b7e`; umfangreiche vorhandene Working-Tree-Änderungen blieben unangetastet

## Runtime-Vertrag

Der neue pure Berechnungspfad `calculateV3OfferPlanSensitivity` kennt zwei explizite Modi: `unadjusted` und `apply_l4_plan_indices`. Der Laufzeitaufruf behält ohne neue UI-Eingabe aus Kompatibilitätsgründen `unadjusted` bei. Es gibt keinen automatischen Moduswechsel. Der Sensitivitätspfad ändert nur eine noch nicht abgegebene Angebotskalkulation.

Im Sensitivitätsmodus muss jede Kostenposition eine explizite Kategorie (`material`, `logistics`, `labor`, `other`) und `basePeriod: 2027-01` tragen. Material und Logistik verwenden ausschließlich den Effekt `procurementPlanIndex`; Arbeit ausschließlich `wagePlanIndex`; `other` bleibt unverändert. Eingabebeträge sind ausdrücklich Januar-2027-Planbeträge. `BusinessInputCostIndex` wird nicht zusätzlich angewandt. Der Nettoplanpreis `R` bleibt unverändert.

Der jeweilige Index muss eindeutig, `projected`, `information_plan`, ohne Finanz-/Istmutation, mit Basiswert 100 und passender Wirksamkeitsperiode vorliegen. Quelle/Quellreferenz, Snapshot oder Parametersatz und Modellversion werden mit dem vollständigen Indexeffekt in der Angebotskalkulation eingefroren. Fehlende, doppelte, periodenfalsche oder nicht belegte Indexeffekte ergeben `pending`; die Angebotsabgabe wird abgewiesen, bis der Spieler unadjusted wählt oder die Evidenz vorliegt.

Die Beträge werden in Cent mit ganzzahliger positiver Half-up-Rundung **pro Kostenzeile** umgerechnet. Der Snapshot enthält den unadjustierten Ausgangsbetrag sowie den benutzten Betrag, Kategorie, Indexkennung/-wert und Quellen-/Periodenprovenienz. Das bestehende unveränderliche Angebots-/Annahmesnapshot führt diese Nachweise in `calculation.planSensitivity`; spätere Makroindizes werden nicht rückwirkend angewandt.

Keine Änderung an BAB, Ledger, Cash, Steuer, Istkosten, AR/AP, Bestand/COGS, Vertragspreis oder angenommener Offerte. Keine Schema-/Architekturentscheidung und keine Rechtsaussage.

## Geänderte Dateien

- `prototype/v3-offer-plan-sensitivity.js` – pure, fail-closed Planberechnung und Provenienzbindung.
- `prototype/v3-offer-plan-sensitivity-regressions.mjs` – Modus-, Zuordnungs-, Rundungs-, Fehler- und Snapshot-Replayprüfungen.
- `prototype/v3/run.js` – optionaler Modus und unveränderlicher Snapshotnachweis im gemeinsamen Run-Angebotspfad.
- `docs/simulation/a02-t0063-l4-angebotsplan-sensitivitaet-arbeitsbericht-cp0403.md` – dieser Vertrag/Arbeitsbericht.
- `docs/agent-system/checkpoints/CP-0403.md`, `ticket-board.md`, `collaboration-state.md` – CP-Entwurf und Folgeübergaben.

Die UI-Auswahl und Vorschau sind ausdrücklich nicht Teil dieses A02-Loses und gehen nach den Fachreviews an A05.

## Prüfungen

- `node --check prototype/v3-offer-plan-sensitivity.js`: PASS.
- `node --check prototype/v3/run.js`: PASS.
- `node --check prototype/v3-offer-plan-sensitivity-regressions.mjs`: PASS.
- Neue Plan-Sensitivitätsregressionen: PASS.
- `v3-financial-calculation-regressions.mjs`: PASS.
- `v3-run-orchestrator-regressions.mjs`: PASS.
- `v3-run-operating-impact-regressions.mjs`: PASS.
- `v3-run-macro-fixture-regressions.mjs`: PASS.
- `a05-t0069-run-ui-regressions.mjs`: PASS.
- `a09-t0069-run-ui-adversarial-regressions.mjs`: PASS.
- `v3-finance-runtime-regressions.mjs`: PASS.
- Zielgerichtetes `git diff --check` für die geänderten Laufzeit-/Regressiondateien: PASS.
- Browser-/Gerätetest: nicht ausgeführt.
- A03-Fachre-Review/A09 unabhängige QA: noch nicht ausgeführt.

## Grenzen / Übergabe

Im bestehenden UI gibt es noch keine Eingabefelder für Modus/Kategorien; der Runtime-Pfad bleibt daher rückwärtskompatibel unadjusted. A05 soll erst nach A03/A09-Review eine sichtbare Wahl und Erklärung integrieren. Der Finanzruntime-Zustand wird vom Angebotspfad nicht entgegengenommen oder verändert; Nichtmutation ist damit durch Schnittstellengrenze plus bestehende Finance-Regression abgedeckt, aber noch nicht durch einen vollständigen UI-Submit-/Save-/Restore-Sensitivitäts-E2E-Test.

**Nächster Schritt:** A03 re-reviewt Perioden-, Rundungs- und Finanzgrenzen; danach A09 prüft Fail-closed-Verhalten, Snapshot-Freeze, Doppeltreiber und Nichtmutation adversarial. A05-UI bleibt bis zu beiden Reviews zurückgestellt. T-0063/T-0067/T-0069 bleiben IN_PROGRESS.
