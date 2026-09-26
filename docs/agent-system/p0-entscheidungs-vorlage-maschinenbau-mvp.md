# Maschinenbau-MVP – zentrale P0-Entscheidungsvorlage

**Für:** Nutzer und A01 · **Stand:** 26.09.2026 · **Bezug:** MG-000 / SLG-000.2 / CP-0014 / CP-0015 / D-0010
**Status:** Optionen und Fachvorschläge zur Auswahl. Keine Option ist beschlossen; keine Implementierungs- oder Architekturfreigabe.

## Verbindliche Leitplanken aus D-0010

V1 startet mit einem bestehenden Betrieb: gemieteter Raum, eine Maschine, drei Beschäftigte und 50.000 € Startbudget. Aufträge werden vollständig abgewickelt. Teilproduktion, Teillieferung, Teilrechnung und Teilzahlung sind ausgeschlossen. Rechnungs-/Buchhaltungsbeträge müssen differenziert sein; ein BAB gehört zu V1 und darf statisch/vereinfacht sein. D-0010 legt weder 50.000 € als verfügbare Liquidität fest, noch Zeitraster, Kosten-/Materialwerte, Startdatum, Abnahme, Rechnungsfähigkeit oder Abschlussbedingung. D-0010 bleibt unverändert. Architektur V0.2/ADRs bleiben `PROPOSED`; das Datenmodell ist ein Vorschlag und QA BESTANDEN ist keine Implementierungsfreigabe.

**Statusbegriffe in der Matrix:** „Nutzerentscheidung“ meint Produktverhalten/-umfang. „Fachentscheidung A02/A03“ meint die noch zu konkretisierende Regel in jeweiliger Fachautorität. „Technisch durch D-0010 festgelegt“ ist auf bestehende Produktleitplanken beschränkt; Datenmodellfelder/Architektur sind dadurch nicht freigegeben.

---

## P0-A – Zeit, Perioden und Ereignisreihenfolge

**Problem:** Welcher Simulationszeitpunkt gilt, wann Spielerbefehle und Fälligkeiten verarbeitet werden und wie dieselben Zeitpunkte reproduzierbar aufgelöst werden? Das muss mit A03s Trennung von Vertragsbedingung, Forderung/Verbindlichkeit, Fälligkeit und tatsächlicher Zahlung zusammenpassen.

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **A1 – Tagesraster, Monatsperioden (A02-Empfehlung)** | Ein expliziter Kalendertag je Vorschub. Vorgeschlagene Reihenfolge: fälliger Wareneingang/Fremdleistung → Tagesproduktion/Verbrauch → vollständige Lieferung → ggf. Abnahme → Rechnungsfähigkeit/Rechnungs-Command → am Tag fällige Zahlungen gemäß gewählter C-Regel → Tages-/Monatsschluss. Spielerbefehle gehen der Tagesauflösung voraus. Monatsgrenze ordnet periodische Kosten/BAB nach A03 zu. | Rechnungsstellung kann eine Forderung auslösen; Zahlung erhöht Liquidität erst bei tatsächlichem Zahlungsevent. Fälligkeit allein bewegt kein Geld. A03 muss Zahlungszeitpunkt/-modus und periodische Ansätze festlegen. | Simulationsdatum, Eventzeit/Sequenz, Periode, effektives Datum und Regelversion. A04-Modell schlägt Uhr/Event vor; A11 müsste Orchestrierung/Replay klären. | Präzise Liefer-/Fälligkeitstage und klare Nachvollziehbarkeit; mehr Vorschübe. Monatsauswertung verständlich, aber Monatsletzten-Regel nötig. |
| **A2 – Wochenraster mit Monatsabschluss** | Vorschub um 7 Tage; Ereignisse im Fenster bleiben entweder auf konkretem Datum oder werden auf den Schrittstichtag gelegt. Genauigkeit dieser Variante muss gewählt werden. | A03 muss bestätigen, ob Zahlungs-/Kostenwirkungen am Originaltag oder gebündelt auftreten; Fälligkeit und tatsächliche Zahlung bleiben verschieden. | Zeitraum und konkretes Wirksamkeitsdatum getrennt speichern; tie order weiterhin erforderlich. | Weniger Aktionen, aber weniger Kontrolle innerhalb der Woche. Originaldatum erhöht Präzision und Modellbedarf; Bündelung kann Reihenfolge/Fälligkeit verwischen. |
| **A3 – Ereignisgesteuerte Uhr** | Uhr springt zum frühesten Liefer-, Produktionsend-, Fälligkeits- oder Periodenereignis; Spieler kann dort eingreifen. | Genaue effektive Daten möglich; A03 legt weiter Trigger und tatsächliche Zahlung fest. Gleichzeitige Ereignisse bleiben geordnet aufzulösen. | Persistierter Ereignisplan/Queue, Sequenz und Replay-Regeln; A04/A11 prüfen technische Folgen. | Überspringt Leerlauf und erlaubt Reaktion am Ereignis. Mehr Komplexität und weniger leicht erklärbarer Zeitsprung. |

