# A03 – V3-Release-Scope und Finanz-UI-Impact (CP-0566)

Datum: 2026-11-10  
Status: Fachreview PASS im nachstehend abgegrenzten V3-Scope; keine Volljahres- oder allgemeine Rechtsfreigabe  
Adressat: A01 – MASTER_ORCHESTRATOR  
Goal/Tickets: MG-002 / SLG-002.2 / T-0069 / T-0074 / T-0077 / T-0080  
Basis: `main` / `fdc4960`; Vorgänger CP-0554, CP-0556, CP-0559, CP-0565  
Entscheidungen: D-0157, D-0165/0166, D-0168, D-0174/0177/0178, D-0180/0183/0185/0186/0187; aktuelle Nutzeranweisung vom 2026-11-10 zum Verzicht auf den 12-Monats-Smoke und Release vor weiterer Performancearbeit.

## Ergebnis

Der von A01 gemeldete Browserpfad in 390×844 und 768×1024 deckt den integrierten G10-Finanzkern unter dem aktuellen Jahres-Smoke-Verzicht fachlich ab. Dies gilt für den beschriebenen Kundenleistungs-/Rechnungs-/Zahlungspfad, nicht für einen vollständigen Hauptbuchabschluss, Jahresgewinn, tatsächliche Solvenz oder einen bestandenen erneuten Jahres-Smoke. A09 bleibt für das abschließende unabhängige Gateurteil zuständig.

| Beobachteter Schritt laut A01-Browserausführung | A03-Fachabgleich |
|---|---|
| Angebot am 05.01.2027 mit 100,00 € netto; Annahme am 07.01. | Preis wird Vertragswert, nicht durch spätere Planänderung ersetzt. |
| Maschinen-/Arbeitsmittelnutzung blockiert bis zur geplanten und abgeschlossenen Erstunterweisung; danach systemgenerierter 4h-Arbeitsplan | Unterweisung und Planzeit erzeugen keine automatische Finanzbuchung; kein Istkosten-/COGS-Anspruch. |
| Lieferung 07.01.; F3-Kundenentscheidung beim Tagesabschluss 14.01. | Auftragnehmer liefert; Kunden-/Empfängerseite entscheidet. Fünf Arbeitstage ab Folgetag: 08., 11., 12., 13., 14.01. F3 bleibt vereinbarte Spielkonvention, keine behauptete gesetzliche Abnahmefiktion. |
| Rechnung am 14.01.: netto 100,00 €, SimTAX 19,00 €, brutto 119,00 €; fällig 27.01. | 10000 + 1900 = 11900 Cent. Die bestehende inklusive 14-Kalendertage-Policy zählt den Ankertag als Tag 1 (`calculateV3InvoiceTerms`, +13 Tage); dies ist ein gespeicherter Vertrags-/Szenarioparameter, kein allgemeiner gesetzlicher Friststandard. |
| Kundeneingang am 27.01.; Bank 10.119,00 €, Forderung 0,00 €, SimTAX 19,00 € | Opening 1.000.000 + Receipt 11.900 = Bank 1.011.900 Cent. Forderung vollständig ausgeglichen; SimTAX-Verbindlichkeit bleibt separat. Cashzufluss erzeugt keinen zweiten Umsatz. |
| JSON-Export | A01 beobachtete Export. Automatisierte Save/Restore-Prüfungen bleiben gesonderte Belege; ein Download allein beweist keinen Restore. |

Die neu korrigierte Dispoanzeige ist zusätzlich durch die gezielte UI-Regression geprüft: bei 999,52 € gezogenem Dispo und 0,00 € Brutto-Bankcash erscheint der sichtbare Bankbestand als −999,52 € in Rot. Der kleine Rahmen nennt 1.000,00 € Limit, 999,52 € Nutzung und 0,48 € Restverfügbarkeit. Die zugrunde liegenden getrennten Finanzbestände werden durch Rendering nicht mutiert. Vor Nutzung bleibt die Anzeige positiv und der Rahmen ungezogen. Cache-/Paket-Neubau und visuelle Kontrolle der neuen Anzeige liegen bei A10/A01/A09.

## Ausgeführte Kurzprüfungen durch A03

- `node prototype/v3-finance-runtime-regressions.mjs` — PASS.
- `node prototype/v3-finance-ledger-projection-regressions.mjs` — PASS, Kunden- und isolierter AP-/Bank-/Dispo-Scope; kein vollständiges GL.
- `node prototype/v3-t0074-economic-viability-scenario-regressions.mjs` — PASS, positive/negative/Break-even-Fälle; nichtbuchend.
- `node prototype/v3/a05-t0070-material-order-ui-regressions.mjs` — PASS nach enger Bank-/Dispo-Renderingkorrektur und Aktualisierung zweier veralteter Fixtureerwartungen (vor Fälligkeit kein Zahlungsbutton; unzureichender Rahmen zeigt keine ausführbare Zahlung).
- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS.
- Scoped `git diff --check` — Exit 0, nur LF/CRLF-Hinweise.
- Kein neuer 12-Monatslauf ausgeführt; vom Nutzer aktuell ausgenommen.

