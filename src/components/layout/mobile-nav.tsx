"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenHraiPlus: () => void;
  onThemeToggle: () => void;
  toneClassName: string;
  authenticated?: boolean;
  userLabel?: string;
  onLogout?: () => void | Promise<void>;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/hrai", label: "HRAI" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/enrolled", label: "Enrolled" },
  { href: "/alerts", label: "Alerts" },
  { href: "/about", label: "About Us" },
];

export function MobileNav({
  open,
  onOpenChange,
  onOpenHraiPlus,
  onThemeToggle,
  toneClassName,
  authenticated = false,
  userLabel = "User",
  onLogout,
}: MobileNavProps) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className={toneClassName}
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 mt-3 px-4"
          >
            <div className="rounded-3xl border border-border bg-surface p-4 shadow-xl shadow-black/5">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onOpenChange(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenHraiPlus();
                  }}
                >
                  <Sparkles className="size-4" />
                  HRAI+
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  type="button"
                  onClick={onThemeToggle}
                >
                  Toggle theme
                </Button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {authenticated ? (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={async () => {
                      await onLogout?.();
                      onOpenChange(false);
                    }}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => onOpenChange(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
                <Button asChild>
                  <Link href="/profile" onClick={() => onOpenChange(false)}>
                    {userLabel}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
