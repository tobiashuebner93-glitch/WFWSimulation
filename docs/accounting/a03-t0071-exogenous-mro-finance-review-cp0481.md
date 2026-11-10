# A03 – T-0071 exogener MRO-Schritt: Finanzgrenzenreview

**FINANZ-GRENZE:** PASS für den geprüften Simulations-/Handoff-Scope  
**T-0071 / T-0063 G5:** keine Gatefreigabe durch diesen Finanzreview; A01/A09 und eine eventuelle UI-/operative Abnahme bleiben separat.  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Basis:** CP-0481; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**Scope:** Read-only Fachprüfung von MRO-Input, indikativem Neukonditions-Handoff, nachgelagertem Investment-Planindikator und fokussierten Regressionen. Keine Code-/Regeländerung.

## Finanzgrenzenbefund

Der neue Pfad modelliert nur ein ausdrücklich synthetisches Exogenereignis und unverbindliche Projektionen. In `runV3MacroMonth` werden Makromonat und Makroeventstate fortgeschrieben; die Funktion nimmt keinen Unternehmens-`FinanceState`, Vertrag, Kreditbestand oder Geldsaldo entgegen. Das Ereignis ist auf `V3-T0071-EXOGENOUS-MRO-DIRECTION-PAIR-LAG1` und `synthetic-fixture:T-0071:exogenous-mro-direction-pair` beschränkt. Jeder Makrosnapshot weist `ledger`, `cash`, `receivables`, `payables`, `inventory`, `payroll` und `existingContracts` als `false` aus.

Der Finanzierungs-Handoff wird nur bei verfügbarer MRO-Rate und explizitem `newCreditRequest` berechnet. Seine Kennzeichnung ist `status: indicative`; `contractId` und `contractVersion` sind `null`; `createsFinancialEvent` und `createsLedgerEffect` sind `false`. Er enthält keinen Darlehensbetrag, keine Auszahlung, Tilgungs-/Zinsbuchung oder bestehende Kreditkennung. `creditRequestId` bezieht sich im Test auf eine neue hypothetische Finanzierungsanfrage. Es gibt keinen Codepfad von dieser Quote zu einem Altvertrag, zum Kreditbestand, in eine Zahlung, einen Cash-/Bankwert, eine Ausgabe, BAB/COGS oder ein Ledger.

Auch `projectV3FinancingReference` bleibt als Referenzobjekt getrennt: individuelle Terms stehen auf `pending`; Vertrags-/Finanzereignis-/Verbindlichkeits-/Zinsaufwand-/Cash-/Altvertrags-/Dispo-Effekte sind `false`. Der neue Handoff behauptet deshalb weder ein Finanzierungsangebot noch einen Unternehmenszinssatz oder genehmigte Kreditkonditionen.

## Annahmen, Quelle und Zeitbezug

Die geprüften Richtungspaare sind identisch im neutralen SPI-/Aktivitäts-/Kanalinput; nur der explizite MRO-Schock unterscheidet sie. Sämtliche Werte sind im A02-Bericht und Event als synthetisch, unkalibriert und testgebunden ausgewiesen:

- Referenz-MRO 1,0 % p. a.; Schock im Januar 2028: +0,5 oder −0,5 Prozentpunkte; Unsicherheitsband ±0,25 Prozentpunkte.
- Beobachtungsmonat Januar; erster Lag ein Monat, MRO wirksam im Februar. Bei synthetischem 2-Prozentpunkte-Spread ergibt der indikative Neukonditions-Handoff im Februar 3,5 % p. a. (Anhebung), 2,5 % p. a. (Senkung) bzw. neutral 3,0 % p. a. Die Testfixture nennt außerdem einen synthetischen 36-Monats-Term und ein begrenztes Gültigkeitsfenster; daraus wird kein Vertrag erzeugt.
- Der getrennte `investmentPlanIndex` ist in `index_points` angegeben: Testformel `100 − 1,0 × ΔMRO` je Prozentpunkt; ±2 Indexpunkte Kappung. Nach einem weiteren Monat Lag wird er im März 99,5 (Anhebung), 100,5 (Senkung) bzw. 100 (neutral). Trace und Aggregat führen `accountingClass: information_plan`, `assumptionStatus: synthetic_uncalibrated`, `directFinanceEffect: false` und `actualStateChanged: false`.
- MRO-/Investmentwerte, Koeffizient, Spread, Laufzeit, Unsicherheitsband und beide Lags sind keine aktuellen EZB-/Bankdaten und keine empirische Firmenkalibrierung. Der Bericht sagt ausdrücklich, dass kein EZB-Zinswert als Szenarioinput verwendet wird.

