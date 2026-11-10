# A02-Bericht – T-0069 G5 monatlicher Auftrags- und Produktfluss

**Status:** PASS für den implementierten G5-Verhaltensslice; formale Abnahme und Commitbindung bleiben A01 vorbehalten.
**Prüfrevision:** `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`
**Arbeitsbaum:** Bereits vorbestehend stark geändert/untracked. Keine Fremdänderungen entfernt. Dieser Bericht und die additive Smoke-Fixture wurden neu angelegt; keine produktiven Engine- oder UI-Dateien geändert.

## Ergebnis

Eine additive Dreimonats-Fixture führt Januar bis März 2027 durch dieselbe Shared-Run-Quelle. In jedem Monat entstehen Kundenanfragen, der Spieler gibt ein Angebot ab, die Kundenentscheidung erzeugt einen Arbeitsauftrag, die Arbeit wird geplant und abgeschlossen, die Ware wird geliefert und der Auftraggeber zeichnet die Abnahme auf. Daneben wird ein Eigenprodukt mit Material und gemeinsamer Personal-/Maschinenkapazität gefertigt, als Fertigbestand geführt, angeboten und vom Käufer angenommen oder abgelehnt. Zwei angenommene Produktverkäufe werden versandt; ein abgelehnter Verkauf bleibt physisch auf Lager. Ein weiteres Spielerangebot wird ausgelassen und die Anfrage geht an einen Wettbewerber. Nicht beantwortete, nicht geeignete Anfragen laufen ab.

Datenfluss, Ereignisse und Material-/Fertigwarenbewegungen bleiben in `run.modules.market`, `run.modules.product` und `run.dayEvents` desselben Runs. Der Überlastungsfall konkurriert absichtlich um denselben Beschäftigten und dieselbe Maschine; die ungültige Planung wird ohne Teilmutation zurückgewiesen. JSON-Restore, Event-Replay und Tamper-Validierung werden geprüft.

Kundenumsatz und Produktumsatz bleiben `pending_non_posting`. Es gibt keine Buchung, kein Cash-/Ledger-Feld, keine BAB-Rechnung und keine erfundene Monetarisierung. Produkt-COGS bleibt `pending_deferred_bab`.

## Gates

| Gate | Ergebnis | Nachweis |
|---|---|---|
| G5 monatlicher Kundenfluss: Anfrage → Angebot/Entscheidung → Arbeitsauftrag → Fertigung → Lieferung/Abnahme | PASS | Drei angenommene, fertiggestellte und kundenseitig abgenommene Aufträge |
| G5 Eigenprodukt: Fertigung → Fertigbestand → Angebot → Käuferentscheidung/Versand | PASS | Drei Käuferentscheidungen; zwei Versände, eine Ablehnung mit verbleibendem Bestand |
| Angebotsverlust/Ablauf | PASS | Spielerangebot ausgelassen und Wettbewerber gewinnt; nicht beantwortete Anfragefenster laufen ab |
| Gemeinsame Personal-/Maschinenressourcen | PASS | Überlastung wird abgewiesen; unveränderter Zustand danach, erfolgreiche Planung am Folgetag |
| Mehrmonatsfortschritt und Periodenkohärenz | PASS | 2027-01-04 bis 2027-03-31 in einem Run |
| Replay, Restore, Integrität | PASS | Idempotenz, JSON-Roundtrip, Zustands-Hash und Tamper-Rejection |
| Posting/BAB-Abgrenzung | PASS | Finanzhändoffs bleiben pending; kein Ledger/Cash, keine BAB-/COGS-Buchung |
| 12-Monats-Jahresstabilität | OFFEN (Timeout) | `v3-year-smoke.mjs` und `v3-year-order-smoke.mjs` liefen je bis zum A09-Limit von 360 Sekunden; kein Exitcode, PASS oder Hash vor Ende. Beide wurden am Limit kontrolliert beendet. |
| Browser-/UI-Abnahme | OFFEN | Keine UI-Datei geändert oder Browserabnahme behauptet |
| Formale Commitbindung | OFFEN | Keine Commit- oder Push-Aktion; A01 entscheidet über Gate/Commit |

## Regressionen

Alle Befehle wurden lokal mit Node v24.22.1 auf obiger Revision und aktuellem, bereits verändertem Arbeitsbaum ausgeführt:

- `node prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` — PASS; drei Monate, drei Kundenaufträge, drei Eigenproduktentscheidungen, zwei Produktversände, Ressourcenblockade, Restore/Replay/Tampering.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node prototype/v3-market-simulation-regressions.mjs` — PASS.
- `node prototype/v3-product-lifecycle-regressions.mjs` — PASS.
- `git diff --no-index --check -- NUL prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` und Report — PASS (nur LF/CRLF-Hinweis).
- `node prototype/v3-year-smoke.mjs` und `node prototype/v3-year-order-smoke.mjs` — je 360-Sekunden-Timeout; keine Ausgabe über den Startstatus hinaus, daher OFFEN, nicht PASS. Ein versehentliches Duplikat von `v3-year-smoke.mjs` wurde beendet.

Fixture-Endzustand SHA-256: `fc08e8030bdf7ec47545efea03d9f9685712538c3d090b209772b4c067a542e7`.

## Geänderte Dateien und Grenzen

- `prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` — additive deterministische Smoke-Fixture.
- `docs/simulation/a02-t0069-monthly-order-product-flow-report.md` — dieser Bericht.

Keine Änderungen an `prototype/v3-run.js`, HTML/CSS, Laufzeitmodulen, Schema, Architekturfreigaben, Tickets, CPs oder Nutzerentscheidungen. Keine Commit-/Push-Aktion.

## Übergabe

A01: Fixture und Report reviewen, anschließend formell entscheiden, ob dies T-0069 G5 erfüllt oder ob zusätzlich ein 12-Monatslauf bzw. weiterer Umfang erforderlich ist. Bei bestätigtem G5 kann A01 die Status-/Ticket- und Commitbindung vornehmen. Finanzbuchungen/BAB bleiben gesonderte spätere Arbeit.
