# A09 – Re-Review Makro-Restore und Kundenprozessprojektion

**Status:** PASS im geprüften Code-/Regressionumfang; kein Browser-/Release-PASS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Tickets:** T-0063 / T-0069 – IN_PROGRESS
**Vorgänger:** CP-0331 (Makro-Modul fehlt, NONPASS), CP-0329 (A05 Modulpräsenz-Fix), CP-0333 (A05 Kundenprozessanzeige)
**Profil / Entscheidungen:** V3 shared run, 2027-01-04; D-0157, D-0159, D-0161–D-0168
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; parallele lokale Änderungen erhalten.

## 1. Makro-Modulpräsenz und Restore

A05s neue Prüfung schließt den CP-0331-Fund. Für eine `V3|...`-Run-ID muss der codierte Makropfad einer der vier erlaubten Fixturepfade sein und `modules.macro` vorhanden sein. Fehlendes Modul, unbekannter Pfad, falsche Snapshot-ID, unbekannte Fixtureversion und Makromodul ohne passende V3-Run-ID werden abgewiesen.

Die Makrofixture-Regression prüft fehlendes Modul, unbekannte Version und abweichenden Pfad jeweils bei Save, Restore und Tagesöffnung. Alle drei Einstiege weisen zurück. Außerdem prüft sie die vier gültigen Pfade und den Monatswechsel.

Zusätzliche unabhängige BOOM-Probe: Run am 04.01.2027 geöffnet, geschlossen, als JSON-Save-Envelope gesichert und restauriert; der komplette restaurierte Runstate war identisch. Danach wurde der restaurierte Run bis zum 01.02. fortgesetzt. Januar- und Februarsnapshot blieben `boom`; es trat keine Pfadänderung auf.

## 2. Kundenprozessprojektion

`getRunProjection` leitet den getrennten Kundenprozess aus `getV3RunCustomerEvidence` und vorhandenen D-0166-Rechnungen/D-0168-Zahlungen ab. Die Anzeige unterscheidet Arbeitsplanstatus und Kundenprozess; sie ergänzt keine Ereignisse oder Buchungen. Der Statuspfad deckt Arbeitsplanung, laufende/fertige Fertigung, Lieferung, positive/negative Kundenentscheidung, Rechnung offen und bezahlt ab. Rechnung und Zahlung sind auf den Stichtag begrenzt.

Die A05-Regression prüft die Übergänge und dass `customerWorkOrders[].status`, Planstatus sowie die unveränderliche `pending_non_posting`-Handoff-Quelle erhalten bleiben. Zusätzlich erstellte A09 einen gültigen Auftrags-/Liefer-/Kundenentscheid-/Rechnungs-/Zahlungszustand, fror Run und Finanzzustand rekursiv ein und rief die Projektion im bezahlten Zustand auf. Die Projektion blieb ohne Mutation; Status `paid` und Zahlungstag stammten aus der vorhandenen Evidence. Ein zweiter Probeaufruf mit offener D-0166-Rechnung zeigte `invoice_open`.

## Prüfungen

- `node --check prototype/v3/run.js` – PASS.
- Syntaxchecks der Makro- und Run-UI-Regressionen – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS.
- Direkte BOOM Save/Restore/Fortsetzungsprobe bis Februar mit vollständigem Statevergleich – PASS.
- Direkte Tiefgefrier-/Nichtmutationsprobe der bezahlten Kundenprozessprojektion – PASS.
- `git diff --check` auf den betroffenen Run-/Regressionsdateien – PASS.
- Keine Produktdateien geändert.

## Grenzen und Nachweisrollen

**Ausführung:** A05 implementierte die Fixes; A09 führte unabhängige Regressionen und In-Memory-Probes aus.
**Fachreview:** A02-Vertrag für Operationsstatus und A03-D-0166/D-0168-Finanzgrenze berücksichtigt; keine neue Fachregel bewertet oder festgelegt.
**Unabhängige QA:** PASS für die beiden beauftragten Code-/Statebereiche.
**Browser-/Gerätetest:** nicht ausgeführt; separat an A12 vergeben.
**Git-Verifikation:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche lokale Änderungen blieben erhalten; kein Commit/Push.
**Offene Punkte:** Browser-/Geräteprüfung; T-0069-Jahres-/Ledger-/Lager-/COGS-/Kostenreconciliation bleiben außerhalb dieses Re-Reviews.
**Rückfragen an A01:** Keine.
**Blocker:** keiner in den beauftragten Review-Scope.
**Nächster Schritt:** A01 kann die Code-Gates für CP-0331 und CP-0333 als A09-PASS übernehmen; Browser-/Geräteprüfung bleibt A12s separates Gate.

