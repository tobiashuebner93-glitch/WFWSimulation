

## A06-Nacharbeit nach A07-finalem Re-Review (2026-10-31)

**Preflight:** `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, aktuellen Katalog/Mapping/A06-Bericht und den vollständigen Bericht `a07-t0068-vw-final-rereview.md` gelesen. Kontext MG-002 / SLG-002.3 / SLG-002.4; CP-0280 bleibt ENTWURF, Vorgänger CP-0279; maßgeblich D-0147, D-0159, D-0161–D-0164. Checkout `main`, Basis-HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. `git status` zeigt breite, bereits vorhandene Änderungen anderer Agenten; diese blieben erhalten. V2-Bibliothek und Produktcode wurden nicht verändert.

A07 bestätigt Vw-Scope, Schlüssel/Erklärungen, D-0147/D-0159, Satzzeichen und frühere Korrekturen an EVT-038/039/048. Nicht bestanden waren Distraktorqualität in EVT-001, 007–009, 011, 015–016, 018–019, 022, 024, 027–034, 036–038, 042, 044, 046–048 sowie Transfer-/Schwierigkeitsfit u.a. in EVT-008/009/015/022/024/028/042/044. Die weitere Nacharbeit der bereits verbesserten EVT-002–006/010/012–014/017/020–021/023/025–026/041/043/049–050 gehörte ausdrücklich zum Folgeauftrag.

**Änderungen:** Die 46 in beiden Aufträgen genannten Items wurden einzeln neu kontextualisiert; alle vier Antworten konkurrieren nun anhand konkreter Fallangaben, Rechenfehler, begründeter Alternativentscheidungen oder unvollständiger Wirkungsketten. Transferfragen verwenden konkrete Zahlen/Zeithorizonte und nötige Übertragungen, ohne empirische Effektgrößen zu behaupten. EVT-042 und EVT-044 wurden von `Transferwissen` auf `Aufbauwissen` herabgestuft, weil sie trotz Fallkontext vor allem dokumentierte Merkmale/Kategorien anwenden. EVT-008/009/015/022/024/028 bleiben auf ihren bestehenden Stufen und wurden mit Berechnung, Firmenexposition, Szenariokette oder Periodenbezug konkreter gemacht. Alle IDs und Schlüsselpositionen blieben exakt gleich; die Quellen-/Kompetenzzuordnungen mussten daher nicht geändert werden. Jeder Eintrag behält seine Wirkung-/Mutation-/D-0147-/Provenienzmetadaten; Ereignisfragen blockieren den Tag weiterhin nicht (D-0159). Die eingesetzten Zahlen sind synthetische Lernfalldaten, keine Markt-/Rechtsbehauptungen.

**Abdeckung je A07-ID (D = Distraktoren überarbeitet; T = Transferoperation konkretisiert; L = Schwierigkeitslabel herabgesetzt):**

| Item | Bearbeitung | Item | Bearbeitung |
|---|---|---|---|
| EVT-001 | D | EVT-002 | D, T |
| EVT-003 | D, T | EVT-004 | D, T |
| EVT-005 | D, T | EVT-006 | D, T |
| EVT-007 | D, T | EVT-008 | D, T |
| EVT-009 | D, T | EVT-010 | D, T |
| EVT-011 | D, T | EVT-012 | D, T |
| EVT-013 | D, T | EVT-014 | D, T |
| EVT-015 | D, T | EVT-016 | D, T |
| EVT-017 | D, T | EVT-018 | D, T |
| EVT-019 | D, T | EVT-020 | D, T |
| EVT-021 | D, T | EVT-022 | D, T |
| EVT-023 | D, T | EVT-024 | D, T |
| EVT-025 | D, T | EVT-026 | D, T |
| EVT-027 | D, T | EVT-028 | D, T |
| EVT-029 | D, T | EVT-030 | D, T |
| EVT-031 | D, T | EVT-032 | D, T |
| EVT-033 | D, T | EVT-034 | D, T |
| EVT-036 | D, T | EVT-037 | D, T |
| EVT-038 | D, T | EVT-041 | D, T |
| EVT-042 | D, L | EVT-043 | D, T |
| EVT-044 | D, L | EVT-046 | D, T |
| EVT-047 | D, T | EVT-048 | D, T |
| EVT-049 | D, T | EVT-050 | D, T |

**Prüfungen:**

- A06-Spezialvalidator: PASS — 50 IDs in Sollreihenfolge; jede Option eindeutig; alle 50 Schlüsselbuchstaben unverändert; Verteilung A/B/C/D = 13/13/12/12, maximale Wiederholung in Folge 2; vollständige Wirkungs-/D-0147-/Provenienzfelder und lokale Quellenziele; `??` = 0.
- UTF-8-/Trailing-Whitespace-Prüfung der A06-Dateien: PASS.
- `node prototype/learning-wbq-validation.mjs`: PASS für 200 reguläre WBQ-Items; der Validator prüft die semantische Plausibilität dieses neuen Ereigniskatalogs nicht.
- `node prototype/learning-hsq-validation.mjs`: PASS für 250 HSQ-Items (0 weak-distractor flags, 0 English-prose flags, 53 Gesetzeslinks und keine externen Referenzfehler); dies ist eine Regression eines anderen Bestands.
- `node prototype/learning-ui-regressions.mjs`: PASS für 540er Pool, Tageslimit und UI-Verknüpfungen; kein semantischer Review des V3-Ereigniskatalogs.
- `git --git-dir=.git --work-tree=. diff --check`: Exit 0; nur LF/CRLF-Hinweise bei bereits geänderten getrackten Dateien. Der Katalog und A06-Bericht sind im aktuellen Status untracked und daher nicht Teil des Git-Diffchecks; deren Whitespace wurde separat geprüft.

**Review/Nachweise:** A06-Ausführung und Selbstprüfung abgeschlossen. Die Antwortplausibilität ist damit nicht unabhängig abgenommen; ein erneuter vollständiger A07-Re-Review aller 50 Items bleibt erforderlich. A08-Quellen-/Mapping-Review und A09-Vollständigkeits-/Nichtmutationsreview bleiben separate offene Gates. Keine Nutzerentscheidung/Rückfrage erforderlich. Keine Mapping-, Code-, Schema-, Architektur-, Commit- oder Push-Änderung.

**Nächster Schritt:** A01 beauftragt A07 mit einem unabhängigen Vollreview aller 50 aktualisierten Items. T-0068 bleibt IN_PROGRESS, bis A07, A08, A09 und der für Integration erforderliche Zustandsabgleich abgeschlossen sind.


## A06 gezielte Schlussnacharbeit nach A07-final2 (2026-10-31)

**Preflight:** `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, Kompetenz-/Lernmapping, aktuellen Fragenkatalog, diesen Arbeitsbericht und den vollständigen Bericht `a07-t0068-vw-final2-rereview.md` erneut geprüft. Maßgeblich MG-002 / SLG-002.3 / SLG-002.4, D-0147, D-0159, D-0161–D-0164; CP-0280 bleibt ENTWURF, Vorgänger CP-0279. Der Checkout-Mirror meldet im Gitstatus Zugriffsbeschränkung („fatal: cannot change to … Permission denied“); Fremdänderungen konnten daher über Git nicht verifiziert werden. Die zwei Schreibziele waren die ausdrücklich beauftragten Dateien. Keine anderen Dateien bearbeitet.

