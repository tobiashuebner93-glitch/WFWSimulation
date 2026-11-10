# A02-Cross-Review T-0069: Finanzmatrix gegen Run-Choreografie

**Status:** Cross-Review abgeschlossen; Schnittstellen-Vollständigkeit **NONPASS**, keine bestätigte widersprüchliche Finanz-/Periodenpolicy
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069
**Startprofil:** V3-Szenario ab 2027-01-04; V1-/V2- und 2019-/2027-Profile nicht verändert
**Maßgebliche Entscheidungen:** D-0159, D-0161–D-0164, insbesondere D-0162
**Vorgänger:** CP-0279 und CP-0280 (ENTWURF)
**Geprüfte Entwürfe:** A02 `docs/simulation/a02-t0069-v3-run-choreografie.md`; A03 `docs/accounting/a03-t0069-v3-finance-handoff-matrix.md`; A11 `docs/architecture/a11-t0069-v3-integration-assessment.md`
**Gitbasis laut Fachunterlagen:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Preflight und Prüfgrenze

Für diesen Cross-Review wurden `AGENTS.md`, Agentenstruktur, Rechtekarte, Ziele, Ticket-Board, Collaboration State, Decision Log, CP-0279/CP-0280, der A02-Laufvertrag, T-0065-/T-0066-Verträge, A03-Finanzschnittstellenpaket und T-0067-Vertrag, A03-Finanzmatrix, A11-Analyse sowie A09-T-0069-QA-Vorbereitung berücksichtigt. Die Git-Referenz und der Arbeitsbaumzustand wurden erneut geprüft.

