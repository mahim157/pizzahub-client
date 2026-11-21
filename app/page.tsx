
"use client";

import Link from "next/link";
import { motion } from "motion/react";

const pizzas = [
  {
    name: "Classic Margherita",
    category: "Classic Pizza",
    price: 450,
    rating: "4.9",
    vendor: "Italian Oven",
    location: "Dhanmondi, Dhaka",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85",
    label: "CUSTOMER FAVORITE",
  },
  {
    name: "Double Pepperoni",
    category: "Meat Lovers",
    price: 650,
    rating: "5.0",
    vendor: "Pizza Corner",
    location: "Uttara, Dhaka",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=85",
    label: "BESTSELLER",
  },
  {
    name: "Garden Fresh",
    category: "Vegetarian",
    price: 520,
    rating: "4.8",
    vendor: "Green Slice",
    location: "Mirpur, Dhaka",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&q=85",
    label: "FRESH PICK",
  },
  {
    name: "Cheese Overload",
    category: "Specialty Pizza",
    price: 590,
    rating: "4.9",
    vendor: "Cheese House",
    location: "Banani, Dhaka",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=85",
    label: "CHEESE LOVER",
  },
  {
    name: "Italian Supreme",
    category: "Specialty Pizza",
    price: 720,
    rating: "4.8",
    vendor: "Italian Oven",
    location: "Dhanmondi, Dhaka",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900&q=85",
    label: "CHEF'S CHOICE",
  },
  {
    name: "Chicken BBQ",
    category: "Meat Lovers",
    price: 680,
    rating: "4.9",
    vendor: "Pizza Corner",
    location: "Uttara, Dhaka",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=900&q=85",
    label: "POPULAR PICK",
  },
];

