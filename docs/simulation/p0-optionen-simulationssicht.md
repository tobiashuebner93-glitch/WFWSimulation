# A02 – P0-Optionen aus Simulationssicht: A, F, G und I

**Stand:** 26.09.2026 · **Bezug:** MG-000 / SLG-000.2 / CP-0014 / D-0010
**Status:** Entscheidungsgrundlage, keine getroffene Nutzerentscheidung und keine Architekturfreigabe.
**Grenze:** Vollständige V1-Auftragsabwicklung. Keine Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung. D-0010 bleibt unverändert.

## Kurzüberblick für A01 und den Nutzer

| P0 | A02-Empfehlung | Vor welcher Implementierung muss die Nutzerentscheidung feststehen? |
|---|---|---|
| A Zeit | Simulationsuhr in Kalendertagen; Spieler stößt einen Tagesschritt an; monatliche Periode nur für periodische Vorgänge/Reports. Bestellungen/Eingänge → Produktion → Lieferung/Abnahme → Rechnungsauslösung → Fälligkeiten/Zahlungen → Tages-/Periodenschluss; deterministische Prioritäten und stabile Tie-Breaks. | Vor Zeitvorschub, Termin-/Fälligkeitslogik, periodischen Kosten und Ereignisverarbeitung. |
| F Abnahme/Rechnungsfähigkeit | Eine bestätigte vollständige Lieferung macht den Gesamtauftrag rechnungsfähig; keine separate Kundenabnahme als V1-Gate. Abnahmebeleg kann als optionale Information vorliegen. Rechnungsfähigkeit ist kein automatischer Rechnungsbeleg. | Vor Abnahme-, Liefer- und Rechnungsübergängen. A03 bestätigt finanzielle Folge. |
| G Abschluss | Operativ abgeschlossen nach vollständiger Produktion und vollständiger Lieferung; falls Nutzer F als Pflichtabnahme wählt, zusätzlich bestätigte Abnahme. Rechnung/Zahlung sind keine operative Abschlussbedingung. Finanzabschluss separat durch A03. | Vor Auftragsstatus-/Abschlussvalidierung und finaler Ergebnislogik. |
| I Start | Kanonisches festes Profil mit D-0010-Fakten; zusätzliche Betriebswerte explizit befüllen; keine nicht deterministische Marktsimulation in der Startkonfiguration. Regeln, Profilversion und Befehlsreihenfolge versionieren; Seed plus RNG-Version nur, wenn Zufall V1 wird. | Vor Spielstart, initialer Zustandsanlage und Reproduktions-/Replay-Verhalten. |

Die Empfehlungen sind A02-Fachvorschläge. Nutzer wählt Produktverhalten; A03 entscheidet finanzielle Interpretation; A04 modelliert Persistenz; A11 klärt Orchestrierung/Systemgrenzen. Die Optionsauswahl gibt keine Architektur frei.

## A. Zeit, Perioden und Ereignisreihenfolge

### Option A1 – Tagesraster mit Monatsperioden (A02-Empfehlung)

**Fachliche A02-Regel:** Ein Simulationsschritt entspricht einem Kalendertag. Ein Schritt verarbeitet alle am Tag fälligen operativen Tatsachen in festgelegter Reihenfolge. Spielerbefehle für einen Tag werden vor dessen Auflösung erfasst. Zeitabhängige Lieferungen und Fälligkeiten verwenden ein Simulationsdatum. Eine Monatsperiode dient nur dort als Abschluss-/Auswertungsintervall, wo A03 periodische Kosten/BAB-Auswertung benötigt; sie ersetzt keine Tagesereignisse. Keine automatische Teilverarbeitung.

Vorschlag für Ereignisreihenfolge desselben Tages:

