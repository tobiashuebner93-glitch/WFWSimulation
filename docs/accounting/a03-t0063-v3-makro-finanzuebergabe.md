# A03 – T-0063 V3-Makro-Finanzübergabe

**Status:** A03-Finanzschnittstellenentwurf an A01; A02-Ereignisvertrag und A09-Review offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 und SLG-002.5
**Ticket:** T-0063
**Profilbezug:** V3-Makromodell; keine rückwirkende Änderung bestehender V1-/V2-Verträge oder gespeicherter Startprofile
**Entscheidungsbezug:** D-0100–D-0102 und D-0163; D-0163 erweitert den inflationsorientierten MRO-Zukunftspfad auf V3 ohne automatische Änderung bestehender Kreditverträge.
**Preflight:** AGENTS.md, Agentenstruktur und Rechtekarte, MG-002-Ziele, aktive T-0063/T-0067-Kriterien, Collaboration State, CP-0275 (ENTWURF) und CP-0279 (ENTWURF), D-0100–D-0102, D-0120, D-0127/D-0129, D-0159/D-0160, D-0163, A08-T-0063-Quellenbericht, A02-T-0063-Simulationsvertrag, geltende A03-Finanzspezifikation, A03-T-0063-Übergabe und A03-T-0067-Kostenvertrag sowie Git-Status/Änderungen geprüft.
**Git-Basis:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; Arbeitsbaum enthielt vor dieser Arbeit bereits Änderungen mehrerer Agenten und T-0067-Notiz. Diese bleiben erhalten.

## 1. Auftrag und Fachgrenze

A08 liefert die Quellen-/Indexgrundlage. A02 besitzt den Makro-, Ereignis-, Perioden- und Simulationszustand. A03 ordnet monetäre Wirkungen ausschließlich nach bestehenden oder gesondert bestätigten Finanz-/Vertragsregeln zu. Diese Übergabe ist ein fachlicher Schnittstellenvorschlag, keine Implementierungs-, Architektur-, Schema-, Steuer- oder Kreditfreigabe.

Kernregel: **Eine Makrozahl ist für sich weder Vertrag noch finanzieller Geschäftsvorfall.** Preisindex, Inflationsrate, Wechselkursreferenz, Nachfrageindikator, Lohn-/Arbeitsmarktindex, Politikereignis und EZB-Satz dürfen als Beobachtung, Lerninhalt oder Prognose gezeigt werden. Ohne tatsächlich wirksames, autorisiertes Vertrags-/Leistungs-/Zahlungsereignis entstehen daraus keine Aufwendungen, Erlöse, Forderungen, Verbindlichkeiten, Bestände, Zinsen oder Cashbewegungen.

## 2. Finanzielle Zustandsklassen

Jede an die Finanzsicht übergebene Größe ist klar einer Sicht zugeordnet; diese Sichten dürfen nicht addiert oder als austauschbar behandelt werden.

| Sicht | Beispiel | Finanzwirkung |
|---|---|---|
| Makro-Beobachtung | VPI-ähnlicher Index, Inflation, FX-Referenz, Politikindikator, EZB-Satz | Informations-/Berichtswert; keine Buchung und kein Cash |
| Prognose/Kalkulationsannahme | erwarteter Material-, Lohn-, Energie- oder Zinswert für ein künftiges Angebot | nur Plan-/Sensitivitätswert; keine Ist-Kosten oder Vertragsänderung |
| Vertragswert | angenommener Kundenpreis, akzeptierter Lieferantenpreis, vereinbarter Lohn oder Kreditkondition | gilt im Umfang und ab dem Wirksamkeitszeitpunkt dieses Vertrags; externe Indizes ändern ihn nicht automatisch |
| Ist-Finanzereignis | Leistung/Verbrauch, abrechenbare Leistung, Rechnung, Zahlung oder ausdrücklich vereinbarter Vertrags-Reset | wird ausschließlich gemäß dem bereits geltenden A02/A03-Ereignis- und Finanzvertrag ausgewertet bzw. gebucht |

