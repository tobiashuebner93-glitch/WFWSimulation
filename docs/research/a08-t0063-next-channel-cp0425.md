# A08-T-0063 – Auswahl des nächsten Makrokanals (CP-0425)

**Status:** ENTWURF – Recherche und Umsetzungsoption; keine Produktfreigabe  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063 IN_PROGRESS, abhängig von T-0065/T-0067/T-0069  
**Vorgänger:** CP-0424  
**Stand/Abrufdatum:** 2026-11-01  
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals, T-0063/T-0065/T-0067/T-0069, Collaboration State, D-0161–D-0169, A01-V3-Arbeitsplan, CP-0417–CP-0424, A02-Makrovertrag, A03-Finanzübergabe sowie vorhandene L2-/L4-Arbeiten gelesen. Bestehende Änderungen und CP-0417 bis CP-0424 blieben unangetastet.  
**Git:** Gitstatus ließ sich in diesem Checkout nicht verifizieren; kein Commit/Push.

## Empfehlung

Nächster kleinster, quellenbasierter Schritt: ein optionaler, nichtbuchender Destatis-Einfuhrpreis-Benchmark als Eingabe für die bereits vorhandene L4-Angebotsplan-Sensitivität. Das ergänzt eine amtliche externe Preisreferenz, ohne individuelle Lieferantenpreise oder gemessenen Pass-through zu behaupten.

Nur vom Spieler ausdrücklich ausgewählte, als importexponiert gekennzeichnete direkte Material-/Logistikpositionen offener Angebotskalkulationen dürfen die Planannahme nutzen. Der Benchmark selbst ändert weder Einkaufspreis noch Vertrag oder Istkosten.

## Quellenbefunde

Abrufdatum: 2026-11-01.

- GENESIS-Tabelle 61411-0010: https://genesis.destatis.de/datenbank/online/statistic/61411/table/61411-0010/search/s/SW5kZXglMjBFaW5mdWhycHJlaXNl . Monatliche deutsche Einfuhrpreisindex-Reihe, Basis 2021=100, Gruppen Euro-Länder, Nicht-Euro-Länder und Insgesamt; verfügbarer Zeitraum laut Tabelle 2000–2026.
- Destatis Methodenerläuterung: https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Einfuhrpreisindex-Ausfuhrpreisindex/Methoden/erlaeuterungen-aussenhandelspreise.html . Monatliche Außenhandelspreise; die Indizes sollen reine Preisentwicklung bei konstanten preisbestimmenden Eigenschaften messen und dienen unter anderem zur Abschätzung ausländischer Preiseinflüsse auf das inländische Preisniveau. Monatswerte erscheinen ungefähr am 25. des Folgemonats.
- Destatis Revisionskalender: https://www.destatis.de/DE/Methoden/Revisionen/Tabellen/revisionskalender-preise.html . Reihe 61411 ist monatlich; endgültiges Ergebnis spätestens t+30 Tage.
- EZB-Referenzkurse: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html . Referenzkurse sind nur für Informationszwecke; die EZB rät stark von der Nutzung für Transaktionen ab.
- Keine dieser Quellen belegt einen betriebsspezifischen Beschaffungspreis, Lieferantenvertrag oder KMU-Pass-through. Ein Benchmark darf nicht als individuelle Quote oder Istpreis dargestellt werden.

## Kandidatenabgleich und Anschluss

| Kandidat | Vorhandener Stand | Nächster-Slice-Bewertung |
|---|---|---|
| FX / Import | L2 hat einen replaygebundenen synthetischen FX-/Importplanindikator. | Nicht duplizieren; ECB-Referenzkurs ist kein tatsächlicher Transaktionskurs. |
| Einfuhrpreis / Kostenplan | L4 projiziert Kostenplanindizes und erlaubt eine opt-in Sensitivität auf noch offene Angebote. | Empfohlen: nur eine Quellenbrücke vom amtlichen Monatsbenchmark zu dieser vorhandenen Planfunktion. |
| Exportnachfrage | L2-Mixverschiebung wurde mit kumulativer Rundung in CP-0424 im Browser gezeigt. | Nicht nochmals als Nachfrageimpuls einführen; D-0169 bleibt der einzige Gesamtanfragenfaktor. |
| EZB / Finanzierung | MRO-Informations-/Szenariopfad besteht; D-0163 erlaubt keine automatische Änderung bestehender Verträge. | Neukreditbedingungen lassen sich nicht aus MRO ableiten; mehr Vertragsparameter nötig. |

## Vorgeschlagener Daten- und Wirkungsvertrag

