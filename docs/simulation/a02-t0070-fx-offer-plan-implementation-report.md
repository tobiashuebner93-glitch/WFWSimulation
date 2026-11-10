# A02 – T-0070 FX-Sensitivität für offene V3-Angebotsvorschau

**Status:** PARTIAL / Gate NONPASS  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0063 G3 / T-0070  
**Stand:** 2026-11-01  
**Branch/HEAD vor Änderungen:** `main` / `8b72b7e35fd7bbd8d967655d0a97e0a01b93266` (keine Commits)  
**Preflight:** sieben Control-Plane-Dateien geprüft. `ticket-board.md` und `collaboration-state.md` weichen vom CP-0476-Digest ab und wurden vollständig neu gelesen. Die bereits bestehenden lokalen Änderungen blieben unangetastet.

## Ergebnis

Der selektierbare Lauf-Fixturepfad bindet jetzt eine explizite synthetische FX-Planvorschau an Laufkennung, Monatsinput und Replay. Neu ist die reine Vorschau-API `previewRunOfferFxPlan(state, fields)`. Sie akzeptiert nur eine offene Anfrage ohne eigenes Angebot und einen eindeutig gebundenen USD-Importplan mit ausdrücklich eingegebener EUR-Planbasis und Exposure. Eine fehlende Eingabe bzw. fehlende FX-Provenienz bleibt neutral; fremde Währung, fremde Plan-ID, unbekannte Anfrage und bereits abgegebene/geschlossene Anfrage werden gesperrt.

Für das isolierte Fixture beträgt der synthetische Basisindex 100 bei `0.9 EUR_per_USD` im Januar. Die synthetische Februarquote `0.945 EUR_per_USD` wird mit einem Monat Lag erst im März wirksam. Die bestehende Testannahme von 25 % Pass-through und ±2 % Monatskappung ergibt für diese 5-%-Änderung den Planindex 101,25. Dies ist eine ausdrücklich synthetische Spielannahme und keine empirisch belegte Elastizität, kein Lieferantenpreis und kein ECB-Transaktionskurs.

Die Projektion berechnet nur einen zusätzlichen hypothetischen Planbetrag für die offene Angebotsvorschau. Sie ändert weder die vom Spieler eingegebene Angebotsgröße `R` noch direkte Angebotskosten, den eingereichten Kalkulationssnapshot, Auftrag/Vertrag, Einkauf, Bestand, Cash, FinanceState, BAB/COGS oder Ledger. Es werden keine Änderungen an angenommenen Verträgen vorgenommen. Save/Restore stellt den gleichen Fixture- und Replayzustand wieder her. Vorschauen werden nicht als mutable Zustand gespeichert.

Die offizielle ECB-Reihenkennung `EXR.D.USD.EUR.SP00.A` (USD je EUR) ist ausschließlich Kontext-/Provenienzmetadatum; sie ist die inverse Quotierung zur synthetischen Fixtureeinheit EUR je USD. Weder ein ECB-Spotwert noch diese Referenzreihe speist die synthetische Quote oder Planrechnung. Kein Kurswert wurde in den Fixtureinput übernommen.

## Feldervertrag für A05

Backend-Aufruf:

```js
previewRunOfferFxPlan(runState, {
  inquiryId,                 // konkrete inquiryId des Runs
  planId: 'T0070-IMPORT-PLAN-1',
  planBasisCents,             // ausdrücklich eingegebene hypothetische EUR-Planbasis
  planBasisCurrency: 'EUR',
  importCurrency: 'USD',
  importExposureFactor: 1,    // explizite Spielerangabe; Fixture validiert derzeit nur 1
  playerNetPriceCents,        // optional; wird unverändert zurückgegeben, nie angepasst
})
```

`status` ist `ready`, `neutral` oder `blocked`. Bei `ready` sind `hypotheticalPlanCents`, `deltaCents`, `sourceRef`, `fxSeriesRef`, `sourceSnapshotId`, `observedPeriod`, `effectivePeriod`, `lagPeriods`, `assumptionId`, Pass-through und Kappung sichtbar. `neutral` muss ohne Wirkung dargestellt werden. `blocked` darf keine FX-Auswirkung anzeigen oder eine Angebotsabgabe ermöglichen. Die Vorschau ist ein eigener Plan-Sensitivitätsblock und darf nicht in `R`, direkte Kosten oder den Angebots-/Vertragssnapshot kopiert werden. Die UI darf nur bei offenem, noch nicht abgegebenem Angebot anbieten und muss beim Submit/Statuswechsel verwerfen bzw. einfrieren; es gibt keine DB-/Save-Schemaänderung.

## Getrennte Kanäle / Gate-Abgleich

Der bestehende Makrovertrag führt getrennte Kanäle `fx_imported_inputs`, `foreign_demand`, `international_supply` und `business_input_cost_plan`. Im begrenzten Backendpfad bewirkt FX nun eine nichtbuchende Angebotsplan-Sensitivität; die bestehenden Foreign-Demand-Regressionen belegen separat die verzögerte Segmentverteilung der Anfragevorlagen, und ETA bleibt eine getrennte offene Lieferterminprojektion. Neutral-/Wirkungsfälle, Quelle/Annahme und Monats-Lag sind für diese Harnesspfade vorhanden.

**G3 bleibt insgesamt NONPASS:** Die FX-Option ist noch nicht in der Angebotsform/Browseroberfläche sichtbar integriert. Außerdem sind die synthetischen FX-Werte kein empirischer Wirkungsnachweis. A05 muss die Felder und Previewanzeige integrieren; danach sind A03-Nichtposting-, A08-Quellen-/Grenz- und A09-Replay-/Regression-Reviews nötig. A01 entscheidet anschließend, ob die Nachweise T-0070-Abnahmebedingungen erfüllen.

## Tests

- `node --check` auf `prototype/v3/run.js`, `prototype/v3-run-orchestrator.js`, `prototype/v3-run-macro-fixture.js`: PASS.
- `node prototype/v3-fx-offer-plan-preview-regressions.mjs`: PASS – explizite Auswahl, einmonatiger Lag, reale offene/ungesendete Anfrage, unverändertes `R`, Neutral-/Missing-/Foreign-Fall, Save/Restore, Nichtbuchung, Sperre nach Submit.
- `node prototype/v3-macro-trade-impact-regressions.mjs`: PASS – bestehende FX-/Foreign-Demand-/ETA-Gegenfälle, Richtungen/Kappung, angenommener Snapshot, Replay und Finance-/Market-Nichtmutation.
- `node prototype/v3-destatis-import-price-reference-regressions.mjs`: PASS.
- `node prototype/a02-t0063-offer-sensitivity-integrity-regressions.mjs`: PASS.
- Fachreview A03/A08/A09 dieses neuen Slices: nicht ausgeführt; nachgelagerte Übergabe.
- Browser-/Gerätetest: nicht ausgeführt.
- Git-Status geprüft; kein Stage/Commit/Push.

## Grenzen / nächster Adressat

Kein Importartikel-, Lieferanten-, Istkosten- oder Angebotskostenbeleg wird im Bestand auf den Plan bezogen. Das Fixture referenziert daher nur einen expliziten hypothetischen Planposten und wird nicht automatisch auf Material-/Logistikzeilen angewandt. Nächster Adressat für die sichtbare Integration: **A05**. Danach: **A03** (Finanz-Nichtmutation), **A08** (Quellen-/Modellgrenze), **A09** (Replay/Regression). Bis diese Arbeit und die Reviews vorliegen, bleibt T-0070 PARTIAL/NONPASS.
