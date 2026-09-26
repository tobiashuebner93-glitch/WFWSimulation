# A09 – Unabhängiger P0-Validierungstest Maschinenbau-MVP

**Stand:** 2026-09-26
**Status:** QA-Review; keine Implementierungs- oder Architekturfreigabe
**Bezug:** MG-000 / SLG-000.2; P0-Abgleich A02 Simulation, A03 Accounting/Finance, A04 Database

## Ergebnis

Der P0-Produktstand ist in den Fachspezifikationen in wesentlichen Teilen konsistent. Das Datenmodell bildet zentrale Geschäftsobjekte und getrennte Finanzwahrheiten ab, enthält aber nachweisbare Rückstände gegenüber den später bestätigten P0-Regeln und kein klares Persistenzmodell für einige bereits festgelegte Laufzeitparameter. Eine Implementierung sollte diese Befunde vor Schema-/Engine-Arbeit schließen. Offene Produktregeln bleiben offen und sind keine technischen Widersprüche.

**QA-Ergebnis: NICHT BESTANDEN für eine vollständige Datenmodellfreigabe; als Spezifikationsreview verwertbar.** Es wird keine Architektur oder Implementierung freigegeben.

## Geprüfte Dokumente

- `AGENTS.md`, `docs/agent-system/agent-structure.md`, `goals.md`, `ticket-board.md`, `collaboration-state.md`, `decision-log.md` (einschließlich D-0010)
- `docs/agent-system/checkpoints/CP-0021.md`
- `docs/simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md`
- `docs/accounting/maschinenbau-mvp-finanzspezifikation.md`
- `docs/accounting/p0-finanzkonsistenzpruefung.md`
- `docs/database/maschinenbau-mvp-datenmodell.md`
- ergänzend: `docs/database/p0-produktstand-datenmodell-abdeckung.md`, `docs/simulation/p0-festlegungen-simulationspruefung.md`, `docs/simulation/a02-p0-konkretisierung-aenderungsbericht.md`

**Nicht verfügbar:** `docs/agent-system/checkpoints/CP-0020.md` wird in Collaboration State und Übergabe referenziert, existiert aber im Checkout nicht. Seine Aussagen wurden daher nicht als Primärbeleg geprüft; die aktualisierte Finanzspezifikation und A03-P0-Prüfung enthalten den Bilanzabgleich und die Darlehensangaben.

## Befunde

### A) PASS

| Kritikalität | Befund | Beleg / Auswirkung |
|---|---|---|
| LOW | Eröffnungsbilanz ist in A03 rechnerisch ausgeglichen. | A03-Finanzspezifikation, Abschnitt „Eröffnungsbilanz“: Aktiva Bank 30.000 €, Forderungen 12.500 €, Vorräte 12.800 €, Maschine 40.000 € = 95.300 €. Passiva Lieferantenverbindlichkeiten 7.500 €, Darlehen 24.000 €, Eigenkapital 63.800 € = 95.300 €. A03 bestätigt Bilanzdifferenz 0 €. |
| LOW | Rahmen und Cash sind in A02/A03 getrennt. | A02 Startprofil und A03 P0-Prüfung weisen 50.000 € Rahmen = 30.000 € Bank + 20.000 € Rest-Rahmen aus; der ungezogene Rest ist weder Cash noch automatisch ein Vermögenswert. Kein automatischer Abruf ist beschlossen. |
| LOW | Operative Abwicklung und G3 sind in A02 hinreichend sequenziert. | A02 P0-Regeln: Startdatum 01.01.2027, Wochenraster mit Tagesereignissen, Zwischentage einzeln, Wochenendverschiebung, geordnete Tagesphasen; volle Produktion/Lieferung, F3-Abnahme, genau eine Vollrechnung, Zahlung und G3 erst nach vollständiger Kundenzahlung. |
| LOW | A02/A03 trennen Leistung, Rechnung, Forderung und Zahlung. | A02 meldet Ereignisse und Mengen; A03 allein führt OP, Liquidität und Ergebnis. Rechnung ist kein Zahlungsvorgang; Lieferanten-OP blockieren G3 nicht. Dies entspricht der Eigentümerschaft in A04 §1–3. |
| LOW | Startaufträge sind materialseitig innerhalb des Eröffnungsbestands. | CP-0021/A02 Startprofil: Stahl 172 kg < 2.000 kg, Aluminium 90 kg < 800 kg, Zukaufteile 56 < 1.000. Reservierung ist von Verbrauch getrennt. |
| LOW | BAB D3 ist als statischer Ansatz fachlich konsistent, aber noch nicht vollständig berechenbar. | A03: MGK 15 % MEK, FGK 100 % Fertigungslöhne, Vw/Vt-GK 10 % HK. A04 §4.5 enthält versionierte `bab_version`/`bab_line` mit Betrag/Satz/Verteilungsbasis. Personalkostensätze, Zuordnungen und Periode bleiben zurecht offen. |
| LOW | E3 und SimTAX sind in A03 fachlich beschrieben, ohne Rechtsbehauptung. | A03 P0-Prüfung definiert SimTAX B2 als 19 % je Position mit Rundung je Steuerposition und E3 als gleitenden Durchschnitt; der Text kennzeichnet offene Rundungs-, Basis- und Steuerverrechnungsfragen. |

