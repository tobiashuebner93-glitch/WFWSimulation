# A09-Review T-0065 – Adversarialprüfung der V3-Referenzpreiswertung

**Status:** NONPASS – Restore-Validierung lässt einen ungültigen Anfrage-Referenzpreis zu
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2
**Tickets:** T-0065 / T-0069
**Profil:** V3 gemeinsamer Run, operativer Start 2027-01-04
**Maßgebliche Entscheidungen:** D-0159, D-0162, D-0165–D-0168
**Vorgänger:** CP-0321 (ENTWURF)

## Preflight und Bestand

Gelesen wurden AGENTS.md, Agentenstruktur und Rechte, Goals, Ticket Board im aktiven MG-002-Kontext, Collaboration State, Decision Log, CP-0321, T-0065-Marktrahmen, A02-Arbeitsbericht und geänderte Marktdateien. Gitstatus/Diff wurde geprüft. Die Marktengine, Regressionen und A02-Bericht liegen untracked im bereits umfassend geänderten Arbeitsbaum; keine Änderung wurde verworfen oder verändert.

## Review der Preiswertung

Die Scoreformel lautet:

priceScore = 2 × referencePriceCents / (referencePriceCents + netPriceCents)

Für gültige Preiswerte ist sie monoton fallend bezüglich des Angebotspreises: ein niedrigerer Preis erhöht den Preis-Score. Bei Angebot gleich Referenzpreis ist der Teilscore 1, bei Nullpreis 2; bei wachsendem Angebot nähert er sich 0. Der Summand bleibt bei positiven Referenzpreisen endlich und definiert. Die Komponente ist relativ zum Anfrage-Referenzpreis, nicht relativ zu den gerade abgegebenen Geboten.

Die Runtime validiert Angebotspreise und Wettbewerberprofile als nichtnegative sichere Ganzzahlen. Angebotswerte unter 0, null statt Zahl, NaN und Infinity werden dadurch abgewiesen. Referenzpreise werden beim normalen Wochenplan ebenfalls als positive sichere Ganzzahlen validiert. Der Qualitätsanteil aus Ruf und Segment-Fit bleibt in der gewichteten Summe bestehen. Der Zuschlag verwendet bei Scoregleichheit stabil Firm-ID und danach Angebots-ID als Tie-break.

Angebots-/Wettbewerber-IDs, unveränderlicher Snapshot, Player-Projection, Anonymisierung der Konkurrenzangebote und Mindeststichprobe des Monatsberichts wurden durch die vorhandenen Runtime- und Run-UI-Regressionen nicht als verändert erkannt. Bestehende Jahres-/Run-Flows werden nicht direkt durch die reine Scoreformel verändert; ein eigenständiger Jahreslauf mit mehreren akzeptierten Marktgeboten wurde im Rahmen dieser gezielten Review nicht durchgeführt.

## Blockierender Befund: Restore akzeptiert ungültigen Referenzpreis

Die Eintrittsvalidierung beim Planen lehnt referencePriceCents = 0 ab. Der Zustandsvalidator prüft bei wiederhergestellten Zuständen aber nur, ob der Referenzpreis der Anfrage dem Wert im protokollierten Template entspricht. Er verlangt dort nicht erneut eine positive sichere Ganzzahl. Dadurch kann eine konsistent manipulierte Restore-Datei die Validierung passieren und einen ungültigen Preis in die Scoreformel geben.

### Reproduktion

1. Einen gültigen V3-Marktzustand erzeugen und eine Woche mit einer Anfrage und positivem Referenzpreis planen.
2. Im gespeicherten Zustand im Schedule-Event-Payload den Template-Referenzpreis auf 0 ändern.
3. Den dazugehörigen inquiry-Referenzpreis auf 0 ändern.
4. Das gespeicherte scheduledWeeks-Template-Abbild mit demselben kanonischen Payload aktualisieren.
5. validateV3MarketState(state) aufrufen.

Ergebnis: Validator kehrt erfolgreich zurück (A09-Repro-Ausgabe: RESTORE_VALIDATED_ZERO_REFERENCE). Ein Null-Referenzpreis zusammen mit Nullangebot macht den Preis-Score zu NaN; damit wird die Preiswertung undefiniert und kann im Sortiervergleich auf den Firmen-ID-Tie-break zurückfallen.

Die Reproduktion ändert nur einen isolierten In-Memory-Testzustand, keine Repositorydatei. Sie zeigt keine kryptografische Manipulation oder Authentizitätsschwäche über den dokumentierten lokalen Restore-Scope hinaus; sie zeigt eine Lücke in der internen Zustandsinvariante.

### Empfohlene Behandlung

A02 sollte die Wiederherstellungsvalidierung derselben fachlichen Preisgrenze unterwerfen wie den Eintrittspfad: Template- und Inquiry-Referenzpreise müssen positive sichere Ganzzahlen sein. Danach sollten Regressionen Null-/negative-/nicht numerische Referenzpreise in wiederhergestellten Zuständen sowie Grenzwerte bis Number.MAX_SAFE_INTEGER abdecken. A02 allein behebt den Befund, da er die Marktengine verantwortet; A09 führt danach ein gezieltes Re-Review aus.

## Prüfungen

- node --check prototype/v3-market-simulation.js — PASS.
- node --check prototype/v3-market-simulation-regressions.mjs — PASS.
- node prototype/v3-market-simulation-regressions.mjs — PASS.
- node prototype/v3-run-orchestrator-regressions.mjs — PASS.
- node prototype/a05-t0069-run-ui-regressions.mjs — PASS.
- Gezielte Restore-Probe — NONPASS wie oben reproduziert.
- git diff --check für die benannten A02-Dateien gibt keine Meldung aus; die Dateien sind untracked und werden daher von git diff nicht inspiziert. Direkte Whitespaceprüfung: Marktcode und Regression sauber; A02-Bericht enthält absichtliche Markdown-Zeilenumbruch-Leerzeichen.

## Nachweisebenen

**Ausführung:** Nicht durch A09 implementiert; kein Produktcode geändert.
**Fachreview:** A02-Eigenreview PASS im Arbeitsbericht; A09 fand die Restore-Grenze, daher kein unabhängiges Gesamt-PASS.
**Unabhängige QA:** NONPASS ausschließlich für die Restore-Invariante; andere angeforderte Testläufe PASS.
**Browser-/Gerätetest:** Nicht ausgeführt; A01 übernimmt den angefragten Browser-Smoke.
**Git-Verifikation:** Status/Diff geprüft; Dateien untracked; kein Commit/Push.

## Offene Punkte und nächster Schritt

Keine Nutzerentscheidung erforderlich. A01 adressiert den Restore-Validator-Befund an A02 zur Korrektur und beauftragt A09 anschließend mit einem engen Re-Review. Bis dahin ist die T-0065-Scorekorrektur nicht vollständig QA-bestätigt.
