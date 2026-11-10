# A02-Arbeitsrahmen – T-0066 V3-Produkte und Kapazität

**Status:** Arbeitsentwurf / unabhängige Vorphase  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Fachrolle:** A02 – SIMULATION  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2  
**Ticket:** T-0066  
**Stand:** 2026-10-31  
**Vorgänger:** CP-0275 (Entwurf)  
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket Board, Collaboration State, V3-Zielkarte, Decision Log, T-0065-A02-Arbeitsrahmen und T-0067-A03-Kalkulationsvertrag geprüft; Working Tree auf vorhandene fremde Änderungen geprüft.  
**Abhängigkeit:** Vollständige Integration wartet auf T-0065 (Markt-/Absatz- und Preisvertrag) und T-0067 (Kosten-/BAB-Vertrag).

Gemeinsame Schnittstellen, Ereignisfolge, Szenario-Fixtures und A05/A06/A09-Handoffs: [A02-Integrationsvertrag T-0063/T-0065/T-0066](a02-v3-t0063-t0065-t0066-integrationsvertrag.md).

## Zweck und Grenzen

Dieser Rahmen beschreibt Produktzustände, Ressourcenkonkurrenz und fachliche Übergaben für V3-18 und V3-09. Er legt keine Produktpreise, Kostenwerte, Nachfrageparameter, Finanzierungsregeln, Bewertungssätze, Grenzwerte oder Rundungen fest. Keine Architektur-/Schemafreigabe und keine Codeimplementierung. V2-Profile, Startdaten, Produktregeln und Abnahme bleiben unverändert.

Ein eigenes Produkt durchläuft eine gesonderte Produktdefinition; es ersetzt nicht den vorhandenen Auftragskreislauf. Produktidee, Testläufe und Kalkulationsentwürfe sind Planungszustände und dürfen allein keine Hauptbuch-, Cash-, Forderungs- oder Lagerbuchung erzeugen. Wirkliche Kosten- und Bestandseffekte beginnen nur an den fachlich freizugebenden Produktions-/Beschaffungsereignissen.

## Produktlebenszyklus als prüfbare Zustandsfolge

| Zustand | Mindestinhalt / Übergangsbedingung | Ressourcenwirkung |
|---|---|---|
| Idee | Produktzweck, Zielgruppe, Problem/Nutzen und Annahmen beschrieben | noch keine operative Bindung |
| Entwicklung geplant | Entwicklungsarbeiten, benötigte Fähigkeiten/Ausstattung, Material- und Zeitannahmen als Eingaben/Bestätigungen | konkurriert bei Freigabe um Arbeit, verfügbare Entwicklungszeit und beschaffbare Ressourcen |
| In Entwicklung | einzelne abhängige Arbeitsschritte laufen; Fortschritt wird reproduzierbar erfasst | gebundene Personal- und Anlagenzeit steht für konkurrierende Tätigkeiten nicht gleichzeitig zur Verfügung |
| Produktionsdefinition | freigegebene Arbeitsfolge, Qualifikationen, Materialbedarf/Stückliste und erforderliche Arbeitsmittel vollständig | fehlende Qualifikation, Betriebsmittel oder Material blockieren Freigabe bzw. Start mit Grund |
| Kalkuliert / Freigabeentscheidung | Spieler bestätigt wesentliche Mengen-, Zeit-/Leistungs- und Kosteneingaben anhand T-0067 | keine Buchung durch bloßes Kalkulieren; fehlende Eingaben führen zu „nicht kalkulierbar“ |
| Produktionsbereit | Kapazität, benötigtes Material, Fertigwarenlager und Kostenbasis sind prüfbar verfügbar | startet nur innerhalb bestehender Maschinen-, Personal-, Skill-, Material-, Cash- und Platzrestriktionen |
| In Produktion | Produktionsschritte samt Vorgängerbeziehungen und tatsächlichem Verbrauch/-Aufwand | Arbeitszeit, Maschinenzeit, Material und gegebenenfalls Cash beanspruchen reale knappe Ressourcen; keine Doppelbelegung |
| Fertigwarenbestand | produzierte Einheiten sind vom unfertigen Bestand getrennt und belegen Lagerkapazität | Bestand blockiert Platz und bleibt bis Absatz/Versand sichtbar; Bewertung wird durch A03 entschieden |
| Vermarktbar / vermarktet | Vermarktungsentscheidung und Segment/Marktchance aus T-0065; Angebot/Preis nach Marktvertrag | Absatz ist nicht garantiert; Lager bleibt bis tatsächlicher Übergabe belegt |
| Verkauft / abgeschlossen | Verkauf, Leistung/Versand und Finanzfolge gemäß den freigegebenen Markt- und Accountingverträgen | Ist-Ergebnis und Liquiditätswirkung werden aus wirklichen Buchungen ausgewiesen |

