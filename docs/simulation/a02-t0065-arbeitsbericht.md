# A02-Arbeitsbericht – T-0065 (unabhängige Teilphase)

Der gemeinsame V3-Simulationsablauf, Datenübergaben, deterministische Reihenfolge und Fixture-/Testmatrix für T-0063/T-0065/T-0066 stehen im [A02-Integrationsvertrag](a02-v3-t0063-t0065-t0066-integrationsvertrag.md).

**Status:** Teilphase abgeschlossen; Gesamtticket IN_PROGRESS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2
**Ticket:** T-0065
**Vorgänger:** CP-0275 (Entwurf)
**Git-Basis:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; lokale Änderungen wurden erhalten.

## Durchgeführte Arbeit

- Vollständiger A02-Preflight gemäß AGENTS.md: Struktur/Rechte, Goals, Ticket Board, Collaboration State, Decision Log, V3-Zielkriterien, V2-Marktkontext und Repository-Status geprüft.
- T-0065 als **IN_PROGRESS** markiert; Status nennt explizit die unabhängige Markt-/Angebotsrahmenphase und das T-0063-Abhängigkeitsgate.
- Unabhängigen Markt-/Angebotskreislauf samt Segmenten, Wettbewerbsprofilen, versteckten Einzelpreisen, zeitversetzter Entscheidung, unveränderlichem Vertragspreis und Übergaben dokumentiert.
- Bestehende V2-Entscheidungen D-0136 bis D-0142 nicht unbesehen auf V3 ausgedehnt; V2-Profil und V2-Abnahme bleiben unberührt.

## Konflikt- und Abhängigkeitsprüfung

- Keine Kollision mit D-0159; Lernereignisse sind nicht Bestandteil dieses Tickets.
- D-0160 ist V2-spezifisch und wurde nicht als V3-Produktregel übernommen.
- T-0063 muss makroökonomische Eingaben liefern; T-0067 muss Kosten-, DB-, Rundungs- und Steuerabgrenzung liefern. T-0065 soll erst danach final kalibriert/implementiert werden.
- A01 koordinierte für den Gleichstand von Entscheidungstag und Ablaufdatum eine V3-Arbeitsinterpretation: Kundenentscheidung zuerst in der Tagesphase, bei weiter offenem Angebot Ablauf am Tagesende. Das ist keine Nutzerentscheidung und wird nicht als D-Eintrag behandelt.
- A02 verantwortet die Monatsberichtsstichprobe und Preisstatistik; A05 stellt sie dar, A03 prüft nur die finanzielle Bedeutung der ausgewiesenen Preisgröße.

## Dateien

- `docs/agent-system/ticket-board.md` – T-0065 gestartet.
- `docs/agent-system/collaboration-state.md` – Abhängigkeit/Status fortgeschrieben.
- `docs/simulation/a02-t0065-v3-marktmodell-arbeitsrahmen.md` – unabhängiger fachlicher Rahmen und Schnittstellen.
- `docs/simulation/a02-t0065-arbeitsbericht.md` – dieser Bericht.

## Nachweisrollen

- **Ausführung:** A02, dokumentarische Teilphase.
- **Fachreview:** eigene Konsistenzprüfung; unabhängiges Review A09 noch ausstehend.
- **Unabhängige QA:** nicht ausgeführt; keine Implementierung vorhanden.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Änderung.
- **Git-Verifikation:** Working tree geprüft; `git diff --check` nach den Governance-Änderungen erfolgreich (Zeilenendenhinweise möglich). Keine bestehenden Änderungen verworfen; kein Commit/Push.

## T-0065 Phase 1 – isolierte Markt-/Anfrage-/Angebotsruntime

**Status:** V3-A02-Marktruntime und Regressionen geliefert; A03-Fachreview, A05-UI-Verbrauch und A09-unabhängige QA ausstehend. Kein Gesamt-T-0065-Abschluss.

### API- und Zustandsvertrag

Dateien: `prototype/v3-market-simulation.js` und `prototype/v3-market-simulation-regressions.mjs`.

