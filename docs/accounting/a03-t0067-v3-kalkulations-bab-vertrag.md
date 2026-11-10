# A03 – T-0067 V3-Kalkulations- und Grund-BAB-Vertrag

**Status:** A03-Fachvertrag aktualisiert gemäß ausdrücklich bestätigtem D-0162; keine Schema-, Architektur- oder Buchungsfreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 und SLG-002.5
**Ticket:** T-0067
**Profilbezug:** V3-Arbeitsstand; keine rückwirkende Änderung des abgenommenen V2-Profils oder der Startprofile 2019/2027
**Vorgänger:** CP-0275 (Entwurf); Git-Basis vor dieser Arbeit `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`
**Entscheidungsbezug:** D-0159 bleibt für Lernabnahme maßgeblich. D-0162 definiert die hier dokumentierte V3-Kalkulations- und Kennzahlensicht. D-0160 bleibt auf V2 beschränkt; die V3-Regel erweitert weder V1 noch V2 und trifft keine Steuer-/Rechnungsentscheidung für andere Versionen. V1-BAB-Entscheidungen D-0062–D-0076 gelten nicht automatisch als V3-BAB-Vorgabe.

## 1. Zweck und Reichweite

Dieser Vertrag beschreibt die fachliche Rechnung für Angebots-/Produktplanung und einen dynamischen, einfachen V3-BAB. Er ist ein prüfbarer Rechenvertrag, keine Schema-, Architektur- oder Buchungsfreigabe. Er setzt weder Kostenbeträge noch Zuschlagsätze, Preise, Steuerstatus, Finanzierung oder neue Hauptbuchregeln fest.

Der Spieler muss pro Auftrags- und Produktkalkulation mindestens drei Annahmen aktiv eingeben oder bestätigen: (1) Menge/Materialverbrauch, (2) Zeit/Leistung und (3) Preis/Kostensatz. Eingabe, Einheit, Quelle/Annahme und Änderungswirkung bleiben sichtbar. Ein positiver oder negativer Kalkulationswert löst für sich allein weder Zuschlag noch Ablehnung aus; die Geschäftsentscheidung bleibt beim Spieler und den separat vereinbarten Marktregeln.

## 2. Begriffe und Eingaben

- `q`: geplante Auftrags- oder Produktmenge [Stück/Los].
- `m_i`: Materialverbrauch von Material `i` je Einheit [Mengeneinheit/Stück].
- `p_i`: bestätigter Beschaffungspreis je Materialeinheit [Währung/Mengeneinheit].
- `h_j`: geplanter direkter Arbeitsaufwand einer Tätigkeit/Rolle je Einheit [h/Stück]; `r_j`: dazu bestätigter Kostensatz [Währung/h].
- `u_k`: geplanter Maschinen-/Betriebsverbrauch je Einheit [h/Stück oder anderer ausgewiesener Treiber]; `s_k`: dazu bestätigter Kostensatz [Währung/Treiber].
- `x_l`: direkt zurechenbare Fremdleistung oder sonstige Einzelkosten [Währung je Los oder Einheit, eindeutig gekennzeichnet].
- `R`: Nettoplanpreis des Angebots bzw. Produkts für dieselbe Menge und Periode, ohne SimTAX. Das ist ausschließlich die V3-Kalkulationsbasis; daraus folgt keine Steuer-/Rechnungsregel für andere Versionen.
- `B_c`: vom Spieler bestätigte Bezugsbasis des BAB-Kostenträgers `c` (z. B. Materialwert, Lohnwert oder physischer Treiber). Ein Satz darf nur mit derselben Einheit und Bezugsbasis angewendet werden, mit der sein Nenner gebildet wurde.

Fehlende Werte werden als „nicht kalkulierbar“ ausgewiesen, nicht durch stille Nullwerte, V1/V2-Startwerte oder einen erfundenen Markt-/Steuersatz ersetzt. Beträge aus anderen Verträgen werden nur mit Einheit, Zeitraum und Steuer-/Preissemantik übernommen.

## 3. Plan-Kalkulation und Deckungsbeitrag

Für Menge `q`:

- Einzelmaterial `M_i = q × m_i × p_i`; Materialsumme `M = Σ M_i`.
- Direkte Arbeit `L_j = q × h_j × r_j`; Arbeitssumme `L = Σ L_j`.
- Direkte Maschinen-/Betriebskosten `K_k = q × u_k × s_k`; Summe `K = Σ K_k`.
- Direkt zurechenbare Fremdleistungen/sonstige Einzelkosten `X = Σ x_l`.
- `Direct = M + L + K + X`.
- `DB I = R − Σ ausdrücklich als variabel klassifizierte Einzelkosten`.
- Direkte Arbeits- und Maschinenkosten werden getrennt ausgewiesen und nicht allein aufgrund ihrer Direktzurechenbarkeit als variabel eingestuft. Nicht als variabel klassifizierte direkte Kosten werden nicht in DB I abgezogen.
- Zusätzlich wird `Ergebnis nach direkten Einzelkosten = R − Direct` ausgewiesen; jede direkte Einzelkostenposition wird dabei genau einmal berücksichtigt. Der Name darf nicht als zusätzlicher Deckungsbeitrag missverstanden werden.
- BAB-Gemeinkosten werden getrennt ausgewiesen. `Kalkulationsergebnis nach verrechneten Gemeinkosten = R − Direct − BAB-Anteil`, sofern alle benötigten Werte und dieselbe Preis-/Steuerbasis vorliegen. Dieses Vollkosten-Ergebnis ist kein Deckungsbeitrag.

`DB I`, direkte Arbeits-/Maschinenkosten und `Ergebnis nach direkten Einzelkosten` bleiben getrennte, beschriftete Werte. Die Klassifikation als variabel muss ausdrücklich in den jeweiligen Eingangsdaten feststehen; andernfalls bleibt die Position außerhalb von DB I und wird im Ergebnis nach direkten Einzelkosten genau einmal abgezogen.

Die Plan-Kalkulation ist eine Vorschau. Erstellen oder bearbeiten eines Entwurfs erzeugt weder Erlös, Kosten, Forderung/Verbindlichkeit noch Cashbewegung. Eine Preis-/Vertragsänderung folgt dem eigenen Markt-/Vertragsvertrag; A03 setzt hier keine Mindestmarge oder Zuschlagsregel.

## 4. Dynamischer Grund-BAB

### 4.1 Eingabe und Verteilung

Der Spieler gibt je Quellkostenstelle ihre primären Kosten `P_s` für eine ausdrücklich angegebene, gemeinsame Periode und Kostenbasis ein und ordnet sie einer Kostenart sowie einer BAB-Verteilung zu. Jede Verteilung nennt Empfänger, Schlüsseltyp und Schlüsselmenge `a_{s,c}`. Schlüsselwerte müssen nichtnegativ sein und bei mehreren Empfängern in Summe positiv sein.

Bei Mengen-/Treiberverteilung:

`Anteil_{s,c} = P_s × a_{s,c} / Σ_c(a_{s,c})`.

Bei ausdrücklich eingegebenen Anteilen müssen die Gewichte `w_{s,c}` zusammen 1 bzw. 100 % ergeben und:

`Anteil_{s,c} = P_s × w_{s,c}`.

Nach der Verteilung gilt je Quellkostenstelle: `Σ_c Anteil_{s,c} = P_s`; über den ganzen BAB: `Σ_c empfangene primäre Kosten = Σ_s P_s`. Der BAB darf Kosten nur verteilen, nicht erzeugen oder aus dem Gesamtsummenabgleich entfernen. Es gibt in diesem Grundvertrag keine verpflichtende Kostenart, keinen Zuschlagssatz und keine automatische Kostenstelle. Ein leerer oder nichtpositiver Verteilungsnenner ist ein Validierungsfehler.

### 4.1.1 Verteilungsschlüssel und Nenner des Verrechnungssatzes

Die beiden Verteilungsmodi haben getrennte Semantik; unter einem Satzlabel darf kein anderer Nenner als der Verteilung zugrunde liegen:

