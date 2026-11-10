# A01 – T-0110 Delivery Evidence Appendix (CP-0513)

**Status:** A01-Evidenzanhang ergänzt; T-0110 bleibt PARTIAL bis A04-/A10-Rollenreview und T-0109-Browserrundlauf.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Goal/Tickets:** MG-002 / SLG-002.5 / T-0110; Evidenzbezüge T-0065/66/67/69 und T-0109
**Branch/HEAD:** main / fdc4960d4bf92fb13f6802e8d0738eb3d9110097
**Autor/Ausführung:** A01. **A11-/A04-/A10-Fachreview:** nicht ausgeführt. **A09-Matrixreview:** vorheriger PASS nach A11-Bericht, Scope siehe dessen Status.

## Zweck und Claimgrenze

Dieser Anhang ergänzt den A11-Bericht um explizite Dateihashes und reproduzierbare lokale Node-Befehle. Hashes identifizieren die im aktuellen Checkout geprüften Bytefolgen; sie sind keine Aussage, dass jede Datei Bestandteil desselben Commits ist. Der sehr umfangreiche Arbeitsbaum bleibt lokal. Browser-Smokes aus CP-0510 sind getrennte UI-Belege; für T-0109 wurde kein Browserklick-/Reload-PASS erzielt. Dieser Anhang erteilt keine Schema-, Architektur-, Finanzposting-, Rechts- oder Releasefreigabe.

## Code-/Testmanifest (SHA-256)

| Zweck | Datei | SHA-256 |
|---|---|---|
| T-0065 Marktengine | `prototype/v3-market-simulation.js` | `82E2870597C80A167471822EF73D1079C4E78D67E50346D6E74BAB72323AA947` |
| Shared Run JS | `prototype/v3/run.js` | `1E13164BD294671BD4206DF30233FA9B080375D274EB7C7883F9CA94B892AE5E` |
| Shared Run HTML | `prototype/v3/run.html` | `5D28B82692D7D4E072F053877378D71D95BE89F1F1FBFF3CACDC73618E08825B` |
| T-0065 UI regression | `prototype/v3/a05-t0065-market-ui-regressions.mjs` | `C296A37EB1CE1116004F75ABE93438C0606DD4EF01E242D86C3429E9F7DC5269` |
| T-0066 product lifecycle | `prototype/v3-product-lifecycle.js` | `0BD09CF2C539AF5DF2416F24D8BDB3E2C1381C431802713BC1C9D4832DDB8B9F` |
| T-0066 UI regression | `prototype/v3/a05-t0066-product-ui-regressions.mjs` | `FF7803220C2ABC0F8EAAD3960ECE8F9A97878589627D5E1A1B86A9FE8B87BC6B` |
| T-0067 financial calculation | `prototype/v3-financial-calculation.js` | `85F803C325529EE482625A35917B8A3B110A37DD81CAEFFD5D494AC037B15A2F` |
| T-0067 finance UI | `prototype/v3/finance.js` | `A5B9D1437C64B468792148E599688731BCD53A5F166CED0306BF8CBC92486234` |
| T-0067 UI regression | `prototype/v3/a05-t0067-regressions.mjs` | `4F76E3721E6036DFF434E2FB479848CAC6F927002C5870D33BF4011916628271` |
| T-0069 run orchestration | `prototype/v3-run-orchestrator.js` | `68D963C774564D4AFCD267FC63689F611BD713785C9BF523BC9435A88DB6F8BB` |
| T-0069 G5 annual harness | `prototype/v3-t0075-annual-order-product-flow-smoke.mjs` | `2FEA2D86830EDA1FC38DFEEB8B7ACE3D47E04EE7A6EBED6C8C231750B1372579` |
| T-0069 G7 finance runtime | `prototype/v3-finance-runtime.js` | `EAC224A67495B9B9D97D3AB21DD8C01C12B58D2D6310147FF3D454775A365181` |
| T-0069 G7 ledger projection | `prototype/v3-finance-ledger-projection.js` | `69C51CFFD648D8DD4DE824B410E0A1F01411ADBD28F051D1D44E82A1703086CF` |
| T-0069 G7 regression | `prototype/v3-finance-ledger-projection-regressions.mjs` | `B55D0AA3CA0CCA0C2AE7E83DA7CC7E36B4CC6BFB9E550D90FE79B28F38587C96` |
| T-0109 inquiry practice | `prototype/v3/inquiry-practice.js` | `4E24D041726E196CED23DE8E6563101C23248B97F7AB72EE556242BC4F08D538` |
| T-0109 regression | `prototype/v3/a07-t0109-inquiry-practice-regressions.mjs` | `E124F7DA562C8F716C6CB22BCAC162CC8E9EE539706D442CD369FA9A8FB43ACA` |
## Reproduzierbare Befehle / Ergebnis

