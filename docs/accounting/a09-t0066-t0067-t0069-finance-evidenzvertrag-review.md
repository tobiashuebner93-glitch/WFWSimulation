# A09 – Unabhängiger Dokumentenreview des Finance-Evidenzvertrags

**Status:** PASS (Dokumentreview; ein nichtblockierender Klarstellungshinweis)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0066, T-0067, T-0069
**V3-Profil:** gemeinsamer Run ab 04.01.2027
**Vorgänger:** CP-0339, CP-0340, CP-0341
**Reviewobjekt:** `docs/accounting/a03-t0066-t0067-t0069-finance-evidenzvertrag.md`
**Prüfgrenze:** unabhängiger Dokumentenreview; keine Runtime-/Codefreigabe

## Ergebnis

**PASS** für den dokumentarischen, nichtbuchenden Zweck. Der Vertrag ist konsistent mit den geprüften Entscheidungen und A02/A03-Fachgrenzen. Er erteilt weder Ledger-/Posting- noch Bewertungsfreigaben und enthält kein Schema- oder Architekturmandat.

## Befunde

1. **Plan/Ist und D-0162:** `plan`, `accepted_plan`, `actual_evidence` und `period_reconciliation` werden getrennt. Der angenommene Kosten-/BAB-Snapshot bleibt unverändert. DB-I-Klassifikation, BAB-Verteilung statt Kostenerzeugung, centgenaue Verteilung und Kostenstellen-ID-Tie-break entsprechen D-0162. Fehlender Kostensatz wird nicht aus einem Angebot imputiert.
2. **Perioden und Status:** Kalendermonat als operative Periode und separate Stichtagsbestände sind konsistent. Die `pending_*`, `rejected_*`, `duplicate_noop` und `ready_non_posting`-Werte unterscheiden fehlende, widersprüchliche und wiederholte Evidenz nachvollziehbar. Kein Status mutiert einen Saldo.
3. **Eröffnungsvorrat:** 12.800 € bleiben ein Gesamtposten. Der Stahlwert und die Gruppenaufteilung werden ausdrücklich nicht als Restgröße abgeleitet. Das vermeidet eine unbelegte Bewertung.
4. **D-0165–D-0168:** 19-%-SimTAX/14 Tage und der vereinfachte Rechnungs-/Zahlungsweg bleiben auf den abgegrenzten V3-Fall beschränkt. Der Vertrag leitet daraus weder Herstellkosten noch Bestands-/COGS-Bewertung ab.
5. **D-0169:** Der Vertrag setzt die Nichtbuchungsgrenze korrekt. Er behauptet ausdrücklich kein Review der noch ausstehenden A02-Implementierung und keine Finanzwirkung des Nachfragekanals. Code-/Finance-Re-Review bleibt ein späteres Gate.
6. **Akzeptanzfälle:** Die zehn Fälle decken Snapshot-Unveränderlichkeit, BAB-Abstimmung, fehlende Inputs, Planabweichungen, Mengenreconciliation, 12.800-€-Schutz, WIP/Fertigware, COGS-Grenze, Idempotenz/Korrektur und Makro-Nichtbuchung ab. Sie sind prüfbar als spätere A02/A09-Tests, ohne Buchungen vorwegzunehmen.

## Nichtblockierender Klarstellungshinweis

In Abschnitt 3 bedeutet „Positionen bleiben aus der Rechnung heraus“ im Kontext erkennbar die nichtbuchende Berechnung/Reconciliation, kann aber mit der Kundenrechnung nach D-0166 verwechselt werden. Bei einer späteren redaktionellen Überarbeitung sollte A03 „aus der BAB-/Plan-Ist-Berechnung heraus“ schreiben. Außerdem sollte der Kalendermonat standardmäßig aus dem belegten Ereignisdatum abgeleitet und eine separat gelieferte Periode dagegen validiert werden. Diese Hinweise ändern das PASS im gegenwärtigen Dokumentenreview nicht, weil der Vertrag an mehreren Stellen die Rechnungs-, Perioden- und Nichtbuchungsgrenzen ausdrücklich trennt.

## Nachweisstatus

- **Ausführung:** Read-only Review von A03-Evidenzvertrag, D-0162/D-0165–D-0169, A03-Handoff-Matrix, A02-T-0066-Vertrag und CP-0338–CP-0341.
- **Fachreview:** A09 prüft Prüfbarkeit und Konsistenz, ersetzt nicht A03s Accounting-Fachautorität.
- **Unabhängige QA:** PASS nur für den Dokumentenreview; keine Tests ausgeführt.
- **Browser-/Gerätetest:** nicht ausgeführt; nicht Teil des Auftrags.
- **Git-Verifikation:** lokaler Checkout `C:/Users/Tobia/Documents/GitHub/WFWSimulation`; Branch `main...origin/main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche vorhandene lokale Änderungen bleiben erhalten. CP-0342 und dieser Bericht waren zum Preflight-Zeitpunkt neu. Kein Commit/Push.

**Übergabe:** A01 kann den Vertrag für die nachfolgende Dokumentations-/Testvorbereitung übernehmen. Ein späteres A03-/A09-Review des ausführbaren D-0169-Codepfads bleibt erforderlich.
