# A02 T-0063 – Run-Profil durch Browser-Choreografie geprüft (CP-0412)

**Status:** A02-Runtime-Reproduktion PASS; gemeldeter Browserabweichungsfall nicht durch die Node-UI-Choreografie reproduziert
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 und SLG-002.5 / T-0063; T-0067 und T-0069 angrenzend
**Profil:** V3, Start 2027-01-04, Seed `seed-v3-001`, `UPSWING`, `V3-PLAN-INDEX-SYNTH-EQUAL-1`, Laufende 2027-02-12
**Entscheidungen:** D-0162, D-0163, D-0169
**Vorgänger:** CP-0407 bis CP-0411
**Git-Basis:** `main@8b72b7e`; 349 lokale Status-Einträge beim Präflight; kein Commit/Push.

## Präflight / Scope

AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket-Board, Collaboration State, Decision Log, CP-0407–CP-0411 sowie A02-Run-/Makro- und A05-Kostenplan-Auswahlvertrag wurden gelesen. CP-0407–CP-0411 bleiben unverändert. Geprüft wurde ausschließlich, ob A02 Run-State-/Save-/Restore- oder Fixture-Event-Verarbeitung die Auswahl in der vom Browser verwendeten UI-Choreografie verliert. Keine Runtime- oder UI-Änderung war nötig.

## Regression und Ergebnis

Neue Regression: `prototype/v3/a02-t0063-browser-run-learning-choreography-regressions.mjs`. Sie bildet die A05-Choreografie in Node ab:

1. Fixture-Run mit Start 04.01.2027 und Laufende 12.02.2027 anlegen.
2. `prepareRunLearningUi()` nach dem initialen Render, nach expliziter Ressourcenerfassung und bei jedem Tages-Render aufrufen.
3. Am 04.01. eine Lernfrage beantworten und erneut rendern.
4. Tage öffnen/schließen und nach jedem Schritt rendern bis 01.02.2027.
5. Januar→Februar-Makroereignis und drei L4-Projektionen prüfen.
6. JSON Save/Restore, erneutes Lern-UI-Render und mutierte Profilauswahl prüfen.

In jeder Stufe bleibt `runState.costPlanFixtureId === 'V3-PLAN-INDEX-SYNTH-EQUAL-1'`; die Run-ID bleibt daran gebunden. Am 01.02. erscheinen BICI, Wage und Procurement jeweils als `projected`, `synthetic_fixture` und Wert 110. Restore erhält die Auswahl und Effekte. Eine Mutation der Auswahl auf `NEUTRAL` wird fail-closed abgewiesen.

Testausgabe:

```text
A02 V3 browser run/learning choreography profile-preservation regressions: PASS (renders, resources, Jan-Feb, save/restore, mutation rejection, three 110 indices)
```

Der Report enthält einen gezielten Replay-/Save-/Restore-Beleg für den A02-Pfad. Die in CP-0411 gemeldete Browser-Sicherung ohne `costPlanFixtureId` und mit allgemeinen `fixture:UPSWING...`-Ereignissen wurde durch diese Node-Reproduktion nicht erzeugt. Damit liegt für diese Abläufe kein nachgewiesener A02-Stateverlust vor. Die Ursache des realen Browserabweichungsfalls ist durch A02 nicht bestimmt; A05s separat beauftragte Modulgraph-/Cacheprüfung bleibt erforderlich.

**A05-Lesehinweis nach A02-Test:** A05 hat darauf hingewiesen, dass HTML den Hash nur für `run.js` und CSS bindet, während `run.js` 13 unversionierte ESM-Imports und der lokale SimpleHTTP-Server keine Cache-Control-/ETag-Header besitzt. Das ist eine plausible Erklärung für veraltete transitive Browsermodule, aber durch A02 nicht als konkrete Cache-Reproduktion bestätigt. Der A02-Test lief in einem frischen Node-Prozess mit dem aktuellen vollständigen Importgraph und bestand. A02 ergänzt deshalb keine UI-/Cachebindung; A05 verantwortet die Modulgraphursache separat.

## Rollen und Gates

- **A02-Ausführung:** PASS für die UI-ähnliche Node-Choreografie und den unveränderten Runtimevertrag.
- **Fachreview:** keine Accounting-Policy-/Formel-/Buchungsänderung; A03s bestehender CP-0409-Vektorreview bleibt der fachliche Nachweis.
- **Unabhängige QA:** A09-Re-Review der neuen Choreografie-Regression nicht ausgeführt; an A01 zur Beauftragung.
- **Browser-/Gerätetest:** A01s CP-0411-Ergebnis bleibt FAIL für den beobachteten positiven Browserpfad; A02 hat keinen Browserretetest ausgeführt.
- **A05:** Modulgraph-/Cacheursache bleibt separat offen; keine Entrypoint- oder UI-Datei wurde geändert.
- **Git-Verifikation:** `main@8b72b7e`; bestehende Änderungen erhalten; kein Commit/Push.

Nächster Schritt: A09 prüft die neue Choreografie-Regression unabhängig; A05 untersucht die geladene Modulgraph-/Cachekette. Danach führt A01 den Browserlauf erneut aus. T-0063, T-0067 und T-0069 bleiben `IN_PROGRESS`.

## A01/IAB-Reproduktion und Cache-Hypothese (Follow-up; 2026-11-01)

A01 hat anschließend den gleichen Fehler in einem frisch erstellten In-App-Browser-Tab unabhängig reproduziert: ausgewählte Fixture in Run-ID, aber kein `runState.costPlanFixtureId`; Januar- und Februarinput sind allgemeine `fixture:UPSWING...business_input_cost_plan`-Events mit Lag 0 und es erscheinen am 01.02. keine L4-Indizes. Anfangsressourcen waren ausdrücklich leer. Das steht im Gegensatz zur oben dokumentierten frischen Node-ESM-Reproduktion, die die gesamte A02-Run-/Lern-/Tages-/Save-Restore-Choreografie erfolgreich ausführt.

**Root-Cause-Hypothese (nicht final bewiesen):** `run.html` bindet `run.js` und CSS, aber keine transitive ESM-Abhängigkeiten. A05 hat 13 unversionierte JS-Imports und SimpleHTTP ohne Cache-Control/ETag gefunden. Ein veraltetes, gecachtes `v3-run-orchestrator.js` könnte `createV3Run` ohne `costPlanFixtureId` ausführen; aktuelles `openNextRunDay` erhält dann `undefined`, verwendet `NEUTRAL` als Fallback und erzeugt das allgemeine lag-0-Kostenkanalereignis. Ein veralteter `v3-run-macro-fixture.js` könnte zusätzlich die ausgewählte Fixture ignorieren. A05 prüft den Modulgraph-/Cachepfad separat.

**Konkrete Abhilfe als Vorschlag, nicht von A02 implementiert:** A05 bindet den vollständigen transitiven ESM-Graph konsistent an die aktuelle Version (oder setzt eine sichere No-Store-/Revalidierungsstrategie für lokale Entwicklung) und erweitert die Entry-/Cache-Regression so, dass sie den `costPlanFixtureId`-Root-State sowie das Februarereignis im gestarteten UI-Run prüft. Nach A05-Fix revalidiert A01 im frischen IAB. Falls das keinen vollständigen A02-Pfad sicherstellt, erhält A02 danach einen getrennten Implementierungsauftrag für eine fail-closed Runtimeprüfung vor dem ersten Tag, die einen fehlenden/abweichenden Profilvertrag nicht still als neutral akzeptiert.

CP-0412 bleibt unverändert; kein weiterer Checkpoint in diesem Zwischenschritt.
