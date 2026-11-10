import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRunFromInputs, installRunOperatingResources, openNextRunDay, getRunProjection } from './run.js';
import { getV3MarketPlayerView, V3_MARKET_INVITATION_PRICE_PROFILE_ID } from '../v3-market-simulation.js';

const base = { scenarioId: 't0065-shared-run-profile', seed: 'fixed-seed-65', startDate: '2027-01-04', endDate: '2027-01-29' };
const resources = {
  peopleJson: '[{"id":"P1","hoursPerDay":8,"skills":["turning"]}]',
  equipmentJson: '[{"id":"M1","hoursPerDay":8,"capabilities":["turning"]}]',
  materialsJson: '[{"id":"steel","quantity":10}]', commitmentsJson: '[]', finishedGoodsCapacity: '10', finishedGoodsUsed: '0',
};
function firstDay(profile = 'NEUTRAL') {
  let run = createRunFromInputs({ ...base, marketInvitationProfileId: profile });
  run = installRunOperatingResources(run, resources);
  return openNextRunDay(run).state;
}

const neutral = firstDay();
const neutralRepeat = firstDay();
const priceWeighted = firstDay(V3_MARKET_INVITATION_PRICE_PROFILE_ID);
const weightedRepeat = firstDay(V3_MARKET_INVITATION_PRICE_PROFILE_ID);
assert.equal(neutral.marketInvitationProfileId, 'NEUTRAL');
assert.deepEqual(neutral.modules.market.parameters.invitationWeights, { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 }, 'default profile remains unchanged');
assert.equal(priceWeighted.marketInvitationProfileId, V3_MARKET_INVITATION_PRICE_PROFILE_ID);
assert.deepEqual(priceWeighted.modules.market.parameters.invitationWeights, { capacity: 0.2, reputation: 0.2, segmentFit: 0.2, price: 0.4 });
assert.equal(priceWeighted.modules.market.parameters.minimumInvitationScore, 0.77, 'opt-in profile uses A02 controlled invitation threshold');
assert.notEqual(neutral.runId, priceWeighted.runId, 'profile is part of immutable run identity');
assert.deepEqual(neutral.modules.market.inquiries.map(row => row.invitedFirmIds), neutralRepeat.modules.market.inquiries.map(row => row.invitedFirmIds), 'neutral invitations are reproducible for same seed');
assert.deepEqual(priceWeighted.modules.market.inquiries.map(row => row.invitedFirmIds), weightedRepeat.modules.market.inquiries.map(row => row.invitedFirmIds), 'price-weighted invitations are reproducible for same seed');
assert.notDeepEqual(neutral.modules.market.inquiries.map(row => row.invitedFirmIds), priceWeighted.modules.market.inquiries.map(row => row.invitedFirmIds), 'opt-in profile changes the fixture invitation ranking');

const playerView = getV3MarketPlayerView(priceWeighted.modules.market);
assert.ok(playerView.inquiries.length > 0);
assert.ok(playerView.inquiries.every(row => !('offers' in row) && !('invitationScores' in row) && !('invitedFirmIds' in row)));
for (const competitorPrice of ['10000', '12000', '11500', '30000', '36000', '34500', '50000', '62000', '58500']) assert.ok(!JSON.stringify(playerView).includes(competitorPrice), `player view hides individual synthetic bid ${competitorPrice}`);
const report = getRunProjection(priceWeighted).report;
for (const row of report) assert.deepEqual(Object.keys(row).sort(), ['meanCompetitorNetPriceCents', 'period', 'sampleCount', 'sizeClass', 'suppressed'].sort(), 'report contains anonymized monthly aggregates only');
assert.ok(!JSON.stringify(report).includes('firmId') && !JSON.stringify(report).includes('offerId'));

const html = await readFile(new URL('./run.html', import.meta.url), 'utf8');
const js = await readFile(new URL('./run.js', import.meta.url), 'utf8');
assert.match(html, /name="marketInvitationProfileId"/);
assert.match(html, /Neutral · Preisgewichtung aus/);
assert.match(html, /Optionaler synthetischer Testparameter/);
assert.match(html, /Einladungsschwelle 0,77/);
assert.match(js, /<dt>Kundeneinladungen<\/dt>/);
console.log('A05 T-0065 shared-run invitation profile regressions: PASS');
