"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useQuote } from "@/hooks/use-stock-data";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { useMarketStore } from "@/stores/use-market-store";

export default function WatchlistPage() {
  const watchlist = useMarketStore((state) => state.watchlist);
  return (
    <div>
      <PageHeader eyebrow="Watchlist" title="Tracked Stocks" description="Add and remove stocks from any quote header. The list persists locally in this browser." />
      <Card>
        {watchlist.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {watchlist.map((symbol) => (
              <WatchCard key={symbol} symbol={symbol} />
            ))}
          </div>
        ) : (
          <EmptyState title="No watchlist symbols" body="Search for a stock and add it from the quote header." />
        )}
      </Card>
    </div>
  );
}

function WatchCard({ symbol }: { symbol: string }) {
  const quote = useQuote(symbol);
  const toggleWatchlist = useMarketStore((state) => state.toggleWatchlist);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/stock/${symbol}`}>
          <p className="text-lg font-semibold text-white">{symbol}</p>
          <p className="mt-1 line-clamp-1 text-sm text-slate-400">{quote.data?.name ?? "Loading..."}</p>
        </Link>
        <button onClick={() => toggleWatchlist(symbol)} className="focus-ring rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-coral" aria-label="Remove">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-2xl font-semibold text-white">{formatCurrency(quote.data?.price)}</p>
        <p className={cn("text-sm", (quote.data?.changePercent ?? 0) >= 0 ? "text-mint" : "text-coral")}>{formatPercent(quote.data?.changePercent)}</p>
      </div>
    </div>
  );
}
