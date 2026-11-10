# A08 – T-0071 EZB-Quellen-Cross-Review

**Status:** Quellenbefund bestätigt; keine Modellparameter- oder T-0063-Freigabe  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Goals/Tickets:** MG-002 / SLG-002.2, SLG-002.5 / T-0071 (T-0063 G5)  
**Stand:** 2026-11-01  
**Preflight:** CP-0476-Digest erneut geprüft; alle sieben SHA-256-Werte stimmen. Checkout `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende lokale Änderungen bleiben unangetastet.

## Quellenbefund

Die angegebene EZB-Seite [Transmission mechanism](https://www.ecb.europa.eu/mopo/intro/transmission/html/index.de.html) ist verfügbar und bestätigt: Änderungen offizieller EZB-Zinssätze wirken direkt auf Geldmarktsätze und indirekt auf von Banken gesetzte Kredit- und Einlagenzinsen. Über Finanzierungsbedingungen, Kreditangebot und Erwartungen können Investitionsentscheidungen von Unternehmen beeinflusst werden. Die EZB beschreibt die Transmissionsverzögerungen ausdrücklich als lang, variabel und unsicher; die genaue Wirkung ist daher schwer vorherzusagen.

Als ergänzende EZB-Primärquelle bestätigt die Rede [The transmission of monetary policy](https://www.ecb.europa.eu/press/key/date/2022/html/ecb.sp221011~5062b44330.en.html) den Bankkreditkanal für den Euroraum einschließlich kleinerer, nicht am Kapitalmarkt finanzierender Unternehmen. Sie berichtet, dass die Weitergabe von Marktzinssätzen an neue Bankkredite langsamer als an marktbasierten Schuldtiteln ist; die dort genannte historische Regelmäßigkeit von ungefähr sechs bis zwölf Monaten ist kontextgebundene ECB-Analyse und kein universeller Einzelunternehmens-Lag. Die EZB-Analyse [The banking channel of monetary policy tightening in the euro area](https://www.ecb.europa.eu/press/key/date/2023/html/ecb.sp230712~d950906f00.en.html) beschreibt zusätzlich den Weg über Bankkonditionen zu Finanzierungs- sowie Produktions- und Investitionsplänen von Unternehmen.

Diese Quellen stützen qualitative Richtung und plausible Übertragungsketten. Sie liefern weder eine lineare Umrechnungsformel vom MRO zu einer individuellen Firmenquote noch feste Koeffizienten, Spreads, symmetrische Reaktionen oder einen für jedes Unternehmen geltenden Lag. Bonität, Bank, Kreditart, Laufzeit, Vertrags-Reset, Kreditangebot und Unsicherheit können die tatsächliche Weitergabe verändern.

## Einordnung der T-0071-Testwerte

A03s Bericht `docs/accounting/a03-t0071-ecb-finance-review.md` dokumentiert eine fokussierte synthetische Regression mit Referenz-MRO `1,0 % p.a.`, SPI-Änderungskoeffizient `0,5`, Referenzinflation `0 %`, Lag `1 Monat`, Unsicherheitsband `±0,25 Prozentpunkte`, Spreadannahme `2 Prozentpunkte` und Laufzeitwunsch `36 Monate`. Der Faktor `0,5` ist dort eine Spielregel zur Ableitung des simulierten MRO aus dem Spiel-SPI, nicht ein aus der EZB-Transmission belegter Pass-through. Der Einmonatslag, das Unsicherheitsband, der Spread und die Laufzeit sind ebenfalls Testeingaben. Sie bleiben ausdrücklich synthetisch und unkalibriert; die EZB-Quellen geben sie nicht frei. D-0022s Referenzkorridor bleibt Benchmark, keine persönliche Kreditkondition.

Der A03-Test belegt in seinem Scope die Richtungsreaktion des unverbindlichen MRO-/Finanzierungs-Readouts, Replay und Nichtbuchung. A03 hält die A02-Simulationsreview und eine mögliche zusätzliche MRO-ausgehende Makro-/Betriebswirkung offen. Aus dem separaten SPI-Indikator folgt nicht automatisch eine solche Wirkung.

## Hinweise an A02 für T-0071

1. Quellenbefund und Szenarioannahmen getrennt tracebar halten: beobachteter EZB-Satz samt Reihe, Datum/Periode und Vintage nur dann als beobachtet kennzeichnen, wenn diese Provenienz vorliegt; synthetischen Zukunfts-/Gegenpfad mit Parameter-ID und Szenariostatus binden.
2. Für kontrollierte Zinsanhebung und -senkung jeweils Neutral- und Wirkungspaar ausweisen. Das direkt modellierte Ergebnis kann eine **unverbindliche** Finanzierungsreferenz für eine neue, ausdrücklich angefragte Finanzierung sein. Keine individuelle Bankquote behaupten und keine vorhandenen festen Kreditverträge automatisch ändern.
3. Den separaten Makro-/Betriebsindikator als eigene Wirkungshypothese mit Zielvariable, Richtung, Exposition, Periode/Lag, Unsicherheitsband, Begrenzung und Effektgruppen-/Dedupe-Regel spezifizieren. Wenn diese Werte nicht beobachtet oder anderweitig belastbar belegt sind, als synthetisch markieren. Gleiche Eingaben müssen Replay/Restore reproduzieren; Finanz-/Ledger-Nichtmutation bleibt sichtbar.
4. `0,5`, ein Monat und Spreadwerte im Testtrace/Report klar als synthetische Fixtureparameter markieren. Nicht mit EZB-Quellen begründen oder als Produktdefaults übernehmen. Der ECB-Bericht mit ungefähr sechs bis zwölf Monaten darf allenfalls als Kontext für verzögerte Weitergabe zitiert werden, nicht als pauschaler Spiel-Lag.
5. A03 muss eine konkrete Finanzierungsformel und deren Konditionen separat prüfen; A09 prüft anschließend Neutral-/Wirkungspaare, Provenienz, Lag/Unsicherheit, Dedupe, Restore und Nichtmutation. Dieser Quellenreview ersetzt keine dieser Reviews.

## Grenzen und Nachweisrollen

- **Ausführung:** A08-Quellen-Cross-Review; die genannte ECB-Seite und ergänzende ECB-Primärquellen wurden am 2026-11-01 direkt verifiziert.
- **Fachreview / A02-Simulationsreview / unabhängige QA:** durch diesen Bericht nicht ausgeführt.
- **Tests / Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** Branch/HEAD und Preflight-Hashes gelesen; keine Git-Mutation. Umfangreiche vorbestehende Änderungen nicht einzeln fachlich geprüft.
- **Änderungen:** nur dieser zugewiesene Research-Bericht; keine Produkt-, Finanz-, Architektur-, Schema- oder Rechtsänderung.
- **Ergebnis:** begrenzter Quellen-PASS für qualitative Transmission; keine Koeffizienten-, Lag-, Spread-, Firmenkonditions- oder Gesamt-T-0063-Freigabe. Nächster Adressat: A01.
