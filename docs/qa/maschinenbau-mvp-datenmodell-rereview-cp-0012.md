# QA-Rereview – Maschinenbau-MVP-Datenmodell nach CP-0012

**Datum:** 2026-09-26  
**Agent:** A09 – QA  
**Bezug:** MG-000 / SLG-000.2 / T-0006 / D-0010 / CP-0011 / CP-0012  
**Ergebnis:** **QA BESTANDEN**

## Geprüfte Dokumente

- `AGENTS.md` und `docs/agent-system/agent-structure.md`
- `docs/agent-system/goals.md`, `ticket-board.md`, `collaboration-state.md` und `decision-log.md` einschließlich D-0010
- `docs/agent-system/checkpoints/CP-0011.md` und `CP-0012.md`
- Ursprünglicher QA-Review `docs/qa/maschinenbau-mvp-datenmodell-review.md`
- Aktuelles Modell `docs/database/maschinenbau-mvp-datenmodell.md`
- `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md` (A02)
- `docs/accounting/maschinenbau-mvp-finanzspezifikation.md` (A03)
- Architektur V0.2 und ADR-001 bis ADR-008, weiterhin ausschließlich PROPOSED

## Ursprüngliche MAJOR-Befunde

| Ursprünglicher Befund | Ergebnis | Begründung |
|---|---|---|
| Verbindlichkeiten | **PASS** | `obligation_source` hält den vertraglichen/operativen Ursprung getrennt. `payable` benötigt keine SupplierInvoice; `payable_invoice_link` ermöglicht spätere Rechnungszuordnung. Das Modell überlässt A03 ausdrücklich, ob/wann ein Payable entsteht und wie es bewertet wird. Verpflichtungsursprung, Payable, Lieferantenrechnung und Zahlung bleiben getrennt; eine zweite Finanzwahrheit entsteht nicht. |
| Anzahlungen | **PASS** | `payment` kann einem Vertrag zugeordnet werden; `payment_term_payment` verbindet Payment und konkreten Zahlungstermin auch ohne Rechnung oder OP. Mehrere Termine/Zahlungen sind darstellbar. Klassifikation als Anzahlung, Verrechnung sowie Bilanz-/Steuerwirkung bleiben A03-/Nutzerentscheidung. |
| Teilproduktion | **PASS** | `production_run_line` referenziert eindeutig einen ProductionRun und eine konkrete ContractLine mit Plan-/Fertigmenge und Einheit. `resource_consumption` referenziert diese Laufposition. Die Struktur erlaubt spätere positionsbezogene Teillose; V1 verlangt weiterhin vollständige Positionsmengen und aktiviert Teilproduktion nicht. |

## D-0010 und fachliche Zuständigkeiten

D-0010 ist unverändert als `APPROVED (Nutzerentscheidung; keine Architekturfreigabe)` dokumentiert. V1 bleibt auf vollständige Vorgänge beschränkt; strukturelle Erweiterbarkeit für spätere Teilvorgänge widerspricht der V1-Regel nicht.

A02 behält die Autorität über Prozess, Zeit, Mengen und operative Ereignisse. A03 behält die Autorität über Accounting, Beträge und Finanzzustände. A04 konkretisiert die Persistenzbeziehungen, ohne den Entstehungszeitpunkt einer Verbindlichkeit oder die Klassifikation einer Anzahlung festzulegen. A11 behält die Prüfung der Systemgrenzen. Architektur und ADRs sind nicht freigegeben.

## MINOR-Befund aus CP-0011

Die ältere Dokumentationsabweichung besteht fort: A02 §B nennt Teillieferung als optional im MVP; A03 §P übernimmt diese Aussage bzw. führt Teilvorgänge als offen. Das widerspricht textlich D-0010. Das Datenmodell selbst folgt D-0010 und schließt Teilvorgänge aus V1 aus. Es liegt daher **kein Modellkonflikt**, sondern eine **Dokumentationsabweichung** in den A02-/A03-Quellen vor.

A09 ändert diese fachlichen Spezifikationen nicht. Folgeaktion für A01: A02/A03 um Angleichung der Scope-Texte an D-0010 bitten. D-0010 bleibt maßgeblich und unverändert.

## Offene Fachentscheidungen

Weiterhin offen und nicht durch A04/A09 entschieden sind:

- Zeit-/Periodenregeln und Ereignisreihenfolge
- Netto-/Brutto-/Steuersemantik
- Zahlungsvarianten, Zahlungssemantik und Anzahlungsklassifikation/-verrechnung
- Zeitpunkt und Ansatz einer Verbindlichkeit
- Kostenmethode und BAB-Verteilung
- Materialbewertung
- Abnahme und operative/finanzielle Auftragsabschlussbedingungen
- Korrekturen, insbesondere nach Periodenabschluss
- Startstichtag, Startbudget-Klassifikation und weitere Startparameter

Diese offenen Regeln sind kein QA-Mangel, solange sie vor Implementierung durch die zuständigen Rollen bzw. den Nutzer geklärt werden.

## Weitere Prüfpunkte

- V1-Prozesskette von Anfrage/Kalkulation/Angebot über Auftrag, Beschaffung, Eingang/Fremdleistung, Produktion, Lieferung, Rechnung und Zahlung bis Auftragsabschluss/-ergebnis ist abgebildet.
- Operative Fakten, Finanzobjekte und Stammdaten sind getrennt. A03 bleibt autoritativ für Kosten, Erlöse, OP, Zahlungen, Liquidität, Ergebnis und BAB-Auswertung.
- Keine neue BLOCKER- oder MAJOR-Inkonsistenz festgestellt.
- D-0010 wurde nicht geändert; keine neue D-ID; keine Architektur-/ADR-Freigabe.
- Keine Anwendungscode-, Migrations-, Supabase- oder Dependencyänderung.

## Status und nächste Aktion

Alle drei ursprünglichen MAJOR-Befunde sind geschlossen. T-0006 kann gemäß Freigabekriterium als abgeschlossen markiert werden. **QA BESTANDEN ist keine Implementierungsfreigabe und keine Architekturfreigabe.**

Empfehlung an A01: T-0006 als abgeschlossen führen und die MINOR-Folgeaktion zur textlichen Scope-Angleichung an A02/A03 übergeben. Vor einer Implementierung sind die offenen Fachentscheidungen mit A02/A03/A11 bzw. dem Nutzer zu klären.

## Geänderte Dateien dieses QA-Schritts

- `docs/qa/maschinenbau-mvp-datenmodell-rereview-cp-0012.md` (dieser Bericht)
- `docs/agent-system/ticket-board.md` (T-0006 auf COMPLETED verschoben)
- `docs/agent-system/collaboration-state.md` (aktiver Kontext und QA-Status aktualisiert)
- `docs/agent-system/checkpoints/CP-0013.md` (Checkpoint)
