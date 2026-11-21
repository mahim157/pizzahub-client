"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Crown, ArrowRight, Loader2 } from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }
      try {
        const headers = await getAuthHeaders(true);
        await fetch(
          `${API_BASE_URL}/api/subscriptions/verify-session?session_id=${encodeURIComponent(
            sessionId
          )}`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        );
      } catch {
        // Webhook handles verification asynchronously if endpoint differs
      } finally {
        setVerifying(false);
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        {verifying ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <CheckCircle2 className="h-9 w-9" />
        )}
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent-foreground">
        <Crown className="h-3.5 w-3.5 text-primary" /> Payment Confirmed
      </span>

      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
        Welcome to Premium Kitchen!
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Your Stripe subscription payment was successful. Your kitchen now
        unlocks unlimited pizza listings and priority featured visibility.
      </p>

      {sessionId && (
        <div className="mt-5 rounded-2xl border border-border bg-secondary/60 px-4 py-2.5 text-xs text-muted-foreground">
          Session ID:{" "}
          <span className="font-mono font-semibold text-foreground">
            {sessionId.slice(0, 24)}...
          </span>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground transition hover:opacity-90"
        >
          Back to Vendor Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-5 py-16">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 text-sm font-semibold">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Confirming subscription...</span>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
