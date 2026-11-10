# A02-Integrationsvertrag – V3-Makro, Markt und Produkt

**Status:** A02-Fachentwurf für getrennte A01-/Fachreviews; keine Implementierungs- oder Freigabeerklärung  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0066  
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals/V3-Zielkarte, aktive T-0063–T-0069, Collaboration State, CP-0279, Decision Log D-0159–D-0164 und relevante ältere D-0100–D-0102, D-0120, D-0129, D-0159, D-0160, D-0162, D-0163, A02/A03/A08-Verträge und vollständiger Gitstatus/Diff geprüft.  
**Vorgänger:** CP-0279 (ENTWURF); V2 bleibt unverändert.

## 1. Zweck, Status und Zuständigkeiten

Dieses Dokument verbindet die drei A02-Fachentwürfe zu einem überprüfbaren Simulationspaket. Es legt logische Abläufe und Testverträge fest, genehmigt aber weder Implementierung, Datenmodell, Architektur noch Buchungsregeln. Wo ein Wert nicht durch Nutzerentscheidung oder Quelle belegt ist, steht er als Szenarioannahme mit Kalibrierungsstatus.

| Zuständigkeit | Übergabe / Grenze |
|---|---|
| A08 | Quellen, Veröffentlichungs-/Beobachtungsdatum, Revisionen und belegte Wirkungsrichtungen; keine Spielkausalität oder Nutzerentscheidung |
| A02 | Makro-/Markt-/Produktzustände, Datum, Reihenfolge, Ressourcenprüfung und reproduzierbare Szenarien |
| A03 | Kosten-/Finanzwerte und Buchungsautorität. V3-Kalkulation exakt nach D-0162 und dem A03-Vertrag; keine Makrobuchung |
| A04 | Nur bei späterem gesondertem Auftrag: Anforderungen an Persistenz/Schema; dieser Vertrag erteilt keine Freigabe |
| A05 | Darstellung und Aktionen gegen die unten benannten Zustände; keine eigenen Fachregeln |
| A06 | Lernbezug an Zustände/Kennzahlen; Übung allein mutiert keinen Unternehmenszustand |
| A09 | unabhängige Tests, Reconciliation und Reproduzierbarkeit nach Fachintegration |
| A01 | Cross-Agent-Aufträge, Entscheidungsvorlagen und Freigabegates |

## 2. Gemeinsame Zustands- und Übergabedaten

Die Feldnamen sind logische Vertragsbegriffe, keine Schemaanforderung. Der kleinste replayfähige Laufkontext enthält:

`runId`, `scenarioId`, `seed`, `modelVersion`, `profileVersion`, `calendarVersion`, `sourceSnapshotId`, `parameterSetId`, `currentDate` und `macroPeriod`.

Jede Simulationseingabe trägt `sourceType` (beobachtet, abgeleitet, synthetisch oder kalibrierbare Hypothese), Quelle/Annahme, Einheit, beobachtete Periode, Veröffentlichungsdatum, Wirksamkeitsdatum und Versionskennung. Fehlende Beobachtungsperioden bleiben fehlend; sie werden nicht mit einem erfundenen historischen Wert aufgefüllt.

