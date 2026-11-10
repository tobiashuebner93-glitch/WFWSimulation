# A02 – T-0069 V3 Customer-Evidence-Handoff (ENTWURF)

**Status:** read-only Quellprojektion für bestehende operative Run-Fakten; keine Rechnungs-/Finanzfreigabe  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A02 – SIMULATION  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Profil:** V3-Run ab 2027-01-04; keine Änderung an Startprofilen 2019/2027 oder an V1/V2  
**Entscheidungen:** D-0157 (Empfängerentscheidung/F3), D-0161 (aktuelle Rechtslage), D-0162 (`R` bleibt Nettoplanpreis), D-0165 (19-%-V3-Szenariokomponente/14 Kalendertage), D-0166 (einzelne Rechnung aus eingefrorenem Netto-R nach positiver Kundenentscheidung)  
**Vorgänger:** CP-0317 (ENTWURF)

## Ergebnis

A02 hat `getV3RunCustomerEvidence(state, workOrderId)` in `prototype/v3-run-orchestrator.js` ergänzt. Die Funktion validiert den vorhandenen Run und gibt eine abgetrennte, read-only Projektion bereits vorhandener Arbeitsplan-, Arbeitsgangabschluss-, Liefer- und Kunden-/Empfängerentscheidungsdaten zurück. Sie mutiert weder Run- noch Produktzustand.

Die Projektion bezeichnet diese Daten ausschließlich als operative Quellenfakten für A03-Prüfung. Sie liefert kein `performanceDate`, erklärt eine Kundenannahme nicht selbst zur abrechnungsfähigen Leistung und ermittelt weder invoice eligibility noch Rechnungs-/Steuer-/Fälligkeitsdaten. `financeStatus` bleibt `pending_non_posting`, `postingEffect` ist `none`; Invoice-/Payment-Eventreferenzen werden explizit als fehlend ausgegeben.

## Quellbindung und Output

Jeder Handoff ist über `runId` und `workOrderId` an denselben Lauf und Auftrag gebunden. `orderRefs` verweist auf `inquiryId`, `offerId`, echte `marketDecisionId`, Kundenpartei und Annahmedatum. `acceptedNetR` gibt den gespeicherten angenommenen Preis in `amountCents`, die Szenariowährung `EUR`, die unveränderliche `offerSnapshotRef` und das Angebotseinreichungsereignis aus. Das bleibt ein Quellenfakt, keine von A02 erzeugte Rechnungsposition.

- **Vertrag/Plan:** Vertragsreferenz, Vertragstyp, Parteien/Autorisierungsreferenzen, Leistungs- und Abnahmekriterien sowie vereinbarte Gesamtmenge/Einheit werden aus dem gebundenen T-0066-Vertragssnapshot referenziert. Planereignis-ID bleibt separat.
- **Arbeitsgänge:** Für jeden geplanten Vorgang werden ID, Termin, Ressourcenstunden und Planmaterial ausgewiesen. Als tatsächlich verbraucht werden Materialmengen nur mit vorhandener `customer_operation_completed`-Event-ID, Quellreferenz und Abschlussdatum ausgegeben; der T-0066-Abschluss zieht genau diese geplante Menge aus dem physischen Bestand ab. Es wird kein Geldwert für Material, Arbeit oder Maschine abgeleitet.
- **Lieferung:** Event-ID/Quellreferenz, `deliveryId`, Lieferdatum, Empfänger, Kriterien, Menge/Einheit und nichtbuchender Lieferstatus.
- **Kundenentscheidung:** Event-ID/Quellreferenz, `decisionId`, Entscheidungsdatum, `accept`/`reject`, Akteurrolle/-partei, Kunden-/Vertreterbezug, Autoritätsreferenzen, Kriterium und bestehender `*_non_posting`-Status. Die D-0157-Automatik bleibt als Kunden-/Empfänger-Szenarioereignis erkennbar; es wird keine allgemeine gesetzliche Abnahmewirkung behauptet.
- **Fehlende Ereignisse:** `invoiceEvent: null` und `paymentEvent: null`, bis eigenständige Events tatsächlich existieren.

