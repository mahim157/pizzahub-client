"use client";

import { useEffect, useState } from "react";
import { Crown, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

export default function VendorSubscriptionPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as Record<string, unknown> | undefined;

  const checkPremium = (obj: Record<string, unknown> | undefined | null) => {
    if (!obj) return false;
    const sub = obj.subscription as Record<string, unknown> | undefined;
    return Boolean(
      obj.isPremium === true ||
        obj.isSubscribed === true ||
        obj.plan === "premium" ||
        obj.subscriptionPlan === "premium" ||
        obj.subscriptionStatus === "active" ||
        obj.status === "active" ||
        sub?.status === "active" ||
        sub?.isPremium === true
    );
  };

  const [isPremium, setIsPremium] = useState<boolean>(checkPremium(user));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkPremium(user)) {
      setIsPremium(true);
    }

    const fetchSubscriptionStatus = async () => {
      try {
        const headers = await getAuthHeaders(true);
        const endpoints = [
          `${API_BASE_URL}/api/subscriptions/status`,
          `${API_BASE_URL}/api/subscriptions/my-subscription`,
          `${API_BASE_URL}/api/users/me`,
        ];

        for (const url of endpoints) {
          const res = await fetch(url, { headers, credentials: "include" });
          if (res.ok) {
            const raw = await res.json();
            const payload = (raw?.data || raw) as Record<string, unknown>;
            if (checkPremium(payload)) {
              setIsPremium(true);
              break;
            }
          }
        }
      } catch {
        // Fallback to session state
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders(true);
      const res = await fetch(
        `${API_BASE_URL}/api/subscriptions/checkout-session`,
        {
          method: "POST",
          headers,
          credentials: "include",
        }
      );
      const data = await res.json();
      const checkoutUrl =
        data?.url ||
        data?.checkoutUrl ||
        data?.sessionUrl ||
        data?.data?.url ||
        data?.data?.checkoutUrl ||
        data?.data?.sessionUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      alert(data?.message || "Stripe checkout session could not be created.");
    } catch {
      alert("Unable to connect to payment service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          VENDOR MEMBERSHIP
        </span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          Subscription &amp; Growth Plans
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scale your pizzeria with unlimited menu items and priority featured
          badges.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8">
          <div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold">
              STARTER
            </span>
            <h2 className="mt-4 text-2xl font-extrabold">Free Plan</h2>
            <p className="mt-1 text-3xl font-extrabold">
              ৳0{" "}
              <span className="text-sm font-medium text-muted-foreground">
                / forever
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> List up to 3
                menu items
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Accept or
                reject customer orders
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Standard
                kitchen profile
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              type="button"
              disabled
              className="w-full rounded-full border border-border bg-secondary py-3 text-sm font-bold text-muted-foreground"
            >
              {isPremium ? "Included" : "Current Active Plan"}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border-2 border-primary bg-card p-8 shadow-md">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> MOST POPULAR
            </span>
            <h2 className="mt-4 text-2xl font-extrabold">Premium Kitchen</h2>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              Premium{" "}
              <span className="text-sm font-medium text-muted-foreground">
                / Stripe Subscription
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited
                pizza &amp; side listings
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Gold Premium
                Kitchen badge on cards
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Priority
                visibility on menu
              </li>
            </ul>
          </div>

          <div className="mt-8">
            {isPremium ? (
              <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-500/15 py-3.5 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                <Crown className="h-4 w-4" /> Premium Plan Active
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to
                    Stripe...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4" /> Upgrade via Stripe
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
