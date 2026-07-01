"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { ProtectedPage } from "@/components/auth/protected-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAuthUserDisplayName,
  getProfile,
  requestTelegramVerificationCode,
  updateProfile,
  type UserProfile,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers";

const domains = [
  "AI",
  "Web Development",
  "Cyber Security",
  "Cloud Computing",
  "Blockchain",
  "Data Science",
  "IoT",
  "Robotics",
  "Open Source",
  "Mobile Development",
  "Game Development",
];

const skills = [
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Python",
  "Java",
  "C++",
  "Flutter",
  "Machine Learning",
  "Prompt Engineering",
  "Git",
  "GitHub",
];

const goals = ["Win Hackathons", "Learning", "Internship", "Networking", "Build Portfolio", "Research", "Open Source"];

const modes = ["Online", "Offline", "Hybrid"];
const availability = ["Weekdays", "Weekends", "Anytime"];
const experienceLevels: UserProfile["experienceLevel"][] = ["Beginner", "Intermediate", "Advanced"];
const emptyProfile: UserProfile = {
  name: "",
  college: "",
  year: "",
  degree: "",
  domains: [],
  skills: [],
  experienceLevel: "Beginner",
  goals: [],
  preferredMode: "Online",
  availability: "Anytime",
  phoneNumber: "",
};

