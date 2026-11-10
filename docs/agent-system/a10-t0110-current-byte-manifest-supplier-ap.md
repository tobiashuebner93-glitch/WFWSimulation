# A10 – T-0110 aktuelles Arbeitsbaum-Manifest: Supplier/AP

**Status:** Neuer lokaler Arbeitsbaum-Nachweis; noch nicht unabhängig reviewt.  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Goal/Tickets:** MG-002 / SLG-002.5 / T-0110; Traceability T-0109 und Supplier/AP-Slice T-0077  
**Autor/Ausführung:** A10 – DEVOPS_INFRASTRUCTURE  
**Branch/HEAD:** `main` / `fdc4960d4bf92fb13f6802e8d0738eb3d9110097`  
**Statusumfang:** 754 vorhandene Statuszeilen vor diesem Bericht; mehrere gelistete Dateien sind staged und zusätzlich working-tree-modified. Alle folgenden Hashes sind ausdrücklich SHA-256 der lokalen Arbeitsbaumbytes, nicht Index-/Commit- oder Remote-Hashes. Dieser Bericht selbst ist neu und lokal/uncommitted.

## Historische Nachweise

CP-0513, CP-0514, CP-0524 und frühere Byte-Manifeste bleiben unverändert. Der frühere Bericht `a10-t0110-current-byte-manifest-cp0524.md` enthält einen inzwischen überholten Arbeitsbaumhash für `run.js`/`run.html`; er bleibt historische Evidenz. Dieses neue Manifest ist der aktuelle Nachtrag nach der Supplier/AP-Änderung von T-0077 und ersetzt keine CP-Datei.

## Aktuelles Arbeitsbaum-Manifest (SHA-256)

### T-0109 / T-0110 Lern- und Run-Nachweis

| Zweck | Datei | Arbeitsbaum-SHA-256 |
|---|---|---|
| Anfrage-Übungsfortschritt | `prototype/v3/inquiry-practice.js` | `4E24D041726E196CED23DE8E6563101C23248B97F7AB72EE556242BC4F08D538` |
| Run-UI und Ereignishandler | `prototype/v3/run.js` | `8408DFAA428A712EE1EBEE073638D1D316287546B052265329922566E32FCEF4` |
| HTML-Einstieg / Modulgraph | `prototype/v3/run.html` | `1A2D73B347BD10DF53DDEF6E301A0D83F1AFF638B43871DBE6B0C5A69ADFCE20` |
| T-0109 fokussierte Regression | `prototype/v3/a07-t0109-inquiry-practice-regressions.mjs` | `E124F7DA562C8F716C6CB22BCAC162CC8E9EE539706D442CD369FA9A8FB43ACA` |
| Lernlauf-State | `prototype/v3-learning-runtime.js` | `5594526FE2E9B13998FAA8F5A2F156DB636F037D97A9A3AE12C185AD54E68AAD` |
| Run-Anbindung | `prototype/v3-learning-run-adapter.js` | `F4E263D8245010DD1F7DE6B0543B24AA1483C877FAC399773207D9B81DA69BEA` |
| Lernlauf-Regression | `prototype/v3-learning-runtime-regressions.mjs` | `2BA038A65F3644695AA1AF5CEFE0F9ED944D481A347C05AA9D86B733D146BDFB` |
| Run-Adapter-Regression | `prototype/v3-learning-run-adapter-regressions.mjs` | `78D27B804926E616E0A29AD8C2F20E155D82DF35AD67151E2C4877374E31C623` |

### Supplier/AP-/Wareneingangs-Slice

