# A03 – T-0076 unabhängiger Review des Mengen-Monatsabschlusses

**Ergebnis:** PASS für das abgegrenzte Mengenabschluss-Gate  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Ticket:** T-0076 / T-0069 Mengenabschluss  
**Prüfumfang:** Read-only Review von A02s Jahresfixture, Snapshotbeleg und Monatsabschlussgleichungen. Keine Code-, Bestands-, Bewertungs- oder Produktregel geändert.

## Geprüfte A02-Artefakte

Die Bytes stimmen mit den von A01 vorgegebenen SHA-256-Werten überein:

- `docs/simulation/a02-t0076-month-end-quantity-reconciliation-report.md` — `808DFDC2A009008C8BE6840A7F889D8B1C921F257A79DEEF71576270C60FD416`
- `prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` — `863577BC34572A68D4B3EB1726A5669D9D57C66AB1013C46675D48C982D41F08`
- `prototype/v3-t0076-month-end-snapshots.json` — `F3C7A1D66492840EE50267EC4637013B648E1CF9FE10A6F8D5D8E1DCE68C3E74`

## Monatsend-Abgleich Stahl

Die zwölf Monatsenddaten und Material-Roll-forwards im Snapshot sind:

| Periode / Monatsende | Öffnung + Zugang − abgeschlossener Verbrauch = Schluss | Reserviert / verfügbar |
|---|---:|---:|
| 2027-01 / 31.01.2027 | 100 + 5 − 2 = 103 | 0 / 103 |
| 2027-02 / 28.02.2027 | 103 + 0 − 2 = 101 | 0 / 101 |
| 2027-03 / 31.03.2027 | 101 + 0 − 2 = 99 | 0 / 99 |
| 2027-04 / 30.04.2027 | 99 + 0 − 2 = 97 | 0 / 97 |
| 2027-05 / 31.05.2027 | 97 + 0 − 2 = 95 | 0 / 95 |
| 2027-06 / 30.06.2027 | 95 + 0 − 2 = 93 | 0 / 93 |
| 2027-07 / 31.07.2027 | 93 + 0 − 2 = 91 | 0 / 91 |
| 2027-08 / 31.08.2027 | 91 + 0 − 2 = 89 | 0 / 89 |
| 2027-09 / 30.09.2027 | 89 + 0 − 2 = 87 | 0 / 87 |
| 2027-10 / 31.10.2027 | 87 + 0 − 2 = 85 | 0 / 85 |
| 2027-11 / 30.11.2027 | 85 + 0 − 2 = 83 | 0 / 83 |
| 2027-12 / 31.12.2027 | 83 + 0 − 2 = 81 | 1 / 80 |

Alle Monatsabschlüsse wurden nach Tagesabschluss aufgenommen. Für jede Stahlzeile stimmen außerdem `available = close − plannedReservation` und die Werte im Snapshotartefakt überein.

## Weitere Mengen- und Reproduzierbarkeitsprüfungen

- **Fertigwarenlose – PASS:** Die Bewegungen stimmen je Los für physische, reservierte und quarantänisierte Mengen vor/nach der Bewegung überein. Verfügbarkeit entspricht physisch minus reserviert minus quarantänisiert; negative bzw. über die physische Menge hinausgehende Statusmengen werden durch die Fixture-Assertions ausgeschlossen.
- **Kapazität – PASS:** Belegte Lagerkapazität rollt über die Fertigwarenbewegungen fort; freie Kapazität und geplante Ausgabekapazität werden getrennt ausgewiesen und bleiben innerhalb der Grenzen.
- **Transit und Reservierung – PASS:** Im Dezember liegen 4 Einheiten im Materialtransit mit ETA 05.01.2028; sie werden separat ausgewiesen und nicht in den physischen Schlussbestand gerechnet. 1 Stahleinheit bleibt am Jahresende für einen offenen Produktionsplan reserviert und wird nicht als Verbrauch behandelt.
- **Same-seed Replay/Restore – PASS:** Der Smoke-Runner wurde zweimal mit demselben Fixture und Seed in einer temporären Kopie ausgeführt. Beide Läufe bestanden und schrieben identische Snapshotdateien mit SHA-256 `F3C7A1D66492840EE50267EC4637013B648E1CF9FE10A6F8D5D8E1DCE68C3E74`. Für alle zwölf Monate stimmen `stateHash` und `restoreHash` überein.
- **Finanzgrenze – PASS:** Kein Material- oder Fertigwaren-Geldwert, COGS, BAB, Cash oder Ledger wird aus den Mengen abgeleitet. Finanzhandoffs bleiben `pending_non_posting`; Bewertungs- und Buchungsintegration ist außerhalb dieses Gates. Der synthetische Fixture enthält Angebots-/Produktpreise und direkte Testkosten für Markt-/Produktpfade, verwendet sie aber nicht zur Inventurbewertung oder COGS-Berechnung.

## Ausführungshinweis und Schluss

Der direkte Smoke-Aufruf im Repository erreichte den Runner, wurde jedoch beim `writeFileSync` des Snapshotartefakts durch die Read-only-Sandbox mit `EPERM` gestoppt. Um das versionierte A02-Artefakt nicht anzutasten, erfolgten beide vollständigen Läufe in einer temporären Kopie; dort bestanden beide mit identischem Artefakthash. Es wurde keine Projektdatei geändert.

**Schluss:** T-0076 besteht den unabhängigen A03-Review für Monats-Mengenabgleich, Lot-/Kapazitätsgrenzen, Transit-/Reservierungstrennung und deterministischen Save/Restore-Beleg. Das ist keine Freigabe für monetäre Bewertung, BAB/COGS oder das vollständige T-0069-Jahres-/Finanzgate.
