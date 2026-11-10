# A03 – T-0069 V3-Szenario-Rechnung und Finance-Handoff

**Status:** begrenzte Finance-Integration implementiert; D-0168-Fälligkeitstagseingang ergänzt; A02-Cross-Review und A09-Re-Review PASS im isolierten Runtimeumfang  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Profil:** gemeinsamer V3-Run ab 2027-01-04  
**Entscheidungen:** D-0157, D-0161, D-0162, D-0165, D-0166, D-0168  
**Vorgänger:** CP-0317 (ENTWURF)  
**Gitbasis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche lokale Änderungen anderer Agenten unverändert erhalten.

## Preflight und Scope

Gelesen wurden Root-`AGENTS.md`, Agentenstruktur und Rechtematrix, Ziele, Ticket Board, Collaboration State, Decision Log einschließlich D-0165/D-0166, Rechtsrahmenregister, CP-0313 bis CP-0317, V3-Start-/Zielprofil, A02 Run-Choreografie/F3-/Kundenevidenz-Handoff, A03 Finance-Handoff-Matrix/Blockerbericht und die Finance-Runtime/Regressionen. `git status` geprüft. Keine Fremdänderung wurde verworfen oder überschrieben.

Der Auftrag implementiert nur den vereinfachten V3-Rechnungsfall aus `getV3RunCustomerEvidence`. Er ändert weder V1/V2 noch Schema, UI, Architektur oder A02-Zustand. Er erstellt keine Lieferantenrechnung und leitet keine Istkosten, Bestandsbewertung oder COGS ab.

## Umsetzung

`recordV3ScenarioInvoiceFromCustomerEvidence` akzeptiert ausschließlich den validierten A02-`runState` und eine `workOrderId`. Der Adapter ruft `validateV3RunState` und `getV3RunCustomerEvidence` selbst auf; vom Aufrufer gelieferte Evidenz- oder Autorisierungsobjekte werden abgewiesen. Der öffentliche generische `recordV3Invoice`-Pfad lehnt `policyVersion: D-0166` ab; die Szenario-Buchung ist nur über den A02-validierenden A03-Adapter erreichbar. Der Adapter prüft:

- vollständige, quellengebundene A02-Vertrags-, Angebots-, Arbeitsgang-, Liefer- und Kundenentscheidsdaten;
- unverändertes Netto-`R` in EUR und Referenz auf den angenommenen Snapshot;
- alle Arbeitsgänge abgeschlossen, Lieferung in vereinbarter Menge/Einheit an die vertraglich gebundene Empfängerpartei;
- ausschließlich positive D-0157-Kundenentscheidung oder vertraglich bevollmächtigten Empfänger; Ablehnung, Verkäufer-Selbstabnahme, fehlende/falsche Autoritätsreferenz und veränderter Snapshot werden abgewiesen.

Das Leistungsdatum folgt D-0167: Datum des zuletzt abgeschlossenen, vertraglich geforderten Fertigungsarbeitsgangs. Liefer- und Entscheidungsdatum bleiben separat. Fehlt die letzte Arbeitsgangquelle oder liegt sie nach Lieferung, wird die Verarbeitung abgewiesen.

Die Funktion bucht den expliziten Nettoumsatz am Kundenentscheiddatum. Der separate vereinfachte Rechnungsbeleg trägt das Label **„Szenario-Rechnung (vereinfacht)“**, weist `R`, SimTAX und Bruttoforderung getrennt aus und erhöht den offenen Posten um SimTAX; die SimTAX-Verbindlichkeit wird separat geführt. Steuer wird ausschließlich gemäß D-0166 als 19 % auf einer einzelnen steuerpflichtigen `R`-Position berechnet, positionsweise centgenau. Die Fälligkeit verwendet nach D-0167 das späteste belegte Abschlussdatum der vertraglich geforderten Arbeitsgänge und das Rechnungsdatum; Lieferdatum bleibt separat. Der spätere der beiden Daten ist Anker; Ankertag zählt als Tag 1, Wochenendtermine verschiebt D-0011.

Die Funktion mutiert keine A02-Evidenz. Sie erzeugt keine Zahlung. `recordV3CustomerPayment` verarbeitet weiterhin nur ein separat explizit übergebenes Zahlungsevent; es wurde keine automatische Zahlung oder Steuerabführung ergänzt. Reconciliation weist Nettoumsatz, Bruttoforderungen, tatsächliche Kundeneingänge und offene SimTAX-Verbindlichkeit getrennt aus. Steuerabführung, Lieferantenposten, Fremd-/Istkosten, COGS und Jahresabstimmung bleiben ausdrücklich offen.

## Prüfungen

