# A05-Arbeitsbericht – Kundenprozessfortschritt getrennt vom Arbeitsplan anzeigen

**Status:** UI-Projektion implementiert; fokussierte Regressionen bestanden; unabhängiger A09-Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069 – IN_PROGRESS  
**Bezug:** A02-Statussemantik T-0069 und bestehende A02-Kundenbeleg-/A03-Finanzhandoff-Verträge

## Änderung

Die gemeinsame Run-UI zeigt im Auftragsfeld jetzt zwei ausdrücklich getrennte Informationen:

- **Arbeitsplanstatus:** unverändert aus `customerWorkOrders` bzw. T-0066-Operationsplan. `ready_for_delivery` bleibt der Status für fertiggestellte Arbeitsgänge.
- **Kundenprozess (Nachweisprojektion):** read-only aus `getV3RunCustomerEvidence` sowie den vorhandenen D-0166-Rechnungen und Kundenzahlungen bis zum aktuellen Stichtag. Sichtbar sind Plan noch ausstehend, Fertigung in Arbeit, Lieferung offen, Kundenentscheidung offen, Zurückweisung, angenommener Auftrag ohne Rechnung, offene Szenariorechnung und belegter Zahlungseingang.

Die Kundenprozessprojektion mutiert weder Auftrags-/Arbeitsplanstatus noch A02-Finance-Handoff. Sie erzeugt keine Rechnung, Buchung, Lieferung, Abnahme oder Finanzwirkung und ist keine neue Abrechnungsfreigabe.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/a05-t0069-run-ui-regressions.mjs`
- `docs/simulation/a05-t0069-kundenprozessfortschritt-ui-arbeitsbericht.md`
- `docs/agent-system/checkpoints/CP-0333.md`

## Prüfungen

- `node prototype/a05-t0069-run-ui-regressions.mjs` – PASS; ausstehender Plan, laufende und fertige Fertigung, Lieferung ohne Kundenentscheidung, positive Annahme ohne Rechnung, offene Rechnung und Zahlungseingang geprüft.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node --check prototype/v3/run.js` und `node --check prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- `git diff --check` für die geänderten Code-/Regressiondateien – PASS.
- Regression bestätigt, dass `ready_for_delivery` als Arbeitsplanstatus erhalten bleibt und die Finanz-Handoff-Quelle unverändert ist.
- Browser-/Geräteprüfung nicht ausgeführt; A09-UI-Review ausstehend.
- Kein Commit oder Push; bestehende Änderungen anderer Agents erhalten.

## Übergabe

A09 soll die getrennte Statusanzeige samt ausstehendem, abgelehntem, angenommenem, fakturiertem und bezahltem Zustand adversarial prüfen. A02-Operationsstatus und A03-Finanzgrenze bleiben maßgeblich. T-0069 bleibt IN_PROGRESS; diese Anzeige schließt keine Jahres-/Ledger-/Lager-/COGS-Abstimmung ab.
