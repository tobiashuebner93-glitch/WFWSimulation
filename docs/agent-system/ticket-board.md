# Ticket Board – WFWSimulation

## Aktive Tickets

### T-0039 – Cross-Agent-Konfliktprüfung und Freigabe des Sicherungsstands

Status: COMPLETED (Release-Committee PASS; CP-0216; 2026-10-28)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.3 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachreview: A02–A04 durch unabhängigen Cross-Review; A05–A08 durch A11; A09 Release Committee; A10 DevOps; A11 Architecture
Priorität: HIGH

Aufgabe: Den gesamten lokalen Arbeitsstand nach T-0034 bis T-0038 prüfen, widersprüchliche Implementierungen oder Dokumentation beheben und den vollständigen V2-Sicherungsstand für Commit/Push freigeben. Keine Schema- oder Architekturfreigabe.

Abschluss: Release-Committee PASS. Bereinigt wurden die Kopplung zwischen Tagesfragen und Prüfungsbibliothek, Profilgrenzen der Preisfortschreibung, Bruttozahlung/Vorsteuer, Bilanzbasis des Quartalslimits, gesicherte Immobilien beim Umzug und Nullmiete in der Fallback-Kalkulation. Tagesfragen verwenden nun einen eigenen Pool mit variierter Antwortposition; die 450 Prüfungsfälle bleiben nichtmutierend. Alle 13 MJS-Regressionen/Validatoren, 21 Syntaxchecks, 5/5 Workflow-Sicherheitstests sowie manuelle Mobile-Prüfung bei 390×844 bestanden. Whitespace auch in zuvor ungetrackten Markdown-Dateien bereinigt. Der Stand ist für Commit/Push bereit; diese Git-Schreibvorgänge werden in GitHub Desktop ausgeführt. Siehe CP-0216.

### T-0034 – Personalpools, Kompetenzwirkung und tägliche Lernfragen

Status: COMPLETED (A01-Implementierung, Gesamtregression und Browserprüfung; CP-0211; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2 / SLG-002.3
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A05 FRONTEND, A06 IHK_LEARNING, A09 QA
Priorität: HIGH

Aufgabe: Playtestkorrekturen für Zeitarbeits-Personalplanung und Lernfragen integrieren. Zeitarbeit wird aus festem Agenturpool nach Anzahl, Fähigkeit und Zeitraum (Arbeitstag, fünf Arbeitstage oder 20 Arbeitstage) gebucht, bleibt ohne Auftragsbindung und erscheint in der normalen Tagesplanung. Mitarbeitende führen aktuelle und maximale Werte in Fach-, Methoden-, Sozial- und Individualkompetenz; Fachqualifikationen werden zusätzlich explizit markiert. Kompetenz und Motivation müssen die Arbeitsleistung beeinflussen. Lernfragen erscheinen auf der Übersicht, sind auf fünf Antworten je Simulationsdatum begrenzt und haben kleine, sichtbare Ruf-/Kompetenz-/Motivationswirkungen.

Akzeptanz: Personalbuchungen prüfen Agenturpool und Raumgrenze über den gesamten Zeitraum; keine Person wird zeitgleich doppelt gebucht; Agenturabrechnung bleibt abstimmbar; Lernlimit wird gespeichert und täglich zurückgesetzt; Antworten verändern keine Finanz-/Ledgerposten; bestehende Spielstände werden migriert; gezielte Regressionen und der Jahres-Smoke bestehen. Keine Schema- oder Architekturfreigabe.

Abschluss: Drei Agenturen mit je vier fest definierten Poolkräften. Buchungen wählen Personenzahl und Dauer von einem, fünf oder 20 Arbeitstagen, beginnen arbeitsfrei am nächsten Arbeitstag, prüfen durchgehend Poolverfügbarkeit und Standortkapazität und erscheinen ohne Auftragsbindung in der Tagesplanung. Die alte 8-Stunden-Auswahl im Zeitarbeitsformular wurde entfernt; ein Leihmitarbeiter wird modellseitig für einen vollen Arbeitstag gebucht. Kompetenz-/Entwicklungslimits und Qualifikationen werden angezeigt und in Weiterbildung/Leistung berücksichtigt. Das Dashboard enthält die Tagesfragen; fünf Antworten pro Simulationsdatum bewirken kleine sichtbare Änderungen ausschließlich über Engine-Logik, ohne Finanz-/Ledgerbuchungen. Fokus-Regressionen, vollständige MJS-Regressionsmatrix, WBQ-/HSQ-Validatoren, Jahres-Smoke und Browseransichten für Dashboard, Planung und Agenturvertrag bestanden. Kein Schema-/Architekturentscheid; kein Commit/Push in T-0034. Details: [CP-0211](checkpoints/CP-0211.md).

### T-0033 – V2-Integration, Qualitätsreview und Release vorbereiten

Status: COMPLETED (Reviews, Regressionen, Browser-/Mobilprüfung, Commit 4249271 und Push; CP-0210)
Master Goal: MG-002
Second-Level Goal: SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A04 DATABASE, A09 QA, A10 DEVOPS_INFRASTRUCTURE, A11 TECHNICAL_ARCHITECT
Priorität: HIGH

Aufgabe: Die fachlich abgeschlossenen MG-002-Lieferungen integrieren, Browser-/Mobilpfade, Inhalte, Simulation und Qualitätsgates unabhängig prüfen und Konflikte vor Sicherung bereinigen. Keine Architektur- oder Schemafreigabe ohne gesonderte Nutzerentscheidung.

Akzeptanz: Alle V2-Tickets haben dokumentierte Agentenergebnisse und unabhängige Reviews; 450 Lernszenarien sind strukturell und fachlich geprüft; Regressionen und einjähriger Simulationslauf bestehen; Mobilbedienung und Tooltipzugänglichkeit sind geprüft; `git diff --check` ist sauber. Nach Abnahme werden klar benannte Sicherungs-Commits erstellt und über lokale Git-Arbeitsmittel/GitHub Desktop gepusht.

### T-0032 – 450 WBQ-/HSQ-Multiple-Choice-Lernszenarien erstellen und integrieren

Status: COMPLETED (A06/A07-Lieferung, A09-Prüfung sämtlicher 450 Items; 2026-10-28; CP-0208)
Master Goal: MG-002
Second-Level Goal: SLG-002.3 / SLG-002.4
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A06 IHK_LEARNING, A07 EXAM, A05 FRONTEND, A09 QA (Inhaltsproduktion A06/A07 zuerst; UI-Integration A05 erst nach T-0031)
Priorität: HIGH

Aufgabe: Für jeden der vier WBQ-Qualifikationsbereiche und fünf HSQ-Handlungsbereiche jeweils 50 eigenständige, originäre Multiple-Choice-Lernszenarien erstellen. Jede Aufgabe enthält vier plausible Antwortoptionen, einen Lösungsschlüssel A–D, eine fachliche Begründung, Quellen-/Kompetenzbezug, eine verständliche Unternehmenswirkung und eine klare Kennzeichnung von Rechtsstand bzw. Spielvereinfachung. A06 und A07 liefern getrennte Inhaltsmodule mit demselben Schema. A05 integriert diese Module als Lernmodus erst nach Abschluss und Review von T-0031, damit UI-Änderungen nicht konkurrierend erfolgen.

Akzeptanz: Genau 50 valide Fragen je offiziellem Bereich (450 insgesamt); keine kopierten DIHK-Prüfungsaufgaben; genau ein richtiger Schlüssel pro Item; Distraktoren und Erklärungen fachlich geprüft; Unternehmenswirkungen werden als plausible Fallfolgen im Feedback erklärt; Antworten verändern den aktiven Jahres-Spielstand oder das Accounting-/Ledger-State nicht. Inhalte sind responsiv sowie tastatur-/touchbedienbar.

### T-0031 – Marketing, Logistik und kontextbezogene Fachwissen-Tooltips ergänzen

Status: COMPLETED (A02/A03/A05-Implementierung, A11/A09-Review; 2026-10-28; CP-0202)
Master Goal: MG-002
Second-Level Goal: SLG-002.2 / SLG-002.3
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A05 FRONTEND, A06 IHK_LEARNING, A08 RESEARCH
Priorität: HIGH

Aufgabe: Marketing/Vertrieb sowie Logistik (Beschaffung, Lieferanten, Materialfluss, Lager und Auslieferung) in die nachvollziehbare Unternehmenssimulation und Lernziele aufnehmen. Fachwissen soll an passenden Spielbegriffen und Entscheidungen durch zugängliche Tooltips erklärt werden. Allgemeine Fachregeln, Rechtsvorgaben und V1-/V2-Szenarioannahmen sind sichtbar getrennt.

Akzeptanz: Mindestens ein eigener spielbarer Marketing-/Vertriebszyklus und ein eigener Logistikzyklus bilden jeweils nachvollziehbare Unternehmenswirkungen ab; beide sind reproduzierbar und finanzielle Effekte abstimmbar. Tooltips funktionieren per Maus, Tastatur und Touch. Keine Architektur-/Schemaänderung ohne Freigabe; Fachreview durch unabhängige Rollen.
Abschluss: Zwei einmalige Szenariokampagnen (+8/+14 Prozentpunkte auf die nächste Marktchance) werden beim Aktivieren als Kosten oder offene Kostenposition gebucht und in Monatsabschluss/Ergebnis/Cash geprüft. Bevorzugter Lieferant je Material steuert künftige Fehlbestandsbestellungen, bei unveränderten Bestellungen und Zuverlässigkeits-/Beziehungswartezeiten. Marketing-/Logistikhinweise sind als native, per Tastatur und Touch nutzbare Details integriert. T-0031-Regression, V1-Regressionsuite, Wochenregression und 12-Monats-Smoke bestanden; unabhängiger A11/A09-Review ohne blockierende Konflikte. Ein separater Test des Marketing-Zahlungsversuchs bei unzureichendem Cash wird im T-0033-Gesamt-QA ergänzt. Kein Commit/Push.

### T-0030 – IHK-Prüfungsrahmen und Kompetenzlandkarte belegen

Status: COMPLETED (A06-Lieferung, A07-Fachreview, A08-Quellenreview; 2026-10-28; CP-0202)
Master Goal: MG-002
Second-Level Goal: SLG-002.1
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A08 RESEARCH, A06 IHK_LEARNING, A07 EXAM
Priorität: P0

Aufgabe: Den WBQ-/HSQ-Prüfungsrahmen anhand der geltenden WFachwPrV und öffentlich erreichbarer IHK-/DIHK-Angaben dokumentieren; URL, Versions-/Veröffentlichungsstand und Abrufdatum festhalten. A06 leitet eine nachvollziehbare Kompetenzlandkarte ab, A07 prüft Prüfungsformate und Handlungsorientierung. Verbindlicher Normtext, IHK-Hinweise, agentenseitige Ableitungen und nicht belegte Ergänzungen bleiben unterscheidbar.

Akzeptanz: Vier WBQ- und fünf HSQ-Bereiche vollständig abgebildet; Logistik und Marketing/Vertrieb enthalten; Quellen und Abweichungen dokumentiert; kostenpflichtige Rahmenpläne nicht als eingesehene Quelle ausgegeben; unabhängiger Cross-Review bestanden; Kompetenzlandkarte wird nicht fälschlich als IHK-Veröffentlichung bezeichnet.

Abschluss: `docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md` dokumentiert WFachwPrV §§ 3–5 und 7, regionale IHK-Angaben, agentenseitige Ableitungen und Spielbezüge. A07 und A08 bestätigen Bereichszuordnung, Prüfungsformat, Rechts-/Zeitangaben sowie Quellenstände. Der spezifische Wirtschaftsfachwirt-Rahmenplan 2024 und der allgemeine WBQ-Rahmenplan 2026 sind getrennt; keiner der kostenpflichtigen Volltexte wurde als gelesen behauptet. Keine blockierenden Konflikte; siehe CP-0202.

### T-0029 – „Woche abarbeiten“ bis zum nächsten Montag begrenzen

Status: COMPLETED (A02/A05-Umsetzung, A11/A09-Review; 2026-10-28; CP-0202)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A05 FRONTEND, A09 QA
Priorität: HIGH

Aufgabe: Den Wochenknopf so ändern, dass er unabhängig vom Startwochentag bis zum nächsten strikt zukünftigen Montag läuft. Das Ziel-Montagdatum selbst wird nicht verarbeitet. Klar beschriften, welches Zeitintervall aufgelöst wird.

Akzeptanz: Starts an Montag, Mittwoch, Freitag, Samstag und Sonntag sowie Feiertagswochen enden am nächsten zukünftigen Montag; kein Ereignis oder Finanzlauf am Zielmontag; Einzel-Tag-Fortschritt bleibt unverändert; Regressionen und `git diff --check` bestehen.

Abschluss: `getWeekAdvanceWindow()` berechnet das strikt zukünftige Montagziel; die App verarbeitet nur die davorliegenden Kalendertage. Alle drei Buttons nennen das Montagziel. Wochenregression, Playtest-Regression und Jahres-Smoke bestanden; unabhängiger Review durch A11/A09 fand keine blockierenden Konflikte. Browser-E2E folgt unter T-0033. Kein Commit/Push.

### T-0028 – Cross-Agent-Befunde zu Angebotszeit, Kapazität und Liquidität bereinigen

Status: COMPLETED (A01 hat Fachrollen intern abgearbeitet; 2026-10-27; CP-0198)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A04 DATABASE, A05 FRONTEND, A09 QA
Priorität: HIGH

Aufgabe:
- A01-Produktkonvention: Konkurrenzgebote liegen als gleichzeitige Vergleichsangebote am Tag der Spieleranfrage vor. A02 setzt responseDate auf das Anfragedatum; A05 bezeichnet es als Eingangsdatum statt als künftige Antwortfrist.
- A02: Kapazitätsabzug nur aus noch nicht gelieferten generierten Aufträgen berechnen, nicht aus bereits gelieferter Produktion, deren Forderung noch offen ist.
- A05: Bei MARKT_VERLOREN den eingereichten Preis als verlorenes Angebot zeigen, nicht als vereinbarten Auftragspreis oder Vertragszahlungsziel. A09 ergänzt Regressionen.
- A05/A02: Qualitätswert als V1-Proxy für Wettbewerber-Reputation kenntlich machen.
- A04: Logische Spezifikation um Anfragezuordnung, Konkurrenzangebots-Snapshot und Zuschlag ergänzen; keine physische Schemaänderung oder Freigabe.
- A03/A09: Ein-Auftrag-Stresslauf wiederholbar prüfen und tatsächlichen Spielverlust-/Retrystatus ausweisen. Keine unbelegte Finanz- oder Insolvenzregel ergänzen.
- A01: D-0136 als historischen Ausgangsstand kennzeichnen; D-0137 als gültige wöchentliche Frequenzreferenz verlinken.

Akzeptanz:
- Verfügbarkeit, Antwortdatum und Zuschlag widersprechen sich nicht.
- Produktionskapazität wird mit Lieferung frei.
- Verlorene Angebote sind klar von angenommenen Verträgen getrennt.
- Ein-Auftrag-Liquiditätsrisiko ist mit Cash, unbezahlten Posten und Retry-/Spielverluststatus reproduzierbar dokumentiert.
- Logische Datenmodellanforderungen sind vollständig, ohne Schemaänderung.
- gezielte Regressionen, bestehende Regressionen und git diff --check bestanden.

Abschluss: Konkurrenzangebote haben das Anfragedatum als Eingangsdatum; gelieferte Aufträge zählen nicht länger als Produktionslast; verlorene Gebote bleiben vom Vertragswert getrennt und die UI kennzeichnet den abgegebenen, nicht angenommenen Preis. Der Wettbewerberruf ist sichtbar als Qualitäts-Proxy beschriftet. Das logische Datenmodell umfasst Anfragebeteiligung, Quote-Snapshot und Zuschlagsergebnis ohne physische Schemaänderung. Regressionen und Ein-Auftrag-Stresstest sind in CP-0198 dokumentiert. Keine Finanzregel ergänzt; Ein-Auftrag-Strategie löst nach acht Fehlversuchen Spielverlust und Maschinenverwertung aus. Kein Commit/Push.

### T-0027 – Marktanfragen und Spielerangebote wöchentlich erzeugen

Status: COMPLETED (A01 intern als A02/A05/A09 ausgeführt; 2026-10-27; CP-0196)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A05/A09 intern abgedeckt)
Priorität: HIGH

