# A02-Fixbericht: Wochenendbelegungen im L0/L1-Arbeitskapazitätspfad

**Status:** Implementierung und gezielte Regressionen abgeschlossen; A03/A09-Re-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063 L0/L1, T-0069
**Entscheidung:** D-0169; keine neue Produkt-/Finanzentscheidung
**Kalenderbasis:** D-0011 und A02-Kernkalender Montag–Freitag; Samstag/Sonntag arbeitsfrei
**Vorgänger:** CP-0357, A03-Review CP-0358, A09 NONPASS CP-0359

## Preflight und Befund

Erneut gelesen wurden AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket-Board, Collaboration State, Decision Log mit D-0011/D-0169, CP-0357, CP-0358, CP-0359, A02-Wirkungsvertrag, maßgebliche Simulationsspezifikation sowie Initialisierungs-, Produktkalender-, Shared-Run-Validierungs- und Save/Restorepfade. CP-0360 war vor Erstellung nicht vorhanden. Das freigegebene Paket enthält keinen Git-Working-Tree; Branch, HEAD und Repository-Diff sind nicht verfügbar. Es wurde nur in `a02-code-input-t0063-l0l1` geändert.

A03 CP-0358 und A09 CP-0359 reproduzierten 8 Stunden am Samstag, 09.01.2027, als `plannedHours=8`, `availableCapacityHours=40`, `utilization=0.2`. Das widerspricht dem D-0011-Arbeitskalender und der Kapazitätsbasis `hoursPerDay × fünf Werktage`.

## Durchgeführter Fix

- `createV3ProductState` lehnt Samstag-/Sonntagseinträge in den initialen bestehenden Commitments fail-closed ab. `installRunOperatingResources` nutzt diese Initialisierung unverändert und nimmt die ungültige Eingabe daher nicht an. Es wird nichts auf einen anderen Tag umgedeutet oder verschoben.
- Neue `validateV3ProductWorkdayAssignments` prüft Commitment-, Produkt-Assignment-, Customer-Assignment- und Kundenoperationsdaten auf valide Arbeitstage. `validateV3RunState` ruft diese Prüfung für den gespeicherten Produktzustand auf; damit verweigern sowohl `createRunSaveEnvelope` als auch `restoreRunSaveEnvelope` einen manipulierten gespeicherten Samstag-/Sonntagstermin.
- `getV3RunOperatingImpact` summiert Arbeitsstunden ausdrücklich nur für Montag bis Freitag. Die Kapazität bleibt `Summe(hoursPerDay) × 5` und wird nicht erweitert.
- FinanceState, Geldwerte, Kosten, Vertragsdaten, D-0169-Nachfragewirkung, UI und V1/V2 wurden nicht geändert. Keine Schema-/Architekturänderung.

## Geänderte Dateien

1. `prototype/v3-product-lifecycle.js` – Initiale Wochenend-Commitments ablehnen; wiederverwendbare Wochenvalidierung.
2. `prototype/v3-run-orchestrator.js` – Wochenvalidierung im Shared-Run- und Restore-Gate.
3. `prototype/v3/run.js` – nur Werktage in Wochenlastaggregation zählen.
4. `prototype/v3-run-operating-impact-regressions.mjs` – Samstag/Sonntag bei Initialisierung und Save/Restore ablehnen; Werktagskontrolle.
5. `docs/simulation/a02-t0063-l1-weekend-commitment-fix-cp0360.md` – dieser Bericht.
6. `docs/agent-system/checkpoints/CP-0360.md` – neuer Checkpointentwurf.

## Prüfungen

Bestanden unter Node v24.22.1:

- `node v3-run-operating-impact-regressions.mjs` – Samstag 09.01.2027 und Sonntag 10.01.2027 werden bei Initialisierung, Envelope-Erstellung und Restore zurückgewiesen; Freitag 08.01. wird mit 3 Stunden in die 40-Stunden-Woche einbezogen. Vorhandene Award-/No-Award-, Nutzungs-, Save-/Restore- und Finanz-Nichtmutationsfälle bestehen ebenfalls.
- `node v3-product-lifecycle-regressions.mjs`
- `node v3-run-orchestrator-regressions.mjs`
- `node v3-macro-demand-channel-regressions.mjs`
- `node v3-run-macro-fixture-regressions.mjs`
- `node v3-finance-runtime-regressions.mjs`
- `node v3-market-simulation-regressions.mjs`
- `node --check` für `v3/run.js`, `v3-product-lifecycle.js`, `v3-run-orchestrator.js` und `v3-run-operating-impact-regressions.mjs`.
- Whitespaceprüfung für alle sechs geänderten/geführten Dateien.

Jahres-Smoke, Browser-/Gerätetest, unabhängiges Review und Git-Prüfung wurden für diesen eng begrenzten Fix nicht ausgeführt. Kein Commit/Push.

## Review-/Übergabefelder

- **Ausführung:** A02; Tests wie oben.
- **Fachreview:** A03-Re-Review dieses Wochenend- und Nichtbuchungsgates ausstehend.
- **Unabhängige QA:** A09-Re-Review des init-/envelope-/restore-Fixes ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; UI unverändert.
- **Git-Verifikation:** nicht verfügbar im Stagingpaket.
- **Offene Entscheidungen:** keine neue Nutzerentscheidung erforderlich.
- **Nächster Schritt:** A01 übernimmt die drei Runtime-/Regressionänderungen und Bericht/CP in das Repository und beauftragt A03 und A09 mit getrennten Re-Reviews. Kein Commit/Push aus diesem A02-Los.
