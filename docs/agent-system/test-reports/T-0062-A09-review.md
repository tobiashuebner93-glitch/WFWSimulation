# T-0062 A09 QA- und Release-Committee-Review

**STATUS:** BLOCKED – kein V2-Release-Committee-PASS  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**MASTER GOAL:** MG-002  
**SECOND-LEVEL GOALS:** SLG-002.2 / SLG-002.4 / SLG-002.5  
**TICKET:** T-0062  
**Prüfdatum:** 2026-10-30  
**Prüfgegenstand:** `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d` plus nicht committete Änderungen. Die Prüfung fand nach A01s CP-0266-Dokumentationsänderung statt. Der Arbeitsbaum ist dirty; diese Ergebnisse sind nicht an einen Commit gebunden.

## Preflight und Grenzen

AGENTS.md, `agent-structure.md`, `agent-rights-matrix.md`, `goals.md`, `ticket-board.md`, `collaboration-state.md`, `decision-log.md` und die V2-Zielkarte wurden gelesen. V2-G01–G11 sind binäre, revisionsgebundene Gates; Freigabe erfordert PASS für denselben Commit. A09 führt QA und Release-Gates durch, kann aber Nutzer-, Rechts-, Architektur- oder Schemafreigaben nicht erteilen. Der bestätigte Fragenkatalog und iPhone-/iPad-Gerätebeleg gemäß D-0159 wurden nicht erneut angefragt.

## Eigene Testausführung

Alle folgenden Läufe endeten mit Exit-Code 0:

- `node prototype/v2-ui-context-timeline-regressions.mjs` – PASS; fünf Gruppen von Lernkompetenz-Kontexten, Zeitachse, Sequenz-/Abhängigkeits- und Kapazitätsfälle.
- `node prototype/learning-ui-regressions.mjs` – PASS; 540 Fragen, 20 je Stufe/Fach, Tageslimit, neun Fächer und neutraler Übungsmodus.
- `node prototype/learning-wbq-validation.mjs` – PASS; 200 WBQ-Items, Kompetenz-IDs und Quellenstruktur. Der Validator weist selbst darauf hin, dass semantische Distraktorplausibilität durch Automation nicht bewiesen wird; Nutzerabnahme D-0159 gilt.
- `node prototype/learning-hsq-validation.mjs` – PASS; 250 HSQ-Items, 25 Kompetenzen, 53 direkte Gesetzeslinks und keine externen Referenzfehler.
- `node prototype/t0045-regressions.mjs` – PASS; Auftrags-/Beschaffungsabläufe.
- `node prototype/t0059-regressions.mjs` – PASS; Agenturprofilverbergung, Buchung/Rückgabe, Arbeitstage und Mehrfachaktivitäten.
- `node prototype/playtest-fixes-regressions.mjs` – PASS; Personal-/Abwesenheits-/Finanzierungsgrenzen.
- `node prototype/manual-playtest-fixes-regressions.mjs` – PASS.

Die UI-/Kontextregression belegt nur repräsentative Zuordnungen: sie ist keine vollständige Inventur produktiver Kontextlinks und testet die Rücknavigation zum identischen Datensatz nicht vollständig. In den gefundenen MJS-Dateien gibt es keinen vollständigen Feld-für-Feld-Spielstand-Roundtrip-/Recoverytest. `app.js` enthält zwar Backup, beschädigter-Spielstand-Banner, Wiederherstellung und Migration v2–v7, doch die Implementierung allein ersetzt den geforderten Zustandsvergleich und Fehlerfalltest nicht.

`git diff --check` lief auf dem Gesamtarbeitsbaum mit Exit 0; Git gab nur LF/CRLF-Hinweise aus. Die erneute Browser-/Geräteprüfung war für diesen A09-Lauf nicht verfügbar. Die Nutzerbestätigung des Pakets bleibt als vorheriger Beleg erhalten.

## Gate-Befunde

