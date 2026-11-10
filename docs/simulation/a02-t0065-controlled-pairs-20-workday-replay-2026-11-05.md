# A02 T-0065 – Kontrollpaare und 20-Arbeitstage-Replay

**Status:** A02-Slice umgesetzt; A02-bezogene Regressionen PASS. T-0065 insgesamt bleibt offen.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-05
**Geltungsbereich:** A02-Engine-/Regressionstest. Keine Marktpreis-Kalibrierung, keine neuen Produktdefaults, keine Finanz- oder UI-Freigabe.

## Delta

In `prototype/v3-market-simulation-regressions.mjs` ergänzt:

- Isolierte synthetische Kontrollpaare: Preis, Reputation, Segment-Fit und Kapazität. Pro Paar bleibt der Seed gleich; es ändert sich jeweils nur die betreffende Eigenschaft. Kapazität wird auf Einladung/Eligibility geprüft, Reputation und Fit auf den Kundenzuschlag.
- Drei Same-Seed-Replays mit je 20 Arbeitstagen. Jeder Arbeitstag protokolliert tägliche Anfragen, Entscheidungen und Verfälle; Wochenenden werden als fortlaufende Kalendertage verarbeitet. Ein synthetischer Teil der Anfragen bleibt unbeantwortet, damit das 3–5-Tage-Ablaufen geprüft wird.
- Pro Spur werden Antwortverzögerung/Ablauf aus den vorhandenen Fixtures, reproduzierbare Ereignis- und Anfragezustände sowie Unveränderlichkeit des angenommenen Angebotspreises geprüft. Ein mutierter Angebotspreis nach Zuschlag wird durch State-Validierung fail-closed zurückgewiesen.
- Testwerte bleiben ausdrücklich synthetische Fixtures; es wurden keine empirischen Marktpreise oder Produktparameter eingeführt.

## Geänderte Dateien

- `prototype/v3-market-simulation-regressions.mjs`
- `docs/simulation/a02-t0065-controlled-pairs-20-workday-replay-2026-11-05.md` (dieser Bericht)

## Befehle und Ergebnis

- `node prototype/v3-market-simulation-regressions.mjs` — PASS; Preis/Ruf/Fit/Kapazität-Kontrollpaare, 3×20-Arbeitstage-Replay, tägliche Zustandsassertions und Post-Award-Preisänderungsversuch.
- `node prototype/v3/a05-t0065-shared-run-invitation-profile-regressions.mjs` — PASS.
- `git diff --check -- prototype/v3-market-simulation-regressions.mjs` — PASS.

## Gate-Auswirkung

- **G1/G2 – Segmente/Wettbewerbsprofile:** kein vollständiger Abschlussclaim; dieser Slice stärkt die getrennte Wirkungskontrolle und reproduzierbare Entscheidungsspur.
- **G3 – Same-Seed-Läufe:** A02-Teilnachweis PASS für drei 20-Arbeitstage-Fixtures; vollständige V3-/Browserintegration bleibt außerhalb dieses Tests.
- **G4/G5 – Anfragen und Zeitverhalten:** tägliche Anfrage-, Entscheidung- und Verfallsassertions PASS. Antwortverzögerung und Fristparameter stammen aus den vorhandenen synthetischen Fixtures.
- **G6 – Einflussfaktoren:** isolierte Preis-, Ruf-, Fit- und Kapazitätspaare PASS (Kapazität über Einladungsfähigkeit; die veränderte Einladung kann dadurch den Zuschlag verhindern).
- **G9 – Preis nach Annahme fix:** Engine-State-Validierung weist eine nachträgliche Änderung am angenommenen Angebotswert zurück; A05s UI-Änderungsversuch bleibt separat.
- **G10 – Replay/Manipulation/Rollenprüfung:** A02-Replay-Assertions PASS; A03-Rechenreview und A01-Browserpfad bleiben offen.
- **G7/G8:** unverändert; A03 muss DB-I-Vektoren prüfen, A02 nimmt keine BAB/COGS- oder Buchungsbehauptung vor.

## Grenzen und nächste Adressaten

- **A05:** UI-Änderungsversuch nach Zuschlag und 20-Tage-Browserpfad separat belegen.
- **A03:** positiven, centnahen und negativen DB-I-Vektor im Angebotsfluss fachlich prüfen.
- **A09:** unabhängige Regression/Replay der neu ergänzten Kontrollpaare und drei Trace-Fingerprints.
- **A01:** nach A05/A03/A09-Nachweisen Gates und T-0065-Status neu bewerten.

Keine Änderung an CP-0500 oder MCP; keine Commit-/Push-Aktion.

## Reproduktionsfingerprints

Replay-Hashes der vollständigen Trace-Payload (einschließlich Tageszeilen, Entscheidungen, Ablauf und Ereignisidentitäten):

- `T0065-trace-alpha`: `020ccaa4c932a3383dc830e14db980b88adfb9ff7d2fba1732d56715e4e32679`
- `T0065-trace-beta`: `63aa8d86371fb296f960987dabfe64eeeb9ec60ce4c7dbc7f7ee60af5d9fd580`
- `T0065-trace-gamma`: `436162cf10c7f4f4b4ee1a1cd1dd85be11fe7ff5497905163ff97a6239ff95ae`
