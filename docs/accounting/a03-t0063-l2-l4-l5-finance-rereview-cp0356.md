# A03-Fach-Re-Review – L2/L4/L5-Klarstellungen nach CP-0355

**Status:** PASS der dokumentarischen CP-0354-Kriterien; keine Kosten-, Kredit- oder Postingfreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Datum:** 31.10.2026
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063, Anschluss T-0065/T-0066/T-0067/T-0069
**Gegenstand:** Repository-Version von `docs/simulation/a02-t0063-v3-unternehmenswirkungsvertrag-entwurf.md` plus `docs/simulation/a02-t0063-v3-impactvertrag-a03-nachtrag-cp0355.md`
**Vorgänger:** CP-0351, CP-0352, CP-0353, CP-0354, CP-0355; D-0169

## Preflight / Prüfgrenze

Erneut gelesen wurden `AGENTS.md`, Agentenstruktur/Rechte, Goals, Ticket-Board, Collaboration State, aktiver T-0063-/Folgeticketstand, Decision Log mit D-0169, CP-0351 bis CP-0355, der A02-Wirkungsvertrag und sein im Repository abgelegter CP-0355-Nachtrag sowie A03-Finanz-Handoff-Matrix, Finanzschnittstellenpaket und Evidenz-/Reconciliation-Vertrag mit CP-0344-Nachtrag. Der gleichnamige Scratch-Nachtrag im A01-Stagingordner wurde weder geöffnet noch als Checkpoint-Historie verwendet. CP-0356 und dieser Bericht waren vor Beginn nicht vorhanden.

Prüfung ist read-only und auf die Nachbesserungen der CP-0354-Gates L2/L4/L5 begrenzt. D-0169 ändert ausschließlich synthetische Gesamtanfragen; die Finanzwirkung einer Makroänderung bleibt 0,00 €. Kein Los erhält hiermit eine Finanzberechnungs-, Kredit-, Bewertungs- oder Postingfreigabe.

## Re-Review je Gate

| Los | Ergebnis gegen CP-0354 | Beleg und verbleibende Grenze |
|---|---|---|
| **L2 – Außenwirtschaft** | **PASS** | FX-Trace enthält Basis-/Quotewährung, Notierungskonvention, Einheit, Quelle/Vintage und explizite ECB-Inversion. Die Beispielrichtung `USD/EUR` ist als EUR je USD definiert; Index `2027-01=100` ist ausdrücklich relativ, kein Wechselkurs. Pass-through betrifft nur offene, nicht angenommene Beschaffungsplanung; angenommener Liefervertrag hält seinen Preis-Snapshot. Exportchance verwendet Segmentkennung/Exportfähigkeit und verteilt nur die D-0169-Menge; Wochen-Gesamtzahl bleibt invariant. Störung verschiebt nur ETA; Wareneingang braucht Mengenbeleg und darf ohne separate A03-Evidenz nur physische Empfangsmenge ändern, nie Geldwert, Rechnung, BAB oder COGS. Keine tatsächliche Beschaffung, Bewertung, Rechnung oder Buchung wird autorisiert. |
| **L4 – Inflation/Business-Cost-Index** | **PASS** | CPI/SPI ist getrennt von Business-, Lohn- und Beschaffungsplanindizes. Basisperioden/-werte, normalisierte Komponenten, Maßeinheiten, Quelle/Vintage oder synthetische Parameter-ID, explizite Gewichte und Aggregationsformel sind beschrieben. Gleichgewichtung ist nur als klar synthetischer Testfallback `V3-PLAN-INDEX-SYNTH-EQUAL-1` benannt; fehlende Inputs ohne diesen Fall bleiben offen. Interne Präzision/Anzeige auf zwei Dezimalstellen, Contribution-IDs pro Komponente/Monat und Deduplizierung von FX/Tarif/Umwelt/CPI sind festgelegt; mehrere Beiträge ohne versionierte Aggregationsformel bleiben `pending`. Keine Cent-/Geldrundung, BAB-, Lohn-, Vertrags-, Bestand- oder Istkostenmutation. |
| **L5 – MRO/Finanzierungsofferte** | **PASS** | Quote ist ausdrücklich unverbindlicher `indicative` Plan-/Verhandlungsdatensatz. „Für Verhandlung angenommen“ ist keine Kreditannahme; Vertragsschluss und Finanzereignis sind getrennt und später A03-geprüft. Quote benennt explizite Felder: beantragter Betrag/Währung, Laufzeit, Gültigkeit, Referenzsatz/-einheit/Datum/Quelle/Vintage/Stichtag, Marge sowie nominalen Jahres- und Periodensatz. Fehlende Felder ergeben `pending`. Referenzsatz-plus-Marge-Formel und Periodensatzableitung bleiben bis zur A03-Bestätigung von Methode, Periodik und Rundung offen; andernfalls sind Sätze explizite Inputs mit Provenienz. Keine Auszahlung, Schuld, Zins, Forderung oder Cashwirkung; kein Limit, Tilgung oder Auszahlungstermin; bestehende Kredite/Dispo bleiben unberührt. Dies ist Dokumenten-PASS, keine Kreditkonditions- oder Finanzierungsfreigabe. |

