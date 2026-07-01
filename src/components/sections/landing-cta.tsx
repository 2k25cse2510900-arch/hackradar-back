"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers";

export function LandingCta() {
  const { isAuthenticated } = useAuth();
  const href = isAuthenticated ? "/" : "/login";
  const label = isAuthenticated ? "Go Home" : "Get Started";

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Button asChild size="lg" className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
        <Link href={href}>{label}</Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link href="/hackathons">Explore Opportunities</Link>
      </Button>
    </div>
  );
}
