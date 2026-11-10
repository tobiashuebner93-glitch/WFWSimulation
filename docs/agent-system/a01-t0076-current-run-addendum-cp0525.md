# A01 – T-0076 aktueller Jahresmengenlauf (Nachtrag zu CP-0525)

**Datum:** 2026-11-07  
**Status:** PASS für das mengenbezogene T-0076-Gate; keine Finanz-/COGS-/Ledgerabnahme  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Implementierung/Fixture:** A02 – SIMULATION  
**Unabhängige Prüfung:** A09 – QA, PASS für den eingegrenzten Smoke-Scope  
**Ticket:** T-0076 / T-0069 G6

## Aktueller Lauf

Nach der Aktualisierung alter Kundenangebots-Fixtures auf die verpflichtende V3-Vertragsklassifikation und D-0157-F3 führte A01 den aktuellen `prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs` aus. Ergebnis: PASS für 12 Perioden von 2027-01-04 bis 2027-12-31. Es gibt 12 Kundenaufträge (11 `accepted_non_posting`, 1 `rejected_non_posting`), 8 Produktversände und eine bestandene Ressourcen-Konfliktprüfung. Alle zwölf Snapshots stimmen im jeweiligen `stateHash` und `restoreHash` überein; Replay/Restore/Tampering bestehen.

- Jahres-State-SHA-256: `fa28ab6ad84d0dbda9c44d22d2335a327c87334082f776901866fd208e56d462`
- Snapshotdatei-SHA-256: `F12B75292EEC8FE94A26ECE39193C759ADB0BF1DE225E439CB120275B902D60E`
- T-0076-Smoke-Quelldatei-SHA-256: `D8859ACC4B154469F8A98510CB503090929E65AEE47B44C5AA753A5799D03FF4`

A09 bestätigte denselben 12-Monats-/12-Auftrags-/8-Versand-Ergebnisvektor unabhängig in einer temporären Kopie, nachdem der direkte Snapshot-Schreibversuch in seiner isolierten Umgebung wegen Sandbox-EPERM gescheitert war. Im Repository hatte A01 den Smoke direkt erfolgreich ausgeführt. Keine historische Checkpoint-Datei wurde geändert.

## Historische Abgrenzung

Die älteren Berichte/CP-0489-Unterlagen dokumentieren den damaligen T-0076-Lauf mit 6 Produktversänden und Snapshot-Hash `F3C7A1…`; sie bleiben als historische Aufzeichnungen unverändert. Dieser Nachtrag bindet den neueren Lauf mit 8 Produktversänden und Hash `F12B75…` als aktuellen Fixturestand.

## Grenzen

Der Jahreslauf weist `pendingFinance=true` aus; BAB bleibt vertagt. Kundenaufträge und Produktversände sind nichtbuchend. Die Prüfung belegt Mengen, Kapazität, Periodensnapshots und Recovery, nicht Lieferanten-/Kundenfinanzierung, Materialbewertung, COGS, Steuer, Hauptbuch oder vollständige Jahres-Finanzreconciliation. Diese Gates bleiben T-0077 und T-0069 zugeordnet.
