# A08 – T-0063 Beobachtungsprovenienz: Quellenreview

**STATUS:** A08-Provenienzreview und Re-Review der A02-Runtimekorrektur abgeschlossen; unabhängiger A09-Re-Review ausstehend
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A08 – RESEARCH
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0063
**Prüfdatum:** 2026-10-31
**Checkout:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Auftrag und Grenze

Read-only-Klärung von A09s Provenienzwarnung: Welche Herkunftsfelder sollen für beobachtete Aktivitäts-/BIP-Werte und beobachtete SPI-Komponenten vorhanden sein, was gilt für synthetische Werte, und welche Zeitfelder braucht die Datenherkunft? Keine Runtime-, Produkt-, Architektur- oder Datenbankänderung; keine neue Produktregel oder empirische Kalibrierung.

## Befund

A09s Warnung ist fachlich berechtigt und steht im Einklang mit dem bestehenden Vertrag. A02s T-0063-Vertrag fordert für beobachtete Quellenwerte ausdrücklich **Quelle, Veröffentlichungsdatum, Beobachtungsperiode, Einheit und verfügbare Revisionsversion**. Zusätzlich verlangt er eine Trennung von `observedPeriod`, `observedAt`, `publishedAt` und `effectiveFrom`. A08s Provenienzmatrix verlangt Quellperiode, Veröffentlichungsdatum und verwendeten Datenstand. Die aktuelle Runtime darf beobachtete Aktivität dennoch ohne diese Angaben annehmen; SPI-Komponenten tragen bisher keine eigene Beobachtungsperiode/-veröffentlichung. Das ist daher eine Vertrags-/Validierungslücke, nicht eine offene fachliche Grundsatzentscheidung.

## Empfehlung für Felder

| Datenart | Erforderliche Provenienz | Zeitfelder und Bedeutung |
|---|---|---|
| Beobachteter Aktivitäts-/BIP-/Produktionswert | `sourceType=observed`; präziser `sourceRef` (Reihe/Tabelle, Kennzahl und erforderlichenfalls Dimension/Region); `value`; `unit`; `observedPeriod`; `publishedAt`; genutzter `dataVintage`/Revisionsstand bzw. dokumentierter Abruf-Snapshot; Herkunft/Transformation, falls aus mehreren Quellen abgeleitet | `observedPeriod` ist der fachliche Berichtszeitraum (z. B. `2026-Q2` oder `2026-06`). `publishedAt` ist das Datum, an dem genau dieser Datenstand veröffentlicht wurde. `effectiveFrom` bleibt das Wirksamkeits-/Simulationsdatum. Ein einzelnes `observedAt` ist für Monats-/Quartalsreihen nicht zwingend und sollte nicht als Ersatz für den Berichtszeitraum dienen. Ein tatsächliches Abrufdatum (`retrievedAt`) ist optional nützlich, aber kein Ersatz für Veröffentlichungs- und Revisionsstand. |
| Jede beobachtete SPI-Komponente | dieselben Pflichtfelder **je Komponente**: `componentSourceRef`, `componentObservedPeriod`, `componentPublishedAt`, `componentDataVintage` (oder Snapshot-Referenz), Wert und Einheit; zusätzlich `basketVersion`/COICOP-Key und verwendete Komponenten-/Indexbasis | Die zwölf Komponenten können auf denselben GENESIS-Abruf verweisen, wenn Tabelle, Datenstand, Periode und Variablen eindeutig gemeinsam referenziert sind. Andernfalls sind Metadaten pro Komponente separat zu halten. Alle beobachteten Komponenten müssen denselben Berichtsmonat und eine kompatible Basis/Klassifikation haben, bevor sie aggregiert werden. |
| Abgeleiteter Wert | Quelle(n) und Version(en), Beobachtungsperioden und reproduzierbare Formel/Transformation, Einheiten sowie Zielperiode | Abgeleitetes Ergebnis darf nur dann `observed` heißen, wenn es selbst genau die veröffentlichte Beobachtung ist. Eine aus Quartals-BIP interpolierte Monatsreihe ist `derived` oder `synthetic` und muss die Quellquartale sowie die Interpolationsregel referenzieren. |
| Synthetischer Zukunfts-/Testwert | `sourceType=synthetic`; `scenarioId`/Szenarioversion bzw. Fixture-ID und Modell-/Parameter-Version; Einheit und Simulations-/Zielperiode (`effectiveFrom`) | Für nicht veröffentlichte Zukunfts-/Testdaten sind `observedPeriod`, `observedAt`, `publishedAt` und ein amtlicher Revisionsstand **nicht erforderlich**; leer/null ist korrekt. Ein Quellenanker für verwendete Basisparameter bleibt erforderlich, wenn diese aus amtlichen Quellen stammen. Kein solcher Wert darf als veröffentlichte Beobachtung bezeichnet werden. |

