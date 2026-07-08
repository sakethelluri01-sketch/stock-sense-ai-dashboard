"use client";

import { useRouter } from "next/navigation";
import { LogIn, Sparkles } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { useMarketStore } from "@/stores/use-market-store";

export default function LoginPage() {
  const router = useRouter();
  const loginGuest = useMarketStore((state) => state.loginGuest);

  function continueGuest() {
    loginGuest();
    router.push("/");
  }

  return (
    <div>
      <PageHeader
        eyebrow="Authentication"
        title="Access StockSense AI"
        description="Use guest login to enter the protected investment intelligence workspace."
      />
      <Card className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-mint text-ink shadow-glow">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Guest Login</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Your watchlist, holdings, alerts, and search history are stored locally in this browser.
        </p>
        <button
          onClick={continueGuest}
          className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-mint px-5 py-3 text-sm font-semibold text-ink transition hover:bg-emerald-300"
        >
          <LogIn className="h-4 w-4" />
          Continue as Guest
        </button>
      </Card>
    </div>
  );
}
