# A05-Arbeitsbericht – T-0064 V3 Gründungs- und Erwerbsoberfläche

**Status:** UI-Umsetzung geliefert; Runtime-/Browserreview ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent/Goal/Ticket:** A05 – FRONTEND / MG-002 / SLG-002.2 / T-0064
**Basis:** D-0161, D-0163, D-0164; A02 T-0064-Statusvertrag und `prototype/v3-company-formation.js`; A03 T-0064-Finanzereignisvertrag; A08 Rechts-/Quellenreview; A09 Vertragsreview; CP-0280 (Entwurf).
**Grenze:** Neue Oberfläche nur unter `prototype/v3/`. Bestehende V2-Dateien, Simulation, Schema, Architektur und Finanzzustände blieben unangetastet.

## Geliefert

- `prototype/v3/index.html`, `formation.css`, `formation.js`: responsiver, mobile-first Gründungs-/Transaktionsflow als getrennte Route.
- `prototype/v3/a05-t0064-regressions.mjs`: State-Machine-Regression mit A02-Exporten.
- `prototype/v3/a05-t0064-ui-regressions.mjs`: statischer UI-/Vertragscheck.
- `prototype/v3/a05-t0064-smoke.html`: Browser-Smoke-Einstieg, falls statischer HTTP-Server verfügbar ist.
- Diese Schnittstellennotiz beschreibt die UI-zu-A02/A03-Zuordnung und Grenzen.

## Funktionale Zuordnung

- Szenario- und Ausgangs-IDs, Startdatum und Quellenbelege müssen explizit eingegeben werden.
- Die Gründungsphasen verwenden A02-Ereignisse. Tragfähigkeit wird erst nach sechs vollständig referenzierten Inputs vom Spieler als tragfähig/nicht tragfähig bewertet; die UI berechnet kein Rechtsurteil oder unbelegte Kennzahl.
- Auswählbar sind Einzelunternehmen und GmbH & Co. KG. GmbH/KG erhalten getrennte IDs, Registerstatus und Eigentümer-/Kontrollbezüge. Für KG werden Komplementär- und Kommanditistenrolle explizit erfasst.
- AG, eG und GmbH & Co. KGaA bleiben deaktivierte Kandidaten.
- KG-Tätigkeit vor Eintragung erfordert die im KG-Vertrag festgelegten Partner in gleicher Reihenfolge mit separatem Zustimmungsbeleg sowie eine belegte HGB-Prüfung; die UI zeigt dies nicht als automatische Rechtsfreigabe.
- Gemeinsamer Einkauf und Arbeitsgemeinschaft sind getrennte Abläufe. Share Deal und Asset-/Betriebskauf sind ebenfalls getrennt.
- Asset-Review erfasst konkrete §613a-/§25-Prüfinputs, inkl. §613a Abs. 2 Anspruchs-/Zeitraum-/Betragsstatus, Beschäftigteninformation/Widerspruch und getrennten §25-Firmenfortführungs-/Verpflichtungs- und Anspruchsbelegen. Diese Angaben werden durch den Spieler bzw. die Fachprüfung gesetzt; A02 validiert Vertragspflichtfelder, die UI leitet keine Anwendbarkeit ab.
- A03-Handoffs werden mit Status/Quellenreferenzen angezeigt und behalten `ledgerMutation:false`/`cashMutation:false`. Die UI erzeugt keine Preise, Gebühren, Steuern, Finanzwerte oder Buchungen.

## Tests und Reviewstatus

- `node --check prototype/v3/formation.js`: PASS.
- `node prototype/v3/a05-t0064-regressions.mjs`: PASS. Geprüft: Ereignis-/Evidence-Gates, Nichtmutation bei blockierten Events, Kandidatensperre, getrennte GmbH/KG-IDs/Rollen, Registerfluss, Zustimmung/Vorregisterprüfung, Betriebsbereitschaft, Kooperation, Share Deal, offener Asset-Review, A03-Handoff ohne Buchung und Modellinvarianten.
- `node prototype/v3/a05-t0064-ui-regressions.mjs`: PASS. Geprüft: mobile Viewport-Angabe, explizite Datums-/Tragfähigkeitseingaben, auswählbare Formen, Kandidatensperre, Rechtschecklisten, A02-Exportbindung, keine V2-Engine-Kopplung.
- `git diff --check` für die bearbeiteten Pfade: PASS (keine Ausgabe).
- Vollständiger interaktiver Browser-/Gerätecheck: nicht ausgeführt. A09 unabhängiger UI-/Runtime-QA-Review und A12 explorativer Browserreview: nicht ausgeführt.
- Keine Commit-/Push-Aktion.

