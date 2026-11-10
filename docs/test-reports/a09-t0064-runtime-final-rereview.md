# A09 finaler Runtime-Re-Review – T-0064

**STATUS:** PASS – geprüfte Pflicht- und Identitätsinvarianten kontrollieren frühere Ausnahmefälle  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0064  
**PRE-FLIGHT:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0064 sowie vorheriger A09-Runtimebericht `a09-t0064-runtime-rereview.md` geprüft. Maßgebliche Entscheidungen: D-0161, D-0163, D-0164; Vorgängercheckpoint CP-0280. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Fremde lokale Änderungen blieben unverändert; kein Commit/Push.

## Prüfumfang und Gate-Ergebnis

Unabhängige Nachprüfung von A02s jüngster Erweiterung in `prototype/v3-company-formation.js` und `prototype/v3-company-formation-regressions.mjs`. A02 verlangt jetzt eine nichtleere Personenliste, einen auflösbaren Gründer, genau den vorgesehenen initialen Einzelunternehmer-Rechtsträger, konsistente Gründerreferenzen, initialen Eigentumsbezug und auflösbare Gründerreferenzen vorhandener Rechtsträger. `applyV3FormationEvent` validiert den Gesamtzustand vor Übergängen.

**PASS:** Die früheren A09-Trigger liefern kontrolliert `invalid_state_shape`, verändern den Eingangszustand nicht und lösen keine Exception mehr aus. Der durch `createV3FormationState` erzeugte kleinste gültige Zustand bleibt gültig und kann eine normale Stage-Transition ausführen.

## Unabhängig reproduzierte Fälle

- Fehlendes `foundingProject` → Validator ungültig; Stage-Advance kontrolliert abgewiesen.
- Leere `persons`, `entities` und `ownerships` → Validator ungültig; Stage-Advance kontrolliert abgewiesen.
- Dieselben leeren Identitätslisten bei `viability_assessed` und GmbH-&-Co.-KG-Auswahl → kontrollierte Ablehnung statt Zugriff auf `entities[0]`/Exception.
- Fehlender initialer Eigentumsbezug → Validator ungültig; Transition abgewiesen.
- Abweichende Gründer-ID zwischen Projekt und Ausgangsrechtsträger → Validator ungültig; Transition abgewiesen.
- Nicht auflösbare Projektgründer-ID → Validator ungültig; Transition abgewiesen.
- `null`-Zustand → kontrollierter Fehler `invalid_state_shape`.
- Gültiger Minimalzustand → Validator gültig; reguläre Transition gültig, Folgezustand erneut gültig.
- Die abgewiesenen Testzustände bleiben nach dem Versuch JSON-identisch.

## Ausgeführte Regressionen

- `node prototype/v3-company-formation-regressions.mjs` – PASS.
- `node --check prototype/v3-company-formation.js` – PASS.
- `node --check prototype/v3-company-formation-regressions.mjs` – PASS.
- `node prototype/a02-t0064-legal-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0064-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0064-ui-regressions.mjs` – PASS.
- Zusätzliche unabhängige A09-Reproduktionsproben – PASS.
- `git diff --check` – Exit 0; Git meldet nur bestehende LF/CRLF-Konvertierungshinweise in bereits geänderten Dateien.

## Getrennte UI-/Browsergate und Grenzen

Der A05-Statuschip bleibt als separates PASS in [A09 UI-Statuschip-Nachreview](a09-t0064-ui-status-rereview.md) dokumentiert. Dieser Bericht umfasst ausschließlich Runtime-Zustandsvalidierung. A12s bestehender Desktop-Playtestbericht ist kein neuer Browserlauf und bestätigt keine Mobile-/Touchprüfung. Dies ist keine Rechts-, Architektur- oder Nutzerfreigabe. Die Laufzeitkorrektur beseitigt den hier geprüften Blocker; andere T-0064-Abnahmekriterien und Integration bleiben gesondert zu bewerten.
