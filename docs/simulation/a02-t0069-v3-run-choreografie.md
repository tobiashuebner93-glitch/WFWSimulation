# A02 – T-0069 deterministische V3-Laufchoreografie

**Status:** A02-Integrationsvertrag mit Shared-Run-Tages-/Operationsablauf und read-only Kundenevidenz-Handoff (siehe [A02 T-0069 Customer-Evidence-Bericht](a02-t0069-v3-customer-evidence-handoff-arbeitsbericht.md)); Rechnungs-/Zahlungsevents und A03-Finance-Integration bleiben offen; unabhängige QA/Gesamtfreigabe offen; keine Architektur-/Schemafreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069, Vorbereitungs-/Integrationsunterauftrag
**Start-/Zielprofil:** V3-Szenario ab 2027-01-04; zwölf aufeinanderfolgende operative Kalenderperioden ab Start als Testfenster. Keine Änderung der V1-/V2-Profile oder der 2019-/2027-Profile.
**Maßgebliche Entscheidungen:** D-0159 (Tagesblockierung nicht V3), D-0161 (aktueller Rechtsstand), D-0162 (V3-Basis, Snapshot und Monats-/Jahres-KPI), D-0163/D-0164 (Rechtsform-/Zusammenschlussumfang und Kandidaten), D-0165 (vorläufige V3-Steuerkomponente und 14-Tage-Zahlungsziel), D-0166 (vereinfachte Rechnungsannahme aus Netto-R), D-0102 (MRO-Szenariopfad bei fehlenden realen EZB-Daten).
**Vorgänger:** CP-0279 und CP-0280, beide ENTWURF.
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; der Arbeitsbaum enthält viele bereits bestehende Änderungen/Neudateien anderer Agenten. Diese Arbeit hat nur diese neue Vertragsdatei hinzugefügt.

## 1. Preflight und Umfang

Vor Erstellung geprüft: `AGENTS.md`; Agentenstruktur und Rechtematrix; MG-002/V3-Zielkarte; Ticket Board T-0063–T-0069; Collaboration State; Decision Log einschließlich D-0159 und D-0161–D-0164; CP-0279/CP-0280; A11-Ist-/Integrationsanalyse; A02-T-0063–0066-Verträge/Berichte; A03-T-0067-Rechenvertrag und V3-Finanzschnittstellenpaket; A09-T-0069-QA-Vorbereitung; aktueller Gitstatus.

Dieses Dokument schlägt die Reihenfolge und logische Übergabeverträge für T-0069 vor. Es ist keine Implementierung, kein Schema, kein Architekturentscheid, keine Freigabe von Finance-/Ledgerregeln und kein Nachweis eines ausgeführten Zwölfmonatslaufs. Fehlende Schnittstellen bleiben als solche sichtbar.

## 2. Gemeinsamer Laufkontext

Der bestehende A02-Integrationsvertrag nennt folgende logische Laufattribute; sie bleiben Vertragsbegriffe und sind keine genehmigten Datenbankfelder:

`runId`, `scenarioId`, `seed`, `modelVersion`, `profileVersion`, `calendarVersion`, `sourceSnapshotId`, `parameterSetId`, `currentDate`, `macroPeriod`.

Jedes Modulereignis, das in den gemeinsamen Lauf überführt wird, benötigt mindestens:

| Feldgruppe | Inhalt | Zweck |
|---|---|---|
| Runbindung | `runId`, `scenarioId`, `modelVersion`, `profileVersion`, `calendarVersion` | Verhindert Vermischung verschiedener Test-/Spielstände. |
| Ereignisidentität | `module`, bestehende modulstabile Objekt-/Event-ID, `eventType`, stabile fachliche Phase, `effectiveDate`, stabiler Sequenz-/Sortierschlüssel | Wiederholung derselben Eingabe bleibt idempotent; Änderungen werden als neues fachliches Ereignis sichtbar. |
| Provenienz | `sourceRefs`, `sourceType`, Quell-/Annahmeversion, gegebenenfalls `causedByEventId` | Trennt beobachtete Daten, Ableitungen, synthetische Werte und Hypothesen. |
| Reconciliation | Modulstatus und erwartete Folgeobjekt-Referenz; Finanzreferenz ausschließlich, wenn A03 sie autorisiert hat | Zeigt Übergaben und Blockierungen, ohne Salden außerhalb A03 zu ändern. |

Die Zuordnung wird als logische Hülle um die bereits bestehenden Modulzustände verstanden. Die Module behalten ihre Fachzuständigkeit. Ein Eintrag in der Hülle darf nicht selbst ein Modulereignis erneut anwenden. Unverfügbare Moduleingabe, Versionskonflikt, fehlende Quelle, falsche Run-ID oder unbekannter Zustand wird fail-closed als `pending`/`blocked` mit Grund behandelt; es wird kein Ersatzwert erzeugt.

### Stabile Folgeobjekte

