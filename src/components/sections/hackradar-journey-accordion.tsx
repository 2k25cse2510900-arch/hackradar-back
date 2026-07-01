"use client";

import { useState } from "react";
import {
  BellRing,
  ChevronDown,
  ListChecks,
  Sparkles,
  Telescope,
  WandSparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const journeySteps = [
  {
    title: "Discover",
    icon: Telescope,
    description:
      "Browse verified hackathons from multiple trusted platforms in one organized place instead of checking different websites manually.",
    bullets: ["Browse verified hackathons", "Filter by interests", "Save opportunities"],
    short: "One place for trusted opportunities.",
  },
  {
    title: "Personalize",
    icon: WandSparkles,
    description:
      "Choose your skills, interests and preferred domains to receive AI-powered hackathon recommendations tailored specifically for you.",
    bullets: ["Select skills", "Choose preferred domains", "Receive AI recommendations"],
    short: "Match opportunities to your profile.",
  },
  {
    title: "Track",
    icon: ListChecks,
    description:
      "Track registrations, submission deadlines, event timelines and all your enrolled hackathons from one centralized workspace.",
    bullets: ["Registration deadlines", "Submission timelines", "Enrolled hackathons"],
    short: "Keep every timeline in view.",
  },
  {
    title: "Stay Updated",
    icon: BellRing,
    description:
      "Receive smart reminders through Email, Browser, Telegram, WhatsApp and AI Call before every important deadline so you never miss an opportunity.",
    bullets: ["Browser reminders", "Email alerts", "WhatsApp & Telegram"],
    short: "Never miss a milestone.",
  },
] as const;

export function HackRadarJourneyAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="space-y-4">
        {journeySteps.map((step, index) => {
          const expanded = index === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.title} className="rounded-[1.5rem] border border-border bg-background">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    expanded ? "border-primary bg-primary text-background" : "border-border bg-surface text-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.short}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                    expanded ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border px-5 pb-5 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-muted text-foreground">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                        <ul className="mt-4 space-y-2 text-sm text-foreground">
                          {step.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-3">
                              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