**Gleichzeitige Ereignisse (für jede Option):** Abhängigkeiten zuerst (z. B. akzeptierter Eingang vor Materialverbrauch); danach stabile, gespeicherte Priorität statt Zufall/Datenbank-Reihenfolge. In A02s A1-Vorschlag können voneinander unabhängige Ereignisse über Spielerpriorität, dann Auftrags-/Event-ID gebrochen werden. Noch zu entscheiden: Kann eine in einer späteren Phase erfüllte Voraussetzung noch am selben Tag weiterverarbeitet werden? Können Fertigstellung, Lieferung, Rechnungsauslösung und eine „sofort fällige“ Zahlung alle am selben Tag stattfinden? Dies ist nicht in D-0010 entschieden.

**Fachvorschlag A02:** A1; Simulationszeit statt Systemwandzeit; Monatsperioden nur für periodische Ansätze/Reports. **Technische Folge:** Zeitstempel/Sequenz/Regelversion und deterministische Reihenfolge; keine Architekturfreigabe. **Folgeentscheidungen:** Zeitschritt/Kalender und Wochenendverhalten, Vorschubform, Tagesphasen, Same-day-Regeln, Zahlungszielbezug und automatische/manuelle Zahlung, Monatskosten-/BAB-Zeitpunkt. **Erforderlich:** Ja, für Zeitvorschub, Fristen, Produktion, Zahlungsauflösung und periodische V1-Logik.

**Entscheidungsfrage A:** Welche Uhr wählen Sie (A1 Tagesraster, A2 Wochenraster, A3 Ereignissprünge)? Wann darf der Spieler Zeit vorschieben? Sollen abhängige Ereignisse am selben Tag noch in späteren Phasen weiterlaufen? Werden Zahlungen am Fälligkeitstag automatisch ausgeführt oder erst durch Spieleraktion? Eine Fälligkeit ist dabei keine Zahlung; Liquidität ändert sich erst beim tatsächlichen Zahlungsevent.

**Kennzeichnung:** Nutzerentscheidung erforderlich: ja. Fachregel: A02; Zahlungs-/Kostenwirkung: A03; Orchestrierung: A11; Datenabbildung: A04. D-0010 legt hierzu nichts fest.

---

## P0-B – Betrags- und Steuersemantik

**Problem:** D-0010 verlangt differenzierte Rechnungsbeträge, ohne Steuerbehandlung festzulegen. Welche Betragsbestandteile sieht und verarbeitet V1?

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **B1 – Ein V1-Betrag, keine Steuerberechnung (A03-Empfehlung)** | Gleiche vereinbarte Geldbasis über Angebot, Vertrag, Beschaffung, Kosten, Erlös und Zahlung; A02 übergibt Steuerstatus „nicht modelliert“. | Keine Steuersimulation; Ergebnis nutzt Beträge derselben Basis. Zahlung entspricht Rechnungs-Gesamtbetrag. Betrag nicht als netto/brutto oder „0 % USt.“ bezeichnen. | Differenzierte Summenfelder bleiben; „nicht modelliert“ muss von tatsächlich 0 berechneter Steuer unterscheidbar sein. | Verständlich und schlank; es wird keine reale Steuerwirkung abgebildet und der Betrag ist nicht als netto/brutto interpretierbar. |
| **B2 – Vereinfachte explizite Steuersimulation** | Nutzer bestimmt den Simulationssatz; Satzversion, Berechnungs- und Rundungszeitpunkt mitgeben. | Basis, simulierte Steuer und Gesamt getrennt; Steuerkomponente beeinflusst nach A03-Vorschlag nicht Auftragsergebnis. Keine Aussage über reale Steuerpflicht/-sätze. | Betragstyp, Steuerstatus/-kennung, Linienbeträge und Version; vorgeschlagenes Datenmodell enthält differenzierte Felder. | Betragszerlegung sichtbar, aber mehr Erklärungs-/Testaufwand und Risiko einer Verwechslung mit Rechtsregeln. |

**Fachvorschlag A03:** B1. **Folgeentscheidungen:** bei B2 Simulationssatz, Rundung und Beschreibung; bei beiden konsistente Positionssumme/Gesamtbetrag/Zahlung und Betragsbezeichnungen. **Erforderlich:** Ja, vor Angebot/Rechnung/Accounting-Übergabe. **Kennzeichnung:** Nutzerentscheidung erforderlich: B1 oder B2; A03 konkretisiert Accounting, A02 liefert Beträge/Ereignisse, A04 modelliert Semantik. D-0010 legt nur Differenzierung, nicht die Steuerregel fest.

**Entscheidungsfrage B:** Soll V1 B1 verwenden (Betrag ohne Netto-/Bruttoetikett, Steuer „nicht modelliert“) oder B2 mit einer ausdrücklich simulierten Steuerkomponente? Falls B2: Welchen Satz, welche Rundung und welche Kennzeichnung bestätigen Sie?

