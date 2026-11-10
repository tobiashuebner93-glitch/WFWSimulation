# A03 – T-0070 internationaler Materialeingang: Finanzgrenzenreview

**FINANZ-GRENZE:** PASS für den geprüften Mengen-/Receipt-Slice  
**T-0070/G3 und T-0076:** kein Gateabschluss durch diesen Review; T-0070 braucht weitere G3-Reviews/Wirkungsbelege, T-0076 bleibt auf mengenbezogene Teilabdeckung begrenzt.  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Basis:** CP-0483; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`  
**Scope:** Read-only Finanzgrenzenreview der synthetischen internationalen Materialorder/-receipt-APIs und fokussierte Produkt-/Runregressionen. Keine Regeländerung.

## Befund

Die neue Order ist ein ausdrücklich synthetischer, mengen- und ETA-basierter Beleg. Er akzeptiert genau `orderId`, `shipmentId`, `materialId`, `quantity`, `sourceRef`, `fixtureId`, `baselineEtaDate`, `etaDate` und `lagDays`; es gibt keine Lieferanten-ID, Preis-/Währungs-/Steuerfelder, Zahlungsbedingung, Verbindlichkeit, Bankkonto oder Vertragsreferenz. Die Order reserviert keinen Bestand und erzeugt laut API- und Eventsemantik keine Geldwirkung.

Erst der am expliziten ETA-Datum erfasste Wareneingang addiert die belegte Menge zur physischen Materialmenge. Die Receipt-Bewegung trägt Einheit `units`, tatsächliches Receipt-Datum und Monatsperiode, Mengen-vorher/nachher und `monetaryStatus: nonposting_pending_cost_source`. Sie enthält keinen Stückpreis oder Geldbetrag. Der Shared-Run-Receipt spiegelt Movement-ID, Menge, Datum und Status als Run-Event; er erstellt weder AP noch Cash-/Bank-, Steuer-, COGS-, BAB-, Buchwert- oder Ledgerwerte. Es wird keine Eingabe in FinanceRuntime-/FinanceState-APIs vorgenommen. Produkt-/Kundenpreis und Kundenvertrag werden nicht geschrieben oder verändert.

Der Mengenroll-forward validiert Opening Quantity + belegte Receipt-Mengen − abgeschlossene Operationsverbräuche = bestehende Materialmenge. Die Validatoren binden Order, Shipment, Receipt-Movement, Monatsdatum, Quelle und Run-Event wechselseitig. Dies ist eine physische Mengenabstimmung; sie ist keine Inventarbewertung, Kreditorenbuchung oder vollständige Monatsbewegungs-/Hauptbuchreconciliation.

Die Menge kann nach tatsächlichem Receipt eine zuvor materialbeschränkte Operation ermöglichen. Das ist eine Betriebs-/Mengenwirkung. Sie selbst bucht keinen Wert und ändert keine Preis-/Vertragskondition. Eine spätere Kundenrechnung/Zahlung bedarf weiterhin des getrennten bestehenden Performance-/Acceptance-/D-0166-/D-0168-Pfads; aus dem Materialreceipt folgen diese Ereignisse nicht automatisch.

## Code- und Regressionbelege

- `prototype/v3-product-lifecycle.js:422–437`: synthetische Materialorder mit exakt begrenztem Feldsatz; kein Preis, AP, Zahlungsmittel oder Lagerwert.
- `prototype/v3-product-lifecycle.js:440–453`: Fälligkeit, Addierung physischer Materialmenge und mengenbezogene Movement-Felder mit `nonposting_pending_cost_source`.
- `prototype/v3-product-lifecycle.js:158–181`: Restore-Validator bindet Shipped-/Receipt-Quellen, Einheit, Datum/Periode, Status und Materialmengenroll-forward.
- `prototype/v3-run-orchestrator.js:764–790`: Shared-Run-Order-/Receipt-Events sind an Produktstate gebunden; Receipt-Resultat kopiert Mengen- und Nonpostingstatus, nicht Finanzposten. Die APIs mutieren nur geklonte Run-/Produktzustände und ergänzen Day-Events.
- `prototype/v3-product-lifecycle-regressions.mjs:360–389`: gleiche materialbeschränkte Operation wird erst nach Receipt planbar; verzögerte ETA hält sie bis zum späteren Eintreffen gesperrt; JSON-Restore/Replay ist idempotent; Geldstatus bleibt `nonposting_pending_cost_source`.
- `prototype/v3-run-orchestrator-regressions.mjs:116–130`: Shared-Run-Order-/Receipt-Replay, Mengenänderung, Restorevalidierung und Tamperreject für Receipt-Querverbindung.

Ausgeführt, alle PASS:

- `node --check prototype/v3-product-lifecycle.js`
- `node --check prototype/v3-run-orchestrator.js`
- `node prototype/v3-product-lifecycle-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`

Kein Jahreslauf und kein Browser-Smoke. Der benachbarte T-0070-Trade-Impact-Test wurde in diesem Finanzreview nicht erneut ausgeführt; der geprüfte neue Receipt-Slice wird direkt durch Produkt- und Orchestratorregressionen abgedeckt.

## Preflight

CP-0483 meldet `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266` und 489 Status-Einträge. Beim Preflight dieses Auftrags waren es 605 parallele lokale Status-Einträge; Branch/HEAD stimmen. Alle sieben Control-Plane-Dateien entsprechen den übergebenen CP-0483-Hashes. Der vorgegebene Berichtsname existiert nicht genau unter `docs/simulation/`; die tatsächlich vorhandene A02-Datei ist `docs/simulation/a02-t0070-international-supply-material-receipt-report.md` und stimmt mit dem übergebenen SHA-256 `CB6FA5D20677CE5C1A90F2ADE018A1295B3510DA73EDFF6FC0FFC36377D8CF24` überein. Die vier genannten Produkt-/Run-Implementierungs- und Regressiondateien stimmen ebenfalls mit den übergebenen SHA-256-Werten überein. Der A02-Bericht wurde vollständig gelesen.

Nur dieser neue Reviewbericht wurde angelegt; kein anderer lokaler Pfad bearbeitet. Kein Stage/Commit/Push.

## Bewertung und Restgrenzen

**A03-Finanzgrenze: PASS.** Der geprüfte Slice zeichnet ausdrücklich nur physische Materialmenge und Lieferzeit ein. Supplier payable, Bank/Cash, Tax, COGS, Inventory book value, BAB und Ledger werden weder erzeugt noch aus Mengen geschätzt. Kostenzuordnung bleibt explizit pending, bis ein belegter und autorisierter Kostensource-/FinanceEvent-Pfad existiert.

Dies ist kein vollständiger T-0076-Materialbewegungsjournal-/Monatsabschluss und kein T-0077-Finanzabgleich. Die Menge ist nicht bewertet. Browser-/Spielerbedienung, A08-/A09-Reviews sowie übergeordnete Gatebewertung liegen außerhalb dieses A03-Reviews. Kein Gateabschluss und keine Produkt-/Finanzregeländerung wird empfohlen.