function ToggleGroup({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => {
          const active = selected.includes(value);
          return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onToggle(value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    active
                  ? "border-primary-border bg-primary-soft text-primary shadow-[0_10px_20px_rgba(124,58,237,0.12)] dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
                  : "border-border bg-surface text-foreground hover:bg-muted"
                  )}
                >
                  {value}
                </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border/70 bg-surface p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function TelegramQrCard() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-border/70 bg-background p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] dark:bg-slate-950/55">
      <div className="rounded-2xl bg-white p-4 dark:bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">@hackradar_alerts_bot</p>
            <p className="text-xs text-slate-500">Official HackRadar Telegram Bot</p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
          <Image
            src="/telegram-qr.png"
            alt="Official HackRadar Telegram QR code"
            width={220}
            height={220}
            className="h-auto w-full rounded-xl object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function TelegramVerificationCard({
  code,
  loading,
  onRefresh,
}: {
  code: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied!");

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-border/70 bg-background p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] dark:bg-slate-950/55">
      <div className="rounded-2xl border border-border/60 bg-surface p-5 text-center">
        <p className="text-sm font-semibold tracking-tight text-foreground">Your Telegram Verification ID</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Use this unique ID when the HackRadar Telegram Bot asks for your verification code.
        </p>

        <div className="mt-5 rounded-2xl border border-border/60 bg-background px-4 py-5">
          <p className="font-mono text-3xl font-semibold tracking-[0.25em] text-foreground sm:text-4xl">
            {loading ? "......" : code || "------"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button type="button" variant="secondary" className="h-10 px-4" onClick={copyId} disabled={!code || loading}>
            {copied ? "Copied!" : "Copy ID"}
          </Button>
          <Button type="button" variant="outline" className="h-10 px-4" onClick={onRefresh} disabled={loading}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [telegramCode, setTelegramCode] = useState("");
  const [telegramLoading, setTelegramLoading] = useState(true);

  const loadTelegramCode = async () => {
    try {
      setTelegramLoading(true);
      const result = await requestTelegramVerificationCode();
      setTelegramCode(result.code);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load Telegram code");
    } finally {
      setTelegramLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        const result = await getProfile();
        if (active) {
          setProfile({
            ...emptyProfile,
            ...result.profile,
            phoneNumber: result.profile.phoneNumber || user?.phoneNumber || "",
          });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load profile");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    requestTelegramVerificationCode()
      .then((result) => {
        if (active) {
          setTelegramCode(result.code);
        }
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load Telegram code");
      })
      .finally(() => {
        if (active) {
          setTelegramLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user?.phoneNumber]);

  const toggleMulti = (field: "domains" | "skills" | "goals") => (value: string) => {
    setProfile((current) => {
      const selected = current[field];
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      return { ...current, [field]: next };
    });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const result = await updateProfile(profile);
      setProfile({ ...emptyProfile, ...result.profile });
      await refreshUser();
      toast.success("Profile Saved Successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                User Profile
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Help HRAI understand your interests so we can recommend the most relevant hackathons.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-10 grid gap-4"
            >
              <Card className="border-border/70 bg-surface p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      {profile.name || getAuthUserDisplayName(user) || "User"}
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    {user?.telegramVerified ? "Telegram Verified" : "HackRadar User"}
                  </div>
                </div>
              </Card>

              <SectionCard title="Basic Information">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={profile.name}
                    onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                    placeholder="Name"
                  />
                  <Input
                    value={profile.college}
                    onChange={(event) => setProfile({ ...profile, college: event.target.value })}
                    placeholder="College"
                  />
                  <Input
                    value={profile.year}
                    onChange={(event) => setProfile({ ...profile, year: event.target.value })}
                    placeholder="Year"
                  />
                  <Input
                    value={profile.degree}
                    onChange={(event) => setProfile({ ...profile, degree: event.target.value })}
                    placeholder="Degree"
                  />
                  <Input
                    value={profile.phoneNumber || ""}
                    onChange={(event) => setProfile({ ...profile, phoneNumber: event.target.value })}
                    placeholder="Phone Number"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Preferred Domains">
                <ToggleGroup label="" values={domains} selected={profile.domains} onToggle={toggleMulti("domains")} />
              </SectionCard>

              <SectionCard title="Skills">
                <ToggleGroup label="" values={skills} selected={profile.skills} onToggle={toggleMulti("skills")} />
              </SectionCard>

              <SectionCard title="Experience Level">
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setProfile({ ...profile, experienceLevel: level })}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      profile.experienceLevel === level
                          ? "border-primary-border bg-primary-soft text-primary shadow-[0_10px_20px_rgba(124,58,237,0.12)] dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
                          : "border-border bg-surface text-foreground hover:bg-muted"
                    )}
                  >
                    {level}
                  </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Goals">
                <ToggleGroup label="" values={goals} selected={profile.goals} onToggle={toggleMulti("goals")} />
              </SectionCard>

              <SectionCard title="Preferred Mode">
                <div className="flex flex-wrap gap-2">
                  {modes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setProfile({ ...profile, preferredMode: mode })}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      profile.preferredMode === mode
                          ? "border-primary-border bg-primary-soft text-primary shadow-[0_10px_20px_rgba(124,58,237,0.12)] dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
                          : "border-border bg-surface text-foreground hover:bg-muted"
                    )}
                  >
                    {mode}
                  </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Availability">
                <div className="flex flex-wrap gap-2">
                  {availability.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setProfile({ ...profile, availability: item })}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      profile.availability === item
                          ? "border-primary-border bg-primary-soft text-primary shadow-[0_10px_20px_rgba(124,58,237,0.12)] dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
                          : "border-border bg-surface text-foreground hover:bg-muted"
                    )}
                  >
                    {item}
                  </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Telegram Alerts">
                <div className="space-y-5">
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    Stay updated with instant HackRadar notifications directly on Telegram.
                    Receive reminders for registration deadlines, submission deadlines, PPT deadlines, result announcements,
                    personalized hackathon alerts and AI-powered reminders in the future.
                  </p>

                  <TelegramQrCard />

                  <div className="mx-auto flex max-w-sm flex-col items-stretch gap-3">
                    <Button asChild className="h-12 w-full gap-2 px-5">
                      <Link href="https://t.me/hackradar_alerts_bot" target="_blank" rel="noopener noreferrer">
                        Connect Telegram Bot
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <p className="text-center text-xs leading-5 text-muted-foreground">
                      Scan the QR code or click the button to connect with the official HackRadar Telegram Bot.
                    </p>
                  </div>

                  <TelegramVerificationCard code={telegramCode} loading={telegramLoading} onRefresh={loadTelegramCode} />

                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    When the Telegram Bot asks for your HackRadar ID, simply copy and paste this code.
                  </p>
                </div>
              </SectionCard>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={saveProfile}
                  disabled={loading || saving}
                  className="h-12 px-6 text-base"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
    </ProtectedPage>
  );
}
