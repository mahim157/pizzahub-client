"use client";

import { useEffect, useState } from "react";
import { User, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function CustomerProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; image?: string }
    | undefined;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setSaving(true);
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          ACCOUNT PREFERENCES
        </span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          Profile Settings
        </h1>
      </div>

      <form
        onSubmit={handleUpdate}
        className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8"
      >
        {message && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Email Address (Read-only)
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
            <User className="h-3.5 w-3.5 text-primary" /> Full Name *
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
            <ImageIcon className="h-3.5 w-3.5 text-primary" /> Avatar Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/avatar.jpg"
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
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