| Gate | A09-Befund | Begründung / fehlender Nachweis |
|---|---|---|
| G01 Spielkreisläufe | **Arbeitsbaum-Matrix PASS; formales Gate OFFEN** | Die unten ergänzte A09-Fixturematrix übt positive und negative Zustände von Anfrage bis Zahlung aus; A02-Simulationsreview ist inzwischen eingetroffen. A03 hat den kombinierten G01-Finanzpfad nicht ausdrücklich abgezeichnet. Außerdem fehlen gemeinsame Commitbindung und finale Wiederholung auf dem Release-Commit. |
| G02 Jahressolvabilität | **OFFEN** | CP-0265 dokumentiert deterministische Jahres-Smokes mit Tagesliquidität, zwölf Abschlüssen, Null-Reconciliation und identischem Event-Hash; kein A03-Abschlussreview/committierter Bericht auf derselben Revision. |
| G03 Tagesplanung | **OFFEN** | Kontext-/Timeline-Regression und Wochenend-/Mehrfachzuweisungsfälle bestanden. Keine vollständige Browser-/Touch-/Keyboardabnahme oder A12-Protokollierung. |
| G04 Zeitarbeit | **OFFEN** | T-0059 und Playtest-Regressionen bestanden. Unabhängiger Finanzreview, vollständige UI-/Monatswechselabnahme und A12-Beleg fehlen. |
| G05 Lernkarten-Kontext | **OFFEN** | Repräsentative Kompetenzverknüpfungen bestanden. Vollständige Linkinventur, Navigation zurück zum identischen Spielkontext/Datensatz und unabhängiger Browserreview fehlen. |
| G06 Lernübungen/Fragebank | **OFFEN bis gemeinsamer Commit-Bericht** | WBQ-/HSQ-Validatoren, 540er-Regressionsprüfung und Nutzerabnahme bestehen; muss noch auf denselben Commit gebunden werden. Inhaltsplausibilität ist laut D-0159 iterativ wartbar und kein rückwirkender Blocker. |
| G07 Inventarzugänglichkeit | **OFFEN** | Statischer Code nutzt für Inventaricons `role="img"`, `aria-label`, `title` und `tabindex="0"`; keine vollständige Katalog-/Tastaturfokus-/Touchprüfung mit 0 unlabeled icons dokumentiert. |
| G08 Responsive Navigation | **OFFEN** | Nutzer bestätigt iPhone-/iPad-Gerätebeleg. Für die Kriterien fehlen ein aktuelles A12-Protokoll an 390×844, 768×1024 und 1280×800 sowie Tastaturpfad-/Überbreitenmessung auf dieser Revision. |
| G09 Speichern/Wiederherstellen | **OFFEN** | Recovery-/Backup-/Migrationcode vorhanden; kein vollständiger exakter Feld-Roundtrip und kein automatisierter/Browsernachweis für gültiges Backup, beschädigten Primärstand, fehlendes Backup und bestätigtes Neustarten auf der geprüften Revision. |
| G10 Offlinepaket/Provenienz | **OFFEN bis gemeinsamer Commit-Bericht** | CP-0265 nennt reproduzierbare Builds/Hashes und Nutzer-Gerätebestätigung; die Nachweise sind noch nicht an einen geprüften gemeinsamen Commit gebunden. |
| G11 Konflikt- und Quellengüte | **OFFEN** | A01 hat P/R-Altmarkierungen in CP-0266 redaktionell eingeordnet. A03-Fachreview, A08-Quellenreview, A11-Integrationsreview und Release Committee müssen noch dokumentiert werden. |

## Release-Committee-Entscheid

**BLOCKED.** Ein Committee-PASS ist nicht vertretbar, da mehrere binäre Gates ausdrücklich unvollständige Nachweise aufweisen, die Belege nicht commitgebunden sind und unabhängige Rollenprüfungen fehlen. Es wurde kein fachlicher Codefehler in den hier ausgeführten Testläufen gefunden; das bedeutet nicht, dass die offenen Gates bestanden sind. Kein Commit/Push und keine Releasefreigabe durch A09.

## Nächste adressierte Prüfungen

