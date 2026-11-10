# A03 – D-0169 Finance-Nichtbuchungsreview des Makro-Nachfragepfads

**Status:** NONPASS für die behauptete isolierte Nachfrageänderung; Finanz-Nichtbuchung im geprüften Pfad PASS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0069
**V3-Profil:** gemeinsamer Lauf ab 04.01.2027; keine V1/V2-Änderung
**Entscheidungen:** D-0161–D-0169, insbesondere D-0169
**Vorgänger:** CP-0338–CP-0344; speziell A02 CP-0343, A03 Evidenzvertrag CP-0341/CP-0344, A09 Dokumentreview CP-0342
**Stand:** 2026-10-31

## Ergebnis

Der gezielte A03-Prüfpunkt **keine direkte Finanzmutation durch Makro-/Policy-/Nachfrageereignisse** besteht im geprüften gemeinsamen V3-Pfad: Nachfragekanal und Marktscheduling besitzen keinen Finance-Import, D-0169-Makrosnapshots führen `financeEffects` überall auf `false`, das A02-Regressionsprogramm vergleicht den FinanceState vor/nach dem Makro-/Nachfragelauf identisch, und JSON-Save/Restore erhält den Finanzzustand. Einzelpreise je Auftragsgröße, Angebotspreis-/Vertragssnapshot, Kosten, Bestand, Steuer, Forderungen/Verbindlichkeiten und Cash werden durch die Nachfrageberechnung nicht aktualisiert.

Das Gesamturteil ist **NONPASS** für die stärkere A02-Behauptung, der Kanal ändere ausschließlich die Anzahl bei unverändertem realisiertem Größenmix und binde den gespeicherten Nachfrage-Trace vollständig an den Makro-Ursprung. Zwei eng begrenzte Reviewbefunde stehen unter „Befunde“. Es wurde keine Codeänderung vorgenommen.

## Scope und Quellen

Erneuter A03-Preflight: `AGENTS.md`, Agentenstruktur/Rechte, Goals, Ticket Board, Collaboration State, D-0161–D-0169, CP-0338 bis CP-0344, CP-0343/A02-Bericht, A03-Finance-Evidenzvertrag und Nachtrag gelesen. Geprüft wurden die konkrete D-0169-Laufzeit in `prototype/v3-macro-demand-channel.js`, der Wochenplan-/Save-/Restore-Pfad `prototype/v3/run.js`, `prototype/v3-market-simulation.js`, `prototype/v3-run-orchestrator.js`, `prototype/v3-macro-simulation.js`, sowie die gezielte Regression `prototype/v3-macro-demand-channel-regressions.mjs`. Geänderte Dateien laut A02 CP-0343: Nachfragekanalmodul/-Regression, Run-UI, Orchestrator, Marktengine und Makro-Fixture-Regression.

## Befunde

### 1. Finanz-Nichtbuchung: PASS im geprüften Ablauf

- `v3-macro-demand-channel.js` ist eine reine Berechnung ohne Finance-/Ledger-Abhängigkeit. Der Orchestrator nimmt bei Tagesöffnung Makro-Monatssnapshot und Wochentemplates als Simulationsinput auf; die Market Engine schreibt Nachfragevorlagen/-events in den Market State.
- Die Vorlagen verwenden einen festen Größen-/Preisparameter je Größenklasse. Der Nachfragekanal setzt keine Einzelpreise, Kosten, Ressourcenkapazität oder Vertragsfelder neu. Ein bereits angenommener Auftrag/Vertragssnapshot wird vom Nachfragepfad nicht adressiert.
- `v3-macro-simulation.js` setzt für Makrosnapshots `ledger`, `cash`, `receivables`, `payables`, `inventory`, `payroll` und `existingContracts` auf `false`.
- Die Regression `node prototype/v3-macro-demand-channel-regressions.mjs` bestand: neutraler Gap/Exposure 0 erhält fünf Basisanfragen; Same-Seed-Richtungspaare und JSON-Restore werden geprüft; der FinanceState bleibt über den Testlauf bitgleich; jede Makro-Finanzwirkung ist als `false` markiert; einzelne manipulierte Faktorwerte werden vor Save fail-closed abgewiesen.
- Diese Nullwirkung gilt für das Makro-/Nachfrageereignis und dessen Planung. Nachgelagerte, separat belegte Verträge/Leistungen/Zahlungen können gemäß vorhandenen Regeln eigene Finanzwirkung haben; das ist keine direkte D-0169-Buchung.

### 2. Realisierter Auftragsgrößenmix verändert sich mit der Anfragezahl: NONPASS-Befund

`buildWeeklyTemplates` nutzt die unveränderte zyklische Größenfolge `small, medium, large, small, medium` und erstellt so viele Vorlagen wie `realizedInquiryCount`. Die Makroformel schreibt zwar keine Größenparameter um; durch Kürzen/Verlängern der Folge ändert sich aber die wöchentliche Anzahl je Größenklasse und deren realisierter Anteil. Zum Beispiel ist der Klassenvektor bei 4 Anfragen `2/1/1`, bei 5 `2/2/1` und bei 6 `3/2/1` (small/medium/large). Die pro Klasse hinterlegten Referenzpreise bleiben gleich, doch der Aggregatmix und dadurch die aggregierte Referenzpreissumme verändern sich gemeinsam mit dem Makrokanal.