- Makrobeiträge werden über ihre vorhandene `macroEventId` und Makroperioden-/Quellreferenzen rückverfolgt.
- Marktereignisse behalten ihre `inquiryId`, `offerId` und tatsächliche `decisionId`. Die gemeinsame Orchestrierung darf eine angenommene Entscheidung höchstens einmal zu einem Auftragsobjekt verknüpfen. Eine deterministische Folge-ID muss an der echten `decisionId` hängen; die genaue ID-Erzeugung gehört zur A02-Implementierung und muss gegen bereits vorhandene IDs validiert werden.
- Produktobjekte, Arbeitsschritte und Zuordnungen behalten ihre T-0066-IDs. Ein eigener Produktlebenszyklus darf nicht still als Ausführung eines Kundenauftrags ausgegeben werden.
- Finanzwirkung verweist auf genau ein von A03 bestätigtes Finanzereignis und dessen fachliche Quellreferenz. Eine Simulationsevent-ID oder `causedByEventId` allein autorisiert keine Buchung.

Für den integrierten Kundenauftragsfluss gilt als logische, nicht als Schemafreigabe verstandene Referenzkette: `inquiryId` → `offerId` und D-0162-Angebots-/Kalkulationssnapshot → echte `decisionId` → genau eine `workOrderId` → T-0066-Operations-/Verbrauchs-IDs → Liefer-/Empfängerabnahme-/Leistungsereignis-ID → separates Rechnungsereignis mit `invoiceId`/`invoiceSourceRef` → separates Zahlungseingangsereignis mit `paymentId`/`paymentSourceRef` → ausschließlich von A03 bestätigte Finanzreferenz. Jede Modul-ID bleibt im zuständigen Modul führend. `eventId`/`sourceRefs` aus A02 und `sourceEventId`/Finanzreferenz aus A03 müssen auf dasselbe konkrete Quellereignis abbildbar sein; sie autorisieren keine zusätzliche Mutation. Für sämtliche IDs bleibt `runId` erhalten.

## 3. Tages- und Monatsfortschreibung

Die A02-T-0063/0065/0066-Integration beschreibt diese Reihenfolge bereits als deterministischen V3-Vorschlag. Sie bleibt eine V3-Regel für den Test-/Integrationslauf und ändert keine V1-/V2-Tagesphase.

### Monatswechsel

1. Gültig werdende Quelldaten/Annahmen nach `effectiveFrom` aufnehmen; nicht verfügbare Beobachtungen bleiben fehlend.
2. Fällige, verzögerte Makrobeiträge einzeln nach Exposition, Richtung und Lag anwenden; mehrere Beiträge nur dann aggregieren, wenn eine versionierte Modellregel dafür existiert.
3. Monatsindikatoren und Phasenkandidat aus derselben versionierten Eingabemenge ableiten; Phasenstatus samt Übergangsgrund, Hysterese-/Schwellenversion ausweisen.
4. Makro-Snapshot veröffentlichen, bevor in diesem Makromonat Marktchancen neu erzeugt werden. Datenveröffentlichung darf vergangene operative Events nicht rückdatieren.
5. In der operativen Sichte Monate nach D-0162 führen; Monatsflüsse später addieren, Stichtagsgrößen dagegen separat zeigen.

### Simulationstag (Start: 2027-01-04)

