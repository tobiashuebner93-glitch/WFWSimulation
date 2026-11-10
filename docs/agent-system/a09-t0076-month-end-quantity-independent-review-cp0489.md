# A09 – T-0076 Monatsendmengen unabhängiger QA-Review (CP-0489)

**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Ergebnis:** **PASS für den T-0076 12-Monats-Mengen-/Kapazitätsslice.** Kein PASS für T-0069 G6 insgesamt oder T-0069 G7/Finanzreconciliation.

## Preflight und Artefakte

Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, Status 538. Alle sieben Governance-Digests des A01-Preflights stimmen. Die drei gelieferten Hashes stimmen:

- A02-Bericht `docs/simulation/a02-t0076-month-end-quantity-reconciliation-report.md`: `808DFDC2A009008C8BE6840A7F889D8B1C921F257A79DEEF71576270C60FD416`
- Runner `prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs`: `863577BC34572A68D4B3EB1726A5669D9D57C66AB1013C46675D48C982D41F08`
- 12-Snapshot-JSON `prototype/v3-t0076-month-end-snapshots.json`: `F3C7A1D66492840EE50267EC4637013B648E1CF9FE10A6F8D5D8E1DCE68C3E74`

## Unabhängige Prüfung

Ich las die Assertions und prüfte alle zwölf Snapshotobjekte direkt. Die Periodenfolge umfasst `2027-01` bis `2027-12`, jeweils am letzten Kalendertag. Für jedes Material und jeden Monat gilt `opening + receipts − completedConsumption = close` sowie `available = close − plannedReservation`. Stahl läuft über 100 + 5 − 2 = 103 im Januar bis 83 + 0 − 2 = 81 im Dezember. Vier Transitstücke erscheinen nur im Dezember und bleiben außerhalb der physischen Schlussmenge. Die geplante Dezemberreservierung von 1 bleibt separat; damit ist Stahlbestand 81, verfügbar 80.

Fertigwarenlose prüfen die Vorher-/Nachherwerte physisch, reserviert und quarantänisiert, abgeleitete Verfügbarkeit sowie nichtnegative Mengen und Mengenbindung. Monatsweise Bewegungsfolgen reconciliieren belegte/freie Lagerkapazität zu 30 Einheiten; geplante Ausgabe wird separat von belegter physischer Kapazität ausgewiesen. Der abgelehnte Kundenversand taucht als Rücknahme in Quarantäne auf. A02s Fixture und Assertion belegen außerdem Ressourcen-Konfliktablehnung und den Versand-/Transitpfad.

Für jeden Monatsabschluss erzeugt der Runner ein JSON-Save-Envelope, restauriert es und asserted `hash(restored) === hash(run)`. Im Artifact stimmen alle zwölf `stateHash`/`restoreHash`-Paare. Die Eventhashes sind je Monat mit abgelegt. Der fokussierte Jahresrunner wurde unabhängig ausgeführt: Exitcode 0, `status: PASS`, 12 Perioden, Endhash `a33ce7eddc325ab76ce0dc58a4a348a2eba1dcf2811153dc2395201800cf3fb0`. Die Snapshotdatei wurde deterministisch mit demselben SHA-256 wie vor dem Lauf neu erzeugt. Zusätzlich bestand ein unabhängiger JSON-Check über zwölf Perioden, Materialgleichung, Verfügbarkeit, Transitzeitpunkt und Restorehashes.

Die Gegenproben validieren doppelte Bewegungs-/Receipt-IDs, fehlende Receipt-Quelle, negative Mengen, manipulierte Bewegungsstände, Quarantäne oberhalb physischer Menge, tamperte Kundenentscheidung/Angebot und Fertigbestand fail-closed. Der angenommene Jahreszustand bleibt nach allen Negativfällen unverändert. Es werden keine Geldwerte bewertet: `ledger` und `cash` fehlen, Finance-Handoffs bleiben pending-non-posting, COGS/BAB/Revenue/Tax bleiben deferred.

## Ausgeführte Prüfungen und Grenzen

- `node --check prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` – PASS
- `node prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` – PASS, Exitcode 0
- Unabhängige Prüfung des gespeicherten JSON – PASS
- Snapshot-Artifact-SHA-256 nach Wiederholung unverändert – PASS

PASS gilt ausschließlich für diesen synthetischen physischen Jahres-Mengenfixture und seine Restore-/Reproduzierbarkeitsevidenz. Er belegt keine bewertete Bestandsführung, COGS/BAB, integrierte Finanzjournale oder den kompletten Jahres-Unternehmenslauf. Keine Implementierung, Ticket-/Governanceänderung oder Commitaktion vorgenommen.
