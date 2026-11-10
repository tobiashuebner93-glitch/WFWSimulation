# A03 – T-0077: Lieferantenpreis-, Rechnungs- und Zahlungsquellen

**Status:** Entscheidungsvorlage; keine neue Produktregel bestätigt  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goal/Tickets:** MG-002 / T-0077 / T-0069 G7  
**Preflight:** 2026-11-07; Branch `main`, HEAD `fdc4960d4bf92fb13f6802e8d0738eb3d9110097`; 753 Statuszeilen vor Berichtserstellung. Vorhandene Änderungen und Stagingzustände blieben erhalten.

## Befund

Der V3-Lieferantenpfad kann Bestellung und physischen Wareneingang mit Menge und Datum belegen. Er enthält aber derzeit keine bestätigte Preis-/Vertragsfassung, keinen Lieferantenrechnungsbeleg und keinen ausgeführten Zahlungsbeleg. Ein Wareneingang ist Mengenbewegung; er beweist weder Rechnungsbetrag noch Steuerstatus, offene Verbindlichkeit oder Bankabgang.

Für V3 ist ein Zahlungsziel von 14 Kalendertagen für Kunden- und Lieferantenposten bestätigt (D-0165). Die konkrete Rechnungsstellung und ein V3-Fälligkeitsanker für Lieferantenrechnungen sind davon getrennt. D-0111 beschreibt den Verbindlichkeitstrigger bei Materialeingang ausdrücklich für V1 und wird hier nicht eigenmächtig als V3-Buchungsregel übernommen. D-0166 hält Lieferantenrechnung, Zahlung und Cash als getrennte Ereignisse und verweist für ihre Verarbeitung auf die Lieferantenanker. Bis die V3-Quell- und Auslösebedingungen geklärt sind, bleiben AP-/Payment-Ereignisse `pending_non_posting`.

Der Preisbasisstand D-0128 enthält konkrete, am 27.10.2026 beobachtete Händlerreferenzen für drei V1-Material-Proxies. Diese Werte sind keine Angebote, keine Einkaufsbelege und keine V3-Marktpreise. Sie können nur dann als offen gekennzeichnete Rechenanker in einem neuen V3-Szenario verwendet werden, wenn diese Übernahme bestätigt wird. Alle unten angebotenen Lieferantenpreise und Konditionen wären synthetische V3-Szenarioannahmen.

## Drei Optionen zur Entscheidung

### Option A – Beschaffung bleibt vorerst nichtbuchend

- Bestellung und Wareneingang bewegen ausschließlich Mengen und Liefertermine.
- Ohne angenommenes Preisangebot entstehen weder Rechnungsbetrag noch AP-Posten oder Bankbewegung.
- Vorteil: keine erfundenen Beträge oder Finanzregeln.
- Folge: Der Lieferantenanteil von T-0077/G7 bleibt blockiert und der V3-Einkauf hat vorerst keine vollständige Cashwirkung.

### Option B – Empfohlene, reproduzierbare V3-Szenarioangebote

Ein Szenario-Katalog bietet je geeignetem Material drei unverbindliche, synthetische Angebote. Die Spielerentscheidung speichert Lieferant, Menge, Einzelpreis, Fracht, Zahlungsbedingung und Gültigkeit als unveränderlichen angenommenen Angebots-/Vertragssnapshot. Der Preis bleibt nach Annahme eingefroren.

Als Startanker können – **nur nach Bestätigung** – die passenden Netto-Referenzwerte aus D-0128 dienen; die folgenden Zuschläge/Abschläge und Konditionen wären neue V3-Annahmen, keine Marktbeobachtung:

| Szenario-Lieferant | Preisformel zum bestätigten Materialanker `B` | Lieferannahme | Mindestmenge / Fracht | Spielzweck |
|---|---:|---|---|---|
| Lokaler Händler | `B × 1,20` | am selben Simulationstag verfügbar; begrenzte Menge | keine Mindestmenge; 0 € Fracht | schnell, aber teuer |
| Onlinehändler | `B × 0,95` | 5 Kalendertage; Verzögerungsrisiko separat per Seed | keine Mindestmenge; 7,50 € je Bestellung | günstiger, aber langsamer und mit Versand |
| Großhandel | `B × 0,88` | 8 Kalendertage | Mindestmenge 100 kg bei Halbzeug bzw. 100 Stück bei Normteilen; 0 € Fracht | niedriger Stückpreis gegen Mindestabnahme und Kapitalbindung |

