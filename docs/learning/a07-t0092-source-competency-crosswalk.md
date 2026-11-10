# T-0092 – zusätzlicher Quellen-zu-Kompetenz-Crosswalk

**Status:** FINAL PASS nach T-0096/A09 im revidierten Manifest-Disposition-Kriterium; keine itemweise Abdeckung oder Rechtefreigabe.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A07 – ANSWER_DEPTH_RUBRIC
**Goal/Ticket:** MG-002 / SLG-002.1 / T-0092
**Methode:** Runtime-Kompetenzmetadaten; nur zusätzliche, im aktuellen Checkout lesbare Quellen. Keine Itemabdeckung, kein Wortlaut, keine Produktänderung.

| Zusätzliche Quelle | Seiten-/Abschnittsbeleg | Runtime-Kompetenzfamilien (Kandidaten) | Konfidenz / Grenze |
|---|---|---|---|
| HQ/2021/2021 Frühjahr Sit. 2 komplett.pdf | S.2–6: Finance/Investition, Kosten, Beschaffung; S.14–17, 20–21: Beschaffung, Vertrieb, Organisation, Führung | `wfprv5-2-investitionsrechnung`, `wfprv5-2-kostenrechnung`; `wfprv5-3-einkauf-beschaffung`, `wfprv5-3-materialwirtschaft-lagerhaltung`; `wfprv5-4-marketingplanung`, `wfprv5-4-vertriebsmanagement`; `wfprv5-1-planung-statistik`, `wfprv5-1-organisation-personalentwicklung`; `wfprv5-5-kommunikation-kooperation`, `wfprv5-5-mitarbeiterfoerderung` | Niedrig–mittel; Aufgaben-/Lösungssignale vermischt, nur Familienkandidat |
| HQ/2021/HQ_Herbst 2021.pdf | S.1–3 Lösung-/Aufgabenmarker; S.3–21 Finance/Investition, Marketing, Organisation, Führung; S.22–40 zusätzlich Beschaffung/Kosten | Zusätzlich: `wfprv5-2-finanzplanung`, `wfprv5-2-finanzierungsarten`, `wfprv5-2-controlling`, `wfprv5-3-wertschoepfungskette`, `wfprv5-4-marketinginstrumente`, `wfprv5-1-entscheidung-zeitmethoden` | Niedrig; gemischte Quelle, Abschnitte nicht unabhängig visuell validiert |
| HQ/2022/HQ_Fruhjahr 2022.pdf | S.2 Aufgabenmarker; S.3–18 Finance, Logistik, Marketing, Planung/Organisation, Personal; S.19–40 gemischte Aufgaben-/Lösungshinweise mit Kosten/Investition/Lager | `wfprv5-2-investitionsrechnung`, `wfprv5-2-kostenrechnung`, `wfprv5-2-finanzplanung`; `wfprv5-3-einkauf-beschaffung`, `wfprv5-3-materialwirtschaft-lagerhaltung`, `wfprv5-3-wertschoepfungskette`; `wfprv5-4-marketingplanung`, `wfprv5-4-marketinginstrumente`; `wfprv5-1-planung-statistik`, `wfprv5-1-organisation-personalentwicklung`; `wfprv5-5-kommunikation-kooperation`, `wfprv5-5-ausbildung` | Niedrig; breite Tags und Mixed-role, kein Einzelitem geprüft |

## Nicht verwertbare oder nicht zusätzliche Kandidaten

Der gleiche PDF-Textlayer-Test (mindestens 40 Nicht-Leerzeichen je Seite) reproduzierte die frühere Messbasis nur teilweise: WQ Herbst 2024 Rechnungswesen und Unternehmensführung lieferten jeweils 6 Zeichen/Seite; WQ Herbst 2021 VWL/BWL 0/10 Seiten; WQ Herbst 2023 WBQ 0/48 Seiten. WQ Herbst 2021 WBQ erreichte zwar 87 Zeichen als Seitenminimum, aber der Text war überwiegend Zeichensalat. Diese Dateien wurden nicht fachlich interpretiert. WQ Frühjahr 2025 Recht/Steuern war lesbar, ist aber bereits in CP-0491 als A09-Stichprobe enthalten und zählt daher nicht als zusätzliche Quelle.

