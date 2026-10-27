# V1-Wirtschaftssystem-Audit – 2026-10-27

**Adressat:** A01 – MASTER_ORCHESTRATOR\
**Goal:** MG-000 / SLG-000.2\
**Umfang:** Ticketstatus, Agentenreview A01–A11, V1-Browserprototyp, 365-Tage-Smoke, Wirtschafts- und Marktplausibilität.\
**Arbeitsmodus:** Audit und Folgeplanung; keine Änderung an Simulationscode, Bilanzregeln oder Steuersätzen.

## Offene Tickets

Zum Auditzeitpunkt ist im aktuellen Ticketboard nur **T-0015 – V1-Zahlungsereignisse an D-0129 angleichen** offen (`PENDING`, Priorität HIGH). Es ist A02 zugeordnet, mit Fachreview A03, UI-Review A05 und QA A09; A01 führt die Arbeit gemäß Nutzerauftrag aus. Die Tickets T-0001, T-0008, T-0009, T-0010, T-0011 und T-0012 bis T-0014 stehen im Board auf abgeschlossen. Historische Tickets außerhalb MG-000 / SLG-000.2 werden hier nicht als aktive Arbeit gezählt.

## Ergebnis der Rollenprüfung

Alle Rollen A01–A11 wurden in der Auditplanung berücksichtigt. A01 hat Governance-/Ticketstatus, Prototypcode und Jahres-Smoke im Checkout geprüft. A02/A09 lieferten einen fachlichen Review von Ablauf und Testabdeckung; die Prüfer konnten wegen eines abweichenden Projektspiegels nicht selbst auf den WFWSimulation-Checkout zugreifen. A05/A08 lieferten UI-/Marktbeobachtungen und öffentliche Vergleichsquellen, ebenfalls ohne checkoutseitige Codeverifikation. A03/A04 meldeten, dass der Checkout in ihrer Laufzeitumgebung nicht zugänglich war. Daher werden Aussagen zu A02/A09 durch A01-Codeprüfung bestätigt; A03/A04- und A05/A08-Befunde sind Vorschläge/Prüfleads, keine formellen Fachabnahmen. A06, A07, A10 und A11 hatten aus derselben Zugriffsgrenze keine unabhängige fachliche Repo-Prüfung. Es wird keine Agentenfreigabe fingiert.

### A02/A09 – Simulation und Testqualität

- `prototype/year-simulation-smoke.mjs` läuft erfolgreich und endet am **01.01.2028**. Resultat: 23 Marktchancen, 10 gewonnene und 13 verlorene Chancen, 12 Lieferungen, 9 geschlossene Aufträge, 12 Monatsabschlüsse; Cash bleibt endlich, Bestand nicht negativ, keine offenen Kosten am Ende.
- Alle drei Startaufträge werden geliefert und erreichen `ABGERECHNET`, bleiben aber ohne `closedAt`. Der Smoke prüft damit nicht die vollständige Rechnung-/Zahlungsschließung dieser Startaufträge. Das Ergebnis ist ein Jahres-Survival-/Funktions-Smoke, kein Nachweis profitabler oder vollständig abgewickelter Aufträge.
- Marktchancen folgen festen monatlichen Terminen und erzeugen Szenariopreise anhand Komplexität und Wettbewerbsfaktor. Die Nachfrage-/Preisindizes wirken nur begrenzt auf den Vergabe-/Preisprozess; `priority` ist im Modell vorhanden, aber in `openOrders` bestimmt Fälligkeit/ID die Sortierung. Eine allgemeine, wirksame Spielerpriorisierung mit Engpass-/Deckungsbeitragsanzeige ist nicht nachgewiesen.
- Abgelehnte Abnahmen erhalten `ABLEHNUNG_IN_KLÄRUNG`; ein vollständiger Nacharbeits-/Streit-/Stornoabschluss ist im Auditumfang nicht nachgewiesen.

### A03/A04 – Finanzabläufe und Datenmodell