Aus Repository-Wurzel:

- `node prototype/v3/a05-t0065-market-ui-regressions.mjs` — PASS (A05/UIreview in CP-0510).
- `node prototype/v3/a05-t0066-product-ui-regressions.mjs` — PASS (A05/UIreview in CP-0510).
- `node prototype/v3/a05-t0067-regressions.mjs` — PASS (A05/UIreview in CP-0510).
- `node prototype/v3-t0075-annual-order-product-flow-smoke.mjs` — PASS als 12-Monats-Enginepfad, Ergebnis/Begrenzung in CP-0512.
- `node prototype/v3/a07-t0109-inquiry-practice-regressions.mjs` — PASS für Engine-/Invarianz-/Speicherabgrenzung, CP-0512.
- `node prototype/v3-finance-ledger-projection-regressions.mjs` — PASS nur im vorhandenen Kunden-Subledger-Scope, CP-0512.
- `node --check prototype/v3/run.js` und `node prototype/v3/a05-v3-run-module-graph-cache.mjs` — PASS in CP-0510.
- `git diff --check` — Exit 0; ausschließlich LF→CRLF-Hinweise (CP-0511/0512).

Browserpfade: angenommenes T-0065-Angebot und T-0066/T-0067 UI-Smokes sind in CP-0510 mit Befunden verlinkt. T-0109 tatsächlicher Klick auf richtige/falsche Antwort, localStorage-Rundlauf, Reload und Wiederanzeige bleibt nicht ausgeführt. A01s erster In-App-Browserversuch auf Port 8051 endete mit `net::ERR_CONNECTION_TIMED_OUT`. A05 bestätigte später HTTP 200 auf isoliertem Port 8055; die Windows-Browserautomation stoppte aber vor UI-Aktion, weil die aktuelle Edge-URL nicht sicher bestimmbar war. Kein Browserzustand geändert.

## Rollen- und Freigabestatus

T-0110-Matrixabdeckung ist laut bestehendem A09-Review begrenzt PASS. A04-Daten-/Änderungsgrenzenreview und A10 Liefer-/Hashmanifestreview müssen diesen aktualisierten Anhang prüfen. T-0109 Browserlücke verhindert Gesamtabschluss. Domain/Event, Runtime/API nur in dokumentiertem Slice; Schema/Persistenz `NEIN/PROPOSED`; produktive Finanzmutation `NEIN`; Release/Pages nicht freigegeben.
### CP-0514 Nachträge

- Wiederholungs-/Konflikt-/Replaysemantik der T-0109-Lernantwort ist im A01-Nachtrag `a01-t0110-t0109-traceability-addendum-cp0514.md` explizit abgegrenzt: normaler UI-Pfad nach erster Antwort ohne erneute Optionen; direkte Wiederholung erhöht `attemptCount`; Multi-Tab-/manipulierte Payloadkonflikte UNKNOWN/UNTESTED.
- Die tatsächlich erneut ausgeführten Regressionen samt Exitcodes und Konsolenausgaben sind in `a01-t0110-reproducibility-run-cp0514.md` aufgezeichnet.