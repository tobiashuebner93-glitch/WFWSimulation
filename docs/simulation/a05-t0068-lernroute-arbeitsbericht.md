# A05-Arbeitsbericht – T-0068 Prozesslernroute

**Status:** Lesende UI geliefert; fachliches Review und A09-QA offen  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A05 – FRONTEND  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.3  
**Ticket:** T-0068  
**Start-/Zielprofil:** V3, Starttag 2027-01-04 (Szenariorahmen; Lernobjekt verwendet keine Bilanz- oder Finanzprofile)  
**Entscheidungen:** D-0147, D-0157, D-0159, D-0162  
**Vorgänger:** CP-0279; CP-0280 ist ENTWURF.

## Preflight

Gelesen: AGENTS.md, Agentenstruktur/Rechte, Goals, Ticketboard, Collaboration State, Decision Log, CP-0279/CP-0280-Entwurf; V3-06-Ziel, A06-Prozesslernobjekt/Bericht, A02-Markt-/Integrationsverträge, T-0067-A03-Vertrag und vorhandene V3-Marktroute. Repository `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche bestehende lokale Änderungen und neue Dateien wurden erhalten.

## Umsetzung

In `prototype/v3/market.html` ist eine optionale Prozesslernsektion innerhalb der Marktansicht ergänzt. `prototype/v3/market.js` lädt das kanonische JSON-Lernobjekt und rendert die Fragen, Erfolgskriterien und Erklärungen als schreibgeschützte Projektion der bestehenden spielersicheren A02-Marktsicht. Es gibt keine Lernantwort-Eingabe, keine Tagesfortschreibung und keinen Aufruf einer Domain-Write-API. Darstellung und Hinweistext sind für kleine Bildschirme formatiert.

Eine Referenz gilt nur dann als verfügbar, wenn sie im tatsächlichen aktuellen Player-View vorhanden ist. Anfrage- und Anforderungsreferenzen können im Marktpostfach angezeigt werden. Angebots-/Kalkulationsreferenzen werden erst angezeigt, wenn ein eigenes Angebot mit A03-Snapshot existiert. Der bestehende Marktvertrag liefert keine `decisionId`; Arbeitsplan, Lieferung, Kundenabnahme, Rechnung und Zahlung sind in dieser Runtime nicht vorhanden. Diese Schritte werden daher ausdrücklich als „Im V3-Prototyp noch nicht verbunden“ gezeigt. Es werden keine Zustände ergänzt oder behauptet.

## Prüfungen

- `node --check prototype/v3/market.js` — PASS.
- `node prototype/v3/a05-t0065-market-ui-regressions.mjs` — PASS; ergänzt um Leseprojektion und Vergleich des Marktstates vor/nach dem Rendern.
- Regressionen prüfen die Kennzeichnung „Nur lesend“, verfügbare/nicht verfügbare Referenzen, Rendering nach Fixture-Laden und keine Mutation des Marktstates durch den Lernrenderer.
- `git diff --check` — PASS; Git meldet bestehende LF/CRLF-Hinweise.
- Fachreview A02/A03 — nicht ausgeführt.
- Unabhängige A09-QA — nicht ausgeführt.
- Browser-/Mobilgerätetest — nicht ausgeführt.
- Git-Verifikation: `main`, HEAD unverändert; keine vorhandene Änderung verworfen. Kein Commit/Push.

## Grenzen und nächster Schritt

Dies ist eine Lernroute für den schon ausführbaren Marktteil, keine Ende-zu-Ende-Übung über den vollständigen Auftragskreislauf. A02 muss später stabile Prozessreferenzen einschließlich einer tatsächlichen Entscheidungs-ID bereitstellen; die anderen fehlenden Prozesszustände benötigen Unternehmens-/Jahresintegration. A09 soll Nichtmutation, Referenz-Gating und Vollständigkeit unabhängig prüfen. Browser-/Mobiltest folgt mit der T-0069-Integration.

## Nachtrag – terminale Ablehnungs- und Ablaufzweige (2026-10-31)

A06 ergänzte im kanonischen JSON `endingBranches`. Die Route rendert terminale Karten nur bei exakter Übereinstimmung mit vorhandenen A02-Player-View-Feldern. `inquiryStatus` aus dem Lernvertrag wird dem tatsächlichen sicheren API-Feld `status` zugeordnet; `outcome` wird unverändert verglichen. Ablehnung erscheint nur bei `status=resolved` und `outcome=not_won`, Ablauf nur bei `status=expired`. Karten zeigen ausschließlich den escaped Branch-Namen und `terminalFeedback`; `nextSteps` bleibt leer und es wird kein Ereignis erzeugt. Bei keinem Match erscheint der Hinweis, dass kein Endzweig belegt ist.

Persistente Regressionen prüfen Ablehnung, Ablauf, Sieg/angenommen, offenen bzw. eingereichten Zustand und fehlenden Zustand; nur passende terminale Zweige erscheinen. Ein Deep-Equality-Vergleich belegt die Nichtmutation. `node --check prototype/v3/market.js`, `node prototype/v3/a05-t0065-market-ui-regressions.mjs`, `node prototype/v3-market-simulation-regressions.mjs` und `git diff --check` bestehen. A09-Re-Review der Endzweige ist noch erforderlich; Browser-/Mobilprüfung bleibt nicht ausgeführt.
