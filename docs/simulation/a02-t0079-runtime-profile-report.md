# A02-Bericht – T-0079 Laufzeitprofile und Validatoren

**Status:** 30-/90-Tage-Profile PASS; erster 12-Monatslauf NONPASS bei 240 s; ein UPSWING-12-Monatsprofil PASS unter der von A09 bestätigten 360-s-Grenze; T-0079 insgesamt PARTIAL/offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goal/Ticket:** MG-002 / SLG-002.5 / T-0069 G9 / T-0079  
**Profil/Umgebung:** Windows, Node.js v24.22.1; `prototype/v3-year-smoke.mjs`; Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**Preflight:** Alle sieben CP-0476-Control-Plane-SHA-256 erneut verifiziert; alle stimmen mit CP-0476 überein. Vorhandene Arbeitsbaumänderungen blieben unangetastet.

## Messungen

| Fenster | Ergebnis | Laufzeit | Events | State-Hash | Vollvalidierungen |
|---|---|---:|---:|---|---:|
| 30 Tage, UPSWING | PASS | 1.665,96 ms | 118 | `354996d8e795160ab7afd825735d58bbe153f9479b4f86a30df0150552d358d5` | 122 |
| 90 Tage, UPSWING | PASS | 12.663,998 ms | 351 | `e889db15e5e1150c6022a2f763c5a4172a7bec59fdd9c2b27d27c1df2da6f7f4` | 362 |
| 12 Monate, UPSWING (erster Lauf) | NONPASS: kontrolliert abgebrochen | 240,405 s; damalige harte Grenze 240 s erreicht | kein Abschlussbericht | kein Endhash | nicht verfügbar |
| 12 Monate, UPSWING (begrenzter Einzelprofillauf nach A09-Grenzreview) | PASS für dieses Profil | 242,163 s gemessene Profilzeit; unter 360 s | 362 Tage; 12 Monate; 1.409 Run-Events | State-Hash `5c8f83f48f4a2ce51ac96bd05bcd86a572f9fbc9e730ce5321e92be92e4ad038` | 1.450 Vollvalidierungen |

Die 30-/90-Tage-Hashes stimmen mit dem dokumentierten CP-0475-Profilvergleich überein. Beim ersten Jahreslauf enthielt das außerhalb des Repos gespeicherte Log nur die Startmeldung; der überwachte Node-Prozess wurde an der damaligen 240-s-Grenze beendet. Der spätere UPSWING-Einzelprofilrun wurde nach A09s Review unter einer 360-s-Grenze vollständig beendet. Der Harness protokollierte 242,163 s, 362 Tage, 12 Monats-Snapshots, 1.409 Run-Events und den obigen State-Hash. Das ist ein vollständiger synthetischer Profil-/Replay-Smoke, aber kein integrierter Unternehmens-, Finance- oder Ledger-PASS.

## Ursache / Profilbefund

Der Shared-Run-Harness führt vollständige Core-Validierungen wiederholt bei Tagesöffnung und -schluss sowie bei Initialisierung und finaler Prüfung aus. Die gemessenen Aufrufzahlen sind 122 bei 30 Tagen und 362 bei 90 Tagen; im Jahreslauf wären nach dem bestehenden Aufrufmuster 1.450 Prüfungen zu erwarten (724 Öffnungs-, 724 Schluss-, eine Initialisierungs- und eine finale Prüfung).

Die teuersten wiederholt gemessenen Prüfblöcke bleiben `macroHistory` und `macroDemandBindings`. Bei 90 Tagen summieren sie sich über Validierungsphasen auf ungefähr 3,94 s bzw. 2,82 s von 12,66 s Gesamtzeit. `macroDemandBindings` erstellt Maps je Validierungspass und prüft danach jede Wochenvorlage durch Replay gegen die maßgeblichen Makro-/Run-Ereignisse. `macroHistory` replayt Makroperioden gegen die gespeicherten Day-Open-Eingaben. Auch die übrigen Vollvalidatoren verarbeiten bei jedem Aufruf wachsende Run-/Ereigniszustände.

Eine weitere Optimierung wurde in diesem Paket nicht vorgenommen: Die vorhandene Indexierung reduziert bereits wiederholte lineare Suchen innerhalb eines Validierungspasses. Ein zustandsübergreifender Cache oder ein Auslassen von Replayprüfungen wäre ohne neue Unveränderlichkeits-/Invalidierungsbelege nicht sicher. Es wurden keine Invarianten abgeschwächt.

## Testbezogene Laufzeitgrenze – Vorschlag

Die testbezogene Obergrenze beträgt nach A09-Review **360 s pro Profil** für die V3-Jahres-Smoke-Fixture auf Windows/Node.js v24.22.1. Gegenüber der historischen Jahresbaseline von 240,069 s aus CP-0451 entspricht das einem 120-s-/50-%-Puffer. Der einzelne aktuelle UPSWING-Profillauf endete in 242,163 s. Die Grenze ist ein Testlimit, keine Produktregel oder Laufzeitgarantie.

Die übrigen drei Profile und eine Vierprofil-Replay-Wiederholung wurden nicht gestartet. T-0079 bleibt **PARTIAL/offen**: Der Auftrag verlangt vier Profilbelege; nur UPSWING ist mit Laufzeit unter der bestätigten Grenze vollständig gemessen. A09s Re-Review des neuen Messbelegs und die übrigen Profile stehen aus.

## Nachweisrollen und Änderungen

- **Ausführung:** A02; 30-/90-Tage-Microbenchmark, erster begrenzter UPSWING-Lauf mit damaliger 240-s-Grenze und zweiter UPSWING-Einzelprofilrun unter 360 s.
- **Fachreview:** A02-Analyse der Replay-/Validatorgrenze; A09 hat die 360-s-Laufzeitgrenze reviewed, Review des neuen Einzelprofil-Messbelegs ausstehend.
- **Unabhängige QA:** nicht ausgeführt.
- **Browser-/Gerätetest:** nicht ausgeführt; nicht einschlägig für diesen Harness-Lauf.
- **Git-Verifikation:** Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreicher vorbestehender Arbeitsbaum erhalten. Der T-0079-Bericht wurde mit dem späteren Messbeleg ergänzt; keine Runtime-/Harnessänderung.
- **Commit/Stage/Push:** nicht ausgeführt.

**Nächster Adressat:** A09 – vorgeschlagene 360-s-Grenze, Messumgebung und Profilgrenzen unabhängig validieren; danach A01 über den bestätigten Einzelprofilplan entscheiden lassen.
