"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Flame,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth ও Dashboard পেজে এই পাবলিক নেভবার হাইড থাকবে
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/dashboard")
  ) {
    return null;
  }

  const getDashboardPath = (role?: string) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
    { href: "/#categories", label: "Categories" },
    { href: "/#why-us", label: "Why PizzaHub" },
    { href: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
            <Flame className="h-6 w-6" />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Pizza<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-foreground ${
                  isActive ? "font-extrabold text-primary" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark / Light Mode Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle color theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary hover:text-primary"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Session Loading Skeleton */}
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            /* Logged-In Profile Dropdown */
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-2 pr-3.5 text-left transition hover:border-primary"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}

                <span className="hidden sm:block">
                  <span className="block max-w-28 truncate text-xs font-extrabold">
                    {user.name || "Pizza Lover"}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                    {user.role || "customer"}
                  </span>
                </span>
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl"
                >
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="truncate text-sm font-extrabold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-secondary"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      Dashboard
                    </Link>

                    <Link
                      href={`${getDashboardPath(user.role)}/profile`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <UserIcon className="h-4 w-4 text-primary" />
                      My Profile
                    </Link>
                  </div>

                  <div className="border-t border-border pt-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive transition hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-Out Buttons */
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-secondary"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-xs transition hover:opacity-90"
              >
                Sign Up <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card lg:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-5 py-5 lg:hidden">
          <nav className="flex flex-col space-y-3 text-sm font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-accent px-3 py-2.5 text-accent-foreground"
                >
                  Go to Dashboard ({user.role || "customer"})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2 text-left text-destructive hover:bg-destructive/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full border border-border py-2.5 text-center font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full bg-primary py-2.5 text-center font-bold text-primary-foreground"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}