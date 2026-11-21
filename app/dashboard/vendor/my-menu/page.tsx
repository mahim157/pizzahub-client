"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Trash2,
  Edit3,
  Loader2,
  Pizza,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type VendorMenuItem = {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  location: { area?: string; city?: string } | string;
  description?: string;
  images?: string[];
  status: string;
};

export default function VendorMyMenuPage() {
  const [items, setItems] = useState<VendorMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editName, setEditName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const formatLocation = (loc: VendorMenuItem["location"]) => {
    if (typeof loc === "string") return loc;
    if (loc && typeof loc === "object") {
      return [loc.area, loc.city].filter(Boolean).join(", ");
    }
    return "Location unavailable";
  };

  const fetchMyMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/menu-items/vendor/my-items`, {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load your menu items.");
      }
      setItems(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMenu();
  }, []);

  const startEditing = (item: VendorMenuItem) => {
    setEditingId(item._id);
    setEditName(item.itemName);
    setEditPrice(String(item.price));
  };

  const handleSaveEdit = async (id: string) => {
    try {
      setSavingId(id);
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({
          itemName: editName.trim(),
          price: Number(editPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed.");
      }
      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, itemName: editName.trim(), price: Number(editPrice) }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update item.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pizza?")) return;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed.");
      }
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete item.");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "approved") {
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
    }
    if (s === "rejected") {
      return "bg-destructive/15 text-destructive";
    }
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            KITCHEN INVENTORY
          </span>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            My Menu Items ({items.length})
          </h1>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-xs transition hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Add New Pizza
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/30 bg-card p-8 text-center">
          <p className="font-bold text-destructive">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
            <Pizza className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold">No menu items yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Start adding your signature pizzas so customers can discover and
            order from your kitchen.
          </p>
          <Link
            href="/dashboard/vendor/add-item"
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            Add Your First Pizza
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isEditing = editingId === item._id;

            return (
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
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status || "pending"}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold text-primary">
                      {item.category}
                    </p>

                    {isEditing ? (
                      <div className="mt-2 space-y-2.5">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold"
                        />
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold"
                        />
                      </div>
                    ) : (
                      <div className="mt-1 flex items-start justify-between gap-2">
                        <h3 className="text-lg font-extrabold">
                          {item.itemName}
                        </h3>
                        <span className="shrink-0 rounded-lg bg-accent px-2.5 py-1 text-sm font-extrabold text-accent-foreground">
                          ৳{item.price}
                        </span>
                      </div>
                    )}

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {formatLocation(item.location)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-border p-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item._id)}
                        disabled={savingId === item._id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-extrabold text-primary-foreground"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex items-center justify-center rounded-full border border-border px-3.5 py-2.5 text-xs font-bold"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditing(item)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-background py-2.5 text-xs font-bold transition hover:border-primary hover:text-primary"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-bold text-destructive transition hover:bg-destructive/20"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
