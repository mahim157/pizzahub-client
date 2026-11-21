"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  Pizza,
  Loader2,
  RotateCcw,
  UtensilsCrossed,
  ArrowUpRight,
  Crown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

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
};

type MenuResponse = {
  success: boolean;
  message?: string;
  total?: number;
  data: MenuItem[];
};

function BrowseMenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const queryCategory = searchParams.get("category") || "";
    if (queryCategory) {
      setCategory(queryCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (location.trim()) params.set("location", location.trim());
        if (sort !== "latest") params.set("sort", sort);

        const queryString = params.toString();

        const response = await fetch(
          `${API_BASE_URL}/api/menu-items${
            queryString ? `?${queryString}` : ""
          }`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load menu items. Server returned ${response.status}.`
          );
        }

        const result: MenuResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(
            result.message || "Invalid menu data received from server."
          );
        }

        setMenuItems(result.data);
        setTotal(
          typeof result.total === "number"
            ? result.total
            : result.data.length
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
        setMenuItems([]);
        setTotal(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, category, location, sort, retry]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setSort("latest");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "" ||
    location.trim() !== "" ||
    sort !== "latest";

  const getItemName = (item: MenuItem) =>
    item.itemName || item.name || "Untitled Pizza";

  const getItemImage = (item: MenuItem): string => {
    if (Array.isArray(item.images)) {
      return (
        item.images.find(
          (image) => typeof image === "string" && image.trim() !== ""
        ) || ""
      );
    }
    if (typeof item.images === "string" && item.images.trim()) {
      return item.images;
    }
    return item.imageUrl || "";
  };

  const getItemLocation = (item: MenuItem): string => {
    const locObj = item.location as unknown as { area?: string; city?: string } | string | null;
    if (typeof locObj === "string" && locObj.trim()) {
      return locObj;
    }
    if (locObj && typeof locObj === "object") {
      const parts = [locObj.area, locObj.city].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "Location unavailable";
    }
    return "Location unavailable";
  };

  const getVendorInfo = (item: MenuItem) => {
    if (item.vendorId && typeof item.vendorId === "object") {
      return {
        name:
          item.vendorId.businessName ||
          item.vendorId.name ||
          item.businessName ||
          item.vendorName ||
          "Local Kitchen",
        isPremium: item.vendorId.subscriptionPlan === "premium",
      };
    }
    return {
      name: item.businessName || item.vendorName || "Local Kitchen",
      isPremium: false,
    };
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);

  const handleViewDetails = (itemId: string) => {
    if (!currentUser) {
      router.push(`/login?redirect=/menu/${itemId}`);
      return;
    }
    router.push(`/menu/${itemId}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Banner */}
      <section className="border-b border-border bg-secondary/60 px-5 py-14 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-1.5 text-xs font-extrabold tracking-wide text-accent-foreground">
              <Pizza size={15} className="text-primary" />
              EXPLORE OUR FULL MENU
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Find Your Next{" "}
              <span className="font-serif italic text-primary">
                Favorite Pizza.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Browse verified dishes from local pizzerias, filter by category
              or neighborhood, and sort by price to find your ideal meal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-14">
        {/* Search & Filter Panel */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-primary" />
                <h2 className="text-xl font-extrabold">
                  Search &amp; Filter Menu
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Narrow down pizzas by name, category, location, or price.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-4 py-2 text-xs font-extrabold text-accent-foreground transition hover:bg-primary hover:text-primary-foreground sm:self-auto"
              >
                <RotateCcw size={14} />
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label
                htmlFor="menu-search"
                className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                Search by Name
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="menu-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g., Margherita, Pepperoni, BBQ Chicken..."
                  className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="menu-category"
                className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                Category
              </label>
              <select
                id="menu-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="menu-location"
                className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                Location (Area / City)
              </label>
              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                />
                <input
                  id="menu-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Dhanmondi, Uttara"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ArrowUpDown size={16} className="text-primary" />
              Sort results by price
            </div>

            <select
              aria-label="Sort menu items"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-bold text-foreground outline-none transition focus:border-primary sm:w-64"
            >
              <option value="latest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High (Ascending)</option>
              <option value="price_desc">Price: High to Low (Descending)</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-7 mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              APPROVED &amp; ACTIVE MENU
            </span>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              Available Pizzas &amp; Sides
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading
                ? "Fetching fresh menu items..."
                : `Showing ${total} available menu item${total === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-border bg-card">
            <Loader2 size={38} className="animate-spin text-primary" />
            <p className="mt-4 font-extrabold">Loading delicious pizzas...</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while we fetch the latest menu.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-card px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
              <UtensilsCrossed size={28} />
            </div>
            <h3 className="mt-5 text-xl font-extrabold">
              Unable to load the menu
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setRetry((prev) => prev + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-border bg-card px-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-primary">
              <Pizza size={38} />
            </div>
            <h3 className="mt-6 text-xl font-extrabold">
              No menu items found
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We couldn&apos;t find any approved items matching your current
              search or filter criteria.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Menu Cards Grid */}
        {!loading && !error && menuItems.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {menuItems.map((item, index) => {
              const vendor = getVendorInfo(item);

              return (
                <motion.article
                  layout
                  key={item._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.25),
                  }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-primary/40">
                      <Pizza size={64} />
                    </div>

                    {getItemImage(item) && (
                      <img
                        src={getItemImage(item)}
                        alt={getItemName(item)}
                        loading="lazy"
                        className="absolute inset-0 z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}

                    <span className="absolute left-4 top-4 z-20 max-w-[65%] truncate rounded-full bg-background/90 px-3 py-1 text-[11px] font-extrabold text-foreground backdrop-blur-md">
                      {item.category}
                    </span>

                    {vendor.isPremium && (
                      <span className="absolute right-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold text-primary-foreground shadow-xs">
                        <Crown size={12} /> Premium
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 text-xl font-extrabold">
                          {getItemName(item)}
                        </h3>
                        <span className="shrink-0 rounded-xl bg-accent px-3 py-1 text-base font-extrabold text-accent-foreground">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <p className="mt-2.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                        {item.description ||
                          "Handcrafted fresh to order with authentic toppings."}
                      </p>

                      <div className="mt-4 space-y-1.5 text-xs font-medium text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <UtensilsCrossed className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate font-semibold text-foreground">
                            {vendor.name}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate">
                            {getItemLocation(item)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(item._id)}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                      >
                        View Details <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </section>
    </main>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 size={40} className="animate-spin text-primary" />
        </main>
      }
    >
      <BrowseMenuContent />
    </Suspense>
  );
}


