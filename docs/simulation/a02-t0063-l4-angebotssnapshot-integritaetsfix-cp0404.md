# A02 – T-0063 L4 Angebotssnapshot-Integrität (CP-0404)

**Status:** A03-NONPASS technisch behoben; konkrete Regressionen PASS; fachliches A03-Re-Review und unabhängiges A09-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; T-0067/T-0069 angrenzend
**Profil:** gemeinsamer V3-Run 2027, Lauf ab 04.01.2027
**Vorgänger:** CP-0403 (A02 Angebotsplan-Sensitivität, ENTWURF); CP-0402 (A03 bedingtes Finance-PASS)
**Entscheidungen:** D-0162, D-0163, D-0169
**Git-Basis:** `main@8b72b7e`; vorhandene Änderungen nicht verworfen; kein Commit/Push

## Befunde und Fix

Der A03-Re-Review fand zwei Lücken: `snapshotBinding` band nur oberste Angebotsmetadaten, nicht den vollständigen Kalkulationsinhalt; außerdem ließ der exportierte Sensitivitätsrechner unvollständige Komponenten-/Treibernachweise als `ready` passieren. CP-0403 blieb unverändert.

Die Submission-Resultbindung enthält nun neben den bisherigen Identitätsfeldern einen deterministischen `calculationReplayWitness`, der den gesamten Snapshot kanonisch serialisiert. `validateV3MarketState` vergleicht ihn für Offer-Snapshot und Submit-Event, einschließlich `calculation.planSensitivity`, und validiert weiterhin, dass der dazugehörige Run-Event dieselbe Quelle wiedergibt. Eine koordinierte Änderung ausschließlich der Offer- und Submit-Event-Kopie reicht damit nicht aus; State-Validation, Save und Restore failen geschlossen. Nach Acceptance wird derselbe validierte Snapshot weitergeführt.

Der exportierte Rechner verlangt jetzt vollständige, nicht bloß identifierartige Indexevidenz: Procurement muss exakt die Material- und Logistikkomponente mit unterstützten Einheiten, expliziten auf eins summierenden Gewichten, Quellen-/Zeitraum-, Beitrags- und raw-component-Treibernachweisen sowie der benannten Aggregationsregel enthalten. Wage muss exakt die Wage-Komponente mit EUR/h und eigenem Treibernachweis enthalten. Rohkomponenten, Gewichte und gemeldeter Zielindex müssen rechnerisch übereinstimmen; unvollständige, widersprüchliche oder doppelte Indexevidenz ergibt `pending`.

Der vollständige Run-Market-State-Validator prüft zusätzlich den Snapshotmodus, Zeitraum, Nichtbuchungsflags, Indexstruktur, Zeilenkategorien/-basis, Rundung auf Cent, Basis-/Benutzungsbeträge, Zuordnung der Indizes, resultierende Kostenzeilen und unverändertes `R`. Ältere V3-Snapshots ohne `planSensitivity` bleiben akzeptiert. Bestehende Submit-Result-/Run-Event-Bindungen werden unverändert als weitere Konsistenzprüfung verwendet.

Der Replay-Witness ist ein deterministischer Integritätsnachweis zwischen im Run replizierten Kopien, **keine kryptografische Signatur oder Authentisierung** gegen eine Person, die sämtliche gespeicherten Kopien und den gesamten Browser-Save beliebig neu schreibt. Diese Grenze ist für ein lokales Browser-Spiel relevant; sie überschreitet den konkreten Befund (Mutation der Offer- und Submit-Event-Kopie bei unveränderter separater Resultbindung) nicht.

## Dateien

- `prototype/v3-market-simulation.js` – vollständige Replaybindung und Restore-/Market-State-Validierung.
- `prototype/v3-offer-plan-sensitivity.js` – fail-closed Indexkomponenten-/Provenienzvalidierung am exportierten Kalkulationsrand.
- `prototype/v3-offer-plan-sensitivity-regressions.mjs` – unvollständige Komponenten- und Treibereingaben bleiben pending.
- `prototype/a02-t0063-offer-sensitivity-integrity-regressions.mjs` – echter Shared-Run, Indexwirkung, Angebotsabgabe, Save/Restore, Mutation beider Spiegelkopien, untergeordnetes Provenienzfeld, nach Acceptance, Finanz-/BAB-/R-Invarianten.
- `docs/simulation/a02-t0063-l4-angebotssnapshot-integritaetsfix-cp0404.md`
- `docs/agent-system/checkpoints/CP-0404.md`, Ticketboard, Collaboration State.

## Prüfergebnisse

PASS: A02 fokussierter realer Submit/Save/Restore/Acceptance-Adversarialtest; Plan-Sensitivitätsregressionen; L4 business-cost-plan index regression; Finance-Calculation und Finance-Runtime; Run-Orchestrator, L0/L1 Operating-Impact, Macro-Fixture, Makrosimulation, Policy-Impact und Trade-Impact; A05 Run-UI und Market-UI; A09 Run-UI-Adversarial; A05 T-0067 Finance-UI-Vertrag. Der Angriff mit Änderungen an Offer und Submit-Event wird vor Save, nach Restore und am angenommenen Angebot abgewiesen. Ein unvollständiger Treibernachweis wird auch bei aktualisierten lokalen Spiegelbindungen abgewiesen. Untergeordnet manipulierte Quellenprovenienz wird abgewiesen. `R`, BAB-Allocation und separater FinanceState bleiben unverändert.

Syntaxcheck der drei geänderten JS/MJS-Dateien und fokussiertes `git diff --check`: PASS. Keine Browser-/Geräteprüfung. A03 Re-Review und A09 unabhängiges QA-Review stehen aus. Kein Commit/Push.

## Übergabe

A01 beauftragt A03 mit einem fokussierten Re-Review gegen seine CP-0402/CP-0403 Befunde. Bei A03 PASS folgt A09 für unabhängige Review-/Restore-/Acceptance-Angriffe. Danach erst A05 für die UI-Auswahl. T-0063, T-0067 und T-0069 bleiben IN_PROGRESS.
