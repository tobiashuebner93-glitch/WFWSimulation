# A05 – T-0067 BAB-Angebotskalkulation in der Run-UI

**Status:** UI-Adapter umgesetzt; Fach- und adversarial Review ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Tickets:** T-0067 / T-0069  
**Profil:** V3, Laufdatum durch den aktuellen Simulationstag; Periodenbindung `YYYY-MM`  
**Entscheidungen:** D-0159, D-0161–D-0164; insbesondere D-0162  
**Vorgänger:** CP-0293 (ENTWURF)  
**Basis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Änderung

`prototype/v3/run.js` ruft nun `calculateV3OfferWithBab` statt der älteren Schätzung mit manuell eingegebenem BAB-Betrag auf. Die Angebotsmaske nimmt einen Netto-Angebotspreis, Kosten-/BAB-Version, direkte Kosten als JSON, BAB-Quellkostenpools als JSON und Auftrags-Treiber als JSON auf. Direkte Kosten können ausdrücklich als leeres Array (`[]`) erfasst werden; jeder erfasste Posten braucht stabile ID, Eurobetrag und explizites `variable`-Boolean.

Die UI-Grenze wandelt `poolEuro` und direkte Kosten in validierte Cent um; die gemeinsame `weights`-Treiberbasis ist eine physische Mengenbasis und bleibt als expliziter Dezimalwert mit Einheit erhalten. Auftragsperiode wird vom geöffneten Simulationstag abgeleitet; Pools, `rateBasis` und Treiber müssen diese Monatsperiode mitführen. Bei `weights` gibt es genau eine gemeinsame positive `rateBasis: { basisKind: 'driver', value, unitLabel, period }` je Pool. Die UI leitet die Empfängerbasen exakt als `value × weight` ab und zeigt diese an. `recipientRateBases` und unterschiedliche h/kg-Basen werden fail-closed abgewiesen; die Auftragstreiber müssen dieselbe Einheit nutzen und innerhalb des gewichteten Anteils liegen. Fehlende Arrays, IDs, Versionen und Perioden-/Einheitenfehler werden abgewiesen. Es gibt keine Null-/Standardpools, vorgeschlagenen Zuschlagssätze, stillen Kostenklassifikationen oder SimTAX-Berechnung.

Kalkulation und vollständiger BAB-Snapshot laufen über `createV3OfferSnapshot` und werden dem bestehenden `submitV3RunOffer`-Pfad übergeben. Die Kundenannahme ändert den Kalkulationssnapshot nicht. Der Adapter bleibt ein Plan-/Kalkulationsschritt; er erzeugt keine Buchung, Cashbewegung, Forderung, Rechnung, Steuer oder Ledgerwirkung.

### Eingabeformat der Maske

- Direkte Kosten: Array aus `{ "id", "amountEuro", "variable" }`.
- BAB-Pool: A03-Schemafelder einschließlich `poolId`, `sourceCostCenterId`, `costBasisId`, `period`, `allocationMode`, `recipients`; UI-Währungsfeld heißt `poolEuro`. `keys` braucht eine gemeinsame `unitLabel`; die Summe der physischen Schlüssel ist der Satzbasisnenner. `weights` braucht eine gemeinsame physische `rateBasis` mit positiver `value`, `unitLabel` und identischer `period`; es gibt keine unabhängigen Empfängerbasen.
- Auftrags-Treiber: je Pool-/Empfängerpaar eine Zeile mit `period`, `basisKind` und expliziter Treibermenge samt passender Einheit. Bei `weights` darf die Menge die exakt aus `rateBasis.value × weight` abgeleitete Empfängerbasis nicht überschreiten.

Nach Angebotsabgabe zeigt die Anfrage eine schreibgeschützte `<details>`-Aufschlüsselung aus dem gespeicherten Angebotssnapshot: Kostenstand- und BAB-Standkennung, Quellpool und Quellkostenbasis-ID, Periode, Verteilungsmodus, Schlüssel/Gewichte, centgenaue Poolanteile, Angebots-BAB je Empfänger und die Abweichung der Quellpool-Reconciliation. IDs und Kennungen werden escaped dargestellt. Bei gültiger Basis erscheinen der exakte Satzquotient und die gerundete Anzeige samt Einheit; bei fehlender Basis erscheint kein Satz. 0 Cent wird explizit als „0 Cent · abgestimmt“ angezeigt. Die Details bleiben nach Kundenannahme Teil des unveränderten Snapshots. Darstellung als responsive Liste, keine breite Tabelle.

