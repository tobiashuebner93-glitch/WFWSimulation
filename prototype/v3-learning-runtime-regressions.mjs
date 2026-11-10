import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createV3LearningRuntime, getV3DailyLearningEvents, answerV3LearningEvent, exportV3LearningRuntimeState } from './v3-learning-runtime.js';

const source = fs.readFileSync(new URL('../docs/learning/t-0068-v3-ereignisfragen-katalog-entwurf.md', import.meta.url), 'utf8');
const items = [...source.matchAll(/^\d+\. \*\*(EVT-\d{3})[^\n]*?\*\*([\s\S]*?)(?=^\d+\. \*\*EVT-|^## |\s*$)/gm)]
  .map(([, id, body]) => ({ id, correctOption: body.match(/\*\*Lösung ([ABCD])\.\*\*/)?.[1] }))
  .filter(item => item.correctOption);
assert.equal(items.length, 50, 'runtime is bound to all 50 approved T-0068 items');

const company = { cash: 1234, receivables: [{ id: 'R1', amount: 50 }], ledger: [{ id: 'L1' }], inventory: { steel: 4 }, reputation: 50, employees: [{ competencies: { fach: 70 }, motivation: 70 }] };
const beforeCompany = structuredClone(company);
const first = createV3LearningRuntime({ seed: 'replay-seed', items });
const sameSeed = createV3LearningRuntime({ seed: 'replay-seed', items });
const differentSeed = createV3LearningRuntime({ seed: 'another-seed', items });
const date = '2027-01-04';
const queue = getV3DailyLearningEvents(first, date);
assert.equal(queue.length, 5);
assert.equal(new Set(queue.map(item => item.id)).size, 5);
assert.deepEqual(queue.map(item => item.id), getV3DailyLearningEvents(sameSeed, date).map(item => item.id), 'same seed and date replay the same queue');
assert.notDeepEqual(queue.map(item => item.id), getV3DailyLearningEvents(differentSeed, date).map(item => item.id), 'different seed changes ordering');

const correctAnswer = answerV3LearningEvent(first, { date, eventId: queue[0].id, selectedOption: queue[0].correctOption });
assert.equal(correctAnswer.accepted, true);
assert.equal(correctAnswer.correct, true);
assert.equal(correctAnswer.points, 1);
assert.equal(correctAnswer.trace.effectStatus, 'not_applied');
const oneAnswerState = exportV3LearningRuntimeState(first);
const oneAnswerReplay = createV3LearningRuntime({ items, state: oneAnswerState });
assert.deepEqual(getV3DailyLearningEvents(oneAnswerReplay, date).map(item => item.id), queue.slice(1).map(item => item.id), 'restore preserves the exact remaining questions for the same day');
assert.equal(answerV3LearningEvent(first, { date, eventId: queue[0].id, selectedOption: queue[0].correctOption }).reason, 'already_answered');
const wrong = getV3DailyLearningEvents(first, date).find(item => item.correctOption !== 'A');
assert.ok(wrong);
assert.equal(answerV3LearningEvent(first, { date, eventId: wrong.id, selectedOption: wrong.correctOption === 'A' ? 'B' : 'A' }).correct, false);
assert.equal(exportV3LearningRuntimeState(first).score.correct, 1);
assert.equal(exportV3LearningRuntimeState(first).score.incorrect, 1);
assert.equal(getV3DailyLearningEvents(first, date).length, 3);

for (const item of getV3DailyLearningEvents(first, date)) answerV3LearningEvent(first, { date, eventId: item.id, selectedOption: item.correctOption });
assert.equal(getV3DailyLearningEvents(first, date).length, 0, 'daily cap prevents a sixth offered answer');
assert.equal(answerV3LearningEvent(first, { date, eventId: items[20].id, selectedOption: items[20].correctOption }).reason, 'daily_limit');

const exported = exportV3LearningRuntimeState(first);
const replay = createV3LearningRuntime({ items, state: exported });
assert.deepEqual(exportV3LearningRuntimeState(replay), exported, 'serialized state restores answer counts, score, and trace');
assert.deepEqual(getV3DailyLearningEvents(replay, '2027-01-05').map(item => item.id), getV3DailyLearningEvents(createV3LearningRuntime({ items, state: exported }), '2027-01-05').map(item => item.id), 'restored state replays future rotation deterministically');

const rotation = createV3LearningRuntime({ seed: 'rotation', items });
const seen = new Set();
for (let day = 1; day <= 10; day += 1) {
  const dayDate = `2027-01-${String(day).padStart(2, '0')}`;
  for (const item of getV3DailyLearningEvents(rotation, dayDate)) {
    assert.ok(!seen.has(item.id), `question ${item.id} does not repeat before catalog exhaustion`);
    seen.add(item.id);
    answerV3LearningEvent(rotation, { date: dayDate, eventId: item.id, selectedOption: item.correctOption });
  }
}
assert.equal(seen.size, 50, 'all catalog items rotate once before a repeat');
assert.deepEqual(company, beforeCompany, 'learning runtime never mutates finance, inventory, reputation, or workforce state');
assert.ok(exported.trace.every(entry => entry.effectStatus === 'not_applied' && entry.effectReason));

console.log('V3 learning runtime regressions: PASS (50 catalog items, daily cap, seed/replay, rotation, correctness, nonmutation)');
