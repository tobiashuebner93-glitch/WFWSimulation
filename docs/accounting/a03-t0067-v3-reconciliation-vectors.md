# A03 – T-0067 V3-Kalkulations- und BAB-Reconciliation-Vektoren

**STATUS:** Rechenvektoren um den A09-Befund zu BAB-Nennern ergänzt; A05-Korrekturen und A09-Re-Review offen
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A03 – ACCOUNTING_FINANCE
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5
**TICKET:** T-0067
**PRE-FLIGHT:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), Arbeitsplan und vorhandene Änderungen geprüft. Aktives Ziel MG-002, V3. D-0162 ist die bindende Kalkulations-/BAB-/Snapshot-/Periodenentscheidung; D-0159 und D-0161–D-0164 sowie D-0160 (nur V2) berücksichtigt. Vorgängercheckpoint CP-0280; Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Erneutes Preflight bezog A09-Bericht `../test-reports/a09-t0067-finance-ui-qa.md` ein. Der Arbeitsbaum enthielt zahlreiche Fremdänderungen; sie blieben unverändert.

## 1. Ziel und fachlicher Abgleich

Dieses Paket konkretisiert die vorhandenen Formeln in `a03-t0067-v3-kalkulations-bab-vertrag.md` mit handprüfbaren Fällen. Es deckt Nettoplanpreis `R`, DB I, direkte Einzelkosten, dynamische BAB-Verteilung/Restcent, Angebots-Snapshot, Plan/Ist, Kalendermonat/Stichtag und T-0063/T-0065/T-0066-Übergaben ab.

Der Abgleich mit `a03-v3-finanzschnittstellenpaket-t0063-t0065-t0066-t0067.md` und den A02-Verträgen ergibt **keinen fachlichen Widerspruch**: Makro-/Marktwerte oder Anfrage/Zuschlagschancen sind Plan-/Szenarioinputs; `R` ist netto und ohne SimTAX; Angebotseinreichung erzeugt keinen Ledger-/Cash-/OP-Effekt; Annahme erzeugt für sich noch keinen Erlös; tatsächliche Mengen/Arbeitszeiten und wirksame Ereignisse kommen von A02; tatsächliche Finanz-/KLR-Zuordnung bleibt bei A03. T-0066-Produktion/Verkauf muss über die dort festgelegten Ist-Ereignisse und Mengen getrennt bleiben.

Die folgenden Beträge, Mengen, Sätze, IDs, Seeds und Daten sind **synthetische Test-Fixtures**, keine V3-Preis-, Lohn-, Steuer-, Markt- oder BAB-Vorgaben. Wo Kosten als variabel oder nicht variabel klassifiziert werden, steht das ausdrücklich im Fall; keine Klassifikation wird aus der Kostenart abgeleitet.

## 2. Vektoren für D-0162

### V-DB-01 – Netto, variable und direkte Kosten getrennt

Eingaben (eine Auftragsmenge/ein Los, gleiche Preisbasis; keine Steuerrechnung):

| Eingabe | Wert | Klassifikation |
|---|---:|---|
| Nettoplanpreis `R` | 1.000,00 € | ohne SimTAX |
| Material | 300,00 € | ausdrücklich variabel, direkt |
| Fertigungsarbeit | 120,00 € | ausdrücklich variabel, direkt |
| Fremdleistung | 50,00 € | ausdrücklich variabel, direkt |
| Maschinenkosten | 80,00 € | direkt, ausdrücklich nicht variabel |
| sonstige direkte Kosten | 25,00 € | direkt, ausdrücklich nicht variabel |
| BAB-Anteil | 90,00 € | separat verrechnete Gemeinkosten |

Erwartung:

- `DB I = 1.000,00 − (300,00 + 120,00 + 50,00) = 530,00 €`.
- Direkte Einzelkosten `= 575,00 €`; Ergebnis nach direkten Einzelkosten `= 425,00 €`.
- Kalkulationsergebnis nach verrechnetem BAB `= 425,00 − 90,00 = 335,00 €`.
- Maschinen- und sonstige direkte Kosten werden separat gezeigt und nicht still in DB I aufgenommen; sie werden genau einmal im Ergebnis nach direkten Einzelkosten abgezogen. BAB ist eigene Sicht und kein zweiter Cashabgang/Aufwand.
- Angebot, Neuberechnung und BAB-Verteilung erzeugen keine Ist-Buchung, Forderung, Verbindlichkeit, Bestand oder Cash.

### V-DB-02 – Centnähe und Vorzeichen

