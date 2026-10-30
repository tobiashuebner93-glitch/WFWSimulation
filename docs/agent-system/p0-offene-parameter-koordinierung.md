# P0 – Koordinierung offener Fachparameter

Stand: 2026-10-27\
Owner: A01 MASTER_ORCHESTRATOR\
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0009 / CP-0147 bis CP-0181

## Aktualisierung D-0128 / CP-0181

Die frühere fachübergreifende Vorratslücke ist für den spielbaren Szenariostart durch die Nutzerentscheidung D-0128 geschlossen. Anfangsbestand: 2.000 kg Stahl, 100 kg Aluminium, 60 Referenzschrauben; Marktpreis-basierter V1-Bestandswert 4.214,20 €. Damit ändern sich Eröffnungsbilanzsumme auf 46.714,20 €, Eigenkapital-Restposition auf 15.214,20 € und Dispo-Startlimit auf 4.671,42 €. Preise und Quellen: [Materialpreis-Basisstand](../market-data/material-price-baseline-2026-10-27.md). Diese Bestandsbewertung ist eine Spielannahme ohne historische Einkaufsbelege und keine HGB-Bilanz.

Der CP-0180-Abschnitt unten hält den damaligen Stand fest und ist für Bestand, Bewertung und Startlimit durch CP-0181/D-0128 überholt. Kein weiterer unauflösbarer Agentenkonflikt über den Startbestand besteht.

## Agentenrollen-Review des V1-Stands (CP-0180)

Review durch A01 anhand der Zuständigkeiten in `agent-structure.md`; dies ist kein separat ausgeführter Agentenlauf. Der neueste Produkt-/QA-Stand ist CP-0179. Geprüft wurden A01 Governance, A02 Simulation, A03 Finance, A04 Datenmodell, A05 UI, A08 Recherche, A09 QA, A10 Betrieb und A11 Architektur.

**Innerhalb einer Fachrolle bereinigt:** (1) A03-Code hatte den Dispozins als MRO + 8 Prozentpunkte berechnet. D-0023/D-0108 sagen ausdrücklich 8 % mehr als den individuellen Unternehmenszins; die Berechnung wurde auf `Unternehmenszins × 1,08` korrigiert und die Jahresbindung an D-0022 angepasst. (2) A02 verwendete nicht normalisierte Partnerabhängigkeiten, wodurch die dargestellten Lieferantenanteile nicht den tatsächlichen Ziehungsgewichten entsprachen; die Auswahl nutzt jetzt normalisierte Gewichte, und Kundenaufträge folgen den dokumentierten Abhängigkeitsanteilen. (3) A02-Spezifikation und V1 unterscheiden nun ausdrücklich zwischen D-0011-Kernkalender und später beauftragter, rechtsorientierter Feiertagserweiterung. (4) A01-Steuerungsstand verweist nun auf CP-0180/0179 statt CP-0156 als aktuell.

**Nicht innerhalb einer einzelnen Fachrolle auflösbare Abweichung:**

**Historischer CP-0180-Befund, durch D-0128 ersetzt:** Die frühere 12.800-€-Gesamtvorratsannahme und der Vorjahresschlussübergang gelten nicht mehr für den V1-Spielstart. Aktuell gelten 4.214,20 € aus D-0128; die Werte begründen keine HGB-Bewertung.

**Agentenrollen-Befund:** A04 hat keine Schemaänderung vorgenommen; das lokale Speichern im Browser ist ausdrücklich Prototypumfang, keine Architekturfreigabe. A05-Netzwerk-/Lernansichten wurden im Browser geprüft. A08-Marktwerte bleiben Szenarioannahmen, nicht recherchierte Marktpreise; T-0011 ist weiter offen. A09-Jahreslauf und gezielte Kredit-Ausfalltests sind erfolgreich; die echte E3-Komponentenbewertung bleibt offen. A10 betreibt nur den lokalen Browserlink; kein Deployment. A11-ADRs bleiben PROPOSED. Es wurde nicht committet oder gepusht.

Der lokale V1-Szenarioprototyp ist commitbereit, sofern die oben ausgewiesene Vorratsbewertung klar abgegrenzt bleibt. Er ist nicht als vollständige Bilanzsimulation zu bewerben.

