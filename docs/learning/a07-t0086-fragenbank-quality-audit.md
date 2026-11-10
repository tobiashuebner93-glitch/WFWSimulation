# T-0086 – Qualitätsaudit des bestehenden Fragenkatalogs (A07)

**Status:** A07 abgeschlossen; A09 unabhängiger Review ausstehend  
**Scope:** Nur Bestandsinventar, IDs und abstrahierte Befunde; keine Originalprüfungsfragen übernommen oder zitiert, keine Fragen geändert.

## Inventar und Stufenzuordnung

- 540 eindeutige IDs in 9 WBQ-/HSQ-Bereichen, 60 je Bereich.
- 20 Grundwissen, 20 Aufbauwissen und 20 Transferwissen je Bereich; insgesamt 180 je Stufe. A09 prüfte die Modulverteilung gegen den Quellcode: Basisbank 20/15/15 plus Supplement 5/5 Aufbau/Transfer ergibt 20/20/20.
- Je Item Einzelauswahl-MC mit vier Optionen sowie Erklärungs-/Unternehmenswirkungsfeld. Damit werden offene Rechenwege, Teilpunkte und eigenständige Begründungen nicht geprüft. Das ist eine Formatgrenze, kein bestätigter Einzelfehler.
- Die Einstufung ist redaktionell, nicht psychometrisch kalibriert.

## Belegter Wiederholungsbefund

| Item-IDs | Fach/Stufen | Befund | Vorschlag |
|---|---|---|---|
| hsq-betriebliches-management-046; hsq-investition-finanzierung-rechnungswesen-controlling-022 | HSQ Betriebliches Management / HSQ Investition, Finanzierung, Rechnungswesen, Controlling; Transfer / Aufbau | Der Fragesatz ist exakt wiederholt; Kontext, Optionen, Lösung/Erklärung und Unternehmenswirkung unterscheiden sich. | Einen der beiden Sätze fach- und kompetenzspezifisch neu formulieren, damit Wiederholungseindruck und Stufensignal sinken. Schwere mittel; kein Doppelinhalt bestätigt. |

A09 verifizierte den Fragesatz im Codebestand unabhängig; der Bericht gibt den Wortlaut nicht wieder.

## Niedrige Priorität: Länge als möglicher Antwortcue

25 Items wurden durch eine Verhältnisheuristik markiert (>1,8× Medianlänge für die richtige Option); davon haben 11 mindestens 2× Medianlänge. A09 bestätigte, dass bei diesen 11 die korrekte Option tatsächlich die längste ist. Das beweist keinen Fehler: fachlich notwendige Bedingungen können Antwortlänge erzeugen. Diese IDs erfordern eine manuelle Prüfung von Parallelität und Detailgrad.

| Item-ID(s) | Bereich | Einstufung |
|---|---|---|
| wbq-rt-005 | WBQ Recht/Steuern | Längencue-Kandidat, niedrig |
| hsq-betriebliches-management-023, -041 | HSQ Betriebliches Management | Längencue-Kandidaten, niedrig |
| hsq-investition-finanzierung-rechnungswesen-controlling-014, -030 | HSQ Investition/Finanzierung/Rechnungswesen/Controlling | Längencue-Kandidaten, niedrig |
| hsq-marketing-vertrieb-010, -036 | HSQ Marketing/Vertrieb | Längencue-Kandidaten, niedrig |
| hsq-fuehrung-zusammenarbeit-005, -017, -023, -029 | HSQ Führung/Zusammenarbeit | Längencue-Kandidaten, niedrig |

Empfehlung: Optionen nur dann redaktionell parallelisieren, wenn ein manueller Einzelreview bestätigt, dass die Antwort über Länge/Detailgrad statt Fachwissen erkennbar wird. Keine Kandidaten automatisch ändern.

## Dubletten-/Heuristikgrenzen

- Near-duplicate-Filter: Jaccard-Schwelle ≥0,82 fand keine weiteren Kandidaten. Das ist kein Beleg gegen semantische Ähnlichkeiten oder False Negatives; Umfang/Tokenizer und ausgeschlossene Felder müssen im unabhängigen Review präzisiert werden.
- Absolutheitswort- und „kurzer Transferprompt“-Filter wurden wegen zu vieler False Positives nicht als Befunde verwendet.
- Kein Fehler einer Schwierigkeitsstufe wurde neu belegt.
- Vollständige Prüfungsantworttiefe ist mit nur MC nicht erreicht; offene Rechen-, Rechts- und mehrteilige Fallaufgaben mit Bewertungsraster wären ein sinnvolles Ergänzungsformat, getrennt von der Lernkarten-Qualität.

**A09-Gate:** Exakte Wiederholung bestätigen; Filterumfang/False-negative-Grenze plausibilisieren; Antwortlängenkandidaten als unbestätigt belassen.
## A09-Re-Review T-0086

A09 bestätigte unabhängig den exakten Fragesatz-Duplikat, Itembestand 540, 9 Bereiche à 60 und Stufenverteilung 20/20/20 (Basis 20/15/15 plus Supplement 5/5 Aufbau/Transfer). Die 11 Antwortlängenkandidaten existieren und haben jeweils die längste korrekte Option; dies ist kein bestätigter Itemfehler. Jaccard-Konfiguration ist nicht reproduzierbar dokumentiert, daher kein Near-Duplicate-Vollständigkeitsclaim.