# A12-Browsercheck – T-0043 / T-0041

**Datum:** 2026-10-29
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Rolle:** A12 BROWSER_PLAYTEST (durch A01 selbst ausgeführt, kein unabhängiger Agentenlauf)
**Buildbasis:** lokaler Checkout nach T-0043-Arbeiten; statischer ESM-Prototyp
**Test-URL:** `http://127.0.0.1:8020/prototype/#dashboard`
**Profil:** eigener localhost-Port / eigener Origin, ohne Import oder Zugriff auf Browser-Speicher der anderen Test-URLs; Initialzustand, 01.01.2019.

## Prüffälle

1. **Dashboard Start / Mobilansicht:** Seite geladen; Startdatum, Finanz-/Kapazitätsübersicht und Tagesfrage sichtbar. Die untere Bereichsnavigation bleibt im schmalen Browserfenster sichtbar. Horizontaler Scroll in der Navigation zeigt die späteren Bereiche; „Standorte“ wurde darüber geöffnet. Logo/Übersicht kehrt zurück. Screenshot der Lernansicht und der Übersicht wurde im Taskverlauf aufgenommen.
2. **Lernbereich:** Navigation „Lernen“ geöffnet. Prüfungsmodus zeigt 540 Fälle, alle neun Bereiche mit je 60; Frage, Schwierigkeitsstufe, Antwortoptionen und Kompetenzbezug sind zugänglich.
3. **Logo-Rückweg:** Logo/Startseitenlink in der Lernansicht geklickt; URL wechselte zu `#dashboard` und Dashboard wurde angezeigt.
4. **Spielstandschutz:** Test lief auf `127.0.0.1:8020`, nicht auf dem vorhandenen Nutzer-Origin. Es wurde kein persönlicher Spielstand importiert, ersetzt oder exportiert. Die isolierte Herkunft ist der Schutzmechanismus; kein Fehlerzustand wurde als importierbare Fixture angelegt.
5. **Speichern/Laden:** Beide Steuerelemente waren im schmalen Layout in der Kopfzeile sichtbar. Der Dateiimport selbst wurde nicht ausgelöst, damit kein vorhandener Save selektiert werden musste.

## Ergebnis

Kein blockierender visueller oder funktionaler Fehler im geprüften Pfad. Der direkte Handoff ist die Dashboard-URL oben; der frische Origin startet mit 0/5 beantworteten Fragen, 0/540 Übungsfällen und dem 01.01.2019-Profil. Die rechte Navigationshälfte ist per horizontalem Scroll erreichbar. Spiel- und Speicherdaten bleiben lokal im Browser-Origin. Für einen reproduzierbaren Fehlerzustand wäre ein separates QA-Fixture erforderlich; dieses Ticket hat kein Fixture-Format freigegeben.

**Grenze:** Der Test ist ein kurzer explorativer Browsercheck im engen Viewport, keine vollständige Geräte-/Screenreader-Matrix und kein vollständiger Import-/Export-End-to-End-Test. Browser-Screenshots sind im Taskverlauf sichtbar; sie wurden nicht als Repository-Dateien gespeichert.