- **Reihe/Einheit/Frequenz:** Destatis 61411-0010, Indexpunkte, Basis 2021=100, monatlich; Gruppe Euro / Nicht-Euro / Insgesamt.
- **As-of-Regel:** Ein Monatswert wird erst nach seinem wirklichen Veröffentlichungsdatum verwendet. Beobachtungsmonat, Quelle, Tabellen-/Reihenkennung, Indexbasis, publishedAt und Datenrevision/Vintage werden gebunden. Keine Look-ahead-Werte; späte Revisionen ändern keine früheren Snapshots oder Angebots-Snapshots.
- **Zukunft ab 2027:** Nur explizit synthetische, versionierte Szenarioinputs; keine Darstellung als reale Prognose. Historische Beobachtungen und Zukunftsszenario bleiben unterscheidbar.
- **Planwirkung:** Opt-in-Sensitivität nur für ausdrücklich ausgewählte, offene Angebotspositionen. Indexnormalisierung braucht explizite Basisperiode und vorhandene L4-Vertragsperiode/Einmonats-Lag. Der Benchmark ist eine Planannahme, kein Vertragspreis.
- **Keine Finanzwirkung:** Keine Änderung abgegebener/angenommener Angebote, Lieferantenquote, Bestellung, Bestand, Verbrauch, Istkosten, BAB, Rechnung, Steuer, Ergebnis, Verbindlichkeit, Forderung, Ledger, Cash oder Finanzierung.
- **Doppelzählung:** Die Position darf nicht noch einmal durch FX, BICI oder ProcurementPlanIndex bzw. denselben Driver angepasst werden. Fehlende/mehrdeutige Exposure oder überlappende Quellen bleiben pending oder unadjusted gemäß bestehender Nutzerwahl. Keine automatische Materialklassifikation.
- **Unsicherheit:** Es existiert kein belegter firmenspezifischer Koeffizient. Die Nutzung ist daher ausdrücklich eine vom Spieler gewählte Sensitivitätsannahme; keine empirische Elastizität wird behauptet.

## Abnahme- und Testvorschlag

1. Quellreihe, Basis, Einheit, Zeitraum, Veröffentlichungsdatum und Vintage sind validiert; fehlende oder widersprüchliche Werte bleiben pending.
2. As-of-Gegenprobe: Werte mit publishedAt nach Snapshot sind unsichtbar; Aktualisierung/Revision ändert frühere Ergebnisse nicht.
3. Basisindex verändert den gewählten Planbetrag nicht; positiver/negativer synthetischer Testpfad verändert ausschließlich die ausgewählte offene Planposition gemäß Opt-in-Indexannahme.
4. Kein Exposure, falsche Gruppe, unmarkierte Position und doppelte FX-/L4-Treiber bleiben unverändert oder pending.
5. Same-seed Replay und Save/Restore erhalten Quelle, Vintage, Zeitraum, Planannahme und Snapshot.
6. FinanceState, Verträge, Angebotspreis R, Rechnungen, Bestand, BAB-Ist, Ledger und Cash bleiben unverändert.
7. A09 prüft Daten-/Vintage-/Exposure-/Restore-Manipulation; A05 zeigt die Herkunft und „Planannahme – kein Lieferantenpreis“; A01 prüft den sichtbaren gewählten und unadjusted Pfad.

## Erforderliche Übergaben

- **A02:** Modell-/Runtime-Vertrag und, nach A01-Auftrag, Umsetzung des observed-vs-synthetic Inputs, publishedAt-Gates, Lag, Exposition und Doppelzählungsschutz.
- **A03:** Finanzreview der bestehenden Angebotsplan-/Nichtbuchungsgrenze sowie Überschneidung mit bestehenden FX-/L4-Treibern.
- **A05:** UI-Badge mit Quelle, Beobachtungs-/Publikationsmonat, Indexbasis, Exposuregruppe und Plan-/Ist-Abgrenzung; erst nach Vertrag.
- **A09:** Unabhängiger Review für Look-ahead, Revision, Doppelzählung, Replay/Restore und Finance-Nichtmutation.
- **A01:** T-0063-Slice koordinieren; T-0063 und abhängige Tickets bleiben offen bis Gesamtabnahme, Jahres-/Browser-/Mobile-Gates erfüllt sind.

Keine Nutzerfrage ist für diese Quellenentscheidung nötig. A01 muss vor Umsetzung nur den Scope wählen: beide Datenmodi getrennt (empfohlen), zuerst synthetischer Demo-Pfad und historischer As-of-Fixture parallel. Der Bericht ist keine Produktentscheidung oder Implementierungsfreigabe.

**Prüfgrenze:** Quellen und vorhandene Verträge gelesen; keine Codeänderung, keine Regression, kein Browser-/Gerätetest und keine Fachfreigabe von A02/A03/A05/A09. CP-0417–CP-0424 unverändert.
