# A09 Shared-Run-QA – T-0069 Orchestrator

**Status:** NONPASS – shared clocks and replay/history validation have reproducible defects  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**V3-Profil:** Start 2027-01-04; vier Konjunkturlagen mit jeweils mindestens zwölf Monaten als Gesamtgate noch nicht ausgeführt  
**Entscheidungen:** D-0159, D-0161–D-0164  
**Vorgänger:** CP-0282 (ENTWURF), CP-0281/CP-0280 (ENTWURF)  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`

## Preflight und Umfang

AGENTS.md, Agentenstruktur/-Rechte, MG-002-Ziele, Ticket Board, Collaboration State, Decision Log, CP-0282, A02s Choreografie/Arbeitsbericht, A03s Handoff-Matrix sowie A11s Integrationsanalyse wurden gelesen. A03s Finanzruntime wird separat von A09 geprüft; hier wurde sie nicht re-reviewt. Der Working Tree enthält zahlreiche bestehende lokale Änderungen; dieser Auftrag änderte nur den vorliegenden QA-Bericht.

Prüfobjekte: `prototype/v3-run-orchestrator.js`, `prototype/v3-run-orchestrator-regressions.mjs` und ihre Grenzen zu Markt-, Makro- und Produktmodulen. Keine Schema-/Architekturfreigabe und keine Produktkorrektur.

## Testausführung

- `node prototype/v3-run-orchestrator-regressions.mjs` – **PASS**.
- `node --check prototype/v3-run-orchestrator.js` – **PASS**.
- A09-adversariale Proben gegen exportierte APIs und restaurierbare Zustände – **NONPASS** in vier Befundgruppen unten.
- `git diff --check -- prototype/v3-run-orchestrator.js prototype/v3-run-orchestrator-regressions.mjs` – **PASS**.

## Reproduzierbare Befunde

### RUN-01 – Produktmodul kann nicht an einem gültigen gemeinsamen Starttag hängen

`createV3ProductState` verlangt einen `currentDate`; `createV3Run` akzeptiert ausschließlich `productState.currentDate === startDate`. Das erzeugte Run hat aber `currentDate = startDate − 1`. `validateV3RunState` fordert gleichzeitig `productState.currentDate <= shared currentDate`. Mit dem einzigen von `createV3Run` akzeptierten Produktdatum schlägt bereits die anschließende Runvalidierung fehl; mit `startDate − 1` scheitert `createV3Run`. Probe mit `startDate=2027-01-04`: `PRODUCT_CLOCK_REJECTED product module identity/date is inconsistent with shared run`.

**Folge:** Kein gültiger integrierter Lauf kann derzeit einen T-0066-Produktzustand enthalten. Das widerspricht dem gemeinsamen Run-/Clock-Ziel, nicht einer Fachregel.

### RUN-02 – Makromodulzustand kann zeitlich weit vor dem Shared Run liegen

`createV3Run`/`validateV3RunState` prüfen beim Makromodul Identitäten, aber keine Periodenrelation zu `startDate/currentDate/endDate`. Ein identitätsgleicher synthetischer Macro-State mit abgeschlossenen Perioden bis `2028-02` wurde für einen Shared Run ab `2027-01-04` akzeptiert; `validateV3RunState` gab `true` zurück, obwohl der Shared Run noch auf `2027-01-03` stand.

**Folge:** Ein wiederhergestellter oder falsch zusammengesetzter Macro-State kann Zukunftsperioden enthalten, ohne als inkonsistent erkannt zu werden. Makro-Monatsinputs sind außerdem optional, sodass ein Lauf ohne Monatsdaten fortgesetzt werden kann. Vor dem Jahresgate muss die Integration fehlende/zu weit vorausliegende Perioden erkennen und nur zeitlich passende Snapshots exponieren.

### RUN-03 – Doppeltes Marktangebot erzeugt doppelte Run-Historie

Eine valide Inquiry am 2027-01-04 erhielt zweimal dieselbe valide `offer`-Nutzlast mit demselben `eventId` innerhalb des Tagesinputs. Die Marktengine behandelte den zweiten Aufruf idempotent, aber der Orchestrator schrieb beide Resultate in `dayEvents`.

**Reproduktionsergebnis:** `DUPLICATE_OFFER_EVENT_LOG 2 1 true` (zwei Historieneinträge mit einer eindeutigen ID; Validator akzeptiert den Zustand).

**Folge:** Modulzustand ist einmal geändert, Run-Eventlog weist dieselbe Angebotsaktion doppelt aus. `validateV3RunState` fordert keine runweite Einmaligkeit sämtlicher Event-IDs und kann so beschädigte/duplizierte Replayhistorie nicht abweisen.

### RUN-04 – Validator akzeptiert unbelegte Work-Order und als gebucht markierten A03-Handoff

Zu einem gültigen leeren Run wurden eine synthetische Work-Order ohne passendes entschiedenes/won Inquiry und ein `financeHandoff` mit `status='posted'`, ohne passende Quelle/Run-Entscheidung, ergänzt. `validateV3RunState` akzeptierte den manipulierten Zustand (`ORPHAN_POSTED_HANDOFF_ACCEPTED true`).

**Folge:** Die Validierung prüft nur eindeutige WorkOrder-/Decision-/Handoff-IDs, nicht ihre Herleitung aus dem Marktentscheid bzw. die festgelegte `pending_non_posting`-Grenze. Damit kann ein defekter Saved-/Replayzustand einen nicht autorisierten Postingstatus behaupten.

## Verträge / abgegrenzte PASSes

- Markttages-API verarbeitet bestehende Entscheidungsphase vor neuen Anfragen, Einreichung nach Tagesöffnung und Ablauf beim Tagesabschluss; die vorhandene Baseline und das T-0069-Regressionsszenario bestehen.
- Kalenderdaten gehen fortlaufend Tag für Tag; an Wochenenden wird das Produktmodul nicht vorgerückt, während Markttagesentscheidungen nach Kalenderdatum weiterlaufen.
- Angenommene Spielerangebote erzeugen in der getesteten Baseline genau einen Work-Order-Referenzdatensatz. Der Datensatz bleibt `awaiting_operational_plan`, die Finanzübergabe `pending_non_posting`; A02 verändert keinen `cash`-/`ledger`-State. Dies ist kein Nachweis einer Produktions-, Lieferung-, Abnahme- oder A03-Finanzintegration.
- Same-day-Angebote werden nicht rückwirkend vor dem Angebotsereignis entschieden; kein getesteter Lauf bucht am selben Tag.

## Nachweisrollen und Übergabe

- **Ausführung:** unabhängige A09-Codeprüfung und adversariale API-Proben.
- **Fachreview:** A02-Selbstreview PASS gemäß Arbeitsbericht; fachliche Korrektur der NONPASS-Punkte durch A02 ausstehend.
- **Unabhängige QA:** **NONPASS** (RUN-01 bis RUN-04).
- **Browser-/Gerätetest:** nicht ausgeführt; keine integrierte UI-Route.
- **Git-Verifikation:** aktueller Status/HEAD im Root-Checkout geprüft; bestehende lokale Änderungen erhalten. Kein Commit/Push.
- **Nächster Schritt:** A01 beauftragt A02, die Clock-, Event-ID-/Replay- und WorkOrder-/Finance-Handoff-Validierung zu beheben und Regressionen zu ergänzen. Danach A09-Re-Review. Die Finanzruntime-F-01/F-02-Review bleibt ein getrenntes Gate.
