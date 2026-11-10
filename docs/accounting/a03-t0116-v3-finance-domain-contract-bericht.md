# A03 – T-0116 V3-Finanzverträge und Posting-Spezifikation

**Status:** Fachvertrag-Entwurf erstellt; D-0175 bis D-0180 umgesetzt; Runtime/Schema bleiben gesperrt
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0116 / T-0077 / T-0069 G3, G7, G10
**Profil:** Aktives V3-Einzelunternehmen ab 01.01.2027 gemäß D-0181; D-0152/2019 bleibt historische Referenz außerhalb der auswählbaren V3-Startprofile
**Vorgänger:** CP-0529
**Branch/HEAD:** main / fdc4960d4bf92fb13f6802e8d0738eb3d9110097
**Preflight:** 763 Statuszeilen; alle sieben Control-Plane-Hashes und D-0175–D-0180/T-0116 verifiziert.

## Ergebnis

Die bestätigten Leitentscheidungen sind in getrennte Buchungs-/Subledgerbereiche zerlegt und mit Events, Gegenkonten und Kontrollen konkretisiert. T-0077/G7 bleibt NONPASS: WIP/Fertigwaren-COGS bleiben nach D-0178 bis BAB/Kostenpool PENDING; reale Payroll-/Steuerparameter und weitere Quellen sind noch nicht vollständig belegt.

D-0174 bleibt unverändert. Sein AP-/Bank-Subledger ist operative Quelle. D-0179 erlaubt einen separaten, ausdrücklich autorisierten GL-Spiegel derselben Quelle. Dieser führt keine zweite Zahlungs- oder Cashmutation aus.

## Gemeinsames Event- und Postingformat

Jedes Postingevent bindet stabile Source-Event-ID/Belegreferenz, Run, Typ, Vertrags-/Person-/Produktbezug, wirksames Datum und Periode, Währung, Centbetrag, Steuerkomponente/-status, Autorisierer, Rechts-/Parameterstand, Kontierungsregelversion und Idempotenzschlüssel. GL-Voucher enthält Kontoalias und Soll-/Haben-Cent. Perioden richten sich nach dem wirksamen Simulationsdatum; gesetzliche Fälligkeiten kommen separat aus der jeweils aktuellen Rechtsquelle und deren Kalenderregel. Spiel-Arbeitstage und gesetzliche Bankarbeitstage sind nicht automatisch gleich.

Dedupe-Schlüssel: Run + Finanzbuch + Source-Event-ID + Postingtyp + Kontierungsregelversion. Exakte Wiederholung ist No-op; widersprüchliche Payload unter gleicher Source-ID wird fail-closed abgewiesen. Jeder GL-Voucher muss centgenau Soll = Haben erfüllen. Korrekturen erfolgen über referenziertes Gegenposting plus neues Event, niemals durch Ändern historischer Source- oder Journalzeilen. Kontonamen nachstehend sind logische Aliase, keine SKR03-/SKR04-Nummern.

## 1. Eröffnungsbilanz (D-0152, D-0180)

| Soll | Haben | Betrag |
|---|---|---:|
| Bank | Inhabereinlage / Eigenkapital Einzelunternehmen | 10.000,00 € |

Grundwerkbank und Handwerkzeuge bleiben als physische Spielausstattung im Betrieb, aber bis zu einer bestätigten Geldbewertung außerhalb der monetären Eröffnungsbilanz. Keine Anlagebuchung, Abschreibung oder Vorsteuer wird daraus abgeleitet. D-0152 schließt andere Startforderungen, Vorräte, Verbindlichkeiten, Kredite, Maschinen und Aufträge aus.

Kontrolle: Opening-Voucher je Run eindeutig; Bank = Eigenkapital = 10.000,00 €. Wiederholter Run-Start/Restore darf die Einlage nicht verdoppeln.

## 2. Payroll (D-0175)

Quellen sind je Periode der Beschäftigungsvertrag, genehmigte tatsächlich geleistete Zeit, Abwesenheiten und die gültigen Steuer-/SV-Merkmale. Planzeit wird nicht als Lohnzahlung behandelt. Ein versionierter Payroll-Lauf bindet die Jahresparameter und trennt Brutto, Netto, Lohnsteuer, Arbeitnehmer-SV, Arbeitgeber-SV sowie weitere belegte Abzüge.

