import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-500">
          <XCircle className="h-9 w-9" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">
          Checkout Cancelled
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          No charges were made to your card. You can upgrade your kitchen to
          Premium anytime from your Vendor Dashboard.
        </p>

        <div className="mt-8">
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Subscription Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
