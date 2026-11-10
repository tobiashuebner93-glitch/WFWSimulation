# A09 – T-0067 focused Kalkulation-/BAB-/Produktreview

**Status:** PARTIAL; T-0067 bleibt offen. Gates 1–5 bestehen im geprüften, ausdrücklich nichtbuchenden Planumfang; Gate 6 ist PARTIAL.
**Adressat:** A01 – MASTER_ORCHESTRATOR. Gate-6-Folge: A02/A03 für T-0066-Produktquellenintegration; A01 für sichtbaren Browserpfad.
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0067
**Prüfdatum:** 2026-11-05
**Prüfumfang:** Read-only Recheck der aktuellen T-0067-Abnahmekriterien, Rechen-/BAB-API, headless Finance UI, FIFO-/Produktkostenschicht, Shared-Run-Integration und vorhandenen A03/A09-Reviews. Kein Browser-/Gerätetest und keine Schema-/Architekturfreigabe.

## Ausgeführte Suites

Alle vier Befehle bestanden mit Exit 0:

- `node prototype/v3-financial-calculation-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0067-regressions.mjs` — PASS.
- `node prototype/v3-product-costing-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.

Bestehende Fach-/QA-Belege: A03-V3-Kalkulations-/BAB-Vertrag und Reconciliationvektoren; `a09-t0067-finance-final-rereview.md` vergibt PASS im Finance/UI-Regressionsumfang und hält T-0067 insgesamt offen. Keine Browserprüfung ist dokumentiert.

## Gates 1–6

| Gate | Ergebnis | Beleg / Grenze |
|---:|---|---|
| 1 | **PASS** | A05-UI erfordert explizite Preis-/Direktkosten-/BAB-Eingaben und blockiert unvollständige Eingaben; keine stillen Kalkulationsdefaults. |
| 2 | **PASS** | Rechnerregressionen belegen positiven, centnahen und negativen DB I sowie Produktvektor mit direkten Kosten und Plan-BAB. Rundungs- und D-0162-Semantik werden aus der gemeinsamen A03-Rechenroutine verwendet. |
| 3 | **PASS** | BAB-Pools werden periodenspezifisch auf Kostenstellen verteilt; Restcent, gleiche Restfraktion/Tie-break, Umkehrprobe und Eingabereihenfolge werden geprüft; Empfängersummen gleichen Quellen centgenau ab. `keys`-Mengensatz und `weights`-Verteilungsanteile bleiben getrennt. |
| 4 | **PASS** | Änderungen an offenen Kalkulations-/BAB-Eingaben invalidieren den vorherigen Estimate; nach Annahme erhalten neue Eingaben den alten Snapshot unverändert. Planwerte, Snapshot und non-posting Financegrenze bleiben getrennt. Shared-Run-Produktverkauf wird als T-0067-Plan-BAB getrennt vom BAB-freien T-0066-Verkaufssnapshot geführt. |
| 5 | **PASS – bedingt** | Im geprüften Pfad wird kein Ist-BAB behauptet oder gebucht. Planpools/Verteilung sind explizite Eingaben; fehlende Ist-Quellen bleiben pending. Die bedingte Liste aus Ist-Ereignis/Rate/Kostenstelle/Idempotenzbezug wird damit nicht als nicht existente Ist-Buchung vorgetäuscht. |
| 6 | **PARTIAL** | A03-Fachreview, A09 unabhängige Rechen-/Replayprüfung und A05 headless UI Suite liegen vor. A01 sichtbarer responsiver Browser-Smoke fehlt. Produktintegration ist zudem vom T-0066 Snapshotgate G8 abhängig: dessen aktuelle A09-Bewertung ist NONPASS, da direkte Produktkosten-Snapshots Einheiten, Quellen je Kostenzeile und Rundungsprovenienz nicht vollständig speichern. |

## Konkrete Folge

T-0067 schließt nicht, bis Gate 6 geschlossen ist. **A02** muss zusammen mit **A03** die in T-0066 G8 fehlende Linienprovenienz für Produktkosten in den Produktplan-/Verkaufssnapshot integrieren, ohne BAB-/Ist-COGS-/Buchungsstatus vorzuziehen. Danach folgen A05-Anzeige-/Regression, A09-Re-Review und A01 Browser-Smoke für die responsive Bedienung und Produktintegration. Es wurden keine Nutzerentscheidungen abgeleitet.

Dieser Bericht ändert keine Produktdateien, Preise, fachliche Freigaben, CP/MCP oder Ticketstatus. Kein Commit/Push.

## Geprüfte Artefakte und SHA-256

| Artefakt | SHA-256 |
|---|---|
| `prototype/v3-financial-calculation.js` | `6070203DDA53A5CEF7A90ADFD6211394A3A8D89EC3B861DAA1568C1C719C7281` |
| `prototype/v3-financial-calculation-regressions.mjs` | `0E5D2F213715DE222C74AAA9759598F77DDE921B222822C44722A0BBE5E10B98` |
| `prototype/v3/a05-t0067-regressions.mjs` | `4F76E3721E6036DFF434E2FB479848CAC6F927002C5870D33BF4011916628271` |
| `prototype/v3-product-costing-regressions.mjs` | `D6DCDE8F409AF622FB810CE12AC3BAEA0C25C6292055D75FD5384DEE27DB0155` |
| `prototype/v3-run-orchestrator-regressions.mjs` | `83E6ED7B1CCAA7B8B7F4AF64A1A62239C0E30136C1CB99A3FDC18638CE4C9D22` |
| `prototype/v3/run.js` | `02A3D78CEB35260613C005901B6389884CECCD06057D493DD0CCE00061CF1764` |
| `docs/agent-system/a01-t0066-t0067-mindestziele.md` | `E20F4B496B2166B3BC103A9E3F60B1615BCC9A3DCE06B2FC365828F2B2A50FF9` |
| `docs/accounting/a03-t0067-v3-kalkulations-bab-vertrag.md` | `75A2B8D258975A60562B5A8611B62BF075221D6FC116D05E03636504018BC237` |
| `docs/test-reports/a09-t0067-finance-final-rereview.md` | `FFBACB549EC6EB7A90C7879383B65FA4F70FCFAC9821CDA68DC578C3434053AB` |
