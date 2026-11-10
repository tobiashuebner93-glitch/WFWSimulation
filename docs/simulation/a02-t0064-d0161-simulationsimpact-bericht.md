# A02-Impactbericht – T-0064 / D-0161

**Status:** A02-Umsetzung dokumentiert; fachliche Rechtsreview und integrierte QA stehen aus.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0064
**Prüfstand:** 2026-10-31; aktuelles Recht unabhängig vom Simulationsjahr gemäß D-0161.
**Vorgängercheckpoint:** CP-0275 (Entwurf).

## Umgesetzte Auswirkungen

- D-0153: tägliche Grenze zehn Stunden für Beschäftigte/Zeitarbeit, rollierende 24-Wochen-Prüfung auf durchschnittlich höchstens acht Stunden je gesetzlichen Werktag (Montag–Samstag), feste zusammenhängende 08:00-Schicht und elf Stunden Ruhe als Einsatzinvariante. Bei migrierten Spielständen setzt die Historie am frühesten gültigen protokollierten Arbeitstag ein; nicht personenzugeordnete Legacy-Arbeitsstunden werden sicherheitshalber für die Tagesbudgetprüfung jedem Beschäftigten angerechnet. Die Zwölf-Stunden-Ausnahme ist auf einen tatsächlich selbständigen Inhaber des Einzelunternehmens beschränkt.
- D-0158: Die bestehenden Buchungen bleiben bis zur Rückgabe aktiv. Für den V2-Szenariorahmen gilt eine konservative Grenze von 540 kumulierten Kalendertagen pro anhand der Mitarbeiteridentität über Agenturen hinweg identifizierter Person beim selben Betrieb. Die Engine nutzt stabile synthetische Identitäts-IDs je simuliertem Mitarbeiter (Namen sind reine Anzeige und können sich wiederholen), zählt eine gemeinsame ID agenturübergreifend, warnt 30 Tage vorher und beendet eine unbegrenzt laufende Buchung an der Grenze; neue endliche Buchungen, die die Grenze überschreiten, werden abgelehnt. 540 Tage sind ein bewusst strenger V2-Näherungswert und keine vollständige gesetzliche Fristen-/Tarifprüfung.
- D-0011/D-0134: Der A02-Arbeitskalender verwendet das Standortprofil München/Bayern statt einer Deutschland-weiten Feiertagsunion. §193 BGB für Fristenden ist davon getrennt; die finanzielle Fristverschiebung bleibt A03 zuzuordnen.
- D-0130/D-0157: automatische F3-Folge ist als Produkt-/Vertragskonvention beschriftet, keine allgemeine Fünf-Tage-Abnahmefiktion. Abnahme bleibt Auftraggeberentscheidung.
- D-0042/D-0043: bestehende Darlehensverwertungs-/Pfandfolgen sind als vertraglich modelliertes Spielszenario zu kennzeichnen. Die Finanzimplementierung liegt bei A03 und wurde hier nicht geändert.

## Quellenbasis und Grenzen

