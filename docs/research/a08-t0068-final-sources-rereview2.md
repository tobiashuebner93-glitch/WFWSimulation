# A08 – T-0068 Quellen-/Mapping-Re-Review 2

**Status:** Gesamtgate **NICHT BESTANDEN** – zwei Dokumentationswidersprüche sind noch zu bereinigen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A08 – RESEARCH
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0068
**Prüfdatum:** 2026-10-31; Rechtsstandmaßstab D-0161
**Vorgänger:** CP-0279; CP-0280 bleibt ENTWURF
**Checkout:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0d97e0a01b93266`

## Preflight und Änderungen

Erneut gelesen: AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279 und CP-0280-ENTWURF, T-0068, D-0147/D-0159/D-0161/D-0163/D-0164, aktuelles Katalog-/Mappingdokument, A06-Nacharbeitsbericht sowie beide vorherigen A08-T-0068-Reviews. Der Arbeitsbaum enthält zahlreiche parallele Änderungen und Untracked-Dateien; sie blieben unangetastet. Nur dieser Bericht wird von A08 angelegt. Kein Commit/Push.

Umfang: Re-Review der drei Befunde aus `a08-t0068-final-sources-rereview.md`, der A06-Korrektur zu V3-06, der Mappingreferenzen gegen EVT-001–050 sowie aktueller Quellen-/Provenienzclaims. Keine Katalog-/Produktänderung.

## Gate-Matrix

| Gate | Ergebnis | Befund |
|---|---|---|
| Vorherige Korrektur 1 – V3-13 | **PASS** | Detailzeile führt nur EVT-007–010 als Außenwirtschaftsbezug; EVT-011/012 werden ausdrücklich ausgeschlossen. Das entspricht den Itemstämmen. |
| Vorherige Korrektur 2 – V3-14 | **PASS** | EVT-019/025 sind nicht als Politikmaßnahmen eingestuft; EVT-023 ist korrekt als Kapazitäts-/Investitionsfall unter V3-09 geführt. Die übrigen Einträge nennen Politik-/Förder-/Tarif-/Umwelt-/Nachfrageannahmen und sind als didaktische Szenarien begrenzt. |
| Vorherige Korrektur 3 – V3-11 | **PASS** | D-0159 wird ausdrücklich nur als V2-Grenze für verpflichtende Tagesblockaden beschrieben. D-0147 und A02-Vertrag Abschnitt „A06 – Lernkontext“/`INT-08` stützen getrennte Dashboardwirkungen und neutrale Übungs-/Tooltip-Nichtmutation. |
| V3-06 Lernabdeckung | **PASS** | Übersicht und Detail markieren die Prozesskarte als geplant, derzeit nicht geliefert; Detail sagt ausdrücklich, es gebe weder einen vollständigen Lernprozess noch ein V3-06-Lernobjekt im T-0068-Katalog. Kein gelieferter End-to-End-Lernpfad wird behauptet. |
| Rechtsquellen EVT-043/044 | **PASS** | Die unmittelbaren amtlichen Links und Aussagen bleiben unverändert und entsprechen dem vorherigen Review. Keine neue Rechtsbehauptung oder Anmeldepflicht wird ausgedacht. HGB §§124/161/164/170, GmbHG §35 und GWB §§1/35/37 sind weiterhin passend begrenzt. |
| Item-ID-Referenzen | **PASS mit Zählkorrektur offen** | Jede in den positiven Detailzuordnungen genannte ID bzw. Spanne liegt im aktuellen Katalog. Die übergreifende A06-Zahl der direkt zugeordneten IDs ist jedoch falsch (siehe Befund 1). |
| Quellenstatus | **NICHT BESTANDEN** | Der Vorspann des Mappings sagt noch, T-0063-Quellen und SPI-Grundlagen blieben bis zur Lieferung offen; die Abdeckungsmatrix und aktuelle A08-Berichte sagen, Quellenpaket/Quellenprüfung seien geliefert/bestanden. Siehe Befund 2. |
| Lokale Ziele | **PASS** | Die relativen Ziele des Katalogs wurden lokal aufgelöst; kein fehlendes Ziel gefunden. Das bestätigt weder externe Erreichbarkeit noch Laufzeitintegration. |

## Restbefunde an A01

### 1. Mappinginventur und Abschlussbericht widersprechen sich

Der neueste Abschnitt `A06-Korrektur nach A09-Vollständigkeitsreview` in `docs/learning/a06-t0068-arbeitsbericht.md` behauptet: „23 IDs sind in den positiven Detailzuordnungen direkt verknüpft; 27 IDs sind dort nicht direkt zugeordnet“. Eine Expansion der positiven EVT-IDs und EVT-Spannen in der aktuellen Detailtabelle ergibt **46 eindeutige direkt referenzierte Item-IDs**; vier sind nicht direkt als Lernobjekt verknüpft: **EVT-011, EVT-012, EVT-025 und EVT-045**. EVT-011/012/025 sind ausdrücklich ausgeschlossen/anders eingeordnet; EVT-045 hat keinen direkten V3-Kriteriumseintrag. Die Zählung im Arbeitsbericht ist daher nicht reproduzierbar und kann die Coverage-Lücke falsch darstellen.

**Empfehlung:** A06 korrigiert die 23/27-Zahl nach einer deterministischen Expansion der aktuell positiven Referenzen oder dokumentiert ausdrücklich eine andere Zähldefinition und ihre Liste. Die Tabelle selbst führt V3-06 weiterhin ehrlich als nicht geliefert; diese Befundkorrektur verlangt keine neue Zuordnung und keine Änderung der 50 Items.

### 2. Vorspann hat einen veralteten T-0063-Quellenstatus

In `docs/learning/t-0068-v3-kompetenz-und-lernzuordnung.md`, Abschnitt „Zweck und Quellenstatus“, steht weiterhin, Makrofachquellen, Inflationskorb, Politikmaßnahmen und Kausalpfade blieben „bis zur A08/A02-Lieferung T-0063 offen“. Die Abdeckungsmatrix nennt anschließend A08-T-0063-Primärquellenprüfung vom 2026-10-31; T-0063-Bericht, A08-Quellenreview und A02-Makrovertrag liegen vor. Die aktuell noch offenen Abhängigkeiten betreffen insbesondere Modellintegration/Kausalpfadabnahme und A09-Szenarioreview, nicht die erfolgte Quellenlieferung. Der Vorspann erzeugt somit einen sachlichen Statuskonflikt und entwertet ohne Grund die inzwischen belegten Quellenpfade.

**Empfehlung:** Vorspann auf „Quellenpakete und Primärquellenprüfung liegen vor; numerische Spielparameter/Kausalpfade bleiben Modellannahmen und Integrations-/Review-Gates“ aktualisieren. Keine externe Quelle oder Produktwirkung ergänzen, die über die A08/A02/A03-Pakete hinausgeht.

## Quellen-/Rechtsgrenzen

Die Vorprüfung hat EVT-043/044 anhand amtlicher Gesetze-im-Internet-Primärtexte bzw. amtlichem Volltext geprüft: HGB [§124](https://www.gesetze-im-internet.de/hgb/__124.html), [§161](https://www.gesetze-im-internet.de/hgb/__161.html), [§164](https://www.gesetze-im-internet.de/hgb/__164.html), [§170](https://www.gesetze-im-internet.de/hgb/__170.html), GmbHG [§35](https://www.gesetze-im-internet.de/gmbhg/__35.html), GWB [§1](https://www.gesetze-im-internet.de/gwb/__1.html), [§35](https://www.gesetze-im-internet.de/gwb/__35.html), [§37](https://www.gesetze-im-internet.de/gwb/__37.html). Der vorherige A08-Bericht dokumentiert die erfolglose direkte Webabfrage von HGB §164 (Timeout) und die Prüfung über den amtlichen HGB-Volltext. A06 hat diese Rechtsitems seitdem nicht geändert. Die Direktlinks und der amtliche Wortlaut stützen die engen Aussagen; es wird keine Rechtsberatung oder Freigabe abgeleitet.

Alle 50 Itemzahlen bleiben als synthetische Fälle/Szenariowerte erkennbar; A02/A03-Verträge werden nur als Spielzustands-/Modellquellen benutzt. T68-S1/W FachwPrV §4 ist Prüfungsrahmen, keine Daten- oder Wirkungsquelle. Keine neue Überbehauptung in den 50 Item-Quellenzeilen gefunden.

## Prüfungen und Übergabe

- **Ausführung:** alle drei vorigen A08-Befunde, V3-06 Übersicht/Detail, Mapping-Referenzen und Quellenstatus read-only geprüft.
- **Fachreview:** A07 EVT-044 final PASS liegt vor; dieses Review ersetzt keine vollständige A07-Abnahme aller 50 Items.
- **Unabhängige QA:** A09-Nichtmutations-/Vollständigkeits-QA nicht ausgeführt; bleibt separates Gate.
- **Browser-/Gerätetest:** nicht ausgeführt; nicht Gegenstand des Quellenreviews.
- **Git-Verifikation:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0d97e0a01b93266`; `git status --short` zeigte viele parallele Änderungen und Untracked-Dateien. Kein Commit/Push; `git diff --check` nicht ausgeführt. Nur dieser Bericht wurde erstellt.
- **Offene Punkte:** A06 soll Inventurzählung im Arbeitsbericht und den überholten Quellenstatus im Mappingvorspann korrigieren. Danach kann A01 das A08-Quellen-/Mappinggate als bestanden übernehmen; A09-Gesamtgate bleibt separat offen.
- **Nächster Schritt:** A01 adressiert A06 mit Befunden 1–2; danach A09 mit Nichtmutations-/Vollständigkeits-QA.

**Keine Rechtsfreigabe, keine Produktentscheidung und keine Releasefreigabe.**
