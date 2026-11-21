"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Flame,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Clock,
  ShieldCheck,
  ChefHat,
  UtensilsCrossed,
  Star,
  Crown,
  CheckCircle2,
} from "lucide-react";

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  vendorId?: {
    name?: string;
    businessName?: string;
    subscriptionPlan?: string;
  };
}

const fallbackPizzas: MenuItem[] = [
  {
    _id: "1",
    itemName: "Wood-Fired Margherita",
    category: "Classic Pizzas",
    price: 480,
    location: "Dhanmondi, Dhaka",
    images: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85",
    ],
    vendorId: { businessName: "Bella Napoli Oven", subscriptionPlan: "premium" },
  },
  {
    _id: "2",
    itemName: "Smoky Double Pepperoni",
    category: "Meat Lovers",
    price: 690,
    location: "Gulshan, Dhaka",
    images: [
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=85",
    ],
    vendorId: { businessName: "Crust & Ember", subscriptionPlan: "premium" },
  },
  {
    _id: "3",
    itemName: "Tuscan Garden Veggie",
    category: "Vegetarian Pizzas",
    price: 540,
    location: "Uttara, Dhaka",
    images: [
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&q=85",
    ],
    vendorId: { businessName: "Green Slice Kitchen", subscriptionPlan: "free" },
  },
  {
    _id: "4",
    itemName: "Truffle Four-Cheese Melt",
    category: "Specialty / Gourmet Pizzas",
    price: 780,
    location: "Banani, Dhaka",
    images: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=85",
    ],
    vendorId: { businessName: "Artisan Dough Co.", subscriptionPlan: "premium" },
  },
  {
    _id: "5",
    itemName: "Roasted Garlic Mozzarella Knots",
    category: "Sides & Appetizers",
    price: 260,
    location: "Mirpur, Dhaka",
    images: [
      "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=900&q=85",
    ],
    vendorId: { businessName: "Pizza Corner", subscriptionPlan: "free" },
  },
  {
    _id: "6",
    itemName: "Warm Choco Lava & Tiramisu Cup",
    category: "Beverages & Desserts",
    price: 320,
    location: "Dhanmondi, Dhaka",
    images: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=900&q=85",
    ],
    vendorId: { businessName: "Sweet Crust Cafe", subscriptionPlan: "premium" },
  },
];

const categories = [
  {
    name: "Classic Pizzas",
    tagline: "Timeless marinara & melted mozzarella",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
  },
  {
    name: "Vegetarian Pizzas",
    tagline: "Farm-fresh herbs, olives & roasted veggies",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
  },
  {
    name: "Meat Lovers",
    tagline: "Loaded pepperoni, smoky beef & grilled chicken",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    tagline: "Chef-crafted artisan blends & truffle infusions",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  },
  {
    name: "Sides & Appetizers",
    tagline: "Crispy garlic bread, wings & cheesy dips",
    image:
      "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&q=80",
  },
  {
    name: "Beverages & Desserts",
    tagline: "Chilled craft sodas & oven-warm sweet treats",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
  },
];

