import { V3_PRODUCT_ARCHETYPES } from './v3-occupational-competencies.js';
import { V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';

const PLANNER_VERSION = 'V3-MANAGEMENT-ORDER-PLANNER-1';
const clone = value => structuredClone(value);
const fail = message => { const error = new Error(message); error.code = 'work_plan_unavailable'; throw error; };
const isWorkday = date => { const day = new Date(`${date}T12:00:00Z`).getUTCDay(); return day > 0 && day < 6; };
const shiftDate = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const workdaysThrough = (start, end) => { const result = []; for (let date = start; date <= end; date = shiftDate(date, 1)) if (isWorkday(date)) result.push(date); return result; };
const skillLevel = (person, id) => Number(person.skillLevels?.[id] ?? (person.skills?.includes(id) ? 2 : 0));
const hasProfile = (person, equipment, profile) => profile.requirements.skills.every(row => skillLevel(person, row.id) >= row.level)
  && profile.requirements.qualifications.every(id => person.qualifications?.includes(id))
  && profile.requirements.equipment.every(id => equipment.capabilities?.includes(id));

/** Deterministic synthetic conversion of accepted management terms into resource-checked operation blocks. */
export function buildV3ManagementOrderPlan(runState, workOrder) {
  const product = runState?.modules?.product;
  const terms = workOrder?.contractTermsSnapshot;
  if (!runState?.activeDay || !product || !terms) fail('Für diesen Altauftrag fehlen angenommene Angebotsbedingungen oder die Personal-/Maschinendaten.');
  const inquiry = runState.modules.market?.inquiries?.find(row => row.inquiryId === workOrder.inquiryId);
  if (!inquiry || !Array.isArray(inquiry.requiredCapabilities) || !inquiry.requiredCapabilities.length) fail('Für den Auftrag liegen keine Fertigungsanforderungen vor.');
  if (!Number.isFinite(terms.quantity) || terms.quantity <= 0 || !['pieces', 'sets', 'lots'].includes(terms.unit)) fail('Der automatische Planer benötigt eine unterstützte Menge und Einheit.');
  const due = terms.deliveryDate;
  const dates = workdaysThrough(product.currentDate, due);
  if (!dates.length) fail(`Bis zum vereinbarten Liefertermin ${due} steht kein Arbeitstag mehr zur Verfügung.`);
  const freeStorage = product.finishedGoodsCapacity - product.finishedGoodsUsed;
  if (terms.quantity > freeStorage) fail(`Lagerkapazität für Fertigware reicht nicht: benötigt ${terms.quantity}, frei ${Math.max(0, freeStorage)}.`);

  const requirements = [...new Set(inquiry.requiredCapabilities)].map(capability => {
    const profiles = V3_PRODUCT_ARCHETYPES.filter(row => row.marketCapability === capability).sort((a, b) => a.id.localeCompare(b.id));
    if (!profiles.length) fail(`Für die Anforderung „${capability}“ fehlt ein hinterlegtes Kompetenz- und Maschinenprofil.`);
    const match = profiles.flatMap(profile => product.people.flatMap(person => product.equipment
      .filter(equipment => hasProfile(person, equipment, profile))
      .map(equipment => ({ capability, profile, person, equipment }))))
      .sort((a, b) => a.profile.id.localeCompare(b.profile.id) || a.person.id.localeCompare(b.person.id) || a.equipment.id.localeCompare(b.equipment.id))[0];
    if (!match) fail(`Für „${capability}“ fehlen qualifiziertes Personal, erforderliche Zusatzqualifikationen oder passende Maschinen.`);
    return match;
  });
  const workloadHours = Math.max(Number(inquiry.requiredCapacity) || 0, requirements.length);
  const hoursPerStage = workloadHours / requirements.length;
  const recipeProfile = requirements[0].profile;
  const materialNeeds = recipeProfile.recipe.reduce((result, line) => { result[line.materialId] = (result[line.materialId] ?? 0) + line.quantityPerUnit * terms.quantity; return result; }, {});
  for (const [materialId, quantity] of Object.entries(materialNeeds)) {
    const material = product.materials.find(row => row.id === materialId);
    const reserved = [...product.assignments, ...(product.customerAssignments ?? [])].filter(row => row.status === 'planned').reduce((sum, row) => sum + (row.materials?.[materialId] ?? 0), 0);
    if (!material || material.quantity - reserved < quantity) fail(`Material ${materialId} reicht für den modellierten Auftrag nicht aus (benötigt ${quantity}, frei ${Math.max(0, (material?.quantity ?? 0) - reserved)}).`);
  }

  const local = [];
  let predecessor = null;
  for (let stageIndex = 0; stageIndex < requirements.length; stageIndex += 1) {
    const { capability, profile, person, equipment } = requirements[stageIndex];
    let remaining = hoursPerStage;
    let blockIndex = 0;
    while (remaining > 1e-8) {
      let selected = null;
      for (const date of dates) {
        const rows = [...product.commitments, ...product.assignments, ...(product.customerAssignments ?? []), ...local].filter(row => row.date === date && row.status !== 'cancelled');
        const personUsed = rows.reduce((sum, row) => sum + (row.personId === person.id ? row.hours : 0), 0);
        const equipmentUsed = rows.reduce((sum, row) => sum + (row.equipmentId === equipment.id ? row.hours : 0), 0);
        const room = Math.min(person.hoursPerDay - personUsed, equipment.hoursPerDay - equipmentUsed);
        if (room > 1e-8) { selected = { date, hours: Math.min(remaining, room) }; break; }
      }
      if (!selected) fail(`Personal- oder Maschinenkapazität reicht bis zum Liefertermin ${due} nicht aus.`);
      const operationId = `auto-v1-${stageIndex + 1}-${blockIndex + 1}-${encodeURIComponent(capability)}`;
      const finalBlock = stageIndex === requirements.length - 1 && remaining - selected.hours <= 1e-8;
      const operation = {
        operationId, date: selected.date, personId: person.id, equipmentId: equipment.id, hours: selected.hours,
        requiredSkills: profile.requirements.skills.map(row => row.id),
        requiredEquipmentCapabilities: [...profile.requirements.equipment],
        predecessors: predecessor ? [predecessor] : [], materials: finalBlock ? clone(materialNeeds) : {},
      };
      local.push({ ...operation, status: 'planned' });
      predecessor = operationId;
      remaining -= selected.hours;
      blockIndex += 1;
    }
  }
  return { plannerVersion: PLANNER_VERSION, workloadHours, hoursBasis: 'one synthetic inquiry capacity unit equals one modeled work hour', materialBasis: `first matching occupational archetype (${recipeProfile.id}) recipe per accepted commercial unit (${terms.unit})`, operations: local.map(({ status, ...row }) => row) };
}

export function createV3ManagementContractSnapshot(order) {
  const terms = order?.contractTermsSnapshot;
  if (!terms) fail('Der Auftrag hat keinen angenommenen Angebotsscope.');
  if (JSON.stringify(terms.contractClassification) !== JSON.stringify(V3_METAL_GOODS_CONTRACT_CLASSIFICATION)
    || JSON.stringify(terms.acceptanceScenario) !== JSON.stringify(V3_D0157_F3_CONDITION)) fail('Der angenommene Vertragstyp oder die F3-Szenariobedingung fehlt oder ist verändert.');
  return {
    contractRef: `CONTRACT|${order.workOrderId}`, inquiryId: order.inquiryId, offerId: order.offerId, decisionId: order.decisionId,
    contractType: V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType, customerPartyId: order.customerPartyId, buyerPartyId: order.customerPartyId,
    acceptancePartyId: order.customerPartyId, authorizedForRef: null, partyAuthorityRef: null,
    performanceCriterionRef: `TERMS|${order.offerId}|performance`, acceptanceCriterionRef: `TERMS|${order.offerId}|acceptance`,
    orderUnit: terms.unit, orderQuantity: terms.quantity, storageUnitsPerOrderUnit: 1, commercialTermsSnapshot: clone(terms),
  };
}

export const V3_MANAGEMENT_ORDER_PLANNER_VERSION = PLANNER_VERSION;
