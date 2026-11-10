# A09 unabhängige Runtime-QA – T-0063 Makro

**STATUS:** NICHT BESTANDEN – Ereignisidentität und wiederhergestellter Zustand benötigen Schutz
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5
**TICKET:** T-0063
**PRE-FLIGHT:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0063, D-0100–D-0102, D-0159, D-0161–D-0164, A02-Makro-/Integrationsvertrag und A03-Finanzübergabe geprüft. Checkout: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`. Vorhandene breite Änderungen verschiedener Agenten und `prototype/engine.js`-Fremddiff wurden erhalten; kein Code geändert.

## Geprüfter Umfang

- `prototype/v3-macro-simulation.js`
- `prototype/v3-macro-simulation-regressions.mjs`
- `prototype/v3-price-index.js`
- `prototype/v3-price-index-regressions.mjs`
- A02 Makrovertrag/Integrationsvertrag und A03 T-0063-Finanzübergabe

Dies ist eine technische Runtime-QA für die isolierte V3-Phase-1-Implementierung. Sie belegt weder empirische Kalibrierung noch das vollständige Ticket, UI-Integration oder Releasefreigabe.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Bestehende Regressionen / Syntax | **PASS** | Makro- und SPI-Regressions sowie Node-Syntaxchecks liefen erfolgreich. |
| Monatliche Deterministik / Replay | **PASS mit Vorbehalt** | Gleiche Eingabe desselben Monats wird idempotent als Duplikat erkannt; andere Payloads und Periodensprünge werden kontrolliert abgewiesen. Durch überschreibbare Metadaten (unten) ist die generierte Event-ID jedoch nicht geschützt. |
| Eingabe- und Vorzustands-Nichtmutation | **PASS** | Die bestehende Suite belegt unveränderte Eingaben und Ursprungszustand. |
| Vier Phasen / Hysterese | **PASS** | Vier Phasen, Persistenz, benachbarte Übergänge, expliziter Schock und fehlende Indikatoren werden durch synthetische Fixtures unterschieden. |
| SPI / m/m / y/y / fehlende Historie | **PASS** | Die separate SPI-Regression besteht; Makromodul erhält fehlende Raten als `null`. |
| Außenwirtschafts-/Politikkanäle und Lag | **PASS mit Begrenzung** | Alle drei bzw. acht Kanäle werden getrennt geführt, Quellen-/Lag-/Unsicherheitsfelder gespeichert, wirksame Ereignisse aktiviert; es entstehen noch keine Betriebswirkungen. |
| MRO-Future-Pfad / A03-Grenze | **PASS mit Begrenzung** | Synthetische Regel ist explizit versioniert/un­kalibriert; Lag, Unsicherheit, indikative Anfragequote und keine Ledger-/Cash-/Altvertragswirkung geprüft. Finanzfachreview durch A03 wurde in diesem QA-Lauf nicht ausgeführt. |
| Generated Event Metadata / Idempotenz | **NICHT BESTANDEN** | Eingabedatensätze können systemgenerierte `macroEventId`- und `period`-Felder überschreiben. |
| Validierung serialisierter Zustände | **NICHT BESTANDEN** | Validator nimmt Event-losen Verlauf sowie fehlende Laufidentität als gültigen Zustand an. |
| Beobachtungsprovenienz | **WARNUNG** | `sourceType: observed` wird auch ohne Beobachtungsperiode oder Zeitstempel akzeptiert; SPI-Komponenteneingaben haben keine entsprechenden Beobachtungsfelder. |
| V1/V2-Trennung | **PASS** | Makro- und SPI-Module sind isoliert; A02 berichtet keine Änderungen an Legacy-Engine/UI. |
| Browser-/Geräte- oder Jahresprüfung | **NICHT AUSGEFÜHRT** | Keine UI-/Jahresintegration in diesem A02-Paket. |

## Blocker 1 – Caller-Daten überschreiben Systemidentität

In `addEvent` erstellt die Runtime den Payload mit systemgenerierten Feldern und fügt danach `...clone(record)` ein. Ein beliebiger externer oder Politik-Datensatz mit `macroEventId` oder `period` überschreibt dadurch die IDs/Periode.

Unabhängige Inline-Probe: gültiger `fx_imported_inputs`-Datensatz wurde um `period: "1999-01"` und `macroEventId: "spoofed"` ergänzt. `runV3MacroMonth` gab `ok: true` zurück; das erzeugte Ereignis hatte `period="1999-01"` und `macroEventId="spoofed"` statt der generierten Identität. Da Folgemonate denselben Fremdwert enthalten können, werden Event-Eindeutigkeit und `activatedEventIds`-Abgleich unzuverlässig.

**Erforderliche Korrektur:** Event-Envelope-Felder nach Record-Spread setzen und/oder Eingabe-Feldliste strikt whitelisten; Konflikte mit reservierten Namen kontrolliert ablehnen. Regressionen müssen mindestens `macroEventId`, `period`, `channel`, `scenarioId` und `modelVersion` als Konfliktfelder abdecken und sicherstellen, dass Nutzerwerte Systemfelder nicht übersteuern.

## Blocker 2 – Wiederhergestellter Runtime-Zustand wird unvollständig geprüft

Unabhängige Inline-Probe: Nach einem gültigen Lauf wurden `events=[]` gesetzt, während period snapshots/fingerprints unverändert blieben. `validateV3MacroState` lieferte weiterhin `true`. Ebenso wurde nach Entfernen von `runId` aus dem Zustand `true` geliefert. Die Runtime hat damit keine belastbare Integritätsprüfung für die gespeicherte Event-Historie und zwingende Identitäts-/Versionfelder. Eine solche Datei könnte als valide fortgesetzt werden, obwohl Eventprovenienz bzw. Event-Aktivierung nicht mehr mit den Snapshots übereinstimmt.

**Erforderliche Korrektur:** Pflichtfelder und Typen der State-Identität validieren; Event-IDs und Event-Einhüllungen mit `processedPeriods`, Snapshot-Referenzen und Aktivierungsliste abstimmen. Fehlender/falscher Verlauf muss vor einer Monatsverarbeitung kontrolliert abgewiesen werden; keine stille Rekonstruktion oder Mutation.

## Provenienz-Warnung

Inline-Probe mit `activity.sourceType="observed"` und `observedPeriod`, `observedAt`, `publishedAt` leer ergab `ok: true`; der Snapshot kennzeichnete Aktivität als `observed` bei null Beobachtungsdaten. Für SPI-Komponenten gibt es nur `componentSourceType`/`componentSourceRef`, aber kein separates Beobachtungsdatum/-periode. Das verwischt Beobachtungs- und Wirksamkeitsdatum, die A02/A03-Schnittstellen ausdrücklich trennen.

A02/A08 sollen klären, welche Beobachtungsfelder für jede beobachtete Datenfamilie verpflichtend sind. Mindestens sind sie im Eingabeschema/Fachvertrag getrennt vom Simulations-/Wirksamkeitsmonat zu führen; synthetische Fixtures bleiben ausdrücklich als solche markiert.

## Ausgeführte Prüfungen

- `node prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `node prototype/v3-price-index-regressions.mjs` – PASS.
- `node --check prototype/v3-macro-simulation.js` – PASS.
- `node --check prototype/v3-macro-simulation-regressions.mjs` – PASS.
- `git diff --check` – Exit 0; nur vorhandene LF/CRLF-Konvertierungshinweise.
- Drei eigenständige Inline-Proben – Event-Metadaten-Overwrite **reproduziert**, Event-loser/missing-runId-State **als gültig akzeptiert**, beobachtete Aktivität ohne Zeitraum/Zeitstempel **akzeptiert**.

## Nächster Schritt und offene Grenzen

A02 soll die beiden Runtime-Blocker eng begrenzt beheben und Regressionen ergänzen. A02/A08 sollen die Beobachtungsprovenienz konkretisieren; A03 muss die Finanzhandoff-Grenze fachlich prüfen. Danach ist ein unabhängiger A09-Re-Review notwendig. A05-UI-/Unternehmenswirkungsintegration sowie reproduzierbare Jahres-/Szenarioabnahme bleiben für T-0063/T-0069 offen. Keine Nutzerentscheidung ist für die technischen Korrekturen notwendig; keine Rechts-, Finanz-, Produkt- oder Architekturfreigabe wird behauptet.

**Ausführung:** A02 lieferte Runtime und eigene Regressionen; diese QA ist unabhängig.
**Fachreview:** A02-Selbstreview laut Bericht; unabhängiges A03-Finanzreview nicht ausgeführt.
**Unabhängige QA:** A09; drei neue Grenzfälle ergaben die oben beschriebenen Befunde.
**Browser-/Gerätetest:** nicht ausgeführt.
**Git-Verifikation:** Preflight-Status geprüft, `git diff --check` Exit 0; keine Produktdatei geändert.
**Commit/Push:** nicht ausgeführt.
