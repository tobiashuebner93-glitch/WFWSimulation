// Observed Destatis import-price benchmark data, kept separate from all cost drivers.
export const V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID = 'DESTATIS-61411-0010-2026-09-VINTAGE-2026-11-01';
export const V3_DESTATIS_IMPORT_PRICE_SOURCE_REF = 'https://genesis.destatis.de/datenbank/online/statistic/61411/table/61411-0010/search/s/SW5kZXglMjBFaW5mdWhycHJlaXNl';
const PRESS_RELEASE_REF = 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_379_614.html';
const SOURCE_RELEASE_DATE = '2026-10-30';
const SNAPSHOT_RETRIEVED_AT = '2026-11-01';
const OBSERVATION_PERIOD = '2026-09';
const SERIES_ID = '61411-0010';

const clone = value => structuredClone(value);
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const validIsoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
  && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;

/**
 * Return the fixed observed source snapshot only when a monthly input is not
 * earlier than the associated Destatis press-release date. Omit it before that.
 */
export function buildV3DestatisImportPriceBenchmark(period) {
  if (typeof period !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) throw new TypeError('period must be YYYY-MM');
  if (`${period}-01` < SOURCE_RELEASE_DATE) return null;
  return {
    benchmarkId: V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID,
    sourceType: 'observed',
    sourceRef: V3_DESTATIS_IMPORT_PRICE_SOURCE_REF,
    sourceSeriesId: SERIES_ID,
    sourceSnapshotId: `${V3_DESTATIS_IMPORT_PRICE_BENCHMARK_ID}|release-2026-10-30|retrieved-2026-11-01`,
    observedPeriod: OBSERVATION_PERIOD,
    sourceReleaseDate: SOURCE_RELEASE_DATE,
    publicationEvidenceType: 'associated_destatis_press_release_date',
    publicationEvidenceRef: PRESS_RELEASE_REF,
    genesisCellTimestampAvailable: false,
    retrievedAt: SNAPSHOT_RETRIEVED_AT,
    dataVintage: 'GENESIS-61411-0010-as-retrieved-2026-11-01',
    publicationStatus: 'published_release_confirmed',
    revisionStatus: 'not_reported_by_snapshot',
    unit: 'index_points',
    indexBase: '2021=100',
    groupValues: {
      euroCountries: { groupId: 'euro_countries', label: 'Euro-Länder', value: 125.7 },
      nonEuroCountries: { groupId: 'non_euro_countries', label: 'Nicht-Euro-Länder', value: 120.1 },
      total: { groupId: 'all_countries', label: 'Insgesamt', value: 122.2 },
    },
    referenceOnly: true,
    directFinanceEffect: false,
    actualStateChanged: false,
  };
}

/** A present snapshot must match its immutable source vintage and period. */
export function validateV3DestatisImportPriceBenchmark(reference, { period } = {}) {
  if (reference == null) return true;
  const expected = buildV3DestatisImportPriceBenchmark(period);
  if (!expected || stable(reference) !== stable(expected)) throw new TypeError('Destatis import-price reference is unknown, future-dated, malformed, or differs from its bound source vintage');
  return true;
}

/**
 * Project a reference record only after the associated release date. The
 * selected group remains a display/filter key; this function never infers an
 * import exposure or applies a coefficient to any price or cost.
 */
export function projectV3DestatisImportPriceBenchmark(reference, { asOfDate, runId, scenarioId, seed, macroSnapshotId } = {}) {
  if (reference == null) return null;
  validateV3DestatisImportPriceBenchmark(reference, { period: '2026-11' });
  if (!validIsoDate(asOfDate) || ![runId, scenarioId, String(seed ?? '')].every(value => typeof value === 'string' && value.trim())) throw new TypeError('Destatis reference projection requires a valid as-of date and run identity');
  if (asOfDate < reference.sourceReleaseDate) return null;
  if (reference.retrievedAt > SNAPSHOT_RETRIEVED_AT) throw new TypeError('Destatis reference vintage is later than the bound retrieval snapshot');
  return {
    referenceId: `DEST-IMPORT-REFERENCE|${encodeURIComponent(runId)}|${reference.sourceSnapshotId}|${asOfDate}`,
    runId, scenarioId, seed: String(seed), target: 'destatisImportPriceBenchmarkReference',
    status: 'available_reference_only', sourceType: 'observed', sourceRef: reference.sourceRef,
    sourceSeriesId: reference.sourceSeriesId, sourceSnapshotId: reference.sourceSnapshotId,
    observedPeriod: reference.observedPeriod,
    asOfDate, sourceReleaseDate: reference.sourceReleaseDate,
    publicationEvidenceType: reference.publicationEvidenceType,
    publicationEvidenceRef: reference.publicationEvidenceRef,
    genesisCellTimestampAvailable: false, retrievedAt: reference.retrievedAt,
    dataVintage: reference.dataVintage, publicationStatus: reference.publicationStatus,
    revisionStatus: reference.revisionStatus, unit: reference.unit, indexBase: reference.indexBase,
    groupValues: clone(reference.groupValues), groupSelectionMode: 'display_filter_only',
    macroSnapshotId: macroSnapshotId ?? null, referenceOnly: true,
    directFinanceEffect: false, actualStateChanged: false,
  };
}
