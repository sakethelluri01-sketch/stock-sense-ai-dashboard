import { NextResponse } from "next/server";
import { getMoverList, hasFinnhubApiKey } from "@/lib/finnhub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const allowed = new Set(["day_gainers", "day_losers", "most_actives"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "day_gainers";
  const movers = allowed.has(kind) ? await getMoverList(kind as "day_gainers" | "day_losers" | "most_actives") : [];
  return NextResponse.json({ provider: "finnhub", configured: hasFinnhubApiKey(), movers });
}
