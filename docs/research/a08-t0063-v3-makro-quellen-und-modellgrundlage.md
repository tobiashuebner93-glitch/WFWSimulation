# A08 Quellen- und Modellgrundlage – T-0063 Makroökonomie

**Status:** A08-Quellenphase abgeschlossen; A02/A03-Modellierung und A09-Fachreview offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A08 – RESEARCH
**Goals:** MG-002 / SLG-002.2, SLG-002.5
**Ticket:** T-0063
**Quellenprüfung:** 2026-10-31
**Vorgänger-/Arbeitsbasis:** CP-0275 (ENTWURF); HEAD = origin/main = 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c vor Bearbeitung

## 1. Auftrag, Befund und Modellannahmen

Dieser Bericht liefert Quellen- und Modellgrundlagen zu V3-01, V3-02 und V3-13 bis V3-16: Konjunkturphasen, Außenwirtschaft, EZB/Geldpolitik, acht Politik-Kategorien sowie Preisindex und Inflation. Er trifft keine Produktentscheidung, legt keine numerischen Schwellen oder Kausalitätskoeffizienten fest und ändert weder Code, Schema, Architektur noch Simulations-/Finanzregeln.

**Quellenbefund** bezeichnet Aussagen, die aus den unten verlinkten amtlichen oder institutionellen Quellen folgen. **Modellvorschlag** bezeichnet eine transparente, vereinfachte Spielabbildung, die A02/A03/A01 noch prüfen müssen. Ein Modellvorschlag ist weder Nutzerentscheidung noch behauptete empirische Gesetzmäßigkeit.

Die Trennung in acht Spielkategorien ist eine didaktische Modellentscheidung. Nachfrage-/Angebotspolitik sind Wirkungsorientierungen, keine zusätzlichen unabhängigen Institutionen. „Tarifpolitik“ meint Lohn- und Arbeitsbedingungsfindung durch Tarifparteien, nicht Zollpolitik.

## 2. Vier Konjunkturphasen

Die Bundesbank beschreibt Konjunktur als zyklische Bewegung um längerfristiges Trendwachstum; reales BIP und Produktionslücke/Output Gap sind gebräuchliche Bezugsgrößen. OECD Composite Leading Indicators sollen Wendepunkte früh anzeigen, sind aber qualitative Hinweise, keine quantifizierte BIP-Prognose. Daraus folgt kein universeller Satz von Phasenschwellen oder eine feste Phasendauer.

| Phase | Fachliche Einordnung | Größen und Einheiten | Modellvorschlag |
|---|---|---|---|
| Aufschwung | Aktivität erholt sich vom Tiefpunkt; Richtung verbessert sich. | Reales BIP oder Produktion (% ggü. Vorperiode), Auftragseingang (Index), Arbeitslosigkeit (% als nachlaufender Kontext). | Aktivität unter/nahe Trend, Momentum aufwärts. Kein numerischer Gap-Grenzwert ohne A02-Kalibrierung. |
| Hochkonjunktur/Boom | Hohe Auslastung bzw. Aktivität oberhalb des normalen/Trendpfads; Kapazitäts- und Preisdruck können zunehmen. | Output Gap (% des Potenzials, falls modelliert), Kapazitätsauslastung (%), Auftragslage (Index), Inputpreisindex (% Veränderung). | Aktivität hoch und Kapazitätsauslastung angespannt. Boom ist nicht bloß hohes Wachstum; Übergang zum Abschwung benötigt eine eigene Momentum-/Ereignisregel. |
| Abschwung | Aktivität verliert nach einem Hochpunkt Dynamik bzw. geht zurück. | Reales BIP-Wachstum (%), Auftragseingang/Produktion (Indexänderung), Arbeitslosigkeit/Arbeitskosten. | Momentum abwärts aus hoher Lage. Eine Einzelbeobachtung soll keinen Phasenwechsel erzwingen. |
| Tiefstand | Schwache Aktivität nahe einem lokalen Zyklustief; sie kann stagnieren oder bereits drehen. | Reales BIP-/Produktionsniveau relativ zum Trend, Auftragseingang und Arbeitslosigkeit als Zeitreihen. | Niedrige Aktivität, zunächst schwaches/abflachendes Momentum; Übergang zum Aufschwung erst bei modellierter Erholung. |

**Anforderung an A02:** Die Zustände über einen Zwölfmonatslauf reproduzierbar machen und Eintritt, Verbleib, Übergang, Glättung/Hysterese und Indikatoren dokumentieren. Schwellen und Übergangslogik sind kalibrierbare Modellparameter, keine amtliche Definition. Alle Phasen brauchen eine testbare Nachfragewirkung und einen separaten Kosten- oder Kapazitätseffekt. Reale Reihen benötigen Saison-/Kalenderbehandlung; synthetische Reihen sind als solche zu kennzeichnen.

**Unsicherheit:** „Konjunkturphase“ kann klassische Zyklusphasen oder OECD-Wachstumszyklen um den Trend meinen. Die Tabelle kombiniert Lage und Richtung didaktisch; A02 muss eine konsistente Engine-Definition festlegen und darf beide nicht unbemerkt vermischen.

## 3. Außenwirtschaftliche Übertragungskanäle

Wechselkurse sind laut EZB/Bundesbank für Importpreise, Vorleistungen und Inflations-/Wachstumsausblick relevant, aber selbst kein EZB-Ziel. Destatis weist Inlands- und Auslandsaufträge getrennt aus. Bundesbank-Quellen zu geopolitischen Störungen nennen Lieferengpässe, Lieferketten, Unsicherheit und Transportkosten. Richtung und Stärke für ein Unternehmen hängen von Import-/Exportanteil, Währung, Verträgen und Marktreaktion ab.