**Korrekturen ausschließlich an EVT-018/035/042/044/045:** EVT-018 hat jetzt vier rechnerisch nachvollziehbare Optionen (alle fünf Personen, Prozent/Promille, korrekte betroffene Gruppe, voller Monatslohn) samt expliziter Rechnung. EVT-035 gibt drei Werte vor und verlangt Mittelwert/Median samt vorsichtiger Interpretation der synthetischen Fallzahl. EVT-042 vergleicht ausdrücklich synthetische Matrixangaben; die richtige Wahl berücksichtigt Priorität, ausreichendes Kapital und Quellenprüfung der Vertretung, ohne Tatsachenbehauptungen zu realen Rechtsformen hinzuzufügen. EVT-044 unterscheidet gemeinsame Beschaffung von einem Anteilserwerb als V3-Konzentrationsfall; Kontrolle und weitere Rechtsfolgen bleiben als zu prüfen markiert, eine automatische Verschmelzung wird nicht behauptet. EVT-045 verwendet synthetische Erwartungswerte mit gleichem direktem Beitrag; es verlangt, Risiko und weitere Ziele von Erwartungswert/Sicherheit zu trennen. IDs, Itemzahl, Kompetenzbezüge, Schwierigkeitsstufen, Quellenbeziehungen und Schlüsselbuchstaben blieben bestehen. Kein V2-Inhalt wurde geändert.

