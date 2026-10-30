import {createLegacyBusinessTestGame as createInitialGame, createLegacyBusinessTestFinance as createInitialFinance} from './test-fixtures/legacy-business.js';
import assert from 'node:assert/strict';
import {  negotiateTemporaryAgency, bookTemporaryWorker, getSpaceUse, relocateFacility, TEMP_AGENCIES, getEmployeeWorkEfficiency } from './engine.js';
import { DAILY_ITEMS } from './learning-daily.js';

const game = createInitialGame();
assert.equal(TEMP_AGENCIES.length, 3);
for (const agency of TEMP_AGENCIES) {
  assert.equal(agency.pool.length, 10);
  assert.equal(new Set(agency.pool.map(w => w.id)).size, agency.pool.length);
  for (const worker of agency.pool) {
    assert.deepEqual(Object.keys(worker.competencies).sort(), ['fach', 'individual', 'methoden', 'sozial']);
    for (const key of Object.keys(worker.competencies)) assert.ok(worker.maxPotential[key] >= worker.competencies[key]);
  }
}
assert.ok(game.employees.every(e => Object.keys(e.maxPotential).every(k => e.maxPotential[k] >= e.competencies[k])));
assert.equal(game.employees[0].qualifications.machines.includes('CNC-01'), true);
assert.ok(getEmployeeWorkEfficiency({...game.employees[0], competencies:{fach:90,methoden:90,sozial:90,individual:90}, morale:90}) > getEmployeeWorkEfficiency({...game.employees[0], competencies:{fach:50,methoden:50,sozial:50,individual:50}, morale:50}));

const booked = createInitialGame();
booked.date = '2027-01-04';
assert.equal(negotiateTemporaryAgency(booked, 'balanced'), true);
assert.equal(relocateFacility(booked, 'site-4', 'rent'), true);
assert.ok(bookTemporaryWorker(booked, {skill:'PREP', count:2, duration:'week', orderId:'SHOULD-NOT-BIND'}));
const week = booked.temporaryWorkers.filter(w => w.agencyId === 'balanced');
assert.equal(week.length, 10, 'two workers are reserved for five workdays');
assert.equal(new Set(week.map(w => w.workerId)).size, 2);
assert.deepEqual([...new Set(week.map(w=>w.date))].length,5,'one workweek includes five simulation workdays, skipping holidays');
assert.ok(week.every(w => !booked.workPlan[w.date]?.[w.id]), 'booking remains unassigned to orders');
for (const date of [...new Set(week.map(w => w.date))]) assert.ok(getSpaceUse(booked,date).workplacePeople <= getSpaceUse(booked,date).workplaceCapacity);
assert.ok(bookTemporaryWorker(booked, {skill:'PREP', count:1, duration:'week'}), 'available pool members can be booked without double booking');
const reservedKeys=week.map(w=>`${w.date}:${w.workerId}`);assert.equal(new Set(reservedKeys).size,reservedKeys.length,'each worker appears once per date');
const holidayStart=createInitialGame();
assert.equal(negotiateTemporaryAgency(holidayStart,'flex'),true);
assert.ok(bookTemporaryWorker(holidayStart,{date:'2027-01-01',skill:'PREP',duration:'day'}));
assert.equal(holidayStart.temporaryWorkers[0].date,'2027-01-04','booking on a holiday starts the next workday');

const month = createInitialGame();
month.date = '2027-01-04';
negotiateTemporaryAgency(month, 'balanced');
relocateFacility(month, 'site-4', 'rent');
assert.ok(bookTemporaryWorker(month,{skill:'CNC',count:1,duration:'month'}));
assert.equal(month.temporaryWorkers.length, 20, 'one person is scheduled for 20 workdays');
assert.equal(new Set(month.temporaryWorkers.map(w=>w.date)).size,20);
assert.ok(month.temporaryWorkers.every(w => w.maxPotential.fach >= w.competencies.fach && w.qualifications.machines.includes('CNC-01')));
const summary = (await import('./finance.js')).closeMonthlyPeriod(createInitialFinance(), month, '2027-01', '2027-01-31');
assert.ok(summary.temporaryCost > 0, 'agency pool reservations flow into monthly billing');

const store = new Map();
globalThis.localStorage = {getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,String(value))};
const {renderDailyQuiz,renderLearningQuiz,handleLearningQuizClick} = await import('./learning-ui.js');
const items = DAILY_ITEMS, learningGame=createInitialGame();
const event=(selector,element)=>({target:{closest:value=>value===selector?element:null}});
const initialMorale=learningGame.employees.map(e=>e.morale), initialRep=learningGame.network.companyReputation;
let question=items[0];
assert.equal(handleLearningQuizClick(event('[data-learning-answer]',{dataset:{learningMode:'daily',learningAnswer:'ABCD'.replace(question.correctOption,'').slice(0,1)}}),learningGame.date,learningGame),true);
assert.equal(learningGame.learningDaily.answeredCount,1);
assert.ok(learningGame.employees.some((e,i)=>e.morale<initialMorale[i])||learningGame.network.companyReputation<initialRep,'wrong answer has a small in-game effect');
for(let i=1;i<5;i++){
  handleLearningQuizClick(event('[data-learning-next]',{dataset:{learningMode:'daily'}}),learningGame.date,learningGame);
  question=items[i];
  handleLearningQuizClick(event('[data-learning-answer]',{dataset:{learningMode:'daily',learningAnswer:question.correctOption}}),learningGame.date,learningGame);
}
assert.equal(learningGame.learningDaily.answeredCount,5);
assert.match(renderLearningQuiz(learningGame.date), /Alle Bereiche \(540\)/, 'daily cap must not hide the shared examination library');
handleLearningQuizClick(event('[data-learning-next]',{dataset:{learningMode:'daily'}}),learningGame.date,learningGame);
question=items[5];
handleLearningQuizClick(event('[data-learning-answer]',{dataset:{learningMode:'daily',learningAnswer:question.correctOption}}),learningGame.date,learningGame);
assert.equal(learningGame.learningDaily.answeredCount,5,'sixth daily response is blocked');
renderDailyQuiz('2027-01-04',learningGame);
assert.equal(learningGame.learningDaily.answeredCount,0,'daily allowance resets on next simulation date');

console.log(JSON.stringify({agencyPools:TEMP_AGENCIES.map(a=>({agency:a.name,workers:a.pool.length})),weekReservations:week.length,monthWorkdays:month.temporaryWorkers.length,capacityBound:true,orderBinding:false,performanceDependsOnSkillsAndMotivation:true,dailyQuizLimit:5,dailyReset:true},null,2));