**Historischer Zwischenstand vor T-0095 und A01-Scopekorrektur (überholt):** Drei neue Quellenfamilien-Kandidaten, weniger als die damals geplanten zehn. Diese Zahl war ein Planwert; nach vollständigem Manifestabgleich ist sie keine Mindestanforderung.

**Historischer A09-Zwischenreview vor T-0095 (überholt):** Drei HQ-Quellencluster waren plausibel, aber damals fehlten sieben Manifestdispositionen. Die aktuellen Abschnitte ab „Reproduzierbarer Restabgleich“ enthalten die korrigierte vollständige Zuordnung und T-0096-Abnahme.


## T-0092 – Reproduzierbarer Restabgleich des CP-0491-Manifests

**Prüfstand:** 2026-11-04 · **Ergebnis:** PASS nach T-0096, begrenzt auf vollständige Manifest-Disposition und Kandidaten-Crosswalk · **Auswahlfilter:** identisch zur CP-0491-Zählung: Jede PDF-Seite muss nach Entfernen von Whitespace mindestens 40 Zeichen Textlayer liefern. Gemessen mit der gebündelten Python-Runtime und pdfplumber 0.11.9. Der Filter misst Extraktion, nicht semantische Lesbarkeit; deshalb wurden Zeichensalat und Quellenfamilienkopien zusätzlich ausgeschlossen. Es wurde keine OCR ausgeführt. Die Runtime-Kompetenz-IDs wurden dynamisch aus `prototype/learning-wbq.js` (`WBQ_ITEMS`) und `prototype/learning-hsq.js` (`hsqQuestions`) geladen. Für die drei neuen HQ-Quellen lauten die zugeordneten areaIds `hsq-investition-finanzierung-rechnungswesen-controlling`, `hsq-logistik`, `hsq-marketing-vertrieb`, `hsq-betriebliches-management` und `hsq-fuehrung-zusammenarbeit`; die jeweiligen competenceIds stehen je Quellzeile. Keine Frage-/Antworttexte wurden übernommen.

### Zusätzliche eindeutige Quellen

