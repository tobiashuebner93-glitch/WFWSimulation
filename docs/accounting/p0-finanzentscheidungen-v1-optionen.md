# A03 – P0-Optionen für Finanzentscheidungen V1

**Stand:** 2026-09-26  
**Rolle:** A03 – ACCOUNTING_FINANCE  
**Bezug:** MG-000 / SLG-000.2 / D-0010 / CP-0014  
**Status:** Entscheidungsgrundlage; keine Nutzerentscheidung, Implementierungs- oder Architekturfreigabe.

## Zweck und Bindungen

Dieses Papier bereitet die P0-Themen B–E aus CP-0014 für A01 und den Nutzer vor. D-0010 bleibt unverändert und maßgeblich. V1 verarbeitet Aufträge vollständig: keine Teilproduktion, Teillieferung, Teilrechnung oder Teilzahlung. Spätere Anzahlungen und zusätzliche Vertragstermine sollen grundsätzlich möglich bleiben. Rechnungsbeträge sind differenziert darzustellen; ein einzelner Gesamtbetrag genügt nicht. Ein statischer/vereinfachter BAB gehört zu V1. Das Startunternehmen hat gemieteten Raum, eine Maschine, drei Beschäftigte und 50.000 € Startbudget; Stichtag und finanzielle Klassifikation sind nicht festgelegt.

Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED. Das Datenmodell ist ein fachlich/logischer Vorschlag, keine Implementierungsfreigabe. D-0010 wird durch dieses Papier nicht geändert. „Technische Konsequenz“ benennt Anforderungen an das bereits vorgeschlagene Modell, keine Architekturentscheidung.

## B. Betrags- und Steuersemantik

### Optionen

| Option | V1-Regel und finanzielle Wirkung | Accounting / Simulation / Datenmodell | Vor- und Nachteile |
|---|---|---|---|
| **B1 – Einheitlicher MVP-Betrag ohne Steuerberechnung (Empfehlung)** | Vertragspreis, Kosten, Erlös und Rechnung verwenden denselben vereinbarten V1-Betrag. V1 berechnet keine Umsatzsteuer. Rechnung zeigt getrennt Positionssumme, Steuerbetrag als „nicht berechnet“ (nicht als steuerlich 0 ausgewiesen) und zahlbaren Gesamtbetrag. Gesamtbetrag entspricht dem vereinbarten Betrag. | **Accounting-Regel:** Ergebnis verwendet Positionsbeträge derselben V1-Basis; Zahlung entspricht Rechnungs-Gesamtbetrag. **Simulation:** übergibt Preis-/Kostenbetrag und Kennzeichen „Steuer nicht modelliert“; keine Steuersimulation. **Datenmodell:** getrennte Betragsfelder bleiben bestehen; Steuerstatus muss „nicht modelliert“ von einem echten Nullbetrag unterscheiden. | Schnell und verständlich, keine unbelegte Steuerregel. Der Betrag ist weder als netto noch brutto auszugeben; reale Steuerwirkung bleibt außerhalb der Simulation. |
| **B2 – Vereinfachte, ausdrücklich simulierte Steuerkomponente** | Nutzer bestätigt einen allgemeinen Simulationssatz; Rechnung zeigt Basisbetrag, simulierten Steuerbetrag und Gesamtbetrag. Die Simulation rechnet Steuerbeträge, behauptet aber keine gesetzliche Korrektheit oder reale Steuerpflicht. Aufwand/Erlös/Bestand bleiben auf der vereinbarten Basis; Steuerkomponente wird getrennt gehalten und beeinflusst Auftragsergebnis nicht. | **Accounting-Regel:** getrennte Basis-, Steuer- und Gesamtbeträge; keine Steuerkomponente im Auftragsergebnis. **Simulation:** muss Satzversion und Berechnungs-/Rundungszeitpunkt übergeben. **Datenmodell:** Betragstyp, Steuerkennung/-status und getrennte Linienfelder verwenden; Modell hat diese Felder bereits vorgesehen. | Lern-/Darstellungswert und sichtbare Betragszerlegung. Benötigt eine vom Nutzer gewählte Simulationsannahme, erhöht Erklärungs- und Testaufwand und darf nicht als deutsches Steuerrecht erscheinen. |

