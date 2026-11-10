# A09 – T-0079 Vierprofil-Messreview (CP-0488)

**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Ergebnis:** **PASS für T-0079/T-0069 G9 Laufzeit- und Messkriterium auf Basis des aktuellen A02-Messberichts.** Kein PASS für T-0069 G2 Same-Seed-Reproduzierbarkeit und keine Abnahme der übrigen T-0069-Gates.

## Preflight und Revisionsstand

Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266c`; Status 516. Die sieben CP-0488-Governance-Hashes stimmten. Der Vierprofil-Messbericht wurde laut Dateistand sechs Minuten nach CP-0488 erstellt; er ergänzt die dortige ältere Zwischenlage von 2/4 Profilen. A02s aktuellen Messbericht SHA-256: `D2BC2271DB9DD23E745E95CEC520F34F40E6FA056FBCC5D072D5CA4717EF73FF`. Runner-SHA-256: `65068D7EBA2B2027309D38AA9BEE08BA383402256AD3ED035398BC570CB672A3`.

Der vorab festgelegte 360-s-Grenzwert je Profil/Windows/Node.js v24.22.1 ist durch A09s CP-0476-Review bestätigt. Es wurde kein Jahresprofil erneut gestartet; `node --check prototype/v3-year-smoke.mjs` bestand.

## T-0079/G9-Kriterienabgleich

Der aktuelle A02-Bericht enthält für jedes Profil einen eigenen Befehl, dieselbe Seed-ID `T-0069-seed-1`, Simulationsdaten 2027-01-04 bis 2027-12-31, Laufzeit, Vollvalidierungen, Eventzahl, SHA-256 und Status:

| Profil | Laufzeit | Grenze | Vollvalidierungen | Run-Events | Ergebnis / Endhash |
|---|---:|---:|---:|---:|---|
| UPSWING | 235,787 s | 360 s | 1.450 | 1.409 | completed; `029231d56d01316232d568644e4118fb91df0579556721f439eccdccee2d8d09` |
| BOOM | 232,338 s | 360 s | 1.450 | 1.409 | completed; `1c41f00ad68576df683f76c0a1c05ee83e0000f2ab16d87ebb11255639a93f59` |
| DOWNTURN | 235,334 s | 360 s | 1.450 | 1.409 | completed; `0c2bba46387e09f56cebc2b66d2ef91a55ef8e97c388833071030245326afb2a` |
| LOW | 225,464 s | 360 s | 1.450 | 1.409 | completed; `496d27003dcc8b26569a7c311c0a7d219b5ddeaa2008a36372836b4aab494fce` |

Alle Profile umfassen 362 Kalendertage und 12 Monate. Die geringste Reserve zur Zeitgrenze beträgt 124,213 s (UPSWING). Der Runner prüft bei vollständigem Jahresende 52 Marktwochen und genau 1.409 Events; der Bericht erklärt 1.450 Vollvalidierungen als Initialisierung, Tagesöffnungs-/Tagesabschlussprüfungen und finale Prüfung. A02 protokolliert keinen Abbruch/Fehler und `completed` für alle vier. Die Laufzeitgrenze ist somit vorab festgelegt und alle vier gemessenen Profile liegen darunter.

## Reproduzierbarkeit und Grenze der unabhängigen Prüfung

Der A02-Messbericht sagt ausdrücklich, dass jeder der vier `--scenario=…`-Befehle genau einmal lief. Derselbe Seed und vollständige Endhashes sind dokumentiert, aber ein erneuter identischer Lauf pro Profil mit Hashvergleich ist in diesem Vierprofilbericht nicht enthalten. Der Jahres-Smoke-Runner bietet im unselektierten Standardmodus einen zusätzlichen Same-Seed-UPSWING-Replay; laut A02 wurden für diese Messung jedoch die vier Einzelprofilbefehle verwendet. Daher ist der Laufzeitnachweis PASS, während die geforderte T-0069 G2 Same-Seed-Reproduzierbarkeit nicht durch vier Wiederholungspaare belegt ist.

A09s frühere unabhängige UPSWING-Reproduktion unter CP-0479 ergab den damaligen Hash `5c8f83f4…`; sie ist kein Hash-Abgleich mit der aktuellen Reportrevision (`029231…`). Der Runner liegt als lokale Datei außerhalb eines Git-Basisdiffs; die alte und aktuelle Fixture-/Codebasis können anhand der Reportartefakte nicht bytegleich verglichen werden. Ich habe keinen aktuellen Jahreshash unabhängig neu erzeugt. Diese Grenzen ändern den gemessenen T-0079-Zeitbefund nicht, begrenzen aber die Same-Seed-/Revisionsaussage.

## T-0073 G2 – aktueller Stand nach den vier Messläufen

Die frühere 2/4-Phasenlücke ist durch den neuen Bericht geschlossen: je ein 12-Monatsprofil erreicht und protokolliert UPSWING, BOOM, DOWNTURN und LOW. Die G2-Formulierung verlangt zusätzlich einen reproduzierbaren Lauf; da alle vier Profile laut Bericht nur einmal liefen, bleibt die binäre G2-Abnahme bis zum identischen Same-Seed-Endhash je Profil **NONPASS**. T-0079/G9 selbst verlangt diese Doppelwiederholung nicht.

## Ticketfähige Restarbeiten für T-0073 G2/G6/G8

1. **G2 – Same-Seed-Replay für alle vier Profile:** Die vier vollständigen Profile jeweils mit unveränderter Fixture, Runner-/Modellversion und Seed ein zweites Mal ausführen; pro Profil End-State- und Event-/Monatslog-Hash, Enddatum, Phase und Exit-/Abbruchstatus gegen den Erstlauf vergleichen. Akzeptanz: vier identische Hashpaare und 12/12 erwartete Monatsphasen je Lauf. Der normale Runner-Wiederholungszweig prüft derzeit nur UPSWING; entweder den bestehenden Ablauf für alle Profile erweitern oder die vier zweiten Profilaufrufe separat protokollieren.
2. **G6 – Basiswechsel-Rechenvektor:** Für einen zweiten expliziten Basiszeitpunkt/Basketversion einen kleinen, handprüfbaren Vektor mit zwölf Komponenten und dokumentierten Gewichten festlegen. Erwarteten rebasierenden SPI sowie die zugehörige m/m- und y/y-Behandlung schriftlich berechnen; Regression muss korrekte neue Basisversion, keine Mischung alter/neuer Basketdaten, deterministische Rundung und Erhalt alter Versionen für Replay prüfen.
3. **G8 – Lagprüfung je Politikkanal:** Für monetary, fiscal, growth, tariff, labor_market, environmental, demand_oriented und supply_oriented jeweils kontrollierte Quelle/Neutralfall mit wirksamem Datum, Beobachtungs-/Effektperiode und mindestens einem explizit verzögerten Fall ausführen. Vor `effectivePeriod` darf kein Beitrag erscheinen; am Wirksamkeitsdatum genau ein Beitrag; Restore/Replay darf keinen zweiten auslösen. Bestehende echte Finanz-/Betriebszustands-Nichtmutation beibehalten.

## Ausführung und Grenzen

Unabhängiger A09-Belegreview der aktuellen A02-Messtabelle, Runner-Invarianten, prior-reviewten 360-s-Grenze und Statuskonflikte; kein Profilstart, kein Browser-/Gerätecheck, keine Produkt-/Status-/Governanceänderung. Die Vorberichte und A02-Messdatei wurden nur gelesen; keine Reconciliation oder Save/Restore-Fortsetzung wurde ausgeführt.
