"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type WorkflowStep = {
  step: string;
  title: string;
  description: string;
  expandedTitle: string;
  expandedDescription: string;
  bullets: string[];
};

const workflowSteps: WorkflowStep[] = [
  {
    step: "1",
    title: "Discover",
    description: "Explore verified hackathons collected from multiple trusted platforms.",
    expandedTitle: "Find opportunities faster",
    expandedDescription:
      "Find relevant hackathons without visiting multiple websites.",
    bullets: ["Browse verified opportunities", "Search by domain and category", "Save time discovering events"],
  },
  {
    step: "2",
    title: "Personalize",
    description: "Customize HackRadar to match your interests.",
    expandedTitle: "Tune HackRadar to you",
    expandedDescription:
      "Tell HackRadar about your skills and preferred domains to receive smarter recommendations.",
    bullets: ["Select technical skills", "Choose preferred domains", "Get AI-powered recommendations"],
  },
  {
    step: "3",
    title: "Track",
    description: "Monitor every hackathon from one place.",
    expandedTitle: "Stay on top of every timeline",
    expandedDescription:
      "Track registrations, timelines and enrolled hackathons through a centralized workspace.",
    bullets: ["Registration deadlines", "Event timelines", "Enrolled hackathons"],
  },
  {
    step: "4",
    title: "Stay Updated",
    description: "Never miss important hackathon milestones.",
    expandedTitle: "Get timely reminders",
    expandedDescription:
      "Receive reminders before registrations, submissions and presentations.",
    bullets: ["Registration reminders", "Submission alerts", "Final presentation reminders"],
  },
  {
    step: "5",
    title: "Manage Alerts",
    description: "Choose how HackRadar keeps you informed.",
    expandedTitle: "Control your reminder channels",
    expandedDescription:
      "Customize reminder methods according to your preferences.",
    bullets: ["Email Notifications", "Browser Notifications", "Telegram Alerts", "WhatsApp Alerts", "AI Reminder Calls"],
  },
  {
    step: "6",
    title: "Build with Confidence",
    description: "Focus on your project while HackRadar handles the deadlines.",
    expandedTitle: "Keep momentum through the full journey",
    expandedDescription:
      "Stay organized throughout the complete hackathon journey.",
    bullets: ["Smart deadline tracking", "Organized workflow", "Never miss important events"],
  },
];

function useHoverCapablePointer() {
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return hoverCapable;
}

export function HackRadarWorkflowGrid() {
  const hoverCapable = useHoverCapablePointer();
  const [activeIndex, setActiveIndex] = useState(0);
  const collapseTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (collapseTimer.current !== null) {
        window.clearTimeout(collapseTimer.current);
      }
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workflowSteps.map((item, index) => {
        const expanded = activeIndex === index;

        return (
          <button
            key={item.step}
            type="button"
            onMouseEnter={() => {
              if (!hoverCapable) {
                return;
              }

              if (collapseTimer.current !== null) {
                window.clearTimeout(collapseTimer.current);
                collapseTimer.current = null;
              }

              setActiveIndex(index);
            }}
            onMouseLeave={() => {
              if (!hoverCapable) {
                return;
              }

              if (collapseTimer.current !== null) {
                window.clearTimeout(collapseTimer.current);
              }

              collapseTimer.current = window.setTimeout(() => {
                setActiveIndex((current) => (current === index ? -1 : current));
                collapseTimer.current = null;
              }, 250);
            }}
            onFocus={() => {
              if (hoverCapable) {
                setActiveIndex(index);
              }
            }}
            onBlur={() => {
              if (hoverCapable) {
                setActiveIndex((current) => (current === index ? -1 : current));
              }
            }}
            onClick={() => {
              if (hoverCapable) {
                return;
              }

              setActiveIndex((current) => (current === index ? -1 : index));
            }}
            className={cn(
              "group relative overflow-hidden rounded-[1.75rem] border border-border bg-surface p-6 text-left shadow-[0_10px_30px_rgba(0,0,0,0.04)] outline-none transition-[transform,box-shadow,border-color] duration-300 ease-in-out",
              hoverCapable
                ? expanded
                  ? "-translate-y-1 border-primary/40 shadow-[0_18px_44px_rgba(0,0,0,0.08)]"
                  : "hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_14px_38px_rgba(0,0,0,0.06)] focus-visible:-translate-y-1 focus-visible:border-primary/30 focus-visible:shadow-[0_14px_38px_rgba(0,0,0,0.06)]"
                : expanded
                  ? "-translate-y-1 border-primary/40 shadow-[0_18px_44px_rgba(0,0,0,0.08)]"
                  : ""
            )}
            aria-expanded={expanded}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {item.step}
              </span>
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-transform duration-300 ease-in-out",
                  expanded ? "rotate-180" : "rotate-0",
                  hoverCapable ? "group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5" : ""
                )}
              >
                <ChevronDown
                  className="size-4 -rotate-90"
                />
              </div>
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity,transform] duration-300 ease-in-out will-change-[grid-template-rows,opacity,transform]",
                hoverCapable
                  ? expanded
                    ? "mt-5 grid-rows-[1fr] opacity-100"
                    : "mt-3 grid-rows-[0fr] opacity-0 -translate-y-1"
                  : expanded
                    ? "mt-5 grid-rows-[1fr] opacity-100"
                    : "mt-3 grid-rows-[0fr] opacity-0 -translate-y-1"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 pt-1">
                  <div>
                    <p className="text-base font-medium text-foreground">{item.expandedTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.expandedDescription}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-success" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