| Reihenfolge | Verantwortlicher | Eingabe → Ergebnis | Vorbedingung / Fehlerverhalten |
|---|---|---|---|
| Tagesbeginn/Quelle | A02 | `currentDate`, wirksame Quellen/Parameter → gültige Tagesbasis | Ungültige Datums-/Versionsbindung blockiert den Tag; fehlende Quellen bleiben gekennzeichnet. |
| Fällige Kundenentscheidungen | A02/T-0065 | offene eingereichte Angebote mit terminierter Entscheidung → genau ein accepted/declined Ergebnis plus echte `decisionId` | Wiederholung ist no-op; abweichender Payload wird abgewiesen. Entscheidung vor Fristablauf auswerten. |
| Tagesanfragen | A02/T-0065 | Seed-/Templatezug und aktueller Makro-/Marktkontext → eingeladene, passende `inquiryId`s | Gleiche Run-/Seed-/Parameterbasis erzeugt identische Anfragen; Marktchance bleibt Anfrage, noch kein Auftrag. |
| Spieleraktionen | UI → A02/A03-Plan | offener Anfrage-/Angebots-/Planstatus und aktuelle Kalkulationsversion → validierte Angebotsabgabe oder Planänderung | Angebot bindet beim Einreichen den D-0162-Snapshot. Annahme friert Preis/Snapshot; danach kein Edit. Ungültige Annahme bleibt ohne Teilergebnis. |
| Freigabe/Arbeitsfortschritt | A02/T-0066 | bereits freigegebene Aufgabe, Datum, Skills, Vorgänger, Personal-/Maschinenzeit, Material und Lagerplatz → geplanter oder abgeschlossener Schritt | Alle Zeit-/Skill-/Kapazitäts-/Materialgates bestehen. Wiederholung des Abschlusses verbraucht Ressourcen nicht erneut. Fehlende A03-API/-Autorisierung hält nur den davon abhängigen finanziellen Bewertungs-/Posting-/Reconciliation-Handoff `pending/non-posting`; sie erzeugt **keine neue operative Produktions-Cashprüfung**. Ein operatives Cash-Gate darf nur aus einer bereits freigegebenen konkreten A03-Regel konsumiert werden. A02 erzeugt keinen Finanzersatz. |
| Kundenleistung/Abnahme | A02 + Vertragsfall | tatsächlich fertiggestellte und gelieferte Kundenarbeit sowie vom Auftrag abgeleitetes Abnahmekriterium → Lieferschein-/Empfängerereignis/Abnahmeergebnis | Kundenabnahme kommt vom Auftraggeber/Empfänger (D-0157). Kein vorhandenes Leistungs-/Abnahmekriterium oder fehlende Kundenereignis-API: `pending`, keine A03-Umsatz-/Forderungswirkung. |
| A03-Leistungs-/Bestandsübergabe | A03 nach autorisiertem Leistungs-/Abnahmeereignis | getrennte `performanceDate`, `deliveryDate` und `acceptanceDate` samt Auftragskriterium, Mengen, Einheiten, Kosten-/BAB-Snapshot und Quell-ID → A03-Status zur zulässigen Ist-/Bestands-/COGS-Wirkung | A03 bestimmt das für die Finanzperiode wirksame Ereignisdatum nach dem konkreten Vertrag. A02 setzt Leistung nicht pauschal mit Fertigstellung, Versand oder Abnahme gleich. Ohne erfülltes Kriterium, Daten, Wertebasis oder A03-API: `pending/non-posting`; kein A02-Buchungsersatz. |
| Rechnung / offene Forderung | A03 nach autorisiertem Leistungs-/Abnahmeereignis und geltendem Rechnungs-/Fälligkeitsvertrag | eigenes Rechnungsereignis mit `invoiceId`, `invoiceDate`, `invoiceSourceRef`, Rechnungs-/OP-Bezug und Vertrags-/Leistungsreferenz → A03-Status/Finanzreferenz | Rechnungsdatum und Rechnungs-ID sind getrennt von Leistungs-, Liefer-, Abnahme- und Zahlungsdaten. Die Rechnungsstellung erzeugt keinen bereits beim autorisierten Leistungsvorgang entstandenen Erlös ein zweites Mal. Keine A03-Rechnungs-/OP-API: `pending/non-posting`; keine Fälligkeit oder SimTAX-Regel durch A02 ergänzen. |
| Tatsächlicher Kundenzahlungseingang | A03 bei nachgewiesenem Zahlungseingang gemäß geltendem Finanzvertrag | eigenes Ereignis mit `paymentId`, `paymentDate`, `paymentSourceRef`, Betrag/Währung und zugehöriger Rechnungs-/OP-Referenz → A03 gleicht Forderung und Cash/Bank ab | Zahlung ist kein zweiter Erlös. Ohne tatsächliches Zahlungseingangsereignis oder A03-API bleibt der Handoff `pending/non-posting`; kein erwarteter Zahlungseingang wird als Cash gezählt. Keine neue Teilzahlungs-, Gebühren- oder Dispologik festlegen. |
| Tagesende | A02/T-0065; A03 liest | nach allen Spieler-/Entscheidungsphasen noch offene, am Datum ablaufende Angebote → expired; tägliche Modulzustände unveränderlich abschließen | Kundenentscheidung am Ablaufdatum wurde zuerst verarbeitet; danach verfällt nur ein weiterhin offenes Angebot. Replay erzeugt weder zweiten Ablauf noch zweite Buchung. |

Die übrige A02-Integrationsvertragstagesphase ist bindend für die hier beschriebene Reihenfolge. Eine fehlende Workplan-/Auftrags-/Liefer-/Finanzschnittstelle wird als Integrationsblocker ausgewiesen und nicht durch eine neue Übergangsregel verdeckt.

### Monatsende / Jahresabschluss

- A02 schließt nach Verarbeitung des letzten Kalendertags den operativen Monat und liefert monatliche Flusswerte, Makro-/SPI-Snapshotreferenzen, Ereignisprotokoll, finale Modulzustände und Status offener Posten/Bestände.
- A03 führt den Finanzperiodenabschluss und die Reconciliation aus. A02 liest das bestätigte Ergebnis und zeigt A03-Status/Referenz; es schreibt oder summiert keinen Ledgerstand selbst.
- `D-0162`: Angebots-, Kosten- und Ergebniskennzahlen gehören zum Kalendermonat; der Jahresfluss ist die Summe der zwölf Monatsflüsse. Bank, Cash, Forderungen, Verbindlichkeiten und Inventar sind Stichtagsgrößen. Makroperiode bleibt als eigene Achse referenziert.
- Ein verspätet veröffentlichter Index/Datensatz verändert nicht rückwirkend Vorperioden. Die spätere Information erhält ihren Veröffentlichungs- und Wirksamkeitsbezug; die konkrete Änderung eines offenen Plans bedarf der dafür vorgesehenen Spieler-/Fachregel.

