import assert from 'node:assert/strict';
import {
  addCalendarDays,
  advanceOneDay,
  bookTemporaryWorker,
  countStatutoryWorkdays,
  createInitialGame,
  customerAcceptsOrder,
  getDailyCapacityHours,
  getRollingWorkBudgetHours,
  getTemporaryServiceDays,
  hasElevenHourRest,
  isHoliday,
  isWorkday,
  negotiateTemporaryAgency,
  migrateGameState,
  TEMP_AGENCIES,
} from './engine.js';

const owner={isOwner:true,selfEmployed:true};
assert.equal(getDailyCapacityHours({isOwner:false},false),8);
assert.equal(getDailyCapacityHours({isOwner:false},true),10);
assert.equal(getDailyCapacityHours(owner,true,'einzelunternehmen'),12);
assert.equal(getDailyCapacityHours(owner,true,'gmbh'),10);
assert.equal(getDailyCapacityHours({isOwner:true,selfEmployed:false},true,'einzelunternehmen'),10);

assert.equal(isHoliday('2027-01-06'),true,'Epiphany is a Bavarian holiday');
assert.equal(isHoliday('2027-03-08'),false,'Berlin Women’s Day is not a Munich holiday');
assert.equal(isHoliday('2027-09-20'),false,'Thuringia Children’s Day is not a Munich holiday');
assert.equal(isHoliday('2027-10-31'),false,'Reformation Day is not a Munich holiday');
assert.equal(isHoliday('2027-08-15'),true,'Assumption Day is observed in Munich');
assert.equal(isWorkday('2027-01-06'),false);
assert.equal(isWorkday('2027-10-29'),true);
assert.equal(countStatutoryWorkdays('2027-01-04','2027-01-09'),5,'Saturday is a statutory Werktag');

const migrated=createInitialGame();
migrated.date='2027-02-01';
delete migrated.workingTimeTrackingStart;
migrated.workLog=[
  {date:'2027-01-30',employeeId:'OWNER',hours:8,startMinute:480,endMinute:960},
  {date:'2027-02-01',employeeId:'OWNER',hours:2,startMinute:480,endMinute:600},
];
migrateGameState(migrated);
assert.equal(migrated.workingTimeTrackingStart,'2027-01-30','migration starts tracking at the earliest valid historic work date');
assert.equal(getRollingWorkBudgetHours(migrated,{id:'OWNER'}),6,'pre-migration work hours reduce the rolling budget');
const anonymousLegacy={...migrated,workingTimeTrackingStart:undefined,workLog:[{date:'2027-01-30',hours:4},{date:'2027-02-01',employeeId:'OWNER',hours:6}]};
migrateGameState(anonymousLegacy);
assert.equal(getRollingWorkBudgetHours(anonymousLegacy,{id:'OWNER'}),6,'unattributed legacy work hours are conservatively included');

const sameNameA=TEMP_AGENCIES[0].pool[4];
const sameNameB=TEMP_AGENCIES[1].pool[4];
assert.ok(sameNameA&&sameNameB);
assert.equal(sameNameA.name,sameNameB.name);
assert.notEqual(sameNameA.workerIdentityId,sameNameB.workerIdentityId,'equal pool names from different agencies are different simulated people');
assert.equal(sameNameA.workerIdentityId,`TEMP-PERSON-${TEMP_AGENCIES[0].id}-${sameNameA.id}`,'legacy records resolve to the same stable per-person ID as the static pool');

function tempBoundaryState(priorCalendarDays){
  const state=createInitialGame();state.date='2019-01-04';state.roomSettings.office=200;state.roomSettings.staff=200;state.roomSettings.workshop=200;
  assert.equal(negotiateTemporaryAgency(state),true);
  const worker=TEMP_AGENCIES.find(a=>a.id==='balanced').pool.find(w=>w.skill.includes('PREP'));
  state.temporaryWorkerContracts=[{workerId:worker.id,workerIdentityId:worker.workerIdentityId,name:worker.name,agencyId:'flex',startDate:addCalendarDays(state.date,-priorCalendarDays),returnedAt:state.date,status:'ZURÜCKGEGEBEN'}];
  return {state,worker};
}
const nearWeek=tempBoundaryState(533);
const weekBooking=bookTemporaryWorker(nearWeek.state,{date:nearWeek.state.date,skill:'PREP',duration:'week'});
assert.ok(weekBooking,'a seven-calendar-day Friday-to-Thursday week may use exactly the remaining 7 days');
assert.equal(getTemporaryServiceDays(nearWeek.state,nearWeek.worker),540);
assert.equal(nearWeek.state.temporaryWorkerContracts.at(-1).returnedAt,'2019-01-11');
const nearMonth=tempBoundaryState(516);
assert.equal(bookTemporaryWorker(nearMonth.state,{date:nearMonth.state.date,skill:'PREP',duration:'month'}),null,'a 28-calendar-day monthly interval cannot cross the 540-day cap even though it contains 20 workdays');
assert.equal(nearMonth.state.temporaryWorkers.length,0);