Quellwert und synthetischer Modellwert müssen unterscheidbar bleiben. Ein Szenario darf eine Korrelation oder Übertragung als Annahme darstellen, aber sie nicht als amtlich beobachtete Kausalwirkung ausgeben.

## 3. Verbraucherpreis- und Unternehmensinputkostenindex

A08 definiert für den didaktischen Verbraucherpreisindex einen Festgewichtsindex mit Basis 100 und stellt Monats-/Jahresinflation als Veränderungsrate zwischen Indexperioden dar. A02 verantwortet Wahl von Variante, Warenkorb, Quelle, Gewichtsversion, Periode, fehlender Historie und Indexrundung. A03 übernimmt die von A02 gelieferten Periodenwerte; A03 setzt keine Gewichte oder Verbraucherpreise fest.

Der Verbraucherpreisindex ist **kein** Unternehmenspreisindex. Der von A08 getrennt vorgeschlagene Unternehmensinputkostenindex kann Material, Energie, Lohn und Transport abbilden. Er ist eine Plan-/Vergleichsgröße. Eine Indexbewegung allein:

- ändert nicht rückwirkend bestehende Angebote, angenommene Kundenpreise oder akzeptierte Lieferantenpreise;
- bewertet weder vorhandene Bestände noch unfakturierte Aufträge neu;
- ändert nicht automatisch Lohn, Maschinen-/Energiekostensatz, Materialkatalog, Verbindlichkeit, Forderung oder Cash;
- löst weder eine Steuer-, Abgaben-, Förderungs- noch Zuschussbuchung aus.

Ein künftiger Kalkulationswert darf sich ändern, wenn ein Spieler oder ein autorisierter A02-/Vertragsfluss die veränderte Annahme ausdrücklich übernimmt. Der geänderte Annahmewert ist Plan; die Ist-Kosten entstehen weiterhin erst aus dem einschlägigen Leistungs-/Verbrauchs-/Lieferantenereignis nach der geltenden Finanzspezifikation. Die Rechen- und Versionsanzeige soll Quelle, Bezugsperiode, Basis, Einheiten und Annahmestatus ausweisen. Genaues Snapshot-/Persistenzverhalten ist kein Schemaentscheid dieser Notiz.

## 4. Außenwirtschaft, Importpreise und Wechselkurs

EZB-Referenzkurse aus dem A08-Bericht sind Beobachtungswerte, nicht automatisch der Transaktionskurs einer Beschaffung. A02 muss Importexposition, betroffene Materialposition, wirksamen Tag und eventuelle Verzögerung als Simulationstatbestand liefern. A03 ordnet eine finanzielle Wirkung erst zu, wenn ein bestehender oder neuer Lieferantenvertrag einen konkreten Betrag/eine konkrete Preisbasis bestimmt.

- Vor Angebotsannahme kann eine FX-/Importkostenannahme als Sensitivität in der Plan-Kalkulation erscheinen.
- Ein angenommener Auftrag oder akzeptierter Einkaufspreis wird nicht allein aufgrund eines späteren Referenzkurs- oder Inputkostenindex-Wechsels geändert.
- Eine spätere Preisänderung ist nur bei einem ausdrücklich unterstützten, dokumentierten Vertrags-/Preisänderungsereignis wirksam; dieses Ticket erfindet weder eine Preisanpassungsklausel noch Fremdwährungsbuchführung.
- Kosten, Bestand, offene Posten und Zahlungsmittel folgen den bereits bestehenden Einkaufs-, Verbrauchs-, Rechnungs- und Zahlungsregeln. Kein Indexereignis darf diese Beträge parallel direkt mutieren.

