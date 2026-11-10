# A03 – T-0071 EZB/MRO-Finanzreview

**Status:** PARTIAL PASS – fokussierte Finanz-/Makroregression bestanden; A02-Simulationsreview noch offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 / T-0071  
**Basis:** CP-0476; `main` / `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**Entscheidungsbezug:** D-0022, D-0102, D-0163; A02-Simulationsvertrag §6 und Integrationsvertrag §6.  

## Ergebnis

Die gezielte Regression bestand über den bereits vorhandenen A02-Makromonatsadapter `runV3MacroMonth()` und dessen indikative `financingHandoff`-Quote. Die drei Testpfade zeigen einen neutralen Fall sowie eine synthetische SPI-Inflationsanhebung und -senkung. Die SPI-Jahresänderung ist der separate Makroindikator; die MRO-Regel verwendet ihn mit einem Monatslag und die vorhandene Quote zeigt MRO plus ausdrücklich synthetischen Referenzspread. Dies belegt die Richtung des modellierten Testpfads, nicht eine empirische oder allgemein gültige EZB-Transmission.

Die Testannahmen sind auf diese Regression begrenzt: Referenz-MRO 1,0 % p. a., synthetischer SPI-Jahresänderungskoeffizient 0,5, Referenzinflation 0 %, Lag 1 Monat, Unsicherheitsband ±0,25 Prozentpunkte, indikative Spreadannahme 2 Prozentpunkte und Laufzeitwunsch 36 Monate. Kennungen und Quellenreferenzen enthalten `T-0071`/`synthetic-fixture`; alle Werte sind unkalibriert und keine Produktdefaults, Bankangebote oder EZB-Beobachtungen. Der Spread wird nur als Testeingabe in die vorhandene Anzeigeformel übernommen. D-0022 bleibt ein Referenzbenchmark; kein persönlicher Satz wird daraus abgeleitet.

| Pfad | SPI-Indikator im Januar 2028 | MRO/Quote im Januar | MRO/indikative Quote im Februar nach Lag | Ergebnis |
|---|---:|---|---:|---|
| Neutral | 0 % y/y | MRO noch unavailable, da der Lag noch keine Vorjahreshistorie hat; keine Quote | 1,0 % / 3,0 % p. a. | neutral |
| Anhebung | ca. +1 % y/y | MRO bleibt wegen Lag noch unavailable; keine Quote | 1,5 % / 3,5 % p. a. | Quote höher als neutral |
| Senkung | ca. −1 % y/y | MRO bleibt wegen Lag noch unavailable; keine Quote | 0,5 % / 2,5 % p. a. | Quote niedriger als neutral |

Der Test stellt fest, dass die Januar-SPI-Änderung erst im Februar den simulierten MRO und die unverbindliche Quote beeinflusst. Fehlende Lag-Historie bleibt `unavailable`; sie wird nicht durch einen Nullwert oder eine sofortige Quote ersetzt. JSON-Save/Restore am Januar-Snapshot und Fortsetzen im Februar erzeugt denselben vollständigen Snapshot wie der ununterbrochene Lauf.

## Finanzgrenze

In allen Monats-Snapshots sind die `financeEffects`-Flags für Ledger, Cash, Forderungen, Verbindlichkeiten, Bestand, Payroll und bestehende Verträge `false`. Die Quote setzt `contractId`/`contractVersion` auf `null` und `createsFinancialEvent`/`createsLedgerEffect` auf `false`. Ein MRO-/Quote-Wert erzeugt daher in diesem Adapter weder neue Schuld noch Änderung an Bestandsschuld, Vertrag, Cash oder Ledger. `runV3MacroMonth()` erhält nur Makrozustand und Monatseingaben und erstellt einen geklonten Makrofolgezustand; es bindet keinen autoritativen Unternehmens-/Finanzzustand ein. Diese Aussage ist auf den isolierten Adaptervertrag begrenzt, nicht auf eine noch nicht implementierte integrierte Jahresfinanzierung.

Keine Simulationsregel wurde geändert; der Test liest den bestehenden A02-Adapter. Damit war für diesen Testpfad kein neuer Ereignisvertrag erforderlich. Falls A01 statt des separaten SPI-Makroindikators eine vom MRO ausgehende Wirkung auf einen weiteren nachgelagerten Betriebsindikator verlangt, ist das eine neue Wirkungsregel: A02 muss Richtung, Exposition, Lag, Grenzen, Deduplizierung und Replay vorschlagen; A03 prüft anschließend die Nichtbuchung. A03 implementiert diese Simulationsregel nicht.

## Ausführung und Belege

- `node prototype/v3/a03-t0071-ecb-finance-regressions.mjs` – PASS: neutral, Auf-/Ab-Richtung, SPI/MRO/Quote, einmonatiger Lag, unavailable-Vorperiode, Nichtbuchungsflags und JSON Save/Restore.
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs` – PASS: bestehende MRO-Referenzprojektion und nichtbuchende Benchmarksicht.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS: bestehende Makro-Simulation, synthetische MRO-Regel, Replay/State-Invarianten.
- `node --check prototype/v3/a03-t0071-ecb-finance-regressions.mjs` – PASS.
- Geänderter Pfad in diesem Paket: `prototype/v3/a03-t0071-ecb-finance-regressions.mjs` (neu); `docs/accounting/a03-t0071-ecb-finance-review.md` (dieser Bericht, neu). Keine A02-Adapter- oder Produktregel geändert.
- Kein Volljahreslauf.

## Grenzen und Übergabe

Die Ausführung erfolgte durch A03 auf dem A02-eigenen Simulationsadapter. Auf meine Bitte meldete A02, dass in diesem Turn keine T-0071-Review zugesagt werden kann, da die Rolle inzwischen T-0079 zugewiesen wurde. Die formale A02-Simulationsreview ist deshalb offen; A09-unabhängige Prüfung ist ebenfalls nicht Teil dieses Arbeitspakets. A01 soll A02 ein kurzes getrenntes Review des Testpfads/Adaptervertrags zuweisen und danach A09 mit der unabhängigen Prüfung beauftragen. Bis diese Reviews erfolgt sind, lautet der Ticketstatus PARTIAL PASS, nicht Abschlussfreigabe.

- **Ausführung:** A03; oben genannte fokussierte Regressionen.
- **A03-Fachreview:** PASS im ausdrücklich synthetischen, nichtbuchenden Testumfang.
- **A02-Simulationsreview:** nicht ausgeführt; Folgeauftrag an A01 erforderlich.
- **Unabhängige QA/A09:** nicht ausgeführt.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** Zugriff bestätigt; Branch `main`, HEAD unverändert bei `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorhandene lokale Änderungen wurden nicht zurückgesetzt oder bereinigt. T-0071-Pfade sind `??` (neu/untracked); HEAD unverändert. Keine anderen bestehenden Änderungen bereinigt.
- **Commit/Stage/Push:** nicht ausgeführt.