- **`keys` = physische Treibermengen:** Alle Empfängerschlüssel sind nichtnegative Mengen desselben Treibers, derselben Einheit und derselben Periode. Der Gesamtnenner des Satzes wird deterministisch aus `B_g = Σ_c a_{s,c}` gebildet. `s_g = P_s / B_g`; der Empfängeranteil ist `P_s × a_{s,c} / B_g`. Ein zusätzliches manuelles `basisValue` ist in diesem Modus nicht zulässig. Ist eine externe Basis vorgegeben, muss sie exakt der Summe der Schlüssel entsprechen, sonst wird die Berechnung abgewiesen.
- **`weights` = reine Verteilungsanteile:** Schlüssel sind dimensionslose Gewichte zwischen 0 und 1, deren Summe exakt 1 ist. Sie verteilen den Pool als `P_s × w_{s,c}` und begründen für sich allein keinen Verrechnungssatz pro Mengeneinheit. Ohne separate Treiberbasis wird kein Mengensatz angezeigt. Soll zusätzlich ein Mengensatz berechnet werden, ist eine ausdrücklich getrennte, positive Basis `B_g` mit Einheit und derselben Periode erforderlich. Dann gilt `s_g = P_s / B_g`; die dazu passenden Empfängertreibermengen werden deterministisch als `B_{g,c} = B_g × w_{s,c}` ausgewiesen. So entsprechen ungerundeter Satz × zugewiesener Treibermenge exakt dem ungerundeten Kostenanteil.

Für die Angebotsberechnung hat `weights` deshalb genau eine gemeinsame physische Ratebasis je Quellpool (`rateBasis: { basisKind: 'driver', value, unitLabel, period }`). Empfänger-Angebotsmengen müssen dieselbe Einheit führen und dürfen `B_g × w_{g,c}` nicht überschreiten. Pro Empfänger unabhängige Ratenbasen, verschiedene Treibereinheiten oder eine Mischung aus Geld- und Mengentreibern sind unzulässig. Die reine `allocateV3BabPool`-Verteilung kann ohne Ratebasis durchgeführt werden; daraus entsteht kein Angebotssatz und kein bezifferter Auftrags-BAB-Anteil. Ein Angebot, das einen BAB-Anteil ausweisen soll, muss eine gültige gemeinsame Ratebasis und alle Empfänger-Treibermengen angeben.

Die UI-/Schnittstellennamen müssen den Unterschied sichtbar halten: `keys` zeigt „Treibermenge“ und deren automatisch summierte „Satzbasis“; `weights` zeigt „Verteilungsanteil“ und, falls angegeben, separat „Satzbasis (Treibermenge)“. Ein aus Gewichten gebildeter Nenner darf nie als Stunden-/Mengensatz bezeichnet werden. Perioden- und Einheitabweichung blockieren die Satzberechnung. Die fachliche Prüfung verwendet intern den exakten Wert; D-0162 wird dadurch nicht geändert.
### 4.2 Verrechnungssätze und Kalkulationsbezug

Für jeden Gemeinkostenpool `g` bestätigt der Spieler eine passende Bezugsbasis und den Perioden-Nenner `B_g`. Wenn `B_g` ein Geldbetrag ist, wird ein prozentualer Zuschlag ausgegeben: `z_g = zugeordnete Gemeinkosten_g / B_g`. Wenn `B_g` ein Mengentreiber ist, wird ein Satz in `Währung/Treibereinheit` ausgegeben: `s_g = zugeordnete Gemeinkosten_g / B_g`.

Auftrags-/Produktanteil: `BAB-Anteil_g = z_g × passende Einzelkostenbasis` oder `s_g × passende Treibermenge`. Eine Einheiten-/Bezugsbasenabweichung blockiert die Berechnung mit verständlichem Fehler. Eine Einzelkostenbasis, die bereits Gemeinkosten enthält, darf nicht erneut als Zuschlagsbasis belastet werden.

Der BAB-Bericht zeigt Quellkosten, Schlüssel/Empfänger, verteilte Beträge, Verrechnungssatz samt Einheit und die Reconciliation-Differenz. Reconciliation-Differenz muss `0,00` betragen. Primärkosten und verrechnete BAB-Anteile sind unterschiedliche Sichten derselben Kosten, keine zweimal addierbaren Aufwendungen.

### 4.2.1 Verrechnungssatz: interne Rechengenauigkeit und centgenaue Anzeige

