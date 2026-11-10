# A09 – T-0067 Finance-UI finaler Re-Review

**STATUS:** PASS für das unabhängige A09-Finance/UI-Gate; T-0067 insgesamt bleibt IN_PROGRESS.  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0067  
**Entscheidungsbasis:** D-0162; A03-Finanzvertrag und V-RATE-03; CP-0279/CP-0280 (Entwürfe).  
**Prüfdatum:** 2026-10-31.

## Preflight und Bestand

AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279, CP-0280, D-0162, A03-Vertrag/Vektoren, A05-UI/Regressionen und der vorherige A09-Befund `a09-t0067-finance-ui-qa.md` wurden gelesen. Aktiver Masterkontext ist MG-002/V3. Checkout: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; Branch `main`; HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`.

Vorhandene Änderungen umfassen Dateien anderer V3-Tickets und Agenten; sie blieben erhalten. `prototype/engine.js` war bereits geändert und wurde nicht berührt. Für diese QA wurden keine Produktdateien verändert. Kein Commit oder Push.

## Ergebnisse

| Prüfgate | Ergebnis | Nachweis |
|---|---|---|
| Physische `keys`-Verteilung und Mengensatz | PASS | Die Library summiert physische Empfängerschlüssel und liefert dieselbe Summe als Rate-Nenner. UI nutzt `allocation.rate`; kein zusätzliches Basisfeld ist in diesem Modus aktiv. |
| Dimensionslose `weights` | PASS | Allokator liefert kein `rate`-Feld. UI zeigt ohne separate Satzbasis keinen Mengensatz. Mit Satzwahl fordert sie positive separate Treibermenge und Einheit an und kennzeichnet Basis sowie gemeinsame Poolperiode getrennt. |
| Einheiten-/Periodenkonsistenz | PASS im UI-Modell | Je BAB-Pool existiert genau ein gemeinsames Periodenfeld und – sofern benötigt – genau ein Einheitenfeld für alle Empfänger und die separate Satzbasis. Damit lassen sich innerhalb eines Pools keine unterschiedlichen Einheiten oder Perioden je Empfänger eingeben. Browsernative Monatsfeldvalidierung wurde statisch geprüft; kein Browserlauf ausgeführt. |
| Ungültige Eingaben | PASS | Library lehnt ungültige Gewichtssummen, nichtpositive Satzbasis und leere Einheit ab. UI fordert Pool-ID, Periode, Kosten, Empfänger und erforderliche Einheit/Basis und zeigt Berechnungsfehler im Pool-/Statusbereich an. |
| Veraltete Kalkulation / Snapshot | PASS | Jede relevante Änderung an Kalkulations-/BAB-Eingaben invalidiert eine bestehende Schätzung; Estimate und Positionslabels werden geleert, Snapshot-Form ausgeblendet. Fehlerhafte Neuberechnung leert sie ebenfalls. Erfolgreiche neue Berechnung stellt Snapshot-Fähigkeit wieder her. Submit prüft zusätzlich, dass `estimate` existiert. |
| Snapshot-Freeze / keine Buchungswirkung | PASS | Snapshot und angenommene Kopie sind rekursiv eingefroren; die Kalkulation wird tief kopiert. Annahme führt keine Ledger-/Cash-Felder ein. Bestehende Snapshotobjekte werden durch spätere Entwürfe nicht verändert. |
| Kalkulations-/BAB-Rechenvektoren | PASS | D-0162- und A03-Vektoren bestanden: DB I, direkte Kosten getrennt, stabile Restcentverteilung, Satzanzeige/Innenpräzision und Periodenaggregation. |

### Gezielte Befundauflösung

Die zwei Blocker aus dem ersten A09-Bericht sind behoben:

1. **Nennerdifferenz:** A03-Vertrag/V-RATE-03 bindet `keys` an die Summe physischer Treibermengen; bei `weights` sind Gewichte nur Verteilungsanteile und ein Satz setzt eine separate physische Basis voraus. A05 zeigt diese Fälle getrennt. Beispiel 10,00 €, Schlüssel 1/1/1, Einheit h ergibt intern Nenner 3 und Anzeige 3,33 €/h (gerundet); Gewichte 0,50/0,25/0,25 ergeben 5,00/2,50/2,50 € und keinen Satz ohne explizite Zusatzbasis.
2. **Stale Snapshot:** Eingabeänderungen markieren die Anzeige als veraltet, entfernen die alte Kalkulation und verhindern Snapshot-Speicherung. Bei Rechenfehlern werden Schätzung und Labels ebenfalls gelöscht. Eine erfolgreiche Neuberechnung stellt die Snapshotfunktion wieder her.

## Ausgeführte Prüfungen

- `node --check prototype/v3-financial-calculation.js` – PASS.
- `node --check prototype/v3-financial-calculation-regressions.mjs` – PASS.
- `node prototype/v3-financial-calculation-regressions.mjs` – PASS.
- `node --check prototype/v3/finance.js` – PASS.
- `node prototype/v3/a05-t0067-regressions.mjs` – PASS; enthält Regressionen für Ratebasis, Gewichte, Stale-Estimate-Invalidierung, erfolgreichen Recalc-Pfad, Reconciliation, Snapshot und Kalkulationsvektoren.
- Unabhängige A09-API-Proben – PASS: keys-Nenner 3 h und 3,33 €/h; weights ohne implizite Rate; unvollständige Gewichtssumme abgewiesen; Nullbasis/leere Einheit abgewiesen; angenommener Snapshot tief unveränderlich.
- `git diff --check` – Exit 0; nur LF/CRLF-Hinweise auf bereits geänderte Dateien.
- Browser-/Mobiletest – nicht ausgeführt (für dieses Gate nicht gefordert).
- Commit/Push – nicht ausgeführt.

## Nachweisrollen und Restumfang

- **Ausführung:** A03-Bibliothek und A05-Finance-UI vorhanden; die hier aufgeführten unabhängigen Checks bestanden.
- **Fachreview:** A03-Vertrag und Vektoren liefern die maßgebliche fachliche Auslegung; A09 ersetzt keine Accounting-Freigabe.
- **Unabhängige QA:** A09-PASS für die nun korrigierten T-0067-Rechen-/UI-Gates.
- **Browser-/Gerätetest:** nicht ausgeführt; separates Browser-/Integrationsgate bleibt offen.
- **Git-Verifikation:** aktueller Branch/HEAD und bestehende Änderungen geprüft; keine Commit-/Push-Verifikation vorgenommen.

T-0067 bleibt insgesamt offen, bis die im Ticket genannten Integrations-/Releasegates mit T-0065/T-0066 sowie Browser-/Mobileabnahme abgeschlossen sind. Dieser Bericht ist keine Schema-, Architektur-, Produkt- oder Releasefreigabe.