const categories = [
  {
    name: "Classic Pizzas",
    description: "Timeless recipes and familiar flavors.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
  },
  {
    name: "Vegetarian",
    description: "Fresh ingredients in every slice.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
  },
  {
    name: "Meat Lovers",
    description: "Rich toppings for hearty cravings.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
  },
  {
    name: "Specialty Pizzas",
    description: "Unique combinations worth exploring.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  },
];

const features = [
  {
    number: "01",
    title: "Discover Local Pizza Vendors",
    description:
      "Explore menus from local pizza businesses, compare different options, and find something delicious for your next meal.",
  },
  {
    number: "02",
    title: "Explore More Choices",
    description:
      "Browse a variety of pizza styles, ingredients, and prices to find the flavors that match your preferences.",
  },
  {
    number: "03",
    title: "Enjoy Convenient Ordering",
    description:
      "Place your orders online, manage your purchases, and keep track of order updates from your personal account.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F6FA] text-[#192238]">

      {/* Announcement */}
      <div className="bg-[#F06A35] px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.16em] text-white sm:text-xs">
        DISCOVER LOCAL PIZZA. EXPLORE GREAT FLAVORS. ORDER WITH EASE.
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#DFE4ED] bg-[#F4F6FA]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-19.5 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-14">

          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F06A35] text-2xl font-bold text-white">
              P
            </span>
            <span className="text-[25px] font-black tracking-[-0.07em]">
              pizza<span className="text-[#F06A35]">hub.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-[13px] font-semibold text-[#68738A] lg:flex">
            <Link href="/" className="text-[#F06A35]">
              Home
            </Link>
            <Link href="/menu" className="transition hover:text-[#F06A35]">
              Explore Menu
            </Link>
            <a href="#categories" className="transition hover:text-[#F06A35]">
              Categories
            </a>
            <a href="#about" className="transition hover:text-[#F06A35]">
              About Us
            </a>
            <a href="#vendor" className="transition hover:text-[#F06A35]">
              For Vendors
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-3 text-sm font-bold transition hover:text-[#F06A35] sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#F06A35] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#D95628] sm:px-6 sm:text-sm"
            >
              Get Started <span className="ml-1">↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-360 items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-24">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-8 flex items-center gap-3">
              <span className="h-0.5 w-10 bg-[#F06A35]" />
              <p className="text-[11px] font-black tracking-[0.23em] text-[#F06A35]">
                YOUR FAVORITE PIZZA STARTS HERE
              </p>
            </div>

            <h1 className="max-w-175 text-[54px] leading-[1.04] font-black tracking-[-0.075em] sm:text-7xl lg:text-[88px]">
              Discover
              <br />
              your next
              <br />
              <span className="font-serif font-medium italic text-[#F06A35]">
                favorite slice.
              </span>
            </h1>

            <p className="mt-8 max-w-122.5 text-[15px] leading-8 text-[#68738A] sm:text-base">
              Explore delicious pizzas from local vendors, discover new
              flavors, and find the perfect meal for every craving.
              Your next favorite pizza is waiting for you at PizzaHub.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="rounded-full bg-[#F06A35] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-900/10 transition hover:-translate-y-1 hover:bg-[#D95628]"
              >
                Explore Our Menu <span className="ml-3">↗</span>
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-[#DFE4ED] px-8 py-4 text-sm font-bold transition hover:border-[#F06A35] hover:text-[#F06A35]"
              >
                Join PizzaHub
              </Link>
            </div>

            <div className="mt-14 grid max-w-120 grid-cols-3 border-t border-[#DFE4ED] pt-7">
              <div>
                <p className="text-2xl font-black tracking-tight">Local</p>
                <p className="mt-1 text-[10px] font-semibold tracking-wide text-[#68738A] sm:text-xs">
                  PIZZA BUSINESSES
                </p>
              </div>
              <div className="border-x border-[#DFE4ED] px-5">
                <p className="text-2xl font-black tracking-tight">Variety</p>
                <p className="mt-1 text-[10px] font-semibold tracking-wide text-[#68738A] sm:text-xs">
                  FLAVORS & CHOICES
                </p>
              </div>
              <div className="pl-5">
                <p className="text-2xl font-black tracking-tight">Simple</p>
                <p className="mt-1 text-[10px] font-semibold tracking-wide text-[#68738A] sm:text-xs">
                  ONLINE ORDERING
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-147.5"
          >
            <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full border border-[#F06A35]/20" />
            <div className="relative overflow-hidden rounded-[220px_220px_22px_22px] bg-[#E8ECF4] p-3">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=90"
                alt="Freshly prepared pizza with delicious toppings"
                className="h-105 w-full rounded-[210px_210px_15px_15px] object-cover sm:h-142.5"
              />
            </div>

            <div className="absolute -bottom-5 left-2 rounded-2xl border border-[#DFE4ED] bg-white p-4 shadow-xl sm:-left-8 sm:p-5">
              <p className="text-[10px] font-black tracking-[0.18em] text-[#F06A35]">
                MADE FOR PIZZA LOVERS
              </p>
              <p className="mt-1 text-lg font-black">
                Find your perfect slice.
              </p>
            </div>

            <div className="absolute right-1 top-12 rounded-full bg-[#F06A35] px-5 py-3 text-xs font-black tracking-wide text-white shadow-lg sm:-right-5">
              EXPLORE. CHOOSE. ENJOY.
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="border-y border-[#DFE4ED] bg-[#E8ECF4] py-20">
        <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-14">
          <div className="mb-11 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-[#F06A35]">
                EXPLORE DIFFERENT FLAVORS
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                Find the pizza you love.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#68738A]">
                From classic recipes to exciting combinations,
                explore different styles and discover your next favorite.
              </p>
            </div>

            <Link
              href="/menu"
              className="text-sm font-bold text-[#F06A35] transition hover:translate-x-1"
            >
              Explore All Categories ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href="/menu"
                  className="group relative block h-70 overflow-hidden rounded-2xl bg-[#DFE4ED]"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-white/70">
                      EXPLORE CATEGORY
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {category.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-white/80">
                        {category.description}
                      </p>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 transition group-hover:bg-white group-hover:text-black">
                        ↗
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-24">
        <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-14">

          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-[#F06A35]">
                EXPLORE OUR SELECTION
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                Something delicious awaits.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#68738A]">
                Take a look at our featured pizza selections.
                Discover different flavors and explore what local vendors
                have to offer.
              </p>
            </div>

            <Link
              href="/menu"
              className="rounded-full border border-[#F06A35] px-6 py-3 text-sm font-bold text-[#F06A35] transition hover:bg-[#F06A35] hover:text-white"
            >
              Browse Full Menu ↗
            </Link>
          </div>

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pizzas.map((pizza, index) => (
              <motion.article
                key={pizza.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.1 }}
                className="group"
              >
                <Link
                  href="/menu"
                  className="relative block overflow-hidden rounded-2xl bg-[#E8ECF4]"
                >
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="h-65 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-72.5"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-[#F4F6FA] px-3 py-2 text-[9px] font-black tracking-[0.12em] text-[#F06A35]">
                    {pizza.label}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-[#192238]">
                    ★ {pizza.rating}
                  </span>

                  <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F06A35] text-xl text-white shadow-lg transition group-hover:rotate-45">
                    ↗
                  </span>
                </Link>

                <div className="flex items-start justify-between gap-3 pt-5">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.15em] text-[#F06A35]">
                      {pizza.category.toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight">
                      {pizza.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#68738A]">
                      {pizza.vendor} · {pizza.location}
                    </p>
                  </div>

                  <p className="shrink-0 text-xl font-black">
                    ৳{pizza.price}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#DFE4ED] pt-4">
                  <Link
                    href="/menu"
                    className="flex items-center justify-between text-xs font-bold transition hover:text-[#F06A35]"
                  >
                    Explore This Pizza
                    <span>→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why PizzaHub */}
      <section id="about" className="bg-[#151D32] py-24 text-[#F4F6FA]">
        <div className="mx-auto grid max-w-360 gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-14">

          <div>
            <p className="text-[11px] font-black tracking-[0.2em] text-[#FFB45B]">
              WHY CHOOSE PIZZAHUB?
            </p>

            <h2 className="mt-5 text-5xl leading-[1.08] font-black tracking-[-0.065em] sm:text-6xl">
              Great pizza.
              <br />
              More choices.
              <br />
              <span className="font-serif font-medium italic text-[#FFB45B]">
                Better together.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-8 text-white/55">
              PizzaHub connects pizza lovers with local pizza businesses
              through one convenient platform. Discover different menus,
              explore new flavors, and enjoy a simpler way to order your
              favorite food.
            </p>

            <Link
              href="/menu"
              className="mt-9 inline-flex rounded-full bg-[#F06A35] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#D95628]"
            >
              Discover Our Menu ↗
            </Link>
          </div>

          <div className="divide-y divide-white/15 border-y border-white/15">
            {features.map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="grid gap-4 py-8 sm:grid-cols-[70px_1fr] sm:gap-7"
              >
                <p className="text-sm font-black text-[#FFB45B]">
                  / {feature.number}
                </p>

                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/55">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Promotion */}
      <section id="vendor" className="py-24">
        <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-14">
          <div className="grid overflow-hidden rounded-[28px] bg-[#E8ECF4] lg:grid-cols-2">

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-[11px] font-black tracking-[0.2em] text-[#F06A35]">
                GROW YOUR BUSINESS WITH PIZZAHUB
              </p>

              <h2 className="mt-5 text-4xl leading-[1.1] font-black tracking-[-0.06em] sm:text-5xl">
                Your pizza business
                <br />
                deserves to grow.
              </h2>

              <p className="mt-6 max-w-md text-sm leading-8 text-[#68738A]">
                Take your pizza business online with PizzaHub.
                Create your vendor account, showcase your menu,
                manage customer orders, and connect with people
                looking for their next favorite pizza.
              </p>

              <div className="mt-9">
                <Link
                  href="/register"
                  className="inline-flex rounded-full bg-[#F06A35] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#D95628]"
                >
                  Become a Vendor ↗
                </Link>
              </div>
            </div>

            <div className="relative min-h-80 lg:min-h-122.5">
              <img
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1200&q=85"
                alt="Pizza chef preparing a fresh pizza"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-r from-[#E8ECF4]/20 to-transparent" />

              <div className="absolute bottom-7 left-7 rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-[10px] font-black tracking-[0.16em] text-[#F06A35]">
                  JOIN OUR VENDOR COMMUNITY
                </p>
                <p className="mt-1 text-lg font-black">
                  Share your passion for pizza.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#151D32] text-white">
        <div className="mx-auto grid max-w-360 gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-14">

          <div>
            <Link href="/" className="text-3xl font-black tracking-[-0.07em]">
              pizza<span className="text-[#FFB45B]">hub.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-white/50">
              PizzaHub brings pizza lovers and local pizza vendors
              together. Explore different flavors, discover local
              businesses, and enjoy a convenient online ordering experience.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black tracking-[0.15em] text-[#FFB45B]">
              EXPLORE
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/menu" className="hover:text-white">
                Explore Menu
              </Link>
              <a href="#categories" className="hover:text-white">
                Categories
              </a>
              <a href="#about" className="hover:text-white">
                About PizzaHub
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black tracking-[0.15em] text-[#FFB45B]">
              ACCOUNT
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <Link href="/login" className="hover:text-white">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-white">
                Create Account
              </Link>
              <Link href="/register" className="hover:text-white">
                Become a Vendor
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black tracking-[0.15em] text-[#FFB45B]">
              GET IN TOUCH
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <p>Bangladesh</p>
              <a
                href="mailto:support@pizzahub.com"
                className="transition hover:text-white"
              >
                support@pizzahub.com
              </a>
              <a href="#vendor" className="hover:text-white">
                Partner With Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/40">
          © 2026 PizzaHub. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
