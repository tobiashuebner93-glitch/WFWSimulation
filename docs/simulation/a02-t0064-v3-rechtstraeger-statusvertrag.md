# A02-Modellvertrag – T-0064 Rechtsträger-, Gründungs- und Zusammenschlussstatus

**Status:** A02-Fachentwurf für A01; keine Implementierungs-, Rechts- oder Freigabeerklärung

**Adressat:** A01 – MASTER_ORCHESTRATOR

**Agent / Ticket:** A02 – SIMULATION / T-0064

**Goals:** MG-002 / SLG-002.2 / SLG-002.5; V3-19 bis V3-21

**Entscheidungen:** D-0161, D-0163, D-0164; Vorgänger CP-0280 (ENTWURF)

**Prüfstand:** Rechtsstand 2026-10-31 gemäß A08-Matrix/D-0161; nicht das historische Recht des Profiljahres
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals/V3-Zielkarte, T-0064, Collaboration State, A01-V3-Plan, CP-0280, D-0161/D-0163/D-0164, [A08-Rechtsformmatrix](../research/a08-t0064-v3-gruendung-rechtsformen-zusammenschluesse.md) und Repositorystatus/Diff erneut geprüft.

## 1. Geltung und Verantwortungsgrenzen

Dieser Vertrag beschreibt einen logischen V3-Modellablauf für Gründung, Rechtsträger und Zusammenschlüsse. Er ändert kein V1-/V2-Verhalten, genehmigt kein Schema oder Architekturmodell und ersetzt keine Rechts-/Steuerberatung. Rechtsaussagen und Voraussetzungen werden nur aus A08s T-0064-Matrix übernommen; ungelöste Einzelfallfragen bleiben als Prüfstatus sichtbar.

| Zuständigkeit | Vertragspflicht |
|---|---|
| A02 | Zustände, Transitionen, Voraussetzungen, Identitäts-/Referenzbeziehungen, Reihenfolge und deterministische Ereignisbehandlung |
| A08 | aktuelle Rechtsquellen, konkrete Form-/Vertragsprüfung und Status einer nötigen Fachprüfung; keine Produktscope-Entscheidung außer bestehender Nutzerentscheidung |
| A03 | ausschließlich getrennte, autorisierte Finanzereignisse und ihre Buchung/Cash-/Periodenwirkung; kein Rechtsträgerstatus wird selbst gebucht |
| A05 | Darstellung freigegebener Status, Zuständigkeiten und Blockgründe; keine eigene Rechtsbewertung oder Rechtsformfreischaltung |
| A09 | spätere unabhängige Grenzfall-, Duplikat-, Status- und Quellenprüfung |
| A01 | Koordination offener Scope-Entscheidungen und Folgeaufträge |

## 2. Produktumfang und Statuslabels

