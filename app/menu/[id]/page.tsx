"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Pizza,
  Loader2,
  RotateCcw,
  UtensilsCrossed,
  ImageOff,
  Calendar,
  Home,
  MessageSquare,
  ShoppingBag,
  ShieldAlert,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type MenuLocation = {
  area?: string;
  city?: string;
};

type VendorInfo = {
  _id?: string;
  name?: string;
  businessName?: string;
  subscriptionPlan?: string;
};

type MenuItem = {
  _id: string;
  itemName?: string;
  name?: string;
  category: string;
  description?: string;
  price: number;
  images?: string | string[];
  imageUrl?: string;
  location?: MenuLocation | string;
  vendorId?: VendorInfo | string;
  vendorName?: string;
  businessName?: string;
  status?: string;
  createdAt?: string;
};

type MenuResponse = {
  success: boolean;
  message?: string;
  data?: MenuItem;
};

export default function MenuDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const currentUser = session?.user as
    | { id?: string; name?: string; email?: string; role?: string }
    | undefined;

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Order Form States
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isSessionLoading && !currentUser) {
      router.replace(`/login?redirect=/menu/${id}`);
    }
  }, [isSessionLoading, currentUser, router, id]);

  const getItemImages = (item: MenuItem): string[] => {
    let images: string[] = [];
    if (Array.isArray(item.images)) {
      images = item.images.filter(
        (image) => typeof image === "string" && image.trim() !== ""
      );
    } else if (typeof item.images === "string" && item.images.trim()) {
      images = [item.images];
    }
    if (images.length === 0 && item.imageUrl) {
      images = [item.imageUrl];
    }
    return images;
  };

  const getItemName = (item: MenuItem) =>
    item.itemName || item.name || "Untitled Pizza";

  const getItemLocation = (item: MenuItem): string => {
    const itemLocation = item.location;
    if (typeof itemLocation === "string" && itemLocation.trim()) {
      return itemLocation;
    }
    if (itemLocation && typeof itemLocation === "object") {
      const parts = [itemLocation.area, itemLocation.city].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "Location unavailable";
    }
    return "Location unavailable";
  };

  const getVendorDetails = (item: MenuItem) => {
    if (item.vendorId && typeof item.vendorId === "object") {
      return {
        id: item.vendorId._id,
        name:
          item.vendorId.businessName ||
          item.vendorId.name ||
          item.businessName ||
          item.vendorName ||
          "Local Pizza Kitchen",
        isPremium: item.vendorId.subscriptionPlan === "premium",
      };
    }
    return {
      id: typeof item.vendorId === "string" ? item.vendorId : undefined,
      name: item.businessName || item.vendorName || "Local Pizza Kitchen",
      isPremium: false,
    };
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);

  useEffect(() => {
    if (!id || isSessionLoading || !currentUser) return;

    const controller = new AbortController();

    const fetchMenuDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setMenuItem(null);
        setSelectedImage("");

        const response = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
          cache: "no-store",
        });

        const result: MenuResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Invalid item ID or menu item not found."
          );
        }

        setMenuItem(result.data);
        const images = getItemImages(result.data);
        setSelectedImage(images[0] || "");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMenuDetails();
    return () => controller.abort();
  }, [id, retry, isSessionLoading, currentUser]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItem || !currentUser) return;

    setOrderFeedback(null);

    if (!deliveryDate || !deliveryAddress.trim()) {
      setOrderFeedback({
        type: "error",
        text: "Please provide both delivery date and delivery address.",
      });
      return;
    }

    try {
      setIsOrdering(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          itemId: menuItem._id,
          deliveryDate,
          deliveryAddress: deliveryAddress.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to place your order.");
      }

      setOrderFeedback({
        type: "success",
        text: "Order placed successfully! Redirecting to your dashboard...",
      });

      setDeliveryDate("");
      setDeliveryAddress("");
      setMessage("");

      setTimeout(() => {
        router.push("/dashboard/customer");
      }, 1500);
    } catch (err) {
      setOrderFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not submit order. Please try again.",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  if (isSessionLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-foreground">
        <Loader2 size={42} className="animate-spin text-primary" />
        <p className="mt-5 text-lg font-extrabold">Loading pizza details...</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Preparing fresh oven details for you.
        </p>
      </main>
    );
  }

  if (error || !menuItem) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center text-foreground">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-primary">
          <UtensilsCrossed size={36} />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">Menu Item Not Found</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          {error || "This menu item does not exist or is currently unavailable."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetry((prev) => prev + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary"
          >
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  const images = getItemImages(menuItem);
  const itemName = getItemName(menuItem);
  const vendor = getVendorDetails(menuItem);

  const userRole = currentUser?.role || "customer";
  const isAvailableToOrder =
    !menuItem.status || menuItem.status.toLowerCase() === "approved";
  const isOwnVendorItem = Boolean(
    vendor.id && currentUser?.id && vendor.id === currentUser.id
  );
  const canCustomerOrder =
    userRole === "customer" && isAvailableToOrder && !isOwnVendorItem;

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Details & Order Section */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={15} />
            Back to Browse Menu
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card shadow-xs sm:h-112.5">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={itemName}
                  className="h-full w-full object-cover"
                  onError={() => setSelectedImage("")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary">
                  <ImageOff size={64} />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    Image unavailable
                  </p>
                </div>
              )}

              <span className="absolute left-5 top-5 rounded-full bg-background/90 px-4 py-1.5 text-xs font-extrabold text-foreground backdrop-blur-md">
                {menuItem.category}
              </span>

              {vendor.isPremium && (
                <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-extrabold text-primary-foreground shadow-xs">
                  <Crown size={14} /> Premium Kitchen
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition ${
                      selectedImage === image
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${itemName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Information & Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col"
          >
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              MENU ITEM DETAILS
            </span>

            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              {itemName}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="rounded-2xl bg-accent px-4 py-2 text-2xl font-extrabold text-accent-foreground">
                {formatPrice(menuItem.price)}
              </span>
              {!isAvailableToOrder && (
                <span className="rounded-full bg-destructive/15 px-3.5 py-1 text-xs font-bold text-destructive">
                  Unavailable ({menuItem.status})
                </span>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h2 className="text-base font-extrabold">Description</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {menuItem.description ||
                  "Hand-stretched artisan dough topped with rich tomato sauce, premium mozzarella, and fresh ingredients."}
              </p>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h2 className="text-base font-extrabold">
                Kitchen &amp; Item Info
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Pizza size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Category
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold">
                      {menuItem.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold">
                      {getItemLocation(menuItem)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <UtensilsCrossed size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Restaurant / Vendor
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold">
                      {vendor.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role-Based Order Section */}
            <div className="mt-8 border-t border-border pt-6">
              {userRole !== "customer" ? (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-extrabold text-foreground">
                      Ordering Restricted for {userRole.toUpperCase()} Accounts
                    </p>
                    <p className="mt-1">
                      Only registered Customer accounts can place pizza orders.
                      Vendors and Admins cannot place customer orders.
                    </p>
                  </div>
                </div>
              ) : !isAvailableToOrder ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                  This item is currently not approved or active for ordering.
                </div>
              ) : !showOrderForm ? (
                <button
                  type="button"
                  onClick={() => setShowOrderForm(true)}
                  disabled={!canCustomerOrder}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={19} />
                  Order This Pizza
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handlePlaceOrder}
                  className="rounded-3xl border border-border bg-card p-6 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold">
                      Complete Your Order
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="text-xs font-bold text-muted-foreground hover:text-primary"
                    >
                      Cancel
                    </button>
                  </div>

                  {orderFeedback && (
                    <div
                      className={`mt-4 flex items-center gap-2 rounded-2xl border p-3.5 text-sm font-semibold ${
                        orderFeedback.type === "success"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {orderFeedback.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                      )}
                      <span>{orderFeedback.text}</span>
                    </div>
                  )}

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        <Calendar size={14} className="text-primary" />
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        <Home size={14} className="text-primary" />
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="House, Road, Area (e.g., House 12, Road 5, Dhanmondi)"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        <MessageSquare size={14} className="text-primary" />
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Extra chili flakes, thin crust, call on arrival..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isOrdering}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isOrdering ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Order...
                      </>
                    ) : (
                      <>Confirm Order ({formatPrice(menuItem.price)})</>
                    )}
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}