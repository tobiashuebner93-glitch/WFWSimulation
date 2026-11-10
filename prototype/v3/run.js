import { createV3Run, openV3RunDay, submitV3RunCounterResponse, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction, getV3RunEquipmentInstructionStatus, recordV3RunSpecialEquipmentAuthorization, placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment, submitV3RunOffer, submitV3RunProductSaleOffer, recordV3RunProductCostLayer, recordV3RunProductSaleBuyerDecision, dispatchV3RunProductSale, closeV3RunDay, planV3RunWorkOrder, completeV3RunWorkOrderOperation, deliverV3RunCustomerWorkOrder, validateV3RunState, getV3RunCustomerEvidence, getV3RunLearningCatalog, getV3RunLearningEvents, answerV3RunLearningEvent } from '../v3-run-orchestrator.js';
import { createV3MarketState, createV3MarketOfferId, getV3MarketPlayerView, getV3MonthlyCompetitorReport, V3_FINANCIAL_SNAPSHOT_VERSION, V3_MARKET_INVITATION_PRICE_PROFILE_ID, V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from '../v3-market-simulation.js';
import { createV3ProductState, createV3Product, defineV3ProductSteps, estimateV3Product, planV3ProductStep, completeV3ProductStep, completeV3SyntheticSkillCourse, getV3ProductMarketOpportunities, getV3SupplierScenarioQuotes, V3_SUPPLIER_PRICE_ANCHORS, V3_SUPPLIER_SCENARIO_PROFILES } from '../v3-product-lifecycle.js';
import { calculateV3OfferEstimate, calculateV3OfferWithBab, createV3OfferSnapshot } from '../v3-financial-calculation.js';
import { V3_FINANCE_RUNTIME_VERSION, createV3FinanceState, recordV3ScenarioInvoiceFromCustomerEvidence, recordV3SupplierInvoiceFromRunEvidence, recordV3SupplierPayment, processV3ScenarioCustomerReceiptsDue, reconcileV3Finance } from '../v3-finance-runtime.js';
import { allocateV3ForeignDemandTemplates, buildRunMacroMonthInput, buildV3BaseMarketTemplates, createRunMacroFixture, getV3RunSegmentTemplates, V3_FOREIGN_DEMAND_FIXTURE_ID, V3_FX_OFFER_PLAN_FIXTURE_ID, V3_MARKET_SEGMENT_TEMPLATE_CATALOG, V3_RUN_MACRO_FIXTURE_VERSION, V3_RUN_MACRO_PATHS } from '../v3-run-macro-fixture.js';
import { V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID } from '../v3-destatis-import-price-reference.js';
import { calculateV3MacroDemand, V3_MACRO_DEMAND_MODEL_VERSION } from '../v3-macro-demand-channel.js';
import { buildV3ManagementOrderPlan, createV3ManagementContractSnapshot } from '../v3-management-order-planner.js';
import { V3_MANAGEMENT_DIRECTIONS, projectV3ManagementStrategy } from '../v3-management-strategy.js';
import { projectV3MacroPolicyImpacts } from '../v3-macro-policy-impact.js';
import { projectV3MacroTradeImpacts } from '../v3-macro-trade-impact.js';
import { projectV3BusinessCostPlanIndexes } from '../v3-business-cost-plan-index.js';
import { projectV3FinancingReference } from '../v3-financing-reference.js';
import { calculateV3OfferPlanSensitivity } from '../v3-offer-plan-sensitivity.js';
import { V3_COST_PLAN_FIXTURE_ID } from '../v3-cost-plan-scenario-fixture.js';
import { evaluateInquiryPractice, renderInquiryPractice } from './inquiry-practice.js';
import { createV3StartingResources, getV3OperationalMarketCapabilities, getV3RequirementGaps, formatV3RequirementGaps, getV3CompetencyLabel, getV3SkillDefinition, getV3ProductArchetype, V3_PRODUCT_ARCHETYPES, V3_METAL_OCCUPATIONS, V3_SYNTHETIC_SKILL_COURSES } from "../v3-occupational-competencies.js";

export const V3_RUN_UI_FIXTURE_VERSION = 'V3-RUN-UI-SYNTH-2';
export const V3_RUN_SAVE_VERSION = 'V3-RUN-SAVE-2';
export const V3_RUN_OPERATING_IMPACT_MODEL_VERSION = 'V3-OPERATING-IMPACT-D0169-L0L1-1';
export const V3_RUN_OPERATING_IMPACT_PARAMETER_SET_ID = 'V3-OPERATING-IMPACT-5DAY-PEOPLE-HOURS-1';
export const V3_RUN_UI_DEFAULTS = Object.freeze({ startDate: '2027-01-04', endDate: '2027-01-29' });
const LEARNING_CATALOG = getV3RunLearningCatalog();
const PARAMETERS = Object.freeze({
  weekdayWeights: { mon: .2, tue: .2, wed: .2, thu: .2, fri: .2 },
  invitationWeights: { capacity: .25, reputation: .35, segmentFit: .4 },
  minimumInvitationScore: .2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 }, minimumMonthlyCompetitorSample: 3,
});
const SEGMENTS = Object.freeze([
  { segmentId: 'small', decisionWeights: { price: .6, reputation: .2, segmentFit: .2 } },
  { segmentId: 'medium', decisionWeights: { price: .5, reputation: .25, segmentFit: .25 } },
  { segmentId: 'large', decisionWeights: { price: .4, reputation: .25, segmentFit: .35 } },
]);
const SIZE_INPUTS = V3_MARKET_SEGMENT_TEMPLATE_CATALOG;
const FIRMS = () => [
  { firmId: 'player', role: 'player', reputation: .65, capacityUnits: 12, capabilities: ['turning', 'milling'], segmentFit: { small: .75, medium: .7, large: .6 } },
  { firmId: 'synthetic-competitor-a', role: 'competitor', reputation: .7, capacityUnits: 15, capabilities: ['turning', 'milling'], segmentFit: { small: .8, medium: .78, large: .75 }, offerPriceCentsBySizeClass: { small: 10000, medium: 30000, large: 50000 } },
  { firmId: 'synthetic-competitor-b', role: 'competitor', reputation: .55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: .6, medium: .55, large: .5 }, offerPriceCentsBySizeClass: { small: 12000, medium: 36000, large: 62000 } },
  { firmId: 'synthetic-competitor-c', role: 'competitor', reputation: .62, capacityUnits: 10, capabilities: ['turning'], segmentFit: { small: .68, medium: .63, large: .56 }, offerPriceCentsBySizeClass: { small: 11500, medium: 34500, large: 58500 } },
].map(firm => ({ ...firm, segmentFit: { ...firm.segmentFit }, capabilities: [...firm.capabilities], ...(firm.offerPriceCentsBySizeClass ? { offerPriceCentsBySizeClass: { ...firm.offerPriceCentsBySizeClass } } : {}) }));
const isoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const shiftDate = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const mondayOf = date => { const day = new Date(`${date}T12:00:00Z`).getUTCDay(); return shiftDate(date, -(day === 0 ? 6 : day - 1)); };
const isWorkday = date => ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
const euro = cents => { if (!Number.isSafeInteger(cents)) return '—'; const n = Math.abs(cents); return `${cents < 0 ? '−' : ''}${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Math.floor(n / 100))},${String(n % 100).padStart(2, '0')} €`; };
const euroToCents = value => { const match = String(value).trim().replace(',', '.').match(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/); if (!match) throw new TypeError('Betrag bitte als nichtnegative Eurozahl mit höchstens zwei Nachkommastellen eingeben.'); const [whole, fraction = ''] = match[0].split('.'); const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0')); if (!Number.isSafeInteger(cents)) throw new TypeError('Betrag ist zu groß.'); return cents; };
const sizeName = value => ({ small: 'Klein', medium: 'Mittel', large: 'Groß' }[value] ?? value);
const marketCapabilityName = value => ({ 'manual-fabrication': 'Manuelle Fertigung', turning: 'Drehen', milling: 'Fräsen', welding: 'Schweißen', pneumatics: 'Pneumatik', forming: 'Umformen', casting: 'Gießen' }[value] ?? value);
const unitName = value => ({ pieces: 'Stück', sets: 'Sätze', lots: 'Lose' }[value] ?? value);
const compactReference = value => { const text = String(value ?? ''); return text.length > 42 ? `${text.slice(0, 17)}…${text.slice(-12)}` : text; };
const V3_METAL_GOODS_CONTRACT_UI_LABEL = 'Werklieferung zwischen Unternehmen (Herstellung und Lieferung beweglicher Metallteile)';
const statusName = value => ({ scheduled: 'Geplant', open: 'Offen', resolved: 'Entschieden', expired: 'Abgelaufen', accepted: 'Angenommen', declined: 'Abgelehnt', superseded: 'Durch neuere Angebotsfassung ersetzt', won: 'Angenommen', not_won: 'Nicht angenommen', awaiting_operational_plan: 'Arbeitsplanung ausstehend', in_progress: 'In Bearbeitung', ready_for_delivery: 'Leistung erbracht · Versand/Abnahme ausstehend', pending_non_posting: 'Ausstehend · nicht gebucht', performance_pending: 'Leistung/Finanzbeleg ausstehend' }[value] ?? value);
function renderEquipmentInstructionPanel(run, inv, active) {
  const plans = inv.equipmentInstructionPlans ?? [];
  const fmt = d => new Intl.DateTimeFormat("de-DE",{dateStyle:"medium",timeZone:"UTC"}).format(new Date(d+"T00:00:00Z"));
  const dates=[];
  if(active) for(let d=run.activeDay.date,n=0;d<=run.endDate&&n<15;d=shiftDate(d,1)){if(!isWorkday(d))continue;dates.push("<option value=\"" + escapeHtml(d) + "\"" + (d===run.activeDay.date?" selected":"") + ">"+escapeHtml(fmt(d))+(d===run.activeDay.date?" · heute":"")+"</option>");n++;}
  const cards=[];
  for(const person of inv.people??[]) for(const equipment of inv.equipment??[]){
    let s; try{s=getV3RunEquipmentInstructionStatus(run,{personId:person.id,equipmentId:equipment.id});}catch(e){cards.push("<article class=\"instruction-pair\"><h4>"+escapeHtml(person.displayName||person.id)+" · "+escapeHtml(equipment.name||equipment.id)+"</h4><p>Status nicht verfügbar: "+escapeHtml(e.message)+"</p></article>");continue;}
    const own=plans.filter(x=>x.personId===person.id&&x.equipmentId===equipment.id).sort((a,b)=>b.plannedDate.localeCompare(a.plannedDate));
    const pending=own.find(x=>x.status==="planned"), missed=own.find(x=>x.status==="missed"), done=own.find(x=>x.status==="completed"), hazard=s.hazardRequirementRef;
    let note;
    if(pending) note="<p class=\"instruction-state instruction-state-planned\">Geplant "+fmt(pending.plannedDate)+" · "+pending.durationMinutes+" Min. Person- und Arbeitsmittelkapazität reserviert.</p>";
    else if(!s.instructionCurrent) note="<p class=\"instruction-state instruction-state-required\">"+(missed?"Plan "+fmt(missed.plannedDate)+" verpasst; Block storniert. ":"")+(s.lastInstructionDate?"Auffrischung fällig.":"Erstunterweisung fehlt.")+" Nutzungs-Gate geschlossen.</p>";
    else note="<p class=\"instruction-state instruction-state-ready\">Unterweisung aktuell"+(s.nextDueDate?" bis "+fmt(s.nextDueDate):"")+(done?" · erledigt "+fmt(done.plannedDate):"")+".</p>";
    if(hazard&&!s.authorizationCurrent) note+="<p class=\"instruction-state instruction-state-required\">Sonderbeauftragung fehlt: "+escapeHtml(hazard)+" (getrennt von Skills/Qualifikation).</p>";
    else if(hazard) note+="<p class=\"instruction-state instruction-state-ready\">Sonderbeauftragung für "+escapeHtml(hazard)+" liegt vor.</p>";
    let action="";
    if(pending&&active&&pending.plannedDate===run.activeDay.date) action="<button type=\"button\" class=\"secondary equipment-instruction-complete\" data-id=\""+escapeHtml(pending.instructionId)+"\">Geplante Unterweisung abschließen · "+pending.durationMinutes+" Min.</button>";
    else if(!pending&&!s.instructionCurrent&&active&&dates.length){const id="INSTRUCTION|"+encodeURIComponent(run.runId)+"|"+encodeURIComponent(person.id)+"|"+encodeURIComponent(equipment.id)+"|"+(plans.length+cards.length+1);action="<form class=\"equipment-instruction-plan-form\" data-person=\""+escapeHtml(person.id)+"\" data-equipment=\""+escapeHtml(equipment.id)+"\" data-id=\""+escapeHtml(id)+"\"><label>Arbeitstag<select name=\"plannedDate\">"+dates.join("")+"</select></label><button type=\"submit\">Zeitblock einplanen · "+s.durationMinutesForNextInstruction+" Min.</button></form>";}
    else if(!active&&(!s.instructionCurrent||(hazard&&!s.authorizationCurrent))) action="<p class=\"field-note\">Öffne einen Simulationstag, um den Arbeitsblock einzuplanen.</p>";
    if(hazard&&s.instructionCurrent&&!s.authorizationCurrent&&active){const id="AUTH|"+encodeURIComponent(run.runId)+"|"+encodeURIComponent(person.id)+"|"+encodeURIComponent(equipment.id)+"|"+encodeURIComponent(hazard)+"|"+encodeURIComponent(run.activeDay.date);action+="<button type=\"button\" class=\"secondary equipment-special-authorization\" data-person=\""+escapeHtml(person.id)+"\" data-equipment=\""+escapeHtml(equipment.id)+"\" data-hazard=\""+escapeHtml(hazard)+"\" data-id=\""+escapeHtml(id)+"\">Sonderbeauftragung dokumentieren</button>";}
    cards.push("<article class=\"instruction-pair\"><h4>"+escapeHtml(person.displayName||person.id)+" · "+escapeHtml(equipment.name||equipment.id)+"</h4><p class=\"instruction-meta\">Revision "+escapeHtml(s.equipmentRevision)+" · "+(s.instructionCurrent?"aktuell":"nicht aktuell")+"</p>"+note+"<div class=\"instruction-actions\">"+action+"</div></article>");
  }
  return "<section class=\"instruction-section\"><h3>Arbeitsmittel-Unterweisung &amp; Beauftragung</h3><p>Person- und gerätegebunden; getrennt von Skills, Ausbildung und Qualifikation. Planen reserviert Kapazität, erst der Abschluss am geplanten Tag öffnet das Gate.</p><div class=\"instruction-grid\">"+(cards.join("")||"<p>Keine Personen oder Arbeitsmittel vorhanden.</p>")+"</div></section>";
}
const QUALITY_TARGET_SKILL_FLOOR = Object.freeze({ basic: 1, standard: 2, premium: 3 });

export function createRunFromInputs({ scenarioId, seed, startDate, endDate, macroPath = 'UPSWING', costPlanFixtureId = 'NEUTRAL', foreignDemandFixtureId = 'NEUTRAL', importPriceBenchmarkId = 'NEUTRAL', fxOfferPlanFixtureId = 'NEUTRAL', marketInvitationProfileId = 'NEUTRAL' }) {
  for (const [key, value] of Object.entries({ scenarioId, seed })) if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${key} ist erforderlich.`);
  if (!isoDate(startDate) || !isoDate(endDate) || endDate < startDate) throw new TypeError('Bitte einen gültigen Datumsbereich angeben.');
  if (startDate !== V3_RUN_UI_DEFAULTS.startDate) throw new TypeError('V3 beginnt im aktuellen Startprofil am 04.01.2027. Ein anderer Startzeitpunkt ist in V3 derzeit nicht freigegeben.');
  if (!['NEUTRAL', V3_COST_PLAN_FIXTURE_ID].includes(costPlanFixtureId)) throw new TypeError('Unbekanntes Kostenplan-Fixture.');
  if (!['NEUTRAL', V3_FOREIGN_DEMAND_FIXTURE_ID].includes(foreignDemandFixtureId)) throw new TypeError('Unbekanntes Auslandsnachfrage-Fixture.');
  if (!['NEUTRAL', V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID].includes(importPriceBenchmarkId)) throw new TypeError('Unbekannte Destatis-Einfuhrpreisreferenz.');
  if (!['NEUTRAL', V3_FX_OFFER_PLAN_FIXTURE_ID].includes(fxOfferPlanFixtureId)) throw new TypeError('Unbekanntes FX-Angebotsplan-Fixture.');
  if (!['NEUTRAL', V3_MARKET_INVITATION_PRICE_PROFILE_ID].includes(marketInvitationProfileId)) throw new TypeError('Unbekanntes synthetisches Einladungsprofil.');
  if (costPlanFixtureId === V3_COST_PLAN_FIXTURE_ID && (startDate.slice(0, 7) !== '2027-01' || endDate < '2027-02-01')) throw new TypeError('Das synthetische Kostenplan-Szenario benötigt einen Run, der im Januar 2027 startet und mindestens bis Februar 2027 reicht.');
  if (foreignDemandFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID && (startDate !== '2027-01-04' || endDate < '2027-02-01')) throw new TypeError('Das synthetische Auslandsnachfrage-Szenario benötigt einen Shared Run ab 2027-01-04 bis mindestens 2027-02-01.');
  const hasOptionalTail = foreignDemandFixtureId !== 'NEUTRAL' || importPriceBenchmarkId !== 'NEUTRAL' || fxOfferPlanFixtureId !== 'NEUTRAL';
  const optionalTail = marketInvitationProfileId !== 'NEUTRAL'
    ? `|${encodeURIComponent(foreignDemandFixtureId)}|${encodeURIComponent(importPriceBenchmarkId)}|${encodeURIComponent(fxOfferPlanFixtureId)}|${encodeURIComponent(marketInvitationProfileId)}`
    : fxOfferPlanFixtureId !== 'NEUTRAL'
    ? `|${encodeURIComponent(foreignDemandFixtureId)}|${encodeURIComponent(importPriceBenchmarkId)}|${encodeURIComponent(fxOfferPlanFixtureId)}`
    : hasOptionalTail
      ? `|${encodeURIComponent(foreignDemandFixtureId)}${importPriceBenchmarkId === 'NEUTRAL' ? '' : `|${encodeURIComponent(importPriceBenchmarkId)}`}`
      : '';
  const runId = `V3|${encodeURIComponent(scenarioId.trim())}|${encodeURIComponent(seed.trim())}|${startDate}|${encodeURIComponent(macroPath)}|${encodeURIComponent(costPlanFixtureId)}${optionalTail}`;
  const marketParameters = structuredClone(PARAMETERS);
  if (marketInvitationProfileId === V3_MARKET_INVITATION_PRICE_PROFILE_ID) {
    marketParameters.invitationWeights = { capacity: .2, reputation: .2, segmentFit: .2, price: .4 };
    marketParameters.minimumInvitationScore = .77;
  }
  const marketState = createV3MarketState({ runId, scenarioId: scenarioId.trim(), seed: seed.trim(), parameterSetId: V3_RUN_UI_FIXTURE_VERSION, startDate, parameters: marketParameters, segments: structuredClone(SEGMENTS), firms: FIRMS() });
  const macroState = createRunMacroFixture({ runId, scenarioId: scenarioId.trim(), seed: seed.trim(), path: macroPath, costPlanFixtureId, foreignDemandFixtureId, importPriceBenchmarkId, fxOfferPlanFixtureId });
  const state = createV3Run({ runId, scenarioId: scenarioId.trim(), seed: seed.trim(), startDate, endDate, marketState, macroState, costPlanFixtureId, foreignDemandFixtureId, importPriceBenchmarkId, fxOfferPlanFixtureId, marketInvitationProfileId }); validateV3RunState(state); return state;
}
export function createFinanceStateForRun(runState) {
  validateV3RunState(runState);
  if (runState.startDate !== V3_RUN_UI_DEFAULTS.startDate) throw new TypeError('Für diesen Lauf existiert kein bestätigtes V3-Eröffnungsprofil.');
  return createV3FinanceState({
    runId: runState.runId,
    opening: { date: '2027-01-01', sourceRef: 'D-0180:opening-profile-v3-2027', bankCents: 1_000_000, equityCents: 1_000_000, receivablesCents: 0, receivableSourceRefs: [] },
  });
}
export function createRunSaveEnvelope(runState, financeState) {
  validateRunMacroFixture(runState);
  validateV3RunState(runState);
  if (financeState) {
    if (financeState.runId !== runState.runId) throw new TypeError('Finanzzustand gehört zu einem anderen Lauf.');
    const asOfDate = runState.activeDay?.date ?? (runState.currentDate < financeState.opening.date ? financeState.opening.date : runState.currentDate);
    reconcileV3Finance(financeState, asOfDate);
  }
  return structuredClone({ saveVersion: V3_RUN_SAVE_VERSION, runState, financeState: financeState ?? null });
}
function validateRunMacroFixture(runState) {
  const macro = runState?.modules?.macro;
  const runId = typeof runState?.runId === 'string' ? runState.runId : '';
  const isSharedV3Run = runId.startsWith('V3|');
  let runPath = null;
  let runParts = [];
  if (isSharedV3Run) {
    runParts = runId.split('|');
    try {
      if ((runParts.length === 5 || runParts.length === 6 || runParts.length === 7 || runParts.length === 8 || runParts.length === 9 || runParts.length === 10) && runParts[0] === 'V3') runPath = decodeURIComponent(runParts[4]);
    } catch { /* malformed run id is rejected by the same identity gate below */ }
    if (!runPath || !Object.hasOwn(V3_RUN_MACRO_PATHS, runPath)) {
      throw new TypeError('Der gespeicherte Makro-Fixturepfad ist unbekannt oder inkonsistent.');
    }
  }
  // Non-shared legacy runs may omit a macro module. A shared V3 run ID claims
  // the macro fixture contract and therefore must carry its matching module.
  if (!macro) {
    if (isSharedV3Run) throw new TypeError('Dem V3-Lauf fehlt das erforderliche Makro-Fixturemodul.');
    return null;
  }
  if (!isSharedV3Run) throw new TypeError('Das Makro-Fixturemodul besitzt keine passende V3-Laufkennung.');
  if (runState.modules?.market?.parameterSetId !== V3_RUN_UI_FIXTURE_VERSION) {
    throw new TypeError('Die Markt-/Makro-Übertragungsmodellversion des V3-Laufs ist unbekannt oder inkonsistent.');
  }
  if (macro.profileVersion !== V3_RUN_MACRO_FIXTURE_VERSION) {
    throw new TypeError('Die Makro-Fixtureversion des Laufs ist unbekannt oder inkonsistent.');
  }
  const selection = runState.costPlanFixtureId ?? 'NEUTRAL';
  const exportSelection = runParts.length >= 7 ? decodeURIComponent(runParts[6]) : 'NEUTRAL';
  const importPriceSelection = runParts.length >= 8 ? decodeURIComponent(runParts[7]) : 'NEUTRAL';
  const fxOfferPlanSelection = runParts.length >= 9 ? decodeURIComponent(runParts[8]) : 'NEUTRAL';
  const marketInvitationSelection = runParts.length === 10 ? decodeURIComponent(runParts[9]) : 'NEUTRAL';
  if (exportSelection !== (runState.foreignDemandFixtureId ?? 'NEUTRAL')) throw new TypeError('Das gespeicherte Auslandsnachfrage-Fixture passt nicht zur Laufkennung.');
  if (importPriceSelection !== (runState.importPriceBenchmarkId ?? 'NEUTRAL')) throw new TypeError('Die gespeicherte Destatis-Referenz passt nicht zur Laufkennung.');
  if (fxOfferPlanSelection !== (runState.fxOfferPlanFixtureId ?? 'NEUTRAL')) throw new TypeError('Das gespeicherte FX-Angebotsplan-Fixture passt nicht zur Laufkennung.');
  if (marketInvitationSelection !== (runState.marketInvitationProfileId ?? 'NEUTRAL')) throw new TypeError('Das gespeicherte Einladungsprofil passt nicht zur Laufkennung.');
  const expectedSnapshotId = `fixture-snapshot:${runPath}${selection === 'NEUTRAL' ? '' : `:cost-plan:${selection}`}${exportSelection === 'NEUTRAL' ? '' : `:foreign-demand:${exportSelection}`}${importPriceSelection === 'NEUTRAL' ? '' : `:import-price-reference:${importPriceSelection}`}${fxOfferPlanSelection === 'NEUTRAL' ? '' : `:fx-offer-plan:${fxOfferPlanSelection}`}`;
  if (macro.sourceSnapshotId !== expectedSnapshotId) {
    throw new TypeError('Der gespeicherte Makro-Fixturepfad ist unbekannt oder inkonsistent.');
  }
  return runPath;
}
export function restoreRunSaveEnvelope(envelope) {
  if (!envelope || typeof envelope !== 'object' || envelope.saveVersion !== V3_RUN_SAVE_VERSION || !envelope.runState) throw new TypeError('Die Sicherungsdatei hat kein unterstütztes V3-Format.');
  validateRunMacroFixture(envelope.runState);
  validateV3RunState(envelope.runState);
  const financeState = envelope.financeState ?? null;
  if (financeState) {
    const opening = financeState.opening;
    if (financeState.modelVersion !== V3_FINANCE_RUNTIME_VERSION || !opening
      || opening.date !== '2027-01-01' || opening.sourceRef !== 'D-0180:opening-profile-v3-2027'
      || opening.bankCents !== 1_000_000 || opening.equityCents !== 1_000_000
      || opening.receivablesCents !== 0 || !Array.isArray(opening.receivableSourceRefs) || opening.receivableSourceRefs.length !== 0) {
      throw new TypeError('Sicherung abgelehnt: Das Finanz-Opening entspricht nicht dem belegten D-0180-Startstand für V3 2027.');
    }
    if (financeState.runId !== envelope.runState.runId) throw new TypeError('Run und Finanzzustand in der Sicherung passen nicht zusammen.');
    const invoiceIds = new Set();
    for (const invoice of financeState.invoices ?? []) {
      if (typeof invoice?.invoiceId !== 'string' || !invoice.invoiceId) continue;
      if (invoiceIds.has(invoice.invoiceId)) throw new TypeError('Die Sicherung enthält doppelte Rechnungskennungen.');
      invoiceIds.add(invoice.invoiceId);
    }
    const sourceInvoices = envelope.runState.modules.product?.supplierInvoiceEvidence ?? [];
    const supplierInvoices = financeState.supplierInvoices ?? [];
    const supplierFinanceEvents = (financeState.events ?? []).filter(event => ['supplier-invoice-ap', 'supplier-payment-executed'].includes(event.financeType));
    const sourceInvoiceFor = invoiceId => sourceInvoices.find(row => row.invoiceId === invoiceId);
    const sameInvoiceEvidence = (financeInvoice, sourceInvoice) => sourceInvoice && [
      'invoiceId', 'supplierId', 'orderId', 'shipmentId', 'quoteId', 'priceSnapshotFingerprint',
      'receiptMovementId', 'invoiceDate', 'dueDate', 'amountCents', 'currency', 'amountBasis',
      'taxStatus', 'taxAmountCents', 'paymentTermCalendarDays', 'sourceRef',
    ].every(key => financeInvoice[key] === sourceInvoice[key]);
    if (supplierInvoices.some(invoice => !sameInvoiceEvidence(invoice, sourceInvoiceFor(invoice.invoiceId)))) {
      throw new TypeError('Der gespeicherte Lieferanten-OP stimmt nicht mit Rechnung, Angebot und Wareneingang im Simulationslauf überein.');
    }
    for (const invoice of supplierInvoices) {
      const sourceEvents = supplierFinanceEvents.filter(event => event.financeType === 'supplier-invoice-ap' && event.invoiceId === invoice.invoiceId);
      if (sourceEvents.length !== 1 || sourceEvents[0].sourceRef !== invoice.sourceRef || sourceEvents[0].amountCents !== invoice.amountCents
        || sourceEvents[0].accountsPayableEffectCents !== invoice.amountCents || sourceEvents[0].cashEffectCents !== 0) {
        throw new TypeError('Der Lieferanten-OP hat keinen mit der Simulationsquelle übereinstimmenden Finanzbeleg.');
      }
    }
    for (const payment of supplierFinanceEvents.filter(event => event.financeType === 'supplier-payment-executed')) {
      const invoice = supplierInvoices.find(row => row.invoiceId === payment.invoiceId);
      const relatedPayments = supplierFinanceEvents.filter(event => event.financeType === 'supplier-payment-executed' && event.invoiceId === payment.invoiceId);
      const identity = `${encodeURIComponent(envelope.runState.runId)}:${encodeURIComponent(payment.invoiceId)}:${payment.paymentDate}`;
      const expectedRef = `D-0174:SUPPLIER-PAYMENT:${identity}`;
      if (!invoice || relatedPayments.length !== 1 || payment.supplierId !== invoice.supplierId || payment.currency !== invoice.currency
        || payment.paymentDate < invoice.invoiceDate || payment.amountCents !== invoice.amountCents
        || payment.accountsPayableEffectCents !== -invoice.amountCents || payment.cashEffectCents !== -invoice.amountCents
        || payment.sourceRef !== expectedRef || payment.bankTransactionRef !== expectedRef
        || payment.paymentId !== expectedRef || payment.eventId !== `D-0174:SUPPLIER-PAYMENT-EVENT:${identity}`) {
        throw new TypeError('Der Lieferantenzahlungsbeleg stimmt nicht mit dem offenen OP und der expliziten D-0174-Zahlungsaktion überein.');
      }
    }
    const asOfDate = envelope.runState.activeDay?.date ?? (envelope.runState.currentDate < financeState.opening.date ? financeState.opening.date : envelope.runState.currentDate);
    reconcileV3Finance(financeState, asOfDate);
  }
  return { runState: structuredClone(envelope.runState), financeState: financeState ? structuredClone(financeState) : null, financeWarning: financeState ? null : 'In dieser Sicherung fehlt der Finanzzustand. Es wurde kein Anfangsbestand ergänzt; ein bestätigtes D-0180-Opening wurde nicht automatisch erzeugt.' };
}
export function issueAcceptedScenarioInvoices(runState, financeState) {
  validateV3RunState(runState);
  if (!financeState) return { financeState: null, invoiceIds: [], pending: runState.customerWorkOrders.length };
  if (financeState.runId !== runState.runId) throw new TypeError('Run und Finanzzustand passen nicht zusammen.');
  let next = financeState;
  const invoiceIds = [];
  for (const order of runState.customerWorkOrders) {
    const existing = next.invoices.find(invoice => invoice.orderId === order.workOrderId && invoice.policyVersion === 'D-0166');
    if (existing) continue;
    const accepted = runState.dayEvents.some(event => event.phase === 'customer_acceptance_decision'
      && event.result?.workOrderId === order.workOrderId
      && event.result?.decision === 'accept'
      && event.result?.status === 'accepted_non_posting');
    if (!accepted) continue;
    const priorCount = next.invoices.length;
    next = recordV3ScenarioInvoiceFromCustomerEvidence(next, { runState, workOrderId: order.workOrderId });
    if (next.invoices.length > priorCount) invoiceIds.push(next.invoices.at(-1).invoiceId);
  }
  return { financeState: next, invoiceIds, pending: runState.customerWorkOrders.length - next.invoices.length };
}
export function processRunDayCustomerReceipts(financeState, operationalDate) {
  if (!financeState) return { financeState: null, receipts: [] };
  const priorIds = new Set(financeState.events.filter(row => row.financeType === 'customer-payment').map(row => row.eventId));
  const next = processV3ScenarioCustomerReceiptsDue(financeState, operationalDate);
  const receipts = next.events.filter(row => row.financeType === 'customer-payment' && !priorIds.has(row.eventId));
  return { financeState: next, receipts };
}
export function buildWeeklyTemplates(weekStart, seed, { runId = `V3|template|${encodeURIComponent(seed)}|${weekStart}|UPSWING`, scenarioId = 'template', activityGapPct = 0, activitySourceType = 'synthetic_fixture', activitySourceRef = 'synthetic-fixture:activity-gap', exposure = 0, macroSnapshotId, macroSnapshotPeriod, effectiveMacroEvents = [], segments = SEGMENTS, foreignDemandFixtureId = 'NEUTRAL', priorWeeks = [] } = {}) {
  if (!isoDate(weekStart) || mondayOf(weekStart) !== weekStart) throw new TypeError('Wochenvorlagen benötigen einen Montag.');
  const demandTrace = calculateV3MacroDemand({ activityGapPct, activitySourceType, activitySourceRef, exposure, macroSnapshotId, macroSnapshotPeriod, seed: String(seed), runId, scenarioId, weekStart });
  const base = buildV3BaseMarketTemplates(weekStart, seed, demandTrace);
  return allocateV3ForeignDemandTemplates(base, { runId, scenarioId, seed, period: weekStart.slice(0, 7), segments,
    effectiveMacroEvents, priorWeeks, segmentTemplates: getV3RunSegmentTemplates(segments, weekStart.slice(0, 7)),
    fixtureSelected: foreignDemandFixtureId === V3_FOREIGN_DEMAND_FIXTURE_ID });
}
/**
 * Non-posting, replayable projection of each D-0169 inquiry week into actual run outcomes and declared plan capacity.
 * It is computed from persisted market/product events, so save/restore reproduces it without a second mutable ledger.
 */
export function getV3RunOperatingImpact(runState) {
  validateV3RunState(runState);
  const schedules = runState.modules.market.events.filter(event => event.type === 'schedule_week');
  const weeksSeen = new Set();
  const product = runState.modules.product;
  const plannedRows = product
    ? [...product.commitments, ...product.assignments, ...product.customerAssignments].filter(row => row.status !== 'cancelled')
    : [];
  return schedules.map(schedule => {
    const weekStart = schedule.payload.weekStart;
    if (weeksSeen.has(weekStart)) throw new TypeError(`duplicate operating-impact week: ${weekStart}`);
    weeksSeen.add(weekStart);
    const weekEnd = shiftDate(weekStart, 6);
    const demand = schedule.result?.macroDemand;
    const templateIds = new Set(schedule.payload.templates.map(template => template.templateId));
    const cohortInquiries = runState.modules.market.inquiries.filter(inquiry => templateIds.has(inquiry.templateId));
    const inquiryIds = new Set(cohortInquiries.map(inquiry => inquiry.inquiryId));
    const wonOrders = runState.customerWorkOrders.filter(order => inquiryIds.has(order.inquiryId));
    const wonInquiryIds = new Set(wonOrders.map(order => order.inquiryId));
    const plannedHours = plannedRows.filter(row => row.date >= weekStart && row.date <= weekEnd && isWorkday(row.date)).reduce((sum, row) => sum + row.hours, 0);
    const availableCapacityHours = product
      ? product.people.reduce((sum, person) => sum + person.hoursPerDay * 5, 0)
      : null;
    const utilization = availableCapacityHours > 0 ? plannedHours / availableCapacityHours : null;
    const awaitingDecision = cohortInquiries.filter(inquiry => inquiry.status === 'open').length;
    const acceptedOrders = wonOrders.filter(order => order.acceptedAt >= weekStart && order.acceptedAt <= weekEnd).length;
    const unresolvedPlanCount = wonOrders.filter(order => !product?.customerWorkOrderPlans.some(plan => plan.workOrderId === order.workOrderId)).length;
    return {
      impactId: `OPERATING|${encodeURIComponent(runState.runId)}|${weekStart}`,
      runId: runState.runId,
      scenarioId: runState.scenarioId,
      seed: runState.seed,
      period: demand?.macroSnapshotPeriod ?? weekStart.slice(0, 7),
      weekStart,
      weekEnd,
      modelVersion: V3_RUN_OPERATING_IMPACT_MODEL_VERSION,
      parameterSetId: V3_RUN_OPERATING_IMPACT_PARAMETER_SET_ID,
      sourceType: demand?.sourceType ?? 'synthetic_scenario_assumption',
      sourceRef: demand?.sourceRef ?? 'D-0169:synthetic-macro-demand',
      activitySourceType: demand?.activitySourceType ?? null,
      activitySourceRef: demand?.activitySourceRef ?? null,
      activityGapPct: demand?.activityGapPct ?? 0,
      demandModelVersion: demand?.modelVersion ?? null,
      macroSnapshotId: demand?.macroSnapshotId ?? null,
      exposure: demand?.exposure ?? 0,
      directFinanceEffect: false,
      accountingClass: 'information_plan',
      decisionRef: 'D-0169',
      before: {
        inquiryCount: demand?.baseWeeklyInquiryCount ?? 5,
        demandFactor: 1,
        personnelCapacityHours: availableCapacityHours,
        plannedHours: 0,
        utilization: availableCapacityHours > 0 ? 0 : null,
      },
      after: {
        inquiryCount: cohortInquiries.length,
        wonOrders: wonOrders.length,
        wonInquiryIds: [...wonInquiryIds].sort(),
        acceptedOrdersThisWeek: acceptedOrders,
        awaitingDecision,
        plannedHours,
        availableCapacityHours,
        capacityBasis: 'declared personnel hoursPerDay × five weekdays; absences and machine bottlenecks are not modeled in L0/L1',
        utilization,
        unresolvedPlanCount,
      },
      demandTrace: structuredClone(demand),
    };
  });
}
export function openNextRunDay(state) {
  const macroPath = validateRunMacroFixture(state); validateV3RunState(state); if (state.activeDay) throw new Error('Der aktuelle Tag ist bereits geöffnet.');
  if (!state.modules.product) throw new Error('Erfasse und bestätige die Anfangsressourcen, bevor du den ersten Simulationstag öffnest.');
  const date = shiftDate(state.currentDate, 1); if (date > state.endDate) throw new RangeError('Der festgelegte Laufzeitraum ist beendet.');
  const input = { date };
  if (state.modules.macro && (!state.modules.macro.periods.length || date.slice(8) === '01')) {
    input.macroMonthInput = buildRunMacroMonthInput({
      period: date.slice(0, 7), path: macroPath,
      priorMonthlySpiIndexes: state.modules.macro.periods.map(snapshot => snapshot.spi.index),
      costPlanFixtureId: state.costPlanFixtureId ?? 'NEUTRAL',
      foreignDemandFixtureId: state.foreignDemandFixtureId ?? 'NEUTRAL',
      importPriceBenchmarkId: state.importPriceBenchmarkId ?? 'NEUTRAL',
      fxOfferPlanFixtureId: state.fxOfferPlanFixtureId ?? 'NEUTRAL',
    });
  }
  if (new Date(`${date}T12:00:00Z`).getUTCDay() === 1) {
    const latestMacro = state.modules.macro?.periods.at(-1);
    const macroInput = input.macroMonthInput;
    const activityGapPct = macroInput
      ? 100 * (macroInput.activity.activityIndex / macroInput.activity.trendIndex - 1)
      : latestMacro?.activity.activityGapPct ?? 0;
    const activitySource = macroInput?.activity ?? latestMacro?.activity ?? { sourceType: 'synthetic_scenario_assumption', sourceRef: 'D-0169:neutral-missing-activity-fallback' };
    input.marketWeekTemplates = buildWeeklyTemplates(date, state.seed, {
      runId: state.runId, scenarioId: state.scenarioId, activityGapPct,
      activitySourceType: activitySource.sourceType, activitySourceRef: activitySource.sourceRef,
      exposure: 1, macroSnapshotId: state.modules.macro?.sourceSnapshotId ?? null, macroSnapshotPeriod: date.slice(0, 7),
      effectiveMacroEvents: state.modules.macro?.events ?? [], segments: state.modules.market.segments,
      foreignDemandFixtureId: state.foreignDemandFixtureId ?? 'NEUTRAL',
      priorWeeks: state.modules.market.events
        .filter(event => event.type === 'schedule_week' && event.payload?.weekStart < date && event.payload?.weekStart?.slice(0, 7) === date.slice(0, 7))
        .map(event => ({ weekStart: event.payload.weekStart, templates: event.payload.templates })),
    });
  }
  const result = openV3RunDay(state, input); if (!result.ok) throw new Error(result.error?.message ?? 'Simulationstag konnte nicht geöffnet werden.'); validateV3RunState(result.state); return result;
}
/** Read-only opt-in FX sensitivity for one open, unsubmitted offer preview. */
export function previewRunOfferFxPlan(state, {
  inquiryId, planId, planBasisCents, playerNetPriceCents,
  planBasisCurrency, importCurrency, importExposureFactor,
} = {}) {
  validateRunMacroFixture(state);
  validateV3RunState(state);
  const neutral = reason => ({ status: 'neutral', reason, directFinanceEffect: false, actualStateChanged: false });
  const inquiry = state.modules.market.inquiries.find(row => row.inquiryId === inquiryId);
  const playerId = state.modules.market.firms.find(firm => firm.role === 'player')?.firmId;
  const hasPlayerOffer = inquiry?.offers?.some(offer => offer.firmId === playerId);
  if (!inquiry || inquiry.status !== 'open' || hasPlayerOffer) return { status: 'blocked', reason: 'Anfrage ist nicht offen oder besitzt bereits ein eigenes Angebot.', directFinanceEffect: false, actualStateChanged: false };
  if (planBasisCents == null || planBasisCurrency == null || importCurrency == null || importExposureFactor == null) return neutral('FX-Exposition, Planbasiswährung, Importwährung oder Planbasis wurde nicht ausdrücklich angegeben.');
  if (!Number.isSafeInteger(planBasisCents) || planBasisCents < 0 || !Number.isFinite(importExposureFactor) || importExposureFactor <= 0 || importExposureFactor > 1) return { status: 'blocked', reason: 'FX-Planbasis oder Exposure ist ungültig.', directFinanceEffect: false, actualStateChanged: false };
  if (planBasisCurrency !== 'EUR' || importCurrency !== 'USD' || planId !== 'T0070-IMPORT-PLAN-1') return { status: 'blocked', reason: 'Planbasiswährung, Importwährung oder Importplan ist nicht an das ausgewählte synthetische Fixture gebunden.', directFinanceEffect: false, actualStateChanged: false };
  if ((state.fxOfferPlanFixtureId ?? 'NEUTRAL') !== V3_FX_OFFER_PLAN_FIXTURE_ID) return neutral('Kein FX-Angebotsplan-Fixture ausgewählt.');
  if (!state.activeDay) return neutral('Für die Angebotsvorschau muss ein Simulationstag geöffnet sein.');
  const period = state.activeDay.date.slice(0, 7);
  const generated = buildRunOfferCostEvidence(netPrice, costProfile, period);
  costVersion ||= generated.costVersion; babVersion ||= generated.babVersion;
  directCostsJson ||= generated.directCostsJson; sourcePoolsJson ||= generated.sourcePoolsJson; offerDriversJson ||= generated.offerDriversJson;
  let impacts;
  try { impacts = projectV3MacroTradeImpacts(state, period).effects; }
  catch { return neutral('FX-Quell- oder Replaybindung ist nicht verfügbar.'); }
  const effect = impacts.find(row => row.target === 'openImportProcurementPlanIndex' && row.targetRef === planId
    && row.planStatus === 'open_unaccepted' && row.quoteCurrency === 'EUR' && row.baseCurrency === importCurrency
    && row.importExposureFactor === importExposureFactor && row.directFinanceEffect === false && row.actualStateChanged === false);
  if (!effect) return neutral('Keine wirksame, quellgebundene FX-Sensitivität für diesen offenen Plan.');
  const hypotheticalPlanCents = Math.floor(planBasisCents * effect.after / 100 + 0.5);
  if (!Number.isSafeInteger(hypotheticalPlanCents)) return neutral('FX-Planprojektion ist außerhalb des unterstützten Wertebereichs.');
  return {
    status: 'ready', inquiryId, planId, period, planBasisCents, hypotheticalPlanCents,
    deltaCents: hypotheticalPlanCents - planBasisCents,
    playerNetPriceCents: Number.isSafeInteger(playerNetPriceCents) ? playerNetPriceCents : null,
    planBasisCurrency, importCurrency, quoteCurrency: 'EUR', importExposureFactor,
    fxIndex: effect.after, fxEffect: structuredClone(effect),
    sourceType: effect.sourceType, sourceRef: effect.sourceRef, fxSeriesRef: effect.fxSeriesRef,
    sourceSnapshotId: effect.sourceSnapshotId, observedPeriod: effect.observedPeriod,
    effectivePeriod: effect.effectivePeriod, lagPeriods: effect.lagPeriods,
    assumptionId: effect.assumptionId, passThroughRate: effect.passThroughRate, monthlyCapPct: effect.monthlyCapPct,
    ecbReferenceContext: { role: 'context_only_not_used_as_transaction_quote_or_cost', sourceSeriesId: 'EXR.D.USD.EUR.SP00.A', quoteDirection: 'USD_per_EUR; inverse to the synthetic EUR_per_USD fixture' },
    directFinanceEffect: false, actualStateChanged: false,
  };
}
function buildRunOfferCostEvidence(netPrice, costProfile, period) {
  const cents = euroToCents(netPrice);
  const mixes = {
    balanced: [['material', 32], ['labor', 28], ['logistics', 5], ['other', 8]],
    lean: [['material', 28], ['labor', 25], ['logistics', 4], ['other', 7]],
    quality: [['material', 37], ['labor', 31], ['logistics', 6], ['other', 10]],
  };
  const selected = mixes[costProfile] ?? mixes.balanced;
  const directCosts = selected.map(([category, percent]) => ({
    id: 'AUTO-' + category.toUpperCase(),
    amountEuro: (Math.round(cents * percent / 100) / 100).toFixed(2),
    variable: category !== 'other', category, basePeriod: period,
  }));
  const poolCents = Math.max(1, Math.round(cents * 8 / 100));
  const sourcePools = [{
    poolId: 'AUTO-OVERHEAD', sourceCostCenterId: 'AUTO-SOURCE', costBasisId: 'SYNTHETIC-MONTHLY-POOL',
    period, poolEuro: (poolCents / 100).toFixed(2), allocationMode: 'weights',
    recipients: [{ costCenterId: 'PRODUCTION', keyValue: '0.75' }, { costCenterId: 'ADMIN', keyValue: '0.25' }],
    rateBasis: { basisKind: 'driver', value: '50', unitLabel: 'h', period },
  }];
  const offerDrivers = [
    { poolId: 'AUTO-OVERHEAD', costCenterId: 'PRODUCTION', period, basisKind: 'driver', quantity: '10', unitLabel: 'h' },
    { poolId: 'AUTO-OVERHEAD', costCenterId: 'ADMIN', period, basisKind: 'driver', quantity: '3', unitLabel: 'h' },
  ];
  return {
    costVersion: 'SYNTH-COST-' + period + '-' + costProfile.toUpperCase(),
    babVersion: 'SYNTH-BAB-' + period + '-1',
    directCostsJson: JSON.stringify(directCosts), sourcePoolsJson: JSON.stringify(sourcePools),
    offerDriversJson: JSON.stringify(offerDrivers),
  };
}
export function submitRunOffer(state, inquiry, { netPrice, costVersion, babVersion, directCostsJson, sourcePoolsJson, offerDriversJson, sensitivityMode = 'unadjusted', costProfile = 'balanced', commercialTerms = null, counterNegotiationId = null }) {
  if (!state.activeDay) throw new Error('Für die Angebotsabgabe muss ein Simulationstag geöffnet sein.');
  const isRevision=Boolean(inquiry.ownOffer); const eventId=counterNegotiationId ? 'UI-COUNTER-RESPONSE|'+encodeURIComponent(counterNegotiationId) : createRunOfferEventId(inquiry);
  const period = state.activeDay.date.slice(0, 7);
  const generated = buildRunOfferCostEvidence(netPrice, costProfile, period);
  costVersion ||= generated.costVersion; babVersion ||= generated.babVersion;
  directCostsJson ||= generated.directCostsJson; sourcePoolsJson ||= generated.sourcePoolsJson; offerDriversJson ||= generated.offerDriversJson;
  if (typeof costVersion !== 'string' || !costVersion.trim() || typeof babVersion !== 'string' || !babVersion.trim()) throw new TypeError('Kostenstand- und BAB-Stand-Kennung sind erforderlich.');
  const parseJsonArray = (text, label, allowEmpty = false) => { let value; try { value = JSON.parse(text); } catch { throw new TypeError(`${label}: gültiges JSON-Array eingeben.`); } if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) throw new TypeError(`${label}: ${allowEmpty ? 'ein JSON-Array' : 'mindestens einen ausdrücklich eingegebenen Eintrag'} erfassen.`); return value; };
  const directCosts = parseJsonArray(directCostsJson, 'Direkte Kosten', true).map((row, index) => {
    if (!row || typeof row.id !== 'string' || !row.id.trim() || typeof row.variable !== 'boolean') throw new TypeError(`Direkte Kosten ${index + 1}: stabile ID und variable/fixe Klassifikation sind erforderlich.`);
    return { id: row.id.trim(), amountCents: euroToCents(row.amountEuro), variable: row.variable,
      ...(row.category !== undefined ? { category: row.category } : {}),
      ...(row.basePeriod !== undefined ? { basePeriod: row.basePeriod } : {}) };
  });
  const sourcePools = parseJsonArray(sourcePoolsJson, 'BAB-Quellkostenpools').map((pool, poolIndex) => {
    if (!pool || typeof pool !== 'object') throw new TypeError(`BAB-Quellkostenpool ${poolIndex + 1} ist ungültig.`);
    const { poolEuro, ...rest } = pool;
    if (rest.period !== period) throw new TypeError(`BAB-Quellkostenpool ${poolIndex + 1}: Periode muss ${period} entsprechen.`);
    if (rest.allocationMode === 'weights' && rest.rateBasis && rest.rateBasis.period !== period) throw new TypeError(`BAB-Treiberbasis ${poolIndex + 1}: Periode muss ${period} entsprechen.`);
    return { ...rest, poolCents: euroToCents(poolEuro) };
  });
  const offerDrivers = parseJsonArray(offerDriversJson, 'Auftrags-Treiber').map((driver, index) => {
    if (!driver || driver.period !== period) throw new TypeError(`Auftrags-Treiber ${index + 1}: Periode muss ${period} entsprechen.`);
    if (driver.basisKind === 'money') { const { amountEuro, ...rest } = driver; return { ...rest, amountCents: euroToCents(amountEuro) }; }
    return driver;
  });
  const planIndexes = sensitivityMode === 'apply_l4_plan_indices'
    ? projectV3BusinessCostPlanIndexes(state, period)
    : null;
  const sensitivity = calculateV3OfferPlanSensitivity({
    directCosts, mode: sensitivityMode, offerPeriod: period,
    effects: planIndexes?.effects ?? [],
  });
  if (sensitivity.status !== 'ready') throw new Error(`Angebotskalkulation ausstehend: ${sensitivity.reasons.join(' ')}`);
  const baseCostLines = directCosts.map(({ id, amountCents, variable, category = null, basePeriod = null }) => ({ id, amountCents, variable, category, basePeriod }));
  const calculation = calculateV3OfferWithBab({ period, offerDate: state.activeDay.date, netPriceCents: euroToCents(netPrice), directCosts: sensitivity.directCosts, sourcePools, offerDrivers });
  const calculationWithSensitivity = {
    ...calculation,
    planSensitivity: {
      modelVersion: sensitivity.modelVersion, mode: sensitivity.mode, offerPeriod: sensitivity.offerPeriod,
      basePeriod: sensitivity.evidence.basePeriod, baseDirectCosts: baseCostLines,
      usedDirectCosts: sensitivity.directCosts.map(({ id, amountCents, variable, category = null, basePeriod = null, baseAmountCents = null, appliedIndexTarget = null, appliedIndex = null }) => ({ id, amountCents, variable, category, basePeriod, baseAmountCents, appliedIndexTarget, appliedIndex })),
      indexes: sensitivity.evidence.indexes, aggregationRuleId: sensitivity.evidence.aggregationRuleId ?? null,
      rounding: sensitivity.evidence.rounding ?? 'existing euroToCents parser; no plan-index conversion',
      directFinanceEffect: false, actualStateChanged: false,
    },
  };
  const offerId = createV3MarketOfferId(state.modules.market, eventId);
  const calculationSnapshot = createV3OfferSnapshot({ offerId, submittedAt: state.activeDay.date, netPriceCents: calculationWithSensitivity.netPriceCents, costVersion, babVersion, calculation: calculationWithSensitivity });
  const result = counterNegotiationId ? submitV3RunCounterResponse(state,{eventId,negotiationId:counterNegotiationId,calculationSnapshot,commercialTerms:commercialTerms??null}) : submitV3RunOffer(state, { eventId, inquiryId: inquiry.inquiryId, firmId: 'player', submittedAt: state.activeDay.date, calculationSnapshot, ...(commercialTerms ? { commercialTerms } : {}) });
  validateV3RunState(result.state); return { ...result, calculation: calculationWithSensitivity, isRevision };
}
export function installRunOperatingResources(state, { people, equipment, materials, commitments = [], peopleJson, equipmentJson, materialsJson, commitmentsJson, finishedGoodsCapacity, finishedGoodsUsed }) {
  validateV3RunState(state);
  if (state.activeDay || state.dayEvents.length > 0) throw new Error('Anfangsressourcen müssen vor dem ersten Tagesereignis festgelegt werden.');
  if (state.modules.product) throw new Error('Ressourcen sind für diesen Lauf bereits erfasst.');
  const parse = (value, fallback, label) => { const input = value ?? fallback; if (Array.isArray(input)) return input; let parsed; try { parsed = JSON.parse(input); } catch { throw new TypeError(label + ': Auswahlwerte konnten nicht gelesen werden.'); } if (!Array.isArray(parsed)) throw new TypeError(label + ': ungültige Ressourcen.'); return parsed; };
  let productDate = state.currentDate < state.startDate ? state.startDate : state.currentDate;
  while ([0, 6].includes(new Date(productDate + "T12:00:00Z").getUTCDay())) productDate = shiftDate(productDate, -1);
  if (productDate < state.startDate) productDate = state.startDate;
  const product = createV3ProductState({ runId: state.runId, currentDate: productDate, people: parse(people, peopleJson, 'Personal'), equipment: parse(equipment, equipmentJson, 'Maschinen'), materials: parse(materials, materialsJson, 'Material'), commitments: parse(commitments, commitmentsJson, 'Bestehende Belegungen'), finishedGoodsCapacity: Number(finishedGoodsCapacity), finishedGoodsUsed: Number(finishedGoodsUsed) });
  const next = structuredClone(state); next.modules.product = structuredClone(product);
  const playerFirm = next.modules.market.firms.find(firm => firm.role === 'player');
  if (!playerFirm) throw new TypeError('Für die Ressourcenfreigabe fehlt das Spielerunternehmen im Marktmodell.');
  playerFirm.capabilities = getV3OperationalMarketCapabilities(product.people, product.equipment);
  validateV3RunState(next); return next;
}
export function planRunOrder(state, workOrder, { contractFields, operationsJson }) {
  const operations = JSON.parse(operationsJson); if (!Array.isArray(operations)) throw new TypeError('Arbeitsschritte müssen als JSON-Array eingegeben werden.');
  const terms = workOrder.contractTermsSnapshot ?? null;
  const contractSnapshot = { contractRef: contractFields.contractRef, inquiryId: workOrder.inquiryId, offerId: workOrder.offerId, decisionId: workOrder.decisionId, contractType: contractFields.contractType, customerPartyId: contractFields.customerPartyId, buyerPartyId: contractFields.buyerPartyId, acceptancePartyId: contractFields.acceptancePartyId, authorizedForRef: String(contractFields.authorizedForRef ?? '').trim() || null, partyAuthorityRef: String(contractFields.partyAuthorityRef ?? '').trim() || null, performanceCriterionRef: contractFields.performanceCriterionRef, acceptanceCriterionRef: contractFields.acceptanceCriterionRef, orderUnit: terms?.unit ?? contractFields.orderUnit, orderQuantity: terms?.quantity ?? Number(contractFields.orderQuantity), storageUnitsPerOrderUnit: Number(contractFields.storageUnitsPerOrderUnit), ...(terms ? { commercialTermsSnapshot: structuredClone(terms) } : {}) };
  const result = planV3RunWorkOrder(state, { workOrderId: workOrder.workOrderId, contractSnapshot, operations }); validateV3RunState(result.state); return result;
}
export function planRunOrderAutomatically(state, workOrder) {
  const generated = buildV3ManagementOrderPlan(state, workOrder);
  const contractSnapshot = createV3ManagementContractSnapshot(workOrder);
  const result = planV3RunWorkOrder(state, { workOrderId: workOrder.workOrderId, contractSnapshot, operations: generated.operations });
  validateV3RunState(result.state);
  return { ...result, generatedPlan: generated };
}
export function completeRunOrderStep(state, workOrderId, operationId) { const result = completeV3RunWorkOrderOperation(state, { workOrderId, operationId }); validateV3RunState(result.state); return result; }
export function submitRunDelivery(state, workOrderId, { deliveryId, sourceRef }) {
  validateV3RunState(state);
  if (!state.activeDay) throw new Error('Für eine Lieferung muss ein Simulationstag geöffnet sein.');
  if (typeof deliveryId !== 'string' || !deliveryId.trim() || typeof sourceRef !== 'string' || !sourceRef.trim()) throw new TypeError('Liefer-ID und Quellreferenz müssen ausdrücklich angegeben werden.');
  const order = state.customerWorkOrders.find(row => row.workOrderId === workOrderId);
  const plan = state.modules.product?.customerWorkOrderPlans.find(row => row.workOrderId === workOrderId);
  const contract = plan?.contractSnapshot;
  if (!order || !plan || plan.status !== 'ready_for_delivery' || order.status !== 'ready_for_delivery') throw new Error('Lieferung erst möglich, wenn alle geplanten Arbeitsschritte abgeschlossen sind.');
  const requiredContract = [contract?.contractRef, contract?.inquiryId, contract?.offerId, contract?.decisionId, contract?.customerPartyId, contract?.buyerPartyId, contract?.acceptancePartyId, contract?.performanceCriterionRef, contract?.acceptanceCriterionRef, contract?.orderUnit];
  if (requiredContract.some(value => typeof value !== 'string' || !value.trim()) || !Number.isFinite(contract?.orderQuantity) || contract.orderQuantity <= 0) throw new Error('Lieferung nicht möglich: erforderliche Vertrags-, Parteien-, Kriterien-, Mengen- oder Einheitendaten sind nicht verfügbar.');
  const result = deliverV3RunCustomerWorkOrder(state, {
    deliveryId: deliveryId.trim(), sourceRef: sourceRef.trim(), workOrderId,
    deliveryDate: state.activeDay.date, recipientPartyId: contract.acceptancePartyId,
    deliveryCriterionRef: contract.performanceCriterionRef, acceptanceCriterionRef: contract.acceptanceCriterionRef,
    quantity: contract.orderQuantity, unit: contract.orderUnit,
  });
  validateV3RunState(result.state);
  return result;
}
export function closeRunDay(state) { if (!state.activeDay) throw new Error('Es ist kein Simulationstag geöffnet.'); const result = closeV3RunDay(state, { date: state.activeDay.date }); validateV3RunState(result.state); return result; }
const learningDate = state => state.activeDay?.date ?? (state.currentDate < state.startDate ? state.startDate : state.currentDate);
const learningNumber = value => Number.isFinite(value) ? new Intl.NumberFormat('de-DE', { maximumFractionDigits: 3 }).format(value) : '—';
function learningEffectLabel(trace) {
  const effect = trace.effect;
  if (effect.target === 'market.player.reputation') return 'Ruf';
  const person = effect.target.match(/^product\.people\.([^.]+)\.(?:competencies\.([^.]+)|(motivation|morale))$/);
  if (person) return person[2] ? `Kompetenz ${person[2]} bei ${person[1]}` : `${person[3] === 'morale' ? 'Moral' : 'Motivation'} bei ${person[1]}`;
  return 'Kein Unternehmenseffekt';
}
function learningEffectText(trace) {
  const effect = trace.effect;
  if (trace.effectStatus === 'no_effect' || effect.target === 'none') return `Keine Änderung: ${trace.effectReason}`;
  const delta = effect.delta > 0 ? `+${learningNumber(effect.delta)}` : learningNumber(effect.delta);
  return `${learningEffectLabel(trace)}: ${learningNumber(effect.before)} → ${learningNumber(effect.after)} (${delta})`;
}
function learningQuestionCard(item) {
  const options = Object.entries(item.options).map(([key, label]) => `<button class="learning-option" type="button" data-learning-event="${escapeHtml(item.id)}" data-learning-option="${escapeHtml(key)}" aria-label="Antwort ${escapeHtml(key)}: ${escapeHtml(label)}"><strong>${escapeHtml(key)}.</strong> ${escapeHtml(label)}</button>`).join('');
  return `<article class="card learning-card"><p class="learning-meta">${escapeHtml(item.competenceText)} · ${escapeHtml(item.difficulty)}</p><h3>${escapeHtml(item.context)}</h3><p class="learning-question">${escapeHtml(item.question)}</p><div class="learning-options">${options}</div></article>`;
}
function learningAnsweredCard(item, trace) {
  const rightLabel = item.options[item.correctOption]; const selectedLabel = item.options[trace.selectedOption];
  return `<article class="card learning-card"><p class="learning-meta">${escapeHtml(item.competenceText)} · ${escapeHtml(item.difficulty)}</p><h3>${escapeHtml(item.context)}</h3><p class="learning-question">${escapeHtml(item.question)}</p><p class="learning-feedback ${trace.correct ? 'is-correct' : 'is-incorrect'}"><strong>${trace.correct ? 'Richtig' : 'Nicht richtig'}.</strong> Deine Antwort: ${escapeHtml(trace.selectedOption)} · ${escapeHtml(selectedLabel)}${trace.correct ? '' : `. Richtige Antwort: ${escapeHtml(item.correctOption)} · ${escapeHtml(rightLabel)}`}</p><p>${escapeHtml(item.explanation)}</p><p class="learning-effect"><strong>Wirkung laut Run-Trace:</strong> ${escapeHtml(learningEffectText(trace))}</p></article>`;
}
export function prepareRunLearningUi(state) {
  if (!state || !state.modules.product || (!state.activeDay && state.dayEvents.length === 0)) return { state, date: null, answeredToday: 0, items: [], html: '<section class="panel learning-panel" aria-labelledby="learning-title"><h2 id="learning-title">Heutige Lernfragen</h2><p class="field-note">Lernfragen erscheinen nach dem Öffnen des ersten Simulationstags.</p></section>', beforeRun: true };
  const date = learningDate(state); const queue = getV3RunLearningEvents(state, { date, limit: 5 }); const next = queue.state;
  const catalogById = new Map(LEARNING_CATALOG.map(item => [item.id, item]));
  const offeredIds = next.learning.runtime.offeredIdsByDate[date] ?? [];
  const traces = next.learning.runtime.trace.filter(trace => trace.date === date);
  const traceById = new Map(traces.map(trace => [trace.eventId, trace]));
  const queued = queue.result.items;
  const answeredCards = offeredIds.filter(id => traceById.has(id)).map(id => { const item = catalogById.get(id); return item ? learningAnsweredCard(item, traceById.get(id)) : ''; }).join('');
  const questionCards = queued.map(item => learningQuestionCard(item)).join('');
  const answeredToday = queue.result.answeredToday;
  const html = `<section class="panel learning-panel" data-learning-date="${escapeHtml(date)}" aria-labelledby="learning-title"><div class="panel-heading"><div><p class="eyebrow">Freiwillig · blockiert den Tag nicht</p><h2 id="learning-title">Heutige Lernfragen</h2></div><span class="tag" id="learning-count">${answeredToday} von 5 beantwortet</span></div><p class="field-note learning-date">Simulationstag ${escapeHtml(date)}. Du kannst den Tag unabhängig von diesen Fragen abschließen.</p><div class="stack learning-stack">${answeredCards}${questionCards || (answeredToday ? '' : '<p class="empty">Für diesen Tag liegen keine weiteren Fragen vor.</p>')}</div></section>`;
  return { state: next, date, answeredToday, items: queued, html, beforeRun: false };
}
export function answerRunLearning(state, eventId, selectedOption, date = learningDate(state)) {
  if (!state?.modules.product || !date) throw new Error('Lernfragen stehen erst nach dem Start des Laufs zur Verfügung.');
  const answered = answerV3RunLearningEvent(state, { date, eventId, selectedOption });
  if (!answered.ok) throw new Error(answered.result?.error?.message ?? answered.result?.message ?? 'Antwort konnte nicht übernommen werden.');
  return answered;
}
export function getRunProjection(state, financeState = null) {
  validateV3RunState(state); const market = state.modules.market; const playerView = getV3MarketPlayerView(market); const report = getV3MonthlyCompetitorReport(market, state.currentDate.slice(0, 7));
  const asOfDate = state.activeDay?.date ?? state.currentDate;
  const financeHandoffs = state.financeHandoffs.map(row => {
    const invoice = financeState?.invoices?.find(item => item.orderId === row.workOrderId && item.policyVersion === 'D-0166' && item.invoiceDate <= asOfDate);
    const paid = invoice && financeState.events?.some(item => item.financeType === 'customer-payment' && item.orderId === row.workOrderId && item.paymentDate <= asOfDate);
    const decision = state.dayEvents.find(item => item.phase === 'customer_acceptance_decision' && item.result?.workOrderId === row.workOrderId)?.result;
    const delivery = state.dayEvents.find(item => item.phase === 'customer_delivery' && item.result?.workOrderId === row.workOrderId)?.result;
    const plan = state.modules.product?.customerWorkOrderPlans?.find(item => item.workOrderId === row.workOrderId);
    let progressReason = row.reason;
    if (paid) progressReason = 'V3-Szenariorechnung und Kundenzahlung sind im Finanzzustand verarbeitet. Ein vollständiges Hauptbuch mit allen Betriebs- und Bestandsbuchungen ist nicht abgebildet.';
    else if (invoice) progressReason = `V3-Szenariorechnung liegt vor; Zahlung ist bis ${invoice.dueDate} noch offen. Ein vollständiges Hauptbuch ist nicht abgebildet.`;
    else if (decision?.decision === 'accept') progressReason = 'Auftraggeber/Empfänger hat angenommen. Die vereinfachte Szenariorechnung wird beim Tagesabschluss erzeugt; ein vollständiges Hauptbuch ist nicht abgebildet.';
    else if (decision?.decision === 'reject') progressReason = 'Auftraggeber/Empfänger hat zurückgewiesen. Für diesen Auftrag wird keine Szenariorechnung erzeugt; ein vollständiges Hauptbuch ist nicht abgebildet.';
    else if (delivery) progressReason = 'Lieferung ist dokumentiert; die Kunden-/Empfängerentscheidung steht noch aus. Es liegt noch keine Szenariorechnung vor.';
    else if (plan?.status === 'ready_for_delivery') progressReason = 'Fertigungsleistung ist im Run abgeschlossen. Lieferung und Kunden-/Empfängerentscheidung stehen noch aus.';
    else if (plan) progressReason = 'Auftrag ist angenommen und die Arbeitsplanung läuft. Fertigungsleistung, Lieferung und Kundenentscheidung sind noch nicht vollständig belegt.';
    return { ...row, progressReason };
  });
  const customerProgress = state.customerWorkOrders.map(order => {
    const evidence = getV3RunCustomerEvidence(state, order.workOrderId);
    const invoice = financeState?.invoices?.find(item => item.orderId === order.workOrderId && item.policyVersion === 'D-0166' && item.invoiceDate <= asOfDate) ?? null;
    const payment = invoice ? financeState?.events?.find(item => item.financeType === 'customer-payment' && item.orderId === order.workOrderId && item.paymentDate <= asOfDate) ?? null : null;
    const status = payment ? 'paid'
      : invoice ? 'invoice_open'
        : evidence.customerDecision?.decision === 'reject' ? 'customer_rejected'
          : evidence.customerDecision?.decision === 'accept' ? 'invoice_pending'
            : evidence.delivery ? 'customer_decision_pending'
              : evidence.evidenceStatus === 'operations_complete_waiting_for_delivery' ? 'delivery_pending'
                : evidence.evidenceStatus === 'operations_in_progress' ? 'operations_in_progress'
                  : 'waiting_for_plan';
    return {
      workOrderId: order.workOrderId,
      status,
      evidenceStatus: evidence.evidenceStatus,
      operationsCompleted: evidence.operations.filter(operation => operation.status === 'completed').length,
      operationsTotal: evidence.operations.length,
      deliveryDate: evidence.delivery?.deliveryDate ?? null,
      customerDecision: evidence.customerDecision ? { decision: evidence.customerDecision.decision, decisionDate: evidence.customerDecision.decisionDate } : null,
      invoice: invoice ? { invoiceId: invoice.invoiceId, invoiceDate: invoice.invoiceDate, dueDate: invoice.dueDate } : null,
      paymentDate: payment?.paymentDate ?? null,
    };
  });
  const planForecasts = new Map();
  for (const order of state.customerWorkOrders.filter(row => row.status === 'awaiting_operational_plan' && row.contractTermsSnapshot)) {
    try {
      const generated = buildV3ManagementOrderPlan(state, order);
      const people = new Map(state.modules.product.people.map(person => [person.id, person]));
      const assignedPeople = [...new Set(generated.operations.map(row => row.personId))].map(id => people.get(id)).filter(Boolean);
      const skillLevels = generated.operations.flatMap(operation => operation.requiredSkills.map(skill => Number(people.get(operation.personId)?.skillLevels?.[skill] ?? (people.get(operation.personId)?.skills?.includes(skill) ? 2 : 0))));
      const targetFloor = QUALITY_TARGET_SKILL_FLOOR[order.contractTermsSnapshot.qualityTarget] ?? QUALITY_TARGET_SKILL_FLOOR.standard;
      const minimumTeamSkill = skillLevels.length ? Math.min(...skillLevels) : 0;
      planForecasts.set(order.workOrderId, {
        status: 'available', workloadHours: generated.workloadHours,
        finishDate: generated.operations.reduce((latest, row) => row.date > latest ? row.date : latest, ''),
        team: assignedPeople.map(person => person.displayName ?? person.id),
        qualityTarget: order.contractTermsSnapshot.qualityTarget, targetFloor, minimumTeamSkill,
        qualityFit: minimumTeamSkill >= targetFloor ? 'skill-benchmark-met' : 'skill-benchmark-risk',
      });
    } catch (error) {
      planForecasts.set(order.workOrderId, { status: 'unavailable', reason: error.message });
    }
  }
  return structuredClone({ currentDate: state.currentDate, playerView, report: report.map(({ period, sizeClass, sampleCount, meanCompetitorNetPriceCents, suppressed }) => ({ period, sizeClass, sampleCount, meanCompetitorNetPriceCents, suppressed })), operatingImpact: getV3RunOperatingImpact(state), macroFinancingReference: state.modules.macro ? projectV3FinancingReference(state.modules.macro) : null, macroPolicyImpact: state.modules.macro ? projectV3MacroPolicyImpacts(state) : null, macroTradeImpact: state.modules.macro ? projectV3MacroTradeImpacts(state) : null, businessCostPlanIndexes: state.modules.macro ? projectV3BusinessCostPlanIndexes(state) : null, workOrders: state.customerWorkOrders.map(row => ({ ...row })), customerProgress, financeHandoffs, plans: state.modules.product?.customerWorkOrderPlans ?? [], planForecasts, deliveries: state.dayEvents.filter(event => event.phase === 'customer_delivery').map(event => event.result), customerDecisions: state.dayEvents.filter(event => event.phase === 'customer_acceptance_decision').map(event => event.result), resources: state.modules.product ? { people: state.modules.product.people, equipment: state.modules.product.equipment, materials: state.modules.product.materials } : null, dayEvents: [...state.dayEvents].reverse().slice(0, 40).map(event => ({ eventId: event.eventId, date: event.date, occurredAt: event.occurredAt, phase: event.result?.decisionId?.startsWith('SIM|D-0157|F3|') ? 'Kundenentscheidung · F3-Szenarioregel D-0157' : event.phase })) });
}
export function createRunOfferEventId(inquiry) {
  const revisionNumber = Number(inquiry?.ownOfferRevision ?? 0) + 1;
  if (!inquiry?.inquiryId || !Number.isSafeInteger(revisionNumber) || revisionNumber < 1) throw new TypeError('Eine gültige Anfrage und Angebotsfassung sind erforderlich.');
  return `UI-OFFER|${encodeURIComponent(inquiry.inquiryId)}${revisionNumber > 1 ? `|revision|${revisionNumber}` : ''}`;
}
export function renderRunCommercialOfferForm(inquiry) {
  if (inquiry.status !== 'open' || inquiry.ownOffer?.status === 'accepted' || ['countered','response_submitted'].includes(inquiry.negotiation?.status)) return '';
  const previous = inquiry.ownOffer;
  const terms = previous?.commercialTerms ?? {};
  const selected = (value, expected, fallback = false) => value === expected || (value == null && fallback) ? ' selected' : '';
  const title = previous ? `Angebotsfassung ${Number(inquiry.ownOfferRevision ?? 1) + 1} bearbeiten · bisherige Fassung bleibt gespeichert` : 'Neues Angebot';
  const scenarioNotice = `<p class="field-note wide"><strong>V3-Vertragsszenario:</strong> ${escapeHtml(V3_METAL_GOODS_CONTRACT_UI_LABEL)} nach ${escapeHtml(V3_METAL_GOODS_CONTRACT_CLASSIFICATION.legalReference)}, nur B2B-Simulation für die Herstellung und Lieferung beweglicher Metallteile. Keine Rechtsberatung oder Verbraucherfälle.</p><p class="field-note wide"><strong>F3-Szenariobedingung (${escapeHtml(V3_D0157_F3_CONDITION.id)}, keine allgemeine Rechtsfolge):</strong> Nach vollständiger Lieferung entscheidet der Auftraggeber/Empfänger. Liegt bis zum Ende des fünften Arbeitstages ab dem Folgetag keine Entscheidung vor, protokolliert der Simulator eine automatische positive Kundenentscheidung.</p>`;
  const intro = (previous ? `<p class="offer-revision-note wide">Die Kundenentscheidung steht noch aus. Diese Angebotsänderung ersetzt deine bisher offene Fassung; ältere Fassungen bleiben unverändert dokumentiert. Die Kundenprüffrist beginnt mit der neuen Fassung erneut (V3-Szenarioannahme).</p>` : '') + scenarioNotice;
  const price = previous ? (previous.netPriceCents / 100).toFixed(2).replace('.', ',') : '';
  const previousCostProfile = /SYNTH-COST-\d{4}-\d{2}-(BALANCED|LEAN|QUALITY)/i.exec(previous?.calculationSnapshot?.costVersion ?? '')?.[1]?.toLowerCase() ?? 'balanced';
  const minimumDeliveryDate = previous ? (inquiry.currentDate ?? inquiry.receivedAt) : inquiry.receivedAt;
  const proposedDeliveryDate = terms.deliveryDate && terms.deliveryDate >= minimumDeliveryDate ? terms.deliveryDate : (inquiry.expiresAt >= minimumDeliveryDate ? inquiry.expiresAt : minimumDeliveryDate);
  const history = (inquiry.ownOfferHistory ?? []).length > 1 ? `<details class="offer-version-history wide"><summary>${inquiry.ownOfferHistory.length - 1} frühere Angebotsfassung(en)</summary>${inquiry.ownOfferHistory.slice(0, -1).map(version => `<p>Fassung ${version.revision} · ${escapeHtml(version.submittedAt)} · ${escapeHtml(statusName(version.status))} · ${escapeHtml(euro(version.netPriceCents))} netto${version.commercialTerms?.scope ? ` · ${escapeHtml(version.commercialTerms.scope)}` : ''}</p>`).join('')}</details>` : '';
  return `<form class="offer-form" data-inquiry="${escapeHtml(inquiry.inquiryId)}"><h4 class="wide">${escapeHtml(title)}</h4>${intro}${history}<label>Leistungsumfang<input name="scope" minlength="8" maxlength="500" required placeholder="Was wird gefertigt oder geliefert?" value="${escapeHtml(terms.scope ?? '')}"></label><label>Menge<input name="quantity" type="number" min="0.01" max="1000000" step="any" value="${escapeHtml(terms.quantity ?? inquiry.requiredCapacity)}" required></label><label>Einheit<select name="unit" required><option value="pieces"${selected(terms.unit, 'pieces', true)}>Stück</option><option value="sets"${selected(terms.unit, 'sets')}>Sätze</option><option value="lots"${selected(terms.unit, 'lots')}>Lose</option></select></label><label>Qualitätsziel<select name="qualityTarget" required><option value="basic"${selected(terms.qualityTarget, 'basic')}>Einfach und wirtschaftlich</option><option value="standard"${selected(terms.qualityTarget, 'standard', true)}>Solide Marktqualität</option><option value="premium"${selected(terms.qualityTarget, 'premium')}>Hohe Qualitätsanforderung</option></select></label><label>Abnahmekriterium<textarea name="acceptanceCriteria" minlength="8" maxlength="500" required placeholder="Woran erkennt der Kunde die vereinbarte Leistung?">${escapeHtml(terms.acceptanceCriteria ?? '')}</textarea></label><label>Liefertermin<input name="deliveryDate" type="date" min="${escapeHtml(minimumDeliveryDate)}" value="${escapeHtml(proposedDeliveryDate)}" required></label><label>Netto-Angebot in €<input name="netPrice" inputmode="decimal" required placeholder="z. B. 330,00" value="${escapeHtml(price)}"></label><label>Kostenannahme<select name="costProfile"><option value="balanced"${selected(previousCostProfile, 'balanced', true)}>Ausgewogen</option><option value="lean"${selected(previousCostProfile, 'lean')}>Kostenbewusst</option><option value="quality"${selected(previousCostProfile, 'quality')}>Qualitätsorientiert</option></select></label><p class="field-note wide">Leistungsumfang, Menge, Einheit, Qualität, Abnahme und Termin werden mit jeder Angebotsfassung eingefroren. Eine spätere Annahme bindet genau die gewinnende Fassung. Die Vertragsart ist ein Vertragsszenario, keine Rechtsberatung. Kostenstand, BAB-Aufteilung und Auftragstreiber entstehen automatisch aus dem Kostenprofil; sie sind synthetische Lernannahmen und keine Istkosten.</p><button class="primary" type="submit">${previous ? 'Angebotsänderung abgeben' : 'Angebot kalkulieren und abgeben'}</button></form>`;
}
export function renderRunOfferFxPreview(result) {
  const region = result?.status === 'ready'
    ? `<p><strong>Hypothetischer Planwert:</strong> ${euro(result.planBasisCents)} → ${euro(result.hypotheticalPlanCents)} (${result.deltaCents > 0 ? '+' : ''}${euro(result.deltaCents)}). Wirksamkeitsmonat ${escapeHtml(result.effectivePeriod)}; Quellmonat ${escapeHtml(result.observedPeriod)}; Lag ${escapeHtml(result.lagPeriods)} Monat(e).</p><p class="field-note">Annahme ${escapeHtml(result.assumptionId)}: synthetischer Pass-through ${escapeHtml((result.passThroughRate * 100).toLocaleString('de-DE'))} %, Monatskappung ±${escapeHtml(result.monthlyCapPct)} %. Quelle ${escapeHtml(result.sourceRef)}. ${escapeHtml(result.fxSeriesRef)} ist eine synthetische Reihe, keine Transaktionsquote. Die ECB-Referenzreihe EXR.D.USD.EUR.SP00.A notiert USD je EUR und ist invers zur Fixture-Quote EUR je USD; sie dient nur als Kontext und ist kein Eingabewert.</p>`
    : `<p>${result?.status === 'blocked' ? 'Vorschau gesperrt' : 'Keine FX-Wirkung'}: ${escapeHtml(result?.reason ?? 'Keine Vorschau berechnet.')}</p>`;
  const status = result?.status === 'ready' ? 'Berechnete synthetische Planvorschau · nicht gebucht' : result?.status === 'blocked' ? 'Gesperrt · keine Wirkung' : 'Neutral · keine Wirkung';
  return `<section class="fx-preview-result" data-preview-status="${escapeHtml(result?.status ?? 'neutral')}" aria-live="polite"><p class="eyebrow">${status}</p>${region}<p class="field-note"><strong>Abgrenzung:</strong> Dieser Planwert ändert weder dein Netto-Angebot R noch direkte Kosten, Angebots-/Vertragssnapshot, Einkauf, Lager, Cash, Finanzierung, BAB, COGS oder Ledger.</p></section>`;
}
export function renderRunOfferFxForm(inquiry) {
  if (inquiry.status !== 'open' || inquiry.ownOffer) return '';
  return `<details class="fx-offer-plan"><summary>Optionale FX-Planvorschau berechnen</summary><p class="field-note">Reine synthetische Lernannahme für den offenen Importplan. Der EUR-Planbasisbetrag und die USD-Exposition sind ausdrücklich von dir einzugeben. Keine Marktprognose, kein Lieferantenangebot und kein ECB-Transaktionskurs. Die Vorschau ändert weder den Angebotsbetrag noch deine Kalkulation.</p><form class="fx-offer-plan-form" data-inquiry="${escapeHtml(inquiry.inquiryId)}"><label>Hypothetische Planbasis in EUR<input name="planBasisEuros" inputmode="decimal" required placeholder="z. B. 1.000,00"></label><label>Anteil des Plans mit USD-Exposition<input name="importExposureFactor" type="number" min="0.01" max="1" step="0.01" required placeholder="0,01 bis 1,00"></label><p class="field-note">Plan-ID T0070-IMPORT-PLAN-1 · Importwährung USD · Planwährung EUR. Die Fixture kann erst nach dem Quellen-Lag eine Veränderung zeigen.</p><button class="secondary" type="submit">Planvorschau berechnen</button><div class="fx-preview-output" data-preview-for="${escapeHtml(inquiry.inquiryId)}"><p class="field-note">Noch keine Vorschau berechnet.</p></div></form></details>`;
}
function decimalMultiply(left, right) {
  const parts = [String(left), String(right)].map(value => { const match = value.match(/^(\d+)(?:\.(\d+))?$/); if (!match) throw new TypeError('Gespeicherte BAB-Treiberbasis ist nicht darstellbar.'); return { digits: BigInt(`${match[1]}${match[2] ?? ''}`), scale: 10n ** BigInt((match[2] ?? '').length) }; });
  const digits = parts[0].digits * parts[1].digits; const scale = parts[0].scale * parts[1].scale; const whole = digits / scale; const places = scale.toString().length - 1; const fraction = String(digits % scale).padStart(places, '0').replace(/0+$/, ''); return fraction ? `${whole}.${fraction}` : String(whole);
}
function decimalSum(values) {
  const parsed = values.map(value => { const match = String(value).match(/^(\d+)(?:\.(\d+))?$/); if (!match) throw new TypeError('Gespeicherter BAB-Schlüssel ist nicht darstellbar.'); return { digits: BigInt(`${match[1]}${match[2] ?? ''}`), places: (match[2] ?? '').length }; });
  const places = Math.max(0, ...parsed.map(row => row.places)); const scale = 10n ** BigInt(places); const total = parsed.reduce((sum, row) => sum + row.digits * (scale / (10n ** BigInt(row.places))), 0n); const whole = total / scale; const fraction = String(total % scale).padStart(places, '0').replace(/0+$/, ''); return fraction ? `${whole}.${fraction}` : String(whole);
}
export function renderBabDetails(ownOffer) {
  const snapshot = ownOffer?.calculationSnapshot; const calculation = snapshot?.calculation; const pools = calculation?.babSnapshot?.sourcePools;
  if (!Array.isArray(pools) || !pools.length) return '';
  const poolCards = pools.map(pool => {
    const allocationMode = pool.allocationMode; const basis = allocationMode === 'keys' ? decimalSum(pool.allocations.map(row => row.keyValue)) : pool.rateBasis?.value;
    const unit = allocationMode === 'keys' ? pool.unitLabel : pool.rateBasis?.unitLabel;
    const displayRate = pool.offerAllocations?.find(row => row.rate)?.rate?.displayValue;
    const basisLabel = basis !== undefined && unit ? `<p>Ungerundete Satzbasis: ${escapeHtml(basis)} ${escapeHtml(unit)} · Rate: ${escapeHtml(pool.poolCents)} Cent / ${escapeHtml(basis)} ${escapeHtml(unit)}${displayRate ? ` · Anzeige gerundet: ${escapeHtml(displayRate)}` : ''}</p>` : '<p>Kein Satz angezeigt: Satzbasis fehlt.</p>';
    const allocationByCenter = new Map((pool.allocations ?? []).map(row => [row.costCenterId, row]));
    const weightedBases = allocationMode === 'weights' && pool.rateBasis ? new Map((pool.weights ?? []).map(row => [row.costCenterId, decimalMultiply(pool.rateBasis.value, row.weight)])) : new Map();
    const offerByCenter = new Map((pool.offerAllocations ?? []).map(row => [row.costCenterId, row]));
    const receivers = [...allocationByCenter.entries()].map(([costCenterId, allocation]) => {
      const job = offerByCenter.get(costCenterId); const driver = calculation.babSnapshot.offerDrivers?.find(row => row.poolId === pool.poolId && row.costCenterId === costCenterId);
      const receiverBasis = allocationMode === 'weights' ? weightedBases.get(costCenterId) : allocation.keyValue;
      const driverValue = driver?.basisKind === 'driver' ? `${driver.quantity} ${driver.unitLabel}` : (driver?.amountCents !== undefined ? `${euro(driver.amountCents)}` : '—');
      return `<li><strong>${escapeHtml(costCenterId)}</strong> · ${allocationMode === 'weights' ? `Gewicht ${escapeHtml(allocation.keyValue)}; Treiberbasisanteil ${escapeHtml(receiverBasis)} ${escapeHtml(unit ?? '')}` : `Schlüssel ${escapeHtml(allocation.keyValue)} ${escapeHtml(unit ?? '')}`} · Poolanteil ${escapeHtml(euro(allocation.amountCents))} · Auftragstreiber ${escapeHtml(driverValue)} · Angebots-BAB ${escapeHtml(euro(job?.amountCents))}${job?.rate?.displayValue ? ` · Satzanzeige ${escapeHtml(job.rate.displayValue)}` : ''}</li>`;
    }).join('');
    const difference = Number(pool.reconciliationDifferenceCents);
    return `<section class="bab-pool"><h4>${escapeHtml(pool.poolId)} · Quelle ${escapeHtml(pool.sourceCostCenterId)} · Kostenbasis ${escapeHtml(pool.costBasisId)} · ${escapeHtml(pool.period)}</h4><p>Verteilung: ${allocationMode === 'weights' ? 'Gewichte' : 'physische Schlüssel'} · Quellpool ${escapeHtml(euro(pool.poolCents))}</p>${basisLabel}<p>Quellpool-Abstimmung: <strong>${difference === 0 ? '0 Cent · abgestimmt' : `${escapeHtml(euro(difference))} · Abweichung`}</strong></p><ul>${receivers}</ul></section>`;
  }).join('');
  const totalDifference = Number(calculation.babReconciliationDifferenceCents);
  return `<details class="bab-details"><summary>Gespeicherte BAB-Aufschlüsselung · ${escapeHtml(ownOffer.status)}</summary><p>Schreibgeschützte Angebotskalkulation vom ${escapeHtml(ownOffer.submittedAt)} · Kostenstand <strong>${escapeHtml(snapshot.costVersion)}</strong> · BAB-Stand <strong>${escapeHtml(snapshot.babVersion)}</strong>. Centbeträge und Anzeigesätze sind gerundet; gerechnet wurde mit den gespeicherten exakten Quotienten.</p>${poolCards}<p><strong>Gesamtabstimmung aller Quellpools: ${totalDifference === 0 ? '0 Cent · abgestimmt' : `${escapeHtml(euro(totalDifference))} · Abweichung`}</strong></p></details>`;
}
const inquiryPracticeProgressKey = (runId, inquiryId) => 'wfwsim:v3:inquiry-practice:v1:' + encodeURIComponent(runId) + ':' + encodeURIComponent(inquiryId);
const inquiryPracticeMemory = new Map();
function readInquiryPracticeProgress(runId, inquiryId) {
  const key = inquiryPracticeProgressKey(runId, inquiryId);
  try {
    const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    if (saved) { const parsed = JSON.parse(saved); inquiryPracticeMemory.set(key, parsed); return parsed; }
  } catch { /* Keep separate in-memory learning progress if browser storage is unavailable. */ }
  return inquiryPracticeMemory.get(key) ?? null;
}
function saveInquiryPracticeProgress(runId, inquiryId, progress) {
  const key = inquiryPracticeProgressKey(runId, inquiryId);
  inquiryPracticeMemory.set(key, progress);
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(progress)); } catch { /* Learning progress remains outside the company run. */ }
}
export function renderAcceptedRunOfferPrice(inquiry) {
  const offer = inquiry?.ownOffer;
  const netPriceCents = offer?.netPriceCents;
  if (offer?.status !== 'accepted' || !Number.isSafeInteger(netPriceCents) || netPriceCents < 0) return '';
  return `<p class="accepted-contract-price"><strong>Fixierter Vertragspreis:</strong> ${escapeHtml(euro(netPriceCents))} netto</p>`;
}
function renderRunNegotiationPanel(inquiry, active, currentDate) {
  const n=inquiry.negotiation; if(!n) return "";
  const money=cents=>escapeHtml(euro(cents));
  let body="";
  if(n.status==="countered"){
    body="<p class=\"negotiation-state\"><strong>Kunden-Gegenangebot:</strong> "+money(n.counterPriceCents)+" netto. Antwort möglich bis "+escapeHtml(n.responseDueAt)+". Leistungsumfang, Menge und übrige Bedingungen bleiben unverändert; der Höchstpreis des Kunden wird nicht offengelegt.</p>";
    body+="<p class=\"field-note\">Nimmst du exakt diesen Preis an, ist der Vertrag sofort geschlossen. Ein niedrigerer Preis ist ein neues Angebot; der Kunde entscheidet darüber innerhalb von 1–3 Tagen.</p>";
    if(active&&currentDate<=n.responseDueAt) body+="<form class=\"counter-response-form\" data-counter-price-cents=\""+escapeHtml(n.counterPriceCents)+"\"><input type=\"hidden\" name=\"inquiryId\" value=\""+escapeHtml(inquiry.inquiryId)+"\"><input type=\"hidden\" name=\"negotiationId\" value=\""+escapeHtml(n.negotiationId)+"\"><label>Deine Preisantwort netto (€)<input name=\"netPrice\" inputmode=\"decimal\" required value=\""+escapeHtml((n.counterPriceCents/100).toFixed(2).replace(".",","))+"\"></label><label>Kostenprofil<select name=\"costProfile\"><option value=\"balanced\">Ausgewogen</option><option value=\"lean\">Kostenbewusst</option><option value=\"quality\">Qualitätsorientiert</option></select></label><button class=\"primary\" type=\"submit\">Kunden-Gegenangebot annehmen · Vertrag sofort schließen</button></form>";
    else if(!active) body+="<p class=\"field-note\">Öffne einen Simulationstag, um vor Fristende zu antworten.</p>";
    else body+="<p class=\"field-note\">Die Antwortfrist ist abgelaufen; die Entscheidungssimulation wird aktualisiert.</p>";
  } else if(n.status==="response_submitted") body="<p class=\"negotiation-state\">Dein niedrigeres Preisangebot wurde am "+escapeHtml(n.responseSubmittedAt)+" eingereicht. Kundenentscheidung erwartet bis "+escapeHtml(n.decisionAt)+". Noch kein Vertrag und keine Finanzwirkung.</p>";
  else if(n.status==="accepted") {
    const acceptedOwnOffer=inquiry.ownOffer?.offerId===n.responseOfferId;
    const playerAcceptedCounter=acceptedOwnOffer&&inquiry.ownOffer?.netPriceCents===n.counterPriceCents;
    body=playerAcceptedCounter
      ? "<p class=\"negotiation-state negotiation-state-positive\">Du hast das Kunden-Gegenangebot angenommen. Der Vertrag ist sofort geschlossen und der Auftrag angelegt; finanzielle Wirkung entsteht erst durch die getrennten Leistungs-/Rechnungsereignisse.</p>"
      : "<p class=\"negotiation-state negotiation-state-positive\">Der Kunde hat dein niedrigeres Preisangebot angenommen. Vertrag und Auftrag sind geschlossen; finanzielle Wirkung entsteht erst durch die getrennten Leistungs-/Rechnungsereignisse.</p>";
  }
  else if(n.status==="expired") body="<p class=\"negotiation-state\">Gegenangebot des Kunden ist am "+escapeHtml(n.responseDueAt)+" abgelaufen.</p>";
  else if(n.status==="rejected_above_max") body="<p class=\"negotiation-state\">Kunde hat den Preis oberhalb seiner Zahlungsbereitschaft abgelehnt.</p>";
  else if(n.status==="rejected") body="<p class=\"negotiation-state\">Kunde hat die Verhandlung abgelehnt.</p>";
  if(!body) return "";
  const footer=n.status==="accepted"
    ? "Der Vertrag und Auftrag sind geschlossen. Die Verhandlung selbst erzeugt keine Finanzbuchung; die Finanzwirkung folgt den getrennten Leistungs- und Rechnungsereignissen. Einzelgebote der Konkurrenz bleiben verborgen."
    : "Vor Vertragsschluss entsteht aus der Verhandlung weder ein Auftrag noch eine Finanzwirkung. Einzelgebote der Konkurrenz bleiben verborgen.";
  return "<section class=\"negotiation-panel\"><h4>Preisverhandlung</h4>"+body+"<p class=\"field-note\">"+footer+"</p></section>";
}
function inquiryCard(inquiry, active, fxPreviewEnabled = false, runId = '', currentDate = '') {
  const offerStatus = inquiry.ownOffer ? 'Eigenes Angebot: ' + statusName(inquiry.ownOffer.status) + ' · Entscheidung ' + (inquiry.ownOffer.decisionAt ?? 'offen') : 'Noch kein eigenes Angebot';
  const acceptedPriceSummary = renderAcceptedRunOfferPrice(inquiry);
  const terms = inquiry.ownOffer?.commercialTerms;
  const termsSummary = terms ? `<details class="commercial-terms-summary"><summary>Abgegebener Angebotsumfang</summary><dl><dt>Leistung</dt><dd>${escapeHtml(terms.scope)}</dd><dt>Menge</dt><dd>${escapeHtml(terms.quantity)} ${({pieces:'Stück',sets:'Sätze',lots:'Lose'})[terms.unit] ?? escapeHtml(terms.unit)}</dd><dt>Qualitätsziel</dt><dd>${({basic:'Einfach und wirtschaftlich',standard:'Solide Marktqualität',premium:'Hohe Qualitätsanforderung'})[terms.qualityTarget] ?? escapeHtml(terms.qualityTarget)}</dd><dt>Abnahmekriterium</dt><dd>${escapeHtml(terms.acceptanceCriteria)}</dd><dt>Liefertermin</dt><dd>${escapeHtml(terms.deliveryDate)}</dd></dl></details>` : '';
    const practice = runId && currentDate ? renderInquiryPractice(inquiry, currentDate, readInquiryPracticeProgress(runId, inquiry.inquiryId)) : '';
  return '<article class="card" data-inquiry-card="' + escapeHtml(inquiry.inquiryId) + '"><h3>' + escapeHtml(sizeName(inquiry.sizeClass)) + ' · ' + escapeHtml(inquiry.segmentId) + '</h3><p>Kundenreferenz: ' + escapeHtml(inquiry.customerId) + '</p><p>Eingang: ' + escapeHtml(inquiry.receivedAt) + ' · Angebotsfrist: ' + escapeHtml(inquiry.expiresAt) + '</p><p>Fähigkeiten: ' + escapeHtml(Array.isArray(inquiry.requiredCapabilities) ? inquiry.requiredCapabilities.map(marketCapabilityName).join(', ') : 'nicht verfügbar') + ' · Kapazitätsbedarf: ' + escapeHtml(Number.isFinite(inquiry.requiredCapacity) ? inquiry.requiredCapacity : 'nicht verfügbar') + '</p><p>Status: ' + escapeHtml(statusName(inquiry.status)) + ' · ' + escapeHtml(offerStatus) + '</p>' + acceptedPriceSummary + termsSummary + practice + renderBabDetails(inquiry.ownOffer) + renderRunNegotiationPanel(inquiry,active,currentDate) + (active ? renderRunCommercialOfferForm(inquiry) + (fxPreviewEnabled ? renderRunOfferFxForm(inquiry) : '') : '') + '</article>';
}
function reportCard(row) { return `<article class="card"><h3>${escapeHtml(sizeName(row.sizeClass))}</h3><p>Periode: ${escapeHtml(row.period)} · Stichprobe: n=${escapeHtml(row.sampleCount)}</p><p>${row.suppressed ? 'Mittelwert unter n ≥ 3 nicht angezeigt.' : `Durchschnittliches Konkurrenzangebot: ${escapeHtml(euro(row.meanCompetitorNetPriceCents))}`}</p></article>`; }
function contractForm(order, active, forecast) {
  if (!active || order.status !== 'awaiting_operational_plan') return '';
  const terms = order.contractTermsSnapshot ?? null;
  if (!terms?.contractClassification?.contractType || terms.contractClassification.contractType !== V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType || JSON.stringify(terms.acceptanceScenario) !== JSON.stringify(V3_D0157_F3_CONDITION)) return '<p class="legacy-plan-unavailable" role="status">Arbeitsplan gesperrt: Vertragsklassifikation oder F3-Szenariobedingung fehlt im angenommenen Angebot.</p>';
  const generated = terms ? `<p><strong>Angenommene Bedingungen (unveränderlich):</strong> ${escapeHtml(terms.scope)} · ${escapeHtml(terms.quantity)} ${{pieces:'Stück',sets:'Sätze',lots:'Lose'}[terms.unit] ?? escapeHtml(terms.unit)} · Qualitätsziel ${escapeHtml(terms.qualityTarget)} · Warenübergabekriterium: ${escapeHtml(terms.acceptanceCriteria)} · Liefertermin ${escapeHtml(terms.deliveryDate)}.</p><p class="field-note">Vertragsszenario: ${escapeHtml(V3_METAL_GOODS_CONTRACT_UI_LABEL)} · ${escapeHtml(V3_METAL_GOODS_CONTRACT_CLASSIFICATION.legalReference)} · B2B-Simulation. F3: ${escapeHtml(V3_D0157_F3_CONDITION.responseWindowWorkdays)} Arbeitstage ab Folgetag; Entscheidung Auftraggeber/Empfänger, bei ausbleibender Antwort automatische positive Simulatorentscheidung. Der Systemplaner leitet Arbeitsschritte aus Kundenanforderungen und vorhandenen Kompetenzprofilen ab. Modellannahme: ein Kapazitätspunkt entspricht einer modellierten Arbeitsstunde; die erste passende Archetyp-Rezeptur wird je vereinbarter Einheit angesetzt. Technische Details bleiben prüfbar, müssen aber nicht eingegeben werden.</p>` : '';
  const hidden = (name, value) => `<input type="hidden" name="${name}" value="${escapeHtml(value)}">`;
  const generatedFields = hidden('contractRef', `CONTRACT|${order.workOrderId}`) + hidden('contractType', terms?.contractClassification?.contractType ?? '') + hidden('customerPartyId', order.customerPartyId) + hidden('buyerPartyId', order.customerPartyId) + hidden('acceptancePartyId', order.customerPartyId) + hidden('authorizedForRef', '') + hidden('partyAuthorityRef', '') + hidden('performanceCriterionRef', `TERMS|${order.offerId}|performance`) + hidden('acceptanceCriterionRef', `TERMS|${order.offerId}|acceptance`) + hidden('orderQuantity', terms?.quantity ?? '') + hidden('orderUnit', terms?.unit ?? '') + hidden('storageUnitsPerOrderUnit', '1');
  const forecastHtml = forecast?.status === 'available'
    ? `<section class="team-forecast" aria-label="Team- und Qualitätsvorschau"><h4>Teamvorschau · noch nicht eingeplant</h4><p>Voraussichtlicher Aufwand: ${escapeHtml(forecast.workloadHours)} modellierte Stunden · Abschluss voraussichtlich ${escapeHtml(forecast.finishDate)}.</p><p>Vorgesehenes Team: ${escapeHtml(forecast.team.join(', ')) || 'nicht verfügbar'}.</p><p>${forecast.qualityFit === 'skill-benchmark-met' ? 'Die hinterlegte Team-Skillstufe erreicht den vereinfachten Spielrichtwert für dieses Qualitätsziel.' : `Qualitätsrisiko: niedrigste benötigte Skillstufe ${escapeHtml(forecast.minimumTeamSkill)}; Spielrichtwert ${escapeHtml(forecast.targetFloor)}.`} Diese Prognose ist eine synthetische Skillannahme, keine Qualitätsgarantie.</p></section>`
    : forecast?.status === 'unavailable' ? `<p class="team-forecast-risk" role="status">Automatische Teamvorschau derzeit nicht möglich: ${escapeHtml(forecast.reason)}</p>` : '';
  const planAction = terms
    ? `${forecastHtml}<form class="plan-auto-form" data-order="${escapeHtml(order.workOrderId)}">${generatedFields}<button class="primary" type="submit" ${forecast?.status === 'unavailable' ? 'disabled' : ''}>System-Arbeitsplan erstellen</button></form>`
    : '';
  return `<details class="plan-details"><summary>${terms ? 'System-Arbeitsplan für angenommenen Auftrag' : 'Arbeitsplanung nicht verfügbar'}</summary>${generated}${planAction}</details>`;
}
function deliveryForm(row, plan, active, delivery, deliveryDate) {
  if (!plan || plan.status !== 'ready_for_delivery') return '';
  if (delivery) return `<section class="delivery-result" aria-label="Lieferstatus"><h4>Lieferung erfasst</h4><p>Status: ${escapeHtml(delivery.status)} · Datum ${escapeHtml(delivery.deliveryDate)} · Liefer-ID ${escapeHtml(delivery.deliveryId)}.</p><p>Vertrag ${escapeHtml(delivery.contractRef)} · Auftrag ${escapeHtml(delivery.workOrderId)} · Leistungskriterium ${escapeHtml(delivery.deliveryCriterionRef)} · Empfänger ${escapeHtml(delivery.recipientPartyId)} · Menge ${escapeHtml(delivery.quantity)} ${escapeHtml(delivery.unit)}.</p></section>`;
  if (!active) return '<p class="field-note">Leistung vollständig. Lieferung kann an einem geöffneten Simulationstag ausdrücklich erfasst werden.</p>';
  const contract = plan.contractSnapshot;
  const values = [contract?.contractRef, contract?.inquiryId, contract?.offerId, contract?.decisionId, contract?.customerPartyId, contract?.buyerPartyId, contract?.acceptancePartyId, contract?.performanceCriterionRef, contract?.acceptanceCriterionRef, contract?.orderUnit];
  if (values.some(value => typeof value !== 'string' || !value.trim()) || !Number.isFinite(contract?.orderQuantity) || contract.orderQuantity <= 0) return '<p class="delivery-unavailable" role="status">Lieferung gesperrt: Vertrags-, Parteien-, Kriterien-, Mengen- oder Einheitendaten sind nicht verfügbar.</p>';
  return `<section class="delivery-form-wrap" aria-labelledby="delivery-title"><h4 id="delivery-title">Lieferung am geöffneten Simulationstag</h4><dl class="delivery-contract"><dt>Vertrag</dt><dd>${escapeHtml(contract.contractRef)}</dd><dt>Auftrag / Angebot</dt><dd>${escapeHtml(row.workOrderId)} / ${escapeHtml(contract.offerId)}</dd><dt>Kunden- / Käuferpartei</dt><dd>${escapeHtml(contract.customerPartyId)} / ${escapeHtml(contract.buyerPartyId)}</dd><dt>Empfängerpartei</dt><dd>${escapeHtml(contract.acceptancePartyId)}</dd><dt>Leistungskriterium</dt><dd>${escapeHtml(contract.performanceCriterionRef)}</dd><dt>Abnahmekriterium</dt><dd>${escapeHtml(contract.acceptanceCriterionRef)}</dd><dt>Vertragsmenge</dt><dd>${escapeHtml(contract.orderQuantity)} ${escapeHtml(unitName(contract.orderUnit))}</dd><dt>Lieferdatum</dt><dd>${escapeHtml(active ? deliveryDate : '')}</dd></dl><form class="delivery-form" data-order="${escapeHtml(row.workOrderId)}"><label>Liefer-ID<input name="deliveryId" required autocomplete="off"></label><label>Quellreferenz<input name="sourceRef" required autocomplete="off"></label><button class="primary" type="submit">Lieferung erfassen</button></form><p class="field-note">Die Lieferung erfasst nur den Verkäufer-Schritt. Kunden-/Empfängerabnahme, Zurückweisung und Finanzbuchung werden hier nicht ausgelöst.</p></section>`;
}
export function renderWorkOrderCard(row, projection, active) {
  const plan = projection.plans.find(item => item.workOrderId === row.workOrderId);
  const customerProgress = projection.customerProgress?.find(item => item.workOrderId === row.workOrderId);
  const delivery = (projection.deliveries ?? []).find(item => item.workOrderId === row.workOrderId);
  const customerDecision = delivery && (projection.customerDecisions ?? []).find(item => item.deliveryId === delivery.deliveryId);
  const planStatus = plan?.status ?? row.status;
  const customerProgressText = customerProgress ? ({
    waiting_for_plan: 'Noch keine Arbeitsplanung belegt.',
    operations_in_progress: `Fertigung läuft · ${customerProgress.operationsCompleted}/${customerProgress.operationsTotal} Arbeitsschritte belegt.`,
    delivery_pending: 'Fertigung abgeschlossen · Lieferung noch nicht belegt.',
    customer_decision_pending: `Geliefert am ${customerProgress.deliveryDate} · Kunden-/Empfängerentscheidung ausstehend.`,
    customer_rejected: `Kunden-/Empfängerentscheidung: zurückgewiesen am ${customerProgress.customerDecision?.decisionDate}.`,
    invoice_pending: `Kunden-/Empfängerentscheidung angenommen am ${customerProgress.customerDecision?.decisionDate} · Szenariorechnung ausstehend.`,
    invoice_open: `Szenariorechnung vom ${customerProgress.invoice?.invoiceDate} · Zahlung bis ${customerProgress.invoice?.dueDate} offen.`,
    paid: `Szenariorechnung und Zahlung belegt · Zahlungseingang ${customerProgress.paymentDate}.`,
  }[customerProgress.status] ?? 'Kundenprozess nicht verfügbar.') : 'Kundenprozessprojektion nicht verfügbar.';
  const ops = plan?.operations ?? [];
  const contractScenario = row.contractTermsSnapshot?.contractClassification ? `<p class="field-note">Angenommenes V3-Vertragsszenario: ${escapeHtml(V3_METAL_GOODS_CONTRACT_UI_LABEL)} · ${escapeHtml(V3_METAL_GOODS_CONTRACT_CLASSIFICATION.legalReference)} · B2B-Simulation. F3-Bedingung (${escapeHtml(V3_D0157_F3_CONDITION.id)}): ${escapeHtml(V3_D0157_F3_CONDITION.responseWindowWorkdays)} Arbeitstage ab Folgetag; Entscheidung Auftraggeber/Empfänger, bei ausbleibender Antwort automatische positive Simulatorentscheidung. Keine allgemeine Rechtsfolge.</p>` : '<p class="delivery-unavailable" role="status">Vertragsklassifikation fehlt; Planung und Lieferung bleiben gesperrt.</p>';
  const steps = contractScenario + ops.map(op => `<p>Schritt ${escapeHtml(op.operationId)} · ${escapeHtml(op.date)} · ${escapeHtml(op.personId)} · ${escapeHtml(op.hours)} h · ${escapeHtml(op.status)}${active && op.status === 'planned' && op.date <= projection.currentDate ? ` <button class="step-complete" data-order="${escapeHtml(row.workOrderId)}" data-operation="${escapeHtml(op.operationId)}">Schritt abschließen</button>` : ''}</p>`).join('');
  const acceptedTerms = row.contractTermsSnapshot ? `<section class="accepted-commercial-terms"><h4>Angenommener Angebotsumfang</h4><p>${escapeHtml(row.contractTermsSnapshot.scope)} · ${escapeHtml(row.contractTermsSnapshot.quantity)} ${{pieces:'Stück',sets:'Sätze',lots:'Lose'}[row.contractTermsSnapshot.unit] ?? escapeHtml(row.contractTermsSnapshot.unit)} · Qualitätsziel ${escapeHtml(row.contractTermsSnapshot.qualityTarget)}</p><p>Abnahmekriterium: ${escapeHtml(row.contractTermsSnapshot.acceptanceCriteria)} · Liefertermin: ${escapeHtml(row.contractTermsSnapshot.deliveryDate)}</p><p class="field-note">Diese Bedingungen stammen aus dem unveränderlichen angenommenen Angebot.</p></section>` : '';
  const decisionText = customerDecision ? `<p class="customer-decision" role="status">Kunden-/Empfängerentscheidung am ${escapeHtml(customerDecision.decisionDate)}: ${customerDecision.decision === 'accept' ? 'angenommen' : 'zurückgewiesen'} (${escapeHtml(customerDecision.status)}). Dieses Ergebnis stammt aus dem gespeicherten Kundenereignis.</p>` : '';
  return `<article class="card"><h3 title="${escapeHtml(row.workOrderId)}">Auftrag ${escapeHtml(compactReference(row.workOrderId))}</h3><p>Angenommen am ${escapeHtml(row.acceptedAt)} · Arbeitsplanstatus: ${escapeHtml(statusName(planStatus))}</p><p class="customer-process-progress" role="status"><strong>Kundenprozess (Nachweisprojektion):</strong> ${escapeHtml(customerProgressText)}</p><p>Finanzstatus: ${escapeHtml(statusName(row.financeStatus))}. Diese Anzeige projiziert vorhandene Kunden-, Rechnungs- und Zahlungsbelege; sie ändert weder Arbeitsplan noch Finanzhandoff.</p>${acceptedTerms}${steps}${contractForm(row, active, projection.planForecasts?.get(row.workOrderId))}${deliveryForm(row, plan, active, delivery, projection.currentDate)}${decisionText}</article>`;
}
export function renderWorkOrderList(projection, active) {
  return projection.workOrders.length ? projection.workOrders.map(row => renderWorkOrderCard(row, projection, active)).join('') : 'Noch kein Auftrag angenommen. Eine Kundenanfrage ist noch kein Auftrag.';
}
export function getFinanceDisplay(financeState, runState) {
  if (!financeState) return { initialized: false, warning: 'Finanzzustand nicht initialisiert. Der bestätigte Profilstart wird nicht aus einem anderen Jahr oder einer alten Sicherung abgeleitet.' };
  if (!runState || financeState.runId !== runState.runId) throw new TypeError('Run und Finanzzustand passen nicht zusammen.');
  const asOfDate = runState.activeDay?.date ?? (runState.currentDate < financeState.opening.date ? financeState.opening.date : runState.currentDate);
  const view = reconcileV3Finance(financeState, asOfDate);
  const invoices = financeState.invoices.filter(row => row.policyVersion === 'D-0166').map(invoice => {
    const order = financeState.orders.find(row => row.orderId === invoice.orderId);
    return { ...invoice, outstandingCents: order?.receivableOutstandingCents ?? invoice.amountCents };
  });
  const receipts = financeState.events.filter(row => row.financeType === 'customer-payment' && row.paymentDate <= asOfDate).map(row => ({ ...row }));
  const supplierInvoices = (financeState.supplierInvoices ?? []).filter(row => row.invoiceDate <= asOfDate).map(invoice => {
    const payments = financeState.events.filter(row => row.financeType === 'supplier-payment-executed' && row.invoiceId === invoice.invoiceId && row.paymentDate <= asOfDate);
    const paidCents = payments.reduce((sum, row) => sum + row.amountCents, 0);
    return { ...invoice, paidCents, outstandingCents: invoice.amountCents - paidCents, paymentDate: payments.at(-1)?.paymentDate ?? null };
  });
  return { initialized: true, view, invoices, receipts, supplierInvoices, dispoOpeningLimitCents: view.stocks.dispoLimitCents, dispoPrincipalCents: view.stocks.dispoPrincipalCents, dispoAvailableCents: view.stocks.dispoAvailableCents, activeDayOpen: Boolean(runState.activeDay), asOfDate };
}
/** Execute one explicitly requested full D-0174 supplier payment from its saved AP snapshot. */
export function executeSupplierApPayment(financeState, runState, invoiceId, { drawFromDispo = false } = {}) {
  if (!financeState || !runState || financeState.runId !== runState.runId) throw new TypeError('Run und Finanzzustand passen nicht zusammen.');
  if (!runState.activeDay?.date) throw new TypeError('Öffne zuerst den Simulationstag, bevor du eine Lieferantenrechnung bezahlst.');
  const invoice = (financeState.supplierInvoices ?? []).find(row => row.invoiceId === invoiceId);
  if (!invoice) throw new TypeError('Der offene Lieferantenposten wurde nicht gefunden.');
  const paymentDate = runState.activeDay.date;
  if (invoice.invoiceDate > paymentDate) throw new TypeError('Die Lieferantenrechnung ist an diesem Simulationstag noch nicht verfügbar.');
  if (invoice.currency !== 'EUR') throw new TypeError('Lieferantenrechnungen können in diesem V3-Zahlungslauf nur in EUR bezahlt werden.');
  const priorPayments = financeState.events.filter(row => row.financeType === 'supplier-payment-executed' && row.invoiceId === invoice.invoiceId);
  const paidCents = priorPayments.reduce((sum, row) => sum + row.amountCents, 0);
  const outstandingCents = invoice.amountCents - paidCents;
  if (outstandingCents <= 0) throw new TypeError('Dieser Lieferantenposten ist bereits vollständig bezahlt.');
  if (paidCents !== 0 || outstandingCents !== invoice.amountCents) throw new TypeError('Teilzahlungen sind nicht zulässig; der Posten muss vollständig offen sein.');
  const availableBankCents = reconcileV3Finance(financeState, paymentDate).stocks.bankCents;
  const shortfallCents = Math.max(0, invoice.amountCents - availableBankCents);
  if (shortfallCents > 0 && !drawFromDispo) throw new TypeError('Nicht zahlbar: Bankguthaben reicht nicht. Ein manueller, exakt begrenzter Dispoabruf muss ausdrücklich angefordert werden.');
  const identity = `${encodeURIComponent(runState.runId)}:${encodeURIComponent(invoice.invoiceId)}:${paymentDate}`;
  const sourceRef = `D-0174:SUPPLIER-PAYMENT:${identity}`;
  const paymentEventId = `D-0174:SUPPLIER-PAYMENT-EVENT:${identity}`;
  const payment = {
    eventId: paymentEventId,
    eventType: 'supplierPaymentExecuted', runId: runState.runId, sourceRef,
    paymentId: `D-0174:SUPPLIER-PAYMENT:${identity}`,
    invoiceId: invoice.invoiceId, supplierId: invoice.supplierId,
    paymentDate, effectiveDate: paymentDate, amountCents: invoice.amountCents, currency: 'EUR',
    bankAccountRef: 'company-bank', bankTransactionRef: sourceRef,
    execution: { status: 'executed', actorRole: 'player', actorRef: 'player' },
    authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0174', sourceRef: 'A03-D-0174-SUPPLIER-PAYMENT' },
  };
  if (shortfallCents > 0) payment.dispoDrawEvent = {
    eventId: `D-0125:DISPO-DRAW-EVENT:${identity}`,
    eventType: 'dispoPrincipalDrawn', runId: runState.runId,
    sourceRef: `D-0125:DISPO-DRAW:${identity}`,
    effectiveDate: paymentDate, drawDate: paymentDate, invoiceId: invoice.invoiceId,
    paymentEventId, intendedPaymentCents: invoice.amountCents, amountCents: shortfallCents, currency: 'EUR',
    execution: { status: 'executed', actorRole: 'player', actorRef: 'player' },
    authorization: { owner: 'A03', status: 'authorized', decisionRef: 'D-0125', sourceRef: 'A03-D-0125-MANUAL-DRAW' },
  };
  const next = recordV3SupplierPayment(financeState, payment);
  reconcileV3Finance(next, paymentDate);
  return next;
}
export function renderFinanceDisplay(financeState, runState) {
  const display = getFinanceDisplay(financeState, runState);
  if (!display.initialized) return { display, summaryHtml: `<p class="field-note" role="status">${escapeHtml(display.warning)}</p>`, invoiceHtml: '<p class="empty">Noch keine Finanzsicht verfügbar.</p>', supplierApHtml: '<p class="empty">Noch keine Lieferantenposten verfügbar.</p>' };
  const { stocks, flows } = display.view;
  const bankBalanceCents = stocks.bankCents - display.dispoPrincipalCents;
  const dispoUsageText = display.dispoPrincipalCents > 0
    ? `genutzt ${euro(display.dispoPrincipalCents)} · noch verfügbar ${euro(display.dispoAvailableCents)}`
    : 'nicht in Anspruch genommen';
  const summaryHtml = `<div class="finance-summary" aria-label="Finanzübersicht zum ${escapeHtml(display.asOfDate)}"><article class="card"><h3>Bankbestand</h3><p class="bank-balance${bankBalanceCents < 0 ? ' is-negative' : ''}">${euro(bankBalanceCents)}</p><small class="field-note">Disporahmen: ${euro(display.dispoOpeningLimitCents)} · ${dispoUsageText}</small></article><article class="card"><h3>Nettoumsatz</h3><p>${euro(flows.recognizedRevenueCents)}</p></article><article class="card"><h3>Offene Forderungen brutto</h3><p>${euro(stocks.receivablesCents)}</p></article><article class="card"><h3>SimTAX-Verbindlichkeit</h3><p>${euro(stocks.simTaxPayableCents)}</p></article></div><p class="field-note">Stichtag ${escapeHtml(display.asOfDate)} · vereinfachte V3-Kundenrechnungen werden am Fälligkeitstag vollständig bezahlt; Verspätungen und Ausfälle werden nicht simuliert.</p>`;
  const invoiceHtml = display.invoices.length ? display.invoices.map(invoice => `<article class="card"><h3 title="${escapeHtml(invoice.invoiceId)}">${escapeHtml(invoice.invoiceLabel)} · ${escapeHtml(compactReference(invoice.invoiceId))}</h3><p title="${escapeHtml(invoice.orderId)}">Auftrag ${escapeHtml(compactReference(invoice.orderId))} · Rechnungsdatum ${escapeHtml(invoice.invoiceDate)} · fällig ${escapeHtml(invoice.dueDate)}</p><p>Netto ${euro(invoice.netAmountCents)} · SimTAX ${euro(invoice.simTaxCents)} · Brutto ${euro(invoice.amountCents)} · offen ${euro(invoice.outstandingCents)}</p><p>Diese Anzeige ist eine vereinfachte Spielrechnung und kein vollständiger externer Rechnungsbeleg.</p></article>`).join('') : '<p class="empty">Noch keine Szenario-Rechnung. Erst nach abgeschlossener Leistung und positiver Kunden-/Empfängerentscheidung wird sie erstellt.</p>';
  const receiptHtml = display.receipts.length ? display.receipts.map(receipt => `<article class="card"><h3>Zahlungseingang · ${escapeHtml(receipt.paymentDate)}</h3><p title="${escapeHtml(receipt.orderId)}">Auftrag ${escapeHtml(compactReference(receipt.orderId))} · Betrag ${euro(receipt.amountCents)} · Zahlung ${escapeHtml(compactReference(receipt.paymentId))}</p></article>`).join('') : '<p class="empty">Noch keine Zahlungseingänge.</p>';
  const supplierApHtml = display.supplierInvoices.length ? display.supplierInvoices.map(invoice => {
    const payable = display.activeDayOpen && invoice.invoiceDate <= display.asOfDate && invoice.dueDate <= display.asOfDate && invoice.currency === 'EUR' && invoice.outstandingCents === invoice.amountCents && invoice.outstandingCents > 0;
    const shortfallCents = Math.max(0, invoice.outstandingCents - stocks.bankCents);
    const freeDispoCents = Math.max(0, Number(display.dispoAvailableCents ?? 0));
    const canDrawForFullPayment = payable && shortfallCents > 0 && shortfallCents <= freeDispoCents;
    const paymentAction = invoice.outstandingCents <= 0
      ? `<p class="field-note" role="status">Vollständig bezahlt${invoice.paymentDate ? ` am ${escapeHtml(invoice.paymentDate)}` : ''}.</p>`
      : !display.activeDayOpen
        ? '<button class="secondary" type="button" disabled>Simulationstag öffnen, um manuell zu zahlen</button>'
        : invoice.invoiceDate > display.asOfDate
          ? '<button class="secondary" type="button" disabled>Rechnung ist an diesem Simulationstag noch nicht verfügbar</button>'
          : invoice.dueDate > display.asOfDate
            ? '<button class="secondary" type="button" disabled>Rechnung noch nicht fällig</button>'
            : invoice.currency !== 'EUR'
            ? '<button class="secondary" type="button" disabled>Nur EUR-Zahlungen verfügbar</button>'
            : invoice.outstandingCents !== invoice.amountCents
              ? '<button class="secondary" type="button" disabled>Vollzahlung erforderlich</button>'
              : shortfallCents > 0
                ? `<details class="supplier-ap-dispo-confirm"><summary>Bankguthaben reicht nicht für die Vollzahlung</summary><p>Offener Betrag: ${euro(invoice.outstandingCents)} · verfügbares Bankguthaben: ${euro(stocks.bankCents)} · Fehlbetrag: ${euro(shortfallCents)} · freier Disporahmen: ${euro(freeDispoCents)}</p>${canDrawForFullPayment ? `<button class="primary supplier-ap-payment-dispo" type="button" data-invoice="${escapeHtml(invoice.invoiceId)}" data-shortfall="${shortfallCents}" aria-label="Dispo abrufen und Lieferantenrechnung vollständig bezahlen">Dispo ${euro(shortfallCents)} abrufen und vollständig zahlen</button>` : '<p class="field-note" role="status">Vollzahlung nicht möglich: Der freie Disporahmen deckt den Fehlbetrag nicht.</p>'}<button class="secondary supplier-ap-payment-cancel" type="button">Abbrechen</button></details>`
                : `<button class="primary supplier-ap-payment" type="button" data-invoice="${escapeHtml(invoice.invoiceId)}" aria-label="Lieferantenrechnung vollständig bezahlen">Vollzahlung ausführen · ${euro(invoice.outstandingCents)}</button>`;
    return `<article class="card supplier-ap-card"><h4>Lieferantenrechnung · ${escapeHtml(compactReference(invoice.invoiceId))}</h4><p>${escapeHtml(invoice.supplierId)} · Rechnungsdatum ${escapeHtml(invoice.invoiceDate)} · fällig ${escapeHtml(invoice.dueDate)}</p><p>Offener Betrag: ${euro(invoice.outstandingCents)} EUR</p>${paymentAction}</article>`;
  }).join('') : '<p class="empty">Noch kein offener Lieferantenposten.</p>';
  return { display, summaryHtml, invoiceHtml, receiptHtml, supplierApHtml };
}
export function renderManagementStrategy(runState, financeState, directionId = 'liquidity') {
  const financeView = financeState ? reconcileV3Finance(financeState, runState.activeDay?.date ?? runState.currentDate) : null;
  const projection = projectV3ManagementStrategy(runState, financeView, directionId);
  const options = V3_MANAGEMENT_DIRECTIONS.map(row => `<option value="${row.id}"${row.id === directionId ? ' selected' : ''}>${escapeHtml(row.label)}</option>`).join('');
  const statusLabel = status => status === 'met' ? 'Basisziel erfüllt' : status === 'not_met' ? 'Basisziel offen' : 'Noch nicht prüfbar';
  const metricCards = rows => rows.map(row => `<article class="card"><h3>${escapeHtml(row.label)}</h3><p>${row.value == null ? 'Ausstehend' : row.unit === 'cents' ? euro(row.value) : escapeHtml(row.value)}</p><p>Ziel: ${escapeHtml(row.targetLabel)} · ${row.met == null ? 'Noch nicht prüfbar' : row.met ? 'Erfüllt' : 'Offen'}</p><small class="field-note">Quelle: ${escapeHtml(row.source)}</small></article>`).join('');
  const metrics = metricCards(projection.metrics) + `<p><strong>Zielerreichung: ${statusLabel(projection.targetStatus)}</strong> · Synthetische Basisziele, kein Gewinn- oder Solvenznachweis.</p><details><summary>Monatsrückblick für diese Ausrichtung</summary>${projection.history.length ? projection.history.map(month => `<section><h3>${escapeHtml(month.period)} · ${statusLabel(month.targetStatus)}</h3><div class="management-kpis">${metricCards(month.metrics)}</div></section>`).join('') : '<p>Noch kein vergangener Monat im Finanzzustand vorhanden.</p>'}</details>`;
  return `<div class="panel-heading"><div><p class="eyebrow">Unternehmensführung</p><h2>Deine Ausrichtung</h2></div><span class="tag">Monat ${escapeHtml(projection.period)}</span></div><label>Ausrichtung wählen<select id="management-direction">${options}</select></label><p class="field-note">Synthetische Zielvorgabe: ${escapeHtml(projection.direction.target)}</p><div class="management-kpis">${metrics}</div><p><strong>Zielkonflikt:</strong> ${escapeHtml(projection.direction.conflict)}</p><p class="field-note">Die Kennzahlen zeigen vorhandene Spielbelege, keine Kosten- oder Gewinnschätzung. Die Auswahl dient deiner Planung und löst keine Buchung aus. Sie gilt nur für diese Browser-Sitzung und ist nicht Bestandteil von Run sichern/laden.</p>`;
}
function financeCard(row) { return `<article class="card"><h3 title="${escapeHtml(row.handoffId)}">Finanzübergabe · ${escapeHtml(compactReference(row.workOrderId))}</h3><p>${escapeHtml(statusName(row.status))} · kein vollständiger Hauptbuchabschluss</p><p>${escapeHtml(row.progressReason ?? row.reason)}</p></article>`; }
export function renderFinanceHandoffs(projection) {
  return projection.financeHandoffs.length ? projection.financeHandoffs.map(financeCard).join('') : 'Keine offenen Finanzübergaben.';
}
const MACRO_IMPACT_LABELS = Object.freeze({
  openImportProcurementPlanIndex: 'FX · offener Importbeschaffungs-Planindex',
  projectedD0169SegmentDistribution: 'Außenwirtschaft · erwartete Anfrageverteilung',
  actualD0169SegmentDistribution: 'Außenwirtschaft · tatsächliche Anfrageverteilung nach Segment',
  openPurchaseOrderEta: 'Internationale Versorgung · erwarteter Liefertermin',
  publicTenderOpportunityIndex: 'Finanzpolitik · öffentliche Ausschreibungen',
  longRunPotentialCapacityIndex: 'Wachstumspolitik · Potenzialindikator',
  futureWagePlanIndex: 'Tarifpolitik · künftiger Lohnplanindex',
  candidateAvailabilityIndex: 'Arbeitsmarktpolitik · Verfügbarkeitsindikator',
  processResourceIntensityIndex: 'Umweltpolitik · Ressourcenindikator',
  segmentInquiryShareShift: 'Nachfragepolitik · erwarteter Segmentanteil',
  unitResourceRequirementIndex: 'Angebotspolitik · Ressourcenbedarf',
  businessInputCostPlanIndex: 'Business Cost Index (Plan)',
  wagePlanIndex: 'WagePlanIndex',
  procurementPlanIndex: 'ProcurementPlanIndex',
});
const planNumber = value => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
const countNumber = value => new Intl.NumberFormat('de-DE').format(value);
const MAX_MACRO_IMPACT_DETAILS = 20;
function macroImpactValue(effect) {
  if (effect.target === 'openPurchaseOrderEta') return `Erwarteter Termin: ${effect.before} → ${effect.after} (${effect.delayDays} Kalendertage)`;
  if (effect.target === 'projectedD0169SegmentDistribution') return `Erwartete Segmentverschiebung: ${planNumber(Number(effect.appliedShiftPp ?? 0))} Prozentpunkte; Gesamtanfragen bleiben ${effect.totalInquiriesBefore} → ${effect.totalInquiriesAfter}`;
  if (effect.target === 'actualD0169SegmentDistribution') {
    const labels = { small: 'Klein', medium: 'Mittel', large: 'Groß' };
    const formatCounts = counts => Object.entries(counts ?? {}).filter(([, count]) => count > 0)
      .map(([id, count]) => `${labels[id] ?? id}: ${count}`).join(', ') || 'nicht verfügbar';
    const requestedCapacity = Object.entries(effect.requiredCapacityBySegment ?? {}).filter(([, capacity]) => capacity > 0)
      .map(([id, capacity]) => `${labels[id] ?? id}: ${capacity}`).join(', ') || 'nicht verfügbar';
    return `Fixture-Ziel: Exportanteil um ${planNumber(Number(effect.appliedShiftPp ?? 0))} Prozentpunkte verschieben · Basis → tatsächlicher Segmentmix: ${formatCounts(effect.baseSegmentCounts)} → ${formatCounts(effect.actualSegmentCounts)} · Wochenanfragen ${effect.totalInquiriesBefore} (unverändert) · angeforderte Kapazität je Segment: ${requestedCapacity} Einheiten`;
  }
  if (effect.target === 'openImportProcurementPlanIndex') return `Planindex: ${planNumber(Number(effect.before))} → ${planNumber(Number(effect.after))} (${planNumber(Number(effect.appliedDeltaPct))} %)`;
  if (effect.status === 'pending' || effect.after == null) return 'Wert ausstehend; unvollständiger Beitrag wird nicht als null behandelt.';
  const unit = effect.unit === 'percentage_points' ? ' Prozentpunkte' : effect.unit === '%' ? ' %' : ' Indexpunkte';
  return `Planwert: ${planNumber(Number(effect.before))} → ${planNumber(Number(effect.after))}${unit}`;
}
function renderMacroImpactProjection(projection) {
  const groups = [
    ['L2 · Außenwirtschaft und Versorgung', projection?.macroTradeImpact],
    ['L3/L6 · nichtmonetäre Politikindikatoren', projection?.macroPolicyImpact],
    ['L4 · getrennte Kostenplanindizes', projection?.businessCostPlanIndexes],
  ];
  const channels = [];
  for (const [group, result] of groups) {
    if (!result) continue;
    const effects = Array.isArray(result.effects) ? result.effects : [];
    const pendingRows = Array.isArray(result.pending) ? result.pending : [];
    const pendingEffects = effects.filter(effect => effect.status === 'pending' || effect.after == null).length;
    const pendingCount = pendingRows.length + pendingEffects;
    const projectedCount = effects.length - pendingEffects;
    channels.push({ group, result, effects, pendingRows, pendingCount, projectedCount, detailCards: [] });
  }
  const detailAt = (channel, index) => index < channel.pendingRows.length
    ? { pending: true, value: channel.pendingRows[index] }
    : { pending: false, value: channel.effects[index - channel.pendingRows.length] };
  const channelTotal = channel => channel.pendingRows.length + channel.effects.length;
  const cursors = channels.map(() => 0);
  let remainingDetails = MAX_MACRO_IMPACT_DETAILS;
  // Reserve one visible detail for each nonempty channel before allocating the rest.
  for (let index = 0; index < channels.length && remainingDetails > 0; index += 1) {
    if (!channelTotal(channels[index])) continue;
    channels[index].detailCards.push(detailAt(channels[index], cursors[index]++));
    remainingDetails -= 1;
  }
  while (remainingDetails > 0) {
    let added = false;
    for (let index = 0; index < channels.length && remainingDetails > 0; index += 1) {
      if (cursors[index] >= channelTotal(channels[index])) continue;
      channels[index].detailCards.push(detailAt(channels[index], cursors[index]++));
      remainingDetails -= 1;
      added = true;
    }
    if (!added) break;
  }
  const renderDetail = (channel, detail) => {
    if (detail.pending) return `<article class="card macro-impact-card"><div class="macro-impact-heading"><h5>${escapeHtml(channel.group)}</h5><span class="tag pending">pending</span></div><p>${escapeHtml(detail.value)}</p><p class="field-note">Planprojektion · Herkunft im unvollständigen Ergebnis nicht verfügbar · nicht gebucht.</p></article>`;
    const effect = detail.value;
    const pending = effect.status === 'pending' || effect.after == null;
    const scope = effect.scopeRef ?? effect.segmentScopeRef ?? effect.targetRef ?? effect.planId ?? effect.orderRef ?? 'kein engerer Scope ausgewiesen';
    const period = effect.effectivePeriod ?? channel.result.period ?? 'noch nicht verfügbar';
    const sourceType = effect.sourceType ?? 'Quelle nicht ausgewiesen';
    const source = effect.sourceRef ?? effect.sourceSnapshotId ?? 'Quelle nicht ausgewiesen';
    const fixture = effect.assumptionId ?? effect.parameterSetId ?? effect.modelVersion ?? channel.result.modelVersion ?? 'nicht ausgewiesen';
    const provenanceLabel = sourceType === 'synthetic_fixture' ? 'Synthetische Planprojektion'
      : sourceType === 'observed' ? 'Beobachtete Planprojektion'
        : `Planprojektion · Quellentyp ${sourceType}`;
    return `<article class="card macro-impact-card"><div class="macro-impact-heading"><h5>${escapeHtml(MACRO_IMPACT_LABELS[effect.target] ?? effect.target ?? channel.group)}</h5><span class="tag${pending ? ' pending' : ''}">${pending ? 'pending' : 'wirksame Planprojektion'}</span></div><p>${escapeHtml(macroImpactValue(effect))}</p><p class="field-note">${escapeHtml(provenanceLabel)} · Monat ${escapeHtml(period)} · Lag ${escapeHtml(effect.lagPeriods ?? 0)} Monat(e) · Scope ${escapeHtml(scope)} · nicht gebucht</p><p class="field-note">Quelle ${escapeHtml(sourceType)}: ${escapeHtml(source)} · Fixture/Modell ${escapeHtml(fixture)}</p></article>`;
  };
  const totalContributions = channels.reduce((sum, channel) => sum + channelTotal(channel), 0);
  const omittedTotal = totalContributions - channels.reduce((sum, channel) => sum + channel.detailCards.length, 0);
  const totalPending = channels.reduce((sum, channel) => sum + channel.pendingCount, 0);
  const totalProjected = channels.reduce((sum, channel) => sum + channel.projectedCount, 0);
  const hasContributions = totalContributions > 0;
  const body = channels.length
    ? `<p class="macro-impact-global-count" role="status">${countNumber(totalContributions)} gesamt / ${countNumber(totalProjected)} wirksam / ${countNumber(totalPending)} pending / ${countNumber(omittedTotal)} nicht angezeigt</p>${channels.map(channel => {
      const omitted = channelTotal(channel) - channel.detailCards.length;
      const summary = `<p class="macro-impact-count">${countNumber(channelTotal(channel))} Einträge gesamt: ${countNumber(channel.projectedCount)} wirksam, ${countNumber(channel.pendingCount)} pending${omitted ? ` · ${countNumber(omitted)} weitere Einträge nicht angezeigt` : ''}</p>`;
      const cards = channel.detailCards.map(detail => renderDetail(channel, detail)).join('');
      return `<section class="macro-impact-channel" aria-label="${escapeHtml(channel.group)}"><h4>${escapeHtml(channel.group)}</h4>${summary}${cards ? `<div class="macro-impact-grid">${cards}</div>` : ''}</section>`;
    }).join('')}${hasContributions ? '' : '<p class="empty">Keine aktive Exposition/keine Projektionswirkung. Im Standardlauf liegen keine passenden Makrotreiber oder Scopes vor.</p>'}`
    : '<p class="empty">Keine aktive Exposition/keine Projektionswirkung. Im Standardlauf liegen keine passenden Makrotreiber oder Scopes vor.</p>';
  return `<section class="macro-impact" aria-labelledby="macro-impact-title"><h3 id="macro-impact-title">Planprojektionen für das Unternehmen</h3><p class="field-note">Alle Einträge sind nichtbuchende Planprojektionen; jede Karte kennzeichnet den Quellentyp (synthetic_fixture, observed oder nicht ausgewiesen). Sie erzeugen keine Geldbuchung. FX ist ein Planindex, ETA ein erwarteter Termin; BICI, WagePlanIndex und ProcurementPlanIndex bleiben getrennte Indizes und sind weder Eurobetrag noch Istkosten, BAB oder gebuchte Unternehmenswirkung. Segmentverschiebungen nach D-0169 ändern nicht die Gesamtzahl der Anfragen.</p>${body}<p class="field-note">MRO bleibt ein unverbindlicher Indikator bzw. eine Quote; diese Projektionen begründen keinen Kredit.</p></section>`;
}
export function renderOperatingImpactProjection(operatingImpact) {
  const rows = Array.isArray(operatingImpact) ? [...operatingImpact].sort((a, b) => String(b.weekStart).localeCompare(String(a.weekStart))) : [];
  const count = value => Number.isSafeInteger(value) && value >= 0 ? countNumber(value) : 'nicht verfügbar';
  const hours = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? `${planNumber(value)} h` : 'nicht verfügbar';
  const capacity = value => typeof value === 'number' && Number.isFinite(value) && value > 0 ? `${planNumber(value)} h` : 'nicht verfügbar';
  const utilization = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? `${planNumber(value * 100)} %` : 'nicht verfügbar';
  const content = rows.length
    ? `<div class="operating-impact-list">${rows.map(row => `<article class="card operating-impact-card"><div class="operating-impact-heading"><h4>Woche ${escapeHtml(row.weekStart)}–${escapeHtml(row.weekEnd)}</h4><span class="tag">${escapeHtml(row.sourceType ?? 'Szenarioprojektion')} · nicht gebucht</span></div><dl class="operating-impact-metrics"><div><dt>Marktanfragen</dt><dd>${count(row.after?.inquiryCount)}</dd></div><div><dt>Gewonnene Aufträge</dt><dd>${count(row.after?.wonOrders)}</dd></div><div><dt>Davon diese Woche angenommen</dt><dd>${count(row.after?.acceptedOrdersThisWeek)}</dd></div><div><dt>Offene Entscheidungen</dt><dd>${count(row.after?.awaitingDecision)}</dd></div><div><dt>Geplante Arbeitszeit</dt><dd>${hours(row.after?.plannedHours)}</dd></div><div><dt>Deklarierte Personalkapazität</dt><dd>${capacity(row.after?.availableCapacityHours)}</dd></div><div><dt>Plan-Auslastung</dt><dd>${utilization(row.after?.utilization)}</dd></div><div><dt>Aufträge ohne Arbeitsplan</dt><dd>${count(row.after?.unresolvedPlanCount)}</dd></div></dl><p class="field-note">Synthetische, nichtbuchende Planprojektion nach D-0169. Kapazität basiert nur auf erklärten Personalstunden × fünf Werktage; Abwesenheiten und Maschinenengpässe sind nicht enthalten. Geplant ist weder Istzeit noch realisierte Produktion.</p><p class="field-note">Modell ${escapeHtml(row.modelVersion ?? 'nicht ausgewiesen')} · Parameter ${escapeHtml(row.parameterSetId ?? 'nicht ausgewiesen')} · Periode ${escapeHtml(row.period ?? 'nicht ausgewiesen')} · Run ${escapeHtml(row.runId ?? 'nicht ausgewiesen')}</p></article>`).join('')}</div>`
    : '<p class="empty">Noch keine abgeschlossene Marktwoche für die Betriebswirkungsprojektion vorhanden.</p>';
  return `<section class="operating-impact" aria-labelledby="operating-impact-title"><h3 id="operating-impact-title">Betriebliche Planwirkung</h3><p class="field-note">Diese Wochenansicht verbindet vorhandene Anfragen, tatsächliche Zuschläge, geplante Arbeitsstunden und deklarierte Personalkapazität. Sie ändert weder Auftrag, Bestand, Kosten noch Finanzwerte.</p>${content}</section>`;
}

/** Own-product workspace reads the shared product module and keeps every output explicitly non-posting. */
export function parseV3ProductJsonInput(rawValue, label) {
  if (typeof rawValue !== 'string' || !rawValue.trim()) throw new TypeError(`${label} darf nicht leer sein.`);
  try { return JSON.parse(rawValue); }
  catch { throw new TypeError(`${label} muss gültiges JSON enthalten.`); }
}
export function buildV3ProductCostLines(rows) {
  if (!Array.isArray(rows)) throw new TypeError('Direkte Kosten müssen als Positionsliste eingegeben werden.');
  const ids = new Set(); const refs = new Set();
  const entered = rows.filter(row => row && (row.id || row.amountEuro || row.sourceRef));
  if (!entered.length) throw new TypeError('Mindestens eine belegte direkte Kostenposition ist erforderlich; leere Kosten bedeuten nicht automatisch null.');
  return entered.map((row, index) => {
    const id = typeof row.id === 'string' ? row.id.trim() : '';
    const sourceRef = typeof row.sourceRef === 'string' ? row.sourceRef.trim() : '';
    if (!id) throw new TypeError(`Kostenposition ${index + 1}: Positions-ID fehlt.`);
    if (!sourceRef) throw new TypeError(`Kostenposition ${index + 1}: Quellreferenz fehlt.`);
    if (ids.has(id)) throw new TypeError(`Kostenposition ${index + 1}: Positions-ID ${id} ist doppelt.`);
    if (refs.has(sourceRef)) throw new TypeError(`Kostenposition ${index + 1}: Quellreferenz ${sourceRef} ist doppelt.`);
    if (row.variable !== 'true' && row.variable !== 'false') throw new TypeError(`Kostenposition ${index + 1}: bitte variable oder fixe Kosten wählen.`);
    const amountCents = euroToCents(row.amountEuro);
    if (amountCents <= 0) throw new TypeError(`Kostenposition ${index + 1}: Betrag muss größer als 0,00 € sein. Ein Produkt ohne direkte Kosten braucht eine separate ausdrückliche Bestätigung, die diese V3-Oberfläche noch nicht anbietet.`);
    ids.add(id); refs.add(sourceRef);
    return { id, amountCents, variable: row.variable === 'true', unit: 'EUR', sourceRef, roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: amountCents };
  });
}
export function readV3ProductCostLines(form) {
  return buildV3ProductCostLines([...form.querySelectorAll('.product-cost-line')].map(row => ({
    id: row.querySelector('[name="costLineId"]')?.value,
    amountEuro: row.querySelector('[name="costLineAmountEuro"]')?.value,
    variable: row.querySelector('[name="costLineVariable"]')?.value,
    sourceRef: row.querySelector('[name="costLineSourceRef"]')?.value,
  })));
}
function renderV3ProductCostLine(index, line = {}) {
  const amountEuro = Number.isSafeInteger(line.amountCents) ? (line.amountCents / 100).toFixed(2).replace('.', ',') : '';
  const variable = typeof line.variable === 'boolean' ? String(line.variable) : 'true';
  const result = Number.isSafeInteger(line.amountCents) ? `${line.amountCents} ct` : '—';
  return `<fieldset class="product-cost-line wide"><legend>Kostenposition ${index + 1}</legend><label>Positions-ID<input name="costLineId" value="${escapeHtml(line.id ?? '')}" required placeholder="z. B. material-1"></label><label>Betrag in EUR<input name="costLineAmountEuro" inputmode="decimal" value="${escapeHtml(amountEuro)}" required placeholder="z. B. 12,50"></label><label>Kostenart<select name="costLineVariable" required><option value="true" ${variable === 'true' ? 'selected' : ''}>Variabel</option><option value="false" ${variable === 'false' ? 'selected' : ''}>Fix / sonstige direkte Kosten</option></select></label><label>Quellreferenz<input name="costLineSourceRef" value="${escapeHtml(line.sourceRef ?? '')}" required placeholder="Beleg-ID oder synthetic:... "></label><p class="field-note wide">Währungseinheit: EUR. Rundung: Eingabe wird auf Cent übertragen; bereits ganzzahlige Cent, keine weitere Rundung. Cent-Übertrag (Vorschau): <output data-rounding-result>${result}</output>.</p><button class="secondary product-cost-line-remove" type="button">Position entfernen</button></fieldset>`;
}
/** Render the own-product workspace from the shared product and market states. */
export function renderOwnProducts(productState, marketState, active = false) {
  if (!productState) return '<section class="panel"><h2>Eigene Produkte</h2><p class="empty">Produktbestand ist noch nicht initialisiert.</p></section>';
  const products = Array.isArray(productState.products) ? productState.products : [];
  const assignments = Array.isArray(productState.assignments) ? productState.assignments : [];
  const sales = Array.isArray(productState.productSales) ? productState.productSales : [];
  const statusText = { idea: 'Idee', development: 'Entwicklung', production_definition: 'Produktionsdefinition', calculated: 'Kalkuliert', in_production: 'In Fertigung', production_complete: 'Fertigung abgeschlossen', finished_goods: 'Fertigware' };
  const escapeJson = value => escapeHtml(JSON.stringify(value ?? [], null, 2));
  const personOptions = (productState.people ?? []).map(row => `<option value="${escapeHtml(row.id)}">${escapeHtml(row.id)} · ${escapeHtml((row.skills ?? []).join(', ') || 'ohne Skill')}</option>`).join('');
  const equipmentOptions = (productState.equipment ?? []).map(row => `<option value="${escapeHtml(row.id)}">${escapeHtml(row.id)} · ${escapeHtml((row.capabilities ?? []).join(', ') || 'ohne Fähigkeit')}</option>`).join('');
  const materialOptions = (productState.materials ?? []).map(row => `<option value="${escapeHtml(row.id)}">${escapeHtml(row.id)} · ${escapeHtml(row.quantity)} verfügbar</option>`).join('');
  const trainingUi = `<section class="panel synthetic-training" aria-labelledby="synthetic-training-title"><h2 id="synthetic-training-title">Weiterbildung · Spielsimulation</h2><p>Diese Kursangebote verändern ausschließlich die im Spiel geführte Kompetenz. Sie sind keine reale Ausbildung, kein Zertifikat, keine AEVO-/Befähigungsprüfung und verleihen keinen Maschinenzugang. Es entstehen keine Kosten oder Arbeitsstunden.</p>${V3_SYNTHETIC_SKILL_COURSES.map(course => {
    const skill = getV3SkillDefinition(course.awards.skillId);
    const completed = (productState.syntheticTrainingCompletions ?? []).filter(row => row.courseId === course.id).map(row => `<li>${escapeHtml((productState.people ?? []).find(person => person.id === row.personId)?.displayName ?? row.personId)} · ${escapeHtml(skill?.label ?? row.skillId)} Stufe ${escapeHtml(row.awardedLevel)} · ${escapeHtml(row.completedAt)} (Spielkompetenz)</li>`).join('');
    const people = productState.people ?? [];
    const trainingState = person => {
      const completed = (productState.syntheticTrainingCompletions ?? []).some(row => row.personId === person.id && row.courseId === course.id);
      // skillLevels is the combined game level; skills is the legacy level-2 fallback.
      const levelFor = skillId => Number(person.skillLevels?.[skillId] ?? (person.skills?.includes(skillId) ? 2 : 0));
      const missing = course.prerequisites.filter(requirement => levelFor(requirement.skillId) < requirement.minimumLevel);
      const alreadySufficient = levelFor(course.awards.skillId) >= course.awards.level;
      return { completed, missing, alreadySufficient };
    };
    const eligiblePeople = people.filter(person => {
      const state = trainingState(person);
      return !state.completed && !state.missing.length && !state.alreadySufficient;
    });
    const prerequisite = course.prerequisites.length ? course.prerequisites.map(requirement => `${getV3SkillDefinition(requirement.skillId)?.label ?? requirement.skillId} Stufe ${requirement.minimumLevel}`).join(', ') : 'keine Vorkenntnisse im Spielmodell (Grundkurs)';
    const unavailableReasons = people.map(person => {
      const state = trainingState(person);
      const name = escapeHtml(person.displayName ?? person.id);
      if (state.completed) return `${name}: Kurs bereits abgeschlossen.`;
      if (state.alreadySufficient) return `${name}: Fähigkeit bereits auf der erforderlichen Stufe.`;
      if (state.missing.length) return `${name}: Voraussetzung fehlt (${state.missing.map(requirement => `${escapeHtml(getV3SkillDefinition(requirement.skillId)?.label ?? requirement.skillId)} Stufe ${requirement.minimumLevel}`).join(', ')}).`;
      return '';
    }).filter(Boolean);
    const unavailableMessage = !people.length
      ? 'Derzeit ist kein Teammitglied im Betrieb.'
      : `<span>Der Kurs ist für derzeit kein Teammitglied verfügbar:</span><ul>${unavailableReasons.map(reason => `<li>${reason}</li>`).join('')}</ul>`;
    const form = active && eligiblePeople.length ? `<form class="form-grid synthetic-skill-course-form"><input type="hidden" name="courseId" value="${escapeHtml(course.id)}"><label>Teammitglied<select name="personId" required>${eligiblePeople.map(person => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.displayName ?? person.id)}</option>`).join('')}</select></label><button class="secondary" type="submit">Spielkompetenz erwerben</button></form>` : `<div class="field-note">${eligiblePeople.length ? 'Kursabschluss ist nur an einem geöffneten Simulationstag möglich.' : unavailableMessage}</div>`;
    return `<article class="card synthetic-course-card"><h3>${escapeHtml(course.label)}</h3><p>Ergebnis: ${escapeHtml(skill?.label ?? course.awards.skillId)} Stufe ${escapeHtml(course.awards.level)} · Voraussetzung: ${escapeHtml(prerequisite)}.</p>${form}${completed ? `<h4>Im aktuellen Lauf abgeschlossen</h4><ul>${completed}</ul>` : ''}<p class="field-note">${escapeHtml(course.note)}</p></article>`;
  }).join('')}</section>`;
  const productCards = products.map(product => {
    const estimate = product.costEstimate;
    const calculation = estimate?.calculation;
    const costLineEvidence = estimate?.costLineEvidence ?? [];
    const costLines = (calculation?.directCosts ?? []).map((line, index) => ({ ...line, ...(costLineEvidence[index] ?? {}) }));
    if (!costLines.length) costLines.push({});
    const costLineMarkup = costLines.map((line, index) => renderV3ProductCostLine(index, line)).join('');
    const price = estimate ? euro(estimate.netPriceCents) : 'nicht kalkuliert';
    const db = calculation ? euro(calculation.dbICents) : '—';
    const steps = (product.steps ?? []).map(step => {
      const assignment = assignments.find(row => row.productId === product.productId && row.stepId === step.stepId && row.status !== 'cancelled')
        ?? [...assignments].reverse().find(row => row.productId === product.productId && row.stepId === step.stepId);
      const duration = `${assignment?.hours ?? step.hours} h`;
      const timeText = assignment?.status === 'completed'
        ? `<p><strong>Modellierte Simulationsdauer:</strong> ${escapeHtml(assignment.timeEvidence?.minutes ?? '—')} min · ${escapeHtml(assignment.timeEvidence?.label ?? 'Modellierte Spieldauer; keine extern gemessene Echtzeit')}</p><dl><dt>Quelle / Zuweisung</dt><dd>${escapeHtml(assignment.assignmentId)}</dd><dt>Datum / Periode</dt><dd>${escapeHtml(assignment.timeEvidence?.workDate ?? assignment.date)} · ${escapeHtml(assignment.timeEvidence?.period ?? assignment.date.slice(0, 7))}</dd><dt>Kosten</dt><dd>Ausstehend</dd></dl><p class="field-note">Fertigwarenwert und vollständiges COGS bleiben in V3 ausstehend. Modellierte Spieldauer; keine extern gemessene Echtzeit.</p>`
        : assignment?.status === 'cancelled'
          ? '<p>Keine Dauer erfasst: Schritt abgebrochen.</p>'
          : assignment
            ? `<p>Noch keine Dauer erfasst: Schritt nicht abgeschlossen. Geplante Zeit ${escapeHtml(duration)}.</p>${active ? `<button class="secondary product-step-complete" data-assignment="${escapeHtml(assignment.assignmentId)}" type="button">Schritt abschließen</button>` : ''}`
            : '<p>Noch nicht eingeplant.</p>';
      return `<li><strong>${escapeHtml(step.stepId)}</strong> · ${escapeHtml(step.kind)} · geplante Zeit ${escapeHtml(duration)} · Skills ${escapeHtml((step.requiredSkills ?? []).join(', ') || 'keine')} · Maschine ${escapeHtml((step.requiredEquipment ?? []).join(', ') || 'keine')} ${timeText}</li>`;
    }).join('');
    const openSales = sales.filter(sale => sale.productId === product.productId);
    const pendingReserved = openSales.filter(sale => sale.status === 'pending').reduce((sum, sale) => sum + sale.quantity, 0);
    const acceptedReserved = openSales.filter(sale => sale.status === 'accepted' && !sale.dispatchDate).reduce((sum, sale) => sum + sale.quantity, 0);
    const reserved = pendingReserved + acceptedReserved;
    const available = Math.max(0, (product.outputQuantity ?? 0) - pendingReserved);
    const physical = (product.outputQuantity ?? 0) + acceptedReserved;
    const opportunityRows = [];
    if (product.stage === 'finished_goods' && physical > 0 && marketState) {
      try { opportunityRows.push(...getV3ProductMarketOpportunities(productState, marketState, product.productId)); } catch { /* no matching market opportunity */ }
    }
    const inquiryRows = Array.isArray(marketState?.inquiries) ? marketState.inquiries : [];
    const saleForms = opportunityRows.filter(row => row.availableProductQuantity > 0).map(opportunity => {
      const inquiry = inquiryRows.find(row => row.inquiryId === opportunity.inquiryId);
      const buyer = inquiry?.customerId ?? opportunity.customerId;
      const maxQuantity = Math.min(available, opportunity.requiredCapacity);
      if (maxQuantity < 1) return '';
      return `<form class="form-grid product-sale-form"><input type="hidden" name="productId" value="${escapeHtml(product.productId)}"><input type="hidden" name="inquiryId" value="${escapeHtml(opportunity.inquiryId)}"><input type="hidden" name="buyerPartyId" value="${escapeHtml(buyer)}"><p class="wide">Offene Anfrage ${escapeHtml(opportunity.inquiryId)} · Käufer ${escapeHtml(buyer)} · bis ${escapeHtml(opportunity.expiresAt)}.</p><label>Menge<input name="quantity" type="number" min="1" max="${maxQuantity}" value="1" required></label><label>Netto-Angebotspreis in €<input name="netPrice" inputmode="decimal" value="${escapeHtml(estimate ? (estimate.netPriceCents / 100).toFixed(2).replace('.', ',') : '')}" required></label><label>Entscheidung frühestens<input name="decisionDate" type="date" min="${escapeHtml(productState.currentDate)}" value="${escapeHtml(shiftDate(productState.currentDate, 2))}" required></label><p class="field-note wide">Die Käuferannahme reserviert die angebotene Menge; sie löst keine Buchung aus. Planrechnung (nicht Ist, Planpreis ${escapeHtml(price)}): DB I ${escapeHtml(db)}. Vollkosten/BAB ausstehend.</p><p class="field-note wide" data-product-sale-estimate>Angebotsrechnung wird aus dem eingegebenen Preis und den expliziten direkten Kosten berechnet.</p><button class="primary wide" type="submit" ${active ? '' : 'disabled'}>Produktangebot übermitteln</button></form>`;
    }).join('');
    const saleRows = openSales.map(sale => {
      const buyerDecision = sale.status === 'pending' ? 'Angebot offen · Käuferentscheidung ausstehend'
        : sale.status === 'accepted' ? (sale.dispatchDate ? `Angenommen · versandt am ${escapeHtml(sale.dispatchDate)}` : 'Angenommen · reserviert · noch nicht versandt')
          : sale.status === 'rejected' ? 'Vom Käufer abgelehnt' : escapeHtml(sale.status);
      const snapshot = sale.offerSnapshot;
      const snapCalc = snapshot?.calculation;
      const snapshotText = snapCalc
        ? `Angebotsrechnung (Snapshot, Plan – nicht Ist): Preis ${euro(sale.netPriceCents)} · Planpreis damals ${euro(snapshot.plannedNetPriceCents)}; DB I ${euro(snapCalc.dbICents)}; Ergebnis nach direkten Kosten ${euro(snapCalc.resultAfterDirectCostsCents)}; Vollkosten/BAB ausstehend.`
        : '';
      const dispatch = sale.status === 'accepted' && !sale.dispatchDate
        ? `<button class="secondary product-sale-dispatch" type="button" data-sale="${escapeHtml(sale.saleId)}" ${active ? '' : 'disabled'}>Versand erfassen</button>` : '';
      return `<article class="card product-sale-status"><h4>${escapeHtml(sale.saleId)}</h4><p>${buyerDecision}</p><p>${escapeHtml(sale.quantity)} Stück · Käufer ${escapeHtml(sale.buyerPartyId)} · Angebot ${euro(sale.netPriceCents)} netto</p><p class="field-note">${escapeHtml(snapshotText)}</p>${dispatch}</article>`;
    }).join('');
    return `<article class="card own-product-card"><header><h3>${escapeHtml(product.name)}</h3><span class="tag">${escapeHtml(statusText[product.stage] ?? product.stage)}</span></header><p>${escapeHtml(product.productId)} · Segment ${escapeHtml(product.targetSegment)} · Fähigkeiten ${(product.marketCapabilities ?? []).map(escapeHtml).join(', ') || 'keine'}</p><p>Fertigwaren verfügbar: ${available} Stück · reserviert: ${reserved} · physisch vorhanden: ${physical}</p><p>Planrechnung (nicht Ist, Planpreis ${escapeHtml(price)}): DB I ${escapeHtml(db)} · Ergebnis nach direkten Kosten ${calculation ? euro(calculation.resultAfterDirectCostsCents) : '—'}; Vollkosten/BAB ausstehend.</p><p class="field-note">Planwerte sind keine Buchung und führen weder zu automatischer Kundenannahme noch zu Finanzwirkung.</p>${product.managementBrief ? `<section class="management-brief"><h4>Management-Briefing</h4><p>Verantwortlich: ${escapeHtml(product.managementBrief.assignedPersonId)} · Zielsegment: ${escapeHtml(product.managementBrief.targetSegment)}</p><p>Kundennutzen: ${escapeHtml(product.managementBrief.customerBenefit)}</p><p>Zielpreis netto: ${euro(product.managementBrief.targetPriceCents)} · Qualitätsziel: ${({basic:"Einfach und wirtschaftlich",standard:"Solide Marktqualität",premium:"Hohe Qualitätsanforderung"})[product.managementBrief.qualityTarget] ?? escapeHtml(product.managementBrief.qualityTarget)}</p><p class="field-note">Noch keine Teamprognose zu Dauer und erreichbarer Qualität; keine Produktionsfreigabe.</p></section>` : ""}<h4>Entwicklung und Produktionsfolge</h4><ol>${steps || '<li>Noch keine Produktionsschritte definiert.</li>'}</ol>${active ? `<form class="form-grid product-steps-form"><input type="hidden" name="productId" value="${escapeHtml(product.productId)}"><label class="wide">Schritte als JSON<textarea name="stepsJson" required>${escapeJson(product.steps)}</textarea></label><button class="secondary wide" type="submit">Schritte speichern</button></form><form class="form-grid product-step-plan-form"><label>Schritt<select name="stepId" required>${(product.steps ?? []).map(step => `<option value="${escapeHtml(step.stepId)}">${escapeHtml(step.stepId)}</option>`).join('')}</select></label><input type="hidden" name="productId" value="${escapeHtml(product.productId)}"><label>Datum<input type="date" name="date" value="${escapeHtml(productState.currentDate)}" required></label><label>Person<select name="personId" required>${personOptions}</select></label><label>Maschine<select name="equipmentId"><option value="">Keine</option>${equipmentOptions}</select></label><label>Output (Stück)<input type="number" name="outputQuantity" min="0" step="1" value="0" required></label><label>Materialmengen als JSON<input name="materialQuantitiesJson" value="{}" required></label><button class="secondary wide" type="submit">Schritt einplanen</button></form>` : ''}<h4>Produktkalkulation</h4>${active ? `<form class="form-grid product-cost-form"><input type="hidden" name="productId" value="${escapeHtml(product.productId)}" required><label>Netto-Planpreis in €<input name="netPrice" value="${escapeHtml(estimate ? (estimate.netPriceCents / 100).toFixed(2).replace('.', ',') : '')}" required></label><fieldset class="product-cost-lines wide"><legend>Direkte Plan-Kosten</legend>${costLineMarkup}<button class="secondary product-cost-line-add" type="button">Kostenposition hinzufügen</button><p class="field-note">Mindestens eine belegte Kostenposition mit Betrag größer 0,00 € ist erforderlich. Ein Produkt ohne direkte Kosten wird in dieser V3-Oberfläche nicht freigegeben; es braucht eine separate ausdrückliche Bestätigung. Gib pro Position Betrag, variable oder fixe Einordnung und eine eindeutige Quellreferenz an. Eine synthetic:-Referenz kennzeichnet eine Testannahme, keinen geprüften externen Beleg. Es werden nur Kosten in EUR eingegeben. Der Betrag wird auf Cent übernommen; es erfolgt keine weitere Rundung.</p></fieldset><label>Kalkulationsversion<input name="costVersion" value="${escapeHtml(estimate?.costVersion ?? 'PLAN-1')}" required></label><button class="primary wide" type="submit">DB-I-Plan kalkulieren (Vollkosten/BAB später)</button></form>` : '<button class="primary wide" type="submit" disabled>DB-I-Plan kalkulieren (Simulationstag öffnen)</button>'}<h4>Vermarktung</h4>${saleForms || '<p>Keine passende offene Anfrage.</p>'}${saleRows}</article>`;
  }).join('');
const archetypeOptions = V3_PRODUCT_ARCHETYPES.map(archetype => { const gaps = getV3RequirementGaps(productState.people, productState.equipment, archetype.requirements); const missing = formatV3RequirementGaps(gaps).join(', '); return '<option value="' + escapeHtml(archetype.id) + '"' + (gaps.eligible ? '' : ' disabled') + '>' + escapeHtml(archetype.label) + (gaps.eligible ? '' : ' · fehlt: ' + escapeHtml(missing)) + '</option>'; }).join('');
const firstEligibleArchetype = V3_PRODUCT_ARCHETYPES.find(archetype => getV3RequirementGaps(productState.people, productState.equipment, archetype.requirements).eligible);
const conceptPeople = (productState.people ?? []).map(person => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.displayName ?? person.id)} · ${escapeHtml(person.qualificationTitle ?? person.role ?? 'Mitarbeiter')}</option>`).join('');
const createForm = active ? `<form class="form-grid product-create-form"><label>Produktkonzept<select name="archetypeId" required>${archetypeOptions}</select></label><label>Verantwortliches Teammitglied<select name="assignedPersonId" required>${conceptPeople}</select></label><label class="wide">Kundennutzen in eigenen Worten<textarea name="customerBenefit" minlength="8" maxlength="300" required placeholder="Welches Problem des Kunden löst das Produkt?"></textarea></label><label>Zielpreis netto (€)<input name="targetPrice" inputmode="decimal" required placeholder="z. B. 45,00"></label><label>Qualitätsziel<select name="qualityTarget" required><option value="basic">Einfach und wirtschaftlich</option><option value="standard" selected>Solide Marktqualität</option><option value="premium">Hohe Qualitätsanforderung</option></select></label><p class="field-note wide">Das Team-Briefing wird gespeichert. Material und erforderliche Fähigkeiten kommen aus dem gewählten, betrieblich machbaren Produktprofil. Eine belastbare Dauer- und Qualitätsprognose durch das Team ist noch nicht vorhanden; dieses Konzept wird daher noch nicht zur Produktionsfreigabe.</p><button class="primary wide" type="submit"${firstEligibleArchetype ? '' : ' disabled'}>Produktkonzept beauftragen</button></form>` : '<button class="primary wide" type="button" disabled>Produktkonzept beauftragen (Simulationstag öffnen)</button>';
  return `<section class="own-products" aria-labelledby="own-products-title"><h2 id="own-products-title">Eigene Produkte</h2><p>Produktentwicklung, Produktionsplanung und Vermarktung: keine Buchung oder automatische Kundenannahme. Planrechnungen sind nicht gebucht; vollständige Vollkosten/BAB und COGS bleiben ausstehend.</p>${trainingUi}${createForm}${productCards || '<p class="empty">Noch keine eigenen Produkte angelegt.</p>'}</section>`;
}
export function calculateV3ProductSaleOfferPreview(productState, productId, rawNetPrice) {
  const product = (productState?.products ?? []).find(row => row.productId === productId);
  if (!product?.costEstimate?.calculation) throw new TypeError('Erst eine Produktkalkulation mit expliziten Kosten speichern.');
  const netPriceCents = euroToCents(rawNetPrice);
  const fullEstimate = calculateV3OfferEstimate({
    netPriceCents,
    directCosts: product.costEstimate.calculation.directCosts,
    babAllocatedCents: 0,
  });
  const { babAllocatedCents, resultAfterBabCents, ...calculation } = fullEstimate;
  return Object.freeze({ netPriceCents, calculation });
}

/** Synthetic supplier choices with source-bound, non-posting invoice evidence. */
export function renderInternationalMaterialSupplyUi(productState, activeDate = null, active = false) {
  if (!productState) return '';
  const date = activeDate ?? productState.currentDate;
  const materials = productState.materials ?? [];
  const shipments = productState.materialShipments ?? [];
  const movements = productState.materialMovements ?? [];
  const stockRows = materials.map(row => `<li><strong>${escapeHtml(row.id)}</strong>: ${escapeHtml(row.quantity)} Einheiten verfügbar</li>`).join('');
  const shipmentRows = shipments.map(row => {
    const movement = movements.find(item => item.shipmentId === row.shipmentId);
    const quote = row.supplierQuoteSnapshot;
    const status = row.status === 'received'
      ? `Eingegangen am ${escapeHtml(row.receivedAt)} · Bestand danach ${escapeHtml(movement?.quantityAfter ?? '—')} Einheiten · ${escapeHtml(movement?.monetaryStatus ?? 'nonposting_pending_cost_source')}`
      : `Unterwegs · erwartete Ankunft ${escapeHtml(row.etaDate)}`;
    const receive = row.status === 'received' ? ''
      : active && date >= row.etaDate
        ? ` <button class="secondary international-material-receipt" type="button" data-shipment="${escapeHtml(row.shipmentId)}">Wareneingang erfassen</button>`
        : ` <button class="secondary international-material-receipt" type="button" data-shipment="${escapeHtml(row.shipmentId)}" disabled>${active ? `Wareneingang ab ${escapeHtml(row.etaDate)}` : 'Simulationstag öffnen'}</button>`;
    return `<li><strong>${escapeHtml(row.materialId)} · ${escapeHtml(row.quantity)} ${escapeHtml(quote?.unit ?? 'Einheiten')}</strong> · ${escapeHtml(quote?.supplierLabel ?? 'Lieferant unbekannt')} · ${euro(quote?.totalNetAmountCents ?? 0)} netto · ${status}${receive}</li>`;
  }).join('');
  const supplierForms = materials.map(material => {
    const anchor = V3_SUPPLIER_PRICE_ANCHORS[String(material.id).toLowerCase()];
    if (!anchor) return '';
    const options = getV3SupplierScenarioQuotes(material.id, 1).map(quote => {
      const profile = V3_SUPPLIER_SCENARIO_PROFILES[quote.supplierId];
      const delivery = profile.deliveryDays === 0 ? 'sofort' : `${profile.deliveryDays} Kalendertage`;
      const price = `${(quote.unitPriceCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €/` + (quote.unit === 'pieces' ? 'Stück' : quote.unit);
      const freight = quote.freightCents ? ` + ${(quote.freightCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })} € Versand` : '';
      const minimum = profile.minimumQuantity ? ` · Mindestmenge ${profile.minimumQuantity} ${anchor.unit}` : '';
      return `<option value="${escapeHtml(quote.supplierId)}">${escapeHtml(quote.supplierLabel)} · ${price}${freight} · ${delivery}${minimum}</option>`;
    }).join('');
    return `<form class="form-grid international-material-order-form"><input type="hidden" name="materialId" value="${escapeHtml(material.id)}"><p class="wide"><strong>${escapeHtml(anchor.label)}</strong> · Lagerbestand ${escapeHtml(material.quantity)} ${escapeHtml(anchor.unit)}</p><label>Bestellmenge (${escapeHtml(anchor.unit)})<input name="quantity" type="number" min="0.01" step="0.01" value="1" required></label><label>Lieferant und Angebot<select name="supplierId" required>${options}</select></label><button class="primary wide" type="submit" ${active ? '' : 'disabled'}>Angebot annehmen und bestellen</button></form>`;
  }).filter(Boolean).join('');
  const form = supplierForms || '<p class="empty">Für diese Materialien gibt es noch keinen ausdrücklich freigegebenen Preisanker.</p>';
  const invoices = (productState.supplierInvoiceEvidence ?? []).map(invoice => `<li><strong>Rechnungsevidenz ${escapeHtml(compactReference(invoice.invoiceId))}</strong> · ${escapeHtml(invoice.supplierId)} · ${euro(invoice.amountCents)} EUR · Rechnung ${escapeHtml(invoice.invoiceDate)} · fällig ${escapeHtml(invoice.dueDate)} · OP-Status im Finanzbereich</li>`).join('');
  return `<section class="material-supply" aria-labelledby="material-supply-title"><h3 id="material-supply-title">Lager &amp; Beschaffung</h3><p><strong>Synthetische V3-Angebote nach D-0173:</strong> D-0128 ist nur der Rechenanker. Die Profilpreise sind keine aktuellen Marktangebote. Lieferverzögerungsrisiko ist noch nicht parametrisiert und bleibt deaktiviert.</p><h4>Verfügbare Materialien</h4><ul class="material-stock-list">${stockRows || '<li>Kein Bestand</li>'}</ul><h4>Bestellungen und Wareneingang</h4><ul class="material-shipment-list">${shipmentRows || '<li>Noch keine Bestellung.</li>'}</ul><h4>Rechnungsevidenz</h4><ul class="supplier-invoice-list">${invoices || '<li>Noch keine Rechnungsevidenz.</li>'}</ul><p class="field-note">Wareneingang aktualisiert den Materialbestand und erzeugt die getrennte Lieferantenrechnungsevidenz. Der offene Lieferantenposten erscheint im Finanzbereich. Eine Zahlung erfolgt ausschließlich nach manuellem Klick und nur als vollständige Zahlung.</p><details><summary>Material bestellen</summary>${form}</details></section>`;
}
/** Own-product workspace reads the shared product module and keeps every output explicitly non-posting. */
export function handleInternationalMaterialOrderSubmit(event, { run, setRun, render = () => {}, setStatus = () => {}, readFormValues = form => Object.fromEntries(new FormData(form)) }) {
  const form = event.target;
  if (!form.matches('.international-material-order-form')) return false;
  event.preventDefault();
  try {
    if (!run?.activeDay) throw new Error('Öffne zuerst den Simulationstag.');
    if (!run.modules?.product) throw new Error('Materialbestand ist nicht initialisiert.');
    const values = readFormValues(form);
    const materialId = String(values.materialId ?? '');
    if (!run.modules.product.materials.some(row => row.id === materialId)) throw new Error(`Unbekanntes Material: ${materialId}`);
    const quantity = Number(values.quantity);
    const supplierId = String(values.supplierId ?? '');
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Bestellmenge muss größer als null sein.');
    const quote = getV3SupplierScenarioQuotes(materialId, quantity).find(row => row.supplierId === supplierId);
    if (!quote) throw new Error('Für dieses Material liegt kein freigegebenes synthetisches Lieferantenangebot vor.');
    const profile = V3_SUPPLIER_SCENARIO_PROFILES[supplierId];
    if (quantity < profile.minimumQuantity) throw new Error(`${profile.label} verlangt mindestens ${profile.minimumQuantity} ${quote.unit}.`);
    const sequence = (run.modules.product.materialShipments?.length ?? 0) + 1;
    const orderKey = `${encodeURIComponent(run.runId)}|${String(sequence).padStart(4, '0')}`;
    const baselineEtaDate = shiftDate(run.activeDay.date, profile.deliveryDays);
    const etaDate = baselineEtaDate;
    const outcome = placeV3RunInternationalMaterialOrder(run, {
      orderId: `SYNTHETIC-MATERIAL-ORDER|${orderKey}`, shipmentId: `SYNTHETIC-MATERIAL-SHIPMENT|${orderKey}`,
      materialId, quantity, supplierId, sourceRef: `synthetic-fixture:D-0173:${supplierId}:v1`,
      fixtureId: 'synthetic:D-0173:supplier-profile-v1', baselineEtaDate, etaDate, lagDays: 0,
    });
    setRun(outcome.state); render();
    setStatus(`Angebot von ${profile.label} angenommen. Preis und Konditionen sind gespeichert. Material wird ab ${etaDate} verfügbar; keine AP- oder Bankbuchung.`);
  } catch (error) { setStatus(error.message); }
  return true;
}

export function handleInternationalMaterialReceiptClick(event, { run, setRun, financeState = null, setFinanceState = () => {}, render = () => {}, setStatus = () => {} }) {
  const button = event.target?.closest?.('.international-material-receipt');
  if (!button) return false;
  try {
    if (!run?.activeDay) throw new Error('Öffne zuerst den Simulationstag.');
    const outcome = receiveV3RunInternationalMaterialShipment(run, button.dataset.shipment);
    const invoice = outcome.state.modules.product?.supplierInvoiceEvidence?.find(row => row.shipmentId === button.dataset.shipment);
    const nextFinanceState = invoice && financeState
      ? recordV3SupplierInvoiceFromRunEvidence(financeState, { runState: outcome.state, invoiceId: invoice.invoiceId })
      : financeState;
    setRun(outcome.state);
    if (invoice && financeState) setFinanceState(nextFinanceState);
    render();
    setStatus(outcome.duplicate
      ? 'Wareneingang war bereits erfasst; Bestand und Lieferantenposten wurden nicht erneut erhöht.'
      : invoice && financeState
        ? 'Wareneingang erfasst. Die Rechnung wurde als offener Lieferantenposten übernommen; Zahlung erfolgt nur nach manuellem Klick.'
        : 'Wareneingang erfasst. Die Rechnungsevidenz bleibt sichtbar; ein bestätigtes Finanzmapping für den Lieferantenposten ist nicht verfügbar.');
  } catch (error) {
    setStatus(error.message);
  }
  return true;
}
function renderMacroImportPriceReferences(rows = []) {
  if (!Array.isArray(rows) || !rows.length) return '';  return rows.map((reference, index) => {
    const sourceUrl = safeLink(reference.sourceRef, 'genesis.destatis.de');
    const evidenceUrl = safeLink(reference.publicationEvidenceRef, 'www.destatis.de');
    const groups = [
      ['Euro-Länder', reference.groupValues.euroCountries.value],
      ['Nicht-Euro-Länder', reference.groupValues.nonEuroCountries.value],
      ['Insgesamt', reference.groupValues.total.value],
    ].map(([label, value]) => `<li><span>${label}</span><strong>${formatIndex(value)}</strong></li>`).join('');
    return `<section class="macro-import-price-reference" aria-labelledby="import-price-reference-title-${index}"><div class="macro-reference-heading"><h3 id="import-price-reference-title-${index}">Einfuhrpreisindex · historische Referenz</h3><span class="tag">Beobachtet</span></div><p>Destatis GENESIS, Reihe ${escapeHtml(reference.sourceSeriesId)} · Beobachtungsmonat <strong>${escapeHtml(reference.observedPeriod)}</strong> · Indexbasis <strong>${escapeHtml(reference.indexBase)}</strong>.</p><ul class="macro-reference-values">${groups}</ul><p class="field-note">Zugehörige Destatis-Pressemitteilung vom ${escapeHtml(reference.sourceReleaseDate)}${evidenceUrl ? ` · <a href="${escapeHtml(evidenceUrl)}" target="_blank" rel="noopener noreferrer">Veröffentlichungsbeleg</a>` : ''}. Für einzelne GENESIS-Zellen liegt kein Zeitstempel vor.</p><p class="field-note">Quelle: ${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">GENESIS ${escapeHtml(reference.sourceSeriesId)}</a>` : `GENESIS ${escapeHtml(reference.sourceSeriesId)}`} · Abruf/Vintage ${escapeHtml(reference.retrievedAt)} · ${escapeHtml(reference.dataVintage)} · Revisionsstatus: ${escapeHtml(reference.revisionStatus ?? 'nicht ausgewiesen')}.</p><p class="macro-reference-boundary"><strong>Nur Information:</strong> historischer, statischer Beobachtungsstand. Keine automatische Kosten-, Beschaffungs-, Preis-, Angebots-, Vertrags- oder Finanzwirkung. Die Werte werden nicht auf das Unternehmen übertragen.</p></section>`;
  }).join('');
}
function safeLink(value, allowedHost) {
  if (typeof value !== 'string' || typeof allowedHost !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== allowedHost || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
function formatIndex(value) {
  return Number.isFinite(value) ? value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : 'nicht verfügbar';
}
export function renderMacroSummary(macroState, marketState, projection = null) {
  const periods = Array.isArray(macroState?.periods) ? macroState.periods : [];
  const latest = periods.at(-1) ?? null;
  const phaseLabel = ({ upswing: 'Aufschwung', boom: 'Hochkonjunktur', downturn: 'Abschwung', low: 'Tiefphase' })[latest?.phaseState?.phase] ?? latest?.phaseState?.phase ?? 'noch kein Monatsabschluss';
  const formatPercent = value => Number.isFinite(value) ? `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %` : 'nicht ausgewiesen';
  const periodRows = periods.slice(-6).reverse().map(snapshot => {
    const phase = ({ upswing: 'Aufschwung', boom: 'Hochkonjunktur', downturn: 'Abschwung', low: 'Tiefphase' })[snapshot.phaseState?.phase] ?? snapshot.phaseState?.phase ?? 'nicht ausgewiesen';
    return `<article class="card macro-period-card"><h4>${escapeHtml(snapshot.period ?? 'Periode')}</h4><p>Konjunkturlage: ${escapeHtml(phase)}</p><p>Inflation gegenüber Vorjahr: ${escapeHtml(formatPercent(snapshot.spi?.yearOverYearInflation))}</p><p>Aktivitätslücke: ${escapeHtml(formatPercent(snapshot.activity?.activityGapPct))}</p></article>`;
  }).join('');
  const latestDemand = [...(marketState?.events ?? [])].reverse().map(event => event.result?.macroDemand ?? event.payload?.templates?.find(template => template.macroDemand)?.macroDemand).find(Boolean);
  const demandDetail = latestDemand
    ? `Letzter Wochenlauf ${escapeHtml(latestDemand.weekStart ?? 'mit D-0169-Spur')}: Nachfragefaktor ${escapeHtml(formatPercent((latestDemand.demandFactor - 1) * 100))} gegenüber neutral; ${escapeHtml(latestDemand.realizedInquiryCount ?? 'nicht ausgewiesen')} Anfragen.`
    : 'Ohne aktive Exposition bleibt die Nachfrage neutral; für neue Wochen wird derselbe Seed reproduzierbar verwendet.';
  const financing = renderMacroFinancingReference(projection?.macroFinancingReference ?? null);
  const importReference = renderMacroImportPriceReferences(projection?.macroTradeImpact?.references ?? []);
  const impacts = renderMacroImpactProjection(projection ?? {});
  return `<section class="macro-summary-view" aria-label="Makroökonomie und Unternehmenswirkung"><h3>Volkswirtschaft &amp; Konjunktur</h3><p class="macro-current-state">Aktuelle Lage: <strong>${escapeHtml(phaseLabel)}</strong>${latest?.period ? ` · Periode ${escapeHtml(latest.period)}` : ''}</p><p class="field-note">D-0169: Die Nachfragewirkung ist eine synthetische, seed-stabile V3-Spielannahme; sie wird aus Aktivitätslücke und festem Run-Seed berechnet, fehlende Exposition bleibt neutral. Keine beobachtete Prognose oder Finanzbuchung. ${demandDetail}</p>${periodRows ? `<div class="macro-period-grid">${periodRows}</div>` : '<p class="empty">Noch keine abgeschlossene Makroperiode.</p>'}${financing}${importReference}${impacts}${renderOperatingImpactProjection(projection?.operatingImpact)}</section>`;
}function renderMacroFinancingReference(reference) {
  if (!reference) return '';
  const benchmark = reference.marginBenchmark;
  const rate = reference.referenceRate;
  const formatLevel = value => Number.isFinite(value)
    ? value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'nicht verfügbar';
  const formatMargin = value => Number.isFinite(value)
    ? `${value > 0 ? '+' : ''}${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'nicht verfügbar';
  const sourceLabel = ({ observed: 'beobachteter Quellenwert', synthetic_scenario: 'synthetischer Szenariowert', synthetic_fixture: 'synthetische Test-Fixture', derived: 'abgeleiteter Wert', unavailable: 'nicht verfügbar' })[rate?.sourceType] ?? (rate ? 'Quelle nicht klassifiziert' : 'nicht verfügbar');
  const referenceDetail = rate
    ? `<p>MRO-Referenz: <strong>${formatLevel(rate.valuePctPA)} % p. a.</strong> · ${escapeHtml(sourceLabel)}</p><p class="field-note">Referenzperiode ${escapeHtml(rate.observedPeriod ?? reference.period ?? 'nicht ausgewiesen')} · wirksam ab ${escapeHtml(rate.effectiveFrom ?? 'nicht ausgewiesen')} · Quelle ${escapeHtml(rate.sourceRef ?? 'nicht ausgewiesen')}${rate.dataVintage ? ` · Datenstand ${escapeHtml(rate.dataVintage)}` : ''}${rate.assumptionStatus ? ` · ${escapeHtml(rate.assumptionStatus)}` : ''}.</p>`
    : '<p>MRO-Referenz: derzeit nicht verfügbar; es wird kein Ersatzwert angenommen.</p>';
  const benchmarkDetail = benchmark
    ? `<p>D-0022 Referenzaufschlag: <strong>${formatMargin(benchmark.low)} bis ${formatMargin(benchmark.high)} Prozentpunkte</strong>; Mittelwert ${formatMargin(benchmark.mean)} Prozentpunkte.</p>`
    : '<p>D-0022 Referenzaufschlag nicht verfügbar.</p>';
  return `<section class="macro-financing-reference" aria-label="Referenz zur Unternehmensfinanzierung"><h3>Finanzierungsreferenz</h3>${referenceDetail}${benchmarkDetail}<p><span class="tag pending">Individuelle Konditionen: offen (pending)</span></p><p class="field-note">Das Referenzband ist kein persönlicher Zinssatz und kein Kreditangebot. Keine Vertrags-, Raten- oder Finanzwirkung; bestehende Kredite und Dispo bleiben unverändert.</p></section>`;
}
function eventItem(row) { return `<li><strong>${escapeHtml(row.occurredAt ?? row.date ?? '—')} · ${escapeHtml(row.phase)}</strong><span>Event-ID: ${escapeHtml(row.eventId)}</span></li>`; }

function init() {
  const $ = selector => document.querySelector(selector); const startForm = $('#start-form'); const workspace = $('#run-workspace'); const runStatus = $('#run-status'); const status = $('#live-status'); let run = null; let financeState = null; let financeWarning = null; let managementDirection = 'liquidity';
  let activeGameView = 'office';
  const renderRunContext = state => {
    const label = (value, map) => map[value] ?? value ?? '—';
    const macro = state.modules.macro?.path ?? decodeURIComponent(state.runId.split('|')[4] ?? '—');
    const cost = label(state.costPlanFixtureId, { NEUTRAL: 'Neutral · keine zusätzlichen Kostenplanimpulse', 'V3-PLAN-INDEX-SYNTH-EQUAL-1': 'Synthetische Lern-Fixture · Kostenplanindex' });
    const foreign = label(state.foreignDemandFixtureId, { NEUTRAL: 'Neutral · keine Nachfrageverschiebung', 'V3-L2-EXPORT-SHIFT-5PP-LAG1': 'Synthetische Exportsegment-Fixture' });
    const reference = label(state.importPriceBenchmarkId, { NEUTRAL: 'Neutral · keine Einfuhrpreisreferenz', 'DESTATIS-61411-0010-2026-09-VINTAGE-2026-11-01': 'Destatis-Referenz · September 2026' });
    const fxPlan = label(state.fxOfferPlanFixtureId, { NEUTRAL: 'Neutral · keine FX-Planvorschau', [V3_FX_OFFER_PLAN_FIXTURE_ID]: 'Synthetisches FX-Angebotsplan-Fixture' });
    const invitations = label(state.marketInvitationProfileId ?? 'NEUTRAL', { NEUTRAL: 'Neutral · Preisgewichtung aus', [V3_MARKET_INVITATION_PRICE_PROFILE_ID]: 'Synthetische Preisgewichtung für Einladungen' });
    $('#run-context-content').innerHTML = '<h2>Unveränderliche Testannahmen</h2><dl><dt>Szenario</dt><dd>'+escapeHtml(state.scenarioId)+'</dd><dt>Run-ID</dt><dd>'+escapeHtml(state.runId)+'</dd><dt>Seed</dt><dd>'+escapeHtml(state.seed)+'</dd><dt>Zeitraum</dt><dd>'+escapeHtml(state.startDate)+' bis '+escapeHtml(state.endDate)+'</dd><dt>Konjunkturpfad</dt><dd>'+escapeHtml(label(macro,{UPSWING:'Aufschwung',BOOM:'Hochkonjunktur',DOWNTURN:'Abschwung',LOW:'Tiefphase'}))+'</dd><dt>Kostenplan</dt><dd>'+escapeHtml(cost)+'</dd><dt>Außenwirtschaft</dt><dd>'+escapeHtml(foreign)+'</dd><dt>Einfuhrpreis</dt><dd>'+escapeHtml(reference)+'</dd><dt>FX-Plan</dt><dd>'+escapeHtml(fxPlan)+'</dd><dt>Kundeneinladungen</dt><dd>'+escapeHtml(invitations)+'</dd></dl><p class="field-note">Diese Annahmen sind schreibgeschützt. Ein anderer Test erfordert einen neuen Lauf.</p>';
  };
  const activateGameView = view => {
    if (!run?.modules.product) view = 'resources';
    activeGameView = view;
    document.querySelectorAll('#run-workspace [data-game-view]').forEach(panel => { panel.hidden = panel.dataset.gameView !== view; });
    document.querySelectorAll('#game-nav [data-view-target]').forEach(button => { button.setAttribute('aria-current', button.dataset.viewTarget === view ? 'page' : 'false'); });
    $('#office-home').hidden = view !== 'office';
    if ($('#game-view-title')) $('#game-view-title').textContent = ({office:'Büro',customers:'Kunden & Aufträge',operations:'Produktion',resources:'Material & Inventar',finance:'Finanzen',economy:'Markt & Wirtschaft',learning:'Lernen',history:'Verlauf'})[view] ?? 'Büro';
  };
  const enterRunWorkspace = () => {
    ensureControl();
    const setup = $('#setup-title')?.closest('.panel'); if (setup) setup.hidden = true;
    const intro = document.querySelector('.intro'); if (intro) intro.hidden = true;
    $('#run-context').hidden = false;
    $('#run-context-content').innerHTML = '';
    renderRunContext(run);
    activateGameView(run.modules.product ? 'office' : 'resources');
    startForm.querySelectorAll('input,select,button').forEach(control => { control.disabled = true; }); resourceForm.querySelectorAll('input,textarea,button').forEach(control => { control.disabled = true; });
  };
  const fixtureSelect = startForm.elements.namedItem('costPlanFixtureId');
  const foreignDemandSelect = startForm.elements.namedItem('foreignDemandFixtureId');
  const fxOfferPlanSelect = startForm.elements.namedItem('fxOfferPlanFixtureId');
  const importPriceSelect = startForm.elements.namedItem('importPriceBenchmarkId');
  const startDateInput = startForm.elements.namedItem('startDate');
  const endDateInput = startForm.elements.namedItem('endDate');
  const fixtureHelp = $('#cost-plan-fixture-help');
  const foreignDemandHelp = $('#foreign-demand-fixture-help');
  const fxOfferPlanHelp = $('#fx-offer-plan-fixture-help');
  const updateFixtureConstraints = () => {
    const selected = fixtureSelect.value === 'V3-PLAN-INDEX-SYNTH-EQUAL-1';
    startDateInput.min = selected ? '2027-01-01' : '';
    startDateInput.max = selected ? '2027-01-31' : '';
    endDateInput.min = selected ? '2027-02-01' : '';
    startDateInput.setCustomValidity(selected && (startDateInput.value < '2027-01-01' || startDateInput.value > '2027-01-31') ? 'Für die synthetische Kostenplan-Fixture muss der Lauf im Januar 2027 starten.' : '');
    endDateInput.setCustomValidity(selected && endDateInput.value < '2027-02-01' ? 'Die synthetische Kostenplan-Fixture wird erst im Februar 2027 wirksam; das Laufende muss mindestens der 01.02.2027 sein.' : '');
    fixtureHelp.textContent = selected
      ? 'Synthetisches Lernmaterial, keine beobachtete Marktinformation. Basis Januar 2027; ein Monat Verzögerung, wirksam ab Februar 2027. Start im Januar 2027 und Enddatum mindestens 01.02.2027 erforderlich. Die Datumsfelder werden nicht automatisch geändert.'
      : 'Neutral ist vorausgewählt. Die optionale Kostenplan-Fixture ist synthetisches Lernmaterial, keine beobachtete Marktinformation. Basis Januar 2027; ein Monat Verzögerung, wirksam ab Februar 2027. Sie erfordert Start im Januar 2027 und Enddatum mindestens 01.02.2027. Die Datumsfelder werden nicht automatisch geändert.';
  };
  const updateForeignDemandConstraints = () => {
    const selected = foreignDemandSelect.value === 'V3-L2-EXPORT-SHIFT-5PP-LAG1';
    const validStart = startDateInput.value === '2027-01-04';
    const validEnd = endDateInput.value >= '2027-02-01';
    foreignDemandSelect.setCustomValidity(selected && !validStart ? 'Die synthetische Exportnachfrage-Fixture benötigt den Starttermin 04.01.2027.' : selected && !validEnd ? 'Die synthetische Exportnachfrage-Fixture wirkt ab Februar 2027; das Laufende muss mindestens der 01.02.2027 sein.' : '');
    foreignDemandHelp.textContent = selected
      ? 'Synthetischer Testfall, keine beobachtete Marktinformation oder Prognose. Januarannahme; ab Februar wird der Anteil vorhandener exportfähiger Segmente um 5 Prozentpunkte verschoben. Die Wochen-Gesamtzahl bleibt unverändert; keine zusätzlichen Aufträge oder Finanzwirkungen. Start 04.01.2027 und Ende mindestens 01.02.2027 erforderlich. Datumsfelder werden nicht automatisch geändert.'
      : 'Neutral ist vorausgewählt. Die optionale Exportnachfrage-Fixture ist synthetisches Lernmaterial, keine beobachtete Marktinformation. Januarannahme, ein Monat Verzögerung und ab Februar +5 Prozentpunkte Exportsegmentmix. Die Gesamtzahl der Anfragen bleibt unverändert; keine zusätzlichen Aufträge oder Finanzwirkungen.';
  };
  const updateFxOfferPlanConstraints = () => {
    const selected = fxOfferPlanSelect.value === V3_FX_OFFER_PLAN_FIXTURE_ID;
    const validStart = startDateInput.value === '2027-01-04';
    const validEnd = endDateInput.value >= '2027-03-01';
    fxOfferPlanSelect.setCustomValidity(selected && !validStart ? 'Die synthetische FX-Fixture benötigt den Starttermin 04.01.2027.' : selected && !validEnd ? 'Die FX-Wirkung wird frühestens im März 2027 sichtbar; das Laufende muss mindestens der 01.03.2027 sein.' : '');
    fxOfferPlanHelp.textContent = selected
      ? 'Synthetische Lernannahme, keine beobachtete Marktinformation, Lieferantenquote oder ECB-Transaktionskurs. Referenzmonat Januar, simulierte Änderung Februar, ein Monat Lag; frühestens ab März wirksam. Erfordert Start 04.01.2027 und Ende mindestens 01.03.2027. Nach Start nicht änderbar.'
      : 'Neutral ist vorausgewählt. Die optionale FX-Planvorschau ist eine synthetische, nichtbuchende Planannahme. Bei Auswahl muss der Lauf am 04.01.2027 starten und bis mindestens 01.03.2027 reichen. Änderungen sind nur vor dem Start möglich.';
  };
  for (const input of [fixtureSelect, foreignDemandSelect, fxOfferPlanSelect, startDateInput, endDateInput]) { input.addEventListener('input', updateFixtureConstraints); input.addEventListener('change', updateFixtureConstraints); input.addEventListener('input', updateForeignDemandConstraints); input.addEventListener('change', updateForeignDemandConstraints); input.addEventListener('input', updateFxOfferPlanConstraints); input.addEventListener('change', updateFxOfferPlanConstraints); }
  updateFixtureConstraints(); updateForeignDemandConstraints(); updateFxOfferPlanConstraints(); const ensureControl = () => {
    if (!$('#close-day')) { const row = document.createElement('div'); row.className = 'day-controls'; row.innerHTML = '<button class="primary" id="open-day" type="button">Nächsten Simulationstag öffnen</button><button class="primary" id="close-day" type="button">Tag abschließen</button>'; $('#advance-day').replaceWith(row); }
    if (!$('#run-context')) { const menu=document.createElement('details'); menu.id='run-context'; menu.className='run-context'; menu.hidden=true; menu.innerHTML='<summary aria-label="Schreibgeschützte Testannahmen anzeigen">⋯ Testannahmen</summary><div id="run-context-content" class="run-context-popover"></div>'; document.querySelector('.topbar').append(menu); }
    if (!$('#game-nav')) {
      const workspace=$('#run-workspace');
      const nav=document.createElement('nav'); nav.id='game-nav'; nav.className='game-nav'; nav.setAttribute('aria-label','Spielbereiche'); nav.innerHTML='<button type="button" data-view-target="office"><span class="nav-icon">⌂</span><span>Büro</span></button><button type="button" data-view-target="customers"><span class="nav-icon">✉</span><span>Aufträge</span></button><button type="button" data-view-target="operations"><span class="nav-icon">⚙</span><span>Produktion</span></button><button type="button" data-view-target="resources"><span class="nav-icon">▣</span><span>Material</span></button><button type="button" data-view-target="finance"><span class="nav-icon">▤</span><span>Finanzen</span></button><button type="button" data-view-target="economy"><span class="nav-icon">↗</span><span>Wirtschaft</span></button><button type="button" data-view-target="learning"><span class="nav-icon">▧</span><span>Lernen</span></button><button type="button" data-view-target="history"><span class="nav-icon">◷</span><span>Verlauf</span></button>';
      const office=document.createElement('section'); office.id='office-home'; office.className='office-home'; office.dataset.gameView='office'; office.innerHTML='<div class="office-heading"><div><p class="eyebrow">Dein Betrieb · V3</p><h2 id="game-view-title">Büro</h2><p>Wähle einen Gegenstand auf dem Schreibtisch oder öffne einen Bereich über die Reiternavigation.</p></div><span class="office-clock">TAGESPLAN</span></div><div class="office-scene"><div class="desk-caption"><span class="desk-light"></span><strong>Werkstattbüro</strong><span>Unternehmenszentrale</span></div><div class="desk-objects"><button type="button" class="desk-object object-computer" data-view-target="resources"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="10" width="48" height="34" rx="4"/><path d="M24 54h16M32 44v10M15 17h34v20H15z"/></svg></span><strong>Computer</strong><small>Material & Inventar</small></button><button type="button" class="desk-object object-inbox" data-view-target="customers"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="15" width="48" height="34" rx="5"/><path d="m11 20 21 17 21-17M8 45l16-13m32 13L40 32"/></svg></span><strong>Postfach</strong><small>Kunden & Aufträge</small></button><button type="button" class="desk-object object-machine" data-view-target="operations"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 46h44M15 46V27h12v19m0-12h22v12M19 27v-9h14v9m-4-9h14l8 9M37 34h8"/><circle cx="22" cy="36" r="3"/><path d="M10 52h44"/></svg></span><strong>Werkbank</strong><small>Produktion & Planung</small></button><button type="button" class="desk-object object-safe" data-view-target="finance"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="11" y="9" width="42" height="46" rx="5"/><circle cx="32" cy="32" r="11"/><path d="M32 24v16m-5-11h8a3 3 0 0 1 0 6h-7"/><path d="M17 16h5m20 0h5"/></svg></span><strong>Tresor</strong><small>Finanzen</small></button><button type="button" class="desk-object object-chart" data-view-target="economy"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 51h45M14 45V14m4 29 11-12 9 6 15-20"/><path d="M44 17h9v9"/></svg></span><strong>Marktbericht</strong><small>Wirtschaft & Wettbewerb</small></button><button type="button" class="desk-object object-book" data-view-target="learning"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 15c10-4 18-2 22 3v34c-5-5-13-7-22-3zm44 0c-10-4-18-2-22 3v34c5-5 13-7 22-3zM19 24c4-1 7 0 9 2m-9 7c4-1 7 0 9 2m17-11c3-2 6-3 9-2m-9 9c3-2 6-3 9-2"/></svg></span><strong>Fachbuch</strong><small>Lernbereich</small></button><button type="button" class="desk-object object-calendar" data-view-target="history"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="13" width="44" height="42" rx="5"/><path d="M10 25h44M21 9v9m22-9v9M19 33h7m7 0h7m7 0h3M19 41h7m7 0h7"/></svg></span><strong>Tagesmappe</strong><small>Tageslauf & Verlauf</small></button><button type="button" class="desk-object object-map" disabled aria-describedby="location-note"><span class="object-illustration"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="m8 17 15-6 18 6 15-6v36l-15 6-18-6-15 6zM23 11v36m18-30v36"/><path d="M28 28c0-4 3-7 7-7s7 3 7 7c0 5-7 12-7 12s-7-7-7-12z"/><circle cx="35" cy="28" r="2"/></svg></span><strong>Wandkarte</strong><small>Standortwechsel</small></button></div><p id="location-note" class="office-note">Standortwechsel ist in diesem V3-Run noch nicht als Spielaktion verfügbar; die Karte bleibt bis zur Integration bewusst ohne Klickfunktion.</p></div><div class="office-footer"><span>Startseite</span><span>Nutze die Reiter unten auf dem Smartphone oder am oberen Rand am Desktop.</span></div></section>';
      workspace.prepend(nav); workspace.insertBefore(office, document.querySelector('.run-panel'));
      nav.addEventListener('click',event=>{const button=event.target.closest('[data-view-target]');if(button)activateGameView(button.dataset.viewTarget);});
      office.addEventListener('click',event=>{const button=event.target.closest('[data-view-target]');if(button)activateGameView(button.dataset.viewTarget);});
    }
    document.querySelector('.run-panel').dataset.gameView='office'; document.querySelector('.offer-gate').dataset.gameView='customers';
    if (!$('#management-root')) { const panel=document.createElement('section'); panel.id='management-root'; panel.className='panel management-panel'; panel.dataset.gameView='office'; $('#office-home').insertAdjacentElement('afterend',panel); }
    $('#learning-section').dataset.gameView='learning'; $('#own-products-root')?.setAttribute('data-game-view','operations');
    const customerGrid=$('#inbox').closest('.grid'); customerGrid.dataset.gameView='customers';
    const financeSection=$('#finance-summary').closest('section'); financeSection.dataset.gameView='finance'; financeSection.parentElement.dataset.gameView='finance';
    const competitorSection=$('#competitor-report').closest('section'); const macroSection=$('#macro-summary').closest('section');
    if(!$('#economy-view')) { const economy=document.createElement('div'); economy.id='economy-view'; economy.className='grid economy-view'; economy.dataset.gameView='economy'; macroSection.parentElement.insertBefore(economy,macroSection); economy.append(macroSection,competitorSection); }
    $('#event-log').closest('section').dataset.gameView='history';
    if (!$('#resource-config')) {
      const section = document.createElement('section'); section.className='panel'; section.id='resource-config'; section.dataset.gameView='resources';
      const occupationOptions = V3_METAL_OCCUPATIONS.map(row => '<option value="' + escapeHtml(row.id) + '">' + escapeHtml(row.label) + '</option>').join('');
      section.innerHTML = '<h2 id="resource-title">Startprofil auswählen</h2><div class="proposal-card" id="resource-proposal"><p>Wähle deinen Metallberuf und deinen beruflichen Hintergrund. Das Spiel trägt die dazugehörigen Fachkompetenzen, Anfangswerkzeuge und Zusatzqualifikationen automatisch ein. Nicht ausgewählte Maschinen oder Lizenzen werden nicht stillschweigend freigeschaltet.</p></div><div id="resource-summary" hidden></div><form id="resource-form" class="form-grid"><label>Metallberuf<select name="occupationId" required>' + occupationOptions + '</select></label><label>Beruflicher Hintergrund<select name="qualificationPath" required><option value="geselle-fachwirt" selected>Geselle/in + Wirtschaftsfachwirt/in</option><option value="meister">Meister/in im gewählten Beruf</option></select></label><p class="field-note wide" id="resource-profile-summary" aria-live="polite">Der Startspieler erhält die Berufsqualifikation und die für den gewählten Bildungsweg vorgesehenen Fähigkeiten. Maschinen, Schweißprüfungen, AEVO-Eignung und betriebliche Beauftragungen bleiben separate Voraussetzungen.</p><label class="proposal-confirm wide"><input type="checkbox" name="confirmResourceProposal" required><span>Ich bestätige das gewählte Startprofil und die automatisch erzeugten Anfangsressourcen.</span></label><p class="field-note wide">Die Auswahl wird mit diesem Lauf gespeichert und kann nach dem Start nicht geändert werden. Die Startmaterial- und Lagerwerte sind synthetische V3-Testannahmen.</p></form>';
      workspace.prepend(section);
    }
    if (!$('#own-products-root')) { const root = document.createElement('div'); root.id = 'own-products-root'; root.dataset.gameView='operations'; $('#learning-section').insertAdjacentElement('afterend', root); }
  };
  ensureControl();
  const resourceForm = $('#resource-form');
  const setupPanel = $('#setup-title')?.closest('.panel');
  if (setupPanel) { setupPanel.append($('#resource-config')); const startButton=startForm.querySelector('button[type=submit]'); if(startButton){startButton.id='launch-run'; startButton.setAttribute('form','start-form'); setupPanel.append(startButton);} }
  function render() {
    if (!run) return; ensureControl(); const learning = prepareRunLearningUi(run); run = learning.state; const projection = getRunProjection(run, financeState); const active = Boolean(run.activeDay); const nextDate = shiftDate(run.currentDate, 1);
    $('#management-root').innerHTML = renderManagementStrategy(run, financeState, managementDirection);
    $('#run-date').textContent = active ? run.activeDay.date : (run.currentDate < run.startDate ? `Start ${run.startDate}` : run.currentDate);
    $('#run-meta').innerHTML = [['Tagesphase',active?'Aktionen offen':'geschlossen']].map(([k,v])=>`<span class="meta-chip"><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</span>`).join('');
    $('#open-day').disabled = active || nextDate > run.endDate || !run.modules.product;
    $('#close-day').disabled = !active; $('#open-day').textContent = !run.modules.product ? 'Zuerst Anfangsressourcen erfassen' : (nextDate > run.endDate ? 'Laufzeitraum abgeschlossen' : 'Nächsten Simulationstag öffnen');
    const hasResources=Boolean(run.modules.product); $('#resource-config').hidden=false; $('#resource-title').textContent=hasResources?'Material & Inventar':'Startprofil auswählen'; $('#resource-proposal').hidden=hasResources; $('#resource-form').hidden=hasResources; $('#resource-summary').hidden=!hasResources; if(hasResources){const inv=run.modules.product; $('#resource-summary').innerHTML='<div class="resource-cards"><article><h3>Personal</h3><p>'+inv.people.map(x=>escapeHtml(x.displayName||x.id)+' · '+escapeHtml(x.qualificationTitle||x.role)+' · '+escapeHtml(x.hoursPerDay)+' h/Tag · '+escapeHtml(Object.entries(x.skillLevels||{}).map(([k,v])=>getV3CompetencyLabel(k)+' Stufe '+v).join(', ')||'keine Skills')).join('</p><p>')+'</p></article><article><h3>Maschinen</h3><p>'+inv.equipment.map(x=>escapeHtml(x.name||x.id)+' · '+escapeHtml(x.hoursPerDay)+' h/Tag · '+escapeHtml(x.capabilities.join(', ')||'keine Fähigkeiten')).join('</p><p>')+'</p></article><article><h3>Lagerbestand</h3><p>'+inv.materials.map(x=>escapeHtml(x.id)+' · '+escapeHtml(x.quantity)+' Einheiten').join('</p><p>')+'</p><p>Fertigwaren-Lager: '+escapeHtml(inv.finishedGoodsUsed)+' / '+escapeHtml(inv.finishedGoodsCapacity)+' Plätze belegt</p></article></div><p class="field-note">Personal und Maschinen zeigen die bestätigten Anfangsressourcen; Lagerbewegungen und Sendungen folgen unten.</p>'+renderInternationalMaterialSupplyUi(inv, active ? run.activeDay.date : run.currentDate, active)+renderEquipmentInstructionPanel(run, inv, active);}
    $('#learning-section').innerHTML = learning.html;
    const productRoot = $('#own-products-root');
    if (productRoot) productRoot.innerHTML = renderOwnProducts(run.modules.product, run.modules.market, active);
    $('#inbox-count').textContent=String(projection.playerView.inquiries.length); $('#inbox').className=`stack${projection.playerView.inquiries.length?'':' empty'}`; $('#inbox').innerHTML=projection.playerView.inquiries.length?projection.playerView.inquiries.map(row=>inquiryCard(row,active,run.fxOfferPlanFixtureId===V3_FX_OFFER_PLAN_FIXTURE_ID,run.runId,run.activeDay?.date??projection.currentDate)).join(''):'Noch keine Anfrage eingegangen.';
    $('#work-count').textContent=String(projection.workOrders.length); $('#work-orders').className=`stack${projection.workOrders.length?'':' empty'}`; $('#work-orders').innerHTML=renderWorkOrderList(projection,active);
    const finance = renderFinanceDisplay(financeState, run); financeWarning = financeState ? null : (financeWarning ?? finance.display.warning ?? null);
    $('#finance-count').textContent=`${finance.display.initialized ? `${finance.display.invoices.length} Kundenrechnung(en) · ${finance.display.supplierInvoices.length} Lieferantenposten` : 'nicht initialisiert'}`; $('#finance-count').className=`tag${finance.display.initialized?'':' pending'}`;
    $('#finance-summary').innerHTML=financeState ? finance.summaryHtml : `<p class="field-note" role="status">${escapeHtml(financeWarning)}</p>`; $('#scenario-invoices').className=`stack${finance.display.initialized && finance.display.invoices.length?'':' empty'}`; $('#scenario-invoices').innerHTML=finance.invoiceHtml; if ($('#supplier-ap')) { $('#supplier-ap').className=`stack${finance.display.initialized && finance.display.supplierInvoices.length?'':' empty'}`; $('#supplier-ap').innerHTML=finance.supplierApHtml; } if ($('#customer-receipts')) { $('#customer-receipts').className=`stack${finance.display.initialized && finance.display.receipts.length?'':' empty'}`; $('#customer-receipts').innerHTML=finance.receiptHtml; }
    $('#finance-handoffs').className=`stack${projection.financeHandoffs.length?'':' empty'}`; $('#finance-handoffs').innerHTML=renderFinanceHandoffs(projection);
    $('#competitor-report').className=`stack${projection.report.length?'':' empty'}`; $('#competitor-report').innerHTML=projection.report.length?projection.report.map(reportCard).join(''):'Für diesen Monat liegen noch keine Wettbewerbsgebote vor.';
    $('#macro-summary').innerHTML=renderMacroSummary(run.modules.macro, run.modules.market, projection);
    $('#event-count').textContent=String(projection.dayEvents.length); $('#event-log').className=`event-list${projection.dayEvents.length?'':' empty'}`; $('#event-log').innerHTML=projection.dayEvents.length?projection.dayEvents.map(eventItem).join(''):'<li>Noch keine Tage ausgeführt.</li>'; renderRunContext(run); activateGameView(activeGameView);
  }
  startForm.addEventListener('input', event => { if (event.target.name !== 'confirmSyntheticAssumptions') startForm.elements.namedItem('confirmSyntheticAssumptions').checked = false; });
  startForm.addEventListener('change', event => { if (event.target.name !== 'confirmSyntheticAssumptions') startForm.elements.namedItem('confirmSyntheticAssumptions').checked = false; });
  startForm.addEventListener('submit', event=>{ event.preventDefault(); if(!resourceForm.reportValidity()) return; try { run=createRunFromInputs(Object.fromEntries(new FormData(startForm))); financeState=createFinanceStateForRun(run); const setup=Object.fromEntries(new FormData(resourceForm)); const startingResources=createV3StartingResources(setup.occupationId,setup.qualificationPath); run=installRunOperatingResources(run,{...startingResources,finishedGoodsCapacity:10,finishedGoodsUsed:0}); financeWarning=financeState?null:'Für diesen Starttermin ist kein D-0152-Finanzmapping bestätigt; es wurde kein Anfangsbestand angenommen.'; workspace.hidden=false; workspace.append($('#resource-config')); enterRunWorkspace(); runStatus.textContent='Lauf bereit'; runStatus.className='tag'; render(); status.textContent='Lauf gestartet. Testannahmen und Anfangsressourcen wurden vor dem ersten Simulationstag bestätigt.'; } catch(error){status.textContent=error.message;} });
  document.addEventListener('click', event => {
    const add = event.target.closest?.('.product-cost-line-add');
    const remove = event.target.closest?.('.product-cost-line-remove');
    if (add) {
      const form = add.closest('.product-cost-form'); const container = add.closest('.product-cost-lines');
      if (!form || !container) return;
      const row = document.createElement('div'); row.innerHTML = renderV3ProductCostLine(container.querySelectorAll('.product-cost-line').length);
      container.insertBefore(row.firstElementChild, add); return;
    }
    if (remove) {
      const line = remove.closest('.product-cost-line');
      if (line) line.remove();
    }
  });
  document.addEventListener('input', event => {
    const input = event.target;
    if (!input.matches?.('[name="costLineAmountEuro"]')) return;
    const output = input.closest('.product-cost-line')?.querySelector('[data-rounding-result]');
    if (!output) return;
    try { output.textContent = `${euroToCents(input.value)} ct`; }
    catch { output.textContent = 'Ungültiger Betrag'; }
  });
  document.addEventListener('input', event => {
    const target = event.target;
    const form = target.form;
    if (!form?.matches('.product-sale-form') || target.name !== 'netPrice') return;
    const preview = form.querySelector('[data-product-sale-estimate]');
    if (!preview) return;
    try {
      const result = calculateV3ProductSaleOfferPreview(run.modules.product, form.elements.namedItem('productId').value, target.value);
      preview.dataset.offerPriceCents = String(result.netPriceCents);
      preview.textContent = `Angebotsrechnung (Snapshot-Vorschau, Plan – nicht Ist) bei ${euro(result.netPriceCents)} netto: DB I ${euro(result.calculation.dbICents)}, Ergebnis nach direkten Kosten ${euro(result.calculation.resultAfterDirectCostsCents)}, Vollkosten/BAB ausstehend. Die Planrechnung oben bleibt unverändert.`;
    } catch (error) {
      delete preview.dataset.offerPriceCents;
      preview.textContent = `Angebotskalkulation nicht verfügbar: ${error.message}`;
    }
  });  document.addEventListener('input', event => { if (event.target.form?.id === 'resource-form' && event.target.name !== 'confirmResourceProposal') $('#resource-form').elements.namedItem('confirmResourceProposal').checked = false; });
  document.addEventListener('change', event => { if (event.target.form?.id === 'resource-form' && event.target.name !== 'confirmResourceProposal') $('#resource-form').elements.namedItem('confirmResourceProposal').checked = false; });
  document.addEventListener('click', event => {
    handleInternationalMaterialReceiptClick(event, { run, setRun: value => { run = value; }, financeState, setFinanceState: value => { financeState = value; }, render, setStatus: value => { status.textContent = value; } });
  });
  document.addEventListener('click', event => {
    const cancelButton = event.target?.closest?.('.supplier-ap-payment-cancel');
    if (cancelButton) {
      const confirmation = cancelButton.closest('details');
      if (confirmation) confirmation.open = false;
      status.textContent = 'Dispoabruf abgebrochen; es wurde keine Zahlung ausgeführt.';
      return;
    }
    const button = event.target?.closest?.('.supplier-ap-payment, .supplier-ap-payment-dispo');
    if (!button) return;
    const drawFromDispo = button.classList.contains('supplier-ap-payment-dispo');
    try {
      financeState = executeSupplierApPayment(financeState, run, button.dataset.invoice, { drawFromDispo });
      render();
      status.textContent = drawFromDispo
        ? `Dispoabruf über ${euro(Number(button.dataset.shortfall))} und vollständige Lieferantenzahlung ausgeführt. Offener Posten und Bankbestand wurden abgeglichen.`
        : 'Lieferantenrechnung vollständig bezahlt. Der offene Lieferantenposten und das Bankguthaben wurden aktualisiert.';
    } catch (error) { status.textContent = error.message; }
  });
  document.addEventListener('click', event=>{ const target=event.target; try { if(target.id==='save-run' && run){const payload=createRunSaveEnvelope(run,financeState);const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const href=URL.createObjectURL(blob);const link=document.createElement('a');link.href=href;link.download=`werkstatt-v3-${run.scenarioId.replace(/[^a-z0-9_-]/gi,'-')}-${run.currentDate}.json`;link.click();URL.revokeObjectURL(href);status.textContent='Run und Finanzzustand als JSON-Datei gesichert.';} else if(target.id==='load-run'){ $('#load-run-file').click(); } else if(target.matches('.learning-option')){ const answer=answerRunLearning(run,target.dataset.learningEvent,target.dataset.learningOption,target.closest('[data-learning-date]')?.dataset.learningDate ?? learningDate(run)); run=answer.state; render(); status.textContent=`Antwort ${answer.result.correct ? 'richtig' : 'nicht richtig'}. ${learningEffectText(answer.result.trace)}`; } else if(target.id==='open-day'){ const opened=openNextRunDay(run); const paymentRun=processRunDayCustomerReceipts(financeState,opened.result.date); run=opened.state; financeState=paymentRun.financeState; render(); status.textContent=`Tag ${opened.result.date} geöffnet. ${opened.result.receivedInquiryIds.length} neue Anfragen; ${paymentRun.receipts.length} fällige Kundenzahlung(en) eingegangen. Angebote und Arbeitsaktionen können bearbeitet werden.`; } else if(target.id==='close-day'){ const closed=closeRunDay(run); run=closed.state; let created=[]; let invoiceError=null; try { const invoiced=issueAcceptedScenarioInvoices(run,financeState); financeState=invoiced.financeState; created=invoiced.invoiceIds; } catch(error) { invoiceError=error.message; } render(); status.textContent=invoiceError?`Tag ${closed.result.date} abgeschlossen. Szenario-Rechnung blieb ausstehend: ${invoiceError}`:created.length?`Tag ${closed.result.date} abgeschlossen. ${created.length} vereinfachte Szenario-Rechnung(en) aus positiver Kundenentscheidung erstellt; keine Zahlung gebucht.`:`Tag ${closed.result.date} abgeschlossen. ${closed.result.expiredInquiryIds.length} Anfragen sind abgelaufen.`; } else if(target.matches('.step-complete')){ const done=completeRunOrderStep(run,target.dataset.order,target.dataset.operation); run=done.state; render(); status.textContent=`Arbeitsschritt ${target.dataset.operation} abgeschlossen. Materialverbrauch wurde einmalig erfasst; keine Lieferung oder Buchung ausgelöst.`; } } catch(error){status.textContent=error.message;} });
  $('#load-run-file').addEventListener('change', async event=>{const file=event.target.files?.[0];if(!file)return;try{const restored=restoreRunSaveEnvelope(JSON.parse(await file.text()));run=restored.runState;financeState=restored.financeState;financeWarning=restored.financeWarning;workspace.hidden=false;enterRunWorkspace();runStatus.textContent='Gesicherter Lauf geladen';runStatus.className='tag';render();status.textContent=financeWarning ?? 'Run und Finanzzustand aus der Sicherungsdatei geladen.';}catch(error){status.textContent=`Sicherung konnte nicht geladen werden: ${error.message}`;}finally{event.target.value='';}});
  document.addEventListener('click', event => {
    const answerButton = event.target.closest('.inquiry-practice-option');
    if (answerButton) {
      try {
        const inquiryId = answerButton.dataset.inquiryId;
        const currentDate = run?.activeDay?.date ?? run?.currentDate;
        const inquiry = getV3MarketPlayerView(run.modules.market).inquiries.find(row => row.inquiryId === inquiryId);
        const result = evaluateInquiryPractice(inquiry, currentDate, answerButton.dataset.inquiryPracticeAnswer);
        const previous = readInquiryPracticeProgress(run.runId, inquiryId);
        const progress = { ...result, attemptCount: (Number(previous?.attemptCount) || 0) + 1 };
        saveInquiryPracticeProgress(run.runId, inquiryId, progress);
        const card = [...document.querySelectorAll('#inbox [data-inquiry-card]')].find(node => node.dataset.inquiryCard === inquiryId);
        if (card) {
          const wasOpen = card.querySelector('.inquiry-practice')?.open ?? true;
          const latestDate = run?.activeDay?.date ?? run?.currentDate;
          const latest = getV3MarketPlayerView(run.modules.market).inquiries.find(row => row.inquiryId === inquiryId);
          const shell = document.createElement('div');
          shell.innerHTML = inquiryCard(latest, Boolean(run.activeDay), run.fxOfferPlanFixtureId === V3_FX_OFFER_PLAN_FIXTURE_ID, run.runId, latestDate);
          const replacement = shell.firstElementChild;
          card.replaceWith(replacement);
          const details = replacement?.querySelector('.inquiry-practice');
          if (details && wasOpen) details.open = true;
        }
        status.textContent = result.correct ? 'Richtig: Die Anfrage bleibt eine unverbindliche Anfrage; Frist, Fähigkeiten und Kapazität sind geprüft. Der Unternehmenslauf wurde nicht geändert.' : 'Antwort geprüft. Lies die Rückmeldung und prüfe Status, Frist und Fertigungsanforderungen. Der Unternehmenslauf wurde nicht geändert.';
      } catch (error) { status.textContent = error.message; }
      return;
    }
    if (event.target.closest('[data-inquiry-practice-return]')) {
      event.target.closest('.inquiry-practice')?.removeAttribute('open');
    }
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (handleInternationalMaterialOrderSubmit(event, { run, setRun: value => { run = value; }, render, setStatus: value => { status.textContent = value; } })) return;
    if (!form.matches('.fx-offer-plan-form')) return;
    event.preventDefault();
    const output = form.querySelector('.fx-preview-output');
    try {
      const values = Object.fromEntries(new FormData(form));
      const result = previewRunOfferFxPlan(run, {
        inquiryId: form.dataset.inquiry,
        planId: 'T0070-IMPORT-PLAN-1',
        planBasisCents: euroToCents(values.planBasisEuros),
        playerNetPriceCents: null,
        planBasisCurrency: 'EUR',
        importCurrency: 'USD',
        importExposureFactor: Number(values.importExposureFactor),
      });
      output.innerHTML = renderRunOfferFxPreview(result);
      status.textContent = result.status === 'ready' ? 'Synthetische FX-Planvorschau berechnet; Angebotsbetrag und Run-Zustand blieben unverändert.' : result.status === 'blocked' ? `FX-Planvorschau gesperrt: ${result.reason}` : `Keine FX-Planwirkung: ${result.reason}`;
    } catch (error) {
      output.innerHTML = renderRunOfferFxPreview({ status: 'blocked', reason: error.message });
      status.textContent = `FX-Planvorschau nicht berechnet: ${error.message}`;
    }
  });
  document.addEventListener('submit', event=>{ if(event.target.matches('.delivery-form')){event.preventDefault();try{const form=event.target;const delivered=submitRunDelivery(run,form.dataset.order,Object.fromEntries(new FormData(form)));run=delivered.state;render();status.textContent='Geliefert; Kunden-/Empfängerentscheidung ausstehend. Keine Abnahme oder Finanzbuchung ausgelöst.';}catch(error){status.textContent=error.message;}} else if(event.target.matches('.offer-form')){event.preventDefault();try{ const form=event.target; const inquiry=getV3MarketPlayerView(run.modules.market).inquiries.find(row=>row.inquiryId===form.dataset.inquiry); const values=Object.fromEntries(new FormData(form)); const { scope, quantity, unit, qualityTarget, acceptanceCriteria, deliveryDate, ...offerValues } = values; const commercialTerms={version:V3_COMMERCIAL_TERMS_VERSION,scope:scope.trim(),quantity:Number(quantity),unit,qualityTarget,acceptanceCriteria:acceptanceCriteria.trim(),deliveryDate,contractClassification:structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION),acceptanceScenario:structuredClone(V3_D0157_F3_CONDITION)}; const sent=submitRunOffer(run,inquiry,{...offerValues,commercialTerms}); run=sent.state; render(); status.textContent=`${sent.isRevision?"Änderungsfassung":"Angebot"} abgegeben. Rechnerischer DB I: ${euro(sent.calculation.dbICents)}; Vollkosten/BAB bleiben ausstehend. Kundenentscheidung steht aus.`;}catch(error){status.textContent=error.message;} } else if(event.target.matches('.plan-form')){event.preventDefault();try{const form=event.target;const order=run.customerWorkOrders.find(row=>row.workOrderId===form.dataset.order);const values=Object.fromEntries(new FormData(form));const result=planRunOrder(run,order,{contractFields:values,operationsJson:values.operationsJson});run=result.state;render();status.textContent=`Arbeitsplan erfasst und gegen Personal, Maschinen, Material und Vorgänger geprüft. Finanzstatus bleibt nicht gebucht.`;}catch(error){status.textContent=error.message;}} });
  document.addEventListener('submit', event=>{const form=event.target;try{if(form.matches('.product-actual-cost-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));const refs=name=>v[name].split(',').map(x=>x.trim()).filter(Boolean);const input={layerId:`COST-LOT|${run.runId}|${v.productId}|${v.productionDate}`,productId:v.productId,productionDate:v.productionDate,costComponentsCents:{materials:euroToCents(v.materialsCostEuros),directLabor:euroToCents(v.directLaborCostEuros),machine:euroToCents(v.machineCostEuros),manufacturingOverhead:euroToCents(v.manufacturingOverheadCostEuros)},componentSourceRefs:{materials:refs('materialsSources'),directLabor:refs('directLaborSources'),machine:refs('machineSources'),manufacturingOverhead:refs('manufacturingOverheadSources')},productionSourceRefs:parseV3ProductJsonInput(v.productionSourceRefs,'Produktionsquellen')};const saved=recordV3RunProductCostLayer(run,input);run=saved.state;validateV3RunState(run);render();status.textContent=`Nichtbuchender FIFO-Kostenbeleg über ${euro(saved.result.layer.totalCostCents)} gespeichert. ${saved.result.layer.quantityOriginal} Stück, Quelle ${saved.result.layer.layerId}.`;}else if(form.matches('.product-actual-cost-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));const refs=name=>v[name].split(',').map(x=>x.trim()).filter(Boolean);const input={layerId:`COST-LOT|${run.runId}|${v.productId}|${v.productionDate}`,productId:v.productId,productionDate:v.productionDate,costComponentsCents:{materials:euroToCents(v.materialsCostEuros),directLabor:euroToCents(v.directLaborCostEuros),machine:euroToCents(v.machineCostEuros),manufacturingOverhead:euroToCents(v.manufacturingOverheadCostEuros)},componentSourceRefs:{materials:refs('materialsSources'),directLabor:refs('directLaborSources'),machine:refs('machineSources'),manufacturingOverhead:refs('manufacturingOverheadSources')},productionSourceRefs:parseV3ProductJsonInput(v.productionSourceRefs,'Produktionsquellen')};const saved=recordV3RunProductCostLayer(run,input);run=saved.state;validateV3RunState(run);render();status.textContent=`Nichtbuchender FIFO-Kostenbeleg über ${euro(saved.result.layer.totalCostCents)} gespeichert. ${saved.result.layer.quantityOriginal} Stück, Quelle ${saved.result.layer.layerId}.`;}else if(form.matches('.product-sale-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));const product=run.modules.product.products.find(row=>row.productId===v.productId);if(!product?.costEstimate?.calculation)throw new Error('Erst eine Produktkalkulation mit expliziten direkten Kosten speichern.');const player=run.modules.market.firms.find(row=>row.role==='player');const buyer=run.modules.market.inquiries.find(row=>row.inquiryId===v.inquiryId)?.customerId;if(!player||buyer!==v.buyerPartyId)throw new Error('Buyer must come from the matching open customer inquiry.');const saleResult=submitV3RunProductSaleOffer(run,{saleId:`SALE|${encodeURIComponent(run.runId)}|${encodeURIComponent(v.inquiryId)}|${encodeURIComponent(v.productId)}`,productId:v.productId,sellerPartyId:player.firmId,buyerPartyId:v.buyerPartyId,inquiryId:v.inquiryId,quantity:Number(v.quantity),offerDate:run.activeDay.date,decisionDate:v.decisionDate,netPriceCents:euroToCents(v.netPrice),offerSnapshotId:`PRODUCT-PLAN|${product.costEstimate.costVersion}|${product.costEstimate.estimatedAt}|${product.costEstimate.modelVersion}`});run=saleResult.state;validateV3RunState(run);const savedOffer=run.modules.product.productSales.find(row=>row.saleId===saleResult.result.saleId);const offerCalculation=savedOffer.offerSnapshot.calculation;render();status.textContent=`Produktangebot gespeichert. Snapshot-DB I ${euro(offerCalculation.dbICents)}; Vollkosten/BAB bleiben ausstehend. Nur der benannte Käufer kann am Entscheidungstag annehmen oder ablehnen.`;}else if(form.matches('.product-create-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));const archetype=getV3ProductArchetype(v.archetypeId);if(!archetype)throw new Error('Bitte eine Produktidee wählen.');const gaps=getV3RequirementGaps(run.modules.product.people,run.modules.product.equipment,archetype.requirements);if(!gaps.eligible)throw new Error('Für diese Produktidee fehlen: '+formatV3RequirementGaps(gaps).join(', '));const product=run.modules.product;run=structuredClone(run);const brief={assignedPersonId:v.assignedPersonId,customerBenefit:v.customerBenefit.trim(),targetPriceCents:euroToCents(v.targetPrice),qualityTarget:v.qualityTarget,targetSegment:archetype.targetSegment};run.modules.product=createV3Product(product,{productId:'PRODUCT-'+archetype.id.toUpperCase()+'-'+(product.products.length+1),name:archetype.label,targetSegment:archetype.targetSegment,marketCapabilities:[archetype.marketCapability],unitStorage:archetype.unitStorage,recipe:archetype.recipe,archetypeId:archetype.id,productionRequirements:archetype.requirements,managementBrief:brief});validateV3RunState(run);render();status.textContent='Management-Briefing gespeichert. Das Briefing ist dem ausgewählten Teammitglied zugeordnet; Dauer- und Qualitätsprognose bleiben bis zur Teamvorschau offen. Noch keine Produktions- oder Finanzwirkung.';}else if(form.matches('.product-steps-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));run=structuredClone(run);run.modules.product=defineV3ProductSteps(run.modules.product,v.productId.trim(),parseV3ProductJsonInput(v.stepsJson,'Produktionsschritte'));validateV3RunState(run);render();status.textContent='Produktionsschritte und Vorgängerfolge gespeichert.';}else if(form.matches('.product-cost-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));run=structuredClone(run);run.modules.product=estimateV3Product(run.modules.product,v.productId.trim(),{netPriceCents:euroToCents(v.netPrice),directCosts:readV3ProductCostLines(form),costVersion:v.costVersion.trim()});validateV3RunState(run);render();status.textContent='DB-I-Planrechnung gespeichert. Vollkosten/BAB bleiben bis zu einer späteren Version ausstehend; keine Buchungswirkung.';}else if(form.matches('.product-step-plan-form')){event.preventDefault();const v=Object.fromEntries(new FormData(form));run=structuredClone(run);run.modules.product=planV3ProductStep(run.modules.product,{productId:v.productId.trim(),stepId:v.stepId.trim(),date:v.date,personId:v.personId.trim(),equipmentId:v.equipmentId.trim()||null,outputQuantity:Number(v.outputQuantity),materialQuantities:parseV3ProductJsonInput(v.materialQuantitiesJson,'Materialmengen')});validateV3RunState(run);render();status.textContent='Produktionsschritt gegen gemeinsame Person-, Maschinen-, Material- und Lagerkapazität eingeplant.';}}catch(error){status.textContent=error.message;}});
  document.addEventListener("submit",e=>{const f=e.target;if(!f.matches(".equipment-instruction-plan-form"))return;e.preventDefault();try{const id=f.dataset.id;const r=planV3RunEquipmentInstruction(run,{instructionId:id,personId:f.dataset.person,equipmentId:f.dataset.equipment,plannedDate:new FormData(f).get("plannedDate"),sourceRef:"instruction:"+id});run=r.state;validateV3RunState(run);render();status.textContent="Arbeitsblock eingeplant; Kapazität reserviert. Das Nutzungs-Gate bleibt bis zum Abschluss geschlossen.";}catch(err){status.textContent=err.message;}});
  document.addEventListener("click",e=>{const c=e.target.closest(".equipment-instruction-complete"),a=e.target.closest(".equipment-special-authorization");try{if(c){const r=completeV3RunEquipmentInstruction(run,{instructionId:c.dataset.id});run=r.state;validateV3RunState(run);render();status.textContent="Unterweisung am geplanten Simulationstag abgeschlossen; Nachweis ist aktiv.";}else if(a){const id=a.dataset.id;const r=recordV3RunSpecialEquipmentAuthorization(run,{authorizationId:id,personId:a.dataset.person,equipmentId:a.dataset.equipment,requirementRef:a.dataset.hazard,completedAt:run.activeDay.date,sourceRef:"authorization:"+id});run=r.state;validateV3RunState(run);render();status.textContent="Sonderbeauftragung dokumentiert. Allgemeine Skills bleiben unverändert.";}}catch(err){status.textContent=err.message;}});
  document.addEventListener("input",event=>{const input=event.target;if(!input.matches(".counter-response-form [name=netPrice]"))return;const form=input.closest(".counter-response-form");const button=form?.querySelector('button[type="submit"]');if(!button)return;const normalized=input.value.trim().replace(/\s/g,"").replace(",",".");const value=Number(normalized);const cents=Math.round(value*100);if(!Number.isFinite(value)||!Number.isSafeInteger(cents)){button.textContent="Preis prüfen";return;}const counterPrice=Number(form.dataset.counterPriceCents);button.textContent=cents===counterPrice?"Kunden-Gegenangebot annehmen · Vertrag sofort schließen":cents<counterPrice?"Niedrigeren Preis anbieten · Entscheidung in 1–3 Tagen":"Preis über Kundenangebot · wird abgelehnt";});
  document.addEventListener("submit",event=>{const form=event.target;if(!form.matches(".counter-response-form"))return;event.preventDefault();try{if(!run?.activeDay)throw new Error("Öffne zuerst den Simulationstag.");const values=Object.fromEntries(new FormData(form));const inquiry=getV3MarketPlayerView(run.modules.market).inquiries.find(row=>row.inquiryId===values.inquiryId);if(!inquiry?.negotiation||inquiry.negotiation.negotiationId!==values.negotiationId)throw new Error("Die Verhandlung ist nicht mehr offen.");const sent=submitRunOffer(run,inquiry,{netPrice:values.netPrice,costProfile:values.costProfile,commercialTerms:inquiry.ownOffer?.commercialTerms??null,counterNegotiationId:values.negotiationId});run=sent.state;validateV3RunState(run);render();status.textContent=sent.result?.contractCreated===true?"Kunden-Gegenangebot angenommen. Vertrag sofort geschlossen und Auftrag angelegt; keine Finanzwirkung vor den getrennten Leistungs-/Rechnungsereignissen.":sent.result?.status==="rejected"?"Preis oberhalb des Kunden-Gegenangebots: Die Verhandlung wurde abgelehnt.":"Niedrigeres Preisangebot mit unveränderten Vertragsbedingungen eingereicht. Der Kunde entscheidet in 1–3 Simulationstagen; bis zur Annahme entsteht kein Auftrag oder Finanzposten.";}catch(error){status.textContent=error.message;}});
  document.addEventListener('submit',event=>{if(!event.target.matches('.plan-auto-form'))return;event.preventDefault();try{const workOrder=run.customerWorkOrders.find(row=>row.workOrderId===event.target.dataset.order);const result=planRunOrderAutomatically(run,workOrder);run=result.state;render();status.textContent=`Systemplan erstellt: ${result.generatedPlan.operations.length} Arbeitsschritte, ${result.generatedPlan.workloadHours} modellierte Stunden. Fähigkeiten, Maschine, Material, Lagerkapazität und Liefertermin wurden geprüft.`;}catch(error){status.textContent=error.message;}});
  document.addEventListener('click',event=>{const button=event.target.closest('.product-sale-dispatch');if(!button)return;try{if(!run?.activeDay)throw new Error('Öffne zuerst den Simulationstag.');const saleId=button.dataset.saleId;const date=run.activeDay.date;const dispatchId='PRODUCT-DISPATCH|'+encodeURIComponent(run.runId)+'|'+encodeURIComponent(saleId)+'|'+date;const outcome=dispatchV3RunProductSale(run,{saleId,dispatchId,date,sourceRef:'product-dispatch-ui|'+encodeURIComponent(run.runId)+'|'+encodeURIComponent(saleId)+'|'+date});run=outcome.state;validateV3RunState(run);render();status.textContent=outcome.duplicate?'Versand war bereits erfasst; Bestand wurde nicht erneut verändert.':'Versand erfasst; der physische FIFO-Bestandsabgang ist abgestimmt. Vollständiges COGS bleibt bis zur späteren BAB-/Kostensatzbasis ausstehend; Versand, Umsatz- und Hauptbuchstatus bleiben davon getrennt.';}catch(error){status.textContent=error.message;}});
  document.addEventListener('click',event=>{const button=event.target.closest('.product-sale-decision');if(!button)return;try{const buyerDecision=recordV3RunProductSaleBuyerDecision(run,{saleId:button.dataset.saleId,buyerPartyId:button.dataset.buyer,decisionDate:run.activeDay.date,accepted:button.dataset.accepted==='true',decisionRef:`buyer-action|${run.runId}|${button.dataset.saleId}|${run.activeDay.date}`});run=buyerDecision.state;validateV3RunState(run);render();status.textContent=button.dataset.accepted==='true'?'Käufer hat angenommen: Menge ist reserviert; Fertigware bleibt bis zum expliziten Versand im Lager. Geldwirkung bleibt offen.':'Käufer hat abgelehnt: Bestand bleibt im Lager.';}catch(error){status.textContent=error.message;}});
  document.addEventListener('click',event=>{const target=event.target;if(!target.matches('.product-step-complete'))return;try{if(!run?.activeDay)throw new Error('Öffne zuerst den Simulationstag.');run=structuredClone(run);run.modules.product=completeV3ProductStep(run.modules.product,target.dataset.assignment);validateV3RunState(run);render();status.textContent='Produktionsschritt abgeschlossen. Verbrauch und Fertigwarenzugang sind mengenmäßig erfasst; keine Erlös-, COGS- oder Buchungswirkung.';}catch(error){status.textContent=error.message;}});
  document.addEventListener('change', event => { if (event.target.id !== 'management-direction' || !run) return; managementDirection=event.target.value; render(); status.textContent='Unternehmensausrichtung für diese Sitzung aktualisiert. Die belegten Kennzahlen bleiben unverändert.'; });
  document.addEventListener('submit',event=>{const form=event.target;if(!form.matches('.synthetic-skill-course-form'))return;event.preventDefault();try{if(!run?.activeDay)throw new Error('Öffne zuerst den Simulationstag.');const values=Object.fromEntries(new FormData(form));const next=structuredClone(run);next.modules.product=completeV3SyntheticSkillCourse(next.modules.product,{completionId:`TRAINING|${run.runId}|${values.courseId}|${values.personId}`,courseId:values.courseId,personId:values.personId});validateV3RunState(next);run=next;render();status.textContent='Spielkompetenz im aktuellen Lauf erworben. Keine reale Qualifikation, Berechtigung, Maschine, Arbeitszeit oder Finanzwirkung wurde erzeugt.';}catch(error){status.textContent=error.message;}});
}
if (typeof document !== 'undefined') init();
