# A08 – T-0063 L2 Außenwirtschaft: kleinster nächster Integrationsschritt

**Status:** Quellen- und Modellvorschlag, read-only; keine Parameterfreigabe  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Goals/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063  
**Profil:** V3 Shared Run, Start 2027-01-04  
**Entscheidungen:** D-0161–D-0169, besonders D-0162, D-0163 und D-0169  
**Vorgänger:** A08 CP-0351; A02 CP-0368/CP-0371; A09 CP-0367/CP-0370/CP-0372; CP-0416  
**Git-Basis:** `main@8b72b7e`; vorgefundene lokale Änderungen und ungetrackte Dateien anderer Arbeitspakete blieben unangetastet.

## Ergebnis in Kürze

Der aktuelle L2-Außenwirtschaftspfad ist replaygebunden und nichtbuchend, macht Außenwirtschaft aber noch nicht zu einer tatsächlichen Betriebsgelegenheit: `foreign_demand` liefert eine nachträgliche Projektion erwarteter Segmentanteile für schon vorhandene Wochenpläne. Marktanfrage-Templates und deren Segmentzuordnung werden nicht geändert. Die Anzeige kann daher einen erwarteten Exportanteil zeigen, ohne dass sich die vom Betrieb tatsächlich bearbeitbaren Anfragen oder ihre Kapazitätsanforderungen ändern.

Der kleinste sinnvolle nächste Schritt ist, dieselbe begrenzte Projektion am Erzeugungspunkt der D-0169-Marktvorlagen anzuwenden: D-0169 bestimmt zuerst die Zahl `N` der Wochenanfragen; L2 verteilt anschließend genau diese `N` Slots deterministisch auf vorhandene Marktsegmente. Es werden keine zusätzlichen Anfragen erzeugt. Nur ausdrücklich als exportfähig und für den Betrieb exponiert markierte Segmente dürfen ihren Anteil ändern. Bei fehlender Exposition bleibt die Zusammensetzung neutral.

Das ist ein Modellvorschlag für einen sichtbaren Nachfrage-/Kapazitätskanal, keine Behauptung über eine tatsächliche Exportneigung des simulierten Kleinbetriebs oder eine empirisch geschätzte KMU-Elastizität. Es ändert weder Angebotserfolg noch Vertrag, Preis, Umsatz, Bestand, Beschaffung, Finanzierung oder Buchhaltung.

## Quellen und Provenienz

Destatis ermittelt monatliche Auftragseingänge als Wert fest akzeptierter Aufträge und trennt dabei Inland und Ausland; die Erhebung umfasst die einschlägigen Industriebetriebe ab 50 Beschäftigten. Destatis stellt Wert- und preisbereinigte Volumenindizes sowie Auslandsaufträge nach Euro- und Nicht-Eurozone bereit. Das ist ein geeigneter institutioneller Bezug für die Richtung und Beobachtung einer Auslandsnachfragekomponente, aber keine repräsentative Messung von Aufträgen, Exportexposition oder Elastizität eines einzelnen Münchner Kleinbetriebs. Der Auftragseingangsindex ist zudem volatil und kann von Großaufträgen beeinflusst werden.

