# A03-Finanzreview – T-0063 L2 Außenwirtschaftsprojektion (CP-0369)

**Status:** Fachreview abgeschlossen; PASS für die isolierte nichtbuchende Projektion, kein Integrations-/Release-PASS
**Datum:** 31.10.2026
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 L2, Anschluss T-0065/T-0069
**Entscheidungsbasis:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragenfaktor
**Prüfgrundlage:** A02 CP-0368 samt L2-Bericht; D-0169; A02 L2-Vertrag und CP-0355-Nachtrag; A03 CP-0354/0356
**Vorgänger:** CP-0368 (A02-Implementierung), CP-0356 (Dokumentenreview)
**Scope:** Read-only Fachreview der im Paket enthaltenen Runtime-/Regressiondateien; keine Produkt- oder Finanzregeländerung

## Gates

| Gate | Ergebnis | Befund |
|---|---|---|
| FX-Notierung und Richtung | **PASS** | Der Projektor verlangt `baseCurrency=USD`, `quoteCurrency=EUR`, `quoteUnit=EUR_per_USD` und einen positiven Kurs. Der relative Kursvergleich nutzt den Januar-2027-Basiswert. Ein höherer EUR-je-USD-Kurs erhöht den offenen USD-Planindex; die gerichtete Regression bestätigt +5 % Kurs → +1,25 % bei 25-%-Pass-through, außerdem negative Richtung und ±2-%-Kappung. |
| FX nur offene, nicht angenommene Importplanung | **PASS, Projektionsumfang** | Nur `status: open`, USD-Währung, positive Exposure und eindeutige Plan-ID werden berücksichtigt. `acceptedAt`, `acceptedOfferRef` und `contractSnapshotRef` sperren den Effekt. Der angenommene Lieferantenpreis-Snapshot und Istfinanzdaten bleiben unangetastet. Die Planreferenz wird jedoch als expliziter Makroinput mitgegeben, nicht aus einem operativen Beschaffungsregister geladen. |
| Exportverteilung / D-0169-Gesamtnachfrage | **PASS** | Die Projektion verarbeitet bereits geplante Wochenvorlagen und verändert ausschließlich erwartete Segmentanteile. `totalInquiriesBefore` und `totalInquiriesAfter` bleiben gleich; der Test weist fünf Anfragen vor/nach aus. Es entstehen oder ändern sich keine Anfrageobjekte, Zuschläge, Umsätze oder Finanzereignisse. D-0169 bleibt der alleinige Gesamtfaktor. Die Ausgabe ist eine Verteilung von Anfrage-Äquivalenten, keine neue reale Anfrage. |
| Lieferstörung / ETA | **PASS, Projektionsumfang** | Nur referenzierte offene Sendungen mit gültiger ETA und positiver Verzögerung erzeugen eine Kalender-ETA-Projektion; Verzögerung ist auf fünf Tage begrenzt. Menge, Wareneingang, Vertragswert, Rechnung, Bestand, BAB und COGS werden nicht verändert. `openShipments` kommt als Makroinput; es erfolgt kein Lookup/Abgleich gegen eine operative Bestellverwaltung. |
| Fehlende Eingaben / Fail-closed | **PASS mit Testabdeckungsgrenze** | Fehlender FX-Basiskurs, Standardfixture ohne Exposition, angenommene bzw. null-exponierte Planung, nicht wirksame/fehlende passende Segmente sowie fehlende offene Sendung/ETA liefern keinen entsprechenden Effekt. Der Makro-Validator bindet Quelldaten und Events; die gerichtete L2-Regression prüft aber nicht jede denkbare fehlende Referenzkombination einzeln. |
| Finanz-/Ledger-/Run-Nichtmutation | **PASS** | Projektoren sind reine Funktionen. Die Regression vergleicht Run-State, Markt-State und FinanceState vor/nach `getRunProjection`; sie bleiben identisch. Keine Änderung an Preis, Kosten, Bestand, Steuer, Forderung/Verbindlichkeit, Cash, Vertrag oder Ledger. Direkte Makro-Finanzwirkung: **0,00 €**. |
| Save/Restore und Replay | **PASS** | Der Regressionstest erstellt Save-Envelope, stellt den Run wieder her und vergleicht die Projektion; sie ist identisch. Gleiche Run-/Seed-/Inputbasis liefert dieselben Effekte. |
| Operative Beschaffungs-/Bestellintegration | **NONPASS / außerhalb dieses Loses** | FX-Plan und offene Sendung sind explizite, replaygebundene Eingaben des Makroevents. Dieser Prüfstand belegt keinen Abgleich gegen tatsächliche Beschaffungspläne/Bestellungen, keine UI-Anzeige und keine Nutzung in einer Einkaufskalkulation. Daher kein PASS für reale operative Wirkung oder T-0063/T-0069-Gesamtintegration. |

## Reproduktion

Im Paket `a02-code-input-t0063-l0l1` ausgeführt:

- `node prototype/v3-macro-trade-impact-regressions.mjs` — Exit 0, PASS.
- `node prototype/v3-finance-runtime-regressions.mjs` — Exit 0, PASS.
- `node prototype/v3-macro-demand-channel-regressions.mjs` — Exit 0, PASS.

Der gezielte L2-Test deckte positive/negative FX-Richtung, Pass-through/Kappung, angenommene vs. offene Planung, Null-Exposure, fehlenden Kurs, Export-Lag und Gesamtmengenkonstanz, ETA-Verschiebung/Kappung, neutrales Standardprofil, Nichtmutation und Save/Restore ab.

## Fachliche Grenzen und Übergabe

- Die Werte 25-%-Pass-through, ±2-%-Monatskappe, ±5 Prozentpunkte Exportverschiebung, ein Monat Lag sowie +2/max. +5 Tage ETA sind explizite synthetische Testfixtures. Sie sind keine empirisch kalibrierten Branchenwerte oder freigegebene Wirtschaftsschätzungen.
- Der L2-Projektor stellt noch keine operative Verbindung zu Lieferantenangebot, angenommenem Vertrag, tatsächlicher Bestellung oder Wareneingang her. Das ist eine Schnittstellen-/Integrationslücke, keine in diesem Review gefundene Finanzmutation.
- Kein Kredit-, Preis-, Kosten-, Bewertungs-, Buchungs- oder Postingentscheid wird hier freigegeben. Keine Änderung von BAB/COGS/Bestandsbewertung; dafür bleibt separate A03-Evidenz und Autorisierung erforderlich.
- Kein Browser-/Gerätetest, kein Jahres-/Ledgerabgleich und keine Gesamtfreigabe durchgeführt.

## Nachweisrollen und Arbeitsumgebung

- **Ausführung:** A03, read-only Fachreview.
- **Fachreview:** Ergebnis dieses Berichts; PASS ausschließlich für die benannten nichtbuchenden Projektionsgates.
- **Unabhängige QA:** nicht durch A03 ausgeführt; A09-Review bleibt getrennt erforderlich.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** Das Stagingpaket enthält kein `.git`; `git status --short` ist fehlgeschlagen (`fatal: not a git repository`). Kein Commit/Push.
- **Änderungen:** nur neuer Reviewbericht und neuer CP-0369-Entwurf in diesem Paket; Runtime und bestehende CPs unverändert.

**Nächster Schritt:** A01 kann den begrenzten Finance-Nichtbuchungs-PASS aufnehmen und A09 mit einem unabhängigen L2-Adversarialreview beauftragen. Operative L2-/Jahresintegration bleibt offen.
