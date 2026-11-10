# A09 – T-0082 SPI-Rebase unabhängiger QA-Review (CP-0489)

**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Ergebnis:** **PASS für den aktuellen T-0082 Helper und die fokussierte Regression.** Keine Abnahme von T-0063 G6 insgesamt oder anderen Gates.

## Preflight

Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, Status 533. Alle sieben Governance-Hashes des A01-Preflights stimmen. Geprüfte Codehashes stimmen ebenfalls mit dem Auftrag überein:

- `prototype/v3-price-index.js`: `8EF2FC0381DCC1443BB180867E38464184C9793F53ECA6ADC424BBDB8A077923`
- `prototype/v3-price-index-regressions.mjs`: `CA7963DF63355A674BB27DB64FCE06C095EE8A7E8EA068F613872083C42F58BF`

## Adversarial Befund

- **Periodenfolge:** Helper validiert `YYYY-MM`, strikte Chronologie/Eindeutigkeit und verlangt für jede benachbarte Beobachtung genau den Folgemonat. Ein fehlender Monat vor oder innerhalb der gelieferten Reihe wird fail-closed abgewiesen. Regression deckt einen fehlenden Zwischenmonat (`2027-02`) ab.
- **m/m und y/y:** m/m vergleicht nur mit der vorigen Zeile, die durch die lückenlose Validierung zwingend der Kalendervormonat ist. y/y nutzt Position minus zwölf; bei zusammenhängender Folge ist das der Monat exakt ein Jahr zuvor. Tests prüfen `null` ohne ausreichende Historie und einen 13-Monatsfall mit erwarteter y/y-Rate `0,2579127225…`.
- **Herkunft / Mischung:** Top-Level-Reihe und alle zwölf COICOP-Komponenten müssen dieselbe zulässige Basketversion, Komponentenbasis, SourceRef und Fixture-ID binden. Regression prüft gemischte Basketversion, Komponentenbasis, Quelle, fehlende Metadaten/Komponente und ungeordnete bzw. lückenhafte Perioden.
- **Nichtmutation:** Test klont die Eingabe vor dem Rebase und vergleicht sie danach strukturell; Rebase liefert neue eingefrorene Ausgabeobjekte. Die getrennte reine SPI-Berechnung testet ebenfalls unveränderte Eingabekomponenten.
- **Alte Berechnung / Replay:** Bestehender `calculateV3SpiPeriod` bleibt nutzbar und wird mit dem bisherigen V3-Modelllabel getestet. Der Rebase erzwingt ausschließlich `V3-SPI-COICOP12-v1`; ein neuer amtlicher Warenkorb wird nicht behauptet. Das ist ein reiner Berechnungs-/Historienhelper und persistiert keine Spielhistorie oder Save/Restore.
- **Vektor:** A03-Handrechnung mit COICOP 04 Gewicht 259,25‰ ergibt Aggregat 100,51850 und 100,77775; Rebase liefert Basis 100 und Folgeindex 100,2579127225… ohne Geldrundung.

## Prüfung und Berichtskonflikt

`node --check prototype/v3-price-index.js` – PASS; `node --check prototype/v3-price-index-regressions.mjs` – PASS; `node prototype/v3-price-index-regressions.mjs` – PASS.

Das aktuelle Dokument `docs/accounting/a03-t0082-spi-rebase-review.md` hat SHA-256 `A33F53444FB549CB210CB3CF32CB2ED53266F893419919C27ADE7119D327EBA7` und beschreibt noch den vorigen Gap-Befund als FAIL. Dessen Periodenlücken-Reproduktion passt nicht mehr zum aktuellen Sourcehash: Der Helper enthält jetzt die aufeinanderfolgende Kalendermonatsprüfung und die fokussierte Regression weist einen Gap ab. Der A03-Bericht ist daher als veralteter Stand erkennbar; der hier bewertete Befund stützt sich auf den aktuellen Code und die ausgeführte Regression. A02-Bericht SHA-256 `984B21C3F815A1E948B54F32BE7B4E330D15D3C5EC27F13A9105FADED50CE01A` erläutert den synthetischen Scope.

## Grenzen

PASS gilt nur für Rebaseformel, lückenlose Monatsachse, Rates, Provenienz, Nichtmutation und Verfügbarkeit der älteren Berechnungsfunktion in diesem Helper-Scope. Es werden weder externe offizielle Basisdaten noch eine neue Basketversion belegt. Keine Browser-/Jahreslaufprüfung, keine Code-, Ticket-, Governance- oder Commitänderung.
