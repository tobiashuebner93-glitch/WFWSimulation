import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createInitialGame } from './engine.js';
import { estimateOrderEconomics } from './economics.js';

const game=createInitialGame();
const unprofitable={id:'MANUAL-DB-CASE',marketReferenceNet:100,materials:{steel:100,aluminium:0,parts:0},planningHours:2,operations:[{totalHours:8}]};
const economics=estimateOrderEconomics(unprofitable,game,100);
assert.ok(economics.contribution<0,'A market reference below scenario costs must remain an explicit negative DB case');
assert.ok(economics.costCoveringNet>economics.marketReferenceNet,'The cost-covering threshold must be distinct from the market reference');

const source=await readFile(new URL('./app.js',import.meta.url),'utf8');
for(const required of [
  "data-action=\"open-message\"",
  "data-action=\"open-message-order\"",
  "'MARKT_VERLOREN','STORNIERT'",
  "estimate.contribution<0&&!confirm(",
  "metric('Bankbestand'",
  "metric('Freier Dispo'",
  'Kostendeckende Untergrenze',
]) assert.ok(source.includes(required),`Missing expected playtest safeguard: ${required}`);

console.log('Manual playtest fix regressions: PASS');
