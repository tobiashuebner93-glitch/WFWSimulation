# A02-Arbeitsbericht – T-0069 Tagesphasen und Kundenauftragsoperationen

**Status:** A02-Implementierung mit fokussierten Regressionen geliefert; Cross-Reviews ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Tickets:** T-0069; T-0066-Schnittstelle  
**Startprofil:** V3 ab 2027-01-04; keine Änderung der V1-/V2-Profile  
**Entscheidungen:** D-0157, D-0159, D-0161–D-0164  
**Vorgänger:** CP-0285 (ENTWURF)  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und bestehende Änderungen

Vor der Änderung wurden `AGENTS.md`, Agentenstruktur und Rechte, Ziele, Ticket Board, Collaboration State, Decision Log, CP-0285, D-0159 und D-0161–D-0164, A11s T-0069-Integrationsanalyse, A02s T-0066-Produktvertrag und Runtime sowie A03s Finanz-Handoff-Matrix/Re-Review und A05s T-0069-Integrationsbereitschaft gelesen. `git status` wurde geprüft: der Arbeitsbaum enthält umfangreiche, bereits vorhandene Änderungen anderer Agenten. Sie wurden erhalten. Branch `main` und HEAD blieben unverändert; kein Commit oder Push.

Die A09-Re-Reviewbelege zu RUN-01 bis RUN-04 in CP-0285 wurden berücksichtigt. Bestehende isolierte Zustände und Finanz-/Architektur-/Schema-Verträge wurden nicht freigegeben oder umgedeutet.

## Umsetzung

### Gemeinsamer Tageslauf

`prototype/v3-run-orchestrator.js` stellt den Tagesablauf nun in getrennten Phasen bereit:

1. `openV3RunDay(state, { date, marketWeekTemplates?, macroMonthInput?, formationEvents? })` verarbeitet Tagesbeginn, fällige Kundenentscheidungen und Anfragen. Es gibt die spielersichere Anfrageprojektion zurück und lässt den Markt in `dayPhase: "actions"` offen.
2. `submitV3RunOffer(state, offer)` nimmt während dieses offenen Tages ein Spielerangebot mit dessen explizitem A03-Kalkulationssnapshot an.
3. `closeV3RunDay(state, { date })` verarbeitet den Tagesablauf und den Ablauf noch offener, abgelaufener Anfragen zuletzt.

Phasen- und Run-Event-IDs sind deterministisch. Ein identisches Öffnen, Angebot oder Schließen ist idempotent; ein abweichender Replay-Payload wird fail-closed abgewiesen. Angebots-Provenienz wird zwischen Run-Historie und Marktquellereignis gegengeprüft. `advanceV3RunDay` bleibt als Kompatibilitätswrapper über dieselben drei Funktionen bestehen.

### Explizite Kundenarbeitsplanung

`prototype/v3-product-lifecycle.js` ergänzt einen separaten Kundenauftrags-Pfad innerhalb der bestehenden T-0066-Ressourcenprüfung. Eigenprodukte werden dabei nicht als Kundenauftrag behandelt. `planV3RunWorkOrder(state, { workOrderId, contractSnapshot, operations })` akzeptiert nur einen belegten, angenommenen Spielerauftrag. Vertragsdaten müssen explizit an dessen `inquiryId`, `offerId` und `decisionId` gebunden sein und Parteien, Vertragsart, Leistungs-/Abnahmekriterien, Bestellmenge und Einheit enthalten. Die Rolle der abnehmenden Partei wird gespeichert, aber rechtlich nicht aus dem Empfänger oder Auftraggeber abgeleitet.

Jeder Arbeitsschritt muss Zeit, Datum, Personal, Equipment (einschließlich explizitem `null`), Qualifikationen, Equipmentfähigkeiten, Materialmengen und Vorgänger ausweisen. Fehlende Inputs werden nicht ergänzt. Der T-0066-Kern prüft Arbeitstage, Skills, Anlagenfähigkeiten, vorhandene Belegungen, Tagesstunden, Materialbestand und Vorgängerreihenfolge. Kundenpläne reservieren dieselben Personal-, Anlagen- und Materialkapazitäten wie Eigenprodukte. Material wird erst beim expliziten Abschluss des Arbeitsschritts physisch verbraucht.

`completeV3RunWorkOrderOperation` verlangt eine Spieleraktion im offenen Simulationstag. Derselbe Arbeitsschritt kann nur einmal physisch verbraucht werden. Erst nach Abschluss aller ausdrücklich geplanten Schritte wechselt der Auftrag zu `ready_for_delivery` und `performance_pending`. Es gibt weiterhin keine automatische Lieferung, Kundenabnahme, Rechnung, Forderung, Erlös-, Cash- oder Finanzbuchung. Das A03-Handoff bleibt `pending_non_posting`.