### Empfehlung und Entscheidung

**A03 empfiehlt B1 für V1.** Es erfüllt D-0010s differenzierte Darstellung, wenn Positionssumme, nicht modellierter Steuerstatus und Gesamtbetrag getrennt sichtbar sind. Kein Feld darf irreführend „Netto“, „Brutto“ oder „Umsatzsteuer 0 %“ heißen, solange das nicht beschlossen ist.

- **Accounting-Regel:** dieselbe V1-Betragsbasis in Angebot, Vertrag, Beschaffung, Kosten, Erlös und Zahlung verwenden; keine Steuerwirkung im Ergebnis.
- **Technische Konsequenz:** Geldwerte dezimal und nach Währung führen; Steuerstatus/Komponente von Betrag 0 unterscheidbar halten; Rundungsregeln für Anzeige und Summen vor Implementierung bestimmen.
- **Nutzerentscheidung:** B1 oder B2 wählen; bei B2 Simulationssatz, Rundung und sichtbaren Hinweis bestätigen.
- **Zwingend vor Implementierung:** eindeutige Betragssprache; Preis-/Kostenbasis; Zusammenhang Positionssumme, Steuerkomponente, Rechnungs-Gesamtbetrag und Zahlung. Bei B2 zusätzlich expliziter Simulationssatz und Versionierung.
- **Ausdrücklich nicht erforderlich für V1:** vollständige Steuerengine, Steuersatzhistorie realer Rechtslagen, Vorsteuer-/Umsatzsteuer-Meldung, Steuerbefreiungs-/Rechtsformprüfung, Steuererklärung und Steuerperioden.

## C. Zahlungsbedingungen und Forderungs-/Verbindlichkeitstrigger

### V1-Optionen

| Option | V1-Regel und finanzielle Wirkung | Accounting / Simulation / Datenmodell | Vor- und Nachteile |
|---|---|---|---|
| **C1 – Ein vollständiger Zahlungstermin nach Rechnung/Eingang (Empfehlung)** | Je Kundenrechnung wird genau eine vollständige Zahlung zum vereinbarten Fälligkeitstag erwartet; kein Teilbetrag. Bei Lieferanten analog: eine volle Zahlung nach vereinbartem Ziel, bezogen auf den festgelegten Verbindlichkeitstrigger. Standardziel kann 0 Simulationszeiteinheiten („sofort fällig“) sein, falls der Nutzer das wählt. | **Accounting-Regel:** Kundenforderung entsteht bei freigegebener vollständiger Rechnung; Lieferantenverbindlichkeit entsteht bei vertraglichem Trigger (Empfehlung: akzeptierter Wareneingang bzw. bestätigte Fremdleistung), auch wenn die Lieferantenrechnung später eintrifft. Rechnung belegt/konkretisiert Betrag und Ziel. **Simulation:** löst Zahlung nur am bestätigten Fälligkeitstag bzw. gemäß Nutzerwahl „manuell/automatisch“ aus. **Datenmodell:** ein PaymentTerm je Vertragsrichtung reicht für V1; vorhandene Sequenz-/Triggerfelder erlauben spätere Erweiterung. | Kleinster konsistenter Ablauf, klare offene Posten und Liquidität. Eine einzige Bedingung bildet keine Anzahlungen oder mehrere Termine ab; späterer Ausbau bleibt nötig. |
| **C2 – Ein V1-Zahlungsereignis an einem vertraglich gewählten Trigger** | Pro Kunden- bzw. Lieferantenvertrag wird entweder „bei Rechnung“ oder „nach Zahlungsziel“ als vollständiger Zahlungstermin gewählt. Zahlung bleibt jeweils einmalig und vollständig; keine Teilzahlung. | **Accounting-Regel:** Forderung/Verbindlichkeit und Zahlung sind getrennt. Vertrag bestimmt Trigger/Ziel; Forderung entsteht bei Rechnung. Eine Zahlung vor Rechnung wäre in V1 gesperrt, um Anzahlungsbehandlung nicht stillschweigend festzulegen. **Simulation:** fälligen Trigger aus Vertrag plus Rechnung/Eingang bestimmen. **Datenmodell:** vorhandene PaymentTerm-Felder tragen Trigger und Fälligkeit; Geschäftsvalidierung beschränkt V1 auf genau einen Termin. | Mehr Spielraum bei Konditionen mit begrenztem Scope. Mehr Ereignisreihenfolge und Testfälle; „bei Rechnung“ und „nach Ziel“ müssen eindeutig definiert werden. |
| **C3 – Eine vollständige Vorauszahlung bei Auftrag/Bestellung** | Einmaliger voller Betrag wird beim vertraglichen Starttrigger fällig, bevor Lieferung/Leistung erfolgt. Keine Teilanzahlung und kein zweiter Restzahlungstermin in V1. | **Accounting-Regel:** Zahlung vor Rechnung/Leistung darf nicht als Umsatz/Erlös behandelt werden. A03 muss sie als vertragliche Zahlung getrennt von Forderung/Verbindlichkeit klassifizieren und später verrechnen. **Simulation:** Zahlungsfähigkeit am Trigger prüfen; Zahlungseingang/-ausgang tritt nur bei tatsächlicher Zahlung ein. **Datenmodell:** vorhandene PaymentTermPayment kann Zahlung vor Invoice/OP referenzieren; es fehlen trotzdem beschlossene Klassifikation und Verrechnungsregel. | Erlaubt eine V1-Vorauszahlungsvariante und passt zu späteren Anzahlungen. Zusätzliche Finanzzustände und Verrechnung nötig; für einfaches V1 unnötige Komplexität, besonders vor Entscheidung der Betragssemantik. |

