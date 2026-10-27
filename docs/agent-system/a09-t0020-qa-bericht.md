# A09 – QA-Bericht T-0020

Datum: 2026-10-27\
Adressat: A01 – MASTER_ORCHESTRATOR\
Agent: A09 – QA\
Goal/Ticket: MG-000 / SLG-000.2 / T-0020

## Testausführung

- `node --check prototype/engine.js`: bestanden.
- `node --check prototype/finance.js`: bestanden.
- `node --check prototype/app.js`: bestanden.
- `node --check prototype/t0020-regressions.mjs`: bestanden.
- `node prototype/t0020-regressions.mjs`: bestanden. Same-Day-Kette; qualifizierte Vorsteuer und Monatsguthaben; +10-/+14-Tage-Mahntermine; Zahlung vor späterer Mahnung; Niederlage nach acht wöchentlichen Retries; Migration einer V5-Finanzstruktur zu V6.
- `node prototype/year-simulation-smoke.mjs`: bestanden bis 01.01.2028, 12 Monatsabschlüsse, drei Startaufträge geschlossen, 23 Marktchancen, 10 erzeugte Folgeaufträge, 11 Lieferungen, Cash-Endbestand 6.644,72 €, keine Abstimmungsfehler, Bestand nicht negativ.

## Statische UI- und Recovery-Prüfung

- `prototype/index.html` enthält den viewport meta tag mit `viewport-fit=cover`.
- Mobile Breakpoints in `prototype/styles.css` ordnen Recovery- und Game-over-Banner unter 620 px in eine Spalte; die bestehende Touch-Navigation ist auf kleinen Ansichten fixiert.
- `prototype/app.js` erhält beschädigte Primärdaten separat, hält Speichern bis zur Auswahl an, lädt wenn möglich das letzte gültige Backup und bietet Wiederherstellung oder bewussten Neustart an. Die Finance-Ansicht zeigt Dunning-Fristen, Retry-Zähler und getrennte SimTAX-Ausgangs-/Vorsteuerwerte.
- Ein interaktiver Browserlauf und die Bedienung auf einem realen Mobilgerät wurden in diesem Ticketlauf nicht durchgeführt. UI-Funktion ist daher nur durch statische Prüfung, Syntaxkontrolle und bestehende Engine-Smokes gestützt.

## Einschränkungen

Mit freigegebenem lokalen Git-Lesezugriff liefen `git status --short --untracked-files=all` und `git diff --check` erfolgreich. Git meldete nur die konfigurierte LF-zu-CRLF-Konvertierung bei Bestandsdateien; Whitespace-Fehler wurden nicht ausgegeben. HEAD ist `62dbc71` auf `main`. Der Arbeitsbaum enthält bestehende lokale Änderungen, einschließlich der umfangreichen ungetrackten Prototyp-/Checkpoint-Dateien; sie wurden erhalten. Commit oder Push fand nicht statt.

Eine lokale `localStorage`-Beschädigungs-/Recovery-Interaktion wurde nicht im Browser simuliert. Die Oberfläche und Recovery-Pfade wurden im Code geprüft; ihre tatsächliche Bedienbarkeit ist manuell zu verifizieren.
