# A01-Bericht CP-0473 – T-0066 G7–G10 Re-Reviews

**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0066  
**Vorgänger:** CP-0472 (ENTWURF; nicht verändert)  
**Basis:** `main@8b72b7e`; breite lokale Änderungen erhalten.

## Reviewablauf

- A03-Finanzreview meldete zunächst NONPASS: Produkt-UI und Offer-Snapshot konnten BAB-Werte nutzen; ein vorhandener FIFO-Kostenlayer konnte Sale-COGS auf `valued_nonposting` stellen.
- A09-Adversarialreview meldete zunächst NONPASS: aktiver UI-Pfad verlangte BAB; später fand A09 zusätzlich einen Restore-Tamper, bei dem das Dispatch-Quellereignis einen erfundenen COGS-Wert behaupten konnte.
- A01 stellte das aktive Produktformular und den Verkaufsfluss auf DB I aus direkten Kosten ohne BAB um. Verkaufssnapshots tragen `babStatus: pending_deferred_bab` und `babCalculation: null`; sichtbare Produktansichten behaupten kein Ergebnis nach BAB.
- Versand hält Sale-COGS stets ausstehend. Vorhandene manuelle FIFO-Kostenlagen dürfen nur als separate illustrative, nichtbuchende Mengenallocation geführt werden. Sie erzeugen keinen Sale-COGS-Betrag.
- Der Lifecycle-Validator bindet das Versandereignis jetzt exakt an Sale, Menge, Dispatch-ID, Quelle, Datum/Periode, physische Bewegung sowie `cogsStatus: pending_deferred_bab` und `cogsCents: null`. Regressionen prüfen COGS- und Mengenmanipulation.

## Unabhängige Ergebnisse

**A03-Re-Review: PASS** für G7, G8 und G10. Plan-DB-I, unveränderlicher Direktkosten-Snapshot, ausstehender BAB/COGS, Versand ohne Finanzposting und getrennte illustrative FIFO-Allocation sind mit Nutzerabgrenzung vereinbar. A03 sah keine Produktbuchung, Cash- oder Hauptbuchwirkung.

**A09-Re-Review: PASS** für G7–G10 im geprüften automatisierten Umfang. A09 bestätigte BAB-freie Kalkulation und Verkauf, Menge/Bestand/Reservierung, Restore/Replay-Bindungen und Zurückweisung des manipulierten Dispatch-COGS-/Mengenereignisses.

## Verifikation

PASS: Produkt-FIFO-Kostenadapter, Produktlebenszyklus, Shared-Run-Orchestrator, A05-T-0066-UI und FinanceRuntime-Regressionen. PASS: scoped `git diff --check` (Exit 0; nur übliche LF/CRLF-Hinweise in bestehenden Steuerungsdateien).

## Abgrenzung

Ein Browser-Smoke wurde nicht ausgeführt. Daher wird T-0066 nicht als vollständig 10/10 oder `COMPLETED` markiert; es bleibt `IN_PROGRESS`, bis der vorgeschriebene A01-Browser-Smoke und die übrigen bestehenden Gates belegt sind. Der exportierte `estimateV3ProductWithBab`-Helper bleibt als isolierter Legacy-/anderer Ticketpfad bestehen; die aktive T-0066-Produkt-UI und der Produktangebotspfad rufen ihn nicht auf. Kein Commit oder Push.