**Validierung:** Spezialstrukturcheck: 50 eindeutige EVT-001–EVT-050, je vier Optionen, ein Lösungsschlüssel, Verteilung A/B/C/D = 13/13/12/12; EVT-018/035/042/044/045 rechnen sich anhand der Itemdaten, D-0147-/D-0159-Metadaten und Provenienzangaben bleiben vorhanden. Separater UTF-8-/Trailing-Whitespace-Check für Katalog und Bericht bestanden. `node prototype/learning-wbq-validation.mjs` PASS (200 WBQ-Regelfragen; keine semantische Abnahme dieses Katalogs). `node prototype/learning-hsq-validation.mjs` PASS (250 HSQ-Items, 0 schwache-Ablenker-Flags, 0 Englisch-Flags, 53 Gesetzeslinks; anderer Bestand). `node prototype/learning-ui-regressions.mjs` PASS (540er Pool/Tageslimit/UI; kein semantischer Review des V3-Katalogs). `git diff --check` und echte Gitstatus-Verifikation: nicht ausführbar im aktuellen Mirror wegen fehlendem Gitzugriff; kein Git-Pass behauptet.

**Review/Nachweise:** A06-Ausführung abgeschlossen; die fünf konkreten A07-Befunde sind bearbeitet, nicht unabhängig abgenommen. Jetzt gezielter A07-Re-Review ausschließlich EVT-018/035/042/044/045 anfordern. A08-Quellen-/Mappingreview und A09-Vollständigkeits-/Nichtmutationsreview bleiben offen. Kein Commit/Push. T-0068 bleibt IN_PROGRESS.


## A06 gezielte Quellen-/Mappingnacharbeit nach A08 (2026-10-31)

