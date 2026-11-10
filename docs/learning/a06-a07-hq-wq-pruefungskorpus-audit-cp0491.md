# HQ-/WQ-Prüfungskorpus: Quellen- und Antworttiefenaudit

**Stand:** 04.11.2026 · **Ticket:** T-0084 · **Review:** A09 quantitativ PASS, fachlicher Vollreview offen
**Zweck:** Prüfungsanforderungen und Antworttiefe für originäre Lernfragen ableiten. Prüfungsaufgaben werden nicht 1:1 übernommen.

## Korpus und Lesbarkeit

Der Bestand umfasst 129 Dateien (124 PDF mit 2.515 Seiten, 5 DOCX). Unter einer einheitlichen Schwelle von mindestens 40 Zeichen nach Entfernen von Whitespace sind 49 Dateien ausreichend textlesbar, eine PDF teilweise und 79 Dateien unzureichend lesbar. Die PDF-Aufteilung lautet: 47 ausreichend, 1 teilweise, 76 unzureichend; bei DOCX sind 2 ausreichend und 3 unzureichend. Insgesamt wurden 723 PDF-Seiten als ausreichend textreich eingestuft; 1.745 Seiten sind leer, weitere Seiten unterschreiten die Schwelle. OCR wurde nicht ausgeführt. Die Zählung misst Extrahierbarkeit, nicht inhaltliche Vollständigkeit.

Die zwei HQ-Herbst-2023-Lösungs-PDFs mit Namen „Aufgabenteil 1 Lösung“ und „Aufgabenteil 2 Lösung“ sind byteidentische Dubletten (SHA-256: a21c4b5ee7c74fb88677be4734c3f5e1c42b44fd6828d50183c8a0b48a790eb3). Dateinamen- und Ordnerklassifikationen sowie vorläufige Termincluster sind heuristisch; sie sind kein bestätigtes Verzeichnis eindeutiger Prüfungsfamilien.

## Was die Quellen bereits belegen

A09 sichtete zuvor eine kleine Stichprobe aus WQ 2025 (VWL/BWL, Rechnungswesen, Recht/Steuern, Unternehmensführung) sowie HQ-Marketing/Management 2024. Darin zeigen sich unter anderem fallbezogene wirtschaftliche Wirkungsanalyse, Kennzahlen- und Rechenanwendung, strukturierte Rechtsanwendung, Führungs-/Integrationsfragen sowie Marketingpositionierung und Qualitätsdiagnose. Das sind belegte Beispiele, keine Aussagen über Häufigkeit oder Gewichtung im Gesamtkorpus.

A07 zog die frühere 503er-Gesamtsumme zurück. Der Rollenabgleich zeigt, dass von 190 HQ-Kandidatenmarkern nur 56 Marker aus drei klaren Aufgabenheften zählbar sind (HQ Herbst 2021: 16; HQ Herbst 2023 Teil 1: 14; Teil 2: 26). 134 Marker stammen aus vier Lösungshinweis- oder Mischdateien und sind nicht zuverlässig den Aufgabenanteilen zuzuordnen. WQ weist nach Umklassifikation der UF-Herbst-2022-Datei noch 313 Marker in 21 dateinamenbasierten Kandidatendateien aus; vollständige visuelle Rollenprüfung fehlt. Daher gibt es aktuell keine aggregierte Aufgabenmarkerzahl. Die frühere 492-Zahl und der aggregierte Wert 503 sind zurückgezogen. 332 Punktemarker stammen aus einem anderen Datei-/Regex-Scope und sind nicht vergleichbar. Alle Zahlen sind höchstens Suchsignale, keine geprüften Aufgabenhäufigkeiten oder Prüfungsgewichtungen. Regexe können allgemeine Instruktionen, Tabellen und Layout fälschlich klassifizieren.

Die abgestimmte Zählung nach mindestens 40 Nicht-Whitespace-Zeichen je Seite ergibt 10 vollständig lesbare HQ-PDFs und 37 vollständig lesbare WQ-PDFs; hinzu kommen 2 ausreichend lesbare DOCX (49 Dokumente). Ein HQ-PDF ist partiell lesbar. A06s frühere Gegenüberstellung von 37 WQ-Dateien zu 47 Gesamt-PDFs war kein Konflikt. A07s abweichender pypdf-Zweitpass mit >100 Zeichen (48 PDFs + 2 DOCX) ist methodisch nicht reconciled; als alternative Schwelle darf er die abgestimmte Zählung nicht ersetzen. Die einseitige HQ/2021/2021 Frühjahr Sit. 2 Anlage.pdf erfüllt die Extraktionsschwelle, ist jedoch eine Anlage und kein Aufgabenblatt.

## Antworttiefe für originäre Lernaufgaben

Die aus Stichproben und Aufgabenformaten abgeleitete Rubrik staffelt Leistungen nach Aufgabenanforderung:

1. relevante Fall- oder Anlagendaten auswählen;
2. Begriff, Formel, Norm oder Entscheidungsmaßstab benennen;
3. auf den Fall anwenden beziehungsweise nachvollziehbar berechnen;
4. Ergebnis fachlich interpretieren;
5. Folgen, Alternativen oder Empfehlung begründen.

Bewertungskriterien sollen Teilanforderungen trennen, Einheiten und verlangte Rundung berücksichtigen, Folgefehler nicht mehrfach bestrafen und gleichwertige fachlich richtige Lösungswege zulassen. Rechtsaufgaben benötigen einen datierten Rechtsstand und klar abgegrenzte Tatsachen/Annahmen. Für höhere Antworttiefe sind neben MC auch mehrteilige Fälle, Rechenwege, kurze Begründungen und Alternativenvergleiche nötig. Diese Rubrik ersetzt keine fachliche Prüfung jeder Frage.

## Abgleich mit vorhandenem Fragenbestand

Der dokumentierte Bestand umfasst 540 MC-Fragen (60 je neun WBQ-/HSQ-Bereiche). Die WBQ-Bereiche weisen jeweils 50 verschiedene Kompetenz-IDs auf; bei HSQ bündeln sich 50 Fragen je Bereich auf fünf bis sechs Kompetenz-IDs. Das ist eine Zuordnungsgranularität, kein Beweis vollständiger Rahmenplanabdeckung. Ein vollständiges Mapping einzelner Prüfungsunterlagen zu Fragen-IDs wurde bislang nicht erstellt. Historische T-0068-Befunde zu Fehlzuordnungen und zu leichten Distraktoren sind hier nicht neu abgenommen.

## Quellen- und Rechtsprovenienz

Prüfungsunterlagen belegen historische Aufgabenform, Operatoren und Antworttiefe, aber weder automatisch aktuelle Rechtslage noch Wiederverwendungsrechte. Neue Lernfragen müssen eigenständig formuliert werden. Für Rechtsinhalte sind amtliche Normquelle, Fundstelle (Norm/Absatz), Rechtsgebiet, Aussage, valid_from/valid_to, checked_at, Übergangsrecht/Anwendungszeitraum, Fallannahmen, zulässige Lösungswege, Review-Rolle und erneuter Prüftrigger zu dokumentieren. Kompetenzherkunft ist separat als bindendes Recht, Prüfungsrahmen, Sekundärquelle oder Simulationsannahme zu kennzeichnen; bei Rahmenplänen auch Version/Modul. Rechte-/Lizenzstatus ist festzuhalten. Die Rechtsprüfung dieses Korpus ist nicht vollständig.

