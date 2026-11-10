# A09-Finanzruntimeprüfung – T-0069

**Status:** NONPASS – zwei reproduzierbare Vertrags-/Evidenzlücken  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Profil:** V3 ab 2027-01-04  
**Entscheidungen:** D-0157, D-0159, D-0161, D-0162  
**Vorgänger:** CP-0280/CP-0281 (ENTWURF)  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`

## Preflight und Prüfgrenze

AGENTS.md, Agentenstruktur/-Rechte, MG-002-Ziele, Ticket Board, Collaboration State, Decision Log, CP-0281, A03s T-0069-Finance-Bericht/-Matrix, A02s T-0069-Choreografie und A08s Rechtsquellenbericht wurden gelesen. Der Arbeitsbaum enthält umfangreiche parallele lokale Änderungen einschließlich A02s inzwischen angelegter Runtime; nichts wurde verworfen oder geändert.

Geprüft wurde ausschließlich `prototype/v3-finance-runtime.js` gegen den logischen T-0069-Handoff. Dies ist keine Buchführungs-/Steuer-/Rechtsfreigabe und keine Jahres-, Browser- oder Gesamtproduktabnahme.

## Ausführung und Ergebnis

- `node prototype/v3-finance-runtime-regressions.mjs` – PASS.
- `node --check prototype/v3-finance-runtime.js` – PASS.
- `node --check prototype/v3-run-orchestrator.js` und `node prototype/v3-run-orchestrator-regressions.mjs` – PASS (aktueller A02-Stand; separater Lauf, keine gemeinsame Finance-Integration hier bestätigt).
- `git diff --check` für die betroffenen A02/A03-Dateien – PASS.
- Zusätzliche adversariale Node-Proben gegen die reale A03-Funktion – NONPASS, zwei Fälle werden fälschlich akzeptiert.

### F-01 – Rechnung kann vor Leistung/Abnahme datiert werden

Nach einer Leistung `performanceDate=2027-01-07`, Kundenabnahme und A03-Wirksamkeit `2027-01-08` akzeptiert `recordV3Invoice` eine Rechnung mit `invoiceDate=effectiveDate=2027-01-06`. Die Funktion prüft derzeit nur, dass `dueDate >= invoiceDate`, nicht aber, dass die Rechnung nicht vor dem referenzierten Leistungs-/Abnahmeereignis liegt.

**Reproduktion:** A03-Performance mit IDs `P/O`, Betrag 10.000 Cent, Abnahme 2027-01-08; danach Invoice-Event `I`, `performanceEventId=P`, `invoiceDate=2027-01-06`. Ergebnis: Invoice wird angehängt.

**Folge:** Der T-0069-Vertrag führt Rechnung als Folge des autorisierten Leistungs-/Abnahmereignisses; der akzeptierte Zustand verletzt diese Ereignisreihenfolge und die dokumentierte Releasegrenze (keine pauschale Vorverlegung der Fälligkeit/Rechnung). A03 sollte die Chronologie fail-closed validieren oder eine explizite, separat autorisierte Vorausrechnungsart modellieren. Keine solche Vorausrechnungsregel wurde freigegeben.

### F-02 – dieselbe SourceRef kann Leistung und Rechnung bezeichnen

Die identische `sourceRef` `SRC-P` wird für den anerkannten Leistungsvorgang und anschließend für das getrennte Rechnungsereignis akzeptiert. Globale Event-ID-Duplikate werden erkannt, aber SourceRefs werden nur innerhalb einzelner Vorgangstypen dedupliziert. Damit kann ein Finanzübergang zwei getrennte Vorgänge mit demselben Quellbeleg/-ereignis verknüpfen, obwohl T-0069 für Leistung, Rechnung und Zahlung getrennte Ereignis-IDs/Quellenreferenzen verlangt.

**Folge:** Die Herkunft/Einmaligkeit einer Buchungsfolge ist nicht ausreichend beweisbar; ein versehentlich erneut verwendeter A02-SourceRef ist nicht fail-closed. A03 sollte global eindeutige Ereignis-SourceRefs erzwingen oder Typ und ursprüngliche Event-ID ausdrücklich in einem validierten Referenzmodell trennen.

### Weitere Grenzen

Die geprüfte Runtime unterstützt ausdrücklich nur gleiche explizite Erlös-/Forderungsbeträge, eine Rechnung je Auftrag, eingeschränkte Teilzahlung und keine Steuern, COGS, Bestandsbewertung, Lieferantenflüsse oder General-Ledger-Abstimmung. Das ist als Komponentenlimit dokumentiert und verhindert für sich allein keinen Komponenten-PASS, begrenzt aber die T-0069-Gesamtintegration. Eröffnungsforderungen sind nur aggregiert und nicht einzelnen OPs zugeordnet; sie können nicht ausgeglichen werden. Negative Eröffnungsbank/Dispo ist nicht unterstützt. Diese Punkte dürfen nicht als erledigte Jahresreconciliation ausgegeben werden.

## Nachweisrollen

- **Ausführung:** A09-Code-/Funktionsreview mit eigenständigen adversarialen Node-Proben.
- **Fachreview:** A03-Selbstreview im begrenzten Subledger-Scope PASS; von A09 identifizierte Gegenbefunde stehen zur fachlichen Korrektur an A03.
- **Unabhängige QA:** NONPASS aufgrund F-01/F-02.
- **Browser-/Gerätetest:** nicht ausgeführt; API-only.
- **Git-Verifikation:** Repository-Status und HEAD überprüft; breite lokale Änderungen erhalten. `git diff --check` PASS. Kein Commit/Push.

## Übergabe

**A01 soll A03** mit F-01/F-02 zur Korrektur und gezielten Regression beauftragen, danach A09-Re-Review veranlassen. A02 darf vor dem Re-Review keine Finance-SourceRefs nach eigenem Ermessen umformen. T-0069 bleibt IN_PROGRESS; die gemeinsame Run-/Finance-Integration, vier 12-Monats-Szenarien und Browser/Mobilegate sind weiterhin offen.
