# A03 – T-0076 Material- und Bestands-Monatsabgleich

**Status:** Fachabgleich / Umsetzungsauftrag vorbereitet; T-0076 bleibt offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Ticket:** T-0076 / T-0069 G6  
**Scope:** Read-only Code-/Testreview. Keine Mengenwerte, Bewertungsmethode, Produktregel oder Implementierung ergänzt.

## Preflight

Branch `main`; HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; Status 525 vor dem Review. Vorhandene Änderungen blieben unberührt.

- AGENTS `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556`
- Agentenstruktur `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3E`
- Rechtematrix `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE`
- Goals `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D`
- Ticket Board `4382E9015CD2543AB3244216C4381F39D5CB07353E54015202DE8946877A362C`
- Collaboration State `118824A18224BD68E00384B5703391AD81614B25F5F4E7C2FDF00562452B5AF5`
- Decision Log `1EA4649C21FCC505BD4A9931CB7B9C16656A0A9F2BB88DF07E3460ADAACEB`
- Offene Gates Register `8E18198A419B9D86E360B1D1391455BD71DE9A8167688D0A8B339CD9ECCBC485`
- T-0069 Minimalziel `11FB1675FAE5491FB7FBDBCA1D787DA82FFD761050D9FD39260D0E0CA62CE03C`

## Vorhandene Mengen- und Ereignisführung

### Material

- Eröffnung: `createV3ProductState` kopiert ausdrücklich übergebene `materials` nach `openingMaterials`; jedes `materials[].quantity` wird nichtnegativ validiert.
- Zugang: nur der synthetische internationale Materialpfad führt einen lagerwirksamen Receipt. `placeV3InternationalMaterialOrder` legt eine nicht verfügbare Sendung an; `receiveV3InternationalMaterialShipment` erhöht bei Fälligkeit den Materialbestand und schreibt `materialMovements` plus Produkt-/Shared-Run-Receipt-Event. Event führt u. a. Material-ID, Menge, Datum/Periode, `quantityBefore/After`, SourceRef und `monetaryStatus=nonposting_pending_cost_source`.
- Verbrauch: abgeschlossene `assignments` und `customerAssignments` verbrauchen die jeweils explizit geplanten `materials` genau bei Completion. Planen reserviert Bedarf; es zieht noch keine physische Menge ab. Wiederholte Completion ist in Fokusregressionen idempotent; die Bestandsvalidierung prüft global `opening + empfangene Zugänge − completed consumption = materials.quantity` und verbietet negative Werte.
- Begrenzung: Es existiert kein Materialverbrauchsbewegungsjournal pro Operation; der Verbrauch ist aus dem finalen Assignments-/Completed-State und den Arbeitsevents ableitbar. Materialcorrection/write-off und Material-Quarantäne haben derzeit keinen Ereignistyp. Initiale Materialzeilen führen keine Einheitenangabe; das Receipt-Feld heißt aktuell `unit: 'units'`. Roll-forward ist daher nur je unverändertem Material-ID-Mengenmaß prüfbar.
- Nicht eingegangene Sendungen bleiben `in_transit` und zählen nicht zum physischen Lagerzugang. Für den Monatsschluss müssen sie als eigener Transitbestand oder Sendungsstatus getrennt gezeigt werden.

### Fertigware, Reservierung, Quarantäne und Kapazität

- `finishedGoodsMovements` sind zeit-/periodenbezogen, sequenziert und an ein passendes Produkt-/Run-Event gebunden. `validateV3ProductWorkdayAssignments` rollt sie global und je Los fort, einschließlich `physical`, `reserved`, `quarantined`, `available`, belegter Lagerfläche und freier Kapazität.
- Physische Mengenereignisse: `product_output_stocked`, `customer_output_stocked_reserved`, `product_goods_shipped`, `customer_goods_shipped`, `customer_rejected_goods_returned`. Kundenretoure erhöht physische Menge und Quarantäne; es gibt keinen Freigabe-/Verschrottungsübergang für Quarantäne.
- Reservierungen: Produktkäuferzusage reserviert Eigenproduktmenge ohne physischen Lagerzugang; Kundeauftrag-Fertigware kommt physisch und reserviert an. Versand löst die jeweilige Reserve und den physischen Abgang; Kundenstorno vor Versand löst nur die Reserve; keine Mengen werden dadurch entfernt.
- Kapazität: `finishedGoodsUsed` ist eine belegte Lagerflächen-/Kapazitätseinheit, kein Artikelstückbestand. `finishedGoodsMovements.stockBefore/After` und `deltaCapacityUnits` führen diesen Wert; `finishedGoodsCapacity` ist der feste Grenzwert. Aufbewahrte Retouren belegen wieder Kapazität.
- Begrenzung: Das Startfeld `openingFinishedGoodsUsed` enthält nur Gesamtbelegung. Es gibt dafür keinen anfänglichen Los-/Artikelmengenbeleg. Ein Startwert größer Null reicht somit für Flächenabgleich, aber nicht für Stück-/Los-Roll-forward. Die bereitgestellten Jahresfixtures starten bei `finishedGoodsUsed=0`, `capacity=1`; der dreimonatige Flow-Smoke bei `used=0`, `capacity=30`.

