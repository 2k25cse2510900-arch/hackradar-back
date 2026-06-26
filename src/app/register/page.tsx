import Link from "next/link";

import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      topLeftVariant="logo"
      topRightAction={
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-sm font-medium text-foreground/90 backdrop-blur-md transition-all duration-200 hover:bg-white/85 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          aria-label="Skip for now and return to the landing page"
        >
          <span>Skip for now</span>
          <span aria-hidden="true">→</span>
        </Link>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
