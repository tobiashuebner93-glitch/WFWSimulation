# A09 – T-0069 D-0165 Finance-Vorschau Review

**Status:** PASS mit Integrationsgrenze  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Reviewbasis:** CP-0317 (ENTWURF), D-0162 und D-0165; Finance-Runtime und Regressionen auf `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight

Root-`AGENTS.md`, Agentenstruktur und Rechte, Goals, Ticket-Board, Collaboration State, Decision Log, Rechtsrahmenregister, CP-0313–CP-0317, A03-Arbeitsbericht/Handoff-Matrix und A02-V3-Run-Choreografie wurden geprüft. Das aktive Ticket bleibt T-0069 (`IN_PROGRESS`). `git status` zeigte den großen, bereits vorhandenen lokalen V3-Arbeitsstand mit Dateien mehrerer Agenten. A09 hat keine Produktdatei oder fremde Änderung verändert; hinzugefügt wurde nur dieser Reviewbericht.

## Prüfergebnis

`calculateV3InvoiceTerms` ist für den dokumentierten Vorschauumfang PASS:

- Jede Position verlangt eine stabile eindeutige Referenz, einen nichtnegativen sicheren Ganzzahlbetrag in Cent und einen expliziten booleschen Steuerstatus.
- Die Steuer wird nur für als steuerpflichtig übergebene Positionen mit 19 % berechnet und je Position kaufmännisch centgenau gerundet. Eine nichtsteuerpflichtige Position erhält 0 Cent. Synthetische Tests bestätigen unter anderem 50 Cent netto → 10 Cent SimTAX.
- `R` bleibt Nettobetrag; die Vorschau gibt Netto-, SimTAX- und Bruttosummen getrennt aus.
- Ein expliziter realer ISO-Datumsanker ist erforderlich. Mit Ankertag als Tag 1 wird +13 Kalendertage gerechnet; Wochenendtermine werden auf Montag verschoben. Ein Monats-/Jahreswechsel (20.12.2027 → 03.01.2028) und der vorhandene Januar-/Wochenendfall bestehen.
- Leere Positionen, fehlende/nichtboolesche Steuerkennzeichnung, doppelte Referenzen, negative Beträge, sichere Ganzzahlüberläufe und Datumsbereichsüberlauf werden abgewiesen.
- Die Funktion erzeugt weder Rechnung noch Forderung, Erlös, Steuerschuld, Zahlung oder Cashwirkung. Die Finance-Ansicht bleibt unverändert und weist null erfassten Erlös aus.

Kein blockierender Funktionsfehler im geprüften Scope gefunden. Der ISO-Fristanker ist nur ein Eingabewert; die Vorschau prüft nicht, ob die jeweilige A02-Leistung/Rechnung diesen Anker fachlich autorisiert. Dies ist absichtlich dem noch fehlenden Run-Handoff überlassen.

## Tests

- `node --check prototype/v3-finance-runtime.js` – PASS
- `node --check prototype/v3-finance-runtime-regressions.mjs` – PASS
- `node prototype/v3-finance-runtime-regressions.mjs` – PASS (`V3 finance runtime regressions passed (synthetic evidence fixtures).`)
- Zusätzliche adversariale Inline-Checks für negative Beträge, ungültigen Steuerstatus, Wochenende/Jahreswechsel und Zustands-Nichtmutation – PASS
- Gezielter `git diff --check` für Runtime, Regressionen und Handoff-Matrix – PASS
- Browser-/Gerätetest – nicht ausgeführt; Vorschau ist nicht in Run/UI integriert.

## Abgrenzung und nächste Schritte

Das Review ist kein PASS für Rechnungs-/Zahlungsintegration oder T-0069 insgesamt. A02 muss autorisierte Rechnungspositionen, Steuerstatus und fachlich richtigen Fälligkeitsanker an die Schnittstelle übergeben. A03 muss Nettoerlös, Bruttoforderung, Steuerschuld, Zahlung sowie Istkosten/COGS getrennt abstimmen. Der `recordV3Invoice`-Buchungspfad ist nicht mit dem neuen Vorschauhelper gleichzusetzen. Danach sind integrierte Regressionen, Jahresreconciliation und Browser-/Mobil-QA nötig.

**Ausführung:** A03  
**Unabhängige QA:** A09 PASS im reinen Vorschauumfang  
**Fachreview A02:** nicht ausgeführt  
**Browser-/Gerätetest:** nicht ausgeführt  
**Git-Verifikation:** gezielter Diff-Check PASS; kein Commit/Push  
**Offene Tickets:** T-0069 bleibt IN_PROGRESS.
