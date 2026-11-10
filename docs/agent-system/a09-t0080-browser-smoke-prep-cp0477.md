# A09 – T-0080 Browser-Smoke-Vorbereitung (CP-0477)

**STATUS:** PASS für Vorbereitung/Matrizendefinition; kein Browser-, Geräte- oder Produkt-PASS  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**GOALS/TICKETS:** MG-002 / SLG-002.2, SLG-002.5 / T-0080 (T-0069 G10)  
**BASIS:** CP-0477; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**DIGEST:** Die sieben Control-Plane-Hashes aus CP-0477 stimmen. Erwarteter Status laut Übergabe: 462 Zeilen; aktuell read-only erhoben: 573 Zeilen. Umfangreiche lokale Änderungen bleiben unangetastet.

## Aktueller Smoke-Pfad und Automatisierung

- Bestehende Route: `http://127.0.0.1:8031/prototype/v3/run.html`. A05 dokumentiert einen kontrollierten Desktop-Smoke bis Start, Tagesöffnung, Anfrage/Postfach, Angebotsfelder sowie angenommene Einreichung mit DB-I-/BAB-Anzeige. Vollständiger Produktionsablauf und schmale Viewports wurden dort nicht im Browser geprüft.
- A12 erreichte die Route zuvor mit HTTP 200, aber ohne verfügbaren kontrollierten Browser: CUA-Inventar `browsers: []`; deshalb keine Seite, AX/DOM, Konsole, Screenshots oder Viewportsimulation. Meine aktuelle CUA-Inventur bestätigt `browsers: []`; Microsoft Edge läuft zwar, aber nur mit einer nicht zum lokalen Prototyp gehörenden GitHub-Seite. Kein Browser wurde geöffnet oder bedient.
- Vorhandener `prototype/a05-t0069-run-ui-regressions.mjs` ist automatisierte API-/Markup-/CSS-Regression, keine gerenderte Browserprüfung. Responsive-Assertions prüfen CSS-Regeln wie Wrapping und `overflow-x: clip`, aber keine tatsächliche Geometrie, abgeschnittenen Controls oder Touchbedienung. Im Repo wurde kein Playwright-/Puppeteer-Konfigurationspfad für diesen Run-Smoke gefunden.
- `run.html` bindet Skript und Modulgraph über SHA-256-Querywerte. Nach Integration von T-0075–79 muss der Graph aktualisiert und gegen den finalen Arbeitsstand geprüft werden; veraltete Cachebytes würden die UI-Prüfung entwerten.

## Reproduzierbarer Testaufbau

Vor jedem unabhängigen Viewportlauf denselben isolierten Test verwenden und neu starten: Szenario `V3-RUN-SYNTH-01`, Seed `seed-v3-001`, Start `2027-01-04`, Ende `2027-01-29` (A12-Wiedereinstiegsprofil); feste integrierte Run-/Modellversion und feste Spieleraktionen protokollieren. Auf jeder Viewportgröße den Test frisch starten, weil der Run tablokal/in-memory ist und Reload ihn verwirft. Browser/OS-Version, Zoom 100 %, Viewport in CSS-Pixeln, Device Scale Factor, URL/Buildhash und Seed festhalten.

| Kernpfad | 390×844 | 768×1024 | Sollbeleg / Prüfpunkte |
|---|---|---|---|
| Start und Tagessteuerung | Ja | Ja | Setup, Ressourcenbestätigung vor Tag 1, Datum/Status und Start-/Öffnen-/Schließen-Aktionen sichtbar und bedienbar; Startfehler verständlich; keine Browserfehler. |
| Anfrage und Angebot | Ja | Ja | Anfrage-ID im Postfach; synthetische Kennzeichnung; alle Preis-/Kostenfelder erreichbar; Angebotsabgabe; DB I/BAB-Ausgabe und angenommenes/abgelehntes Ergebnis. Angezeigter Snapshot bleibt nach Folgeschritt unverändert. |
| Planung und Produktion | Ja | Ja | Auftrag-/Work-Order-ID, Ressourcen- und Operationsplan; ungültiger Skill/Kapazitätsfall ohne Teilmutation; valide Schritte in Reihenfolge; Fortschritt und nächste Aktion erreichbar; Abschluss behauptet nicht automatisch Versand/Abnahme/Rechnung/Zahlung. |
| Lager und Beschaffung | Ja | Ja | Materialreservierung/-verbrauch, Lagerkapazität, Fertigbestand/Versand und Beschaffungsstatus stimmen mit Event-/Statebelegen; pending Bewertungs-/COGS-Lücken bleiben als pending sichtbar. |
| Finanzen und Abstimmung | Ja | Ja | A03-Projektion, Rechnungs-/OP-/Zahlungs-/Bank-/Steuerstatus sowie Nichtbuchungsstatus mit denselben Event-IDs, Beträgen und Perioden wie Run-/Finance-State. Jede erwartete Gleichung und Differenz wird separat ausgewiesen; kein UI-Saldo ohne Source Event. |
| Lernen | Ja | Ja | Lernkarte/Frage und Antwortbedienung erreichbar; Fortschritt/Feedback sichtbar; kein unerlaubter Simulations-/Finanzeffekt. Falls noch kein integrierter A02/A06-Pfad vorliegt, explizit BLOCKED statt UI-PASS. |
| Responsive/Overflow/Bedienung | Ja | Ja | Nach jedem obigen Zustand alle Aktionen per Scroll erreichbar; keine abgeschnittene Aktion, kein horizontales Seitenoverflow, Fokus-/Labels/Statusmeldungen nutzbar; Screenshot und Geometriemessung je Breite. |