---

## P0-C – Zahlungsbedingungen, Forderungs-/Verbindlichkeitstrigger

**Problem:** Vertragliche Bedingungen bestimmen Trigger, aber Forderung/Verbindlichkeit, Rechnungsstellung, Fälligkeit und Geldbewegung sind getrennte Vorgänge. V1 darf keine Teilzahlung enthalten.

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **C1 – Ein voller Zahlungstermin nach Rechnung/Eingang (A03-Empfehlung)** | Kundenrechnung ist Referenz für Kundenziel; akzeptierter Eingang/Leistung für Lieferantentrigger. Zahlung zum vereinbarten Datum, automatisch oder manuell – Modus noch zu wählen. Volle Zahlung je Verpflichtung. | Kundenforderung bei freigegebener vollständiger Rechnung nach abrechenbarer Leistung. Verbindlichkeit vertraglich; A03 schlägt akzeptierten Wareneingang/Fremdleistung als Ansatz vor, spätere Lieferantenrechnung belegt/konkretisiert. Fälligkeit allein ändert Liquidität nicht. | Ein aktiver PaymentTerm je Vertragsrichtung genügt als V1-Regel; getrennte Referenzen für Vertrag, Trigger, Rechnung, OP und tatsächliche Zahlung. | Kleiner klarer Ablauf mit offenen Posten; keine Vorschüsse/mehreren Terminen in V1. |
| **C2 – Ein voller Zahlungstermin an vertraglich gewähltem Trigger** | Je Kunden-/Lieferantenvertrag „bei Rechnung“ oder „nach Zahlungsziel“ als voller Einzeltermin; V1 sperrt Zahlung vor Rechnung, damit Anzahlungswirkung nicht implizit wird. | Forderung/Verbindlichkeit bleiben getrennt von Zahlung. Trigger/Fälligkeit aus Vertrag; tatsächliche Zahlung weiterhin eigener Zeitpunkt. | Ein Term mit Trigger/Fälligkeitsbezug; A04-Modell trägt diese Felder. | Mehr Vertragswahl bei begrenztem Umfang; mehr Reihenfolge-/Testfälle und klare Definition des Bezugsdatums erforderlich. |
| **C3 – Volle Vorauszahlung bei Auftrag/Bestellung** | Einmaliger voller Betrag beim Starttrigger vor Leistung/Lieferung; keine Teilanzahlung und kein zweiter Resttermin. | Zahlung vor Rechnung/Leistung darf nicht als Erlös behandelt werden; A03 muss Finanzklassifikation und spätere Verrechnung definieren. Geldwirkung erst bei tatsächlicher Zahlung. | Term/Zahlung können vor Invoice/OP referenziert werden; weitere Klassifikationsregel nötig. | Vorauszahlung wird spielbar; mehr Finanzzustände und Verrechnungslogik, daher mehr Aufwand. |

**Fachvorschlag A03:** C1, ein voller Termin, keine Teilzahlung. A03 unterscheidet Zahlungstag von Fälligkeit und schlägt Verbindlichkeit bei akzeptiertem Eingang/Leistung vor. A02 bestimmt Ereignisdatum und Ablauf; Zahlungen werden nur durch tatsächliches Ereignis als Liquidität erfasst. **Folgeentscheidungen:** C1/C2/C3, Kundenziel, Lieferantenziel und deren Bezugsdatum, Zahlung automatisch/manuell, Behandlung fehlender Liquidität. Bei C3 zusätzlich Anzahlungsklassifikation und Verrechnung. **Erforderlich:** Ja, für offene Posten, Zahlungen und Liquidität.

**Entscheidungsfrage C:** Welche Zahlungsoption wählen Sie: C1, C2 oder C3? Welches Kundenziel und Lieferantenziel sowie welcher Startzeitpunkt gelten? Werden volle Zahlungen am Fälligkeitstag automatisch ausgelöst oder manuell vom Spieler? Was soll bei nicht ausreichender Liquidität passieren? (Kein Vorschlag hier ist eine Teilzahlung.)

**Kennzeichnung:** Nutzerentscheidung erforderlich: ja. Forderungs-/Verbindlichkeits- und Liquiditätsregeln: A03; zeitlicher Trigger: A02; Datenfelder/Zuordnung: A04. D-0010 verlangt vertragliche Konditionen und lässt V1-Begrenzung zu, legt diese Werte aber nicht fest.

---

## P0-D – Kostenmethode und BAB

