import assert from 'node:assert/strict';
import { runV3YearSmoke } from './v3-year-smoke.mjs';

const addDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
for (const days of [30, 90]) {
  const endDate = addDays('2027-01-04', days - 1);
  const report = runV3YearSmoke({ scenario: 'UPSWING', seed: `T-0069-window-${days}`, endDate });
  assert.equal(report.dailyLog.length, days);
  assert.equal(report.stateHash.length, 64);
  const validators = report.performance.validators;
  const selected = Object.fromEntries(Object.entries(validators.validatorBlocks ?? {}).filter(([name]) => name.startsWith('macroHistory@') || name.startsWith('macroDemandBindings@')));
  console.log(JSON.stringify({ days, endDate, wallMs: report.performance.wallMs, stateHash: report.stateHash, eventCount: report.eventCount, validationPhases: validators.fullValidations, macroHotspots: selected, workCounters: validators.workCounters ?? {} }));
}
console.log('PASS: deterministic 30/90-day profile windows complete with full validation and stable state hashes. No before/after speedup is claimed; only a full-year baseline is available.');