**Preflight:** `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, aktuellen Katalog und Mapping, A07-PASS-Bericht `a07-t0068-five-item-rereview.md` sowie den vollständigen A08-Bericht `a08-t0068-final-sources-mapping-review.md` gelesen. Maßgeblich MG-002 / SLG-002.3 / SLG-002.4, D-0147, D-0159, D-0161–D-0164; CP-0280 bleibt ENTWURF, Vorgänger CP-0279. `git status` ist im vorliegenden Spiegel nicht verfügbar (`fatal: this operation must be run in a work tree`); fremde Repoänderungen konnten daher nicht per Git klassifiziert werden. Der Auftrag begrenzte Schreibzugriff auf Katalog/Mapping/A06-Bericht; keine anderen Dateien geändert.

**Fünf A08-Fixes:** (1) Mapping V3-21 ordnet EVT-044 nun Kooperation und potenziellen Anteilserwerbs-/Kontrollprüfungsfall zu; Kontrolle, Anmelde-/Freigabepflicht und gesetzliche Verschmelzung sind ausdrücklich offen/nicht abgedeckt. (2) V3-16 weist EVT-029–032 als direkte SPI/VPI-Abdeckung aus; EVT-011 ist nur angrenzender Inputkostenfall, EVT-009/010/012, EVT-033–036 und Wechselkursitems sind aus dieser Kompetenz ausgeschlossen. (3) EVT-043 fragt konkret nach Organ-/Vertretungsbestellung und Registerlage getrennt für GmbH und KG; direkte Primärlinks HGB §§124, 161, 164, 170 und GmbHG §35 ergänzt, ohne pauschale Rechtsfolge. (4) EVT-044 bezeichnet Fall 2 nur als potenziellen Konzentrations-/Kontrollprüfungsfall, verlinkt GWB §§1, 35, 37 und leitet weder Kontrolle, Schwellen-/Anmeldepflicht noch Verschmelzung allein aus Anteilen ab. (5) Katalogkopf trennt D-0159 als V2-Grenze von der Nichtblockierung dieses V3-Katalogs nach T-0068; D-0147 bleibt für Tageslimit und kleine Antwortwirkungen. D-0159 wurde aus itemweisen Nutzerentscheidungslisten entfernt, damit der V3-Modus nicht fälschlich dem Beschluss zugeschrieben wird.

**Prüfungen:** Amtliche Gesetze-im-Internet-Primärseiten wurden aktuell geprüft: HGB §§124/161/164/170, GmbHG §35 sowie GWB §§1/35/37. Mapping-/Itemassertions und direkte amtliche URL-Erreichbarkeit werden separat validiert; A06-Spezialstrukturcheck, WBQ/HSQ/UI-Validatoren und `git diff --check` folgen nach dem Schreiben. A07-Inhaltsreview der fünf Items war PASS vor dieser Quellenpräzisierung; wegen geänderter Stämme/Optionen ist eine erneute gezielte A07-Prüfung für EVT-043/044 angezeigt. A08-Re-Review sowie A09-QA bleiben offen. Keine Rechtsfreigabe. Kein Commit/Push.


## A06 Quellen- und Mappingkorrektur nach A08-Finalreview (2026-10-31)

**Preflight:** `AGENTS.md`, Struktur/Rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, aktuelles Mapping/Katalog, A07-PASS `a07-t0068-five-item-rereview.md` sowie A08 `a08-t0068-final-sources-mapping-review.md` geprüft. Maßgeblich D-0147/D-0159/D-0161–D-0164; CP-0280 Vorgänger CP-0279. Gitstatus im Spiegel ist nicht verfügbar (`fatal: this operation must be run in a work tree`); Fremdänderungen konnten über Git nicht klassifiziert werden. Nur Mapping, Katalog und diesen Arbeitsbericht geändert.

**A08-Nacharbeit:** V3-16 direkte SPI/VPI-Abdeckung nun ausschließlich EVT-029–032; EVT-011 ist nur angrenzender Inputkostenfall, EVT-009/010/012, EVT-033–036 und Wechselkursitems sind ausgeschlossen. V3-21 verweist auf EVT-044 als Kooperation plus potenziellen Anteilserwerbs-/Kontrollprüfungsfall und nennt Kontrolle, Anmelde-/Freigabepflicht und gesetzliche Verschmelzung explizit offen/nicht abgedeckt. EVT-043 fragt konkrete Organ-/Vertretungsbestellung und Registerlage getrennt ab und führt amtliche Links HGB §§124/161/164/170 sowie GmbHG §35. EVT-044 ist als potenzieller Konzentrations-/Kontrollprüfungsfall präzisiert und verlinkt GWB §§1/35/37; keine dieser Rechtsfolgen wird allein aus Anteilen behauptet. Katalogkopf attribuiert D-0159 nur die V2-Grenze; optionaler nichtblockierender V3-Modus ist dem T-0068/V3-Scope zugeordnet. Dasselbe wurde im Mapping-Vorspann/Nachweis nachgeführt. D-0147 bleibt die Grundlage für Tageslimit und bestehende Antwortwirkungen. Keine V2-Fragen, neue Rechtsentscheidungen oder Produktmechaniken geändert.

**Prüfungen:** Amtliche Primärseiten Gesetze-im-Internet für HGB §§124/161/164/170, GmbHG §35 und GWB §§1/35/37 direkt geöffnet; Itemlinks verwenden diese Fundstellen. Struktur-/Metadaten-/Schlüsselcheck und lokale Linkauflösung folgen; WBQ/HSQ/UI-Regressionen sowie diff-check sind erneut auszuführen. A07 hat EVT-043/044 nach dieser Quellenänderung noch nicht re-reviewed. A08 Re-Review und A09 Nichtmutations-/Vollständigkeits-QA bleiben offen. Keine Rechtsfreigabe, kein Commit/Push.


**Abschluss der A08-Nacharbeit – Validatorbefunde:** Struktur-/Mapping-/Metadatencheck PASS: 50 eindeutige geordnete IDs, je vier Optionen, Schlüssel A/B/C/D=13/13/12/12; V3-16/V3-21-Zuordnungen und D-0159-Attribution geprüft; alle lokalen Markdownziele vorhanden; offizielle HGB-/GmbHG-/GWB-URLs an EVT-043 bzw. EVT-044 korrekt zugeordnet. Gesetze-im-Internet-Primärfundstellen für die verlinkten Normen wurden aktuell direkt geöffnet bzw. per exakter amtlicher Suche gefunden. `node prototype/learning-wbq-validation.mjs` PASS (200 Items); `node prototype/learning-hsq-validation.mjs` PASS (250 Items; 0 schwache-Ablenker-Flags); `node prototype/learning-ui-regressions.mjs` PASS (540er Pool). UTF-8-/Trailing-Whitespacecheck PASS. `git status --short` und `git diff --check` im Spiegel jeweils nicht ausführbar, Exit 128: `fatal: this operation must be run in a work tree`; deshalb kein Git-Status-/Diffcheck-Pass behauptet.

**Übergabe:** A08-Re-Review der Quellen-/Mappingkorrekturen und A09-Vollständigkeits-/Nichtmutations-QA erforderlich. EVT-043/044 wurden gegenüber A07-PASS in Stamm/Begründung präzisiert; gezielter A07-Re-Review dieser zwei Items empfohlen. Kein Commit/Push; T-0068 bleibt IN_PROGRESS.


## A06 EVT-044-Nacharbeit nach A07/A08 (2026-10-31)

**Preflight:** `AGENTS.md`, Struktur/Rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0280 (ENTWURF), T-0068, A07 `a07-t0068-evt043-044-rereview.md`, A08-Quellenreview und Re-review sowie den aktuellen Katalog/Mapping geprüft. Maßgeblich D-0147/D-0159/D-0161–D-0164; CP-0280 Vorgänger CP-0279. Gitstatus im Spiegel nicht verfügbar (`fatal: this operation must be run in a work tree`); Fremdänderungen nicht durch Git verifizierbar. Nur EVT-044 im Katalog und dieser A06-Bericht geändert; Mapping nicht geändert, weil V3-21 die Grenzen bereits zutreffend ausweist.

**Änderung:** EVT-044 nennt jetzt die fehlenden Fallangaben Quote/Stimmrechte/Umsatz. Die Antwort trennt GWB §37 Abs. 1 Nr. 2 (bestimmender Einfluss/Kontrolle), Nr. 3 (selbstständige 25-%-/50-%-Kapital- oder Stimmrechtsschwellen) und Nr. 4 (sonstiger wettbewerblich erheblicher Einfluss); GWB §35 wird separat als Anwendungsbereich mit Umsatz-/Gegenleistungskriterien dargestellt. Eine konkrete Anmeldepflicht wird ohne Daten nicht behauptet. GWB §1 für die Kooperation bleibt von der konkreten Ausgestaltung abhängig; keine Verschmelzung wird behauptet. Schwierigkeit Aufbauwissen, ID und Schlüssel D blieben unverändert; jede falsche Option bildet eine konkrete Verwechslung der Normstruktur ab. Amtliche Primärquelle GWB §§35/37 wurde aktuell eingesehen.

**Prüfung:** Der Spezialcheck für 50 eindeutige Item-IDs, vier Optionen, Schlüsselverteilung/Positionen, D-0147-Metadaten, Quellenlinks und EVT-044-Normgliederung folgt unmittelbar; WBQ/HSQ/UI-Regressionen, lokale/externe Linkprüfung und diff-check werden separat ausgewiesen. A07 soll EVT-044 gezielt re-reviewen; A08 Quellen-Re-Review bleibt offen. Keine Rechtsfreigabe, kein Commit/Push.


**EVT-044 Schlussvalidierung:** 50 IDs/Items unverändert, je vier Optionen; Schlüsselbuchstabe D und Katalogverteilung A/B/C/D=13/13/12/12 unverändert. Spezialcheck bestätigt getrennte Aussagen für §37 Abs.1 Nr.2 (bestimmender Einfluss), Nr.3 (25 %/50 % Kapital/Stimmrechte) und Nr.4 (sonstiger erheblicher Einfluss) sowie getrennten §35-Anwendungsbereich; Quote/Stimmrechte/Umsatz-/Gegenleistungsdaten bleiben als fehlend ausgewiesen, daher keine Anmeldepflicht behauptet. Amtliche GWB-Primärseiten §§1/35/37 direkt geöffnet. Relative Markdownlinks, UTF-8 und Whitespace PASS. WBQ-Validator PASS (200), HSQ PASS (250, 0 schwache Ablenker), UI-Regression PASS (540er Bestand). Die abschließende Git-Prüfung lief erfolgreich: `git diff --check` Exit 0 (nur LF/CRLF-Hinweise bei bestehenden getrackten Dateien) und `git status --short` Exit 0. Der Arbeitsbaum enthält zahlreiche parallele Änderungen und ungetrackte V3-Artefakte; diese wurden erhalten. Der neue A06-Katalog/-Bericht sind untracked und daher nicht im Git-Diffcheck erfasst; Whitespace wurde separat geprüft.

**Übergabe:** gezielter A07-Re-Review für EVT-044 und A08 Quellen-Re-Review offen; A09 Vollständigkeits-/Nichtmutations-QA ebenfalls offen. Keine Rechtsberatung/Freigabe, kein Commit/Push.


## A06 Mapping-Nacharbeit nach A08-Quellen-/Mapping-Re-Review (2026-10-31)

**Preflight:** `AGENTS.md`, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280 (ENTWURF), D-0147/D-0159/D-0161–D-0164, T-0068, aktuelles Mapping/Fragenkatalog, A08-Bericht `a08-t0068-final-sources-rereview.md` sowie A02-Integrationsvertrag gelesen. Gitstatus-Initialabfrage meldete `fatal: this operation must be run in a work tree`; HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, Branch `main`. Vorhandene parallele Änderungen blieben erhalten. Nur Mapping und A06-Arbeitsbericht geändert; Katalog, Fragen und Nutzerentscheidungen blieben unverändert.

**Drei Korrekturen:** V3-13 ist auf EVT-007–010 begrenzt; EVT-011/012 sind entfernt, da deren Fälle keinen Außenwirtschaftskanal belegen. V3-14 enthält EVT-015–018, 020–022, 024, 026–028; EVT-019/025 sind keine Politikmaßnahmen. EVT-023 wird in dieser Fassung nicht als Politikfall gezählt, sondern V3-09 Kapazität/Investition zugeordnet, da die Frage nur eine Förderannahme bei einer Kapazitätsentscheidung nennt und keine Maßnahme/Ziel-/Wirkungskette ausführt. V3-11 belegt die Nichtmutation neutraler Übung mit D-0147 sowie dem konkreten A02-Vertrag, Abschnitt „A06 – Lernkontext“ und `INT-08`; D-0159 ist ausdrücklich nur V2-Grenze, nicht der Nichtmutationsbeleg. Keine Item-ID, Antwort, Schlüssel oder Nutzerentscheidung geändert.

**Mappingtrace:** Die detaillierte Abdeckungstabelle führt V3-01 bis V3-21 je genau einmal. Alle referenzierten EVT-IDs liegen im Katalog; zusätzlich werden vollständige EVT-Spannen expandiert und auf Gültigkeit geprüft. Abdeckungen, offene Lernkontexte und ausgeschlossene IDs sind getrennt ausgewiesen.

**Prüfungen:** A06-Spezialcheck für 50 IDs/Optionen/Schlüsselverteilung/Metadaten und Mappingabdeckung; WBQ/HSQ/UI-Validatoren; lokale und externe Linkprüfung; `git diff --check` ausgeführt; Ergebnisse im Abschlussabschnitt dieses Berichts. A08-Re-Review und A09-Vollständigkeits-/Nichtmutations-QA bleiben erforderlich. Kein Commit/Push.


## A06-Korrektur nach A09-Vollständigkeitsreview (2026-10-31)

**Befund und Korrektur:** A09 stellte einen Widerspruch zu V3-06 fest: Die Übersichtszeile versprach eine Prozesskarte für den vollständigen Angebots-/Auftrags-/Zahlungskreislauf, während die Detailzeile den Rechnungs-/Zahlungsprozess als ungemappt bezeichnete. Beide Zeilen sind jetzt konsistent und markieren V3-06 ausdrücklich als geplant, aber nicht geliefert. A05 soll erst nach stabilem A02/A03-Ablauf eine Prozesskarte aus dann tatsächlich implementierten Zuständen/Übergängen integrieren. T-0068 enthält dafür weder einen vollständigen Ereignisfall noch ein Lernobjekt; die Umsatz-/Rechnungs-/Zahlungskette bleibt als Lernabdeckung offen. Keine gelieferte Abdeckung wird behauptet.

**Prüfungen:** Die Kompetenz-Mappingtabelle enthält V3-01 bis V3-21 je genau einmal; alle 21 Zeilen besitzen Kompetenzbezug, Spielkontext, Kennzahl/Wirkung, Quelle/Provenienz und Lernobjekt-/Abdeckungsstatus. Der zuvor im Bericht genannte Zählstand 23/27 war fehlerhaft. Der korrigierte Detailtrace zählt 50 von 50 Ereignis-IDs als positive Kompetenzverknüpfung; die vier zuvor nicht zugeordneten IDs wurden nach Itemprüfung wie folgt ergänzt: EVT-011 → V3-16 (VPI vs. konkreter Inputpreis, keine SPI-Rechenabdeckung); EVT-012 → V3-09 (Materialknappheit/Lieferzeit als Produktionsplanungsrestriktion, keine Produktivitätsmessung); EVT-025 → V3-05 und V3-09 (Nachfrage- und Produktivitätsindikatoren getrennt nach Einheiten/Zeiträumen, keine unbelegte Verrechnung); EVT-045 → V3-09 und V3-18 (Opportunitätsabwägung knapper Maschinenzeit zwischen Auftrag und Produktprototyp, kein sicherer Produkterfolg). Die Zuordnungen bewahren diese Grenzen; explizite Ausschlüsse aus anderen Kriterien sind keine positiven Links. `node prototype/learning-wbq-validation.mjs` PASS (200 Items); `node prototype/learning-hsq-validation.mjs` PASS (250 Items; 0 schwache Ablenker); `node prototype/learning-ui-regressions.mjs` PASS (540 Items, Tageslimit). `git diff --check` PASS (nur bestehende LF/CRLF-Hinweise). Gitstatus weist umfangreiche parallele Änderungen anderer Agenten aus; diese blieben erhalten.

**Übergabe:** A08 soll das korrigierte Mapping V3-06 re-reviewen; A09-QA bleibt erforderlich. Kein Katalogfragenbestand, V2-Bestand oder Produktcode geändert. Kein Commit/Push.


## A06 finale Trace- und Quellenstatuskorrektur nach A08/A09 (2026-10-31)

**Preflight:** AGENTS.md, Agentenstruktur/-rechte, Goals, Ticket Board, Collaboration State, Decision Log, CP-0279/CP-0280 (ENTWURF), D-0147/D-0159/D-0161–D-0164, T-0068, aktuelles Mapping/Katalog, A08 `a08-t0068-final-sources-rereview2.md`, A09 `a09-t0068-completeness-nonmutation-final.md`, A02/A08 T-0063-Quellen- und Modellunterlagen sowie Git-Status/HEAD gelesen. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`. Viele parallele Änderungen und Untracked-Dateien anderer Rollen bleiben unverändert; nur Mapping und dieser A06-Bericht werden geändert.

