# A05-T0063 – Vollständige Cachebindung des V3-Run-Modulgraphen

**Status:** Implementiert; Graph-, Entry- und UI-Regressionen PASS; Browser-Retest durch A01 offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A05 – FRONTEND
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0067 und T-0069 angrenzend
**Vorgänger:** CP-0411 (Browserbefund), CP-0412 (A02-Node-Choreografie; unverändert)
**Entscheidungen:** D-0162, D-0163, D-0169
**Profil:** V3, Start 2027-01-04, Seed `seed-v3-001`, `UPSWING`, `V3-PLAN-INDEX-SYNTH-EQUAL-1`, Ende mindestens 2027-02-01
**Git-Basis:** `main@8b72b7e`; 351 lokale Status-Einträge vor Bericht/Checkpoint; keine Commit-/Push-Aktion.

## Preflight und Abgrenzung

AGENTS.md, Agentenstruktur und Rechtematrix, Goals, Ticketboard, Collaboration State, Decision Log, Start-/Zielprofil, CP-0411 und CP-0412 sowie die aktuellen Run-/A05-UI- und Regressiondateien wurden geprüft. Der geteilte Checkout enthielt umfangreiche vorhandene Änderungen. Diese wurden bewahrt. A02 bestätigte während dieses Auftrags keine Änderungen an `run.js`/Runtime vorzunehmen; CP-0412 blieb unangetastet. Da CP-0412 bereits von A02 belegt war, dokumentiert A05 den Auftrag unter der nächsten freien Nummer CP-0413.

## Umsetzung

`prototype/v3/a05-v3-run-module-graph-cache.mjs` traversiert rekursiv alle lokalen statischen ES-Modulimporte aus dem `run.js`-Einstieg, hasht kanonische Modulpfade, exakte Quellbytes und Kanten und erzeugt daraus einen Graph-Buildtoken. Mit `node prototype/v3/a05-v3-run-module-graph-cache.mjs --write` wird die Import Map in `run.html` neu generiert. Sie remappt jedes der derzeit 20 Graphmodule auf denselben Pfad mit `?graph=sha256-…`; der Entry enthält zusätzlich weiterhin den exakten `run.js`-SHA-Token und den Graphhash. Die Logo-Navigation bindet Entry, Stylesheet und Graph ein. Die relative Import-Map funktioniert unabhängig vom Host-/Projektpräfix und setzt keine Cache-Header des Servers voraus.

Der Generator lehnt derzeit nichtlokale oder query-/fragmentgebundene statische Modulimporte fail-closed ab, damit keine neue ungebundene externe ESM-Abhängigkeit still durchrutscht. Der Test prüft vollständige Abdeckung der direkten und transitiven Module, die Browser-URL-Auflösung für jede Modulabhängigkeit und einen geänderten Graphhash, wenn ausschließlich Bytes eines transitiven Moduls verändert werden.

Keine Formel, Geschäftsregel, Finanz-/Ledgerwirkung, Fixturedaten oder A02-Runtime wurde verändert. Die `NEUTRAL`-Vorauswahl und das synthetische Fixtureprofil bleiben bestehen.

## Prüfergebnisse

- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – PASS; 20 Module einschließlich transitiver Modulpfade graphgebunden, reine transitive Byteänderung erneuert den Token.
- `node prototype/v3/a05-t0063-offer-sensitivity-ui-regressions.mjs` – PASS; Opt-in-/Neutral-UI bleibt unverändert und Entry/Logo folgen dem Graph-Buildtoken.
- `node prototype/v3/a02-t0063-browser-run-learning-choreography-regressions.mjs` – PASS; CP-0412-Profil bleibt durch Render, Tageswechsel und Save/Restore erhalten, 01.02.2027 liefert drei synthetische Indizes 110.
- `node --check` für Graphgenerator und beide geänderten Regressionen – PASS.
- `git diff --check` für den getrackten HTML-Einstieg und gezielte Leerraumprüfung der neuen Dateien – PASS.
- Graphgenerator `--write` wurde nach Testlauf erneut ausgeführt; der HTML-Einstieg blieb deterministisch und die Entry-Regression bestand erneut.

## Getrennte Nachweisrollen und Grenzen

- **Ausführung:** A05, obige Frontend-/Graph-Regressionen PASS.
- **Fachreview:** keine Änderung an Simulations-, Kosten-, Finanz- oder Lernregeln; A02-Node-Choreografie PASS. Ein neuer A03-Fachreview wurde mangels fachlicher Regel-/Finanzänderung nicht ausgeführt.
- **Unabhängige QA:** A09-Review dieses Cache-Fixes nicht ausgeführt.
- **Browser-/Gerätetest:** durch A05 nicht verfügbar; CUA wies keine Browser-Provider/Tabs aus. Der Browser-Retest im frischen In-App-Browser bleibt A01 überlassen und ist vor einem positiven Browsergate erforderlich.
- **Git-Verifikation:** Branch `main`, `HEAD=8b72b7e`; keine fremden Änderungen verworfen, kein Commit/Push.

T-0063, T-0067 und T-0069 bleiben `IN_PROGRESS`. Der nächste Lauf muss mit einem frischen Browserkontext die gespeicherte Root-`costPlanFixtureId`, das Januar-Fixtureevent mit Wirksamkeit ab 01.02.2027 sowie BICI/Wage/Procurement = 110 ausweisen. Falls das weiterhin nicht zutrifft, ist der Netzwerk-/Importmap-Aufruf im Browser zu erfassen; die Cachehypothese wäre dann nicht ausreichend.