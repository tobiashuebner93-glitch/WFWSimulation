# Lernfragen: Stufen und Wiederholung (T-0041)

**Stand:** 2026-10-29, T-0041 COMPLETED; A09 erteilte PASS für 450 Kernstufen und 90 Ergänzungsfälle (CP-0224).

## Umfang

Die Bibliothek enthält 540 originäre Multiple-Choice-Fälle über die vier WBQ- und fünf HSQ-Bereiche. Jeder Bereich hat 60 Fälle:

| Stufe | Fälle je Prüfungsbereich | Anforderung |
|---|---:|---|
| Grundwissen | 20 | Begriffe, Regeln oder grundlegende Zusammenhänge im eindeutigen Fall erkennen |
| Aufbauwissen | 20 | Fachwissen auf einen betrieblichen Sachverhalt anwenden und eine begrenzte Abwägung treffen |
| Transferwissen | 20 | Mehrere Ziele, Restriktionen oder Nebenwirkungen verknüpfen und eine Entscheidung begründen |

Die 450 Kernfälle behalten ihren Inhalt. Ihre Einzelstufung folgt der von A09 gelieferten Denkoperations-Zuordnung mit 20 Grundwissen-, 15 Aufbau- und 15 Transferfällen je Fach; die Regression prüft diese Quoten. Zusammen mit fünf Ergänzungen in Aufbau- und fünf in Transferwissen entstehen 20 Fälle je Stufe und Fach. Diese redaktionelle Einordnung ist keine psychometrische Kalibrierung oder IHK-Freigabe. A09 hatte an den Ergänzungsfällen konkrete Schwächen gefunden. Die fallbezogenen Korrekturen und die Passung der kompetenzgemappten Erklärungen der Ergänzungen bleiben Gegenstand der unabhängigen Nachprüfung. Die Gesamtzahl ist keine Qualitätsfreigabe.

## Auswahl und Wiederholung

- Dashboard und Übungsmodus verwenden dieselbe 540-Fälle-Bibliothek, aber eigene lokale Fortschrittsdaten.
- Je Simulationsdatum erhält das Dashboard ein deterministisch gespeichertes Set aus fünf eindeutigen Fällen. Die Auswahl mischt Prüfungsbereiche und Schwierigkeitsstufen, bevorzugt fällige Wiederholungen und vermeidet zuletzt gestellte Fälle, solange der Pool das erlaubt.
- Falsche Antworten werden mit kurzem Wiederholungsabstand vorgemerkt. Im Übungsmodus werden fällige und noch nicht bearbeitete Fälle vor zuletzt gelösten Fällen ausgewählt.
- Nur Tagesfragen bewirken kleine modellierte Ruf-/Kompetenz-/Motivationswirkungen, maximal fünf Antworten je Spieltag. Prüfungsübungen verändern weder Spiel- noch Finanz-/Ledger-State.
- Die Wiederholungsdaten sind browserlokal. Geräteübergreifende Synchronisation ist nicht Teil dieser Änderung.

## Qualitätsgrenzen

Die neuen Items sind eigenständig formulierte Lernfälle, keine übernommenen DIHK-Aufgaben. Der A09-Review zeigt, dass die automatische Strukturprüfung inhaltliche Passung und Distraktorqualität nicht belegt. T-0041 bleibt bis zur vollständigen fachlichen Korrektur, erfolgreichem A09-Nachreview und gezielter Browser-/Wiederholungsprüfung offen.


## Redaktionszuordnung der 450 Kernfälle (CP-0221)

Die vollständige Einzelzuordnung der 450 Kernfälle von A09 ist im Lauf vom 2026-10-29 in `prototype/learning-ui.js` eingetragen. Sie nutzt keine ID-Suffix-Heuristik mehr. Laufzeitprüfungen sichern je Fach 20 Grundwissen-, 15 Aufbau- und 15 Transferfälle im Kernbestand; einschließlich der Ergänzungen werden je Fach 20 Fälle pro Stufe angezeigt. Die Regression sichert die Mengen, nicht die psychometrische Schwierigkeit oder eine IHK-Kalibrierung.

Die 90 ergänzenden Fälle weisen je einen expliziten Kompetenzschlüssel auf; Quellen- und Tooltipbezug werden aus dem Kernfall derselben Kompetenz abgeleitet, niemals aus derselben Arrayposition. `learning-ui-regressions.mjs` prüft Zuordnung, Quellenübereinstimmung, eindeutige Antwortoptionen und Quoten, aber nicht allein die inhaltliche Passung. A09 sichtete alle Fälle, die gefundenen Text-/Distraktorprobleme wurden korrigiert und im unabhängigen Vollreview PASS bestätigt (CP-0224). Die Einstufung bleibt redaktionell, ohne psychometrische oder IHK-Kalibrierung.
