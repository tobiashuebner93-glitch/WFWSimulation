# A03-Finanzreview – T-0066 Produktlebenszyklus-Runtime

**Status:** PASS für isolierte Finanz-/Bewertungsschnittstelle; kein Gesamtabschluss T-0066  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2  
**Ticket:** T-0066  
**Start-/Zielprofil:** isolierter V3-Szenariolauf; V2 und Startprofile 2019/2027 unverändert  
**Entscheidungsbezug:** D-0159, D-0161, D-0162; T-0065-/T-0067-Verträge  
**Vorgänger:** CP-0279 und CP-0280, beide ENTWURF  
**Git-Basis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und Umfang

Gelesen: AGENTS.md, Agentenstruktur/Rechtematrix, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279, CP-0280 sowie T-0066-Rahmen, T-0065-Marktvertrag, T-0067-Kalkulationsvertrag, A02-T-0066-Bericht und Engine/Regressionen. Der Checkout enthält breite vorbestehende Änderungen und ungetrackte V3-Arbeit; nichts davon wurde geändert oder verworfen. Dieser Review beschränkt sich auf Finanz-, Bewertungs- und Periodengrenzen der beiden neuen T-0066-Dateien.

## Gates

| Gate | Ergebnis | Befund |
|---|---|---|
| Plan-/Ist-Trennung | **PASS** | Produktidee, Prozessdefinition und Kalkulation ändern nur Produktplanstatus/Planwerte. `estimateV3Product` schreibt `source: 'plan_only'`; es erzeugt keine Finanz-, Cash-, Forderungs-, Umsatz- oder Ledgerbuchung. |
| D-0162-/A03-Rechenvertrag | **PASS** | Runtime ruft ausschließlich `calculateV3OfferEstimate` auf. Diese verlangt nichtnegative sichere Ganzzahl-Centbeträge, explizite Variabilitätskennzeichen und eindeutige Einzelkosten-IDs. DB I, direkte Einzelkosten und BAB-Ergebnis werden von A03 geliefert; A02 reimplementiert keine Rundungs-/DB-Formel. |
| Preis-/Steuerbasis | **PASS** | Eingabe heißt `netPriceCents`; die Runtime führt keine SimTAX-Komponente, Bruttoableitung oder eigene Steuerregel ein. Das entspricht D-0162s V3-Nettoplanpreis. |
| Snapshot-/Vertragsschutz | **PASS im isolierten Planumfang** | T-0066 erzeugt keine Kundenofferte und keinen Vertrags-/Umsatzübergang. Es kann daher weder einen angenommenen Preis überschreiben noch einen D-0162-Angebotssnapshot ersetzen. Vertragsannahme bleibt T-0065 vorbehalten. |
| Material-/Fertigwarenbewertung | **PASS mit Integrationsgrenze** | Physische Planmengen werden reserviert und bei Schrittabschluss in der isolierten Materialmenge verbraucht; Fertigwaren belegen nur die ausdrücklich übergebene Lagerkapazität. Es wird kein Geldwert, Durchschnittspreis, Herstellkostenbestand, COGS oder Buchungssatz erzeugt. Diese Zustandsänderungen sind noch keine integrierte A03-Bestandsbewertung. |
| Perioden- und Laufzeitübergabe | **OFFEN außerhalb Finanzschnittstellen-PASS** | Ereignisse tragen das geplante Zuweisungsdatum, die Runtime führt aber keinen Unternehmenskalender/Jahreslauf aus. A09 sollte zusätzlich prüfen, dass ein geplanter Schritt nicht vor Erreichen seines Datums abgeschlossen oder zeitlich vor seinem Vorgänger freigegeben werden kann. Das ist ein Laufzeit-/Periodenintegrationstest, kein bereits erzeugter Finanzfehler; derzeit entstehen keine Finanzperiodenbuchungen. |
| Liquiditätsgate | **OFFEN / nicht behauptet** | T-0067 bietet hier keine autorisierte Cash-Verfügbarkeits-API. T-0066 prüft keine Finanzierbarkeit, keine automatische Kreditziehung und keine Buchung. Das ist im A02-Bericht ausdrücklich offengelegt und verhindert eine Produktions-/Cashfreigabe im Gesamtspiel. |
| Absatz-/Verkaufsbuchung | **OFFEN / nicht behauptet** | `getV3ProductMarketOpportunities` konsumiert nur die sichere T-0065-Spielerprojektion. Die Runtime erstellt weder Angebot noch Verkauf, Lieferung, Forderung, Erlös oder Zahlung. Dafür fehlt weiterhin der gemeinsame A02/A03-Erfüllungs- und Accounting-Handoff. |
| Integration/V2-Schutz | **PASS im Codeumfang** | Es gibt keine V1/V2-Engine- oder Startprofiländerung und keine Schema-/Architektur-/Ledgeränderung. Gesamtoberfläche und Jahreslauf sind nicht integriert. |

## Ausgeführte Prüfungen

