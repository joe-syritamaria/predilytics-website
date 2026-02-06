"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function EnterpriseCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

    if (previewMode) {
      return;
    }

    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      router.replace("/sign-in?redirect_url=/enterprise/checkout");
      return;
    }

    let cancelled = false;

    async function startCheckout() {
      setError(null);

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBase) {
        setError("Missing API base URL.");
        return;
      }

      const orgRes = await fetch("/api/me/org");
      if (orgRes.status === 404) {
        router.replace("/enterprise/onboarding");
        return;
      }

      if (!orgRes.ok) {
        const data = await orgRes.json().catch(() => ({}));
        const message = data?.error ? `Org check failed: ${data.error}` : "Unable to verify organization.";
        setError(message);
        return;
      }

      const token = await getToken();
      if (!token) {
        setError("Unable to authenticate.");
        return;
      }

      const currency = (searchParams.get("currency") || "").trim().toUpperCase();

      const checkoutRes = await fetch(`${apiBase}/stripe/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currency ? { currency } : {}),
      });
      if (checkoutRes.status === 409) {
        router.replace("/enterprise/onboarding");
        return;
      }
      if (!checkoutRes.ok) {
        const data = await checkoutRes.json().catch(() => ({}));
        setError(data?.error ?? "Failed to start checkout.");
        return;
      }

      const data = await checkoutRes.json();
      if (!data?.url) {
        setError("Stripe did not return a checkout URL.");
        return;
      }

      if (!cancelled) {
        window.location.href = data.url;
      }
    }

    startCheckout();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Preparing checkout…</h1>
        <p className="mt-2 text-sm text-slate-600">
          We are verifying your organization and starting the secure payment flow.
        </p>
        {!isLoaded ? (
          <p className="mt-6 text-sm text-slate-500">Loading your session…</p>
        ) : null}
        {error ? (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        ) : null}
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in?redirect_url=/enterprise/checkout" })}
          className="mt-6 w-full rounded-xl border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
