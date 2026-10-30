import assert from 'node:assert/strict';
import { advanceOneDay, assignEmployeeToStage, assignEmployeeToTask, createInitialGame, getDailyCapacityHours, getDailyWorkloadPercent, hasManualDayAssignment } from './engine.js';
import { getTimelineBlockReason, getTimelineChoice, getTimelineWorkdays, setTimelineAssignment } from './planning-ui.js';
import { focusPracticeCompetence } from './learning-ui.js';

const workdays = getTimelineWorkdays('2019-01-04');
assert.deepEqual(workdays, ['2019-01-04', '2019-01-07', '2019-01-08', '2019-01-09', '2019-01-10']);
assert.ok(workdays.length <= 5);
assert.ok(workdays.every(date => ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay())));

const game = createInitialGame();
assert.equal(getDailyWorkloadPercent(8), 100, 'Eight hours are the 100% reference load');
assert.equal(getDailyWorkloadPercent(10), 125, 'Ten hours equal 125% load');
const owner=game.employees.find(person=>person.isOwner),regular={id:'REGULAR-EMPLOYEE'};
assert.equal(getDailyCapacityHours(owner), 8, 'Automatic owner capacity stops at the 100% reference load');
assert.equal(getDailyCapacityHours(owner,true), 12, 'A manually assigned owner can reach the 150% scenario ceiling');
assert.equal(getDailyCapacityHours(regular), 8, 'Automatic employee capacity stops at the 100% reference load');
assert.equal(getDailyCapacityHours(regular,true), 10, 'Manual employee assignment is capped at ten hours / 125%');
game.date = '2019-01-04';
const skilled = { id:'TIMELINE-CNC', name:'CNC Fachkraft', role:'Fertigung', skill:['CNC'], qualifications:{machines:['CNC-01']}, competencies:{fach:70}, vacationPlan:[], sickUntil:null, training:null };
const unskilled = { id:'TIMELINE-BASIC', name:'Allrounder', role:'Fertigung', skill:['BASIC'], qualifications:{machines:[]}, vacationPlan:[], sickUntil:null, training:null };
game.employees.push(skilled, unskilled);
const order = { id:'TIMELINE-ORDER', name:'Prüfauftrag', status:'BESTÄTIGT', generated:true, operationIndex:0, operationDone:0, closedAt:null, deliveredAt:null, rejectedAt:null, operations:[{name:'CNC Fräsen',skill:'CNC',totalHours:4},{name:'Entgraten',skill:'BASIC',totalHours:2}] };
game.orders.push(order);
const date = '2019-01-07';
assert.equal(getTimelineBlockReason(game, skilled, date, 1), '');
assert.equal(setTimelineAssignment(game, skilled.id, date, 'stage:TIMELINE-ORDER:0', 1), true);
assert.equal(getTimelineChoice(game, skilled.id, date), 'stage:TIMELINE-ORDER:0');
assert.equal(game.workPlan[date][skilled.id], order.id);
const previousSequence = structuredClone(game.dailyWorkSequence[date]);
assert.equal(setTimelineAssignment(game, unskilled.id, date, 'stage:TIMELINE-ORDER:0', 1), false, 'Skill mismatch must reject assignment');
assert.equal(getTimelineChoice(game, unskilled.id, date), 'auto');

