# A01 – T-0074/G3 D-0187 Szenarioauswertung (Entwurf)

Datum: 2026-11-09  
Adressat: A01 – MASTER_ORCHESTRATOR  
Goal/Tickets: MG-002 / SLG-002.2 / T-0069 / T-0074  
Profil: V3, Laufzeit 2027-01-04 bis 2027-12-31  
Entscheidung: D-0187, Nutzerfreigabe der drei synthetischen Testparameter  
Vorgänger: CP-0561 (Entwurf)

## Ergebnis

Der neue reine Test-Overlay bezieht je Monat ausschließlich `recognizedRevenueCents` aus dem im T-0075-Jahreslauf abgestimmten Kunden-Finanzquellpfad. Der aktuelle zwölfmonatige Lauf liefert 96.000 Cent (960,00 €) Netto-Umsatz. D-0187 setzt darauf 35 % variable Szenariokosten (33.600 Cent), 1.200,00 € fixe monatliche Szenariokosten (144.000 Cent im Jahr) und 1.800,00 € monatliche Privatentnahme (216.000 Cent im Jahr) an.

Daraus entstehen für genau diesen synthetischen Lauf:

- synthetisches Szenario-Betriebsergebnis vor Privatentnahmen: **−1.377.600 Cent (−13.776,00 €)**;
- separat ausgewiesene Privatentnahmen: **2.160.000 Cent (21.600,00 €)**;
- Szenarioüberschuss nach Privatentnahmen: **−3.537.600 Cent (−35.376,00 €)**.

Der letzte Wert ist ausdrücklich kein Bankbestand und keine Cashflow-Prognose. Die negativen Werte charakterisieren nur die gewählten Testparameter und den aktuellen Lauf. Es werden keine Aussagen zu realer Tragfähigkeit, Insolvenz oder Solvenz abgeleitet.

## Rechenvertrag und Grenzen

`prototype/v3-t0074-economic-viability-scenario.js` berechnet das Szenario als reine Funktion in ganzzahligen Cent. Die variable Komponente wird je Monat auf den nächsten Cent gerundet. Die Regression enthält positive und negative Betriebsergebnisfälle, die separate Privatentnahme, Eingabevalidierung und das Verbot einer Mutation der Eingangsdaten.

Das Overlay ändert keinen FinanceState. Es erzeugt keine Buchung oder Cash-/Bank-/OP-/Steuer-/Inventar-/WIP-/Fertigwaren-/COGS-/BAB-/Ledgerwirkung. COGS bleibt nach D-0178 PENDING; sonstiger nicht implementierter Finanzumfang bleibt gemäß D-0186 PENDING. Der einzelne echte Jahreslauf erzeugt aktuell nur einen negativen Testausgang. Ein positiver vollständiger Jahreslauf ist noch nicht belegt.

## Prüfung

- `node prototype/v3-t0074-economic-viability-scenario-regressions.mjs` — PASS (positiver Kontrollfall + negativer Fall).
- `node prototype/v3-t0075-annual-order-product-flow-smoke.mjs` — PASS (12 Monate, 12 Kundenaufträge; Finance-Reconciliation bleibt auf vorhandene Kundenrechnungen/-zahlungen begrenzt; `pendingFinance=true`).
- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS nach Aktualisierung der veralteten Test-Fixtures auf aktuelle Startkompetenzen und T-0114-Unterweisung.
- Fachreview A03: nicht ausgeführt. Unabhängige QA A09: nicht ausgeführt. Browserreview des neuen Overlay: nicht ausgeführt, da es ausschließlich im Harness-Ausgabeobjekt erscheint.
- `git diff --check` der betroffenen Dateien: PASS; Git meldet nur LF/CRLF-Hinweise.

## Status

T-0074/G3 bleibt IN_PROGRESS, bis A03 die Abgrenzung fachlich bestätigt, A09 die Szenariologik unabhängig prüft und ein positiver vollständiger Jahresfall vorliegt. T-0069 bleibt IN_PROGRESS; G10 benötigt weiterhin die geforderten Browser-/Viewport- und Jahresbelege. Keine Schemafreigabe, keine Runtime-Finanzmutation, kein Commit/Push.

## Review-Nachtrag

A03 Fachreview PASS für Formeln, Quellenbindung, Trennung der Privatentnahme und Nichtbuchungsgrenzen; A03 führte die gezielte Szenario-Regression, T-0075 und A05-Regression aus. A09 unabhängige QA PASS für die Szenarioregression und Nachkorrekturen; die Jahres-/A05-Ausführung im Erstreview lag vor der Break-even-/Safe-Integer-Korrektur. A09 empfiehlt, Break-even bei 0 € explizit zu dokumentieren; dieser D-0187-Nachtrag ist ergänzt. Positiver vollständiger Jahreslauf weiterhin ausstehend.

A09 hat nach der letzten Break-even-/Safe-Integer-Korrektur den Jahreslauf erneut unabhängig geprüft: 12/12 Monate und Szenario-/Financewerte PASS; das Ergebnis bleibt ein negativer Szenariofall. Der positive vollständige Jahresvergleich ist weiterhin offen.

## Fortschreibung: positiver Laufversuch

