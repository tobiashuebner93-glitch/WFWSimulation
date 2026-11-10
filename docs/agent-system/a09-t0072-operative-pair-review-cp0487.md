# A09 – T-0072 kontrollierte operative Paare (CP-0487)

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Datum:** 2026-11-01  
**Ergebnis:** **PASS für T-0072/T-0063 G7-Kriterium „operative kontrollierte Paare“ im geprüften Scope.** Kein Abschluss von T-0063/G7 als Ganzes und keine Statusänderung.

## Preflight und Maßstab

Im vorgegebenen Checkout verifiziert: `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, CP-0487; 510 Status-Einträge. Die sieben vorgegebenen Governance-Digests stimmten überein. Keine vorhandene Änderung wurde bearbeitet.

CP-0476 formuliert T-0072 so: Für jeden als wirksam markierten Kanal muss ein kontrolliertes Paar nur die vorgesehene echte V3-Spielvariable ändern und einen neutralen Gegenfall enthalten; Doppelzählung ist auszuschließen. Der aktuelle CP-0487 zählt zwei operative Variablenkanäle. FX-Plan und T-0071-MRO/Investmentindex sind als nichtbindende Plan-/Finanzierungsindikatoren klassifiziert und werden nicht als operative Firmenwirkung gezählt.

## Kanalbefunde

### 1. Auslandsnachfrage – Anfrage-/Segmentverteilung

Die A09-CP-0476-Re-Review und aktuelle Regression zeigen einen neutralen Gegenfall sowie positive und negative, synthetische `+/-5 pp`-Shifts bei gleichem D-0169-Ausgangsfluss. Die Gesamtzahl bleibt unverändert: im Februarbeispiel 20 Anfragen; der positive Shift verschiebt die kumulative exportfähige Verteilung von 12/20 auf 13/20, der negative auf 11/20. Januar bleibt vor dem Einmonatslag neutral. Slot-IDs, Kundenidentitäten und kanonische segmentabhängige Anforderungen bleiben gebunden; die geänderte Verteilung ändert, welche tatsächlichen Anfrage-/Spieloptionen auftreten. Neutralität bei fehlender/Null-Exposition, deterministische Zuordnung, Duplikat-/Unknown-/Cross-Run-Fail-Closed, Save/Restore und Source-/Schedule-/Fixture-Tampering sind abgedeckt. Finanzzustand, Marktbestand und Run werden durch die reine Trade-Projektion nicht mutiert; sie erzeugt keine zusätzliche Anfragezahl und keine Finanzereignisse.

### 2. Internationale Materiallieferung – physische Menge/Planbarkeit

Das A02/A03/A08/A09-Belegpaket prüft dieselbe materialgebundene Operation unter gleichen Ressourcen und Materialeingaben: neutrale ETA ohne Lag gegen synthetisch um drei Kalendertage verzögerte ETA. Bestellung allein erhöht Bestand nicht. Vor der neutralen Fälligkeit kann kein Receipt erfolgen; nach neutralem Receipt wird die Operation planbar. Beim verzögerten Pfad bleibt sie zum neutralen Termin wegen fehlender Menge blockiert und wird erst nach dem späteren Receipt planbar. Damit ändert das Paar die reale V3-Materialverfügbarkeit und die Planbarkeit derselben Operation; Lag, Quelle/Fixture, Event-/Runbindung, Replay/Restore, Tamperabwehr und `nonposting_pending_cost_source` sind geprüft. Es entstehen keine AP-, Cash-, Steuer-, COGS-, BAB-, Bewertungs- oder Ledgerwirkung.

### Kanalabgrenzung und Doppelzählung

- Der FX-Angebots-/Importplanindex bleibt `information_plan`/`actualStateChanged: false`; er ändert weder gespeichertes Angebot noch Einkaufs-/Finanzzustand und ist kein zweiter operativer Kostenkanal.
- Die Trade-Projektion `openPurchaseOrderEta` ist ebenfalls eine nichtmutierende Planprojektion (`directFinanceEffect: false`); sie verschiebt keine physische Receipt-Menge. Sie wird nicht zusätzlich zur Materialreceipt-Wirkung als tatsächlicher Bestands-/Lieferkanal gezählt.
- T-0071-MRO verändert im isolierten Paar eine indikative neue Finanzierungsquote und einen separat verzögerten `investmentPlanIndex`. A03/A09 kennzeichnen beide als unverbindlich, nichtbuchend und `actualStateChanged: false`. Die neutrale/Hike/Cut-Paare sind methodisch vorhanden, belegen aber keine tatsächliche Investitions-, Produktions-, Kapazitäts- oder Kreditänderung. Daher wird T-0071 hier nicht als operative G7-Wirkung gezählt.

## Ausgeführte Prüfungen

PASS:

- `node prototype/v3-foreign-demand-market-regressions.mjs`
- `node prototype/v3-macro-trade-impact-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`
- `node prototype/v3-product-lifecycle-regressions.mjs`
- `node prototype/v3-t0071-exogenous-mro-operating-impact-regressions.mjs` (nur zur Einordnung des nichtoperativen MRO-Indikators)
- `node prototype/v3/a05-t0070-material-order-ui-regressions.mjs`
- `node prototype/v3/a05-t0063-foreign-demand-fixture-ui-regressions.mjs`

Zwei weitere historische Regressionen liefen in diesem aktuellen Checkout **nicht** an: `prototype/v3-macro-demand-channel-regressions.mjs` und `prototype/v3-run-macro-fixture-regressions.mjs` können `renderMacroSummary` aus `prototype/v3/run.js` nicht importieren, weil dieser Export in der aktuellen Datei fehlt. Die gezielten Foreign-Demand-Runtime-, Trade-, Orchestrator- und A05-Foreign-Fixture-UI-Tests liefen; der Importfehler wurde nicht als positiver Testbeleg gezählt. Kein Jahreslauf oder Browserlauf.

## Entscheidung und Grenzen

Im engen T-0072-Maßstab liegen zwei kontrollierte operative Wirkungen auf unterschiedliche V3-Variablen vor: Anfrage-/Segmentverteilung bei fixer Gesamtzahl und physische Materialmenge mit Folgewirkung auf die Planbarkeit derselben Operation. Die Planindikatoren (FX, MRO, ETA-Projektion) werden nicht als zusätzliche operative Wirkungen addiert. Daher **PASS für T-0072-Paar-/Nichtdoppelzählungskriterium**.

Das ist keine Freigabe von T-0063/G7 als Gesamtgate, T-0073/G10 oder T-0069-Jahres-/Finanz-/Bestandsabgleich. Die zwei genannten historischen Testimportfehler bleiben als aktueller Regression-/UI-Integrationsbefund sichtbar; kein interaktiver Browser-Smoke wurde durchgeführt. A01 behält die Gate-/Ticketentscheidung.