Ein Übergang darf abgelehnt oder zurückgestellt werden, wenn eine Voraussetzung nicht erfüllt ist. Fehlermeldungen benennen die konkrete fehlende oder belegte Ressource und eine mögliche nächste Aktion, ohne eine automatische Überziehung oder Ersatzqualifikation zu erfinden.

## Ressourcenkonkurrenz und Invarianten

1. **Zeit und Personal:** Produktentwicklung und Produktion konkurrieren mit Kundenaufträgen, Beschaffung, Versand und sonstigen bereits geplanten Tätigkeiten um dieselbe qualifizierte Person. Skill und Motivation dürfen Produktivität beeinflussen, aber Ressourcen nicht duplizieren. Nichtverfügbarkeit oder fehlende Maschinenberechtigung bleibt ein harter Zuweisungsblocker.
2. **Anlagen und Ausstattung:** Ein Betriebsmittel kann zur selben Zeit nur innerhalb seiner bestehenden Betriebs-/Kapazitätsgrenze verwendet werden. Die Produktphase führt keine parallele Maschinenkapazität ein.
3. **Material:** Produktstücklisten und Bestell-/Verbrauchsmengen werden mit der real verfügbaren Menge abgeglichen. Bestand kann nicht gleichzeitig einem Produkt und einem Auftrag zugesagt werden. Beschaffungsdauer und Lieferantenparameter liegen bei bestehender Beschaffungs-/Logistiklogik; V9 erhält die tiefe Logistikausgestaltung.
4. **Fertigwarenlager:** Ausgangsware ist von Roh-/Hilfsstoffen und unfertiger Arbeit unterscheidbar. Produktion kann nicht mehr Fertigware einlagern als der zugewiesene Lagerraum erlaubt. Exakte Volumen-/Bewertungsmaße bleiben offene Übergabe an A03/A05/A09, nicht erfundene Defaults.
5. **Zeit, Geld und Kapazität zusammen:** Entwicklungsbudget, Produktionskosten und Cash-Folgen werden durch A03/T-0067 bzw. spätere Finanzierungsvorgaben bewertet. A02 entscheidet nicht, dass eine geplante Kalkulation verfügbare Liquidität erzeugt oder dass ein fehlender Betrag automatisch finanziert wird.
6. **Produkt parallel zu Produkt/Auftrag:** Für mindestens zwei Produkte muss der Plan konkurrierende Belegungen sichtbar machen und Überbelegung verhindern; geplante Nachfrage oder erwarteter Absatz sind keine vorgezogenen Verkäufe.
7. **Plan/Ist-Trennung:** Geplante Zeiten/Verbräuche und wirkliche Arbeits-/Material-/Maschinenereignisse bleiben unterscheidbar. Nachträgliche Kalkulationsänderungen ändern abgeschlossene tatsächliche Verbräuche und abgeschlossene Verträge nicht.

Bestehende Personalgrenzen und Spielregeln werden nicht durch diese Vorphase geändert. V2-Regeln gelten weiter in V2. Ihr Einsatz als V3-Basis bedarf der Konsistenzbestätigung des jeweiligen Fachvertrags; z. B. Tagesplanung/Arbeitssequenz, Materialverfügbarkeit und Lagerlimits werden hier nur als angrenzende Mechaniken benannt.

## Prüfschnittstellen und offene Vertragseingaben