- Codeprüfung bestätigt einfache SimTAX-Buchung auf ausgestellte Rechnungspositionen und monatlichen Abschluss mit Personal, Miete, Energie, Wartung, Zeitarbeit und Dispozins. SimTAX wird bei Liquiditätsmangel offen gehalten und wöchentlich erneut versucht.
- `payExpense` zahlt Kosten sofort, wenn Cash reicht, sonst entsteht ein offener Posten mit Retry. Lieferantenmaterialzugänge werden am Liefertag als Aufwand/Zahlung behandelt; ein übliches Zahlungsziel je Lieferant wird im aktuellen Szenario nicht geführt.
- Die Startforderungen (12.500 €) und Lieferverbindlichkeiten (7.500 €) haben keine einzelnen Dokumente/Fälligkeiten und bewegen sich nicht automatisch. Das schränkt Liquiditäts- und Periodenrealismus ein.
- Der Prototyp weist selbst darauf hin, dass Miete, Energie, Wartung und Startbewertung Annahmen sind und weder BAB noch prüfungsfähigen Abschluss darstellen. Der 19-%-SimTAX-Mechanismus bleibt Spielsteuer und ist kein vollständiges USt-, Ertragsteuer- oder Steuererklärungsmodell.
- Finanzcode verwendet Geldbeträge und einzelne Periodenübersichten, aber im Review ist keine vollständige doppelte Buchführung mit Bilanzfortschreibung und Gewinn-/Verlust-Reconciliation nachgewiesen.

### A05 – UI, Preisverhandlung und Priorisierung

- Für bereits historisch bestätigte Aufträge wird der Netto-Szenariopreis und das Zahlungsziel derzeit erst nach Lieferung/Abnahme eingetragen. Generierte Aufträge erhalten dagegen einen automatisch erzeugten Szenariopreis. Das ermöglicht keine Verhandlung vor Annahme, keine Ablehnung eines unwirtschaftlichen Angebots und keine transparente Kosten-/Margenabwägung vor Kapazitätsbindung.
- Der Auftrag ist auf Termin/Status, nicht auf vorab sichtbaren Deckungsbeitrag, Arbeits-/Maschinenengpass und Cash-Bedarf optimierbar. Diese Beobachtung ist im Code bestätigt; konkrete UI-Usabilitytests mit A05 stehen aus.

### A06/A07/A10/A11

Kein unabhängiger Repo-Review konnte wegen des nicht zugänglichen Worktree-Pfads bestätigt werden. Aus dem Funktionsumfang folgt als Prüfvorschlag: Lern-/Prüfungsansichten sollten Netto, SimTAX, Deckungsbeitrag, Liquidität und Periodenzuordnung fachlich getrennt vermitteln; A10/A11 sollten vor späteren Infrastruktur-/Architekturänderungen die lokale Browserauslieferung und bestehende Systemgrenzen reviewen. Es wird weder Deployment- noch Architekturfreigabe erteilt.

## Öffentliche Plausibilitätsquellen

