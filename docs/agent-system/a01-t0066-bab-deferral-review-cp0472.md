# A01-Bericht CP-0472 – T-0066 G10-Abgrenzung ohne BAB

**Datum:** 2026-11-01  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0066  
**Vorgänger:** CP-0471 (historischer Befund; unverändert)

## Entscheidung und Gate-Lösung

Der Nutzer hat klargestellt, dass der BAB erst in einer späteren Version erarbeitet wird. Daher verlangt T-0066 in V3 keine endgültige BAB- oder vollständige Ist-COGS-Lösung.

Die T-0066-Gates 7–10 prüfen in V3 nur den belegbaren Umfang: DB I aus explizitem Netto-Preis und direkten Produktkosten; unveränderliche Kalkulations-Snapshots; Produktionsmenge, Käufer-/Angebotssnapshot und FIFO-Bestandsabgang; sowie Roll-forward, Idempotenz, Restore und Manipulationsschutz. BAB-Ergebnis und Vollkostenstatus bleiben `pending_deferred_bab`; das blockiert den physischen Versand nicht. Fehlende Kostensätze oder Planwerte dürfen keinen vollständigen Ist-COGS-/Gewinnwert erzeugen. Historische/manuelle Testbeträge sind – falls vorhanden – ausschließlich illustrative, nichtbuchende Annahmen.

Damit ist die fehlende BAB-Grundlage kein V3-Blocker für T-0066. Vollständiger BAB, Ist-Kostensätze, Ergebnis nach BAB und COGS-Abstimmung sind spätere Versionsgates. Erlös, Bestand, COGS, Cash und Hauptbuch bleiben getrennte Größen.

## Änderungen und Verifikation

- G7–G10 in `a01-t0066-t0067-mindestziele.md` und die zugehörigen Kriterien 7–10 in `a01-v3-offene-minimalziele.md` von einem BAB-Ergebnis auf DB-I-, Snapshot- und physischen FIFO-Nachweis umgestellt.
- Laufzeit und UI markieren ausstehende Produktkosten als `pending_deferred_bab`; Versand bleibt über den physischen FIFO-Bestand möglich. Frühere manuelle FIFO-Kostenbeispiele werden nicht als vollständiges Ist-COGS bezeichnet.
- Regressionen PASS: Produkt-FIFO-Kostenadapter, Produktlebenszyklus, Run-Orchestrator, A05-T-0066-UI und FinanceRuntime.
- `git diff --check` für alle betroffenen Laufzeit-, Test- und Steuerungsdateien PASS; nur übliche LF/CRLF-Hinweise für die beiden vorhandenen Steuerungsdateien.

## Status und nächste Übergabe

Die umgesetzte Regel löst den fachlichen Scope-Konflikt, sie ersetzt keine unabhängige Abnahme. T-0066 bleibt `IN_PROGRESS`, bis A03 den Finanz-/Abgrenzungsslice, A09 den adversarialen Mengen-/Restore-Slice und der vorgesehene Browser-Smoke geprüft sind. Diese Prüfergebnisse werden nicht vorweggenommen. CP-0471 bleibt als damalige Beurteilung unverändert; dieser Checkpoint hält die spätere Scope-Klärung fest. Kein Commit oder Push.
