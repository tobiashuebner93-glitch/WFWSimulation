# A08 – T-0063: Empirische Makrozeitreihen – Addendum

**Stand:** 31.10.2026
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A08 – RESEARCH
**Ziel / Ticket:** MG-002; T-0063
**Status:** Quelleninventar; keine Produkt- oder Modellentscheidung

## Zweck und Grenzen

Dieses Addendum ergänzt die Makrogrundlage um institutionelle Zeitreihen für Nachfrage, Produktion, Inputpreise, Zins und Wechselkurs. Sie eignen sich als aggregierte Kontext- und Kalibrierungsindikatoren. Sie belegen weder Einzelauftragspreise noch eine kausale Effektstärke für ein einzelnes Münchner Kleinstunternehmen. Einzelne Gebote, Kundenentscheidungen oder Übertragungskoeffizienten dürfen daraus nicht ohne zusätzliche Modellannahmen abgeleitet werden.

## Quelleninventar

| Bereich | Primärquelle und Reihe | Einheit / Frequenz / Gebiet | Verwendung und Grenze |
|---|---|---|---|
| Industrieaufträge, real | Destatis GENESIS 42151-0004, Auftragseingang im Verarbeitenden Gewerbe (Volumenindex), nach Absatzrichtung und Wirtschaftszweig | Monatlicher Index, Basis 2021=100; Deutschland; u. a. Inland/Ausland | Aggregierter Mengenindikator; vorläufige/revidierte Stände und Großauftragsvolatilität beachten. Kein Einzel-KMU- oder Gebotsindex. [Tabelle 42151-0004](https://genesis.destatis.de/datenbank/online/statistic/42151/table/42151-0004) · [Methodik](https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Industrie-Verarbeitendes-Gewerbe/Methoden/Erlaeuterungen/auftragseingangsindex.html) |
| Industrieaufträge, nominal | Destatis GENESIS 42151-0002, Auftragseingang im Verarbeitenden Gewerbe (Wertindex), nach Absatzrichtung/Wirtschaftszweig | Monatlicher Index, Basis 2021=100; Deutschland | Vermischt Mengen- und Preisänderungen; für reale Nachfrage den Volumenindex bevorzugen. [Tabelle 42151-0002](https://genesis.destatis.de/datenbank/online/statistic/42151/table/42151-0002) |
| Erzeugerpreise, Güter | Destatis GENESIS 61241-0002 und 61241-0004 (GP2019) | Monatlicher Preisindex, Basis 2021=100; Deutschland; Güterpositionen u. a. Metalle/Metallerzeugnisse | Produzentenpreise sind keine individuellen Einkaufspreise; Lieferantenrabatt, Transport, Vertrag und Beschaffungszeitpunkt weichen ab. Klassifikations-/Basiswechsel dokumentieren. [61241-0002](https://genesis.destatis.de/datenbank/online/statistic/61241/table/61241-0002) · [61241-0004](https://genesis.destatis.de/datenbank/online/url/73fb8c16) |
| EU-Inputpreise | Eurostat `sts_inpp_m`, Industrial producer prices by economic activity and industrial grouping | Monatlich; EU-Länder, NACE/MIG und Indexvarianten | Sektoraler Vergleich; nicht der konkrete Strom-, Gas- oder Metallvertrag. Auswahl von Land, NACE/MIG und Indexvariante beim Export protokollieren. [Dataset](https://ec.europa.eu/eurostat/databrowser/view/sts_inpp_m/default/table?lang=en) |
| Industrieproduktion | Eurostat `sts_inpr_m`, ergänzend `teiis090` für Manufacturing | Monatlicher Produktionsindex; NACE Rev. 2; Länderaggregate | Misst realisierte Produktion, nicht Auftragseingang oder freie Kapazität eines einzelnen Betriebs. Revisionen und Bereinigungsvariante beachten. [Dataset `sts_inpr_m`](https://ec.europa.eu/eurostat/databrowser/view/sts_inpr_m/default/table?lang=en) · [Manufacturing production](https://ec.europa.eu/eurostat/databrowser/product/view/teiis090) |
| Bayerischer Auftragseingang | Bayerisches Landesamt für Statistik, E1300C, Index des Auftragseingangs im Verarbeitenden Gewerbe | Monatlich; Bayern; ausgewählte Branchen und In-/Ausland | Der Monatsbericht umfasst Betriebe ab 50 tätigen Personen; nicht repräsentativ für Münchner Kleinstbetriebe oder Einzelgebote. [Fachseite und E1300C](https://www.statistik.bayern.de/statistik/wirtschaft_handel/verarbeitendes_gewerbe/) |
| Regionale Aktivität | Bayerisches Landesamt, E1101C, Monatsbericht Verarbeitendes Gewerbe nach Kreisen | Monatliche Struktur-/Aktivitätsgrößen; Bayern und verfügbare Kreise | Monatliche Erhebungen erfassen Betriebe ab 50 Personen; grober Regionalproxy, kein KMU-Auftragsmaß. Berichtsmonat, Gebiet und Unterdrückungen kleiner Fallzahlen beachten. [Fachseite/E1101C](https://www.statistik.bayern.de/statistik/wirtschaft_handel/verarbeitendes_gewerbe/) |
| EZB-Leitzinsen | EZB Data Portal, Key ECB interest rates: Hauptrefinanzierung, Einlagefazilität, Spitzenrefinanzierung | Zinssätze % p. a.; Eurogebiet; beschlussabhängige Änderungsdaten | Referenzgrößen der Geldpolitik, keine individuellen Unternehmens-/Dispozinsen. Serienkennung samt Download-Metadaten aus dem Portal übernehmen. [EZB-Leitzinsen](https://data.ecb.europa.eu/main-figures/ecb-interest-rates-and-exchange-rates/key-ecb-interest-rates) · [API-Hilfe](https://data.ecb.europa.eu/help/api/data) |
| Wechselkurs | EZB EXR, USD je EUR: `D.USD.EUR.SP00.A` (täglich); monatliche Frequenz über den passenden `M`-Schlüssel | Tages-/Monatsreferenzkurs; USD je EUR; Eurogebiet | Referenzkurs ist kein tatsächlicher Bank-/Lieferantenabrechnungskurs; Monatsaggregation und fehlende Wochenendfixings dokumentieren. [EZB API/Serienschlüssel](https://data.ecb.europa.eu/help/api/data) |

## Regeln für spätere Datenverwendung

1. Je Extraktion sind Abrufdatum, Berichtsperiode, Serien-/Tabellenkennung, Einheit, Gebiet, Indexbasis, Bereinigungsvariante und vorläufig/revidiert-Status festzuhalten.
2. Destatis-/Eurostat-/Bayern-Indizes dürfen ohne dokumentierte Umrechnung nicht über Basis- oder Klassifikationswechsel verbunden werden.
3. Makroindikatoren erzeugen keine Euro-Kosten oder Finanzbuchungen. EZB-Leitzinsen sind keine Firmenkreditkonditionen. Erzeugerpreise sind keine Einkaufsbelege.
4. Öffentliche Reihen rechtfertigen keine numerische Wirkungskonstante für einzelne Angebote. Wo keine belastbare Übertragungsstärke besteht, muss ein Effekt als synthetische, versionierte und testbare Szenarioannahme ausgewiesen werden.

## Nächster Handoff

**A02 – SIMULATION:** Quellenindikatoren und synthetische Wirkungsannahmen getrennt halten; dokumentieren, welche Betriebs-/Marktkanäle V3 tatsächlich nutzt und welche Szenarioparameter noch Vorschlag oder nicht kalibriert sind. **A03** prüft nur monetäre Folgen. Dieses Addendum setzt selbst keine Koeffizienten, ändert keine Fixtures und genehmigt keine Produktlogik.
