# A03-Fachreview – A02-Unternehmenswirkungsvertrag L0–L6

**Status:** NONPASS für Implementierungsreife; Einzelgates siehe unten
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Datum:** 31.10.2026
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063, mit Übergaben an T-0065, T-0066, T-0067 und T-0069
**Gegenstand:** `docs/simulation/a02-t0063-v3-unternehmenswirkungsvertrag-entwurf.md`
**Vorgänger:** CP-0351, CP-0352, CP-0353; D-0161–D-0169, insbesondere D-0162, D-0163 und D-0169

## Auftrag und Preflight

Vor dem Review wurden Repository-`AGENTS.md`, Agentenstruktur und Rechtekarte, Goals, Ticket-Board, Collaboration State, der aktive T-0063-Stand, Decision Log/D-0169, CP-0351 bis CP-0353, A02s Wirkungsvertrag sowie A03s Finanz-Handoff-Matrix, Finanzschnittstellenpaket und nichtbuchender Evidenzvertrag samt CP-0344-Nachtrag gelesen. CP-0354 und dieser Bericht existierten vor der Bearbeitung nicht.

Profilbasis: gemeinsamer V3-Run ab 04.01.2027; V1/V2 bleiben unberührt. D-0169 ist nur der synthetische Wochenanfragekanal mit 0,00 € direkter Finanzwirkung. CP-0352 ist ein begrenzter D-0169-PASS, keine Freigabe für Unternehmensbuchführung. Die A03-Akzeptanzbasis verlangt Plan-/Vertrag-/Isttrennung, belegte Quelle/Menge/Einheit/Datum/Periode/Kostenbasis, Snapshot und Idempotenzreferenz. Fehlende Angaben bleiben offen; weder BAB noch D-0169 erzeugen Kosten.

## Einzelgates

