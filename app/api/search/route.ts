import { NextResponse } from "next/server";
import { hasFinnhubApiKey, searchSymbols } from "@/lib/finnhub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const results = await searchSymbols(query);
  return NextResponse.json({ provider: "finnhub", configured: hasFinnhubApiKey(), results });
}
