# A09 – T-0063 L2 Außenwirtschaftsprojektion: adversarial review (CP-0370)

**Status:** NONPASS – FX-Basisbeleg mit falscher Notierung wird als autoritative Basis verwendet
**Datum:** 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L2, T-0065/T-0069-Anschluss
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragenfaktor
**Profil:** V3 Shared Run ab 04.01.2027; A01-Stagingpaket `a02-code-input-t0063-l0l1`, kein `.git`
**Vorgänger:** CP-0355 A02-L2-Vertrag, CP-0368 A02-L2-Implementierung, CP-0369 A03 Finance-Re-Review

## Preflight / Snapshot

AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket-Board, Collaboration State, D-0161–D-0169, A02-L2-Vertrag samt CP-0355, CP-0368 samt A02-L2-Bericht sowie A03 CP-0369 und Bericht wurden gelesen. CP-0370 war vor Erstellung nicht vorhanden. `.git` fehlt; Gitstatus, Branch, HEAD und Diff sind nicht verfügbar. Keine Runtime-/Testdateien wurden geändert. Nur dieser Bericht und CP-0370 wurden im Paket erstellt.

## Ergebnis je Prüfbereich

| Bereich | Ergebnis | Befund |
|---|---|---|
| FX offene vs. angenommene Planung | **PASS (synthetischer Projektor)** | Nur lokal deklarierte `status: open`, USD-Pläne mit positiver numerischer Exposition und ohne Annahme-/Vertragssnapshot erzeugen den Planindex. Angenommene Verträge und Null-/fehlende/nichtnumerische Exposure bleiben ohne FX-Effekt. Kein Vertragspreis wird geändert. Kein Abgleich zu operativer Beschaffung vorhanden; dies bleibt explizite Integrationsgrenze. |
| FX Richtung des aktuellen Monatsereignisses | **PASS** | Projektion verlangt `USD`-Basis, `EUR`-Quote und `EUR_per_USD`; falsche aktuelle Notierung liefert keinen Effekt. Richtungsregressionen für Kursanstieg/-rückgang bestehen. |
| FX-Basisperiode/Basisnotierung | **NONPASS** | Januar-Basisevent wird nach Periode, Währung und positivem Kurs ausgewählt, aber nicht auf `quoteUnit` oder FX-Testfixture-ID geprüft. Repro: Januar-Basis `USD/EUR`, `quotePerUSD=0.9`, aber `quoteUnit='USD_per_EUR'` und ohne `testFixtureId`; gültiges Februarereignis `EUR_per_USD`, `quotePerUSD=0.945`. Der Projektor übernimmt 0,9 als EUR je USD und erzeugt fälschlich `+1,25 %` Planindexwirkung. Basiswert muss dieselbe zulässige Notierung/Einheit und den vorgesehenen 2027-01-Fixtureanker nachweisen oder fail-closed neutral bleiben. |
| Exportverteilung: Grenzen/Segmente/Referenzen | **PASS für synthetische Projektion** | `delta` und Exposure werden begrenzt, Segmente werden auf existierende Marktsegmente gefiltert und doppelte IDs dedupliziert. Repro `delta=999`, Exposure `999`, `['small','small','bogus']` ergibt ausschließlich Segment `small`, Exportanteil `0,45` statt `0,40`, bei exakt 5 Gesamtanfragen vor/nach. Fehlende Scope-/Segmentwerte bleiben neutral. |
| Export-Lag, Seed, Replay/History | **PASS im geprüften Umfang** | Der Pfad akzeptiert nur die eingebaute Ein-Monats-Lag-Fixture; Januarereignis wirkt nicht im Januar und wirkt im Februar. Verteilung ist seed-stabil. Macro-History ist an autoritativen Day-open-Input replaygebunden; keine koordinierte Historyänderung wurde akzeptiert. |
| D-0169 und Markt-/Financeobjekte | **PASS** | Gesamtzahl der existierenden D-0169-Wochenanfragen bleibt unverändert. Keine Inquiry, kein Angebot, Zuschlag, Umsatz, Marktzustand oder FinanceState wird angelegt/geändert. Erwartete Segmentmengen können fraktionale Inquiry-Äquivalente sein. |
| ETA: lokaler Status/Datum/Kappung | **PASS als deklarierte synthetische Projektion** | `status !== 'open'`, fehlende Referenz, ungültiges Datum und nichtpositive/nichtganzzahlige Verzögerung werden ignoriert. +2 Kalendertage und Kappung auf maximal +5 wurden geprüft. Datum wird als Kalenderdatum verschoben; ein Freitag-ETA `2027-02-05` plus 2 Kalendertage ergibt Sonntag `2027-02-07`, entsprechend der dokumentierten Kalendertag-Parametrierung. Keine Wochenend-Arbeitstagsverschiebung wird behauptet. |
| ETA: tatsächliche Auftragsreferenz | **Integrationsgrenze / kein Operativ-PASS** | Eine deklarierte Sendung `{orderRef:'PHANTOM-PO', status:'open'}` mit gültigem Datum erzeugt ein projiziertes ETA, obwohl im Run kein entsprechender Kaufauftrag existiert. Der Code prüft `orderRef` auf nichtleeren String, aber nicht gegen ein Bestellregister. A03 CP-0369 und A02 CP-0368 benennen, dass eine operative Einkaufs-/Bestellverwaltung nicht angeschlossen ist. Das ist nur als synthetische Eingabe zulässig; es darf nicht als echte Lieferanten-/Bestellintegration dargestellt werden. Ein bestätigter Status `received` wird korrekt ignoriert. |
| ETA: Menge/Wert/Invoice/COGS/Lager | **PASS (keine Mutation)** | Der Projektor gibt ausschließlich ein `after`-ETA aus. Menge, Eingang, Bestand, Liefervertrag, Wert, Invoice, BAB und COGS bleiben unverändert. Keine Finanzwirkung. |
| Identität / Dedupe / Restore | **PASS in vorhandenen Regressions** | Run-/Scenario-/Seed-, Effektgruppe und Quell-/Periodenfelder sind in der Ausgabe; `effectGroupId`/Target/Ref/Periode verhindert doppelte L2-Beiträge. Makroeingaben werden replayvalidiert. Save-/Restore ergibt gleiche Projektion. |
| Finance-/Run-Nichtmutation | **PASS** | Vorher-/Nachhervergleiche in L2-Regression bestehen für Run-State, Market-State, FinanceState und angenommene Vertrags-Snapshots. Dies umfasst keine vollständige Jahres-/Ledgerabstimmung. |

