import { NextResponse } from "next/server";
import { getQuote } from "@/lib/finnhub";

export async function GET(_request: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const quote = await getQuote(symbol);
  return NextResponse.json({ quote });
}
