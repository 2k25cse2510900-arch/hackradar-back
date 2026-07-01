import type { Hackathon, UserProfile } from "@/lib/api";

export type RecommendationResult = {
  hackathon: Hackathon;
  matchScore: number;
  reasons: string[];
};

const experienceRank = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
} as const;

function normalize(values: string[]) {
  return values.map((value) => value.toLowerCase());
}

function hasMatch(profileValues: string[], candidate: string) {
  return normalize(profileValues).includes(candidate.toLowerCase());
}

export function recommendHackathons(
  hackathons: Hackathon[],
  profile: UserProfile
): RecommendationResult[] {
  return hackathons
    .map((hackathon) => {
      let score = 0;
      const reasons: string[] = [];

      if (hasMatch(profile.domains, hackathon.domain)) {
        score += 35;
        reasons.push(`Matches your preferred ${hackathon.domain} domain`);
      }

      const skillMatches = profile.skills.filter((skill) =>
        hasMatch([hackathon.name, hackathon.description, hackathon.domain], skill)
      );
      if (skillMatches.length > 0) {
        score += Math.min(30, skillMatches.length * 10);
        reasons.push(`Matches your ${skillMatches[0]} skills`);
      }

      if (experienceRank[profile.experienceLevel] >= experienceRank[hackathon.difficulty]) {
        score += 15;
        reasons.push(`${hackathon.difficulty} friendly`);
      } else if (profile.experienceLevel === "Intermediate" && hackathon.difficulty === "Advanced") {
        score += 6;
        reasons.push("Stretch opportunity for your experience level");
      }

      if (profile.preferredMode === hackathon.mode || profile.preferredMode === "Hybrid") {
        score += 10;
        reasons.push(`${hackathon.mode} event`);
      }

      const goalMatches = profile.goals.some((goal) => {
        const normalizedGoal = goal.toLowerCase();
        return (
          (normalizedGoal.includes("learning") && hackathon.difficulty !== "Advanced") ||
          (normalizedGoal.includes("win") && hackathon.prizeBand === "High") ||
          (normalizedGoal.includes("portfolio") && hackathon.difficulty !== "Advanced") ||
          (normalizedGoal.includes("open source") && hackathon.domain === "Open Source") ||
          (normalizedGoal.includes("internship") && hackathon.prizePool.toLowerCase().includes("internship"))
        );
      });
      if (goalMatches) {
        score += 10;
        reasons.push("Supports one of your current goals");
      }

      if (profile.availability === "Weekends" && hackathon.eventDates.toLowerCase().includes("ongoing")) {
        score += 5;
      }

      return {
        hackathon,
        matchScore: Math.min(99, score),
        reasons: Array.from(new Set(reasons)).slice(0, 4),
      };
    })
    .filter((item) => item.matchScore >= 60)
    .sort((a, b) => b.matchScore - a.matchScore);
}
