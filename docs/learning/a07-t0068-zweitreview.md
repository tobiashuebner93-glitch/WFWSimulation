# A07 – Zweitreview T-0068 Ereignisfragen

**Status:** NICHT BESTANDEN – gezielte Inhaltskorrekturen nötig (2026-10-31)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A07 – EXAM
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.3 / T-0068

## Verbesserungen bestätigt

Alle EVT-001 bis EVT-050 wurden nach frischem A07-Preflight gelesen. Die Schlüsselverteilung 13/13/12/12 ist korrekt; keine Folge überschreitet zwei gleiche Positionen. EVT-015/022 und EVT-017/019 sind nun fachlich getrennt; EVT-024 prüft eine wirtschaftspolitische Wirkungsrichtung; EVT-029 ist eindeutig. V2-Fragenkatalog blieb unverändert.

## Blockierende Befunde

1. **EVT-026 falscher Lösungsschlüssel:** Die Frage zu Arbeitstagen, Ersatzkapazität, Qualifikation und zugesagtem Termin wird von Option A beantwortet; im Item steht jedoch „Lösung B“, dessen Erklärung nur den Auftragswert nennt. Damit ist die tatsächliche Schlüsselverteilung falsch. A06 muss den Schlüssel korrigieren und neu zählen.
2. **Wirkungstext widersprüchlich:** Katalogkopf `Mutation: keine` und „keine Produktwirkung“ widersprechen dem D-0147-Dashboardeffekt, den der Kopf und Einzelitems ebenfalls nennen. Erforderliche Aussage: keine direkte Ereignis-/Buchungswirkung; Dashboardantworten können den bestehenden kleinen D-0147-Lerneffekt erzeugen, maximal fünf pro Tag. D-0159s Nichtblockierung bleibt.
3. **Ablenker:** EVT-006, EVT-017, EVT-020, EVT-023, EVT-025, EVT-037, EVT-038, EVT-047 und EVT-050 haben weiterhin zu offensichtliche oder fachfremde falsche Optionen. Die Beispiele/Details stehen im A07-Reviewbericht bzw. in der Agentenübergabe.
4. **Fachbereich:** EVT-045 (DB I), EVT-046 (BAB-Rundungsverteilung) und EVT-050 (Bestand/Forderung/Cash) prüfen primär Rechnungswesen, nicht den in T-0068 geforderten Vw/Wirtschaftsfachwirt-Fachbereich. A06 soll sie durch fachlich passende Vw-Fälle ersetzen oder den 50-Item-Scope begründet korrekt klassifizieren; keine Buchungsregeln als Vw-Frage umetikettieren.

A07 änderte keine Dateien. `git diff --check` PASS (nur LF/CRLF-Hinweise); kein Commit/Push. **Nächster Schritt:** A06 gezielt überarbeiten, danach dritter A07-Review sowie A08/A09-Abschlussprüfung.
