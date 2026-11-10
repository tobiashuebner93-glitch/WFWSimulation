// Pure V3 price-index calculation. Deliberately not connected to V1/V2 game state.
export const V3_SPI_COICOP12_VERSION = 'V3-SPI-COICOP12-v1';

export const V3_SPI_COICOP12_WEIGHTS_PER_MILLE = Object.freeze({
  '01': 119.04,
  '02': 35.26,
  '03': 42.25,
  '04': 259.25,
  '05': 67.78,
  '06': 55.49,
  '07': 138.22,
  '08': 23.35,
  '09': 104.23,
  '10': 9.06,
  '11': 47.20,
  '12': 98.87
});

const COICOP_DIVISIONS = Object.freeze(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE));

function validateComponentIndexes(componentIndexes) {
  if (!componentIndexes || typeof componentIndexes !== 'object' || Array.isArray(componentIndexes)) {
    throw new TypeError('componentIndexes must be an object keyed by COICOP division 01–12');
  }

  for (const division of COICOP_DIVISIONS) {
    const value = componentIndexes[division];
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      throw new TypeError(`component index for COICOP ${division} must be a finite positive number`);
    }
  }
  return componentIndexes;
}

/**
 * Calculate one unrounded SPI value from twelve component index levels.
 * Component levels are dimensionless indexes on the same base (VPI base 2020 = 100).
 */
export function calculateV3SpiCOICOP12(componentIndexes) {
  validateComponentIndexes(componentIndexes);
  return COICOP_DIVISIONS.reduce((sum, division) => (
    sum + (V3_SPI_COICOP12_WEIGHTS_PER_MILLE[division] / 1000) * componentIndexes[division]
  ), 0);
}

/**
 * Calculate the current SPI and its changes from chronological prior monthly SPI levels.
 * `priorMonthlyIndexes` contains earlier month SPI values, oldest first; absent/incomplete
 * history produces null rates rather than an inferred value. No display rounding is applied.
 */
export function calculateV3SpiPeriod(componentIndexes, priorMonthlyIndexes = []) {
  const index = calculateV3SpiCOICOP12(componentIndexes);
  if (!Array.isArray(priorMonthlyIndexes)) {
    throw new TypeError('priorMonthlyIndexes must be an array of chronological SPI levels');
  }
  for (const [position, value] of priorMonthlyIndexes.entries()) {
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value <= 0)) {
      throw new TypeError(`prior SPI at position ${position} must be null or a finite positive number`);
    }
  }

  const previousMonth = priorMonthlyIndexes.at(-1);
  const yearAgo = priorMonthlyIndexes.length >= 12 ? priorMonthlyIndexes.at(-12) : null;
  return Object.freeze({
    modelVersion: V3_SPI_COICOP12_VERSION,
    index,
    monthOverMonthInflation: previousMonth == null ? null : 100 * (index / previousMonth - 1),
    yearOverYearInflation: yearAgo == null ? null : 100 * (index / yearAgo - 1)
  });
}

/**
 * Rebase an explicitly supplied history to a new reference period without changing
 * the basket or the component base used to calculate its observations. This is a
 * pure calculation helper: it neither declares a new official basket nor persists
 * the returned reference series.
 */
export function rebaseV3SpiHistory(observations, {
  newBasePeriod,
  basketVersion,
  componentBasePeriod,
  sourceRef,
  fixtureId
} = {}) {
  if (!Array.isArray(observations) || observations.length === 0) {
    throw new TypeError('observations must be a non-empty chronological SPI history');
  }
  if (basketVersion !== V3_SPI_COICOP12_VERSION) {
    throw new TypeError(`basketVersion must be ${V3_SPI_COICOP12_VERSION}`);
  }
  for (const [field, value] of Object.entries({ newBasePeriod, componentBasePeriod, sourceRef, fixtureId })) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new TypeError(`${field} must be an explicit non-empty string`);
    }
  }

  const periods = new Set();
  let previousPeriod = '';
  let previousMonthOrdinal = null;
  for (const [position, observation] of observations.entries()) {
    if (!observation || typeof observation !== 'object' || Array.isArray(observation)) {
      throw new TypeError(`observation ${position} must be an object`);
    }
    if (typeof observation.period !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(observation.period)) {
      throw new TypeError(`observation ${position} must have a YYYY-MM period`);
    }
    if (periods.has(observation.period) || observation.period <= previousPeriod) {
      throw new TypeError('observations must have unique chronological periods');
    }
    const [year, month] = observation.period.split('-').map(Number);
    const monthOrdinal = year * 12 + month - 1;
    if (previousMonthOrdinal !== null && monthOrdinal !== previousMonthOrdinal + 1) {
      throw new TypeError('observations must be consecutive calendar months');
    }
    periods.add(observation.period);
    previousPeriod = observation.period;
    previousMonthOrdinal = monthOrdinal;
    if (typeof observation.index !== 'number' || !Number.isFinite(observation.index) || observation.index <= 0) {
      throw new TypeError(`SPI index for ${observation.period} must be finite and positive`);
    }
    if (observation.basketVersion !== basketVersion
      || observation.componentBasePeriod !== componentBasePeriod
      || observation.sourceRef !== sourceRef
      || observation.fixtureId !== fixtureId) {
      throw new TypeError(`observation ${observation.period} has mixed or missing basket provenance`);
    }
    const componentProvenance = observation.componentProvenance;
    if (!componentProvenance || typeof componentProvenance !== 'object' || Array.isArray(componentProvenance)) {
      throw new TypeError(`observation ${observation.period} must bind provenance for all twelve components`);
    }
    for (const division of COICOP_DIVISIONS) {
      const provenance = componentProvenance[division];
      if (!provenance || provenance.basketVersion !== basketVersion
        || provenance.componentBasePeriod !== componentBasePeriod
        || provenance.sourceRef !== sourceRef
        || provenance.fixtureId !== fixtureId) {
        throw new TypeError(`component ${division} at ${observation.period} has mixed or missing provenance`);
      }
    }
    if (Object.keys(componentProvenance).length !== COICOP_DIVISIONS.length) {
      throw new TypeError(`observation ${observation.period} must bind exactly twelve component provenance entries`);
    }
  }

  const baseObservation = observations.find(({ period }) => period === newBasePeriod);
  if (!baseObservation) {
    throw new TypeError(`newBasePeriod ${newBasePeriod} is missing from observations`);
  }

  const baseIndex = baseObservation.index;
  const rebased = observations.map((observation, position) => {
    const index = 100 * observation.index / baseIndex;
    const previous = position > 0 ? observations[position - 1] : null;
    const yearAgo = position >= 12 ? observations[position - 12] : null;
    return Object.freeze({
      period: observation.period,
      index,
      monthOverMonthInflation: previous == null ? null : 100 * (observation.index / previous.index - 1),
      yearOverYearInflation: yearAgo == null ? null : 100 * (observation.index / yearAgo.index - 1)
    });
  });

  return Object.freeze({
    modelVersion: V3_SPI_COICOP12_VERSION,
    basketVersion,
    componentBasePeriod,
    referencePeriod: newBasePeriod,
    sourceRef,
    fixtureId,
    baseIndex,
    observations: Object.freeze(rebased)
  });
}
