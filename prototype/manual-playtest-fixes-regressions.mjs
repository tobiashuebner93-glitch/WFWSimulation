import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createInitialGame, advanceOneDay } from './engine.js';
import { estimateOrderEconomics } from './economics.js';
import { bankPosition } from './finance.js';

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
  "class=\"overdraft-caption\"",
  "negative-bank-position",
  "metric('Bankposition'",
  'Kostendeckende Untergrenze',
]) assert.ok(source.includes(required),`Missing expected playtest safeguard: ${required}`);

assert.equal(bankPosition({cash:0,overdraftDrawn:450}),-450,'A drawn overdraft must reduce the displayed bank position below zero');
assert.equal(bankPosition({cash:1250,overdraftDrawn:0}),1250,'Without overdraft the displayed bank position is the cash balance');
const acceptanceGame=createInitialGame(); acceptanceGame.date='2019-01-10'; const acceptanceOrder={id:'CUSTOMER-ACCEPTANCE-1',deliveredAt:'2019-01-01',acceptanceDue:'2019-01-10',acceptedAt:null,rejectedAt:null,invoiceReadyAt:null,status:'GELIEFERT'}; acceptanceGame.orders.push(acceptanceOrder); advanceOneDay(acceptanceGame); assert.equal(acceptanceOrder.acceptedAt,'2019-01-10','Acceptance should be decided by the simulated customer on the F3 due date'); assert.equal(acceptanceOrder.status,'ABGERECHNET'); assert.ok(acceptanceGame.events.some(event=>event.kind==='KUNDENABNAHME'&&event.text.includes('Auftraggeber')),'The acceptance event must identify the customer as decision maker');
console.log('Manual playtest fix regressions: PASS');

assert.ok(!source.includes('data-action="accept"')&&!source.includes('data-action="reject"'),'The contractor UI must not control customer acceptance or rejection');
assert.ok(source.includes('Der Auftraggeber prüft die Lieferung und entscheidet über die Abnahme.'),'Delivered orders must identify the customer as acceptance actor');
