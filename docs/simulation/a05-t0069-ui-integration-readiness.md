# A05 – T-0069 UI-Integrationsbereitschaft

**Status:** UI-Vorprüfung abgeschlossen; Integrationsplan, keine Produktänderung  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Profil:** V3-Szenariostart 2027-01-04; Rechtstand aktuell gemäß D-0161  
**Entscheidungsbezug:** D-0157, D-0159, D-0161, D-0162; CP-0280/CP-0281 (Entwürfe)  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und aktueller Aufbau

AGENTS.md, Agentenstruktur und Rechte, MG-002-Ziele, T-0069 im Ticket Board, Collaboration State, Decision Log, CP-0280/CP-0281, A11-Integrationsanalyse, A02-Run-Choreografie, A03-Finanz-Handoff-Matrix und A08-T-0069-Rechtsreview wurden gelesen. Der Arbeitsbaum enthält zahlreiche parallele Änderungen; bestehende Dateien wurden nicht verworfen oder verändert.

Die vorhandenen V3-Seiten sind Fachprototypen mit getrennten lokalen Testzuständen: `prototype/v3/index.html` ist die Gründungs-/Rechtsträgerroute, `market.html` lädt ein eigenes synthetisches Marktfixture, `finance.html` ist ein Rechenlabor und `macro.html` zeigt Makromodellwerte. Es existiert derzeit keine gemeinsame Run-Startseite und kein durch alle Seiten geteiltes Laufobjekt. Daher sollte die bestehende Gründungsroute nicht stillschweigend zur Dashboard-/Run-Startseite umgedeutet werden.

## Empfohlene UI-Integration

1. Eine ausdrücklich benannte **gemeinsame Spiel-/Laufroute** als Einstieg ergänzen; die Gründungsroute bleibt Fachbereich. Die Route zeigt Szenario-ID/Seed, Datum, Run-Status, letzte Ereignisse, offene Kundenanfragen, heutige ausstehende Aktionen sowie Finanz-/Lernhinweise aus genau demselben Run.
2. Die bestehende Markt-, Makro-, Kalkulations- und Gründungsoberfläche auf denselben serialisierbaren Run-Referenzkontext umstellen. Bis Persistenz/Architektur freigegeben ist, keinen persistenten Datenbankzustand behaupten; ein explizit lokal begrenzter Runzustand muss als solcher gekennzeichnet werden.
3. Ein einheitlicher Tagesfortschritt muss Datum und Ereignislog anzeigen. Aus der UI wird nur der von A02 definierte Tagesfortschritt aufgerufen; direkte Modul-Fixture-Buttons dürfen im spielbaren Run nicht nebeneinander unabhängige Datenstände erzeugen.
4. Lernfragen/Prozessübung bleiben vom produktiven Zustand getrennt, bis die freigegebene T-0069-Lernruntime einen zulässigen Effekt liefert. „Optional/lesend“ aus T-0068 darf nicht als beantwortete Eventfrage oder Unternehmenswirkung dargestellt werden.

## Rechts- und Finanzgrenzen für sichtbare Labels

- Vertrags-/Leistungsspur muss vereinbarte Spielvertragsart und Rollen auseinanderhalten. Bei Werkvertrag handelt der Besteller mit der Abnahme; „Empfänger“ ist dafür nur passend, wenn er Besteller ist. Keine universelle Werkvertrags- oder §640-Kennzeichnung für jeden Fertigungsauftrag.
- Vertragsschluss, tatsächliche Arbeit/Leistung, Lieferung, Abnahme/vereinbarter Leistungsnachweis, Rechnung/Forderung, Fälligkeit und Zahlung sind getrennte Ereignisse/Status mit eigenen Daten. Keine automatische Abnahmefiktion oder gesetzliche Verzugsbehauptung ohne die notwendigen Tatbestandsdaten.
- Simulationswerte zu Erlös/Forderung werden in der Oberfläche als **vereinfachtes Spiel-KLR-Modell** bezeichnet. Keine HGB-Abschluss-/Steuerkonformität suggerieren; Zahlung ist kein zweiter Umsatz.
- Solange A03-Eingaben unvollständig sind, Status „Finanzübergabe ausstehend – nicht gebucht“ zeigen statt Salden, Rechnungen oder Steuerbeträge zu erfinden.