- A02: vollständige G01-Spielpfadmatrix und unabhängige G02/G03-Simulationsprüfung.
- A03: unabhängiger Finanz-/Jahressolvabilitätsreview für G02/G04 und Review der P/R-Abgrenzung CP-0266.
- A04/A05: vollständiger Persistenz-Roundtrip/Migrations-/Corruption-Review (G09), Kontext-/Labelinventur (G05/G07) und Keyboard-Verhalten.
- A08/A11: Quellen- und Integrationsgrenzen (G11).
- A12: Browser-/Touch-/Keyboardprotokoll für G03/G07/G08/G09.
- Nach Eingang aller Reviews: A09 wiederholt Gate-Abgleich für einen gemeinsamen geprüften Commit und erstellt neues Committee-Ergebnis.

**GIT-VERIFIKATION:** Repository-HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`; Arbeitsbaum hatte zu Prüfungsbeginn mehrere bereits bestehende Änderungen und war dirty. Dieser Bericht ist neu untracked. Keine Änderung verworfen, kein Commit/Push.

## Ergänzung: reproduzierbare G01-Zustands-/Ereignismatrix

Diese G01-Prüfung wurde nach dem ursprünglichen Bericht mit einem **temporären Inline-Fixture auf stdin** ausgeführt (`node --input-type=module -`); es wurde keine Fixturedatei und kein Produktcode angelegt/geändert. Das Fixture startet mit `createInitialGame()`, ruft `advanceOneDay()` bis zur ersten echten generierten `ANGEBOT`-Anfrage auf und nutzt danach die Engine-/Finanz-APIs. Für deterministische Zweige wurden nur die Fixturedaten geändert (Konkurrenzquote, Reputation, vereinfachter Einzelarbeitsgang); keine Produktregel wurde geändert.

| Zustand / Übergang | Positiver Pfad | Negativer Pfad | Assertions / vorhandene Regression |
|---|---|---|---|
| Kundenanfrage | Automatische Anfragegeneration erzeugt `ANGEBOT` auf 2019-01-02. | Unbeantwortete Anfrage: Ablaufdatum auf heutigen Fixturetag gesetzt, nächster Engine-Tag erzeugt `ANGEBOT_ABGELAUFEN`; `declineMarketOffer()` erzeugt `MARKT_VERLOREN`. | Fixture; `v2-orderflow-inventory-regressions.mjs` deckt Anfragen über Wochentage, Fristlänge und Angebotseinreichung ab. |
| Angebot / Zuschlag | `acceptMarketOffer()` setzt `ANGEBOT_EINGEREICHT`; nach `decisionDueDate` und ohne Konkurrenzangebot endet es in `BESTÄTIGT`. | Hoher Rivalenruf/günstiger Rivalenindex plus höheres Spielerangebot endet nach Kundenwartezeit in `MARKT_VERLOREN`. | Fixture; `market-competition-regressions.mjs` bestätigt zudem günstiges eigenes Angebot gewinnt und überteures verliert. |
| Planung | Qualifizierter Inhaber wird für Stufe `PREP` zugewiesen; Sequenz wird gespeichert. | `assignEmployeeToStage()` weist nicht qualifizierten Mitarbeiter ab. | Fixture; `v2-ui-context-timeline-regressions.mjs` prüft Skills, Reihenfolge, Kapazität, Abwesenheit und Tageszuweisung. |
| Beschaffung | `createMaterialProcurement()` plant lokale Baumarktware; `assignEmployeeToTask()` ordnet den Einkauf zu; Arbeitstag schließt Task und erhöht Bestand. | Bestellung über Baumarktbestand wird mit `ok=false` abgewiesen. Onlineregression prüft Mindestmenge, Versand und Bestand vor dem Liefertermin. | Fixture; `v2-orderflow-inventory-regressions.mjs`, `t0045-regressions.mjs`. |
| Fertigung | Nach Einkauf wird Stahl im Fixture verbraucht; die qualifizierte 1-h-Stufe setzt `producedAt` und `VERSANDBEREIT`. | Fixture mit ausschließlich unqualifiziertem Personal bleibt nach `advanceOneDay()` unfertig; keine Fertigmeldung. | Fixture; `v2-ui-context-timeline-regressions.mjs` deckt erfolgreiche geordnete Folgestufen ab. |
| Lieferung / Abnahme | `scheduleShippingTask()` plus Mitarbeitendenzuweisung führt über `advanceOneDay()` zu `GELIEFERT`; `customerAcceptsOrder(...,{automatic:false})` setzt `ABGERECHNET` und `RECHNUNG_BEREIT`. | `customerRejectsOrder()` setzt `ABLEHNUNG_IN_KLÄRUNG`; `startRework()` wechselt in `NACHARBEIT`. | Fixture; `manual-playtest-fixes-regressions.mjs` prüft auftraggeberseitige automatische F3-Abnahme. |
| Rechnung / Zahlung / Auftragsschluss | `issueInvoice()` erzeugt Rechnung; `settleCustomerPayments()` hält sie bis `paymentDate` offen und markiert sie dann bezahlt; `closePaidOrder()` setzt `ABGESCHLOSSEN`. | Rechnung vor Lieferung/Abnahme wird von `issueInvoice()` mit `null` zurückgewiesen; vor tatsächlichem Zahlungstag bleibt die Rechnung offen. | Fixture; `one-award-solvency-regressions.mjs` und Jahressmoke prüfen Rechnungs-/Zahlungsintegration über reale Szenarioläufe. |

**Fixtureassertionen:** `ANGEBOT`; `ANGEBOT_EINGEREICHT → BESTÄTIGT`; `ANGEBOT_EINGEREICHT → MARKT_VERLOREN`; `ANGEBOT → ANGEBOT_ABGELAUFEN`; Zuweisungsfehler für falschen Skill; Materialbestandsfehler; Einkauf → Bestand → Verbrauch → `VERSANDBEREIT`; unqualifizierte Fertigung bleibt blockiert; Versand → `GELIEFERT`; Kundenabnahme → `ABGERECHNET`; Kundenablehnung → `NACHARBEIT`; Rechnung vor Lieferung = `null`; vor Zahlungstag offen und zum `paymentDate` bezahlt; Auftrag danach `ABGESCHLOSSEN`. Alle temporären Fixtureassertionen bestanden.

**G01-Bewertung:** Die Arbeitsbaum-Ausführung erfüllt die geforderte Zustandsmatrix für die positiven und negativen Produktpfade. A02s Simulationsreview ist eingetroffen und bestätigt die angrenzenden Enginepfade. A03s Finanzreview bestätigt Jahressolvabilität und Zeitarbeitsabrechnung, jedoch nicht explizit diese gemeinsam durchgehende G01-Fixture. Daher **G01-Funktionsnachweis PASS auf diesem Working Tree; formales Gate bis Commitbindung und A03-Fachabgleich OFFEN**. Die Matrix ist keine Browser- oder Accessibility-Abnahme.

## Seit dem ersten A09-Bericht eingegangene Rollenberichte

Zum Zeitpunkt dieser Ergänzung liegen folgende Berichte im Repository vor und wurden gelesen: A02, A03, A04, A05, A08, A11 und A12. A12 meldet den Browserpfad ausdrücklich blockiert und hat keine UI-Beobachtung behauptet. A04 bestätigt G09 OFFEN mangels vollständigem Feld-Roundtrip, echter `parseSaved`-Versionsmigration und getesteter Recovery mit gültigem/ungültigem Backup. A08 bestätigt Quellenbefund teilweise, G11 bleibt wegen A09-Committee und Revisionbindung offen. A03 bestätigt G02-Rechenwerte als PASS im Arbeitsbaum, aber formale Bindung und G04 Gesamtgate offen. Alle Berichte benennen denselben HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`, jedoch dirty Working Tree ohne commit-/treegebundene Revision.

Die bestehenden Negativbefunde G05 (Linkinventur/Rücknavigation), G07/G08 (vollständige A12-Viewport-/Touch-/Keyboardprüfung), G09 (vollständiger Persistenz-/Recoverytest) und G10 (finaler Paketbuild aus gemeinsamem Commit) bleiben unverändert. **Release Committee bleibt BLOCKED; kein Release-PASS.**