Für einen Szenariotest müssen daher zwei Pfade getrennt sein: (a) nur FX-/Indexbeobachtung → unveränderte Finanzsalden; (b) ausdrücklich geänderter Folgepreis/Vertrag → neue Plan-/oder Ist-Wirkung nach dem vereinbarten Einkaufs-/Verbrauchsereignis. Das ist eine Testabgrenzung, keine Festlegung einer konkreten Lieferantenklausel.

## 5. EZB, Finanzierung und Zinsverträge

Ein EZB-Beschluss ist externer Makroinput; die dokumentierte Transmission hat variable Verzögerungen und wirkt nicht zwingend proportional auf einen einzelnen Firmenzins. Der neue/aktualisierte EZB-Satz darf deshalb nicht als automatischer Reset aller Darlehen oder des Dispos implementiert werden.

Finanzielle Regeln:

1. **Fest vereinbarte Zinsen/Raten:** bleiben für die vereinbarte Laufzeit und Rate unverändert, auch wenn der Makro-Zins wechselt. Keine rückwirkende Neuberechnung, Zinsnachforderung oder Tilgungsänderung aus einem EZB-Ereignis.
2. **Variabel verzinste/neu verhandelte Finanzierung:** eine Wirkung ist erst zulässig, wenn ein konkreter Vertrag die Referenz, Marge, Reset-Termine, Wirksamkeit, Periode und Rundungs-/Belastungsregel festlegt und A02 ein dazu passendes Finanzereignis liefert. Ohne solche Vertragsdaten bleibt der Effekt im Zins-/Finanzierungsbericht Planinformation.
3. **Neukredit:** Der Makroindikator kann im Entscheidungskontext erscheinen; konkrete Bankkonditionen, Kreditwürdigkeits-, Limit-, Auszahlungs- oder Tilgungsregeln werden nicht hier festgelegt.
4. **Versionsschutz und D-0163:** D-0160 beschreibt nur die ausdrücklich begrenzte V2-Szenariokonvention. D-0163 erweitert D-0102 auf den V3-Zukunftspfad: Wenn für den betreffenden Zeitraum keine realen EZB-Daten verfügbar sind, kann der inflationsorientierte simulierte MRO-Pfad als V3-Szenarioregel verwendet werden. A02/A08 legen Modellformel, Verzögerung und Unsicherheitsparameter transparent als Modellannahmen fest. MRO-/Inflationswerte bleiben Makroinformation bzw. Szenariowerte. Sie setzen weder bestehende Kreditkonditionen zurück noch erzeugen sie selbst Zinsaufwand, Verbindlichkeit, Zahlung oder Cashwirkung. Eine finanzielle Wirkung setzt einen separat vereinbarten variablen oder neu verhandelten Vertrag mit passenden Vertragsbedingungen und ein autorisiertes Finanzereignis voraus. Bestehende V1-/V2-Verträge und gespeicherte Profile bleiben unverändert.

Nur Zins, der nach einem gültigen Finanzierungsvertrag und der dafür geltenden Abgrenzungs-/Zahlungsregel anfällt, kann Aufwand/Verbindlichkeit und später Zahlung beeinflussen. Ein ECB-/MRO-Indexwert selbst ist weder Zinsaufwand noch Zahlung. Die konkrete Periodenabgrenzung bleibt der jeweils geltenden Kredit-/Monatsabschlussregel vorbehalten; T-0063 ändert D-0127/D-0129 nicht.

## 6. Politik-, Arbeitsmarkt- und Lohnkanäle

Die acht A08-Kategorien sind zunächst externe Maßnahmen-/Indikator- oder Szenariodaten. A02 verantwortet, ob und wie daraus Nachfrage, Auftragswahrscheinlichkeit, Kapazität, Skillangebot, Produktivität oder physischer Ressourcenverbrauch folgt. Daraus entsteht nicht automatisch ein Finanzbuchungssatz.

