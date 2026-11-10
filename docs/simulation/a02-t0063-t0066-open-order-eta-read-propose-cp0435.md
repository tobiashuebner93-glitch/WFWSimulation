# A02 Read/Propose – T-0066 Shared-Run-Bestellzustand und ETA-Adapter (CP-0435)

**Status:** NONREADY – kein verknüpfter operativer Materialbestellzustand im geprüften Shared Run
**Datum:** 2026-11-01
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063, Anschluss T-0066/T-0069
**Profil:** V3 Shared Run ab 2027-01-04
**Vorgänger:** CP-0433, CP-0434; ETA-Projektionsgrenze A03 CP-0369; Kosten-/Pass-through-Grenze A03 CP-0426; Gap-Audit CP-0351
**Gitbasis:** `main@8b72b7e`; 394 bestehende Statuszeilen (8 geändert, 386 untracked, laut `git status --short`). Alle vorhandenen Änderungen blieben unangetastet. Kein Commit/Push.

## Preflight und Prüfgrundlage

Im autoritativen Checkout wurden AGENTS.md, Agentenstruktur/Rechte, Goals, aktives Ticket-Board, Collaboration State, D-0161–D-0169, V3-Profile, CP-0428–0434, T-0066- und Makroverträge, A03-Finanzübergabe, A08 Gap-Befund sowie die Runtime-/Regressionpfade gelesen. `git status --short` und Branch/HEAD wurden geprüft. Die breite lokale Arbeitsbasis wurde nicht verändert.

Geprüfte Runtime-Module: `prototype/v3-product-lifecycle.js`, `prototype/v3/run.js`, `prototype/v3-run-orchestrator.js`, `prototype/v3-macro-trade-impact.js`, dazu `prototype/v3-macro-trade-impact-regressions.mjs` und `prototype/v3-run-operating-impact-regressions.mjs`. Es wurde kein Produktcode geändert und kein neuer Testlauf als Implementierungsbeleg behauptet.

## Befund: keine reale Bestellreferenz

Der ETA-Projektor `projectDeliveryEta()` in `prototype/v3-macro-trade-impact.js` liest ausschließlich `event.openShipments[]` aus dem expliziten Makroevent `international_supply`. Ein Eintrag benötigt `orderRef`, `status: "open"`, `currentEta` und eine positive synthetische `delayDays`; doppelte `orderRef`s werden übersprungen. Das Ergebnis ist `openPurchaseOrderEta` mit der verschobenen ETA und Referenz. Das ist ein Makroevent-Input/Fixture, kein Lookup auf einen operativen Shared-Run-Bestellbestand.

Die T-0066-Produktzustände in `prototype/v3-product-lifecycle.js` enthalten Personen, Ausrüstung, Materialmengen, Produktions-Commitments, Produkt-/Kundenarbeitspläne und deren Arbeitsschrittstatus (`planned`, `completed`, `cancelled`). Geplante Arbeit reserviert bzw. abgeschlossene Arbeit verbraucht vorhandene Materialmenge. In dem geprüften Produktzustand gibt es keine Lieferantenbestellung mit Statusübergängen, Lieferant, bestellten Materialpositionen/-mengen, Vertrags-/Preis-Snapshot oder erwarteter Liefer-ETA. Der Orchestrator verbindet diese Bestände nicht mit `openShipments[]`. Eine `orderRef` aus dem Makrofixture kann daher weder eindeutig auf eine vorhandene Bestellung noch auf Material, Menge oder eine operative ETA geprüft werden.

A03 hat denselben Grenzbefund bereits in CP-0369 bestätigt: `openShipments` wird als Makroinput übergeben; es erfolgt kein Lookup/Abgleich mit operativer Beschaffungsverwaltung. `projectDeliveryEta()` ist also als isolierte nichtbuchende Projektion gültig, erfüllt aber die CP-0434-Voraussetzung einer echten T-0066-Bestellung nicht.