- Destatis meldet für September 2026 gewerbliche Erzeugerpreise **+6,7 %** gegenüber dem Vorjahresmonat, Vorleistungsgüter **+6,4 %**, Energie **+14,9 %**, Metalle **+14,0 %** und Maschinen **+2,1 %**. Diese Indizes sind Makroindikatoren für deutsche Erzeugerpreise ohne Umsatzsteuer, keine Händlerpreise für konkrete €/kg-Artikel. Der Modellwert von pauschal +2 % p.a. ist als ruhiger Basispfad möglich, aber kein aktueller Marktpfad und bildet sektorale Schocks nicht ab. [Destatis, September 2026](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_373_61241.html)
- HERMLE-Konzernabschluss 2025: Bilanzsumme rund **486,8 Mio. €**, Eigenkapital **352,9 Mio. €** (rund **72,5 %**), Umsatz **491,9 Mio. €**, Materialaufwand **202,3 Mio. €** (rund **40,8 %** der Gesamtleistung), Personalaufwand **154,7 Mio. €** (rund **31,2 %**), EBIT **69,2 Mio. €** (rund **14,1 %** des Umsatzes), Steueraufwand **19,6 Mio. €**. Das ist ein großer, integrierter Werkzeugmaschinenhersteller mit Konzern-IFRS-Abschluss, kein direkter Zielwert für eine dreiköpfige Lohnfertigung. Es zeigt aber, dass Material und Personal zentrale, getrennt zu beobachtende Kostentreiber sind und Umsatz/Marge/Steuern/Bilanz getrennt ausgewertet werden müssen. [HERMLE Konzernabschluss 2025 (PDF)](https://www.hermle.de/fileadmin/website/6_UNTERNEHMEN-UND-KARRIERE/6_7_Investor_Relations/6_7_2_Finanzberichte/6_7_2_1_Jahresabschluss/Konzernabschluss_2025.pdf)
- HERMLE Zwischenbericht 1. Halbjahr 2026: Umsatz **239,2 Mio. €**, Auftragseingang **273,9 Mio. €**, Auftragsbestand **125,3 Mio. €**, EBIT **25,6 Mio. €**; der Bericht nennt hohe Auslastung und positive Sondereffekte. Die Zahlen illustrieren Auftragsbestand und Auslastung als getrennte Signale, sind aufgrund Größe, Produktmix und Sondereffekten keine KMU-Zielmargen. [HERMLE Zwischenbericht H1 2026 (PDF)](https://www.hermle.de/fileadmin/website/6_UNTERNEHMEN-UND-KARRIERE/6_7_Investor_Relations/6_7_2_Finanzberichte/6_7_2_2_Zwischenberichte/Zwischenbericht_1._Halbjahr_2026..pdf)

## Entwicklungspriorität

1. **T-0015 zuerst abschließen:** deterministische Ereignisreihenfolge gemäß D-0129 und wirksame Spielerreihenfolge der eigenen Zahlungen; QA muss dieselben Fälle über App-/Engine-Pfad prüfen. Das ist ein bereits offenes, klar abgegrenztes Ticket.
2. **T-0016 – Angebots-, Verhandlungs- und Auftragswirtschaft:** Angebot vor Annahme, Preisverhandlung oder Ablehnung, Zahlungsziel und Liefertermin; sichtbare Materialkosten, Arbeits-/Maschinenstunden, angenommene Gemeinkosten, SimTAX separat, Deckungsbeitrag und Liquiditätswirkung. Nach Annahme muss dasselbe Angebot Basis von Planung, Rechnung und Zahlung bleiben.
3. **T-0017 – Markt- und Wirtschaftsdatenpfad:** getrennte Reihen für Stahl, Aluminium, Normteile, Energie und Nachfrage. Händlerbasiswerte bleiben mit Datum/Spezifikation/Nettoeinheit dokumentiert; Makroindizes treiben nur die passende Kategorie und werden nicht als konkrete Beschaffungspreise ausgegeben. V1 erhält einen reproduzierbaren Basis-, Aufwärts- und Abwärtspfad samt Schocktests.
4. **T-0018 – Monatsabschluss/Steuer- und Cashflow-Reconciliation:** monatliche Erfolgs- und Liquiditätsübersicht mit offenen Forderungen/Verbindlichkeiten, Personal, Miete, Energie, Wartung, Material, Fremdarbeit, Finanzierung und SimTAX. SimTAX als eigene Fiktion markieren; keine erfundene Körperschaft-/Gewerbesteuerberechnung. Lieferanten-Zahlungsziele und Startposten brauchen Ereignis-/Fälligkeitsdaten, bevor sie als bewegte Positionen gelten.
5. **T-0019 – Auftragsdisposition und Abnahmefälle:** Priorisierung nach Fälligkeit, Vertragswirkung, Machbarkeit, Engpass und Deckungsbeitrag transparent darstellen; Regeln für verspätete und abgelehnte Abnahme, Nacharbeit und Abschluss prüfen.

T-0016 bis T-0019 sind priorisierte Folgeaufträge, keine bereits implementierten Funktionen und keine neuen Rechts-/Accountingentscheidungen. A02/A03/A05/A08/A09 sind die fachlich notwendigen Rollen für 0016–0019; A06/A07 prüfen Lern-/Bewertungsdarstellung, A10/A11 nur falls spätere Betriebs-/Architekturfragen betroffen sind.

## Git-/Validierungshinweis

`git diff --check` ist erfolgreich; Git gab nur LF/CRLF-Hinweise aus. Der Jahres-Smoke ist erfolgreich bis 01.01.2028, mit den oben dokumentierten Abdeckungslücken. Der Arbeitsbaum enthält bereits vorher vorhandene Änderungen und neue Prototyp-/Dokumentationsdateien; nichts wurde verworfen. Kein Commit oder Push. Keine Anwendungscodeänderung in diesem Audit.