- **V3 spielbar:** Einzelunternehmen als vorhandener/Gründungs-Ausgangsfall, soweit das gewählte Profil es vorsieht; GmbH & Co. KG als ausdrücklicher D-0163-Fall. Die V3-Aufnahme der GmbH & Co. KG bedeutet keine pauschale Freigabe jeder Beteiligungs-, Register- oder Vertretungskonstellation.
- **GmbH & Co. KG:** keine einzelne umbenannte Gesellschaft. Mindestens eine GmbH als Komplementärin und die KG sind zwei getrennte `entityId`s, mit eigenen Status-/Registerbezügen, Vermögen, Verbindlichkeiten und Verträgen. Die GmbH wird durch ihre Geschäftsführung vertreten; die KG durch ihre Komplementärin. Kommanditisten erhalten nicht allein durch ihre Beteiligung eine KG-Vertretungsbefugnis. A08 nennt zusätzlich GmbH-Kapital-/Gründungspflichten, KG-Vertrag, Einlagen/Haftsumme, HGB §172 Abs. 5 und Firmenhinweis nach HGB §19 Abs. 2 als Fallprüfungen.
- **Kandidaten, nicht freigeschaltet:** AG, eG und GmbH & Co. KGaA bleiben bis zu einer ausdrücklichen Vor-Release-Nutzerentscheidung `candidate_not_enabled`. Kein neuer V3-Spielstand, keine Transaktion und kein Übergang darf sie stillschweigend aktivieren. D-0164 klärt nur die Bezeichnung „GmbH & Co. KGaA“.
- **Außerhalb V3:** gesetzliche Verschmelzung nach UmwG; kein allgemeiner Fusions-/Rechtsformwechselknopf. Andere Mischformen, Holding-/Kontrollstrukturen und UG & Co. KG erhalten durch diesen Vertrag keinen V3-Status.
- **Zusammenschlüsse im bestätigten Mindestumfang:** gemeinsamer Einkauf, Arbeitsgemeinschaft/Konsortium, Anteilserwerb und Unternehmenskauf. Die AG ist bei der Arbeitsgemeinschaft keine automatisch angenommene Rechtsform; Zweck und Vertrag können die konkrete Rechtsform beeinflussen. Wettbewerbsrechtliche Freigabe wird nicht aus der Bezeichnung oder einem Spielindikator abgeleitet.

## 3. Getrennte Zustandsachsen

Eine einzelne Statusvariable darf Geschäftsidee, Rechtsentstehung, Registerlage, Betriebsfähigkeit und Prüfung nicht vermengen. Logische Zustandsachsen:

1. **Gründungsvorhaben:** `idea` → `market_check` → `offer_defined` → `resources_and_capital_plan` → `viability_assessed` (`viable` / `not_viable`) → `form_selected` → `formation_prepared` → `operating_ready`.
2. **Rechtsträger:** stabile `entityId`, `entityType`, gewählte Form, Gründungs-/Rechtsstatus, Beteiligte und Vertretungsbezug. Die rechtliche Existenz-/Registerwirkung wird nicht durch einen bloßen UI-Klick behauptet.
3. **Register-/Formstatus:** `not_started`, `preparation`, `filing_pending`, `registered`, `rejected_or_returned`, `closed` oder `not_applicable` nur soweit A08 die jeweilige Form-/Vorgangszuordnung liefert. Die Registerwirkung ist je Rechtsform getrennt zu modellieren. Eine GmbH besteht als solche erst mit Eintragung (§ 11 Abs. 1 GmbHG); wer vorher im Namen der GmbH handelt, kann persönlich und gesamtschuldnerisch haften (§ 11 Abs. 2 GmbHG). Für eine KG gilt ein eigener Pfad: Im Verhältnis zu Dritten entsteht sie grundsätzlich mit Registereintragung; nimmt sie vorher mit Zustimmung sämtlicher Gesellschafter am Rechtsverkehr teil, entsteht sie grundsätzlich bereits dann (§ 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB, vorbehaltlich der dort genannten Ausnahme). Eine Eintragung ist daher kein pauschales gesetzliches Gate für jede betriebliche Tätigkeit.
4. **Betriebsfähigkeit:** `blocked`, `ready`, `operating`, `suspended`, `closed`; sie hängt von den getrennten, belegten Voraussetzungen und nicht nur von Rechtsformwahl oder wirtschaftlicher Tragfähigkeit ab.
5. **Transaktions-/Kooperationsstatus:** eigene Anfrage/Transaktion mit eigener ID und Prüfungslage; Statusänderungen wirken nicht automatisch auf beteiligte Rechtsträger zurück.

`viable` ist eine modellierte Wirtschaftlichkeitsbewertung, kein rechtliches Gründungsmerkmal und keine Gründungs-/Finanzierungszusage. `registered` ist ein Status mit belegtem Registerereignis, kein aus einer Absicht abgeleiteter Zustand.

## 4. Übergänge und Voraussetzungen

### 4.1 Gründung

