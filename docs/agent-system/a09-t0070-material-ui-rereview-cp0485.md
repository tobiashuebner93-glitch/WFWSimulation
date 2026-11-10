# A09 – T-0070 Material-UI-Handlerintegration Re-Review (CP-0485)

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Datum:** 2026-11-01  
**Ergebnis:** **PASS für Handler-/Runtime-Integration und fokussierte Regressionen; kein Browser-PASS und kein Abschluss von T-0063 G3 oder T-0076.**

## Preflight

Geprüfter Checkout: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Die sieben Governance-Hashes und die vorgegebenen Hashes von `prototype/v3/run.js` und `run.html` stimmten mit CP-0485 überein. Der Status zählte 503 Einträge; bestehende Änderungen blieben unangetastet.

## Handlerbefund

Der neue Bestellhandler verhindert `preventDefault`-unabhängig keine Laufzeitprüfung: Ohne offenen Simulationstag oder ohne initialisiertes Produktmodul schlägt er fehl; Material-ID, positive endliche Menge, ganzzahliger Lag 0–14 und Baseline-ETA ab aktivem Datum werden erneut validiert. Order- und Shipment-ID enthalten Run-ID und Sequenz. Der Handler aktualisiert den Run erst nach erfolgreichem Aufruf der Shared-Run-API; ungültige Eingaben lassen den Zustand unverändert.

Der Receipt-Handler verlangt einen offenen Tag, nimmt die Shipment-ID aus dem Button und übergibt sie an die Shared-Run-API. Fälligkeit, unbekannte/fremde Sendungen und doppelte beziehungsweise konfliktbehaftete Ereignisse werden an der API-Grenze entschieden. Erst die erfolgreiche API-Antwort wird gesetzt und gerendert; Duplikate melden den No-op-Status. Das Rendering sperrt den Empfang vor ETA und bei geschlossenem Tag. UI und Handler zeigen Menge-only-/Nonposting-Grenze.

Der A05-Materialregressionstest prüft weiterhin primär Renderer und Product-Lifecycle-API; er ruft die neuen extrahierten Handler nicht auf. Daher habe ich zusätzlich einen unveränderten Inline-Smoke direkt gegen die exportierten Handler und echte Shared-Run-APIs ausgeführt. Er bestand für Bestellung samt Run-ID-Bindung, ungültiges Material ohne Mutation, frühe Empfangssperre ohne Mutation, fremde Run-ID, geschlossenen Tag, fälligen Eingang und wiederholten Eingang ohne zweite Mengenbewegung. Keine Testdatei wurde geändert.

## Ausgeführte Regressionen

- `node --check prototype/v3/run.js` und Syntaxcheck der A05-Materialregression – PASS
- `node prototype/v3/a05-t0070-material-order-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0070-fx-offer-ui-regressions.mjs` – PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS
- `node prototype/v3-product-lifecycle-regressions.mjs` – PASS
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS (25 Module; transitive Änderung verändert Graph-Token)
- Inline-Handler-Smoke wie oben beschrieben – PASS

## Grenzen

Ein interaktiver Browserlauf war nicht möglich: Die vorhandene Edge-Sitzung ließ sich nicht sicher an eine aktive URL binden; kein UI-Klick wurde ausgeführt. Damit bleiben visuelle Darstellung und tatsächliche Geräte-/Browsernavigation unbestätigt. Der Inline-Smoke ersetzt keinen Browsernachweis. Der geprüfte Pfad umfasst nur physischen Bestandseingang und dessen Nonposting-Grenze, keine Monatsbewegungs-/Lagerabschluss-Reconciliation oder Bestandsbewertung. T-0076 sowie A08-Quellen- und A01-Gesamtgateentscheid bleiben außerhalb dieses Re-Reviews.
