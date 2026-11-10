# A10 – T-0110 aktuelles Byte-Manifest (CP-0524)

**Status:** Aktuelle SHA-256-Bindung erstellt; T-0110 bleibt PARTIAL.  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Goal/Tickets:** MG-002 / SLG-002.5 / T-0110; Traceability zu T-0109  
**Autor/Ausführung:** A10 – DEVOPS_INFRASTRUCTURE  
**Branch/HEAD:** `main` / `fdc4960d4bf92fb13f6802e8d0738eb3d9110097`  
**Arbeitsbaum:** 752 vorhandene Statuszeilen vor diesem Bericht; diese Datei ist ein neuer, ungetrackter Nachtrag. Vorhandene Stagingzustände und Änderungen blieben unangetastet.

## Zweck und Bindung

Dieses Manifest ersetzt keine historischen Nachweise. CP-0513, CP-0514 und der damalige `a01-t0110-delivery-evidence-cp0513.md` bleiben unverändert und beschreiben ihre jeweiligen historischen Byte-Stände. A09 hat festgestellt, dass der dort notierte `run.js`-Hash `1E13164B…` nicht mehr dem aktuellen Checkout entspricht. Der aktuelle `run.js`-Hash lautet `E23C9A25…`; deshalb ist die frühere Hash-Tabelle kein aktueller Byte-Nachweis.

Die folgenden SHA-256-Werte wurden für diesen Nachtrag frisch mit `Get-FileHash -Algorithm SHA256` aus dem lokalen Checkout ermittelt. Sie binden nur die aufgeführten lokalen Dateien am angegebenen Branch/HEAD und Arbeitsbaum. Sie beweisen weder, dass diese Bytes committed oder remote veröffentlicht sind, noch einen interaktiven Browser-/Gerätetest.

## Aktuelles Manifest – T-0109 / T-0110 relevanter Slice

| Zweck | Datei | SHA-256 |
|---|---|---|
| Übungsantworten, lokaler Fortschritt | `prototype/v3/inquiry-practice.js` | `4E24D041726E196CED23DE8E6563101C23248B97F7AB72EE556242BC4F08D538` |
| Aktuelle Run-UI und Event-Handler | `prototype/v3/run.js` | `E23C9A25B7AFF6F8941D4272558AE89D25E40A6C2F56DD22AE9907332E972BC1` |
| HTML-Einstieg und Cache-/Modulreferenzen | `prototype/v3/run.html` | `1BFCBC2B1876767F64A3B20FD4FE8DFC2CB57D3E34DEB650596D93A5FA0E6188` |
| T-0109 fachliche Regression | `prototype/v3/a07-t0109-inquiry-practice-regressions.mjs` | `E124F7DA562C8F716C6CB22BCAC162CC8E9EE539706D442CD369FA9A8FB43ACA` |
| Lernlauf-Zustandsregeln | `prototype/v3-learning-runtime.js` | `5594526FE2E9B13998FAA8F5A2F156DB636F037D97A9A3AE12C185AD54E68AAD` |
| Anbindung an den Unternehmenslauf | `prototype/v3-learning-run-adapter.js` | `F4E263D8245010DD1F7DE6B0543B24AA1483C877FAC399773207D9B81DA69BEA` |
| Lernlauf-Regressions | `prototype/v3-learning-runtime-regressions.mjs` | `2BA038A65F3644695AA1AF5CEFE0F9ED944D481A347C05AA9D86B733D146BDFB` |
| Run-Adapter-Regressions | `prototype/v3-learning-run-adapter-regressions.mjs` | `78D27B804926E616E0A29AD8C2F20E155D82DF35AD67151E2C4877374E31C623` |

## Reviewbefund und Reichweite

- A09-Re-Review: PASS für die genannten automatisierten Lern-/Invarianz-/Save-Restore-Regressions; kein aktueller interaktiver Klick-/Reloadbeleg. Der Browser-Smoke aus CP-0514 ist an den damaligen Hash gebunden und gilt nicht als Test des jetzigen `run.js`/`run.html`.
- Daten-/Änderungsgrenzen: Ausschließlich der **T-0109-Inbox-Übungsfortschritt** liegt im isolierten Browser-localStorage mit In-Memory-Fallback und bleibt außerhalb des Unternehmens-/Finanz-Save-Envelopes. Der separate tägliche Dashboard-Lernlauf speichert Lernstatus und Traces in `runState.learning`; dieser Zustand ist Teil des Run-Save-Envelopes und wird durch die Lernlauf-Regressions im Save/Restore geprüft. Keiner der beiden Nachweise belegt Server- oder Datenbankpersistenz.
- A10: Hashes frisch verifiziert; bestehende Historie nicht verändert. Kein Commit-, Remote-, Pages- oder Release-Nachweis.
- `git diff --check` für diesen neuen Nachtrag: vor Abschluss durch A01 erneut auszuführen.

## Offene Gates

1. **T-0109:** aktueller interaktiver Browserlauf mit richtiger und falscher Antwort, sichtbarem Feedback, Reload und erneutem Öffnen; anschließend A09-Evidenzreview. Der historische CP-0514-Browserlauf schließt dieses Gate nicht.
2. **T-0110:** A01/A10 kann dieses Manifest als aktuellen lokalen Byte-Nachweis referenzieren. A09 muss danach die aktualisierte Traceability prüfen. Gesamtabschluss bleibt zusätzlich von T-0109 abhängig.

Keine Schema-, Architektur-, Rechts-, produktive Finanzmutations-, Release- oder Pages-Freigabe. Keine Dateien gestaged, committet oder gepusht.