1. Tagesbeginn: für den Tag terminierte Lieferanteneingänge/Fremdleistungen erfassen; angenommene Mengen werden verfügbar.
2. Produktion: verfügbare Tageskapazität vollständig auf bestätigte Aufträge gemäß Spielerpriorität anwenden; Verbrauch erfassen; Produktionsabschluss am Tagesende feststellen.
3. Auslieferung: fällige Lieferung vollständig ausführen, wenn Produktion vollständig abgeschlossen ist; bei Bedarf Abnahme nach der vom Nutzer festgelegten F-Regel erfassen.
4. Abrechnung: nach Erreichen des bestätigten Rechnungsfähigkeitsereignisses Rechnung kann ausgelöst werden; ob am selben Tag automatisch oder erst nach Command ist noch Nutzer-/A03-Produktverhalten.
5. Fälligkeiten/Zahlungen: fällige Finanzvorgänge erst nach A03s Trigger-/Zahlungsregel auslösen. Zahlung ist voller Betrag; Fälligkeit allein erzeugt nicht still eine Teilzahlung.
6. Tages-/Periodenschluss: Status/Ergebnisprojektionen abschließen; am Monatsletzten periodische Kosten-/BAB-Fakten gemäß bestätigter A03-Regel dem Monat zuordnen. Periodenschluss ist kein rückwirkender Umbuchungslauf.

**Gleicher Zeitpunkt:** Abhängigkeiten (z. B. Wareneingang vor Verbrauch) haben Vorrang. Unabhängige Ereignisse innerhalb einer Prioritätsklasse werden stabil nach einem gespeicherten Schlüssel sortiert (z. B. Spielerpriorität, danach Auftrags-/Ereignis-ID); keine zufällige oder von Datenbank-Reihenfolge abhängige Auflösung. Ein Ereignis, dessen Voraussetzung erst in einer späteren Klasse erfüllt wird, kann in derselben Tagesauflösung nur folgen, wenn seine Klasse noch nicht abgeschlossen ist; andernfalls frühestens am nächsten Tag. Dieser Grenzfall muss vor Implementierung verbindlich festgelegt werden.

**Technische Konsequenz (keine Architekturvorgabe):** Tagesuhr, Start-/Enddatum, Ereigniszeitpunkt, Priorität/Sequenz und Regelversion müssen nachvollziehbar sein. A04-Modell schlägt Simulationsuhr/BusinessEvent vor; A11 klärt Phasenorchestrierung und Replay. A03 benötigt klaren Periodenbezug und effektives Datum. Spieler sieht einen verständlichen Tagesvorschub und kann Ursache einer Verzögerung nachlesen.

**Vor-/Nachteile:** Tagesgenauigkeit bildet Lieferzeiten und Fälligkeiten nachvollziehbar ab; mehr Schritte als bei Wochen-/Monatslauf. Monatsperioden halten Fixkosten-/BAB-Auswertung verständlich; sie erfordern Grenztagsregel. Der exakt gespeicherte Tie-Break macht Wiederholung stabil; eine feste Sequenz kann als Spielregel sichtbar werden.

### Option A2 – Wochenraster mit Monatsabschluss

**Fachregel:** Zeit springt in 7-Tage-Schritten. Lieferungen, Produktion und Fälligkeiten werden innerhalb des Wochenfensters zu einem vereinbarten Wochenzeitpunkt gruppiert; der genaue Tag bleibt entweder gespeichert oder wird auf den Schrittstichtag gelegt.

**Folgen:** Simulation hat weniger Aktionen, aber Termine werden gröber oder benötigen weiterhin Tagesdaten. Datenmodell muss Zeitraum und konkretes effektives Datum unterscheiden. A03 muss entscheiden, ob Zahlungs-/Kostenwirkungen am individuellen Tag oder gebündelt entstehen. Spieler erhält schnelleren Spielfluss, kann aber Liefer-/Zahlungsreihenfolge innerhalb der Woche schlechter beeinflussen. Vorteil: weniger Klicks und kompaktere Perioden. Nachteil: Gleichzeitigkeit/Terminunschärfe und mögliche Reihenfolgeeffekte. Nutzer muss Aggregations- und Fälligkeitsverhalten bestätigen.

### Option A3 – Ereignisgesteuerte Simulationsuhr

