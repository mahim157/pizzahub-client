"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type AdminMenuItem = {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  location: { area?: string; city?: string } | string;
  images?: string[];
  status: string;
  vendorId?: { name?: string; businessName?: string };
};

export default function AdminMenuApprovalsPage() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchAllMenus = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/menu-items/admin/all`, {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMenus();
  }, []);

  const handleApproval = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setActionId(id);
      const headers = await getAuthHeaders(true);
      const res = await fetch(
        `${API_BASE_URL}/api/menu-items/admin/${id}/approval`,
        {
          method: "PATCH",
          headers,
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update approval status.");
      }
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  const formatLocation = (loc: AdminMenuItem["location"]) => {
    if (typeof loc === "string") return loc;
    if (loc && typeof loc === "object") {
      return [loc.area, loc.city].filter(Boolean).join(", ");
    }
    return "Dhaka";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          QUALITY MODERATION
        </span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          Menu Item Approvals ({items.length})
        </h1>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-xs"
            >
              <div>
                <div className="relative h-48 bg-muted">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
                    }
                    alt={item.itemName}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-extrabold uppercase backdrop-blur-md">
                    {item.status}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold text-primary">
                    {item.category}
                  </p>
                  <div className="mt-1 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-extrabold">{item.itemName}</h3>
                    <span className="shrink-0 rounded-lg bg-accent px-2.5 py-1 text-sm font-extrabold text-accent-foreground">
                      ৳{item.price}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                      {item.vendorId?.businessName ||
                        item.vendorId?.name ||
                        "Vendor"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {formatLocation(item.location)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-border p-4">
                <button
                  type="button"
                  disabled={
                    actionId === item._id || item.status === "approved"
                  }
                  onClick={() => handleApproval(item._id, "approved")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  type="button"
                  disabled={
                    actionId === item._id || item.status === "rejected"
                  }
                  onClick={() => handleApproval(item._id, "rejected")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 py-2.5 text-xs font-extrabold text-destructive transition hover:bg-destructive/20 disabled:opacity-40"
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