- **Finanzpolitik:** keine Steuer, Abgabe, Förderung, Subvention oder Erstattung ohne gesondert belegte und autorisierte Rechts-/Vertrags-/Zahlungsregel. Staatlicher Nachfrageimpuls wird nicht als Unternehmensumsatz gebucht; Umsatz folgt dem existierenden Kunden-/Leistungs-/Rechnungsereignis.
- **Tarif-/Arbeitsmarktpolitik:** Lohnindex, Arbeitslosen-/Vakanzquote, Qualifizierungs- oder Vermittlungsszenario ändern nicht automatisch individuelle Löhne, Arbeitsstunden, Sozialkosten oder Personalbestand. Erst eine konkrete wirksame Beschäftigungs-/Vergütungsänderung oder ein bestätigtes Personalevent kann Kosten verändern.
- **Wachstums-/Angebotspolitik:** Produktivitäts-/Kapazitätsindikator kann A02-Planwerte oder verfügbare Kapazität berühren; daraus folgt kein automatisch erfasster Erlös, Abschreibungsbetrag, Investitionsaufwand oder Produktivitätsgewinn.
- **Umweltpolitik:** keine CO₂-Abgabe, Energiebeihilfe, Investitionsförderung oder Pflichtausgabe wird ohne konkrete Quelle, Anwendbarkeit und freigegebenes Finanzereignis ergänzt. Eine physische Energie-/Materialänderung wird erst entsprechend einem beschlossenen Betriebs-/Beschaffungssatz als Kosten wirksam.
- **Nachfrageorientierte Maßnahmen:** verändern bei bestätigtem A02-Modell gegebenenfalls Nachfrageindikatoren/Anfragen; weder Anfrage noch Zuschlagschance ist Erlös/Forderung/Cash.

## 7. Perioden- und Finanzübergabe an A02

A02 bleibt verantwortlich für Simulationszeit, Ereignisphase, Reihenfolge und wirksames Datum. A03 braucht für jede Makro-/Finanzkopplung mindestens folgende **fachliche Schnittstelleninformationen**; dies ist eine logische Übergabe, keine physische Schemafestlegung:

- eindeutige Ereignis-/Referenz-ID und Szenario/Seed;
- Variablenname, Einheit, Ausgangs-/Folgewert oder Indexwert, Quelle bzw. „synthetische Annahme“;
- Beobachtungsperiode und Beobachtungsdatum, getrennt vom Wirkungs-/Wirksamkeitsdatum;
- gegebenenfalls Verzögerung/Lag und betroffene Entität (Material, Lohn-/Kreditvertrag, Marktsegment);
- Kennzeichnung „Information“, „Prognoseannahme“ oder „Vertrags-/Finanzereignis“;
- bei Finanzereignis: bestehende Vertragsreferenz und bestätigter Reset-/Preisänderungsgrund.

A03 liefert zurück, ob sich ein autoritatives Finanzobjekt tatsächlich ändert, in welcher bestehenden Ergebnis-/Kosten-/Cash-Sicht es erscheint und ob eine Buchung überhaupt zulässig ist. Es gibt keine Buchung, solange nur die ersten zwei Klassen (Beobachtung/Prognose) übergeben werden.

Makro-Updateperioden, Monats-/Quartalsgrenzen, wirksame Tage und Monatsbericht-Snapshot muss A02 im gemeinsamen Modellvertrag festlegen. A03 übernimmt dieselbe Periode in die Finanzsicht, ohne eine zusätzliche Periodik einzuführen. Eine verspätete Veröffentlichung ist nicht rückwirkend ein Finanzereignis. Ist-/Planvergleich muss dieselbe Periode, Einheiten und Versionsbasis nennen.

## 8. Ergebnis-, Cash- und Ledgerabgleich

Für den T-0063-A03-Abgleich gelten die bereits bestehenden A03-Grundsätze der [Finanzspezifikation](maschinenbau-mvp-finanzspezifikation.md) und der [T-0067-Kalkulations-/BAB-Übergabe](a03-t0067-v3-kalkulations-bab-vertrag.md):

