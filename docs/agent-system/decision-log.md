# Decision Log – WFWSimulation

## D-0001 – Agent Control Plane

Status: PROPOSED

Die Agentenstruktur, Goals, Tickets, Worklogs und Checkpoints werden zentral im Repository dokumentiert.

Jeder Agent einschließlich A01 muss den Preflight durchführen.

---

## D-0002 – Checkpoint-Regel

Status: PROPOSED

Nach maximal drei eigenständigen Agentenarbeiten ist ein dauerhafter Checkpoint verpflichtend.

Bei kritischen Ereignissen erfolgt der Checkpoint sofort.

---

## D-0003 – OpenTycoonOS

Status: PROPOSED

OpenTycoonOS wird zunächst nur als Referenz betrachtet.

Keine Kernabhängigkeit.

---

## D-0004 – Accounting

Status: PROPOSED

Accounting ist die fachliche Autorität für Journal, Ledger und finanzielle Auswertungen.

---

## D-0005 – AI State Mutation

Status: PROPOSED

AI darf lesen, analysieren und Commands vorschlagen.

AI darf kritischen autoritativen State nicht direkt verändern.

---

## D-0006 – Simulation / Accounting

Status: PROPOSED

Simulation und Accounting werden als getrennte fachliche Verantwortungsbereiche behandelt.

---

## D-0007 – Industry Modules

Status: PROPOSED

Branchenlogik wird vom allgemeinen Business-Simulationskern getrennt.

---

## D-0008 – Learning / Exam

Status: PROPOSED

Learning und Exam werden als getrennte Domänen geführt.

---

## D-0009 – Determinismus

Status: PROPOSED

Simulationen sollen durch Seed, Commands, Regelversionen und Modulversionen reproduzierbar sein.

---

## D-0010 – Verbindliche Produktentscheidungen Maschinenbau-MVP

Status: APPROVED (Nutzerentscheidung; keine Architekturfreigabe)
Quelle: Nutzerauftrag vom 2026-09-26, nach A11-Konsolidierung
Bezug: MG-000 / SLG-000.2

Für die erste Fassung des operativen Maschinenbau-MVP gilt:

- Auftragsabwicklung erfolgt vollständig. Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind nicht Teil von V1; spätere Erweiterung bleibt vorgesehen.
- Ein Betriebsabrechnungsbogen (BAB) gehört zu V1. Statische Werte und vereinfachte Kostenverteilung sind zulässig. Spätere Versionen können Kosten genauer berechnen und Kosten, Gewinn, Provision sowie weitere unternehmenssteuerungs- und IHK-relevante Größen ergänzen.
- Rechnungen und Buchhaltung stellen Beträge differenziert dar; ein einziger Gesamtbetrag genügt nicht.
- Forderungen und Verbindlichkeiten entstehen gemäß vertraglicher Vereinbarung. Kaufverträge können mehrere Zahlungsoptionen unterstützen. Zahlungsziele, Vorschüsse und Nachzahlungen sind langfristig vorgesehen; V1 darf die für den MVP erforderlichen Vertragsvarianten begrenzen, muss Erweiterbarkeit ermöglichen.
- Das Startunternehmen hat gemieteten Raum, eine Maschine, drei Mitarbeiter und 50.000 Euro Startbudget. Weitere notwendige Startparameter bestimmen A02 und A03 fachlich.
- Das langfristige Ziel umfasst prüfungsrelevante Bereiche für Wirtschaftsfachwirt IHK und später Betriebswirt IHK. IHK-Lernmodule und Prüfungssimulation gehören nicht zum operativen Maschinenbau-MVP, sollen architektonisch später integrierbar bleiben.
- A04 darf das fachliche und technische Datenmodell einschließlich Entitäten, Beziehungen, Status, Feldern, Constraints und Persistenzmodell konkretisieren. Dabei müssen die fachlichen Vorgaben von A02 (Simulation), A03 (Accounting/Finance) und A11 (Architektur/Systemgrenzen) berücksichtigt werden. Offene Produktentscheidungen dürfen nicht stillschweigend verändert werden.

Diese Nutzerentscheidung legt Produktumfang und fachliche Leitplanken fest. Sie genehmigt weder Architektur V0.2 noch ADR-001 bis ADR-008 und entscheidet keine weiterhin offenen Finanz-, Steuer-, Zeit- oder Prozessdetails.
---

## D-0011 – Nutzerbestätigter V1-Arbeitskalender

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerbestätigung „übernehmen“ vom 2026-10-25 zur A01-Entscheidungsvorlage T-0008
Bezug: MG-000 / SLG-000.2 / D-0010 / CP-0032

Für V1 gelten Montag bis Freitag als Arbeitstage. Die nominelle Wochenkapazität von 40 Stunden je Beschäftigtem wird gleichmäßig mit 8 Stunden je Arbeitstag aufgelöst; die CNC-Kapazität von 40 operativen Stunden je Woche wird ebenfalls mit 8 Stunden je Arbeitstag aufgelöst. Samstag und Sonntag sind arbeitsfrei. Gesetzliche Feiertage werden in V1 mangels festgelegten Unternehmensstandorts nicht berücksichtigt. Ein auf ein Wochenende fallender Termin wird auf den nächsten Arbeitstag verschoben. Die F3-Frist umfasst fünf Arbeitstage ab dem Tag nach vollständiger Lieferung; der Liefertag zählt nicht.

Diese Entscheidung bestimmt den V1-Arbeitskalender. Sie legt weder einen Unternehmensstandort noch eine Feiertagsliste fest und entscheidet nicht die noch offenen Anker und Tageszählungsregeln für vertragliche 14-/30-Tage-Zahlungsziele. Sie ändert D-0010 nicht und genehmigt weder Architektur noch Implementierung.
---

## D-0012 – Verbindliches Kommunikationsrouting

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerauftrag vom 2026-10-25
Bezug: MG-000 / SLG-000.1 / T-0001

Alle Agentenantworten und Rückfragen werden an A01 – MASTER_ORCHESTRATOR adressiert. Fachagenten richten Rückfragen nicht direkt an den Nutzer. A01 bündelt notwendige Rückfragen und stellt sie dem Nutzer gesammelt. Aus jeder Antwort, die keine weitere Nutzerklärung erfordert, leitet A01 den nächsten nötigen Auftrag ab und erstellt ihn mit ausdrücklich benanntem Adressaten, Goal-/Ticketbezug, Aufgabe und erwartetem Ergebnis. Ist kein weiterer Arbeitsschritt erforderlich, dokumentiert A01 den Abschluss statt einen künstlichen Auftrag anzulegen. Abhängige Folgeaufträge warten auf erforderliche Nutzerantworten; unabhängige Arbeit darf fortgesetzt werden.

---

## D-0013 – Fristanker für Kundenforderungen

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0011 / CP-0035

Für Kundenforderungen gilt als maßgeblicher Fristanker der spätere Zeitpunkt aus Rechnung und Leistungsereignis. Maßgebliches Leistungsereignis ist die tatsächliche Leistung; besteht die Leistung nur aus Lieferung, gilt das Lieferdatum. Der Nutzer hat ergänzend festgelegt: „Die Abnahme ist Bedingung für das Wirksamwerden, wird jedoch nicht berücksichtigt, sofern kein rechtlicher Anspruch geltend gemacht werden soll. dieser wird also nur bei einem Ereignis bzw. bei einer Lernkarte berücksichtigt.“ Diese Festlegung betrifft ausschließlich Kundenforderungen und entscheidet weder Fristanker noch Zähltage für Lieferantenverbindlichkeiten.

---

## D-0014 – Fristanker für Lieferantenverbindlichkeiten in V1

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0011 / D-0013

Für V1 gilt bei pünktlicher Lieferung das Rechnungsdatum als Fristanker für Lieferantenverbindlichkeiten. Eine spätere Vertragsausgestaltung kann je nach Vereinbarung einen anderen Anker, darunter das Wareneingangsdatum, bestimmen. Für die V1-Ausgangsannahme pünktlicher Lieferungen wird das Rechnungsdatum verwendet. Diese Entscheidung bestimmt weder, ob das Zahlungsziel in Kalender- oder Arbeitstagen gezählt wird, noch ob der Ankertag mitzählt oder ob 14 oder 30 Tage gelten.

---

## D-0015 – Kalenderzählung für Kunden-Zahlungsziele

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0011 / D-0013

Für Kundenforderungen werden die vereinbarten 14-/30-Tage-Zahlungsziele in V1 als Kalendertage gezählt. D-0011s Wochenendverschiebung auf den nächsten Arbeitstag bleibt für einen berechneten Wochenendtermin maßgeblich. Diese Entscheidung betrifft nicht die Zählweise für Lieferantenverbindlichkeiten und legt nicht fest, ob der Ankertag mitzählt oder Tag 1 am Folgetag beginnt.

---

## D-0016 – Kalenderzählung für Lieferanten-Zahlungsziele

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0011 / D-0014 / D-0015

Für Lieferantenverbindlichkeiten werden die vereinbarten 14-/30-Tage-Zahlungsziele in V1 als Kalendertage gezählt. D-0011s Wochenendverschiebung auf den nächsten Arbeitstag gilt für einen berechneten Wochenendtermin. Diese Entscheidung legt nicht fest, ob der Ankertag mitzählt oder Tag 1 am Folgetag beginnt.

---

## D-0017 – Ankertag ist Tag 1 bei Zahlungszielen

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0013 bis D-0016

Für Kundenforderungen und Lieferantenverbindlichkeiten gilt der jeweilige Ankertag als Tag 1 des vereinbarten Zahlungsziels. Die Zahlungsziele werden gemäß D-0015 und D-0016 in Kalendertagen gezählt. Der daraus berechnete Wochenendtermin wird gemäß D-0011 auf den nächsten Arbeitstag verschoben; Feiertage bleiben in V1 unberücksichtigt. Für ein Ziel von N Tagen ergibt sich damit zunächst Ankerdatum + (N−1) Kalendertage, vor einer etwaigen Wochenendverschiebung.

---

## D-0018 – AGB-Zahlungsziel für Kundenforderungen in V1

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0013 / D-0015 / D-0017

Für Kundenforderungen gilt in V1 gemäß AGB ein Zahlungsziel von 14 Kalendertagen. Einzelvereinbarungen mit Kunden sind möglich und können dem Spieler bei kundenspezifischen Sonderwünschen die Möglichkeit höherer Margen eröffnen. Die konkrete abweichende Zahlungsfrist und eine etwaige Margenformel sind damit nicht festgelegt. Fristanker, Ankertagszählung und Wochenendverschiebung richten sich nach D-0013, D-0017 und D-0011.

---

## D-0019 – Zahlungsziel für individuelle Kundenvereinbarungen in V1

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0018 / D-0013 / D-0015 / D-0017

Die konkrete V1-Alternative zum AGB-Standardziel von 14 Kalendertagen ist bei individueller Kundenvereinbarung ein Zahlungsziel von 30 Kalendertagen. Der Ankertag zählt gemäß D-0017 als Tag 1; Fristanker und Wochenendverschiebung richten sich nach D-0013 und D-0011. Eine Margenformel oder automatische Margenerhöhung ist damit nicht festgelegt.

---

## D-0020 – Standardzahlungsziel für Lieferantenverbindlichkeiten in V1

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0014 / D-0016 / D-0017 / D-0011

Für Lieferantenverbindlichkeiten gilt in V1 standardmäßig ein Zahlungsziel von 30 Kalendertagen. Abweichungen sind in Ereignissen oder Dauerverträgen möglich. Bei der V1-Ausgangsannahme pünktlicher Lieferungen gilt gemäß D-0014 das Rechnungsdatum als Fristanker. Der Ankertag zählt gemäß D-0017 als Tag 1; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Konkrete abweichende Konditionen sind nicht festgelegt.

---

## D-0021 – Spielerwahl bei fälligen eigenen Verbindlichkeiten und Dispositionskredit

