# A09 unabhängiger Runtime-Review – T-0065 Markt

**STATUS:** NONPASS – Reproduktion fehlerhafter Eventhistorie erzeugt doppelte Anfragen
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA
**MASTER GOAL / SECOND-LEVEL GOAL:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0065 (Runtime-QA; nicht Gesamtintegration)
**VORGÄNGER:** CP-0279; CP-0280 bleibt ENTWURF
**MASSGEBLICHE ENTSCHEIDUNGEN:** D-0159–D-0164, insbesondere D-0162
**REPOSITORY:** `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; `main...origin/main`.

## Preflight und Bestand

Frisch gelesen: `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280, D-0159–D-0164, A02-T-0065-Arbeitsbericht und Marktmodellrahmen, A02 gemeinsamer Integrationsvertrag, A03-D-0162-Finanzvertrag, `prototype/v3-market-simulation.js` und dessen Regressionen. Branch/HEAD und paralleler Working Tree wurden geprüft. Zahlreiche bestehende Änderungen und untracked Dateien anderer Agenten liegen vor; sie blieben unangetastet. A09 änderte nur diesen Reviewbericht. Keine Produktdatei geändert.

A02s Code ist ein isoliertes V3-Modul ohne V1/V2-, UI-, Ledger- oder Finance-Import. A02 bezeichnet es selbst als Phase 1; A03-Fachreview, A05-UI-Verbrauch und die T-0065-Gesamtintegration sind von dieser A09-Laufzeitprüfung getrennt.

## Gate-Ergebnisse

| Gate | Ergebnis | Beleg |
|---|---|---|
| Grundform/Profilvalidierung | **PASS mit History-Ausnahme** | Fehlendes Pflichtfeld `inquiries` wird als `invalid_market_state` abgewiesen. Profil verlangt valide Daten, explizite Parameter, genau ein Playerunternehmen, mindestens drei Konkurrenten und eindeutige Firmen-IDs. |
| Event-/Idempotenzhistorie | **NONPASS – Blocker** | Ein gültig geplanter Wochenzustand hatte 1 Event und 1 `processedEventId`. Nach Entfernen derselben Eintragung aus `events` **und** `processedEventIds`, bei beibehaltenen `scheduledWeeks` und Anfragen, akzeptiert `validateV3MarketState` den korrupten Zustand. Ein erneuter identischer `scheduleV3MarketWeek`-Aufruf wird als neu (`duplicate=false`) verarbeitet und erhöht `inquiries` von 1 auf 2; beide Anfragen tragen dieselbe `inquiryId` (`duplicateInquiryIdCount=1` statt 2). Damit ist die History-Validierung nicht an bereits persistierte Wochen-/Anfragendaten gebunden und ein defekter Restore kann doppelte Marktanfragen erzeugen. |
| Seed-/Wochenverteilung | **PASS** | Bestehende Regression erstellt identisches Ergebnis für gleiches Seed/Profil und plant vier Wochen mit je fünf Vorlagen für drei Seeds. Alle Eingänge liegen Mo–Fr; pro Seed werden mindestens vier Werktage abgedeckt. |
| Fähigkeit/Kapazität/Einladung | **PASS im Code-/Fixtureumfang** | `rankEligibleFirms` filtert vor Scoring auf alle Pflichtfähigkeiten und `capacityUnits >= requiredCapacity`; Regression weist einen fachlich nicht passenden Wettbewerber ab. Der anschließende Einladungswert verwendet die expliziten Profilgewichte für Reputation, Kapazität und Segmentfit; Cutoff und maximale Einladungszahl sind explizit. |
| Angebotsscore / Kundensegmente | **PASS im Code-/Fixtureumfang** | Zuschlagsscore gewichtet Preis, Reputation und Segmentfit mit Segmentparametern; stabile Tie-breaks nach Firmen-/Angebots-ID. Regression erhält einen Player-Zuschlag und bestätigt den angenommenen Preis. Diese Prüfung belegt nicht die empirische Kalibrierung der Gewichte. |
| Entscheidung am Ablauftag | **PASS** | Grenzfallregression: eingereichtes Angebot entscheidet am selben Datum, an dem die Anfrage abläuft. `advanceV3MarketDay` löst zuerst die fällige Kundenentscheidung auf; `closeV3MarketDay` lässt die Anfrage anschließend `resolved`, nicht `expired`. Unbeantwortete Anfragen laufen im End-of-Day-Schritt am Ablaufdatum ab. |
| Wiederholung/Mehrfachtransition | **PASS für unveränderte gültige Eingaben** | Wiederholung derselben Tagesfortschreibung nach Abschluss und derselben Tages-Schließung ist idempotent; Einreichungswiederholung nach späteren Übergängen liefert das gespeicherte Ergebnis. Abweichender Angebots-Payload mit gleicher Event-ID wird als `market_event_payload_conflict` abgewiesen. Der History-NONPASS oben kann diese Garantien nach beschädigtem Restore umgehen. |
| Konkurrenzdaten im Spielerblick | **PASS** | Regression serialisiert `getV3MarketPlayerView` und findet weder Konkurrenz-ID `competitor-a` noch Einzelpreis `10000`. Der View exportiert nur eigene Angebotsdaten und das Spielergebnis. |
| Monatsmittel / kleine Stichprobe | **PASS** | Bericht gruppiert nach Größenklasse ohne `firmId`/`offerId`; Mittelwert wird bei Unterschreiten von `minimumMonthlyCompetitorSample` `null` und `suppressed=true`. Regression: Mindeststichprobe 3 bei zwei Beobachtungen unterdrückt den Mittelwert. Die Stichprobenzahl bleibt sichtbar. |
| Snapshot-Freeze / Preisänderung | **PASS** | Angebot muss auf stabile `offerId`, `submittedAt`, Versionen und Centpreis des A03-Snapshot passen. Einreichung kopiert den Snapshot; Mutation des Caller-Objekts ändert gespeicherten Stand nicht. Annahme ändert weder Preis noch Snapshot. Tamper des gespeicherten Snapshots gegenüber Submit-Event wird durch State-Validator abgelehnt. |
| Keine Finanzmutation | **PASS für isoliertes Modul** | Marktmodul importiert keine Finance-/Ledgerkomponente; Angebot, Zuschlag und Ablauf erzeugen nur Marktstatus. API-/Regressionsergebnisse enthalten keine Buchungs-, Cash-, Forderungs- oder Verbindlichkeitseffekte. Das belegt keine spätere A05-/Engine-Integration. |

