# A01 – V3-Open-Tickets: Integrationslauf und Gate-Fortschritt (CP-0474)

**Status:** Arbeitsfortschritt; T-0063/T-0065/T-0066/T-0067/T-0069 bleiben IN_PROGRESS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Goals/Tickets:** MG-002 / SLG-002.2–SLG-002.5 / T-0063, T-0065, T-0066, T-0067, T-0069
**Vorgänger:** CP-0473 (ENTWURF)
**Branch/HEAD:** `main` / `8b72b7e` (`main...origin/main`)
**Arbeitsbaum:** 448 Statuszeilen vor dieser Dokumentation; vorhandene Änderungen beibehalten. Kein Commit/Push.

## Kurzbefund

Die unabhängigen A03-/A09-Re-Reviews für T-0066 G7–G10 aus CP-0473 bleiben gültig. A01 führte die Regressionen für die übrigen Produktgates G1–G6 erneut aus. Zusätzlich wurden die offenen V3-Modul-/UI-Regressionen für Makro, Markt, Kalkulation, Lernen, Gründung und Run-Integration ausgeführt. Dabei traten zwei konkrete Probleme auf: fehlende Lagerumrechnung/-kapazität im T-0069-Jahres-Auftragsfixture und ein veralteter statischer `run.html`-Cachegraph. Beide wurden korrigiert; der Auftragspfad läuft mit demselben Seed zweimal identisch über 362 Tage.

Das ist kein Abschluss der fünf Tickets. T-0063s kanalübergreifende Betriebswirkungen, T-0065/67-Gesamtintegration und T-0069s Mehrszenario-/Finanzreconciliation bleiben offen. Für T-0066 ist der einzige noch nicht belegte Minimalgate-Nachweis der visuelle A01-Browserpfad; die UI-Regression ist PASS.

## Änderungen

- `prototype/v3-year-order-smoke.mjs`: Ein-Stück-Auftrag führt jetzt explizit `storageUnitsPerOrderUnit: 1`; das Fixture stellt eine Fertigwarenkapazität von einer Einheit bereit. Die Konversion/Kapazität sind explizite Testdaten, keine allgemeine Markt- oder Spielregel.
- `prototype/v3/run.html`: mit `prototype/v3/a05-v3-run-module-graph-cache.mjs --write` deterministisch auf den aktuellen statischen Graphen mit 25 Modulen aktualisiert.
- `docs/agent-system/a01-v3-open-tickets-progress-cp0474.md`, `ticket-board.md`, `collaboration-state.md` und `checkpoints/CP-0474.md`: Befunde und Restgates dokumentiert.

## Ausführung und Resultate

- 34 verschiedene V3-Regressionsskripte der Produkt-, Finanz-, Makro-, Markt-, Kostenplan-, Lern-, Gründungs- und Run-UI-Pfade wurden ausgeführt. 31 waren im ersten Lauf PASS; die drei anfänglichen Fehler (fehlende Lagerangaben im T-0069-Fixture und zwei stale-graph Cache/UI-Assertions) wurden korrigiert, danach bestanden alle drei betroffenen Skripte erneut.
- `prototype/v3-year-order-smoke.mjs`: PASS zweimal, jeweils 362 Tage, 12 Makromonate, ein angenommener Kundenauftrag bis Versand/Empfängerabnahme, Szenariorechnung, Rechnung und Zahlung am Fälligkeitstag. Beide Runs haben denselben State-Hash `85fdf7f99db9b8aa338080efb47bb6df1d33562d6fa50aa777efadcade32d6dd`; Restore-Hash stimmt pro Run.
- Der Auftragssmoke belegt **keine** komplette Unternehmensbuchführung, Lieferantenauszahlungen, COGS-/Vorratsbewertung oder Ledger-/Cash-Reconciliation.
- `prototype/v3-year-smoke.mjs` wurde als Aktualitätsprüfung gestartet, nach auffällig langer Laufzeit ohne Ergebnis kontrolliert abgebrochen. Kein neues PASS daraus. Die frühere Vierpfad-Baseline in CP-0450 bleibt historische Evidenz, wird nicht als aktueller Re-Run ausgegeben.
- `node --check prototype/v3-year-order-smoke.mjs`, gezieltes `git diff --check` für `prototype/v3-year-order-smoke.mjs` und `prototype/v3/run.html`: PASS.
- Kein visueller Browser-/Viewport-Smoke: Computer-Use konnte die aktive Windows-Browser-URL nicht mit ausreichender Sicherheit feststellen und brach die UI-Steuerung ab.

