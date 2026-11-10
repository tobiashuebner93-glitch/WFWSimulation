# A08 – T-0068 Finaler Quellen- und Zuordnungsreview

**Status:** Gesamtgate **NICHT BESTANDEN** – gezielte Quellen- und Mappingkorrekturen offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A08 – RESEARCH
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0068
**Prüfdatum:** 2026-10-31; Rechtsstand gemäß D-0161
**Checkout:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, D-0147/D-0159/D-0161–D-0164, A08 T-0063/T-0064-Quellenpakete, A02/A03-Verträge, aktueller A06-Katalog und V3-Kompetenzmapping, A07-Endreviewberichte sowie `git status`/`git diff --check` geprüft. Vorhandene Änderungen anderer Agenten blieben unangetastet.

## Auftrag und Prüfumfang

Read-only-Review aller 50 Ereignisfragen EVT-001–EVT-050 sowie der Eventzuordnung zu den Kriterien V3-01–V3-21. Geprüft wurden Quellenherkunft, Tragfähigkeit der jeweiligen Quellenart für die Aussage, Trennung von Primärquelle, Nutzerentscheidung, Spielvertrag und synthetischem Szenario sowie aktuelle Rechtsanker für die Rechtsfragen. Antwortschlüssel und Ablenker sind A07-Gegenstand; Produkt-, Architektur-, Rechts- oder Releasefreigaben werden hier nicht erteilt.

## Gate-Matrix

| Gate | Ergebnis | Befund |
|---|---|---|
| Umfang/ID-Inventur | **PASS** | 50 fortlaufende EVT-001–EVT-050-Einträge vorhanden. Die Items kennzeichnen Quellenpfade, Lernwirkung und Mutation. |
| Herkunftstypen | **PASS mit Einschränkung** | Nutzerentscheidung, interne Spielverträge und synthetische Zahlenwerte sind überwiegend erkennbar getrennt. T68-S1 (WFachwPrV §4 Abs.1) ist nur Prüfungsrahmen/Kompetenzanker, keine Quelle für Fallwerte oder fachliche Einzelfakten. |
| Item-Traceability | **NICHT BESTANDEN** | Die Kürzel T68-S1–S5 verweisen auf umfangreiche Pakete; die Kataloglegende sagt selbst, dass sie keine pauschale Freigabe ersetzen. Für die nachstehend genannten Rechts-/Methodenaussagen fehlt am Item die direkte einschlägige Fundstelle oder eine ausdrücklich auf den Vertrag/das Szenario begrenzte Begründung. |
| Rechtsquellen / Rechtsstand | **NICHT BESTANDEN** | EVT-043/044 benötigen genauere Primärnormen für die abgefragte Vertretungs- bzw. Konzentrationsprüfung; D-IDs und WFachwPrV sind dafür keine Rechtsquelle. Die aktuellen amtlichen Normseiten wurden für HGB §§164, 170 und GmbHG §35 geprüft. |
| Kompetenz-Mapping | **NICHT BESTANDEN** | V3-16 und V3-21 nennen Ereignis-IDs, deren Inhalte die jeweilige Kompetenz nicht bzw. nur teilweise prüfen; V3-21 übergeht die nun vorhandene Konzentrationshälfte von EVT-044. |
| Produkt-/Entscheidungsgrenzen | **PASS mit Korrekturhinweis** | Katalog trennt Übungswirkung/keine Buchungsmutation grundsätzlich korrekt. Der Katalogkopf schreibt die V3-Nichtblockierung direkt D-0159 zu; D-0159 schließt Pflicht-Lernereignisse außerhalb V2 aus, legt aber den V3-Modus nicht selbst fest. Die Nichtblockierung folgt dem T-0068/V3-Umfang. |

## Konkrete Korrekturpunkte für A01/A06

### 1. Mapping V3-21 ist im aktuellen Stand sachlich veraltet