## Abschlussstand T-0008 (CP-0182)

Für den spielbaren V1-Umfang sind die verbleibenden Zahlungs-/Periodenparameter als deterministische, sichtbare Modellkonventionen dokumentiert: gleiche wirksame Tage folgen D-0120 und dem A02-Phase-8-Ablauf; die wirksame Ausführung bestimmt die Buchungsperiode; für Dispozinsen gilt Actual/365 ohne Tagesrundung mit einmaliger Monatsend-Rundung; automatische Disporückführung erfolgt nur aus Kundeneingängen gemäß D-0126. Maschinenverwertung zählt drei verschiedene fällige und weiterhin unbezahlte Raten gemäß D-0042/43. Diese Festlegungen konkretisieren V1 und beanspruchen keine allgemeine Rechts- oder Bankpraxisregel.

Nicht für den V1-Prototyp erforderliche historische Anschaffungskosten, HGB-Abschlussqualität, standortbezogene Versorgerangebote, individualisierte Start-OP-Belege und spätere SimTAX-Fehlerentdeckungsereignisse sind als explizite Erweiterungs-/Datenlücken dokumentiert und blockieren diese spielbare Szenarioversion nicht. D-0010, Schema und ADR-Status bleiben unverändert. Der frühere 12.800-€-Vorratsposten ist durch D-0128 für diesen Spielstart ersetzt.

## Zweck und Grenzen

Dieses Dokument ist der aktuelle Koordinierungsstand, keine Entscheidungsquelle. Nutzerentscheidungen werden ausschließlich aus `decision-log.md` übernommen. Es trifft keine neue Produkt-, Steuer-, Rechts- oder Architekturentscheidung. D-0010 bleibt unverändert; D-0129 dokumentiert delegierte V1-Konventionen; Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED. CP-0147 bleibt als historischer Nachweis unverändert.

## Aktuell verbindliche Regeln

- Zahlungsanker, Zahlungsziele, Kalendertagszählung und Ankertagszählung gemäß D-0013 bis D-0020.
- Kundenzahlung am vertraglichen Fälligkeitstag ohne eigenes Cash-Gate gemäß D-0110; Kundenforderung/Auftragserlös bei freigegebener Rechnung gemäß D-0112; Lieferantenverbindlichkeit bei akzeptiertem Eingang/bestätigter Leistung gemäß D-0111.
- Eigene Zahlungspriorität, wöchentliche Wiederholungsversuche, acht Retry-Fehlschläge, Zahlungserinnerung/Mahnung und V1-Eskalationsgrenze gemäß D-0021 bis D-0029.
- Maschinendarlehen: Annuität, sieben Jahre Restlaufzeit, erste Rate 29.01.2027, danach monatlich letzter Arbeitstag; 339,21 € regelmäßige Rate und 339,57 € Schlussrate gemäß D-0121/22. Zinssatz fest 5 % nominal, Zins-/Rundungs-/Verzugsfolgen gemäß D-0030 bis D-0043.
- SimTAX-, Vorsteuer-, Perioden- und Korrekturregeln gemäß D-0053 bis D-0059, D-0097 und D-0113 bis D-0119.
- BAB-, Personal- und CNC-Kalkulationsregeln gemäß D-0062 bis D-0076; Materialbewertung gemäß E3; CNC-Buchwert gemäß D-0099; V1-Anfangsbestand und Startbewertung gemäß D-0128.
- D-0001 bis D-0009 und ADR-001 bis ADR-008 bleiben PROPOSED. Diese Koordinierung ist keine Architektur- oder Implementierungsfreigabe.

## Tatsächlich offene Punkte und Abhängigkeiten