**Problem:** Ein BAB gehört zu V1, doch Kostenblöcke, Bezugsbasen und Raten sind offen. Direkte Auftragskosten und verteilte Gemeinkosten dürfen nicht doppelt zählen.

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **D1 – Direkte Istkosten plus kleiner statischer BAB-Zuschlag (A03-Empfehlung)** | A02 liefert Materialverbrauch, Arbeits- und Maschinenstunden sowie Ereigniszeitpunkte. | Material/Fremdleistung direkt; Arbeit/Maschine über bestätigte Sätze; BAB verteilt wenige Gemeinkostenblöcke auf vorab gewählte Basis. Gemeinkosten separat und ohne Doppelzählung. | Versionierte BAB-Eingabe/-Zeilen, direkte CostEntry und getrenntes OrderResult sind im Vorschlag enthalten. | Zeigt direkte Kosten und einfache Gemeinkosten; Raten sind Näherungen und müssen bestätigt werden. |
| **D2 – Direkte Kosten plus Pauschale je Auftrag** | Benötigt keine zusätzliche Kostenstellen-/Ressourcenmessung für die Pauschale. | Direkte Kosten bleiben; Pauschale oder Prozentsatz separat als vereinfachte BAB-Zurechnung. | Feste Pauschale/Rate; keine dynamischen Treiber. | Einfach zu erklären; bildet Auftragsgrößen bzw. Kostenstellen nur grob ab. |
| **D3 – Statischer BAB mit mehreren Kostenstellen und Bezugsgrößen** | Muss die gewählten Basen (z. B. Materialwert, Arbeits-/Maschinenstunden) zuverlässig liefern. | Verteilungsmatrix, Kostenblöcke und Raten; keine dynamische Vollkostenrechnung. | BAB-Zeilen mit Stelle, Kostenart, Basis, Rate, Ziel und Version. | Größerer Lern-/Steuerungswert; mehr Werte, Daten und Erklärungen, vereinfachte Verteilung kann realitätsnah wirken, ohne es zu sein. |

**Fachvorschlag A03:** D1 mit wenigen statischen Kostenblöcken. Kein Satz/Wert wird erfunden. Miete kann allgemeine Kosten bleiben; Verteilung braucht eigene bestätigte Basis. **Folgeentscheidungen:** direkte Kostenkategorien, Sätze, Gemeinkostenblöcke/-basen/-raten, Miete allgemein oder verteilt, BAB-Gültigkeitsperiode und fehlende Messwerte. **Erforderlich:** Ja, vor Kosten-/Auftragsergebnis-/BAB-Anzeige. **Kennzeichnung:** Nutzerentscheidung für Variante und Werte; A03 entscheidet Kosten-/BAB-Bedeutung, A02 Ressourcenmengen/-zeiten, A04 Datenform. D-0010 legt BAB-Pflicht und Vereinfachungsmöglichkeit fest, nicht Methode/Werte.

**Entscheidungsfrage D:** Wählen Sie D1, D2 oder D3. Welche Kostenblöcke, Sätze und Verteilungsbasen sollen für V1 gelten, und wird Miete einem Auftrag zugeordnet oder als allgemeine Unternehmenskosten gezeigt?

---

## P0-E – Materialbewertung und Eröffnungsbestand

**Problem:** A02 liefert Anfangs-/Zugangs-/Verbrauchsmengen; A03 bewertet sie. Ohne bestätigte Anfangsmenge und Wertbasis ist kein reproduzierbarer monetärer Lagerwert oder Materialkostenanteil möglich.

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **E1 – Fester V1-Standardpreis je Material (A03-Empfehlung bei vorhandenen Startwerten)** | Ereignisse liefern Mengen; Zugang ändert Bestand, nicht den Standardwert. | Materialverbrauch = Menge × bestätigter Standardsatz; Abweichungen gesondert zeigen oder im Umfang nicht modellieren. | Preis-/Bewertungsregel versionieren und in Bewegungen referenzieren. | Einfach und reproduzierbar; reale Einkaufspreisschwankungen werden nicht oder nur als Abweichung gezeigt. |
| **E2 – Zugangspreis je Zugang, FIFO-Verbrauch** | A02 liefert geordnete Zugänge und Verbrauchsmenge; A03 ordnet Verbrauch ältesten Bestandsschichten zu. | Tatsächliche Zugangspreise bleiben sichtbar; Verbrauch wird aus Schichten bewertet. | Bewegungen/Preis und Schichtreferenz; Reihenfolge und Korrektur nachvollziehbar. | Anschauliche Preisverfolgung; mehr Zustände und Korrekturaufwand. |
| **E3 – Gleitender Durchschnitt** | Geordnete Eingang-/Verbrauchsereignisse nötig. | Nach jedem Eingang Durchschnitt neu berechnen; Verbrauch zu diesem Durchschnitt bewerten. | Historie oder versionierter Durchschnitt, Rundungs-/Korrekturregeln. | Glättet Preisschwankungen; zeitabhängig komplexer als E1. |

**A03-Empfehlung:** E1, sofern der Nutzer Standardwerte für alle Startmaterialien bereitstellt; sonst E2 als Alternative. A02 legt Mengen/Bestand/Verbrauchszeit fest, A03 die Werte. **Folgeentscheidungen:** Bewertungsmethode, Startmengen/Einheiten/-werte und Preise, Behandlung von Bezugskosten/Preisabweichungen, Rundung/Währung, Stichtag. **Erforderlich:** Ja, für monetäre Materialkosten/-bestände; einzelne Werte müssen vor Start gesetzt sein.