| Quelle relativ zu `docs/qa` | Reproduzierbarer Seitenbeleg | Runtime-Kompetenzfamilien (Kandidaten) | Konfidenz / Grenze |
|---|---|---|---|
| `HQ/2021/2021 Frühjahr Sit. 2 komplett.pdf` | 21 Seiten; Minimum 477 Nicht-Whitespace-Zeichen/Seite. Extrahierte Themenindikatoren u.a. Finance/Investition, Kosten, Beschaffung, Vertrieb, Organisation und Personal auf S.2–6, 14–17, 20–21. Aufgaben- und Lösungssignale sind gemischt. | HSQ `wfprv5-2-investitionsrechnung`, `wfprv5-2-kostenrechnung`; `wfprv5-3-einkauf-beschaffung`, `wfprv5-3-materialwirtschaft-lagerhaltung`; `wfprv5-4-marketingplanung`, `wfprv5-4-vertriebsmanagement`; `wfprv5-1-planung-statistik`, `wfprv5-1-organisation-personalentwicklung`; `wfprv5-5-kommunikation-kooperation`, `wfprv5-5-mitarbeiterfoerderung`. | Niedrig–mittel: Extraktionsmarker und Seitencluster stützen nur Familiennähe; Mischrolle verhindert eine sichere Aufgabenabgrenzung. |
| `HQ/2021/HQ_Herbst 2021.pdf` | 42 Seiten; Minimum 74 Zeichen/Seite. S.1 trägt Lösungssignal, S.2 Aufgabenmarker; S.3–21 sowie S.22–40 zeigen weitere Themenmarker für Finance/Investition, Organisation/Personal, Marketing und Beschaffung. | HSQ `wfprv5-2-investitionsrechnung`, `wfprv5-2-finanzplanung`, `wfprv5-2-finanzierungsarten`, `wfprv5-2-kostenrechnung`, `wfprv5-2-controlling`; `wfprv5-3-einkauf-beschaffung`, `wfprv5-3-materialwirtschaft-lagerhaltung`, `wfprv5-3-wertschoepfungskette`; `wfprv5-4-marketingplanung`, `wfprv5-4-marketinginstrumente`, `wfprv5-4-vertriebsmanagement`; `wfprv5-1-planung-statistik`, `wfprv5-1-organisation-personalentwicklung`; `wfprv5-5-kommunikation-kooperation`, `wfprv5-5-mitarbeiterfoerderung`. | Niedrig: gemischte Aufgaben-/Lösungssignale, keine unabhängige visuelle Rollentrennung. |
| `HQ/2022/HQ_Fruhjahr 2022.pdf` | 41 Seiten; Minimum 82 Zeichen/Seite. S.2 Aufgabenmarker; S.3–18 extrahierte Themenindikatoren zu Investition, Logistik, Marketing, Organisation und Personal; S.19–40 enthalten weitere Aufgaben-/Lösungssignale, darunter Kosten-/Investitions-/Lagerindikatoren. | HSQ `wfprv5-2-investitionsrechnung`, `wfprv5-2-kostenrechnung`, `wfprv5-2-finanzplanung`; `wfprv5-3-einkauf-beschaffung`, `wfprv5-3-materialwirtschaft-lagerhaltung`, `wfprv5-3-wertschoepfungskette`; `wfprv5-4-marketingplanung`, `wfprv5-4-marketinginstrumente`; `wfprv5-1-planung-statistik`, `wfprv5-1-organisation-personalentwicklung`; `wfprv5-5-kommunikation-kooperation`, `wfprv5-5-ausbildung`. | Niedrig: breite, teilweise überlappende Themenindikatoren; keine Aufgaben-/Lösungstrennung und kein Itemvergleich. |

Die Zuordnungen sind Kandidaten für Kompetenzfamilien, weil die Themenmarker auf Seiten-/Fallabschnitten zu den dynamisch geladenen Runtime-Kompetenzgruppen passen. Es gibt keinen direkten Abgleich zwischen Aufgabenunterpunkten und Lernkarten; folglich keine Itemabdeckung.

### Restliche Manifestkandidaten und Ausschlüsse

