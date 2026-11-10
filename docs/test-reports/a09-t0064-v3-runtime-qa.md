# A09 unabhängige Runtime-QA – T-0064

**STATUS:** NICHT BESTANDEN – strukturelle Zustandsvalidierung ist unvollständig  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0064  
**PRE-FLIGHT:** `AGENTS.md`, Agentenstruktur und Rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0064 und V3-Arbeitsplan geprüft. Maßgeblich sind D-0161, D-0163 und D-0164; Rechtsregister-Stichtag 2026-10-31. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Der Arbeitsbaum enthält zahlreiche schon vorhandene lokale Änderungen; diese QA hat keinen Produktcode oder fremde Änderungen verändert. `git diff --check` Exit 0, mit bestehenden LF/CRLF-Hinweisen.

## Geprüfter Umfang

- `prototype/v3-company-formation.js`
- `prototype/v3-company-formation-regressions.mjs`
- `prototype/a02-t0064-legal-regressions.mjs`
- `prototype/v3/formation.js` und A05-Regression/Smoke
- A02-Statusvertrag und Runtime-Arbeitsbericht
- A03-Finanzereignisvertrag
- A05-UI-Schnittstellenvertrag

Die Prüfung bewertet technische Übergänge und die dokumentierten Grenzen. Sie ist keine Rechtsfreigabe, keine Produktfreigabe und kein Browser-/Gerätetest.

## Ergebnisse

| Gate | Ergebnis | Nachweis |
|---|---|---|
| GmbH & Co. KG: getrennte IDs, Partnerrollen und belegte Registerpfade | PASS | Laufzeit- und A02-Rechtsregressionen bestanden; GmbH-Registrierung wird für die Komplementärrolle verlangt. |
| KG-Vorregisterpfad | PASS | Erfordert alle referenzierten Partnerzustimmungen und geklärte §123-Review; er setzt die KG nicht auf `registered`. |
| Kandidatensperre AG/eG/GmbH & Co. KGaA | PASS | A02- und A05-Regressionen; ausgewiesene Kandidaten bleiben gesperrt. |
| Idempotenz, Payloadkonflikt, Nichtmutation | PASS | Identische Wiederholung wirkt einmal; abweichendes Payload unter gleicher ID wird abgewiesen; Tests bestätigen unveränderte Eingabe. |
| Finanz-/Personal-/Asset-/Vertrags-Nichtmutation | PASS | Statusabschluss emittiert nur einen A03-Handoff ohne Cash-/Ledger-Mutation; Asset-/Beschäftigtenangaben werden als Referenzen transportiert. |
| §613a/§25 als bedingte Prüfinputs | PASS | Vertrags- und Legalregressionen verlangen getrennte, referenzierte Checks; kein pauschaler Transfer wird gebucht. |
| Ungültiges Ereignisdatum | PASS | Zusätzlicher Grenzfall `2026-02-31` wird als `invalid_event_envelope` abgewiesen; Zustand blieb bytegleich. |
| Vollständige Validierung eingelesener Zustände | **NICHT BESTANDEN** | `validateV3FormationState` akzeptiert einen Zustand ohne `foundingProject` und ohne `persons` mit `{ valid: true }`; `applyV3FormationEvent` wirft bei einem gültigen Ereignis daraufhin `TypeError: Cannot read properties of undefined (reading 'stage')`. Codeorte: Validierung ab Zeile 361, Zustandszugriff in Transitionen ab Zeile 153. |
| V1/V2-Entkopplung | PASS mit Begrenzung | Die neuen Dateien importieren/ändern die Legacy-Engine nicht; im aktuellen gesamten Arbeitsbaum ist `prototype/engine.js` unabhängig bereits geändert. Dieser Ticket-QA-Lauf hat es nicht verändert. |
| UI-Browserbedienung / responsives Rendering | NICHT AUSGEFÜHRT | Nur statische und Node-basierte UI-Regressionen liefen. |

## Ausgeführte Prüfungen

- `node prototype/v3-company-formation-regressions.mjs` – PASS.
- `node --check prototype/v3-company-formation.js` – PASS.
- `node prototype/a02-t0064-legal-regressions.mjs` – PASS.
- `node --check prototype/v3/formation.js` – PASS.
- `node prototype/v3/a05-t0064-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0064-ui-regressions.mjs` – PASS.
- Zusätzliche Inline-Probe mit array-komplettem Zustand ohne `foundingProject`/`persons` – **Fehler reproduziert**: Validator meldet gültig; Stage-Transition wirft.
- Zusätzliche Inline-Probe für ungültiges Kalenderdatum – PASS.
- `git diff --check` – PASS; nur Zeilenendenhinweise.

## Erforderliche Korrektur

A02 sollte `validateV3FormationState` um vollständige Pflichtfelder und Typ-/Referenzinvarianten ergänzen und `applyV3FormationEvent` vor jedem Transitionzugriff gegen denselben Zustandsvertrag absichern. Ungültiger Eingang muss kontrolliert `{ ok:false, error:{code:'invalid_state_shape',...} }` liefern statt eine Ausnahme auszulösen. Regressionen müssen mindestens den oben reproduzierten Zustand sowohl durch Validator als auch Transition abdecken. Danach ist ein gezielter A09-Re-Review erforderlich.

## Nachweisgrenzen und Restpunkte

- A02-Fachausführung und A03-Finanzvertrag sind die geprüften Lieferungen; dieses Dokument ist der unabhängige A09-Testreview.
- Ein unabhängiger A08-Rechtsquellenreview ist durch frühere Dokumentreviews belegt, ersetzt aber keine V3-Laufzeitfreigabe.
- A05-Node-Regressionen bestehen; der Browser-Smoke wurde nicht in einem Browser geöffnet. A12-Browser-/Mobilreview bleibt offen.
- T-0064 bleibt IN_PROGRESS. Keine Ticketabnahme, Nutzer- oder Rechtsfreigabe, kein Commit/Push.
