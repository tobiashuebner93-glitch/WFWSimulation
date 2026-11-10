# A03 – T-0069 Finance-Bridge: Blocker und Übergabe

**Status:** Implementierung sicherheitshalber zurückgestellt; bestehende isolierte Finance-Runtime bleibt unverändert  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A03 – ACCOUNTING_FINANCE  
**Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0069  
**Vorgänger:** CP-0312 (ENTWURF)  
**Profil:** V3-Run ab 04.01.2027; keine Startprofiländerung  
**Entscheidungen:** D-0157, D-0161, D-0162; Rechtsquellenprüfung A08 vom 31.10.2026

## Preflight und Arbeitsgrenze

Gelesen wurden `AGENTS.md`, Agentenstruktur/-Rechte, Ziele, Ticket-Board, Collaboration State, Decision Log, CP-0312, die A02-Run-Choreografie, A03-Finance-Handoff-Matrix und Finance-Runtime-Berichte sowie das Rechtsrahmenregister und der A08-Bericht zu BGB §§ 433, 640, 641, 650, 650g, 271 und 286 sowie HGB § 252. `docs/agent-system/AGENTS.md` existiert nicht; maßgebliche Control-Plane-Datei ist die Repository-Wurzel `AGENTS.md`.

Vor der Prüfung enthielt der Arbeitsbaum umfangreiche bestehende Änderungen und neue Dateien. Keine davon wurde geändert oder entfernt. Dieser Auftrag hat nur diesen Blockerbericht ergänzt.

## Befund

Die A02-Run-Runtime speichert Angebot, angenommene Work Order, Vertrags-Snapshot, tatsächliche Lieferung und eine getrennte, explizite Kunden-/Empfängerentscheidung mit Rollen- und Autoritätsbindung. Der Kundenentscheid bleibt `accepted_non_posting` oder `rejected_non_posting`; es wird aktuell keine Finance-Runtime aus dem Run aufgerufen.

Die A03-Finance-Runtime kann isoliert explizit autorisierte Leistung, Rechnungsbeleg und Zahlung verarbeiten. Sie verlangt eine explizite A03-Freigabe sowie Betrag, Datum und stabile Quellenreferenzen. Sie leitet weder Steuer, Vertragspreis, Fälligkeit noch Bestands-/COGS-Wert ab. Ihre Performance-Funktion fordert derzeit gleich hohe Erlös- und Forderungsbeträge und weist Mehrzeilen-/Steuerfälle ausdrücklich als nicht unterstützt zurück.

Eine produktive Brücke kann deshalb noch nicht aus dem Run-Snapshot allein gebaut werden:

1. D-0162 definiert `R` als V3-Nettoplanpreis ohne SimTAX. Die laufende Kunderechnung-/Forderungsbehandlung für diesen V3-Vertrag, insbesondere ob/wie eine SimTAX-Komponente in der Forderung liegt, ist im T-0069-Handoff nicht entschieden. Die V1/V2-SimTAX-Regel ohne ausdrückliche V3-Übernahme anzuwenden wäre eine unautorisierte Produktentscheidung.
2. Die A02-Run-UI erfasst die Lieferung. Ein Kundenseitiger Abnahmeentscheid ist zwar als API vorhanden, aber im getesteten Browserpfad nicht als eigener Kundenakteur-/Kundenantwortvorgang integriert. Ein Adapter darf die Kundenentscheidung nicht im Namen des Verkäufers erzeugen; D-0157 schließt Verkäufer-Selbstabnahme aus.
3. Der akzeptierte Auftragssnapshot liefert einen Nettopreis, aber noch keinen V3-finanzautorisierten Umsatz-/Forderungsbetrag, Rechnungsbetrag, Steuerkomponente oder Fälligkeit. Die bestehenden V1-Zahlungsziele sind nicht automatisch eine V3-Vertragsklausel.
4. Für den Auftrag fehlen weiter eine freigegebene Ist-Kosten-/Fertigwarenbewertung und ein COGS-/Lagerabgang. Diese können aus Planzeiten, Liefermenge oder BAB-Angebotsinputs nicht als Istbuchung abgeleitet werden.

Damit wäre jede automatisch erzeugte Finanzbuchung entweder nicht durch A03 autorisiert oder würde offene Steuer-/Fälligkeits-/Bewertungsregeln stillschweigend entscheiden. Eine no-op-Adapterfunktion würde nur den bereits sichtbaren Status `pending_non_posting` duplizieren und wäre kein belastbarer Integrationsfortschritt.

## Rechts- und Finanzgrenze

A08s Quellenreview bestätigt, dass herzustellende bewegliche Sachen regelmäßig § 650 BGB unterfallen und Vertragstyp/konkrete Vereinbarung maßgeblich bleiben; § 640 BGB ist keine universelle Abnahme- oder Fälligkeitsregel für jeden Fertigungsauftrag. Leistung, Lieferung, vertragliche Kundenentscheidung, Rechnung, Fälligkeit und Zahlung müssen getrennt bleiben. Das Finanzmodell ist als vereinfachte Spiel-KLR zu kennzeichnen und nicht als HGB-konforme Buchführung auszugeben.

## Verifikation

- `node prototype/v3-finance-runtime-regressions.mjs` — PASS (synthetische Evidenz-Fixtures)
- `node --check prototype/v3-finance-runtime.js` — PASS
- Browser-/Gerätetest dieser Finance-Brücke — nicht ausgeführt; keine Brücke implementiert
- A03-Codeänderung — keine
- Commit/Push — keiner

## Nächster Auftrag an A01

Zuerst den im V3-Entscheidungsstand tatsächlich offenen Kundenrechnungs-/SimTAX- und Fälligkeitsvertrag anhand bestehender D-Entscheidungen klären. Danach A03 mit einer eng begrenzten Runtime-Brücke beauftragen, die nur ausdrücklich A03-autorisierte Betrag-/Steuer-/Fälligkeitsinputs und den expliziten A02-Kundenentscheid konsumiert. Die Ist-Kosten-/WIP-/Fertigwaren-/COGS-Integration bleibt danach ein separater Fachschritt. Der Browserpfad braucht außerdem eine Kundenentscheidung als eigenes, nicht durch den Spieler-Verkäufer ausgeführtes Run-Ereignis, bevor die Finance-Brücke End-to-End geprüft werden kann.

**Rückfragen an A01:** Bitte bei Bedarf die konkrete V3-Rechnungs- und Forderungsbehandlung als gebündelte Nutzerfrage klären; A03 richtet keine Frage direkt an den Nutzer.  
**Fachreview:** A03 Selbstprüfung der Schnittstellen-/Accountinggrenze; unabhängiger A02-Cross-Review und A09-QA stehen aus.  
**Nächster Schritt:** A01 koordiniert offene V3-Rechnungs-/Steuer-/Fälligkeitsentscheidung und Kundenentscheid-UI; danach A03-Brückenauftrag.