| Los | Finanzgrenze / Prüfung | Gate | Präzise Bedingung oder Korrektur vor Implementierung |
|---|---|---|---|
| **L0 – Baseline/Replay** | „Anfragen → gewonnene Arbeit → geplante Stunden → verfügbare Stunden → Auslastung“ als Plan-/Betriebskennzahlen; keine Finanzierung oder Buchung. Gemeinsames Eventschema markiert `accountingClass: information_plan` und `directFinanceEffect: false`. | **PASS, nichtbuchend** | Jede Kennzahl als Beobachtung/Plan ausweisen. Gewonnener Auftrag darf nur über die belegte Angebotsannahme Vertragsstatus erhalten; weder Stunden noch Auslastung werden als Istkosten oder Rechnung gebucht. Replays bleiben einmalig. |
| **L1 – Phasen/Auslastung** | Aktivitätslücken −3/−1/+1/+3 pp greifen über D-0169 nur in den Anfragekanal ein; reale Kapazität wird aus Personal-/Maschinenplanung abgeleitet. | **PASS mit Implementierungsbedingung** | Die vier Werte bleiben explizit synthetische Szenariowerte. Keine zweite Phasenmultiplikation, kein Auto-Hire/Überstundenbonus. Auftragseingang, Angebotspreis, Kosten, Lohn, Forderung und Cash bleiben von diesem Phasenindikator unberührt. Planstunden sind keine `actual_evidence`. |
| **L2 – Außenwirtschaft** | FX wirkt auf einen Planindex importexponierter neuer Beschaffung; Exportchance nur auf Segmentverteilung bei unveränderter Gesamtzahl; Lieferstörung auf ETA einer bezeichneten neuen Bestellung. | **NONPASS für Umsetzungsreife; nichtbuchender Rahmen PASS** | Für FX fehlen Währungspaar/Notierung, Umrechnungsrichtung und Basis-/Vergleichsperiode, damit aus EZB-Referenzkurs und `importCostIndex` kein Vorzeichenfehler entsteht. „Neue Beschaffung“ ist als offene Plananfrage/-bestellung von bereits angenommenem Lieferantenvertrag und Istrechnung abzugrenzen. Liefer-ETA darf bei tatsächlichem Wareneingang physische Menge verändern, aber keinen Geldwert, Rechnungsbetrag oder COGS ohne separate belegte A03-Evidenz erzeugen. Exportsegment braucht stabile Segment-/Exposurequelle; Gesamtanfragen müssen D-0169-invariant bleiben. |
| **L3 – Arbeitsmarkt/Tarif/Umwelt** | Skillverfügbarkeit, Lohnplanindex und Prozessintensität sind Plan-/Ressourcenwerte. Tarif- und Umweltwirkung sind nicht automatisch Auszahlung, Abgabe, Förderung oder bestehende Vertragsänderung. | **PASS, nichtbuchend** | Personalbestand, Lohnverträge, Lohnlauf, Energiekosten und bestehende Tarif-/Lieferverträge dürfen sich nicht durch Indikatoränderung ändern. Ein späterer Lohn- oder Energie-Istbetrag braucht Quelle, Leistungsdatum, Einheit/Menge, Kostensatz, Periode und A03-Prüfung nach Evidenzvertrag. `+1 %` Lohnindex und `±2 %` Prozessintensität sind nur versionierte synthetische Testwerte, nicht geltendes Recht oder Istkosten. |
| **L4 – Inflation/Business-Cost-Index** | CPI/VPI bleibt Makroindikator; Business-Input-, Lohn- und Beschaffungsindizes sind ausdrücklich getrennte Planindizes. Pass-through ist nur Planwirkung. | **NONPASS für Kosten-/BAB-Integration; nichtbuchender Rahmen PASS** | Der Entwurf muss für einen künftigen Planindex Basisperiode, Basiswert, Kostengruppengewichte/Einheiten, Quellen-/Vintage oder synthetische Parameter-ID, Rundung und Komponentendeduplizierung explizit festhalten. `25 %` Pass-through und ±2 %/Monat sind Vorschlags-/Testparameter, keine freigegebene Kostenrate. Sie dürfen weder offene Verbindlichkeiten noch Rechnungen, Bestandswerte, BAB-Ausgangskosten oder akzeptierte Vertragssnapshots rückwirkend verändern. BAB verteilt nur belegte Kosten und erzeugt keinen Aufwand. |
| **L5 – MRO/Finanzierungsofferte** | MRO darf nur bei explizit angefragter neuer Finanzierung eine indikative Kondition beeinflussen; bestehende Kreditverträge bleiben unverändert. | **NONPASS für Finanzschnittstellenfreigabe; nichtbuchender Rahmen PASS** | „Indikative Finanzierungsofferte“ als unverbindlicher Plan-/Verhandlungsdatensatz von angenommenem Kreditvertrag trennen. Kein Kreditbetrag, keine Verbindlichkeit, Auszahlung, Zinsaufwand oder Cashwirkung aus MRO, Quote oder Quote-Annahme ohne gesondertes A03-geprüftes Vertrags-/Finanzereignis. Quote muss Laufzeit/Gültigkeit, Bezugsbetrag, Referenzsatz, Marge, nominalen Periodensatz und Quelle/Stand als offene bzw. explizite Eingaben ausweisen; A02 setzt weder Zinssatz noch Tilgung, Kreditlimit oder Auszahlungsdatum. `±0,25 pp` bleibt rein synthetischer Testimpuls. D-0163 und der A03-Finanzierungsschnittstellenvertrag verlangen Altvertrags-Schutz. |
| **L6 – Politikfelder/Lernen** | Fiskal-, Wachstums-, Nachfrage- und Angebotspolitik werden als Chancen-/Planindikatoren angezeigt; `effectGroupId` schützt vor Doppelzählung. | **PASS, nichtbuchend** | Keine automatische Steuer, Förderung, Zuschussforderung, Einlage, Lohnzahlung, Kapazität oder Umsatz. Bei gemeinsamem Indikator/Maßnahmenziel eine Wirkung nur einmal führen. Segmentanteile dürfen sich ändern, Gesamtanfragen nicht zusätzlich zu D-0169 erhöhen. Wirkungen mit Quelle bzw. expliziter Szenariokennung zeigen. |

## Gemeinsame Plan-/Ist-, Perioden- und Ereignisabgrenzung

