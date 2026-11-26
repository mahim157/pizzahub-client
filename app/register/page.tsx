"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Store,
  ShoppingBag,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AccountRole = "customer" | "vendor";

export default function RegisterPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("customer");
  const [businessName, setBusinessName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase and one lowercase letter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      setError("Please enter your restaurant or business name.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(image.trim() ? { image: image.trim() } : {}),
        role,
        ...(role === "vendor" ? { businessName: businessName.trim() } : {}),
      });

      if (result.error) {
        setError(
          result.error.message || "Registration failed. Please try again."
        );
        return;
      }

      setSuccess("Account created successfully! Redirecting to your dashboard...");

      const targetRoute =
        role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer";

      setTimeout(() => {
        router.push(targetRoute);
        router.refresh();
      }, 900);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"}`,
      });
    } catch (err) {
      console.error("Google sign up error:", err);
      setError("Google authentication failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
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
              JOIN THE PIZZAHUB COMMUNITY
            </p>

            <h1 className="mt-5 text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
              Great pizza.
              <br />
              Local kitchens.
              <br />
              <span className="font-serif italic font-bold text-primary">
                One community.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Create your account to order hot, wood-fired pizzas from
              verified local vendors—or register your own pizzeria to reach
              hungry customers nearby.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                "Browse verified local pizza kitchens & artisan menus",
                "Schedule deliveries and track real-time order updates",
                "Vendors can publish menus and upgrade to Premium",
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
        <section className="relative flex items-center justify-center px-5 py-10 sm:px-10">
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
              className="mb-8 flex w-fit items-center gap-2.5 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Flame className="h-5 w-5" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                Pizza<span className="text-primary">Hub</span>
              </span>
            </Link>

            <div className="mb-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                CREATE YOUR ACCOUNT
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Get started today
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose your role and join PizzaHub in less than a minute.
              </p>
            </div>

            {/* Google Authentication */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
                Or register with email
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Account Role *
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      role === "customer"
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:bg-secondary/50"
                    }`}
                  >
                    <ShoppingBag
                      size={20}
                      className={
                        role === "customer"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                    <span>
                      <span className="block text-sm font-extrabold">
                        Customer
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Order pizza
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      role === "vendor"
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:bg-secondary/50"
                    }`}
                  >
                    <Store
                      size={20}
                      className={
                        role === "vendor"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                    <span>
                      <span className="block text-sm font-extrabold">
                        Vendor
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Restaurant owner
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Full Name *
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 focus-within:border-primary">
                  <User size={18} className="shrink-0 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Business Name (Vendor Only) */}
              {role === "vendor" && (
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                  >
                    Restaurant / Business Name *
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 focus-within:border-primary">
                    <Store size={18} className="shrink-0 text-primary" />
                    <input
                      id="businessName"
                      type="text"
                      required
                      placeholder="e.g., Bella Napoli Wood-Fired Pizza"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Email Address *
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 focus-within:border-primary">
                  <Mail size={18} className="shrink-0 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Optional Profile Image */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Profile Image URL{" "}
                  <span className="font-normal lowercase">
                    (optional, can be skipped)
                  </span>
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 focus-within:border-primary">
                  <ImageIcon
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />
                  <input
                    id="image"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Password *
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 focus-within:border-primary">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Min 6 chars, 1 uppercase & 1 lowercase"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-primary"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Confirm Password *
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-4 focus-within:border-primary">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="text-muted-foreground hover:text-primary"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-extrabold text-primary transition hover:opacity-80"
              >
                Sign In
              </Link>
            </p>

            <Link
              href="/"
              className="mt-4 block text-center text-xs font-bold text-muted-foreground transition hover:text-primary"
            >
              ← Back to Homepage
            </Link>
          </motion.div>
        </section>
      </div>
    </main>
  );
}