## Offene Integration / Abnahme

- A02 sollte den jetzigen Eventvertrag nach den während der UI-Arbeit hinzugekommenen Rollen-, Share-, §613a Abs. 2- und §25-Feldern einfrieren und die eigenen Runtime-Regressionen dagegen laufen lassen.
- A09 muss UI-/A02-Grenzfälle unabhängig prüfen; insbesondere Wiederholung aus `review_pending`, Rechtschecklisten und `needs_review`-Sperren.
- A12 soll die neue Route im Browser mobil explorieren. Ein echter HTTP-/Browserlauf wurde hier nicht durchgeführt.
- `prototype/v3/` ist ein neuer, isolierter Einstiegspunkt und noch nicht in die V2-Navigation oder einen Release integriert. Der V3-Status/Checkpoint bleibt bei A01.

## GIT

Der anfängliche Repository-Preflight ergab bereits laufende Änderungen anderer Rollen, darunter `prototype/engine.js`, mehrere Governance-/Fachdateien und A02-/A03-/A08-Artefakte. Diese blieben erhalten. Eigene Änderungen sind ausschließlich die neue `prototype/v3/`-Route, ihre UI-Smoke-Dateien, die Schnittstellennotiz und dieser Bericht. Kein Commit/Push.


## A12-Follow-up

Der A12-Browserbefund zum nach dem Szenarioladen stehenbleibenden Setup-Chip wurde behoben: initial/ungültig bleibt „Eingaben erforderlich“, nach erfolgreicher Initialisierung wechselt der Chip auf „Szenario geladen“. Die UI-Regression deckt Anfangs-, Erfolgs- und Fehleranzeige ab. A09-Verifikation des Fixes ist ausstehend; kein Browser-/Gerätetest durch A05.

## T-0067-Ergänzung: V3-Kalkulations- und Grund-BAB-UI

**Status:** A05-UI-Teil geliefert; unabhängige A09-/A12-Prüfung ausstehend
**Ticket:** T-0067 · **A03 API:** `V3-FINANCIAL-CALCULATION-1`
**Grenze:** ausschließlich neue V3-Finanzroute unter `prototype/v3/`; kein V1/V2, keine Simulation-/Ledger-Kopplung, keine Schema-/Architekturänderung, kein Commit/Push.

### Geliefert

- `prototype/v3/finance.html`, `finance.css`, `finance.js`: mobile-first Eingabe für Nettoplanpreis, explizit variable/nicht variable direkte Kosten, bestätigten BAB-Anteil, BAB-Quellpools, Mengen-/Geldbasis, Verteilungsschlüssel, Plan-/Ist-Flüsse, datierte Bestände und Angebots-Snapshots.
- `prototype/v3/index.html`: ein Navigationslink zur getrennten Finanzroute.
- `prototype/v3/a05-t0067-regressions.mjs`: API-/Vektor- und statische UI-Vertragsregressionen.
- Die UI delegiert DB I, direkte-Kosten-Ergebnis, BAB-Satz/Verteilung, Periodisierung, Snapshot-Erstellung und Annahme direkt an die A03-Bibliothek. Anzeigen runden nicht in die weitere Rechnung zurück. Währungsdarstellung formatiert Cent aus Ganzzahl-Cent.
- Entwürfe können neu berechnet werden. Gespeicherte Angebots-Snapshots bleiben unabhängig. Nach dokumentierter Annahme bleiben Preis und Snapshot dieses Angebots unveränderlich; weitere Entwürfe dürfen separat neu berechnet und versioniert werden.
- Keine Zahlen sind vorausgefüllt. Fehlende Klassifikation/Beträge führen zu sichtbarem Fehlerzustand. Alle Kennzahlwerte sind manuelle Szenarioeingaben; keine Steuer-, SimTAX-, Cash-, Ledger-, Forderungs-, Verbindlichkeits- oder Bestandsbuchung wird erzeugt.

### Verifikation

