# P0-Architektur-Gegenprüfung – CP-0029

**Datum:** 2026-09-26
**Agent:** A11 – TECHNICAL_ARCHITECT
**Bezug:** MG-000 / SLG-000.2 / D-0010 / CP-0021 bis CP-0028 / T-0006 / T-0007
**Status:** Review abgeschlossen; keine Architekturfreigabe. Architektur V0.2 und ADR-001 bis ADR-008 bleiben `PROPOSED`.

## Ergebnis

Der aktuell validierte P0-Fachstand ist ohne grundlegenden Architekturbruch in die vorgeschlagenen Systemgrenzen von Architektur V0.2 überführbar. Die P0-Regeln präzisieren Zeitauflösung, Zahlungsrichtungen, SimTAX, Startbilanz und Kapazitätsprofil; sie erfordern keine neue Laufzeit- oder Persistenzarchitektur. Finanzielle Autorität bleibt bei A03, operative Zeit-/Prozessautorität bei A02 und die Persistenzmodellierung bei A04.

Es wurden keine CRITICAL- oder HIGH-Befunde gefunden. Zwei dokumentarische Lücken/Widersprüche mittlerer Priorität sollten nachgeführt werden. Offene Fachparameter bleiben ausdrücklich offen und lassen sich als konfigurierbare oder fachliche Parameter behandeln; sie erzwingen derzeit keine neue Architekturentscheidung.

## Befunde

| Bereich | Klassifikation | Priorität | Befund |
|---|---|---:|---|
| Zahlungsdomäne | PASS | — | Kundeneingang und eigener Zahlungsausgang sind getrennt. Forderung und Verbindlichkeit sind getrennte OP-Objekte. Zahlungsversuch ist nicht die tatsächliche Zahlung. `payable_payment_attempt` referenziert ausschließlich Payables; Dunning ist an Payable und fehlgeschlagenen eigenen Versuch gebunden. Kundeneingänge haben kein eigenes Cash-Gate. |
| Simulation / Accounting | PASS | — | A02 verwaltet Ereignis, Zeit, Prozess und operative Mengen; A03 verantwortet Buchungen, OP, Liquidität und Finanzresultate. A02 übergibt Ereignisse und verarbeitet A03-Ergebnisse, ohne selbst Finanzsalden zu berechnen oder zu mutieren. |
| Ereignisübergabe | PASS | — | A02-Ereignisse enthalten die für Accounting benötigten Bezüge wie Partei, Auftrag/Beleg, Betrag/Menge, Wirksamkeitsdatum und Quelle. A04 dokumentiert stabile Quellereignisse und idempotente Übergaben. Konkrete Triggerregeln bleiben fachlich offen, nicht architektonisch unmöglich. |
| A04-Modell / Richtungen | PASS | — | Das logische Modell kann Zahlungsrichtung, Receivable/Payable, Versuch, tatsächliche Zahlung, Zuordnung und Dunning getrennt abbilden. Es besteht keine versteckte gemeinsame Cash-Gate-/Dunning-Logik für Forderungen und Verbindlichkeiten. |
| Zeitmodell | PASS | — | Wochenraster, konkretes Ereignisdatum, Tagesphasen, stabile Reihenfolge und Same-Day-Fortschreibung sind im A02/A04-Fachstand abbildbar. Der offene Arbeitskalender und die Tagesverteilung betreffen Werte/Regeln des Simulationskalenders, keine notwendige Systemgrenze. |
| Architekturtext zum Zeitlauf | LÜCKE | MEDIUM | Architektur V0.2 §8 beschreibt einen „Monatslauf“ und listet Monatsphasen; der P0-Stand löst einen Zeitvorschub dagegen je Kalendertag innerhalb des Wochenrasters auf und führt den Monatsabschluss nach den Tagesphasen aus. Das ist kompatibel, wenn der Monatslauf als Periodenabschluss/Orchestrierung und nicht als unteilbarer Simulationsschritt gelesen wird. V0.2 sollte diese Beziehung später ausdrücklich festhalten. |
| Finanzmodell | PASS | — | Eröffnungsbilanz 95.300 €, Bankbestand 30.000 € und separater ungenutzter Rahmen 20.000 € sind unterscheidbar. SimTAX ist als 19-%-Simulationseinstellung mit Positionsrundung dokumentiert, nicht als Rechtslogik. BAB ist statisch/vereinfacht für V1 vorgesehen. Darlehen und Finanzierungsrahmen sind getrennt modellierbar. |
| Darlehen / Finanzparameter | OFFENE ENTSCHEIDUNG | MEDIUM | Darlehenszahlungsplan, Zins-/Tilgungszeitpunkte, Umgang mit nicht gezahlten Zinsen und Abrufbarkeit des Rest-Rahmens bleiben offen. Sie können als A03-Fachregeln bzw. Szenarioparameter geführt werden; bis dahin darf kein Zahlungsplan unterstellt werden. |
| Produktionsmodell | PASS | — | A02 trennt Personalkapazitäten und CNC-Maschinenkapazität. 40 h/Woche je Ressource, CNC zusätzlich höchstens 1.600 operative h/Jahr, Startaufträge und Materialbedarfe sind als Szenariowerte kenntlich. Kapazität wird nicht architektonisch mit fertigen Teilmengen gleichgesetzt. |
| Produktionskalender | OFFENE ENTSCHEIDUNG | MEDIUM | Verteilung der Wochenkapazität auf Arbeitstage, Standortkalender und Feiertage bleiben offen. Sie beeinflussen konkrete Fertigstellungs-/Fälligkeitstage, erzwingen aber keine neue Persistenz- oder Simulationsarchitektur. |
| Szenariowerte / Produktregeln | PASS | — | Startaufträge, Startbestände und Kapazitätswerte sind als konkretes P0-Startprofil gekennzeichnet und nicht mit allgemeinen Regeln gleichgesetzt. Weitere offene Werte bleiben als Profil-/Konfigurationswerte identifizierbar. |
| Offene Zahlungsparameter | OFFENE ENTSCHEIDUNG | MEDIUM | Kundenverhaltensparameter, Retry-Regeln, Zahlungspriorität und konkrete Mahnfristen/-schwellen bleiben offen. Die fachlichen Abläufe unterscheiden diese Werte von den bestätigten Invarianten (Vollzahlungsversuch für Payable, kein Cash-Gate für Kundeneingang, keine Teilzahlung bei Fehlschlag). |
| A04-Abschlussprosa | WIDERSPRUCH | MEDIUM | A04 §3.2 sagt pauschal, exakte Abschluss-/Abnahmeregeln seien offen. A02 legt G3 (Abschluss nach vollständigem Zahlungseingang) und F3 fest; A04 §3.3 sowie spätere Abschnitte bilden diese Regeln bereits ab. Der ältere pauschale Satz ist gegenüber dem späteren Stand zu präzisieren. Kein Modellhindernis, aber unnötige Mehrdeutigkeit. |
| CP-0020-Nachweis | LÜCKE | LOW | CP-0020 ist im aktuellen Checkout nicht vorhanden. Die einschlägigen P0-Werte sind in aktuellen A02-/A03-/A04-Unterlagen und D-0010 dokumentiert; dieser Review rekonstruiert den fehlenden Checkpoint nicht. Es bleibt eine Provenienz-, keine Architekturblockade. |
| A04-Abschlussregel | PASS | — | Das Modell trennt operativen Status, Abnahme, Rechnung, OP-Ausgleich und Abschluss. A02s G3-Regel ist in der A04-Statusbeschreibung aufgenommen; Lieferantenverbindlichkeiten blockieren nicht den kundenbezogenen Abschluss. |