assert.equal(setTimelineAssignment(game, skilled.id, date, 'stage:TIMELINE-ORDER:1', 1), false, 'A later stage still requires its own skill when preplanned');
assert.equal(getTimelineChoice(game, skilled.id, date), 'stage:TIMELINE-ORDER:0', 'A rejected change must preserve the previous valid assignment');
assert.deepEqual(game.dailyWorkSequence[date], previousSequence, 'A rejected change must restore the previous daily sequence queue too');
assert.equal(setTimelineAssignment(game, unskilled.id, date, 'stage:TIMELINE-ORDER:1', 1), true, 'Qualified staff can preplan the next stage; engine gates execution until its predecessor finishes');
const sick = { ...skilled, id:'TIMELINE-SICK', sickUntil:date };
game.employees.push(sick);
assert.equal(getTimelineBlockReason(game, sick, date, 1), 'Krank');
assert.equal(setTimelineAssignment(game, sick.id, date, 'stage:TIMELINE-ORDER:1', 1), false);
const vacation = { ...skilled, id:'TIMELINE-VACATION', vacationPlan:[date] };
assert.equal(getTimelineBlockReason(game, vacation, date, 1), 'Urlaub');
const temp={id:'AGENCY-1',workerId:'AGENCY-1',name:'Leihkraft',temp:true,skill:['PREP'],date:'2019-01-07'};
game.temporaryWorkers=[temp];
assert.equal(getTimelineBlockReason(game,temp,'2019-01-07',1),'');
assert.equal(getTimelineBlockReason(game,temp,'2019-01-08',2),'Nicht gebucht');

const autoLoadGame=createInitialGame();
autoLoadGame.date='2019-01-02';
autoLoadGame.orders.push({id:'OWNER-AUTO-CAP',name:'Automatiklimit prüfen',status:'BESTÄTIGT',generated:true,closedAt:null,deliveredAt:null,rejectedAt:null,dueDate:'2019-01-03',planningHours:0,planningDone:0,operations:[{id:1,name:'Handarbeit',skill:'BASIC',totalHours:11,machineHours:0}],operationIndex:0,operationDone:0,quantity:0,materials:{}});
advanceOneDay(autoLoadGame);
assert.ok(autoLoadGame.orders[0].operationDone<=8,'Automatic scheduling must stop within eight hours');
assert.equal(autoLoadGame.events.some(event=>event.kind==='INHABER_UEBERARBEIT'),false,'Automatic scheduling must never create owner overtime');

const overtimeGame=createInitialGame();
overtimeGame.date='2019-01-02';
overtimeGame.orders.push({id:'OWNER-OVERTIME',name:'Überstundenprüfung',status:'BESTÄTIGT',generated:true,closedAt:null,deliveredAt:null,rejectedAt:null,dueDate:'2019-01-03',planningHours:0,planningDone:0,operations:[{id:1,name:'Handarbeit',skill:'BASIC',totalHours:11,machineHours:0}],operationIndex:0,operationDone:0,quantity:0,materials:{}});
overtimeGame.workPlan[overtimeGame.date]={OWNER:'OWNER-OVERTIME'};
assert.equal(hasManualDayAssignment(overtimeGame,'OWNER'),true);
const initialOwnerMotivation=overtimeGame.employees[0].motivation;
advanceOneDay(overtimeGame);
assert.ok(overtimeGame.employees[0].motivation<initialOwnerMotivation,'Owner work above ten hours reduces motivation');
assert.ok(overtimeGame.events.some(event=>event.kind==='INHABER_UEBERARBEIT'),'Owner overtime is recorded in the event log');

const taskGame = createInitialGame();
taskGame.date='2019-01-04';
taskGame.employees.push(skilled);
taskGame.plannedTasks=[{id:'RECEIPT-1',label:'Warenannahme',kind:'WARENANNAHME',date:'2019-01-07',status:'OFFEN',requiredSkill:'PREP',requiredHours:0.5}];
assert.equal(setTimelineAssignment(taskGame,skilled.id,'2019-01-07','task:RECEIPT-1',1),false,'Task skill mismatch must reject assignment');
taskGame.employees[1].skill.push('PREP');
assert.equal(setTimelineAssignment(taskGame,skilled.id,'2019-01-07','task:RECEIPT-1',1),true);
assert.equal(getTimelineChoice(taskGame,skilled.id,'2019-01-07'),'task:RECEIPT-1');
assert.equal(setTimelineAssignment(taskGame,skilled.id,'2019-01-07','auto',1),true);
assert.equal(getTimelineChoice(taskGame,skilled.id,'2019-01-07'),'auto');

