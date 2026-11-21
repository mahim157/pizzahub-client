"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2, Pizza, MapPin, Trash2, ArrowRight } from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type FavoritePizza = {
  _id: string;
  itemName?: string;
  name?: string;
  category?: string;
  price: number;
  images?: string[];
  location?: { area?: string; city?: string } | string;
};

export default function CustomerFavoritesPage() {
  const [items, setItems] = useState<FavoritePizza[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/menu-items/favorites/my`, {
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
    loadFavorites();
  }, []);

  const handleRemove = async (id: string) => {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${API_BASE_URL}/api/menu-items/${id}/favorite`, {
      method: "POST",
      headers,
      credentials: "include",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          SAVED CRAVINGS
        </span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          My Favorite Pizzas ({items.length})
        </h1>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold">No favorites saved yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Tap &ldquo;Save to Wishlist&rdquo; on any pizza details page to keep
            your top picks here.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            <Pizza className="h-4 w-4" /> Explore Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const loc =
              typeof item.location === "string"
                ? item.location
                : [item.location?.area, item.location?.city]
                    .filter(Boolean)
                    .join(", ");
            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition hover:border-primary/40"
              >
                <img
                  src={
                    item.images?.[0] ||
                    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80"
                  }
                  alt={item.itemName || item.name || "Pizza"}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-extrabold">
                      {item.itemName || item.name}
                    </h3>
                    <span className="rounded-lg bg-accent px-2.5 py-0.5 text-xs font-extrabold text-accent-foreground">
                      ৳{item.price}
                    </span>
                  </div>
                  {loc && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {loc}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <Link
                      href={`/menu/${item._id}`}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
                    >
                      Order Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(item._id)}
                      className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[11px] font-bold text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
