# A02 – T-0069 Ein-Auftrags-Jahressmoke

**Status:** Additiver Integrationstest bestanden; T-0069 bleibt offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Vorgänger:** CP-0325 (ENTWURF)  
**V3-Profil:** 2027-01-04 bis 2027-12-31; V3-RUN-2  
**Maßgebliche Entscheidungen:** D-0157, D-0159, D-0161, D-0162, D-0165–D-0168

## Umfang

Der neue, additive Harness `prototype/v3-year-order-smoke.mjs` ergänzt `prototype/v3-year-smoke.mjs`; die bestehende Vier-Phasen-Baseline blieb unverändert. Er verwendet die bereits in `prototype/a05-t0069-run-ui-regressions.mjs` etablierte Angebots-, BAB-, Ressourcen- und Vertragsfixture. Es wurden keine Angebots-, Markt-, Vertrags-, Zahlungs- oder Finanzregeln geändert.

Der gemeinsame V3-Run läuft über 362 Kalendertage und 12 Makromonate. Ein kontrollierter Auftrag durchläuft Angebotsabgabe, Kundenentscheidung, Arbeitsplanung, Arbeitsgangabschluss, Materialverbrauch, Lieferung, positive Kunden-/Empfängerentscheidung, vereinfachte Szenariorechnung nach D-0166 und Zahlung am gespeicherten Fälligkeitstag nach D-0168. Die Abnahme wird ausschließlich mit `actorRole: customer` ausgelöst. Der Beispielpreis und BAB-Fall ist bewusst derselbe bereits dokumentierte Verlustfall: Ergebnis nach BAB −12,00 €.

## Ergebnis

- Ein Auftrag und eine Kundenentscheidung wurden im gemeinsamen Tageslauf verarbeitet.
- Ein Arbeitsgang wurde mit vorhandener Personal-/Maschinenfähigkeit abgeschlossen; Stahlbestand sank von 10 auf 9 Einheiten.
- Lieferung und Kundenabnahme wurden als getrennte Ereignisse aufgezeichnet.
- Eine D-0166-Szenariorechnung und genau ein D-0168-Kundeneingang wurden erzeugt; Zahlungstag und Rechnungsfälligkeit stimmten überein (19.01.2027).
- Der Lauf erreichte 31.12.2027; 12 Makromonate und der JSON-Save/Restore-Weg wurden geprüft.
- Die Marktanfragen werden weiterhin erzeugt; nach der kontrollierten Angebotsabgabe werden keine weiteren Angebote eingesendet, damit der Harness deterministisch einen Auftrag prüft.

Der Finance-Handoff bleibt ausdrücklich `pending_non_posting`. Die Finance-Runtime hält einen vereinfachten Szenario-Rechnungs-/Kundenzahlungspfad vor; es wurde kein vollständiges Hauptbuchposting ausgelöst.

## Prüfungen

- `node --check prototype/v3-year-order-smoke.mjs` – PASS.
- `node prototype/v3-year-order-smoke.mjs` – PASS; SHA-256 des resultierenden Runs: `0fe2d5c9bdac6c49a0bf0600c9d7722c54ecaffef2ee2db7cc3adcea6f85392b`.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-year-smoke.mjs --scenario=UPSWING` – PASS; 362 Tage, 12 Monate, 1.409 Ereignisse, Hash `82987a59cdd049c8908f2378cae014d3195dc1fcede5e8fe0283f5d1cc9adc5f`.
- Der Harness folgt jetzt der UI-Serialisierung mit `JSON.stringify(createRunSaveEnvelope(...))` und `restoreRunSaveEnvelope(JSON.parse(...))`. Danach vergleicht er stabile SHA-256-Projektionen des vollständigen Run- und Finanzzustands sowie explizit Makromonatssnapshots, Rechnungs-/Fälligkeitssätze und den eindeutigen D-0168-Zahlungseingang.
- Root hat den gehärteten Harness zweimal ausgeführt (PASS); beide Lauf- und Restore-State-Hashes stimmen überein: `0fe2d5c9bdac6c49a0bf0600c9d7722c54ecaffef2ee2db7cc3adcea6f85392b`.

## Grenzen und Folgeprüfung

Dieser Lauf ist kein ganzjähriger Unternehmens- oder Wirtschaftlichkeitstest. Nur ein Auftrag wird gezielt abgeschlossen; danach entstehen keine weiteren Player-Angebote. Der Test bilanziert keine Lieferantenverbindlichkeiten, Lieferantenzahlungen, vollständigen Personal-/Raumkosten, COGS, Lagerbewertung, periodischen Ist-Kosten oder vollständigen Jahres-Cash-/Ledgerabgleich. Der negative Deckungsbeitrags-/BAB-Fall ist kein Insolvenz- oder Tragfähigkeitsnachweis. Damit ist T-0069 nicht abgeschlossen.

Der Run-Endzustand behält `customerWorkOrders[0].status` und `customerWorkOrderPlans[0].status` als `ready_for_delivery`. Das ist der Status der Fertigungs-/Operationsplanung, nicht der Gesamtstatus des Kundenauftrags: Lieferung und Auftraggeberentscheidung werden absichtlich als eigene Ereignisse protokolliert. `getV3RunCustomerEvidence` stellt diese Fakten separat als `evidenceStatus: customer_decision_recorded` bereit; die Finance-UI projiziert Rechnung und Zahlung zusätzlich über `progressReason`. Die Trennung ist im Runtimevertrag beabsichtigt und kein Lifecycle-Fehler. A05 hat inzwischen einen separaten Kundenprozessstatus aus der vorhandenen Evidence-/Finanzprojektion ergänzt, ohne den autoritativen Operationsstatus umzuschreiben (A05-Bericht CP-0333; unabhängiger A09-Review steht aus).

**Ausführung:** A02; neuer Harness und dieser Bericht.  
**Fachreview:** Selbstprüfung gegen obige Entscheidungen und die bestehenden A05-Testwerte; unabhängiges Review ausstehend.  
**Unabhängige QA:** A09 bestätigte den Harness in CP-0334 im begrenzten Smoke-/Determinismus-/D-0166-/D-0168-Scope PASS und markierte die zunächst nur auf `runId` begrenzte Restore-Assertion als Lücke. Diese Lücke ist durch die vollständigen Run-/Finance-Hashes und Inhaltsprüfungen oben geschlossen; unabhängiger A09-Re-Review dieser Assert-Änderung steht aus.  
**Browser-/Gerätetest:** nicht ausgeführt.  
**Git-Verifikation:** Basis `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche vorhandene lokale Änderungen wurden erhalten. Kein Commit oder Push.

**Nächster Schritt:** A09 – QA prüft unabhängig die vollständigen Restore-Assertions und die inzwischen ergänzte Kundenprozessstatusanzeige. A03 prüft weiterhin nur den ausdrücklich vereinfachten Finanzpfad. Jahresabstimmung von Kosten, Bestand und Hauptbuch bleibt ein separates Integrationsgate für A01.
