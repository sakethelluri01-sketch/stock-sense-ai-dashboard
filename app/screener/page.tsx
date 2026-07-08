"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMovers } from "@/hooks/use-stock-data";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { formatCurrency, formatNumber, formatPercent, cn } from "@/lib/utils";

export default function ScreenerPage() {
  const [minPrice, setMinPrice] = useState("");
  const [minVolume, setMinVolume] = useState("");
  const movers = useMovers("most_actives");
  const rows = useMemo(() => {
    return (movers.data ?? []).filter((raw) => {
      const item = raw as { price?: number | null; volume?: number | null };
      return (!minPrice || (item.price ?? 0) >= Number(minPrice)) && (!minVolume || (item.volume ?? 0) >= Number(minVolume));
    });
  }, [movers.data, minPrice, minVolume]);

  return (
    <div>
      <PageHeader eyebrow="Stock Screener" title="Market Screener" description="Filter live most-active Yahoo symbols by price and volume. Missing values are never fabricated." />
      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} type="number" placeholder="Min price" className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
          <input value={minVolume} onChange={(event) => setMinVolume(event.target.value)} type="number" placeholder="Min volume" className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
          <select className="focus-ring rounded-lg border border-white/10 bg-[#111827] px-3 py-3 text-sm text-white">
            <option>Any sector</option>
            <option>Technology</option>
            <option>Financial Services</option>
          </select>
          <select className="focus-ring rounded-lg border border-white/10 bg-[#111827] px-3 py-3 text-sm text-white">
            <option>Any dividend</option>
            <option>Dividend paying</option>
          </select>
        </div>
      </Card>
      <Card>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Symbol</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Volume</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((raw) => {
                  const item = raw as { symbol?: string; name?: string; price?: number | null; changePercent?: number | null; volume?: number | null; marketCap?: number | null };
                  return (
                    <tr key={item.symbol} className="border-t border-white/10">
                      <td className="py-4 font-semibold text-white"><Link href={`/stock/${item.symbol}`}>{item.symbol}</Link></td>
                      <td className="text-slate-400">{item.name}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td className={cn((item.changePercent ?? 0) >= 0 ? "text-mint" : "text-coral")}>{formatPercent(item.changePercent)}</td>
                      <td>{formatNumber(item.volume)}</td>
                      <td>{formatNumber(item.marketCap)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No matches" body="Adjust filters or wait for the Yahoo screener response." />
        )}
      </Card>
    </div>
  );
}
