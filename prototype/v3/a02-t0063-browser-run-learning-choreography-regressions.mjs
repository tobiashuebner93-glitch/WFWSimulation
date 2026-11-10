import assert from 'node:assert/strict';
import {
  closeRunDay, createRunFromInputs, createRunSaveEnvelope, getRunProjection,
  answerRunLearning, installRunOperatingResources, openNextRunDay, prepareRunLearningUi,
  restoreRunSaveEnvelope,
} from './run.js';

const profile = 'V3-PLAN-INDEX-SYNTH-EQUAL-1';
const expectProfile = (state, phase) => {
  assert.equal(state.costPlanFixtureId, profile, `${phase}: selected cost-plan profile remains in root RunState`);
  assert.ok(state.runId.endsWith(`|${profile}`), `${phase}: selected profile remains bound to Run-ID`);
};

let run = createRunFromInputs({
  scenarioId: 'A02-BROWSER-LEARNING-CHOREOGRAPHY', seed: 'seed-v3-001',
  startDate: '2027-01-04', endDate: '2027-02-12', macroPath: 'UPSWING', costPlanFixtureId: profile,
});
expectProfile(run, 'after createRunFromInputs');

// The browser calls prepareRunLearningUi on every render, including setup.
run = prepareRunLearningUi(run).state;
expectProfile(run, 'after pre-resource render');
run = installRunOperatingResources(run, {
  peopleJson: '[]', equipmentJson: '[]', materialsJson: '[]', commitmentsJson: '[]',
  finishedGoodsCapacity: '0', finishedGoodsUsed: '0',
});
run = prepareRunLearningUi(run).state;
expectProfile(run, 'after resource capture and render');

let date = '2027-01-04';
while (date <= '2027-02-01') {
  const opened = openNextRunDay(run);
  const rendered = prepareRunLearningUi(opened.state);
  run = rendered.state;
  expectProfile(run, `after ${date} day-open render`);
  if (date === '2027-01-04' && rendered.items.length) {
    const firstQuestion = rendered.items[0];
    run = answerRunLearning(run, firstQuestion.id, firstQuestion.correctOption, date).state;
    run = prepareRunLearningUi(run).state;
    expectProfile(run, 'after learning answer and rerender');
  }
  if (date === '2027-02-01') break;
  run = closeRunDay(run).state;
  run = prepareRunLearningUi(run).state;
  expectProfile(run, `after ${date} day-close render`);
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  date = next.toISOString().slice(0, 10);
}

const projection = getRunProjection(run).businessCostPlanIndexes;
const febEffects = Object.fromEntries(projection.effects.map(effect => [effect.target, effect]));
for (const target of ['businessInputCostPlanIndex', 'wagePlanIndex', 'procurementPlanIndex']) {
  assert.equal(febEffects[target]?.status, 'projected', `${target} is available in the February browser choreography state`);
  assert.equal(febEffects[target]?.after, 110, `${target} is 110 in the selected synthetic fixture`);
  assert.equal(febEffects[target]?.sourceType, 'synthetic_fixture');
}

const finance = null;
const save = createRunSaveEnvelope(run, finance);
const serialized = JSON.parse(JSON.stringify(save));
const restored = restoreRunSaveEnvelope(serialized);
let restoredRun = prepareRunLearningUi(restored.runState).state;
expectProfile(restoredRun, 'after JSON save/restore and render');
const restoredEffects = Object.fromEntries(getRunProjection(restoredRun).businessCostPlanIndexes.effects.map(effect => [effect.target, effect]));
for (const target of ['businessInputCostPlanIndex', 'wagePlanIndex', 'procurementPlanIndex']) {
  assert.equal(restoredEffects[target]?.after, 110, `${target} survives UI-shaped save/restore`);
}

const tampered = structuredClone(serialized);
tampered.runState.costPlanFixtureId = 'NEUTRAL';
assert.throws(() => restoreRunSaveEnvelope(tampered), /fixture|run identity/i,
  'a selected-profile mutation fails closed during browser save restore');

console.log('A02 V3 browser run/learning choreography profile-preservation regressions: PASS (renders, resources, Jan-Feb, save/restore, mutation rejection, three 110 indices)');
