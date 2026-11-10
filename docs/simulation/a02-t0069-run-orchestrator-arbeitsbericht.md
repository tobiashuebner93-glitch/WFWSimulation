# A02-Arbeitsbericht – T-0069 V3 Run-Orchestrierung

**Status:** Implementiert, A02-Selbstreview PASS; unabhängige QA und Gesamtticket weiter offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069
**Startprofil:** V3-Szenariostart 2027-01-04; Ziel ist ein explizit übergebener Datumsbereich.
**Entscheidungsbezug:** D-0159, D-0161–D-0164; insbesondere D-0159 (keine V3-Tagesblockierung durch Lernereignisse), D-0161 (Rechtsstand), D-0162 (Monats-/Stichtagsperioden), D-0163/D-0164 (MRO-/Rechtsformkandidaten; keine automatische Finanzwirkung).
**Vorgänger:** CP-0280 (ENTWURF), davor CP-0279 (ENTWURF).
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; der Arbeitsbaum enthielt vor der Änderung zahlreiche bereits vorhandene Änderungen anderer Rollen. Diese blieben unangetastet.

## Preflight

Vor der Änderung wurden AGENTS.md, Agentenstruktur und Rechtekarte, MG-002-Ziele, Ticket Board, Collaboration State, Decision Log, A01-V3-Arbeitsplan, CP-0280 und die T-0069-Integrationsanalyse sowie A02-/A03-Runverträge gelesen. Die aktuellen Module `v3-market-simulation.js`, `v3-product-lifecycle.js`, `v3-macro-simulation.js`, `v3-company-formation.js` und `v3-financial-calculation.js` wurden auf ihre vorhandenen Exportverträge geprüft. Es wurde kein Schema-/Architekturentscheid vorausgesetzt.

## Umgesetzter Umfang

- `prototype/v3-run-orchestrator.js` führt explizite, tägliche Kalendertage in einem gemeinsamen, serialisierbaren Run-Kontext. Es prüft Run-/Szenario-/Seed-/Startdatumbezüge der eingesetzten Modulstände und weist widersprüchliche Identitäten ab.
- Die Markttagesfolge nutzt bestehende A02-Funktionen: optionale explizite Wochenplanung am Montag, fällige Kundenentscheidungen und Anfragen, Spielerangebote am wirksamen Tag und Tagesabschluss/Verfall. Angebote können über eine eindeutige, an diesem Datum offene `templateId` referenziert werden; die bestehende A03-Kalkulationssnapshot-Prüfung bleibt maßgeblich.
- Eine gewonnene Kundenentscheidung erzeugt genau einen operativen Arbeitsauftragsverweis mit Status `awaiting_operational_plan`. Der vorhandene Produktlebenszyklus wird nur kalenderseitig weitergeschaltet; es wird keine unbelegte Kundenfertigungs- oder Lieferlogik behauptet.
- Gemeinsamer Tages-Replay mit identischem Payload ist idempotent; abweichender Payload, Datumssprung, beschädigter Run-Verlauf und inkonsistente Moduluhren werden zurückgewiesen.
- Mögliche Finanzhandoffs bleiben `pending_non_posting`. Der Run hat keine A03-Ledger-/Cashmutation; Annahme einer Kundenofferte wird nicht als Leistung, Abnahme, Rechnung oder Zahlung behandelt.
- Makromonats-, Rechtsträgerereignis- und Produktzustände können über ihre bestehenden Verträge angebunden werden. Sie erfordern explizite Inputs; fehlende Makrodaten oder Ereignisse werden nicht synthetisch ergänzt. Eventfragen des Lernkatalogs werden nicht beantwortet oder angewendet, da T-0068 keine item-spezifische Laufzeitwirkung freigibt und D-0159 keine V3-Tagesblockierung zulässt.

## Tests

PASS:

- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-product-lifecycle-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`
- `node prototype/v3-company-formation-regressions.mjs`
- `node prototype/v3-financial-calculation-regressions.mjs`
- `node --check prototype/v3-run-orchestrator.js`
- manuelle Prüfung auf nachgestellte Leerzeichen in den drei Lieferdateien

Die Run-Regression belegt deterministische Wiederholung, ausschließlich sequenzielle Tagesübergänge, Wochenplanung/Tageseingänge, Erstellung maximal eines Arbeitsauftrags pro angenommener Entscheidung, explizit nicht-postende Finanzreferenzen und Ablehnung beschädigter Run-Historie.

## A09-Re-Review-Rückgabe und gezielte Korrektur

A09 meldete in `docs/test-reports/a09-t0069-run-orchestrator-review.md` vier NONPASS-Befunde. A02 hat sie mit enger Scopegrenze korrigiert:

1. Ein T-0066-Produktzustand mit `currentDate === startDate` ist nun gemeinsam validierbar. Der Produktuhr-Validator verlangt nach jedem Run-Tag exakt den letzten gemeinsamen Arbeitstag (vor dem Startdatum den festgelegten Starttag). Regression belegt den Start 2027-01-04 und den Folgearbeitstag.
2. Makroperioden dürfen nicht nach dem Kalendermonat des Shared-Run-Datums liegen. Regression akzeptiert die passende Startperiode 2027-01 und weist einen sonst gültigen Zustand bis 2028-02 zurück.
3. Doppelte idempotente Angebots-Submissions werden nicht nochmals in `dayEvents` protokolliert; der Run-State-Validator weist fehlende oder doppelte Event-IDs in restaurierter Historie zurück.
4. Work-Order-Referenzen müssen vollständig einem tatsächlich gewonnenen Marktentscheid des Spielers entsprechen und exakt im nichtoperativen Status verbleiben. Finanzhandoffs müssen genau zu diesen Work Orders gehören und `pending_non_posting` bleiben; zusätzliche Felder, Waisen und `posted` werden zurückgewiesen.

Diese Korrekturen führen keine neue Produkt- oder Finanzregel ein. Sie halten lediglich die vorhandene Uhr-/Quellverknüpfung und A02-Nonposting-Grenze durchsetzbar. A09-Re-Review der Korrekturen ist noch nicht ausgeführt.

### RUN-04-Folgekorrektur nach A09-Re-Review

A09 fand im Re-Review einen weitergehenden Restore-Angriff: Eine vorhandene offene Anfrage ließ sich durch Mutation ihrer Entscheidungsfelder als Spielergewinn tarnen; dazu passend ergänzte Work-Order- und `pending_non_posting`-Handoff-Datensätze wurden akzeptiert. Ursache war, dass A02 die Felder des Inquiry prüfte, aber ihre Entscheidungs-ID nicht gegen das originale Markt-Eventlog band.

`validateV3RunState` verlangt nun für jeden gewonnenen Spielerauftrag zusätzlich:

- eine deterministisch aus Modulversion, Szenario, Run, Seed und Inquiry abgeleitete `decisionId`;
- ein vom Marktmodul protokolliertes `advance_day`-Ereignis mit übereinstimmendem Datum und Entscheidungsresultat;
- ein im Inquiry vorhandenes, tatsächlich als `accepted` markiertes Gewinnerangebot des Spielers, dessen ID dem Entscheidungsresultat entspricht.

Die persistente Restore-Regression mutiert ein echtes offenes Inquiry, erfindet Entscheidung und Gewinnerangebot und fügt passende Work-Order-/Handoff-Objekte ein. `validateV3RunState` weist diesen Zustand zurück. Das ändert weder Marktentscheidung noch Finanzsemantik und erteilt keine Postingberechtigung; der A02-Handoff bleibt `pending_non_posting`. A09-Re-Review dieser engeren Folgekorrektur ist angefragt und noch nicht ausgeführt.

### T-0069-Submission-Snapshot-Bindung nach A09-Adversarial-Repro

A09 zeigte, dass eine einseitige Mutation an `offer.calculationSnapshot.costVersion` abgewiesen wurde, während dieselbe Änderung an der Angebotskopie und dem zugehörigen `submit_offer`-Payload im restaurierten Marktstate die bisherigen Gleichheitsprüfungen passierte. Die Ursache: beide Kopien wurden miteinander verglichen, aber ihre Kosten-/BAB-Identität hatte keine unabhängige Ereignisresultat-Bindung.

Der Market-Submit speichert und validiert nun zusätzlich `result.snapshotBinding` mit `modelVersion`, `offerId`, `submittedAt`, `netPriceCents`, `costVersion` und `babVersion`. Dieses Resultat wird in den Shared-Run-Event gespiegelt; der Run-Validator verlangt weiterhin dessen Gleichheit zum Marktquellereignis. Die A02-Regression weist sowohl die einseitige Snapshotmutation als auch die von A09 gezeigte parallele Mutation von Angebotskopie und Payload zurück, solange das unabhängige Submission-Resultat unverändert bleibt. Das ist eine fail-closed **Konsistenzprüfung im serialisierten lokalen State**, keine kryptografische Signatur oder Manipulationssicherheit.

Die lokale Provenienzgrenze ist ausdrücklich: Wer den gesamten gespeicherten Clientzustand ändern kann, kann auch `snapshotBinding` sowie Markt- und Run-Eventresultate ersetzen. Ohne vertrauenswürdigen externen Anker lässt sich ein gemeinsam veränderter lokaler Snapshot nicht als ursprüngliche Nutzerabgabe beweisen. Für manipulationssichere Wiederherstellung wäre ein serverkontrolliertes append-only Submission-Log oder ein serverseitig signiertes/persistiertes Snapshot-Commitment nötig; dies liegt außerhalb dieses A02-Tickets und erfordert eine spätere A01/A11/A04-Abstimmung. Keine kryptografische oder sicherheitsbezogene Zusage wird durch die Regressionen gemacht.

**Gezielte Nachprüfung:** Die Run-Regression belegt persistent sowohl das einseitige Ändern von `offer.calculationSnapshot.costVersion` als auch die A09-Reproduktion, bei der zusätzlich derselbe Wert im `submit_offer`-Payload ersetzt wird; beide Zustände werden mit `invalid_market_state` abgewiesen. A09-Re-Review dieser Korrektur steht aus.

**Regressionen nach Änderung:** `node --check` für Markt-, Run- und Run-Regressionsdateien; Run-Orchestrator- und Market-Regressions PASS. Finance-Calculation, Finance-Runtime, A05 T-0067 BAB UI und A05 T-0069 Run-UI Regressionen PASS. Die separate A09-Datei `prototype/a09-t0069-run-ui-adversarial-regressions.mjs` bleibt FAIL an Zeile 14, bevor sie ihren UI-Angriff testet: Test erwartet `/variableCost|Kostenart/i`, während die aktuelle Run-UI-API wegen fehlendem `directCostsJson` mit „Direkte Kosten: gültiges JSON-Array eingeben.“ abbricht. A02 hat die A05/A09-UI-Datei nicht geändert; das Ergebnis ist als unabhängiger UI-Testcontract-Blocker an A01 zu koordinieren.

## Grenzen / offene T-0069-Blocker

Diese Lieferung ist eine Orchestrierungsschicht, kein vollständiger Unternehmensjahreslauf. Der Bestand hat weiter keinen autorisierten Kundenfertigungsplan-Adapter zwischen Marktauftrag und T-0066-Prozessschritten, keine belegte Lieferung/Empfängerabnahme, keine gemeinsame A03-Ist-/Rechnungs-/Zahlungs-/Bestandsbewertungs-API und keine integrierte 12-Monatsreconciliation. Makromonatsläufe benötigen ausdrücklich versionierte Monatsinputs; es wird kein Jahresmakroprofil erfunden. Lernfragen haben keinen autorisierten runtime-wirkenden Katalogadapter. Deshalb bleiben tragfähige/gescheiterte Jahresfälle, Finanzabstimmung und Browser-/Mobilprüfung außerhalb dieses Arbeitsberichts und T-0069 insgesamt offen.

## Nachweisrollen

- **Ausführung:** A02; zwei neue Dateien angelegt.
- **Fachreview:** A02-Selbstreview PASS gegen D-0159, A02-Tagesfolge und A03-Nonposting-Grenze.
- **Unabhängige QA:** Erstreview A09 NONPASS (RUN-01–RUN-04), danach PASS für RUN-01 bis RUN-03 und verbleibender RUN-04-Provenienzbefund. A09 meldete nun zusätzlich den hier korrigierten Snapshot-Bindungsfall; unabhängiger Re-Review dieser Korrektur steht aus.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Dateien geändert.
- **Git-Verifikation:** `main`, HEAD wie oben; `git status --short` führt die drei Lieferdateien als ungetrackt und zahlreiche andere lokale Änderungen auf. Da `git diff --check` ungetrackte Dateien nicht prüft, wurden diese drei Lieferdateien separat auf nachgestellte Leerzeichen geprüft (PASS). Vorhandene Änderungen blieben unangetastet. Kein Commit oder Push.

## Nächste Übergabe

**A09 – QA** prüft unabhängig die beiden neuen A02-Dateien, einschließlich beschädigter History, gleicher/abweichender Replaypayloads, Kalendergrenzen und genau-einmaliger Entscheidung→Arbeitsauftragsreferenz. Danach ist der konkrete Befund an A01 zu richten. T-0069 bleibt bis zur operativen/finanziellen Vollintegration und den Jahres-/Browser-Gates IN_PROGRESS.
