"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarDays, Globe2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const highlights = ["Hackathons", "Competitions", "Internships", "Innovation"];

const cards = [
  {
    name: "Google Solution Challenge",
    status: "Applications open",
    prize: "$50K+ in rewards",
    mode: "Hybrid",
    tags: ["AI", "Cloud", "Student"],
  },
  {
    name: "SIH 2026",
    status: "Upcoming",
    prize: "National recognition",
    mode: "In-person",
    tags: ["GovTech", "Team", "Build"],
  },
  {
    name: "Microsoft Imagine Cup",
    status: "Featured",
    prize: "$100K grand prize",
    mode: "Remote",
    tags: ["Startup", "AI", "Global"],
  },
];

type HackathonCardProps = {
  name: string;
  status: string;
  prize: string;
  mode: string;
  tags: string[];
};

function HackathonCard({
  name,
  status,
  prize,
  mode,
  tags,
}: HackathonCardProps) {
  return (
    <motion.article
      initial={{ y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "flex h-full min-h-[12rem] w-full flex-col justify-between rounded-[1.75rem] border border-border bg-surface p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-200 ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_34px_rgba(0,0,0,0.05)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{status}</p>
        </div>
        <BadgeCheck className="size-5 shrink-0 text-primary" />
      </div>

      <div className="mt-6 grid gap-3 text-sm text-foreground sm:grid-cols-3">
        <div className="min-h-24 rounded-2xl bg-background px-4 py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            Prize
          </div>
          <p className="mt-2 font-medium leading-6">{prize}</p>
        </div>
        <div className="min-h-24 rounded-2xl bg-background px-4 py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe2 className="size-4 shrink-0" />
            Mode
          </div>
          <p className="mt-2 font-medium leading-6">{mode}</p>
        </div>
        <div className="min-h-24 rounded-2xl bg-background px-4 py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Search className="size-4 shrink-0" />
            Tags
          </div>
          <p className="mt-2 font-medium leading-6">{tags.join(" · ")}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-8 sm:pt-12 lg:pt-16">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-20 px-4 pb-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-24 lg:px-8 lg:pb-28">
        <motion.div
          initial={{ y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-sm">
            <span className="text-base">🚀</span>
            <span className="font-medium">AI Powered Hackathon Discovery Platform</span>
          </div>

          <h1 className="mt-12 max-w-xl select-none text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Find your next hackathon.
            <span className="block text-muted-foreground">Faster.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Discover hackathons, coding competitions, internships and innovation challenges
            from one modern platform.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white"
            >
              <a href="/hackathons" className="text-white hover:text-white">
                Explore Hackathons
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#learn-more">Learn More</a>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-2.5">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="relative self-stretch"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] border border-border/40 bg-muted/20 blur-3xl" />
          <div className="grid gap-4 sm:gap-5">
            {cards.map((card) => (
              <HackathonCard
                key={card.name}
                name={card.name}
                status={card.status}
                prize={card.prize}
                mode={card.mode}
                tags={card.tags}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
