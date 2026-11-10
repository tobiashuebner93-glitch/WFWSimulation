# A08-Rechtsquellenreview – T-0069 Auftrags- und Finanzereigniskette

**Status:** Quellenprüfung abgeschlossen; bedingter PASS für den dokumentierten logischen Vertrag  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Profil:** V3 ab 2027-01-04; Rechtsstichtag ist der aktuelle Stand 2026-10-31 gemäß D-0161, nicht das Profiljahr  
**Entscheidungen:** D-0157, D-0161, D-0162; A03-Vertragsreview 2026-10-31  
**Vorgänger:** CP-0279 und CP-0280 (beide ENTWURF)  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und Umfang

Gelesen: AGENTS.md, Agentenstruktur/Rechtematrix, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280, A02-T-0069-Run-Choreografie, A03-T-0069-Finance-Handoff-Matrix sowie das A03-Re-Review. Eingesehen wurde außerdem der dynamische Rechtsregisterbestand. Die Prüfung beschränkt sich auf BGB/HGB-Rahmen zur simulierten Auftragskette Angebot → Vertrag → Leistung/Lieferung/Abnahme → Rechnung/Forderung → Zahlung und behauptet keine Prüfung eines konkreten Vertrags.

## Primärquellen und Befunde zum 2026-10-31

| Quelle | Befund und Modellgrenze |
|---|---|
| BGB § 650 Abs. 1 | Lieferung herzustellender/zu erzeugender beweglicher Sachen unterliegt grundsätzlich Kaufrecht; bei nicht vertretbaren Sachen gelten benannte Werkvertragsregeln mit gesetzlicher Ersetzung der Abnahme durch maßgebliche Zeitpunkte aus §§ 446/447. Maßgeblich ist der konkrete Vertragsgegenstand, nicht allein, dass Fertigungsarbeit stattfindet. |
| BGB §§ 433, 271 | Kauf verpflichtet zur Übergabe/Eigentumsverschaffung sowie Kaufpreiszahlung und Abnahme; ohne vereinbarte Leistungszeit darf grundsätzlich sofortige Leistung verlangt/erbracht werden. Vertrag und Umstände können das konkretisieren. |
| BGB §§ 640, 641 und § 650g Abs. 4 | Bei einem Werkvertrag ist der Besteller Abnahmeakteur; eine Abnahmefiktion setzt unter anderem Fertigstellung, angemessene Frist und fehlende fristgerechte Mängelangabe voraus; bei Verbrauchern ist ein Textformhinweis nötig. Werklohn wird grundsätzlich bei Abnahme fällig; § 650g Abs. 4 gilt nur für seinen Anwendungsbereich und verlangt zusätzlich eine prüffähige Schlussrechnung. Keine allgemeine 14-/30-Tage-Frist folgt daraus. |
| BGB § 614 | Bei anwendbarem Dienstvertragsrecht wird Vergütung nach Leistung bzw. Ende des vereinbarten Zeitabschnitts fällig. Das ist kein pauschaler Auslöser für Fertigungsaufträge. |
| BGB § 286 | Verzug tritt grundsätzlich nach Mahnung nach Fälligkeit ein, mit gesetzlichen Ausnahmen. Abs. 3 enthält eine 30-Tage-Regel mit Voraussetzungen; gegenüber Verbrauchern ist ein besonderer Rechnungshinweis erforderlich. Spiel-Dunning darf nicht als gesetzlicher Verzug für alle Kunden dargestellt werden. |
| HGB § 252 Abs. 1 Nr. 4–5 | Für anwendbare handelsrechtliche Jahresabschlüsse gelten Realisations- und Periodisierungsgrundsätze; Erträge/Aufwendungen hängen nicht allein vom Zahlungszeitpunkt ab. Das ist kein allgemeiner Spiel-KLR-Buchungssatz und keine gesetzliche Aussage, dass in jedem Vertrag ausschließlich Abnahme das Umsatzrealisationsdatum sei. |

Abrufdatum und Rechtsstichtag: **2026-10-31**. Geprüft wurden die zu diesem Datum online konsolidierten amtlichen Gesetzestexte des Bundesministeriums der Justiz/Bundesamts für Justiz. Für die geprüften Normen wurde in den geöffneten geltenden Texten keine spezielle künftige Inkrafttretens- oder Übergangsklausel sichtbar, die den hier beschriebenen V3-Sachverhalt ändern würde. Keine Einzelfallprüfung und keine vollständige Novellen-/Übergangsrechtsanalyse für konkrete Kundenverträge.

