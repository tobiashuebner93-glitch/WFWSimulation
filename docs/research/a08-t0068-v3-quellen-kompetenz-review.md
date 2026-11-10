# A08 Reviewnachtrag – T-0068 Quellen- und Kompetenzzuordnung

**Status:** Read-only Fachreview abgeschlossen; A06-Korrektur und A07/A09-Gates offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0068  
**Prüfdatum / Quellenstand:** 2026-10-31  
**Vorgänger:** CP-0280 (ENTWURF); A06-Mapping und Ereignisfragenstand vom 2026-10-31  
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket Board, Collaboration State, D-0159/D-0161/D-0163/D-0164, Rechtsrahmenregister, CP-0280, A02-Statusvertrag sowie Repo-Status/Diff frisch geprüft.

## Prüfauftrag und Grenze

Geprüft wurden alle 50 Quellen- und Kompetenzverweise im A06-Ereignisfragenkatalog und die Eventzuordnungen in der V3-Kompetenzmatrix. Alle 50 referenzierten Kompetenz-IDs sind in der vorhandenen Kompetenzlandkarte vorhanden. Dieses Review prüft Quellenprovenienz und Kompetenzpassung; Antwortschlüssel und Distraktoren gehören zum A07-Review, Nichtmutation/Vollständigkeit zum A09-Review. A06-Lerninhalte wurden nicht geändert.

## Quellenmodell und Traceability

Der Katalog verwendet lokale Kürzel S1–S5, die nicht mit den S1–S5 des Kompetenzlandkarten-Quellenregisters identisch sind. Insbesondere bezeichnet S2 dort eine IHK-Quelle, im Ereigniskatalog aber A08s T-0063-Quellenbericht; S5 bezeichnet dort das historische IHK-Offenbach-Raster, hier dagegen A08 T-0064/Legal Register. Die lokale Legende macht die Kürzel innerhalb des Ereigniskatalogs verständlich, aber ihre Wiederverwendung erzeugt bei Querverweisen und Zusammenführung ein Namespace-Risiko.

Die Legende verweist auf Quellenpakete und erklärt, dass Prüfer die genaue Quelle pro Item bestätigen müssen. Die Items selbst nennen überwiegend nur diese Paketcodes, nicht einzelne Normen, amtliche Datenreihen, konkrete URLs/Fundstellen oder ausgewiesene Modellannahmen. Traceability ist deshalb teilweise, nicht itemweise abgeschlossen.

Für die Überarbeitung sind Quellenarten pro Item zu unterscheiden:
- **Primär-/Fachquelle:** konkrete Norm/Fundstelle, amtliche Datenreihe oder fachliche Institution samt Bezugsstand.
- **Nutzerentscheidung:** D-ID für bestätigte Produkt-/Modellentscheidung, nicht als Rechtsquelle.
- **Spielvertrag:** A02-/A03-Vertragsabschnitt für modellinterne Zustände.
- **Synthetische Annahme:** ausdrücklich als Szenario/Seedannahme, nicht als amtlicher oder empirischer Befund.
- **Kompetenzableitung:** Kompetenzlandkarte als Lernzuordnung, nicht als wörtliche IHK-Vorgabe.

Empfehlung: direkte Fundstellen je Item oder namespaced Quellen-IDs verwenden und Quellen-/Kompetenz-Namespaces nicht unmarkiert zusammenführen.

## Itemreview: konkrete Quellen- und Kompetenznacharbeit