## 4. Geschäftsfluss und Modulübergaben

| Übergang | Vorhandener Stand | Vorgesehener Handoff / was noch fehlt |
|---|---|---|
| T-0064-Gründung → V3-Lauf | T-0064 hat getrennte Rechtsträger-/Register- und Gründungszustände. GmbH & Co. KG ist als V3-Fall vorgesehen; AG/eG/GmbH & Co. KGaA bleiben explizite Vor-Release-Kandidaten. | Eine belegte betriebsbereite Rechtsträgerreferenz muss dem gemeinsamen `runId` zugeordnet werden. Kein Run darf Rechtsform/Rechtsträger aus Anzeige oder Namen ableiten; unvollständige Gründung bleibt `blocked`. Kein automatischer Finanzstartwert aus Registerstatus. |
| T-0063-Makro/SPI → T-0065-Markt | Monats-Snapshot, Phasen-/Lag-/Quellenmetadaten bestehen als isolierte A02-Funktionen. | Marktmodul liest ausschließlich den Snapshot des wirksamen Makromonats. Nachfrage-, Preis- und Kostenwirkungen nur, wo vorhandene versionierte Expositionsregeln sie zulassen; sonst keine Wirkung. Synthetische Daten bleiben als solche gekennzeichnet. |
| T-0065-Annahme → Kundenauftrag | Die Shared-Run-Runtime verknüpft eine marktbelegte Entscheidung idempotent mit höchstens einem Kundenauftrag. | Auftrag ist kein Arbeitsplan und kein Umsatz. Der T-0066-Plan muss weiterhin mit vollständigen Vertrags-/Operationsdaten eingereicht werden. |
| Kundenauftrag → T-0066-Kapazität | A02-Adapter übergibt den angenommenen Auftrag an den separaten Kundenfertigungsplan und prüft dessen Personal-/Maschinen-/Materialkapazitäten. | Planwerte müssen explizit aus Vertrag/Spielerplanung stammen. Keine Ableitung von Skill, Zeit oder Material aus Marktanforderungen; keine Umdeutung eines Eigenprodukts. |
| Fertigstellung → Lieferung → Abnahme | Lieferung und Kunden-/Empfängerentscheidung werden getrennt protokolliert. Nach D-0157 beginnt die F3-Spieluhr am Tag nach vollständiger Lieferung; der Liefertag zählt nicht. | Bis zum Ende des fünften folgenden Arbeitstags kann eine explizite Kunden-/Empfängerentscheidung erfasst werden. Liegt bis dahin keine vor, erzeugt Phase 6 beim Tagesabschluss ein deterministisches kunden- bzw. bevollmächtigten-empfängerseitiges F3-Annahmeereignis. Wochenenden zählen nicht; es gilt der aktuelle V3-Laufkalender (Montag–Freitag). Dies ist eine Produkt-/Vertragskonvention, keine allgemeine BGB-Rechtsfolge oder gesetzliche Abnahmefiktion. Das Ereignis bleibt nichtbuchend; keine Rechnung, Forderung oder sonstige A03-Wirkung ohne getrennte Freigabe. Vertragskriterien/-partei, Plan, Lieferung, Datum und Autoritätsreferenzen bleiben gebunden. |
| A03-Perioden-/Finanzfluss | A03 stellt D-0162-Kalkulation, BAB und reine Berechnungs-APIs bereit. Das Finanzpaket gibt Spiel-KLR-Grenzen vor, aber keine gemeinsame Event-/Ledgerengine in dieser V3-Integration. | A03 muss für jeden autorisierten tatsächlichen Eventtyp explizit bestimmen, ob und wie eine A03-Istwirkung entsteht, welches konkrete Ereignisdatum die Periode bestimmt, welche Quellreferenz Duplikate verhindert und was bis dahin blockiert bleibt. Rechnung und Kundenzahlung bleiben separate Handoffs. Ohne das bleibt der jeweilige Handoff `pending/non-posting` und Finanzreconciliation NONPASS. |
| T-0068-Lernen | A06/A05 liefern ein read-only-Prozessobjekt anhand aktuell verfügbarer Marktprojektion; fehlende spätere Prozesszustände werden als unverbunden angezeigt. Der Katalog von 50 Eventfragen besitzt noch keine V3-Runtime-/Antwortwirkung. | Lernobjekt erhält nur Verweise auf vorhandene `runId`-/`eventId`-/`inquiryId`-/`offerId`-/Kompetenz-ID. Neutraler Zugriff mutiert nichts und blockiert keinen Tag (D-0159). Eventfragen benötigen erst katalogisierte Items/Kompetenz-/D-0147-Wirkungszuordnung und eine gemeinsame Run-/Lernintegration. |

## 5. Fehler-, Replay- und Konfliktverhalten