## Scoped rechtlicher UI-Impact

Die geprüften Anzeigen halten die im [Rechtsrahmenregister](../legal/legal-framework-register.md) und in späteren Fachreviews beschriebenen Grenzen ein: Abgabe/Annahme und fixierter Vertragspreis bleiben getrennt; Lieferung ist keine Verkäuferabnahme; Rechnungsdatum, Fälligkeit und Kundeneingang sind getrennte Zustände; SimTAX ist eine vereinfachte Szenariokomponente; Produkt-/Plan-BAB-Werte werden nicht als Ist-COGS oder Hauptbuchbuchung ausgegeben. D-0187s Kostenoverlay verändert keinen Finanzbestand; Privatentnahmen sind von Betriebsausgaben getrennt.

A03 führte in diesem Nachreview keine neue amtliche Rechtsrecherche durch. Das heutige Rechtsaktualitäts-Gate bleibt durch A08/A01 anhand aktueller Quellen zu dokumentieren. Eine solche Quellenprüfung darf nicht aus den technischen UI-Tests abgeleitet werden.

## Register-Fortschreibung an A01

Die dynamische Fachupdatetabelle vom 31.10.2026 sowie der dortige T-0069-Status sind gegenüber späteren Nachweisen veraltet. Folgende präzise Fortschreibung ist zulässig:

| Registerbereich | Späterer Nachweis / zulässiger aktueller Status |
|---|---|
| A03 Accounting/Finance | CP-0559 und aktuelle unabhängige Kurztests bestätigen den D-0186-Kundenslice sowie separate autorisierte AP-/Dispo-Regressionen. D-0187 bestätigt ausschließlich den synthetischen nichtbuchenden Ergebnisvergleich. Allgemeine Istkosten-/COGS-/GL-/Payroll-/Steuerkonformität bleibt ausstehend. |
| Vertrags-/Preis-UI | CP-0554: Vertrags-/Gegenangebotsreview und Browserfall mit fixiertem Preis; heutiger Rechnungs-/Receiptpfad ergänzt konkrete sichtbare Auswirkungen. |
| Unterweisung und mobile Bedienung | CP-0556: enger T-0114-Smoke und bestehende Unterweisungsnachweise; heutiger Browserpfad bestätigt die Gatewirkung vor der Produktion. Dies schließt keine gesamte Arbeitsschutz-/AÜG-Rechtsprüfung. |
| T-0069 Code-/Produkthinweis | Konkrete V3-Kennzeichnung und Kunden-/Finanzrollen wurden im beschriebenen UI-Pfad geprüft. Jahres-Smoke ist ausdrücklich ausgenommen; G10 bleibt vom unabhängigen Abschlussreview abhängig. |
| Frühere A02/A03/A05-Fachupdates zu V1-AfA, AÜG, Gründung und Sonderrechtsformen | Nicht pauschal mit CP-0554/0556/0559 schließen: Diese Nachweise betreffen andere, enger benannte Pfade. Gegebenenfalls frühere Abschlussbelege separat verlinken oder die verbleibende Einschränkung fortführen. |

Bestätigte CPs werden nicht rückwirkend geändert. Die dynamische Registertabelle darf die neueren Nachweise referenzieren; alte CP-Befunde bleiben historische Zwischenstände.

## Rollen und Autorisierung

Autor/Ausführung: A03. Codekorrektur Bank-/Dispo-UI: A03 im Auftrag von A01. Fachreview: A03 für Beträge, Ereignisgrenzen und dokumentierten rechtlichen UI-Impact. Unabhängige QA dieses A03-Codefixes: nicht durch A03; A09 separat. Browserausführung: A01, vom Auftraggeber des Reviews gemeldete Beobachtung; nicht eigenständig von A03 wiederholt. Amtlicher Rechtsquellenrefresh am 10.11.: nicht durch A03 ausgeführt.

Domain/Eventvertrag: APPROVED, bestehende D-0166/0168/0174/0177/0186/0187, Nutzerentscheidungen; keine neue Regel. Runtime/API: bestehender freigegebener Scope; diese Änderung betrifft Anzeige und Tests. Schema/Persistenz: N/A. Produktive Finanzmutation: N/A für den Fix; bestehende Simulationsevents bleiben getrennt. Release: Nutzerauftrag vom 10.11., tatsächliche Releasevalidierung/Commit/Push durch A01/A10 noch nachzuweisen.

Keine eigene Commit-/Push-Aktion und keine weiteren Änderungen an `run.js`/`run.css` in diesem Nachreview.