Das widerspricht der pauschalen A02-Berichtsaussage „Größenmix … wird dadurch nicht angepasst“, wenn damit ein unveränderter realisierter Wochenmix gemeint ist. Eine Entscheidung, ob exakt konstante Klassenanteile erforderlich sind, liegt nicht bei A03. **Minimale Übergabe an A01/A02:** A02 präzisiert entweder den Bericht als „Größen- und Preisparameter je Anfrage bleiben fest; realisierte Stückzahlen/Anteile der Klassen können sich durch die geänderte Gesamtzahl ändern“ oder entwickelt, falls unveränderter Klassenmix ein Abnahmekriterium ist, eine gesonderte reproduzierbare Zuordnung, die den Klasseneffekt kontrolliert. Keine Änderung von mir.

### 3. Makro-Quellenbindung im Restore: als begrenzte Provenienzprüfung offen

Die Market-State-Validierung ruft `validateV3MacroDemandTrace` mit Run-ID/Seed/Szenario/Woche auf. Der Nachfragevalidator berechnet den Trace deterministisch aus den im Trace gespeicherten Werten `activityGapPct`, `activitySourceType`, `activitySourceRef` und `exposure`. Im geprüften Validatorpfad ist keine Gegenprüfung dieser Werte gegen den dazugehörigen, bereits validierten Makro-Monatssnapshot sichtbar. Die Regression manipuliert den Faktor allein und belegt dessen Ablehnung; sie testet keine zusammenpassende Veränderung von Quelle/GAP/Trace/Planvorlagen. Die Ausgabe `calculateV3MacroDemand` enthält außerdem keine explizite Run-/Szenario-ID; die deterministische Ziehung nutzt Seed und Woche, um Szenariopaare zu matchen.

Daher ist der Nachweis **interne Determinismus-/Konsistenzprüfung PASS**, aber nicht „Ursprungsprovenienz gegen Makroereignis kryptografisch authentisiert“. Lokale Zustandsvalidierung bietet keinen Schutz, wenn sämtliche Clientkopien koordiniert verändert werden; das muss weiterhin als technische Grenze gelten. Falls die A02-Behauptung „Trace provenance fail-closed“ eine Bindung an den tatsächlichen Makrosnapshot einschließt, ist **minimale Übergabe an A02**: im gemeinsamen Run die Trace-Aktivitätslücke sowie Quelle/Typ an den zuständigen Monats-Snapshot binden (oder beim neutralen Fallback eindeutig verankern) und einen gezielten gepaarten Restore-Mutationsfall hinzufügen. Keine Produkt-/Finance-Regeländerung durch A03.

## Reconciliation mit A03-Evidenzvertrag

Der Evidenzvertrag verlangt, Makroperiode und operative Kostenperiode getrennt zu halten, Makro-/Markttrace nicht als Finanz-Event-ID zu verwenden und ohne separates autorisiertes Ereignis 0,00 € Finanzwirkung zu zeigen. Das bleibt erfüllt. Keine Istkosten, BAB-, Vorrats-, WIP-, Fertigwaren- oder COGS-Evidenz entsteht durch zusätzliche Anfragen. D-0165–D-0168 werden vom Nachfragepfad nicht verwendet oder erweitert.

## Verifikation und Grenzen

- **Gezielte Regression:** `node prototype/v3-macro-demand-channel-regressions.mjs` — PASS (52-Wochen-Szenariozahlen laut Harness: BOOM 274, neutral 260, LOW 256; integrierte Januar-/Restore-/Financechecks PASS).
- **Ausführung:** Read-only Code-/Vertragsreview; keine Runtime-/Financeänderung.
- **Fachreview:** A03, auf Finanz-Nichtbuchung und Finanzgrenze beschränkt; keine Produktentscheidung über den realisierten Größenmix.
- **Unabhängige QA:** nicht durch A03 erneut ausgeführt. A09 unabhängiger Code-/State-Review wurde von A01 separat angefordert.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** `git rev-parse --show-toplevel` erkannte den Repositorypfad; `git status --short` und `git diff --stat` endeten mit `fatal: this operation must be run in a work tree`. Daher konnte A03 lokalen Gesamtstatus und tatsächlichen Diff nicht unabhängig verifizieren. A02-CP-0343 listet die Paketdateien und dokumentiert umfangreiche bestehende lokale Änderungen; A01 soll eigenen Checkout für den Gesamtstatus nutzen.
- **Commit/Push:** keiner.

## Übergabe

**Adressat:** A01 – MASTER_ORCHESTRATOR. Das A03-Nichtbuchungssubgate ist PASS für den geprüften Szenariopfad; Gesamturteil für die weitergehende D-0169-Invariante bleibt NONPASS wegen der Größenmix-Klarstellung und offenen Trace-zu-Makro-Snapshot-Bindung. A01 koordiniert die eng begrenzten A02/A09-Folgeschritte. Keine Buchungs- oder Releasefreigabe.