Logische Buchungen:
- Payroll-Lauf: Soll Personalaufwand für Brutto; Haben Nettoentgelt-OP + Lohnsteuer-OP + Arbeitnehmer-SV-OP + sonstige belegte Abzüge.
- Arbeitgeberanteile: Soll Arbeitgeber-SV-Aufwand / Haben Arbeitgeber-SV-OP.
- Nettolohnzahlung: Soll Nettoentgelt-OP / Haben Bank.
- Lohnsteuerzahlung: Soll Lohnsteuer-OP / Haben Bank.
- SV-Zahlung: Soll jeweilige SV-OP / Haben Bank.

D-0175 regelt Inhaberentnahmen getrennt: Einzelunternehmer-Entnahmen sind keine Payroll und kein Lohnaufwand. Bei fehlendem Vertrag, Istzeit, Merkmalen oder Jahresparameter bleibt der Lauf PENDING; keine Pauschalquote oder erfundener Nettolohn. Zahlung und Abführung erfolgen als jeweils eigene autorisierte Vollzahlungsevents; bei fehlender Liquidität bleibt der OP offen.

EStG § 41a regelt Anmeldung/Abführung der Lohnsteuer; SGB IV § 23 enthält eine eigenständige Fälligkeitsregel für Sozialversicherungsbeiträge. Das System braucht daher getrennte Meldungs-/Fälligkeitsprofile und darf keine einheitliche Monatsendfälligkeit ansetzen.

## 3. Steuerermittlung/Abführung (D-0165/66, D-0176)

- SimTAX 19 % bleibt die nichtrechtliche V3-Szenariokomponente auf ausdrücklich steuerpflichtig markierten Kundenpositionen, positionsweise auf Cent gerundet.
- Echte gesetzliche Umsatzsteuer, Vorsteuer, Lohnsteuer, SV-Beiträge und weitere Steuerarten bleiben getrennte Salden und Quellen.
- Lieferantensteuerstatus/Anspruch ist unbekannt, wenn die Rechnung ihn nicht belegt. Dann entsteht kein angenommener Vorsteuerbetrag; die Kontierung bleibt PENDING.
- Gewerbe-, Einkommen- oder sonstige Steuerarten werden nicht pauschal ergänzt, solange Grundlage und konkrete Berechnung fehlen.
- Steuerabschluss/Meldung erzeugt einen Steuer-OP. Nur ein eigenes autorisiertes ausgeführtes Abführungsevent vermindert Steuer-OP und Bank.

Kundenrechnung: D-0166-Nettoplanpreis geht als Erlös gegen Bruttoforderung; SimTAX steht als separate Szenarioverbindlichkeit. Kundeneingang nach D-0168: Soll Bank / Haben AR für den offenen Bruttobetrag, ohne zweiten Erlös. Gezogene Disposchuld wird nach D-0177 danach zurückgeführt.

UStG § 18 hat eigene Voranmeldungszeiträume, Schwellen und Fälligkeiten; sie werden nicht pauschal auf andere Steuerarten übertragen. Rechtsparameter werden vor jedem V-Release anhand amtlicher Quellen geprüft und mit Quelle, Prüftag, Wirksamkeit und Versionsbezug geführt. Das ist keine individuelle Rechts-/Steuerfreigabe.

## 4. Darlehen und Dispo (D-0177)

D-0180 ergibt monetäre Eröffnungsaktiva 10.000,00 €, Verbindlichkeiten 0,00 € und Eigenkapital 10.000,00 €. Der bestätigte anfängliche Rahmen ist daher 10 % × 10.000,00 € = **1.000,00 €**, nicht gezogen. Die quartalsweise Neuberechnung erfolgt auf belegter Bilanzsumme des Vorquartals und gilt zum Quartalsbeginn.

- Manueller Draw: Soll Bank / Haben Dispoverbindlichkeit; exakt in genehmigter Höhe und höchstens innerhalb des freien Rahmens. Keine automatische Ziehung.
- Kundeneingang: Soll Bank / Haben AR; bis zur Höhe des Eingangs wird vorhandene Disposchuld zuerst getilgt: Soll Dispoverbindlichkeit / Haben Bank. Danach folgen eigene Zahlungen.
- Rückzahlung: eigenes autorisiertes Zahlungsevent; D-0174-Vollzahlungsregeln bleiben für Lieferantenrechnungen gültig.
- Zins: täglicher gezogener Saldo, Actual/365, ohne tägliche Rundung; Monatsbetrag einmal centgenau runden. Zins wird erst als Bankabgang gebucht, wenn die Belastung als ausgeführt belegt ist.