Amtliche Primärquellen: [ArbZG § 3](https://www.gesetze-im-internet.de/arbzg/__3.html), [ArbZG § 5](https://www.gesetze-im-internet.de/arbzg/__5.html), [AÜG § 1](https://www.gesetze-im-internet.de/a_g/__1.html), [BGB § 193](https://www.gesetze-im-internet.de/bgb/__193.html), [BGB § 640](https://www.gesetze-im-internet.de/bgb/__640.html), [BGB § 641](https://www.gesetze-im-internet.de/bgb/__641.html), [Bayerisches Feiertagsgesetz](https://www.gesetze-bayern.de/Content/Document/BayFTG/True).

Die Simulation prüft weder AÜG-Erlaubnis noch Gleichstellungsansprüche, Tarifausnahmen oder individuelle Einzelfallkonformität. Pausen, Nachtarbeit, branchenspezifische ArbZG-Ausnahmen und individuelle Vertrags-/Abnahmevoraussetzungen werden ebenfalls nicht vollständig abgebildet. Die A03-Finanzspezifikation kennzeichnet die Verwertungs-/Defizitfolge zu D-0042/D-0043 bereits als vereinfachte Spielregel und keine gesetzliche Vollstreckungsfolge; A01 soll diese Impactstelle im Rechtsregister verlinken. Keine neue Vertragsstrafe wurde ergänzt.

## Dateien und Nachweise

- prototype/engine.js – München/Bayern-Arbeitsfeiertage, Arbeitszeitbudget/Schichtnachweis und F3-Ereignistext.
- prototype/a02-t0064-legal-regressions.mjs – gezielte Regressionen.
- docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md – Rechtsimpact in A02-Fachregeln.
- Dieser Bericht.

**Ausführung:** A02. **Fachreview:** nicht ausgeführt. **Unabhängige QA:** nicht ausgeführt. **Browser-/Gerätetest:** nicht ausgeführt. **Git-Verifikation:** `git diff --check` Exit 0 (nur LF/CRLF-Hinweise); Status bestätigt die genannten vier A02-Dateien zusätzlich zu vorhandenen Fremdänderungen. **Kein Commit/Push.**

## T-0064-Folgeauftrag – Rechtsträger-/Statusfluss

Der separate [A02-Modellvertrag für Rechtsträger- und Gründungsstatus](a02-t0064-v3-rechtstraeger-statusvertrag.md) überführt D-0161/D-0163/D-0164 und A08s Rechtsformmatrix in logische Gründungszustände, Rechtsträgeridentität, Register-/Vertretungsbezüge, Kandidaten-Sperre und Kooperations-/Konzentrationsereignisse. Er markiert die GmbH & Co. KG als bestätigten V3-Fall mit getrennten GmbH-/KG-IDs; AG, eG und GmbH & Co. KGaA bleiben nicht freigeschaltete Kandidaten; gesetzliche Verschmelzung bleibt außerhalb V3.

Der Vertrag trennt Rechtsträgerstatus von Betriebsfähigkeit, Wirtschaftlichkeitsbewertung, UI und Finanzbuchung. Anteilserwerb behält die Ziel-`entityId`; Unternehmenskauf überträgt nur explizite, geprüfte Referenzen. Wettbewerbsprüfung wird nicht durch einen A02-Indikator freigegeben. Finanzwirkung erfordert weiterhin ein separates A03-Ereignis. V1/V2, Schema und Architektur bleiben unverändert.

**Nachweis:** Ausführung A02; A02-Selbstabgleich gegen A08-Matrix und D-Entscheidungen erfolgt; A08-Quellen-/Rechtsformmatrixreview PASS; unabhängiger A08-Review dieses neuen Statusvertrags, A05-UI-Prüfung und unabhängiges A09-Grenzfallreview offen. Browserprüfung nicht ausgeführt. Der vorhandene Validator `prototype/a02-t0064-legal-regressions.mjs` wurde ausgeführt und bestand. Kein Commit/Push.

### A08-Folgekorrektur – Gründungs-/Registerpfad und Betriebsübergang

**Status:** A02-Vertrag an die drei konkreten A08-Rechtsreviewbefunde angepasst; kein Code- oder V1/V2-Verhalten geändert.

- **KG (§ 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB):** Die entsprechende Anwendbarkeit der KG-Vorschriften ist ausdrücklich ergänzt. Registereintragung ist nicht länger als generelles gesetzliches Betriebsbereitschafts-Gate formuliert. Ein getrennter Vor-Eintragungs-Pfad für Teilnahme am Rechtsverkehr ist nur bei dokumentierter Zustimmung sämtlicher Gesellschafter und geklärter gesetzlicher Ausnahme zulässig; er setzt den Registerstatus nicht auf `registered`. Primärquellen: [HGB § 123](https://www.gesetze-im-internet.de/hgb/__123.html) und [HGB § 161 Abs. 2](https://www.gesetze-im-internet.de/hgb/__161.html).
- **GmbH (§ 11 Abs. 1–2 GmbHG):** GmbH-Existenz vor Eintragung bleibt ausgeschlossen. Vorheriges Handeln im GmbH-Namen erhält einen eigenen Prüfstatus zur möglichen persönlichen und gesamtschuldnerischen Handelndenhaftung; die Simulation berechnet oder erlässt keine Einzelfallhaftung.
- **Betriebs-/Assetkauf (§ 613a BGB, § 25 HGB):** Vor Abschluss ist ein möglicher Betrieb-/Betriebsteilübergang gesondert zu prüfen. Bei Anwendbarkeit gehen bestehende Arbeitsverhältnisse grundsätzlich kraft Gesetzes über; Informationspflicht, einmonatige Widerspruchsfrist und Kündigungsverbot wegen des Übergangs werden als Prüf-/Statusfelder geführt. Ergänzt ist der bedingte § 613a Abs. 2-Pfad: Für im Gesetz beschriebene vor Übergang entstandene und innerhalb eines Jahres fällige Verpflichtungen kann der bisherige Arbeitgeber neben dem neuen gesamtschuldnerisch haften; bei späterer Fälligkeit ist die gesetzliche Begrenzung nach dem beim Übergang abgelaufenen Teil des Bemessungszeitraums zu beachten. Das ist eine konkrete Fallprüfung, keine Pauschalregel: A02 erfasst nur Prüfinputs/Parteireferenzen und übergibt sie an A03; es gibt keine automatische Haftungsberechnung, Buchung oder Zahlung. § 25 HGB wird mit der Voraussetzung der Firmenfortführung, dem Sonderfall eines besonderen Verpflichtungsgrunds ohne Firmenfortführung sowie den Grenzen des Forderungsübergangs/abweichender Vereinbarung referenziert. Kein Automatismus wird pauschal auf jeden Assetkauf angewandt. Quelle: [BGB § 613a](https://www.gesetze-im-internet.de/bgb/__613a.html).

**Gate-Status:** A02 hat die modellfachlichen Fallgrenzen und Primärquellenverweise eingearbeitet. A08 soll die korrigierte Formulierung erneut fachlich/legal prüfen; A09 prüft anschließend die Grenzfallabdeckung und dass die Vertragsdokumentation keine unzulässige automatische Haftungs-/Übertragungsfreigabe behauptet. A05-UI-Abgleich bleibt offen. Der vorhandene Engine-Validator ist ein Regressionstest der bereits implementierten V2-Arbeitszeit-/Kalender-/Vertragsregeln und beweist keine Ausführung dieser neuen V3-Statuslogik. Kein Rechtsfreigabe- oder Einzelfallkonformitätsclaim.
