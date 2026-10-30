# T-0062 A03 – unabhängiger Finanzreview

**Status:** REVIEW ABGESCHLOSSEN; Arbeitsbaum-Nachweis, nicht commitgebunden  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Rolle:** A03 – ACCOUNTING_FINANCE  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0062  
**Prüfbasis:** `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`; Arbeitsbaum mit bestehenden lokalen Änderungen, darunter CP-0266. Die Prüfung bezog diese Arbeitsbaumfassung ein; kein Commit-/Tree-Hash des geprüften Gesamtstands verfügbar.

## Preflight und Prüfumfang

AGENTS.md, Agentenstruktur, Rechtekarte, Goals, Ticket-Board, Collaboration State, Entscheidungslog sowie A03-Finanzspezifikation geprüft. T-0062 gilt für MG-002; maßgeblich sind spätere genehmigte Entscheidungen vor älteren Arbeitsständen. A03 hat nur Finanzwirkung validiert. Keine Produktdatei oder Finanzlogik geändert.

## Ergebnisse

| Gate | A03-Befund | Aussage |
|---|---|---|
| G02 Jahressolvabilität | **PASS auf geprüfter Arbeitsbaumfassung** | Der 365-Tage-Smoke läuft 01.01.2027 bis 01.01.2028 mit 12 Monatsabschlüssen, 12 SimTAX-Perioden, keinem Spielverlust, Minimum verfügbarer Liquidität 2.892,16 € am 31.12.2027, 0 € offenen Kosten, keiner Monatsabstimmungsdifferenz und Ereignis-Hash `15a7c97702f1fccafc128db1d00cb340d5b066604edaec67dea74f9e4079078a`. Das bestätigt den aktuellen Lauf, aber noch keine formale gemeinsame Commitbindung. |
| G04 Zeitarbeit | **TEILWEISE PASS; formales Gate OFFEN** | T-0059- und Workforce-Regressionsläufe bestanden. Ein isolierter Finanz-Fixturetest bestätigte für Januar 120 € einmalige Vertragsgrundgebühr + 16 × 43 € Stunden = 808 €; für Februar 120 € + 8 × 43 € = 464 €. Grundgebühr wird je Vertrag/Monat einmal berücksichtigt; Stunden werden auf aktive Einträge summiert. Unabhängige Gesamt-UI-/A09-Abnahme fehlt weiterhin. |
| G11 Finanzkonsistenz | **TEILWEISE PASS; unabhängige Gesamtfreigabe OFFEN** | CP-0266 grenzt frühere Statushinweise redaktionell ab. Die fachliche Unterscheidung ist im Wesentlichen tragfähig: D-0053–57 bestimmen SimTAX-Basis, Rundung, Anwendungsbereich und Korrektur; D-0113/14 bestimmen die vereinfachte Vorsteuerbehandlung. Sie entscheiden nicht automatisch die allgemeine Netto-/Brutto-Preissemantik aller Angebote und Rechnungen. Die noch offene Zeile hierzu ist daher nicht allein wegen der SimTAX-Beschlüsse überholt. Kosten-/Perioden-/Zuordnungsdetails und konkrete SimTAX-Fehlererkennungsereignisse bleiben ebenfalls ausdrücklich offen. |

## Ausgeführte Prüfungen

- `node prototype/year-simulation-smoke.mjs` – Exit 0; vollständige Kennzahlen siehe oben.
- `node prototype/t0059-regressions.mjs` – PASS, einschließlich Buchung/Rückgabe, aktiver Einsatztage, Tagessequenz und Wochenendzuweisung.
- `node prototype/v2-workforce-learning-regressions.mjs` – PASS; 10 Personen je Agenturpool, Wochen-/Monatsdauer, Kapazitätsgrenze und fehlende Auftragsbindung bestätigt. Dieses Skript belegt nicht eigenständig Finanzabschlusswerte.
- `node prototype/one-award-solvency-regressions.mjs` – PASS als erwarteter negativer Kontrollfall: ein gewonnener Auftrag führt zum erklärten Zahlungsausfall/Spielverlust. Kein erfolgreicher Jahreslauf und daher kein G02-Solvabilitätsbeleg.
- Isoliertes `closeMonthlyPeriod`-Fixture – PASS für Vertragsgrundgebühr und Stundenabrechnung im Januar/Februar.
- Keine Browser-/Geräteprüfung in dieser A03-Aufgabe.

