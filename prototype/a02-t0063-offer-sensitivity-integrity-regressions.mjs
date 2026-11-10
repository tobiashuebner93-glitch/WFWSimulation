import assert from 'node:assert/strict';
import {
  createRunFromInputs, installRunOperatingResources, closeRunDay,
  submitRunOffer, createRunSaveEnvelope, restoreRunSaveEnvelope, getRunProjection,
  createFinanceStateForRun,
} from './v3/run.js';
import { V3_BUSINESS_COST_PLAN_TEST_FIXTURE } from './v3-business-cost-plan-index.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import { buildWeeklyTemplates } from './v3/run.js';
import { getV3MarketPlayerView } from './v3-market-simulation.js';
import { openV3RunDay } from './v3-run-orchestrator.js';
import { validateV3RunState } from './v3-run-orchestrator.js';

const costs = ['material', 'energy', 'wage', 'logistics'];
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const units = { material: 'EUR/kg', energy: 'EUR/kWh', wage: 'EUR/h', logistics: 'EUR/shipment' };
const weights = { material: .25, energy: .25, wage: .25, logistics: .25 };
const component = (id, currentValue) => {
  const period = '2027-01';
  const sourceRef = `fixture:${id}:${period}`;
  const contributionId = `${id}|${period}|V3-BUSINESS-COST-PLAN-INDEX-1`;
  return {
    componentId: id, unit: units[id], baseValue: 100, currentValue,
    basePeriod: '2027-01', currentPeriod: period, lagPeriods: 1, contributionId,
    sourceType: 'synthetic_fixture', sourceRef, parameterSetId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE,
    driverIds: [{ driverId: `RAW-COMP|${id}|${period}|fixture:business-cost-plan:${period}`,
      driverType: 'raw_component', componentId: id, period, eventKey: 'business_input_cost_plan',
      eventRef: `fixture:business-cost-plan:${period}`, scopeRef: `${id}:${period}`,
      effectGroupId: `RAW-COMP|${id}|${period}`, contributionId }],
  };
};