Der Verrechnungssatz wird intern als ungerundeter Quotient der zugeordneten Gemeinkosten über die bestätigte Perioden-Bezugsbasis berechnet (`s_g = P_g / B_g`, `z_g = P_g / B_g`). Für Anzeige wird `s_g` als Währung je Treibereinheit mit zwei Nachkommastellen und `z_g` als Prozentwert mit zwei Nachkommastellen formatiert; beide Werte sind ausdrücklich als gerundet gekennzeichnet. Diese Anzeige ist kein neuer Recheninput: Folgeanteile werden stets mit dem ungerundeten Quotienten und der passenden Bezugsbasis berechnet, nicht aus dem sichtbaren centgerundeten Textwert zurückmultipliziert.

Werden alle Treibermengen eines Pools im selben BAB-Empfängerkreis verteilt, werden zunächst die ungerundeten Empfängeranteile berechnet. Erst danach werden Centanteile centgenau abgerundet und Restcent gemäß Abschnitt 4.3 verteilt. Der exakte Quellkostenbetrag ist das Reconciliation-Ziel. Die stabile Kostenstellen-ID aufsteigend bricht einen Gleichstand gleicher ungerundeter Restfraktionen. Eine Sortierung/Reihenfolge der UI-Liste ändert weder Restcentzuweisung noch Summen.

Beispiel: Gemeinkostenpool `100,01 €`, Gesamtbasis `3 h`; interner Satz `100,01 / 3 = 33,336666… €/h`, in der Anzeige `33,34 €/h (gerundet)`. Drei Kostenstellen mit je `1 h` erhalten aus dem ungerundeten Quotienten zunächst je `33,336666… €`; die centgenaue Verteilung ergibt bei stabilem Gleichstand `33,34 €`, `33,34 €`, `33,33 €`, insgesamt `100,01 €`. Eine Multiplikation des gerundeten Anzeigesatzes mit 3 ergäbe fälschlich `100,02 €` und ist unzulässig.

Das Anzeigeformat auf zwei Dezimalstellen entspricht der centgenauen Darstellungsregel D-0162 und eröffnet keine Nutzerentscheidung über UI-Dezimalstellen. Es verändert weder intern verwendete Präzision, Kostenklassifikation, BAB-Zuordnung, Snapshot noch Buchungs-/Ledgerwirkung. Die genaue technische Dezimaldarstellung oder Persistenz ist kein Schemaentscheid.
### 4.3 Präzision und Restcent

BAB-Rechnungen behalten intern ihre Dezimalpräzision. Veröffentlichte Währungswerte werden centgenau dargestellt. Die Verteilungssummen müssen auf die centgenau dargestellten Ausgangskosten abstimmen. Dazu wird zunächst je Empfänger der ungerundete Anteil berechnet und centgenau abgerundet; verbleibende Cent werden Empfängern nach absteigender ungerundeter Restfraktion zugeteilt. Bei gleicher Restfraktion entscheidet die stabile Kostenstellen-ID aufsteigend. Diese V3-Regel übernimmt keine V1-Aufrundung auf volle Euro (D-0076).

## 5. Ergebnis, Cash und Ledger-Grenze

- Angebot/Kalkulation/BAB sind Plan- und Auswertungssichten; sie erzeugen keine Finanzbuchung, Forderung, Verbindlichkeit, Bestandsänderung oder Zahlung.
- Bei Einreichung eines Angebots werden die verwendete Kosten- und BAB-Version als Kalkulationssnapshot festgehalten. Nicht angenommene Entwürfe dürfen bei geänderten Kostensätzen neu berechnet werden. Nach Annahme bleiben Vertragspreis und zugehöriger Snapshot unveränderlich; Plan-Ist-Abweichungen werden separat ausgewiesen. Daraus folgt keine Schema-/Architekturfreigabe.
- Kostenentstehung, Aufwand, Erlös, offene Posten und Cash folgen den bereits geltenden Ereignis-/Finanzverträgen; diese Note führt keine abweichenden Buchungszeitpunkte ein. In V1 gilt insbesondere: Kostenentstehung/Zahlung getrennt, Zahlungseingang ist kein neuer Erlös, Auftrags-Ergebnis wird aus realisiertem Erlös und zugeordneten Ist-Kosten ausgewertet.
- Eine verteilte BAB-Kostenposition bleibt eine KLR-Verrechnung. Sie ist kein zweiter Cashausgang und erzeugt ohne separaten gebuchten Geschäftsvorfall keine zweite Aufwandsbuchung.
- Zur Reproduzierbarkeit soll jede eingereichte Kalkulation auf ihrer bestätigten Eingabe- und BAB-Rate-Version basieren. Wie Versionen, Snapshots und spätere BAB-Änderungen persistiert werden, ist Umsetzung/Data-Model-Thema und benötigt A04-/A01-Handoff; dieses Dokument genehmigt kein Schema.

