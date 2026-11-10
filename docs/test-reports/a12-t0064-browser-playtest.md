# A12 – T-0064 V3 Browser-Playtest

**STATUS:** Funktionale Desktop-Szenarien bestanden; mobile Viewport-/Touchprüfung nicht ausgeführt; kleiner UI-Befund offen  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A12 – BROWSER_PLAYTEST  
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2, SLG-002.5  
**TICKET:** T-0064  
**BASIS:** Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; Vorgänger-Checkpoint CP-0280 (ENTWURF). Entscheidungen D-0159, D-0161, D-0163, D-0164.

## Preflight und Umgebung

- AGENTS.md, Agentenstruktur, Rechtekarte, A12-Rollenprofil, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 und die A02-/A05-T-0064-Arbeitsberichte/Schnittstellen gelesen.
- Repo: `C:\Users\Tobia\Documents\GitHub\WFWSimulation`; `git status --short` zeigte bereits umfangreiche parallele Änderungen anderer Agenten. Keine Produktdatei wurde durch A12 geändert. `git diff --check` Exit 0; Git gab bestehende LF/CRLF-Hinweise aus.
- Browser: Codex In-App Browser, lokaler Lauf über `http://127.0.0.1:8030/v3/index.html`; Screenshot-Viewport ca. 1265 × 720 px. Datum: 2026-10-31. Kein echtes Mobilgerät und keine Mobile-Viewport-Emulation verfügbar.
- Isolierter, wegwerfbarer QA-Zustand: Szenario `qa-t0064`, Startdatum 2026-10-31, IDs `founder-qa`, `sole-qa`, `gmbh-qa`, `kg-qa`; ausschließlich erfundene `fixture:*`-Belegreferenzen. Keine dauerhafte Spielstanddatei oder fremder Dienst.
- Der lokale Server bindet an `127.0.0.1` und stellt nur `prototype/` bereit. Ein anfänglicher Start mit `prototype/v3/` als Wurzel ließ den benötigten Nachbarmodulimport absichtlich außerhalb dieser Wurzel fehlschlagen; der Server wurde auf den engeren nötigen Ordner `prototype/` umgestellt. Danach liefen Oberfläche und Smoke im Browser. Das war ein Test-Harness-Konfigurationsfehler, kein Produktbefund.

## Ausgeführte Szenarien

| Szenario / Schritte | Erwartung | Beobachtung |
|---|---|---|
| V3-Startseite öffnen, QA-Szenario laden, nacheinander Idee → Markt → Angebot → Ressourcen/Kapitalplan fortschreiben | Jede Phase erscheint, Ereignisse erhalten Datum/Quelle, Zustand bleibt valide | Bestanden. Workspace, Statusmeldungen und Ereignisprotokoll wurden sichtbar aktualisiert. |
| Sechs Tragfähigkeitsbereiche belegen und Spielerurteil speichern | Urteil wird ausdrücklich vom Nutzer eingegeben; keine erfundenen Werte/Rechtsprüfung | Bestanden. „Tragfähig“ wurde als Spielerbewertung ausgewiesen; Felder danach gesperrt. |
| GmbH & Co. KG wählen, beide IDs/Rollen belegen; GmbH zunächst einreichen und registrieren | GmbH und KG bleiben getrennte Rechtsträger; Registerstände separat | Bestanden. Beide Rechtsträger wurden einzeln angezeigt; GmbH wechselte über „Einreichung offen“ zu „Eingetragen“. |
| Kandidatenstatus prüfen | AG/eG/GmbH & Co. KGaA bleiben gemäß D-0163/0164 in V3 gesperrt | Bestanden. Kandidaten erschienen als nicht freigeschalteter Text ohne auswählbaren Pfad. |
| KG-Vorregisteroption mit Prüfstatus „Weitere Prüfung nötig“ absenden; danach geklärt mit zwei Zustimmungsbelegen | Offener Rechtsreview blockiert; bei erforderlicher Zustimmung/Beleg wird nur die bedingte Aktivität protokolliert | Bestanden. Erster Versuch erzeugte Fehlermeldung ohne neues Ereignis; nach geklärtem Review und beiden Belegen wurde `AUTHORIZE_KG_PREREGISTRATION_ACTIVITY` protokolliert. UI kennzeichnet ausdrücklich, dass sie keine Rechtsfreigabe erteilt. |
| Gemeinsame Beschaffung eröffnen, Rechtsform-/Wettbewerbsreview erfassen und schließen | Kooperation getrennt von Unternehmensübernahme; Abschluss nur mit Prüfbelegen | Bestanden. Vorgeschlagen → Geprüft → Abgeschlossen. Abschluss erzeugte eine offene A03-Übergabe mit expliziten fehlenden Finanzinputs, ohne Cash-/Ledgerwirkung. |
| Asset-/Betriebskauf eröffnen und Review mit ungeklärter § 613a-/§ 25-Lage speichern | Keine automatische rechtliche Einordnung; offener Review hält Abschluss zurück | Bestanden. Nach `needs_review` war der Vorgang „Prüfung offen“; Hinweis „Weiterer Review nötig. Der Vorgang bleibt offen; kein Abschluss verfügbar.“ |
| Share Deal eröffnen, Inhaberwechsel mit Referenzen prüfen und abschließen | Ziel-Rechtsträger bleibt bestehen; Finanzwirkung erst über A03 | Bestanden. Vorgeschlagen → Geprüft → Abgeschlossen. Offene A03-Übergabe zeigte Parteien-/Beleg-/Betrags-/Perioden-/Autorisierungsbedarf und „Keine Buchung und keine Cashwirkung“. |
| Tabs zwischen Gründung und Kooperationen/Erwerb bedienen | Wechsel der UI-Bereiche funktioniert | Bestanden. Tabwechsel war direkt möglich; langes Formular ließ sich scrollen. |

