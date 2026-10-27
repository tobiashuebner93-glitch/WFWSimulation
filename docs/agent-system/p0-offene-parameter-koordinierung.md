# P0 – Koordinierung offener Fachparameter

Stand: 2026-10-27  
Owner: A01 MASTER_ORCHESTRATOR  
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0009 / CP-0147 bis CP-0156

## Zweck und Grenzen

Dieses Dokument ist der aktuelle Koordinierungsstand, keine Entscheidungsquelle. Nutzerentscheidungen werden ausschließlich aus `decision-log.md` übernommen. Es trifft keine neue Produkt-, Steuer-, Rechts- oder Architekturentscheidung. D-0010 bleibt unverändert; Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED. CP-0147 bleibt als historischer Nachweis unverändert.

## Aktuell verbindliche Regeln

- Zahlungsanker, Zahlungsziele, Kalendertagszählung und Ankertagszählung gemäß D-0013 bis D-0020.
- Kundenzahlung am vertraglichen Fälligkeitstag ohne eigenes Cash-Gate gemäß D-0110; Kundenforderung/Auftragserlös bei freigegebener Rechnung gemäß D-0112; Lieferantenverbindlichkeit bei akzeptiertem Eingang/bestätigter Leistung gemäß D-0111.
- Eigene Zahlungspriorität, wöchentliche Wiederholungsversuche, acht Retry-Fehlschläge, Zahlungserinnerung/Mahnung und V1-Eskalationsgrenze gemäß D-0021 bis D-0029.
- Maschinendarlehen: Annuität, sieben Jahre Restlaufzeit, monatliche Zahlung am letzten Geschäftstag, fest 5 % nominal, 30E/360 auf Restschuld, vereinbarte Zins-/Rundungs-/Verzugsfolgen gemäß D-0030 bis D-0043. **Offen bleiben konkrete Rate und erster tatsächlicher Zahlungstermin.**
- SimTAX-, Vorsteuer-, Perioden- und Korrekturregeln gemäß D-0053 bis D-0059, D-0097 und D-0113 bis D-0119.
- BAB-, Personal- und CNC-Kalkulationsregeln gemäß D-0062 bis D-0076; Materialbewertung/Startwerte und CNC-Buchwert gemäß D-0090 bis D-0099.
- D-0001 bis D-0009 und ADR-001 bis ADR-008 bleiben PROPOSED. Diese Koordinierung ist keine Architektur- oder Implementierungsfreigabe.

## Tatsächlich offene Punkte und Abhängigkeiten

| Offener Punkt | Was ist entschieden / was bleibt offen | Zuständigkeit / Abhängigkeit |
|---|---|---|
| A02-Übernahme des V1-Kalenders | D-0011 ist in der A02-Spezifikation übernommen; T-0009 ist durch CP-0150 abgeschlossen. | Keine offene Kalenderentscheidung. |
| A02/A03-Ereigniszeitpunkte und Reihenfolge | Phase 8 ist festgelegt. Nutzerentscheidung bleibt: Bei knappem Cash, soll ein am selben Tag fälliger Kundeneingang vor den vom Spieler priorisierten eigenen Vollzahlungsversuchen verfügbar sein? Die übrige Reihenfolge zeitgleicher Retry-/Erinnerungs-/Mahnereignisse, Zählung der Darlehensverwertung und Periodenzuordnung bei Monatswechsel bleiben offen. | A02 autoritativ für Simulation; A03 für Finanzwirkung. T-0008 koordiniert die Fachabstimmung. Nutzerfrage wird nach der Sicherung einzeln vorgelegt; bis dahin keine Tie-Break-Regel ergänzen (CP-0155). |
| Darlehensrate | Vertragsform und Berechnungsregeln stehen fest; konkrete Annuitäten-/Anfangsrate ist offen. | A03 fachlich; Nutzerparameter ggf. erforderlich; A02 terminiert. |
| Erster tatsächlicher Darlehenstermin | Monatsrhythmus und letzter Geschäftstag als Fälligkeit stehen fest; erster tatsächlicher Zahlungstermin bleibt offen. | A03/A02, nötigenfalls Nutzerklärung. |
| Dispositionskredit | Zinsregel gemäß D-0023 und Option gemäß D-0021 sind festgelegt; Limit, Verfügbarkeit, Ziehung und Rückzahlung bleiben offen. | A03 fachlich, A02 Ereignisumsetzung, Nutzer bei Produktparametern. |
| Vorratsaufteilung / Vorjahresschluss | 12.800 € Gesamtvorräte bestätigt; Einzelbewertungen je Gruppe fehlen, darunter Stahlwert aus bereitgestelltem Vorjahresschluss. A02/A03 haben keine Differenz abgeleitet (CP-0154/0155). Die bedingte Rückfrage ist erst bei belegter Abweichung zu stellen. | Bereitstellung der Einzelwerte/Vorjahresschluss; A03 prüft Bilanzabgleich, A02 übernimmt den Stahlwert ins Startprofil. |
| Laufende Kosten und weitere BAB-Zuordnungen | Bestätigte Zuschläge, Lohnwerte und CNC-BAB-Basis bleiben verbindlich; weitere konkrete laufende Kosten sowie nicht entschiedene Kostenstellen-/Periodenzuordnungen sind offen. | A03 fachlich; A02 Zeit-/Verbrauchsbezug; Nutzer für nicht belegte Produktwerte. |
| A02-Startprofilabgleich | Abgeschlossen: CNC-Eröffnungsbuchwert 0 € gemäß D-0099; der aktive Stahlpreis 3,20 €/kg ist entfernt. A02 führt Stahl mit 2.000 kg und ohne Wertannahme; dessen Eröffnungswert kommt aus dem bereitgestellten Vorjahresschluss (CP-0153). | A02-Spezifikation berichtigt; Bewertung bleibt A03-Fachverantwortung. |
| Kundenverhaltensparameter | V1-Zahlung am Fälligkeitstag ist entschieden; konkrete Verspätungsereignisse/Parameter bleiben offen. | A02 Simulation; A03 Finanzwirkung; Produktwerte gegebenenfalls Nutzerentscheidung. |
| SimTAX-Fehlererkennungsereignisse | §153-AO-Ablauf und Ereignisauslöser sind entschieden; welche konkreten Ereignisse Fehler aufdecken bleibt offen. | A02/A03, spätere Ereignisspezifikation. |
| MRO-/Inflationsfortschreibung | EZB-MRO-Referenz und V1-Zinskurve sind festgelegt; Ableitung des zukünftigen MRO-Pfads anhand Inflation und weitere V2-Faktoren bleiben offen. | A08/A03 gemäß Fachumfang; keine V1-Defaultwerte ergänzen. |
| A04-Abgleich | A04 hat den Datenmodellabgleich gegen CP-0148 und CP-0150 mit CP-0151 abgeschlossen. | Dokumentarischer Abgleich liegt vor; keine Schemafreigabe. |

