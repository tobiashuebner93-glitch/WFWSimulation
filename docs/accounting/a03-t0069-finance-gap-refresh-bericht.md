# A03 – T-0069 Finanz-Gap-Refresh

**Status:** Fachlicher Gap-Abgleich abgeschlossen; keine Implementierungs- oder Buchungsfreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Bezug:** T-0066, T-0067, T-0069; D-0162, D-0165–D-0168; CP-0330–CP-0337
**Stand der Quellen:** 31.10.2026
**Abgrenzung:** Additiver Bericht. Der ältere `a03-t0069-finance-bridge-blocker-bericht.md` bleibt als historischer Zwischenstand unverändert. Keine Produktregel, kein Code, keine Datenbank-/Schemaentscheidung und kein Checkpoint wurden geändert.

## Ergebnis in Kürze

Der frühere Blockerbericht bildet den V3-Entscheidungs- und Runtime-Stand nicht mehr vollständig ab. Die konkreten Einwände zu einer fehlenden V3-Szenario-Rechnung, SimTAX, Fälligkeit und Kundenentscheidung sind für den begrenzten D-0166/D-0168-Ablauf durch spätere Entscheidungen und Implementierung überholt. Das beseitigt nicht die verbleibenden Lücken bei Plan-/Ist-BAB, Kosten- und Vorratsbewertung sowie einer vollständigen Jahres-Cash-/Ledger-Reconciliation. Der Finance-Runtime-Umfang bleibt ein begrenzter, ereignisbasierter Subledger; er ist kein vollständiges Hauptbuch oder Steuerabrechnungssystem.

## Überholte Blockerbehauptungen

Der ältere Bericht erklärte unter anderem, es gebe keine entschiedene V3-Rechnungs-/Forderungsbehandlung, keinen V3-Steuersatz bzw. Fälligkeitsvertrag und keine integrierte Kundenentscheidung. Diese Aussagen waren zum damaligen Prüfstand zutreffend, sind aber nun für den ausdrücklich begrenzten Szenariopfad überholt:

- **D-0165 (2026-10-31):** bis zur separaten Rechnungsmodellierung gelten in V3 14 Kalendertage für Kunden- und Lieferantenposten; bestehender Anker, Zählweise und Wochenendverschiebung bleiben bestehen. 19 % SimTAX gilt nur für ausdrücklich steuerpflichtig markierte Rechnungspositionen bis zur V5-Prüfung. Es wird kein Steuerstatus für nicht gekennzeichnete Positionen unterstellt.
- **D-0166 (2026-10-31):** Eine vereinfachte V3-Szenariorechnung wird erst nach belegter, vertragsgemäßer Leistung/Lieferung und positiver Kunden- oder autorisierter Empfängerentscheidung erzeugt. Sie verwendet den unveränderlichen angenommenen Nettopreis `R`; die definierte V3-Szenarioposition wird mit 19 % angesetzt. Rechnungsdatum ist die positive Kundenentscheidung; der Fälligkeitsanker ist das spätere Datum aus Leistung und Rechnungsdatum, mit 14 Tagen nach D-0165. Netto, SimTAX, Bruttoforderung und Zahlung bleiben getrennte Werte/Ereignisse. Die Regel erteilt keine allgemeine Buchungsfreigabe.
- **D-0167 (2026-10-31):** Das Leistungsdatum ist der Abschluss des letzten vertraglich erforderlichen Produktionsschritts. Lieferung und Kundenentscheidung/Abnahme bleiben eigenständige Ereignisse.
- **D-0168 (2026-10-31):** Für die offene Szenariorechnung wird vollständige Kundenzahlung am Fälligkeitstag modelliert. Bank/Cash steigt und Bruttoforderung sinkt; Erlös wird nicht ein zweites Mal erzeugt. Am selben Tag gehen Kundeneingänge den eigenen Zahlungen voraus. Keine Verzugs-, Ausfall- oder Zahlungsmoralwirkung wird unterstellt, solange sie nicht modelliert ist.

Die zugehörige begrenzte Szenarioroute validiert A02-Lauf, Kunden-/Empfängerbindung, Liefernachweis und abgeschlossene Operationsschritte und erzeugt stabile, idempotente A03-Ereignisse. A09 hat die entsprechende Annual-Smoke-/Restore-Strecke am 31.10.2026 als PASS geprüft; CP-0337 hält den Restore-Re-Review fest. A03s begrenzter Fachreview ist in CP-0330 dokumentiert. Das ist **kein** Beleg eines allgemeinen Invoice-Adapters oder einer vollständigen Finanzbuchhaltung. Die generische `recordV3CustomerPerformance`-Funktion bleibt eingeschränkt (gleiche Erlös-/Forderungssumme; keine Mehrzeilen-/Steuerfälle); der szenariospezifische D-0166-Pfad hebt diese Einschränkung nicht allgemein auf.

Ebenfalls überholt ist die ältere Behauptung, die A02/A05-Route enthalte noch keinen expliziten Kundenentscheid: Kunden-/autorisierte Empfängerentscheidung und deren Rollenbindung sind im gemeinsamen Run enthalten. Der eigenständige Browser-/Geräte-Gesamtnachweis bleibt davon unberührt; A12s Browserreview war wegen Checkout-Zugriffsblockade nicht ausführbar.

## Verbleibende A03-Lücken und notwendige Evidenz

