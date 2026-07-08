"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Building2,
  Check,
  ExternalLink,
  Heart,
  Newspaper,
  Plus,
  ShieldAlert,
  Star,
  Target
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useChart, useMovers, useNews, useQuote, useStockIntelligence } from "@/hooks/use-stock-data";
import { Card, EmptyState, LoadingState, Pill, SectionTitle, StatCard } from "@/components/ui";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useMarketStore } from "@/stores/use-market-store";

const ranges = [
  { label: "1D", range: "1d", interval: "5m" },
  { label: "1W", range: "5d", interval: "15m" },
  { label: "1M", range: "1mo", interval: "1d" },
  { label: "6M", range: "6mo", interval: "1d" },
  { label: "1Y", range: "1y", interval: "1d" },
  { label: "5Y", range: "5y", interval: "1wk" },
  { label: "MAX", range: "max", interval: "1mo" }
];

export function StockHero({ symbol }: { symbol: string }) {
  const quote = useQuote(symbol);
  const watchlist = useMarketStore((state) => state.watchlist);
  const toggleWatchlist = useMarketStore((state) => state.toggleWatchlist);
  const isWatched = watchlist.includes(symbol);
  const q = quote.data;

  return (
    <Card className="overflow-hidden">
      {quote.isLoading ? (
        <LoadingState />
      ) : q ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
              {q.logo && q.website ? (
                <Image src={q.logo} alt="" fill sizes="56px" className="object-contain p-2" unoptimized />
              ) : (
                <Building2 className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold text-white">{q.symbol}</h1>
                <Pill tone={(q.changePercent ?? 0) >= 0 ? "good" : "bad"}>{formatPercent(q.changePercent)}</Pill>
              </div>
              <p className="mt-1 text-sm text-slate-400">{q.name}</p>
              <p className="mt-2 text-xs text-slate-500">{q.exchange ?? "Exchange unavailable"} · {q.currency ?? "Currency unavailable"}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <div>
              <p className="text-right text-4xl font-semibold text-white">{formatCurrency(q.price)}</p>
              <p className={cn("text-right text-sm", (q.change ?? 0) >= 0 ? "text-mint" : "text-coral")}>{formatCurrency(q.change)} today</p>
            </div>
            <button
              onClick={() => toggleWatchlist(symbol)}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isWatched ? <Check className="h-5 w-5 text-mint" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>
        </div>
      ) : (
        <EmptyState title="Quote unavailable" body="Yahoo Finance did not return quote data for this symbol." />
      )}
    </Card>
  );
}

export function StockMetrics({ symbol }: { symbol: string }) {
  const quote = useQuote(symbol);
  const q = quote.data;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Market Cap" value={formatNumber(q?.marketCap)} icon={Building2} />
      <StatCard label="Volume" value={formatNumber(q?.volume)} icon={Activity} />
      <StatCard label="P/E Ratio" value={formatNumber(q?.pe, false)} icon={BarChart3} />
      <StatCard label="EPS" value={formatCurrency(q?.eps)} icon={Target} />
    </div>
  );
}

export function PriceChart({ symbol }: { symbol: string }) {
  const [selectedRange, setSelectedRange] = useState(ranges[2]);
  const chart = useChart(symbol, selectedRange.range, selectedRange.interval);

  return (
    <Card className="min-h-[420px]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle title="Interactive Chart" meta={selectedRange.label} />
        <div className="flex flex-wrap gap-1">
          {ranges.map((item) => (
            <button
              key={item.label}
              onClick={() => setSelectedRange(item)}
              className={cn(
                "focus-ring rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                item.label === selectedRange.label ? "bg-mint text-ink" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {chart.isLoading ? (
        <LoadingState />
      ) : chart.data?.length ? (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data}>
              <defs>
                <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickMargin={10} minTickGap={34} />
              <YAxis stroke="#64748b" fontSize={11} domain={["dataMin", "dataMax"]} tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="close" stroke="#4ade80" strokeWidth={2} fill="url(#priceFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState title="Chart unavailable" body="No price history was returned for this range." />
      )}
    </Card>
  );
}

export function TechnicalPanel({ symbol }: { symbol: string }) {
  const { technicals, isLoading } = useStockIntelligence(symbol);
  return (
    <Card>
      <SectionTitle title="Technical Indicators" meta="RSI · MACD · SMA · EMA" />
      {isLoading ? (
        <LoadingState />
      ) : technicals ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Signal</span>
            <Pill tone={technicals.signal === "Bullish" ? "good" : technicals.signal === "Bearish" ? "bad" : "warn"}>{technicals.signal}</Pill>
          </div>
          {[
            ["RSI", technicals.rsi?.toFixed(2)],
            ["SMA 20", formatCurrency(technicals.sma20)],
            ["SMA 50", formatCurrency(technicals.sma50)],
            ["EMA 20", formatCurrency(technicals.ema20)],
            ["MACD", technicals.macd?.toFixed(2)]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
              <span className="text-slate-400">{label}</span>
              <span className="font-medium text-white">{value ?? "Unavailable"}</span>
            </div>
          ))}
          <p className="rounded-lg bg-white/5 p-3 text-sm leading-6 text-slate-300">{technicals.trend}</p>
        </div>
      ) : (
        <EmptyState title="Indicators unavailable" body="Price history is needed to calculate technical signals." />
      )}
    </Card>
  );
}