### Empfohlene V1-Regel und klare Begriffe

**A03 empfiehlt C1** mit genau einem vollständigen Zahlungstermin je Kunden- und Lieferantenverpflichtung. V1 kann ein im Vertrag vereinbartes Zahlungsziel ab Rechnungsdatum (Kunde) bzw. festgelegtem Lieferantenbeleg-/Triggerdatum verwenden. Falls die Simulation mit manuellen/automatischen Zahlungen arbeitet, ist das eine separate Nutzerentscheidung. Kein Fälligkeitsereignis erzeugt selbst eine Liquiditätsbewegung.

1. **Vertrag:** legt Preis, Umfang und genau eine V1-Zahlungsbedingung fest; noch keine Zahlung.
2. **Leistung/Eingang:** operative Tatsache. Lieferung/Abnahme belegt Kundenerfüllung; akzeptierter Wareneingang/Fremdleistung belegt Lieferantenerfüllung.
3. **Rechnung:** Kundenseitig erzeugt die freigegebene vollständige Rechnung die Forderung und den vereinfachten Erlös (vorbehaltlich B). Lieferantenseitig dokumentiert die Rechnung den Betrag/das Ziel und gleicht die vorherige Verbindlichkeitsquelle ab; sie ist nicht zwingend der Ursprung.
4. **Forderung/Verbindlichkeit:** offener Finanzanspruch/-betrag mit vereinbartem Ursprung, Fälligkeit und vollem Restbetrag. Vertragliche Vereinbarung bestimmt Trigger und Kondition im Sinne von D-0010; sie ersetzt nicht das Ereignis, das den Anspruch tatsächlich fällig/abrechenbar macht.
5. **Zahlung:** tatsächlicher voller Geldeingang/-ausgang am Zahlungsdatum; erst dann ändert sich Liquidität und der offene Posten wird ausgeglichen.

