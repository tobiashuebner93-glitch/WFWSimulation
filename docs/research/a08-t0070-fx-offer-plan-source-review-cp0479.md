# A08 – T-0070 FX-Planvorschau: Quellen- und Annahmenreview

**STATUS:** PARTIAL – Quellen-/Richtungsreview bestanden mit einem Metadatenfix; keine Gatefreigabe
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A08 – RESEARCH
**GOAL/TICKET:** MG-002 / SLG-002.2 / T-0063 G3 / T-0070
**BASIS:** CP-0479; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight

Branch/HEAD und alle sieben Control-Plane-Prüfsummen aus CP-0479 geprüft; sie stimmen. Der Status war bei Übernahme 474 Einträge; parallele Änderungen wurden nicht berührt. Geprüft wurden A02s Implementierungsbericht sowie `v3-run-macro-fixture.js`, `v3-macro-trade-impact.js`, der Orchestrator-Validierungspfad und die FX-Preview-Regression. Kein Code-/Ticketstatus geändert.

## Review

Die Modellrichtung und Rechnung sind als **synthetische Plan-Sensitivität** konsistent: `0,9 EUR je USD` steigt auf `0,945 EUR je USD`, also um 5 %. Ein USD-Import wird damit in der EUR-Betrachtung teurer. Bei 25 % Pass-through ergibt sich `5 % × 25 % = 1,25 %`; ein Planindex von 100 wird 101,25. Der Planbetrag wird separat mit diesem Index skaliert. Der Code begrenzt die Wirkung zusätzlich auf ±2 % und verwendet den FX-Stand mit einem Monat Verzögerung. Diese Parameter sind klar als synthetische Testannahmen zu behandeln; weder die Werte noch 25%-Weitergabe, einmonatiger Lag oder 2%-Kappung werden durch die Quellen empirisch bestätigt oder für ein bestimmtes Unternehmen kalibriert.

Die Referenzrichtung ist ein zentraler Abgrenzungspunkt: Das Fixture modelliert `EUR_per_USD` (EUR-Kosten je USD). Die ECB-Reihe `EXR.D.USD.EUR.SP00.A` ist dagegen `USD_per_EUR` (USD je EUR). Die EZB-Seite quotiert ihre Referenzwerte ausdrücklich gegen den Euro und bezeichnet sie als Informationswerte; die Nutzung für Transaktionen wird stark abgeraten. Für den 30.10.2026 nennt die Seite 1 EUR = 1,1172 USD. Das entspricht reziprok etwa 0,895095 EUR je USD; dieser Wert ist hier nur ein Richtungsbeispiel und wird nicht als Fixture-Input empfohlen. [EZB-Referenzkurse, 30.10.2026](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) [EZB Data Portal – FX series](https://data.ecb.europa.eu/data/datasets/EXR/EXR.D.USD.EUR.SP00.A)

Der Code hält die EZB-Reihe als Kontext, nicht als Transaktionskurs oder Kosteninput. Damit ist die Nichtverwendung fachlich richtig abgegrenzt. **Korrekturbedarf:** `ECB_REFERENCE_CONTEXT.sourceSeriesId` ist derzeit `EXR/D.USD.EUR.SP00.A`; die kanonische EZB-Reihenkennung ist `EXR.D.USD.EUR.SP00.A` (Punkte, kein Schrägstrich nach `EXR`). Außerdem sollte die UI die entgegengesetzte Quotierungsrichtung ausdrücklich benennen, falls diese Kontextmetadaten sichtbar werden. Kein FX-Referenzwert soll automatisch invertiert oder für die Vorschau verwendet werden.

Die FX-Preview-API und der Bericht trennen Plan-Sensitivität von Angebotspreis, angenommenem Vertrag, Einkauf, Bestand, Cash, Finanzzustand und Ledger. Die Dokumentation benennt die Werte als hypothetisch und nichtbuchend. Damit ist der derzeitige didaktische Planpfad als Szenario klar abgegrenzt. Die Quellen belegen allerdings nur die allgemeine Richtung, dass Wechselkurse Importpreise beeinflussen; sie belegen keine individuelle Preisweitergabe oder konkrete Kostenschwankung dieses Unternehmens. [EZB-Erklärung zur Wirkung von Wechselkursen auf Importpreise](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/role_of_exchange_rates.en.html)

## Bewertung / nötige Folgearbeit

- **Quellenabgrenzung:** PASS mit kleinem Metadatenfix der Reihenkennung und optionaler UI-Klarstellung der inversen Quote.
- **Annahmen-/Einheitenklarheit:** PASS im Backendbericht; UI muss `EUR/USD-Planindex` und „synthetische Sensitivität, keine tatsächlichen Lieferantenkosten/Bankkurse“ zeigen.
- **Empirische Kalibrierung:** nicht vorhanden und für dieses synthetische Testfixture auch nicht behauptet; dies darf nicht als Marktprognose bezeichnet werden.
- **T-0070/G3:** aus A08-Sicht nicht freigegeben. Browser-/Formularintegration und A03-/A09-Reviews fehlen; zusätzlich belegt die Preview zunächst einen hypothetischen Informations-/Planwert, keinen Ist-Einkauf oder tatsächliche Änderung einer operativen Kostenposition. A01 muss die Forderung „zwei echte Spieloptionen/Firmenvariablen“ anhand des integrierten UI-Nachweises und der Abnahmekriterien bewerten.

**Tests:** A02s berichtete FX-Preview-/Trade-Impact-Regressionen nicht erneut ausgeführt; diese Prüfung war Quellen-/Methodenreview. Browser-/Gerätetest nicht ausgeführt. Keine Produkt- oder Modelländerung, kein Commit.

**Nächste Adressaten:** A02 für die falsche `sourceSeriesId` und die sichtbare Richtungsbeschriftung; A05 für die UI-Hinweise; anschließend A03 für Finanz-Nichtmutation und A09 für Replay/State-/UI-Regressionsreview. Antwort und Folgefragen an A01.
