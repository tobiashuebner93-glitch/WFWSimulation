# A02-Simulationsvertrag – T-0063 V3-Makro- und Ereignismodell

**Status:** A02-Fachvorschlag an A01; fachübergreifende Freigabe und A09-Review offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0063
**Profilbezug:** V3-Simulation; bestehende V1-/V2-Profile, Verträge und Entscheidungen werden nicht rückwirkend geändert.
**Vorgänger:** CP-0275 (ENTWURF)
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals/V3-Zielkarte, Ticket Board T-0063, Collaboration State, CP-0275, Decision Log einschließlich D-0100–D-0102, D-0159, D-0160 und D-0163, A08-Quellenbericht, A03-Finanzübergabe, T-0065-A02-Arbeitsrahmen, T-0067-A03-Kalkulationsvertrag und Gitstatus/alle vorhandenen Änderungen geprüft.
**Quellstände:** A08 Makroquellenbericht vom 2026-10-31; A03-Finanzübergabe T-0063 vom 2026-10-31; Arbeitsbasis `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`.

Gemeinsame Schnittstellen, Ereignisfolge, Szenario-Fixtures und A05/A06/A09-Handoffs: [A02-Integrationsvertrag T-0063/T-0065/T-0066](a02-v3-t0063-t0065-t0066-integrationsvertrag.md).

## 1. Geltungsgrenzen und Kennzeichnung

Dieser Vertrag übersetzt die Quellen- und Finanzübergaben in ein reproduzierbares V3-Simulationsmodell. Er ist ein Fachvorschlag, keine Nutzerbestätigung, keine Rechts-/Wirtschaftsprognose, keine Architektur- oder Schemafreigabe und keine Implementierung.

Jeder Modellwert erhält einen Herkunftstyp:

1. **Beobachteter Quellenwert:** amtliche oder institutionelle Reihe mit Quelle, Veröffentlichungsdatum, Beobachtungsperiode, Einheit und verfügbarer Revisionsversion.
2. **Abgeleiteter Index/Wert:** reproduzierbar aus Quellenwerten und dokumentierter Formel berechnet; Formel- und Gewichtsversion werden gespeichert.
3. **Synthetischer Szenariowert:** ausdrücklich festgelegter Eingabepfad für einen Simulationslauf; nicht als reale Beobachtung bezeichnet.
4. **Kalibrierbare Wirkungshypothese:** Zusammenhang zwischen Makroindikator und Unternehmensgröße, versehen mit Einheit, Richtung, Verzögerung, Unsicherheitsband und Kalibrierungsstatus. Diese Größe darf nicht als empirisch gemessen ausgegeben werden.

Jede Wirkungshypothese weist Richtung und mögliche Gegeneffekte getrennt aus. Wo A08 nur die Übertragungsrichtung plausibilisiert, bleibt die Effektstärke offen. Unbekannte Verteilungen erhalten kein stilles Wahrscheinlichkeitsmodell.

## 2. Perioden- und Ereignisvertrag

### 2.1 Periodenrhythmus

- **Makroberichtsperiode:** Kalendermonat. Quartals-/Jahresmaßnahmen behalten zusätzlich ihren eigenen Beobachtungs- und Veröffentlichungsrhythmus.
- **Periodenabschluss:** Nach dem letzten Simulationsarbeitstag des Monats wird der Monats-Snapshot aus den bis dahin gültigen Ereignissen gebildet. Ein verspätet veröffentlichter Beobachtungswert wird ab seinem ausgewiesenen Veröffentlichungs-/Wirksamkeitsdatum übernommen, nicht rückwirkend als Betriebsereignis gebucht.
- **Periodenbeginn:** Am ersten Simulationstag des Folgemonats werden fällige Szenarioereignisse und deren abgelaufene Verzögerungen aktiviert; der neue Makro-Snapshot steht vor der Erzeugung der Marktchancen dieser Periode zur Verfügung. Bei einem arbeitsfreien Monatsbeginn bleibt die Makroperiode der Kalendermonat; der sichtbare Spieltag ist der erste dafür ausgeführte Simulationstag.
- **Tageslauf:** Zwischen Monatssnapshots werden nur ausdrücklich datierte Ereignisse bzw. bereits eingeplante Wirkungsschritte aktiviert. Kein zufälliges tägliches Neuberechnen eines Indexes.
- **V3-/V2-Trennung:** Der Rhythmus ergänzt nur V3-Szenarien. Er ändert nicht V2-Phase-8- oder Monatsabschlussregeln.

Dies ist A02s Periodenvorschlag. A03 bestätigt die Periode für seine Finanzsicht; es entsteht daraus keine neue Periodenbuchung.

### 2.2 Stabiles Ereignisformat (logischer Vertrag, kein Schema)

Ein **Makroereignis** hat mindestens:

`macroEventId`, `scenarioId`, `seed`, `modelVersion`, `channel`, `sourceType`, `sourceRef`, `effectiveFrom`, `lagPeriods`, `baseValue`, `newValue` oder `delta`, `unit`, `uncertaintyLow/Base/High` (nur wenn definiert), `targetExposure`, `expectedDirection`, `assumptionStatus`. Bei beobachteten statistischen Werten sind außerdem `observedPeriod`, `publishedAt` und ein rekonstruierbarer Datenstand (`dataVintage` oder `sourceSnapshotId`) erforderlich. `observedAt` ist ein optionaler quellenspezifischer Ereignis-/Messzeitpunkt; er ist kein Ersatz für Berichtsperiode oder Publikationsdatum und für Monats-/Quartalsstatistiken nicht allgemein erforderlich. Synthetische Werte tragen stattdessen ihre Szenario-/Fixture-/Modellherkunft und Zielperiode.

