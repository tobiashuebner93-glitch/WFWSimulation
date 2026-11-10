# A02-Arbeitsbericht – T-0064 isolierte V3-Runtime

**Status:** isolierter V3-Modellentwurf implementiert; unabhängiges A09-Review und A05-UI-Integration offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent/Goal/Ticket:** A02 – SIMULATION / MG-002 / SLG-002.2 / T-0064
**Entscheidungsanker:** D-0159, D-0161, D-0163, D-0164; CP-0280 (ENTWURF)
**Preflight:** AGENTS, Agentenstruktur/Rechte, Goals/V3-Zielkarte, T-0064, Collaboration State, Decision Log, CP-0280, A02-Statusvertrag, A03-T-0064-Finanzvertrag, A08-Rechtsregister/-Matrix, A09-QA-Vorbereitung und vollständiger Gitstatus/Diff geprüft.

## Lieferumfang

- `prototype/v3-company-formation.js` – neue, eigenständige, reine V3-Statusmaschine. Sie importiert/ändert weder `prototype/engine.js` noch V1/V2-Spielzustände.
- `prototype/v3-company-formation-regressions.mjs` – zielbezogene Node-Regressionen.
- Dieser Bericht mit API-, Abgrenzungs- und Testnachweis.

## API für A05

```js
import {
  createV3FormationState,
  applyV3FormationEvent,
  validateV3FormationState,
  V3_COMPANY_MODEL_VERSION,
} from './v3-company-formation.js';
```

`createV3FormationState({scenarioId,startDate,founderPersonId,initialEntityId,initialEntitySourceRef})` benötigt alle Identitäts- und Zeitwerte explizit und liefert einen JSON-serialisierbaren V3-Ausgang mit einer bestehenden Einzelunternehmung, getrennten Personen-/Rechtsträger-IDs sowie Gründungsvorhaben `idea`.

`applyV3FormationEvent(state,event)` mutiert den Eingabezustand nicht. Der Eventumschlag benötigt stets `eventId`, `type`, `effectiveDate` (gültiges ISO-Datum) und `sourceRef`. Ergebnis ist `{ok,state,duplicate,error?,emitted?,financeHandoffs,sourceRefs}`. Erfolgreiche Wiederholung derselben ID und desselben JSON-Payloads ist idempotent; gleiche ID mit abweichendem Payload ist ein Fehler. Ungültige Übergänge geben den unveränderten Zustand zurück.

Unterstützte Eventtypen:

| Bereich | Eventtypen und wesentliche Eingaben |
|---|---|
| Gründung | `ADVANCE_FOUNDING_STAGE`; `ASSESS_VIABILITY` mit sechs vollständigen, referenzierten Eingabebereichen (`market`, `offer`, `capacity`, `costs`, `financing`, `requirements`) und explizitem Ergebnis; `SELECT_FORM`; `PREPARE_FORMATION` |
| Rechtsform/Status | `SELECT_FORM` lässt nur `einzelunternehmen` und `gmbh_co_kg` zu. GmbH & Co. KG verlangt getrennte GmbH-/KG-IDs, Eigentumsreferenzen für beide sowie Partnerrollen: GmbH als Komplementärin und mindestens ein Kommanditist. `SET_REGISTER_STATUS` erzwingt vorbereitende/formale Schritte und Beleg. `AUTHORIZE_KG_PREREGISTRATION_ACTIVITY` verlangt identische vollständige Partnerliste, Einzelzustimmung jedes Gesellschafters, geklärte § 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB-Prüfung und bei GmbH & Co. KG die registrierte GmbH. `ASSESS_OPERATIONAL_READINESS`; `START_OPERATIONS`. |
| Kandidaten | `ag`, `eg`, `gmbh_co_kgaa` liefern `candidate_not_enabled`; keine Status-/Finanzwirkung. |
| Kooperation | `OPEN_COOPERATION`, `ASSESS_COOPERATION`, `CLOSE_COOPERATION` für gemeinsamen Einkauf und Arbeitsgemeinschaft; Rechtsform- und Wettbewerbsreview sind explizit. |
| Anteil-/Assetgeschäft | `OPEN_SHARE_DEAL`, `OPEN_ASSET_DEAL`, `REVIEW_DEAL`, `CLOSE_DEAL`. Share Deals benötigen explizite bisherige/neue Inhaberreferenz und die Angabe, ob die bisherige Beziehung endet. Asset Deals führen getrennte § 613a-/§ 613a Abs. 2- und § 25-HGB-Reviewinputs; bei § 613a werden Beschäftigten-, Informations- und Widerspruchsstatus referenziert. |