**Fachregel:** Uhr springt jeweils zum frühesten geplanten Termin (Lieferung, Produktionsende, Fälligkeit, Periodenende); Spieler kann dazwischen pausieren/eingreifen.

**Folgen:** Ereignisplan und Sequenz werden persistiert; A04/A11 brauchen stabile Queue-/Replay-Semantik. A03 erhält genaue effektive Zeitpunkte; gleichzeitige Ereignisse benötigen trotzdem Prioritäten und Tie-Break. Spieler kann Termine effizient überbrücken und bei Ereignissen reagieren; Ablauf und Zeitvorschub sind erklärungsbedürftiger. Vorteil: wenige Leerschritte und hohe Zeitauflösung. Nachteil: größere fachliche/technische Komplexität. Nutzer muss automatische Sprünge und Unterbrechungen ausdrücklich wählen.

### A – noch zu bestätigende Details / Muss für V1

| Frage | Fachliche Empfehlung A02 | Nutzerentscheidung | Muss für erste Implementierung? |
|---|---|---|---|
| Zeiteinheit/Kalender | A1: Kalendertag; Monat als Reporting-/Kostenperiode. Geschäfts-/Feiertagskalender nicht stillschweigend simulieren. | Tages-, Wochen- oder Ereignisschritte; Spielkalender/Weekend-Verhalten. | **Ja** für Zeituhr, Fristen, Produktion und Periodenkosten. |
| Spieler-Vorschub | Ein expliziter Tagesschritt; optional später „bis Ereignis“ als Komfortbefehl, wenn die Semantik identisch bleibt. | Manuell ein Tag, mehrere Tage oder automatisch bis Ereignis. | **Ja** für Auslösung von Zeit und Fälligkeiten. |
| Fälligkeit | Simulationsdatum plus Vertragsregel; fällig am errechneten Datum, offen bis volle Zahlung verbucht ist. Kalenderkonvention A03/User. | Zahlungsziel und automatische/spielerische Zahlung; D-0010 erlaubt begrenzte Vertragsvarianten. | **Ja** für OP-/Zahlungsablauf; keine Teilzahlung. |
| Tagesreihenfolge | Abhängigkeitsklassen wie oben; stabile Priorität. | Bestätigung, ob Produktionsabschluss und Auslieferung am selben Tag möglich sind und ob neue Rechnung am selben Tag fällig sein kann. | **Ja** für reproduzierbare Ergebnisse. |
| Periodenübergang | Periodische Kosten/BAB am Ende des Simulationsmonats nach Tagesereignissen; Finanzzuordnung A03. | Ob V1 Periodenabschluss/Monatssicht nutzt und wann der Spieler sie sieht. | **Ja**, sofern V1 Monatskosten/BAB/Abschluss zeigt; sonst kann periodischer Teil später kommen. |

**A02-Regel:** Abhängigkeiten dürfen nicht durch zufällige Reihenfolge gebrochen werden; alle Zeitereignisse basieren auf Simulationszeit, nicht auf Wandzeit. **Technik:** Sequenz/Version/effektiver Zeitpunkt speichern; A11 entscheidet Ausführungsorchestrierung. **Nutzerentscheidung:** A1/A2/A3 und die markierten Same-day-/Fälligkeitsregeln bestätigen. Empfehlung: **A1**.

## F. Lieferung, Abnahme und Rechnungsfähigkeit

Alle Optionen betreffen **vollständige** Lieferung/Leistung des bestätigten Auftragsumfangs; es gibt in V1 keine Teilabnahme oder Teilrechnung. A03s Finanzspezifikation trennt Lieferung/Abnahme, Rechnung, Forderung und Zahlung; die Rechnung begründet im vereinfachten Modell die Forderung/Erlöswirkung nach A03-Regel.

### Option F1 – Vollständige bestätigte Lieferung genügt (A02-Empfehlung)