## 12 Monatsstichtage 2027

Der Lauf startet in den vorhandenen Jahresfixtures am **2027-01-04** und endet am **2027-12-31**. Für T-0076 ist an jedem Kalender-Monatsultimo nach Tagesabschluss ein unveränderlicher Reconciliation-Snapshot zu speichern. Monatsultimo bleibt das Kalenderdatum; Wochenend-Arbeit wird nicht eingeführt und ein Lagerbewegungsdatum nicht auf Montag verlegt.

| Perioden-ID | Stichtag |
|---|---|
| 2027-01 | 2027-01-31 |
| 2027-02 | 2027-02-28 |
| 2027-03 | 2027-03-31 |
| 2027-04 | 2027-04-30 |
| 2027-05 | 2027-05-31 |
| 2027-06 | 2027-06-30 |
| 2027-07 | 2027-07-31 |
| 2027-08 | 2027-08-31 |
| 2027-09 | 2027-09-30 |
| 2027-10 | 2027-10-31 |
| 2027-11 | 2027-11-30 |
| 2027-12 | 2027-12-31 |

## Gleichungen und Assertions je Stichtag

Für jeden Materialschlüssel `i` und Monatsindex `m` (Januar bis Dezember):

```text
MaterialOpen[i,m] = MaterialClose[i,m−1]
MaterialClose[i,m] = MaterialOpen[i,m]
                  + Σ ReceiptQty[i, date in m, receipt status=received]
                  − Σ ConsumedQty[i, completion date in m, operation status=completed]
                  + Σ ExplicitAdjustment[i,m]
Available[i,m] = MaterialClose[i,m] − PlannedReservation[i, month-end state]
```

Für den aktuell implementierten Eventkatalog ist `ExplicitAdjustment=0` nur dann zulässig, wenn der Lauf keinen Adjustments-/Schwundbeleg benötigt; es wird kein Anpassungstyp ausgedacht. Assertions: jede Receipt-SourceRef einmal; Source-/Movement-/Run-Event übereinstimmend; jede Completion zählt pro Operation genau einmal; geplante Operation reserviert, abgeschlossene/stornierte Operation nicht; `MaterialClose ≥ 0`, `Available ≥ 0`; Transitmenge kommt nicht zu `MaterialClose` hinzu.

Für jedes Fertigwarenlos `l` und jeden Stichtag:

```text
PhysicalClose[l,m] = PhysicalOpen[l,m]
                   + OutputStocked[l,m]
                   + CustomerGoodsReturned[l,m]
                   − CustomerGoodsShipped[l,m]
                   − ProductGoodsShipped[l,m]

ReservedClose[l,m] = ReservedOpen[l,m]
                   + CustomerOutputReserved[l,m]
                   + AcceptedProductSaleReservation[l,m]
                   − CustomerShipment[l,m]
                   − ProductDispatch[l,m]
                   − PreShipmentReservationRelease[l,m]

QuarantineClose[l,m] = QuarantineOpen[l,m]
                     + CustomerRejectedGoodsReturned[l,m]
                     − QuarantineReleaseOrWriteoff[l,m]
AvailableClose[l,m] = PhysicalClose[l,m] − ReservedClose[l,m] − QuarantineClose[l,m]
```

Derzeit existiert kein Quarantäne-Release/Write-off-Typ; folglich darf der Test für diese Bewegung keinen stillen Abgang annehmen. Jede Menge bleibt je Los/Einheit gebunden. Monatliche Assertions: alle drei Endmengen stimmen mit Movement-Snapshot überein; Reserviert + Quarantäne ≤ Physisch; keine Menge/Reserve/Quarantäne negativ; Movement-Period equals `date.slice(0,7)`; stabile Movement-ID und genau ein Quellereignis.

Gesamtkapazität, in den vom State vorgegebenen Lagerflächen-Einheiten:

```text
CapacityOpen[m] = CapacityClose[m−1]
CapacityClose[m] = CapacityOpen[m] + Σ deltaCapacityUnits[date in m]
0 ≤ CapacityClose[m] ≤ finishedGoodsCapacity
FreeCapacity[m] = finishedGoodsCapacity − CapacityClose[m]
```

Assertions: nach jedem Movement stimmen `stockBefore/After`, `capacityUnits=abs(deltaCapacityUnits)`, `availableCapacityBefore/After`; nach jedem Monat stimmt der finale Movement-Roll-forward mit `finishedGoodsUsed`. Stückzahlen nicht mit Speicher-/Flächeneinheiten addieren. Alle Bestands- und Kapazitätssummen müssen auf denselben Stichtag begrenzt sein.

## Sichere Testseedpunkte aus vorhandenen Regressions

Der vorhandene Dreimonatslauf `prototype/v3-t0069-monthly-order-product-flow-smoke.mjs` ist der beste Jahresverlängerungsanker: Start `2027-01-04`, Run-ID `T0069-G5-MONTHLY-FLOW-1`, Seed `fixed-monthly-order-product-flow`, Material `steel=100`, Fertigwarenkapazität `30`, Startbelegung `0`; er führt eigene Produktproduktion/-verkauf und Kundenauftrag durch, mit einer Ablehnung und zwei Dispatches über drei Monatsabschlüsse. Eine Jahresvariante darf diese schon benutzten Testwerte/Übergänge wiederverwenden, muss neue periodische Randdaten als Fixture-Inhalt festhalten und darf sie nicht als Markt-/Produktregel ausgeben.

Weitere genaue Übergangspunkte sind vorhanden und unverändert integrierbar:

- `prototype/v3-run-orchestrator-regressions.mjs`: synthetischer internationaler Eingang, `steel` von Startmenge 10 auf 12 bei Zugriff Menge 2, Order am 2027-01-04 und Receipt am 2027-01-05; Replay idempotent, Payloadkonflikt fail-closed, Run-Restore und Cross-Tamper abgewiesen.
- `prototype/v3-run-orchestrator-regressions.mjs`: Kunden-Retoure nach Zurückweisung, Datum 2027-01-08, Stückzahl 2; Bestand geht von 0 auf 2, Quarantäne von 0 auf 2, verfügbar 0, Replays idempotent, Kapazitätsüberlauf ohne Mutation fail-closed.
- `prototype/v3-t0069-monthly-order-product-flow-smoke.mjs`: drei Monatsend-Abschlussdaten sind dort schon an den 31.01., 28.02. und 31.03. verankert, aber die Assertions prüfen bislang nur Monatsszenarien/Entscheidungen, nicht vollständige Mengen-Roll-forwards.

Die 10→12-Receipt-Fixture ist ein separater Testzustand, nicht derselbe Anfangsbestand wie steel=100; A02 darf Werte nur innerhalb einer explizit dokumentierten einzelnen Fixture kombinieren, nicht aus zwei Testfällen zusammenaddieren.

## Konkreter Umsetzungsauftrag an A02

1. Erweitere die bestehende dreimonatige Shared-Run-Flow-Fixture als additive 12-Monats-Regressionsfixture bis `2027-12-31`; schreibe die zwölf Stichtage vorab fest. Der Seed und Startwerte müssen explizit sein. Bevorzugt werden vorhandene T-0075-Dreimonatswerte/-übergänge wiederverwendet; weitere Receipt-/Retoure-Übergänge dürfen nur mit vollständigen bestehenden Fixtureinputs übernommen werden.
2. Erfasse am jeweiligen Kalendermonatsultimo nach `closeV3RunDay` einen Test-Harness-Snapshot. Belege opening, receipts, completed operation consumption, geplante Materialreservation, physische Fertigwaren, reserviert/verfügbar/quarantänisiert, belegte Lagerfläche und freie Kapazität pro Material-ID/Lot/Einheit. Keine Snapshotdaten in eine Geschäftsbuchung umdeuten.
3. Prüfe pro Stichtag die obigen Gleichungen; Opening für Folgemonat muss identisch mit dem Closing des Vormonats sein. Prüfe Jahresendwert gegen den nach `validateV3RunState()` bestätigten Endzustand.
4. Durchlaufe mindestens einen vorhandenen Supply-Receipt-Pfad, einen Produkt-Output/Acceptance/Reject/Dispatch-Pfad sowie den existierenden Kunden-Retoure-Quarantänepfad; führe Zugang, Reservation, Verbrauch, Versand und Return in einer einzigen sauber dokumentierten integrierten Fixture, falls die bestehenden IDs/Verträge es erlauben. Andernfalls bleiben getrennte Slices klar getrennt und G6 NONPASS.
5. Negativfälle: doppelte Movement-ID/SourceRef und geänderte Payload, Movement ohne Source-Event, Operation-Verbrauch doppelt, negativer Bestand, manipulierte Vor-/Nachmengen, Retouren-Kapazitätsüberschreitung, `reserved+quarantine > physical`; vorher/nachher deep equality bei abgewiesener Mutation.
6. JSON Save/Restore an allen zwölf Stichtagen oder für jede Art von Monatszustand; gleiches Seed wiederholen und Snapshot-/Endhash vergleichen. `run.js` nicht ändern solange der getrennte A02 T-0078 Recoverylauf an dessen Persistenzpfaden arbeitet.
7. Gebe an A03 konkrete Mengenbewegungs-/Quellbelege zur Prüfung; A03 prüft keine Bewertung ohne Preis-/Wertquelle. A09 prüft unabhängig alle zwölf Monatsvektoren, Movement-/Event-Bindung, Dedupe, Restore und Kapazitätsgrenzen. T-0076 ist erst PASS, wenn jeder Monat besteht und beide Reviews PASS sind.