## Offene Parameter: Architekturbehandlung

Die folgenden Punkte können in ihren zuständigen Fachkontexten als Parameter oder versionierte Regeln geführt werden. Ihre Werte bleiben offen und dürfen nicht durch A11/A04 implizit festgelegt werden:

- **A03:** Kundenverhalten, Zahlungspriorität, Retry-Zeitpunkt/-regeln, Mahnfristen und -schwellen, Darlehenszahlungsplan sowie noch offene Finanz-/Steuerdetails.
- **A02/A03:** Tageskapazitätsverteilung, Kalender-/Feiertagsregeln und Monatszuordnung verschobener Ereignisse.
- **A02/A03/A04:** konkrete Herkunfts- und Referenzdaten für bestehende Eröffnungsforderungen/-verbindlichkeiten.

Die Parameter müssen mit Regelversion und Wirksamkeit im Simulations-/Finanzkontext nachvollziehbar bleiben. Dieser Review beschließt weder eine konkrete Parametrisierung noch ein technisches Konfigurationsformat.

## Empfehlungen für dokumentarische Folgearbeit

1. Architektur V0.2 §8 präzisiert „Monatslauf“ als Monatsabschluss/Orchestrierung über kalendertägliche Auflösung.
2. A04 §3.2 präzisiert den pauschalen Satz zu offenen Abschluss-/Abnahmeregeln im Einklang mit F3/G3 und §3.3.
3. CP-0020 bleibt als fehlender Nachweis markiert; nicht aus späteren Angaben rekonstruieren.

Diese Empfehlungen sind keine neuen Architektur- oder Produktentscheidungen. Keine ADR wurde genehmigt oder geändert. Es wurden keine Dateien außerhalb dieses Reviews, Checkpoints und der Collaboration-State-Ergänzung geändert.

## Prüfung und nächster Schritt

- Gegenprüfung anhand CP-0021 bis CP-0028, aktueller A02-/A03-/A04-Dokumente, Architektur V0.2/ADRs und Governance ausgeführt.
- CP-0020 fehlt im Checkout; sein Inhalt wurde nicht als Quelle angenommen.
- Keine CRITICAL-/HIGH-Befunde; kein Architektur-, Datenbank- oder Implementierungsfreigabeschritt ausgelöst.
- A01 kann die beiden MEDIUM-Dokumentationspunkte als gezielte Textangleichung an die jeweiligen Fachrollen geben. Offene A03-/A02-Parameter bleiben bei den Fachrollen/Nutzerentscheidungen.
