# A01 V3-Releasevalidierung – 10.11.2026 / CP-0566

Status: VALIDIERTER V3-MINDESTUMFANG MIT AUSDRÜCKLICHER JAHRES-SMOKE-AUSNAHME (D-0188). Commit/Push wird anschließend durchgeführt.

## Mindestzielmatrix

| Bereich | Ergebnis / aktueller Beleg |
|---|---|
| T-0063 Makroökonomie | PASS im später operationalisierten Scope CP-0501, heutige A09-Zuordnungsprüfung; kein neuer Jahreslauf |
| T-0064 Gründung/Rechtsformen | vorhandene Quellen-/Modellreviews; gezielter A08-Normenrefresh 10.11.; D-0189 weist AG/eG/KGaA/GmbH & Co. KGaA V6 zu, GmbH & Co. KG bleibt V3 |
| T-0065 Markt/Angebote | COMPLETED, heutige Market-/Negotiation-/Counteroffer- und UI-Regressionen PASS; Browser Angebot→fixierter Vertrag |
| T-0066 Produktivität/Produkte | COMPLETED im Plan-/Mengen-/Managementumfang; Produkt- und UI-Regressionen PASS; COGS/BAB bleiben gemäß D-0178 vertagt |
| T-0067 Kalkulation | Plan-/DB-I-Scope PASS; V3-10-Lücke über T-0128 geschlossen: drei Ausrichtungen, je zwei KPIs, gemessene synthetische Zielerreichung und datierter Monatsrückblick; kontrollierte Jan/Feb/März-Fälle, keine Jahresprüfung |
| T-0068 Lernen | bestehende Inhaltsreviews; heutige Anfrageübung Antwort→Feedback→Reload→gleicher Run/Anfrage→gespeichertes Feedback PASS |
| T-0069 Integration | aktueller 12M-Anteil WAIVED (D-0188), kein neuer PASS. Vorhandene Belege bleiben historisch. Integrierter Browsermonat und kurze Engine-/Finance-/Restore-/Recovery-Fixtureprüfungen PASS |
| T-0074 positiver Jahresvergleich | WAIVED für diesen Release; korrigierter vollständiger Positivjahreslauf weiterhin nicht ausgeführt/PASS |
| T-0077 Finanzabgleich | PASS ausschließlich D-0186-Kundenrechnung/Receipt-/SimTAX-Slice. Gesetzliche Steuern, Payroll, COGS, vollständiges GL und weitere nicht ausgelöste Bereiche PENDING |
| T-0080 Browser/Mobil | A01 390×844 und768×1024: Angebot100€, Annahme, Unterweisungsgate, Fertigung, Lieferung, separate Kundenentscheidung, Rechnung100+19€, Eingang119€, Bank10119€/AR0/SimTAX19€. Kein Seitenoverflow. JSON-Export und automatischer Restoretest PASS. Keine heutige physische iPhone/iPad-Prüfung |

V3-01/11 erhalten mit der neuen Managementprojektion einen erklärten Spielkontext; V3-02–09/13–16 sind nach A09 im späteren Ticket-Scope abgedeckt. V3-12 Jahresanteil ausdrücklich erlassen. V3-17/18 gelten innerhalb D-0178/0186; V3-19–21 innerhalb der bestehenden Gründungs-/Rechtsformreviews und D-0189. Keine Optimalziel- oder umfassende Rechts-/Bilanzkonformitätsbehauptung.

## Heute ausgeführt

Kurze Suiten Market, Run-Orchestrator, D-0187-Formel, Produktlebenszyklus, Produkt-UI, Themenoberfläche, FinanceRuntime/-Projection, Run-UI, Supplier-/Dispo-UI, Unterweisung, Unterweisungs-Restore, Negotiation/Counteroffer, Managementstrategie und Modulgraphcache PASS. T-0078 `--fixture-check` ist ein expliziter kurzer Modus (UPSWING durch A01, alle vier Profile durch A09), kein Jahreslauf und keine überschriebenen Jahresbaselines. Die alten fehlerhaften reinen Testfixtures wurden auf reguläre Unterweisung und tatsächlichen Anfrageeingang aktualisiert.

Der erste V3-10-Review von A09 war NONPASS für Zielerreichung/Monatsbericht. A01 ergänzte beides. A11 prüfte unabhängig Code, Drei-Monats-Test und Nichtmutation PASS; Bericht [A11](a11-v3-final-review-cp0566.md). A09/A03/A10 erreichten bei letzten Folgeaufträgen ihr Nutzungslimit; nicht ausgeführte Folgeprüfungen werden nicht ihnen zugeschrieben.

A03s Bank-/Dispo-Anzeigefix zeigt Bank minus gezogenen Dispo, negativ rot; der Rahmen nennt genutzt/verfügbar. Backend bleibt unverändert. A01 sah am final neu geladenen Graph die drei Ausrichtungen, Zielerreichung und Monatsrückblickbedienung im Browser.

## Build und bekannte Grenzen

A01 finaler Graph-/Paketbau: Graph0ce0993b08bf371c383f8073ed3ffb5c48d8c9d85fab05aac62f4d42feb3bdf1,29 Module, HTML1.311.385 Bytes. Manifest bindet die tatsächlich verwendeten Arbeitsbaumquellen per Hash; HEAD allein enthält sie vor Commit noch nicht. Finale Manifest-/ZIPprüfung folgt als Git-Vorbereitung.

Kein 12-Monats-Smoke neu ausgeführt. Hoher CPU-/RAM-Verbrauch ist bekannt und als T-0127 nach Commit/Push eingeplant. Globale historische Markdown-Hardbreaks und zusätzliche Leerzeilen am EOF erzeugen `diff --check`-Hinweise; bestätigte CPs wurden dafür nicht verändert. Scope-Quell-/Testprüfungen und Konfliktmarkersuche werden getrennt dokumentiert.

GitHub Pages bleibt separat T-0113 OFFEN: letzter Workflow42263855130 fehlgeschlagen bei Configure Pages404; erwartete URL antwortet404. Technischer Git-Push ist möglich, Hostingfreigabe wird dadurch nicht behauptet. Mobile HTML/ZIP bleibt lokal nutzbar.

## Rollen / Freigaben

Autor/Koordination/Browser: A01. Fachreviews: A03 Finanzscope und A08 heutige Normquellen; A05-Implementierung zunächst durch Rollenwechsel A03, Fertigstellung durch A01. Unabhängige Reviews: A09 ursprünglicher Scope und Altfixturprüfungen; A11 finaler V3-10-/Assignmentfilterreview. A09-eigene Teständerungen wurden durch A01 gelesen und erneut ausgeführt. A10 Artefaktinventar und vorläufige Paketprüfung; finaler Neubau A01. Keine neuen Schema-/Architektur-/produktiven Finanzfreigaben. Releaseauftrag Nutzer10.11.; D-0188 Ausnahme, D-0189 Rechtsformzuordnung.
