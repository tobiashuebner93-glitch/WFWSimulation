# A09 – Unabhängiger Re-Review L0/L1 Betriebswirkungsprojektion (CP-0359)

**Status:** NONPASS – ein reproduzierbarer Wochenend-Commitment-Fehler blockiert das Gate
**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063 L0/L1, T-0069
**Entscheidung:** D-0169; keine neue Entscheidung
**Prüfbasis:** A01 bereitgestellter Snapshot `a02-code-input-t0063-l0l1` ohne `.git`; Dateien aus dem dort enthaltenen Snapshot. Kein Branch-, HEAD-, Working-Tree- oder Diff-Nachweis.
**Vorgänger:** CP-0357 A02 L0/L1, CP-0356 A03 Finanzreview, CP-0351 A08 Gap-Audit. Der angeforderte CP-0358 war in dieser Snapshotkopie nicht vorhanden; A03s vom A01 gemeldeter Befund wurde zusätzlich durch eigenen Repro geprüft.

## Ergebnis je Gate

| Gate | Ergebnis | Beleg / Grenze |
|---|---|---|
| Persistierte Projektion als zweite Wahrheit | **PASS** | `getV3RunOperatingImpact()` validiert den Run und berechnet die Werte aus Market-Events, Workorders und Produktplänen. Ein künstlich hinzugefügtes `runState.operatingImpact` mit manipulierten Werten wurde ignoriert; die Projektion blieb identisch. |
| D-0169 Nachfrage und neutrale Exposition | **PASS** | Die Regression prüft vier synthetische Lücken `+1/+3/−1/−3 pp`, neutrale Exposition mit Faktor 1 und fünf Basisanfragen, Seed-/Trace-/Snapshotbezug. Die Tracezahl wird mit den geplanten Template-IDs abgeglichen. |
| Gewonnene Aufträge | **PASS** | Betriebsprojektion zählt aus tatsächlichen `customerWorkOrders`, nicht aus bloßen offenen Anfragen. Fixture prüft echten Player-Zuschlag und Null Zuschläge trotz vorhandener Anfragen; Orchestrator bindet Orders an angenommene Player-Angebote und Entscheidungsereignisse. |
| Geplante Stunden / Workload | **NONPASS** | Stunden werden anhand des ISO-Wochenintervalls einschließlich Samstag und Sonntag aggregiert. Repro mit einer geplanten 8-h-Belegung am Samstag 09.01.2027 ergibt für Woche 04.–10.01. `plannedHours=8`, `availableCapacityHours=40`, `utilization=0.2`. Wochenendtage sind laut geltender Kalenderregel arbeitsfrei und dürfen nicht in Wochenarbeitsstunden/Auslastung zählen. |
| Kapazität | **NONPASS (abhängig vom Wochenendfall)** | Normale Kapazitätsbasis ist `Summe(hoursPerDay) × 5`; ein Worker mit 8 h/Tag ergibt 40 h. Der Samstagseintrag wird dennoch in den Zähler eingerechnet. Nach Änderung von `people[0].hoursPerDay` auf 10 wurde Restore akzeptiert und die Kapazität auf 50 h neu berechnet; dies ist eine Neuberechnung aus dem gespeicherten Ressourcenstand, kein zweites gespeichertes Impact-Feld. Die initialen Ressourcen sind Spielerinput; der Snapshot enthält keinen separaten kryptographischen Ressourcenanker. |
| Trace-/Snapshot-/Identitätsbindung und Restore | **PASS** | Koordinierte Teilmutationen von D-0169-Trace (Exposure), `market_schedule`-Run-Event, Snapshotperiode und Run-ID wurden beim Restore verworfen. Die Regressionen decken die Bindung an Makro-Monatssnapshot, Day-open-Fingerprint und Market-Modul-Event ab. Keine gegenteilige akzeptierte Trace-Mutation reproduziert. |
| FinanceState-Nichtmutation | **PASS** | Betriebswirkungs-Regression vergleicht FinanceState vor/nach Run/Projektion und nach Save/Restore. FinanceRuntime-, Market-, Macro-demand-, Orchestrator- und Macro-fixture-Regressionen bestanden. Dies ist kein vollständiger Jahres-/Ledgerreconciliation-Nachweis. |
| L0/L1-/V1/V2-Grenze | **PASS im Codeumfang** | Nur V3-Run-Projektion geprüft; keine Änderung an V1/V2 aus diesem Snapshot ableitbar. Produktkapazität vermerkt ausdrücklich, dass Abwesenheiten/Maschinenengpässe in L0/L1 nicht eingerechnet werden. Keine vollständige Unternehmenswirkung aus T-0063 abgenommen. |
| Jahres-Smoke-Fixture | **PASS (Fixturestand)** | `v3-year-smoke.mjs` berechnet Wochentraces aus dem autoritativen Monats-Makroinput. Der optionale komplette Mehrpfad-Jahressmoke wurde nicht abgeschlossen; Start von UPSWING lief nach 30 s ohne Ergebnisoutput und wurde für den Review nicht weiter abgewartet. Produktlebenszyklus-Regression bestand nach Nachreichung der Datei `docs/learning/t-0068-v3-prozesslernobjekt.json`. |

