# A03-Fachreview – T-0063 L2 Auslandsnachfrage / Nichtbuchung (CP-0419)

**Status:** PASS im begrenzten Accounting-/Finance- und Periodenreview
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 L2; Schnittstellen T-0065/T-0069
**Run-Profil:** V3 Shared Run ab 2027-01-04; Wirkung ab 2027-02; `NEUTRAL` bleibt Standard
**Maßgebliche Entscheidungen:** D-0161–D-0169, insbesondere D-0162 (Plan-/Finanzgrenzen), D-0165–D-0168 (Rechnung/Zahlung nur bei gesonderten Ereignissen), D-0169 (alleiniger Gesamtanfragenfaktor)
**Vorgänger:** CP-0418 (A02-Runtime), CP-0417 (A08-Design), CP-0416 (A09 Cache/Importgraph-Re-Review); CP-0411–0415 als Browser-/Implementierungshistorie
**Arbeitsbasis:** `main@8b72b7e`; umfangreiche bestehende lokale Änderungen beibehalten; kein Commit/Push.

## Prüfgegenstand und Ergebnis

Read-only-Fachreview der tatsächlichen Runtime-Dateien `prototype/v3-run-macro-fixture.js`, `prototype/v3/run.js`, `prototype/v3-run-orchestrator.js` und `prototype/v3-macro-trade-impact.js`, dazu der Regressionen und des A02-Berichts CP-0418. Geprüft wurden D-0169-Mengenerhalt, Auslandsnachfrage-Lag/Periode, Zuordnung zu vorhandenen Anfrage-Templates sowie mögliche Finanz-, Vertrags-, Leistungs-, Bestands- und Buchungswirkungen.

**Befund PASS:** Die Lauf-Choreografie berechnet die Basisanfragen zuerst aus D-0169 und übergibt genau diese Template-Liste an den L2-Allokator. Der Allokator erhält die Zahl `N` exakt, weist ganzzahlige Slots deterministisch vorhandenen Segmentvorlagen zu und verändert weder den D-0169-Faktor noch die Anfragezahl. Die Fixture ist optional und an Run-/Makro-Snapshot gebunden. Das Januarereignis wird gemäß Lag 1 erst im Februar wirksam. Der Trade-Impact-Ausweis liest die tatsächliche Verteilung aus den Schedule-Templates und zählt sie nicht ein zweites Mal als Mengenwirkung.

Die geprüfte L2-Funktion schreibt keine Rechnungen, Forderungen, Verbindlichkeiten, Zahlungseingänge, Erlöse, Steuerkomponenten, BAB-/Kostenwerte, Cash-/Finanzsalden, Lager- oder Beschaffungswerte. Sie erzeugt auch keine Zuschläge, Verträge oder Work Orders. Die Marktengine verarbeitet die neu zugeordneten Vorlagen als Anfragen; eine Anfrage bleibt Anfrage und angeforderte Kapazität bleibt Anforderungs-/Planungsinformation. Eine finanzielle Wirkung kann weiterhin erst durch die separat modellierten und belegten späteren Ereignisse entstehen, im Einklang mit D-0162 und D-0165–D-0168.

## Reproduzierte Prüfungen

Die folgenden Tests wurden im Checkout selbst ausgeführt und bestanden:

- `node prototype/v3-foreign-demand-market-regressions.mjs` – Neutralität, Lag, Verschiebung, `N=0/1/2/5/17/100/501`, Ganzzahligkeit/Summenerhalt, deterministische Verteilung, Scope, Duplikate/Unbekanntes, Save/Restore, keine Zuschlags-/Finanzmutation.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – L2-Istverteilung plus FX-/ETA-Nachbarpfade und Finanz-/Markt-Nichtmutation.
- `node prototype/v3-macro-demand-channel-regressions.mjs` – 52-Wochen-D-0169-Summen, Replay, Restore und Finance-Checks.
- `node prototype/v3-market-simulation-regressions.mjs` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS.
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.

## Grenzen / Folgeübergabe

Dies ist ausschließlich ein A03-Fachreview der Nichtbuchungs- und Periodengrenze des neuen L2-Pfads. Es ist keine A09-Adversarial-, A05-UI/Browser-, Rechts-, Architektur-, Schema-, Produkt- oder Releasefreigabe und kein Abschluss von T-0063 oder V3. Kein vollständiger Jahres-Smoke und kein Browserlauf des neuen L2-Opt-in-Falls wurden ausgeführt. Die Fixtureparameter `+5 pp`/ein Monat Lag bleiben synthetisch und nicht empirisch kalibriert.

**Rückfragen:** keine. **Blocker in diesem A03-Scope:** keine.

**Nächster Adressat:** A09 – adversariales Review der Replay-/Restore-Manipulation, D-0169-Summenerhalt, Event-/Segment-Scope und Nichtmutation. Erst nach A09-PASS A05 mit UI-/Graphhash-Integration beauftragen; danach ist ein frischer Browsernachweis für Januar/Februar erforderlich.
