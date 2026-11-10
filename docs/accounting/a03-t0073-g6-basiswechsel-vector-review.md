# A03 – T-0073/G6 Preisindex-Basiswechselreview

**Status:** Review vorbereitet; kein Implementierungs-PASS für G6  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Ticket:** T-0073 / T-0063 G6 Inflationsmessung  
**Scope:** Read-only Fachreview und handprüfbarer Testvektor. Keine Runtimeänderung, keine neue Produktregel und keine offizielle CPI-Neukalibrierung.

## Preflight

Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`, 519 Status-Einträge. Bestehende Änderungen blieben erhalten.

- AGENTS: `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556`
- Agentenstruktur: `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3EE`
- Rechtematrix: `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE`
- Goals: `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D`
- Ticket Board: `D3D2A24FF53AA685306B527FB9523F1DB7F18B41171D4557F6F9B54289ACB915`
- Collaboration State: `B3669CC837CFC3842CBFD2565D31217FB7794CB2B6D113E18A9E84644AC54C2F`
- Decision Log: `1EA4649C21FCC505BD4A9931CB7B9C16656A0A9F2BB88DF07E3460ADAACEB`
- T-0063/T-0069 minimal gates: `11FB1675FAE5491FB7FBDBCA1D787DA82FFD761050D9FD39260D0E0CA62CE03C`

## Fachliche Grundlage

Der A02-Simulationsvertrag `docs/simulation/a02-t0063-v3-makro-simulationsvertrag.md` beschreibt zwölf COICOP-Komponenten, Gewichte in Promille mit Summe 1.000, die komponentenweise Normierung `100 × price_i,t / price_i,Basis`, gewichtete Aggregation, m/m/y/y-Formeln, keine Voraggregation-Rundung und Anzeige von Index/Raten auf zwei Dezimalstellen. Synthetische Werte sind als solche zu markieren. Der Vertrag verlangt bei einem neuen veröffentlichten Basisjahr/Wägungsschema eine neue Basketversion und Erhalt älterer Versionen für Replay.

Für einen **reinen Wechsel des Bezugszeitpunkts mit unverändertem Warenkorb und unveränderten Gewichten** folgt aus der Indexdefinition die Rebaseformel:

```text
SPI_new,t = 100 × SPI_old,t / SPI_old,newBase
```

Der neue Basiszeitpunkt wird damit exakt 100. Die m/m- und y/y-Raten bleiben gleich, wenn Zähler und Vergleichsmonat mit derselben Konstante rebasiert werden. Das Ergebnis ist eine Rechenkonvention für denselben Basket. Eine echte neue offizielle Basket-/Gewichtsversion braucht ihre dazu passenden dokumentierten Gewichte und Komponenten; sie darf nicht durch diesen Testvektor vorweggenommen werden.

## Handprüfbarer synthetischer Vektor

Fixture-Zweck: Ein einzelner Basisperiodenwechsel bei gleichem Warenkorb. Werte sind **synthetische Testindizes**, keine Destatis-Monatsdaten. Alle elf ungenannten COICOP-Komponenten stehen jeweils auf `100,00000`.

| COICOP | Gewicht ‰ | Neue Basisperiode | Folgeperiode |
|---|---:|---:|---:|
| 01 | 119,04 | 100,00000 | 100,00000 |
| 02 | 35,26 | 100,00000 | 100,00000 |
| 03 | 42,25 | 100,00000 | 100,00000 |
| 04 | 259,25 | 102,00000 | 103,00000 |
| 05 | 67,78 | 100,00000 | 100,00000 |
| 06 | 55,49 | 100,00000 | 100,00000 |
| 07 | 138,22 | 100,00000 | 100,00000 |
| 08 | 23,35 | 100,00000 | 100,00000 |
| 09 | 104,23 | 100,00000 | 100,00000 |
| 10 | 9,06 | 100,00000 | 100,00000 |
| 11 | 47,20 | 100,00000 | 100,00000 |
| 12 | 98,87 | 100,00000 | 100,00000 |
| **Summe** | **1.000,00** | | |

Auf dem bisherigen Referenzmaßstab ergibt die gewichtete Formel:

```text
SPI_old,newBase = 100 + (259,25 / 1.000 × (102 − 100)) = 100,51850
SPI_old,next    = 100 + (259,25 / 1.000 × (103 − 100)) = 100,77775
SPI_new,newBase = 100 × 100,51850 / 100,51850 = 100,00000
SPI_new,next    = 100 × 100,77775 / 100,51850 = 100,2579127225…
```

Raten und Anzeige:

```text
m/m = 100 × (100,77775 / 100,51850 − 1) = +0,2579127225… %  → Anzeige +0,26 %
y/y = nicht verfügbar, solange kein Vergleichswert aus derselben Version vor 12 Monaten vorliegt
```

Bei einer späteren vollständigen Historie wird y/y nach `100 × (SPI_new,t / SPI_new,t−12 − 1)` berechnet. Es gibt bei diesem Index **keine Cent-Rundung**: Indexpunkte und Prozentwerte behalten interne Präzision; nur die Anzeige wird gemäß Vertrag auf zwei Dezimalstellen gerundet. Keine Komponentenwerte vor der Aggregation runden.

## Aktueller Codebefund

`prototype/v3-price-index.js` enthält die konstanten `V3_SPI_COICOP12-v1`-Gewichte und `calculateV3SpiPeriod(componentIndexes, priorMonthlyIndexes)`. Es prüft zwölf positive Komponenten und die vorhandene Monats-/Jahreshistorie. Es führt aber kein `basisPeriod`, keine alternative Basketversion und keine komponentengebundene Basisperiode. Damit kann es den obigen Rebase nicht ausführen oder eine Vermischung alter/neuer Basen erkennen.

Die aktuelle Funktion wurde mit dem Folgevektor gegen die bestehende API geprüft: `calculateV3SpiCOICOP12` gibt `100,77775000000001` auf der alten Referenz aus. Bei `priorMonthlyIndexes=[100,5185]` berechnet sie die dokumentierte m/m-Rate `0,2579127225… %`; ohne ausreichende Historie bleibt y/y `null`. Das ist erwartbar, aber kein Basiswechselnachweis. `prototype/v3-price-index-regressions.mjs` prüft konstante Preise, Einzelkomponentenänderungen, 12-Monatsrate und fehlende Historie; es enthält keinen Rebase-Vektor, keine Versionstrennung und keine Mixed-basket-Negativprüfung.

Die Regression `node prototype/v3-price-index-regressions.mjs` wurde im Review nicht erneut ausgeführt; die API wurde direkt mit dem oben ausgewiesenen synthetischen Vektor aufgerufen. Der vorherige A09-Bericht CP-0488 nennt die bestehende Suite als bestanden.

## G6-Urteil / Übergabe

**G6 bleibt FAIL**, bis A02 den Vektor als Regression implementiert und verifiziert. Um ohne neue Fachannahme zu bestehen, muss die Umsetzung mindestens:

1. den neuen Bezugszeitpunkt als expliziten Testinput führen und für unveränderten Basket das Aggregat mit `100 × SPI_old,t / SPI_old,newBase` rebasierten;
2. am neuen Basiszeitpunkt exakt 100 sowie den Folgeindex 100,257912… und m/m +0,257912… % ergeben; die Ausgabe zeigt 100,00 / 100,26 sowie 0,26 %;
3. y/y ohne zwölf gültige Vorperiodenwerte derselben Indexversion als `null` belassen und mit vollständiger Historie denselben Rebasefaktor auf beide Vergleichswerte anwenden;
4. Basisperiode, `basketVersion`, Komponentenbasis und Quellen-/Fixture-ID binden; alte Version für Replay erhalten; inkompatible/fehlende Versionen und gemischte Komponenten fail-closed abweisen;
5. erst dann eine neue offizielle Basketversion aufnehmen, wenn A08 die dazu passenden Quellen und Gewichte bestätigt hat. Der synthetische Vektor selbst gibt keine amtlichen Werte frei.

**T-0077-Abgrenzung:** A03s separat ergänzte T-0077-Monatsgrenzen-Regression ist ein Kundenforderung/Bank-Eingang-Slice in der Finance-Ledgerprojektion. Der T-0073/G6-Vektor ist reine SPI-Normalisierung. Beide nutzen Periodenbegriffe, aber keine gemeinsame Daten oder Runtime-Invarianten; kein fachlicher Konflikt.

Keine Codeänderung, kein Commit/Push. Empfohlener nächster Adressat: A02 für den kleinen versionierten SPI-Rebase-Test und A09 anschließend zur unabhängigen Gate-Re-Review.
