import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createInitialFinance, closeMonthlyPeriod } from './finance.js';
import { advanceOneDay, assignEmployeeToStage, assignEmployeeToTask, bookTemporaryWorker, createInitialGame, getSpaceUse, getTemporaryWorkersForDate, negotiateTemporaryAgency, relocateFacility, returnTemporaryWorker } from './engine.js';
import { appendTimelineAssignment, getTimelineChoice, getTimelineWorkdays, setTimelineAssignment } from './planning-ui.js';

const appSource = await readFile(new URL('./app.js', import.meta.url), 'utf8');
assert.ok(!appSource.includes('selectedAgency.pool.map'), 'the UI must not render the agency pool directory');
assert.ok(appSource.includes('data-action="return-temp"'), 'booked staff must have a return action');
assert.ok(appSource.includes("returnTemporaryWorker(state.game,button.dataset.employee)"), 'the UI return handler must pass the clicked employee ID');
assert.ok(appSource.includes('duration:\'until-return\''), 'new agency bookings must use until-return duration');

const agencyGame = createInitialGame();
agencyGame.date = '2019-01-05'; // Saturday: booking must start on the following workday.
assert.equal(negotiateTemporaryAgency(agencyGame, 'flex'), true);
assert.equal(relocateFacility(agencyGame, 'site-4', 'rent'), true);
const booking = bookTemporaryWorker(agencyGame, { skill: 'PREP', count: 1, duration: 'until-return' });
assert.ok(booking, 'a free qualified worker should be bookable');
const employeeId = booking.workerId || booking.id;
assert.equal(agencyGame.temporaryWorkerContracts[0].startDate, '2019-01-07');
assert.equal(getTemporaryWorkersForDate(agencyGame, '2019-01-06').length, 0, 'a weekend is not a booked workday');
assert.equal(getTemporaryWorkersForDate(agencyGame, '2019-01-07').some(person => person.id === employeeId), true);
agencyGame.date = '2019-01-07';
advanceOneDay(agencyGame);
assert.equal(getTemporaryWorkersForDate(agencyGame, agencyGame.date).some(person => person.id === employeeId), true, 'booking remains active on the next workday');
assert.equal(returnTemporaryWorker(agencyGame, employeeId, agencyGame.date), true);
assert.equal(getTemporaryWorkersForDate(agencyGame, agencyGame.date).some(person => person.id === employeeId), false, 'return ends the booking on the selected date');
assert.equal(agencyGame.temporaryWorkers.some(person => person.date === '2019-01-07' && person.workerId === employeeId), true, 'completed booked days remain available for billing');
assert.equal(getSpaceUse(agencyGame, agencyGame.date).workplacePeople, agencyGame.employees.length, 'returned workers release workplace capacity');
const agencyInvoice = closeMonthlyPeriod(createInitialFinance(), agencyGame, '2019-01', '2019-01-31');
assert.equal(agencyInvoice.temporaryHourlyCost, 440, 'only the one active booked workday is charged at the agreed hourly rate');
assert.equal(agencyInvoice.temporaryBaseFee, 0, 'the selected flex contract has no monthly base fee');

const timelineGame = createInitialGame();
timelineGame.date = '2019-01-04';
assert.equal(getTimelineWorkdays('2019-01-04').length, 5);
timelineGame.plannedTasks = [1, 2, 3, 4].map((number) => ({
  id: `MULTI-${number}`,
  label: `Planungsblock ${number}`,
  kind: 'PLANUNG',
  date: timelineGame.date,
  status: 'OFFEN',
  requiredSkill: 'PREP',
  requiredHours: number === 4 ? 1 : 4,
  progress: 0,
}));
const workerId = timelineGame.employees[0].id;
assert.equal(setTimelineAssignment(timelineGame, workerId, timelineGame.date, 'task:MULTI-1'), true);
assert.equal(appendTimelineAssignment(timelineGame, workerId, timelineGame.date, 'task:MULTI-2'), true);
assert.equal(appendTimelineAssignment(timelineGame, workerId, timelineGame.date, 'task:MULTI-3'), true);
assert.deepEqual(timelineGame.dailyWorkSequence[timelineGame.date][workerId], [
  { kind: 'task', id: 'MULTI-1' },
  { kind: 'task', id: 'MULTI-2' },
  { kind: 'task', id: 'MULTI-3' },
]);
assert.equal(getTimelineChoice(timelineGame, workerId, timelineGame.date), 'task:MULTI-1', 'the original first activity remains the visible choice');
assert.equal(appendTimelineAssignment(timelineGame, workerId, timelineGame.date, 'task:MULTI-4'), false, 'additional work past the 12-hour owner ceiling is rejected');
assert.equal(timelineGame.dailyWorkSequence[timelineGame.date][workerId].length, 3, 'a rejected extra block does not alter the existing queue');
assert.equal(appendTimelineAssignment(timelineGame, workerId, timelineGame.date, 'task:MULTI-2'), false, 'the same activity cannot be queued twice');

const weekendGame = createInitialGame();
weekendGame.date = '2019-01-04';
weekendGame.orders.push({
  id: 'WEEKEND-ORDER', status: 'BESTÄTIGT', operationIndex: 0,
  operations: [{ id: 1, name: 'Vorbereitung', skill: 'PREP', totalHours: 1 }],
});
weekendGame.plannedTasks = [{
  id: 'WEEKEND-TASK', date: '2019-01-05', status: 'OFFEN', requiredSkill: 'PREP',
}];
assert.equal(assignEmployeeToStage(weekendGame, workerId, 'WEEKEND-ORDER', 0, '2019-01-05'), false, 'work stages cannot be assigned on Saturday');
assert.equal(assignEmployeeToTask(weekendGame, workerId, 'WEEKEND-TASK', '2019-01-05'), false, 'planned tasks cannot be assigned on Saturday');
assert.equal(weekendGame.dailyWorkSequence?.['2019-01-05'], undefined, 'a rejected weekend assignment does not create a work queue');

console.log('T-0059 PASS: booked-only agency UI, persistent booking/return, workday start, retained billing days, ordered multi-activity capacity, and weekend assignment rejection');
