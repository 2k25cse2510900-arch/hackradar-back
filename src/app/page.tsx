import { Hero } from "@/components/sections/hero";
import { LandingSections } from "@/components/sections/landing-sections";
import { Navbar } from "@/components/layout/navbar";
import { LandingVortexBackground } from "@/components/sections/landing-vortex-background";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <LandingVortexBackground />
      <Navbar />
      <main className="relative z-10 pt-16">
        <Hero />
        <LandingSections />
      </main>
    </div>
  );
}