| Fall | `R` | variable Einzelkosten | DB I | Anzeige |
|---|---:|---:|---:|---|
| positiv | 500,00 € | 430,00 € | +70,00 € | positiv, nicht centnah |
| obere Grenze | 500,00 € | 499,99 € | +0,01 € | centnah, Pluszeichen/Betrag sichtbar |
| Null | 500,00 € | 500,00 € | 0,00 € | centnah |
| untere Grenze | 500,00 € | 500,01 € | −0,01 € | centnah, Minuszeichen/Betrag sichtbar |
| negativ | 400,00 € | 450,00 € | −50,00 € | negativ, kein automatischer Angebotsentscheid |

Die Centnähe umfasst genau `[−0,01 €, +0,01 €]`. Aus D-0162 folgt weder eine weitere Warnschwelle noch eine automatische Ablehnung, Preiserhöhung oder Buchung.

### V-BAB-01 – Größte Restfraktion, deterministischer Tie-break

Eine Quellkostenstelle liefert `100,01 €` in derselben ausgewiesenen Periode; Verteilungsschlüssel der Empfänger `CC-A`, `CC-B`, `CC-C` sind jeweils 1 (Summe 3). Unrunde Anteile: je `33,336666… €`. Centabrundung je Empfänger ergibt zunächst je `33,33 €`, also `99,99 €`; verbleibende 0,02 € gehen nach gleichem Rest aufsteigend nach stabiler ID an `CC-A` und `CC-B`.

| Empfänger | Anteil vor Restcent | Endbetrag |
|---|---:|---:|
| CC-A | 33,336666… € | 33,34 € |
| CC-B | 33,336666… € | 33,34 € |
| CC-C | 33,336666… € | 33,33 € |
| **Summe** | **100,01 €** | **100,01 €** |

Erwartung: Reconciliation-Differenz `0,00 €`. Bei identischen Eingaben und Kostenstellen-IDs ist die Verteilung deterministisch. Durch Vertauschen der Anzeigereihenfolge darf sich kein Betrag ändern. Bei geänderter Quellkostenstelle auf `100,02 €` bleibt Gesamtverteilung exakt `100,02 €`; dieselbe Reihenfolge löst Restcent anhand der tatsächlichen Restfraktionen, nicht anhand sichtbarer Reihenfolge.

### V-BAB-02 – mehrere Pools/Verteilungen abstimmen

| Quellkostenstelle | Primärkosten | Schlüssel CC-A:CC-B | Anteil CC-A | Anteil CC-B |
|---|---:|---:|---:|---:|
| QS-01 | 600,00 € | 60:40 | 360,00 € | 240,00 € |
| QS-02 | 400,00 € | 25:75 | 100,00 € | 300,00 € |
| **Empfängersumme** | **1.000,00 €** |  | **460,00 €** | **540,00 €** |

Erwartung: Quellen- und Empfängersumme vor/nach Verteilung jeweils `1.000,00 €`; Differenz `0,00 €`. BAB-Verrechnungssätze und verwendete Bezugsbasen (gleiche Periode und Einheit) werden getrennt ausgewiesen. Die verteilten Empfängeranteile sind keine zusätzlichen Primärkosten.

### V-BAB-03 – ungültige Eingaben und Umkehrprobe

- Leerer/negativer Schlüssel, Schlüsselnenner 0, unvollständige 100-%-Gewichte oder inkompatible Einheit: Berechnung ungültig; keine scheinbar abgestimmte BAB-Summe.
- Korrektur eines gültigen Quellbetrags von `100,01 €` auf `100,02 €`: Empfänger ändern sich zusammen um exakt `0,01 €`; andere Pools/Perioden bleiben gleich.
- Eine Verteilung von Primärkosten verändert weder Bank/Cash noch Forderungen/Verbindlichkeiten. Nur ein separater, autorisierter Geschäftsvorfall kann Finanzsalden verändern.

### V-SNAPSHOT-01 – Kalkulationsversion und Angebots-Snapshot

Synthetische Eingabe: Kosten-/BAB-Stand `COST-01/BAB-01`, `R=1.000,00 €`, DB I `530,00 €` aus V-DB-01.

