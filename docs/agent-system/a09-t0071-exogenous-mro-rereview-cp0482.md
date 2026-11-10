# A09 Re-Review — T-0071 exogener MRO-Pfad nach Härtung (CP-0482)

**STATUS:** PASS für den gehärteten exogenen MRO-Simulations-/Finanzierungsindikator-Slice allein; kein Ticketstatus-/Parent-Gate-Abschluss  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**GOALS/TICKETS:** MG-002 / SLG-002.2 / T-0063 G5 / T-0071  
**BASIS:** CP-0482; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; aktuelle Statuszahl 488

## Preflight

Alle sieben CP-0482-Control-Plane-Digests stimmten. Die vier benannten A02-Dateien (Makromodell, MRO-Impactmodul, Regression, Implementierungsbericht) und A03s neuen Finanzgrenzenreview stimmten mit den übergebenen SHA-256-Werten überein. Branch/HEAD stimmen; parallele Änderungen blieben unangetastet.

## Unabhängige Ausführung und Befund

Syntaxchecks für `v3-macro-simulation.js`, `v3-mro-operating-impact.js` und die T-0071-Regression bestanden. Ebenfalls PASS:

- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs`
- `node prototype/v3/a03-t0071-ecb-finance-regressions.mjs` (älterer SPI→MRO-Kompatibilitätspfad)
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`
- zusätzlicher Inline-Probeaufruf für eine gemeinsame MRO-/Policy-`effectGroupId`: erwartete fail-closed Antwort `duplicate_mro_effect_group`

Die aktuelle T-0071-Regression verankert die neue Testprofilfamilie in kanonischen Monatsinputs. Der Validator prüft `canonicalInput` gegen `inputFingerprint`/`processedPeriods`, replayt Monatsübergänge und vergleicht die vollständigen Snapshots. Koordinierte Änderungen an Event plus Event-/Snapshotkopien werden gegen das unveränderte kanonische Input replay-abgelehnt; ein fortgesetzter manipulierter Restore wird ebenfalls verworfen. Die Regression ändert zusätzlich einen kanonischen Input ohne passende Fingerprintänderung und erwartet den source-fingerprint-Fehler.

Fremde Fixture-ID wird zurückgewiesen. Shock-ID und Effect-Group-Duplikate über Perioden werden separat getestet; Produktivcode blockiert zusätzlich mehrere T-0071-Schocks je Run und Gruppenkollisionen mit Policy-/External-Kanälen. Die Policykanal-Kollision wurde von A09 separat provoziert und mit `duplicate_mro_effect_group` abgewiesen. Identischer Monats-Replay ist idempotent, Payloadkonflikte werden abgewiesen, und JSON-Restore reproduziert Hike-/Cut-Märzsnapshot und Projektion. Wiederholtes Öffnen/Reprojizieren des Zielmonats verändert weder State noch Index; im April fällt der Einmalimpuls auf Baseline 100 zurück. Damit wurde kein kumulativer Effekt gefunden.

Kontrollpaare verwenden bei Neutral, Hike und Cut identische SPI-, Aktivitäts- und übrige Inputs. Januar-Hike/Cut ±0,5 pp wirken erst im Februar auf MRO/indikative neue Kondition (1,5 %/3,5 % bzw. 0,5 %/2,5 % bei synthetischem Spread); der getrennte `investmentPlanIndex` reagiert nach weiterem Lag im März mit 99,5/100,5, neutral bleibt 100. Januar ohne Vorhistorie bleibt `unavailable`. Werte, Koeffizient, Spread und beide Lags sind synthetisch und unkalibriert.

A03s aktuelle Prüfung `a03-t0071-exogenous-mro-finance-review-cp0481.md` deckt den neuen exogenen Pfad ab und bestätigt den engen Finanzgrenzenscope: nur explizite neue hypothetische Anfrage, Quote `indicative`, keine Vertrags-/Altvertrags-, Cash-, FinanceState- oder Ledgermutation; sämtliche Makro-`financeEffects` false. Dieser Fachreview ist für den Slice jetzt berücksichtigt.

## Einordnung und verbleibende Grenzen

Der zusätzliche `investmentPlanIndex` ist ein eigener, gerichteter Betriebs-/Planindikator und erfüllt damit die wörtliche zweite Indikatorgröße in T-0063 G5 für diesen synthetischen Nachweis. Er ist ausdrücklich `information_plan` und `actualStateChanged: false`: keine Investitionsentscheidung, Produktion, reale Kapazität, Kreditaufnahme oder andere echte Firmenhandlung ändert sich. Deshalb ist dies kein T-0072/G7-Operativwirkungsnachweis. Eine UI-/Browserintegration wurde nicht geprüft und ist kein Bestandteil dieses Slice-Reviews.

**SCHLUSSFOLGERUNG:** Die zuvor offenen Fingerprint-/koordinierten Event-Snapshot-Tamper-, Fremd-Fixture-, Dedupe-, Wiederholungs- und Save/Restore-Prüfungen sind im aktuellen Teststand abgedeckt; die Policykanal-Gruppenkollision wurde ergänzend unabhängig ausgeführt. Daher **PASS für den gehärteten isolierten T-0071-Simulations-/Finanzindikator-Slice**. Keine Aussage über T-0073/G10, T-0072/G7, UI oder T-0063 als Ganzes; Ticket-/Gate-Status bleibt unverändert.

**ÄNDERUNGEN:** Nur dieser Reviewbericht; keine Produktdatei, kein Ticketstatus, kein Stage/Commit/Push. Kein Jahres-Smoke.
