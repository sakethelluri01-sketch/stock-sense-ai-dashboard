import { MoversTable, FearGreed, MarketStatus } from "@/components/stock-widgets";
import { PageHeader } from "@/components/ui";

export default function MarketsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Markets"
        title="Live Market Overview"
        description="Yahoo Finance predefined screeners power gainers, losers, and most active lists. Unavailable values stay explicitly unavailable."
      />
      <div className="grid gap-5 xl:grid-cols-3">
        <MoversTable kind="day_gainers" title="Top Gainers" />
        <MoversTable kind="day_losers" title="Top Losers" />
        <MoversTable kind="most_actives" title="Most Active" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <MarketStatus />
        <FearGreed />
      </div>
    </div>
  );
}
