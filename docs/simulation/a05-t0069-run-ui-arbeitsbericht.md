# A05 – T-0069 Run-Oberfläche

**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Ticket:** T-0069  
**Ergebnis:** UI-Implementierung erstellt; Angebotsabgabe wartet auf die interaktive A02-Tages-API.

## Umsetzung

Unter `prototype/v3/` wurde eine mobile, barrierearm bedienbare gemeinsame Run-Oberfläche ergänzt:

- `run.html`, `run.css`, `run.js`: expliziter Szenario-, Seed- und Datumsbereich; ein Button führt genau einen Tag über `createV3Run`, `advanceV3RunDay` und `validateV3RunState` aus.
- Marktpostfach, anonymisierter Wettbewerbs-Monatsbericht, angenommene Kundenaufträge, Finanzhandoffs und Ereignisprotokoll beziehen ihre Daten ausschließlich aus demselben Run-Zustand. Marktdaten sind deutlich als synthetisches Test-Fixture gekennzeichnet.
- Aufträge zeigen sichtbar `awaiting_operational_plan`; Finanzeffekte bleiben `pending_non_posting`. Das UI erzeugt keine eigene Arbeitsplanung und keine Buchung.
- Angebotsabgabe bleibt gesperrt, bis A02 die Tag-öffnen/Angebot-abgeben/Tag-schließen-Schnittstelle bereitstellt. Die aktuelle API verarbeitet einen Tag atomar; deshalb kann die Oberfläche neue Anfragen nicht sicher vor Tagesabschluss zur Eingabe anbieten. A03-Kalkulationsfunktionen und Snapshots sind noch nicht in diesen Ablauf eingebunden.
- Rechtliche Grenzen sind sichtbar: Vertragsart und Abnahmebedingungen sind szenarioabhängig; Kundenzusage, Leistung, Lieferung, Bestellerabnahme, Rechnung und Zahlung sind getrennte Vorgänge; die Finanzanzeige ist vereinfachte Spiel-KLR ohne HGB- oder Steuerabbildungsanspruch.

Die Oberfläche hält einen einzigen Run-Zustand im Arbeitsspeicher des Tabs. Ein Reload setzt den Lauf zurück. Es wurde keine Persistenz, kein Schema und kein Framework hinzugefügt. Es wurde keine Änderung an A02-/A03-Laufzeitdateien vorgenommen.

## Prüfungen

- `node --check prototype/v3/run.js` – bestanden.
- `node --check prototype/v3/a05-t0069-run-ui-regressions.mjs` – bestanden.
- `node prototype/v3/a05-t0069-run-ui-regressions.mjs` – bestanden. Geprüft werden API-Verkabelung und State-Validierung, expliziter synthetischer Run, Datumsvalidierung, Ein-Tages-Fortschritt ohne Mutation des Eingabestands, Wochenplanung, sichere Player-Projection ohne Wettbewerberdaten, leere/offene Auftrags- und Finanzzustände, HTML-Escaping, Wartestatus sowie responsive-/Fokusregeln.
- Kein interaktiver Browser-Review und kein Release-/Jahreslauf wurden durchgeführt; diese Abnahme bleibt für A12 bzw. den übergeordneten Review offen.
- Git-Status und `git diff --check` konnten in der Umgebung nicht verlässlich erhoben werden: `git status` meldete „not a work tree“; der explizite Wechsel in den zugewiesenen Checkout war mit „Zugriff verweigert“ blockiert. Andere Agentenänderungen wurden nicht absichtlich verändert.

## Übergabe an A01

Bitte die Angebotsinteraktion erst integrieren, wenn A02 die finale interaktive Tages-API und ihren Aufrufvertrag gemeldet hat. Danach sind A03-Kalkulation und unveränderlicher Angebotssnapshot an diese API anzuschließen. A12 soll die neue Route auf Mobil- und Desktopdarstellung prüfen.
