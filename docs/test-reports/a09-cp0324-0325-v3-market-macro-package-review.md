# A09-Review CP-0324/0325 – V3 Markt, Makrofixture und iPhone-Paket

**Status:** Teilweise bestanden; NONPASS bei Makro-Save/Restore-Phasenbindung
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Tickets:** T-0063 / T-0065 / T-0069
**Start-/Zielprofil:** V3 gemeinsamer Run, Defaultstart 2027-01-04; mobiles Paket auf aktuellem Working Tree
**Vorgänger:** CP-0324 und CP-0325 (ENTWÜRFE)
**Entscheidungen:** D-0157, D-0159, D-0161–D-0168

## Preflight und Bestand

Gelesen wurden AGENTS.md, Agentenstruktur und Rechte, Goals, Ticket Board für MG-002, Collaboration State, Decision Log, CP-0324/0325 sowie relevante T-0063/T-0065/T-0069-Unterlagen und betroffene Runtime-/Builderdateien. Der Checkout war zugänglich. HEAD lautet 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c; zahlreiche lokale Änderungen und ungetrackte Dateien waren vorhanden. Keine vorhandene Datei wurde verändert oder verworfen.

## 1. Re-Review des Markt-Restorebefunds

**PASS.** Der damalige Lückenpfad wurde behoben. Beim Restore verlangt der Validator jetzt sowohl im Schedule-Template als auch in der zugehörigen Anfrage einen positiven sicheren Integer-Centbetrag. Regressionen prüfen positive 1 Cent und Number.MAX_SAFE_INTEGER sowie 0, −1, null, NaN, Infinity und Number.MAX_SAFE_INTEGER + 1. Der normale Schedule-Eintritt weist 0 ebenfalls weiter ab.

Preiswertung, Angebots-/Wettbewerberidentitäten, stabile Tie-breaks, Player-Projektion, anonymisierte Monatsaggregation und Einladungsschwellen wurden durch diesen Fix nicht verändert. Erforderliche Markt-, Orchestrator- und A05-Regressionen bestanden.

## 2. Makrofixture, Monatswechsel und Save/Restore

Die vier Fixture-Pfade UPSWING, BOOM, DOWNTURN und LOW werden in Regressionen jeweils der erwarteten Phase zugeordnet. Der erste Snapshot entsteht beim ersten Run-Tag; der nächste beim 01.02.2027. Die monatlichen Snapshotperioden sind 2027-01 und 2027-02. Save/Restore bewahrt beide Snapshots und die bekannte Fixture-ID. Die Makroeingaben sind synthetisch und die erzeugte Karte ausdrücklich als ohne Markt-, Vertrags-, Ressourcen- oder Finanzwirkung gekennzeichnet.

**NONPASS – unbekannte Makroquelle wird beim Restore still zu Aufschwung.** Reproduktion: BOOM-Run starten und Ressourcen festlegen, vor dem ersten Tag das Feld run.modules.macro.sourceSnapshotId auf tampered-unknown-path setzen, mit createRunSaveEnvelope sichern und mit restoreRunSaveEnvelope laden. Restore akzeptiert den Zustand. openNextRunDay findet danach keinen bekannten Pfad und fällt still auf UPSWING zurück. Beobachtet: RESTORE_ACCEPTED_UNKNOWN_SOURCE tampered-unknown-path, danach Phase upswing.

Damit kann eine gespeicherte Szenarioauswahl ohne Warnung von Hochkonjunktur zu Aufschwung wechseln. Das ist ein Restore-/Integritätsbefund, keine Aussage über kryptografische Dateiauthentizität. A05 sollte unbekannte sourceSnapshotId-Werte vor der Tagesverarbeitung fail-closed behandeln und eine Regression für Save/Restore mit unbekannter Makroquelle ergänzen. Danach enger A09-Re-Review.

Die sichtbare Anzeige benennt Spielpreisindex, Spielinflation und MRO als Szenario-/Testindikatoren. Der Hinweis „Synthetische, unkalibrierte Testannahme“ plus „ohne Einfluss auf Marktangebote, Verträge, Unternehmensressourcen oder Finanzen“ macht die derzeit fehlende Kausalwirkung klar. Kein finanzieller oder marktlicher Wirkungsclaim wurde in der getesteten Anzeige gefunden.

## 3. iPhone-/iPad-Offlinepaket

**Statische Integrität PASS; Geräteeignung nicht geprüft.** Der Builder ist syntaktisch gültig, sammelt den lokalen Modulgraphen und weist externe Modulimporte zurück. Das vorhandene Paket hat genau die erwarteten drei ZIP-Dateien: Einzel-HTML, README und JSON-Manifest. ZIP-Test meldet keine beschädigte Datei. Alle 15 im Manifest ausgewiesenen Quellen (HTML, CSS und Module) sowie HTML-/README-Artefakte stimmen mit ihren SHA-256-Werten überein. Die Paketrevision entspricht dem aktuellen HEAD; workingTreeSourcesIncluded: true weist zutreffend auf lokale Änderungen außerhalb eines Commits hin.

Das HTML bündelt Styles und Module; die in der Bootstrap-Routine verwendete package.invalid-URL dient nur zum Auflösen relativer Imports. Es wurde kein Netzwerkzugriff ausgeführt oder verifiziert. Physisches iPhone/iPad, Safari, Touchbedienung, lokale Datei-Module und vollständiger Spielstart wurden **nicht** geprüft. Die README nennt Safari iOS/iPadOS 16.4+ als Zielannahme, keine bestätigte Gerätekompatibilität.

## Ausgeführte Prüfungen

- node --check prototype/v3-market-simulation.js — PASS.
- node --check prototype/v3-run-macro-fixture.js — PASS.
- node --check prototype/v3-run-macro-fixture-regressions.mjs — PASS.
- node --check prototype/build-v3-iphone-package.mjs — PASS.
- node prototype/v3-market-simulation-regressions.mjs — PASS.
- node prototype/v3-run-macro-fixture-regressions.mjs — PASS im normalen Pfad; der adversariale unbekannte-sourceSnapshotId-Fall ist der oben dokumentierte NONPASS.
- node prototype/v3-run-orchestrator-regressions.mjs — PASS.
- node prototype/a05-t0069-run-ui-regressions.mjs — PASS.
- Manifest-Quell-/Artefakthashes und ZIP-Integrität — PASS.
- Direkte adversariale Restoreprobe für unbekannte Makroquelle — NONPASS wie oben.
- Browser-/Gerätetest — nicht ausgeführt.
- Kein Produktcode und keine bestehenden Berichte geändert; kein Commit/Push.

## Nachweisebenen und Übergabe

**Ausführung:** A09 hat die Prüfung ausgeführt; keine Implementierung vorgenommen.
**Fachreview:** A02-Bericht und CP-0324/0325 gelesen; kein Ersatz für A02/A05-Fachfreigabe.
**Unabhängige QA:** Markt-Restorekorrektur PASS; Makro-Restorebindung NONPASS; statische Paketintegrität PASS.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** HEAD/Status geprüft; die betroffenen neuen Dateien sind untracked; keine Commit-/Push-Aktion.
**Nächster Schritt:** A01 adressiert den Makro-Restore-Fallback an A05. Nach fail-closed Korrektur A09-Re-Review; A01 behält den Browser-/iPhone-Smoke.
