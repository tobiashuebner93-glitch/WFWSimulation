# A09 – T-0069 Vertragsreview: gemeinsame Ereigniskette

**Status:** PASS für logische Vertragskonsistenz und Vollständigkeit im geprüften Ereignis-/Finance-Umfang; NONPASS/offen für Runtime, produktive APIs und End-to-End-Reconciliation.

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069 – Vertrags-QA, keine Gesamtfreigabe  
**V3-Profil:** Szenariostart 2027-01-04; zwölf Kalendermonate als künftiges Integrations-/Jahresfenster.  
**Maßgebliche Entscheidungen:** D-0159, D-0161–D-0164, insbesondere D-0162; D-0157 für Empfängerabnahme.  
**Vorgänger:** CP-0279 und CP-0280 (ENTWÜRFE).  
**Gitbasis:** Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`.

## Preflight und Bestand

Gelesen wurden `AGENTS.md`, Agentenstruktur und Rechtematrix, `goals.md`, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280, D-0159/D-0161–D-0164 sowie A11s T-0069-Integrationsanalyse, die aktuelle A02-Laufchoreografie, A03-Finanz-Handoff-Matrix, A02-Cross-Review der A03-Matrix und A03-Re-Review der aktualisierten A02-Choreografie. Der aktuelle Arbeitsbaum wurde mit `git status --short` geprüft: zahlreiche parallel bearbeitete und ungetrackte V3-/Governance-Dateien; sie wurden nicht verändert oder verworfen. Nur dieser A09-Bericht wurde neu angelegt. Keine Produkt-, Code-, Schema- oder Fachvertragsdatei geändert.

## Prüfergebnis

| Prüfpunkt | Ergebnis | Befund |
|---|---|---|
| Anfrage → Angebot → Snapshot → Entscheidung | **PASS als logischer Vertrag** | Anfrage/Angebot/Submission/Kundenentscheidung bleiben getrennt. Der bei Abgabe gebundene D-0162-Kalkulationssnapshot und angenommene Vertragspreis bleiben fix. Nur eine echte angenommene `decisionId` kann genau eine Kunden-`workOrderId` eröffnen; Annahme allein erzeugt weder Leistung noch Umsatz, OP oder Cash. Ablehnung/Ablauf endet ohne Finanzwirkung. |
| Kundenauftrag → Operationen/Verbrauch | **PASS als Abgrenzung; Runtime fehlt** | Kunden-`workOrderId` und T-0066-Eigenprodukt-/Operations-IDs werden nicht gleichgesetzt. Tatsächliche Operationen brauchen Datum, Mengen/Einheiten, Material-/Zeitnachweis und passende Kosten-/BAB-Version. Planen/Reservieren ist keine Finanzwirkung; Replay darf Verbrauch nicht doppeln. |
| Lieferung → Empfängerabnahme → Leistung | **PASS mit bedingtem Handoff** | Produktion, Lieferung, Abnahme und finanzielle Leistung werden in Quelle/Datum unterschieden. Abnahme liegt beim Auftraggeber/Empfänger gemäß D-0157. Das konkrete Auftrags-/Abnahmekriterium bestimmt, wann ein Finanz-Leistungsereignis vorliegt; ohne Kriterium, Beleg oder Kundenereignis bleibt der Übergang pending. Es wird keine pauschale Abnahmefiktion eingeführt. |
| Leistung/Umsatz/Forderung vs. Rechnung/OP | **PASS als logischer Vertrag** | A03s Spiel-KLR-Vertrag lässt Umsatz/Forderung genau einmal am belegten, vertragsgemäßen Leistungs-/Abnahmeereignis entstehen. Rechnung und OP-Nachricht sind danach separate Vorgänge mit eigener `invoiceId`, `invoiceDate`, `invoiceSourceRef` und Vertrag-/Leistungsbezug; sie lösen dieselbe Erlös-/Forderungswirkung nicht erneut aus. Fälligkeit muss aus Vertrag/Policy stammen; sie wird nicht von A02 geschätzt. |
| Zahlung/Bank | **PASS als logischer Vertrag** | Nur ein tatsächlicher, belegter Eingang mit eigener `paymentId`, `paymentDate`, `paymentSourceRef`, Betrag/Währung und Rechnungs-/OP-Bezug kann nach A03-Autorisierung die Forderung senken und Bank/Cash erhöhen. Zahlung ist kein zweiter Erlös. Erwartete, fehlende oder wiederholte Zahlung wird nicht als Cash gezählt bzw. doppelt gebucht. |
| IDs, Daten, Quellen und Runbindung | **PASS als logischer Referenzvertrag; Adapter nicht implementiert** | A02 verlangt stabile Modulereignis-IDs, Eventtyp/Phase, `effectiveDate`, Sortierschlüssel, `runId` und `sourceRefs`; A03s Finanzreferenz muss auf dasselbe konkrete, autorisierte Quellereignis abbildbar sein. Invoice und Payment haben getrennte IDs, Quelldaten und Datumsfelder; Leistungs-, Liefer-, Abnahme-, Rechnungs-, Fälligkeits- und Zahlungstag werden nicht zusammengezogen. Tatsächliche ID-Adapter/Mapping- und Validierungsfunktionen fehlen noch. |
| Keine doppelte Finanzwirkung | **PASS als Regel; nicht laufzeitgetestet** | Anfrage/Angebot/Annahme/Plan verursachen keine Istbuchung. Leistung ist einmalige Quelle für Umsatz/Forderung/COGS nach A03-Vertrag; Invoice wiederholt diese Wirkung nicht, Payment wiederholt keinen Umsatz. Finanzreferenz wird nur von A03 autorisiert. |
| Kein neu erfundenes operatives Cashgate | **PASS** | A02 grenzt fehlende A03-API ausdrücklich auf den davon abhängigen finanziellen Bewertungs-/Posting-/Reconciliation-Handoff ein: `pending/non-posting`; daraus folgt keine neue operative Produktions-Cashprüfung, kein Dispo-Drawdown und kein Kreditdefault. Ein bereits freigegebenes konkretes Cash-Gate dürfte nur als bestehende A03-Regel konsumiert werden. |
| Fehlende APIs/Belege | **PASS als Fail-closed Vertrag; Implementation NONPASS/offen** | Fehlende Kundenauftrag-/Workplan-, Lieferung-/Abnahme-, Ist-Finanz-, Bewertungs-, Invoice-/OP-, Payment-/Bank- und Reconciliation-API lässt den betroffenen Übergang pending/non-posting bzw. blocked mit Grund. Es gibt keinen A02-Ersatzposten oder Erfolgsstatus. Die APIs und gemeinsame Runtime sind nicht vorhanden. |
| Perioden / Stichtage | **PASS als Regel** | D-0162 wird korrekt umgesetzt: operative Flüsse in Kalendermonaten, Jahresflüsse als Summe der zwölf Monate; Bank/Cash, OPs, Verbindlichkeiten und Vorräte/WIP/Fertigwaren an benannten Stichtagen. Makroperiode bleibt eine separate Achse. Leistungs-/Realisationsdatum, Rechnungsdatum, vertragliche Fälligkeit und Zahlungstag bleiben getrennt. Wenn das konkrete Vertragskriterium oder Fälligkeitsdatum fehlt, bleibt der Vorgang unvollständig statt geschätzt. |
| Idempotenz / Replay | **PASS als spezifizierte Invariante; Implementierung NONPASS/offen** | Stabile IDs/Versionen und Runbindung, no-op bei identischem Replay, Zurückweisung abweichender Payloads, keine Wiederverwendung verbrauchter Ressourcen und `failed/needs_review` bei beschädigter Historie sind festgelegt. Eine gemeinsame modulübergreifende Dedupe-/Replay-Implementierung, insbesondere bis zur A03-Finanzreferenz, existiert noch nicht. |

## Bewertung der Cross-Reviews

A02s Cross-Review findet keine Finanz-/Perioden-Policykollision und bestätigt die A03-Matrix semantisch. Die frühere NONPASS-Stelle zur fehlenden Rechnungs-/Zahlungsphase ist im aktuellen A02-Vertrag durch eigene Tages-Handoffs behoben; die frühere Cashgate-Unschärfe ist präzisiert. A03s aktueller Re-Review bestätigt PASS für den vollständigen logischen Finanzvertrag und nennt explizit, dass gemeinsame Runtime, Kundenauftragsadapter, A03-Ist-APIs und Jahresreconciliation fehlen. Die älteren NONPASS-Befunde beziehen sich auf die vorherige A02-Fassung und sind nicht der aktuelle Vertragsstand.

## Verbleibende Runtime-/API-Gates

Diese Befunde verhindern einen T-0069-Gesamt-PASS, widersprechen dem logischen Vertrag aber nicht:

1. Kein gemeinsamer V3-Run/Eventstream und keine ausführbare modulübergreifende ID-/SourceRef-Zuordnung.
2. Keine implementierte echte `decisionId`-Übergabe in einen Kundenauftrag-/Workplan-Adapter; der sichere Player-View ist keine autoritative Auftragsquelle.
3. Kein Kundenfertigungs-/Liefer-/Empfängerabnahme-Adapter, der Auftrag, Kriterium, Istmenge und Ereignisquelle ausführt.
4. Keine A03-Ist-Posting-, Umsatz-/AR-, WIP-/Fertigwarenbewertungs-/COGS-, Rechnungs-/OP-, Zahlungseingangs-/Bank-API und keine gemeinsame Finanzreconciliation.
5. Keine durchgehenden zwölfmonatigen Szenarioläufe, Replay-/Dedupe-Gegenprobe oder Browser-/Mobilprüfung.
6. T-0068-Ereignisfragen samt D-0147-Tageslimit/-Effekten sind Katalog/Vertrag, aber noch nicht in den gemeinsamen Run eingebunden; D-0159-Tagblockierung wird nicht reaktiviert.

## Nachweisrollen und Grenzen

- **Vertragsreview / unabhängige QA:** PASS für logische Konsistenz und Vollständigkeit der hier aufgeführten Kette; keine gegenseitige Fachautorität ersetzt.
- **Runtime-/API-Tests:** nicht ausgeführt; die beschriebenen Module-zu-Modul-Schnittstellen sind noch nicht implementiert.
- **Jahreslauf / Finance-Reconciliation:** nicht ausgeführt.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** Branch/HEAD wie oben; Arbeitsbaum bleibt breit geändert/untracked. Kein Commit/Push. Es wurde keine Änderung an Produktdateien vorgenommen.

**Schluss an A01:** Den A02/A03-Vertrag als konsistenten Implementierungsrahmen übernehmen. Die Runtime darf nur die autorisierten Übergänge schrittweise ergänzen und muss jeden fehlenden Handoff sichtbar pending/non-posting halten. T-0069 bleibt IN_PROGRESS; dieser PASS ist keine Produkt-, Architektur-, Schema-, Finanzbuchungs- oder Releasefreigabe.
