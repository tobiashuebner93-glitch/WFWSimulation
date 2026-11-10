# A09 T-0063 – L5 Finanzierungsreferenz Re-Review (CP-0391)

**Status:** PASS im begrenzten Read-Model-/Renderer-/Nichtmutationsumfang  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Vorgänger:** CP-0390 (A05 Formatfix), CP-0389 (A09 initial NONPASS), CP-0388 (A05 UI), CP-0387 (A02 Projektion), CP-0386 (A03 Finanzreview)  
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169

## Ergebnis

A09 hat den CP-0389-Befund unabhängig nachgeprüft. Ein MRO-Level von 3,15 % wird nun ohne Pluspräfix angezeigt; das D-0022-Referenzband +0,50 bis +5,50 Prozentpunkte und der Mittelwert +3,00 behalten ihre Vorzeichen. Null wird ohne Präfix, negative Werte mit Minus dargestellt. Die Regression deckt diese Fälle ab. Damit ist der initiale Formatbefund behoben.

Die verbleibenden Grenzen bestanden erneut: ohne MRO-Quelle bleibt die Referenz `pending`; individuelle Konditionen sind weiterhin `pending` und ohne Rate. Herkunftsmetadaten bleiben escaped. Projektion/Renderer mutieren Run und Finance nicht, Save/Restore liefert dieselbe Projektion, und eine fremde Run-Identität wird von der Validierung abgewiesen. Keine Kredit-, Zins-, Cash-, Ledger-, D-0169- oder Auftragswirkung.

## Prüfungen

- `node prototype/v3/a09-t0063-financing-reference-adversarial-review.mjs` – PASS.
- `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` – PASS.
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-macro-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `git diff --check` – PASS; nur bestehende LF/CRLF-Hinweise.

## Nachweisrollen und Grenzen

- **Ausführung:** A05 CP-0390, enge Frontend-Formatkorrektur.
- **Finanzfachreview:** A03 CP-0386 bleibt PASS für die Finanzgrenze; kein neues Vertrags-/Postingreview.
- **Unabhängige QA:** A09 CP-0389 NONPASS durch diesen CP-0391 Re-Review im engeren Testumfang behoben.
- **Browser-/Gerätetest:** nicht ausgeführt. A12 CP-0385 liegt zeitlich vor der Finanzierungsreferenzkarte; neuer Desktop-/schmaler Viewport bleibt nötig.
- **Git:** Arbeitscheckout `main`, HEAD `8b72b7e`; umfangreicher bestehender Arbeitsbaum erhalten. Kein Commit oder Push.

**Nächster Schritt an A01:** A12 soll die angezeigte Karte im tatsächlichen Browser auf Desktop und engem Viewport prüfen. T-0063 bleibt IN_PROGRESS, bis die übrigen Makro-/Jahres- und Integrationsgates erfüllt sind; T-0069 bleibt offen.
