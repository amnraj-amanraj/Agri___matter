export type MandiRecord = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  date: string;
};

type MandiResponse = {
  records?: Record<string, unknown>[];
  total?: number;
};

export type MandiQuery = {
  state?: string;
  district?: string;
  commodity?: string;
  limit?: number;
};

export type MandiResult = {
  records: MandiRecord[];
  source: 'data.gov.in' | 'cache';
  fetchedAt: string;
  warning?: string;
};

const cache = new Map<string, MandiResult>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function text(record: Record<string, unknown>, names: string[]) {
  const key = Object.keys(record).find((candidate) => names.some((name) => candidate.toLowerCase().replace(/[^a-z]/g, '') === name.toLowerCase().replace(/[^a-z]/g, '')));
  return key ? String(record[key] ?? '').trim() : '';
}

function price(record: Record<string, unknown>, names: string[]) {
  const value = text(record, names);
  const parsed = Number(value.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalize(record: Record<string, unknown>): MandiRecord {
  return {
    state: text(record, ['State']),
    district: text(record, ['District']),
    market: text(record, ['Market', 'Market Name']),
    commodity: text(record, ['Commodity', 'Crop']),
    variety: text(record, ['Variety']),
    minPrice: price(record, ['Min Price', 'Min Price (Rs./Quintal)']),
    maxPrice: price(record, ['Max Price', 'Max Price (Rs./Quintal)']),
    modalPrice: price(record, ['Modal Price', 'Modal Price (Rs./Quintal)']),
    date: text(record, ['Arrival Date', 'Price Date', 'Date']),
  };
}

export async function fetchMandiPrices(query: MandiQuery): Promise<MandiResult> {
  const apiKey = process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.DATA_GOV_MANDI_RESOURCE_ID;
  const cacheKey = JSON.stringify(query);
  const cached = cache.get(cacheKey);

  if (!apiKey || !resourceId) {
    if (cached) return { ...cached, source: 'cache', warning: 'Live API credentials are not configured. Showing the last successful result.' };
    throw new Error('Mandi data is not configured. Add DATA_GOV_API_KEY and DATA_GOV_MANDI_RESOURCE_ID to .env.local.');
  }

  if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS) {
    return { ...cached, source: 'cache' };
  }

  const params = new URLSearchParams({ 'api-key': apiKey, format: 'json', limit: String(query.limit ?? 50) });
  if (query.state) params.set('filters[State]', query.state);
  if (query.district) params.set('filters[District]', query.district);
  if (query.commodity) params.set('filters[Commodity]', query.commodity);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`https://api.data.gov.in/resource/${resourceId}?${params.toString()}`, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`Official mandi service returned ${response.status}`);
    const payload = await response.json() as MandiResponse;
    const records = (payload.records ?? []).map(normalize).filter((record) => record.market || record.commodity);
    const result: MandiResult = { records, source: 'data.gov.in', fetchedAt: new Date().toISOString() };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    if (cached) return { ...cached, source: 'cache', warning: 'Live mandi data is temporarily unavailable. Showing the last successful result.' };
    throw error instanceof Error ? error : new Error('Mandi data is temporarily unavailable.');
  } finally {
    clearTimeout(timeout);
  }
}
