import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createDocumentedSyntheticMacroRun, renderMacroSnapshot } from './macro.js';

const none = createDocumentedSyntheticMacroRun('none');
assert.equal(none.snapshots.length, 14);
assert.equal(none.snapshots[0].phaseState.phase, 'upswing');
assert.equal(none.snapshots[0].spi.index, 100);
assert.equal(none.snapshots[0].spi.monthOverMonthInflation, null);
assert.equal(none.snapshots[0].mro.sourceType, 'unavailable');
assert.equal(none.snapshots.at(-1).mro.sourceType, 'synthetic_scenario');
assert.equal(none.snapshots.at(-1).financingHandoff, null);
assert.deepEqual(none.state.financeEffects, undefined, 'macro state does not gain finance effects');
assert.deepEqual(none.originalState.periods, [], 'source state passed to transitions remains unchanged');
assert.ok(none.snapshots.every(s => Object.values(s.financeEffects).every(value => value === false)));

const html = renderMacroSnapshot(none.snapshots.at(-1), none.snapshots.at(-2));
for (const text of ['Aufschwung', 'Synthetischer', 'SPI-Inflation m/m', 'SPI-Inflation y/y', 'Außenwirtschaft', 'Wirtschaftspolitik', 'keine indikative Anfrage']) assert.ok(html.includes(text), `render contains ${text}`);
assert.ok(html.includes('synthetic-fixture:mro-rule'));
assert.ok(html.includes('V3-SPI-COICOP12-v1'));
assert.ok(html.includes('Geldpolitik'));
assert.ok(html.includes('0 Monat(e)'));
assert.ok(html.includes('source-badge derived'), 'calculated inflation rates have a derived provenance badge');

const indicativeRun = createDocumentedSyntheticMacroRun('indicative');
const indicative = indicativeRun.snapshots.at(-1).financingHandoff;
assert.equal(indicative.status, 'indicative');
assert.equal(indicative.contractId, null);
assert.equal(indicative.createsLedgerEffect, false);
assert.equal(indicative.createsFinancialEvent, false);
assert.ok(renderMacroSnapshot(indicativeRun.snapshots.at(-1)).includes('Indikativ'));
const expiredRun = createDocumentedSyntheticMacroRun('expired');
const expired = expiredRun.snapshots.at(-1).financingHandoff;
assert.equal(expired.status, 'expired');
assert.equal(expired.contractVersion, null);
assert.ok(renderMacroSnapshot(expiredRun.snapshots.at(-1)).includes('Abgelaufen'));
assert.throws(() => createDocumentedSyntheticMacroRun('bad-value'), /Unbekannter Angebotsmodus/);

const page = await readFile(new URL('./macro.html', import.meta.url), 'utf8');
const index = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('./macro.css', import.meta.url), 'utf8');
assert.match(page, /name="viewport"/);
assert.match(page, /type="button"/);
assert.match(page, /Synthetische 14-Monats-Demo laden/);
assert.match(index, /href="\.\/macro\.html"/);
assert.match(css, /@media\(max-width:720px\)/);
console.log('A05 T-0063 macro dashboard regressions: PASS');
