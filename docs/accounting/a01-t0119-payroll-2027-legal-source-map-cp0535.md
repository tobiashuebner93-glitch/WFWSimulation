# A01 – T-0119 Payroll-Rechts- und Quellenmapping für das V3-Startjahr 2027

**Stand:** 2026-11-08 · **Adressat:** A01 – MASTER_ORCHESTRATOR · **Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0119 / T-0116 / T-0077 / T-0069 G7

## Zweck und Ergebnis

Dieses gezielte Quellenmapping prüft amtliche Payroll-relevante Werte für das aktive V3-Startjahr 2027. Es ist ein A01-Arbeitsbeleg, keine A08-Rechtsfreigabe, keine individuelle Lohn-/Steuerberechnung und keine Implementierungsfreigabe. Es verändert keine Regeln, Beträge oder Laufzeitdaten.

| Parameter | Stand am 2026-11-08 | Status für V3 |
|---|---|---|
| Allgemeiner gesetzlicher Mindestlohn | 14,60 € brutto je Zeitstunde ab 01.01.2027; MiLoV5 ist verkündet. Gesetzliche Ausnahmen und ggf. höhere einschlägige Branchen-/Tarifentgelte bleiben zu prüfen. | Verbindliche Untergrenze für passende Beschäftigungsszenarien; kein Beleg für konkrete Vertragslöhne. |
| Minijob-Verdienstgrenze | 633 € monatlich / 7.596 € bei zwölfmonatiger Beschäftigung ab 01.01.2027; offizielle Geringfügigkeits-Richtlinien binden sie an Mindestlohnformel `14,60 × 130 / 3`, auf volle Euro aufgerundet. | Nutzbar nur mit geprüftem Beschäftigungsstatus und voraussichtlichem regelmäßigem Verdienst; keine automatische Klassifizierung allein nach einem einzelnen Monatsbetrag. |
| Durchschnittlicher GKV-Zusatzbeitrag | BMG hat für 2027 2,9 % festgelegt. Die individuelle Krankenkasse setzt ihren eigenen Zusatzbeitrag fest. | 2,9 % darf nur ein gekennzeichneter Durchschnitts-/Szenarioparameter sein. Für konkrete Abrechnung ist der Kassenwert nötig. |
| 2027 Sozialversicherungs-Rechengrößen | Die Bundesregierung hat am 07.10.2026 vorgeschlagene Grenzen beschlossen; Zustimmung des Bundesrats und Verkündung stehen laut BMAS/Bundesregierung noch aus. | Alle Verordnungswerte `PENDING_LEGISLATIVE_FINALIZATION`, nicht als endgültige 2027-Rechtsparameter in Runtime übernehmen. Vor Januar-/Release-Nutzung aktualisieren. |
| Lohnsteuer-Anmeldung/-Abführung | EStG §41a: grundsätzlich Monatszeitraum; Quartal bei Vorjahres-Lohnsteuer >1.080 € bis 5.000 €, Kalenderjahr bis 1.080 €. Anmeldung und Zahlung spätestens am 10. Tag nach Zeitraumende. Für neue Betriebsstätten enthält §41a(2) eine annualisierte Bestimmung anhand des ersten vollen Monats. | Frist hängt von Vorjahreswert bzw. Neugründung und dem tatsächlichen Lohnsteuerbetrag ab; kein pauschaler Monatsendtermin. Konkrete Lohnsteuer benötigt ELStAM/individuelle Merkmale und gültige PAP-Jahresparameter. |
| Gesamtsozialversicherungsbeitrag | SGB IV §23(1): voraussichtlicher Beitrag grundsätzlich spätestens am drittletzten Bankarbeitstag des laufenden Beschäftigungsmonats; verbleibender Rest am drittletzten Bankarbeitstag des Folgemonats. Abweichende Sonderregeln bleiben möglich. | Separater Abführungsanker von Lohnsteuer und Lohnzahlung. Gesetzliche Bankarbeitstage müssen vom V3-Arbeitskalender getrennt bleiben. |

## Erforderliche Payroll-Quellen je Person / Abrechnungsperiode