**A02-Regel:** Lieferung ist erfolgt, wenn die gesamte bestätigte Menge am vereinbarten Ziel als zugestellt markiert ist. Dieser bestätigte Event-Zeitpunkt macht den Gesamtauftrag rechnungsfähig. Keine zusätzliche Kundenabnahme als zwingendes Gate. Eine Empfangs-/Abnahmebestätigung kann gespeichert werden, ohne den Rechnungs-Trigger zu verzögern. Rechnungsfähigkeit gestattet Rechnungsauslösung; sie erzeugt nicht selbst Rechnung, Forderung oder Zahlung.

**Simulation:** einfacher Übergang `PRODUCTION_COMPLETE → DELIVERED → INVOICEABLE`; bei fehlender Zustellung bleibt Auftrag nicht rechnungsfähig. **Datenmodell:** Delivery mit Gesamtmenge/-zeit und optional Acceptance-Objekt/Beleg; keine Teillieferung. **Accounting:** A02 meldet Delivery/Invoiceable; A03 entscheidet, ob Rechnungsstellung Forderung/Erlös auslöst. **Spielerlebnis:** klarer Liefer- und Rechnungsmeilenstein, kein Warten auf zweiten Klick. **Vorteile:** wenige Zustände; geringer Startaufwand. **Nachteile:** Qualitäts-/Kundenprüfungen beeinflussen Rechnungsfähigkeit nicht. **Implementierung:** Lieferung und Rechnungsfähigkeits-Event sind zwingend; Acceptance optional.

### Option F2 – Explizite vollständige Kundenabnahme ist Gate

**A02-Regel:** Nach vollständiger Lieferung wartet der Auftrag auf `DeliveryAccepted`; erst bestätigte Gesamt-Abnahme macht ihn rechnungsfähig. Ablehnung blockiert Rechnung und verlangt einen vom Nutzer zu definierenden Korrektur-/Reklamationspfad (dieser Pfad ist Zusatzumfang und muss begrenzt oder ausgeschlossen werden).

**Simulation:** zusätzlicher Zustand `AWAITING_ACCEPTANCE`, Abnahme-/Ablehnungsentscheidung und eventueller Stillstand. **Datenmodell:** Acceptance wird obligatorisch und benötigt Zeitpunkt, actor/source, Ergebnis/Beleg. **Accounting:** A03 erhält Acceptance-Datum als Leistungs-/Forderungstrigger-Input; genaue Finanzwirkung bleibt A03. **Spielerlebnis:** vermittelt Abnahme/Qualitätsfreigabe, kostet zusätzlichen Schritt und kann offene Aufträge erzeugen. **Vorteile:** dokumentiert explizite Kundenfreigabe. **Nachteile:** Ablehnung braucht Regeln, kann Spielfluss unnötig blockieren. **Implementierung:** ja, falls gewählt; Annahmefrist und Ablehnungsauswirkung ebenfalls vor Implementierung entscheiden.

### Option F3 – Abnahme mit Frist und automatischer Annahme

**A02-Regel:** Nach vollständiger Lieferung beginnt eine festgelegte Prüfzeit; ausdrückliche Ablehnung innerhalb dieser Zeit blockiert Rechnungsfähigkeit, andernfalls gilt Lieferung am Fristende als akzeptiert und wird rechnungsfähig.

**Folgen:** Simulationsuhr erzeugt `AcceptanceDeadlineReached`; Acceptance-Regel/Frist als versionierter Parameter im Modell; A03 braucht das effektive Abnahmedatum. Spieler kann rechtzeitig reagieren, muss Frist/Abweichung überwachen. **Vorteile:** bildet Kundenprüfung mit begrenztem Blockaderisiko ab. **Nachteile:** Fristlänge, Ablehnung/Qualitätsfälle und Fälligkeit koppeln weitere Regeln; V1 hat mehr Mechanik. **Implementierung:** ja, wenn gewählt, inkl. Frist und Feiertags-/Wochenendbehandlung.

**A02-Empfehlung:** F1 für V1, sofern der Nutzer keine explizite Abnahme als zentrales Spielziel verlangt. Ein sachlicher bestätigter Liefernachweis genügt operativ; eine separate Acceptance-Entity kann als optionaler Beleg erhalten bleiben, ohne V1-Rechnungsfähigkeit zu blockieren. **Nutzerentscheidung:** F1/F2/F3 und (falls F2/F3) Ablehnungs-/Fristfolgen. **A03-Abstimmung:** Rechnungsfähigkeit ist ein operativer Trigger, Rechnungsstellung und finanzielle Ansatzzeit bleiben getrennte A03-Regeln.

