# T-0062 A02 – V2 Phase-8-Finanzvertrag

**Review/Implementierungsrevision:** `194fbaa7069ef59d1c832164a21b06f1cd2102d`  
**Arbeitsbaum:** bereits vor diesem Teilauftrag uncommittet und durch weitere Agenten geändert; alle Änderungen erhalten. Kein Commit oder Push.  
**Grundlage:** bestätigte Szenariokonvention D-0160; fachliche Reihenfolge mit A03 abgestimmt. V2-Garagenprofil; keine V1-Regel-, Schema- oder Architekturfreigabe.

## Ergebnis

Die Phase-8-Verarbeitung ist in `prototype/finance.js` zentralisiert und wird von `prototype/app.js` sowie dem Jahres-Smoke über denselben Einstieg ausgeführt. Reihenfolge je wirksamem Simulationstag: Kundeneingänge/Disporückführung → Maschinenrate → Immobilienrate → Anlagenrate → sonstige Betriebsposten in Spielerpriorität → SimTAX → Mahn-/Statusfortschreibung → tägliche Zinsabgrenzung. Wiederholte Verarbeitung desselben Datums wird übersprungen. Zahlungsversuche und Mahnstatus sind getrennt. Zahlungsversuche bleiben vollständig; es gibt keinen automatischen Dispoabruf und keine Erweiterung von D-0125 auf Immobilien- oder Anlagenraten. Kreditartspezifische Retry- und Verwertungsregeln bleiben bestehen.

Die A02-Spezifikation enthält jetzt den D-0160-V2-Vertrag und grenzt ihn ausdrücklich vom V1-Vertrag D-0129 ab. Keine rechtliche oder allgemeine Bankrangfolge wird behauptet.

## Prüfergebnisse

| Gate | Ergebnis | Beleg |
| --- | --- | --- |
| D-0160 Same-day-Reihenfolge, Spielerpriorität, Cash-Reconciliation | PASS | `node prototype/v2-phase8-finance-regressions.mjs`; zusätzliche Reihenfolge-/Prioritätsprüfung im Jahres-Smoke |
| Knappe Liquidität: Vollzahlung, kein negativer Cash, kein Auto-Draw | PASS | Phase-8-Regression Gruppe 2 |
| D-0125-Grenze / unterstützter manueller Maschinenratenabruf | PASS | Phase-8-Regression Gruppe 3 |
| Wöchentliche Retry- und kreditartspezifische Verwertungslogik | PASS | Phase-8-Regression Gruppe 4; bestehende `t0020`- und Jahres-Smoke-Prüfungen |
| Erinnerung/Mahnung nach Zahlungsversuchen; bezahlte Posten ohne Mahnung | PASS | Phase-8-Regression Gruppe 5 und `t0020` |
| Wirksames Datum, Periodenzuordnung, Idempotenz und Saldenabgleich | PASS | Phase-8-Regression Gruppe 6; 12 Monatsabschlüsse im Jahres-Smoke mit null Reconciliation-Fehlern |
| Netto, positionsweise SimTAX-Rundung, Brutto-Zahlbetrag | PASS | Phase-8-Regression Gruppe 7: 100,03 € netto + 19,01 € SimTAX = 119,04 € Zahlungseingang |
| 365-Tage-Jahreslauf | PASS | `node prototype/year-simulation-smoke.mjs`; Enddatum 2028-01-01, 12 Monatsabschlüsse, 129 generierte / 63 gewonnene / 63 gelieferte / 59 bezahlte Aufträge, 0 offene Kosten, 0 Reconciliation-Fehler; Liquidität blieb positiv |
| Vorhandene Prototyp-Regressionen | PASS | alle 16 Dateien `prototype/*regressions.mjs` bestanden, einschließlich der neuen Phase-8-Suite |
| Quellsyntax | PASS | `node --check` für `finance.js`, `app.js`, Jahres-Smoke und Phase-8-Regression |
| iPhone-/iPad-Paketbuilder | PASS | `node prototype/build-iphone-package.mjs`; 10 Module eingebettet; 924.580 Bytes |
| Manuelle Browser-/Geräteprüfung nach dieser Änderung | OFFEN | Nicht Teil dieses A02-Laufs; Pakethash und Node-Tests belegen keine iOS-Safari-Ausführung |
| Formale Commitbindung des Berichts/Änderungsstands | OFFEN | uncommitteter gemeinsamer Arbeitsbaum; kein Commit/Push dieses Auftrags |

## Paketprüfsummen

Builder-Manifest meldet Quellrevision `main@194fbaab7069ef59d1c832164a21b06f1cd2102d` und `workingTreeSourcesIncluded: true`.

| Artefakt | SHA-256 |
| --- | --- |
| `prototype/werkstatt-v2-iphone.html` | `1bd4c202f582d99352d3468cc3ada7ba88a0f292035f5cc03f917864fbe9a531` |
| `prototype/werkstatt-v2-iphone.zip` | `915cf2e36bcda0f0590840240580bebd15f8e48a8c19bf819696302efce63a33` |
| `prototype/werkstatt-v2-package-manifest.json` | `6f0bf52cf4df4da98e73eeed97575479c1d085569a580c743530d487b3488a43` |
| Eingabe `prototype/finance.js` laut Manifest | `7d47add95fb2a39e996ad8d8141ae5bb18d51a645209cff444a892455e0406aa` |
| Eingabe `prototype/app.js` laut Manifest | `c4f9fac725a674955fd3cdc395d6f4c056825821d5ffcd3f4b24764fd50ade83` |

Die HTML-Ausgabe wurde mit ihrem Manifesthash abgeglichen. Das Manifest bezieht absichtlich den uncommitteten Arbeitsbaum ein; HEAD allein identifiziert daher nicht den vollständigen Paketinhalt.

## Dateien dieses Teilschritts

- `prototype/finance.js`
- `prototype/app.js`
- `prototype/year-simulation-smoke.mjs`
- `prototype/v2-phase8-finance-regressions.mjs` (neu)
- `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md`
- neu gebaut: `prototype/werkstatt-v2-iphone.html`, `prototype/werkstatt-v2-iphone.zip`, `prototype/werkstatt-v2-package-manifest.json`

Keine bestehenden Nutzeränderungen wurden verworfen. Das gemeinsame Working Tree enthält weitere Änderungen außerhalb dieses Implementierungsumfangs; A01 muss diese bei der Gesamtintegration separat prüfen. Dieser Bericht bestätigt Tests und Paketbau, nicht die formale Commitbarkeit des Gesamtbaums.
