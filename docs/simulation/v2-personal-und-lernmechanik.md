# V2 Personalplanung und Tageslernfragen

Stand: 2026-10-28 · Umsetzungskonvention D-0141 · Ticket T-0034

## Zeitarbeit

Die drei fiktiven Agenturen besitzen feste Pools mit je vier Personen. Ein Poolprofil enthält Qualifikationen, Motivation und aktuelle/maximale Werte für Fach-, Methoden-, Sozial- und Individualkompetenz. Eine Agenturbuchung wählt Qualifikation, Kopfzahl (bis zu zwei passende Poolkräfte) und Dauer von einem, fünf oder 20 Simulationarbeitstagen. Die Buchung reserviert passende Personen über den gesamten Zeitraum, überspringt arbeitsfreie Tage gemäß Simulationskalender und wird nur angenommen, wenn an jedem Einsatztag Personal- und Raumkapazität ausreichen. Beginnt die Buchung an einem arbeitsfreien Tag, startet der Einsatz am nächsten Arbeitstag. Jede reservierte Person wird als normale Personalplanungsressource angezeigt; die Buchung ordnet sie keinem Auftrag zu. Die Auftragstageszuweisung erfolgt anschließend im Planungsbereich.

Agenturgrundpreis und Stundensatz bleiben an den vereinbarten Agenturvertrag gebunden. Geplante Einsatzstunden fließen taggenau in die Monatsabrechnung. Pools, Namen, Fähigkeiten, Motivation und Preise sind fiktive Szenariowerte.

## Kompetenz und Produktivität

Beschäftigte und Zeitarbeitskräfte führen je Kompetenzgruppe einen aktuellen Wert (0–100) und ein individuelles Entwicklungslimit. Zusatzberechtigungen (Maschinenbedienung, Ausbildereignung) werden separat geführt und nicht allein aus einem Kompetenzwert abgeleitet. Eine Weiterbildung erhöht den zugeordneten Kompetenzwert nur bis zum individuellen Limit. Die Tagesleistung wird aus einem gewichteten Fach-/Methoden-/Sozial-/Individualwert und Motivation berechnet, mit einer Szenariogrenze von 65–118 %.

## Tagesfragen

Das Dashboard bietet eine Tagesfrage aus der WBQ-/HSQ-Bibliothek. Je Simulationsdatum sind maximal fünf Antworten zulässig; der Zähler ist Teil des gespeicherten Spielstands und setzt sich mit einem neuen Simulationsdatum zurück. Richtige Antworten geben +0,2 auf eine rotierende Mitarbeiterkompetenz, begrenzt durch das individuelle Entwicklungslimit. Falsche Antworten senken abwechselnd Motivation um 0,2 oder Unternehmensruf um 0,1. Diese Spielwirkungen werden in der Engine erfasst und erzeugen keine Buchung, Steuerposition oder Ledgerbewegung.

Alle Zahlen und Wirkungsregeln dieses Dokuments sind didaktische Szenarioannahmen. Sie behaupten weder eine empirisch gemessene Personalwirkung noch eine Prüfungswirkung oder Rechtskonformität. D-0139 gilt für die erklärenden Auswirkungen der Lernbibliothek weiter; für aktive Dashboard-Tagesfragen gilt die in D-0141 festgelegte kleine Spielwirkung.
