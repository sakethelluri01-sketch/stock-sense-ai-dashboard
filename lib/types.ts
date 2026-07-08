export type StockQuote = {
  symbol: string;
  name: string;
  exchange?: string;
  currency?: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  marketCap: number | null;
  pe: number | null;
  eps: number | null;
  volume: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  sector?: string;
  industry?: string;
  description?: string;
  ceo?: string;
  website?: string;
  logo?: string;
};

export type ChartPoint = {
  date: string;
  close: number;
  high?: number;
  low?: number;
  open?: number;
  volume?: number;
};

export type SearchResult = {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  publisher?: string;
  link?: string;
  publishedAt?: string;
  summary?: string;
};

export type TechnicalSummary = {
  rsi: number | null;
  sma20: number | null;
  sma50: number | null;
  ema20: number | null;
  macd: number | null;
  signal: "Bullish" | "Bearish" | "Neutral";
  trend: string;
};

export type AiInsight = {
  recommendation: "Buy" | "Hold" | "Reduce";
  confidence: number;
  risk: "Low" | "Moderate" | "High";
  targetPrice: number | null;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
  shortTerm: string;
  longTerm: string;
};
