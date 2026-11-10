import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  createV3MacroState, runV3MacroMonth, validateV3MacroState,
  V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS,
} from './v3-macro-simulation.js';
import { createV3MarketState, validateV3MarketState } from './v3-market-simulation.js';
import { createV3FormationState, validateV3FormationState } from './v3-company-formation.js';
import { createV3ProductState } from './v3-product-lifecycle.js';
import {
  createV3Run, openV3RunDay, closeV3RunDay, validateV3RunState,
  startV3RunDiagnostics, setV3RunDiagnosticPhase, finishV3RunDiagnostics,
} from './v3-run-orchestrator.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from './v3-price-index.js';
import { calculateV3MacroDemand } from './v3-macro-demand-channel.js';
import { buildV3BaseMarketTemplates } from './v3-run-macro-fixture.js';

// These are regression fixtures already documented by T-0063/T-0069, not product defaults.
export const V3_YEAR_SMOKE_FIXTURE_VERSION = 'T-0069-YEAR-SMOKE-FIXTURE-1';
export const V3_YEAR_SMOKE_START = '2027-01-04';
export const V3_YEAR_SMOKE_END = '2027-12-31';
export const V3_YEAR_SMOKE_EXPECTED_MARKET_WEEKS = 52;
export const V3_YEAR_SMOKE_EXPECTED_RUN_EVENTS = 1409;
const SCENARIOS = Object.freeze([
  { id: 'UPSWING', phase: 'upswing', gap: 1, momentum: 0.5 },
  { id: 'BOOM', phase: 'boom', gap: 3, momentum: 0.5 },
  { id: 'DOWNTURN', phase: 'downturn', gap: -1, momentum: -0.5 },
  { id: 'LOW', phase: 'trough', gap: -3, momentum: -0.5 },
]);
const MARKET_PARAMETERS = Object.freeze({
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 },
  customerDecisionDelayCalendarDays: { min: 2, max: 2 },
  minimumMonthlyCompetitorSample: 3,
});
const MARKET_FIRMS = Object.freeze([
  { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: ['turning', 'milling'], segmentFit: { small: 0.75, medium: 0.7, large: 0.6 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning', 'milling'], segmentFit: { small: 0.8, medium: 0.78, large: 0.75 }, offerPriceCentsBySizeClass: { small: 10000, medium: 30000, large: 50000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6, medium: 0.55, large: 0.5 }, offerPriceCentsBySizeClass: { small: 12000, medium: 36000, large: 62000 } },
  { firmId: 'ineligible', role: 'competitor', reputation: 1, capacityUnits: 100, capabilities: ['welding'], segmentFit: { small: 1, medium: 1, large: 1 }, offerPriceCentsBySizeClass: { small: 1, medium: 1, large: 1 } },
]);
const MARKET_SEGMENTS = Object.freeze([
  { segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } },
  { segmentId: 'medium', decisionWeights: { price: 0.5, reputation: 0.25, segmentFit: 0.25 } },
  { segmentId: 'large', decisionWeights: { price: 0.4, reputation: 0.25, segmentFit: 0.35 } },
]);
const CYCLE_PARAMETERS = Object.freeze({
  lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1,
  persistencePeriods: 1, parameterSetId: 'cycle-fixture-v1', sourceRef: 'synthetic-fixture:cycle',
});
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const sha256 = value => createHash('sha256').update(stable(value)).digest('hex');
const iso = date => date.toISOString().slice(0, 10);
const nextDate = date => iso(new Date(Date.parse(`${date}T12:00:00Z`) + 86400000));
const monday = date => {
  const dow = new Date(`${date}T12:00:00Z`).getUTCDay();
  return dow === 1;
};
const monthStart = date => date === V3_YEAR_SMOKE_START || date.slice(8) === '01';
const ensure = result => { assert.equal(result.ok, true, result.error?.message); return result; };
const now = () => globalThis.performance?.now?.() ?? Date.now();
function summarize(samples) { const sorted = [...samples].sort((a, b) => a - b); const at = q => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * q))] ?? 0; return { count: samples.length, totalMs: Number(samples.reduce((a, b) => a + b, 0).toFixed(3)), meanMs: Number((samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)).toFixed(3)), p50Ms: Number(at(.5).toFixed(3)), p95Ms: Number(at(.95).toFixed(3)), maxMs: Number((sorted.at(-1) ?? 0).toFixed(3)) }; }

