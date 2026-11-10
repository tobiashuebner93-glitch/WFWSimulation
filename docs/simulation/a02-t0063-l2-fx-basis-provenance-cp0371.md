# A02-Bericht – T-0063 L2 FX-Basis-Provenienzfix (CP-0371)

**Status:** Fix und fokussierte Regressionen PASS; unabhängiger A09-Re-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L2
**Entscheidungsbasis:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragenfaktor
**Vorgänger:** CP-0368 Implementierung, CP-0369 A03-Finanzreview, CP-0370 A09 NONPASS
**Arbeitsbasis:** `a02-code-input-t0063-l0l1`, Stagingpaket ohne `.git`

## Befund und Korrektur

CP-0370 reproduzierte einen ungültigen Basiskurs: Januar 2027 enthielt `0.9` mit `USD_per_EUR` und ohne Test-Fixture-ID; Februar enthielt `0.945 EUR_per_USD`. Der Projektor verwendete Januar dennoch als Basis und erzeugte fälschlich einen Planindexbeitrag von +1,25 %.

Der FX-Projektor lässt eine Reihe jetzt nur zu, wenn sowohl die Januar-Basis als auch das jeweilige Folgeereignis eine positive Quote in der kanonischen Einheit `EUR_per_USD`, `baseCurrency: USD`, `quoteCurrency: EUR`, die explizite Fixture-ID `V3-L2-FX-25PASS-CAP2`, eine nichtleere Quellenreferenz, denselben `fxSeriesRef`, `sourceType: synthetic_fixture`, eine identische Run-/Scenario-Identität und den Basisindex 100 tragen. Eine Planwirkung setzt außerdem denselben offenen USD-Plan und dieselbe positive Exposition im Januar-Basisereignis und im Folgeereignis voraus. Diese Bedingungen sind Prüfungen bereits vorhandener Szenarioeingaben, keine neuen Markt- oder Produktannahmen.

Fehlende oder ungültige Basis-/Folgeprovenienz bleibt neutral. Eine fehlerhafte Januar-Basis kann nicht durch einen späteren gültig aussehenden Kurs geheilt werden. Die Ereignisse bleiben im Makro-Snapshot gespeichert; Save/Restore leitet die Projektion reproduzierbar erneut ab. Finanz-, Markt-, Vertrags-, Bestands- und Ledgerzustand werden nicht verändert.

## Geänderte Dateien

- `prototype/v3-macro-trade-impact.js` – strikte FX-Basis-, Reihen-, Run-/Scenario- und Planbindung; Trace führt Basisindex, Basiseinheit und Serienreferenz.
- `prototype/v3-macro-trade-impact-regressions.mjs` – gültige Kontrollreihe und A09-Reproduktion mit ungültiger Januar-Notierung/fehlender Fixture-ID, einschließlich Save/Restore-Neutralität.
- `docs/simulation/a02-t0063-l2-fx-basis-provenance-cp0371.md` – dieser Arbeitsbericht.
- `docs/agent-system/checkpoints/CP-0371.md` – neuer Checkpointentwurf.

CP-0368 bis CP-0370 blieben unverändert.

## Prüfungen

Mit Exitcode 0 bestanden:

- `node prototype/v3-macro-trade-impact-regressions.mjs` – gültige FX-Kontrolle (+5 % synthetischer Kursausschlag mit bestehender 25-%-Testkonvention), Gegenrichtung/Kappung, ungültiger A09-Basisfall neutral, Save/Restore neutral, Export-/ETA-/D-0169- und Finanz-Nichtmutation.
- `node prototype/v3-macro-simulation-regressions.mjs`
- `node prototype/v3-run-macro-fixture-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-macro-demand-channel-regressions.mjs` – D-0169.
- `node prototype/v3-finance-runtime-regressions.mjs`
- `node --check prototype/v3-macro-trade-impact.js`
- `node --check prototype/v3-macro-trade-impact-regressions.mjs`
- Whitespaceprüfung beider Codeänderungen – PASS, keine nachgestellten Leerzeichen.

SHA-256:

- `prototype/v3-macro-trade-impact.js`: `E5A43E70C7594AB9616AC16C23D8ADE24100165F2F24303D40378E912946BE49`
- `prototype/v3-macro-trade-impact-regressions.mjs`: `67F6D511254031AA1A0F328335D789A052D7254E77395EBD631D26ABA901BACD`

## Grenzen und Nachweisrollen

- **Ausführung:** A02; gezielte Tests bestanden.
- **Fachreview:** A03 CP-0369 prüfte den vorherigen Nichtbuchungspfad; Review dieses Fixes ausstehend.
- **Unabhängige QA:** A09 CP-0370 NONPASS vor Fix; CP-0372-Re-Review ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Änderung.
- **Jahres-/Multipfadlauf:** nicht ausgeführt; der isolierte FX-Provenienzfix benötigt hierfür keinen neuen Lauf.
- **Git-Verifikation:** nicht verfügbar, Stagingpaket enthält kein `.git`; kein Commit/Push.
- **Schema/Architektur:** unverändert.

**Nächster Schritt:** A01 beauftragt den unabhängigen A09-Re-Review CP-0372. T-0063 bleibt bis zum Review offen.
