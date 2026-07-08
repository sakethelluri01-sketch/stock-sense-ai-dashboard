"use client";

import { AiPanel, RiskPanel, TechnicalPanel } from "@/components/stock-widgets";
import { PageHeader } from "@/components/ui";
import { useMarketStore } from "@/stores/use-market-store";

export default function InsightsPage() {
  const symbol = useMarketStore((state) => state.selectedSymbol);
  return (
    <div>
      <PageHeader
        eyebrow="AI Insights"
        title={`${symbol} Intelligence`}
        description="Recommendation, confidence, risk, target price, trend summary, strengths, and weaknesses are derived from live quote and chart data."
      />
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AiPanel symbol={symbol} />
        <div className="space-y-5">
          <TechnicalPanel symbol={symbol} />
          <RiskPanel symbol={symbol} />
        </div>
      </div>
    </div>
  );
}