### B) WIDERSPRUCH

| Kritikalität | Betroffene Stelle | Befund und Auswirkung | Erforderliche Folgeaktion |
|---|---|---|---|
| HIGH | A04 Datenmodell §4.1 `opening_balance`; §1/§2 Leitplanken; §8 Zeile „Startunternehmen“ | Das Modell sagt, 50.000 € seien erst noch als Zahlungsmittel/Eigenkapital o. Ä. zu klassifizieren und Stichtag/Eröffnungswerte blieben offen. A02/A03 haben inzwischen den Start zum 01.01.2027, 30.000 € Bank, 20.000 € getrennten Rest-Rahmen, 12.500 € Forderungen, 7.500 € Verbindlichkeiten, 12.800 € Vorräte, 40.000 € Maschine, 24.000 € Darlehen und 63.800 € Eigenkapital bestätigt. Das Modell repräsentiert diese aktualisierte Bilanz nicht verlässlich und könnte den Rahmen als Opening Balance fehlklassifizieren. | A04 soll die Modellbeschreibung mit den bestätigten Eröffnungsfakten aktualisieren und Bank/Cash, Rest-Rahmen/Limit und Eigenkapital sowie übrige Bilanzpositionen getrennt referenzierbar machen. Nicht gezogene Finanzierung nicht als Cash buchen. |
| HIGH | A04 §3.3 Status `Zahlung`; §6 Invariante 7 | A04 behauptet „keine automatische Zahlung allein wegen Fälligkeit“ und begrenzt Liquiditätsänderungen auf bestätigte Zahlung oder Eröffnungsfakt. A02s bestätigte Regel verlangt am Fälligkeitstag einen automatischen vollständigen Zahlungsversuch für eigene Lieferanten-OP: bei ausreichender Liquidität volle Zahlung; sonst kein Payment/kein Cashfluss und OP bleibt offen/überfällig. Ein erfolgreicher automatischer Versuch muss also als bestätigtes Zahlungsereignis persistierbar sein. Die A04-Formulierung widerspricht der Ausführungsregel, nicht dem Grundsatz, dass Fälligkeit allein kein Geld bewegt. | A04 soll automatische Zahlungsversuche, Versuchsergebnis und tatsächliche bestätigte Vollzahlung voneinander abbilden; fehlgeschlagene Versuche dürfen keine Zahlung oder Liquiditätsbewegung erzeugen. |
| MEDIUM | A04 §4.1 `employee`, `machine`; §4.3 `resource_consumption`; §8 Zeit/Periode | A02 hat verbindliche Kapazitäten: jede der drei Rollenressourcen 40 h/Woche, CNC zusätzlich 40 operative h/Woche und maximal 1.600 h/Jahr. Das Modell führt keine Kapazitäts-/Kalender-/Gültigkeitsobjekte oder Felder auf; `resource_consumption` hält tatsächliche Verbräuche und ersetzt keine Kapazitätsgrenzen. Arbeitskalender und Tagesverteilung sind offen, die Wochen-/Jahresgrenzen selbst jedoch bestätigt. Damit ist die Durchführung der festgelegten Kapazitätsvalidierung im beschriebenen Modell nicht nachvollziehbar. | A04 soll Kapazitätsgrenzen und deren Gültigkeit/Regelversion modellseitig ausdrückbar machen; A02 entscheidet die Tagesauflösung entsprechend dem noch offenen Arbeitskalender. Keine neuen Schicht-/Ausfallregeln unterstellen. |

