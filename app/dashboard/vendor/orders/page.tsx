"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  Loader2,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

type VendorOrder = {
  _id: string;
  itemId?: { itemName?: string; price?: number };
  customerId?: { name?: string; email?: string };
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string;
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/orders/vendor`, {
          headers,
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingId(orderId);
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status.");
      }
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          KITCHEN QUEUE
        </span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          Incoming Customer Orders ({orders.length})
        </h1>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold">No incoming orders yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            When customers order your pizzas, you can accept or reject them
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-6 shadow-xs lg:flex-row lg:items-center"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-extrabold">
                    {order.itemId?.itemName || "Pizza Order"}
                  </h3>
                  {order.itemId?.price && (
                    <span className="rounded-lg bg-accent px-2.5 py-0.5 text-xs font-extrabold text-accent-foreground">
                      ৳{order.itemId.price}
                    </span>
                  )}
                  <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-extrabold uppercase">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <p className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {order.customerId?.name || "Customer"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Delivery:{" "}
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-1.5 sm:col-span-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {order.deliveryAddress}
                  </p>
                  {order.message && (
                    <p className="flex items-center gap-1.5 sm:col-span-2">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      Note: &ldquo;{order.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {order.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusChange(order._id, "accepted")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Accept Order
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusChange(order._id, "rejected")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-5 py-2.5 text-xs font-extrabold text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold capitalize text-muted-foreground">
                    Decision finalized ({order.status})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
