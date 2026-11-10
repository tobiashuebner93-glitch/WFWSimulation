# A02 – T-0083 Politik-Lags je Kanal

**Status:** Implementierung / fokussierte Regression abgeschlossen; unabhängiger A09-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0063 G8 / T-0083
**Basis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; Preflightstatus 532
**A01-Preflight:** Governance-Hashes zuletzt unverändert: AGENTS `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556`; Struktur `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3EE`; Rechte `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE`; Ziele `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D`; Board `4382E9015CD2543AB3244216C4381F39D5CB07353E54015202DE8946877A362C`; Collaboration `118824A18224BD68E00384B5703391AD81614B25F5F4E7C2FDF00562452B5AF5`; Decision Log `1EA4649C21FCC505BD4A9931CB7B9C16628656A0A9F2BB88DF07E3460ADAACEB`.

## Umsetzung

Additiv wurde `prototype/v3-t0083-policy-lag-regressions.mjs` ergänzt. Es ändert keine Simulationsregeln. Die Regression prüft die sieben bereits vorhandenen Planprojektionskanäle einzeln mit matched neutralem Lauf und einem kontrollierten, einmonatigen Testlag aus dem bereits verwendeten Lagtest:

`fiscal`, `growth`, `tariff`, `labor_market`, `environmental`, `demand_oriented`, `supply_oriented`.

Für jeden aktiven Januar-2027-Beitrag werden Beobachtungsmonat, Wirksamkeitsmonat und Lag im Snapshot geprüft. Vor Februar gibt es keine Projektion; im Februar entsteht genau ein Beitrag je Kanal. Das März-Replay und dieselbe erneut geöffnete Tagespayload erzeugen keine zusätzlichen Effekt-IDs. Der neutrale Kontrolllauf erzeugt keine Beiträge. Der Testlag ist eine Regressionseinstellung und kein neuer Standard oder kalibrierter Produktparameter.

Der Geldpolitikkanal wird über die getrennte, bereits festgelegte T-0071-MRO-Fixture geprüft: ein synthetischer Hike mit dem vorhandenen Einmonats-Lag bleibt im Januar unwirksam und wird im Februar genau einmal aktiviert. Der MRO-Indikator unterscheidet sich dann vom neutralen Kontrollfall um den bereits fixturedefinierten Schritt. Save/Restore und erneutes Verarbeiten des gleichen Januarinputs halten die Ereigniszahl bei eins. `financeEffects` bleiben in allen Monaten `false`.

Die sieben Planbeiträge sind als Informations-/Planindikatoren gekennzeichnet. Runstate und FinanceState bleiben nach Projektions-, Replay- und Restoreprüfungen unverändert. Es wurde keine policy-channel-Rechenlogik ergänzt, keine Produktwirkung/Finanzbuchung behauptet und kein Lagwert als Standard festgelegt.

## Abnahmekriterien

| Kriterium | Ergebnis | Nachweis |
|---|---|---|
| Alle sieben nichtmonetären Kanäle mit Neutral- und Wirkungslauf | PASS | Jeweils genau ein Effekt auf Periode 2027-02; neutraler Kontrolllauf ohne Effekte |
| Beobachtungs-/Wirksamkeitsmonat und Lag ausgewiesen | PASS | Je Wirkung `observedPeriod=2027-01`, `effectivePeriod=2027-02`, `lagPeriods=1` |
| Kein Beitrag vor der Wirksamkeitsperiode | PASS | Januarprojektion hat 0 Effekte |
| Genau ein Beitrag am ersten Wirksamkeitsmonat | PASS | Februarprojektion hat je Kanal genau einen Effekt und eine Aktivierung |
| Restore-/Replay-Dedupe | PASS | JSON-Envelope, Folgemonat und gleiche Tagespayload erzeugen keine zusätzliche Effekt-ID |
| Geldpolitik über bestehende T-0071-Fixture | PASS | Januar ohne Aktivierung; genau ein MRO-Schock/Einmonats-Lag im Februar; neutraler Vergleich und Restore/Re-Run |
| Finanz-/Ledger-Nichtmutation | PASS | Makro-Snapshotflags `false`; FinanceState und Run-Projektion unverändert |

## Tests und Prüfumfang

- `node --check prototype/v3-t0083-policy-lag-regressions.mjs` – PASS
- `node prototype/v3-t0083-policy-lag-regressions.mjs` – PASS
- `node prototype/v3-macro-policy-impact-regressions.mjs` – PASS
- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` – PASS
- `git diff --check -- prototype/v3-t0083-policy-lag-regressions.mjs` – PASS
- A09-unabhängiger Review: **nicht ausgeführt**; an A01 zur Zuweisung
- Browser-/Gerätetest: **nicht ausgeführt**; T-0083 ist ein Makro-/Runtime-Testgate

## Änderungen und Übergabe

Geändert wurde nur die Regression `prototype/v3-t0083-policy-lag-regressions.mjs` (SHA-256 `CE1CF8FCC6EDC716BA75840EDBF7DE4B335C425623DE6210FECCE5EC30DB7429`). Die bereits untracked vorhandenen `v3-macro-policy-impact.js` und zugehörigen Regressionen blieben unverändert. T-0083 ist aus A02-Sicht für diesen Implementierungsscope **PASS**; A09 soll unabhängig prüfen, dass die acht Kanäle nicht als neue Produktdefaults interpretiert werden und die zeit-/Replay-Assertions den Gatewortlaut abdecken. T-0063 G8/T-0073 bleiben bis zum A09-Review offen.

Kein Commit und kein Push.