## Status der A03-Konsolidierung

A03 hat mit CP-0148 die Finanzspezifikation und P0-Finanzkonsistenzprüfung gegen den Decision Log abgeglichen. A02 hat D-0011 unter T-0009 übernommen (CP-0150) und Startprofilkorrekturen gemäß D-0091/D-0099 vorgenommen (CP-0153). A04 hat das Datenmodell gegen D-0011 bis D-0119, CP-0148 und CP-0150 abgeglichen (CP-0151). A03 hat den Gesamtvorratswert ohne unbestätigte Komponentenwerte dokumentiert (CP-0154); A02/A03 haben Ereignis- und Periodenabhängigkeiten abgeglichen (CP-0155). Der konsolidierte Bilanzwert zum 01.01.2027 beträgt nach D-0099 55.300 € Aktiva und Passiva; CNC-Buchwert 0 €, Eigenkapital-Restposition 23.800 €. A03-Bericht: [A03-Abgleich](../accounting/a03-decision-log-abgleich-bericht.md); A04-Bericht: [A04-Abgleich](../database/a04-cp-0148-decision-log-abgleich-bericht.md); A02-Bericht: [T-0009-Änderungsbericht](../simulation/a02-t0009-d0011-aenderungsbericht.md).

## Steuerungsstatus und nächste Schritte

- T-0008 bleibt IN_PROGRESS und dient nur der Koordination.
- T-0009 ist nach A02-Arbeitsbeginn und CP-0150 COMPLETED; verbleibende A02/A03-Ereignisabstimmungen sind getrennte Koordinierungsarbeit unter T-0008.
- T-0010 und T-0011 bleiben gemäß Ticket Board nach ihren Abhängigkeiten PENDING.
- A02-Berichte/CP-0150 und CP-0153, A04-Bericht/CP-0151 sowie A03-Berichte/CP-0148 und CP-0154 liegen vor. Der überholte CNC-Buchwert und der unbestätigte Stahlpreis wurden aus aktiven A02-Startwerten entfernt. CP-0155 dokumentiert eine noch an den Nutzer zu richtende Frage zur Reihenfolge gleichentägiger Kundeneingänge und eigener Auszahlungen; weitere Ereignis-/Periodendetails und belegte Vorratskomponenten bleiben offen.
- A02/A03 haben die Ereignis- und Periodenabhängigkeiten in CP-0155 dokumentiert; sie sind nicht sämtlich entschieden. A01 hat die aktiven Steuerungs- und Fachunterlagen gegen Decision Log und CP-0148 bis CP-0155 geprüft. Die outcome-kritische Nutzerfrage bleibt bis nach der Sicherung zurückgestellt. Die Dokumentationsvalidierung ist bestanden; CP-0156 hält den Sicherungsstand fest. Ein klar benannter Dokumentations-Commit ist vorbereitet; Push ausschließlich über GitHub Desktop.
- Offene Nutzerfragen werden erst nach der Sicherung wieder einzeln gestellt.

## Quellen und Provenienz

- [Decision Log](decision-log.md), insbesondere D-0010 bis D-0119.
- [CP-0147](checkpoints/CP-0147.md) bleibt historischer Nachweis der damaligen Nutzerentscheidung.
- [CP-0148](checkpoints/CP-0148.md) dokumentiert den A03-Finanzabgleich.
- [CP-0149](checkpoints/CP-0149.md) dokumentiert den damaligen A01-Koordinierungsstand.
- [CP-0150](checkpoints/CP-0150.md) dokumentiert A02s abgeschlossene T-0009-Arbeit.
- [CP-0151](checkpoints/CP-0151.md) dokumentiert A04s Datenmodellabgleich.
- [CP-0152](checkpoints/CP-0152.md) dokumentiert den historischen Validierungsbefund; die Startprofilabweichungen wurden danach durch CP-0153 korrigiert.
- [CP-0153](checkpoints/CP-0153.md) dokumentiert die A02-Startprofilkorrektur.
- [CP-0154](checkpoints/CP-0154.md) dokumentiert den offenen Komponentenabgleich der 12.800 € Vorräte.
- [CP-0155](checkpoints/CP-0155.md) dokumentiert die A02/A03-Ereignis- und Periodenabstimmung.
- [CP-0156](checkpoints/CP-0156.md) dokumentiert die bestandene Gesamtvalidierung und den Sicherungsstand.
- CP-0020 fehlt weiterhin im Checkout; sein Inhalt wurde nicht rekonstruiert.