Der kontrollierte A01-Viewport-Smoke fand nach der BAB-Ansicht eine schmale Layoutkante: das Statusbadge „Nur bei geöffnetem Tag“ im Angebotskopf lief bei 390×844 rechts über den sichtbaren Inhaltsbereich hinaus. A05 korrigierte die mobile Angebotskopfzeile auf flex-wrap und erlaubte dem Badge Umbruch. Eine CSS-Regression schützt diese Regel. Erneute Messung im echten IAB-Viewport steht A01 noch aus.

Beim anschließenden mobilen Scroll-Smoke überlagerte der sticky Live-Statushinweis kurzzeitig den scrollbaren Inhalt. Für Viewports bis 700px steht `.live-status` jetzt im normalen Dokumentfluss statt sticky/fixed; `role="status"` und `aria-live="polite"` im Markup bleiben erhalten. Eine CSS-Regression sichert die mobile Flow-Position. Der echte IAB-Retest zur Überdeckungs-/Bedienprüfung ist noch durch A01 auszuführen.

Die UI zeigt das JSON-Schema als Platzhalter/Instruktion. Es erfindet keine Kostenstellen, Pools, Schlüssel, Treibermengen oder Ratenbasen.

## Nachweise

- **Ausführung:** A05; `prototype/v3/run.js` und `prototype/a05-t0069-run-ui-regressions.mjs` geändert.
- **A05-Regression:** PASS; `keys`-Submission, `weights` mit gemeinsamer Ratebasis und proportional abgeleiteten Empfängerbasen, fail-closed ohne gemeinsame Basis, Abweisung unabhängiger `recipientRateBases` (h/kg), Abweisung gemischter Auftragstreibereinheiten, sichtbare Quellpool-/Empfänger-/Rate-/0-Cent-Aufschlüsselung, kein Satz ohne Basis, Provenienz mit `costBasisId`, `costVersion` und `babVersion`, escaped IDs/Kennungen, Submission sowie unveränderter read-only Snapshot nach Annahme; CSS-Assertions für Badge-Umbruch und nicht überlagernde mobile Live-Statusposition.
- **Angrenzende Regressionen:** `prototype/v3-financial-calculation-regressions.mjs`, `prototype/v3-market-simulation-regressions.mjs`, `prototype/v3-run-orchestrator-regressions.mjs` – PASS.
- **Syntax:** `node --check prototype/v3/run.js` und `node --check prototype/a05-t0069-run-ui-regressions.mjs` – PASS.
- **Unabhängiges Fachreview A03:** nicht ausgeführt; angefragt als nächster Schritt.
- **Unabhängige QA A09:** nicht ausgeführt; nach A03-Review angefragt.
- **Browser-/Gerätetest:** A01 meldete 390×844-IAB-Overflow im Angebotsbadge und anschließende kurze Überlagerung durch den sticky Live-Statushinweis; nach den jeweiligen CSS-Fixes steht der IAB-Retest noch aus.
- **Git-Verifikation:** `git diff --check` Exit 0; nur bestehende LF→CRLF-Hinweise. Gesamter Arbeitsbaum enthält umfangreiche Änderungen aus anderen Tickets; diese blieben erhalten.
- **Commit/Push:** nicht ausgeführt.

## Offene Punkte

1. A03 muss bestätigen, dass die UI-normalisierten Währungsfelder und generische JSON-Eingaben die fachliche D-0162-Grenze ohne unzulässige Vereinfachung abbilden.
2. A09 muss die fail-closed Grenzen adversarial prüfen, insbesondere manipulierte/lückenhafte Pool- und Treiberlisten, Geldratenbasen und Angebots-/Annahme-Replay.
3. A01 führt nach diesen Reviews einen Browser-/mobilen Bedien-Smoke aus.

T-0067 und T-0069 bleiben `IN_PROGRESS`; diese UI-Integration ist keine dynamische Ist-BAB-/Ledgerbuchung und kein Jahreswirtschaftlichkeitsnachweis.
