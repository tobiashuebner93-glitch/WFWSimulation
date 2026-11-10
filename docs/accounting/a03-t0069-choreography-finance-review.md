# A03-Cross-Review – T-0069 A02-Laufchoreografie

**Status:** Re-Review PASS für den vollständigen logischen Finanzvertrag; integrierte Runtime/APIs und Jahresreconciliation bleiben offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069 (Integrationsvorbereitung)
**Start-/Zielprofil:** V3 ab 2027-01-04; zwölf operative Kalendermonate; keine Änderung der V1/V2-Startprofile
**Entscheidungen:** D-0159, D-0161–D-0164, insbesondere D-0162; zusätzlich D-0157 für Kundenabnahme
**Vorgänger:** CP-0279, CP-0280 (ENTWURF)
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und Prüfgrenze

Gelesen: AGENTS.md, Agentenstruktur und Rechtematrix, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280, A02 `a02-t0069-v3-run-choreografie.md`, A03 `a03-t0069-v3-finance-handoff-matrix.md`, A11 `a11-t0069-v3-integration-assessment.md`, A03 Finanzschnittstellenpaket, T-0065-/T-0066-Finanzreviews, T-0067-Rechenvertrag und D-0162. `main` und HEAD waren unverändert; der Arbeitsbaum enthielt viele bereits vorhandene V3-/Governance-Änderungen und Berichte. A03 änderte keine Quelle, Choreografie oder Produktdatei.

Der Review prüft nur Finanzsemantik, Reihenfolge, Perioden-/Stichtagssicht, Postingautorität und Quellen-/Replaygrenzen. Er ist keine Implementierungs-, Architektur-, Schema- oder Releasefreigabe.

## Gate-Ergebnisse

