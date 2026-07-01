"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Globe2,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const highlights = ["AI Recommendations", "Deadline Alerts", "Smart Tracking", "Unified Discovery"];

const cards = [
  {
    name: "Google Solution Challenge",
    status: "Registration Open",
    prize: "Global Recognition + Cash Awards",
    mode: "Hybrid",
    tags: ["AI", "Google Cloud", "SDGs"],
  },
  {
    name: "Smart India Hackathon (SIH)",
    status: "National Innovation Challenge",
    prize: "Cash Awards + National Recognition",
    mode: "Hybrid",
    tags: ["GovTech", "Innovation", "Team"],
  },
  {
    name: "Microsoft Imagine Cup",
    status: "Global Student Startup Competition",
    prize: "USD 100,000 + Mentorship",
    mode: "Global",
    tags: ["AI", "Startup", "Microsoft"],
  },
];

type HackathonCardProps = {
  name: string;
  status: string;
  prize: string;
  mode: string;
  tags: string[];
};

const whyHackRadar = [
  {
    title: "AI Recommendations",
    description: "Receive personalized hackathon suggestions based on your skills, interests, and experience level.",
  },
  {
    title: "Smart Deadline Alerts",
    description: "Stay informed with timely reminders for registrations, submissions, presentations, and important event milestones.",
  },
  {
    title: "Event Timelines",
    description: "Access complete event schedules, including registration deadlines, submission dates, mentoring sessions, and final presentations.",
  },
  {
    title: "Unified Discovery",
    description: "Explore hackathons from multiple trusted platforms through one centralized and organized experience.",
  },
];

const perfectFor = [
  "College Students",
  "Developers",
  "Student Teams",
  "Innovation Clubs",
  "Tech Communities",
];

const currentMvp = [
  "AI-Powered Recommendations",
  "Explore Hackathons",
  "Enrolled Tracking",
  "Event Timeline",
  "Smart Notifications",
  "Alerts Management",
];

const futureRoadmap = [
  "Calendar Integration",
  "One-Click Event Reminders",
  "Personalized Alert Rules",
  "AI Priority Scoring",
  "Cross-Platform Event Sync",
];

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

function LearnMoreModal() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
       Instead of searching across multiple websites, HackRadar brings verified hackathons, event timelines, smart reminders, and personalized recommendations together in one place—making it easier to focus on learning, building, and competing.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="size-4" />
          Why HackRadar?
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {whyHackRadar.map((item) => (
            <Card key={item.title} className="border-border/70 bg-background p-4 shadow-none">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Perfect For</h3>
        <div className="flex flex-wrap gap-2">
          {perfectFor.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">CURRENT FEATURES</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {currentMvp.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3">
              <CheckCircle2 className="size-4 shrink-0 text-success" />
              <span className="text-sm font-medium text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Coming Soon</h3>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Coming Soon
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {futureRoadmap.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button asChild size="lg" className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white">
          <Link href="/hackathons">Explore Hackathons</Link>
        </Button>
      </div>
    </div>
  );
}

export function Hero() {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

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
            <span className="font-medium">AI-Powered Hackathon Discovery Platform</span>
          </div>

          <h1 className="mt-12 max-w-xl select-none text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            One Platform.
            Every Hackathon.
            <span className="block text-muted-foreground">Zero Missed Deadlines.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Discover hackathons, track deadlines, and get AI-powered recommendations - all in one place.
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
            <Button size="lg" variant="outline" type="button" onClick={() => setLearnMoreOpen(true)}>
              Learn More
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

      <Dialog open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
        <DialogContent className="p-0">
          <div className="max-h-[86vh] overflow-y-auto [scrollbar-width:thin]" style={{ scrollbarColor: "var(--border) transparent" }}>
            <div className="border-b border-border/70 bg-surface px-6 py-6 sm:px-7">
              <DialogHeader className="pr-10 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle>What is HackRadar?</DialogTitle>
                    <DialogDescription className="mt-1 font-medium text-foreground">
                      Never miss a hackathon again.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="px-6 py-6 sm:px-7">
              <div className="space-y-6">
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                  HackRadar is an AI-powered platform that helps students discover, track, and manage hackathons from
                  multiple platforms in one place.
                </p>

                <LearnMoreModal />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
