# A08-Recherche: Reihenfolge taggleicher Zahlungseingänge und Ausgänge

Datum: 2026-10-27
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / CP-0155 / CP-0157
Status: Abgeschlossen; Nutzerentscheidung D-0120 umgesetzt

## Frage

Wenn in der Simulation am selben wirksamen Tag ein Kundeneingang und eigene fällige Verbindlichkeiten zusammentreffen und die Eröffnungsliquidität für alle Zahlungen nicht reicht: soll der Kundeneingang vor den vom Spieler priorisierten eigenen Vollzahlungsversuchen verfügbar sein?

## Rechtslage

- **§ 675s BGB** regelt die Ausführungsfrist: Bei erfassten elektronischen Zahlungen muss der Zahlungsbetrag grundsätzlich spätestens am Ende des auf den Zugang des Zahlungsauftrags folgenden Geschäftstags beim Zahlungsdienstleister des Empfängers eingehen. Die Vorschrift bestimmt keine Reihenfolge verschiedener Zahlungen auf dem Geschäftskonto des Empfängers. [Gesetze im Internet: § 675s BGB](https://www.gesetze-im-internet.de/bgb/__675s.html)
- **§ 675t Abs. 1 BGB** verpflichtet die Empfängerbank, den Betrag unverzüglich verfügbar zu machen, nachdem er auf ihrem Konto eingegangen ist; die Wertstellung ist entsprechend an den Eingangstag gebunden. Das regelt Verfügbarkeit nach tatsächlichem Eingang bei der Empfängerbank, nicht eine abstrakte Priorität „Kundeneingang vor eigener Zahlung“ für sämtliche taggleichen Vorgänge. [Gesetze im Internet: § 675t BGB](https://www.gesetze-im-internet.de/bgb/__675t.html)
- **§ 675n BGB** knüpft den Eingang eines Zahlungsauftrags an Geschäftstage und erlaubt bankseitige Annahmeschlusszeiten. Damit kann die tatsächliche Ausführung von Auszahlungsaufträgen vom konkreten Zugangszeitpunkt und den Geschäftstagen abhängen. [Gesetze im Internet: § 675n BGB](https://www.gesetze-im-internet.de/bgb/__675n.html)

**Ergebnis:** Die recherchierten Vorschriften entscheiden die spielinterne Reihenfolge nicht. Sie sprechen für tatsächliche Verfügbarkeit und konkrete Ausführung als maßgeblich im realen Zahlungsverkehr; sie legitimieren keine universelle V1-Tie-Break-Regel.

## Branchenregeln und Zahlungsverkehrspraxis

- Das **EPC SEPA Credit Transfer Rulebook 2025 v1.1** sieht bei elektronischen SCT grundsätzlich eine maximale Ausführungszeit von einem Bankgeschäftstag vor und verlangt die Gutschrift beim Empfänger nach den einschlägigen Zahlungsdienstevorschriften. Der Regeltext legt keine Reihenfolge zwischen unabhängigen Zahlungseingängen und -ausgängen im Kontobuch eines Unternehmens fest. [European Payments Council: SCT Rulebook 2025 v1.1 (PDF)](https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-09/EPC125-05%202025%20SCT%20Rulebook%20version%201.1.pdf)
- Die **Deutsche Bundesbank** erläutert: herkömmliche SEPA-Überweisungen können bis zu einem Bankgeschäftstag dauern; SEPA-Echtzeitüberweisungen stehen üblicherweise binnen Sekunden rund um die Uhr zur Verfügung. Die Bundesbank dokumentiert außerdem getrennte Einreichungs- und Buchungsfenster im Hausbankverfahren. Das belegt, dass taggleiche tatsächliche Verfügbarkeit von Zahlungsweg, Annahmezeit und Bankverarbeitung abhängt, nicht allein vom vertraglichen Fälligkeitstag. [Bundesbank: Fragen und Antworten zu SEPA](https://www.bundesbank.de/dynamic/action/de/aufgaben/unbarer-zahlungsverkehr/serviceangebot/sepa/613964/fragen-und-antworten-zu-sepa?contentId=640184&firstLetter=W), [Bundesbank: Betriebszeiten und Einreichungsfenster](https://www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr/hausbankverfahren/betriebszeiten-603000)

## Forenberichte (anekdotisch, nicht normativ)

- Im **homebanking-hilfe.de**-Forum schildert ein Nutzer 2019, dass am Wochenende bereits sichtbare bzw. angenommene Umsätze erst am folgenden Geschäftstag rechtlich als gebucht erscheinen konnten. Das ist eine Einzelbeobachtung zu einem Bank-/Rechenzentrumsablauf, keine allgemeine Regel. [Forum: Buchungen mit Datum in der Zukunft?](https://homebanking-hilfe.de/forum/topic.php?t=23610)
- Ein Beitrag in der **DATEV-Community** berichtet unterschiedliche Verarbeitungsgeschwindigkeiten und Annahmeschlusszeiten bei Banken sowie die daraus entstehende Unsicherheit taggleicher Wertstellung. Auch dies ist eine Praxiserfahrung, keine verbindliche Branchenregel. [DATEV-Community: Echtzeitüberweisung](https://www.datev-community.de/t5/Unternehmen-online/Echtzeit%C3%BCberweisung/m-p/463336)

## Historischer Produktvorschlag vor D-0120

Für einen schnellen und reproduzierbaren V1-Zyklus wird **Variante A** empfohlen:

1. Phase 8 bucht alle für den Simulationstag bestätigten Kundeneingänge zuerst vollständig und ohne Cash-Gate.
2. Anschließend versucht die Simulation eigene fällige Rechnungen vollständig zu zahlen, in der vom Spieler gewählten Reihenfolge und jeweils mit Liquiditätsprüfung.
3. Fehlgeschlagene eigene Zahlungen bleiben den bestätigten Retry-/Dunning-Regeln unterworfen.

Das ist eine explizite **Spielkonvention**, keine Aussage über eine gesetzliche oder universelle banktechnische Priorität. Sie hält die bereits bestätigte Unterscheidung zwischen Kundeneingängen ohne Cash-Gate und eigenen Auszahlungen mit Cash-Gate bei und macht den Tageslauf deterministisch. Eine strengere Variante B (eigene Auszahlungen vor Kundeneingängen desselben Tags) würde bei knapper Liquidität zusätzliche Zahlungsausfälle auslösen. Intraday-Bankzeitpunkte wären realistischer, benötigen aber Daten und Komplexität, die für den schnellen V1-Prototyp nicht vorliegen.

## Historische Nutzerfrage (geschlossen)

**Soll V1 an einem Tag mit knapper Liquidität zuerst alle fälligen Kundeneingänge gutschreiben und danach die eigenen Vollzahlungsversuche in deiner gewählten Reihenfolge ausführen?**

Empfohlene Antwortoptionen:

- **Ja (V1-Vorschlag):** Kundeneingänge des Tages sind vor den eigenen Zahlungsversuchen verfügbar.
- **Nein:** eigene Zahlungen werden zuerst versucht; Kundeneingänge werden danach gebucht.

Die Entscheidung betraf nur die Reihenfolge innerhalb des Simulationstags. Sie änderte weder Fälligkeitstage noch die Bestätigung, dass Kundeneingänge kein eigenes Cash-Gate haben und eigene Auszahlungen eines haben. Der folgende Nutzerentscheid hat die Frage geschlossen.

## Ergebnis der Nutzerentscheidung (2026-10-27)

A01 stellte die Einzelfrage an den Nutzer. Antwort: **„Kundeneingänge zuerst (Empfehlung)“**. Damit ist D-0120 beschlossen: Phase 8 bucht am selben wirksamen Tag zunächst alle fälligen Kundeneingänge ohne eigenes Cash-Gate, anschließend eigene Vollzahlungsversuche in Spielerreihenfolge mit Cash-Gate. Das ist eine V1-Spielkonvention und keine aus Gesetz oder EPC-SCT-Regelwerk abgeleitete allgemeine Bankpriorität. Die Regel ist in der aktuellen A02-Fachspezifikation und der V1-Umsetzung abgebildet.