| Gate | Ergebnis | Befund |
|---|---|---|
| Kundenanfrage → Angebot → Kundenentscheidung | **PASS, als Vertragsvorschlag** | A02 trennt Anfrage, eingereichtes Angebot und tatsächliche Entscheidung. Nur Annahme darf einen Kundenauftrag eröffnen; sie erzeugt noch keine Leistung, Rechnung, Forderung oder Zahlung. Ablehnung/Ablauf bleibt ohne Finanzwirkung. Das entspricht A03 und D-0162. Die echte `decisionId`-Verbindung ist im Ist-System noch nicht in der sicheren Player-View verfügbar; A02 benennt das als Integrationslücke. |
| Auftrag → tatsächliche Leistung/Lieferung → Empfängerabnahme | **PASS, mit Integrationsblocker** | Die Choreografie trennt angenommene Marktentscheidung von Workplan und Liefer-/Abnahmeereignis; T-0066-Eigenprodukt wird nicht als Kundenauftrag umgedeutet. Kundenabnahme ist ausdrücklich dem Auftraggeber/Empfänger zugeordnet (D-0157). Ohne tatsächlichen Kundenauftrag, Abnahmeklausel und Empfängerereignis bleibt der Finanzübergang `pending`. |
| Rechnung und Forderung | **NONPASS – Ereigniszeitpunkt fehlt in Tageschoreografie** | A03-Matrix verlangt ein eigenes Rechnungs-/Forderungsereignis mit eigenem Rechnungsdatum; Umsatz/Forderung entsteht im Spiel-KLR-Vertrag genau einmal am belegten Leistungs-/Abnahmeereignis. Rechnung oder Rechnungsanzeige darf denselben Erlös/die Forderung nicht nochmals erzeugen. A02 nennt Rechnung/Forderung als getrennt, hat aber nach Leistung/Abnahme keine explizite Rechnungsphase, keinen Rechnungszeitpunkt und keinen eindeutigen Invoice-/OP-Quellbezug in der Tagesreihenfolge. A02 muss diesen Übergang als separaten, zunächst `pending/non-posting` Handoff ausweisen oder ausdrücklich auf die A03-Matrix verweisen; es darf dabei keine zusätzliche Erlösbuchung ableiten. |
| Kundenzahlung und Cash | **NONPASS – tatsächlicher Zahlungseingang nicht sequenziert** | A02 sagt, Zahlung und Cash seien getrennte Vorgänge, enthält jedoch keinen eigenen Zahlungseingang nach Rechnung/Fälligkeit, kein Zahlungsdatum und keinen Zahlungs-/Rechnungsbezug in der Tageschoreografie. Nach A03 reduziert ein tatsächlicher Zahlungseingang die zugeordnete Forderung und erhöht Bank/Cash um denselben autorisierten Betrag; er erzeugt den Erlös nicht nochmals. Ohne vollständige A03-Zahlungsquelle darf der Lauf nicht als Cash-/OP-abgestimmt oder T-0069-finanzseitig bestanden gelten. |
| Flow vs. Stock / Periodenzuordnung | **PASS** | A02 referenziert D-0162: operative Angebots-/Kosten-/Ergebnisflüsse gehören in Kalendermonate; Jahresflüsse summieren die zwölf Monate. Bank/Cash, Forderungen, Verbindlichkeiten und Inventar bleiben benannte Stichtagsgrößen, nicht Monatssummen. Makroperiode bleibt getrennt. A03-Matrix trennt zusätzlich Leistungs-, Rechnungs-, Fälligkeits- und Zahlungsdatum. |
| A03-Posting- und Bewertungsautorität | **PASS, sofern Wortlaut eng ausgelegt wird** | A02 verbietet A02-seitige Mutation von Cash, Forderungen, Ledger und Bewertung und verlangt ein autorisiertes A03-Quellereignis. Dies entspricht A03. Die Formulierung „fehlende Cash-/Bewertungsfreigabe blockiert den jeweils davon abhängigen Ist-Übergang“ muss bei der Implementierung auf den **finanziellen Posting-/Bewertungsübergang** begrenzt bleiben. Sie darf kein unbestätigtes Produktions-Cashgate oder eine operative Produktionssperre auslösen; A03s Matrix weist eine solche zusätzliche Cash-Gate-Regel ausdrücklich zurück. Das ist derzeit eine Auslegungsunschärfe, kein nachgewiesener Regelwiderspruch. |
| IDs, Provenienz, Idempotenz | **PASS als logischer Vertrag; Implementierung offen** | A02 verlangt stabile Modul-/Event-IDs, Version, Runbindung, `effectiveDate`, Phase/Sortierschlüssel, `sourceRefs`/`causedByEventId` und ablehnendes Replay bei beschädigter Historie. Finanzreferenzen entstehen nur nach A03-Autorisierung. A03 benötigt für die spätere Wirkung den zusammenhängenden Quell-/Vertragsbezug und eine genau-einmalige A03-Finanzreferenz; Replays dürfen Umsatz, COGS, Rechnung/OP oder Zahlung nicht verdoppeln. Das Feldmapping zwischen `decisionId` → Auftrag → Arbeits-/Liefer-/Abnahmeevent → Rechnung/OP → Zahlung und A03-Transaktionsreferenz ist noch nicht implementiert und bleibt Releaseblocker. |
| Vollständige Finanzreconciliation | **NONPASS / noch nicht verfügbar** | Der A03-Prototyp besitzt noch keine Ist-Ledger-, AR-/Bank-, Bestandsbewertungs-, Rechnungs-/Zahlungs- oder gemeinsamen Abschluss-API. A02 kennzeichnet dies und sagt, dass ein fehlendes Posting non-posting bleibt. Damit besteht kein Widerspruch, aber es gibt noch keine Möglichkeit, die in T-0069 geforderte Jahres-Reconciliation tatsächlich auszuführen. |

## Konkreter Rückgabehinweis an A02 über A01

Bitte die Tageschoreografie um zwei getrennte Zeilen/Handoffs ergänzen: (1) Rechnung/OP nach dem autorisierten Leistungs-/Abnahmeereignis mit eigenem Rechnungsdatum/Quellbezug und ohne doppelte Umsatz-/Forderungswirkung; (2) tatsächlicher Kundenzahlungseingang an seinem eigenen Datum, der ausschließlich nach A03-Autorisierung Forderung/Cash abstimmt und keinen Erlös erneut erzeugt. Beide müssen vorerst als nicht verfügbar bzw. `pending/non-posting` markiert sein, weil die A03-Ist-API fehlt.

Zusätzlich die Phrase „Cash-/Bewertungsfreigabe“ explizit auf den finanziellen Ist-Posting-/Bewertungsübergang begrenzen; keine neue operative Produktions-Cashprüfung. Für Implementierung die vollständige Kette der stabilen Modulquellenreferenzen und A03-Transaktionsreferenz festhalten. Dies ist eine Schärfung der fehlenden Übergabebeschreibung, keine neue Finanzpolitik.