**Startbudget 50.000 € – separate Einordnungsoptionen aus A03:**

| Option | Simulation | Accounting/Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|
| **E-Start1 – verfügbare Eröffnungsliquidität (A03-Empfehlung nur nach Bestätigung)** | Startet mit 50.000 € Zahlungsmittel am festgelegten Stichtag. | Liquidität als Eröffnungswert; Herkunft/Gegenposten nur nach Nutzerangabe. A03: weder Erlös noch Gewinn. | Einfacher Cash-Start; darf nicht ohne Bestätigung aus „Budget“ abgeleitet werden. |
| **E-Start2 – Gesamtbudget/Finanzierungsrahmen** | Spielbudget ist Obergrenze; verfügbare Liquidität folgt erst aus bestätigten Startauszahlungen/Reservierungen. | Budget getrennt von tatsächlichen Zahlungsmitteln; Startverwendungen sind explizit zu erfassen. | Versteht „Budget“ als Planrahmen; Cash und Budget sind erklärungsbedürftig verschieden. |
| **E-Start3 – Nutzerdefinierte Aufteilung** | Startwerte werden in Zahlungsmittel und bereits eingesetzte Mittel/Finanzierung aufgeteilt. | Eröffnungswerte und Herkunft jeder Komponente durch A03 abbilden. | Reichhaltiger Startzustand; verlangt mehr Daten, die D-0010 nicht nennt. |

**Entscheidungsfrage E:** Wählen Sie E1/E2/E3 für Materialbewertung und geben Sie Stichtag, Materialmengen/-werte und Einheit an. Bedeutet das 50.000-€-Startbudget E-Start1, E-Start2 oder E-Start3? Bei E-Start3: wie wird es aufgeteilt? Diese Auswahl bestimmt nicht automatisch Startaufträge, Forderungen oder Verbindlichkeiten.

**Kennzeichnung:** Nutzerentscheidung erforderlich: Methoden/Werte/Budgetklassifikation. Fachentscheidungen: A02 Mengen, Ressourcen-/Startzustand; A03 Materialwert und Eröffnungsfinanzierung; A04 persistente Felder. D-0010 technisch/fachlich bereits festgelegt: gemieteter Raum, eine Maschine, drei Beschäftigte, Betrag „50.000 € Startbudget“; nicht festgelegt: Liquidität, Vermögenswert der Maschine, Finanzierung, Startmaterial, Stichtag oder offene Salden.

---

## P0-F – Lieferung, Abnahme und Rechnungsfähigkeit

**Problem:** Eine vollständig gelieferte Leistung muss von (optionaler) Kundenabnahme und vom späteren Rechnungsvorgang unterscheidbar sein. Rechnungsfähigkeit bedeutet nur, dass eine Rechnung ausgelöst werden darf; sie ist selbst keine Rechnung, Forderung oder Zahlung.

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **F1 – Vollständige bestätigte Lieferung genügt (A02-Empfehlung)** | Lieferung der gesamten Auftragsmenge setzt `INVOICEABLE`; keine separate Abnahme als Gate. Abnahmebeleg optional. Rechnung kann danach ausgelöst werden. | A03 erhält Liefer-/Leistungsdatum; freigegebene Rechnung kann nach A03-Regel Forderung/Erlös begründen. Lieferung bewirkt nicht automatisch Geld. | Delivery mit Gesamtmenge/-zeit; Acceptance optional. Keine Teilvorgänge. | Wenige klare Schritte; Kundenqualitätsprüfung verzögert V1-Rechnung nicht. |
| **F2 – Explizite vollständige Kundenabnahme als Gate** | Nach Voll-Lieferung Status „wartet auf Abnahme“; nur bestätigte Gesamt-Abnahme setzt `INVOICEABLE`. Ablehnung braucht begrenzte Korrektur-/Reklamationsregel. | A03 nutzt Abnahmedatum als Leistungs-/Trigger-Input; Forderung entsteht weiterhin nach eigener A03-Regel bei Rechnung. | Acceptance obligatorisch mit Datum, Ergebnis und Nachweis. | Kundenfreigabe wird sichtbar; zusätzlicher Klick und Blockade bei Ablehnung. |
| **F3 – Abnahmefrist, danach automatische Annahme** | Vollständige Lieferung startet Prüfzeit; fristgerechte Ablehnung blockiert, sonst Fristablauf setzt `INVOICEABLE`. Fristdauer offen. | A03 braucht Liefer-, Frist- und wirksames Abnahmedatum; Rechnungs- und Zahlungsauslösung bleiben getrennt. | Deadline/Status/Regelversion für Acceptance. | Prüffenster mit begrenztem Warten; mehr Fristen, Kalender- und Ablehnungsregeln. |

