# A09 Runtime-Re-Review – T-0064

**STATUS:** NICHT BESTANDEN – ursprünglicher Ausnahmefehler behoben, weitere unvollständige Identitätszustände werden noch akzeptiert  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0064  
**PRE-FLIGHT:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0064, A09-Erst-QA und A05/A12-Berichte gelesen. Entscheidungen D-0159, D-0161, D-0163, D-0164; Vorgänger CP-0280. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Änderungen anderer Agenten wurden erhalten; keine Produktdatei verändert. `git diff --check` Exit 0, mit vorhandenen LF/CRLF-Hinweisen.

## Umfang und Abgrenzung

Unabhängiger Re-Review des A02-Fixes für Pflichtfeldvalidierung und frühe `invalid_state_shape`-Ablehnung in `prototype/v3-company-formation.js` plus zugehörige Regressionen. Der separate UI-Statuschip-Befund ist **PASS** in [A09 UI-Nachreview](a09-t0064-ui-status-rereview.md); er ist nicht Bestandteil dieses Runtime-Gates. Rechts-, Architektur- und Produktfreigabe werden nicht behauptet.

## Ursprünglicher Befund

Der zuvor gemeldete Fehlerfall wurde behoben: Ein Zustand ohne `foundingProject` wird jetzt durch `validateV3FormationState` abgelehnt; `applyV3FormationEvent` liefert `invalid_state_shape` statt einer `TypeError`-Exception und lässt den Input unverändert. Fehlende `persons`, falsche `persons`-Formen und `null` werden ebenfalls kontrolliert abgewiesen.

## Neue blockierende Reproduktion

Ein Zustand mit vollständiger äußerer Arraystruktur, aber `persons: []`, `entities: []`, `ownerships: []` sowie gültigem `foundingProject` und `processedEvents: {}` wird vom aktuellen Validator als `{ valid: true, errors: [] }` akzeptiert. Eine einfache Stage-Transition wird erfolgreich verarbeitet. Der Zustand enthält damit weder den Gründer noch den in `createV3FormationState` stets vorhandenen Ausgangsrechtsträger.

Für einen intern konsistent wirkenden Projektstand mit `stage: 'viability_assessed'` und vollständiger Tragfähigkeitsreferenz, aber denselben leeren Identitätslisten, wird ebenfalls `valid: true` gemeldet. Eine `SELECT_FORM`-Transition zu GmbH & Co. KG wirft danach `TypeError`, weil die Implementierung auf `state.entities[0].entityId` zugreift. Zusätzlich akzeptiert der Validator einen `foundingProject.founderPersonId`, der zu keiner Person in `persons` gehört.

Der Validator sollte deshalb mindestens sicherstellen, dass der Gründer als Person existiert, dass der im Profil vorhandene Ausgangsrechtsträger referenziert ist und dass die erforderlichen Eigentums-/Partnerreferenzen dazu konsistent sind. Die Transition-API muss jeden unvollständigen Zustand kontrolliert ablehnen, bevor Fachlogik ihn dereferenziert. A02 sollte diese Bedingungen mit Regressionen abdecken.

## Prüfungen

- `node prototype/v3-company-formation-regressions.mjs` – PASS für den aktuellen Testbestand.
- `node --check prototype/v3-company-formation.js` – PASS.
- `node prototype/a02-t0064-legal-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0064-regressions.mjs` – PASS.
- `node prototype/v3/a05-t0064-ui-regressions.mjs` – PASS.
- Zusätzliche A09-Probe der früheren Fälle (fehlendes `foundingProject`, fehlende/falsche `persons`, `null`, minimal gültiges Ausgangsprofil) – PASS; ursprüngliche TypeError-Quelle ist gegen diese Eingaben behoben.
- Zusätzliche Konsistenzprobe für leere Rechtsträger-/Personenlisten und abweichenden Gründerbezug – **NICHT BESTANDEN**; Validator akzeptiert unvollständige Zustände; GmbH-&-Co.-KG-Auswahl kann anschließend eine Exception auslösen.
- `git diff --check` – Exit 0; nur bestehende Zeilenendenhinweise.

## Gate und nächste Aktion

Die Zielkorrektur beseitigt den exakt früher reproduzierten fehlenden-`foundingProject`-Fehler, aber der umfassendere Zustandsvertrag ist noch nicht robust. **T-0064 Runtime-Gate bleibt NICHT BESTANDEN**, bis A02 Gründer-/Ausgangsrechtsträger-Invarianten ergänzt und A09 diese Folgefälle erneut geprüft hat. Browser-/Gerätetest bleibt getrennt; A12s Desktop-Playtest hat den Statuschip-Befund geliefert, aber keine Mobile-/Touchprüfung. Kein Commit/Push.