| Übergang | Mindestbedingungen / Ergebnis | Fehlerfall |
|---|---|---|
| Idee → Markt-/Kundenprüfung | Geschäftsidee/Leistungsannahme und prüfbarer Kunden-/Marktbezug sind vorhanden. | Fehlende Angaben lassen den Schritt offen; kein erfundener Marktbeleg. |
| Marktprüfung → Leistungsangebot | getestetes/abgegrenztes Leistungsangebot ist dem Vorhaben zugeordnet. | Widersprüchliches Leistungsprofil blockiert Folgeschritt bis Korrektur. |
| Angebot → Ressourcen-/Kapitalplan | benötigte Betriebsmittel, Personal, Fläche, Kapital und zeitliche Verfügbarkeit sind als Plan erfasst. | Plan ist keine Auszahlung, Kreditgenehmigung oder Vermögensbuchung. |
| Plan → Tragfähigkeitsbewertung | der V3-Kalkulationsvertrag und die verfügbaren Betriebsszenarien liefern nachvollziehbare Annahmen. Ergebnis ist `viable` oder `not_viable` mit Gründen. | Fehlende Kosten-/Finanzinputs ergeben `assessment_incomplete`, nicht automatisch `viable`. `not_viable` blockiert Betriebsaufnahme, bis Annahmen oder Ressourcen geändert und neu bewertet wurden. |
| Bewertung → Formauswahl | nur im V3-Scope freigeschaltete Rechtsform kann ausgewählt werden; Voraussetzungen/Abweichungen aus A08 werden referenziert. | Kandidat `candidate_not_enabled` wird abgewiesen, ohne Zustand oder Finanzwerte zu ändern. |
| Formauswahl → Unterlagenvorbereitung | erforderliche, in A08 benannte Daten/Vertrags-/Kapital-/Organangaben sind vollständig und den korrekten Rechtsträgern zugeordnet. | Unvollständige oder widersprüchliche Parteien/Vertretung bleiben `preparation`; keine aktive Gesellschaft wird behauptet. |
| Vorbereitung → Eintragung/Statusnachweis | Nur ein belegtes Register-/Statusereignis darf den jeweiligen Registerstatus `registered` setzen. Für eine GmbH bleibt die GmbH-Existenz bis dahin aus; vorherige Handlungen erhalten einen gesonderten `pre_registration_acting`-Prüfstatus nach § 11 Abs. 1–2 GmbHG. | Zurückweisung oder fehlender Nachweis bleibt pending/returned; keine GmbH-Existenz wird vorgetäuscht. Mögliche Handelndenhaftung wird als Prüfhinweis, nicht als berechnete Haftungsfreigabe oder automatische Buchung erfasst. |
| KG-Geschäftsaufnahme vor Eintragung | Separater, belegter Status `pre_registration_business_activity` ist nur möglich, wenn die Zustimmung sämtlicher Gesellschafter dokumentiert und die einschlägige Einzelfallprüfung (insbesondere § 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB samt dortiger Ausnahme) nicht offen ist. Dieser Pfad betrifft die Entstehung im Verhältnis zu Dritten; er setzt nicht automatisch `registered` und ist kein allgemeines Betriebsbereitschafts-Gate. | Fehlende/einzelne Zustimmung oder ungeklärte Ausnahme blockiert diesen Pfad (`needs_review`); keine automatische Außenwirkung behaupten. |
| Voraussetzungen → betriebsbereit | Geschäftsfähigkeit, erforderliche Vertretungsrollen, Standort/Ressourcen und belegte Betriebsbedingungen sind erfüllt. Das ist ein Produktstatus und wird nicht allein aus Registereintragung oder deren Fehlen abgeleitet. | Blockgründe bleiben pro Voraussetzung sichtbar; kein stiller Workaround. |

