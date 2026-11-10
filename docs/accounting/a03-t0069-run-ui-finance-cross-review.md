# A03-Cross-Review – T-0069 gemeinsame Run-UI und Kalkulationshandoff

**Status:** PASS im begrenzten UI-/Angebots-Scope; dynamische Vollkalkulation und Finanzvollzug bleiben offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Startprofil:** V3-Testlauf ab 2027-01-04  
**Entscheidungen:** D-0160–D-0164; für V3 insbesondere D-0162, außerdem D-0157  
**Vorgänger:** CP-0287 (ENTWURF)

## Preflight und Prüfumfang

Vor diesem Review gelesen: `AGENTS.md`, Agentenstruktur und Rechtekarte, `goals.md`, `ticket-board.md`, `collaboration-state.md`, CP-0287, Decision Log D-0160–D-0164, A03s Finanzruntime und Finance-Handoff-Matrix, A05s T-0069 Integrationsbericht sowie den gemeinsamen UI-/API-Code. Git-Status und HEAD geprüft: Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; der Arbeitsbaum enthält zahlreiche vorhandene, nicht von diesem Review erzeugte V3-Änderungen. Nichts wurde verworfen oder geändert außer diesem Reviewbericht.

Direkt geprüft: `prototype/v3/run.js`, `run.html`, A05-Regressionen, `v3-financial-calculation.js`, `v3-market-simulation.js` und `v3-run-orchestrator.js` samt bestehenden Regressionen. Der Review bewertet Finance-/Accounting-Grenzen, nicht Vollständigkeit der Gesamtoberfläche oder Jahreslauf.

## Befunde

### Angebot, Kalkulation und Snapshot

- Die UI reicht einen expliziten Netto-Angebotspreis an A03s `calculateV3OfferEstimate` weiter. Direkte Kosten werden nicht still klassifiziert; die Form verlangt ausdrücklich Variabel/Fix. DB I zieht nur als variabel markierte Einzelkosten ab, und das Ergebnis nach direkten Kosten sowie manuellem BAB-Betrag wird getrennt ausgewiesen. Eine SimTAX-Komponente wird nicht aus dem Preis abgeleitet.
- A03s `createV3OfferSnapshot` erhält Preis, Berechnungsdaten, Kosten-/BAB-Kennungen und Einreichungsdatum. A02 speichert eine Kopie mit dem Einreichungsereignis. Marktvalidierung vergleicht den aktuellen Snapshot mit dem unveränderlichen Submission-Event; ein abweichendes Replay wird abgewiesen. Der Kundenentscheid verändert den eingereichten Nettopreis nicht.
- Die Oberfläche ändert ein abgegebenes Angebot nicht nachträglich. Der Auftrag referenziert die gewinnende `offerId`; Arbeitsplan-/Vertrags-Snapshot muss dieselbe Angebots- und Entscheidungs-ID tragen. Damit bleibt die eingereichte Angebotsbasis adressierbar und ein Arbeitsplan kann keinen anderen Preis still einführen.

**Klar begrenzte Modellleistung:** Die UI bietet derzeit nur eine aggregierte direkte Kostenposition mit einem Variabel/Fix-Schalter. Der BAB-Anteil ist als Betrag und frei eingegebene Versionskennung manuell vorzugeben. Das ist als expliziter Szenario-/Lerninput transparent, aber weder eine vollständige Kostenartenzerlegung noch die dynamische BAB-Ermittlung aus einem Kostenpool und Verteilungsschlüsseln. Die UI und die Regressionen sollten daher nicht als vollständige Unternehmens-/BAB-Kalkulation ausgewiesen werden. Das ist derzeit eine Umfangsgrenze, kein Widerspruch zu D-0162.

### Angebot, Vertrag, Auftrag und Leistung

- Ein eingereichtes Angebot wird erst mit einer belegten Kundenentscheidung zum angenommenen Auftrag; Anfrage, Angebot und Annahme sind getrennt. Preis- und Kosten-/BAB-Snapshot werden bei Annahme nicht neu gerechnet.
- Die Arbeitsplanung fordert explizite Vertragsart und Partei-/Kriterienreferenzen sowie Menge/Einheit und Operationsdaten. Es wird keine Vertragsart, Leistungspflicht, Käufer-/Abnahmebefugnis oder Menge aus der UI ableitend ergänzt.
- Der Abschluss eines letzten Operationsschritts setzt nur `ready_for_delivery` und `performance_pending`. Die UI erzeugt keine implizite Lieferung, Abnahme, Rechnung, Forderung, SimTAX, Erlös-, Cash- oder Ledgerwirkung. Der Finance-Handoff bleibt `pending_non_posting`. Das entspricht der A03-Handoff-Matrix und verhindert, dass Fertigstellung als Umsatzrealisierung ausgegeben wird.

### Phasen, Wiederholung und physische Wirkung

Die Tagesoberfläche ruft `openV3RunDay → submitV3RunOffer → closeV3RunDay` auf; Angebote/Arbeitsaktionen passieren im geöffneten Tag. Angebots-/Arbeitsplan-Replays mit gleicher Nutzlast sind idempotent, geänderte Payloads werden zurückgewiesen. Der Materialverbrauch tritt erst beim expliziten Operationsabschluss einmalig auf und bleibt hier eine physische Mengenänderung ohne Kosten-/Bestandsbewertung. Dieselbe Regression prüft die nicht-postende Financegrenze.

## Verifikation

- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS.
- `node prototype/v3-financial-calculation-regressions.mjs` — PASS.
- `node prototype/v3-market-simulation-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node --check prototype/v3/run.js` und `prototype/v3-financial-calculation.js` — PASS.
- Gezieltes `git diff --check` für UI und A05-Regressionen — PASS.
- **Fachreview:** A03, begrenzter UI-/Accounting-Cross-Review.
- **Unabhängige QA:** A09-Re-Review der jüngsten A05-Integration noch offen.
- **Browser-/Gerätetest:** A05 meldet Desktop-Smoke; mobile enge Viewports/Touch und kompletter Operationsablauf im echten Browser bleiben nicht geprüft. A12-Re-Playtest ausstehend.
- **Git-Verifikation:** Status/HEAD geprüft; alle vorhandenen Änderungen erhalten; kein Commit/Push.

## Schlussfolgerung und nächste Schritte

Kein Finanzregelkonflikt festgestellt. Die UI bildet Netto-Angebotswert, ausdrücklich gewählte Kostenklassifikation, manuelle BAB-Zuordnung, Snapshot-/Replaygrenzen sowie die Trennung bis zur physischen Fertigstellung konsistent ab. A01 kann die Integrationsarbeit im geprüften Finance-Scope als **PASS mit Umfangsgrenzen** übernehmen.

Der PASS ist keine V3-Finanz- oder Releasefreigabe. Weiter offen bleiben eine dynamische/mehrzeilige BAB-Kalkulation, eine vollständige A03-Istbuchungs-/Bestandskosten-API, tatsächliche Lieferung/Abnahme/Rechnung/Zahlung, Jahres-Reconciliation, A09-Integration-QA und A12 Browser-/Touchprüfung. Für diesen Review war keine Nutzerentscheidung erforderlich.

**Nächster Schritt:** A01 adressiert A09 für unabhängige UI-/API-Re-QA und A12 für responsive Touchprüfung. Für die spätere fachliche Erweiterung der Kalkulation bleibt A03-Eigentum; sofern V3 eine echte dynamische BAB-Engine verlangt, soll A01 diese Grenze mit A05/A03 als separaten Arbeitspaketumfang operationalisieren.
