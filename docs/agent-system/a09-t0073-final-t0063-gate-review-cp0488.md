# A09 – Finale unabhängige T-0063-G10-Abnahme (CP-0488)

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Datum:** 2026-11-01  
**Ergebnis:** **NONPASS für T-0063 G10.** Die binäre Mindestschwelle 9/9 ist nicht belegt; G2 und G6 scheitern am aktuellen Evidenzstand, G8 hat eine nicht erfüllte Per-Kanal-Prüfungslücke. Kein T-0069-G10- oder Browser-Gate wird hier bewertet.

## Preflight

Geprüfter Checkout: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, 514 Status-Einträge. Alle vorgegebenen sieben Governance-SHA-256-Werte und die Hashes für `prototype/v3/run.js`/`run.html` stimmten mit CP-0488 überein. Vorhandene lokale Änderungen blieben unangetastet. Wegen des parallel laufenden A02-Jahresprofils wurde kein Jahres-Smoke gestartet.

## Binäre Kriterien G1–G10

| Kriterium | Status | Beleg und Befund |
|---|---|---|
| **G1 Quellenprovenienz** | **PASS** | A08s Quellen-/Provenienzpakete unterscheiden beobachtete Werte und synthetische Annahmen. A02s aktuelle Runtime verlangt für beobachtete Aktivitäts-, SPI-, externe, Politik- und MRO-Werte Quelle, Einheit, Berichtsperiode, Publikationsstand/Vintage und valide Datumssemantik; synthetische Fixtures bleiben explizit markiert. A03-F01–F03-Re-Review und aktuelle Makroregression prüfen As-of-Sperre, Datumsvalidierung und Metadaten. Externe Quellenauthentizität bleibt A08-Fachreview, nicht Runtime-Funktion. |
| **G2 Vier Phasen** | **FAIL** | Makrotransitionstest unterscheidet die vier Phasen in einem 5-Monatslauf; das SPI-Historienfixture umfasst 13 Monatsperioden, hält aber die Aktivität in derselben Phase. Der A05-Dashboard-Demolauf umfasst 14 Monate mit konstantem Gap/Momentum und zeigt ebenfalls nicht alle vier Phasen. CP-0488 meldet erst 2/4 abgeschlossene 12-Monatsprofile (UPSWING, BOOM); DOWNTURN und LOW laufen noch bzw. stehen aus. Daher ist die geforderte feste, reproduzierbare 12-Monats-Evidenz für jede Phase aktuell unvollständig. |
| **G3 Außenwirtschaftskanäle** | **PASS** | CP-0487 schloss T-0070/G3: drei getrennte Kanäle; Auslandsnachfrage und Materialeingang verändern kontrolliert echte Anfrage-/Material-/Planungsvariablen, FX bleibt nichtbindende Plananzeige. A09 CP-0476/0483/0485 und T-0070-Re-Review, A03/A08-Belege sowie A05-Regressionen belegen Neutral-/Wirkungspaar, Lag, Replay und Finanzgrenze. |
| **G4 Politikfelder** | **PASS** | A02-Makromodell führt die acht Kategorien mit Ziel-/Zwischenindikator, Exposition, Scope, Effektgruppe, Quelle und Lag. Die fokussierte Politikregression belegt sieben nichtmonetäre Kanäle mit Richtung, Neutralität, Scope, Deduplizierung und Replay; der monetäre Pfad ist durch den separaten T-0071-Hike/Cut/Neutral-Test belegt. Das sind ausdrücklich synthetische, teils nur informative Planwirkungen, keine kalibrierten Politikprognosen. |
| **G5 EZB** | **PASS** | T-0071 ist nach A02/A03/A09-Review abgeschlossen. Die identischen Neutral-/Hike-/Cut-Inputs isolieren den MRO-Schock; MRO und indikative neue Finanzierung reagieren nach Lag, der getrennte `investmentPlanIndex` später. Bestehende Verträge/FinanceState/Ledger bleiben unberührt. A08 bestätigt Quellenkennung und qualitative Transmissionsgrenze; keine empirische Koeffizienten- oder Firmenkalibrierung wird beansprucht. |
| **G6 Inflationsmessung** | **FAIL** | SPI-Gewichtssumme, Basis `2020=100`, Version, Einheiten, m/m-/y/y-Regel, fehlende Historie und Einzelkomponenten-Handrechnungen sind dokumentiert und getestet. Die Regression prüft konstante Werte, Komponentenpreisänderungen und Jahresraten; sie enthält aber keinen expliziten Rechenvektor für einen **Basisperioden-/Basisjahrwechsel**. Der Vertrag sagt, dass bei neuem Basisjahr eine neue Basketversion nötig wäre, bietet aber keinen passenden Rebase-Fall. Das ausdrücklich geforderte dritte feste Vektorbeispiel fehlt. |
| **G7 Operative Wirkung** | **PASS** | CP-0488 schloss T-0072/G7 nach A09-Re-Review. Kontrollpaare ändern bei unveränderter Gesamtzahl die D-0169-Anfrageverteilung bzw. bei gleichem Materialpfad die physische Verfügbarkeit/Planbarkeit derselben Operation. Neutralfälle, Lag, Nichtmutation und Trennung von FX-/MRO-/ETA-Planindikatoren sind belegt; keine Wirkung wird doppelt gezählt. |
| **G8 Zeit und Replay** | **FAIL** | Foreign-Demand-, Receipt-, FX-, MRO- und allgemeine Makro-Replay-/Restorepfade bestehen; Policy-Impact-Restore/Dedupe besteht ebenfalls. Die aktuelle Policyregression setzt jedoch für alle sieben Nicht-Monetärkanäle im Hauptpaar `lagPeriods: 0` und prüft einen verzögerten Aktivierungsfall nur für Tarifpolitik. Damit ist die binäre Vorgabe, Wirksamkeitsperiode und Lag **je Kanal** zu prüfen, nicht vollständig belegt. Replay-/Historyintegrität allein ersetzt die fehlenden kanalspezifischen Zeitassertions nicht. |
| **G9 Finanzgrenze** | **PASS** | A03-Finanzreviews und aktuelle Regressionen prüfen `financeEffects=false`, unveränderten FinanceState, keine Cash-/Ledger-/AP-/Steuer-/COGS-/Vertragswirkung; MRO bleibt `indicative` ohne Vertrag, Materialreceipt mengenbezogen `nonposting_pending_cost_source`. A09 hat Makro-/Außenwirtschafts- und T-0072-Paare unabhängig auf Nichtmutation geprüft. |
| **G10 Fachabnahme** | **FAIL** | A08/A02/A03/A05/A09 liefern umfangreiche Quellen-, Modell-, Finanz- und UI-Belege. A05-Makro-, Policy-, Material-/FX-, Foreign-Demand- und Cache-Regressionen bestehen; A09 hat G3/G5/G7 unabhängig geprüft. G10 setzt aber ausdrücklich PASS für alle neun vorherigen Kriterien voraus; G2/G6/G8 sind nicht bestanden. |

