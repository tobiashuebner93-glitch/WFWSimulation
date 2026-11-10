# A07 – unabhängiger Re-Review T-0068 Vw-Ereignisfragen

**Status:** NICHT BESTANDEN – Distraktorqualität und redaktionelle Ausgabe benötigen Nacharbeit  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A07 – EXAM  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.3 / SLG-002.4  
**Ticket:** T-0068  
**Datum:** 2026-10-31  
**Preflight:** AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068 sowie Katalog, Mapping und A06-Arbeitsbericht gelesen. Aktiver Kontext ist MG-002/V3. Maßgeblich sind D-0147, D-0159, D-0161–D-0164; V2-Fragenabnahme bleibt unangetastet. Repository: `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; der Arbeitsbaum enthält bereits zahlreiche Änderungen anderer Agenten. Keine davon wurde geändert oder verworfen.

## Ergebnis je Gate

| Gate | Ergebnis | Befund |
|---|---|---|
| Fachgebiet Vw | **PASS** | EVT-038 prüft Nachfrage-/Angebotsinteraktion, EVT-039 Markteintritt und EVT-048 Produktivität/Kapitalausstattung. Die früheren RW-/operativen Fehlzuordnungen sind inhaltlich entfernt, nicht nur umbenannt. |
| Fachliche Aussage und Lösungsschlüssel | **PASS mit Vorbehalt** | Im geprüften 50er-Satz stimmen die ausgewiesenen Schlüssel mit den Erklärungen überein; kein zweiter eindeutig richtiger Schlüssel ist aufgefallen. Makro-/Markt-/Produktivitätsthemen werden überwiegend korrekt als bedingte Wirkung statt sichere Kausalität formuliert. |
| Unternehmenswirkung und D-0147/D-0159 | **PASS** | Jedes Item hat eine erklärende Unternehmensperspektive und grenzt direkte Ereignis-/Buchungswirkung ab. Dashboardantworten bleiben beim D-0147-Limit und den dort bereits beschlossenen kleinen Effekten; der Tag wird nach D-0159 nicht blockiert. Es wird keine neue Produktwirkung vorweggenommen. |
| Struktur/Schlüsselverteilung | **PASS** | 50 Items; gezählte Schlüssel A/B/C/D = 13/13/12/12. |
| Plausibilität der Distraktoren | **NICHT BESTANDEN** | Mehrere Antworten sind weiterhin Karikaturen statt glaubhafter Fehlannahmen. Die fachliche Lösung ist bei einem Teil der Items allein an absoluten Wörtern oder Kategorienfehlern zu erkennen. Das verletzt das T-0068-Kriterium plausibler Ablenker und die bereits zuvor benannten A07-Befunde. Beispiele unten. |
| Redaktionelle Qualität | **NICHT BESTANDEN** | Alle 50 Fragesätze enden vor den Antwortoptionen mit doppeltem Fragezeichen (`??`). Das ist ein sichtbarer systematischer Satzzeichenfehler im kompletten Fragenblock. |
| Quellen / Kompetenzzuordnung | **nicht abgenommen** | A07 hat die fachliche Fragequalität geprüft. Der gesonderte itemweise Quellen-/Mappingreview bleibt A08 vorbehalten. |
| Umfang / Nichtmutation / Laufzeit | **nicht abgenommen** | A09-Vollständigkeits-/Nichtmutations-QA bleibt separat. WBQ-/HSQ-/UI-Validatoren beweisen nicht die Plausibilität der Distraktoren dieses neuen 50er-Katalogs. |

## Konkrete noch schwache Distraktoren

- **EVT-002:** „sofort Tiefstand“ und „Auslastung mit Gewinn gleichsetzen“ sind leicht als Kategorienfehler erkennbar; ein realistischer Konflikt zwischen Kapazitätsreserve, Liefertermin, Preis und zusätzlicher Schicht fehlt.
- **EVT-003 / EVT-005:** Alternativen wie „Phase endgültig aus einem Monat“ bzw. „zwingend Boom/Tiefstand“ sind offensichtliche Übertreibungen. Ein plausibler Distraktor könnte unterschiedliche, aber unvollständige Indikator- oder Saisonbereinigungsvergleiche darstellen.
- **EVT-004:** automatische Mietminderung und vollständige Behandlung der Miete als variable Stückkosten sind sehr grobe Fehlannahmen; die korrekte Option bündelt mehrere richtige Prüfungen und ist dadurch auffällig vollständig.
- **EVT-006:** Ignorieren von Produktionsdaten oder Frühindikator als realisierte Aufträge zu buchen sind extreme Optionen; kaum glaubhafte alternative Prognosebehandlung.
- **EVT-010 / EVT-012:** „alle Aufträge stornieren“, Arbeitsschritt als abgeschlossen markieren bzw. erwartete Lieferung direkt als Bestand buchen sind zwar Fehler, aber zu offensichtlich. Es fehlen vertretbare Alternativen wie Teilmengenpriorisierung, Ersatzbeschaffung oder Terminverhandlung mit offengelegten Kostenfolgen.
- **EVT-013 / EVT-014:** Optionen wie „Betrieb erhält Cash“ oder „Leitzinsänderung ist Zahlungseingang“ sind keine realistischen Missverständnisse eines Fachwirt-Falls.
- **EVT-017:** Die Ankündigung als unmittelbare Produktivität bzw. allgemeines Lohnkostensinken ist kausal zu plump; nur die Aussage zu Qualifikationsangebot ist als Gegenannahme halbwegs plausibel.
- **EVT-020:** „Emissionspreis senkt in jedem Fall Kosten“ und „Ankündigung senkt Emission ohne Verhaltensänderung“ sind offensichtlich; brauchbare Alternativen müssten etwa Vermeidungskosten, Substitution, Preisweitergabe und Investitionshorizont gegeneinanderstellen.
- **EVT-021 / EVT-023:** Fördermittel vor Bescheid als Zahlung/Kapazität zu behandeln ist offensichtlich unhaltbar; es fehlen plausible Fälle mit Förderwahrscheinlichkeit, Vorfinanzierung, Eigenanteil und verzögertem Mittelzufluss.
- **EVT-025:** Produktivität und Nachfrage zu addieren oder aus einer Reihe die andere zu beweisen ist zu offensichtlich falsch; der Kernfall ist gut, die Antwortauswahl prüft kaum Transfer.
- **EVT-026:** Die Optionen A–C sind kaum vertretbare Ressourcenplanungen; korrekte Antwort ist durch vollständige Aufzählung der relevanten Faktoren erkennbar.
- **EVT-041:** erst Rechtsform wählen, Anfragen als Auftragsbestand buchen und nur Best-Case nutzen sind stark karikierte Gründungsfehler. Als Transferfrage braucht es konkurrierende, fachlich begründbare Prüfpfade und klaren Entscheidungshorizont.
- **EVT-043:** die drei Fehloptionen sind überwiegend leicht durch normative Schlagworte wie „unselbstständig“, „automatisch bereits eingetragen“ und Gleichsetzung von Begriffen auszuschließen. Der fachliche Gegenstand passt, die Distraktoren müssen aber realistische Verwechslungen der getrennten Rechtsträgerrollen abbilden.
- **EVT-049 / EVT-050:** „immer unverändert wachsen“, „Wettbewerb beweist Rückgang“, „höchsten Marktanteil erreicht“ sowie „Preis ist alleinige Ursache“ sind leicht erkennbare Absolutbehauptungen. Plausiblere Alternativen zu Produkt-/Segmentdiagnose und Skalierungsrisiko fehlen.

Die Liste ist eine gezielte Nacharbeitsmenge, keine Behauptung, dass jede Option der übrigen Items psychometrisch kalibriert sei. Insbesondere ist die Antwortlänge oft ein Hinweis: die richtige Option enthält eine differenzierte Mehrfaktorenanalyse, während die falschen kurz und absolut formuliert sind. Eine reine Schlüsselverteilung behebt das Muster nicht.

## Geprüfte Artefakte und Prüfungen

- `docs/learning/t-0068-v3-ereignisfragen-katalog-entwurf.md`
- `docs/learning/t-0068-v3-kompetenz-und-lernzuordnung.md`
- `docs/learning/a06-t0068-arbeitsbericht.md`
- vorherige A07-Befunde in `a07-t0068-drittreview.md`
- `node prototype/learning-wbq-validation.mjs`: PASS (200 WBQ-Items, 50 je Bereich; der Validator weist selbst darauf hin, dass semantische Distraktorplausibilität nicht automatisiert geprüft wird)
- `node prototype/learning-hsq-validation.mjs`: PASS (250 HSQ-Items; 0 weak-distractor flags in diesem anderen Katalog; kein Nachweis für T-0068)
- `node prototype/learning-ui-regressions.mjs`: PASS (540-Item-Pool/UI; kein Inhaltsreview des neuen 50ers)
- `git diff --check`: Exit 0; nur vorhandene LF/CRLF-Hinweise. `git status --short` bestätigt vorhandene Änderungen; keine Änderung dieses Review-Laufs außer diesem Bericht.
- Kein Browser-/Gerätetest. Kein Commit/Push.

## Erforderliche Nacharbeit

A06 soll die oben markierten Antwortsets durch fachlich mögliche, aber begründbar falsche Alternativen ersetzen, die typische Fehlinterpretationen differenzieren. Der richtige Schlüssel soll nicht regelmäßig als längste bzw. einzige vorsichtige Mehrfaktorenoption herausstechen. Alle 50 doppelten Fragezeichen sind auf einfache, typografisch einheitliche Satzzeichen zu korrigieren. Danach erneuter vollständiger A07-Inhaltsreview; A08 und A09 bleiben unabhängige Gates. T-0068 bleibt **IN_PROGRESS**.

**Rückfragen an A01:** Keine.  
**Nächster Schritt:** A01 beauftragt A06 mit der gezielten Distraktor- und Satzzeichen-Nacharbeit; danach folgt ein erneuter A07-Review.