Status: APPROVED (Nutzerentscheidung; Zinssatzreferenz teilweise offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0020

Wenn eigene Rechnungen zur Zahlung anstehen, soll der Spieler auswählen, welche Rechnungen zuerst bezahlt werden. Als weitere Option wird die Nutzung eines Dispositionskredits angeboten. Der Zinssatz des Dispositionskredits liegt 8 Basispunkte über dem durchschnittlichen Zinssatz; Bezugsgröße und Ermittlung dieses Durchschnittszinssatzes sind noch offen. Regeln für Kredite, Maximalverschuldung und Insolvenz müssen separat geprüft werden. Diese Entscheidung legt weder Kreditrahmen noch automatische Nutzung, Zahlungs-/Tilgungsregeln oder Insolvenzfolgen fest.

---

## D-0022 – Jährliche individuelle Bankverzinsung und Unternehmensaufschlag

Status: APPROVED (Nutzerentscheidung; Dispositionskreditzins durch D-0023 präzisiert)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0021

Zu Spielbeginn und danach einmal jährlich wird mit der Bank ein individueller Zinssatz vereinbart. Dieser basiert auf dem EZB-Zinssatz zuzüglich eines individuellen Aufschlags, der sich nach Eigenkapitalquote, Bilanzsumme und Zahlungsmoral des Unternehmens richtet. Als Mittelwert gilt EZB-Zinssatz + 3 Prozentpunkte; der individuelle Aufschlag liegt je nach Unternehmensbewertung zwischen 0,5 und 5,5 Prozentpunkten über dem EZB-Zinssatz. Welcher konkrete EZB-Referenzsatz und welche Bewertungsformel gelten, sind nicht festgelegt.

---

## D-0023 – Dispositionskreditzins relativ zum individuellen Unternehmenszinssatz

Status: APPROVED (Nutzerklarstellung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0021 / D-0022

Der Zinssatz des Dispositionskredits liegt 8 % über dem individuell vereinbarten Unternehmenszinssatz aus D-0022. Diese Klarstellung präzisiert und ersetzt die zuvor in D-0021 genannte Angabe „8 Basispunkte über dem durchschnittlichen Zinssatz“. Sie legt keinen Kreditrahmen oder weitere Kredit-, Tilgungs-, Maximalverschuldungs- oder Insolvenzregeln fest.

---

## D-0024 – Wöchentlicher Retry bei fehlgeschlagener eigener Zahlung

Status: APPROVED (Nutzerentscheidung; Ende/Anzahl der Wiederholungen offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0021

Nach einem fehlgeschlagenen Zahlversuch für eine eigene Verbindlichkeit erfolgt ein weiterer Zahlungsversuch nach einer Woche. Anzahl, Ende und genauer Bezugspunkt der wiederholten Wochenfrist sind noch offen. Der Versuch bleibt ein Vollzahlungsversuch mit den bestehenden Liquiditätsregeln; es wird keine Teilzahlung oder negative Liquidität abgeleitet.

---

## D-0025 – Niederlage nach acht fehlgeschlagenen Zahlversuchen

Status: APPROVED (Nutzerentscheidung; Zählbeginn offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0024

Nach achtmaligem Scheitern gilt das Spiel als verloren. Ob der erste fehlgeschlagene Fälligkeitsversuch bereits zu diesen acht Versuchen zählt oder acht Wiederholungen nach dem ersten Fehlschlag gemeint sind, ist noch zu klären.

---

## D-0026 – Acht Retry-Fehlschläge nach dem ersten Fehlversuch

Status: APPROVED (Nutzerklarstellung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0024 / D-0025

Die acht Fehlschläge aus D-0025 sind acht Wiederholungsversuche nach dem ersten fehlgeschlagenen Fälligkeitsversuch. Der erste Fehlschlag zählt nicht zu den acht Wiederholungen. Die Wiederholungsversuche liegen gemäß D-0024 jeweils eine Woche auseinander; nach dem achten fehlgeschlagenen Wiederholungsversuch gilt das Spiel als verloren.

---

## D-0027 – Erste Zahlungserinnerung nach zehn Kalendertagen

Status: APPROVED (Nutzerentscheidung; weitere Mahnstufen offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0024 bis D-0026

Die erste Zahlungserinnerung für eine eigene, nicht bezahlte Verbindlichkeit wird zehn Kalendertage nach dem ersten fehlgeschlagenen Zahlversuch ausgelöst. Weitere Mahnfristen, Schwellen und Wirkungen sind nicht festgelegt.

---

## D-0028 – Formelle Mahnung 14 Kalendertage nach Zahlungserinnerung

Status: APPROVED (Nutzerentscheidung; Spielregel, keine behauptete gesetzliche Frist)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0027

Die formelle Mahnung wird 14 Kalendertage nach der ersten Zahlungserinnerung ausgelöst, sofern die eigene Verbindlichkeit bis dahin nicht bezahlt ist. Dies ist eine V1-Spielregel. § 286 BGB schreibt keinen festen 14-Tage-Abstand zwischen Erinnerung und Mahnung vor. Weitere Eskalationsfristen und finanzielle Wirkungen bleiben offen.

---

## D-0029 – Keine Eskalation bis Pfändung oder Liquidation in V1

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0027 / D-0028

Nach der formellen Mahnung gibt es in V1 keine weitere Eskalation bis Pfändung oder Liquidation. Solche Ereignisse sollen erst in einer späteren Version hinzukommen. D-0029 legt keine Gebühren oder sonstigen Rechts-/Finanzfolgen für V1 fest.

---

## D-0030 – Annuitätendarlehen für die Maschine

Status: APPROVED (Nutzerentscheidung; Zahlungsplanparameter offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0010

Das Maschinendarlehen ist ein gleichbleibendes Annuitätendarlehen. Restlaufzeit, Annuitätenhöhe, Zahlungstermine, Tilgungsbeginn und konkrete Zinsberechnung bleiben offen; die ursprüngliche zehnjährige Finanzierung legt diese Parameter nicht fest.

---

## D-0031 – Sieben Jahre Restlaufzeit des Maschinendarlehens

Status: APPROVED (Nutzerentscheidung; Zahlungsrhythmus und Termine offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030

Zum Simulationsstart am 01.01.2027 beträgt die verbleibende Laufzeit des gleichbleibenden Annuitätendarlehens sieben Jahre. Die konkrete Anzahl und Frequenz der Raten sowie erste und letzte Zahlungstermine werden dadurch nicht weiter spezifiziert.

---

## D-0032 – Monatliche Annuitätenzahlung des Maschinendarlehens

Status: APPROVED (Nutzerentscheidung; erster Zahlungstermin offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 / D-0031

Die Annuität des Maschinendarlehens wird monatlich gezahlt. Das Datum der ersten Rate, die monatlichen Zahlungstage und die Annuitätenhöhe sind nicht festgelegt.

---

## D-0033 – Annuitätenfälligkeit am letzten Geschäftstag des Monats

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0032 / D-0011

Die monatliche Annuität des Maschinendarlehens ist jeweils am letzten Geschäftstag des Monats fällig. Für V1 gelten gemäß D-0011 Montag bis Freitag als Arbeitstage; gesetzliche Feiertage werden nicht berücksichtigt. Daraus ergibt sich für den ersten Simulationsmonat Januar 2027 der Freitag, 29.01.2027, als erster Monatsletzter-Arbeitstag. Die Rate und Zinsberechnung bleiben offen.

---

## D-0034 – Zinszeitbasis des Maschinendarlehens nach 30/360

Status: APPROVED (Nutzerentscheidung; 30/360-Variante offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0033

Der nominale Jahreszins des Maschinendarlehens wird nach der 30/360-Methode zeitanteilig berechnet. Die konkrete Monatsend-Variante dieser Methode und die Bezugsbasis innerhalb der Zinsperiode bleiben offen.

---

## D-0035 – Deutsche Zinsmethode 30E/360 für das Maschinendarlehen

Status: APPROVED (Nutzerentscheidung, konkretisiert durch verlinkte Methode)
Quelle: Nutzerantwort und Verweis auf die Deutsche Zinsmethode vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0034

Für die Zinsberechnung des Maschinendarlehens gilt die deutsche Zinsmethode 30E/360. Die Zinsperiode wird mit 30 Tagen je Monat und 360 Tagen je Jahr berechnet; der 31. wird als 30. behandelt. Für Februar gelten die in der verlinkten Methodenbeschreibung genannten Enddatumsregeln. Die Zinsbezugsbasis innerhalb der Periode bleibt offen. Quelle: [Deutsche Zinsmethode 30E/360](https://www.zinsen-berechnen.de/zinsmethoden/deutsche-zinsmethode.php).

---

## D-0036 – Verzinsung der laufenden Restschuld des Maschinendarlehens

Status: APPROVED (Nutzerentscheidung; Rundungsregel offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0035

Verzinst wird das Restschuldsaldo des Maschinendarlehens. Die Rundungsregel für periodische Zinsbeträge bleibt offen.

---

## D-0037 – Kaufmännische Rundung der monatlichen Darlehenszinsen

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0036

Die monatlich berechneten Zinsbeträge des Maschinendarlehens werden kaufmännisch auf Cent gerundet. Die Behandlung eines möglichen Rundungsrests in der Schlussrate bleibt offen.

---

## D-0038 – Rundungsrest in der Schlussrate des Maschinendarlehens

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0037

Ein durch die kaufmännische Cent-Rundung verbleibender Rundungsrest wird in der letzten Darlehensrate bezahlt. Die letzte Rate wird damit um den verbleibenden Restbetrag ausgeglichen. Dies legt keine weiteren Darlehensparameter fest, insbesondere weder Zinssatzbindung noch Behandlung einer nicht zahlbaren Rate.

---

## D-0039 – Fester Darlehenszinssatz während der Restlaufzeit

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0038

Der nominale Darlehenszinssatz von 5 % p.a. gilt während der siebenjährigen Restlaufzeit fest. Die Entscheidung legt keine Zinszahlungstermine und keine Behandlung einer nicht zahlbaren Rate fest.

---

## D-0040 – Darlehenszinsen gemeinsam mit der Monatsrate zahlen

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0039

Die Darlehenszinsen werden zusammen mit der monatlichen Annuitätenrate gezahlt. Die Regel bestimmt keinen abweichenden Zinsstichtag innerhalb der Zinsperiode und keine Behandlung einer nicht zahlbaren Rate.

---

## D-0041 – Zinsstichtag am Tag vor der nächsten Darlehensrate

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0040

Für das maßgebliche Restschuldsaldo der Zinsperiode gilt der Kalendertag unmittelbar vor der nächsten Darlehensrate als Stichtag. Die Zinsen werden gemäß D-0040 zusammen mit dieser Monatsrate gezahlt.

---

## D-0042 – Verzug und Verwertung bei ausbleibenden Maschinenraten

Status: APPROVED (Nutzerentscheidung; Erlösdefizit und Detailauslegung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0041

Für das Maschinendarlehen tritt mit einer bei Fälligkeit nicht gezahlten Rate unmittelbar Verzug ein. Die Bedienung der Rate wird danach wöchentlich erneut versucht. Sind insgesamt drei Raten nicht gezahlt, wird die Maschine gepfändet und zum dann aktuellen Marktwert liquidiert. Der Erlös wird zur Tilgung des Darlehens verwendet; ein verbleibender Überschuss wird dem Geschäftskonto gutgeschrieben. Offen bleibt, was bei einem Erlös unterhalb der offenen Darlehensschuld geschieht. Diese Regel betrifft den Maschinenkredit und ändert nicht die allgemeine V1-Mahnregel für Lieferanten-/Gläubigerverbindlichkeiten D-0029.

---

## D-0043 – Erlösdefizit nach Verwertung des Maschinenpfands

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0042

Wenn der Marktwert der gepfändeten und liquidierten Maschine den offenen Darlehenssaldo nicht deckt, erlischt die verbleibende Restschuld. Die Maschine gilt als von der Bank für diesen Kredit akzeptiertes Pfand. D-0043 schließt das in D-0042 offene Erlösdefizit.

---

## D-0044 – V1-Wirtschaftssystem mit statischen Preisen und Wertentwicklung

Status: APPROVED (Nutzerentscheidung; konkrete Preis- und Nutzungsdauerwerte offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0042 / D-0043

Das Spiel soll ein Hintergrund-Wirtschaftssystem simulieren und relevante Ressourcen sowie Produkte nachverfolgen. Marktpreise für Rohstoffe sollen grundsätzlich auf Preisen einer geeigneten offiziellen oder vergleichbaren Quelle beruhen (beispielsweise finanzen.net). In V1 werden statische Zahlen mit einer linearen jährlichen Preissteigerung von 2 % verwendet; Produkte werden damit je Jahr linear 2 % teurer. Maschinen und andere Güter verlieren anteilig gemäß ihrer festen Nutzungsdauer an Wert. Für den Marktwert einer Maschine bei Verwertung ist ein jährlich um 2 % aktualisierter Neupreis abzüglich des Wertverlusts aus bereits laufender Nutzung maßgeblich. Die genaue Rechenformel, konkrete Basispreise und Nutzungsdauern sind noch offen. Es wird keine Live-Marktdatenintegration beschlossen.

---

## D-0045 – Gesamtnutzungsdauer der vorhandenen CNC-Maschine

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044

Die geplante Gesamtnutzungsdauer der vorhandenen CNC-Fräsmaschine beträgt 16 Jahre. Gemäß A02-Spezifikation ist die Maschine am Simulationsstart acht Jahre alt; daraus ergibt sich rechnerisch eine verbleibende geplante Nutzungsdauer von acht Jahren. Der festgelegte Eröffnungsbuchwert von 40.000 € bleibt davon unberührt; die genaue Marktwert- und Abschreibungsberechnung ist noch offen.

---

## D-0046 – Ursprünglicher Anschaffungswert als CNC-Basispreis

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044 / D-0045

Der in der A02-Spezifikation dokumentierte ursprüngliche Anschaffungswert von 120.000 € gilt als statischer V1-Basispreis der CNC-Fräsmaschine für die jährliche lineare Preissteigerung von 2 %. Die genaue Verrechnung dieser Preisentwicklung mit dem Wertverlust über die Nutzungsdauer bleibt offen.

---

## D-0047 – Formel für den inflationsangepassten CNC-Neupreis

Status: APPROVED (Nutzerentscheidung; Nutzungswertminderung bleibt offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044 bis D-0046

Der jährliche Neupreis der CNC wird mit `120.000 € × 1,02^(aktuelles Jahr − Startjahr)` berechnet. Diese Formel bestimmt den inflationsangepassten Neupreis auf Basis des statischen CNC-Basispreises; sie legt nicht fest, wie der Wertverlust aus der bisherigen Nutzung von acht Jahren und der geplanten Gesamtnutzungsdauer von 16 Jahren davon abzuziehen ist. Der Eröffnungsbuchwert von 40.000 € bleibt davon getrennt.

---

## D-0048 – 50 % Nutzungswertverlust der CNC zum Simulationsstart

Status: APPROVED (Nutzerentscheidung; zukünftiger Verlauf der Wertminderung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044 bis D-0047

Für die vorhandene CNC wird zum Simulationsstart ein Nutzungswertverlust von 50 % angesetzt: Von der geplanten Gesamtnutzungsdauer von 16 Jahren sind acht Jahre bereits genutzt. Damit beträgt der auf die bisherige Nutzung entfallende Anteil 8/16. In Verbindung mit D-0047 ergibt sich zum Start ein Marktwertansatz von 50 % des inflationsangepassten Neupreises. Der Bilanzbuchwert von 40.000 € bleibt getrennt. Eine zeitliche Fortschreibung der Nutzungswertminderung nach Simulationsstart ist mit dieser Festlegung nicht weiter bestimmt.

---

## D-0049 – Verbleibender Nutzungsanteil als Restwertfaktor

Status: APPROVED (Nutzerentscheidung; Bezugswert des Anschaffungswerts offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044 bis D-0048

Der Nutzungsfaktor zur Restwertermittlung lautet `(maximale Nutzungsdauer − genutzte Dauer) / maximale Nutzungsdauer`. Der Faktor ist höchstens 1 und wird mit dem Anschaffungswert multipliziert, um den Restwert zu berechnen. Für die CNC mit 16 Jahren maximaler Nutzungsdauer und acht bereits genutzten Jahren beträgt er zum Simulationsstart 0,5. Welcher Anschaffungswert als Multiplikator gilt (statische Basis von 120.000 € oder gemäß D-0047 jährlich fortgeschriebener Neupreis), ist noch zu klären. Eine Untergrenze bei Überschreiten der maximalen Nutzungsdauer wurde nicht festgelegt.

---

## D-0050 – Restwertberechnung auf Grundlage des Anschaffungspreises

Status: APPROVED (Nutzerentscheidung; Verhältnis zur jährlichen Preisfortschreibung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0047 bis D-0049

Der Restwertfaktor aus D-0049 wird immer auf Grundlage des Anschaffungspreises berechnet. Für die CNC ist der dokumentierte ursprüngliche Anschaffungspreis 120.000 €. Noch offen ist, ob und wie die jährliche Preisfortschreibung aus D-0047 zusätzlich in den Verwertungsmarktwert einfließt. Eine Untergrenze bei Überschreiten der maximalen Nutzungsdauer bleibt ebenfalls ungeklärt.

---

## D-0051 – Keine Preisfortschreibung im Restwert der CNC

Status: APPROVED (Nutzerentscheidung; Untergrenze bei Nutzungsdauerüberschreitung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0047 bis D-0050

Der Restwert wird ausschließlich aus dem ursprünglichen Anschaffungspreis und dem Restwertfaktor berechnet: `120.000 € × ((16 − genutzte Dauer) / 16)` für die vorhandene CNC. Die jährliche Preisfortschreibung des Neupreises gemäß D-0047 fließt nicht in diesen Restwert ein. Bei einer Nutzung über die maximale Nutzungsdauer hinaus wurde keine Untergrenze festgelegt.

---

## D-0052 – Restwertuntergrenze von 0 €

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0049 bis D-0051

Der Restwert der CNC wird bei 0 € begrenzt. Damit wird ein rechnerischer negativer Restwert bei Erreichen oder Überschreiten der maximalen Nutzungsdauer auf 0 € gesetzt.

---

## D-0053 – SimTAX-Bemessungsbasis je Rechnungsposition

Status: APPROVED (Nutzerentscheidung; Rundungsdetails und Anwendungsbereich teilweise offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / SimTAX-V1-Regeln

Als Bemessungsbasis für SimTAX wird je Rechnungsposition der bestätigte Positionswert vor SimTAX verwendet. Der Nutzer hat damit keine separate Bemessungsbasis je Position eingeführt. Steuersatz 19 % und Rundung je Position mit anschließender Summierung bleiben gemäß bisherigen Festlegungen bestehen; Rundungsdetails bei exakt halbem Cent und weiterer Anwendungsbereich bleiben offen.

---

## D-0054 – Kaufmännische Rundung bei halben Centbeträgen für SimTAX

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0053

SimTAX-Beträge werden bei exakt halben Centbeträgen kaufmännisch gerundet. Die Rundung erfolgt gemäß den bestehenden Festlegungen je Rechnungsposition; anschließend werden die gerundeten Positionsbeträge summiert.

---

## D-0055 – SimTAX auf den Positionsgesamtbetrag anwenden

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0053 / D-0054

SimTAX wird je Rechnungsposition auf den Positionsgesamtbetrag angewendet. Der Betrag wird je Position kaufmännisch auf Cent gerundet; anschließend werden die gerundeten Positionsbeträge summiert. Es erfolgt keine getrennte Steuerberechnung und Rundung pro einzelner Einheit.

---

## D-0056 – Geltungsbereich von SimTAX bei externer Rechnungsstellung

Status: APPROVED (Nutzerentscheidung; weitere Belegarten nicht pauschalisiert)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0053 bis D-0055

SimTAX wird bei jeder externen Rechnungsstellung verwendet. Bei Steuerzahlungen und innerbetrieblichen Ausgleichen wird keine Steuer berechnet. Diese Aussage definiert keine pauschale SimTAX-Behandlung für eingehende externe Rechnungen.

---

## D-0057 – Rechnungskorrektur durch referenzierte SimTAX-Umkehr

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0053 bis D-0056

Bei einer Rechnungskorrektur wird der ursprünglich gerundete SimTAX-Betrag referenziert umgekehrt; die Korrektur wird separat ausgewiesen. Die alternative Neuberechnung einer negativen Korrekturposition nach der normalen Positionsregel wird nicht verwendet.

---

## D-0058 – SimTAX-Saldo und Steuerzahlung

Status: APPROVED (Nutzerentscheidung; Abrechnungszeitraum und konkrete Zahlungsmechanik offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0053 bis D-0057

SimTAX wird als getrennte Rechnungskomponente mit eigener Simulationssaldo-Sicht geführt, damit Vorsteuer und Umsatzsteuer gegengerechnet werden können. Die Zahlung des resultierenden Saldos soll sich nach den Grundsätzen des UStG und der AO richten. Konkreter Abrechnungszeitraum, Fälligkeit und Zahlungsablauf sind nicht festgelegt; diese Dokumentation trifft keine eigenständige Aussage zur rechtlichen Ausgestaltung oder Konformität.

---

## D-0059 – Gesetzlicher Abrechnungszeitraum für den SimTAX-Saldo

Status: APPROVED (Nutzerentscheidung; erforderliche Unternehmensparameter und genaue Zahlungsmechanik offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0058

Der Abrechnungszeitraum für den SimTAX-Saldo soll nach dem UStG bestimmt werden. Es wird kein fester Simulationszeitraum durch A01 ausgewählt. Die konkreten Eingangsparameter für die gesetzliche Periodenbestimmung sowie die Zahlungsmechanik gemäß den genannten gesetzlichen Grundsätzen sind noch zu bestimmen; diese Entscheidung allein behauptet keine rechtliche Konformität.

---

## D-0060 – Fiktiver Wochenumsatz im Vorjahr 2026

Status: APPROVED (Nutzer-Szenariowert; steuerlicher Vorjahresbetrag nicht bestimmt)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0059

Für das dem Simulationsstart vorangehende Kalenderjahr 2026 wird fiktiv ein Umsatz von 5.000 € je Woche angenommen. Die Aussage legt weder fest, ob der Umsatz netto oder brutto gemeint ist, noch den für die Periodenbestimmung maßgeblichen Steuerbetrag nach Gegenrechnung der Vorsteuer. Der wöchentliche Umsatz wird deshalb nicht als Steuerwert ausgegeben.

---

## D-0061 – Fiktiver maßgeblicher Umsatzsteuerbetrag 2026

Status: APPROVED (Nutzer-Szenariowert)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0059 / D-0060

Für das Kalenderjahr 2026 wird im Unternehmensstartprofil ein fiktiver maßgeblicher Umsatzsteuerbetrag von 49.400 € angesetzt. Der Wert dient als Vorjahresparameter für die vom Nutzer gewünschte Bestimmung des SimTAX-Abrechnungszeitraums gemäß UStG. Er ist ein vorgegebener Szenariowert; aus dem fiktiven Wochenumsatz D-0060 wird er nicht abgeleitet. Die konkrete Zahlungsmechanik bleibt gemäß D-0058/D-0059 gesondert zu behandeln.

---

## D-0062 – MGK-Zuschlagssatz im V1-BAB

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / A03-P0-Finanzparameter

Im V1-BAB beträgt der Zuschlag für Materialgemeinkosten (MGK) 15 % der Materialeinzelkosten (MEK). Der Satz stammt aus dem früheren A03-Arbeitsvorschlag und wurde vom Nutzer ausdrücklich übernommen. Weitere BAB-Sätze, Kostenstellen, Zuordnungen und konkrete Kostenwerte sind dadurch nicht festgelegt.

---

## D-0063 – FGK-Zuschlagssatz im V1-BAB

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / A03-P0-Finanzparameter

Im V1-BAB beträgt der Zuschlag für Fertigungsgemeinkosten (FGK) 100 % der Fertigungslöhne. Der Satz stammt aus dem früheren A03-Arbeitsvorschlag und wurde vom Nutzer ausdrücklich übernommen. Weitere BAB-Sätze, Kostenstellen, Zuordnungen und konkrete Kostenwerte sind dadurch nicht festgelegt.

---

## D-0064 – Vw/Vt-GK-Zuschlagssatz im V1-BAB

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / A03-P0-Finanzparameter

Im V1-BAB beträgt der Zuschlag für Verwaltungs- und Vertriebsgemeinkosten (Vw/Vt-GK) 10 % der Herstellkosten. Der Satz stammt aus dem früheren A03-Arbeitsvorschlag und wurde vom Nutzer ausdrücklich übernommen. Weitere Kostenstellen, Zuordnungen, konkrete Kostenwerte und laufende Aufwendungen sind dadurch nicht festgelegt.

---

## D-0065 – Monatliche Bruttolohnsumme im V1-Startprofil

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / A02-Startprofil / D-0063

Die monatliche Bruttolohnsumme des Personals im V1-Startprofil beträgt 10.400 €. Dieser Wert ist die Gesamtlohnbasis. Die Zuordnung auf Rollen, Arbeitgebergesamtkosten und der Anteil, der als Fertigungslöhne für die FGK-Bemessung gilt, bleiben gesondert zu klären.

---

## D-0066 – Rollenbasis für Fertigungslöhne im V1-BAB

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0063 / D-0065 / A02-Startprofil

Als Fertigungslöhne für den 100-%-FGK-Zuschlag gemäß D-0063 zählen in V1 die Bruttolöhne von MA-CNC (3.800 € pro Monat) und MA-PROD (3.100 € pro Monat), zusammen 6.900 € pro Monat. MA-AV zählt nicht zu dieser Fertigungslöhne-Basis. Arbeitgebergesamtkosten und ihre Einbeziehung bleiben offen.

---

## D-0067 – Arbeitgebergesamtkosten im V1-Personalaufwand

Status: APPROVED (Nutzerentscheidung; Höhe offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0065 / D-0066

Im V1-Personalaufwand sollen Arbeitgebergesamtkosten zusätzlich zu den bestätigten monatlichen Bruttolöhnen berücksichtigt werden. Betrag und Berechnungsregel sind noch nicht festgelegt und werden nicht von A01 ergänzt.

---

## D-0068 – Arbeitgeberkostenzuschlag auf die Bruttolohnsumme

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0065 bis D-0067

Für das V1-Startprofil werden Arbeitgebergesamtkosten zusätzlich in Höhe von 21 % der monatlichen Bruttolohnsumme angesetzt. Bei 10.400 € Bruttolohnsumme entspricht dies rechnerisch 2.184 € zusätzlichen Arbeitgeberkosten pro Monat und insgesamt 12.584 € Personalaufwand pro Monat einschließlich Bruttolöhnen. Die Entscheidung legt keine gesetzliche oder lohnartenbezogene Aufschlüsselung fest.

---

## D-0069 – Arbeitgeberkosten in der FGK-Bemessungsbasis

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0063 / D-0066 / D-0068

Die Arbeitgeberkosten von 21 % werden für MA-CNC und MA-PROD in die Fertigungslöhne-Basis des FGK-Zuschlags einbezogen. Auf Basis der monatlichen Bruttolöhne von 6.900 € ergibt sich eine FGK-Bemessungsbasis von 8.349 € (6.900 € × 1,21). Bei einem FGK-Satz von 100 % beträgt der daraus resultierende monatliche FGK-Zuschlag ebenfalls 8.349 €. Die Arbeitgeberkosten von MA-AV sind nicht Teil dieser FGK-Basis.

---

## D-0070 – Zuordnung des MA-AV-Personalaufwands zum Vw/Vt-GK-Pool

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0064 bis D-0068

Der Personalaufwand von MA-AV wird dem Vw/Vt-GK-Pool zugeordnet. Bei 3.500 € monatlichem Bruttolohn und 21 % Arbeitgeberkosten entspricht dieser Anteil rechnerisch 4.235 € pro Monat. Er wird als Bestandteil des Vw/Vt-GK-Pools geführt und nicht als separate zusätzliche Kostenposition neben diesem Pool angesetzt. Der bestätigte Zuschlagssatz von 10 % auf Herstellkosten gemäß D-0064 bleibt bestehen.

---

## D-0071 – CNC-Abschreibung im V1-BAB

Status: APPROVED (Nutzerentscheidung; Methode und Betrag offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0063 / D-0069

Die CNC-Abschreibung wird in V1 als Fertigungsgemeinkosten im BAB berücksichtigt. Abschreibungsbasis, Methode, Zeitraum und Betrag sind noch nicht festgelegt. Die gesonderte Restwert-/Verwertungsregel aus D-0044 bis D-0052 legt diese Buchabschreibung nicht automatisch fest.

---

## D-0072 – Inflationsangepasste Wiederbeschaffungskosten im BAB

Status: APPROVED (Nutzerentscheidung; Betrachtungszeitraum und Umlegung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044 / D-0046 / D-0047 / D-0071

Bei der BAB-Kalkulation der CNC sollen die Kosten für die Neubeschaffung eines Geräts einschließlich der Inflationsrate für den maßgeblichen Betrachtungszeitraum berücksichtigt werden. Für die CNC gelten der dokumentierte Basispreis von 120.000 € und die jährliche Preissteigerung von 2 % gemäß D-0046/D-0047 als vorhandene Bezugspunkte. Betrachtungszeitraum, Umlegung auf Periodenkosten und konkrete BAB-Berechnung bleiben offen; die Buchabschreibung ist damit noch nicht vollständig bestimmt.

---

## D-0073 – Gesamtnutzungsdauer als Inflationszeitraum der CNC-Wiederbeschaffung

Status: APPROVED (Nutzerentscheidung; Umlegung und konkrete BAB-Berechnung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 / D-0046 / D-0047 / D-0071 / D-0072

Für die inflationsangepasste Wiederbeschaffungsbasis der CNC im BAB wird die gesamte Nutzungsdauer angesetzt. Gemäß D-0045 beträgt diese 16 Jahre. Die acht verbleibenden Nutzungsjahre sind nicht der maßgebliche Inflationszeitraum. Bei 2 % jährlicher Preissteigerung und dem Basispreis von 120.000 € ergibt sich für den Wiederbeschaffungswert nach diesem Zeitraum die Bezugsformel 120.000 € × 1,02^16. Wie dieser Wert auf BAB-Periodenkosten umgelegt wird und wie die CNC-Buchabschreibung konkret berechnet wird, bleibt offen.

---

## D-0074 – Monatliche Verteilung des CNC-Wiederbeschaffungswerts im BAB

Status: APPROVED (Nutzerentscheidung; Rundungsregel für den Monatsbetrag offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 bis D-0047 / D-0071 bis D-0073

Der inflationsangepasste CNC-Wiederbeschaffungswert wird anteilig auf einen Monat der gesamten Nutzungsdauer verteilt. Bei 16 Jahren Gesamtnutzungsdauer gemäß D-0045 entspricht dies 192 Monaten. Der monatliche BAB-Bezugsbetrag lautet daher `(120.000 € × 1,02^16) / 192`. Eine Rundungsregel für den Monatsbetrag und die vollständige Buchabschreibungsbehandlung sind damit nicht festgelegt.

---

## D-0075 – Aufrunden des monatlichen CNC-BAB-Bezugsbetrags

Status: APPROVED (Nutzerentscheidung; Rundungsgenauigkeit offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0071 / D-0073 / D-0074

Der monatliche CNC-BAB-Bezugsbetrag wird für die Kalkulation immer aufgerundet. Auf welche Genauigkeit bzw. Einheit (z. B. Cent oder volle Euro) aufgerundet wird, ist noch nicht festgelegt.

---

## D-0076 – Aufrundung des monatlichen CNC-BAB-Betrags auf volle Euro

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0071 / D-0074 / D-0075

Der monatliche CNC-BAB-Bezugsbetrag wird stets auf den nächsten vollen Euro aufgerundet. Grundlage ist der Monatsbetrag `(120.000 € × 1,02^16) / 192` gemäß D-0074. Die vollständige bilanzielle Buchabschreibungsbehandlung bleibt davon getrennt offen.

---

## D-0077 – Separate bilanzielle Buchabschreibung der CNC

Status: APPROVED (Nutzerentscheidung; Methode und Berechnungsparameter offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-25
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 / D-0071 / D-0074 bis D-0076

V1 führt zusätzlich zur kalkulatorischen BAB-Kostenbasis eine separate bilanzielle Buchabschreibung der CNC. Diese ist getrennt von der inflationsangepassten und auf volle Euro aufgerundeten BAB-Kostenbasis zu behandeln. Methode, Abschreibungsbasis, Beginn, Restlaufzeit, Restwert und Periodenbetrag sind noch offen.

---

## D-0078 – Abschreibungsmethode für laufende und neue Anschaffungen

Status: APPROVED (Nutzerentscheidung; AfA-Tabellenposition der CNC und konkrete Beträge offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 / D-0071 / D-0077

Für laufende Anschaffungen gilt die lineare Abschreibungsmethode nach der AfA-Tabelle des Bundesministeriums der Finanzen. Die Abschreibungsmethode für Neuanschaffungen wird einmal im Jahr festgelegt. Welche AfA-Tabellenposition und Nutzungsdauer für die bestehende CNC anzusetzen sind, sowie Abschreibungsbasis, Beginn und konkrete Periodenbeträge, bleiben offen und werden nicht durch A01 festgelegt.

---

## D-0079 – Spielerwahl der Abschreibungsmethode für Neuanschaffungen

Status: APPROVED (Nutzerentscheidung; auswählbare Methoden offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0078

Die jährliche Festlegung der Abschreibungsmethode für Neuanschaffungen ist eine Spielerentscheidung. Welche konkreten Methoden dem Spieler zur Auswahl stehen, ist noch nicht festgelegt.

---

## D-0080 – Korrigierte Spielerwahl und Methodenmenü für Abschreibungen

Status: APPROVED (Nutzerentscheidung; GWG-Auswahlmechanik und Anwendungsgrenzen offen)
Quelle: Nutzerkorrektur im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0078 / D-0079

Die vorangehende Festlegung einer jährlichen Abfrage wird korrigiert: Die Abfrage zur Abschreibungsmethode erfolgt nur zu Spielbeginn. Danach kann der Spieler die Methode in einem Menü für zukünftige Neuanschaffungen ändern. Für Neuanschaffungen sollen lineare AfA, degressive AfA und die beiden GWG-Verfahren angeboten werden: Sofortabzug im Anschaffungsjahr und Sammelposten. Die GWG-Grenzen und -Voraussetzungen sind bei der Anwendung zu berücksichtigen.

Rechtsstandsnotiz zum 2026-10-26, keine zusätzliche Produktentscheidung: § 6 Abs. 2 EStG sieht den Sofortabzug für abnutzbare, bewegliche und selbständig nutzbare Anlagegüter bis 800 € (maßgeblicher Wert vermindert um enthaltene Vorsteuer) vor. § 6 Abs. 2a EStG sieht den Sammelposten für Wirtschaftsgüter über 250 € bis 1.000 € vor, mit Auflösung zu je einem Fünftel im Bildungsjahr und den folgenden vier Wirtschaftsjahren; die Regel ist für die betreffenden Wirtschaftsgüter eines Wirtschaftsjahrs einheitlich anzuwenden. Zwischen den Schwellen besteht ein Überschneidungsbereich, dessen Spielerauswahl noch geklärt werden muss. Quellen: [§ 6 EStG](https://www.gesetze-im-internet.de/estg/__6.html), [BMF-Hinweise zu GWG und Sammelposten](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2024-09-02-anlage-EUER-2024.pdf?__blob=publicationFile&v=5).

Die zeitliche Anwendbarkeit der degressiven AfA im Spiel sowie die konkrete GWG-Auswahlmechanik im Überschneidungsbereich werden nicht durch A01 festgelegt. Zum geprüften Rechtsstand ist die degressive AfA für bewegliche Anlagegüter für Anschaffungen nach dem 30.06.2025 und vor dem 01.01.2028 zugelassen, mit gesetzlicher Obergrenze von 30 % bzw. dem Dreifachen des linearen AfA-Satzes. D-0078 bleibt für laufende Anschaffungen bestehen: lineare AfA nach BMF-AfA-Tabelle.

---

## D-0081 – Einheitliche GWG-Auswahl je Wirtschaftsjahr

Status: APPROVED (Nutzerentscheidung; Wirksamkeitszeitpunkt einer Menüänderung offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0080

Für den GWG-Überschneidungsbereich über 250 € bis einschließlich 800 €, in dem Sofortabzug und Sammelposten möglich sind, wird die Auswahl einheitlich je Wirtschaftsjahr getroffen. Sie gilt für alle betreffenden Wirtschaftsgüter dieses Wirtschaftsjahrs; sie wird nicht je einzelner Anschaffung unterschiedlich gewählt. Wie eine Menüänderung zeitlich wirksam wird, bleibt offen.
---

## D-0082 – Wirksamkeit einer GWG-Menüänderung ab dem Folgejahr

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0080 / D-0081

Eine Änderung der im Menü gewählten GWG-Methode wird stets ab dem nächsten Wirtschaftsjahr wirksam. Damit bleibt die nach D-0081 festgelegte einheitliche Anwendung je Wirtschaftsjahr gewahrt; ein Methodenwechsel innerhalb des laufenden Wirtschaftsjahrs findet nicht statt.
---

## D-0083 – Degressive AfA auch nach dem dokumentierten gesetzlichen Zeitraum

Status: APPROVED (Nutzerentscheidung; keine Aussage zur steuerrechtlichen Zulässigkeit)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0080

Die degressive AfA soll im Spiel auch in späteren Spieljahren nach dem derzeit dokumentierten gesetzlichen Zeitraum als vereinfachte Spielregel angeboten werden. Diese Produktregel behauptet keine steuerrechtliche Zulässigkeit der degressiven AfA für Anschaffungen außerhalb des im Entscheidungslog dokumentierten Rechtszeitraums. Weitere Berechnungsparameter werden damit nicht festgelegt.
---

## D-0084 – Degressive AfA mit gesetzlicher Satzbegrenzung

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0080 / D-0083

Der jährliche degressive AfA-Satz beträgt höchstens den niedrigeren Wert aus 30 % und dem Dreifachen des für das Wirtschaftsgut geltenden linearen AfA-Satzes. Er wird auf den jeweiligen Restbuchwert angewendet. Zusammen mit D-0083 gilt diese Begrenzung im Spiel auch nach dem dokumentierten gesetzlichen Zeitraum als vereinfachte Spielregel; daraus wird keine steuerrechtliche Zulässigkeit außerhalb des gesetzlichen Zeitraums abgeleitet. Rechtsgrundlage für die Begrenzung im dokumentierten gesetzlichen Zeitraum: § 7 Abs. 2 EStG ([amtlicher Gesetzestext](https://www.gesetze-im-internet.de/estg/__7.html)).
---

## D-0085 – BMF-AfA-Tabelle maßgeblich für die bestehende CNC

Status: APPROVED (Nutzerentscheidung; konkrete Tabellenposition und Restdauer offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 / D-0077 / D-0078

Für die separate lineare bilanzielle Buchabschreibung der bestehenden CNC ist die einschlägige Nutzungsdauer laut BMF-AfA-Tabelle für den CNC-Maschinentyp maßgeblich, nicht automatisch die in D-0045 festgelegte betriebliche Gesamtnutzungsdauer von 16 Jahren. Die konkrete Tabellenposition, steuerliche Restnutzungsdauer, Abschreibungsbasis und Periodenbeträge sind noch nicht bestimmt und müssen fachlich abgeglichen werden. Die kalkulatorische BAB-Kostenbasis bleibt davon getrennt.
---

## D-0086 – Anschaffungskosten abzüglich bisheriger AfA als CNC-Buchbasis

Status: APPROVED (Nutzerentscheidung; konkreter AfA-Verlauf bleibt fachlich abzugleichen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 / D-0077 / D-0078 / D-0085

Bemessungsgrundlage für die weitere bilanzielle Buchabschreibung der bestehenden CNC sind die ursprünglichen Anschaffungskosten von 120.000 € abzüglich der bereits erfolgten AfA. Der in der Eröffnungsbilanz ausgewiesene Buchwert von 40.000 € bleibt der dokumentierte Buchstand zum Simulationsstart. Der konkrete bisherige AfA-Verlauf und die daraus folgende Restnutzungsdauer gemäß einschlägiger BMF-AfA-Tabelle sind fachlich abzugleichen; daraus wird hier kein zusätzlicher AfA-Betrag abgeleitet.
---

## D-0087 – Abschreibungstermin für vorhandene und neue AfA-Gegenstände

Status: APPROVED (Nutzerentscheidung; Umfang der Regel entsprechend Rechtsvorgaben offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0011 / D-0077 / D-0078 / D-0085 / D-0086

Für alle bei Spielstart bereits im Unternehmen befindlichen AfA-Gegenstände ist der Abschreibungstermin der erste Arbeitstag des zweiten Quartals. Für Neuanschaffungen richtet sich der Abschreibungszeitpunkt nach den jeweils geltenden gesetzlichen Regelungen. Diese Festlegung bestimmt keinen konkreten BMF-AfA-Tabelleneintrag und keine Periodenbeträge.
---

## D-0088 – AfA-Termin erfasst die AfA des laufenden Wirtschaftsjahrs

Status: APPROVED (Nutzerentscheidung; Höhe gemäß BMF-AfA-Tabelle fachlich offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0085 bis D-0087

Am ersten Arbeitstag des zweiten Quartals wird für die bei Spielstart vorhandenen AfA-Gegenstände die AfA des laufenden Wirtschaftsjahrs erfasst. Die Höhe und die AfA-Historie der bestehenden CNC sind weiterhin nach der einschlägigen BMF-AfA-Tabelle fachlich zu bestimmen.
---

## D-0089 – CNC-Anschaffungsdatum auf 01.01.2019 angepasst

Status: APPROVED (Nutzerentscheidung / Szenariodatum)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0045 / D-0048 / D-0085 bis D-0088

Der Anschaffungszeitpunkt der bestehenden CNC wird auf den 01.01.2019 angepasst, damit ihre Nutzungszeit zum Simulationsstart am 01.01.2027 genau acht Jahre beträgt. Damit sind D-0045s acht bereits genutzte Jahre und D-0048s 50-%-Nutzungswertverlust zum Start konsistent. Die lineare Buchabschreibung bleibt gemäß D-0085/D-0086 von der betriebswirtschaftlichen Wertverlustregel getrennt.

---

## D-0090 – Stahl-Anfangsmenge im V1-Startprofil

Status: APPROVED (Nutzerentscheidung / Szenariowert)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / A02-Startprofil / CP-0115

Für den V1-Unternehmensstart am 01.01.2027 beträgt die Anfangsmenge des Stahlbestands 2.000 kg. Diese Entscheidung bestätigt ausschließlich die Menge. Der Eröffnungswert bzw. die E3-Start-WAP-Basis von 6.400 € (entsprechend 3,20 €/kg laut A02-Vorschlag), Preisbasis einschließlich Bezugskosten/SimTAX und Rundungsregeln bleiben offen.

---

## D-0091 – Stahl-Eröffnungswert aus Vorjahresschluss

Status: APPROVED (Nutzerentscheidung; Berechnungs-/Übergabeprozess offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0090 / CP-0116

Der Wert des bestätigten Stahl-Anfangsbestands von 2.000 kg wird aus dem Schlusswert des Vorjahres übernommen, der im Wirtschaftssimulationstool berechnet wird. Der A02-Vorschlag von 6.400 € bzw. 3,20 €/kg ist damit nicht als bestätigter Eröffnungswert festgelegt. Noch offen sind insbesondere, wie der Vorjahresschluss erzeugt und an das Startprofil übergeben wird sowie die Bewertungs-/Preisbestandteile einschließlich Bezugskosten und SimTAX.

---

## D-0092 – Begrenzter V1-Produktumfang mit späterer Branchenerweiterung

Status: APPROVED (Nutzerentscheidung; konkrete V1-Produktliste offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0044 / CP-0116

Die V1-Simulation soll nur eine Auswahl von Produkten enthalten, die für den Test der Simulation erforderlich ist. Der Produktbestand soll später erweiterbar sein, damit auch weitere Branchen spielbar werden. Welche Produkte in die konkrete V1-Auswahl gehören und nach welchen Kriterien „für den Test erforderlich“ bestimmt wird, bleibt offen.

---

## D-0093 – Vorjahresschluss als bereitgestellter Startwert

Status: APPROVED (Nutzerentscheidung; Datenquelle und konkrete Werte offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0091 / D-0092 / CP-0117

Das Vorjahr wird nicht als vorgeschaltete Simulation im Spiel durchgerechnet. Der für den Unternehmensstart benötigte Vorjahresschluss wird als Startwert bereitgestellt. Ein passender Agent soll realistische Ausgangsdaten ermitteln oder aus aktuellen Marktdaten ableiten; die übernommenen Werte werden danach festgeschrieben. Die zuständige Fachrolle, konkrete Datenquelle, Bezugsstichtag, Umfang der zu erhebenden Werte und Auswahl der V1-Testprodukte sind noch offen. Es werden keine Marktwerte mit dieser Entscheidung behauptet.

---

## D-0094 – A02-Materialauswahl als V1-Basis

Status: APPROVED (Nutzerentscheidung; zusätzliche Warengruppen und konkrete Werte offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0092 / D-0093 / CP-0118

Die bestehende A02-Auswahl – Stahl, Aluminium und Norm-/Zukaufteile – wird als Basis des V1-Simulationsumfangs übernommen. Zusätzlich sollen weitere Warengruppen für die Simulation geprüft werden. Die vom Nutzer ausdrücklich genannten Kandidaten sind Schmierstoffe, Transportleistung, Strom, Wasser, Energieträger, Kunststoffe und Telekommunikation. Diese Kandidaten und weitere Vorschläge sind erst nach Auswahl durch den Nutzer Teil des V1-Umfangs; Preise, Mengen und Bewertungsregeln werden hier nicht festgelegt.

---

## D-0095 – Auswahl der V1-Warengruppen

Status: APPROVED (Nutzerentscheidung; Untergliederung der Norm-/Zukaufteile weiter offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0092 / D-0094 / CP-0119

Als V1-Auswahl bestätigt sind die A02-Basisgruppen Stahl, Aluminium und Norm-/Zukaufteile sowie alle in CP-0118 nummerierten Kandidaten 4 bis 25: Schmierstoffe; Transport-/Frachtleistungen; Strom; Wasser/Abwasser; Energieträger; Kunststoffe; Telekommunikation; Schneidwerkzeuge/Wendeschneidplatten; Kühlschmierstoffe/Bearbeitungsemulsionen; Schleifmittel/Trennscheiben; Verbindungselemente; Hydraulik-/Pneumatikkomponenten; Elektromotoren/elektrische Antriebskomponenten; Lager/Wellen/mechanische Normkomponenten; Dichtungen/technische Elastomere; Schweißzusatzwerkstoffe/Schutzgase; Verpackungsmaterialien; Oberflächenbehandlung/Beschichtung; Maschinenwartung/Ersatzteile; Reinigungs-/Betriebsstoffe; Arbeitsschutz/PSA; Abfall-/Entsorgungsleistungen. Preise, Mengen, Quellen und Buchungs-/Bestandsbehandlung sind nicht dadurch festgelegt.

Die A02-Spezifikation führt Norm-/Zukaufteile bislang nur als Sammelposten (1.000 Stück; 56 Stück Gesamtbedarf der drei Startaufträge) und nennt keine Einzelbestandteile. Welche konkreten Standard- oder Kaufteile unter Gruppe 3 mitlaufen bzw. zusätzlich abgebildet werden sollen, bleibt offen.

---

## D-0096 – Norm-/Zukaufteile einzeln statt als Durchschnittspreis-Sammelposten

Status: APPROVED (Nutzerentscheidung; konkreter Artikelkatalog und Werte offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0010 / D-0095 / CP-0120

Die Gruppe Norm-/Zukaufteile soll unter anderem Schrauben, Muttern und Teile anderer Hersteller umfassen. Ein einzelner aggregierter Sammelposten mit Durchschnittspreis ist für die erste spielbare Version nicht sinnvoll und muss davor ersetzt werden. A02 soll die bestehende Spezifikation später erneut prüfen und für einen Spielstart brauchbar überarbeiten. Konkrete Artikel, Artikelmengen, Preise und Accounting-/Bewertungsregeln werden damit nicht festgelegt.

---

## D-0097 – SimTAX-Voranmeldungszeitraum und Fälligkeit nach gesetzlicher Regel

Status: APPROVED (Nutzerbestätigung zum Lösungsvorschlag)
Quelle: Nutzerbestätigung im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0059 / D-0061 / CP-0121

Für SimTAX V1 wird bei dem bestätigten fiktiven Vorjahressteuerbetrag von 49.400 € der Kalendermonat als Voranmeldungszeitraum verwendet. Voranmeldung und Vorauszahlung sind am zehnten Tag nach Ablauf des jeweiligen Kalendermonats fällig; fällt dieser Tag auf Samstag, Sonntag oder gesetzlichen Feiertag, gilt der nächstfolgende Werktag. Eine Dauerfristverlängerung wird im V1-Modell nicht unterstellt. Das bildet den gesetzlichen Standard gemäß dem Rechtsstand vom 2026-10-26 für die Simulation ab und stellt keine Behauptung dar, dass SimTAX echte Umsatzsteuer ist. Quellen: [§ 18 UStG](https://www.gesetze-im-internet.de/ustg_1980/__18.html), [§ 108 AO](https://www.gesetze-im-internet.de/ao_1977/__108.html), [§§ 46–47 UStDV](https://www.gesetze-im-internet.de/ustdv_1980/__46.html).

## D-0098 – BMF-AfA-Branchentabelle für die bestehende CNC

Status: APPROVED (Nutzerentscheidung; AfA-Verlauf und Eröffnungsbuchwert fachlich abzugleichen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0085 bis D-0089 / CP-0121

Für die bestehende CNC-Fräsmaschine wird die BMF-AfA-Tabelle Maschinenbau als Referenz zugrunde gelegt; sie nennt für CNC-/NC-Fräsmaschinen sieben Jahre Nutzungsdauer. Dies bestätigt die Tabellenwahl, nicht die tatsächliche AfA-Historie oder einen neuen Buchwert. Der bestätigte Eröffnungsbuchwert von 40.000 € und der Anschaffungswert von 120.000 € abzüglich bisheriger AfA müssen fachlich mit der Tabellenreferenz abgeglichen werden. Die kalkulatorische BAB-Kostenbasis bleibt getrennt.
---

## D-0099 – Eröffnungsbuchwert der CNC aus Sieben-Jahres-AfA abgeleitet

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0085 / D-0086 / D-0089 / D-0098

Der Eröffnungsbuchwert der bestehenden CNC wird aus der linearen AfA über die bestätigte siebenjährige BMF-Referenzdauer abgeleitet. Bei Anschaffung am 01.01.2019 sind zum Simulationsstart 01.01.2027 sieben volle AfA-Jahre abgeschlossen; der daraus abgeleitete Eröffnungsbuchwert beträgt 0 €. Dies ersetzt den zuvor dokumentierten Szenario-Eröffnungsbuchwert von 40.000 € für diese Maschine. Die zugrundeliegende AfA-Historie ist die lineare Verteilung der 120.000 € Anschaffungskosten über sieben Jahre; es wird kein zusätzlicher Restwert unterstellt.
---

## D-0100 – Hauptrefinanzierungssatz als EZB-Basis für Unternehmenszinsen

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0023 / CP-0047

Als EZB-Referenz für den individuellen Unternehmenszinssatz wird der Hauptrefinanzierungssatz (MRO) verwendet. Der bereits bestätigte individuelle Unternehmensaufschlag wird auf diese Referenz angewendet; Mittelwert +3 Prozentpunkte und Spanne +0,5 bis +5,5 Prozentpunkte bleiben gemäß D-0022 unverändert. Den drei EZB-Leitzinsen ist keine einheitliche, rechtlich vorgeschriebene Bankkreditreferenz zugeordnet; dies ist die Nutzerwahl für das Spiel. Stichtag der jährlichen Referenzwertübernahme und die Bewertungsformel für den individuellen Aufschlag bleiben offen. Quelle für die drei EZB-Leitzinsen und ihre unterschiedlichen Funktionen: [EZB: offizielle Leitzinsen](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.de.html).
---

## D-0101 – MRO-Stichtag am 1. Januar des Spieljahrs

Status: APPROVED (Nutzerentscheidung; Zukunftssimulation des EZB-Satzes offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0100

Für die jährliche Unternehmenszinsvereinbarung gilt der am 1. Januar des jeweiligen Spieljahrs geltende EZB-Hauptrefinanzierungssatz (MRO). Wenn das Spiel über die verfügbaren realen EZB-Zinsdaten hinausläuft, soll der MRO für die Zukunft simuliert werden. Die Methode zur Erzeugung künftiger MRO-Werte ist offen; es wird weder ein konstanter Satz noch ein bestimmter Prognose- oder Zufallsprozess unterstellt. Quelle für veröffentlichte Sätze und Wirksamkeitsdaten: [EZB: offizielle Leitzinsen](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.de.html).
---

## D-0102 – Künftiger MRO-Pfad orientiert sich an Inflationsrate

Status: APPROVED (Nutzerentscheidung; Inflations- und Zinsmodell in V2 zu erarbeiten)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0100 / D-0101

Für Spieljahre ohne verfügbare reale EZB-Daten soll der simulierte MRO-Satz sich an der Inflationsrate orientieren. Die Inflationsrate selbst und die konkrete Überführungsregel von Inflation zu MRO sind in V2 fachlich zu erarbeiten. Für V1 werden keine künftigen MRO-Werte, keine Inflationswerte und keine Formel ergänzt.
---

## D-0103 – Fremdkapitalquote als V1-Faktor des individuellen Zinsaufschlags

Status: APPROVED (Nutzerentscheidung; Zuordnung innerhalb des Schwellenbereichs offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0100 bis D-0102

Für V1 soll die Fremdkapitalquote den individuellen Zinsaufschlag beeinflussen: Bei einer Fremdkapitalquote unter 15 % gilt das untere Ende des Aufschlagsbereichs (+0,5 Prozentpunkte); bei 90 % Verschuldung gilt das obere Ende (+5,5 Prozentpunkte). Weitere Einflussfaktoren sollen in V2 erarbeitet werden. Eine allgemeingültige rechtliche oder betriebswirtschaftliche Formel zur Zuordnung zwischen den Grenzen besteht nicht; die Zwischenwerte und genaue Berechnung bleiben offen. Der Mittelwert +3 Prozentpunkte bleibt als bisheriger D-0022-Szenariomittelwert dokumentiert, bis seine Einbindung in die nutzergewählte Fremdkapitalquote-Regel geklärt ist.
---

## D-0104 – Exponentielle Fremdkapitalquote-Zinszuordnung mit 40-%-Anker

Status: APPROVED (Nutzerentscheidung; konkrete exponentielle Kurvenform offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0103

Der individuelle Zinsaufschlag soll mit der Fremdkapitalquote exponentiell steigen. Bei 40 % Fremdkapitalquote soll der Aufschlag +3 Prozentpunkte betragen. Zusammen mit D-0103 gelten unter 15 % +0,5 Prozentpunkte und bei 90 % +5,5 Prozentpunkte. Die Bestätigung legt die Ankerwerte und die gewünschte exponentielle Form fest, aber noch keine eindeutige mathematische Funktion. Eine beschränkte, zum oberen Grenzwert abflachende exponentielle Kurve wäre mit diesen Ankern vereinbar; ob dies gemeint ist, muss der Nutzer noch bestätigen. Weitere Bonitätsfaktoren bleiben V2-Arbeit.
---

## D-0105 – Beschränkt-abflachende Exponentialkurve für Zinsaufschlag bestätigt

Status: APPROVED (Nutzerentscheidung zur Kurvenart; konkrete Formel und Werte außerhalb des Bereichs offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0103 / D-0104

Der Nutzer bestätigt für die Zuordnung des V1-Zinsaufschlags zur Fremdkapitalquote eine beschränkte, zum oberen Grenzwert abflachende Exponentialkurve. Zusammen mit D-0103/D-0104 gelten als Anker: unter 15 % Fremdkapitalquote +0,5 Prozentpunkte, bei 40 % +3 Prozentpunkte und bei 90 % +5,5 Prozentpunkte. Die konkrete mathematische Formel sowie das Verhalten oberhalb von 90 % sind nicht festgelegt. Weitere Bewertungsfaktoren bleiben V2-Arbeit.
---

## D-0106 – Fremdkapitalquote als Fremdkapital zu Gesamtkapital

Status: APPROVED (Nutzerbestätigung einer gängigen betriebswirtschaftlichen Kennzahlendefinition)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0022 / D-0103 bis D-0105

Für die Zinsaufschlagsberechnung gilt: Fremdkapitalquote = Fremdkapital / Gesamtkapital × 100; Gesamtkapital wird dabei als Bilanzsumme angesetzt. Dies ist die gängige betriebswirtschaftliche Kennzahlendefinition und keine gesetzlich vorgegebene Zinsberechnungsformel. Quelle: [Haufe – kapitalbezogene Kennzahlen](https://www.haufe.de/id/beitrag/eigenkapital-im-abschluss-nach-hgb-und-estgkstg-6-kapitalbezogene-kennzahlen-HI1691300.html).
---

## D-0107 – Normierte Exponentialformel für V1-Zinsaufschlag

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0103 bis D-0106

Für die V1-Berechnung des individuellen Zinsaufschlags gilt folgende normierte, beschränkt-abflachende Exponentialformel. Sei q die Fremdkapitalquote in Prozent und φ = (1 + √5) / 2; k = ln(φ) / 25. Für 15 ≤ q ≤ 90 gilt: Z(q) = 0,5 + 5 × (1 − exp(−k × (q − 15))) / (1 − exp(−75k)) Prozentpunkte. Für q < 15 gilt der Aufschlag +0,5 Prozentpunkte. Die Formel ergibt +3 Prozentpunkte bei q = 40 und +5,5 Prozentpunkte bei q = 90. Verhalten bei q > 90 bleibt offen. Weitere Bonitätsfaktoren sind V2-Arbeit.
---

## D-0108 – Separater 100-%-FKQ-Zielzins; D-0023 bleibt unverändert

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerbestätigung im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0023 / D-0103 bis D-0107 / CP-0133

Bei 100 % Fremdkapitalquote beträgt der Zielzins der FKQ-Aufschlagskurve den am jeweiligen 1. Januar geltenden EZB-Hauptrefinanzierungssatz zuzüglich 8 Prozentpunkten. Dieser FKQ-Zielwert ist getrennt vom Dispozins zu behandeln. D-0023 bleibt unverändert: Der Dispozins beträgt 8 % mehr als der individuell vereinbarte Unternehmenszinssatz. Bei 90 % FKQ gilt gemäß D-0107 weiterhin EZB-MRO +5,5 Prozentpunkte; der Übergang von 90 % auf 100 % ist noch festzulegen.
---

## D-0109 – Stückweise Exponentialkurve bis 100 % Fremdkapitalquote

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerbestätigung im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0107 / D-0108 / CP-0135

Die in CP-0135 vorgeschlagene Erweiterung wird für den V1-Zinsaufschlag bestätigt. Sei q die Fremdkapitalquote in Prozent, φ=(1+√5)/2 und k=ln(φ)/25. Für 15≤q≤90 gilt D-0107: `Z(q)=0,5+5×(1−exp(−k×(q−15)))/(1−exp(−75k))` Prozentpunkte. Für 90<q≤100 gilt: `Z(q)=5,5+2,5×(exp(k×(q−90))−1)/(exp(10k)−1)` Prozentpunkte. Bei q<15 gilt +0,5 Prozentpunkte. Damit gelten +3 bei 40 %, +5,5 bei 90 % und +8 bei 100 %. Der Steigungsknick bei 90 % ist akzeptiert. Der Zins beträgt EZB-MRO plus Z(q); D-0023 bleibt als eigenständige Dispozinsregel unverändert. Weitere Bonitätsfaktoren sind V2-Arbeit.
---

## D-0110 – Kunden-Zahlungseingang zum vertraglichen Fälligkeitstag

Status: APPROVED (Nutzerentscheidung; spätere Ereignisprofile bleiben möglich)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0013 bis D-0020 / CP-0137

Für V1 gilt der vertragliche Fälligkeitstag zugleich als tatsächlicher vollständiger Kunden-Zahlungseingang, sofern kein ausdrücklich festgelegtes Verspätungsereignis eintritt. Kundeneingänge bleiben unabhängig von der eigenen Liquidität. Diese Produktregel legt keine allgemeine reale Zahlungswahrscheinlichkeit fest; spätere Ereignisse dürfen abweichendes Zahlungsverhalten einführen.
---

## D-0111 – Entstehung eigener Lieferantenverbindlichkeiten bei Leistungseingang

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / CP-0139

In V1 wird eine Verbindlichkeit für Material bei akzeptiertem Wareneingang und für Fremdleistungen bei bestätigter Leistung erfasst. Die Lieferantenrechnung bestätigt anschließend Betrag und Fälligkeit. Diese Produktregel legt nicht fest, dass die Rechnung rechtlich bedeutungslos wäre oder dass sie für die Fälligkeit entbehrlich ist. Der Kaufvertrag begründet die Zahlungspflicht des Käufers (§ 433 Abs. 2 BGB); der Jahresabschluss hat Schulden vollständig zu enthalten (§ 246 Abs. 1 HGB). Ob einzelne Vertrags- oder Leistungsumstände im Einzelfall einen anderen Zeitpunkt erfordern, ist nicht durch diese vereinfachte V1-Regel entschieden.

Quellen: [§ 433 BGB](https://www.gesetze-im-internet.de/bgb/__433.html), [§ 246 HGB](https://www.gesetze-im-internet.de/hgb/__246.html).
---

## D-0112 – Kundenforderung und vereinfachter Auftragserlös bei Rechnung

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0013 / CP-0140

In V1 entsteht eine Kundenforderung und der vereinfachte Auftragserlös bei Ausstellung/Freigabe einer Kundenrechnung für eine erbrachte bzw. nach Produktregel abrechenbare Leistung, entsprechend der bisherigen A03-Arbeitsregel. Angebot, Auftragsannahme und Lieferung allein erzeugen dadurch nicht automatisch eine Forderung. Dies ist eine Produktregel für den MVP und keine allgemeine Aussage zur handels- oder steuerrechtlichen Umsatzrealisierung; die Rechnung muss auf die zugrunde liegende Leistung bzw. Lieferung referenzieren.

Rechtliche Abgrenzung: Fälligkeit und Anspruchsentstehung hängen von Vertragsart und Umständen ab; HGB § 252 enthält unter anderem das Realisationsprinzip für Gewinne. Diese Vorschriften werden nicht durch die vereinfachte Produktregel ersetzt. Quellen: [§ 252 HGB](https://www.gesetze-im-internet.de/hgb/__252.html), [§ 433 BGB](https://www.gesetze-im-internet.de/bgb/__433.html), [§ 641 BGB](https://www.gesetze-im-internet.de/bgb/__641.html).
---

## D-0113 – SimTAX-Vorsteuer auf qualifizierte Lieferantenrechnungen

Status: APPROVED (Nutzerentscheidung; Sonderfälle außerhalb der V1-Regel bleiben offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0053 bis D-0058 / CP-0141

Für V1 wird SimTAX auch auf eingehenden externen Lieferantenrechnungen als Vorsteuer-Simulationssaldo berücksichtigt, aber nur, wenn die zugrunde liegende Lieferung oder Leistung für das Unternehmen von einem anderen Unternehmer ausgeführt wurde, eine ordnungsgemäße Rechnung vorliegt und die Steuer für diese Leistung gesetzlich geschuldet sowie nach der V1-Abbildung abzugsfähig ist. Der gesonderte SimTAX-Saldo wird mit dem Umsatzsteuer-Simulationssaldo verrechnet. Die gesetzlichen Voraussetzungen des Vorsteuerabzugs hängen unter anderem von §§ 14, 14a und 15 UStG ab; besondere Fallgruppen, Ausschlüsse und Aufteilungen werden durch diese Produktregel nicht vollständig modelliert. SimTAX bleibt ein Spielwert, keine echte Steuerabrechnung.

Quelle: [§ 15 UStG](https://www.gesetze-im-internet.de/ustg_1980/__15.html).
---

## D-0115 – SimTAX-Erklärungsberichtigung nach § 153 AO

Status: APPROVED (Nutzerentscheidung; Auslöser im Spiel bleibt offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0097 / D-0114 / CP-0143

Die V1-Simulation soll § 153 AO für SimTAX-Erklärungen sachgerecht abbilden. Wird nachträglich vor Ablauf der Festsetzungsfrist erkannt, dass eine abgegebene Erklärung unrichtig oder unvollständig ist und dadurch eine Steuerverkürzung möglich ist oder eingetreten ist, muss die Simulation eine unverzügliche Anzeige und erforderliche Berichtigung vorsehen. „Unverzüglich“ wird nicht in eine selbst erfundene feste Tagesfrist umgerechnet. Diese Regel betrifft die Berichtigung abgegebener Steuererklärungen und entscheidet nicht allgemein, ob eine interne Buchungsperiode geschlossen oder wieder geöffnet wird. Wie und wodurch der Fehler im Spiel erkannt wird, bleibt als Spielmechanik offen. SimTAX ist eine Spielsimulation und ersetzt keine steuerliche Beratung.

Quelle: [§ 153 AO](https://www.gesetze-im-internet.de/ao_1977/__153.html).
---

## D-0116 – Erkennung fehlerhafter SimTAX-Erklärungen nur durch Ereignisse

Status: APPROVED (Nutzerentscheidung; konkrete Ereignisse offen)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0115 / CP-0144

In V1 werden Fehler in bereits abgegebenen SimTAX-Erklärungen ausschließlich durch Ereignisse erkannt. Sobald ein solches Ereignis die Kenntnis eines relevanten Fehlers auslöst, gelten die in D-0115 dokumentierten Bedingungen und die Pflicht zur unverzüglichen Anzeige und Berichtigung. Welche konkreten Ereignisse dies auslösen und welche Fehler sie offenlegen, bleibt offen.
---

## D-0117 – Allgemeiner Buchungsperiodenabschluss in V1

Status: APPROVED (Nutzerentscheidung; Korrekturablauf durch D-0119 festgelegt)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0115 / CP-0145

V1 enthält einen allgemeinen Buchungsperiodenabschluss. Das Periodenintervall wird durch D-0118 festgelegt; der Umgang mit nichtsteuerlichen Buchungsfehlern nach Abschluss wird durch D-0119 bestimmt. § 153 AO gilt gesondert für erkannte fehlerhafte Steuererklärungen.
---

## D-0118 – Zwölfmonatiges V1-Geschäftsjahr mit Kalenderjahresende

Status: APPROVED (Nutzerentscheidung; alternatives Wirtschaftsjahr nur mögliche V2-Prüfung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0117 / CP-0146

V1 nutzt ein zwölfmonatiges Geschäftsjahr, das mit dem Kalenderjahr endet. Ein alternatives Wirtschaftsjahr kann in V2 geprüft werden; es ist keine V1-Regel. Das entspricht der in §§ 240 Abs. 2 und 242 HGB vorgesehenen jährlichen Abschlusslogik und der Höchstdauer eines Geschäftsjahrs von zwölf Monaten, ohne daraus abzuleiten, dass das HGB für alle Unternehmen zwingend das Kalenderjahr vorschreibt.

Quellen: [§ 240 HGB](https://www.gesetze-im-internet.de/hgb/__240.html), [§ 242 HGB](https://www.gesetze-im-internet.de/hgb/__242.html).
---

## D-0119 – Nichtsteuerliche Korrekturen nach Abschluss im Folgejahr

Status: APPROVED (Nutzerentscheidung für V1; in V2 neu zu bewerten)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0115 bis D-0118 / CP-0147

Wird ein nichtsteuerlicher Buchungsfehler erst nach dem Jahresabschluss erkannt, wird die Korrektur in V1 im neuen Steuerjahr erfasst: Der Vorsteuer-Simulationssaldo wird gutgeschrieben und der Umsatzsteuer-Simulationssaldo neu belastet. Dies ändert die abgeschlossene Vorjahresperiode nicht. Die Regel ist in V2 neu zu bewerten. Sie ersetzt nicht D-0115/D-0116: Erkennt ein Ereignis einen Fehler in einer bereits abgegebenen SimTAX-Erklärung, sind die dort dokumentierten Voraussetzungen und die unverzügliche Anzeige/Berichtigung nach § 153 AO separat einzuhalten.

Rechtsabgrenzung für die unveränderte Nachvollziehbarkeit von Buchungen: [§ 146 Abs. 4 AO](https://www.gesetze-im-internet.de/ao_1977/__146.html). Die Folgejahresbehandlung ist die Produktregel des Nutzers, keine allgemeine Rechtsregel.
---

## D-0114 – Keine Vorsteuer-Ausnahmen oder anteiligen Abzüge in V1

Status: APPROVED (Nutzerentscheidung; Behandlung bleibt außerhalb des V1-Umfangs)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-26
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0113 / CP-0142

V1 simuliert keine Vorsteuer-Sonderfälle, Ausschlüsse oder anteiligen Abzüge. Die in D-0113 genannten Voraussetzungen bilden den vereinfachten V1-Filter; Fälle mit nur teilweiser oder ausgeschlossener Abzugsfähigkeit liegen außerhalb von V1. Dies ist eine Scope-Entscheidung und keine Aussage, dass die realen Einschränkungen nach § 15 UStG nicht gelten.

Quelle zur rechtlichen Abgrenzung: [§ 15 UStG](https://www.gesetze-im-internet.de/ustg_1980/__15.html).
---

## D-0120 – Kundeneingänge vor eigenen Auszahlungen am selben Simulationstag

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0021 / D-0110 / CP-0155 / CP-0160

Wenn am selben wirksamen Simulationstag Kundeneingänge und eigene fällige Rechnungen zusammentreffen, werden in V1 zuerst alle fälligen Kundeneingänge vollständig und ohne eigenes Cash-Gate gebucht. Danach werden die eigenen fälligen Vollzahlungsversuche in der vom Spieler bestimmten Reihenfolge mit Liquiditätsprüfung ausgeführt. Kundeneingänge können dadurch die für eigene Zahlungen verfügbare Liquidität am selben Tag erhöhen. Die Regel verändert weder Fälligkeitstage noch die bestätigten Retry-/Mahnfolgen.

Dies ist eine deterministische Produktkonvention für V1. BGB §§ 675s, 675t und 675n sowie EPC-SCT-Regeln legen keine allgemeine Reihenfolge solcher unabhängigen taggleichen Kontovorgänge fest. Recherche: [A08-Recherche](a08-same-day-zahlungsreihenfolge-recherche.md).

---

## D-0121 – Erster tatsächlicher Zahlungstermin des Maschinendarlehens

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0033 / CP-0160

Die erste tatsächliche monatliche Annuitätenzahlung ist am 29.01.2027 fällig. Danach gilt der letzte Arbeitstag jedes Monats. Bei sieben Jahren Restlaufzeit und monatlicher Zahlung umfasst der Plan 84 Monatsraten bis Dezember 2033. Die Rate ist durch die spätere Nutzerentscheidung D-0122 festgelegt.

---

## D-0122 – Monatliche Annuitätenrate des Maschinendarlehens

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030 bis D-0041 / D-0121 / CP-0161

Für die konstante monatliche Maschinenrate wird der nominale Jahreszins durch zwölf geteilt. Bei 24.000 € Hauptschuld, 84 Monatsraten und 5 % / 12 Periodenzins beträgt die regelmäßige Annuität **339,21 €**. Für die Ratenrechnung wird jede Monatsrate als eine volle Monatsperiode (30/360 = 1/12) behandelt; ein gesonderter kurzer Eröffnungszinszeitraum wird nicht angesetzt und eine Wochenendverschiebung verändert den Monatsfaktor nicht. Monatliche Zinsanteile werden auf Cent gerundet und die Schlussrate gleicht den dadurch verbleibenden Rundungsrest aus. Die ersten 83 Raten betragen 339,21 €, die 84. Schlussrate 339,57 €. Fälligkeit und Zins-/Tilgungsaufteilung folgen D-0033 bis D-0041; erste Fälligkeit 29.01.2027 gemäß D-0121.

---

## D-0123 – Quartalsweise Anpassung des Dispositionskredit-Höchstbetrags

Status: APPROVED (Nutzerentscheidung; Berechnungsstichtag und Wirksamkeitszeitpunkt durch D-0124 präzisiert)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0021 bis D-0023 / CP-0163

Der Höchstbetrag des Dispositionskredits beträgt 10 % der Bilanzsumme und wird einmal pro Quartal aktualisiert. D-0124 präzisiert die Bilanzsumme zum Ende des Vorquartals als Berechnungsbasis und den ersten Tag des Folgequartals als Wirksamkeitsbeginn. Der nicht gezogene Kreditrahmen ist kein Zahlungsmittel und keine zusätzliche Passivposition; tatsächlich gezogene Beträge erhöhen Liquidität und Darlehensverbindlichkeit. Ziehungsentscheidung, Zinsanfall/-buchung und Rückführungsreihenfolge bleiben offen. Diese Festlegung ist eine Produktregel, keine allgemeine gesetzliche Kreditrahmenvorgabe.

---

## D-0124 – Stichtag und Wirksamkeit der quartalsweisen Kreditrahmenberechnung

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0123 / CP-0165

Der Höchstbetrag von 10 % der Bilanzsumme wird anhand der Bilanzsumme zum Ende des Vorquartals berechnet und gilt ab dem ersten Tag des folgenden Kalenderquartals. Für den Simulationsstart am 01.01.2027 wird mangels eines vorangegangenen Simulationsquartals die Eröffnungsbilanzsumme zum 01.01.2027 als Ausgangsbasis verwendet. Bei 55.300 € Bilanzsumme ergibt das für den Start einen Höchstbetrag von 5.530 €. Diese Berechnung ändert nicht die 30.000 € Eröffnungsliquidität oder den separaten 20.000-€-Restfinanzierungsrahmen. Ziehungs- und Rückführungsregeln bleiben offen.

---

## D-0125 – Manuelle Dispositionskreditziehung zur Deckung eines Zahlungsfehlbetrags

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0021 / D-0123/24 / CP-0168

Reicht die verfügbare Liquidität am Fälligkeitstag nicht für eine eigene fällige Vollzahlung, kann der Spieler manuell eine Dispositionskreditziehung in Höhe genau des Fehlbetrags wählen. Die Ziehung ist nur möglich, wenn der Fehlbetrag den noch freien Kreditrahmen nicht überschreitet. Bei ausreichendem Rahmen erhöht die Ziehung die Liquidität und die Darlehensverbindlichkeit um denselben Betrag; anschließend wird die Rechnung vollständig bezahlt. Es gibt keinen automatischen Draw. Lehnt der Spieler ab oder reicht der freie Kreditrahmen nicht aus, scheitert der Vollzahlungsversuch vollständig; Teilzahlung und negative Liquidität bleiben ausgeschlossen. Zinszeitpunkt/-periodik und Rückführung bleiben offen.

---

## D-0126 – Automatische Rückführung des Dispositionskredits aus Kundeneingängen

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0110 / D-0120 / D-0123 bis D-0125 / CP-0171

Geht eine Kundenzahlung ein, wird eine bestehende gezogene Dispositionskreditschuld automatisch zuerst zurückgeführt. Die Rückführung entspricht höchstens dem niedrigeren Betrag aus Kundeneingang und offener Disposchuld. Ein danach verbleibender Betrag steht als freie Liquidität zur Verfügung. Die Rückführung vermindert Zahlungsmittel und Dispositionskreditverbindlichkeit; die Kundenzahlung vermindert zugleich die Forderung. Diese Tilgung erfolgt vor den eigenen Zahlungsversuchen desselben wirksamen Simulationstags gemäß D-0120. Andere Zahlungseingänge sind von dieser Entscheidung nicht erfasst. Zinszeitpunkt/-periodik und die Rückführung außerhalb von Kundeneingängen bleiben offen.

---

## D-0127 – Tägliche Berechnung und monatliche Belastung des Dispositionszinses

Status: APPROVED (Nutzerentscheidung)
Quelle: Nutzerantwort im A01-Entscheidungsdialog vom 2026-10-27
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0123 bis D-0126 / CP-0174

Der Dispositionszins wird täglich berechnet und am Monatsende einmalig als Sammelposten belastet. Zusammen mit D-0126 gilt: Kundeneingänge reduzieren zuerst die gezogene Disposchuld; der für jeden Tag maßgebliche gezogene Saldo ist die Grundlage der täglichen Berechnung. Tageszählbasis, Rundungszeitpunkt, exakte Reihenfolge der Zinsbuchung gegenüber anderen Finanzereignissen am Monatsende sowie Rückführung aus anderen Eingangstypen bleiben offen. Es wird kein Zinssatz ergänzt.

---

## D-0128 – V1-Anfangsbestand und marktbezogene Materialpreis-Basis

Status: APPROVED (Nutzerentscheidung für den V1-Szenariostart)
Quelle: Nutzerauftrag vom 2026-10-27: Anfangsvorräte für die ersten drei Aufträge festlegen und Preise nach aktuellen Marktpreisen als Basisstand fixieren.
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0090 bis D-0096 / D-0123/24 / CP-0180

Für V1 bleiben 2.000 kg Stahl gemäß D-0090 erhalten. Aluminium wird auf 100 kg und Norm-/Zukaufteile werden auf 60 Stück gesetzt. Die drei Startaufträge benötigen zusammen 172 kg Stahl, 90 kg Aluminium und 56 Stück; nach vollständigem Materialverbrauch verbleiben 1.828 kg, 10 kg und 4 Stück.

Die Preisbasis zum 27.10.2026 lautet: S235JR-Rundstahl blank 1,63 €/kg netto, Aluminium EN AW-5754 H111 3 mm 9,20 €/kg netto, Schraube DIN 933, Festigkeit 10.9, M10 × 30 mm 0,57 €/Stück netto (Preisstaffel 1–99 Stück). Quellen, Abrufdatum und Abgrenzungen sind in [Materialpreis-Basisstand](../market-data/material-price-baseline-2026-10-27.md) dokumentiert. Diese Händlerreferenzpreise sind feste V1-Startwerte, keine verbindlichen Angebote oder historischen Belege; das bestehende 2-%-Jahrespreismodell gilt ab 2028 weiter.

Für den spielbaren V1-Eröffnungsbestand wird daraus ein Gesamtwert von 4.214,20 € angesetzt. Damit werden der frühere V1-Gesamtposten von 12.800 € und der Bezug des Stahlwerts auf einen bereitgestellten Vorjahresschluss für diesen Prototyp ersetzt; D-0090s Stahlmenge von 2.000 kg bleibt bestehen. Die sonstigen Eröffnungssalden bleiben unverändert, daher betragen Bilanzsumme und Eigenkapital-Restposition 46.714,20 € bzw. 15.214,20 €. Der Dispo-Höchstbetrag zum Start beträgt nach D-0123/24 folglich 4.671,42 € (10 % der neuen Eröffnungsbilanzsumme). Bank 30.000 €, Lieferantenverbindlichkeiten 7.500 €, Maschinendarlehen 24.000 € und der außerhalb der Bilanz geführte Restbudgetrahmen 20.000 € ändern sich nicht.

Diese aktuelle Händlerpreis-Basis ist eine ausdrückliche Spielvereinfachung und keine bestätigte HGB-Anschaffungskostenbewertung. Der Prototyp darf daraus keine reale oder prüfungsfähige Handelsbilanz ableiten.

## D-0129 – Deterministische Ereignis- und Periodenzuordnung für V1

Status: APPROVED (A01-V1-Modellkonvention unter dem ausdrücklichen Nutzerauftrag, offene Entscheidungen für die spielbare V1 selbst zu lösen)
Quelle: Nutzerauftrag vom 2026-10-27, nicht eindeutig geklärte V1-Entscheidungen eigenständig und wahrscheinlichkeitsbasiert festzulegen
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0011 / D-0120 bis D-0128 / CP-0182

Am selben wirksamen Simulationstag werden zuerst Kundeneingänge verarbeitet und bestehende Disposchuld daraus gemäß D-0126 zurückgeführt. Danach wird die vertragliche Maschinenrate versucht; anschließend folgen eigene Lieferanten- und sonstige fällige Verbindlichkeiten in der Spielerreihenfolge. Für jeden eigenen Zahlungsvorgang gilt Vollzahlung mit Liquiditäts-Gate und gegebenenfalls manuellem Dispoabruf gemäß D-0125. Der Zahlungsstatus wird vor an diesem Tag fälliger Erinnerung/Mahnung aktualisiert; eine Mahnung wird nicht ausgelöst, wenn der Posten an diesem Tag vollständig bezahlt wurde. Bei der Maschinenverwertung zählen drei verschiedene fällige Monatsraten, die nach den vorgesehenen Versuchen unbezahlt bleiben (D-0042/43).

Ein nach Wochenendverschiebung wirksames Ereignis gehört zum Monat und Geschäftsjahr seines tatsächlichen Simulationsdatums, auch wenn das geplante Datum im Vormonat lag. Der Dispozins wird täglich auf dem tatsächlich gezogenen Saldo nach Actual/365 berechnet, ohne tägliche Rundung; die Summe des Monats wird einmalig auf Cent gerundet und als Monatssammelposten gebucht. Dies ist eine vereinfachte V1-Konvention; sie behauptet keine universelle Bankbuchungspraxis und ändert weder die rechtlichen Fälligkeiten noch die bestätigten Zahlungsziele.

Für die spielbare V1 wird SimTAX als eigener, fest terminierter Simulationsposten nach den priorisierten betrieblichen Verbindlichkeiten versucht. Der Spieler kann diesen Steuerposten nicht in der Lieferantenreihenfolge umsortieren. Das setzt weder eine echte steuerrechtliche Vollberechnung noch eine allgemeine gesetzliche Rangfolge aller Gläubiger um.

---

## D-0130 – Vertragswerte nach Angebotsannahme fixieren

Status: APPROVED (V1-Produktkonvention aus Nutzer-Playtestauftrag)
Bezug: MG-001 / SLG-001.1 / T-0022 / CP-0190

Preis und Zahlungsziel werden bei Annahme eines Angebots in den Auftragsdaten fixiert. Die Oberfläche erlaubt nach Annahme keine einseitige Änderung; eine spätere Vertragsänderung durch beiderseitige Vereinbarung wird in V1 nicht modelliert. Der kundenspezifische CNC-Fertigungsauftrag wird im Spiel als Werklieferungsvertrag nach § 650 BGB behandelt, für den grundsätzlich Kaufrecht gilt. Die Einordnung hängt im Einzelfall von Vertragsgegenstand und Vereinbarung ab. Die automatische Abnahme nach fünf Arbeitstagen ist eine Spielregel und keine pauschale Rechtsaussage zur Abnahme nach § 640 BGB.

## D-0131 – Standortwechsel als einzige Flächenänderung

Status: APPROVED (V1-Szenariokonvention aus Nutzer-Playtestauftrag)
Bezug: MG-001 / SLG-001.1 / T-0022 / CP-0190

Lager-, Büro-, Personal- und Werkstattflächen sowie Maschinenplätze sind an ein Gebäude gebunden und können nur durch Umzug in ein anderes Miet- oder Kaufobjekt geändert werden. Kaufpreise, Mieten und Gebäudegrößen sind illustrative Szenariowerte und keine aktuellen Immobilienangebote. Ein gekaufter Standort wird in V1 zum angesetzten Kaufwert bilanziert und bei Umzug zum selben Szenariobuchwert verkauft; Abschreibung, Nebenkosten, Finanzierung und rechtliche Gebäudeprüfung sind nicht simuliert.

## D-0132 – Ausbildungsplatz erfordert ausbildungsgeeignete Person

Status: APPROVED (V1-Szenariokonvention aus Nutzer-Playtestauftrag)
Bezug: MG-001 / SLG-001.1 / T-0022 / CP-0190

Ein Ausbildungsplatz kann erst besetzt werden, wenn eine beschäftigte Person die Weiterbildung „Ausbildereignung (AEVO)“ abgeschlossen hat und am Standort Kapazität besteht. Dies ist der V1-Nachweis für die im Spiel vorausgesetzte Eignung, keine vollständige Abbildung der gesetzlichen Ausnahmen und Eignungstatbestände. Maßgeblich sind BBiG §§ 27–30. Vorhandene Beschäftigte gelten im Startprofil als ausgebildete Fachkräfte und erhalten Weiterbildung; ein Ausbildungsverhältnis erzeugt erst nach Abschluss eine zusätzliche Fachkraft.

## D-0133 – Urlaub geplant versus tatsächlich genommen

Status: APPROVED (V1-Korrektur nach Nutzer-Playtest)
Bezug: MG-001 / SLG-001.1 / T-0022 / CP-0190

Vorgemerkte Urlaubstage werden erst am jeweiligen Arbeitstag als tatsächlich genommen gezählt. Jahreskontingent, Statistik und Personalverfügbarkeit unterscheiden damit Planung und tatsächlichen Verbrauch. Die V1-Planannahme beträgt 20 Arbeitstage pro Jahr bei Fünf-Tage-Woche, entsprechend mindestens 24 Werktagen bei gesetzlicher Sechs-Tage-Umrechnung gemäß BUrlG § 3.

## D-0134 – Feiertagskalender für den rechtsorientierten V1-Prototyp

Status: APPROVED (V1-Prototypkonvention unter dem ausdrücklichen Nutzerauftrag, Feiertage und geltendes Recht für den spielbaren Jahreslauf zu berücksichtigen)
Bezug: MG-001 / SLG-001.1 / T-0023 / CP-0178/0179 / D-0011

D-0011 bleibt als ursprüngliche Kernregel unverändert: Feiertage waren dort mangels Standortkalender unberücksichtigt. Für den später ausdrücklich beauftragten V1-Prototyp gilt vorsorglich die Vereinigungsmenge der im Code hinterlegten gesetzlichen Feiertage deutscher Länder als arbeitsfrei und als einheitliche Spielkalenderbasis für Simulationstag-Verschiebungen. Mangels konkretem Betriebsort ist dies eine konservative V1-Konvention, kein standortspezifischer Rechtsbefund und keine Aussage zum tatsächlich maßgeblichen Feiertagsort. Arbeitszeit an Sonn- und gesetzlichen Feiertagen ist nach ArbZG § 9 grundsätzlich untersagt, soweit keine gesetzliche Ausnahme greift; der Prototyp plant deshalb an den hinterlegten Feiertagen keine Beschäftigten ein. Tatsächliche gesetzliche oder vertragliche Fristenden bleiben vom einschlägigen Ort und der konkreten Regel abhängig; BGB § 193 und für steuerliche Fristen AO § 108 gelten jeweils in ihrem Anwendungsbereich. Die einheitliche Kalenderfunktion ist allein eine V1-Spielvereinfachung. Die Fünf-Arbeitstage-Abnahme bleibt ausdrücklich eine V1-Spielregel, keine allgemeine Rechtsfolge.

Quellen: [ArbZG § 9](https://www.gesetze-im-internet.de/arbzg/__9.html), [BGB § 193](https://www.gesetze-im-internet.de/bgb/__193.html), [AO § 108](https://www.gesetze-im-internet.de/ao_1977/__108.html).


## D-0135 – Fest verhandelte Zeitarbeitskonditionen

Status: APPROVED (V1-Modellkonvention aus Nutzeranforderung; Preisstufen als Szenariowerte)
Quelle: Nutzeranforderung vom 2026-10-27
Bezug: MG-001 / SLG-001.1 / T-0025

Vor dem ersten Zeitarbeitseinsatz wird ein fester Agenturvertrag gewählt. Der Vertrag enthält einen Grundpreis je Monat mit mindestens einer Buchung und einen Preis je gebuchter Arbeitsstunde. V1 bietet drei illustrative Verhandlungspakete: Flexibel (0 € Grundpreis/Monat, 55 €/h), Ausgewogen (120 €/Monat, 43 €/h) und Hohe Auslastung (300 €/Monat, 31 €/h). Damit sinkt der Stundenpreis mit steigendem Grundpreis; der Grundpreis wird im Nutzungsmonat einmalig berechnet. Einmal vereinbarte Konditionen bleiben fest und werden in jeder Einsatzbuchung gespeichert. Die Beträge sind Spielangebote, keine aktuellen Marktpreise oder rechtliche Tarifaussagen. Bestehende Spielstände ohne Agenturvertrag behalten ihre bisherige V1-Kondition von 45 €/h ohne Grundpreis.


## D-0136 – Selektive Konkurrenzangebote und Zuschlagsentscheidung

Status: APPROVED (V1-Modellkonvention zur Umsetzung der Nutzeranforderung)
Quelle: Nutzeranforderung vom 2026-10-27
Bezug: MG-001 / SLG-001.1 / T-0026 / CP-0195

Historischer Stand zu CP-0195, vor D-0137: Je Monat wurde eine synthetische Kundenanfrage ausgewertet. D-0137 ersetzt diese Frequenz durch eine wöchentliche Anfrage am ersten Arbeitstag der Woche. Im aktuellen V1-Stand hängt die Einladung deterministisch von Ruf, fortgeschriebenem relativem Preisprofil und Kapazitätsbelastung ab. Pro Anfrage werden nur ein oder zwei der drei Wettbewerber als Bieter ausgewählt; Auswahl und Quote sind reproduzierbar. Der Vergleich zeigt Netto-Angebot, Reputation und modellierte Lieferzeit. Nach Einreichung des eigenen Preises gewinnt die höchste gewichtete Kombination aus Reputation und Preisvorteil; eine Kundenbindungs-Komponente fließt ergänzend in den Spielerscore ein. Der gewählte eigene Preis wird in das künftige Einladungspreisprofil übernommen.

Die V1-Formel ist deterministisch: Einladungswahrscheinlichkeit = auf 18–92 % begrenzter Wert aus 50 + 0,7 × (eigener Ruf − durchschnittliche Konkurrenzqualität) + 35 × (durchschnittlicher Konkurrenzpreisindex − eigener Preisindex) − Kapazitätsabzug 9 bei mehr als fünf aktiven generierten, noch nicht ausgelieferten Aufträgen. Der Wettbewerber-Score lautet 0,3 × Reputation + 70 / Preisindex, zuzüglich reproduzierbarer Beteiligungsstreuung bis 5 Punkte; Gebote liegen um bis zu ±4 % um den jeweiligen Preisindex. Der Zuschlags-Score des Spielers lautet 0,3 × Ruf + 70 / eigenem relativen Angebotspreisindex + 0,1 × Kundenbeziehung; bei Wettbewerbern entfällt der nur für den eigenen Betrieb verfügbare Beziehungsbonus. Nach einem eigenen Gebot wird der Preisindex als 80 % vorheriger Index + 20 % neues Verhältnis aus Angebotspreis und Referenzpreis fortgeschrieben und auf 0,75–1,35 begrenzt. Diese Formeln und Spannen sind ausschließlich Spielmechanik. Die fiktiven Wettbewerberwerte sind weder reale Firmenangebote noch repräsentative Branchen- oder Marktdaten. Keine externe Rechts- oder Preisbehauptung wird damit getroffen.


## D-0137 – Wöchentlicher Marktanfragerhythmus

Status: APPROVED (V1-Modellkonvention zur Umsetzung des Nutzerfeedbacks)
Quelle: Nutzeranforderung vom 2026-10-27
Bezug: MG-001 / SLG-001.1 / T-0027 / CP-0196; ergänzt D-0136

Die bisher monatliche Verteilung wird auf eine Kundenanfrage pro Simulationswoche erhöht. Die Anfrage geht am ersten Arbeitstag der Woche in den Marktfluss. Die Auswahl des Betriebs und der ein bis zwei Konkurrenzbieter sowie der Zuschlag richten sich weiter nach D-0136. Bei mehr als fünf aktiven generierten, noch nicht ausgelieferten Aufträgen wirkt weiterhin der dokumentierte Kapazitätsabzug auf die Einladung; der Wochenrhythmus erzeugt daher mehr Auswahl, aber keine uneingeschränkte Auftragsannahme. Es ist eine V1-Szenarioannahme, keine Marktprognose.



## D-0138 – Kundenbindung als stärkerer Zuschlagsfaktor kalibrieren

Status: APPROVED (A01-V1-Kalibrierung als Reaktion auf den Jahres-Smoke; keine neue Nutzerentscheidung)
Bezug: MG-001 / SLG-001.1 / T-0027 / CP-0196; ergänzt D-0136

Der Zuschlags-Score des eigenen Betriebs verwendet 0,2 × Kundenbeziehung statt 0,1 × gemäß der ursprünglichen D-0136-Implementierung. Motivation: Bei normalen, kostenbasierten Angebotspreisen verlor der Betrieb im integrierten Jahreslauf sämtliche 25 erhaltenen Angebote, obwohl isolierte Marktregressionen funktionierten. Die höhere Gewichtung lässt bestehende Kundenbindung als Wettbewerbsvorteil wirken, ohne kostendeckende Preise pauschal unter den Referenzpreis zu drücken. Konkurrenzscores bleiben unverändert. Die Kalibrierung ist eine V1-Szenarioannahme und keine empirisch bestimmte Marktwirkung.

## D-0139 – Lernfallfolgen vom aktiven Unternehmenskonto trennen

Status: APPROVED (A01-V2-Umsetzungskonvention unter der delegierten Entscheidungsbefugnis des Nutzers; 2026-10-28)
Quelle: Nutzerauftrag zur Erstellung von Multiple-Choice-Ereignissen mit Unternehmensauswirkungen; Konkretisierung durch A01 nach Agentenreview
Bezug: MG-002 / SLG-002.3 / SLG-002.4 / T-0032

Die 450 Lernfälle stellen eigenständige, originäre Unternehmenssituationen dar. Antwortfeedback erklärt die plausiblen Auswirkungen der gewählten Handlungsoption auf das Fallunternehmen (z. B. Kosten, Liquidität, Lieferfähigkeit, Absatz, Risiko oder Zusammenarbeit). Die Antwort verändert den produktiven Jahres-Spielstand und dessen Accounting-/Ledger-State nicht. Eine spätere Überführung von Lernfällen in aktive Spielereignisse mit dauerhaften Auswirkungen benötigt einen eigenen Simulationsauftrag, kontrollierte Engine-Commands, Fachreview und Regressionsabdeckung. Diese Trennung ist eine V2-Konvention, keine allgemeine didaktische oder rechtliche Regel.
## D-0140 – Marketingkampagnen und Lieferantenpräferenz als V1-Szenariomechanik

Status: APPROVED (A01-Szenariokonvention unter delegiertem Nutzerauftrag; 2026-10-28)
Quelle: Nutzerauftrag, MG-002 / T-0031; fachlicher Cross-Review A11/A09

Die Simulation bietet zwei einmalige Kampagnen als illustrative Optionen: „Gezielte Kundenansprache“ kostet 650 € und erhöht die Einladungswahrscheinlichkeit der nächsten Marktchance um 8 Prozentpunkte; „Fachmesse und Direktvertrieb“ kostet 1.100 € und erhöht sie um 14 Prozentpunkte. Die Chance ist auf höchstens 96 % gedeckelt. Eine Kampagne wird bei der nächsten Marktchance verbraucht, auch wenn daraus keine Einladung entsteht. Kosten werden einmalig durch Finance als Cash-Ausgabe oder offene Betriebskosten erfasst und im Monatsabschluss als Marketingaufwand gezeigt. Die Werte sind keine empirischen Werbewirkungen, realen Marktpreise oder Rechtsvorgaben.

Der Spieler kann je Material einen geeigneten bevorzugten Lieferanten einstellen. Die Präferenz wirkt nur auf neue Fehlbestandsbestellungen und lässt bereits ausgelöste Bestellungen unverändert. Modellierte Lieferzeit, Lieferzuverlässigkeitsaufschlag und Szenariopreise bleiben maßgeblich; individuelle, reale Lieferantenangebote werden nicht behauptet. Der Mechanismus ist eine transparente Spielannahme.

## D-0141 – Agenturpersonalpools und spielwirksame Tageslernfragen

Status: APPROVED (A01-Umsetzung unter dem ausdrücklichen Playtestauftrag; 2026-10-28)
Quelle: Nutzeranforderung, MG-002 / T-0034

Zeitarbeitskräfte werden aus einem festen, fiktiven Personalpool der vereinbarten Agentur gebucht. Die Buchung wählt Qualifikation, Kopfzahl und Dauer: ein Arbeitstag, fünf Arbeitstage oder 20 Arbeitstage. Maßgeblich sind Simulationsarbeitstage einschließlich des im Spiel verwendeten Feiertagskalenders; liegt das Simulationsdatum arbeitsfrei, beginnt die Buchung am nächsten Arbeitstag. Vor Annahme prüft das Spiel passende verfügbare Poolmitglieder und die Arbeitsplatzkapazität für jeden gebuchten Tag. Die Personen erscheinen in der gewöhnlichen Personalplanung und werden dort Aufträgen zugewiesen; die Buchung selbst bindet sie an keinen Auftrag. Agenturprofile, Fähigkeiten, Motivation und Preise sind Modellannahmen, keine echten Agenturangebote oder arbeitsrechtliche Freigabe.

Beschäftigte und Poolkräfte erhalten je einen aktuellen Kompetenzstand und ein individuelles Entwicklungslimit für Fach-, Methoden-, Sozial- und Individualkompetenz. Maschinen- und Ausbilderqualifikationen werden getrennt als Berechtigungsmerkmale geführt. Weiterbildung und richtige Lernantworten dürfen Kompetenzstände nicht über das Entwicklungslimit erhöhen. Die Arbeitsleistung reagiert begrenzt und deterministisch auf Kompetenz und Motivation.

Auf der Übersichtsseite können pro Simulationsdatum höchstens fünf Multiple-Choice-Antworten abgegeben werden. Richtige und falsche Antworten lösen kleine sichtbare Änderungen an Ruf, Mitarbeiterkompetenz oder Motivation aus; sie erzeugen keine direkten Finanz-, Steuer- oder Ledgerbuchungen. Diese V2-Spielmechanik ersetzt für die aktive tägliche Frage den älteren Nichtmutationsgrundsatz aus D-0139; D-0139 bleibt für die separaten Lernfall-Erklärungen und Prüfungsbibliothek im Übrigen bestehen. Wirkungen sind didaktische Szenarioheuristiken, keine psychometrische oder empirische Aussage.

## D-0142 – V2-Neustartprofil, Marktberichte und BAB

Status: APPROVED (A01-Umsetzungskonvention unter dem ausdrücklichen Nutzerauftrag; 2026-10-28)
Quelle: Nutzerauftrag, MG-002 / SLG-002.2 / T-0035

Neue Spielstände beginnen im Szenariojahr 2019 als Einpersonen-Einzelunternehmen (Kleingewerbe-Szenario), mit 10.000 € Bankbestand, leerem Lager, gemieteter Münchner Garage, Werkbank und Baumarkt-Handwerkzeug. Bestehende Spielstände behalten ihr jeweiliges Startprofil. Die 2019er Preise, Flächen, Nachfrage, Mieten, Lebenshaltungskosten und Gründungsaufwände sind Modellannahmen und keine historischen Angebote oder Steuerberatung. Eine GmbH benötigt im Spiel 25.000 € Stammkapital, davon mindestens 12.500 € eingezahlt, zuzüglich einer modellierten Gründungsgebühr; eine UG benötigt voll eingezahltes Kapital und eine modellierte Gründungsgebühr. Die gesetzlichen UG-Rücklagen sind als Spielanforderung zu berücksichtigen, nicht als frei verfügbares Geld. Die Anzeige verwendet den Begriff Kleingewerbe nur als Unternehmensszenario; dies ist keine eigene Gesellschaftsform.

An jedem ersten Arbeitstag der Woche werden im V2-Profil drei Marktchancen erzeugt. Einladung und Loswahrscheinlichkeit reagieren auf Unternehmensruf, Preisposition und Kapazität. Ein Teil der Chancen wird absichtlich deutlich unter den modellierten Kosten angeboten, damit Deckungsbeiträge aktiv beurteilt werden müssen. Einzelpreise von Konkurrenzangeboten werden nicht offengelegt. Das Postfach enthält Monatsberichte mit dem Mittelwert aller drei Konkurrenzprofile sowie einer modellierten Spanne für kleine, mittlere und große Aufträge. Diese Wettbewerbswerte sind Szenarioheuristiken.

Standortwahl zeigt zehn Mietobjekte und zehn separate Kaufobjekte auf einer schematischen München-Umlandkarte. Kauf, Kreditverhandlung und Grundschuldszenario sind getrennte Abläufe. Maschinenmiete benötigt passende Flächen und Fachqualifikation; Standort-, Lieferanten-, Personal-, Markt- und BAB-Wirkungen sind dynamische Spielmodelle. Der BAB wird aus gebuchten Monatskosten, tatsächlichen Raum-/Maschinenanteilen und protokollierten Arbeits-/Maschinenstunden abgeleitet. Privatentnahmen werden als Entnahme und nicht als betrieblicher Aufwand behandelt. Diese Regeln sind weder ein prüfungsfähiger Abschluss noch eine Rechts-/Steuer- oder Marktauskunft.
## D-0143 – V2-Anfragekalender, Angebotsantwort und Werkzeugbestand

Status: APPROVED (A01-Umsetzungskonvention unter dem ausdrücklichen Nutzerauftrag; 2026-10-28)
Quelle: Nutzeranforderung, MG-002 / T-0036

Im 2019er V2-Profil entstehen Kundenanfragen an drei innerhalb der fünf Arbeitstage je Woche rotierenden Werktagen. Wochenenden und im Spiel geführte Feiertage erzeugen keine Anfragen. Die Rotation macht Eingangstage planbar und verhindert einen festen wöchentlichen Bündelungstag. Unbeantwortete Anfragen sind drei bis fünf Kalendertage verfügbar; die Dauer ist pro generierter Anfrage reproduzierbar festgelegt. Nach Einreichung eines Nettoangebots und Zahlungsziels wartet der Kunde ein bis drei Kalendertage. Der spätere Ausgang wird bis zum Entscheidungstag nicht vorweggenommen oder als Vertrag verbucht. Die Preis-/Rufbewertung bleibt Szenariomodell; Einzelpreise der Konkurrenz werden nicht offengelegt. Der Legacy-/2027-Ablauf bleibt bei sofortiger Entscheidung.

Generierte Fertigungsaufträge zeigen erforderliche Fähigkeiten. CNC zählt nur dann als verfügbar, wenn eine Person sowohl CNC-Kompetenz als auch die für CNC-01 geführte Maschinenberechtigung hat. Fehlende Anforderungen werden rot ausgewiesen. Das Datum in der Oberfläche wird gelb hervorgehoben, wenn der Reststundenbedarf offener Produktionsaufträge die verfügbare Tageskapazität aus einsatzfähigem Stammpersonal und heutigen Zeitarbeitsstunden übersteigt. Das ist ein grober Arbeitslastindikator, keine garantierte Terminprognose.

Der Baumarkt bleibt für fehlmengenbedingte Material-Notbeschaffung verfügbar und kann je Material als bevorzugter Lieferant gesetzt werden. Zusätzlich werden dort drei fiktive Werkzeuge tageweise vermietet. Mietkosten werden als Betriebskosten erfasst; die Rückgabe erfolgt zum gespeicherten Arbeitstag. Der Inventarreiter unterscheidet tatsächlich geführte Materialbestände, Arbeitsmittel und Maschinen; Computer ohne Anfangsbestand werden als nicht vorhanden ausgewiesen. Fristen, Preise, Materialien und Leihkonditionen sind Spielannahmen, keine realen Händlerangebote.
## D-0144 – Auftragsgebundener Werkzeugverleih und Maschinenskills

Status: APPROVED (A01-Umsetzungskonvention unter dem ausdrücklichen Nutzerauftrag; 2026-10-28)
Quelle: Nutzeranforderung, MG-002 / T-0037

Die Baumarkt-Werkzeugauswahl ist auf Spezialwerkzeuge begrenzt, die ein angenommener, noch offener Auftrag im aktuellen Profil verlangt. Der Katalog zeigt diese Werkzeuge nur dann an, wenn der Bedarf besteht. Eine Buchung umfasst genau ein Gerät; das Zahlenfeld bestimmt ausschließlich die Mietdauer in Arbeitstagen. Der Arbeitsgang kann an einem Tag ohne gemietetes, verfügbares Werkzeug nicht fortschreiten. Mietpreis und Gerätekatalog sind Spielannahmen.

Mietmaschinen führen die benötigten Fachskills und Maschinenberechtigungen als Daten. Die Inventaransicht zeigt beide Anforderungen an. Die CNC-Produktion verlangt im Modell CNC-Kompetenz und CNC-01-Berechtigung. Das Logo in der Kopfzeile führt jederzeit zur Übersichtsansicht.
## D-0145 – Lagerbelegung, Beschaffungsvorlauf und Versandfertigwaren

Status: APPROVED (A01-Umsetzungskonvention unter dem ausdrücklichen Nutzerauftrag; 2026-10-28)
Quelle: Nutzeranforderung, MG-002 / T-0038

Rohmaterial und Fertigware belegen gemeinsam die verfügbare Lagerfläche. Dashboard und Inventar zeigen belegte sowie maximale Kapazität in m²; im Lager werden Stahl, Aluminium und Zukaufteile einzeln geführt. Fertigware bleibt nach Produktionsabschluss als V2-Status `VERSANDBEREIT` eingelagert. Erst die Aktion „Auftrag aus Lager versenden“ setzt das Versanddatum, gibt Fertigwarenfläche frei und startet die Abnahmefrist. Eine Fertigung, die den verbleibenden Platz überschreiten würde, wartet. Ein überfülltes Lager verzögert angelieferte Bestellungen, bis Fläche frei wird.

Das V2-Lieferantenmodell unterscheidet lokale Baumarkt-Sofortversorgung und Onlinebestellung. Der Baumarkt ist teurer, hat null Lieferzeit und endliche Materialbestände. Onlinebestellungen nutzen Mindestmengen, mehrtägige Werktags-Lieferzeiten, feste Versandkosten je Materialposition und ein reproduzierbares Verzögerungsrisiko. Ist Baumarktbestand erschöpft, wird der Rest online bezogen. Die Bestell-/Liefer-/Versandwerte sind Spielheuristiken und keine realen Händlerangebote oder Marktpreisbehauptungen. Der Legacy-Spielpfad behält seinen bisherigen automatischen Versand.

## D-0146 – Profilabhängige Preisfortschreibung und quartalsweise Dispo-Basis

Status: APPROVED (A01-Korrektur zur Umsetzung bestehender Produktentscheidungen; 2026-10-28)
Quelle: Cross-Agent-Review zu T-0039; D-0123, D-0124, D-0128 und D-0142

Für das V2-Startprofil 2019 beginnt die modellierte jährliche Preisfortschreibung im Januar 2020. Für das Legacy-V1-Startprofil 2027 bleibt das bestätigte Preisniveau im Startjahr unverändert; die Fortschreibung beginnt im Januar 2028. Das übernimmt bestehende, profilgebundene Annahmen und ist keine Marktprognose.

Das quartalsweise Dispolimit gilt ab dem ersten Tag eines Quartals und verwendet den Zustand zum Ende des Vorquartals (zum Simulationsstart die Eröffnungsbasis). Die vereinfachte Aktivabasis umfasst Bankcash, offene Forderungen, aktuellen Rohmaterialbestand zu aktuellen Szenariopreisen, den direkt-materialbezogenen Wert noch nicht ausgelieferter Aufträge, gekaufte Immobilien und den Buchwert gekaufter Betriebsausstattung. Der Prototyp bildet keinen vollständigen HGB-Abschluss und keine historische Durchschnittsbewertung dieser Limitbasis ab.

Materialeinkäufe mit modelliertem Lieferantenbeleg belasten Cash in Höhe von Nettoaufwand plus positionsweise berechneter SimTAX; der Kosten-/Materialaufwand bleibt netto und Vorsteuer wird separat verrechnet. Der ungezogene Disporahmen bleibt außerhalb der Zahlungsmittel. Es wird kein zusätzliches Nutzerproduktentscheidungsrecht aus dem Review abgeleitet.

## D-0147 – Tagesfragen- und Prüfungsmodus mit gemeinsamer Inhaltsbibliothek

Status: APPROVED für gemeinsame Bibliothek, getrennte Spielwirkungen und Auswahlregeln; Kernstufen und 90 Ergänzungen durch A09 geprüft (T-0041/CP-0224). Redaktionelle Einordnung, keine psychometrische/IHK-Kalibrierung.
Quelle: Nutzerauftrag T-0041; A09-Review vom 2026-10-29; [Lernfragenstufen und Wiederholung](../learning/lernfragen-schwierigkeitsstufen-und-wiederholung.md)

Dashboard und Prüfungs-/Übungsmodus ziehen Fälle aus derselben WBQ-/HSQ-Bibliothek. Das Mengenziel beträgt 20 Fälle je Stufe und Fach. A09s redaktionelle Denkoperations-Zuordnung der 450 Kernfälle ist am 2026-10-29 eingearbeitet; die Laufzeit prüft 20/15/15 Kernfälle pro Fach und erreicht mit Ergänzungen 20/20/20. A09 hat alle 90 Ergänzungen nach der dokumentierten Nacharbeit unabhängig geprüft und PASS erteilt (T-0041/CP-0224). Tages- und Prüfungsmodus besitzen weiterhin getrennte Sitzungen und lokale Lernfortschrittsschlüssel. Nur Antworten im Dashboard können innerhalb des Fünf-Antworten-Tageslimits kleine modellierte Ruf-, Kompetenz- oder Motivationswirkungen auslösen; sie erzeugen keine Buchungen. Prüfungsantworten verändern weder Spiel- noch Finanzzustand. Die Tagesauswahl wird je Simulationsdatum aus unterschiedlichen Bereichen/Stufen gemischt, wiederholt keinen Fall am selben Datum und bevorzugt fällige Wiederholungen. Alle Fragen und Wirkungen bleiben didaktische Szenarioannahmen; die Einstufung ist nicht psychometrisch kalibriert.

## D-0148 – Standortwechsel bei laufender grundpfandrechtlicher Szenariosicherheit

Status: APPROVED (A01-Sicherheitskonvention zur bereits modellierten Darlehensbesicherung; 2026-10-28)
Quelle: Cross-Agent-Review zu T-0039; vorhandene Immobilienkredit- und Grundschuldmechanik

Solange ein Immobiliendarlehen eine Grundschuld-Szenariosicherheit am aktuellen Standort führt und eine Restschuld besteht, ist der Verkauf dieses Standorts im Spiel gesperrt. Der Umzug kann nach vollständiger Tilgung fortgesetzt werden. Eine Ablösung aus Verkaufserlös, Zustimmung des Kreditgebers oder ein Sicherheitenwechsel ist nicht simuliert. Die Sperre ist eine konservative Produktvereinfachung und keine allgemeine Rechtsaussage über jede Immobilienveräußerung.

## D-0149 – V2-Arbeitsplatzausstattung, Verschleiß und Anschaffungsfinanzierung

Status: APPROVED (A01-Umsetzungskonvention aus Nutzerauftrag; fachlicher Review/QA bleibt Ticketarbeit)
Quelle: Nutzerauftrag vom 2026-10-28; [EStG § 7](https://www.gesetze-im-internet.de/estg/__7.html), [EStG § 6](https://www.gesetze-im-internet.de/estg/__6.html), [BMF AfA-Tabellen](https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerverwaltungu-Steuerrecht/Betriebspruefung/AfA_Tabellen/afa_tabellen.html?7de29e68_page=2&cd6c62dc_page=8), [AfA-Tabelle AV](https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Weitere_Steuerthemen/Betriebspruefung/AfA-Tabellen/Ergaenzende-AfA-Tabellen/AfA-Tabelle_AV.pdf)
Bezug: MG-002 / SLG-002.2 / T-0040 / CP-0217

Die Arbeitsplatzbereiche Büro/Beschaffung, Werkstatt und Lager/Versand erhalten jeweils mindestens drei Ausstattungskategorien mit je zehn kaufbaren Varianten. Szenariowerte für Gerätepreise, Verschleiß, Effektstärken und Nutzungsdauern sind keine aktuellen Marktangebote oder empirischen Produktivitätsdaten. Zustand/Verschleiß wird unabhängig vom steuerlichen Buchwert geführt. Der Prototyp behandelt Anschaffungen bis einschließlich 800 € als sofort abzugsfähige GWG-Szenariooption; darüber wird linear nach einer passenden angenommenen Nutzungsdauer abgeschrieben. Mietgegenstände werden nicht als eigenes Anlagevermögen abgeschrieben. Materialbestände werden verbraucht und sind keine AfA-Anlagegüter. EStG § 6 enthält außerdem eine optionale Sammelpostenregel für selbständig nutzbare bewegliche Anlagegüter zwischen 250 € und 1.000 €; der Prototyp simuliert diese Wahl derzeit nicht. Das Modell ist kein Steuerprogramm und deckt Einzelfallvoraussetzungen, Vorsteuer, Poolwahl, Nutzungsanteile, tatsächliche Nutzungsdauer oder vollständige Bilanzierung nicht ab.

Ein Ratenkauf ist eine eigene, illustrative Finanzierung und keine Leasingoption. Nur Spezialwerkzeuge können im zusätzlichen Ausstattungskatalog gemietet werden. Ratenkauf wird angeboten, wenn der Preis das Bankguthaben übersteigt und der Fehlbetrag in den freien Rahmen passt. Der Höchstrahmen greift die bestehende quartalsweise 10-%-Finanzierungsentscheidung auf; bestehende gezogene Dispo-, Immobilien- und Ausstattungsschulden werden auf diesen vereinfachten Rahmen angerechnet. Vertragszins 8 % p. a. und 12 Monatsraten sind Spielwerte. Diese Verschuldungs-/Kreditregel behauptet keine bankübliche Kreditwürdigkeitsprüfung und setzt keine rechtliche Kreditobergrenze.

## D-0150 – Aufgabenrechte von A12 Browser Playtest

Status: APPROVED (A01-Governancekonvention im Rahmen des ausdrücklichen Nutzerauftrags; 2026-10-29)
Quelle: Nutzerauftrag zur Einrichtung eines Browser-Playtest-Agenten; T-0042 / CP-0219

A12 – BROWSER_PLAYTEST ist für explorative visuelle und funktionale Prüfungen im Browser sowie reproduzierbare Übergaben von Spielsituationen an den Nutzer zuständig. A09 behält automatisierte Qualitätssicherung, Testabdeckung und Release-Gates. A12 darf den lokalen Browser in isolierten Testprofilen bedienen und QA-Artefakte, Screenshots sowie separate Test-Speicherstände/Fixtures erstellen. A12 darf keinen Produktcode, keine Simulations-/Finanzregeln, keinen autoritativen oder persönlichen Spielstand und keine Schema-/Architekturentscheidung verändern; ebenso sind Commit, Push, Merge und Deployment ausgeschlossen. Wenn ein Testzustand eine Änderung am Produkt oder einen Debug-Importpfad erfordert, beantragt A12 einen separaten, adressierten Auftrag an A01. Nutzer-Rückfragen und Testübergaben laufen ausschließlich über A01. Diese Rollenkonvention erteilt keine Architekturfreigabe.

## D-0151 – V2-Arbeitsblöcke, Beschaffung und vorzeitige Kreditablösung

Status: APPROVED (A01-Szenariokonvention unter dem laufenden Nutzerauftrag; 2026-10-29)
Quelle: Nutzerauftrag zu Personalplanung, Inventar, Lagerbeschaffung und Krediten
Bezug: MG-002 / SLG-002.2 / T-0045 / CP-0225

Produktionsaufträge werden in geordnete Arbeitsgänge zerlegt. Mitarbeiterzuweisungen per Drag-and-drop gelten für den jeweiligen Tagesplan; der Engine-Index verhindert, dass ein Folgeschritt vor Abschluss seines Vorgängers arbeitet. Nach vollständigem Auftragsabschluss steht verbleibende Tageskapazität für den nächsten Auftrag zur Verfügung. Nicht passende, kranke, beurlaubte oder in Weiterbildung befindliche Beschäftigte können nicht zugewiesen werden. Werkbank/Spannmittel erfüllt im Szenario die passende einfache Spannmittelanforderung, aber ersetzt weder CNC-Maschine noch CNC-Berechtigung.

Manueller Baumarkteinkauf bindet je nach Menge 1 bis 4 Arbeitsstunden; Material geht nach Abschluss des Einkaufsblocks in den Bestand. Onlinebestellungen beachten je Lieferant die Mindestmenge, eine modellierte Lieferzeit von 4 bis 6 Arbeitstagen sowie das vorhandene Verspätungsrisiko. Eine eingetroffene Lieferung wird erst nach einem 0,5-Stunden-Warenannahmeblock zum verfügbaren Bestand. Versandfertige Aufträge benötigen einen 1-Stunden-Versandblock mit PACK-Kompetenz. Die Arbeitszeiten sind Szenarioannahmen.

Online-Lieferanten bieten Mengenrabatte von 2 %, 4 % und 7 % ab modellierten Schwellen 250, 500 und 1.000 Mengeneinheiten. Zusätzlich ist ein persönlicher Beziehungsrabatt von bis zu 8 % ab Beziehungswert 60 möglich; vorhandene Zuverlässigkeitsaufschläge und Versandkosten bleiben wirksam. Das sind illustrative Spielwerte, keine beobachteten Händlerkonditionen.

Für das V2-Profil verwendet die nächste Auftragsreferenz einen Stückwert von 180 € zuzüglich eines deterministischen Zuschlags von 0 bis 90 €. Der Lieferzielhorizont beträgt 12 bis 20 Arbeitstage. Beide Werte sind balancierte Szenariowerte und keine Marktpreisbehauptung oder Lieferzeitgarantie.

Aktive Kredite werden nur mit positivem Saldo angezeigt. Vorzeitige Ablösung bucht das verbleibende Kapital aus ausreichendem Bankguthaben; die Simulation setzt dabei keine Vorfälligkeitsentschädigung an. Reale Kreditverträge können andere Ablösebeträge und Bedingungen vorsehen. Dies ist keine Aussage zu gesetzlichen Kündigungsrechten.

## D-0152 – Einheitlicher Neustart für 2019- und 2027-Profil

Status: APPROVED (ausdrückliche Nutzerentscheidung; 2026-10-30)
Quelle: Nutzerauftrag „das 2019er darf außer dem Starttag nicht vom 2027er abweichen“
Bezug: MG-002 / SLG-002.2 / T-0049 / CP-0230

Neue Spielstände der Profile 2019 und 2027 verwenden denselben Betriebs-, Personal-, Inventar-, Auftrags-, Markt-, Raum-, Finanz- und Regelstand. Der einzige beabsichtigte Unterschied ist das Startdatum (2019-01-01 bzw. 2027-01-01); jahresabhängige Simulationseffekte laufen relativ zum jeweiligen Startdatum. Beide Profile beginnen als Einzelunternehmen in derselben gemieteten Garage mit 10.000 € Bankguthaben, leerem Lager, ohne Forderungen, Verbindlichkeiten, Darlehen, Maschinen oder Aufträge sowie mit dem Inhaber als einziger Arbeitskraft und derselben Grundwerkbank/Handwerkzeugausstattung.

Die früheren 2027-Neustartannahmen mit 30.000 € Bankbestand, OP, Vorratswerten, CNC-Maschine, Maschinendarlehen und drei Beschäftigten bleiben historische Fach-/Teststände und gelten nicht für neu angelegte Spiele. Legacy-Regressions dürfen diese Daten nur über ausdrücklich benannte Test-Fixtures initialisieren; sie sind keine alternative produktive 2027-Neustartvariante. Dieser Beschluss gleicht die Neustartprofile an und ändert keine Architektur oder Datenbankschemata.

## D-0153 – Tagesbelastung von Beschäftigten und Inhaber

Status: APPROVED (ausdrückliche Nutzerentscheidung; 2026-10-30)
Quelle: Nutzerantwort nach Durchsicht der Empfehlungen aus dem manuellen Jahrestest
Bezug: MG-002 / SLG-002.2 / T-0050

Die Belastung wird relativ zu acht Stunden dargestellt: 8 h = 100 %, 10 h = 125 %. Angestellte und Zeitarbeitskräfte können im V2-Szenario höchstens zehn Stunden an einem Arbeitstag eingesetzt werden. Nur der Spieler als Inhaber darf die Zehnstundengrenze überschreiten; die V2-Szenariogrenze beträgt zwölf Stunden bzw. 150 %. Für jede am selben Tag geleistete Inhaberstunde oberhalb von zehn sinkt seine Motivation um 1,5 Prozentpunkte; die Überlast wird im Ereignisprotokoll ausgewiesen. Die CNC bleibt auf acht operative Stunden je Arbeitstag begrenzt.

Die Tageshöchstgrenze ist keine vollständige Abbildung des Arbeitszeitrechts. Für Beschäftigte gelten daneben die gesetzlichen Ausgleichszeiträume und Ruhezeitvorgaben; diese V2-Regel allein weist keine rechtliche Konformität des Dienstplans nach. Sie ändert weder historische V1-Kernwerte noch Schema oder Architektur.

## D-0154 – Automatische Tagesplanung auf 100 % begrenzen

Status: APPROVED (ausdrückliche Nutzerentscheidung; 2026-10-30)
Quelle: Nutzeranweisung zur automatischen Arbeitsplanung
Bezug: MG-002 / SLG-002.2 / T-0050 / CP-0234

Die automatische Tagesplanung weist jeder Person höchstens acht Arbeitsstunden zu (100 %). Arbeit oberhalb dieses Umfangs darf nur durch eine explizite manuelle Tageszuweisung des Spielers oder einer Führungskraft freigegeben werden. Bei einer solchen manuellen Freigabe gelten die Obergrenzen aus D-0153: höchstens zehn Stunden für Beschäftigte und Zeitarbeit; der Inhaber kann bis zwölf Stunden gehen, mit Motivationsabzug oberhalb von zehn Stunden. Die CNC-Kapazität bleibt acht Stunden je Arbeitstag. Eine allgemeine manuelle Zuweisung ist die bewusste Mehrarbeitsfreigabe für diesen Tag; unzugewiesene Restarbeit bleibt automatisch auf 100 % begrenzt.
