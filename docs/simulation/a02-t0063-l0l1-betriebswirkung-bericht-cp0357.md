# A02-Bericht: L0/L1 nichtbuchende Betriebswirkung im V3 Shared Run

**Status:** Implementierung/gezielte Regressionen abgeschlossen; A03-Fachreview und A09-Adversarialreview ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063, T-0065, T-0069
**Entscheidungsbasis:** D-0169; keine neue Produkt- oder Finanzentscheidung
**Profil:** V3 Shared Run, Start 04.01.2027; V1/V2 unverändert
**Vorgänger:** CP-0352, CP-0354, CP-0355, CP-0356

## Preflight und Arbeitsgrenze

Im freigegebenen Paket `a02-code-input-t0063-l0l1` wurden AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket-Board, Collaboration State, Decision Log, CP-0351–0356, A02-Wirkungsvertrag und A03-Re-Review CP-0356 gelesen. CP-0357 war vor Erstellung nicht vorhanden. Das Paket enthält keinen Git-Working-Tree; Original-Repositorystatus und Diff sind nicht verfügbar. Geändert wurde ausschließlich in diesem Stagingpaket.

Der Auftrag erlaubte nur die A03-vorgeprüften, nichtbuchenden Lose L0/L1: Baseline/Replay und die Kette Anfrage → tatsächlich gewonnener Auftrag → geplante Stunden → erklärte verfügbare Personalkapazität → Auslastung. Es gab keine UI-, Schema-, Finanz-, Ledger-, Kosten-, Vertrags-, Angebots- oder L2–L6-Änderung.

## Umsetzung

- `prototype/v3/run.js` exportiert `getV3RunOperatingImpact`. Die Projektion wird aus den gespeicherten D-0169-Wochenereignissen, den realen Marktentscheidungen, angenommenen Spieleraufträgen und Produktarbeitsplänen berechnet. Sie ist dadurch nach Save/Restore deterministisch rekonstruierbar und erzeugt keine zweite mutable Ereignisquelle.
- Jeder Wochenwert ist nach Run/Woche eindeutig (`impactId`) und führt Run-/Szenario-/Seed-Identität, Monat/Periode, Modell-/Parameter-ID, D-0169-Trace, Quelle/Annahme, Exposure, `before`/`after`, sowie `directFinanceEffect: false` und `accountingClass: information_plan` mit.
- Die Anzeige-/Abfrageprojektion unterscheidet Anfragen der Wochenkohorte, gewonnene Aufträge nach echter Kundenentscheidung, aktuell geplante Stunden dieser Kalenderwoche, offene Entscheidungen und noch ungeplante Gewinne. Es werden weder Angebote als Aufträge noch bloße Anfragen als gewonnene Arbeit gezählt.
- Verfügbare Kapazität ist im begrenzten Los explizit als Summe deklarierter Personalstunden je Arbeitstag × fünf Werktage ausgewiesen. Geplante Belegungen/Operationen bestimmen die Auslastung. Abwesenheiten und Maschinenengpässe sind nicht in dieser L0/L1-Kennzahl enthalten; Maschinen- und Personalkapazitätsvalidierung im bestehenden Planungspfad bleibt bestehen.
- Das Run-Ergebnis erhält die Projektion als API-Feld `operatingImpact`; HTML, CSS und UI-Verhalten wurden nicht geändert.
- Die vier Run-Makro-Testpfade verwenden jetzt die vertraglich benannten synthetischen Aktivitätslücken: Aufschwung +1 pp, Hochkonjunktur +3 pp, Abschwung −1 pp und Tiefphase −3 pp. Nur D-0169 wirkt auf die Gesamtzahl der Anfragen; keine Phase verändert Kapazität, Personal, Überstunden, Preise, Vertrag, Finanzzustand, Cash oder Kosten.
- Der eigenständige Jahres-Smoke-Fixture wurde an den bereits verpflichtenden Shared-Run-D-0169-Trace gebunden. Vorher schlug er fehl, weil seine Wochenvorlage ohne D-0169-Nachweis in einen Shared Run eingespeist wurde; die Testfixture erzeugt nun dieselbe quellgebundene Wochenanfrage wie der autorisierte Makro-Snapshot.

