# A03 – T-0082 SPI-Rebase unabhängiger Re-Review

**Ergebnis:** **PASS für den korrigierten T-0082-Vektor und Kalenderlücken-Gate**  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Ticket:** T-0082 / T-0063 G6  
**Prüfgrenze:** Read-only Fachreview der Korrektur; keine Code-, Basket-, Schema- oder Produktregeländerung.

## Preflight

A01 meldete HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, Statusumfang 535 und unveränderte Governance-Hashes gemäß vorangehendem T-0082-Review. Die hier geprüften Dateien stimmen mit den gemeldeten SHA-256-Werten überein:

- `prototype/v3-price-index.js`: `8EF2FC0381DCC1443BB180867E38464184C9793F53ECA6ADC424BBDB8A077923`
- `prototype/v3-price-index-regressions.mjs`: `CA7963DF63355A674BB27DB64FCE06C095EE8A7E8EA068F613872083C42F58BF`

## Historischer Befund

Der frühere Bericht [a03-t0082-spi-rebase-review.md](a03-t0082-spi-rebase-review.md) bleibt unverändert und dokumentiert den damaligen **FAIL**: eindeutige, sortierte Monatslabels reichten aus, sodass Monatslücken falsche m/m- oder y/y-Vergleiche ermöglichen konnten. Dieser Befund war korrekt für den damals geprüften Code. Der vorliegende Re-Review ersetzt oder überschreibt ihn nicht; er bewertet ausschließlich die spätere Korrektur.

## Re-Review-Ergebnis

- **Kalendermonatslücken – PASS:** Die Rebase-Funktion verlangt nun lückenlos aufeinanderfolgende `YYYY-MM`-Perioden. Der zuvor reproduzierte Fall Jan 2027, fehlender Feb 2027, danach Mär 2027 bis Feb 2028 wird fail-closed mit `consecutive calendar months` abgewiesen. Dadurch werden Arraypositionen nicht mehr als falsche Kalendermonate für m/m/y/y verwendet.
- **Rebase-Vektor – PASS:** Rebase bleibt `100 × SPI_alt,t / SPI_alt,neueBasis`. Für die dokumentierten Werte `100.5185` und `100.77775` ergibt sich `100`, `100.2579127225` und m/m `0.2579127225 %`. Die Regression bestätigt Anzeige auf zwei Dezimalstellen (`100.00`, `100.26`, `0.26 %`) bei erhaltener interner Präzision.
- **y/y-Verfügbarkeit – PASS:** Eine unabhängige Probe mit 12 lückenlosen Monatsbeobachtungen belässt y/y am letzten Beobachtungspunkt auf `null` (nur elf Vorperioden). Mit 13 lückenlosen Beobachtungen wird y/y berechnet und ergibt `0.2579127225 %` (Toleranz `1e-10`), also den Vergleich mit genau zwölf Kalendermonaten zuvor.
- **Version, Quellenbindung und Basketgrenze – PASS:** Die Funktion verlangt dieselbe Basketversion `V3-SPI-COICOP12-v1`, Komponentenbasis, `sourceRef`, `fixtureId` und genau zwölf passende Komponenten-Provenienzbelege. Gemischte oder fehlende Provenienz wird abgewiesen. Die Gewichte und die bestehende Basketversion bleiben unverändert; der Rebase setzt einen Referenzzeitpunkt und deklariert keine neue offizielle Basket-/Wägungsversion.
- **Historie und Mutation – PASS im geprüften Helper-Scope:** Die Rebase-Regression prüft, dass Eingabeobachtungen unverändert bleiben. Die bisherige Berechnungsversion und ihre Gewichte bleiben für Replay erhalten. Persistenz, Save/Restore und ein vollständiger Spielhistorien-Replay sind nicht Teil dieses isolierten Helpers und werden durch diesen PASS nicht behauptet.

## Ausgeführte Prüfungen

- `node prototype/v3-price-index-regressions.mjs` – **PASS** (`V3 SPI COICOP12 regressions: PASS`).
- Unabhängige Node-Probe für Jan/Mar-Kalenderlücke, 12-Monats-Nullgrenze und 13-Monats-y/y-Wert – **PASS**.

## Übergabe an A01

Der konkrete **T-0082-Rebase-Vektor besteht** nach der Korrektur. Diese Bewertung gilt nur für den geprüften T-0082-Umfang. Sie schließt weder T-0063 insgesamt noch T-0069/Jahresintegration, Browser-/Mobilpfade oder eine empirische Preisindexkalibrierung ab. Keine Codeänderung, kein Staging, Commit oder Push durch A03.
