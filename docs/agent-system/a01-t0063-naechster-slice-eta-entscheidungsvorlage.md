# A01 – T-0063 nächster Implementierungsslice (CP-0434)

## Empfehlung an A01

Zuerst read-only von A02 prüfen lassen, ob echte offene Materialbestellungen im V3 Shared Run vorliegen und welche stabile Referenz/Status-/ETA-Daten vorhanden sind. Nur falls dieser Zustand bereits existiert, A03 um einen Nichtbuchungsvertrag bitten und danach die synthetische ETA-Projektion an eine einzelne offene Bestellung anbinden. Die Projektion dürfte nur das erwartete Datum verschieben; sie änderte weder Bestand noch Bestellung, Lieferantenvertrag, Geld oder D-0169-Anfragen.

### Begründung

- Ein vorhandener Makro-ETA-Projektionskanal kann laut A08 maximal fünf Kalendertage ausgeben; im aktuellen gemeinsamen Run ist seine T-0066-Bestellreferenz jedoch nicht nachgewiesen.
- Die amtlichen Destatis-Importpreise belegen Preisbewegungen bestimmter Produktgruppen, keine Lieferzeiten und keine betriebliche Material- oder Lieferantenexposition. Der Destatis-Index bleibt getrennte Referenz und wird nicht als Delay-Ursache genutzt.
- VPI-Warenkorb ist auf private Haushaltsausgaben bezogen, daher kein geeigneter Beschaffungskostenersatz.
- EZB-Wirkungen auf Firmenfinanzierung sind indirekt und zeitlich variabel; dieser Pfad erfordert einen separaten A03-Vertragsbezug und ist derzeit kein kleinerer sicherer Slice.

### Vorläufige Abnahmekriterien, erst nach Fachreview verbindlich zu machen

1. Neutral/keine Störung lässt ETA, Bestellung und Bestand unverändert.
2. Ein ausdrücklich synthetisches Opt-in-Fixture wirkt nur auf genau eine referenzierte offene Bestellung und innerhalb eines transparenten Limits.
3. Fehlende/fremde/geschlossene/erhaltene/stornierte Bestellung bleibt neutral; doppelte oder mutierte Referenz fail-closed.
4. Same-seed Replay und Save/Restore reproduzieren ETA.
5. Bestellung, Mengen, Preis, Bestand, Rechnung, BAB/COGS, Finance/Ledger/Cash und D-0169-Gesamtzahl sind vor/nach identisch.
6. UI kennzeichnet den Wert als Szenario-ETA, keine reale Lieferprognose.

**Fachgrenzen:** CP-0426/0429/0430/0432: Destatis-Referenz ohne automatische Kostenwirkung. D-0169 bleibt alleiniger Gesamtanfragefaktor. A03 reviewt vor A02-Implementierung; A09 prüft unabhängig danach.

**Fallback:** Falls der V3 Shared Run keine echte offene Materialbestellung bereitstellt, nicht extra einen Beschaffungsvorgang oder Schemafeld erfinden. Stattdessen A02 soll einen getrennten, bestehenden `getV3RunOperatingImpact`-Pfad operationalisieren, sofern noch nicht abgeschlossen: Nachfrage-/Zuschlagsmenge → geplante Stunden → Kapazität/Auslastung, ohne doppelte Nachfrage- oder Finanzwirkung.
