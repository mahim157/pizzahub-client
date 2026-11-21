
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  createdAt?: string;
};

type MenuResponse = {
  success: boolean;
  message?: string;
  data?: MenuItem;
};

export default function MenuDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Get all available images
  const getItemImages = (item: MenuItem): string[] => {
    let images: string[] = [];

    if (Array.isArray(item.images)) {
      images = item.images.filter(
        (image) =>
          typeof image === "string" && image.trim() !== ""
      );
    } else if (
      typeof item.images === "string" &&
      item.images.trim()
    ) {
      images = [item.images];
    }

    if (images.length === 0 && item.imageUrl) {
      images = [item.imageUrl];
    }

    return images;
  };

  // Get item name
  const getItemName = (item: MenuItem) =>
    item.itemName || item.name || "Untitled Pizza";

  // Get item location
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

  // Fetch menu item details
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchMenuDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setMenuItem(null);
        setSelectedImage("");

        const response = await fetch(
          `${API_BASE_URL}/api/menu-items/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result: MenuResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to find this menu item."
          );
        }

        setMenuItem(result.data);

        const images = getItemImages(result.data);
        setSelectedImage(images[0] || "");
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

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

    return () => {
      controller.abort();
    };
  }, [id, retry]);

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F4F6FA] px-5">
        <Loader2
          size={42}
          className="animate-spin text-[#F06A35]"
        />

        <p className="mt-5 text-lg font-bold text-[#192238]">
          Loading pizza details...
        </p>

        <p className="mt-2 text-sm text-[#68738A]">
          Please wait while we fetch the information.
        </p>
      </main>
    );
  }

  // Error State
  if (error || !menuItem) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F4F6FA] px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <UtensilsCrossed size={36} />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-[#192238]">
          Menu Item Not Found
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-[#68738A]">
          {error || "This menu item is currently unavailable."}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetry((previous) => previous + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F06A35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#D95628]"
          >
            <RotateCcw size={16} />
            Try Again
          </button>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-xl border border-[#DFE4ED] bg-white px-5 py-3 text-sm font-bold text-[#192238] transition hover:bg-[#F8F9FC]"
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

  return (
    <main className="min-h-screen bg-[#F4F6FA] text-[#192238]">
      {/* Page Header */}
      <section className="bg-[#151D32] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <ArrowLeft size={17} />
            Back to Menu
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#FFB45B]">
              PIZZAHUB MENU
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              {itemName}
            </h1>

            <p className="mt-3 text-sm text-white/60">
              Explore the details of your favorite pizza.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm sm:h-112.5">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={itemName}
                  className="h-full w-full object-cover"
                  onError={() => setSelectedImage("")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#F06A35]">
                  <ImageOff size={64} />

                  <p className="mt-3 text-sm font-medium text-[#68738A]">
                    Image unavailable
                  </p>
                </div>
              )}

              <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-[#192238] shadow-sm">
                {menuItem.category}
              </span>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === image
                        ? "border-[#F06A35]"
                        : "border-transparent"
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

          {/* Pizza Information */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-[#F06A35]">
              MENU ITEM DETAILS
            </span>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              {itemName}
            </h2>

            <div className="mt-5">
              <span className="text-sm font-semibold text-[#68738A]">
                Price
              </span>

              <p className="mt-1 text-3xl font-extrabold text-[#F06A35]">
                {formatPrice(menuItem.price)}
              </p>
            </div>

            <div className="mt-7 border-t border-[#DFE4ED] pt-6">
              <h3 className="text-lg font-bold">
                Description
              </h3>

              <p className="mt-3 text-sm leading-8 text-[#68738A]">
                {menuItem.description ||
                  "No description available for this pizza."}
              </p>
            </div>

            <div className="mt-7 border-t border-[#DFE4ED] pt-6">
              <h3 className="text-lg font-bold">
                Pizza Information
              </h3>

              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1EB] text-[#F06A35]">
                    <Pizza size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#68738A]">
                      Category
                    </p>

                    <p className="mt-1 font-bold">
                      {menuItem.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1EB] text-[#F06A35]">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#68738A]">
                      Vendor Location
                    </p>

                    <p className="mt-1 font-bold">
                      {getItemLocation(menuItem)}
                    </p>
                  </div>
                </div>

                {(menuItem.vendorName || menuItem.businessName) && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1EB] text-[#F06A35]">
                      <UtensilsCrossed size={21} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#68738A]">
                        Vendor
                      </p>

                      <p className="mt-1 font-bold">
                        {menuItem.vendorName || menuItem.businessName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-9">
              <Link
                href="/menu"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F06A35] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#D95628]"
              >
                <ArrowLeft size={17} />
                Explore More Pizzas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
