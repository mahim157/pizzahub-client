"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Users,
  Pizza,
  CheckSquare,
  Download,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type PlatformStats = {
  totalUsers: number;
  totalMenus: number;
  pendingMenus: number;
};

export default function AdminProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalMenus: 0,
    pendingMenus: 0,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  useEffect(() => {
    const loadPlatformOverview = async () => {
      try {
        const headers = await getAuthHeaders();
        const [usersRes, menusRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/users`, {
            headers,
            credentials: "include",
          }).catch(() => null),
          fetch(`${API_BASE_URL}/api/menu-items/admin/all`, {
            headers,
            credentials: "include",
          }).catch(() => null),
        ]);

        let totalUsers = 0;
        let totalMenus = 0;
        let pendingMenus = 0;

        if (usersRes && usersRes.ok) {
          const uData = await usersRes.json();
          const list = Array.isArray(uData?.data) ? uData.data : [];
          totalUsers = list.length;
        }

        if (menusRes && menusRes.ok) {
          const mData = await menusRes.json();
          const list = Array.isArray(mData?.data) ? mData.data : [];
          totalMenus = list.length;
          pendingMenus = list.filter(
            (item: { status?: string }) => item.status === "pending"
          ).length;
        }

        setStats({ totalUsers, totalMenus, pendingMenus });
      } catch {
        // silent fallback
      }
    };

    loadPlatformOverview();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setSaving(true);
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });
      setMessage({
        type: "success",
        text: "Admin profile updated successfully!",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update admin profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportMenusCsv = async () => {
    try {
      setExporting(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/menu-items/admin/all`, {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      const items = Array.isArray(data?.data) ? data.data : [];

      const csvRows = [
        ["ID", "Item Name", "Category", "Price (BDT)", "Status"].join(","),
        ...items.map(
          (item: {
            _id?: string;
            itemName?: string;
            name?: string;
            category?: string;
            price?: number;
            status?: string;
          }) =>
            [
              item._id || "",
              `"${(item.itemName || item.name || "").replace(/"/g, '""')}"`,
              `"${(item.category || "").replace(/"/g, '""')}"`,
              item.price || 0,
              item.status || "pending",
            ].join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pizzahub-menu-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            SYSTEM ADMINISTRATION & CONTROL
          </span>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Admin Profile &amp; Command Center
          </h1>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary">
          <ShieldCheck className="h-4 w-4" /> Super Admin Access
        </span>
      </div>

      {/* Live Platform Snapshot */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              Registered Users
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">{stats.totalUsers}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              Total Menu Items
            </span>
            <Pizza className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">{stats.totalMenus}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              Pending Approvals
            </span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">{stats.pendingMenus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Profile Settings Form */}
        <form
          onSubmit={handleUpdate}
          className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8 lg:col-span-7"
        >
          <h2 className="text-lg font-extrabold">Personal Profile Details</h2>

          {message && (
            <div
              className={`flex items-center gap-2 rounded-2xl border p-3.5 text-sm font-semibold ${
                message.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Admin Email (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="h-12 w-full rounded-xl border border-input bg-secondary px-4 text-sm text-muted-foreground"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5 text-primary" /> Admin Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5 text-primary" /> Avatar Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/admin-avatar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-extrabold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Admin Profile"
            )}
          </button>
        </form>

        {/* Right: Advanced Admin Quick Actions */}
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8 lg:col-span-5">
          <h2 className="text-lg font-extrabold">Advanced Admin Tools</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Quickly moderate platform listings, audit accounts, or export
            catalog reports.
          </p>

          <div className="space-y-3 pt-2">
            <Link
              href="/dashboard/admin/menu-approvals"
              className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-sm font-bold transition hover:border-primary"
            >
              <span className="flex items-center gap-2.5">
                <CheckSquare className="h-4 w-4 text-primary" />
                Review Pending Pizzas ({stats.pendingMenus})
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href="/dashboard/admin/users"
              className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-sm font-bold transition hover:border-primary"
            >
              <span className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-primary" />
                Manage Users &amp; Roles
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <button
              type="button"
              onClick={handleExportMenusCsv}
              disabled={exporting}
              className="flex w-full items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm font-extrabold text-primary transition hover:bg-primary/15 disabled:opacity-60"
            >
              <span className="flex items-center gap-2.5">
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export Catalog Report (CSV)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