Aufgabe: Zu seltene Marktanfragen erhöhen, damit genügend wählbare Angebote entstehen. Konkurrenzselektion und Ruf-/Preisabhängigkeit aus D-0136 erhalten; hohe gleichzeitige Auftragslast soll den Zufluss dämpfen.

Abschluss: Eine Anfrage pro Simulationswoche am ersten Arbeitstag. Einladungsprüfung und Kapazitätsabzug bleiben aktiv; je Spieleranfrage ein bis zwei Konkurrenzbieter. Jahres-Smoke und Marktregression bestanden. Entscheidungen D-0137/D-0138, Nachweis CP-0196. Keine Schemaänderung, kein Commit/Push.

### T-0026 – Selektive Konkurrenzangebote und Zuschlagslogik umsetzen

Status: COMPLETED (A01 intern als A02/A05/A09 ausgeführt; 2026-10-27; CP-0195)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A05/A09 intern abgedeckt)
Priorität: HIGH

Aufgabe: Kundenanfragen nicht an alle Unternehmen verteilen. Sichtbare Konkurrenzangebote für offene Spielerangebote abbilden. Einladung und Zuschlag sollen von Reputation und Preis abhängen; das Verhalten bleibt reproduzierbar und mobil lesbar.

Abschluss: Der Betrieb erhält Anfragen anhand von Ruf, bisherigem Preisprofil und Kapazitätsbelastung; pro Anfrage bieten ein bis zwei Wettbewerber. Preis, Ruf und modellierte Lieferzeit werden angezeigt. Der Zuschlag vergleicht eigenes Angebot und Rivalen deterministisch. Preisprofil wird aus eigenen Geboten fortgeschrieben. Regression, bisherige Playtest-Regressionen und Jahres-Smoke bestanden. Entscheidung D-0136; Nachweis CP-0195. Keine Schemaänderung, kein Commit/Push.

### T-0022 – V1-Playtestfehler beheben und Browserbedienung sichern

Status: COMPLETED (manuelle Browser-Reprüfung durch Nutzer bestätigt; 2026-10-27; CP-0199)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A03/A05/A09/A11 intern abgedeckt)
Priorität: HIGH

Umfang: Save/Load-Export, dauerhaft erreichbare Navigation, Entfernen des Jahressimulationsbuttons aus der Spieloberfläche, Disporahmenanzeige, Platzgrenzen einschließlich Krankheit, unveränderlicher angenommener Preis, Standortwechsel statt Flächeneditierung, Ausbildungs-/Weiterbildungsabgrenzung mit Ausbilderqualifikation und korrekte Urlaubserfassung. Rechtliche Modellgrenzen und deterministische V1-Annahmen dokumentieren.

Akzeptanz: neue Fehlerregressionen, bestehende Regressionen und Einjahres-Smoke bestanden; Nutzer hat die manuelle Browserprüfung von Datei-Dialogen, Bottom-Navigation bei hoher Zoomstufe, Umzugsdialog, Preissperre und Mobilansicht ohne Fehler bestätigt. `git diff --check` sauber. Keine Schemaänderung, kein Commit/Push.

Abschluss: Korrekturen und automatisierte Regressionen sind in CP-0190 dokumentiert; T-0028-Cross-Agent-Prüfung steht in CP-0197/0198. Nutzer bestätigte am 2026-10-27, alle in CP-0190 offenen interaktiven Punkte getestet und keine Fehler gefunden zu haben. T-0022 ist mit CP-0199 abgeschlossen.

### T-0025 – Zeitarbeitskonditionen vor Buchung verhandeln und fixieren

Status: COMPLETED (A01 intern als A02/A03/A05/A09 ausgeführt; 2026-10-27; CP-0194)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A03/A05/A09 intern abgedeckt)
Priorität: HIGH

Aufgabe: Zeitarbeitstarif durch Agenturverhandlung mit Grundpreis und Stundenpreis ersetzen. Höherer Grundpreis muss niedrigeren Stundenpreis anbieten; nach Vereinbarung müssen Preise fixiert und in Einsatzkosten abgerechnet werden.

Abschluss: Drei illustrative, monotone Preisstufen eingeführt. Konditionen sind nach Annahme unveränderlich; Buchungen speichern die vereinbarten Sätze. Monatsgrundpreis fällt einmal in Monaten mit mindestens einer Buchung an; Legacy-Spielstände behalten 45 €/h. Regression und Jahres-Smoke bestanden. Details: CP-0194.

## Abgeschlossene Tickets

### T-0024 – A04-Datenmodell mit aktuellen V1-Entscheidungen synchronisieren

Status: COMPLETED (A01 intern als A04 ausgeführt; 2026-10-27; CP-0193)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A04 – DATABASE (fachliche Rolle durch A01 ausgeführt)
Koordination: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Überholte Offenmarkierungen und Kalenderaussagen im logischen Datenmodell gegen D-0120 bis D-0129 und D-0134 korrigieren. Historische CP-Verweise als damaligen Stand kennzeichnen. Keine Schema- oder Architekturfreigabe.

Abschluss: Darlehen, Dispositionskredit, Zahlungsreihenfolge und Periodenzuordnung sind aktualisiert; F3/Feiertage sind mit D-0134 abgeglichen; verbleibende offene Punkte sind korrekt eingegrenzt. CP-0193. Keine Schemaänderung, kein Commit/Push.


### T-0023 – Cross-Agent-Konflikte aus CP-0191 bereinigen

Status: COMPLETED (A01 hat die adressierten Fachrollen ausgeführt; 2026-10-27; CP-0192)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Koordination: A01 – MASTER_ORCHESTRATOR
Adressierte Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A04 DATABASE, A05 FRONTEND, A09 QA
Priorität: HIGH

Aufgabe: Die dokumentierten Konflikte und Abdeckungslücken aus CP-0191 beheben. A02 korrigiert den Tagesfilter für wiederholte Zeitarbeitsbuchungen und gleicht die Simulationsspezifikation gegen Urlaub/Krankheit ab. A03 verlagert Immobilienkauf/-verkauf in Finance-eigene Funktionen und synchronisiert die Finanzspezifikation. A04 synchronisiert nur logische Anforderungen zu Facility, Abwesenheit, Zeitarbeit und Ausbildung; keine Schemaänderung. A05 aktualisiert V1-MODELL.md und kennzeichnet automatische Abnahme klar als Spielregel. A09 ergänzt Regressionen für mehrere Zeitarbeitseinsätze und prüft die betroffenen UI-Abläufe.

Zusatzpunkt abgeschlossen: D-0011 bleibt die historische Kernregel; D-0134 hält den später ausdrücklich beauftragten V1-Kalender als konservative Spielkonvention fest.

Akzeptanz: keine stale/conflicting V1-Dokumentation in den betroffenen Themen; wiederholte Buchungen werden eingesetzt oder transparent abgelehnt; Finance-State wird nicht durch UI direkt gebucht; automatisierte Regressionen bestehen; bestehende Architektur- und Datenbankschemafreigaben bleiben unverändert.

Abschlussnachweis: Zeitarbeitsfilter korrigiert und Regression für Einsätze an zwei verschiedenen Tagen ergänzt; Immobilienbuchungen liegen in Finance, UI delegiert und zeigt den Szenariovermögenswert; A02/A03/A04/A05-Dokumentation abgeglichen; Feiertags- und automatische Abnahmeregeln korrekt abgegrenzt. Gezielte Regression, T-0020-Regressionssuite und Jahressmoke bestanden. Details: [CP-0192](checkpoints/CP-0192.md). Keine Schema-/Architekturfreigabe, kein Commit/Push. Browserinteraktion für den vollständigen Playtest bleibt als separates T-0022 offen.


### T-0021 – Goal- und Ticketstatus gegen Checkpoints abgleichen

Status: COMPLETED (2026-10-27; CP-0188)
Master Goal: MG-000
Second-Level Goals: SLG-000.1 / SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Goal-Abnahmekriterien und den aktuellen Ticketstatus anhand der maßgeblichen Checkpoints und des Repository-Stands abgleichen. Historische Angaben erhalten und überholte Zustände kenntlich machen. Keine Produkt-, Schema-, Implementierungs- oder Architekturänderung.

Abschlussnachweis: SLG-000.1 anhand T-0001/CP-0182, SLG-000.2 anhand T-0002/CP-0006, CP-0029 und T-0020/CP-0187 bewertet. Goal-/Ticketstatus und Collaboration State konsolidiert; Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED. Details: [CP-0188](checkpoints/CP-0188.md).

---

### T-0020 – Validierungsbefunde für V1-Finanz- und Auftragsablauf abschließen

Status: COMPLETED (2026-10-27; CP-0187)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A04 DATABASE, A05 FRONTEND, A08 RESEARCH, A09 QA, A10 DEVOPS_INFRASTRUCTURE, A11 TECHNICAL_ARCHITECT
Priorität: HIGH

**Ausgangslage:** Review nach CP-0185 fand Umsetzungslücken trotz COMPLETED-Markierung T-0015–T-0019. T-0020 konsolidiert diese Befunde und ist die maßgebliche Nacharbeit.

**Aufgabe:** V1-Simulations- und Finanzverhalten mit Spezifikation und bestätigten Regeln abstimmen, ohne eine unfreigegebene Zielarchitektur oder ein Datenbankschema einzuführen.

**Abnahmekriterien:**

- Abhängige Planungs-/Fertigungsoperationen können am selben Simulationstag weiterlaufen, sofern Fähigkeiten und Tageskapazitäten reichen; falls die vorhandene Tagesphasenarchitektur das verhindert, Spezifikation und Testverhalten explizit aufeinander abstimmen.
- SimTAX bildet für qualifizierte externe Lieferantenbelege eine getrennte Vorsteuerkomponente ab und verrechnet sie nachvollziehbar mit Ausgangs-SimTAX; Perioden-/Kreditüberträge bleiben reproduzierbar und als Modellregel dokumentiert.
- Offene eigene Verbindlichkeiten protokollieren wöchentliche Fehlversuche bis acht, Zahlungserinnerung zehn Kalendertage nach Fälligkeit und formelle Mahnung 14 Kalendertage später; bezahlte Posten lösen keine späteren Mahnungen aus. Maschinenkredit bleibt separat.
- Beschädigte lokale Spielstände werden vor möglichem Überschreiben geschützt. Wiederherstellung des letzten gültigen Spielstands und bewusster Neustart sind für Nutzer nachvollziehbar.
- Regressionen prüfen die obigen Regeln, Monats-/Steuerabstimmung und Jahreslauf. Mobile UI statisch prüfen; eine nicht ausführbare manuelle Browserprüfung als nicht verifiziert kennzeichnen.
- Research-/Spezifikationsstatus und logisches Datenmodell gegen aktuelle V1-Entscheidungen synchronisieren. Architekturkopplungen dokumentieren, aber keine ADR-/Architekturfreigabe oder Schemaänderung vornehmen.
- Änderungsbericht, QA-Ergebnis und CP; `git diff --check` sauber. Vorhandene Änderungen erhalten; kein Commit/Push ohne gesonderten Auftrag.

