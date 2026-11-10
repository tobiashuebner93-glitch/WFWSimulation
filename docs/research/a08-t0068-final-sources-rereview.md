# A08 – T-0068 Quellen- und Mapping-Re-Review

**Status:** Gesamtgate **NICHT BESTANDEN** – drei präzise Mapping-/Provenienzkorrekturen vor A09-Gesamtgate erforderlich  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A08 – RESEARCH  
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0068  
**Prüfdatum:** 2026-10-31; Rechtsstandmaßstab D-0161  
**Vorgänger:** CP-0279; CP-0280 bleibt ENTWURF  
**Checkout:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und Umfang

Gelesen wurden AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279 und CP-0280-ENTWURF, T-0068, D-0147/D-0159/D-0161/D-0163/D-0164, der aktuelle A06-Katalog und das V3-Mapping, der frühere A08-Bericht, A06-Nacharbeitsbericht und A07s finales EVT-044-PASS. Der Arbeitsbaum enthält umfangreiche parallele Änderungen und neue Dateien. Sie blieben unverändert; dieser Bericht ist die einzige von A08 angelegte Datei. Kein Commit/Push.

Geprüft wurden alle 50 EVT-001–EVT-050-Einträge, Item-Quellenpfade, V3-01–V3-21-Mappinggrenzen, Item-Tags und die geänderten Rechtsitems EVT-043/044. A07-Aufgabenqualität wird nur anhand des gezielten EVT-044-Berichts referenziert; V3-Laufzeitintegration, A09-Nichtmutation und Releasefreigabe sind nicht Gegenstand dieses A08-Reviews.

## Gate-Ergebnis

| Gate | Ergebnis | Befund |
|---|---|---|
| Inventur / Itemquellen | **PASS mit Herkunftsgrenze** | 50 eindeutige, fortlaufende Items. Die Itemwerte und Fallfolgen sind überwiegend ausdrücklich synthetisch; Spielzustände werden als T68-S3/S4-Verträge ausgewiesen. T68-S1 ist Prüfungs-/Kompetenzrahmen, keine Fachfaktenquelle. S2/S5 sind nachvollziehbare Quellenpakete, aber Paketverweise dürfen nicht als empirische Bestätigung der synthetischen Zahlen oder als Rechtsfreigabe gelesen werden. |
| Aktuelle Rechtsquellen EVT-043 | **PASS** | Direkte amtliche HGB-/GmbHG-Verweise stützen die eng begrenzte Prüfung von KG-Partnervertretung, KG-Verweisung, Kommanditistenrolle und GmbH-Geschäftsführervertretung. Keine pauschale Eintragung oder Vertretungsmacht wird behauptet. |
| Aktuelle Rechtsquellen EVT-044 | **PASS** | GWB §37 Nr. 2, 3 und 4 werden getrennt; §35 wird als separater Anwendungsbereich behandelt. Ohne Beteiligungs-, Stimmrechts-, Umsatz-/Gegenleistungsangaben wird keine Anmeldepflicht festgestellt. Gemeinsame Beschaffung fällt nur abhängig von der konkreten Ausgestaltung unter §1. |
| Mapping V3-16 | **PASS** | Direkte VPI/SPI-Abdeckung ist auf EVT-029–032 begrenzt. EVT-011 ist nur als angrenzender Inputkostenfall markiert; die falschen Zuordnungen zu Nachfrage-/Wechselkursfällen wurden entfernt. |
| Mapping V3-21 | **PASS** | EVT-044 bildet Kooperation plus potenziellen Kontroll-/Konzentrationsprüfungsfall ab. Mapping schließt automatische Kontrolle, Anmeldung/Freigabe und gesetzliche Verschmelzung korrekt aus. |
| Übrige Kompetenz-/Entscheidungszuordnung | **NICHT BESTANDEN** | V3-13/14 und V3-11 behalten Überzuordnungen bzw. eine falsche Entscheidungsquelle. Siehe Befunde 1–3. Offene Abdeckung V3-06/07/10/17 ist dagegen transparent als offen ausgewiesen und wird nicht als vorhanden ausgegeben. |
| Lokale Linkziele | **PASS** | Alle 109 relativen Markdownlinks im Ereigniskatalog zeigen auf vorhandene Ziele; im Mapping wurden keine relativen Links gefunden. Die Linkauflösung ist lokal, sie bestätigt keine externe Verfügbarkeit. |

## Befunde für A01

### 1. V3-13 enthält zwei nicht außenwirtschaftliche Events