| Übergabe | Erzeugt durch → genutzt durch | Mindestinhalt / erlaubte Zustandswirkung |
|---|---|---|
| Makro-Snapshot | T-0063/A02 → T-0065, T-0066, A05, A06 | Monat, vierphasiger Zustand samt Übergangsgrund, VPI-gewichtet aufgebauter SPI/Inflation falls verfügbar, COICOP-Basketversion und Gewichts-/Komponentenquellenversion, Außenwirtschafts-/Politik-/EZB-Indikatoren, Exposition sowie Quelle oder Szenariostatus. Nur Indikator-/Planwirkung. |
| Marktanfrage | T-0065/A02 → A05, A06 | stabile `inquiryId`, Eingangs-/Ablaufdatum, Größenklasse, Anforderungen, Segment, Gültigkeitsstatus und Seed-Herkunft. Noch kein Auftrag, Umsatz oder Zahlung. |
| Angebot | T-0065/A02 + T-0067/A03 → A05, A06, A09 | `offerId`, Anfragebezug, Nettoplanpreis `R`, angenommene Kostentreiber, D-0162-DB-/BAB-Ergebnis, Angebotszeit und Snapshotreferenz. Konkurrenz-Einzelgebote bleiben verborgen. |
| Zuschlagsentscheidung | T-0065/A02 → Auftragstätigkeit/A03 | `decisionId`, Angebot, Entscheidungsdatum und Ergebnis. Erst bei Annahme entsteht ein Auftragszustand; tatsächliche Finanzereignisse folgen den getrennten A02/A03-Verträgen. |
| Produkt-/Arbeitszustand | T-0066/A02 → A05, A06, A09 und T-0067/A03 | stabile Produkt-/Los-/Arbeitsschrittbezüge, Voraussetzungen, Skills, Material, Zeit, Kapazität, Kalkulationsinput, Plan/Ist-Markierung und Blockgrund. Kein Verkauf oder Ledgerposten aus bloßem Planen. |
| Finanzrückgabe | A03 → T-0065/T-0066/A05 | validierte Kalkulationssicht nach D-0162 sowie gesondert autorisierte Ist-/Cash-/OP-Wirkung. A02 zeigt Status/Verweis, mutiert keine Salden. |

## 3. Versionen, Perioden und wirksame Zeit

- Makroperioden und Makro-Snapshots sind **Kalendermonate**. Die beobachtete, veröffentlichte und wirksame Zeitreihe bleibt getrennt; ein später veröffentlichter Wert wird nicht in vergangene operative Vorgänge zurückgeschrieben.
- Operative Angebots-, Kosten- und Ergebniskennzahlen werden nach D-0162 Kalendermonaten zugeordnet. Jahreswerte sind Summe/Abschluss der zwölf Monate. Cash und offene Posten werden zusätzlich zum Stichtag gezeigt. Diese Aggregation ändert die separaten Makroperioden nicht.
- Markt- und Produktvorgänge tragen konkrete Simulationstage. Der Marktbericht ist monatlich; sein Berichtsfenster und leere/kleine Stichproben werden als Marktberichtparameter ausgewiesen. Sie verändern nicht die durch D-0162 festgelegte Kennzahlenperiode.
- EZB-Beobachtungsdaten werden nur verwendet, wenn sie für den Zeitraum real verfügbar und belegt sind. Fehlt die reale Reihe, gilt in V3 gemäß D-0102/D-0163 ein inflationsorientierter synthetischer MRO-Zukunftspfad mit `Inflation_y/y` aus dem Spielpreisindex als Modellinput. Das ist keine nationale Beobachtung und keine Inflationserwartungsreihe. Überführungsformel, Lag, Unsicherheitsband und Grenzen bleiben versionierte, noch zu kalibrierende Szenarioparameter. Kein erfundener historischer MRO-Wert; kein automatischer Reset eines bestehenden Kredits; V1/V2 und D-0160 bleiben unangetastet.
- Jeder abgeleitete oder synthetische Unternehmensimpuls nennt Zielgröße, Exposition, Richtung, Lag und Gegeneffekt. Erst ein gesondert autorisiertes Ereignis darf operative Verträge oder A03-Finanzzustände berühren.

## 4. Deterministischer Ereignislauf (A02-Vorschlag)

Die Reihenfolge ist ein reproduzierbarer V3-Modellvorschlag für Tests und Integration, keine Änderung des V2-Tagesablaufs. Am Periodenwechsel werden in dieser Reihenfolge verarbeitet:

1. Quellen- und Szenarioeingaben mit `effectiveFrom` in den Gültigkeitsbereich übernehmen; unverfügbare Quelle als fehlend markieren.
2. Bereits fällige, verzögerte Makrobeiträge anwenden; pro Zielindikator Beiträge getrennt protokollieren. Ohne bestätigte Aggregationsformel keine Zusammenfassung mehrerer Beiträge.
3. Monatsindikatoren und Phasenkandidat aus derselben versionierten Eingabemenge ableiten; Hysterese/Persistenzparameter anwenden und Übergangsgrund protokollieren.
4. Den neuen Makro-Snapshot veröffentlichen, bevor Marktchancen für diese Makroperiode erzeugt werden.
5. Am jeweiligen Simulationstag zuerst bereits fällige Angebotsentscheidungen auswerten, danach Tagesanfragen aus der festen Seedfolge erzeugen. Für den Gleichstand von Kundenentscheidung und Ablaufdatum gilt die **A01-koordinierte V3-Interpretation (keine Nutzerentscheidung)**: Eine am Ablaufdatum terminierte Entscheidung wird in der Entscheidungsphase verarbeitet; bleibt das Angebot danach offen, läuft es am Ende dieses Tages ab. Das Ereignislog hält beide Prüfungen, ihre Phase und den genau einen Endzustand fest.
6. Spieleraktionen werden mit aktuellem Snapshot und dem zum Zeitpunkt gültigen Kalkulationsstand angenommen. Eine eingereichte Kalkulation friert den Preis-/Kosten-/BAB-Snapshot gemäß D-0162 ein; ein offener Entwurf darf neu kalkuliert werden.
7. Produktarbeitsgänge werden nur freigegeben, wenn Vorgänger, Skill, Material, Maschinen-/Personalkapazität und Lagerraum zum jeweiligen Zeitpunkt verfügbar sind. Der stabile Schrittbezug bestimmt Reihenfolge; parallel geplante Schritte teilen keine knappe Ressource doppelt.
8. Finanz- und Buchungswirkung wird ausschließlich durch den freigegebenen A02/A03-Vertrag ausgelöst und von A03 bestätigt. Tages-/Monatsabschluss liest Ergebnisse, erzeugt sie aber nicht erneut.

Innerhalb einer Phase werden Ereignisse nach `effectiveDate`, festgelegter fachlicher Phase und stabilem logischem Schlüssel sortiert. Synthetische Ziehungen werden reproduzierbar aus `runId`, `scenarioId`, `modelVersion`, `seed`, Ziehungsdomäne und stabilem Ziehungsindex abgeleitet; ein zusätzlich erzeugter Anfrage- oder Produkt-Event darf keine schon bestehende Ziehungsfolge verschieben. Die konkrete PRNG-Implementierung ist nicht durch dieses Dokument freigegeben. Ein erneuter Lauf mit gleichen Profil-, Quellen-, Modell-, Parameter- und Seedversionen erzeugt gleiche Ereignisse und Reihenfolge.

### Ereignisidentität und Duplikatschutz

- Makro-Simulationswirkung: `macroEventId` kennzeichnet nur Herkunft/Replays und die einmalige Aktivierung des Makrobeitrags.
- Markt: Anfrage, eingereichtes Angebot und Angebotsentscheidung haben eigene logische IDs und höchstens einen Zustandsübergang je ID/Version.
- Produkt: Produktlos und Arbeitsschrittabschluss werden separat identifiziert; ein wiederholtes Tages-Replay darf Verbrauch, Zeit oder Abschluss nicht verdoppeln.
- Finanz: ein Makroereignis bucht nie direkt. Eine freigegebene Beschaffungs-, Lohn- oder Kreditänderung benötigt eigenes `financialEventId`, bestehende A03-Vertragsreferenz und autorisierten Buchungs-/Änderungsgrund. `causedByMacroEventId` ist nur Provenienz; A03s Buchungs-Duplikatregel bleibt maßgeblich.

## 5. D-0162-Kalkulationsvertrag als gemeinsame Grenze

T-0065-Angebote und T-0066-Produktkalkulationen übergeben A03 ausschließlich die vereinbarte V3-Sicht:

1. `R` ist der Nettoplanpreis ohne SimTAX. Das erweitert V1/V2 nicht.
2. DB I zieht nur ausdrücklich als variabel klassifizierte Einzelkosten ab. Direkte Arbeit und Maschine werden getrennt ausgewiesen; zusätzlich ist Ergebnis nach direkten Einzelkosten zu zeigen.
3. BAB-Restcent werden nach der größten ungerundeten Restfraktion verteilt; Gleichstand entscheidet die stabile Kostenstellen-ID aufsteigend. Rundung muss auf Ausgangskosten abstimmen.
4. Preis-, Kosten- und BAB-Snapshot entstehen bei Angebotsabgabe. Ein Entwurf kann neu kalkuliert werden; nach Annahme sind Preis und Snapshot fix. Ist-Abweichungen stehen separat.
5. DB I von −0,01 € bis einschließlich +0,01 € heißt „centnah“; Betrag und Vorzeichen bleiben sichtbar, keine zusätzliche prozentuale Schwelle.
6. Operative Kennzahlen: Kalendermonat; Jahreswerte: Summe/Abschluss der zwölf Monate; Cash/OP zusätzlich Stichtag. Makroperioden bleiben getrennt.

