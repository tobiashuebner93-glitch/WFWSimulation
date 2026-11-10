# A03 L5-Finanzreview – indikative MRO-/Neukreditofferte (CP-0386)

**Status:** PASS mit enger Grenze – unverbindliche Offertanzeige ist spezifizierbar; personalisierte Preis-/Vertragsberechnung und Finanzwirkung bleiben offen.
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Datum:** 2026-11-01
**Goal/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063
**Vorgänger:** CP-0385 (A12 Browser-Playtest), fachliche L5-Basis CP-0356
**Prüfbasis:** Decision Log D-0022, D-0100–D-0102, D-0163, D-0169; A03-Finanzübergabe `a03-t0063-v3-makro-finanzuebergabe.md`; A03-Re-Review CP-0356.

## Ergebnis

Ein V3-Bildschirm für eine **unverbindliche indikative Offerte** ist fachlich möglich, sofern er ausdrücklich als Plan-/Verhandlungsinformation gekennzeichnet bleibt. Er darf weder einen Kreditvertrag darstellen noch allein durch Anzeige oder „für Verhandlung angenommen“ eine Auszahlung, Verbindlichkeit, Zinsaufwand, Rate, Cash-/Bankänderung oder Änderung bestehender Kredit-/Dispoverträge auslösen.

Die bereits bestehende CP-0356-Dokumentenprüfung deckt die notwendige Trennung ab: beantragter Betrag und Währung, Laufzeit, Gültigkeit, MRO-Referenz samt Einheit/Stichtag/Quelle/Vintage, Marge sowie nominaler Jahres- und Periodensatz müssen explizit und provenance-gebunden vorliegen. Fehlende oder ungültige Werte bleiben `pending`; ein fehlender Wert darf nicht als Null, Standardzins oder Vertragsbedingung interpretiert werden.

## Entscheidungsabgleich und offene Grenzen

- D-0022/D-0100 bestimmen den individuellen Zins als MRO plus Unternehmensaufschlag; der mittlere Aufschlag ist +3 Prozentpunkte, die genehmigte Spanne +0,5 bis +5,5 Prozentpunkte.
- Die Bewertungsformel, die den konkreten Aufschlag aus Eigenkapitalquote, Bilanzsumme und Zahlungsmoral bestimmt, ist nicht festgelegt. Der Mittelwert ist kein bestätigter individueller Vertragszins und darf nicht stillschweigend für jeden Betrieb als verbindliche Offerte ausgegeben werden.
- D-0101 setzt den jährlichen MRO-Stichtag auf den 1. Januar. D-0102/D-0163 erlauben nach Ende realer Daten einen transparenten, inflationsorientierten V3-Modellpfad; Modellformel, Verzögerung und Unsicherheit gehören zu A02/A08 und sind nicht A03-Finanzparameter.
- Eine Periodenrate lässt sich ohne vereinbarte Laufzeit-, Zinsperioden-, Tilgungs-, Gebühren-, Rundungs- und Fälligkeitsbedingungen nicht aus einer nominalen Jahresrate ableiten. Ein nominaler Jahreszins allein ist kein vollständiger Rückzahlungsplan.
- D-0169s Nachfragewirkung bleibt unverändert; eine indikative Offerte darf weder Anfragevolumen noch Auftragsvergabe beeinflussen.

## Sichere Schnittstelle für eine nächste Implementierungsrunde

A02 kann einen nichtbuchenden Angebots-/Verhandlungszustand vorbereiten, der ausschließlich explizit vorhandene Werte anzeigt und fehlende Parameter sichtbar auf `pending` setzt. Für einen berechneten Zinssatz braucht es entweder eine ausdrücklich als solche markierte, freigegebene Szenarioannahme oder eine festgelegte Spreadformel; für eine Rate und Rückzahlungsfolge zusätzlich bestätigte Kreditbedingungen. Keine dieser fehlenden Vertragsbedingungen ist durch dieses Review festgelegt.

Für Replays müssen Quellserie/-vintage, Run-/Szenario-ID, Angebots-ID, Referenzstichtag, Laufzeit und verwendete Spread-/Terms-Version am Angebotsdatensatz gebunden sein. Gleiches Angebot und gleiche Inputs müssen nach Save/Restore dieselben Werte und denselben Status erzeugen. Reines Öffnen, Anzeigen, Ablehnen oder Ablauf der indikativen Offerte muss alle Finanzzustände bytegleich lassen. Erst eine getrennte, ausdrücklich autorisierte Vertragsannahme samt Finanzereignis darf A03s bestehende Finanzlogik aufrufen; deren Vertragsschluss- und Postingdetails sind nicht Gegenstand dieses Reviews.

## Folgeauftrag an A01

A01 kann A02 mit einem **UI-/Projektionsentwurf für indikative Neukreditangebote** beauftragen: Anzeige nur vollständig belegter/ausdrücklich freigegebener Terms, fehlende Spread-/Rückzahlungsparameter als `pending`, keine Finanzmutation, Save/Restore-Replay und eine unabhängige A09-Prüfung. A03 ist vor jeder Vertragsannahme-/Finanzereignis-Integration erneut mit konkreten Feldern und Beträgen zu beteiligen. A01 muss vor einer individuellen Zinsberechnung entscheiden oder eine Nutzerentscheidung bündeln, ob +3 Prozentpunkte als reiner Szenario-Mittelwert für ein Beispielangebot verwendet werden darf; D-0022 allein macht daraus keinen individuellen Vertrag.

## Nachweisrollen und Verifikation

- **Ausführung:** A03-Fachreview, dokumentarisch/read-only.
- **Fachreview:** A03 (diese Prüfung); keine Kredit- oder Postingfreigabe.
- **Unabhängige QA:** nicht ausgeführt.
- **Tests:** nicht ausgeführt; keine Runtimeänderung.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** Arbeitsbaum/HEAD im verfügbaren Checkout geprüft; zahlreiche fremde lokale Änderungen vorhanden und unangetastet.
- **Whitespace:** `git diff --check` erfolgreich; Git meldet nur LF/CRLF-Konvertierungshinweise.
- **Commit/Push:** nicht ausgeführt.