Amtliche Quellen: [BGB § 433](https://www.gesetze-im-internet.de/bgb/__433.html), [BGB § 640](https://www.gesetze-im-internet.de/bgb/__640.html), [BGB § 641](https://www.gesetze-im-internet.de/bgb/__641.html), [BGB § 650](https://www.gesetze-im-internet.de/bgb/__650.html), [BGB § 650g](https://www.gesetze-im-internet.de/bgb/__650g.html), [BGB § 271](https://www.gesetze-im-internet.de/bgb/__271.html), [BGB § 286](https://www.gesetze-im-internet.de/bgb/__286.html), [BGB § 614](https://www.gesetze-im-internet.de/bgb/__614.html), [HGB § 252](https://www.gesetze-im-internet.de/hgb/__252.html).

## Abgleich mit T-0069

Der bestehende A02/A03-Vertrag trennt Annahme, tatsächliche Operation/Leistung, Lieferung/Abnahme, Rechnung/OP und Zahlung mit eigenen Ereignisbezügen. Er verlangt, dass Abnahme beim Auftraggeber/Empfänger statt beim Auftragnehmer liegt, Zahlung keinen Erlös erneut erzeugt und fehlende A03-APIs `pending/non-posting` bleiben. A03 und A09 haben den Vertrag auf logischer Ebene jeweils PASS reviewed.

Das kollidiert nicht mit den oben genannten Normen, sofern T-0069 nicht aus der Liefer-/Fertigungsart pauschal einen Werkvertrag ableitet und die Abnahme-/Fälligkeitsspur nur als vertragsspezifische oder ausdrücklich vereinfachte Spielregel beschreibt. Für den Spielrelease sind insbesondere folgende Einschränkungen einzuhalten:

1. Beim Werkvertrag muss die Abnahmehandlung dem **Besteller** zugewiesen sein; der „Empfänger“ genügt nur, wenn er Besteller ist.
2. Abnahmefiktion, Teilabnahme, Mängelrechte, Käuferstatus und Rechnungserfordernisse werden nicht automatisch simuliert, solange ihre Voraussetzungen nicht als echte Szenariodaten umgesetzt sind.
3. Die vereinfachte A03-KLR-Erlöswirkung bleibt als Spielmodell gekennzeichnet. HGB-Konformität wird nicht behauptet.
4. Kunden-Verzugs-/Mahnfolgen bleiben Simulationsparameter, sofern Fälligkeit, Zugang, Kundenstatus und erforderliche Hinweise nicht modelliert sind.

**Reviewentscheidung:** Bedingter PASS zum logischen Vertrag; kein materieller Rechtskonflikt, der heute eine Änderung der Runtime erzwingt. Es gibt einen klaren Releasehinweis an A02/A03/A05, diese Grenzen bei der UI-/Ereignis-Integration sichtbar einzuhalten. Wenn die konkrete Implementierung eine einheitliche gesetzliche Abnahme/Fälligkeit für alle Fertigungsaufträge oder gesetzliche Verzugsfolgen behauptet, ist vor V3-Release eine korrigierende Fachänderung plus A09-Re-Review erforderlich.

## Änderungs- und Nachweisstatus

- **Geänderte Dateien:** `docs/legal/legal-framework-register.md`; dieser Quellen-/Auswirkungsbericht.
- **Produktcode / Schema / Architektur:** nicht geändert.
- **Entscheidungen:** keine neuen Spiel-, Vertrags-, Steuer- oder Accountingregeln gesetzt.
- **Ausführung:** A08-Preflight, amtliche Quellenprüfung und Impactabgleich abgeschlossen.
- **Fachreview:** A03-T-0069-Re-Review PASS lag als Eingang vor; keine Rechtsfreigabe daraus abgeleitet.
- **Unabhängige QA:** nicht ausgeführt.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** nicht verfügbar aus diesem A08-Prozess; `git` im aufgabenzugeordneten Toolkontext meldete „this operation must be run in a work tree“. Kein Commit oder Push.
- **Blocker:** keiner für logischen Vertrag; V3-Release-Gate bedingt durch sichtbare Modellkennzeichnung und A09-Prüfung.
- **Nächster Schritt:** A01 bindet die Releasehinweise in T-0069 ein; A02/A03/A05 prüfen konkrete UI-/Eventlabels gegen diesen Nachtrag; A09 kontrolliert die Kennzeichnung im Produkt-/Jahresreview.
