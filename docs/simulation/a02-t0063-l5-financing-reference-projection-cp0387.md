# A02 T-0063 L5 – MRO-Finanzierungsreferenz im Shared Run (CP-0387)

**Status:** Projektion implementiert; sichtbare UI-Integration und unabhängige Review stehen aus
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063
**Vorgänger:** CP-0386 (A03-Finanzreview), CP-0385 (A12 Browser-Playtest)
**Start-/Zielprofil:** V3 Shared Run, 2027-Profil; Projektion jeweils aus dem letzten Macro-Monatssnapshot
**Entscheidungen:** D-0022, D-0100–D-0102, D-0163, D-0169

## Ergebnis

Der normale Shared-Run enthielt noch keinen separaten L5-Finanzierungsreferenz-Read-Model. Der MRO-Indikator war vorhanden; der autorisierte Aufschlagskorridor und die ausdrücklich offene Individualkondition waren dort jedoch nicht zusammen abfragbar. `projectV3FinancingReference` ergänzt deshalb einen deterministischen, reinen Read-Model-Ausgang und `getRunProjection` stellt ihn als `macroFinancingReference` bereit.

Die Projektion bindet Run-/Szenario-ID, Beobachtungsperiode, MRO-Wert, Quellentyp/-referenz, Beobachtungs-/Wirksamkeitsdatum, Veröffentlichung, Vintage, Snapshot-ID, Lag und gegebenenfalls Szenarioformel. Sie weist den D-0022-Korridor **0,5 / 3,0 / 5,5 Prozentpunkte** ausdrücklich als genehmigten **Referenzbenchmark** aus. Individualaufschlag und individueller Nominalzins bleiben `pending`/`null`; die Faktoren aus D-0022 werden benannt, aber nicht in eine unbestätigte Bewertungsformel umgerechnet.

Wenn der Shared Run noch keinen MRO-Snapshot hat, wird der Zinssatz als nicht verfügbar und der Einzelfall als `pending` geliefert. Es wird weder ein Null- noch ein synthetischer Standard-MRO erzeugt. Kredit, Vertragsannahme, Rate, Auszahlung, Schuld, Zinsaufwand, Zahlung, Cash, Forderung/Verbindlichkeit, Bestands-/Altvertragswirkung, Dispo und D-0169 bleiben unverändert. Die Projektion wird beim Lesen berechnet und nicht in den autoritativen Run- oder Finanzzustand geschrieben.

## Geänderte Dateien

- `prototype/v3-financing-reference.js`
- `prototype/v3/run.js`
- `prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs`

## Prüfungen

- `node prototype/v3/a02-t0063-mro-financing-reference-regressions.mjs` – PASS (fehlender MRO bleibt pending; beobachteter MRO wird provenance-gebunden ausgegeben; D-0022-Benchmark ist Referenz; keine Personalkondition/Finanzwirkung; Eingabestate unverändert).
- `node prototype/v3/a05-t0063-macro-impact-ui-regressions.mjs` – PASS (bestehender UI-/Projektions-Repro; 5.000 ETA-Zeilen begrenzt auf 20 Karten/12.604 HTML-Zeichen).
- `git diff --check` – PASS; nur konfigurierte LF/CRLF-Hinweise.
- Browser-/Gerätetest, unabhängige A09-QA, vollständiger Jahres-/Finanzabgleich, Commit/Push – nicht ausgeführt.

## Noch offen / nächster Schritt

Der Run-Read-Model-Ausgang ist verfügbar, aber `renderMacroSummary` rendert ihn noch nicht. A01 soll A05 mit einer UI-Integration gegen `macroFinancingReference` beauftragen: MRO-Wert samt Quelle/Periode/Vintage, Benchmarkkorridor als Referenz und klarer Status „individuelle Konditionen offen“; `pending` muss ohne MRO sichtbar bleiben. Danach A09 auf Provenienz, Escaping, Quellenstatus, Nichtbuchung und D-0169-Invarianz reviewen lassen. CP-0386s Grenze zur Berechnung individueller Zinsen und Kreditbedingungen gilt weiterhin. T-0063/T-0069 bleiben IN_PROGRESS.

## Nachweisrollen

- **Ausführung:** A02 implementierte die reine Projektion und den Shared-Run-Read-Model-Ausgang.
- **Fachreview:** A03 CP-0386 (begrenzt PASS; vor Umsetzung); keine Prüfung des neuen Codes.
- **Unabhängige QA:** nicht ausgeführt.
- **Browser-/Gerätetest:** A12 CP-0385 deckt den vorherigen Desktopstartpfad ab; dieser neue Read-Model-Ausgang war nicht sichtbar und wurde nicht browsergetestet.
- **Git-Verifikation:** lokaler dirty checkout beibehalten; kein Commit/Push.

