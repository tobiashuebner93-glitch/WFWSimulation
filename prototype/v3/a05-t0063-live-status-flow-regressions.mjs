import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [css, html, runJs] = await Promise.all([
  readFile(new URL('./run.css', import.meta.url), 'utf8'),
  readFile(new URL('./run.html', import.meta.url), 'utf8'),
  readFile(new URL('./run.js', import.meta.url), 'utf8'),
]);

const baseStatusRule = css.match(/(?:^|})\.live-status\s*\{([^{}]*)\}/);
assert.ok(baseStatusRule, 'the live status has a base layout rule');
assert.match(baseStatusRule[1], /(?:^|;)\s*position\s*:\s*static(?:;|$)/, 'desktop and mobile use normal document flow');
const statusRules = [...css.matchAll(/\.live-status[^{}]*\{([^{}]*)\}/g)].map(match => match[1]);
assert.ok(statusRules.length >= 2, 'status and empty-state rules remain present');
assert.ok(statusRules.every(rule => !/(?:^|;)\s*position\s*:\s*(?:sticky|fixed)(?:;|$)/i.test(rule)), 'no live-status rule overlays page content at any viewport');
assert.match(css, /\.live-status:empty\s*\{[^{}]*display\s*:\s*none/i, 'an empty status has no visible box or layout footprint');

assert.match(html, /<p\b[^>]*id="live-status"[^>]*class="live-status"[^>]*role="status"[^>]*aria-live="polite"[^>]*><\/p>/, 'the status retains its live-region semantics');
assert.match(runJs, /status\.textContent\s*=/, 'controller messages still populate visible status text');

console.log('A05 T-0063 live-status normal-flow regressions PASS');
