# A03-Änderungsbericht: Offene P0-Finanzparameter

Datum: 2026-10-25  
Agent: A03 – ACCOUNTING_FINANCE  
Bezug: MG-000 / SLG-000.2 / T-0008 (A01-Koordination) / T-0009 (A02, PENDING) / CP-0031 bis CP-0034 / D-0010 / D-0011

## Ergebnis

Eine entscheidungsreife A03-Vorlage zu Zahlungszielen/Fälligkeit, eigenen Auszahlungen und Dunning, Maschinendarlehen, SimTAX, D3-BAB und laufenden Kosten wurde erstellt. Sie nennt dokumentierte Optionen, Auswirkungen auf Accounting/Simulation/Datenmodell, zuständige Rollen und präzise Nutzerfragen, ohne Optionen auszuwählen.

Die Finanzspezifikation wurde nur dokumentarisch präzisiert: konkurrierende, nicht entschiedene Fälligkeitsformeln werden sichtbar gemacht; D-0011 wird als bestätigte Kalenderregel einschließlich Wochenendverschiebung und V1-Feiertagsverzicht bezeichnet, während dessen A02-Übernahme weiterhin als ausstehend markiert ist. Die bestätigte SimTAX-Rechenform wird in § I benannt. D3 wird als statischer BAB-Umfang für V1 gekennzeichnet, ohne konkrete Pools oder Sätze als beschlossen abzuleiten. Die doppelte Forderungsausfall-Aussage in § C wurde zusammengeführt.

In der A03-P0-Finanzkonsistenzprüfung wurde der frühere 15 %/100 %/10 %-BAB-Ansatz als unbestätigter Arbeitsvorschlag klargestellt. Die ursprünglichen Zahlen bleiben als mögliche Diskussionsoption dokumentiert, nicht als Nutzerentscheidung oder Berechnungsgrundlage. Dort wurden außerdem die widersprüchliche Formulierung zur 14-/30-Tage-Formel und die verkürzte Cashbedingung beim Zahlungsversuch an den offenen Friststatus bzw. den bestätigten vollständigen Versuch mit dokumentiertem Fehlschlag angepasst.

## Weiterhin offen

- 14-/30-Tage-Fristanker je Vertragsrichtung; Kalender- oder Arbeitstage; Ankertagzählung; wirksames Ereignisdatum.
- Priorität konkurrierender eigener Fälligkeiten; Retry-Zeitpunkt/-Regeln; Dunning-Fristen/-Schwellen und etwaige Wirkungen. Pfändung/Liquidation: keine Kriterien oder Rechts-/Finanzfolgen festgelegt.
- Darlehenstilgung, Restlaufzeit/Endfälligkeit, Rate, Zahlungstermine, Zinsperiodik/-berechnung, Rundung und Fehlzahlungsverhalten.
- SimTAX-Basis, Halbcent-Konvention, Positionsebene, Anwendungsbereich und Korrekturen.
- BAB-Pools/-Stellen, Schlüssel/Sätze, Personal-/Maschinen-/Energiekosten, laufende Kostenwerte und Perioden-/Rundungszuordnung.

## Dateien und Grenzen

- Neu: `docs/accounting/a03-p0-finanzparameter-entscheidungsvorlage.md`
- Neu: dieser Änderungsbericht
- Aktualisiert: `docs/accounting/maschinenbau-mvp-finanzspezifikation.md`
- Aktualisiert: `docs/accounting/p0-finanzkonsistenzpruefung.md`
- Neu: `docs/agent-system/checkpoints/CP-0035.md`
- Aktualisiert: `docs/agent-system/collaboration-state.md`

D-0010, D-0011 und A02-/A04-Fachspezifikationen wurden nicht geändert. T-0009 bleibt PENDING; A02 hat D-0011 noch nicht übernommen. Die A02-Abstimmung über konkrete Zahlungsereignisse und Fälligkeit folgt nach dieser Übernahme und nach Nutzerentscheidung. Keine Implementierung, Datenbank-, Schema-, Supabase-, Dependency- oder Architekturänderung; Architektur V0.2 und ADRs bleiben PROPOSED.

`git diff --check` und `git status` werden nach Abschluss ausgeführt.