**Ergebnis:** Same-Day-Planungs-/Fertigungsketten, getrennte SimTAX-Ausgangs-/Vorsteuerkomponenten mit Guthabenübertrag, allgemeines Dunning, Save-Recovery, mobile UI-Hinweise und Datenmodell-/Spezifikationsabgleich sind umgesetzt und gezielt regressionsgeprüft. Der 365-Tage-Lauf endet am 01.01.2028 ohne Cash-Reconciliation-Fehler. Architekturkopplung ist dokumentiert; keine Schema- oder Architekturfreigabe. `git status` geprüft; `git diff --check` bestanden (nur konfigurierte LF/CRLF-Hinweise). Branch `main`, HEAD `62dbc71`; vorhandene lokale Änderungen und ungetrackte Dateien blieben erhalten. Kein Commit/Push. Ergebnisdetails: [A01-Abschlussbericht](a01-t0020-abschlussbericht.md), [A09-QA-Bericht](a09-t0020-qa-bericht.md), [CP-0187](checkpoints/CP-0187.md).

---

### T-0019 – Auftragspriorisierung, Abnahme und wirtschaftlicher Abschluss

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A05 FRONTEND, A09 QA
Priorität: MEDIUM

Aufgabe: Priorisierung bei konkurrierenden Aufträgen sowie Folgen von Verspätung, Abnahmeablehnung, Nacharbeit und Abschluss prüfen. Im UI Fälligkeit, Vertragswirkung, Machbarkeit, Engpass und Deckungsbeitrag als nachvollziehbare Kriterien sichtbar machen. Bestehende Regeln bleiben führend; neue Regeln bei fehlender Grundlage an A01 zur Entscheidung geben.

Ergebnis: Arbeitspriorität ist auswählbar und wirkt deterministisch; Liefertermine und Wirtschaftlichkeitskennzahlen sind in der Auftragsansicht sichtbar. Verspätungen senken Ruf und Kundenbindung nach einer begrenzten V1-Formel. Nach Ablehnung kann einmal nachgearbeitet oder storniert werden; Kosten bereits ausgeführter Arbeit bleiben bestehen. Jahreslauf und Regressionen: [CP-0185](checkpoints/CP-0185.md).

### T-0018 – Monatsabschluss und Finanz-/Steuer-Reconciliation

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A03 ACCOUNTING_FINANCE, A02 SIMULATION, A09 QA
Priorität: HIGH

Aufgabe: Periodenübersichten und Cashflow mit Forderungen, Verbindlichkeiten, Personal, Miete, Energie, Wartung, Material, Zeitarbeit, Finanzierung und SimTAX abstimmen. SimTAX bleibt als Spielmodell gekennzeichnet. Lieferanten-Zahlungsziele und Startposten nicht ohne dokumentierte Fälligkeit/Belege bewegen. Keine steuerrechtliche Vollberechnung oder Bilanzierungsbehauptung ergänzen.

Ergebnis: Monatsabschlüsse stimmen Cashflow, Kosten, Forderungen, offene Kosten, SimTAX, Darlehen und Zinsen ab; ein Jahreslauf meldet keine Cash-Reconciliation-Fehler. V1-SimTAX bleibt Simulation. Nachweis: [CP-0185](checkpoints/CP-0185.md).

### T-0017 – Markt- und Materialpreis-Szenariopfade

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A08 RESEARCH, A02 SIMULATION, A03 ACCOUNTING_FINANCE, A09 QA
Priorität: HIGH

Aufgabe: Reproduzierbare Basis-, Aufwärts- und Abwärtsszenarien für Nachfrage, Stahl, Aluminium, Normteile und Energie definieren. Händlerreferenzpreis, Beobachtungsdatum, Einheit und Marktindex getrennt führen. Makroindex darf nicht direkt als konkreter Einkaufspreis ausgegeben werden. Mit offiziellen Primärdaten und Stressfällen dokumentieren.

Ergebnis: Drei deterministische Szenariopfade ergänzt; der datierte Händlerpreis-Basisstand bleibt getrennt von Preisindizes. Keine Live-Preisbehauptung; der Stresspfad ist ausdrücklich eine Szenarioannahme. Quellen-/Grenzenhinweis und Jahreslauf: [CP-0185](checkpoints/CP-0185.md).

### T-0016 – Angebots-, Preisverhandlungs- und Auftragswirtschaft

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A05 FRONTEND, A08 RESEARCH, A09 QA
Priorität: HIGH

Aufgabe: Preisangebot vor Auftragsannahme ermöglichen. Zahlungsziel, Liefertermin, Materialkosten, Arbeits-/Maschinenstunden, Szenario-Gemeinkosten, SimTAX separat, Deckungsbeitrag und Liquiditätswirkung transparent machen. Spieler kann verhandeln, annehmen oder ablehnen, bevor Ressourcen gebunden werden. Ein angenommenes Angebot bleibt Grundlage für Planung, Rechnung und Zahlung. Kosten- und Margenformeln reproduzierbar dokumentieren und mit adversen Aufträgen prüfen.

Ergebnis: Angebotsannahme/-ablehnung, Zahlungsziel und verhandelbarer Nettoerlös sind im UI; angenommene Preise bleiben für Rechnung und Zahlung gespeichert. Deckungsbeitrag, Szenario-Gemeinkosten und SimTAX werden getrennt angezeigt. Reproduzierbare V1-Formeln und Grenzen: [CP-0185](checkpoints/CP-0185.md).
### A01 – V1-Materialpreis-Basis und bedarfsgerechter Anfangsbestand (D-0128 / CP-0181)

Status: ABGESCHLOSSEN; V1-Szenariobasis festgelegt
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0090–D-0096 / D-0123/24

Der Anfangsbestand deckt die drei bestätigten Aufträge ab: 2.000 kg Stahl, 100 kg Aluminium, 60 Referenzschrauben; Bedarf 172 kg / 90 kg / 56 Stück. Aktuelle Händlerreferenzpreise vom 27.10.2026 ergeben 4.214,20 € Vorratswert. Die Eröffnungsbilanz wurde auf 46.714,20 € und das Dispo-Startlimit auf 4.671,42 € aktualisiert; Eigenkapital als Restposition 15.214,20 €. Die frühere 12.800-€-Vorratsannahme bleibt nur als historischer Entscheidungsstand dokumentiert. Der Preisstand beansprucht keine historische Kostenprovenienz oder HGB-Abschlussqualität. Quellen und Modellgrenzen: [Preis-Basisstand](../market-data/material-price-baseline-2026-10-27.md), [CP-0181](checkpoints/CP-0181.md).

### Historischer A01-Rollenreview und Commit-Kandidatenabgleich (CP-0180; Vorratswerte durch CP-0181 ersetzt)

Status: REVIEW ABGESCHLOSSEN; damaliger Vorratsdatenstand historisch
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0012–T-0014 / CP-0178/0179

A01 hat die Fachstände der Rollen A01–A11 anhand der jeweils zuständigen Unterlagen und V1-Umsetzung geprüft. Behoben wurden die abweichende Dispozinsformel D-0023, nicht normalisierte Partnerabhängigkeiten und eine unklare Abgrenzung der Feiertagserweiterung. Die Darlehensausfall-/Verwertung nach D-0042/43 wurde ergänzt und getestet. Als fachübergreifender Folgepunkt bleiben fehlende Vorjahresschluss-Komponenten für die Vorratsbewertung. Details und Validierung: [CP-0180](checkpoints/CP-0180.md).

Die Review-Unterlagen sind commitbereit als Szenario-Prototyp mit dieser dokumentierten Bewertungsgrenze; sie beanspruchen keine vollständige Bestandsbuchführung. Es wurde nicht committet oder gepusht.

### T-0015 – V1-Zahlungsereignisse an D-0129 angleichen

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Owner: A02 SIMULATION (Ausführung durch A01 gemäß Nutzerauftrag)
Fachreview: A03 ACCOUNTING_FINANCE
UI-Review: A05 FRONTEND
QA: A09 QA
Priorität: HIGH

**Aufgabe**

Den Browser-Prototyp und seine Tests an die bereits festgelegte V1-Ereignisreihenfolge aus D-0120, D-0126 und D-0129 anpassen. Es werden keine neuen Zahlungs-, Steuer- oder Darlehensregeln entschieden.

**Befund im Checkout**

Der aktuelle Ablauf in prototype/app.js ruft nach dem Tagesfortschritt Kundeneingänge, offene Kosten-Retries, Dispozinsberechnung, SimTAX-Zahlung und danach Maschinenkreditraten auf. Das weicht von D-0129 ab, das die Maschinenrate vor den übrigen eigenen Zahlungen vorsieht. Die Spielerreihenfolge eigener Zahlungen muss im UI sichtbar und tatsächlich wirksam sein.

**Zielreihenfolge gemäß Decision Log**

1. Fällige Kundeneingänge ohne eigenes Cash-Gate buchen; daraus Disposchuld zuerst gemäß D-0126 reduzieren.
2. Fällige Maschinenrate und Maschinenkredit-Retries als eigenen Kreditfluss vollständig versuchen.
3. Übrige fällige eigene Rechnungen/Verbindlichkeiten in der vom Spieler festgelegten Reihenfolge voll bezahlen; bei Unterdeckung nur den manuellen Fehlbetragsabruf gemäß D-0125 anbieten. Keine Teilzahlung oder negative Liquidität.
4. Nach den Versuchen offene Posten aktualisieren; an diesem Tag fällige Erinnerungen/Mahnungen nur für weiterhin offene Posten auslösen.
5. Den täglichen Dispozins genau einmal auf Basis des gezogenen Tagessaldos berechnen (Actual/365, keine Tagesrundung); am Monatsende die Monatssumme einmalig auf Cent runden und als Sammelposten belasten. Verschobene Ereignisse dem Monat ihres wirksamen Simulationstags zuordnen.

**Abnahmekriterien**

- Implementierter Ereignisablauf stimmt mit D-0120/D-0126/D-0129 überein; Maschinenkredit bleibt getrennt vom allgemeinen Dunning.
- Spielerreihenfolge eigener fälliger Zahlungen lässt sich im Browser festlegen und beeinflusst die tatsächlichen Vollzahlungsversuche deterministisch.
- Manuelle Dispoziehung bleibt exakt auf den Fehlbetrag begrenzt; automatische Ziehung, Teilzahlung und negative Liquidität entstehen nicht.
- Monatlicher Dispozins wird nicht doppelt berechnet oder gebucht und behält die festgelegte Actual/365-/Rundungsregel.
- Gezielte Regressionen prüfen taggleiche Kundeneingänge, Dispo-Rückführung, knappe Liquidität, Maschinenrate, eigene Rechnungen, Retry/Mahnung und Monatswechsel.
- Bestehender Jahreslauf-Smoke-Test läuft mindestens 365 Tage; Browseransicht einschließlich mobilem UI bleibt bedienbar.
- Änderungsbericht, QA-Ergebnis und Checkpoint; git diff --check erfolgreich.
- Keine Schema-, Datenbank-, Supabase-, Dependency- oder Architekturänderung; keine Architekturfreigabe.

**Abgrenzung**

D-0010 und bestehende Nutzerentscheidungen bleiben maßgeblich. Falls der Code eine D-Entscheidung nicht abbilden kann, wird die Abweichung an A01 dokumentiert statt eine neue Produktregel einzuführen.

Ergebnis: Tagesablauf folgt Kundeneingang/Disporückführung, Maschinenrate, priorisierten eigenen Betriebsposten, SimTAX und Dispozins. Manuelle Dispoziehung bleibt auf den Fehlbetrag begrenzt. SimTAX hat im V1-Modell eine feste Fälligkeit und wird nach den priorisierten Betriebsposten automatisch versucht; sie wird nicht als frei umsortierbare Lieferantenrechnung angeboten. Regression und Jahreslauf: [CP-0185](checkpoints/CP-0185.md).

---
### T-0014 – Geschäftsnetzwerk und Personalentwicklung in V1

Status: COMPLETED (2026-10-27; CP-0179)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR (führt A02/A03/A05/A09-Arbeit selbst aus)
Priorität: HIGH

Auf Nutzerauftrag wurden drei fiktive Wettbewerber sowie je fünf Kunden und Lieferanten samt dynamischen Beziehungen, Marktvergabe, Bezugsabhängigkeit, Materialvorlauf und Kundenzahlungsmoral ergänzt. Arbeitsplanung enthält Weiterbildungskurse und eine zweijährige duale Metalltechnik-Ausbildung mit Berufsschule, Betreuung und Monatskosten.

Akzeptanz: mobil erreichbare Netzwerk-/Lernseiten, Datenmigration aus V1-Spielstand, deterministische Jahresläufe inklusive Marktverlust, Zahlungseingangsverzug, Lieferverzug, Kursabschluss und Ausbildungsfortschritt, Rechtsannahmen dokumentiert. Keine Schemaänderung/Architekturfreigabe. Nachweis: [CP-0179](checkpoints/CP-0179.md).

---

### T-0013 – V1-Jahresmodell, Arbeitsplanung und Betriebsressourcen

Status: COMPLETED (2026-10-27; CP-0178)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR (führt A02/A03/A05/A09-Arbeit selbst aus)
Priorität: HIGH

