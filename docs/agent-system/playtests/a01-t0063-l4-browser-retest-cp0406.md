# A01 – T-0063 L4-Angebotssensitivität Browserretetest (CP-0406)

**Ergebnis:** Der neue hashgebundene UI-Pfad besteht den begrenzten Desktop-Browser-Smoke.

Ein frischer Tab lud die V3-Runseite mit der SHA-256-bindenden URL. Ein synthetischer gemeinsamer Lauf wurde am 04.01.2027 gestartet und der erste Tag geöffnet. Im Formular war `Unadjusted` vorausgewählt; die L4-Option und ihre Plan-/Kostenhinweise waren sichtbar.

Mit aktivierter Sensitivität, einer Materialzeile mit Kategorie `material`/Basis `2027-01` und gültigem BAB-Testpool ohne verfügbarem L4-Index blockierte die UI die Abgabe mit `Angebotskalkulation ausstehend: Es wird genau ein procurementPlanIndex für 2027-01 benötigt.` Es entstand kein Angebot. Nach explizitem Zurückschalten auf `Unadjusted` nahm derselbe Testdatensatz den normalen Angebotsweg; DB I 90,00 €, Ergebnis nach BAB 89,90 €, Kundenentscheidung ausstehend.

Finanzübersicht vor/nach dem Angebot blieb bei Bank 10.000,00 €, Umsatz/Forderungen/SimTAX 0,00 €. Das ist vereinbar mit der reinen, nichtbuchenden Angebotskalkulation. A03 CP-0404 und A09 unabhängiges Review sind PASS im begrenzten Runtime-/Snapshot-Scope. Der Lauf war ein lokaler, flüchtiger Test.

**Nicht belegt:** positiver indexbasierter Submit im Browser (aktives Indexfixture fehlt im Standardlauf), Mobil-/Tablet-/Hardwareansicht, Jahres-/Ledger-/Releasegate. Positive Runtime-/Save-/Restore-/Acceptance-Regressions bestanden laut A02/A03/A09/A05. Keine Produkt- oder Architekturfreigabe, kein Commit/Push. T-0063/T-0067/T-0069 bleiben offen.

Siehe [CP-0406](../checkpoints/CP-0406.md), CP-0403–0405 und den A02-/A03-/A05-Berichten.
