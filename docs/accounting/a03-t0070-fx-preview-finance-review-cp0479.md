# A03 – T-0070 integrierte FX-Angebotsplanvorschau: Finanzgrenzenreview

**FINANZ-GRENZE:** PASS im geprüften Preview-/Submit-Scope  
**T-0070 / T-0063 G3:** keine Gatefreigabe durch diesen Finanzreview; Gesamtstatus bleibt PARTIAL/NONPASS bis A01 bewertet und die übrigen Reviews/Nachweise vorliegen.  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Basis:** CP-0479; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**Scope:** Read-only Sichtprüfung plus fokussierte FX-, UI-, Trade-Impact- und Run-Regressionen. Kein Produkt-/Modellentscheid, keine Codeänderung.

## Befund

Der FX-Wert wird im aktuellen Ablauf nur als freiwillige, separate Planvorschau für eine offene, noch nicht angebotene Anfrage angezeigt. `previewRunOfferFxPlan` nimmt einen expliziten hypothetischen EUR-Planbasisbetrag sowie einen expliziten USD-Exposurefaktor entgegen. Die FX-Wirkung wird als hypothetischer Planbetrag/Planindex zurückgegeben. Der Rechner verwendet nicht den eingereichten Netto-Angebotspreis als Eingabe für die FX-Multiplikation.

Die Vorschau bleibt außerhalb des schreibbaren Run-/Finance-Pfads:

- `previewRunOfferFxPlan` validiert den Run und liest die bestehende Makrotrade-Projektion; es hängt keine Events an, verändert keine FinanceState- oder Marktobjekte und gibt `directFinanceEffect: false`, `actualStateChanged: false` zurück. Die UI schreibt das Ergebnis nur in das separate `.fx-preview-output`-Element.
- Das FX-Formular und das normale Angebotsformular sind getrennt. `submitRunOffer` erhält nur Preis, direkte Kosten, BAB-Pools/Treiber und den bestehenden Sensitivitätsmodus; es nimmt kein FX-Preview-Ergebnis und keinen FX-Planbetrag entgegen. Das Preview-Formular ruft diese Submit-Funktion nicht auf.
- Das FX-Preview-Ergebnis wird nicht in `R`, direkten Angebotskosten, Kalkulationssnapshot, Vertrags-/Angebotsdaten, Einkauf, Bestand, Cash, `FinanceState`, BAB, COGS oder Ledger geschrieben. Der vorhandene Regressionstest vergleicht Run und FinanceState vor/nach Vorschau; nach separater Angebotsabgabe assertiert er, dass der gespeicherte Nettopreis dem ausdrücklich eingegebenen `R` entspricht.
- Im Trade-Impact-Trace sind `accountingClass: information_plan`, `directFinanceEffect: false`, `actualStateChanged: false` sowie die Invariante „open planning only“ gesetzt. Akzeptierte/gebundene Supplier-Plan-Snapshots werden vom Previewpfad ausgeschlossen.

Die Werte und ihre Grenzen sind für diesen Finanzscope ausdrücklich markiert. Das synthetische Fixture modelliert Januar `0,9 EUR_per_USD` als Basis und Februar `0,945 EUR_per_USD` als Veränderung. Mit dem ebenfalls synthetischen 25-%-Pass-through, Exposure 1 und ±2-%-Monatscap ergibt sich nach einem Monat Lag ein Planindex 100 → 101,25: Beobachtungsmonat Februar, Wirksamkeitsmonat März. Das ist kein tatsächlicher Einstandspreis, Lieferantenangebot oder Kostenbeleg und wird nicht auf eine Bestands-/Einkaufsbuchung angewandt.

`unit: EUR_per_USD`, `baseCurrency: USD`, `quoteCurrency: EUR`, `observedPeriod`, `effectivePeriod` und `lagPeriods` sind im Fixture/Trace explizit. Die ECB-Reihenkennung `EXR.D.USD.EUR.SP00.A` bezeichnet USD je EUR und wird im Fixture als Kontextmetadatum `context_only_not_used_as_transaction_quote_or_cost` geführt. Die inverse Richtung zur synthetischen `EUR_per_USD`-Fixturequote wird im UI-Hinweis benannt. Keine ECB-Zahl speist die Vorschauformel.

## Code-/Regressionbelege