Auf ausdrücklichen Nutzerauftrag wurde die Browser-V1 um ein Jahresszenario mit synthetischer Volkswirtschaft, Auftragsplanung, Urlaub/Krankheit/Moral, Zeitarbeit, Raumkapazitäten und Mietkosten erweitert. Fehlende Detailentscheidungen wurden als reversible, klar markierte V1-Modellannahmen festgelegt. Keine Schemaänderung, Architekturfreigabe, Commit oder Push.

Akzeptanz: 365-Tage-Lauf, Auftragserzeugung und -abschluss, Finanzperioden, Personalabwesenheiten, Zeitarbeit, Lager-/Raumgrenzen, Browserauslieferung, Rechtsrahmen dokumentiert. Nachweis: [CP-0178](checkpoints/CP-0178.md).

---

### T-0012 – Spielbare Browser-V1 als Prototyp erstellen

Status: COMPLETED (2026-10-27; CP-0159)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR (führt A02/A03/A05/A09-Arbeit selbst aus)
Priorität: HIGH

Aufgabe:

Auf ausdrücklichen Nutzerauftrag eine schnell spielbare, lokal im Browser ausführbare V1 erstellen. Bestätigte Entscheidungen haben Vorrang; fehlende Startwerte bleiben sichtbar offen. Keine Schemaänderung oder Architekturfreigabe.

Akzeptanzkriterien:

- responsives mobiles Browser-UI mit lokalem Spielstand und Tages-/Wochenfortschritt
- A02-Auftrags-/Kapazitätsabläufe, Lieferung, Abnahme, automatische Kundenrechnung soweit Vertragswert vorliegt, Fälligkeit und Kundeneingang abgebildet
- A03-Eröffnungsbilanz/SimTAX korrekt; unbelegte Preise und Kosten nicht als bestätigte Werte ausgeben
- lokale Startanleitung, Syntax-/Browserprüfung, Checkpoint und `git diff --check`
- keine externe Abhängigkeit, Datenbankschemaänderung, Commit oder Push ohne gesonderten Auftrag

Grundlage: Nutzerauftrag vom 2026-10-27 nach erfolgtem Push; dieser Auftrag hebt T-0010s damaligen Implementierungsausschluss für den Prototyp auf, ohne T-0010 als Spezifikationsarbeit abzuschließen.

---


### T-0010 – A02-Spezifikation für erste spielbare Version überarbeiten

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION
Priorität: HIGH

Aufgabe:

Die bestehende A02-Spezifikation nach Abschluss der P0-Koordination und Bereitstellung fachlich geprüfter Startwerte erneut prüfen und vor der ersten spielbaren Version sinnvoll ersetzen/überarbeiten. Die bestätigte Warengruppenauswahl gemäß D-0095 integrieren. Norm-/Zukaufteile gemäß D-0096 als nachvollziehbare Artikel statt als einen Durchschnittspreis-Sammelposten abbilden; Schrauben, Muttern und Teile anderer Hersteller sind ausdrücklich Teil der vorgesehenen Gruppe. A02 bestimmt die operative Produkt-/Verbrauchsstruktur, erfindet aber keine Marktpreise und keine A03-Finanzregeln.

Abhängigkeiten:

- T-0008 hat die dafür benötigten Nutzerentscheidungen und Fachübergaben koordiniert.
- T-0011 liefert belegte, als Vorschläge gekennzeichnete Markt-/Referenzdaten.
- A03 bestätigt Startbewertung, Preisbehandlung, Anfangsmengen und accountingrelevante Werte in eigener Fachverantwortung.

Akzeptanzkriterien:

- A02-Spezifikation ist als reproduzierbares Startprofil für eine erste spielbare Version überarbeitet oder durch ein nachvollziehbares Ersatzdokument abgelöst.
- Bestehende bestätigte Simulationsregeln und D-0010-Scope bleiben erhalten.
- Die vom Nutzer bestätigten V1-Warengruppen aus D-0095 werden berücksichtigt; Dienstleistungen/Versorgungsleistungen werden nicht automatisch als Lagerbestand oder Materialverbrauch modelliert.
- Norm-/Zukaufteile sind nicht länger nur ein aggregierter Durchschnittspreis-Sammelposten; Artikeltypen, Einheiten, Mengen und Verbrauchsbezüge sind nachvollziehbar spezifiziert.
- Preise und Anfangswerte stammen aus bestätigten Quellen-/Nutzerwerten; offene A03-Regeln bleiben als offen markiert.
- Änderungsbericht und Checkpoint; `git diff --check`.
- Keine Implementierung, Datenbank-/Supabase-/Schema-/Dependency-/Architekturänderung und keine Architekturfreigabe.

Grundlage: D-0092 bis D-0096, CP-0118 bis CP-0120. Start erst nach den genannten Abhängigkeiten.

Abschlussnachweis: A02-Startprofil, D-0095-Gruppen und artikelbezogene Norm-/Zukaufteile mit Einheiten/Mengen/Verbrauchsbezügen ergänzt; Preise außerhalb D-0128 bleiben Referenzen. A02-Bericht a02-t0010-v1-startprofil-aenderungsbericht.md; CP-0182.

---

### T-0011 – Marktdaten und Referenzwerte für ausgewählte V1-Warengruppen recherchieren

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A08 RESEARCH
Priorität: HIGH

Aufgabe:

Für die vom Nutzer bestätigten V1-Warengruppen gemäß D-0095 nachvollziehbare aktuelle Markt-/Referenzdaten und realistische Szenariovorschläge recherchieren. Für Norm-/Zukaufteile sind konkrete, repräsentative Artikel wie Schrauben, Muttern und Zukaufteile anderer Hersteller gesondert auszuweisen statt nur eines gemittelten Gruppenpreises. Daten sind mit Quelle, Erhebungs-/Gültigkeitsdatum, Region, Spezifikation, Einheit, Preisbasis und Einschränkungen zu dokumentieren. Die Ergebnisse bleiben Vorschläge bis zur Nutzerbestätigung; A08 entscheidet keine Simulation-, Accounting- oder Produktregel.

Akzeptanzkriterien:

- Quellen und Preis-/Referenzdatum für jede untersuchte Position nachvollziehbar dokumentiert.
- Einzelartikel und Einheiten für Norm-/Zukaufteile werden vorgeschlagen; keine stillschweigende Mittelung der Gruppe.
- Für Dienstleistungen und Versorgungsleistungen werden geeignete Preis-/Einheitenbezüge ausgewiesen und von Lagergütern unterschieden.
- Fehlende, nicht vergleichbare oder nicht belastbare Daten werden als Lücke gekennzeichnet; keine Ersatzwerte erfinden.
- Vorschlagspaket an A01 mit offenen Nutzerentscheidungen; keine Preise als bereits beschlossen darstellen.
- Änderungsbericht und Checkpoint; `git diff --check`.
- Keine Anwendungscode-, Datenbank-/Supabase-/Schema-/Dependency-/Architekturänderung.

Grundlage: D-0093 bis D-0096 und CP-0118 bis CP-0120. Ergebnisse sind Input für T-0010 und für A03s Bewertung unter T-0008.

Abschlussnachweis: Datierter A08-Referenzscan mit Quellen, Preisbasis, Einschränkungen und Datenlücken; nur D-0128-Preise sind als Startwerte festgelegt. CP-0182.

---

### T-0008 – P0-Fachparameter koordinieren und entscheidungsreif vorbereiten

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe:

Die in CP-0031 und den Fachunterlagen offenen P0-Parameter geordnet koordinieren. A01 koordiniert ausschließlich; keine Fachentscheidung, Implementierung oder Architekturfreigabe. Die dokumentierten Nutzerentscheidungen D-0013 bis D-0127 und die Fachabgleiche CP-0148 ff. sind übernommen; nur tatsächlich offene Parameter und Fachabstimmungen werden weiterverfolgt. A02 hat D-0011 unter T-0009 übernommen; T-0009 ist mit CP-0150 abgeschlossen. Operative Ereignis-/Periodenabstimmungen mit A03 bleiben als getrennte Arbeit unter T-0008 offen.

Akzeptanzkriterien:

- P0-Entscheidungsvorlage mit gesicherten Regeln, präzisen offenen Fragen, Fachrollen und Auswirkungen erstellt
- A02-Abgleich CP-0150/CP-0153, A03-Abgleich CP-0148/CP-0154, A04-Abgleich CP-0151 und A02/A03-Bericht CP-0155 korrekt referenziert; keine nicht erfolgte Arbeit behauptet
- Abhängigkeiten zwischen Kalender-/Simulationsregeln und Finanzregeln dokumentiert
- Kundeneingänge ohne eigenes Cash-Gate und eigene Auszahlungen mit eigenem Liquiditäts-Gate getrennt gehalten
- Beschlossene Darlehensart, Restlaufzeit, Monatsrhythmus, ersten Zahlungstermin und konkrete Rate (D-0121/22) sowie Zinslogik gemäß D-0030 bis D-0043 als entschieden behandeln; A03-Berechnung und A02-Übernahme in CP-0161/0162 dokumentieren
- A03-Abgleich CP-0148/CP-0154 integrieren; A02-T-0009/CP-0150 und CP-0153 sowie A04-CP-0151 und A02/A03-CP-0155 korrekt referenzieren.
- A04-Abschlussabgleich CP-0151, A02-Startprofilkorrektur CP-0153, Vorratsabgleich CP-0154 und Ereignisabstimmung CP-0155 integrieren; aktive Steuerungs- und Fachunterlagen gegen Decision Log und CP-0148 bis CP-0155 validieren.
- D-0010 und ADR-Status unverändert; keine Anwendungscode-, Schema-, Datenbank-, Supabase-, Dependency- oder Architekturänderung
- nächster Nutzerentscheidungs-/Fachübergabepunkt dokumentiert

Historische Zwischenstandsnotizen weiter unten dokumentieren jeweils den damaligen Stand. Der Stand CP-0156 ist durch CP-0180 und die neueren Entscheidungen D-0120 bis D-0127 überholt.

Ergebnisdokument: [P0-Koordinierung offener Fachparameter](p0-offene-parameter-koordinierung.md); Checkpoint [CP-0032](checkpoints/CP-0032.md).

### Historischer Koordinierungsstand (CP-0149)

A03 hat die Finanzunterlagen gegen den Decision Log abgeglichen; siehe [CP-0148](checkpoints/CP-0148.md) und [Abgleichbericht](../accounting/a03-decision-log-abgleich-bericht.md). T-0009 war zu diesem historischen Stand PENDING; A02 hat die Arbeit später ausgeführt und CP-0150 erstellt. A04s CP-0151 lag ebenfalls noch nicht vor.

### Historischer Koordinierungsstand nach A02-/A04-Abgleich (CP-0152; fortgeschrieben durch CP-0153 bis CP-0155)

A02 hat D-0011 übernommen und T-0009 mit CP-0150 abgeschlossen. A04 hat den Datenmodellabgleich in CP-0151 abgeschlossen; A03s Finanzabgleich ist in CP-0148 dokumentiert. T-0008 bleibt IN_PROGRESS und koordiniert die verbleibenden A02/A03-Ereignis- und Periodenabstimmungen. Die Gesamtvalidierung ist noch nicht bestanden: Die A02-Spezifikation enthält im Startprofil weiterhin 40.000 € CNC-Buchwert (D-0099/CP-0148: 0 €) und 3,20 €/kg Stahl (D-0091: Wert aus bereitgestelltem Vorjahresschluss; 3,20 € nicht bestätigt). A02 muss diese alten Angaben aktualisieren oder klar als historische/unbestätigte Vorschläge kennzeichnen. Kein Sicherungs-Commit/Push bis dahin. Nachweise: [CP-0148](checkpoints/CP-0148.md), [CP-0150](checkpoints/CP-0150.md), [CP-0151](checkpoints/CP-0151.md), [CP-0152](checkpoints/CP-0152.md).

### Historischer A01-Koordinierungsstand nach CP-0155 (CP-0156; durch CP-0180 überholt)

A02 hat D-0011 unter T-0009 übernommen; T-0009 ist abgeschlossen (CP-0150). Die aktiven Startprofilangaben wurden gemäß D-0091/D-0099 korrigiert (CP-0153). A03 bestätigt den Gesamtvorratswert von 12.800 €, aber keine bestätigten Einzelgruppenwerte; ein Stahlwert wird nicht als Differenz hergeleitet (CP-0154). A04 hat den Datenmodellabgleich abgeschlossen (CP-0151). A02/A03 haben bestätigte Finanz-/Simulationsregeln und verbleibende Ereignis-/Periodenlücken abgeglichen (CP-0155).

T-0008 bleibt IN_PROGRESS; T-0009 ist COMPLETED. Die Dokumentationsvalidierung ist mit CP-0156 bestanden. Offen bleiben die Nutzerfrage zur Verfügbarkeit gleichentägiger Kundeneingänge vor eigenen Zahlungsversuchen bei knappem Cash, technische Ereignis-/Periodendetails, Darlehensrate und erster tatsächlicher Zahlungstermin sowie die Übergabe belegter Vorratswerte. Die Nutzerfrage bleibt bis nach der Sicherung zurückgestellt. Gesamtvalidierung der aktiven Dokumente bestanden; Sicherungs-Checkpoint: CP-0156. Nachweise: CP-0148 bis CP-0156.