### `observedAt` gegenüber `publishedAt`

`observedAt` ist kein Ersatz für `observedPeriod`: ein BIP-Wert hat etwa ein Quartals-Berichtsintervall, keinen einzelnen Beobachtungszeitpunkt. Es ist auch kein Ersatz für `publishedAt`: der Publikationstag ist für Revisionen und den damaligen Informationsstand relevant. **Vertragsbefund:** A02 führt `observedAt` derzeit als Mindestfeld jedes Makroereignisses auf. **Quellenbefund:** amtliche Monats-/Quartalsstatistik benötigt fachlich die Berichtsperiode, nicht generell einen punktuellen Messzeitstempel. A02 sollte daher vor dem QA-Re-Review klären, ob `observedAt` bei Statistikreihen optional/quellenspezifisch wird oder ob ein klar definiertes Abruf-/Messdatum gemeint ist; es darf nicht anstelle der Pflichtperiode und Veröffentlichungs-/Datenstandangaben gelten.

### Veröffentlichung, Revision und Vintage

Das Projekt sollte **nicht** behaupten, das Statistikrecht schreibe generell ein Feld mit dem Namen `vintage` vor. Dies ist eine Provenienz-/Replayanforderung des T-0063-Vertrags. Sie ist hier sachlich nötig, weil amtliche Reihen vorläufige und endgültige Veröffentlichungen sowie spätere Revisionen haben können. Destatis beschreibt dies für den VPI ausdrücklich: vorläufige Ergebnisse werden zum Ende des Berichtsmonats veröffentlicht, endgültige Ergebnisse etwa Mitte des Folgemonats; methodenbedingte Revisionen/Basisumstellungen können historische Werte betreffen. Deshalb ist für jede gespeicherte Beobachtung die verwendete Ausgabe festzuhalten.

Minimaler, praxistauglicher Datenstand: `publishedAt` plus Kennzeichnung `preliminary/final/revised` und – falls das Quellsystem keinen stabilen Revisionscode anbietet – eine vom Lauf gespeicherte Quellen-Snapshot-ID oder ein Hash des geladenen Quellstands. Ein separates `revisionDate` ist nur erforderlich, wenn es von `publishedAt` abweicht und die Quelle dies ausweist. `retrievedAt` dokumentiert den technischen Abruf, aber nicht, welche Veröffentlichung/Vintage abgerufen wurde.

## Primärquellen und fachliche Stützung