## Fachliche Hinweise zu P/R

Die neue Einleitung von Abschnitt P verhindert die irreführende Gleichsetzung aller historischen OPEN-Vermerke mit aktuellen Nutzerfragen. Für künftige Pflege sollten offene Semantiken einzeln mit Geltungsbereich referenziert werden: allgemeine Preis-Netto-/Bruttobasis; noch nicht festgelegte laufende Kosten und Kostenstellen-/Periodenzuordnung; offene konkrete Ereignisdetails. SimTAX-Satz und Rechenmechanik sind davon getrennte Entscheidungen. Im Decision Log gibt es keinen Beleg, der diese gesamte Betragssemantik pauschal abschließend festlegt.

## Prüfungsrollen / Verifikationsgrenzen

- **Ausführung:** A03 (dieser Review).
- **Fachreview:** A03 – Ergebnis in diesem Bericht.
- **Unabhängige QA / Release Committee:** nicht ausgeführt; A09-Bericht noch erforderlich.
- **Browser-/Gerätetest:** nicht ausgeführt durch A03; bestätigter Nutzer-Gerätebeleg bleibt der bestehende Nachweis.
- **Git-Verifikation:** HEAD gelesen; Arbeitsbaum war verändert. Kein Commit/Push ausgeführt.

## Folge

G02s rechnerische Jahreskriterien sind auf der Arbeitsbaumfassung belegt, aber der Gate-Bericht bleibt bis zu gemeinsamer Revision-/Commitbindung formal OFFEN. G04 benötigt weiterhin QA/UI-Abzeichnung. G11 benötigt unabhängige A08/A09/A11-Reviews. T-0062 bleibt damit offen; keine Rückfrage an den Nutzer.

## Zusatzreview A03 – Reihenfolge V2-Ratenkauf und Immobilienfinanzierung

**Auftrag:** Zusatzbefund aus A11 zu MG-002 / SLG-002.2 / T-0062; Review-Basis weiterhin `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d` mit lokal geänderten Quellen. Nur Read-only außerhalb dieses Reviewberichts; keine Tests für diesen Zusatzauftrag.

### Fachlicher Abgleich

- **D-0129** heißt ausdrücklich „… für V1“ und ordnet V1-Kundeneingänge, Maschinendarlehen, eigene Verbindlichkeiten und SimTAX. Sie legt keine V2-Rangfolge für Immobilien- oder Inventarraten fest.
- **D-0149** definiert den V2-Ratenkauf als illustrative Finanzierung (8 % p. a., 12 Monate, Rahmenbegrenzung), aber keine Tagesverarbeitungsreihenfolge. Die V2-Inventarspezifikation sagt ebenfalls nichts zur Priorität am selben Tag.
- Die **V2-Standort-/Finanzspezifikation** verlangt ein gesondert verhandeltes Immobiliendarlehen und eine Szenario-Grundschuld. D-0148 sperrt den Verkauf des belasteten Standortes bis zur Tilgung, setzt aber keine Tagesrangfolge seiner Rate.
- Die **Simulationsspezifikation** ordnet Finanzereignisse allgemein Phase 8 zu; eine V2-Unterreihenfolge für Anlagen- und Immobilienraten ist dort nicht genannt.

### Beobachtete Implementierung

`app.js` ruft in `processDay()` `processEquipmentInstallments(...)` nach Tagesfortschritt, aber **vor** `processFinancialDay(...)` auf. Innerhalb von `processFinancialDay` verarbeitet `finance.js` zuerst Kundeneingänge/Disporückführung, dann Maschinendarlehen, danach Immobilienrate, offene Kosten/sonstige Zahlungen und SimTAX. Damit gilt aktuell am gemeinsamen Fälligkeitstag:

1. Inventar-/Ratenkaufrate wird vor einem noch am selben Tag fälligen Kundeneingang versucht.
2. Kundeneingang/Disporückführung erfolgt.
3. Maschinen- und Immobilienrate werden versucht.
4. Sonstige offene Kosten und SimTAX folgen.