## PASS/FAIL-Rubrik für A01

| Kriterium | PASS nur wenn | FAIL/NONPASS, wenn |
|---|---|---|
| 12 Monatsstichtage | Alle 12 oben genannten Kalenderenden werden erzeugt und eindeutig mit Period-ID ausgewiesen. | Ein Monat/Stichtag fehlt, um einen Arbeitstag verschoben, doppelt oder nicht reproduzierbar. |
| Materialfluss | Für jeden Material-ID-/Mengenmaß-Schlüssel gilt Open+Receipt−CompletedConsumption+belegte Adjustments=Close. | Menge wird nicht aus Quellen rekonstruiert, Material-ID fehlt oder Differenz bleibt. |
| Reservierungen | Geplante Mengen sind separat sichtbar; nur offene Pläne binden Bestand; verfügbar ist nie negativ. | Reservierung wird als physischer Verbrauch behandelt oder geplante Menge fehlt. |
| Fertigwaren-Lose | Physisch je Lot stimmt aus Produktion/Customer Output/Retouren minus Shipping. | Lot-/Eventmenge fehlt, falsche Einheit oder Doppelzählung. |
| Statusaufteilung | Reserved/Quarantine/Available sind je Stichtag getrennt und Summe konsistent zu physical. | Quarantäne verschwindet ohne Übergang, Reserve/Quarantine übersteigt physical. |
| Lagerkapazität | Belegung und freie Kapazität rollen mit `deltaCapacityUnits` und sind an jedem Monat ≤ Kapazität. | Stück-/Kapazitätseinheiten vermischt, negativer/falscher Bestand oder Überlauf. |
| Source & period | Jede Bewegung hat Datum, Periode, stabile Source-/Movement-ID, Runbindung und einmalige Eventevidenz. | Orphan, falsche Periode, Wiederholung oder ungebundene Bewegung. |
| Restore & replay | Stichtagssnapshots, Event-/Statehash und Fortsetzung bleiben beim JSON-Export/Import identisch; Wiederholungen no-op. | Hashabweichung, Doppelbewegung oder Restore-Tampering nicht erkannt. |
| Fail-closed | Ungültige Transitionen ändern keinerlei Mengen-/Kapazitäts-/Eventstate. | Teilmutation, negative Werte oder inkonsistentes Ereignis bleibt gespeichert. |
| Fachgrenze / Reviews | Bewertungen/COGS bleiben klar `pending`; A03 und A09 bestätigen die Mengen- und Periodenabgrenzung. | Plan-/Illustrationspreis wird als Istwert gebucht oder erforderlicher Review fehlt. |

**Abgrenzung:** Die Quellbasis stützt einen Mengen-/Kapazitätsnachweis, nicht Materialbewertung, BAB, COGS oder Hauptbuch. T-0076 kann damit sein bestehendes Mengen-Gate erreichen; T-0077 bleibt dafür eigenständig offen. Der Bericht verlangt keine Änderung an T-0077 und es gibt keinen Konflikt zur separaten T-0077-Kundenledger-Monatsgrenzenprüfung.

**Änderungen/Tests:** Keine Codeänderung und keine Regression ausgeführt. Die genannten Tests wurden nur statisch gelesen. Kein Commit/Push.
