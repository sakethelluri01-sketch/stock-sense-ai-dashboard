import type { ChartPoint, NewsItem, SearchResult, StockQuote } from "@/lib/types";

const JSON_HEADERS = {
  "User-Agent": "Mozilla/5.0 StockSenseAI/1.0",
  Accept: "application/json"
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: JSON_HEADERS,
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

function rawNumber(value: unknown): number | null {
  if (typeof value === "number") return n(value);
  if (typeof value === "object" && value !== null && "raw" in value) return n((value as { raw?: unknown }).raw);
  return null;
}

type YahooQuoteResponse = {
  quoteResponse?: {
    result?: Array<Record<string, unknown>>;
  };
};

type YahooSummaryResponse = {
  quoteSummary?: {
    result?: Array<{
      assetProfile?: Record<string, unknown>;
      summaryProfile?: Record<string, unknown>;
      defaultKeyStatistics?: Record<string, unknown>;
      summaryDetail?: Record<string, unknown>;
    }>;
  };
};

export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const normalized = encodeURIComponent(symbol.toUpperCase());
  const [quoteData, summaryData] = await Promise.all([
    fetchJson<YahooQuoteResponse>(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${normalized}`),
    fetchJson<YahooSummaryResponse>(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${normalized}?modules=assetProfile,summaryProfile,defaultKeyStatistics,summaryDetail`
    )
  ]);

  const quote = quoteData?.quoteResponse?.result?.[0];
  if (!quote) return null;
  const summary = summaryData?.quoteSummary?.result?.[0];
  const profile = summary?.assetProfile ?? summary?.summaryProfile ?? {};
  const stats = summary?.defaultKeyStatistics ?? {};
  const detail = summary?.summaryDetail ?? {};
  const symbolValue = String(quote.symbol ?? symbol).toUpperCase();

  return {
    symbol: symbolValue,
    name: String(quote.longName ?? quote.shortName ?? symbolValue),
    exchange: typeof quote.fullExchangeName === "string" ? quote.fullExchangeName : undefined,
    currency: typeof quote.currency === "string" ? quote.currency : undefined,
    price: n(quote.regularMarketPrice),
    change: n(quote.regularMarketChange),
    changePercent: n(quote.regularMarketChangePercent),
    marketCap: n(quote.marketCap),
    pe: n(quote.trailingPE) ?? rawNumber(detail.trailingPE),
    eps: n(quote.epsTrailingTwelveMonths) ?? rawNumber(stats.trailingEps),
    volume: n(quote.regularMarketVolume),
    dividendYield: rawNumber(detail.dividendYield),
    fiftyTwoWeekHigh: n(quote.fiftyTwoWeekHigh),
    fiftyTwoWeekLow: n(quote.fiftyTwoWeekLow),
    sector: typeof profile.sector === "string" ? profile.sector : undefined,
    industry: typeof profile.industry === "string" ? profile.industry : undefined,
    description: typeof profile.longBusinessSummary === "string" ? profile.longBusinessSummary : undefined,
    ceo: Array.isArray(profile.companyOfficers)
      ? String((profile.companyOfficers[0] as { name?: string } | undefined)?.name ?? "")
      : undefined,
    website: typeof profile.website === "string" ? profile.website : undefined,
    logo: `https://logo.clearbit.com/${String(profile.website ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  };
}

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          open?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
  };
};

export async function getChart(symbol: string, range = "1mo", interval = "1d"): Promise<ChartPoint[]> {
  const normalized = encodeURIComponent(symbol.toUpperCase());
  const data = await fetchJson<YahooChartResponse>(
    `https://query1.finance.yahoo.com/v8/finance/chart/${normalized}?range=${range}&interval=${interval}`
  );
  const result = data?.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const quote = result?.indicators?.quote?.[0];
  if (!quote) return [];

  return timestamps
    .map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      close: quote.close?.[index] ?? NaN,
      high: quote.high?.[index] ?? undefined,
      low: quote.low?.[index] ?? undefined,
      open: quote.open?.[index] ?? undefined,
      volume: quote.volume?.[index] ?? undefined
    }))
    .filter((point) => Number.isFinite(point.close));
}

type YahooSearchResponse = {
  quotes?: Array<Record<string, unknown>>;
  news?: Array<Record<string, unknown>>;
};

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const data = await fetchJson<YahooSearchResponse>(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`
  );
  return (data?.quotes ?? [])
    .filter((item) => typeof item.symbol === "string")
    .map((item) => ({
      symbol: String(item.symbol).toUpperCase(),
      name: String(item.longname ?? item.shortname ?? item.symbol),
      exchange: typeof item.exchDisp === "string" ? item.exchDisp : undefined,
      type: typeof item.quoteType === "string" ? item.quoteType : undefined
    }));
}

export async function getNews(symbol = "market"): Promise<NewsItem[]> {
  const data = await fetchJson<YahooSearchResponse>(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}&quotesCount=0&newsCount=12`
  );
  return (data?.news ?? []).map((item, index) => ({
    id: String(item.uuid ?? `${symbol}-${index}`),
    title: String(item.title ?? "Untitled market story"),
    publisher: typeof item.publisher === "string" ? item.publisher : undefined,
    link: typeof item.link === "string" ? item.link : undefined,
    publishedAt: typeof item.providerPublishTime === "number" ? new Date(item.providerPublishTime * 1000).toISOString() : undefined,
    summary: typeof item.summary === "string" ? item.summary : undefined
  }));
}

type YahooScreenerResponse = {
  finance?: {
    result?: Array<{ quotes?: Array<Record<string, unknown>> }>;
  };
};

export async function getMoverList(kind: "day_gainers" | "day_losers" | "most_actives") {
  const data = await fetchJson<YahooScreenerResponse>(
    `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=${kind}&count=8`
  );
  return (data?.finance?.result?.[0]?.quotes ?? []).map((quote) => ({
    symbol: String(quote.symbol ?? ""),
    name: String(quote.shortName ?? quote.longName ?? quote.symbol ?? ""),
    price: n(quote.regularMarketPrice),
    changePercent: n(quote.regularMarketChangePercent),
    volume: n(quote.regularMarketVolume),
    marketCap: n(quote.marketCap)
  }));
}