Das ist deterministisch implementiert, aber die Anlagenrate steht im selben Phase-8-Finanzfluss zeitlich vor dem Kundeneingang, während die Immobilienrate danach steht. Aus dem V1-D-0129 lässt sich keine verbindliche V2-Vorrangregel ableiten.

### Bewertung

**Kein direkter Regelwiderspruch zu D-0129; V2-Fachregel und Dokumentation sind unvollständig.** Weil die Reihenfolge entscheidet, ob ein am selben Tag eingehender Kundenzahlungsbetrag zur Bedienung einer Rate verfügbar ist, beeinflusst sie Liquidität, Rückstände und mögliche Folgewirkungen. A01 sollte eine deterministische V2-Konvention festlegen oder als Nutzerentscheidung bündeln; A03 entscheidet diese Produktpriorität nicht eigenmächtig.

Mögliche Konventionen für A01:

1. **Alle Kundeneingänge zuerst, danach alle festen Darlehens-/Anlagenraten, danach andere eigene Verbindlichkeiten und SimTAX.** Entspricht dem V1-Grundmuster der Mittelverfügbarkeit; erlaubt Geldeingang am selben Tag zur Ratenzahlung.
2. **Bestehende Reihenfolge beibehalten und ausdrücklich dokumentieren:** Anlagenrate vor Kundeneingang; danach Maschine, Immobilienrate, offene Kosten, SimTAX. Bewahrt Verhalten bestehender V2-Spielstände, kann aber bei knapper Liquidität eine Anlagenrate scheitern lassen, obwohl am selben Tag später Kundengeld eingeht.
3. **Kundeneingang zuerst, dann feste Kredite nach expliziter stabiler Reihenfolge (z. B. Maschine, Immobilie, Anlage), danach variable eigene Posten/Steuer.** Macht Darlehensrang reproduzierbar, benötigt aber eine neue V2-Prioritätskonvention.

Keine dieser Alternativen ist als Nutzerentscheidung oder Rechtsvorgabe dokumentiert. Die ausbleibende Zahlung hat je Finanzierungsart derzeit eigene Folgen; die Ordnung sollte daher zusammen mit den Retry-/Verwertungsfolgen explizit bleiben. Keine Empfehlung als freigegebene Policy erteilt.

### Schlussfolgerung zum Zusatzbefund

- **A03 fachlicher Befund:** kein normativer Konflikt, aber offene V2-Ereignispriorität mit Liquiditätswirkung.
- **Gate-Bezug:** G11 bleibt für diesen Punkt offen, bis A01 den Status als explizite V2-Annahme/Entscheidung dokumentiert und A02/A03 die Übereinstimmung von Text und Aufrufreihenfolge bestätigen.
- **Änderungen:** nur dieser A03-Reviewbericht; Produktcode und Spezifikationen blieben unangetastet.
- **Prüfung:** keine zusätzlichen Testpfade gemäß Auftrag.

## Folgeprüfung A03 – A01-Vorschlag zum Ereignisvertrag

**Auftrag:** T-0062, zweiter A03-Fachabgleich des A01-Arbeitsvorschlags gegen D-0120/D-0129, die SimTAX-Beschlüsse und V2-Code. Prüfbasis: `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d` plus aktueller geänderter Arbeitsbaum. Keine Produktdateien, Entscheidungen oder Spezifikationen geändert; keine Nutzerfrage.

### Fachliche Bewertung des vorgeschlagenen V2-Ablaufs

A03 bestätigt den Vorschlag mit einer Ergänzung zur Steuerzahlung:

1. Am wirksamen Datum zuerst alle fälligen Kundeneingänge; gemäß D-0126 wird ein Eingang zuerst gegen gezogenen Dispo verrechnet. Nur der verbleibende Betrag ist verfügbare freie Liquidität.
2. Danach feste Raten in stabiler Reihenfolge: Maschinendarlehen → Immobiliendarlehen → Ausstattung/Ratenkauf.
3. Danach eigene sonstige Lieferanten-/Betriebsverbindlichkeiten in der vom Spieler festgelegten Reihenfolge.
4. SimTAX bleibt ein eigener terminierter Zahlungsschritt nach den priorisierten betrieblichen Verbindlichkeiten gemäß D-0129; er ist nicht Bestandteil der vom Spieler sortierbaren Rechnungsreihenfolge.
5. Jede Rate/Verbindlichkeit wird nur vollständig und nur aus ausreichender verfügbarer Bankliquidität bezahlt, soweit keine bereits ausdrücklich bestätigte Sonderregel greift. Es entsteht kein negativer Cashbestand und kein automatischer Dispoabruf allein durch diese Reihenfolge.

