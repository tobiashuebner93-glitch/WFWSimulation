# A09 finaler Markt-Runtime-Re-Review – T-0065

**STATUS:** PARTIAL PASS – Restore-/Replay-Blocker behoben; Drei-Größen-Kriterium im ausgelieferten Fixture noch nicht belegt
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0065 (isolierte Runtime- und UI-API-Prüfung; keine Gesamtfreigabe)
**GIT-BASIS:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, `main...origin/main`

## Umfang und Preflight

Fresh preflight gelesen: `AGENTS.md`, Agentenstruktur und Rechtematrix, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280, D-0159–D-0164, T-0065, A02-T-0065-Arbeitsbericht und Marktvertrag, A03-T-0065-Finanzreview, vorheriger A09-NONPASS-Bericht sowie A05-UI-Code und Regressionen. `git status` wurde geprüft. Der gemeinsame Arbeitsbaum enthält bestehende Änderungen und zahlreiche ungetrackte Arbeiten anderer Agents; diese wurden erhalten. Nur dieser A09-Bericht wurde neu erstellt. Keine Produktdatei geändert, kein Commit/Push.

A03 bestätigt PASS ausschließlich für Finanzschnittstelle und Nichtmutation. A05-Regressionen testen die UI-API-/DOM-Anbindung, sind kein Browser-/Gerätetest. T-0065 bleibt im Ticket Board `IN_PROGRESS`; die Gesamtintegration und End-to-End-Jahreskopplung bleiben offen.

## Gates

| Gate | Ergebnis | Nachweis / Grenze |
|---|---|---|
| Frühere Restore-Korruption | **PASS** | Der frühere Fall (Schedule-Event und zugehörige `processedEventIds` entfernt, `scheduledWeeks` und Anfrage erhalten) wird nun vom Validator als inkonsistente Historie abgelehnt. `scheduleV3MarketWeek` gibt kontrolliert `ok:false`, `error.code=invalid_market_state` zurück; der übergebene Zustand bleibt tiefgleich zum Vorher-Snapshot. Die Regression belegt genau diesen Fall. |
| Gültiger Restore und Replay | **PASS** | Ein gültig restaurierter Zustand wird für dieselbe Woche erneut aufgerufen: `duplicate=true`, gespeichertes Ergebnis zurückgegeben, Anzahl Anfragen bleibt unverändert und Inquiry-IDs bleiben eindeutig. Dies ist in der A02-Regression enthalten. |
| Wiederholte Template-ID innerhalb eines Batches | **PASS, mit Semantikhinweis** | Ephemere Probe mit zwei identischen `templateId`-Vorlagen im selben Wochenbatch lieferte zwei eindeutige IDs, da die deterministische ID auch den Batchindex enthält (`…|small|0`, `…|small|1`). Beide Vorlagen werden daher als zwei separate Anfragen behandelt; Validator akzeptiert den konsistenten Zustand. Ein doppelter generierter Inquiry-Schlüssel wird vor Mutation zurückgewiesen. |
| Bereits vorhandene Inquiry-ID / beschädigte Duplikathistorie | **PASS – fail closed** | Ephemere Probe fügte eine bereits vorhandene Inquiry-ID als Duplikat in den Zustand ein. Vor jedem Replay lehnte die Zustandsvalidierung den Zustand mit `invalid_market_state` ab; der Caller-Zustand blieb unverändert. Ein gültiger Zustand kann keine bereits vorhandene Anfrage-ID außerhalb seiner Wochenhistorie enthalten. |
| Mindestens drei Auftragsgrößen – Runtime | **PASS im isolierten Probeprofil** | Ephemere Probe plante `small`, `medium`, `large`, ließ den Markttag fortschreiben und erhielt drei Monatsberichtzeilen. Werte: small n=3 / 10.100 Cent; medium n=3 / 20.100 Cent; large n=3 / 30.100 Cent. |
| Mindestens drei Größen – gebündeltes UI-Demo/Regression | **NONPASS / Nachweis fehlt** | Das eingecheckte A05-Fixture `createDocumentedMarketFixture` sowie A02-Marktregressionen enthalten weiterhin nur `small` und `large`. A05s generische Reportdarstellung kann zusätzliche Größen rendern, aber die mitgelieferte Demo und Regression weisen nicht drei Klassen nach. V3-04/T-0065 verlangt mindestens drei Größen; die isolierte Probe ersetzt keinen reproduzierbaren Produktfixture-/Regressionstest. |
| UI-API-Grenze, Wettbewerbsdatenschutz, Snapshot | **PASS im Code-/DOM-Regressionsumfang** | A05 liest Spieleranfragen ausschließlich über `getV3MarketPlayerView`, Monatsaggregate über `getV3MonthlyCompetitorReport`, projiziert Berichtsfelder erneut auf `period,sizeClass,sampleCount,meanCompetitorNetPriceCents,suppressed` und reicht Angebote über `submitV3MarketOffer` an A02. Angebotssnapshot wird durch A03 erstellt und von A02 validiert; kein UI-Bypass festgestellt. A05-Regressionen bestätigen, dass Konkurrenz-IDs und Einzelpreise nicht in der gerenderten Oberfläche auftauchen und dass Snapshot/Preis nach Annahme fixiert sind. |
| Finanz-Nichtmutation | **PASS, durch A03 fachlich separat bestätigt** | A03s T-0065-Finanzreview bestätigt isolierte Markttransitions ohne Cash, Ledger, offene Posten oder Buchungen. Diese A09-Reviewprüfung hat keine weitere Finanzlogik implementiert oder geändert. |
| Browser/Mobilgerät und Gesamtintegration | **NICHT AUSGEFÜHRT / OFFEN** | Kein Browser-/Gerätetest im Auftrag; A05-Regressionen sind Node-/DOM-Stubs. V1/V2-/Jahresintegration, produktive Marktfixture-Kalibrierung und End-to-End-Abnahme bleiben außerhalb dieses isolierten Re-Reviews. |

