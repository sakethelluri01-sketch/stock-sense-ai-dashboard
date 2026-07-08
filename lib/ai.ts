import type { AiInsight, StockQuote, TechnicalSummary } from "@/lib/types";

export function buildAiInsight(quote?: StockQuote, technicals?: TechnicalSummary): AiInsight {
  const price = quote?.price ?? null;
  const signal = technicals?.signal ?? "Neutral";
  const rsi = technicals?.rsi ?? null;
  const pe = quote?.pe ?? null;
  const confidence = signal === "Neutral" ? 62 : 74;
  const risk = rsi !== null && (rsi > 72 || rsi < 28) ? "High" : pe !== null && pe > 45 ? "Moderate" : "Low";
  const recommendation = signal === "Bullish" && risk !== "High" ? "Buy" : signal === "Bearish" ? "Reduce" : "Hold";
  const targetPrice = price === null ? null : recommendation === "Buy" ? price * 1.08 : recommendation === "Reduce" ? price * 0.94 : price * 1.02;

  return {
    recommendation,
    confidence,
    risk,
    targetPrice,
    reasons: [
      technicals?.trend ?? "Technical data is unavailable for this symbol.",
      pe !== null ? `Valuation is reading at ${pe.toFixed(2)}x earnings.` : "Valuation metrics are unavailable.",
      quote?.changePercent !== null && quote?.changePercent !== undefined
        ? `Session move is ${quote.changePercent >= 0 ? "positive" : "negative"} at ${quote.changePercent.toFixed(2)}%.`
        : "Live session move is unavailable."
    ],
    strengths: [
      quote?.sector ? `Exposure to ${quote.sector}.` : "Sector data is unavailable.",
      quote?.marketCap ? "Institutional-scale market capitalization." : "Market capitalization unavailable.",
      signal === "Bullish" ? "Price action is above key short-term averages." : "Risk controls remain important."
    ],
    weaknesses: [
      rsi !== null && rsi > 70 ? "RSI is elevated." : "Momentum confirmation is not one-sided.",
      pe !== null && pe > 45 ? "Premium valuation may compress returns." : "Valuation risk needs fresh earnings context.",
      "News and macro shocks can alter the outlook quickly."
    ],
    shortTerm: signal === "Bullish" ? "Constructive while price holds above short-term averages." : signal === "Bearish" ? "Cautious until momentum stabilizes." : "Range-bound setup with mixed confirmation.",
    longTerm: quote?.description ? "Long-term thesis should be tied to fundamentals, margin durability, and cash flow growth." : "Long-term view is limited until company profile data is available."
  };
}
