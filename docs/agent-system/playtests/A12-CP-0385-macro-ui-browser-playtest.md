# A12 Browser-Playtest – CP-0385

**Status:** PASS im präzisen Scope der lokalen Desktop-Route; eingeschränkte Beobachtbarkeit dokumentiert
**Datum:** 2026-11-01 (Europe/Berlin)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A12 – BROWSER_PLAYTEST
**Goal/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063
**Entscheidungen:** D-0161–D-0169; für diesen UI-Test maßgeblich D-0169
**Vorgänger:** CP-0384 (A09 Re-Review) und CP-0383 (A05 globale Summe)
**Testpaket:** `a12-v3-macro-ui-playtest-cp0385` (isolierter Snapshot; keine Produktdateien geändert)

## Testumgebung und Buildidentität

- URL: `http://127.0.0.1:8033/prototype/v3/run.html` (lokaler Server, laut Auftrag nur localhost)
- Browser: ChatGPT In-App Browser über CUA; Hersteller/Engine-Version nicht exponiert
- Erfasste Bildschirmfläche: 1265 × 713 px laut ausgegebenem Browser-Screenshot; ein dediziertes Viewport-Override war in der verfügbaren CUA-Tab-API nicht verfügbar. Kein mobiles/narrow Viewport-Ergebnis behauptet.
- Lokaler Git-Workspace: `git status` und `HEAD` konnten wegen Dateisystemzugriff auf `C:\Users\Tobia\Documents\GitHub\WFWSimulation` nicht gelesen werden. Deshalb keine Git-Verifikation.
- SHA-256 des isolierten Snapshots; diese drei Hashes stimmten im Paket-Preflight mit dem Produktrepo überein (Hashgleichheit laut Übergabe zusätzlich bestätigt):
  - `prototype/v3/run.html`: `699DEA745FDDF282CA9103EC5804B1859939EE9AC5D8FBC2C1BE47DB68571AEA`
  - `prototype/v3/run.js`: `95831C3A3AB34387FFFAB3747510BF60048783B2D0D822A001CF0A0C904682A4`
  - `prototype/v3/run.css`: `AC1049FD0FA90481DBCCDE1D716C275053F65E92A187471C9C6A97980B1307A3`
- Run-ID: `V3|V3-RUN-SYNTH-01|seed-v3-001|2027-01-04|UPSWING`
- Profil/Seed/Zeitraum: Aufschwung (UPSWING), `seed-v3-001`, 04.01.2027–29.01.2027. Anfangsressourcen ausdrücklich als leere Arrays/0 eingetragen.

## Beobachtungen und Ergebnisse

### S1 – Frische Route, neutraler Zustand

**Schritte:** Route frisch laden; vor Runstart Überschrift, Setup und Seitenfluss ansehen.

**Erwartet:** Kein vorgetäuschter Lauf-/Makrozustand; sichtbare Profil-, Seed- und Datumseingaben; klare Kennzeichnung der synthetischen Annahmen.

**Beobachtet:** „Unternehmen im Tageslauf“ und „Lauf starten“ sind klar hierarchisiert. Defaultprofil Aufschwung, Seed und Zeitraum sind ausgefüllt. Ein gelber Hinweis sagt ausdrücklich, Marktprofile, Wettbewerbswerte und Anfragen seien synthetisches Test-Fixture und keine beobachteten Preise/Prognose. Vor Start ist kein Makro-Monatssnapshot vorhanden. Es gab keine sichtbare Layout- oder Textüberlagerung im initialen Desktopbild; der Startbutton liegt unterhalb des ersten Viewports und ist durch normales Scrollen erreichbar.

**Ergebnis:** PASS.

### S2 – Erster Tag und Makro-Monatssnapshot

**Schritte:** Standardprofil starten; Anfangsressourcen als `[]`, `[]`, `[]`, `[]`, Fertigwarenkapazität `0`, belegte Kapazität `0` übernehmen; 04.01.2027 öffnen; Makroübersicht ansehen; Tag abschließen.

**Erwartet:** Tagesereignis und Monatssnapshot erscheinen; L2/L4 ohne passende Exposition bleiben inaktiv; keine Buchungsbehauptung; Makroansicht bleibt verständlich.