Zwischenstand 2026-10-25: A03 hat die Finanzparameter entscheidungsreif aufbereitet; [A03-Entscheidungsvorlage](../accounting/a03-p0-finanzparameter-entscheidungsvorlage.md), [Änderungsbericht](../accounting/a03-p0-finanzparameter-aenderungsbericht.md) und [CP-0035](checkpoints/CP-0035.md). Kein separates A03-Ticket angelegt. A02-Abstimmung zu Fälligkeit/Ereignisbezug bleibt nach T-0009 und Nutzerantworten offen. Koordinationsnachweis: [CP-0037](checkpoints/CP-0037.md).

Nutzerentscheidung D-0013: Für Kundenforderungen gilt der spätere Zeitpunkt aus Rechnung und tatsächlicher Leistung als Fristanker; bei Leistung ausschließlich durch Lieferung gilt das Lieferdatum. Lieferanten-Fristanker und Zähltage sind davon nicht entschieden. Nutzerfragen werden einzeln gestellt. Nachweis: [CP-0038](checkpoints/CP-0038.md).

Nutzerentscheidung D-0014: Für V1-Lieferantenverbindlichkeiten gilt bei pünktlicher Lieferung das Rechnungsdatum als Fristanker; spätere Vertragsausgestaltungen dürfen gemäß jeweiliger Vereinbarung einen anderen Anker, etwa Wareneingang, nutzen. Zähltage und 14-/30-Tage-Wahl bleiben offen. Nachweis: [CP-0039](checkpoints/CP-0039.md).

Nutzerentscheidung D-0015: Zahlungsziele für Kundenforderungen zählen in V1 Kalendertage; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Ankertagszählung sowie die Zählweise für Lieferantenverbindlichkeiten bleiben offen. Nachweis: [CP-0040](checkpoints/CP-0040.md).

Nutzerentscheidung D-0016: Zahlungsziele für Lieferantenverbindlichkeiten zählen in V1 ebenfalls Kalendertage; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Die Ankertagszählung bleibt offen. Nachweis: [CP-0041](checkpoints/CP-0041.md).

Nutzerentscheidung D-0017: Bei Kundenforderungen und Lieferantenverbindlichkeiten zählt der jeweilige Ankertag als Tag 1; damit gilt vor Wochenendverschiebung Ankerdatum + (N−1) Kalendertage. Nachweis: [CP-0042](checkpoints/CP-0042.md).

Nutzerentscheidung D-0018: Für Kundenforderungen gilt in V1 gemäß AGB ein Zahlungsziel von 14 Kalendertagen. Einzelvereinbarungen sind möglich und können bei kundenspezifischen Sonderwünschen eine höhere Marge ermöglichen; konkrete abweichende Frist und Margenformel bleiben offen. Nachweis: [CP-0043](checkpoints/CP-0043.md). Die nächste Rückfrage klärt, ob 30 Kalendertage die vorgesehene konkrete V1-Alternative für Einzelvereinbarungen sind.

Nutzerentscheidung D-0019: Die konkrete V1-Alternative bei individueller Kundenvereinbarung beträgt 30 Kalendertage; die Margenformel bleibt offen. Nachweis: [CP-0044](checkpoints/CP-0044.md).

Nutzerentscheidung D-0020: Für Lieferantenverbindlichkeiten gelten standardmäßig 30 Kalendertage; Abweichungen sind in Ereignissen oder Dauerverträgen möglich. Konkrete Sonderkonditionen bleiben offen. Nachweis: [CP-0045](checkpoints/CP-0045.md).

Nutzerentscheidung D-0021: Der Spieler wählt, welche fälligen eigenen Rechnungen zuerst bezahlt werden; die Nutzung eines Dispositionskredits wird als weitere Option angeboten, mit einem Zinssatz 8 Basispunkte über dem durchschnittlichen Zinssatz. Bezugsgröße des Durchschnittszinses sowie Kreditregeln, Maximalverschuldung und Insolvenz sind offen und separat zu prüfen. Nachweis: [CP-0046](checkpoints/CP-0046.md).

Nutzerentscheidung D-0022/D-0023: Der Bankzinssatz wird zu Spielbeginn und jährlich individuell auf Basis EZB-Zinssatz plus Unternehmensaufschlag anhand Eigenkapitalquote, Bilanzsumme und Zahlungsmoral vereinbart. Mittelwert: EZB +3 Prozentpunkte; Spanne: +0,5 bis +5,5 Prozentpunkte. Der Dispositionskreditzins liegt 8 % über diesem individuell vereinbarten Zinssatz. EZB-Referenzsatz und Bewertungsformel bleiben offen; Kreditregeln/Maximalverschuldung/Insolvenz sind separat zu prüfen. Nachweis: [CP-0047](checkpoints/CP-0047.md).

Nutzerentscheidung D-0024: Nach fehlgeschlagenem Zahlversuch einer eigenen Verbindlichkeit erfolgt der nächste Versuch nach einer Woche. Anzahl/Ende und genauer Bezugspunkt der Wochenfrist bleiben offen. Nachweis: [CP-0048](checkpoints/CP-0048.md).

Nutzerentscheidung D-0025: Nach achtmaligem Scheitern gilt das Spiel als verloren. Noch offen ist, ob der erste fehlgeschlagene Fälligkeitsversuch bereits mitzählt. Nachweis: [CP-0049](checkpoints/CP-0049.md).

Nutzerklarstellung D-0026: Gemeint sind acht Wiederholungsversuche nach dem ersten fehlgeschlagenen Fälligkeitsversuch. Nach dem achten fehlgeschlagenen Retry ist das Spiel verloren. Nachweis: [CP-0050](checkpoints/CP-0050.md).

Nutzerentscheidung D-0027: Die erste Zahlungserinnerung wird zehn Kalendertage nach dem ersten fehlgeschlagenen Zahlversuch ausgelöst. Weitere Mahnstufen bleiben offen. Nachweis: [CP-0051](checkpoints/CP-0051.md).

Nutzerentscheidung D-0028: Die formelle Mahnung wird 14 Kalendertage nach der Zahlungserinnerung ausgelöst. Dies ist eine V1-Spielregel, keine gesetzlich vorgeschriebene Frist nach § 286 BGB. Nachweis: [CP-0052](checkpoints/CP-0052.md).

Nutzerentscheidung D-0029: Nach der formellen Mahnung erfolgt in V1 keine weitere Eskalation bis Pfändung oder Liquidation; solche Ereignisse sind für spätere Versionen vorgesehen. Nachweis: [CP-0053](checkpoints/CP-0053.md).

Nutzerentscheidung D-0030: Das Maschinendarlehen ist ein gleichbleibendes Annuitätendarlehen. Restlaufzeit, Rate, Zahlungstermine, Tilgungsbeginn und Zinsberechnung bleiben offen. Nachweis: [CP-0054](checkpoints/CP-0054.md).

Nutzerentscheidung D-0031: Zum Simulationsstart am 01.01.2027 beträgt die Restlaufzeit des Annuitätendarlehens sieben Jahre. Ratenfrequenz und konkrete Zahlungstermine bleiben offen. Nachweis: [CP-0055](checkpoints/CP-0055.md).

Nutzerentscheidung D-0032: Die Annuität wird monatlich gezahlt. Erste Rate, monatlicher Zahlungstag und Annuitätenhöhe bleiben offen. Nachweis: [CP-0056](checkpoints/CP-0056.md).

Nutzerentscheidung D-0033: Die Monatsrate ist am letzten Geschäftstag des Monats fällig. Gemäß D-0011 ist für Januar 2027 der erste Termin Freitag, 29.01.2027; Feiertage bleiben unberücksichtigt. Annuitätenhöhe und Zinsberechnung bleiben offen. Nachweis: [CP-0057](checkpoints/CP-0057.md).

Nutzerentscheidung D-0034: Der Darlehenszins wird nach 30/360 zeitanteilig berechnet. Konkrete Monatsend-Variante und Bezugsbasis innerhalb der Zinsperiode bleiben offen. Nachweis: [CP-0058](checkpoints/CP-0058.md).

Nutzerentscheidung D-0035: Es gilt die deutsche Zinsmethode 30E/360; damit ist die konkrete Monatsend-Variante festgelegt. Die Zinsbezugsbasis innerhalb der Periode bleibt offen. Nachweis: [CP-0059](checkpoints/CP-0059.md).

Nutzerentscheidung D-0036: Verzinst wird das Restschuldsaldo. Die Rundungsregel für monatliche Zinsbeträge bleibt offen. Nachweis: [CP-0060](checkpoints/CP-0060.md).

Nutzerentscheidung D-0037: Monatliche Darlehenszinsen werden kaufmännisch auf Cent gerundet. Nachweis: [CP-0061](checkpoints/CP-0061.md).

Nutzerentscheidung D-0038: Ein aus der kaufmännischen Cent-Rundung verbleibender Darlehensrest wird in der letzten Rate bezahlt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0062](checkpoints/CP-0062.md).

Nutzerentscheidung D-0039: Der nominale Darlehenszinssatz von 5 % p.a. gilt während der siebenjährigen Restlaufzeit fest. Nachweis: [CP-0063](checkpoints/CP-0063.md).

Nutzerentscheidung D-0040: Darlehenszinsen werden zusammen mit der monatlichen Annuitätenrate gezahlt. Der Stichtag für das maßgebliche Restschuldsaldo bleibt offen. Nachweis: [CP-0064](checkpoints/CP-0064.md).

Nutzerentscheidung D-0041: Für die Zinsperiode gilt der Kalendertag vor der nächsten Rate als Stichtag des maßgeblichen Restschuldsaldos. Nachweis: [CP-0065](checkpoints/CP-0065.md).

Nutzerentscheidung D-0042: Nichtzahlung einer Maschinenrate führt sofort zu Verzug und wöchentlichen Wiederholungsversuchen. Bei insgesamt drei nicht gezahlten Raten wird die Maschine gepfändet und zum aktuellen Marktwert liquidiert; Erlös tilgt das Darlehen, Überschuss wird dem Geschäftskonto gutgeschrieben. Folgen eines Erlösdefizits bleiben offen. Nachweis: [CP-0066](checkpoints/CP-0066.md).

Nutzerentscheidung D-0043: Eine nach der Maschinenverwertung verbleibende Restschuld erlischt, da die Maschine als Pfand für den Kredit akzeptiert wurde. Nachweis: [CP-0067](checkpoints/CP-0067.md).

Nutzerentscheidung D-0044: V1 soll relevante Ressourcen und Produkte in einem Hintergrund-Wirtschaftssystem tracken. Marktpreise werden als statische Zahlen mit linearer jährlicher Preissteigerung von 2 % modelliert; Maschinen und andere Güter verlieren gemäß fester Nutzungsdauer anteilig an Wert. Maschinenmarktwert bei Verwertung: jährlich um 2 % angepasster Neupreis abzüglich des Wertverlusts aus laufender Nutzung. Konkrete Formel, Basispreise und Nutzungsdauern bleiben offen. Nachweis: [CP-0068](checkpoints/CP-0068.md).

Nutzerentscheidung D-0045: Die geplante Gesamtnutzungsdauer der vorhandenen, bei Simulationsstart acht Jahre alten CNC-Fräsmaschine beträgt 16 Jahre. Damit verbleiben rechnerisch acht Jahre. Der Eröffnungsbuchwert von 40.000 € bleibt unberührt; genaue Marktwert- und Abschreibungsberechnung bleibt offen. Nachweis: [CP-0069](checkpoints/CP-0069.md).

Nutzerentscheidung D-0046: Der ursprüngliche Anschaffungswert von 120.000 € gilt als statischer V1-Basispreis der CNC für die lineare jährliche Preissteigerung von 2 %. Die konkrete Verrechnung mit dem Wertverlust nach Nutzungsdauer bleibt offen. Nachweis: [CP-0070](checkpoints/CP-0070.md).

Nutzerentscheidung D-0047: Der inflationsangepasste CNC-Neupreis beträgt `120.000 € × 1,02^(aktuelles Jahr − Startjahr)`. Die Abwertung aufgrund bisheriger Nutzung bleibt offen. Nachweis: [CP-0071](checkpoints/CP-0071.md).

Nutzerentscheidung D-0048: Zum Simulationsstart wird wegen acht bereits genutzter Jahre bei 16 Jahren Gesamtnutzungsdauer ein Nutzungswertverlust von 50 % angesetzt; der Marktwertansatz beträgt damit 50 % des inflationsangepassten Neupreises. Die Fortschreibung nach Simulationsstart bleibt offen. Nachweis: [CP-0072](checkpoints/CP-0072.md).

Nutzerentscheidung D-0049: Der Restwertfaktor lautet `(maximale Nutzungsdauer − genutzte Dauer) / maximale Nutzungsdauer` und wird mit dem Anschaffungswert multipliziert. Offen: welcher Anschaffungswert als Multiplikator gilt und ob eine Untergrenze bei Überschreiten der maximalen Nutzungsdauer gilt. Nachweis: [CP-0073](checkpoints/CP-0073.md).

Nutzerentscheidung D-0050: Der Restwertfaktor wird immer auf Grundlage des Anschaffungspreises angewendet. Offen bleibt, ob und wie die jährliche Preisfortschreibung zusätzlich in den Verwertungsmarktwert einfließt. Nachweis: [CP-0074](checkpoints/CP-0074.md).

Nutzerentscheidung D-0051: Der CNC-Restwert berechnet sich ausschließlich aus dem ursprünglichen Anschaffungspreis von 120.000 € mal Restwertfaktor; die jährliche Preisfortschreibung fließt nicht ein. Untergrenze bei Überschreiten der maximalen Nutzungsdauer bleibt offen. Nachweis: [CP-0075](checkpoints/CP-0075.md).

