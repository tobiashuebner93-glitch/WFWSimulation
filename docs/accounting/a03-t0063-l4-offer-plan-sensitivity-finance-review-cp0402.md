# A03 – T-0063 L4-Angebots-Plan-Sensitivität (CP-0402)

**Ergebnis:** Bedingtes fachliches PASS für eine ausschließlich opt-in, nichtbuchende Kalkulationssensitivität auf noch nicht abgegebene V3-Angebote.

**Zulässige Begrenzung:** Direkte Material-/Logistikkosten dürfen nur bei expliziter Kostenkategorie und ausdrücklicher Spielerauswahl mit `ProcurementPlanIndex / 100` angepasst werden. Direkte Lohnkosten dürfen nur mit `WagePlanIndex / 100` angepasst werden. Basisbeträge sind ausdrücklich Januar-2027-Planwerte; Kosten anderer Kategorien bleiben unverändert. Der Nettoplanpreis `R` ändert sich nicht automatisch. Der Spieler muss einen Sensitivitätspfad wählen; bestehende Angebotsentwürfe dürfen ohne diese Wahl als unadjustierte Spielerwerte kalkuliert werden.

**Finance- und Buchungsgrenzen:** Keine Istkosten, Bestandsbewertung, BAB, Rechnung, Verbindlichkeit, Forderung, Bilanz, Ledger, Cash, Steuer- oder Vertragsänderung. Bei Abgabe friert der Kalkulationssnapshot die tatsächlich verwendeten direkten Kosten einschließlich Kategorie, Basisperiode, Index, Quelle/Parameter und Wirksamkeitsperiode ein. Angenommene Angebote, Verträge, Bestände und Istkosten werden nie nachbewertet.

**Fehlende oder mehrdeutige Eingaben:** Bei gewählter Sensitivität und fehlendem/mehrdeutigem benötigtem Index bleibt das Ergebnis `pending`; kein stiller Index 100 und kein stiller Wechsel in die unadjustierte Berechnung. Spieler kann explizit auf den unadjustierten Pfad wechseln. BICI darf nicht zusätzlich auf Material, Logistik oder Lohn angewandt werden; gleiche Komponenten nicht kaskadieren/addieren.

**Rundung:** A03 empfiehlt den vorhandenen positiven half-up-Geldpfad und Rundung je direkte Kostenzeile auf Cent; Indexaggregation bleibt ungerundet. Beobachtungsperiode und Wirksamkeitsperiode sind getrennt nachzuweisen.

**Risiken:** falsche Januar-Basis, gemischte Kostenkategorien, Index-Doppelzählung, fehlende Herkunft und Verwechslung von Plan mit Ist. Die vorhandene Runtime übergibt aktuell nur id/amountCents/variable; A02 muss Kategorien und Indexprovenienz vor Snapshotbildung spezifizieren.

**Tests/Browser/Git:** von A03 nicht ausgeführt. A03 änderte keine Dateien und erteilte keine Implementierungsfreigabe. Siehe CP-0402.
