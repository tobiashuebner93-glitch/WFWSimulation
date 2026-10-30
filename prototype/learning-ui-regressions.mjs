import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { WBQ_ITEMS, WBQ_AREAS } from './learning-wbq.js';
import { hsqQuestions, areas as HSQ_AREAS } from './learning-hsq.js';
import { SUPPLEMENTAL_ITEMS } from './learning-supplemental.js';
import { DAILY_ITEMS } from './learning-daily.js';
const records = new Map();
globalThis.localStorage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, String(value)) };
const { renderDailyQuiz, renderLearningQuiz, renderExamSession, handleExamSessionClick, handleExamSessionChange, getExamSessionSnapshot, getLearningDebriefs, handleLearningQuizClick, handleLearningQuizChange, getLearningProgressSnapshot, focusPracticeCompetence } = await import('./learning-ui.js');
const core = [...WBQ_ITEMS, ...hsqQuestions];
const all = [...core, ...SUPPLEMENTAL_ITEMS];
const areas = [...WBQ_AREAS, ...HSQ_AREAS];
const stylesheet = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
assert.match(stylesheet, /\.exam-session\s+#exam-area\s*\{[^}]*min-width:\s*0[^}]*width:\s*100%[^}]*max-width:\s*100%[^}]*box-sizing:\s*border-box/s, 'Exam-area select must stay within the exam card on narrow screens');
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
const localStorageBeforeExam = new Map(records);
assert.match(renderExamSession(), /Neun Fragen, eine je Prüfungsbereich/);
const examEvent = (action, answer) => ({target:{closest:selector=>selector==='[data-exam-action]'&&action?{dataset:{examAction:action}}:selector==='[data-exam-answer]'&&answer?{dataset:{examAnswer:answer}}:null}});
assert.equal(handleExamSessionClick(examEvent('start')),true);
let exam = getExamSessionSnapshot();
assert.equal(exam.items.length,9);
assert.equal(new Set(exam.items.map(item=>item.areaId)).size,9,'mixed exam covers every area');
for (const tier of ['basic','applied','transfer']) assert.equal(exam.items.filter(item=>item.difficulty===tier).length,3,`${tier} appears three times`);
assert.doesNotMatch(renderExamSession(),/<p><b>Lösung:|class="status warn"/,'answers stay hidden before submission');
for (let i=0;i<exam.items.length;i++) {
  exam=getExamSessionSnapshot();
  assert.equal(handleExamSessionClick(examEvent(null,exam.items[exam.position].correctOption)),true);
  if(i<exam.items.length-1) assert.equal(handleExamSessionClick(examEvent('next')),true);
}
assert.equal(handleExamSessionClick(examEvent('submit')),true);
let examHtml=renderExamSession();
assert.match(examHtml,/9 von 9 richtig/);
assert.match(examHtml,/Quelle und Kompetenzbezug/);
assert.deepEqual(new Map(records),localStorageBeforeExam,'exam round does not touch practice/daily storage');
assert.equal(JSON.stringify(dailyGame),afterDaily,'exam round does not mutate business or finance state');
assert.equal(handleExamSessionClick(examEvent('reset')),true);
const oneArea=areas[0];
const selectEvent={target:{closest:selector=>selector==='[data-exam-area]'?{value:oneArea.id}:null}};
assert.equal(handleExamSessionChange(selectEvent),true);
examHtml=renderExamSession(); assert.match(examHtml,new RegExp(oneArea.id));
assert.equal(handleExamSessionClick(examEvent('start')),true);
exam=getExamSessionSnapshot();
assert.equal(exam.items.length,9); assert.equal(new Set(exam.items.map(item=>item.areaId)).size,1);
for(const tier of ['basic','applied','transfer']) assert.equal(exam.items.filter(item=>item.difficulty===tier).length,3);
const debriefs=getLearningDebriefs([
  {date:'2027-01-01',phase:1,kind:'NEUAUFTRAG',text:'Neue Anfrage'},
  {date:'2027-01-02',phase:2,kind:'MATERIALZUGANG',text:'Stahl eingetroffen'},
  {date:'2027-01-03',phase:8,kind:'SIMTAX_ZAHLUNG',text:'Steuer bezahlt'},
  {date:'2027-01-04',phase:1,kind:'URLAUB',text:'Urlaub geplant'}
]);
assert.deepEqual(new Set(debriefs.map(row=>row.key)),new Set(['orders','logistics','finance','people']));
assert.ok(debriefs.every(row=>row.competenceIds.some(id=>focusPracticeCompetence([id]))),'debrief links resolve to existing learning cards');
console.log('PASS: 540-item pool; 20 questions per tier/area; five-question daily cap; isolated nine-area exam rounds; neutral event debrief links');

