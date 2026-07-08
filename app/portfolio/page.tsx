"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AllocationChart, PortfolioValue } from "@/components/stock-widgets";
import { Card, PageHeader, SectionTitle } from "@/components/ui";
import { useMarketStore } from "@/stores/use-market-store";

export default function PortfolioPage() {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const holdings = useMarketStore((state) => state.holdings);
  const addHolding = useMarketStore((state) => state.addHolding);
  const removeHolding = useMarketStore((state) => state.removeHolding);

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsedShares = Number(shares);
    const parsedCost = Number(averageCost);
    if (!symbol || parsedShares <= 0 || parsedCost <= 0) return;
    addHolding({ symbol: symbol.toUpperCase(), shares: parsedShares, averageCost: parsedCost });
    setSymbol("");
    setShares("");
    setAverageCost("");
  }

  return (
    <div>
      <PageHeader eyebrow="Portfolio" title="Portfolio Tracker" description="Holdings are stored locally and valued against live Yahoo quote data when available." />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionTitle title="Add Holding" />
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-4">
            <input value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder="AAPL" className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
            <input value={shares} onChange={(event) => setShares(event.target.value)} placeholder="Shares" type="number" min="0" step="0.01" className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
            <input value={averageCost} onChange={(event) => setAverageCost(event.target.value)} placeholder="Avg cost" type="number" min="0" step="0.01" className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-ink hover:bg-emerald-300">
              <Plus className="h-4 w-4" /> Add
            </button>
          </form>
          <div className="mt-5 space-y-2">
            {holdings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="font-medium text-white">{holding.symbol}</span>
                <button onClick={() => removeHolding(holding.symbol)} className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-coral" aria-label="Remove holding">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
        <PortfolioValue />
      </div>
      <div className="mt-5">
        <AllocationChart />
      </div>
    </div>
  );
}