| Kanal | Definition / Einheit | Quelle und Update | Unternehmenskanal und Grenze |
|---|---|---|---|
| Wechselkurs/importierte Vorleistungen | EUR je Fremdwährung oder Fremdwährung je EUR; Wechselkursindex (Basis 100). | EZB-Referenzkurse täglich; sie sind Informationsreferenzen, nicht zwingend Transaktionskurse. Im Spiel synthetischer Monatswert möglich. | Bei fremdwährungs-/importabhängigem Material kann die Einstandspreisannahme variieren. A03 legt Buchungs-/Zahlungswirkung fest. Euro-Aufwertung kann Fremdwährungsimporte rechnerisch verbilligen; Durchschlag ist unvollständig/verzögert. |
| Auslandsnachfrage/Exportchance | Auslands-Auftragseingangsindex in Punkten (Basis 100) oder reale Änderungsrate in %. | Destatis trennt Inlands- und Auslandsaufträge; amtliche Reihen monatlich. Im Spiel monatliche Aktualisierung mit Quelltyp/Seed. | Nur export- oder exportnah zugeordnete Kunden/Produkte erhalten Anfrage-/Absatzimpuls. Zuschlagswahrscheinlichkeit und Stärke sind A02/A05-Modellparameter. |
| Internationale Lieferstörung | Lieferzeit in Kalendertagen oder Pünktlichkeitsquote in %; optional Vorleistungspreisindex Basis 100. | Destatis Außenhandel/Produzentenpreise und Bundesbankberichte als Kontext; reale Daten monatlich/vierteljährlich, Spielereignis bei definiertem Auslöser. | Verfügbarkeit und Beschaffungszeit können variieren; A03 prüft Beschaffungs- und Cashfolgen. Dauer, Lieferantenbetroffenheit und Lagerpuffer sind Spielannahmen. |
| Handelspolitikschock, optional | Ereignisart; Zollsatz nur bei belegter konkreter Ware/Land-Regel. | Erfordert Rechts-/Länder-/Warencode; hier keine konkrete Maßnahme bestimmt. | Keine pauschale Zollkostenregel. Nicht mit Tarifpolitik als Tarifverhandlungen verwechseln. |

**Mindestanforderung:** Die ersten drei Kanäle dokumentieren; Wechselkurs und Auslandsnachfrage/Lieferstörung jeweils isoliert bis zu einer Unternehmenskennzahl testen. Wirkungskette: Ereignis → Makrogröße → Material-/Anfrage-/Liefergröße → Ergebnis/Cash. A03 entscheidet über Ledgerwirkung.

## 4. EZB und Geldpolitik

Die EZB beschreibt: Leitzinsänderungen wirken direkt auf Geldmarktzinsen und mittelbar auf Bankkreditzinsen; Erwartungen beeinflussen längerfristige Zinsen, Finanzierungsbedingungen und Vermögenspreise. Die Transmission hat lange, variable und unsichere Verzögerungen. Sie garantiert keine sofortige proportionale Änderung eines Firmenkredits. Der Wechselkurs ist kein geldpolitisches Ziel.

| Ereignis/Variable | Einheit | Update | Übertragung und Grenze |
|---|---|---|---|
| EZB-Zinsbeschluss | Prozent p.a.; Änderung in Prozentpunkten. | Ereignisdatum; kein tägliches zufälliges Neufestsetzen. | Geldmarkt → Bankkonditionen → Finanzierung/Investition und Nachfrage/Preise mit variabler Verzögerung. Firmenzins hängt auch von Vertrag, Bankmarge, Bonität und Anpassungsklausel ab. |
| Zinserhöhung | Externer Beschluss, dessen Betrag für ein Testszenario offen bleibt. | Vorher-/Nachher-Szenario samt expliziter Verzögerung. | A02: Makro-Nachfrage-/Inflationskanal. A03: nur neue oder vertraglich variable Finanzierungen, falls vereinbart. Feste V2-Zinsen nicht rückwirkend ändern. |
| Zinssenkung | Separates externes Beschlussszenario. | Analog. | Möglicherweise gegenläufige Richtung, aber weder Stärke noch Verzögerung müssen symmetrisch sein. |

Für beide Szenarien sind Datum, alter/neuer Satz, Zinssatzart, Verzögerung und Vorher-/Nachher-Messgrößen zu protokollieren. Dies ist ein kontrafaktisches Spielereignis, keine behauptete historische EZB-Wirkung.

**A03-Übergabe nötig:** Welche Kredite reagieren (nur neue, variable Bestandskredite, Dispo?), ab wann und nach welchem vertraglichen Reset? Wie werden Tages-/Monatszinsen gebucht? Welche V2-Verträge bleiben unverändert? A08 legt hierzu nichts fest.

## 5. Acht Wirtschaftspolitik-Kategorien

Quellen belegen Ziele, Instrumente und Grenzen einzelner Politikfelder. Ihre Trennung in acht Spielkategorien und regelmäßige Modellindikatoren sind Annahmen. Pro Szenario muss Maßnahme → Zwischenindikator → Unternehmenskanal sichtbar sein; Verzögerung und Nebenwirkung werden getrennt ausgewiesen. Keine Tabelle behauptet eine sichere Effektgröße.

