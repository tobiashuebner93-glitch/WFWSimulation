# A03-Fachreview – BAB-UI-Re-Review nach CP-0295

**Status:** NONPASS – sichtbare Provenienzkennungen fehlen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Tickets:** T-0067 / T-0069
**Preflight:** CP-0295; D-0162; A03-Vertrag `docs/accounting/a03-t0067-v3-kalkulations-bab-vertrag.md`, Abschnitt 4.1.1; A03-Adapterbericht
**Prüfumfang:** ausschließlich `prototype/v3/run.js`, `prototype/a05-t0069-run-ui-regressions.mjs`, A05-Bericht `docs/simulation/a05-t0067-bab-ui-arbeitsbericht.md` sowie Adapter-/Vertragsverhalten

## Ergebnis

Der `weights`-Vertrag aus CP-0294 ist in der A05-Eingabe nun korrekt integriert: eine gemeinsame physische `rateBasis`, gleiche Treibereinheit und Empfängergrenze `B_g × w_g,c`. `keys` bleibt an die Summe physischer Schlüssel gebunden. Auftragswerte werden aus Cent-/Dezimaleingaben an die A03-Funktion übergeben. Die BAB-Aufschlüsselung zeigt Pool, Quellkostenstelle, Periode, Schlüssel/Gewicht, Verteilungsbetrag, Angebots-BAB, Satzbasis, gerundete Satzanzeige und 0-Cent-Reconciliation. Der gespeicherte Snapshot bleibt bei Annahme unverändert; Angebot/Kalkulation erzeugen keine Buchungs-, Cash- oder Ledgerwirkung.

### Blockierender Befund F-01 – gespeicherte Quellen-/Versionskennung bleibt unsichtbar

`renderBabDetails` in `prototype/v3/run.js` (Abschnitt um Zeilen 115–138) rendert pro Pool `poolId`, `sourceCostCenterId`, Periode und Betrag, liest aber weder `pool.costBasisId` noch `ownOffer.calculationSnapshot.costVersion` oder `babVersion`. Diese Werte werden bei der Angebotserstellung ausdrücklich verlangt und im Snapshot konserviert, fehlen jedoch in der schreibgeschützten UI-Aufschlüsselung. Daher ist der angezeigte BAB-Snapshot keinem benannten Kostenbasis-/BAB-Stand zuordenbar, obwohl die UI die eigentliche Allokation transparent macht.

**Repro:** `renderBabDetails` mit einem gespeicherten Snapshot, der `costBasisId: 'BASIS-REF-9'`, `costVersion: 'COST-VER-7'` und `babVersion: 'BAB-VER-4'` enthält, lieferte:

```json
{"showsSourceCostCenter":true,"showsCostBasisId":false,"showsCostVersion":false,"showsBabVersion":false,"showsRateAndUnit":true,"showsReconciliation":true}
```

Das ist kein Rechen- oder Snapshot-Mutationsfehler, sondern ein fehlender sichtbarer Provenienznachweis. Die vorhandenen IDs müssen in der gespeicherten Angebotsansicht angezeigt werden. Es ist keine neue Produktregel erforderlich.

## Prüfung der übrigen Grenzen

- **`weights`:** A05 übergibt gemeinsame `rateBasis`; Adapter erzwingt dieselbe physische Einheit und Begrenzung auf gewichtete Empfängerbasis. CP-0294-h/kg mit unabhängigen `recipientRateBases` wird abgewiesen.
- **`keys`:** Treibermengen bilden weiterhin gemeinsame Satzbasis; Treiber mit anderer Einheit oder Menge oberhalb des Empfängerschlüssels werden abgewiesen.
- **Perioden/Inputs:** Angebotsmonat stammt vom geöffneten Tag; Pool, Ratebasis und Auftragstreiber benötigen die gleiche Periode. Euroeingaben werden mit höchstens zwei Nachkommastellen in Cent konvertiert. Versionen, direkte Kosten-IDs und explizite Variabel/Fix-Klassifikation sind erforderlich; keine stillen BAB-/Kosten-Defaults.
- **Empfänger/Driver:** fehlende oder zusätzliche Treiber, unbekannter Pool und unbekannter Empfänger scheitern am A03-Adapter. Gewichte außerhalb einer Summe von exakt 1 werden abgewiesen.
- **Rundung/Anzeige:** Reconciliation bleibt auf Pool und Gesamtansicht 0 Cent; sichtbarer Quotient und gerundeter Satz werden getrennt gekennzeichnet, gerechnet wird mit dem exakten Snapshotwert. A03- und A05-Regressions decken Restcent und gerundete Anzeige ab.
- **Snapshot/Posting:** A05-Regression vergleicht den vollständigen Snapshot vor und nach Kundenannahme. Keine Rechnung, Abnahme, Steuer, Cash- oder Ledgerphase wird ausgelöst; Finanzübergabe bleibt nicht-postend.

## Tests und Prüfrollen

Ausgeführt, bestanden:

- `node --check prototype/v3-financial-calculation.js`
- `node --check prototype/v3-financial-calculation-regressions.mjs`
- `node --check prototype/v3/run.js`
- `node --check prototype/a05-t0069-run-ui-regressions.mjs`
- `node prototype/v3-financial-calculation-regressions.mjs`
- `node prototype/a05-t0069-run-ui-regressions.mjs`
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- zusätzliche direkte Receiver-/Unknown-Pool-/allocation-only-Probes: Abweisung bzw. keine Rate ohne Satzbasis bestanden
- `git diff --check`: Exit 0; bestehende LF→CRLF-Hinweise

- **A03-Fachreview:** durchgeführt; NONPASS ausschließlich F-01
- **Unabhängige QA/A09:** nicht ausgeführt
- **Browser-/Gerätetest:** nicht ausgeführt, wie beauftragt
- **Git-Verifikation:** Status/Diff gelesen; Arbeitsbaum enthält Änderungen anderer Agenten, die nicht verändert wurden
- **Commit/Push:** nicht ausgeführt

## Folgeauftrag

**Nächster Adressat: A05 – FRONTEND.** Zeige in der gespeicherten BAB-Aufschlüsselung `costBasisId`, `costVersion` und `babVersion` aus dem eingefrorenen Snapshot an. Ergänze Regressionen, dass alle drei Kennungen dargestellt und nach Annahme unverändert erhalten bleiben. Keine fachliche Neuberechnung erforderlich. Danach A03-Re-Review; bei PASS folgt A09 adversarial review.