## Ausgeführte fokussierte Regressionen

Alle folgenden Befehle liefen ohne Jahres-Smoke und bestanden:

- `node prototype/v3-macro-simulation-regressions.mjs`
- `node prototype/v3-price-index-regressions.mjs`
- `node prototype/v3-macro-policy-impact-regressions.mjs`
- `node prototype/v3/a05-t0063-macro-regressions.mjs`
- `node prototype/v3-macro-demand-channel-regressions.mjs`
- `node prototype/v3-foreign-demand-market-regressions.mjs`
- `node prototype/v3-macro-trade-impact-regressions.mjs`
- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs`
- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs`

Diese erfolgreichen Suiten heben die expliziten G2-, G6- und G8-Evidenzlücken nicht auf. A02s aktuell laufende Jahresprofile wurden nicht gestartet oder unterbrochen.

## Abgrenzung / unabhängige Reviewgrenzen

`run.js` und `run.html` sind in diesem Checkout untracked. Die vorgegebenen aktuellen Hashes stimmen, die UI-Regressionen bestehen; ein Git-Basisdiff zur unabhängigen Bestätigung, dass ausschließlich die gemeldeten Renderer-/Cache-Helfer wiederhergestellt wurden, liegt nicht vor. Es fand kein Browser-/Geräte-Smoke statt. T-0063 G10 verlangt hier UI-Belege, nicht das separate T-0069 G10-Gerätegate; die fehlende Browserprüfung wird deshalb als Grenze und nicht als eigener T-0063-FAIL geführt.

**Übergabe an A01:** T-0063 G10 **NONPASS**, bis mindestens (1) die ausstehenden DOWNTURN-/LOW-12-Monatsläufe mit reproduzierbaren Phasenprotokollen vorliegen, (2) ein expliziter SPI-Basiswechselvektor ergänzt und geprüft ist und (3) Lag-/Wirksamkeitsperioden für die verbleibenden Politikkanäle einzeln geprüft sind. Keine Code-, Ticket-, CP- oder Governanceänderung, kein Commit/Push.
