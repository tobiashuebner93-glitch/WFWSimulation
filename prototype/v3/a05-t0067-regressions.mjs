import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  V3_FINANCIAL_CALCULATION_VERSION,
  calculateV3OfferEstimate,
  calculateV3BabRate,
  allocateV3BabPool,
  aggregateV3KpiPeriods,
  createV3OfferSnapshot,
  acceptV3OfferSnapshot
} from '../v3-financial-calculation.js';

const html = await readFile(new URL('./finance.html', import.meta.url), 'utf8');
const css = await readFile(new URL('./finance.css', import.meta.url), 'utf8');
const js = await readFile(new URL('./finance.js', import.meta.url), 'utf8');
const index = await readFile(new URL('./index.html', import.meta.url), 'utf8');

assert.equal(V3_FINANCIAL_CALCULATION_VERSION, 'V3-FINANCIAL-CALCULATION-1');
assert.match(html, /name="netPrice"[^>]*required/);
assert.match(html, /name="babAllocated"[^>]*required/);
assert.match(html, /id="cost-rows"/);
assert.match(html, /id="bab-pools"/);
assert.match(html, /id="flow-rows"/);
assert.match(html, /id="stock-rows"/);
assert.match(html, /id="snapshot-form"/);
assert.match(html, /id="accept-form"/);
assert.match(html, /name="acceptedAt" type="date" required/);
assert.doesNotMatch(html, /\bvalue\s*=\s*["'][^"']*[0-9][^"']*["']/i, 'no product numeric defaults in forms');
assert.match(html, /type="module" src="\.\/finance\.js"/);
assert.match(index, /href="\.\/finance\.html"/);
assert.match(css, /@media\(max-width:720px\)/);
assert.match(css, /grid-template-columns:1fr/);
assert.match(html, /role="status" aria-live="polite"/);

for (const api of ['calculateV3OfferEstimate', 'calculateV3BabRate', 'allocateV3BabPool', 'aggregateV3KpiPeriods', 'createV3OfferSnapshot', 'acceptV3OfferSnapshot']) {
  assert.match(js, new RegExp(`\\b${api}\\b`), `UI must use A03 API ${api}`);
}
assert.match(js, /from '\.\.\/v3-financial-calculation\.js'/);
assert.doesNotMatch(js, /engine\.js|prototype\/app\.js|localStorage|fetch\s*\(/i);
assert.match(js, /variable:variable==='true'/, 'cost classification is explicit');
assert.match(js, /Der gerundete Anzeigesatz wird nicht weitergerechnet/);
assert.doesNotMatch(js, /basisValue\s*:\s*rate\.displayValue/, 'rounded display rate is never fed back into calculations');
assert.match(js, /rate\.numeratorCents/);
assert.match(js, /rate\.denominator/);
assert.match(js, /rate\.displayValue/);
assert.match(js, /allocateV3BabPool\(/);
assert.match(js, /rate=allocation\.rate/,'physical keys must use the API-derived common denominator');
assert.match(js, /allocationMode:mode/);
assert.match(js, /Separate Satzbasis: physische Gesamt-Treibermenge/);
assert.match(js, /basisKind:'driver',basisValue,unitLabel/);
assert.match(js, /kein Mengensatz|Kein Mengensatz/);
assert.match(js, /Gemeinsame Periode/);
assert.match(js, /dieselbe Einheit/);
assert.match(js, /Physische Treibermengen/);
assert.match(js, /Dimensionslose Anteile/);
assert.match(js, /reconciliationDifferenceCents/);
assert.match(js, /metricId:`\$\{view\}:\$\{metric\}`/);
assert.match(js, /aggregateV3KpiPeriods\(\{flows,stockSnapshots\}\)/);
assert.equal(js.includes('function isSnapshotAccepted(offerId)'),true);
assert.equal(js.includes('a new draft can still be calculated'),true);
assert.equal(js.includes('calculation:{...estimate,directCostLabels:estimateLabels}'),true);
assert.match(js, /acceptV3OfferSnapshot\(snapshot,data\.acceptedAt\)/);
assert.doesNotMatch(js, /calculation-form[^\n]*disabled/);
assert.match(js, /!snapshots.some\(snapshot=>!isSnapshotAccepted/);
assert.match(js, /catch\(error\)/, 'invalid/live inputs report errors rather than silently using zero');
assert.match(js, /Keine Buchung|keine Buchung/);

// A09 stale-estimate regression: execute the actual UI invalidation/control functions with a tiny DOM stub.
const fnSource=name=>{const match=js.match(new RegExp(`function ${name}\\([^)]*\\)\\{[\\s\\S]*?\\n\\}`));assert.ok(match,`missing UI function ${name}`);return match[0];};
const staleHarness=new Function('initial',`let estimate=initial.estimate,estimateLabels=initial.labels,snapshots=[],acceptedSnapshots=[];const elements={'#calc-status':{},'#estimate-output':{},'#snapshot-form':{},'#accept-form':{},'#offer-status':{}};const $=key=>elements[key];function setHidden(element,hidden){element.hidden=hidden;}function isSnapshotAccepted(offerId){return acceptedSnapshots.some(item=>item.offerId===offerId);}function renderAcceptedSnapshots(){}${fnSource('setSnapshotControls')}${fnSource('invalidateEstimate')}invalidateEstimate();const stale={estimate,labels:estimateLabels,snapshotHidden:elements['#snapshot-form'].hidden,status:elements['#calc-status'].textContent};estimate={netPriceCents:123};setSnapshotControls();return {stale,snapshotVisibleAfterSuccessfulRecalc:!elements['#snapshot-form'].hidden};`)({estimate:{netPriceCents:100},labels:[{id:'old-cost'}]});
assert.equal(staleHarness.stale.estimate,null);
assert.deepEqual(staleHarness.stale.labels,[]);
assert.equal(staleHarness.stale.snapshotHidden,true);
assert.match(staleHarness.stale.status,/Veraltet/);
assert.equal(staleHarness.snapshotVisibleAfterSuccessfulRecalc,true);
assert.match(js,/catch\(error\)\{estimate=null;estimateLabels=\[\];/,'failed calculation clears prior estimate/labels');
assert.match(js,/addEventListener\('input',invalidateEstimate\)/);
assert.match(js,/addEventListener\('change',invalidateEstimate\)/);

// V-DB-01 plus cent-near bounds: the UI delegates the arithmetic to A03.
const db = calculateV3OfferEstimate({
  netPriceCents: 100000,
  directCosts: [
    { id: 'material', amountCents: 30000, variable: true },
    { id: 'labor', amountCents: 12000, variable: true },
    { id: 'subcontract', amountCents: 5000, variable: true },
    { id: 'machine', amountCents: 8000, variable: false },
    { id: 'other', amountCents: 2500, variable: false }
  ], babAllocatedCents: 9000
});
assert.deepEqual([db.dbICents, db.allDirectCostsCents, db.resultAfterDirectCostsCents, db.resultAfterBabCents], [53000, 57500, 42500, 33500]);
for (const [price, variable, expected, near] of [[50000,49999,1,true],[50000,50000,0,true],[50000,50001,-1,true],[50000,49998,2,false],[50000,50002,-2,false]]) {
  const result=calculateV3OfferEstimate({netPriceCents:price,directCosts:[{id:'v',amountCents:variable,variable:true}]});
  assert.equal(result.dbICents,expected);assert.equal(result.dbICentNear,near);
}

// Exact BAB rate, rounded display-only value, stable rest-cent allocation and rejection of incomplete weights.
const babInput={poolCents:10001,unitLabel:'h',recipients:[{costCenterId:'CC-C',keyValue:'1'},{costCenterId:'CC-A',keyValue:'1'},{costCenterId:'CC-B',keyValue:'1'}]};
const babBefore=JSON.stringify(babInput);
const bab=allocateV3BabPool(babInput);
assert.deepEqual(Object.fromEntries(bab.allocations.map(x=>[x.costCenterId,x.amountCents])),{'CC-A':3334,'CC-B':3334,'CC-C':3333});
assert.equal(bab.reconciled,true);assert.equal(bab.reconciliationDifferenceCents,0);
assert.equal(bab.rate.numeratorCents,'10001');assert.equal(bab.rate.denominator,'3');
assert.equal(bab.rate.displayValue,'33,34 €/h');assert.equal(bab.rate.calculationUsesDisplayValue,false);
assert.equal(JSON.stringify(babInput),babBefore,'A03 does not mutate user input');
assert.equal(calculateV3BabRate({poolCents:10001,basisKind:'money',basisValue:30000}).displayValue,'33,34%');
assert.throws(()=>allocateV3BabPool({poolCents:10,allocationMode:'weights',recipients:[{costCenterId:'A',keyValue:'0.8'}]}),/summing exactly to 1/);

// V-RATE-03 from A03: key-based rate uses the physical-key sum; weights have no rate until explicit basis.
const rate03Keys=allocateV3BabPool({poolCents:1000,unitLabel:'h',recipients:[{costCenterId:'CC-A',keyValue:'1'},{costCenterId:'CC-B',keyValue:'1'},{costCenterId:'CC-C',keyValue:'1'}]});
assert.equal(rate03Keys.rate.denominator,'3');assert.equal(rate03Keys.rate.displayValue,'3,33 €/h');
assert.deepEqual(rate03Keys.allocations.map(row=>row.amountCents),[334,333,333]);
const rate03Weights=allocateV3BabPool({poolCents:1000,allocationMode:'weights',recipients:[{costCenterId:'CC-A',keyValue:'0.5'},{costCenterId:'CC-B',keyValue:'0.25'},{costCenterId:'CC-C',keyValue:'0.25'}]});
assert.equal(Object.hasOwn(rate03Weights,'rate'),false);assert.deepEqual(rate03Weights.allocations.map(row=>row.amountCents),[500,250,250]);
const rate03Separate=calculateV3BabRate({poolCents:1000,basisKind:'driver',basisValue:'6',unitLabel:'h'});
assert.equal(rate03Separate.displayValue,'1,67 €/h');

// Offer snapshot retains a separate immutable copy; accepted price is fixed, no ledger/cash fields appear.
const calculation={...db,directCostLabels:[{id:'material',category:'manually entered'}]};
const snapshot=createV3OfferSnapshot({offerId:'SYNTHETIC-1',submittedAt:'2027-01-02',netPriceCents:100000,costVersion:'SYNTHETIC-COST',babVersion:'SYNTHETIC-BAB',calculation});
const accepted=acceptV3OfferSnapshot(snapshot,'2027-01-03');
assert.equal(Object.isFrozen(snapshot),true);assert.equal(accepted.contractPriceCents,100000);
calculation.directCostLabels[0].category='changed';assert.equal(snapshot.calculation.directCostLabels[0].category,'manually entered');
assert.equal('ledger' in accepted,false);assert.equal('cash' in accepted,false);

// Plan/actual labels and periods remain distinct; stocks remain dated snapshots, not sums.
const periods=aggregateV3KpiPeriods({
  flows:[{metricId:'Plan:margin',date:'2027-01-31',amountCents:1000},{metricId:'Ist:margin',date:'2027-02-01',amountCents:-1}],
  stockSnapshots:[{metricId:'bank',date:'2027-01-31',amountCents:2000},{metricId:'bank',date:'2027-02-28',amountCents:0}]
});
assert.equal(periods.monthlyFlows['Plan:margin']['2027-01'],1000);
assert.equal(periods.monthlyFlows['Ist:margin']['2027-02'],-1);
assert.equal(periods.stockSnapshots.length,2);
assert.deepEqual(periods.stockSnapshots.map(x=>x.date),['2027-01-31','2027-02-28']);

console.log('A05 T-0067 finance UI contract/regressions: PASS');