for (const context of [
  ['rt-contract-offer','rw-contribution-margin','wfprv5-4-marketingplanung'],
  ['wfprv5-1-planung-statistik','wfprv5-5-kommunikation-kooperation','uf-planning'],
  ['vw-market-demand','wfprv5-4-marketingplanung'],
  ['rw-balance-sheet','rw-cash-vs-profit','wfprv5-2-investitionsrechnung'],
  ['wfprv5-3-einkauf-beschaffung','rw-inventory-valuation','vw-make-or-buy'],
  ['wfprv5-2-investitionsrechnung','rw-depreciation','rw-break-even'],
]) assert.ok(focusPracticeCompetence(context), `Every UI game context must resolve to a reviewed practice card: ${context.join(', ')}`);

const sequenceGame=createInitialGame();
sequenceGame.date='2019-01-07';sequenceGame.roomSettings.office=16;sequenceGame.roomSettings.staff=16;sequenceGame.roomSettings.workshop=100;
const stageWorker={id:'SEQ-STAGE-2',name:'Folgestufe',skill:['BASIC'],morale:75,motivation:75,competencies:{fach:70,methoden:70,sozial:70,individual:70},maxPotential:{fach:90,methoden:90,sozial:90,individual:90},vacationPlan:[],sickUntil:null};
sequenceGame.employees.push(stageWorker);
const sequenceOrder={id:'SEQUENCE-ORDER',name:'Sequenztest',status:'BESTÄTIGT',generated:true,closedAt:null,deliveredAt:null,rejectedAt:null,dueDate:'2019-01-08',planningHours:0,planningDone:0,operations:[{id:1,name:'Erster Block',skill:'BASIC',totalHours:1,machineHours:0},{id:2,name:'Nächster Block',skill:'BASIC',totalHours:1,machineHours:0}],operationIndex:0,operationDone:0,quantity:0,materials:{}};
sequenceGame.orders.push(sequenceOrder);
assert.equal(assignEmployeeToStage(sequenceGame,'OWNER',sequenceOrder.id,0,sequenceGame.date),true);
assert.equal(assignEmployeeToStage(sequenceGame,stageWorker.id,sequenceOrder.id,1,sequenceGame.date),true);
sequenceGame.plannedTasks=[{id:'FOLLOWUP-TASK',label:'Versand vorbereiten',kind:'VERSAND',orderId:sequenceOrder.id,date:sequenceGame.date,status:'OFFEN',requiredSkill:'BASIC',requiredHours:1,progress:0}];
assert.equal(assignEmployeeToTask(sequenceGame,'OWNER','FOLLOWUP-TASK',sequenceGame.date),true);
advanceOneDay(sequenceGame);
assert.equal(sequenceOrder.operationIndex,2,'The next assigned block starts after the preceding operation finishes');
assert.equal(sequenceOrder.status,'GELIEFERT','The sequentially assigned work blocks finish the order and queued shipping on the same day');
assert.equal(sequenceGame.plannedTasks[0].status,'ABGESCHLOSSEN','A task queued after production can continue on the same day');
assert.equal(sequenceGame.dailyWorkSequence[sequenceGame.lastProcessedDate].OWNER.length,0,'Completed work blocks leave the employee queue');

const archiveGame=createInitialGame();archiveGame.date='2020-01-02';
const archived={id:'OLD-CLOSED',closedAt:'2019-01-01',operations:[{id:10,name:'Fertigung',skill:'BASIC',totalHours:3,machineHours:0}],competitorQuotes:[{price:10}],salesNet:100};archiveGame.orders.push(archived);
advanceOneDay(archiveGame);
assert.equal(archived.detailsCompacted,true,'Closed order details are compacted after one year');
assert.deepEqual(archived.operations,[{name:'Fertigung',skill:'BASIC',totalHours:3}]);
assert.equal(archived.salesNet,100,'Compaction preserves financial fields');

console.log('V2 UI context/timeline regressions: PASS');
