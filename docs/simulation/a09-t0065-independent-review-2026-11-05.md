# A09 – Unabhängiger T-0065-Markt-/Angebotsreview

**Status:** PARTIAL / NONPASS für Ticketabschluss. Die geprüften Regressionen bestehen; mehrere Minimalgates sind anhand dieser Artefakte noch nicht vollständig belegt.
**Adressat:** A01 – MASTER_ORCHESTRATOR; technische Folgearbeit an A02, UI-Anschluss an A05, Rechenprüfung an A03.
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0065
**Prüfdatum:** 2026-11-05
**Prüfgrenze:** Read-only Review der vorhandenen Markt-, Angebots- und Shared-Run-Implementierung sowie gezielte Regressionen. Kein Browser-/Geräte-Smoke, keine Preis-/Wirtschaftskalibrierung und keine Freigabe anderer Produktbereiche.

## Ausgeführte Regressionen

Alle fünf Befehle bestanden mit Exit 0:

- `node prototype/v3-market-simulation-regressions.mjs` — PASS.
- `node prototype/v3-financial-calculation-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0065-market-ui-regressions.mjs` — PASS.
- `node prototype/v3/a05-t0065-shared-run-invitation-profile-regressions.mjs` — PASS.

Belegt sind unter anderem: drei Größenklassen und mehrere Kundensegmente; same-seed Wiederholung; Anfragen an mindestens vier Wochentagen; 1–3 Kalendertage bis zu synthetischen Wettbewerberantworten; 3–5 Tage Anfragefenster mit Verfall; kontrollierte Preiswirkung auf Einladung und Zuschlag; keine Offenlegung von Einzelgeboten; anonyme Monatsmittel je Größe und Unterdrückung unter n=3; eingefrorene Angebots-Snapshots; Replay- und Payloadkonfliktprüfung; fail-closed Validierung manipulierter Angebots-/Snapshotdaten.

## Zehn Minimalgates

| Nr. | Ergebnis | Beleg / noch fehlender Nachweis |
|---:|---|---|
| 1 | **PARTIAL** | Drei Segmente mit unterschiedlichen Größen und Preisgewichten sind vorhanden. Ein kontrollierter Angebots-/Fitfall je Segment wird nicht jeweils separat geprüft. |
| 2 | **PARTIAL** | Wettbewerber haben unterschiedliche Profile; ein dritter Wettbewerber ist aufgrund fehlender Fähigkeit ausgeschlossen. Ein kontrollierter Profilvergleich je Wettbewerber bzw. Preis/Ruf/Kapazität fehlt. |
| 3 | **NONPASS** | Identische Seeds reproduzieren Einladungen. Die drei Seeds durchlaufen jedoch keinen vollständigen identischen 20-Arbeitstage-Pfad bis zu denselben Anfragen, Konkurrenzereignissen und Kundenentscheidungen. |
| 4 | **PARTIAL** | Die vierwöchige Fixture verteilt terminierte Anfragen auf mindestens vier Wochentage und enthält Größen-/Fähigkeits-/Termin-/Segmentfelder. Eine einzelne tägliche 20-Arbeitstage-Simulation mit vollständiger Feldvalidierung fehlt. |
| 5 | **PARTIAL** | Annahme, Ablehnung und Ablaufzustände sowie 1–3-tägige Wettbewerberantworten und 3–5-tägiges Anfragefenster sind getestet. Die integrierte Kundenauswahl wird nicht explizit für alle Fälle auf 1–3 Tage nach Angebotsabgabe begrenzt. |
| 6 | **NONPASS** | Preiswirkung ist durch kontrollierte Einladung-/Zuschlagspaare belegt. Ruf und Segmentpassung werden im Award-Paar gemeinsam geändert; ein isoliertes Paar je Wirkung fehlt. Kapazität hat Eligibility-Checks, aber keinen kontrollierten Wirkungsvergleich auf Einladung/Zuschlag. |
| 7 | **PASS** | Monatsbericht enthält kleine/mittlere/große Aufträge, Mittelwert in Cent, Stichprobengröße und anonymisierte Felder. n<3 wird unterdrückt; Duplikate können die Stichprobe nicht über die Schwelle heben. UI-Regressionen prüfen die Darstellung. |
| 8 | **PARTIAL** | Positive und negative DB-I-Werte werden durch dieselbe A03-Rechenroutine berechnet, angenommen und im Snapshot erhalten. Der centnahe DB-I-Fall ist nur in der Finanz-Rechensuite, nicht als angenommener Marktfall geprüft; A03 hat die konkreten Vektoren nicht separat reviewt. |
| 9 | **PARTIAL / NONPASS** | UI zeigt den fixierten Vertragspreis und akzeptierte Snapshots bleiben unverändert. Es fehlt ein expliziter UI- und Engineversuch, den Preis nach Zuschlag zu ändern und die unveränderte Ablehnung zu prüfen. |
| 10 | **NONPASS** | Replay, Konflikt und manipulierte Snapshot-/Quellreferenzen werden getestet; Run-Recovery ist separat für T-0078 belegt. A03-Rollenreview der T-0065-Vektoren, vollständige Inquiry-/Award-Manipulationsmatrix und A01-Browserpfad sind nicht belegt. |