**Vier Traceergänzungen:** EVT-011 ist V3-16 zugeordnet als Abgrenzung des Verbraucherpreisindex vom unveränderten konkreten Stahlangebot, ausdrücklich ohne SPI-Rechenkompetenz zu behaupten. EVT-012 ist V3-09 zugeordnet, weil Materialmenge, Mindestabnahme, Lieferzeit, Auftragsbedarf und Termine eine Produktionsplanungsrestriktion bilden, nicht weil das Item Produktivität misst. EVT-025 ist V3-05/V3-09 zugeordnet: Das Item verlangt, Produktivität und Nachfrage anhand unterschiedlicher Einheiten und Zeiträume getrennt zu bewerten; es bildet keine Konjunkturphasenklassifikation ab. EVT-045 ist V3-09/V3-18 zugeordnet, da es knappe Maschinenzeit zwischen sicherem Kundenbeitrag und unsicherem Eigenproduktprototyp abwägt; es behauptet keinen integrierten oder sicheren Produkterfolg. Nach diesen Ergänzungen sind alle 50 Katalog-IDs direkt positiv mindestens einem V3-Kriterium zugeordnet. Explizite Kriteriumsausschlüsse bleiben erhalten und werden nicht als positive Referenzen gezählt. V3-06 bleibt davon unabhängig als echtes Lernintegrationsdefizit: Prozesskarte/Lernobjekt geplant, nicht geliefert.

