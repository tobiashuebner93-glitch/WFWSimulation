# A06 – T-0069 isolierter V3-Lernlaufadapter

**STATUS:** Isolierter Laufzeitadapter umgesetzt; nicht in den gemeinsamen Run integriert
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A06 – IHK_LEARNING
**MASTER GOAL / SECOND-LEVEL GOAL:** MG-002 / SLG-002.3 / SLG-002.4
**TICKETS:** T-0068 → T-0069; A02 ist Integrationsowner
**Vorgänger-Checkpoint:** CP-0292 (ENTWURF)
**Profil:** V3; Laufzeitdatum kommt vom Aufrufer, kein eigenes Startdatum oder Simulationskalender
**Maßgebliche Entscheidungen:** D-0147, D-0159, D-0161–D-0164

## Preflight

AGENTS.md, Agentenstruktur und Rechtekarte, Goals, vollständiges Ticket-Board, Collaboration State, Decision Log, CP-0292 sowie den lokalen Gitstatus geprüft. Der Arbeitsbaum enthält zahlreiche bereits vorhandene, parallele Änderungen; sie blieben erhalten. Die 50 T-0068-Fragen, Kompetenzzuordnung, Lernobjekt und A06/A07/A09-Wirkungsreviews wurden gelesen. `prototype/v3-process-learning.js` existiert im aktuellen Checkout nicht. Vorhanden sind `prototype/v3-process-learning-regressions.mjs`, die T-0068-JSON-Lernobjektdatei sowie dessen `market.js`-Renderer; diese beschreiben noch keinen Laufzeitadapter für die 50 EVT-Fragen.

D-0147 setzt maximal fünf Dashboardantworten pro Simulationsdatum und erlaubt kleine Ruf-, Kompetenz- oder Motivationswirkungen, keine Buchungen. Der T-0068-Katalog erklärt alle 50 Fälle als nicht direkt mutierend. Das bestehende V2 `applyLearningAnswerEffect` ist an die V2-Spielzustände gekoppelt; ein stabiler A02-Vertrag, der dessen Effekte im isolierten V3-Run sicher und begründet auslöst, liegt nicht vor. Daher bleibt die V3-Wirkung hier explizit `not_applied`. D-0159 wird nicht als V3-Regel verallgemeinert: Die Nichtblockierung folgt dem beauftragten optionalen Dashboard-Lauf; es gibt keine Unterbrechung oder Sperre des Simulationsarbeitstags.

## Umsetzung

Neu:

- `prototype/v3-learning-runtime.js`
- `prototype/v3-learning-runtime-regressions.mjs`

Der Adapter nimmt die geprüften EVT-Datensätze vom Aufrufer entgegen; er kopiert sie und ändert weder Katalog noch Unternehmensobjekt. Die Auswahl erzeugt pro Datum eine stabile, seed-basierte Folge von bis zu fünf IDs, speichert diese Tagesfolge im exportierbaren Lernzustand und hält die Restfolge bei Neustart/Replay stabil. Noch unbeantwortete Fälle werden nicht als gesehen markiert. Die Rotation verwendet zunächst alle noch nicht beantworteten Katalog-IDs und wiederholt erst nach Erschöpfung des Katalogs.

Antworten sind an die für den Tag angebotenen IDs gebunden, pro ID nur einmal zulässig und nach fünf angenommenen Antworten gesperrt. Eine richtige Antwort zählt einen Lernpunkt, eine falsche null; beide werden mit Datum, ID, Auswahl, Ergebnis, Punktzahl und Wirkungsschranke in einem Lerntrace protokolliert. Das ist ein Lernfortschritt, kein Unternehmens-/Betriebszustand.

## A02-Handoff – vorgeschlagene API

```js
import {
  createV3LearningRuntime,
  getV3DailyLearningEvents,
  answerV3LearningEvent,
  exportV3LearningRuntimeState,
} from './v3-learning-runtime.js';

const learning = createV3LearningRuntime({
  seed: runSeed,
  items: approvedEventItems, // EVT-ID, correctOption und unveränderte Anzeigefelder aus T-0068
  state: restoredLearningState ?? null,
});
const todaysEvents = getV3DailyLearningEvents(learning, simulationDate); // höchstens 5
const result = answerV3LearningEvent(learning, {
  date: simulationDate,
  eventId,
  selectedOption: 'A' | 'B' | 'C' | 'D',
});
const serializableLearningState = exportV3LearningRuntimeState(learning);
```

`answerV3LearningEvent` liefert bei Annahme `{ accepted, correct, points, trace }`, bei Ablehnung `{ accepted:false, reason }`. Ablehnungsgründe sind `unknown_event`, `daily_limit`, `already_answered` und `event_not_offered`. Der Trace setzt `effectStatus: 'not_applied'` und begründet ausdrücklich, dass der isolierte Adapter keinen freigegebenen V3-Wirkungsadapter besitzt. A02 darf die Oberfläche integrieren, muss aber dieses Nichtwirkungs-Label bis zu einem separaten, geprüften Effektvertrag beibehalten. Die Lernfragen sind weder Tagesblocker noch Buchungs-/Finanzereignisse.

Der Aufrufer muss den geprüften Katalog bereitstellen; dieses Paket generiert, verändert und dupliziert keine Frageinhalte. Keine Integration in `run.js`, keine Änderung an V2 `engine.js`/`learning-ui.js`, keine Session-/Datenbankschema-/Architekturfreigabe.

## Tests und Nachweise

`node prototype/v3-learning-runtime-regressions.mjs` — **PASS**:

- Katalogbindung an exakt 50 EVT-IDs und Schlüssel aus dem bestehenden T-0068-Markdown;
- höchstens fünf Angebote und angenommene Antworten pro Tag;
- keine Wiederholung, bevor alle 50 Fragen beantwortet wurden;
- gleiche Seed-/Datumsfolge, andere Seeds variieren die Auswahl;
- richtige/falsche Antworten und Punktesummen;
- gleiche Tagesrestfolge nach Export/Restore und deterministische Folgetage;
- Replay und Tracewirkung;
- Company-Fixture mit Cash, Forderungen, Ledger, Bestand, Ruf und Personal wird unverändert gelassen.

Fachreview, unabhängige QA, Browser-/Gerätetest und A02-Integration: **nicht ausgeführt**. Commit/Push: **nicht ausgeführt**. Gitstatus wurde vor der Arbeit gelesen; abschließende gemeinsame Git-Verifikation bleibt A01 vorbehalten. Keine Rückfrage an den Nutzer.

## Übergabe

A02 kann diesen Adapter als nichtbuchende optionale Lernansicht integrieren. Falls A02 für die Produktintegration tatsächlich die D-0147-Ruf-/Kompetenz-/Motivationswirkung auf V3-State übernehmen will, soll A02 zuerst den Wirkungspfad und die erlaubten Zielzustände in einem Schnittstellenvorschlag festhalten; A03/A09 prüfen dann Nichtmutation und begrenzte Effekte. Bis dahin gilt ausschließlich der getestete Lernpunkt-/Tracepfad.