let state = createRunFromInputs({ scenarioId: 'A02-SENSITIVITY-INTEGRITY', seed: 'integrity-seed-1', startDate: '2027-01-04', endDate: '2027-02-12', costPlanFixtureId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE });
assert.deepEqual(state, createRunFromInputs({ scenarioId: 'A02-SENSITIVITY-INTEGRITY', seed: 'integrity-seed-1', startDate: '2027-01-04', endDate: '2027-02-12', costPlanFixtureId: V3_BUSINESS_COST_PLAN_TEST_FIXTURE }), 'same seed and explicit fixture profile replay to an identical initial state');
state = installRunOperatingResources(state, { peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]', finishedGoodsCapacity: '0', finishedGoodsUsed: '0' });
const financeState = createFinanceStateForRun(state);
const baselineFinance = JSON.stringify(financeState);
let runWithOffer = null;
let acceptedSnapshot = null;
let acceptedRunState = null;
let date = '2027-01-04';
while (date <= '2027-02-12') {
  let macroMonthInput = null;
  if (date === '2027-01-04' || date === '2027-02-01') {
    macroMonthInput = buildRunMacroMonthInput({ period: date.slice(0, 7), path: 'UPSWING', costPlanFixtureId: state.costPlanFixtureId });
  }
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const marketWeekTemplates = weekday === 1 ? buildWeeklyTemplates(date, state.seed, {
    runId: state.runId, scenarioId: state.scenarioId,
    activityGapPct: macroMonthInput ? 100 * (macroMonthInput.activity.activityIndex / macroMonthInput.activity.trendIndex - 1) : state.modules.macro.periods.at(-1)?.activity.activityGapPct ?? 0,
    activitySourceType: macroMonthInput?.activity.sourceType ?? state.modules.macro.periods.at(-1)?.activity.sourceType ?? 'synthetic_fixture',
    activitySourceRef: macroMonthInput?.activity.sourceRef ?? state.modules.macro.periods.at(-1)?.activity.sourceRef ?? 'fixture:activity-neutral',
    exposure: 1, macroSnapshotId: state.modules.macro.sourceSnapshotId, macroSnapshotPeriod: date.slice(0, 7),
  }) : undefined;
  const opened = openV3RunDay(state, { date, ...(macroMonthInput ? { macroMonthInput } : {}), ...(marketWeekTemplates ? { marketWeekTemplates } : {}) });
  assert.equal(opened.ok, true, opened.error?.message);
  state = opened.state;
  if (date === '2027-01-04') {
    assert.deepEqual(getRunProjection(state).businessCostPlanIndexes.effects, [], 'January offer period has no effective L4 index and never falls back');
  }
  if (date === '2027-02-01') {
    const projection = getRunProjection(state).businessCostPlanIndexes;
    const januaryMacroEvents = state.modules.macro.periods[0].scheduledEvents.filter(row => row.eventKey === 'business_input_cost_plan');
    assert.equal(januaryMacroEvents.length, 1, 'the selected January fixture is recorded as a scheduled macro event');
    assert.equal(januaryMacroEvents[0].sourceType, 'synthetic_fixture');
    assert.equal(januaryMacroEvents[0].period, '2027-01');
    assert.equal(januaryMacroEvents[0].effectivePeriod, '2027-02', 'the one-month lag makes the index effective in February');
    assert.ok(state.modules.macro.periods[1].effectiveMacroEvents.some(row => row.macroEventId === januaryMacroEvents[0].macroEventId), 'the same January event activates in the February macro snapshot');
    const effects = projection.effects;
    const indexes = Object.fromEntries(effects.map(row => [row.target, row.after]));
    assert.equal(indexes.businessInputCostPlanIndex, 110, 'explicit fixture BICI is 110 with its stated equal weights');
    assert.equal(indexes.procurementPlanIndex, 110, 'material/logistics procurement subview is (100 + 120) / 2 = 110 after 25/25 normalization');
    assert.equal(indexes.wagePlanIndex, 110, 'explicit fixture wage index is 110');
    assert.ok(effects.every(row => row.sourceType === 'synthetic_fixture'), 'every L4 effect exposes synthetic fixture provenance');
  }
  if (date >= '2027-02-01' && !runWithOffer) {
    const inquiry = getRunProjection(state).playerView.inquiries.find(row => row.status === 'open');
    if (inquiry) {
    const beforeSubmit = JSON.stringify(state);
    const submitted = submitRunOffer(state, inquiry, {
      netPrice: '1,00', costVersion: 'COST-2027-01', babVersion: 'BAB-2027-02',
      sensitivityMode: 'apply_l4_plan_indices',
      directCostsJson: JSON.stringify([
        { id: 'MAT-1', amountEuro: '1,01', variable: true, category: 'material', basePeriod: '2027-01' },
        { id: 'LOG-1', amountEuro: '1,01', variable: true, category: 'logistics', basePeriod: '2027-01' },
        { id: 'LAB-1', amountEuro: '1,01', variable: true, category: 'labor', basePeriod: '2027-01' },
        { id: 'OTH-1', amountEuro: '1,01', variable: true, category: 'other', basePeriod: '2027-01' },
      ]),
      sourcePoolsJson: JSON.stringify([{ poolId: 'POOL-1', sourceCostCenterId: 'CC-SRC', costBasisId: 'BASIS-1', period: '2027-02', poolEuro: '1,00', allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }] }]),
      offerDriversJson: JSON.stringify([{ poolId: 'POOL-1', costCenterId: 'CC-PROD', period: '2027-02', basisKind: 'driver', quantity: '1', unitLabel: 'h' }]),
    });
    runWithOffer = submitted.state;
    const sent = getV3MarketPlayerView(runWithOffer.modules.market).inquiries.find(row => row.inquiryId === inquiry.inquiryId).ownOffer;
    assert.equal(sent.netPriceCents, 100, 'net R remains unchanged');
    const usedCosts = sent.calculationSnapshot.calculation.planSensitivity.usedDirectCosts;
    assert.deepEqual(usedCosts.map(row => row.amountCents), [111, 111, 111, 101], 'each direct line receives only its category index; other costs remain unadjusted; BICI is not stacked');
    assert.equal(sent.calculationSnapshot.calculation.babAllocatedCents, 10, 'offer plan sensitivity does not alter the submitted BAB allocation');
    assert.ok(JSON.stringify(submitted.state).includes('calculationReplayWitness'));
    assert.equal(JSON.stringify(state), beforeSubmit, 'submission returns a new state and does not mutate input');
    assert.equal(JSON.stringify(financeState), baselineFinance, 'offer submit leaves finance state unchanged');
    const save = createRunSaveEnvelope(runWithOffer, null);
    const restored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(save)));
    assert.deepEqual(getRunProjection(restored.runState).playerView, getRunProjection(runWithOffer).playerView, 'snapshot and selected index survive JSON save/restore exactly');
    const alteredSelection = structuredClone(runWithOffer);
    alteredSelection.costPlanFixtureId = 'NEUTRAL';
    assert.throws(() => restoreRunSaveEnvelope({ saveVersion: 'V3-RUN-SAVE-1', runState: alteredSelection }), /fixture|run identity/i, 'restore rejects changing the selected fixture profile');
    const alteredMacro = structuredClone(runWithOffer);
    const januaryOpen = JSON.parse(alteredMacro.dayOpenFingerprints['2027-01-04']);
    januaryOpen.macroMonthInput.externalChannels.business_input_cost_plan.components[0].currentValue += 1;
    alteredMacro.dayOpenFingerprints['2027-01-04'] = stable(januaryOpen);
    assert.throws(() => restoreRunSaveEnvelope({ saveVersion: 'V3-RUN-SAVE-1', runState: alteredMacro }), /macro input|cost-plan profile|snapshot/i, 'restore rejects changing the selected macro fixture input');
    const offerLocation = () => {
      const inquiryRow = runWithOffer.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId);
      const offer = inquiryRow.offers.find(row => row.firmId === 'player');
      const event = runWithOffer.modules.market.events.find(row => row.eventId === offer.submittedEventId);
      return { inquiryRow, offer, event };
    };
    const tamperPair = mutate => {
      const attacked = structuredClone(runWithOffer);
      const targetInquiry = attacked.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId);
      const targetOffer = targetInquiry.offers.find(row => row.firmId === 'player');
      const targetEvent = attacked.modules.market.events.find(row => row.eventId === targetOffer.submittedEventId);
      mutate(targetOffer.calculationSnapshot); mutate(targetEvent.payload.calculationSnapshot);
      assert.throws(() => validateV3RunState(attacked), /snapshot|binding|sensitivity/i, 'coordinated mirror mutation is rejected before serialization');
      assert.throws(() => createRunSaveEnvelope(attacked, null), /snapshot|binding|sensitivity/i, 'coordinated offer/event mutation is rejected on save');
      assert.throws(() => restoreRunSaveEnvelope({ saveVersion: 'V3-RUN-SAVE-1', runState: attacked }), /snapshot|binding|sensitivity/i, 'coordinated offer/event mutation is rejected on restore');
      const restoredBase = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(createRunSaveEnvelope(runWithOffer, null))));
      const restoredAttack = restoredBase.runState;
      const restoredInquiry = restoredAttack.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId);
      const restoredOffer = restoredInquiry.offers.find(row => row.firmId === 'player');
      const restoredEvent = restoredAttack.modules.market.events.find(row => row.eventId === restoredOffer.submittedEventId);
      mutate(restoredOffer.calculationSnapshot); mutate(restoredEvent.payload.calculationSnapshot);
      assert.throws(() => validateV3RunState(restoredAttack), /snapshot|binding|sensitivity/i, 'the same attack is rejected after a valid JSON restore');
    };
    tamperPair(snapshot => { snapshot.calculation.planSensitivity.usedDirectCosts[0].amountCents += 1; });
    tamperPair(snapshot => { snapshot.calculation.planSensitivity.indexes[0].evidence.componentContributions[0].sourceRef = 'forged-source'; });
    const incompleteBoundState = structuredClone(runWithOffer);
    const incompleteInquiry = incompleteBoundState.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId);
    const incompleteOffer = incompleteInquiry.offers.find(row => row.firmId === 'player');
    const incompleteEvent = incompleteBoundState.modules.market.events.find(row => row.eventId === incompleteOffer.submittedEventId);
    incompleteOffer.calculationSnapshot.calculation.planSensitivity.indexes[0].evidence.componentContributions[0].driverIds = [];
    incompleteEvent.payload.calculationSnapshot = structuredClone(incompleteOffer.calculationSnapshot);
    incompleteEvent.result.snapshotBinding.calculationReplayWitness = stable(incompleteOffer.calculationSnapshot);
    const playerOfferRunEvent = incompleteBoundState.dayEvents.find(row => row.phase === 'player_offer' && row.sourceRef === incompleteEvent.payload.eventId);
    playerOfferRunEvent.result = structuredClone(incompleteEvent.result);
    assert.throws(() => validateV3RunState(incompleteBoundState), /component|driver|provenance|sensitivity/i,
      'incomplete component evidence is rejected even when all duplicated snapshot bindings are recomputed');
    const invalidCategoryState = structuredClone(runWithOffer);
    const invalidCategoryInquiry = invalidCategoryState.modules.market.inquiries.find(row => row.inquiryId === inquiry.inquiryId);
    const invalidCategoryOffer = invalidCategoryInquiry.offers.find(row => row.firmId === 'player');
    const invalidCategoryEvent = invalidCategoryState.modules.market.events.find(row => row.eventId === invalidCategoryOffer.submittedEventId);
    invalidCategoryOffer.calculationSnapshot.calculation.planSensitivity.baseDirectCosts[0].category = 'mixed';
    invalidCategoryOffer.calculationSnapshot.calculation.planSensitivity.usedDirectCosts[0].category = 'mixed';
    invalidCategoryEvent.payload.calculationSnapshot = structuredClone(invalidCategoryOffer.calculationSnapshot);
    invalidCategoryEvent.result.snapshotBinding.calculationReplayWitness = stable(invalidCategoryOffer.calculationSnapshot);
    invalidCategoryState.dayEvents.find(row => row.phase === 'player_offer' && row.sourceRef === invalidCategoryEvent.payload.eventId).result = structuredClone(invalidCategoryEvent.result);
    assert.throws(() => validateV3RunState(invalidCategoryState), /category|sensitivity/i,
      'a locally rebound but unclassified cost category fails the real market-state boundary');
    assert.equal(offerLocation().event.result.snapshotBinding.calculationReplayWitness.length > 0, true);
    state = runWithOffer;
    }
  }
  if (date >= '2027-02-01' && runWithOffer) {
    const candidate = getV3MarketPlayerView(state.modules.market).inquiries
      .flatMap(row => row.ownOffer ? [row.ownOffer] : [])
      .find(row => row.status === 'accepted');
    if (candidate) {
      const live = state.modules.market.inquiries.flatMap(row => row.offers).find(row => row.offerId === candidate.offerId);
      acceptedSnapshot = structuredClone(live.calculationSnapshot);
      acceptedRunState = structuredClone(state);
      assert.equal(live.calculationSnapshot.calculation.planSensitivity.mode, 'apply_l4_plan_indices');
    }
  }
  state = closeRunDay(state).state;
  const next = new Date(`${date}T12:00:00Z`); next.setUTCDate(next.getUTCDate() + 1); date = next.toISOString().slice(0, 10);
}
assert.ok(runWithOffer, 'a real shared-run offer was submitted');
assert.ok(acceptedSnapshot, 'submitted offer proceeded through the market decision to acceptance');
assert.equal(acceptedSnapshot.netPriceCents, 100);
const acceptedAttack = structuredClone(acceptedRunState);
const acceptedInquiry = acceptedAttack.modules.market.inquiries.find(row => row.winningOfferId === acceptedSnapshot.offerId);
const acceptedOffer = acceptedInquiry.offers.find(row => row.offerId === acceptedSnapshot.offerId);
const acceptedEvent = acceptedAttack.modules.market.events.find(row => row.eventId === acceptedOffer.submittedEventId);
acceptedOffer.calculationSnapshot.calculation.planSensitivity.usedDirectCosts[0].amountCents += 1;
acceptedEvent.payload.calculationSnapshot.calculation.planSensitivity.usedDirectCosts[0].amountCents += 1;
assert.throws(() => validateV3RunState(acceptedAttack), /snapshot|binding|sensitivity/i, 'accepted offer snapshot cannot be coordinatedly edited after acceptance');
assert.equal(acceptedSnapshot.calculation.planSensitivity.usedDirectCosts[0].amountCents, 111, 'acceptance retains the original offer snapshot');
console.log('A02 T-0063 L4 offer sensitivity submit/save/restore/accept integrity regressions: PASS');
