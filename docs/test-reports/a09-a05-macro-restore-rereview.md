# A09-Re-Review – A05 Makrofixture-Save/Restore

**Status:** NONPASS – Quellen-/Pfadbindung lässt sich weiterhin umgehen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Tickets:** T-0063 / T-0069
**Profil:** V3 shared run, synthetischer Makropfad, Start 2027-01-04
**Vorgänger:** CP-0324 bis CP-0326 (ENTWÜRFE)
**Entscheidungen:** D-0157, D-0159, D-0161–D-0168

## Preflight und Prüfstand

Vollständiger Preflight ausgeführt: AGENTS.md, Struktur/Rechte, Goals, aktives MG-002-Ticketboard, Collaboration State, Decision Log, CP-0324–0326, A05-Arbeitsbericht und betroffene Run-/Makrodateien. Gitbasis: HEAD 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c; umfangreicher Arbeitsbaum mit lokalen und neuen Dateien, alle fremden Änderungen erhalten.

## Ergebnis

Die Regression für die einfache Manipulation mit unveränderter Fixture-Version ist korrekt: unbekannte sourceSnapshotId wird beim Save, Restore und Tagesöffnen abgewiesen. Die vier regulären Pfade, Monatswechsel und gültiges Save/Restore bestehen.

### NONPASS 1: unbekannter Pfad mit unbekannter profileVersion fällt weiterhin still auf UPSWING

Die neue Validierung kehrt sofort zurück, wenn macro.profileVersion nicht V3_RUN_MACRO_FIXTURE_VERSION entspricht. Die gemeinsame Makrovalidierung akzeptiert jedoch beliebige nichtleere profileVersion-Werte. Wird daher sowohl sourceSnapshotId als auch profileVersion in einem BOOM-Save geändert, werden Save und Restore akzeptiert. Beim Tagesöffnen ergibt die Quell-ID-Suche undefined; buildRunMacroMonthInput behandelt undefined wegen seines Defaultarguments als UPSWING.

Reproduktion: BOOM-Run anlegen und Anfangsressourcen setzen; vor dem ersten Tag sourceSnapshotId = unknown-fixture und profileVersion = unsupported-but-nonempty setzen; createRunSaveEnvelope, restoreRunSaveEnvelope und openNextRunDay ausführen. Ergebnis: Speichern und Laden akzeptieren den Zustand; Tagesstart erzeugt Phase upswing.

### NONPASS 2: gültige alternative Quellen-ID ist nicht an die gewählte Run-ID gebunden

Ein BOOM-Run mit profileVersion V3_RUN_MACRO_FIXTURE_VERSION und sourceSnapshotId fixture-snapshot:UPSWING wird ebenfalls von Save/Restore akzeptiert, obwohl die Run-ID mit BOOM endet. Beim Tagesstart entsteht Phase upswing. Der gespeicherte Szenariopfad kann dadurch durch eine andere, formal bekannte Quelle ersetzt werden.

## Empfohlene Korrektur

A05 sollte den Makro-Fixturetyp und den ausgewählten Pfad für diesen gemeinsamen V3-Run durchgängig binden: unterstützte profileVersion verlangen, sourceSnapshotId muss dem ausgewählten Pfad entsprechen, und nicht erkannte/fehlende Pfade dürfen nicht über ein Defaultargument als UPSWING interpretiert werden. Regressionen sollten beide obigen Varianten über Save, Restore und Tagesöffnung fail-closed abdecken. Danach erneutes A09-Re-Review.

## Prüfungen

- node --check prototype/v3/run.js — PASS.
- node --check prototype/v3-run-macro-fixture-regressions.mjs — PASS.
- node prototype/v3-run-macro-fixture-regressions.mjs — PASS, jedoch deckt sie nur unbekannte sourceSnapshotId bei unveränderter Fixture-Version ab.
- node prototype/v3-run-orchestrator-regressions.mjs — PASS.
- node prototype/a05-t0069-run-ui-regressions.mjs — PASS.
- Gültiger BOOM-Zwischenspeicher, Restore und Fortsetzung bis Februar — PASS; Januar- und Februarphase bleiben BOOM.
- Zwei zusätzliche adversariale Restoreproben — NONPASS wie oben.
- Browser-/Geräte-Smoke — nicht ausgeführt.
- Produktcode unverändert; kein Commit/Push.

## Nachweisebenen

**Ausführung:** A05-Fix unabhängig geprüft; A09 änderte keinen Produktcode.
**Fachreview:** keine Makro-Fachregel geändert; A05-Eigenbericht gelesen.
**Unabhängige QA:** NONPASS wegen der beiden Restore-/Pfadbindungs-Bypässe.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** HEAD/Status und betroffene ungetrackte Dateien geprüft; kein Commit/Push.
**Nächster Schritt:** A01 beauftragt A05 mit der Quellen-/Runpfadbindung; danach A09-Re-Review.
