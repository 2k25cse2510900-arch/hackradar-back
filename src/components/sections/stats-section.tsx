"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";

type StatCardProps = {
  value: number;
  suffix: string;
  label: string;
};

const stats = [
  { value: 1000, suffix: "+", label: "Hackathons" },
  { value: 250, suffix: "+", label: "Competitions" },
  { value: 150, suffix: "+", label: "Internships" },
  { value: 10000, suffix: "+", label: "Students" },
];

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1100, 1);
      setValue(Math.round(target * progress));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function StatCard({ value, suffix, label }: StatCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const count = useCountUp(value, inView);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[1.75rem] border border-border bg-surface p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
      )}
    >
      <div className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {count}
        {suffix}
      </div>
      <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