In `docs/learning/t-0068-v3-kompetenz-und-lernzuordnung.md`, Abdeckungsnachweis V3-13, steht EVT-007–012, mit EVT-011/012 „nur mit expliziter Inputkosten-/Knappheitskette“. EVT-011 (`vw-inflation`) behandelt einen simulierten Verbraucherpreisindex und einen unveränderten inländischen Stahlpreis. EVT-012 (`vw-scarcity`) behandelt Lagerbestand, Mindestbestellmenge, Lieferzeit und Liquidität ohne ausländischen Anbieter, Wechselkurs oder Auslandsnachfrage. Die eingeschränkte Klammer schafft keinen außenwirtschaftlichen Lernbezug für diese Fälle. EVT-010 nennt ausdrücklich ein importiertes Teil; EVT-007–009 behandeln Wechselkurs/Auslandsnachfrage. **Empfehlung:** V3-13 auf EVT-007–010 begrenzen; EVT-011/012 dort entfernen, außer A06 ergänzt in einem späteren Inhaltsauftrag einen tatsächlichen Außenwirtschaftskanal.

### 2. V3-14 ordnet reine Betriebsfälle als Politikereignisse ein

Die V3-14-Zeile sagt, EVT-015–028 würden „einzeln nach Politikfeld“ abdecken. Das trifft nicht auf alle IDs zu:

- EVT-019 prüft die individuelle Qualifikation und Arbeitsschrittfreigabe nach Schulung; es enthält keine Arbeitsmarktmaßnahme oder Politikentscheidung.
- EVT-023 behandelt eine Förderannahme als Finanzierungsbedingung, aber das Item konkretisiert weder politische Maßnahme noch Ziel-/Zwischenindikator; sein eigentlicher Lerngegenstand ist Maschinenkapazität und Produktionsbereitschaft.
- EVT-025 vergleicht Produktivitätsrate und Nachfragezeitraum; es enthält keine politische Maßnahme.

EVT-026 dagegen nennt ausdrücklich einen hypothetischen Tarifkonflikt und die daraus folgende Engpasskapazität; EVT-017/018/020–024/027/028 enthalten benannte Förder-, Tarif-, Umwelt-, Nachfrage- oder Politikannahmen. **Empfehlung:** EVT-019 und EVT-025 aus V3-14 entfernen; EVT-023 nur behalten, wenn das Item bzw. Mapping die Förderpolitik als Maßnahme/Ziel/Wirkungskette qualifiziert, andernfalls dem Investitions-/Produktivitätsbezug zuweisen. Die übrigen Politikfälle als szenariobasierte, nicht empirisch kalibrierte Abdeckung kennzeichnen.

### 3. V3-11 schreibt den Übungs-Nichtmutationsvertrag D-0159 zu

Die V3-11-Zeile nennt als Quelle „A02 Integrationsvertrag …; D-0159“ und sagt, Übung mutiere den Betriebszustand nicht. D-0159 legt laut Decision Log fest, dass verpflichtende, tagesblockierende Lernereignisse nicht zu V2 gehören; er setzt keinen V3-Übungs-/Nichtmutationsvertrag. Das Prinzip für Prüfungsantworten ohne Spiel-/Finanzmutation ist D-0147; die konkrete Trennung von Übungsmodus und Spielzustand muss gegen den A02/A05-Integrationsvertrag bzw. eine explizite V3-Schnittstelle belegt werden. **Empfehlung:** D-0159 hier entfernen; D-0147 für die allgemeine Trennung nennen und den A02/A05-Vertrag nur insoweit zitieren, wie er die konkrete Übungs-Nichtmutation tatsächlich festlegt. A09 prüft die Laufzeitgrenze separat.

Diese Korrekturen betreffen das Mapping-Dokument. Der A06-Katalogkopf schreibt D-0159 bereits richtig nur die V2-Grenze zu und macht den optionalen V3-Modus an T-0068/V3-Scope fest.

## Primärquellenprüfung

Am Stichtag 2026-10-31 wurden die offiziellen Texte von Gesetze-im-Internet direkt geöffnet bzw. im amtlichen Volltext geprüft:

- HGB [§ 124](https://www.gesetze-im-internet.de/hgb/__124.html) regelt die Vertretungsbefugnis der OHG-Gesellschafter; HGB [§ 161 Abs. 2](https://www.gesetze-im-internet.de/hgb/__161.html) verweist grundsätzlich auf OHG-Regeln für die KG.
- HGB [§ 164](https://www.gesetze-im-internet.de/hgb/__164.html) schließt Kommanditisten grundsätzlich von der Geschäftsführungsbefugnis aus (gesetzliche Ausnahme § 116 Abs. 2 Satz 1 bleibt im Wortlaut erhalten); [§ 170](https://www.gesetze-im-internet.de/hgb/__170.html) sagt, ein Kommanditist sei als solcher nicht zur Vertretung befugt.
- GmbHG [§ 35](https://www.gesetze-im-internet.de/gmbhg/__35.html) weist die gerichtliche und außergerichtliche Vertretung den Geschäftsführern zu. Die Trennung der Rechtsträger im Item ist damit angemessen; der konkrete Gesellschaftsvertrag, Registerstand und Bestellung sind weiter fallbezogen zu prüfen.
- GWB [§ 1](https://www.gesetze-im-internet.de/gwb/__1.html) verbietet Vereinbarungen mit wettbewerbsbeschränkendem Zweck oder Wirkung. [§ 37](https://www.gesetze-im-internet.de/gwb/__37.html) unterscheidet bestimmenden Einfluss (Nr. 2), die gesetzlichen Kapital-/Stimmrechtsschwellen 50 %/25 % (Nr. 3) und sonstigen wettbewerblich erheblichen Einfluss (Nr. 4). [§ 35](https://www.gesetze-im-internet.de/gwb/__35.html) enthält separat den Anwendungsbereich einschließlich Umsatz- und Gegenleistungsfall.
- Amtliche [WFachwPrV § 4](https://www.gesetze-im-internet.de/wfachwprv/__4.html) umfasst im Vw-Bereich grundlegende volkswirtschaftliche Zusammenhänge, betriebliche Funktionen, Existenzgründung/Rechtsformen und Unternehmenszusammenschlüsse. Das stützt die Themenwahl, nicht die einzelnen Fallwerte.

Die direkte Seite HGB § 164 reagierte im Webzugriff mit Timeout; der amtliche HGB-Gesamttext wurde über die offizielle Fundstelle durchsucht und enthält § 164 mit der oben genannten Regel. Der übrige EVT-043/044-Gesetzestext wurde direkt geladen. Es wurden keine nichtamtlichen Rechtsquellen benötigt.

## Herkunft / Reichweite

EVT-001–050 bestehen aus explizit hypothetischen/synthetischen Fällen, arithmetischen Übungen und als V3-Vertrag gekennzeichneten Zuständen. A08 T-0063 bietet die datierten amtlichen/institutionellen Grundlagen für Konjunktur, Wechselkurs, EZB-Kanäle, Politikfelder und VPI/SPI; die A02/A03-Verträge tragen ausschließlich Spielzustand und interne Modellannahmen. EVT-033 bezeichnet die Preisreaktion ausdrücklich als Modellheuristik; EVT-035 begrenzt Mittelwert/Median auf drei synthetische Fälle; EVT-042 bezeichnet seine Vergleichsmatrix ausdrücklich als synthetisch. Diese Grenzen sind ausreichend, um keine realen Markt- oder Effektgrößen zu behaupten. T68-S1 (WFachwPrV) ist in EVT-033/041/042/044 nur Kompetenz-/Prüfungsrahmen, nie Datenquelle.

Das Mapping ist nicht als vollständige Abdeckung jedes V3-Ziels zu verstehen: V3-06, V3-07, V3-10 und V3-17 sagen korrekt, dass passende Vw-Ereignisfragen fehlen oder RW-/BAB-Ergänzungen außerhalb dieses Katalogs liegen. Es gibt keine Einträge im Mapping, die die V2-Fragen oder deren Bestand ändern; die 50 neuen Vw-Events sind separat gehalten.

## Prüfungen und Übergabe

- **Ausführung:** vollständiger read-only Abgleich aller 50 Items, der V3-01–21-Tabelle, D-0147/D-0159 und EVT-043/044.
- **Fachreview:** A07 finaler EVT-044-Bericht ist PASS; A07 hat EVT-043/044 als Aufgaben-/Schlüsselreview ebenfalls zuvor gezielt geprüft. Keine neue A07-Abnahme durch A08 behauptet.
- **Unabhängige QA:** A09-T-0068-Vollständigkeits-/Nichtmutations-QA nicht ausgeführt, bleibt erforderlich.
- **Browser-/Gerätetest:** nicht ausgeführt und für dieses Quellenreview nicht einschlägig.
- **Git-Verifikation:** Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0d97e0a01b93266`; `git status --short` zeigte viele bestehende parallele Änderungen/Untracked-Dateien. Kein Commit/Push. `git diff --check` in diesem Review nicht ausgeführt. Es wurde nur dieser Bericht angelegt.
- **Offene Punkte:** A06 korrigiert die drei Mappingstellen aus Befunden 1–3; danach kann A01 A09 mit dem finalen Quellen-/Mappingbericht beauftragen. T-0068 bleibt bis zum A09-Gate und übrigen vereinbarten Integrationsabgleichen offen.
- **Nächster Schritt:** A01 adressiert A06 mit Befunden 1–3 und beauftragt nach Korrektur A09 für Vollständigkeit, Quellenbindung und Nichtmutation.

**Keine Rechtsfreigabe, keine Produkt-/Architekturentscheidung und keine Releasefreigabe.**