**Adapterstatus:** Ein Adapter ohne API-/Schema-/Architekturänderung ist nicht möglich. Er müsste eine nicht vorhandene kanonische Bestell-ID, Material-/Mengenzeilen, Lifecyclestatus und ETA-Quelle erfinden oder aus Produktionsmaterialverbrauch ableiten. Beides wäre ein künstlicher Beschaffungszustand und würde die gesetzte Grenze verletzen. Auch Destatis-Importpreise liefern keine ETA-Ursache und bleiben gemäß CP-0428–0433 Referenz.

## Geltungsgrenzen / A03-Eingaben

Es wird keine Lieferzeit, Verzögerungszahl oder Bestellregel ausgewählt. Vor jeder späteren ETA-Implementierung muss A02 zuerst auf einen tatsächlich vorhandenen, replaygebundenen Bestellvertrag verweisen können. A03 benötigt danach mindestens den abgegrenzten Status- und Ereignisvertrag (geplant/angenommen/offen/erhalten/storniert), Bestell-/Lieferantenreferenzen, Materialpositionen und Mengen, erwartete ETA/Quelle sowie Snapshotreferenzen. A03 prüft dann explizit, dass eine reine ETA-Änderung weder Menge/Wareneingang/Bestand noch Lieferantenpreis/-vertrag, Rechnung, BAB/COGS, Finance/Ledger/Cash verändert. Dieses Berichtsergebnis ist keine A03-Freigabe.

## Nächste Anschlussoption

Wenn A01 den Makro-Unternehmenspfad weiterführen möchte, ist der bereits vorhandene `getV3RunOperatingImpact()` in `prototype/v3/run.js` die belastbarere Anschlussoption: Er rekonstruiert aus bestehenden D-0169-Wochenschedules, realen Marktanfragen, tatsächlichen Spieleraufträgen und vorhandenen Arbeitsplänen die Kette Anfragen → gewonnene Aufträge → geplante Stunden → deklarierte Werktagskapazität/Auslastung. Die Funktion erzeugt keine zweite Nachfragequelle, keine Buchung und keine Finanzwirkung. Sie kann als integrierter Outcome der schon vorhandenen Nachfrage-/Kapazitätswirkung genutzt und geprüft werden; sie ersetzt keine Lieferstörungs-ETA und beweist keine Beschaffungslogik.

Mindestprüfungen für diese Anschlussoption sind bereits im betreffenden L0/L1-Testpfad abzulesen: neutraler/makroexponierter Run, keine Zusatzanfragen neben D-0169, nur wirkliche Spieler-Awards und vorhandene Arbeitspläne, Restore-Reproduzierbarkeit, manipulierte Projektion ignoriert, FinanceState/Run unverändert. CP-0357–0362 dokumentieren diese Grenzen und frühere Regressionsergebnisse; dieser Read/Propose-Auftrag hat sie nicht erneut ausgeführt.

## Ergebnis und Übergabe

- **ETA auf echter Materialbestellung:** NONREADY; keine operative Bestellung/ETA im Shared-Run-Modell nachgewiesen.
- **Bestehender möglicher Unternehmensanschluss:** `getV3RunOperatingImpact()` (vorhandene Nachfrage-/Auftrags-/Planstunden-/Kapazitätsprojektion), ohne neue Objekte oder zweiten Nachfragefaktor.
- **Finanz-/Lagergrenze:** unverändert; keine Preis-, Menge-, Eingang-, Bestand-, Rechnung-, BAB/COGS-, Finance-, Ledger- oder Cash-Mutation.
- **Rückfrage:** keine Nutzerentscheidung erforderlich. Der nächste Schritt ist eine A01-Steuerungsentscheidung, ob der vorhandene L0/L1-Outcome-Pfad als nächstes geprüft/integriert werden soll.
- **Keine Freigaben:** kein A03-Re-Review, A09-Review, UI-, Jahres-, Browser-, Architektur-, Schema- oder Release-PASS behauptet.