- `node --check prototype/v3-finance-runtime.js` — PASS.
- `node --check prototype/v3-finance-runtime-regressions.mjs` — PASS.
- `node prototype/v3-finance-runtime-regressions.mjs` — PASS (synthetische Evidence-Fixtures).
- Gezielter `git diff --check` auf Runtime und Regressionen — PASS.
- Fälle: positionsweise Rundung (50 Cent netto → 10 Cent SimTAX), 14-Tage-Zählung und Wochenend-/Jahreswechsel, negativer Kundenentscheid, Verkäuferrolle, autorisierter Alternativempfänger, Vertrags-/Mengenzuordnung, veränderter R/Snapshot, ungültiger A02-Run-State, fremde Run-ID, caller-supplied Evidence/Authorization, direkter D-0166-Generic-Invoice-Bypass, D-0167-Leistungsdatum, Bruttoforderung gegenüber Nettoumsatz, Steuerverbindlichkeit, explizite Zahlung/Reconciliation und Replay-Idempotenz.
- A03-Eigenreview — PASS im isolierten Rechnungs-/Finance-Runtime-Scope.
- A02-Cross-Review fand einen blockierenden Cross-Order-Provenienzfehler und den generischen D-0166-Bypass; beide wurden durch Run-State-abgeleitete Evidenz und Sperre des Generic-Pfads adressiert. A02-Cross-Review PASS; A09-Re-Review PASS im isolierten Runtimeumfang. Die anfänglichen Provenienz-/Bypassbefunde sind behoben. Kein Browser-/UI-/End-to-End-Review.
- Browser-/Gerätetest — nicht ausgeführt; Runtime noch nicht in V3-Run/UI integriert.
- Kein Commit oder Push.

## Grenzen und nächster Schritt

Diese Funktion ist ein A03-finance adapter, kein vollständiger Ledger-/Steuerrechner und erzeugt noch keine sichtbare Rechnung im Spiel. Der Adapter nimmt einen A02-Run-State und eine Work-Order-ID an, validiert den Run-State und liest die Kundenevidenz über den A02-Projektor selbst aus. Caller-supplied Evidence/Authorization wird abgewiesen; der generische Rechnungsweg blockiert D-0166. Kunden-Cash ändert sich ausschließlich nach einem separaten tatsächlichen Zahlungsevent; ein A02-Zahlungsevent gibt es noch nicht. Ebenso fehlen Steuervoranmeldung/-zahlung, Lieferantenrechnungen, Kosten-/Bestands-/COGS-Flüsse und 12-Monats-Reconciliation.

Nächster Schritt: A05 integriert die Szenario-Rechnung in Run/UI mit sichtbarer Kennzeichnung. Danach A02/A03 liefern tatsächliche Zahlungsevents, Kosten/COGS/Verbindlichkeiten und Jahresabstimmung; A09 prüft die integrierte Nutzerroute.

## D-0168 – deterministischer V3-Kundenzahlungseingang

`processV3ScenarioCustomerReceiptsDue(state, currentDate)` ist als reine A03-Runtime-Operation ergänzt. Der Aufrufer übergibt nur den Finanzzustand und das explizite operative Datum. Die Funktion liest gespeicherte D-0166-Rechnungs-, Auftrags-, Kunden- und Fälligkeitsdaten; sie akzeptiert keine vom Aufrufer gelieferten Zahlungsbeträge oder Referenzen. Nur wenn `currentDate === invoice.dueDate`, wird der volle Bruttobetrag als Kundeneingang verarbeitet. Ein Eingang darf den eigenen Bankbestand übersteigen und wird nicht durch ein Cash-Gate blockiert. Er erhöht Bank, reduziert die Bruttoforderung, verändert den zuvor erfassten Nettoumsatz nicht und lässt die SimTAX-Verbindlichkeit offen.

Event-ID, Zahlungs-ID und `sourceRef` werden stabil aus D-0168, Run-ID, Rechnungs-ID und Fälligkeit abgeleitet. Identische Wiederholung ist idempotent. Frühe Verarbeitung, verspätetes Catch-up und automatische Verarbeitung anderer Rechnungsrichtlinien erfolgen nicht; bei nicht exakt verarbeitetem Fälligkeitstag bleibt der Posten offen. Der Umfang umfasst keine Teil-/Ausfall-/Lieferantenzahlungen oder Steuerabführung und ändert V1/V2 nicht.

**Regressionen:** exakter Fälligkeitstag; kein früher Eingang und kein späteres Catch-up; Bruttobetrag ohne Cash-Gate; Bank-/Bruttoforderungs-/SimTAX-/Umsatzwirkung; Replay-Idempotenz; Ausschluss anderer Rechnungsrichtlinien; gespeicherte verschobene Fälligkeiten am Wochenende und Monatswechsel. Syntaxchecks und `node prototype/v3-finance-runtime-regressions.mjs` bestanden. Die Funktion ist noch nicht in A05s Tagesfortschritt aufgerufen; die Tagesintegration und sichtbare UI-Verifikation bleiben ein separater A05-Handoff.
