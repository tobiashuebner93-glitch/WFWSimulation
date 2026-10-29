import assert from 'node:assert/strict';
import { WBQ_ITEMS, WBQ_AREAS } from './learning-wbq.js';
import { hsqQuestions, areas as HSQ_AREAS } from './learning-hsq.js';
import { SUPPLEMENTAL_ITEMS } from './learning-supplemental.js';
import { DAILY_ITEMS } from './learning-daily.js';
const records = new Map();
globalThis.localStorage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, String(value)) };
const { renderDailyQuiz, renderLearningQuiz, handleLearningQuizClick, handleLearningQuizChange, getLearningProgressSnapshot } = await import('./learning-ui.js');
const core = [...WBQ_ITEMS, ...hsqQuestions];
const all = [...core, ...SUPPLEMENTAL_ITEMS];
const areas = [...WBQ_AREAS, ...HSQ_AREAS];
assert.equal(core.length, 450);
assert.equal(SUPPLEMENTAL_ITEMS.length, 90);
assert.equal(all.length, 540);
assert.equal(new Set(areas.map(area => area.id)).size, 9);
assert.equal(new Set(DAILY_ITEMS.map(item => item.correctOption)).size, 4, 'daily answers must not always occupy one position');
for (const area of areas) {
  const coreAreaItems = core.filter(item => item.areaId === area.id);
  assert.equal(coreAreaItems.length, 50, `${area.id} core count`);
  assert.equal(new Set(coreAreaItems.map(item => item.id)).size, 50, `${area.id} core IDs are unique`);
  for (const [tier, count] of [['basic',20],['applied',15],['transfer',15]]) {
    assert.equal(coreAreaItems.filter(item => item.difficulty === tier).length, count, `${area.id} ${tier} core count`);
  }
  const items = all.filter(item => item.areaId === area.id);
  assert.equal(items.length, 60, `${area.id} item count`);
  for (const tier of ['basic','applied','transfer']) assert.equal(items.filter(item => item.difficulty === tier).length, 20, `${area.id} ${tier} count`);
}
for (const item of SUPPLEMENTAL_ITEMS) {
  const source = core.find(candidate => candidate.areaId === item.areaId && candidate.competenceId === item.competenceId);
  assert.ok(source, `${item.id} has matched source and competency`);
  assert.ok(item.sourceRef, `${item.id} has a source reference`);
  assert.ok(item.sourceKind.includes(source.id), `${item.id} cites matched source item`);
  assert.ok(item.sourceKind.includes(item.difficulty === 'transfer' ? 'Transferfall' : 'Anwendungsfall'), `${item.id} source kind matches difficulty`);
  assert.doesNotMatch(item.companyEffect, /Spielstand noch Hauptbuch|Hauptbuch oder Kennzahlen/, `${item.id} company effect is not UI metadata`);
  assert.equal(new Set(item.options).size, 4, `${item.id} has four distinct answer options`);
  assert.ok(item.explanation && item.companyEffect && item.tooltipKey);
}
const gameAndFinance = { game: { date: '2027-01-01', cash: 30000, orders: [] }, finance: { cash: 30000, ledger: [] } };
const before = JSON.stringify(gameAndFinance);
let html = renderLearningQuiz('2027-01-01');
assert.match(html, /540/); assert.match(html, /WBQ/); assert.match(html, /HSQ/);
const first = core[0];
const eventFor = (selector, element) => ({ target: { closest: value => value === selector ? element : null } });
assert.equal(handleLearningQuizClick(eventFor('[data-learning-answer]', { dataset: { learningAnswer: first.correctOption } }), '2027-01-01'), true);
html = renderLearningQuiz('2027-01-01');
assert.match(html, /Richtig/); assert.ok(html.includes(first.explanation)); assert.ok(html.includes(first.companyEffect));
let progress = getLearningProgressSnapshot();
assert.equal(progress[first.id].attempts, 1); assert.equal(progress[first.id].correct, 1); assert.equal(progress[first.id].nextReviewAt, '2027-01-02');
assert.equal(JSON.stringify(gameAndFinance), before, 'practice answer must not mutate game or finance state');
assert.equal(handleLearningQuizClick(eventFor('[data-learning-next]', {}), '2027-01-01'), true);
html = renderLearningQuiz('2027-01-01');
const second = core[2];
const wrongAnswer = 'ABCD'.split('').find(letter => letter !== second.correctOption);
assert.equal(handleLearningQuizClick(eventFor('[data-learning-answer]', { dataset: { learningAnswer: wrongAnswer } }), '2027-01-01'), true);
html = renderLearningQuiz('2027-01-01');
assert.match(html, /Noch nicht richtig/); assert.match(html, new RegExp(`Lösung ${second.correctOption}`));
assert.equal(JSON.stringify(gameAndFinance), before, 'incorrect practice answer must not mutate game or finance state');
const chosenArea = WBQ_AREAS[1];
assert.equal(handleLearningQuizChange(eventFor('[data-learning-area]', { value: chosenArea.id })), true);
html = renderLearningQuiz('2027-01-01'); assert.ok(html.includes(chosenArea.name || chosenArea.title)); assert.match(html, /Rechnungswesen \(WBQ\) · 60/);
const dailyGame = { date:'2027-01-01', learningDaily:{date:'2027-01-01',answeredCount:0}, employees:[{id:'E-1',name:'Test',morale:70,competencies:{fach:70,methoden:70,sozial:70,individual:70},maxPotential:{fach:90,methoden:90,sozial:90,individual:90}}], network:{companyReputation:70}, events:[] };
const dailyBefore = JSON.stringify(dailyGame);
assert.match(renderDailyQuiz(dailyGame.date,dailyGame), /Tagesfrage/);
for (let i=0;i<5;i++) {
  const dailyHtml=renderDailyQuiz(dailyGame.date,dailyGame);
  assert.match(dailyHtml, new RegExp(`${i}\/5 heute`));
  assert.equal(handleLearningQuizClick(eventFor('[data-learning-answer]', {dataset:{learningMode:'daily',learningAnswer:'A'}}), dailyGame.date, dailyGame), true);
  if (i<4) assert.equal(handleLearningQuizClick(eventFor('[data-learning-next]', {dataset:{learningMode:'daily'}}), dailyGame.date, dailyGame), true);
}
assert.equal(dailyGame.learningDaily.answeredCount,5);
assert.match(renderDailyQuiz(dailyGame.date,dailyGame), /5\/5 heute/);
assert.notEqual(JSON.stringify(dailyGame),dailyBefore,'daily answers may apply modeled small effects');
const afterDaily=JSON.stringify(dailyGame);
const practiceItem=core[2];
assert.equal(handleLearningQuizClick(eventFor('[data-learning-answer]', {dataset:{learningMode:'practice',learningAnswer:practiceItem.correctOption}}),dailyGame.date,dailyGame),true);
assert.equal(JSON.stringify(dailyGame),afterDaily,'practice answers must not mutate game state');
assert.match(renderLearningQuiz(dailyGame.date), /540/);
console.log('PASS: 540-item shared learning pool; 20 per tier/area; explicit source links; 5-question daily cap; mode-separated effects and review progress');