Die Übergänge modellieren keine Notar-/Registergebühren, Dauer, Steuerfolgen oder automatische Zahlung. Diese Beträge/Finanzereignisse benötigen A03- und ggf. weitere Fachinputs. Die Rechtsstatuspfade bilden § 11 GmbHG (GmbH vor Eintragung) getrennt vom KG-Pfad nach § 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB ab; sie behaupten weder allgemeine Betriebserlaubnis noch pauschale Haftungsfolgen. Das Datum verwendet aktuelle Rechtsanforderungen gemäß D-0161, auch wenn das Szenario 2019 oder 2027 startet.

### 4.2 GmbH & Co. KG

Die Gründung wird als referenzierte Folge mit getrennten GmbH- und KG-Statusobjekten modelliert. Die GmbH darf erst nach belegtem GmbH-Registerstatus als GmbH-Komplementärin geführt werden; vorherige Handlungen im GmbH-Namen erhalten den separaten Prüfpfad zu § 11 Abs. 1–2 GmbHG. Die KG erhält einen eigenen Gründungs-/Register-/Vertretungsstatus und wird nicht mit der GmbH-Identität verschmolzen. Eine KG-Geschäftsaufnahme vor Eintragung ist im Modell als eigener Pfad nur bei dokumentierter Zustimmung sämtlicher Gesellschafter und geklärter Anwendbarkeit von § 123 Abs. 1 i. V. m. § 161 Abs. 2 HGB zulässig; sie setzt den Registerstatus nicht auf `registered`. Bei einer GmbH & Co. KG legitimiert dieser KG-Pfad insbesondere nicht, eine noch nicht eingetragene GmbH als bereits existierende Komplementärin zu behandeln; die konkrete Parteien-/Vertretungskonstellation bleibt separat zu prüfen. Voraussetzungen werden mindestens gegen A08s Fallliste geprüft: GmbH-Gesellschafter/-Kapital/-Geschäftsführung, KG-Vertrag, Komplementärstellung und KG-Vertretung, Kommanditisten/Einlagen/Haftsumme, §172(5)-Warnfall und Firmenhinweis, soweit anwendbar. Nicht vollständig geprüfte Punkte bleiben `needs_review`; die Formbezeichnung allein setzt sie nicht auf bestanden.

Ein Formwechsel, eine Übertragung von Altvermögen oder eine automatische Vertrags-/Schuldenübernahme von einem Einzelunternehmen in die neuen Rechtsträger wird nicht unterstellt. Jede gewünschte Übertragung benötigt eigene identifizierte Parteien, Vermögens-/Vertragsreferenzen, fachliche Prüfung und separate, autorisierte A03-Finanzereignisse. Ein Inhaber/Gründer als Person bleibt eine eigene Identität neben allen Gesellschaften.

### 4.3 Kooperation und Konzentration

