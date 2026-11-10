# A03 – Review der T-0066/T-0067-Mindestzieldefinition

**Status:** CONDITIONAL PASS – Kriterien fachlich zulässig für die nichtbuchende Minimalstufe; Umsetzungsreview offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agentenrolle:** A03 – ACCOUNTING_FINANCE (fachlicher Selbstreview durch A01 im A03-Rollenrahmen; keine unabhängige zweite Person)
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0066 / T-0067
**Profil:** V3 Shared Run ab 04.01.2027
**Entscheidungen:** D-0162, D-0165–D-0169
**Vorgänger:** CP-0437; A03 Evidenzvertrag CP-0341/0344

## Reviewumfang und Befund

Geprüft wurden die messbaren Mindestziele für T-0066/T-0067 gegen D-0162, den T-0066-Simulationsrahmen und den A03-Evidenz-/Reconciliation-Vertrag. Die Definition ist als eng begrenztes, **nichtbuchendes** Reviewziel zulässig, wenn die folgenden Präzisierungen gelten:

1. Positive und negative Produktergebnisse aus `estimateV3Product` sind Planwerte auf expliziter Preis-/Kostenbasis. Sie dürfen nicht als Istgewinn, realisierte Rentabilität oder Cashwirkung bezeichnet werden.
2. Für belegte physische Bestandsmengen gilt Anfang + Zugänge − Verbrauch/Absatz = Ende. Plan-/Istwerte bleiben getrennt; fehlende Belege führen zu `pending_*`, nicht zu Null oder einem Plankostensatz.
3. Fertigwarenabgang darf nur mit ausdrücklichem Mengen- und Käufer-/Vorgangsnachweis erfolgen. Geld-COGS bleibt `pending_cogs_cost_basis`, solange die Bewertungsmethode und die Kostenbasis nicht ausdrücklich A03-abgedeckt sind.
4. BAB-Verteilung verteilt belegte Kostenpools und erzeugt keine zusätzlichen Kosten. D-0162-Restcent, stabile Kostenstellen-ID, gemeinsame physische Ratebasis sowie exakte Poolreconciliation sind unverändert.
5. Die Kriterien erteilen weder Posting-, Steuer-, Bewertungs-, Schema- noch Architekturfreigabe. Der gemeinsame Finance-Evidenzvertrag bleibt verbindlich.

Die Zieldefinition wurde daraufhin präzisiert: T-0066 vergleicht explizit planwirtschaftlich positiven und negativen Fall; das ist kein Ist-Erfolg. Die eigenständige Code-/Finance-Re-Review nach Umsetzung bleibt erforderlich.

## Ergebnis und Grenzen

**CONDITIONAL PASS** für die Zieldefinition im nichtbuchenden Minimalumfang. Nicht geprüft oder bestanden sind Runtime, T-0066-Produktabsatz, A03-Istkostenadapter, BAB-Integration, UI, Replay/Restore, A09-Adversarialreview und Browser-/Mobilpfad. Keine Bewertungsmethode oder Buchungspolitik wurde neu entschieden. A03-Gesamtticket bleibt offen.

## Übergabe

**Nächster Adressat:** A02 – SIMULATION: implementiere den physischen Eigenprodukt-Absatz-/Bestandsabgang an einem belegten, angenommenen V3-Marktauftrag; binde Buyer/Anfrage/Angebot/Entscheidung/Datum/Menge/Quelle stabil; verhindere Überverkauf; replay/restore fail-closed; COGS als `pending` ohne A03-freigegebene Bewertung. A03 prüft danach die Runtimeänderung erneut. A05-UI und A09 unabhängige QA folgen nach fachlichem Re-Review.
