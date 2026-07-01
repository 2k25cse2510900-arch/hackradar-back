import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  isDark: boolean;
  clickable?: boolean;
  href?: string;
  className?: string;
  children?: ReactNode;
};

export function Logo({ isDark, clickable = true, href = "/", className, children }: LogoProps) {
  const content = (
    <>
      <span className="flex size-8 items-center justify-center rounded-full border border-border bg-surface shadow-sm">
        <span className="size-2.5 rounded-full bg-primary" />
      </span>
      <span
        className={cn(
          "font-heading text-base transition-colors duration-200",
          isDark ? "text-white" : "text-foreground"
        )}
      >
        HackRadar
      </span>
      {children}
    </>
  );

  if (!clickable) {
    return <div className={cn("inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold tracking-tight", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold tracking-tight transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="HackRadar home"
    >
      {content}
    </Link>
  );
}
