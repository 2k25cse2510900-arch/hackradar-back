import { Hero } from "@/components/sections/hero";
import { LandingSections } from "@/components/sections/landing-sections";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <LandingSections />
      </main>
    </div>
  );
}
