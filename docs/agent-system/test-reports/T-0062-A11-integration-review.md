# T-0062 – A11 Integrations- und Systemgrenzenreview

**STATUS:** Review abgeschlossen; G11 bleibt OFFEN  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A11 – TECHNICAL_ARCHITECT  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.4, SLG-002.5  
**TICKET:** T-0062  
**Prüfstand:** `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`; bestehender uncommitteter Arbeitsbaum einschließlich CP-0266. Es wurde nur dieser konkrete Working Tree geprüft; keine Commitbindung.

## Preflight und Umfang

Gelesen: `AGENTS.md`, `agent-structure.md`, `agent-rights-matrix.md`, `goals.md`, `ticket-board.md`, `collaboration-state.md`, `decision-log.md`, V2-Gate-Karte, A02-Simulationsspezifikation, A03-Finanzspezifikation, A04-Datenmodell sowie Architecture V0.2/ADR-Status und bestehender A11-Prototyp-Kopplungsreview. Arbeitsbaum und HEAD wurden vor der Prüfung kontrolliert.

Read-only geprüft wurden Integrationsgrenzen und sichtbare Widersprüche in Tagesorchestrierung/Finanzverarbeitung, Speichern/Wiederherstellen, Paketprovenienz und Architekturstatus. Kein Produktcode, Datenmodell oder Save wurde geändert. Keine Architektur-/Schemafreigabe.

## Befunde

1. **Finance-/Simulation-Orchestrierung – kein nachgewiesener V1-Widerspruch.** `prototype/app.js:251–260` führt den Tag über `advanceOneDay` aus, übernimmt dabei operative Material-/Trainingseffekte, erstellt fällige Rechnungen, ruft dann `processFinancialDay` auf und schließt Monatsperioden nach dem Spieltag. `prototype/finance.js:74` verarbeitet Kundeneingänge/Disporückführung, Maschinenrate, offene eigene Kosten, SimTAX und Zinsabgrenzung in dieser Reihenfolge. Das entspricht der V1-Konvention D-0129 in `decision-log.md:1277 ff.`. Wochenend- und wirksame Periodenzuordnung sind durch die dokumentierten Regeln abgedeckt. Die Verknüpfung bleibt jedoch direkte Orchestrierung der UI; sie ist keine freigegebene Zielarchitektur.

2. **Erweiterte V2-Finanzereignisse – Spezifikationslücke, nicht als Regelkonflikt beweisbar.** Ausstattungskauf-/Ratenereignisse und Immobilienereignisse liegen zusätzlich im Tagesablauf. D-0149 beschreibt Ratenkauf und Darlehensmerkmale, definiert aber keine vollständige Prioritäts-/Tie-Break-Reihenfolge relativ zu Maschinenrate, Lieferantenkosten und SimTAX. Der V1-Vertrag D-0129 entscheidet diese V2-Erweiterung nicht vollständig. A03 sollte bei seinem Review bestätigen, ob die bestehende Implementierungsreihenfolge als freigegebene Szenariokonvention gilt oder als offene V2-Abbildungsannahme gekennzeichnet wird. Ich leite daraus selbst keine neue Finanzregel ab.

3. **Persistenz – Verantwortung sauber abgegrenzt; Abnahmenachweis fehlt.** `prototype/app.js:32–34` hält JSON-Migration (Save-Versionen 2–7), localStorage, Backup und Recovery im lokalen Browserprototyp. A04s aktueller T-0062-Review bestätigt, dass vollständiger Feld-Roundtrip, echte Versionsmigration am `parseSaved`-Einstieg und beschädigtes Save mit gültigem/ungültigem Backup nicht vollständig geprüft sind. G09 bleibt OFFEN; dies ist derzeit ein Test-/Recovery-Nachweisblocker, kein Schema- oder Architekturkonflikt. Der Datenmodelltext erklärt physische Schema-/API-/Transaktionsentscheidungen ausdrücklich für nicht freigegeben.

4. **Offlinepaket-Provenienz – Inhalt nachvollziehbar, Commitherkunft noch nicht releasefähig.** `werkstatt-v2-package-manifest.json:3–4` nennt `sourceRevision: main@194fbaa…` und zugleich `workingTreeSourcesIncluded: true`; die source-/artifact-SHA-256-Werte identifizieren die Paketinputs/-artefakte. Damit wird nicht behauptet, der Paketinhalt sei identisch mit dem sauberen HEAD. G10 bleibt dennoch OFFEN, bis finaler gemeinsamer Commit, daraus reproduzierbarer Build und A10/A12-Beleg auf derselben Revision vorliegen.

5. **Architekturgrenzen – bekannte Kopplung, keine neue unerlaubte Architekturfreigabe.** Der bestehende A11-Bericht `docs/architecture/a11-t0020-prototype-kopplungsreview.md` dokumentiert den Engine/Economics-Importzyklus und die direkte Finance-/UI-Kopplung als technisches Risiko. Das ist mit dem lokalen ESM-Prototypstand vereinbar und wurde nicht durch eine freigegebene V0.2-Architektur ersetzt. Architecture V0.2 und ADR-001 bis ADR-008 bleiben `PROPOSED`; der aktuelle Datenmodelltext weist ebenfalls keine Schemafreigabe aus. Kein blockierender Widerspruch gegen eine erteilte Architekturentscheidung gefunden, da keine vorliegt. Das Kopplungsrisiko bleibt als bekannte technische Schuld sichtbar.

## Gate-Beurteilung aus A11-Sicht

- **G01–G08:** Aus A11-Systemgrenzensicht kein zusätzlich nachgewiesener Architekturkonflikt. Fach-/QA-/Browser-Nachweise liegen teilweise noch aus; Gate-PASS wird nicht erteilt.
- **G09:** OFFEN – A04 benennt fehlende vollständige Persistenz-/Recovery-Abdeckung; A12-Browser-Recovery ebenfalls offen.
- **G10:** OFFEN bis Build und Manifest auf finalem gemeinsamen Commit geprüft sind.
- **G11:** OFFEN – A11 sieht keinen neuen unaufgelösten Konflikt zwischen genehmigter Architektur und Prototyp, aber A08 Quellenreview, A09 unabhängiges Release Committee, A03-Bestätigung der P/R-Abgrenzung und Auflösung/Einordnung der erweiterten V2-Finanzereignisreihenfolge fehlen. A09 hat den Committee-Status BLOCKED gemeldet.

## Ergebnis und nächste Zuständigkeiten

Kein blockierender Systemgrenzenkonflikt wurde nachgewiesen, der sich ohne eine Fachentscheidung oder zusätzliche Prüfung beheben ließe. T-0062 bleibt offen. A03 prüft die V2-Finanzereignisfolge und P/R-Statusabgrenzung; A04/A09 ergänzen den G09-Persistenztest; A10 erstellt später den finalen Commit-Build; A12 führt nach policy-konformem Zugriff den Browser-/Recovery-Test aus; A08 prüft Quellen; A09 entscheidet das Release Committee erst, wenn alle Gate-Belege für denselben Commit vorliegen. Architektur V0.2, ADRs und Schema bleiben ausdrücklich PROPOSED/nicht freigegeben.

**Prüfungen:** Dokumenten-/Codeabgleich und Git-Provenienz; kein Code-Testlauf im Rahmen dieses A11-Reviews. A02/A03/A04/A09 haben ihre getrennten, jeweils genannten Testläufe in eigenen Berichten dokumentiert. Kein Commit/Push.
