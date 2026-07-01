"use client";

import { useState } from "react";
import { Check, HelpCircle, X } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type ComparisonRow = {
  label: string;
  helper: string;
  hackRadar: string;
  otherPlatforms: string;
  otherTone?: "x" | "partial";
};

const comparisonRows: ComparisonRow[] = [
  {
    label: "Discover hackathons from multiple platforms",
    helper: "Browse verified opportunities from many sources in one place.",
    hackRadar: "Always on",
    otherPlatforms: "Manual searching",
    otherTone: "partial",
  },
  {
    label: "AI-powered recommendations",
    helper: "Find hackathons matching your skills.",
    hackRadar: "Personalized",
    otherPlatforms: "Generic listings",
    otherTone: "partial",
  },
  {
    label: "Smart deadline reminders",
    helper: "Never miss registrations or submissions.",
    hackRadar: "Automated alerts",
    otherPlatforms: "Manual tracking",
    otherTone: "x",
  },
  {
    label: "Complete event timelines",
    helper: "See every milestone from registration to results.",
    hackRadar: "End-to-end view",
    otherPlatforms: "Scattered updates",
    otherTone: "x",
  },
  {
    label: "Personalized matching",
    helper: "Surface opportunities aligned to your profile.",
    hackRadar: "Skill-based",
    otherPlatforms: "Broad discovery",
    otherTone: "partial",
  },
  {
    label: "Bookmark opportunities",
    helper: "Save promising events for later review.",
    hackRadar: "Built in",
    otherPlatforms: "Separate tools",
    otherTone: "partial",
  },
  {
    label: "Unified workspace",
    helper: "Manage everything from one place.",
    hackRadar: "One workspace",
    otherPlatforms: "Many tabs",
    otherTone: "x",
  },
  {
    label: "Telegram & Email alerts",
    helper: "Get updates where you already work.",
    hackRadar: "Integrated alerts",
    otherPlatforms: "Manual follow-up",
    otherTone: "x",
  },
  {
    label: "Track enrolled hackathons",
    helper: "Monitor progress without juggling platforms.",
    hackRadar: "Centralized tracking",
    otherPlatforms: "Disconnected",
    otherTone: "x",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function StatusMark({
  mode,
  active,
}: {
  mode: "check" | "x" | "partial";
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-full border transition-transform duration-200 ease-in-out",
        active && "scale-105",
        mode === "check"
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
          : mode === "partial"
            ? "border-slate-300 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            : "border-rose-500/25 bg-rose-500/10 text-rose-500 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-300"
      )}
    >
      {mode === "check" ? (
        <Check className="size-4" strokeWidth={2.5} />
      ) : mode === "partial" ? (
        <span className="h-0.5 w-3 rounded-full bg-current" />
      ) : (
        <X className="size-4" strokeWidth={2.5} />
      )}
    </span>
  );
}

function ComparisonRowItem({
  row,
  index,
  active,
  onHover,
}: {
  row: ComparisonRow;
  index: number;
  active: boolean;
  onHover: (index: number | null) => void;
}) {
  return (
    <motion.div
      variants={rowVariants}
      onMouseEnter={() => onHover(index)}
      onFocus={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "group grid items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm outline-none transition-[all] duration-[220ms] ease-in-out sm:min-h-[60px] sm:grid-cols-[1.45fr_0.8fr_0.85fr] sm:gap-4 sm:px-5 sm:py-3",
        "bg-surface/80 border-border/50 dark:bg-white/[0.03] dark:border-white/8",
        active
          ? "border-l-2 border-l-[#A855F7] bg-[rgba(139,92,246,0.08)] shadow-[0_0_0_1px_rgba(168,85,247,0.10),0_0_18px_rgba(168,85,247,0.12)]"
          : "hover:border-l-2 hover:border-l-[#A855F7] hover:bg-[rgba(139,92,246,0.06)] hover:shadow-[0_0_0_1px_rgba(168,85,247,0.08)]",
        index % 2 === 0 ? "dark:bg-white/[0.04]" : ""
      )}
      tabIndex={0}
      aria-label={row.label}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex size-1.5 shrink-0 rounded-full bg-primary/70 transition-colors duration-200",
            active && "bg-primary"
          )}
        />
        <p className="font-semibold text-foreground">{row.label}</p>
      </div>

      <div className="flex items-center justify-center gap-[10px] sm:justify-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:hidden">
          HackRadar
        </span>
        <div className="flex items-center justify-center gap-[10px] text-foreground">
          <StatusMark mode="check" active={active} />
          <span className="font-medium text-[0.93rem]">{row.hackRadar}</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-[10px] sm:justify-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:hidden">
          Other
        </span>
        <div className="flex items-center justify-center gap-[10px] text-muted-foreground">
          <StatusMark mode={row.otherTone ?? "x"} active={active} />
          <span className="font-medium text-[0.93rem]">{row.otherPlatforms}</span>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[108%] items-center gap-2 rounded-full border border-[#A855F7]/20 bg-surface/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-[0_10px_24px_rgba(31,25,48,0.08)] backdrop-blur-md transition-all duration-200 ease-in-out sm:flex",
            active ? "opacity-100" : "opacity-0"
          )}
        >
          <HelpCircle className="size-3.5 text-primary" />
          <span>{row.helper}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function WhyDiscoveryMattersPanel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="mx-auto w-full max-w-[1100px] overflow-hidden rounded-[2rem] border border-border/50 bg-surface/80 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/8 dark:bg-white/[0.03] dark:shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-4"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#A855F7]/20 bg-[rgba(139,92,246,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:bg-[rgba(139,92,246,0.10)]">
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.55)]" />
        One workspace. Less friction.
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-border/50 bg-background/70 dark:border-white/8 dark:bg-black/10">
        <div className="sticky top-0 z-10 hidden grid-cols-[1.45fr_0.8fr_0.85fr] gap-3 border-b border-border/50 bg-background/90 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-md dark:border-white/8 dark:bg-[#0f172a]/90 sm:grid sm:gap-4 sm:px-5">
          <div>Capability</div>
          <div className="text-center">HackRadar</div>
          <div className="text-center">Other Platforms</div>
        </div>

        <div className="divide-y divide-border/50 dark:divide-white/8">
          {comparisonRows.map((row, index) => (
            <ComparisonRowItem
              key={row.label}
              row={row}
              index={index}
              active={activeIndex === index}
              onHover={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