Nach ausdrücklicher Nutzerbestätigung wurde ein separater 2027-Positivvergleich mit 60 Kundenaufträgen pro Monat zu je 80,00 € netto ausgearbeitet. Der Harness führt je Auftrag Angebot, Marktentscheidung, zweistündige Arbeitsoperation, Lieferung, Kundenabnahme und D-0166-Rechnung aus; Zahlungseingänge bleiben D-0168-Ereignisse. D-0187 setzt darauf nichtbuchend 35 % variable Kosten, 1.200,00 € fixe Monatskosten und 1.800,00 € getrennte monatliche Privatentnahme an.

**Erwarteter vollständiger Szenariovektor:** je Monat 4.800,00 € Nettoerlös, 1.680,00 € variable Kosten, 1.200,00 € Fixkosten, 1.920,00 € synthetisches Betriebsergebnis und 120,00 € nach Privatentnahme; über zwölf Monate 57.600,00 € Erlös, 23.040,00 € Betriebsergebnis und 1.440,00 € Szenarioüberschuss nach Entnahmen. Dies sind Sollwerte, kein beobachteter Jahresausgang.

**Beobachtet:** Januar bis Juni 2027 bestanden die Monatsreconciliation jeweils mit 60 Aufträgen / 480.000 ct Nettoumsatz. Summe dieser sechs Perioden: 2.880.000 ct Nettoerlös, 1.008.000 ct variable Szenariokosten, 720.000 ct fixe Szenariokosten, 1.152.000 ct Betriebsergebnis und 72.000 ct Überschuss nach 1.080.000 ct separaten Privatentnahmen. Der positive Jahreslauf wurde im Juli nach rund 32 Minuten Gesamtlaufzeit und einem Spitzenarbeitsspeicher von etwa 3,7 GB kontrolliert abgebrochen. Er ist daher NONPASS für den Jahresgate und darf nicht als 12-Monatsnachweis gezählt werden.

Zur Laufzeitverbesserung wurden die wiederholt quadratischen Ereignis-/Auftragslookups in `v3-market-simulation.js` und `v3-run-orchestrator.js` indexiert. Markt-, Orchestrator-, T-0074-Formel-, A05-UI-Regressionen sowie der unveränderte negative 12-Monatslauf bestehen. Weitere Profilierung/Optimierung und ein erneut vollständig beendeter Positivlauf sind offen. D-0187s Nichtbuchungsgrenzen, `pendingFinance`, offene Supplier-AP-/GL-/Payroll-/COGS-/BAB-Umfänge und sämtliche historischen Entscheidungen bleiben unverändert.

## Fortschreibung: 12M-Positivlauf erreichte Dezember

Der D-0187-Positivjahres-Harness erreichte alle zwölf Monatsabschlüsse; pro Monat bestanden 60 Aufträge und 480.000 ct Umsatz die Monatsreconciliations. Die Schlussassertion brach mit `692 !== 12` ab, weil sie fälschlich zwölf eindeutige Zahlungseingänge erwartete. Der Jahreslauf verarbeitet 692 eindeutige Receipts; nicht alle Dezemberforderungen sind am Jahresende fällig/eingegangen. Die Assertion wurde korrigiert, aber ein vollständiger Re-Run fehlt. Daher kein positiver Jahres-PASS und T-0074 bleibt IN_PROGRESS.

Nach der Harnesskorrektur bestanden Syntaxcheck, D-0187-Formelregression, Markt-, Orchestrator- und A05-UI-Regression sowie scoped `git diff --check`. Die Laufzeit des Jahresversuchs betrug mehrere Stunden CPU-Zeit, Spitzen-Working-Set etwa 7,5 GB. Kein Commit/Push. Siehe CP-0563.

## Ressourcenaudit zum Positivlauf (CP-0564)

Ein korrigierter Jahreslauf bestand Januar bis August; Ressourcen bei kontrolliertem Abbruch: ungefähr 3.733 Sekunden CPU, 5,5 GB Working Set, rund 2,7 GB frei. Der erste korrigierte Vorgänger hatte alle zwölf Monatsreconciliations erreicht, aber die falsche Receipt-Anzahlassertion ausgelöst. Die CPU-/RAM-Last lässt sich voraussichtlich reduzieren, indem Validatoren ihre bereits in einzelnen Bereichen vorhandenen Indizes vollständig über den ganzen Validierungsdurchlauf wiederverwenden. Vollständiges Klonen und wiederholtes Revalidieren des wachsenden Zustands sind Hauptkostentreiber; ein Weglassen der Invarianten wäre kein akzeptabler Fix. Für RAM ist ein resumierbarer Monatscheckpoint im Testharness ein risikoarmer nächster QA-Schritt. Historische Finanz-/Runbelege bleiben erhalten. Der korrigierte 12M-Lauf ist offen.

## Fortschreibung: Produktvalidator-Indizes (CP-0565)

Einmalindizes ersetzen jetzt wiederholte Event- und Assignment-Suchen in den Produktvalidierern. Der vollständige negative Jahres-Smoke besteht nach der Änderung; der positive Test mit 60 Aufträgen/Monat besteht Januar bis Juni, aber ist noch kein Jahrespass. Die Laufzeit-/Speichermessung ist begrenzt und nicht direkt mit einem gleich langen Vorherlauf vergleichbar; daher wird keine prozentuale Reduktion behauptet. Nächster sinnvoller Schritt ist eine instrumentierte 30-/90-Tageblockmessung. Das alte Produkttestfixture ohne Geräteunterweisungsnachweis bleibt separater NONPASS. D-0187 und alle Buchungsgrenzen bleiben unverändert.