1. Ein **offener Entwurf** wird mit `COST-01/BAB-01` gerechnet; die Änderung einer Eingabe erlaubt Neuberechnung des Entwurfs, überschreibt aber keine Ist-Daten und erzeugt keine Buchung.
2. Eine Angebotsabgabe bindet den verwendeten Rechenstand und die Kosten-/BAB-Basis als Snapshot. Im Fixture wird die Angebotsreferenz `O-01` mit `COST-01/BAB-01` eingereicht. Preis, Einreichungsreferenz und Snapshot sind anschließend gemeinsam nachvollziehbar.
3. Ein späterer Kosten-/BAB-Stand `COST-02/BAB-02` wirkt auf eine neue/offene Kalkulation; er überschreibt nicht den bereits eingereichten Snapshot `O-01`.
4. Wird `O-01` angenommen, ist der Vertragspreis `1.000,00 €` und dessen Snapshot `COST-01/BAB-01` unveränderlich. `COST-02/BAB-02` darf nicht rückwirkend den Vertrag oder seine Angebotsrechnung verändern; Abweichung wird separat gezeigt.
5. Ablehnung/Verfall oder Annahme allein löst keine Buchung, Forderung oder Zahlung aus.

**Grenze:** D-0162 fixiert den Preis/Snapshot nach Annahme und speichert den Snapshot bei Angebotseinreichung. Dieser Vektor testet die sichere Referenzierbarkeit; er legt keine zusätzliche Vor-Annahme-Änderungs-, Widerrufs- oder Neuausstellungsregel für Angebote fest. Ein neues Angebot ist nur dann ein neuer Snapshot, wenn A02s Marktvertrag einen separaten Angebotsvorgang ausweist.

### V-PLANIST-01 – tatsächliche Menge und Kosten separat von der Planung

Synthetisches Los: Planmenge 100 Stück, Nettoplanpreis 10,00 €/Stück, variable Plankosten 6,00 €/Stück.

- Plan: `R=1.000,00 €`; variable Kosten `600,00 €`; DB I `400,00 €`.
- Ist-Fixture: 95 Stück werden über ein autorisiertes Leistungs-/Abnahmeereignis realisiert; realer Nettopreis folgt dem angenommenen Vertragspreis 10,00 €/Stück; die ausdrücklich variablen Ist-Kosten betragen 6,10 €/Stück.
- Ist-Kennzahlen: realisierter Erlös `950,00 €`; variable Ist-Kosten `579,50 €`; DB-I-Ist `370,50 €`; DB-I-Abweichung gegen den Plan `−29,50 €`.
- Planerlös `1.000,00 €` wird nicht als Ist-Erlös mitgezählt. Die Planmenge wird nicht als tatsächlicher Verbrauch behandelt. 5 nicht realisierte Stücke erzeugen keinen Erlös.
- Erlös-/Forderungs-/Cash-Ereignisse richten sich nach dem geltenden A02/A03-Vertrag; diese Rechenprobe legt keine Leistungs-/Rechnungs-/Zahlungsdaten fest.

### V-PERIODE-01 – Kalendermonatsfluss gegen Stichtag/Cash

Synthetische Ereignisfolge, um die Periodenabgrenzung zu prüfen, nicht um neue Fälligkeiten festzulegen:

| Datum / Ereignis | Operative Kennzahl | Cash / offener Posten |
|---|---|---|
| 2027-01-29: Angebot `O-01` mit `R=1.000,00 €` eingereicht | Januar-Angebots-/Planwert 1.000,00 €; noch kein Ist-Erlös | Cash 0,00 € aus diesem Angebot; Forderung 0,00 € |
| 2027-02-02: Angebot angenommen | Vertrags-/Auftragsstatus Februar; kein realisierter Erlös nur durch Annahme | Cash 0,00 €; Forderung 0,00 € |
| 2027-03-03: vereinbartes Leistungs-/Abnahmekriterium erfüllt | März-Ist-Erlös 1.000,00 € genau einmal | Forderung 1.000,00 € gemäß geltendem Finanzereignisvertrag; Cash aus dieser Leistung noch 0,00 € |
| 2027-04-15: Zahlungseingang nach einer **nur für diesen Test gesetzten** Zahlungsannahme | kein zweiter April-Erlös | Forderung sinkt 1.000,00 €; Cash steigt 1.000,00 € |

Erwartung: Jahresfluss aus diesem Fall (Jan–Dez 2027) hat genau `1.000,00 €` realisierten Erlös in März; Angebote/Verträge werden als getrennte Kennzahl/Sicht ausgewiesen. Cash und Forderungen sind keine Monatsflüsse zum Summieren, sondern am jeweils angegebenen Stichtag auszuweisen. Makroperioden und Makro-Snapshots werden nicht aus diesen operativen Kennzahlen abgeleitet. **Die konkreten Daten außer Angebotsperiode sind nur Testfixturedaten; die Ereignisfolge definiert keine V3-Pflichttermine.**