| Offener Punkt | Was ist entschieden / was bleibt offen | Zuständigkeit / Abhängigkeit |
|---|---|---|
| A02-Übernahme des V1-Kalenders | D-0011 ist in der A02-Spezifikation übernommen; T-0009 ist durch CP-0150 abgeschlossen. | Keine offene Kalenderentscheidung. |
| A02/A03-Ereigniszeitpunkte und Reihenfolge | D-0120 und D-0129 legen für V1 die Reihenfolge fest: Kundeneingänge samt Disporückführung, Maschinenrate, dann eigene Rechnungen in Spielerreihenfolge; nach Zahlungsversuchen werden offene Posten aktualisiert und nur weiterhin offene Posten gemahnt. Verschobene Termine gehen in die Periode ihres wirksamen Simulationstags. | Übernommene V1-Modellkonvention, keine allgemeine gesetzliche oder bankfachliche Priorität.  |
| Darlehensrate | Entschieden (D-0122): regelmäßige Annuität 339,21 € bei `5 % / 12`; volle 30/360-Monatsperiode ohne separaten Eröffnungszinszeitraum; 83 Raten, Schlussrate 339,57 € nach monatlicher Cent-Rundung. | A03 hat berechnet; A02 hat Rate und Termine in die Simulationsspezifikation übernommen. (CP-0161/0162) |
| Erster tatsächlicher Darlehenstermin | Entschieden (D-0121): erste Rate am 29.01.2027, danach letzter Arbeitstag jedes Monats; 84 Monatsraten bis Dezember 2033. | A02 hat Termin und Rate übernommen; keine Rückfrage offen. (CP-0160/0162) |
| Dispositionskredit | D-0123/24: 10 % der Bilanzsumme zum Ende des Vorquartals, wirksam ab Quartalsbeginn; Startwert 4.671,42 €. D-0125 erlaubt manuelle Ziehung exakt des Fehlbetrags; D-0126 tilgt Kundeneingänge zuerst. D-0127/29 setzen tägliche Actual/365-Berechnung ohne Tagesrundung und einmalige Monatsend-Centrundung als V1-Konvention fest. | Offen bleiben keine V1-Start- oder Buchungsregeln. |
| Vorratsaufteilung / Vorjahresschluss | Für den V1-Szenariostart entschieden durch D-0128: 2.000 kg Stahl, 100 kg Aluminium, 60 Referenzschrauben; 4.214,20 € zu festgeschriebenen Marktpreis-Referenzwerten. Der alte aggregierte Wert 12.800 € ist für diesen Spielstart ersetzt. | Kein Übergabeblocker für den Prototyp. Historische Kostenbelege fehlen; daher keine HGB-Nachbildung. |
| Laufende Kosten und weitere BAB-Zuordnungen | V1 verwendet die sichtbaren Szenariowerte aus V1-MODELL.md und ordnet nur modellierte Beträge zu. Nicht modellierte Einzelkosten, historische Belege und erweiterte BAB-Verteilungen sind keine P0-Abschlussbedingung. | Für erweiterte Kostenrechnung später fortführen; kein V1-Nutzerentscheid offen. |
| A02-Startprofilabgleich | Für den spielbaren Prototyp gemäß D-0128 aktualisiert: 2.000 kg Stahl, 100 kg Aluminium, 60 Referenzteile; Marktpreis-Basis 4.214,20 €. | CP-0181; Preisbelege sind Händlerlistenwerte, keine historische Bilanzprovenienz. |
| Kundenverhaltensparameter | V1-Zahlung erfolgt am Fälligkeitstag; explizite, durch Netzwerk-/Szenarioereignisse erzeugte Verzögerungen werden als V1-Szenarioparameter geführt. | Keine offene Regel, die den deterministischen Kernlauf blockiert. |
| SimTAX-Fehlererkennungsereignisse | V1 bildet keine zufälligen historischen Fehleraufdeckungen ab; bestätigte Korrektur-/Folgejahresregeln gelten, wenn ein ausdrücklich vorhandenes Ereignis sie auslöst. | Weiterer Ereigniskatalog ist Erweiterungsumfang, keine offene Startentscheidung. |
| MRO-/Inflationsfortschreibung | EZB-MRO-Referenz und V1-Zinskurve sind festgelegt; Ableitung des zukünftigen MRO-Pfads anhand Inflation und weitere V2-Faktoren bleiben offen. | A08/A03 gemäß Fachumfang; keine V1-Defaultwerte ergänzen. |
| A04-Abgleich | A04 hat den Datenmodellabgleich gegen CP-0148 und CP-0150 mit CP-0151 abgeschlossen. | Dokumentarischer Abgleich liegt vor; keine Schemafreigabe. |

## Status der A03-Konsolidierung

