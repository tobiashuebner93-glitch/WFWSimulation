# A02 – T-0081 / T-0063 G2 Same-Seed-Replay

**Status:** Ausführung PASS; unabhängiger A09-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Ticket:** T-0081 / T-0063 G2
**HEAD:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`
**Seed:** `T-0069-seed-1`
**Laufzeitgrenze:** 360 Sekunden je Einzelprofil gemäß bereits gereviewter T-0079-Grenze.

## Ergebnis

Alle vier 12-Monatsprofile wurden mit gleicher Fixture, Runner-Revision und Seed zweimal ausgeführt. Die neu gemessene Baseline stimmt pro Profil mit dem früheren T-0079-Erstlaufhash überein. Der direkt folgende Replaylauf stimmt zusätzlich im vollständigen Statehash, Tages-/Eventloghash und Monatsloghash exakt mit der Baseline überein. Alle acht Einzelruns liegen unter 360 Sekunden, enthalten 362 Tage, 12 Monatsperioden und 1.409 Run-Events.

| Profil | Baseline State-SHA | Replay State-SHA | Tages-/Eventlog-SHA (beide Läufe) | Monatslog-SHA (beide Läufe) | Laufzeit Basis / Replay | Ergebnis |
|---|---|---|---|---|---:|---|
| UPSWING | `029231d56d01316232d568644e4118fb91df0579556721f439eccdccee2d8d09` | identisch | `25b5c7eecb5cf257770d163a47edf0454c42d9bb65967e5350f99fea1d11f7e3` | `e75b8fbb7a97cd0b952284e9fbb10722b3913ce0c947eb1275f5cabec89c8a78` | 239,461 / 222,435 s | PASS |
| BOOM | `1c41f00ad68576df683f76c0a1c05ee83e0000f2ab16d87ebb11255639a93f59` | identisch | `a6acc400979a83535fcaf7c184b4371220b3bdcba0c10b70f6354b31d873631f` | `00a960ca4b13ddc0ed497217d6c540dbbcf4b22533bd35be18526c679c1caa08` | 204,646 / 202,226 s | PASS |
| DOWNTURN | `0c2bba46387e09f56cebc2b66d2ef91a55ef8e97c388833071030245326afb2a` | identisch | `ba2f78b28498b27726188b6d5f1d7687c01cc16ca12894d17ffbc1faa61003c3` | `b0fa9626d8d60bdffc13c5893e7524385766f79b907e28be3360a86f0b05383e` | 202,022 / 202,688 s | PASS |
| LOW | `496d27003dcc8b26569a7c311c0a7d219b5ddeaa2008a36372836b4aab494fce` | identisch | `90338e97a8800264f574cac498e769c6301c5535b771d795cb78bb1baf810b57` | `c46fce6ecb7b8a102ca40ac040e23d1dbe15acaa27f5365edcb6a22334ab28b9` | 222,088 / 197,547 s | PASS |

## Artefakte

- `prototype/v3-year-smoke.mjs` (SHA-256 `65068D7EBA2B2027309D38AA9BEE08BA383402256AD3ED035398BC570CB672A3`): unverändert verwendeter 12-Monatsrunner.
- `prototype/v3-t0081-same-seed-replay.mjs` (SHA-256 `F5B032DD1E1813CC55931C6E791C6E0C24ED805C6536B8357CB694074292AD67`): führt je Profil Baseline und Replay aus und vergleicht den vollständigen Statehash sowie Tages-/Monatslogs.
- `prototype/v3-t0081-same-seed-results.json` (SHA-256 `BDDFDB460001BA94AC40F3E495263702E6F7EAECF85DA3EAB227FECE37272528`): enthält vier PASS-Paare, alle Hashes, Counts und Einzel-Laufzeiten.

Die Tagesloghashes binden sämtliche Tagesdaten und Run-Event-IDs; die Monatsloghashes binden Phasen und Makro-Snapshot-Event-IDs für jede der zwölf Perioden. Der gleiche Endstatehash deckt den vollständigen zurückgegebenen Runzustand ab. Die Runnerrevision blieb während der acht Läufe unverändert.

## Prüfungen und Abgrenzung

- `node --check prototype/v3-t0081-same-seed-replay.mjs` – PASS.
- `node prototype/v3-t0081-same-seed-replay.mjs` – PASS für alle vier Paare.
- JSON-Artefakt-Prüfung: vier Profile, gleiche State-/Tages-/Monatshashes, 362 Tage, 12 Monate, je 1.409 Events und jede Einzellaufzeit unter 360 Sekunden – PASS.
- Direkter Whitespace-Scan der neuen Harness-/JSON-Dateien – PASS; `git diff --check` meldet nur vorhandene LF/CRLF-Hinweise.

Keine Produkt-, Modell- oder Laufzeitregeln geändert. Dieser Bericht bestätigt nur die T-0081 Same-Seed-Reproduzierbarkeit; T-0063 G2 wird erst nach A09-unabhängigem Review abgeschlossen. Kein Commit oder Push.

**Nächster Adressat:** A09 – unabhängiger Review der vier Replaypaare und Artefaktbindung, an A01.
