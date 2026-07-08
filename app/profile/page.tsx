"use client";

import { LogIn, User } from "lucide-react";
import { Card, PageHeader, SectionTitle } from "@/components/ui";
import { useMarketStore } from "@/stores/use-market-store";

export default function ProfilePage() {
  const isAuthenticated = useMarketStore((state) => state.isAuthenticated);
  const loginGuest = useMarketStore((state) => state.loginGuest);
  const logout = useMarketStore((state) => state.logout);
  return (
    <div>
      <PageHeader eyebrow="Profile" title="Account" description="Guest login unlocks the protected app experience for local portfolio and watchlist workflows." />
      <Card>
        <SectionTitle title="Authentication" />
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
              <User className="h-5 w-5 text-mint" />
            </div>
            <div>
              <p className="font-semibold text-white">{isAuthenticated ? "Guest Investor" : "Not signed in"}</p>
              <p className="text-sm text-slate-400">{isAuthenticated ? "Protected routes enabled locally" : "Use guest login to continue"}</p>
            </div>
          </div>
          <button onClick={isAuthenticated ? logout : loginGuest} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-ink hover:bg-emerald-300">
            <LogIn className="h-4 w-4" />
            {isAuthenticated ? "Sign Out" : "Guest Login"}
          </button>
        </div>
      </Card>
    </div>
  );
}
