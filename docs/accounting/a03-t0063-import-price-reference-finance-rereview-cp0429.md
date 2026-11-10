# A03-Fachreview – Destatis-Einfuhrpreisreferenz Runtime (CP-0429)

**Status:** PASS im begrenzten Quellenreferenz-, Perioden- und Finance-Nichtmutationsscope
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063; Anschluss T-0067/T-0069
**Profil:** V3 Shared Run ab 2027-01-04; optionales Benchmark-Referenz-Fixture
**Entscheidungen:** D-0161–D-0169, insbesondere D-0162 (keine automatische Finanzwirkung, R-/Snapshotgrenze)
**Vorgänger:** CP-0428 A02 Runtime; CP-0427 A08 Quellenbefund; CP-0426 A03 Scope-Grenze
**Arbeitsbasis:** `main@8b72b7e`; gemeinsame lokale Änderungen erhalten; kein Commit/Push.

## Prüfgegenstand und Ergebnis

A03 hat den aktuellen Referenzdatensatz, seine Übergabe im Makro-Monatsinput, die `references[]`-Projektion, Run-/Day-Open-/Macro-Snapshot-/Restorebindung und die fokussierten Tests im Code geprüft. Ergebnis: **PASS** innerhalb der eng begrenzten A08/A02-Referenzfunktion. Es wurde kein Produktcode geändert.

- Die Werte für September 2026 sind als beobachtete GENESIS-Reihe 61411-0010 mit Basis 2021=100 und getrennten Gruppen Euro-Länder 125,7, Nicht-Euro-Länder 120,1, Insgesamt 122,2 fest gebunden.
- `sourceReleaseDate=2026-10-30` wird explizit als Datum der zugehörigen Destatis-Pressemitteilung gekennzeichnet. Der Code behauptet keinen Publikationszeitstempel für einzelne GENESIS-Zellen (`genesisCellTimestampAvailable=false`). `retrievedAt`, Daten-Vintage, Quellen-Snapshot und nicht berichteter Revisionsstatus bleiben unterscheidbar.
- Ein Monatsinput vor dem assoziierten Release-Fenster erhält keine Referenz; ab dem Veröffentlichungsdatum ist die Quelle als reine Referenz sichtbar. Die September-Beobachtung, Release-Datum und Abrufdatum werden nicht miteinander verwechselt. In späteren Snapshots bleibt derselbe festgelegte Daten-Vintage replaystabil; spätere Runmonate aktualisieren frühere Snapshotinputs nicht.
- Der Benchmark erscheint separat in `references[]`, nicht in `effects[]`. Gruppenwahl ist nur Anzeige-/Filterwahl. Es gibt kein `importExposureFactor`, `delta`, `after`, Pass-through oder Ableitung einer Firmengruppe aus Währung, Lieferant oder Planposition.
- Im geprüften Code existiert keine Verbindung zur L4-Offer-Sensitivität, `procurementPlanIndex`, BICI, FX-Wirkung, `R`, Kosten-/BAB-Kalkulation, Lieferantenquote, Vertrag, Bestellung, Bestand, Rechnung oder Finanzfunktion. Damit wird die zuvor von A03 ausgeschlossene 1:1-Übertragung nicht still eingeführt; auch keine FX-/BICI-/Procurement-Doppelwirkung.
- Die Referenzprojektion ist rein lesend. Die Regression vergleicht Run und FinanceState vor/nach Projektion byte-/strukturtreu, prüft Save/Restore-Wiedergabe und weist Quellen-, Vintage-, Auswahl-, Fingerprint- und Duplikatmanipulation fail-closed zurück.

## Reproduzierte Prüfungen

Alle folgenden Tests liefen im aktuellen Checkout mit Exit 0:

- `node prototype/v3-destatis-import-price-reference-regressions.mjs`
- `node prototype/v3-macro-trade-impact-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node prototype/v3-run-macro-fixture-regressions.mjs`
- `node prototype/v3-offer-plan-sensitivity-regressions.mjs`
- `node prototype/v3-macro-simulation-regressions.mjs`
- `node prototype/v3/a05-t0063-financing-entry-cache-regressions.mjs` – 21 statische Module, Graphcache-Regression PASS

## Grenzen und Übergabe

Die Datenreferenz ist ein **fest codierter beobachteter September-2026-Snapshot**, kein dynamischer GENESIS-Feed. `revisionStatus=not_reported_by_snapshot` bleibt genau so gekennzeichnet. Eine spätere Aktualisierung des externen Snapshots braucht eine neue identifizierte Quelle/Vintage und darf keine früheren Snapshots verändern. A05-Anzeige, Browser-/Mobilprüfung, A09 adversariales Review, Jahreslauf und V3-Releasegate stehen noch aus. Der Benchmark bleibt rein informativ; eine spätere Wirkung in L4-Kosten benötigt eine separate, reviewed Regel und ist von diesem PASS nicht umfasst.

Keine A03-Rückfrage erforderlich. Kein Widerspruch zu D-0162 im geprüften Scope. Kein Abschluss von T-0063/T-0067/T-0069 und keine Releasefreigabe.

**Nächster Adressat:** A09 für unabhängige Prüfung von As-of-/Vintage-/Run-/Restore-Manipulation und Nichtmutation; danach A05 für eine klar als historische Referenz beschriftete Anzeige. Bericht: [A03-Reviewbericht](../../accounting/a03-t0063-import-price-reference-finance-rereview-cp0429.md).
