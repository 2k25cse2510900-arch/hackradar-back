"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BellRing,
  BookmarkMinus,
  CalendarDays,
  CalendarRange,
  CircleDot,
  MapPin,
  Rocket,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button, Card, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
import { createAlert } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Hackathon } from "../types";
import { getHackathonTimeline, type TimelineStage } from "../timeline-data";

type HackathonCardProps = {
  hackathon: Hackathon;
  index: number;
  tracked?: boolean;
  enrolledMode?: boolean;
  showNotifications?: boolean;
  recommendationScore?: number;
  recommendationReasons?: string[];
  recommendationLabel?: string;
  onRemove?: (hackathon: Hackathon) => void;
  onTrack?: (hackathon: Hackathon) => void;
  onOpenNotifications?: (hackathon: Hackathon) => void;
};

function Badge({ children, tone }: { children: ReactNode; tone?: "default" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tone === "muted"
          ? "border-border bg-background text-muted-foreground"
          : "border-border bg-surface text-foreground"
      )}
    >
      {children}
    </span>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-background px-3 py-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function TrackButton({
  tracked,
  enrolledMode,
  showNotifications,
  onTrack,
  onOpenNotifications,
  hackathon,
}: {
  tracked?: boolean;
  enrolledMode?: boolean;
  showNotifications?: boolean;
  onTrack?: (hackathon: Hackathon) => void;
  onOpenNotifications?: (hackathon: Hackathon) => void;
  hackathon: Hackathon;
}) {
  if (enrolledMode) {
    return (
      <Button
        type="button"
        onClick={() => onOpenNotifications?.(hackathon)}
        className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white"
      >
        <BellRing className="size-4" />
        {showNotifications ? "Notifications" : "Tracking"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => onTrack?.(hackathon)}
      className={cn(
        "relative overflow-hidden shadow-[0_10px_28px_rgba(124,58,237,0.18)]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        tracked ? "opacity-95" : ""
      )}
      aria-pressed={tracked}
    >
      <motion.span
        animate={tracked ? { opacity: [0.96, 1, 0.96] } : { opacity: [0.98, 1, 0.98] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="inline-flex items-center gap-2"
      >
        <Target className="size-4" />
        {tracked ? "Tracked" : "Track"}
      </motion.span>
    </Button>
  );
}

function TimelineStatusPill({ status }: { status: TimelineStage["status"] }) {
  const tone =
    status === "Completed"
      ? "border-success/20 bg-success/10 text-success dark:border-success/30 dark:bg-success/15"
      : status === "Current"
        ? "border-primary-border bg-primary-soft text-primary dark:bg-[rgba(124,58,237,0.16)] dark:text-[#E9D5FF]"
        : "border-border bg-background text-muted-foreground";

  return <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", tone)}>{status}</span>;
}

type HackathonNotificationPreferences = {
  whatsapp: boolean;
  telegram: boolean;
  browser: boolean;
  email: boolean;
  aiReminderCall: boolean;
  reminderTiming: "24" | "12" | "6" | "1";
};

const DEFAULT_NOTIFICATION_PREFERENCES: HackathonNotificationPreferences = {
  whatsapp: false,
  telegram: false,
  browser: false,
  email: false,
  aiReminderCall: false,
  reminderTiming: "24",
};

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-surface shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

function TimingOption({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: HackathonNotificationPreferences["reminderTiming"];
  current: HackathonNotificationPreferences["reminderTiming"];
  onSelect: (value: HackathonNotificationPreferences["reminderTiming"]) => void;
}) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm transition-all",
        active
          ? "border-primary-border bg-primary-soft text-primary dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
          : "border-border bg-background text-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}

export function HackathonNotificationsDialog({ hackathon }: { hackathon: Hackathon }) {
  const [preferences, setPreferences] = useState<HackathonNotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [saving, setSaving] = useState(false);

  const savePreferences = async () => {
    const channels = [
      preferences.email ? "email" : null,
      preferences.telegram ? "telegram" : null,
      preferences.browser ? "browser" : null,
      preferences.whatsapp ? "whatsapp" : null,
      preferences.aiReminderCall ? "call" : null,
    ].filter(Boolean) as string[];

    if (channels.length === 0) {
      toast.error("Select at least one notification channel");
      return;
    }

    if (!hackathon.registrationDeadline) {
      toast.error("This hackathon does not have a registration deadline for reminders");
      return;
    }

    try {
      setSaving(true);
      await createAlert({
        hackathonId: hackathon.id,
        title: `${hackathon.name} reminder`,
        channels,
        frequency: "once",
        settings: preferences,
      });
      toast.success("Preferences Saved Successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent className="p-0">
      <div className="max-h-[86vh] overflow-y-auto [scrollbar-width:thin]" style={{ scrollbarColor: "var(--border) transparent" }}>
        <div className="border-b border-border/70 bg-surface px-6 py-6 sm:px-7">
          <DialogHeader className="pr-10 text-left">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-sm font-semibold text-foreground">
                {hackathon.logo}
              </div>
              <div className="min-w-0">
                <DialogTitle>{hackathon.name}</DialogTitle>
                <DialogDescription className="mt-1">{hackathon.organizer}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 sm:px-7">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Notification Preferences</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Manage reminder preferences for this hackathon only.
              </p>
            </div>

            <div className="grid gap-3">
              <ToggleRow
                title="WhatsApp Alerts"
                description="Receive important hackathon reminders on WhatsApp."
                checked={preferences.whatsapp}
                onChange={(value) => setPreferences((current) => ({ ...current, whatsapp: value }))}
              />
              <ToggleRow
                title="Telegram Alerts"
                description="Receive instant Telegram notifications."
                checked={preferences.telegram}
                onChange={(value) => setPreferences((current) => ({ ...current, telegram: value }))}
              />
              <ToggleRow
                title="Browser Notifications"
                description="Receive notifications directly in your browser."
                checked={preferences.browser}
                onChange={(value) => setPreferences((current) => ({ ...current, browser: value }))}
              />
              <ToggleRow
                title="Email Notifications"
                description="Receive updates by email."
                checked={preferences.email}
                onChange={(value) => setPreferences((current) => ({ ...current, email: value }))}
              />
              <ToggleRow
                title="AI Reminder Call"
                description="Receive an AI-powered reminder call before important deadlines and events."
                checked={preferences.aiReminderCall}
                onChange={(value) => setPreferences((current) => ({ ...current, aiReminderCall: value }))}
              />
            </div>

            <div className="rounded-[1.75rem] border border-border bg-background p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Reminder Timing</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <TimingOption
                  label="24 Hours Before"
                  value="24"
                  current={preferences.reminderTiming}
                  onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                />
                <TimingOption
                  label="12 Hours Before"
                  value="12"
                  current={preferences.reminderTiming}
                  onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                />
                <TimingOption
                  label="6 Hours Before"
                  value="6"
                  current={preferences.reminderTiming}
                  onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                />
                <TimingOption
                  label="1 Hour Before"
                  value="1"
                  current={preferences.reminderTiming}
                  onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                />
              </div>
            </div>

            <Button type="button" onClick={savePreferences} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function getTimelineIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("registration")) return <CalendarDays className="size-4" />;
  if (normalized.includes("team")) return <CircleDot className="size-4" />;
  if (normalized.includes("screen")) return <Target className="size-4" />;
  if (normalized.includes("mentor")) return <Rocket className="size-4" />;
  if (normalized.includes("winner")) return <ArrowUpRight className="size-4" />;
  if (normalized.includes("final")) return <CalendarRange className="size-4" />;
  return <CircleDot className="size-4" />;
}

function TimelineDialog({ hackathon }: { hackathon: Hackathon }) {
  const timeline = getHackathonTimeline(hackathon);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <DialogContent className="p-0">
        <div
          className="max-h-[86vh] overflow-y-auto [scrollbar-width:thin]"
          style={{
            scrollbarColor: "var(--border) transparent",
          }}
        >
          <div className="border-b border-border/70 bg-surface px-6 py-6 sm:px-7">
            <DialogHeader className="pr-10 text-left">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-sm font-semibold text-foreground">
                  {hackathon.logo}
                </div>
                <div className="min-w-0">
                  <DialogTitle>{hackathon.name}</DialogTitle>
                  <DialogDescription className="mt-1">{hackathon.organizer}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 py-6 sm:px-7">
            <div className="relative">
              <div className="absolute left-[1.45rem] top-2 bottom-2 w-px bg-border sm:left-[1.55rem]" />
              <div className="space-y-4 sm:space-y-5">
                {timeline.stages.map((stage) => (
                  <div key={`${hackathon.id}-${stage.label}`} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4">
                    <div className="relative flex items-center justify-center pt-1">
                      <div className="relative z-10 flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm">
                        {getTimelineIcon(stage.label)}
                      </div>
                    </div>
                    <Card className="min-w-0 border-border/70 bg-background/70 p-4 shadow-none sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold leading-6 text-foreground">{stage.label}</h4>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{stage.description}</p>
                          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                            <CalendarDays className="size-4 text-muted-foreground" />
                            {stage.date}
                          </div>
                        </div>
                        <div className="pt-0.5">
                          <TimelineStatusPill status={stage.status} />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("mt-6 grid gap-3", timeline.officialWebsite ? "sm:grid-cols-2" : "grid-cols-1")}>
              {timeline.officialWebsite ? (
                <Button asChild variant="outline" className="w-full">
                  <a href={timeline.officialWebsite} target="_blank" rel="noreferrer">
                    <ArrowUpRight className="size-4" />
                    Open Official Website
                  </a>
                </Button>
              ) : null}
              <Button type="button" className="w-full" onClick={() => setNotificationsOpen(true)}>
                <BellRing className="size-4" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <HackathonNotificationsDialog hackathon={hackathon} />
      </Dialog>
    </>
  );
}

function TimelineButton({ hackathon }: { hackathon: Hackathon }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "relative w-full overflow-hidden border-rose-200/80 bg-rose-50 text-rose-950 shadow-none",
            "hover:border-rose-300 hover:bg-rose-100/80 hover:text-rose-950",
            "dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100 dark:hover:border-rose-400/30 dark:hover:bg-rose-500/15 dark:hover:text-rose-50"
          )}
        >
          <CalendarRange className="size-4" />
          Event Timeline
        </Button>
      </DialogTrigger>
      <TimelineDialog hackathon={hackathon} />
    </Dialog>
  );
}

export function HackathonCard({
  hackathon,
  index,
  tracked = false,
  enrolledMode = false,
  showNotifications = false,
  recommendationScore,
  recommendationReasons,
  recommendationLabel = "HRAI Match",
  onTrack,
  onRemove,
  onOpenNotifications,
}: HackathonCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group flex h-full flex-col justify-between border-border/70 bg-surface/95 p-5 shadow-[0_10px_30px_rgba(31,25,48,0.06)] backdrop-blur-sm",
          "relative overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out",
          "hover:border-primary-border hover:shadow-[0_18px_45px_rgba(124,58,237,0.10),0_2px_8px_rgba(124,58,237,0.06)]",
          "dark:hover:border-primary-border dark:hover:shadow-[0_18px_45px_rgba(124,58,237,0.12),0_2px_8px_rgba(124,58,237,0.08)]"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
            "bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.08),transparent_40%)]",
            "group-hover:opacity-100",
            "dark:bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.10),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.08),transparent_40%)]"
          )}
        />
        <div className="relative">
          {enrolledMode ? (
            <button
              type="button"
              onClick={() => onRemove?.(hackathon)}
              aria-label={`Remove ${hackathon.name} from enrolled hackathons`}
              className="absolute right-0 top-0 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BookmarkMinus className="size-4" />
            </button>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-sm font-semibold text-foreground">
                {hackathon.logo}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
                  {hackathon.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{hackathon.organizer}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {typeof recommendationScore === "number" ? (
                <Badge tone="default">
                  {recommendationScore}% {recommendationLabel}
                </Badge>
              ) : null}
              <Badge tone={hackathon.status === "Live" ? "default" : "muted"}>{hackathon.status}</Badge>
              <Badge tone="muted">{hackathon.mode}</Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{hackathon.domain}</Badge>
            <Badge tone="muted">{hackathon.difficulty}</Badge>
            <Badge tone="muted">{hackathon.registration}</Badge>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">{hackathon.description}</p>
          {recommendationReasons?.length ? (
            <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Why Recommended
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {recommendationReasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="text-success">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            <MetaRow
              icon={<CalendarDays className="size-4" />}
              label="Registration Deadline"
              value={hackathon.deadline}
            />
            <MetaRow
              icon={<CircleDot className="size-4" />}
              label={
                hackathon.eventDates.includes("–") ||
                hackathon.eventDates.toLowerCase().includes("ongoing") ||
                hackathon.eventDates.toLowerCase().includes("rolling")
                  ? "Event Dates"
                  : "Event Date"
              }
              value={hackathon.eventDates}
            />
            <MetaRow icon={<Rocket className="size-4" />} label="Prize Pool" value={hackathon.prizePool} />
            <MetaRow icon={<MapPin className="size-4" />} label="Location" value={hackathon.location} />
          </div>
        </div>

        <div className="relative mt-5 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" asChild className="relative overflow-hidden">
              <Link href={hackathon.officialWebsite} target="_blank" rel="noreferrer">
                More Details
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <TrackButton
              tracked={tracked}
              enrolledMode={enrolledMode}
              showNotifications={showNotifications}
              onTrack={onTrack}
              onOpenNotifications={onOpenNotifications}
              hackathon={hackathon}
            />
          </div>
          <TimelineButton hackathon={hackathon} />
        </div>
      </Card>
    </motion.article>
  );
}
