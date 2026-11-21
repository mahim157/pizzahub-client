
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [retry, setRetry] = useState(0);

  // Fetch menu items from backend
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category) {
          params.set("category", category);
        }

        if (location.trim()) {
          params.set("location", location.trim());
        }

        if (sort !== "latest") {
          params.set("sort", sort);
        }

        const queryString = params.toString();

        const response = await fetch(
          `${API_BASE_URL}/api/menu-items${
            queryString ? `?${queryString}` : ""
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

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

  // Reset all filters
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

  // Get menu item name
  const getItemName = (item: MenuItem) =>
    item.itemName || item.name || "Untitled Pizza";

  // Get image URL (supports string and array)
  const getItemImage = (item: MenuItem): string => {
    if (Array.isArray(item.images)) {
      return (
        item.images.find(
          (image) =>
            typeof image === "string" && image.trim() !== ""
        ) || ""
      );
    }

    if (typeof item.images === "string" && item.images.trim()) {
      return item.images;
    }

    return item.imageUrl || "";
  };

  // Get location (supports string and object)
  const getItemLocation = (item: MenuItem): string => {
    const itemLocation = item.location;

    if (
      typeof itemLocation === "string" &&
      itemLocation.trim()
    ) {
      return itemLocation;
    }

    if (
      itemLocation &&
      typeof itemLocation === "object"
    ) {
      const parts = [
        itemLocation.area,
        itemLocation.city,
      ].filter(Boolean);

      return parts.length > 0
        ? parts.join(", ")
        : "Location unavailable";
    }

    return "Location unavailable";
  };

  // Format price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#F4F6FA] text-[#192238]">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#151D32] px-5 py-20 text-white sm:px-8 lg:py-24">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F06A35]/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#FFB45B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#FFB45B]">
              <Pizza size={16} />
              EXPLORE OUR MENU
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find your next
              <span className="block text-[#F06A35]">
                favorite pizza.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Explore pizzas from local vendors, discover different
              flavors, and find something delicious for your next meal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">

        {/* Search and Filters */}
        <div className="rounded-3xl border border-[#DFE4ED] bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={20}
                  className="text-[#F06A35]"
                />

                <h2 className="text-xl font-bold">
                  Find your perfect pizza
                </h2>
              </div>

              <p className="mt-2 text-sm text-[#68738A]">
                Search and filter the available menu items.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-[#F06A35] transition hover:bg-[#FFF1EB] sm:self-auto"
              >
                <RotateCcw size={15} />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <div className="lg:col-span-2">
              <label
                htmlFor="menu-search"
                className="mb-2 block text-sm font-semibold"
              >
                Search Pizza
              </label>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#68738A]"
                />

                <input
                  id="menu-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by pizza name..."
                  className="h-12 w-full rounded-xl border border-[#DFE4ED] bg-[#F8F9FC] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9AA3B2] focus:border-[#F06A35] focus:ring-2 focus:ring-[#F06A35]/10"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="menu-category"
                className="mb-2 block text-sm font-semibold"
              >
                Category
              </label>

              <select
                id="menu-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#DFE4ED] bg-[#F8F9FC] px-3 text-sm outline-none transition focus:border-[#F06A35] focus:ring-2 focus:ring-[#F06A35]/10"
              >
                <option value="">All Categories</option>

                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="menu-location"
                className="mb-2 block text-sm font-semibold"
              >
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68738A]"
                />

                <input
                  id="menu-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Enter area or city"
                  className="h-12 w-full rounded-xl border border-[#DFE4ED] bg-[#F8F9FC] pl-10 pr-3 text-sm outline-none transition placeholder:text-[#9AA3B2] focus:border-[#F06A35] focus:ring-2 focus:ring-[#F06A35]/10"
                />
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="mt-5 flex flex-col gap-3 border-t border-[#DFE4ED] pt-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-sm text-[#68738A]">
              <ArrowUpDown size={17} />
              Sort menu by price
            </div>

            <select
              aria-label="Sort menu items"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#DFE4ED] bg-[#F8F9FC] px-3 text-sm font-medium outline-none transition focus:border-[#F06A35] sm:w-56"
            >
              <option value="latest">Latest Items</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Heading */}
        <div className="mb-7 mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-[#F06A35]">
              OUR MENU
            </span>

            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Explore delicious choices
            </h2>

            <p className="mt-2 text-sm text-[#68738A]">
              {loading
                ? "Finding available menu items..."
                : `${total} menu item${total === 1 ? "" : "s"} found`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-[#DFE4ED] bg-white">

            <Loader2
              size={38}
              className="animate-spin text-[#F06A35]"
            />

            <p className="mt-4 font-semibold text-[#192238]">
              Loading delicious pizzas...
            </p>

            <p className="mt-1 text-sm text-[#68738A]">
              Please wait while we fetch the menu.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-red-200 bg-white px-5 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <UtensilsCrossed size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Unable to load the menu
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-6 text-[#68738A]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetry((previous) => previous + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F06A35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#D95628]"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-[#DFE4ED] bg-white px-5 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1EB] text-[#F06A35]">
              <Pizza size={38} />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              No menu items found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#68738A]">
              We could not find any menu items matching your search.
              Try changing your filters or search for something else.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-[#F06A35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#D95628]"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && menuItems.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {menuItems.map((item, index) => (
              <motion.article
                layout
                key={item._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.06, 0.3),
                }}
                className="group overflow-hidden rounded-3xl border border-[#DFE4ED] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Pizza Image */}
                <div className="relative h-56 overflow-hidden bg-[#E8ECF4]">

                  {/* Fallback Icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#F06A35]">
                    <Pizza size={64} />
                  </div>

                  {getItemImage(item) && (
                    <img
                      src={getItemImage(item)}
                      alt={getItemName(item)}
                      loading="lazy"
                      className="absolute inset-0 z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <span className="absolute left-4 top-4 z-20 max-w-[85%] truncate rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-[#192238] shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Pizza Information */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-extrabold leading-snug">
                      {getItemName(item)}
                    </h3>

                    <span className="shrink-0 text-lg font-extrabold text-[#F06A35]">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#68738A]">
                    {item.description ||
                      "Discover this delicious menu item."}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-[#68738A]">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[#F06A35]"
                    />

                    <span className="truncate">
                      {getItemLocation(item)}
                    </span>
                  </div>

                  {(item.vendorName || item.businessName) && (
                    <p className="mt-2 truncate text-xs text-[#68738A]">
                      Vendor: {item.vendorName || item.businessName}
                    </p>
                  )}

                  <div className="mt-5 border-t border-[#DFE4ED] pt-4">
                    <Link
                      href={`/menu/${item._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F06A35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#D95628]"
                    >
                      View Details
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
