# A02-Bericht – T-0063 L2 Außenwirtschaftsprojektion (CP-0368)

**Status:** isolierte, nichtbuchende Projektion implementiert; A03-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L2, Anschluss T-0065/T-0069
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragenfaktor
**Vorgänger:** CP-0351/0353–0356, CP-0367; A02-L2-Vertrag; A09-Provenienzreview CP-0367

## Ergebnis

Der Shared Run stellt jetzt `macroTradeImpact` als pure, aus den replayvalidierten Makro-Monatsereignissen abgeleitete Projektion bereit. Keine der drei L2-Projektionen mutiert Run, Markt, Anfrageobjekte, Verträge, Lager, FinanceState oder Ledger. Ein Effekt entsteht nur aus explizit im Makro-Monatsinput gespeicherten, replaygebundenen Feldern und den unten aufgeführten Bedingungen. Die Standardfixture liefert keine solchen FX-, Export- oder ETA-Expositionen und bleibt neutral.

### FX → offene Importplanung

Das Makroereignis muss die Notierung `USD/EUR` mit Einheit `EUR_per_USD`, einen positiven Kurs, die Fixture-ID `V3-L2-FX-25PASS-CAP2` und eine referenzierte offene USD-Importplanung mit positiver `importExposureFactor` enthalten. Der relative Kursindex nutzt Basis `2027-01=100`. Der reine Testpfad nimmt 25 % des relativen Kursausschlags auf und kappt den Planindexbeitrag auf ±2 % pro Monat. Bei einem expliziten synthetischen Kursanstieg von 5 % ergibt das 1,25 % Planindexwirkung.

Nur `status: open` ohne Annahme-/Vertragssnapshot wird projiziert. Angenommene Angebote bleiben fest; fehlender Kurs, Exposure oder Plan, andere Währung, fehlende Fixture-Kennung sowie `acceptedAt`, `acceptedOfferRef` oder `contractSnapshotRef` liefern keinen FX-Planbeitrag. Der Index ist keine Rechnung, kein Istbetrag und kein Buchungs-/Beschaffungskurs.

### Auslandsnachfrage → erwartete D-0169-Segmentverteilung

Ein `foreign_demand`-Ereignis kann mit expliziter Fixture-ID `V3-L2-EXPORT-SHIFT-5PP-LAG1`, genau einem Monatslag, `delta`, numerischer Exposure, `effectGroupId`, Segment-Scope und einer Liste existierender Exportsegmente eine Projektion erzeugen. Für jede bereits geplante Markt-Woche wird die erwartete Segmentverteilung neu gewichtet; die Gesamtzahl entspricht exakt der vorhandenen D-0169-Wochenmenge. Rundungsreste werden deterministisch und seedstabil verteilt. Die Projektion erzeugt, entfernt oder ändert keine Anfrage, keinen Zuschlag und keinen Umsatz. Bei fünf Anfragen bleiben erwartete Mengen gegebenenfalls gebrochene „inquiry equivalents“; das ist eine Planverteilung, keine Erzeugung realer Teilanfragen.

Ohne Expositions-/Scope-/Segmentreferenz oder wirksames Ereignis bleibt der Pfad neutral. Der synthetische Testwert ±5 Prozentpunkte und der Ein-Monatslag sind keine Außenhandelsdaten oder kalibrierten Wirkungswerte. D-0169 bleibt alleiniger Gesamtanfragenfaktor.

### Lieferstörung → offene Bestell-ETA

Nur `international_supply` mit der expliziten Test-Fixture-ID `V3-L2-ETA-DELAY-2-CAP5` und einer referenzierten, noch offenen Bestellung mit gültiger aktueller ETA kann die projizierte ETA verschieben. Explizite `delayDays` werden auf maximal fünf Kalendertage begrenzt; der dokumentierte Testfall nutzt zwei Tage. Fehlende Bestellung, ETA, Verzögerung, Fixture-ID oder offene Statusreferenz ist neutral.