| Kategorie | Quellenfundament | Größe / Einheit / Update (Modellvorschlag) | Szenario/Wirkungspfad und Zielkonflikt |
|---|---|---|---|
| Geldpolitik | EZB: Preisstabilität, Zins-/Erwartungskanäle. | EZB-Satz (% p.a.), externe Ereignisse. | Erhöhung kann Finanzierung und Nachfrage mit Verzögerung belasten, Preisdruck dämpfen; Senkung ist kein sofort symmetrischer Impuls. |
| Finanzpolitik | BMF: Ausgaben, Einnahmen und automatische Stabilisatoren; im Abschwung wirken Mehrausgaben/Mindereinnahmen. | Öffentlicher Nachfrageindex (Basis 100) oder fiskalischer Impuls; Quartalsupdate, Monatswirkung als Modell. | Infrastruktur-/Beschaffungsimpuls kann Nachfrage stützen; Zielkonflikt mit Finanzierung/Schulden- oder Preisstabilität. Keine Steuergesetze ohne Rechts-/Steuerticket ändern. |
| Wachstumspolitik | Strukturmaßnahmen für Kapitalstock, Innovation, Produktivität, Infrastruktur/Standort. | Produktivitäts-/Potenzialindex (Basis 100); Quartals- bis Jahresupdate. | Innovation/Investition kann langfristig Potenzial stärken; kurzfristig entstehen Kosten und Kapazitätsbindung. Kein automatischer Absatzbonus. |
| Tarifpolitik | BMAS: Arbeitgeber(verbände) und Gewerkschaften verhandeln Arbeitsbedingungen selbstbestimmt. | Branchenlohnindex (Basis 100) oder Veränderungsrate (%); jährliches/ereignisbasiertes Szenario. | Löhne beeinflussen Unternehmenspersonalkosten und verfügbares Einkommen; Beschäftigung/Preise/Nachfrage können unterschiedlich reagieren. Nicht staatlich festgesetzten Lohn simulieren. |
| Arbeitsmarktpolitik | BA: Vermittlung, Beratung, Qualifizierung/Förderung. | Arbeitslosen-/Vakanzquote (%) oder Skillverfügbarkeit (Index); Quartalsupdate. | Vermittlung/Qualifizierung kann Engpässe verzögert verringern; Weiterbildung bindet zunächst Zeit/Geld; Passung bleibt relevant. |
| Umweltpolitik | UBA: ordnungsrechtliche, ökonomische und informative Instrumente; Energieeffizienz. | Energie-/Materialintensität (kWh/€ oder kg/Einheit) plus Regel-/Förderereignis; quartals-/ereignisbasiert. | Anpassung kann Investitionen erfordern und später Ressourcenbedarf ändern; kurzfristiger Cash-/Kapazitätsbedarf gegen Ressourceneffizienz. Keine pauschale Rendite behaupten. |
| Nachfrageorientierte Politik | Fiskal-/Nachfrageimpulse zur Stabilisierung von Nachfrage sind eine Ausrichtung, kein eigenes Organ. | Nachfrageindex (Basis 100), quartalsweise, optional modellierte Monatswirkung. | Befristete öffentliche Nachfrage/Transfers können Endnachfrage/Anfragen stützen; bei knapper Kapazität können Kosten/Preise steigen. Kein Auftrag an Spieler garantiert. |
| Angebotsorientierte Politik | Breite Ausrichtung auf Produktivität, Qualifikation, Kapitalbildung oder Kosten-/Rahmenbedingungen. | Potenzial-/Produktivitätsindex oder Skill-/Kapazitätsindikator (Basis 100); Quartal/Jahr. | Qualifizierung/Infrastruktur kann Kapazität verzögert erhöhen; Anfangskosten und Zielkonflikte bleiben. Keine einheitliche Einzelmaßnahme. |

**Abgrenzung Wachstum vs. Angebotsorientierung (Modellvorschlag):** Wachstumspolitik ist die langfristige Ziel-/Instrumentenfamilie (z. B. Innovation/Kapitalbildung); Angebotsorientierung beschreibt die Wirkungsrichtung auf Angebot, Kapazität oder Kosten. A02/A06 entscheiden, ob ein Ereignis zwei Tags oder getrennte Szenarien erhält; Doppelzählung vermeiden.

**Anforderung A02:** je Kategorie mindestens ein Szenario mit Auslöser, Ziel, Zwischenindikator, qualitativer Wirkungshypothese, Verzögerung, Unternehmensfolge und Zielkonflikt. Bei unsicherer Wirkung Alternativen sichtbar halten. Keine numerischen Koeffizienten ohne eigene Kalibrierungsgrundlage.
**Anforderung A03:** Makroindikatoren von Buchungen trennen; nur autorisierte Vertrags-/Preis-/Kostenereignisse ändern Ledger.

## 6. Verbraucherpreisinflation versus Unternehmensinputkosten

Destatis beschreibt den VPI als gewichteten Warenkorb privater Haushaltsausgaben. Obergruppen und Gewichte des Wägungsschemas bleiben regulär über fünf Jahre konstant; Preisrepräsentanten können sich ändern. Der HVPI dient internationaler Vergleichbarkeit und der EZB-Preisstabilitätsbeurteilung; seine Gewichte werden jährlich aktualisiert. Eurostat beschreibt eine Kettenverkettung Laspeyres-artiger Aggregate. Amtliche Methoden sind komplexer als ein einfacher Festgewichtsindex.

**Didaktischer Vorschlag:** Der Spielwert heißt „simulierter Verbraucherpreisindex“, nicht „amtlicher VPI/HVPI“. Warenkorb/Gewichte kommen aus einer datierten Destatis-Ausgabe ausgewählter Obergruppen; Basis, Ausschlüsse, Quellstand, Rundung und Versionswechsel werden festgehalten. Eine innerhalb des Jahres feste Gewichtung ist VPI-ähnlicher; jährliche Verkettung HVPI-ähnlicher. A02 muss die Variante benennen. Dieser Bericht setzt keine Produktgewichte fest.

Bei Gewichten \(w_i\) mit Summe 1, Basispreis \(p_{i,0}\), Periodenpreis \(p_{i,t}\):

\[
I_t = 100 \times \sum_i w_i (p_{i,t}/p_{i,0})
\]
\[
\pi_{m/m,t}=100 \times (I_t/I_{t-1}-1),\quad
\pi_{y/y,t}=100 \times (I_t/I_{t-12}-1)
\]

I ist dimensionsloser Indexpunktwert mit Basis 100; Inflation ist Prozent. Modellvorschlag: intern volle verfügbare Präzision nutzen und erst Anzeige runden. A02 bestätigt konkrete Rundung; amtliche Rundungsregeln werden nicht übertragen.

**Nur Rechendemonstration, kein Produktkorb:** Bei rein illustrativen Gewichten 0,50/0,30/0,20 und Preisrelativen 1,10/1,00/0,90 ergibt sich \(I_t=100×(0,55+0,30+0,18)=103\). Diese künstlichen Werte sind nicht als Warenkorb oder Gewichte zu übernehmen.

