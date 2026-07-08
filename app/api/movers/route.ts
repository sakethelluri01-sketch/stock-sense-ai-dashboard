import { NextResponse } from "next/server";
import { getMoverList } from "@/lib/yahoo";

const allowed = new Set(["day_gainers", "day_losers", "most_actives"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "day_gainers";
  const movers = allowed.has(kind) ? await getMoverList(kind as "day_gainers" | "day_losers" | "most_actives") : [];
  return NextResponse.json({ movers });
}