## G. Operativer Auftragsabschluss

### Option G1 – Abschluss nach vollständiger Leistung und Lieferung (A02-Empfehlung)

**A02-Regel:** Operativ `CLOSED`, wenn bestätigte Gesamtmenge vollständig produziert und geliefert ist und – falls F2/F3 gewählt – vollständige Kundenabnahme bestätigt ist. Rechnung ist nicht Bedingung: `INVOICEABLE` und `INVOICED` bleiben getrennt. Zahlung ist niemals Voraussetzung für operativen Abschluss. Abschluss hält operative Fakten fest und erlaubt keine stillen Änderungen.

**Simulation:** klare terminale operative Bedingung; Lieferbeleg/Abnahmebeleg vollständig. **Datenmodell:** getrennte Operations-, Rechnungs-, OP- und Zahlungszustände, wie A04-Modell vorsieht; A03-OrderResult kann vorläufig/final gesondert ausweisen. **Accounting:** offene Rechnung/Forderung/Zahlung bleibt sichtbar; A03 bestimmt finanzielle Finalität. **Spielerlebnis:** abgeschlossene Produktion wird als erledigt erkannt, während Zahlungseingang nachlaufen darf. **Vorteile:** Zuständigkeiten klar, kein Wartestatus auf Kundenliquidität. **Nachteile:** Unternehmensspiel kann noch offene Forderung haben, wenn nächster Auftrag startet. **Implementierung:** ja, Übergangskriterien und zulässige offene Finanzpositionen müssen entschieden sein.

### Option G2 – Abschluss nach vollständiger Lieferung plus ausgestellter Rechnung

**A02-Regel:** Operativ `CLOSED` erst, wenn Gesamtmenge produziert/geliefert (und ggf. angenommen) **und** Gesamtauftrag vollständig in Rechnung gestellt wurde; Zahlung bleibt getrennt.

**Folgen:** Rechnungsworkflow wird operative Abschlussvoraussetzung. Datenmodell/Status brauchen Invoice-Referenz; A03 muss invoice-issue/void/correction Status liefern; Spieler kann Auftrag nach Auslieferung nicht schließen, bis Abrechnung erledigt ist. **Vorteile:** operative Abschlussliste bedeutet zugleich fakturiert. **Nachteile:** administrativer Schritt blockiert operative Fertigmeldung; vermischt weiterhin Operations und Finance teilweise. **Implementierung:** ja, einschließlich Behandlung nicht ausgestellter/korrigierter Rechnung.

### Option G3 – Gesamtabschluss erst nach voller Zahlung

**A02-Regel:** Status `CLOSED` erst nach vollständiger Leistung, Lieferung, Rechnungsstellung und vollständiger Zahlung sämtlicher kunden- und lieferantenseitiger offener Positionen des Auftrags. V1-Teilzahlung bleibt ausgeschlossen; jede Zahlung wäre voller Betrag ihrer Verpflichtung.

**Folgen:** A02-Status hängt von A03-OP-/Zahlungszustand ab; A04 muss übergreifende finanzielle Erledigung zurückmelden; Spieler sieht Auftrag ggf. lange offen. **Vorteile:** „geschlossen“ bedeutet im engen Sinne vollständig erledigt. **Nachteile:** Zahlungstiming/Kundenverhalten hält den Produktionsauftrag offen und vermischt operative/finanzielle Zuständigkeiten; Verbindlichkeiten können nicht eindeutig nur einem Auftrag zugeordnet sein. **Implementierung:** ja, aber größere Kopplung und klarer A03→A02-Statusvertrag erforderlich.