Der Unternehmensinputkostenindex ist separat: Material, Energie, Lohn und Transport nach betrieblicher Kostenstruktur; eigener Basiswert, Gewichte und Update-Regel. Er ist weder VPI/HVPI noch automatisch eine Buchung. Einzelbetriebliche Kosten können anders verlaufen als Haushaltsverbraucherpreise.

**A02:** mindestens drei Güter-/Dienstleistungspositionen mit offizieller Klassifikation, datierten Gewichten, Basiszeitpunkt, Preisquelle und Version; Tests für konstante Preise, Einzelpreisänderung und Basiswechsel. Jahresrate erst bei zwölf Perioden Historie berechnen, sonst fehlend anzeigen.
**A03:** Indexbewegung darf Kalkulationsinformation sein, aber selbst keine Buchung und keine nachträgliche Änderung fester/offener Verträge auslösen.

## 7. Datierte Primärquellen / Referenzgrenzen

Links am 2026-10-31 geprüft; nur amtliche Statistik/Behörden und EZB/Bundesbank/OECD-Primärquellen, keine Foren oder kommerziellen Sekundärquellen.

1. Deutsche Bundesbank, Glossar „Konjunktur“, Zugriff 2026-10-31: https://www.bundesbank.de/dynamic/action/de/startseite/glossar/723820/glossar?contentId=652532&firstLetter=K — Trend-/Zyklusbezug, reales BIP und Output Gap.
2. Deutsche Bundesbank, „Berechnung trendbereinigter Indikatoren“, 2005: https://www.bundesbank.de/resource/blob/689376/58120ea8e8765010fc517b26426a9719/mL/2005-06-14-dkp-19-data.pdf — Vierphasenzyklus und Begriffsgrenzen; historische Methodendiskussion.
3. OECD Composite Leading Indicators, Datenupdate laut Seite 2026-10-07; Zugriff 2026-10-31: https://www.oecd.org/en/data/datasets/oecd-composite-leading-indicators-clis.html — Wendepunkte relativ zum Trend; qualitative, keine quantitative Vorhersage.
4. Destatis, „Auftragseingangsindex im Verarbeitenden Gewerbe“, Zugriff 2026-10-31: https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Industrie-Verarbeitendes-Gewerbe/Methoden/Erlaeuterungen/auftragseingangsindex.html — getrennte Inlands-/Auslandsaufträge, Wert-/Volumenindex, monatlicher Frühindikator; Abdeckung beachten.
5. Destatis, „Konjunkturindikatoren“, Zugriff 2026-10-31: https://www.destatis.de/DE/Themen/Wirtschaft/Konjunkturindikatoren/_inhalt.html — BIP, Arbeitskosten, Arbeitslosigkeit, Außenhandel, Aufträge; die Themenseite wird seit KW 43/2026 nicht mehr aktualisiert, GENESIS/Dashboard bleiben Alternativen.
6. EZB, „Transmission mechanism of monetary policy“, Zugriff 2026-10-31: https://www.ecb.europa.eu/mopo/intro/transmission/html/index.de.html — Zins-/Kredit-/Erwartungskanäle und lange, variable, unsichere Verzögerungen.
7. EZB, „What is the role of exchange rates?“, Zugriff 2026-10-31: https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/role_of_exchange_rates.em.html — Wechselkurs ist kein EZB-Ziel; Importpreis-/Vorleistungskanal.
8. BMF, FAQ Stabilitäts- und Wachstumspakt, 08.05.2024: https://www.bundesfinanzministerium.de/Content/DE/FAQ/stabilitaets-und-wachstumspakt.html — automatische Stabilisatoren und Zusammenspiel Fiskal-/Geldpolitik.
9. Bundesbank, Energiepreis-Schock und Konjunkturerholung, 12.06.2026: https://www.bundesbank.de/de/presse/pressemitteilungen/deutschland-prognose-der-bundesbank-energiepreis-schock-bremst-konjunkturerholung-964728 — Beispiel für gleichzeitige Energie-, Nachfrage-, Liefer- und Fiskalimpulse; Prognose bleibt szenariogebunden.
10. BMAS, Tarifregister, Zugriff 2026-10-31: https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Tarifvertraege/Tarifregister/tarifregister-art.html — Tarifautonomie, Parteien, Löhne und Arbeitsbedingungen.
11. Bundesagentur für Arbeit, Arbeitsvermittlung, Zugriff 2026-10-31: https://www.arbeitsagentur.de/arbeitslosengeld-2/arbeitsvermittlung — Vermittlung/Beratung/Qualifizierung; keine feste makroökonomische Effektstärke.
12. UBA, Energiesparen in Industrie und Gewerbe, Zugriff 2026-10-31: https://www.umweltbundesamt.de/themen/klima-energie/energiesparen/energiesparen-in-industrie-gewerbe — ordnungsrechtliche, ökonomische und informative Instrumente.
13. UBA, Wirtschaft und Umwelt, Zugriff 2026-10-31: https://www.umweltbundesamt.de/themen/wirtschaft-konsum/wirtschaft-umwelt — Chancen/Kosten betrieblicher Umweltmaßnahmen, keine pauschale Wirkung.
14. Destatis, VPI-Methodenerläuterungen, Zugriff 2026-10-31: https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/Methoden/Erlaeuterungen/verbraucherpreisindex.html — Warenkorb, Gewichte, Preisrepräsentanten, Qualitäts-/Mengenanpassung.
15. Eurostat, HICP Methodology, Zugriff 2026-10-31: https://ec.europa.eu/eurostat/web/hicp/methodology/ — Kettenverkettung und Laspeyres-artige Aggregation.
16. Eurostat, HICP Information on data, Zugriff 2026-10-31: https://ec.europa.eu/eurostat/web/hicp/information-data — Zweck und jährliche Gewichtsaktualisierung; Methodenänderungen ab Februar 2026 vermerkt.
17. Destatis, Wägungsschema HVPI 2025: https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/Methoden/Downloads/waegungsschema-hvpi-2025.pdf?__blob=publicationFile&v=3 — datierte Gewichtungsquelle; Basis/Klassifikation beim Übernehmen festhalten.
18. Destatis, „Messzahlen und Indizes“, Zugriff 2026-10-31: https://service.destatis.de/eLearning/modul12/lm_pg_1582.html — didaktische Index-/Inflationsformeln, keine vollständige amtliche Methodik.

