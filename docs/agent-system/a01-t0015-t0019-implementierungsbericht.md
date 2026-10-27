# A01 – T-0015 bis T-0019 Umsetzungsbericht

Datum: 2026-10-27\
Goal: MG-000 / SLG-000.2\
Koordination: A01 führt A02/A03/A05/A08/A09-Arbeit gemäß Nutzerauftrag selbst aus.

## Ergebnis

- **T-0015:** Tageszahlfolge zentralisiert: Kundeneingänge und Disporückführung, Maschinenrate, priorisierte offene Betriebskosten, fest terminierte SimTAX, tägliche Dispozinsberechnung. Manuelle Dispoziehung bleibt eine gesonderte Fehlbetragszahlung. Spielerpriorität sortiert offene Kosten-Retries.
- **T-0016:** Angebote sind vor Ressourcenbindung verhandelbar und annehm-/ablehnbar. Nettoangebot und Zahlungsziel bleiben auf dem Auftrag gespeichert. UI zeigt Material, Arbeit, Gemeinkostenannahme, Deckungsbeitrag, Marge, SimTAX und Brutto. Der Vorschlag nutzt Material plus modellierte Direktarbeit und Gemeinkosten mit einer 20-%-Zielmarge, begrenzt durch einen synthetischen Marktanker.
- **T-0017:** Basis-, Kostenstress- und Entlastungsszenario hinzugefügt. Marktindizes werden vom datierten Händlerpreisstand getrennt gehalten und ab 2028 monatlich fortgeschrieben. Stressraten beruhen auf historischen Destatis-PPI-Größen als Sensitivitätsannahmen, nicht als Prognosen.
- **T-0018:** Monatsabschluss erweitert um Cashflow-Reconciliation, operative Kosten, Materialverbrauch, SimTAX-Fälligkeit/Zahlung, Finanzierung und Zinsen. Jahr-Smoke liefert keine Cash-Reconciliation-Fehler.
- **T-0019:** Auftragspriorität wirkt bei der deterministischen Planung. Auftragskarten zeigen Lieferziel, Fortschritt und Wirtschaftlichkeit. Verspätung senkt Ruf/Kundenbeziehung nach einer gedeckelten Szenarioformel. Nach Ablehnung kann einmalig nachgearbeitet oder storniert werden; bereits entstandene Kosten bleiben bestehen.

## Geänderte Dateien

- `prototype/app.js`
- `prototype/engine.js`
- `prototype/economics.js` (neu)
- `prototype/finance.js`
- `prototype/styles.css`
- `prototype/year-simulation-smoke.mjs`
- `prototype/V1-MODELL.md`
- `docs/agent-system/ticket-board.md`
- `docs/agent-system/collaboration-state.md`
- `docs/agent-system/decision-log.md`
- dieser Bericht und `docs/agent-system/checkpoints/CP-0185.md`

## Prüfungen

- Node-Syntaxprüfung für `engine.js`, `finance.js`, `economics.js`, `app.js`: bestanden.
- `prototype/year-simulation-smoke.mjs`: bestanden, 12 Monate bis 01.01.2028, 23 Marktchancen, 10 Lieferungen/geschlossene Aufträge, alle drei Startaufträge vollständig bezahlt und geschlossen, keine Reconciliation-Fehler. Gezielte Regressionen decken D-0129, Priorität, Angebot, Abnahmeablehnung/Nacharbeit/Stornierung, Verspätung sowie Marktpfade ab.
- Browser-UI und mobile Ansicht wurden in diesem Lauf nicht visuell bestätigt: die Computer-Use-Umgebung konnte die Browser-URL nicht sicher bestimmen; lokaler HTTP-Zugriff war aus der Shell nicht verfügbar. Die UI wurde nur statisch anhand des Codes geprüft.
- Vorhandene lokale Änderungen und ungetrackte Dateien blieben erhalten. Kein Commit und kein Push.

## Modellgrenzen und nächste sinnvolle Arbeit

- Marktanker und Preise sind Spielwerte, keine Live-Marktdaten oder verbindlichen Angebote. Szenario-Margen ersetzen keine vollständige BAB-/Auftragskalkulation.
- Verspätungs-, Storno- und Beziehungsfolgen sind V1-Szenarioeffekte, keine Vertragsstrafen oder Rechtsfolgen.
- SimTAX bleibt simuliert; fest terminierte Zahlung wird nach priorisierten Betriebsposten versucht, ohne Anspruch auf eine vollständige steuerrechtliche Rang- oder Verfahrenslogik.
- Als nächstes sollte die spielbare Browseroberfläche manuell auf Mobilgerät und Desktop geprüft werden; danach können aus den Spielergebnissen Parameter für eine weitere Modellrunde abgeleitet werden.
