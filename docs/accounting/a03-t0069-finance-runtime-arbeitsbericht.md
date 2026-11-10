# A03 – T-0069 Finance-Runtime und Reconciliation

**Status:** isolierte A03-Finance-Subledgerfunktion geliefert; Integration in A02-Run noch ausstehend  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Start-/Zielprofil:** V3-Testprofil ab 2027-01-04; keine Änderung der V1-/V2-Profile oder der 2019-/2027-Startprofile.  
**Maßgebliche Entscheidungen:** D-0159, D-0161, D-0162, D-0163 und D-0164.  
**Vorgänger:** CP-0279 und CP-0280 (ENTWURF).  
**Gitbasis laut Preflight:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; bereits umfangreicher lokaler Arbeitsstand mit parallelen Änderungen.

## Preflight und Grenze

Vor der Arbeit wurden AGENTS.md, Agentenstruktur/-rechte, MG-002-Ziele, Ticket Board, Collaboration State, Decision Log und CP-0280 gelesen. Der T-0069-A02-Runvertrag, die A03-Handoff-Matrix, A03s T-0067-Kalkulationsvertrag, bestehende `prototype/v3-financial-calculation.js`-Funktionen und das Rechtsrahmenregister wurden geprüft. Die Rechtsauswertung von A08 vom 2026-10-31 wurde nach Fertigstellung dieses Moduls ergänzt; sie ändert den hier implementierten begrenzten Spiel-KLR-Scope nicht, macht die Rechts-/Vertragsform des Kundenauftrags aber ausdrücklich weiterhin fallabhängig.

Die Funktion ist ein reiner, unveränderlicher Subledger-Reducer und eine Reconciliation-Sicht. Sie mutiert keinen externen Simulations-, Accounting- oder Ledger-State. Sie ist keine allgemeine Finanzbuchhaltung, keine Steuerberechnung, kein rechtlicher Abschluss und keine Schema-/Architekturfreigabe. Das Testfixture ist synthetisch und belegt keine Startbilanz.

## Umsetzung

Neu erstellt wurden:

- `prototype/v3-finance-runtime.js`
- `prototype/v3-finance-runtime-regressions.mjs`

Die API verlangt einen explizit datierten und referenzierten Eröffnungs-Snapshot; sie setzt keinen stillen Nullsaldo. Kundenleistung wird erst mit A03-authorisierter expliziter Betragsbasis, eindeutigem Vertrag/Angebot/Auftrag, dokumentiertem Leistungstag, Abnahme-/Kundenref. und nachgewiesener Kunden- oder für den Kunden handelnder Vertreterautorität anerkannt. Der erhaltene Betrag wird nicht aus dem Angebot berechnet. Umsatz und Forderung werden nur einmal am explizit gelieferten A03-Wirksamkeitsdatum geführt.

Rechnungsereignisse sind getrennte Nachweise und ändern Erlös oder Cash nicht. Zahlungseingänge benötigen eine gesonderte tatsächliche Zahlungsreferenz, passenden Zahler, Rechnung/Vertrag und Zahlungsdatum; sie vermindern die Forderung und erhöhen Bank, ohne erneut Umsatz zu erzeugen. Eine Teilzahlung erfordert eine explizite Vertragsfreigabe; ohne sie ist nur die vollständige Tilgung des offenen OP zulässig. Event-, Rechnungs-, Zahlungs-, Angebots- und Quell-IDs werden auf Duplikate geprüft. Identisches Replay ist ein No-op; eine abweichende Nutzlast mit gleicher Event-ID wird zurückgewiesen.

Die Reconciliation weist Kalendermonats-/Jahresflüsse für den beschränkten anerkannten Umsatz und tatsächliche Kundeneingänge getrennt von datierten Monatsend-/Stichtagswerten für Bank und offene Forderungen aus (D-0162). Öffnungsforderungen sind mangels Einzel-OP-Übergabe zwar Teil des Bestands, können mit dieser Version aber nicht ausgeglichen werden.

## Fail-closed Grenzen

Die API setzt keine SimTAX-/Umsatzsteuerbasis voraus und akzeptiert aktuell nur explizit gleiche Beträge für realisierten Erlös und Forderung. Abweichende Netto-/Bruttobeträge, Steuerpositionen, mehrteilige Rechnungen und nicht explizit gestützte Teilzahlungen bleiben nicht unterstützt. Auch COGS, WIP/Fertigwarenbewertung, Material-/Arbeits-/BAB-Istkosten, Lieferantenverbindlichkeiten/-zahlungen, Darlehen, Dispo, Gebühren und Soll-/Haben-General-Ledger sind nicht enthalten. Unvollständige Quelle, fehlende A03-Autorisierung, unklare Abnahme-/Vertragsparty oder fehlende Betragsbasis darf A02 nicht durch Ersatzwerte auffüllen.

Nach A08s Rechtsreview sind §§ 640/641 BGB nur für den konkreten Werkvertragsfall und unter dessen Voraussetzungen maßgeblich; für herzustellende bewegliche Sachen kann Kaufrecht nach § 650 BGB gelten. Eine Rolle `recipient` allein ersetzt deshalb keine Autorität: die API verlangt Referenz zur Vertragspartei bzw. zum belegten Vertreter. Die Funktion legt weder Vertragstyp noch Abnahmefiktion, Rechnungspflicht oder Fälligkeit fest. Das Ergebnis bleibt ein vereinfachtes Spiel-KLR-Modell und darf nicht als HGB-konforme Buchhaltung beschrieben werden.