D-0123–D-0129 nennen keinen Dispozins. Es wird kein Satz erfunden; Zinsbetrag bleibt PENDING bis ein Satz aus Vertragsquelle/Regelwerk vorliegt. Ebenso ist nicht geregelt, was passiert, wenn der neu berechnete Quartalsrahmen unter dem bereits gezogenen Saldo liegt; keine Zwangstilgung wird als Default ergänzt. Für V3-Start besteht kein Maschinenkredit.

BGB § 488 regelt die vertraglichen Darlehenspflichten, bestimmt aber keinen allgemeinen Disporahmen oder Zinssatz.

## 5. Materialbestand, WIP, Fertigware und COGS (D-0170, D-0178, D-0179)

Die Kette bleibt getrennt: Lieferantenangebot/Bestellung → physischer Wareneingang → D-0173-Rechnungsevidence → D-0174 AP/Bank → separates D-0179-GL-Posting. Die Rechnungskontierung kann Rohmaterial nur dann bewerten, wenn Nettobetrag, Steuerstatus und zurechenbare Nebenkosten belegt sind. Vorgeschlagene Buchung: Soll Rohmaterialbestand für belegte Anschaffungskosten; Soll Vorsteuer nur bei explizitem Status/Anspruch; Haben Kreditorenkontrollkonto für den belegten Rechnungsbetrag. Unbekannte Bestandteile blockieren das GL-Rechnungs-Posting, auch wenn Mengen- und AP-Evidence existieren.

Rohmaterialzugänge/-verbräuche verwenden E3, gleitender Durchschnitt. Formel bei vollständig bewerteten Eingängen: neuer Durchschnitt = (alter Gesamtwert + belegter Zugangswert) / (alte Menge + Zugangsmenge). Menge/Wert und Rundung werden im Event-/Layernachweis geführt. Unbewerteter Zugang macht betroffene SKU-Wertfortschreibung und davon abhängigen Verbrauch PENDING. Fracht-/Nebenkosten werden nur nach genehmigtem Allokationsschlüssel in Bestandswert aufgenommen; kein willkürlicher Schlüssel.

D-0178 wählt B: Ohne spätere BAB-/Kostenpoollösung wird keine pauschale Verteilung genutzt. WIP, vollständiger Fertigwarenwert und COGS bleiben PENDING, wenn Herstellungskosten nicht vollständig belegbar sind. D-0170 FIFO ordnet spätere vollständig bewertete Fertigwarenlose, ersetzt aber keine fehlenden Istkosten. Physischer Versand darf stattfinden und wird als solcher berichtet; fehlende Bewertung wird als PENDING ausgegeben, nicht als Null oder Ersatz-COGS. Verbrauchsbelege können Quellen bewahren, begründen aber keinen vollständigen WIP-/COGS-Wert. Damit bleibt der Bestand-/Jahresabgleich ausdrücklich offen.

HGB § 255 nennt Herstellungsbestandteile einschließlich angemessener Fertigungsgemeinkosten und fertigungsausgelösten Anlagenwerteverzehrs; diese V3-Konvention ist keine handelsrechtliche Bilanzfreigabe.

## 6. Hauptbuch und Reconciliation (D-0179)

GL-Mirror verarbeitet nur separat autorisierte Source-Events und verändert die operative Finance-Runtime nicht. Bei D-0174-Rechnung bzw. Zahlung entsteht je ein separater Posting-Voucher mit derselben unveränderlichen Source-Event-ID:
- Lieferantenrechnung: Soll belegter Rohmaterial-/Steuerwert / Haben AP-Kontrollkonto. Der operative AP-OP wird nur einmal durch D-0174 angelegt.
- ausgeführte Lieferantenzahlung: Soll AP-Kontrollkonto / Haben Bank. D-0174 hat den operativen AP-/Bankbestand bereits bewegt; GL-Voucher ist dessen einmalige Journalabbildung, keine zweite Zahlung.

Weitere logische Konten: Bank, Inhabereinlage/Privatentnahme, Kunden-AR, Erlöse, SimTAX-Szenariokonto, Lieferanten-AP, Personalaufwand, Nettoentgelt-OP, Lohnsteuer-OP, Arbeitnehmer-/Arbeitgeber-SV-OP, Dispoverbindlichkeit und Zinsaufwand. WIP/Fertigwaren/COGS-Postings sind bis D-0178 erfüllt wird gesperrt. Kein Kontonummernrahmen ist genehmigt.

