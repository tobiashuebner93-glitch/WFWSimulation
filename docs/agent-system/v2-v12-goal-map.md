# V2–V12: Qualitätsziele und Fachausbau

Stand: 2026-10-29
Master Goal: MG-002
Koordination: A01 – MASTER_ORCHESTRATOR

Die Fachgliederung ist am 2026-10-29 gegen § 3 WFachwPrV und die offizielle IHK-Darstellung gegengeprüft: [Gesetze im Internet – § 3 WFachwPrV](https://www.gesetze-im-internet.de/wfachwprv/__3.html), [IHK Karlsruhe – Wirtschaftsfachwirt/in](https://www.ihk.de/karlsruhe/fachthemen/weiterbildung/weiterbildungspruefungen-a-z/wirtschaftsfachwirt-in-2460524). Die Verordnung benennt vier Qualifikationsbereiche für WBQ und fünf Handlungsbereiche für HQ. Die Kompetenzlandkarte und späteren Lerninhalte bleiben eine agentenseitige Ableitung, keine IHK-Veröffentlichung.

## Neu gefasstes Gesamtziel MG-002

Ein mobil nutzbares, browserbasiertes Wirtschaftsspiel entwickeln, in dem Lernende ein Unternehmen nachvollziehbar führen und Wirtschaftsfachwirt-Kompetenzen auf WBQ-/HQ-Niveau an realen Spielentscheidungen anwenden. Jedes Fach wird als vollständige spielbare Handlungskette in die bestehende Unternehmenssimulation integriert; Lernkarten, Tooltips, Übungsfälle und Prüfungsformate vertiefen dieselben Kompetenzen und verweisen wechselseitig auf konkrete Spielkontexte. Kennzahlen, Ereignisse und Wirkungen bleiben aus Spielregeln, Buchungen und Simulationsergebnissen nachvollziehbar. Quellen, Rechtsregeln, fachliche Ableitungen und Spielvereinfachungen werden getrennt ausgewiesen. Ziel ist ein didaktisch tragfähiges Lernspiel, keine zertifizierte Prüfung, Rechtsberatung oder vollständige Unternehmenssoftware.

### Qualitätsprinzipien und globale Abnahme

1. **Ein zusammenhängendes Spiel:** stabile IDs verbinden Geschäftsvorfälle, Spielentscheidungen, Lernkompetenzen, Lernkarten, Tooltips und Rückblicke. Aus einem passenden Spielkontext gelangt man zur ausgewählten Karte und zurück an denselben Bereich; Übungsmodus verändert keine Betriebs-/Finanzdaten.
2. **Klare Informationsarchitektur:** dashboard zeigt Zustand, aktuelle Entscheidungen und höchstens die wichtigsten Hinweise; die Hauptnavigation gruppiert Unternehmensführung, Personal/Planung, Beschaffung/Lager, Markt/Kunden, Finanzen und Lernen konsistent. Begriffe und Statusmeldungen sind einheitlich. Lern- und Prüfungsansichten bleiben vom Aktionsfluss unterscheidbar.
3. **Didaktische Qualität:** jedes Fachziel ist an beobachtbare Spielerhandlungen und überprüfbare Wirkungen gekoppelt. Es gibt abgestufte Aufgaben, plausible Fehloptionen, Erklärungen und Folgen; Karten sind Übungsstütze, kein Ersatz für spielbare Fachinhalte.
4. **Erklärbare Simulation:** dieselbe Szenario-/Regelversion erzeugt reproduzierbare Ergebnisse. Relevante Geld-, Kapazitäts-, Bestands-, Personal- und Qualitätsänderungen sind mit Ereignis und Ursache rückverfolgbar. Annahmen, Unsicherheit und Grenzen werden sichtbar.
5. **Zugänglichkeit:** mobil zuerst, Tastatur bedienbar, ausreichende Kontraste und verständliche Statussignale. Icons haben zugängliche Beschriftungen; Name/Fähigkeiten erscheinen bei Hover, Tastaturfokus und Touch.
6. **Qualität und Nachweis:** jedes Release-Fach hat Quellen-/Rechtsprüfung, Kompetenzabdeckung, funktionale Regression, Randfall- und mobile Browserprüfung. Prüfungsrahmen und Rechtsquellen werden datiert und versioniert. Keine Abnahme allein aufgrund syntaktischer Tests.
7. **Release-Schranke:** kein spielbarer Release-Claim, solange Jahressolvabilitätsprüfung, Datenwiederherstellung und definierte Browserpfade fehlschlagen. Der deterministische 365-Tage-Smoke besteht aktuell (CP-0253); Wiederherstellungs- und Browserabnahmen bleiben offen.

## V2 – Spiel- und Lernfundament (Qualitätsziel)

**Versionsziel:** Das existierende Unternehmensspiel erhält eine konsistente Bedienstruktur und einen belastbaren Kompetenzkontext. Mitarbeitende lassen sich für jeden der nächsten fünf sichtbaren Arbeitstage (rollendes 7-Kalendertage-Fenster, nur Montag bis Freitag) planen. Wochenenden werden nicht als Spalten angeboten. Automatik bleibt Standard; manuelle Tageszuweisung berücksichtigt Verfügbarkeit, Qualifikation und Reihenfolge. Inventar wird durch verständliche, kategorisierte Symbole dargestellt; Name und Fähigkeiten sind per Hover, Fokus und Touch zugänglich. Lernkarten lassen sich aus Aufträgen, Personal, Finanzen, Markt und Logistik passend öffnen und führen in den Ursprungskontext zurück. Lernantworten im Übungsmodus verändern nicht den Spielstand. V2 besteht erst, wenn Szenarioläufe reproduzierbar und die Solvenz-/Browser-Gates bestanden sind.

| Agent | V2-Unterziel und prüfbarer Beitrag |
|---|---|
| A01 | Ziel-, Ticket- und Reviewkette pflegen; Abhängigkeiten, Entscheide und Freigabestatus widerspruchsfrei halten. |
| A02 | Arbeitsgänge, Tagesplanung, Abwesenheiten, Skills und Ursachen von Simulationswirkungen als stabile Ereignisse/Kontexte zugänglich machen. |
| A03 | Spielereignisse auf Kosten, Liquidität, Bestände, Ergebnis und Monatsabschluss abstimmen; reproduzierbare Jahres-Solvabilität herstellen. |
| A04 | Versionierte logische Verträge für Spielstand, Geschäftsvorfall, Kompetenz und Rückkehrkontext vorschlagen; keine Schemafreigabe ohne Nutzerentscheid. |
| A05 | Navigationsbereiche ordnen, Dashboard-Hierarchie und responsive Arbeitsplanung umsetzen; Icons/Tooltips inkl. Tastatur- und Touchzugang; Lernkontext-Rückkehr. |
| A06 | Kompetenz-IDs und Kartenverknüpfungen so stabilisieren, dass passende Karten aus Spielhandlungen auffindbar sind und Lernfortschritt separat bleibt. |
| A07 | Übungsfälle und Prüfungsabläufe mit Rubrik, Feedback und eigenständiger Lernsession definieren; keine Spielmutation im Prüfungsmodus. |
| A08 | IHK-/DIHK-/Rechts-/Fachquellen datieren, priorisieren und Ableitung gegenüber Szenarioannahmen kenntlich machen. |
| A09 | Kompetenzabdeckung, Schlüssel, Ablenkantworten, Nichtmutation, Zeitleiste, Mobilbedienung und Jahressolvabilität automatisiert prüfen. |
| A10 | Paketierung und Build reproduzierbar machen; Syntax, Abhängigkeiten, Linkziele und Release-Artefakte prüfen, ohne selbst Architektur freizugeben. |
| A11 | Schnittstellen und Domänengrenzen als Vorschlag auf Widerspruch/Kopplung prüfen; keine Architektur- oder Schemafreigabe. |
| A12 | Reproduzierbare Browser-Situationen für Planung, Lernen, Inventar, Touch und Fehlerzustände herbeiführen und mit Startpunkt dokumentieren. |

### V2-Zielstruktur der Oberfläche und Lernverknüpfung

- Dashboard: Liquidität, Auftragslage, Kapazität, dringende Ereignisse, neue Nachrichten und tägliche Lernfrage; keine konkurrierenden Vollansichten.
- Unternehmensbereiche: Aufträge/Angebote; Arbeitsplanung/Personal; Beschaffung/Lager/Inventar; Markt/Postfach; Finanzen/Berichte; Lernen/Prüfung. Gemeinsame Status- und Aktionssprache.
- Kompetenzkontext als vorgeschlagener logischer Vertrag: `viewId`, `entityId`, `eventId`, `competenceIds[]`, `cardId`, `returnViewId`, `rulesetVersion`. Das ist keine Architektur-/Schemafreigabe.
- Spielkontext kann mehrere Kompetenzen und Karten haben; Karte verweist zurück auf Fall/Entscheidung. Anzeige von Wirkung, Erklärung, Quelle und Modellgrenze. Dashboard-Antworten mit vorgesehener kleiner Spielwirkung bleiben vom neutralen Übungs-/Prüfungsmodus getrennt.
- Zeitleiste: rollende sieben Kalendertage ab aktuellem Datum; nur Arbeitstage (höchstens fünf Spalten); automatische Zuweisung vorausgewählt, manuelle Zuweisung per Dropdown/Touch möglich. Krankheit, Urlaub, Weiterbildung, Temp-Buchung, Skills, Tageskapazität und Vorgängerabhängigkeit sind sichtbar bzw. validiert.

## V3–V12 – vollständige spielbare Fachziele

Jede Fachversion ergänzt eine eigene spielbare Handlungskette in den existierenden Betrieb. Eine Version gilt nicht als umgesetzt, wenn das Fach nur aus Lernkarten besteht. Gemeinsame Abnahmekriterien: fachliche Quellen-/Kompetenzkarte, vollständiger Spielkreislauf mit mindestens einem Zielkonflikt, sichtbare Wirkung auf passende Kennzahlen/Ereignisse, Rückverknüpfung zu Karten/Tooltips, drei Schwierigkeitsstufen, Tests für positive/negative Grenzfälle und mobile Browserreview. Rechts-/Steuerinhalte werden anhand aktueller Primärquellen geprüft und als Spielvereinfachung kenntlich gemacht.

| Version | Prüfungsfach / Ziel |
|---|---|
| V3 | **Volks- und Betriebswirtschaft:** Konjunktur, Markt, Wettbewerb, Nachfrage, Preisbildung, Produktivität und Unternehmensziele spielbar steuern; Marktveränderungen wirken auf Anfragen, Kosten, Preise und Kapazitätsentscheidungen. |
| V4 | **Rechnungswesen (WBQ):** Belege, Konten-/Geschäftsvorfälle, Bestände, Kostenarten/-stellen/-träger, Ergebnis und einfache Auswertungen als integrierter Monatskreislauf; Lernende können Abweichungen erklären. |
| V5 | **Recht und Steuern (WBQ):** Vertragsschluss/-abwicklung, Kauf-/Werkvertrag, Abnahme, Mahnung, Personal-/Gesellschafts- und Steuergrundlagen in Entscheidungssituationen; Rechtsfolgen nur nach verifizierten Quellen und mit begrenztem Szenarioumfang. |
| V6 | **Unternehmensführung (WBQ):** Ziele, Planung, Organisation, Kennzahlen, Qualitäts- und Veränderungsentscheidungen als fortlaufender Führungszyklus im Betrieb. |
| V7 | **Betriebliches Management (HSQ):** integrierte Auftrags-/Prozesssteuerung, Qualität, Kapazität, Personal, Arbeitsschutz und kontinuierliche Verbesserung samt Zeit-/Kosten-/Qualitätskonflikten. |
| V8 | **Investition, Finanzierung, Rechnungswesen und Controlling (HSQ):** Investitionsvergleich, Finanzierung, Liquiditäts-/Ergebnisplanung, dynamischer BAB, Abweichungsanalyse und Maßnahmenwirkung über mehrere Perioden. |
| V9 | **Logistik (HSQ):** vollständiger spielbarer Beschaffungs-, Lieferanten-, Bestands-, Lager-, Produktionsversorgungs-, Fertigwaren-, Versand- und Rückflussprozess. Mindestmengen, Vorlauf, Zuverlässigkeit, Kosten, Kapitalbindung, Lagerkapazität und Störungsausgleich erzeugen reale Zielkonflikte. Karten ergänzen, ersetzen diesen Prozess nicht. |
| V10 | **Marketing und Vertrieb (HSQ):** Markt-/Kundensegmentierung, Positionierung, Angebot, Preis-/Konditionenverhandlung, Auftragserfolg, Kundenbindung und Marketingbudget in einem messbaren Verkaufszyklus. |
| V11 | **Führung und Zusammenarbeit (HSQ):** Mitarbeitende entwickeln, führen, kommunizieren, Konflikte lösen und Teams/Veränderung koordinieren; Motivation, Kompetenzen, Fehlzeiten und Leistung folgen transparenten Regeln. |
| V12 | **Integrierte WBQ-/HQ-Fall- und Prüfungssimulation:** fachübergreifende Unternehmensfälle mit Zeitbudget, Belegen, Daten, mündlicher/schriftlicher Bearbeitung, Bewertungsrubrik, Musterlösung und anschließendem Spiel-Debrief. Prüfungsstruktur folgt dem belegten aktuellen Rahmen; keine IHK-Zertifizierung behaupten. |

### Agentenbeiträge zu jeder Fachversion

| Agent | Verbindliche Rolle bei V3–V12 |
|---|---|
| A01 | Liefert pro Fachversion Scope, Abhängigkeiten und Abnahmebeleg; priorisiert Folgearbeit, entscheidet keine fachlichen/rechtlichen Regeln ohne Grundlage. |
| A02 | Implementiert das fachliche Entscheidungssystem als vollständigen Spielablauf und Ereigniskette, einschließlich Grenzen/Folgewirkungen. |
| A03 | Modelliert monetäre Wirkung, Cash/Ergebnis/Kosten/Bestände und Reconciliation; prüft Plausibilität und markiert nicht modellierte Abschlüsse. |
| A04 | Dokumentiert notwendige Entitäten/IDs/Migrationsanforderungen als logisches Modell; Änderungen an Schema/Persistenz nur nach gesonderter Freigabe. |
| A05 | Integriert die Fachhandlung in die Oberfläche, ordnet Navigation/Status, visualisiert Kennzahlen und bindet Tooltips/Karten barrierearm ein. |
| A06 | Mappt Inhalte und Karten auf geprüfte Kompetenzen, bereitet gestufte erklärende Lernaktivitäten vor und hält Übungsfortschritt getrennt. |
| A07 | Entwickelt dazu passende Aufgaben, Prüfungsfälle, Bewertungsraster, Musterantworten und Debrief. |
| A08 | Sammelt und datiert Primärquellen, ergänzt unabhängige fachliche Quellen und kennzeichnet abgeleitete oder umstrittene Inhalte. |
| A09 | Prüft Fachabdeckung, Regel-/Inhaltskonsistenz, Antwortschlüssel, Simulationseffekte, Regressionen und Freigabekriterien. |
| A10 | Sichert reproduzierbaren Build, Test-/Paketlauf, Artefaktprovenienz und sichere Release-Automation. |
| A11 | Prüft fachübergreifende Schnittstellen, Zuständigkeiten, Zustands-/Versionsverträge und technische Widerspruchsfreiheit; nur PROPOSED bis Freigabe. |
| A12 | Spielt den Fachablauf im Browser explorativ durch, erreicht schwierige Zustände und liefert konkrete Reproduktions-/Nutzerabnahmeschritte. |

### Versionsübergänge und Priorisierung

V2-Grundlagen und Jahres-Solvabilitätsgate vor Fachrelease stabilisieren. V3–V6 bilden WBQ in der offiziellen Prüfungsstruktur ab; V7–V11 bauen die fünf HSQ-Handlungsbereiche als integrierte Unternehmensprozesse aus. V12 verbindet die Bereiche in authentischen vollständigen Fällen. Releases können iterativ erfolgen, aber keine Version darf Lernkartenabdeckung mit spielbarer Fachimplementierung gleichsetzen. Jeder Zielabschluss wird gegen frühere und spätere Fachversionen geprüft, damit gemeinsame Ereignisse, Kennzahlen und UI-Begriffe konsistent bleiben.
