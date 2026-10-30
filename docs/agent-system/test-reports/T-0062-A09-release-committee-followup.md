# T-0062 – A09 Release-Committee-Follow-up

**STATUS:** BLOCKED – V2-Freigabe noch nicht erteilt
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR
**AGENT:** A09 – QA / Release Committee
**MASTER GOAL:** MG-002
**SECOND-LEVEL GOALS:** SLG-002.2 / SLG-002.4 / SLG-002.5
**TICKET:** T-0062
**Prüfdatum:** 2026-10-30
**Prüfbasis:** Branch `main`, HEAD `194fbaa7069ef59d1c832164a21b06f1cd2102d`, geänderter Working Tree. Kein Committee-Nachweis ist an einen gemeinsamen Commit gebunden.

## Entscheidung

**Kein Release-Committee-PASS.** G05 und G07 sind materiell erfüllt; CP-0270 ergänzt den Keyboard-Nachweis für die manuelle Arbeitsgangzuweisung und die Responsive-Matrix. G03/G08 sind dennoch nur teilweise PASS, weil kein vollständiger Touchpfad für Kernaktionen nachgewiesen ist. Unabhängig davon verlangt T-0060 sämtliche Gates auf derselben Commitrevision; deshalb kann ein Committee-PASS ohne gemeinsamen Commit nicht erteilt werden.

## Gate-Matrix

| Gate | Ergebnis auf Working Tree | Noch erforderlicher Nachweis |
|---|---|---|
| G01 Spielkreisläufe | **Funktionsnachweis PASS; formal offen**. A09s positive/negative Zustandsmatrix reicht von Anfrage bis Zahlung; 16 Prototypregressionen laufen aktuell mit Exit 0. A03 hat D-0160 fachlich geprüft. | Gesamte Matrix/Regressions und A03-Abgleich nach Sicherung auf gemeinsamem Commit erneut binden. |
| G02 Jahressolvabilität | **PASS auf Working Tree; formal offen.** Jahressmoke erreicht 2028-01-01, 12 Abschlüsse, Mindestliquidität 2.892,16 €, 0 € offene Kosten, keine Reconciliationfehler; Event-Hash `52ea26ea02a5655db7ff83f6d47b49d9622140d3b92934d7417551c61e27434c`. A03 bestätigt den Finanzlauf. | Den exakt gleichen Test und A03-Abzeichnung auf gemeinsamem Commit dokumentieren. |
| G03 Tagesplanung | **Teilweise PASS; offen.** Alle 16 Regressionen bestehen. CP-0270 belegt im Browser eine manuelle Tastaturzuweisung des Arbeitsgangs ORD-002 über die native Tagesauswahl sowie die resultierende Anzeige der manuellen Zuweisung. | Ein vollständiger Touchpfad für die Kernaktion der Tageszuweisung fehlt; mobiler Viewport-Klick ist kein Hardware-Touchbeleg. Nach Abschluss Commitbindung. |
| G04 Zeitarbeit | **Funktionsnachweis PASS; formal offen.** Root hat Buchung, Planungssichtbarkeit, Monatswechsel-/Abrechnungswirkung und Rückgabe im Browser ausgeführt. Rückgabehandlerfehler wurde behoben und durch Regression abgesichert. A03 hat Phase-8-Finanzreview bestanden. | Neuprüfung auf gemeinsamem Commit, insbesondere erfolgreiche Rückgabe und Monatsabschluss. |
| G05 Lernkarten-Kontext | **PASS auf Working Tree; formal offen.** Vollständige Inventur der produktiven Linkaufrufe in `app.js` ergab fünf Hauptkontexte (Aufträge, Personalplanung, Markt/Netzwerk, Finanzen, Lager/Materialfluss), einen Inventarkontext für Investition/AfA sowie ereignisbezogene Lernrückblicke mit stabiler Ereignis-ID als `contextKey`. Die Regression prüft Kontextauflösung für alle UI-Kontextgruppen und stabile Rückkehr-/Fokus-/Scroll-Mechanik. A01 hat im gerenderten Browser aus Inventar → Lernkarte → Zurück denselben Kontextlink „Lager und Materialfluss“ wieder fokussiert; `scrollY` blieb 648 → 648. A01 hat die fünf Hauptkontexte ebenfalls geöffnet und zurückgeführt. | G05 ist materiell erfüllt; nach dem gemeinsamen Commit sind Kontextinventur, Regression und Browserpfade auf derselben Revision erneut zu binden. |
| G06 Übungen/Fragebank | **PASS auf Working Tree; formal offen.** 540-Fragen-Inventur/Validatoren, Tageslimit und Nichtmutation bestehen; Nutzerabnahme D-0159 liegt vor. | Ergebnis an gemeinsamen Commit binden. Inhaltswartung nach D-0159 ist kein neuer Gateblocker. |
| G07 Inventarzugänglichkeit | **PASS auf Working Tree; formal offen.** A05 zeigt Namen und Funktionen dauerhaft sichtbar neben den Icons, sodass Touchbedienung keinen Tooltip erfordert und kein Icon alleinige Informationsquelle ist. Root zählte im Browser 101/101 Ausstattungssymbole mit `aria-label` und `tabindex=0`; `Tab` fokussierte ein `.equipment-icon-wrap` mit sichtbarem 2.4px-`solid`-Fokusumriss. Katalog- und Bestandslabels sind sichtbar; Rohmaterialicons haben zugängliche Beschriftungen. Regressionen prüfen Beschriftungen, Fokusfähigkeit und Fokusstil. | G07-Wortlaut ist auf dem Working Tree erfüllt; nach gemeinsamem Commit erneut an dieselbe Revision binden. Kein eigener Touchhardware- oder Screenreader-Lauf wurde ausgeführt; diese Methoden sind im Kriterium keine zusätzlichen Abnahmepunkte. |
| G08 Responsive Navigation | **Teilweise PASS; offen.** CP-0270 durchlief alle neun Hauptbereiche bei 390×844, 768×1024 und 1280×800. Der bei 768×1024 gefundene Screenreader-Datumstext-Überlauf wurde mit `.timeline-cell { position: relative }` behoben; nach Fix gab es in keiner Kombination Root-Überbreite. Mobile Navigation wurde bei 390 px per Browser-Klick aktiviert, Navigation bei 768/1280 px per Tastatur. | Kernaktionen per echtem Touchpfad sind nicht nachgewiesen; bei 390 px ist nur Browser-Klickaktivierung dokumentiert. Nach Abschluss Commitbindung. |
| G09 Speichern/Wiederherstellen | **Funktionsnachweis PASS; formal offen.** Root führte exakten Roundtrip relevanter Savefelder nach Browser-Neuladen, native v6-Migration, gültiges Backup bei kaputtem Primärstand sowie explizite Recovery bei kaputtem Primär- und Backupstand durch. Beschädigte Originaldaten blieben bis zur bewussten Neustartbestätigung bestehen. | G09-Testnachweis/Regression auf gemeinsamem Commit erneut binden. |
| G10 Offlinepaket | **Technischer Paketbau und A10-Prüfung PASS; formal offen.** Paket wurde nach dem CP-0270-CSS-Fix frisch gebaut. A10 bestätigt Manifest, ZIP-Integrität, Paketinhalt, zehn eingebettete Module, Styles und README. Das Manifest nennt weiterhin `main@194fbaa…` und Working-Tree-Quellen. | Reproduzierbarer Build und Hashprüfung vom gemeinsamen Commit. |
| G11 Konflikt-/Quellengüte | **Kein aktueller blockierender fachlicher Quellenkonflikt nachgewiesen; formal OFFEN.** A08-Quellenreview und A11-Integrationsreview sind vorhanden. A02/A03 haben D-0160 als V2-Finanzkonvention abgeglichen. | A01 muss D-0160 und die P/R-Abgrenzung in der finalen Konsistenzprüfung auf derselben Commitbasis bestätigen; G03/G08 sowie Release Committee selbst bleiben offen. |

