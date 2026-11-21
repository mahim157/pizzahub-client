"use client";

import { useEffect, useState } from "react";
import {
  User,
  Store,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function VendorProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | {
        name?: string;
        email?: string;
        image?: string;
        businessName?: string;
        subscriptionPlan?: string;
        isPremium?: boolean;
      }
    | undefined;

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBusinessName(user.businessName || "");
      setImage(user.image || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setSaving(true);
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
        ...(businessName.trim() ? { businessName: businessName.trim() } : {}),
      } as Record<string, unknown>);
      setMessage({
        type: "success",
        text: "Vendor profile updated successfully!",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const isPremium =
    user?.isPremium || user?.subscriptionPlan?.toLowerCase() === "premium";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            KITCHEN & ACCOUNT SETTINGS
          </span>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Vendor Profile Settings
          </h1>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider ${
            isPremium
              ? "border-primary/40 bg-primary/15 text-primary"
              : "border-border bg-card text-muted-foreground"
          }`}
        >
          <Crown className="h-3.5 w-3.5" />
          {isPremium ? "Premium Plan" : "Free Plan"}
        </span>
      </div>

      <form
        onSubmit={handleUpdate}
        className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8"
      >
        {message && (
          <div
            className={`flex items-center gap-2 rounded-2xl border p-3.5 text-sm font-semibold ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Registered Email (Read-only)
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="h-12 w-full rounded-xl border border-input bg-secondary px-4 text-sm text-muted-foreground"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            <Store className="h-3.5 w-3.5 text-primary" /> Restaurant / Business Name
          </label>
          <input
            type="text"
            placeholder="e.g., Woodfire Artisan Pizzeria"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary" /> Owner / Manager Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            <ImageIcon className="h-3.5 w-3.5 text-primary" /> Kitchen Logo / Avatar URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/kitchen-logo.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-extrabold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            "Save Vendor Profile"
          )}
        </button>
      </form>
    </div>
  );
}