`effectiveFrom` bezeichnet das fachliche Datum, ab dem ein Beitrag in der Simulation wirksam werden darf, und muss ein vollständiges valides ISO-Kalenderdatum `YYYY-MM-DD` sein. Es ist von `observedPeriod` (Zeitraum, über den eine Statistik berichtet) und `publishedAt` (Veröffentlichungsdatum des konkret verwendeten Datenstands) getrennt. Das eventuelle Feld `observedAt` beschreibt nur dann einen punktuellen Quellenzeitpunkt, wenn die Quelle einen solchen ausweist. Beobachtete Werte sind in einem Monatssnapshot nur verfügbar, wenn `publishedAt` spätestens am letzten Kalendertag des Snapshotmonats liegt; spätere Publikationen werden nicht vorweggenommen.

`macroEventId` kennzeichnet ausschließlich Herkunft, Replay und Einmaligkeit der **makroökonomischen Simulationswirkung**. Eine Makro-Beobachtung, Indexänderung, Politikannahme oder MRO-Mitteilung darf niemals selbst eine Buchung auslösen oder als A03-Finanzereignis interpretiert werden. Eine Wiederholung derselben `macroEventId` darf die Makro-Simulationswirkung innerhalb desselben Laufs nicht doppelt aktivieren.

Ein späteres, tatsächlich freigegebenes Beschaffungs-, Vergütungs- oder Kreditreset-Ereignis ist ein eigenes **Finanzereignis** im A02/A03-Vertragsfluss. Es braucht seinen eigenen Finanzereignis-/Idempotenzbezug (`financialEventId`) sowie die bestehende A03-Vertragsreferenz und den autorisierten Änderungs-/Buchungsgrund. Wenn es durch ein Makroereignis angestoßen wurde, darf es eine Provenienzkorrelation (`causedByMacroEventId` oder gleichwertigen Verweis) tragen; diese Korrelation ersetzt weder die `financialEventId` noch A03s vorhandene Buchungs-Duplikatregel. Mehrere freigegebene Finanzereignisse können sich auf ein Makroereignis beziehen; ein Makroereignis selbst wird nie direkt gebucht. Die konkrete Erstellung/Auswertung der Finanzereignis-ID und die Buchungsidempotenz bleiben A03s bestehendem Finanzvertrag überlassen.

Für die Aktivierungshistorie gilt: Jedes geplante Ereignis mit `effectivePeriod` bis einschließlich eines Snapshot-Monats muss genau in dem ersten Snapshot erscheinen, in dem es fällig ist. Frühere Aktivierungen bleiben dauerhaft in der Historie; sie dürfen in späteren Snapshots nicht erneut als wirksam oder aktiviert erscheinen. In diesem Vertrag ist kein Cancel-/Reject-Übergang für geplante Makroereignisse definiert; solche Ausnahmen werden daher nicht stillschweigend angenommen.

Alle genannten Felder sind logische fachliche Anforderungen. Sie genehmigen weder eine Datenbank noch eine Persistenzarchitektur und ändern keine A03-Policy.

### 2.3 Gleichzeitige Wirkungen und Nicht-Doppelzählung

Gleich wirksame Ereignisse bleiben getrennt protokolliert. Sie werden nicht durch eine erfundene Rangfolge verworfen. Mehrere Beiträge auf denselben Zielindikator werden erst nach einer ausdrücklich festgelegten Aggregationsformel kombiniert; bis dahin sind Mehrfachwirkungen als getrennte Komponenten/Unsicherheit sichtbar. Ein Ereignis, das sowohl Makronachfrage als auch eine policy category darstellt, trägt eine gemeinsame Szenario-/Wirkungskennung, damit der Effekt nicht doppelt in Auftragseingang gezählt wird.

## 3. Vier Konjunkturphasen

### 3.1 Indikatoren und Skalen

Für V3 wird eine **synthetische Trendzyklus-Klassifikation** als steuerbare Spielgrundlage vorgeschlagen; sie ist keine amtliche Phasenreihe. Beobachtetes reales BIP ist eine amtliche Quartalsreihe und wird im Quellenfenster mit Veröffentlichungs-/Revisionsstand geführt. Eine daraus gebildete monatliche Spielreihe ist dagegen ausdrücklich synthetisch; sie wird nicht durch unmarkierte lineare Interpolation als beobachtete Monatsreihe ausgegeben. Mindestens folgende Reihen werden geführt:

- `activityIndex_t`: beobachtetes reales BIP/Produktionsvolumen nur mit der gelieferten offiziellen Periode und Einheit; für monatliche Läufe wird eine gesondert markierte synthetische Aktivitätsreihe mit Monatsindexbasis `100` verwendet;
- `trendIndex_t`: modellierter Trend-/Potenzialpfad auf derselben Skala und in derselben Periode wie `activityIndex_t`; seine Schätzung ist Szenarioparameter;
- `activityGapPct_t = 100 × (activityIndex_t / trendIndex_t − 1)`: Lage der Aktivität relativ zum modellierten Trend, in Prozent;
- `activityMomentumPct_t = 100 × (activityIndex_t / activityIndex_(t−1) − 1)`: Richtungsänderung zur vorigen Monatsperiode, in Prozent;
- `capacityUtilizationPct`: hypothetische aggregierte Kapazitätsauslastung, wenn die Szenarioreihe dafür Werte bereitstellt;
- Kontextreihen wie Auftragseingang, Arbeitslosigkeit und Inputkostenindex mit eigener Einheit und Herkunft.

