# A02 – T-0078 / T-0069 G8: Vierprofil-Recovery-Nachweis

**Status:** Ausführung PASS für alle vier Profilpaare; unabhängige A09-Prüfung der drei neuen Profilpaare steht aus. T-0078 bleibt bis A09-Re-Review offen.

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goal/Tickets:** MG-002 / SLG-002.5 / T-0078 / T-0069 G8  
**Basis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; festes Seed `T-0078-recovery-seed-1`; 2027-01-04 bis 2027-12-31; Midyear-Checkpoint 2027-06-30; Node.js v24.22.1.

## Aktuelle Baseline-/Recovery-Läufe

| Profil | Baseline (ms) | Recovery (ms) | Tage/Monate/Events je Lauf | identischer Endhash |
|---|---:|---:|---|---|
| UPSWING | 246,913.755 | 255,408.325 | 362 / 12 / 1,415 | `bdb8c1b38eb9ea3ffeb20fc3a94954a731766f9ae384e0960ebc20dd5dc00c4b` |
| BOOM | 243,186.343 | 230,668.207 | 362 / 12 / 1,415 | `e0425e059e1b6324a01cfc98ab4a56161fd521cbdb1536dd83780da0b6e3a869` |
| DOWNTURN | 222,095.408 | 235,443.453 | 362 / 12 / 1,415 | `af73b145c0b8ff3ed0be10cb6b3409d979e002e9e1e569e61d364a4afbeeb077` |
| LOW | 220,350.716 | 213,321.188 | 362 / 12 / 1,415 | `fd66caca25568c1fd0cd8769ce0b52b415bcef5fdd8b2cd7ae180ca30d639fbf` |

Each run completed within the 360,000 ms per-run limit. Each recovery serializes and restores the full run/finance envelope at June 30, validates the checkpoint hashes, continues the remaining dates, and asserts the final state/event hash equals the uninterrupted same-profile baseline. The recovery harness also checks the final envelope roundtrip and six fail-closed cases: unsupported save version, duplicate run-event ID, negative material balance, foreign-run finance state, duplicate invoice ID, and duplicate payment-event ID. Rejected candidates and the valid source envelope remain unchanged.

The profile-specific baseline hashes are persisted in `prototype/v3-t0078-recovery-baselines.json`; recovery mode verifies those hashes directly. No run-state or finance semantics were changed for these tests.

## Verification and boundaries

- `node prototype/v3-t0078-recovery-smoke.mjs --profile=BOOM --mode=baseline` — PASS, 243,186.343 ms.
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=BOOM --mode=recovery` — PASS, 230,668.207 ms; exact hash match.
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=DOWNTURN --mode=baseline` — PASS, 222,095.408 ms.
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=DOWNTURN --mode=recovery` — PASS, 235,443.453 ms; exact hash match.
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=LOW --mode=baseline` — PASS, 220,350.716 ms.
- `node prototype/v3-t0078-recovery-smoke.mjs --profile=LOW --mode=recovery` — PASS, 213,321.188 ms; exact hash match.
- Existing UPSWING pair and A09 review: `docs/simulation/a02-t0078-upswing-recovery-report.md`, `docs/agent-system/a09-t0078-upswing-recovery-rereview-cp0489.md`.
- No browser/device check. No ticket status, governance file, or engine/runtime was changed. No commit/push.

## Nachweisrollen und Übergabe

**Autor/Ausführung:** A02 – Profilbaseline und Recovery-Ausführung.  
**Mitwirkende:** keine.  
**Fachreview:** A02 – Code-/Harnessausführung; A09 erforderlich für unabhängige Abnahme der drei neuen Profile.  
**Unabhängige QA:** für BOOM/DOWNTURN/LOW noch nicht ausgeführt; UPSWING wurde bereits durch A09 in CP-0489 reviewed.  
**Browser-/Gerätetest:** nicht ausgeführt / für diese Recovery-Fixture nicht einschlägig.  
**Git-Verifikation:** Checkout `main`, HEAD unverändert; T-0078-Baselineartefakt um drei Profile ergänzt; andere lokale Änderungen blieben erhalten. Kein Stage/Commit/Push.  
**Nächster Adressat:** A09 für unabhängige Prüfung der BOOM-, DOWNTURN- und LOW-Recovery-Paare; anschließend A01 zur Gate-Abnahme.
