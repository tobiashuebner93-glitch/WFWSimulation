# A09-Finalreview – T-0066 Produktlebenszyklus-Runtime

**Status:** NONPASS – fünf reproduzierbare Simulationsinvarianten verletzt  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2  
**Ticket:** T-0066  
**Reviewbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; Vorgänger CP-0279 und CP-0280 (beide Entwurf); V3-Startprofil 2027-01-04; D-0159, D-0162; T-0066-Rahmen, A02-Integrationsvertrag T-0063/65/66 und A03-T-0067-Kalkulationsvertrag.

## Preflight und Umfang

Gelesen: `AGENTS.md`, Agentenstruktur/-Rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280 sowie T-0066/A02/A03-Verträge und A02-Lieferbericht. Das Arbeitsverzeichnis enthält zahlreiche bereits vorhandene lokale Änderungen und neue Dateien. A09 hat keine Produktdateien verändert und keine bestehende Änderung verworfen.

Untersucht: `prototype/v3-product-lifecycle.js`, `prototype/v3-product-lifecycle-regressions.mjs` und die referenzierten A02-/A03-/A05-Schnittstellen.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Mehrere parallele Produktentwürfe | **PASS** | Zwei Produktentwürfe bleiben im selben unveränderlichen Runtime-Zustand getrennt verfügbar. |
| Skills und Ausstattung | **PASS** | Fehlende Personenqualifikation bzw. Maschinenfähigkeit blockieren Planung. Person-only-Schritte sind möglich, wenn kein Betriebsmittel verlangt wird. |
| Personal-/Maschinenkapazität und bestehende Belegung | **NONPASS** | Tageskontingente und vorhandene Auftragsbelegung werden geprüft; jedoch akzeptiert die Runtime Aufgaben am Samstag. Die Arbeitstagsregel aus V3/D-0011 verlangt Montag bis Freitag. |
| Schrittfolge/Voraussetzungen | **NONPASS** | Explizite Vorgänger müssen im Zustand `completed` sein; die Runtime prüft jedoch nicht, ob deren geplantes Datum bereits erreicht wurde oder ob ein Folgeschritt zeitlich nach seinem Vorgänger liegt. Der Endstatus „Fertigwaren“ wird zudem schon nach einem beliebigen Produktionsschritt gesetzt. |
| Materialreservierung/Verbrauch | **PASS** | Geplante Arbeit reserviert Mengen; bei Storno bleibt Material erhalten; Verbrauch entsteht bei Abschluss. Produktionsstückliste wird gegen eingeplante Mengen geprüft. |
| Fertigwarenlager | **NONPASS** | Lagerkapazität wird bei Planung reserviert. Eine Fertigwarenmenge und der Status `finished_goods` entstehen dennoch bereits beim Abschluss des ersten Produktionsschritts, auch wenn definierte Nachfolge-/Prüfschritte noch nicht abgeschlossen sind. |
| Storno und Neuplanung | **NONPASS** | Storno gibt die Ressource frei; bei derselben Tätigkeit am selben Tag wird jedoch dieselbe `assignmentId` erneut vergeben. Abschluss über die ID findet die erste, stornierte Zeile und schlägt fehl. |
| A03-Kalkulation | **PASS – nur Vorschau** | Der Runtime-Aufruf nutzt `calculateV3OfferEstimate`; die UI-/Engine-Runtime erzeugt daraus keine Bewertung oder Buchung. |
| Cash/Ledger/Buchungen | **PASS – isolierter Scope** | Produkt-Runtime importiert keine Ledger-/Cash-API; Events betreffen Produktplanungszustände. |
| T-0065-Marktprojektion | **PASS** | Marktchancen kommen aus `getV3MarketPlayerView`; die Produkt-Rückgabe enthält keine Wettbewerberidentitäten oder Einzelpreise. |
| Browser-/Jahresintegration | **nicht ausgeführt / offen** | Kein Browser-/Mobiltest; diese Runtime ist noch nicht an die V3-Spieloberfläche oder den Jahreslauf angeschlossen. |

