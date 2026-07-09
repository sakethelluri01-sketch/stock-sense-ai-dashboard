import { NextResponse } from "next/server";
import { getNews, hasFinnhubApiKey } from "@/lib/finnhub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol") ?? "market";
  const news = await getNews(symbol);
  return NextResponse.json({ provider: "finnhub", configured: hasFinnhubApiKey(), news });
}