Die Projektion unterscheidet `work_order_created_waiting_for_plan`, `operations_in_progress`, `operations_complete_waiting_for_delivery`, `delivery_recorded_waiting_for_customer` und `customer_decision_recorded`. Eine vollständige Kette ist nur die Feststellung verfügbarer Run-Fakten, nicht die Feststellung eines finanziellen Erfolgs.

## Abgrenzung zu A03 und D-0165

A03 kann diese Projektion verwenden, um Quelldaten eines konkreten Auftrags zu sichten. A02 bestimmt weder die für Spiel-KLR oder Steuer maßgebliche Realisationsperiode noch, ob die Vertragsleistung abrechnungsfähig ist. Getrennte `operation.completedAt`, `delivery.deliveryDate` und `customerDecision.decisionDate` bleiben sichtbar; A03 entscheidet mit dem belegten Vertrag, welche davon für seine Verarbeitung gilt.

D-0166 autorisiert nach positiver, belegter Kunden-/Empfängerentscheidung eine einzelne A03-Rechnungsposition aus dem angenommenen unveränderten Netto-`R`; das Rechnungsdatum ist das Entscheidungsdatum. Die A02-Projektion liefert dazu nur den unveränderten `R`-Wert und Snapshotbeleg. A02 erstellt weder die Position noch die Rechnung und berechnet keine Steuer oder Fälligkeit. Für A03 gelten 19 % im V3-Standardmodus nach D-0165 und das spätere Datum aus belegter Leistung/Rechnungsdatum als Fälligkeitsanker mit 14 Tagen nach D-0013–D-0017. Die frühere V1-Regel D-0112 wird nicht automatisch übertragen. `calculateV3InvoiceTerms` bleibt eine A03-Vorschau, keine Run-Rechnung.

### A02-Grenze nach D-0166

Der aktuelle Run hat einen echten angenommenen Marktentscheid, expliziten T-0066-Plan, tatsächlich abgeschlossene Arbeitsgänge, Lieferung und Kunden-/Empfängerentscheidung. Er besitzt noch kein Rechnungsereignis. D-0166 legt den Rechnungsauslöser und die einzelne Netto-R-Bemessungsposition fest; der A02-Handoff stellt R samt Snapshotbeleg als Quelle bereit. Die Finanzbuchung bleibt A03 vorbehalten und wurde nicht durch den Handoff ausgeführt.

**D-0166 ist als begrenzte A01-Szenarioannahme APPROVED.** Bei positiver, belegter Kunden-/Empfängerentscheidung ist im V3-Standardmodus eine einzelne Position aus dem angenommenen Netto-`R` zulässig, mit 19 % Szenarioanteil; das Rechnungsdatum entspricht dem Entscheidungsdatum. A02 liefert nur den gebundenen `R`-Quellenwert in Cent, `EUR` und Snapshot-/Submission-Referenz. A03 bleibt allein für Rechnung, Fälligkeit und Posting zuständig. Dies ist keine vollständige steuerliche Rechnung oder Rechtsfreigabe.

## Tests und Status

- `node --check prototype/v3-run-orchestrator.js` – PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` – PASS; gezielte Fälle decken akzeptierte/abgelehnte Kundenentscheidung, Liefer-/Arbeitsgangreferenzen, D-0166-Netto-R-Wert in Cent, `EUR`, OfferSnapshot-/Submission-Referenzen, `invoiceEvent`/`paymentEvent`-Abwesenheit und Nichtmutation ab.
- Browser-/Gerätetest – nicht ausgeführt.
- A03-Fachreview und A09-Re-Review PASS für die begrenzte Finance-Runtime; Cross-Order-, Direktaufruf- und D-0167-Datumsfälle sind abgedeckt. Kein Browser-/UI-/Jahresabschlussreview.
- Kein Schema-/Architekturentscheid, keine Rechnung/Buchung, kein Commit/Push.

**Abgleich nach D-0166:** Die Einzelpositions-/Rechnungsauslöseannahme ist durch A01 in D-0166 autorisiert; A03 hat die isolated posting bridge implementiert und A02-/A09-Re-Reviews bestätigen den Runtimeumfang. Die Bridge ist noch nicht in Run/UI integriert. Zahlungsevents, Steuerabführung, Lieferantenrechnungen/-zahlungen, Istkosten/COGS/Bestandsbewertung und Jahresreconciliation bleiben offen unter T-0069.