D-0175 verlangt tatsächliche, genehmigte Zeit und gültige Vertrags-/Rechtsparameter. Das vorhandene A02-Zeitmaterial ist modellierte Spielzeit, ausdrücklich keine genehmigte Payroll-Istzeit. Für eine belastbare Abrechnung fehlen mindestens: Beschäftigungs-/Entgeltvertrag, abrechnungsfähige Zeit- und Abwesenheitsbelege, Steuermerkmale/ELStAM, Krankenkasse und individueller Zusatzbeitrag, Versicherungs-/Pflegeversicherungsmerkmale, Beschäftigungsstatus/Mehrfachbeschäftigung, mögliche Sachbezüge und die für den konkreten Fall maßgeblichen Jahresparameter. Umlagen, Unfallversicherung und ggf. Branchenmindestentgelte benötigen eigene Quellen.

Ohne diese Daten bleiben Brutto/Netto-/Arbeitgeberkosten und konkrete Steuer-/SV-OPs `PENDING`; es wird weder ein Pauschallohn noch ein pauschaler Arbeitgeberzuschlag ergänzt. Inhaberentnahmen bleiben nach D-0175 außerhalb Payroll. SimTAX bleibt von gesetzlicher Steuer getrennt.

## Übergabe / nächste Arbeit

- A08: Primärquellen- und Rechtsstandreview dieser Einordnung; besonders bestätigen, welche 2027-Rechengrößen am nächsten offiziellen Rechtsstand bereits verkündet sind.
- A03: Payroll-Event-/Kontierungsvertrag an D-0175/D-0176 binden; kein Netto-/Abgabenbetrag ohne Personaldaten und Finalparameter.
- A02: später genehmigte Arbeits-/Abwesenheitsevidence mit Person, Datum, Periode und stabiler Source-ID bereitstellen; geplante Stunden nicht als Lohn-Istzeit verwenden.
- A04/A09: Persistenz/Restore und idempotente Abführung erst nach fachlich freigegebenem Eventvertrag prüfen.

**Keine Runtime-, Schema-, Bilanz- oder Finanzänderung.** T-0119, T-0077/G7 und T-0069/G3 bleiben offen.

## Amtliche / institutionelle Quellen (abgerufen 2026-11-08)

- MiLoV5 §1: https://www.gesetze-im-internet.de/milov5/__1.html
- Minijob-Zentrale, Geringfügigkeits-Richtlinien 2026 (Veröffentlichung und Rechtsbelege zur Grenze 2027): https://www.minijob-zentrale.de/SharedDocs/Downloads/DE/Rundschreiben/Geringfuegigkeitsrichtlinien-2026.pdf?__blob=publicationFile
- BMG, durchschnittlicher Zusatzbeitrag 2027, 30.10.2026: https://www.bundesgesundheitsministerium.de/presse/pressemitteilungen/zusatzbeitragssatz-gkv-2027-festgelegt
- BMAS, Sozialversicherungsrechengrößen 2027, 07.10.2026 (Kabinettsbeschluss, Zustimmung/Verkündung noch ausstehend): https://www.bmas.de/DE/Service/Presse/Pressemitteilungen/2026/bundeskabinett-beschliesst-sozialversicherungsrechengroessen-2027.html
- EStG §41a: https://www.gesetze-im-internet.de/estg/__41a.html
- SGB IV §23: https://www.gesetze-im-internet.de/sgb_4/__23.html

Keine Rechtsberatung oder Aussage über die konkrete Abrechnung eines realen Betriebs.
## A08-/A03-Review und Nachprüfung (2026-11-09; CP-0536)

A08-Rechtsreview: **PASS** für Quellenbezug und vorsichtige Einordnung. A03-Fachreview: **PASS** für die Trennung von Payroll, Lohnsteuer und Sozialversicherung sowie das `PENDING` mangels Personen-/Vertragsdaten. Keine Rechts-, Runtime- oder Releasefreigabe.

Der amtliche Umsetzungsstand wurde am 2026-11-09 erneut geprüft: Die Sozialversicherungsrechengrößen-Verordnung 2027 ist weiterhin nicht veröffentlicht; der Kabinettsbeschluss liegt vor, die Zustimmung des Bundesrats ist noch erforderlich. Damit bleiben ihre konkreten Werte `PENDING_LEGISLATIVE_FINALIZATION`. [BMAS – Umsetzungsstand Sozialversicherungsrechengrößen-Verordnung 2027](https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungs-rechengroessenverordnung-2027.html).

Im Übrigen keine materielle Statusänderung gegenüber dem Quellenstand vom 2026-11-08. Die amtlichen Aussagen und Links im Hauptteil bleiben bestehen.
