# A03 – T-0069 Ein-Auftrags-Jahressmoke: Finance-Fachreview

**Status:** PASS im begrenzten D-0166-/D-0168-Scope; keine Jahresabschluss- oder Ledgerfreigabe  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goals/Ticket:** MG-002 / SLG-002.2 / SLG-002.5; T-0069 IN_PROGRESS  
**Bezug:** D-0157, D-0161–D-0168; A02-Bericht `a02-t0069-order-year-smoke-report.md`; CP-0328/CP-0329  
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Ergebnis

Der neue Harness folgt im geprüften Finance-Scope dem bestehenden V3-Szenariopfad: Eine einzige bereits angenommene Netto-R-Position wird erst nach Arbeitsgangabschluss, Lieferung und positiver Kundenentscheidung über den A03-Adapter in eine gekennzeichnete D-0166-Szenariorechnung überführt. Die Entscheidung ist mit `actorRole: customer` und der gebundenen Kundenpartei belegt; der Verkäufer löst die Abnahme nicht aus. Das Rechnungsdatum ist der 06.01.2027, das Entscheidungsdatum. Die zugrunde liegende letzte Arbeitsgangleistung liegt am selben Tag, daher entspricht der Fälligkeitsanker dem 06.01.2027. Bei inklusiver Ankertagszählung als Tag 1 fällt der 14. Kalendertag nach D-0013–D-0017/D-0165 auf den 19.01.2027.

Der D-0168-Eingang wird exakt am gespeicherten Fälligkeitstag ausgelöst. Der Harness prüft, dass der Eingang zur referenzierten Rechnung gehört, nur einmal entsteht und am Fälligkeitstag verbucht wird. Damit wird weder ein zweiter Erlös behauptet noch ein Cash-Gate auf den Kundeneingang gelegt. Die Regressionen des A03-Finance-Runtimes bestanden.

Die fortbestehenden Statuswerte `ready_for_delivery` und `pending_non_posting` widersprechen der Belegkette nicht: Der erste ist nach A02s Vertrag der Operations-/Fertigungsplanstatus. Lieferung und Kundenentscheidung werden separat in der Kunden-Evidence gespeichert; Rechnung und Zahlung werden separat im D-0166-/D-0168-Finanzzustand repräsentiert. Diese Pfade bilden keine gemeinsame Hauptbuch-/A03-Postingfreigabe ab. Für die UI empfiehlt A02 einen separaten Gesamt-Kundenprozessstatus aus bereits vorhandener Evidence-/Finanzprojektion, ohne den Operationsstatus umzuschreiben.

## Nachprüfungen

- `node prototype/v3-finance-runtime-regressions.mjs` — PASS.
- `node --check prototype/v3-year-order-smoke.mjs` — PASS.
- `git diff --check` auf Harness und Bericht — PASS.
- Root unabhängiger Jahres-Smoke-Rerun: 362 Tage / 12 Makromonate, ein Auftrag, Rechnungsfälligkeit und Zahlung am 19.01.2027 — PASS; Hash `0fe2d5c9bdac6c49a0bf0600c9d7722c54ecaffef2ee2db7cc3adcea6f85392b`.

## Grenzen

Dieses Review bestätigt ausschließlich die bestehende vereinfachte Simulation aus D-0166 und D-0168. Es bestätigt kein vollständiges Hauptbuch, keine steuerliche Abführung, keine Lieferanten-/Personal-/Raumkosten, keine COGS- oder Vorratsbewertung, keine periodische BAB-Ist-Abstimmung, keine Insolvenz-/Tragfähigkeitsprognose und keine Jahresreconciliation. Der einzelne Auftrag ist der vorbestehende Verlustfall mit −12,00 € Ergebnis nach BAB; er ist kein Jahresunternehmensergebnis. Der V3-Finance-Handoff bleibt ausdrücklich `pending_non_posting`.

**Review:** fachlich PASS im genannten Begrenzungsumfang. Browser-/Geräteprüfung durch A03 nicht ausgeführt; unabhängiger A09-Review des Jahressmokes steht separat aus. Keine Produktregel, Code-, Schema- oder Architekturänderung. Kein Commit oder Push.
