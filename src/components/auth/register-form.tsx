"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitBranch, Loader2, Mail, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Divider } from "./divider";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots and underscores"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include one uppercase letter")
      .regex(/[a-z]/, "Password must include one lowercase letter")
      .regex(/[0-9]/, "Password must include one number")
      .regex(/[^A-Za-z0-9]/, "Password must include one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((value) => value, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function AuthField({
  label,
  required,
  error,
  children,
  helperText,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <Button variant="outline" type="button" className="h-11 w-full justify-center gap-3 px-4">
      {icon}
      {label}
    </Button>
  );
}

function PasswordField({
  label,
  value,
  error,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField label={label} required error={error}>
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, "-")}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your password"
          className="pr-12"
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </AuthField>
  );
}

function RequirementItem({
  label,
  met,
}: {
  label: string;
  met: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-xs font-medium transition-colors",
        met ? "text-success" : "text-muted-foreground"
      )}
    >
      <CheckCircle2 className={cn("size-4 shrink-0", met ? "text-success" : "text-muted-foreground")} />
      <span>{label}</span>
    </li>
  );
}

function getPasswordRules(password: string) {
  return {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function RegisterForm() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) ?? "";
  const confirmPassword = useWatch({ control: form.control, name: "confirmPassword" }) ?? "";
  const usernameValue = useWatch({ control: form.control, name: "username" }) ?? "";
  const passwordRules = getPasswordRules(passwordValue);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedUsername(usernameValue);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [usernameValue]);

  const usernameState = !usernameValue
    ? "idle"
    : debouncedUsername !== usernameValue
      ? "checking"
      : usernameValue.toLowerCase().includes("taken")
        ? "unavailable"
        : "available";

  const onSubmit = form.handleSubmit(async () => {
    // Future-ready placeholder: connect Email Verification / OTP / OAuth flows here.
    await new Promise((resolve) => window.setTimeout(resolve, 900));
  });

  const isFormValid =
    form.formState.isValid &&
    usernameState !== "checking" &&
    usernameState !== "unavailable" &&
    Object.values(passwordRules).every(Boolean) &&
    passwordValue === confirmPassword;

  return (
    <Card className="w-full border-border/70 bg-surface/95 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Link href="/" className="inline-flex w-fit">
            <Logo isDark={isDark} />
          </Link>
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              WELCOME TO HACKRADAR
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create your account</h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Start discovering hackathons, competitions, internships and innovation challenges
              personalized for you.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SocialButton icon={<Mail className="size-4" />} label="Continue with Google" />
          <SocialButton icon={<GitBranch className="size-4" />} label="Continue with GitHub" />
        </div>

        <Divider />

        <form className="space-y-4" aria-label="Create account form" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              label="First Name"
              required
              error={form.formState.errors.firstName?.message}
            >
              <Input {...form.register("firstName")} autoComplete="given-name" />
            </AuthField>
            <AuthField label="Last Name" required error={form.formState.errors.lastName?.message}>
              <Input {...form.register("lastName")} autoComplete="family-name" />
            </AuthField>
          </div>

          <AuthField
            label="Username"
            required
            error={
              usernameState === "unavailable"
                ? "This username is already taken."
                : form.formState.errors.username?.message
            }
            helperText={
              usernameState === "checking"
                ? "Checking username availability..."
                : usernameState === "available"
                  ? "Username looks available."
                  : usernameState === "unavailable"
                    ? "This username is already taken."
                    : "Placeholder availability check for future integration."
            }
          >
            <Input {...form.register("username")} autoComplete="username" />
          </AuthField>

          <AuthField
            label="Email Address"
            required
            error={form.formState.errors.email?.message}
          >
            <Input {...form.register("email")} type="email" autoComplete="email" placeholder="you@example.com" />
          </AuthField>

          <PasswordField
            label="Password"
            value={passwordValue}
            error={form.formState.errors.password?.message}
            onChange={(value) => form.setValue("password", value, { shouldValidate: true, shouldDirty: true })}
            autoComplete="new-password"
          />

          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            error={form.formState.errors.confirmPassword?.message}
            onChange={(value) =>
              form.setValue("confirmPassword", value, { shouldValidate: true, shouldDirty: true })
            }
            autoComplete="new-password"
          />

          <ul className="grid gap-2 rounded-2xl border border-border bg-background p-4">
            <RequirementItem label="Minimum 8 characters" met={passwordRules.minLength} />
            <RequirementItem label="One uppercase letter" met={passwordRules.upper} />
            <RequirementItem label="One lowercase letter" met={passwordRules.lower} />
            <RequirementItem label="One number" met={passwordRules.number} />
            <RequirementItem label="One special character" met={passwordRules.special} />
          </ul>

          <div className="space-y-2">
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                {...form.register("terms")}
                type="checkbox"
                className="mt-1 size-4 rounded border-border text-primary focus:ring-ring"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="font-medium text-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="font-medium text-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {form.formState.errors.terms?.message ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {form.formState.errors.terms.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-transform hover:translate-y-[-1px] hover:from-[#1D4ED8] hover:to-[#1E40AF]"
            disabled={!isFormValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating Account
              </>
            ) : (
              "Create Account"
            )}
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

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground transition-colors hover:text-primary">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Card>
  );
}
