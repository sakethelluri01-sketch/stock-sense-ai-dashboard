import type { ChartPoint, TechnicalSummary } from "@/lib/types";

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ema(values: number[], period: number) {
  if (values.length < period) return null;
  const multiplier = 2 / (period + 1);
  let current = average(values.slice(0, period));
  if (current === null) return null;
  for (const value of values.slice(period)) {
    current = (value - current) * multiplier + current;
  }
  return current;
}

function rsi(values: number[], period = 14) {
  if (values.length <= period) return null;
  let gains = 0;
  let losses = 0;
  for (let index = values.length - period; index < values.length; index += 1) {
    const diff = values[index] - values[index - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  if (losses === 0) return 100;
  const rs = gains / period / (losses / period);
  return 100 - 100 / (1 + rs);
}

export function calculateTechnicals(points: ChartPoint[]): TechnicalSummary {
  const closes = points.map((point) => point.close).filter((value) => Number.isFinite(value));
  const sma20 = average(closes.slice(-20));
  const sma50 = average(closes.slice(-50));
  const ema20 = ema(closes, 20);
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macd = ema12 !== null && ema26 !== null ? ema12 - ema26 : null;
  const currentRsi = rsi(closes);
  const latest = closes.at(-1) ?? null;
  const signal =
    latest && sma20 && macd !== null
      ? latest > sma20 && macd > 0
        ? "Bullish"
        : latest < sma20 && macd < 0
          ? "Bearish"
          : "Neutral"
      : "Neutral";

  return {
    rsi: currentRsi,
    sma20,
    sma50,
    ema20,
    macd,
    signal,
    trend:
      signal === "Bullish"
        ? "Momentum is constructive on recent price action."
        : signal === "Bearish"
          ? "Momentum is under pressure versus recent averages."
          : "Signals are mixed and favor patience."
  };
}
