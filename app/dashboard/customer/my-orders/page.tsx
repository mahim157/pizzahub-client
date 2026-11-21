"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  UtensilsCrossed,
  Loader2,
  Pizza,
  MessageSquare,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type CustomerOrder = {
  _id: string;
  itemId?: {
    _id?: string;
    itemName?: string;
    price?: number;
    images?: string[];
  };
  vendorId?: {
    businessName?: string;
    name?: string;
  };
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
};

export default function CustomerMyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
        headers,
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load your orders.");
      }
      setOrders(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load order history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancellingId(orderId);
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel order.");
      }
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "accepted") {
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
    if (s === "rejected" || s === "cancelled") {
      return "bg-destructive/15 text-destructive border-destructive/30";
    }
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            ORDER HISTORY
          </span>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            My Pizza Orders ({orders.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchMyOrders}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-bold transition hover:border-primary hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/30 bg-card p-8 text-center">
          <p className="font-bold text-destructive">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold">No orders placed yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Hungry for wood-fired pizza? Browse our menu and schedule your
            first delivery!
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            <Pizza className="h-4 w-4" /> Explore Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    order.itemId?.images?.[0] ||
                    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80"
                  }
                  alt={order.itemId?.itemName || "Pizza"}
                  className="h-20 w-20 shrink-0 rounded-2xl bg-muted object-cover"
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-extrabold">
                      {order.itemId?.itemName || "Artisan Pizza"}
                    </h3>
                    {order.itemId?.price && (
                      <span className="rounded-lg bg-accent px-2.5 py-0.5 text-xs font-extrabold text-accent-foreground">
                        ৳{order.itemId.price}
                      </span>
                    )}
                  </div>

                  <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                    {order.vendorId?.businessName ||
                      order.vendorId?.name ||
                      "Local Pizzeria"}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {order.deliveryAddress}
                    </span>
                  </div>

                  {order.message && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      Note: &ldquo;{order.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full border px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status || "pending"}
                </span>

                {order.status === "pending" && (
                  <button
                    type="button"
                    disabled={cancellingId === order._id}
                    onClick={() => handleCancelOrder(order._id)}
                    className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[11px] font-bold text-destructive transition hover:bg-destructive/20"
                  >
                    <XCircle className="h-3 w-3" /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