## Schnittstellenbeispiel für A05

```js
const opened = openV3RunDay(runState, { date: runState.currentDateNext });
runState = opened.state;
const visibleRequests = opened.result.playerInquiries;
const submitted = submitV3RunOffer(runState, explicitPlayerOffer);
runState = submitted.state;
const closed = closeV3RunDay(runState, { date: runState.activeDay.date });
runState = closed.state;
```

Die UI kann die Anfragen zwischen `openV3RunDay` und `submitV3RunOffer` darstellen; die Angebotsaktion muss ein explizites Angebot mitsamt A03-Snapshot übergeben. Kundenarbeitspläne und Arbeitsschrittabschlüsse laufen ebenfalls nur während eines offenen Tages. Die Run-API enthält keine Komfortdefaults für die fehlenden Vertrags- oder Operationsdaten.

## Verifikation

- `node --check` für Produkt-/Run-Module und zugehörige Regressionen: PASS.
- `node prototype/v3-product-lifecycle-regressions.mjs`: PASS. Deckt explizite Pflichtfelder, Skill-/Materialmangel, Personalüberlastung durch Kundenpläne, Blockierung eigener Produktplanung durch dieselbe Reservierung, einmaligen Materialverbrauch und wiederholten Abschluss ab.
- `node prototype/v3-run-orchestrator-regressions.mjs`: PASS. Deckt Anfragen vor Angebotsabgabe, Phasenreihenfolge, offene/geschlossene Replay-Identität, Konflikt-Replay, Angebotsprovenienz, akzeptierten Auftrag → Vertrags-/Arbeitsplan → Vorgängerabschluss, Status `ready_for_delivery/performance_pending` und ausbleibende Finance-/Liefer-/Abnahmeeffekte ab.
- A09-Erstreview meldete zwei NONPASS-Fälle: Vorgänger mit späterem Plantermin sowie manipulierte Restore-Statuswerte `delivered/posted`. Beide sind im Code fail-closed behoben; Regressionen decken die Repros ab und beide fokussierten Tests bleiben PASS. A09-Re-Review ist noch ausstehend.
- Markt-, Makro-, Gründungs-, Finanzkalkulations- und Finance-Runtime-Regressionen: PASS.
- A02-Code-/Test-Whitespace-Prüfung: PASS. `git diff --check`: Exit 0; Git meldet bestehende LF/CRLF-Hinweise in anderen, bereits geänderten Dateien.
- **A03-Fachreview/Cross-Review:** ausstehend.
- **A09 unabhängige QA:** Erstreview mit den zwei oben genannten NONPASS-Fällen durchgeführt; A02-Fixes/Regressionen geliefert, unabhängige Bestätigung der Fixes ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; A05-UI-Integration und A12-Playtest sind getrennte Schritte.
- **Git-Verifikation:** `git status` geprüft, HEAD unverändert, keine Commit-/Push-Aktion.

## Offene Inputs und nächste Übergabe

Kein neues Nutzerprodukt- oder Rechtsentscheid wird benötigt. Vor einer operativen UI-Planung müssen Angebot/Vertrag die Bestellmenge und Einheit, Vertragsart, Kunden-/Käufer-/Abnahmepartei, Leistungs-/Abnahmeklausel sowie die konkrete Operationsliste samt Dauer, Qualifikation, Equipment, Material und Vorgängern liefern. Es gibt keine A02-Regel, die aus Marktanforderungen automatisch Maschinen-Skills oder Zeit-/Materialwerte ableitet. Fehlende Inputs blockieren den jeweiligen Arbeitsplan.

Die implementierten T-0066-physikalischen Mengen-/Kapazitätswirkungen sind nicht mit Kosten- oder Ledgerwerten versehen. A03 soll den konkreten Übergang, `ready_for_delivery/performance_pending`, den rein mengenmäßigen Materialverbrauch, die Vertragsrollen-Daten und das unveränderte `pending_non_posting` Finance-Handoff gegen seine Matrix prüfen. Nach diesem Review soll A09 die Tagesphasen, Replays, wiederhergestellte Zustände und T-0066-Grenzen unabhängig prüfen. A05 erhält die stabilen Signaturen und kann danach seine Angebotsaktion freischalten; A12 prüft anschließend den integrierten Browserlauf.

**Entscheidungen:** keine ergänzt.  
**Schema-/Architekturfreigabe:** keine beantragt oder erteilt.  
**Commit/Push:** keiner.

## Fortschreibung nach CP-0303 – Lieferung und Empfängerentscheidung

