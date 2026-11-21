
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, LockKeyhole, Mail, Pizza, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error.message || "Unable to sign in. Please try again.");
        return;
      }

      router.push("/menu");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#F4F6FA]">
      <div className="grid min-h-screen w-full lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden overflow-hidden bg-[#151D32] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <Link href="/" className="flex w-fit items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F06A35] text-2xl font-black">
              P
            </span>
            <span className="text-3xl font-black tracking-[-0.07em]">
              pizza<span className="text-[#FFB45B]">hub.</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-black tracking-[0.22em] text-[#FFB45B]">
              WELCOME BACK TO PIZZAHUB
            </p>

            <h1 className="mt-6 text-6xl font-black leading-[1.08] tracking-[-0.065em] xl:text-7xl">
              Your next
              <br />
              favorite slice
              <br />
              <span className="font-serif font-medium italic text-[#FFB45B]">
                is waiting.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-8 text-white/55">
              Sign in to explore local pizza vendors, discover delicious
              flavors, and manage your orders with PizzaHub.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/15 pt-6 text-xs text-white/40">
            <span>© 2026 PizzaHub</span>
            <span>Discover. Choose. Enjoy.</span>
          </div>

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-[#F06A35]/20" />
          <div className="absolute -bottom-20 -right-8 h-72 w-72 rounded-full border border-[#F06A35]/20" />
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Link
              href="/"
              className="mb-12 flex w-fit items-center gap-2 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F06A35] text-xl font-black text-white">
                P
              </span>
              <span className="text-2xl font-black tracking-[-0.07em]">
                pizza<span className="text-[#F06A35]">hub.</span>
              </span>
            </Link>

            <div className="mb-9">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#F06A35]">
                <Pizza size={28} />
              </div>

              <p className="text-xs font-black tracking-[0.2em] text-[#F06A35]">
                YOUR ACCOUNT
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#192238]">
                Welcome back!
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#68738A]">
                Enter your account details to continue to PizzaHub.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#192238]"
                >
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 transition focus-within:border-[#F06A35]">
                  <Mail size={18} className="shrink-0 text-[#68738A]" />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-13 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-[#192238]"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 transition focus-within:border-[#F06A35]">
                  <LockKeyhole size={18} className="shrink-0 text-[#68738A]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-13 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#68738A] transition hover:text-[#F06A35]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#F06A35] text-sm font-bold text-white shadow-lg shadow-orange-900/10 transition hover:-translate-y-0.5 hover:bg-[#D95628] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#68738A]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#F06A35] transition hover:text-[#D95628]"
              >
                Create Account
              </Link>
            </p>

            <Link
              href="/"
              className="mt-8 block text-center text-xs font-semibold text-[#68738A] transition hover:text-[#F06A35]"
            >
              ← Back to Homepage
            </Link>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