### V-T0066-01 – Produktkalkulation versus Realisierung

Synthetische Produktversion, 10 Stück als Planlos; `R=60,00 €/Stück` netto. Planpositionen für das Los: Material `80,00 €` (ausdrücklich variabel), Fertigungsarbeit `300,00 €` (ausdrücklich variabel), Maschine `50,00 €` (direkt/nicht variabel), BAB-Fertigungsgemeinkosten `40,00 €`.

- Planpreis `600,00 €`; `DB I=600−80−300=220,00 €`.
- Direkte Einzelkosten `430,00 €`; Ergebnis nach direkten Einzelkosten `170,00 €`; nach BAB `130,00 €`.
- Der Kalkulationsentwurf allein erzeugt weder Produktionsbestand noch Aufwand, Erlös, Forderung oder Cash.
- Für eine getrennte Realisierungsprobe: erst wenn der A02/A03-Produktionsvertrag tatsächliche Fertigstellung und die tatsächliche Verkaufs-/Leistungsereignisse belegt, werden 10 hergestellte Einheiten zum im T-0066-Vertrag vorgesehenen Ist-Herstellkostenpfad bewertet. Bei 8 tatsächlich verkauften/abgenommenen Einheiten werden nur 8 × `60,00 €` = `480,00 €` realisierter Nettoumsatz ausgewiesen; zwei nicht verkaufte Einheiten bleiben Fertigwarenbestand. Bei proportional identischen tatsächlichen Stückkosten wäre COGS `8/10` des tatsächlichen Fertigwarenwerts; der genaue Ist-Wert muss aus tatsächlichem Verbrauch, Ausschuss und dem festgelegten BAB-Snapshot stammen, nicht aus dem Planentwurf.
- Verkaufs-/Fertigstellungs-/Abnahmeereignisse, Bestand, COGS, Erlös und Cash werden nicht durch diesen Vektor terminiert oder gebucht. Der A03-Vertrag legt die Reconciliation-Identitäten fest; konkrete Runtime-Implementierung und A09-Prüfung sind noch offen.

## 3. Testabdeckung und erwartete Invarianten

A09-Rechenreview kann diese Identitäten gegen Laufzeit/UI ausführen:

1. `DB I = R − Summe(variabel klassifizierte direkte Einzelkosten)`; Nicht-Variabel-Direktkosten bleiben außerhalb von DB I.
2. `Ergebnis nach direkten Einzelkosten = R − alle direkten Einzelkosten`; jede Position einmal.
3. `Ergebnis nach verrechnetem BAB = Ergebnis nach direkten Einzelkosten − BAB-Anteil`.
4. Je Pool und je Gesamtabstimmung: Summe ausgegebener Centanteile = Summe centgenauer Primärkosten; Reconciliation = `0,00 €`.
5. Restcenttie bleibt unabhängig von Anzeigeordnung; nur gleiche Restfraktion nutzt aufsteigende stabile Kostenstellen-ID.
6. Offer reference bindet den bei Submission erstellten Kosten-/BAB-Snapshot; nach Annahme bleiben Angebotspreis und Snapshot unverändert.
7. Planwerte, angenommener Vertragswert, realisierter Erlös, Cash und offene Forderungen sind getrennte Werte mit Datum/Periode und Status.
8. Jahresflüsse summieren Monatsflusswerte; Stichtagsbestände werden an Stichtagen gezeigt und nicht über Monate addiert.
9. T-0063-Makroereignisse, T-0065-Anfrage/Annahme, T-0066-Entwicklungsplan und T-0067-Kalkulation ohne separat autorisiertes Finanzereignis: Ledger-/Cash-/OP-Mutation `0,00 €`.

## 4. Verrechnungssatz: Anzeige, Weiterverwendung und Reconciliation

**A03-Auslegung innerhalb D-0162:** Der interne Periodensatz bleibt der ungerundete Quotient aus Poolbetrag und bestätigter Bezugsbasis. Die Oberfläche zeigt `s_g` als Währung je Treibereinheit mit zwei Nachkommastellen und `z_g` als Prozentwert mit zwei Nachkommastellen; beide sind als gerundete Anzeige markiert. Zur Kalkulation und Folge-Verteilung wird niemals der Anzeigewert zurückverwendet; die genaue Basis-/Quotientenrechnung bleibt intern erhalten. Bei Verteilung auf BAB-Empfänger werden zuerst ungerundete Empfängeranteile berechnet und anschließend centgenau abgerundet. Restcent werden nach absteigender Restfraktion vergeben; bei exakt gleichem Rest entscheidet die stabile Kostenstellen-ID aufsteigend. Gesamtausgabe muss mit dem Poolbetrag abstimmen, unabhängig von Tabellen-/UI-Reihenfolge.