Der gemeinsame Run enthält nun die getrennten Adapter `deliverV3RunCustomerWorkOrder(state, input)` und `recordV3RunCustomerAcceptanceDecision(state, input)`. Lieferung setzt einen validierten Work Order und T-0066-Plan im Status `ready_for_delivery` voraus. Die Eingabe verlangt stabile `deliveryId`/`sourceRef`, Work Order, Lieferdatum, Empfängerpartei, Leistungs-/Abnahmekriterien, Menge und Einheit; diese Daten werden gegen den angenommenen Vertragssnapshot und abgeschlossene Operationen gebunden.

Die folgende Entscheidung ist ein eigenes Ereignis. `customer` muss mit `actorPartyId` und `customerRef` exakt auf den aus der Marktanfrage übernommenen Kunden zeigen. `recipient` darf nur handeln, wenn `acceptancePartyId` von der Kundenpartei abweicht und Vertrags-Snapshot sowie Entscheidungsevent `authorizedForRef` auf dieselbe Kundenpartei und `partyAuthorityRef` auf dieselbe explizite Vertragsreferenz binden. Die Spieler-/Verkäuferpartei ist als Akteur ausgeschlossen. Es sind `accept` und `reject` zulässig. Keine F3-Frist, automatische Abnahme oder Rechtsfolge wurde ergänzt. Identischer Replay ist No-op; eine abweichende Nutzlast derselben Event-ID, zweite Lieferung desselben Auftrags oder zweite Entscheidung für dieselbe Lieferung wird abgewiesen. Restore bindet Ereignisse an Marktentscheidung, Work Order, Kundenpartei, T-0066-Vertrag/Plan, Kriterien, Datum, Quelle und Akteurs-/Vertretungsreferenzen.

Beide Ereignisse bleiben getrennte nichtbuchende Run-Handoffs. Sie ändern weder T-0066-Operationen/Bestände noch Work Order-/Finance-Status oder `financeHandoffs`; Erlös, Forderung, Rechnung, Zahlung, Cash, COGS und Ledger bleiben ausstehend beziehungsweise ausschließlich A03 vorbehalten. A03-Fachreview der Eventfelder/Parteibefugnis/Finance-Grenze und A09-unabhängiger Re-Review sind noch nicht ausgeführt.

Gezielte Regressionen: `node prototype/v3-run-orchestrator-regressions.mjs`, `node prototype/v3-product-lifecycle-regressions.mjs` und `node prototype/v3-learning-run-adapter-regressions.mjs` — PASS. Syntax (`node --check` für Run-Modul und Regression) — PASS. Browser-/Gerätetest nicht ausgeführt; A05-UI-Anbindung ist ausdrücklich nach A03/A09-Reviews.

## Fortschreibung nach CP-0304 – Kunden-/Empfängerautorität

Der A03-NONPASS aus CP-0304 wurde im Run-Handoff behoben. Ein Work Order übernimmt nun `customerPartyId` aus der validierten Marktanfrage; die Marktvalidierung bindet diese ID an das gespeicherte Wochen-Template. Der Restore-Validator leitet den erwarteten Kunden aus der Anfrage ab und weist manipulierte Work Orders zurück. Der T-0066-Vertrag muss dieselbe Kunden-ID führen. Verkäufer-/Spieler-ID als Vertragskunde oder als entscheidender Akteur wird abgewiesen.

Für die normale Kundenentscheidung müssen `actorRole: customer`, `actorPartyId` und `customerRef` der gebundenen Kunden-ID entsprechen; Vertretungsfelder sind dabei null. Ein abweichender `acceptancePartyId` wird nur mit `authorizedForRef === customerPartyId` und einer nichtleeren `partyAuthorityRef` im Vertragssnapshot zugelassen. Das separate Empfängerereignis muss dieselben Referenzen sowie `actorRole: recipient` und `actorPartyId === acceptancePartyId` wiederholen. Der Restore-Validator prüft diese Bindungen und den Event-Fingerprint. Das ist eine strukturelle, replay- und restorefähige Vertragsdatenprüfung im lokalen Run; sie authentifiziert keine externe Unterschrift und ist kein kryptografischer Schutz gegen koordinierte Änderung sämtlicher Browser-State-Kopien.

Abnahmeregressionen umfassen Selbstbenennung des Verkäufers, abweichende Kunden-ID, fehlende Empfängerreferenz, gültige Kunden- und Empfängerentscheidung, Ablehnung, Replay und Restore. Ausgeführt: Run-Orchestrator, Produktlebenszyklus, Markt und Finance-Runtime — alle PASS. Finance-Handoffs bleiben unverändert `pending_non_posting`; weder Ledger noch Rechnung, Forderung, Zahlung, Cash, COGS oder Warenbestand werden durch Lieferung/Entscheidung verändert.

**Reviews:** Fix zur erneuten Prüfung an A03 und A09 übergeben; deren Re-Review ist noch nicht erfolgt. Browser-/Gerätetest nicht ausgeführt. Kein Commit/Push.
