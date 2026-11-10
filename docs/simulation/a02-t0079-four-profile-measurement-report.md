# A02-Messbericht – T-0079 / T-0069 G9: vier Jahresprofile

**STATUS:** PASS für die Laufzeitmessung aller vier Profile; gleiches Seed-Replay und unabhängige A09-Review bleiben separate Belege.
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A02 – SIMULATION
**GOALS/TICKETS:** MG-002 / SLG-002.5 / T-0069 G9 / T-0079
**PRÜFREVISION:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`
**Arbeitsbaum:** 506 bestehende Status-Einträge beim Preflight; Änderungen anderer Agenten erhalten. Keine Produktdatei, kein Runner und kein Governance-/Ticket-/CP-Dokument durch diese Messung geändert.
**Umgebung:** Windows 11 Home 10.0.26300, Node.js v24.22.1.
**Laufzeitlimit:** 360 Sekunden pro Einzelprofil gemäß A09 Review CP-0476; keine Vierfach-Serie unter einem gemeinsamen Zeitlimit.

## Ergebnisse

Alle vier Einzelprofilbefehle wurden sequenziell und jeweils genau einmal mit demselben festen Seed ausgeführt. Kein Lauf wurde abgebrochen; es gab keine technischen Fehler oder ausgelassenen Kalendertage.

| Profil | Befehl | Datumsspanne | Tage / Monate | Run-Events | Laufzeit | Vollvalidierungen | State SHA-256 |
|---|---|---|---:|---:|---:|---:|---|
| UPSWING | `node prototype/v3-year-smoke.mjs --scenario=UPSWING` | 2027-01-04–2027-12-31 | 362 / 12 | 1.409 | 235,787 s | 1.450 | `029231d56d01316232d568644e4118fb91df0579556721f439eccdccee2d8d09` |
| BOOM | `node prototype/v3-year-smoke.mjs --scenario=BOOM` | 2027-01-04–2027-12-31 | 362 / 12 | 1.409 | 232,338 s | 1.450 | `1c41f00ad68576df683f76c0a1c05ee83e0000f2ab16d87ebb11255639a93f59` |
| DOWNTURN | `node prototype/v3-year-smoke.mjs --scenario=DOWNTURN` | 2027-01-04–2027-12-31 | 362 / 12 | 1.409 | 235,334 s | 1.450 | `0c2bba46387e09f56cebc2b66d2ef91a55ef8e97c388833071030245326afb2a` |
| LOW | `node prototype/v3-year-smoke.mjs --scenario=LOW` | 2027-01-04–2027-12-31 | 362 / 12 | 1.409 | 225,464 s | 1.450 | `496d27003dcc8b26569a7c311c0a7d219b5ddeaa2008a36372836b4aab494fce` |

Seed for every row: `T-0069-seed-1`. Every profile scheduled 52 market weeks, closed 12 macro months, and returned PASS with abort status `completed`. The displayed 1,450 validations are one initialization, 724 open-day validations, 724 close-day validations, and one final validation.

## Laufzeitdiagnostik / Engpass

Ein zusätzlicher, klar begrenzter 87-Tage-UPSWING-Diagnoselauf (2027-01-04–2027-03-31) dauerte 11,609 s, deckte 87 Tage/339 Events mit 350 vollständigen Validierungen ab und ergab State-Hash `e9e046a84c4ee14ab1c7369578c986941d347b41ea22eef3dfe26440679b70d6`.

Der bestehende Laufzeitdiagnostik-Zähler zeigt dieselben dominanten Prüfblöcke über alle Profile: `macroHistory` und `macroDemandBindings`; danach folgen die wiederholten vollständigen Core-Validierungen bei Tagesöffnung/-schluss. Für das 87-Tage-Profil summieren sich `macroHistory` auf 3,591 s, `macroDemandBindings` auf 2,598 s und die vier Open-/Close-Vollvalidatoren auf 8,200 s. Tagesvorbereitung und Protokollierung zusammen bleiben unter 6 ms. Das zeigt wiederholtes Replay der Makro-/Ereignishistorie als Hauptkostenquelle, nicht das Aufbauen des Tageslogs.

Es wurde keine Codeoptimierung vorgenommen: der kanonische Lauf ist bereits innerhalb der vorher festgelegten Grenze und keine semantikbewahrende Engpassänderung ist nötig, um G9-Zeitgrenzen zu bestehen. Insbesondere wurden weder Vollvalidierungen übersprungen noch fachliche Prüfregeln geändert. Die Diagnoseinstrumentierung war im bestehenden `v3-year-smoke.mjs` vorhanden.

## Abgrenzung

Dieser Harness prüft die vier synthetischen Makrophasen, Tages-/Makroeventvollständigkeit, reproduzierbare Eventidentität und die nichtbuchende Makro-Finanzgrenze. Er erzeugt absichtlich keine angenommenen Kundenaufträge, Produktion, Jahreslösbarkeit, vollständige Buchführung oder Lagerbewertung. Diese Gates bleiben davon unabhängig offen.

Die hier ausgeführte Serie ist ein Erstlauf je Profil, kein Same-Seed-Doppelrun. Eine wiederhergestellte Mid-year-Fortsetzung kann den zweiten identischen Lauf darstellen, sofern sie denselben vollständigen Endstate-/Eventhash wie die hier dokumentierte Basis erzeugt. A09-Re-Review und formale Ticket-/Commitbindung sind nicht ausgeführt.

**DATEI:** `docs/simulation/a02-t0079-four-profile-measurement-report.md` (neu)
**Tests:** Vier Befehle in der Ergebnistabelle – PASS; 87-Tage-Diagnose – PASS.
**FACHREVIEW:** A02-intern; A09 unabhängig nicht ausgeführt.
**BROWSER-/GERÄTETEST:** nicht ausgeführt / für diesen Runner nicht einschlägig.
**GIT:** HEAD unverändert; kein Commit/Push.
**NÄCHSTER ADRESSAT:** A09 für unabhängige Prüfung der vier Laufzeitbelege; A02 setzt mit T-0078-Mid-run-Recovery fort.
