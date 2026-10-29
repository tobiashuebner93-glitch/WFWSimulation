import { WBQ_ITEMS, WBQ_AREAS } from './learning-wbq.js';
import { hsqQuestions, areas as HSQ_AREAS } from './learning-hsq.js';

// Ten newly authored, case-based items per examination area. The first five
// practice application; the second five require transfer across constraints.
const cases = {
  'wbq-volks-und-betriebswirtschaft': [
    ['applied','Ein Zulieferer erhöht den Preis eines Werkstoffs um 8 %. Der Betrieb kann den Aufschlag nur teilweise weitergeben.','Welche kurzfristige Reaktion schützt die Marge, ohne Nachfragewirkung auszublenden?','Deckungsbeitrag und Absatzreaktion für mehrere Preis- und Bezugsoptionen vergleichen.','Den Listenpreis sofort um exakt 8 % erhöhen.','Den Werkstoff ungeachtet der Marge weiter zum alten Preis anbieten.','Den gesamten Jahresbedarf ohne Verbrauchsprüfung bevorraten.'],
    ['applied','Die Nachfrage nach Sonderteilen steigt, während der Marktpreis der Branche sinkt.','Welche Information hilft, die gegenläufigen Entwicklungen zu erklären?','Segment, Auftragsmix und Preiselastizität getrennt auswerten.','Nur die Gesamtstückzahl mit dem Vorjahr vergleichen.','Den sinkenden Marktpreis als Beleg für sinkende Nachfrage behandeln.','Die Kapazität erhöhen, bevor Kundenbedarf und Marge geprüft sind.'],
    ['applied','Ein Kunde entscheidet zwischen zwei technisch vergleichbaren Anbietern. Einer liefert schneller, der andere günstiger.','Welche Information hilft, das Angebot am Kundennutzen auszurichten?','Ermitteln, wie wichtig die kürzere Lieferzeit für das Kundensegment ist und welche Zahlungsbereitschaft dafür besteht.','Ausschließlich die Herstellkosten des eigenen Betriebs.','Die Zahl der Wettbewerber ohne deren Leistungsangebot.','Den niedrigsten Preis als allgemein ausschlaggebend annehmen.'],
    ['applied','Ein Betrieb will eine knappe Maschine für drei Produktgruppen einsetzen.','Wie lässt sich die kurzfristige Verwendung volkswirtschaftlich sinnvoll einordnen?','Den Engpass nach entgangenem Deckungsbeitrag und Nachfragepriorität zuteilen.','Die Maschine gleichmäßig auf alle Gruppen verteilen.','Die größte Absatzmenge unabhängig vom Erlös bevorzugen.','Die Ressource ungenutzt lassen, bis alle Gruppen gleich viel benötigen.'],
    ['applied','Ein regionaler Nachfragerückgang trifft vor allem langlebige Investitionsgüter.','Welche Erklärung ist für die Branchenanalyse am plausibelsten?','Investitionsentscheidungen reagieren oft stärker auf Erwartungen und Finanzierung als laufender Verbrauch.','Langlebige Güter sind grundsätzlich unabhängig von Konjunktur und Zinsen.','Der Rückgang beweist, dass alle Kundensegmente verschwunden sind.','Die Entwicklung muss ausschließlich mit saisonalem Endverbrauch erklärt werden.'],
    ['transfer','Ein Großkunde bietet höhere Stückzahlen an, verlangt aber niedrigere Preise und längere Zahlungsziele. Die Werkstatt ist bereits gut ausgelastet.','Welche Entscheidung berücksichtigt Opportunitätskosten und Liquidität gemeinsam?','Zusatzdeckungsbeitrag gegen verdrängte Aufträge, Zahlungsbindung und Engpasszeit rechnen.','Den Auftrag wegen der höheren Menge annehmen und Finanzierung später klären.','Nur die Stückmarge vergleichen und Zahlungsziele aus der Entscheidung entfernen.','Den Auftrag ablehnen, weil längere Zahlungsziele stets unwirtschaftlich sind.'],
    ['transfer','Ein neuer Onlineanbieter senkt den Preis, erhöht aber die Lieferunsicherheit eines kritischen Werkstoffs.','Welche Beschaffungsstrategie ist bei volatiler Nachfrage am robustesten?','Gesamtkosten und Ausfallfolgen über Szenarien vergleichen und einen begründeten Sicherheitsbestand prüfen.','Vollständig zum günstigsten Anbieter wechseln.','Den bisherigen Anbieter unabhängig von Preis und Zuverlässigkeit beibehalten.','Den Jahresbedarf beim Onlineanbieter bestellen, um Preisrisiko auszuschließen.'],
    ['transfer','Die Zentralbank erhöht den Leitzins; ein kleiner Betrieb plant eine fremdfinanzierte Maschine und erwartet mehr Nachfrage.','Welche Prüfung verbindet Konjunktur- und Unternehmenssicht?','Kapitaldienstfähigkeit mit Nachfrage-, Auslastungs- und Zinsszenarien prüfen.','Nur die erwartete Umsatzsteigerung dem Anschaffungspreis gegenüberstellen.','Auf sinkende Finanzierungskosten warten, ohne Zahlungsströme zu modellieren.','Die Investition allein aus dem aktuellen Leitzins ablehnen.'],
    ['transfer','Ein Wettbewerber verlagert seine Fertigung ins Ausland. Der eigene Betrieb erhält dadurch mehr Anfragen, aber auch komplexere Varianten.','Welche Analyse unterstützt eine tragfähige Marktpositionierung?','Kundennutzen, eigene Kernkompetenzen, Variantenkosten und Lieferfähigkeit gemeinsam bewerten.','Die Auftragszahl als hinreichenden Nachweis eines dauerhaften Vorteils nutzen.','Alle Varianten annehmen und Komplexitätskosten als Gemeinkosten ignorieren.','Ausschließlich über den niedrigsten Preis konkurrieren.'],
    ['transfer','Die Nachfrage steigt in einer Region, sinkt aber in einer anderen. Gleichzeitig unterscheidet sich dort die Zahlungsbereitschaft.','Welche Maßnahme folgt am ehesten aus einer differenzierten Marktanalyse?','Regionale Segmente getrennt bewerten und Kapazität sowie Preisangebot darauf ausrichten.','Einen einheitlichen Preis und Absatzplan für beide Regionen fortschreiben.','Die wachsende Region priorisieren, ohne Deckungsbeiträge zu vergleichen.','Den Gesamtmarkt mitteln und regionale Unterschiede ausblenden.']
  ],
  'wbq-rechnungswesen': [
    ['applied','Ein Auftrag erzielt 4.800 € Nettoerlös. Variable Kosten betragen 3.360 €, periodische Fixkosten 9.000 €.','Welche Aussage zum Deckungsbeitrag ist korrekt?','Der Auftrag leistet 1.440 € zur Deckung fixer Kosten; allein daraus folgt noch kein Gesamtgewinn.','Der Auftrag verursacht 1.920 € Verlust, weil Fixkosten anteilig fehlen.','Der Auftrag ist genau kostendeckend, weil Erlös und variable Kosten abweichen.','Der Deckungsbeitrag beträgt 4.800 €, da Fixkosten nicht auftragsbezogen sind.'],
    ['applied','Eine Rechnung wird im Dezember gestellt, der Kunde zahlt im Januar. Der Betrieb erstellt einen Monatsabschluss.','Welche Zuordnung trennt Erfolg und Zahlungsstrom sachgerecht?','Erlös und Forderung nach Leistung/Abgrenzungsregel erfassen; Zahlung im Januar als Cash-Zufluss behandeln.','Erlös erst im Januar erfassen, weil vorher kein Geld eingeht.','Im Dezember nur den Zahlungseingang und im Januar den Umsatz buchen.','Die Forderung bis zum Jahresende aus der Auswertung entfernen.'],
    ['applied','Der Lagerbestand laut Karte liegt über dem körperlich gezählten Bestand. Es gibt noch nicht gebuchte Entnahmen.','Was ist vor einer Bestandskorrektur erforderlich?','Zählung und Bewegungsbelege abstimmen und die Ursache der Differenz nachvollziehen.','Den Buchbestand sofort auf den niedrigeren Wert setzen.','Die Inventur verwerfen, weil offene Buchungen vorhanden sind.','Die fehlende Menge als Aufwand buchen und später nachforschen.'],
    ['applied','Eine Kostenstelle überschreitet ihr Monatsbudget, obwohl der Betrieb insgesamt weniger produziert hat.','Welche Auswertung zeigt, ob die Abweichung mengen- oder kostenbedingt ist?','Istkosten mit flexibler Plankostenbasis und Beschäftigungsgrad vergleichen.','Nur den absoluten Plan-Ist-Abstand ohne Auslastungsbezug betrachten.','Die Kostenstelle mit dem Vorjahresumsatz vergleichen.','Die Überschreitung als Preisabweichung klassifizieren, ohne Mengen zu prüfen.'],
    ['applied','Eine Maschine wird gekauft und über mehrere Jahre genutzt. Wartung und Energie fallen laufend an.','Welche Zuordnung ist für die Kostenrechnung passend?','Anschaffung über Nutzungsperioden abschreiben; Wartung und Energie periodengerecht gesondert erfassen.','Den gesamten Kaufpreis und alle Folgekosten nur im Kaufmonat als Stückkosten buchen.','Wartungskosten zum Buchwert addieren, ohne Aktivierungsvoraussetzungen zu prüfen.','Abschreibung und Nutzungskosten bis zum Verkauf ignorieren.'],
    ['transfer','Zwei Produktlinien teilen eine stark ausgelastete Maschine. Produkt A hat höheren Stückdeckungsbeitrag, benötigt aber doppelt so viele Engpassminuten.','Welche Kennzahl unterstützt die kurzfristige Reihenfolge?','Deckungsbeitrag je Engpassminute, ergänzt um Liefer- und Nachfragebedingungen.','Stückdeckungsbeitrag ohne Zeitbezug.','Umsatz je Auftrag, weil die Maschine bereits ausgelastet ist.','Fixkosten je Produkt als alleinige Prioritätsregel.'],
    ['transfer','Der Monatsgewinn steigt, der operative Cashbestand sinkt stark. Forderungen und Vorräte sind gewachsen.','Welche Erklärung ist mit beiden Kennzahlen vereinbar?','Erfolg kann gebucht sein, während Mittel durch Forderungen und Lager gebunden sind.','Ein positiver Gewinn muss im selben Umfang Bankguthaben erhöhen.','Der Rückgang beweist, dass der Gewinn falsch berechnet wurde.','Vorräte erhöhen grundsätzlich den Zahlungsmittelbestand.'],
    ['transfer','Ein Betrieb erwägt Eigenfertigung statt Fremdbezug. Ein Teil der Fixkosten bleibt in beiden Varianten bestehen.','Welche Kosten gehören in den kurzfristigen Vergleich?','Nur entscheidungsrelevante vermeidbare Kosten und Opportunitätskosten zusätzlich benötigter Kapazität.','Sämtliche bisherigen Fixkosten vollständig der Eigenfertigung zurechnen.','Nur die Materialkosten der Fremdbezugsoption berücksichtigen.','Den historischen Anschaffungswert der Maschine als zukünftige Auszahlung ansetzen.'],
    ['transfer','Ein Auftrag wurde unter Vollauslastung angenommen. Nachträgliche Rüstkosten und Eilfracht waren nicht kalkuliert.','Wie sollte die Nachkalkulation genutzt werden?','Plan- und Ist-Kosten nach Ursache zerlegen und Angebotsparameter für vergleichbare Folgefälle anpassen.','Die Abweichung pauschal dem Vertrieb zurechnen.','Den ursprünglichen Plan nachträglich an die Istwerte angleichen.','Den Auftrag aus der Deckungsbeitragsauswertung ausschließen.'],
    ['transfer','Die Geschäftsführung vergleicht Monatskosten zweier Perioden mit unterschiedlicher Produktionsmenge.','Welche Methode verbessert die Vergleichbarkeit?','Kosten in fixe und variable Bestandteile trennen und auf eine vergleichbare Beschäftigung beziehen.','Nur Gesamtkosten vergleichen und die Ausbringung ignorieren.','Kosten je Monat durch zwölf teilen.','Die kleinere Periode als effizienter bewerten, weil ihre Gesamtkosten niedriger sind.']
  ],
  'wbq-recht-und-steuern': [
    ['applied','Ein Kunde erhält ein Angebot mit Annahmefrist. Seine Antwort trifft nach Fristablauf ein und ändert zusätzlich die Menge.','Wie ist die Antwort zunächst einzuordnen?','Als verspätete und inhaltlich abweichende Erklärung prüfen; ein neuer Antrag kann vorliegen.','Als unveränderte Annahme behandeln, sobald der Kunde grundsätzlich zustimmt.','Als Vertragsschluss zum ursprünglich angebotenen Preis buchen.','Die Mengenänderung ignorieren, wenn der Auftrag wirtschaftlich attraktiv ist.'],
    ['applied','Eine gelieferte Ware weist einen sichtbaren Mangel auf. Der Käufer nutzt sie zunächst weiter und meldet den Fehler später.','Welche Information ist für die rechtliche Einordnung entscheidend?','Vertragsart, Käuferstatus, Mangelzeitpunkt sowie Anzeige- und Untersuchungsobliegenheiten klären.','Die spätere Meldung schließt Mängelrechte immer aus.','Die Nutzung beseitigt jeden Mangel unabhängig von Kenntnis und Fristen.','Der Verkäufer muss automatisch den vollen Kaufpreis erstatten.'],
    ['applied','Ein Verbraucher bestellt ein handelsübliches Werkzeug online bei einem gewerblichen Händler und erklärt nach Erhalt den Widerruf.','Welche Punkte sind vor der Einordnung des Widerrufs zu prüfen?','Verbrauchereigenschaft, Fernabsatz, Fristbeginn und mögliche gesetzliche Ausnahmen anhand des konkreten Vertrags prüfen.','Ein Widerruf ist ausgeschlossen, sobald die Ware ausgepackt wurde.','Bei jedem Onlinekauf beginnt die Frist bereits mit dem Absenden der Bestellung.','Ein gewerblicher Verkäufer kann das gesetzliche Widerrufsrecht stets vertraglich ausschließen.'],
    ['applied','Ein Gewerbetreibender erhält eine Rechnung mit Umsatzsteuer, obwohl die Leistung nicht eindeutig beschrieben ist.','Welche Reaktion ist fachlich angemessen?','Leistungsinhalt und Rechnungsangaben prüfen und bei Unklarheit eine Korrektur anfordern.','Den Vorsteuerabzug allein aufgrund des ausgewiesenen Steuersatzes beanspruchen.','Die Rechnung ungeprüft als Betriebsausgabe verbuchen.','Die Rechnung verwerfen, ohne den tatsächlichen Leistungsaustausch zu prüfen.'],
    ['applied','Auf einer Branchenveranstaltung schlägt ein Wettbewerber vor, künftig geplante Angebotspreise und Kundenaufteilungen auszutauschen.','Wie sollte die teilnehmende Führungskraft reagieren?','Keinen Austausch über wettbewerblich sensible künftige Preise oder Kundenaufteilungen führen, das Gespräch beenden und den Compliance-Weg nutzen.','Nur unverbindliche Zielpreise austauschen, weil noch keine Aufträge vergeben wurden.','Kundengebiete informell absprechen, solange kein Vertrag geschlossen wird.','Preisinformationen entgegennehmen, aber nicht schriftlich festhalten.'],
    ['transfer','Ein Kunde nimmt ein Angebot an, verlangt danach eine zusätzliche Leistung und bestreitet später den Mehrpreis.','Wie sollte der Betrieb den Vorgang für weitere Schritte aufarbeiten?','Angebotsinhalt, Annahme, Änderungswunsch und ausdrückliche Preisvereinbarung getrennt dokumentieren.','Die Zusatzleistung automatisch als vom ursprünglichen Preis umfasst behandeln.','Den Mehrpreis rückwirkend einseitig festsetzen.','Die gesamte ursprüngliche Vereinbarung als unwirksam behandeln.'],
    ['transfer','Ein Unternehmen entdeckt nach Abgabe einer Steuererklärung einen wesentlichen Fehler in den erklärten Betriebseinnahmen.','Welche Vorgehensweise ist sachgerecht?','Fehler und betroffenen Zeitraum nachvollziehbar prüfen und unverzüglich steuerliche Berichtigungspflichten klären.','Abwarten, ob die Behörde den Fehler bemerkt.','Den Betrag in einer beliebigen späteren Periode verrechnen.','Nur die interne Buchhaltung ändern und die abgegebene Erklärung ignorieren.'],
    ['transfer','Ein Lieferant verlangt einen Haftungsausschluss für alle Schäden, auch bei grober Fahrlässigkeit.','Welche Prüfung ist vor Unterzeichnung nötig?','Vertragstyp, AGB-Einbeziehung und Wirksamkeitsgrenzen der konkreten Klausel prüfen.','Die Klausel als wirksam ansehen, weil beide Unternehmen unterschreiben.','Den Ausschluss akzeptieren, wenn der Preis dadurch sinkt.','Die Klausel automatisch als nichtig behandeln, ohne Wortlaut und Kontext zu prüfen.'],
    ['transfer','Bei einer Betriebsprüfung weichen Kassenaufzeichnungen und Bankbewegungen voneinander ab.','Welche Reaktion ist für eine belastbare Aufklärung am besten?','Belege und Buchungswege abstimmen, Abweichungen dokumentieren und Ursache sowie Zeitraum nachvollziehen.','Fehlende Beträge nachträglich pauschal als Privatentnahme markieren.','Kassenaufzeichnungen überschreiben, bis sie mit dem Bankstand übereinstimmen.','Nur die Bankbewegungen vorlegen und Kassenaufzeichnungen weglassen.'],
    ['transfer','Ein Betrieb beschäftigt eine Person in einem anderen EU-Staat und führt dort eine Dienstleistung aus.','Welche Steuerannahme wäre ohne weitere Prüfung riskant?','Die Behandlung aus Leistungsort, Betriebsstätten-/Registrierungspflichten und anwendbaren Regeln ermitteln.','Die deutsche Umsatzsteuer immer unverändert berechnen.','Auslandsleistungen grundsätzlich als steuerfrei behandeln.','Nur den Wohnsitz des Kunden zur Bestimmung aller Steuerfolgen heranziehen.']
  ],
  'wbq-unternehmensfuehrung': [
    ['applied','Ein Zielsystem belohnt nur Stückzahl. Die Fertigung meldet mehr Ausschuss und steigende Zwischenbestände.','Welche Anpassung reduziert den Fehlanreiz?','Mengenkennzahl mit Qualität, Bestand und Liefertreue als ausgewogene Zielgrößen verbinden.','Das Mengenziel weiter erhöhen, um Ausschuss zu kompensieren.','Ausschuss aus der Zielmessung entfernen.','Die Produktion ausschließlich an Maschinenauslastung messen.'],
    ['applied','Eine neue Führungskraft delegiert Aufgaben, erhält aber keine Rückmeldungen zu Risiken und Fortschritt.','Welche Ergänzung macht die Delegation wirksam?','Ergebnis, Entscheidungsrahmen, Eskalationspunkte und vereinbarte Rückmeldungen klären.','Alle Aufgaben wieder an sich ziehen.','Nur ein Enddatum nennen und Zwischenabstimmungen verbieten.','Verantwortung übertragen, aber jede Entscheidung vorab selbst treffen.'],
    ['applied','Ein Team lehnt eine Prozessänderung ab, weil es frühere Änderungen ohne Schulung erlebt hat.','Was sollte vor dem Rollout erfolgen?','Betroffene einbeziehen, Auswirkungen erläutern und Qualifizierung sowie Rückmeldung organisieren.','Die Änderung sofort verbindlich machen und Widerstand sanktionieren.','Den Nutzen ausschließlich über eine Präsentation der Geschäftsleitung vermitteln.','Die Prozessänderung ganz aufgeben, ohne Ursachen zu prüfen.'],
    ['applied','Zwei Abteilungen verwenden verschiedene Definitionen für „termingerecht“.','Welcher Schritt verbessert die Steuerung zuerst?','Kennzahl, Bezugsdatum und Datenquelle gemeinsam definieren und dokumentieren.','Den Durchschnitt beider Abteilungswerte bilden.','Eine Abteilung zur alleinigen Datenquelle erklären.','Die Kennzahl abschaffen, weil Definitionen voneinander abweichen.'],
    ['applied','Ein Betrieb ist stark von einer Fachkraft abhängig, die einen kritischen Prozess allein beherrscht.','Welche Personalmaßnahme senkt die Abhängigkeit am nachhaltigsten?','Wissen dokumentieren und geeignete Vertretung systematisch qualifizieren.','Die Person stärker kontrollieren und alle Aufgaben bei ihr bündeln.','Den Prozess nur bei Abwesenheit der Fachkraft bearbeiten.','Eine externe Neueinstellung vor jeder internen Kompetenzanalyse vornehmen.'],
    ['transfer','Ein Projekt soll zugleich Lieferzeit, Qualität und Kosten verbessern. Die Teams haben widersprüchliche Ziele und begrenzte Kapazität.','Wie sollte die Leitung den Zielkonflikt steuern?','Zielgrößen priorisieren, Abhängigkeiten und Nebenwirkungen transparent machen und Meilensteine festlegen.','Alle Ziele als gleichrangig setzen und Konflikte den Teams überlassen.','Nur die Kosten senken und Qualität später kontrollieren.','Das Projekt ohne messbare Zielwerte starten, um flexibel zu bleiben.'],
    ['transfer','Eine Investitionsentscheidung verspricht Effizienz, könnte aber Arbeitsplätze und Qualifikationsbedarf verändern.','Welche Entscheidungsgrundlage ist vollständig genug?','Wirtschaftlichkeit, Prozessrisiken, Personalfolgen und Qualifizierungsbedarf gemeinsam bewerten.','Nur die Amortisationszeit berechnen.','Die Investition ablehnen, sobald Qualifizierung erforderlich wird.','Personalfolgen erst nach der Inbetriebnahme betrachten.'],
    ['transfer','Eine Führungskraft erhält widersprüchliche Rückmeldungen zu einem Leistungseinbruch. Ein Teammitglied berichtet von Überlastung, Kennzahlen zeigen Wartezeiten.','Welche Führungsreaktion verbindet Daten- und Mitarbeitersicht?','Arbeitsablauf und Belastung im Gespräch prüfen, Ursachenhypothesen testen und Maßnahmen nachhalten.','Die Kennzahl als objektiven Beweis für individuelles Fehlverhalten werten.','Die Aussage des Mitarbeiters ohne Prüfung als alleinige Ursache übernehmen.','Das Teamziel senken, ohne Prozess- oder Ressourcenlage zu untersuchen.'],
    ['transfer','Ein Unternehmen wächst schneller als seine Führungs- und Informationsstruktur. Entscheidungen werden doppelt getroffen und Verantwortlichkeiten bleiben unklar.','Welche Organisationsmaßnahme passt am besten?','Entscheidungsrechte, Schnittstellen und Eskalationswege entlang der Prozesse festlegen.','Weitere Hierarchieebenen einführen, ohne Aufgaben zuzuordnen.','Alle Entscheidungen zentralisieren, auch operative Routinefragen.','Die Teams selbstständig arbeiten lassen, ohne gemeinsame Standards zu bestimmen.'],
    ['transfer','Ein Verbesserungsprogramm zeigt kurzfristig gute Kennzahlen, aber Beschwerden steigen drei Monate später erneut.','Welche Auswertung sollte die Leitung nachschieben?','Wirkung und Nebenwirkungen über längere Zeit prüfen und Prozessursachen sowie Rückfallmuster untersuchen.','Die ursprünglichen Kennzahlen als ausreichenden Erfolgsnachweis verwenden.','Das Programm sofort beenden, weil Beschwerden wiederkehren.','Die Beschwerden als Einzelfälle aus der Evaluation herausnehmen.']
  ],
  'hsq-betriebliches-management': [
    ['applied','Ein Bereich erreicht sein Produktivitätsziel, verfehlt aber gleichzeitig Liefertermine.','Welche Kennzahlenergänzung macht die Steuerung ausgewogener?','Produktivität zusammen mit Termintreue, Qualität und Bestand beobachten.','Das Produktivitätsziel erhöhen.','Nur die Termintreue messen und Kosten ausblenden.','Verspätete Aufträge aus der Berechnung entfernen.'],
    ['applied','Eine Maßnahme zur Personalbindung soll starten, doch die Fluktuationsdaten sind nach Austrittsgrund nicht erfasst.','Was ist ein belastbarer erster Schritt?','Datenbasis und Gesprächswege verbessern und Ursachen nach Gruppen systematisch erfassen.','Sofort einen einheitlichen Bonus für alle einführen.','Die Fluktuation anhand weniger Einzelfälle erklären.','Die Kennzahl bis zum nächsten Jahr nicht weiter betrachten.'],
    ['applied','Ein Produktionsbereich erstellt seinen Plan unabhängig vom Vertrieb. Folge sind ungenutzte Kapazitäten und kurzfristige Eilaufträge.','Welche Abstimmung sollte etabliert werden?','Absatz-, Kapazitäts- und Beschaffungsplanung in einem regelmäßigen Planungszyklus verbinden.','Den Vertrieb auf eine feste Monatsmenge beschränken.','Die Fertigung dauerhaft auf Maximalleistung planen.','Eilaufträge nur noch nach Eingang priorisieren.'],
    ['applied','Die Leitung möchte ein neues Qualitätsziel einführen, kann aber den Ausgangswert nicht zuverlässig bestimmen.','Welche Reihenfolge ist sinnvoll?','Messdefinition und Baseline festlegen, dann Ziel und Verantwortlichkeit vereinbaren.','Ein ambitioniertes Ziel sofort veröffentlichen und Daten später schätzen.','Nur die Zahl der Qualitätsmeetings als Baseline nutzen.','Die Verantwortung an alle Bereiche gleichzeitig übertragen.'],
    ['applied','Ein Betrieb weiß, dass ein einzelner Lieferant ausfallen kann, hat aber keinen dokumentierten Notfallprozess.','Welche Managementmaßnahme senkt das Risiko?','Kritikalität und Wiederanlaufoptionen bewerten und Verantwortliche sowie Auslöser festlegen.','Den Lieferanten ohne Risikoanalyse sofort wechseln.','Den Notfall nur im Jahresbericht dokumentieren.','Mehr Bestand halten, ohne Reichweite oder Lagerkosten zu bewerten.'],
    ['transfer','Die Geschäftsführung muss zwischen einer günstigen Automatisierung mit hohem Qualifizierungsbedarf und einer teureren Lösung mit niedrigerem Veränderungsrisiko wählen.','Welche Entscheidungsvorlage bildet den Zielkonflikt am besten ab?','Lebenszykluskosten, Produktivität, Qualifizierung, Umstellungsrisiko und Sensitivitäten gemeinsam vergleichen.','Die Investitionssumme als alleinige Rangfolge verwenden.','Qualifizierungsaufwand pauschal als einmalige Kosten ignorieren.','Die Lösung mit dem geringsten Veränderungsrisiko ohne Wirtschaftlichkeitsprüfung wählen.'],
    ['transfer','Eine Organisation möchte eine neue Strategie umsetzen. Bereichsziele fördern jedoch weiterhin lokale Einsparungen zulasten gemeinsamer Lieferfähigkeit.','Wie sollte die Umsetzung korrigiert werden?','Bereichskennzahlen an gemeinsamen Ergebnisgrößen ausrichten und Zielkonflikte regelmäßig eskalieren.','Die Strategie erneut kommunizieren, ohne Kennzahlen zu ändern.','Alle lokalen Ziele streichen und keine Verantwortlichen benennen.','Die Lieferfähigkeit ausschließlich dem Versand zuweisen.'],
    ['transfer','Ein Unternehmen verfügt über steigende Aufträge, aber Engpässe bei Fachkräften und Material. Der Liquiditätsspielraum ist begrenzt.','Welche Planungsfolge ist am robustesten?','Aufträge nach Deckungsbeitrag, Engpassverbrauch, Lieferfähigkeit und Cash-Bedarf priorisieren.','Jeden Auftrag in Eingangschronologie annehmen.','Umsatzstärkste Aufträge ohne Kapazitätsprüfung priorisieren.','Nur verfügbare Liquidität betrachten und künftige Zahlungseingänge ignorieren.'],
    ['transfer','Eine Prozesskennzahl verbessert sich nach einer Umorganisation; gleichzeitig hat sich die Erfassungsmethode geändert.','Was muss vor einer Erfolgsbehauptung geprüft werden?','Vergleichbarkeit der Definitionen prüfen und Prozesswirkung von Messartefakten trennen.','Den Trend als kausalen Erfolg der Reorganisation präsentieren.','Nur die neue Messreihe verwenden und die alte löschen.','Die Kennzahl vollständig aus der Steuerung nehmen.'],
    ['transfer','Ein Betrieb expandiert in einen neuen Markt mit unsicherer Nachfrage und hohen Anfangskosten.','Wie lässt sich die Strategie mit überschaubarem Risiko erproben?','Etappierte Einführung mit messbaren Annahmen, Abbruchkriterien und Lernschleifen planen.','Die volle Kapazität sofort aufbauen, um Nachfrage zu erzeugen.','Den Markteintritt ausschließen, solange keine sichere Absatzprognose besteht.','Die Anfangskosten auf spätere Perioden verschieben, um den Pilot günstiger erscheinen zu lassen.']
  ],
  'hsq-investition-finanzierung-rechnungswesen-controlling': [
    ['applied','Eine Maschine spart jährlich 12.000 € variable Kosten, benötigt aber Wartung und verursacht Finanzierungskosten.','Welche Grundlage verbessert den Investitionsvergleich?','Zusätzliche Ein- und Auszahlungen über Nutzungsdauer einschließlich Restwert und Finanzierung prüfen.','Nur die jährliche Bruttoeinsparung mit dem Kaufpreis vergleichen.','Die Finanzierungskosten weglassen, weil sie nicht produktiv sind.','Den Buchwert am Ende als sicheren Verkaufserlös ansetzen.'],
    ['applied','Die Eigenkapitalquote sinkt, während das Anlagevermögen durch eine Investition steigt.','Welche Einordnung ist sachlich richtig?','Quote und absolute Werte gemeinsam prüfen; die Veränderung allein belegt weder Zahlungsunfähigkeit noch Unwirtschaftlichkeit.','Eine sinkende Eigenkapitalquote beweist unmittelbar Insolvenz.','Die Investition erhöht automatisch das Eigenkapital.','Die Kennzahl bleibt durch eine Aktivierung unverändert.'],
    ['applied','Ein Projekt liegt über Budget, aber noch im Terminplan. Die Ursache ist nicht dokumentiert.','Welche Controllingmaßnahme ist am geeignetsten?','Kostenabweichung nach Arbeitspaket und Ursache analysieren und eine Prognose bis Projektende aktualisieren.','Das Budget um den Überschreitungsbetrag erhöhen.','Nur den bereits ausgegebenen Betrag berichten.','Die Abweichung mit späteren Einsparungen verrechnen, ohne Nachweis.'],
    ['applied','Ein Kreditangebot enthält nominalen Zinssatz, Gebühren und unterschiedliche Tilgungsprofile.','Wie vergleicht der Betrieb die Angebote belastbar?','Effektive Zahlungsströme, Gesamtkosten, Laufzeit und Liquiditätsbelastung gegenüberstellen.','Nur den nominal niedrigsten Zinssatz wählen.','Die Rate vergleichen, ohne Laufzeit und Gebühren zu beachten.','Die Gebühren aus der Finanzierung ausblenden, da sie einmalig sind.'],
    ['applied','Die Fertigungskosten je Stück steigen, obwohl die Gesamtkosten konstant bleiben.','Welche Erklärung ist zuerst zu prüfen?','Ausbringungsmenge und Beschäftigungsgrad als Bezugsgröße untersuchen.','Eine Kostensteigerung je Stück als Beweis für höhere Gesamtausgaben ansehen.','Die Fixkosten automatisch dem Einkauf zurechnen.','Die Kennzahl ignorieren, weil Gesamtkosten stabil sind.'],
    ['transfer','Eine Investition hat einen positiven Kapitalwert im Basisszenario. Absatzmenge und Energiepreis sind jedoch unsicher.','Welche Ergänzung erhöht die Entscheidungsqualität?','Sensitivitäts- und Szenarioanalyse für die wertbestimmenden Annahmen durchführen.','Den positiven Kapitalwert als risikofreie Rendite interpretieren.','Alle unsicheren Werte durch den optimistischsten Fall ersetzen.','Die Investition allein wegen verbleibender Unsicherheit ablehnen.'],
    ['transfer','Ein Unternehmen hat Gewinn, aber mehrere kurzfristige Zahlungen fallen vor erwarteten Kundeneingängen an.','Welche Steuerung ist vorrangig?','Fälligkeiten und belastbare Zahlungszeitpunkte in einer rollierenden Liquiditätsplanung abstimmen.','Den Gewinn als verfügbares Bankguthaben behandeln.','Alle Lieferanten später bezahlen, ohne Vertragsfolgen zu prüfen.','Eine neue Investition tätigen, weil der Jahresüberschuss positiv ist.'],
    ['transfer','Ein Produkt zeigt im BAB hohe Gemeinkosten, weil eine einzige Zuschlagsbasis verwendet wird. Produkte beanspruchen Prozesse sehr unterschiedlich.','Welche Weiterentwicklung ist methodisch angemessen?','Verursachungsgerechte Bezugsgrößen oder Prozesskostentreiber prüfen und Auswirkungen vergleichen.','Den Zuschlagssatz erhöhen, bis der Gesamtbetrag dem Budget entspricht.','Gemeinkosten vollständig aus der Kalkulation entfernen.','Den Umsatz als einzige Kostenverteilungsbasis verwenden.'],
    ['transfer','Eine Investition wird mit Eigenmitteln finanziert, die auch für saisonale Materialkäufe benötigt werden.','Welche Alternative ist vor der Freigabe zu vergleichen?','Kapitalbindung und Liquiditätsreserve mit einer passenden Finanzierung und deren Gesamtkosten abwägen.','Eigenfinanzierung grundsätzlich als kostenlos behandeln.','Die Investition genehmigen, sobald Bankcash den Kaufpreis heute deckt.','Materialeinkäufe verschieben, ohne Auswirkungen auf Liefertermine zu prüfen.'],
    ['transfer','Der Soll-Ist-Vergleich zeigt höhere Kosten und höhere Ausbringung als geplant.','Welche Aussage vermeidet eine falsche Bewertung?','Kostenabweichung bei vergleichbarer Beschäftigung analysieren und Mengen-/Preis-/Verbrauchseffekte trennen.','Die gesamte Überschreitung als Ineffizienz werten.','Die höhere Ausbringung als Beweis für Wirtschaftlichkeit nehmen.','Die Kostenabweichung mit dem Umsatzanstieg verrechnen, ohne Deckungsbeitrag zu prüfen.']
  ],
  'hsq-logistik': [
    ['applied','Ein günstiger Lieferant verlangt eine Mindestmenge, die den erwarteten Monatsbedarf übersteigt.','Welche Kosten sollten in den Beschaffungsvergleich einfließen?','Einkaufspreis, Kapitalbindung, Lagerkosten, Verbrauchsrisiko und Lieferzuverlässigkeit.','Nur den Stückpreis.','Nur den Lagerraum, da der Preis bekannt ist.','Die Mindestmenge als unverbindliche Empfehlung behandeln.'],
    ['applied','Ein kritisches Teil hat lange Lieferzeit und unregelmäßigen Verbrauch.','Welche Bestandsregel ist angemessen?','Sicherheitsbestand anhand Wiederbeschaffungszeit, Streuung und Fehlmengenkosten bestimmen.','Für jedes Material denselben Bestand halten.','Den Meldebestand auf null setzen, um Kapital zu sparen.','Die größte bisherige Entnahme als dauerhaften Bedarf verwenden.'],
    ['applied','Eine Inventur weicht bei mehreren Teilen ab; bei einigen liefen während der Zählung Entnahmen.','Wie wird die Ursache am zuverlässigsten eingegrenzt?','Bewegungszeitpunkte abgrenzen, Zählprozess prüfen und Abweichungen je Artikel verfolgen.','Alle Differenzen pauschal auf den teuersten Artikel buchen.','Die Zählung wiederholen, ohne den Materialfluss anzuhalten oder zu protokollieren.','Nur die Summe des Gesamtlagers mit der Buchhaltung vergleichen.'],
    ['applied','Ein Fertigteil ist produziert, aber noch nicht versendet. Im Lager wird Platz für eine Anlieferung benötigt.','Welche Steuerungsinformation ist entscheidend?','Belegte Fertigwarenfläche, Versandfreigabe und zugesagter Abholtermin gemeinsam planen.','Das Teil bei Rechnungsstellung automatisch als versendet buchen.','Die Anlieferung unabhängig von verfügbarer Fläche annehmen.','Die Lagerkapazität anhand des Warenwerts statt des Platzbedarfs bewerten.'],
    ['applied','Ein Spediteur liefert häufiger verspätet, ist aber günstiger als Alternativen.','Welche Kennzahl hilft beim Vergleich?','Gesamtkosten inklusive Verspätungsfolgen und termingerechter Lieferquote.','Frachtpreis je Lieferung.','Anzahl der Sendungen ohne Liefertermine.','Durchschnittliche Transportentfernung allein.'],
    ['transfer','Ein zentraler Lieferant meldet einen mehrwöchigen Ausfall. Zwei Alternativen sind verfügbar: teuer und schnell oder günstig mit Mindestmenge.','Welche Disposition schützt Lieferfähigkeit bei begrenzter Liquidität?','Kritische Bedarfe priorisieren und Fehlmengenkosten, Kapitalbindung sowie Teilbezug der Alternativen abwägen.','Den gesamten Jahresbedarf sofort beim günstigen Anbieter bestellen.','Ausschließlich den teuren Anbieter nutzen, ohne Aufträge zu priorisieren.','Kundenaufträge unverändert zusagen und Lieferengpass später melden.'],
    ['transfer','Das Lager ist räumlich ausgelastet, obwohl der Bestandswert niedrig ist. Langsamdreher blockieren Stellplätze.','Welche Maßnahme adressiert das Problem gezielt?','Umschlag und Flächenbedarf analysieren, Bestandsparameter bereinigen und Versand-/Lagerzonen prüfen.','Den Lagerwert als Maß für freie Kapazität verwenden.','Mehr Material bestellen, um Mengenvorteile auszunutzen.','Alle Sicherheitsbestände ohne Kritikalitätsprüfung halbieren.'],
    ['transfer','Ein Unternehmen plant Just-in-time-Lieferung, hat aber instabile Anlieferzeiten und häufige Produktionsunterbrechungen.','Welche Entscheidung ist tragfähig?','Lieferfähigkeit und Prozessstabilität verbessern oder einen risikogerechten Puffer begründen.','Puffer vollständig entfernen, damit der Bestand sinkt.','Den Lieferanten anhand des Einkaufspreises allein bewerten.','Produktionsstillstände als Fertigungsproblem unabhängig vom Zulauf behandeln.'],
    ['transfer','Ein Auftrag benötigt Material aus zwei Lieferquellen mit unterschiedlichen Chargen- und Qualitätsnachweisen.','Was muss die Arbeitsvorbereitung vor Freigabe sicherstellen?','Materialidentität, Rückverfolgbarkeit und erforderliche Qualitätsnachweise je Charge prüfen.','Die Chargen für bessere Auslastung vermischen.','Den günstigeren Werkstoff ohne Dokumentenprüfung zuerst einsetzen.','Die Nachweise erst bei einer Reklamation anfordern.'],
    ['transfer','Ein Distributionsweg mit niedrigen Stückkosten verursacht mehr Verpackung, Beschädigungen und Retouren.','Welche Vergleichsgröße bildet die Logistikleistung besser ab?','Gesamte Prozesskosten und Servicequalität je erfolgreich zugestellter Einheit.','Frachtkosten je versandtem Paket.','Anzahl versandter Pakete unabhängig von Retouren.','Verpackungskosten ohne Qualitäts- und Retourenwirkung.']
  ],
  'hsq-marketing-vertrieb': [
    ['applied','Eine Kampagne erzeugt viele Anfragen, aber kaum Angebote werden angenommen.','Welche Auswertung ist für die nächste Entscheidung hilfreich?','Konversionsstufen nach Segment, Bedarf, Angebotspreis und Absagegrund untersuchen.','Die Reichweite der Kampagne weiter erhöhen.','Nur den Umsatz der gewonnenen Aufträge betrachten.','Alle Interessenten als gleich kaufbereit behandeln.'],
    ['applied','Ein Stammkunde fordert einen Rabatt, obwohl seine Aufträge häufig kleine Sonderlose sind.','Welche Kalkulationsgrundlage sollte vor einer Zusage geprüft werden?','Auftragsbezogene Rüst-, Betreuungs- und Lieferkosten sowie Kundenwert.','Den Rabatt an der letzten Standardserie orientieren.','Nur die Materialkosten des Sonderloses berücksichtigen.','Den Rabatt gewähren, um den Umsatz des Monats zu sichern.'],
    ['applied','Ein Angebot wird regelmäßig wegen langer Lieferzeit abgelehnt, obwohl der Preis wettbewerbsfähig ist.','Welche Vertriebsinformation sollte ergänzt werden?','Kundenseitige Terminpriorität und mögliche Leistungs-/Kapazitätsoptionen ermitteln.','Den Preis ohne Rückfrage weiter senken.','Die Lieferzeit aus dem Angebot entfernen.','Jeden Auftrag mit einem kürzeren Termin anbieten.'],
    ['applied','Der Vertrieb misst Erfolg nur an der Zahl abgegebener Angebote.','Welche Kennzahl ergänzt diese Aktivitätsmessung?','Annahmequote und erzielter Deckungsbeitrag nach Segment verfolgen.','Die Zahl der versendeten E-Mails.','Den durchschnittlichen Listenpreis ohne Zuschläge.','Die Zahl der Kundenkontakte unabhängig vom Ergebnis.'],
    ['applied','Ein neues Produkt spricht mehrere Kundengruppen an, die unterschiedliche Anforderungen an Qualität und Lieferzeit haben.','Welche Marketingentscheidung ist folgerichtig?','Segmente und Nutzenversprechen differenzieren und die Leistungsfähigkeit je Segment prüfen.','Eine einheitliche Botschaft verwenden, ohne Unterschiede zu testen.','Alle Merkmale gleichzeitig als wichtigsten Kaufgrund bewerben.','Den Preis für jede Gruppe identisch festlegen, bevor Kosten analysiert sind.'],
    ['transfer','Ein Großauftrag würde die Werkstatt auslasten, bietet aber eine geringe Marge und verdrängt kleinere Anfragen mit kürzerer Lieferzeit.','Wie sollte der Zuschlag bewertet werden?','Deckungsbeitrag je Engpasszeit, Opportunitätskosten, Zahlungsrisiko und Kundenbeziehung vergleichen.','Den Großauftrag wegen seines Umsatzvolumens bevorzugen.','Kleinaufträge grundsätzlich vor großen Aufträgen priorisieren.','Nur die Marge des Großauftrags betrachten.'],
    ['transfer','Ein Kunde vergleicht ein preisgünstigeres Angebot mit längerer Lieferzeit und ein teureres mit verlässlicher Terminabsicherung.','Wie sollte der Anbieter den Wert seiner Leistung kommunizieren?','Nachweisbare Termin- und Qualitätsvorteile an den Kundenbedarf knüpfen und transparent bepreisen.','Den Wettbewerberpreis ohne Leistungsbezug unterbieten.','Lieferzuverlässigkeit garantieren, ohne Kapazität zu prüfen.','Den Mehrpreis allein mit höheren internen Kosten erklären.'],
    ['transfer','Eine Rabattaktion steigert den Absatz, doch Folgekäufe bleiben aus und die Marge sinkt.','Welche Auswertung trennt kurzfristigen Effekt von nachhaltigem Kundenwert?','Kohorten, Wiederkaufrate und Deckungsbeitrag nach Rabatt und Neukundensegment vergleichen.','Den Absatz während der Aktion als Erfolgskriterium verwenden.','Die Folgekäufe ohne Aktionskunden auswerten.','Die Marge durch höheren Umsatz als ausgeglichen betrachten.'],
    ['transfer','Ein Vertriebsteam erhält Anfragen, die die Fertigung nicht erfüllen kann. Kunden werden erst nach Angebotsabgabe informiert.','Welche Prozessänderung verhindert wiederholte Fehlzusagen?','Vor Angebotsfreigabe einen verbindlichen Kapazitäts- und Qualifikationscheck einführen.','Vertrieb weiterhin allein auf Basis des Kundenwunsches anbieten lassen.','Die Lieferzeit pauschal verlängern, ohne Auftragslage zu prüfen.','Nicht erfüllbare Anfragen aus der Auswertung entfernen.'],
    ['transfer','Der Betrieb möchte in ein neues Kundensegment eintreten, kennt dessen Zahlungsbereitschaft und Beschaffungsanforderungen kaum.','Wie sollte der Markteintritt vorbereitet werden?','Kundennutzen und Kaufkriterien validieren, Pilotangebote testen und Marge sowie Kapazität messen.','Das Segment anhand der Marktgröße sofort vollständig bedienen.','Den bisherigen Preis auf das neue Segment übertragen.','Den Einstieg allein von der Konkurrenzpräsenz abhängig machen.']
  ],
  'hsq-fuehrung-zusammenarbeit': [
    ['applied','Eine Mitarbeiterin erreicht ihr Qualitätsziel, verfehlt aber regelmäßig Termine.','Wie sollte die Führungskraft das Gespräch strukturieren?','Beobachtungen und Erwartungen konkretisieren, Ursachen erfragen und überprüfbare nächste Schritte vereinbaren.','Die Mitarbeiterin als unzuverlässig einstufen.','Das Qualitätsziel wegen der Terminprobleme streichen.','Die Termine ohne Gespräch an das Team übertragen.'],
    ['applied','Ein Teammeeting wird von wenigen Personen dominiert; wichtige Hinweise aus der Fertigung fehlen.','Welche Moderation erhöht die Beteiligung?','Zunächst Beiträge strukturiert sammeln und anschließend nach Kriterien gemeinsam bewerten.','Die lauteste Position zur Teamentscheidung erklären.','Die Diskussion auf Führungskräfte beschränken.','Hinweise nach dem Meeting informell aufnehmen und nicht dokumentieren.'],
    ['applied','Eine erfahrene Fachkraft soll eine neue Maschine bedienen, verfügt aber noch nicht über die erforderliche Qualifikation.','Welche Personaleinsatzentscheidung ist angemessen?','Qualifikationsnachweis und sichere Einweisung vor eigenständigem Einsatz sicherstellen.','Die Person wegen ihrer Erfahrung sofort allein einsetzen.','Die Qualifikation nach dem ersten Produktionsauftrag nachtragen.','Die Maschine ohne Unterweisung dem gesamten Team freigeben.'],
    ['applied','Zwei Beschäftigte streiten über wiederkehrende Übergabefehler zwischen Schichten.','Was ist ein geeigneter erster Schritt?','Konkrete Übergabesituationen und Erwartungen gemeinsam rekonstruieren und Prozessursachen prüfen.','Den Konflikt als persönliches Problem einer Person sanktionieren.','Die Schichtübergabe ohne Untersuchung vollständig abschaffen.','Die Beteiligten getrennt versetzen, bevor der Ablauf geklärt ist.'],
    ['applied','Ein Mitarbeiter möchte sich weiterentwickeln, weiß aber nicht, welche Kompetenz für die nächste Rolle fehlt.','Welche Maßnahme unterstützt die Entwicklung am besten?','Anforderungsprofil und aktuelle Fähigkeiten vergleichen und ein konkretes Lernziel mit Feedback vereinbaren.','Einen allgemeinen Kurs ohne Bezug zur Zielrolle buchen.','Die Beförderung zusagen, bevor Anforderungen geklärt sind.','Die Entwicklung bis zur nächsten Leistungsbeurteilung vertagen.'],
    ['transfer','Ein Team soll kurzfristig Mehrarbeit leisten. Gleichzeitig gibt es Krankheitsausfälle und Anzeichen von Überlastung.','Wie sollte die Führungskraft entscheiden?','Arbeitsfähigkeit, Arbeitsschutz, Prioritäten und freiwillige Kapazität prüfen und Alternativen abstimmen.','Mehrarbeit pauschal anordnen, weil der Auftrag zugesagt ist.','Den Auftrag ohne Gespräch vollständig absagen.','Ausfälle durch höhere individuelle Leistungsziele kompensieren.'],
    ['transfer','Eine erfahrene Fachkraft widerspricht einer Prozessänderung, während neue Mitarbeitende die Änderung unterstützen.','Wie lässt sich der Konflikt konstruktiv bearbeiten?','Erfahrungswissen und erwartete Prozesswirkung prüfen, einen begrenzten Versuch vereinbaren und Ergebnisse auswerten.','Die erfahrene Fachkraft wegen Widerstands ausschließen.','Die Mehrheit entscheiden lassen, ohne Sicherheits- und Qualitätsaspekte zu prüfen.','Die Änderung unverändert stoppen, um den Konflikt zu vermeiden.'],
    ['transfer','Ein Leistungsproblem tritt nur an bestimmten Tagen auf. Die individuelle Bewertung einer Mitarbeiterin ist gut, die Auslastung schwankt stark.','Welche Führungsdiagnose ist am belastbarsten?','Arbeitsverteilung, Materialverfügbarkeit und Tagesbedingungen zusammen mit individuellem Feedback analysieren.','Die Person unabhängig vom Kontext als Ursache festlegen.','Die Leistungsbewertung wegen der Tagesabweichung vollständig verwerfen.','Die Auslastung als ausreichende Erklärung für alle Qualitätsabweichungen nehmen.'],
    ['transfer','Eine Führungskraft delegiert eine kritische Kundenreklamation, gibt aber weder Entscheidungsspielraum noch Eskalationsregel mit.','Welche Korrektur erhält Verantwortung und Kontrolle?','Ergebnisrahmen, Befugnisse, Fristen und Eskalationsschwellen konkret vereinbaren.','Die Reklamation vollständig zurücknehmen und selbst bearbeiten.','Nur die Frist nennen und alle Sachentscheidungen offenlassen.','Die Verantwortung übertragen und Rückfragen generell untersagen.'],
    ['transfer','Ein Team hat nach einer Umstrukturierung sinkende Motivation und mehr Fehler, obwohl die Arbeitsmenge gleich blieb.','Welche Vorgehensweise verbindet Beteiligung und Leistungsverbesserung?','Veränderungsfolgen mit dem Team auswerten, konkrete Hindernisse priorisieren und Maßnahmen samt Rückmeldung testen.','Motivation als private Angelegenheit behandeln und Ziele erhöhen.','Alle Fehler der Umstrukturierung zuschreiben und Änderungen zurücknehmen.','Einmalige Anerkennung geben, ohne Abläufe oder Belastung zu untersuchen.']
  ]
};

