# T-0062 – A01 G08-Kernaktionsmatrix

**STATUS:** G08-Kernaktionspfade PASS auf Working Tree; Commitbindung offen  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A01 – MASTER_ORCHESTRATOR  
**GOAL/TICKET:** MG-002 / SLG-002.2, SLG-002.4, SLG-002.5 / T-0062  
**Prüfstand:** `main@194fbaa7069ef59d1c832164a21b06f1cd2102d` plus geänderter Working Tree; kein Commit/Push

## Methode und Isolation

Microsoft Edge headless, isoliertes Profil und aktuelles Offlinepaket `prototype/werkstatt-v2-iphone.html`; CSS-Viewport 390×844. Für Touch wurden `touchStart`/`touchEnd` über Edge DevTools Protocol `Input.dispatchTouchEvent` ausgelöst und der getroffene DOM-Knoten protokolliert. Tastaturpfade verwendeten echte Tab-Navigation bis zum fokussierten Ziel und Enter. Für jeden der sieben Szenarien wurde der frische Spielstand im isolierten Profil zurückgesetzt. Die Finance-Fixture bestätigte den Dialog zur Ablösung ausschließlich innerhalb dieses Wegwerf-Spielstands. Nutzerspielstand, offene Browser-Tabs, Produktdaten und externe Dienste blieben unberührt.

## Ergebnisse

| Kernbereich / Aktion | Touch | Tastatur | Beobachteter Ergebniszustand |
|---|---|---|---|
| Aufträge – Angebot einreichen | PASS | PASS (Tab 23 + Enter) | `ORD-OFFER-01` steht auf `ANGEBOT_EINGEREICHT`; eingereichter Nettopreis 15.000 €. Die Auftragskarte zeigt den eingereichten Preis und die offene Kundenentscheidung. |
| Finanzen – Maschinenrate vorzeitig ablösen | PASS | PASS (Tab 14 + Enter) | Im isolierten Fixture sinkt Maschinendarlehen von 100 € auf 0 €; Bestätigung sichtbar. |
| Markt – Marketingkampagne starten | PASS | PASS (Tab 12 + Enter) | Kampagne `targeted` wird gespeichert; Bestätigung sichtbar. |
| Postfach – ungelesene Nachricht öffnen | PASS | PASS (Tab 9 + Enter) | `MSG-UNREAD-01` wechselt zu gelesen; Nachrichtendetail ist geöffnet. |
| Standort – Objektkarte auswählen | PASS | PASS (Tab 30 + Enter) | `selectedSite` wird auf `site-2` gesetzt; Standortdetails erscheinen. Es wurde weder gemietet noch umgezogen. |
| Lager – Baumarkteinkauf planen | PASS | PASS (Tab 11 + Enter) | Einkaufsblock `BAUMARKT_EINKAUF` mit 1 Arbeitsstunde wird angelegt; Rohmaterial bleibt bis Abschluss der Arbeit unverändert. |
| Lernen – Übungsrunde starten und antworten | PASS | PASS (Tab 10 + Enter; Antwort ebenfalls per Tab + Enter) | Eine Antwort ist vorgemerkt (`1/9 beantwortet`, `aria-pressed=true`); keine Betriebs-/Finanzmutation. |

Alle 14 Touch-/Tastaturpfade bestanden mit Zustandsassertion. Die JSON-Messwerte und Trefferpunkte stehen in [G08-Matrixdaten](T-0062-A01-g08-core-action-matrix.json). Screenshots je Pfad: `T-0062-g08-{touch|keyboard}-{offer|finance|marketing|mailbox|site|procurement|learning}.png`.

**Anmerkung zum Angebotsscreenshot:** Ein zusätzlicher explorativer `includes('Angebot eingereicht')`-Textvergleich war wegen abweichender UI-Formulierung `Dein Angebot über … ist eingereicht` falsch positiv markiert; er war nicht Teil der `ok`-Assertion. Der gespeicherte Status/Preis wurde erfolgreich geprüft. Der Screenshot bestätigt die sichtbare Auftragskarte und Toast.

## Gefundener und behobener Produktfehler

Der erste Marketing-Touchlauf löste in `app.js` `ReferenceError: activateMarketingCampaign is not defined` aus. A05 bestätigte den fehlenden Named Import aus `engine.js`, ergänzte nur diesen Import, fügte eine Handler-/Engine-Regression hinzu und baute das Offlinepaket neu. Keine Kampagnenregel wurde geändert. Nach dem Fix bestanden Touch- und Tastaturpfad sowie alle 16 vorhandenen Regressionen und der 365-Tage-Jahressmoke erneut.

## Gate und Grenzen

G08-Kernaktionen außerhalb der Planung sind auf dem Working Tree nun materiell PASS. G03 bleibt gemäß CP-0271 materiell PASS. Diese Matrix ergänzt die bestehenden Navigation-/Viewport-/Planungsnachweise aus CP-0270/0271; sie ist kein physischer iPhone-/iPad- oder Safari-Test. Das Release-Committee muss die Matrix unabhängig bewerten und G01–G11 nach Sicherung an die gemeinsame Commitrevision binden. Bis Commitbindung, Paketprüfung und finaler A09-Committee-Entscheid abgeschlossen sind, bleibt V2 nicht releasefreigegeben.
