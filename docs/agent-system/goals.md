# Goals – WFWSimulation

## Abgeschlossene Master Goals

### MG-000 – Agenten-Governance und technische Grundlage etablieren

Status: COMPLETED

Eine belastbare und nachvollziehbare Control Plane für Agenten, Goals, Tickets, Arbeitsstände, Checkpoints und Architekturentscheidungen wurde etabliert. SLG-000.1, SLG-000.2 und SLG-000.3 sind anhand ihrer dokumentierten Ergebnisse abgeschlossen. Die Architekturprüfung gab weder Architektur V0.2 noch eine ADR frei. Nachweise: [CP-0188](checkpoints/MCP-2026103001.md#cp-0188).

### MG-001 – Browser-V1-Playtestfehler beheben

Status: COMPLETED (2026-10-27; CP-0199)

Die vom Nutzer beim manuellen Spieltest gemeldeten Bedienungs-, Kapazitäts-, Vertrags-, Personal- und Urlaubsfehler wurden behoben und eine erneut testbare Browser-Version gesichert. Die V1-Playtestkorrekturen waren keine Abnahme der weitergehenden Realismus- oder WBQ/HQ-Lernziele. T-0022 wurde nach Nutzerbestätigung der manuellen Prüfung abgeschlossen; T-0028 ist mit CP-0198 abgeschlossen. Nachweise: CP-0190 und CP-0199.

## Goal-Regeln

Nur Tickets des aktuellen Master Goals und Second-Level Goals gehören zum aktiven Arbeitskontext. Abgeschlossene Ziele und Tickets bleiben historisch erhalten. Ein Goal darf erst als COMPLETED markiert werden, wenn seine Ergebnisse dauerhaft dokumentiert und geprüft wurden.

---

# V2–V12-Qualitätsziele (MG-002)

Status: IN_PROGRESS
Master Goal: MG-002
Agentenreviews: A01–A12, 2026-10-29
Autoritativer Zielplan: [V2–V12 Zielkarte](v2-v12-goal-map.md)

## Neu gefasstes Gesamtziel

Ein mobil nutzbares, browserbasiertes Wirtschaftsspiel entwickeln, in dem Lernende ein Unternehmen nachvollziehbar führen und Wirtschaftsfachwirt-Kompetenzen auf WBQ-/HQ-Niveau an realen Spielentscheidungen anwenden. Jedes Fach wird als vollständige spielbare Handlungskette in die Unternehmenssimulation integriert; Lernkarten, Tooltips, Übungsfälle und Prüfungsformate vertiefen dieselben Kompetenzen und verweisen wechselseitig auf konkrete Spielkontexte. Regeln, Ereignisse, Kennzahlen und Wirkungen sind nachvollziehbar; Quellen, Recht, fachliche Ableitungen und Szenariovereinfachungen sind getrennt. Kein Anspruch auf Prüfungssiegel, Rechtsberatung oder vollständige Unternehmenssoftware.

Für alle V gilt vor Abschluss ein Rechtsaktualitäts-Gate nach D-0161 und dem [Rechtsrahmenregister](../legal/legal-framework-register.md): aktuelle Rechtslage unabhängig vom Spieljahr prüfen und erkannte Änderungen vor Release in allen betroffenen Regeln, Oberflächen, Lerninhalten und Tests aktualisieren. V2 definiert das Qualitäts- und Lernkontextfundament. Der Fahrplan ordnet V3 Volks- und Betriebswirtschaft einschließlich Gründung, Rechtsformen und Zusammenschlüssen zu; V4 Rechnungswesen, V5 Recht und Steuern, V6 Unternehmensführung; V7 Betriebliches Management, V8 Investition/Finanzierung/Rechnungswesen/Controlling, V9 Logistik, V10 Marketing/Vertrieb, V11 Führung/Zusammenarbeit und V12 fachübergreifende Prüfung/Transfer. Jedes Fach wird als spielbare Handlungskette abgenommen; Lernkarten allein erfüllen kein Fachziel. Der Fragen-/Ereigniskatalog wird versionsübergreifend gepflegt und die Ereignisfragenvision in V12 integriert. Vollständige Kriterien, Fragen-/Ereignisumfang und Agentenbeiträge: [v2-v12-goal-map.md](v2-v12-goal-map.md).

## V2-Qualitätsziel und Abnahmestand
**Status: ABGENOMMEN / RELEASE-COMMITTEE-PASS.** G01–G11 sind für Releasecommit `d18ec35` mit Quellcommit `7a89210` und den darin enthaltenen Paketartefakten belegt. 16 Regressionen, 365-Tage-Jahressmoke, A09-Review und A10-Paketprüfung bestanden. T-0062 ist COMPLETED; der Push nach `origin/main` wurde in CP-0274 dokumentiert. CP-0273 ist der Committee-Nachweis, CP-0274 der spätere Push-/Koordinierungsnachweis.
## Status

- SLG-002.1 – IHK-Rahmen/Kompetenzlandkarte: COMPLETED (CP-0202).
- SLG-002.2 – Erklärbare Unternehmens-/Finanzsimulation: IN_PROGRESS; Jahressolvabilität im aktuellen Jahressmoke bestanden (CP-0253), T-0040 ist abgeschlossen; weitere Fach- und Qualitätsabnahmen bleiben offen.
- SLG-002.3 – Lernkarten/Wiederholung: COMPLETED (CP-0224); die Kartenbibliothek ist noch kein vollständiger Fachprozess.
- SLG-002.4 – Prüfungsübungen und spielbezogene Lernrückblicke: IN_PROGRESS über T-0109; Inhalte nur aus freigegebenen Quellen oder unabhängig entwickelt.
- SLG-002.5 – Daten-, Architektur-, Qualitäts- und Auslieferungsbasis: IN_PROGRESS über T-0110 (Inventarisierung); Architektur, Schema und Persistenz bleiben PROPOSED.

## Release- und Qualitätskriterien

Kein Fachrelease vor Quellen-/Kompetenzprüfung, vollständigem Spielkreislauf, messbarer und rückverfolgbarer Wirkung, plausiblen Übungsaufgaben, Regressionen sowie explorativem mobilem Browserreview. Kein V2-Release-Claim, bis Jahres-Solvabilität und Browser-/Wiederherstellungsgates bestanden sind. V3–V12 sind Zielplanung, keine Behauptung, dass diese Inhalte bereits umgesetzt wurden.

### T-0069 V3-Minimalgate – bestätigte Scope-Grenze (D-0186)

Für den Mindestziel-PASS werden nur Finanzflüsse verlangt, die im geprüften V3-Build tatsächlich implementiert und im Jahreslauf ausgelöst werden; diese müssen vollständig, periodenrichtig und centgenau abgestimmt sein. Nicht implementierte oder bestätigungsgemäß vertagte Flüsse bleiben ausdrücklich PENDING und werden weder als Null noch als bestandener Jahresabschluss ausgegeben. D-0178 hält WIP-/Fertigwarenbewertung und COGS bis zur BAB-/Kostenpoollösung zurück. Payroll, gesetzliche Steuerabführung, Finanzierung/Dispo, Zinsen und vollständiger GL-Abschluss sind sichtbar als ausstehend zu führen, solange sie nicht implementiert und ausgelöst sind. Ein PASS behauptet keine vollständige Finanzbuchhaltung, keinen Jahresgewinn und keine Solvenz. A03 bestimmt den fachlich prüfbaren Umfang; A09 prüft ihn unabhängig. Siehe D-0186.
### V3-Releaseprüfung 10.11.2026 – D-0188

Der Nutzer erlässt den erneuten 12-Monats-Smoke für den aktuellen V3-Release. V3-12/Jahresanteil ist WAIVED und kein neuer PASS. Die übrigen Mindestziele und Rechts-/Browser-/Paketgates bleiben verbindlich. T-0127 bündelt die weitere CPU-/RAM-Optimierung nach Commit/Push. V3-10 (drei Unternehmensausrichtungen, je zwei belegte Kennzahlen und Zielkonflikte) wird vor Abschluss ergänzt; die Rechtsformzuordnung nach D-0163/0164 ist noch zur Nutzerentscheidung vorgelegt. Aktueller Abgleich: CP-0566.

**Fortschreibung D-0189 (10.11.2026):** Nutzer bestätigt AG/eG/KGaA/GmbH & Co. KGaA für V6. Die vor V3 erforderliche Versionszuordnung ist entschieden; GmbH & Co. KG bleibt V3.

**V3-Abnahmestand CP-0566 (10.11.2026):** V3-Mindestumfang validiert mit D-0188-Ausnahme (Jahres-Smoke WAIVED, keine 10/10-Testbehauptung). V3-10/T-0128 ist nach A11-Review und Jan/Feb/März-Kontrolltests PASS; D-0189 geklärt. Vollständige Matrix siehe test-reports/a01-v3-release-validation-cp0566.md. Commit/Push-Verifikation folgt. MG-002 bleibt als versionsübergreifendes Gesamtziel IN_PROGRESS.