A02 übergibt Mengen, Zeit-/Kapazitätsbedarf, Materialbedarf, Preisvorschlag, Ereignisdatum und Produkt-/Auftragsreferenz. A03 entscheidet Klassifikation/Kostenbasis und jede Ledger-/Cashfolge. Kein Markt-, Makro- oder Produktzustand ersetzt eine Rechnung oder Zahlung.

## 6. Schnittstellen für Oberfläche und Lernen

### A05 – UI-Zustände

- **Übersicht/Monatsbericht:** aktueller Makro-Snapshot, Quelle-vs.-Szenario-Badge, Phase und Übergangsgrund, Richtung/Lag/Unsicherheit, Monatskennzahlen und separate Cash-/OP-Stichtagswerte.
- **Anfragen/Angebote:** Status „neu/offen/eingereicht/angenommen/abgelehnt/abgelaufen/ungeklärt“, Frist und klare Aktion; nur eigene Angebotskalkulation, Konkurrenzmittelwerte nach Größenklasse, keine Einzelkonkurrenzpreise.
- **Produkte/Planung:** Idee bis Verkauf als Zustandsfolge, Soll-/Ist-Kosten und gebundene Zeit/Ressourcen; Blocker mit Ursache statt automatischer Überschreibung.
- **Kalkulation:** `R` netto, SimTAX nicht Teil von R, DB I, direkte Arbeit/Maschine und Ergebnis nach direkten Einzelkosten getrennt; Snapshotstatus beim Einreichen/Annehmen erkennbar.
- A05 erhält keinen Auftrag, fehlende Zustände selbst zu klassifizieren oder Markt-/Finanzformeln zu ergänzen.

### A06 – Lernkontext

Jeder sichtbare Zustand kann Kompetenzreferenzen für Konjunktur, Inflation/Index, Geld- und Wirtschaftspolitik, Marktsegment/Preisentscheidung, Deckungsbeitrag, Kapazität und Produktlebenszyklus tragen. Ein Lernobjekt verlinkt auf `scenarioId`, `eventId`/`inquiryId`/`offerId`/`productId` und Kompetenz-ID. Dieser Simulationsvertrag definiert selbst keine Lernantwort-Wirkung. Ein als neutraler Übungsmodus gekennzeichneter Lernzugriff darf den Spielzustand nicht ändern; bereits bestätigte V2-Lernwirkungen bleiben unberührt. Neue V3-Lernereignisse mit Wirkung benötigen die Zuordnung und Produktregeln aus T-0068, bevor sie Spielzustände mutieren.

### A03 – neue Finanzierungskondition (V3-15)

Damit V3-15 mehr als einen reinen MRO-Indikator zeigt, kann A02 bei einer ausdrücklichen neuen Kreditanfrage oder Neuverhandlung eine **unverbindliche synthetische Konditionsanzeige** ausgeben. Sie ist weder Bankzusage noch bestehender Kreditvertrag. Logische Handoff-Felder: `creditRequestId`, `financingQuoteId`, `referencePeriod`, `mroScenarioValuePctPA`, `mroDeltaPp`, `indicativeSpreadPp`, `indicativeRatePctPA`, `indicativeTermMonths`, `validFrom`, `validUntil`, `sourceType`, `scenarioId`, `parameterSetId`, `lagPeriods`, `uncertaintyBand`, `status` (`indicative`/`accepted`/`declined`/`expired`) und – erst nach ausdrücklichem Abschluss – `contractId`/`contractVersion`.

