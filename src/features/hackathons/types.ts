import type { Hackathon } from "@/lib/api";

export type { Hackathon };

export type HackathonFilters = {
  modes: string[];
  statuses: string[];
  domains: string[];
  difficulties: string[];
  registrations: string[];
  prizeBands: string[];
};

export type HackathonFilterKey = keyof Pick<
  HackathonFilters,
  "modes" | "statuses" | "domains" | "difficulties" | "registrations" | "prizeBands"
>;

export const defaultHackathonFilters: HackathonFilters = {
  modes: [],
  statuses: [],
  domains: [],
  difficulties: [],
  registrations: [],
  prizeBands: [],
};

export const hackathonFilterOptions = {
  modes: ["Online", "Offline", "Hybrid"],
  statuses: ["Live", "Upcoming"],
  domains: [
    "AI",
    "Web Development",
    "Cyber Security",
    "Blockchain",
    "Open Source",
    "IoT",
    "Robotics",
    "Cloud",
    "Data Science",
    "Mobile Development",
    "GovTech",
    "Social Impact",
  ],
  difficulties: ["Beginner", "Intermediate", "Advanced"],
  registrations: ["Free", "Paid"],
  prizeBands: ["High", "Medium", "Low"],
} as const;
