# A09 – T-0072 Re-Review nach Wiederherstellung der Makro-UI (CP-0487)

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Datum:** 2026-11-01  
**Ergebnis:** **PASS für T-0072/T-0063 G7-Paar-/Nichtdoppelzählungskriterium im geprüften Scope.** Kein Gesamt-G7- oder T-0063-Abschluss durch diesen Bericht.

## Preflight und Reparaturprüfung

Im angegebenen Checkout verifiziert: `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, 511 Status-Einträge. Alle sieben CP-0487-Governance-Hashes sowie die geforderten Hashes stimmten: `run.js` `9CF35CA081A245C77FC0583948A3E3DB621CB90E037C37D261B21AEFAA054C32`, `run.html` `EFDC646D99BDA13B029105F60E94676DA68B766E351F85484F460BD06B7B31B1`.

Der aktuelle `run.js`-Stand enthält die drei gemeldeten Wiederherstellungen `safeLink`, `formatIndex` und exportiertes `renderMacroSummary`; die HTML-Datei enthält einen neu berechneten Import-Graph. Der Code der Renderer baut die vorhandenen Projektionen in HTML zusammen, formatiert Indexwerte und akzeptiert externe Links nur über HTTPS zu dem explizit erlaubten Host. Es wurde kein neuer Makro-Wirkungspfad in diesen Helfern gefunden. Beide Dateien sind im Checkout untracked; ein Git-Basisdiff, mit dem sich „nur diese Ergänzungen“ unabhängig beweisen ließe, ist daher nicht verfügbar. Inhaltsprüfung und vorgegebene SHA-256-Werte stimmen.

## Re-Review der operativen Paare

Der vorherige T-0072-Befund bleibt unverändert: Die zwei gezählten operativen Variablen sind (1) die D-0169-Verteilung der Anfragevorlagen bei exakt erhaltener Gesamtzahl und (2) physische Materialverfügbarkeit mit Folgewirkung auf die Planbarkeit derselben materialgebundenen Operation. Foreign-Demand-Tests belegen neutralen Vorlauf, positiven/negativen Shift, gleichbleibendes `N`, deterministische Monatszuordnung, Replay/Restore/Tamper und Finanz-/Markt-Nichtmutation. Product-/Run-Tests belegen Neutral-/Lag-Receipt-Paar, vorher blockierte/nach tatsächlichem Eingang mögliche Operation, Run/Event-Bindung, Idempotenz, Restore und Nichtbuchung.

FX-Angebots-/Importplan, `openPurchaseOrderEta`-Projektion und T-0071-MRO-/Investmentindikator bleiben als `information_plan`/nichtmutierende Indikatoren getrennt. Sie werden weder als zusätzliche operative Firmenwirkung gezählt noch auf die physische Receipt-Menge addiert. T-0071-Hike/Cut/Neutral hat eigene kontrollierte Richtungs-/Lagtests, aber weiterhin `actualStateChanged: false` und keine Investitions-, Kapazitäts-, Kredit- oder Produktionsaktion.

## Ausgeführte Re-Review-Regressionen

Alle folgenden Prüfungen liefen nach der UI-Wiederherstellung mit Exitcode 0:

- `node --check prototype/v3/run.js`
- zuvor blockiert und jetzt PASS: `node prototype/v3-macro-demand-channel-regressions.mjs`
- zuvor blockiert und jetzt PASS: `node prototype/v3-run-macro-fixture-regressions.mjs` (A01-Ausführung; im erneuten unabhängigen Satz siehe unten ergänzende UI-Pfade)
- `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – PASS (5.000 ETA-Effekte, 20 Detailkarten)
- `node prototype/v3/a05-t0063-foreign-demand-fixture-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0070-material-order-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0070-fx-offer-ui-regressions.mjs` – PASS
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS (25 Module)
- erneut ausgeführt: Foreign-Demand-Runtime-, Macro-Trade-, Run-Orchestrator-, Product-Lifecycle- und T-0071-MRO-Pair-Regressionen – alle PASS.

Damit sind die beim vorherigen Review durch den fehlenden Export blockierten Testdateien wieder ausführbar; die UI-Rücksetzung ändert den Verhaltensbefund der zwei operativen Paare nicht.

## Grenzen

Kein interaktiver Browser-/Gerätetest und kein Jahreslauf. Der Nachweis gilt für Paarisolation, operative Variablenzuordnung und Nichtdoppelzählung; er schließt weder das Gesamtgate T-0063/G7 noch T-0073/G10 oder Jahres-/Finanz-/Bestandsgates. Da `run.js` und `run.html` untracked sind, ist die Einschränkung des Änderungssatzes auf die drei Helfer plus Graph-Token anhand eines Git-Basisdiffs nicht unabhängig verifizierbar. Kein Code, Ticket-, CP- oder Governance-Status wurde geändert.