Eine Aktivitätsreihe wird nicht mit dem Verbraucherpreisindex oder mit einem Unternehmens-Inputkostenindex verwechselt.

### 3.2 Zustandsdefinition

Die vier Spielphasen sind ausdrücklich eine **synthetische Trendzyklus-Klassifikation**. Sie kombinieren **Lage** (`activityGapPct`, Aktivität gegenüber modelliertem Trend) und **Richtung** (`activityMomentumPct`, Änderung gegenüber der vorigen Monatsperiode); sie beanspruchen weder die klassische Konjunkturphasierung als amtliche Monatsbeobachtung noch eine OECD-Prognose. A08 weist darauf hin, dass es keine universellen amtlichen Phasenschwellen gibt; deshalb sind die Grenzwerte Szenarioparameter `lowGap`, `highGap`, `positiveMomentum`, `negativeMomentum` und `persistencePeriods`. Ein Datensatz muss Parameter, Einheit und Versionsstand mitführen. Konkrete Zahlen werden nicht als empirisch bestätigt festgelegt.

| Zustand | Messbare Eintrittsbedingung (Schwellenwerte sind konfigurierbare Szenarioparameter) | Testbarer Effektpfad (Hypothese, keine Effektgröße) |
|---|---|---|
| **Aufschwung** | Aktivität erholt sich von niedrigem Niveau; Momentum ist positiv und die Aktivitätslücke schließt sich. | Nachfrage-/Inlandsauftragsindex kann über einen zu kalibrierenden Nachfragekanal steigen; steigende Auslastung kann später Kapazitätsdruck anzeigen. |
| **Hochkonjunktur/Boom** | Aktivität liegt oberhalb der konfigurierten oberen Trend-/Druckbandgrenze oder die Auslastung liegt über der als angespannt gesetzten Schwelle. Wachstum allein genügt nicht. | Nachfrage bleibt tragfähig; enger werdende Kapazität kann Lieferzeit/Inputkosten oder Personalengpass erhöhen. Diese Richtungen sind je Szenario prüfbar, nicht automatisch proportional. |
| **Abschwung** | Momentum ist negativ und Aktivität fällt vom Hoch bzw. Normalniveau, aber die konfigurierte Tiefstandbedingung ist noch nicht erfüllt. | Auftragseingang kann nach dem Szenario-Lag nachlassen; geringere Auslastung kann Kapazitätsdruck senken, während fixe Kosten zunächst bestehen bleiben. |
| **Tiefstand** | Aktivitätslage unterschreitet die konfigurierbare niedrige Trendbandgrenze; Momentum ist schwach, negativ oder beginnt sich am Tief zu stabilisieren. | Nachfrage bleibt schwach; der Szenariowendepunkt kann mit Verzögerung erste Erholung anzeigen. Niedriger Kostendruck garantiert keine Kostensenkung des Unternehmens. |

### 3.3 Übergänge und Stabilisierung

Der Zustand ist eine diskrete Monatszustandsmaschine mit zyklischer Nachbarschaft `Aufschwung → Boom → Abschwung → Tiefstand → Aufschwung`; derselbe Zustand kann mehrere Perioden bestehen. Auf einen Phasenwechsel muss die Kandidatenbedingung die konfigurierbare `persistencePeriods`-Hysterese erfüllen. Die Hysterese verhindert Flattern um eine Schwelle. Ein Sprung über mehrere Phasen wird nur zugelassen, wenn das jeweilige Szenarioprofil eine explizite Schocktransition enthält und diesen Sonderpfad protokolliert.

Ein `phaseTransition` speichert alten/neuen Zustand, Indikatorwerte, Schwellenversion, Kandidatenseitdauer, Übergangsauslöser und Ereignis-ID. Wenn Daten fehlen oder Indikatoren widersprüchlich sind, bleibt die vorherige Phase erhalten und die Unsicherheit/fehlende Daten werden sichtbar; das System erfindet keine Phase.

### 3.4 Reproduzierbarkeit und Ungewissheit

Jede 12-Monats-Simulation liefert `scenarioId`, `seed`, Quellen-/Szenariodatenversion, Trend- und Schwellenparameter sowie Ereignisfolge. Die vier Phasen können durch vier explizite Testpfade erreicht werden. Für die Fachprüfung sind zusätzlich Kontrollpfade sinnvoll, die Übergänge sowie Schwellenrauschen abdecken. `seed` steuert ausschließlich dokumentierte synthetische Ziehungen; deterministische Szenariopfade werden aus den gespeicherten Monatsinputs replayed.

Für Parameter ohne belastbare Effektstärke gibt es mindestens getrennte **niedrige / zentrale / hohe Szenariowerte** als Testeingaben; diese Labels sind keine Wahrscheinlichkeiten. Solange konkrete Zahlen nicht fachlich kalibriert oder als Produktparameter freigegeben sind, verwenden Testfälle ausdrücklich synthetische Fixturewerte und prüfen Richtungen sowie Invarianten statt Pseudogenauigkeit.

## 4. Verbraucherpreis- und Unternehmensinputkostenindex

### 4.1 Simulierter Verbraucherpreisindex