- **Accounting-Regel:** Forderung bei freigegebener vollständiger Kundenrechnung nach abrechenbarer Leistung. Verbindlichkeit gemäß Vertrag; A03 empfiehlt Ansatz bei akzeptiertem Eingang/Fremdleistung, mit späterer Lieferantenrechnung als Nachweis/Abstimmung. Betrag und Fälligkeit bei abweichender Rechnung nach vereinbarter Regel abgleichen.
- **Technische Konsequenz:** getrennte Referenzen für Vertragstermin, Rechnung, Forderung/Verbindlichkeit und Zahlung erhalten. Das Modell kann Payable ohne Lieferantenrechnung und Zahlungstermin vor Rechnung abbilden. V1-Validierung erlaubt vollständige Einmalzahlung und genau einen aktiven Termin; Erweiterbarkeit bleibt erhalten.
- **Nutzerentscheidung:** C1/C2/C3; Standardkundenziel und Lieferantenziel; Bezugspunkt/Fälligkeit; automatische oder manuelle Zahlung; darf Vorauszahlung in V1 stattfinden? A03 empfiehlt nein; C3 ist nur bei bewusster Scope-/Regelwahl.
- **Zwingend vor Implementierung:** eindeutiger Auslöser/Fälligkeitsbezug von Forderung und Verbindlichkeit; einheitliches V1-Zahlungsmodell; Simulationsdatum und Zahlungszeitpunkt (A02); Behandlung fehlender Liquidität; Zuordnung Lieferantenrechnung zu Ursprung; Regeln für genau volle Zahlung. Für Anzahlungen zusätzlich Klassifikation und spätere Verrechnung.
- **Später möglich:** Vorschüsse, mehrere Vertragstermine, Anzahlungen, Nachzahlungen, Skonto, Teilzahlungen und Mahnung. Keine dieser späteren Erweiterungen wird durch das Datenmodell bereits fachlich beschlossen.

## D. Kostenmethode und statischer BAB

### Kosten- und Verteilungsoptionen

| Option | V1-Regel und finanzielles Ergebnis | Accounting / Simulation / Datenmodell | Vor- und Nachteile |
|---|---|---|---|
| **D1 – Direkte Istkosten plus statischer BAB-Zuschlag (Empfehlung)** | Material und Fremdleistungen direkt. Arbeitskosten aus gemeldeten Stunden × festem Satz; Maschinen-/Fertigungskosten aus Maschinenstunden × festem Satz. Statischer BAB ordnet vorab beschlossene Gemeinkostenblöcke mit festen Prozentsätzen auf Fertigungslöhne oder Maschinenkosten zu. Auftragsergebnis = Erlös − direkte Auftragskosten − zugerechnete Gemeinkosten. | **Accounting-Regel:** direkte Istkosten und BAB-Zuschlag getrennt halten; BAB-Kostenblöcke nicht nochmals als direkte Kosten zählen. **Simulation:** liefert tatsächliche Materialmenge, Arbeits-/Maschinenstunden und Laufabschluss. **Datenmodell:** BabVersion/BabLine, CostEntry und OrderResult passen; Kostenstellen, Treiber und Raten als versionierte statische Werte. | Nachvollziehbar, beantwortet D-0010s BAB-Vorgabe und bildet Fertigung einfach ab. Feste Schlüssel sind Näherungen; braucht trotzdem vom Nutzer bestätigte Werte und eine Zuteilungsbasis. |
| **D2 – Direkte Istkosten plus pauschaler Gemeinkostenbetrag je Auftrag** | Material, Arbeit/Fremdleistung/Maschine direkt wie D1; je Auftrag ein statischer pauschaler Gemeinkostenbetrag oder einheitlicher Prozentsatz. | **Accounting-Regel:** keine Kostenstellenumlage; Pauschale ist explizit kalkulatorische V1-Zurechnung und separat ausweisen. **Simulation:** keine zusätzlichen Ressourcenmengen außer Auftragsabschluss. **Datenmodell:** BabLine kann feste Pauschale/Rate enthalten; keine dynamischen Treiber erforderlich. | Am einfachsten umzusetzen und zu erklären. Verzerrt kleine/große Aufträge ähnlich und bildet BAB-Kostenstellen nur grob ab. |
| **D3 – Statischer BAB mit mehreren Kostenstellen und einfachen Bezugsgrößen** | Kostenarten auf z.B. Material-/Beschaffung, Fertigung, Verwaltung und Vertrieb verteilen; BAB verteilt Gemeinkosten mithilfe fester Sätze auf Materialwert, Fertigungsstunden oder Maschinenstunden. Auftragsergebnis enthält zugewiesene Anteile. | **Accounting-Regel:** dokumentierte Kostenstellen-/Verteilungsmatrix und Reihenfolge; keine dynamische Vollkostenrechnung. **Simulation:** muss die gewählten Bezugsgrößen liefern. **Datenmodell:** BAB-Zeilen mit Kostenart, Stelle, Basis, Rate, Ziel und Regelversion; Modell sieht diese Konzeptfelder vor. | Höherer Lern-/Steuerungswert und dem BAB ähnlicher. Mehr Werte, Datenbedarf und Erklärungsaufwand; Gefahr, Vereinfachungen als reale Kostenrechnung zu missverstehen. |