Monatskontrollen:
1. Journal-Soll = Journal-Haben.
2. Bank-Opening + Eingänge − Ausgänge = Bank-Closing, abgestimmt auf genau einen operationalen Bankquellstand.
3. AR/AP/Payroll/Steuer/Dispo-Kontrollkonto = jeweiliges Subledger; OP-Alterung stimmt zur Summe.
4. Rohmaterialmenge: Anfang + Zugänge − Verbrauch = Ende; Wert nur für vollständig belegte E3-Layer PASS.
5. WIP/Fertigware/COGS-PENDING wird aus dem Zeitraum fortgeschrieben; jedes Pflicht-PENDING verhindert den Reconciliation-PASS.
6. Opening-, Ergebnis- und Eigenkapital-Roll-forward stimmen mit Journal und freigegebener Szenariobilanz überein.

Jahreskontrollen:
- Jahresopening = Vorjahresclosing;
- Bilanz und GuV stammen aus denselben abgeschlossenen Perioden;
- Bilanzdifferenz darf nicht durch Plug-/Rest-Eigenkapital kaschiert werden;
- COGS/WIP-PENDING nach D-0178 bedeutet kein vollständiges T-0077/G7-Jahres-PASS;
- JSON-Restore und Replay reproduzieren Journal, Event- und Endsaldohashes.

HGB §§ 238/242 beschreiben Nachvollziehbarkeit und – für die jeweils erfassten Kaufleute – Eröffnungs-/Jahresbilanz und GuV. Unternehmensstatus und Erleichterungen sind im Produkt gesondert zu prüfen.

## Offene Details an A01

1. Dispozinsnominalsatz aus Vertragsquelle fehlt. Berechnungsformel ist entschieden, Betrag nicht.
2. Umgang mit bestehender Ziehung oberhalb eines neu gesenkten Quartalsrahmens nicht entschieden.
3. Lieferantensteuerstatus und Nebenkosten-Allokation für V3-Rechnungen sind nicht durchweg belegt.
4. Payroll-Verträge, Istzeitquellen und Lohn-/Steuer-/SV-Parameter müssen aus A02/aktueller Rechtsregisterpflege kommen; keine Pauschalen.
5. Ohne spätere BAB/Kostenpools bleibt WIP/Fertigwaren/COGS PENDING und blockiert G7.
6. Kontonummernrahmen, Runtime/API und Persistenz benötigen separate Architektur-/A04-Freigaben; D-0179 autorisiert nur den Domain-Postingpfad.
7. Darlehensvertrag für künftige Maschinen-/Investitionsfinanzierung ist nicht vorhanden; D-0152 hat keinen Startkredit.

## Reviews, Tests, Rollen und Autorisierung

- Autor/Ausführung: A03, Domain-/Event-/Kontierungsentwurf.
- Fachreview A03: Selbstprüfung des Berichts; keine unabhängige Prüfung.
- A02-Quellenreview: nicht ausgeführt.
- A04-Persistenzreview: nicht ausgeführt.
- A09-unabhängige QA: nicht ausgeführt.
- Softwaretests: nicht ausgeführt; keine Softwareänderung.
- Browser-/Gerätetest: nicht ausgeführt.
- Git-Preflight: geprüft; bestehende Änderungen erhalten; kein Stage/Commit/Push/Deploy.
- Domain-/Eventvertrag: D-0175–D-0180 bestätigt; konkreter Postingvertrag ist Entwurf zur A01-Integration.
- Runtime/API: NEIN. Schema/Persistenz: NEIN. Produktive Finanzmutation: NEIN. Release: NEIN.
- Nächster Adressat: A01 für fachliche Integration; danach A02-Quellen-/Periodenreview, A04 Restore-/Persistenzreview und A09 unabhängige QA.

## Amtliche Rechtsquellen (für die Rahmenpunkte)

- UStG § 18: https://www.gesetze-im-internet.de/ustg_1980/__18.html
- EStG § 41a: https://www.gesetze-im-internet.de/estg/__41a.html
- SGB IV § 23: https://www.gesetze-im-internet.de/sgb_4/__23.html
- HGB § 238: https://www.gesetze-im-internet.de/hgb/__238.html
- HGB § 242: https://www.gesetze-im-internet.de/hgb/__242.html
- HGB § 255: https://www.gesetze-im-internet.de/hgb/__255.html
- BGB § 488: https://www.gesetze-im-internet.de/bgb/__488.html

Keine individuelle Steuer-/Rechtsberatung oder Rechtskonformitätsaussage.