- [Destatis: Auftragseingangsindex im Verarbeitenden Gewerbe – Methodik](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Industrie-Verarbeitendes-Gewerbe/Methoden/Erlaeuterungen/auftragseingangsindex.html)
- [Destatis GENESIS: Auftragseingang nach Absatzrichtung, darunter Euro-/Nicht-Eurozone](https://genesis.destatis.de/datenbank/online/statistic/421%2A/table/42151-0002)
- [Deutsche Bundesbank: Auftragseingang und -bestand](https://www.bundesbank.de/de/statistiken/konjunktur-und-preise/auftragseingang-und-bestand/auftragseingang-und-bestand-772870)

Die obigen Quellen stützen Definition, Absatzrichtung und Periodizität des Indikators. Sie liefern keinen betriebsindividuellen Koeffizienten. Die bereits dokumentierten Werte `±5 Prozentpunkte` und `Lag 1 Monat` aus `V3-L2-EXPORT-SHIFT-5PP-LAG1` bleiben ausdrücklich synthetische Test-/Szenariowerte. Sie dürfen nicht als empirisch geschätzte Marktreaktion, Branchenregel oder Prognose bezeichnet werden. Im Runtime-Trace müssen Quelle/Quellenreihe und Szenarioparameter getrennt stehen.

## Vorgeschlagene Modellgrenze

| Element | Vorschlag für den nächsten Schritt |
|---|---|
| Definition | Auslandsnachfrage verändert im Folgemonat ausschließlich die Segmentzusammensetzung der vorhandenen D-0169-Wochenanfragen. |
| Trigger / Exposition | Wirksames, replayvalidiertes `foreign_demand`-Monatsereignis plus explizite Betriebs-/Marktexposition und Referenz auf bereits vorhandene, exportfähige Segment-IDs. Fehlende oder leere Exposition ist neutral. Keine automatische Annahme, dass jedes Unternehmen exportiert. |
| Reihenfolge | Zuerst D-0169 berechnet/erzeugt `N` Anfragen. Danach teilt L2 dieselbe feste Zahl `N` auf Inland- und exportfähige Segmente auf. L2 darf den Gesamtwert nicht mit einem zweiten Mengenfaktor multiplizieren. |
| Lag | Ein Simulationsmonat ab Beobachtungsmonat, wie in der bestehenden synthetischen Export-Fixture. Quelle `observedPeriod`, Modell-`effectivePeriod` und Lag werden separat gespeichert. |
| Allokation | Ganzzahlige, deterministische Allokation auf tatsächlich erzeugbare Anfrage-Templates, mit stabiler Seed-/ID-Tie-Break-Regel. Vorher und nachher gilt exakt `Σ segment inquiry count = N`. Keine fractional „Teil-Anfragen“ im tatsächlichen Marktobjekt. Erwartungswerte können separat als Projektion angezeigt werden. |
| Messbare Betriebsgröße | Tatsächliche Zahl der erzeugten Anfragen je Segment sowie daraus gemäß bestehenden Anfrage-Templates abgeleitete angeforderte Fachstunden/Kapazität. Keine monetäre Größe. Die Kapazitätsgröße wird nur angezeigt bzw. in den vorhandenen Planungsfluss übergeben; sie reserviert keine Ressource. |
| Konflikt / Zielabwägung | Bei fixer Gesamtmenge ersetzt ein höherer Exportanteil Inlandanteile. Exportsegmente können andere Skills, Durchlaufzeiten oder Kapazitäten verlangen. Nachfrage bedeutet weder Zuschlag noch wirtschaftliche Eignung; Wettbewerbs-, Angebots- und Kapazitätslogik bleiben separat. |
| Grenzen | Keine KMU-Elastizität, keine individuellen Exportdaten, keine Wechselkurs-/Transport-/Zollwirkung, kein FX-/ETA-Anschluss ohne echte operative Importplanung bzw. Bestellung, keine Buchung/Finanzwirkung. Die bestehende Makro-Projektion ist kein Beobachtungsfeed. |

Damit wird die bestehende Außenhandelsprojektion operational enger und überprüfbar, ohne den D-0169-Gesamtpfad zu verdoppeln. Die konkrete Wahl, welche Segmente exportfähig sind und welche Betriebs-Exposition gilt, muss aus versionierten, vorhandenen Run-Eingaben stammen. Fehlt eine solche Eingabe heute, soll die Wirkung neutral bleiben, bis A02 eine explizite Szenarioexposition als vorhandene Run-Eingabe bereitstellt; keine neue Produktannahme wird hier festgelegt.

## Reicht die vorhandene L2-Projektion?

Für einen isolierten, nichtbuchenden Erwartungs-/Planhinweis: ja. A02 CP-0368 dokumentiert `afterExpectedSegmentCounts`, den Einmonatslag, ±5 Prozentpunkte als synthetische Fixture, gleichbleibende D-0169-Gesamtmenge und Save/Restore-Replay; A09 CP-0370/0372 prüfte die Herkunfts-/Nichtmutationsgrenzen, wobei CP-0372 für den FX-Provenienzpfad PASS meldet.

Für eine sichtbare und im Shared Run reproduzierbare Betriebswirkung: noch nicht. Die Projektion läuft über schon erzeugte `schedule_week`-Templates und ändert nicht die tatsächlichen Anfrageobjekte. Sie kann damit weder den Anfrage-Mix im Postfach noch die aus realen Templates folgende angeforderte Arbeitskapazität verändern. Zusätzlich ist die aktuelle Standardausführung ohne explizite L2-Exposition neutral. Der vorgeschlagene Runtime-Schritt schließt nur diese Differenz; er behauptet keine weitergehende Export-/Finanzintegration.

## Akzeptanz- und Gegenproben für die spätere Runtime-Umsetzung

1. **Neutralität:** Ohne wirksames Ereignis, mit Null-/fehlender Exposition oder unbekannten Segment-IDs bleiben dieselben Anfrage-Templates und deren Mix erhalten.
2. **D-0169-Summenwahrung:** Für jede Woche ist die Anfragezahl vor/nach L2 exakt `N`; D-0169 bleibt alleiniger Gesamtmengenfaktor. Teste insbesondere D-0169-Faktoren am unteren/oberen Cap.
3. **Scope:** Nur explizit exportfähige, im Run vorhandene Segment-IDs dürfen sich ändern. Keine unbekannten Segmente oder Phantom-Anfrageobjekte.
4. **Lag und Zeitraum:** Januarereignis wirkt nicht im Januar, sondern frühestens im ausgewiesenen Februar-Effektzeitraum. `observedPeriod`, `effectivePeriod`, Lag und Effektgruppen-ID bleiben nachvollziehbar.
5. **Determinismus:** Gleicher Run, Seed, Fixture, Quellen-/Modellversion und dieselben Eingaben ergeben identische Anfrage-IDs, Segmentzuordnungen und Kapazitätsanforderungen; Save/Restore reproduziert das Ergebnis.
6. **Template-Konsistenz:** Segmentwechsel erzeugt ein valides vorhandenes Anfrage-Template mit konsistenten Skills, Arbeitsstunden und Vertrags-/Währungsmetadaten. Er darf kein Angebot, Zuschlag oder Work Order erzeugen.
7. **Nichtbuchung:** `R`, Angebote, Verträge, Kundenentscheidung, Bestand, Beschaffung, FinanceState, Cash, OPs, Ledger und BAB bleiben gegenüber neutraler Kontrolle unverändert.
8. **Synthetische Kennzeichnung:** UI/Trace zeigt Szenarioannahme und erwartete bzw. tatsächlich erzeugte Anfragezusammensetzung getrennt; keine Anzeige als beobachtete Firmen-/Markt-Elastizität.
9. **Adversarialität:** Doppelte Effektgruppe, veralteter Snapshot, koordinierte Segment-/Exposure-/Template-Manipulation, abweichende Periodenbindung und ungültige Restore-Payloads werden fail-closed abgewiesen.

## Nächste Adressaten

- **A02 – Runtime:** als nächste Aufgabe nur die D-0169-Erzeugungsstelle identifizieren und eine nichtbuchende, seedstabile Integer-Umverteilung innerhalb der vorhandenen Gesamtanfragenzahl vorlegen/implementieren. Vorhandene Segmentdefinitionen und Run-Exposition verwenden; solange keine geeignete Exposition vorliegt, neutral bleiben. Keine FX-/ETA- oder Finanzbuchungsintegration in denselben Schritt aufnehmen.
- **A03 – Accounting/Finance:** fachlich bestätigen, dass tatsächliche Segmentanfragen und angeforderte Kapazität reine Markt-/Planungsdaten bleiben und keine Vertrags-, Leistungs-, Forderungs-, Steuer-, Bestands- oder Buchungswirkung auslösen; Perioden- und Nichtmutationsreview anhand der späteren A02-Evidenz.
- **A05 – Frontend:** erst nach stabiler A02-Ausgabe anzeigen. Segmentmix, Effektmonat, Quelle/Szenariokennzeichnung und angeforderte Kapazität sichtbar machen; Projektion und tatsächliche erzeugte Anfragen dürfen nicht vermischt werden.
- **A09 – QA:** nach A02/A03 unabhängig die Akzeptanz- und Gegenproben einschließlich Save/Restore, D-0169-Summenerhalt, kein Zuschlag/keine Buchung und neutraler Kontrollgruppe ausführen.

Diese Übergaben sind Vorschläge an A01. Dieser Bericht weist keine Agentenaufträge aus und trifft keine neue Produkt-, Parameter-, Finanz- oder Schemaentscheidung.

## Ausführung und Grenzen

Preflight: Governance/AGENTS.md, Agentenstruktur und Rechte, Goals, Ticket Board, Collaboration State, Decision Log, aktive V3-Spezifikationen und CP-0416 wurden geprüft. Einschlägige Belege: A08 CP-0351, A02 CP-0368/CP-0371, A09 CP-0367/CP-0370/CP-0372, A02 T-0065 Marktmodell und T-0069 Run-Choreografie. Die offizielle Destatis-/Bundesbank-Quellenbasis wurde für diese Modellbewertung aktuell online verifiziert. Es wurde kein Code geändert und keine Test- oder Browserausführung vorgenommen. Bestehende Änderungen blieben unangetastet. Kein Commit/Push.
