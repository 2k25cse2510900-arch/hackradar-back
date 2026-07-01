"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { fetchCurrentUser, setStoredAuthSession } from "@/lib/api";

type AuthCallbackClientProps = {
  authError?: string;
  token?: string;
  nextPath?: string;
};

const authErrorMessages: Record<string, string> = {
  access_denied: "Google sign-in was cancelled.",
  google_auth_failed: "Google sign-in failed. Please try again.",
  database_auth_failed: "Database login failed. Please check the backend connection.",
};

export function AuthCallbackClient({ authError, token }: AuthCallbackClientProps) {
  const router = useRouter();
  const [message, setMessage] = useState("Completing Google sign-in...");

  useEffect(() => {
    if (authError) {
      toast.error(authErrorMessages[authError] || "Authentication failed. Please try again.");
      router.replace(`/login?auth_error=${encodeURIComponent(authError)}`);
      return;
    }

    if (!token) {
      toast.error("Authentication token was missing. Please try again.");
      router.replace("/login?auth_error=google_auth_failed");
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function finishAuth() {
      setStoredAuthSession(authToken);
      const user = await fetchCurrentUser(authToken);
      if (cancelled) return;

      if (!user) {
        toast.error("Could not verify your Google session. Please try again.");
        router.replace("/login?auth_error=google_auth_failed");
        return;
      }

      setMessage("Signed in successfully. Redirecting...");
      toast.success("Signed in with Google");
      router.replace("/");
    }

    finishAuth();

    return () => {
      cancelled = true;
    };
  }, [authError, router, token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 bg-surface/85 p-8 text-center shadow-[0_24px_70px_rgba(31,25,48,0.12)] backdrop-blur-xl dark:bg-slate-950/35">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
          <Loader2 className="size-5 animate-spin text-foreground" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Google Authentication
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
        <Link
          href="/login"
          className="mt-6 inline-flex text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Back to Sign In
        </Link>
      </Card>
    </main>
  );
}
