# A02 – T-0082 synthetischer SPI-Basiswechsel

**Status:** Implementierung und fokussierte Regression bestanden; unabhängige A03-/A09-Re-Reviews ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0082 / T-0063 G6
**Basis:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; lokale Änderungen erhalten.

## Preflight

Vor Arbeitsbeginn wurden AGENTS.md, Agentenstruktur, Rechtematrix, Goals, Ticket-Board, Collaboration State, Decision Log, SPI-Vertrag und A03s Handrechnung geprüft. Die Control-Plane-Hashes stimmten mit dem A01-Digest überein. HEAD und Statuszahl wurden bei Arbeitsstart verifiziert; weitere Agenten arbeiteten in getrennten Ticketpaketen. Der neue Code ist auf das SPI-Modul und dessen Regression beschränkt.

## Änderung

`prototype/v3-price-index.js` ergänzt den expliziten, reinen Helper `rebaseV3SpiHistory`. Er ändert keine Modellgewichte, simulierten Quelldaten, bestehende Verträge oder autoritativen Spiel-/Finanzzustände. Der Helper:

- verlangt einen expliziten Bezugsmonat, die bestehende Basketversion `V3-SPI-COICOP12-v1`, Komponentenbasis, Quellenreferenz und Fixture-ID;
- verlangt eine chronologische, eindeutige Beobachtungsreihe und bindet für alle zwölf COICOP-Komponenten dieselbe Basketversion, Komponentenbasis, Quelle und Fixture;
- rebasiert ausschließlich denselben Warenkorb nach `100 × SPI_alt,t / SPI_alt,neueBasis` und gibt die neue Basisperiode als `referencePeriod` aus;
- lässt Werte, Raten und Quellen der alten Eingabe unverändert/replaybar und weist unvollständige bzw. vermischte Komponentenprovenienz fail-closed zurück;
- berechnet m/m und y/y nur innerhalb derselben explizit gebundenen Reihe. Ohne zwölf Vorperioden bleibt y/y `null`.

`prototype/v3-price-index-regressions.mjs` ergänzt den handprüfbaren synthetischen 12-Komponenten-Vektor aus A03s Review. Er prüft Basis `100`, Folgeindex `100,2579127225…`, m/m `0,2579127225… %`, die Anzeige `100,00`/`100,26`/`0,26 %`, y/y ohne Historie, y/y mit zwölf Vorperioden sowie unveränderte Altversion. Negative Fälle für fehlende Version/Fixture, andere Version, gemischte Komponentenbasis/Quelle, fehlende Komponente, doppelte oder ungeordnete Monate werden zurückgewiesen.

Der Vektor bleibt ausdrücklich synthetisch. Es wurde weder eine neue offizielle Basketversion noch eine neue Quelle oder ein offizielles Basisjahr festgelegt.

## Prüfungen

Alle Prüfungen wurden mit Node.js durchgeführt:

- `node --check prototype/v3-price-index.js` – PASS
- `node --check prototype/v3-price-index-regressions.mjs` – PASS
- `node prototype/v3-price-index-regressions.mjs` – PASS
- `node prototype/v3-macro-simulation-regressions.mjs` – PASS
- `node prototype/v3-macro-policy-impact-regressions.mjs` – PASS

Browser-/Gerätetest nicht ausgeführt; T-0082 ist ein reiner Berechnungs-/Regressionstestschnitt ohne UI-Änderung. A03-Fachreview der Implementierung und A09-unabhängige QA sind nicht ausgeführt. `git diff --check` meldet nur bestehende LF-zu-CRLF-Hinweise und prüft die in diesem Arbeitsbaum ungetrackten neuen SPI-Dateien nicht selbst.

## Abnahme

Der synthetische Rebase-Vektor und die Version-/Provenienzfälle bestehen in der fokussierten Testausführung. **T-0082 wird von A02 als implementiert mit Ausführungs-PASS gemeldet; A01 soll den Gateabschluss erst nach A03- und A09-Re-Review bewerten.** Keine Schemaänderung, kein Commit oder Push.

**Nächster Adressat:** A03 für fachlichen Re-Review der A02-Implementierung, danach A09 für unabhängige QA; beide melden ausschließlich an A01.
