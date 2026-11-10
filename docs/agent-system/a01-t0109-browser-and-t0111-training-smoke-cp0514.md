# A01 – T-0109 Browser proof and T-0111 training UI smoke (CP-0514)

**Status:** T-0109 interaction gate evidenced; independent final QA remains required. T-0111 training UI slice implemented and smoke-tested; ticket remains open for broader acquisition path and role reviews.
**Address:** A01 – MASTER_ORCHESTRATOR
**Goals/tickets:** MG-002 / SLG-002.2 / SLG-002.4 / SLG-002.5; T-0069, T-0109, T-0110, T-0111, T-0112, T-0113
**Repository:** `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; branch `main`; HEAD `fdc4960d4bf92fb13f6802e8d0738eb3d9110097` at preflight.
**Date:** 2026-11-07

## T-0109 browser interaction evidence

A local HTTP server served the checkout on `http://127.0.0.1:8055/prototype/v3/run.html`. This isolated origin was used only for this test; no user's saved game or production data was opened or changed.

- Started the deterministic synthetic run with scenario `V3-RUN-SYNTH-01`, seed `seed-v3-001`, start date 2027-01-04.
- On 2027-01-04, opened the available customer inquiry `synthetic-customer-2027-01-04-1`, expanded the optional practice item, selected the correct answer A. The page showed positive criterion feedback and stated the action was separate from the company run.
- Reloaded the page and recreated the same scenario/seed. The 2027-01-04 practice rendered the saved answer A and its feedback.
- On 2027-01-05, opened `synthetic-customer-2027-01-04-2`, selected incorrect answer B. The page showed corrective feedback, again separate from the company run.
- Reloaded and recreated the identical scenario/seed. The first inquiry retained answer A; the second inquiry retained answer B with corrective feedback.

Observed: browser clicks, deterministic inquiry association, answer feedback, persistence across reload and rendering after reload for both correct and incorrect paths. This is a browser smoke on a local isolated origin, not a device/browser matrix test or independent QA review. Company-run invariance is covered by the focused automated regression; the browser smoke does not substitute for it.

## T-0111 training UI slice

Added a `Weiterbildung · Spielsimulation` section to the production/own-products view. It exposes only the synthetic course already defined by the competency model, shows prerequisites and outcome, allows selection of an eligible team member, and records completion in the current run. Copy explicitly states that it creates no real qualification, certificate, AEVO/authorization proof, machine access, work time, or financial effect.

Browser smoke on the same isolated test origin: chose the Zerspanungsmechaniker starter profile; opened the production tab; submitted “Spielkompetenz erwerben” for Spieler. The current run displayed “Spieler · Präzisionsdrehen Stufe 2 · 2027-01-04 (Spielkompetenz)”; a previously gated product archetype then showed the newly satisfied game-skill requirement. No legal certification or machine permission was inferred.

This closes only the visible acquisition UI slice. It does not yet provide a full training timetable/cost model, external qualification or license acquisition, machine acquisition progression, A03/A08/A09 reviews, or a complete user journey. T-0111 remains IN_PROGRESS.

## Commands and results

From repository root:

- `node --check prototype/v3/run.js` — PASS.
- `node --check prototype/v3/a05-t0111-training-ui-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0111-training-ui-regressions.mjs` — PASS.
- `node prototype/v3-product-lifecycle-regressions.mjs` — PASS.
- `node prototype/v3/a05-v3-run-module-graph-cache.mjs` — PASS (the run.html binding matches current run.js).
- `git diff --check -- prototype/v3/run.js prototype/v3/run.html prototype/v3/a05-t0111-training-ui-regressions.mjs` — exit 0; only line-ending notices.

No independent A09 review was performed in this run. No commit or push was made. The repository already contained a heavily modified staged/unstaged/untracked worktree; unrelated files were left untouched.

## Remaining gates

- **T-0109:** browser interaction gate now has evidence; ticket remains open until A09 independently reviews the current implementation and this browser report.
- **T-0110:** remains partial pending explicit A04/A10 review evidence of the current boundary/evidence package; T-0109 evidence is now available to reference.
- **T-0111:** remainder as listed above, including role reviews.
- **T-0069:** G3/T-0074, G7/T-0077, G10/T-0080 remain open per the latest board state.
- **T-0112:** offer revision/counteroffer and team projection plus finance/legal/QA reviews remain open.
- **T-0113:** GitHub Pages repository configuration/deployment verification still requires the repository setting “Pages → GitHub Actions”; not changed here.

