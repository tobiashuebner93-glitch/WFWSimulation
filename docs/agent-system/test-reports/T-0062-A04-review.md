# T-0062 – A04 Persistenz-/Migrationsreview (G09)

**STATUS:** A04-Review abgeschlossen; G09 bleibt OFFEN  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A04 – DATABASE  
**MASTER GOAL:** MG-002  
**SECOND-LEVEL GOALS:** SLG-002.2 / SLG-002.5  
**TICKET:** T-0062  
**Vorgängerstand:** CP-0265 / CP-0266  
**Prüfprovenienz:** `main`, HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`; Working Tree war geändert (lokale T-0057–T-0061-Arbeit und CP-0261–CP-0266). Kein Commitbezug.

## Prüfumfang und Ergebnis

G09 verlangt exakten Roundtrip der fachlich relevanten Save-Felder (Datum, Finanzen, Aufträge, Arbeitspläne, Inventar, Lernfortschritt, Nachrichten), Migration aus der unterstützten Vorversion und eine Recovery beschädigter Saves ohne stilles Überschreiben.

**G09: OFFEN.** Der Code bietet sichtbare Save-/Load-Aktionen, exportiert den vollständigen Zustand `state` als JSON und akzeptiert Saveversionen 2–7. `parseSaved` migriert Spiel- und Finanzteil und legt Defaults für hinzugekommene Felder an. Der lokale Ladepfad kopiert einen ungültigen Primärsave einmalig in einen getrennten beschädigten Eintrag, versucht den Backup-Save zu laden und setzt einen Recovery-Modus. Solange Recovery aktiv ist, unterdrückt `save()` automatische Schreibvorgänge; die UI zeigt getrennte Aktionen zur Wiederherstellung bzw. zum Start eines neuen Spiels. Das entspricht dem beabsichtigten Schutz gegen automatisches Überschreiben im Codepfad.

Es existiert jedoch kein gezielter automatisierter oder aktueller interaktiver Test, der `app.js`-Save-/Load-Integration über alle genannten Felder byte-/wertgenau vergleicht, Versionsmigration am realen `parseSaved`-Einstieg durchführt und Recovery mit gültigem/ungültigem Backup einschließlich unveränderter beschädigter Originaldaten belegt. Die bestehenden Regressionen testen einzelne Domänenmigrationen, nicht diesen vollständigen Persistenzvertrag. Der frühere Browser-/Recovery-Nachweis in T-0047/CP-0257 ist ein älterer manueller Beleg, kein aktueller A04/A09-Nachweis auf dem geprüften Arbeitsbaum.

## Ausgeführte Kontrollen

- `node prototype/t0020-regressions.mjs` – **PASS**; Finanzmigration, Dunning/Retry und Zahlungs-/Steuerfälle.
- `node prototype/profile-equivalence-regressions.mjs` – **PASS**; Spielzustandsmigration und Startprofil-Erhalt, aber kein Save-Roundtrip.
- `node prototype/playtest-fixes-regressions.mjs` – **PASS**; Legacy-Kompatibilität und Personal-/Finance-Regressionen, aber kein Save-Roundtrip.
- Statische Prüfung `prototype/app.js`: JSON-Export/-Import, Saveversionen 2–7, Backup-/Recovery-Modus, Recovery-Banner/-Aktionen und Schreibunterdrückung bei `recoveryMode` nachvollzogen.
- Preflight: `AGENTS.md`, Agentenstruktur, Rechtekarte, Goals, Ticketboard, Collaboration State, Decision Log, G09-Zielkarte und Datenmodell gelesen. A04 darf logische Anforderungen/Migration validieren; keine Schema- oder Architekturfreigabe erteilt.

## Rollen- und Freigabegrenzen

| Nachweisart | Ergebnis |
|---|---|
| A04-Fachreview | durchgeführt; siehe Befund oben |
| Unabhängige QA (A09) | nicht Teil dieses A04-Berichts; separat erforderlich |
| Browser-/Geräteprüfung (A12) | nicht ausgeführt; separat erforderlich |
| Datenbankschema-/Architekturfreigabe | nicht erteilt und nicht Teil des Auftrags |
| Git-Verifikation | HEAD und Working-Tree-Zustand zu Beginn aufgenommen; kein Commit/Push |

## Nächster nötiger Nachweis

A09 sollte einen testbaren Persistenzpfad ergänzen oder vorhandenen UI-Test nutzen, der einen vollständig befüllten Spielzustand exportiert, neu lädt/importiert und alle G09-Felder vergleicht; zusätzlich Migration der unmittelbar unterstützten Vorversion und Recovery mit beschädigtem Primärsave bei gültigem sowie ungültigem Backup prüfen. A12 soll die Recovery-Auswahl im Browser bedienen. Bis diese Nachweise auf demselben Release-Commit vorliegen, darf G09 nicht auf PASS gesetzt werden.
