"use client";

import { NewsList } from "@/components/stock-widgets";
import { PageHeader } from "@/components/ui";
import { useMarketStore } from "@/stores/use-market-store";

export default function NewsPage() {
  const symbol = useMarketStore((state) => state.selectedSymbol);
  return (
    <div>
      <PageHeader eyebrow="News" title="Market And Company News" description="Latest stories are fetched from Yahoo Finance search news for the active symbol." />
      <NewsList symbol={symbol} />
    </div>
  );
}
