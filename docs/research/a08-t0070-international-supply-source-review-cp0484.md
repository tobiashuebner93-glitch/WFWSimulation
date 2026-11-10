# A08 – T-0070 Internationaler Materialeingang: Quellen- und Annahmenreview

**STATUS:** PASS mit klarer Testannahmen-Grenze; keine Gatefreigabe
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A08 – RESEARCH
**GOALS/TICKETS:** MG-002 / SLG-002.2 / T-0070 (T-0063 G3), Teilpfad Materialeingang
**BASIS:** CP-0484; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und Quellenumfang

Die sieben Control-Plane-Prüfsummen aus CP-0484, Branch/HEAD und die drei angegebenen Implementierungs-/Report-Prüfsummen stimmen. Der Auftrag nannte `docs/simulation/a02-t0070-international-material-arrival-report.md`; dieser Pfad existiert nicht. Der erwartete A02-Inhalt liegt stattdessen unter `docs/simulation/a02-t0070-international-supply-material-receipt-report.md` und hat den übergebenen Hash `CB6FA5D20677CE5C1A90F2ADE018A1295B3510DA73EDFF6FC0FFC36377D8CF24`. Zusätzlich geprüft: A03-Finanzgrenzenreview und A09-Review CP-0483, Produkt-/Orchestratorcode und die begrenzten Regressionsteile. Es wurde keine externe Kalibrierung gesucht, da der A02-Bericht die Werte ausdrücklich als Testfixture und nicht als Marktaussage ausweist.

## Befund

Der Basistermin und die Verzögerung sind als explizite synthetische Eingabe getrennt: Im Regressionstest ist die Baseline-ETA der 05.01.2027; das Neutralpaar hat Lag 0, das Verzögerungspaar setzt den Wareneingang auf den 08.01.2027 (drei **Kalendertage**). Die Suite bezeichnet dies ausdrücklich als Game-Fixture-Annahme, nicht als empirische Versandzeit oder Marktbehauptung. `fixtureId` muss mit `synthetic:` beginnen; `sourceRef` und Fixture-ID sind technische Provenienz-/Replaybindungen, kein realer Lieferant oder externer Datensatz.

Die Wirkungskette ist im getesteten Umfang fachlich sauber: Orderanlage erhöht den verfügbaren Bestand nicht. Vor dem zulässigen ETA-Termin wird Receipt abgelehnt; am tatsächlichen Wareneingang wird die physische Menge erhöht. Ein identischer materialgebundener Arbeitsschritt ist bei fehlender Menge nicht planbar, nach Neutralreceipt planbar und bei der Dreitagesverzögerung erst nach dem verschobenen Receipt planbar. Damit ist nicht nur ein ETA-Index angezeigt: Die synthetische Lieferverzögerung verändert eine echte Betriebsvariable (Materialverfügbarkeit) und die Produktionsplanbarkeit.

Die Grenzen sind transparent und konsistent zu den APIs: Die Receipt-Movement führt Einheit `units`, Menge, tatsächliches Datum/Periode, Quell-/Fixture-IDs und `monetaryStatus: nonposting_pending_cost_source`. Es wird kein Preis, Einkauf, Supplier-AP, Cash, Steuer, Bestandswert, BAB, COGS oder Ledger erzeugt. A03 bestätigt diese Finanzgrenze; A09 bestätigt Restore-/Eventbindung, Mengenabgleich und das Neutral-/Verzögerungspaar. Es bleibt ein physischer Mengen-Teilpfad, keine vollständige Monatsbestandsrechnung oder Lieferantenbeschaffung.

## Bewertung und Restgrenzen

- **Quellen-/Annahmenabgrenzung:** PASS. Baseline und Drei-Kalendertage-Verzögerung sind als synthetische Szenarioeingaben identifizierbar und nicht als reale Branchen-/Marktdaten ausgegeben.
- **Kausale Betriebswirkung:** PASS im eng geprüften Testpaar: ETA → tatsächlicher Receipt → Materialbestand → Planbarkeit derselben Operation.
- **Nonposting-/Finanzgrenze:** PASS durch A03, A09 und den Slice-Bericht.
- **Reale Lieferzeiten/Marktbehauptungen:** nicht belegt und nicht beansprucht. Keine Übertragung auf tatsächliche Lieferanten-, Zoll-, Transport-, Verspätungs- oder Beschaffungskosten ableiten.
- **Spätere reale Kalibrierung:** Erfordert mindestens konkrete Lieferanten-/Versandart, Material-/Bestellgruppe, beobachtete Bestell- und Wareneingangsdaten, Datenzeitraum und Vintage, Stichprobengröße, Definition der Verspätung (Kalendertage oder Arbeitstage), Storno-/Teillieferungsbehandlung und nachvollziehbare Trennung von Zoll/Transport/Lieferantenbearbeitung. Solche Quellen liegen in diesem Slice nicht vor.
- **T-0070/G3 und T-0069/G6:** nicht freigegeben. Der Slice ist synthetisch, UI-/Browserintegration und weitere G3-Wirkungspaare sowie der vollständige Monatsrollforward für Materialien/Fertigware/Reservierungen/Quarantäne/Lagerkapazität sind getrennte offene Nachweise.

**Prüfungen:** A02/A03/A09 berichten fokussierte Regressionen PASS. A08 hat die Tests nicht erneut ausgeführt; kein Jahreslauf, Browser-Smoke oder Code-/Ticketstatusänderung. Kein Commit.

**Nächster Adressat:** A01 entscheidet über die begrenzte Research-Abnahme und leitet etwaige UI-Klarstellung an A05 sowie weitere operative Integrationsarbeit an A02 weiter. Die Gateentscheidung verbleibt bei A01 nach den übrigen Reviews.