1. Einmalige Verarbeitung wird pro Modulereignis an dessen stabile ID/Version gebunden. Zusätzliche `processedEventIds`/Sequenzwerte müssen im Run-Protokoll konsistent gegen die Modulzustände geprüft werden; ein Replay repariert keine beschädigte Teilhistorie, sondern lehnt sie ab oder setzt den Lauf in `needs_review`.
2. Modulübergaben sind atomar im Sinne des fachlichen Zustandswechsels: Vorbedingung und Zielzustand werden gemeinsam validiert. Ein fehlgeschlagener Folgeschritt hinterlässt keine halbe Auftragserstellung und keine verwaiste A03-Quellreferenz.
3. Gleicher Lauf, gleiche Versionen, Quellen, Parameter, Kalender, Seed und Reihenfolge müssen identische fachliche Events, IDs und Ergebnisprojektionen liefern. Unterschiede zeigen zuerst den ersten divergierenden Event mit Eingabehash und Modulstatus.
4. Unterschiedliche Makro-/operative Periode, veralteter Preis-/BAB-Snapshot, nicht passende Einheit, fehlender Kundenstatus, bereits verbrauchtes Material oder doppelte Finanzreferenz sperrt nur den abhängigen Schritt, nicht die Quellhistorie.
5. `blocked`, `pending` und `failed` bleiben unterschiedliche Zustände: fehlender Fachvertrag = pending; erfüllbare aber derzeit fehlende Ressource = blocked; invalides Replay/inkonsistenter Event = failed/needs_review. Eine bloße Finanz-/Makroanzeige darf keinen Zustand als erfolgreich umetikettieren.

## 6. Mindestszenarien und Fixtures

Die in der A02-Integration vorhandenen Fixturefamilien sind der Ausgangspunkt, keine empirische Kalibrierung und keine neuen Produktdefaults:

- `CYCLE-{UPSWING,BOOM,DOWNTURN,LOW}` je `LOW/BASE/HIGH`: vorhandene Testvektoren (Trendindex 100; Phasenaktivität t−1/t je Fixture; daraus berechnete Gap/Momentum). Diese Zahlen testen Formeln und keine Phasenschwellen.
- `MRO-FUTURE-{LOW,BASE,HIGH}`: bestehende reine Testannahmen (SPI-Inflation 1/2/3 %, Spread 2 Prozentpunkte, 36 Monate, Lag 1, Quote 30 Tage). Keine Markt-/Bankdaten oder realen Konditionen.
- `EXTERNAL-{FX,EXPORT,DELIVERY}-{LOW,BASE,HIGH}` und `POLICY-{8-CATEGORIES}-{LOW,BASE,HIGH}`: jede Einwirkung bleibt einzeln exponiert, mit Zielgröße, Lag/Gegeneffekt/Quelle; unexponierte Kontrollen bleiben gleich.
- `MARKET-{LOW,BASE,HIGH}`: Verhältnis `R/R_ref` 0,90/1,00/1,10 ist bloß dimensionsgleicher Testinput; es setzt keine Zuschlagswahrscheinlichkeit.
- `PRODUCT-{LOW,BASE,HIGH}`: vorhandene test-only Kombination von Zeit/Material (LOW 0/0, BASE 4 h/1 Einheit, HIGH 8 h/2 Einheiten); Cash nur als A03-Übergabe, keine Finanzwirkung aus Plan.
- `INTEGRATED-V3-{SEED-A,SEED-B,SEED-C}`: gemeinsame Lauf-/Replayfamilie laut Vertrag. Sie erfordert die gleiche V3-Profilbasis und versionierte Parameter.

T-0069 mindestens:

1. Je ein reproduzierbarer, zwölf aufeinanderfolgende Kalendermonate umfassender End-to-End-Run für `UPSWING`, `BOOM`, `DOWNTURN`, `LOW` ab demselben V3-Profilstart. Jeder Event und jeden Monatsabschluss durch eine feste, dokumentierte Seed-/Versionsbasis rückspielbar machen. Für mindestens einen dieser Läufe denselben Seed zweimal ausführen und Hash/IDs/Periodenabschluss vergleichen.
2. Je Lauf explizite niedrige/grundlegende/hohe Sensitivitätsfälle nur aus den oben aufgeführten, vorhandenen Testfamilien wiederverwenden. Kein unvalidierter Koeffizient, realistischer Werkstattpreis oder Marktanteil wird aus dem Testvektor abgeleitet.
3. Ein tragfähiger und ein erklärbarer wirtschaftlich scheiternder Lauf muss durch A03 auf finanzieller Basis und A02 anhand der Ereignisfolge begründet werden. Ist dazu ein nicht vorhandener Parameter nötig, vor Test als synthetischer, versionierter Testinput offen deklarieren und von den Fachrollen reviewen lassen; kein stilles Markt-/Produktdefault.
4. Für jeden erfolgreichen Lauf: Monatssummen der Flüsse + A03-Reconciliation; Stichtagssalden gesondert. Für Nonposting/Planereignisse müssen Cash-/OP-/Ledger-Salden unverändert bleiben. Replay-/Dedupe muss alle Finanz- und Operationsreferenzen genau einmal zählen.
5. Komponenten- und Gegenproben aus `INT-01`–`INT-08` des A02-Vertrags weiterverwenden. Testfälle müssen blockierte und erfolgreiche Ressourcenpfade enthalten; keine Ressource doppelt reservieren.