Amtliche Referenzpunkte für den weiteren Abgleich:
- [Wirtschaftsfachwirt-Prüfungsverordnung (gesetze-im-internet.de)](https://www.gesetze-im-internet.de/wfachwprv/BJNR175200008.html)
- [BGB (gesetze-im-internet.de)](https://www.gesetze-im-internet.de/bgb/BJNR001950896.html)
- [UStG § 19 (gesetze-im-internet.de)](https://www.gesetze-im-internet.de/ustg_1980/__19.html)

## Offene Arbeit / Gate

- A06: lesbare Quellen manuell/fachlich den Unterkompetenzen und vorhandenen Frage-IDs zuordnen; unklare Dateirollen ausdrücklich markieren.
- A07: Antworttiefe, Teilaufgaben und Bewertungslogik an repräsentativen lesbaren Quellen fachlich absichern.
- A08: Provenienz-/Rechtsstandkriterien auf konkrete Rechtsfragen anwenden.
- A09: Mapping, Stichprobenabdeckung und Grenzen unabhängig reviewen.
- OCR oder manuelle Sichtung der 76 unzureichend lesbaren PDFs, der einen partiellen PDF-Restseite und drei DOCX ist für Vollabdeckung erforderlich.

**Abnahmekriterium:** Keine Vollabdeckungs- oder Häufigkeitsbehauptung, bis Dokumentrolle, Prüfungsfamilie und Inhaltsmapping geprüft sind. Keine Originalfrage oder charakteristische Antwort-/Zahlenkombination wird übernommen.

## A09-Reviewstand

**PASS im begrenzten Scope:** Die gesichtete WQ-Frühjahr-2025- und HQ-Frühjahr-2024-Stichprobe stützt die Antworttiefenrubrik (Operator-/Punktebezug, Mehrteiler, Rechnung plus Interpretation, Begründung und Anlagenbezug). Das ist keine Vollkorpus-Häufigkeitsanalyse. **NONPASS:** Es gibt keine aggregierte Aufgaben-Operatorverteilung. Nur 56 HQ-Marker aus drei klaren Aufgabenheften sind rollenklar; 134 weitere HQ-Marker sind aus gemischten Lösungshinweisdateien untrennbar und 313 WQ-Marker bleiben bloße Regex-Kandidaten ohne belastbare reine-Aufgaben-Summe. Der T-0068-Historienbefund und der Fragepaar-Repetitionsbefund wurden nicht neu reviewed.
## Begrenztes manuelles Kompetenzmapping (A06; unabhängiger A09-Review ausstehend)

A06 sichtete sieben Quellen manuell: drei HQ-Aufgabenhefte sowie je ein WQ-Aufgabenband aus Frühjahr 2023 pro Fach. Diese Teilmenge belegt Themen und Antwortleistungen, aber keine Vollabdeckung. Die Zuordnung unten sind Kandidaten-IDs, bis einzelne bestehende Katalogitems gegen Kompetenzmetadaten und konkrete Aufgabenbelege abgeglichen sind.

| Quelle relativ zu docs/qa | Rollen-/Seitenbefund | Beobachtete Themencluster (abstrahiert) | Kandidaten im bestehenden Katalog |
|---|---|---|---|
| HQ/2021/2021 Herbst Sit. 2 Aufgaben.pdf | Aufgaben S. 2–9; Situation/Anlagen S. 10–14 | Investitionsrechnung; Kosten-/Produktkalkulation; Beschaffung, ABC und Lager; Marketing-/Vertriebscontrolling; Führung/Kommunikation/Kultur; einzelne Rechts-/Vertragsanwendung | HSQ Finanzierung/Investition; Rechnungswesen/Controlling; Logistik Beschaffung/Bestand; Marketing/Vertrieb; Führung/Zusammenarbeit (IDs nur Kandidaten) |
| HQ/2023/HQ H2023 Aufgabenteil 1.pdf | Aufgaben S. 2–7; Situation/Anlage S. 8–9 | Organisationsgestaltung, Strategieplanung, Coaching/Führung, Stakeholder/Kultur, Personalentwicklung/Nachfolge/Diversity | HSQ Betriebliches Management und Führung/Zusammenarbeit (IDs nur Kandidaten) |
| HQ/2023/HQ H2023 Aufgabenteil 2.pdf | Aufgaben S. 2–9; Situation/Anlagen S. 10–14 | Finanzierung/Investitionsvergleich; Kostenrechnung, Deckungsbeitrag/Break-even; QM; Beschaffung/Lieferanten; Prognose/Planung; Organisation/Marketing/Recht; Lager | HSQ Finanzierung/Investition, Rechnungswesen/Controlling, Logistik, Marketing/Vertrieb, Betriebliches Management (IDs nur Kandidaten) |
| WQ/Frühjahr 2023/Rechnungswesen/WQ_Frühjahr Rechnungswesen 2023.pdf | Aufgaben S. 2–6; Lösungshinweise ab S. 7 | Abschluss-/Bilanzkennzahlen; Kostenarten/-stellen und Produktkosten; Ergebnis- und Liquiditätsbeurteilung | wbq-rw-001–003, 006–012, 015–018, 026, 036, 049 (Kandidaten) |
| WQ/Frühjahr 2023/RuS/WQ_Frühjahr RuS 2023.pdf | Aufgaben S. 2–6; Lösungshinweise ab S. 7 | Vertrags-/Kauf-/Leistungsstörungen sowie Unternehmens-/Arbeitsrechtsanwendung | wbq-rt-001–008, 011–012, 023, 028–035 (Kandidaten); Steuer-IDs nicht als belegt gewertet |
| WQ/Frühjahr 2023/Unternehmensführung/WQ_Frühjahr UF 2023.pdf | Aufgaben S. 1–4; Lösung ab S. 5 | Personalentwicklung; Organisation/Prozesse/Teams; Führung, Kommunikation und Bewertungsentscheidungen | wbq-uf-001–009, 013, 015–018, 023, 027, 042, 044, 048 (Kandidaten) |
| WQ/Frühjahr 2023/VWLBWL/WQ_Frühjahr VWL 2023.pdf | Aufgaben S. 1–4; Lösung ab S. 5 | Markt-/Preis-/Konjunkturbezüge; makroökonomische Ziele und Politik; Wirkungsbeurteilung | wbq-vw-001–010, 024, 029–031, 044, 050; mögliche BWL-Bezüge 011–016, 035–036, 040 nur Kandidaten |

Die manuell sichtbaren Arbeitsleistungen umfassen Datenauswahl aus Anlagen/Jahresabschlüssen, Berechnung mit Kennzahleninterpretation, Rechtsanwendung auf einen Sachverhalt, begründeten Alternativenvergleich sowie Entwicklung und Beurteilung von Organisations-/Personalmaßnahmen. Korrektur nach A06 Batch 4: Die acht WQ/Frühjahr-2020-Dateien (je Fach Aufgabenname und getrennte „- Lösungen“-Datei) tragen laut Titelblatt den Typ „Lösungshinweise“ und enthalten teils Aufgabenstämme/Anlagen sowie verschränkte Lösungshinweise. Auch die RW- und RuS-Grunddateien sind deshalb als aufgabenhaltige Lösungshinweis-/Kombibände zu führen, nicht als reine Aufgabenhefte. A09s frühere Sichtung bestätigte Aufgabenbeginn auf Seite 2 in den konkret benannten RW-/RuS-Dateien; das belegt die Aufgabenanteile, nicht eine reine Aufgabenrolle.

**Historischer Zwischenstand nach dem ersten Mappingbatch:** 7 von 49 Quellen waren damals fachlich/rollenbezogen bearbeitet. Dieser Zwischenstand ist durch die späteren Batches überholt: Die Rollenklassifikation der 49 ausreichend lesbaren Datensätze wurde abgeschlossen und von A09 im begrenzten Scope PASS reviewed. Weiterhin offen sind die vollständige Inhalts- und Frage-ID-Zuordnung sowie die Prüfung der nicht ausreichend lesbaren Quellen. Keine Originalaufgaben wurden zitiert oder eng nachformuliert.
## A09-Re-Review des Sieben-Quellen-Mappings

A09: NONPASS für die ursprüngliche Mappingtabelle bis die Seiten-/Rollenkorrekturen eingearbeitet sind; danach PASS im begrenzten Scope für die geprüften Rollen und Seitenübergänge. HQ Herbst 2021 Aufgaben: PDF-Seiten 2–9; Anlage beginnt auf Seite 10, Situationsbeschreibung/Anlagen insgesamt Seiten 10–14. WQ Frühjahr 2020 Basisdateien tragen Lösungshinweis-Deckblätter und enthalten Aufgabenstämme sowie Lösungshinweise; sie sind keine reinen Aufgabenhefte. Die getrennten Suffixdateien sind Begleit-/Lösungskopien. WQ Frühjahr 2023 VWL Aufgaben PDF-Seiten 1–4, Lösungshinweise ab Seite 5. HQ-2023- und WQ-FJ-2023-Rollenübergänge sind stichprobenweise plausibel. Kandidaten-IDs wurden nicht itemweise gegen Katalogmetadaten geprüft und bleiben unverbindlich. A09 wertete die Themen-/Antworttiefenbeispiele nur im Stichprobenscope; keine Häufigkeit oder Coverage-Aussage.
### Abschluss des A09-Re-Reviews

A09 PASS im begrenzten Rollen-/Seitenumfang nach den Korrekturen: HQ Herbst 2021 Aufgaben S. 2–9, Anlage ab S. 10; WQ Frühjahr 2020 Basisdateien sind aufgabenhaltige Lösungshinweis-/Mischbände; separate „- Lösungen.pdf“ sind Begleit-/Lösungskopien. Dieser PASS umfasst weder Einzelitem-/Kompetenz-ID-Mapping noch Vollkorpusabdeckung.
## Folgepaket A06: 12 weitere Dateien

A06 sichtete acht weitere textlesbare WQ-Dateien inhaltlich/rollenbezogen und vier zusätzliche Scans nur an Titel-/Anfangsseiten (ohne OCR). Zusammen sind 15 von 49 ausreichend textlesbaren Dateien fachlich/rollenbezogen bearbeitet; 34 der 49 bleiben ungesichtet. Die vier Scans sind zusätzliche partielle Sichtungen und zählen nicht in die 49.

| Quelle relativ zu docs/qa | Rolle/Seiten | Themencluster |
|---|---|---|
| WQ/Frühjahr 2021/RuS_FJ2021.pdf | kombiniert; Aufgaben u.a. S. 2,7,9; Lösungshinweise u.a. S. 3,5,11,13 | Rechtsanwendung; Seitenrollen aus A09-Sichtcheck, IDs nur Kandidaten |
| WQ/Frühjahr 2021/Unternehmensführung_FJ2021.pdf | Aufgaben u.a. S. 2,4,6,7,9; S. 3,5,8,10 leer; übrige Seiten nicht vollständig klassifiziert | Organisation, Personal/Führung, Entwicklung/Kommunikation |
| WQ/Herbst 2022/Rewe_H2022.pdf | S. 2 Aufgabe; S. 4,6,8,10,12 leer; S. 13 Anlage zu Lösung Aufgabe 3; übrige Seiten nicht vollständig klassifiziert | Bilanz/Ergebnis, Kostenrechnung, Kalkulation |
| WQ/Herbst 2022/RuS_H2022.pdf | S. 2 Aufgabe, S. 7 Aufgabenfortsetzung; S. 3,5,9 leer; übrige Seiten nicht vollständig klassifiziert | Vertrags-, Gesellschafts- und Steuerrechtscluster; keine pauschale Normabdeckung |
| WQ/Herbst 2022/UF_H2022.pdf | Aufgaben u.a. S. 2,6,8; S. 3,5 leer; übrige Seiten nicht vollständig klassifiziert | Organisation, Personal, Führung, Planung |
| WQ/Herbst 2022/VWL_BWL_H2022.pdf | Aufgaben u.a. S. 2,5,8,10; andere Seiten nicht seitenweise klassifiziert | Markt-/Wirtschaftslage, Politik und betriebliche Bezüge; Fachzuordnung teilweise heuristisch |
| WQ/Herbst 2023/RuS/WiQu_RuS_HP_2023_gesamt.pdf | S. 10 Aufgabe 6; S. 11 Anlage 2; Lösungshinweise ab S. 12 | Rechtsanwendung, Vertrags- und Steuerbezüge |
| WQ/Herbst 2024/RuS/WiQu_RuS_HP_2024_gesamt.pdf | Aufgaben S. 2–7; S. 8 Lösungshinweis-Deckblatt, Lösungen folgen danach | Vertrags-, Gesellschafts- und Steuerrechtscluster |

Vier weitere PDFs wurden nur visuell auf Anfangsseiten geprüft: WQ/Frühjahr 2021/Rewe_FJ2021.pdf (Aufgabenheft; Einstieg Buchführung), WQ/Frühjahr 2021/VWL_BWL_FJ2021.pdf (Titel nennt Lösungshinweise, S. 2 enthält Aufgaben; als kombiniert/unklar führen), WQ/Herbst 2024/Rechnungswesen/Prüfung_ReWe+Lösung_2024_Herbst.pdf (Aufgabe/Anlage sichtbar, Rollenrest ungesichtet) und WQ/Herbst 2024/Unternehmensführung/Prüfung_UF+Lösung2024 Herbst.pdf (Situationsbeschreibung/Aufgaben sichtbar, Rest ungesichtet). Wegen leerem/dünnem Textlayer wurden keine Volltextaussagen abgeleitet.

**ID-Grenze:** A06 lieferte breite WBQ-ID-Kandidaten für diese acht Quellen; wegen kombinierter Aufgaben-/Lösungshinweise, heuristischer Fachzuordnung und fehlender Einzelitemprüfung werden diese IDs nicht als Abdeckung gezählt. Die vollständigen Kandidatenlisten stehen in A06s Übergabebefund, nicht als bestätigte Coverage.

**Noch offen:** Nach dem Schlussbatch sind alle 49 ausreichend textlesbaren Datensätze rollenbezogen erfasst. 15 Quellen erhielten manuelle Themen-/Kompetenzkandidaten-Notizen; Frage-ID-Abdeckung ist bei keiner Quelle itemweise abgenommen. Zusätzlich liegen 76 PDFs unter der Textschwelle, eine HQ-PDF ist partiell und 3 DOCX sind unzureichend; für diese Bestände ist OCR/manuelle Sichtung erforderlich. A09-Re-Review des zweiten Folgepakets war zunächst NONPASS wegen fehlerhafter Seitenrollen; die korrigierte Tabelle besteht im begrenzten visuellen Scope. A09 bestätigte Batch 4 PASS für die Rollen-/Trennungslogik, aber nicht jeden einzelnen extrahierten Anlagen-/Seitenmarker. Diese Detailmarker bleiben A06-Extraktion, sofern nicht explizit als visuell reviewed gekennzeichnet.
### Lesbarkeitsnenner-Reconciliation

A06 bestätigte mit derselben pdfplumber-Seitenschwelle (mindestens 40 Nicht-Whitespace-Zeichen): HQ 10 ausreichend lesbare + 1 partielle PDF; WQ 37 ausreichend lesbare + 0 partielle PDF; insgesamt 47 ausreichend lesbare PDFs. Zusammen mit 2 lesbaren DOCX ergeben sich 49 ausreichend lesbare Dokumente. Die 37er-WQ-Zahl ist ein Fachordner-Teilbestand, kein widersprechender Gesamtnenner.
### A09-Re-Review der korrigierten WQ-Seitenmatrix

A09 bestätigte die obigen Korrekturen im begrenzten visuellen Scope. Aufgaben-/Lösungshinweise wurden nicht mehr pauschal aus alternierenden Seiten abgeleitet; leere Seiten sind separat bezeichnet. A09 bestätigte außerdem den Nennerabgleich: HQ 10 + WQ 37 volle PDFs, eine partielle HQ-PDF; +2 DOCX =49 ausreichend lesbare Dokumente. Kandidaten-IDs sind weiterhin nicht einzeln abgenommen.
## Folgepaket A06: weitere 10 Volltext-PDFs

A06 klassifizierte die sieben noch nicht rollenbezogen erfassten HQ-PDFs und drei WQ-Dateien für zusätzliche Jahrgänge. Mit den vorigen Batches sind 25 Quellen als Rollen-/Themenstichprobe bearbeitet; die drei Aufgabenhefte plus Quellenkandidaten und Dubletten sind nicht mit 25 unterschiedlichen Prüfungsterminen gleichzusetzen. A09-Re-Review dieses Pakets: PASS im begrenzten Rollen-/Dubletten-/Restnenner-Scope.

| Quelle relativ zu docs/qa | Rollenbefund | Themen-/Zuordnungsgrenze |
|---|---|---|
| HQ/2021/2021 Frühjahr Sit. 2 Anlage.pdf | 1 Seite, Anlage zu Lösung | Investitionsrechnung als Einzelthemenkandidat; kein Aufgabenheft |
| HQ/2021/2021 Frühjahr Sit. 2 komplett.pdf | 21 Seiten, Lösungshinweise; Aufgaben-/Lösungshinweise ineinander | Integrierte HQ-Themen, keine neue Aufgabenabdeckung |
| HQ/2021/2021 Herbst Sit. 2 Lösungen.pdf | 20 Seiten, explizite Lösungshinweise/Anlagen zum Aufgabenheft | Keine zusätzliche Prüfungsfamilie |
| HQ/2021/HQ_Herbst 2021.pdf | 42 Seiten, kombinierter Aufgaben-/Lösungsband ohne klaren Gesamtwechsel | Mehrere HQ-Handlungsbereiche integriert; keine Einzel-ID-Abdeckung |
| HQ/2022/HQ_Fruhjahr 2022.pdf | 41 Seiten, kombinierter Aufgaben-/Lösungsband mit wiederholten Markern | Keine durchgängige Aufgaben-/Lösungshälfte; keine Einzel-ID-Abdeckung |
| HQ/2023/HQ H2023 Aufgabenteil 1 Lösung.pdf und HQ H2023 Aufgabenteil 2 Lösung.pdf | je 14 Seiten, gleiche Lösungshinweise; byteidentische Dublette (SHA-256-Präfix a21c4b5ee7c74fb8) | Eine Quellenidentität, kein zusätzlicher Prüfungsteil |
| WQ/Herbst 2021/WBQ_Herbst 2021.pdf | 40 Seiten, laut Titelseite Aufgaben/Lösungshinweise; im Text keine sichere Trennmarke | Kombiniert/unklar; fachliche Zuordnung nur Kandidat |
| WQ/Herbst 2021/WBQ_Herbst_2021_Lösungen.pdf | 40 Seiten, Lösung-/Kombiband mit überlappenden Markern | Nicht als eigenständiger Prüfungstermin werten |
| WQ/Frühjahr 2025/WiQu_RuS_FP_2025_gesamt.pdf | Aufgaben S. 2–6; Lösungshinweisdeckblatt S. 7, Lösungshinweise ab S. 8 bis S. 15 | Rechts-/Steuercluster, keine Einzel-ID als belegt |

Nach Batch 3 bleiben 24 der 49 ausreichend lesbaren Datensätze fachlich/rollenbezogen ungesichtet: 22 WQ-PDFs und 2 DOCX-Zusammenfassungen. Die Restpfade sind in A06s Übergabe dokumentiert: WQ Frühjahr 2020 (8 PDFs), WQ Herbst 2020 (8 PDFs), WQ Frühjahr 2021 zwei Lösungsdateien, WQ Herbst 2022 vier Lösungsdateien, sowie die beiden HQ/WQ-Zusammenfassungs-DOCX. Diese Restliste ist Inventar, kein Abdeckungsnachweis.
A09 bestätigte Batch 3 insgesamt PASS im begrenzten Umfang. HQ-Herbst-2023-Lösungspaar ist hash-identisch und zählt als eine Quellenidentität. 49 ausreichend lesbare Datensätze minus 25 gesichtete Datensätze ergibt 24 offene; Einzelitem-Abdeckung ist nicht geprüft.
## Folgepaket A06 Batch 4: WQ Frühjahr/Herbst 2020

A06 sichtete 12 weitere PDFs: alle 8 Dateien aus WQ/Frühjahr 2020 und die vier fachbezogenen WQ/Herbst-2020-Basisdateien. Die Herbst-2020-Basisdateien tragen trotz fehlendem Lösungssuffix ebenfalls Lösungshinweis-Deckblätter und enthalten Aufgaben-/Lösungsteile; Dateinamen sind kein verlässlicher Rollennachweis. A09-Re-Review steht aus.

| Quelle relativ zu docs/qa | Rollen-/Seitenbefund | Themencluster (nur Kandidat) |
|---|---|---|
| WQ/Frühjahr 2020/2020 1 HJ - Rechnungswesen.pdf | 13 S.; Lösungshinweis-Deckblatt; Aufgabenstämme ab S.2; Lösungen/Anlagen verschränkt | Jahresabschluss, Bilanz/Ergebnis, Buchführung, Kosten/Kalkulation |
| WQ/Frühjahr 2020/2020 1 HJ - Rechnungswesen - Lösungen.pdf | 13 S.; Begleit-/Lösungskopie desselben Termins | Keine unabhängige Prüfungsfamilie |
| WQ/Frühjahr 2020/2020 1 HJ - Recht und Steuern.pdf | 14 S.; Lösungshinweis-Deckblatt; Aufgaben/Lösungen/Anlagen gemischt | Vertrags-/Gesellschaftsrecht, steuerliche Bezüge |
| WQ/Frühjahr 2020/2020 1 HJ - Recht und Steuern - Lösungen.pdf | 14 S.; Begleit-/Lösungsfassung desselben Termins | Keine unabhängige Prüfungsfamilie |
| WQ/Frühjahr 2020/2020 1 HJ - Unternehmensführung.pdf und separate Lösungen-Datei | je 12 S.; Lösungshinweise/aufgabenhaltige Teile interleaved | Führung, Personalentwicklung, Organisation, Kommunikation |
| WQ/Frühjahr 2020/2020 1 HJ - Volks und Betriebswirtschaft.pdf und separate Lösungen-Datei | je 11 S.; Lösungshinweis-Deckblatt und Aufgaben-/Lösungsteile interleaved | VWL/BWL, Markt-/Angebots-/Nachfragebezüge |
| WQ/Herbst 2020/WQ Herbst 2020/Rewe_H2020.pdf | 11 S.; Lösungshinweisdeckblatt, Aufgaben-/Lösungsteile verschränkt, Anlagenmarker | Jahresabschluss/Buchführung, Kostenrechnung |
| WQ/Herbst 2020/WQ Herbst 2020/RuS_H2020.pdf | 12 S.; Lösungshinweisdeckblatt, gemischt, Anlage S.9 | Vertrags-/Gesellschaftsrecht und Steuerbezüge |
| WQ/Herbst 2020/WQ Herbst 2020/Unternehmensführung_H2020.pdf | 15 S.; Lösungshinweisdeckblatt, Aufgaben-/Lösungsteile und Anlagen verschränkt | Führung, Personal, Organisation |
| WQ/Herbst 2020/WQ Herbst 2020/VWL_BWL_H2020.pdf | 11 S.; Lösungshinweisdeckblatt und interleaved Inhalte | Markt-/Preis-/Nachfragebezüge |

Die jeweils separat benannten Frühjahr-2020- und Herbst-2020-Lösungs-PDFs bleiben als Begleit-/Lösungskopien; A06 meldet keine Byteidentität zwischen Aufgaben-/Basispaaren und Lösungskopien. Abstrakte Themenhinweise aus kombinierten Lösungshinweisbänden werden nicht als unabhängige Aufgabenabdeckung gezählt.
### A09-Re-Review Batch 4

A09 PASS im begrenzten Rollen-/Trennungsumfang: alle acht WQ-Frühjahr-2020-Dateien und vier WQ-Herbst-2020-Basisdateien beginnen als Lösungshinweisbände und enthalten Aufgabenanteile; keine davon wird als reines Aufgabenheft gezählt. Lösungssuffixdateien sind Begleit-/Lösungskopien und nicht als zusätzliche Prüfungsfamilien zu zählen. Die 12 offenen Datensätze sind arithmetisch stimmig: 4 Herbst-2020-Lösungskopien, 2 Frühjahr-2021-Lösungskopien, 4 Herbst-2022-Lösungskopien, 2 DOCX. A09 hat nicht sämtliche von A06 gemeldeten Seiten-/Anlagenmarker visuell bestätigt; diese gelten weiterhin nur als A06-Befund.
## Schlussbatch A06: letzte 12 ausreichend lesbare Datensätze

Die letzten 12 Datensätze bestehen aus vier H2020-Lösungshinweis-Begleitfassungen, zwei FJ2021-Begleitfassungen, vier H2022-Begleitfassungen sowie zwei strukturierten DOCX-Zusammenfassungen. Die Begleitfassungen sind keine eigenständigen Prüfungsfamilien. Die DOCX enthalten keinen eindeutigen Prüfungstermin; sie sind Lernzusammenfassungen, keine Aufgabenhefte.

A06 prüfte SHA-256 der H2020/FJ2021/H2022 Basis-/Suffixpaare: keine Byteidentität. Das HQ-2023-Lösungspaar bleibt eine bestätigte Byte-Dublette und zählt nur als eine Quellenidentität. Die 49 Dateidatensätze bleiben in der Lesbarkeitszählung erhalten; Deduplizierung von Quellenfamilien ist eine separate Zählebene.
## Reproduzierbares 49er-Manifest

Filter: jede PDF-Seite hat nach Whitespace-Entfernung mindestens 40 Zeichen; geprüft mit pdfplumber. Zähler 10 HQ-PDF + 37 WQ-PDF + 2 DOCX. Pfade relativ zu docs/qa.

### HQ (10 PDF)
- HQ/2021/2021 Frühjahr Sit. 2 Anlage.pdf
- HQ/2021/2021 Frühjahr Sit. 2 komplett.pdf
- HQ/2021/2021 Herbst Sit. 2 Aufgaben.pdf
- HQ/2021/2021 Herbst Sit. 2 Lösungen.pdf
- HQ/2021/HQ_Herbst 2021.pdf
- HQ/2022/HQ_Fruhjahr 2022.pdf
- HQ/2023/HQ H2023 Aufgabenteil 1 Lösung.pdf
- HQ/2023/HQ H2023 Aufgabenteil 1.pdf
- HQ/2023/HQ H2023 Aufgabenteil 2 Lösung.pdf
- HQ/2023/HQ H2023 Aufgabenteil 2.pdf

### WQ (37 PDF)
- WQ/Frühjahr 2025/WiQu_RuS_FP_2025_gesamt.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Rechnungswesen - Lösungen.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Rechnungswesen.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Recht und Steuern - Lösungen.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Recht und Steuern.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Unternehmensführung.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Unternehmensführung - Lösungen.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Volks und Betriebswirtschaft - Lösungen.pdf
- WQ/Frühjahr 2020/2020 1 HJ - Volks und Betriebswirtschaft.pdf
- WQ/Frühjahr 2021/RuS_FJ2021.pdf
- WQ/Frühjahr 2021/RuS_FJ2021_Lösungen.pdf
- WQ/Frühjahr 2021/Unternehmensführung_FJ2021.pdf
- WQ/Frühjahr 2021/Unternehmensführung_FJ2021_ Lösungen.pdf
- WQ/Frühjahr 2023/Rechnungswesen/WQ_Frühjahr Rechnungswesen 2023.pdf
- WQ/Frühjahr 2023/RuS/WQ_Frühjahr RuS 2023.pdf
- WQ/Frühjahr 2023/Unternehmensführung/WQ_Frühjahr UF 2023.pdf
- WQ/Frühjahr 2023/VWLBWL/WQ_Frühjahr VWL 2023.pdf
- WQ/Herbst 2020/WQ Herbst 2020/Rewe_H2020.pdf
- WQ/Herbst 2020/WQ Herbst 2020/Rewe_H2020_Lösung.pdf
- WQ/Herbst 2020/WQ Herbst 2020/RuS_H2020.pdf
- WQ/Herbst 2020/WQ Herbst 2020/RuS_H2020_Lösung.pdf
- WQ/Herbst 2020/WQ Herbst 2020/Unternehmensführung_H2020.pdf
- WQ/Herbst 2020/WQ Herbst 2020/Unternehmensführung_H2020_Lösungen.pdf
- WQ/Herbst 2020/WQ Herbst 2020/VWL_BWL_H2020.pdf
- WQ/Herbst 2020/WQ Herbst 2020/VWL_BWL_H2020_Lösung.pdf
- WQ/Herbst 2021/WBQ_Herbst 2021.pdf
- WQ/Herbst 2021/WBQ_Herbst_2021_Lösungen.pdf
- WQ/Herbst 2022/Rewe_H2022.pdf
- WQ/Herbst 2022/Rewe_H2022_Lösung.pdf
- WQ/Herbst 2022/RuS_H2022.pdf
- WQ/Herbst 2022/RuS_H2022_Lösung.pdf
- WQ/Herbst 2022/UF_H2022.pdf
- WQ/Herbst 2022/UF_H2022_Lösunge.pdf
- WQ/Herbst 2022/VWL_BWL_H2022.pdf
- WQ/Herbst 2022/VWL_BWL_H2022_Lösung.pdf
- WQ/Herbst 2023/RuS/WiQu_RuS_HP_2023_gesamt.pdf
- WQ/Herbst 2024/RuS/WiQu_RuS_HP_2024_gesamt.pdf

### DOCX (2)
- HQ/Zusammenfassung HQ.docx
- WQ/Herbst 2024/Unternehmensführung/📘 HQ ZUsammenfassung.docx

Explizit ausgeschlossen: HQ/2020/HQ_HJ-2020_Sit. Aufg. 1.pdf (partiell; nicht alle Seiten erfüllen Schwelle) und WQ/Herbst 2020/WQ Herbst 2020/2020 Herbst VWL.pdf (keine Seite erfüllt Schwelle).
### A09-Abschlussreview

A09 PASS für 49er-Zählung und Rollenstatus: 10 HQ-PDF + 37 WQ-PDF + 2 DOCX; 2020 Herbst VWL.pdf ist korrekt ausgeschlossen. Offen sind Inhaltsprüfung/OCR der 80 Quellen, itemweise Fragen-ID-Zuordnung, belastbare Operatorhäufigkeit und vollständige Rechts-/Lizenzprüfung. Einige A06-Seiten-/Anlagenmarker wurden nicht unabhängig visuell geprüft.