1. **Gemeinsamer Einkauf:** `proposed` → `terms_defined` → `competition_review_pending` (wenn relevant/ungeklärt) → `accepted` oder `declined`/`expired`. Teilnehmer, Gegenstand, Laufzeit, gemeinsame Menge und individuelle Kauf-/Lieferverpflichtungen sind einzeln referenziert. Gemeinsame Wiederverkaufspreise, Marktaufteilung oder Austausch individueller Konkurrenzangebote werden nicht als harmlose Funktion zugelassen. GWB §1/AEUV Art. 101 sind gemäß A08 Prüfanker, keine automatische Spielempfehlung.
2. **Arbeitsgemeinschaft/Konsortium:** eigener Kooperationsdatensatz mit `projectPurpose`, Teilnehmern, Laufzeit, Verantwortungs-/Vertretungsbezug und expliziter `legalFormAssessmentStatus`. Die Bezeichnung allein erzeugt keine GbR. Bis Zweck/Vertrag und erforderliche Prüfung geklärt sind, lautet der Status `needs_legal_form_review`; keine pauschale Außenhaftungszuweisung.
3. **Anteilserwerb:** Ziel-`entityId` bleibt dieselbe rechtliche Identität. Anteil-/Kontrollbeziehungen erhalten neue zeitlich wirksame Eigentümer-/Kontrollreferenzen. Die Zielgesellschaft wird nicht durch den Käufer ersetzt und ihre Schulden/Verträge bleiben bei ihr, sofern keine gesonderte wirksame Transaktion sie ändert.
4. **Unternehmenskauf / Vermögenserwerb:** Käufer- und Ziel-`entityId` bleiben unterscheidbar. Übertragen werden nur ausdrücklich benannte, zulässigerweise übertragene Vermögens-/Vertragsreferenzen nach eigener Prüfung. Vor Abschluss ist zusätzlich zu prüfen, ob ein Betrieb oder Betriebsteil durch Rechtsgeschäft auf einen neuen Inhaber übergeht: Falls § 613a BGB im konkreten Sachverhalt greift, gehen die zu diesem Zeitpunkt bestehenden Arbeitsverhältnisse grundsätzlich kraft Gesetzes mit über; Betroffene sind vorab in Textform zu informieren und können innerhalb eines Monats nach Zugang der Unterrichtung widersprechen (§ 613a Abs. 5–6 BGB). Kündigungen gerade wegen des Übergangs sind nach Abs. 4 unwirksam. Für Verpflichtungen aus den übergehenden Arbeitsverhältnissen gilt zusätzlich der bedingte Haftungspfad nach § 613a Abs. 2 BGB: Der bisherige Arbeitgeber kann neben dem neuen gesamtschuldnerisch haften, soweit solche Verpflichtungen vor dem Übergang entstanden sind und innerhalb eines Jahres danach fällig werden. Werden sie erst nach dem Übergang fällig, haftet der bisherige Arbeitgeber nur in dem gesetzlichen Umfang entsprechend dem bei Übergang bereits abgelaufenen Teil ihres Bemessungszeitraums. Das Modell erfasst dazu nur Prüfinputs (Übergangsdatum, Verpflichtungsreferenz/Entstehungs- und Fälligkeitsdaten, Bemessungszeitraum, betroffene Arbeitgeber) und `formerEmployerLiabilityReviewStatus`; es berechnet keine Haftungsquote und erzeugt weder Buchung noch Zahlung. A02 übergibt diese Fakten an A03; nur A03 bestimmt nach seinem Finanzvertrag, ob ein separates autorisiertes Finanzereignis erforderlich ist. Das Modell führt außerdem `businessTransferReviewStatus`, betroffene Arbeitnehmerreferenzen sowie `informationStatus`/`objectionStatus`; es darf Beschäftigte weder stillschweigend als ausgeschlossen noch ohne Prüfung als übergegangen verbuchen. Gesondert ist mögliche Erwerberhaftung nach § 25 HGB zu prüfen: Sie kann insbesondere eintreten, wenn ein unter Lebenden erworbenes Handelsgeschäft unter der bisherigen Firma fortgeführt wird (§ 25 Abs. 1); Forderungen gelten nur bei Einwilligung des bisherigen Inhabers/der Erben als übergegangen. Eine abweichende Vereinbarung ist Dritten gegenüber nur unter den Voraussetzungen des Abs. 2 wirksam. Ohne Firmenfortführung greift eine Erwerberhaftung für frühere Geschäftsverbindlichkeiten nur bei besonderem Verpflichtungsgrund (§ 25 Abs. 3). Weder § 613a noch § 25 HGB wird pauschal auf jeden Assetkauf angewandt. Nicht benannte Schulden, Verträge oder Genehmigungen wechseln nicht allein wegen eines pauschalen `closed`-Status.
5. Bei Anteils-/Kontroll- oder Vermögenserwerb erhält die Transaktion `competitionReviewStatus` mindestens `not_assessed`, `needs_data`, `review_required`, `review_completed` oder `not_cleared`. A02 bestimmt keine Schwellen, gesetzliche Anmeldepflicht oder Freigabe; nur ein explizit belegtes Prüfergebnis kann den Transaktionsabschlussstatus ändern. Ohne Daten lautet das Ergebnis `needs_data`/`review_required`, nie eine automatische Fusionskontrollfreigabe.