Die Anzeige von Geldsätzen auf zwei Dezimalstellen folgt der Centdarstellung in D-0162; der proportionale Satz `z_g` ist dimensionslos und wird ebenfalls mit zwei Nachkommastellen als Darstellung formatiert. Das ist eine fachliche Darstellungspräzisierung und öffnet ausdrücklich **keine Nutzerentscheidung über UI-Dezimalstellen**. Display rounding hat keine Wirkung auf R, DB I, Kostenklassifikation, BAB-Folgewerte, Snapshot oder Ledger/Cash.

### V-RATE-01 – Rundung des Anzeige-Satzes darf nicht fortgeschrieben werden

Gemeinkostenpool `100,01 €`, bestätigte Periodenbasis `3 h`, drei Kostenstellen `CC-A`, `CC-B`, `CC-C` mit je `1 h`:

- Interner Quotient: `100,01 / 3 = 33,336666… €/h`.
- Anzeige: `33,34 €/h (gerundet)`.
- Verteilung rechnet intern ungerundet: je `33,336666… €`; vor Restcent je `33,33 €`.
- Gleich große Restfraktionen: Restcent 1 und 2 gehen nach stabiler aufsteigender ID an `CC-A` und `CC-B`.
- Endbeträge: `CC-A 33,34 €`, `CC-B 33,34 €`, `CC-C 33,33 €`; Summe exakt `100,01 €`.
- Fehlerprobe: `33,34 × 3 = 100,02 €` ist eine Anzeige-Rückrechnung und darf weder als BAB-Verteilung noch als weiterer Satz verwendet werden.

### V-RATE-02 – ungleiche Treibermengen, gleiche Summe

Pool `10,01 €`, Gesamtbasis `6 h`; Kostenstellen `CC-A=1 h`, `CC-B=2 h`, `CC-C=3 h`:

| Kostenstelle | Ungerundeter Anteil | Betrag vor Restcent | Restfraktion | final |
|---|---:|---:|---:|---:|
| CC-A | 1,668333… € | 1,66 € | 0,008333… € | 1,67 € |
| CC-B | 3,336666… € | 3,33 € | 0,006666… € | 3,34 € |
| CC-C | 5,005000… € | 5,00 € | 0,005000… € | 5,00 € |
| **Summe** | **10,010000 €** | **9,99 €** |  | **10,01 €** |

Zwei fehlende Cent gehen an die größten Restfraktionen CC-A und CC-B. Der intern ungerundete Quotient ist `10,01 / 6 = 1,668333… €/h`; ein als `1,67 €/h` angezeigter Satz wird nicht je Stundenmenge wiederverwendet. Eine UI-Anzeige kann die exakten Anteilsspalten verkürzt darstellen, sie darf aber weder die Reconciliation-Summe noch spätere Berechnungen beeinflussen.

### V-RATE-03 – Treiberschlüssel und Anteilsgewichte haben keinen gemeinsamen Nenner

**Fall A: physische Treiberschlüssel (`keys`)**. Pool `10,00 €`; Empfänger CC-A, CC-B und CC-C haben jeweils `1 h` als denselben periodischen Treiber.

- Satzbasis wird aus den Schlüsseln gebildet: `1 + 1 + 1 = 3 h`.
- Interner Satz: `10,00 € / 3 h = 3,333333… €/h`; Anzeige `3,33 €/h (gerundet)`.
- Unrunde Empfängeranteile: je `3,333333… €`; nach größtem Rest/Tie-break erhält CC-A `3,34 €`, CC-B `3,33 €`, CC-C `3,33 €`; Summe `10,00 €`.
- Eine zusätzliche Satzbasis `6 h` wäre in `keys` unzulässig. Sie würde `1,67 €/h` zeigen, obwohl die verteilten Schlüssel zusammen nur `3 h` betragen. Die Berechnung muss diesen abweichenden Nenner ablehnen.

**Fall B: reine Anteile (`weights`) mit separater Treiberbasis**. Derselbe Pool `10,00 €`, Gewichte CC-A `0,50`, CC-B `0,25`, CC-C `0,25`, separate periodische Satzbasis `6 h`.

