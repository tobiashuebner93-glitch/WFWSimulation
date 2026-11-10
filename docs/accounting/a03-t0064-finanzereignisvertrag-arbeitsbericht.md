# A03 – Arbeitsbericht T-0064 Finanzereignisvertrag

**Status:** A08-Erstreview eingearbeitet; A08-Re-Review und A01-Integration folgen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0064
**Bezug:** D-0159–D-0164; CP-0280 (ENTWURF); A02-Statusvertrag; A08-Rechtsmatrix/Legalregister

## Ergebnis

Der neue [A03-Finanzereignisvertrag für T-0064](a03-t0064-v3-finanzereignisvertrag.md) trennt Plan/Status, Vertrag/Verpflichtung und nachweisbare Ist-Ereignisse für Gründung, Einlage, Gründungsgebühr, gemeinsamen Einkauf/Arbeitsgemeinschaft, Share Deal, Asset-/Betriebskauf, Gesellschafterwechsel und Finanzierung. Er verlangt getrennte Parteien/Rechtsträger, Vertrags-/Belegreferenz, Werte/Datum/Periode sowie explizite Besitz-/Verbindlichkeits-/Mitarbeiterzuordnung. Status und Absicht erzeugen allein keine Cash-, Bilanz-, OP-, Bestands- oder Personalbuchung. V1/V2 bleiben unverändert; keine Schemafreigabe.

Beim Betriebs-/Betriebsteilübergang sind §613a BGB und die nach §613a Abs.2 mögliche, bedingte Haftung des bisherigen Arbeitgebers nur konkrete Prüfinputs; Altverpflichtungen werden weder pauschal doppelt angesetzt noch ohne Betrag/Zeitraum gebucht. §25 HGB bleibt vom §613a-Pfad getrennt und braucht die konkrete Fortführung/Firma bzw. sonstige gesetzliche Voraussetzung. GmbH/KG-Finanzidentitäten und GmbH/KG-Einlagen bleiben getrennt.

Nach dem A08-Erstreview wurden die Eingaben zu HGB §25 Abs. 1–3 getrennt: Erwerberhaftung für Geschäftsschulden, Forderungsübergang bei Zustimmung zur Firmenfortführung, Drittwirkung einer abweichenden Vereinbarung nach Abs. 2 und besonderer Verpflichtungsgrund ohne Firmenfortführung nach Abs. 3. Die Normen-/Quellentraceability nennt nun ausdrücklich BGB §613a Abs. 1–3 und 5–6; Abs. 4 ist an A02s Personalprozess verwiesen und löst keine A03-Buchungsaufgabe aus. HGB §161 Abs. 2 wird als entsprechende OHG-Verweisung, soweit der KG-Abschnitt nichts Abweichendes bestimmt, beschrieben; §123 Abs. 1 und die §107-Abs. 1-Grenze sind als bedingte KG-Anwendung eingeordnet.

**Keine Nutzerentscheidung erforderlich** für die reine Finanzschnittstellendokumentation. Offene Vertragsszenario-Daten (Beträge, Käufer/Verkäufer, Eigentum, Steuerbeleg, Abrechnungsschlüssel, Kreditkonditionen) sind als Eingaben bzw. mögliche spätere Nutzerentscheidungen markiert, nicht mit Defaults befüllt.

## Nachweise und Grenzen

- A03-Preflight gemäß AGENTS.md abgeschlossen; Status/Diff vor der Änderung geprüft. Nach der Änderung war Git-Verifikation nicht verfügbar: im Checkout ließ sich `.git` nicht mehr finden und Git meldete `fatal: this operation must be run in a work tree`; daher keine Status-/Diff-Aussage zum Endstand.
- Zielgerichteter Validator: nicht ausgeführt; es wurde ausschließlich ein dokumentarischer Fachvertrag überarbeitet und es existiert kein passender A03-Codevalidator.
- Whitespace: gezielter Whitespace-Scan für beide A03-Dateien PASS. `git diff --check` konnte wegen des fehlenden Git-Worktree-Metadatums nicht ausgeführt werden.
- Fachreview, unabhängige QA und Browser-/Gerätetest: nicht ausgeführt; Folgeprüfungen durch A08/A09/A01 erforderlich.
- Bestehende Änderungen anderer Rollen blieben erhalten; kein Commit/Push.

## Offene Folgeübergaben

A08 soll die gezielte Re-Review der drei korrigierten Befunde ausführen; anschließend integriert A01 den Vertrag und aktualisiert T-0064. A02/A05 klären operative Zustände und UI, ohne Accounting-Policy zu erfinden; A09 prüft später die Trennung Plan/Vertrag/Ist und Doppelbuchungsschutz. Falls V3 für konkrete Käufe oder Finanzierungen feste Produktwerte braucht, stellt A01 vor Implementierung eine Nutzerentscheidung zusammen.
