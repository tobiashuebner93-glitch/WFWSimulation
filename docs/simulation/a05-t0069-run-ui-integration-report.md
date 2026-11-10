# A05-Integrationsbericht – T-0069 gemeinsame V3-Run-UI

**Status:** Implementiert; fokussierte Regressionen und Desktop-Browser-Smoke bestanden; unabhängige A03-/A09-/A12-Re-Reviews noch ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Goal:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; der bestehende Arbeitsbaum enthält parallele lokale Änderungen. Kein Commit/Push.

## Preflight

Vor der Umsetzung wurden `AGENTS.md`, Agentenstruktur/-rechte, `goals.md`, `ticket-board.md`, `collaboration-state.md`, `decision-log.md`, CP-0286 (Entwurf), A02s Run-/Operationsbericht, A03s Finanz-Rechenruntime, A05s UI-Bereitschaft und die bestehenden V3-Run-/Markt-/Produktverträge gelesen. `git status` erfasste mehrere Änderungen und ungetrackte Dateien anderer Agenten; diese wurden erhalten. Die A09-Befunde zu RUN-01–04 und die inzwischen von A02 berichteten Korrekturen der zwei Chronologie-/Restore-NONPASS-Fälle wurden berücksichtigt. Keine Agenten-Governance-, Ziel- oder Ticketdatei verändert.

## Umsetzung

- `prototype/v3/run.js` nutzt jetzt `openV3RunDay → submitV3RunOffer → closeV3RunDay`; der Markt-/Tageszustand wird nicht mehr atomar an der Spieleraktion vorbei geschlossen.
- Anfragen sind vor Angebotsabgabe sichtbar. Der Spielende gibt Nettoangebot, direkte Kosten, deren variable/feste Klassifikation, BAB-Anteil und Kosten-/BAB-Kennungen explizit ein. A03s `calculateV3OfferEstimate` und `createV3OfferSnapshot` liefern den unveränderten Kalkulationssnapshot. Die UI zeigt DB I und Ergebnis nach BAB, behauptet aber keine Buchung.
- Für Operationen können Personal, Maschinen, Material, vorhandene Belegungen und Fertigwarenkapazität als explizite JSON-/Zahlenwerte eingegeben werden. Dadurch wird der Produkt-/Kapazitätszustand nicht aus Marktanforderungen erfunden. Ohne diesen Zustand sind Kundenarbeitspläne gesperrt; nach dessen Eingabe zeigt jedes angenommene Angebot ein Formular mit expliziten Vertragspartei-/Kriteriumsangaben und Operationsliste. API validiert Skills, Maschine, Material, Kapazität, Termine und Vorgänger.
- Arbeitsschritte werden während eines geöffneten Tages ausdrücklich abgeschlossen. Erst der letzte Schritt setzt `ready_for_delivery`/`performance_pending`. UI führt weder Versand noch Kundenabnahme, Rechnung, Erlös-/Cashbuchung oder A03-Posting aus; Finanzhandoff bleibt `pending_non_posting`.
- Der Text erklärt synthetische Marktfixture und nur im aktuellen Tab gehaltenen, nicht persistierten Zustand. `run.css` hält Formulare touchbedienbar und nutzt auf schmalen Layouts eine Spalte.

## Prüfungen

- `node --check prototype/v3/run.js`: PASS.
- `node --check prototype/a05-t0069-run-ui-regressions.mjs`: PASS.
- `node prototype/a05-t0069-run-ui-regressions.mjs`: PASS (zweiphasiger Tag, manuelle Kalkulation/Angebotsabgabe, gewonnener Auftrag, expliziter Kapazitäts-/Operationsplan, einmaliger Materialverbrauch und weiterhin nicht-postender Finance-Handoff).
- `node prototype/v3-run-orchestrator-regressions.mjs`: PASS.
- `node prototype/v3-product-lifecycle-regressions.mjs`: PASS.
- `git diff --check`: Exit 0; nur bereits bekannte LF/CRLF-Hinweise.
- Kontrollierter lokaler Browser-Smoke auf `http://127.0.0.1:8031/prototype/v3/run.html`: Starten, Tagesöffnung, Anfragen im Postfach, explizite Angebotsfelder und erfolgreich angenommene Angebotseinreichung samt DB-I-/BAB-Ergebnis sichtbar. Screenshot war Desktopansicht. Mobile Darstellung ist durch CSS breakpoint vorbereitet, aber noch nicht mit schmalem Viewport/device screenshot geprüft; der vollständige Auftrag-/Operationsablauf wurde per Regression, nicht zusätzlich im Browser, geprüft.

## Grenzen / Übergabe