- `createV3MarketState(profile)` verlangt explizite Version-/Laufidentität, `startDate`, Parameterversion, Marktparameter, Kundensegmente, genau ein Unternehmen mit Rolle `player` und mindestens drei explizite Wettbewerberprofile. Gewichte müssen je 1 summieren; Entscheidungs-/Anfragefenster sind explizite Kalender-Tagesbereiche. Keine empirischen Wahrscheinlichkeiten und keine Marktparameter-Defaults.
- `scheduleV3MarketWeek(state, {weekStart, templates})` verteilt vorgegebene, explizite Bedarfsvorlagen reproduzierbar gewichtet-systematisch auf Arbeitstage. Jeder Eintrag führt `macroPeriod`, Größenklasse, Segment, Fähigkeiten, Kapazitätsbedarf, Kundenschlüssel und Referenzpreis. Der Fit verlangt alle Fähigkeiten und ausreichende Kapazität; Reputation, freie Kapazität und Segment-Fit beeinflussen einen nachvollziehbaren Einladungsscore. Kandidaten sortieren stabil nach Score und danach Firmen-ID.
- `advanceV3MarketDay(state, date)` verarbeitet zuerst fällige Kundenentscheidungen und danach die an diesem Tag eingehenden Anfragen. `submitV3MarketOffer(...)` ist während der Tagesaktionsphase möglich; `closeV3MarketDay(...)` führt erst danach den End-of-Day-Ablauf aus. Eine am Ablaufdatum fällige Entscheidung wird dadurch vor dem Ablauf verarbeitet. Anfragen, Angebote, stabile `decisionId`, Ablauf- und Tagesereignisse sind reproduzierbar/idempotent; konkurrierende Zustandswiederholung mit verändertem Payload wird abgewiesen.
- Wettbewerberpreise kommen ausschließlich aus expliziten synthetischen `offerPriceCentsBySizeClass`-Inputs; fehlender Preis bedeutet, dass der Wettbewerber für diese Klasse kein Gebot abgibt. Einzelgebote werden nur in der internen Modellzustandsstruktur geführt. UI muss `getV3MarketPlayerView(state)` nutzen; diese Projektion enthält keine fremden Gebote/Firmenidentitäten. `getV3MonthlyCompetitorReport(state, YYYY-MM)` aggregiert nur nach Größenklasse und liefert Monatsmittel in Cent plus Stichprobenzahl. Eine A01-koordinierte, nicht vom Nutzer getroffene Implementierungskonvention verlangt mindestens drei eindeutige Konkurrenzangebots-IDs pro Klasse und Monat; darunter wird der Mittelwert verborgen und `n` bleibt sichtbar. Das ist keine allgemeine Anonymitäts- oder Datenschutzgarantie.
- Die Gewinnerermittlung ist ein deterministischer gewichteter Segmentvergleich aus relativer Preisposition, Ruf und Segment-Fit. Sämtliche Segmentgewichte sind Profilinputs. Gleichstände werden stabil nach Firmen-ID/Angebots-ID entschieden; es gibt keine Zufallswahrscheinlichkeit oder versteckte Mindestmarge.
- Die Spielerangebotsabgabe verlangt A03s tatsächliches `V3-FINANCIAL-CALCULATION-1`-Snapshotobjekt (`offerId`, `submittedAt`, `netPriceCents`, `costVersion`, `babVersion`, `calculation`). Vorab kann A05 `createV3MarketOfferId(state, submissionEventId)` abrufen und diese stabile ID beim Erzeugen des A03-Snapshots setzen. Snapshotpreis wird auf Netto-Cent geprüft; `calculation.netPriceCents` muss übereinstimmen. Angebot und Snapshot bleiben bei Zuschlag identisch und werden gegen das idempotente Einreichungsereignis validiert. Keine Buchung, Forderung, Verbindlichkeit, Lieferung oder Zahlung wird erzeugt.
- T-0063-Kopplung ist über `macroPeriod` und Szenario-/Seedkontext nachvollziehbar; die Runtime erfindet keine Makro-/Konjunkturkoeffizienten. Die Nachfragevorlagen/-intensität müssen von einer späteren freigegebenen Makro-/Marktintegration kommen. Eine direkte T-0063-Makro-Wirkungsintegration und eine UI-Integration sind nicht Teil dieser isolierten Phase.

