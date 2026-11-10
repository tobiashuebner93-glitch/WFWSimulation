# A09 T-0063 – L5 Finanzierungsreferenz Adversarialreview (CP-0389)

**Status:** NONPASS – ein Anzeigeproblem bei positiven MRO-Werten; übrige geprüfte Grenzen bestanden  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Vorgänger:** CP-0388 (A05 UI), CP-0387 (A02 Read-Model), CP-0386 (A03 Finanzreview)  
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169

## Prüfgegenstand

Unabhängiger Review der Projektion `macroFinancingReference` und der tatsächlichen `getRunProjection` → `renderMacroSummary`-Kette. Der Scope umfasst Herkunft und Status, D-0022-Referenzband, fehlende/pending Terms, Save/Restore, Run-Bindung, HTML-Escaping und Nichtmutation. Kein Release- oder Jahresgate.

## Befund

**NONPASS:** `renderMacroFinancingReference` verwendet denselben `percent()`-Formatter für den absoluten MRO-Satz wie für einen Zuschlag. Bei einer beobachteten MRO-Referenz von 3,15 % zeigt die Oberfläche `MRO-Referenz: +3,15 % p. a.`. Das führende Plus bezeichnet im direkt daneben dargestellten D-0022-Referenzband einen Aufschlag; bei einem absoluten Zinssatz ist es missverständlich. A05 sollte absolute MRO-Werte ohne Vorzeichenpräfix rendern und das Pluszeichen nur bei relativen Aufschlägen/Deltas verwenden.

Reproduzierbar über `renderMacroSummary` mit `referenceRate.valuePctPA = 3.15`, `sourceType = 'observed'` und vollständig referenziertem Zeitraum. Die bestehende A05-Regression akzeptiert derzeit die Ausgabe mit Pluszeichen und erkennt diese Unterscheidung nicht.

## Bestanden im begrenzten Umfang

- Tatsächlicher Shared-Run-Read-Model-Pfad liefert bei fehlendem MRO `pending` und keinen erfundenen Ersatzsatz.
- Individuelle Konditionen und Zinssatz bleiben `pending`/`null`; alle Effekte sind false. Das D-0022-Band +0,5 bis +5,5 Prozentpunkte samt Mittelwert +3 ist als Referenzwert, nicht als persönlicher Zins, gekennzeichnet.
- Quellenmetadaten werden HTML-escaped; hostile `<img ... onerror=...>`-Text wird nicht als Markup gerendert.
- Projektion/Renderer mutieren Run und Finance nicht. Save/Restore liefert dieselbe Projektion. Ein mutierter fremder Run-Bezeichner wird durch die Shared-Run-Validierung abgewiesen.
- D-0169, Auftrag, Bank, Ledger, Forderungen, Verbindlichkeiten und bestehende Kredit-/Dispoverträge werden nicht verändert.

## Prüfungen

- Neuer unabhängiger Repro: `prototype/v3/a09-t0063-financing-reference-adversarial-review.mjs` – PASS für die oben gelisteten Invarianten; NONPASS separat durch positive MRO-Formatierung.
- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-financing-reference-ui-regressions.mjs` – PASS, deckt den Pluszeichen-Befund nicht ab.
- `node prototype/v3/a05-t0063-macro-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `git diff --check` – PASS; bestehende LF/CRLF-Hinweise sind kein Whitespacefehler.

## Nachweisrollen und Übergabe

- **Ausführung:** A09; automatisierter adversarialer Review.
- **Finanzfachreview:** A03 CP-0386, begrenztes PASS; kein erneutes A03-Review dieser UI-Änderung.
- **Unabhängige QA:** dieses Ergebnis NONPASS bis zur A05-Korrektur und kurzem Re-Review.
- **Browser-/Gerätetest:** A12 CP-0385 war vor der neuen Karte; diese Änderung ist noch nicht im Browser geprüft.
- **Git:** lokaler Checkout `main`, Ausgangs-HEAD `8b72b7e`; umfangreicher bestehender Arbeitsbaum erhalten. Kein Commit/Push.

**Folgeauftrag an A01:** A05 soll den MRO-Level ohne Pluszeichen rendern und die A05-Regression so erweitern, dass ein positiver MRO-Level ohne Präfix erscheint, während das D-0022-Aufschlagsband weiterhin mit `+` angezeigt wird. Danach A09-Kurzre-Review und A12-Browsercheck der Karte auf Desktop/schmalem Viewport. Keine Nutzerentscheidung erforderlich.
