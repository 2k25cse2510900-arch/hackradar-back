import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  isDark: boolean;
};

export function Logo({ isDark }: LogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold tracking-tight transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="HackRadar home"
    >
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
    </Link>
  );
}
