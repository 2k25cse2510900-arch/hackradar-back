"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

import { Vortex } from "@/components/ui/vortex";

function useViewportTier() {
  const [tier, setTier] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setTier(width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

export function LandingVortexBackground() {
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const tier = useViewportTier();

  if (resolvedTheme !== "dark" || reduceMotion) {
    return null;
  }

  const particleCount = tier === "mobile" ? 260 : tier === "tablet" ? 420 : 560;
  const rangeRadius = tier === "mobile" ? 0.7 : tier === "tablet" ? 1.1 : 1.4;
  const rangeSpeed = tier === "mobile" ? 0.45 : tier === "tablet" ? 0.7 : 0.95;
  const baseRadius = tier === "mobile" ? 0.3 : 0.4;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Vortex
        containerClassName="h-full w-full"
        className="h-full w-full"
        backgroundColor="transparent"
        particleCount={particleCount}
        rangeRadius={rangeRadius}
        baseRadius={baseRadius}
        rangeSpeed={rangeSpeed}
        baseSpeed={0.02}
        baseHue={245}
        rangeY={120}
      />
    </div>
  );
}