Diese Werte sind bewusst konkrete Testvorschläge, keine Recherchewerte. Die Szenarioangebote müssten eine stabile Angebots-ID, Material-/Einheitenbindung, Gültigkeitsfrist, Mengenstaffel, Fracht, zugesagte Lieferzeit und Zuverlässigkeitsparameter enthalten. Lieferpünktlichkeit darf die ETA beeinflussen, nicht rückwirkend den angenommenen Preis.

### Option C – Ein synthetisches Standardangebot je Material

- Für jedes Material gilt ein transparent gespeicherter Szenario-Stückpreis, abgeleitet aus einer ausdrücklich freigegebenen Preisbasis; kein Lieferantenvergleich und keine Verhandlung.
- Einzelne Bestellung speichert Preis-/Konditionssnapshot. Lieferzeit und Fracht stehen ebenfalls im Szenariodatensatz.
- Vorteil: kleinster implementierbarer Weg zu Rechnungs- und Zahlungsevidenz.
- Folge: Die vorhandene Spielidee mit Lieferantenwahl, Mindestmengen und Konditionen wird nicht abgebildet.

**A03-Empfehlung:** Option B, weil sie den gewünschten Beschaffungskonflikt „schnell/teuer“ gegen „günstig/langsamer“ abbildet und reproduzierbar bleibt. Vor Umsetzung müssen Preisbasis und Annahmen ausdrücklich bestätigt werden. Soll D-0128 nicht als Rechenanker für V3 dienen, braucht Option B stattdessen eine neue, explizit synthetische V3-Basistabelle. Keine der Optionen schreibt reale Marktpreise fest.

## Getrennte Ereignisgrenzen

### 1. Preis-/Vertragsquelle

Ein Angebot wird vom Spiel als V3-Szenarioangebot ausgewiesen. Annahme erzeugt einen unveränderlichen Snapshot mit `supplierId`, `offerId`, `acceptedAt`, Material/Bestellzeilen, Mengen/Einheiten, Stück- und Positionspreisen in EUR, separater Fracht, Preisgültigkeit und Liefer-/Zahlungskonditionen. Angebot und Bestellung allein sind noch keine Rechnung, AP-Evidenz oder Zahlung.

### 2. Invoice-Evidence

Eine Simulation darf erst nach einem expliziten Rechnungsszenario eine Rechnungsquelle erzeugen. Mindestfelder: `invoiceId`, `sourceRef`/Fingerprint, Lieferant, Bestellung/Bestellzeile, Wareneingangsreferenz, Rechnungsdatum, expliziter Rechnungsbetrag und Währung, Steuerkennzeichnung/-betrag oder `unknown`, Status sowie belegtes Fälligkeitsdatum. Fehlende oder widersprüchliche Felder bleiben `pending_non_posting`; der Betrag wird weder aus einer bloßen Lieferung noch aus einem Referenzpreis ersetzt.

Für die vorgeschlagene Spielannahme wäre das Rechnungsdatum der explizit gespeicherte Rechnungstag. Das bestätigte V3-Ziel von 14 Kalendertagen wird auf den dann festgelegten Fälligkeitsanker angewandt; Ankertagszählung und Wochenendregel bleiben nach den bestätigten Entscheidungen bestehen. Ob die V1-Lieferantenregel „Rechnungsdatum als Anker“ für den V3-Szenariopfad übernommen wird, ist in Option B ausdrücklich mitzubestätigen. Ohne Bestätigung des V3-Ankers wird kein Fälligkeitsdatum errechnet.

Invoice-Evidence allein darf zunächst nur einen nichtbuchenden Nachweis erzeugen. Eine echte AP-Saldo-/Journalwirkung erfordert eine gesonderte A03-Autorisierung samt Eröffnungswerten und Gegenkontierung; D-0111 allein erteilt diese V3-Freigabe nicht.

### 3. Payment-Evidence

Ein tatsächlicher simulierter Bankabgang benötigt ein separates `paymentId`/`sourceRef`, Rechnung/AP-Referenz, Empfänger, Zahlerkonto, Zahlungstag, ausgeführten Betrag und Währung sowie eine autorisierte Ausführungsregel. Ein Fälligkeitstag oder fehlgeschlagener Zahlungsversuch beweist keinen Abgang. Bis ein V3-Zahlungsablauf und dessen Cash-Mutation ausdrücklich beauftragt und reviewed sind, bleibt Payment-Evidence ebenfalls `pending_non_posting` und verändert Bank/Cash nicht.