export function AiPanel({ symbol }: { symbol: string }) {
  const { insight, isLoading } = useStockIntelligence(symbol);
  return (
    <Card>
      <SectionTitle title="AI Recommendation" meta="Rule-based live data analysis" />
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-xs text-slate-500">Recommendation</p>
              <p className="mt-2 text-xl font-semibold text-white">{insight.recommendation}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-xs text-slate-500">Confidence</p>
              <p className="mt-2 text-xl font-semibold text-white">{insight.confidence}%</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-xs text-slate-500">Target</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(insight.targetPrice)}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-white">Reasons</p>
            <ul className="space-y-2 text-sm text-slate-400">
              {insight.reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-mint/20 bg-mint/5 p-4">
              <p className="mb-2 text-sm font-medium text-mint">Strengths</p>
              <p className="text-sm leading-6 text-slate-300">{insight.strengths.join(" ")}</p>
            </div>
            <div className="rounded-lg border border-coral/20 bg-coral/5 p-4">
              <p className="mb-2 text-sm font-medium text-coral">Weaknesses</p>
              <p className="text-sm leading-6 text-slate-300">{insight.weaknesses.join(" ")}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function NewsList({ symbol }: { symbol: string }) {
  const news = useNews(symbol);
  return (
    <Card>
      <SectionTitle title="Latest News" meta={symbol} />
      {news.isLoading ? (
        <LoadingState />
      ) : news.data?.length ? (
        <div className="space-y-3">
          {news.data.slice(0, 7).map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.07]"
            >
              <div className="flex gap-3">
                <Newspaper className="mt-1 h-4 w-4 shrink-0 text-mint" />
                <div>
                  <p className="font-medium leading-6 text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.publisher ?? "Publisher unavailable"}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState title="News unavailable" body="No market stories were returned right now." />
      )}
    </Card>
  );
}

export function CompanyProfile({ symbol }: { symbol: string }) {
  const quote = useQuote(symbol);
  const q = quote.data;
  return (
    <Card>
      <SectionTitle title="Company Profile" meta={q?.sector ?? "Profile"} />
      {quote.isLoading ? (
        <LoadingState />
      ) : q ? (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-300">{q.description ?? "Company description unavailable."}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Sector", q.sector],
              ["Industry", q.industry],
              ["CEO", q.ceo],
              ["Dividend", q.dividendYield ? `${(q.dividendYield * 100).toFixed(2)}%` : "Unavailable"],
              ["52W High", formatCurrency(q.fiftyTwoWeekHigh)],
              ["52W Low", formatCurrency(q.fiftyTwoWeekLow)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-medium text-white">{value || "Unavailable"}</p>
              </div>
            ))}
          </div>
          {q.website ? (
            <a href={q.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-mint hover:text-emerald-300">
              Website <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      ) : (
        <EmptyState title="Profile unavailable" body="Yahoo Finance did not return company metadata." />
      )}
    </Card>
  );
}

export function MoversTable({ kind, title }: { kind: "day_gainers" | "day_losers" | "most_actives"; title: string }) {
  const movers = useMovers(kind);
  const setSelectedSymbol = useMarketStore((state) => state.setSelectedSymbol);
  return (
    <Card>
      <SectionTitle title={title} />
      {movers.isLoading ? (
        <LoadingState />
      ) : movers.data?.length ? (
        <div className="space-y-2">
          {movers.data.map((raw) => {
            const item = raw as { symbol?: string; name?: string; price?: number | null; changePercent?: number | null; volume?: number | null };
            return (
              <Link
                key={item.symbol}
                href={`/stock/${item.symbol}`}
                onClick={() => item.symbol && setSelectedSymbol(item.symbol)}
                className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.07]"
              >
                <div>
                  <p className="font-semibold text-white">{item.symbol}</p>
                  <p className="truncate text-xs text-slate-500">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{formatCurrency(item.price)}</p>
                  <p className={cn("text-xs", (item.changePercent ?? 0) >= 0 ? "text-mint" : "text-coral")}>{formatPercent(item.changePercent)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Movers unavailable" body="Yahoo Finance did not return this screener list." />
      )}
    </Card>
  );
}

export function PortfolioValue() {
  const holdings = useMarketStore((state) => state.holdings);
  const symbols = holdings.map((holding) => holding.symbol).join(",");
  return (
    <Card>
      <SectionTitle title="Portfolio Summary" meta={symbols || "No holdings"} />
      {holdings.length ? (
        <div className="space-y-3">
          {holdings.map((holding) => (
            <HoldingRow key={holding.symbol} holding={holding} />
          ))}
        </div>
      ) : (
        <EmptyState title="No holdings yet" body="Add holdings on the Portfolio page to track performance." />
      )}
    </Card>
  );
}

function HoldingRow({ holding }: { holding: { symbol: string; shares: number; averageCost: number } }) {
  const quote = useQuote(holding.symbol);
  const price = quote.data?.price ?? null;
  const marketValue = price === null ? null : price * holding.shares;
  const cost = holding.averageCost * holding.shares;
  const gain = marketValue === null ? null : ((marketValue - cost) / cost) * 100;
  return (
    <Link href={`/stock/${holding.symbol}`} className="grid grid-cols-[1fr_auto] rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.07]">
      <div>
        <p className="font-semibold text-white">{holding.symbol}</p>
        <p className="text-xs text-slate-500">{holding.shares} shares · avg {formatCurrency(holding.averageCost)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-white">{formatCurrency(marketValue)}</p>
        <p className={cn("text-xs", (gain ?? 0) >= 0 ? "text-mint" : "text-coral")}>{formatPercent(gain)}</p>
      </div>
    </Link>
  );
}

export function AllocationChart() {
  const holdings = useMarketStore((state) => state.holdings);
  const data = holdings.map((holding) => ({
    symbol: holding.symbol,
    value: holding.shares * holding.averageCost
  }));
  return (
    <Card>
      <SectionTitle title="Allocation" meta="Cost basis" />
      {data.length ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="symbol" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
              <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
              <Bar dataKey="value" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState title="Allocation unavailable" body="Add holdings to render portfolio allocation." />
      )}
    </Card>
  );
}

export function RiskPanel({ symbol }: { symbol: string }) {
  const { insight } = useStockIntelligence(symbol);
  return (
    <Card>
      <SectionTitle title="Risk Snapshot" meta={symbol} />
      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <ShieldAlert className="mt-1 h-5 w-5 text-amber" />
        <div>
          <p className="font-semibold text-white">{insight.risk} risk</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{insight.shortTerm} {insight.longTerm}</p>
        </div>
      </div>
    </Card>
  );
}

export function WatchlistMini() {
  const watchlist = useMarketStore((state) => state.watchlist);
  return (
    <Card>
      <SectionTitle title="Watchlist" meta={`${watchlist.length} symbols`} />
      <div className="space-y-2">
        {watchlist.map((symbol) => (
          <WatchlistRow key={symbol} symbol={symbol} />
        ))}
      </div>
    </Card>
  );
}

function WatchlistRow({ symbol }: { symbol: string }) {
  const quote = useQuote(symbol);
  return (
    <Link href={`/stock/${symbol}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.07]">
      <span className="font-semibold text-white">{symbol}</span>
      <span className={cn("text-sm", ((quote.data?.changePercent ?? 0) >= 0 ? "text-mint" : "text-coral"))}>{formatPercent(quote.data?.changePercent)}</span>
    </Link>
  );
}

export function MarketStatus() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const isLikelyOpen = utcHour >= 13 && utcHour < 20;
  return (
    <Card>
      <SectionTitle title="Market Status" meta="US session heuristic" />
      <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
        <div>
          <p className="font-semibold text-white">{isLikelyOpen ? "Likely Open" : "Likely Closed"}</p>
          <p className="mt-1 text-sm text-slate-400">NYSE/Nasdaq regular hours are approximated in UTC.</p>
        </div>
        <Pill tone={isLikelyOpen ? "good" : "warn"}>{isLikelyOpen ? "Live" : "After hours"}</Pill>
      </div>
    </Card>
  );
}

export function FearGreed() {
  return (
    <Card>
      <SectionTitle title="Fear & Greed" meta="Unavailable-safe" />
      <div className="rounded-lg bg-white/5 p-5 text-center">
        <p className="text-3xl font-semibold text-white">Unavailable</p>
        <p className="mt-2 text-sm text-slate-400">No free Yahoo endpoint returned an official fear and greed value.</p>
      </div>
    </Card>
  );
}