## 8. Übergaben und offene Punkte

### A02 – Simulation

- Eine konsistente klassische Phasen- oder Trendzyklusdefinition wählen; Indikatoren, Einheiten, Trend/Synthetik, Eintritt/Verbleib/Übergang, Verzögerung, Seed und Reproduzierbarkeit dokumentieren.
- Gemeinsamen Monats-/Tagesereignisvertrag festlegen: Periodengrenzen, Reihenfolge gleichzeitiger Ereignisse, Protokoll.
- Vier Phasen mit getrennten kontrollierbaren Nachfrage- und Kosten-/Kapazitätspfaden; Parameter als Annahmen kennzeichnen.
- Drei Außenwirtschafts- und zwei EZB-Szenarien mit Vorher-/Nachhermessung liefern.
- Acht Politik-Szenarien mit Auslöser, Ziel, Indikator, Verzögerung, Folge und Zielkonflikt; Doppelzählung Wachstum/Angebotsorientierung vermeiden.
- Preisindexvariante, Warenkorbquelle, Basis/Gewichte/Version, Rundung und Umgang mit fehlender Historie festlegen; Inputkostenindex separat.
- Reale Quelle und synthetische Zukunftsdaten nach Herkunft unterscheiden.

### A03 – Accounting/Finance

- Bestimmen, welche Makrogrößen Information/Prognose bleiben und welche tatsächliche Vertrags-, Preis-, Lohn-, Zins- oder Kostenänderung auslösen dürfen.
- Wechselkurs-/Importkosten und EZB-Zinswirkung auf Neu-/Variabelkredite sowie Beschaffung nur vertragskonform durchreichen; V2-Baseline und geschlossene Verträge nicht rückwirkend ändern.
- Sicherstellen, dass Indexbewegungen keine Buchung erzeugen; Ledgerwirkung nur bei autorisierten Ereignissen.
- Perioden-, Rundungs- und Monatsabschlussübergabe definieren.

### A06/A09

A06 sollte Kompetenzlandkarte/Trennschärfe auf Wirtschaftsfachwirtniveau prüfen. A09 prüft später Quellenbindung, Messbarkeit, Grenzfälle und Reproduzierbarkeit. Beide Reviews sind in dieser Quellenphase nicht erfolgt.

### Rückfragen an A01

Aus A08-Sicht ist für den nächsten Modellierungsauftrag keine Nutzerentscheidung zwingend. A02/A03 können zunächst konsistente, klar markierte Modellannahmen ausarbeiten. Wird eine Produktentscheidung nötig, soll A01 eine Entscheidungsvorlage mit Empfehlung, Wirkung und Folgeauftrag erstellen. Keine direkte Rückfrage an den Nutzer wurde gestellt.

## 9. Nachweise

- **Ausführung:** Preflight abgeschlossen; Primärquellen recherchiert; Bericht verfasst.
- **Fachreview:** nicht ausgeführt; A02/A03/A06-Übergaben offen.
- **Unabhängige QA:** nicht ausgeführt; A09 offen.
- **Tests:** nicht ausgeführt; keine Implementierung.
- **Browser-/Gerätetest:** nicht ausgeführt; kein Produkt-/UI-Artefakt.
- **Git-Verifikation:** Preflight bestätigte main = origin/main = 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c. Vorhandene lokale Änderungen und CP-0274/CP-0275 blieben erhalten. Nach Berichtserstellung folgt Status-/Whitespace-Prüfung.
- **Commit/Push:** nicht ausgeführt.

## 10. Übergabe an A01

Quellen reichen aus, um V3-Kanäle zu spezifizieren, aber nicht um numerische Spielkausalitäten zu behaupten. Vier Phasen lassen sich über Aktivitätslage plus Richtung unterscheiden; Schwellen/Übergänge bleiben Modellparameter. Wechselkurs, Auslandsnachfrage und Lieferstörungen bilden drei Außenwirtschaftskanäle. EZB-Quellen stützen Zins-/Kredit-/Erwartungskanäle mit langen variablen Verzögerungen, nicht sofortige proportionale Firmenwirkung. Die acht Politikfelder brauchen explizite Szenarioannahmen/Zielkonflikte. Ein quellenbasierter Verbraucherpreiswarenkorb muss klar vom amtlichen Index und vom Unternehmensinputkostenindex getrennt werden.

**Nächster Schritt:** A01 beauftragt A02 mit Simulations-/Ereignisvertrag und A03 mit Finanzübergabe; anschließend A06-Fachreview und A09 unabhängige QA. T-0063 bleibt bis zu diesen Übergaben IN_PROGRESS.

## 11. Phase-1-Ergänzung: Variablen-Provenienzmatrix (Prüfstand 2026-10-31)

Diese Matrix präzisiert die Quellen nach beobachteter Größe, Einheit, Beobachtungs-/Veröffentlichungsrhythmus und Revisionsgrenze. Ein als „beobachtet“ dargestellter Wert muss Quellperiode, Veröffentlichungsdatum und verwendeten Datenstand ausweisen. Werte für V3-Zukunftsperioden sind Szenariowerte oder Prognosen, keine veröffentlichten Ist-Daten.