## Review und Verifikation

- **Fachreview A03:** durchgeführt; keine neue Produktregel oder Finanzbuchungswirkung festgelegt.
- **Unabhängige QA:** nicht ausgeführt; A09 hat T-0069 bis hier nur vorbereitet.
- **Browser-/Gerätetest:** nicht ausgeführt; Dokumentenreview.
- **Tests:** keine Produktänderung, daher keine Code-Regression ausgeführt.
- **Git-Verifikation:** Branch `main`, HEAD unverändert; umfangreicher bestehender Arbeitsbaum blieb unangetastet. `git diff --check -- docs/accounting/a03-t0069-choreography-finance-review.md` — PASS; kein Commit/Push.

## Schlussfolgerung

Die expliziten Grenzen zu Kundenannahme, Kundenabnahme, A03-Posting, D-0162-Flüssen/Stichtagen und Replay sind fachlich konsistent. Es gibt keinen Beleg, dass A02 bereits abweichende Buchungsregeln einführt. **T-0069-Cross-Review ist dennoch NONPASS für die vollständige Finanzchoreografie**, weil Rechnungs-/OP- und Zahlungseingangsereignis zeitlich nicht als eigene Handoffs ausgeführt werden und ein operatives Cashgate durch den aktuellen Wortlaut missverstanden werden könnte. A02 soll die genannten fehlenden Phasen und Textgrenze ergänzen; danach erneuter A03-Cross-Review und unabhängiges A09-Review. Kein Nutzerentscheid ist hierfür erforderlich.

## Addendum – Re-Review nach A02-Korrektur (2026-10-31)

**Aktuelle Bewertung:** **PASS für die Finanzvollständigkeit des logischen Vertrages.** Die oben stehenden NONPASS-Feststellungen zum fehlenden Rechnungs-/Zahlungshandoff und zur Cash-Formulierung beziehen sich auf die vorherige A02-Fassung und sind durch die folgenden Ergänzungen auf Dokumentebene behoben.

### Gegengeprüfte Änderungen

- **Leistung/Bestand/COGS:** eigener A03-Handoff mit `performanceDate`, `deliveryDate` und `acceptanceDate`, Vertragskriterium, Mengen/Einheiten, Kosten-/BAB-Snapshot und Quell-ID. A03 bestimmt das wirksame Finanzperiodendatum nach dem konkreten Vertrag; A02 setzt Leistung nicht pauschal mit Fertigstellung, Versand oder Abnahme gleich. Ohne Beleg, Wertebasis oder API bleibt der Finanzübergang `pending/non-posting`.
- **Rechnung/Forderung:** eigenes Ereignis mit `invoiceId`, `invoiceDate`, `invoiceSourceRef`, Rechnungs-/OP- und Vertrags-/Leistungsbezug. Das Rechnungsdatum bleibt von Leistung, Lieferung, Abnahme und Zahlung getrennt. Die Rechnung erzeugt den bereits beim autorisierten Leistungsereignis erfassten Erlös nicht ein zweites Mal. Fälligkeit wird aus dem vorhandenen Vertrag/der geltenden Policy bezogen; A02 führt weder Zahlungsziel noch SimTAX neu ein.
- **Zahlung/Cash:** eigenes tatsächliches Zahlungseingangsereignis mit `paymentId`, `paymentDate`, `paymentSourceRef`, Betrag/Währung und Rechnungs-/OP-Bezug. A03 gleicht Forderung und Bank/Cash ab; Zahlung erzeugt keinen zweiten Erlös. Erwartete, aber nicht belegte Zahlungen zählen nicht als Cash. Es wird keine neue Teilzahlungs-, Gebühren- oder Dispo-Regel festgelegt.
- **Cash-/Bewertungsgrenze:** die Tageschoreografie begrenzt fehlende A03-Autorisierung nun ausdrücklich auf den finanziellen Bewertungs-/Posting-/Reconciliation-Handoff. Daraus entsteht keine neue operative Produktions-Cashprüfung; ein solches Gate dürfte nur eine bereits freigegebene A03-Regel konsumieren.
- **IDs und genau-einmalige Wirkung:** die logische Kette `inquiryId → offerId/Snapshot → decisionId → workOrderId → Operations-/Verbrauchsreferenzen → Leistungs-/Liefer-/Empfängerabnahme-ID → invoiceId/sourceRef → paymentId/sourceRef → A03-Finanzreferenz` ist ausdrücklich dokumentiert. `eventId`/`sourceRefs` (A02) müssen auf das konkrete `sourceEventId`/die Finanzreferenz (A03) abbildbar sein; sie ermächtigen keine zusätzliche Mutation. Alle Referenzen bleiben an `runId` gebunden.

