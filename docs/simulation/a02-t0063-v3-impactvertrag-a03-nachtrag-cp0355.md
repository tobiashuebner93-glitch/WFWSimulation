# A02 – T-0063: Dokumentnachtrag zum A03-Review L2/L4/L5

**Status:** Nachtrag erstellt; A03-Re-Review ausstehend; keine Implementierungsfreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goal/Ticket:** MG-002 / SLG-002.2 / T-0063
**Abhängigkeiten:** T-0065, T-0066, T-0067, T-0069
**Profil/Entscheidungen:** gemeinsamer V3-Run ab 04.01.2027; D-0161–D-0169
**Vorgänger:** A02-Vertrag/CP-0353, A03 Reviewbericht und CP-0354; CP-0353/0354 bleiben unverändert.

## Preflight und Änderungsgrenze

AGENTS.md, Agentenstruktur und Rechte, Goals, T-0063-Ticket, Collaboration State, Decision Log/D-0169, CP-0353, CP-0354, A03-Bericht `a03-t0063-l0-l6-finanzfachreview-cp0354.md`, A02-Makro-/Integrationsvertrag und A03-Finanzübergabe wurden vor Bearbeitung erneut gelesen. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorbestehende lokale Arbeit blieb erhalten. CP-0355 war bei Preflight nicht vorhanden.

Die Änderung ist auf die Dokumentation von L2, L4 und L5 im bestehenden [Wirkungsvertrag](a02-t0063-v3-unternehmenswirkungsvertrag-entwurf.md) begrenzt. Es gibt keine Code-, Schema-, Produktregel-, Finanz- oder Rechtsänderung. Die Grenzen für L0/L1/L3/L6 wurden inhaltlich nicht verändert.

## A03-Befunde und eingearbeitete Präzisierungen

### L2 – Außenwirtschaft

- FX-Paar, Basis-/Notierungsrichtung und Umrechnung für den Testvorschlag explizit: `USD/EUR`, Euro je USD, Quote je Basiseinheit. Bei einer EZB-Referenz USD je EUR ist die Inversion als solche und mit Quellenstand festzuhalten. Der relative Importkostenindex verwendet `2027-01=100`; der Basisindex behauptet keinen absoluten beobachteten Kurs.
- FX verändert nur eine offene, noch nicht angenommene Beschaffungsplanung. Bei Annahme des Lieferantenangebots bleibt der Preis-Snapshot fest; Planwert ist keine Istkosten- oder Rechnungssumme.
- Exportimpulse verteilen nur die vorhandene D-0169-Gesamtzahl auf stabile, explizit exportfähige Segmente; sie erzeugen keine zusätzlichen Gesamtanfragen.
- Lieferstörungen verschieben ETA als Datum. Tatsächlicher Wareneingang kann nach Beleg die physische Empfangsmenge ändern; ohne getrennte A03-Evidenz keine Wert-, Rechnung-, BAB- oder COGS-Änderung.

### L4 – Inflation und Kostenindizes

- CPI/SPI mit existierender Basis 2020=100 ist von den Business-, Lohn- und Beschaffungsplanindizes getrennt.
- Die Planindizes nennen Basisperiode/-wert, Einheiten für Material/Energie/Lohn/Logistik, explizite Gewichte, Quellen-/Vintage oder synthetische Parameter-ID sowie die komponentenweise Normalisierung und Aggregation.
- Fehlt eine belegte Betriebsstruktur, gilt `V3-PLAN-INDEX-SYNTH-EQUAL-1` mit vier 25-%-Anteilen ausschließlich als synthetisches Testprofil, nicht als Produktionsgewicht.
- Komponenten-/Aggregatwerte bleiben intern ungerundet; Anzeige auf zwei Dezimalstellen. Es gibt keine Cent- oder BAB-Rundung, da keine Finanzbuchung vorliegt.
- FX-, CPI-, Tarif- und Umwelt-/Politikbeiträge erhalten eindeutige IDs pro Komponente/Monat; kein gestapelter Multiplikator. Mehrere Treiber ohne definierte Aggregationsformel lassen den Beitrag `pending`. Kein BAB-, Istkosten-, Bestands-, Lohnlauf- oder Vertragssnapshot-Effekt.

### L5 – MRO und Finanzierungsofferte

- MRO-Ergebnis wird als unverbindliche `indicative` Konditionsanfrage geführt. „Zur Verhandlung angenommen“ ist weder Vertrag noch Finanzereignis.
- Quoteingaben sind explizit: gewünschter Betrag/Währung, Laufzeit, Gültigkeit, Referenzsatz samt Quelle/Stand/Periode, Marge, nominaler Jahres- und Periodensatz samt Periodenbasis. Fehlende Werte bleiben `pending`; A02 setzt sie nicht.
- Ohne A03-bestätigte Umrechnungs-/Rundungsmethode berechnet A02 weder nominalen noch Periodensatz aus Referenzsatz und Marge.
- Weder Quote noch MRO-Änderung noch Verhandlungsannahme erzeugt Auszahlung, Verbindlichkeit, Zinsaufwand oder Cashbewegung. Kein Tilgungsplan, Kreditlimit oder Auszahlungstermin wird abgeleitet. Bestehende Verträge bleiben unverändert.

Die Vorschläge sind weiterhin keine Produkt-, Kredit-, Kosten- oder Investitionsentscheidung. Insbesondere bleibt die ±5-%-FX-Testvariation sowie der Planpass-through synthetisch und nicht empirisch kalibriert.

## Dateien

- `docs/simulation/a02-t0063-v3-unternehmenswirkungsvertrag-entwurf.md` (nur L2/L4/L5 und den dazugehörigen Review-/Losübergabetext präzisiert)
- `docs/simulation/a02-t0063-v3-impactvertrag-a03-nachtrag-cp0355.md` (neu)
- `docs/agent-system/checkpoints/CP-0355.md` (neu)

## Nachweisrollen

- **Ausführung:** A02, Dokumentnachtrag auf Basis A03 CP-0354.
- **Fachreview:** A03-Erstreview CP-0354 NONPASS für L2/L4/L5; Re-Review der Ergänzungen angefordert, noch nicht erfolgt.
- **Unabhängige QA:** nicht ausgeführt; keine Implementierung.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Tests:** keine; reine Dokumentenänderung. Nur Whitespaceprüfung.
- **Git:** Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorbestehende Änderungen anderer Arbeitspakete nicht verändert. Kein Commit/Push.

**Übergabe:** A01 beauftragt A03, ausschließlich die eingearbeiteten L2/L4/L5-Klarstellungen fachlich gegenzulesen. Der Review soll keine Quote, BAB, Planpass-through, Kredit- oder Buchungsfreigabe als implizit erteilen. Bis zum Re-Review bleiben CP-0355 und der Wirkungsvertrag ENTWURF.