In `docs/learning/t-0068-v3-kompetenz-und-lernzuordnung.md`, Abdeckungstabelle V3-21, steht: „EVT-044 Kooperation; direkter Konzentrationsfall zu Anteilserwerb/Kontrolle fehlt“. Das trifft auf den aktuellen Katalog nicht mehr zu: **EVT-044 enthält ausdrücklich zwei Fälle** — gemeinsame Beschaffung bei getrennten Betrieben und Anteilserwerb bei fortbestehenden Rechtsträgern, bei dem Kontrolle noch zu prüfen ist. Der Itemtext schließt eine automatische Verschmelzung aus. Er deckt daher Kooperations- und einen begrenzten Konzentrations-Prüfungsfall ab, nicht aber abschließend die gesetzliche Einstufung oder Anmeldepflicht.

**Erforderliche Mappingkorrektur:** V3-21 auf EVT-044 als Kooperationsfall und vorläufigen Anteilserwerbs-/Kontrollprüfungsfall verweisen; die Grenzen „Kontrolle/Fusionskontrolltatbestand offen“ sowie „gesetzliche Verschmelzung nicht abgedeckt“ nennen. Keine weitergehende Abdeckung behaupten.

### 2. Mapping V3-16 ist zu weit und teilweise falsch

V3-16 listet EVT-029–032 und zusätzlich EVT-009–012 sowie EVT-033–036 „nur bei jeweils explizitem Index-/Inputpreisbezug“. Die aktuellen Items 033–036 behandeln Preiselastizität, Segmentierung, aggregierten Marktbericht und Reputation/Anfrageverhalten; sie sind keine VPI-/SPI- oder Inflationsfälle. In EVT-009/010/012 ist kein VPI-/SPI-Bezug der geprüften Kompetenz erkennbar. EVT-011 kann eine Inputpreis-/Knappheitskette berühren, ist dadurch aber kein Verbraucherpreisindex-Fall.

**Erforderliche Mappingkorrektur:** direkte V3-16-Abdeckung auf EVT-029–032 begrenzen; EVT-011 allenfalls als ausdrücklich gekennzeichneten angrenzenden Inputkostenfall ausweisen. EVT-033–036 und übrige Wechselkurs-/Außenwirtschaftsitems aus V3-16 entfernen.

### 3. EVT-043: Aussage zu getrennter Vertretung ist mit den Itemlinks nicht belegt

EVT-043 fragt, welche Vertretungsnachweise für GmbH und KG getrennt zu prüfen sind. Angegeben sind HGB §161 Abs.2 / §123, GmbHG §11, A08-Matrix und A02-Vertrag. Diese Fundstellen tragen vor allem die Verweisungs-/Register- bzw. Vor-Eintragungsfrage; sie belegen nicht direkt, wer die KG bzw. GmbH vertritt oder welche Geschäftsführungsbefugnis ein Kommanditist hat.

**Erforderliche Fundstellen:** HGB §170 (Kommanditist vertritt die KG nicht als solcher), HGB §164 (Kommanditisten von der Geschäftsführung ausgeschlossen; gesetzlicher Vorbehalt bleibt zu beachten) und GmbHG §35 (Vertretung der GmbH durch Geschäftsführer). Ergänzend kann HGB §124 über die Verweisung aus §161 Abs.2 für KG-Vertretung durch persönlich haftende Gesellschafter relevant sein. Der Itemstamm sollte klarstellen, dass es um Nachweise der konkreten Organ-/Vertretungsbestellung und Registerlage geht; die bloße Prüfung einer „getrennten Vertretung“ ist keine pauschale Rechtsfolge.