- **Ergebnis:** nur reale abrechenbare Leistung und zugeordnete Kosten gemäß geltendem Ereignisvertrag; Makro-/Indexmeldung allein kein Ertrag/Aufwand.
- **Cash:** nur tatsächliche Zahlung; Index-, Markt-, Anfrage- und EZB-Meldung keine Einzahlung/Auszahlung. Forderungen/Verbindlichkeiten bleiben von Cash getrennt.
- **Ledger:** keine direkte A02-Mutation von Finanzsaldo. Nur autorisierte Ereignisse mit eindeutiger Referenz dürfen über A03s bestehende Finanzlogik Finanzzustand ändern.
- **Reconciliation:** jeder neu modellierte Vertragseffekt muss genau einmal im bestehenden Ereignisfluss landen, mit Ergebnis-/Cash-/Postenwirkung passend zur bestehenden Regel; reine Informationen haben genau null Finanzsaldoänderung. Ein Makroeintrag darf nicht gleichzeitig direkt den Inputkostensatz mutieren und dann dieselbe Änderung erneut als Einkaufskosten buchen.
- **Szenario-Reporting:** Makroindikatoren und Finanzkennzahlen können im gleichen Monatsbericht erscheinen, aber mit getrennten Labels, Perioden und Datenherkunft. CPI, Inputkostenindex, vertraglicher Preis, tatsächliche Kosten, Rechnung und Zahlung sind separate Größen.

## 9. T-0063 Finanztestmatrix

Diese Fälle prüfen Grenzen, keine numerischen Koeffizienten oder Marktparameter:

| Kontrollfall | Erwartete Finanzfolge |
|---|---|
| VPI/Inflation ändert sich, kein Preis-/Lohn-/Kreditvertrag ändert sich | Makrobericht aktualisiert; Bilanz-/Ledger-/Cash-Salden und bestehende Verträge bleiben identisch. |
| Inputkostenindex ändert sich, keine konkrete Bestellung/Leistung/Preisvereinbarung | nur Index/Planannahme ändert sich; keine Ist-Kosten, Lagerneubewertung oder Zahlung. |
| FX-Referenzkurs ändert sich nach angenommenem Kunden- oder Lieferantenvertrag | Vertragspreis bleibt gleich; kein FX-Gewinn/-Verlust, keine Nachbelastung ohne freigegebene Vertragsregel. |
| Neue Beschaffungsquote wird nach Indexwechsel mit ausdrücklich neuem Preis bestätigt | nur der neue Preis gilt für den zugeordneten neuen Vertrag; spätere Kosten-/Cashfolge erfolgt nach bestehendem Einkaufs-, Rechnungs- und Zahlungsereignis; der alte Vertrag bleibt unberührt. |
| EZB-/MRO-Wert ändert sich bei Festzinsvertrag | Zins, Rate, Restschuld und Zahlungstermine des Festvertrags bleiben exakt unverändert. |
| Inflationsorientierter V3-MRO-Szenariowert ändert sich mangels realer EZB-Daten; kein separater Vertragsreset | Makro-/Zinsinformation aktualisierbar; bestehende Kreditkonditionen, Zinsaufwand, Verbindlichkeit und Cash bleiben unverändert. |
| EZB-/MRO-Wert bei variabel verzinstem Vertrag ohne Resetdaten | Anzeige/Prognose aktualisierbar; kein Reset, keine Zinsbuchung, kein Cash. Fehler-/Offenhinweis statt stiller Annahme. |
| Vertrag enthält separat genehmigten Reset und A02 sendet gültiges Resetereignis | nur vertraglich betroffene Kondition wird ab wirksamem Datum nach dieser Vertragsregel neu berechnet; Test muss V2-/Legacy-Objekte unverändert nachweisen. |
| Tarif-/Arbeitsmarktindikator oder Politikereignis wechselt ohne konkrete Personal-/Vergütungsänderung | bestehende Lohnkosten/-verbindlichkeiten und Zahlungen bleiben unverändert. |
| Staatsnachfrage-/Marktindex erzeugt zusätzliche Anfrage | noch keine Umsatzerfassung; erst Zuschlag, Lieferung/abrechenbare Leistung, Rechnung/Zahlung nach je geltendem Vertrag. |
| Dasselbe Finanzereignis wird doppelt zugestellt | Idempotenz nach bestehender Event-ID-Regel; keine doppelte Kosten-, Zins-, Erlös- oder Cashwirkung. Falls eine solche Regel für den neuen Ereignistyp fehlt, A02/A03 müssen sie vor Implementierung definieren. |