**Fachvorschlag A02:** F1. **Folgeentscheidungen:** ob Abnahme ein V1-Spielziel ist; bei F2/F3 Ablehnungs-, Reklamations- bzw. Fristablaufregeln; wer Rechnung auslöst/ob sofort oder per Spieleraktion (letzteres zusätzlich mit A03). **Erforderlich:** ja, vor Liefer-/Abnahme-/Rechnungsfähigkeitsübergang. **Kennzeichnung:** Nutzerentscheidung F1/F2/F3; A02 operativer Liefer-/Abnahmetatbestand; A03 finanzieller Trigger; A04 Abbildung. D-0010 legt keine Abnahme fest.

**Entscheidungsfrage F:** Reicht die bestätigte vollständige Lieferung (F1), ist eine explizite vollständige Abnahme (F2) nötig, oder soll F3 mit Prüffrist gelten? Soll nach Rechnungsfähigkeit ein Spieler die Rechnung auslösen oder soll sie automatisch erstellt werden? Die zweite Frage berührt A03s Rechnungsregeln.

---

## P0-G – Operativer Auftragsabschluss

**Problem:** Operatives Erledigen des Auftrags ist nicht dasselbe wie Rechnungsstellung, Ausgleich offener Posten oder Zahlung. A04-Modell hält Operations-, Rechnungs-, OP- und Zahlungsstatus getrennt; A03-Ergebnis kann vorläufig/final sein.

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **G1 – Vollständig produziert und geliefert (A02-Empfehlung)** | `CLOSED`, sobald vollständige Gesamtmenge produziert und geliefert ist; falls F2/F3 gewählt, zusätzlich vollständige Abnahme. Rechnungsfähigkeit/Rechnung separat. | Offene Rechnung/Forderung/Verbindlichkeit/Zahlung kann bestehen bleiben; A03-Finanzstatus nicht automatisch final. | Statusdimensionen getrennt; A03-Ergebnis kann vorläufig bleiben. | Operativ fertig ohne Warten auf Rechnung/Zahlung; offener finanzieller Nachlauf bleibt sichtbar. |
| **G2 – Lieferung plus vollständige Rechnung** | Abschluss zusätzlich davon abhängig, dass der ganze Auftrag vollständig fakturiert ist; Zahlung separat. | Invoice-Status/Freigabe muss an A02 zurückgemeldet werden; finanzielle Zahlung weiterhin offen möglich. | Auftrag braucht Rechnungsreferenz/-status als Abschlusskriterium. | Abschlussliste bedeutet „geliefert und abgerechnet“; Rechnungsadministration kann operative Schließung blockieren. |
| **G3 – Erst nach vollständiger Zahlung** | Abschluss erst nach vollständiger Leistung/Lieferung/Rechnung **und** vollständigem Ausgleich aller dem Auftrag zugeordneten Kunden-/Lieferantenpositionen. Jede Verpflichtung wird voll bezahlt; keine Teilzahlung. | Abschluss hängt unmittelbar von A03-OP-/Zahlungsstatus ab. Zahlung ändert Liquidität/OP, nicht erneut Ergebnis. | Status-Rückmeldung über OPs/Zahlungen und Zuordnungsregel nötig. | „Voll erledigt“ im engen Sinn; Auftrag bleibt durch Zahlungsfristen/Kundenverzug lange offen und koppelt Operations an Finance. |

**Fachvorschlag A02:** G1 mit getrenntem Finanzstatus bei A03. **Folgeentscheidungen:** ob Rechnung oder Zahlung operative Bedingung wird; bei G3, welche Lieferantenpositionen auftragsbezogen abschließen müssen. **Erforderlich:** ja, vor Auftragsstatus und Ergebnisfinalisierung. **Kennzeichnung:** Nutzer wählt G1/G2/G3; A02 bestimmt operative Leistungsvollständigkeit, A03 finanzielle Vollständigkeit, A04 führt getrennte Statusdimensionen. D-0010 legt das Abschlusskriterium nicht fest.

**Entscheidungsfrage G:** Soll der operative Auftrag nach vollständiger Leistung/Lieferung (G1), zusätzlich nach Rechnungsstellung (G2) oder erst nach vollständigem Zahlungsausgleich (G3) geschlossen werden? Wenn F2/F3 gilt: muss vollständige Abnahme dazugehören? Sollen Lieferantenverbindlichkeiten bei G3 ebenfalls den Auftragsabschluss blockieren?

---

## P0-I – Startunternehmen und Startparameter

**Problem:** D-0010 gibt einen Betriebsrahmen, aber keinen vollständigen Startzustand. Ohne Stichtag, Kapazitäten, Material, Parteien, offene Vorgänge, Kosten-/Finanzwerte und Regelversion ist ein Start nicht vollständig reproduzierbar.

### Profiloptionen (A02)