Der transparente Szenario-Rechenschritt lautet `indicativeRatePctPA = mroScenarioValuePctPA + indicativeSpreadPp`; MRO-Pfad, Spread, Laufzeit, Gültigkeitsfenster, Lag und Unsicherheitsband sind versionierte synthetische Inputs, keine Markt-/Bankdaten oder Produktdefaults. Eine indikative Quote oder ihr Ablauf erzeugt **keinen** Kredit, keine Verbindlichkeit, keinen Zinsaufwand und keinen Cashflow. Erst ausdrücklich angenommene/abgeschlossene Vertragskonditionen frieren eine neue Vertragsversion ein; Auszahlung, Zinsabgrenzung und Tilgung bleiben separate A03-Vertrags-/Finanzereignisse. Bestehende Verträge und V1/V2-Salden bleiben unverändert. A03 muss vor Implementierung Finanzereignisse und Reconciliation bestätigen.

## 7. Low/Base/High-Fixtures und reproduzierbare Testläufe

Die Fixtures sind künstliche Belastungsprofile, keine Marktprognose, empirische Verteilung oder bestätigte Produktkoeffizienten. `LOW`, `BASE`, `HIGH` bezeichnen explizit gespeicherte Eingabeprofile innerhalb jedes Szenarios. Numerische Werte unten sind ausschließlich reproduzierbare Testvektoren, keine produktiven Defaults.

| Fixturefamilie | Geänderte Eingaben bei sonst identischer Basis | Erwarteter Testbefund |
|---|---|---|
| `MRO-FUTURE-{LOW,BASE,HIGH}` | synthetische `Inflation_y/y` aus dem Spielpreisindex: 1,00/2,00/3,00 %; **nur in diesem Testfixture** wird `mroScenarioValuePctPA = Inflation_y/y` gesetzt; synthetische Testspread 2,00 Prozentpunkte; Laufzeit 36 Monate; Lag 1 Periode; Quote-Gültigkeit 30 Kalendertage. Alles sind Testannahmen, keine Markt-/Bankdaten oder Produktdefaults und bestätigen keine Produktformel. | Testformel `Quote = mroScenarioValuePctPA + Spread` ergibt indikative 3,00/4,00/5,00 % p.a.; gleiche Eingaben reproduzieren dieselbe Quote. Annahme friert nur einen neuen Vertrag ein; Quote erzeugt keine Buchung/Cashwirkung und Festzins-/Altvertrag, A03-Salden und V1/V2 bleiben identisch. |
| `CYCLE-{UPSWING,BOOM,DOWNTURN,LOW}` je `LOW/BASE/HIGH` | Rechenfixture: `trendIndex=100`; LOW `activity_(t−1)=99`, `activity_t=98`; BASE `99,5/100`; HIGH `101,5/103`. Daraus folgen Gap −2,00/0,00/+3,00 % und Momentum −1,01/+0,50/+1,48 %. Es sind Indikator-Testwerte, keine Phasenschwellen. | Gap- und Momentumformeln liefern die angegebenen Werte. Die vier Phasen bleiben eigene Pfadfixtures mit explizit protokollierter Schwellenversion; keine universellen Schwellen werden hier behauptet. Wirkung erst nach konfiguriertem Lag und nur bei passender Exposition. |
| `EXTERNAL-{FX,EXPORT,DELIVERY}-{LOW,BASE,HIGH}` | signierter Wechselkursimpuls, Exportnachfrageimpuls oder Lieferzeit-/Pünktlichkeitsstörung plus Expositionsgrad | isolierte Wirkung erreicht nur passend exponierte Plan-/Anfrage-/Liefergröße; nicht exponierter Kontrollbetrieb bleibt unverändert; kein Vertrag oder Ledger wird durch Indexänderung geändert. |
| `POLICY-{8-CATEGORIES}-{LOW,BASE,HIGH}` | Maßnahme, Zielindikator, Lag, Exposition und Gegeneffekt je Politikfeld | acht Kategorien getrennt erkennbar; Doppelzählung über Nachfrage-/Angebots-/Wachstumstags verhindert; keine automatische Steuer-, Lohn-, Förder- oder Finanzbuchung. |
| `MARKET-{LOW,BASE,HIGH}` | Gleiches Segment und gleiche Seedbasis; Verhältnis `R / R_ref` = 0,90/1,00/1,10. `R` und `R_ref` sind dimensionsgleiche Nettoplanpreise. Die Werte sind Vergleichseingaben; sie legen keine Zuschlagswahrscheinlichkeit fest. | Gleiche Eingaben reproduzieren dieselbe Stichprobe und Preisstatistik. Der Test prüft nur, dass A02 den relativen Preis korrekt einordnet und keine Einzelkonkurrenzpreise offenlegt; quantitative Einladung/Zuschlagswirkung bleibt bis zur Kalibrierung offen. |
| `PRODUCT-{LOW,BASE,HIGH}` | Ein identischer Arbeitsschritt benötigt 4 qualifizierte Personenstunden und 1 Materialeinheit; verfügbar sind LOW 0 h/0 Einheiten, BASE 4 h/1 Einheit, HIGH 8 h/2 Einheiten. Cash wird ausschließlich aus A03-Übergabe gelesen. | LOW ist wegen Zeit und Material blockiert; BASE ist einmal ausführbar; HIGH erlaubt zwei aufeinanderfolgende Ausführungen, sofern Vorgängerstatus und Lagerraum passen. Keine Ressource wird doppelt belegt; Plan allein erzeugt weder Verkauf noch Finanzbuchung. |
| `INTEGRATED-V3-{SEED-A,SEED-B,SEED-C}` | gemeinsamer 12-Monatslauf; Makroprofil/markt- und produktseitige Exposition, jeweils gespeicherte low/base/high-Auswahl | Makro → Marktchance → Angebot/Snapshot → Auftrag → Produkt-/Auftragskapazität → tatsächliches Ereignis bleibt verfolgbar; A03-Reconciliation und gleiche-seed Replay bestehen. |