- `node --check prototype/v3/finance.js`: PASS.
- `node --check prototype/v3/a05-t0067-regressions.mjs`: PASS.
- `node prototype/v3-financial-calculation-regressions.mjs`: PASS.
- `node prototype/v3/a05-t0067-regressions.mjs`: PASS. Deckt A03-Vektoren, DB-I-Centgrenzen, stabile Restcent-Reconciliation, Anzeige-/Internsatztrennung, Gewichtsvalidierung, Snapshot-Nichtmutation/Annahme, Plan-/Ist-/Stichtagstrennung, leere Vorgabewerte, Navigation, API-Bindung, Live-Fehler-/Sperrverhalten und V2-Isolation ab.
- `node prototype/v3/a05-t0064-regressions.mjs`: PASS.
- `node prototype/v3/a05-t0064-ui-regressions.mjs`: PASS.
- `git diff --check`: PASS für die von A05 berührten Dateien; Ausgaben der Gesamtprüfung siehe Übergabe an A01.
- Browser-/Touch-/Geräteprüfung: nicht ausgeführt; daraus wird kein Browser- oder Mobil-PASS abgeleitet.

### Übergabe

A09 soll API-Vertrag, UI-Sperre nach Annahme, Reconciliation-Anzeige, Eingabefehler, Snapshot-spezifische Sperre und Nichtmutation unabhängig prüfen. A12 kann danach den Browser-/Mobilablauf explorieren. Die Oberfläche ist eine manuelle Kalkulations- und Lernansicht; sie importiert keine bestehenden Spielwerte und integriert keine Buchung.


## A09-Re-Review-Follow-up · T-0067

**Status:** Beide A09-UI-Befunde umgesetzt; unabhängiger A09-Re-Review ausstehend.

- `keys` bezeichnet jetzt physische Treibermengen. A05 verwendet ausschließlich den von `allocateV3BabPool` aus diesen Schlüsselwerten abgeleiteten Satz. Eine manuelle, unabhängige Ratebasis für `keys` ist entfernt. Periode und Einheit sind je Pool gemeinsame Pflichtkontexte; die UI erklärt sichtbar, dass alle Empfänger dieselbe Periode/Einheit verwenden und fordert die Einheit für `keys` ein.
- `weights` bezeichnet dimensionslose Anteile. Die Verteilung zeigt keinen daraus abgeleiteten Mengensatz. Optional kann ein separater Mengensatz mit expliziter physischer Gesamt-Treibermenge, Einheit und derselben Poolperiode angefordert werden; dafür ruft A05 `calculateV3BabRate` separat auf. Ratebasis und Anteilnenner stehen mit getrennten Labels.
- Jede Änderung an Preis, direkten Kosten oder BAB-Pool-/Empfängereingaben verwirft die aktuelle Entwurfsschätzung sichtbar als veraltet. Snapshot-Erstellung bleibt ausgeblendet, bis eine Neuberechnung gelingt. Auch der Fehlerpfad einer fehlgeschlagenen Berechnung löscht Estimate und Labels. Bereits gespeicherte/angenommene Snapshots bleiben unangetastet.
- Regression ergänzt eine Quellfunktionsprobe des echten `invalidateEstimate`-/`setSnapshotControls`-Pfads: gültige Ausgangsschätzung → Eingabeänderung → Estimate/Labels leer, Snapshot verborgen → erfolgreiche Neuberechnung macht Snapshot-Eingabe wieder sichtbar. A03 `V-RATE-03` wird mit den passenden key-/weight-Verträgen überprüft.

A09 soll die beiden Fixes unabhängig erneut prüfen. Kein Browser-/Gerätetest wurde ausgeführt; kein Commit/Push.

## T-0063-Ergänzung: V3-Volkswirtschafts-Dashboard

**Status:** Isolierte Makro-Oberfläche und Regressionen geliefert; unabhängige A09-/Browserprüfung ausstehend.
**Ticket:** T-0063 · **A02 API:** `prototype/v3-macro-simulation.js` und `prototype/v3-price-index.js`
**Grenze:** Neue Route unter `prototype/v3/`, kein V1/V2, keine Änderung an Makro-/SPI-Regeln, keine Buchungs-, Cash-, Ledger-, Personal- oder Unternehmenszustandsmutation, keine Schema-/Architekturänderung, kein Commit/Push.

### Geliefert

