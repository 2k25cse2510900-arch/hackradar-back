"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

const links = [
  { href: "/hackathons", label: "Hackathons" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const navbarTone = isScrolled
    ? {
        shell: isDark
          ? "border-b border-white/10 bg-zinc-950/90 shadow-sm backdrop-blur-md"
          : "border-b border-border/70 bg-white/90 shadow-sm backdrop-blur-md",
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
                navbarTone.text
              )}
            >
              <Link
                href={item.href}
                className={cn(
                  "rounded-full transition-colors duration-200 hover:bg-muted/70 focus-visible:bg-muted/70",
                  navbarTone.hoverText
                )}
              >
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Search"
            className={cn(
              "transition-colors duration-200 hover:bg-muted/70",
              navbarTone.icon
            )}
          >
            <Link href="/search">
              <Search className="size-4" />
            </Link>
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
            asChild
            className={cn(
              "transition-colors duration-200 hover:bg-muted/70",
              navbarTone.signIn
            )}
          >
            <Link
              href="/login"
              className={cn(
                "transition-colors hover:bg-muted/70",
                navbarTone.hoverText
              )}
            >
              Sign In
            </Link>
          </Button>
          <Button asChild className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white">
            <Link href="/get-started" className="text-white hover:text-white">
              Get Started
            </Link>
          </Button>
        </div>

        <MobileNav
          open={open}
          onOpenChange={setOpen}
          onThemeToggle={() => setTheme(isDark ? "light" : "dark")}
          toneClassName={navbarTone.mobileTrigger}
        />
      </div>
    </header>
  );
}
