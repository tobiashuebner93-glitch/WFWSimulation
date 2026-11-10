# A01 – T-0077 getrennte Finanzlösungen

**Stand:** 2026-11-08
**Status:** Leitentscheidungen durch Nutzer bestätigt (D-0175–D-0180); A03-Kontierungs-/Eventdetails und Reviews ausstehend
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Goal/Tickets:** MG-002 / SLG-002.2 / T-0077 / T-0069 G3, G7, G10
**Vorgänger:** CP-0527 (unverändert)
**Umfang:** Lösungsvorschlag; keine Runtime-, Schema-, Buchungs- oder Releasefreigabe

## Ziel und Grenzen

T-0077 wird in fünf getrennte Slices zerlegt: Payroll, Steuerermittlung/-abführung, Kredit/Dispo, monetäre Bestandsbewertung/COGS und Hauptbuch/Jahresabgleich. Jeder Slice benötigt eigene quellgebundene Events, Autorisierung, Gegenkonten, Fristen, Replay-Schutz und Monats-/Jahresreconciliation. Fehlt eine Pflichtquelle, bleibt der Wert PENDING; er wird weder nullgesetzt noch aus Planwerten hergeleitet.

Bestehende Grenzen bleiben verbindlich: D-0152 setzt neue Runs als Einzelunternehmen mit 10.000 € Bank, leerem Lager, ohne Forderungen/Schulden/Kredite/Maschinen/Aufträge, Grundwerkbank und Handwerkzeugen auf. Geldwert der Startausstattung und Quelle des Startkapitals sind nicht belegt. D-0165/66/68 definieren 19 % SimTAX auf ausdrücklich steuerpflichtige Kundenpositionen und Kundenzahlung am Fälligkeitstag; SimTAX ist keine Feststellung des realen Steuerstatus. D-0170 erlaubt eigene Fertigwaren-FIFO nur mit belegten Quellen für Material, Arbeit, Maschine und Fertigungsgemeinkosten. D-0173/74 erlauben Lieferanten-AP und ausdrückliche Vollzahlung in einem isolierten Subledger, aber ausdrücklich ohne Hauptbuch-, Steuer-, Bestandswert-, Aufwand- oder COGS-Wirkung. D-0171 verlangt vor jeder Regeländerung eine Antwort Ja/Nein/Gegenvorschlag. V1-Regeln D-0123 bis D-0129 werden nicht automatisch V3-Regeln.

## 1. Payroll

**Vorgeschlagener Ablauf**

1. Abrechnungsquelle ist ausschließlich genehmigte, tatsächlich geleistete Arbeitszeit; Plan, Urlaub und Krankheit sind separat.
2. Ein versionierter Payroll-Lauf pro Mitarbeiter und Periode berechnet Brutto, Netto, Arbeitnehmerabzüge und Arbeitgeberanteile aus Arbeitsvertrag, Zeitnachweis, Steuer-/SV-Merkmalen und einem benannten Parameterstand.
3. Der Lauf erzeugt getrennte OPs für Nettoauszahlung, einbehaltene Lohnsteuer und Sozialversicherungsbeiträge. Arbeitgeberanteile werden separat als Aufwand und Verbindlichkeit geführt.
4. Jede Zahlung ist ein eigenes autorisiertes, vollständiges Bankevent mit Payroll-Lauf-ID, Empfänger, Betrag, Wertstellung und Fälligkeit. Bei ungenügender Liquidität bleibt der OP offen; keine Teilzahlung.
5. Eigentümerentnahmen eines Einzelunternehmens sind keine Payroll und kein Lohnaufwand. Eine eigene, freigegebene Eigenkapital-/Privatkontenregel ist erforderlich.

**Pflichtdaten/Blocker:** Lohnmodell pro Beschäftigtem, gültiger Vertrag, genehmigte Stunden, Steuer-/SV-Merkmale, Parameterquelle und Verhalten bei fehlender Liquidität fehlen. Ohne sie kein Netto-/Abgabenbetrag und kein Payroll-PASS.

**Rahmenrecht:** EStG §41a trennt Lohnsteuer-Anmeldung und Abführung; SGB IV §23 regelt eigene Fälligkeiten für Sozialversicherungsbeiträge. Daher keine pauschale Sammelfälligkeit für alle Personalabgaben. Amtliche Texte: https://www.gesetze-im-internet.de/estg/__41a.html und https://www.gesetze-im-internet.de/sgb_4/__23.html

## 2. Steuerermittlung und Abführung

**Getrennte Steuerarten**

- Kunden-SimTAX bleibt die nichtrechtliche, ausdrücklich markierte 19-%-Szenariokomponente nach D-0165/66.
- Lieferantensteuer/Vorsteuer wird nur aus einer belegten Rechnung mit ausdrücklich bekanntem Steuerstatus berechnet. D-0173 erlaubt unbekannten Steuerstatus; unbekannt bedeutet PENDING, nicht 0 % oder automatisch 19 %.
- Lohnsteuer und Sozialbeiträge entstehen nur aus Payroll.
- Gewerbe-, Einkommen- oder sonstige Steuern werden nur mit eigener Rechtsgrundlage und eigenem Event ergänzt; keine erfundenen Pauschalwerte.

