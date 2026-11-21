"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Loader2, Mail } from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type PlatformUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked?: boolean;
  isPremium?: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers,
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleBlock = async (user: PlatformUser) => {
    const endpoint = user.isBlocked ? "unblock" : "block";
    try {
      setTogglingId(user._id);
      const headers = await getAuthHeaders(true);
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${user._id}/${endpoint}`,
        {
          method: "PATCH",
          headers,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update user status.");
      }
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          USER DIRECTORY
        </span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          Manage Users &amp; Vendors ({users.length})
        </h1>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/60 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-secondary/30">
                  <td className="px-6 py-4">
                    <p className="font-extrabold">{u.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {u.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-accent px-2.5 py-1 text-xs font-extrabold uppercase text-accent-foreground">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.isBlocked ? (
                      <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive">
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== "admin" && (
                      <button
                        type="button"
                        disabled={togglingId === u._id}
                        onClick={() => toggleBlock(u)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                          u.isBlocked
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }`}
                      >
                        {u.isBlocked ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" /> Unblock
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" /> Block
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
