"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bot } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { ProtectedPage } from "@/components/auth/protected-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HackathonCard } from "@/features/hackathons/components/hackathon-card";
import { recommendHackathons } from "@/features/recommendation/recommendationEngine";
import {
  createBookmark,
  deleteBookmark,
  getAuthUserDisplayName,
  getProfile,
  listBookmarks,
  listHackathons,
  type Bookmark,
  type Hackathon,
  type UserProfile,
} from "@/lib/api";
import { useAuth } from "@/providers";

const emptyProfile: UserProfile = {
  name: "",
  college: "",
  year: "",
  degree: "",
  domains: [],
  skills: [],
  experienceLevel: "Beginner",
  goals: [],
  preferredMode: "Online",
  availability: "Anytime",
  phoneNumber: "",
};

export default function HraiPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [profileResult, nextHackathons, nextBookmarks] = await Promise.all([
          getProfile(),
          listHackathons(),
          listBookmarks().catch(() => []),
        ]);

        if (active) {
          setProfile({ ...emptyProfile, ...profileResult.profile });
          setHackathons(nextHackathons);
          setBookmarks(nextBookmarks);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load recommendations");
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

  const recommendations = useMemo(() => recommendHackathons(hackathons, profile), [hackathons, profile]);
  const trackedIds = useMemo(() => bookmarks.map((bookmark) => bookmark.hackathonId), [bookmarks]);

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

  return (
    <ProtectedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mt-5 flex items-center gap-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                <Bot className="size-8" />
                HRAI
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                AI-powered hackathon recommendations tailored to your profile.
              </p>
            </div>

            <Card className="mt-10 border-border/70 bg-surface p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Hello, {profile.name || getAuthUserDisplayName(user) || "User"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Based on your profile, HRAI has selected these hackathons for you.
              </p>
            </Card>

            {loading ? (
              <div className="mt-10 rounded-[1.75rem] border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
                Loading recommendations...
              </div>
            ) : recommendations.length > 0 ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendations.map((item, index) => (
                  <HackathonCard
                    key={item.hackathon.id}
                    hackathon={item.hackathon}
                    index={index}
                    recommendationScore={item.matchScore}
                    recommendationReasons={item.reasons}
                    tracked={trackedIds.includes(item.hackathon.id)}
                    onTrack={(hackathon) => handleTrack(hackathon.id)}
                    onRemove={(hackathon) => handleRemove(hackathon.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <Card className="border-border/70 bg-surface px-6 py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-16">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    No Perfect Matches Found
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Update your profile preferences to discover more hackathons.
                  </p>
                  <div className="mt-8">
                    <Button asChild className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white">
                      <Link href="/profile">Update Profile</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
    </ProtectedPage>
  );
}