**A02-Empfehlung:** G1 plus zwei getrennte Sichten: `operativer Auftragsstatus` (A02) und `finanzielle Abwicklung` (A03; offene Rechnung/Forderung/Verbindlichkeit/Zahlung). G1 kann operative Abwicklung schließen, während der A03-Auftragsergebnisstatus `PROVISIONAL`/finanziell offen bleibt. **Nutzerentscheidung:** G1/G2/G3 und ob Lieferantenverbindlichkeiten überhaupt Abschlussbedingung sein sollen. **Fachgrenze:** A02 entscheidet Leistungsschluss; A03 entscheidet Finanzvollständigkeit. **Technik:** A04-Modell unterstützt Statusdimensionen; A11 bestätigt Übergabekonsequenz. **Muss vor erster Implementierung:** operative Abschlussbedingung und Abhängigkeit von Rechnung/Zahlung.

## I. Startunternehmen und reproduzierbarer Start

### D-0010: bereits festgelegte Startfakten

- Start mit bestehendem Unternehmen, keine Unternehmensgründung in V1.
- Ein gemieteter Raum, eine Maschine, drei Beschäftigte.
- 50.000 € Startbudget. D-0010 legt **nicht** fest, ob das vollständig Kasse/Liquidität, Eigenkapital, Finanzierung oder eine andere Eröffnungsposition ist.
- A02 und A03 sollen weitere notwendige Parameter fachlich bestimmen.
- D-0010 sagt weder Werte für Kapazität/Skills/Material/Kunden/Bestellungen noch Startdatum/offene Aufträge oder Simulationsseed fest.

### Simulationsparameter, die ein reproduzierbares Startprofil benötigt

**Betriebliche A02-Parameter:** Profil-/Szenarioversion; Simulationsstichtag und Kalender/Zeitbasis; Maschinen-ID/Typ, Arbeitsgänge und nutzbare Kapazität je Zeiteinheit; drei Mitarbeiterrollen/Skills und verfügbare Arbeitszeit je Zeiteinheit; Ausfall-/Abwesenheitsregeln (oder explizit keine); Materialstamm, verfügbare Anfangsmengen und ggf. Reservierungen; Produkt-/Bauteilbeschreibung, Stücklisten- und Arbeitsgangmengen, Durchlauf-/Lieferzeiten; Lieferanten, angebotene Materialien, Preise und Lieferzeiten; Kunden und ggf. definierte Erstnachfrage; Anfangszustände offener Angebote/Aufträge/Bestellungen/Receipts/Deliveries; angenommene Kunden-/Lieferantenkonditionen; laufende operative Ereignisregeln und Startreihenfolge. Ohne Nachfragezufall kann Kundenbestand ein fester Profilbestand sein.

**A03-Parameter bzw. gemeinsame Bestätigung:** Währung EUR als vom D-0010-Wert nahegelegte Darstellung; genaue Betrags-/Netto-Brutto-/Steuersemantik; Aufteilung/Klassifikation des 50.000-€-Startbudgets und vollständige Eröffnungssalden; Mietzahlung/-konditionen; Kosten-/Satzbasis für Arbeit, Maschine, Energie, Material, Bezug/Transport und BAB; offene Forderungen/Verbindlichkeiten zum Stichtag; Zahlungsziel- und Fälligkeitspraxis. A02 liefert Mengen, Zeitpunkte und Ressourcenereignisse, keine Werte oder Finanzsalden.

**A04-Datenmodellhinweis:** Das vorgeschlagene Modell nennt die Firma, gemietete Facility, Maschine, drei Employees und Opening Balance; Währungscode, Stichtag, weitere Eröffnungswerte und finanzielle Einordnung bleiben offen. A04 führt SimulationRun mit Simulationsuhr, Regel-/Modulversion und Seedreferenz als Vorschlag. Das ist keine Persistenzfreigabe.

### Startprofil-Optionen

#### Option I1 – Fester kanonischer Startzustand (A02-Empfehlung)

