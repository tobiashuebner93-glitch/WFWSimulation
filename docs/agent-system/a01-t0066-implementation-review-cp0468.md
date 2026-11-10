# A01 – T-0066 Implementierungs- und Review-Abgleich (CP-0468)

**Status:** G1–G9 PASS reviewed; FIFO-Entscheidung bestätigt und Adapter implementiert; G10 NONPASS bis Quellenbindung und unabhängige Reviews  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Ticket:** T-0066 / MG-002 / SLG-002.2  
**Basis:** CP-0467, HEAD `8b72b7e` auf `main`; breite vorhandene lokale Änderungen erhalten

## Ergebnis

Die zehn Gates aus [T-0066/0067-Mindestziele](a01-t0066-t0067-mindestziele.md) wurden gegen aktuellen Code, Regressionen und Reviews abgeglichen. **Gates 1–9 sind erfüllt und von A02/A09 geprüft. Gate 10 ist weiterhin offen; T-0066 bleibt IN_PROGRESS und erreicht noch kein 10/10.**

### Korrekturen in diesem Lauf

- Eigenproduktannahmen erzeugen jetzt pro Los eine datierte Mengenreservierung mit null physischem Mengenabgang. Der Versand baut danach genau die zugehörige Reservierung und physische Menge ab.
- Lagerbewegungen führen je Los physische, reservierte, quarantänisierte und verfügbare Basismengen samt Roll-forward. Produkt-Snapshots enthalten explizite Lagerumrechnung, Basiseinheit, Kapazitätseinheit und Quellenreferenzen.
- Ressourcen-, Material- und Lagerablehnungen enthalten wirksame Ressource und Datum und hinterlassen keinen mutierten Zustand. Motivation und Ausstattung prüfen Effizienzfaktor und Planstunden. Produkt-Skillkontrolle, abgeschlossener Schritt-Replay sowie JSON-Speichern/Wiederherstellen sind regressionsgesichert.
- Angenommene Produkte mit positivem und negativem DB I sowie Ergebnis nach BAB werden im Shared Run mit Kundenauftrag verarbeitet, durch Käufer entschieden und ausgeliefert. Die Pläne, Angebots-Snapshots, Kosten-/BAB-Versionen und Perioden bleiben prüfbar.
- Eine Finance-Testfixture hatte null Fertigwarenkapazität für zwei erzeugte Stücke; Kapazität 2 passt jetzt zum Testfall.
- Nach der Nutzerbestätigung von A03s FIFO-Empfehlung wurde `v3-product-costing.js` ergänzt: belegte Fertigwarenkosten werden in FIFO-Losen geführt und beim Versand centgenau abgebaut. Der Run-Adapter schreibt den Kostenbeleg und COGS-Bewegungen replay-sicher und nichtbuchend. Das V3-Produkt-UI erfasst die vier §4a-Kostenkomponenten samt Referenzen und zeigt einen bewerteten FIFO-COGS-Betrag ohne Postingbehauptung.

## Review-Matrix

| Gate | Ergebnis | Nachweis |
|---|---|---|
| G1 Produkte bis Käuferannahme und Versand | PASS | A02/A09: Zwei eigene Produkte, positiver und unwirtschaftlicher Fall, realer Kundenauftrag im integrierten Shared Run; beide Produktverkäufe angenommen und versandt |
| G2 Qualifikation | PASS | Positiv-/Negativpaar ändert nur Skills; fehlender Skill fail-closed, ohne Mutation |
| G3 Motivation | PASS | Faktor steigt bei höherer Motivation, Planstunden sinken; simulierter Zeitbeleg bleibt klar als Simulation markiert |
| G4 Ausstattung | PASS | geeignete Ausstattung erhöht Produktivitätsfaktor; inkompatible Maschine blockiert ohne Mutation |
| G5 gemeinsame Kapazität | PASS | getrennte Person-/Maschinen-/Material-/Lagerkontrollen und unveränderte Ablehnungszustände; integrierter Shared Run |
| G6 Prozessfolge, Replay, Save/Restore | PASS | Vorgängerfolge, idempotenter Schritt-Replay, JSON-Round-trip für Produkt-/Assignment-/Snapshot-IDs und Termine |
| G7 Ergebnisfälle | PASS | explizit positiver/negativer DB I und Nach-BAB-Wert in Plan und Käufer-Snapshot |
| G8 dynamischer BAB und Snapshot | PASS | 0-Cent-Poolabgleich, unveränderlicher Snapshot, Restore von Periode/Version |
| G9 Mengen-/Reservierungs-/Quarantänebelege | PASS | explizite Einheiten-/Quellenumrechnung und je Los physisch/reserviert/quarantänisiert/verfügbar; A09 bestätigt |
| G10 COGS-Abstimmung | NONPASS / Implementiert, Fachreview offen | FIFO-Schicht, Versandabgang und centscharfe FIFO-Regression sind vorhanden. Die UI nimmt Beträge und Quellen-IDs entgegen; die Referenzen sind noch nicht mit tatsächlichen Beschaffungs-/Lohn-/Maschinen-/Ist-BAB-Quellen im Run verknüpft. A03 muss die Belegbindung fachlich prüfen. |