const timeState={date:'2027-01-05',workingTimeTrackingStart:'2027-01-04',workLog:[]};
const employee={id:'E-1'};
assert.equal(getRollingWorkBudgetHours(timeState,employee),16);
timeState.workLog.push({date:'2027-01-04',employeeId:'E-1',hours:10,endMinute:1080});
assert.equal(getRollingWorkBudgetHours(timeState,employee),6);
assert.equal(hasElevenHourRest(timeState,employee,'2027-01-05'),true,'08:00 to 18:00 leaves 14 hours');
timeState.workLog[0].endMinute=1261;
assert.equal(hasElevenHourRest(timeState,employee,'2027-01-05'),false,'08:00 start after 21:01 violates 11-hour rest');

const temp=createInitialGame();
temp.roomSettings.office=80;temp.roomSettings.staff=80;temp.roomSettings.workshop=80;
assert.equal(negotiateTemporaryAgency(temp),true);
assert.ok(bookTemporaryWorker(temp,{date:temp.date,skill:'PREP',duration:'week'}));
const bookedName=temp.temporaryWorkers[0].name;
assert.equal(getTemporaryServiceDays(temp,temp.temporaryWorkers[0]),7,`finite booking counts the complete calendar span for ${bookedName}`);
const serviceStart=addCalendarDays(temp.date,-540);
const limitDate=addCalendarDays(serviceStart,540);
const limitState={...createInitialGame(),date:limitDate,temporaryWorkers:[],temporaryWorkerContracts:[
  {workerId:'TEMP-A',workerIdentityId:'shared-identity',name:'Worker',agencyId:'flex',startDate:serviceStart,returnedAt:addCalendarDays(serviceStart,270),status:'ZURÜCKGEGEBEN'},
  {workerId:'TEMP-B',workerIdentityId:'shared-identity',name:'Worker',agencyId:'balanced',startDate:addCalendarDays(serviceStart,270),returnedAt:addCalendarDays(serviceStart,510),status:'ZURÜCKGEGEBEN'},
  {workerId:'TEMP-C',workerIdentityId:'shared-identity',name:'Worker',agencyId:'volume',startDate:addCalendarDays(serviceStart,510),returnedAt:null,status:'GEBUCHT'},
],workLog:[]};
assert.equal(getTemporaryServiceDays(limitState,{workerIdentityId:'shared-identity'}),540);
advanceOneDay(limitState);
assert.equal(limitState.temporaryWorkerContracts[2].status,'ZURÜCKGEGEBEN');
assert.ok(limitState.events.some(e=>e.kind==='ZEITARBEIT_HOECHSTDAUER_ERREICHT'));
const warningDate=addCalendarDays(serviceStart,510);
const warningState={...createInitialGame(),date:warningDate,temporaryWorkers:[],temporaryWorkerContracts:[{workerId:'TEMP-WARN',workerIdentityId:'shared-warning',name:'Worker W',agencyId:'flex',startDate:serviceStart,returnedAt:null,status:'GEBUCHT'}],workLog:[]};
advanceOneDay(warningState);
assert.ok(warningState.events.some(e=>e.kind==='ZEITARBEIT_HOECHSTDAUER_WARNUNG'));
assert.ok(warningState.events.find(e=>e.kind==='ZEITARBEIT_HOECHSTDAUER_WARNUNG').text.includes('Kalendertage'));

const acceptance=createInitialGame();
const order={id:'ORDER-1',deliveredAt:acceptance.date};
assert.equal(customerAcceptsOrder(acceptance,order,{automatic:true}),true);
assert.match(acceptance.events.at(-1).text,/Spiel-\/Vertragskonvention/);
assert.match(acceptance.events.at(-1).text,/keine allgemeine gesetzliche Fünf-Tage-Regel/);

console.log('A02 T-0064 legal-impact regressions passed');