Ein einziges offen dokumentiertes Startprofil mit den D-0010-Fakten plus durch Nutzer/A02/A03 bestätigte Zusatzwerte. Keine Zufallsgenerierung der Anfangsressourcen, Kundenaufträge oder Lieferanten. Alle Zustände starten auf einem festgelegten Simulationsstichtag; alle anfänglichen Bestände/offenen Vorgänge sind explizit aufgelistet.

**Simulation:** gleiche Ausgangslage für jeden Spieler und Vergleich von Entscheidungen möglich. **Datenmodell:** Szenario-/Regelversion und vollständiger Opening Snapshot erforderlich; alle Bestände und offenen Vorgänge explizit. **Accounting:** Opening Balance und offene Finanzpositionen müssen A03-klassifiziert sein. **Spielerlebnis:** reproduzierbarer Lern-/Spielstart, aber wenig Variation. **Vorteile:** leicht nachvollziehbar und debugbar; keine Seed-Abhängigkeit. **Nachteile:** gleicher Erstlauf. **Implementierung:** Startdatum, Werte aller verfügbaren Anfangsparameter, offene Vorgänge und Profilversion sind Pflicht.

#### Option I2 – Seed-generierter Startzustand

D-0010-Grundgerüst bleibt gleich; sekundäre Parameter (z. B. Kunde, Anfangsbedarf, Auftrags-/Lieferzeit) werden aus einem gespeicherten Seed generiert.

**Simulation:** Seed und RNG-Algorithmus/Version, Generierungsregeln sowie Reihenfolge müssen festgehalten werden; identischer Seed muss denselben Snapshot erzeugen. **Datenmodell:** Seedreferenz allein reicht nur, wenn Algorithmus/Parameter/versioniert dauerhaft ausführbar sind; sonst fertigen Start-Snapshot speichern. **Accounting:** generierte Beträge/Offenposten müssen dennoch gültige A03-Regeln/Salden erfüllen. **Spielerlebnis:** mehr Variation, aber schlechtere Vergleichbarkeit. **Vorteile:** wiederholbare Variation mit gleichem Seed. **Nachteile:** höhere QA-/Balance- und Erklärungskosten; Nutzer muss Zufallsumfang absegnen. **Implementierung:** Seed, RNG-Version, Generierungsregeln, Snapshot und Gültigkeitsgrenzen zwingend.

#### Option I3 – Fester Start, seeded Zufallsereignisse im Verlauf

Startzustand bleibt kanonisch; späteres Kundenverhalten, Lieferverzug oder Marktimpulse können zufallsabhängig sein.

**Simulation:** Start ist vergleichbar; Verlauf reproduzierbar nur bei gespeichertem Seed, RNG-Version und Ereignis-/Command-Historie. **Datenmodell:** zusätzlich RNG-Kontext und gezogene Ereignisse/Sequenz. **Accounting:** Zufallsereignisse dürfen keine ungültigen Geschäftsvorfälle oder ungestimmten Finanzwirkungen erzeugen. **Spielerlebnis:** vertrauter Start plus abwechslungsreicher Verlauf. **Vorteile:** Variation ohne unklaren Start. **Nachteile:** größte Regel-/Testkomplexität; benötigt viele noch nicht entschiedene Wahrscheinlichkeiten und Konsequenzen. **Implementierung:** nur wenn Nutzer Zufall V1 verlangt; Seed allein definiert keine zulässigen Ereignisse.

### Seed und Reproduzierbarkeit – Empfehlung und offene Bestätigung

A02 empfiehlt I1 und deterministischen V1-Verlauf, bis eine konkrete Zufallsmechanik als MVP-Verhalten beschlossen ist. Dann braucht der fachliche Replay-Schlüssel mindestens: identisches Startprofil und dessen Version, Startdatum/Simulationszeit, festgelegte Regel- und Maschinenbau-Modulversion, geordnete Spieler-Commands mit wirksamem Zeitpunkt, feste Ereignisprioritäten und identische A02/A03-Regelversionen. A11 beurteilt die technische Grenze; A04 die Speicherung.

