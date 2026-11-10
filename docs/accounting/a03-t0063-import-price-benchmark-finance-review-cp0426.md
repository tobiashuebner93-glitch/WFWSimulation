# A03-Fachreview – T-0063 Einfuhrpreis-Benchmark an L4 (CP-0426)

**Status:** CONDITIONAL PASS für einen strikt nichtbuchenden Benchmark-Referenzslice; kein PASS für automatische Integration in Angebotskosten
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063, Anschluss T-0067/T-0069
**Run-Profil:** V3 Shared Run, Start 2027-01-04; aktueller L4-Planpfad bleibt opt-in und nichtbuchend
**Entscheidungen:** D-0161–D-0169, besonders D-0162 (R, Plan-/Snapshot-Grenze, Perioden), D-0165–D-0168 (spätere Rechnungs-/Finanzereignisse getrennt)
**Vorgänger:** CP-0425 A08-Vorschlag; CP-0424 Browserbeleg; CP-0423 A03 L2-Review
**Arbeitsbasis:** `main@8b72b7e`; gemeinsame lokale Änderungen bleiben erhalten. Keine Produktdatei geändert; kein Commit/Push.

## Geprüft

A03 hat A08-Bericht `docs/research/a08-t0063-next-channel-cp0425.md`, CP-0425, die aktuelle L4-Offer-Sensitivity (`prototype/v3-offer-plan-sensitivity.js`), Kostenplan-Fixture, Makro-/FX-Projektion, Run-Angebotsübergabe und die maßgeblichen A03-Verträge/Entscheidungen geprüft. Bestehende Regressionen wurden ausgeführt:

- `node prototype/v3-offer-plan-sensitivity-regressions.mjs` – PASS.
- `node prototype/v3-macro-trade-impact-regressions.mjs` – PASS.

## Fachbefund

Der vorgeschlagene Destatis-Monatsbenchmark kann als **separate, optionale, nichtbuchende Referenz** für die vom Spieler ausdrücklich ausgewählten noch offenen Angebotsplanpositionen weiterverfolgt werden. A02 kann diesen begrenzten Referenz-/Provenienzslice implementieren, wenn fehlende/noch unveröffentlichte Werte `pending` oder neutral bleiben und das Benchmark-Ergebnis nicht automatisch in direkte Kosten übertragen wird.

Ein direkter Durchgriff auf `calculateV3OfferPlanSensitivity()` ist noch nicht fachlich freigegeben. Der bestehende L4-Modus multipliziert Material- und Logistikzeilen mit `procurementPlanIndex`; dieselbe Zeile bekommt also bereits eine konkrete Planbetragswirkung. Ein importpreisbasierter Index direkt als dieser Multiplikator wäre ein modellierter 1:1-Preis-Pass-through. Dafür liegt kein belegter firmenindividueller Koeffizient und keine bestätigte Spielerregel vor. Hier wird kein Koeffizient vorgeschlagen. Ohne explizite, als Spieler-Sensitivität gekennzeichnete Rate bzw. separate Nutzungsbestätigung muss der Importbenchmark nur informativ bleiben und den Planbetrag unverändert lassen.

## Erforderliche Guardrails für A02