Die Projektion ändert ausschließlich das angezeigte Plan-ETA-Feld. Sie verändert weder physischen Wareneingang noch Menge, Liefervertrag, Rechnung, Warenwert, BAB oder COGS. Zufällige Verspätungswahrscheinlichkeit oder reale Außenhandels-/Lieferdaten werden nicht erfunden.

Alle Ausgaben tragen Run-/Scenario-/Seed-Identität, Modellversion, Quelle/Quellreferenz, Daten-/Snapshotbindung soweit vorhanden, beobachtete und wirksame Periode, Lag, `effectGroupId`, Eingangsdelta, `before`/`after`, `accountingClass: information_plan`, `directFinanceEffect:false` und `actualStateChanged:false`. L2 nutzt denselben deterministischen Shared-Run-Makroreplayvalidator aus CP-0366/0367; er vertraut nicht auf synchronisierte Verlaufskopien.

## Änderungsumfang

- `prototype/v3-macro-trade-impact.js` – drei nichtbuchende L2-Projektoren, versionierte Test-Fixture-IDs, Quellen-/Plan-/Order-Scope und Dedupe.
- `prototype/v3/run.js` – `macroTradeImpact` in der Shared-Run-Projektion; keine UI-Darstellung.
- `prototype/v3-macro-trade-impact-regressions.mjs` – gerichtete FX-/Export-/ETA-Fixtures, Neutralfälle, Lag, Caps, Save/Restore und Nichtmutation.
- `docs/simulation/a02-t0063-l2-trade-impact-cp0368.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0368.md` – Checkpointentwurf.

## Testumfang und Ergebnisse

Mit Exitcode 0 liefen Syntaxchecks für `v3/run.js`, `v3-macro-trade-impact.js` und `v3-macro-trade-impact-regressions.mjs` sowie:

- `node prototype/v3-macro-trade-impact-regressions.mjs` – FX ±5 %, 25-%-Pass-through, ±2 %-Kappe, offener vs. angenommener Plan, Null-Exposure, fehlender Kurs; Export ±5 pp, Ein-Monatslag und exakt gleichbleibende D-0169-Summe; ETA +2 und max. +5 Kalendertage; Neutralfixture; Save/Restore-Replay; Run-/Markt-/Finance-Nichtmutation.
- `node prototype/v3-macro-policy-impact-regressions.mjs`
- `node prototype/v3-run-operating-impact-regressions.mjs`
- `node prototype/v3-macro-demand-channel-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`
- `node prototype/v3-run-macro-fixture-regressions.mjs`
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-finance-runtime-regressions.mjs`

Gezielte Regressionen bestanden. Kein Jahres-Multipfadlauf; Browser-/Gerätetest nicht ausgeführt. Whitespaceprüfung und SHA-256-Erfassung erfolgen nach Finalisierung dieses Berichts und sind im CP dokumentiert.

## Abgrenzung und Review

- **Implementiert:** replayvalidierter, bedingter nichtbuchender Projektor und Shared-Run-Ausgabe.
- **Nur synthetische Testfixtures:** 25-%-FX-Pass-through, Monatskappe ±2 %, Exportverschiebung ±5 pp mit einem Monat Lag und Lieferverzug +2 Tage/max. +5. Diese Zahlen werden nicht als Produkt-, Branchen-, Rechts- oder empirische Defaults ausgegeben.
- **Nicht vorhanden:** operative V3-Beschaffungs-/Bestellverwaltung. FX- und ETA-Ausgaben bleiben daher neutral, außer ein expliziter Plan-/Bestellbezug wird als Makroinput mitgespeichert.
- **Ausführung:** A02, fokussierte Tests PASS.
- **Fachreview:** A03 L2-/Finanz-Nichtbuchungsreview ausstehend.
- **Unabhängige QA:** A09 nach A03 ausstehend.
- **UI:** unverändert; keine Produktanzeige hinzugefügt.
- **Schema/Architektur:** keine Änderung oder Freigabe.
- **Git:** Stagingpaket ohne `.git`; kein Status-/Diffnachweis, Commit oder Push.

**Nächster Schritt:** A03 führt den frisch-preflighteten Finance-/Nichtbuchungsreview aus, dann A09 den unabhängigen L2-Adversarialreview. T-0063/T-0069 bleiben offen.