**Vorgeschlagene Events:** Periodenabschluss je Steuerart mit Quellen, Bemessungsgrundlage, Steuerbetrag, Abzügen, Parameter-/Rechtsstand, Fälligkeit und Differenzstatus; danach separates Melde-/Festsetzungs-/Zahlungs-/Erstattungsereignis. Bank ändert sich ausschließlich durch ausgeführtes Zahlungsevent, das den richtigen Steuer-OP ausgleicht.

UStG §18 hat periodenspezifische Melde- und Fälligkeitsregeln samt Schwellen/Sonderfällen; EStG §41a und SGB IV §23 haben eigene Regeln. Das System muss diese getrennt und versioniert abbilden. Quelle: https://www.gesetze-im-internet.de/ustg_1980/__18.html

**Offene Rechtsstandsentscheidung:** Empfehlung ist ein explizites Rechtsstandsprofil pro Run und Release. Zu klären ist, ob es bei Spielstart 2019/2027 stets den aktuellen Release-Rechtsstand oder den historischen Simulationsjahresstand verwendet. Die Nutzerregel „aktuelle Rechtslage“ spricht für Release-Rechtsstand; historische Szenarien würden eine abweichende Regel benötigen.

## 3. Kredit und Dispo

**Darlehen:** Vertrag mit Gläubiger, Hauptbetrag, Auszahlung, Nominalzins, Laufzeit, Tilgungsplan, Zinstagebasis, Fälligkeiten, Sondertilgung und Kündigung. Auszahlung, Haupttilgung, Zinsentstehung und Zinszahlung sind getrennte Events. Sie verändern Bank, Schuld und Aufwand nur entsprechend einer bestätigten Kontierungsregel. Der Vertrag bestimmt die Bedingungen; es wird kein Zinssatz oder Tilgungsplan ergänzt.

**Dispo:** Nicht gezogener Rahmen ist kein Cash und keine Schuld. Manueller Draw, Rückzahlung und Zins sind getrennte Events. Draw erhöht Bank und Dispoverbindlichkeit; Rückzahlung senkt beide. Anzeige: Bankguthaben minus gezogener Dispo, negative Position rot; Kreditrahmen und freier Rahmen darunter. Kein automatischer Abruf.

D-0123 bis D-0129 enthalten für V1 eine 10-%-Bilanzsummengrenze, Quartalswechsel, manuellen Fehlbetrags-Draw, vorrangige Rückführung durch Kundeneingänge und tägliche Zinsberechnung mit Monatsbelastung. **Vorschlag:** nur durch explizite Entscheidung für V3 übernehmen. Der alte Startbetrag 5.530 € gilt nicht, weil D-0152 das alte Startprofil ersetzt. Ohne belegte Startbilanz ist die V3-Rahmenhöhe PENDING. Zinsbasis/Rundung/Monatsereignisreihenfolge müssen gemeinsam mit dem V3-Vertrag festgelegt werden.

Rechtliche Rahmenquelle zu Darlehenspflichten: BGB §488, https://www.gesetze-im-internet.de/bgb/__488.html. Das Gesetz liefert keinen allgemeinen Disporahmen oder ein allgemeines Konditionsmodell.

## 4. Monetärer Bestand und COGS

**Vorgeschlagene Kostenkette**

1. Wareneingang erfasst Menge und bindet Bestellung, Lieferant und Empfang.
2. Freigegebene Rechnung belegt Preis, Fracht/Nebenkosten und Steuerstatus. Sie referenziert den bestehenden D-0174-AP-OP, damit AP nicht doppelt entsteht.
3. Rohmaterial: bestätigter gleitender Durchschnitt. Zugänge aktualisieren Menge/Wert nur bei vollständig belegten Kosten; Verbrauch erhält den am Verbrauchstag gültigen Durchschnittspreis.
4. WIP bindet Materialentnahmen, genehmigte direkte Arbeitszeit, tatsächlich zurechenbare Maschinenkosten und bestätigte Fertigungsgemeinkosten.
5. Fertigstellung bildet bewertete Lose. D-0170 FIFO gilt für eigene Fertigwaren. Versand senkt Losmenge und Loswert; COGS ist centgenau gleich dem Versandwertabgang.
6. Fehlende Quelle, ungeklärte Menge/Einheit oder nicht verteilte Kosten = PENDING. Physischer Versand kann weitergehen, ein vollständiger Finanzjahres-PASS jedoch nicht.

HGB §255 nennt Material-/Fertigungskosten und angemessene Fertigungsgemeinkosten sowie fertigungsausgelösten Anlagenwerteverzehr als Herstellungskostenbestandteile; Forschung und Vertrieb dürfen nicht einbezogen werden. Quelle: https://www.gesetze-im-internet.de/hgb/__255.html

