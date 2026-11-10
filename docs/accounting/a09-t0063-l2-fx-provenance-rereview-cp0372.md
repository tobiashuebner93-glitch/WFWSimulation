# A09 – T-0063 L2 FX-Provenienzfix: unabhängiger Re-Review (CP-0372)

**Ergebnis: PASS im begrenzten FX-Provenienz- und Nichtmutationsumfang.** Der CP-0370-Angriff wird in der direkten Projektion neutralisiert und bleibt auch nach Save/Restore neutral. Kein Commit-, Browser-, Geräte- oder Gesamtjahresgate.

**Datum:** 2026-10-31  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goals/Tickets:** MG-002 / T-0063 L2; Anschluss T-0065/T-0069  
**Entscheidungen:** D-0161–D-0169; D-0169 bleibt alleiniger Gesamtanfragenfaktor  
**Vorgänger:** CP-0355, CP-0368, CP-0369, CP-0370, CP-0371  
**Snapshot:** `a02-code-input-t0063-l0l1` aus A01; Runtime-/Regressiondateien laut Auftrag bytegleich zum Repository. Snapshot enthält kein `.git`.

## Preflight und Grenzen

AGENTS/Governance, Agentenstruktur und Rechte, MG-002-Ziele, Ticketboard, Collaboration State, D-0161–D-0169, L2-Vertrag/CP-0355, A02 CP-0368 und CP-0371, A03 CP-0369 sowie A09 CP-0370 wurden gelesen. CP-0372 und der zugehörige Bericht waren im Snapshot vor Erstellung nicht vorhanden. Gitstatus, Branch, HEAD und Working-Tree-Diff sind mangels `.git` nicht verifizierbar. Geändert wurden nur dieser Bericht und CP-0372; Runtime-/Testcode blieb unverändert.

## Gate-Ergebnisse

| Gate | Ergebnis | Beleg |
|---|---|---|
| CP-0370 falsche Januar-Notierung | **PASS** | Regression baut Jan 2027 `0.9`, `USD_per_EUR`, ohne Fixture-ID und Februar `0.945 EUR_per_USD`. Die direkte Projektion enthält keinen `openImportProcurementPlanIndex`-Effekt. |
| Save-Envelope / Restore | **PASS** | Für denselben ungültigen Januaranker wird der Save-Envelope erzeugt; nach Restore entsteht weiterhin kein FX-Planbeitrag. Save serialisiert die unzulässige Eingabe, autoritativer Replay macht daraus keine wirksame Projektion. |
| Kanonische Richtung / Basisperiode | **PASS im Codepfad** | Basis und Folgeereignis erfordern `baseCurrency=USD`, `quoteCurrency=EUR`, `quoteUnit=EUR_per_USD`, positive Quote; Januaranker muss `period=2027-01`, `baseIndex=100` haben. Eine spätere valide Quote ersetzt keine ungültige Basis. Positive Kontrollreihe bleibt wirksam. |
| Provenienz und Serienbindung | **PASS im geprüften Codepfad** | Beide Events benötigen `sourceType=synthetic_fixture`, nichtleeres `sourceRef`, festgelegte FX-Test-Fixture-ID, nichtleeres und identisches `fxSeriesRef`, passende `runId`/`scenarioId`. Fehlende oder falsche Provenienz liefert keinen FX-Effekt. |
| Fixture-, Run-/Scenario-, Plan- und Exposurebindung | **PASS im geprüften Codepfad** | Folgeevent muss dieselbe Fixture/Serie/Run-/Scenario-Identität besitzen. Derselbe offene USD-Plan samt identischer positiver Exposure muss in Basis und Folgeevent vorkommen; angenommene bzw. snapshotgebundene Pläne sind ausgeschlossen. Fehlende oder abweichende Bindung wird übersprungen. |
| D-0169 / Markt-, Finanz- und Run-Nichtmutation | **PASS in Regressionen** | Demand-Suite bestätigt Anfrageprovenienz/-Replay; L2-Suite vergleicht Run-, Markt- und Financezustand vor/nach der Projektion. FX-Projektion ändert keine Anfragen, Angebote, Verträge, Finanzsalden oder Buchungen. |
| Gültige Positivkontrolle | **PASS** | Eingebaute synthetische Jan/Feb-Reihe mit 0,90 → 0,945 EUR/USD projiziert den vertraglich gesetzten 25-%-Testpass-through (+1,25 Indexpunkte), begrenzt auf maximal ±2 % je Monat. Das ist ein Fixtureverhalten, keine empirische Kalibrierung. |

