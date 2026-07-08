"use client";

import { useQuery } from "@tanstack/react-query";
import { buildAiInsight } from "@/lib/ai";
import { calculateTechnicals } from "@/lib/indicators";
import type { ChartPoint, NewsItem, SearchResult, StockQuote } from "@/lib/types";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Request failed");
  return (await response.json()) as T;
}

export function useQuote(symbol: string) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: async () => (await getJson<{ quote: StockQuote | null }>(`/api/stock/${symbol}`)).quote
  });
}

export function useChart(symbol: string, range = "1mo", interval = "1d") {
  return useQuery({
    queryKey: ["chart", symbol, range, interval],
    queryFn: async () =>
      (await getJson<{ points: ChartPoint[] }>(`/api/chart/${symbol}?range=${range}&interval=${interval}`)).points
  });
}

export function useNews(symbol: string) {
  return useQuery({
    queryKey: ["news", symbol],
    queryFn: async () => (await getJson<{ news: NewsItem[] }>(`/api/news?symbol=${symbol}`)).news
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => (await getJson<{ results: SearchResult[] }>(`/api/search?q=${encodeURIComponent(query)}`)).results,
    enabled: query.trim().length > 1
  });
}

export function useMovers(kind: "day_gainers" | "day_losers" | "most_actives") {
  return useQuery({
    queryKey: ["movers", kind],
    queryFn: async () => (await getJson<{ movers: Array<Record<string, unknown>> }>(`/api/movers?kind=${kind}`)).movers
  });
}

export function useStockIntelligence(symbol: string, range = "6mo", interval = "1d") {
  const quote = useQuote(symbol);
  const chart = useChart(symbol, range, interval);
  const technicals = chart.data ? calculateTechnicals(chart.data) : undefined;
  const insight = buildAiInsight(quote.data ?? undefined, technicals);

  return {
    quote,
    chart,
    technicals,
    insight,
    isLoading: quote.isLoading || chart.isLoading
  };
}
