"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const GlowingStarsBackground = ({ className }: { className?: string }) => {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setViewport(width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop");
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  if (reduceMotion) {
    return <div className={cn("absolute inset-0 bg-background", className)} aria-hidden="true" />;
  }

  return (
    <div
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden bg-[#0f172a]",
        "bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_75%_15%,rgba(34,211,238,0.08),transparent_22%),linear-gradient(180deg,#111827_0%,#0f172a_100%)]",
        className
      )}
    >
      <Illustration mouseEnter={mouseEnter} viewport={viewport} />
    </div>
  );
};

export const Illustration = ({
  mouseEnter,
  viewport,
}: {
  mouseEnter: boolean;
  viewport: "mobile" | "tablet" | "desktop";
}) => {
  const stars = viewport === "mobile" ? 56 : viewport === "tablet" ? 84 : 108;
  const columns = viewport === "mobile" ? 10 : viewport === "tablet" ? 14 : 18;

  const [glowingStars, setGlowingStars] = useState<number[]>([]);

  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars([...highlightedStars.current]);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [stars]);

  const starCells = useMemo(
    () =>
      [...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.14;
        const staticDelay = starIdx * 0.012;
        return (
          <div
            key={`matrix-col-${starIdx}`}
            className="relative flex items-center justify-center"
          >
            <Star
              isGlowing={mouseEnter ? true : isGlowing}
              delay={mouseEnter ? staticDelay : delay}
            />
            {mouseEnter && <Glow delay={staticDelay} />}
            <AnimatePresence mode="wait">
              {isGlowing && <Glow delay={delay} />}
            </AnimatePresence>
          </div>
        );
      }),
    [glowingStars, mouseEnter, stars]
  );

  return (
    <div
      className="absolute inset-0 p-4 sm:p-6"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "1px",
      }}
    >
      {starCells}
    </div>
  );
};

const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => {
  return (
    <motion.div
      key={delay}
      initial={{
        scale: 1,
      }}
      animate={{
        scale: isGlowing ? [1, 1.1, 1.9, 1.7, 1.25] : 1,
        background: isGlowing ? "rgba(255,255,255,0.95)" : "rgba(148,163,184,0.75)",
      }}
      transition={{
        duration: 2.8,
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn(
        "relative z-20 h-[1px] w-[1px] rounded-full",
        "shadow-[0_0_8px_rgba(96,165,250,0.25)]"
      )}
    />
  );
};

const Glow = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 2.8,
        ease: "easeInOut",
        delay: delay,
      }}
      exit={{
        opacity: 0,
      }}
      className="absolute left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full bg-blue-400/80 blur-[1px] shadow-2xl shadow-blue-400/20"
    />
  );
};
