# A02 T-0063 – positives L4-Kostenplan-Fixture (CP-0407)

**Status:** Implementiert und fokussierte Runtime-Regressions bestanden; Reviews und UI-Hash-Rebindung ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 und SLG-002.5
**Tickets:** T-0063, T-0067 und T-0069 bleiben `IN_PROGRESS`
**Basis:** Branch `main`, `HEAD=8b72b7e`; der bestehende umfangreiche lokale Arbeitsstand wurde bewahrt.

## Ergebnis

`createRunFromInputs` unterstützt nun den expliziten, serialisierbaren Parameter `costPlanFixtureId`. `NEUTRAL` bleibt der Standard. Die einzige positive Demoauswahl ist die bestehende Fixture-ID `V3-PLAN-INDEX-SYNTH-EQUAL-1`; sie wird in Run-ID und Root-State gebunden. Sie wird nicht anhand von Datum oder Run-ID automatisch aktiviert. Unbekannte Profile werden abgewiesen.

Der Demo-Datensatz ist ein synthetischer pädagogischer Vektor, keine Marktbeobachtung: Januar 2027, Basisperiode `2027-01`, Basiswert 100, lag 1 Monat, effektive Periode Februar 2027, explizite gleichgewichtete 25%-Anteile. Die Werte sind Material 100, Energie 110, Lohn 110 und Logistik 120. Daraus folgen nach den bestehenden Formeln:

- BICI: `(100 + 110 + 110 + 120) / 4 = 110`
- Procurement: `(100 + 120) / 2 = 110` nach Normalisierung der Material-/Logistik-Teilgewichte auf 0,5/0,5
- Wage: `110`

Die frühere Arbeitsauftragsangabe Procurement 110 bei Material 110 und Logistik 120 war rechnerisch widersprüchlich. Das Vektorpaar hätte nach der unveränderten CP-0374-Formel 115 ergeben. Der Demo-Vektor wurde deshalb angepasst; weder Aggregationsregel noch die bisherigen CP-0374-Testvektoren wurden geändert. Die bestehende Regression mit Material 110 / Logistik 120 weist weiterhin Procurement 115 aus.

Die Januar-Inputauswahl und vollständige Fixture-Provenienz werden bei Run-Validierung, deterministischem Makro-Replay und Save/Restore gegen den gespeicherten Run-State geprüft. Das Ereignis wird im Januar als synthetisches Makroereignis erfasst und erst im Februar aktiviert. Manipulierte Profilauswahl und veränderte Januar-Makroinputs werden beim Restore verworfen. V1/V2 und der neutrale Run-Default bleiben unverändert.

## Positiver Angebotsweg und Nichtbuchung

Die Regression führt den ausgewählten Shared Run über Januar-Input, Februar-Wirkung, explizite `apply_l4_plan_indices`-Angebotsabgabe, JSON Save/Restore und Kundenannahme. Die geprüften direkten Zeilen (je 1,01 € Basisbetrag) ergeben Material 1,11 €, Logistik 1,11 €, Lohn 1,11 € und sonstige Kosten unverändert 1,01 €. `R` bleibt 1,00 €. Kostenklassen verwenden nur ihren vorgesehenen Index; BICI wird nicht zusätzlich auf bereits indexierte Zeilen angewandt. Die vorhandene BAB-Allokation und Finance-State bleiben gleich. Der Submit mutiert die Eingabestate nicht. Das vorhandene Snapshot-Integritäts- und Mutationstestset deckt Änderungen vor/nach Save/Restore und nach Annahme ab.

Der neue auswählbare API-Vertrag für A05 lautet:

```js
createRunFromInputs({
  scenarioId,
  seed,
  startDate: '2027-01-04',
  endDate: '2027-02-12',
  macroPath: 'UPSWING',
  costPlanFixtureId: 'V3-PLAN-INDEX-SYNTH-EQUAL-1',
});
```

Ohne Auswahl wird weiterhin `NEUTRAL` verwendet. Die gewählte Demo-Fixture erfordert einen Lauf, der im Januar 2027 startet und mindestens bis Februar 2027 reicht. Die UI wurde in diesem Auftrag nicht geändert.

## Verifikation

**PASS:** Syntaxprüfungen; `v3-business-cost-plan-index-regressions.mjs` (einschließlich des unveränderten 115-Beispiels); `v3-offer-plan-sensitivity-regressions.mjs`; `a02-t0063-offer-sensitivity-integrity-regressions.mjs` (selected profile, Jan→Feb, Snapshot-/Profilmutation, Angebot, JSON Save/Restore, Annahme); `v3-run-macro-fixture-regressions.mjs`; `v3-macro-simulation-regressions.mjs`; `v3-run-orchestrator-regressions.mjs`; `v3-finance-runtime-regressions.mjs`; `v3/a05-t0063-macro-impact-ui-regressions.mjs`; scoped `git diff --check`.

Die A05-Offer-UI-Regression wurde ebenfalls ausgeführt. Sie besteht die vorherigen UI-/L4-Inhaltsassertions und stoppt an der SHA-256-Entrypoint-Bindung: Die neue `prototype/v3/run.js` hat Hash `8987dce6f302387d3e6873e7e23729a6bdf93328b47d6c81fa09fb3141359eab`, während `run.html` noch `c467106116422fb711f5f164a42af2bcaeb8ccabad54fb32160ed040338314da` referenziert. Der CSS-Hash ist korrekt; der kombinierte Buildtoken ist wegen des neuen JS-Hash veraltet. A05 aktualisiert nach den Reviews JS-/Buildtoken und führt dieselbe Entry-Cache-Regression erneut aus. `run.html` und UI-Verhalten wurden hier nicht geändert.

## Nächste Schritte / Grenzen

1. A03 prüft Fixture-Vertrag, Kostenindexformeln, Periodenbindung und Nichtbuchung.
2. A09 prüft anschließend Auswahlbindung und Restore-/Replay-Mutationen adversarial.
3. A05 integriert danach einen sichtbaren Fixture-Selector, aktualisiert JS-/Build-Hashbindung und wiederholt Offer-UI-/Entry-Cache-Regression.
4. Browser-/Gerätebeleg für den positiven indexbasierten UI-Weg sowie Jahres-/Ledgergate bleiben offen.

Es gab keine Schema-, Architektur-, Finanz- oder Buchungsfreigabe. Kein Commit und kein Push. CP-0403 bis CP-0406 wurden nicht verändert.
