# A02-Arbeitsbericht – T-0066 Produktlebenszyklus-Runtime

**Status:** isolierte Runtime und Regressionen geliefert; Gesamtticket bleibt IN_PROGRESS  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2  
**Ticket:** T-0066  
**Vorgänger:** CP-0279 (ENTWURF); CP-0280 (ENTWURF)  
**Profilbezug:** V3-Szenariolauf, ohne Veränderung des abgenommenen V2-Profils oder der Startprofile 2019/2027  
**Entscheidungsbezug:** D-0159 Lernabgrenzung; D-0161 Rechtsstand nach Prüf-/Releasezeitpunkt; D-0162 T-0067 Kalkulations-/Snapshotvertrag; D-0163/D-0164 nur soweit T-0064-Anschluss betroffen ist.

## 1. Preflight und Umfang

Vor der Änderung wurden AGENTS.md, Agentenstruktur und Rechtematrix, MG-002-Ziele, aktive T-0063–T-0069, Collaboration State, Decision Log, CP-0279/CP-0280 sowie T-0065-, T-0066- und T-0067-Verträge geprüft. Der Arbeitsbaum war bereits umfangreich geändert und enthielt ungetrackte parallele V3-Arbeit. Diese blieb unangetastet. Die Änderung ist auf eine getrennte V3-Produktengine und ihre Regressionen begrenzt; keine Änderung an V1/V2-Engine, Architektur, Datenbankschema, Ledger oder Git-Historie.

## 2. Gelieferte Runtime

`prototype/v3-product-lifecycle.js` implementiert einen unveränderlichen, deterministischen Zustandskern mit:

- mehreren parallelen Produktideen und expliziten Rezept-/Marktkompetenzen;
- geordneten Entwicklungs- und Produktionsschritten mit Vorgängerbedingungen;
- vorhandenen Auftrags-/Arbeitsbelegungen als erforderlichem Input; dieselben Personen und Anlagen können nicht über ihre mitgelieferte Tageskapazität hinaus erneut verplant werden;
- harten Skill- und Anlagenkompetenz-Gates;
- Materialverfügbarkeit und Reservierung durch geplante Schritte; Verbrauch entsteht erst beim erfolgreichen Abschluss des Arbeitsschritts;
- getrenntem Fertigwarenbestand und expliziter Lagerkapazität; Fertigwarenfläche wird bei der Planung reserviert und beim Produktionsabschluss belegt;
- Kalkulationsvorschau ausschließlich über A03 `calculateV3OfferEstimate` nach D-0162. Sie protokolliert keinen Umsatz, Cashflow, Bestand oder Ledgerposten;
- Marktchancen ausschließlich aus der spielersicheren Projektion von A02 T-0065. Konkurrenzidentitäten und -gebote werden nicht zurückgegeben;
- Stornierung geplanter, noch nicht ausgeführter Arbeit ohne Verbrauch oder Ist-Buchung.

Kapazitäten, vorhandene Belegungen, Lagerbelegung, Materialmengen und Kosten-/BAB-Eingaben müssen explizit übergeben werden. Die Runtime setzt dafür keine stillen Spielwerte.

## 3. Verifikation

- `node --check prototype/v3-product-lifecycle.js`: PASS.
- `node --check prototype/v3-product-lifecycle-regressions.mjs`: PASS.
- `node prototype/v3-product-lifecycle-regressions.mjs`: PASS. Geprüft werden unveränderlicher Zustand, mindestens zwei Produkte, ungültige Kalender-/Überbelegungsdaten, Skill-/Anlagen-Gates, Vorgängerfolge, vorhandene Auftragsbelegung, A03-Kalkulationswerte, Materialverbrauch, Fertigwarenlagergrenze, Cancel ohne Verbrauch und T-0065-Spielerprojektion.
- `git diff --check` auf beiden neuen Dateien: PASS.
- Fachreview A03: nicht ausgeführt.
- unabhängige QA A09: nicht ausgeführt.
- Browser-/Mobiltest: nicht ausgeführt.
- Gesamt-Repository-Gitverifikation: nicht durch A02 durchgeführt; bekannte bestehende lokale Änderungen bleiben erhalten.

## 4. Nicht abgeschlossene Gates / Abhängigkeiten