## Mobile- und Bedienanforderungen

- Für schmale Ansichten ist eine einzige vertikale Arbeitsreihenfolge vorzusehen: Datum/Runstatus → Tagesaktionen → Postfach/Aufträge → Finanzstatus → Ereignis-/Lernhinweise.
- Tagesfortschritt und essenzielle Navigation bleiben sichtbar und touchbedienbar; Tabellen/Monatsaggregate dürfen horizontal scrollen, ohne kritische Aktionen zu verstecken.
- Live-Rückmeldungen für Laufstart, Tagesfortschritt, Validierungsfehler und nicht gebuchte Finanzübergaben benötigen semantische Statusbereiche; IDs/Quellen sind aufklappbare Details.
- Es gibt hier noch keinen echten Browser-, Touch- oder Gerätescreenshot-Test. Dafür ist A12 nach einer lauffähigen Integration zuständig; A09 bleibt automatisierte QA.

## Schnittstellen-/Abhängigkeitskarte

| UI-Bereich | vorhandene Basis | benötigte T-0069-Schnittstelle | Sperre/Limit |
|---|---|---|---|
| Gemeinsamer Run | keine | A02 Run-ID/Seed/Datum, Ereignislog, Tagesfortschritt, serieller Zustand | vor A02 runtime kein integrierter Spielzustand |
| Postfach/Angebote | A02-Marktmodul und isolierte Route | gemeinsamer Run plus persistente oder direkt übergebene Market-Projection | keine Einzelkonkurrenzgebote offenlegen; keine doppelte Anfrage |
| Produktion/Produkte | T-0066-Produktlebenszyklus | tatsächliche Operationen aus gemeinsamer Tagesfolge | Finanz-/Lagerbuchung nicht aus UI ableiten |
| Finance | A03-Rechenlabor/APIs | A03 autoritative Finance-Projektion und Status aus tatsächlichen Ereignissen | pending/non-posting bei fehlenden Belegen; keine UI-Mutation |
| Lernen | T-0068 Read-only Prozessroute/Katalog | A06/A02 event selection/answer API mit D-0147-Konformität | bis dahin nur Lesen; kein Effekt behaupten |
| Makro/Gründung | bestehende isolierte V3-Module | gleicher Run-/Szenario-Context | keine getrennten Fixtures innerhalb desselben Runs |

## Nachweise

- **Ausführung:** A05-Preflight und Inspektion vorhandener HTML-/JS-Routen sowie Verträge; Integrationsplan erstellt.
- **Fachreview:** A02/A03-Verträge und A08-Rechtsgrenzen eingesehen; kein UI-Fachentscheid oder neue Regel getroffen.
- **Unabhängige QA:** nicht ausgeführt; keine Produktänderung.
- **Browser-/Gerätetest:** nicht ausgeführt; echte visuelle Prüfung folgt nach Integration.
- **Git-Verifikation:** `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; breiter bestehender Arbeitsbaum; `git diff --check` PASS, nur LF/CRLF-Hinweise.
- **Commit/Push:** keiner.
- **Offene Punkte:** A02/A03 müssen ihre laufenden Schnittstellen fertigstellen und gemeinsam gegen Run-/Finanzsemantik abstimmen. Der gemeinsame Startpunkt/URL ist hier nur als UI-Empfehlung skizziert; keine Architekturfreigabe.
- **Rückfragen an A01:** keine.
- **Nächster Schritt:** A01 gibt nach Schnittstellen- und Rechtsgrenzenreview einen expliziten A05-Implementierungsauftrag; A09 prüft Code/Regressionen und A12 testet danach Browser/Mobil.