function macroInput(scenario, period, priorSpiIndexes) {
  const componentIndexes = Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, 100]));
  const activityIndex = 100;
  const trendIndex = activityIndex / (1 + scenario.gap / 100);
  const priorActivityIndex = activityIndex / (1 + scenario.momentum / 100);
  const source = name => ({
    sourceType: 'synthetic_fixture', sourceRef: `fixture:${scenario.id}:${period}:${name}`,
    unit: 'index', value: 100, effectiveFrom: `${period}-01`, lagPeriods: 0,
    uncertaintyBand: { low: -1, base: 0, high: 1 }, firmExposure: `fixture:${name}`,
    expectedOutcome: 'directional_only_test_input',
  });
  return {
    period, parameterSetId: V3_YEAR_SMOKE_FIXTURE_VERSION,
    componentIndexes, priorMonthlySpiIndexes: priorSpiIndexes,
    componentSourceType: 'synthetic_fixture', componentSourceRef: `fixture:${scenario.id}:${period}:spi`,
    activity: {
      activityIndex, trendIndex, priorActivityIndex, sourceType: 'synthetic_fixture',
      sourceRef: `fixture:${scenario.id}:${period}:activity`, observedQuarterly: null,
    },
    externalChannels: Object.fromEntries(V3_EXTERNAL_CHANNELS.map(name => [name, source(name)])),
    policyChannels: Object.fromEntries(V3_POLICY_CHANNELS.map(name => [name, ({
      ...source(name), measure: `fixture ${name}`, goal: 'test only', intermediateIndicator: `fixture-indicator-${name}`,
      expectedOutcome: 'directional test only', counterEffect: 'test-only counter-effect',
      effectGroupId: `fixture-group-${name}`, accountingClass: 'information_plan',
    })])),
  };
}

function weeklyTemplate(date, state, macroMonthInput = null) {
  const period = date.slice(0, 7);
  const snapshot = state.modules.macro.periods.find(item => item.period === period);
  const activity = macroMonthInput?.activity ?? snapshot?.activity;
  if (!activity) throw new Error(`year smoke requires the ${period} macro activity input before weekly demand`);
  const demand = calculateV3MacroDemand({
    activityGapPct: 100 * (activity.activityIndex / activity.trendIndex - 1),
    activitySourceType: activity.sourceType,
    activitySourceRef: activity.sourceRef,
    exposure: 1,
    macroSnapshotId: snapshot?.sourceSnapshotId ?? state.modules.macro.sourceSnapshotId,
    macroSnapshotPeriod: period,
    seed: String(state.seed), runId: state.runId, scenarioId: state.scenarioId, weekStart: date,
  });
  return buildV3BaseMarketTemplates(date, state.seed, demand);
}

function initialRun(scenario, seed, endDate = V3_YEAR_SMOKE_END) {
  const runId = `year-smoke-${scenario.id}-${seed}`;
  const scenarioId = `v3-cycle-${scenario.id.toLowerCase()}`;
  const marketState = createV3MarketState({
    runId, scenarioId, seed, parameterSetId: V3_YEAR_SMOKE_FIXTURE_VERSION,
    startDate: V3_YEAR_SMOKE_START, parameters: structuredClone(MARKET_PARAMETERS),
    segments: structuredClone(MARKET_SEGMENTS), firms: structuredClone(MARKET_FIRMS),
  });
  const macroState = createV3MacroState({
    runId, scenarioId, seed, profileVersion: V3_YEAR_SMOKE_FIXTURE_VERSION,
    sourceSnapshotId: `fixture-snapshot:${scenario.id}`, cycleParameters: structuredClone(CYCLE_PARAMETERS),
  });
  const formationState = createV3FormationState({
    scenarioId, startDate: V3_YEAR_SMOKE_START, founderPersonId: 'founder-fixture',
    initialEntityId: 'entity-fixture', initialEntitySourceRef: 'fixture:v3-start-profile',
  });
  const productState = createV3ProductState({
    runId, currentDate: V3_YEAR_SMOKE_START,
    people: [{ id: 'person-fixture', hoursPerDay: 8, skills: ['turning'] }],
    equipment: [{ id: 'equipment-fixture', hoursPerDay: 8, capabilities: ['turning'] }],
    materials: [{ id: 'material-fixture', quantity: 10 }],
    finishedGoodsCapacity: 5, finishedGoodsUsed: 0, commitments: [],
  });
  return createV3Run({
    runId, scenarioId, seed, startDate: V3_YEAR_SMOKE_START, endDate,
    marketState, macroState, formationState, productState,
  });
}