Die Transaktion verläuft `proposed` → `parties_identified` → `scope_and_terms_defined` → `due_diligence_pending` → `competition_review_pending` (falls einschlägig/ungeklärt) → `approval_pending` → `closed` oder `declined`/`expired`. Schritte können nur in dieser Reihenfolge voranschreiten, wenn ihre jeweils referenzierten Checks abgeschlossen sind. `closed` dokumentiert den Modellabschluss und ist keine allgemeine Aussage, dass alle gesetzlichen Genehmigungen oder Einzelfallpflichten erfüllt sind.

## 5. Rechtsträger- und Eigentümeridentität

- `entityId` identifiziert einen Rechtsträger dauerhaft; Änderung von Name, Formstatus, Registerangaben oder Eigentümern darf keine neue ID erzeugen oder die bestehende ID auf einen anderen Rechtsträger umdeuten.
- Natürliche Personen, Gesellschaften, Teilnehmer und Eigentümer haben getrennte IDs. Eigentum/Beteiligung und Kontrolle sind zeitlich gültige Beziehungen (`holderId`, `entityId`, `shareOrControlBasis`, `effectiveFrom`, `effectiveTo`, `sourceEventId`), keine Kopie von Gesellschaftsvermögen.
- GmbH & Co. KG hat mindestens `gmbhEntityId` und `kgEntityId`; Komplementärrolle, GmbH-Geschäftsführung und KG-Vertretung sind getrennte Referenzen. Ein Kommanditist wird nicht automatisch zum Vertreter.
- Vermögen, Forderungen, Verbindlichkeiten, Verträge und Beschäftigte sind grundsätzlich genau einem Rechtsträger zugeordnet. Übergänge zwischen Rechtsträgern bedürfen eines expliziten Transaktions-/Übertragungsbezugs und gegebenenfalls A03-Ereignissen. Gesetzliche Übergänge (insbesondere Beschäftigungsverhältnisse bei anwendbarem § 613a BGB) müssen vor Abschluss separat geprüft und als solche referenziert werden; keine pauschale „alles übernommen“-Migration.
- Identitäts-, Eigentümer- und Statushistorie wird nicht überschrieben. Historische und zukünftige Gültigkeit wird mit Datum und Provenienz nachvollziehbar; V1-/V2-Spielstände werden nicht umgestellt.

## 6. Minimales logisches Ereignisobjekt

Dies sind fachliche Felder, keine Schemafreigabe:

`eventId`, `eventType`, `scenarioId`, `modelVersion`, `effectiveDate`, `sourceOrDecisionRef`, `actorPersonId`, `actorEntityId`, `counterpartyEntityIds`, `targetEntityIds`, `beforeStatus`, `afterStatus`, `prerequisiteResults[]`, `ownershipOrControlChanges[]`, `assetTransferRefs[]`, `contractTransferRefs[]`, `legalReviewStatus`, `competitionReviewStatus`, `financialEventRef`.

- `eventId` ist stabil und schützt vor doppeltem Statusübergang im Replay. Ein erneut gelieferter Event mit gleicher ID und gleichem Payload wirkt nicht nochmals; gleiche ID mit abweichendem Payload ist ein Validierungsfehler und bleibt ohne Teilwirkung.
- Jede finanzielle Auswirkung muss auf ein eigenes von A03 definiertes `financialEventRef` verweisen. Ein Gründungs-, Register-, Kooperations-, Anteilserwerbs- oder Kaufstatus bucht selbst nichts und verändert keine Kasse, Verbindlichkeit, Forderung, Bilanz oder Buchung.
- Fehlende oder widersprüchliche Partei-/Rechtsträger-/Vertrags-/Vermögensbezüge setzen den Event auf `blocked`/`needs_review`; es gibt keine Teilaktivierung und kein stilles Auto-Mapping.
- Regel- und Rechtsquellenstand werden getrennt vom Szenariojahr geführt. Kein in der Vergangenheit liegendes Spieljahr setzt das aktuelle Recht auf einen früheren Stand zurück.