Jede gespeicherte Fixture enthält konkrete Parameterwerte, Einheiten, Quelle/Annahmen, Modellversion, Seed und erwartete Invarianten. Die obigen Fälle sind numerisch handprüfbare Vertrags-Fixtures; sie belegen noch keine empirische Kalibrierung und ersetzen keinen integrierten Jahres-Smoke. Dieser wartet auf A08-Quellenreview, A03-Rechen-/Finanzfreigabe und Implementierung.

## 8. Akzeptanz- und Testmatrix für Folgeintegration

| Test-ID | Verantwortlicher nächster Prüfer | Kriterium |
|---|---|---|
| `INT-01` gleiche Eingabe / Replay | A09, A02 | Gleiche Versionen und Seed reproduzieren Event-IDs, Reihenfolge, Phasen, Anfragen, Angebote und Produktzustände exakt. |
| `INT-02` Phase/Periode/Preisindex | A09, A08 | Jede Phase und Übergangshysterese in 12 Monatsperioden nachweisbar; Quelle, Lag und Kalenderperiode sichtbar. Für `V3-SPI-COICOP12-v1` stimmen die zwölf Destatis-Gewichte mit 1 000‰/1,00000 überein; die drei Einzelkomponenten-Fixtures aus T-0063 werden handgerechnet reproduziert. |
| `INT-03` MRO-Zukunft/Finanzierungsquote | A09, A03 | Zukunft ohne EZB-Daten nutzt die synthetische Spiel-`Inflation_y/y`; Testvektoren 1/2/3 % plus 2 Prozentpunkte Spread ergeben indikative 3/4/5 % p.a. bei 36 Monaten. Gleicher Input erzeugt gleiche Quote. Ausdrückliche Annahme friert eine neue Vertragsversion ein; Angebot/Indikator selbst bewirkt keine Buchung/Cash. Bestehende Verträge und V1/V2 bleiben unverändert. A03 prüft spätere Finanzereignisse separat. |
| `INT-04` externe Kanäle/Politik | A08, A09, A06 | jeder der drei Außenwirtschaftskanäle und acht Politikkanäle besitzt Input, Zwischenindikator, Lag, Unternehmensziel und Gegenwirkung; nicht-exponierte Kontrollen bleiben unbeeinflusst. |
| `INT-05` Anfrage/Angebot | A09, A05 | Nachfrage im kontrollierten Lauf über die geforderten Wochentage; Frist, Entscheidung, Ablauf und keine doppelte Auftragserzeugung sind deterministisch. Am Ablaufdatum verarbeitet die Entscheidungsphase zuerst die terminierte Kundenentscheidung, danach verfällt ein weiterhin offenes Angebot am Tagesende. |
| `INT-06` D-0162-Reconciliation | A03, A09 | Nettoplanpreis, DB I, direkte Arbeits-/Maschinenkosten, Ergebnis nach Einzelkosten, BAB-Restcent und Snapshot stimmen exakt mit A03-Vertrag. |
| `INT-07` Produkte/Kapazität | A09, A05 | Abhängigkeiten, Skills, Personal/Maschine, Material, Cash-Gate aus A03 und Fertigwarenlager blockieren/erlauben wie im Fixture; keine Doppelverwendung. |
| `INT-08` Lernen/UI-Nichtmutation | A05, A06, A09 | Lernkontext ist rückverfolgbar; neutraler Lern-/Tooltipzugriff verändert Unternehmenszustand nicht; Status- und Datenbasis werden sichtbar unterschieden. |