| Items | Befund / erforderliche Korrektur |
|---|---|
| EVT-001–006 | Bundesbank/OECD/Destatis und A02-Modellvertrag passen grundsätzlich zu Zyklus, Frühindikatoren und Modellzuständen. Monatliche Anfrageeingänge ausdrücklich als synthetisch/seedbasiert statt als amtliche Unternehmensreihe markieren. |
| EVT-007–014 | EZB-Wechselkurs-/Transmissionsquellen passen grundsätzlich. D-0163 in EVT-013/014 ist Modellentscheidung zu Kreditverträgen, keine externe Primärquelle; beide Provenienztypen trennen. |
| EVT-015–028 | Institutionelle Quellen sind allgemeine Grundlagen, belegen aber nicht jede Maßnahme/Wirkungsstärke. EVT-020 nennt eine Umweltregel ohne Norm, Geltungsbereich oder Inkrafttreten; D-0161 ist dafür keine Rechtsquelle. Bei realer Regel die konkrete Primärnorm/Behördenquelle und Anwendung nennen, sonst als synthetische Prüfsituation kennzeichnen. EVT-021 benötigt nur bei einem realen Förderprogramm dessen Bedingungen; andernfalls generische Modellannahme. EVT-026 bleibt hypothetischer Tarifkonflikt; ein Tarifregister ist kein Primärbeleg für konkrete Streikrechtsfolgen oder tatsächlichen Arbeitsausfall. |
| EVT-029–032 | Destatis-VPI-Methode und A02-SPI-Vertrag stützen Spielindex und Rechenlogik. Pro Item konkreten Anker zu Basis, Gewicht oder Formel statt nur allgemeinem Paket nennen. |
| EVT-033 | Preiselastizität ist mit S1/S3/S4, aber ohne spezifischen Konzeptquellenanker referenziert. WFachwPrV §4 ist Prüfungs-/Lernanker, kein inhaltlicher Konzeptbeleg. Fachquelle oder ausdrückliche didaktische Modellannahme ergänzen. |
| EVT-035 | Die Aussage, ein Mittelwert bei kleiner Stichprobe sei begrenzt zu nutzen, benötigt eine Statistikmethodikquelle oder Kennzeichnung als allgemeine methodische Lernregel; S3 allein ist Spielvertrag. |
| EVT-041–042 | Gründung und Rechtsformvergleich passen als Kompetenzen. WFachwPrV §4 belegt den Prüfungsbereich, nicht einzelne Haftungs-/Vertretungsaussagen; für konkrete Rechtsbehauptungen passende Primärnormen aufnehmen. Für eine KG vor Registereintragung ist HGB §123 Abs. 1 ausdrücklich über die Verweisungsnorm HGB §161 Abs. 2 herzuleiten; für die GmbH gilt die Abgrenzung in GmbHG §11. [HGB §161 Abs. 2](https://www.gesetze-im-internet.de/hgb/__161.html), [HGB §123](https://www.gesetze-im-internet.de/hgb/__123.html), [GmbHG §11](https://www.gesetze-im-internet.de/gmbhg/__11.html). |
| EVT-043 | Prüft derzeit D-0163-Produktumfang („GmbH & Co. KG in V3 spielbar“), nicht fachliche Rechtsformkompetenz. Fachlich umformulieren, etwa getrennte GmbH-/KG-Rechtsträger, Vertretung oder Haftungsgrenzen mit HGB-/GmbHG-Fundstellen. Keine weitere Form freischalten. |
| EVT-044 | Gemeinsamer Einkauf beschreibt zunächst wirtschaftliche Kooperation, nicht automatisch eine bestimmte Rechtsform. Frage/Erklärung präzisieren; konkrete rechtliche Einordnung mit BGB §§705 ff. sowie gegebenenfalls GWB §1/AEUV Art.101 samt Bedingungen belegen. |
| EVT-045–050 | D-0162/A02/A03 sind passende Spielregelquellen, keine externen Rechtsquellen. Spielkonventionen als D-ID/Vertrag kennzeichnen. EVT-050 ist Produktlebenszykluskontext, prüft aber vor allem Bestand gegenüber Verkauf/Zahlung; Rechnungswesen-Kompetenz ergänzen. |

Für die übrigen Items sind S2 (A08 T-0063) und S3/S4 (A02-/A03-Verträge) plausible Herkunftspfade. Die konkrete Zuordnung pro Item bleibt trotzdem auszuweisen. Kein Paket belegt, dass hypothetische Unternehmenswirkungen amtlich kalibriert oder gesetzlich vorgegeben sind.

## Kompetenzzuordnung / Mapping-Nacharbeit

| V3-Kriterium | Ist-Zuordnung | Befund / Korrektur |
|---|---|---|
| V3-03 Marktsegmente | EVT-030–036 | EVT-030–032 sind SPI/Inflation; relevante Markt-/Preisfälle eher EVT-033/034/036. |
| V3-04 aggregierter Marktbericht | EVT-037–040 | Durchschnittspreis/Stichprobe ist EVT-035. |
| V3-05 Anfrageverteilung | EVT-030–036 | EVT-030–032 falsch; EVT-003 (Anfragen über Zeit/Segment) und EVT-036 (Ruf/Anfrage) direkter. |
| V3-06 Auftragsprozess | EVT-041–044 | Diese Fälle betreffen Gründung/Rechtsform/Kooperation. EVT-038 prüft Ablehnung ohne Auftrag/Rechnung; ein vollständiger Prozessfall zu Annahme, Leistung, Abnahme, Rechnung und Zahlung fehlt. |
| V3-07 Kalkulation | EVT-045–047 | Plausibel; EVT-040 kann DB-I-Centnähe zusätzlich abdecken, wenn Kompetenz angepasst ist. |
| V3-08 Angebotsabwägung | EVT-037–044 | EVT-037/038 und gegebenenfalls EVT-033 passen; EVT-041–044 überwiegend sachfremd. |
| V3-09 Produktivität/Skills | EVT-048–050 | EVT-048 passt; EVT-049/050 sind Produktfälle. EVT-017/019 ergänzen Qualifizierung/Skillkontext. |
| V3-10 Unternehmensausrichtung | EVT-045–050 | Kein klares Ereignis mit Mehrkennzahlen-Zielkonflikt aus Dashboard/Monatsabschluss; Abdeckung offen markieren oder Item ergänzen. |
| V3-12 Jahresdebrief | kein belastbarer Event | Jahreslauf bleibt T-0069-Abhängigkeit; keinen vorhandenen Event überdehnen. |
| V3-13 Außenwirtschaft | EVT-007–012 | EVT-007–010 direkt; EVT-011/012 nur als indirekter Inputkosten-/Knappheitskanal mit expliziter Kette. |
| V3-14 Wirtschaftspolitik | EVT-013–028 | EVT-013/014 sind vorrangig EZB-Zinsfälle für V3-15; übrige Fälle einzeln nach Politikfeld zuordnen. |
| V3-15 EZB/Zinsübertragung | EVT-029–032 | Falsch: diese Items prüfen Inflation/SPI. Direkte Zinsfälle sind EVT-013/014. |
| V3-16 VPI/SPI/Inflation | EVT-009–012, EVT-033–036 | Nur EVT-011 ist direkter SPI-/Inputpreisbezug; direkte Index-/Inflationsfälle sind EVT-029–032. |
| V3-17 Kalkulation/BAB | EVT-045–047 | Plausibel: EVT-046 ist BAB, EVT-045/047 DB-/Kalkulation. |
| V3-18 Produktlebenszyklus | EVT-048–050 | EVT-049/050 passen, EVT-048 (Skillvoraussetzung) nicht. |
| V3-19 Gründung | EVT-041–044 | EVT-041 direkt Gründung/Finanzbedarf; EVT-042/043 Rechtsformen; EVT-044 Kooperation. Nach Lernziel aufteilen. |
| V3-20 Rechtsform | EVT-041–044 | EVT-042 direkt; EVT-043 nach fachlicher Umformulierung. EVT-041/044 keine direkten Rechtsformfälle. |
| V3-21 Kooperation/Konzentration | EVT-041–044 | EVT-044 ist Kooperation; ein direkter Konzentrationsfall zu Anteilserwerb/Kontrolle/Unternehmenskauf fehlt. |

V3-01/02 und V3-17 sind grundsätzlich plausibel. Schwache Einzelkompetenzen zusätzlich: EVT-018 (Tarifanwendungsbereich: vw-public-policy ergänzen/ersetzen), EVT-031 (Preisfreeze/Snapshot: Prozess-/Kalkulationskompetenz ergänzen), EVT-040 (rw-contribution-margin statt nur vw-opportunity-cost), EVT-043 (fachlich umformulieren), EVT-045 (rw-contribution-margin/rw-variable-cost führend), EVT-050 (rw-cash-vs-profit/rw-inventory-valuation ergänzen).

## Übergabe an A01

1. **A06** korrigiert Kompetenz-/Eventverweise, ergänzt fehlende Lernziele und itembezogene Quellenanker. Dieser Bericht ersetzt keine A06-Katalogänderung.
2. **A02/A05/A03/A09** bearbeiten Modell-, UI-, Finanz- und QA-Gates separat.
3. **A07** bleibt für Antwortschlüssel und Ablenker zuständig.
4. Durch diesen Review ist keine Nutzerentscheidung erforderlich.

**Nachweisrollen:** A08 Quellenreview durchgeführt; A06-Inhaltsarbeit nicht geändert; A07-Schlüsselreview, A09-Abdeckung/Nichtmutation, Tests und Browserprüfung nicht durch A08 ausgeführt. Kein Commit/Push.