### Empfehlung und Kostenumfang

**A03 empfiehlt D1**: kleiner statischer BAB mit wenigen Kostenblöcken und festen, offen ausgewiesenen Zuschlagssätzen. Bis der Nutzer konkrete Werte/Basen bestätigt, werden keine Beträge oder Sätze erfunden. Vorschlag für V1-Kostenarten:

- Materialeinzelkosten: tatsächlicher Verbrauch × gewählter Materialwert.
- Fremdleistung: bestätigte Lieferantenleistung als direkte Auftragskosten.
- Fertigungslöhne: auftragsbezogene Arbeitsstunden × statischer interner Satz; keine Lohnabrechnung.
- Maschinen-/Fertigungskosten: Maschinenstunden × statischer Satz, sofern A02 diese Stunden zuverlässig liefert.
- Energie und Transport: direkte Position, wenn Menge/Beleg dem Auftrag eindeutig zugeordnet ist; sonst allgemeine Kosten.
- Gemeinkosten: nur statische BAB-Kostenblöcke und beschlossene Verteilung; keine parallele willkürliche Pauschale.
- Allgemeine Kosten: z.B. Miete als Unternehmenskosten. Keine automatische Auftragsverteilung, bis BAB-Basis/Rate ausdrücklich gesetzt ist. D-0010 sagt gemieteter Raum; Miethöhe bleibt offen.

- **Accounting-Regel:** Auftragsergebnis nutzt Auftragserlös abzüglich Material, Fremdleistung, auftragsbezogener Arbeits-/Maschinenkosten, belegbarer direkter Transport/Energie und zugeordneter BAB-Gemeinkosten. Startbudget und Vermögensgegenstände sind keine Auftragserlöse/Kosten; laufende Miete wird zeitbezogen allgemeine Kosten, sofern keine bestätigte Verteilung gilt.
- **Technische Konsequenz:** BAB als versionierte statische Eingabe mit Gültigkeitsbeginn; BAB-Auswertung und Auftragsergebnis von A03 berechnen lassen. Quellkosten und zugeteilte Gemeinkosten getrennt nachvollziehbar halten, damit keine Doppelzählung entsteht.
- **Nutzerentscheidung:** D1/D2/D3; Kostenstellen/Kostenblöcke; Bezugsbasis und Satz; ob Maschine/Energie/Transport in V1 mit eigenen Istwerten einfließen; Miete allgemein oder über BAB verteilt. Nutzer liefert/oder bestätigt Startwerte und Sätze.
- **Zwingend vor Implementierung:** konkrete Kostenkategorien, Werte/Sätze oder explizite Null-/Nichtmodelliert-Regel; Bezugsgrößen; Zuordnungszeitpunkt; Umgang mit fehlenden A02-Messwerten; eindeutige Regel gegen Doppelzählung von BAB- und direkten Kosten; Periode/Gültigkeit einer BAB-Version.
- **V1 nicht nötig:** dynamische BAB-Verrechnung, Zuschlagskalkulation mit echten Ist-Gemeinkosten, Kostenstellenrechnung mit Umlageketten, Lohnnebenkosten, Abschreibungs-/Instandhaltungsrechnung, detaillierte Energiekostenmessung, Gewinn-/Provisionssystem.

## E. Materialbewertung und Eröffnungsbestand

### Bewertungsoptionen