Für den Overflow-Nachweis bei jeder Breite `document.documentElement.scrollWidth <= window.innerWidth` protokollieren. Zusätzlich Bounding-Rects der kritischen Aktionen prüfen, damit `overflow-x: clip` abgeschnittene Elemente nicht als scheinbar überlauffrei kaschiert. Tastaturfokus und Touch-/Pointer-Zielzustand an den Kernaktionen prüfen.

## Erforderliche Reconciliation- und Browserbelege

Für jeden Lauf: Run-ID, Seed, Start-/Enddatum, Build-/Modulgraphhash, Ereignisfolge mit Datum/Phase, Anfrage-/Angebots-/Auftrags-/Work-Order-IDs, Vorher-/Nachher-Mengen und Status, Lagerroll-forward, A03 Finance-State-/Journalprojektion, Periodenbezug, Differenzen, Save/Restore-Status und fachlicher State-/Eventhash. A09 vergleicht UI-Anzeigen unabhängig gegen diese Run-/A02-/A03-Belege; A12 dokumentiert Geräte/Browser, Interaktionen, Screenshots und Fehler. Browserkonsole/Netzwerkfehler, fehlgeschlagene Modulrequests, HTTP-Status und Start-/Abbruchstatus gehören dazu. Mindestens Screenshots zu Start, Postfach, Angebotsabgabe, Planung/Produktion, Lager, Finanzen und Lernen je Viewport.

## Blocker und Abhängigkeiten

- **Kontrollierter Browser:** aktuell kein CUA-Browserprovider/Tab und keine Screenshot-/DOM-/Konsolenerfassung; der alte A12-Blocker besteht. Edge als laufende native App ist kein reproduzierbar kontrollierter Tab. Der aktuelle echte Browser-Smoke ist deshalb nicht ausführbar, ohne dass A01/A12 einen kontrollierten Browser bereitstellt.
- **Integrierte Pfade:** CP-0476/0477 ordnet T-0080 nach T-0075–79 ein. Auftrag/Produktion (T-0075), Lager (T-0076), Finanz-/Ledgerabgleich (T-0077), Restore (T-0078) und bestätigte Laufzeitgrenze/Profile (T-0079) müssen mit finalen Schnittstellen-/Runbelegen vorliegen. CP-0477 nennt T-0077 als noch unvollständige Kundenjournalprojektion mit fehlenden Lieferanten-, Payroll-, Steuerabführungs-, Kredit-/Dispo- und Bestands-/COGS-Flüssen. Fehlende Nachweise dürfen nicht als bestandener UI-Pfad formuliert werden.
- **Fach-/UI-Bindung:** A05 muss den finalen Run-/Modulgraphhash und sämtliche integrierten Ansichten bereitstellen; A12 übernimmt reproduzierbare visuelle Touch-/Browserprüfung; A09 prüft die Reconciliationbelege unabhängig. Die A05-Regressionen und der frühere Desktop-Smoke ersetzen keine dieser Schritte.

**AUSFÜHRUNG:** Read-only-Dokument-/Datei-/Automation-Audit; kein Server gestartet, kein Browser navigiert, keine Regressionen oder Jahresläufe ausgeführt.  
**VORBEREITUNG:** PASS – reproduzierbare Matrix und benötigte Belege festgelegt.  
**AKTUELLE BROWSER-/GERÄTEPRÜFUNG:** nicht ausgeführt; kontrollierter Browser und T-0075–79-Integration fehlen.  
**TICKETSTATUS:** nicht geändert; T-0080 bleibt von den dokumentierten Vorgängern abhängig. Kein Code geändert; kein Stage/Commit/Push.
