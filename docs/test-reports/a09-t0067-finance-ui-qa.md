# A09 unabhängige QA – T-0067 Kalkulation und BAB-UI

**STATUS:** NICHT BESTANDEN – zwei UI-Fehler können falsche Kalkulations-/BAB-Aussagen zeigen  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0067  
**PRE-FLIGHT:** `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0067, D-0162, A03-Vertrag/Vektoren und A02/A05-Schnittstellen gelesen. Aktiver Kontext ist V3; D-0162 gilt, D-0160 bleibt V2-only. Vorgänger-Checkpoint: CP-0280 Entwurf. Tatsächlicher Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Umfangreiche Änderungen/untracked Dateien anderer Agenten waren bereits vorhanden. `prototype/engine.js` war vor dieser QA bereits geändert; keine Attribution an A03/A05 vorgenommen.  
**PRÜFUNG:** 2026-10-31.

## Prüfumfang und Gates

| Gate | Ergebnis | Nachweis |
|---|---|---|
| D-0162 DB I / direkte Kosten | PASS | V-DB-01 sowie positive/centnahe/negative Grenzfälle; variable Kosten sind explizit `true/false`; direkte Kosten werden getrennt abgezogen. |
| BAB Restcent / stabiler ID-Tie-break | PASS | A03-Verteilungsvektoren und eigene Umordnung der Empfänger bestätigten gleiche Zuordnung bei identischen IDs/Schlüsseln. |
| Satzpräzision / Reconciliation | **NICHT BESTANDEN** | Die UI berechnet Verteilung und Verrechnungssatz über unabhängige, nicht abgeglichene Nenner (Details unten). Ein zulässiges UI-Eingabebild kann deshalb Verteilungsergebnis und ausgewiesenen Satz widersprüchlich machen. |
| Snapshot / Annahme | **NICHT BESTANDEN** | Nach einem früher gültig berechneten Entwurf bleibt `estimate` nach einer fehlgeschlagenen Neuberechnung erhalten; der Snapshot-Button bleibt aktiv und kann die alte Kalkulation mit den neu eingegebenen Kosten-/BAB-Versionen speichern. |
| Plan-/Ist-Perioden vs. Bestände | PASS | Flüsse werden nach Kalendermonat/Jahr gruppiert, Bestände als datierte Snapshots getrennt gehalten; Werte sind manuelle Eingaben ohne Ledger-Lese-/Schreibpfad. |
| Input-Nichtmutation / keine Buchung | PASS | Rechenfunktionen arbeiten mit kopierten/validierten Eingaben; Snapshot-/Annahmeobjekte frieren reine Daten ein und erzeugen keine Cash-/Ledger-/OP-Felder. |
| UI-Routen-/Fehler-/Tastaturstruktur | PASS mit Grenze | Labels, Status-Live-Region, Fehlerpfade und separate V3-Navigation sind statisch/regressionsgeprüft; keine Browser-/Mobileprüfung in diesem QA-Lauf. |
| Trennung von V1/V2 | PASS für neue T-0067-Dateien | Finance-Modul importiert keine Legacy-Engine; A05-UI importiert nur A03-Module. Das bereits geänderte `prototype/engine.js` ist eine vorhandene Fremdänderung und wurde nicht verändert. |

## Blocker 1 – widersprüchlicher Verrechnungssatz zum Verteilungsnenner

In `prototype/v3/finance.js:123-124` verteilt die UI `allocateV3BabPool(...)` nach Empfängerschlüsseln und berechnet anschließend unabhängig `calculateV3BabRate(...)` aus dem separaten Feld `basisValue`. Für den Fall `allocationMode=keys` wird nicht geprüft, ob `basisValue` zur gesamten Schlüssel-/Treiberbasis passt. Die Anzeige nennt beides denselben BAB-Pool, denselben Treibertyp und eine gemeinsame Verteilung.

**Reproduktion (synthetisch):** Pool `10,00 €`, drei Empfänger-Schlüssel `1`, `1`, `1`, Mengentreiber `h`, manuelle Ratebasis `6 h`. Die Verteilung legt je Empfänger `3,33/3,33/3,34 €` über insgesamt 3 Treibereinheiten nahe; die getrennte Satzfunktion zeigt aber `1,67 €/h` (10 € / 6 h). Bei der aus den Empfängerschlüsseln abgeleiteten Gesamtbasis von 3 h wäre der Satz `3,33 €/h`. Das Ergebnis kann so interpretiert werden, als stimmten Satz und Empfängerbeträge überein, obwohl sie verschiedene Bezugsbasen verwenden. A03 Vertrag §4.2/§4.2.1 fordert eine bestätigte periodische Basis und Weiterverwendung desselben ungerundeten Quotienten; die aktuellen Felder/Labels trennen „Gesamtratebasis“ und „Verteilungsschlüsselbasis“ nicht sichtbar.

**Erforderlicher Fix:** Entweder `keys`-Verteilung bei Treibersätzen auf den aus den Empfängerschlüsseln gebildeten Gesamtnenner binden/validieren, oder die zwei fachlich getrennten Basen explizit mit eigenständigen Namen/Einheiten und Hinweis darstellen, sodass klar ist, dass der Satz nicht aus den Empfängerschlüsselwerten folgt. Für `weights`-Modus ist ein separater Gesamt-Treiber möglich, muss aber als solcher ausgewiesen werden. A09 entscheidet keine Accounting-Policy; bei unklarer Fachsemantik muss A03 bestätigen.

## Blocker 2 – Snapshot kann nach fehlgeschlagener Neuberechnung veraltete Kosten speichern

In `prototype/v3/finance.js:14` lebt `estimate` als globale Referenz. Der Fehlerpfad des Kalkulationsformulars bei Zeile 89 zeigt die Fehlermeldung, setzt `estimate` und `estimateLabels` aber nicht zurück und blendet das Snapshot-Form nicht aus. `setSnapshotControls()` schaltet es nach einer ungültigen Eingabe nicht erneut. Das Snapshot-Form prüft in Zeile 150 nur `if (!estimate)`; die alte erfolgreiche Schätzung bleibt somit verwendbar.

**Reproduktionsablauf:** gültige Kalkulation berechnen → Kostenposition oder Preis ungültig ändern → „Kalkulation berechnen“ (Fehleranzeige) → im weiterhin sichtbaren Snapshot-Form neue Kosten-/BAB-Versionen eingeben → Snapshot speichern. Die gespeicherte Kalkulation bleibt der alte Estimate, kann aber neue Versions-IDs tragen. Das verletzt D-0162s Snapshot-Bindung des tatsächlich verwendeten Kalkulations-/BAB-Stands und die Sichtbarkeit eines nicht kalkulierbaren Entwurfs.

**Erforderlicher Fix:** Bei jeder relevanten Entwurfsänderung bisherige Kalkulation als „veraltet“ markieren oder im Fehlpfad `estimate`/Labels leeren und Snapshot-Erstellung bis zu einer erfolgreichen Neuberechnung sperren. Regression: erst valide Berechnung, dann ungültige Neueingabe, Snapshot darf nicht erzeugt werden; nach erfolgreicher Neuberechnung muss der neue Snapshot die neue Kalkulation tragen. Bereits angenommene Snapshots bleiben unangetastet.

## Sonstige Befunde

- Eigenständige API-Probe zeigte, dass `createV3OfferSnapshot` auch ein `calculation`-Objekt ohne `netPriceCents` akzeptiert. Der aktuelle A05-Pfad übergibt den vollständigen Estimate mit Preisfeld und Regressionen bestehen; als Zukunftshärtung sollte A03 prüfen, ob das Preisfeld verpflichtend sein muss. Dies ist kein dritter T-0067-Blocker des aktuellen UI-Pfads.
- `calculateV3OfferEstimate` erlaubt eine leere `directCosts`-Liste; die aktuelle UI verhindert das. Der reine Helfer kann als Nullkosten-Fall nutzbar sein, sofern die UI nicht still fehlende Positionen als Null behandelt.
- A05 Contract-Regression testet Code-/Markupbeziehungen über Textassertions, führt aber keinen DOM-/Browser-Interaktionslauf aus. Ein späterer Browserlauf bleibt für A12/T-0069 separat.

## Ausgeführte Prüfungen

- `node --check prototype/v3-financial-calculation.js` – PASS.
- `node --check prototype/v3-financial-calculation-regressions.mjs` – PASS.
- `node prototype/v3-financial-calculation-regressions.mjs` – PASS.
- `node --check prototype/v3/finance.js` – PASS.
- `node prototype/v3/a05-t0067-regressions.mjs` – PASS; diese statischen/Node-Checks deckten die beiden obigen Interaktionsfehler nicht ab.
- `node prototype/v3-company-formation-regressions.mjs` – PASS (separate bestehende V3-Runtime-Regression).
- Zusätzliche A09-Probe: Restcent-Zuordnung invariant zur Empfänger-Eingabereihenfolge – PASS. Satz/Schlüsselnenner-Mismatch probe – Fehlerpfad reproduziert.
- Snapshot-API-Probe mit fehlendem `calculation.netPriceCents` – wird akzeptiert; vermerkt als Härtungshinweis.
- `git diff --check` – Exit 0; nur vorhandene LF/CRLF-Hinweise.
- Browser-/Mobile-/Touchtest – nicht ausgeführt.
- Commit/Push – nicht ausgeführt.

**Ausführung:** unabhängige A09-QA.  
**Fachreview:** A03-Rechenvertrag und -vektoren geprüft; unabhängiges A03-Fachreview der UI-Fehlerkorrekturen offen.  
**Unabhängige QA:** dieser Bericht; Gesamtgate NICHT BESTANDEN.  
**Browser-/Gerätetest:** nicht ausgeführt.  
**Git-Verifikation:** Branch/HEAD/Status/Diff geprüft; bestehende Änderungen anderer Agenten erhalten; keine Produktdateien geändert.

**Rückfragen an A01:** Keine Nutzerentscheidung erforderlich; A03-Fachklarstellung kann zur Ratebasis nötig sein.  
**Nächster Schritt:** A05 behebt Snapshot-Staleness und grenzt/validiert die Rate-/Verteilungssicht nach A03-Fachklärung; anschließend A09 fokussierter Re-Review. T-0067 bleibt IN_PROGRESS.