Wenn V1 keinen Zufall nutzt, ist ein PRNG-Seed für fachliche Ergebnisse nicht erforderlich; stabile Commands, Regeln und Opening Snapshot genügen. Das Modell kann ein Seedfeld für spätere Versionen vorsehen, ohne es in V1 fachlich zu verwenden. Wenn Zufall vor Spielstart oder während des Laufs V1 beeinflusst, sind Seed **und** RNG-Algorithmus/-Version plus Ereignisprotokoll erforderlich; ein bloßer Seed ist nicht hinreichend, wenn Implementierungsversionen wechseln. D-0009 (Seed/Commands/Regel-/Modulversionen) bleibt `PROPOSED`, ist also keine Freigabe. **Nutzerentscheidung:** ob V1 überhaupt Zufall enthält und ob gleiche Kommandos stets gleiche Ergebnisse haben sollen.

**I – Muss für erste Implementierung:** feste D-0010-Fakten; Nutzerbestätigung der Zusatzwerte und Stichtag; A02-Festlegung operativer Kapazitäts-/Material-/Kunden-/Lieferanten-/Bestellstartwerte; A03-Klassifikation des Budgets, Kosten- und offenen Finanzpositionen; stabile Profil-/Regelversionierung. Seed/RNG nur zwingend, wenn Zufall Einfluss nimmt.

## Offene Abstimmungen und Rollen

| Ebene | Erforderlicher Beitrag |
|---|---|
| Fachliche A02-Regel | Zeitfortschritt, Reihenfolge/operative Abhängigkeiten, Liefer-/Abnahmeereignis, Rechnungsfähigkeitsmeilenstein, operative Abschlussbedingung, betriebliche Startparameter und deterministische Prozessregeln vorschlagen. |
| Technische Konsequenz | A04 bewertet Start-/Zeit-/Statusfelder und History; A11 prüft Orchestrierung, gleichzeitige Events, Replay/Systemgrenze. Der Vorschlag setzt kein Schema und keine Architektur frei. |
| A03 Accounting | Trigger/Datum der Rechnung, Forderung/Verbindlichkeit, Zahlung/Fälligkeit, periodische Kosten/BAB und finanzieller Abschluss; Bestätigung, dass eine bestimmte Simulationsfolge diese Inputs korrekt liefert. |
| Nutzerentscheidung | A1/A2/A3, F1/F2/F3, G1/G2/G3, I1/I2/I3 sowie jeweilige markierte Produktregeln bestätigen oder ändern. Keine automatische Wahl durch A02. |
| A01 Governance | Ergebnis dem Nutzer vorlegen und bestätigen lassen; spätere Implementierungsarbeit erst mit separater Ziel-/Ticket-/Freigabeentscheidung starten. |

## Änderung und Prüfung

- Neu: diese Entscheidungsgrundlage. Keine bestehenden Dateien verändert.
- D-0010 wurde nicht geändert. Keine Implementierung, Migration, Supabase-/Datenbankänderung, Commit oder Architekturfreigabe.
- Vorhandene Änderungen beim Start blieben erhalten: Änderungen an `collaboration-state.md`, `decision-log.md`, `ticket-board.md` und A02-Spezifikation; untracked waren A03-Finanzspezifikation sowie Checkpoints CP-0007 bis CP-0009/CP-0014. Diese Arbeit hat sie nicht bearbeitet.
- Prüfung: `git diff --check` nach dem Hinzufügen auszuführen; keine Anwendungstests erforderlich (keine Implementierung).

## Quellen

- [D-0010](../agent-system/decision-log.md#d-0010--verbindliche-produktentscheidungen-maschinenbau-mvp)
- [CP-0014](../agent-system/checkpoints/CP-0014.md)
- [A02-Spezifikation](maschinenbau-mvp-spezifikation-und-gap-analyse.md)
- [A03-Finanzspezifikation](../accounting/maschinenbau-mvp-finanzspezifikation.md)
- [A04-Datenmodell](../database/maschinenbau-mvp-datenmodell.md)
- [A03-P0-Finanzentscheidungen B–E](../accounting/p0-finanzentscheidungen-v1-optionen.md) (parallele Finanzfach-Entscheidungsgrundlage, CP-0015).