- Gewichte verteilen Kosten: `5,00 €`, `2,50 €`, `2,50 €`; Summe `10,00 €`.
- Die Gewichte begründen selbst keinen Mengensatz. Mit der ausdrücklich separaten 6-h-Basis gilt intern `10,00 / 6 = 1,666666… €/h`; Anzeige `1,67 €/h (gerundet)`.
- Zur Reconciliation werden Treibermengen gemäß Gewicht abgeleitet: `3 h`, `1,5 h`, `1,5 h`. Satz × jeweilige ungerundete Treibermenge entspricht jeweils `5,00 €`, `2,50 €`, `2,50 €`.
- Die UI beschriftet den Anteil als „Verteilungsanteil“ und die 6 h getrennt als „Satzbasis (Treibermenge)“. Eine Satzausgabe ohne separate Mengeneinheit/-basis ist unzulässig.

**Invariante:** In `keys` ist Nenner = Summe physischer Treiber. In `weights` ist Nenner nur die separat bestätigte physische Basis; die Gewichte sind dimensionslos. Kein Rate-Label verwendet stillschweigend einen anderen Nenner als die zugehörige Verteilung.
### Reconciliation-Regeln

- Runde erst die resultierenden Kostenbeträge je Empfänger auf Cent, nicht den Verrechnungssatz vor der Multiplikation.
- Verteile den verbleibenden Centbetrag nach größtem Rest; stabile, aufsteigende Kostenstellen-ID löst nur tatsächliche Restgleichheit.
- Prüfe `Summe finaler Empfängerbeträge = Summe centgenauer Poolausgang`; Differenz muss `0,00 €` sein.
- Sortieren/Filtern/Neuzeichnen der UI darf die Empfänger-ID-Ordnung und Verteilung nicht verändern.
- Für Folge-Kalkulationen wird der interne Satz bzw. die genaue Basis verwendet; sichtbare gerundete Werte bleiben beschriftete Anzeige.

## 5. Prüfstatus und Grenzen

- **A03-Ausführung:** Rechenvektoren und Querabgleich gegen D-0162/T-0063/T-0065/T-0066 erstellt.
- **Fachreview:** A03-Selbstreview gegen D-0162; unabhängiges A02-Codefachreview nicht ausgeführt. A09 meldete Satznenner-/Schlüsselblocker und Snapshot-Staleness; dieser Nachtrag löst die Fachsemantik, nicht die UI-Fehler. Die isolierte A03-Bibliothek wurde danach angepasst: `allocateV3BabPool` liefert bei `weights` kein `rate`-Feld; der Mengensatz wird ausschließlich separat mit expliziter physischer Basis berechnet. A05 muss diese optionale API-Form integrieren; UI- und Snapshot-Korrekturen sowie A09-Re-Review bleiben offen.
- **Unabhängige QA:** A09 UI-/Rechenreview ausgeführt, Gesamtgate NICHT BESTANDEN; Bericht `docs/test-reports/a09-t0067-finance-ui-qa.md`. Vertraglicher Nennerbefund hier präzisiert; A05-Fix und gezielter A09-Re-Review offen.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Automatisierte Rechenprüfung:** persistente Node-Regression prototype/v3-financial-calculation-regressions.mjs deckt alle A03-Fixtures ab: DB-I-Grenzen, BAB-Verteilungen einschließlich Restcent-/ID-Tie-break, Anzeige-/Internsatztrennung, Snapshot, Plan/Ist, Produktplan und begrenzte Realisierungsarithmetik, Perioden-/Stichtagswerte. Syntax- und Laufprüfung PASS. Tests betreffen ausschließlich künstliche Werte.
- **Implementierungsgrenze:** prototype/v3-financial-calculation.js ist eine isolierte, deterministische Rechenbibliothek. Sie mutiert Eingaben nicht, bucht nichts und ist nicht in A02 Engine, A05 UI, Schema oder V1/V2 integriert. Die Plan-Ist- und Snapshot-Ergebnisse bleiben reine Berechnungswerte.
- **Git-Verifikation:** Branch/HEAD vor Arbeit geprüft; vorhandene parallele Änderungen unverändert. Nach Erstellung `git status --short` und `git diff --check` geprüft.
- **Commit/Push:** nicht ausgeführt.

**Rückfragen an A01:** keine Nutzerentscheidung erforderlich. A05 setzt die klare `keys`-/`weights`-Schnittstelle um und behebt Snapshot-Staleness; danach A09-Re-Review. D-0162 wird nicht geändert.