| Option | Simulation | Accounting | Datenmodell | Spielerlebnis; Vor-/Nachteile |
|---|---|---|---|---|
| **I1 – Fester kanonischer Start (A02-Empfehlung)** | Gleicher expliziter Startzustand ohne zufallsgenerierte Anfangsdaten. | Opening balances/Offenposten sind A03-bestätigt; Werte nicht aus dem Budget ableiten. | Vollständiger Opening Snapshot plus Profil-/Regelversion. | Vergleichbar, verständlich und replaybar; weniger Variation zwischen neuen Läufen. |
| **I2 – Seed-generierter Startzustand** | Sekundäre Parameter werden aus Seed/Regeln erzeugt; D-0010-Grundfakten bleiben gleich. | Generierte Anfangsbeträge/Offenposten müssen gültige A03-Regeln erfüllen. | Seed, PRNG-/Regelversion und Regeln; Snapshot speichern, falls alter Generator nicht mehr ausführbar ist. | Mehr Variation, aber weniger Vergleichbarkeit und mehr QA-/Erklärbedarf. |
| **I3 – Fester Start, seeded Zufall im Verlauf** | Start ist gleich; spätere Nachfrage/Lieferverzug/Marktereignisse können zufällig sein. | Zufall darf keine ungeklärten Finanzfakten erzeugen; A03-Übergaben gültig halten. | Seed + PRNG-Version + Event-/Commandfolge. | Vertrauter Start, variabler Verlauf; umfangreichste Regel-/Replay-Komplexität. |

**D-0010-fest:** Bestandsunternehmen; gemieteter Raum; eine Maschine; drei Beschäftigte; 50.000 € Startbudget; keine Gründung. **Nicht festgelegt:** Stichtag, verfügbare Maschinenstunden/Typ/Zustand, Skills/Arbeitskapazität, Materialstamm/Bestandsmengen/-werte, Kunden/Lieferanten und Konditionen, offene Angebote/Aufträge/Bestellungen/Receipts/Deliveries, Forderungen/Verbindlichkeiten, Miete, Kosten-/BAB-Sätze, Startliquidität und Budgetklassifikation.

**Reproduzierbarkeit:** A02 empfiehlt I1 und deterministischen Start/Verlauf, bis Zufall ausdrücklich Teil von V1 wird. Ohne Zufall braucht Simulation keinen fachlich wirksamen PRNG-Seed, aber denselben Opening Snapshot, Startdatum, Profil-/A02-/A03-Regelversionen, Modulversion und geordnete Spielerbefehle. Mit Zufall sind zusätzlich Seed **und** RNG-Algorithmus/-Version, Generierungsregeln und Ereignisfolge nötig; ein Seed allein garantiert keine Wiederholbarkeit. D-0009 ist `PROPOSED`, keine Freigabe. A04 schlägt Seedreferenz/Simulationsuhr vor, ohne damit eine Speicherung freizugeben.

**Fachvorschlag A02:** I1; A03s Vorschläge zur Budgetklassifikation (E-Start1/2/3) bleiben eigene Nutzerwahl. **Folgeentscheidungen:** Profiloption; Datum; alle betriebliche Startwerte durch A02, finanzielle Werte/Klassifikation durch A03, Speicherform durch A04; ob V1 Zufall nutzt. **Erforderlich:** ja für konkreten Spielstart. **Kennzeichnung:** Nutzer bestätigt Profil-/Produktverhalten und fehlende Werte; A02/A03 konkretisieren in jeweiliger Fachautorität; A04 technische Darstellung. D-0010 legt nur die genannten Grundfakten fest.

**Entscheidungsfrage I:** Wählen Sie I1, I2 oder I3. Welcher Simulationsstichtag und welche Zusatzwerte gelten? Bedeutet das Startbudget von 50.000 € tatsächlich verfügbare Eröffnungsliquidität (A03 E-Start1), einen Budgetrahmen (E-Start2) oder eine von Ihnen aufzuteilende Finanzierung (E-Start3)? Soll V1 Zufall enthalten; wenn ja, in welcher Form? Die Beträge/Werte der Maschine, Miete, Beschäftigung, Bestände und Anfangspositionen werden nicht aus D-0010 abgeleitet.

---

## Nutzerentscheidungen – direkte Antwortliste

Die folgenden Auswahlfelder können vom Nutzer beantwortet oder angepasst werden. Auswahl einer empfohlenen Option ist nicht vorausgesetzt.

1. **A Zeit:** A1/A2/A3; Kalender/Wochenendverhalten; Vorschub; Same-day-Phasenfortschritt; Zahlungsmodus am Fälligkeitstag; Monatsübergang.
2. **B Beträge:** B1/B2; falls B2 Satz, Rundung und sichtbare Kennzeichnung.
3. **C Zahlungen:** C1/C2/C3; Kunden- und Lieferantenziel samt Bezugsdatum; automatisch oder manuell; fehlende Liquidität; falls Vorauszahlung: Produktbestätigung und Verrechnung.
4. **D BAB/Kosten:** D1/D2/D3; Kostenblöcke, Sätze, Basen, Miete allgemein oder verteilt, Periode/Gültigkeit.
5. **E Material/Eröffnung:** E1/E2/E3; Stichtag, Mengen/Einheiten/Werte, Preisabweichung/Bezugskosten; E-Start1/2/3 zur Bedeutung des 50.000-€-Budgets und gegebenenfalls Aufteilung.
6. **F Abnahme/Rechnung:** F1/F2/F3; bei F2/F3 Ablehnungs-/Fristfolge; Spieler- oder automatische Rechnungserstellung.
7. **G Abschluss:** G1/G2/G3; Abnahmeabhängigkeit; bei G3, ob Lieferantenverbindlichkeiten mitzählen.
8. **I Start/Reproduzierbarkeit:** I1/I2/I3; Simulationsstichtag und Startwerte; ob Zufall in V1 enthalten ist.

