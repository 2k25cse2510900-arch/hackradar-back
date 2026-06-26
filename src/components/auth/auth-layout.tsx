"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";

import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: ReactNode;
  topLeftVariant?: "back" | "logo";
  topRightAction?: ReactNode;
};

export function AuthLayout({ children, topLeftVariant = "back", topRightAction }: AuthLayoutProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="fixed left-6 top-6 z-20 sm:left-6 sm:top-6">
        {topLeftVariant === "logo" ? (
          <Link href="/" className="inline-flex">
            <Logo isDark={isDark} />
          </Link>
        ) : (
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-foreground/90 backdrop-blur-md transition-all duration-200 hover:-translate-x-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:py-2",
              isDark
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-border/70 bg-white/70 text-foreground hover:bg-white/85"
            )}
            aria-label="Back to Home"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        )}
      </div>
        <div className="fixed right-6 top-6 z-20 sm:right-6 sm:top-6">{topRightAction}</div>

      <section
        className={cn(
          "flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8",
          isDark ? "bg-[#09090b]" : "bg-background"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className="w-full max-w-[460px]"
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
