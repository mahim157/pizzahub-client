"use client";

import Link from "next/link";
import { Store, PlusCircle, ArrowRight } from "lucide-react";

export default function VendorDashboardPage() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold text-accent-foreground">
            <Store className="h-3.5 w-3.5 text-primary" /> VENDOR DASHBOARD
          </span>
          <h1 className="mt-4 text-3xl font-extrabold">
            Welcome to Your Restaurant Kitchen!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your pizza menu items, track incoming customer orders, and grow your business.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              <PlusCircle className="h-4 w-4" /> View Live Menu <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-bold transition hover:border-primary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}