### C) LÜCKE

| Kritikalität | Betroffene Stelle | Befund und Auswirkung | Erforderliche Folgeaktion |
|---|---|---|---|
| HIGH | A04 §4.4 `customer_invoice_line`; §6 Übergabe Persistenz → A03 | SimTAX B2 verlangt 19 % pro Rechnungsposition und Rundung je Position. A04 nennt Netto-/Steuer-/Bruttobeträge und eine Steuerkennung, aber kein explizites SimTAX-Regel-/Satzversion-, Bemessungsbasis- oder gerundetes Positionssteuerfeld. Die Betragsfelder könnten die Werte aufnehmen, doch Regelherkunft und reproduzierbare Neuberechnung sind nicht spezifiziert. | A04/A03 sollen die für SimTAX B2 nötigen Werte und Regelversionen auf Positions-/Belegebene abstimmen; Rundungsmodus, Steuerumfang und Steuerverrechnung bleiben offen, soweit nicht Nutzer/Fachrolle bestätigt. |
| MEDIUM | A04 §4.1 `opening_balance`; §4.3 `inventory_movement`; §4.4 `financial_fact` | E3 ist fachlich festgelegt. Das Modell besitzt Bewegungen und Bewertungsreferenz, beschreibt aber weder explizite Bewertungsmethode/-version (E3) noch einen klaren verknüpften Eröffnungsbestand je Material/Menge/Wert als WAP-Startbasis. Reproduktion des gleitenden Durchschnitts über den Eröffnungsbestand und spätere Zugänge/Verbräuche hängt so von nicht benannten Daten ab. | A04 und A03 sollen Eröffnungsmenge/-wert und Methode-/Regelversion je Material sowie wertrelevante Bewegungsdaten nachvollziehbar verbinden; WAP-Präzision/Rundung bleibt offen. |
| MEDIUM | A04 §4.6 Simulation/Audit; §4.3 Produktionsobjekte | A02 braucht Kalenderdatum, Tagesphase, Ereignissequenz und stabile Konfliktauflösung für wiederholbares Replay. `business_event` bietet Simulations-/Erfassungszeit, Sequenz und Schema-Version, aber kein ausgewiesenes Feld/Objekt für die Tagesphase bzw. Regelversion der Phasenverarbeitung. Die Spezifikation kann die Tagesreihenfolge nicht eindeutig aus der beschriebenen Persistenz ableiten. | A04/A11 sollen prüfen, wie Phase/Ordnungsgrund und Regelversion für die bestätigte deterministische Tagesfolge repräsentiert werden. |
| MEDIUM | A04 §4.4 OP-/Zahlungstabellen; §7 Erweiterungen „Mahnungen/Inkasso“ | A02 verlangt, dass ein nicht ausführbarer fälliger Lieferantenzahlungsversuch in den von A03 definierten Mahnprozess eingeht. A03 beschreibt Erinnerungs-/Mahnstufen und offene notwendige Parameter. A04 enthält `CollectionCase`/Reminder/Action nur als spätere Erweiterung, keine V1-Verknüpfung zu fehlgeschlagenem Versuch/OP/Mahnstufe. Damit ist der aktuelle Simulationsübergang nicht als Datenfluss beschrieben. | A02/A03 klären zuerst, welche Mahn-/Erinnerungsereignisse in V1 tatsächlich gelten; A04 bildet nur die bestätigten Ausgaben/Referenzen ab. Gebühren, Pfändungs-/Liquidationsfolgen bleiben offen. |

