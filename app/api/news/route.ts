import { NextResponse } from "next/server";
import { getNews } from "@/lib/yahoo";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol") ?? "market";
  const news = await getNews(symbol);
  return NextResponse.json({ news });
}