| Option | V1-Regel und finanzielle Wirkung | Accounting / Simulation / Datenmodell | Vor- und Nachteile |
|---|---|---|---|
| **E1 – Fester V1-Standardpreis je Material (Empfehlung bei kleinem Datenbedarf)** | Jedes Material hat einen bestätigten Start-/Standardpreis. Verbrauch = Menge × Standardpreis. Eingänge verändern Mengenbestand, nicht den Preis; Preisabweichungen werden als Abweichung ausgewiesen oder bis später nicht modelliert. | **Accounting-Regel:** Materialbestand und Auftragskosten bleiben einfach reproduzierbar. **Simulation:** meldet Materialzugang/-verbrauch in Einheiten. **Datenmodell:** Material führt Wertansatz; Bewegungen referenzieren Regel/Preisversion. | Einfach und deterministisch. Preisabweichungen zwischen Einkauf und Standardwert werden ignoriert oder müssen separat gezeigt werden. |
| **E2 – Einstandspreis je Zugang, Verbrauch nach FIFO** | Jeder Zugang speichert Menge und Preis; Verbrauch entnimmt die ältesten verfügbaren Zugänge zuerst. Lagerwert ist Summe verbleibender Schichten. | **Accounting-Regel:** tatsächliche Zugangswerte werden erhalten; Auftragsverbrauch kann je Zugang bewertet werden. **Simulation:** braucht nur Mengen und Reihenfolge; A03 ordnet Verbrauch Zugangsschichten zu. **Datenmodell:** InventoryMovement/Bewertungsreferenz muss Zugang und Verbrauch verbinden. | Anschauliche Preisverfolgung und keine Durchschnittsneuberechnung. Zusätzliche Schichtlogik, Reihenfolge und Korrekturaufwand. |
| **E3 – Gleitender Durchschnitt je Material** | Nach jedem Eingang wird ein neuer Durchschnittswert berechnet; Verbrauch wird mit diesem Wert angesetzt. Lagerwert = Restmenge × Durchschnitt. | **Accounting-Regel:** ein Wert je Material zum Verbrauchszeitpunkt. **Simulation:** meldet Ein-/Ausgangsmenge; A03 braucht geordnete wirksame Ereignisse. **Datenmodell:** Durchschnittswert/Version oder auswertbare Bewegungsfolge, Rundung und Korrekturregeln. | Glättet Einkaufspreisschwankungen. Mehr zeitabhängige Rechen- und Replay-Regeln; für kleines V1 mehr Aufwand als E1. |

### Eröffnung und Startunternehmen

**A03 empfiehlt E1**, sofern für jedes Startmaterial ein plausibler Standardwert festgelegt wird. Fehlen solche Werte, ist E2 die bessere, aber aufwendigere Alternative; der User sollte nicht stillschweigend einen Preis erhalten.

- **Accounting-Regel:** Lagerbestand = Eröffnungsmenge + akzeptierte Zugänge − bestätigter Verbrauch. Lagerwert wird aus Menge und gewählter Bewertungsregel abgeleitet. Materialverbrauch ist erst bei Verbrauch auftragsbezogene Kosten; Einkauf ist nicht automatisch sofortiger Auftragsaufwand.
- **Technische Konsequenz:** Eröffnungsmenge und Bewertungsbasis je Material zum festen Startstichtag; Zugangspreis/Standardpreis und Bewertungsregel versioniert referenzieren; Mengen- und Wertkorrekturen nachvollziehbar halten.
- **Nutzerentscheidung:** E1/E2/E3; Stichtag und Startbestände samt Einheiten/Werten; Umgang mit Bezugskosten/Preisabweichungen; Währung und Rundung.
- **Zwingend vor Implementierung:** mindestens Startstichtag, Währung, Anfangsmenge und Wertbasis aller für V1 nutzbaren Materialien, Verbrauchs-/Zugangsregeln und eine Bewertungsmethode. A02 bestimmt operative Materialmengen; A03 bewertet sie.
- **Nicht nötig für V1:** FIFO/gleitender Durchschnitt, falls E1 gewählt wird; LIFO, Niederstwert, Inventur-/Abschreibungsregeln und vollständige Lagerbuchhaltung.

