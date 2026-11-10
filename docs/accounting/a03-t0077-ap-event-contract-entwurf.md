# A03 – T-0077: Lieferanten-AP-Ereignisvertrag (Entwurf)

**Status:** Vorschlag für A01/A02/A09; nichtbuchend, keine Finanz- oder Schemafreigabe  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Rolle:** A03 – ACCOUNTING_FINANCE  
**Bezug:** MG-002 / SLG-002.2 / T-0077 / T-0069 G7; A02-Hand-off `a02-t0077-g7-procurement-finance-handoff.md`  
**Stand:** 2026-11-05

## Zweck und Grenze

Dieser Entwurf beschreibt die minimale Evidenz und Kontrolllogik, die A02 für einen ersten Lieferantenrechnungs-/AP-Slice bereitstellen müsste. Er ist ein fachlicher Übergabevertrag, keine Implementierung, kein Kontenplan und keine Freigabe, eine offene Verbindlichkeit, Ausgabe, Steuer oder Bankbewegung zu buchen.

Bis ein getrenntes Ticket die Finanzbehandlung ausdrücklich autorisiert, bleiben Ereignisse **evidenzseitig `pending_non_posting`**. Ein physischer Wareneingang, eine Bestellung, ein Angebot oder eine geplante Zahlung dürfen weder einen AP-Saldo noch Cash/Bank oder ein Journal verändern. T-0077/G7 bleibt insgesamt offen.

## Ereignisarten und Mindestbelege

### 1. Lieferanten-/Bestellbezug

Für spätere Zuordnung müssen alle folgenden Referenzen stabil und nicht wiederverwendbar sein:

- `runId`, `eventId`, `sourceRef`, Lieferanten-ID, Bestell-ID und Bestellzeile;
- angenommene Angebots-/Vertragsreferenz und Fingerprint des unveränderlichen Preis-/Bedingungssnapshots;
- Material/Leistung, bestellte Menge und Einheit;
- Bestelldatum und vereinbarte Zahlungsbedingung, sofern tatsächlich belegt.

Ein Angebot oder Preis-Snapshot ist allein keine Rechnung und erzeugt keinen AP-Posten. Weicht die Rechnung davon ab, ist die Differenz sichtbar zu halten und die Zuordnung bleibt pending bis zur ausdrücklich autorisierten Prüfung.

### 2. Lieferantenrechnung / AP-Evidenz

Mindestens erforderlich:

- eindeutige Rechnungs-ID und unveränderliche Quellreferenz/Fingerprint;
- Lieferant, zugeordnete Bestellung/Bestellzeile und vorhandener Lieferschein-/Wareneingangsbezug;
- Rechnungsdatum, getrenntes Leistungs-/Lieferdatum falls angegeben, und auf dem Beleg ausgewiesenes Fälligkeitsdatum;
- expliziter Gesamtbetrag, Währung und ausgewiesene Position(en);
- Steuerkennzeichnung und Steuerbetrag so, wie sie im Beleg vorliegen, oder explizit `unknown`;
- dokumentierter Status (z. B. erfasst, bestritten, storniert/gutschriftbezogen).

Netto, Steuer, Bestand, Aufwand und eine Abweichung zwischen Rechnung, Angebot und Wareneingang werden nicht vom Lauf abgeleitet. Bei fehlendem Betrag, fehlender Währung, unbekannter Rechnungsquelle oder mehrdeutiger Verknüpfung bleibt der Beleg `pending_non_posting`; es wird kein Ersatz- oder Nullbetrag eingesetzt.

### 3. Lieferantenzahlung (nur wenn separat autorisiert)

Eine Zahlungsevidenz darf nur aus einem ausdrücklich autorisierten Zahlungsvorgang stammen. Sie benötigt:

- stabile Zahlungs-ID/Quellreferenz und tatsächliches Zahlungs-/Valutadatum;
- zugeordnete Rechnung/AP-Referenz, Empfänger/Lieferant und Zahlerkonto;
- tatsächlich ausgeführten Betrag und Währung;
- Banktransaktions-/Auszugsbeleg oder, falls es eine Szenarioannahme ist, die explizite Regel-/Fixture-ID und deren Autorisierung;
- klare Kennzeichnung, ob es ein geplanter Versuch, fehlgeschlagener Versuch oder ausgeführter Abgang ist.

Ein Fälligkeitstermin, ein geplanter Retry oder eine verfügbare Liquidität beweist keine ausgeführte Zahlung. Geplante/fehlgeschlagene Versuche dürfen die Bank nicht vermindern. Ohne Zahlungsautorisierung und eindeutigen Beleg gibt es keinen Cash-/Bankabgang.

## Fail-closed-Invarianten

