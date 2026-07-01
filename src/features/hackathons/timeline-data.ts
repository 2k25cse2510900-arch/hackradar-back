import type { Hackathon } from "@/lib/api";

export type TimelineStatus = "Completed" | "Current" | "Upcoming";

export type TimelineStage = {
  label: string;
  date: string;
  description?: string;
  status: TimelineStatus;
};

export type HackathonTimeline = {
  stages: TimelineStage[];
  officialWebsite?: string;
};

const now = new Date("2026-06-28T00:00:00+05:30");

function parseHackathonDate(value: string) {
  const cleaned = value.replace(/[^0-9A-Za-z]+/g, " ").trim();
  const match = cleaned.match(/(\d{1,2})(?:\s+\d{1,2})?\s+([A-Za-z]{3,9})\s+(\d{4})/);
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]} ${match[3]} 12:00:00 GMT+0530`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Calcutta",
  }).format(date);
}

function shiftDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildTimeline(hackathon: Hackathon): HackathonTimeline {
  const deadline = parseHackathonDate(hackathon.deadline);
  const eventStart = parseHackathonDate(hackathon.eventDates) ?? (deadline ? shiftDays(deadline, 21) : shiftDays(now, 21));
  const eventEnd = shiftDays(eventStart, 2);
  const registrationOpen = deadline ? shiftDays(deadline, -42) : shiftDays(eventStart, -60);
  const teamFormation = deadline ? shiftDays(deadline, -14) : shiftDays(eventStart, -24);
  const screening = shiftDays(eventStart, -10);
  const mentoring = shiftDays(eventStart, -4);
  const finale = shiftDays(eventEnd, -1);
  const winnerAnnouncement = shiftDays(eventEnd, 7);

  const rawStages = [
    {
      label: "Registration Opens",
      date: formatDate(registrationOpen),
      description: `${hackathon.organizer} opens applications for ${hackathon.name}.`,
      sortDate: registrationOpen,
    },
    {
      label: "Team Formation Deadline",
      date: formatDate(teamFormation),
      description: "Teams finalize members and confirm participation details.",
      sortDate: teamFormation,
    },
    {
      label: "Registration Deadline",
      date: hackathon.deadline,
      description: "Last day to complete the application before selection begins.",
      sortDate: deadline ?? eventStart,
    },
    {
      label: "Screening Round",
      date: formatDate(screening),
      description: "Applications are reviewed and shortlisted by the organizers.",
      sortDate: screening,
    },
    {
      label: "Mentoring",
      date: formatDate(mentoring),
      description: "Shortlisted teams receive guidance and build feedback.",
      sortDate: mentoring,
    },
    {
      label: "Hackathon Begins",
      date: hackathon.eventDates,
      description: "Build time starts and teams begin working on their submissions.",
      sortDate: eventStart,
    },
    {
      label: "Final Presentation",
      date: formatDate(finale),
      description: "Teams present finished projects to judges and mentors.",
      sortDate: finale,
    },
    {
      label: "Winner Announcement",
      date: formatDate(winnerAnnouncement),
      description: "Final results and prizes are announced by the organizers.",
      sortDate: winnerAnnouncement,
    },
  ];

  const stagesSorted = rawStages.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  const currentIndex = stagesSorted.findIndex((stage) => stage.sortDate.getTime() >= now.getTime());

  return {
    stages: stagesSorted.map((stage, index) => ({
      label: stage.label,
      date: stage.date,
      description: stage.description,
      status:
        currentIndex === -1
          ? index === stagesSorted.length - 1
            ? "Current"
            : "Completed"
          : index < currentIndex
            ? "Completed"
            : index === currentIndex
              ? "Current"
              : "Upcoming",
    })),
    officialWebsite: hackathon.officialWebsite,
  };
}

const timelineCache = new Map<string, HackathonTimeline>();

export function getHackathonTimeline(hackathon: Hackathon) {
  const cached = timelineCache.get(hackathon.id);
  if (cached) return cached;
  const timeline = buildTimeline(hackathon);
  timelineCache.set(hackathon.id, timeline);
  return timeline;
}