### D) OFFENE NUTZERENTSCHEIDUNG

Diese Punkte sind keine Modellwidersprüche und werden hier nicht entschieden:

| Kritikalität | Offener Punkt | Zuständigkeit / Abhängigkeit |
|---|---|---|
| HIGH | Art, Verfügbarkeit und Ziehungsereignis des 20.000-€-Rest-Rahmens; automatische Ziehung ist nicht freigegeben. | Nutzer/A03; keine Cash- oder Finanzierungsannahme ergänzen. |
| HIGH | Konkurrierende Fälligkeiten bei knapper Liquidität, Same-day Reihenfolge von Kundeneingang und Lieferantenauszahlung, Retry-Zeitpunkt und Mahnintervalle. | A02/A03 mit Produktentscheidung Nutzer; keine Auszahlungspriorität erfinden. |
| HIGH | Fälligkeit: 14/30 Tage ab welchem Bezugspunkt; Kalendertage/Arbeitstage und Wochenend-/Feiertagsbehandlung. | Nutzer/A02/A03. |
| HIGH | SimTAX-Geltungsbereich, exakte Bemessungsbasis, Rundung bei halbem Cent/negativen Korrekturen, Kunden-/Lieferantenseite sowie Behandlung/Abführung. | Nutzer/A03; 19 % je Position bleibt die bestätigte SimTAX-Produktregel. |
| HIGH | Darlehen: Tilgungsart, erste Rate, Restlaufzeit, Zinsperiodik/-tage, Zahlungstermine und Retry bei fehlender Liquidität. | Nutzer/A03. Startsaldo 24.000 €, nominal 5 % und ursprüngliche 10 Jahre stehen fest; Zahlungsplan nicht. |
| MEDIUM | E3-Eröffnungs-WAP-Basis, Bezugskosten, Bewertungsbereich, Präzision und Rundung. | A03/Nutzer; Startmaterialpreise sind A02-Vorschlag, ihre E3-Bestätigung ist ausstehend. |
| MEDIUM | Personalvollkosten/Kostensätze, Maschinen-/Energiekosten, BAB-Periode und konkrete Kostenstellenzuordnung. | A03/Nutzer. Monatsbruttolöhne allein reichen nicht für Vollkosten. |
| MEDIUM | Arbeitsstandort, Arbeitstage, Feiertage und Verteilung der Wochenstunden pro Tag; Monatszuordnung verschobener Ereignisse. | Nutzer/A02/A03; die Wochen-/Jahreskapazitätsgrenzen bleiben dennoch gültig. |
| MEDIUM | F3-Ablehnung: Klärung/Nacharbeit/Rücknahme, G3-Wiederöffnung nach Korrektur und offene Abschluss-/Periodenkorrekturen. | Nutzer/A02/A03. |

### E) RISIKO FÜR SPÄTERE IMPLEMENTIERUNG

| Kritikalität | Risiko | Folge |
|---|---|---|
| HIGH | A04-Spezifikation enthält den älteren Eröffnungs- und Zahlungstext trotz später bestätigter Regeln. | Schema- oder Geschäftsvalidierungen könnten falsche Konten eröffnen oder A02-Zahlungsausführung blockieren. |
| HIGH | Automatische Zahlung wird ohne „Versuch“ gegenüber „ausgeführter Zahlung“ modelliert. | Fehlversuche könnten fälschlich Cash/OP verändern oder erfolgreiche Fälligkeit automatisch als Zahlung behandeln, obwohl Cash nicht reicht. |
| HIGH | SimTAX ohne explizite Positionsbasis/-version und gerundetes Ergebnis. | Rechnungen sind bei Replay/Korrektur nicht zuverlässig reproduzierbar. |
| MEDIUM | Kapazitätslimits nur als Text, ohne modellierte Ressourcengültigkeit. | Engine könnte Überbuchung, Kalenderabhängigkeit und 1.600-h-Jahreslimit nicht konsistent validieren. |
| MEDIUM | Mahnstufen, Kalender-/Fälligkeitsparameter oder E3-WAP-Herkunft bleiben außerhalb referenzierter Fakten. | Ereigniswiederholung, OP-Status, Kostenbewertung oder Jahres-/Periodenberichte können voneinander abweichen. |
| MEDIUM | CP-0020 fehlt trotz Verweis als gesicherter Bilanznachweis. | Herkunft/Prüfpfad der nachträglichen Eröffnungsentscheidung ist lückenhaft; A03-Spezifikation deckt den Sachinhalt ab, ersetzt aber den Checkpoint-Verweis nicht. |