- [Destatis: GENESIS-Tabelle 61111-0006, VPI nach COICOP und Monat](https://genesis.destatis.de/datenbank/online/table/61111-0006/search/s/VyVDMyVBNHJtZXByZWlzaW5kZXglMjA2MTExMS0wMDA2) weist den Berichtszeitraum (Jahr/Monat), die Tabelle/Variablen und den verfügbaren Zeitraum aus. Für beobachtete Komponenten genügt daher nicht nur die Simulationsperiode; die konkrete Tabellen-/Merkmalsreferenz und der Berichtsmonat müssen mitgeführt werden.
- [Destatis: Veröffentlichung und Berechnung des VPI](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html) unterscheidet vorläufige und endgültige Ergebnisse und gibt deren Veröffentlichungszeitpunkt an.
- [Destatis: Revisionen](https://www.destatis.de/DE/Methoden/Revisionen/_inhalt.html) dokumentiert revisionsabhängige Reihen-/Veröffentlichungsstände, einschließlich VPI-Revisions-/Basiswechselregeln.
- [Destatis: Qualitätsbericht Verbraucherpreisindex](https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Preise/verbraucherpreis.pdf?__blob=publicationFile) beschreibt vorläufige VPI-Ergebnisse und deren Aktualisierung zu endgültigen Ergebnissen.
- Der Projektvertrag selbst (A02 T-0063 §§1, 2, 3.1 und 4.1; A08 T-0063 Provenienzmatrix) ist die Grundlage dafür, dass diese Metadaten in V3 gespeichert werden sollen. Die Destatis-Seiten belegen die Daten-/Revisionsstruktur; sie schreiben keine konkrete V3-Programmierschnittstelle vor.

## Präzise Empfehlung an A01/A02/A09

1. A02 validiert bei `sourceType=observed` mindestens einen gültigen Quellenbeleg, fachliche Berichtsperiode, Einheit, Publikationsdatum und verwendeten Datenstand/Vintage. Fehlende Werte dürfen nicht still zu `null` werden und dennoch als beobachtet in Snapshot/Event erscheinen.
2. Für jede SPI-Komponente wird eine entsprechende Beobachtungsperiode und Veröffentlichungs-/Datenstandreferenz erfasst. Eine gemeinsame Dataset-Metadatenreferenz ist zulässig, sofern alle zwölf Komponenten eindeutig darauf auflösen und dieselbe passende Periode/Basis führen.
3. `observedAt` wird nicht als allgemeine Pflicht für Monats-/Quartalsstatistiken verlangt; es ist optional oder quellspezifisch. Pflicht bleibt die fachliche `observedPeriod`. `effectiveFrom` bleibt separat.
4. Synthetische Zukunfts-/Testpfade dürfen Beobachtungs-/Publikations-/Vintagefelder leer lassen, sofern Herkunftstyp, Szenario/Fixture, Version, Einheit und Zielperiode ausdrücklich gekennzeichnet sind. Synthetische Zwischenwerte aus beobachteten Ausgangsdaten referenzieren zusätzlich deren Ursprungsperioden und Transformationsregel.
5. A09 prüft nach Umsetzung getrennt observed und synthetic fixtures; diese Empfehlung selbst schließt keine QA ab und legt keine Implementation fest.

## Nachweisrollen / Arbeitsstand

**Ausführung:** Quellen-/Vertragsabgleich durchgeführt.
**Fachreview:** Quellenanforderung belegt; keine Fachfreigabe der Modellparameter.
**Unabhängige QA:** A09-Befund gelesen; Re-Review nach Runtime-Korrektur nicht ausgeführt.
**Browser-/Gerätetest:** nicht ausgeführt, nicht Gegenstand.
**Git-Verifikation:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; zahlreiche parallele Änderungen, alle erhalten; dieser Bericht ist die einzige von A08 hier angelegte Datei. Kein Commit/Push.


## A08-Re-Review nach A02-Provenienzkorrektur (2026-10-31)

**Bezug:** A02-Rework in `docs/simulation/a02-t0063-arbeitsbericht.md` und `prototype/v3-macro-simulation.js`; frühere Warnung `docs/test-reports/a09-t0063-macro-runtime-qa.md`. Prüfumfang read-only: Feldvalidierung und Ergebnis-Metadaten; kein A09-Testlauf und keine Änderung an Runtime oder Vertrag.

| Punkt | Ergebnis | Befund |
|---|---|---|
| Beobachtete Aktivitäts-/BIP-Werte | **PASS auf Runtime-Ebene** | Aktuelle Validierung verlangt für `sourceType=observed` nichtleere Quelle und Einheit, gültige Beobachtungsperiode, gültiges `publishedAt` sowie `dataVintage` oder `sourceSnapshotId`. Beobachtete Quartalswerte und MRO-Werte werden ebenfalls geprüft. `observedAt` wird optional erhalten bzw. als `null` ausgegeben. |
| Beobachtete SPI-Komponenten | **PASS auf Runtime-Ebene, unter Datenquellenbedingung** | Ein gemeinsamer Quellenbeleg wird für den COICOP-Datensatz verwendet. Die Eingabe muss eine Beobachtungsperiode gleich dem Laufmonat, Veröffentlichung, Einheit, Vintage/Snapshot sowie Basis `2020=100` und Basketversion `V3-SPI-COICOP12-v1` angeben. Die gemeinsame Referenz ist nur sachgerecht, wenn alle zwölf Komponenten aus genau diesem kompatiblen Tabellen-/Datenstand stammen. Der Code validiert das Vorhandensein, nicht die sachliche Echtheit/Auflösung der Quellenreferenz. |
| Synthetische Zukunfts-/Testwerte | **PASS auf Runtime-Ebene** | Die Beobachtungsfelder werden nur bei `sourceType=observed` verlangt. Synthetische Fixtures können diese Felder leer lassen und behalten die Simulations-/Quellfelder. Das entspricht A02-Vertrag und A08-Empfehlung; synthetische Werte dürfen nicht als reale Veröffentlichung ausgegeben werden. |
| Veröffentlichungs-/Revisionsstand | **PASS mit Vertragsklarstellung** | Runtime verlangt `publishedAt` plus `dataVintage` oder `sourceSnapshotId`. Ein zusätzliches separates Revisionsdatum ist nicht generell nötig. Das passt zur A02-Forderung nach verfügbarer Revisionsversion und zum Destatis-Nachweis, dass der VPI vorläufige/endgültige Ergebnisse sowie methodenbedingte Revisionen kennt. `publishedAt` muss sich auf genau den gespeicherten Stand beziehen. |
| Vertragstext zu `observedAt` | **NICHT BESTANDEN – Dokumentationsabweichung** | Der A02-Makrovertrag listet `observedAt` noch in den Mindestfeldern eines jeden Makroereignisses. Reworkbericht und Runtime behandeln es für Periodenstatistiken als optional. Der Quellenbefund stützt das optionale Modell, aber die Vertragsstelle wurde nicht aktualisiert. A02/A01 sollten den Vertragstext synchronisieren, bevor A09 das endgültige Re-Review protokolliert; kein neuer Quellenstandard ist dafür nötig. |

### Feldentscheidung und Grenzen

Für beobachtete Monats-/Quartalswerte müssen **Beobachtungsperiode und Veröffentlichungsdatum** getrennt von `effectiveFrom` vorhanden sein. Zusätzlich braucht es konkrete Quellkennung/Serie, Einheit und einen verwendeten Revisions-/Datenstand. Der Projektvertrag verlangt dieses Set; amtliche Veröffentlichungs-/Revisionspraxis belegt die fachliche Notwendigkeit, begründet aber keine gesetzliche Pflicht zu einem Feldnamen `vintage`.

Ein `dataVintage` (zum Beispiel vorläufig/endgültig plus datierte Ausgabe) oder eine reproduzierbare Snapshot-ID sind gleichwertige Implementierungsmöglichkeiten, sofern der referenzierte Wertstand rekonstruierbar ist. Ein separates `revisionDate` ist nur nötig, wenn die Quelle ein solches Datum gesondert ausweist. `retrievedAt` kann den technischen Abruf dokumentieren, ersetzt jedoch weder Publikationsdatum noch Datenstand. `observedAt` ist quellspezifisch optional und kein Ersatz für die Periodenangabe.

Für den VPI sind vorläufige Veröffentlichungen am Ende des Berichtsmonats und endgültige Ergebnisse zur Monatsmitte des Folgemonats dokumentiert; spätere Methodenwechsel können historische Werte rückwirkend neu berechnen. Deshalb belegt nur `observedPeriod` zusammen mit `sourceRef` keinen damaligen Datenstand. Umgekehrt ist für eine synthetische Zukunftsperiode ohne publizierten Ist-Wert weder Publikationsdatum noch amtliche Revision erforderlich: nötig bleiben Herkunftstyp `synthetic`, konkreter Szenario-/Fixtureverweis, Modell-/Parameterkontext, Einheit und Simulationsperiode. Eine aus beobachtetem Quartals-BIP interpolierte Monatsreihe wäre abgeleitet/synthetisch und muss die Ursprungsperioden und Transformation tragen.

### Offizielle Quellen und Vertragsbezug

- [Destatis GENESIS-Tabelle 61111-0006](https://genesis.destatis.de/datenbank/online/table/61111-0006/search/s/VyVDMyVBNHJtZXByZWlzaW5kZXglMjA2MTExMS0wMDA2): ausgewiesene Monatsperioden und COICOP-Merkmale für die VPI-Komponenten.
- [Destatis Qualitätsbericht VPI, Abschnitt 4.4/5.1](https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Preise/verbraucherpreis.pdf?__blob=publicationFile): vorläufige und endgültige Ergebnisstände, Veröffentlichungsrhythmus und methodenbedingte Revisionen.
- [Destatis Revisionsübersicht](https://www.destatis.de/DE/Methoden/Revisionen/_inhalt.html): reihenspezifische Revisionsregeln.
- [A02 T-0063-Makrovertrag](../simulation/a02-t0063-v3-makro-simulationsvertrag.md), §§1, 2 und 4.1, plus A08-Provenienzmatrix: Projektanforderung, getrennte Datenherkunft und Geltungsgrenze.

### Übergabe und Prüfstatus

A02 hat die Runtime-Provenienzprüfung umgesetzt und ihre Regressionen als bestanden dokumentiert. A08 bestätigt die Feldanforderung und Implementierungsrichtung, aber weder die tatsächliche externe Datenbeschaffung noch die Echtheit beliebiger Laufzeit-`sourceRef`-Strings. A09-Re-Review der korrigierten Runtime steht weiterhin aus; die bisherige A09-Datei `a09-t0063-macro-runtime-qa.md` enthält noch die ursprüngliche Warnung und ist kein Nachweis der neuen Regressionen. Der eine verbleibende A08-Befund ist die nicht synchronisierte Mindestfeldliste `observedAt` im A02-Vertrag.

Kein Runtime-/Vertragsedit in diesem Review, keine Rechts-/Produkt-/Architekturfreigabe, kein Commit/Push.