- `node --check prototype/v3-product-lifecycle.js` — **PASS**.
- `node prototype/v3-product-lifecycle-regressions.mjs` — **PASS**.
- `git diff --check -- prototype/v3-product-lifecycle.js prototype/v3-product-lifecycle-regressions.mjs` — **PASS**.
- Code-Review der A03-Funktionsgrenze, Eingabevalidierung, keine Finanzereignisse und Quellen der Marktprojektion — **PASS für isolierten Umfang**.
- **Fachreview:** A03, dieser Bericht.
- **Unabhängige QA:** noch offen; A09-Re-Review erforderlich.
- **Browser-/Gerätetest:** nicht ausgeführt; keine V3-Oberflächenintegration.
- **Git-Verifikation:** Branch/HEAD und bestehende Arbeitsbaumänderungen geprüft; keine Änderung an Produktdateien durch A03; kein Commit/Push.

## Ergebnis und Übergabe

A03 findet keinen Widerspruch zu D-0162 in der isolierten Plan-Kalkulation und keine Finanzbuchung aus Produktplanung oder Produktionsabschluss. Der Finance-Gate ist **PASS, begrenzt auf die implementierte A03-Schnittstelle**. T-0066 ist insgesamt nicht abgeschlossen: Cashgate, quantifizierte Produktivitätswirkung, Absatz/Verkauf/Bestandsbewertung, UI/Jahreslauf sowie A09- und Browserprüfung bleiben offen.

**Nächster Schritt an A09:** unabhängige QA der Ressourcenkonkurrenz und insbesondere chronologische Validierung von geplantem Datum, Abschluss und Vorgängerfolge. **Nächster Schritt an A01/A02/A03:** erst nach gemeinsamer Abgrenzung der fehlenden APIs einen eigenen Anschlussauftrag für Cash-, Absatz-, Bestands- und Buchungsübergaben definieren; bis dahin keine Werte oder Finanzwirkung in T-0066 ergänzen.

## A03-Re-Review nach A02-Korrektur (2026-10-31)

**Status:** Der begrenzte Finanz-PASS bleibt bestehen; keine neue Finanz-/Bewertungslogik eingeführt.

### Re-Review-Umfang

Nach erneutem Preflight wurden die A02-Änderungen aus Abschnitt 6 des A02-Berichts gegen D-0162 und die T-0065/T-0067-Verträge erneut geprüft. Das umfasste Arbeitsdatum/Wochenenden, Vorgänger- und Abschlusszeitpunkte, Zuordnungs-IDs sowie WIP-/Fertigwarenfreigabe.

### Finanzbefund

- `estimateV3Product` verwendet weiterhin ausschließlich `calculateV3OfferEstimate` und schreibt nur einen als `plan_only` markierten Schätzzustand.
- Datum-/Sequenzkorrekturen fügen keine Kosten-, Liquiditäts-, Forderungs-, Umsatz-, Steuer-, Bestandswert- oder Ledgerberechnung hinzu.
- Teilweise produzierte Menge wird als `pendingOutputQuantity` gehalten; sie wird erst nach Abschluss sämtlicher definierter Schritte in `outputQuantity`/`finishedGoodsUsed` übertragen. Diese Werte bleiben explizite physische Mengen/Kapazität, keine monetäre Bestandsbewertung.
- Abgeschlossene Schritte verbrauchen die hinterlegte Materialmenge physisch. Es entsteht weiterhin kein Materialwertabgang, Herstellkostenbestand, COGS oder Buchungssatz. Die A03-Bewertung bleibt späterem Accounting-Handoff vorbehalten.
- Angebot-/Absatzchance verwendet weiter nur `getV3MarketPlayerView`; Vertragsannahme und Verkauf bleiben nicht implementiert.

### Prüfungen

- `node --check prototype/v3-product-lifecycle.js` — **PASS**.
- `node prototype/v3-product-lifecycle-regressions.mjs` — **PASS** nach A02-Korrekturen.
- `git diff --check -- prototype/v3-product-lifecycle.js prototype/v3-product-lifecycle-regressions.mjs docs/simulation/a02-t0066-runtime-arbeitsbericht.md` — **PASS**.
- Unabhängige A09-Re-QA: läuft separat / nicht durch A03 ersetzt.
- Browser-/Geräte-/Jahresintegration: weiterhin nicht ausgeführt.
- Arbeitsbaum/HEAD geprüft: `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bestehende Änderungen erhalten; kein Commit/Push.

### Schlussfolgerung

A02s Zeit-/Chronologie-/Bestandsfreigabefixes ändern den zuvor geprüften Finanzumfang nicht. A03 bestätigt den begrenzten **PASS** erneut. T-0066 bleibt IN_PROGRESS bis zu A09-Re-QA, UI-/Jahresintegration und den noch nicht definierten Cash-, Verkaufs-, Bestandsbewertungs- und Buchungsübergaben. Dieser Re-Review genehmigt keine neuen Produkt-, Steuer-, Bewertungs-, Finanzierungs- oder Architekturregeln.