A03 hat mit CP-0148 die Finanzspezifikation und P0-Finanzkonsistenzprüfung abgeglichen. CP-0181/D-0128 ersetzt für den V1-Szenariostart die damalige Vorratsbewertung. Aktuell gelten 46.714,20 € Aktiva/Passiva, 0 € CNC-Buchwert, 15.214,20 € Eigenkapital-Restposition und 4.671,42 € Dispo-Startlimit. A04s Datenmodellabgleich und A02/A03-Ereignisabgleich bleiben dokumentarische Fachstände; keine Schemafreigabe. Berichte: [A03-Abgleich](../accounting/a03-decision-log-abgleich-bericht.md), [A04-Abgleich](../database/a04-cp-0148-decision-log-abgleich-bericht.md), [T-0009](../simulation/a02-t0009-d0011-aenderungsbericht.md).

## Steuerungsstatus und nächste Schritte

- T-0008 ist mit CP-0182 abgeschlossen; spätere Erweiterungs-/Belegfragen sind keine P0-Blocker für den spielbaren V1-Szenariostart.
- T-0001, T-0008, T-0009, T-0010, T-0011, T-0012, T-0013 und T-0014 sind abgeschlossen. D-0128 dokumentiert die V1-Startpreise als Szenariobasis, nicht als Lieferantenangebote oder historische Bilanzbelege.
- D-0120 bis D-0129 und CP-0160 bis CP-0182 aktualisieren den früheren Stand CP-0156. D-0128 ersetzt für den V1-Prototyp die frühere Vorratsbewertung und passt den Dispo-Startwert an.
- CP-0180 dokumentiert die Rollenprüfung und die korrigierte D-0023-Berechnung. Actual/365, Monatsend-Rundung und vereinfachte makroökonomische Rate sind sichtbare V1-Annahmen, keine neue Nutzerentscheidung.
- Für den V1-Prototyp ist derzeit keine unaufgelöste Agentenabweichung zum festgelegten Anfangsbestand dokumentiert. Fehlende historische Einkaufsbelege sind ausdrücklich als Bilanzgrenze markiert. D-0042/43-Darlehens-Retry und Verwertung wurden nach A02/A03/A05/A09-Rollenprüfung umgesetzt und gezielt geprüft. Kein Commit oder Push.

## Quellen und Provenienz

- [Decision Log](decision-log.md), insbesondere D-0010 bis D-0119.
- [CP-0147](checkpoints/MCP-2026103001.md#cp-0147) bleibt historischer Nachweis der damaligen Nutzerentscheidung.
- [CP-0148](checkpoints/MCP-2026103001.md#cp-0148) dokumentiert den A03-Finanzabgleich.
- [CP-0149](checkpoints/MCP-2026103001.md#cp-0149) dokumentiert den damaligen A01-Koordinierungsstand.
- [CP-0150](checkpoints/MCP-2026103001.md#cp-0150) dokumentiert A02s abgeschlossene T-0009-Arbeit.
- [CP-0151](checkpoints/MCP-2026103001.md#cp-0151) dokumentiert A04s Datenmodellabgleich.
- [CP-0152](checkpoints/MCP-2026103001.md#cp-0152) dokumentiert den historischen Validierungsbefund; die Startprofilabweichungen wurden danach durch CP-0153 korrigiert.
- [CP-0153](checkpoints/MCP-2026103001.md#cp-0153) dokumentiert die A02-Startprofilkorrektur.
- [CP-0154](checkpoints/MCP-2026103001.md#cp-0154) dokumentiert den offenen Komponentenabgleich der 12.800 € Vorräte.
- [CP-0155](checkpoints/MCP-2026103001.md#cp-0155) dokumentiert die A02/A03-Ereignis- und Periodenabstimmung.
- [CP-0156](checkpoints/MCP-2026103001.md#cp-0156) dokumentiert die bestandene Gesamtvalidierung und den Sicherungsstand.
- [CP-0178](checkpoints/MCP-2026103001.md#cp-0178) und [CP-0179](checkpoints/MCP-2026103001.md#cp-0179) dokumentieren die V1-Erweiterungen; [CP-0180](checkpoints/MCP-2026103001.md#cp-0180) dokumentiert den Agentenrollen-Review.
- CP-0020 fehlt weiterhin im Checkout; sein Inhalt wurde nicht rekonstruiert.
