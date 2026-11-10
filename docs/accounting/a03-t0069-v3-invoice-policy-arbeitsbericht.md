# A03 – T-0069 V3-Rechnungsvorschau nach D-0165

**Status:** begrenzte, nichtbuchende Rechnungs-/Fälligkeitsvorschau ergänzt; Run-Integration offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**V3-Profil:** Szenariostart 2027-01-04; V1-/V2-Profile unverändert  
**Entscheidungsbezug:** D-0013–D-0017, D-0053–D-0055, D-0157, D-0161, D-0162 und D-0165  
**Vorgänger:** CP-0316 (ENTWURF)  
**Gitbasis laut Preflight:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche bereits vorhandene Änderungen bleiben erhalten.

## Preflight

Gelesen wurden Root-`AGENTS.md`, Agentenstruktur und Rechtematrix, MG-002-Ziele, Ticket Board, Collaboration State, Decision Log einschließlich D-0165, CP-0313 bis CP-0316, V3-Run-Choreografie und F3-Bericht, A03-Blocker-/Runtime-/Handoff-Berichte, Finanzspezifikation, P0-Finanzprüfung und Rechtsrahmenregister. Der Ticketstand T-0069 ist `IN_PROGRESS`; V3-Startdatum 2027-01-04. `git status` zeigte umfangreiche lokale Änderungen und ungetrackte Arbeiten mehrerer Agenten. Keine fremde Änderung wurde entfernt oder überschrieben.

## Nutzerregel und Umsetzung

D-0165 setzt die vorläufige 19-%-Komponente bis V5 für explizit steuerpflichtige V3-Positionen sowie 14 Kalendertage für Kunden- und Lieferantenposten fest. D-0162 hält den Angebotswert `R` netto. Der bestehende Anker, Ankertagszählung und Wochenendshift bleiben unverändert; D-0013–D-0017 entscheiden den jeweiligen fachlichen Anker. Die Rechnungsfähigkeit und der Zeitpunkt der Rechnungsausstellung sind dadurch nicht festgelegt.

`calculateV3InvoiceTerms` wurde der isolierten A03-Finance-Runtime als reine Vorschaufunktion hinzugefügt. Sie verlangt eine nichtleere, explizite Positionsliste mit stabil eindeutigen IDs, Nettocentbeträgen und einem booleschen Steuerstatus je Position sowie einen expliziten Datumsanker. Für steuerpflichtige Positionen berechnet sie 19 % und rundet je Position kaufmännisch auf Cent (D-0053–D-0055); nichtsteuerpflichtige Positionen erhalten 0 Cent. Die 14-Tage-Frist zählt den Ankertag als Tag 1; Wochenendfälligkeiten verschiebt die Funktion auf Montag. Ergebnis enthält Netto-, SimTAX- und Bruttosummen, Fälligkeit und `postingEffect: none`.

Der Helper klassifiziert keine Positionen steuerlich, bestimmt keinen Rechnungs-/Leistungszeitpunkt, erstellt keine Rechnung, Forderung oder Steuerschuld und bewegt kein Cash. Der zuvor vorhandene `recordV3Invoice`-Pfad bleibt bewusst fail-closed, solange A02 keine belegten Invoice-Ereignisse und die Finance-Runtime keine getrennte Netto-/Brutto-/Steuerbilanz unterstützt.

## Rechtliche Einordnung

Der amtliche §12 UStG nennt 19 % als allgemeinen Satz für steuerpflichtige Umsätze; §19 UStG enthält eine Kleinunternehmerregelung. D-0165 ist daher nur eine ausdrücklich vereinfachte V3-Szenarioregel. Kleinunternehmerstatus, Steuerbefreiungen und abweichende Steuersätze sind in dieser Vorschau nicht modelliert. Rechtsrahmenregister und V5 müssen diese Grenzen erneut prüfen. Dies ist keine Rechts-/Steuerberatung oder Rechtskonformitätsfreigabe.

## Prüfungen und Grenzen

- **Ausführung:** A03 ergänzte pure Vorschau und persistente Regressionsfälle.
- **A03-Eigenreview:** PASS für explizite Eingaben, Cent-/Summenrechnung, inklusive 14-Tage-Zählung, Wochenendshift, immutables Ergebnis und keine Postingwirkung.
- **Unabhängige QA:** nicht ausgeführt; A09-Re-Review erforderlich.
- **A02-Fachreview:** nicht ausgeführt; die Run-Schnittstelle muss echte Positions-, Taxstatus-, Invoice- und Ankerdaten liefern.
- **Browser-/Gerätetest:** nicht ausgeführt; kein UI-/Run-Adapter geändert.
- **Git-Verifikation:** gezielter `git diff --check` PASS. Branch/HEAD vor der Arbeit `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende Änderungen anderer Agenten erhalten. Kein Commit/Push.

## Offene Folgearbeit

1. A02 muss getrennte, quellengebundene Rechnungs- und Zahlungsevents mit Rechnungspositionen, explizitem Steuerstatus und den maßgeblichen bestehenden Datumsankern bereitstellen.
2. A03 muss vor Posting Nettoerlös, Bruttoforderung, Steuerkomponente/Verbindlichkeit und Zahlungseingang getrennt abstimmen; derzeit sind diese Mehrbetrags-/Steuerfälle vom Performance-Reducer ausdrücklich nicht unterstützt.
3. A03-Istkosten, Material-/Fertigwarenbewertung, COGS und Lieferantenverbindlichkeiten/-zahlungen bleiben unbelegt und nicht integriert. Jahres-Cash-/Ledger-Reconciliation und 12-Monatslauf bleiben offen.
4. A09 soll die neue reine Vorschaufunktion unabhängig auf Rundung, Kalendergrenzen, Replay-/Eingabegrenzen und Nichtbuchung prüfen. Danach kann A01 den nächsten integrierten Folgeauftrag vergeben.

**Rückfragen an A01:** Keine neue Nutzerentscheidung erforderlich; offene Items sind konkrete fachliche Ereignis-/Integrationsbelege und unabhängige Reviews.  
**Nächster Schritt:** A01 beauftragt A09-Re-Review der Vorschau und A02 mit expliziten Rechnungs-/Datums-/Positionsdaten; A03 wartet mit jeder produktiven Finanzwirkung, bis Schnittstelle und Netto-/Bruttobehandlung abgestimmt sind.