## 7. Konfliktmatrix gegen A11 und A03

| Thema | Befund | Klassifikation | Verantwortlicher nächster Schritt |
|---|---|---|---|
| Gemeinsamer `runId`/Zeitkontext | A02-Vertrag verlangt logische Runfelder; A11 findet sie noch nicht integriert. | **Keine Regelkollision; fehlende gemeinsame Runtime/Orchestrierung.** Dieses Dokument konkretisiert nur die Choreografie. | A02 schreibt Wrapper-/Adapteraufgabe und prüft Run-/Eventbindung; A05 nutzt dieselbe aktive Laufreferenz. |
| Entscheidung → Auftrag | A02 Vertrag setzt eigene `decisionId` voraus, aktuelle sichere Spielerview zeigt Status/Outcome und `decisionDate`, jedoch nicht sicher die Quellentscheidung-ID an downstream. | **Feld-/API-Verbindungslücke; keine Semantikkollision.** | A02 prüft und exponiert eine echte, stabile Server-/Laufreferenz außerhalb redigierter Wettbewerbsdaten; für Accepted höchstens ein Auftrag. |
| Kundenauftrag → T-0066 | T-0066 ist Produktlebenszyklus, nicht Kundenfertigungsplan. | **Scope-/Adapterlücke; kein Regelkonflikt.** | A02 muss Kundenworkorder/operations von Eigenprodukt-steps unterscheiden und Workplan-/Lieferzustand liefern. |
| Produktbestand/COGS/Umsatz | A03 fordert reale, einmalig belegte Quelle; Produktmodule erzeugen keine Ledger-/Verkaufsbuchung. | **Bewusste Finance-Grenze; keine Regelkollision.** | A03 autorisiert jeden Finanz-/Wertübergang; A02 liefert echte Mengen/Termine/IDs; andernfalls nonposting/pending. |
| Cash-Gate | Keine autorisierte Verfügbarkeits-API aus A03 in T-0066. A11 nennt das als blocker für produktive Freigabe. | **Offene Finance-Schnittstelle; kein Codefehler.** | A03 muss vor Implementierung Cashprüfung und Wirkung bestimmen; A02 konsumiert nur dessen Ergebnis. Keine Dispo/Kreditregel ergänzen. |
| Lernendzweige / Prozessroute | Die vorherige JSON-/Berichtsabweichung wurde behoben und A03/A09 reviewed; Endzweige bleiben read-only. | **Historischer Konflikt behoben.** | Nur mit vorhandenen Runreferenzen anzeigen. |
| Fragen-/Eventwirkung | D-0147 generische nicht-finanzielle Tageswirkungen; T-0068 hat 50 Textitems ohne konkrete item-spezifische Runtimezuordnung. | **Fehlende Lernruntime-Verknüpfung, keine bestätigte Regelkollision.** | A06/A02/A05 ordnen bestätigte D-0147-Ziele über stabile Event-/Kompetenzreferenzen zu; D-0159 verbietet Tagesblockade als V3-Gate. |
| Rechtsformkandidaten | GmbH & Co. KG im V3-Fall; AG/eG/GmbH & Co. KGaA Entscheidung vor Release. | **Offener Release-Gate, kein akuter T-0069-Runwiderspruch**, sofern akzeptierter Rechtsträger fixiert ist. | A08 Rechtsaktualität vor V3-Release/Entscheidungszuordnung; Nutzerfreigabe bleibt für Kandidatenaufnahme. |
| Preis-/Makrokalibrierung | Quellenstatus und synthetische Testinputs getrennt. | **Datenkalibrierungslücke, kein Konflikt.** | A08 und A02 müssen observed/synthetic/hypothesis markieren; reale Preise nicht behaupten. |

## 8. Integration/Review Handoffs

1. **A02 + A03** gleichen diesen Run-/Ereignisvertrag gegen A03-Vorgangsereignisse ab. A02 verantwortet Datum, Phase, Output und `sourceRefs`; A03 allein Posting-, Cash-, Forderungs-/Bestandswert und Reconciliation. Jede Lücke vor Implementierung explizit als A03-Fachentscheidung oder A02-Eventinterface führen.
2. **A02 implementiert danach** nur den gemeinsamen Runcontext, Orchestrierung und operative Handoffs. Keine UI-Lernlogik, keine Accountingregeln, kein neues Schema.
3. **A03 liefert/prüft** autorisierte Ist-Finanzflüsse und Monats-/Stichtags-Reconciliation; wenn konkrete Fälligkeit/Leistung/Bestandsbasis fehlt, bleibt Status gesperrt und A03 gibt einen Vorschlag an A01.
4. **A05 integriert** alle bestehenden Einzelrouten auf denselben aktiven Run und zeigt modul- oder vertragsseitig fehlende Zustände ehrlich an. Keine Fixture-Route darf als derselbe Live-Run ausgegeben werden, solange sie nicht gebunden ist.
5. **A06/A07** ergänzen nach stabiler Run-/Event-ID-Bindung Lern-/Fragenreferenzen nach D-0147, ohne Tagesblockierung oder Finanzwirkung. **A09** prüft jeden Schritt separat und führt erst nach den Fachfreigaben die Jahrestests; **A12** macht danach die Browser-/Mobilübergabe.

