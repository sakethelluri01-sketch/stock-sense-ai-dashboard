"use client";

import { CalendarDays, TrendingUp, WalletCards } from "lucide-react";
import { AiPanel, FearGreed, MarketStatus, MoversTable, NewsList, PortfolioValue, PriceChart, StockHero, StockMetrics, TechnicalPanel, WatchlistMini } from "@/components/stock-widgets";
import { PageHeader, StatCard } from "@/components/ui";
import { useMarketStore } from "@/stores/use-market-store";

export default function DashboardPage() {
  const symbol = useMarketStore((state) => state.selectedSymbol);
  return (
    <div>
      <PageHeader
        eyebrow="AI Powered Investment Intelligence Platform"
        title="StockSense AI"
        description="A live market dashboard where global search updates company data, charts, news, indicators, recommendations, watchlist, and portfolio context."
      />
      <div className="space-y-5">
        <StockHero symbol={symbol} />
        <StockMetrics symbol={symbol} />
        <div className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
          <PriceChart symbol={symbol} />
          <div className="space-y-5">
            <AiPanel symbol={symbol} />
            <TechnicalPanel symbol={symbol} />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Upcoming Earnings" value="Unavailable" icon={CalendarDays} />
          <StatCard label="Economic Calendar" value="Unavailable" icon={TrendingUp} />
          <StatCard label="Portfolio Source" value="Local" icon={WalletCards} />
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          <MoversTable kind="day_gainers" title="Top Gainers" />
          <MoversTable kind="day_losers" title="Top Losers" />
          <MoversTable kind="most_actives" title="Most Active" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
          <WatchlistMini />
          <PortfolioValue />
          <div className="space-y-5">
            <MarketStatus />
            <FearGreed />
          </div>
        </div>
        <NewsList symbol={symbol} />
      </div>
    </div>
  );
}