- `prototype/v3/run.js:291` Previewfunktion, `:331` getrennte `submitRunOffer`-Signatur, `:510–519` Render-/Formularhinweise, `:1005–1025` Preview-Submit-Handler (nur Ergebnis-/Statusanzeige), `:1027` separates `.offer-form`-Submit.
- `prototype/v3-macro-trade-impact.js:41–87` bildet FX nur für das offene synthetische USD-Importplan-Target als Information-/Planindextrace ab; akzeptierte Pläne werden ausgespart.
- `prototype/v3-run-macro-fixture.js:10–17,47–59` enthält synthetische Serien-/Einheiten-/Kontextmetadaten; `:47–60` bindet Fixturequote und Zeitraum.
- `prototype/v3-fx-offer-plan-preview-regressions.mjs` prüft tatsächliches offenes Angebot, Lag/Beobachtungs-/Wirksamkeitsmonat, explizite EUR/USD-Einheiten, unveränderten R, Run- und FinanceState-No-Mutation, neutrale/fehlende/gesperrte Fälle, Save/Restore sowie gespeicherten Angebotspreis nach separatem Submit.
- `prototype/v3/a05-t0070-fx-offer-ui-regressions.mjs` prüft die getrennte Previewform, ausschließlich hypothetische Eingaben, keine Preis-/Angebotsfelder im Previewformular, Neutral-/Blocked-/Ready-Anzeige, Einheiten-/Richtungstext und Startformvorauswahl. Dies ist ein Rendering-/Markuptest, kein visueller Browser-/Gerätetest.

Ausgeführt, alle PASS:

- `node --check prototype/v3/run.js`
- `node --check prototype/v3-run-orchestrator.js`
- `node --check prototype/v3-run-macro-fixture.js`
- `node prototype/v3-fx-offer-plan-preview-regressions.mjs`
- `node prototype/v3/a05-t0070-fx-offer-ui-regressions.mjs`
- `node prototype/v3-macro-trade-impact-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`

Kein Volljahreslauf und kein Browser-Smoke. Der Finanzgrenzenbefund gilt für den geprüften Code-/Regressionumfang. A09s unabhängiger Re-Review ist nicht Teil dieses Auftrags.

## Preflight und Quellenabweichung

CP-0479 nennt Branch/HEAD `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266` und 472 Status-Einträge. Beim hiesigen Check waren Branch/HEAD gleich, der parallele Arbeitsbaum hatte 589 Einträge. Alle sieben aktuellen Control-Plane-Hashes stimmten mit CP-0479 überein. Dateien mit im Auftrag erwarteten Prüfsummen stimmten überein, außer dem A02-Bericht: der aktuelle `docs/simulation/a02-t0070-fx-offer-plan-implementation-report.md` hat SHA-256 `72ACA51C4D06FB18689BFEFFFE4B5B5AB6001D2C3ADC7E71DE9FD711832E6043`, statt des übergebenen `51BC3887B5D8B14BBE492077387E0375ED702C88066F2564778AEBDDAAF2C0F9`. Dieser Bericht wurde vollständig erneut gelesen und gegen den aktuellen Code abgeglichen.

Der aktuelle A02-Bericht enthält noch den älteren Stand, wonach A05-Angebotsformularintegration aussteht. Die tatsächlich vorliegenden `prototype/v3/run.js`, `prototype/v3/run.html`, `prototype/v3/run.css` und `prototype/v3/a05-t0070-fx-offer-ui-regressions.mjs` stimmen dagegen mit den übergebenen A05/UI-Hashes überein und enthalten die separate integrierte Previewform samt Regression. A08s Quellenreview stimmt mit seinem übergebenen Hash überein. Der Hash-/Dokumentationsversatz ändert den oben belegten Read-only-Finanzbefund nicht; A01 sollte A02s Statusbericht bei der Ticketfortschreibung aktualisieren.

## Reviewentscheidung / nächste Abhängigkeiten

**A03-Finanzgrenze: PASS.** Im geprüften Ablauf wird die FX-Vorschau weder als Istkostenwert noch als Zahlungsverpflichtung, Buchungsgrundlage oder Angebots-/Vertragsanpassung behandelt. Preview und Submit sind fachlich getrennt; Preis, Snapshots und FinanceState werden durch die Vorschau nicht verändert.

Das ist kein Nachweis tatsächlicher betrieblicher Kostenwirkung oder eines empirischen FX-Modells. Es belegt nur einen expliziten, synthetischen Planinformationswert für einen offenen fiktiven Importplan. A08s Hinweis, dass keine Ist-Bestellung/operative Kostenposition gebunden ist, bleibt materiell; A09-/Browserreview und A01s Beurteilung der G3-Anforderung „echte Spieloption/Firmenvariable“ bleiben offen. Keine Gate-Schließung und keine Finanz-/Produktregeländerung wird empfohlen.
