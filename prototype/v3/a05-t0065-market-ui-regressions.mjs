import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createDocumentedMarketFixture, advanceMarketDate, submitPlayerOffer,
  getMarketScreenData, renderMarketScreen, renderProcessLearning,
} from './market.js';
import { getV3MarketPlayerView } from '../v3-market-simulation.js';
import { renderAcceptedRunOfferPrice, renderRunCommercialOfferForm } from './run.js';
import { validateV3MarketState } from '../v3-market-simulation.js';
import { V3_FINANCIAL_CALCULATION_VERSION, acceptV3OfferSnapshot } from '../v3-financial-calculation.js';

const acceptedRunInquiry={inquiryId:'accepted-run-inquiry',status:'resolved',ownOffer:{status:'accepted',netPriceCents:9000}};
assert.equal(renderAcceptedRunOfferPrice(acceptedRunInquiry),'<p class="accepted-contract-price"><strong>Fixierter Vertragspreis:</strong> 90,00 € netto</p>');
assert.equal(renderRunCommercialOfferForm(acceptedRunInquiry),'','accepted integrated-run offer exposes no form');
assert.doesNotMatch(renderAcceptedRunOfferPrice(acceptedRunInquiry),/<form|name="netPrice"|type="submit"/);
const run=createDocumentedMarketFixture();
assert.equal(validateV3MarketState(run.state),true);
assert.equal(run.state.parameters.minimumMonthlyCompetitorSample,3);
assert.deepEqual(new Set(run.state.segments.map(segment=>segment.segmentId)),new Set(['small','medium','large']));
assert.deepEqual(new Set(run.state.inquiries.map(inquiry=>inquiry.sizeClass)),new Set(['small','medium','large']));
let day=advanceMarketDate(run);
assert.equal(day.playerView.currentDate,'2027-01-04');
assert.ok(day.playerView.inquiries.every(row=>row.ownOffer===null||row.ownOffer.firmId==='player'));
let target=day.playerView.inquiries.find(row=>row.status==='open');
for(let tries=0;!target&&tries<5;tries+=1){day=advanceMarketDate(run);target=day.playerView.inquiries.find(row=>row.status==='open');}
assert.ok(target,'fixture opens at least one inquiry for the player');
assert.ok(target.requiredCapabilities.includes('turning'));
const offerBefore=structuredClone(run.state);
const submitted=submitPlayerOffer(run,{inquiryId:target.inquiryId,submittedAt:day.playerView.currentDate,netPrice:'90,00',variableCosts:'45,00',otherDirectCosts:'10,00',babAllocatedCents:'5,00',costVersion:'explicit-test-cost-version',babVersion:'explicit-test-bab-version'});
assert.equal(submitted.calculationSnapshot.modelVersion,V3_FINANCIAL_CALCULATION_VERSION);
assert.equal(submitted.calculationSnapshot.netPriceCents,9000);
assert.equal(submitted.calculationSnapshot.calculation.dbICents,4500);
assert.equal(submitted.calculationSnapshot.calculation.resultAfterBabCents,3000);
assert.ok(Object.isFrozen(submitted.calculationSnapshot),'A03 offer snapshot remains frozen');
assert.notDeepEqual(run.state,offerBefore,'market transition returns updated immutable state without mutating prior state');
const own=getV3MarketPlayerView(run.state).inquiries.find(row=>row.inquiryId===target.inquiryId).ownOffer;
assert.equal(own.status,'submitted');
assert.equal(own.calculationSnapshot.offerId,submitted.calculationSnapshot.offerId);
assert.equal(own.calculationSnapshot.netPriceCents,9000);
const marketBeforeLearning=structuredClone(run.state);
const practiceHtml=renderProcessLearning(getV3MarketPlayerView(run.state));
assert.match(practiceHtml,/Nur lesend/);
assert.match(practiceHtml,/identify_inquiry|Welche Angaben müssen vor einer Angebotsentscheidung geprüft werden/);
assert.match(practiceHtml,/Im V3-Prototyp noch nicht verbunden/);
assert.match(practiceHtml,/customerPaymentRef|Rechnung/);
assert.deepEqual(run.state,marketBeforeLearning,'read-only learning projection does not mutate market state');
const stubInquiry=(status,outcome)=>({inquiryId:`q-${status}-${outcome??'none'}`,status,outcome,expiresAt:'2027-01-09',requiredCapabilities:['turning'],sizeClass:'small',ownOffer:null});
const declinedView={inquiries:[stubInquiry('resolved','not_won')]};
const declinedBefore=structuredClone(declinedView);
const declinedLearning=renderProcessLearning(declinedView);
assert.match(declinedLearning,/declined_offer/);
assert.match(declinedLearning,/Die Kundenentscheidung hat den Auftrag nicht an dieses Unternehmen vergeben/);
assert.doesNotMatch(declinedLearning,/expired_inquiry/);
assert.deepEqual(declinedView,declinedBefore,'declined ending-branch render is read-only');
const expiredView={inquiries:[stubInquiry('expired','expired')]};
const expiredLearning=renderProcessLearning(expiredView);
assert.match(expiredLearning,/expired_inquiry/);
assert.match(expiredLearning,/Die Anfragefrist ist abgelaufen/);
assert.doesNotMatch(expiredLearning,/declined_offer/);
for(const [status,outcome] of [['resolved','won'],['open','open'],['submitted','submitted'],['accepted','accepted']]){
  const normal=renderProcessLearning({inquiries:[stubInquiry(status,outcome)]});
  assert.doesNotMatch(normal,/declined_offer|expired_inquiry/,`${status}/${outcome} must not show a terminal branch`);
}
const noStateLearning=renderProcessLearning({inquiries:[]});
assert.doesNotMatch(noStateLearning,/declined_offer|expired_inquiry/);
assert.match(noStateLearning,/Kein Endzweig ist für den aktuellen Marktzustand exakt belegt/);

