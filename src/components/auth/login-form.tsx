"use client";

import Link from "next/link";
import { GitBranch, Mail } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Divider } from "./divider";
import { Logo } from "@/components/layout/logo";

export function LoginForm() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Card className="w-full border-border/70 bg-surface/95 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Link href="/" className="inline-flex w-fit">
            <Logo isDark={isDark} />
          </Link>
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

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full justify-center gap-3 px-4"
          >
            <Mail className="size-4" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full justify-center gap-3 px-4"
          >
            <GitBranch className="size-4" />
            Continue with GitHub
          </Button>
        </div>

        <Divider />

        <form className="space-y-4" aria-label="Login form">
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
              <input
                type="checkbox"
                className="size-4 rounded border-border text-primary focus:ring-ring"
              />
              Remember Me
            </label>
            <button
              type="button"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot Password
            </button>
          </div>

          <Button type="button" size="lg" className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
            Sign In
          </Button>

          <Button variant="outline" size="lg" asChild className="w-full">
            <Link href="/register">Create Account</Link>
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