No architecture/schema approval, legal conclusion, production-finance posting authorization, release approval, commit or push is implied.

## Source-/Testhashbindung und Versionsgrenze

Die UI-Interaktion wurde am Build vor dem späteren Restore-Validatorfix ausgeführt. Der Browser lud die damalige `run.html` mit Buildkennung `build-7bb754309027e4fa3b4b94067f74cc9f61f7df714c3601001ce9fe587d719a5e-94e333f71f8e440fe9af135974141ec441f8c51087fde7acc7bdf7ebd8d975f2-3ee9a3782a065455c37b57a84708a1802ef99bba3dd3a7422f316d21a6c44d26`. Dieser Browser-Smoke ist damit an folgende Bytes gebunden:

| Browser-Smoke-Quelle | SHA-256 |
|---|---|
| `prototype/v3/run.html` (Browserstand) | `AD8F62C969D47297638F82298AAF8E3ADAB950895F58D054BCEA9B47C07343C1` |
| `prototype/v3/run.js` (Browserstand) | `7BB754309027E4FA3B4B94067F74CC9F61F7DF714C3601001CE9FE587D719A5E` |
| `prototype/v3/run.css` | `94E333F71F8E440FE9AF135974141EC441F8C51087FDE7ACC7BDF7EBD8D975F2` |
| `prototype/v3-product-lifecycle.js` (damals indexierter Stand) | `7CC5085B804B7FDB9F6147B5FF387C805287230E8F90A7A8CE618EB2CF8A8381` |
| `prototype/v3-occupational-competencies.js` (damals indexierter Stand) | `257DA41A1A204E738481F7F634659EA4A9AD8ECD287BE99175ED02909FCE6FD4` |
| Browser-Modulgraphtoken | `sha256-3ee9a3782a065455c37b57a84708a1802ef99bba3dd3a7422f316d21a6c44d26` |

Nach dem A02-Restore-Review wurden `prototype/v3-product-lifecycle.js` und dessen Regressionen korrigiert. Der aktuelle Arbeitsbaum ist separat gebunden:

| Aktuelle Quelle/Test | SHA-256 |
|---|---|
| `prototype/v3/run.html` | `80954F0654F4100251F504F651B3DCB56A3C5541AEABEFCFD63B4F86F5871F8D` |
| `prototype/v3/run.js` | `7BB754309027E4FA3B4B94067F74CC9F61F7DF714C3601001CE9FE587D719A5E` |
| `prototype/v3/run.css` | `94E333F71F8E440FE9AF135974141EC441F8C51087FDE7ACC7BDF7EBD8D975F2` |
| `prototype/v3-product-lifecycle.js` | `E60FF057462F22E58E0AF1B458A38BC614AFFD035F446434B29354F736F1A7F6` |
| `prototype/v3-occupational-competencies.js` | `8F02D41FBCA8275A587C6C6E70BBACC731B9EFAF4F313F1AC1616C83A2BB5719` |
| `prototype/v3/a05-t0111-training-ui-regressions.mjs` | `44B74200F2CEB770B6198D3ED4E52EA652CB9D31F85972D3041A402EA6376485` |
| `prototype/v3-product-lifecycle-regressions.mjs` | `82819A543FA174FB59BAD4FE1FA5063E05B3ED586B6FE9D53AC988FE5893D9FE` |
| Modulgraphtoken im aktuellen `run.html` | `sha256-8c0d8268183e1d215486b8237b4e8f347aed7488cb539a024f2216111a9884c7` |

Die UI-Interaktion wurde **nicht** mit dem post-fix Modulgraph erneut ausgeführt; die CUA-Session meldete bei Reload `browser.user is unavailable`. Aktuelle automatische Syntax-, Lifecycle-, T-0111-UI- und Modulgraphregressionen bestehen. Der Hashunterschied betrifft die zusätzliche Restorevalidierung, nicht die sichtbare Formular-/Klicklogik. Ein Browserpass für den korrigierten Build wird ausdrücklich nicht behauptet.