// The safe projection and aggregate report are the only inputs to rendered customer/report views.
let screenData=getMarketScreenData(run); let rendered=renderMarketScreen(screenData);
for(const secret of ['competitor-a','competitor-b','ineligible','C-OFF|','10000','12000','30000','36000','50000','62000']) assert.ok(!rendered.inboxHtml.includes(secret),`inbox hides internal value ${secret}`);
assert.ok(rendered.inboxHtml.includes('Einladung erhalten'));
assert.ok(rendered.inboxHtml.includes('Eigenes Angebot'));
assert.ok(Array.isArray(screenData.report));
for(const row of screenData.report) assert.deepEqual(Object.keys(row).sort(),['meanCompetitorNetPriceCents','period','sampleCount','sizeClass','suppressed'].sort());
assert.ok(!JSON.stringify(screenData.report).includes('firmId'));
assert.ok(!JSON.stringify(screenData.report).includes('offerId'));

// Customer decision is delayed and accepted price/snapshot remain unchanged.
let resolved=null;
for(let tries=0;tries<5&&!resolved;tries+=1){day=advanceMarketDate(run);resolved=getV3MarketPlayerView(run.state).inquiries.find(row=>row.inquiryId===target.inquiryId&&row.ownOffer?.status==='accepted');}
assert.ok(resolved,'fixture customer resolves the submitted offer after a delay');
assert.equal(resolved.ownOffer.netPriceCents,9000);
assert.equal(resolved.ownOffer.calculationSnapshot.netPriceCents,9000);
const acceptedSnapshot=acceptV3OfferSnapshot(resolved.ownOffer.calculationSnapshot,getV3MarketPlayerView(run.state).currentDate);
assert.equal(acceptedSnapshot.contractPriceCents,9000);
assert.equal(acceptedSnapshot.snapshot.offerId,resolved.ownOffer.calculationSnapshot.offerId);
assert.ok(Object.isFrozen(acceptedSnapshot));
rendered=renderMarketScreen(getMarketScreenData(run));
assert.ok(rendered.inboxHtml.includes('Fixierter Vertragspreis'));
assert.ok(rendered.inboxHtml.includes('90,00 € netto'));
const acceptedCardStart = rendered.inboxHtml.indexOf(`<article class="request" data-inquiry-id="${resolved.inquiryId}"`);
assert.notEqual(acceptedCardStart, -1, 'accepted inquiry is present in the rendered inbox');
const acceptedCardEnd = rendered.inboxHtml.indexOf('<article class="request"', acceptedCardStart + 1);
const acceptedCardHtml = rendered.inboxHtml.slice(acceptedCardStart, acceptedCardEnd === -1 ? undefined : acceptedCardEnd);
assert.match(acceptedCardHtml, /Fixierter Vertragspreis/);
assert.doesNotMatch(acceptedCardHtml, /<form|name="netPrice"|type="submit"/, 'accepted offer has no editable offer form or resubmission control');
assert.equal(validateV3MarketState(run.state),true);
assert.equal(run.state.parameters.minimumMonthlyCompetitorSample,3);
assert.deepEqual(new Set(run.state.segments.map(segment=>segment.segmentId)),new Set(['small','medium','large']));
assert.deepEqual(new Set(run.state.inquiries.map(inquiry=>inquiry.sizeClass)),new Set(['small','medium','large']));