**Rechtsstatus für die Matrix:** Die genannten Statistik-/Institutionsreihen sind Mess- und Informationsquellen, für sich keine Rechtsnorm, Tarifbindung, Steuer-/Abgabenpflicht, Förderzusage oder Vertragsklausel. Eine konkrete politische Maßnahme darf nur als tatsächlich geltende Maßnahme geführt werden, wenn zuständige amtliche Primärquelle, persönlicher/sachlicher Geltungsbereich, Beschluss-/Veröffentlichungsdatum, Inkrafttreten und etwaige Übergangsregel nach D-0161 erfasst sind. Für fiktive Ereignisse sind dieselben Felder als „synthetische Annahme“ zu markieren. Veröffentlichungs-/Revisionsstände werden je Lauf gespeichert; revidierte Daten schreiben keine früheren Spielbuchungen um.

| Größe / Verwendung | Primärquelle, beobachtete Einheit | Publikations-/Updatefrequenz; Revision | Beobachtungswert vs. V3-Modell/Übertragung |
|---|---|---|---|
| Reales BIP / Aktivität | Destatis VGR; preisbereinigte verkettete Volumenangaben, Quartalsniveau und Veränderungsraten in % | Quartalsweise Schnellmeldung und ausführliche Ergebnisse; spätere VGR-Revisionen. Datenveröffentlichungsstand erfassen. | Quartalsreferenz, keine tägliche Spielvariable. Monatliche Interpolation ist synthetische Annahme. Keine amtlichen universellen Phasenschwellen. |
| Konjunkturphase / Aktivitätslücke | Bundesbank-Konzept Konjunktur um Trend; Output Gap in % des geschätzten Potenzials | Trend-/Potenzialschätzung periodisch aktualisiert/revidiert; keine amtliche monatliche Phasenreihe. | Spielklassifikation: A02 dokumentiert Trendverfahren, Glättung, Hysterese, Übergang. Phasennamen sind kein amtliches Etikett einzelner Monate. |
| Auftragseingang Inland/Ausland | Destatis Industrie-Auftragseingangsindex: Wertindex bzw. deflationierter Volumenindex; Absatzrichtung; teilweise Euro-/Nicht-Euro-Raum | Monatlich; vorläufig etwa t+37 Tage, spätere Revisionen und saison-/kalenderbereinigte Reihen. Betriebe ab 50 Beschäftigten in ausgewählten Industriebereichen. | Nachfrage-/Außenhandelsreferenz, aber nicht repräsentativ für den kleinen Spielbetrieb; volatil und großauftragsanfällig. Tagesanfragen je Betrieb bleiben synthetisch. |
| Industrieproduktion / Kapazitätskontext | Destatis Produktionsindex in Indexpunkten und Veränderungsraten; Kapazitätsauslastung ggf. gesonderte Umfrage | Produktionsreihe monatlich, saison-/kalenderbereinigt und revisionsfähig. | Kontextreihe; individuelle Maschinenbelegung/Spielauslastung ist keine amtliche Messung. |
| Verbraucherpreisindex (VPI) | Destatis VPI, Deutschland, Indexpunkte 2020=100; Veränderung in % zum Vormonat/Vorjahresmonat | Monatlich; Schnellmeldung/endgültige Werte und mögliche Revision/Basisumstellung. | Beobachtete Haushaltsverbraucherpreise. Die Veröffentlichungen weisen für Katalog 2025 teilweise qualitätsbeeinflusste Vormonatsvergleiche aus. Kein Unternehmenspreisindex. |
| VPI-Wägung / Warenkorb | Destatis Wägungsschema Basis 2020; Ausgabenanteile privater Haushalte, höhere Ebenen mit VGR-Konsumausgaben | Allgemeine Basisumstellung 2015→2020 im Februar 2023; VPI 2026 weiterhin Basis 2020. Nicht mit jährlichem HVPI-Schema verwechseln. | Quelle belegt amtliche Gewichte und Methode, nicht A02s konkrete Spielkorb-Auswahl. A02 muss kompatible Gütergruppen, Gewichte und zugehörige Preis-/Teilindexreihen konkret übergeben. |
| HVPI als alternative Referenz | Eurostat/Destatis HVPI, Indexpunkte und Veränderungsraten, Euroraumvergleich | Monatlich; Gewichte jährlich aktualisiert. Destatis führt 2026 ein Schema mit Preisbasis Dez. 2025; Eurostat markiert Methodenänderungen ab Feb. 2026. | Nicht gleich VPI. Bei Nutzung muss A02 Produktwahl und Ketten-/Gewichtungsmethodik explizit benennen. |
| Unternehmens-Inputkosten | Destatis Erzeugerpreisindex gewerblicher Produkte (Inlandsabsatz), Monatsindex 2021=100, auch Vorleistungs-/Energiegruppen | Monatlich; Basisumstellung auf 2021 ab Jan. 2024; spätere Revisionen beachten. | Herstellerpreisstatistik ist nicht der konkrete Einkaufspreis. Material-/Energie-/Lohn-/Transportmix des Betriebs ist eigene Modellgewichtung; A03 bucht keine Indexbewegung. |
| Wechselkurs | EZB Euro-Referenzkurse, z. B. Fremdwährung je EUR (Seriendefinition beachten); alternativ explizit invertierte Quote | Täglich an Geschäftstagen; Zentralbank-Konzertationsverfahren. Referenzkurs ist nicht notwendigerweise Transaktionskurs. | Nur bei tatsächlicher Fremdwährungsexposition relevant. Lieferantenexposition und Preisweitergabe sind Annahmen; feste Verträge bleiben unberührt. |
| EZB-Leitzins / MRO | EZB Data Portal; Satz in % p.a., Änderung in Prozentpunkten mit Beschluss-/Wirksamkeitsdatum | Änderungstermine/Ereignisse, kein täglich neu festgelegter Satz; Portal-Reihen haben Tagesskala. | Historische Entscheidungen beobachtet, Zukunftsszenarien synthetisch. MRO-Nutzung folgt D-0100/D-0163; kein automatischer Reset bestehender Festzinsen. |
| Arbeitsmarkt / Knappheit | BA-Arbeitslose und Arbeitslosenquote nach BA-Definition, Stellenbestand/-zugang, Beschäftigung und berufliche Engpassindikatoren | Eckwerte monatlich; Beruf-/Regionalreihen mit eigenem Berichtsstand und Qualitätsbericht. | Aggregat ist kein individuelles Skillangebot, Lohn oder Einstellungswahrscheinlichkeit. Diese Übertragungen bleiben Modellannahmen. |
| Tarifpolitik / Lohn | BMAS-Tarifregister (Tarifverträge/Parteien/Geltungsbereich); Destatis Arbeitskosten-/Verdienstreihen (Index oder EUR je Stunde) | Tarifabschlüsse ereignisbasiert nach Branche; Arbeitskosten-/Verdienststatistik je Reihe quartals-/jährlich. Kein einheitlicher Tarifpolitikindex. | Tarifautonomie ist Quellenbefund. Spielereignis muss Branche, Beschäftigtengruppe und Wirksamkeitsdatum angeben; kein automatischer allgemeiner Lohnsprung. |
| Finanzpolitik / Staatsnachfrage | Destatis VGR: staatlicher Konsum/Investition, nominal bzw. preisbereinigtes Volumen (Quartal/Jahr); Defizit-/Finanzierungssaldo gesonderte Reihen | Quartals-/Jahresrechnung und Revisionen; konkrete Haushaltsmaßnahme hat Beschluss-/Wirksamkeitsdatum. | Keine einzelne amtliche Variable bildet Finanzpolitik vollständig ab. Maßnahmen-zu-Nachfrage-Übersetzung ist Annahme, keine Unternehmensbuchung. |
| Wachstumspolitik / Potenzial | Destatis Produktivität, Investitions-/F&E-Reihen; Trendpotenzial als Schätzung etwa nach Bundesbank/OECD-Methodik | Produktivität/VGR quartals-/jährlich, weitere Reihen oft jährlich und revisionsfähig. | Wachstumspolitik ist Zielfamilie, kein amtlicher Einzelindex. Maßnahme, Lag und Wirkungspfad werden als Szenarioannahme belegt. |
| Arbeitsmarktpolitik | BA monatliche Arbeitsvermittlung, gemeldete Stellen und Förderinstrumente (Anzahl/Quote nach Region/Programm) | Monatlich nach Statistikprogramm; Abdeckung/Definition im jeweiligen Qualitätsbericht. | Politischer Beschluss ist nicht gleich Arbeitslosenquote. Skill-/Vermittlungswirkung braucht Lag-Annahme; keine Förderung oder Buchung ohne konkrete Anspruchsregel. |
| Umweltpolitik / Ressourceneinsatz | UBA/amtliche Umweltökonomische Gesamtrechnungen und Destatis Energie-/Materialstatistik; Einheit je Reihe, etwa CO₂-Äquivalent oder Energieeinheit | Häufig jährlich oder quartalsweise; konkrete Regel/Fördermaßnahme stichtags-/ereignisbasiert. | Keine einzelne Umweltpolitik-Zeitreihe. Betriebsintensität ist eigene Kennzahl; Abgabe, Pflicht und Förderung brauchen konkrete Rechts-/Maßnahmenquelle. |
| Nachfrage-/Angebotsorientierung | Keine amtliche eigenständige Zeitreihe; analytische Klassifikation konkreter Maßnahmen nach Wirkungsrichtung | Maßnahmenbezogenes Beschluss-/Wirksamkeitsdatum; Indikatorrhythmus folgt jeweiliger Statistik. | Spielkategorien sind didaktische Einteilung. Die Wirkungs-Tags dürfen dieselbe Maßnahme nicht als zwei unabhängige Schocks zählen; gemeinsame Ereigniszuordnung erforderlich. |

