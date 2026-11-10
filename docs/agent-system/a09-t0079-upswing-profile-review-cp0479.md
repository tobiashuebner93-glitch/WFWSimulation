# A09 Independent Review — T-0079 UPSWING Einzelprofil (CP-0479)

**STATUS:** PASS für das reproduzierte synthetische UPSWING-Laufzeitprofil allein; T-0079/G9 bleibt offen  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**GOALS/TICKETS:** MG-002 / SLG-002.5 / T-0069 G9 / T-0079  
**BASIS:** CP-0479; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; Windows / Node.js v24.22.1; `prototype/v3-year-smoke.mjs`

## Umfang und unabhängige Reproduktion

Alle sieben CP-0479-Control-Plane-Digests stimmten. Branch und HEAD entsprachen der Übergabe. Git meldete 476 Statuseinträge (Übergabe: 475); alle vorbestehenden Änderungen blieben unangetastet. Es lief kein paralleler Node-Profilprozess.

A09 startete ausschließlich `node prototype/v3-year-smoke.mjs --scenario=UPSWING`, seed gemäß Harness `T-0069-seed-1`. Da der Harness selbst keine Laufzeitgrenze durchsetzt, wurde der Prozess extern mit PowerShell `WaitForExit(360000)` überwacht; bei Überschreitung wäre der gesamte Prozessbaum beendet worden. Der Lauf endete regulär mit Exitcode 0 nach 215,042 s externer Wall-Clock-Zeit; Harness-`wallMs`: 213.568,008 ms. Die harte 360-s-Grenze wurde damit reproduzierbar eingehalten.

| Evidenz | A02-Bericht | A09-Reproduktion |
|---|---:|---:|
| Zeitraum / Tage / Monate | 2027-01-04–2027-12-31 / 362 / 12 | identisch |
| Run-Events | 1.409 | 1.409 |
| Vollvalidierungen | 1.450 | 1.450 (1 Init + 724 Open + 724 Close + 1 Final) |
| State-Hash | `5c8f83f48f4a2ce51ac96bd05bcd86a572f9fbc9e730ce5321e92be92e4ad038` | identisch |
| Laufzeit | 242,163 s | 213,568 s Harness / 215,042 s extern |

Die Laufzeitabweichung beträgt rund 11,8 % gegenüber A02s Messung; beide Runs liegen unter 360 s und erzeugen identische Eventzahl, Validierungszahl und State-Hash. Der Outcome/Hash ist damit unabhängig reproduziert; die Zeitmessung ist umgebungsabhängig und nicht identisch. Exitcode 0, vollständige 362-Tage-/12-Monatsausgabe und der identische Endhash belegen keinen Timeout oder abgeschnittenen Lauf.

Der Harness weist ausdrücklich `NOT_SUPPORTED` für Finance-/Ledger-Reconciliation aus; er erzeugt keine Finanzbuchung. Der reproduzierte PASS gilt deshalb nur für diesen synthetischen Run-/Replay-Smoke und dessen Laufzeit, nicht für Jahreswirtschaftlichkeit, Auftrags-/Produktabschluss oder Finanzabschluss.

## Gate-Grenze

Dies ist ein UPSWING-Profilnachweis. BOOM, DOWNTURN und LOW sowie die geforderte Vierprofilprüfung bleiben aus. Auch die jährliche fachliche Reconciliation ist nicht Teil dieses Harness. T-0079 und T-0069 G9 bleiben daher **PARTIAL / OPEN**; kein Ticketabschluss.

**AUSFÜHRUNG:** Ein isolierter Einzelprofilrun mit externem hartem 360-s-Wächter.  
**ÄNDERUNGEN:** Nur dieser A09-Bericht; keine Produktdatei, kein Statuswechsel, kein Stage/Commit/Push.