// An unanswered inquiry follows the API's expiry path and appears as expired in the safe projection.
const expiryRun=createDocumentedMarketFixture('no_competitor_bids');
let expiryDay=advanceMarketDate(expiryRun);
let unanswered=expiryDay.playerView.inquiries.find(row=>row.status==='open');
for(let tries=0;!unanswered&&tries<6;tries+=1){expiryDay=advanceMarketDate(expiryRun);unanswered=expiryDay.playerView.inquiries.find(row=>row.status==='open');}
assert.ok(unanswered);
let expired=null;
for(let tries=0;tries<7&&!expired;tries+=1){expiryDay=advanceMarketDate(expiryRun);expired=getV3MarketPlayerView(expiryRun.state).inquiries.find(row=>row.inquiryId===unanswered.inquiryId&&row.status==='expired');}
assert.ok(expired,'unanswered request expires and is rendered from the safe view');
assert.ok(renderMarketScreen(getMarketScreenData(expiryRun)).inboxHtml.includes('Abgelaufen'));


// The bundled report demo covers all three requested order sizes after the simulated month advances.
const reportRun=createDocumentedMarketFixture();
for(let tries=0;tries<27;tries+=1) advanceMarketDate(reportRun);
const threeSizeReport=getMarketScreenData(reportRun).report;
assert.deepEqual(new Set(threeSizeReport.map(row=>row.sizeClass)),new Set(['small','medium','large']));
assert.ok(threeSizeReport.every(row=>row.sampleCount>=3&&!row.suppressed&&Number.isSafeInteger(row.meanCompetitorNetPriceCents)));
const suppressedMarkup=renderMarketScreen({...getMarketScreenData(reportRun),report:[{period:'2027-01',sizeClass:'medium',sampleCount:2,meanCompetitorNetPriceCents:null,suppressed:true}]}).reportHtml;
assert.match(suppressedMarkup,/Unter Mindeststichprobe verborgen/);
assert.match(suppressedMarkup,/n = 2/);
assert.doesNotMatch(suppressedMarkup,/competitor-|offerId|30000|36000/);
// Minimal DOM stub exercises real page handlers, initial fixture load, submit, and next-day rerender.
class FakeElement {
  constructor(id){this.id=id;this.listeners={};this.textContent='';this.innerHTML='';this.className='';this.disabled=false;this.dataset={};this.classList={toggle(){}};}
  addEventListener(type,handler){this.listeners[type]=handler;}
}
const elements=new Map(['run-status','load-fixture','load-expiry-fixture','next-day','date-label','inbox-count','inbox','report-period','competitor-report','learning-practice','live-status'].map(id=>[id,new FakeElement(id)]));
globalThis.document={getElementById:id=>elements.get(id)};
const domModule=await import(`./market.js?dom-stub=${Date.now()}`);
const loadHandler=elements.get('load-fixture').listeners.click;
loadHandler({});
assert.match(elements.get('run-status').textContent,/synthetisch/);
assert.match(elements.get('date-label').textContent,/2027-01-04/);
assert.match(elements.get('learning-practice').innerHTML,/Nur lesend/);
assert.match(elements.get('learning-practice').innerHTML,/noch nicht verbunden/);
let html=elements.get('inbox').innerHTML;
for(let tries=0;!html.includes('data-offer-form')&&tries<5;tries+=1){elements.get('next-day').listeners.click({});html=elements.get('inbox').innerHTML;}
const id=html.match(/data-inquiry="([^"]+)"/);
assert.ok(id,'loaded DOM contains an active offer form');
const form={dataset:{inquiry:id[1]},closest(selector){return selector==='[data-offer-form]'?this:null;}};
globalThis.FormData=class{constructor(){this.values={netPrice:'90,00',variableCosts:'45,00',otherDirectCosts:'10,00',babAllocatedCents:'5,00',costVersion:'ui-cost-v1',babVersion:'ui-bab-v1'};}get(key){return this.values[key];}};
await elements.get('inbox').listeners.submit({target:form,preventDefault(){}});
assert.match(elements.get('live-status').textContent,/Angebot eingereicht/);
assert.ok(elements.get('inbox').innerHTML.includes('Eigenes Angebot'));
assert.match(elements.get('learning-practice').innerHTML,/identify_inquiry|Welche Angaben müssen vor einer Angebotsentscheidung geprüft werden/);
const uiMarketStateBeforeLearningRender=structuredClone(run.state);
renderProcessLearning(getV3MarketPlayerView(run.state));
assert.deepEqual(run.state,uiMarketStateBeforeLearningRender,'learning renderer is read-only after UI offer submission');
elements.get('next-day').listeners.click({});
assert.match(elements.get('date-label').textContent,/2027-01-/);
assert.ok(elements.get('competitor-report').innerHTML.length>0);
assert.ok(domModule);
const page=await readFile(new URL('./market.html',import.meta.url),'utf8');
const css=await readFile(new URL('./market.css',import.meta.url),'utf8');
const index=await readFile(new URL('./index.html',import.meta.url),'utf8');
assert.match(page,/name="viewport"/);
assert.match(page,/id="learning-practice"/);
assert.match(page,/Ablauf-Fixture laden/);
assert.match(index,/href="\.\/market\.html"/);
assert.match(css,/@media\(max-width:760px\)/);
console.log('A05 T-0065 market UI regressions: PASS');
