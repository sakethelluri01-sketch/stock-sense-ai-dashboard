"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, Search, X } from "lucide-react";
import { useSearch } from "@/hooks/use-stock-data";
import type { SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/stores/use-market-store";

export function SearchCommand() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearches = useMarketStore((state) => state.recentSearches);
  const setSelectedSymbol = useMarketStore((state) => state.setSelectedSymbol);
  const search = useSearch(query);
  const suggestions = useMemo<SearchResult[]>(() => {
    if (query.trim().length > 1) return search.data ?? [];
    return recentSearches.map((symbol) => ({ symbol, name: "Recent search", type: "History" }));
  }, [query, recentSearches, search.data]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(symbol?: string) {
    const next = (symbol || suggestions[activeIndex]?.symbol || query).trim().toUpperCase();
    if (!next) return;
    setSelectedSymbol(next);
    setQuery(next);
    setOpen(false);
    router.push(`/stock/${next}`);
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 shadow-inner">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, Math.max(suggestions.length - 1, 0)));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Search Apple, AAPL, Tesla, TSLA..."
          className="focus-ring h-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500"
        />
        {query ? (
          <button className="focus-ring rounded-md p-1 text-slate-400 hover:text-white" onClick={() => setQuery("")} aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        ) : (
          <div className="hidden items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500 sm:flex">
            <Command className="h-3 w-3" /> K
          </div>
        )}
        <button
          onClick={() => submit()}
          className="focus-ring rounded-md bg-mint px-3 py-2 text-sm font-semibold text-ink transition hover:bg-emerald-300"
        >
          Search
        </button>
      </div>
      {open && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-14 z-40 overflow-hidden rounded-lg border border-white/10 bg-[#0b1020]/95 shadow-panel backdrop-blur-xl">
          {suggestions.map((item, index) => (
            <button
              key={`${item.symbol}-${index}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => submit(item.symbol)}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition",
                index === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <span>
                <span className="block font-semibold text-white">{item.symbol}</span>
                <span className="block text-xs text-slate-400">{item.name}</span>
              </span>
              <span className="text-xs text-slate-500">{item.exchange ?? item.type ?? "Stock"}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
