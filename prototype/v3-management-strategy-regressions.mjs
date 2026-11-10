import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { V3_MANAGEMENT_DIRECTIONS, projectV3ManagementStrategy } from './v3-management-strategy.js';
import { createRunFromInputs, createFinanceStateForRun, renderManagementStrategy } from './v3/run.js';

// Explicit controlled three-month fixture; no annual simulation or claim.
const months = [
  { period: '2027-01', cash: 1000000, debt: 0, payable: 10000, revenue: 10000, orders: 1, accepted: 1, rejected: 0 },
  { period: '2027-02', cash: 0, debt: 10000, payable: 25000, revenue: 25000, orders: 2, accepted: 1, rejected: 1 },
  { period: '2027-03', cash: 1050000, debt: 0, payable: 0, revenue: 8000, orders: 1, accepted: 0, rejected: 1 },
];
for (const row of months) {
  const date = `${row.period}-28`;
  const run = {
    currentDate: date,
    customerWorkOrders: Array.from({ length: row.orders }, (_, i) => ({ workOrderId: `synthetic:${row.period}:${i}`, acceptedAt: `${row.period}-04` })),
    dayEvents: ['accept', 'reject'].flatMap(decision => Array.from({ length: decision === 'accept' ? row.accepted : row.rejected }, (_, i) => ({ phase: 'customer_acceptance_decision', result: { decision, decisionDate: `${row.period}-20`, decisionId: `synthetic:${decision}:${i}` } }))),
  };
  // Other-period evidence must not inflate this month's KPIs.
  run.customerWorkOrders.push({ workOrderId: 'synthetic:prior', acceptedAt: '2026-12-20' });
  run.dayEvents.push({ phase: 'customer_acceptance_decision', result: { decision: 'accept', decisionDate: '2026-12-20' } });
  const finance = { stocks: { bankCents: row.cash, dispoPrincipalCents: row.debt, supplierAccountsPayableCents: row.payable }, monthlyFlows: { [row.period]: { recognizedRevenueCents: row.revenue } } };
  const before = JSON.stringify({ run, finance });
  const liquidity = projectV3ManagementStrategy(run, finance, 'liquidity');
  const growth = projectV3ManagementStrategy(run, finance, 'growth');
  const quality = projectV3ManagementStrategy(run, finance, 'quality');
  assert.deepEqual(liquidity.metrics.map(x => x.value), [row.cash - row.debt, row.payable]);
  assert.deepEqual(growth.metrics.map(x => x.value), [row.revenue, row.orders]);
  assert.deepEqual(quality.metrics.map(x => x.value), [row.accepted, row.rejected]);
  for (const projection of [liquidity, growth, quality]) {
    assert.equal(projection.metrics.length, 2);
    assert.equal(projection.period, row.period);
    assert.ok(['met', 'not_met', 'pending'].includes(projection.targetStatus));
    assert.ok(projection.metrics.every(metric => metric.targetLabel.length > 0));
    assert.equal(projection.effect, 'projection_only_no_state_mutation');
    assert.equal(projection.persistence, 'session_only_not_in_save');
    assert.ok(projection.direction.conflict.length > 20);
    assert.ok(projection.metrics.every(x => x.source.length > 15));
  }
  assert.equal(JSON.stringify({ run, finance }), before, 'all three choices preserve the run/finance input byte-for-byte');
  assert.deepEqual(projectV3ManagementStrategy(run, null, 'liquidity').metrics.map(x => x.value), [null, null], 'missing finance is pending rather than invented zero');
}
const historyRun = { currentDate: '2027-04-01', customerWorkOrders: [], dayEvents: [] };
const historyFinance = { stocks: {}, monthlyFlows: {} };
for (const row of months) {
  historyFinance.monthlyFlows[row.period] = { recognizedRevenueCents: row.revenue, closingStocks: { bankCents: row.cash, dispoPrincipalCents: row.debt, supplierAccountsPayableCents: row.payable } };
  for (let i = 0; i < row.orders; i++) historyRun.customerWorkOrders.push({ acceptedAt: `${row.period}-04` });
  for (const decision of ['accept', 'reject']) for (let i = 0; i < (decision === 'accept' ? row.accepted : row.rejected); i++) historyRun.dayEvents.push({ phase: 'customer_acceptance_decision', result: { decision, decisionDate: `${row.period}-20` } });
}
const expectedStates = { liquidity: ['not_met', 'not_met', 'met'], growth: ['met', 'met', 'met'], quality: ['met', 'not_met', 'not_met'] };
const historyBefore = JSON.stringify({ historyRun, historyFinance });
for (const direction of V3_MANAGEMENT_DIRECTIONS) {
  const projection = projectV3ManagementStrategy(historyRun, historyFinance, direction.id);
  assert.deepEqual(projection.history.map(month => month.period), months.map(month => month.period));
  assert.deepEqual(projection.history.map(month => month.targetStatus), expectedStates[direction.id]);
  assert.ok(projection.history.every(month => month.metrics.length === 2));
}
assert.equal(JSON.stringify({ historyRun, historyFinance }), historyBefore);
assert.equal(projectV3ManagementStrategy({ currentDate: '2027-01-04', dayEvents: [] }, null, 'quality').targetStatus, 'pending');
assert.equal(projectV3ManagementStrategy({ currentDate: '2027-01-04' }, null, 'liquidity').targetStatus, 'pending');
assert.equal(V3_MANAGEMENT_DIRECTIONS.length, 3);
assert.throws(() => projectV3ManagementStrategy({ currentDate: '2027-01-04' }, null, 'unknown'), /Unbekannte/);
const realRun = createRunFromInputs({ scenarioId: 'management-ui-test', seed: 'management-ui', startDate: '2027-01-04', endDate: '2027-03-31' });
const realFinance = createFinanceStateForRun(realRun);
const beforeRender = JSON.stringify({ realRun, realFinance });
for (const direction of V3_MANAGEMENT_DIRECTIONS) {
  const html = renderManagementStrategy(realRun, realFinance, direction.id);
  assert.equal((html.match(/<option /g) ?? []).length, 3);
  assert.match(html, new RegExp(`value="${direction.id}" selected`));
  assert.match(html, /Synthetische Zielvorgabe/);
  assert.match(html, /Zielkonflikt/);
  assert.match(html, /Zielerreichung/);
  assert.match(html, /Monatsrückblick/);
  assert.match(html, /nur für diese Browser-Sitzung/);
  assert.doesNotMatch(html, /name=".*Json|<textarea/);
}
assert.equal(JSON.stringify({ realRun, realFinance }), beforeRender);
const uiSource = await readFile(new URL('./v3/run.js', import.meta.url), 'utf8');
assert.match(uiSource, /management-root.*innerHTML = renderManagementStrategy/);
assert.match(uiSource, /event\.target\.id !== 'management-direction'/);
const css = await readFile(new URL('./v3/run.css', import.meta.url), 'utf8');
assert.match(css, /@media\(max-width:540px\)\{\.management-kpis\{grid-template-columns:1fr\}\}/);
console.log('V3-10 management direction Jan/Feb/Mar projection + UI regressions: PASS');