## 6. Kennzahlen-Grenzen für V3-10

Finanzkennzahlen müssen ihre Sicht und Periode nennen. Operative Angebots-, Kosten- und Ergebniskennzahlen werden Kalendermonaten zugeordnet. Jahreswerte bilden bei periodischen Flussgrößen die Summe der zwölf Kalendermonate; Bestandsgrößen werden als Jahresabschluss-/Stichtagswert ausgewiesen. Cash und offene Forderungen/Verbindlichkeiten werden zusätzlich stichtagsbezogen ausgewiesen. Makroperioden bleiben von dieser operativen Zuordnung getrennt. Mindestens unterscheiden: Angebotserlös/Planwert (nicht realisiert), realisierter Erlös (nur nach geltendem Rechnungs-/Leistungsereignis), Plan-DB, Ist-Auftragsergebnis, Liquidität/Cash und offene Forderungen/Verbindlichkeiten. Kein Auftragswert ersetzt Cash und keine offene Forderung ist ein Zahlungseingang. Die gewählte Unternehmensausrichtung darf vergangene Buchungen/Kennzahlen nicht rückwirkend ändern. Die Definition nichtfinanzieller Ruf-/Qualitätskennzahlen liegt bei A02/A05.

V3-10 fordert Unternehmensausrichtungen und zwei geeignete Kennzahlen pro Ausrichtung. Dieser Finanzvertrag definiert keine Ziele, Zielwerte oder Liquiditäts-/Solvenzschwellen. Kennzahlenperioden richten sich nach dem vorstehenden Kalendermonats-/Stichtagsvertrag; Makroperioden bleiben getrennt.

## 7. Testvektoren (ausschließlich Rechenfixtures, keine Spielparameter)

### DB-Grenzfälle

Alle Beträge sind künstliche Testwerte mit bereits gleicher wirtschaftlicher Preis-/Kostenbasis; keine Steuern werden berechnet.

| Fall | `R` | variable direkte Kosten | Ergebnis `DB I` | Erwartung |
|---|---:|---:|---:|---|
| Positiv | 1.000,00 | 800,00 | +200,00 | positive DB-Anzeige |
| obere Centnah-Grenze | 1.000,00 | 999,99 | +0,01 | als centnah kennzeichnen; Betrag und positives Vorzeichen bleiben sichtbar |
| Nullgrenze | 1.000,00 | 1.000,00 | 0,00 | centnah; exakt neutral |
| untere Centnah-Grenze | 1.000,00 | 1.000,01 | −0,01 | als centnah kennzeichnen; Betrag und negatives Vorzeichen bleiben sichtbar |
| Negativ | 1.000,00 | 1.050,00 | −50,00 | negativer DB; kein automatischer Zuschlag/Ablehnungsentscheid |

Ein Gesamt-DB I von −0,01 € bis einschließlich +0,01 € ist centnah; außerhalb dieses Intervalls wird aus D-0162 keine weitere Warnschwelle abgeleitet. Zusätzlich prüfen: Erhöhung des Verbrauchs oder Satzes um einen minimalen Testbetrag senkt DB entsprechend; Entwurfsneuberechnung mutiert weder Cash noch Forderungen oder Ledger; nach Annahme bleiben Vertragspreis und Kalkulationssnapshot unverändert; Plan-Ist-Abweichungen erscheinen separat.

### BAB-Reconciliation-Fall

Testfixture: zwei Quellkostenstellen mit 600,00 und 400,00; je eine 60/40- bzw. 25/75-Verteilung. Erwartete Empfängerwerte: Quelle 1: 360,00 / 240,00; Quelle 2: 100,00 / 300,00. Empfängersummen: 460,00 und 540,00; Gesamt vor und nach Verteilung: exakt 1.000,00; Differenz 0,00. Dies prüft Verteilung, nicht einen vorgeschriebenen Spiel-Kostensatz.

