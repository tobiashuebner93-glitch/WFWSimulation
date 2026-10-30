import { isWorkday, assignEmployee, assignEmployeeToStage, assignEmployeeToTask } from './engine.js';

export function getTimelineWorkdays(startDate) {
  const days = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(`${startDate}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    const iso = date.toISOString().slice(0, 10);
    if (isWorkday(iso)) days.push(iso);
  }
  return days;
}

export function getTimelineBlockReason(game, employee, date, dayIndex) {
  if (!isWorkday(date)) return 'Kein Arbeitstag';
  if (employee.temp && !game.temporaryWorkers.some(worker => (worker.workerId || worker.id) === employee.id && worker.date === date)) return 'Nicht gebucht';
  if (!employee.temp && employee.sickUntil && employee.sickUntil >= date) return 'Krank';
  if (!employee.temp && employee.vacationPlan?.includes(date)) return 'Urlaub';
  if (!employee.temp && employee.training?.remainingDays > dayIndex) return 'Weiterbildung';
  return '';
}

export function getTimelineChoice(game, employeeId, date) {
  for (const [key, ids] of Object.entries(game.stageWorkPlan?.[date] || {})) {
    if (ids.includes(employeeId)) return `stage:${key}`;
  }
  for (const [taskId, id] of Object.entries(game.taskWorkPlan?.[date] || {})) {
    if (id === employeeId) return `task:${taskId}`;
  }
  const orderId = game.workPlan?.[date]?.[employeeId];
  return orderId ? `order:${orderId}` : 'auto';
}

function clearEmployeeFromDay(game, employeeId, date) {
  for (const [key, ids] of Object.entries(game.stageWorkPlan?.[date] || {})) {
    game.stageWorkPlan[date][key] = ids.filter(id => id !== employeeId);
    if (!game.stageWorkPlan[date][key].length) delete game.stageWorkPlan[date][key];
  }
  for (const [taskId, id] of Object.entries(game.taskWorkPlan?.[date] || {})) {
    if (id === employeeId) delete game.taskWorkPlan[date][taskId];
  }
  if (game.workPlan?.[date]) delete game.workPlan[date][employeeId];
}

export function setTimelineAssignment(game, employeeId, date, value, dayIndex = 0) {
  const employee = [...(game.employees || []), ...(game.temporaryWorkers || []).filter(worker => worker.date === date)]
    .find(person => person.id === employeeId);
  if (!employee) return false;
  if (value === 'auto') {
    clearEmployeeFromDay(game, employeeId, date);
    return true;
  }
  if (getTimelineBlockReason(game, employee, date, dayIndex)) return false;

  const previousStage = structuredClone(game.stageWorkPlan?.[date] || {});
  const previousTasks = structuredClone(game.taskWorkPlan?.[date] || {});
  const previousOrders = structuredClone(game.workPlan?.[date] || {});
  clearEmployeeFromDay(game, employeeId, date);
  let assigned = false;
  if (value.startsWith('stage:')) {
    const [orderId, stageIndex] = value.slice(6).split(':');
    assigned = assignEmployeeToStage(game, employeeId, orderId, Number(stageIndex), date);
    if (assigned) assignEmployee(game, employeeId, orderId, date);
  } else if (value.startsWith('task:')) {
    assigned = assignEmployeeToTask(game, employeeId, value.slice(5), date);
  }
  if (assigned) return true;
  game.stageWorkPlan ||= {};
  game.taskWorkPlan ||= {};
  game.workPlan ||= {};
  game.stageWorkPlan[date] = previousStage;
  game.taskWorkPlan[date] = previousTasks;
  game.workPlan[date] = previousOrders;
  return false;
}
