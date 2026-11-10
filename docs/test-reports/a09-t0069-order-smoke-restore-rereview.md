# A09 – Re-Review der T-0069-Order-Smoke-Restore-Assertions

**Status:** PASS für vollständigen Run-/Finance-State im Harness; zusätzlicher JSON-Rundlauf separat PASS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069 – IN_PROGRESS
**Vorgänger:** CP-0334 (Restore-Assertions nur auf Run-ID, Testlücke); CP-0330 (A03 Finance-Review); CP-0332 (A02 Statussemantik)
**Profil / Entscheidungen:** V3-RUN-2, 2027-01-04 bis 2027-12-31; D-0157, D-0159, D-0161–D-0168
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorhandene Änderungen erhalten.

## Preflight und Prüfgegenstand

Preflight nach AGENTS.md durchgeführt: Control Plane, Agentenstruktur/Rechte, Goals, aktive MG-002-Tickets, Collaboration State, Decision Log, Startprofil, CP-0334, A02-Bericht und A03-Finance-Review gelesen. Geprüft wurde ausschließlich die jüngste Regressionserweiterung in `prototype/v3-year-order-smoke.mjs`; Produktcode wurde nicht geändert.

## Review-Ergebnis

Die vorherige CP-0334-Lücke (Restore nur auf Run-ID geprüft) ist durch Assertions über den vollständigen Run- und Finanzzustand adressiert:

- stabile Hashes von `restored.runState` und `run` sind identisch;
- stabile Hashes von `restored.financeState` und `finance` sind identisch;
- alle zwölf Makroperioden werden in Reihenfolge gegen die gelaufene Periode-Liste geprüft;
- vollständige Rechnungsobjekte bleiben erhalten; Fälligkeit für die einzelne D-0166-Rechnung ist explizit `2027-01-19`;
- alle D-0168-Zahlungsevents werden verglichen und zur Rechnungs-ID wird genau ein Ereignis erwartet;
- Ausgabe-`stateHash` und `restoreStateHash` stimmten überein.

Der Ein-Auftrags-Smoke lief unabhängig 362 Tage bis 31.12.2027. Ausgabe: eine Kundenannahme, eine D-0166-Rechnung und ein D-0168-Zahlungseingang am Fälligkeitstag 19.01.2027. A09 erhielt denselben Hash zweimal: `0fe2d5c9bdac6c49a0bf0600c9d7722c54ecaffef2ee2db7cc3adcea6f85392b`.

## JSON-Persistenzprobe

Der Harness selbst übergibt derzeit das In-Memory-Envelope direkt an `restoreRunSaveEnvelope`. A09 führte zusätzlich eine **nicht gespeicherte, im PowerShell-Pipeline-Text angepasste Kopie** des gesamten Harnesses aus: Das Envelope wurde vor Restore explizit durch `JSON.parse(JSON.stringify(...))` serialisiert/deserialisiert; alle vollständigen Run-/Finance-Hash- und Inhaltsassertionen bestanden mit demselben Hash. Es wurden keine Repo-Dateien für diese Probe angelegt oder geändert.

Damit ist der aktuelle UI-JSON-Serialize/Parse-Weg unabhängig nachgewiesen. Als dauerhafte Regressionsempfehlung sollte A02 die JSON-Rundlauf-Ausdrucksform in `v3-year-order-smoke.mjs` übernehmen, damit künftige Änderungen sie automatisch prüfen.

## Ausgeführte Prüfungen

- `node --check prototype/v3-year-order-smoke.mjs` – PASS.
- `node prototype/v3-year-order-smoke.mjs` – PASS; 362 Tage, zwölf Monate, eine Rechnung/Zahlung; identische vollständige Run-/Finance-Hashes nach Envelope-Restore.
- In-Memory-Variante mit tatsächlichem JSON-Serialize/Parse vor Restore – PASS; identische Hashes und explizite Assertions.
- Finance-Runtime-, Run-Orchestrator- und Makrofixture-Regressionen – PASS.
- Gezielter `git diff --check` – PASS.

## Grenzen und Nachweisrollen

Der Smoke bleibt ein kontrollierter Einzelauftragstest, kein Jahresabschluss oder vollständiges Wirtschaftlichkeitsmodell. Hauptbuch, Steuern, Lieferanten-Cash, COGS, Lagerbewertung, vollständige Personal-/Raumkosten und Jahresreconciliation sind nicht Bestandteil. Das A09-JSON-Probeverfahren wurde nicht als dauerhafte Testdatei eingecheckt. Browser-/Geräteprüfung nicht ausgeführt; sie ist keine Abnahme dieses Harnesses.

**Ausführung:** A02 erweiterte Regression; A09 führte unabhängige Harness-, Baseline- und JSON-Probe aus.
**Fachreview:** A03 PASS ausschließlich im D-0166-/D-0168-Scope (CP-0330).
**Unabhängige QA:** PASS für vollständigen Save/Restore-State und explizite Rechnung-/Zahlungsinvarianten.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; lokaler Arbeitsbaum umfangreich geändert; keine A09-Produktänderung, kein Commit/Push.
**Offene Punkte:** Dauerhafte JSON-Rundlauf-Assertion im Harness empfohlen; vollständige V3-Jahres-/Ledgerabstimmung bleibt separat offen.
**Rückfragen an A01:** Keine.
**Blocker:** keiner für den Regressionstestumfang.
**Nächster Schritt:** A02 kann den JSON-Serialize/Parse-Ausdruck als dauerhafte Harness-Assertion ergänzen; T-0069 bleibt bis zu den getrennten Finance-/Jahresgates IN_PROGRESS.