Nutzerentscheidung D-0052: Der Restwert wird bei 0 € begrenzt; ein negativer rechnerischer Wert bei Erreichen/Überschreiten der maximalen Nutzungsdauer wird auf 0 € gesetzt. Nachweis: [CP-0076](checkpoints/CP-0076.md).

Nutzerentscheidung D-0053: SimTAX-Bemessungsbasis je Rechnungsposition ist der bestätigte Positionswert vor SimTAX. Rundungsdetails bei exakt halbem Cent und Anwendungsbereich bleiben offen. Nachweis: [CP-0077](checkpoints/CP-0077.md).

Nutzerentscheidung D-0054: SimTAX-Beträge werden bei exakt halben Centbeträgen kaufmännisch gerundet, weiterhin je Rechnungsposition und danach summiert. Nachweis: [CP-0078](checkpoints/CP-0078.md).

Nutzerentscheidung D-0055: SimTAX wird je Rechnungsposition auf den Positionsgesamtbetrag angewendet und kaufmännisch gerundet; keine Berechnung je einzelner Einheit. Nachweis: [CP-0079](checkpoints/CP-0079.md).

Nutzerentscheidung D-0056: SimTAX gilt bei jeder externen Rechnungsstellung. Steuerzahlungen und innerbetriebliche Ausgleiche sind ausgenommen; eingehende externe Rechnungen werden dadurch nicht automatisch klassifiziert. Nachweis: [CP-0080](checkpoints/CP-0080.md).

Nutzerentscheidung D-0057: Bei Rechnungskorrekturen wird der ursprüngliche gerundete SimTAX-Betrag referenziert umgekehrt und die Korrektur separat ausgewiesen. Nachweis: [CP-0081](checkpoints/CP-0081.md).

Nutzerentscheidung D-0058: SimTAX erhält eine getrennte Rechnungskomponente und eigene Simulationssaldo-Sicht zum Gegenrechnen von Vorsteuer/Umsatzsteuer; Zahlung gemäß Grundsätzen von UStG und AO. Abrechnungszeitraum und Zahlungsmechanik bleiben offen. Nachweis: [CP-0082](checkpoints/CP-0082.md).

Nutzerentscheidung D-0059: Der SimTAX-Abrechnungszeitraum richtet sich nach dem UStG; konkrete Eingangsparameter zur Periodenbestimmung und Zahlungsmechanik sind noch offen. Nachweis: [CP-0083](checkpoints/CP-0083.md).

Nutzerszenariowert D-0060: Für 2026 wird fiktiv ein Umsatz von 5.000 € pro Woche angenommen. Dieser Wert wird nicht zur Ableitung des für die Periodenwahl maßgeblichen Steuerbetrags verwendet. Nachweis: [CP-0084](checkpoints/CP-0084.md).

Nutzerszenariowert D-0061: Für 2026 wird ein fiktiver maßgeblicher Umsatzsteuerbetrag von 49.400 € als Vorjahresparameter für die SimTAX-Periodenbestimmung gemäß UStG angesetzt; der Betrag wird nicht aus D-0060 abgeleitet. Die konkrete Zahlungsmechanik bleibt offen. Nachweis: [CP-0085](checkpoints/CP-0085.md).

Nutzerentscheidung D-0062: Der MGK-Zuschlag im V1-BAB beträgt 15 % der MEK; übernommen aus dem A03-Arbeitsvorschlag. Weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0086](checkpoints/CP-0086.md).

Nutzerentscheidung D-0063: Der FGK-Zuschlag im V1-BAB beträgt 100 % der Fertigungslöhne; übernommen aus dem A03-Arbeitsvorschlag. Weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0087](checkpoints/CP-0087.md).

Nutzerentscheidung D-0064: Der Vw/Vt-GK-Zuschlag im V1-BAB beträgt 10 % der Herstellkosten; übernommen aus dem A03-Arbeitsvorschlag. Weitere Zuordnungen und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0088](checkpoints/CP-0088.md).

Nutzerentscheidung D-0065: Die monatliche Bruttolohnsumme des Personals im V1-Startprofil beträgt insgesamt 10.400 €. Rollenaufteilung, Arbeitgebergesamtkosten und FGK-Bemessungsbasis bleiben offen. Nachweis: [CP-0089](checkpoints/CP-0089.md).

Nutzerentscheidung D-0066: Fertigungslöhne für den 100-%-FGK-Zuschlag sind MA-CNC (3.800 €) plus MA-PROD (3.100 €), zusammen 6.900 € monatlich; MA-AV zählt nicht dazu. Arbeitgebergesamtkosten bleiben offen. Nachweis: [CP-0090](checkpoints/CP-0090.md).

Nutzerentscheidung D-0067: Arbeitgebergesamtkosten werden zusätzlich zu den Bruttolöhnen im V1-Personalaufwand berücksichtigt; Betrag und Berechnungsregel bleiben offen. Nachweis: [CP-0091](checkpoints/CP-0091.md).

Nutzerentscheidung D-0068: Arbeitgebergesamtkosten werden mit 21 % der monatlichen Bruttolohnsumme von 10.400 € angesetzt (2.184 € zusätzlich; 12.584 € Personalaufwand insgesamt pro Monat). Nachweis: [CP-0092](checkpoints/CP-0092.md).

Nutzerentscheidung D-0069: Die Arbeitgeberkosten von 21 % auf MA-CNC/MA-PROD zählen zur FGK-Basis; diese beträgt 8.349 € monatlich und ergibt bei 100 % Zuschlag 8.349 € FGK. MA-AV bleibt ausgeschlossen. Nachweis: [CP-0093](checkpoints/CP-0093.md).

Nutzerentscheidung D-0070: MA-AV-Personalaufwand von 4.235 € pro Monat inklusive 21 % Arbeitgeberkosten gehört in den Vw/Vt-GK-Pool und wird nicht separat daneben angesetzt; der 10-%-Zuschlag auf HK bleibt bestehen. Nachweis: [CP-0094](checkpoints/CP-0094.md).

Nutzerentscheidung D-0071: CNC-Abschreibung wird in V1 als FGK im BAB berücksichtigt. Abschreibungsbasis, Methode, Zeitraum und Betrag sind noch offen; die Restwert-/Verwertungsregel ist dafür kein automatischer Ersatz. Nachweis: [CP-0095](checkpoints/CP-0095.md).

Nutzerentscheidung D-0072: Die CNC-BAB-Kalkulation soll Wiederbeschaffungskosten einschließlich 2-%-Inflation im maßgeblichen Betrachtungszeitraum berücksichtigen; Zeitraum und Umlegung bleiben offen. Nachweis: [CP-0096](checkpoints/CP-0096.md).

Nutzerentscheidung D-0073: Für den Inflationszeitraum wird die gesamte CNC-Nutzungsdauer von 16 Jahren angesetzt; die acht verbleibenden Jahre sind nicht maßgeblich. Preisbezugsformel: 120.000 € × 1,02^16. Umlegung auf BAB-Periodenkosten und konkrete Buchabschreibung bleiben offen. Nachweis: [CP-0097](checkpoints/CP-0097.md).

Nutzerentscheidung D-0074: Der inflationsangepasste CNC-Wiederbeschaffungswert wird gleichmäßig auf einen Monat der 16-jährigen Gesamtnutzungsdauer verteilt (192 Monate). Monatlicher BAB-Bezugsbetrag: `(120.000 € × 1,02^16) / 192`. Rundung des Monatsbetrags und vollständige Buchabschreibungsbehandlung bleiben offen. Nachweis: [CP-0098](checkpoints/CP-0098.md).

Nutzerentscheidung D-0075: Der monatliche CNC-BAB-Bezugsbetrag wird für die Kalkulation immer aufgerundet. Rundungsgenauigkeit/Einheit und vollständige Buchabschreibungsbehandlung bleiben offen. Nachweis: [CP-0099](checkpoints/CP-0099.md).

Nutzerentscheidung D-0076: Der monatliche CNC-BAB-Bezugsbetrag wird stets auf den nächsten vollen Euro aufgerundet. Bilanzielle Buchabschreibungsbehandlung bleibt davon getrennt offen. Nachweis: [CP-0100](checkpoints/CP-0100.md).

Nutzerentscheidung D-0077: V1 führt zusätzlich zur kalkulatorischen BAB-Kostenbasis eine separate bilanzielle Buchabschreibung der CNC. Methode, Berechnungsbasis, Beginn, Restlaufzeit, Restwert und Betrag sind offen. Nachweis: [CP-0101](checkpoints/CP-0101.md).

Nutzerentscheidung D-0078: Laufende Anschaffungen werden linear nach der AfA-Tabelle des Bundesfinanzministeriums abgeschrieben; die Abschreibungsmethode für Neuanschaffungen wird einmal jährlich festgelegt. AfA-Tabellenposition/Nutzungsdauer der bestehenden CNC und konkrete Abschreibungsparameter bleiben offen. Nachweis: [CP-0102](checkpoints/CP-0102.md).

Nutzerentscheidung D-0079: Die jährliche Festlegung der Abschreibungsmethode für Neuanschaffungen ist eine Spielerentscheidung. Welche Methoden auswählbar sind, bleibt offen. Nachweis: [CP-0103](checkpoints/CP-0103.md).

Nutzerkorrektur D-0080: Die Methodenabfrage erfolgt einmal zu Spielbeginn. Danach kann der Spieler die Methode in einem Menü für zukünftige Neuanschaffungen ändern. Angeboten werden lineare AfA, degressive AfA sowie GWG-Sofortabzug und GWG-Sammelposten unter Berücksichtigung der Grenzen. Die Auswahlregel im GWG-Überschneidungsbereich und die zeitliche Zulässigkeit der degressiven AfA bleiben offen. Nachweis: [CP-0104](checkpoints/CP-0104.md).

Nutzerentscheidung D-0081: Für GWG im Überschneidungsbereich über 250 € bis einschließlich 800 € wird einheitlich je Wirtschaftsjahr zwischen Sofortabzug und Sammelposten entschieden; keine unterschiedliche Wahl je Anschaffung innerhalb desselben Jahres. Nachweis: [CP-0105](checkpoints/CP-0105.md).

Nutzerentscheidung D-0082: Eine im Menü geänderte GWG-Methode wird ab dem nächsten Wirtschaftsjahr wirksam. Nachweis: [CP-0106](checkpoints/CP-0106.md).

Nutzerentscheidung D-0083: Die degressive AfA bleibt auch nach dem derzeit dokumentierten gesetzlichen Zeitraum als vereinfachte Spielregel im Spiel verfügbar. Daraus wird keine steuerrechtliche Zulässigkeit für diesen Zeitraum abgeleitet. Nachweis: [CP-0107](checkpoints/CP-0107.md).

Nutzerentscheidung D-0084: Der degressive AfA-Satz ist der niedrigere Wert aus 30 % und dem Dreifachen des linearen AfA-Satzes; angewendet wird er auf den jeweiligen Restbuchwert. Für spätere Spieljahre gilt dies gemäß D-0083 als vereinfachte Spielregel. Nachweis: [CP-0108](checkpoints/CP-0108.md).

Nutzerentscheidung D-0085: Für die separate lineare bilanzielle Buchabschreibung der bestehenden CNC ist die einschlägige Nutzungsdauer laut BMF-AfA-Tabelle maßgeblich; konkrete Tabellenposition und Restdauer bleiben offen. Nachweis: [CP-0109](checkpoints/CP-0109.md).

Nutzerentscheidung D-0086: Die Bemessungsbasis der CNC-Buchabschreibung sind die ursprünglichen Anschaffungskosten von 120.000 € abzüglich bereits erfolgter AfA; der Eröffnungsbuchwert bleibt 40.000 €. AfA-Verlauf und Restdauer sind fachlich abzugleichen. Nachweis: [CP-0110](checkpoints/CP-0110.md).

Nutzerentscheidung D-0087: Für AfA-Gegenstände im Startbestand ist der Abschreibungstermin der erste Arbeitstag des zweiten Quartals; Neuanschaffungen folgen den jeweils geltenden gesetzlichen Vorgaben. Nachweis: [CP-0111](checkpoints/CP-0111.md).

Nutzerentscheidung D-0088: Am Termin im ersten Arbeitstag des zweiten Quartals wird für die AfA-Gegenstände des Startbestands die AfA des laufenden Wirtschaftsjahrs erfasst. Nachweis: [CP-0112](checkpoints/CP-0112.md).