1. **Zeit und As-of:** `observedPeriod` (Berichtsmonat), tatsächliches `publishedAt`, technisches `retrievedAt` (falls erfasst), `sourceSnapshotId`/Hash und Datenstatus (vorläufig/endgültig/revidiert) getrennt binden. Wirksamkeit frühestens am tatsächlichen Veröffentlichungstag und erst für danach berechnete offene Angebotsentwürfe. Kein Rückdatieren, kein Look-ahead.
2. **Vintage-Freeze:** Das zum Run-/Angebotszeitpunkt verwendete veröffentlichte Quellen-Vintage bleibt im Replay fixiert. Spätere Revisionen dürfen keine bereits berechnete/abgegebene Angebotskalkulation oder deren Kalkulationssnapshot still ändern. Ein neuer Datenstand gilt nur für künftige, noch offene Entwürfe.
3. **Quellenbedeutung:** Destatis-Gesamt-/Euro-/Nicht-Euro-Reihe ist ein aggregierter Index, kein individueller Lieferantenpreis, keine Bestellung, kein Rechnungswert und keine Marktprognose für das Unternehmen. Segmentwahl muss belegt/ausdrücklich markiert sein; aus einem EUR-Angebot oder `importCurrency` darf Exposure nicht automatisch geraten werden.
4. **Keine implizite Pass-through-Rate:** Benchmark-Referenz allein ändert keinen Kostenbetrag. Der bestehende L4-Multiplikator darf nur nach expliziter eigener Spielerauswahl/Sensitivitätsregel laufen; fehlende Regel oder Basisperiode bedeutet neutral/pending, nicht automatisch Faktor 1:1.
5. **Doppelzählung:** Ein Material-/Logistiktreiber darf im jeweiligen Kalkulationssnapshot nur einmal wirksam sein. Importbenchmark, FX-Importplanindex, bestehender `procurementPlanIndex` und BICI dürfen nicht gestapelt auf dieselbe direkte Kostenzeile wirken. Die bestehende L4-Schutzregel „BICI nicht zusätzlich auf dieselben Zeilen“ ist zu erhalten und auf Importbenchmark/FX zu erweitern. Bei überlappender/mehrdeutiger Zuordnung fail-closed oder `pending`.
6. **D-0162/Snapshot:** `R` ist der unveränderte Nettoplan-Angebotspreis. Der Benchmark darf höchstens Plan-Einzelkosten bzw. Kalkulationshinweise offener Entwürfe beeinflussen; nach Einreichung muss Kosten-/BAB-/Sensitivitätssnapshot unveränderlich bleiben. Keine Änderung an angenommenem Preis/Vertrag, Lieferantenquote, Istkosten, BAB-Ist, Bestand, Rechnung, Ergebnis, OP, Ledger, Cash oder Finanzierung.
7. **Periodenzuordnung:** Makro-Berichtsmonat und L4-Angebotsperiode sind getrennt. Die effektive Angebotsperiode darf nicht aus Beobachtungsmonat plus einem starren Simulationslag abgeleitet werden, wenn `publishedAt` später liegt. Ein Angebot, das vor Veröffentlichung berechnet wurde, bleibt beim damaligen Informationsstand.

## Entscheidung / nächste Übergabe

**A02 darf implementieren:** ausschließlich quellengebundene Benchmark-Verfügbarkeit, As-of/Vintage-/Replaybindung und eine getrennte read-only Anzeige/Referenz für geeignete offene Angebotsentwürfe; unbekannte Exposure oder Daten bleiben neutral/pending. Das ist kein automatisch in L4 eingerechneter Kostenindex.

**Noch nicht freigegeben:** den beobachteten Destatiswert automatisch mit `procurementPlanIndex` zu verknüpfen oder Material-/Logistikbeträge zu ändern. Dafür braucht es zuerst einen expliziten fachlichen Vertrag, wie der Spieler die Sensitivität auswählt bzw. welcher offene Kostenplan-Treiber ersetzt wird. Das ist insbesondere nötig, um 1:1-Pass-through und Doppelzählung mit FX/BICI/Procurement auszuschließen. Kein empirischer Koeffizient wird hier angenommen.

Keine Nutzerfrage ist nötig, um den reinen Referenzslice umzusetzen; A01 muss aber den Auftragsumfang entsprechend eng halten. Kein Widerspruch zu D-0162, sofern dessen unveränderlicher `R`-/Snapshotvertrag eingehalten wird. Ein automatischer Kosten-Multiplikator ohne separate Auswahl würde über den dokumentierten Entscheidungsstand hinausgehen.

Das ist kein A09-Adversarialreview, keine Rechts-/Architektur-/Schema-/Releasefreigabe und kein Abschluss von T-0063/T-0067/T-0069.
