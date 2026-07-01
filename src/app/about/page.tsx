"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, User, Mail } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const team = [
  {
    name: "Kartik Kumar",
    role: "Founder & Frontend Lead",
    bio: "Leading the vision of HackRadar while designing and developing modern, responsive user experiences.",
    image: "/about-team-1.png",
    linkedin: "https://www.linkedin.com/in/kartik-kumar955",
    email: "mailto:kk8247829@gmail.com",
  },
  {
    name: "Krishna Kumar Gaur",
    role: "Co-Founder & Full Stack Developer",
    bio: "Building scalable frontend and backend systems while driving the core architecture of HackRadar.",
    image: "/about-team-2.png",
    linkedin: "https://www.linkedin.com/in/krishna-kumar-gaur-6498003a0/",
    email: "mailto:gaursarita428@gmail.com",
  },
  {
    name: "Krish Chaddha",
    role: "Backend Engineer & API Developer",
    bio: "Developing secure backend services, REST APIs, and ensuring smooth communication across the platform.",
    image: "/about-team-3.png",
    linkedin: "https://www.linkedin.com/in/krishchaddha-1167a8397",
    email: "mailto:krishchaddha22@gmail.com",
  },
  {
    name: "Kshitij Rajput",
    role: "Database Engineer & QA Specialist",
    bio: "Managing database architecture, optimizing data flow, and ensuring application stability through testing and debugging.",
    image: "/about-team-4.png",
    linkedin: "https://www.linkedin.com/in/kshitij-rajput-845481353",
    email: "mailto:rajputkshitij37@gmail.com",
  },
];

const visionFeatures = [
  { label: "HRAI Recommendations", soon: false },
  { label: "Personalized Opportunity Discovery", soon: false },
  { label: "Smart Notifications", soon: true },
  { label: "Resume Intelligence", soon: true },
  { label: "GitHub Integration", soon: true },
  { label: "AI Career Guidance", soon: true },
];

function SectionHeading({
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function TeamCard({
  name,
  role,
  bio,
  image,
  linkedin,
  email,
}: (typeof team)[number]) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="group h-full p-5 transition-all duration-200 hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-4">
          <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            <Image
              src={image}
              alt={`${name} profile photo`}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{name}</h3>
            <p className="mt-1 text-sm font-medium text-primary">{role}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">{bio}</p>

        <div className="mt-5 flex items-center gap-2">
          <Button variant="outline" size="icon" asChild aria-label={`${name} LinkedIn profile`}>
            <Link href={linkedin} target="_blank" rel="noreferrer">
              <User className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild aria-label={`Email ${name}`}>
            <Link href={email}>
              <Mail className="size-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.article>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="relative isolate overflow-hidden pt-6 sm:pt-8 lg:pt-10">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-11 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10 lg:px-16"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.08),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.14),_transparent_45%)]" />

            <div className="mx-auto max-w-3xl">
                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  About Us
                </h1>

                <p className="mt-4 text-lg leading-8 text-muted-foreground sm:text-xl">
                  HackRadar is an AI-powered platform built by students to help developers,
                  innovators, and aspiring engineers discover hackathons, competitions, and
                  opportunities that match their skills and interests.
                </p>

                <blockquote className="mx-auto mt-6 max-w-2xl rounded-2xl border border-border bg-background px-6 py-4 text-base font-medium text-foreground shadow-sm">
                  Built by Students. Designed for Innovators. Powered by HRAI.
                </blockquote>

                <div className="mt-7 flex flex-wrap justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/hackathons">
                      Explore Hackathons
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#team">Meet the Team</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="team" className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Meet the Team"
              subtitle="The passionate people building HackRadar."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {team.map((member) => (
                <TeamCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Card className="p-7 sm:p-8">
              <SectionHeading
                title="Our Mission"
                subtitle="Empowering students to discover the right opportunities through AI-driven guidance and intelligent recommendations."
              />
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Our mission is to ensure that every student discovers the right opportunities at
                the right time through intelligent recommendations, personalized tracking, and
                AI-powered guidance. We believe innovation begins when opportunities become
                accessible to everyone.
              </p>
            </Card>

            <Card className="p-7 sm:p-8">
              <SectionHeading
                title="Our Vision"
                subtitle="Feature cards shaped by the same HackRadar language."
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {visionFeatures.map((feature) => (
                  <div
                    key={feature.label}
                    className="rounded-2xl border border-border bg-background px-4 py-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{feature.label}</p>
                      {feature.soon ? (
                        <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Coming Soon
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden p-7 text-center sm:p-8 lg:p-9">
              <SectionHeading
                title="Get in Touch"
                subtitle="Interested in collaborating, contributing, or sharing feedback? We'd love to hear from you."
              />
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button variant="outline" size="lg" asChild>
                  <Link href="https://github.com" target="_blank" rel="noreferrer">
                    <Globe className="size-4" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                    <User className="size-4" />
                    LinkedIn
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="mailto:hello@hackradar.com">
                    <Mail className="size-4" />
                    Email
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <footer className="border-t border-border py-6">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-lg font-medium text-foreground">Built by Students.</p>
            <p className="mt-2 text-lg font-medium text-foreground">Designed for Innovators.</p>
            <p className="mt-2 text-lg font-medium text-foreground">Powered by HRAI.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
