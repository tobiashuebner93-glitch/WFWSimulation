# A03-Berechnungsabgleich – Maschinenannuität

**Historischer Berechnungsnachweis:** Dieser Abgleich erfasst die Entscheidung D-0122. Der darin enthaltene frühere Hinweis, dass der Browser-Prototyp Maschinenraten noch nicht umsetzt, wurde durch CP-0180 überholt; der aktuelle Code enthält Rate, Wochenretry, manuelle Dispooption und Verwertung nach D-0042/43.

Datum: 2026-10-27\
Adressat: A01 – MASTER_ORCHESTRATOR\
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0030–D-0041 / D-0121 / CP-0160

## Bestätigte Eingaben

- Hauptschuld zum 01.01.2027: 24.000 €.
- Restlaufzeit: sieben Jahre; monatliche Zahlungen, daher 84 Raten.
- Erste tatsächliche Rate: 29.01.2027; danach letzter Arbeitstag jedes Monats.
- Fester Nominalzins: 5 % p.a.
- Zinsmethode: deutsche 30E/360; Zins auf Restschuld, Zinsen mit der Rate, monatliche Zinsrundung auf Cent; Schlussrate gleicht den Rundungsrest aus.

## Rechenergebnis nach Nutzerentscheidung D-0122

Der Nutzer hat die gleichmäßige Monatsperiodik mit `i = 5 % / 12` bestätigt. Die Annuitätenformel ergibt

`Rate = 24.000 € × i / (1 − (1 + i)^−84) = 339,2138… €`, also **339,21 € je Monat** vor Schlussrundung.

Die regelmäßige Monatsrate ist **339,21 €**. Bei 83 regelmäßigen Raten zu je 339,21 € und auf Cent gerundetem Monatszins verbleiben vor der letzten Fälligkeit 338,16 € Hauptschuld; die 84. Zahlung beträgt damit **339,57 €** (338,16 € Tilgung + 1,41 € Zins). Die letzte Rate gleicht den Rundungsrest aus. Die gesamten Zinszahlungen im Plan betragen 4.494,00 €.

Die vom Nutzer bestätigte Berechnungsbasis für die Annuität ist 5 % / 12, also eine volle 30/360-Monatsperiode je Rate. Der Kalendertag der Wochenendverschiebung ändert den Periodenfaktor nicht; ein kurzer Eröffnungszinszeitraum wird nicht separat berechnet. D-0035 bis D-0041 regeln weiterhin die Restschuld, den Stichtag, die Cent-Rundung und gemeinsame Zahlung mit der Rate; Zahlungstermine folgen D-0033 und D-0121.

## Recherche zur Einordnung

- **Recht:** § 488 BGB stellt auf vereinbarte Zinsen und Rückzahlung bei Fälligkeit ab; er schreibt für diese V1-Konstellation keine universelle Annuitätenformel oder monatliche Zinskonvention vor. [§ 488 BGB](https://www.gesetze-im-internet.de/bgb/__488.html)
- **Branche:** Die Verbraucherzentrale beschreibt die Annuität als gleichbleibende Rate aus Zins und Tilgung; Commerzbank und LBS verlangen für einen konkreten Tilgungsplan die Vertrags-/Berechnungsparameter. Damit ist die Rate grundsätzlich Vertrags-/Planbestandteil, nicht ein für alle Zahlungspläne identischer Rechtswert. [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/geld-versicherungen/bau-und-immobilienfinanzierung/immobilienfinanzierung-diese-modelle-gibt-es-und-das-sollten-sie-beachten-5801), [Commerzbank](https://www.commerzbank.de/privatkunden/wissen/ratgeber/finanzierung/baufinanzierung/annuitaetendarlehen/), [LBS](https://www.lbs.de/finanzieren/finanzierungsrechner/annuitaetenrechner)
- **Praxis/Forum:** Ein Forenbeitrag zur 30/360-Berechnung zeigt, dass taggenaue Zeitanteile bei Sonderterminen vom pauschalen Monatsansatz `Jahreszins / 12` abweichen können. Das ist eine Erfahrungsnotiz, keine Norm. [ComputerBase-Forum](https://www.computerbase.de/forum/threads/monatlicher-zinsanteil-berechnen-annuitaetendarlehen.851515/)

## Ergebnis und Folgeauftrag

Nutzerantwort: **„339,21 € nach 5 % / 12 (empfohlen)“**. A03 hat daraus den Tilgungsplan mit 83 regelmäßigen Raten zu je 339,21 € und einer angepassten Schlussrate von 339,57 € berechnet. A02 übernimmt Fälligkeitstermine; A03 bleibt für Zins-/Tilgungsaufteilung und Kontenwirkung autoritativ. Der Browser-Prototyp enthält bislang keine Maschinenratenbuchungen; vor einer Umsetzung ist sein bestehender Laufzeit-/Finance-State zu prüfen.
