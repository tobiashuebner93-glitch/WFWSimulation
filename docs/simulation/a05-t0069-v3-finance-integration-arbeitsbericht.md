# A05-Arbeitsbericht T-0069 – V3 Finanzsicht und Szenario-Rechnung

**Status:** Implementierung und lokale Regression abgeschlossen; A09-Re-Review PASS im Code-/Regressionsumfang.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A05 – UI / RUN-INTEGRATION
**Bezug:** T-0069, CP-0313–CP-0318, D-0152, D-0165–D-0167

## Preflight und Bestandsaufnahme

Der integrierte V3-Lauf startet operativ am 04.01.2027. Nur für genau diesen bestätigten V3-Starttermin wird der D-0152-Finanzzustand am 01.01.2027 mit 10.000 € Bankbestand, 0 € Forderungen, Verbindlichkeiten und Darlehen eröffnet. Die Finanzquelle ist `D-0152:opening-profile-2027`. Andere Starttermine bleiben auch innerhalb des Jahres 2019 oder 2027 ohne FinanceState; ein Jahresvergleich allein berechtigt nicht zur Übernahme des Januar-Anfangsbestands.

Run und FinanceState bleiben ohne Datenbankschema nebeneinander bestehen und werden gemeinsam als versionierter JSON-Download gesichert. Beim Laden werden Save-Version, Run-Zustand, `runId`-Zuordnung und Finanzabstimmung geprüft. Alte Sicherungen ohne FinanceState bleiben ausdrücklich nicht initialisiert; es wird keine Null-Eröffnung unterstellt.

Die Arbeitskopie enthielt bereits zahlreiche lokale Änderungen und neue Dateien anderer Agenten. Diese wurden nicht verworfen oder bereinigt. Die Bearbeitung beschränkt sich auf die unten genannten A05-Dateien.

## Ergebnis

- Ergänzt wurden `createFinanceStateForRun`, Save-Envelope-/Restore-Adapter und ein Warnpfad für fehlenden beziehungsweise nicht bestätigten Finanzstart.
- Nach einer positiven, gespeicherten Kunden-/Empfängerentscheidung ruft die UI `recordV3ScenarioInvoiceFromCustomerEvidence` auf. Die A03-Funktion leitet Betrag und Leistungsdatum selbst aus validiertem A02-Run-Nachweis ab. Ablehnungen erzeugen keine Rechnung; erneute Verarbeitung ist idempotent.
- Die UI zeigt „Szenario-Rechnung (vereinfacht)“ samt Netto, SimTAX, Brutto, offenem Betrag, Fälligkeit sowie Finanzsicht für Bank, Nettoumsatz, Bruttoforderungen und SimTAX-Verbindlichkeit.
- Rechnungsstellung erzeugt keine Zahlung oder Cashbewegung. Allgemeine Kreditoren, Steuerabführung, COGS und vollständige externe Rechnungsbelege sind nicht Teil dieser Integration.
- Save/Load verwendet lokale JSON-Dateien; Browser-Speicher wird nicht eingesetzt.

## Geänderte Dateien

- `prototype/v3/run.js`
- `prototype/v3/run.html`
- `prototype/v3/run.css`
- `prototype/a05-t0069-run-ui-regressions.mjs`
- `prototype/v3/a05-t0069-run-ui-regressions.mjs` (Kompatibilitätseinstieg)
- `docs/simulation/a05-t0069-v3-finance-integration-arbeitsbericht.md`

## Prüfungen

- `node --check prototype/v3/run.js` – bestanden.
- `node prototype/a05-t0069-run-ui-regressions.mjs` – bestanden; einschließlich D-0152-Eröffnung, JSON-Rundlauf, Run-ID-Abweisung, fehlendem Finanzzustand, Ablehnung, positiver Kundenannahme, idempotenter Rechnung und unverändertem Bankbestand.
- `node prototype/v3-finance-runtime-regressions.mjs` – bestanden.
- `node prototype/v3-run-orchestrator-regressions.mjs` – bestanden.
- `node prototype/v3/a05-t0069-run-ui-regressions.mjs` – bestanden; der historische Testpfad führt die kanonischen Regressionen aus.
- `git diff --check` – Exit 0; Git meldete nur LF/CRLF-Hinweise bei vorhandenen getrackten Dateien. Gezielte Whitespaceprüfung aller sechs A05-Dateien einschließlich neuer Dateien – sauber.

## Bekannte Testdatei und Grenzen

`prototype/v3/a05-t0069-run-ui-regressions.mjs` ist jetzt ein kleiner Kompatibilitätseinstieg, der ausschließlich die kanonische Datei `prototype/a05-t0069-run-ui-regressions.mjs` ausführt. So bleibt der alte Aufrufpfad funktionsfähig, ohne die obsolete `advanceOneRunDay`-API oder die Ressourcenfreigabe zu umgehen.

## A09-Re-Review-Nacharbeit

A09 fand einen blockierenden Fehler im Startmapping: Ein Jahresvergleich hätte bei frei gewähltem Startdatum im Juni den D-0152-Januarbestand übernommen. Der Adapter bindet FinanceState nun ausschließlich an den bestätigten V3-Operativstart `2027-01-04`; dazu gehört das quellengebundene Opening am `2027-01-01`. Regressionen für `2027-06-10` und `2019-06-10` belegen, dass kein FinanceState und damit kein erfundener Januarbestand entsteht. Der UI-Hinweis benennt den nicht bestätigten Starttermin.

Es wurde keine interaktive Browser-/Geräteprüfung durchgeführt. A09-Re-Review nach dieser Korrektur: PASS für D-0152-Startgrenze, JSON Save/Restore, Rechnungsgrenze und kanonischen Testpfad. Eine visuelle Browser-/Geräteprüfung wurde nicht ausgeführt; Responsive CSS ist damit nicht interaktiv belegt. Keine Schemaänderung, kein CP durch A05, kein Commit und kein Push.
