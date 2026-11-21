"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Pizza,
  ArrowUpRight,
  Loader2,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type OrderItem = {
  _id: string;
  status: string;
};

export default function CustomerOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { name?: string } | undefined;

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          headers,
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data?.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  ).length;
  const acceptedOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "accepted"
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-7 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold text-accent-foreground">
            <ShoppingBag className="h-3.5 w-3.5 text-primary" /> CUSTOMER HUB
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Welcome back, {user?.name || "Pizza Lover"}!
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track your scheduled pizza deliveries, check order history, and
            manage your profile.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-xs transition hover:opacity-90"
        >
          <Pizza className="h-4 w-4" /> Order New Pizza
        </Link>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Orders Placed
            </p>
            <p className="mt-1 text-3xl font-extrabold">{totalOrders}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Approval
            </p>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Accepted Orders
            </p>
            <p className="mt-1 text-3xl font-extrabold">{acceptedOrders}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/dashboard/customer/my-orders"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Track My Orders</h3>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            View live order decisions and cancel pending orders if needed.
          </p>
        </Link>

        <Link
          href="/dashboard/customer/profile"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-extrabold">Profile Settings</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your display name and profile avatar URL.
          </p>
        </Link>
      </div>
    </div>
  );
}
