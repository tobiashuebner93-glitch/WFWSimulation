# A03 – Änderungsnachtrag zum Finance-Evidenzvertrag (CP-0344)

**Status:** A09-Klarstellungen eingearbeitet; keine neue Finance-Regel oder Freigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0066, T-0067, T-0069
**Bezug:** Evidenzvertrag `a03-t0066-t0067-t0069-finance-evidenzvertrag.md`; A09-Review CP-0342; CP-0341 (A03, ENTWURF)
**Entscheidungen:** D-0162, D-0165–D-0169
**Datum:** 2026-10-31

## Anlass und Änderungen

A09 erteilte in CP-0342 **PASS** für den nichtbuchenden Dokumentzweck des A03-Evidenzvertrags und gab zwei nichtblockierende Präzisierungen:

1. Abschnitt 3 ersetzt „aus der Rechnung heraus“ durch **„aus der BAB-/Plan-Ist-Berechnung heraus“**. Damit ist eindeutig, dass unvollständige Istkosten-/BAB-Evidenz die nichtbuchende Kostenrechnung betrifft und nicht das Kundenrechnungsereignis nach D-0166.
2. Die Periodenprüfung leitet den operativen Kalendermonat aus dem belegten Ist-Ereignis-/Leistungsdatum ab. Separat übergebene Perioden werden dagegen geprüft. Bei Abweichung muss ein Periodenzuordnungsgrund explizit dokumentiert werden; solange keine bestehende fachliche Regel die Abweichung trägt, bleibt sie `pending_period_assignment_review`. Widerspruch wird als `rejected_period_mismatch` ausgewiesen. Eine stillschweigende Rückdatierung ist ausgeschlossen. Die A02-Makroperiode ersetzt keine operative Kostenperiode.

Die ergänzte Prüfung wurde auch in den konkreten BAB-Akzeptanzfall und die Statusliste aufgenommen. Es wurden keine Vorgänger-CPs bearbeitet.

## Grenzen und Verifikation

- Kein Produktregelwechsel, keine Änderung an Buchungs-, Steuer-, Inventarbewertungs-, WIP- oder COGS-Semantik.
- Keine Implementierung, Schema-/Ledgerfreigabe oder Nutzerentscheidung.
- A09-PASS aus CP-0342 bleibt unverändert; A03 hat keine erneute unabhängige QA durchgeführt.
- Tests und Browser-/Gerätetest: nicht ausgeführt; keine Tests beauftragt.
- Git-Status/Diff in dieser Agentensitzung nicht verfügbar: `git status`/`git diff` endeten mit `fatal: this operation must be run in a work tree` bzw. CWD-`Permission denied`. Nur die gezielt beauftragten Dateien wurden bearbeitet; A01 soll den Gesamtstatus im eigenen Checkout verifizieren.
- Whitespaceprüfung: nur Evidenzvertrag, Nachtrag und CP-0344, nach Erstellung.
- Commit/Push: nicht ausgeführt.

**Nächster Schritt:** A01 nimmt den Nachtrag und den unveränderten A09-PASS in die Koordination auf. Weitere A02/A09-Ausführung bleibt ein separates Ticket.