### Inflationskorb, Formel und Quellenübergabe

Der amtliche deutsche VPI ist ein monatlicher Index mit Basis 2020=100. Die Veränderungsrate für Monat/Periode k ist 100 × (I_t / I_(t-k) − 1), mit k=1 für Vormonat und k=12 für Vorjahresmonat. Aus gerundeten Anzeigewerten können geringfügige Abweichungen zu amtlich publizierten Raten entstehen. Für einen eigenen Spielindex kann A02 interne Präzision verwenden und erst die Anzeige runden; das ist eine Modellentscheidung, keine übernommene amtliche Rundungsregel.

Ein amtlich belegtes Wägungsschema genügt nur zusammen mit kompatiblen Teilindizes und einheitlicher Basisperiode. Das amtliche VPI-Schema 2020 darf nicht mit jährlichen HVPI-Gewichten 2026 vermischt werden. A02 hat inzwischen in `V3-SPI-COICOP12-v1` alle zwölf Abteilungsgewichte (Summe 1.000 ‰) aus dem Destatis-Wägungsschema 2020 und die monatliche Komponentenstruktur aus GENESIS 61111-0006 verknüpft. Die V3-Pfade können für Zukunft und Testfälle synthetisch sein; sie sind keine amtliche Gesamt-VPI-Reihe. **A08-Review abgeschlossen (31.10.2026):** die Quellen- und Versionskompatibilität der konkreten Verknüpfung ist PASS. A08 bestätigte alle zwölf Gewichte, die COICOP-2-Steller und GENESIS 61111-0006 (2020=100). Datenrevisionen/Strukturbrüche bleiben bei jeder späteren Aktualisierung zu dokumentieren.

Der frühere allgemeine Methodenrahmen ist durch A02s aktuellen Vertragsstand konkretisiert: `V3-SPI-COICOP12-v1` nutzt die zwölf amtlichen VPI-Abteilungsgewichte 2020 und kompatible monatliche VPI-COICOP-Komponenten als beobachtbare Eingabe; synthetische Zukunfts-/Testpfade bleiben klar gekennzeichnet. A08 hat diese konkrete Tabellenverknüpfung unabhängig geprüft und bestätigt; siehe den Reviewnachweis vom 31.10.2026 im Arbeitsbericht. Die A02-Formel folgt der oben dokumentierten gewichteten relativen Preisaggregation; der Spielindex selbst wird nicht als amtlicher Gesamt-VPI bezeichnet.

