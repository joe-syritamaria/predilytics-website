"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingPortalPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function openPortal() {
      setError(null);

      const res = await fetch("/api/stripe/portal", { method: "POST" });

      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        if (data?.code === "no_subscription") {
          router.replace("/billing/no-subscription");
          return;
        }
        router.replace("/enterprise/onboarding");
        return;
      }

      if (!res.ok) {
        setError(data?.error ?? "Unable to open billing portal.");
        return;
      }
      if (!data?.url) {
        setError("Stripe did not return a portal URL.");
        return;
      }

      if (!cancelled) {
        window.location.href = data.url;
      }
    }

    openPortal();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Opening billing portal...</h1>
        <p className="mt-2 text-sm text-slate-600">
          We are redirecting you to manage your subscription.
        </p>
        {error ? (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
