import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getWeekAdvanceWindow,isHoliday} from './engine.js';

const cases=[
  ['Monday', '2027-01-04', '2027-01-11'],
  ['Wednesday', '2027-01-06', '2027-01-11'],
  ['Friday', '2027-01-08', '2027-01-11'],
  ['Saturday', '2027-01-09', '2027-01-11'],
  ['Sunday', '2027-01-10', '2027-01-11'],
  ['holiday week', '2027-01-06', '2027-01-11'],
];
for(const [label,start,target] of cases){
  const window=getWeekAdvanceWindow(start);
  const prior=new Date(`${target}T12:00:00Z`);prior.setUTCDate(prior.getUTCDate()-1);
  assert.equal(window.targetDate,target,`${label}: wrong target Monday`);
  assert.equal(new Date(`${window.targetDate}T12:00:00Z`).getUTCDay(),1,`${label}: target is not Monday`);
  assert(!window.dates.includes(target),`${label}: target Monday must remain unprocessed`);
  assert.equal(window.dates[0],start,`${label}: current simulation date must be processed`);
  assert.equal(window.dates.at(-1),prior.toISOString().slice(0,10),`${label}: prior calendar day must be last`);
  assert(window.dates.every((date,index)=>index===0||date===(()=>{const d=new Date(`${window.dates[index-1]}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);})()),`${label}: date range has a gap`);
}
assert(isHoliday('2027-01-06'),'holiday-week case must use a date in the conservative holiday calendar');
const appSource=await readFile(new URL('./app.js',import.meta.url),'utf8');
const advanceWeek=appSource.match(/function advanceWeek\(\)\s*\{([\s\S]*?)\n\}/)?.[1]||'';
assert(advanceWeek.includes('getWeekAdvanceWindow(state.game.date)'),'week button must use the tested calendar window');
assert(advanceWeek.includes('state.game.date!==expectedDate'),'week button must stop if simulation date diverges from the expected window');
assert(!advanceWeek.includes('workdays < 5'),'old five-workday loop must be removed');
console.log(JSON.stringify({cases:cases.map(([label,start,target])=>({label,start,target,processed:getWeekAdvanceWindow(start).dates.length})),targetMondayProcessed:false,holidayBoundary:'calendar-based'},null,2));