## Ticket-Gates und offene Arbeit

| Ticket | Was ist in diesem Lauf belegt | Was verhindert 10/10/Abschluss |
|---|---|---|
| T-0063 | Makro-, Außenwirtschafts-, Preisindex-, Finanzreferenz- und UI-Regressionen PASS; A03s bisheriger isolierter Finanzreview bleibt PASS. | Nicht jeder Politik-/Außenwirtschaftskanal hat nachweisbar eine echte Betriebswirkung; vollständige aktuelle A09-Re-Reviews der späteren Änderungen und Jahres-/Browserintegration fehlen. |
| T-0065 | Markt-, Angebots-, Sensitivitäts-, D-0162-Kalkulations- und UI-Regressionen PASS; A03s begrenzter Finanzreview PASS. | Mehrere Wirtschafts-/Jahresfälle, integrierter Markt-zu-Unternehmens-/Finanzpfad und aktueller A09-/Browserbeleg sind nicht vollständig nachgewiesen. |
| T-0066 | G1–G6-Regressionen PASS; G7–G10 A03/A09 PASS laut CP-0473; A05-T-0066-UI-Regression PASS. | A01 visueller Browser-Smoke fehlt. Kein Ticketabschluss und kein 10/10 bis zum Browserbeleg. |
| T-0067 | Finanzkalkulation, Geschäfts-Kostenplanindex, T-0067-UI und Snapshot/DB-I-Regressionsfälle PASS. | T-0066/T-0069-übergreifende Perioden-/Istkosten-/Ergebnisreconciliation sowie aktuelle A03-/A09-/Browserabnahme fehlen; keine Buchung wird behauptet. |
| T-0069 | Ein vollständiger 362-Tage-Auftragspfad ist zweimal mit gleichem Seed/State-Hash reproduzierbar; Angebot, Fertigung, Lieferung, Empfängerentscheidung, Rechnung und Kundeneingang sind belegt. | Vier Profiljahre mit identischer Wiederholung, tragfähiger und scheiternder Gesamtverlauf, vollständiger Auftrags-/Lager-/Finanz-/Ledgerabgleich, belastbare Laufzeitgrenze und Browser-/Mobilgate fehlen. |

Keine neue Produkt-, Finanz-, Rechts- oder Architekturentscheidung wurde getroffen. Es gibt keine ungelöste Rückfrage, die für die obigen Regressionen erforderlich wäre.

## Preflight-Digest

Vor den Steuerungsdokument-Änderungen gelesen: `AGENTS.md`, Agentenstruktur/Rechtematrix, Goals, Ticket Board, Collaboration State, Decision Log, CP-0473, Ticket-Minimalziele und einschlägige V3-Reports. Branch/HEAD und bestehender Diff wurden geprüft.

- `AGENTS.md`: `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556`
- `agent-structure.md`: `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3EE`
- `agent-rights-matrix.md`: `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE`
- `goals.md`: `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D`
- `ticket-board.md`: `A7A3970D918951EC26062766FC4242BBCC65DEEF666B5B4079456DB8805F82D7`
- `collaboration-state.md`: `907CDA6CBFBA133967A90A65168564FDC279F0DDF83064733521975075A9E652`
- `decision-log.md`: `1EA4649C21FCC505BD4A9931CB7B9C16628656A0A9F2BB88DF07E3460ADAACEB`

**Nächster Schritt:** A01 setzt die noch fehlenden operativen Minimalgates je Ticket in kleine Pakete um. T-0066 kann erst nach einem kontrollierbaren visuellen Browser-Smoke abgeschlossen werden. T-0069 ist von kompletter A03-Finanz-/Ledgerintegration und Jahresreconciliation abhängig.
