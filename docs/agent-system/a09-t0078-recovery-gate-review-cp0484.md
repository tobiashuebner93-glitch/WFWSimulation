# A09 Independent Audit — T-0078 Recovery Gate (CP-0484)

**STATUS:** NONPASS for T-0069 G8 evidence at this snapshot; no ticket-status change  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**GOALS/TICKETS:** MG-002 / SLG-002.5 / T-0069 G8 / T-0078  
**BASIS:** CP-0484; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; 497 status entries

## Preflight and method

Alle sieben CP-0484-Control-Digests stimmten. Branch/HEAD und Statusumfang stimmten mit der Übergabe. A02 bearbeitet parallel T-0075 und A05 T-0070 UI; die überlappenden Runtime-, Jahreslauf- und Regressiondateien sind im gemeinsamen Arbeitsbaum untracked. Ich habe daher nur vorhandene Dateien/Berichte statisch geprüft und keine möglicherweise konkurrierenden Suites gestartet. Befunde zu diesen geteilten Pfaden gelten für den gelesenen Snapshot und können durch die laufenden Arbeiten veralten.

Maßgebliches G8-Kriterium aus dem T-0069-Minimalziel: kein Lauf endet durch technische Ausnahme, unzulässigen Negativbestand, Doppelbuchung oder unvollständigen Save/Restore; mindestens ein Save/Restore-und-Fortsetzen-Fall **je Profil**. T-0078-Unterticket konkretisiert: vollständiger fachlicher State-/Eventhash nach Restore/Fortsetzen muss zum unabgebrochenen Run passen; Fehler-/Negativbestand-/Doppelbuchungsfälle müssen fail-closed und ohne Teilmutation bleiben.

## Evidenz nach Jahresprofil

| Profil/Fixture | Vorhandene Evidenz | G8-Entscheid |
|---|---|---|
| **UPSWING — V3 Jahres-Smoke** | Neuester A02/A09-T-0079-Einzelrun: 362 Tage, 12 Monate, 1.409 Events, State-Hash `5c8f83f48f4a2ce51ac96bd05bcd86a572f9fbc9e730ce5321e92be92e4ad038`; A09 reproduzierte denselben Hash. `v3-year-smoke.mjs` vergleicht im Vierprofilmodus Same-Seed-Hashes/Tages-/Monatslogs für UPSWING, führt aber keinen Save/Restore aus. Der aktuelle 12M-Einzelprofilrun hat ebenfalls keinen Restore-/Resume-Schritt. | **FAIL (G8-Evidenz):** deterministischer Vollrun/Re-Run belegt, Recovery/Resume nicht. |
| **BOOM — V3 Jahres-Smoke** | Historischer A09-Vierprofilbericht enthält vollständigen Runhash und gleiche 362 Tage/12 Monate. Aktueller A02-T-0079-Bericht hat die drei Profile nicht neu ausgeführt. Kein profilbezogener Save/Restore-/Resume-Beleg gefunden. | **FAIL:** kein aktueller Recovery-/Resume-Beleg. |
| **DOWNTURN — V3 Jahres-Smoke** | Historischer A09-Vierprofilbericht enthält vollständigen Runhash und gleiche 362 Tage/12 Monate. Kein aktueller T-0079-Lauf und kein profilbezogener Save/Restore-/Resume-Beleg gefunden. | **FAIL:** kein aktueller Recovery-/Resume-Beleg. |
| **LOW — V3 Jahres-Smoke** | Historischer A09-Vierprofilbericht enthält vollständigen Runhash und gleiche 362 Tage/12 Monate. Kein aktueller T-0079-Lauf und kein profilbezogener Save/Restore-/Resume-Beleg gefunden. | **FAIL:** kein aktueller Recovery-/Resume-Beleg. |
| **T-0069 Ein-Auftrags-Jahresfixture** (separate integrierte Fixture; kein Ersatz für alle Profile) | `v3-year-order-smoke.mjs` serialisiert am Jahresende `createRunSaveEnvelope(run, finance)`, restauriert JSON und vergleicht vollständige Run-/Financehashes sowie 12 Makromonate, Rechnungen und eindeutige D-0168-Zahlung. A09s JSON-Re-Review berichtete gleiche Hashes. | **PARTIAL:** starker Round-trip- und Inhaltsnachweis für genau eine Fixture; Restore erfolgt am Endzustand und der Harness setzt den restaurierten State nicht fort. Kein Beleg je vier Profilen. |