1. Im aktuellen Losumfang ist für L0–L6 **kein Finanzereignis zu erwarten**: erwarteter direkter Finanzbetrag jeweils 0,00 €. Das Eventformat muss diese Nullwirkung sichtbar belassen; eine Makro-/Plan-Eventreferenz ist keine Finanzquellreferenz.
2. `observedPeriod`, `publishedAt` und `effectiveFrom` sind Makro-/Planzeitangaben. Sie ersetzen weder tatsächliches Ereignis-/Leistungsdatum noch Rechnungs-, Fälligkeits- oder Zahlungsdatum. Für rein informative Planereignisse gilt keine Rechnungsperiode (`invoicePeriod: not_applicable` bzw. gleich klare Dokumentation); es darf kein operativer Kostenmonat aus Makroperioden abgeleitet werden.
3. Für zukünftige A02-Istzeit-, Material-, Wareneingangs- oder Lohnbelege ist der A03-Evidenzvertrag anzuwenden: Quelle/Beleg, stabile Ereignisreferenz, tatsächliches Leistungs-/Bewegungsdatum, Kalendermonat, Menge/Einheit, Kostensatzbasis, BAB-Version/Kostenstelle, Plan-/Vertragssnapshot, Bestand vorher/nachher und Idempotenz-/Korrekturbezug. Fehlendes: `pending_*`; Widerspruch: `rejected_*`. `ready_non_posting` bleibt keine Postingfreigabe.
4. Angebot, Preisänderung, Planindex, BAB-Verteilung und Kreditquote dürfen angenommene Vertragskonditionen, abgeschlossene Istwerte, offene Rechnungen oder bestehende Kredite nicht rückwirkend ändern. Neue Finanzwirkung braucht eine eigene explizite Vertrags-/Leistungs-/Finanzquelle, A03-Autorisierung und Reconciliation.
5. Doppelzählung vermeiden: D-0169 ist der einzige Gesamtanfragefaktor. Außenwirtschafts-/Politikimpulse können höchstens bei unveränderter Gesamtzahl die Segmentverteilung verändern. FX, Tarif, Umwelt und CPI dürfen dieselbe Business-Input-/Lohnkomponente nicht doppelt verändern. BAB-Verteilung ist eine Sicht auf vorhandene Istkosten, kein zweiter Aufwand.

## Finanzfachlich vertretbare Vorschlagsparameter

Als **synthetische, versionierte, nichtbuchende Testszenarien** sind aus A03-Sicht vertretbar: Aktivitätslücken −3/−1/+1/+3 pp für L1; neutrale Basis 100; FX-Stress ±5 % mit vorgeschlagenem Planpass-through; Exportsegmentimpuls ±5 % bei gleichbleibender Gesamtzahl; einzelne Lieferverzögerung +2 Kalendertage; MRO-Sensitivität ±0,25 pp; Lohnindex +1 %; Input-/Politik-/Prozessimpulse bis ±2 % und 25-%-Planpass-through. Diese Werte sind weder empirisch belegt noch allgemeine Branchenwerte und nicht automatisch in Runtime zu übernehmen.

Sie blockieren bzw. benötigen vor Finanzimplementierung die obigen Definitionen, sobald sie Währung, Rechnung/Kostenbasis, BAB, realen Lieferantenvorgang, Lohnabrechnung, bestehendes Darlehen oder neuen Kreditvertrag berühren. Keine dieser Zahlen begründet für sich eine tatsächliche Kosten-, Forderungs-, Steuer-, Bestands- oder Cashwirkung.

## Gesamtergebnis und Übergabe

**Gesamtstatus NONPASS für die Implementierungs-/Integrationsfreigabe.** Die nichtbuchende Grundgrenze ist tragfähig; L2, L4 und L5 brauchen die benannten Ergänzungen, bevor ihre potenziellen Finanzschnittstellen implementiert werden. L0/L1/L3/L6 sind unter den expliziten Grenzen umsetzbar, aber kein Los erhält hiermit Posting- oder Produktfreigabe. T-0063 und die abhängigen Finanz-/Jahresgates T-0065/T-0066/T-0067/T-0069 bleiben offen.

**Empfohlene Folgeaufträge an A02:** (1) enger Nachtrag zum L2-Inputvertrag (Währungspaar/Notierung, offene vs. vertraglich gebundene Beschaffung, physischer Wareneingang getrennt von Wert); (2) L4-Planindexdefinition mit transparenten Basis-/Gewichts-/Einheiten-/Rundungsdaten; (3) L5-Angebotsdatensatz klar als unverbindlich und ohne Buchungswirkung markieren, bevor A03 eine Finanzvertragsbrücke reviewt. A03 prüft anschließend diese Nachträge vor Implementierung. A01 koordiniert Reihenfolge und Status.

## Prüfungsnachweis

- **Ausführung:** A03-Dokumentenreview der L0–L6-Finanzgrenzen.
- **Fachreview:** durchgeführt in diesem Bericht; keine neue Policy festgelegt.
- **Unabhängige QA:** nicht ausgeführt.
- **Tests:** nicht ausgeführt; reine Vertragsdokumentenprüfung, kein ausführbares Verhalten zu prüfen.
- **Browser-/Gerätetest:** nicht ausgeführt; keine Oberfläche geändert.
- **Git:** `git rev-parse --show-toplevel` und `git rev-parse HEAD` erfolgreich; Root `C:/Users/Tobia/Documents/GitHub/WFWSimulation`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. `git status --short` schlug fehl: `fatal: this operation must be run in a work tree`. Working-tree/Diff daher nicht verifiziert.
- **Commit/Push:** nicht ausgeführt.