## Ausgeführte Prüfungen

- `node --check prototype/v3-market-simulation.js` – **PASS**.
- `node --check prototype/v3-market-simulation-regressions.mjs` – **PASS**.
- `node prototype/v3-market-simulation-regressions.mjs` – **PASS** (`V3 market simulation regressions: PASS`).
- `node prototype/v3-financial-calculation-regressions.mjs` – **PASS** (`V3 financial calculation regressions: PASS`).
- `node prototype/v3/a05-t0065-market-ui-regressions.mjs` – **PASS** (`A05 T-0065 market UI regressions: PASS`).
- Ephemere Node-Proben für Drei-Größen-Bericht, doppelte Template-ID im Batch und bereits duplizierte bestehende Inquiry-ID – **PASS**, keine Dateien geschrieben.
- `git diff --check` – **Exit 0**; Ausgabe nur konfigurierte LF/CRLF-Hinweise aus bestehenden parallelen Änderungen.

## Ergebnis an A01

Der frühere A09-Blocker zur unvollständigen Restorehistorie ist anhand der konkreten Reproduktion behoben. Die Runtime weist korrupten Zustand vor Replay ab und gültiges Replay bleibt idempotent. Die API-Grenze zur A05-Oberfläche und die Wettbewerbsdatenprojektion zeigen in den automatisierten Prüfungen keinen Bypass.

T-0065 ist dadurch **noch nicht insgesamt abnahmefähig**: Die aktuell gebündelte A05-Demo und Regression belegen weiterhin nur zwei Auftragsgrößen statt der geforderten mindestens drei. Ergänze eine dritte Größe in einem reproduzierbaren Fixture mit dauerhafter Regression und führe danach die passende UI-/Integrationsprüfung aus. Gesamtintegration/Jahreslauf und Browser-/Gerätetest bleiben zusätzliche, separat zu schließende Gates.
