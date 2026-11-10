import assert from 'node:assert/strict';
import { assessV3T0074EconomicScenario, V3_T0074_ECONOMIC_SCENARIO_ID } from './v3-t0074-economic-viability-scenario.js';

const months = Array.from({ length: 12 }, (_, index) => ({
  period: `2027-${String(index + 1).padStart(2, '0')}`,
  netRevenueCents: 200000,
}));
const profitable = assessV3T0074EconomicScenario(months);
assert.equal(profitable.annual.netRevenueCents, 2400000);
assert.equal(profitable.annual.variableOperatingCostCents, 840000);
assert.equal(profitable.annual.fixedOperatingCostCents, 1440000);
assert.equal(profitable.annual.operatingResultCents, 120000);
assert.equal(profitable.annual.ownerDrawCents, 2160000);
assert.equal(profitable.annual.scenarioSurplusAfterOwnerDrawCents, -2040000);
assert.equal(profitable.resultClassification, 'positive_operating_result');
assert.equal(profitable.postingStatus, 'non_posting_scenario_only');
assert.ok(profitable.excludedFromPosting.includes('COGS'));
assert.ok(profitable.excludedFromPosting.includes('ledger'));
assert.equal(Object.hasOwn(months[0], 'operatingResultCents'), false, 'input monthly finance observations are not mutated');

const lossMonths = months.map(row => ({ ...row, netRevenueCents: 100000 }));
const loss = assessV3T0074EconomicScenario(lossMonths);
assert.equal(loss.annual.variableOperatingCostCents, 420000);
assert.equal(loss.annual.fixedOperatingCostCents, 1440000);
assert.equal(loss.annual.operatingResultCents, -660000);
assert.equal(loss.resultClassification, 'negative_operating_result');
assert.equal(loss.annual.ownerDrawCents, 2160000, 'owner drawings remain separate from operating expense');
assert.equal(loss.scenarioId, V3_T0074_ECONOMIC_SCENARIO_ID);

const breakEvenMonths = months.map(row => ({ ...row, netRevenueCents: 184615 }));
const breakEven = assessV3T0074EconomicScenario(breakEvenMonths);
assert.equal(breakEven.annual.operatingResultCents, 0);
assert.equal(breakEven.resultClassification, 'break_even');

assert.throws(() => assessV3T0074EconomicScenario(months.slice(1)), /exactly twelve/);
assert.throws(() => assessV3T0074EconomicScenario(months.map((row, index) => index === 4 ? { ...row, netRevenueCents: 1.5 } : row)), /safe integer cents/);
assert.throws(() => assessV3T0074EconomicScenario(months.map((row, index) => index === 4 ? { ...row, period: '2027-03' } : row)), /unique ascending/);
assert.throws(() => assessV3T0074EconomicScenario(months.map(row => ({ ...row, netRevenueCents: Number.MAX_SAFE_INTEGER - 1000000 }))), /exceeds safe integer cents/);

console.log(JSON.stringify({ status: 'PASS', scenarioId: profitable.scenarioId, positiveOperatingResultCents: profitable.annual.operatingResultCents, negativeOperatingResultCents: loss.annual.operatingResultCents, breakEvenOperatingResultCents: breakEven.annual.operatingResultCents, postingStatus: profitable.postingStatus }, null, 2));