## Regressionen und Ergebnisse

Bestanden (Node v24.22.1):

- `node v3-run-operating-impact-regressions.mjs` – vier synthetische Richtungen, neutraler Exposure-0-Kontrollfall, keine Annahme vs. echte Spielerannahme, geplanter Arbeitsumfang und Auslastung, voller Wochenkapazitätsengpass, Save/Restore und FinanceState-Nichtmutation.
- `node v3-macro-demand-channel-regressions.mjs` – 52-Wochen-Richtungs-/Seed-Replay-, Trace-/Restore- und Nichtbuchungstests.
- `node v3-run-macro-fixture-regressions.mjs`.
- `node v3-run-orchestrator-regressions.mjs`.
- `node v3-market-simulation-regressions.mjs`.
- `node v3-macro-simulation-regressions.mjs`.
- `node v3-finance-runtime-regressions.mjs`.
- `node v3-price-index-regressions.mjs`.
- `node --check` für `v3/run.js`, `v3-run-macro-fixture.js`, `v3-year-smoke.mjs` und die neue L0/L1-Regression.
- Whitespaceprüfung auf allen vier geänderten Code-/Testdateien: keine abschließenden Tabs/Leerzeichen.

Ein UPSWING-Jahres-Smoke lief erfolgreich: 04.01.–31.12.2027, 362 Tage, 12 Monate, 1.409 Run-Events; SHA-256 des Smoke-Runzustands `9c597ce95027eb55641fdb23968a5ab882aa0f0833ef3be70cc555f78b132920`. PASS für Tages-/Monatsreplay und Nichtbuchungsgrenze. Der vollständige Vierpfad-Smoke einschließlich Wiederholung wurde wegen Laufzeit nach Start des ersten Pfads abgebrochen; für diesen Mehrpfadversuch liegt kein vollständiger Exit-/Hashnachweis vor. Der einzelne UPSWING-Jahreslauf und die gezielten Vierpfad-/52-Wochen-Regressions sind abgeschlossen.

`v3-product-lifecycle-regressions.mjs` wurde versucht, konnte im Stagingpaket wegen einer fehlenden Importabhängigkeit nicht laufen: `docs/learning/t-0068-v3-prozesslernobjekt.json` wird von `prototype/v3/market.js` referenziert, ist im bereitgestellten Paket aber nicht enthalten. Dieser Fehler ist kein Testergebnis über die Produktlebenszykluslogik.

## Grenzen, Nachweise und Übergabe

- **A03-Fachreview:** CP-0354 hatte L0/L1 PASS mit Bedingungen; CP-0356 PASS bezog sich ausschließlich auf dokumentarische L2/L4/L5-Kriterien. A03-Re-Review des nun implementierten L0/L1-Codes ist ausstehend.
- **Unabhängige QA:** A09-Adversarialreview ausstehend.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-Änderung.
- **Git-Verifikation:** nicht verfügbar im Stagingpaket; kein Commit/Push.
- **Finanz-/Istkostenwirkung:** direkt 0; Planstunden sind keine Istkosten. Kein FinanzState wird von der Projektion angenommen oder verändert.
- **Nächster Schritt:** A01 lässt A03 die Finanz-Nichtbuchungsgrenze und A09 Identitätsbindung, Replay, Deduplizierung, Kapazitätsprojektion und Mutationsfälle unabhängig re-reviewen. Keine Integration/Releasefreigabe aus diesem A02-Nachweis ableiten.

## Geänderte Dateien

1. `prototype/v3/run.js`
2. `prototype/v3-run-macro-fixture.js`
3. `prototype/v3-year-smoke.mjs`
4. `prototype/v3-run-operating-impact-regressions.mjs` (neu)
5. `docs/simulation/a02-t0063-l0l1-betriebswirkung-bericht-cp0357.md` (neu)
6. `docs/agent-system/checkpoints/CP-0357.md` (neu)