## Exakte Blockerreproduktion

Die temporäre In-Memory-Probe verwendete synthetische Fixtures, keine Dateien:

```text
scheduled state: events=1, processedEventIds=1, inquiries=1
remove same weekly-schedule event from events and processedEventIds
validateV3MarketState(corrupt) -> true
schedule same week and same template again -> ok=true, duplicate=false
inquiries: 1 -> 2; unique inquiry IDs remain 1
```

Ein separates fehlendes Kernfeld wurde korrekt abgewiesen. Der Fehler ist daher nicht die allgemeine Formvalidierung, sondern die fehlende bidirektionale Konsistenzprüfung zwischen Eventhistorie/Idempotenzindex und `scheduledWeeks`/abgeleiteten Anfragen. A02 sollte vor dem nächsten A09-Gate entweder korrupten Restorezustand fail-closed abweisen oder Wochenplanung gegen gespeicherten Wochen-/Anfragestatus idempotent sichern; die passende Regression soll denselben Verlauf abdecken und eine einzige eindeutige Anfrage garantieren.

## Prüfungen

- `node --check prototype/v3-market-simulation.js` – PASS.
- `node --check prototype/v3-market-simulation-regressions.mjs` – PASS.
- `node prototype/v3-market-simulation-regressions.mjs` – PASS (`V3 market simulation regressions: PASS`).
- `node prototype/v3-financial-calculation-regressions.mjs` – PASS (`V3 financial calculation regressions: PASS`).
- `git diff --check` – Exit 0; nur konfigurierte LF/CRLF-Hinweise in vorhandenen, parallelen Änderungen.
- Zusätzliche ephemere Proben: fehlendes Pflichtfeld fail-closed; Entfernen von Event plus Index akzeptiert; darauf folgende identische Wochenplanung erzeugt doppelte Anfrage – **Fehler reproduziert**.
- Browser-/Mobiltest nicht erforderlich für dieses Runtime-Gate und nicht ausgeführt. Kein Jahres-/End-to-End-Test.
- `git status --short --branch`: `main...origin/main`, viele vorhandene Änderungen anderer Rollen. Diese wurden erhalten. Kein Commit/Push.

## Schlussfolgerung und Nachweisrollen

- **Ausführung:** A02 lieferte isolierte Markt-Runtime/Regression; A09 führte unabhängige Regressionen und In-Memory-Grenzfallprobe aus.
- **Fachreview:** A03s Markt-/Finanzreview ist separat; hier nicht als ausgeführt behauptet.
- **Unabhängige QA:** **NONPASS** ausschließlich wegen fehlender Restore-History-Integrität mit nachweisbarer Duplikatfolge. Die übrigen oben aufgeführten isolierten Gates bestehen.
- **Browser-/Gerätetest:** nicht ausgeführt; A05-UI-Verbrauch separat offen.
- **Git-Verifikation:** branch, HEAD, Status und `git diff --check` geprüft; parallele Änderungen erhalten.
- **Offene Abhängigkeiten:** A02 behebt History-/Duplikatblocker und übergibt an A09 zur gezielten Reproduktion. A03/A05/T-0063-/T-0067-Integration und spätere T-0069-Jahresprüfung bleiben separat offen. Keine empirische Marktpreis-/Wahrscheinlichkeitskalibrierung bestätigt.
- **Commit/Push:** nicht ausgeführt.