Zusatzfälle: leerer Schlüssel, negativer Schlüssel, Division durch null, Gewichte ungleich 100 %, inkompatible Einheiten und Änderung eines Primärkostenbetrags. Ungültige Eingaben dürfen keinen BAB-Summenstand als gültig markieren; eine gültige Änderung muss abhängige Anteile und Sätze neu berechnen und Abstimmung erhalten.

Restcent-Test: Ein Ausgangskostenbetrag von 0,01 € wird gleichmäßig auf drei Kostenstellen verteilt. Die ungerundeten Anteile sind gleich; das Restcent erhält die Kostenstelle mit der aufsteigend kleinsten stabilen ID. Die Empfängersumme muss 0,01 € betragen. Dieser Fixture testet nur die D-0162-Rundungsregel.

## AfA-, Bilanz- und Steuergrenze (D-0161 / Rechtsrahmenregister)

Der dynamische V3-Grund-BAB übernimmt AfA nicht automatisch aus einem steuerlichen Menü, Buchwert oder physischem Verschleiß. Eine vom Spieler eingegebene Abschreibungs-/Anlagenkostenposition ist als Kalkulationsannahme/KLR-Pool gekennzeichnet und wird nicht dadurch zu steuerlicher AfA oder HGB-Buchwert. D-0083/D-0084 bleiben getrennt als vereinfachte Spielregel; die CNC-Anschaffung 2019 fällt laut [Rechtsrahmenregister, A08-AfA-Befund und A03-Impact](../legal/legal-framework-register.md#a08-erstpruefung-des-historischen-rechtsbestands) nicht in das geprüfte aktuelle Fenster 01.07.2025–31.12.2027. Außerhalb gesetzlicher Voraussetzungen darf eine degressive Methode nur klar als Spiel-/Lernannahme bezeichnet werden. Dieser V3-Vertrag stellt keine steuerliche oder HGB-Abschreibung ein und erweitert SimTAX/Vorsteuer nicht. D-0160 bleibt V2-only.
## 8. Versionstrennung

- **V3:** aktive, erklärbare Angebots-/Produkt-Planrechnung; dynamischer Grund-BAB aus expliziten Perioden-Primärkosten und Schlüsseln; einfache Kennzahlen und begrenzte Plan-Ist-Sicht. Keine vollständige Buchführung oder Monats-/Jahresabschlussdefinition.
- **V4:** vollständiger WBQ-Rechnungswesen-Zyklus mit Finanzbuchführung, systematischer Kostenrechnung, Auswertung und Planung gemäß V4-Ziel. V3-Vorschau ist dafür eine fachliche Vorstufe, kein Ersatz.
- **V8:** Mehrperiodenplanung, Soll-Ist-/Abweichungsanalyse und fortgeschrittenes Controlling samt Investition/Finanzierung. Kein Mehrperiodenbudget, Forecast oder Finanzierungsmodell wird durch den Grund-BAB vorweggenommen.

## 9. Bestätigte Regeln und verbleibende Integrationspunkte

Die sechs fachlichen Entscheidungen aus D-0162 sind bestätigt und in den Abschnitten 2–7 umgesetzt: V3-Nettoplanpreis ohne SimTAX; DB I nur aus variablen Einzelkosten mit separatem Ausweis direkter Arbeit/Maschine und Ergebnis nach direkten Einzelkosten; BAB-Präzision und Restcentverteilung nach größtem Rest samt stabilem ID-Gleichstand; Angebots-Kalkulationssnapshot und Unveränderlichkeit nach Annahme; centnaher DB-I-Bereich −0,01 € bis +0,01 €; operative Monats-/Jahres- und Stichtagssichten bei getrennter Makroperiode.

Offen sind ausschließlich Integrationsarbeiten, keine Nutzerentscheidung: A02 liefert/validiert Preis-, Kosten- und Ereignisinputs gemäß Markt-/Produktvertrag; A04 kann bei einem separat freigegebenen Modellauftrag die Snapshot-Persistenz spezifizieren; A05 bildet die festgelegten Rechenschritte und Labels ab. A09 hat zwei UI-Befunde gemeldet; dieser Nachtrag klärt den Rate-/Verteilungsnenner fachlich, während A05 die UI-Korrektur und den Snapshot-Fehler beheben muss. Danach folgt A09-Re-Review. Kein Punkt hier erteilt Schema-, Architektur- oder Buchungsfreigabe.

## 10. Handoffs

- An **A02/T-0065**: bestätigen, welche Angebots-Preisgröße und Einzelkosten-/Treiberwerte die Simulation an A03 übergibt; Ereignis-/Cash-/Erlöszeitpunkte bleiben bei gemeinsamem Finanzvertrag.
- An **A02/T-0066**: Produktstückliste, Los-/Einheitenbasis, Entwicklungs- vs. Produktionskosten, Kostenzeitpunkt und Absatz-/Ereignisreferenz liefern. A03 rechnet, aber mutiert keine Simulationszustände.
- An **A05**: die bestätigten Preis-, Klassifikations- und Rundungsregeln als UI-Vertrag konsumieren. Bei `keys` Satzbasis strikt aus der Summe des gemeinsamen physischen Treibers ableiten/validieren. Bei `weights` Gewichtsanteil und eine optionale, separate Treibersatzbasis getrennt beschriften; ohne diese Basis keinen Mengensatz anzeigen. Ein vom Allokator aus Gewichten abgeleiteter Pseudo-Mengensatz darf nicht angezeigt oder weiterverwendet werden; die Rate ist separat aus Pool und expliziter Treiberbasis zu berechnen. Die A03-Bibliothek gibt im `weights`-Modus kein `rate`-Feld mehr zurück; ein Mengensatz kann nur separat mit expliziter physischer Basis berechnet werden. A05 muss das optionale Vorhandensein des Satzfelds anhand des Modus berücksichtigen. Rechenschritte, Einheiten, Perioden, Wertebasis und Plan/Ist-Labels zeigen.
- **Klarstellung für die Angebots-API:** Eine gewichtete Angebotsberechnung nimmt genau eine gemeinsame Treiberbasis (`rateBasis`) je Pool an; alle Auftragsmengen nutzen dieselbe physische Einheit und sind auf ihren deterministischen Anteil `B_g × w_{g,c}` begrenzt. Unabhängige `recipientRateBases`, gemischte Einheiten oder Geld-/Treiberbasen sind unzulässig. Ohne gemeinsame Basis ist nur Pool-Allokation, kein Auftrags-BAB-Betrag, berechenbar.
- An **A09**: unabhängige Rechen- und Eingabevalidierung gegen Testvektoren aus Abschnitt 7; negative DB darf nicht in stillen Zuschlag oder Buchung umschlagen.
- An **A04/A01**: Persistenz-/Versionsübergabe zu Kalkulationssnapshot erst bei separat freigegebenem Modell-/Schemaauftrag.

## 11. Prüfstatus

- Dokumentenerstellung/A03-Ausführung: durchgeführt; D-0162 in die Fachformeln und Testvektoren übertragen.
- A03-eigener Finanzkonsistenzreview: durchgeführt; D-0162-Scope gewahrt und keine direkte Änderung an Produkt-, Steuer-, Kredit- oder Buchungspolitik.
- A02-Fachreview der Rechenbibliothek: nicht ausgeführt; ein früherer Vertragsreview ist kein unabhängiger Code-Review.
- Unabhängige QA/A09: durchgeführt; A09 meldete den Satznenner-/Verteilungsschlüssel-Mismatch und den Snapshot-Staleness-Fall. Dieser A03-Nachtrag löst die Fachsemantik des ersten Befunds; die UI-Korrektur und A09-Re-Review bleiben offen.
- Isolierte A03-Rechenbibliothek und persistente Regression: ausgeführt in prototype/v3-financial-calculation.js und prototype/v3-financial-calculation-regressions.mjs; Syntaxcheck und alle Rechenfixtures PASS. Die Bibliothek ist nicht in Engine, Schema oder UI integriert und erzeugt keine Ledger-/Cash-/OP-Wirkung.
- Browser-/Gerätetest: nicht ausgeführt.
- Git-Status/-Diff: vor und nach Bearbeitung geprüft; dieser Auftrag änderte ausschließlich die beiden isolierten A03-Rechendateien und die beiden A03-T-0067-Unterlagen. Neue Dateien wurden mit `git diff --no-index --check` ohne Whitespacefehler geprüft (nur konfigurierte LF/CRLF-Hinweise); übrige lokale Änderungen blieben erhalten.
- Commit/Push: nicht ausgeführt.
