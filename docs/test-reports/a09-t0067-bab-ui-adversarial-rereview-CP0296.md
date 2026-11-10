# A09 Adversarial Re-Review – T-0067 BAB-UI nach A02 Snapshotbindung

**Status:** PASS für die lokale Restore-/Replay-Konsistenzinvariante; keine Sicherheits-/Authentizitätszusage  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Tickets:** T-0067 / T-0069  
**Profil/Periode:** V3, aktiver Angebotstag, BAB-Periode `YYYY-MM`  
**Entscheidungen:** D-0159, D-0161–D-0164, insbesondere D-0162 und Snapshot-Freeze  
**Vorgänger:** CP-0296 (ENTWURF)  
**Preflight:** ab CP-0296; AGENTS, agent structure/right matrix, goals, ticket board, collaboration state, decision log, BAB-Vertrag §4.1.1, A02-Fixbericht, A03-Re-Review, A05-UI-Bericht und aktueller Gitstatus/Diff gelesen.

## Pflege der alten A09-Regression

Vor der Anpassung lief `node prototype/a09-t0069-run-ui-adversarial-regressions.mjs` an Zeile 14 aus: Die alte Regression erwartete `variableCost` und übergab `directCost`/`babAllocated`, während die aktuelle A05-API in `prototype/v3/run.js:53–78` `directCostsJson`, `sourcePoolsJson` und `offerDriversJson` erwartet. Der reproduzierte Fehler war `Direkte Kosten: gültiges JSON-Array eingeben.` – ein veralteter Testvertrag, kein Nachweis, dass A05 eine ungültige Kostenklassifikation angenommen hätte. README.md enthält keine entgegenstehende V3-APIbeschreibung; der maßgebliche aktuelle Eingabevertrag steht im A05-Bericht `docs/simulation/a05-t0067-bab-ui-arbeitsbericht.md`.

Nur die QA-Datei `prototype/a09-t0069-run-ui-adversarial-regressions.mjs` wurde aktualisiert. Sie sendet nun aktuelle vollständige BAB-Submission-Felder mit `variable: "tampered"` und verlangt die fail-closed Ablehnung. Zusätzlich prüft sie Offer-Submission, Kosten-/BAB-Versionen in der Bindung, Ereignisreferenz, one-sided und paired Snapshotmutation, idempotente Wiederholung, eine einzige Offer-Historie und keine Finanz-Handoffs/Posting.

## Adversariale Befunde

### Snapshotbinding – beide einseitigen und gepaarten Manipulationen abgewiesen

Die gültige Submission erhält genau einen Market-`submit_offer`-Event und einen Shared-Run-Event, dessen `sourceRef` auf dessen `payload.eventId` verweist. `result.snapshotBinding` enthält passende `modelVersion`, `offerId`, Datum, Nettopreis, `costVersion` und `babVersion`. Die A09-Probe mutiert jedes Feld `costVersion` und `babVersion` jeweils:

1. nur in `offer.calculationSnapshot`, und
2. parallel in `offer.calculationSnapshot` und im `submit_offer`-Payload.

Alle vier Fälle wurden von `validateV3RunState`/Market-State-Validation abgewiesen. Das getrennte Submission-Resultat blieb dabei unverändert. Das entspricht dem von A02 dokumentierten Fix in `prototype/v3-market-simulation.js:11–20,125–126,308–343` und A02s Run-/Market-Regression.

### Idempotenz, Quellenbindung und Financegrenze

Erneute identische Angebotsabgabe wurde als Duplikat akzeptiert, erzeugte aber weder einen zweiten Market-Submit-Event noch einen zweiten Shared-Run-Offer-Event. `financeHandoffs` blieben leer; der zulässige Eventpfad enthielt keine Buchungs-/Cash-/Ledgerphase. Die Submission-Quelle blieb mit Inquiry-ID, Player-Firm-ID und stabilem Offer-ID verknüpft.

## Konsistenzinvariante, keine Sicherheitsgarantie

Der PASS bedeutet nur: **Inkonsistente Änderungen an Snapshotkopie und Submission-Payload werden gegen das separat gespeicherte Submission-Resultat erkannt.** Da Offer, Payload, `snapshotBinding`, Market-Eventresultat und Shared-Runresultat vollständig im lokalen Clientzustand liegen, kann ein Angreifer mit Kontrolle über den gesamten lokalen Zustand auch diese übrigen Kopien gemeinsam ändern. Ohne extern vertrauenswürdigen Anker beweist die UI keine Authentizität und bietet keine kryptografische Manipulationssicherheit. A02s Bericht `docs/simulation/a02-t0069-run-orchestrator-arbeitsbericht.md` benennt diese Grenze korrekt. Ein signiertes oder serverkontrolliertes append-only Commitment wäre spätere Architektur-/Persistenzarbeit; hier nicht implementiert oder freigegeben.

## Ausführung und Reviewrollen

- **A09 Testpflege:** nur die alte A09-Regressionsdatei auf aktuellen API-Vertrag umgestellt; kein Produktcode geändert.
- **`node --check prototype/a09-t0069-run-ui-adversarial-regressions.mjs`:** PASS.
- **`node prototype/a09-t0069-run-ui-adversarial-regressions.mjs`:** PASS; current API, classification fail-closed, Versionsbindung, beide Mutationstypen, Replay-Idempotenz und Nonposting geprüft.
- **`node prototype/a05-t0069-run-ui-regressions.mjs`:** PASS.
- **`node prototype/v3-financial-calculation-regressions.mjs`:** PASS.
- **`node prototype/v3-finance-runtime-regressions.mjs`:** PASS.
- **`node prototype/v3-market-simulation-regressions.mjs`:** PASS.
- **`node prototype/v3-run-orchestrator-regressions.mjs`:** PASS.
- **`git diff --check`:** Exit 0; nur bestehende LF→CRLF-Hinweise in anderen Dateien.
- **A03-Fachreview:** separat PASS, belegt in `docs/accounting/a03-t0067-bab-ui-rereview-CP0295.md` und CP-0296; von diesem A09-Nachreview nicht ersetzt.
- **A02-Fix / Regression:** Bericht nennt lokale Konsistenzprüfung und Grenzen; nicht von A09 implementiert.
- **Browser-/Geräteprüfung:** nicht ausgeführt. Nach diesem PASS kann A01 den kontrollierten Browser-/Viewport-Smoke vornehmen.
- **Git-/Commit-/Push:** aktueller Arbeitsbaum enthält viele Änderungen aus anderen Aufgaben; diese blieben erhalten. Kein Commit oder Push.

## Ergebnis und Folge

Der frühere A09-Befund zu gleichzeitiger Mutation von Offer-Snapshot und Submission-Payload ist durch das unabhängige `snapshotBinding` geschlossen, solange dessen Submission-Resultat unverändert bleibt. A09 vergibt PASS für diesen begrenzten lokalen Konsistenzvertrag; kein Security-PASS und keine Releasefreigabe. **Nächster Adressat: A01** für kontrollierten Browser-/Viewport-Smoke der Angebotsmaske, gespeicherten BAB-Aufschlüsselung, Kundenannahme, Snapshoterhalt und responsiven Darstellung. T-0067/T-0069 bleiben wegen anderer Geschäftsprozess-/Ist-Finanz-/Jahresgates offen.
