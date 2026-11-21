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
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type TimelineEntry = {
  status: "pending" | "accepted" | "rejected" | "cancelled";
  timestamp: string;
  note?: string;
};

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
  statusHistory?: TimelineEntry[];
  createdAt?: string;
  updatedAt?: string;
};

export default function CustomerMyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      const list: CustomerOrder[] = data.data || [];
      setOrders(list);
      if (list.length > 0 && !expandedId) {
        setExpandedId(list[0]._id);
      }
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
    try {
      setCancellingId(orderId);
      setActionMsg(null);
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
          o._id === orderId
            ? {
                ...o,
                status: "cancelled",
                statusHistory: [
                  ...(o.statusHistory || []),
                  {
                    status: "cancelled",
                    timestamp: new Date().toISOString(),
                    note: "Order cancelled by customer",
                  },
                ],
              }
            : o
        )
      );
      setActionMsg({ type: "success", text: "Order cancelled successfully." });
    } catch (err) {
      setActionMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Could not cancel order.",
      });
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

  const buildTimeline = (order: CustomerOrder): TimelineEntry[] => {
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory;
    }
    const fallback: TimelineEntry[] = [
      {
        status: "pending",
        timestamp: order.createdAt || order.deliveryDate,
        note: "Order placed by customer",
      },
    ];
    if (order.status !== "pending") {
      fallback.push({
        status: order.status,
        timestamp: order.updatedAt || order.createdAt || order.deliveryDate,
        note:
          order.status === "accepted"
            ? "Order accepted by restaurant"
            : order.status === "rejected"
            ? "Order rejected by restaurant"
            : "Order cancelled by customer",
      });
    }
    return fallback;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            ORDER HISTORY & TRACKING
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

      {actionMsg && (
        <div
          className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
            actionMsg.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {actionMsg.text}
        </div>
      )}

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
          {orders.map((order) => {
            const timeline = buildTimeline(order);
            const isExpanded = expandedId === order._id;
            return (
              <div
                key={order._id}
                className="rounded-3xl border border-border bg-card p-6 shadow-xs transition"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
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
                          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
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

                  <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 sm:flex-col sm:items-end">
                    <span
                      className={`rounded-full border px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status || "pending"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : order._id)
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-bold transition hover:border-primary hover:text-primary"
                      >
                        {isExpanded ? (
                          <>
                            Hide Timeline <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Order Timeline <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>

                      {order.status === "pending" && (
                        <button
                          type="button"
                          disabled={cancellingId === order._id}
                          onClick={() => handleCancelOrder(order._id)}
                          className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[11px] font-bold text-destructive transition hover:bg-destructive/20"
                        >
                          <XCircle className="h-3 w-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Order Status Timeline
                    </p>
                    <div className="relative ml-2 space-y-4 border-l-2 border-primary/30 pl-5">
                      {timeline.map((step, idx) => {
                        const isNegative =
                          step.status === "rejected" ||
                          step.status === "cancelled";
                        return (
                          <div key={idx} className="relative">
                            <span
                              className={`absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                                isNegative
                                  ? "bg-destructive text-white"
                                  : step.status === "accepted"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {isNegative ? (
                                <XCircle className="h-2.5 w-2.5" />
                              ) : step.status === "accepted" ? (
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              ) : (
                                <Clock className="h-2.5 w-2.5" />
                              )}
                            </span>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-xs font-extrabold capitalize">
                                {step.status}{" "}
                                {step.note && (
                                  <span className="font-medium text-muted-foreground">
                                    — {step.note}
                                  </span>
                                )}
                              </p>
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {new Date(step.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {order.status === "pending" && (
                        <div className="relative opacity-60">
                          <span className="absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-card" />
                          <p className="text-xs font-semibold text-muted-foreground">
                            Awaiting restaurant confirmation...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