## 9. Konflikt-/Reviewzusammenfassung und Nachweisrollen

- **Echte aktuelle Produktregelkonflikte:** in den geprüften T-0063–0068-Verträgen gegenüber D-0159, D-0161–D-0164 nicht festgestellt. Der dokumentierte T-0068-A06-JSON-Branch-Widerspruch ist inzwischen korrigiert und von A03/A09 reviewed.
- **Fehlende Schnittstellen:** A03-autorisierte Leistungs-/Bestands-/Cash-/Ledgerwirkung, Rechnung/OP, Zahlungseingang, Reconciliation und unabhängige End-to-End-/Jahres-QA bleiben offen. Die A02-Liefer-/Empfänger-Handoffs sind implementiert, aber fachlich durch A03 und unabhängig durch A09 zu prüfen. Diese Lücken verhindern derzeit den T-0069-Gesamt-PASS.
- **Noch zugewiesene Produkt-/Finanzentscheidung:** A03 muss die explizite zulässige Cash-/Postingwirkung liefern; nicht durch A02 vorwegnehmen. Aus diesem Vorschlag folgt keine nutzerseitige Frage, solange Fachagenten innerhalb bestehender A03-Autorität bleiben; falls eine neue Nutzerfreigabe nötig wird, zuerst über A01.

**Ausführung:** A02 hat diesen Vertrags-/Choreografieentwurf erstellt.
**A02-Fachselbstreview:** grober Abgleich gegen A02-Phasen-/ID-/D-0159-Grenzen und A03-Vorgangs-/D-0162-Vertrag; kein Regelkonflikt festgestellt, Integrationslücken sind separat aufgeführt.
**Fachreview A03:** nicht ausgeführt; ausdrücklich benötigt vor Finance-Integration.
**Unabhängige QA A09:** nicht ausgeführt; `INT-01`–`INT-08` sind Testanforderungen, keine Testbehauptung.
**Browser-/Gerätetest:** nicht ausgeführt; kein UI-Code verändert.
**Git-Verifikation:** bestehender `main`-Branch, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; breite bestehende Änderungen unberührt. `git diff --check` und manueller Whitespacecheck der neuen Datei auszuführen.
**Commit/Push:** keiner.

## Laufzeitfortschreibung nach CP-0303 – Lieferung/Abnahme als getrennte Handoffs

Die vorstehenden Tabellen beschreiben den Vertragsentwurf zum damaligen Stand. Die aktuelle A02-Run-Runtime implementiert jetzt eine enge nichtbuchende Lieferung und einen getrennten Auftraggeber-/Empfängerentscheid:

- `deliverV3RunCustomerWorkOrder(state, input)` verlangt einen angenommenen, vertraglich gebundenen Kundenauftrag, dessen T-0066-Operationen vollständig abgeschlossen sind (`ready_for_delivery`). Der explizite Input bindet Liefer-ID/Quell-ID, Lieferdatum, Empfängerpartei, vereinbarte Leistungskriterien, Abnahmekriterium, Menge und Einheit an die Vertragsdaten und Marktentscheidung. Ergebnisstatus: `delivered_pending_customer_decision` / `pending_non_posting`.
- `recordV3RunCustomerAcceptanceDecision(state, input)` verlangt ein vorhandenes Lieferereignis und eine explizite `customer`- oder `recipient`-Rolle. `customer` muss auf die aus der Marktanfrage abgeleitete Kundenpartei gebunden sein. Ein abweichender `recipient` benötigt Vertrags- und Eventbindung von `authorizedForRef` sowie `partyAuthorityRef`; die Verkäufer-/Spielerpartei kann nie als Kundenakteur entscheiden. Das protokollierte Ergebnis kann `accepted_non_posting` oder `rejected_non_posting` sein; beide Fälle bleiben `pending_non_posting`.
- Stabile Event-IDs, Eingabe-Fingerprints, eindeutige Quellreferenzen und Restore-Bindungen gegen Angebot, Entscheidung, Work Order, Vertragssnapshot, T-0066-Plan, Kriterien, Partei und Datum sichern Dedupe und fail-closed Zustandskonsistenz. Identischer Replay ist No-op; abweichender Payload, zu frühe Lieferung, unberechtigte Abnahme und zusätzliche Lieferung/Entscheidung werden abgewiesen.