## Reproduktionen

1. **FX-Basisnotierung:** autoritativer Januar-Makroinput mit `baseCurrency:'USD'`, `quoteCurrency:'EUR'`, `quotePerUSD:0.9`, `quoteUnit:'USD_per_EUR'`, ohne `testFixtureId`; gültiger Februar-FX-Testevent mit `0.945 EUR_per_USD`. `getRunProjection()` akzeptiert die Basis und liefert `baseQuotePerUSD=0.9`, `appliedDeltaPct≈1.25`. Damit wird die Kehrwert-Notierung fälschlich direkt als EUR je USD verwendet.
2. **Export bounds:** `delta=999`, Exposure `999`, doppelte `small`-ID und unbekanntes Segment `bogus` wurden auf synthetischer Wochenvorlage ausgeführt. Ergebnis: Segmentliste `['small']`, Anteil 0,45, D-0169 Gesamt 5→5.
3. **ETA reference limitation:** `PHANTOM-PO` mit deklarierter offener Statusangabe und gültiger ETA wurde projiziert; `received-po` und ungültiges Datum wurden nicht projiziert. Das zeigt die fehlende operative Referenzprüfung, nicht eine echte Lieferantenintegration.

## Ausgeführte Tests

Alle mit Exitcode 0:

- `node prototype/v3-macro-trade-impact-regressions.mjs` – PASS
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS
- `node prototype/v3-market-simulation-regressions.mjs` – PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS
- `node prototype/v3-macro-demand-channel-regressions.mjs` – PASS
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS
- `node prototype/v3-run-operating-impact-regressions.mjs` – PASS

Zusätzliche In-Memory-Adversarialproben decken die falsche Januar-Notierung, Exportgrenzen/ID-Normalisierung sowie ETA offener/empfangener/phantom/ungültig datierter Einträge ab. Keine Datei im Runtime-/Testcode geändert.

## Grenzen und erforderliche Nacharbeit

- **Blockierender Fix:** FX-Basisereignis muss dieselbe USD-Basis-/EUR-Quote-Notierung, `EUR_per_USD`, den Januar-2027-Indexanker und die autorisierte synthetische Fixture/Quellbindung prüfen; sonst keine FX-Ausgabe. Danach A09-Re-Review mit falscher Basisrichtung.
- **Bekannte Integrationsgrenze:** ETA/FX-Referenzen stammen aus expliziten Makroinputs, nicht aus einem operativen Bestell-/Beschaffungsregister. Ein synthetisch deklarierter Phantom-OrderRef ist daher projizierbar, aber kein Beleg einer tatsächlichen Bestellung oder Lieferung.
- Testwerte/Fixtures sind keine realen Marktpreise, Lieferantenangebote, Währungsfeeds oder Branchenkalibrierungen.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** nicht verfügbar, Stagingpaket ohne `.git`.
- **Commit/Push:** nicht ausgeführt.

## Ausgewählte Snapshot-Hashes (SHA-256)

- `prototype/v3-macro-trade-impact.js`: `609789F489418D004791F4B4EEFC479206C4596FDC8C241B7FDE32F1B787D09A`
- `prototype/v3-macro-trade-impact-regressions.mjs`: `C505133FA444C4F790982729CDFE93065EA090822052E92DF546FA86FF08FD39`
- `prototype/v3/run.js`: `7FFCC89E471D3D12AF6026173292345ABD1A2D36EA6AD7E73BC1275F841CEB4E`
- `prototype/v3-run-orchestrator.js`: `50290C1753DEB54CE924A28264FC84888D0A48222F1F18251CB5CDB2E7955D9C`
- `prototype/v3-macro-simulation.js`: `864487D28B65D651F2061D1CEC8E06D94F9ACA926847F046CE57AF92A235D91D`
- `docs/agent-system/checkpoints/CP-0368.md`: `E3C493E78378856A007F281CA07E43C48D9F0467ACE1F011292AE74C7CE0D1C4`
- `docs/agent-system/checkpoints/CP-0369.md`: `A9484927AACB278425D636771C2F73325B1290163321D9AD8D8E6FD7838512E8`

Hashes identify selected files in the supplied snapshot, not a Git commit or full-tree digest.

**Nächster Schritt:** A02 soll FX-Basisnotierung/Fixture fail-closed binden. A01 entscheidet, ob die phantomfähige ETA-Projektion als ausdrücklich synthetische Eingabe im L2-Scope bleibt oder bis zur operativen Bestellreferenz neutralisiert wird. T-0063/T-0069 bleiben IN_PROGRESS.
