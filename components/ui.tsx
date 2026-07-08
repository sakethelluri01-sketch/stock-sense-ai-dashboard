"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-mint">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-normal text-white md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn("glass rounded-lg p-5", className)}
    >
      {children}
    </motion.section>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon
}: {
  label: string;
  value: string;
  change?: number | null;
  icon?: LucideIcon;
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <Card className="min-h-[132px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <Icon className="h-5 w-5 text-mint" />
          </div>
        ) : null}
      </div>
      {change !== undefined ? (
        <div className={cn("mt-4 inline-flex items-center gap-1 text-sm", positive ? "text-mint" : "text-coral")}>
          {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {formatPercent(change)}
        </div>
      ) : null}
    </Card>
  );
}

export function SectionTitle({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {meta ? <span className="text-xs text-slate-500">{meta}</span> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
      <p className="font-medium text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading live market data" }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin text-mint" />
      {label}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "bad" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "good" && "border-mint/30 bg-mint/10 text-mint",
        tone === "bad" && "border-coral/30 bg-coral/10 text-coral",
        tone === "warn" && "border-amber/30 bg-amber/10 text-amber",
        tone === "neutral" && "border-white/10 bg-white/5 text-slate-300"
      )}
    >
      {children}
    </span>
  );
}
