import { AiPanel, CompanyProfile, NewsList, PriceChart, RiskPanel, StockHero, StockMetrics, TechnicalPanel } from "@/components/stock-widgets";

export default async function StockDetailsPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const normalized = symbol.toUpperCase();
  return (
    <div className="space-y-5">
      <StockHero symbol={normalized} />
      <StockMetrics symbol={normalized} />
      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
        <PriceChart symbol={normalized} />
        <div className="space-y-5">
          <TechnicalPanel symbol={normalized} />
          <RiskPanel symbol={normalized} />
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <CompanyProfile symbol={normalized} />
        <AiPanel symbol={normalized} />
      </div>
      <NewsList symbol={normalized} />
    </div>
  );
}