**Beobachtet:** Start erfordert die ausdrückliche Ressourcenübernahme. Beim Öffnen des ersten Tages entstanden ein Monatssnapshot `2027-01 · Aufschwung` und ein Anfrageereignis. Der Snapshot zeigt Spielpreisindex 100.00, Aktivitätslücke 1.00 %, Momentum 0.50 %, D-0169-Faktor 1.010, sechs Anfragen für die Woche ab 2027-01-04 bei Basis 5 und Exposition 1.00. Quelle ist `synthetic_fixture`; Text erklärt, dass dies eine synthetische, nicht empirisch kalibrierte Annahme ist und nur die Anfragezahl verändert.

Die globale Übersicht blieb `0 gesamt / 0 wirksam / 0 pending / 0 nicht angezeigt`; L2, L3/L6 und L4 zeigten je null Einträge. Der Text „Keine aktive Exposition/keine Projektionswirkung“ und der separate Hinweis, MRO begründe keinen Kredit, waren sichtbar. Die Projektions-Erklärung grenzt FX/BICI/WagePlanIndex/ProcurementPlanIndex von Geldbetrag, Istkosten, BAB und gebuchter Wirkung ab. Finanzübersicht nach Tagesabschluss: Bank 10.000,00 €, Nettoumsatz 0,00 €, offene Forderungen 0,00 €, SimTAX-Verbindlichkeit 0,00 €. Keine Szenario-Rechnung, Zahlung oder offene Finanzübergabe. Das Run-Protokoll listete Tagesergebnis, Marktabschluss, Marktöffnung/-anfragen, Schedule und Makro-Monatsereignis.

Die lange Erläuterung ist sprachlich dicht, war in der erfassten Desktopansicht jedoch lesbar und umgebrochen; kein horizontaler Überlauf oder abgeschnittener Makrotext beobachtet.

**Ergebnis:** PASS für diesen Standardfixture-Zustand. Aktive L2/L4-Effekte und beobachtete Quellen waren auf normalem Nutzerpfad in diesem Run nicht verfügbar; deshalb wird deren Darstellung nicht als Browser-geprüft ausgegeben. A05s isolierte aktive/pending Regressionen sind ein separater Nachweis.

### S3 – Laufzeitbeobachtung und Umfang

Der erste Simulationstag wurde geöffnet und abgeschlossen. Der erzeugte Makro-Monatssnapshot belegt den geforderten ersten Monatssnapshot; kein weiteres Vorspulen war für diesen begrenzten Scope erforderlich. Es wurde keine vollständige Monats- oder Jahreswirtschaft behauptet.

- Sichtbare Runtimefehler: keine beobachtet.
- Browserkonsole: nicht auslesbar über die für diesen CUA-Tab verfügbare Oberfläche; daher **keine** Aussage „Konsole fehlerfrei“.
- Schmaler/mobile Viewport: nicht ausgeführt; kein unterstützter Viewport-Schalter verfügbar.
- Screenshots: Ausgangsscreen sowie Lauf-/Tagesabschluss wurden in der CUA-Session visuell erfasst. Ein Screenshot-Dateipfad konnte mit den verfügbaren Browserwerkzeugen nicht exportiert werden.

## Nutzer-Wiedereinstieg

Öffne `http://127.0.0.1:8033/prototype/v3/run.html`, wähle Aufschwung, Seed `seed-v3-001`, Zeitraum 04.01.2027–29.01.2027, starte den Lauf, übernimm als Anfangsressourcen vier leere Arrays und zwei Nullen, dann öffne den ersten Simulationstag. Der Snapshot erscheint direkt unter „Konjunktur und Spielpreisindex“. Der Lauf bleibt laut UI nur im aktuellen Browsertab und wird beim Neuladen nicht gespeichert; der Testzustand ist daher durch diese Schritte neu herzustellen.

## Klassifikation und Rollen

- Defekt: keiner im ausgeführten Scope; keine Behebung vorgenommen.
- Browser-/Gerätetest: A12, PASS Desktop-Route bei 1265 × 713 px; narrow/mobile nicht ausgeführt.
- Fachreview: nicht ausgeführt (keine Fachregeländerung).
- Unabhängige QA: A09 CP-0384 separat; nicht durch diesen Playtest ersetzt.
- Git-Verifikation: nicht verfügbar (Workspacezugriff verweigert); kein Commit/Push ausgeführt.
- Jahres-/Finance-/Releasefreigabe: nicht geprüft und nicht behauptet.
