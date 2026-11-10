# Nachtrag zu A02 CP-0407: expliziter kombinierter L4-Altvektor

**Status:** Testnachweis ergänzt; unabhängige QA ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Ziel/Tickets:** MG-002 / SLG-002.2 und SLG-002.5 / T-0063; T-0067 und T-0069 angrenzend
**Profil:** V3, Startlauf ab 2027-01-04
**Vorgänger:** CP-0407 und Review-Synthese CP-0408
**Entscheidungen:** D-0162, D-0163, D-0169
**Git-Basis:** `main@8b72b7e`; 345 lokale Status-Einträge vor diesem Nachtrag.

## Korrektur des Nachweisstands

Der A02-Bericht zu CP-0407 behauptete, die Regression bestätige bereits den kombinierten Altvektor Material 110 / Logistik 120 → Procurement 115. CP-0408 stellte fest, dass vor diesem Nachtrag nur getrennte Einzelvektoren direkt getestet waren. Die Behauptung eines bereits vorhandenen kombinierten Assertions war damit nicht belegt. CP-0407 bleibt unverändert; dieser Nachtrag ergänzt den fehlenden Testbeleg.

In `prototype/v3-business-cost-plan-index-regressions.mjs` wird nun der kombinierte Vektor mit Basis 100, gleichen Gewichten von 25% und Januar-2027-Periode direkt geprüft:

- Material 110, Energie 100, Lohn 100, Logistik 120
- BICI: `(110 + 100 + 100 + 120) / 4 = 107.5`
- Procurement nach Material-/Logistik-Teilgewichtnormalisierung: `(110 + 120) / 2 = 115`
- Wage: `100`

Die vorhandene Berechnungsformel und die neue CP-0407-Demo-Fixture werden nicht geändert. Es wurde keine Produktentscheidung ergänzt.

## Ausführung und Ergebnis

Befehl: `node prototype/v3-business-cost-plan-index-regressions.mjs`

Ausgabe:

```text
V3 business cost plan index regressions: PASS (neutral default, basis 100, hand-calculated BICI/Wage/Procurement, one-month lag, pending invalid inputs, replay/restore, finance/run non-mutation)
```

Fokussierter `git diff --no-index --check` auf die ungetrackte Testdatei meldete keine Whitespacefehler; Git gab nur den konfigurierten LF-zu-CRLF-Hinweis aus. Der Vergleich gegen `/dev/null` hat erwartungsgemäß Exit 1, da die ungetrackte Datei Inhalt enthält. Kein Runtime-/UI-Code geändert.

## Rollen / offene Gates

- **Ausführung:** A02; Regression ausgeführt und bestanden.
- **Fachreview:** A03 hatte für CP-0407 einen CONDITIONAL PASS gegeben; dieser Nachtrag ergänzt den fehlenden Rechennachweis, wurde von A03 noch nicht erneut geprüft.
- **Unabhängige QA:** A09-Re-Review dieses Testnachtrags ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; positive Browserauswahl/Flow bleibt bei A05/A01 ausstehend.
- **Git-Verifikation:** Branch `main`, `HEAD=8b72b7e`; kein Commit/Push. CP-0407 wurde nicht verändert.

**Nächster Schritt:** A09 prüft die neue Assertion unabhängig. Danach folgen der separat offene A05-UI-/Entrypoint-Hash-Handoff und A01-Browser-Smoke gemäß CP-0408.
