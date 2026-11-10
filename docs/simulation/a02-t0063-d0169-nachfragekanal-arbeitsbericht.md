# A02 – T-0063: D-0169-Nachfragekanal im gemeinsamen V3-Run

**Status:** D-0169-Tracebindung und Fail-closed-Korrektur umgesetzt; gezielte Regressionen und 362-Tage-Smoke PASS; unabhängiger A09-Re-Review ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0069
**V3-Profil:** gemeinsamer Run ab 04.01.2027; V1/V2/Profile bleiben unverändert
**Entscheidung:** D-0169
**Vorgänger:** Kandidatenbefund CP-0340 (unverändert); A03 CP-0341; A09 CP-0342
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende Änderungen anderer Arbeitspakete blieben erhalten.

## Änderung

Der in D-0169 bestätigte, synthetische Transfer von Aktivitätslücke zu wöchentlicher Anfragezahl ist im gemeinsamen V3-Run angeschlossen:

- Neue reine Simulationsfunktion `prototype/v3-macro-demand-channel.js`, Modellkennung `V3-MACRO-DEMAND-D0169-1`: Index `100 + activityGapPct`, Faktor nach D-0169 auf `0.90..1.10` begrenzt, Exposure 0..1, Basis fünf Anfragen und seed-stabile floor-plus-Restziehung.
- `buildWeeklyTemplates` erzeugt nur die nach Faktor bestimmte Anzahl Marktanfragen. Größenklassen-Zuordnungsfolge, Referenzpreise und Anforderungen je Anfrage bleiben gleich; die tatsächlich realisierten Wochenstückzahlen und Größenanteile können sich mit der Gesamtzahl erzeugter Anfragen ändern. Das ist keine zugesicherte konstante Größenverteilung. Verträge, Kapazitäten und Finanzstatus werden durch den Kanal nicht angepasst. Gleiche Seeds verwenden für Szenarien dieselben Wochen-Ziehungen, so dass der Richtungsvergleich kontrolliert bleibt.
- Jede Anfragevorlage trägt denselben prüfbaren Wochen-Trace: Entscheidung/Modellversion, Aktivitätslücke und deren Quellenart/-referenz, Exposition, Faktor/Kappung, Erwartungs- und Istzahl, Ziehschlüssel, Makro-Snapshot-ID/Periode und Kennzeichnung `calibrated: false`. Für gemeinsame V3-Runs bindet die Run-Validierung Trace und Quellenwerte an den für den Wochenmonat autoritativen Makro-Snapshot; dessen Eingabe muss wiederum mit dem gespeicherten Day-open-Replayfingerprint und dem Makro-Run-Event übereinstimmen. Jede gemeinsame V3-Nachfragewoche benötigt einen Trace. Eine koordinierte Snapshot-/Trace-/Vorlagen-Manipulation und tracefreie Woche werden beim Restore fail-closed zurückgewiesen.
- Fehlende Exposition wird als `0` behandelt und erzeugt gemäß D-0169 Faktor `1.0`; der gemeinsame Szenariopfad setzt die Exposition ausdrücklich auf `1`.
- Der gemeinsame Tageslauf veröffentlicht am Monatsbeginn den Makro-Snapshot vor der Marktplanung desselben Tages. Markt-Schedule-Events enthalten den Nachfrage-Trace. Die Makro-Karte zeigt Faktor, erzeugte Wochenzahl, Basismenge, Exposition und die Aktivitätsquellenreferenz; der Text bezeichnet die Annahme sichtbar als synthetisch und nicht empirisch kalibriert.
- Die V3-Run-Fixturekennung wurde auf `V3-RUN-UI-SYNTH-2` gehoben und wird in der Run-Validierung geprüft. V1/V2-Codepfade wurden nicht geändert; keine Datenbank-/Schema-/Architekturänderung.

## Geprüfte Läufe