Amtliche Primärquellen, geprüft am 2026-10-31: [HGB §161](https://www.gesetze-im-internet.de/hgb/__161.html), [HGB §164](https://www.gesetze-im-internet.de/hgb/__164.html), [HGB §170](https://www.gesetze-im-internet.de/hgb/__170.html), [GmbHG §11](https://www.gesetze-im-internet.de/gmbhg/__11.html), [GmbHG §35](https://www.gesetze-im-internet.de/gmbhg/__35.html).

### 4. EVT-044: Konzentrationsprüfung enger und direkt belegen

EVT-044 unterscheidet eine Kooperation von einem Anteilserwerb und verlangt die Kontrolle zu prüfen. Das ist als Lernfall vorsichtig formuliert; „Fall 2 ist ein Konzentrationsfall“ kann jedoch als bereits feststehende Rechtsqualifikation gelesen werden, obwohl der Stamm ausdrücklich offen lässt, ob Kontrolle entsteht. D-0163 belegt den vom Nutzer genehmigten **Spielumfang**, nicht den gesetzlichen Zusammenschlusstatbestand. A08-Matrix/Legal Register enthalten passende Normpfade, aber sie sind am konkreten Item nicht direkt verlinkt.

**Erforderliche Fundstellen/Präzisierung:** Beteiligungserwerb/Kontrollerwerb nach [GWB §37](https://www.gesetze-im-internet.de/gwb/__37.html) und Anwendungsbereich/Schwellenprüfung nach [GWB §35](https://www.gesetze-im-internet.de/gwb/__35.html); falls der Kooperationsfall als wettbewerbsrechtliche Koordination behandelt wird, [GWB §1](https://www.gesetze-im-internet.de/gwb/__1.html), mit sachverhaltsabhängiger Prüfung. Formuliere den zweiten Fall als **potenziellen Konzentrations-/Kontrollprüfungsfall**; aus dem Anteilserwerb allein dürfen weder Kontrolle noch Anmeldepflicht oder Freigabepflicht abgeleitet werden. Keine Verschmelzung behaupten.

### 5. Katalogkopf: Reichweite von D-0159

Der Katalogkopf beschreibt die Ereignisse als nicht tagesblockierend „(D-0159)“. D-0159 dokumentiert, dass verpflichtende, tagesblockierende Lernereignisse nicht zu V2 gehören und lässt ausdrücklich offen, welcher späteren Version die Funktion zugeordnet wird. Für T-0068 ist der Nichtblockierungsumfang separat in Ticket/V3-Kriterien dokumentiert. **Empfehlung:** D-0159 als V2-Grenze kennzeichnen und den aktuellen optionalen V3-Modus auf T-0068/V3-Zielentscheidung stützen; D-0147 weiterhin nur für das Dashboardlimit und die kleinen Antwortfolgen zitieren.

## Quellenmodell und itembezogene Bewertung

Der Katalog verwendet T68-S1–S5 als lokale Provenienzpfade und warnt, dass diese Kürzel keine pauschale Quellenfreigabe sind. Das ist transparent, aber sie ersetzen bei konkreten Fakten-/Rechtsaussagen keine genaue Primärfundstelle. Für synthetic/seed values ist keine externe Evidenz nötig, sofern der Itemtext sie eindeutig als synthetisch bezeichnet und keine reale Effektstärke oder Rechtsfolge als Tatsache ableitet. Die A08-Pakete T-0063/T-0064 sind sachlich passende Sekundärwege zu den dort zitierten amtlichen Quellen, aber Quelle und Modellentscheidung müssen im Item unterscheidbar bleiben.

- **EVT-001–006:** Werte ausdrücklich synthetisch; Bundesbank/OECD/Destatis-Pakete passen als konzeptionelle Referenz für Konjunktur/Indikatoren. Keine Werte als amtliche Reihe ausgeben. EVT-003s saisonbereinigte Rate bleibt synthetischer Lehrfall.
- **EVT-007–014:** Wechselkurs- und Transmissionsgrundlagen passen zum A08-Paket; EVT-013/014s Vertragswirkung ist D-0163/Spielvertrag, keine externe EZB-Tatsache. Quellen-/Modelltypen getrennt halten.
- **EVT-015–028:** Politik- und Institutionenquellen sind überwiegend allgemeine Grundlagen. Die im Fall beschriebenen Maßnahmen/Wirkungspfade sind hypothetisch/synthetisch; keine konkrete Effektstärke folgt aus den Quellen. EVT-020 ist kein konkreter Umweltrechtsfall, sofern nicht Rechtsnorm, Geltungsbereich und Zeitstand benannt werden; als hypothetischer Lernfall kann es bleiben. EVT-026 Arbeitsausfall ist ausdrücklich hypothetisch und nicht aus einem Tarifregister abzuleiten.
- **EVT-029–032:** passende Gruppe für VPI/SPI; A08 T-0063 enthält Destatis-Methodik/Wägung/Preisindex und die Trennung vom betrieblichen Inputkostenindex. Im Eventkatalog nur der Paketpfad; pro Item muss die sachlich einschlägige Formel/Warenkorbquelle oder die synthetische Szenarioannahme klar sein.
- **EVT-033–040:** Markt-/Preis-/Segmentfälle; Spielvertrag stützt modellinterne Angebots-/Marktberichtzustände. Preiselastizität und Mittelwert-/Stichprobeninterpretation sind fachliche Methoden, keine A02-Spezifikation. Wenn sie als externe Tatsachen oder Regeln erscheinen, braucht es einen passenden Fachquellenanker; wenn es lediglich ein didaktischer Rechen-/Interpretationsfall ist, entsprechend als Lernregel/synthetische Marktstichprobe markieren.
- **EVT-041–043:** EVT-041/042 sind als synthetische Gründungs-/Vergleichsfälle begrenzt; WFachwPrV ist nur Prüfungsrahmen. EVT-043 ist der konkrete Rechtsquellenmangel oben.
- **EVT-044:** Rechts-/Konzentrationspräzisierung oben.
- **EVT-045–050:** überwiegend synthetische betriebliche Zahlen und interne Modellzustände; A02/A03-Verträge belegen Spielsemantik, nicht Markt- oder empirische Effektgrößen. Keine realen Wirkungen behaupten. A08/A02/A03 Referenzen sind deshalb ausreichend für Spielkontext, aber nicht als externe Tatsachenquelle zu interpretieren.

## Nutzerentscheidungen und Modellannahmen

- **Nutzerentscheidungen:** D-0147 (Dashboardlernlimit/-effekte), D-0159 (abgenommener Bestand und V2-Grenze für Pflicht-Lernereignisse), D-0161 (aktueller Rechtsstand), D-0163/D-0164 (V3-Formen und Zusammenschlüsse, KGaA-Benennung). Sie sind keine Primärquellen für Fachrecht oder empirische Werte.
- **Spielvertrag:** T68-S3 (A02) und T68-S4 (A03) belegen zulässige Zustände/Modellregeln, nicht deren Geltung in der realen Welt.
- **Synthetische Annahmen:** Zahlen, Wahrscheinlichkeiten, Marktstichproben, Maßnahmenpakete und Kapazitätsfälle gelten nur innerhalb des jeweils bezeichneten Falls. Bei konkreten Items, deren Werte nicht eigens als synthetisch benannt sind, A06 soll Kennzeichnung ergänzen.
- **Prüfungsrahmen:** [WFachwPrV §4 Abs.1](https://www.gesetze-im-internet.de/wfachwprv/__4.html) stützt den Prüfungsbereich Volks- und Betriebswirtschaft und Kompetenzbezug, nicht einzelne fachliche Markt-/Kosten-/Rechtsbehauptungen.

## Empfohlene Übergaben

1. A06 korrigiert die V3-16-/V3-21-Mappings, die V3-Umfangsattribution zu D-0159, und setzt für EVT-043/044 die konkreten Normanker und die beschriebene Kontrollgrenze.
2. A09 übernimmt die finale Vollständigkeits-, Quellenbindung-/Nichtmutations- und Nichtblockierungsprüfung; diese A08-Prüfung nimmt sie nicht vorweg.
3. A07s Schlüssel-/Ablenkerreview ist separat. Dieser Bericht bewertet dessen Inhalt nicht erneut.
4. Kein A08-Produkt- oder Rechtsfreigabebeschluss; AG/eG/GmbH & Co. KGaA bleiben vor Release zu entscheiden, D-0163/D-0164 unverändert.

## Prüfprotokoll / Grenzen

- Katalog EVT-001–050 und beide Mappingtabellen gegen T-0068/V3-Karte/A08-T-0063/-0064 geprüft; IDs und Zuordnungen auf Relevanz geprüft.
- Amtliche Primärnormseiten für HGB §§161/164/170, GmbHG §§11/35 sowie GWB §§35/37 (Kontroll-/Anwendungsbereich) und §1 (Koordination) für aktuelle Rechtsprüfung herangezogen. Der Maßstab ist D-0161 Rechtsstand am Stichtag, nicht das simulierte Startjahr.
- `git diff --check` beim Preflight lief ohne Whitespacefehler; Git zeigte bestehende LF/CRLF-Hinweise. Gitstatus enthält zahlreiche parallele Agentenänderungen; diese wurden nicht verändert. Kein Commit/Push.
- Keine Rechtberatung, Produktfreigabe, Schema-/Architekturänderung, Laufzeit-/Browserprüfung oder Antwortschlüsselabnahme.