### T-0067 – Plan-/Ist-BAB

**Abgedeckt:** D-0162 und der T-0067-Fachvertrag legen den Planrahmen fest: `R` ist Nettoplanpreis; DB I zieht nur ausdrücklich variable Kosten ab; direkte Einzelkosten bleiben getrennt; BAB verteilt Kosten im Rahmen der KLR und ist kein zweiter Aufwand- oder Cashposten. Kalkulationsvorschau und angenommener Snapshot sind nicht buchend; der angenommene Plan bleibt unveränderlich.

**Offen:** Eine belastbare Ist-Rechnung benötigt explizite, datierte und quellengebundene Ist-Kosten je Vorgang/Kostenart, eindeutige Zuordnung zu Auftrag/Produkt und Abrechnungsperiode sowie die abgegrenzten BAB-Pool- und Verteilungseingaben. Der gemeinsame Jahreslauf liefert diese vollständige Ist-Kosten- und Periodenkette derzeit nicht. Geplante Zeiten, Angebotswerte oder BAB-Sätze dürfen nicht als tatsächliche Kosten gebucht werden; fehlende Kosten dürfen nicht stillschweigend auf null gesetzt werden. Es fehlt daher die überprüfbare Plan/Ist-Abweichungs- und Periodenüberleitung, nicht die Rechenregel für den Plan-BAB.

### T-0066 – Kosten und Vorräte

**Offen:** Die bestätigten 12.800 € sind der Eröffnungs-Gesamtwert des Vorratspostens, keine belegte Gruppenaufteilung. Es fehlen Einzelbewertungen für Stahl (einschließlich Vorjahresschlusswert) und weitere Vorratsgruppen sowie belastbare Ein- und Ausgangsmengen mit Beleg, Datum, Preis, Kostenkategorie und Bewertungsgrundlage. Materialverbrauch, unfertige/fertige Erzeugnisse, COGS und Bestandsabgang dürfen daraus nicht hergeleitet werden. Frühere Profilwerte für einzelne Materialgruppen sind keine bestätigte Eröffnungsbewertung; insbesondere darf kein Restbetrag zur rechnerischen Verteilung angesetzt werden.

### T-0069 – Jahres-Cash-/Ledger-Abgleich

**Abgedeckt:** Der kontrollierte Jahres-Smoke prüft aktuell einen begrenzten Auftrag und den D-0166-Rechnungs-/D-0168-Zahlungspfad einschließlich serialisiertem Save/Restore und Monatsansichten.

**Offen:** Es gibt keine vollständige monatliche Eröffnungs-/Schlussbestandsüberleitung und damit keine vollständige 12-Monats-Cash-/Ledger-Reconciliation. Es fehlen unter anderem ein allgemeiner Hauptbuch-/Journalabgleich, vollständige Lieferantenzahlungen und deren OP-Verlauf, Steuerabführung, COGS-/Lagerbewertung, Kredit-/Zins-/Tilgungsbuchungen und abgestimmte Bestandskonten. Die dokumentierte Finance-Runtime schließt diese Wirkungen ausdrücklich aus; ein aus Cashflows abgeleiteter Schlussbestand oder ein ausgeglichenes Ledger darf nicht behauptet werden.

## Nächste sichere A03-Arbeit

Ohne neue Regelentscheidung kann A03 als nächstes entweder:

1. eine **nicht buchende** Ist-BAB-Abgleichsansicht ergänzen, die ausschließlich explizite, datierte, quellenreferenzierte Ist-Kosten verbraucht und Plan, angenommenen Plan und Ist strikt trennt; fehlende Eingaben werden als fehlend/offen angezeigt, oder
2. einen Daten-/Evidenzvertrag für T-0066 und T-0069 dokumentieren, der Pflichtfelder und Prüfschritte für Quelle, Ereignis, Datum/Periode, Betrag, Kosten-/Steuer-/Bestandskategorie und Idempotenzreferenz festlegt.

Bis die nötige Evidenz vollständig vorliegt, bleiben Erlös-, Forderungs-, Steuerverbindlichkeits-, COGS-, Vorrats-, Lieferantenzahlungs- und Hauptbuchbuchungen außerhalb dieses nächsten Schritts. Es wird weder eine Regel ergänzt noch ein Wert imputiert. Die schmale Szenariorechnung und -zahlung nach D-0166/D-0168 bleibt auf diesen ausdrücklich freigegebenen Fall beschränkt.

## Geprüfte Belege

- D-0165–D-0168, Decision Log, Stand 31.10.2026.
- `docs/accounting/a03-t0069-finance-bridge-blocker-bericht.md` (historischer Ausgangsbefund; unverändert).
- `docs/accounting/a03-t0069-v3-finance-handoff-matrix.md` (aktuelle Finanzgrenze und Status).
- T-0066-/T-0067-/T-0069-Verträge und Ticketstatus, Stand 31.10.2026.
- `prototype/v3-finance-runtime.js` und `prototype/v3-year-order-smoke.mjs`, Stand 31.10.2026.
- CP-0330 und CP-0337 (begrenzter Finance-Review bzw. Restore-Re-Review).

**Adressat für Rückfragen und nächste Koordination:** A01 – MASTER_ORCHESTRATOR.
**Checkpoint:** keiner; CP-0338 ist durch A11 reserviert.
**Commit/Push:** keiner.
