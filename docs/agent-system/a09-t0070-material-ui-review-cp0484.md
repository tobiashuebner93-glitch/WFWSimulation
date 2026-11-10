# A09 – Unabhängiger T-0070 Material-UI-Review (CP-0484)

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Datum:** 2026-11-01  
**Scope:** A05 Materialbestell-/Wareneingangs-UI in `prototype/v3/run.js`, `run.html` und den gezielten Regressionen.  
**Ergebnis:** **PASS für den geprüften UI-Code- und Regression-Slice; kein Browser-PASS und kein T-0063-G3- oder T-0076-Abschluss.**

## Preflight

Im vorgegebenen Checkout verifiziert: Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Der Status hatte während dieser Prüfung 500 Einträge (CP-0484 nennt einen früheren Stand von 494); alle vorhandenen Änderungen blieben unangetastet. Die sieben vorgegebenen Governance-SHA-256-Werte stimmten mit CP-0484 überein. CP-0484s Text bezeichnet die UI noch als in Arbeit; die hier geprüften A05-Artefakte und Tests liegen inzwischen vor. Ein separater A05-Bericht war im Checkout nicht auffindbar.

## Geprüfte Belege

- `renderInternationalMaterialSupplyUi` hängt im Ressourcen-/Materialbereich des Run-Workspaces. Die UI zeigt verfügbaren physischen Bestand, offene und eingegangene Sendungen sowie Baseline-ETA, synthetischen Lag, erwartetes Datum und Bestand nach Empfang.
- Formularfelder besitzen Browser-Constraints für Material, positive Menge, Baseline-Datum ab aktuellem Datum sowie Lag von 0 bis 14 Tagen. Der Bestellknopf und ein nicht fälliger Wareneingang sind bei geschlossenem Tag beziehungsweise vor ETA deaktiviert. Der Handler prüft zusätzlich `run.activeDay`; Order-/Shipment-IDs werden an die aktuelle Run-ID gebunden.
- Der UI-Text kennzeichnet Lieferant, ETA und Verzögerung als veränderbare Testannahmen und grenzt Marktinformation, Lieferzusage, Preis, Verbindlichkeit, Zahlung, Steuer, COGS und Ledgerposting ausdrücklich aus. Der Empfangshinweis nennt `nonposting_pending_cost_source`.
- Die Regression `a05-t0070-material-order-ui-regressions.mjs` prüft geschlossenen Tag, deaktivierten Empfang vor Fälligkeit, synthetische Verzögerung, keine Preisfelder, Empfang am ETA-Datum, Bestandsanstieg von 10 auf 12, Nichtbuchungsstatus und Entfernen der Empfangsaktion nach Eingang. Der Product-Lifecycle-Test prüft zusätzlich JSON-Restore mit idempotenter Wiederholung ohne doppelte Menge.
- `run.html` bindet das Stylesheet mit SHA-256-Token ein. Die vorhandene vollständige Run-Graph-Cache-Regression prüft 25 Module und erkennt transitive Byteänderungen.

## Ausgeführte Prüfungen

- `node --check prototype/v3/run.js` – PASS
- `node --check prototype/v3/a05-t0070-material-order-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0070-material-order-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0070-fx-offer-ui-regressions.mjs` – PASS (zusätzlicher A05-UI-Regressionslauf)
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS (25 Module, transitiver Cache-Token)

## Grenzen und offene Evidenz

Der A05-Materialtest ruft den Renderer und Product-Lifecycle-API direkt auf; er simuliert keine Browser-Formularinteraktion oder die `run.js`-Eventhandler. Falsche Run-/Materialbindung, geschlossener Tag am Handler, doppelte/konfliktbehaftete Receipt-Replays und Save/Restore-/Tamperfälle sind daher nicht durch diesen UI-spezifischen Test belegt. Die übergreifenden Product-/Orchestrator-Regressionen belegen Teile dieser Runtime-Grenzen, ersetzen aber keinen UI-Integrationsnachweis.

Ein Browser-Smoke war in dieser Umgebung nicht verfügbar: Edge war zwar geöffnet, aber die Computer-Use-Bindung konnte die aktive URL nicht mit ausreichender Sicherheit bestimmen und stoppte vor einer Bedienung. Deshalb sind tatsächliche Panel-Erreichbarkeit, DOM-Navigation und sichtbare Darstellung im Browser nicht unabhängig bestätigt.

Der Slice zeigt einen physischen Bestandseingang, aber weder Monatsbewegungsjournal noch monatlichen Lagerabschluss/Reconciliation oder Bestandsbewertung. T-0076 bleibt damit offen. Für G3 stehen außerdem der A08-Quellenreview und ein integrierter Gateentscheid durch A01 aus; dieser UI-Review bewertet diese Kriterien nicht.