**Quellenstatus:** Mappingvorspann korrigiert: A08-T-0063-Quellenpaket samt Makrofachquellen, VPI-/SPI-Methodik und Politikfeldquellen sowie die Quellenprüfung sind geliefert. Offen bleiben die Umsetzung/Kalibrierung synthetischer Modellwerte und Kausalpfade, A02/A03-Laufzeitkopplung, A09-Szenario-/Wirkungstests und A05-Lernintegration; Quellenlieferung ist keine Freigabe empirischer Effekte.

**Prüfungen:** 21 V3-Kriterien jeweils genau einmal mit allen sechs Mappingfeldern. A09s unabhängiger Ausgangszählung von 46 direkten IDs und der benannten Vierer-Lücke EVT-011/012/025/045 wurden die vier Itembezüge einzeln hinzugefügt; damit beträgt der direkte Trace 50/50. Alle Referenzen sind in EVT-001–050 vorhanden; die vier Ergänzungen wurden anhand der Itemstämme geprüft und Exklusionshinweise nicht als positive Verweise gezählt. Lokale Markdownziele im Mapping und Ereigniskatalog sind vorhanden. `node prototype/learning-wbq-validation.mjs` PASS (200); `node prototype/learning-hsq-validation.mjs` PASS (250, 0 schwache Ablenker, 0 externe Referenzfehler); `node prototype/learning-ui-regressions.mjs` PASS (540/Tageslimit); `git diff --check` PASS (nur LF/CRLF-Hinweise). A08 finaler Quellen-/Mapping-Re-Review und A09 finale Vollständigkeits-/Nichtmutations-QA erneut erforderlich. Kein Commit/Push.