| Zweck | Datei | Arbeitsbaum-SHA-256 |
|---|---|---|
| Supplier-AP-Subledger, Rechnungs- und Zahlungsevidenz | `prototype/v3-finance-runtime.js` | `EDBC753F63DFD6D4001599FAB87AABB79BE92C32F042DBBAE6FE0FC4677E4AA6` |
| AP-/Zahlungs- und Reconciliation-Regressionen | `prototype/v3-finance-runtime-regressions.mjs` | `C4C68F192CFC0CBBFD686EAC74107B7984DD182686B85B2ECE19C752E8E91354` |
| Lieferantenangebot, Bestellung, Receipt und Invoice-Evidence im Produkt | `prototype/v3-product-lifecycle.js` | `F562B6018C337D281F38F7497C00E530A1621DF60933255CCE67AD6B90E69832` |
| Product-Lifecycle-Regressionen | `prototype/v3-product-lifecycle-regressions.mjs` | `691292B941756C69A20DEBD5AB13EB8789D6D8D618868E8FDD2AF4C4F57C454B` |
| Supplier-/Receipt-Handoff im Shared Run | `prototype/v3-run-orchestrator.js` | `67A68ED3D1232E08ACBA132F01B6E85FE6AC6060251ED61A238E607A8F67C74A` |
| Shared-Run-Regressionen | `prototype/v3-run-orchestrator-regressions.mjs` | `DA059197A9EC6A60FE900F1C82CD754CD7031304C84427BDA6997445FA204CC5` |
| A05 Materialbestellungs-UI / integrierter Supplier-AP-Pfad | `prototype/v3/a05-t0070-material-order-ui-regressions.mjs` | `A323F7D44324CFD56EC9A26DD95AA5F1B953851AF9871F3586EFA276A16B386F` |

## Fachliche Bindung und Claimgrenzen

D-0173/D-0174 autorisieren einen eng abgegrenzten V3-Szenariopfad: synthetische Lieferantenangebote werden angenommen und als Snapshot gebunden; der physische Wareneingang erzeugt nicht allein AP oder Cash. Eine explizite Rechnungs-Evidenz kann den isolierten Supplier-AP-Subledger-Posten führen. Nur ein getrenntes, autorisiertes und ausdrücklich ausgeführtes Zahlungsevent reduziert AP und Bank. Preiswerte bleiben gekennzeichnete Szenarioannahmen; es wird keine aktuelle Händlerpreisbehauptung erzeugt.

Der gelistete A05-T-0070-UI-Test deckt den integrierten Pfad, Receipt-/Invoice-Bindung, 14-Tage-Rechnungsterm, AP-Anlage, Vollzahlungsversuch, unzureichende Liquidität, JSON-Save/Restore und Ausschluss von GL-/Steuer-/Inventar-/COGS-Wirkungen ab. Diese Manifestdatei bindet die Test- und Quellbytes; sie behauptet keinen separaten erfolgreichen Testlauf dieses Agenten und keine vollständige T-0069/G7-Abnahme.

Die acht T-0109/T-0110-Dateien binden den Lern- und Run-Slice an den jetzt geänderten `run.js`/`run.html`-Arbeitsbaum. Der frühere interaktive Browserbeleg CP-0514 gehört weiter nur zu seinem damaligen Build. Dieses Manifest belegt keinen aktuellen interaktiven Browser-/Gerätetest.

## Validierung und nächste Übergabe

Alle 15 aufgeführten Dateihashes wurden nach Erstellung frisch mit `Get-FileHash -Algorithm SHA256` im Repository-Checkout abgefragt und gegen die Manifestwerte verglichen. Branch und HEAD wurden lokal per Git abgefragt. Dieses Dokument wurde nicht committed oder gepusht; kein Remote-/Release-/Pages-Nachweis.

**Nächster Adressat:** A09 – unabhängige Prüfung, dass alle aktualisierten T-0110-Traceability-Claims auf diese genauen Arbeitsbaumbytes begrenzt sind und keine überholte `run.js`-/`run.html`-Hashangabe als aktueller Stand weitergeführt wird. Historische CPs/Manifeste nicht ändern. T-0109 aktueller interaktiver Browser-Smoke bleibt separat offen.

**Freigabegrenzen:** Domain-/Eventvertrag D-0173/D-0174; Runtime/API nur in den dokumentierten V3-Slices; Schema/Persistenz `NEIN/PROPOSED`; produktive Finanzmutation außerhalb des isolierten autorisierten AP-/Zahlungsslices nicht freigegeben; Release/Pages nicht freigegeben. A09-Review ausstehend.
