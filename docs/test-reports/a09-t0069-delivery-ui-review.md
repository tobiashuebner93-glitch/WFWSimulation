# A09 – Adversarial Review der T-0069-Lieferoberfläche

**Status:** NONPASS – Standardempfängerpfad sicher; abweichender autorisierter Empfänger ist in der Oberfläche nicht modellierbar
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Ticket:** T-0069
**Profil/Entscheidungen:** V3-Run ab 2027-01-04; D-0157, D-0161, D-0162; Vorgänger CP-0305 (ENTWURF)

## Prüfumfang und Preflight

AGENTS.md, Agentenstruktur und Rechtekarte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0305, A05-Lieferbericht, A03-Finanz-Cross-Review, A02-Run-Orchestrator und Delivery-Vertrag sowie A05-/A09-Regressionen gelesen. Branch `main`, HEAD `8b72b7e`; zahlreiche vorhandene Änderungen anderer Arbeiten bestehen. Keine davon wurde verworfen oder geändert.

Geprüft wurden Verkäufer-Lieferansicht und Formadapter, gerenderte Auftragskarte, Runtime-Validierung von Liefer- und Kundenereignissen sowie Replay-, Identitäts-, Vertrags-, Status- und Nichtbuchungsprüfungen. Der Review ist keine Browser-/Touchabnahme und keine Authentifizierung externer Vertragsdokumente.

## Befunde

### Bestanden

- Die Verkäuferoberfläche enthält nur „Lieferung erfassen“. Es gibt keine Annahme-/Abnahme- oder Zurückweisungsaktion. Eine Kundenentscheidung wird ausschließlich angezeigt, wenn ein gespeichertes Kundenereignis vorliegt.
- Das Lieferformular nimmt nur Liefer-ID und Quellreferenz entgegen. Partei, Kriterien, Menge und Einheit werden aus dem validierten Vertrags-Snapshot übernommen; das Lieferdatum wird an den geöffneten Simulationstag gebunden.
- Die Runtime verlangt abgeschlossene Operationen, einen offenen Tag, eine bekannte Kundenbestellung, Vertragsgleichheit sowie eindeutige ID-/Quellreferenzen. Identische Wiederholung ist idempotent; widersprüchlicher Replay oder eine zweite Lieferung wird zurückgewiesen.
- Liefer- und Kundenentscheidungsereignisse bleiben `pending_non_posting`; es entstehen keine Finanz-, Lager- oder Ledgerbuchungen.
- Die A05-Regression weist Escaping von Angreifertext in einer Liefer-ID nach und bestätigt, dass nach Lieferung keine zweite Lieferform und keine Verkäuferentscheidung gerendert werden.

### Blockierender UI-Abdeckungsfehler

D-0157 und der Runtime-Vertrag erlauben einen vom Kunden abweichenden Empfänger nur mit vertraglich gebundenem `authorizedForRef` und `partyAuthorityRef`. Das Planungsformular in `prototype/v3/run.js` (`contractForm`) bietet diese beiden Felder nicht an. Der Adapter `planRunOrder` übernimmt sie ebenfalls nicht in den `contractSnapshot`. Wählt der Spieler daher eine abweichende `acceptancePartyId`, scheitert der Plan an `validContractPartyAuthority`; der UI-Pfad kann keinen gültigen Auftrag mit bevollmächtigtem Empfänger anlegen und bis zur Lieferung durchspielen.

Das ist eine konkrete Funktionslücke im gültigen, vom Runtime-Vertrag vorgesehenen Empfängerfall. Die aktuelle Oberfläche darf den Anspruch auf einen Empfänger mit abweichender Identität nicht als unterstützt darstellen. Ein Fix kann die beiden Referenzen explizit erfassen und an die Runtime übergeben; die Runtime validiert bisher nur Referenzbindung und kann die Echtheit externer Vollmachts-/Vertragsunterlagen nicht feststellen.

## Tests

- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS.
- `node prototype/a09-t0069-run-ui-adversarial-regressions.mjs` — PASS; diese Datei testet aktuelle BAB-/Angebotsadapter und deckt die neue Liefermaske nicht eigenständig ab.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node --check prototype/v3/run.js` und `prototype/v3-run-orchestrator.js` — PASS.
- Gezielt `git diff --check` für A05-UI, Runtime und Regressionen — PASS.

Die Tests stützen den Standardempfängerpfad, Verkäuferrollenabgrenzung, Escaping, Ereignis-/Replaygrenzen und Nichtbuchung. Ein eigener automatisierter Regressionstest für den alternativen Empfängerpfad fehlt; der Befund ergibt sich aus dem Form-/Adaptercode und der Runtime-Prüfung.

## Nachweisrollen

- **Ausführung:** A05, laut A05-Bericht; fokussierte Regression lokal erneut PASS ausgeführt.
- **Fachreview:** A03 hat vorangehend den API-/Finance-Vertrag PASS geprüft; neue UI-Kreuzprüfung von A03 noch offen.
- **Unabhängige QA:** dieser A09-Review; NONPASS wegen abweichendem autorisiertem Empfängerpfad.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git-Verifikation:** Branch/HEAD/Status geprüft; bestehende Änderungen bewahrt; kein Commit/Push.

## Folgeauftrag an A01

A05 soll das Planungsformular und `planRunOrder` um die vertraglich gebundenen Empfänger-Autoritätsreferenzen ergänzen und eine UI-Regression hinzufügen: Kundenempfänger funktioniert weiter, abweichender Empfänger ohne Referenzen scheitert sichtbar, mit Referenzen erreicht er die Liefermaske, Verkäufer kann weiterhin keine Kundenentscheidung auslösen. Danach A03-Fachreview und A09-Re-Review; anschließend A01 Browser-/Touchsmoke.
