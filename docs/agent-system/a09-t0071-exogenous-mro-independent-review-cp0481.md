# A09 Independent QA — T-0071 exogener MRO-Pfad (CP-0481)

**STATUS:** PARTIAL für den Implementierungsslice; kein T-0063 G5-PASS und kein Ticketabschluss  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**GOALS/TICKETS:** MG-002 / SLG-002.2 / T-0063 G5 / T-0071  
**BASIS:** CP-0481; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; 483 Statuszeilen laut Übergabe (Preflight: 483)

## Preflight und Ausführung

Alle sieben CP-0481-Control-Plane-SHA-256 stimmten. Branch und HEAD stimmten mit der Übergabe überein. Die übergebenen SHA-256 für den A03-Finanzbericht sowie das MRO-Impact-Modul und die neue Regression stimmten nicht mit dem aktuellen Arbeitsbaum überein; diese drei Quellen wurden vollständig neu gelesen. A03s aktueller Bericht behandelt noch den älteren SPI→MRO-Pfad und erklärt den neuen exogenen Finanzpfad ausdrücklich als ausstehend. Diese Deltas werden daher nicht als bereits erfolgter Review des neuen Slices gewertet.

Ausgeführt, ohne Volljahreslauf:

- `node --check prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` — PASS
- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` — PASS
- `node prototype/v3/a03-t0071-ecb-finance-regressions.mjs` — PASS (bestehender SPI→MRO-Kompatibilitätspfad)
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs` — PASS
- `node prototype/v3-macro-simulation-regressions.mjs` — PASS

## Kontrollierter Wirkungspfad

Die neue Regression setzt im Januar 2028 je Lauf ein explizites synthetisches exogenes MRO-Ereignis `hike` (+0,5 Prozentpunkte) bzw. `cut` (−0,5) gegen denselben Neutralpfad. SPI-Komponenten, Aktivität und übrige Kanalinputs sind identisch; SPI-Jahresänderung bleibt in beiden Paaren null. Das ist ein kausaler Kontrollvergleich des MRO-Ereignisses, nicht die frühere SPI→MRO-Kette.

| Pfad | Januar 2028 | Februar 2028 (Lag 1) | März 2028 (zusätzlicher Lag) |
|---|---|---|---|
| Neutral | MRO/Quote wegen fehlender Vorhistorie unavailable | Referenz-MRO 1,0 %; indikative Quote 3,0 % | `investmentPlanIndex` 100 |
| Hike | exogenes Ereignis +0,5 pp; kein sofortiger MRO-/Quoteffekt | MRO 1,5 %; indikative neue Finanzierung 3,5 % | `investmentPlanIndex` 99,5 |
| Cut | exogenes Ereignis −0,5 pp; kein sofortiger MRO-/Quoteffekt | MRO 0,5 %; indikative neue Finanzierung 2,5 % | `investmentPlanIndex` 100,5 |

Source/fixture IDs, Beobachtungs-/Effektivperiode, Lags, Richtungsereignis und Parameter sind im synthetischen Event tracebar. Hike/Cut verwenden denselben SPI-Input; fehlende Januarhistorie bleibt unavailable. Gleiche Januar-Replays sind idempotent, ein geändertes Shock-Payload im bereits verarbeiteten Monat liefert `period_payload_conflict`. JSON-Restore am Januarstand setzt Februar/März fort und reproduziert Snapshot sowie Indexprojektion. Die Finanzflags in den Makrosnapshots sind false; die Finanzierungsausgabe hat keine Vertrags-ID/-Version und setzt `createsFinancialEvent` sowie `createsLedgerEffect` auf false. Die Übergänge mutieren die jeweilige Eingabe laut Regression nicht.

## Adversarial Befund und Abgrenzung

`investmentPlanIndex` erfüllt den Wortlaut „weiterer Makro-/Betriebsindikator“ als eigenständiger, gerichteter Makro-/Planindikator zusätzlich zur Finanzierungsgröße. Er ist jedoch ausdrücklich `information_plan`, `actualStateChanged: false` und ändert weder Investitionsentscheidung noch Produktion, Kreditvertrag, FinanceState oder Ledger. Damit ist die zweite Größe ein messbarer Indikator, aber keine nachgewiesene echte betriebliche Handlung/Unternehmensvariable. Für G5 allein kann dies als Indikatornachweis zählen, wenn A01 die Kriterien wörtlich anwendet; es erfüllt nicht automatisch G7 (operative Wirkung) und trägt keinen UI-/Spielbarkeitspass.

**Konkrete Restlücken für diesen QA-Slice:**

- Die fokussierte Regression prüft Payloadkonflikt und idempotentes Wiederholen, aber keinen manipulierten/restaurierten Makrostate, koordinierten Event-/Snapshot-Tamper oder falschen/fremden Fixture-Input als expliziten Regressionstest. Der State-Validator prüft IDs und interne Event-/Snapshotkonsistenz; er replayt das ursprüngliche Monatsinput nicht gegen den opaken `inputFingerprint`. Daher ist koordinierte gespeicherte Historienmanipulation durch die vorliegenden Tests nicht ausgeschlossen.
- Es gibt keinen gezielten Test, der duplicate shock/effect groups oder mehrfaches Weitertragen/Kumulieren des Investmentindikators einspeist und die erwartete Abwehr bzw. Einmalwirkung behauptet. Die Produktionsprojektion ist periodengebunden und setzt den Baselineindex ohne fälliges Event auf 100; diese Eigenschaft ist aber im Kontrolltest nur für einen einzelnen Schock und Zielmonat belegt.
- A03s aktuellen Reviewbericht und Regression decken den neuen exogenen Pfad nicht ab; der Finanzfachreview des Februar-Handoffs und der Finanzgrenze bleibt offen. `financeEffects=false` und fehlender FinanceState-Zugriff begrenzen den Nonposting-Nachweis auf den isolierten Makroadapter.
- Die vier fokussierten Regressionen belegen keinen Browser/UI-Pfad, keine anwenderseitige Auswahl/Anzeige und keine reale Finanzierung oder Firmenentscheidung.

Die numerischen Annahmen (1,0 % Referenz-MRO, ±0,5 pp, 1+1 Monate Lag, 2 pp Spread, Koeffizient 1 und Kappung ±2 Indexpunkte) sind synthetisch und unkalibriert. A08s Quellenreview stützt nur eine qualitative Richtung und weist ausdrücklich keine Koeffizienten oder universellen Lags aus.

**SCHLUSSFOLGERUNG:** Der kontrollierte exogene Hike/Cut mit indikativem Finanzierungsreadout und separatem Planindex ist für den engen Simulationsslice nachvollziehbar und die fokussierten Tests bestehen. Wegen fehlendem A03-Review des neuen Hand-offs und fehlender gespeicherter-State-/Dedupe-/Wiederholungs-Negativtests lautet das unabhängige Ergebnis **PARTIAL**. T-0063 G5 bleibt offen bis A01 die Gesamtbelege einschließlich Fachreview zusammenführt; T-0071 wird nicht abgeschlossen.

**ÄNDERUNGEN:** Nur dieser QA-Bericht; keine Produktdatei, kein Ticketstatus, kein Stage/Commit/Push.
