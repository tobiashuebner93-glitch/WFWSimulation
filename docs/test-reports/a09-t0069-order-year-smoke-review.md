# A09 – Unabhängiges Review des T-0069-Auftrags-Jahressmokes

**Status:** PASS im begrenzten Ein-Auftrags-/D-0166-/D-0168-Scope; kein Gesamtjahres- oder Release-PASS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069 – IN_PROGRESS
**Vorgänger:** CP-0328/CP-0329 (A05 Makro-Härtung/-Modulpräsenz), CP-0330 (A03 Finance-Review), CP-0332 (A02 Operations-/Kundenstatus)
**Profil / Entscheidungen:** V3-RUN-2; 2027-01-04 bis 2027-12-31; D-0157, D-0159, D-0161–D-0168
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche lokale Änderungen erhalten.

## Umfang und Review

Unabhängige Prüfung von `prototype/v3-year-order-smoke.mjs` und A02s `docs/simulation/a02-t0069-order-year-smoke-report.md` gegen die bereitgestellten A02-/A03-Nachweise, Runtime-Verträge und Nutzerentscheidungen. Der Harness erzeugt einen kontrollierten Auftrag, lässt ihn anbieten, annehmen, planen, fertigen, liefern, vom Kunden annehmen, nach D-0166 fakturieren und am D-0168-Fälligkeitstag bezahlen. Die Abnahme wird durch die gebundene Kundenpartei mit `actorRole: customer` ausgelöst. Der Vertragsfixturetyp `Kaufvertrag` entspricht der bestehenden A05-T-0069-Testfixture; die Produktschnittstelle verlangt ein explizites Vertragssnapshot-/Abnahmekriterium. Keine Buchungs-, Steuer- oder Zahlungsregel wird durch den Harness ergänzt.

Der Fälligkeitswert folgt dem gespeicherten Rechnungstermin, nicht einem im Test hartcodierten Ersatz. Für den Fall am 06.01.2027 ergibt Tag-1-Zählung und 14 Kalendertage den 19.01.2027. Die Finance-Runtime filtert explizit D-0166-Rechnungen mit `dueDate === operationalDate`, erstellt die Zahlung mit `paymentDate === dueDate`, und die Zahlung erhält eine stabile D-0168-Ereignis-ID. Der Harness findet genau einen Zahlungseingang zur erzeugten Rechnung und gleicht gespeichertes `dueDate` mit dem Lauftag ab.

Der `ready_for_delivery`-Status ist kein erkannter Statuskonflikt: Er bleibt autoritativer Fertigungs-/Operationsplanstatus. Delivery und Kundenentscheidung stehen in separater Evidence; die Finance-UI stellt Rechnung/Zahlung ebenfalls separat dar. A02 dokumentiert dies in CP-0332. Der Smoke selbst behauptet keine Änderung des Operationsstatus.

## Ausführung und Ergebnisse

- Zwei unabhängige Läufe desselben Harnesses mit gleichem Seed – beide PASS; beide lieferten `V3-RUN-2`, 362 Tage, zwölf Makromonate, einen Auftrag und denselben Run-State-Hash `0fe2d5c9bdac6c49a0bf0600c9d7722c54ecaffef2ee2db7cc3adcea6f85392b`.
- Auftragskette: Angebot am 04.01.; Kundenentscheidung am 06.01.; ein Arbeitsgang mit gebundenem Personal/Maschine und einem Materialverbrauch; Lieferung und explizite positive Kundenentscheidung am 06.01.; eine D-0166-Rechnung; eine D-0168-Zahlung am 19.01.
- BAB-Ergebnis des kontrollierten Auftrags: −1.200 Cent (−12,00 €), absichtlich bereits etablierter Verlustfall; kein Jahresergebnis.
- `node prototype/v3-year-smoke.mjs --scenario=UPSWING` – PASS; 362 Tage, zwölf Snapshots, 1.409 Run-Events, SHA-256 `82987a59cdd049c8908f2378cae014d3195dc1fcede5e8fe0283f5d1cc9adc5f`.
- Makrofixture-, Run-Orchestrator-, A05-UI- und Finance-Runtime-Regressionen – PASS. Die UI-Regression lief vor der aktuell separat von A05 geänderten Kundenstatus-Anzeige; sie ist kein Nachweis dieser neueren Änderung.
- Syntax- und gezielter `git diff --check` – PASS.

## Grenzen und Testlücken

Der Jahressmoke umfasst genau einen gezielt angebotenen/abgeschlossenen Auftrag. Danach werden keine weiteren Spielerangebote eingesendet. Er belegt weder Unternehmenswirtschaftlichkeit noch Insolvenz-/Tragfähigkeit, vollständiges Hauptbuch, Lieferanten-Cash, COGS, Lagerbewertung, vollständige Personal-/Raumkosten, Steuerabführung oder Jahresreconciliation. Das Ergebnis „−12,00 € nach BAB“ ist nur die Auftragskalkulation.

Die Save/Restore-Probe ruft den JSON-Restorepfad auf, prüft aber nur, dass die `runId` erhalten bleibt. Sie vergleicht nicht den vollständigen restaurierten Run und FinanceState oder einen restaurierten Run-Hash. Die Funktion kann damit als grundlegender Pfad-Smoke gelten; eine starke Save/Restore-Gleichheit ist nicht nachgewiesen. Empfohlen wird ein gezielter Inhaltsvergleich von Runstate, FinanceState, Zahlung und Monatsständen nach Restore.

Browser-/Gerätetest des Jahressmokes oder der aktuellen UI-Änderung wurde nicht ausgeführt. Keine Produktdatei geändert, kein Commit oder Push.

## Nachweisrollen und Übergabe

**Ausführung:** A02-Harness; A09 hat den Smoke zweimal unabhängig ausgeführt.
**Fachreview:** A03 Finance-Review PASS im begrenzten D-0166/D-0168-Scope (CP-0330); A02 klärte Operationsstatus in CP-0332.  
**Unabhängige QA:** PASS im oben beschriebenen Ein-Auftrags-/Fälligkeits-/Determinismus-Scope; eingeschränkte Restore-Assertions sind als Testlücke markiert.
**Browser-/Gerätetest:** nicht ausgeführt; die neuere A05-Kundenstatus-UI wird hier nicht abgenommen.
**Git-Verifikation:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; lokale Änderungen und neue Agentendokumente blieben erhalten; kein Commit/Push.
**Offene Punkte:** Vollständige Finance-/Ledger-/Bestands-/Jahresreconciliation; stärkere Restore-Inhaltsassertion; aktuelle A05-UI-Regression und Browserreview liegen außerhalb dieses Reports.
**Rückfragen an A01:** Keine.
**Blocker:** keiner für den begrenzten Harness-PASS; T-0069 bleibt IN_PROGRESS.
**Nächster Schritt:** A01 kann den begrenzten Harness-Gate-PASS übernehmen und die vollständige Reconciliation sowie den gesonderten A05-UI-/Browserreview weiterverfolgen.