## Testausführung

Ausgeführt aus dem Snapshot-Root:

- `node prototype/v3-run-operating-impact-regressions.mjs` – PASS
- `node prototype/v3-macro-demand-channel-regressions.mjs` – PASS
- `node prototype/v3-market-simulation-regressions.mjs` – PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS
- `node prototype/v3-product-lifecycle-regressions.mjs` – PASS
- Wochenend-Commitment-Repro – **NONPASS**, wie oben dokumentiert.
- `node prototype/v3-year-smoke.mjs` – nach 30 s ohne Abschlussoutput nicht weiter abgewartet; kein Jahreslauf-PASS behauptet.

## Reproduktion des NONPASS

Ein V3-Run mit Start 04.01.2027, einem Beschäftigten mit 8 Stunden/Tag und einer bestehenden geplanten Belegung `{date: "2027-01-09", hours: 8}` wurde geöffnet. Die Projektion meldete:

```json
{"weekStart":"2027-01-04","weekEnd":"2027-01-10","plannedHours":8,"availableCapacityHours":40,"utilization":0.2}
```

Der Zähler filtert nach `weekStart <= date <= weekEnd`; er schließt Wochenendbelegungen nicht aus. Erwartet wird `plannedHours=0` und `utilization=0` für ausschließlich am Samstag terminierte Arbeit oder eine fail-closed Ablehnung des ungültigen Samstags-Commitments. Die bestehende Fixture deckt nur Montag–Freitag ab.

## Snapshot-/Hashnachweis

SHA-256 (ausgewählte Prüfeingaben, kein vollständiger Snapshot-/Git-Tree-Hash):

- `prototype/v3/run.js`: `13A69689BC7F7A9DC61EF7990EC46317FB58709EC5F9FCD6F0207FD97087FCA1`
- `prototype/v3-run-orchestrator.js`: `8162FD26EFC0FB22DC1DFFCD8F68D6B9C0210061F282CAC3F5D167609EB33348`
- `prototype/v3-run-operating-impact-regressions.mjs`: `1FF6D30FC760CEF27223845B5AAC9A902F5827A142C8D39766031D6E6DC305D0`
- `prototype/v3-macro-demand-channel.js`: `51C0F2506E8565D450553C82F6D77EAB3BD7B188284AAEFB71973810AF4553C2`
- `prototype/v3-year-smoke.mjs`: `B80AE8C115AB00A26FB0618713D11498F538068EB3F88E14F2950F76ECC3B49B`

Zusätzliche festgelegte Testdateien und Governance-/Decision-Eingaben wurden im selben unveränderten Stagingpaket gelesen. Der Copy-Bestand wurde während des Reviews nicht verändert außer diesem A09-Bericht und CP-0359.

## Nachweisrollen und Grenzen

- **Ausführung:** A09, unabhängige Code-/Regression-/Adversarialprüfung auf dem bereitgestellten Snapshot.
- **Fachreview:** A03 CP-0358 war im vorliegenden Paket nicht enthalten; A01 meldete dessen Wochenendbefund. Der Repro wurde unabhängig bestätigt.
- **Unabhängige QA:** dieses Dokument ist der unabhängige QA-Bericht; Gesamtergebnis NONPASS.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** nicht verfügbar (`.git` fehlt); kein Status, Diff, Branch oder Commit behauptet.
- **Änderungen:** keine Produktcodeänderung. Nur Bericht und CP-0359 wurden im Stagingpaket erstellt.
- **Commit/Push:** nicht ausgeführt.

**Nächster Schritt:** A02 soll Wochenendbelegungen aus der Betriebswirkungsaggregation ausschließen oder bereits bei Eingabe fail-closed zurückweisen und eine Samstags-/Sonntagsregression ergänzen. Danach A09-Re-Review auf aktualisiertem Snapshot. T-0063 und T-0069 bleiben IN_PROGRESS.