- `prototype/v3/macro.html`, `macro.css`, `macro.js`: mobile-first Dashboard mit 14 Monats-Snapshots; Periodenauswahl, vierphasige Zustandsanzeige, Übergangsgrund, Aktivitätslücke/-momentum, SPI-Index und m/m-/y/y-Raten, Außenwirtschafts- und Politikkanäle, MRO-Status sowie optionale indikative/abgelaufene Konditionsanzeige.
- Einstieg über den neuen Link „Volkswirtschaft“ in `prototype/v3/index.html`; V2-Einstieg blieb unverändert.
- Nur dokumentierte A02-Regressions-Fixtures werden angeboten. Sie sind sichtbar als synthetisch/unkalibriert gekennzeichnet und werden nicht als Markt-, Destatis- oder EZB-Beobachtung dargestellt. Für jedes Feld bleiben Quellenreferenz und Modell-/Basketversion sichtbar; beobachtet/abgeleitet/synthetisch/nicht verfügbar besitzen getrennte Badge-Stile.
- Makro-/SPI-Berechnungen und Status stammen vollständig aus den importierten A02-Modulen. Die Oberfläche dupliziert keine Formel. Eine Finanzierungskondition bleibt indikativ/fristgebunden; keine Annahme, Vertragsänderung oder Buchung.
- `prototype/v3/a05-t0063-macro-regressions.mjs`: prüft Ausgabe/Provenienz, Laufdaten, unavailable/synthetic MRO, optionale/indikative/abgelaufene Kondition, Finanz-Nichtmutation und Fehlerpfad.

### Prüfung

- `node --check prototype/v3/macro.js`: PASS.
- `node --check prototype/v3/a05-t0063-macro-regressions.mjs`: PASS.
- `node prototype/v3/a05-t0063-macro-regressions.mjs`: PASS.
- `node prototype/v3-macro-simulation-regressions.mjs`: PASS.
- `node prototype/v3-price-index-regressions.mjs`: PASS.
- `git diff --check` für die A05-Dateien: PASS.
- Browser-/Touch-/Gerätetest: nicht ausgeführt; daraus folgt kein Browser-PASS.
- A09 unabhängige UI-/Runtime-QA: ausstehend.

### Übergabe

A09 sollte die Anzeigen und Grenzfälle für Provenienz, ausbleibende SPI-Historie, optional/abgelaufene Anfrage, lagged channels und Nichtmutation prüfen. Anschließend kann A12 die Desktop-/Mobiloberfläche explorieren. A05 hat keinen Browser-/Mobil-PASS behauptet.

## T-0065-Ergänzung: V3-Marktpostfach und Angebotsfluss

**Status:** A05-UI-Verbrauch und fokussierte DOM-/API-Regressionen geliefert. A03-Finanzreview PASS für die isolierte Runtime; A09-Runtime-Review NONPASS mit unabhängigem A02-History-Blocker. A09-UI-Review und Browserprüfung ausstehend.
**Ticket:** T-0065 · **A02 API:** `prototype/v3-market-simulation.js` · **A03 API:** `prototype/v3-financial-calculation.js` · **Basis:** D-0159–D-0164, insbesondere D-0162; CP-0279/CP-0280 (ENTWURF).
**Grenze:** Ausschließlich `prototype/v3/`; keine V1/V2-/Engine-/Schema-/Ledgeränderung, kein Commit/Push.

### Geliefert

- `prototype/v3/market.html`, `market.css`, `market.js`: responsive Postfach-/Marktansicht mit expliziten synthetischen Wettbewerbs- und Ablauf-Fixtures, über Arbeitstage fortgeschriebenen Anfragen, eigenen Nettopreisangeboten, Kundenentscheidung mit Verzögerung, Ablaufstatus und anonymisiertem Monatsbericht.
- Einstieg „Postfach & Markt“ auf `prototype/v3/index.html`.
- Die Anfragenansicht wird ausschließlich aus `getV3MarketPlayerView(state)` aufgebaut; Konkurrenzvergleich ausschließlich aus `getV3MonthlyCompetitorReport(state, period)`. UI projiziert aus dem Report nur Periode, Größenklasse, `n`, Mittelwert und Unterdrückungsstatus. Es werden keine Konkurrenznamen, Einzelgebote oder Einzelbieterpreise gerendert. Nicht passende Anfragen werden in der A02-Projektion nicht gezeigt; eingegangene Einladung markiert, dass A02s Skill-/Mindestkapazitätsgate erfüllt war.
- Das Angebotsformular verlangt explizite Preis-, Kosten-, BAB- und Versionsangaben. DB I und direkte-Kosten-Ergebnis kommen aus `calculateV3OfferEstimate`; `createV3MarketOfferId` liefert die stabile Angebots-ID und `createV3OfferSnapshot` erstellt den eingefrorenen D-0162-Snapshot. A02 erhält genau diesen Snapshot. Eine angenommene Kundenofferte wird für die Anzeige mit `acceptV3OfferSnapshot` nachvollzogen; es entsteht keine Buchung, Forderung oder Zahlung.
- Der Wettbewerbsbericht verwendet ausschließlich API-Aggregate und zeigt bei kleinen Stichproben den Mittelwert als verborgen. Ein separater Testlauf ohne Konkurrenzgebote macht den Ablauf einer unbeantworteten Anfrage prüfbar. Beide Varianten sind klar als synthetische Tests gekennzeichnet; keine Testzahl wird als Marktpreis behauptet.