Abgleich abgeschlossen: Der Nutzer hat den CNC-Anschaffungszeitpunkt auf 01.01.2019 festgelegt. Damit beträgt die Nutzungszeit am Simulationsstart 01.01.2027 genau acht Jahre; D-0045/D-0048 bleiben konsistent. Nachweis: [D-0089](decision-log.md#d-0089--cnc-anschaffungsdatum-auf-01012019-angepasst), [CP-0114](checkpoints/CP-0114.md).

Zwischenstand 2026-10-25: Der Nutzer hat den V1-Arbeitskalender gemäß D-0011 bestätigt. A02-Übernahme in die Simulationsspezifikation und Abstimmung der offenen 14-/30-Tage-Fälligkeit mit A03 stehen noch aus; T-0008 bleibt IN_PROGRESS. Nachweis: [CP-0033](checkpoints/CP-0033.md).

Abschlussnachweis: bestätigte Regeln und V1-Ereignis-/Periodenkonventionen konsolidiert; Erweiterungs- und historische Belegfragen außerhalb V1 markiert. CP-0182.

---

### T-0001 – Agent Control Plane implementieren

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.1
Owner: A10 DEVOPS_INFRASTRUCTURE
Priorität: HIGH

Aufgabe:

AGENTS.md und die strukturierte Agenten-Control-Plane mit Agentenstruktur, Goals, Tickets, Collaboration State, Decision Log, Preflight und Checkpoint-Regeln etablieren.

Akzeptanzkriterien:

- Preflight verbindlich dokumentiert
- A01–A11 definiert
- aktuelle Goals definiert
- Ticketfilter definiert
- abgeschlossene Second-Level Goals aus aktivem Kontext ausgeschlossen
- Checkpoint-Regel dokumentiert
- Kommunikationsformat dokumentiert
- keine Anwendungscodeänderung
- keine Supabaseänderung
- keine Dependencyänderung

Abschlussnachweis: Preflight, Agentenstruktur A01–A11, aktive Goals, Ticketfilter, Checkpoint- und Kommunikationsregeln sind im Repository dokumentiert. CP-0182.

---


### T-0009 – D-0011-Arbeitskalender in A02-Spezifikation übernehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION
Abschlussnachweis: A02-Änderungsbericht und [CP-0150](checkpoints/CP-0150.md).

A02 hat D-0011 in die Simulationsspezifikation übernommen: Montag bis Freitag mit 8 Stunden Tageskapazität für Beschäftigte und CNC, Wochenenden arbeitsfrei, Feiertage in V1 unberücksichtigt, Wochenendtermine am nächsten Arbeitstag und F3 mit fünf Arbeitstagen ab Folgetag nach vollständiger Lieferung. Der aktuelle A02/A03-Ereignis- und Periodenabgleich bleibt als Koordinierungsarbeit unter T-0008 offen; er ändert die bestätigten Vertragsfristregeln D-0013 bis D-0020 nicht. Keine Implementierungs-, Schema- oder Architekturfreigabe.

---

### T-0006 – Maschinenbau-MVP: fachliches und technisches Datenmodell konkretisieren

Status: COMPLETED – A09 QA BESTANDEN (CP-0013)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A04 DATABASE
Priorität: HIGH

Aufgabe und Mindestumfang gemäß D-0010, A02-Simulationsspezifikation und A03-Finanzspezifikation: fachliches/logisches Datenmodell mit vollständiger operativer V1-Abwicklung, differenzierten Finanzbeträgen, statischem/vereinfachtem BAB, festgelegtem Startprofil, offenen Fachentscheidungen und Erweiterungspfaden.

Abschlussnachweis: [Datenmodell](../database/maschinenbau-mvp-datenmodell.md), [CP-0010](checkpoints/CP-0010.md), QA-Erstreview [CP-0011](checkpoints/CP-0011.md), A04-Nachbesserung [CP-0012](checkpoints/CP-0012.md), bestandenes QA-Rereview [CP-0013](checkpoints/CP-0013.md) und finale P0-Gesamtsicherung [CP-0031](checkpoints/CP-0031.md). Die dokumentarische MINOR-Abweichung wurde durch T-0007 bereinigt. Offene Fachparameter bleiben ausdrücklich offen; QA und P0-Validierung sind keine Implementierungs- oder Architekturfreigabe.

---

### T-0005 – Maschinenbau-MVP: Accounting-Wirkungen spezifizieren

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A03 ACCOUNTING_FINANCE
Priorität: HIGH

Aufgabe:

Auf Grundlage der A02-Spezifikation die finanziellen Wirkungen und minimalen Accounting-Übergaben für den Maschinenbau-MVP fachlich spezifizieren. T-0005 ist Analyse-/Spezifikationsarbeit, keine Implementierung.

Akzeptanzkriterien:

- finanzielle Wirkungen für Angebot/Auftrag, Beschaffung/Eingang, Ressourcenverbrauch, Lieferung, Rechnungen, Zahlungen, laufende Kosten und Auftragsergebnis beschrieben
- Zeitpunkt/Bedingungen von Forderungen, Verbindlichkeiten, Umsatz, Kosten und Liquiditätswirkung benannt oder als offen markiert
- MVP-relevante Netto-/Brutto-/Umsatzsteuer-, Materialbewertungs- und Fälligkeitsfragen ausgewiesen, ohne unbelegte Rechts-/Steuerannahmen
- minimale Übergaben von Simulation an Accounting und autoritative Finanzsichten beschrieben
- offene Nutzerentscheidungen und Abhängigkeiten zu A02/A11 kenntlich gemacht
- keine Buchungen, Anwendungscode-, Schema-, Supabase- oder Dependencyänderung
- keine Architekturfreigabe und keine Änderung an D-IDs/ADR-Status

Abschlussnachweis: fachliche Spezifikation [maschinenbau-mvp-finanzspezifikation.md](../accounting/maschinenbau-mvp-finanzspezifikation.md) und Checkpoint [CP-0008](checkpoints/CP-0008.md). Offene Nutzerentscheidungen blockieren die Spezifikation nicht, aber verbindliche Detailregeln und Datenmodellableitung.

---

### T-0002 – Architektur V0.2 als Arbeitsgrundlage sichern

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

A11-Architekturentwurf dauerhaft als vorgeschlagenen Arbeitsstand sichern.

Akzeptanzkriterien:

- Kernarchitektur dokumentiert
- 8 ADR-Entwürfe dokumentiert
- offene Architekturentscheidungen erhalten
- nichts als freigegeben dargestellt
- OpenTycoonOS bleibt zunächst Referenz

Abschlussgrund: Neun Architekturartefakte erstellt, A09-QA bestanden und Commit/Push auf `main` erfolgreich. Abschlussnachweis: Checkpoint [CP-0006](checkpoints/CP-0006.md).

---

### T-0003 – Repository-Bestand read-only aufnehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.3
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

Tatsächlichen Repository-Zustand gegen den Architekturentwurf prüfen.

Abschlussnachweis: [Checkpoint CP-0002](checkpoints/CP-0002.md).

---

### T-0004 – Maschinenbau-MVP: A02-Spezifikation und Gap-Analyse aufnehmen

Status: COMPLETED (nachträglich dokumentiert)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION

Aufgabe:

Die read-only fachliche Spezifikation und Gap-Analyse des Maschinenbau-MVP erstellen. Während der A02-Arbeit war dafür kein aktives Ticket eingetragen; dieses Ticket dokumentiert die bereits abgeschlossene Arbeit rückblickend und weist sie dem aktiven SLG-000.2 zu.

Abschlussgrund: A02-Arbeitsergebnis durch A01 geprüft und unverändert im Repository gesichert. Keine Code-, Datenbank-, Dependency- oder Architekturänderung. Abschlussnachweis: [Checkpoint CP-0007](checkpoints/CP-0007.md) und [A02-Bericht](../simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md).

---

### T-0007 – D-0010-Scope in A02-/A03-Spezifikationen angleichen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION / A03 ACCOUNTING_FINANCE

Aufgabe:

Die dokumentarische MINOR-Abweichung aus CP-0013 in den Fachspezifikationen von A02 und A03 bereinigen. D-0010 bleibt maßgeblich und unverändert; Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind aus V1 ausgeschlossen. Keine Erweiterung des MVP und keine neuen Fachregeln.

Abschlussgrund: A02 und A03 haben ihre jeweiligen Scope-Texte an D-0010 angeglichen. Konkrete Zahlungs-/Finanzregeln bleiben offen. Nachweis: [CP-0014](checkpoints/CP-0014.md).

### T-0012 Fortschreibung – Monatsabschluss und Finanzansicht (CP-0158)

Der Spielprototyp zeigt nun den kalendarischen Monatsabschluss mit verfügbaren Cash-, Rechnungs-, SimTAX-, Kundeneingangs-, Lieferungs- und Abschlusszahlen. Nicht verfügbare Kosten-/BAB-/Vorratswerte werden nicht abgeleitet. Syntax-, Monatsfunktions- und lokale HTTP-Auslieferungsprüfungen bestanden. Die reale Browser- und Mobilprüfung bleibt offen, daher bleibt T-0012 IN_PROGRESS. Kein Commit/Push. Details: [CP-0158](checkpoints/CP-0158.md).

### T-0012 Abschluss (CP-0159)

Browser- und Mobilprüfung vollständig: echte Oberfläche, Mobile-Navigation, Wochenfortschritt, Produktion/Lieferung, Abnahme, Szenariorechnung/SimTAX, Fälligkeit/Zahlung, G3-Abschluss, Monatsabschluss und lokale Wiederherstellung nach Reload erfolgreich. Der Test fand und korrigierte den Bottom-Nav-Handler. T-0012 ist COMPLETED; CP-0159 enthält den Nachweis. Offene fachliche Parameter verbleiben separat unter T-0008. Kein Commit/Push.


### Nutzerentscheidung D-0127 / A02-A03-Übernahme (CP-0175 bis CP-0177)

Der Dispositionszins wird täglich auf dem gezogenen Saldo berechnet und am Monatsende einmalig als Sammelposten belastet. A03 hat die Finanzspezifikation (CP-0175), A02 das Phase-8-Ereignismodell und den gemeinsamen Abgleich (CP-0176) aktualisiert. A01 hat die offene Detailmenge fortgeschrieben (CP-0177). Offen: Tageszählbasis, Rundungszeitpunkt, Buchungsreihenfolge am Monatsende und Rückführung aus anderen Eingangstypen. T-0008 bleibt IN_PROGRESS.

### T-0032 Qualitätspräzisierung nach A09-Zwischenreview (2026-10-28)

Die Freigabe erfordert zusätzlich zur Mengen- und Feldprüfung: deutsche, natürlich formulierte Falltexte; vier fachlich plausible und fallbezogene Optionen; stabile `competenceId`-Zuordnung zu den tatsächlich in der Kompetenzlandkarte dokumentierten IDs; direkte Primärlinks für jeden inhaltlich herangezogenen Rechtsparagraphen; und eine Validatorabdeckung für Bereichszahlen, Inhaltsduplikate, Optionsverteilung, Kompetenzreferenzen und auffällige Fremdsprachenmarker. Exakte Textunterschiede allein gelten nicht als semantischer Qualitätsnachweis. A09 prüft nach der Nacharbeit erneut unabhängig.

### T-0032 UI-Integration und neuer WBQ-Schlüsselkonflikt (2026-10-28)

A01 hat den vorhandenen Bereich „Lernen“ um eine Prüfungsfallansicht mit WBQ-/HSQ-Filter, vier Antwortbuttons, Feedback, Quellen-/Kompetenzhinweis und separatem lokalen Wiederholungsfortschritt erweitert. Die Quizantworten speichern nur den Lernfortschritt und verändern laut Regression weder den aktiven Spielstand noch Finance/Ledger. Browserprüfung korrigierte den WBQ-Bereichstitel (Exportfeld `title`). Ein Inhaltsabgleich fand anschließend im WBQ-Modul doppelte Rotation der Antwortoptionen; dadurch ist der Lösungsschlüssel bei einigen Items nicht mehr der richtigen Option zugeordnet. A06 bereinigt die Verarbeitung und ergänzt eine Prüfung gegen den richtigen Antworttext; A09 reprüft HSQ separat. Das Ticket bleibt IN_PROGRESS.

### T-0032 HSQ-Nachreview 2: Kompetenzlandkarte und Distraktoren offen

A09 bestätigte Umfang, deutsche und eindeutige Inhalte, Schlüsselkorrektheit, Rechtslinks und getrennten Spielstand, erteilte aber keine Freigabe. A07 muss die 25 HSQ-Kompetenz-IDs in der externen Kompetenzlandkarte hinterlegen und jedes Item gegen diese tatsächlichen Map-Einträge validieren. Zusätzlich müssen offensichtliche Falschantworten in allen fünf HSQ-Bereichen durch plausible fallbezogene Fehlannahmen oder Zielkonflikte ersetzt werden; ein Längen-/Schlüsselwortfilter ist kein Plausibilitätsnachweis.

### T-0032 WBQ-Schlüsselabgleich korrigiert; A09-Review offen

A06 hat englische Altinhalte und doppelte Bearbeitungs-/Rotationsblöcke entfernt. Die endgültige A–D-Position wird einmalig aus dem Datensatz erzeugt; jedes Item führt `correctAnswer`, und die WBQ-Regression prüft `options[correctOption] === correctAnswer`. A01 reproduzierte den Validator mit 200 Items und 50 je Bereich. Die unabhängige fachliche A09-Prüfung bleibt vor Freigabe erforderlich.

### T-0032 WBQ-Inhaltsreview: Distraktoren noch nicht freigegeben

A09 bestätigt strukturelle WBQ-Korrekturen (200/50, deutsche statische Inhalte, Kompetenz-Map, direkte Rechtsquellen, korrekte Schlüssel, keine Spielmutation). Die fachliche Abnahme blockiert weiterhin an unplausiblen Distraktoren in allen vier Bereichen. Die aktuelle Keyword-Prüfung reicht nicht; A06 überarbeitet die Optionen fallweise und ergänzt eine nachvollziehbare manuelle Prüfliste, bevor A09 erneut reviewt.

### T-0032 A01-Fortsetzung (2026-10-28; CP-0203)

Der aktuelle A01-Lauf bestätigt, dass die HSQ-Kompetenzlandkarte nun 25 `wfprv5-*` IDs enthält und der HSQ-Strukturvalidator 250/50, Quellen, Schlüssel und Referenzen besteht. Der WBQ-Strukturvalidator besteht mit 200/50 und korrekten Antworttexten; A06 arbeitet die verbleibenden 100 Distraktor-Sets zu Recht/Steuern und Unternehmensführung noch fallweise nach. Die getrennte Lern-UI-Regression besteht. Diese automatisierten Strukturprüfungen ersetzen keine fachliche Distraktorprüfung. A07/A06 setzen ihre Arbeit im Repository-Checkout fort; A09 muss beide finalen Datensätze unabhängig neu prüfen. T-0032 bleibt IN_PROGRESS; T-0033, Commit und Push bleiben ausstehend. Details: CP-0203.

**Nachtrag:** A06 hat die übrigen WBQ-Distraktoren inzwischen ebenfalls fallweise überarbeitet und `prototype/learning-wbq-review-checklist.md` erstellt. Validator und Syntaxprüfung bestehen (200/50, A48/B52/C52/D48). A09 prüft jetzt unabhängig den gesamten HSQ- und WBQ-Satz; fachliche Abnahme bleibt offen.

### T-0032 A09-Befunde und gezielte Korrekturen (2026-10-28; CP-0204)

A09 meldete vorläufige Inhaltsblocker: mehrdeutige/unterbestimmte Fallfragen (HSQ BM-027, IFRWC-027/-039, Logistik-007/-010/-015/-018; WBQ VW-002/RW-013), Rechtspräzisierung in WBQ RT-005/RT-006 (Werkvertrag/Werklieferungsvertrag und Abnahme) sowie auffällige offensichtliche Distraktoren in den genannten Marketing-/Führungs-/Rechts-/Unternehmensführungsfällen. Der Review lief aus einem Spiegel ohne `.git`; diese Befunde sind direkt im Repo zu verifizieren. A06/A07 bearbeiten konkrete Fälle. A09 wiederholt nach Korrektur die vollständige Prüfung im Git-Checkout. Keine Abnahme, kein Commit/Push. Details: CP-0204.

### T-0032 A09-Verifikation und verbleibende fachliche Blocker (2026-10-28; CP-0205)

A09 hat den Nachreview im tatsächlichen Checkout mit Preflight durchgeführt. WBQ VW-002, RW-013 und RT-005/006 sind jetzt behoben; WBQ RW und RT sind fachlich PASS mit Restqualität RT-001. Verbleibend: HSQ BM-027, IFRWC-027 und Logistik-007/-010/-015/-018 sind mehrdeutig/unterbestimmt; Marketing-005/-030, Führung-002/-008/-012/-018 sowie WBQ UF-034/-045/RT-001 haben zu offensichtliche Distraktoren; WBQ VW-027/-028 enthalten jeweils zwei richtige Antworten. WBQ-Validator bricht zusätzlich an verwaister Quelle `LAW-BGB-631-DIRECT` ab. A06/A07 korrigieren, danach finaler A09-Nachreview. Keine Freigabe, kein Commit/Push. Details: CP-0205.

**Nacharbeit:** A06/A07 haben alle IDs aus CP-0205 korrigiert, die Checklisten angepasst und Validatoren/syntax erfolgreich ausgeführt. BGB §§ 640, 650 und 442 sind in den betroffenen Fallbegründungen/Links abgeglichen. Der finale A09-Abschlussreview der aktuellen 450 Items läuft; T-0032 bleibt bis zu dessen Ergebnis offen. Siehe CP-0206.

### T-0032 A09-Abschlussreview: ein einzelner Blocker (CP-0207)

A09 hatte nach CP-0206 zunächst acht Bereiche PASS gegeben; danach wurde `hsq-logistik-018` verengt und im gezielten Re-Review PASS gegeben. T-0032 ist mit CP-0208 abgeschlossen.

### T-0032 Abschluss (CP-0208)

A09 hat den letzten Befund `hsq-logistik-018` gezielt freigegeben und zuvor alle neun Prüfungsbereiche vollständig bestanden. 450 Fälle sind strukturell, fachlich, quellen-/kompetenzbezogen und auf Nichtmutation des aktiven Spielstands geprüft. WBQ-Checkliste enthält 200 A09-Freigaben; HSQ-Nacharbeit und Re-Review sind dokumentiert. Validatoren, Lern-UI-Regression, Gesamtsuite/Jahreslauf und `git diff --check` bestehen. T-0032 ist COMPLETED; T-0033 übernimmt Integration/Release. Kein Commit/Push vor T-0033-Abnahme.

### T-0033 Start nach T-0032-Abnahme (CP-0208)

T-0033 ist IN_PROGRESS. Offen sind abschließende Integrations- und Architektur-/Daten-/DevOps-Reviews, Browser-/Mobil-E2E und Tooltip-/Tastaturprüfung. Anschließend erfolgt der kontrollierte Commit-/Push-Lauf gemäß AGENTS.md. Bestehende lokale Änderungen bleiben erhalten.


### T-0033 Abschluss (CP-0210)

A04/A09/A10/A11-Reviews, die vollständige Regressionsmatrix, der einjährige Simulationslauf sowie Browser-/Mobilprüfung sind in CP-0209 belegt. Der 32-Dateien-Sicherungsstand wurde am 2026-10-28 über GitHub Desktop als feat: add Wirtschaftsfachwirt V2 learning simulation committed und nach origin/main gepusht. HEAD und origin/main stimmen auf 424927125ba882b33726c47de7b68347a9dbe4d9 überein; Arbeitsbaum sauber. T-0033 ist abgeschlossen. MG-002/SLG-002.2 bleiben in Arbeit; SLG-002.4 ist Folgearbeit. Keine Architektur- oder Schemafreigabe; ADR-001 bis ADR-008 bleiben PROPOSED. Siehe [CP-0210](checkpoints/CP-0210.md).
### T-0035 – V2-Neustartprofil, Postfach, dynamischer BAB und Betriebsstandorte

Status: COMPLETED (V2-Startprofil, Marktberichte, BAB und Standorte; CP-0212; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Den Spielstart als Einzelunternehmen in München 2019 mit 10.000 € Bankbestand, leerem Lager und einer gemieteten Garage neu aufsetzen. Manuelle Tageszuweisung bleibt optional und automatische Planung der Standard. Anfragen und Marktberichte laufen über ein Postfach; individuelle Konkurrenzpreise sind verborgen und Monatsberichte zeigen Durchschnittswerte je Auftragsgröße. Dynamische BAB-Auswertung, Nachfrage-/Standortwirkung, Maschinenmiete/-qualifikation, Lieferanten-Mindestmengen, Lebenshaltungskosten/Privatentnahmen und Gesellschaftsformwechsel als V2-Szenariofunktionen integrieren.

Umfang: Browserfähiger Prototyp. Historische/regionale Preise und Flächen sind ausdrücklich Szenariowerte, keine aktuellen Immobilienangebote oder Rechts-/Steuerberatung. Bestehende Spielstände bleiben ladbar; das neue Profil gilt für neu gestartete Spiele.

Abnahmekriterien: Neues Spiel zeigt 01.01.2019 und 10.000 € Bankbestand, keine Mitarbeiter außer Inhaber, kein Vorrat, Garagenmiete und Privatentnahme; automatische Planung ist vorausgewählt und manuell umstellbar; abgelaufene/abgeschlossene Aufträge blockieren keine Folgezuweisung; Postfach erhält Kundenanfragen und einen monatlichen anonymisierten Konkurrenzpreisbericht; Standortübersicht hat mindestens zehn Miet- und zehn Kaufobjekte auf einer schematischen München-Umlandkarte; monatlicher BAB wird aus den realisierten Szenariokosten und Beschäftigungs-/Maschinenstunden errechnet.

Abschluss: Ein neues V2-Spiel beginnt 01.01.2019 mit 10.000 €, leerem Lager, Inhaber, gemieteter Garage, Handwerkzeug und monatlicher Privatentnahme. Im Planer ist Automatisch voreingestellt und Auftragsauswahl manuell möglich; erledigte Zuweisungen blockieren die automatische Folgeplanung nicht. Das Postfach enthält Monatsberichte mit Mittelwert und Spanne aller drei Konkurrenzprofile nach drei Auftragsgrößenklassen; weder Auftragsansicht noch Konkurrenz-Zuschlagsmeldung veröffentlicht Einzelpreise. Die wöchentliche Marktchance wurde auf drei Einladungsgelegenheiten erhöht; ein Teil ist absichtlich verlustbringend. Es gibt 10 Miet- und 10 Kaufobjekte sowie zwei CNC-Mietmaschinen; Standort, Nachfrage, Kapazität, Mindestbestellmengen und Baumarktpreise beeinflussen das Spiel. Der BAB rechnet Szenariokosten und realisierte Arbeits-/Maschinenstunden mit. Einjahreslauf: 62 Anfragen, 57 abgeschlossene Aufträge, 12 Marktberichte, 12 Monatsabschlüsse und positiver Endbankbestand bei getesteter wettbewerbsfähiger Angebotsstrategie. V1-Regressionsläufe wurden auf explizite Legacy-Startfabriken umgestellt und bestehen weiterhin. Browserprüfung auf isoliertem Port 8011 bestand für Dashboard, Planung, Standorte, Bank-/Dispoanzeige und Postfach. Historische Marktwerte, Immobilien-/Betriebsdaten, UG/GmbH-Wechsel und Rechtsmechanik bleiben Szenarioheuristiken; UG-Rücklage sowie vollständige Steuer-, Gründungs- und Registerlogik sind keine Implementierungsbehauptung. Details: CP-0212.

### T-0036 – Verteilte Anfragen, verzögerte Kundenentscheidung und Inventar

Status: COMPLETED (V2-Marktfluss und Baumarkt-Inventar; CP-0213; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Verteilte Eingangstage, Antwortwartezeit, Angebotsablauf, sichtbare Fertigungsqualifikationen und Überlastanzeige ergänzen. Baumarkt als Materiallieferant und Werkzeugverleiher sowie ein Inventarreiter für Bestände und Betriebsmittel integrieren.

Abschluss: Neue V2-Anfragen entstehen an drei über die fünf Arbeitstage rotierenden Werktagen je Woche (Feiertage bleiben ohne Erzeugung). Unbeantwortete Anfragen laufen nach 3–5 Kalendertagen ab. Nach Angebotsabgabe wartet der V2-Kunde 1–3 Kalendertage; Preis und Zahlungsziel bleiben währenddessen unverändert und der Zuschlag wird erst am Entscheidungstag aufgelöst. Generierte Aufträge zeigen Skills; fehlende interne Skill-/Maschinenberechtigung erscheint rot. Der globale Datumspfeil wird gelb, wenn die restliche modellierte Auftragsstundenlast die aktuell verfügbare tägliche Belegschaftskapazität übersteigt. Baumarkt ist als Materiallieferant auswählbar und liefert nach Mindestmengenregel weiterhin Notbeschaffung; Handwerkzeuge können tageweise gemietet und automatisch zurückgegeben werden, mit Betriebskostenbuchung. Der neue Inventarreiter zeigt Material, Arbeitsmittel, Maschinen, Computerhinweis und laufende Baumarkt-Ausleihen. V1 bleibt im Angebotsentscheidungsfluss unverändert. Gezielt und regressiv geprüft; Einzelheiten CP-0213.

### T-0037 – Werkzeugverleih nach Auftragsbedarf, Maschinen-Skills und Logo-Navigation

Status: COMPLETED (UX-/Qualifikationspräzisierung; CP-0214; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Die Baumarkt-Mietauswahl sprachlich eindeutig machen, irrelevante Werkzeuge ausblenden und Spezialwerkzeug an aktive Auftragsanforderungen binden. Maschinen-Skills zeigen und die Logo-Navigation zur Übersicht reparieren.

Abschluss: Werkzeugmiete wählt ausdrücklich ein Gerät; der Zahlenwert steht für Arbeitstage (1–30). Der Baumarkt bietet nur ein Spezialwerkzeug an, wenn ein angenommener, noch nicht abgeschlossener Auftrag genau dieses Werkzeug erfordert. Der Engine-Start eines entsprechenden Arbeitsgangs wartet, wenn das Mietwerkzeug an dem Tag nicht verfügbar ist. Mietmaschinen führen benötigte Fachskills und Maschinenberechtigungen in ihrem Katalog und im Inventar. Der Klick auf das Logo setzt die Ansicht auf Übersicht und verhindert, dass nur der Hash geändert wird. Geprüft mit gezielter Regression, V2-Jahreslauf, Legacy-Jahreslauf, Gesamtsuite, Syntax- und Whitespaceprüfung; siehe CP-0214.
### T-0038 – Lagerbelegung, Materialvorlauf und Versandfertigwaren

Status: COMPLETED (Materialfluss und Fertigwarenlager; CP-0215; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Die Lageranzeige als belegte/maximale Fläche ausweisen, Materialien einzeln im Lager führen, Bestellvorlauf und Lieferantenunterschiede simulieren und Fertigware bis zum Versand im Lager halten.

Abschluss: Dashboard und Inventar zeigen belegte von maximaler Lagerfläche in m². Unter „Inventar → Lager“ stehen Stahl, Aluminium und Zukaufteile einzeln, Fertigware bis zum tatsächlichen Versand sowie offene Lieferungen mit Lieferant und voraussichtlichem Termin. Online-Lieferanten sind im Modell günstiger als Baumarkt-Einzelbezug, verlangen Versand und Mindestmengen, haben mehrtägige Vorläufe und ein reproduzierbares Verzögerungsrisiko. Der lokale Baumarkt liefert sofort, aber nur aus endlichem Lagerbestand und mit Einzelmengenaufschlag; ausgeschöpfte Bestände weichen auf Onlinebeschaffung aus. Fertige V2-Aufträge belegen bis zur Aktion „Auftrag aus Lager versenden“ gemeinsam mit Rohmaterial Fläche. Bei Platzmangel warten Warenzugänge und Fertigung. Legacy-/2027-Versandverhalten bleibt kompatibel. Regressionen und Jahresläufe siehe CP-0215.
