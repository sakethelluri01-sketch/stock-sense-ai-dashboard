import type { ChartPoint, NewsItem, SearchResult, StockQuote } from "@/lib/types";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const US_UNIVERSE = ["AAPL", "MSFT", "NVDA", "AMZN", "META", "GOOGL", "TSLA", "AVGO", "JPM", "LLY", "V", "UNH"];

function getApiKey() {
  return process.env.FINNHUB_API_KEY;
}

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(`${FINNHUB_BASE_URL}${path}`);
  const token = getApiKey();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  if (token) url.searchParams.set("token", token);
  return url.toString();
}

async function fetchJson<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T | null> {
  if (!getApiKey()) return null;
  try {
    const response = await fetch(buildUrl(path, params), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function n(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function s(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

type FinnhubQuote = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  pc?: number;
  t?: number;
};

type FinnhubProfile = {
  currency?: string;
  exchange?: string;
  finnhubIndustry?: string;
  logo?: string;
  marketCapitalization?: number;
  name?: string;
  ticker?: string;
  weburl?: string;
};

type FinnhubMetric = {
  metric?: Record<string, unknown>;
};

export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const normalized = symbol.toUpperCase();
  const [quote, profile, metrics] = await Promise.all([
    fetchJson<FinnhubQuote>("/quote", { symbol: normalized }),
    fetchJson<FinnhubProfile>("/stock/profile2", { symbol: normalized }),
    fetchJson<FinnhubMetric>("/stock/metric", { symbol: normalized, metric: "all" })
  ]);

  if (!quote || quote.c === undefined || quote.t === 0) return null;
  const metric = metrics?.metric ?? {};
  const marketCapMillions = n(profile?.marketCapitalization) ?? n(metric.marketCapitalization);

  return {
    symbol: normalized,
    name: profile?.name ?? normalized,
    exchange: s(profile?.exchange),
    currency: s(profile?.currency),
    price: n(quote.c),
    change: n(quote.d),
    changePercent: n(quote.dp),
    marketCap: marketCapMillions === null ? null : marketCapMillions * 1_000_000,
    pe: n(metric.peNormalizedAnnual) ?? n(metric.peBasicExclExtraTTM) ?? n(metric.peTTM),
    eps: n(metric.epsTTM) ?? n(metric.epsInclExtraItemsTTM),
    volume: null,
    dividendYield: n(metric.dividendYieldIndicatedAnnual) ?? n(metric.dividendYield5Y),
    fiftyTwoWeekHigh: n(metric["52WeekHigh"]) ?? n(quote.h),
    fiftyTwoWeekLow: n(metric["52WeekLow"]) ?? n(quote.l),
    sector: s(profile?.finnhubIndustry),
    industry: s(profile?.finnhubIndustry),
    description: undefined,
    ceo: undefined,
    website: s(profile?.weburl),
    logo: s(profile?.logo)
  };
}

type FinnhubCandle = {
  s?: "ok" | "no_data";
  t?: number[];
  c?: number[];
  h?: number[];
  l?: number[];
  o?: number[];
  v?: number[];
};

function getRangeWindow(range: string) {
  const to = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;
  const windows: Record<string, number> = {
    "1d": day,
    "5d": 5 * day,
    "1mo": 31 * day,
    "6mo": 183 * day,
    "1y": 365 * day,
    "5y": 5 * 365 * day,
    max: 10 * 365 * day
  };
  return { from: to - (windows[range] ?? windows["1mo"]), to };
}

function mapResolution(interval: string, range: string) {
  if (interval.includes("5m")) return "5";
  if (interval.includes("15m")) return "15";
  if (interval.includes("1wk")) return "W";
  if (interval.includes("1mo")) return "M";
  if (range === "1d") return "5";
  if (range === "5d") return "15";
  return "D";
}

export async function getChart(symbol: string, range = "1mo", interval = "1d"): Promise<ChartPoint[]> {
  const normalized = symbol.toUpperCase();
  const { from, to } = getRangeWindow(range);
  const data = await fetchJson<FinnhubCandle>("/stock/candle", {
    symbol: normalized,
    resolution: mapResolution(interval, range),
    from,
    to
  });

  if (data?.s !== "ok" || !data.t?.length) return [];
  return data.t
    .map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().slice(0, range === "1d" || range === "5d" ? 16 : 10),
      close: data.c?.[index] ?? NaN,
      high: data.h?.[index] ?? undefined,
      low: data.l?.[index] ?? undefined,
      open: data.o?.[index] ?? undefined,
      volume: data.v?.[index] ?? undefined
    }))
    .filter((point) => Number.isFinite(point.close));
}

type FinnhubSearch = {
  result?: Array<{
    description?: string;
    displaySymbol?: string;
    symbol?: string;
    type?: string;
  }>;
};

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const data = await fetchJson<FinnhubSearch>("/search", { q: query });
  return (data?.result ?? [])
    .filter((item) => item.symbol && !item.symbol.includes(".") && item.type !== "Crypto")
    .slice(0, 8)
    .map((item) => ({
      symbol: String(item.symbol).toUpperCase(),
      name: item.description ?? item.displaySymbol ?? item.symbol ?? "Unknown",
      exchange: undefined,
      type: item.type
    }));
}

type FinnhubNews = Array<{
  id?: number;
  headline?: string;
  source?: string;
  url?: string;
  datetime?: number;
  summary?: string;
}>;

function isoDate(daysAgo: number) {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

export async function getNews(symbol = "market"): Promise<NewsItem[]> {
  const normalized = symbol.toUpperCase();
  const data =
    normalized === "MARKET"
      ? await fetchJson<FinnhubNews>("/news", { category: "general" })
      : await fetchJson<FinnhubNews>("/company-news", { symbol: normalized, from: isoDate(14), to: isoDate(0) });

  return (data ?? []).slice(0, 12).map((item, index) => ({
    id: String(item.id ?? `${normalized}-${index}`),
    title: item.headline ?? "Untitled market story",
    publisher: s(item.source),
    link: s(item.url),
    publishedAt: typeof item.datetime === "number" ? new Date(item.datetime * 1000).toISOString() : undefined,
    summary: s(item.summary)
  }));
}

type MoverQuote = {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  volume: number | null;
  marketCap: number | null;
};

async function getMoverQuote(symbol: string): Promise<MoverQuote | null> {
  const quote = await getQuote(symbol);
  if (!quote) return null;
  return {
    symbol: quote.symbol,
    name: quote.name,
    price: quote.price,
    changePercent: quote.changePercent,
    volume: quote.volume,
    marketCap: quote.marketCap
  };
}

export async function getMoverList(kind: "day_gainers" | "day_losers" | "most_actives") {
  const quotes = (await Promise.all(US_UNIVERSE.map((symbol) => getMoverQuote(symbol)))).filter((quote): quote is MoverQuote => Boolean(quote));
  const sorted = [...quotes].sort((a, b) => {
    if (kind === "day_losers") return (a.changePercent ?? 0) - (b.changePercent ?? 0);
    if (kind === "most_actives") return (b.volume ?? 0) - (a.volume ?? 0);
    return (b.changePercent ?? 0) - (a.changePercent ?? 0);
  });
  return sorted.slice(0, 8);
}