1. Der T-0067-Vertrag enthält eine kalkulatorische Vorschau-API, aber keine autorisierte verfügbare Liquidität-/Cash-Gate-API. Deshalb prüft die neue Runtime keine Finanzierbarkeit und startet keine Buchung. A03 muss die T-0066-Finanzschnittstelle separat fachlich reviewen bzw. erweitern.
2. Es gibt keine bestätigte V3-Formel für quantitative Produktivitätsänderungen durch Skill/Motivation/Ausstattung. Die Runtime erzwingt Qualifikation, aber erfindet keine Prozentwirkung oder Leistungsfunktion. A02/A03/A01 müssen dazu einen bestehenden bestätigten Vertrag nachweisen oder eine Entscheidungsvorlage an A01 erstellen.
3. Die T-0065-API stellt sichere Anfragen und Konkurrenzaggregationen bereit, jedoch keine Produktabschluss-/Bestandsausbuchungs- und A03-Verkaufsübergabe. Die Runtime zeigt passende Marktchancen, führt aber kein Angebot, keinen Verkauf und keine Auslieferung aus. Der Umsatz-/Cash-/Bestandsübergang muss in einem abgestimmten A02/A03-Integrationsauftrag definiert werden.
4. Die Engine ist ein reiner isolierter Zustandskern ohne V3-Oberflächenbindung oder Jahreslauf. A05-Integration, A03-Fachreview und A09 unabhängige QA sind erforderlich; T-0069 bleibt End-to-End-/Mobilgate.
5. Lagerkapazität wird als explizite gemeinsame Maßeinheit geführt; A05/A09 müssen bei der Integration sicherstellen, dass Kapazität und Produktvolumen dieselbe dokumentierte Einheit besitzen.

## 6. A09-Befunde und gezielte Korrektur (2026-10-31)

A09s [Finalreview](../test-reports/a09-t0066-runtime-review.md) meldete fünf reproduzierbare Zeit-/Lebenszyklusfehler. A02 hat sie ohne neue Produktregel und ohne Änderung der Finanzgrenze korrigiert:

1. Planung am Wochenende wird abgewiesen; das Datumssystem lässt Samstag/Sonntag arbeitsfrei, ohne Feiertagslogik einzuführen.
2. Assignment-IDs kommen aus einem monotonen, laufbezogenen Sequenzzähler. Storno/Neuplanung derselben Tätigkeit am selben Tag erzeugt eine neue ID; Abschluss löst diese aktive ID eindeutig auf.
3. Fertigwarenmenge und `finished_goods`-Status werden erst freigegeben, wenn alle definierten Prozessschritte abgeschlossen sind. Output aus einem Produktionsschritt bleibt davor als gebundene WIP-Menge geführt und reserviert weiterhin Lagerkapazität.
4. Ein geplantes Assignment darf nicht vor seinem Zieldatum abgeschlossen werden. `advanceV3ProductDate` bewegt den Lauf jeweils zum nächsten Arbeitstag und überspringt Wochenenden.
5. Ein Nachfolgeschritt kann nur nach einem angelegten Vorgänger und nicht vor dessen geplantem Datum eingeplant werden. Abschluss setzt tatsächlichen Abschlussstatus/-tag voraus; ein später Abschluss des Vorgängers kann einen früher geplanten Nachfolger nicht rückwirkend freigeben.

Neue permanente Regressionen decken Samstagplanung, ungültige Datums-/Belegungsdaten, Vorababschluss, Vorgängerstatus und -zeitlage, Zwischenstufen ohne Fertigwarenfreigabe, Wochenendsprung sowie eindeutige ID bei Storno/Neuplanung ab. A09-Re-QA ist angefordert und noch nicht erfolgt. A03s isoliertes Finance-PASS aus `docs/accounting/a03-t0066-finance-review.md` bleibt unverändert und wird von diesen Runtimekorrekturen nicht ersetzt.

## 5. Nächste Übergaben

- **A03 an A01:** prüft die Plan-Kalkulationsschnittstelle und benennt, ob eine Cash-/Bestands-/Absatzübergabe bestehende V3-Finanzverträge erweitert.
- **A09 an A01:** unabhängige Grenzfall-QA der beiden neuen Dateien, speziell Doppelbelegung/Material-/Lagerreservierung sowie Nichtmutation der Kalkulation.
- **A05 an A01:** erst nach Fachreview UI-Integration gegen bereitgestellte Zustände, ohne neue Simulations- oder Accountingregeln.
- **A01 an A02/A03:** erstellt danach einen kleinen Anschlussauftrag für Produktverkauf/Erfüllung, falls T-0065/T-0067-APIs gemeinsam dafür freigegeben sind.

Keine Nutzerentscheidung wurde hier getroffen. Kein Commit oder Push. Keine vorhandene Änderung verworfen.
