"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Brain,
  CandlestickChart,
  Gauge,
  LayoutDashboard,
  LineChart,
  Newspaper,
  PanelLeft,
  PieChart,
  SearchCheck,
  Settings,
  SlidersHorizontal,
  Sparkles,
  User,
  WalletCards
} from "lucide-react";
import { SearchCommand } from "@/components/search-command";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/stores/use-market-store";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: CandlestickChart },
  { href: "/insights", label: "AI Insights", icon: Brain },
  { href: "/watchlist", label: "Watchlist", icon: SearchCheck },
  { href: "/portfolio", label: "Portfolio", icon: WalletCards },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/compare", label: "Compare", icon: LineChart },
  { href: "/screener", label: "Screener", icon: SlidersHorizontal },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const selectedSymbol = useMarketStore((state) => state.selectedSymbol);
  const isAuthenticated = useMarketStore((state) => state.isAuthenticated);
  const loginGuest = useMarketStore((state) => state.loginGuest);
  const isPublicRoute = pathname === "/login" || pathname === "/profile";
  const locked = !isAuthenticated && !isPublicRoute;

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-white/10 bg-ink/82 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-mint text-ink shadow-glow">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">StockSense AI</p>
            <p className="text-xs text-slate-500">Investment intelligence</p>
          </div>
        </Link>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/74 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen((value) => !value)}
              className="focus-ring rounded-lg border border-white/10 p-3 text-slate-300 lg:hidden"
              aria-label="Open navigation"
              aria-expanded={mobileNavOpen}
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <SearchCommand />
            <Link
              href={`/stock/${selectedSymbol}`}
              className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white md:flex"
            >
              <Gauge className="h-4 w-4 text-mint" />
              {selectedSymbol}
            </Link>
          </div>
          {mobileNavOpen ? (
            <div className="mt-3 grid gap-2 rounded-lg border border-white/10 bg-[#0b1020]/95 p-3 lg:hidden">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                      pathname === item.href ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {nav.slice(0, 9).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs",
                    pathname === item.href ? "bg-white/10 text-white" : "text-slate-400"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-6 lg:py-8">
          {locked ? (
            <section className="glass mx-auto mt-16 max-w-xl rounded-lg p-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-mint text-ink shadow-glow">
                <Sparkles className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-semibold text-white">Welcome to StockSense AI</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Continue as a guest to unlock the protected market dashboard, watchlist, portfolio, alerts, and AI insights.
              </p>
              <button
                onClick={loginGuest}
                className="focus-ring mt-6 rounded-lg bg-mint px-5 py-3 text-sm font-semibold text-ink transition hover:bg-emerald-300"
              >
                Continue as Guest
              </button>
            </section>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