## Gemeinsame A03-Grenzen

- Plan-/Makroperiode und Angebotsindex sind keine operative Kosten- oder Rechnungsperiode. Für diese nichtbuchenden Planereignisse entsteht kein Rechnungsposten.
- `observedPeriod`, `publishedAt`, `effectiveFrom` und ETA bleiben getrennt von belegtem Leistungs-/Bewegungsdatum, operativer Kostenperiode, Rechnungsdatum, Fälligkeit und Zahlungstag.
- Konkrete Istkosten, Lohnzahlungen, Materialwerte, Wareneingangsbewertungen, WIP/Fertigwaren und COGS benötigen weiterhin A03-Evidenz und den gesonderten nichtbuchenden Abgleich aus dem Finance-Evidenzvertrag. Fehlende Belege sperren die Geldberechnung; Makroindizes liefern keine Ersatzkostensätze.
- D-0169 bleibt die einzige Gesamtanfragewirkung. L2-Export/Politik darf nur die Verteilung bei identischer Gesamtzahl ändern. Kein Index darf bestehende Verträge, angenommene Angebote, Kreditkonditionen oder Istsalden rückwirkend ändern.
- Die im Nachtrag genannten Werte bleiben synthetische Testannahmen. Der Re-Review bestätigt weder Quellenaktualität noch empirische Kalibrierung oder Rechtsgeltung.

## Ergebnis und Status

**PASS für die drei dokumentarischen CP-0354-Klarstellungsgates L2, L4 und L5.** Der vorherige NONPASS-Grund für fehlende Definitionen ist im Repository-Nachtrag behoben. Die verbleibenden offenen Bedingungen sind ausdrücklich als offene Eingaben oder spätere A03-Verantwortung ausgewiesen und werden nicht stillschweigend mit Defaults gefüllt.

T-0063 bleibt insgesamt IN_PROGRESS: Dieser Dokumentenreview setzt weder L2/L4/L5 in Runtime um noch löst er A08s Quellen-/Kalibrierungs- und Integrationslücken aus CP-0351. T-0065/T-0066/T-0067/T-0069 bleiben für operative Implementierung und Jahres-/Finanzreconciliation offen. Keine Kredit-, Kosten-, Bestands-, Bewertungs-, Steuer- oder Postingfreigabe.

## Nachweisrollen und Verifikation

- **Ausführung:** A03-Dokumenten-Re-Review gegen CP-0354, Nachtrag und aktuelle A03-Verträge.
- **Unabhängige QA:** nicht ausgeführt; liegt außerhalb des A03-Dokumentenreviews.
- **Tests:** nicht erforderlich und nicht ausgeführt; der Auftrag prüft reine Dokumentenlogik.
- **Browser-/Gerätetest:** nicht ausgeführt; keine UI-/Runtimeänderung.
- **Git:** Root/HEAD können in dieser Sitzung gelesen werden; `git status --short` scheitert weiterhin mit `fatal: this operation must be run in a work tree`. Daher keine Working-Tree-/Diff-Verifikation.
- **Whitespace:** nach Erstellung nur auf diesen Bericht und CP-0356 mit `git diff --no-index --check -- NUL <Datei>` geprüft; keine Whitespacefehler, nur erwartete LF/CRLF-Hinweise.
- **Commit/Push:** nicht ausgeführt.

**Nächster Schritt:** A01 kann das Dokumentengate für L2/L4/L5 als PASS koordinieren. Vor Implementierung finanzieller Folgen bleibt die erneute A03-Prüfung konkreter Runtime-/Ereignisfelder erforderlich; A09 prüft D-0169-Invarianz und Nichtmutation gegen den implementierten Pfad.
