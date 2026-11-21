
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Pizza,
  ArrowRight,
  Store,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AccountRole = "customer" | "vendor";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("customer");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password must contain at least one uppercase and one lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      setError("Please enter your business name.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(role === "vendor"
          ? { businessName: businessName.trim() }
          : {}),
      });

      if (result.error) {
        setError(result.error.message || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created successfully! Redirecting...");

      router.push("/menu");
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F6FA]">
      <div className="grid min-h-screen lg:grid-cols-2">

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
              JOIN THE PIZZAHUB COMMUNITY
            </p>

            <h1 className="mt-6 text-6xl font-black leading-[1.08] tracking-[-0.065em] xl:text-7xl">
              Great pizza.
              <br />
              Great people.
              <br />
              <span className="font-serif font-medium italic text-[#FFB45B]">
                One community.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-8 text-white/55">
              Create your account and discover amazing local pizza vendors.
              Whether you love pizza or sell it, there is a place for you here.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Discover local pizza vendors",
                "Explore delicious menu options",
                "Manage your orders easily",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/75">
                  <CheckCircle2 size={18} className="text-[#FFB45B]" />
                  {item}
                </div>
              ))}
            </div>
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
              className="mb-10 flex w-fit items-center gap-2 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F06A35] text-xl font-black text-white">
                P
              </span>
              <span className="text-2xl font-black tracking-[-0.07em]">
                pizza<span className="text-[#F06A35]">hub.</span>
              </span>
            </Link>

            <div className="mb-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#F06A35]">
                <Pizza size={28} />
              </div>

              <p className="text-xs font-black tracking-[0.2em] text-[#F06A35]">
                CREATE YOUR ACCOUNT
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#192238]">
                Get started!
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#68738A]">
                Join PizzaHub and enjoy a better pizza experience.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-bold text-[#192238]">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 focus-within:border-[#F06A35]">
                  <User size={18} className="shrink-0 text-[#68738A]" />

                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#192238]">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 focus-within:border-[#F06A35]">
                  <Mail size={18} className="shrink-0 text-[#68738A]" />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                  />
                </div>
              </div>

              {/* Account Role */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#192238]">
                  Choose Account Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      role === "customer"
                        ? "border-[#F06A35] bg-[#FFF4ED]"
                        : "border-[#DFE4ED] bg-white"
                    }`}
                  >
                    <ShoppingBag
                      size={20}
                      className={role === "customer" ? "text-[#F06A35]" : "text-[#68738A]"}
                    />
                    <span>
                      <span className="block text-sm font-bold text-[#192238]">
                        Customer
                      </span>
                      <span className="block text-xs text-[#68738A]">
                        Order pizza
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      role === "vendor"
                        ? "border-[#F06A35] bg-[#FFF4ED]"
                        : "border-[#DFE4ED] bg-white"
                    }`}
                  >
                    <Store
                      size={20}
                      className={role === "vendor" ? "text-[#F06A35]" : "text-[#68738A]"}
                    />
                    <span>
                      <span className="block text-sm font-bold text-[#192238]">
                        Vendor
                      </span>
                      <span className="block text-xs text-[#68738A]">
                        Sell pizza
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Business Name */}
              {role === "vendor" && (
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block text-sm font-bold text-[#192238]"
                  >
                    Business Name
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 focus-within:border-[#F06A35]">
                    <Store size={18} className="shrink-0 text-[#68738A]" />

                    <input
                      id="businessName"
                      type="text"
                      required
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-12 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#192238]">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 focus-within:border-[#F06A35]">
                  <LockKeyhole size={18} className="shrink-0 text-[#68738A]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#68738A] hover:text-[#F06A35]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-[#192238]">
                  Confirm Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#DFE4ED] bg-white px-4 focus-within:border-[#F06A35]">
                  <LockKeyhole size={18} className="shrink-0 text-[#68738A]" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 w-full bg-transparent text-sm text-[#192238] outline-none placeholder:text-[#A0A9B8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#68738A] hover:text-[#F06A35]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#F06A35] text-sm font-bold text-white shadow-lg shadow-orange-900/10 transition hover:-translate-y-0.5 hover:bg-[#D95628] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#68738A]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#F06A35] transition hover:text-[#D95628]"
              >
                Sign In
              </Link>
            </p>

            <Link
              href="/"
              className="mt-6 block text-center text-xs font-semibold text-[#68738A] transition hover:text-[#F06A35]"
            >
              ← Back to Homepage
            </Link>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