`validateV3FormationState(state)` prüft Modellversion, Rechtsträger-/Eigentumsreferenzen, Eventpayloads sowie die Nichtmutationsinvarianten der A03-Finanzhandoffs.

## Schutzgrenzen und verbleibende Eingaben

- Tragfähigkeit ist `assessment_incomplete`, bis alle sechs Eingabekategorien als vollständig referenziert vorliegen. Ergebnis `viable`/`not_viable` wird explizit übergeben; die Runtime erfindet keine Preis-, Gebühren-, Steuer-, Kapital- oder Tragfähigkeitswerte.
- Registerstatus und Betriebsfähigkeit sind getrennte Achsen. Die GmbH wird vor Eintragung nicht als existierende GmbH geführt. Der KG-Vorregisterpfad ist nur mit dokumentierten Zustimmungen sämtlicher gespeicherter Partner und geklärtem Rechtsreview möglich; er führt nicht zu `registered`.
- Rechtsprüfung ist ein extern referenzierter Status, keine eigenständige Rechtsbewertung. § 613a Abs. 2-Anspruchsreferenzen tragen Parteien, Entstehungs-/Fälligkeitsdatum, Bemessungszeitraum, Quellenbezug und einen Betragsstatus, aber die Runtime berechnet keine Haftungsquote. § 25 HGB benötigt einen dokumentierten Firmenfortführungs- oder besonderen Verpflichtungsgrund. Offene Prüfungen sperren den Abschluss.
- Share-Deal-Schluss aktualisiert ausschließlich ausdrücklich referenzierte Eigentümerbeziehungen und lässt die Ziel-`entityId` bestehen. Asset-/HR-/Verbindlichkeits-/Vertragsübertragungen werden nicht automatisch im Spielzustand mutiert.
- A03-Finanzvertrag T-0064 liegt vor. Ein Abschluss erzeugt lediglich einen Handoff mit `status: no_financial_effect_until_explicit_A03_event`, Parteien-/Transaktions- und Legalreferenzen und noch erforderlichen Finanzinputs. `financialEventRef` bleibt null; Ledger- und Cashmutation sind false. A03 entscheidet anhand seines Vertrags über konkrete autorisierte Finanzereignisse; keine Beträge/Nullbuchungen werden angesetzt.
- Keine Schema-, Architektur-, UI- oder Produktintegration. A05 baut den separaten V3-Wizard. V1/V2 und bestehende Engine-Dateien bleiben außerhalb dieses Tickets.

## Testmatrix und Nachweise

| Fall | Ergebnis |
|---|---|
| Unvollständige Bewertungsinputs | blockiert; kein Statusfortschritt |
| Vollständige positive und negative Tragfähigkeitsbewertung | positiv kann zum Start fortschreiten; `not_viable` blockiert Betriebsbereitschaft |
| Kandidaten AG/eG/KGaA | gesperrt, ohne Zustandsänderung |
| GmbH/KG getrennte IDs, Partner- und Eigentumsreferenzen | validiert; keine Verschmelzung |
| Registersprung ohne Filing | blockiert |
| KG-Vorregisterpfad ohne GmbH-Registereintrag, vollständige Zustimmung oder geklärtes HGB-Review | blockiert |
| Eingetragene GmbH und vorregistrierte KG mit § 123/161-Nachweis | Status korrekt getrennt; kein fingiertes Registerereignis |
| Share Deal vs. Asset-/Betriebskauf | eigene Dealtypen; § 613a/§ 25-Reviews separat; offener Review blockiert Schluss |
| § 613a Abs. 2-Anspruchsreferenzen und § 25-Firmenfortführungsfall | werden im Finanzhandoff erhalten; keine Haftungsquote oder Buchung |
| Duplikat-ID, Payloadkonflikt und Nichtmutation | identischer Replay no-op; abweichender Payload Fehler; Quellzustand unverändert |
| A03-Grenze | Handoffs bleiben explizit nicht buchungsfähig, ohne autorisierten Finanz-Event |

Ausgeführt:

- `node prototype/v3-company-formation-regressions.mjs` – PASS.
- `node --check prototype/v3-company-formation.js` – PASS.
- `node prototype/a02-t0064-legal-regressions.mjs` – PASS; betrifft weiterhin nur die bereits vorhandene V2-Rechts-/Arbeitszeit-/Kalenderlogik, nicht das neue V3-Modul.
- `git diff --check` – Exit 0; Git meldet bestehende LF/CRLF-Konvertierungshinweise in anderen Dateien.
- Gezielter Whitespace-Scan für beide neuen Runtime-Dateien und Bericht – ohne Befund.