export function runV3YearSmoke({ scenario = 'UPSWING', seed = 'T-0069-seed-1', endDate = V3_YEAR_SMOKE_END } = {}) {
  const caseDefinition = SCENARIOS.find(item => item.id === scenario);
  if (!caseDefinition) throw new TypeError(`unknown cycle fixture: ${scenario}`);
  if (typeof seed !== 'string' || !seed.trim()) throw new TypeError('explicit non-empty seed required');
  if (typeof endDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(endDate) || !Number.isFinite(Date.parse(`${endDate}T12:00:00Z`)) || new Date(`${endDate}T12:00:00Z`).toISOString().slice(0, 10) !== endDate || endDate < V3_YEAR_SMOKE_START) throw new TypeError('endDate must be a valid ISO date on/after the smoke start');
  const expectedDays = Math.floor((Date.parse(`${endDate}T12:00:00Z`) - Date.parse(`${V3_YEAR_SMOKE_START}T12:00:00Z`)) / 86400000) + 1;
  const smokeStarted = now();
  startV3RunDiagnostics();
  setV3RunDiagnosticPhase('initialization');
  const stateSetupStarted = now();
  let state = initialRun(caseDefinition, seed, endDate);
  const stateSetupMs = now() - stateSetupStarted;
  let date = V3_YEAR_SMOKE_START;
  const monthlySpiIndexes = [];
  const dailyLog = [];
  const monthlyLog = [];
  const blockSamples = { datePreparation: [], openDay: [], closeDay: [], dailyLog: [] };
  const daySamples = [];
  while (date <= endDate) {
    const dayStarted = now();
    let blockStarted = now();
    let macroMonthInput;
    if (monthStart(date)) {
      const period = date.slice(0, 7);
      macroMonthInput = macroInput(caseDefinition, period, [...monthlySpiIndexes]);
    }
    const marketWeekTemplates = monday(date) ? weeklyTemplate(date, state, macroMonthInput) : undefined;
    blockSamples.datePreparation.push(now() - blockStarted);
    blockStarted = now();
    setV3RunDiagnosticPhase('openDay');
    const opened = ensure(openV3RunDay(state, {
      date,
      ...(macroMonthInput ? { macroMonthInput } : {}),
      ...(marketWeekTemplates ? { marketWeekTemplates } : {}),
    }));
    state = opened.state;
    const macroSnapshot = state.modules.macro.periods.at(-1);
    if (macroMonthInput) monthlySpiIndexes.push(macroSnapshot.spi.index);
    blockSamples.openDay.push(now() - blockStarted);
    blockStarted = now();
    setV3RunDiagnosticPhase('closeDay');
    const closed = ensure(closeV3RunDay(state, { date }));
    state = closed.state;
    blockSamples.closeDay.push(now() - blockStarted);
    blockStarted = now();
    setV3RunDiagnosticPhase('dailyLog');
    dailyLog.push({ date, month: date.slice(0, 7), eventIds: state.dayEvents.filter(event => event.occurredAt === date).map(event => event.eventId) });
    blockSamples.dailyLog.push(now() - blockStarted);
    daySamples.push(now() - dayStarted);
    if (macroMonthInput) monthlyLog.push({
      period: macroSnapshot.period, phase: macroSnapshot.phaseState.phase,
      gapPct: macroSnapshot.activity.activityGapPct,
      momentumPct: macroSnapshot.activity.activityMomentumPct,
      snapshotEventIds: macroSnapshot.scheduledEvents.map(event => event.macroEventId),
      financeEffects: macroSnapshot.financeEffects,
    });
    date = nextDate(date);
  }
  assert.equal(date, nextDate(endDate));
  assert.equal(dailyLog.length, expectedDays, 'run covers each included calendar date exactly once');
  assert.equal(monthlyLog.length, new Set(dailyLog.map(row => row.month)).size, 'run contains each included macro month');
  assert.equal(Object.keys(state.modules.market.scheduledWeeks).length, dailyLog.filter(row => monday(row.date)).length, 'market weeks are scheduled once for each included Monday');
  if (endDate === V3_YEAR_SMOKE_END) {
    assert.equal(Object.keys(state.modules.market.scheduledWeeks).length, V3_YEAR_SMOKE_EXPECTED_MARKET_WEEKS, 'full-year gate must schedule exactly 52 market weeks');
    assert.equal(state.dayEvents.length, V3_YEAR_SMOKE_EXPECTED_RUN_EVENTS, 'full fixture must produce exactly 1,409 shared-run events');
  }
  assert.equal(new Set(dailyLog.map(row => row.date)).size, dailyLog.length, 'daily dates are unique');
  assert.equal(new Set(dailyLog.flatMap(row => row.eventIds)).size, dailyLog.reduce((sum, row) => sum + row.eventIds.length, 0), 'run event IDs are unique');
  assert.deepEqual(monthlyLog.map(row => row.phase), Array(monthlyLog.length).fill(caseDefinition.phase));
  assert.equal(Object.keys(state.processedDays).length, dailyLog.length);
  assert.equal(state.customerWorkOrders.length, 0, 'fixture does not submit a player offer or invent a customer work plan');
  assert.equal(state.financeHandoffs.length, 0, 'no customer acceptance means no finance handoff');
  assert.equal(state.modules.product.customerAssignments.length, 0, 'no accepted work order means no production result is claimed');
  let expectedProductDate = endDate;
  while ([0, 6].includes(new Date(`${expectedProductDate}T12:00:00Z`).getUTCDay())) expectedProductDate = new Date(Date.parse(`${expectedProductDate}T12:00:00Z`) - 86400000).toISOString().slice(0, 10);
  assert.equal(state.modules.product.currentDate, expectedProductDate);
  setV3RunDiagnosticPhase('finalValidation');
  assert.equal(validateV3RunState(state), true);
  assert.equal(validateV3MacroState(state.modules.macro), true);
  assert.equal(validateV3MarketState(state.modules.market), true);
  assert.equal(validateV3FormationState(state.modules.formation).valid, true);
  assert.ok(state.dayEvents.every(event => !['finance_posted', 'invoice', 'payment', 'customer_delivery', 'customer_acceptance'].includes(event.phase)));
  assert.ok(monthlyLog.every(row => Object.values(row.financeEffects).every(value => value === false)));

  const runDiagnostics = finishV3RunDiagnostics();
  const performanceReport = {
    wallMs: Number((now() - smokeStarted).toFixed(3)), stateSetupMs: Number(stateSetupMs.toFixed(3)),
    blocks: Object.fromEntries(Object.entries(blockSamples).map(([key, samples]) => [key, summarize(samples)])),
    perDay: summarize(daySamples), validators: runDiagnostics,
  };
  return {
    performance: performanceReport,
    fixtureVersion: V3_YEAR_SMOKE_FIXTURE_VERSION,
    runId: state.runId, scenarioId: state.scenarioId, seed, startDate: V3_YEAR_SMOKE_START, endDate,
    runnerVersion: state.modelVersion,
    modules: {
      macro: state.modules.macro.modelVersion,
      market: state.modules.market.modelVersion,
      formation: state.modules.formation.modelVersion,
      product: state.modules.product.version,
    },
    eventCount: state.dayEvents.length,
    market: { scheduledWeeks: Object.keys(state.modules.market.scheduledWeeks).length, inquiries: state.modules.market.inquiries.length, decisions: state.modules.market.events.filter(event => event.type === 'customer_decision').length },
    product: { currentDate: state.modules.product.currentDate, assignedCustomerOperations: state.modules.product.customerAssignments.length, producedFinishedGoods: 0 },
    financeReconciliation: 'NOT_SUPPORTED: no A03 journal/ledger/AR/cash/stock valuation API is wired into this run; no finance state or posting was created',
    dailyLog, monthlyLog, stateHash: sha256(state),
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
const singleScenario = process.argv.find(value => value.startsWith('--scenario='))?.slice('--scenario='.length);
const scenariosToRun = singleScenario ? SCENARIOS.filter(row => row.id === singleScenario) : SCENARIOS;
if (!scenariosToRun.length) throw new TypeError(`unknown CLI scenario: ${singleScenario}`);
const reports = scenariosToRun.map(({ id }) => {
  console.log(`Running ${id} 12-month fixture...`);
  return runV3YearSmoke({ scenario: id, seed: 'T-0069-seed-1' });
});
if (!singleScenario) {
  console.log('Running same-seed replay check...');
  const repeated = runV3YearSmoke({ scenario: 'UPSWING', seed: 'T-0069-seed-1' });
  assert.equal(repeated.stateHash, reports[0].stateHash, 'same seed and inputs reproduce the identical full run state');
  assert.deepEqual(repeated.dailyLog, reports[0].dailyLog, 'same seed reproduces all daily event IDs and dates');
  assert.deepEqual(repeated.monthlyLog, reports[0].monthlyLog, 'same seed reproduces monthly phases and snapshot events');
}
for (const report of reports) {
  assert.equal(report.monthlyLog.length, 12);
  assert.equal(report.dailyLog.length, 362);
  console.log(`${report.scenarioId}: ${report.startDate}..${report.endDate}; ${report.dailyLog.length} days; ${report.monthlyLog.length} months; ${report.eventCount} run events; SHA256 ${report.stateHash}`);
  console.log(`TIMING ${report.scenarioId}: ${JSON.stringify(report.performance)}`);
}
console.log(singleScenario
  ? 'PASS: one seeded synthetic phase fixture, 12 monthly snapshots, daily replay/provenance checks, finance non-posting boundary.'
  : 'PASS: four seeded synthetic phase fixtures, 12 monthly snapshots each, daily replay/provenance checks, finance non-posting boundary; same-seed full-state replay identical.');
}