### Verifikation

- `node --check prototype/v3/market.js`: PASS.
- `node --check prototype/v3/a05-t0065-market-ui-regressions.mjs`: PASS.
- `node prototype/v3/a05-t0065-market-ui-regressions.mjs`: PASS. Prüft A03-Kalkulation/Snapshot-Freeze, stable offer ID, Verzögerung/Annahme, Ablauf, anonymisierte Spielerprojektion/Reportfelder, keine Finanzwirkung und reale Seitenhandler mit DOM-Stubs.
- A02 `prototype/v3-market-simulation-regressions.mjs`: PASS.
- A03 `prototype/v3-financial-calculation-regressions.mjs`: PASS.
- `git diff --check` für A05-Dateien und abschließender Whitespace-Scan: PASS.
- Browser-/Touch-/Geräteprüfung: nicht ausgeführt; keine verfügbare Browseroberfläche in dieser Agentenumgebung.
- A03 [T-0065-Finanzreview](../../accounting/a03-t0065-final-finance-review.md): PASS für Snapshot-/Finanzgrenze der isolierten Runtime; kein UI-/Gesamtticket-PASS.
- A09 [T-0065-Runtime-Review](../../test-reports/a09-t0065-market-runtime-review.md): NONPASS wegen manipulierbarer Eventhistorie, die erneute Wochenplanung und doppelte Anfrage-IDs ermöglicht. A02 muss dies beheben; keine UI-Workaround-/A02-Codeänderung durch A05. Ein separates A09-UI-Review steht aus.

### Offener Modellanschluss

Der vorliegende A02-Fixture-/API-Output enthält derzeit nur die Größenklassen `small` und `large`. Die T-0065-Abnahme nennt mindestens drei Größenklassen. A05 zeigt exakt die gelieferten API-Gruppen und erfindet keine dritte Klasse. A02/A01 müssen die dritte Größenklasse samt belegter synthetischer Fixture-Inputs ergänzen, bevor diese Abnahmeanforderung als erfüllt markiert werden kann. Die Integration realer T-0063-Makro-/Jahreszustände bleibt außerdem T-0069 vorbehalten.

### Übergabe

A02 muss zunächst den von A09 gefundenen History-/Duplikatblocker reparieren und zur A09-Reprüfung übergeben. A03s Finance-Gate der isolierten Runtime ist PASS. A09 sollte danach Datenschutzprojektion, Verzögerung, Annahme, Ablauf und DOM-Handler unabhängig reviewen; A12 kann Browser/Mobil ergänzen, sobald verfügbar. T-0065 bleibt IN_PROGRESS.

## A01-Koordinierungsnachtrag zu T-0065 (2026-10-31)

Die weiter oben beschriebene offene Zwei-Größenklassen-/Schwelle-2-Fixture ist historisch und inzwischen überholt. A05 konnte die spätere Änderung mangels Checkout-Zugriff nicht ausführen. A01 hat die eng begrenzte Aktualisierung in `prototype/v3/market.js` und `prototype/v3/a05-t0065-market-ui-regressions.mjs` vorgenommen; dazu siehe `docs/simulation/a01-t0065-market-ui-alignment-bericht.md`. Es liegen jetzt drei synthetische Größenklassen/Segmente und `n>=3` vor. A09s unabhängiger UI-Finalreview ist PASS (`docs/test-reports/a09-t0065-market-ui-final-review.md`). Browser-/Mobil- und Unternehmensjahresintegration bleiben offen.