V3 verwendet einen **VPI-gewichtet aufgebauten Spielpreisindex** (`V3-SPI-COICOP12-v1`), nicht die amtliche VPI- oder HVPI-Reihe. Seine Basketstruktur und Gewichte stammen aus Destatis' vollständigem COICOP-Wägungsschema für den VPI, Basis 2020, erschienen am 22.02.2023. Monatskomponenten können aus der passenden Destatis-Tabelle 61111-0006 bezogen werden; für Zukunftsperioden oder kontrollierte Tests dürfen Komponentenpfade synthetisch sein und müssen als solche gekennzeichnet werden. Keine HVPI-/ECOICOP-Gewichte oder -Reihen werden beigemischt.

| COICOP | VPI-Abteilung | offizielles Gewicht (‰) | normiertes Gewicht `w_i = Promille / 1000` |
|---|---|---:|---:|
| 01 | Nahrungsmittel und alkoholfreie Getränke | 119,04 | 0,11904 |
| 02 | Alkoholische Getränke und Tabakwaren | 35,26 | 0,03526 |
| 03 | Bekleidung und Schuhe | 42,25 | 0,04225 |
| 04 | Wohnung, Wasser, Strom, Gas und andere Brennstoffe | 259,25 | 0,25925 |
| 05 | Möbel, Leuchten, Geräte und anderes Haushaltszubehör | 67,78 | 0,06778 |
| 06 | Gesundheit | 55,49 | 0,05549 |
| 07 | Verkehr | 138,22 | 0,13822 |
| 08 | Post und Telekommunikation | 23,35 | 0,02335 |
| 09 | Freizeit, Unterhaltung und Kultur | 104,23 | 0,10423 |
| 10 | Bildungswesen | 9,06 | 0,00906 |
| 11 | Gaststätten- und Beherbergungsdienstleistungen | 47,20 | 0,04720 |
| 12 | Andere Waren und Dienstleistungen | 98,87 | 0,09887 |
| **Summe** | | **1 000,00** | **1,00000** |

Das Wägungsschema wird versioniert und bleibt zwischen amtlichen VPI-Revisionen fest. Bei einem von Destatis veröffentlichten neuen Basisjahr/Wägungsschema erhält der Spielindex eine neue Basketversion; alte Versionen bleiben für Replays erhalten. Nur passende VPI-COICOP-Gewichte und -Komponenten werden verbunden. Tabelle 61111-0006 liefert monatliche deutsche VPI-Komponenten nach COICOP; das Spiel übernimmt beobachtete Werte nur mit Quelle, Bezugsmonat und Quellenstand. Ein fehlender Monat wird nicht rückwirkend erfunden. Synthetische Zukunftspfade tragen `sourceType=synthetic` und dürfen nicht als amtliche Verbraucherpreise ausgegeben werden.

Für den Spielindex seien `price_i,t` die monatlichen Preis-/Indexinputs der zwölf Abteilungen und `price_i,Basis` deren Basisperiodenwerte. Mit `componentIndex_i,t = 100 × price_i,t / price_i,Basis` und Basisjahr `2020=100` gilt die Zielformel in beiden äquivalenten Schreibweisen:

`SPI_t = 100 × Σ_i((weightPromille_i / 1000) × (price_i,t / price_i,Basis))`
`SPI_t = Σ_i((weightPromille_i / 1000) × componentIndex_i,t)`
`Inflation_m/m,t = 100 × (SPI_t / SPI_(t−1) − 1)`
`Inflation_y/y,t = 100 × (SPI_t / SPI_(t−12) − 1)`

Die Formel ist der transparente Spielaggregator mit belegter Basketstruktur und Gewichten; ohne vollständige passende Komponenten-/Revisionsreihe wird sein Ergebnis nicht als amtlicher Destatis-Gesamt-VPI bezeichnet. Für den Jahresvergleich vor zwölf vollständigen Vergleichsperioden ist `Inflation_y/y` „nicht verfügbar“, kein geschätzter Ersatzwert. Interne Präzision bleibt erhalten; Anzeige von Index und Rate wird auf zwei Dezimalstellen gerundet. Es wird nicht je Komponente vor der Aggregation gerundet. Diese Indexanzeige ist keine D-0162-Geldbetragsrundung.

**Handprüfbare Komponenten-Fixtures (synthetische Testwerte, Gewichte amtlich belegt):** Basiszustand: alle zwölf Komponenten stehen bei `100,00000` im Basisjahr 2020; damit `SPI=100,00000`. Für jede Zeile ändert sich nur die benannte Komponente, die übrigen elf bleiben bei 100:

| Fixture | einzelne Komponente | Komponentenindex | Handrechnung | `SPI_t` | m/m ggü. 100 |
|---|---|---:|---|---:|---:|
| F-01 | COICOP 01 Nahrung (119,04‰) | 101,00000 | `100 + (119,04/1000 × 1)` | 100,11904 | +0,11904 % |
| F-04 | COICOP 04 Wohnen (259,25‰) | 102,00000 | `100 + (259,25/1000 × 2)` | 100,51850 | +0,51850 % |
| F-07 | COICOP 07 Verkehr (138,22‰) | 99,00000 | `100 + (138,22/1000 × −1)` | 99,86178 | −0,13822 % |