Die ersten beiden Punkte nutzen die bestätigte Same-Day-Regel D-0120 und die priorisierte Disporückführung D-0126. Die Maschinenrate vor anderen festen V2-Raten übernimmt die bereits festgelegte V1-Reihenfolge aus D-0129; die anschließende Priorität Immobilie vor Ausstattung ist eine neue deterministische **V2-Spielkonvention**, keine Rechts- oder allgemeine Bankregel. Sie beseitigt Zufälligkeit bei knappem Cash und ordnet den grundstücksbesicherten Standortkredit vor einem illustrativen Inventar-Ratenkauf. Die danach vom Spieler gewählten sonstigen Zahlungen erhalten die bestehende D-0021/D-0129-Spielerpriorität.

### Preis-/SimTAX-Abgrenzung

A03 bestätigt auch die Szenario-Betragssemantik des Vorschlags: Angebots-/Vertragspreis ist ein Nettoszenario-Preis; bei der Rechnung wird die bestätigte SimTAX von 19 % getrennt ausgewiesen; der Bruttorechnungsbetrag ist der Zahlbetrag. Das ist im Code bereits die Form von `issueInvoice` und der Auftragsangebotseingabe (Netto), ebenso der sichtbaren Rechnungsaufstellung. Für Inventarkäufe bestimmt D-0156 bereits netto Katalog-/Anlagebasis, separate SimTAX und Brutto-Cash-/Finanzierungsbetrag.

Das bleibt eine didaktische Szenariokonvention. Sie ist weder Feststellung des realen USt-Status des Unternehmens noch Aussage, dass § 19 UStG nicht anwendbar wäre, noch eine Konformitäts- oder Steuerberatungsaussage. D-0053–57 und D-0113/14 tragen die SimTAX-Basis, Rundung, Rechnungsreichweite und begrenzte Vorsteuerbehandlung; sie werden nicht über ihren beschriebenen Geltungsbereich hinaus verallgemeinert.

### Codeabweichung und Übergabebedarf

Der beschriebene Ereignisvertrag entspricht **noch nicht** der aktuellen V2-Implementierung. `app.js::processDay()` ruft `processEquipmentInstallments()` derzeit vor `processFinancialDay()` auf. Damit versucht der Code Ausstattungskreditraten vor Kundeneingängen; anschließend läuft in `finance.js::processFinancialDay()` die Folge Kundeneingang/Disporückführung → Maschine → Immobilie → offene Betriebsposten → SimTAX. Für Implementierung des A01-Vorschlags muss die Anlagenratenverarbeitung in die gemeinsame Finanzreihenfolge aufgenommen und nach Immobilienrate eingeordnet werden. A02 muss Ereignisphase/wirksames Datum und eine idempotente Stelle im Tagesablauf bestätigen; A03 bestätigt Buchungs-/Cashwirkung und die Reihenfolge oben.

### Ergebnis / Gate

- **D-0120/D-0129:** kein Konflikt; der Vorschlag übernimmt bestätigte V1-Grundsätze und kennzeichnet zusätzliche Reihenfolge korrekt als neue V2-Konvention.
- **SimTAX / Betragssemantik:** konsistent mit den einschlägigen Entscheidungen und der vorhandenen Rechnungsdarstellung, sofern der enge Szenario-/Rechtsvorbehalt aus diesem Abschnitt in der Dokumentation des Ereignisvertrags mitgeführt wird.
- **V2-Code:** derzeit abweichend; Implementierung und gezielter Same-Day-Test sind weiterhin nötig. Bis dahin ist dies ein echter Dokument-/Code-Konflikt gegenüber dem vorgeschlagenen Sollablauf, nicht bereits ein produktionsseitig bestätigter Vertrag.
- **A03-Empfehlung:** A01 kann den Vorschlag mit obiger SimTAX-Abgrenzung als V2-Konvention für den gemeinsamen A02/A03-Ereignisvertrag verwenden und danach Implementierung sowie Review beauftragen. Keine neue Nutzerentscheidung ist nach der vorliegenden Delegation nötig.
- **Tests:** keine gemäß Folgeauftrag.
- **Git:** nur dieser eigene Reviewbericht ergänzt; kein Commit/Push.

