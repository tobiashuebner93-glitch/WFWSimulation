# A05-T-0064 – Schnittstellen- und UI-Abgleich V3

**Status:** Implementierungsnotiz gegen den stabilisierten A02-Vertrag, 2026-10-31
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent/Goal/Ticket:** A05 – FRONTEND / MG-002 / T-0064
**Grenze:** Nur neuer Pfad `prototype/v3/`; keine Änderung an V1/V2 oder Architektur/Schema.

## Vertrag und Integration

Die UI bindet `../v3-company-formation.js` über native ES-Module ein und verwendet ausschließlich `createV3FormationState`, `applyV3FormationEvent` und `validateV3FormationState`. Jede Mutation wird als Ereignis mit `eventId`, `type`, `effectiveDate` und `sourceRef` übergeben. Die UI mutiert den Zustand nicht direkt. Der A02-Vertrag ist für dieses UI die maßgebliche State-Machine; bei einem Fehler werden Fehlermeldung und unveränderter Zustand gezeigt.

Der Einstieg fragt Szenario-ID, Datum, Gründer-ID, initiale Rechtsträger-ID und deren Quellenreferenz explizit ab. Dadurch werden weder Startdatum noch Entity-ID oder Nachweis erfunden. Das A02-Modell startet mit einem Einzelunternehmen als bestehendem Ausgangsrechtsträger; die Gründungsplanung beginnt unabhängig davon im Stadium `idea`.

## Bildschirmzuordnung

1. **Gründung / Tragfähigkeit:** Geschäftsmodellabschnitte laufen über `ADVANCE_FOUNDING_STAGE`; Tragfähigkeit ist nur nach Markt-, Angebot-, Kapazitäts-, Kosten-, Finanzierungs- und Anforderungseingaben mit je eigenem Quellenbezug bewertbar. Fehlende Werte bleiben unvollständig. Die UI speichert die explizite Nutzerbewertung `viable` oder `not_viable`; sie berechnet keine Rechts- oder Tragfähigkeitsaussage selbst.
2. **Rechtsform:** Nur `einzelunternehmen` und `gmbh_co_kg` sind auswählbar. Bei der zweiten Form entstehen getrennte GmbH- und KG-IDs mit je einer expliziten Inhaber-/Kontrollreferenz. Die Kandidaten AG, eG und GmbH & Co. KGaA sind sichtbar, aber deaktiviert. Gründungsvorbereitung, Registerstatus je Rechtsträger und Betriebsbereitschaft folgen den A02-Ereignissen.
3. **KG vor Registereintragung:** Optionaler, ausdrücklich zustimmungspflichtiger Vorgang. Je Gesellschafter werden getrennte `partnerIds[]`- und Zustimmungsreferenzen in gleicher Reihenfolge verlangt; außerdem muss der konkrete §123 Abs.1 i.V.m. §161 Abs.2 HGB-/§107 HGB-Prüfbeleg als `cleared` referenziert werden. Die UI behauptet nicht, dass eine reale Prüfung stattgefunden hat.
4. **Kooperation:** Gemeinsame Beschaffung und Arbeitsgemeinschaft sind getrennte Typen. Zweck, Vertragsbeleg, Rechtsträger und spätere Rechtsform-/Wettbewerbsprüfung werden explizit geführt.
5. **Unternehmenserwerb:** Share Deal und Asset-/Betriebskauf verwenden getrennte A02-Ereignisse. Bei Asset-/Betriebsübertragung erfasst die UI konkrete Prüfergebnisse zu §613a BGB und §25 HGB, ggf. Beschäftigtenprüfungen, Quellenreferenzen und Wettbewerbsreview. `needs_review` hält den Vorgang offen. Die UI leitet keine rechtliche Anwendbarkeit ab.

## Finanzgrenze

`financeHandoffs` werden separat als „keine Finanzwirkung bis zu einem expliziten A03-Ereignis“ angezeigt; erforderliche Inputs und A02-Status bleiben sichtbar. Die Oberfläche erzeugt keine Buchung, Verbindlichkeit, Forderung, Liquidität, Gebühr, Steuer, Kaufpreis oder Finanzierung. Fehlende Beträge bleiben nicht verfügbar und können nicht als 0 interpretiert werden. Eine geschlossene Kooperation oder Transaktion ist kein Nachweis einer ausgeführten Zahlung.

## Bedienbarkeit / Testgrenzen

Die Oberfläche ist mobil-first, mit nativen Formular-Labels, Tastaturbedienung, sichtbarem Fokus, `aria-live`-Status und reduzierter Bewegungsunterstützung. Diese statische Einzelroute ist ein neuer V3-Einstiegspunkt und noch keine Integration in die V2-Navigation oder in einen Releasepfad. UI-Smoke-Tests verwenden ein DOM-freies Node-Contract-Harness sowie den realen A02-Export; visueller/echter Browser-Playtest bleibt unabhängig durch A12.