**BAB-Abhängigkeit:** Weil eine vollständige BAB-Oberfläche auf eine spätere Version verschoben wurde, empfehle ich keine fingierte Vollkostenlösung. Zwei ehrliche Varianten:
- **A (Empfehlung für ein begrenztes V3-Inkrement):** belegte direkte Istkosten plus eine vom A03 bestätigte, versionierte Kostenpool-/Treiberregel; nicht verteilte Gemeinkosten bleiben als offener Betrag sichtbar und begrenzen den COGS-/G7-PASS.
- **B:** COGS bleibt PENDING, bis BAB/Kostenpools verfügbar sind; T-0077 G7 und T-0069 G3 bleiben offen.
Angebotsplanwerte dürfen nicht als Istkosten verwendet werden.

## 5. Hauptbuch und Jahresabgleich

**Vorgeschlagenes Postingmodell**

- Jeder Posting-fähige Event bindet stabile Quelle, Run, Vertrags-/Lohn-/Steuer-/Produktionsreferenzen, effektives Datum, Periode, Währung, Parameterstand und Dedupe-ID.
- Ein versionierter Posting-Adapter schreibt Soll/Haben-Zeilen; je Event gilt centgenau Summe Soll = Summe Haben. Keine direkte Saldenüberschreibung.
- AR, AP, Payroll, Steuer, Kredit/Dispo, Material/WIP/Fertigware und Bank führen Nebenbücher und abgestimmte Kontrollkonten.
- Korrektur: referenzierte Stornierung plus neue Buchung, nie stilles Überschreiben. Save/Restore und Replay müssen denselben Journal- und Endsaldohash reproduzieren.
- Monatsabschluss: Anfang + Zugänge − Abgänge = Ende je Kontrollkonto; Bank, OP, Payroll, Steuer, Kredite, Bestand, WIP, Fertigware und COGS gegeneinander prüfen; PENDING verhindert PASS.
- Jahresabschluss: Vorjahresschluss = Folgejahrseröffnung; Bilanz und GuV ergeben sich aus denselben abgeschlossenen Perioden. Ergebnisfortschreibung ins Eigenkapital ist nachvollziehbar. Kein erfundener Ausgleichsposten.
- Vor Umsetzung: freigegebener Kontenrahmen, Soll/Haben-Zuordnung, Rundung/Periode, Storno-, Autorisierungs- und Korrekturregeln.

HGB §§238/242 belegen Nachvollziehbarkeit und – für die jeweils erfassten Kaufleute – Eröffnungs-/Jahresbilanz und GuV. Rechtsform und anwendbare Erleichterungen sind separat zu prüfen: https://www.gesetze-im-internet.de/hgb/__238.html und https://www.gesetze-im-internet.de/hgb/__242.html

**Startbilanz-Blocker:** D-0152 nennt 10.000 € Bank und Grundausstattung, aber kein monetäres Ausstattungsinventar und keinen expliziten Eigenmittel-/Kapitalzuflussbeleg. Daher kann eine vollständige Startbilanz derzeit nicht belegt werden. Für den Jahresabgleich müssen Wert oder ausdrückliche Nichtbilanzierung der Grundausstattung und die Herkunft der 10.000 € als Szenarioannahme bestätigt werden.

## Abschlussreihenfolge und messbare Gates

1. Nutzer entscheidet die fünf Vorschläge und die gekennzeichneten Start-/Rechtsstandsfragen.
2. A03 erstellt Kontierungs-/Periodenvertrag; A02 bindet Ereignisquellen; A04 prüft Save/Restore-Grenzen. Je Slice zuerst A03-Fachreview, danach A09 unabhängige QA.
3. Für jeden Slice: Positivlauf, fehlende Quelle, Duplikat/Replay, Monatswechsel, Restore und Bank-/OP-Kontrollsaldo.
4. T-0077 G7 PASS nur bei vollständig belegtem, gebuchtem und centgenau ausgeglichenem Jahresfluss ohne erforderliches PENDING. Danach T-0074/G3 und T-0080/G10 reviewen.
5. 12-Monatsläufe über alle vier T-0078-Profile müssen Einnahmen, eigene Auszahlungen, Payroll, Steuern, Kredit/Dispo, Bestand/WIP/COGS, GuV, Bilanz und Kontrollen abstimmen. Die vier Profilsmokes aus T-0075/76 allein erfüllen dieses Gate nicht.

## Freigabeebenen

| Ebene | Status | Fehlender Nachweis |
|---|---|---|
| Domain-/Eventvertrag | PROPOSED | Nutzerentscheidung und A03-Fachvertrag |
| Runtime/API | NEIN | erst nach freigegebenem Eventvertrag |
| Schema/Persistenz | NEIN | separate A04-Prüfung/Freigabe |
| Finanzmutation | NEIN | keine Mutation durch diesen Vorschlag |
| Release | NEIN | T-0077/T-0069-Gates offen |

Amtliche Quellen am 2026-11-08 geprüft: UStG §18, EStG §41a, SGB IV §23, HGB §§238/242/255, BGB §488. Sie stützen nur die im Text genannten Rechtsrahmen und ersetzen keine individuelle Steuer-/Rechts-/Bilanzprüfung.