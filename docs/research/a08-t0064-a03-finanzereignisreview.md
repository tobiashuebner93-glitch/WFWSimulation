# A08 – Rechtsreview A03-Finanzereignisvertrag T-0064

**Status:** Rework erforderlich vor Gesamtabschluss (2026-10-31)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A08 – RESEARCH
**Ziel/Ticket:** MG-002 / T-0064
**Prüfumfang:** Read-only; A03-Finanzereignisvertrag gegen aktuelle A08-Rechtsmatrix und amtliche Primärtexte. Keine Finanzbeträge/-buchungen bewertet.

## PASS-Befunde

A03 trennt Plan, Vertrag und tatsächliche Finanzereignisse, Share Deal und Asset Deal sowie die Rechtsträgeridentität. Für §613a BGB und §25 HGB werden konkrete Fallprüfungen verlangt; kein Automatismus bucht oder übernimmt Schulden. §613a Abs.2 ist zeit- und sachverhaltsabhängig; Abs.3-Ausnahme wird erkannt. Rechtsformumfang wird nicht ausgeweitet.

## Nacharbeit vor Finalisierung

1. **HGB §25 Abs.1–3:** Zustimmung des früheren Inhabers zur Firmenfortführung steuert nach Abs.1 den Übergang von Forderungen, nicht die Haftung des Erwerbers für Verbindlichkeiten. Haftung und Forderungszuordnung getrennt modellieren. Abweichende Vereinbarung wirkt Dritten gegenüber nur unter Registereintragung/Bekanntmachung oder Mitteilung nach Abs.2; bei fehlender Firmenfortführung gilt Abs.3 mit besonderem Verpflichtungsgrund. A03s Inputs müssen diese Sachverhalte trennen.
2. **BGB §613a:** Quellenzeile/Normtrace enthält Abs.1/2/5/6; Text muss Abs.3 korrekt als gesetzliche Ausnahmegrenze führen und Abs.4 Kündigungsverbot wegen Betriebsübergangs an A02-Personalprozess referenzieren. A03 übernimmt daraus keine eigene HR-Buchungsaufgabe. A08-Matrix und Legalregister ergänzen Abs.2–3 samt Finanzimpact.
3. **KG-Verweis:** §161 Abs.2 HGB ordnet grundsätzlich entsprechende Anwendung der OHG-Regeln an, sofern im KG-Abschnitt nichts anderes steht; §107 Abs.1-Ausnahme bleibt referenziert. Keine stärkere pauschale Rechtsaussage.

Amtliche Quellen: [BGB §613a](https://www.gesetze-im-internet.de/bgb/__613a.html), [HGB §25](https://www.gesetze-im-internet.de/hgb/__25.html), [HGB §161](https://www.gesetze-im-internet.de/hgb/__161.html), [HGB §123](https://www.gesetze-im-internet.de/hgb/__123.html), [HGB §107](https://www.gesetze-im-internet.de/hgb/__107.html), [GmbHG §11](https://www.gesetze-im-internet.de/gmbhg/__11.html), geprüft am 31.10.2026.

A08 änderte in diesem Review keine Dateien und führte keine Tests aus. A03 soll die genannten Eingaben überarbeiten; A08 prüft danach erneut. Kein Commit/Push.