Der Checkout meldet bei `git status` trotz erfolgreichem `git rev-parse` und vorhandener Worktree-Metadaten `fatal: this operation must be run in a work tree`. Deshalb war eine aktuelle vollständige Status-/Diff-Aufzählung in diesem Review nicht verfügbar. Die in den zugrunde liegenden A02-/A03-/A11-Berichten angegebene HEAD-Basis lautet `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; diese Angabe wird hier nicht als neu verifizierter sauberer Arbeitsbaum ausgegeben.

Geprüft wurde ausschließlich die fachliche Vertragskompatibilität und die Vollständigkeit der Handoffs. Keine Simulations-, Finanz-, Rechts-, Architektur- oder Schemaentscheidung wird hier getroffen; keine fremde Datei wurde verändert.

## Ergebnis

**Fachliche Kompatibilität: PASS mit präziser Korrektur-/Klarstellungsaufgabe. Integrationsreife: NONPASS.**

A02 und A03 trennen konsistent:
- Marktchance/Angebot/Annahme vom tatsächlichen Auftrag, Leistung, Rechnung und Zahlung;
- operative Ereignisse von autorisierten A03-Finanzereignissen;
- Monatsflüsse von Stichtagsbeständen gemäß D-0162;
- operative Tage und Makroperioden;
- Kundenabnahme als Auftraggeber-/Empfängerereignis gemäß D-0157;
- Kundenauftrag/Fertigungsablauf von T-0066s eigenem Produktlebenszyklus;
- Planung/physische Produktion von Bewertung, Buchung, Forderung und Cash.

Es wurde keine gegensätzliche D-0162-Periodenregel, keine umgekehrte Abnahmezuständigkeit und keine Erlaubnis für A02 zur Ledger-/Cashmutation gefunden. A03 weist selbst darauf hin, dass die aktuelle V3-Laufzeit keine Ist-Posting-, Rechnungs-, Zahlungseingangs- oder Finanz-Reconciliation-API besitzt. Die im A02-Entwurf ausdrücklich pending/non-posting geführten Folgeschritte sind damit sachgerecht; sie erfüllen aber noch keine ausführbare End-to-End-Finanzabnahme.

## Konflikte bzw. semantische Unschärfen

| Thema | Befund | Bewertung | Konkreter Vorschlag an A01 |
|---|---|---|---|
| Produktions-Cashgate | Die Choreografie sagt, fehlende Cash-/Bewertungsfreigabe blockiere den jeweils abhängigen Ist-Übergang. A03 empfiehlt, kein zusätzliches Produktions-Cashgate, keinen automatischen Dispo-Drawdown und keine Kreditregel einzuführen, solange ein bestehender Vertrag die Wirkung nicht abdeckt. Der ältere T-0066-Rahmen nennt Cash als Ressourcengrenze, während die A03-Matrix keine produktive Cash-/Bewertungs-API bereitstellt. | **Echte Grenzunschärfe, noch keine sichere Policykollision.** Nicht eindeutig ist, ob die A02-Formulierung tatsächliche Arbeitsausführung oder nur deren finanzielle Bewertung/Posting blockiert. | Klarstellen: Fehlende A03-Cash-/Bewertungs-/Posting-API blockiert ausschließlich den jeweils davon abhängigen finanziellen Bewertungs-/Posting-/Reconciliation-Handoff und hält diesen `pending/non-posting`. Sie erzeugt keine neue operative Produktions-Cashprüfung. Ein Produktionsgate darf nur aus einer bereits freigegebenen, konkreten A03-Regel konsumiert werden; kein Drawdown/Finanzierungsdefault. |

## Fehlende Felder und Handoffs

Diese Befunde sind keine widersprüchlichen Regeln; sie verhindern aber einen vollständigen integrierten Lauf und müssen vor einem T-0069-PASS geschlossen sein.

| Lücke | A02-Choreografie | A03-Finanzmatrix | Erforderliche Klärung/Übergabe |
|---|---|---|---|
| Kanonische Quell-ID-Kette | Verwendet modulstabile IDs, `eventId`, `sourceRefs`, `causedByEventId` und eine logische Run-Hülle. | Verlangt eine einmalige A03-Quellreferenz/Finanzreferenz und nennt `sourceEventId` als Referenzbegriff, ohne technische API-/Ledgerfelder freizugeben. | Einen logischen, durchgehenden Verweis festlegen: Markt-`inquiryId` → `offerId`/Snapshot-ID → echte `decisionId` → eindeutige Kunden-`workOrderId` → T-0066-Operations-/Verbrauchs-IDs → Liefer-/Empfängerabnahme-ID → Rechnungs-`sourceRef`/ID → Zahlungseingangs-`sourceRef`/ID → A03-Finanzreferenz. Jede ID bleibt in ihrem Modul führend; A03-Referenzen zeigen auf genau ein wirksames fachliches Quellereignis. Kein Schemafeld wird hier freigegeben. |
| Marktentscheidung an Arbeitsauftrag | A02 kennt die echte `decisionId`, hält aber fest, dass die sichere Spielerprojektion sie nicht downstream verfügbar macht. | A03 verlangt, dass angenommener Auftrag auf dieselbe Entscheidung, dasselbe Angebot und denselben unveränderlichen Vertragssnapshot zeigt. | A02 muss eine stabile, echte, redigierungsfreie interne Laufreferenz bereitstellen und genau eine `workOrderId` pro angenommener `decisionId` erzeugen. `won`/Status allein genügt nicht. |
| Kundenauftrag gegenüber Eigenprodukt | A02 benennt T-0066 derzeit als Produktlebenszyklus und fordert getrennte Kunden-`workOrder`/Operations. | A03 führt tatsächliche Kundenfertigung und T-0066-Produktentwicklung/-produktion als getrennte Vorgangsarten. | Einen eigenen Kundenauftrags-/Operationsadapter ausweisen. T-0066-Eigenprodukt-IDs dürfen nicht als Kundenauftrag ausgegeben oder als Ersatz für Kunden-`workOrderId` benutzt werden. |
| Leistungs-, Liefer- und Abnahmedatum | A02 trennt Fertigstellung, Lieferung, Empfänger-/Kundenabnahme und wartet auf Leistungs-/Abnahmekriterium. | A03 trennt Produktionsabschluss, Lieferung, Abnahme, Leistung, Rechnung und Zahlung; Leistungs-/Abnahmekriterium ist der Finanzquellvorgang, weist aber keine universelle Datumspriorität aus. | Als getrennte Ereignisse/Datumstypen übergeben: `productionCompletedAt`, `deliveryDate`, `acceptanceDate`, `performanceDate`. Der konkrete Auftrag muss das relevante Leistung-/Abnahmekriterium liefern. A03 muss im Fachvertrag benennen, welches tatsächliche Datum für Umsatz/Forderung/COGS maßgeblich ist; keine generische Abnahmefiktion durch A02. Bis dahin bleibt der Finanzübergang pending. |
| Rechnung / offene Forderung | A02 führt Leistung/Abnahme und danach einen generischen A03-Finanzhandoff auf. Rechnungsdatum und eigenständige Rechnungsreferenz sind im Ablauf nicht als eigener Handoff-Schritt verankert. | A03 verlangt eine separate Rechnung/OP-Schnittstelle und sagt, Rechnungsstellung darf Leistungserlös/Forderung nicht doppelt erzeugen. | Separater Schritt nach autorisiertem Leistungs-/Abnahmeereignis: Rechnungsereignis mit eigenem Rechnungsdatum und eigener stabiler SourceRef/Rechnungs-ID. Bis A03-API/Regel verfügbar: `pending/non-posting`; Rechnung darf den Erlös nicht erneut auslösen. |
| Zahlungseingang | A02 sagt, Zahlung und Cash bleiben von Leistung/Rechnung getrennt, führt aber keinen konkreten Zahlungseingangs-Schritt mit Datum/Quell-ID aus. | A03 verlangt eine tatsächliche Zahlungseingangsreferenz, die Forderung senkt und Bank/Cash erhöht, ohne Erlös erneut zu buchen. | Separater späterer Schritt: tatsächliches Zahlungseingangsereignis mit eigenem Zahlungstag, Zahler, Betrag/Währung und eigener stabiler SourceRef plus Rechnungs-/OP-Bezug. A03 stimmt AR/Cash ab; keine Erlöswiederholung. Bis A03-API/Regel verfügbar: `pending/non-posting`. |
| Finanz-/Produktbestand und Kostenbasis | A02 erfasst physische Materialverwendung, Fertigstellung und Lagerzustand; Werte/Bewertung verbleiben bei A03. | A03 benötigt tatsächliche Mengen, Einheiten, Kostensätze, BAB-Version, Bestandswertbasis und Stichtag; die Posting-/Bewertungs-API fehlt. | Mengen/Einheiten/Zeiten/Datum und Kosten-/BAB-Snapshot mit der A02-Quell-ID übergeben. A03 entscheidet Wert und Finanzwirkung. Ohne vollständige Basis kein WIP-/Fertigwaren-/COGS-/Ledger-PASS. |
| Run-/Finanzversionsbindung | A02 nennt `runId`, `scenarioId`, Seed und Modell-/Profil-/Kalender-/Parameter-/Source-Snapshot-Versionen. | A03 nennt Run-/Quellreferenzen, verlangt aber unveränderliche Kalkulations-/BAB- und Vertragssnapshots. | Der A03-Handoff erhält denselben Run-/Szenariobezug plus unveränderlichen Angebots-/Vertragssnapshot, Kosten-/BAB-Version und fachliche Ereignisversion. Änderungen nach Annahme bleiben ausgeschlossen; Replay mit Konflikt wird abgewiesen/überprüft. |
| Lernereignisse | A02 verlangt read-only Lernreferenzen auf bestehende Ereignisse, nicht blockierend gemäß D-0159; Lernfragen-Laufzeitwirkung ist noch nicht vorhanden. | Kein Widerspruch; A03-Matrix gibt keine finanzielle Lernwirkung frei. | T-0068-Verweise können nur bestehende Run-/Event-/Markt-IDs lesen. Eventantworten dürfen keine A03-Buchung, OP-/Cash-/Bestandswirkung hervorrufen; eine erlaubte nichtfinanzielle Wirkung benötigt gesonderten D-0147-konformen Vertrag. |

## Abgleich nach geforderten Achsen

- **Source-event IDs:** semantisch vereinbar, aber Bezeichner und durchgehende Mappingkette fehlen. `eventId`/ `sourceRefs` (A02) und `sourceEventId`/Finanzreferenz (A03) sind nicht als einheitlicher Alias-/Referenzvertrag festgelegt. Fehlende A02-`decisionId`-Exposition bleibt konkreter Blocker.
- **Acceptance-/Status-Chronologie:** kein Konflikt. Fällige Angebotsentscheidung wird vor Angebotsablauf verarbeitet. Nur angenommenes Angebot erzeugt Vertrags-/Auftragsstatus; Annahme selbst ist noch keine Leistung oder Finanzbuchung. Auftraggeber-/Empfängerabnahme bleibt vom Auftragnehmer getrennt. Abnahme-/Leistungsereignis, Rechnung und Zahlung brauchen separate Status/IDs.
- **Perioden-/Datumsemantik:** D-0162 ist konsistent: operative Finanzflüsse in Kalendermonat, Jahresfluss als Summe der zwölf Monate, Cash/OP/Bestände an Stichtagen; operative Tagesdaten und Makromonat bleiben getrennte Achsen. Offen ist, ob für Leistung/Forderung das Leistungs- oder ein vertraglich konstitutives Abnahmedatum wirksam ist und wie Rechnung-/Zahlungstage unabhängig gespeichert werden.
- **Nonposting-/Autorisierungsgrenzen:** konsistent in der Autorität; A02 mutiert keine Finanzkonten. A03-Matrix stellt klar, dass aktuell keine Ist-/Ledger-/AR-/Cash-API integriert ist. A02 darf daher bis zu autorisiertem und implementiertem A03-Handoff nur referenzieren/pending melden.
- **Produkt- vs. Kundenauftrag:** konsistent getrennte Begriffe, aber keine technische/logische Kunden-Workorder-Verbindung vorhanden. Eigenprodukt-Schritte sind kein Ersatz.
- **Cash-/Bestands-/Forderungs-/Ledger-Gates:** keine Salden aus Anfrage/Angebot/Annahme oder reiner Planung. Tatsächliche Verbrauchs-/Leistungs-/Rechnungs-/Zahlungsereignisse bleiben getrennt. Fehlende API verhindert den A03-Finanz-PASS; ob Cash die operative Produktion blockiert, muss gegen die bestehenden T-0066-Grenzen klar formuliert werden und darf nicht neu erfunden werden.

## Konfliktlösungsvorschläge an A01

1. **Cash-Wortlaut vor Integration präzisieren** wie oben: keine neue operative Produktionsprüfung aus fehlender Finanz-API; nur nicht verfügbare finanzielle Bewertung/Posting/Reconciliation bleibt blockiert. A03 entscheidet, ob und wann ein bereits bestehender Cash-Gate-Input konsumiert wird.
2. **Quellreferenzkette als logischen Vertrag übernehmen**, ohne Datenbankschemafreigabe: Marktangebot und echte Entscheidung → Kundenauftrag → Operations/Verbrauch → Lieferung/Empfängerabnahme/Leistung → Rechnung/OP → Zahlungseingang → einmalige A03-Finanzreferenz. Getrennte Ereignisse erhalten getrennte IDs und Daten.
3. **A02-Choreografie um Rechnung und Zahlung ergänzen**, jeweils mit eigenem Datum und Quellverweis, strikt nach Leistung/Abnahme bzw. tatsächlicher Zahlung. Beide Handoffs sind bis A03-Ist-API/Autorisierung `pending/non-posting`; Zahlung darf AR/Cash abstimmen, jedoch keinen Erlös erneut auslösen.
4. **A03 um Re-Review bitten**, nachdem A02 den Bericht vorgelegt und die Choreografie nach A01s Integration aktualisiert hat. Danach kann A01 einen separaten Implementierungsscope und A09-Akzeptanztests bestimmen.

Diese Vorschläge ändern keine Nutzerentscheidung und füllen keine fehlenden Preise, Kosten, Zahlungstermine, Bewertungsregeln oder rechtlichen Vertragsbedingungen.

## Nachweisrollen und Git

- **Ausführung:** Verträge, D-Entscheidungen, IDs, Reihenfolge und Begrenzungen quer gelesen; Cross-Review erstellt.
- **Fachreview A02:** durchgeführt; PASS für Regelkompatibilität, NONPASS für integrierte Vollständigkeit (fehlende Datum-/ID-/Finance-Handoffs).
- **Fachreview A03:** A03-eigene Matrix und Fachverträge gelesen; A03-Re-Review dieser Cross-Review-/aktualisierten A02-Fassung ausstehend.
- **Unabhängige QA A09:** nicht ausgeführt; kein Gesamtjahreslauf.
- **Browser-/Gerätetest A12:** nicht ausgeführt; Dokumentationsreview.
- **Git-Verifikation:** HEAD laut Dokumentenbasis `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; `git status` schlug mit „not a work tree“ fehl, daher keine aktuelle Status-/Diff-Bestätigung.
- **Commit/Push:** keiner.