### Zusatzpräzisierung: manuelle Dispoziehung bei Raten

Der Ereignisreihenfolge-Vorschlag legt noch nicht fest, ob die in D-0125 beschlossene **manuelle** exakte Dispoziehung bei unzureichender Liquidität auch eine fällige Immobilien- oder Ausstattungsrate bedienen darf. D-0125 formuliert allgemein eine eigene fällige Vollzahlung; der aktuelle UI-/Codepfad bietet den manuellen Abruf aber für Maschinenrückstände und bestimmte offene Betriebsposten, nicht sichtbar für Immobilien-/Ausstattungsraten. Keine automatische Ziehung folgt daraus.

Für einen konsistenten Ereignisvertrag sollte A01 (mit A02/A03) diese Ausnahme explizit führen: Kundengeld/Disporückführung zuerst; Ratenversuche in fester Reihenfolge; bei unzureichender Kasse kein automatischer Draw; ein vom Spieler gewählter, exakt auf den Fehlbetrag begrenzter Draw darf nur dann die Rate vollständig bedienen, wenn die Regel D-0125 und ein nutzbarer UI-Pfad dies für diese Kreditart einschließen. Lehnt der Spieler ab bzw. reicht das Limit nicht, gilt das jeweilige Retry-Verhalten. Die bestehende Folge (Maschine mit D-0042/43; Immobilie/Ausstattung nach aktuellem Code jeweils wöchentlich) unterscheidet sich pro Kreditart und muss bei Umsetzung erhalten oder ausdrücklich abgegrenzt werden. Dies ist Implementierungs-/Umfangsklarheit; kein Beleg für eine zusätzliche automatische Kreditaufnahme.

## Folgeprüfung A03 – A02-Gegenentwurf des gemeinsamen V2-Ereignisvertrags

**Status:** Fachabzeichnung mit präziser Implementierungsbedingung  
**Prüfbasis:** T-0062 / MG-002 / SLG-002.2; `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d` plus lokaler Working Tree. Maßgeblich: D-0120, D-0125, D-0126, D-0129, D-0149, D-0156; bestehende Finanzspezifikation und V2-Implementierung gelesen. Kein Code-/Spezifikationsedit.

### Abzeichnung

A03 bestätigt den A02-Vertrag fachlich für V2 mit folgender Reihenfolge am **wirksamen Simulationstag in Phase 8**:

1. Kundeneingänge vollständig ohne eigenes Cash-Gate; jeden Eingang zuerst zur Disporückführung nach D-0126 verwenden, verbleibender Betrag erst danach als freier Bankbestand.
2. Fällige feste Raten in stabiler Ordnung: Maschinendarlehen → Immobiliendarlehen → Anlagen-/Ausstattungsraten. Bei mehreren Raten desselben Typs: älteste Fälligkeit, danach stabile Vertrags-ID.
3. Sonstige fällige oder erneut fällige eigene Betriebsposten in gespeicherter Spielerreihenfolge; bei fehlender/gleicher Rangfolge Fälligkeit, dann stabile Posten-ID.
4. Fällige SimTAX-Zahlungen danach als nicht umsortierbare Einzelposition nach bereits geltender SimTAX-Logik.
5. Erst im Anschluss Mahn-/Reminder- und Statusfortschreibung; ein am Tag vollständig bezahlter Posten erhält für diesen Tag keine neue Mahnung.

Das übernimmt D-0120/D-0126 für Eingang und Dispo und erhält D-0129s V1-Maschinenraten-/Betriebsposten-/SimTAX-Grundstruktur, ohne dessen Geltung rückwirkend von V1 auf V2 auszudehnen. Die neue feste Priorität Immobilie vor Ausstattung ist die vom Nutzerauftrag gedeckte V2-Simulationskonvention, keine behauptete gesetzliche oder allgemeine Bankrangfolge.

### D-0125-Grenze