## Prüfungen dieses Committee-Follow-ups

- Alle 16 vorhandenen `*regressions.mjs`-Läufe endeten mit Exit-Code 0, einschließlich `t0059-regressions.mjs`, `v2-ui-context-timeline-regressions.mjs` und `v2-phase8-finance-regressions.mjs`.
- `node prototype/year-simulation-smoke.mjs` bestand mit den oben genannten Kennzahlen.
- Browsernachweise G04, G05, G08 und G09 wurden als A01-übermittelte Ausführungsergebnisse bewertet; A09 behauptet keine eigene Ausführung dieser Browseraktionen. CP-0270 ergänzt G03/G08-Nachweise: 27 Bereich-/Viewportkombinationen, kein Root-Überlauf nach Fix, manuelle Keyboardzuweisung von ORD-002. Ergänzender G05-Nachweis: `data-context-key`, fokussierte Rückkehr zum selben Lernlink und Wiederherstellung `scrollY` 648 → 648 im gerenderten Browser; fünf Hauptkontexte getestet, ereignisbezogene Links verwenden Ereignis-/Auftrags-ID.
- G07 stützt sich auf A05s sichtbare Labels/Fokus-CSS/Regressionen sowie A01s Browserprüfung der vollständigen Iconbeschriftung und tatsächlichen Tastaturfokussierung. Dauerhafte sichtbare Namen/Funktionen erfüllen den Touchzugang ohne Tooltip. Kein Touchhardware- oder Screenreaderlauf wurde ausgeführt; beides ist kein separates Kriterium des Gate-Wortlauts.
- A10s letzte G10-Prüfung nach dem CP-0270-CSS-Fix: **PASS auf Working Tree**; Manifest/HTML/README stimmen überein, ZIP-Integrität, exakt drei Einträge und alle zehn Runtime-Module samt CSS geprüft. SHA-256: HTML `242155e0d5da0005f0eed788a8496ab7a366f4e24711cff7f71a6381a312c83d`; ZIP `63d9ac5a286a4b1c7192f1682389c500b38b22765053762a822b350578f61cb1`; Manifest `6ba79bcbfc2042cb8605f6ad1079c84acf52f559e41f34bb2cfc10cc79259e04`; README `d4438ac5253b65fca2ef9adbc460f23838fbfbb11a0c852d7234e96d1c63c49a`.
- `git diff --check` bestand zuvor mit ausschließlich LF/CRLF-Hinweisen. Arbeitsbaum ist weiterhin geändert.
- Kein Commit, Push oder Release ausgeführt.

## Noch offene Blocker für V2-PASS

1. G03/G08: Nachweis der Kernaktionen per Touch bleibt offen; der Arbeitsgang ist per Tastatur zugewiesen worden, Navigation ist in allen Viewports erreichbar.
2. Alle Gates und Paketartefakte müssen auf denselben gesicherten Commit gebunden und nach dem Commit erneut geprüft werden. Ohne gemeinsame Commitrevision kann T-0060 kein Committee-PASS zulassen.
3. A10 hat den nach CP-0270 neu gebauten Paketstand technisch bestätigt; Working-Tree-Provenienz erfüllt die Commitbindung weiterhin nicht.

Kein neuer Produkt- oder Rechtsentscheid wurde getroffen. Architecture V0.2 und ADRs bleiben außerhalb dieses Committee-Auftrags unberührt.
