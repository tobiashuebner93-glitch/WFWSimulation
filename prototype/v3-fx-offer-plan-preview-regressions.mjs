import assert from 'node:assert/strict';
import {
  createFinanceStateForRun, createRunFromInputs, createRunSaveEnvelope,
  installRunOperatingResources, openNextRunDay, closeRunDay,
  previewRunOfferFxPlan, restoreRunSaveEnvelope, submitRunOffer,
} from './v3/run.js';
import { getV3MarketPlayerView } from './v3-market-simulation.js';
import { V3_FX_OFFER_PLAN_FIXTURE_ID } from './v3-run-macro-fixture.js';

const base = {
  scenarioId: 'T0070-FX-OFFER-PREVIEW', seed: 'fx-offer-seed',
  startDate: '2027-01-04', endDate: '2027-03-15', macroPath: 'UPSWING',
  fxOfferPlanFixtureId: V3_FX_OFFER_PLAN_FIXTURE_ID,
};
let state = createRunFromInputs(base);
assert.equal(state.runId.split('|').length, 9, 'fixture selection is bound by an explicit run ID tail');
state = installRunOperatingResources(state, {
  peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]',
  finishedGoodsCapacity: 0, finishedGoodsUsed: 0,
});
const finance = createFinanceStateForRun(state);
while (state.currentDate < '2027-03-01') state = closeRunDay(openNextRunDay(state).state).state;
state = openNextRunDay(state).state;
const inquiry = getV3MarketPlayerView(state.modules.market).inquiries.find(row => row.status === 'open' && !row.ownOffer);
assert.ok(inquiry, 'March run has a real open, unsubmitted inquiry to preview');

const stateBefore = structuredClone(state);
const financeBefore = structuredClone(finance);
const preview = previewRunOfferFxPlan(state, {
  inquiryId: inquiry.inquiryId, planId: 'T0070-IMPORT-PLAN-1',
  planBasisCents: 100_000, playerNetPriceCents: 175_000,
  planBasisCurrency: 'EUR', importCurrency: 'USD', importExposureFactor: 1,
});
assert.equal(preview.status, 'ready');
assert.equal(preview.effectivePeriod, '2027-03');
assert.equal(preview.observedPeriod, '2027-02');
assert.equal(preview.lagPeriods, 1);
assert.equal(preview.hypotheticalPlanCents, 101_250, 'synthetic 5% FX move passes through 25% into the plan-only index');
assert.equal(preview.playerNetPriceCents, 175_000, 'player entered net offer price is returned unchanged');
assert.equal(preview.sourceType, 'synthetic_fixture');
assert.equal(preview.directFinanceEffect, false);
assert.equal(preview.actualStateChanged, false);
assert.equal(preview.ecbReferenceContext.role, 'context_only_not_used_as_transaction_quote_or_cost');
assert.deepEqual(state, stateBefore, 'preview does not write to the run state');
assert.deepEqual(finance, financeBefore, 'preview does not write to finance state');

assert.equal(previewRunOfferFxPlan(state, { inquiryId: inquiry.inquiryId, planId: 'T0070-IMPORT-PLAN-1', planBasisCents: 100_000, playerNetPriceCents: 175_000 }).status, 'neutral', 'missing currency/exposure is neutral');
assert.equal(previewRunOfferFxPlan(state, { inquiryId: inquiry.inquiryId, planId: 'foreign-plan', planBasisCents: 100_000, planBasisCurrency: 'EUR', importCurrency: 'USD', importExposureFactor: 1 }).status, 'blocked', 'foreign plan ID fails closed');
assert.equal(previewRunOfferFxPlan(state, { inquiryId: inquiry.inquiryId, planId: 'T0070-IMPORT-PLAN-1', planBasisCents: 100_000, planBasisCurrency: 'EUR', importCurrency: 'EUR', importExposureFactor: 1 }).status, 'blocked', 'unbound currency fails closed');
assert.equal(previewRunOfferFxPlan(state, { inquiryId: 'missing-inquiry', planId: 'T0070-IMPORT-PLAN-1', planBasisCents: 1, planBasisCurrency: 'EUR', importCurrency: 'USD', importExposureFactor: 1 }).status, 'blocked', 'unknown inquiry fails closed');

const restored = restoreRunSaveEnvelope(createRunSaveEnvelope(state, finance));
assert.deepEqual(previewRunOfferFxPlan(restored.runState, {
  inquiryId: inquiry.inquiryId, planId: 'T0070-IMPORT-PLAN-1', planBasisCents: 100_000,
  playerNetPriceCents: 175_000, planBasisCurrency: 'EUR', importCurrency: 'USD', importExposureFactor: 1,
}), preview, 'save/restore reproduces the exact preview and provenance');

const submitted = submitRunOffer(state, inquiry, {
  netPrice: '1750,00', costVersion: 'COST-T0070', babVersion: 'BAB-T0070',
  directCostsJson: '[]',
  sourcePoolsJson: JSON.stringify([{ poolId: 'T0070-POOL', sourceCostCenterId: 'CC-SRC', costBasisId: 'BASIS', period: '2027-03', poolEuro: '1,00', allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '1' }] }]),
  offerDriversJson: JSON.stringify([{ poolId: 'T0070-POOL', costCenterId: 'CC-PROD', period: '2027-03', basisKind: 'driver', quantity: '1', unitLabel: 'h' }]),
});
const submittedInquiry = getV3MarketPlayerView(submitted.state.modules.market).inquiries.find(row => row.inquiryId === inquiry.inquiryId);
assert.equal(submittedInquiry.ownOffer.netPriceCents, 175_000, 'submission preserves the player net price');
assert.equal(previewRunOfferFxPlan(submitted.state, {
  inquiryId: inquiry.inquiryId, planId: 'T0070-IMPORT-PLAN-1', planBasisCents: 100_000,
  playerNetPriceCents: 175_000, planBasisCurrency: 'EUR', importCurrency: 'USD', importExposureFactor: 1,
}).status, 'blocked', 'submitted offer cannot receive a later FX preview');

const neutral = createRunFromInputs({ ...base, scenarioId: 'T0070-FX-NEUTRAL', fxOfferPlanFixtureId: 'NEUTRAL' });
assert.equal(neutral.fxOfferPlanFixtureId, 'NEUTRAL', 'the unselected/default run remains neutral');
console.log('T-0070 FX offer-plan preview regression: PASS (explicit selection, one-month lag, open/unsubmitted offer guard, player R unchanged, neutral/missing/foreign fail-closed, replay, save/restore, nonposting)');