A03 bestätigt die enge A01-Grenzung: Der manuelle Dispozugriff nach D-0125 bleibt auf ausdrücklich erfasste fällige eigene Rechnungen beschränkt. Es gibt keine automatische Ziehung. Der Vertrag erweitert den Abruf nicht stillschweigend auf Immobilien- oder Anlagenraten. Falls später eine Erweiterung gewünscht wird, braucht sie eine getrennte Produktentscheidung/Abgrenzung und sichtbaren Nutzerpfad. Bei unzureichender Kasse bleiben Rate und jeweilige bestehende Retryfolge kreditartspezifisch; keine zusätzlichen Gebühren, Zinsen, Strafen, Kündigungen oder Verwertungen ableiten.

### Mahn-/Statusphase – notwendige Implementierungspräzisierung

Der Vertrag ist nur vollständig umgesetzt, wenn **Zahlungsversuche und Mahnstatus voneinander getrennt ausführbar** sind. Aktuell führt `processOutstandingCosts()` nach seinen Retries bereits Reminder/Formal-Mahnung aus; `processTaxPayment()` tut dasselbe für SimTAX. Werden diese Funktionen nur in der bisherigen Reihenfolge aufgerufen, liegen Mahnstatus-Ereignisse vor der späteren SimTAX-Zahlung und damit vor dem im Vertrag versprochenen letzten Statusschritt. A02/A01 müssen daher die Phase-8-Orchestrierung oder die Funktionen so aufteilen, dass alle fälligen Zahlungen zuerst verarbeitet werden und anschließend alle Mahn-/Statusupdates nur für noch offene Posten erfolgen.

### Regressionen vor A03-Abschlussreview

1. **Same-day ordering:** Kundenzahlung mit/ohne Disposchuld sowie gleichzeitig fällige Maschine, Immobilie, Anlagenrate, mehrere Spieler-sortierte Lieferantenposten und SimTAX. Event-/Cash-Reihenfolge muss exakt Vertrag abbilden.
2. **Knappe Liquidität:** Eingang wird zunächst teilweise zur Dispotilgung verwendet; feste Raten werden nach Rangfolge voll bezahlt, spätere Positionen bleiben bei Fehlbetrag unverändert offen. Kein Teilbetrag, negatives Cash oder automatischer Dispo.
3. **D-0125-Grenze:** manueller Draw für explizit unterstützte eigene Rechnung weiterhin exakt und manuell; dieselbe Option erscheint/wirkt nicht automatisch für Anlagen-/Immobilienraten.
4. **Rate retry:** Fehlgeschlagene Raten bleiben kreditartspezifisch; wöchentlicher Versuch am wirksamen Arbeitstag; Maschinenverwertung nur gemäß D-0042/43, keine erfundenen Folgen für Immobilie/Ausstattung.
5. **Reminder-Reihenfolge:** Rechnung/SimTAX, die am selben Tag erfolgreich bezahlt wird, wird vor Statuspflege geschlossen und erhält keinen Reminder/Mahnung; unbezahlte Rechnungen bleiben offen und werden entsprechend bestehender Fristen fortgeschrieben.
6. **Datum/Periode/Einmaligkeit:** Wochenendverschiebung, Monatswechsel und identisches Ereignisdatum bestimmen Periode; je Rate/Zahlungsereignis maximal eine Buchung pro Verarbeitungstag; Monatsabschluss-Reconciliation bleibt 0,00 €.
7. **Netto-/SimTAX-Rechnung:** bestehende Auftragseingabe bleibt Netto-Szenariopreis, eine einzelne Gesamtposition wird einmal auf 19 % SimTAX berechnet (kaufmännisch Cent), Brutto ist Zahlbetrag; Rundungsgrenzwerte und getrennte UI-Labels sichern, keine Legacy-Werte still neu interpretieren.

### Ergebnis

**Fachlich bestätigt, vorbehaltlich der beschriebenen Statusphasen-Trennung und Regressionen.** A02 kann die Event-/Simulationsintegration umsetzen; A03 sollte danach die Cash-, Darlehenssaldo-, OP-, Zins-/Steuer- und Monatsabgleichswirkung unabhängig reviewen. Vor Codeänderung waren keine weitere Nutzerfrage und keine zusätzliche Produktentscheidung erforderlich. Keine neuen Tests in diesem Reviewauftrag ausgeführt.