const marqueeTags = [
  "STONE-BAKED ARTISAN CRUSTS",
  "48-HOUR COLD-FERMENTED DOUGH",
  "VERIFIED LOCAL PIZZERIAS",
  "REAL-TIME ORDER TRACKING",
  "FRESH MOZZARELLA & BASIL",
  "SCHEDULED DOORSTEP DELIVERY",
];

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>(fallbackPizzas);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/menu-items?limit=6`);
        if (!res.ok) return;
        const data = await res.json();
        const items = data?.data || data?.menuItems || [];
        if (Array.isArray(items) && items.length >= 6) {
          setFeaturedItems(items.slice(0, 6));
        }
      } catch {
        // Keep fallback items if backend is offline
      }
    };
    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Editorial Split Hero Section */}
      <section className="relative py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-1.5 text-xs font-extrabold tracking-wide text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              ARTISAN WOOD-FIRED MARKETPLACE
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-[66px]">
              Crafted in Fire.{" "}
              <span className="font-serif italic font-bold text-primary">
                Delivered
              </span>{" "}
              Hot &amp; Fresh.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover independent neighborhood pizzerias, explore 6 curated
              categories, and schedule fresh oven-baked deliveries straight to
              your doorstep.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-extrabold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Explore Full Menu <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
              >
                <ChefHat className="h-4 w-4 text-primary" />
                Join as Vendor
              </Link>
            </div>

            {/* Minimalist Metric Bar */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-7">
              <div>
                <p className="text-2xl font-extrabold text-primary">450°C</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Stone-Oven Baked
                </p>
              </div>
              <div className="border-x border-border px-4">
                <p className="text-2xl font-extrabold">100%</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Admin-Verified Kitchens
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">Live</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Order Status Updates
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-6"
          >
            <div className="relative mx-auto max-w-xl overflow-hidden rounded-[32px] border border-border bg-card p-3 shadow-xl">
              <div className="relative overflow-hidden rounded-[24px]">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=90"
                  alt="Artisan wood-fired pizza"
                  className="h-95 w-full object-cover sm:h-120"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />

                <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  Top Rated Local Pizzerias
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/15 bg-black/75 p-4 text-white backdrop-blur-md">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                      Signature Selection
                    </p>
                    <p className="mt-0.5 text-base font-extrabold">
                      Hand-Stretched Sourdough Crusts
                    </p>
                  </div>
                  <Link
                    href="/menu"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
                    aria-label="Explore menu"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Marquee Ticker */}
      <div className="overflow-hidden border-y border-border bg-secondary py-3.5">
        <div className="animate-marquee flex items-center gap-8">
          {[...marqueeTags, ...marqueeTags].map((tag, idx) => (
            <div
              key={`${tag}-${idx}`}
              className="flex items-center gap-8 whitespace-nowrap text-xs font-extrabold tracking-[0.2em] text-foreground"
            >
              <span>{tag}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Section 1: Featured Menu Items */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                CURATED FOR YOU
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Featured Menu Items
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Explore approved dishes from verified local pizzerias. Inspect
                full details and place your order in seconds.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
            >
              View All Dishes <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item, index) => {
              const vendorName =
                item.vendorId?.businessName ||
                item.vendorId?.name ||
                "Verified Kitchen";
              const isPremium = item.vendorId?.subscriptionPlan === "premium";

              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 3) * 0.08 }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85"
                      }
                      alt={item.itemName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[11px] font-extrabold text-foreground backdrop-blur-md">
                      {item.category}
                    </span>
                    {isPremium && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold text-primary-foreground shadow-xs">
                        <Crown className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 text-xl font-extrabold">
                          {item.itemName}
                        </h3>
                        <span className="shrink-0 rounded-xl bg-accent px-3 py-1 text-base font-extrabold text-accent-foreground">
                          ৳{item.price}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs font-medium text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                          <span className="font-semibold text-foreground">
                            {vendorName}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{typeof (item.location as unknown) === "object" && item.location !== null ? `${(item.location as unknown as { area?: string }).area || ""}, ${(item.location as unknown as { city?: string }).city || ""}`.replace(/^,\s*|,\s*$/g, "") : String(item.location || "")}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                      <Link
                        href={`/menu/${item._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                      >
                        View Details <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Section 2: 6 Pizza Categories */}
      <section
        id="categories"
        className="border-y border-border bg-secondary/60 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                BROWSE BY STYLE
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                6 Signature Categories
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Select any category to filter matching dishes directly on the
                menu page.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-primary transition hover:translate-x-1"
            >
              Explore Full Menu <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.08 }}
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(category.name)}`}
                  className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="relative z-10 flex items-end justify-between gap-3 text-white">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                        0{index + 1} · Category
                      </span>
                      <h3 className="mt-1 text-xl font-extrabold">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-white/80">
                        {category.tagline}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition group-hover:scale-105">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section 1: Asymmetric Bento Grid — Why Choose PizzaHub? */}
      <section id="why-us" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              THE PIZZAHUB DIFFERENCE
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Why Choose PizzaHub?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-xs lg:col-span-7">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">
                  Authentic Artisan Craftsmanship From Verified Local Kitchens
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Every pizzeria on PizzaHub is reviewed by platform admins
                  before publishing their menu. Enjoy hand-stretched crusts,
                  rich sauces, and fresh toppings prepared only after you
                  place your order.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Admin-Approved Menus",
                  "No Hidden Charges",
                  "Fresh Dough Daily",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-bold text-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-3xl border border-border bg-card p-7 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold">
                  Role-Based Security &amp; Trust
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Dedicated dashboards for Customers, Vendors, and Admins keep
                  orders, menus, and subscriptions transparent and secure.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-7 shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold">
                  Scheduled Delivery &amp; Live Status
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Pick your preferred delivery date, add special crust notes,
                  and track every step from Pending to Delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 2: How PizzaHub Works + Vendor CTA */}
      <section
        id="how-it-works"
        className="border-t border-border bg-secondary/60 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                3 SIMPLE STEPS
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                How PizzaHub Works
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Order Your Pizza <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Explore & Filter Menu",
                description:
                  "Search by pizza name, filter across 6 categories or areas, and compare prices effortlessly.",
              },
              {
                step: "02",
                title: "Schedule Your Delivery",
                description:
                  "Sign in as a Customer, choose your delivery date, enter your address, and add custom instructions.",
              },
              {
                step: "03",
                title: "Track Live From Oven",
                description:
                  "Watch your order status update in real time as the restaurant prepares and delivers your meal.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-border bg-card p-8 shadow-xs"
              >
                <span className="inline-block rounded-xl bg-accent px-3.5 py-1.5 text-xs font-extrabold tracking-wider text-accent-foreground">
                  STEP {item.step}
                </span>
                <h3 className="mt-5 text-xl font-extrabold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Vendor Growth Banner */}
          <div className="mt-14 grid items-center gap-8 rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold text-accent-foreground">
                <ChefHat className="h-4 w-4 text-primary" /> PARTNER WITH US
              </span>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                Own a Pizzeria? Start Selling on PizzaHub
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Create your vendor account, list up to 3 items free, or upgrade
                to Premium via Stripe for unlimited menu listings and featured
                placement.
              </p>
            </div>
            <div className="flex lg:col-span-4 lg:justify-end">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Register as Vendor <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card text-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Flame className="h-5 w-5" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                Pizza<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Connecting pizza lovers with trusted local artisan kitchens.
              Fresh ingredients, stone-baked crusts, and seamless tracking.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="transition hover:text-foreground">
                  Browse Menu
                </Link>
              </li>
              <li>
                <a
                  href="#categories"
                  className="transition hover:text-foreground"
                >
                  Pizza Categories
                </a>
              </li>
              <li>
                <a href="#why-us" className="transition hover:text-foreground">
                  Why Choose PizzaHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Account &amp; Vendors
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-foreground"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-foreground"
                >
                  Create Customer Account
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition hover:text-foreground"
                >
                  Join as a Vendor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Contact &amp; Socials
            </h4>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p>Dhaka, Bangladesh</p>
              <a
                href="mailto:support@pizzahub.com"
                className="block transition hover:text-foreground"
              >
                support@pizzahub.com
              </a>
              <p>+880 1700-000000</p>

              {/* Social Links with New X Logo */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow PizzaHub on X"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="PizzaHub on Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-xs font-bold text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  FB
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="PizzaHub on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-xs font-bold text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  IG
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
          © 2026 PizzaHub. All rights reserved. Crafted with fresh ingredients
          &amp; love.
        </div>
      </footer>
    </main>
  );
}

