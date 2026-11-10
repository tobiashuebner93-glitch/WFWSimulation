# A03 – V3-Finanzereignisvertrag T-0064: Gründung, Kooperation und Erwerb

**Status:** A03-Fachvertrag; noch nicht in Engine/Schema integriert; keine Rechts- oder Produktfreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent/Goal/Ticket:** A03 – ACCOUNTING_FINANCE / MG-002 / SLG-002.2 / T-0064
**Rechtsstand:** 2026-10-31 gemäß D-0161; gilt unabhängig vom Simulationsjahr
**Entscheidungsanker:** D-0159, D-0161–D-0164; CP-0280 (ENTWURF)
**Preflight:** AGENTS, Agentenstruktur/Rechte, Goals/V3-Ziele, Ticket Board, Collaboration State, D-0159–D-0164, relevante V1/V2-Finanzregeln, V3-A03-Finanzschnittstellenpaket, A02-T-0064-Vertrag, A08-Matrix/Legalregister, Gitstatus und Änderungen geprüft.

## 1. Zweck und Grenzen

Dieser Vertrag grenzt finanzielle Plan-, Vertrags- und Ist-Ereignisse rund um Gründung und Unternehmenszusammenschlüsse ab. Er übernimmt A02s operative IDs/Statusübergänge und A08s rechtliche Prüfpfade. Er ändert keine Simulations-/Rechtsformentscheidung, keine bestehende V1-/V2-Regel und erteilt keine Schema-/Architekturfreigabe.

Rechtsform-, Gründungs-, Register-, Kooperations- oder Kaufstatus erzeugt allein **keine** Buchung, Zahlung, Forderung, Verbindlichkeit, Eigenkapitaländerung, Bestand, Abschreibung oder Personalkosten. Nur ein bestätigtes, autorisiertes Finanzereignis mit Parteien, Grundlage, Betrag/Treiber, Datum und betroffener Einheit darf an den bestehenden A03-Finanzprozess übergeben werden. Unvollständige Angaben bleiben unvollständig und lösen keine Nullbuchung aus.

Die genannten Felder sind logische Übergabeanforderungen, keine freigegebene Datenbankstruktur. A03 entscheidet nicht, ob eine Rechtsform oder Transaktion im Produktumfang angeboten wird. GmbH & Co. KG ist nach D-0163 für V3 bestätigt; AG, eG und GmbH & Co. KGaA bleiben nicht freigeschaltete Kandidaten. Gesetzliche Verschmelzung bleibt außerhalb V3.

## 2. Ereignisklassen

| Klasse | Beispiele | Finanzwirkung |
|---|---|---|
| Plan/Prüfung | Gründungsidee, Kapitalplan, Wirtschaftlichkeitsprüfung, Finanzierungsangebot, Kooperations- oder Kaufabsicht | Anzeige/Plan. Keine Buchung, kein Cash, OP, Bestand oder Rechtsträgervermögen. |
| Vertrag/Verpflichtung | unterzeichneter Kauf-/Gesellschafts-/Kreditvertrag, rechtswirksame Einlagezusage, konkrete Lieferbestellung | Verpflichtung nur im Umfang des konkreten Vertrags und seiner Bedingungen. Kein tatsächlicher Zahlungs-, Liefer- oder Leistungsnachweis. A03 bestimmt die Abgrenzung zum Ledger anhand der bestehenden Policy; dieser Vertrag fügt keine neue Anerkennungsregel hinzu. |
| Geschäftsvorfall/Ist | tatsächlich geleistete Einlage, ausgestellte Rechnung, nachgewiesene Lieferung, vollzogener Anteils-/Assettransfer, gezogene Finanzierung, tatsächliche Zahlung | Nur mit Beleg-/Vertragsreferenz, Betrag/Treiber und Wirksamkeits-/Buchungsdatum an A03. Trennung von Leistungs-, Rechnungs-, Übergangs- und Zahlungsdatum. |

## 3. Gemeinsame Finanzereignisreferenz

Ein A02-Ereignis, das eine Finanzwirkung anfordert, muss – soweit anwendbar – übergeben:

- eindeutige Ereignis-ID, `transactionId`, Replay-/Duplikatstatus und Ursprung;
- `payerEntityId`, `payeeEntityId`, `buyerEntityId`, `sellerEntityId` sowie davon getrennte Ziel-/Rechtsträger-ID;
- Vertrags-/Rechnungs-/Belegreferenz, Ereignistyp, Nachweisstatus und erfüllte Bedingungen;
- expliziten Betrag, Währung, Netto-/Bruttobasis und Steuer-/Vorsteuerbeleg, sofern vorhanden; fehlende Werte bleiben `unknown`/nicht buchungsfähig;
- Ereignis-, Leistungs-/Übergangs-, Rechnungs-, Fälligkeits- und Zahlungsdatum nur dann, wenn für den jeweiligen Vorgang belegt; operative und Finanzperiode werden getrennt ausgewiesen;
- einzeln benannte Vermögensgegenstände, Vorräte, Forderungen, übernommene Verbindlichkeiten, Verträge und Beschäftigte, falls betroffen;
- rechtliche Prüfresultate und offene Bedingungserfüllung, ohne dass das Prüfresultat selbst eine Geldbuchung erzeugt.

`entityId`/`transactionId` sind hier fachliche Referenzen, keine Schemafreigabe. Wiederholtes Replay desselben Ereignisses darf keine doppelte Zahlung, Verpflichtung oder Buchung erzeugen.

## 4. Vorgangsbezogene Verträge

### 4.1 Gründung, Einlage und Gründungskosten

- Gründungsvorbereitung, Rechtsformwahl, Kapital-/Finanzierungsplan und Wirtschaftlichkeitsprüfung sind Planereignisse.
- Eine tatsächliche Einlage wird nur gebucht/als Zahlungsmittel erfasst, wenn zahlende Person/Rechtsträger, empfangender Rechtsträger, Betrag, Währung, Einlageart, Valuta und Nachweis explizit vorliegen. Eine geplante oder gezeichnete Einlage ist nicht automatisch verfügbarer Cash.
- GmbH und KG der bestätigten GmbH & Co. KG bleiben getrennte Rechtsträger mit jeweils eigener Finanzidentität. Kapitalzuführung an die GmbH ist keine Einlage in die KG und umgekehrt; ein Weiterfluss braucht einen eigenen, belegten Vorgang.
- Gründungsgebühren/Notar-/Register-/Beratungskosten entstehen nicht beim bloßen Startstatus. Aufwand/Verbindlichkeit folgt erst aus konkreter Leistung/Rechnung und bestehender A03-Klassifikation; Zahlung ist ein separates Ereignis. Keine Gebührenhöhe oder steuerliche Behandlung wird hier angenommen.

### 4.2 Gemeinsamer Einkauf / Arbeitsgemeinschaft

- Gemeinsame Beschaffung als Kooperation erzeugt nicht automatisch eine neue Gesellschaft, gemeinsame Kasse, gemeinsamen Vorrat oder Gesamtschuld im Spielmodell.
- Für jeden Einkauf werden bestellender und rechnungsempfangender Rechtsträger, tatsächlicher Lieferant, Bestell-/Rechnungsbeleg, Menge, Preis, Lieferdatum, Eigentümer/Empfänger des Materials und Zahlungsweg separat angegeben.
- Kosten-/Mengenaufteilung unter Teilnehmern braucht einen nachgewiesenen Vertragsschlüssel oder tatsächliche Einzelabrechnungen. Fehlt die Grundlage, wird nichts anteilig verteilt und keine Forderung gegenüber anderen Teilnehmern erfunden.
- Ein Angebot, Einkaufsvorteil oder zugesagter Mengenrabatt ist Plan/Vertrag, nicht Ist-Ersparnis; Ist-Kosten entstehen nach konkreter Bestellung/Lieferung und bestehender Einkaufs-/Bestandsregel. Zahlungsereignis folgt getrennt.

### 4.3 Anteilserwerb (Share Deal)

- Ein Anteilskauf ändert die Eigentümer-/Kontrollreferenz der Zielgesellschaft, nicht deren `entityId`. Die Bilanz, Bankposition und Verbindlichkeiten der Zielgesellschaft werden nicht durch den bloßen Erwerb automatisch ersetzt oder mit dem Käufer konsolidiert.
- Ein Kaufpreis wird nur beim ausdrücklich benannten Käufer und Verkäufer berücksichtigt. Es muss feststehen, ob der Käufer der Spielerbetrieb, eine andere Gesellschaft oder eine Privatperson ist; private Zahlung ist nicht automatisch Betriebsaufwand oder Einlage. Kaufpreis, Finanzierung, Fälligkeit und Zahlungsnachweis müssen dem konkreten Vertrag entnommen sein.
- Im Zielunternehmen ändern sich Cash, Eigenkapital, Schulden, Vermögen oder Ertrag nicht allein aus dem Anteilseignerwechsel. Separat vereinbarte Einlagen, Ausschüttungen, Darlehen, Gebühren, Garantien oder spätere Leistungen brauchen eigene autorisierte Ereignisse.
- Eine Beteiligungs-/Kontrollprüfung wird nicht durch A03 oder durch einen Anteilskauf als freigegeben dargestellt; A02/A08 führen die separate Fall-/Rechtsprüfung.

