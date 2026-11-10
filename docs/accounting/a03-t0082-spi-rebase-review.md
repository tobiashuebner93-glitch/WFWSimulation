# A03 – T-0082 SPI-Rebase unabhängiger Fachreview

**Ergebnis:** **FAIL für T-0082 als vollständigen Vektor-/Reihenreview**  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Ticket:** T-0082 / T-0063 G6  
**Prüfgrenze:** Read-only Review; keine Änderung an Implementierung, Test, Regel oder offiziellem Warenkorb.

## Preflight

Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; 530 Status-Einträge vor diesem Review. Sieben Governance-Hashes stimmen mit A01s Übergabe überein. Der A03-Rebasevektorbericht hat SHA-256 `34F1E06A7B9F3CDF4588C07E754F0193893F577E1DA8240E7F54E368CE5C89C9`.

A02-Bericht `docs/simulation/a02-t0082-spi-rebase-implementation-report.md` wurde gegen den aktuellen Bytehash geprüft: `984B21C3F815A1E948B54F32BE7B4E330D15D3C5EC27F13A9105FADED50CE01A` – stimmt mit dem von A01 gelieferten Digest überein.

## Geprüfte Punkte

- **Rebaseformel – PASS:** `100 × SPI_alt,t / SPI_alt,neueBasis` ist für eine reine Umnormierung desselben Aggregatindexes mathematisch richtig. Der Testvektor liefert Basis `100`, Folgeindex `100,2579127225…` und m/m `0,2579127225… %`; Anzeige mit zwei Stellen ergibt `100,00`, `100,26`, `0,26 %`. Das ist ein nichtmonetärer Index; Cent-Rundung wäre unpassend.
- **Gewichte/Warenkorb – PASS im begrenzten Umfang:** Bestehende offizielle 2020-COICOP-Gewichte bleiben unverändert; `V3-SPI-COICOP12-v1` wird erzwungen. Es wird keine amtliche neue Basketversion oder Gewichtsumstellung behauptet. Die A03-Handrechnung stimmt mit Gewicht COICOP 04 `259,25‰` und synthetischen Komponenten `102`/`103` überein: alte Aggregatwerte `100,51850`/`100,77775`.
- **Quellen-/Fixture-/Komponentenbindung – PASS im geprüften Schema:** Helper verlangt Basisperiode, Basketversion, SourceRef und Fixture-ID. Die komplette Beobachtungsreihe und genau zwölf Komponentenprovenienz-Einträge müssen dieselben Angaben führen. Gemischte Basketversion, Komponentenbasis, Quelle, Fixture, fehlende Komponente, doppelte/ungeordnete Perioden und fehlende Metadaten werden in Regressionen abgewiesen.
- **Alte Eingabe unverändert / Replay – PASS für den reinen Helfer:** Die Regression vergleicht die Originalhistorie vor/nach dem Aufruf und beweist keine Eingabemutation. Die alte `v1`-SPI-Berechnung bleibt ausführbar. Die neue Reihe ist aber nur eine zurückgegebene Projektion; es gibt keine persistierte Spielhistorie oder Save/Restore-Auswirkung, die dieser Helper absichern könnte.
- **Neue offizielle Basketversion – korrekt ausgeschlossen:** Helper lässt ausschließlich die existierende `V3-SPI-COICOP12-v1` zu. Das ist passend, solange A08 keine neuen amtlichen Gewichte und passenden Komponenten belegt. Der synthetische Basisperiodenwechsel darf nicht als Basket-/Wägungsschemawechsel ausgegeben werden.

## Blockierender Befund: Periodenlücken

`rebaseV3SpiHistory` verlangt nur eindeutige, chronologisch sortierte `YYYY-MM`-Labels. Es verlangt keine lückenlose Monatfolge. m/m wird stets gegen die vorherige Arrayzeile und y/y gegen `observations[position - 12]` gerechnet. Dadurch können „Vormonat“ und „vor zwölf Monaten“ nicht mehr den Kalendermonaten entsprechen, obwohl der Helper Zahlen ausgibt.

Ich habe dies ohne Dateimutation reproduziert: eine Serie mit 13 Beobachtungen `2027-01`, dann `2027-03` bis `2028-02` (fehlend `2027-02`), alle mit gleicher Version/Provenienz, gibt für `2028-02` eine y/y-Rate `0,2579127225… %` zurück. Der Vergleichswert ist dabei `2027-01`, also 13 Kalendermonate zuvor, statt des fehlenden `2027-02`. Bei einer Lücke innerhalb der Folgeperiode kann derselbe Indexmechanismus auch eine m/m-Rate gegen einen älteren Monat bilden.

A02s aktuelle T-0082-Regression besteht, weil sie eine zusammenhängende Jan-2027–Jan-2028-Serie verwendet. Sie testet nicht den Gap-Fall. `node prototype/v3-price-index-regressions.mjs` wurde im Review erneut ausgeführt und besteht; dieser PASS deckt den gefundenen Kalenderfehler nicht ab.

## Kleinster Korrekturauftrag an A02

1. Vor Berechnung monatlicher Raten müssen die Beobachtungsperioden auf exakt aufeinanderfolgende Kalendermonate geprüft werden; andernfalls fail-closed ablehnen oder Raten für betroffene Lücken als `null` behandeln (die gewählte Semantik ist im Vertrag/Test ausdrücklich zu benennen).
2. Ergänze Regressionen mit einer fehlenden Zwischenperiode vor der Basis und innerhalb der Folgeperiode. Belege, dass kein m/m/y/y-Vergleich über falsche Kalendermonate ausgegeben wird.
3. Ergänze eine positive Prüfung, dass bei 12 zusammenhängenden Vorperioden derselben Version y/y berechnet wird und bei weniger als 12 zusammenhängenden Vorperioden `null` bleibt.
4. Für die klare Herkunft des Mathevektors wäre es wünschenswert, die beiden Aggregatwerte im Test unmittelbar aus zwölf Komponenten und den bestehenden Gewichten zu berechnen, bevor die Rebasefunktion geprüft wird. Das ist eine Robustheitsverbesserung, nicht der primäre Fail-Befund.

## Übergabe an A01

T-0082 erhält **FAIL**, obwohl die konkrete zweiperiodige Basiswechselrechnung, Quellenbindung, Provenienz-Negativfälle und Nichtmutation bestehen. Der Helper kann bei lückenhaften Beobachtungsreihen falsche Kalendervergleichsraten erzeugen. T-0063 G6 bleibt bis zur Korrektur und A09-Re-Review offen. Der T-0077 Monatsgrenzen-Ledgercheck ist fachlich unabhängig und kollidiert nicht mit T-0082.

Keine Code-/Teständerung; keine weitere Regression nach dem beschriebenen isolierten Repro; kein Commit/Push.