const caseCompetencies = {
  'wbq-volks-und-betriebswirtschaft': ['vw-price-elasticity','vw-market-segmentation','vw-market-segmentation','vw-scarcity','vw-business-cycle','vw-opportunity-cost','vw-risk-diversification','vw-interest-rate','vw-globalization','vw-market-segmentation'],
  'wbq-rechnungswesen': ['rw-contribution-margin','rw-invoice-cutoff','rw-accounting-controls','rw-flexible-budget','rw-depreciation','rw-contribution-margin','rw-cash-flow','rw-relevant-cost','rw-budget-variance','rw-flexible-budget'],
  'wbq-recht-und-steuern': ['rt-counteroffer','rt-purchase-warranty','rt-consumer-withdrawal','rt-invoice','rt-competition-information','rt-work-contract','rt-tax-advice','rt-standard-terms','rt-bookkeeping-duty','rt-reverse-charge'],
  'wbq-unternehmensfuehrung': ['uf-quality','uf-delegation','uf-change-management','uf-quality','uf-knowledge-management','uf-objectives','uf-risk-management','uf-performance-feedback','uf-organizational-structure','uf-strategic-control'],
  'hsq-betriebliches-management': ['wfprv5-1-planung-statistik','wfprv5-1-organisation-personalentwicklung','wfprv5-1-planung-statistik','wfprv5-1-planung-statistik','wfprv5-1-entscheidung-zeitmethoden','wfprv5-1-planung-statistik','wfprv5-1-organisation-personalentwicklung','wfprv5-1-entscheidung-zeitmethoden','wfprv5-1-information-wissensmanagement','wfprv5-1-planung-statistik'],
  'hsq-investition-finanzierung-rechnungswesen-controlling': ['wfprv5-2-investitionsrechnung','wfprv5-2-controlling','wfprv5-2-controlling','wfprv5-2-finanzierungsarten','wfprv5-2-kostenrechnung','wfprv5-2-investitionsrechnung','wfprv5-2-finanzplanung','wfprv5-2-kostenrechnung','wfprv5-2-finanzierungsarten','wfprv5-2-controlling'],
  'hsq-logistik': ['wfprv5-3-einkauf-beschaffung','wfprv5-3-materialwirtschaft-lagerhaltung','wfprv5-3-materialwirtschaft-lagerhaltung','wfprv5-3-wertschoepfungskette','wfprv5-3-wertschoepfungskette','wfprv5-3-einkauf-beschaffung','wfprv5-3-materialwirtschaft-lagerhaltung','wfprv5-3-wertschoepfungskette','wfprv5-3-materialwirtschaft-lagerhaltung','wfprv5-3-rationalisierung'],
  'hsq-marketing-vertrieb': ['wfprv5-4-vertriebsmanagement','wfprv5-4-vertriebsmanagement','wfprv5-4-vertriebsmanagement','wfprv5-4-marketingplanung','wfprv5-4-marketinginstrumente','wfprv5-4-vertriebsmanagement','wfprv5-4-marketingplanung','wfprv5-4-marketingplanung','wfprv5-4-vertriebsmanagement','wfprv5-4-marketingplanung'],
  'hsq-fuehrung-zusammenarbeit': ['wfprv5-5-mitarbeiterfoerderung','wfprv5-5-projektgruppenmoderation','wfprv5-5-mitarbeiterfoerderung','wfprv5-5-konfliktmanagement','wfprv5-5-mitarbeiterfoerderung','wfprv5-5-kommunikation-kooperation','wfprv5-5-konfliktmanagement','wfprv5-5-mitarbeiterfoerderung','wfprv5-5-kommunikation-kooperation','wfprv5-5-mitarbeiterfoerderung']
};
const areas = [...WBQ_AREAS, ...HSQ_AREAS];
const banks = new Map(areas.map(area => [area.id, [...WBQ_ITEMS, ...hsqQuestions].filter(item => item.areaId === area.id)]));
const letters = ['A','B','C','D'];
// A09's 2026-10-29 review found inherited explanations and distractors that
// did not fit several new scenarios. Keep reviewed content attached to the
// individual case instead of borrowing prose from a competence anchor.
const reviewOverrides = {
  'extra-wbq-volks-und-betriebswirtschaft-01': {
    wrong: [
      'Den Verkaufspreis um genau 8 % erhöhen und die Absatzreaktion erst nach dem Monatsabschluss prüfen.',
      'Den Preis unverändert lassen, ohne den veränderten Materialaufwand in der Marge zu berücksichtigen.',
      'Den gesamten Jahresbedarf sofort bevorraten, obwohl Nachfrage und Kapitalbindung ungeprüft sind.'
    ],
    explanation: 'Der Einkaufspreis steigt um 8 %, aber der Betrieb kann den Aufschlag nur teilweise weitergeben. Deshalb sollte er mehrere Preis- und Bezugsvarianten nach Deckungsbeitrag und erwarteter Absatzreaktion vergleichen; die Wirkung lässt sich nicht aus einer einzelnen Prozentzahl ableiten.',
    companyEffect: 'Der Variantenvergleich macht sichtbar, welche Preisweitergabe die Marge verbessert, ohne einen möglichen Absatzrückgang auszublenden.'
  },
  'extra-wbq-volks-und-betriebswirtschaft-07': {
    wrong: [
      'Den gesamten Bedarf zum günstigsten Onlineanbieter verlagern, obwohl der Werkstoff kritisch ist und Lieferausfälle ungeprüft bleiben.',
      'Beim bisherigen Lieferanten bleiben, ohne Preis, Lieferfähigkeit oder Ausfallfolgen erneut zu vergleichen.',
      'Einen festen Jahresvorrat beim Onlineanbieter bestellen, unabhängig von Verbrauch und Lieferverzögerungen.'
    ],
    explanation: 'Der niedrigere Onlinepreis steht einer höheren Lieferunsicherheit bei einem kritischen Werkstoff gegenüber. Ein Szenariovergleich sollte Preis, Beschaffungs- und Ausfallkosten verbinden; ein Sicherheitsbestand ist nur in begründeter Höhe sinnvoll.',
    companyEffect: 'Die Abwägung schützt die Versorgung kritischer Aufträge und vermeidet zugleich unnötige Lagerbindung.'
  },
  'extra-wbq-rechnungswesen-01': {
    wrong: [
      'Der Auftrag hat nach Abzug sämtlicher periodischer Fixkosten einen Deckungsbeitrag von −4.200 €.',
      'Der Deckungsbeitrag beträgt 4.800 €, weil variable Kosten erst beim Zahlungseingang berücksichtigt werden.',
      'Der Auftrag ist genau kostendeckend, weil der Erlös die variablen Kosten übersteigt.'
    ],
    explanation: 'Der Deckungsbeitrag beträgt 4.800 € − 3.360 € = 1.440 €. Er steht zur Deckung der periodischen Fixkosten zur Verfügung; aus dem Einzelauftrag allein folgt noch kein Periodengewinn.',
    companyEffect: 'Die getrennte Betrachtung von Deckungsbeitrag und Fixkosten verhindert, dass der Auftrag fälschlich als Verlustauftrag oder als garantierter Gewinn bewertet wird.'
  },
  'extra-hsq-logistik-04': {
    wrong: [
      'Das Teil mit Rechnungsstellung als versendet buchen, obwohl es noch im Lager liegt.',
      'Die Anlieferung ohne reservierte Stellfläche annehmen und die Kapazitätsprüfung auf den Liefertag verschieben.',
      'Den Lagerwert als ausreichenden Kapazitätsnachweis verwenden, ohne Abmessungen oder belegte Fläche zu erfassen.'
    ],
    explanation: 'Das Fertigteil bleibt bis zum tatsächlichen Versand im Lager und belegt dort Fläche. Für die Anlieferungsplanung müssen belegter Platz, Versandfreigabe und der zugesagte Abholtermin zusammen betrachtet werden.',
    companyEffect: 'Eine abgestimmte Ein- und Auslagerung senkt das Risiko von Überbelegung, blockierten Wegen und verspäteter Warenannahme.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-06': {
    wrong: [
      'Mehrarbeit für alle Beschäftigten anordnen, ohne Arbeitszeit, gesundheitliche Belastung oder verfügbare Alternativen zu prüfen.',
      'Den gesamten Auftrag sofort absagen, bevor Prioritäten, Terminfolgen oder externe Kapazität geklärt sind.',
      'Die fehlenden Stunden ausschließlich durch höhere individuelle Leistungsziele ausgleichen.'
    ],
    explanation: 'Krankheitsausfälle und erkennbare Überlastung begrenzen die tatsächlich verfügbare Kapazität. Vor einer Mehrarbeit sind Arbeitsfähigkeit und Arbeitsschutz zu prüfen, Aufgaben zu priorisieren und tragfähige Alternativen mit dem Team abzustimmen.',
    companyEffect: 'Die Prüfung schützt Beschäftigte und hilft, Lieferzusagen mit der real verfügbaren und sicheren Kapazität abzugleichen.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-08': {
    wrong: [
      'Die Mitarbeiterin unabhängig von Tagesbedingungen als Ursache festlegen, weil das Problem nur an bestimmten Tagen auftritt.',
      'Ausschließlich Materialverfügbarkeit prüfen und Arbeitsverteilung sowie individuelle Rückmeldung ausblenden.',
      'Die Bewertung des gesamten Teams wegen der schwankenden Auslastung vollständig verwerfen.'
    ],
    explanation: 'Das Leistungsproblem tritt nur unter bestimmten Tagesbedingungen auf, während die individuelle Bewertung gut ist. Arbeitsverteilung, Materialverfügbarkeit und weitere Tagesbedingungen sollten gemeinsam mit konkretem Feedback geprüft werden, bevor eine Ursache zugeschrieben wird.',
    companyEffect: 'Eine ursachenbezogene Analyse reduziert Fehlbewertungen und lenkt Verbesserungen auf beeinflussbare Abläufe oder Ressourcen.'
  },
  'extra-hsq-logistik-01': {
    wrong: [
      'Nur den niedrigsten Stückpreis vergleichen und Kapitalbindung sowie Lagerkosten ausblenden.',
      'Die Mindestmenge anhand des Vorjahresverbrauchs akzeptieren, ohne den aktuellen Bedarf und das Verbrauchsrisiko zu prüfen.',
      'Den Bedarf vollständig beim zuverlässigen Lieferanten decken, ohne den Preis- und Bestandsnachteil zu bewerten.'
    ],
    explanation: 'Die geforderte Mindestmenge übersteigt den Monatsbedarf. Der Vergleich muss deshalb den günstigeren Stückpreis gegen Kapitalbindung, Lagerkosten, mögliches Überaltern und Lieferzuverlässigkeit abwägen.',
    companyEffect: 'Die Vollkostenbetrachtung verhindert, dass ein niedriger Einkaufspreis durch Überbestand oder gebundenes Kapital unwirtschaftlich wird.'
  },
  'extra-hsq-logistik-05': {
    wrong: [
      'Den Frachtpreis je Sendung vergleichen und Verspätungsfolgen sowie die tatsächliche Termintreue auslassen.',
      'Nur die termingerechte Lieferquote betrachten, ohne Mehrkosten und wirtschaftliche Folgen verspäteter Sendungen einzubeziehen.',
      'Die durchschnittliche Transportentfernung vergleichen, obwohl sie weder tatsächliche Kosten noch Lieferzuverlässigkeit abbildet.'
    ],
    explanation: 'Der günstigere Spediteur verursacht wiederholt Verspätungen. Aussagekräftig ist deshalb eine Kennzahl, die Fracht- und Verspätungskosten zusammen mit dem Anteil pünktlicher Lieferungen betrachtet.',
    companyEffect: 'Der Vergleich zeigt, ob die Einsparung beim Frachtpreis durch Terminprobleme und deren Folgekosten aufgezehrt wird.'
  },
  'extra-hsq-logistik-06': {
    wrong: [
      'Den gesamten Bedarf beim schnellen, teuren Anbieter decken, ohne kritische Aufträge oder Liquiditätsgrenzen zu priorisieren.',
      'Die Mindestmenge beim günstigen Anbieter bestellen, ohne den zusätzlichen Kapital- und Lagerbedarf zu prüfen.',
      'Den bisherigen Produktions- und Lieferplan beibehalten und erst bei einem tatsächlichen Fehlbestand reagieren.'
    ],
    explanation: 'Bei einem mehrwöchigen Ausfall müssen kritische Bedarfe und Aufträge priorisiert werden. Teilbezüge der schnellen und günstigen Alternative sind anhand von Fehlmengenkosten, Kapitalbindung und Liquidität zu vergleichen.',
    companyEffect: 'Die Disposition schützt zuerst kritische Lieferfähigkeit und begrenzt zugleich den Liquiditätsbedarf des Ersatzbezugs.'
  },
  'extra-hsq-marketing-vertrieb-04': {
    wrong: [
      'Nur die Annahmequote über alle Segmente messen und Unterschiede bei Deckungsbeitrag und Kundenbedarf ausblenden.',
      'Den Umsatz gewonnener Angebote erfassen, aber Rabatte, abgelehnte Angebote und Segmentunterschiede nicht auswerten.',
      'Die durchschnittliche Bearbeitungszeit je Angebot messen, ohne Annahmen oder wirtschaftliches Ergebnis einzubeziehen.'
    ],
    explanation: 'Die Zahl abgegebener Angebote misst nur Aktivität. Annahmequote und erzielter Deckungsbeitrag nach Segment zeigen zusätzlich, welche Angebote zu wirtschaftlich tragfähigen Aufträgen führen.',
    companyEffect: 'Die ergänzte Kennzahl hilft, Vertriebszeit und Angebotsstrategie auf Segmente mit tragfähigen Ergebnissen auszurichten.'
  },
  'extra-hsq-marketing-vertrieb-03': {
    wrong: [
      'Den Preis sofort senken, ohne zu prüfen, ob der Kunde tatsächlich wegen des Preises oder wegen des Liefertermins absagt.',
      'Den frühestmöglichen Liefertermin verbindlich versprechen, bevor Kapazität und Materialverfügbarkeit bestätigt sind.',
      'Den Kontakt erst nach einer Absage wieder aufnehmen, statt Terminpriorität und mögliche Leistungsoptionen zu erfragen.'
    ],
    explanation: 'Der Preis ist bereits wettbewerbsfähig; die wiederholte Ablehnung nennt die Lieferzeit als Grund. Der Vertrieb sollte daher klären, wie wichtig der Termin für den Kunden ist und welche beschleunigten oder alternativen Leistungsoptionen die Fertigung tatsächlich anbieten kann.',
    companyEffect: 'Die Information verhindert unnötige Preisnachlässe und ermöglicht ein Angebot, das Kundenbedarf und reale Kapazität zusammenführt.'
  },
  'extra-hsq-marketing-vertrieb-05': {
    wrong: [
      'Ein einheitliches Nutzenversprechen für alle Gruppen verwenden und nur den aggregierten Absatz vergleichen.',
      'Für alle Gruppen maximale Qualität anbieten, auch wenn Zahlungsbereitschaft, Kosten und Lieferzeit dagegen sprechen.',
      'Allen Gruppen dieselbe kürzeste Lieferzeit zusagen, ohne die Fertigungskapazität je Segment zu prüfen.'
    ],
    explanation: 'Die Gruppen unterscheiden sich in ihren Anforderungen an Qualität und Lieferzeit. Nutzenversprechen und Leistungszusage sollten daher je Segment passend ausgelegt und gegen die tatsächliche Leistungsfähigkeit geprüft werden.',
    companyEffect: 'Die Segmentierung verbessert die Passung des Angebots und reduziert das Risiko unwirtschaftlicher oder nicht erfüllbarer Zusagen.'
  },
  'extra-hsq-marketing-vertrieb-07': {
    wrong: [
      'Ausschließlich den Preisvorteil des Wettbewerbs hervorheben und den eigenen Termin- und Qualitätsnutzen nicht belegen.',
      'Die eigene Termintreue als wichtig darstellen, ohne den Bedarf dieses Kunden oder verfügbare Nachweise einzubeziehen.',
      'Den Mehrpreis mit internen Kosten begründen, ohne den daraus entstehenden Kundennutzen zu erläutern.'
    ],
    explanation: 'Der Kunde vergleicht Preis und Terminzuverlässigkeit. Der Anbieter sollte belegbare Termin- und Qualitätsvorteile genau mit dem Bedarf des Kunden verbinden und den Preis dafür transparent ausweisen.',
    companyEffect: 'Eine nutzenbezogene Preisbegründung schafft eine sachliche Vergleichsgrundlage und verhindert unbelegte Leistungsversprechen.'
  },
  'extra-hsq-marketing-vertrieb-10': {
    wrong: [
      'Das neue Segment allein wegen seiner Größe vollständig bedienen, ohne Zahlungsbereitschaft und Beschaffungsanforderungen zu prüfen.',
      'Preis und Vertriebsweg des bisherigen Segments übernehmen, ohne die Annahmen im neuen Segment zu testen.',
      'Den Markteintritt allein von der Zahl vorhandener Wettbewerber abhängig machen.'
    ],
    explanation: 'Zahlungsbereitschaft und Beschaffungsanforderungen sind noch unbekannt. Pilotangebote und Kundengespräche sollten diese Annahmen prüfen; Marge und Kapazität zeigen, ob ein Ausbau tragfähig ist.',
    companyEffect: 'Ein begrenzter Markttest verringert das Risiko, vor validierter Nachfrage Kapazität oder Marketingbudget zu binden.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-01': {
    wrong: [
      'Die verfehlten Termine sofort als mangelnde Zuverlässigkeit bewerten, ohne Ursachen und Arbeitsbedingungen zu erfragen.',
      'Die Mitarbeiterin mit Kolleginnen vergleichen und daraus ohne konkrete Erwartungen ein Leistungsurteil ableiten.',
      'Alle Aufgaben entziehen, bevor im Gespräch geklärt ist, wodurch die Terminprobleme entstehen.'
    ],
    explanation: 'Die Mitarbeiterin erreicht ihr Qualitätsziel, verfehlt aber Termine. Ein strukturiertes Gespräch hält konkrete Beobachtungen fest, erfragt Ursachen und vereinbart überprüfbare nächste Schritte, ohne die Qualitätsleistung auszublenden.',
    companyEffect: 'Konkretes Feedback macht Erwartungen und mögliche Prozesshindernisse sichtbar und ermöglicht eine überprüfbare Verbesserung.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-05': {
    wrong: [
      'Einen allgemeinen Kurs buchen, bevor geklärt ist, welche Anforderungen die angestrebte Rolle stellt.',
      'Den Mitarbeiter allein irgendeine Weiterbildung wählen lassen, ohne Lernziel oder Transfer in die Zielrolle zu vereinbaren.',
      'Die Beförderung bereits zusagen und fehlende Kompetenzen erst nach dem Rollenwechsel bestimmen.'
    ],
    explanation: 'Für die Entwicklung müssen die Anforderungen der nächsten Rolle mit dem aktuellen Kompetenzstand verglichen werden. Daraus lassen sich ein gezieltes Lernziel und passende Feedbackpunkte ableiten.',
    companyEffect: 'Die gezielte Entwicklung schließt relevante Kompetenzlücken und macht Fortschritt für Mitarbeitenden und Betrieb überprüfbar.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-10': {
    wrong: [
      'Ein einmaliges Motivationsevent durchführen, ohne Ursachen der sinkenden Motivation oder der zusätzlichen Fehler zu untersuchen.',
      'Alle Fehler ausschließlich der Umstrukturierung zuschreiben und sämtliche Änderungen ohne Ursachenprüfung zurücknehmen.',
      'Kontrollen für jede Routinehandlung verschärfen, ohne die veränderten Abläufe gemeinsam auszuwerten.'
    ],
    explanation: 'Gleichbleibende Arbeitsmenge bei sinkender Motivation und mehr Fehlern spricht dafür, Auswirkungen der Umstrukturierung genauer zu untersuchen. Das Team kann Hindernisse priorisieren, Maßnahmen testen und Rückmeldungen zur Wirkung geben.',
    companyEffect: 'Beteiligte Ursachenanalyse kann Prozessfehler und Belastungen gezielt verringern, ohne vorschnell alle Änderungen zurückzunehmen.'
  }
};
Object.assign(reviewOverrides, {
  'extra-wbq-volks-und-betriebswirtschaft-02': { explanation:'Die Nachfrage steigt bei Sonderteilen, obwohl der Branchenpreis fällt. Segment, Auftragsmix und Preiselastizität getrennt auszuwerten hilft, unterschiedliche Kundengruppen- und Wettbewerbseffekte zu erkennen.', companyEffect:'Die Analyse zeigt, ob Wachstum in einzelnen Segmenten die allgemeine Preissenkung ausgleicht und wo das Angebot angepasst werden sollte.' },
  'extra-wbq-volks-und-betriebswirtschaft-03': {
    wrong:['Nur den niedrigeren Preis wählen, ohne die Bedeutung der Lieferzeit für den Kunden zu prüfen.','Nur den schnelleren Anbieter wählen, ohne zu klären, ob der Kunde dafür einen höheren Preis zahlen würde.','Beide Angebote anhand des Durchschnittspreises vergleichen und den konkreten Kundenbedarf auslassen.'],
    explanation:'Bei technisch vergleichbaren Anbietern hängt der Kundennutzen davon ab, wie stark das Kundensegment eine kürzere Lieferzeit bewertet und welche Zahlungsbereitschaft damit verbunden ist. Diese Informationen erlauben einen passenden Preis-Leistungs-Vergleich.',
    companyEffect:'Der Betrieb kann sein Angebot auf den tatsächlichen Kundennutzen ausrichten, statt automatisch nur den Preis oder die Lieferzeit zu priorisieren.'
  },
  'extra-wbq-volks-und-betriebswirtschaft-06': {
    wrong:['Den Großkundenauftrag wegen der höheren Stückzahl annehmen, ohne Engpasszeit und verdrängte Aufträge zu bewerten.','Den Umsatz des verdrängten Auftrags als entgangenen Nutzen ansetzen, statt dessen Deckungsbeitrag zu vergleichen.','Die längeren Zahlungsziele ausblenden, weil der Auftrag einen positiven Stückdeckungsbeitrag erzielt.'],
    explanation:'Der niedrigere Preis muss gegen den Beitrag verdrängter Aufträge, die gebundene Liquidität durch längere Zahlungsziele und die knappe Engpasszeit gerechnet werden.',
    companyEffect:'Die gemeinsame Betrachtung verhindert, dass hoher Umsatz auf Kosten profitablerer Aufträge und der Zahlungsfähigkeit angenommen wird.'
  },
  'extra-wbq-rechnungswesen-03': {
    wrong:['Den gezählten Bestand sofort buchen, obwohl während der Zählung noch Entnahmen liefen.','Die Differenz als Zahlungsausfall behandeln und beim Lieferanten reklamieren.','Nur den Gesamtwert des Lagers vergleichen und Bewegungsbelege je Artikel auslassen.'],
    explanation:'Ungebuchte Entnahmen können die Differenz zwischen Lagerkarte und Zählung erklären. Zählung und Bewegungsbelege müssen auf denselben Stichtag abgegrenzt und je Artikel abgestimmt werden, bevor der Bestand korrigiert wird.',
    companyEffect:'Die Abstimmung verhindert unbegründete Bestandsbuchungen und macht Zähl-, Buchungs- oder Materialflussfehler nachvollziehbar.'
  },
  'extra-wbq-rechnungswesen-05': {
    wrong:['Den gesamten Maschinenkauf zusätzlich zu Wartung und Energie vollständig dem Anschaffungsjahr als laufenden Aufwand zurechnen.','Wartung und Energie zum Anlagenbuchwert addieren und zusammen über mehrere Jahre abschreiben.','Die Maschine nur in Perioden mit einer erneuten Auszahlung kostenrechnerisch berücksichtigen.'],
    explanation:'Die Maschine wird über mehrere Jahre genutzt; ihr Werteverzehr ist daher über diese Nutzungsperioden zu verteilen. Wartung und Energie sind laufende Kosten und werden getrennt nach ihrer Periode beziehungsweise Kostenverursachung erfasst.',
    companyEffect:'Die Trennung macht Anschaffungsnutzung und laufenden Betrieb in Perioden- und Auftragskalkulation vergleichbar.'
  },
  'extra-wbq-rechnungswesen-06': {
    wrong:['Produkt A nur wegen seines höheren Stückdeckungsbeitrags vor Produkt B einplanen.','Produkt B nur wegen des geringeren Zeitbedarfs je Stück bevorzugen, ohne den Deckungsbeitrag zu berücksichtigen.','Die knappe Maschinenzeit gleichmäßig auf beide Linien verteilen, unabhängig von Nachfrage und Liefertermin.'],
    explanation:'Die Maschine ist der Engpass und Produkt A bindet doppelt so viele Engpassminuten. Der Deckungsbeitrag je Engpassminute ist deshalb der passende Ausgangspunkt; Liefertermine und Nachfrage sind zusätzlich zu beachten.',
    companyEffect:'Die Reihenfolge nutzt knappe Maschinenzeit wirtschaftlich, ohne Lieferzusagen oder Absatzchancen auszublenden.'
  },
  'extra-wbq-rechnungswesen-09': {
    wrong:['Den vereinbarten Auftragspreis als ausreichend behandeln, weil der Auftrag bereits abgeschlossen ist.','Alle Mehrkosten pauschal dem Materialpreis zuordnen, obwohl Rüstkosten und Eilfracht verschiedene Ursachen haben.','Künftige Angebote automatisch um denselben Prozentsatz erhöhen, ohne Ursache und Wiederholbarkeit zu prüfen.'],
    explanation:'Die Nachkalkulation sollte Rüstkosten und Eilfracht nach Ursachen zerlegen. Erst danach lässt sich entscheiden, welche Angebotsparameter oder Prozessannahmen für vergleichbare Folgeaufträge angepasst werden müssen.',
    companyEffect:'Ursachenbezogene Rückmeldungen verbessern künftige Angebote und vermeiden pauschale Preisänderungen ohne Kostennachweis.'
  },
  'extra-wbq-unternehmensfuehrung-01': {
    wrong:['Die Stückzahl weiter als alleiniges Ziel verwenden und Ausschuss nur am Periodenende melden.','Ausschuss ergänzen, aber Zwischenbestand und Liefertreue weiterhin aus der Zielsteuerung auslassen.','Nur Umsatz als Zielgröße verwenden, ohne Qualität und Termintreue einzubeziehen.'],
    explanation:'Ein reines Stückzahlziel belohnt Menge, obwohl zugleich Ausschuss und Zwischenbestände steigen. Qualität, Bestand und Liefertreue ergänzen die Mengenkennzahl um die für Kunden und Ressourceneinsatz nötigen Ergebnisse.',
    companyEffect:'Die ausgewogene Zielsetzung senkt Überproduktion und richtet die Fertigung stärker auf verkaufsfähige, termingerecht benötigte Teile aus.'
  },
  'extra-wbq-unternehmensfuehrung-04': {
    wrong:['Die Kennzahl unverändert verwenden und Abweichungen nachträglich manuell erklären.','Nur das Versanddatum messen, obwohl die Abteilungen unterschiedliche bestätigte Bezugstermine nutzen.','Die verschiedenen Definitionen getrennt fortführen und ihre Werte anschließend mitteln.'],
    explanation:'Unterschiedliche Definitionen von „termingerecht“ machen Abteilungswerte unvergleichbar. Kennzahl, Bezugsdatum und Datenquelle müssen daher gemeinsam vereinbart und dokumentiert werden.',
    companyEffect:'Einheitliche Messregeln ermöglichen vergleichbare Terminberichte und faire Leistungsbewertungen.'
  },
  'extra-wbq-unternehmensfuehrung-07': {
    wrong:['Nur die erwartete Produktivitätssteigerung bewerten und Qualifizierungs- sowie Personalkosten später prüfen.','Arbeitsplätze unverändert voraussetzen und Qualifizierung erst nach Problemen im Betrieb einplanen.','Die Investition ausschließlich nach dem Anschaffungspreis auswählen.'],
    explanation:'Die Investition kann Prozesse und Aufgaben verändern und neue Qualifikationen erfordern. Wirtschaftlichkeit, Prozessrisiken und Personalfolgen müssen vor der Umsetzung gemeinsam bewertet werden.',
    companyEffect:'Die gemeinsame Prüfung macht Umstellungskosten und Qualifizierungsbedarf planbar und verringert Anlaufprobleme.'
  },
  'extra-hsq-betriebliches-management-01': {
    wrong:['Produktivität als alleinige Erfolgskennzahl beibehalten, solange das Mengen- oder Stückziel erreicht wird.','Termintreue nur bei verspäteten Aufträgen auswerten und Qualität sowie Lagerbestand aus der Steuerung auslassen.','Verspätungen nur durch höhere Sicherheitsbestände absichern, ohne Ursache und Umfang zu messen.'],
    explanation:'Ein Bereich kann viele Teile je Arbeitsstunde herstellen und dennoch Kundentermine verfehlen. Produktivität sollte deshalb gemeinsam mit Termintreue, Qualität und Bestand betrachtet werden.',
    companyEffect:'Die Kombination verhindert, dass ein Produktivitätsgewinn durch verspätete, fehlerhafte oder unnötig eingelagerte Ware erkauft wird.'
  },
  'extra-hsq-betriebliches-management-02': {
    wrong:['Einen einheitlichen Bonus sofort einführen, bevor Austrittsgründe oder betroffene Beschäftigtengruppen bekannt sind.','Wenige Einzelfälle als repräsentative Erklärung für die gesamte Fluktuation verwenden.','Die Austrittsquote bis zum Jahresende nicht weiter beobachten, weil Gründe noch fehlen.'],
    explanation:'Da Austrittsgründe nicht erfasst werden, fehlt die Grundlage, eine geeignete Bindungsmaßnahme auszuwählen. Daten nach relevanten Gruppen und strukturierte Austrittsgespräche helfen, Ursachen systematisch zu erkennen.',
    companyEffect:'Eine bessere Datenbasis lenkt Maßnahmen auf tatsächlich beeinflussbare Bindungsursachen, statt Budget ohne Diagnose einzusetzen.'
  },
  'extra-hsq-betriebliches-management-04': {
    wrong:['Den aktuellen Wert direkt mit dem Ziel vergleichen, ohne eine vergleichbare Ausgangsperiode festzulegen.','Die Ausgangsperiode nachträglich auswählen, in der das Ergebnis besonders günstig aussieht.','Die Definition je Abteilung ändern und die Werte anschließend zu einem Mittelwert zusammenfassen.'],
    explanation:'Ein Zielwert lässt sich nur aussagekräftig beurteilen, wenn der Vergleich auf einer vorab festgelegten, gleich definierten Ausgangsperiode beruht.',
    companyEffect:'Eine nachvollziehbare Baseline macht Fortschritt prüfbar und verhindert geschönte oder nicht vergleichbare Aussagen.'
  },
  'extra-hsq-betriebliches-management-05': {
    wrong:['Die zweite Schicht dauerhaft freigeben, ohne Personalbedarf und kritische Fachrollen zu prüfen.','Die Schicht allein nach erwartetem Absatz entscheiden und Engpassfunktionen unberücksichtigt lassen.','Die Personalbeschaffung erst nach dem Pilotversuch beginnen, auch wenn die Besetzung Vorlaufzeit benötigt.'],
    explanation:'Ein Schichtpilot muss den erwarteten Kernbedarf und die tatsächlich verfügbaren Fachkräfte zusammenbringen. Personalgewinnung und Kapazitätsrisiken sind parallel zu planen, nicht erst nach dem Start zu betrachten.',
    companyEffect:'Die Planung senkt das Risiko, Nachfrage zuzusagen, bevor ausreichende Besetzung und Fachkompetenz vorhanden sind.'
  },
  'extra-hsq-betriebliches-management-06': {
    wrong:['Die günstigere Lösung allein nach der Investitionssumme wählen und Qualifizierungs- sowie Umstellungskosten auslassen.','Die teurere Lösung allein wegen des geringeren Veränderungsrisikos wählen, ohne die Lebenszykluskosten zu vergleichen.','Qualifizierungsbedarf pauschal als einmaligen Aufwand behandeln und Sensitivitäten der Produktivitätsannahme ignorieren.'],
    explanation:'Die erwartete Effizienzsteigerung muss den Schulungs- und Umstellungsaufwand sowie Folgen für Beschäftigte überwiegen. Eine Investitionsvorlage sollte diese Kosten und Risiken vor der Freigabe ausweisen.',
    companyEffect:'Die Abwägung verhindert, dass Einsparungen ohne nötige Qualifizierung oder mit nicht eingeplanten Einführungskosten angenommen werden.'
  },
  'extra-hsq-betriebliches-management-07': {
    wrong:['Die Vollauslastung als ausreichende Begründung ansehen und Nutzen sowie Risiko nicht quantifizieren.','Nur den erwarteten Umsatz anführen, ohne Investitionskosten und mögliche Nachfrageabweichung einzubeziehen.','Das Projekt wegen jeder Unsicherheit ablehnen, ohne Szenarien oder begrenzte Tests zu prüfen.'],
    explanation:'Eine positive Basiserwartung allein belegt nicht, dass ein Projekt unter abweichender Nachfrage wirtschaftlich bleibt. Annahmen, Bandbreiten und die Wirkung auf Ergebnis und Liquidität sind gemeinsam zu testen.',
    companyEffect:'Die Szenarioprüfung zeigt, ob der Betrieb auch bei schlechterem Verlauf zahlungs- und handlungsfähig bleibt.'
  },
  'extra-hsq-betriebliches-management-09': {
    wrong:['Die neue Kennzahl als Verbesserung melden, ohne die geänderte Erfassungsmethode zu berücksichtigen.','Die alte Messreihe löschen und ausschließlich die Werte nach der neuen Methode berichten.','Die Kennzahl wegen der Definitionsänderung dauerhaft aus der Steuerung nehmen.'],
    explanation:'Wenn sich gleichzeitig die Erfassungsmethode ändert, können Werte vor und nach der Umorganisation nicht ohne Weiteres verglichen werden. Erst ist die Vergleichbarkeit herzustellen, dann kann eine Prozesswirkung beurteilt werden.',
    companyEffect:'Die Prüfung trennt tatsächliche Verbesserung von einem bloßen Messartefakt und schützt die Steuerungsentscheidung.'
  },
  'extra-hsq-betriebliches-management-10': {
    wrong:['Die volle Kapazität sofort aufbauen, damit das Angebot selbst Nachfrage erzeugt.','Den Markteintritt vollständig ausschließen, solange keine sichere Absatzprognose vorliegt.','Anfangskosten auf spätere Perioden verschieben, damit der erste Test wirtschaftlicher erscheint.'],
    explanation:'Bei unsicherer Nachfrage und hohen Anfangskosten sollte der Markteintritt schrittweise mit überprüfbaren Annahmen, Abbruchkriterien und Lernschleifen erprobt werden.',
    companyEffect:'Ein begrenzter Pilot begrenzt das Verlustrisiko und liefert Informationen für eine spätere Ausbauentscheidung.'
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-05': {
    wrong:['Die gesamten Stückkosten unabhängig von der Ausbringungsmenge auf jede Einheit umlegen.','Nur variable Kosten berücksichtigen, obwohl fixe Kapazitätskosten anfallen.','Kapazitätskosten nach Umsatz verteilen, auch wenn Produkte unterschiedlich viele Maschinenstunden benötigen.'],
    explanation:'Stückkosten hängen davon ab, wie fixe Kapazitätskosten und variable Kosten auf die geplante Beschäftigung verteilt werden. Die Kostenrechnung muss deshalb eine passende Beschäftigungs- und Bezugsbasis verwenden.',
    companyEffect:'Eine passende Basis verbessert die Stückkalkulation und verhindert falsche Vergleiche bei unterschiedlicher Auslastung.'
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-08': {
    wrong:['Einen einheitlichen Zuschlag auf den Umsatz anwenden, obwohl Produkte Prozesse unterschiedlich nutzen.','Gemeinkosten gleichmäßig je Stück verteilen, obwohl Losgrößen und Prüfaufwand abweichen.','Nur Materialkosten als Zuschlagsbasis nehmen, ohne den verursachenden Tätigkeiten nachzugehen.'],
    explanation:'Ein pauschaler Zuschlag bildet unterschiedliche Prozess- und Prüfaufwände oft nicht angemessen ab. Mögliche Bezugsgrößen oder Prozesskostentreiber sollten geprüft und ihre Auswirkungen auf die Produktkalkulation verglichen werden.',
    companyEffect:'Die differenziertere Zuordnung verringert Quersubventionierungen zwischen Produkten mit verschiedenem Gemeinkostenbedarf.'
  },
  'extra-hsq-logistik-03': {
    wrong:['Zählwerte unmittelbar buchen, obwohl während der Inventur noch Material entnommen oder zugebucht wird.','Alle Differenzen pauschal auf den Artikel mit dem höchsten Wert buchen.','Nur den Gesamtwert des Lagers prüfen und Artikelbewegungen sowie Zählzeitpunkte ignorieren.'],
    explanation:'Laufende Entnahmen können die Zählung mit dem Buchbestand zeitlich auseinanderlaufen lassen. Bewegungszeitpunkte müssen abgegrenzt und Abweichungen je Artikel verfolgt werden, bevor die Ursache bewertet wird.',
    companyEffect:'Die Abstimmung schützt die Bestandsgenauigkeit und zeigt, ob Buchungs-, Zähl- oder Materialflussfehler vorliegen.'
  },
  'extra-hsq-logistik-10': {
    wrong:['Nur Frachtkosten je Paket vergleichen und Beschädigungen sowie Retouren als Einzelfälle ausklammern.','Die Zahl versandter Pakete maximieren, auch wenn ein Teil beschädigt zurückkommt.','Verpackungskosten senken, ohne Schadenquote oder Kundenzufriedenheit einzubeziehen.'],
    explanation:'Niedrige Stückkosten sind kein Vorteil, wenn Verpackungsschäden und Retouren zunehmen. Prozesskosten und Servicequalität je erfolgreich zugestellter Einheit bilden das tatsächlich erreichte Ergebnis ab.',
    companyEffect:'Die Kennzahl macht sichtbar, ob Schäden und erneute Zustellungen den scheinbaren Kostenvorteil aufzehren.'
  },
  'extra-hsq-marketing-vertrieb-02': {
    wrong:['Den Rabatt am Deckungsbeitrag eines Standardloses ausrichten, obwohl das Sonderlos zusätzliche Rüstkosten verursacht.','Nur Materialkosten berücksichtigen und Betreuungs-, Rüst- und Lieferaufwand des Kleinloses auslassen.','Den Rabatt gewähren, um Monatsumsatz zu sichern, ohne Kundenwert oder künftige Gegenleistung zu prüfen.'],
    explanation:'Kleine Sonderlose verursachen häufig zusätzliche Rüst-, Betreuungs- und Lieferkosten. Vor dem Rabatt sind diese auftragsbezogenen Kosten und der längerfristige Kundenwert zu bewerten, statt einen Standardauftrag als Maßstab zu verwenden.',
    companyEffect:'Die Prüfung schützt den Deckungsbeitrag und ermöglicht, einen Rabatt an eine wirtschaftliche Gegenleistung zu knüpfen.'
  },
  'extra-hsq-marketing-vertrieb-06': {
    wrong:['Den Großauftrag wegen seines Gesamtumsatzes bevorzugen, ohne verdrängte kleinere Aufträge zu bewerten.','Kleinere Aufträge stets vorziehen, ohne Deckungsbeitrag, Terminrisiko oder Kundenwert zu vergleichen.','Nur den Stückdeckungsbeitrag des Großauftrags betrachten und Engpasszeit sowie Zahlungsziele auslassen.'],
    explanation:'Der Großauftrag bindet knappe Werkstattzeit und verdrängt kleinere, kurzfristig lieferbare Anfragen. Deckungsbeitrag je Engpasszeit, Opportunitätskosten, Zahlungsrisiko und Kundenbeziehung sind zusammen abzuwägen.',
    companyEffect:'Die Bewertung zeigt, ob der Großauftrag den entgangenen Beitrag und die zusätzliche Liquiditätsbindung tatsächlich aufwiegt.'
  },
  'extra-hsq-marketing-vertrieb-08': {
    wrong:['Den Gesamtabsatz während der Aktion vergleichen und Folgekäufe sowie Rabattkosten auslassen.','Alle Neukunden als dauerhaft wertvoll behandeln, ohne Wiederkauf und Deckungsbeitrag zu prüfen.','Die Marge nach der Aktion betrachten, aber nicht ermitteln, welche Kundengruppe Folgekäufe tätigt.'],
    explanation:'Der höhere Absatz kann kurzfristig durch den Rabatt entstanden sein. Kohorten und Wiederkaufraten zeigen, ob Neukunden zurückkehren; der Deckungsbeitrag nach Rabatt zeigt, ob dieses Verhalten wirtschaftlich tragfähig ist.',
    companyEffect:'Die Auswertung trennt einmaligen Aktionsabsatz von dauerhaft profitablem Kundenverhalten.'
  },
  'extra-hsq-marketing-vertrieb-09': {
    wrong:['Nicht erfüllbare Anfragen erst nach Angebotsabgabe ablehnen, statt Kapazität vorab abzugleichen.','Die Lieferzeit bei allen Angeboten pauschal verlängern, ohne Auftragslage und Qualifikation zu prüfen.','Den Vertrieb nur nach Angebotsmenge bewerten und Fertigungsrückmeldungen von der Freigabe trennen.'],
    explanation:'Vor der Angebotsfreigabe sind benötigte Fähigkeiten und verfügbare Kapazität mit dem Kundenbedarf abzugleichen. So erfährt der Kunde vor einer Zusage, ob der Auftrag realistisch erfüllt werden kann.',
    companyEffect:'Der Vorabcheck reduziert Fehlzusagen, Nachverhandlungen und Schäden an der Lieferzuverlässigkeit.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-03': {
    wrong:['Die Person wegen ihrer Erfahrung sofort allein einsetzen und die Qualifikation später nachtragen.','Die Maschine für das ganze Team freigeben, ohne Qualifikation oder sichere Einweisung zu prüfen.','Den Auftrag starten und den Qualifikationsnachweis erst nach einer Abweichung verlangen.'],
    explanation:'Vor dem eigenständigen Einsatz muss für die konkrete Maschine die erforderliche Fachkenntnis nachgewiesen und eine sichere Einweisung erfolgt sein. Allgemeine Berufserfahrung ersetzt diesen Nachweis nicht.',
    companyEffect:'Die Vorabprüfung verringert Sicherheits- und Qualitätsrisiken sowie Schäden oder Stillstand durch unsachgemäße Bedienung.'
  },
  'extra-hsq-fuehrung-zusammenarbeit-09': {
    wrong:['Nur eine Frist nennen und trotz übertragener Verantwortung alle Sachentscheidungen selbst vorbehalten.','Die Reklamation vollständig zurücknehmen und jede Entscheidung selbst treffen.','Verantwortung übertragen und Rückfragen oder Eskalationen grundsätzlich untersagen.'],
    explanation:'Eine kritische Reklamation ist nur verantwortbar delegiert, wenn Ergebnisrahmen und Entscheidungsbefugnisse klar sind. Fristen und Eskalationsschwellen bestimmen, wann selbst entschieden und wann zurückgemeldet werden soll.',
    companyEffect:'Klare Befugnisse beschleunigen die Kundenreaktion und halten riskante oder notwendige Führungsentscheidungen kontrollierbar.'
  }
});
Object.assign(reviewOverrides, {
  'extra-hsq-betriebliches-management-05': {
    explanation:'Der Ausfall eines Lieferanten verlangt einen abgestuften Notfallplan: kritische Bedarfe, verfügbare Alternativen, Mindestmengen, Vorlaufzeiten und Liquidität müssen zusammen bewertet werden.',
    companyEffect:'Die Priorisierung erhält zuerst die Versorgung kritischer Aufträge und begrenzt unnötige Kapitalbindung bei Ersatzbeschaffung.'
  },
  'extra-hsq-betriebliches-management-07': {
    wrong:['Jeden Bereich weiter ausschließlich an lokalen Einsparungen messen, auch wenn dadurch Lieferfähigkeit verloren geht.','Alle Bereichsziele streichen und die Umsetzung ohne Verantwortliche oder Kennzahlen laufen lassen.','Die Verantwortung für die gemeinsame Lieferfähigkeit allein der Versandabteilung übertragen.'],
    explanation:'Die Strategie scheitert, wenn Bereichskennzahlen weiter gegeneinander arbeiten. Gemeinsame Ergebnisgrößen und ein verbindlicher Eskalationsweg richten Teilziele auf die geforderte Lieferfähigkeit aus.',
    companyEffect:'Abgestimmte Kennzahlen machen Zielkonflikte sichtbar und helfen, die bereichsübergreifende Lieferleistung gemeinsam zu verbessern.'
  },
  'extra-hsq-logistik-07': {
    explanation:'Niedriger Bestandswert bedeutet nicht, dass Stellfläche frei ist. Umschlagshäufigkeit und belegte Fläche je Artikel zeigen, welche Langsamdreher Plätze binden und welche Dispositions- oder Zonenanpassung sinnvoll ist.',
    companyEffect:'Die Auswertung setzt Lagerfläche gezielter ein und kann Wege, Überbelegung und unnötige Bestände reduzieren.'
  },
  'extra-hsq-logistik-08': {
    explanation:'Just-in-time setzt verlässliche Lieferzeiten und stabile Abläufe voraus. Bei häufigen Unterbrechungen muss der Betrieb zuerst Ursachen und Lieferfähigkeit verbessern oder einen anhand des Risikos bemessenen Puffer begründen.',
    companyEffect:'Die Abwägung senkt Stillstandsrisiken, ohne durch einen pauschal überhöhten Bestand unnötig Kapital und Fläche zu binden.'
  },
  'extra-hsq-logistik-09': {
    wrong:['Chargen ohne Kennzeichnung zusammenführen, sobald die Materialart gleich erscheint.','Das Material einsetzen und Qualitätsnachweise nur bei einer späteren Reklamation anfordern.','Den Lieferpreis als ausreichenden Beleg für Identität und Freigabe des Materials behandeln.'],
    explanation:'Vor der Freigabe müssen Materialidentität und Chargenbezug mit den geforderten Qualitätsnachweisen abgeglichen werden. Nur so lässt sich später feststellen, welches Material in welchem Auftrag verwendet wurde.',
    companyEffect:'Die Rückverfolgbarkeit erleichtert Qualitätsfreigabe, Ursachenanalyse und gezielte Sperrung einer betroffenen Charge.'
  },
  'extra-wbq-unternehmensfuehrung-06': {
    wrong:['Alle drei Ziele gleichrangig verfolgen, obwohl verfügbare Kapazität und Meilensteine kollidieren.','Den Endtermin priorisieren und Qualitätsanforderungen ohne dokumentierte Abstimmung absenken.','Die Verantwortung für den Zielkonflikt an das Team geben, ohne Entscheidungsrahmen oder Prioritäten festzulegen.'],
    explanation:'Bei begrenzter Kapazität muss die Projektleitung Zielprioritäten, Abhängigkeiten und Meilensteine gemeinsam festlegen und Änderungen transparent entscheiden.',
    companyEffect:'Ein klarer Zielrahmen ermöglicht es, knappe Ressourcen auf die vereinbarten Ergebnisse auszurichten und Abweichungen früh zu steuern.'
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-02': {
    explanation:'Die Eigenkapitalquote setzt Eigenkapital ins Verhältnis zur Bilanzsumme. Eine Investition kann das Anlagevermögen erhöhen und die Quote verändern; für die Beurteilung sind Bilanzstruktur und absolute Werte gemeinsam zu betrachten.',
    companyEffect:'Die Einordnung verhindert, dass eine Kennzahlenänderung allein als Beweis für Insolvenz oder Unwirtschaftlichkeit missverstanden wird.'
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-04': {
    explanation:'Verglichen werden die zeitlichen Ein- und Auszahlungen einschließlich Gebühren und Tilgung. Gesamtkosten, Laufzeit und monatliche Liquiditätsbelastung zeigen gemeinsam, welches Angebot zum Finanzierungsbedarf passt.',
    companyEffect:'Ein Zahlungsstromvergleich macht Preis und Liquiditätswirkung der Angebote über die gesamte Laufzeit sichtbar.'
  },
  'extra-wbq-volks-und-betriebswirtschaft-08': {
    scenario:'Die Zentralbank erhöht den Leitzins; ein kleiner Betrieb plant eine fremdfinanzierte Maschine mit variabel verzinstem Darlehen und erwartet zugleich mehr Nachfrage.',
    explanation:'Bei einem variabel verzinsten Darlehen kann ein höheres Zinsniveau den Kapitaldienst erhöhen. Gemeinsam mit Nachfrage- und Auslastungsszenarien ist deshalb zu prüfen, ob die Investition auch bei ungünstiger Entwicklung finanzierbar bleibt.'
  },
  'extra-wbq-recht-und-steuern-07': {
    wrong:['Den Fehler intern dokumentieren und die abgegebene Erklärung unverändert lassen.','Den Betrag ohne Prüfung in einer späteren Steuerperiode gegen andere Einnahmen verrechnen.','Zunächst nur die Buchung ändern und den betroffenen Erklärungszeitraum nicht ermitteln.'],
    explanation:'Der Betrieb sollte Sachverhalt, Betrag und betroffenen Zeitraum nachvollziehbar prüfen und fachkundige steuerliche Unterstützung zur möglichen Berichtigung einholen. Eine interne Buchungskorrektur ersetzt keine erforderliche Erklärungskorrektur.',
    companyEffect:'Eine zeitnahe Prüfung begrenzt Folgefehler und schafft eine nachvollziehbare Grundlage für die erforderlichen steuerlichen Schritte.'
  },
  'extra-hsq-betriebliches-management-10': {
    explanation:'Bei unsicherer Nachfrage sollte der Betrieb die Markteintrittsannahmen mit einem begrenzten Pilot, messbaren Kriterien und einem Abbruch- oder Ausbaupunkt prüfen. So werden Risiko und gebundene Ressourcen kontrollierbar.',
    companyEffect:'Ein gestufter Test liefert Markterkenntnisse, bevor der Betrieb größere Kapazitäten oder Budgets dauerhaft bindet.'
  },
  'extra-wbq-rechnungswesen-02': {
    scenario:'Eine Leistung wird im Dezember vollständig erbracht und im selben Monat abgerechnet; der Kunde zahlt im Januar. Der Betrieb erstellt einen Monatsabschluss.',
    explanation:'Die Leistung ist im Dezember erbracht und wird nach der zugrunde gelegten Abgrenzung dort als Erlös und Forderung erfasst. Der Zahlungseingang im Januar verändert den Zahlungsmittelbestand und gleicht die Forderung aus.'
  },
  'extra-wbq-volks-und-betriebswirtschaft-04': { companyEffect:'Die Zuteilung nach entgangenem Deckungsbeitrag hilft, knappe Maschinenzeit dort einzusetzen, wo sie den höchsten wirtschaftlichen Beitrag unter den aktuellen Nachfragebedingungen ermöglicht.' },
  'extra-wbq-volks-und-betriebswirtschaft-05': {
    explanation:'Ein Nachfragerückgang bei langlebigen Investitionsgütern kann mit zurückgestellten Investitionen zusammenhängen. Erwartungen, Finanzierungskosten und Auftragslage der gewerblichen Abnehmer sind deshalb gemeinsam zu untersuchen.',
    companyEffect:'Die Branchenanalyse hilft, Nachfrageänderungen einzuordnen und Angebots- oder Kapazitätsentscheidungen an den tatsächlichen Investitionsbedarf anzupassen.'
  },
  'extra-wbq-volks-und-betriebswirtschaft-09': { companyEffect:'Die gemeinsame Bewertung zeigt, ob zusätzliche Varianten den gewonnenen Kundennutzen und Auftragseingang trotz höherer Komplexität wirtschaftlich tragen.' },
  'extra-wbq-volks-und-betriebswirtschaft-10': { companyEffect:'Die getrennte Betrachtung der Regionen ermöglicht, Preis, Kapazität und Vertriebsaufwand an den jeweiligen Bedarf und die Zahlungsbereitschaft anzupassen.' },
  'extra-wbq-unternehmensfuehrung-10': {
    explanation:'Längerfristige Wirkung zeigt sich nicht nur im unmittelbaren Ergebnis. Beschwerden, wiederkehrende Abweichungen und Rückfallmuster sollten über einen festgelegten Zeitraum beobachtet und mit den strategischen Zielen abgeglichen werden.',
    companyEffect:'Die längerfristige Beobachtung zeigt, ob die Maßnahme dauerhaft wirkt oder ob Ursachen erneut auftreten und nachgesteuert werden muss.'
  },
  'extra-wbq-rechnungswesen-08': {
    wrong:['Die bisherigen Fixkosten vollständig als künftig vermeidbare Kosten der Eigenfertigung behandeln.','Den historischen Kaufpreis der Maschine als zusätzliche Auszahlung der Eigenfertigungsalternative ansetzen.','Nur den Fremdbezugspreis berücksichtigen und Kapazitäts- oder Qualitätsfolgen der Eigenfertigung auslassen.']
  },
  'extra-wbq-recht-und-steuern-06': {
    wrong:['Die Zusatzleistung ohne dokumentierte Einigung ausführen und den Preis später einseitig festlegen.','Mündliche Änderungswünsche nicht festhalten, weil nur der ursprüngliche Vertrag relevant sei.','Den Zusatzpreis automatisch als Bestandteil des ursprünglichen Gesamtpreises buchen.']
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-03': {
    wrong:['Das Budget pauschal erhöhen und die Ursache der Abweichung nicht ermitteln.','Nur bereits bezahlte Rechnungen berichten und die Prognose bis Projektende unverändert lassen.','Die Kostenüberschreitung mit erwarteten Einsparungen aus einem anderen Projekt verrechnen.']
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-06': {
    wrong:['Den Kapitalwert als sichere Rendite behandeln und Absatz- sowie Energieannahmen nicht überprüfen.','Nur den optimistischen Absatzfall für die Freigabe verwenden.','Jede Investition mit unsicheren Annahmen unabhängig von Szenarien ablehnen.']
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-07': {
    wrong:['Den bilanziellen Gewinn als verfügbares Bankguthaben für die nächsten Fälligkeiten behandeln.','Eine Investition genehmigen, sobald der Jahresüberschuss positiv ist.','Alle Lieferanten später bezahlen, ohne Zahlungsziele oder Folgen zu prüfen.']
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-10': {
    wrong:['Die gesamte Kostenüberschreitung als Ineffizienz bewerten, ohne Beschäftigungsgrad und Mengenwirkung zu prüfen.','Die höhere Ausbringung automatisch als Beleg für Wirtschaftlichkeit werten.','Mehrkosten mit Umsatzanstieg verrechnen, ohne Preis-, Mengen- und Verbrauchseffekte zu trennen.']
  },
  'extra-hsq-betriebliches-management-03': {
    explanation:'Eilaufträge treffen auf ungenutzte Kapazität. Vertrieb, Beschaffung und Fertigung sollten deshalb kurzfristig Auftragstermine, Materialverfügbarkeit und freie Kapazität gemeinsam abstimmen, statt nur den Absatzplan zu erhöhen.',
    companyEffect:'Die abgestimmte Planung nutzt freie Kapazität für dringende Nachfrage und vermeidet Zusagen, die wegen fehlenden Materials nicht erfüllbar sind.'
  },
  'extra-hsq-betriebliches-management-08': {
    companyEffect:'Die Priorisierung lenkt knappe Personal-, Material- und Finanzmittel auf die Aufträge mit dem besten Verhältnis aus Beitrag, Lieferfähigkeit und Liquiditätsbedarf.'
  },
  'extra-hsq-betriebliches-management-05': {
    wrong:['Nur beim bisherigen Lieferanten bleiben und kritische Bedarfe ohne Prüfung der Ausfallfolgen weiter einplanen.','Den gesamten Jahresbedarf beim günstigsten Anbieter bestellen, obwohl Mindestmenge und Liquidität den Betrieb überfordern.','Kundenaufträge unverändert bestätigen und Ersatzbeschaffung erst nach einem tatsächlichen Lieferausfall beginnen.']
  },
  'extra-hsq-betriebliches-management-10': {
    wrong:['Vor dem Markttest dauerhaft Personal und Maschinenkapazität aufbauen, ohne Nachfragekriterien festzulegen.','Einzelne positive Kundenreaktionen als ausreichenden Nachweis für sichere Nachfrage behandeln.','Den Markteintritt allein wegen vorhandener Konkurrenz verwerfen, ohne Kundennutzen oder Kosten zu prüfen.']
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-03': {
    companyEffect:'Die aktualisierte Endprognose zeigt früh, ob Budget oder Projektumfang angepasst werden müssen, und macht die Ursachen für künftige Investitionsentscheidungen nutzbar.'
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-09': {
    explanation:'Die Eigenmittel werden auch für saisonale Materialeinkäufe gebraucht. Daher sind Investitionsauszahlung, Zeitpunkt des Materialbedarfs, verfügbare Reserve und Gesamtkosten einer alternativen Finanzierung gemeinsam zu vergleichen.',
    companyEffect:'Der Vergleich schützt die Materialversorgung und verhindert, dass eine heute finanzierbare Investition später eine Liquiditätslücke im saisonalen Einkauf auslöst.'
  },
  'extra-hsq-logistik-02': {
    explanation:'Bei langen Wiederbeschaffungszeiten und schwankendem Bedarf muss der Betrieb Verbrauchsdaten und Lieferzeitstreuung auswerten. Der Sicherheitsbestand soll das Ausfallrisiko angemessen abdecken, ohne einen nicht belegten Verbrauchswert zu unterstellen.'
  },
  'extra-wbq-recht-und-steuern-06': {
    explanation:'Für einen späteren Mehrpreisstreit sollte festgehalten werden, welche Zusatzleistung gewünscht, angeboten und zu welchem Preis angenommen wurde. Eine einseitige nachträgliche Preisfestlegung ersetzt keine Vereinbarung; die konkrete Vertragslage bleibt maßgeblich.',
    companyEffect:'Zeitnahe Dokumentation von Änderungswunsch, Leistungsumfang und Preis schafft einen nachvollziehbaren Nachweis und verringert Streit über den vereinbarten Auftrag.',
    sourceRef:'MAP-WBQ-RT; BGB § 311 Abs. 1 https://www.gesetze-im-internet.de/bgb/__311.html; BGB §§ 145–150 https://www.gesetze-im-internet.de/bgb/__145.html https://www.gesetze-im-internet.de/bgb/__146.html https://www.gesetze-im-internet.de/bgb/__147.html https://www.gesetze-im-internet.de/bgb/__148.html https://www.gesetze-im-internet.de/bgb/__149.html https://www.gesetze-im-internet.de/bgb/__150.html'
  },
  'extra-wbq-recht-und-steuern-08': {
    explanation:'Bei AGB gegenüber einem Unternehmer gelten die §§ 308 und 309 nicht unmittelbar; die Inhaltskontrolle richtet sich insbesondere nach § 307 BGB unter Berücksichtigung der Besonderheiten des Handelsverkehrs (§ 310 Abs. 1 BGB). Ein pauschaler Ausschluss auch für grobe Fahrlässigkeit ist daher anhand von Wortlaut, Vertrag und gesetzlichen Grenzen zu prüfen, nicht allein wegen der Unterschrift als wirksam anzusehen.',
    companyEffect:'Die Prüfung verhindert, dass der Betrieb einen weitreichenden Haftungsausschluss ungeprüft übernimmt, und ermöglicht eine informierte Verhandlung oder rechtliche Klärung.',
    sourceRef:'MAP-WBQ-RT; BGB § 307 https://www.gesetze-im-internet.de/bgb/__307.html; BGB § 310 Abs. 1 https://www.gesetze-im-internet.de/bgb/__310.html; BGB § 309 Nr. 7 https://www.gesetze-im-internet.de/bgb/__309.html'
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-02': {
    wrong:['Eine sinkende Quote als unmittelbaren Beweis für Zahlungsunfähigkeit oder Insolvenz werten.','Die Investition als automatische Erhöhung des Eigenkapitals behandeln.','Nur die Quote betrachten und Veränderung der Bilanzsumme sowie absolute Werte ausblenden.']
  },
  'extra-hsq-investition-finanzierung-rechnungswesen-controlling-01': {
    wrong:['Nur die jährliche Bruttoeinsparung mit dem Kaufpreis vergleichen und Wartung sowie Finanzierung ignorieren.','Finanzierungskosten weglassen, weil sie nicht unmittelbar die Maschinenleistung erhöhen.','Den Buchwert am Nutzungsende als sicheren Verkaufserlös ansetzen.']
  }
});
Object.assign(reviewOverrides['extra-hsq-betriebliches-management-05'], {
  explanation:'Der Ausfall eines Lieferanten verlangt einen abgestuften Notfallplan: kritische Bedarfe, verfügbare Alternativen, Mindestmengen, Vorlaufzeiten und Liquidität müssen zusammen bewertet werden.',
  companyEffect:'Die Priorisierung erhält zuerst die Versorgung kritischer Aufträge und begrenzt unnötige Kapitalbindung bei Ersatzbeschaffung.'
});
Object.assign(reviewOverrides['extra-hsq-betriebliches-management-10'], {
  explanation:'Bei unsicherer Nachfrage sollte der Betrieb die Markteintrittsannahmen mit einem begrenzten Pilot, messbaren Kriterien und einem Abbruch- oder Ausbaupunkt prüfen. So werden Risiko und gebundene Ressourcen kontrollierbar.',
  companyEffect:'Ein gestufter Test liefert Markterkenntnisse, bevor der Betrieb größere Kapazitäten oder Budgets dauerhaft bindet.'
});
Object.assign(reviewOverrides['extra-hsq-investition-finanzierung-rechnungswesen-controlling-02'], {
  explanation:'Die Eigenkapitalquote setzt Eigenkapital ins Verhältnis zur Bilanzsumme. Eine Investition kann das Anlagevermögen erhöhen und die Quote verändern; für die Beurteilung sind Bilanzstruktur und absolute Werte gemeinsam zu betrachten.',
  companyEffect:'Die Einordnung verhindert, dass eine Kennzahlenänderung allein als Beweis für Insolvenz oder Unwirtschaftlichkeit missverstanden wird.'
});
Object.assign(reviewOverrides['extra-hsq-investition-finanzierung-rechnungswesen-controlling-03'], {
  wrong:['Das Budget ohne Ursachenanalyse um den gesamten Überschreitungsbetrag erhöhen.','Nur bereits bezahlte Rechnungen erfassen und offene Verpflichtungen aus der Prognose lassen.','Die Kostenüberschreitung durch erwartete Einsparungen in einem anderen Projekt ausgleichen.'],
  companyEffect:'Die aktualisierte Endprognose zeigt früh, ob Budget oder Projektumfang angepasst werden müssen, und macht die Ursachen für künftige Investitionsentscheidungen nutzbar.'
});
export const SUPPLEMENTAL_ITEMS = areas.flatMap(area => (cases[area.id] || []).map((entry, index) => {
  const [difficulty, baseScenario, baseQuestion, baseCorrect] = entry;
  const id = `extra-${area.id}-${String(index + 1).padStart(2,'0')}`;
  const override = reviewOverrides[id];
  const scenario = override?.scenario || baseScenario;
  const question = override?.question || baseQuestion;
  const correct = override?.correct || baseCorrect;
  const competenceId = override?.competenceId || caseCompetencies[area.id]?.[index];
  const source = banks.get(area.id)?.find(item => item.competenceId === competenceId);
  if (!source) throw new Error(`Missing explicit source/competence mapping for ${area.id} supplemental case ${index + 1}: ${competenceId || "<none>"}`);
  const sameCompetence = banks.get(area.id).filter(item => item.competenceId === competenceId);
  const allReviewedWrongOptions = sameCompetence
    .flatMap(item => item.options.filter((option, optionIndex) => optionIndex !== 'ABCD'.indexOf(item.correctOption)))
    .filter(option => option.trim().toLocaleLowerCase('de-DE') !== correct.trim().toLocaleLowerCase('de-DE'))
    .filter((option, index, allOptions) => allOptions.findIndex(candidate => candidate.trim().toLocaleLowerCase('de-DE') === option.trim().toLocaleLowerCase('de-DE')) === index);
  const offset = (index * 3) % allReviewedWrongOptions.length;
  const reviewedWrongOptions = override?.wrong || [...allReviewedWrongOptions.slice(offset), ...allReviewedWrongOptions.slice(0, offset)].slice(0, 3);
  if (reviewedWrongOptions.length !== 3) throw new Error(`Insufficient reviewed distractors for ${area.id} / ${competenceId}`);
  const choices = [correct, ...reviewedWrongOptions];
  const shift = (index * 3 + hash(area.id)) % 4;
  const options = choices.map((_, choiceIndex) => choices[(choiceIndex + shift) % 4]);
  const correctIndex = (4 - shift) % 4;
  return {
    id,
    areaId: area.id,
    difficulty,
    competenceId,
    scenario,
    question,
    options,
    correctOption: letters[correctIndex],
    explanation: override?.explanation || `${source.explanation} Bezogen auf diesen Ergänzungsfall bedeutet das: ${correct}`,
    companyEffect: (override?.companyEffect || source.companyEffect).replace(/ Die Rückmeldung ist ausschließlich erläuternd und verändert weder den Spielstand noch Hauptbuch oder Kennzahlen\.$/, ''),
    sourceRef: override?.sourceRef || source.sourceRef,
    sourceKind: `Eigenständiger ${difficulty === 'transfer' ? 'Transferfall' : difficulty === 'applied' ? 'Anwendungsfall' : 'Grundlagenfall'}; Kompetenz- und Quellenbezug aus ${source.id}; keine Originalprüfungsaufgabe`,
    tooltipKey: source.tooltipKey || source.competenceId
  };
}));
function hash(value) {
  let result = 2166136261;
  for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
  return result >>> 0;
}
