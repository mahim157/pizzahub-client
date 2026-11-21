"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Pizza,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    users: 0,
    pendingMenus: 0,
    totalMenus: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeaders();

        const [usersRes, menusRes, ordersRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/admin/users`, {
            headers,
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/menu-items/admin/all`, {
            headers,
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/orders/admin/all`, {
            headers,
            credentials: "include",
          }),
        ]);

        let usersCount = 0;
        let pendingCount = 0;
        let menusCount = 0;
        let ordersCount = 0;

        if (usersRes.status === "fulfilled" && usersRes.value.ok) {
          const d = await usersRes.value.json();
          usersCount = (d?.data || []).length;
        }
        if (menusRes.status === "fulfilled" && menusRes.value.ok) {
          const d = await menusRes.value.json();
          const items = d?.data || [];
          menusCount = items.length;
          pendingCount = items.filter(
            (i: { status?: string }) => i.status === "pending"
          ).length;
        }
        if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
          const d = await ordersRes.value.json();
          ordersCount = (d?.data || []).length;
        }

        setStats({
          users: usersCount,
          pendingMenus: pendingCount,
          totalMenus: menusCount,
          totalOrders: ordersCount,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-3xl border border-border bg-card p-7 shadow-xs sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold text-accent-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> PLATFORM ADMIN
        </span>
        <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          PizzaHub Control Center
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Review vendor pizza listings, moderate user accounts, and oversee all
          platform orders.
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Registered Users
            </p>
            <p className="mt-1 text-3xl font-extrabold">{stats.users}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Pizza className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Approvals
            </p>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              {stats.pendingMenus}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <Pizza className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Menu Items
            </p>
            <p className="mt-1 text-3xl font-extrabold">{stats.totalMenus}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </p>
            <p className="mt-1 text-3xl font-extrabold">{stats.totalOrders}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/dashboard/admin/menu-approvals"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Menu Item Approvals</h3>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Approve or reject pizzas submitted by vendors before they appear on
            the public menu.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">User &amp; Vendor Control</h3>
            <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Inspect user roles and block or unblock accounts across the
            platform.
          </p>
        </Link>
      </div>
    </div>
  );
}