| Schnittstelle | Benötigter Vertragseingang | Zuständig | Status |
|---|---|---|---|
| T-0067 → Entwicklung/Kalkulation | `q`, Material je Einheit, Arbeits-/Maschinenzeit, validierte Kostensätze; `R` als Nettoplanpreis ohne SimTAX; DB I nur aus ausdrücklich variablen Einzelkosten; Arbeits-/Maschinenkosten separat und zusätzlich Ergebnis nach direkten Einzelkosten; beschlossene BAB-Restcentregel; Centnähe-Grenze; Kennzahlenperiode und Angebots-Snapshotvertrag | A03; A02 überprüft Zustandswirkung | Inhaltliche Entscheidungen durch D-0162 genehmigt; A03-Dokumentintegration bzw. gemeinsames Fachreview folgt |
| T-0065 → Vermarktung | Anfrage/Segment, Angebots-/Preissemantik nach T-0067, Nachfrage und Warte-/Zuschlagsablauf, Marktbericht | A02/A03/A05 | unabhängiger A02-Rahmen liegt vor; Makro-/Marktintegration offen |
| A02 → A05 | Zustandsübergänge, verfügbare Ressourcen, Konfliktmeldung, priorisierte Tätigkeits-/Produktansicht, Erfolgs-/Blockgrund | A02/A05 | nach Fachvertrag |
| A02 → A09 | reproduzierbare Fixtures für zwei parallele Produkte, Skill-/Motivations-/Ausstattungsvergleich, Kapazitäts-, Material-, Cash- und Lagergrenzen | A02; unabhängige Prüfung A09 | nach Integration |
| A02 → V7/V9/V10 | Prozessmanagementtiefe, Bestands-/Versandlogistik, vollständige Marketinginstrumente bleiben außerhalb dieses V3-Umfangs | A01-Koordination | Grenzen nach Ticket festhalten |

Die fachliche Bewertung/Wertansätze der Vorräte, Kostenbuchung, AfA/Bestandsbewertung und Ledgerwirkung entscheidet A03. UI-Auswahl und Kennzeichnung entscheidet A05 anhand freigegebener Zustände. Datenhaltung/Schema ist kein Teil dieses Vertrags.

## Testbare Wirkungsrichtung

Für den späteren T-0066-Review werden Kontrollpaare festgelegt, bei denen jeweils nur eine Variable geändert wird:

- höherer passender Skill → nicht längere Fertigungszeit bei identischer Tätigkeit und allen anderen Eingaben;
- höhere Motivation → keine niedrigere modellierte Leistung unter identischem Zustand, sofern die bestätigte T-0065/Engine-Formel keine ausdrücklich dokumentierte Sättigung erklärt;
- bessere passende Ausstattung → keine langsamere Fertigungszeit im kontrollierten Fall;
- reduzierte freie Personal-/Maschinenzeit, Materialmenge, Cash-Verfügbarkeit oder Lagerfläche → Start wird verzögert/abgelehnt oder erreichbare Menge sinkt; das System zeigt den Engpass;
- ein zweiter gleichzeitig angelegter Produktlauf → belegt nicht dieselbe Person, Maschine, Materialcharge, Lagerfläche oder verfügbare Liquidität wie der erste ohne ausgewiesene Kapazität/Bestand;
- steigende reale Kosten oder geänderter Markt verändern eine neue Kalkulation/Absatzchance, aber nicht rückwirkend den fixierten Vertrag oder bereits abgeschlossene Ist-Daten.

Diese Punkte nennen erwartete Richtungen, keine Prozentsätze, Mengen, Zeitvorteile oder Preiselastizitäten. Schwellenfälle kommen aus den zuständigen Fachverträgen.

## Vorläufige Abnahmezuordnung

- **V3-09:** isolierte Skill-, Motivations- und Ausstattungsvergleiche; Kapazitäts-, Skill-, Verfügbarkeit- und Überlastungsgrenzfälle; keine Ressourcenverdopplung.
- **V3-18:** zwei parallel verwaltete Produkte durch vollständige Zustände; erfolgreiche und unwirtschaftliche Variante; Entwicklungs-/Produktions-/Bestands-/Absatzfluss; Engpass und nachvollziehbare Kosten-/Umsatzwirkung.
- **Abgrenzungen:** tiefe Produktionsprozesssteuerung V7, Logistik V9, Marketinginstrumente V10. V3 soll nur die dafür nötigen Anschlüsse bereitstellen.

## Konfliktreview und Dependency gate

- Keine Kollision mit D-0159: Lernfragen und Pflicht-Lernereignisse sind nicht Teil des Produktlebenszyklus.
- Kein Eingriff in V2-Grundbetrieb, V2-Abnahme, Profildaten, Architektur, Datenbankschema oder Buchungssätze.
- D-0162 legt V3-Preis-, DB-I-, BAB-Rundungs-, Angebots-Snapshot- und Kennzahlensemantik fest; T-0066 konsumiert sie und setzt keine eigene abweichende Produktkalkulation fest. Noch offene Markt-/Makroparameter aus T-0065/T-0063 bleiben getrennte Vertragseingaben.
- T-0066 kann erst nach T-0065/T-0067 in eine vollständige fachliche Umsetzung und quantitative Prüfungen übergehen.
