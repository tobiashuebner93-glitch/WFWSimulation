# A01 – T-0066/T-0067-Regressionen gegen Mindestziele

**Status:** Baseline-Regressionen PASS; neue Minimalziele weiterhin NICHT ERREICHT
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agentenrolle:** A09-ähnlicher lokaler Regressionlauf durch A01; nicht unabhängig
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0066 / T-0067
**Profil:** vorhandene V3 synthetische Regressionfixtures
**Vorgänger:** CP-0437/0438; D-0162; A03 Evidenzvertrag CP-0341/0344

## Ausgeführt

Node v24.22.1 führte aus:

- `prototype/v3-product-lifecycle-regressions.mjs` — PASS
- `prototype/v3-financial-calculation-regressions.mjs` — PASS
- `prototype/v3-finance-runtime-regressions.mjs` — PASS
- `prototype/v3-run-orchestrator-regressions.mjs` — PASS

## Aussagekraft

Die vorhandenen Regressionen belegen vorhandene Produkt-Zeit-/Kapazitätsregeln, Angebots-/BAB-Arithmetik, FinanceRuntime-Grundverhalten und Shared-Run-Choreografie. Sie liefern keinen Nachweis für die neuen Minimalziele: der T-0066-Produktlebenszyklus ist nicht als Eigenprodukt-Aktionsablauf in der Shared-Run-Oberfläche verfügbar; ein Eigenproduktverkauf mit belegter Käuferabnahme und mengenmäßiger Fertigwarenreduktion ist nicht integriert. Keine Tests belegen zwei Eigenprodukte vom Ideenstatus bis zum Absatz samt kombiniertem Kundenauftrag oder deren Planwirtschaftlichkeit über T-0067. Für T-0067 sind die vorhandenen DB-/BAB-Vektoren ein bestandener Teil, aber die geforderte Integration mit T-0066-Produktkalkulation, tatsächlichen Periodenbelegen und vollständigem Finanzabgleich fehlt.

Der A03-Rollenreview in CP-0438 war eine Prüfung der Zieldefinition und keine unabhängige Code-/Finance-Abnahme. Kein A09-Unabhängigkeits-PASS, kein Browser-/Mobil-, Jahres-, Ledger- oder Release-PASS wird daraus abgeleitet.

## Ergebnis / nächster Schritt

T-0066 und T-0067 bleiben `IN_PROGRESS`. Die Regressionen zeigen keinen neuen Fehler, reichen aber nicht zum Abschluss. Nächster konkreter Schritt: A02 integriert Produktangebot/angenommenen Auftrag, Fertigwarenreservierung und Abgang ausschließlich nach belegter Käuferabnahme mit Mengenreconciliation und `COGS=pending`; danach A03-Code-Re-Review, A05-Bedienoberfläche, A09 unabhängige Grenzfallprüfung und A01 Browser-Smoke. Kein Commit/Push.