| Manifestkandidat/Familie | Reproduzierbarer Befund | Ausschlussgrund |
|---|---|---|
| `HQ/2021/2021 Frühjahr Sit. 2 Anlage.pdf` | 1 Seite; 920 Nicht-Whitespace-Zeichen. | Anlage zur bereits gezählten Frühjahr-2021-Quelle; keine eigenständige Prüfungsfamilie oder sicher isolierte Kompetenzanforderung. |
| `HQ/2021/2021 Herbst Sit. 2 Lösungen.pdf` | 20 Seiten; Minimum 553 Zeichen/Seite. | Lösungspartner der bereits in T-0085 gemappten Herbst-2021-Aufgabenquelle; keine zusätzliche unabhängige Aufgabenfamilie. |
| `HQ/2023/HQ H2023 Aufgabenteil 1 Lösung.pdf`; `...Aufgabenteil 2 Lösung.pdf` | Je 14 Seiten; Minimum 787 Zeichen/Seite. CP-0491 vermerkt Byteidentität des Lösungspaares. | Lösungskopien zu den bereits gemappten HQ-2023-Aufgabenteilen; dieselbe Quellenfamilie, kein zusätzliches Aufgabenbeispiel. |
| `WQ/Herbst 2021/WBQ_Herbst 2021.pdf` und `WBQ_Herbst_2021_Lösungen.pdf` | Je mindestens 87 Nicht-Whitespace-Zeichen/Seite im Test; beim Aufgaben-PDF war der geprüfte Text überwiegend nicht sinnvoll dekodierbar. Die Lösungskopie wurde nicht eigenständig fachlich interpretiert. | Textschwelle allein ist kein Lesbarkeitsnachweis; Inhalt nicht verlässlich interpretierbar. |
| `WQ/Herbst 2021/VWL_BWL_H2021.pdf` sowie Lösungskopie | Aufgabenfassung: 0/10 Seiten mit extrahiertem Text. | Kein Textbeleg; nicht interpretieren. Die Datei liegt außerdem außerhalb der 49er-CP-0491-Liste der textlesbaren PDF-Dateien. |
| `WQ/Herbst 2023/WBQ_Herbst 2023.pdf` | 0/48 Seiten mit extrahiertem Text im aktuellen Checkout. | Nicht im reproduzierten textlesbaren Manifest; kein interpretierbarer Text. |
| `WQ/Herbst 2024/Rechnungswesen/Prüfung_ReWe+Lösung_2024_Herbst.pdf`; `WQ/Herbst 2024/Unternehmensführung/Prüfung_UF+Lösung2024 Herbst.pdf` | Je 6 Nicht-Whitespace-Zeichen auf jeder Seite. | Aktueller Textlayer unterschreitet die Auswahlgrenze; Manifest-/Extraktionskonflikt, keine Inhaltsableitung. |
| `WQ/Herbst 2020`-, `WQ/Frühjahr 2020`-, `WQ/Frühjahr 2021`-, `WQ/Herbst 2022`- und `WQ/Frühjahr 2023`-Familien | Die noch im Manifest geführten Basis-/Lösungspartner wurden im T-0085-Mapping bereits behandelt; die Lösungspartner sind keine unabhängigen Prüfungsfamilien. | Bereits gemappt bzw. Quellenfamilie dupliziert; nicht als zusätzliche Evidenz zählen. |
| `WQ/Herbst 2023/RuS/WiQu_RuS_HP_2023_gesamt.pdf`; `WQ/Herbst 2024/RuS/WiQu_RuS_HP_2024_gesamt.pdf` | Extraktion lesbar; die genannten Quellen-/Seitencluster sind bereits im T-0085-Mapping dokumentiert. | Bereits gemappte Familien; keine zusätzlichen Quellenfamilien. |
| `WQ/Frühjahr 2025/WiQu_RuS_FP_2025_gesamt.pdf` | 15 Seiten; Minimum 813 Nicht-Whitespace-Zeichen/Seite; lesbar. | Bereits als A09-Stichprobe in CP-0491 dokumentiert; kein zusätzlicher unabhängiger Beleg für diesen Auftrag. |

### Abschlussstatus und Scope

**Historischer Zwischenstand vor T-0095/A01-Scopekorrektur (überholt):** Drei von zehn damals geplanten Zusatzquellenfamilien waren belegt; sieben schienen zu fehlen. Die vollständige 49-Datensatz-Disposition und das revidierte operative Abschlusskriterium stehen im nachfolgenden Finalabschnitt. Keine separate Nutzerentscheidung war für die interne Ticket-Neufassung erforderlich.

## T-0095 – Vollständige Quellen-Disposition und Scope-Korrektur