## Nächster Schritt

A02 hat die genannten Klarstellungen in der Choreografie ergänzt. A01 koordiniert jetzt das ausstehende A03-Re-Review; T-0069 bleibt bis zu realen, autorisierten API-/Eventübergaben und unabhängiger Jahres-/Reconciliation-QA offen.

## Nachtrag nach Aktualisierung der A02-Choreografie (2026-10-31)

A03s Befunde wurden in docs/simulation/a02-t0069-v3-run-choreografie.md umgesetzt:

- **Rechnung/OP:** eigener Handoff nach autorisiertem Leistungs-/Abnahmeereignis mit separater invoiceId, invoiceDate und invoiceSourceRef; eine Rechnung erzeugt den bereits autorisierten Erlös nicht erneut.
- **Zahlungseingang:** eigener tatsächlicher Zahlungshandoff mit separater paymentId, paymentDate und paymentSourceRef; A03 stimmt Forderung und Cash/Bank ab, ohne einen Erlös erneut zu erzeugen.
- **Cash-/Bewertungsfreigabe:** Wortlaut begrenzt die fehlende A03-API auf den finanziellen Bewertungs-/Posting-/Reconciliation-Handoff. Daraus wird keine neue operative Produktions-Cashprüfung abgeleitet.
- **Quellidentitäten:** die logische Referenzkette von Anfrage/Angebot/Snapshot/Entscheidung über Kundenauftrag, Arbeitsoperationen, Leistung/Lieferung/Empfängerabnahme, Rechnung und Zahlung bis zur A03-Finanzreferenz ist ausdrücklich festgehalten. Keine Datenbankfelder oder neue Finanzpolicy werden freigegeben.

**Aktueller Reviewstatus:** PASS für Regelkompatibilität; keine bestätigte Policykollision. Echte Runtime-/API-Vollständigkeit bleibt **NONPASS / offen**, weil die A03-Ist-/Rechnungs-/OP-/Zahlungseingangs- und Reconciliation-APIs sowie der integrierte Lauf fehlen. A03-Re-Review der aktualisierten Choreografie steht aus.

**Nachweis:** kurzer Preflight erneut durchgeführt; nur dieser Reviewbericht wurde ergänzt. Keine Runtime-Regressions, Jahres-QA oder Browser-/Geräteprüfung ausgeführt. git status und git diff --check scheiterten auch mit explizitem --git-dir/--work-tree jeweils mit fatal: this operation must be run in a work tree; daher ist keine Gitstatus- oder Git-Diff-Check-Verifikation bestätigt. Kein Commit oder Push.