## Was nach Nutzerantwort folgt

### A02/A03 müssen fachlich konkretisieren

- **A02:** gewähltes Zeitraster in exakte Phasen-/Same-day-Regeln; Liefer-, Abnahme-, Rechnungsfähigkeits- und operative Abschlussereignisse; Startkapazitäten, Mitarbeiter-/Maschinenverfügbarkeit, Mengen/Arbeitsgänge, Termine, Bestandsbewegungen und Profil-/Regelversion.
- **A03:** gewählte Betragssemantik; Forderungs-/Verbindlichkeitstrigger und Bezugstag; Fälligkeit und Zahlungsauslösung getrennt von tatsächlicher Liquiditätsänderung; Kosten-/BAB-Werte und Verteilung; Materialbewertung und Startfinanzpositionen. A03 validiert die zeitliche Übergabe gegen C.
- **A02+A03 gemeinsam:** bei A/C eine abgestimmte Ereigniskette. Beispiel unter den jeweiligen gewählten Regeln: vollständiger Eingang → ggf. Produktion → vollständige Lieferung → gewählte Abnahme → Rechnungsfähigkeit → vollständige Kundenrechnung/Forderung → vertragliche Fälligkeit → tatsächliche volle Zahlung → Liquiditätsänderung. Lieferantenverbindlichkeit entsteht zum von A03 gewählten vertraglichen Trigger; Lieferantenrechnung kann später Beleg sein. Kein Schritt macht die Fälligkeit mit der Zahlung gleich.
- **A04:** nach Fachregeln Aktualität und Eindeutigkeit des vorgeschlagenen Modells prüfen; dies ist keine Umsetzungserlaubnis.
- **A11:** nur falls System-/Orchestrierungsgrenzen aus der gewählten Ereignisfolge folgen; keine Architekturfreigabe durch diese Vorlage.

### Erst später erforderlich

H bleibt gemäß CP-0014 P1: detaillierte Storno-/Korrekturregeln nach Bestätigung und Periodenabschluss, soweit die entsprechenden Funktionen nicht für V1 zwingend werden. Spätere Erweiterungen: Teilproduktion/-lieferung/-rechnung/-zahlung, weitere Zahlungstermine/Vorschüsse/Nachzahlungen, komplexe Kostenrechnung, dynamische BAB-Treiber, Zufalls-/Marktmechaniken (falls nicht für V1 gewählt), Mahnung/Inkasso, detaillierte Qualitäts-/Reklamationsprozesse. Spätere Optionen werden hier nicht für V1 beschlossen.

## Handoff und Governance

Diese Vorlage stellt keine Gesamtoption als „beste“ Lösung zusammen. Fachvorschläge bleiben Vorschläge; bei widersprüchlichen Auswirkungen (z. B. F2-Abnahme und C1-Rechnungstrigger) sind Nutzerwahl und anschließende A02/A03-Abstimmung maßgeblich. Die Antworten des Nutzers sind Produktentscheidungen; D-0010 ist dadurch nur zu ändern, wenn der Nutzer das ausdrücklich beauftragt. Bis zu separater Implementierungsfreigabe keine Umsetzung.

D-0010 bleibt unverändert; Architektur V0.2 und ADR-001 bis ADR-008 bleiben `PROPOSED`. T-0006/T-0007 bleiben `COMPLETED`, Datenmodell-QA `BESTANDEN`. Kein Code, Schema, Datenbank, Supabase oder Commit/Push wurde verändert.

## Quellen

- [CP-0014 – offene P0/P1-Entscheidungen](checkpoints/CP-0014.md)
- [CP-0015 – A03 P0-Optionen B–E](checkpoints/CP-0015.md)
- [D-0010](decision-log.md#d-0010--verbindliche-produktentscheidungen-maschinenbau-mvp)
- [A02 Optionen A/F/G/I](../simulation/p0-optionen-simulationssicht.md)
- [A03 Optionen B/C/D/E](../accounting/p0-finanzentscheidungen-v1-optionen.md)
- [Datenmodell T-0006](../database/maschinenbau-mvp-datenmodell.md)
- [Aktuelle A02-Spezifikation](../simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md)
- [Aktuelle A03-Finanzspezifikation](../accounting/maschinenbau-mvp-finanzspezifikation.md)