### 4.4 Asset Deal / Kauf eines Betriebs oder Betriebsteils

- Kein pauschaler Übergang „des Unternehmens“. Käufer, Verkäufer, Stichtag/Übergangszeitpunkt und jede übertragene Position werden einzeln belegt: Gegenstand, Eigentum, Menge/Wertbasis, Kaufpreiszuordnung, Rechnung/Steuerbasis, Zahlung, zugehöriger Vertrag, Forderung/Verbindlichkeit und Beschäftigtenbezug.
- Vermögen, Vorräte, Forderungen und Verbindlichkeiten werden nur bei konkretem Vertrag/gesetzlichem Übergang und mit zurechenbarer Position übernommen. Der Gesamtpreis darf ohne vereinbarte Zuordnung nicht von A03 automatisch auf Positionen verteilt werden. Fehlende Werte oder Zuordnungen blockieren eine belastbare Buchung statt einen Restposten zu erzeugen.
- Für einen möglichen Betriebs-/Betriebsteilübergang muss die fachliche Rechtsprüfung festhalten, ob die Voraussetzungen von [§ 613a Abs. 1 BGB](https://www.gesetze-im-internet.de/bgb/__613a.html) im Einzelfall erfüllt sind. Dann können bestehende Arbeitsverhältnisse kraft Gesetzes übergehen. A02 führt den Personalprozess; insbesondere ist das Kündigungsverbot wegen des Übergangs nach § 613a Abs. 4 BGB dort als Personal-/Prozessregel zu berücksichtigen. Daraus entsteht keine eigenständige A03-Buchungsaufgabe. Unterrichtung und Widerspruch nach Abs. 5–6 bleiben Prozess-/Personalstatus von A02/A05. A03 benötigt nur für eine konkret festgestellte finanzielle Anspruchsposition Arbeitgeber alt/neu, Entgelt-/Leistungsansprüche, Entstehungszeitraum, Übergangsdatum, Fälligkeit, Bemessungszeitraum und Widerspruchs-/Prüfstatus. Es erfolgt keine automatische Lohn-/Verbindlichkeitsbuchung allein aus der Kaufabsicht.
- § 613a Abs. 2 BGB kann den bisherigen Arbeitgeber für bestimmte vor Übergang entstandene, binnen eines Jahres fällig werdende Verpflichtungen neben dem neuen Inhaber als Gesamtschuldner haften lassen; bei später fälligen Verpflichtungen ist der gesetzliche Anteil am Bemessungszeitraum zu berücksichtigen. Die Prüfung muss auch die Ausnahme nach § 613a Abs. 3 berücksichtigen, wenn eine juristische Person oder Personenhandelsgesellschaft durch Umwandlung erlischt; gesetzliche Verschmelzungen sind außerhalb des bestätigten V3-Umfangs. A03 darf dies nur als konkreten Prüfinput mit Betrag, Entstehung/Fälligkeit, Zeitraum, Anspruchsgrundlage und Feststellung der Anwendbarkeit bewerten. Kein pauschaler Schuldendoppelansatz.
- Die Rechtsfolgen aus [§ 25 Abs. 1–3 HGB](https://www.gesetze-im-internet.de/hgb/__25.html) sind getrennte Prüfpfade. Nach Abs. 1 setzt die Erwerberhaftung für im Geschäftsbetrieb begründete Verbindlichkeiten grundsätzlich den Erwerb eines Handelsgeschäfts unter Lebenden und dessen Fortführung unter der bisherigen Firma voraus. Davon getrennt gilt eine betriebliche Forderung den Schuldnern gegenüber nur dann als auf den Erwerber übergegangen, wenn der bisherige Inhaber oder seine Erben der Firmenfortführung zugestimmt haben. A02/A08 liefern deshalb je Prüfung Fortführung/Firma, Zustimmung sowie die konkret betroffenen Forderungen bzw. Altverbindlichkeiten; eine Forderungszuordnung ist keine Schuldübernahme und eine Erwerberhaftung erzeugt nicht automatisch einen Forderungsübergang.
- Eine abweichende Vereinbarung ist einem Dritten gegenüber nach Abs. 2 nur wirksam, wenn sie in das Handelsregister eingetragen und bekanntgemacht oder von Erwerber oder Veräußerer diesem Dritten mitgeteilt wurde. Diese Eintragungs-/Bekanntmachungs-/Mitteilungsdaten sind getrennte Prüfeingaben; eine bloße Vereinbarung genügt für die Drittwirkung nicht. Wird die Firma nicht fortgeführt, haftet der Erwerber nach Abs. 3 nur bei einem besonderen Verpflichtungsgrund, etwa einer in handelsüblicher Weise bekanntgemachten Übernahme der Verbindlichkeiten. Ohne den jeweils einschlägigen Tatbestand und konkret bestimmte Anspruchsposition keine Altverbindlichkeitsübernahme, Forderungszuordnung oder Doppelansetzung.
- § 613a BGB und § 25 HGB prüfen unterschiedliche Rechtsfolgen. Ein positives Prüfergebnis ist noch kein Betrag oder Buchungssatz. A03 benötigt den konkret bestimmten Anspruch, Schuldner/Gläubiger, Betrag/Valuta, Anteil/Zurechnung und Wirksamkeits-/Fälligkeitsdatum.

### 4.5 Gesellschafter-/Komplementärwechsel

- Ein Wechsel bei Gesellschaftern/Komplementärinnen wird zunächst als Status-/Beteiligungsereignis mit alter und neuer Person/Rechtsträger-ID sowie Wirksamkeits-/Registerbezug übergeben.
- Ein-/Auszahlung, Einlage, Abfindung, Kaufpreis, Kapitalrückzahlung oder Haftungsfolge wird nicht aus dem Wechselstatus abgeleitet. Jede Zahlung bzw. Bilanzfolge erfordert konkreten Vertrag, Betrag, Anspruchsgrund und getrennt autorisiertes Finanzereignis.
- Bei der GmbH & Co. KG werden GmbH und KG nicht zusammengezogen. Auswirkungen auf Komplementärstellung, Beteiligung, Vertretung und Finanzierung sind je Rechtsträger getrennt zu prüfen; Rechtsstatusprüfung durch A08/A02, Finanzwirkung durch A03.

### 4.6 Finanzierung / Darlehensangebot

- Ein unverbindliches Finanzierungsangebot, eine simulierte Bankkondition oder ein Kapitalplan ist Information/Plan und erzeugt kein Darlehen, Cash, Zins oder Gebühren.
- Ein unterschriebener Finanzierungsvertrag ist getrennt von tatsächlicher Auszahlung zu führen. Eine Darlehensverbindlichkeit und Bankguthaben entstehen im Spiel erst mit einem expliziten, belegten Drawdown-Ereignis und dessen Betrag/Datum/Vertrag. Ziehung, Zinsen, Rate, Sicherheiten, Gebühren, Fälligkeit und Sondertilgung folgen ausschließlich dem konkret bestätigten Vertrag und bestehender A03-Policy.
- Es wird keine Kreditgenehmigung, Zinshöhe, Maximalverschuldung oder automatische Ziehung aus diesem Vertrag abgeleitet. Fremdfinanzierung für GmbH-/KG-Gründung oder Unternehmenskauf ist nur als Option sichtbar; konkrete Produkt-/Bankverhandlung und Sicherheitenparameter bleiben gesondert zu vereinbaren.

## 5. Perioden- und Abgleichregeln

A02 liefert den tatsächlichen Zeitstempel des Rechts-/Leistungs-/Übergangsereignisses; Rechnung, Fälligkeit und Zahlung behalten jeweils ihr eigenes Datum. A03 ordnet sie nach geltender Vertrags-/Finanzpolicy der Finanzperiode zu. Der Gesellschafts-/Registerstatus oder eine laufende Rechtsprüfung darf keine rückdatierte Finanzwirkung erzeugen. Zahlungen müssen dem benannten Zahlerkonto und Empfänger zugeordnet und einmalig verarbeitet werden. V1/V2-Zahlungsziele, Steuerscope, Kreditregeln oder Kostenannahmen werden nicht still übertragen.

Wenn die Parteien, Beträge, Eigentumszuordnung, Abgrenzung, Steuerbasis, Leistungs-/Fälligkeits-/Zahlungsdatum oder Belegreferenz fehlen, ist der Finanzvorgang `incomplete` und nicht buchungsfähig. Keine fehlenden Beträge als 0, Eigenkapital, Darlehen, Restwert oder Verbindlichkeit imputieren.

## 6. Offene Eingaben und Zuständigkeiten

| Offener Punkt | Zuständigkeit / Folge |
|---|---|
| Rechtsform-/Register-/Betriebsfähigkeit und konkrete Prüfung §613a/§25 | A02/A08; A05 zeigt Status/Blockgründe ohne Rechtsfreigabe. |
| Welche Transaktionsszenarien werden vor Release tatsächlich spielbar; wann AG/eG/KGaA freigeschaltet werden | A01 bündelt; die V3-Kandidatenentscheidung bleibt beim Nutzer vor Release. |
| Käufer/Verkäufer, private oder betriebliche Sphäre, Kaufpreis, Zuordnung, Fälligkeit und Abwicklung | Vertrag/Szenariodaten; fehlende Inputs verhindern Ist-Buchung. A01/Nutzer nur, falls ein Produktdefault benötigt wird. |
| Einlagearten, Gründungs-/Registerkosten, Zuordnung zur GmbH oder KG, Behandlung steuerpflichtiger Leistungen | A03 benötigt konkrete Grundlage; keine Beträge/Steuersätze aus diesem Vertrag. |
| Gemeinsamer Einkauf: Rechnungsempfänger, Eigentümer, Abrechnungsschlüssel, Mengen-/Preisrabatt und Zahlung | A02/A03/A05-Interface; kein pauschaler Gruppenschlüssel. |
| Betriebsübergang: betroffene Arbeitsverträge, Anspruchspositionen, Unterrichtung/Widerspruch, Entstehungs-/Fälligkeitszeitraum und gesetzliche Haftungsverteilung | A02/A08 liefern Rechtsprüfung; A03 ermittelt finanzielle Zuordnung erst nach belegten Einzelfalldaten. |
| §25 HGB: Handelsgeschäft, frühere Firma, Fortführung, Einwilligung/abweichende Vereinbarung und Altverbindlichkeiten | A02/A08 belegen Tatbestands-/Fallprüfung; A03 prüft Betrag und Folge. |
| Kreditkonditionen, Sicherheiten, Ziehungs-/Tilgungsplan, Gebühren und maximale Verschuldung | Separate A03-Finanz-/Nutzerentscheidung vor produktiver Anwendung. |

Der Vertrag enthält keinen aktuell erforderlichen Nutzerentscheid zur Dokumentation. Wenn ein konkreter Spielablauf eine fehlende Produkt-/Vertragskonvention verlangt, muss A01 vor Implementierung eine gebündelte Entscheidungsübersicht einholen.

## 7. Quellen und Entscheidungsgrenzen

- [BGB § 613a Abs. 1–3 und 5–6](https://www.gesetze-im-internet.de/bgb/__613a.html): Übergang bestehender Rechte und Pflichten, bedingte Gesamtschuldnerhaftung bzw. Bemessungszeitraum, gesetzliche Ausnahme sowie Unterrichtung/Widerspruch. Abs. 4 (Kündigungsverbot wegen Betriebsübergangs) ist dem A02-Personalprozess zugeordnet und keine A03-Buchungsaufgabe.
- [HGB § 25 Abs. 1–3](https://www.gesetze-im-internet.de/hgb/__25.html): Abs. 1 trennt Erwerberhaftung für Geschäftsschulden von Forderungsübergang gegenüber Schuldnern (bei Zustimmung zur Firmenfortführung); Abs. 2 regelt die Drittwirkung abweichender Vereinbarungen; Abs. 3 verlangt bei Nichtfortführung der Firma einen besonderen Verpflichtungsgrund.
- [HGB § 161 Abs. 2](https://www.gesetze-im-internet.de/hgb/__161.html) ist die Verweisungsnorm: Soweit der KG-Abschnitt nichts anderes vorschreibt, finden die für die OHG geltenden Vorschriften entsprechende Anwendung. Im KG-Pfad ist deshalb [HGB § 123 Abs. 1](https://www.gesetze-im-internet.de/hgb/__123.html) zur Teilnahme am Rechtsverkehr vor Eintragung nur entsprechend und unter seinen Voraussetzungen heranzuziehen; [HGB § 107 Abs. 1](https://www.gesetze-im-internet.de/hgb/__107.html) ist für den dort geregelten kleingewerblichen bzw. vermögensverwaltenden Sonderfall als Anwendungsgrenze mitzubeachten.
- [GmbHG § 11](https://www.gesetze-im-internet.de/gmbhg/__11.html): GmbH besteht als solche erst nach Registereintragung; Handelndenhaftung vor Eintragung gesondert prüfen.
- A08-Rechtsformmatrix und Rechtsrahmenregister (Stand 2026-10-31); A02-Statusvertrag; D-0159–D-0164; bestehendes A03-V3-Finanzschnittstellenpaket.

Dies ist eine Simulations-/Schnittstellenspezifikation, keine Rechts-/Steuerberatung, kein vollständiges HGB-/EStG-/UStG-Rechnungslegungsmodell und keine pauschale Prüfung eines konkreten Anteil- oder Betriebsübergangs.