### Ergänzte Primärquellen

- [Destatis VPI-Methodik](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/Methoden/Erlaeuterungen/verbraucherpreisindex.html), [Monatsreihe GENESIS 61111-0002](https://www-genesis.destatis.de/datenbank/online/statistic/61111/table/61111-0002), [Revision/Basis 2020](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/aktuell.html), [Gewichtsschema 2020](https://www.destatis.de/EN/Themes/Economy/Prices/Consumer-Price-Index/Publications/Downloads-Consumer-Price-Indices/weighting-pattern-2020.pdf?__blob=publicationFile&v=2).
- [Destatis HVPI-Gewichte 2026](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/aktuell-hvpi-ableitung-2025.html), [Eurostat HVPI-Methodik](https://ec.europa.eu/eurostat/web/hicp/methodology/).
- [Destatis Auftragseingangsindex-Methodik](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Industrie-Verarbeitendes-Gewerbe/Methoden/Erlaeuterungen/auftragseingangsindex.html), [Qualitätsbericht](https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Industrie-Verarbeitendes-Gewerbe/auftragseingangsindex.html), [Revisionskalender](https://www.destatis.de/DE/Methoden/Revisionen/Tabellen/revisionskalender-industrie-verarb-Gewerbe.html), [BIP-Quartalsdaten](https://www.destatis.de/DE/Themen/Wirtschaft/Volkswirtschaftliche-Gesamtrechnungen-Inlandsprodukt/Tabellen/bruttoinlandsprodukt-viertel-jahr-bip.html).
- [Destatis Erzeugerpreisindex/GENESIS 61241-0002](https://genesis.destatis.de/datenbank/online/statistic/61241/table/61241-0002), [Basisumstellung 2021](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Erzeugerpreisindex-gewerbliche-Produkte/Methoden/Erlaeuterungen/basisumstellung.html).
- [BA Arbeitsmarkteckwerte](https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Rundschau-Arbeitsmarkt/Eckwerte-Arbeitsmarkt/Eckwerte-Arbeitsmarkt-Nav.html), [BA Engpassanalyse](https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Interaktive-Statistiken/Fachkraeftebedarf/Engpassanalyse-Nav.html), [BMAS Tarifregister](https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Tarifvertraege/Tarifregister/tarifregister-art.html).
- [EZB Leitzinsen](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html), [EZB Key Rates Portal](https://data.ecb.europa.eu/key-figures/ecb-interest-rates-and-exchange-rates/key-ecb-interest-rates), [Transmission](https://www.ecb.europa.eu/mopo/intro/transmission/html/index.de.html), [Euro-Referenzkurse](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).
- [Destatis VGR-Quartale](https://www.destatis.de/DE/Themen/Wirtschaft/Volkswirtschaftliche-Gesamtrechnungen-Inlandsprodukt/Tabellen/bruttoinlandsprodukt-viertel-jahr-bip.html), [UBA Umwelt und Wirtschaft](https://www.umweltbundesamt.de/themen/wirtschaft-konsum/wirtschaft-umwelt), [UBA Umweltökonomische Gesamtrechnungen](https://www.umweltbundesamt.de/daten/umwelt-wirtschaft/umwelt-oekonomische-gesamtrechnungen-uebersicht).

## 12. Phase-1-Übergaben und Nachweise aktualisiert

- **A02:** Herkunftstyp je Variablenpfad (beobachtet, abgeleitet, synthetisch, Hypothese), Quellperiode, Publikationsdatum, Datenrevision und Einheit ausweisen. BIP/Auftragseingang sind keine täglichen Reihen; Zwischenwerte bleiben Szenariodaten. Den gelieferten `V3-SPI-COICOP12-v1` anhand amtlicher Gewichte/Komponentenquelle und Versionskompatibilität fachlich gegenprüfen; VPI/HVPI nicht vermischen. Konkrete Maßnahmen von Wirkungs-Tags trennen und Doppelzählung verhindern. D-0163-MRO-Zukunftspfad nur bei fehlenden realen EZB-Daten, mit sichtbarem Lag/Unsicherheit und ohne automatische Kreditwirkung.
- **A03:** Die bestehende Finanzübergabe bleibt maßgeblich. Makro-/Politik-/FX-/Zinswerte bleiben Information/Prognose, bis ein autorisiertes Vertrags-/Finanzereignis vorliegt; keine Indexbuchung.
- **A06/A09:** Quellenzuordnung, Aktualität, Revisionsstatus und Vollständigkeit später fachlich/QA prüfen.
- **Ausführung:** Vollständiger A08-Preflight gegen AGENTS/Struktur/Rechte, MG-002/V3-Zielkarte, T-0063–0069, Collaboration State, CP-0279, D-0159–0164 und D-0100–0102, Makro-/Finanz-/Markt-/Produktverträge, Rechtsregister sowie Status/Diff durchgeführt. Nur A08-Quellenberichte ergänzt.
- **Konfliktreview:** A02/A03 repo-basierte Vertragsreviews sind erfolgt. A08s unabhängiger Quellenreview im Repository ist am 31.10.2026 mit PASS abgeschlossen; die Reviewmatrix und Grenzen stehen im A08-Arbeitsbericht.
- **Fachreview / unabhängige QA / Tests / Browser-Gerät:** nicht ausgeführt; keine Implementierung.
- **Git:** kein Commit/Push; nach Änderung zielbezogener Status-, Link- und Whitespacecheck erforderlich. Andere lokale Änderungen bleiben erhalten.
- **Nächster Schritt an A01:** A08-Quellenreview des nun gelieferten T-0063-SPI-Warenkorbs anhand Destatis-Wägungsschema/GENESIS durchführen, sobald der A08-Agenten-Workspace Repo-Zugriff hat. AG/eG/GmbH & Co. KGaA bleiben Kandidaten mit Vor-Release-Auswahl; dieser Quellenbericht trifft keine Scope-Entscheidung.