**Ausführung:** A02. **Fachreview:** A02-Selbstreview gegen T-0064, A02-Vertrag, A03-Vertrag und A08-Review; A08-Re-Review PASS mit Hinweis wurde umgesetzt. **Unabhängige QA:** A09-Review des neuen Moduls noch ausstehend. **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Integration. **Git-Verifikation:** Arbeitsbaumstatus geprüft; fremde Änderungen blieben erhalten; keine Änderung an `prototype/engine.js` durch diesen Auftrag; kein Commit/Push.

**Nächste Handoffs:** A05 kann die neue API in seinem separaten V3-Wizard verwenden. A09 prüft Transitionen, Rechtsstatus und Nichtmutation unabhängig. A03 prüft das Handoff-Objekt nach Integration anhand seines T-0064-Finanzvertrags. A12-Browserreview erst nach A05-Integration.

## A09 Runtime-QA-Befund und gezielte Korrektur (2026-10-31)

A09 reproduzierte einen strukturellen Blocker: Ein Zustand ohne foundingProject und persons wurde als gültig bewertet; ADVANCE_FOUNDING_STAGE warf anschließend einen TypeError. validateV3FormationState prüft nun die erforderlichen Zustandsfelder und Objekt-/Arrayformen einschließlich foundingProject, persons und der für Transitionen verwendeten Grundstrukturen. applyV3FormationEvent führt diese Prüfung vor jedem verschachtelten Zugriff aus und antwortet bei ungültigem Zustand kontrolliert mit error.code: invalid_state_shape; der übergebene Zustand bleibt unverändert.

Die gezielten Regressionen prüfen den kleinsten durch createV3FormationState erzeugten gültigen Zustand, fehlendes foundingProject, fehlende persons sowie mehrere ungültige persons-Formen. Für die Übergänge wird kontrollierte Ablehnung ohne Ausnahme und ohne Mutation geprüft.

**Prüfungen nach Korrektur:** node prototype/v3-company-formation-regressions.mjs, node prototype/a02-t0064-legal-regressions.mjs, node prototype/v3/a05-t0064-regressions.mjs, node prototype/v3/a05-t0064-ui-regressions.mjs, node --check prototype/v3-company-formation.js und git diff --check – alle PASS. Git meldet lediglich bestehende LF/CRLF-Hinweise. Die unabhängige A09-Nachprüfung wurde nicht ausgeführt und ist der nächste Schritt. Kein Commit/Push.
## A09 Runtime-Re-Review: Basisidentität und Eigentum (2026-10-31)

A09 bestätigte die erste Korrektur, reproduzierte aber weitere ungültige Zustände mit leeren Identitätslisten: ein Projekt ohne Person, Ausgangsrechtsträger und Gründereigentum wurde akzeptiert; die Auswahl GmbH & Co. KG warf danach einen TypeError. Die Validierung verlangt jetzt mindestens eine gültige Gründerperson, genau einen Ausgangsrechtsträger gemäß dem durch createV3FormationState erzeugten Einzelunternehmensprofil, übereinstimmende Gründer-IDs im Projekt und Ausgangsrechtsträger sowie den belegten Gründer-Eigentumsbezug. Gründerreferenzen der vorhandenen Rechtsträger müssen zu Personen auflösen. Ungültige Zustände werden vor jedem Ereigniszugriff mit invalid_state_shape und ohne Mutation abgewiesen.

Neue Regressionen prüfen leere Personen-/Rechtsträger-/Eigentumslisten sowohl gegen Stage-Fortschritt als auch gegen die GmbH-&-Co.-KG-Auswahl, fehlendes Gründereigentum, Projekt-/Entitätsgründerabweichung, nicht auflösbare Gründerreferenz und den gültigen Minimalzustand. Keine Produktregel, V1/V2-, Schema- oder Architekturänderung.

Die vorherige A09-Re-Review liegt unter docs/test-reports/a09-t0064-runtime-rereview.md (der im Auftrag genannte Dateiname mit zusätzlichem v3-Segment existiert nicht). Die unabhängige Nachprüfung dieses Folgefixes ist noch nicht erfolgt. A02 führte nach dem Fix node prototype/v3-company-formation-regressions.mjs, node prototype/a02-t0064-legal-regressions.mjs, node prototype/v3/a05-t0064-regressions.mjs, node prototype/v3/a05-t0064-ui-regressions.mjs, node --check prototype/v3-company-formation.js, node --check prototype/v3-company-formation-regressions.mjs und git diff --check aus; alle Prüfungen bestanden. Git meldete nur vorhandene LF/CRLF-Hinweise. Kein Commit/Push.