# A02 T-0076 – Monatsabschluss Mengenabgleich

**Status:** PARTIAL (Fixture und lokale Prüfungen PASS; formale Gatefreigabe OFFEN)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent / Ziel:** A02 – SIMULATION; MG-000 / SLG-002.1
**Ticket:** T-0076
**Geprüfte Revision:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266` (`main`)
**Arbeitsbaum:** stark vorverändert und geteilt; dieser Auftrag fügte nur die unten aufgeführten zwei T-0076-Dateien hinzu. Keine fremden Änderungen bereinigt oder überschrieben. Kein Commit/Push. Keine Governance-, Ticket- oder CP-Datei geändert.

## Ergebnis

Der eigenständige deterministische Jahresfixture `T0076-G6-ANNUAL-QUANTITY-1` deckt 04.01.–31.12.2027 ab. Alle zwölf Kalendermonatsabschlüsse werden nach Tagesabschluss erzeugt. Je Snapshot werden Materialbewegungen und Fertigwarenlose gegen physische Menge, Reservierung, Quarantäne, Verfügbarkeit, Transit und Kapazität reconciled. Save/Restore je Monatsende liefert übereinstimmende Zustands- und Ereignishashes. Der generierte Snapshotbeleg hat SHA-256 `F3C7A1D66492840EE50267EC4637013B648E1CF9FE10A6F8D5D8E1DCE68C3E74`; der Endzustandhash lautet `a33ce7eddc325ab76ce0dc58a4a348a2eba1dcf2811153dc2395201800cf3fb0`.

Der Fixture enthält belegten Materialzugang mit Quellereignis, Mengenverbrauch, eine abgelehnte Kundenlieferung mit Rücknahme in Quarantäne, geplante Reservierung, eine eigene Produktfertigung und Käuferentscheidungen, Versand sowie einen Jahresendversand im Transit, der nicht als Bestand gezählt wird. Eine konkurrierende Ressourcenzuweisung wird geprüft. Finanzbuchungen bleiben ausdrücklich nicht buchend/pending; Bewertung, COGS und BAB werden nicht berechnet.

### Gate-Matrix (A02-Scope)

| Prüfung | Ergebnis | Nachweis / Grenze |
|---|---|---|
| Zwölf Monatsenden und Materialgleichung | PASS | `close = opening + receipts − completed consumption`; Reservierung und verfügbare Menge separat geprüft |
| Fertigwarenlose, physisch/reserviert/quarantänisiert/verfügbar | PASS | Periodenbewegungen und Lose je Monatsende validiert |
| Transit und Lagerkapazität | PASS | Transit bleibt außerhalb physischer Menge; belegte/freie Kapazität und geplante Ausgabe getrennt |
| Kundenauftragsfluss und Rücknahme | PASS | Annahme/Verfall, Rücknahme in Quarantäne; Beleg-/Quellreferenzen validiert |
| Eigenprodukt bis Käuferentscheidung/Versand | PASS | Fertigbestand, angenommene/abgelehnte Käuferentscheidungen und Dispatches im selben Run-State |
| Ressourcen-Konflikt | PASS | konkurrierende Ressourcenzuweisung wird zurückgewiesen |
| Restore, Replay, Idempotenz und Tampering | PASS | Monatsrestore hashes; negative Mutationstests ohne akzeptierte Teilmutation |
| Jahresbetrieb G5 / formale Mengenabschlussfreigabe | OFFEN | Dies ist ein fokussierter synthetischer Mengenfixture, kein vollständiger jährlicher Wirtschafts-/Auftrags-Smoketest. A03- und A09-Reviews erforderlich. |
| Bewertung, Geldwert, COGS, BAB | DEFERRED | Absichtlich nicht Bestandteil dieses Ticketslices. |

## Monatsendwerte

| Monat | Stahl Öffnung + Zugang − Verbrauch = Schluss | Reserviert / verfügbar | Transit | Fertigwaren Schluss / freie physische Kapazität |
|---|---:|---:|---:|---:|
| 2027-01 | 100 + 5 − 2 = 103 | 0 / 103 | 0 | 1 / 29 |
| 2027-02 | 103 + 0 − 2 = 101 | 0 / 101 | 0 | 2 / 28 |
| 2027-03 | 101 + 0 − 2 = 99 | 0 / 99 | 0 | 2 / 28 |
| 2027-04 | 99 + 0 − 2 = 97 | 0 / 97 | 0 | 2 / 28 |
| 2027-05 | 97 + 0 − 2 = 95 | 0 / 95 | 0 | 3 / 27 |
| 2027-06 | 95 + 0 − 2 = 93 | 0 / 93 | 0 | 3 / 27 |
| 2027-07 | 93 + 0 − 2 = 91 | 0 / 91 | 0 | 3 / 27 |
| 2027-08 | 91 + 0 − 2 = 89 | 0 / 89 | 0 | 4 / 26 |
| 2027-09 | 89 + 0 − 2 = 87 | 0 / 87 | 0 | 4 / 26 |
| 2027-10 | 87 + 0 − 2 = 85 | 0 / 85 | 0 | 4 / 26 |
| 2027-11 | 85 + 0 − 2 = 83 | 0 / 83 | 0 | 5 / 25 |
| 2027-12 | 83 + 0 − 2 = 81 | 1 / 80 | 4 | 5 / 25 |

The December transit quantity is a shipment with a 2028-01-05 ETA and is excluded from physical stock. December’s planned material reservation is one unit; it remains unconsumed at close. Planned finished-goods output capacity is separately represented in the snapshot artifact.

## Änderungen

- `prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` – additive standalone deterministic annual fixture and focused positive/negative assertions.
- `prototype/v3-t0076-month-end-snapshots.json` – generated 12-month snapshot evidence; SHA-256 above.
- This report.

## Tests / Reproduction

- `node --check prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` — PASS.
- `node prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` — PASS; artifact reports 12 snapshots; repeated artifact SHA-256 unchanged (`F3C7A1…C3E74`). No T-0076 runner remains active.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` — PASS (existing 3-month regression).
- `git diff --check` / scoped whitespace scan — PASS.

## Übergabe

A01 soll die Fixture zur unabhängigen A03-Prüfung der Mengen-/Quellbelege und A09-Prüfung der Reproduzierbarkeit/Grenzen geben. Erst nach beiden Reviews kann A01 den formalen Gate-Status festlegen. T-0076, CPs und Ticketboard wurden von A02 nicht verändert.

