"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, CheckCircle2, Sparkles, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getAuthUserDisplayName } from "@/lib/api";
import { useAuth } from "@/providers";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

const links = [
  { href: "/", label: "Home" },
  { href: "/hrai", label: "HRAI" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/enrolled", label: "Enrolled" },
  { href: "/alerts", label: "Alerts" },
  { href: "/about", label: "About Us" },
];

const hraiPlusFreeFeatures = [
  "Unlimited Hackathon Discovery",
  "AI Basic Recommendations",
  "Bookmark Hackathons",
  "Event Timeline",
  "Email Alerts (24 hours before)",
  "Telegram Alerts (24 hours before)",
];

const hraiPlusStudentFeatures = [
  "Everything in Free plus",
  "Email Alerts (1 hour before)",
  "Telegram Alerts (1 hour before)",
  "WhatsApp Alerts",
  "AI Personalized Recommendations",
  "Smart Deadline Priority",
  "Early Access to New Features",
];

const hraiPlusMaxFeatures = [
  "Everything in Student plus",
  "Email Alerts (30 minutes before)",
  "Telegram Alerts (30 minutes before)",
  "WhatsApp Alerts (30 minutes before)",
  "Voice Call Reminder",
  "AI Priority Ranking",
  "Premium Support",
  "Beta Features Access",
];

const hraiPlusComparison = [
  { label: "AI Recommendations", free: "Basic", student: "Personalized", max: "Priority" },
  { label: "Email Alerts", free: "24 hrs", student: "1 hr", max: "30 mins" },
  { label: "Telegram Alerts", free: "24 hrs", student: "1 hr", max: "30 mins" },
  { label: "WhatsApp Alerts", free: "—", student: "Yes", max: "Yes" },
  { label: "Voice Call Reminder", free: "—", student: "—", max: "Yes" },
  { label: "Smart Deadline Priority", free: "—", student: "Yes", max: "Yes" },
  { label: "AI Priority Ranking", free: "—", student: "—", max: "Yes" },
  { label: "Premium Support", free: "—", student: "—", max: "Yes" },
];

function PricingCard({
  title,
  price,
  features,
  badge,
  highlight = false,
  selected = false,
  selectable = false,
  ctaLabel,
  onAction,
  onSelect,
}: {
  title: string;
  price: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
  selected?: boolean;
  selectable?: boolean;
  ctaLabel: string;
  onAction?: () => void;
  onSelect?: () => void;
}) {
  return (
    <Card
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-pressed={selectable ? selected : undefined}
      onClick={selectable ? onSelect : undefined}
      onKeyDown={
        selectable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      className={cn(
        "group relative flex h-full min-h-[26rem] flex-col border-border/70 bg-background p-6 shadow-none transition-all duration-200 ease-out",
        selectable ? "cursor-pointer" : "",
        highlight || selected ? "border-primary-border bg-primary-soft/40 shadow-[0_10px_28px_rgba(124,58,237,0.10)]" : "",
        selected ? "ring-1 ring-primary/10" : ""
      )}
    >
      {selected ? (
        <div className="absolute right-4 top-4 inline-flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
          <CheckCircle2 className="size-4" />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="mt-3 text-[2rem] font-semibold leading-none tracking-tight text-foreground">{price}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <span className="mr-1">⭐</span>
            {badge}
          </span>
        ) : null}
      </div>

      <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground">
        {features.map((feature) => (
          <li key={feature} className={cn("flex gap-2", feature.endsWith("plus") ? "font-medium" : "")}>
            <Check className="mt-0.5 size-4 shrink-0 text-success" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        disabled={!onAction || (selectable && !selected)}
        className={cn(
          "mt-auto w-full transition-all duration-200",
          selected && onAction ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white" : "",
          selectable && !selected && onAction ? "border-border bg-background text-foreground hover:bg-muted" : ""
        )}
        onClick={onAction}
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}

function ComparisonRow({
  label,
  free,
  student,
  max,
  freeClassName,
  studentClassName,
  maxClassName,
}: {
  label: string;
  free: string;
  student: string;
  max: string;
  freeClassName?: string;
  studentClassName?: string;
  maxClassName?: string;
}) {
  const cellClass = "text-sm text-muted-foreground";
  return (
    <div className="grid grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] gap-3 border-t border-border px-4 py-4 sm:px-5">
      <div className="text-sm font-medium leading-6 text-foreground">{label}</div>
      <div className={cn(cellClass, "leading-6 rounded-lg px-2 py-1 transition-colors", freeClassName)}>{free}</div>
      <div className={cn(cellClass, "leading-6 rounded-lg px-2 py-1 transition-colors", studentClassName)}>{student}</div>
      <div className={cn(cellClass, "leading-6 rounded-lg px-2 py-1 transition-colors", maxClassName)}>{max}</div>
    </div>
  );
}

function HRAIPlusDialogContent() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "student" | "max">("student");
  const handleComingSoon = () => {
    toast("Payment integration coming soon.");
  };

  const columnClass = (plan: "free" | "student" | "max") =>
    selectedPlan === plan ? "bg-primary-soft/40 text-foreground" : "";

  return (
    <div className="space-y-6">
      <DialogHeader className="text-left">
        <DialogTitle className="text-2xl sm:text-3xl">HRAI+</DialogTitle>
        <DialogDescription className="text-base font-medium text-foreground">
          Choose the plan that fits your hackathon journey.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
        <PricingCard
          title="HRAI Free"
          price="₹0/month"
          features={hraiPlusFreeFeatures}
          ctaLabel="Current Plan"
          selected={selectedPlan === "free"}
        />
        <PricingCard
          title="HRAI Student"
          price="₹49/month"
          badge="Most Popular"
          features={hraiPlusStudentFeatures}
          highlight
          ctaLabel="Buy Now"
          selectable
          selected={selectedPlan === "student"}
          onSelect={() => setSelectedPlan("student")}
          onAction={handleComingSoon}
        />
        <PricingCard
          title="HRAI Max"
          price="₹99/month"
          features={hraiPlusMaxFeatures}
          ctaLabel="Buy Now"
          selectable
          selected={selectedPlan === "max"}
          onSelect={() => setSelectedPlan("max")}
          onAction={handleComingSoon}
        />
      </div>

      <div className="rounded-[1.75rem] border border-border bg-background">
        <div className="grid grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] gap-3 border-b border-border px-4 py-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:px-5">
          <div>Feature</div>
          <div className={cn("rounded-lg px-2 py-1 transition-colors", columnClass("free"))}>Free</div>
          <div className={cn("rounded-lg px-2 py-1 transition-colors", columnClass("student"))}>Student</div>
          <div className={cn("rounded-lg px-2 py-1 transition-colors", columnClass("max"))}>Max</div>
        </div>
        {hraiPlusComparison.map((row) => (
          <ComparisonRow
            key={row.label}
            {...row}
            freeClassName={columnClass("free")}
            studentClassName={columnClass("student")}
            maxClassName={columnClass("max")}
          />
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hraiPlusOpen, setHraiPlusOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, signOut, user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const userLabel = getAuthUserDisplayName(user).split(" ")[0] || "User";
  const navbarTone = isScrolled
    ? {
        shell: isDark
          ? "border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-md"
          : "border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-md",
        text: isDark ? "text-white" : "text-foreground",
        icon: isDark ? "text-white" : "text-foreground",
        signIn: isDark ? "text-white" : "text-foreground",
        mobileTrigger: isDark ? "text-white" : "text-foreground",
        hoverText: isDark ? "hover:text-white" : "hover:text-foreground",
      }
    : {
        shell: "border-b border-transparent bg-transparent shadow-none",
        text: isDark ? "text-white/90" : "text-foreground",
        icon: isDark ? "text-white" : "text-foreground",
        signIn: isDark ? "text-white" : "text-foreground",
        mobileTrigger: isDark ? "text-white" : "text-foreground",
        hoverText: isDark ? "hover:text-white" : "hover:text-foreground",
      };

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > 8 || document.documentElement.scrollTop > 8);
    let frame = 0;

    const watchScroll = () => {
      onScroll();
      frame = window.requestAnimationFrame(watchScroll);
    };

    onScroll();
    frame = window.requestAnimationFrame(watchScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[1000] w-full transition-all duration-300 ease-out",
        navbarTone.shell
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
          isScrolled ? "h-14" : "h-16"
        )}
      >
        <div className="flex items-center gap-3">
          <Logo isDark={isDark} />
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "transition-colors duration-200 hover:bg-muted/70",
                navbarTone.text,
                pathname === item.href && "bg-muted/70 text-foreground"
              )}
            >
              <Link
                href={item.href}
                className={cn(
                  "rounded-full transition-colors duration-200 hover:bg-muted/70 focus-visible:bg-muted/70",
                  navbarTone.hoverText,
                  pathname === item.href && "bg-muted/70 text-foreground"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setHraiPlusOpen(true)}
            aria-label="Open HRAI plus pricing"
            className={cn(
              "relative overflow-hidden gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 text-primary transition-colors duration-200 hover:bg-primary/10",
              navbarTone.icon
            )}
          >
            <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))]" />
            <span className="relative inline-flex items-center gap-2">
              <Sparkles className="size-4" />
              <span>HRAI+</span>
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Toggle theme"
            className={cn(
              "transition-colors duration-200 hover:bg-muted/70",
              navbarTone.icon
            )}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <SunMoon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            asChild={!isAuthenticated}
            type={isAuthenticated ? "button" : undefined}
            className={cn(
              "transition-colors duration-200 hover:bg-muted/70",
              navbarTone.signIn
            )}
            onClick={
              isAuthenticated
                ? async () => {
                    await signOut();
                    toast.success("Signed out");
                  }
                : undefined
            }
          >
            {isAuthenticated ? (
              <span>Sign Out</span>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "transition-colors hover:bg-muted/70",
                  navbarTone.hoverText
                )}
              >
                Sign In
              </Link>
            )}
          </Button>
          <Button asChild>
            <Link href="/profile" className="text-white hover:text-white">
              <span className="max-w-24 truncate">{userLabel}</span>
            </Link>
          </Button>
        </div>

        <MobileNav
          open={open}
          onOpenChange={setOpen}
          onOpenHraiPlus={() => setHraiPlusOpen(true)}
          onThemeToggle={() => setTheme(isDark ? "light" : "dark")}
          toneClassName={navbarTone.mobileTrigger}
          authenticated={isAuthenticated}
          userLabel={userLabel}
          onLogout={async () => {
            await signOut();
            toast.success("Signed out");
          }}
        />
      </div>

      <Dialog open={hraiPlusOpen} onOpenChange={setHraiPlusOpen}>
        <DialogContent className="p-0">
          <div
            className="max-h-[86vh] overflow-y-auto [scrollbar-width:thin]"
            style={{ scrollbarColor: "var(--border) transparent" }}
          >
            <div className="border-b border-border/70 bg-surface px-6 py-6 sm:px-7">
              <DialogHeader className="pr-10 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle>Upgrade to HRAI+</DialogTitle>
                    <DialogDescription className="mt-1 font-medium text-foreground">
                      Unlock smarter hackathon tracking and never miss an important opportunity.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="px-6 py-6 sm:px-7">
              <HRAIPlusDialogContent />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