## 10. Noch offene Schnittstellen (D-0163-Punkt abgeschlossen)

1. **Kreditvertragsuniversum:** A02/A01 geben an, welche V3-Neu-/Variabelverträge existieren und ob deren Terms vollständige Resetdaten besitzen. Ohne diese Vertragsbedingungen bleibt eine MRO-Wirkung auf Zinsen rein indikativ.
2. **Vertragliche Beschaffungspreise und FX:** A02/A01 bestimmen, welche Produkte/Lieferanten eine FX-/Preisbindung tatsächlich haben und wann eine neue Quote wirksam wird. A03 schlägt keine automatische Bestellpreisänderung vor.
3. **Politik-zu-Unternehmen-Finanzfolge:** Eventuelle Lohn-, Energie-, Abgaben-, Förder- oder Subventionswirkungen benötigen pro Ereignis einen belegten und freigegebenen Vertrags-/Finanzfluss. Keine globale Kategorieautomatik festgelegt.
4. **Perioden-/Snapshot-Interface:** A02 muss Beobachtungsperiode, Wirksamkeitsdatum, Update-Verzögerung, Monatsabschluss-/Berichtszeitpunkt und Event-Idempotenz für die Modellverträge liefern; A03 verifiziert Finanzzuordnung dagegen.
5. **Rundung:** Für Indexwerte folgt A03 der von A02 festzulegenden Präzisions-/Anzeigeform. Für bestehende Rechnungs-/Zahlungs-/Zinsverträge gelten jeweils deren bereits bestätigte Regeln. Dieses Dokument ergänzt keine Rundungsregel.

## 11. Folgeauftrag

A01 soll nach Abgleich mit dem A02-Makro-/Ereignisvertrag einen gemeinsamen A02/A03-Finanzereignisvertrag zu T-0063 beauftragen. Dieser soll pro Kanal (Inputkosten/FX, EZB/Kredite, Tarif-/Personal, Nachfrage/Politik) Ereignis-ID, Beobachtungs- und Wirksamkeitsdatum, Periode, betroffene Vertragsklasse, Plan-/Ist-Sicht, Ergebnis-/Cash-/Ledgerauswirkung und unveränderte Altverträge festhalten. Anschließend A09 mit Tests aus Abschnitt 9 und Quellenherkunft beauftragen. T-0063 bleibt IN_PROGRESS, bis A02/A03-Modellierung und A09-Fachreview abgeschlossen sind.

## 12. Nachweise

- **Ausführung:** Preflight durchgeführt und bestehende A03-Finanzübergabe gemäß D-0163 aktualisiert.
- **A03-Fachreview:** Selbstreview durchgeführt; D-0163-Scope umgesetzt, ohne Makrokausalitäts-, Steuer-, Buchungs-, Preis- oder Kreditregel neu festzusetzen.
- **A02-Fachreview:** nicht ausgeführt.
- **Unabhängige QA/A09:** nicht ausgeführt.
- **Code-/Automatisierungstests:** nicht ausgeführt; reine Dokumentationsänderung.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** vollständiger Preflight-Status/Diff vor Änderung geprüft; zielbezogener Status-/Whitespace-Check nach Änderung durchgeführt. Änderungen anderer Agenten bleiben erhalten.
- **Commit/Push:** nicht ausgeführt.
