# A01 – T-0066 G10 Quellenbindung (CP-0471)

**Status:** Implementierungsteil PASS; G10 insgesamt NONPASS; T-0066 bleibt IN_PROGRESS bei höchstens 9/10  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Ticket/Ziel:** T-0066 / MG-002 / SLG-002.2  
**Basis:** CP-0468, CP-0470, D-0170, `a01-t0066-t0067-mindestziele.md`  
**Branch/HEAD:** `main` / `8b72b7e`

## Ergebnis

G10 wurde technisch weiter abgearbeitet. Beliebige manuell eingetragene Komponenten-Quellen-IDs werden nicht mehr akzeptiert. `getV3ProductCostSourceRefs` erzeugt zulässige Referenzen aus:

- tatsächlich abgeschlossenen Produktzuweisungen mit Materialverbrauch,
- abgeschlossenen Arbeitszeitbelegen,
- zugewiesenen Maschineneinsätzen,
- einem gespeicherten BAB-Quellpool-Snapshot samt Kostenstelle und Kostenbasis.

Die Kosten-UI zeigt diese Quellen schreibgeschützt an. Beim Restore/Validieren müssen die Referenzen mit abgeschlossenen Run-Daten und einem historischen BAB-Snapshot übereinstimmen. Eine spätere Änderung der Plan-/BAB-Kalkulation löst die Bindung eines bereits bewerteten Loses nicht. Gefälschte Referenzen werden fail-closed abgewiesen.

Die Kostenbeträge bleiben manuell eingegebene, nichtbuchende Bewertungswerte. Die Quellen belegen die betriebliche Zuordnung, **nicht** den Geldbetrag als abgerechneten Materialzugang, Lohn-/Maschinenkostensatz oder Ist-BAB. Das UI weist diese Grenze ausdrücklich aus. Damit ist die Referenzintegrität verbessert; die von G10 verlangte belegte Bewertung ist nicht vollständig erbracht.

## Prüfung

Folgende gezielte Suiten bestanden:

- `node prototype/v3-product-costing-regressions.mjs`
- `node prototype/v3-product-lifecycle-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3/a05-t0066-product-ui-regressions.mjs`
- `node prototype/v3-finance-runtime-regressions.mjs`
- scoped `git diff --check` für geänderte T-0066-Laufzeit-, UI- und Regressiondateien

Abgedeckt sind gültige Referenzen je Quelle, erfundene Materialreferenz (fail-closed), unveränderte BAB-Quellenbindung nach Planrevision, FIFO, Produktlebenszyklus, Shared Run, UI und Finanzgrenzen.

## G10-Entscheidung und Restarbeit

**NONPASS bleibt bestehen.** Für PASS fehlen:

1. Betriebliche Geldwertquellen, die zu den Beträgen passen (z. B. tatsächlich erfasster Materialzugang/-verbrauch mit Preis, anwendbarer Arbeits-/Maschinensatz und bestätigter Ist-BAB-Pool). Die V3-Run-Modelle liefern bislang Mengen, modellierte Minuten und Plan-BAB, aber keine vollständige Istkostenbasis. A01 hat keine Werte oder Sätze ergänzt.
2. A03-Fachreview der Geldbetrags-/Bewertungsgrundlage und des FIFO-COGS-Abgangs.
3. Unabhängiger A09-Adversarial-Re-Review der neuen Quellenbindung und Restore-Manipulationsfälle.
4. Visueller Browser-Smoke der aktualisierten Kostenquelleingabe; in diesem Lauf nicht ausgeführt.

CP-0468s bereits bestandene G1–G9 bleiben unberührt. Kein Ticketabschluss, keine neue Produktentscheidung, keine Schema-/Architekturfreigabe, kein Commit/Push.
