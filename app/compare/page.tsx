"use client";

import { useState } from "react";
import { AiPanel, PriceChart, StockHero, StockMetrics, TechnicalPanel } from "@/components/stock-widgets";
import { Card, PageHeader } from "@/components/ui";

export default function ComparePage() {
  const [left, setLeft] = useState("AAPL");
  const [right, setRight] = useState("MSFT");
  return (
    <div>
      <PageHeader eyebrow="Compare Stocks" title={`${left} vs ${right}`} description="Compare two live symbols side-by-side across price, financials, indicators, charts, and AI recommendation." />
      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={left} onChange={(event) => setLeft(event.target.value.toUpperCase())} className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
          <input value={right} onChange={(event) => setRight(event.target.value.toUpperCase())} className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
        </div>
      </Card>
      <div className="grid gap-5 2xl:grid-cols-2">
        {[left, right].map((symbol) => (
          <div key={symbol} className="space-y-5">
            <StockHero symbol={symbol} />
            <StockMetrics symbol={symbol} />
            <PriceChart symbol={symbol} />
            <TechnicalPanel symbol={symbol} />
            <AiPanel symbol={symbol} />
          </div>
        ))}
      </div>
    </div>
  );
}
