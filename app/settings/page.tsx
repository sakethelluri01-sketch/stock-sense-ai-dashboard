"use client";

import { useState } from "react";
import { Card, PageHeader, SectionTitle } from "@/components/ui";

export default function SettingsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [premiumTheme, setPremiumTheme] = useState(true);
  return (
    <div>
      <PageHeader eyebrow="Settings" title="Platform Settings" description="Control data refresh preferences and local storage features." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Data" />
          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <span>
              <span className="block font-medium text-white">Auto refresh</span>
              <span className="text-sm text-slate-400">TanStack Query keeps data fresh in the background.</span>
            </span>
            <input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} className="h-5 w-5 accent-emerald-400" />
          </label>
        </Card>
        <Card>
          <SectionTitle title="Appearance" />
          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <span>
              <span className="block font-medium text-white">Premium dark theme</span>
              <span className="text-sm text-slate-400">Optimized for dense market scanning.</span>
            </span>
            <input type="checkbox" checked={premiumTheme} onChange={(event) => setPremiumTheme(event.target.checked)} className="h-5 w-5 accent-emerald-400" />
          </label>
        </Card>
      </div>
    </div>
  );
}