## 7. A05-/A03-Übergaben

**A05-UI:** Gründungsfortschritt mit Voraussetzungsliste, `viable/not_viable/assessment_incomplete`, aktive Form gegenüber `candidate_not_enabled`, zwei getrennte Einträge für GmbH und KG, Register-/Vertretungsstatus und klaren `blocked/needs_review`-Gründen darstellen. Kooperations-/Kaufansichten unterscheiden Anteilskauf von benanntem Vermögenserwerb und zeigen `competitionReviewStatus`. Haftung nie als „persönlich risikofrei“ labeln. Diese Felder sind UI-Inputs aus dem Fachvertrag; A05 entscheidet weder rechtliche Zulässigkeit noch Freischaltung.

**A03-Finanz:** A02 übergibt Parteien, Ereignisdatum, beteiligte Rechtsträger, vereinbarte Zahlungs-/Vermögens-/Vertragsreferenzen und Status. A03 legt gesondert fest, ob und wann Kapitalzuführung, Gebühren, Kaufpreis, übernommene Forderung/Verbindlichkeit oder spätere Umsätze/Zahlungen als Finanzereignisse erfasst werden. Vor deren Antwort keine Beträge, Buchungssätze, Steuerwirkung, Bilanzkontinuität oder Periodenzuordnung ableiten.

## 8. Reproduzierbare Grenzfälle für Folge-QA

1. Tragfähige Gründung passiert alle erforderlichen Statuschecks; nicht tragfähige Gründung bleibt mit Gründen gesperrt; unvollständige Inputs sind kein Erfolg.
2. Candidate `AG`, `eG` oder `GmbH & Co. KGaA` kann nicht initiiert werden; fehlendes Nutzer-Vor-Release-OK wird nicht ersetzt.
3. GmbH & Co. KG benötigt getrennte GmbH-/KG-IDs und belegte Register-/Rollenbezüge; GmbH ohne Registereintragung wird nicht als aktive GmbH behandelt; KG, GmbH, Kapital und Vertretung werden nicht verschmolzen.
4. Wiederholtes gleiches Ereignis ist idempotent; gleiches `eventId` mit anderem Payload blockiert.
5. Gemeinsamer Einkauf kann über Kooperation weitergehen, aber unbewertete Wettbewerbs-/Preisabstimmung bleibt gesperrt bzw. `needs_review`.
6. Arbeitsgemeinschaft ohne geklärte Vertragsform wird nicht automatisch als GbR erzeugt.
7. Anteilserwerb behält Ziel-`entityId`. Beim Asset-/Betriebskauf ist § 613a BGB mit Übergang, Information und möglichem Widerspruch der betroffenen Arbeitnehmer prüfbar; § 25 HGB wird nur bei seinen Voraussetzungen geprüft, insbesondere Firmenfortführung. Kein pauschaler Automatismus in die eine oder andere Richtung.
8. Fehlende Wettbewerbsdaten erzeugen `needs_data`; Transaktion erhält keine automatische Freigabe. Gesetzliche Verschmelzung bleibt nicht auswählbar.
9. Keine der reinen Status-/Kooperationsereignisse verändert ohne A03-financialEventRef Kasse, Ledger, Verträge oder V1/V2-Stand.

## 9. Offen für Agenten-Handoff

