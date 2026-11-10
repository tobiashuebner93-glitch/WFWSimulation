# A09 Adversarial-Re-Review – T-0070 / CP-0418 (CP-0476)

**STATUS:** PASS im begrenzten CP-0418 Runtime-/State-/Nonposting-Scope; kein Abschluss von T-0070, T-0072 oder T-0063  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**GOALS/TICKETS:** MG-002 / SLG-002.2, SLG-002.5 / T-0070 (T-0063 G3)  
**VORGÄNGER:** CP-0476; A02 CP-0418; A08 CP-0417; A03 CP-0419  
**REPOSITORY:** `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**DIGEST:** CP-0476-Control-Plane-SHA-256 erneut geprüft; alle sieben Werte stimmten.

## Umfang und Ergebnis

Unabhängige QA der A02-Implementierung aus CP-0418 für synthetische Auslandsnachfrage im Shared-Run-Marktpfad sowie der angrenzenden FX-Importplanprojektion. Runtime-, State-, Replay- und Finanz-Nichtmutationsgrenzen wurden anhand des Codes und der vorhandenen Regressionen geprüft. **PASS gilt nur für diesen Scope.**

Die D-0169-Basisanfragen werden vor der Segmentumverteilung erzeugt. Die Allokation ändert vorhandene ganzzahlige Anfrage-Templates und erhält deren Gesamtzahl. Im Februar-Testlauf mit vier Wochen zu je `N=5` blieben es exakt **20** Templates; die exportfähigen Segmente verteilten sich kumulativ auf **3/4/3/3**, also **13/20** statt der Basis **12/20** bei synthetischen `+5 pp`. Januar blieb vor dem einmonatigen Lag neutral; der Januarimpuls wurde erst im Februar wirksam, und der Monatswechsel setzte die kumulative Verteilung zurück.

Neutrale, fehlende, Null- und Null-Expositionseingaben ändern den Basismix nicht. Gleicher Run, Seed und gleiche Eingaben reproduzieren Zuordnung und Monatscarry. Restore rekonstruiert Vorlagen aus D-0169-Traces und autoritativen Makro-/Run-Inputs; manipulierte Schedule-, Quell- oder Fixturedaten sowie Cross-Run-Vorwochen werden abgewiesen. Unbekannte oder doppelte wirksame Kanäle erzeugen keine zusätzliche Wirkung. Die Prüfung fand keine Erzeugung von Zuschlägen, Work Orders, Aufträgen oder Finance-Ereignissen durch den Makroimpuls; FinanceState blieb im geprüften Lauf gleich.

Der benachbarte FX-Pfad wurde als offene Importplanindex-Projektion geprüft. Das Ergebnis ist eine nichtbuchende Planannahme; akzeptierte Lieferantenpreis-Snapshots und Finanzwerte werden durch diesen Makroeffekt nicht umgeschrieben. Die Fixturewerte `+5 pp`, Exposition und Lag sind ausdrücklich synthetische Szenarioparameter, keine empirische KMU-Elastizität oder Prognose.

## Ausgeführte Tests

Alle sechs bestehenden Regressionen liefen im Checkout und meldeten PASS:

- `node prototype/v3-foreign-demand-market-regressions.mjs`
- `node prototype/v3-macro-trade-impact-regressions.mjs`
- `node prototype/v3-macro-demand-channel-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-run-macro-fixture-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`

Die Foreign-Demand-Suite deckt unter anderem Neutralität, positiven/negativen Shift, `N=0/1/2/5/17/100/501`, deterministische Monatsverteilung, Segment-Scope, Duplikat-/Unknown-Fälle, Cross-Run, Save/Restore und Source-/Schedule-/Fixture-Tampering ab. Die D-0169-Suite prüft den 52-Wochen-Pfad und Restore-/Finance-Invarianten.

## Grenzen und offene Nachweise

- **UI / Browser / Geräte:** nicht geprüft. CP-0418 hält fest, dass der Run-HTML-Modulgraphhash nach den Runtimeänderungen noch nicht aktualisiert war. A05 muss anschließend tatsächliche Anfrage-/Segmentzusammensetzung, Kapazitätsanforderung, Effektmonat, Herkunft und synthetische Kennzeichnung sichtbar integrieren und den Graph-/UI-Pfad prüfen. Kein Browser- oder Gerätetest wurde ausgeführt.
- **Gesamte Außenwirtschaft / T-0070:** Dieser Bericht ersetzt keine aktuelle A08-Quellenabnahme aller Kanäle und keine integrierte Bewertung des gesamten Drei-Kanal-Gates. Die hier geprüften Außenwirtschafts-Pfade belegen insbesondere den synthetischen Exportmix-Slice und den angrenzenden FX-Planindex. Keine Aussage über eine empirische Unternehmenswirkung.
- **Gesamtintegration:** kein Jahreslauf, kein Release- oder Produktfreigabenachweis; T-0072 und T-0073 wurden nicht geprüft.
- **Git:** Branch und HEAD geprüft. Der Checkout enthält umfangreiche bereits vorhandene lokale Änderungen. Dieser Auftrag hat ausschließlich diesen Bericht neu angelegt; keine Produktdatei wurde geändert, kein Commit/Push ausgeführt.

**AUSFÜHRUNG:** Regressionen siehe oben; Bericht A09.  
**FACHREVIEW:** A03 CP-0419 Nonposting-/Periodenreview vorhanden und berücksichtigt; keine erneute Fachfreigabe erteilt.  
**UNABHÄNGIGE QA:** PASS für den hier bezeichneten CP-0418 Runtime-/State-/Nonposting-Scope.  
**BROWSER-/GERÄTETEST:** nicht ausgeführt.  
**NÄCHSTER ADRESSAT:** A01; UI-/Graphhash-Integration danach an A05 koordinieren.
