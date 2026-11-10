# A03 Finance-Re-Review – L2 FX-Provenienzfix (CP-0373)

**Status:** PASS im begrenzten Finanz-Nichtbuchungs- und FX-Projektionsumfang; keine operative oder Releasefreigabe
**Datum:** 31.10.2026
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L2, Anschluss T-0065/T-0069
**Entscheidungsbasis:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragenfaktor
**Vorgänger:** CP-0368/0369 (L2 und erstes Finance-Review), CP-0370 (A09-NONPASS), CP-0371 (A02-Fix), CP-0372 (A09-PASS)
**Snapshot:** `a02-code-input-t0063-l0l1`; kein `.git`

## Gates

| Gate | Ergebnis | Befund |
|---|---|---|
| Strikte FX-Reihenprovenienz | **PASS** | Januar-Basis und aktuelle Folgeperiode verlangen positive EUR je USD (`USD/EUR`, `EUR_per_USD`), denselben synthetischen Fixture-Identifier, nichtleere Quellen-/Serienreferenzen sowie identische Run-/Scenario-Identität. Die Basisperiode ist fest `2027-01`, der Basisindex muss 100 sein; die Folgeperiode muss dieselbe Serienreferenz und Fixture verwenden. Der CP-0370-Fall mit falscher Basiseinheit/fehlender Fixture bleibt neutral, auch nach Restore. |
| Importplanbindung | **PASS, nur Projektionseingabe** | Nur derselbe Plan mit `status=open`, USD-Währung, positiver identischer Exposure und ohne Annahme-/Vertragssnapshot in Basis- und Folgeereignis kann einen Planindexbeitrag erhalten. Effekt ist ein Indexwert, kein Kurs für tatsächliche Beschaffung und kein neu berechneter Lieferantenpreis. |
| Finanz-/Ledger-Nichtmutation | **PASS** | Die Projektion ändert weder Istkosten noch Lieferantenvertrag, Rechnung, Bestand, BAB, COGS, Verbindlichkeit, Cash, Zins oder Ledger. `getRunProjection` liefert ausschließlich Informations-/Planwirkung; direkte Finanzwirkung bleibt **0,00 €**. |
| D-0169-Gesamtanfrageninvarianz | **PASS** | Der FX-Fix ist vom Nachfragepfad getrennt; die L2-Regression bestätigt Exportverteilung ohne Veränderung der Gesamtzahl. D-0169 bleibt einziger Gesamtfaktor. |
| Save/Restore und Finanzregression | **PASS** | Fehlerhafte Basen erzeugen auch nach Save/Restore keine FX-Wirkung; gültige synthetische Kontrolle besteht. Finance-Runtime-Regressionslauf bestanden. |

## Reproduktion und Dateibasis

Im benannten Paket ausgeführt:

- `node prototype/v3-macro-trade-impact-regressions.mjs` — Exit 0, PASS.
- `node prototype/v3-finance-runtime-regressions.mjs` — Exit 0, PASS.

SHA-256 der geprüften Codebasis stimmt mit A09 CP-0372 überein:

- `prototype/v3-macro-trade-impact.js`: `E5A43E70C7594AB9616AC16C23D8ADE24100165F2F24303D40378E912946BE49`
- `prototype/v3-macro-trade-impact-regressions.mjs`: `67F6D511254031AA1A0F328335D789A052D7254E77395EBD631D26ABA901BACD`

## Grenzen

Der PASS betrifft nur die Projektion und ihre Finanzgrenzen. Der FX-Plan wird weiter als explizite replaygebundene Makroeingabe übergeben; er wird nicht aus einem operativen Beschaffungsregister geladen. Damit ist keine operative Bestellintegration, Preis-/Bewertungs- oder Postingfreigabe belegt. Kein Jahres-/Ledgerabgleich, Browser-/Gerätetest oder Gesamtfreigabe durchgeführt.

## Nachweisrollen und Git

- **Ausführung/Fachreview:** A03, read-only.
- **Unabhängige QA:** A09 CP-0372 PASS im referenzierten engen Umfang; diese Arbeit führt keine unabhängige QA aus.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** `git status --short` nicht verfügbar (`fatal: not a git repository`); kein Commit/Push.
- **Änderungen:** ausschließlich dieser Bericht und CP-0373-Entwurf; Runtime unverändert.

**Nächster Schritt:** A01 integriert den engen Finance-PASS; operative Beschaffungsintegration und die Gesamtgates T-0063/T-0069 bleiben offen.