**Denominator:** Der reproduzierbare CP-0491-Manifestbestand umfasst unverändert **47 PDFs (10 HQ + 37 WQ) und 2 DOCX = 49 Datensätze**. Die PDF-Auswahlregel lautet: jede Seite nach Whitespace-Entfernung mindestens 40 Zeichen im pdfplumber-Textlayer. Der aktuelle Lauf gegen genau die Manifestpfade reproduziert die 47 PDFs. Dieser Schwellenwert beweist keine semantische Lesbarkeit: Das WQ-Herbst-2021-WBQ-Paar erfüllt ihn numerisch, liefert aber bei Sichtprüfung des extrahierten Aufgaben-PDFs überwiegend Zeichensalat. Die zwei DOCX bleiben Manifestdatensätze; sie wurden als Zusammenfassungsdokumente nach Dateititel/-pfad klassifiziert, nicht als Prüfungstexte oder Themenbelege.

### Status der zusätzlich angeforderten Quellen

| Quelle relativ zu `docs/qa` | Vorheriger Stand und jetzige Disposition |
|---|---|
| `HQ/2021/2021 Herbst Sit. 2 Aufgaben.pdf` | In T-0085/CP-0491 bereits als Aufgabenabschnitt PDF-S.2–9 verzeichnet; keine neue Quellenfamilie in T-0092. |
| `HQ/2023/HQ H2023 Aufgabenteil 1.pdf` | In T-0085/CP-0491 bereits als Aufgabenquelle, PDF-S.2–7, verzeichnet; keine neue Quellenfamilie. |
| `HQ/2023/HQ H2023 Aufgabenteil 2.pdf` | In T-0085/CP-0491 bereits als Aufgabenquelle, PDF-S.2–9, verzeichnet; keine neue Quellenfamilie. |
| `HQ/Zusammenfassung HQ.docx` | Manifest-DOCX; Dateititel bezeichnet eine Zusammenfassung. T-0085/CP-0491 weist dafür kein Prüfungsaufgaben-Mapping aus. Keine Themeninhalte oder Kompetenzbezüge daraus abgeleitet. |
| `WQ/Herbst 2024/Unternehmensführung/📘 HQ ZUsammenfassung.docx` | Manifest-DOCX; Dateititel und Ordnerpfad kennzeichnen eine Zusammenfassung, nicht ein eindeutig abgegrenztes Prüfungsaufgabenheft. T-0085/CP-0491 weist dafür kein Themen-/Kompetenzmapping aus. Keine Inhalte daraus abgeleitet. |

### Quelle-für-Quelle-Disposition aller 49 Manifestdatensätze

Statuskürzel: **T0085** = bereits in A06-Crosswalk/CP-0491 als fachliche Quellenfamilie gemappt; **Lösung/Anlage** = verbundener Beleg ohne zusätzliche unabhängige Prüfungsfamilie; **T0092 neu** = neue Kandidatenfamilie dieses Berichts; **A09** = bereits in CP-0491 als A09-Stichprobe berücksichtigt; **unlesbar** = numerische Extraktionsschwelle allein reicht wegen Zeichensalat nicht für fachliche Interpretation; **Zusammenfassung** = DOCX-Rolle nach Titel/Ordner, kein inhaltliches Prüfungsmapping.

