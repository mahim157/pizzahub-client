"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pizza,
  PlusCircle,
  ShoppingBag,
  Crown,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

export default function VendorOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | {
        name?: string;
        businessName?: string;
        isPremium?: boolean;
      }
    | undefined;

  const [menuCount, setMenuCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const [menuRes, orderRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/menu-items/vendor/my-items`, {
            headers,
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/orders/vendor`, {
            headers,
            credentials: "include",
          }),
        ]);

        if (menuRes.status === "fulfilled" && menuRes.value.ok) {
          const menuData = await menuRes.value.json();
          const items = menuData?.data || [];
          setMenuCount(items.length);
          setApprovedCount(
            items.filter(
              (item: { status?: string }) => item.status === "approved"
            ).length
          );
        }

        if (orderRes.status === "fulfilled" && orderRes.value.ok) {
          const orderData = await orderRes.value.json();
          setOrderCount((orderData?.data || []).length);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isPremium = Boolean(user?.isPremium);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-7 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold text-accent-foreground">
            {isPremium ? (
              <>
                <Crown className="h-3.5 w-3.5 text-primary" /> PREMIUM KITCHEN
              </>
            ) : (
              <>FREE TIER PLAN (MAX 3 ITEMS)</>
            )}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            {user?.businessName || user?.name || "Your Kitchen"} Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your pizza listings, respond to customer orders, and track
            store performance.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-xs transition hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Add New Pizza
        </Link>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Pizza className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Menu Items
            </p>
            <p className="mt-1 text-3xl font-extrabold">
              {menuCount}
              {!isPremium && (
                <span className="text-sm font-semibold text-muted-foreground">
                  {" "}
                  / 3
                </span>
              )}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Approved &amp; Live
            </p>
            <p className="mt-1 text-3xl font-extrabold">{approvedCount}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </p>
            <p className="mt-1 text-3xl font-extrabold">{orderCount}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Subscription
            </p>
            <p className="mt-1 text-2xl font-extrabold capitalize text-primary">
              {isPremium ? "Premium" : "Free"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          href="/dashboard/vendor/my-menu"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Manage My Menu</h3>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit prices, descriptions, or remove items from your menu.
          </p>
        </Link>

        <Link
          href="/dashboard/vendor/orders"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Incoming Orders</h3>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Accept or reject incoming customer pizza orders.
          </p>
        </Link>

        <Link
          href="/dashboard/vendor/subscription"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Premium Plan</h3>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Upgrade via Stripe for unlimited menu listings and priority placement.
          </p>
        </Link>
      </div>
    </div>
  );
}