- `node prototype/v3-macro-demand-channel-regressions.mjs` – **PASS**. Neutrale Aktivitätslücke und fehlende/0-Exposition ergeben Faktor 1.0 und fünf unveränderte Basisanfragen. Mit expliziter Exposure 1 und matched weekly draws über 52 Wochen: BOOM `+3 pp` → **274**, neutral → **260**, LOW `−3 pp` → **256** Anfragen. Der integrierte Jan/Feb-Run prüft Same-Seed-Replay, synthetische Quellenprovenienz, D-0169-Kartenanzeige, JSON-Save/Restore und unveränderten FinanceState. Adversariale Restore-Fälle prüfen koordinierte Snapshot-/Trace-/Vorlagen-Manipulation und fehlende Wochen-Traces; beide werden fail-closed abgewiesen.
- `node prototype/v3-run-macro-fixture-regressions.mjs` – **PASS**, einschließlich unverändertem Makro-Fallback-/Save-/Restore-Gate und Zurückweisung einer unbekannten gemeinsamen Run-Fixtureversion.
- `node prototype/v3-market-simulation-regressions.mjs` – **PASS**.
- `node prototype/v3-run-orchestrator-regressions.mjs` – **PASS**.
- `node prototype/v3-year-order-smoke.mjs` – **PASS, Exit 0**, 362 Tage/12 Makromonate, ein kontrollierter Auftrag, D-0166-Rechnung und D-0168-Zahlung; derselbe Run-/Restore-Statehash `80009daa33782b218207ca93d3368ba05710b55e3930ae9ccc1ed07accc10640`. Das belegt weiter kein vollständiges Firmenledger, Lieferanten-Cash, COGS oder Vorratsbewertung.
- `node --check` für Nachfragekanal, Run-UI, Run-Orchestrator und Marktengine – **PASS**.

## Wirkung und Grenzen

Der Nachfragekanal verändert ausschließlich die Anzahl synthetischer Marktanfragen. Die Basis von fünf, 1:1-Übertragung und ±10-%-Kappung sind D-0169-Spielannahmen; sie sind keine Marktstatistik, Branchenregel, Rechtsregel oder Prognose. Öffentliche Quellen liefern nur Kontext-/Aggregatreihen. Makroeffekte erzeugen **0,00 €** Finanzwirkung: keine Änderung an Angebotspreis, Erlös, Kosten, Bestand, Steuer, Forderung/Verbindlichkeit oder Cash. D-0169 bleibt V3-only.

## Nachweisrollen und offene Schritte

- **Ausführung:** A02, gezielte Laufzeit-/Restore-/Kalender- und Nachfragepaarprüfungen wie oben.
- **Fachreview/Nichtbuchung:** A03 CP-0346 bestätigte PASS für Finanz-Nichtbuchung; A03s getrennte D-0169-Gesamtprüfung war vor diesem Fix NONPASS. Der Fix berührte keine Finanzschnittstelle oder Finanzzustände; ein erneutes A03-Review ist nur nötig, falls A09 einen finanzbezogenen Befund erhebt.
- **Unabhängige QA:** A09s Vor-Fix-Review ist in CP-0345 dokumentiert; unabhängiger Re-Review dieser Korrektur steht aus.
- **Browser-/Gerätetest:** nicht ausgeführt; die neue Anzeige ist automatisiert gerendert, kein interaktiver Browser-/Touchtest.
- **Git:** Branch `main`, HEAD wie oben. Änderungen dieses Pakets sind lokal; keine Fremdänderung verworfen. Whitespace- und Gesamtstatusprüfung durch A01 abschließend durchführen.
- **Commit/Push:** nicht ausgeführt.

**Nächster Schritt:** A01 lässt A09 die Tracebindung, koordinierte Restore-Manipulation und Tracepflicht unabhängig re-reviewen. Erst nach A09-PASS und A01-Integration kann der D-0169-Anteil von T-0063 als abgeschlossen gelten; T-0065 und T-0069 bleiben wegen weiterer V3-Gates offen.
