# A08 – Unabhängiger Quellenreview T-0063/T-0064

**Status:** PASS (Quellen-/Rechtsformmatrix; 2026-10-31)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Rolle:** A08 – RESEARCH
**Ziele/Tickets:** MG-002; SLG-002.2/SLG-002.5; T-0063, T-0064
**Prüfumfang:** Read-only Review im Repo `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; aktuelle lokale Änderungen blieben erhalten. Keine Rechtsfreigabe konkreter Unternehmensfälle und keine Prüfung späterer Implementierung/Jahresläufe.

## Ergebnisse

| Prüfpunkt | Status | Befund |
|---|---|---|
| SPI-Gewichte | PASS | Zwölf Gewichte entsprechen zeilenweise Destatis VPI, Wägungsschema Basis 2020; Summe 1.000,00 ‰, Normierung 1,00000. |
| COICOP-Ebene | PASS | Die Einträge bilden die zwölf VPI-Abteilungen der obersten COICOP-Ebene in passender Bezeichnung und Reihenfolge; keine HVPI-/ECOICOP-Gewichte vermischt. |
| Monatskomponenten | PASS | GENESIS 61111-0006 bietet monatliche deutsche VPI-Komponenten nach COICOP einschließlich aller zwölf 2-Steller mit Basis 2020=100; die Zuordnung ist kompatibel. |
| Aussagegrenze / Versionierung | PASS | Der Output ist als VPI-gewichtet aufgebauter Spielpreisindex gekennzeichnet, nicht als amtlicher Gesamt-VPI/HVPI. Zukunftspfade und Test-Fixtures sind synthetisch. Korb, Basis und Quellenstand sind versioniert; neue Gewichtsschemata brauchen eine neue Version. |
| Rechtsstand D-0161 | PASS | Rechtsstand zum Prüfzeitpunkt 31.10.2026 gilt unabhängig vom Simulationsstartjahr; Matrix ist Quellenbefund, keine pauschale Rechtsfreigabe. |
| GmbH & Co. KG | PASS | Als spielbar für V3 bestätigt; GmbH und KG bleiben getrennte Rechtsträger mit je einzeln zu modellierenden Register-, Vertretungs- und Einlagekonstellationen. |
| AG, eG, GmbH & Co. KGaA | PASS | Als Kandidaten mit offener Aufnahmeentscheidung vor V3-Release geführt; D-0164 benennt KGaA korrekt, entscheidet nicht über Aufnahme. |
| UG & Co. KG | PASS | Ausschließlich Vergleichsform, nicht bestätigte V3-Option oder zusätzliche Kandidatin. |
| Grenzen | PASS | Keine pauschalen Haftungsfreiheits-/Konformitätsversprechen; Matrix verweist auf konkrete Rechtsform-, Vertretungs- und Registervoraussetzungen. |

## Primärquellen

- [Destatis VPI-Wägungsschema 2020](https://www.destatis.de/EN/Themes/Economy/Prices/Consumer-Price-Index/Publications/Downloads-Consumer-Price-Indices/weighting-pattern-2020.pdf?__blob=publicationFile&v=2)
- [GENESIS 61111-0006](https://genesis.destatis.de/datenbank/online/table/61111-0006)
- [HGB § 19](https://www.gesetze-im-internet.de/hgb/__19.html)
- [AktG §§ 7, 278](https://www.gesetze-im-internet.de/aktg/__278.html)
- [GenG § 4](https://www.gesetze-im-internet.de/geng/__4.html)

**Weiter offen:** Die Aufnahme von AG, eG und GmbH & Co. KGaA bleibt eine Nutzerentscheidung vor V3-Release. Review bestätigt weder spätere Integration/Jahres-Smoke noch Rechtskonformität konkreter Fälle.

## A08-Nachtrag – Review des A03-Finanzereignisvertrags T-0064 (2026-10-31)

**Status:** A08-Quellen-/Impactreview des A03-Fachvertrags abgeschlossen; unabhängiger A09-Review bleibt offen.
**Prüfbasis:** A03 a03-t0064-v3-finanzereignisvertrag.md, A02 a02-t0064-v3-rechtstraeger-statusvertrag.md, A08-Rechtsformmatrix und Rechtsrahmenregister; D-0159–D-0164; amtliche Primärtexte zum Rechtsstand 2026-10-31.
**Grenze:** Read-only Rechtsgrenzenreview. Keine Finanzbewertung, keine Buchungssatzentscheidung, keine Rechtsformfreigabe oder Scope-Ausweitung.

| Prüffeld | Befund / aktualisierte Quellenanforderung |
|---|---|
| BGB §613a Abs. 1–3 | Nur nach fallbezogener Feststellung eines Betriebs-/Betriebsteilübergangs. Abs. 1 lässt bestehende Arbeitsverhältnisse kraft Gesetzes übergehen. Abs. 2 enthält bedingte gesamtschuldnerische Haftung des bisherigen Arbeitgebers für vor Übergang entstandene und binnen eines Jahres fällige Verpflichtungen; bei späterer Fälligkeit ist der bereits abgelaufene Teil des Bemessungszeitraums maßgeblich. Abs. 3 nimmt diesen Abs.-2-Haftungspfad aus, wenn eine juristische Person oder Personenhandelsgesellschaft durch Umwandlung erlischt. A03 verlangt die relevanten Tatsachen und erzeugt keine automatische Buchung; A02/A08 müssen die Anwendbarkeit liefern. |
| BGB §613a Abs. 4–6 | Abs. 4 (keine Kündigung gerade wegen des Übergangs), Abs. 5 (Unterrichtung vor Übergang in Textform) und Abs. 6 (schriftlicher Widerspruch binnen eines Monats nach Zugang) sind Personal-/Prozessfolgen für A02/A05. A03 übernimmt sie nicht als eigene Buchungsregeln; sie dienen als Status-/Prüfeingaben. |
| HGB §25 Abs. 1–3 | Abs. 1 setzt Erwerb eines Handelsgeschäfts unter Lebenden und Fortführung unter bisheriger Firma voraus. Die Erwerberhaftung für Verbindlichkeiten ist von der Forderungszuordnung zu trennen: Forderungen gelten gegenüber Schuldnern nur bei Einwilligung des bisherigen Inhabers/der Erben als übergegangen. Nach Abs. 2 wirkt eine abweichende Vereinbarung gegenüber Dritten nur nach Eintragung und Bekanntmachung im Handelsregister oder Mitteilung durch Erwerber/Veräußerer an den Dritten. Ohne Firmenfortführung greift Abs. 3 nur bei besonderem Verpflichtungsgrund. A03 soll die Einwilligung ausdrücklich dem Forderungsübergang zuordnen und den Abs.-2-Nachweis bei jeder Abweichungsvereinbarung verlangen; keine automatische Schuld-/Forderungsbuchung. |
| KG/GmbH-Registerbezug | §161 Abs. 2 HGB ordnet grundsätzlich die entsprechende Anwendung der OHG-Vorschriften auf die KG an; damit ist §123 Abs. 1 HGB für den KG-Statuspfad heranzuziehen, vorbehaltlich §107 Abs. 1. Die GmbH besteht nach GmbHG §11 Abs. 1 als solche erst mit Eintragung; vorheriges Handeln nach Abs. 2 ist separat zu prüfen. A03 behandelt beide Register-/Rechtsträgerpfade als Belegeingabe, nicht als Buchungsereignis oder generelles Betriebsstart-Gate. |
| Share Deal / Asset Deal | A03 trennt Beteiligungsänderung bei fortbestehender Ziel-entityId vom benannten Asset-/Betriebsübergang. Keine automatische Konzernkonsolidierung, Bilanzübernahme oder Übertragung sämtlicher Verträge/Schulden. Rechtsfolgen bleiben an konkrete Transaktionstatsachen gebunden. |

**Historischer Erstbefund – am 2026-10-31 erledigt:** Der folgende Absatz hält die beim ersten Review noch offene Nacharbeit fest. Sie wurde in der aktuellen A03-Fassung eingearbeitet und im abschließenden A08-Re-Review mit PASS bestätigt (siehe Abschnitt „Abschließender A08-Quellen-Re-Review zu T-0064“ unten). Der damalige Befund bleibt zur Nachvollziehbarkeit erhalten. In §25-Zulieferfeldern Einwilligung für Forderungsübergang und Haftung für Altverbindlichkeiten als getrennte Daten-/Prüfpfade darstellen; bei abweichender Vereinbarung die Drittwirkungsbedingungen nach §25 Abs. 2 erfassen. Quellenzeile §613a um Abs. 3 ergänzen und für Abs. 4 auf den A02-Personalprozess verweisen. Die KG-Quellenformulierung sollte §161 Abs. 2 als entsprechende Anwendungsnorm aussprechen; A02 führt §107 Abs. 1 als Ausnahmeanker. Diese Nacharbeit trifft keine Finanzbewertung.

**Matrix-/Registerstand:** Die A08-Matrix und das Rechtsrahmenregister führen nun §613a Abs. 1–6 mit separatem A02-Personalimpact und bedingtem A03-Finanzimpact sowie §25 Abs. 1–3 mit getrennter Forderungs- und Schuldnerfolge. A08-Quellenreview ist abgeschlossen; A09 unabhängiger Quellen-/Grenzfallreview bleibt offen. A08 ändert keine Rechtsformauswahl: GmbH & Co. KG bleibt gemäß D-0163 bestätigt; AG, eG und GmbH & Co. KGaA bleiben Kandidaten ohne Freigabe.

**Amtliche Primärquellen, Prüfstand 2026-10-31:** [BGB §613a](https://www.gesetze-im-internet.de/bgb/__613a.html), [HGB §25](https://www.gesetze-im-internet.de/hgb/__25.html), [HGB §161 Abs. 2](https://www.gesetze-im-internet.de/hgb/__161.html), [HGB §123](https://www.gesetze-im-internet.de/hgb/__123.html), [HGB §107](https://www.gesetze-im-internet.de/hgb/__107.html), [GmbHG §11](https://www.gesetze-im-internet.de/gmbhg/__11.html).

**Review-Rollen:** Ausführung A08; fachliche Accountingentscheidung A03; unabhängige QA/A09: offen; Browser-/Gerätetest: nicht zutreffend/nicht ausgeführt; Tests: nicht ausgeführt; Git-Verifikation: status/HEAD vor Änderung geprüft, keine Commit-/Push-Aktion.
## Abschließender A08-Quellen-Re-Review zu T-0064 (2026-10-31)

**Status:** PASS – aktueller A03-Finanzereignisvertrag geprüft; A08-Quellenreview abgeschlossen. Unabhängiger A09-Review bleibt offen.
**Bezug:** MG-002 / SLG-002.2 / T-0064; D-0159–D-0164; A02-Rechtsträger-Statusvertrag; Rechtsstand gemäß D-0161, unabhängig vom Simulationsjahr.
**Prüfbasis:** [A03-Finanzereignisvertrag](../accounting/a03-t0064-v3-finanzereignisvertrag.md), [A02-Statusvertrag](../simulation/a02-t0064-v3-rechtstraeger-statusvertrag.md), [A08-Rechtsformmatrix](a08-t0064-v3-gruendung-rechtsformen-zusammenschluesse.md), [Rechtsrahmenregister](../legal/legal-framework-register.md) und amtliche Primärquellen mit Prüfstand 2026-10-31.

Der historische Erstbefund oben ist erledigt. A03 hat die verlangten Präzisierungen zur Trennung der Forderungs- und Verbindlichkeitsfolgen nach HGB §25 Abs. 1, zu Drittwirkungsvoraussetzungen einer abweichenden Vereinbarung nach Abs. 2 und zur Nichtfortführung/Fallgrenze nach Abs. 3 eingearbeitet. Für BGB §613a sind Abs. 1–3 samt bedingter Altverpflichtungshaftung und gesetzlicher Ausnahme beschrieben; Abs. 4 ist als Personalregel an A02 verwiesen, Abs. 5–6 bleiben Prozessstatus bei A02/A05. Der KG-Pfad leitet §123 über die entsprechende, vorbehaltliche Anwendung nach HGB §161 Abs. 2 her und berücksichtigt §107 Abs. 1; GmbHG §11 bleibt separat. Keine pauschale Rechtsfolge, keine automatische Buchung und keine Scope-/Rechtsformausweitung festgestellt.

**Primärquellen:** [BGB §613a](https://www.gesetze-im-internet.de/bgb/__613a.html), [HGB §25](https://www.gesetze-im-internet.de/hgb/__25.html), [HGB §161](https://www.gesetze-im-internet.de/hgb/__161.html), [HGB §123](https://www.gesetze-im-internet.de/hgb/__123.html), [HGB §107](https://www.gesetze-im-internet.de/hgb/__107.html), [GmbHG §11](https://www.gesetze-im-internet.de/gmbhg/__11.html). Prüfdatum/Rechtsstand: 2026-10-31.

**Reviewrollen:** Ausführung/Quellenreview A08: PASS; Accounting-Fachverantwortung A03: bleibt A03; unabhängige QA A09: offen; Browser-/Gerätetest: nicht zutreffend; Tests: nicht ausgeführt; Git-Verifikation vor Änderung: HEAD 8b72b7e, vorhandene Änderungen geprüft. Keine weiteren Dateien geändert; kein Commit/Push.