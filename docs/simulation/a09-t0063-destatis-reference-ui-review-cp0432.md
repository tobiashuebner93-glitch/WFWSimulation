# A09 – Unabhängiger UI-Review der Destatis-Referenz (CP-0432)

**Status:** PASS im UI-Code-/Regressionumfang; Browser-/Mobilgate offen  
**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goals/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 UI-Slice; Anschlüsse T-0067/T-0069 offen  
**Profil:** V3 Shared Run ab 2027-01-04; optionale historische Destatisreferenz, `NEUTRAL` bleibt Standard  
**Entscheidungen:** D-0161–D-0169, insbesondere D-0162; Quellen-/Financegrenzen aus CP-0426/0429  
**Vorgänger:** CP-0431 (A05 UI), CP-0430 (A09 Runtime), CP-0429/0428  
**Gitstatus:** nicht verfügbar; `git status --short` und `git diff --check` im autoritativen Pfad liefern `fatal: this operation must be run in a work tree`. Kein Commit/Push.

## Preflight

Für den Auftrag wurden `AGENTS.md`, Agentenstruktur/Rechte-Matrix, Goals, aktives Ticket-Board, Collaboration State, Decision Log/D-0161–D-0169, A01-V3-Arbeitsplan, CP-0428–CP-0431, A02-Bericht CP-0428, A03-Berichte CP-0429/0426, A05-UI-Bericht CP-0431, A09-Bericht CP-0430 sowie die aktuelle Run-/Reference-Projektion, UI-Dateien, Regressionen und Modulgraphgenerator gelesen. Der autoritative Pfad `C:\Users\Tobia\Documents\GitHub\WFWSimulation` ist lesbar; Git-Status/Diff-Befehle scheitern weiterhin mit dem oben genannten Gitfehler. CP-0417–0431 wurden nicht geändert. Keine Produktdatei wurde geändert.

## Ergebnis

**PASS im begrenzten UI-Scope.** Der tatsächliche UI-Renderpfad ruft `getRunProjection()` auf; diese validiert den Shared Run vor der Projektion. Die Destatiskarte konsumiert `macroTradeImpact.references[]`, niemals `effects[]`. Neutraler, fehlender oder vor Veröffentlichung nicht verfügbarer Referenzzustand rendert keine Karte oder Referenzwerte. Im A05-Test wird die valide Referenz durch den Runtimeprojektor erstellt. Ein selektierter Zustand zeigt Beobachtungsmonat, Indexbasis und die drei Gruppenwerte; Quelle, zugehöriger Pressemitteilungstermin, fehlender Zellzeitstempel, Abruf/Vintage und Revisionsstatus werden getrennt/mit erklärender Beschriftung angezeigt. Der UI-Text behauptet nicht, das Pressemitteilungsdatum sei ein GENESIS-Zellzeitstempel.

Unvertrauenswürdige Text-/URL-Proben werden escaped. Verlinkt wird nur bei HTTPS und exaktem Host `genesis.destatis.de` beziehungsweise `www.destatis.de`; ein `javascript:`-Wert erzeugt keinen Link. Links öffnen mit `noopener noreferrer`. Referenzdarstellung ist rein informativ: `effects[]` bleibt getrennt, keine Nettoangebotspreis-, L4-/Offer-, Kosten-, Finance- oder Runstateänderung. Die A05-Regressions vergleichen Run- und Financezustand vor/nach Projektion und Rendern bytegleich.

Die Formularauswahl ist ein natives, beschriftetes `<select>` mit sichtbarer Beschreibung via `aria-describedby`; Neutral ist vorausgewählt. Der Hilfetext nutzt `aria-live="polite"`. Die Referenzkarte verwendet semantisches `<section aria-labelledby>` mit Überschrift und eine Liste für die drei Gruppenwerte. Tastaturfokus ist per `:focus-visible` sichtbar. Die Werte stehen desktop in drei Spalten und unter 700 px in einer Spalte; der Inhalt ist auch bei langen Metadaten umbrechbar.

Die rendererinterne Strukturprüfung ist bewusst kein Ersatz für den Runtimevertrauenspfad: In der Anwendung gelangt die Projektion aus `getRunProjection()` zur `renderMacroSummary()`-Funktion; beliebige JSON-Referenzdaten werden nicht direkt gerendert. Die adversarialen UI-Fixtures verändern Referenzfelder ausschließlich zum Escaping-/Link-Sicherheitstest.

## Ausgeführte Prüfungen

Exit 0:

- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – PASS: neutral/selektiert/abwesend/vor Release, Metadaten/Provenienz, Effektrennung, HTML-/Link-Escaping, Finance-/Run-Nichtmutation, mobile CSS- und ARIA-Assertions.
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS: 21 statische Module und transitiver Graphhash.
- `node prototype/v3-destatis-import-price-reference-regressions.mjs` – PASS: Source-Vintage, Release-As-of, Run-/Restorebindung und Nichtbuchung.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node --check prototype/v3/run.js` und `node --check prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – PASS.
- Modulgraphgenerator zweimal read-only aufbereitet: Ergebnisse bytegleich und identisch mit vorhandenem `run.html`; 21 Module. Graphtoken `sha256-fb79ab6c9f79410739e661874faa7dfe57b1bfecfc6cd87390f5ba054f883a33`, `run.js` SHA-256 `57d34ade21f3ea6fa8a594af083bf483763ff3338258006d47f61620e0fbb104`, CSS SHA-256 `1b8acc8e2a02585f89c0dc2d3025929ea83845be54a8a758942972731a2e7285`.

## Nicht ausgeführte Prüfungen und Grenzen

Kein visueller Browser-/Mobilgerätetest, Jahreslauf, Releasegate oder Commit/Push. Gitstatus und `git diff --check` sind nicht verifiziert. Die statische UI-Regression ersetzt keine A01-Browser-/Mobilprüfung. T-0063/T-0067/T-0069 bleiben offen; weder A09 noch A05 erteilen Produkt-, Finanz- oder Releasefreigabe.

**Nächster Adressat:** A01 – Browser-/Mobilprüfung der Neutral- und Referenzzustände vor weiteren UI-/Releaseentscheidungen.
