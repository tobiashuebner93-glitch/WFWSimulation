import assert from 'node:assert/strict';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';
import {
  createFinanceStateForRun, createRunFromInputs, createRunSaveEnvelope,
  getRunProjection, restoreRunSaveEnvelope,
} from './v3/run.js';
import { openV3RunDay } from './v3-run-orchestrator.js';

const specs = {
  fiscal: { scope: { publicSegmentRef: 'segment:public' }, delta: 2, expected: 102 },
  growth: { scope: { adoptionRef: 'adoption:investment' }, delta: 2, expected: 102 },
  tariff: { scope: { coveredEmployeeScopeRef: 'employees:future-terms' }, delta: 1, expected: 101 },
  labor_market: { scope: { skillScopeRef: 'skill:machining' }, delta: 5, expected: 105 },
  environmental: { scope: { adoptionRef: 'adoption:efficiency', assetScopeRef: 'asset:machine-1' }, delta: -2, expected: 98 },
  demand_oriented: { scope: { segmentScopeRef: 'segment:domestic' }, delta: 5, expected: 5 },
  supply_oriented: { scope: { adoptionRef: 'adoption:training' }, delta: -2, expected: 98 },
};
const policyNames = Object.keys(specs);
function makeSharedRun(input, scenarioId = 'policy-scenario') {
  const initial = createRunFromInputs({ scenarioId, seed: 'seed-policy', startDate: '2027-01-04', endDate: '2027-01-16', macroPath: 'UPSWING' });
  const opened = openV3RunDay(initial, { date: '2027-01-04', macroMonthInput: input });
  assert.equal(opened.ok, true, opened.error?.message);
  return opened.state;
}
const build = ({ period = '2027-01', overrides = {}, allNeutral = false, scenarioId } = {}) => {
  const input = buildRunMacroMonthInput({ period, path: 'UPSWING' });
  for (const name of policyNames) {
    const spec = specs[name];
    const override = overrides[name] ?? {};
    Object.assign(input.policyChannels[name], {
      delta: allNeutral ? 0 : spec.delta,
      firmExposureFactor: allNeutral ? 0 : 1,
      ...spec.scope,
      effectGroupId: `group:${name}`,
      intermediateIndicator: `indicator:${name}`,
      lagPeriods: 0,
      ...Object.fromEntries(Object.entries(override).filter(([, value]) => value !== undefined)),
    });
    for (const [key, value] of Object.entries(override)) if (value === undefined) delete input.policyChannels[name][key];
  }
  return { runState: makeSharedRun(input, scenarioId), input };
};

const first = build();
const beforeRun = structuredClone(first.runState);
const financeState = createFinanceStateForRun(first.runState);
const beforeFinance = structuredClone(financeState);
const projection = getRunProjection(first.runState, financeState).macroPolicyImpact;
assert.equal(projection.effects.length, 7);
assert.equal(projection.directFinanceEffect, false);
assert.equal(projection.runId, first.runState.runId);
for (const [channel, spec] of Object.entries(specs)) {
  const effect = projection.effects.find(row => row.channel === channel);
  assert.ok(effect, `missing ${channel}`);
  assert.equal(effect.after, spec.expected, `${channel} signed scenario direction`);
  assert.equal(effect.actualStateChanged, false);
  assert.equal(effect.accountingClass, 'information_plan');
  if (channel === 'demand_oriented') assert.match(effect.invariant, /D-0169 total inquiries unchanged/);
}
assert.deepEqual(first.runState, beforeRun, 'projection does not mutate run state');
assert.deepEqual(financeState, beforeFinance, 'projection does not mutate finance state');

// Reverse-direction pairs and declared per-event caps remain explicit.
for (const channel of policyNames) {
  const reverse = build({ overrides: { [channel]: { delta: -1 } }, scenarioId: `reverse-${channel}` });
  const effect = getRunProjection(reverse.runState).macroPolicyImpact.effects.find(row => row.channel === channel);
  assert.ok(effect, `${channel} reverse direction is traceable`);
  if (channel === 'growth') assert.equal(effect.contribution, 0, 'growth channel is potential-only and positive-direction capped by contract');
  else assert.equal(effect.contribution, -1, `${channel} reverse direction`);
}
const cappedFiscal = build({ overrides: { fiscal: { delta: 99 } }, scenarioId: 'fiscal-cap' });
assert.equal(getRunProjection(cappedFiscal.runState).macroPolicyImpact.effects.find(row => row.channel === 'fiscal').contribution, 2, 'fiscal scenario sensitivity is capped at the contract limit');