### Prüfmatrix

- Vier Kalenderwochen mit je fünf Vorlagen und drei Seeds verteilen Requests über mindestens vier Arbeitstage; alle Termine liegen Montag bis Freitag.
- Einladung/Unternehmensfit schließt fehlende Fähigkeit aus; Kapazität, Ruf und Segmentfit gehen in einen explizit gewichteten Score ein.
- Tägliche Entscheidung vor Anfragen, optionale Spieleraktion vor End-of-Day-Ablauf; Gleichstand Decision/Expiry wird zugunsten zuerst verarbeiteter Entscheidung korrekt aufgelöst.
- Replays der Wochenplanung, Tagesfortschreibung und Angebotsabgabe sind idempotent; abweichender doppelter Angebots-Payload wird abgewiesen.
- Spielerprojektion verbirgt Konkurrenznamen/-preise; Monatsbericht zeigt Größenklassenmittel und Stichprobenzahl, unter der koordinierten Drei-Angebots-Schwelle keinen Mittelwert. Drei synthetische Größenklassen und Segmente sind dauerhaft in A02-Regressionen belegt; die Testwerte sind keine Marktkalibrierung.
- Angenommener Preis und D-0162-Kosten-/BAB-Snapshot bleiben unverändert; Snapshotkorruption wird vom Statevalidator erkannt.
- Reine Anfrage-/Angebots-/Zuschlags-/Ablaufzustände erzeugen keine Finanzwirkung.

**Prüfungen:** `node --check prototype/v3-market-simulation.js`, `node --check prototype/v3-market-simulation-regressions.mjs` und `node prototype/v3-market-simulation-regressions.mjs` bestanden; A03-Kalkulationsregression und globale `git diff --check`/Whitespace-Prüfung werden vor Übergabe noch ausgeführt. A03-Fachreview, A05-UI-Verbrauch, A09-Review, Browser-/Gerätetest und Jahresintegration sind nicht ausgeführt. V1/V2, Schema, UI, `engine.js`, Ledger, Architektur, Commit und Push blieben unberührt.

## Rückfragen/Blocker

Keine Nutzerfrage in dieser Vorphase. **Blocker zur Gesamterledigung:** T-0063 liefert einen integrierten Modellrahmen, quantitative Marktkausalität bleibt bis zur A08/A02-Kalibrierung offen; T-0067 liefert den genehmigten D-0162-Kostenvertrag, dessen gemeinsame Integrationsprüfung mit A03 bleibt offen. Nächster Auftrag: kontrollierte Markt-/Angebotstests mit dokumentierten numerischen Eingabevektoren erstellen und mit A03/A05 abgleichen; danach A09 unabhängigen Review durchführen lassen.

## T-0065 A09-Rework – Wochenplan-Restorehistorie

**Status:** gezielte A02-Korrektur umgesetzt; A09-Final-Re-Review ausstehend. Die ursprüngliche A09-NONPASS-Probe löschte ein `schedule_week`-Ereignis und seine `processedEventIds`-Referenz, ließ aber `scheduledWeeks` und die dazugehörige Anfrage stehen. Der Zustand wurde zuvor akzeptiert; identisches Replay konnte dieselbe `inquiryId` erneut anlegen.

**Änderungen:** `validateState` gleicht nun jede gespeicherte Woche bidirektional mit genau einem Schedule-Ereignis ab, vergleicht Template-Payload und deterministische Inquiry-ID-Liste sowie die abgeleiteten Anfragen. Nicht zugeordnete, fehlende, doppelte oder widersprüchliche Wochen-/Anfragehistorie wird als `invalid_market_state` fail-closed abgewiesen. Wochenplanung prüft außerdem vor dem Anlegen, dass keine generierte Inquiry-ID bereits vorhanden oder innerhalb des Batches doppelt ist. Es wurde keine Cancel-Semantik ergänzt. Ein gültiger Wiederholungsaufruf bleibt durch das bestehende gespeicherte Idempotenzereignis ein No-op.

