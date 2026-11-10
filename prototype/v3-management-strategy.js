// V3 management guidance: synthetic targets over existing recorded sources.
// This projection never writes run state, finance, reputation or product data.
export const V3_MANAGEMENT_DIRECTIONS = Object.freeze([
  Object.freeze({ id: 'liquidity', label: 'Liquidität sichern', target: 'Bankbestand mindestens 0 € halten und offene Lieferantenposten reduzieren.', conflict: 'Mehr Liquiditätsreserve begrenzt den Spielraum für Material, Wachstum und neue Aufträge.' }),
  Object.freeze({ id: 'growth', label: 'Profitabel wachsen', target: 'Belegten Nettoumsatz und gewonnene Aufträge ausbauen; vor Zusage den Plan-Deckungsbeitrag prüfen.', conflict: 'Zusätzliche Aufträge binden Material und Kapazität. Umsatzwachstum allein belegt keinen Gewinn; Vollkosten und COGS bleiben ausstehend.' }),
  Object.freeze({ id: 'quality', label: 'Qualität und Ruf', target: 'Kundenbestätigte Lieferungen steigern und Zurückweisungen vermeiden.', conflict: 'Mehr Zeit für Qualitätssicherung kann die kurzfristig verfügbare Fertigungskapazität verringern. Die Auswahl verändert keinen Rufwert automatisch.' }),
]);

export function projectV3ManagementStrategy(run, financeView, directionId = 'liquidity', reportPeriod = null) {
  const direction = V3_MANAGEMENT_DIRECTIONS.find(row => row.id === directionId);
  if (!direction) throw new TypeError('Unbekannte Unternehmensausrichtung.');
  const date = run?.activeDay?.date ?? run?.currentDate;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('Ein datierter Lauf ist erforderlich.');
  const period = reportPeriod ?? date.slice(0, 7);
  const monthly = financeView?.monthlyFlows?.[period];
  const stocks = reportPeriod ? monthly?.closingStocks : financeView?.stocks;
  const eventCount = decision => (run.dayEvents ?? []).filter(event => event.phase === 'customer_acceptance_decision' && event.result?.decision === decision && event.result?.decisionDate?.slice(0, 7) === period).length;
  const byDirection = {
    liquidity: [
      { id: 'bank', label: 'Bankbestand einschließlich Dispo', value: stocks ? stocks.bankCents - stocks.dispoPrincipalCents : null, unit: 'cents', source: 'FinanceState: Bankbestand minus gezogener Dispo, Stichtag' },
      { id: 'payables', label: 'Offene Lieferantenposten', value: stocks?.supplierAccountsPayableCents ?? null, unit: 'cents', source: 'FinanceState: offene Lieferantenrechnungen, Stichtag' },
    ],
    growth: [
      { id: 'revenue', label: 'Belegter Nettoumsatz im Monat', value: financeView ? monthly?.recognizedRevenueCents ?? 0 : null, unit: 'cents', source: 'FinanceState: datierte Leistungs-/Umsatzereignisse des Monats; kein Gewinn' },
      { id: 'orders', label: 'Angenommene Aufträge im Monat', value: (run.customerWorkOrders ?? []).filter(order => order.acceptedAt?.slice(0, 7) === period).length, unit: 'count', source: 'Run: gespeicherte Aufträge mit Annahmedatum im Monat' },
    ],
    quality: [
      { id: 'accepted', label: 'Kundenbestätigte Lieferungen im Monat', value: eventCount('accept'), unit: 'count', source: 'Run: Kundenentscheidungen accept mit Entscheidungsdatum' },
      { id: 'rejected', label: 'Zurückgewiesene Lieferungen im Monat', value: eventCount('reject'), unit: 'count', source: 'Run: Kundenentscheidungen reject mit Entscheidungsdatum' },
    ],
  };
  const targets = { bank: ['mindestens 0 €', value => value >= 0], payables: ['keine offenen Lieferantenposten', value => value === 0], revenue: ['positiver belegter Monatsumsatz', value => value > 0], orders: ['mindestens ein gewonnener Auftrag', value => value > 0], accepted: ['mindestens eine Kundenbestätigung', value => value > 0], rejected: ['keine Zurückweisung', value => value === 0] };
  const decisions = eventCount('accept') + eventCount('reject');
  const metrics = byDirection[direction.id].map(row => ({ ...row, targetLabel: targets[row.id][0], met: row.value == null || (direction.id === 'quality' && decisions === 0) ? null : targets[row.id][1](row.value) }));
  const targetStatus = metrics.some(row => row.met === false) ? 'not_met' : metrics.every(row => row.met === true) ? 'met' : 'pending';
  const history = reportPeriod ? [] : Object.keys(financeView?.monthlyFlows ?? {}).filter(month => month < period).sort().map(month => projectV3ManagementStrategy(run, financeView, directionId, month));
  return { version: 'V3-MANAGEMENT-STRATEGY-1', direction, period, date, metrics, targetStatus, history, effect: 'projection_only_no_state_mutation', persistence: 'session_only_not_in_save' };
}