## Agentenreviews

- **A02:** G1–G9 PASS; Produktivitäts-/Qualifikations-, Ressourcen-, Restore-, BAB- und Bestandsbelege geprüft. Keine Änderungen durch A02 in diesem Re-Review.
- **A09:** G1–G9 PASS; unabhängige Code-/Testprüfung. Kein visueller Browserlauf durch A09 behauptet.
- **A03 (vor der Nutzerbestätigung):** Mengenreservierung, Versand und Nichtbuchungsgrenze PASS; FIFO für Fertigwarenlose empfohlen. Ein A03-Re-Review des neu implementierten FIFO-Adapters und seiner Quellenbindung steht aus. Plan-BAB wird ausdrücklich nicht als Istkostenbasis benutzt.
- **A05:** automatisierte T-0066-UI-Regression PASS. Visueller Browser-Smoke nicht ausgeführt: CUA meldete `browser.user is unavailable`; Playwright/Puppeteer sind im Checkout nicht installiert.

## Gate-10-Fachstand

A03 bestätigt den bestehenden §4a-Spiel-KLR-Vertrag: tatsächlicher Materialverbrauch, direkte Fertigungsarbeit, Maschinenleistung und angemessene Fertigungsgemeinkosten bilden die Herstellkosten; bei vollständigen Quellen kann eine nichtbuchende Spiel-KLR-Abstimmung freigegeben werden. Das ist keine handelsrechtliche Bilanzierungs- oder Postingfreigabe. Gesetzlicher Rahmen: [HGB §255](https://www.gesetze-im-internet.de/hgb/__255.html), [HGB §256](https://www.gesetze-im-internet.de/hgb/__256.html), [HGB §253](https://www.gesetze-im-internet.de/hgb/__253.html).

Der Nutzer hat A03s FIFO-Empfehlung ausdrücklich bestätigt und D-0170 dokumentiert sie für V3. Der nichtbuchende Adapter summiert Material-, direkte Fertigungs-, Maschinen- und Fertigungsgemeinkosten in expliziten Centbeträgen, bindet ein bewertetes Los an abgeschlossene Produktionszuweisungen und belastet beim Versand die älteste Schicht zuerst. Teilentnahmen halten Rundungsreste im Restlos; die letzte Entnahme löst sie auf. Fehlende Bewertung bleibt `pending`, Versand wird dadurch nicht blockiert. Planwerte werden nicht als Ist übernommen.

Die aktuellen UI-Quellenreferenzen sind vom Nutzer eingegebene Kennungen. Sie sind noch nicht technisch an Materialzugangs-/Entnahmebelege, tatsächliche Arbeits-/Maschinensätze oder einen Ist-BAB-Pool im Unternehmens-Run gebunden. Damit fehlt weiterhin der belastbare Nachweis, dass die erfassten Beträge aus realen Spielereignissen folgen. A03 muss diese Quellengrenze prüfen und den Adapter re-reviewen; A09 muss adversarial re-reviewen. Erst danach kann G10 als PASS gelten.

## Prüfungen und Git-Arbeitsstand

Bestanden: `node prototype/v3-product-costing-regressions.mjs`, `node prototype/v3-product-lifecycle-regressions.mjs`, `node prototype/v3-run-orchestrator-regressions.mjs`, `node prototype/v3/a05-t0066-product-ui-regressions.mjs`, `node prototype/v3-finance-runtime-regressions.mjs`, Syntaxchecks und scoped `git diff --check`. HTTP liefert `run.html` mit Status 200; CUA-Browserzugriff bleibt nicht verfügbar, daher kein visueller Smoke.

Branch `main`, HEAD `8b72b7e`; der vorhandene Arbeitsbaum blieb erhalten. Keine Commit-/Push-Aktion.