Diese Handoffs mutieren keine Produktoperationen/-bestände, Auftragsstatus oder A03-Finanzobjekte. D-0157 F3 wird am fünften folgenden Arbeitstag in Phase 6 als automatisches Kunden-/Empfänger-Szenarioereignis protokolliert, wenn bis zum Tagesabschluss keine Kundenentscheidung einschließlich Ablehnung erfasst wurde. Der Verkäufer löst dieses Ereignis nicht aus. Die Automatik ist eine Spielregel, keine allgemeine Rechtsfolge und keine Aussage, dass die Voraussetzungen einer gesetzlichen Abnahmefiktion erfüllt sind. Es entstehen daraus keine Umsatz-, Forderungs-, Rechnungs-, Zahlungs-, Cash-, COGS- oder Ledgerwirkungen; der Finanzhandoff bleibt pending/non-posting. Eine JSON-Restaurierung muss die Ereignisbindung an Kunde/Vertrag/Empfänger, Termin und Kriterium erneut validieren. Vollständige Herkunftsauthentizität eines ausschließlich lokalen Browserzustands wird nicht behauptet.

**F3-Laufzeitstatus nach CP-0314:** Der A09-Re-Review des D-0157-F3-Pfads ist PASS. Regressionen decken fünften folgenden Arbeitstag, ausgeschlossenen Liefertag, Wochenenden, Tagesabschlussphase, zuvor erfasste Kundenentscheidung, Verkäuferrollen-Abweisung, Replay und Nichtbuchung ab. JSON-Restore und automatisches F3 für einen vertraglich bevollmächtigten Alternativempfänger werden in der aktuellen Folgeergänzung gezielt nachgewiesen. Die F3-Automatik erzeugt keine Finance-Bridge.

### Nächster Schritt an A01

Die A02-F3-Implementation und das unabhängige A09-Re-Review sind abgeschlossen (CP-0314/CP-0315; A09-Bericht). Ein separates A03-Review dieser F3-Ergänzung wurde nicht ausgeführt; F3 bleibt von Finanzwirkung getrennt. D-0165 legt 19 % als begrenzte V3-Szenariokomponente bis V5 und 14 Kalendertage für V3-Kunden-/Lieferantenposten fest. D-0166 autorisiert für V3 nach positiver belegter Kunden-/Empfängerentscheidung eine einzelne Rechnungsposition aus dem eingefrorenen Netto-R; Rechnungsdatum ist das Entscheidungsdatum. `getV3RunCustomerEvidence(state, workOrderId)` liefert vorhandene, quellengebundene Arbeitsgang-, Liefer- und Kundenentscheidungsdaten einschließlich Netto-R in Cent, `EUR`, OfferSnapshot- und Submission-Event-Referenz read-only. Der Handoff erzeugt weder eine Rechnungsposition/ein Rechnungs- oder Zahlungsevent noch eine Steuer-/Fälligkeitsberechnung; diese finanzielle Verarbeitung bleibt A03 vorbehalten. Siehe [A02 Customer-Evidence-Handoff](a02-t0069-v3-customer-evidence-handoff-arbeitsbericht.md). A01 hat den Rechnungsauslöser und die einzelne Netto-R-Position mit D-0166 festgelegt. Folgearbeit ist die A03-seitige Erstellung des Finanzereignisses anhand dieses Handoffs, danach Jahres-/Cash-/Bestandsreconciliation und Gesamt-QA; A02 erzeugt selbst weder Rechnung noch Finanzwirkung.

## Laufzeitfortschreibung nach CP-0304 – Identitäts- und Vertretungsbindung

Work Orders speichern die `customerPartyId` aus der Marktanfrage. Die Marktengine validiert diese ID gegen das gespeicherte Wochentemplate; A02-Runvalidation leitet die erwartete Partei aus der akzeptierten Anfrage ab und prüft sie in Work Order und Vertragssnapshot. Der Vertrag kann keinen alternativen Kunden einsetzen.

Kundenentscheidungen binden `customerRef`, `actorRole`, `actorPartyId`, `authorizedForRef` und `partyAuthorityRef` in Nutzlast, Run-Historie, Fingerprint und Restoreprüfung. Beim direkten Kundenfall stimmen Kunde, `customerRef` und Akteur überein; die beiden Vertretungsfelder sind null. Beim Empfängerfall stimmen Kundenreferenz und autorisierte Vertretung mit der gebundenen Kunden-ID überein und die `partyAuthorityRef` wiederholt exakt die nichtleere Vertragsreferenz. Der Spieler-/Verkäufer-Firmenschlüssel wird als Akteur ausgeschlossen. Fehlende oder abweichende Identitäts-/Autoritätsbindung scheitert geschlossen.

Diese Prüfung sichert strukturelle Konsistenz und Replay im lokalen Simulationszustand. Sie authentifiziert keine externe Vollmacht/Unterschrift und schützt nicht kryptografisch vor koordinierten Änderungen aller lokalen Kopien. Keine Finance-, Ledger-, Rechnungs-, Zahlungs-, Lager- oder automatische Rechtswirkung wurde ergänzt. A03 und A09 müssen den Fix unabhängig erneut prüfen; A05 bleibt bis dahin gesperrt.