**50.000 € Startbudget und Betriebsmittel (D-0010):**

| V1-Option | Finanzielle Einordnung | Folgen / offene Voraussetzung |
|---|---|---|
| **E-Start1 – 50.000 € als Eröffnungsliquidität (Empfehlung)** | 50.000 € ist Zahlungsmittelbestand am Startstichtag. Es ist weder Erlös noch Gewinn. Gegenkonto/Eigentümerfinanzierung wird nur erfasst, wenn der Nutzer die Eröffnungsquelle fachlich festlegt; kein ausgeglichener Bilanzanspruch wird erfunden. | Einfacher Cash-Start für Liquiditätssimulation. Nutzer muss bestätigen, dass das gesamte Budget verfügbarer Geldbestand ist, und Herkunft/Eröffnungsgegenposten klären, falls Bilanzsicht verlangt wird. |
| **E-Start2 – 50.000 € als Gesamtbudget/Finanzierungsrahmen** | Betrag ist Obergrenze verfügbarer Mittel; Startliquidität ergibt sich erst nach bestätigten Anfangsauszahlungen/Reservierungen. Reservierung allein ist keine Ausgabe. | Passt zu „Budget“, benötigt aber Startzahlungs-/Reservierungsregeln und Risiko, Cash von Planbudget zu verwechseln. |
| **E-Start3 – 50.000 € als Eröffnungsfinanzierung mit Aufteilung** | Nutzer legt fest, welcher Anteil Zahlungsmittel und welcher Anteil bereits eingesetzte Mittel/Finanzierung repräsentiert. | Liefert reicheren Startzustand; verlangt Werte, Herkunft und Behandlung vorhandener Vermögensgegenstände, die D-0010 nicht nennt. |

**Empfehlung:** E-Start1 nur nach expliziter Nutzerbestätigung der Bedeutung „verfügbare Anfangsliquidität“. Das vorhandene Betriebsmittelprofil (gemieteter Raum, eine Maschine, drei Beschäftigte) ist operativ vorgegeben, aber keine vollständige Bilanz. Die Maschine wird bis zur Klärung als vorhandene Produktionskapazität geführt; weder Eigentumswert/Abschreibung noch Leasingverbindlichkeit werden unterstellt. Mietzins, Löhne/Kostensätze, Anfangsbestand und offene Forderungen/Verbindlichkeiten brauchen eigene bestätigte Startwerte. Startbudget ist niemals Auftragserlös oder Gewinn.

## Zusammengefasste fachliche Empfehlung (keine Entscheidung)

| Bereich | A03-Vorschlag für V1 | Nutzer muss bestätigen |
|---|---|---|
| B – Beträge | B1: einheitlicher, nicht als netto/brutto bezeichneter V1-Betrag; differenzierte Rechnungsfelder; Steuer nicht modelliert | B1 oder B2 und sichtbare Begriffe |
| C – Zahlungen | C1: ein voller Termin, keine Teilzahlung; Forderung bei vollständiger Kundenrechnung; Verbindlichkeit bei akzeptiertem Eingang/Leistung laut Vertrag; Liquidität erst bei Zahlung | V1-Ziel/Trigger, Fälligkeitsbezug, Zahlung manuell/automatisch, Vorauszahlung ja/nein |
| D – Kosten/BAB | D1: direkte Istkosten plus statischer BAB-Zuschlag mit wenigen Kostenblöcken und festen Basen | BAB-Blöcke, Verteilungsbasis/-sätze, verfügbare Ressourcenraten und Miete |
| E – Material/Eröffnung | E1: fester Materialpreis, sofern Startwerte vorliegen; 50.000 € als Liquidität nur nach Bestätigung | Bewertungsmethode, Startstichtag/-bestand/-preise, Budgetklassifikation, Startwerte und Maschinenstatus |

## Änderungsnachweis

Neu erstellt: diese Entscheidungsgrundlage. Sie konkretisiert Optionen für CP-0014 P0 B–E, ohne D-0010 oder frühere Fachspezifikationen zu ändern. Keine Implementierung, Schemaänderung, D-ID-/ADR-Änderung oder Architekturfreigabe.
