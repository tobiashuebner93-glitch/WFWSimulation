import { isWorkday, assignEmployee, assignEmployeeToStage, assignEmployeeToTask, getTemporaryWorkersForDate, getDailyCapacityHours } from './engine.js';

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
  if (employee.temp && !getTemporaryWorkersForDate(game,date).some(worker => (worker.workerId || worker.id) === employee.id)) return 'Nicht gebucht';
  if (!employee.temp && employee.sickUntil && employee.sickUntil >= date) return 'Krank';
  if (!employee.temp && employee.vacationPlan?.includes(date)) return 'Urlaub';
  if (!employee.temp && employee.training?.remainingDays > dayIndex) return 'Weiterbildung';
  return '';
}

export function getTimelineChoice(game, employeeId, date) {
  const next = game.dailyWorkSequence?.[date]?.[employeeId]?.[0];
  if (next) return next.kind === 'stage' ? `stage:${next.id}` : `task:${next.id}`;
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
  if (game.dailyWorkSequence?.[date]) delete game.dailyWorkSequence[date][employeeId];
}

export function setTimelineAssignment(game, employeeId, date, value, dayIndex = 0) {
  const employee = [...(game.employees || []), ...getTemporaryWorkersForDate(game,date)]
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
  const previousSequence = structuredClone(game.dailyWorkSequence?.[date] || {});
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
  game.dailyWorkSequence ||= {};
  game.dailyWorkSequence[date] = previousSequence;
  return false;
}

function assignmentHours(game, employeeId, date, block) {
  if (block.kind === 'task') {
    const task = game.plannedTasks?.find(item => item.id === block.id);
    return Math.max(0, Number(task?.requiredHours || 0) - Number(task?.progress || 0));
  }
  const split = block.id.lastIndexOf(':');
  const order = game.orders?.find(item => item.id === block.id.slice(0, split));
  const index = Number(block.id.slice(split + 1));
  const operation = order?.operations?.[index];
  if (!operation) return 0;
  const remaining = Math.max(0, Number(operation.totalHours || 0) - (index === order.operationIndex ? Number(order.operationDone || 0) : 0));
  return remaining / Math.max(1, (game.stageWorkPlan?.[date]?.[block.id] || []).length);
}

export function appendTimelineAssignment(game, employeeId, date, value, dayIndex = 0) {
  const employee = [...(game.employees || []), ...getTemporaryWorkersForDate(game,date)].find(person => person.id === employeeId);
  if (!employee || value === 'auto' || getTimelineBlockReason(game, employee, date, dayIndex)) return false;
  const kind = value.startsWith('stage:') ? 'stage' : value.startsWith('task:') ? 'task' : null;
  if (!kind) return false;
  const id = value.slice(kind === 'stage' ? 6 : 5);
  const queue = game.dailyWorkSequence?.[date]?.[employeeId] || [];
  if (queue.some(block => block.kind === kind && block.id === id)) return false;
  const block = { kind, id };
  const maxHours = employee.temp ? Math.min(getDailyCapacityHours(employee,true),Number(employee.bookedHours)||8) : getDailyCapacityHours(employee,true);
  const plannedHours = queue.reduce((sum,item)=>sum+assignmentHours(game,employeeId,date,item),0);
  if (plannedHours + assignmentHours(game,employeeId,date,block) > maxHours + 1e-6) return false;
  let assigned = false;
  if (kind === 'stage') {
    const [orderId,stageIndex] = id.split(':');
    assigned = assignEmployeeToStage(game,employeeId,orderId,Number(stageIndex),date);
    if (assigned) assignEmployee(game,employeeId,orderId,date);
  } else assigned = assignEmployeeToTask(game,employeeId,id,date);
  return assigned;
}