Kontrollen: unveränderte zwölf Komponenten ergeben `SPI=100,00000` und `0,00 %`; die Gewichte addieren sich auf `1 000,00‰` bzw. `1,00000`. Fixturepreise/-indizes sind keine amtlichen Monatswerte und keine Wahrscheinlichkeitsaussage. Datierte Quellenanker (abgerufen `2026-10-31`): [Destatis, VPI-Wägungsschema Basis 2020, erschienen 22.02.2023](https://www.destatis.de/EN/Themes/Economy/Prices/Consumer-Price-Index/Publications/Downloads-Consumer-Price-Indices/weighting-pattern-2020.pdf?__blob=publicationFile&v=2), [Destatis GENESIS 61111-0006, monatliche VPI-Komponenten nach COICOP](https://www-genesis.destatis.de/datenbank/online/table/61111-0006), [Destatis VPI-Methodik](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/Methoden/Erlaeuterungen/verbraucherpreisindex.html). Die Wägungsschema-PDF belegt die Gewichte; 61111-0006 belegt die monatliche Komponentenstruktur, nicht die synthetischen Fixturewerte.

### 4.2 Unternehmensinputkosten

Ein separater `businessInputCostIndex` kann Material, Energie, Lohn und Transport zeigen. Warenkorb und Gewichte werden aus einem expliziten Szenario oder einer bestätigten Kostenstruktur übergeben; sie werden nicht aus CPI-Gewichten übernommen. Ein Indexwert ist Planung/Analyse. Er ändert weder bestehende Einkaufspreise noch Lohn-, Maschinen- oder Kundenverträge und erzeugt keine Bestandsneubewertung oder Buchung.

## 5. Außenwirtschaftliche Kanäle

Die folgenden Kanäle sind im Szenario getrennt, mit Herkunft, betroffenen Expositionen und Einheiten messbar. Eine Änderung wirkt nur auf passende Positionen/Marktsegmente; die konkreten Expositionsanteile sind Szenario-/Betriebsparameter und keine pauschale Unternehmenszuordnung.

| Kanal | Beobachtungsgröße / Periode | Simulationsübertragung mit Verzögerung/Unsicherheit | Unternehmensmesspunkt und Finanzgrenze |
|---|---|---|---|
| **Wechselkurs und importierte Vorleistungen** | datierter EZB-Referenzkurs bzw. Wechselkursindex (Basis 100), tägliche Quelle auf Monats-Snapshot verdichtet | Eingabe eines Szenario-Kursimpulses, `lagPeriods` plus low/base/high price-pass-through parameter; variable/stufenweise Weitergabe ist Annahme, kein EZB-Fakt | Nur importexponierte, noch nicht vertraglich fixierte Angebots-/Beschaffungskalkulation kann den Indikator verwenden. Messpunkt: Plan-Einstandspreis/Index. Kein automatischer FX-Gewinn/-Verlust, keine rückwirkende Vertrags- oder Lageränderung. |
| **Auslandsnachfrage/Exportchance** | monatlicher Auftragseingangsindex für Auslandsaufträge, Basis 100 | Szenarioänderung wird nur exportfähigen/exponierten Segmenten zugeordnet; `lagPeriods` und Einflussstärke werden als Szenarioparameter dokumentiert | Messpunkt: Zahl/Anteil passender Anfragen oder Absatzgelegenheiten in der Periode, keine Umsatzbuchung durch Anfrage. T-0065 klärt Segment-/Zuschlagswirkung. |
| **Internationale Lieferstörung** | Lieferzeit in Kalendertagen und/oder Pünktlichkeit/Füllquote in % | betroffene Lieferanten-/Materialgruppe, Start-/Endperiode und Eintrittsunsicherheit; Verzug/Verfügbarkeit werden nur über tatsächliche neue Bestell-/Lieferereignisse operativ | Messpunkt: Planlieferzeit, tatsächliche Verspätung, verfügbare Materialmenge. Kein pauschaler Preis-/Lager-/Cash-Effekt ohne Lieferantenangebot und A03-Vertrag. |

Die Wirkungskette wird einzeln auswertbar gehalten: `externe Beobachtung → Makro-/Außenwirtschaftsindikator → betroffene Exposition → operativer Folgeindikator → optional autorisiertes Vertrag-/Ist-Ereignis`. Mindestens Wechselkurs und Auslandsnachfrage sind als getrennte Testkanäle auszuführen. Keine Zollregel wird ohne konkrete Ware/Land/Rechtsquelle ergänzt; „Tarifpolitik“ bleibt von Zoll-/Handelstarifen getrennt.

## 6. EZB-Entscheidungen, MRO und Unternehmensfinanzierung

### 6.1 Beobachteter Beschluss und Zukunftspfad

Der beobachtete MRO wird als externe Zeitreihe mit Wirksamkeitsdatum, Periode und Quelle geführt. A08 belegt den geldpolitischen Zins-/Kredit-/Erwartungskanal und lange, variable, unsichere Verzögerungen; nicht aber eine proportionale Firmenkreditwirkung.

D-0100/D-0101 nennen den MRO als EZB-Referenz und den Jahresstichtag 1. Januar. D-0102 und die Scopebestätigung D-0163 legen fest: Wenn für den betreffenden V3-Zeitraum keine realen EZB-Daten vorliegen, verwendet V3 einen inflationsorientierten simulierten MRO-Zukunftspfad. Die Entscheidung bestätigt weder historische MRO-Ersatzwerte noch eine konkrete Formel, Verzögerung oder Unsicherheitsverteilung. Der MRO-Wert bleibt ein Szenarioindikator und löst keinen automatischen Reset bestehender Kreditverträge aus. Der Modellvertrag trennt:

- **Beobachtungs-/Testpfad:** Reale EZB-Beobachtungen werden nur für Perioden mit verfügbarer, datierter Quelle verwendet. Erhöhungs- und Senkungsszenarien dürfen als explizite synthetische Testinputs gesetzt werden; sie sind keine historischen Werte.
- **Inflationsorientierter V3-Zukunftspfad:** Für Perioden ohne reale EZB-Daten ist der Eingangsindikator ausschließlich die aus dem synthetischen Spielpreisindex abgeleitete `Inflation_y/y`. Das ist eine modellabgeleitete Spielrate, weder eine Inflationserwartung noch ein beobachteter nationaler VPI-Wert. Überführungsformel/Koeffizienten, Lag, Unsicherheitsband und zulässige Änderungsgrenzen bleiben transparente, versionierte und zu kalibrierende Szenarioparameter. Solange sie nicht kalibriert sind, prüfen Fixtures den numerischen Indexinput, Wirkungsrichtung, Verzögerungssichtbarkeit und Invarianten; ein MRO-Ausgabewert wird nicht ausgedacht. Dies ist eine Spielkonvention gemäß D-0102/D-0163, keine Aussage über eine mechanische EZB-Regel.

Jede Testreihe umfasst mindestens einen Erhöhungs- und einen Senkungspfad; beide werden als V3-Szenarioereignis protokolliert. Aus einem Szenariopfad folgt kein automatischer Kreditvertrag-Reset.

### 6.2 Zinskanal und Altvertragsschutz

Zinsereignis hat Beobachtungs-, Beschluss- und Wirksamkeitsdatum sowie eine explizite `lagPeriods`-Konfiguration. Es kann Makroberichte, modellierte Finanzierungsbedingungen oder eine Entscheidungshilfe für neue Finanzierung ändern. Es ändert **nicht** von selbst Festzinsrate, Restschuld, Tilgung, bestehende Dispolinie, Betriebszins, Bilanz oder Cash.

Finanzielle Wirkung ist nur möglich, wenn ein konkreter Kreditvertrag Referenz, Marge, Resetregel, Wirksamkeit, Periode, Rundung und Belastungsereignis ausdrücklich aufweist und A03 den Finanzpfad bestätigt. Neuverhandlungen/Neuverträge nutzen nur die Konditionen, die Spieler/Bank im jeweiligen Vertragsfluss akzeptieren. A03s Testgrenze „EZB-/MRO-Wert ändert sich bei Festzinsvertrag → unveränderte Rate“ bleibt harte Invariante. V2-Finanzzustände werden nicht auf V3 übertragen oder verändert.

Eine indikative Konditionsübergabe einer ausdrücklichen neuen Kreditanfrage prüft `validFrom` und `validUntil` als valide ISO-Kalendertage und verlangt `validFrom <= validUntil`. Maßgeblicher As-of-Zeitpunkt des Monatssnapshots ist dessen letzter Kalendertag: vor `validFrom` wird noch keine Quote ausgegeben, innerhalb des Fensters bleibt sie `indicative`, nach `validUntil` wird sie `expired` ausgewiesen. Das nutzt nur die im Integrationsvertrag vorgesehenen Statuswerte und erzeugt keinen Vertrag oder Finanz-/Ledger-Effekt.

## 7. Acht wirtschaftspolitische Kanäle

Jeder Kanal wird als eigenes, datiertes Szenarioobjekt erfasst mit `measure`, `goal`, `intermediateIndicator`, `sourceOrAssumption`, `lagPeriods`, `uncertaintyBand`, `firmExposure`, `expectedOutcome`, `counterEffect` und `accountingClass`. `accountingClass` startet als **nur Information/Plan**, sofern kein freigegebener A03-Vertrag eine konkrete Istwirkung gestattet.

| Kategorie | Messbarer Indikator / Rhythmus (Vorschlag aus A08) | Einzelner Wirkungspfad im Szenario | Verzögerung/Unsicherheit und Zielkonflikt |
|---|---|---|---|
| **Geldpolitik** | MRO/Geldmarktindikator, % p. a.; Beschlussdatum | Zinserwartung/Finanzierungsbedingungen → Investitions-/Nachfrageindex → passende Unternehmensentscheidung | variable Verzögerung; Vertrag nicht automatisch ändern. Preisstabilität kann kurzfristig mit Finanzierung/Wachstum kollidieren. |
| **Finanzpolitik** | öffentlicher Nachfrage-/fiskalischer Impulsindex, Basis 100; quartalsweise Quelle, mögliche monatliche Szenariowirkung | öffentlicher Nachfrageimpuls → passende Inlandsanfrage-/Auftragschance, niemals garantierter Auftrag | Investitions- und Nachfragewirkung kann gegen fiskalische Finanzierung/Preisdruck stehen; keine Steuer/Abgabe/Förderbuchung ohne eigene Rechts-/Finanzentscheidung. |
| **Wachstumspolitik** | Produktivitäts-/Potenzialindex, Basis 100; quartals-/jährlich | Innovation/Kapital-/Infrastrukturannahme → späteres Produktivitäts- oder Kapazitätspotenzial → optional betriebliche Planung | langsamer Wirkpfad, anfänglicher Kapital-/Zeitbedarf; Wachstumspotenzial ist kein tatsächlicher betrieblicher Produktivitätsgewinn. |
| **Tarifpolitik** | Branchenlohnindex, Basis 100, % Veränderung; tarifereignis-/jährlich | Tarifparteien verhandeln Arbeitsbedingungen → modellierter Lohnkosten-/Einkommensindikator → Planlohn oder Nachfrage | Lohnkosten und verfügbare Nachfrage können in entgegengesetzte Richtungen wirken. Kein staatlich fixierter Lohn und keine direkte Änderung individueller Gehälter. |
| **Arbeitsmarktpolitik** | Arbeitslosen-/Vakanzquote % oder Skillverfügbarkeitsindex; quartalsweise | Vermittlung/Qualifizierung → Skill-/Vakanzindikator → Besetzungs-/Qualifikationschance im Betrieb | Vermittlungs-/Qualifikationseffekt mit Lag; Qualifizierung kann zuerst Personalzeit/Kosten binden. Keine automatische Einstellung oder Befähigung. |
| **Umweltpolitik** | Energie-/Materialintensität pro Stück oder €; Maßnahmenereignis/quartalsweise | Effizienzregel/Förder- oder Informationsszenario → erforderliche Anpassung → physische Intensität/Planbedarf | Investitions-, Cash- und Kapazitätsbedarf heute gegen Ressourcenersparnis später; keine automatische Förderung, CO₂-Abgabe oder technische Einsparung. |
| **Nachfrageorientierte Politik** | Nachfrage-/öffentlicher Auftragsindex, Basis 100; quartalsweise | zeitlich begrenzter Impuls → Haushalts-/öffentliche Nachfrage → passende Anfrage-/Marktgelegenheiten | mögliche Stützung gegen Kapazitäts-/Preisdruck; Auftrag, Umsatz und Zahlung bleiben getrennte spätere Ereignisse. |
| **Angebotsorientierte Politik** | Potenzial-, Skill- oder Kapazitätsindex, Basis 100; quartals-/jährlich | Qualifikation, Infrastruktur oder Rahmenbedingung → Angebots-/Kapazitätspotenzial → betriebliche Erweiterungsentscheidung | Wirkung verzögert, Investition/Anpassung kann zunächst binden. Als Wirkungsrichtung markieren, nicht als weitere Institution oder garantierte Kostenreduktion. |

**Doppelzählungsschutz:** Wachstumspolitik beschreibt hier eine langfristige Ziel-/Maßnahmenfamilie; Angebotsorientierung bezeichnet eine mögliche Wirkungsrichtung. Ein Szenario darf beide Tags tragen, aber erzeugt nur einen gemeinsamen Effektbeitrag je Zielindikator. Nachfrageorientierung ist ebenfalls Wirkungsrichtung; sie ist keine zweite separate fiskalische Maßnahme, sofern nicht eine zweite unabhängige Maßnahme explizit beschrieben wird.

## 8. Unternehmenswirkung ohne Finanzmutation

Makroereignisse dürfen unternehmensseitig folgende beobachtbare **nichtmonetäre** Größen bewegen, wenn die jeweilige Exposition angegeben ist:

- Anfrage-/Exportchancen pro Segment und Monat (T-0065 übernimmt Marktentscheidung und Zuschlag);
- erwartete Lieferzeit und betroffene Materialverfügbarkeit (Beschaffung folgt tatsächlichen A02/A03-Lieferereignissen);
- Plan-Inputkosten- und Lohnindizes (T-0067 nutzt nur ausdrücklich übernommene Annahmen);
- Kapazitäts-/Skill-/Vakanz- und Produktivitätspotenzial (T-0066 prüft tatsächliche Arbeitsressourcen);
- prognostizierte Finanzierungskondition neuer/vertraglich variabler Finanzierung (A03 bestimmt, ob ein echtes Vertragsereignis vorliegt).

Die Modelleffekte werden als `Δ` zur Szenariobasis gemessen (Indexpunkte, Prozentänderung, Anfrageanzahl, Kalendertage oder Kapazitätseinheit). Die Wirkungskoeffizienten liegen in einem expliziten Kalibrierungsdatensatz. Bis dahin prüfen Tests nur Signalrichtung, Verzögerungssichtbarkeit, Exposition und Schutzinvarianten. Ein A02-Indikator darf weder A03-Saldo mutieren noch Erlös, Bestand, Lohnaufwand, Zinsaufwand, Rechnung, OP oder Cash direkt erzeugen.

## 9. Zwölfmonats- und Ereignistestvertrag

Jede Testausführung speichert Seed, Scenario-ID, Modell-/Schwellenversion, Quellen-Snapshot, Ereignisse mit Wirksamkeits- und Beobachtungsdatum, Indikatoren, Übergangsentscheidungen und Geschäftsgrößen vor/nach Einfluss. Ein 12-Monats-Szenario erreicht jede der vier Phasen reproduzierbar. Das kann über feste synthetische Pfade geschehen und beweist keine historische Zyklendauer.

| Testgruppe | Eingabevariation | Erwarteter Befund |
|---|---|---|
| Vier Phasen | je ein synthetischer Aktivitäts-/Trendpfad mit klarer Lage und Richtung | richtige Phase nach dokumentierten Schwellenversionen, sichtbarer Indikator-/Übergangsgrund und Lauf über zwölf Perioden |
| Hysterese | Messwert über/unter Grenze, einmal kurz und dann wiederholt über die konfigurierbare Dauer | kein Flattern bei kurzzeitigem Ausschlag; Übergang sobald Kandidatenbedingung ausreichend persistiert |
| Außenwirtschaft | FX-/Auslandsauftrag-/Lieferstörungskanal einzeln sowie ohne Exposition | betroffene Plan-/operative Anzeige reagiert in erwarteter Richtung nach configured lag; nicht exponiertes Material/Segment bleibt unverändert; kein Finanzsaldo allein aus Index |
| Politik | je eine Maßnahme je der acht Kategorien mit separat dokumentiertem Ziel und Lag | beobachtbarer Zwischenindikator, Unternehmensfolge und Gegenwirkung; keine Doppelzählung von Wachstum/Angebots-/Nachfrage-Tags |
| EZB-Schocks | MRO-Erhöhung und MRO-Senkung, feste Kreditkondition | Makro-/Finanzierungsindikator ändert sich nach Ereignisregel; Festzinsverträge/Altprofile bleiben identisch |
| Inflation | konstanter Warenkorb; kontrollierte Einzelpreisänderung; 12-Monatsvergleich ohne volle Historie | Basisindex/Inflation rechnerisch nachvollziehbar; fehlende Historie bleibt fehlend, Inputkostenindex bleibt getrennt |
| Reproduzierbarkeit | identischer Seed, Modell- und Eingabeversion zweimal | identische Ereignisfolge und Ergebnisse; unterschiedliche Seed-Versionen ändern nur ausdrücklich randomisierte Szenarioteile |
| A03-Grenze | reine Makroindikatoränderung und gleiche Periode ohne Finanzereignis | Ledger, Bilanz, Forderungen, Verbindlichkeiten, Personalabrechnung, Cash und Festverträge unverändert; keine Doppelbuchung |

## 10. Finanzgrenzen und A03-Abgleich

Die A03-Finanzübergabe ist mit diesem A02-Vertrag konsistent in folgenden Punkten:

- Makro-Beobachtung und Prognose bleiben nichtfinanziell; Index-/Politik-/EZB-Wert ist keine Buchung.
- Index-/FX-Bewegungen ändern keine akzeptierten Preise, Lieferantenverträge, Löhne, Lagerwerte oder Festzinsen nachträglich.
- Lohn-/Umwelt-/Fiskal-/Nachfragekanal mutiert keine Finanzposition ohne konkrete, autorisierte Beschäftigungs-, Liefer-, Leistungs-, Vertrags- oder Zahlungsregel.
- A02 bestimmt Ereigniszeit, Periode, Wirksamkeitsdatum, Verzögerung und Ereignis-ID; A03 validiert Ergebnis-/Cash-/Postenwirkung und Ledgerpfad.
- Es gibt keine neue Rechnung, Rundung, Buchungsreihenfolge, Zinsabgrenzung oder Schemaänderung in diesem Vorschlag.

**Verbleibende Integrationspunkte (D-0163 hat den V3-Scope des MRO-Zukunftspfads bestätigt):**

1. A08 prüft die datierten Destatis-Quellenanker, die zwölf VPI-COICOP-Gewichte und den Bezug der Komponenten aus 61111-0006. A08 bestätigt, dass synthetische Zukunftspfade/Fixtures nicht als amtliche Beobachtungen oder amtlicher Gesamtindex ausgegeben werden.
2. A02/A03 bestätigen Indexanzeigerundung sowie gemeinsamen Perioden-/Snapshotzeitpunkt für Monatsabschluss und Marktbericht; die Rate verwendet ungerundete Indexwerte, die Anzeige rundet getrennt.
3. A03 bestätigt vor Implementierung die Finanzgrenze einer angenommenen neuen MRO-abgeleiteten Finanzierungskondition sowie deren getrennte Finanzereignisse. Indikator und indikative Quote bleiben nicht buchend.
4. Expositionsdaten für importierte Vorleistungen, exportfähige Marktsegmente, Material-/Lieferantenrisiken und Lohn-/Skillkanäle.
5. Bei späterer Implementierung: Idempotenz/zusammengeführte Mehrfachereignisse entlang eines in A02/A03 gemeinsamen Ereignistickets.

## 11. Konfliktreview und Folgeschritte

- **A08-Quellenreview:** übernommen wurden Definitionen/Einheiten und Grenzen; keine Quelle liefert universelle Zyklusschwellen, Effektkoeffizienten oder feste Wirkungslags. Diese bleiben konfigurierbare Szenarioannahmen.
- **A03-Finanzreview:** dessen Informations-/Plan-/Vertrags-/Isttrennung sowie Festzins- und Ledgergrenzen sind eingehalten. Der verbleibende A03-Abgleich betrifft konkrete Vertrags- und Finanzereignisse, nicht den durch D-0163 bestätigten V3-Scope des MRO-Indikators.
- **D-0102/D-0163:** der inflationsorientierte MRO-Zukunftspfad gilt in V3 bei fehlenden realen EZB-Daten. Formel, Lag und Unsicherheit sind noch nicht numerisch kalibriert; bestehende Kreditverträge werden nicht automatisch zurückgesetzt.
- **D-0159:** Lernfragenabnahme/Pflicht-Lernereignis-Abgrenzung beachtet; keine Fragenprüfung wird neu eröffnet.
- **D-0160:** V2-only; nicht auf V3 übertragen.
- **V2:** keine Profil-, Markt-, Preis-, Kredit- oder Ereignisregel geändert.

Nach fachlicher Bestätigung durch A01/A03 und A08-Quellenprüfung der Gewichts-/Komponentenverknüpfung folgt ein gemeinsamer Auftrag an A02/A03 zur finalen Ereignis-/Perioden- und Finanzvereinbarung. Der SPI verwendet die amtliche VPI-Basketstruktur und Gewichte, aber synthetische Spielpfade werden weiterhin nicht als amtliche VPI-/HVPI-Werte bezeichnet. Danach prüft A09 unabhängige Szenario-/Index-/Reproduzierbarkeitstests. Markt-/Lernintegrationen erhalten nur den finalen Modellvertrag, keine stillen Zwischenwerte.
