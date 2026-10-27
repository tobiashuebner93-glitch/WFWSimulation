# A03-Änderungsbericht: Abgleich mit bestätigten Finanzentscheidungen

Datum: 2026-10-26  
Agent: A03 – ACCOUNTING_FINANCE  
Adressat: A01 – MASTER_ORCHESTRATOR  
Bezug: MG-000 / SLG-000.2 / CP-0147 / CP-0148 / Decision Log D-0013 bis D-0119

## Ergebnis

Die A03-Finanzspezifikation und P0-Finanzkonsistenzprüfung wurden mit den bestätigten Decision-Log-Einträgen abgeglichen. Widersprechende Aussagen zu Zahlungszielen, Forderungs-/Verbindlichkeitstriggern, Kundeneingängen, Zahlungspriorität und Dunning, Darlehensplan, SimTAX, D3-/Personal-/CNC-Kosten, Materialeröffnung und CNC-Buchwert wurden berichtigt. CP-0147 blieb unverändert.

## Übernommene Entscheidungen

- Zahlungsziele, Fristanker und Kalenderzählung: D-0013 bis D-0020.
- Kundenforderung bei Rechnung; Lieferantenverbindlichkeit bei Wareneingang/Leistung; Kundeneingang am Fälligkeitstag ohne Cash-Gate: D-0110 bis D-0112.
- Spielerwahl der Zahlungsreihenfolge, wöchentliche Retries, acht Wiederholungsfehlschläge, Erinnerungs-/Mahnfristen und keine Pfändung/Liquidation nach formeller Mahnung in V1: D-0021 bis D-0029.
- Annuitätendarlehen mit sieben Jahren Restlaufzeit, monatlich, 30E/360, bestätigte Rundung/Zahlung und darlehensspezifischer Verzug/Verwertung: D-0030 bis D-0043. Rate und erster tatsächlicher Zahlungstermin bleiben offen.
- SimTAX-Bemessungs-/Rundungs-/Korrekturregeln und Lieferanten-Vorsteuer: D-0053 bis D-0059, D-0097, D-0113 bis D-0119.
- BAB-Sätze 15 % / 100 % / 10 %, bestätigte Payroll-/Arbeitgeberkosten und CNC-Kalkulationsbasis: D-0062 bis D-0076.
- E3 bleibt gleitender Durchschnitt; Stahl 2.000 kg mit Wert aus Vorjahresschluss: D-0090/91.
- CNC-Eröffnungsbuchwert 0 € ersetzt 40.000 €; Eröffnungsbilanz Aktiva/Passiva 55.300 €, Eigenkapital-Restposition 23.800 €: D-0099.

## Geänderte Dateien

- `docs/accounting/maschinenbau-mvp-finanzspezifikation.md` – veraltete offene Aussagen und Werte ersetzt; Eröffnungsbilanz, Darlehen, Zahlungslogik, SimTAX, BAB/Personal, Materialeröffnung berichtigt.
- `docs/accounting/p0-finanzkonsistenzpruefung.md` – als konsolidierte P0-Prüfung neu gefasst; enthält aktuellen Bilanzabgleich, bestätigte Regeln, Schnittstellen und verbleibende offene Parameter.
- `docs/accounting/a03-decision-log-abgleich-bericht.md` – dieser Änderungsbericht.
- `docs/agent-system/checkpoints/CP-0148.md` – neuer Arbeitscheckpoint.
- `docs/agent-system/collaboration-state.md` – Übergabestatus ergänzt.

Keine Code-, Schema-, Datenbank-, Supabase-, Dependency- oder Architekturänderung. D-0010, Decision Log und CP-0147 wurden nicht geändert. Architektur V0.2/ADRs bleiben PROPOSED. Kein Commit oder Push.

## Weiterhin offen / nächste Abstimmung

Konkrete Darlehensrate und erster tatsächlicher Termin; Dispositionskredit-Limit/Verfügbarkeit/Draw/Rückzahlung; A02-Ereigniszeitpunkte und Reihenfolge (einschließlich Retry-/Mahn-/Darlehensereignissen); Vorjahresschluss-Erzeugung und Stahlwertübergabe; nicht entschiedene laufende Kosten und weitere Kostenstellenzuordnungen. Keine Nutzer-Rückfrage ist für diese Dokumentationskorrektur erforderlich.

T-0008 bleibt bis zur dokumentierten Koordination IN_PROGRESS; T-0009 bleibt PENDING bis A02 seine Arbeit beginnt.

## Folgeabgleich Eröffnungsvorräte (CP-0154)

Der bestätigte Bilanzposten Vorräte beträgt insgesamt 12.800 €. Als einzelne bestätigte Menge ist Stahl mit 2.000 kg belegt; dessen Eröffnungswert stammt laut D-0091 aus dem bereitgestellten Vorjahresschluss. Der Stahlbetrag ist nicht vorliegend. Die bisherigen A02-Profilwerte Aluminium 800 kg/4.400 € und Norm-/Zukaufteile 1.000 Einheiten/2.000 € sind nicht als Eröffnungswerte bestätigt; D-0094–96 bestätigen Warengruppen, nicht Mengen/Werte.

Die Angabe 12.800 € widerspricht D-0091 nicht an sich, aber die Komponentenaddition ist mit den verfügbaren bestätigten Werten nicht prüfbar. Erforderlich ist eine wertmäßige Eröffnungsaufteilung je Vorratsgruppe samt bereitgestelltem Stahl-Vorjahresschlusswert. Es wurde weder 3,20 €/kg noch 6.400 € als Stahlwert angesetzt, noch ein Stahlrestbetrag abgeleitet.

Falls die bereitgestellte Aufteilung nicht 12.800 € ergibt, Rückfrage an A01 zur Nutzerentscheidung: „Welcher Eröffnungswert soll maßgeblich sein, wenn die belegte Summe der Einzelvorräte vom bestätigten Gesamtposten 12.800 € abweicht: der Gesamtposten oder die Summe der belegten Einzelwerte?“ Bis dahin keine Ersatzwerte festgelegt.
