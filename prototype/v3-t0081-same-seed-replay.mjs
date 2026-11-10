import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { runV3YearSmoke } from './v3-year-smoke.mjs';

const seed = 'T-0069-seed-1';
const profiles = [
  { id: 'UPSWING', firstRunHash: '029231d56d01316232d568644e4118fb91df0579556721f439eccdccee2d8d09' },
  { id: 'BOOM', firstRunHash: '1c41f00ad68576df683f76c0a1c05ee83e0000f2ab16d87ebb11255639a93f59' },
  { id: 'DOWNTURN', firstRunHash: '0c2bba46387e09f56cebc2b66d2ef91a55ef8e97c388833071030245326afb2a' },
  { id: 'LOW', firstRunHash: '496d27003dcc8b26569a7c311c0a7d219b5ddeaa2008a36372836b4aab494fce' },
];
const outputPath = new URL('./v3-t0081-same-seed-results.json', import.meta.url);
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const results = {
  ticket: 'T-0081 / T-0063 G2',
  runner: 'prototype/v3-year-smoke.mjs',
  seed,
  startDate: '2027-01-04',
  endDate: '2027-12-31',
  status: 'RUNNING',
  profiles: [],
};

await writeFile(outputPath, `${JSON.stringify(results, null, 2)}\n`);

for (const profile of profiles) {
  process.stdout.write(`START ${profile.id} baseline\n`);
  const baseline = runV3YearSmoke({ scenario: profile.id, seed });
  assert.equal(baseline.stateHash, profile.firstRunHash, `${profile.id} baseline must match the T-0079 first run`);
  assert.equal(baseline.dailyLog.length, 362, `${profile.id} baseline covers 362 calendar dates`);
  assert.equal(baseline.monthlyLog.length, 12, `${profile.id} baseline contains 12 month snapshots`);
  assert.equal(baseline.eventCount, 1409, `${profile.id} baseline contains 1,409 run events`);

  process.stdout.write(`START ${profile.id} same-seed replay\n`);
  const replay = runV3YearSmoke({ scenario: profile.id, seed });
  assert.equal(replay.stateHash, baseline.stateHash, `${profile.id} run and replay state hashes match`);
  assert.deepEqual(replay.dailyLog, baseline.dailyLog, `${profile.id} daily dates/event IDs match`);
  assert.deepEqual(replay.monthlyLog, baseline.monthlyLog, `${profile.id} monthly phase/snapshot logs match`);
  assert.equal(replay.dailyLog.length, 362, `${profile.id} replay covers 362 calendar dates`);
  assert.equal(replay.monthlyLog.length, 12, `${profile.id} replay contains 12 month snapshots`);
  assert.equal(replay.eventCount, 1409, `${profile.id} replay contains 1,409 run events`);

  results.profiles.push({
    profile: profile.id,
    status: 'PASS',
    baseline: {
      stateHash: baseline.stateHash,
      eventCount: baseline.eventCount,
      dailyCount: baseline.dailyLog.length,
      dailyEventHash: digest(baseline.dailyLog),
      monthlyCount: baseline.monthlyLog.length,
      monthlyLogHash: digest(baseline.monthlyLog),
      wallMs: baseline.performance.wallMs,
      validatorCalls: baseline.performance.validators.totalCalls,
    },
    replay: {
      stateHash: replay.stateHash,
      eventCount: replay.eventCount,
      dailyCount: replay.dailyLog.length,
      dailyEventHash: digest(replay.dailyLog),
      monthlyCount: replay.monthlyLog.length,
      monthlyLogHash: digest(replay.monthlyLog),
      wallMs: replay.performance.wallMs,
      validatorCalls: replay.performance.validators.totalCalls,
    },
    identicalState: true,
    identicalDailyEventLog: true,
    identicalMonthlyLog: true,
  });
  await writeFile(outputPath, `${JSON.stringify(results, null, 2)}\n`);
  process.stdout.write(`PASS ${profile.id}: ${baseline.stateHash}\n`);
}

results.status = 'PASS';
await writeFile(outputPath, `${JSON.stringify(results, null, 2)}\n`);
process.stdout.write('PASS T-0081: all four profile state, event, and monthly log replay pairs are identical\n');
