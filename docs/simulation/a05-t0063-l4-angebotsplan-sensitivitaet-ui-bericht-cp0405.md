# A05 – T-0063 L4-Angebotsplan-Sensitivität UI (CP-0405)

**Status:** UI umgesetzt; Regressionen PASS; Browser-/Geräteretest ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A05 – FRONTEND
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0067/T-0069 angrenzend
**Vorgänger:** CP-0404; A03 Review PASS; A09 adversarial PASS
**Entscheidungen:** D-0162, D-0163, D-0169

## Umsetzung

Das Formular für offene Run-Angebote enthält `sensitivityMode`: `unadjusted` ist vorausgewählt, `apply_l4_plan_indices` steht als bewusster Opt-in bereit. Das Formular reicht die Auswahl über den bestehenden `FormData`-Pfad an `submitRunOffer` weiter.

Die Hinweistexte unterscheiden Plan-/Szenariowerte von Istkosten und Prognosen. Sie erklären die gemeinsame Material-/Logistik-Sensitivität über ProcurementPlanIndex, WagePlanIndex für direkte Arbeit, unveränderte `other`-Positionen, den Schutz gegen eine zweite BICI-Anwendung und den unveränderten Nettoplanpreis `R`. Beim Opt-in sind `category` und `basePeriod: "2027-01"` je direkter Kostenposition explizit nötig. Kostenkategorien werden nicht geraten. Wenn Index oder Nachweis fehlt, blockiert die bestehende Runtime die Angebotsabgabe ohne Wechsel auf unadjusted.

Nach der Änderung wurde der `run.js`-SHA-256-Token in `run.html` anhand der konkreten Datei aktualisiert; die kombinierte Logo-Buildkennung stimmt ebenfalls.

## Verifikation

Alle folgenden Suiten bestanden:

- `prototype/v3/a05-t0063-offer-sensitivity-ui-regressions.mjs`
- `prototype/a05-t0069-run-ui-regressions.mjs`
- `prototype/a09-t0069-run-ui-adversarial-regressions.mjs`
- `prototype/v3/a05-t0065-market-ui-regressions.mjs`
- `prototype/v3/a05-t0067-regressions.mjs`
- `prototype/v3-offer-plan-sensitivity-regressions.mjs`
- `prototype/a02-t0063-offer-sensitivity-integrity-regressions.mjs`
- Business-Cost-Plan-Index-, Finanzberechnungs-, Finance-Runtime-, Run-Orchestrator-, Operating-Impact-, Makrofixture-, Makrosimulations-, Policy-Impact- und Trade-Impact-Regressionen
- Entry-Cache-Regression für echte `run.js`-/`run.css`-SHA-256-Tokens
- `node --check` und gezieltes `git diff --check`

A03 hat nach A02 CP-0404 die fachliche Index-, Rundungs-, R-, BAB-, Nichtbuchungs- und Snapshotprüfung bestanden. A09 hat die gepaarten/untergeordneten Mutationen und den echten Submit-/Save-/Restore-/Acceptance-Pfad unabhängig geprüft. Lokale vollständig umgeschriebene Saves sind nicht kryptografisch authentisiert.

Browser- und Gerätetest: nicht ausgeführt. A01 soll den frischen Lauf im Browser auf der aktuellen Asset-URL testen. Keine Commit-/Push-Aktion.
## A05-Nachtrag CP-0410 – Startprofilwahl für die L4-Demo-Fixture

A05 ergänzte im gemeinsamen Run-Startformular eine explizite Auswahl zwischen `NEUTRAL` (vorausgewählt) und `V3-PLAN-INDEX-SYNTH-EQUAL-1`. Die zweite Option wird als synthetisches Lernmaterial, nicht als beobachtete Marktinformation, gekennzeichnet. Die Erklärung nennt Januar 2027 als Basis, einmonatige Verzögerung und Wirkung ab Februar. Eine Auswahl ist nur mit Januar-2027-Start und Enddatum mindestens 01.02.2027 gültig. Die UI setzt Min-/Max-Werte und verständliche Validierungsfehler; sie verschiebt oder ändert Datumsfelder nicht automatisch. Die Fixture-ID wird per bestehendem FormData-Pfad an `createRunFromInputs` gereicht; keine Runtimeformel wurde angepasst.

Fokussiert PASS: `prototype/v3/a05-t0063-cost-plan-fixture-ui-regressions.mjs`, Offer-Sensitivity-UI, Entry-Cache, Run-UI, Makro-UI, Run-Makro-Fixture, Business-Cost-Plan-Index, Offer-Sensitivity, Offer-Submit/Save/Restore/Acceptance-Integrity und Run-Orchestrator. `node --check` und scoped `git diff --check` PASS. `run.js` SHA-256 `1513949b156b55798955ccc9e2f439947e961f27385eee450f31f061c0f4dcd8`; CSS token unchanged. A03 CP-0409 vector review and A09 re-review PASS as reported to A01. Browser/device test not run; A01 next. CP-0407–0409 bleiben unverändert; CP-0410 ist ENTWURF. Kein Commit/Push.