- Identische `(eventId, sourceRef, payload fingerprint)`-Wiederholung ist No-op; eine wiederverwendete ID/Quelle mit anderem Payload ist ein Fehler.
- Doppelte Rechnungs-ID, doppelte Bestellzeile, widersprüchlicher Lieferant oder unklare Rechnungs-/Bestell-/Wareneingangsverknüpfung wird abgewiesen oder pending gehalten, niemals geraten.
- Fehlende Währung, Betrag, Datum, Steuerquelle oder Zahlungsbeleg darf nicht mit 0, einem Standardwert oder einem Marktpreis gefüllt werden.
- Zahlung vor Rechnung, falscher Empfänger/Zahler, Währungsabweichung, nicht zugeordnete Zahlung, Zahlung über den offenen Posten und Zahlung auf bestrittene/abgeschlossene Rechnung fail closed; keine automatische Rundung/Verrechnung.
- Gutschrift, Storno, Teilzahlung, Wechselkursumrechnung, Skonto, Gebühren und Mehrfachzahlungen benötigen eigene referenzierte Ereignisse und eine freigegebene Behandlungsregel; andernfalls pending.
- Ein Ereignisfehler lässt Run-State und Finanzstate unverändert (atomare Anwendung oder keine Änderung).
- Ein Receipt kann die Rechnungshöhe nicht ersetzen; eine Rechnung kann nicht als Zahlung ausgelegt werden.

## Perioden- und Reconciliation-Vertrag (nur nach späterer Autorisierung)

Quelldaten behalten ihre individuellen Daten (`orderDate`, `receiptDate`, `serviceDate`, `invoiceDate`, `dueDate`, `paymentDate`). Die Finanzperiode eines autorisierten AP-/Zahlungsvorgangs richtet sich nach dessen explizitem `effectiveDate` und D-0162-Kalendermonat. Eine bloße Verschiebung oder Lieferung ändert nicht stillschweigend Rechnungs- oder Zahlungsdatum. Periodenzuordnung der Verbindlichkeitsentstehung bleibt offen, bis A03 eine explizite Anerkennungsregel freigibt.

Wenn eine spätere Autorisierung echte AP-Subledgerbewegungen erlaubt, sind mindestens diese Gleichungen je Währung und Periode/Stichtag nachzuweisen:

```text
AP_open + autorisierte Rechnungen - autorisierte Gutschriften
       +/- autorisierte Korrekturen - zugeordnete ausgeführte Zahlungen = AP_close

Bank_open + belegte Einzahlungen - belegte ausgeführte Auszahlungen
          = Bank_close
```

Pending-/evidence-only-Ereignisse sind in diesen Salden nicht enthalten. Die AP-Rollforward-Gleichung begründet für sich weder Aufwand-/Bestandsklassifikation noch Steuerabzug, COGS oder Hauptbuchbuchung. Journal-Soll/Haben und Nebenbuch-/Hauptbuch-Abgleich liegen außerhalb dieses ersten AP-Slices und benötigen einen eigenen freigegebenen Vertrag.

Der Januar/Februar-Testfall muss eine Rechnung und/oder Zahlung über die Monatsgrenze führen und prüfen, dass Fälligkeitsdatum, tatsächliches Valutadatum und Wirksamkeitsperiode getrennt bleiben. Es wird kein Monatsdatum aus dem Rechnungstermin abgeleitet.

## Kleinster sicherer A02-Slice und Übergabe

A02 sollte zuerst feststellen, ob ein tatsächlich vorhandener V3-Lieferantenablauf alle oben genannten Bestell-/Angebot-/Rechnungsquellen liefern kann. Falls nein, lautet der Befund NONPASS mit exakten fehlenden Feldern; keine synthetischen Rechnungs- oder Bankbeträge ergänzen. Falls ja, liefert A02 einen unveränderlichen operationalen Quellbeleg plus einen Monatsgrenzen-/Replaytest, weiterhin ohne Finanzmutation. A03 prüft dann die Feldbindung und pending-/Autorisationstrennung; A09 reviewed die Ereignis- und Periodeninvarianten unabhängig.

Selbst ein bestandener erster Lieferanten-AP-Slice erfüllt T-0077/G7 nicht. Weiter offen bleiben mindestens Payroll, Steuerabführung, Bank-/Kredit-/Dispo-Bewegungen, monetäre Bestands-/WIP-/Fertigwarenbewertung/COGS und ein autorisierter Hauptbuch-/Jahresabgleich.

## Review- und Statusgrenze

- **A03:** dieser Entwurf definiert nur fachliche Evidenz- und Kontrollanforderungen; keine Buchungs- oder Steuerfreigabe.
- **A02:** soll den Bestand der operativen Quellfelder und Grenzen zurückmelden; keine Rechnungswerte erfinden.
- **A09:** soll nach A02-Befund unabhängig Replay, Dedupe, Zuordnung, Fail-closed und Monatsgrenzengleichungen prüfen.
- **A01:** entscheidet über die nächste Ticketzuweisung. T-0077/G7 bleibt offen, bis alle Ticketkriterien erfüllt und unabhängig reviewed sind.

Keine Änderung an CP-0500 oder MCP-2026110401. Kein Schema, Code, Commit oder Push durch diesen Entwurf.
