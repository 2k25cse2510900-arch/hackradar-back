"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookmarkCheck, Plus } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { ProtectedPage } from "@/components/auth/protected-page";
import { Dialog } from "@/components/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HackathonCard, HackathonNotificationsDialog } from "./hackathon-card";
import { HackathonSearch } from "./hackathon-search";
import { HackathonFilters } from "./hackathon-filters";
import {
  createBookmark,
  deleteBookmark,
  listBookmarks,
  listHackathons,
  type Bookmark,
  type Hackathon,
} from "@/lib/api";
import { defaultHackathonFilters, type HackathonFilters as HackathonFiltersState } from "../types";
import { matchesHackathonFilters } from "../utils";

type HackathonsClientProps = {
  enrolledPage?: boolean;
};

function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-3xl">
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{subtitle}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <Card className="border-border/70 bg-surface px-6 py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-16">
          <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] border border-border bg-background text-foreground">
            <BookmarkCheck className="size-8" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            No Hackathons Enrolled Yet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Start tracking hackathons from the Hackathons page and they&apos;ll appear here.
          </p>
          <div className="mt-8">
            <Button asChild className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white">
              <Link href="/hackathons">
                <Plus className="size-4" />
                Explore Hackathons
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

export function HackathonsClient({ enrolledPage = false }: HackathonsClientProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<HackathonFiltersState>(defaultHackathonFilters);
  const [notificationHackathon, setNotificationHackathon] = useState<Hackathon | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [nextHackathons, nextBookmarks] = await Promise.all([
          listHackathons(),
          listBookmarks().catch(() => []),
        ]);

        if (active) {
          setHackathons(nextHackathons);
          setBookmarks(nextBookmarks);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load hackathons");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const trackedIds = useMemo(() => bookmarks.map((bookmark) => bookmark.hackathonId), [bookmarks]);
  const trackedHackathons = useMemo(
    () => bookmarks.map((bookmark) => bookmark.hackathon).filter((hackathon): hackathon is Hackathon => Boolean(hackathon)),
    [bookmarks]
  );
  const source = enrolledPage ? trackedHackathons : hackathons;
  const filteredHackathons = useMemo(
    () => source.filter((hackathon) => matchesHackathonFilters(hackathon, filters, query)),
    [source, filters, query]
  );

  const handleTrack = async (hackathonId: string) => {
    if (trackedIds.includes(hackathonId)) {
      toast("Already Tracking");
      return;
    }

    try {
      const { bookmark } = await createBookmark(hackathonId);
      const hackathon = hackathons.find((item) => item.id === hackathonId);
      setBookmarks((current) => [{ ...bookmark, hackathon }, ...current]);
      toast.success("Added to Enrolled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add bookmark");
    }
  };

  const handleRemove = async (hackathonId: string) => {
    const bookmark = bookmarks.find((item) => item.hackathonId === hackathonId);
    if (!bookmark) return;

    try {
      await deleteBookmark(bookmark._id);
      setBookmarks((current) => current.filter((item) => item._id !== bookmark._id));
      toast.success("Tracking Removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove bookmark");
    }
  };

  const page = (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {enrolledPage ? (
              <PageHeader
                title="My Enrolled Hackathons"
                subtitle="Track all your registered and followed hackathons in one place."
              />
            ) : (
              <PageHeader
                title="Discover Hackathons"
                subtitle="Find the best hackathons, innovation challenges and coding competitions from around the world."
              />
            )}

            {!enrolledPage ? (
              <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(240px,3fr)]">
                <HackathonSearch value={query} onChange={setQuery} />
                <HackathonFilters filters={filters} onChange={setFilters} />
              </div>
            ) : null}

            {loading ? (
              <div className="mt-8 rounded-[1.75rem] border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
                Loading hackathons...
              </div>
            ) : filteredHackathons.length > 0 ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredHackathons.map((hackathon, index) => (
                  <HackathonCard
                    key={hackathon.id}
                    hackathon={hackathon}
                    index={index}
                    tracked={trackedIds.includes(hackathon.id)}
                    enrolledMode={enrolledPage}
                    showNotifications={enrolledPage}
                    onTrack={(item) => handleTrack(item.id)}
                    onRemove={(item) => handleRemove(item.id)}
                    onOpenNotifications={(item) => setNotificationHackathon(item)}
                  />
                ))}
              </div>
            ) : enrolledPage ? (
              <EmptyState />
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
                No hackathons match your current search and filters.
              </div>
            )}

            {!enrolledPage ? (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="py-20 sm:py-24"
              >
                <div className="mx-auto max-w-3xl">
                  <Card className="border-border/70 bg-surface px-6 py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-16">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      More ahead
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      🚀 More Hackathons Coming Soon
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                      We&apos;re constantly adding new hackathons. Keep exploring with HackRadar. Stay
                      tuned for exciting opportunities!
                    </p>
                  </Card>
                </div>
              </motion.section>
            ) : null}
          </div>
        </section>
      </main>

      <Dialog open={notificationHackathon !== null} onOpenChange={(open) => !open && setNotificationHackathon(null)}>
        {notificationHackathon ? <HackathonNotificationsDialog hackathon={notificationHackathon} /> : null}
      </Dialog>
    </div>
  );

  return enrolledPage ? <ProtectedPage>{page}</ProtectedPage> : page;
}