## Integrationsbefund

Der A02-Preisgewichtungsparameter ist optional und explizit synthetisch. Der neutrale Legacy-Default bleibt unverändert; das Shared-Run-Profil ist an die Run-Identität gebunden. Spieleransicht und UI zeigen keine einzelnen Konkurrenzgebote. Diese Ergebnisse belegen die begrenzte Markt-/Angebotslogik, jedoch weder empirische Marktpreise noch die vollständige Kalibrierung von Ruf, Kapazität, Zuschlagswahrscheinlichkeit oder Auftragswirtschaftlichkeit.

## Nächste Zuständigkeiten

1. **A02:** Kontrollierte Einzelpaare für Reputation, Segmentpassung und Kapazität ergänzen; drei reproduzierbare vollständige 20-Arbeitstage-Läufe mit Anfrage-, Konkurrenz- und Kundenentscheidungs-Hash dokumentieren; integrierte Kundenentscheidung 1–3 Tage belegen.
2. **A05:** Preisänderungsversuch nach Annahme über UI und Engine regressiv abweisen; vollständige 20-Arbeitstage-UI-/Run-Darstellung belegen.
3. **A03:** Positiven, centnahen und negativen DB-I-Fall im Angebotsfluss gegen T-0067 bestätigen.
4. **A01:** Browserpfad belegen und nach den Folgeprüfungen Gateabschluss bewerten.

T-0065 bleibt offen, bis die NONPASS-Kriterien und die rollen-/Browsernachweise geschlossen sind. Dieser Bericht ändert weder Ticketstatus noch Spezifikationen, keine Preise und keine Architektur-/Schemafreigabe. Keine Dateien außer diesem A09-Reviewbericht wurden geändert; keine Commit-/Push-Aktion.

## Geprüfte Artefakte und SHA-256

| Artefakt | SHA-256 |
|---|---|
| `prototype/v3-market-simulation.js` | `1597234BAE7CBD773F12C69802B88763B7A3B4702B70932E919093CC8DEFDAC2` |
| `prototype/v3-market-simulation-regressions.mjs` | `79C28815574DF14120B994BEC206628D4763DE78C1E33E09DB358D976373C704` |
| `prototype/v3-financial-calculation-regressions.mjs` | `0E5D2F213715DE222C74AAA9759598F77DDE921B222822C44722A0BBE5E10B98` |
| `prototype/v3-run-orchestrator-regressions.mjs` | `83E6ED7B1CCAA7B8B7F4AF64A1A62239C0E30136C1CB99A3FDC18638CE4C9D22` |
| `prototype/v3/a05-t0065-market-ui-regressions.mjs` | `D223FEE068F67126472CEDEF5E001BB675CD73AA23D230E23EEA5C433B75901D` |
| `prototype/v3/a05-t0065-shared-run-invitation-profile-regressions.mjs` | `3AED790B116D93E214B33745E91F416AF005A1B165045B69699397CAEEBFCA86` |
| `prototype/v3/run.js` | `02A3D78CEB35260613C005901B6389884CECCD06057D493DD0CCE00061CF1764` |
| `prototype/v3/run.html` | `512988540D4BF418F88191C588AE1A9F9327445B76834352D7AB076D9EF30F6A` |
| `docs/simulation/a02-t0065-fixed-seed-market-offer-slice-report-2026-11-05.md` | `23CB545394017F54F18A660F1F879BF9E0440A293E3CCBD9E5DE35D8991B7E97` |
| `docs/agent-system/a01-v3-offene-minimalziele.md` | `11FB1675FAE5491FB7FBDBCA1D787DA82FFD761050D9FD39260D0E0CA62CE03C` |