Der Investmentindex löst im geprüften Code keine Investitionsentscheidung, Produktionsänderung, Mittelaufnahme, Kapazitätsänderung oder Aufwandsbuchung aus. Er ist als nachgelagerter, nichtbindender Planindikator gekennzeichnet. Das erfüllt die Finanzgrenze, belegt aber keine tatsächliche operative/finanzielle Firmenwirkung.

## Geprüfte Implementierung und Tests

- `prototype/v3-macro-simulation.js:235–243` validiert nur die eng bestimmte synthetische Shock-ID, Richtungswerte, Quelle, Perioden-/Lagregel und Unsicherheitsband; `:264–280` leitet MRO nach Ablauf des ersten Lags ab; `:285–301` erzeugt ausschließlich eine indikative Anfragequote mit null Vertrags- und Postingreferenzen; `:318–358` persistiert Makroevent/Snapshot und setzt Finanzwirkungsflags auf `false`.
- `prototype/v3-mro-operating-impact.js:13–68` liest den validierten Makrostate und projiziert nur den zusätzlichen, einmonatig verzögerten `investmentPlanIndex`; es gibt keine Mutation oder Folgeaktion.
- `prototype/v3-financing-reference.js:13–48` hält Einzelkonditionen pending und weist alle finanziellen/vertraglichen Effekte als `false` aus.
- A02-Regression `prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` prüft Neutral-/Hike-/Cut-Paare bei gleichem SPI, Quote und Einmonatslag, zusätzlichen Investmentindikator-Lag, Replay/Restore, Eingabeimmutabilität, Events/Flags sowie Nichtbuchung.
- Bestehende A03-Finanzregression prüft den älteren SPI→MRO-Pfad rückwärtskompatibel; sie wird nicht als Beleg für die neue Exogenwirkung allein verwendet.

Ausgeführt, alle PASS:

- `node --check prototype/v3-macro-simulation.js`
- `node --check prototype/v3-mro-operating-impact.js`
- `node --check prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs`
- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs`
- `node prototype/v3/a03-t0071-ecb-finance-regressions.mjs`
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`

Kein Volljahreslauf und keine UI-/Browserprüfung. A09-unabhängige QA ist laut A02-Bericht noch ausstehend.

## Preflight

CP-0481 meldet `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266` und 481 Status-Einträge. Die aktuelle Prüfung bestätigte Branch/HEAD; beim tatsächlichen Zugriff enthielt der parallele Arbeitsbaum 596 Status-Einträge. Alle sieben Control-Plane-Dateien stimmten mit CP-0481 überein. Die drei benannten A02-Implementationartefakte stimmten ebenfalls mit den übergebenen SHA-256-Werten überein: Implementierungsbericht `AEB233592921EA379737F78B685F59F6BBB897B3F5B7F0F25E6AC257440A87DF`, Makrosimulation `371A10FAFB56AB47BB4950FB0BFC08D95D625B487B09D64EFCA730121C066350`, MRO-Impactmodul `04776299D3939F2A1175001BCA80A267E92705DDEFD1C8F743E0A4E0BEBE3F47`, Exogen-Regression `9512F00DF13995BB61D24BAA4F91FC734D85202DB5B6E1B6449FF30BE91C6075`. Geprüft wurden die tatsächlich bestehenden Pfade `prototype/v3-mro-operating-impact.js` und `prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs`.

Nur dieser neue Reviewbericht wurde angelegt. Keine bestehenden lokalen Änderungen wurden bearbeitet; kein Stage/Commit/Push.

## Bewertung und Grenzen

**A03-Finanzgrenze: PASS.** Im geprüften Pfad werden weder reale noch bereits bestehende Kredit-/Finanzverträge, Salden oder Buchungen verändert. Die neue Quote bleibt indikativ, das zweite Signal ein nichtbindender, synthetischer Planindex. Quellen-/Modellannahmen, Einheiten und Beobachtungs-/Wirksamkeitsperioden sind nachvollziehbar markiert.

Dieser PASS ist kein T-0063 G5-Abschluss: Die Werte sind synthetisch und nicht kalibriert; der neue Investmentplanindex ist nicht mit einer tatsächlichen Spielerentscheidung oder Betriebsgröße verbunden. A09-QA und eine eventuelle sichtbare/UI-/operative Integration bleiben bei A01 offen. Keine Gate-Schließung oder Produkt-/Finanzregeländerung wird empfohlen.