Die negativen Provenienzvarianten für `sourceType`, `sourceRef`, `fxSeriesRef`, Währungsrichtung, Basisperiode/-index, Fixture- und Identitätsabweichung sowie Plan-/Expositionsabweichung wurden zusätzlich gegen `validFxSource` und die Basis-/Folgeplanbedingungen im unveränderten Code gelesen. Nicht jede denkbare Feldpermutation ist eine separate Regression; die vorhandene konkrete CP-0370-Reproduktion und Positivkontrolle werden automatisiert ausgeführt.

## Ausgeführte Regressionen

Alle Befehle liefen im bereitgestellten Snapshot mit Exitcode 0:

- `node prototype/v3-macro-trade-impact-regressions.mjs` — PASS (direkte Neutralität, Save/Restore, Positivkontrolle, D-0169 und Nichtmutation)
- `node prototype/v3-macro-simulation-regressions.mjs` — PASS
- `node prototype/v3-run-macro-fixture-regressions.mjs` — PASS
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS
- `node prototype/v3-market-simulation-regressions.mjs` — PASS
- `node prototype/v3-macro-demand-channel-regressions.mjs` — PASS
- `node prototype/v3-finance-runtime-regressions.mjs` — PASS

## Verbleibende Grenzen

- Nur deklarierte synthetische Testparameter; kein echter FX-Feed, kein Lieferanten-/Beschaffungsregister und keine empirische Wirkungs- oder Marktpreisvalidierung.
- Keine UI-, Browser-, Geräte-, Mehrjahres-, Ledger- oder Gesamtfreigabeprüfung.
- `.git` fehlt: kein Gitstatus/Diff/Commit/Push verifiziert.
- T-0063/T-0069 bleiben gemäß Ticketboard über den hier bestandenen engen L2-Fix hinaus offen.

## Prüfsnapshot-Dateihashes (SHA-256)

- `prototype/v3-macro-trade-impact.js`: `E5A43E70C7594AB9616AC16C23D8ADE24100165F2F24303D40378E912946BE49`
- `prototype/v3-macro-trade-impact-regressions.mjs`: `67F6D511254031AA1A0F328335D789A052D7254E77395EBD631D26ABA901BACD`
- `prototype/v3/run.js`: `7FFCC89E471D3D12AF6026173292345ABD1A2D36EA6AD7E73BC1275F841CEB4E`
- `prototype/v3-run-orchestrator.js`: `50290C1753DEB54CE924A28264FC84888D0A48222F1F18251CB5CDB2E7955D9C`
- `prototype/v3-macro-simulation.js`: `864487D28B65D651F2061D1CEC8E06D94F9ACA926847F046CE57AF92A235D91D`
- `prototype/v3-market-simulation.js`: `08A25CBB945900CECA07A7200758B9BC8C1B1049A1FA19FC678AA52219D4D0F9`
- `prototype/v3-macro-demand-channel.js`: `51C0F2506E8565D450553C82F6D77EAB3BD7B188284AAEFB71973810AF4553C2`
- `prototype/v3-finance-runtime-regressions.mjs`: `710813A1BF0AA5FC913DE14A4C1296AEFA96D8A88D752CB90F7BE29E6993FEBD`
- `docs/agent-system/checkpoints/CP-0371.md`: `533A11D3505CC7214EC1DF6B375CA63BED85D151330EC9F670EBA02173466807`.

Hashes identify selected files in the supplied snapshot, not a Git commit or complete tree hash.

**Nächster Schritt:** A01 kann den schmalen A09-Fixreview als PASS integrieren. L2-Testparameter bleiben ausdrücklich synthetisch; T-0063/T-0069 erfordern die weiteren offenen Integrations- und Gesamtziele.

