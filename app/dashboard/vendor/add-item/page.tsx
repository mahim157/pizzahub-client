"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pizza,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Crown,
  Upload,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export default function AddMenuItemPage() {
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError("");
      const headers = await getAuthHeaders(false);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Image upload failed.");
      }

      const uploadedUrl =
        data?.data?.url || data?.url || data?.data?.imageUrl || "";
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not upload image file."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLimitReached(false);

    const numericPrice = Number(price);
    if (itemName.trim().length < 3) {
      setError("Pizza name must be at least 3 characters long.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }
    if (area.trim().length < 2 || city.trim().length < 2) {
      setError("Both Area and City are required (minimum 2 characters).");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Please upload a pizza photo or enter a valid image URL.");
      return;
    }

    try {
      setLoading(true);
      const headers = await getAuthHeaders(true);

      const response = await fetch(`${API_BASE_URL}/api/menu-items`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          itemName: itemName.trim(),
          category,
          price: numericPrice,
          location: {
            area: area.trim(),
            city: city.trim(),
          },
          images: [imageUrl.trim()],
          description: description.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (
          response.status === 403 ||
          result.message?.toLowerCase().includes("limit") ||
          result.message?.toLowerCase().includes("upgrade")
        ) {
          setLimitReached(true);
        }
        const validationMsg = result?.errors?.[0]?.message;
        throw new Error(
          validationMsg || result.message || "Unable to add menu item."
        );
      }

      setSuccess(
        "Pizza submitted successfully! Waiting for admin approval before going live."
      );
      setTimeout(() => {
        router.push("/dashboard/vendor/my-menu");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create menu item."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/vendor/my-menu"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Menu
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          CREATE NEW LISTING
        </span>
        <h1 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
          Add New Pizza to Menu
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Items are reviewed by an admin before going live. Free plan vendors
          can list up to 3 items.
        </p>

        {limitReached && (
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-primary/40 bg-accent p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-extrabold text-foreground">
                  Free Plan Limit Reached (3 Items Max)
                </p>
                <p className="text-muted-foreground">
                  Upgrade to Premium to list unlimited pizzas on PizzaHub.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/vendor/subscription"
              className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-center text-xs font-extrabold text-primary-foreground"
            >
              Upgrade Now
            </Link>
          </div>
        )}

        {error && !limitReached && (
          <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <Pizza className="h-3.5 w-3.5 text-primary" /> Item Name (min 3
                chars) *
              </label>
              <input
                type="text"
                required
                minLength={3}
                placeholder="e.g., Wood-Fired Pepperoni Feast"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium outline-none focus:border-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5 text-primary" /> Price (BDT)
                *
              </label>
              <input
                type="number"
                min="1"
                required
                placeholder="e.g., 550"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Area *
              </label>
              <input
                type="text"
                required
                minLength={2}
                placeholder="e.g., Dhanmondi"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" /> City *
              </label>
              <input
                type="text"
                required
                minLength={2}
                placeholder="e.g., Dhaka"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5 text-primary" /> Pizza Image
              (Upload or URL) *
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
              />
              <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 text-xs font-extrabold transition hover:border-primary">
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Upload className="h-4 w-4 text-primary" />
                )}
                <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" /> Description
              (min 10 chars) *
            </label>
            <textarea
              rows={4}
              required
              minLength={10}
              placeholder="Describe crust style, cheese blend, toppings, and portion size..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-4 text-sm font-medium outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting Item...
              </>
            ) : (
              "Publish Pizza to Menu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