Das UI ist ein lokaler In-memory-Prototyp ohne Speichern/Laden oder persistente Unternehmens-/Personalstammdaten. Ressourcenangaben sind explizite Testeingaben. Die Kalkulation deckt nur eine vom Spielenden angelegte direkte Kostenposition plus expliziten BAB-Anteil ab; sie ist keine Angebotskalkulation mit vollständiger dynamischer Kostenrechnung. Lern-/Makro-/Gründungsoberflächen werden noch nicht in denselben Runzustand eingebunden. Die Finanzruntime wird an diesem UI-Punkt nur zur Kalkulation/Snapshotbildung verwendet; Leistungs-, Abnahme-, Rechnungs-, Zahlungs- und Ledgerübergänge bleiben offen.

Vor einer stabilen T-0069-Abnahme sind unabhängige A03-Fachprüfung des Finanz-/Vertragsübergangs, A09-Re-Review der neuen UI-/Operationspfade und A12 responsive Browser-/Touchprüfung nötig. A08 rechtliche Klassifikation und Rechtsbelege verbleiben beim jeweiligen Vertragssnapshot; die UI macht keine pauschale Werkvertrags-/Abnahmeannahme. Keine neuen Produkt-, Rechts- oder Architekturentscheidungen; keine Schemaänderung.

## A09-Nacharbeit

A09s adversarial Regressionen `prototype/a09-t0069-run-ui-adversarial-regressions.mjs` führten zu zwei fail-closed Korrekturen am UI-Adapter:

- `submitRunOffer` akzeptiert die Kostenart nur bei exakt `variableCost: "true"` oder `"false"`; fehlende oder manipulierte Enumwerte werden vor der Kalkulation abgewiesen.
- `installRunOperatingResources` blockiert die Erfassung, sobald ein Tagesereignis existiert oder ein Tag geöffnet ist. Die Oberfläche blendet das Ressourcenformular ab derselben Grenze aus. Der Anfangsbestand ist damit vor dem ersten Tageslauf einzurichten.

Nachweis: `node prototype/a09-t0069-run-ui-adversarial-regressions.mjs`, `node prototype/a05-t0069-run-ui-regressions.mjs` und `node --check prototype/v3/run.js` erfolgreich. A09-Re-Review ist weiterhin durch A01/A09 gesondert zu bestätigen.

## CP-0290-Nacharbeit: Ressourcen-Gate vor Tag 1

A01 reproduzierte eine Sackgasse: ohne `modules.product` war nach dem ersten Tagesereignis keine spätere Ressourceninitialisierung mehr erlaubt, und der Folgetag blieb gesperrt. Die gemeinsame V3-Run-UI behandelt die Anfangsressourcen nun als notwendige explizite Laufvorbereitung. Der Spielende muss vor Tag 1 Personal, Maschinen, Material, vorhandene Belegungen und Fertigwarenkapazität erfassen und bestätigen. Leere Arrays und 0 sind zulässige, ausdrücklich eingegebene Werte; es werden keine Ressourcen-Defaults erzeugt. Ohne bestätigten Produkt-/Ressourcenstand lässt die UI Tag 1 nicht öffnen, und der Adapter wirft denselben verständlichen Fehler. Mit vorhandener Ressourcenkonfiguration bleiben Folgetage bis zum Enddatum freigeschaltet.

Die A05-Regressionssuite prüft nun sowohl die Abweisung von Tag 1 ohne Ressourcen als auch die Öffnung von Tag 2 nach dem ersten Tagesabschluss. Der A09-Adversarialtest richtet seinen Run vor den Angriffstests mit einem explizit leeren Ressourcenstand ein, damit er weiterhin die verspätete Änderung nach Tagesbeginn prüft. A01-Browser-Retest auf MIME-korrektem Server steht noch aus.

## CP-0291-Nacharbeit: Responsiver Überlauf bei 415 px

A01 meldete im schmalen IAB nach Tag 2 eine horizontale Seitenscrollbar bei 415 px. A05 korrigierte die `main`-Breitenformel auf gültiges `min(1060px, calc(100% - 28px))`, erlaubte Metadaten-Chips und Grid-/Formular-Kindern das Schrumpfen, begrenzte Formularfelder auf ihre Elternbreite und setzte `overflow-x: clip` als Schutz gegen horizontales Viewportscrollen. Run-ID/Szenario-/Seed-Chips können dadurch umbrechen. Simulationslogik blieb unverändert.

Responsive CSS-Assertions wurden in `prototype/a05-t0069-run-ui-regressions.mjs` aufgenommen. Syntaxcheck sowie A05 UI-, A09 adversarial-, Run-Orchestrator- und Product-Lifecycle-Regressionen bestanden; `git diff --check` auf den eigenen CSS-/Testdateien war sauber. Ein Browser-/DOM-Geometriemesswert bei 415 px konnte A05 in diesem Kontext nicht erzeugen; der kontrollierte IAB-Retest durch A01 bleibt erforderlich. Kein Commit/Push.
