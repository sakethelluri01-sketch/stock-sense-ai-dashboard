import { NextResponse } from "next/server";
import { getQuote, hasFinnhubApiKey } from "@/lib/finnhub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const quote = await getQuote(symbol);
  return NextResponse.json({ provider: "finnhub", configured: hasFinnhubApiKey(), quote });
}
