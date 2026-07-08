"use client";

import { FormEvent, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { useMarketStore } from "@/stores/use-market-store";

export default function AlertsPage() {
  const selectedSymbol = useMarketStore((state) => state.selectedSymbol);
  const alerts = useMarketStore((state) => state.alerts);
  const addAlert = useMarketStore((state) => state.addAlert);
  const removeAlert = useMarketStore((state) => state.removeAlert);
  const [symbol, setSymbol] = useState(selectedSymbol);
  const [target, setTarget] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = Number(target);
    if (!symbol || parsed <= 0) return;
    addAlert({ symbol: symbol.toUpperCase(), target: parsed, direction });
    setTarget("");
  }

  return (
    <div>
      <PageHeader eyebrow="Alerts" title="Price Alerts" description="Create locally stored alerts for target prices. Alerts persist in this browser." />
      <Card className="mb-5">
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-4">
          <input value={symbol} onChange={(event) => setSymbol(event.target.value)} className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
          <select value={direction} onChange={(event) => setDirection(event.target.value as "above" | "below")} className="focus-ring rounded-lg border border-white/10 bg-[#111827] px-3 py-3 text-sm text-white">
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <input value={target} onChange={(event) => setTarget(event.target.value)} type="number" min="0" step="0.01" placeholder="Target price" className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white" />
          <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-ink hover:bg-emerald-300">
            <Bell className="h-4 w-4" /> Add Alert
          </button>
        </form>
      </Card>
      <Card>
        {alerts.length ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="font-medium text-white">{alert.symbol} {alert.direction} {formatCurrency(alert.target)}</p>
                <button onClick={() => removeAlert(alert.id)} className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-coral" aria-label="Remove alert">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No alerts yet" body="Add a target alert for a stock you track." />
        )}
      </Card>
    </div>
  );
}