**Regressionen:** Der konkrete A09-Verlauf wird durch Entfernen des Schedule-Ereignisses plus Event-Index reproduziert. Validator und Replay lehnen den korrupten Restore ab; der übergebene Zustand wird nicht mutiert und enthält weiterhin nur eine Anfrage je ID. Ein gültig restaurierter Wochenplan wird erneut abgespielt und bleibt `duplicate=true` ohne Anfragezuwachs.

**Prüfungen:** `node --check prototype/v3-market-simulation.js` PASS; `node --check prototype/v3-market-simulation-regressions.mjs` PASS; `node prototype/v3-market-simulation-regressions.mjs` PASS; `node prototype/v3-financial-calculation-regressions.mjs` PASS; gezieltes `git diff --check` für Runtime, Regression und diesen Bericht PASS. Unabhängiger A09-Re-Review ist nicht ausgeführt. A05-UI, Gesamtintegration, Browser-/Gerätetest und Jahreslauf bleiben außerhalb dieser Korrektur offen. Keine V1/V2-, UI-, Schema-, Architektur- oder Finanzbuchungsänderung; kein Commit/Push.

## T-0065 Abnahmerework – drei Segmente/Größen und Mindeststichprobe

**Status:** A02-Runtime/Regression und Vertragsnotiz aktualisiert; A05-Fixture/DOM-Nachweis ist ein separater Handoff. A08 weist darauf hin, dass `n=2` Mittelwert plus Stichprobenzahl die Summe der beiden Werte offenlegt. A01 koordinierte daher für die V3-Implementierung eine feste Mindestschwelle von drei eindeutigen Konkurrenzangebots-IDs je Größenklasse/Monat. Das ist eine Spiel-Aggregationskonvention, keine Rechts-/Statistik-/Datenschutzgarantie oder empirische Kalibrierung und keine Nutzerentscheidung.

Die Runtime lehnt Profile mit `minimumMonthlyCompetitorSample < 3` ab. Der Mittelwert zählt eindeutige `offerId`s, damit ein wiederholter Eintrag denselben Konkurrentenbeitrag nicht mehrfach über die Schwelle heben kann. Der dauerhafte A02-Testlauf enthält jetzt drei Größen-/Segmentklassen (`small`, `medium`, `large`) mit ausdrücklich synthetischen Gewichten, Kapazitäts-/Referenzpreisen und Konkurrenzgeboten. Monatsbericht-Regressionen belegen alle drei Klassen, `n=2`-Unterdrückung, einen exakt auf `n=3` liegenden Mittelwert und Duplikat-ID-Nichtzählung. A05s `prototype/v3/market.js` und DOM-Regression blieben entsprechend A01s Scope-Klarstellung unangetastet; sie verwenden noch die frühere Schwelle 2 und zwei Klassen/Segmente und müssen durch A05 synchronisiert werden.

**Offene Review-Handoffs:** A08 soll die Einordnung der Schwelle als begrenzte Aggregationskonvention gegen seinen Befund prüfen. A09 soll drei Größen/Segmente, Profil-Untergrenze sowie Unter-/Exakt-am-Schwellen-Test unabhängig prüfen. A05 erhält den identischen Fixture-Vertrag: Segmente/Größen `small|medium|large`; Gewichte Small `.60/.20/.20`, Medium `.50/.25/.25`, Large `.40/.25/.35`; Kapazität/Referenzpreis `2/11000`, `4/33000`, `5/55000` (Cents); Konkurrenzpreise A `10000/30000/50000`, B `12000/36000/62000`, jeweils explizite synthetische Testwerte; Ineligibles `1/1/1`; `minimumMonthlyCompetitorSample: 3`. Kein Aussageclaim, dass dies reale Marktwerte oder garantierte Anonymität sind.

**Rework-Validierung:** A02-Syntax, Marktregressionen, A03-Finanzregression und gezielter Whitespacecheck PASS. A05s UI-Regression wurde gegen den nun verschärften Validator ausgeführt und schlägt wie erwartet beim noch unveränderten Demo-Profil (`minimumMonthlyCompetitorSample: 2`) fehl; A01 hat A05 eine getrennte Synchronisierung zugewiesen/zuweisen. Daher kein A05-PASS behauptet.
