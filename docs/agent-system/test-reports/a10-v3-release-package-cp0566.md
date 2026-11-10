# A10 – V3-Paketprüfung zu CP-0566 (vorläufiger Build)

Datum: 2026-11-10. Adressat: A01. Goal: MG-002 / V3. Autor/Ausführung: A10. Mitwirkend: A03 (Dispo-UI vor Build fertiggemeldet). Fachreview: technischer Build-/Hashabgleich durch A10. Unabhängige QA sowie Browser-/Geräteprüfung: hier nicht ausgeführt. Keine Commit-/Pushaktion.

## Basis und Geltung

Git-Basis ist `main@fdc4960d4bf92fb13f6802e8d0738eb3d9110097`. Das Paket enthält den **dirty Working Tree** nach A03s Dispo-UI-Änderung; die Git-Basis enthält diese Quellen noch nicht. Die genaue Buildauswahl sind 28 statische Laufzeitmodule plus `run.html`/`run.css`; sämtliche 30 Quellhashes stehen in `prototype/v3-mobile-package/werkstatt-v3-mobile-manifest.json` (Manifest-SHA-256 `ebc7f86df1b610f4a33950789359958fe2e9ae08f3f0a1761b81fab96c4fc736`).

| Zentrale Quelle | SHA-256 beim Build |
|---|---|
| `v3/run.js` | `935d30a14be9ea28b1bae22f293a3ae99d522a69ada7a5e07f8960ba62d1a8d3` |
| `v3/run.html` | `6c4749a47abdf6c9c61810eea1fd7faaaeb108c2723fbc0846583fe77991d397` |
| `v3/run.css` | `7c53150f6bec37484b2462f49f4afd1b47cbdcf4bd296463dc5271bce10daaba` |
| `v3-product-lifecycle.js` | `3f503ded97afce66ed7d1ee0f56769f8a3e202c0676bdbcea07d6d80ab436559` |
| `v3-run-orchestrator.js` | `240ae3145c06f59a12c158c7f6776d1169d8dac6affd6d0e70819e49006067f5` |
| `v3-market-simulation.js` | `53a241aa54840cdd34b477d9a9895fbb740e5b4e491c49ff4feda0425e183300` |
| `v3-finance-runtime.js` | `b8e15a2b65aad70f7c51ad2dd0182328e7e1f32fa8e3c84369133d818ec86b56` |

## Sicherung und Build

Vier alte Dateien wurden vor Entfernung bytegleich mit SHA-256 abgeglichen und außerhalb des Checkouts gesichert: `C:/Users/Tobia/AppData/Local/Temp/WFWSimulation-V3-preserved-artifacts-20261110-CP0566` (721.897 Bytes, `preserved-manifest.json`). Danach wurden ausschließlich `prototype/v3/run.js.corrupt-cp0485-followup-backup` und das veraltete entpackte Paketverzeichnis `prototype/v3-mobile-package/werkstatt-v3-iphone-ipad/` aus Checkout und Index entfernt. Historische CPs/MCPs blieben unberührt.

Ausgeführt:

1. `node prototype/v3/a05-v3-run-module-graph-cache.mjs --write` — PASS, Graph `cfa8210f04001fdbd9f48b6c8afc47aff0f479cb1ae68e8a628783c7bca733a2` / 28 Module.
2. `node prototype/build-v3-iphone-package.mjs` — PASS, Spiel-HTML 1.302.657 Bytes.
3. `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` — PASS einschließlich transitive Byte-Mutation.
4. Manifestvergleich — 30/30 Quellhashes und 3/3 Artefakthashes aktuell; alle 28 eingebetteten Module bytegleich mit Quellen. `prepareV3RunHtml()` erzeugt exakt das gespeicherte HTML.
5. ZIP mittels .NET-ZIP-Leser geöffnet; genau vier Mitglieder, jedes byte-/hashgleich mit Paketdatei: Spiel-HTML, Lernanalyse-HTML, README, Manifest. Keine unerwarteten Pfade.
6. Scoped `git diff --check` — Exit 0, nur Zeilenendenhinweise.

ZIP-SHA-256: `acb44d55a9fa210e89f159a2ead9d8a07bd3f1e7379521f1fd7904d63f9fd1ae`. Spiel-HTML-SHA-256: `6005ae69cea3006133dd8e993c925bfa85c62147ca59445c219456bc171e80a3`.

## Veröffentlichung und nächster Übergabepunkt

`.github/workflows/publish-mobile-test.yml` entpackt das aktuelle ZIP, veröffentlicht dessen Spiel-HTML als Pages-`index.html` und wird auf `main` durch Änderungen dieses ZIP ausgelöst. Der Workflow wurde gelesen, kein Deployment ausgeführt.

A01 meldete nach diesem Build ein noch zu implementierendes V3-10-Mindestziel (Unternehmensausrichtungen/KPIs/Zielkonflikt). Dieser Build ist deshalb **vorläufig, nicht zur Veröffentlichung bereit**. Nach diesen Runtime-/UI-Änderungen sind Graphcache, Paket, Manifest-/ZIPvergleich und dieser dynamische Buildbericht erneut zu aktualisieren. Kein 12-Monats-Smoke ausgeführt; Nutzerverzicht ist eine Freigabeausnahme und kein Testergebnis.

Autorisierung: Runtime-/Produktänderung durch diesen Build N/A; Persistenz/Schema N/A; produktive Finanzmutation N/A; Paket-/Dateibereinigung vom A01-Auftrag gedeckt; Release durch Nutzer beauftragt, aber wegen noch offener Integration nicht ausgeführt.