Der Browser-Smoke `http://127.0.0.1:8030/v3/a05-t0064-smoke.html` zeigte `PASS` für Kandidatensperre, Nichtmutation, explizite Tragfähigkeit, getrennte GmbH/KG, Register, KG-Zustimmung, Kooperation, ausstehenden Rechtsreview und nichtbuchende Finanzübergaben.

## Befund

**A12-UI-Befund, Schweregrad gering:** Nach erfolgreichem Laden des Szenarios bleibt im Setup-Kopf die Plakette **„Eingaben erforderlich“** sichtbar, obwohl Szenario und Pflichtfelder erfolgreich geladen sind und das Arbeitsfenster bereits benutzt werden kann. Das widerspricht dem sichtbaren Status „Szenario geladen“ und kann den Nutzer glauben lassen, der Start sei unvollständig. Reproduktion: neue Route öffnen, alle fünf Startfelder ausfüllen, „Szenario laden“ drücken; Plakette bleibt sichtbar. Erwartung: Plakette wechselt auf einen passenden geladenen/abgeschlossenen Zustand oder wird nach erfolgreichem Laden entfernt. Übergabe zur Behebung an A05; A12 hat Produktcode nicht verändert.

## Visuelle/mobile Grenzen

- Der Desktop-Screenshot zeigte saubere Hierarchie, lesbare Statuschips, getrennte Prozesskarten und ausreichend große Bedienelemente. Die im Stylesheet sichtbaren Felder/Buttons haben mindestens 44 px Höhe; der Mobile-Breakpoint liegt bei 680 px und stellt Formulare/Reviewbereiche auf eine Spalte um.
- Ein tatsächlicher Test bei 680 px oder kleiner, Touch-Targets per Mobil-Emulation, Tastatur-/Screenreader-Vollprüfung und ein physischer iPhone-/iPad-Test wurden nicht ausgeführt. Daher keine mobile Abnahme.
- Screenshot wurde während des Browserlaufs im Tool angezeigt, aber nicht als Datei unter dem Repo gespeichert. Browserkonsole war über die verfügbare A12-Steuerung nicht auslesbar; der sichtbare Browser-Smoke und die Statusmeldungen waren verfügbar.

## Nachweise und nächste Schritte

- Browser-Startpunkt: `http://127.0.0.1:8030/v3/index.html`. Für denselben QA-Lauf: Scenario-ID `qa-t0064`, Datum `2026-10-31`, Gründer `founder-qa`, initialer Rechtsträger `sole-qa`, Quelle `fixture:qa-start`; die genannten Fixtures manuell gemäß Tabelle eingeben. Der Zustand wird nicht in der URL oder einer Datei gespeichert.
- **Ausführung:** A12 explorativ, funktionale Desktoppfade PASS mit einem geringfügigen Plakettenbefund.
- **Fachreview:** nicht ausgeführt (A02/A08-Fachreview bleibt separat).
- **Unabhängige QA:** nicht durch A12; A09 Runtime/UI-QA separat angefordert.
- **Browser-/Gerätetest:** Desktop im Codex In-App Browser ausgeführt; Mobile/Touch nicht ausgeführt.
- **Git-Verifikation:** Preflightstatus und `git diff --check` geprüft; bestehende Änderungen erhalten; keine A12-Produktänderung; kein Commit/Push.
- **Nächster Adressat:** A05 soll die Startstatus-Plakette korrigieren; A09 bewertet Regression/UI-Vertrag. Für mobile Sichtprüfung ist ein unabhängiger Viewport-/Geräteschritt im A09/A12-Gate noch offen.
