import { MATERIAL_PRICE_BASELINE } from './engine.js';

// Historical Destatis PPI observations are used as stress magnitudes, not as forecasts.
export const ECONOMIC_SCENARIOS = Object.freeze({
  base: { label: 'Basis · 2 % p. a.', annual: { steel: .02, aluminium: .02, parts: .02, energy: .02 }, demandShift: 0 },
  pressure: { label: 'Kostenstress · PPI-Sensitivität', annual: { steel: .084, aluminium: .064, parts: .064, energy: .149 }, demandShift: -.015 },
  relief: { label: 'Entlastung · Gegenprobe', annual: { steel: -.02, aluminium: -.01, parts: 0, energy: -.05 }, demandShift: .01 },
});

export function updateEconomicIndices(game, date) {
  if (!date.endsWith('-01') || Number(date.slice(0,4)) < 2028) return;
  const key = ECONOMIC_SCENARIOS[game.macro.economicScenario] ? game.macro.economicScenario : 'base';
  const path = ECONOMIC_SCENARIOS[key];
  game.macro.priceIndices ||= { steel: 1, aluminium: 1, parts: 1, energy: 1 };
  for (const [item, annual] of Object.entries(path.annual)) {
    game.macro.priceIndices[item] = Math.max(.5, game.macro.priceIndices[item] * Math.pow(1 + annual, 1 / 12));
  }
  game.macro.priceIndex = (game.macro.priceIndices.steel + game.macro.priceIndices.aluminium + game.macro.priceIndices.parts) / 3;
  game.macro.inflation = game.macro.priceIndices.energy - 1;
  if (path.demandShift) game.macro.marketDemand = Math.max(.75, Math.min(1.25, game.macro.marketDemand + path.demandShift / 12));
}

export function materialPrices(game) {
  const ix = game.macro.priceIndices || { steel: game.macro.priceIndex || 1, aluminium: game.macro.priceIndex || 1, parts: game.macro.priceIndex || 1 };
  return Object.fromEntries(Object.entries(MATERIAL_PRICE_BASELINE).map(([key, value]) => [key, value * (ix[key] || 1)]));
}

export function estimateOrderEconomics(order, game, netQuote = null) {
  const prices = materialPrices(game);
  const material = Object.entries(order.materials || {}).reduce((sum, [key, quantity]) => sum + quantity * (prices[key] || 0), 0);
  const planHours = Number(order.planningHours || 0);
  const productionHours = (order.operations || []).reduce((sum, operation) => sum + Number(operation.totalHours || 0), 0);
  const directLaborRate = (4598 + 3751) / (2 * 160);
  const planningRate = 4235 / 160;
  const overheadRate = (Number(game.roomSettings?.rent ?? 2400) + 950 + 380) / 480;
  const labor = productionHours * directLaborRate + planHours * planningRate;
  const overhead = (productionHours + planHours) * overheadRate;
  const estimatedCost = Math.round((material + labor + overhead) * 100) / 100;
  const costFloor = estimatedCost / .8;
  const suggestedNet = Math.round(Math.max(costFloor, Number(order.marketReferenceNet || 0)) * 100) / 100;
  const quote = netQuote == null || netQuote === '' ? suggestedNet : Number(netQuote);
  const contribution = Math.round((quote - estimatedCost) * 100) / 100;
  const margin = quote > 0 ? contribution / quote : 0;
  return { material: Math.round(material * 100) / 100, labor: Math.round(labor * 100) / 100, overhead: Math.round(overhead * 100) / 100, estimatedCost, suggestedNet, quote, tax: Math.round(quote * .19 * 100) / 100, gross: Math.round((quote + quote * .19) * 100) / 100, contribution, margin };
}
