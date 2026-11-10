# A09 – Unabhängiger T-0075-Dreimonatsfluss-Review (CP-0485)

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Datum:** 2026-11-01  
**Ergebnis:** **PASS für den begrenzten Januar–März-Shared-Run-Verhaltensslice; kein PASS für den vollständigen 12-Monats-/Jahresnachweis oder T-0069 G5 insgesamt.**

## Preflight

Im vorgegebenen Checkout geprüft: Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; CP-0485 maßgeblich. Die sieben Governance-Digests stimmten überein. Der Arbeitsbaum hatte 504 Status-Einträge; alle lokalen Änderungen blieben unangetastet. Fixture-Hash: `6E21A576A432457EA3F40030168F16FFF0F84DDEE47CFCF9FFF076336277B58B`; A02-Bericht-Hash: `B4DADC9194858EC5FFDE6359FFE982D18898C42CA396C54612027839D7DA87D7`.

## Unabhängiger Befund

Die Fixture verarbeitet täglich vom 2027-01-04 bis 2027-03-31 in einem gemeinsamen Run mit identischen Run-IDs in Markt- und Produktmodul. Pro Monat entsteht ein Kundenfluss: Anfrage, Spielerangebot, Marktentscheidung und Arbeitsauftrag, Operationsplanung/-abschluss, Lieferung und Abnahme durch die benannte Kundenseite. Zusätzlich wird monatlich ein Eigenprodukt produziert, angeboten und entschieden; zwei akzeptierte Verkäufe werden versandt, eine Ablehnung lässt den Fertigbestand bestehen.

Die Negativfälle sind konkret: nicht beantwortete Anfragen laufen ab, ein ausgelassenes Spielerangebot geht an einen Wettbewerber, und eine konkurrierende Person-/Maschinenbelegung lässt die Arbeitsplanung scheitern, ohne den Run teilweise zu mutieren. Die Fixture prüft Monatsendstände, gemeinsame Event-/Modulbindung, JSON-Roundtrip-Validierung, stabilen kanonischen Hash, idempotente Entscheidungs-/Tagesabschluss-Replays sowie Tamper-Rejection für Kundenentscheidung, Produktangebotssnapshot und Fertigbestand.

Finanzgrenze bleibt ausdrücklich nichtbuchend: Kunden-/Produktumsatz `pending_non_posting`, Produkt-COGS `pending_deferred_bab`; kein Ledger, Cash, Steuer oder BAB wird abgeleitet. Das entspricht dem Scope eines operativen Verhaltensnachweises.

## Ausgeführte Prüfungen

- `node prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` – PASS; 3 Perioden, 3 abgenommene Kundenaufträge, Eigenproduktentscheidungen `[accepted, rejected, accepted]`, 2 Versände, Kapazitätskonflikt, Restore/Replay/Tamper-Pfade. Endhash: `fc08e8030bdf7ec47545efea03d9f9685712538c3d090b209772b4c067a542e7`.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS
- `node prototype/v3-market-simulation-regressions.mjs` – PASS
- `node prototype/v3-product-lifecycle-regressions.mjs` – PASS
- `node --check prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` – PASS

## Grenzen / Abgrenzung

Der Nachweis deckt genau drei Perioden ab und ist kein Zwölfmonatslauf. Der Hashvergleich bestätigt kanonische JSON-Roundtrip-Gleichheit des Endzustands, kein vollständiges Fortsetzen aus einem gespeicherten Zwischenstand und kein unabhängiges Replay des gesamten Jahres. Browser-/UI-Verhalten wurde in diesem Review nicht getestet. Jahresstabilität, längere Periodenabstimmung und die übrigen Finanz-/Lagerbewertungsgrenzen bleiben offen. A01 entscheidet, ob und wie dieser begrenzte Slice in T-0075/T-0069 G5 aufgenommen wird.
