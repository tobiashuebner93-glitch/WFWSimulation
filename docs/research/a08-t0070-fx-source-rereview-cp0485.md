# A08 – T-0070 FX-Quellen-/Metadaten-Re-Review (CP-0485)

**STATUS:** PASS für Quellenkennung, Quotierungsrichtungs- und Annahmengrenze; keine Gatefreigabe
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A08 – RESEARCH
**GOALS/TICKETS:** MG-002 / SLG-002.2 / T-0063 G3 / T-0070
**BASIS:** CP-0485; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight

Alle sieben Control-Plane-Hashes, HEAD und die laut Übergabe erwarteten 506 Status-Einträge stimmen. Die geänderten Dateien und Belege wurden nur gelesen. Kein Code, Status oder CP wurde geändert.

## Korrektur- und Quellenbefund

Die frühere Kennung ist im aktuellen `prototype/v3-run-macro-fixture.js` korrigiert: `sourceSeriesId` lautet `EXR.D.USD.EUR.SP00.A` (Punkte; kanonischer Key im ECB Data Portal). Die Reihe beschreibt USD je EUR. `prototype/v3/run.js` gibt diese Gegenrichtung nun explizit als `USD_per_EUR; inverse to the synthetic EUR_per_USD fixture` aus. Das ist mit der EZB-Referenzseite konsistent: dort sind alle Währungen gegen den Euro als Basis notiert; für 30.10.2026 steht USD 1,1172 je EUR 1. Die EZB veröffentlicht Referenzkurse zu Informationszwecken und rät stark von ihrer Nutzung für Transaktionen ab. [EZB-Data-Portal: EXR.D.USD.EUR.SP00.A](https://data.ecb.europa.eu/data/datasets/EXR/EXR.D.USD.EUR.SP00.A), [EZB-Referenzkurse und Quotierungsbasis](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).

Die gegengerichtete Kennzeichnung ist nicht nur Backendmetadatum: Die FX-Ergebnisansicht benennt die EZB-Reihe als USD je EUR, die synthetische Reihe als EUR je USD und sagt, dass die EZB-Reihe nur Kontext und kein Eingabewert ist. Das Eingabeformular nennt die Werte eine synthetische Lernannahme, keine Marktprognose, kein Lieferantenangebot und keinen EZB-Transaktionskurs. Die vor dem Start sichtbare Fixturebeschreibung nennt Referenzmonat Januar, synthetische Änderung Februar, Einmonatslag und frühesten Wirkungsmonat März; sie kennzeichnet diese nicht als beobachtete Marktinformation. Diese Sichtprüfung war statische Code-/Templateprüfung, kein Browser-Smoke.

Die Testrechnung bleibt ausschließlich synthetisch: 0,9 auf 0,945 EUR je USD = +5 %; mit 25 % angenommener Weitergabe ergibt das +1,25 % auf den Planindex, begrenzt durch ±2 %. Diese Parameter und der Einmonatslag sind keine EZB-/Destatis-Befunde und keine Unternehmenskalibrierung. Der Code übernimmt weder die EZB-Reihe noch einen beobachteten ECB-Wert in das Fixture. Seine Auswirkung bleibt ein separater hypothetischer Planbetrag; Netto-Angebot R, direkte Kosten, eingereichter Snapshot, Vertrag, Beschaffung, Bestand, Cash, FinanceState, BAB, COGS und Ledger bleiben unverändert.

## Externe Kanäle und Entscheidung

Die FX-Preview belegt daher **nur eine Informations-/Planoption**, keine tatsächliche betriebliche Kostenwirkung. Sie darf nicht als nachgewiesener Importpreiseffekt oder als Istkosteneffekt gezählt werden. Der getrennte synthetische Material-Receipt-Pfad kann dagegen im Testpaar die physische Materialverfügbarkeit und Planbarkeit einer Operation verändern; sein Receipt bleibt ebenfalls ohne Preis-/Finanzwirkung. Der Foreign-Demand-Test verändert separat die Verteilung tatsächlicher Anfragevorlagen. Diese Kanäle bleiben getrennt; aus keiner der beiden Quellen folgt eine reale Lieferzeit oder Preisweitergabe.

**Bewertung:** Quellenkennung und Richtungsgrenze PASS; synthetische Annahmen klar begrenzt; UI-Text stellt den nichtbuchenden Kontext dar. Für eine reale FX-/Materialkostenwirkung wären ein lieferantenbezogener Vertragspreis, Vertragswährung, zeitlicher Kurs-/Rechnungsbezug, Hedge-/Gebührenbehandlung und autorisierte A03-Buchungsintegration erforderlich; sie sind im aktuellen Slice bewusst nicht vorhanden. T-0070/G3 bleibt Gesamtentscheidung von A01 nach allen implementierten Pfaden, A03/A09-Reviews und Spielertest; dieser Review schließt weder FX als echten operativen Kostenkanal noch das Parent-Gate ab.

## Prüfgrenzen

- **Ausführung:** aktueller Code, Formular-/Ergebnis-Templates, A02-Bericht, Regressionen und offizielle ECB-Primärquellen geprüft.
- **Tests:** nicht erneut ausgeführt; keine Browser-/Geräteprüfung.
- **Änderungen:** nur dieser Research-Bericht; keine Code-, Status- oder CP-Änderung.
- **Git:** Branch/HEAD/Preflight verifiziert; keine Git-Mutation.

**Nächster Adressat:** A01 – Bewertung der vollständigen T-0070-Gatebelege; A05/A09 bei Bedarf für Browser-/Interaktionsprüfung. Keine Nutzerentscheidung erforderlich.