## Prozessabdeckung

Anfrage → Kalkulation → Angebot → Verkaufsentscheidung → Auftrag/Vertrag → Beschaffung → Wareneingang/Fremdleistung → Produktion → Lieferung → Rechnung → Zahlung → Lieferantenzahlung → Auftragsabschluss → Auftragsergebnis ist in A02 als Prozess und in A04 durch Requests/Calculations/Quotes/Contracts, PurchaseOrder/Receipt, ProductionRun/Consumption, Delivery/Acceptance, Invoice/OP/Payment, OrderResult und BAB-Grundobjekte abgebildet. Der Prozess ist strukturell weitgehend vorhanden.

Die verbleibenden Modellrisiken betreffen keine fehlende Kernstufe, sondern die oben markierten Regeln/Verknüpfungen: Öffnungsfakten, automatische Auszahlungsversuche, SimTAX-Reproduzierbarkeit, Kapazitätslimits, Tagesphasen und Mahnprozess.

## Prüfbereichsübersicht

| Prüfbereich | Ergebnis |
|---|---|
| Eröffnungsbilanz / Budget | A03 konsistent; A04 veraltet/inkonsistent (HIGH) |
| Simulation / Kalender / Phasen / G3 | A02-Regeln konsistent; Modellrepräsentation für Phasen und Kapazität unvollständig |
| Liquidität / automatische Zahlung | A02/A03-Regel klar; A04-Statusformulierung widersprüchlich (HIGH) |
| Dunning / konkurrierende Fälligkeiten | Parameter ausdrücklich offen; V1-Datenfluss unvollständig |
| SimTAX / E3 / BAB | fachliche Regeln vorhanden; SimTAX-/E3-Modellherkunft lückenhaft; BAB-Struktur grundsätzlich vorhanden |
| Kapazität / Startaufträge / Material | Startlast konsistent; feste Limits bestätigt; Kapazitätsobjekte fehlen im Modell |
| Governance / Autorität | D-0010 bleibt Produktentscheidung; keine Architekturfreigabe; keine neuen Entscheidungen getroffen |

## Erforderliche Folgeaktionen

1. A04 sollte die Modelltext-Widersprüche zu Eröffnungsfakten und automatischer Zahlung korrigieren und SimTAX, E3, Kapazität, Phasen und den bestätigten V1-Zahlungs-/Mahnfluss modellseitig gegenprüfen.
2. A02/A03/Nutzer sollten ausschließlich die oben benannten offenen Regeln entscheiden. Insbesondere werden keine Werte für Fälligkeit, Priorisierung, Darlehensplan oder Mahnfolgen durch diesen Review ergänzt.
3. A01 sollte den fehlenden CP-0020-Eintrag/-Checkpoint prüfen und den Referenzstatus mit dem tatsächlichen Repository-Inhalt abgleichen.

## Governance und Repository

- Keine Architekturfreigabe; D-IDs und Fachentscheidungen wurden nicht geändert.
- Keine Code-, Datenbank-, Supabase-, Schema- oder Dependencyänderung.
- Vorhandene Änderungen an Governance-/A02-Dateien und weitere untracked Artefakte waren bereits vor diesem QA-Arbeitsschritt im Checkout. Dieses Review ändert nur den QA-Bericht, den neuen Checkpoint und den Arbeitsstandsverweis in Collaboration State.
- `git diff --check` wird vor Abschluss ausgeführt.
