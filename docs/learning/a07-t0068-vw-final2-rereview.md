# A07 – Zweiter finaler Re-Review T-0068 Vw-Ereignisfragen

**Status:** NICHT BESTANDEN – wenige gezielte Antwortsets brauchen noch fachlich tragfähige Ablenker  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A07 – EXAM  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.3 / SLG-002.4  
**Ticket:** T-0068  
**Datum:** 2026-10-31  
**Preflight:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, beide vorherigen A07-Berichte, aktuellen Ereigniskatalog, Mapping und A06-Bericht gelesen. Maßgebliche D-0147, D-0159, D-0161–D-0164 geprüft; aktiver Zielkontext MG-002/V3. Checkout `C:/Users/Tobia/Documents/GitHub/WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende Änderungen anderer Agenten blieben unangetastet.

## Gate-Matrix

| Gate | Ergebnis | Befund |
|---|---|---|
| Vollständigkeit / Schlüssel | **PASS** | 50 eindeutige Items EVT-001–EVT-050; je vier Optionen und ein Schlüssel. Verteilung A/B/C/D = 13/13/12/12. |
| Fachliche Korrektheit | **PASS mit Einzelvorbehalt** | Fachliche Rechenwege und ausgewiesene Schlüssel sind im geprüften Katalog konsistent; keine zweite vertretbare richtige Antwort festgestellt. EVT-038/039/048 sind Vw-gerecht. |
| Schwierigkeitsfit | **PASS mit wenigen Nacharbeitsfällen** | EVT-042/044 sind sinnvoll von Transfer auf Aufbau herabgestuft. Die meisten anderen Aufbau-/Transferitems erfordern jetzt Fallanwendung oder Berechnung. EVT-035 und 045 bleiben unter dem Anspruch ihrer Stufe. |
| Unternehmenswirkung / D-0147 / D-0159 | **PASS** | Wirkung wird als erklärende Lernperspektive statt garantierte Produktkausalität ausgewiesen. Keine direkte Buchung aus Antworten; Dashboardeffekte entsprechen D-0147, Übungsmodus bleibt neutral. Tagesblockierung ist ausgeschlossen. |
| Satzzeichen | **PASS** | Eigener Check fand 0 doppelte Fragezeichen im 50er-Block. |
| Distraktorplausibilität | **NICHT BESTANDEN** | Die überwiegende Mehrheit wurde deutlich verbessert. EVT-018, EVT-035, EVT-042, EVT-044 und EVT-045 haben noch mindestens zwei Optionen, die entweder nicht aus den Falldaten herleitbar, übermäßig offensichtlich oder als echte Gegenentscheidung zu schwach sind. |
| Quellen-/Mappingreview | **nicht abgenommen** | A07 prüft die fachliche Aufgabenqualität, nicht A08s itemweise Quellenvalidierung. |
| Vollständigkeit / Nichtmutation / Laufzeit | **nicht abgenommen** | A09-Gate separat offen. Bestehende Lernvalidatoren prüfen diese V3-Fragen nicht semantisch. |

## Verifizierte Verbesserungen gegenüber dem vorigen Review

- Die 46 umfassend überarbeiteten Items enthalten nun überwiegend konkrete Fallwerte, konkurrierende Ziele oder plausible Fehlerrechnungen. Das Antwortmuster „einzige lange und vollständige Option“ wurde stark reduziert.
- **EVT-038/039/048:** jeweils passender Vw-Gegenstand; kein alter RW-/operativer Fremdgegenstand mehr.
- **EVT-007/008/029/030/033/046/047/048:** Rechenoptionen sind aus konkreten Größen ableitbar und bilden plausible Basis-/Einheiten-/Rundungsfehler ab.
- **EVT-042/044:** Aufbauwissen statt überzogener Transferstufe ist angemessen.
- **EVT-001–050:** doppelte Satzzeichen bereinigt; alle Items kennzeichnen die Antwort-/Übungsgrenze mit D-0147. D-0159 ist im Katalogkopf als nicht tagesblockierende Ereignislogik erklärt.

## Eng begrenzte Restbefunde

- **EVT-018 – Rechenfehler in Ablenkern:** Der richtige Wert 384 € folgt korrekt aus `3 × 160 × 20 € × 4 %`. Option A (640 €) ist ein plausibler Fehler, weil alle fünf Beschäftigten einbezogen werden. Option B (64 €) folgt nicht aus den genannten 160 Stunden und 20 €/h; Option D (1.920 €) wird als gesamter Monatslohn der betroffenen Gruppe bezeichnet, obwohl dieser 9.600 € beträgt. Beide sind daher keine sauberen Rechendistraktoren. Sie sollten als nachvollziehbare, typische Rechenfehler konstruiert und mit ihrer Rechnung im Optionstext sichtbar gemacht werden.
- **EVT-035 – Marktbericht:** D ist korrekt und B („repräsentativer Marktpreis ohne weitere Prüfung“) plausibel. A („verbindlicher Preis aller Wettbewerber“) und C („eigener Mindestpreis“) sind im Kontext einer kleinen Stichprobe kaum vertretbare Interpretationen. Mindestens eine Option sollte einen glaubhaften Fehler mit Ausreißern, Mittelwert/Median oder veränderter Fallzahl prüfen.
- **EVT-042 – Rechtsformvergleich:** Der Fall sagt ausdrücklich, dass Haftung und Vertretung besonders wichtig sind. A verschiebt Vertretung auf später, B leitet Haftung aus Bekanntheit/Namen ab und D verwendet ausschließlich historische Steuerannahmen. Die Optionen sind dadurch schnell auszuschließen; C wiederholt nahezu vollständig den Fallauftrag. Es fehlen realistische Zielkonflikte zwischen Gründungsaufwand/Kapital, Haftung und Vertretungsstruktur. Rechtsdetails weiterhin nur anhand der A08-Matrix formulieren.
- **EVT-044 – Kooperation vs. Konzentration:** D ist unmittelbar aus der Definition abzulesen. B („beide gesetzliche Verschmelzung“) und C (automatisches Erlöschen/automatische Eigentumsübertragung) sind grobe Rechtsfehler. A ist eine mögliche Fehlklassifikation, aber die drei falschen Optionen sind qualitativ ungleich. Zwei Alternativen sollten typische Abgrenzungsunsicherheiten abbilden, ohne eine ungeprüfte wettbewerbsrechtliche Rechtsfolge zu lehren.
- **EVT-045 – Opportunitätskosten:** Aufbau und Ressourcenknappheit sind passend, aber als Transferfrage fehlt eine konkrete Entscheidungsabwägung. B ist die einzige vollständig analytische Option; A („Auftrag wählen, weil Produktdaten fehlen“) kann eine vernünftige Unsicherheitsentscheidung sein, während C/D plakative Verkürzungen sind. Ein kleiner Fall mit Zeiteinsatz, erwarteten Beiträgen und Entwicklungsunsicherheit würde die richtige Abwägung besser prüfen. Synthetische Erwartungswerte explizit markieren.

**Kein neuer Nutzerentscheid erforderlich.** Diese Befunde betreffen nur Frageformulierungen/Ablenker und bestehende Vw-Zuordnungen.

## Prüfungen

- Manueller vollständiger A07-Review sämtlicher 50 Stämme, vier Antwortoptionen, Schlüssel, Erklärungen und Schwierigkeitslabels.
- `node prototype/learning-wbq-validation.mjs`: PASS für bestehende 200 WBQ-Regelfragen; Validator weist darauf hin, dass semantische Distraktorplausibilität nicht geprüft wird.
- `node prototype/learning-hsq-validation.mjs`: PASS für bestehenden HSQ-Katalog (250 Items); keine Freigabe des neuen Ereigniskatalogs.
- `node prototype/learning-ui-regressions.mjs`: PASS für bestehenden 540er Lernpool/UI; keine semantische Freigabe dieses 50er-Satzes.
- Eigener Strukturcheck: 50 Items, 50 eindeutige IDs, Schlüssel 13/13/12/12, `??` = 0; D-0147-Verweis in allen Itemzeilen vorhanden.
- `git diff --check`: Exit 0; nur bestehende LF/CRLF-Hinweise. Katalog/Reviewbericht sind untracked, daher nicht im Git-Diffcheck enthalten; A06s UTF-8-/Whitespacecheck ist ein separater Ausführungsnachweis.
- A08-Review, A09-QA und Browser-/Gerätetest: nicht ausgeführt. Keine Produkt-/Katalogänderung durch A07 außer diesem Bericht. Kein Commit/Push.

## Folgeauftrag

A01 soll A06 mit den fünf Einzelkorrekturen EVT-018/035/042/044/045 beauftragen. Danach reicht ein gezielter A07-Re-Review dieser fünf Items plus erneuter Count-/Schlüssel-/Satzzeichencheck; ein weiterer Vollreview ist nur bei Änderungen außerhalb dieser IDs nötig. T-0068 bleibt bis zum A08-Quellen-/Mappingreview und A09-Vollständigkeits-/Nichtmutationsreview **IN_PROGRESS**.