### Finanzkonsistenz nach Achsen

| Achse | Ergebnis | Abgleich |
|---|---|---|
| Anfrage/Angebot/Annahme | **PASS** | Nur eine echte Kundenannahme begründet die Vertrags-/Auftragsverknüpfung; keine Leistung, Rechnung, Forderung oder Zahlung allein durch Annahme. |
| Leistung/Abnahme/Rechnung/Zahlung | **PASS im logischen Vertrag** | Ereignisse, IDs und Daten sind getrennt. Kundenabnahme liegt beim Auftraggeber/Empfänger. Rechnung verdoppelt keinen Erlös; Zahlung verdoppelt weder Erlös noch Forderung. |
| Fluss/Stichtag und Zeit | **PASS** | D-0162: operative Angebots-/Kosten-/Ergebnisflüsse im Kalendermonat, Jahresflüsse als Summe der zwölf Monate; Cash, Forderung, Verbindlichkeit und Inventar als benannter Stichtag. Makroperiode separat. Leistungs-, Rechnungs-, Fälligkeits- und Zahlungsdaten werden nicht gleichgesetzt. |
| Posting/Bewertung/Cash | **PASS, A03-gesteuert** | A02 liefert Beleg/Quellen-/Ist-Daten; ausschließlich A03 autorisiert und führt die finanzielle Wirkung aus. Fehlende API bedeutet `pending/non-posting`, nicht Ersatzbuchung oder Produktionssperre. |
| Idempotenz/Provenienz | **PASS als logischer Vertrag** | Stabile IDs, Runbindung, Quellreferenzen und deduplizierte Folgeübergaben sind vereinbart; tatsächliche Modul- und A03-ID-Adapter müssen noch implementiert und getestet werden. |

### Verbleibende Integrationslücken – kein logischer Regelkonflikt

Weiterhin nicht vorhanden sind gemeinsame Run-/Event-Runtime, Marktentscheidung→Kundenauftrag-/Workplan-Adapter, liefer-/abnahmefähiger Kundenauftrag, A03-Ist-Ledger-/AR-/Bank-/COGS-/Bestandsbewertungs-API, Zahlungseingangslauf und Jahresreconciliation. Die Referenzkette ist damit ein konsistenter Vertrag, noch kein Implementierungs- oder Jahreslaufnachweis. Für jede Rechnung muss ein tatsächliches, vertragsbezogenes Fälligkeitsdatum verfügbar sein; falls es fehlt, bleibt der Vorgang unvollständig und darf nicht durch A02 geschätzt werden.

### Re-Review-Verifikation

- **A02-Fachreview der A03-Matrix:** gelesen; es bestätigt Regelkompatibilität und dokumentiert verbleibende Adapter-/API-Lücken.
- **D-0162:** bestätigt; die Periode wird nicht durch Rechnungs- oder Zahlungstag ersetzt.
- **Code-/Runtime-Tests:** nicht ausgeführt, da nur ein Dokumenten-Re-Review beauftragt war; keine Implementierung behauptet.
- **Unabhängige A09-QA:** nicht ausgeführt; A09-Jahreslauf/Reconciliation bleibt T-0069-Gate.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorhandene lokale Änderungen erhalten. Kein Commit/Push.

**Schluss:** A02 hat die zuvor fehlenden Rechnungs- und Zahlungsereignisse logisch ergänzt und die operative Cash-Gate-Mehrdeutigkeit aufgelöst. Es verbleibt kein A03-Finanzregelkonflikt im logischen Choreografievertrag. T-0069 bleibt wegen der fehlenden integrierten APIs, Ausführung und Reconciliation offen; dies ist Implementierungsarbeit, kein weiterer Policy-NONPASS.