const neutralOverrides = Object.fromEntries(policyNames.map(name => [name, { firmExposureFactor: 0 }]));
assert.equal(getRunProjection(build({ overrides: neutralOverrides, scenarioId: 'exposure-zero' }).runState).macroPolicyImpact.effects.length, 0, 'exposure 0 is neutral');
const missingExposure = build({ overrides: Object.fromEntries(policyNames.map(name => [name, { firmExposureFactor: undefined }])), scenarioId: 'exposure-missing' });
assert.equal(getRunProjection(missingExposure.runState).macroPolicyImpact.effects.length, 0, 'missing exposure is neutral');
const missingScope = build({ overrides: { environmental: { assetScopeRef: undefined } }, scenarioId: 'scope-missing' });
assert.equal(getRunProjection(missingScope.runState).macroPolicyImpact.effects.some(row => row.channel === 'environmental'), false, 'environment without asset scope is neutral');

// A numeric scope reference is rejected even when it appears in the authoritative input.
const invalidType = build({ overrides: { fiscal: { publicSegmentRef: 42 } }, scenarioId: 'scope-type' });
assert.throws(() => getRunProjection(invalidType.runState), /publicSegmentRef must be a non-empty string/);

// Lag remains bound to the source input and cannot contribute before effectivePeriod.
const laggedInput = buildRunMacroMonthInput({ period: '2027-01', path: 'UPSWING' });
Object.assign(laggedInput.policyChannels.tariff, {
  delta: 1, firmExposureFactor: 1, coveredEmployeeScopeRef: 'employees:future-terms',
  effectGroupId: 'group:tariff-lag', intermediateIndicator: 'indicator:tariff-lag', lagPeriods: 1,
});
const laggedRun = makeSharedRun(laggedInput, 'lagged-run');
assert.equal(getRunProjection(laggedRun).macroPolicyImpact.effects.length, 0, 'one-month lag is not applied early');

// Shared-group policy measures contribute only once through the authoritative replay.
const duplicateInput = buildRunMacroMonthInput({ period: '2027-01', path: 'UPSWING' });
for (const name of policyNames) Object.assign(duplicateInput.policyChannels[name], {
  delta: 1, firmExposureFactor: 1, effectGroupId: 'shared-upgrade', intermediateIndicator: 'shared-indicator',
  adoptionRef: 'adoption:shared', publicSegmentRef: 'segment:public', coveredEmployeeScopeRef: 'employees:future-terms',
  skillScopeRef: 'skill:machining', assetScopeRef: 'asset:machine-1', segmentScopeRef: 'segment:domestic',
});
const dedupedRun = makeSharedRun(duplicateInput, 'dedupe-run');
assert.equal(getRunProjection(dedupedRun).macroPolicyImpact.effects.length, 1, 'shared policy measure contributes once');

// A09 coordinated-history repro: mutate every saved history copy, but keep day-open input/fingerprint unchanged.
const neutral = build({ allNeutral: true, scenarioId: 'coordinated-mutation' });
const corrupt = structuredClone(neutral.runState);
const mutateFiscal = row => Object.assign(row, {
  delta: 10, newValue: 10, firmExposureFactor: 1, publicSegmentRef: 'segment:public',
  effectGroupId: 'mutated-group', intermediateIndicator: 'mutated-indicator',
});
for (const event of corrupt.modules.macro.events.filter(row => row.channel === 'policy' && row.eventKey === 'fiscal')) mutateFiscal(event);
const snapshot = corrupt.modules.macro.periods[0];
for (const event of snapshot.scheduledEvents.filter(row => row.channel === 'policy' && row.eventKey === 'fiscal')) mutateFiscal(event);
for (const event of snapshot.effectiveMacroEvents.filter(row => row.channel === 'policy' && row.eventKey === 'fiscal')) mutateFiscal(event);
mutateFiscal(snapshot.policyChannels.fiscal);
assert.equal(corrupt.dayOpenFingerprints['2027-01-04'], neutral.runState.dayOpenFingerprints['2027-01-04'], 'day-open source remains unchanged in repro');
assert.throws(() => createRunSaveEnvelope(corrupt), /authoritative day-open input|deterministic replay/);
const validEnvelope = createRunSaveEnvelope(neutral.runState);
validEnvelope.runState = corrupt;
assert.throws(() => restoreRunSaveEnvelope(validEnvelope), /authoritative day-open input|deterministic replay/);

// Same inputs replay and restore identically.
const replayed = openV3RunDay(first.runState, { date: '2027-01-04', macroMonthInput: first.input });
assert.equal(replayed.ok, true); assert.equal(replayed.duplicate, true);
assert.deepEqual(getRunProjection(replayed.state).macroPolicyImpact, projection);
const envelope = createRunSaveEnvelope(first.runState, financeState);
assert.deepEqual(getRunProjection(restoreRunSaveEnvelope(envelope).runState, financeState).macroPolicyImpact, projection);
console.log('V3 macro policy impact regression: PASS (authoritative replay, typed scopes, seven channels, neutral/direction/lag/dedupe, save/restore, finance non-mutation)');
