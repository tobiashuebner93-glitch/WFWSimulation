# A09 unabhängiges Review – V3 Run-Modulgraph Cachefix (CP-0414)

**Status:** CONDITIONAL PASS für aktuellen statischen Modulgraph und Browserpfad; NONPASS für Fail-closed bei künftig dynamisch importierten Modulen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0067 und T-0069 angrenzend
**Profil:** V3, 2027-01-04 bis 2027-02-12, Seed `seed-v3-001`, `UPSWING`, `V3-PLAN-INDEX-SYNTH-EQUAL-1`
**Entscheidungen:** D-0162, D-0163, D-0169
**Vorgänger:** CP-0411 (Browserprofilverlust), CP-0412 (A02-Choreografie), CP-0413 (A05-Importgraphfix); alle unverändert
**Git-Basis:** `main@8b72b7e`; bestehende Änderungen erhalten; kein Commit/Push.

## Preflight und Umfang

AGENTS.md, Agentenstruktur und Rechtekarte, Goals, aktives Ticket-Board, Collaboration State, Decision Log, CP-0411 bis CP-0413, A02-/A05-Berichte sowie Importgraphgenerator, `run.html` und fokussierte Regressionen wurden geprüft. T-0063, T-0067 und T-0069 bleiben IN_PROGRESS. Es wurde kein Produktcode geändert.

## Unabhängige Prüfergebnisse

Die Tests wurden lokal erneut ausgeführt:

- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS; 20 Module erfasst, nur transitive Byteänderung wechselt den Graphhash.
- `node prototype/v3/a05-t0063-offer-sensitivity-ui-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0063-cost-plan-fixture-ui-regressions.mjs` – PASS.
- `node prototype/v3/a02-t0063-browser-run-learning-choreography-regressions.mjs` – PASS; Profil und drei 110er-Indizes bleiben nach Renders, Tagesfolge und Save/Restore gebunden.
- `node --check` für Importgraphgenerator und `run.js` – PASS.
- Generator-Determinismus: `prepareV3RunHtml()` erzeugt bytegleich das aktuelle `run.html` (20 Module, Token `sha256-77d9d84cbabe5960e0977f18b6f11e74b18c66a3b5e211b3ce76330874eab5ae`). Kein `--write` im QA-Lauf.

Die Import Map steht vor dem einzigen `type="module"`-Einstieg, alle 20 lokalen statischen Run-Module erhalten denselben Graphquery, Entry und Logo verweisen auf JS-/CSS-/Graphhash. Hashbildung bindet sortierte Modulpfade, Modulbytes und Abhängigkeitskanten. Relative URL-Auflösung ist für jeden Graphlink getestet. Ein nichtlokaler statischer Import sowie URL-Query/Fragment werden im Generator abgewiesen.

## Browser- und Zustandsbeleg

A01 führte einen frischen Browser-Tab mit dem graphgebundenen Einstieg durch, bestätigte leere Anfangsressourcen und öffnete UI-Tage 04.01.–31.01.; am 01.02. zeigte die UI drei wirksame L4-Indizes: BICI 110, WagePlanIndex 110, ProcurementPlanIndex 110, alle `synthetic_fixture`, Basis Januar, Lag 1. UI-Summary: 3 gesamt / 3 wirksam / 0 pending / 0 nicht angezeigt. Die heruntergeladene lokale Run-Sicherung bestätigt `runState.costPlanFixtureId = V3-PLAN-INDEX-SYNTH-EQUAL-1` und `currentDate = 2027-02-01`. Finance-State hat keine Events, Orders oder Invoices; Anfangsbank 10.000,00 €, Umsatz/Forderungen/SimTAX in der UI 0,00 €. Die positive Fixture ist somit nicht stillschweigend neutral und erzeugt keine Finanzbuchung.

Der frühere Browserfehler CP-0411 ist für diesen Profil-/Datums-/Browserpfad behoben. Das ist kein Jahres-, Mobil-/Tablet- oder Releasegate.

## QA-Fund: dynamische Imports werden übersehen

Der Generator `prototype/v3/a05-v3-run-module-graph-cache.mjs`, Funktion `staticImportSpecifiers`, ignoriert `import(...)` ausdrücklich mit `continue`. Im aktuellen 20-Modulgraphen wurde kein dynamischer Import gefunden; die vorhandene Lösung deckt damit den derzeitigen statischen Graph korrekt ab. Ein zusätzlich injizierter `await import("./v3-dynamic-late.js")` wurde jedoch nicht in die Import Map aufgenommen. Obwohl der geänderte Quelltext des importierenden Moduls den globalen Graphhash ändert, bleibt das dynamisch geladene Modul selbst unversioniert und sein späterer Bytewechsel kann den Graphhash nicht auslösen. Somit ist die Invalidierung bei künftigem dynamischen Import nicht fail-closed.

Das ist kein aktueller Laufzeitfehler und betrifft keine heute verwendete Importkante. Es widerspricht aber dem Ziel, neue Importformen fail-closed zu erkennen. Minimaler Folgeauftrag: A05 soll im Generator dynamische Imports (einschließlich nichtstatischer/computed Specifier) explizit ablehnen, bis sie mit vollständiger Zielauflösung in den Graphen integriert sind; Regression soll bestätigen, dass `import("./x.js")` den Build stoppt und nicht still unversioniert bleibt. Anschließend A09 gezielte Re-Review.

## Getrennte Nachweisrollen

- **Ausführung:** A05-Graph-/Entry-/UI-Tests und A02-Choreografie PASS; unabhängig wiederholt.
- **Fachreview:** keine Simulationsformel, Accounting-Policy, Fixturekomponente oder Buchungsregel geändert; A03-Re-Review nicht erforderlich.
- **Unabhängige QA:** CONDITIONAL PASS; obiger dynamischer-Import-Fund offen.
- **Browser-/Gerätetest:** A01 Fresh-Tab Desktop-IAB-Pfad PASS laut UI- und Run-Save-Nachweis; mobile/Tablet nicht ausgeführt.
- **Git-Verifikation:** Lesestatus und Testdateien geprüft; kein Commit/Push.

Nächster Adressat: A05 für den kleinen fail-closed-Generator-/Regression-Fix, danach A09 Re-Review. T-0063/T-0067/T-0069 bleiben IN_PROGRESS.
