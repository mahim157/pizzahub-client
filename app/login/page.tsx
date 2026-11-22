"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Flame,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRoleDashboardRoute = (role?: string) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Invalid email or password. Please try again."
        );
        return;
      }

      const loggedInUser = result.data?.user as
        | { role?: string; isBlocked?: boolean }
        | undefined;

      if (loggedInUser?.isBlocked) {
        await authClient.signOut();
        setError(
          "Your account has been blocked by an administrator. Contact support for help."
        );
        return;
      }

      setSuccess("Signed in successfully! Redirecting...");

      const targetPath =
        redirectUrl || getRoleDashboardRoute(loggedInUser?.role);

      setTimeout(() => {
        router.push(targetPath);
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${redirectUrl || "/dashboard"}`,
      });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Left Branding Panel */}
        <section className="relative hidden overflow-hidden border-r border-border bg-secondary p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
          <Link href="/" className="flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <Flame className="h-6 w-6" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              Pizza<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">
              WELCOME BACK TO PIZZAHUB
            </p>

            <h1 className="mt-5 text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
              Your next
              <br />
              favorite slice
              <br />
              <span className="font-serif italic font-bold text-primary">
                is waiting.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Sign in to explore local artisan pizzerias, track your scheduled
              deliveries, or manage your restaurant kitchen dashboard.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                "Role-based dashboards for Customers, Vendors & Admins",
                "Instant access to order tracking and menu management",
                "Verified neighborhood kitchens with fresh stone-baked crusts",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-foreground/85"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
            <span>© 2026 PizzaHub</span>
            <span>Hot &amp; Fresh Pizza Delivered</span>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="relative flex items-center justify-center px-5 py-12 sm:px-10">
          {mounted && (
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle color theme"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary hover:text-primary"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 flex w-fit items-center gap-2.5 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Flame className="h-5 w-5" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                Pizza<span className="text-primary">Hub</span>
              </span>
            </Link>

            <div className="mb-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                SIGN IN TO YOUR ACCOUNT
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome back!
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials or continue with Google to access
                PizzaHub.
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-bold text-foreground shadow-xs transition hover:bg-secondary disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.617 0 3.077.556 4.223 1.649l3.168-3.168C17.475 1.694 14.977.667 12 .667 7.574.667 3.743 3.204 1.88 6.91l3.691 2.864C6.44 7.152 8.993 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.275c0-.85-.076-1.668-.218-2.458H12v4.651h6.443c-.278 1.497-1.121 2.766-2.39 3.615l3.679 2.855c2.152-1.984 3.758-4.906 3.758-8.663z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.571 14.226A6.993 6.993 0 0 1 5.206 12c0-.774.133-1.526.365-2.226L1.88 6.91A11.318 11.318 0 0 0 .667 12c0 1.825.437 3.551 1.213 5.09l3.691-2.864z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.333c3.24 0 5.957-1.074 7.943-2.905l-3.679-2.855c-1.074.72-2.448 1.145-4.264 1.145-3.007 0-5.56-2.152-6.429-5.044L1.88 16.538C3.743 20.244 7.574 23.333 12 23.333z"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Or sign in with email
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Email Address *
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 transition focus-within:border-primary">
                  <Mail size={18} className="shrink-0 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Password *
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 transition focus-within:border-primary">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground transition hover:text-primary"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-extrabold text-primary transition hover:opacity-80"
              >
                Create Account
              </Link>
            </p>

            <Link
              href="/"
              className="mt-5 block text-center text-xs font-bold text-muted-foreground transition hover:text-primary"
            >
              ← Back to Homepage
            </Link>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 size={40} className="animate-spin text-primary" />
        </main>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