## Benötigte Nutzerantwort für A01

Bitte leite diese Auswahl als **Ja / Nein / Gegenvorschlag** weiter:

1. **Preisquelle:** Option A, B oder C? Empfehlung B. Bei B: Darf D-0128 ausschließlich als klar gekennzeichneter Ausgangsanker für synthetische V3-Angebote dienen, ohne die V1-Entscheidung zu verändern?
2. **Konkrete Szenarioangebote:** Bei Option B, gelten die Tabelle und Formeln oben als Testannahmen (lokal +20 % / sofort / begrenzt; online −5 % / 5 Tage / 7,50 € Fracht; Großhandel −12 % / 8 Tage / Mindestmenge 100)? Änderungen können als Gegenvorschlag auf einzelne Werte beschränkt werden.
3. **Invoice/Fälligkeit:** Soll die Simulation nach akzeptiertem Wareneingang eine separate Rechnungsevidenz mit festgehaltenem Betrag erzeugen und für V3 das Rechnungsdatum als Anker für 14 Kalendertage übernehmen? Die Erzeugung bliebe zunächst nichtbuchend.
4. **Payment:** Soll ein späterer separater Simulatorlauf Zahlungen nur als autorisierte tatsächliche Zahlungsevents abbilden, wobei erst ein explizit ausgeführtes Event den Bankbestand verändert? Höhe/Termin und Verhalten bei unzureichender Liquidität richten sich dann nach dem bestätigten Zahlungsablauf; dieses Ticket entscheidet sie nicht vorweg.

Eine Antwort auf Frage 1/2 genügt nicht, um AP oder Cash zu buchen. Die Schritte Preis-/Vertragsannahme, Rechnung und ausgeführte Zahlung bleiben getrennte Ereignisse.

## Preflight-Digests

| Datei | SHA-256 vor Bericht |
|---|---|
| `AGENTS.md` | `BD9FCB3DE9082E716E2DB0D5B59F824B43B8E1007FDB2BA759DDC591A83A45F7` |
| `docs/agent-system/agent-structure.md` | `6AEC63F774DD47A4396249B006F40843A4C65F53484AD5CB0BAD27EE34688182` |
| `docs/agent-system/agent-rights-matrix.md` | `111373DC950C41DD4191B62A36CACAB730A2E8E34BE757AB55D83D608CC7650A` |
| `docs/agent-system/goals.md` | `BEED7768B5C2D7F8EF1D8280E389E492E0216012A3401BF03254DE734A35F374` |
| `docs/agent-system/ticket-board.md` | `63ED4A6521A29988D0EE03FD741933FB55C2B7E0AC7BB4AB6175805D22545B6E` |
| `docs/agent-system/collaboration-state.md` | `AA7CED7524361FF8D297F57F30D74C66C0EC06882896A2CC52B533D09CC6A8BA` |
| `docs/agent-system/decision-log.md` | `572ECDACD5D725B1C3BA943AA909867CE15323CB26BF254E555DCA9470F21BC1` |
| `docs/accounting/a03-t0077-ap-event-contract-entwurf.md` | `FBDDA863A91053307A603D5B5FA714D1B3D4E19CACAE57378D7A25B60E418C17` |
| `docs/simulation/a02-t0077-g7-procurement-finance-handoff.md` | `4340676E03F9079921DC744DFDB572D0D3FCA88685C20318EF3F7DD2AC1B4E83` |

`git status` vor Erstellung: 753 Einträge insgesamt; keine der bestehenden Änderungen wurde bearbeitet. Ticketboard und Decision Log wurden durch diesen Arbeitsbericht nicht geändert. Kein CP erstellt, kein Commit oder Push.

## Übergabe

**Nächster Adressat:** A01 zur gebündelten Nutzerrückfrage. Nach Bestätigung: A02 modelliert ausschließlich den autorisierten Preis-/Vertragssnapshot und die getrennten Quellbelege; A03 prüft Invoice-/Payment-/Cashgrenzen; A09 reviewed Dedupe, Replay, Restore und Periodenverhalten. Bis dahin bleibt T-0077/G7 offen.

**Quellen im Checkout:** D-0128 in `docs/agent-system/decision-log.md` und `docs/market-data/material-price-baseline-2026-10-27.md`; D-0165/0166 in `docs/agent-system/decision-log.md`; A02-Handoff `docs/simulation/a02-t0077-g7-procurement-finance-handoff.md`; A03-Entwurf `docs/accounting/a03-t0077-ap-event-contract-entwurf.md`.
