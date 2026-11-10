# A05-Arbeitsbericht – CP-0381 Makro-Projektions-UI

**Status:** UI-Fix und gezielte Regressionen PASS im abgegrenzten Umfang; unabhängiger Re-Review und Browser-/Gerätetest offen
**Datum:** 2026-11-01
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A05 – FRONTEND
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, Anschluss T-0065/T-0066/T-0067/T-0069
**Start-/Zielprofil:** V3 Shared Run; Standard 04.01.2027–29.01.2027; Regressionen mit Februar 2027-Run, 5.000 ETA-Effekten und beobachtetem L4-Scope
**Entscheidungen:** D-0161–D-0169; insbesondere D-0169 Gesamtanfrageninvariante
**Vorgänger:** CP-0380 (A09 adversarial UI NONPASS), CP-0379
**Arbeitsbasis:** Paket `a05-macro-impact-ui-cp0379`, ohne `.git`

## Ergebnis

Der Renderer begrenzt die initiale Makro-Projektionsausgabe auf höchstens 20 Detailkarten insgesamt. Vor der Ausgabe erzeugt er nur die ausgewählten Karten; weitere Effektobjekte werden weder als HTML noch als versteckte Zeilen ausgegeben. Für L2, L3/L6 und L4 zeigt die UI jeweils Gesamtzahl, wirksame Anzahl und `pending`-Anzahl. Pro Kanal nennt sie außerdem die Zahl nicht angezeigter Einträge; eine globale Restzahl fasst diese Summen zusammen. Die Kartenauswahl reserviert mindestens eine sichtbare Detailkarte pro nichtleerem Kanal, bevor weitere Karten verteilt werden.

Die pauschale Aussage „synthetische Indikatoren“ wurde durch eine quellenneutrale Einleitung ersetzt. Jede Karte kennzeichnet die Quelle als synthetische Planprojektion, beobachtete Planprojektion oder nicht klassifizierten Quellentyp; außerdem stehen „Planprojektion“ und „nicht gebucht“ direkt an jeder Karte. Ein gültiger beobachteter L4-Shared-Run wird als beobachtet und nicht als synthetisch ausgewiesen.

Die Regression führt den CP-0380-Lastfall als echten Shared Run mit 5.000 gültigen offenen Sendungen und 5.000 ETA-Effekten aus. Das Ergebnis enthält 20 Detailkarten und 12.634 Zeichen HTML, inklusive Kanalzusammenfassungen und Restzahl. Der beobachtete L4-Fall läuft durch den Shared-Run-Projektor mit PublishedAt, Beobachtungsperiode, Vintage, Snapshot, Quelle und Treiberbindungen. Bestehende Neutral-/Pending-/Escaping-/D-0169-/Run-/Finance-Nichtmutationsgates bleiben enthalten.

## Geänderte Dateien

- `prototype/v3/run.js` – begrenzte Kartenrenderung, Kanal- und Restzusammenfassungen, quellentypgerechte Kartenlabels.
- `prototype/v3/run.css` – Styles für Kanalzusammenfassungen und begrenzte Detailkarten.
- `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – 5.000-ETA-Repro, echtes beobachtetes L4-Fixture, Bytegleichheit und bisherige UI-Gates.
- `docs/simulation/a05-t0063-macro-impact-ui-cp0381.md` – dieser Bericht.
- `docs/agent-system/checkpoints/CP-0381.md` – CP-Entwurf.

Änderungen sind auf das beauftragte Paket beschränkt. Keine Modell-/Finance-Logik, kein Shared-Run-Projektor und keine Finanzzustände wurden geändert. Keine Datei unter `sources/` oder außerhalb des Pakets wurde geändert.

## Prüfungen

Mit Exitcode 0 bestanden:

- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – 5.000 gültige ETA-Effekte; 20 Detailkarten; 12.634 HTML-Zeichen; valider observed L4-Projektionspfad; neutrale/aktive Darstellung; escaped hostile HTML; pending; getrennte L4-Indizes; Run-/Finance-Bytegleichheit; D-0169-Gesamtzahl.
- `node prototype/v3/a05-t0069-run-ui-regressions.mjs`.
- `node prototype/v3/a05-t0064-ui-regressions.mjs`.
- `node prototype/v3/a05-t0063-macro-regressions.mjs`.
- `node prototype/v3-run-macro-fixture-regressions.mjs`.
- `node prototype/v3-run-operating-impact-regressions.mjs`.
- `node prototype/v3-run-orchestrator-regressions.mjs`.
- `node prototype/v3-macro-simulation-regressions.mjs`.
- `node prototype/v3-macro-demand-channel-regressions.mjs`.
- `node prototype/v3-macro-trade-impact-regressions.mjs`.
- `node prototype/v3-macro-policy-impact-regressions.mjs`.
- `node prototype/v3-business-cost-plan-index-regressions.mjs`.
- `node prototype/v3-finance-runtime-regressions.mjs`.
- `node --check` für `prototype/v3/run.js` und `prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs`.
- Whitespaceprüfung aller geänderten Dateien.

## Nachweisrollen und Grenzen

- **Ausführung:** A05; angeforderte Regressions-, Syntax- und Whitespaceprüfungen PASS.
- **Fachreview:** nicht ausgeführt; A02/A03-Verträge und A09-Befunde CP-0380 gelesen, keine Fachregel geändert.
- **Unabhängige QA:** CP-0380 war NONPASS; erneuter A09-Review ist noch nicht erfolgt.
- **Browser-/Gerätetest:** nicht ausgeführt; A12 folgt erst nach A09-Re-Review.
- **Git-Verifikation:** nicht verfügbar; Paket ohne `.git`. Kein Commit/Push.
- **Jahres-/Release-/Gesamtfreigabe:** nicht geprüft oder behauptet; T-0063/T-0069 bleiben IN_PROGRESS.

**Nächster Schritt:** A01 übernimmt Bericht und Paketänderungen; A09 re-reviewt CP-0380-Repros und bisherige PASS-Gates, danach A12 Browser-/Gerätetest.
