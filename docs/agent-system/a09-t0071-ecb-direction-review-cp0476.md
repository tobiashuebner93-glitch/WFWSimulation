# A09 G5-Re-Review – T-0071 EZB/MRO (CP-0476)

**STATUS:** PARTIAL – Finanzierungsreferenz belegt; geforderte nachgelagerte Makro-/Betriebswirkung aus EZB-Schritt nicht belegt  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**GOALS/TICKETS:** MG-002 / SLG-002.2, SLG-002.5 / T-0071 (T-0063 G5)  
**BASIS:** CP-0476; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**DIGEST:** Sieben CP-0476-Control-Plane-SHA-256 erneut verifiziert; alle stimmten.

## Befund gegen G5

Das T-0063-G5-Kriterium fordert dokumentierte Zinserhöhungs- und Zinssenkungsereignisse, die über den festgelegten Kanal sowohl eine Finanzierungsgröße als auch mindestens einen weiteren Makro-/Betriebsindikator nachweisbar ändern.

Der geprüfte Test belegt die Richtungsfolge **synthetischer SPI-Schock → verzögerter MRO → indikative Finanzierungsquote**, nicht die geforderte Wirkung **exogener EZB/MRO-Zinsschritt → Finanzierungsgröße plus separater nachgelagerter Indikator**. Die `hike`-/`cut`-Fälle erzeugen eine synthetische SPI-Änderung im Januar 2028; der MRO wird aus dieser SPI-Jahresänderung nach der Testregel abgeleitet und die Quote folgt dem MRO. Der SPI-Indikator ist hier Ursache/Eingabe des MRO-Pfads, keine Wirkung eines EZB-Schritts. Daher lautet das Ergebnis für G5 **PARTIAL**, nicht PASS.

## Geprüfte Kontrollen und Grenzen

- **Neutral:** unveränderter SPI-Pfad ergibt im Februar 2028 MRO 1,0 % p.a. und indikative Quote 3,0 % p.a.
- **Richtung/Lag:** synthetischer Aufwärtspfad ergibt nach einem Monat 1,5 % MRO / 3,5 % Quote; Abwärtspfad 0,5 % / 2,5 %. Im Januar bleiben MRO und Quote wegen fehlender Lag-Historie `unavailable`/`null`; Februar referenziert Januar.
- **Quote nonbinding:** `contractId` und `contractVersion` sind `null`; `createsFinancialEvent` und `createsLedgerEffect` sind `false`.
- **Finance-Flags:** alle `financeEffects`-Flags bleiben `false`, einschließlich `existingContracts`. Das ist eine Aussage des isolierten Makromonatsadapters; der Test mutiert oder vergleicht keinen befüllten autoritativen Finance-/Kreditbestand.
- **Restore:** JSON-Save/Restore des Januarzustands mit Fortsetzung in Februar erzeugt denselben Snapshot wie der ununterbrochene Pfad.
- **Annahmen:** Koeffizient 0,5, Lag 1 Monat, Unsicherheitsband ±0,25 Prozentpunkte, Spread 2 Prozentpunkte und Laufzeitwunsch 36 Monate sind synthetische, unkalibrierte Fixturewerte. A08s Quellenreview bestätigt qualitative Transmissionsrichtung, aber nicht diese Parameter, individuelle Firmenkonditionen oder einen universellen Lag.

## Ausgeführte Prüfungen

Alle drei vorhandenen Regressionen meldeten PASS:

- `node prototype/v3/a03-t0071-ecb-finance-regressions.mjs`
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`

A03-Fachreview ist als begrenzter Finanz-/Adapterreview vorhanden. Laut A03-Bericht ist die A02-Simulationsreview nicht ausgeführt; diese A09-Prüfung ist unabhängig, aber sie ersetzt A02s Review des Modells nicht. Browser-/Geräte- und Jahreslauf wurden nicht geprüft.

## Erforderlicher Folgebeleg

Für G5 benötigt A02 ein exogenes EZB/MRO-Anhebungs- und -Senkungsereignis mit getrenntem Wirkungspfad auf die Finanzierungsgröße **und** einen nachgelagerten Makro-/Betriebsindikator, jeweils mit neutralem Kontrollfall, Quelle bzw. Synthetic-Kennzeichnung, Exposition, Lag, Grenzen, Dedupe sowie deterministischem Replay/Restore. Danach sind A02-Simulationsreview, A03-Finanzgrenzenreview und erneute unabhängige A09-Prüfung erforderlich.

**UNABHÄNGIGE QA:** PARTIAL für T-0063 G5.  
**TICKETSTATUS:** kein T-0071-/T-0063-Abschluss.  
**GIT:** read-only geprüft; keine Produktdatei geändert, kein Stage/Commit/Push. Der Checkout enthält umfangreiche vorbestehende lokale Änderungen.