| # | Manifestpfad relativ zu `docs/qa` | Disposition |
|---:|---|---|
| 1 | `HQ/2021/2021 Frühjahr Sit. 2 Anlage.pdf` | **Lösung/Anlage** – Anlage derselben Frühjahr-2021-Familie wie das Komplettdokument; kein eigenständiger Prüfungsbeleg. |
| 2 | `HQ/2021/2021 Frühjahr Sit. 2 komplett.pdf` | **T0092 neu** – neue HQ-Familie, Kandidat 1; gemischte Aufgaben-/Lösungssignale. |
| 3 | `HQ/2021/2021 Herbst Sit. 2 Aufgaben.pdf` | **T0085** – Aufgaben-PDF-S.2–9 bereits im Crosswalk geführt. |
| 4 | `HQ/2021/2021 Herbst Sit. 2 Lösungen.pdf` | **Lösung/Anlage** – Lösungspartner derselben bereits gemappten Herbst-2021-Familie. |
| 5 | `HQ/2021/HQ_Herbst 2021.pdf` | **T0092 neu** – neue gemischte HQ-Familie, Kandidat 2. |
| 6 | `HQ/2022/HQ_Fruhjahr 2022.pdf` | **T0092 neu** – neue gemischte HQ-Familie, Kandidat 3. |
| 7 | `HQ/2023/HQ H2023 Aufgabenteil 1 Lösung.pdf` | **Lösung/Anlage** – Lösungskopie, keine zusätzliche Aufgabenfamilie; laut CP-0491 byteidentisch mit Manifestdatensatz 9. |
| 8 | `HQ/2023/HQ H2023 Aufgabenteil 1.pdf` | **T0085** – Aufgabenquelle PDF-S.2–7 bereits im Crosswalk geführt. |
| 9 | `HQ/2023/HQ H2023 Aufgabenteil 2 Lösung.pdf` | **Lösung/Anlage** – Lösungskopie, keine zusätzliche Aufgabenfamilie; laut CP-0491 byteidentisch mit Manifestdatensatz 7. |
| 10 | `HQ/2023/HQ H2023 Aufgabenteil 2.pdf` | **T0085** – Aufgabenquelle PDF-S.2–9 bereits im Crosswalk geführt. |
| 11 | `WQ/Frühjahr 2025/WiQu_RuS_FP_2025_gesamt.pdf` | **A09** – textlesbar, aber bereits als A09-Stichprobe in CP-0491 erfasst; nicht zusätzlich gezählt. |
| 12 | `WQ/Frühjahr 2020/2020 1 HJ - Rechnungswesen - Lösungen.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie der in T-0085 erfassten FJ-2020-ReWe-Familie. |
| 13 | `WQ/Frühjahr 2020/2020 1 HJ - Rechnungswesen.pdf` | **T0085** – FJ-2020-ReWe-Familie bereits gemappt; Mischband, keine reine Aufgabenrolle. |
| 14 | `WQ/Frühjahr 2020/2020 1 HJ - Recht und Steuern - Lösungen.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie der in T-0085 erfassten FJ-2020-RuS-Familie. |
| 15 | `WQ/Frühjahr 2020/2020 1 HJ - Recht und Steuern.pdf` | **T0085** – FJ-2020-RuS-Familie bereits gemappt; Mischband. |
| 16 | `WQ/Frühjahr 2020/2020 1 HJ - Unternehmensführung.pdf` | **T0085** – FJ-2020-UF-Familie bereits gemappt; Mischband. |
| 17 | `WQ/Frühjahr 2020/2020 1 HJ - Unternehmensführung - Lösungen.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie derselben FJ-2020-UF-Familie. |
| 18 | `WQ/Frühjahr 2020/2020 1 HJ - Volks und Betriebswirtschaft - Lösungen.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie der in T-0085 erfassten FJ-2020-VWL/BWL-Familie. |
| 19 | `WQ/Frühjahr 2020/2020 1 HJ - Volks und Betriebswirtschaft.pdf` | **T0085** – FJ-2020-VWL/BWL-Familie bereits gemappt; Mischband. |
| 20 | `WQ/Frühjahr 2021/RuS_FJ2021.pdf` | **T0085** – FJ-2021-RuS-Familie bereits gemappt; Aufgaben- und Lösungshinweise gemischt. |
| 21 | `WQ/Frühjahr 2021/RuS_FJ2021_Lösungen.pdf` | **Lösung/Anlage** – Begleitfassung derselben FJ-2021-RuS-Familie. |
| 22 | `WQ/Frühjahr 2021/Unternehmensführung_FJ2021.pdf` | **T0085** – FJ-2021-UF-Familie bereits gemappt; begrenzte Seiten-/Rollenprüfung. |
| 23 | `WQ/Frühjahr 2021/Unternehmensführung_FJ2021_ Lösungen.pdf` | **Lösung/Anlage** – Begleitfassung derselben FJ-2021-UF-Familie. |
| 24 | `WQ/Frühjahr 2023/Rechnungswesen/WQ_Frühjahr Rechnungswesen 2023.pdf` | **T0085** – FJ-2023-ReWe-Familie bereits gemappt, Aufgaben-/Lösungsabschnitte seitenbezogen vermerkt. |
| 25 | `WQ/Frühjahr 2023/RuS/WQ_Frühjahr RuS 2023.pdf` | **T0085** – FJ-2023-RuS-Familie bereits gemappt, Aufgaben-/Lösungsabschnitte seitenbezogen vermerkt. |
| 26 | `WQ/Frühjahr 2023/Unternehmensführung/WQ_Frühjahr UF 2023.pdf` | **T0085** – FJ-2023-UF-Familie bereits gemappt. |
| 27 | `WQ/Frühjahr 2023/VWLBWL/WQ_Frühjahr VWL 2023.pdf` | **T0085** – FJ-2023-VWL/BWL-Familie bereits gemappt. |
| 28 | `WQ/Herbst 2020/WQ Herbst 2020/Rewe_H2020.pdf` | **T0085** – H-2020-ReWe-Familie bereits gemappt; Lösungshinweisband mit Aufgabenanteilen. |
| 29 | `WQ/Herbst 2020/WQ Herbst 2020/Rewe_H2020_Lösung.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie derselben H-2020-ReWe-Familie. |
| 30 | `WQ/Herbst 2020/WQ Herbst 2020/RuS_H2020.pdf` | **T0085** – H-2020-RuS-Familie bereits gemappt; Lösungshinweisband mit Aufgabenanteilen. |
| 31 | `WQ/Herbst 2020/WQ Herbst 2020/RuS_H2020_Lösung.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie derselben H-2020-RuS-Familie. |
| 32 | `WQ/Herbst 2020/WQ Herbst 2020/Unternehmensführung_H2020.pdf` | **T0085** – H-2020-UF-Familie bereits gemappt; Lösungshinweisband mit Aufgabenanteilen. |
| 33 | `WQ/Herbst 2020/WQ Herbst 2020/Unternehmensführung_H2020_Lösungen.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie derselben H-2020-UF-Familie. |
| 34 | `WQ/Herbst 2020/WQ Herbst 2020/VWL_BWL_H2020.pdf` | **T0085** – H-2020-VWL/BWL-Familie bereits gemappt; Lösungshinweisband mit Aufgabenanteilen. |
| 35 | `WQ/Herbst 2020/WQ Herbst 2020/VWL_BWL_H2020_Lösung.pdf` | **Lösung/Anlage** – Begleit-/Lösungskopie derselben H-2020-VWL/BWL-Familie. |
| 36 | `WQ/Herbst 2021/WBQ_Herbst 2021.pdf` | **unlesbar** – Zahlenfilter pass; geprüfte Textzeichen überwiegend nicht sinnvoll dekodierbar. Keine Themenzuordnung. |
| 37 | `WQ/Herbst 2021/WBQ_Herbst_2021_Lösungen.pdf` | **unlesbar / Lösungspartner** – Zahlenfilter pass; Lösungskopie nicht unabhängig fachlich interpretiert, keine neue Familie. |
| 38 | `WQ/Herbst 2022/Rewe_H2022.pdf` | **T0085** – H-2022-ReWe-Familie bereits gemappt; Seiten-/Rollenprüfung begrenzt. |
| 39 | `WQ/Herbst 2022/Rewe_H2022_Lösung.pdf` | **Lösung/Anlage** – Begleitfassung derselben H-2022-ReWe-Familie. |
| 40 | `WQ/Herbst 2022/RuS_H2022.pdf` | **T0085** – H-2022-RuS-Familie bereits gemappt. |
| 41 | `WQ/Herbst 2022/RuS_H2022_Lösung.pdf` | **Lösung/Anlage** – Begleitfassung derselben H-2022-RuS-Familie. |
| 42 | `WQ/Herbst 2022/UF_H2022.pdf` | **T0085** – H-2022-UF-Familie bereits gemappt. |
| 43 | `WQ/Herbst 2022/UF_H2022_Lösunge.pdf` | **Lösung/Anlage** – Begleitfassung derselben H-2022-UF-Familie. |
| 44 | `WQ/Herbst 2022/VWL_BWL_H2022.pdf` | **T0085** – H-2022-VWL/BWL-Familie bereits gemappt. |
| 45 | `WQ/Herbst 2022/VWL_BWL_H2022_Lösung.pdf` | **Lösung/Anlage** – Begleitfassung derselben H-2022-VWL/BWL-Familie. |
| 46 | `WQ/Herbst 2023/RuS/WiQu_RuS_HP_2023_gesamt.pdf` | **T0085** – H-2023-RuS-Familie bereits gemappt. |
| 47 | `WQ/Herbst 2024/RuS/WiQu_RuS_HP_2024_gesamt.pdf` | **T0085** – H-2024-RuS-Familie bereits gemappt. |
| 48 | `HQ/Zusammenfassung HQ.docx` | **Zusammenfassung** – Manifest-DOCX; keine Prüfungstext-/Kompetenzzuordnung in T-0085/CP-0491. |
| 49 | `WQ/Herbst 2024/Unternehmensführung/📘 HQ ZUsammenfassung.docx` | **Zusammenfassung** – Manifest-DOCX; keine Prüfungstext-/Kompetenzzuordnung in T-0085/CP-0491. |

### Nicht im 49er-Denominator geführte Low-Text-Dateien

Die folgenden Dateien sind keine der 49 Manifestdatensätze und dürfen die Nennerangabe nicht verändern: `HQ/2020/HQ_HJ-2020_Sit. Aufg. 1.pdf` (partiell, bereits in CP-0491 ausgeschlossen); `WQ/Herbst 2020/WQ Herbst 2020/2020 Herbst VWL.pdf` (0 Seiten über der 40-Zeichen-Schwelle, bereits ausgeschlossen); `WQ/Herbst 2021/VWL_BWL_H2021.pdf` und die Lösungskopie (Aufgabenfassung 0/10 Seiten mit Text); `WQ/Herbst 2023/WBQ_Herbst 2023.pdf` (0/48 Seiten mit Text); `WQ/Herbst 2024/Rechnungswesen/Prüfung_ReWe+Lösung_2024_Herbst.pdf` und `WQ/Herbst 2024/Unternehmensführung/Prüfung_UF+Lösung2024 Herbst.pdf` (jeweils nur 6 Nicht-Whitespace-Zeichen/Seite im aktuellen Checkout). Keine davon wurde fachlich interpretiert.

### T-0095 und T-0096 – finales Ergebnis

Die Zählbasis ist reproduzierbar als **47 PDFs + 2 DOCX = 49 Manifestdatensätze**; alle 49 normalisierten Pfade stimmen mit CP-0491 überein und sind eindeutig dispositioniert. Nichtmanifest-Low-text-Dateien stehen separat. Der Zielwert von zehn zusätzlichen Quellenfamilien war ein Planwert, keine Mindestanforderung: die drei tatsächlich belegten HQ-Familienkandidaten und vollständige Statusangaben für den gesamten Bestand erfüllen das revidierte operative Kriterium. A09/T-0096 bestätigt Datensatzanzahl, Pfadidentität, fünf nachgetragene Dispositionen und Runtime-ID-/Area-Zugehörigkeit. **T-0092/T-0095/T-0096: PASS im begrenzten Scope.** Keine Prüfungsinhalte oder Lernfragen geändert; keine Itemabdeckung, Rechtefreigabe oder Prüfungsgewichtung behauptet. Kein Commit/Push.