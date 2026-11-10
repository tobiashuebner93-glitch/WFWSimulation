# A12 Browser-Playtest – L5-Finanzierungsreferenz (CP-0392)

**STATUS:** NONPASS – Finanzierungsreferenz erscheint im normalen Shared-Run nicht
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A12 – BROWSER_PLAYTEST
**MASTER GOAL / SECOND-LEVEL GOALS:** MG-002 / SLG-002.2 / SLG-002.5
**TICKET:** T-0063
**VORGÄNGER:** CP-0391 (A09 Re-Review PASS), CP-0390 (A05 Vorzeichenfix), CP-0389 (A09 initialer NONPASS)
**ENTSCHEIDUNGEN:** D-0022, D-0100–D-0102, D-0163, D-0169
**DATUM:** 2026-11-01

## Umgebung

- Lokale URL: `http://127.0.0.1:8033/prototype/v3/run.html`
- Browser: ChatGPT In-App Browser, temporärer Testtab
- Sichtbarer Desktop-Viewport: 1265 × 713 px
- Startprofil: `V3-RUN-SYNTH-01`, Seed `seed-v3-001`, Pfad UPSWING, 2027-01-04 bis 2027-01-29
- Geprüfte UI-Dateien: `prototype/v3/run.js` SHA-256 `8607F80DF23E9CF7C77C998008F0C8B813459E449DAD30E5C50D443CA85DDD8E`; `prototype/v3/run.css` SHA-256 `712F81D89F509FEA164292BDA85FD0605D711AE0B260DDD612EDEC5C831366E5`
- Produktcode wurde nicht geändert. Spielzustand war ein wegwerfbarer lokaler Browsertab.

## Szenario und Reproduktion

1. URL öffnen und den synthetischen Lauf mit den obigen Startwerten anlegen.
2. Anfangsressourcen ausdrücklich leer übernehmen: Beschäftigte, Maschinen, Material und Belegungen jeweils `[]`; Fertigwarenkapazität und Belegung `0`.
3. Den ersten Simulationstag 2027-01-04 öffnen, ohne Angebot abzugeben.
4. Zur Ansicht **„Konjunktur und Spielpreisindex“** scrollen.
5. Ablauf zusätzlich am ersten Tag schließen und Seite neu laden; den normalen Ablauf einmal wiederholen, um einen veralteten Tabzustand auszuschließen.

## Ergebnis

**Erwartet:** Die Shared-Run-Übersicht enthält eine Finanzierungsreferenz mit MRO „derzeit nicht verfügbar“, dem als Referenz gekennzeichneten D-0022-Korridor und Mittelwert sowie „Individuelle Konditionen: offen (pending)“. Eine Kredit-, Raten- oder Finanzwirkung wird ausgeschlossen.

**Beobachtet:** In der sichtbaren Makroansicht folgt auf den Monatssnapshot (2027-01 · Aufschwung; MRO-Szenarioindikator „nicht verfügbar“) direkt **„Planprojektionen für das Unternehmen“**. Die Karte „Finanzierungsreferenz“, der D-0022-Benchmark und der Pending-Status fehlen. Die allgemeine Fußnote sagt nur, MRO bleibe unverbindlich und begründe keinen Kredit. Das blieb nach Reload und Wiederholung gleich.

Erster Tag und Abschluss funktionierten ohne sichtbaren Runtimefehler. Nach Tagesschluss: Bankbestand 10.000,00 €, Nettoumsatz 0,00 €, offene Forderungen 0,00 €, SimTAX 0,00 €. Keine Rechnung, Zahlung oder Kredit-/Finanzübergabe entstand. Im beobachteten Desktop-Viewport kein Überlauf im Makrobereich.

## Befund

- **Klassifikation:** mittel – neue L5-Referenz ist im normalen Shared-Run für den Spieler nicht sichtbar; A09s Renderer-/Projektionstest deckt die fehlende UI-Bindung des echten Laufs nicht ab.
- **Vermuteter Pfad:** Makro-UI-/Shared-Run-Verbindung zwischen `getRunProjection` und `renderMacroSummary`; A05 ist zuständig. Keine Produktänderung in diesem Playtest.
- **Screenshot:** CUA-Screenshots wurden während der Prüfung angezeigt, aber nicht als Datei exportiert. Sichtbarer Beleg ist der Makro-Monatssnapshot unmittelbar gefolgt vom Planprojektionen-Block.
- **Mobile/narrow viewport:** nicht prüfbar; die verfügbare CUA-API in diesem Agentenlauf stellte keine Viewport-Steuerung bereit. Kein iPhone-/iPad-Browsergebnis.
- **Browserkonsole:** nicht verfügbar.

## Nachweisrollen und Git

- **Ausführung:** A12, tatsächlicher Browserablauf wie oben.
- **Fachreview:** A03 CP-0386 (begrenztes PASS zur Nichtbuchungsgrenze).
- **Unabhängige QA:** A09 CP-0389 initial NONPASS, CP-0391 Re-Review PASS im automatisierten Renderer-/Projektionumfang; dieser Browserbefund ergänzt dessen fehlenden normalen UI-Pfad.
- **Browser-/Gerätetest:** Desktop 1265×713 getestet; Mobile nicht ausgeführt.
- **Git:** HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vor diesem Bericht 313 Status-Einträge im gemeinsamen Arbeitsbaum. Bestehende Änderungen blieben erhalten. `git diff --check` nach Berichtserstellung auszuführen.
- **Commit/Push:** nicht ausgeführt.

## Übergabe an A01

A01 soll den Integrationsbefund an **A05 – FRONTEND** geben: im normalen Shared-Run muss `macroFinancingReference` in `renderMacroSummary` sichtbar werden, einschließlich unavailable/pending Fall, ohne individuelle Verzinsung oder Finanzwirkung. Danach A09 soll den echten Rendererpfad re-reviewen und A12 die Browserprüfung (Desktop und, sofern steuerbar, schmaler Viewport) wiederholen.
