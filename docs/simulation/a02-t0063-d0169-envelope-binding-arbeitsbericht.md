# A02 – T-0063: D-0169 Day-open-/Market-Event-Bindung

**Status:** A02-Fix abgeschlossen; gezielte Regressionen und 362-Tage-Smoke PASS; unabhängiger A09-Re-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0069
**Entscheidung:** D-0169
**Profil:** gemeinsamer V3-Run ab 04.01.2027; V1/V2 unverändert
**Vorgänger:** CP-0349 A09 NONPASS; CP-0348 A03 Finance-Nichtbuchungsreview; CP-0347 vorheriger A02-Fix (unverändert); CP-0346/0345; A08 Gap-Audit CP-0351
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende Änderungen anderer Arbeitspakete erhalten.

## Preflight und Befund

Vor Bearbeitung wurden AGENTS.md, Agentenstruktur und Rechtematrix, Goals, Ticket-Board, Collaboration State, D-0169 und der aktuelle Status gelesen. Relevante Fachgrundlagen sind der A02-T-0063-Makrovertrag und A08-Quellen-/Modellgrundlage. Branch `main`, HEAD `8b72b7e`; vorbestehende lokale und ungetrackte Änderungen wurden nicht verworfen. CP-0350 war vor Erstellung nicht vorhanden.

A09 reproduzierte in CP-0349 eine koordinierte Mutation: Traces aller Vorlagen und das `schedule_week`-Ergebnis wurden auf Exposure 0 gesetzt, `scheduledWeeks` passend aktualisiert, während Makro-Snapshot und Day-open-Fingerprint unverändert blieben. Der so manipulierte Run wurde angenommen. Zusätzlich fehlte die Run-/Szenarioidentität im Nachfrage-Trace.

## Umsetzung

In `validateMacroDemandSnapshotBindings` ist nun die gesamte Provenienzkette fail-closed gebunden:

- Der Trace enthält `runId` und `scenarioId`; beide müssen der Identität des gemeinsamen Runs entsprechen.
- Der gemeinsame Makro-Run akzeptiert ausschließlich die gemäß D-0169 festgelegte Exposure `1`.
- Die geplanten Wochenvorlagen müssen exakt mit `marketWeekTemplates` aus dem unveränderten Day-open-Fingerprint übereinstimmen.
- Das Market-Modul-Schedule-Event muss dieselben Vorlagen und dieselbe Wochenperiode führen. Das `market_schedule`-Run-Event muss genau einmal vorliegen und in ID, Quelle und Ergebnis exakt dem Market-Modul-Event entsprechen.
- Der gespeicherte Trace muss in allen Vorlagen, im Modul-Resultat, im Run-Event und in der Day-open-Eingabe identisch sein. Bereits bestehende Gap-/Quellen-/Snapshotbindung an den autoritativen Makro-Monatsinput bleibt aktiv.

Die Regression bildet A09s konkreten Exposure-0-Angriff nach: bei unverändertem Day-open-Fingerprint werden Vorlagen, Schedule-Resultat und `scheduledWeeks` konsistent ersetzt. Save/Restore muss ablehnen. Ergänzend wird geprüft, dass auch die Mitmutation des `market_schedule`-Run-Events Exposure 0 nicht legitimiert. Getrennte Assertions verankern `runId` und `scenarioId` im Tracevalidator. Die D-0169-Formel, Exposure-1-Szenarioannahme, Klassen-Zuordnungslogik und Größenparameter wurden nicht geändert.

## Geänderte Dateien

- `prototype/v3-macro-demand-channel.js`
- `prototype/v3-run-orchestrator.js`
- `prototype/v3-macro-demand-channel-regressions.mjs`
- `docs/simulation/a02-t0063-d0169-envelope-binding-arbeitsbericht.md`
- `docs/agent-system/checkpoints/CP-0350.md`

## Tests und Laufnachweis

- `node prototype/v3-macro-demand-channel-regressions.mjs` – PASS. Directional draws: BOOM 274, neutral 260, LOW 256; coordinated Exposure-0-Mutation, Day-open-/Market-Event-Bindung, Tracepflicht, runId/scenarioId, Neutral-Exposure, Same-Seed-Replay, Save/Restore und Finance-Nichtmutation geprüft.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-market-simulation-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node --check` für Demand-Modul, Run-Orchestrator und neue Regression – PASS.
- `node prototype/v3-year-order-smoke.mjs` – PASS, Exit 0: 362 Tage, 12 Makroperioden, ein kontrollierter Auftrag, D-0166-Rechnung und D-0168-Zahlung. Run-/Restore-Statehash: `b116a0985efe35d57f411d4ca0eceeaeb12a6b8ba6351383e3ecbce3e305964e`.
- `git diff --check` – Exit 0; es wurden nur bereits bestehende LF/CRLF-Hinweise auf anderen geänderten Dateien ausgegeben. Paketbezogene abschließende Whitespaceprüfung steht in diesem CP.

Der Jahressmoke ist kein vollständiger Firmenabschluss-, Kosten-, Lieferanten-, Bestands-, COGS- oder Ledgernachweis.

## Nachweisrollen

- **Ausführung:** A02; fokussierte Demand-/Market-/Orchestratorregressionen und 362-Tage-Smoke PASS.
- **Fachreview:** A03 CP-0348 PASS für Finance-Nichtbuchung und Source-Binding; keine Finanzschnittstelle geändert.
- **Unabhängige QA:** A09 CP-0349 NONPASS für den jetzt adressierten Exposure-/Event-Bindungsbefund; Re-Review des Fixes ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; diese Änderung betrifft Restore-Validierung.
- **Git:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; kein Commit/Push; fremde Arbeitsänderungen erhalten.

## Grenzen und nächste Übergabe

Das ist State-Konsistenz und Herkunftsbindung, keine kryptografische Signatur gegen vollständiges Umschreiben eines lokalen Spielstands. D-0169 bleibt eine explizit synthetische V3-Szenariokonvention und erzeugt keine direkte Finanzwirkung. A08 CP-0351 dokumentiert über diese Korrektur hinausgehende fehlende Unternehmenswirkungspfade; sie sind nicht Bestandteil des engen Fixes.

**Nächster Schritt:** A01 beauftragt A09 mit unabhängiger Prüfung des Exposure-0-Repros, der Day-open-/Market-Event-Bindung und der runId/scenarioId-Tracebindung. Danach aktualisiert A01 den Status von T-0063. T-0065 und T-0069 bleiben wegen weiterer Unternehmens-, Integrations- und Releasegates offen.