- **A08:** Quellen-/Rechtsreview dieser konkreten Statuslabels und Fallgrenzen; insbesondere welche Register-/Vertragsnachweise für jede unterstützte Kombination beim gewählten konkreten Szenario erforderlich sind.
- **A03:** Finanzereignisverträge für Gesellschaftsgründung, Einlagen/Kapital, Kooperationsbeschaffung, Anteilskauf und Assetkauf; dies wird nicht von A02 vorweggenommen.
- **A05:** UI-Entwurf gegen diese getrennten Statusachsen, mit Kandidaten- und Prüfstatus ohne falsche Freigabe.
- **A09:** unabhängige Quellen-/Scope-/Idempotenz- und Transfergrenzenprüfungen.
- **A01/Nutzer:** Vor-Release-Entscheidung zur Aufnahme von AG, eG und GmbH & Co. KGaA bleibt offen. Keine Rückfrage ist für diese A02-Modellvorarbeit erforderlich.

## 10. Nachweisstatus

- **Ausführung:** A02, dokumentarischer Modell-/Ereignisvertrag.
- **Fachreview:** A02-Abgleich gegen D-0161/D-0163/D-0164 und A08-Matrix durchgeführt. A08-Re-Review ist PASS mit dem Vollständigkeitshinweis zu § 613a Abs. 2; dieser Hinweis ist im Vertrag/Impactbericht umgesetzt. Unabhängiger A09-Grenzfallreview bleibt offen.
- **Automatisierte Tests:** vorhandene `prototype/a02-t0064-legal-regressions.mjs` nach dieser Dokumentänderung ausgeführt: PASS. Sie prüft bereits implementierte V2-Arbeitszeit-/Kalender-/Vertragsregeln und deckt den neuen V3-Statusvertrag nicht ab; hierfür bleibt A09-Grenzfallreview erforderlich. Keine neuen Tests oder Codeänderungen in diesem Dokumentauftrag.
- **Browser-/Gerätetest:** nicht ausgeführt; A05-UI nicht Teil dieses Vertrags.
- **Git-Verifikation:** bestehende Fremdänderungen geprüft und erhalten; kein Commit/Push.

### Quellen- und Entscheidungsanker

- [A08 T-0064 Rechtsform- und Zusammenschlussmatrix](../research/a08-t0064-v3-gruendung-rechtsformen-zusammenschluesse.md), Primärquellenstand 2026-10-31; enthält die einschlägigen BGB-, HGB-, GmbHG-, AktG-, GenG-, GWB-, AEUV- und UmwG-Anker. Dieser A02-Vertrag übernimmt daraus Statusgrenzen, nicht weitergehende Rechtsauslegung.
- Amtliche Primärquellen für die ergänzten Fallgrenzen: [HGB § 123](https://www.gesetze-im-internet.de/hgb/__123.html), [HGB § 161 Abs. 2](https://www.gesetze-im-internet.de/hgb/__161.html), [GmbHG § 11](https://www.gesetze-im-internet.de/gmbhg/__11.html), [BGB § 613a](https://www.gesetze-im-internet.de/bgb/__613a.html), [HGB § 25](https://www.gesetze-im-internet.de/hgb/__25.html). § 161 Abs. 2 HGB ordnet die entsprechende Anwendung der KG-Vorschriften an und bildet damit die Brücke für den KG-Pfad nach § 123 HGB. Die jeweiligen Voraussetzungen und Ausnahmen sind im konkreten Szenario von A08/Rechtsreview zu prüfen; diese Verweise sind keine Fallfreigabe.
- D-0161: aktueller Rechtsstand zum Prüf-/Releasezeitpunkt, unabhängig vom Simulationsjahr.
- D-0163: GmbH & Co. KG spielbar; AG/eG/GmbH & Co. KGaA Kandidaten mit Vor-Release-Auswahl; Kooperation und Konzentration im V3-Mindestumfang; gesetzliche Verschmelzung außerhalb.
- D-0164: Kandidatenname ist GmbH & Co. KGaA; keine Freischaltung.