Die Schnittstelle wurde noch nicht gegen A02s laufende Run-Implementierung integriert. Der konkrete Handoff bleibt deshalb bis zum Cross-Review `pending/non-posting`; keine End-to-End- oder Jahresreconciliation wird behauptet.

## Nachweise

- **Ausführung:** A03 hat die isolierte Finance-Runtime und synthetische Regressionen erstellt.
- **Fachreview:** A03 Selbstreview PASS im begrenzten, explizit referenzierten Subledger-Scope; keine allgemeine Buchführungs-/Steuer-/HGB-Aussage.
- **Unabhängige QA:** nicht ausgeführt; A09-Review erforderlich.
- **Browser-/Gerätetest:** nicht ausgeführt; die API ist nicht in eine Oberfläche integriert.
- **Tests:** `node prototype/v3-finance-runtime-regressions.mjs` — PASS; `node --check prototype/v3-finance-runtime.js` — PASS; dateibezogener `git diff --check` — PASS. Die Regressionen decken fehlende Eröffnung/Provenienz, falsche Vertragspartei/Abnahmeautorität, fehlende A03-Freigabe, abweichende Netto-/Forderungsbeträge, getrennte Rechnung und Zahlung, volle/bedingte Teilzahlung, Event-/Quellen-Dedupe, Monatsfluss vs. Monats-/Jahres-/Stichtagswert und reine Testdaten ab.
- **Git-Verifikation:** Status im Preflight zeigte zahlreiche bereits vorhandene lokale Änderungen und ungetrackte Dateien; keine davon wurde entfernt. Branch/HEAD gemäß Preflight unverändert. Änderungen auf die beiden A03-Code-/Testdateien und diesen Bericht beschränkt. Kein Commit/Push.

## Offene Punkte / Folgeauftrag

1. **A02 – T-0069:** die Felder und Quellreferenzen seiner Run-/Leistungs-/Abnahme-/Rechnungs-/Zahlungsprojektion an diese API anbinden oder anhand der echten Schnittstelle einen A03/A02-Adapter abstimmen. A02 darf dabei keine Finance-State-Mutation übernehmen.
2. **A09 – T-0069:** unabhängiger Test und Fehlermodusanalyse dieser Funktion, insbesondere Reconciliation nach verspäteten/mehrfachen/teilweise bezahlten Ereignissen sowie Einhaltung der `pending/non-posting`-Grenze.
3. **A03 nach Interface-Cross-Review:** Betrag-/Steuer-/Bewertungsinputs, Opening-OP-Einzelzuordnung sowie Kosten-/Bestands-/COGS-Ereignisse bleiben gesonderte, fachlich belegte Folgearbeit. Keine Default- oder Startwerte aus dem älteren V1/V2-Profil übernehmen.
4. Vier vollständige 12-Monats-Szenarien, End-to-End-Reconciliation und Browser-/Mobiltest sind nicht ausgeführt. T-0069 ist insgesamt offen.

**Rückfragen an A01:** Keine Nutzerentscheidung nötig. Die konkrete A02-Integrationsschnittstelle und die A09-Review sind notwendige Folgeaufträge.

## A09-Finanzruntimeprüfung: F-01/F-02 Korrektur (2026-10-31)

A09s unabhängiger Review (`docs/test-reports/a09-t0069-finance-runtime-review.md`) hatte NONPASS mit zwei reproduzierbaren Befunden gemeldet:

- **F-01:** Eine Rechnung konnte vor den gespeicherten Leistungs- und Kundenabnahmedaten datiert sein.
- **F-02:** Ein Performance- und ein Rechnungsereignis konnten dieselbe Ereignis-`sourceRef` verwenden.

Die A03-Korrektur beschränkt sich auf diese Befunde. Der Performancezustand speichert nun das Quell-Leistungsdatum und das belegte Abnahmedatum; die Rechnung wird zurückgewiesen, wenn ihr eigenes Wirksamkeits-/Rechnungsdatum vor einem der beiden liegt. Event-`sourceRef`s müssen jetzt global eindeutig gegenüber Eröffnungssnapshot und allen bereits verarbeiteten Finanzereignissen sein; identisches Replay desselben Event-ID/Payload-Paars bleibt weiterhin No-op.

Persistente Regressionen decken Rechnung vor Abnahme und Wiederverwendung der Performance-`sourceRef` ab. Zudem wurde die vorhandene Wiederverwendungsprobe für Zahlungen auf die globale Eindeutigkeitsfehlermeldung abgestimmt.

**Ausführung:** F-01/F-02-Fix und gezielte Regressionen durch A03.  
**A03-Eigenreview:** PASS für die zwei korrigierten Invarianten; kein weiterer Accounting- oder Produktregelumfang verändert.  
**Unabhängige QA:** A09-Re-Review nach diesem Fix noch nicht ausgeführt; A01 soll den separaten Re-Review auslösen.  
**Browser-/Gerätetest:** nicht ausgeführt; API-only.  
**Tests:** `node prototype/v3-finance-runtime-regressions.mjs` PASS; `node --check prototype/v3-finance-runtime.js` PASS; gezielter `git diff --check` für Runtime, Regression und Bericht PASS.  
**Git:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; lokale Paralleländerungen blieben erhalten. Kein Commit oder Push.
