import { NextResponse } from "next/server";
import { getChart, hasFinnhubApiKey } from "@/lib/finnhub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const url = new URL(request.url);
  const range = url.searchParams.get("range") ?? "1mo";
  const interval = url.searchParams.get("interval") ?? "1d";
  const points = await getChart(symbol, range, interval);
  return NextResponse.json({ provider: "finnhub", configured: hasFinnhubApiKey(), points });
}
