# A02 – T-0063: Makro-Betriebswirkung und Integrationslücke

**Status:** Fachliche Bestandsprüfung abgeschlossen; keine Produktwirkung ergänzt  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Ziele/Tickets:** MG-002 / SLG-002.2 / SLG-002.5; T-0063, T-0065, T-0069  
**V3-Startprofil:** gemeinsamer V3-Run ab 04.01.2027; V1/V2 und bestehende Profile unverändert  
**Entscheidungen:** D-0100–D-0102, D-0159, D-0161–D-0168  
**Vorgänger:** CP-0338; koordinierter Zwischenstand CP-0339  
**Gitbasis:** `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bereits umfangreiche lokale Änderungen erhalten.

## Befund

Der gemeinsame Run speichert Makro-Snapshots und Makropfad getrennt, und die Marktengine verlangt ausdrücklich übergebene Wochentemplates. Der aktuelle V3-Run erzeugt je Simulationswoche fünf synthetische Anfragen mit festem Größenmix. `buildWeeklyTemplates(weekStart, seed)` erhält weder Makro-Snapshot noch einen Expositions-/Übertragungsparameter. Die Marktplatzierung nutzt Nachfrage, Kapazität, Ruf und Segmentpassung, nicht die Konjunkturphase. Die Makroanzeige kennzeichnet die Werte zutreffend als synthetisch/unkalibriert und ohne Unternehmenseffekt.

A08s neues Quelleninventar bietet aggregierte Beobachtungsreihen zu Industrieaufträgen, Erzeugerpreisen, EZB-Zinsen, Wechselkursen und bayerischer Industrieaktivität. Die Abdeckung, Berichtskreise, Revisionen und Grenzen erlauben Kontext und Kalibrierungsprüfung, aber keine repräsentative Einzelgebots-/Kleinstbetriebswirkung. A03 bestätigt, dass Makro- und Politikindikatoren für sich keine Kosten, Erträge, Bestände, Forderungen, Schulden oder Cash auslösen.

## Integrationsentscheidung dieses Auftrags

Eine kausale Betriebswirkung wurde **noch nicht** implementiert. Im aktuellen Vertrag fehlt ein vorhandener, versionierter Nachfrage-/Expositionsparameter. Öffentliche Zeitreihen belegen dessen Effektstärke für dieses Spielunternehmen nicht. A02 schlägt deshalb folgenden reversiblen, ausdrücklich synthetischen Testkandidaten vor; er ist keine Branchenregel und noch keine freigegebene V3-Produktkonvention:

- `demandIndex = 100 + activityGapPct` und `demandFactor = clamp(demandIndex / 100, 0.90, 1.10)`;
- bei 5 Basisanfragen pro Woche beträgt die erwartete Menge `5 × demandFactor`; die ganzzahlige Entscheidung wird aus Run-ID, Seed, Modellversion und Woche stabil gezogen;
- Exposure 0 oder neutraler Pfad setzt den Faktor exakt auf 1.00 und lässt die bestehende Anfragefolge unverändert;
- der derzeitige BOOM-/LOW-Testgap von +3/−3 Prozentpunkten ergäbe erwartete Faktoren von 1.03/0.97 (5.15/4.85 Anfragen je Woche), ohne einen Auftragspreis oder Finanzwert zu ändern.

Der lineare 1:1-Transfer, die ±10-%-Kappung und die Rundung der erwarteten Anfragezahl sind modellierte, nicht empirisch kalibrierte Annahmen. Die Effektstärke beeinflusst die Produktwirkung und muss daher vor einer Runtime-Integration von A01 als V3-Szenariokonvention geprüft werden. Bis dahin bleibt der Codepfad unverändert.

Das ist kein Konflikt mit den bestätigten Entscheidungen. Es ist ein echtes offenes Gate für T-0063 und die abhängigen Unternehmens-/Jahresgates in T-0065/T-0069. Es wurde kein Parameterwert, Branchenmittel, Datenfeed, Preis oder Finanzereignis erfunden. Keine Finanz-/Ledger-, Vertrags-, Angebots- oder V1/V2-Logik geändert; keine Schema- oder Architekturfreigabe.

## Vorschlag für die nächste ausführbare Teilaufgabe

A01 prüft zunächst den obigen Kandidaten als eigene Szenariokonvention oder ändert dessen Stärke/Formel. Nach Bestätigung durch A01 implementiert A02 den Kandidaten nur als expliziten V3-Testpfad; Standardläufe ohne Transmissionparameter bleiben unverändert. A09 prüft dann Richtung, Replay, Save/Restore und Nullwirkung auf FinanceState. A03 bestätigt, dass dieser Kanal nicht bucht. Alternativ kann A01 die T-0063-Unternehmenswirkung bis zu einer später kalibrierten Szenarioversion als offen kennzeichnen.

Vor A05-Integration sind mindestens diese Kriterien zu erfüllen:

1. Ohne expliziten Transferparameter sowie bei Exposition 0 bleiben Anfragezahl, Größenmix, Angebote und FinanceState unverändert.
2. Mit expliziter synthetischer Fixture wirkt ausschließlich die erwartete Anfragezahl; Preise, Größenmix, Vertragsdaten und sonstige Marktwerte bleiben konstant. Seed und Modellversion reproduzieren sie.
3. Quellenkontext und synthetische Übertragungsannahme bleiben getrennt sichtbar; keine einzelne Konkurrenzofferte oder Einzelauftragspreis wird aus Makroquellen abgeleitet.
4. Makroereignis selbst bewirkt 0 € in Erlös, Kosten, Steuer, Bestand, Verbindlichkeiten, Forderungen und Cash.

## Prüfungsnachweis

- **Ausführung:** Quellprüfung von `prototype/v3-run-macro-fixture.js`, `prototype/v3/macro`- und Markt-/Run-Modulen, A02-Vertrag T-0063/T-0065/T-0066, A08-Makroquellenrahmen und A03-Finanzhandoff; Ticket-/Decision-Log und Arbeitsbaum gemäß Preflight gelesen.
- **Regression:** `node prototype/v3-run-macro-fixture-regressions.mjs` – PASS. Diese Suite bestätigt die vorhandenen synthetischen Makroprofile, sichtbare Nullwirkung, Restore und fehlertolerante Fixturebindung; sie testet keine Unternehmenswirkung.
- **Fachreview:** nicht ausgeführt; A01 erhält den Befund zur Koordination, A08 ist für Quellenprovenienz zuständig, A03 für jede monetäre Wirkung.
- **Unabhängige QA:** nicht ausgeführt; A09-Re-Review nach einer späteren Parameter-/Codeänderung erforderlich.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** Ausgangsstatus `main...origin/main` mit zahlreichen lokalen/geänderten und ungetrackten Dateien; Basis-HEAD wie oben. Keine vorhandenen Dateien verändert oder verworfen. `git diff --check` für neu angelegte Dateien wird durch A01 nach Integration in den Koordinierungsstand auszuführen sein.
- **Commit/Push:** nicht ausgeführt.

## Übergabe an A01

Bitte entscheiden und als benannten Folgeauftrag verankern, ob ein reversibler synthetischer T-0063-Testparameter für die Unternehmens-/Markttransmission in V3 aufgenommen wird oder ob das Unternehmenswirkungsgate bis zu späterer Kalibrierung offen bleibt. Rückfrage geht ausschließlich an A01. Bis dahin bleibt der Codepfad unverändert und die vorhandene Anzeige beschreibt den aktuellen Funktionsumfang korrekt.
