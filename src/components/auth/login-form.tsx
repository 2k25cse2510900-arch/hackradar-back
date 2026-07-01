"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Divider } from "./divider";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/providers";
import { getGoogleAuthUrl } from "@/lib/api";

export function LoginForm() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const nextPath = searchParams.get("next");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (!authError) return;

    const messages: Record<string, string> = {
      access_denied: "Google sign-in was cancelled.",
      google_auth_failed: "Google sign-in failed. Please try again.",
      database_auth_failed: "Database login failed. Please check the backend connection.",
    };

    toast.error(messages[authError] || "Authentication failed. Please try again.");
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setSubmitting(true);
      await signIn({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });
      toast.success("Signed in successfully");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-border/60 bg-surface/85 p-5 shadow-[0_24px_70px_rgba(31,25,48,0.12)] backdrop-blur-xl sm:p-6 lg:p-8 dark:bg-slate-950/35">
      <div className="space-y-6">
        <div className="space-y-4">
          <Logo isDark={isDark} />
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Welcome Back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Sign in to HackRadar
            </h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Discover opportunities faster with one intelligent platform for hackathons,
              competitions, and internships.
            </p>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            type="button"
            asChild
            className="h-11 w-full justify-center gap-3 px-4"
          >
            <a href={getGoogleAuthUrl(nextPath)}>
              <Mail className="size-4" />
              Continue with Google
            </a>
          </Button>
        </div>

        <Divider />

        <form className="space-y-4" aria-label="Login form" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-4 rounded border-border text-primary focus:ring-ring" />
              Remember Me
            </label>
            <button
              type="button"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot Password
            </button>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing In
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <Button variant="outline" size="lg" asChild className="w-full">
            <Link href={nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register"}>Create Account</Link>
          </Button>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to HackRadar&apos;s{" "}
            <Link href="#" className="font-medium text-foreground transition-colors hover:text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-foreground transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </Card>
  );
}
