# T-0062 – A02-Abgleich V2-Finanzereignisse (D-0120/D-0129)

**Status:** Fachlicher Abgleich und Vertragsvorschlag abgeschlossen; keine Produktänderung  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0062  
**Prüfbasis:** `main` HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`, Dirty Working Tree inklusive CP-0267/0268 und T-0062-Berichte; kein gemeinsamer Commit. Preflight erneut ausgeführt. Vorgängerbezug CP-0266/0267. Maßgebliche Entscheide: D-0120, D-0126, D-0129, D-0149, D-0156; V2-Annahmen dürfen V1-Regeln nicht rückwirkend umdeuten.

## A01-Vorschlag 1: Rangfolge gleichzeitiger Zahlungen

**Bewertung:** kein direkter Widerspruch zu D-0120/D-0129, sofern die zusätzliche Rangfolge ausdrücklich nur als V2-Simulationskonvention gilt. D-0120 setzt Kundeneingänge vor eigenen Auszahlungen; D-0129 ist ausdrücklich eine V1-Konvention und nennt für V1 Kundeneingänge/Disporückführung, danach das Maschinendarlehen, danach eigene Verbindlichkeiten in Spielerreihenfolge. Immobilien- und Anlagenraten sind V2-Fälle und durch D-0129 nicht priorisiert. Der vorgeschlagene feste Vorrang *Maschine → Immobilie → Ausstattung* schränkt die Spielerwahl nur für diese festen Finanzierungstermine ein; der Spieler behält seine Reihenfolge bei sonstigen eigenen Verbindlichkeiten.

**Aktuelle Codeabweichung:** `app.js` ruft `processEquipmentInstallments(...)` vor `processFinancialDay(...)` auf. Damit wird eine fällige Anlagenrate vor dem Kundeneingang versucht, während `finance.js` danach Kundeneingänge/Disporückführung, Maschinendarlehen, Immobilienrate, sonstige offene Kosten und SimTAX verarbeitet. Das verletzt den A01-Vorschlag und das Geltungsprinzip von D-0120 für den geplanten V2-Ablauf. Die Anlagenrate muss in den zentralen Phase-8-Zahlungsablauf nach Kundeneingängen verschoben werden.

## Präziser gemeinsamer Ereignisvertrag (A02-Vorschlag an A01/A03)

1. **Wirksamer Tag und Phase:** Ein Finanzereignis wird am bereits gemäß Kalenderregeln ermittelten wirksamen Simulationsdatum genau einmal in Phase 8 verarbeitet. Eine Wochenendverschiebung wird nicht zurückdatiert; der wirksame Tag bestimmt Monatsperiode. Eine abgeschlossene Tagesphase wird nicht wieder geöffnet.
2. **Kundeneingänge:** Alle am wirksamen Tag fälligen/offenen Kundenzahlungen werden zuerst vollständig und ohne Cash-Gate gebucht. Mehrere Eingänge werden reproduzierbar nach Rechnungsfälligkeit, danach stabiler Rechnungs-ID verarbeitet. Je Eingang wird nach D-0126 zuerst eine bestehende gezogene Disposchuld bis höchstens zum Eingang getilgt; nur der verbleibende Betrag erhöht den Bankbestand. Forderung wird geschlossen bzw. reduziert; kein zweiter Erlös wird gebucht.
3. **Feste Finanzierungstermine:** Danach werden fällige Finanzierungstermine in der festen Typreihenfolge **Maschine → Immobilie → Ausstattung/Anlagenrate** versucht. Innerhalb desselben Typs entscheidet das älteste Fälligkeitsdatum, danach stabile Vertrags-/Loan-ID. Jeder Versuch ist eine Vollzahlung. Das Cash-Gate nutzt den nach vorigen Buchungen vorhandenen Bankbestand; eine ungezogene Kreditlinie zählt nicht als Zahlungsmittel. Ein Dispoabruf bleibt manuell und muss vor Phase 8 ausdrücklich erfolgt sein; kein automatischer Draw und keine Teilzahlung.
4. **Sonstige eigene Verbindlichkeiten:** Danach folgen die fälligen/erneut fälligen Lieferanten- und sonstigen betrieblichen Posten in der vom Spieler gespeicherten Reihenfolge. Bei gleichem/nicht gesetztem Rang: Fälligkeitsdatum, dann stabile Posten-ID. Bestehendes Dunning bleibt erhalten: erster Fehlschlag eröffnet den Posten ohne Cashbewegung, anschließend wöchentliche Vollzahlungs-Retries; nach acht erfolglosen Retries Spielverlust; Zahlungserinnerung 10 Kalendertage nach erstem Fehlschlag und formelle Mahnung weitere 14 Kalendertage später, sofern am Ereignistag noch offen. Erfolgreiche Zahlung schließt vor Mahnstatusverarbeitung den Posten.
5. **SimTAX:** Fällige SimTAX-Zahlung wird nach den oben genannten Kunden-/Finanzierungs-/Spielerprioritätszahlungen verarbeitet; keine Spieler-Neusortierung. Ihre bestehende eigenständige Retry-/Dunning- und Spielverlustregel bleibt erhalten.
6. **Nicht erfolgreiche feste Raten:** Keine Cashbewegung, kein negativer Bankbestand und kein automatischer Dispoabruf; Rate bleibt als eigener offener/verfehlter Finanzierungstermin nachvollziehbar. Wiederholungsversuch nach sieben Kalendertagen, bei Wochenende am nächsten Arbeitstag. Es gelten ausschließlich bereits definierte darlehensspezifische Folgen: beim Maschinendarlehen zählt D-0042/43 drei verschiedene unbezahlte Monatsraten für die beschlossene Verwertung. Für Immobilien-/Anlagenraten werden mangels bestätigter Vertragsfolgen keine Pfändung, Kündigung, Mahngebühr, zusätzlicher Verzugszins oder Spielverlust erfunden; bis zu einer separaten Produktentscheidung werden sie wöchentlich erneut versucht und bleiben offen.
7. **Mahnstatus/Abschluss:** Nach allen Zahlungserfolgen/-fehlschlägen werden für weiter offene Betriebskosten/SimTAX fällige Reminder/Mahnungen protokolliert. Kein bereits am selben Tag bezahlter Posten erhält für diesen Tag einen neuen Mahnstatus.

A03s Zusatzreview stimmt zu, dass die Regelung bisher nicht dokumentiert ist und kein V2-Default aus D-0129 folgt; es erteilt keine Prioritätsfreigabe. Die hier präzisierte Konvention ist somit A02-Fachvorschlag unter der ausdrücklichen Nutzerdelegation, Entscheidungen selbst zu lösen, und muss von A01 als V2-Szenarioannahme in Decision Log/Spezifikationen übernommen werden. A03 sollte den ausgearbeiteten Buchungs-/Cash-/Retry-Vertrag vor Umsetzung gegen Finance-Verhalten abzeichnen.

## A01-Vorschlag 2: Netto-/Bruttosemantik Angebot und Rechnung

**Bewertung:** mit A03s Befund vereinbar; D-0053–0056 und D-0113/14 begründen keine allgemeine Netto-/Bruttosemantik für alle Angebote. A03 weist darauf hin, dass diese Gesamtaussage noch nicht als Nutzerentscheidung dokumentiert ist. Im bestehenden V2-Code werden Eingabe, angenommener Vertragspreis und `scenarioPrice` ausdrücklich als netto bezeichnet; `issueInvoice()` interpretiert den Betrag als netto und berechnet 19 % SimTAX plus Bruttozahlbetrag. Die Oberfläche bezeichnet Angebot, Marktwert und vereinbarten Auftragspreis ebenfalls als netto.

**Präzisierung für den vorhandenen Datenumfang:** Das V2-Szenario legt Angebot und vereinbarten Gesamtauftragspreis als **Nettoszenariowert** fest. Solange pro Auftrag nur ein Preiswert vorliegt, ist der Gesamtauftrag die eine SimTAX-Rechnungsposition: 19 % auf den Nettogesamtwert, kaufmännisch je Position auf Cent gerundet; Zahlbetrag = Netto + SimTAX. Falls künftig mehrere eigenständig bepreiste Rechnungspositionen existieren, wird der Steuerbetrag je einzelner Positionssumme gerundet und dann summiert, wie D-0053–55 festlegen. Kein Aufschlag auf Stückmengen vor der Positionssumme. Auftragsergebnis/Deckungsbeitrag bleibt netto; Forderung, Zahlung und Bruttozahlbetrag verwenden den Bruttobetrag. Das wird als **V2-Spielannahme** bezeichnet und behauptet weder eine konkrete reale Steuerpflicht noch vollständige Umsatzsteuerkonformität. V2-Verträge sind in dieser Simulation durchgehend so zu lesen; Legacy-Spielstände nur nach ihrem bestehenden Format migrieren, ohne Werte still neu zu interpretieren.

Die vorhandene Rechnungsfunktion behandelt derzeit den Auftragsgesamtwert als Einzelposition. Kein Produktcode geändert oder Steuersatz neu gesetzt. Vor Umsetzung sollte A03 das Netto-/Bruttobuchungsbild bestätigen; A05 sollte bei Übernahme der Entscheidung Beschriftungen „Netto“, „SimTAX“ und „Brutto/Zahlbetrag“ sichtbar halten.

## Rollennachweis und Grenzen

- **Ausführung/Fachreview:** A02 hat Spezifikations- und Codeabgleich ausgeführt; A03-Ergebnis aus `T-0062-A03-review.md` berücksichtigt.
- **Änderungen:** nur dieser Reviewbericht. Keine Finanz- oder Simulationscodeänderung; keine Schema-/Architekturfreigabe.
- **Tests:** keine, da keine Codeänderung vorgenommen wurde. A02-Regressions und A03-Jahressmoke sind in den jeweiligen Berichten dokumentiert.
- **Unabhängige QA / Browser-/Gerätetest:** nicht ausgeführt in diesem Folgeauftrag.
- **Git:** HEAD weiterhin `194fbaa7069ef59d1c832164a21b06f1cd2102d`; Arbeitsbaum bereits verändert; kein Commit/Push.

## Auftrag an A01

Kein Nutzerentscheid ist zwingend, weil dieser Turn auf der bestehenden Nutzerdelegation zur selbständigen Lösung nicht eindeutig geklärter Entscheidungen aufsetzt. A01 sollte den oben abgegrenzten V2-Ereignisvertrag mit A03 bestätigen lassen, anschließend die V2-Konvention explizit dokumentieren und erst dann die zentralisierte Phase-8-Implementierung und Regression als neuen Auftrag an A02/A03 auslösen. Dies ändert D-0129 für V1 nicht.