## 9. Nicht entscheidungsreife Punkte als Agenten-Handoffs

Diese Punkte sind keine Nutzerfragen und werden nicht durch A02 still entschieden. A01 sollte nach der Entwurfsphase die folgenden konkreten Aufgaben mit Adressat eröffnen:

1. **A08:** datierte Inflations-/EZB-Quellen und den Quellenstatus tatsächlich beobachteter Werte bestätigen; `Inflation_y/y` aus dem Spielpreisindex nicht als nationale Beobachtung oder Erwartungsreihe umdeuten. Keine Zahlen interpolieren, wo keine Quelle vorliegt.
2. **A02 + A08:** für MRO-, Phasen- und Außenwirtschafts-Low/Base/High-Profil eine nachvollziehbare Kalibrierungsmethode vorschlagen; Wirkungsrichtung getrennt von empirischer Effektstärke ausweisen.
3. **A03:** Der vereinfachte T-0066-Spiel-Finanzvertrag steht integriert im A03-Paket §4a. Vor Implementierung bleiben unabhängiger A09-Rechen-/Quellenreview sowie A03s konkrete Ereignis-/Ledgerfreigabe und T-0066-Mengen-/Leistungsübergabe offen. Für V3-15 stimmen A02/A03 die Trennung von indikativem Angebot, ausdrücklich angenommenem Neuvertrag und getrennten Finanzereignissen ab; Quote und Makro bleiben nicht buchend.
4. **A05:** Makro-Snapshot, Angebotsstatus/-snapshot, Monatsmarktbericht und Produkt-/Kapazitätszustände darstellen. A02 verantwortet Marktstichprobe, Berichtsperiode, Größenklassen, Mittelwerte und Verhalten bei kleinen/leeren Gruppen; A03 prüft nur die finanzielle Bedeutung der Preisgröße.
5. **A06:** jede V3-Makro-, Markt-, Kalkulations- und Produktkompetenz den hier verlinkten Zuständen/Kennzahlen und Lernobjekten zuordnen; D-0159 und Nichtmutation erhalten.
6. **A09:** die Testmatrix nach den Fachübergaben ausführen; symbolische Fixtures nicht als numerische Jahresabnahme werten.
7. **A01:** die im §4 festgehaltene Reihenfolge für Angebotsentscheidung und Fristablauf als koordinierte V3-Arbeitsinterpretation führen; sie ist keine Nutzerentscheidung und darf nicht als solche in das Decision Log übertragen werden.

## 10. Grenzen und Selbstreview

- Dies ist eine A02-Entwurfsfassung; Annahmen und Parameter werden nicht als Nutzerbestätigung oder Quellenfakt dargestellt.
- Keine neuen Preis-, Steuer-, Kredit-, Personal-, Buchungs-, Rechts- oder Kalenderegeln. D-0162/D-0163 werden exakt als Grenzen übernommen.
- Keine Änderungen an V1/V2, Code, Schema, Architektur, A03-Unterlagen, Governance oder CPs.
- Fachreview durch A03/A05/A06/A08/A09 und unabhängige QA sind noch nicht durchgeführt. Konflikte, die dieser Phase zugehören, werden nur dokumentiert; Korrekturen auf A01-Review bleiben der Folgephase vorbehalten.