## Reproduzierbare NONPASS-Befunde

1. **Wochenendplanung:** `planV3ProductStep` akzeptiert `date: '2027-01-09'` (Samstag), obwohl das Profil am 2027-01-04 beginnt und Arbeitstage Montag bis Freitag sind. Die Funktion prüft Datum und Kapazität, aber keinen Wochentag.
2. **Storno-/Neuanlagekollision:** Nach Planung und Storno von `prod:dev:2027-01-04` erzeugt eine Neuplanung derselben Tätigkeit am selben Tag erneut dieselbe ID. `completeV3ProductStep(state, id)` findet die erste Zeile (`cancelled`) und meldet `assignment is cancelled`, obwohl eine zweite geplante Zeile existiert.
3. **Vorzeitige Fertigwarenfreigabe:** Ein Produkt mit Produktionsschritten `make` und nachgelagerter `inspect`-Stufe erhält nach Abschluss von `make` bereits `stage='finished_goods'` und erhöhte verfügbare Fertigwarenmenge, obwohl `inspect` nicht geplant oder abgeschlossen ist. Damit kann `getV3ProductMarketOpportunities` Ware als vermarktbar behandeln, bevor der Prozess vollständig durchlaufen wurde.
4. **Zeitvorsprung:** Ein für ein späteres Datum geplantes Assignment lässt sich über `completeV3ProductStep` sofort abschließen. Die API prüft Assignment-Status, aber weder Zieldatum gegen `currentDate` noch Ereigniszeitfortschritt. Dadurch kann das Modell zukünftige Arbeit vorzeitig abschließen.
5. **Vorgänger liegt nach Nachfolger:** Mit `currentDate=2027-01-04` wurde `dev` auf den 05.01. geplant, vorzeitig abgeschlossen und danach der von `dev` abhängige Schritt `make` am 04.01. erfolgreich eingeplant. Damit ist die Abhängigkeit formal erfüllt, aber der Nachfolger liegt kalenderzeitlich vor dem Vorgänger.

Die vorhandene A02-Regression deckt diese vier Fälle nicht ab und besteht daher, obwohl die genannten Invarianten verletzt werden. Befunde wurden durch gezielte Node-Probes reproduziert; keine Codeänderung erfolgte.

## Ausgeführte Prüfungen

- `node --check prototype/v3-product-lifecycle.js` — **PASS**
- `node --check prototype/v3-product-lifecycle-regressions.mjs` — **PASS**
- `node prototype/v3-product-lifecycle-regressions.mjs` — **PASS** (bestehende Fälle)
- Gezielte Probe für Wochenende, Storno/Neuplanung, vorzeitige Fertigwarenfreigabe, Abschluss vor aktuellem Datum und Vorgänger-/Nachfolgerdatumsfolge — **FAIL** für Runtimeinvarianten; alle fünf Abweichungen reproduziert.
- `git diff --check -- prototype/v3-product-lifecycle.js prototype/v3-product-lifecycle-regressions.mjs docs/simulation/a02-t0066-runtime-arbeitsbericht.md` — **PASS**
- Gitstatus/Branch/HEAD — geprüft; keine A09-Produktdatei geändert. Kein Commit/Push.
- Browser-/Geräte- und Jahreslaufprüfung — **nicht ausgeführt**.

## Nächster Schritt

A02 soll die fünf Zeit-/Lebenszyklusfehler beheben und persistente Regressionen ergänzen. Danach erneut A03-Finanzreview und A09-Re-QA. T-0066 bleibt IN_PROGRESS; A03-Finanzreview, T-0065-Integration sowie A05-UI/Jahreslauf und T-0069-Gates bleiben zusätzlich offen. Keine Nutzerentscheidung aus den Befunden abgeleitet.
