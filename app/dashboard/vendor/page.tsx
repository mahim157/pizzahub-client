"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pizza,
  CheckCircle2,
  ShoppingBag,
  Crown,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

interface VendorStats {
  totalItems: number;
  approvedItems: number;
  totalOrders: number;
}

export default function VendorOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as Record<string, unknown> | undefined;

  const checkPremium = (obj: Record<string, unknown> | undefined | null) => {
    if (!obj) return false;
    const sub = obj.subscription as Record<string, unknown> | undefined;
    return Boolean(
      obj.isPremium === true ||
        obj.isSubscribed === true ||
        obj.plan === "premium" ||
        obj.subscriptionPlan === "premium" ||
        obj.subscriptionStatus === "active" ||
        obj.status === "active" ||
        sub?.status === "active" ||
        sub?.isPremium === true
    );
  };

  const [isPremium, setIsPremium] = useState<boolean>(checkPremium(user));
  const [stats, setStats] = useState<VendorStats>({
    totalItems: 0,
    approvedItems: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    if (checkPremium(user)) {
      setIsPremium(true);
    }

    const loadOverview = async () => {
      try {
        const headers = await getAuthHeaders(true);

        const [pizzasRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/pizzas/vendor/my-pizzas`, {
            headers,
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/orders/vendor`, {
            headers,
            credentials: "include",
          }),
        ]);

        const pizzasJson = pizzasRes.ok ? await pizzasRes.json() : { data: [] };
        const ordersJson = ordersRes.ok ? await ordersRes.json() : { data: [] };

        const pizzas = Array.isArray(pizzasJson?.data) ? pizzasJson.data : [];
        const orders = Array.isArray(ordersJson?.data) ? ordersJson.data : [];

        setStats({
          totalItems: pizzas.length,
          approvedItems: pizzas.filter(
            (p: { isApproved?: boolean }) => p.isApproved
          ).length,
          totalOrders: orders.length,
        });

        const endpoints = [
          `${API_BASE_URL}/api/subscriptions/status`,
          `${API_BASE_URL}/api/subscriptions/my-subscription`,
          `${API_BASE_URL}/api/users/me`,
        ];

        for (const url of endpoints) {
          const res = await fetch(url, { headers, credentials: "include" });
          if (res.ok) {
            const raw = await res.json();
            const payload = (raw?.data || raw) as Record<string, unknown>;
            if (checkPremium(payload)) {
              setIsPremium(true);
              break;
            }
          }
        }
      } catch {
        // Ignore transient network errors
      }
    };

    loadOverview();
  }, [user]);

  const kitchenName =
    (user?.kitchenName as string) || (user?.name as string) || "Vendor";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent-foreground">
            {isPremium
              ? "PREMIUM KITCHEN (UNLIMITED ITEMS)"
              : "FREE TIER PLAN (MAX 3 ITEMS)"}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            {kitchenName} Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your pizza listings, respond to customer orders, and track
            store performance.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-pizza"
          className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:opacity-90 sm:self-center"
        >
          <Plus className="h-4 w-4" /> Add New Pizza
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <Pizza className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            TOTAL MENU ITEMS
          </p>
          <p className="mt-1 text-3xl font-extrabold">
            {stats.totalItems}
            {!isPremium && (
              <span className="text-base font-semibold text-muted-foreground">
                {" "}
                / 3
              </span>
            )}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            APPROVED &amp; LIVE
          </p>
          <p className="mt-1 text-3xl font-extrabold">{stats.approvedItems}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            TOTAL ORDERS
          </p>
          <p className="mt-1 text-3xl font-extrabold">{stats.totalOrders}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
            <Crown className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            SUBSCRIPTION
          </p>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            {isPremium ? "Premium" : "Free"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href="/dashboard/vendor/my-menu"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Manage My Menu</h2>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit prices, descriptions, or remove items from your menu.
          </p>
        </Link>

        <Link
          href="/dashboard/vendor/orders"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Incoming Orders</h2>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Accept or reject incoming customer pizza orders.
          </p>
        </Link>

        <Link
          href="/dashboard/vendor/subscription"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Premium Plan</h2>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPremium
              ? "Your unlimited listings & featured badge are active."
              : "Upgrade via Stripe for unlimited menu listings and priority placement."}
          </p>
        </Link>
      </div>
    </div>
  );
}