Historische Same-Seed-Wiederholungen sind keine Recoveryprobe. Der Vierphasen-Smoke erzeugt keine angenommenen Aufträge, Produktleistung oder Finance-Handoffs; sein State-Hash ist daher kein vollständiger fachlicher Unternehmens-/Finance-Eventhash. Die Ein-Auftrags-Fixture belegt einen verbundenen Run-/Finance-Round-trip, aber weder Mid-run-Recovery noch vollen Ledger-/Bestandsabschluss.

## Fail-closed- und Teilmutationsbelege

Statische Sichtung vorhandener Produkt-, Run-Orchestrator- und Finance-Runtime-Regressionen zeigt gute getrennte Schutzbausteine:

- Duplikate/Replays und Payloadkonflikte werden für Tagesöffnung/-schluss, Aufträge, Receipt, Kunden-/Produktentscheidungen und Zahlungen einzeln geprüft; wiederholte Events erzeugen keine zweite Wirkung.
- Run-/Product-Restore-Validatoren verwerfen doppelte Run-Event-IDs sowie manipulierte Angebots-, Delivery-, Quarantäne-/Movement-, Receipt- und Parteienbindungen.
- Negativbestand/Materialmangel, Überbelegung und Lagerüberlauf werden vor Mutation blockiert; mindestens bei Fertigwarenüberlauf und Rückgabeüberlauf vergleichen Tests den vollständigen Ausgangszustand nach dem Fehler mit einem Deep Clone.
- Finance-Regressionen lehnen überhöhte Zahlungen gegen offene Forderung und widersprüchliche IDs/Payloads ab; der Jahres-Order-Smoke prüft genau eine Rechnung und genau eine Zahlung für seine Invoice.

Diese Tests sind komponenten-/Einzelfalltests. Es fehlt eine Recovery-Matrix, die solche absichtlich beschädigten oder doppelt eingespielten Payloads aus einem serialisierten Mid-run-Save pro Jahresprofil durch `restoreRunSaveEnvelope` und Fortsetzungslogik führt und nach Ablehnung den ursprünglichen Save unverändert belegt. Die Aussage „alle Runs fehlerfrei“ ist mangels aktueller jährlicher Runs für BOOM/DOWNTURN/LOW ebenfalls nicht frisch belegt.

## Kleinste fehlende Regressionen

1. **Je Profil (UPSWING/BOOM/DOWNTURN/LOW):** einen festen Seed und einen deterministischen Mid-run-Checkpoint wählen, den vollständigen Run-/Finance-/Product-Save serialisieren, JSON-restaurieren, ab dem nächsten Tag bis Jahresende fortsetzen und mit einem unabhängigen ununterbrochenen Referenzlauf vergleichen: vollständige fachliche Run-, Finance-, Produkt-/Material-, Monats-/Eventhashes, Event-IDs und Monatsstände müssen gleich sein. Die jährliche Laufzeitgrenze/Abbruchstatus je Profil weiter protokollieren.
2. **Restore-negative cases:** von je einem Mid-run-Save Deep Clones mit ungültiger Bestandsmenge/Materialverbrauch, doppelter Receipt-/Order-/Invoice-/Payment-ID bzw. widersprüchlichem Eventpayload bilden; Restore muss fail-closed ohne teilrestaurierten Zustand sein. Vorhandene Unit-Tests können diese Assertions verlinkt/weiterverwendet werden, ersetzen aber nicht den Save-envelope-Pfad.
3. **Resume-idempotency:** nach erfolgreichem Restore denselben letzten Tages-/Zahlungs-/Receipt-Input erneut anbieten, gleiche IDs/Payloads als No-op und geänderte Payloads als Konflikt prüfen; Run-/Finance-/Bestandsstate vor/nach Replay vergleichen.

**SCHLUSSFOLGERUNG:** Es gibt belastbare Same-Seed- und JSON-Round-trip-Evidenz für Teilfixtures sowie fail-closed Komponentenregressionen. G8 fordert Save/Restore **und Fortsetzen für jedes der vier Jahresprofile**; dieser Nachweis liegt nicht vor. Entscheidung daher **NONPASS / nicht ausreichend belegt** für T-0078/G8, ohne Aussage eines konkreten Produktdefekts. Kein Jahreslauf wurde ausgeführt.

**ÄNDERUNGEN:** Nur dieser A09-Gate-Auditbericht; keine Produkt-/Test-/CP-/Statusänderung, kein Stage/Commit/Push.
